import logging
from datetime import datetime
from datetime import timedelta, timezone
from uuid import uuid4
from database import get_supabase
from processing import (
    process_signals_batch,
    generate_embeddings,
    l2_normalize,
    find_best_cluster,
    update_cluster_centroid,
    calculate_intelligence_score,
)
from processing.gemini_client import generate_market_thesis

logger = logging.getLogger(__name__)


def _table(name: str):
    return get_supabase().table(name)


def process_ai_intelligence(limit: int = 40):
    """Handles Sentiment, Summarization, and Topics using Gemini"""
    response = _table("signals").select("*").limit(limit).execute()
    unprocessed = response.data or []
    if not unprocessed:
        logger.info("No signals found for AI analysis")
        return

    logger.info(f"Processing {len(unprocessed)} signals for AI analysis")
    signals_data = [
        {
            "external_id": s["external_id"],
            "title": s.get("title") or "",
            "content": s.get("content", ""),
        }
        for s in unprocessed
    ]

    ai_results = process_signals_batch(signals_data)

    for result in ai_results:
        ext_id = result.get("external_id")
        if not ext_id:
            continue

        ai_sentiment = result.get("sentiment")
        sentiment_map = {"Positive": 1.0, "Neutral": 0.0, "Negative": -1.0}
        _table("signals").update(
            {
                "ai_summary": result.get("summary"),
                "ai_sentiment": ai_sentiment,
                "ai_topics": result.get("topics") or [],
                "sentiment_score": sentiment_map.get(ai_sentiment, 0.0),
                "updated_at": datetime.utcnow().isoformat(),
            }
        ).eq("external_id", ext_id).execute()


def process_semantic_clustering(limit: int = 20):
    """Generates embeddings and assigns clusters"""
    response = _table("signals").select("*").order("time", desc=True).limit(limit * 5).execute()
    signals = response.data or []
    no_embeddings = [
        s for s in signals if not s.get("embedding_vector")
    ][:limit]
    if not no_embeddings:
        logger.info("No signals found for semantic clustering")
        return

    logger.info(f"Generating embeddings for {len(no_embeddings)} signals")
    texts = [
        f"{s.get('title') or ''}. {s.get('ai_summary') or ''}"
        for s in no_embeddings
    ]
    vectors = generate_embeddings(texts)

    for sig, vector in zip(no_embeddings, vectors):
        normalized_v = l2_normalize(vector)
        vector_str = f"[{','.join(map(str, normalized_v))}]"
        updates = {
            "embedding_vector": vector_str,
            "updated_at": datetime.utcnow().isoformat(),
        }

        cluster_id, similarity = find_best_cluster(normalized_v)

        if cluster_id:
            logger.info(
                f"Signal {sig['external_id']} matched cluster {cluster_id} (sim: {similarity:.2f})"
            )
            updates["cluster_id"] = cluster_id
            update_cluster_centroid(cluster_id, sig)
        else:
            new_cluster_id = str(uuid4())
            vector_str = f"[{','.join(map(str, normalized_v))}]"
            _table("clusters").insert(
                {
                    "id": new_cluster_id,
                    "name": (sig.get("title") or "New Intelligence Sector")[:50],
                    "embedding_centroid": vector_str,
                    "primary_tags": sig.get("ai_topics") or [],
                    "total_signals": 1,
                    "total_startups": 1 if sig.get("type") == "startup" else 0,
                    "total_discussions": 1 if sig.get("type") == "discussion" else 0,
                }
            ).execute()
            updates["cluster_id"] = new_cluster_id
            logger.info(
                f"Created new cluster {new_cluster_id} for signal {sig['external_id']}"
            )


        _table("signals").update(updates).eq("id", sig["id"]).execute()


def refresh_intelligence_scores(time_window_hours: int = 48):
    """Recalculates scores to account for time decay"""
    threshold = datetime.now(timezone.utc) - timedelta(hours=time_window_hours)
    response = (
        _table("signals")
        .select("id, score, time, sentiment_score, platform")
        .gte("time", threshold.isoformat())
        .execute()
    )
    recent_signals = response.data or []

    logger.info(f"Updating intelligence scores for {len(recent_signals)} signals")
    for sig in recent_signals:
        published_at = sig.get("time")
        if isinstance(published_at, str):
            published_at = datetime.fromisoformat(published_at.replace("Z", "+00:00"))

        total_score = calculate_intelligence_score(
            score=sig.get("score") or 0,
            published_at=published_at,
            sentiment_score=sig.get("sentiment_score") or 0.0,
            platform=sig.get("platform") or "generic",
        )
        _table("signals").update({"total_score": total_score}).eq("id", sig["id"]).execute()


def refresh_cluster_metrics():
    """Aggregates signal scores into cluster-level metadata via database RPC"""
    logger.info("Refreshing cluster metrics via SQL RPC...")
    try:
        get_supabase().rpc("refresh_all_cluster_metrics", {}).execute()
        logger.info("Cluster metrics refreshed successfully.")
    except Exception as e:
        logger.error(f"Error refreshing cluster metrics: {e}")


def generate_cluster_theses(limit: int = 5):
    """
    Identifies high-signal clusters lacking a market thesis and generates one via Gemini.
    """
    # Find top clusters (by signal count or momentum) that lack a thesis
    response = (
        _table("clusters")
        .select("*")
        .is_("market_thesis", "null")
        .order("total_signals", desc=True)
        .limit(limit)
        .execute()
    )
    clusters = response.data or []
    if not clusters:
        logger.info("No clusters need a market thesis right now.")
        return

    logger.info(f"Generating theses for {len(clusters)} clusters")
    for cluster in clusters:
        # Fetch top signals for context
        sig_response = (
            _table("signals")
            .select("title, ai_summary")
            .eq("cluster_id", cluster["id"])
            .order("total_score", desc=True)
            .limit(10)
            .execute()
        )
        signals = sig_response.data or []
        context_lines = []
        for s in signals:
            context_lines.append(f"- {s.get('title')}: {s.get('ai_summary')}")
        context_str = "\n".join(context_lines)

        tags = cluster.get("primary_tags") or []
        name = cluster.get("name") or "Unknown Trend"

        thesis = generate_market_thesis(name, tags, context_str)
        if thesis:
            _table("clusters").update({"market_thesis": thesis}).eq("id", cluster["id"]).execute()
            logger.info(f"Successfully generated and saved thesis for cluster {cluster['id']}")
        else:
            logger.warning(f"Failed to generate thesis for cluster {cluster['id']}")
