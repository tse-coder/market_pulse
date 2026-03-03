from ingestion import fetch_hackernews, fetch_producthunt, fetch_reddit
from database import save_hacker_news, save_product_hunt, connect
from database.models.signal import Signal
from processing.gemini_client import process_signals_batch
from processing.trend_scoring import calculate_trend_score
import logging
from datetime import datetime, timedelta

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

                # Calculate initial trend score
                sig.trend_score = calculate_trend_score(sig.score or 0, sig.time)
                sig.save()

        logger.info("Completed AI processing and initial scoring")

    # 2. Re-score recent signals (last 48 hours) to account for time decay
    recent_signals = Signal.objects(time__gte=datetime.utcnow() - timedelta(hours=48))
    logger.info(f"Updating scores for {len(recent_signals)} recent signals")
    for sig in recent_signals:
        sig.trend_score = calculate_trend_score(sig.score or 0, sig.time)
        sig.save()

    logger.info("Pipeline completed")


if __name__ == "__main__":
    run_pipeline()
