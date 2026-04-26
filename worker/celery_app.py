import os
from celery import Celery
from celery.schedules import crontab

REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")

celery_app = Celery(
    "market_pulse",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=["tasks"]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    worker_max_tasks_per_child=100,
)

# Configure Celery Beat schedule
celery_app.conf.beat_schedule = {
    "ingest-sources-every-10-mins": {
        "task": "tasks.ingest_all_sources",
        "schedule": 600.0, # Every 10 minutes
    },
    "process-ai-every-2-mins": {
        "task": "tasks.process_ai",
        "schedule": 120.0, # Every 2 minutes
    },
    "cluster-signals-every-3-mins": {
        "task": "tasks.cluster_signals",
        "schedule": 180.0,
    },
    "refresh-metrics-every-5-mins": {
        "task": "tasks.refresh_metrics",
        "schedule": 300.0,
    },
}
