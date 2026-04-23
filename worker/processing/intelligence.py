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
        updates = {
            "embedding_vector": normalized_v,
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
            _table("clusters").insert(
                {
                    "id": new_cluster_id,
                    "name": (sig.get("title") or "New Intelligence Sector")[:50],
                    "embedding_centroid": normalized_v,
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
    """Aggregates signal scores into cluster-level metadata"""
    response = _table("clusters").select("id, name").execute()
    clusters = response.data or []
    logger.info(f"Refreshing metrics for {len(clusters)} clusters")

    for cluster in clusters:
        cluster_id = cluster["id"]
        signal_response = (
            _table("signals")
            .select("sentiment_score, total_score")
            .eq("cluster_id", cluster_id)
            .execute()
        )
        signals = signal_response.data or []
        if not signals:
            continue

        # 1. Average Sentiment
        sentiments = [
            s["sentiment_score"] for s in signals if s.get("sentiment_score") is not None
        ]
        avg_sentiment = sum(sentiments) / len(sentiments) if sentiments else 0.0

        # 2. Momentum & Intelligence Score
        # Cluster intelligence is average of underlying signal total_scores
        scores = [s.get("total_score") for s in signals if (s.get("total_score") or 0) > 0]
        momentum_score = sum(scores) / len(scores) if scores else 0.0

        # 3. Pain vs Opportunity
        # High Negative sentiment signals indicate "Pain"
        pain_signals = len([s for s in signals if (s.get("sentiment_score") or 0) < -0.1])
        pain_score = (pain_signals / len(signals)) * 100

        # Opportunity is high momentum + positive sentiment
        opportunity_score = (momentum_score * (1 + avg_sentiment)) / 2

        _table("clusters").update(
            {
                "avg_sentiment": avg_sentiment,
                "momentum_score": momentum_score,
                "pain_score": pain_score,
                "opportunity_score": opportunity_score,
                "updated_at": datetime.utcnow().isoformat(),
            }
        ).eq("id", cluster_id).execute()
        logger.info(f"Updated metrics for cluster: {cluster.get('name')}")
