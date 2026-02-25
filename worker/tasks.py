from ingestion import fetch_hackernews, fetch_producthunt, fetch_reddit
from database import save_hacker_news, save_product_hunt,connect
import logging
import pprint

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_pipeline():
    logger.info("Starting ingestion and processing pipeline")
    # connect to db
    connect()
    # 1. Ingestion
    reddit_posts = fetch_reddit()
    hn_posts = fetch_hackernews()
    ph_posts = fetch_producthunt()

    # save the posts to the database
    save_hacker_news(hn_posts)
    save_product_hunt(ph_posts)
    logger.info("Saved posts to the database")
    # pretty print the posts fetched
    pprint.pprint(reddit_posts)
    pprint.pprint(hn_posts)
    pprint.pprint(ph_posts)

    # # 2. Embeddings
    # embeddings = generate_embeddings([p["content"] for p in posts])
    
    # # 3. Clustering
    # clusters = cluster_signals(embeddings)
    
    # # 4. Scoring
    # score = calculate_trend_score(clusters)
    
    # logger.info(f"Pipeline completed. Computed trend score: {score}")

if __name__ == "__main__":
    run_pipeline()
