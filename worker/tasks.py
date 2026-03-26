import logging
from database import connect, save_hacker_news, save_product_hunt
from ingestion import fetch_hackernews, fetch_producthunt
from processing import (
    process_ai_intelligence,
    process_semantic_clustering,
    refresh_intelligence_scores,
    refresh_cluster_metrics,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def run_pipeline():
    logger.info("Starting ingestion and processing pipeline")
    # connect to db
    connect()

    # Ingestion
    hn_posts = fetch_hackernews(limit=40)
    save_hacker_news(hn_posts)

    ph_posts = fetch_producthunt(limit=40)
    save_product_hunt(ph_posts)

    # AI Processing
    process_ai_intelligence(limit=80)

    # Semantic Clustering
    process_semantic_clustering(limit=80)

    # Time-Decay Score Refresh
    refresh_intelligence_scores(time_window_hours=48)

    # Refresh Cluster Aggregate Metrics
    refresh_cluster_metrics()

    logger.info("pipeline completed")


if __name__ == "__main__":
    run_pipeline()
