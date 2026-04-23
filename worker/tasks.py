import logging
from database import connect, save_hacker_news, save_product_hunt, save_stack_overflow
from ingestion import fetch_hackernews, fetch_producthunt, fetch_stackoverflow
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

    # hn_posts = fetch_hackernews(limit=40)
    # save_hacker_news(hn_posts)

    # ph_posts = fetch_producthunt(limit=40)
    # save_product_hunt(ph_posts)

    # so_posts = fetch_stackoverflow(limit=40)
    # save_stack_overflow(so_posts)

    # # AI Processing
    # process_ai_intelligence(limit=120)

    # Semantic Clustering
    process_semantic_clustering(limit=120)

    # Time-Decay Score Refresh
    # refresh_intelligence_scores(time_window_hours=48)

    # Refresh Cluster Aggregate Metrics
    refresh_cluster_metrics()

    logger.info("pipeline completed")


if __name__ == "__main__":
    run_pipeline()
