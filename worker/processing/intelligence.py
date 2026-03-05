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

            # Map sentiment string to float score
            sentiment_map = {"Positive": 1.0, "Neutral": 0.0, "Negative": -1.0}
            sig.sentiment_score = sentiment_map.get(sig.ai_sentiment, 0.0)

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
            update_cluster_centroid(cluster_id, sig)
        else:
            new_cluster = Cluster(
                name=sig.title[:50] if sig.title else "New Intelligence Sector",
                embedding_centroid=normalized_v,
                primary_tags=sig.ai_topics or [],
                total_signals=1,
                total_startups=1 if sig.type == "startup" else 0,
                total_discussions=1 if sig.type == "discussion" else 0,
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


def refresh_cluster_metrics():
    """Aggregates signal scores into cluster-level metadata"""
    clusters = Cluster.objects()
    logger.info(f"Refreshing metrics for {len(clusters)} clusters")

    for cluster in clusters:
        signals = Signal.objects(cluster_id=str(cluster.id))
        if not signals:
            continue

        # 1. Average Sentiment
        sentiments = [
            s.sentiment_score for s in signals if s.sentiment_score is not None
        ]
        cluster.avg_sentiment = sum(sentiments) / len(sentiments) if sentiments else 0.0

        # 2. Momentum & Intelligence Score
        # Cluster intelligence is average of underlying signal total_scores
        scores = [s.total_score for s in signals if s.total_score > 0]
        cluster.momentum_score = sum(scores) / len(scores) if scores else 0.0

        # 3. Pain vs Opportunity
        # High Negative sentiment signals indicate "Pain"
        pain_signals = signals(sentiment_score__lt=-0.1).count()
        cluster.pain_score = (pain_signals / len(signals)) * 100

        # Opportunity is high momentum + positive sentiment
        cluster.opportunity_score = (
            cluster.momentum_score * (1 + cluster.avg_sentiment)
        ) / 2

        cluster.updated_at = datetime.utcnow()
        cluster.save()
        logger.info(f"Updated metrics for cluster: {cluster.name}")
