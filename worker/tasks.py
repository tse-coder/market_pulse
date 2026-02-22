from ingestion.reddit import fetch_latest_posts as fetch_reddit
from ingestion.hacker_news import fetch_latest_posts as fetch_hackernews
from processing.embeddings import generate_embeddings
from processing.clustering import cluster_signals
from processing.trend_scoring import calculate_trend_score
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_pipeline():
    logger.info("Starting ingestion and processing pipeline")
    
    # 1. Ingestion
    posts = fetch_reddit()
    hn_posts = fetch_hackernews()
    posts.extend(hn_posts)
    logger.info(f"Ingested {len(posts)} posts total")
    
    # 2. Embeddings
    embeddings = generate_embeddings([p["content"] for p in posts])
    
    # 3. Clustering
    clusters = cluster_signals(embeddings)
    
    # 4. Scoring
    score = calculate_trend_score(clusters)
    
    logger.info(f"Pipeline completed. Computed trend score: {score}")

if __name__ == "__main__":
    run_pipeline()
