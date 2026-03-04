from ingestion import (
    fetch_reddit,
)  # Still might be used if run_pipeline is expanded, but let's keep it minimal for now if they really are unused
from database import connect
from database.models.signal import Signal
from processing.gemini_client import process_signals_batch
from processing.trend_scoring import calculate_intelligence_score
import logging
from datetime import datetime, timedelta, timezone

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def run_pipeline():
    logger.info("Starting ingestion and processing pipeline")
    # connect to db
    connect()

    # 1. AI Processing (Gemini) & Scoring
    unprocessed = Signal.objects().limit(40)
    if unprocessed:
        logger.info(f"Processing {len(unprocessed)} signals")
        signals_data = [
            {"external_id": s.external_id, "title": s.title or "", "content": s.content}
            for s in unprocessed
        ]

        ai_results = process_signals_batch(signals_data)

        # Map results back to signals
        for result in ai_results:
            ext_id = result.get("external_id")
            sig = Signal.objects(external_id=ext_id).first()
            if sig:
                sig.ai_summary = result.get("summary")
                sig.ai_sentiment = result.get("sentiment")
                sig.ai_topics = result.get("topics", [])
                sig.cluster_id = result.get("cluster_id")

                # Calculate sophisticated total intelligence score
                sig.total_score = calculate_intelligence_score(
                    score=sig.score or 0,
                    published_at=sig.time,
                    sentiment_score=sig.sentiment_score or 0.0,
                    platform=sig.platform,
                )
                sig.save()

        logger.info("Completed AI processing and multi-factor scoring")

    # 2. Re-score recent signals (last 48 hours) to account for time decay
    now_utc = datetime.now(timezone.utc).replace(
        tzinfo=None
    )  # Keep parity with naive UTC stored in MongoEngine
    recent_signals = Signal.objects(time__gte=now_utc - timedelta(hours=48))
    logger.info(f"Updating intelligence scores for {len(recent_signals)} signals")
    for sig in recent_signals:
        sig.total_score = calculate_intelligence_score(
            score=sig.score or 0,
            published_at=sig.time,
            sentiment_score=sig.sentiment_score or 0.0,
            platform=sig.platform,
        )
        sig.save()

    logger.info("Intelligence pipeline completed")


if __name__ == "__main__":
    run_pipeline()
