import logging
from celery_app import celery_app
from database import connect, save_hacker_news, save_product_hunt, save_stack_overflow, save_dev_to, save_github
from ingestion import fetch_hackernews, fetch_producthunt, fetch_stackoverflow, fetch_dev_to, fetch_github
from processing import (
    process_ai_intelligence,
    process_semantic_clustering,
    refresh_intelligence_scores,
    refresh_cluster_metrics,
    generate_cluster_theses,
)
import requests
import os

logger = logging.getLogger(__name__)

# Base initialization for Celery worker processes
@celery_app.task(bind=True, max_retries=3)
def fetch_hackernews_task(self):
    connect()
    try:
        posts = fetch_hackernews(limit=40)
        save_hacker_news(posts)
        logger.info("HN ingestion complete")
    except Exception as exc:
        logger.error(f"HN ingestion failed: {exc}")
        raise self.retry(exc=exc, countdown=60)

@celery_app.task(bind=True, max_retries=3)
def fetch_producthunt_task(self):
    connect()
    try:
        posts = fetch_producthunt(limit=40)
        save_product_hunt(posts)
        logger.info("PH ingestion complete")
    except Exception as exc:
        logger.error(f"PH ingestion failed: {exc}")
        raise self.retry(exc=exc, countdown=60)

@celery_app.task(bind=True, max_retries=3)
def fetch_stackoverflow_task(self):
    connect()
    try:
        posts = fetch_stackoverflow(limit=40)
        save_stack_overflow(posts)
        logger.info("SO ingestion complete")
    except Exception as exc:
        logger.error(f"SO ingestion failed: {exc}")
        raise self.retry(exc=exc, countdown=60)

@celery_app.task(bind=True, max_retries=3)
def fetch_dev_to_task(self):
    connect()
    try:
        posts = fetch_dev_to(limit=40)
        save_dev_to(posts)
        logger.info("Dev.to ingestion complete")
    except Exception as exc:
        logger.error(f"Dev.to ingestion failed: {exc}")
        raise self.retry(exc=exc, countdown=60)

@celery_app.task(bind=True, max_retries=3)
def fetch_github_task(self):
    connect()
    try:
        posts = fetch_github(limit=40)
        save_github(posts)
        logger.info("GitHub ingestion complete")
    except Exception as exc:
        logger.error(f"GitHub ingestion failed: {exc}")
        raise self.retry(exc=exc, countdown=60)


@celery_app.task
def ingest_all_sources():
    """Trigger all ingestion tasks concurrently."""
    fetch_hackernews_task.delay()
    fetch_producthunt_task.delay()
    fetch_stackoverflow_task.delay()
    fetch_dev_to_task.delay()
    fetch_github_task.delay()


@celery_app.task(bind=True, max_retries=3)
def process_ai(self):
    connect()
    try:
        # Batch size can be increased now that it runs independently
        process_ai_intelligence(limit=100)
    except Exception as exc:
        logger.error(f"AI processing failed: {exc}")
        # Back off exponentially if API is rate limited
        raise self.retry(exc=exc, countdown=2 ** self.request.retries * 60)


@celery_app.task(bind=True, max_retries=3)
def cluster_signals(self):
    connect()
    try:
        process_semantic_clustering(limit=100)
    except Exception as exc:
        logger.error(f"Clustering failed: {exc}")
        raise self.retry(exc=exc, countdown=60)


@celery_app.task
def refresh_metrics():
    connect()
    try:
        refresh_cluster_metrics()
    except Exception as exc:
        logger.error(f"Metrics refresh failed: {exc}")

@celery_app.task(bind=True, max_retries=3)
def generate_market_theses_task(self):
    connect()
    try:
        generate_cluster_theses(limit=5)
    except Exception as exc:
        logger.error(f"Thesis generation failed: {exc}")
        raise self.retry(exc=exc, countdown=60)

@celery_app.task
def broadcast_weekly_intel():
    """
    Fetches the highest momentum cluster and pushes a summary to a webhook.
    """
    connect()
    from database import get_supabase
    
    try:
        webhook_url = os.environ.get("ALERT_WEBHOOK_URL")
        if not webhook_url:
            logger.warning("ALERT_WEBHOOK_URL not set, skipping broadcast.")
            return

        # Fetch top cluster by total signals (or momentum if calculated)
        response = (
            get_supabase().table("clusters")
            .select("name, primary_tags, market_thesis, total_signals")
            .order("total_signals", desc=True)
            .limit(1)
            .execute()
        )
        top_cluster = response.data[0] if response.data else None

        if top_cluster:
            tags_str = ", ".join(top_cluster.get("primary_tags") or [])
            message = {
                "content": f"🚀 **Top Market Trend This Week**: {top_cluster.get('name')}\n"
                           f"**Tags**: {tags_str} | **Signals**: {top_cluster.get('total_signals')}\n"
                           f"**Thesis**: {top_cluster.get('market_thesis') or 'Not generated yet.'}\n"
            }
            res = requests.post(webhook_url, json=message)
            res.raise_for_status()
            logger.info("Successfully broadcasted weekly intel.")
        else:
            logger.info("No clusters found to broadcast.")
    except Exception as exc:
        logger.error(f"Broadcast failed: {exc}")

