import logging
from datetime import datetime
from database import Cluster, Signal
from processing import (
    process_signals_batch,
    generate_embeddings,
    l2_normalize,
    find_best_cluster,
    update_cluster_centroid,
    calculate_intelligence_score,
)

logger = logging.getLogger(__name__)


def process_ai_intelligence(limit: int = 40):
    """Handles Sentiment, Summarization, and Topics using Gemini"""
    unprocessed = Signal.objects().limit(limit)
    if not unprocessed:
        logger.info("No signals found for AI analysis")
        return

    logger.info(f"Processing {len(unprocessed)} signals for AI analysis")
    signals_data = [
        {"external_id": s.external_id, "title": s.title or "", "content": s.content}
        for s in unprocessed
    ]

    ai_results = process_signals_batch(signals_data)

    for result in ai_results:
        ext_id = result.get("external_id")
        sig = Signal.objects(external_id=ext_id).first()
        if sig:
            sig.ai_summary = result.get("summary")
            sig.ai_sentiment = result.get("sentiment")
            sig.ai_topics = result.get("topics", [])
            sig.updated_at = datetime.utcnow()
            sig.save()


def process_semantic_clustering(limit: int = 20):
    """Generates embeddings and assigns clusters"""
    no_embeddings = Signal.objects(embedding_vector__size=0).limit(limit)
    if not no_embeddings:
        logger.info("No signals found for semantic clustering")
        return

    logger.info(f"Generating embeddings for {len(no_embeddings)} signals")
    texts = [f"{s.title}\n{s.content}" for s in no_embeddings]
    vectors = generate_embeddings(texts)

    for sig, vector in zip(no_embeddings, vectors):
        normalized_v = l2_normalize(vector)
        sig.embedding_vector = normalized_v

        cluster_id, similarity = find_best_cluster(normalized_v)

        if cluster_id:
            logger.info(
                f"Signal {sig.external_id} matched cluster {cluster_id} (sim: {similarity:.2f})"
            )
            sig.cluster_id = cluster_id
            update_cluster_centroid(cluster_id, normalized_v)
        else:
            new_cluster = Cluster(
                name=sig.title[:50] if sig.title else "New Intelligence Sector",
                embedding_centroid=normalized_v,
                primary_tags=sig.ai_topics or [],
            ).save()
            sig.cluster_id = str(new_cluster.id)
            logger.info(
                f"Created new cluster {new_cluster.id} for signal {sig.external_id}"
            )

        sig.updated_at = datetime.utcnow()
        sig.save()


def refresh_intelligence_scores(time_window_hours: int = 48):
    """Recalculates scores to account for time decay"""
    from datetime import timedelta, timezone

    threshold = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(
        hours=time_window_hours
    )
    recent_signals = Signal.objects(time__gte=threshold)

    logger.info(f"Updating intelligence scores for {len(recent_signals)} signals")
    for sig in recent_signals:
        sig.total_score = calculate_intelligence_score(
            score=sig.score or 0,
            published_at=sig.time,
            sentiment_score=sig.sentiment_score or 0.0,
            platform=sig.platform,
        )
        sig.save()
