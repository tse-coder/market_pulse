from .connect import connect
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def _upsert_signal(payload: dict):
    client = connect()
    response = (
        client.table("signals")
        .upsert(payload, on_conflict="external_id")
        .execute()
    )
    if getattr(response, "error", None):
        raise RuntimeError(str(response.error))


def save_hacker_news(posts):
    """
    Saves the fetched posts to the database.
    """
    for post in posts:
        raw_time = post.get("time")
        try:
            parsed_time = datetime.utcfromtimestamp(int(raw_time))
        except Exception:
            parsed_time = datetime.utcnow()

        signal_payload = {
            "platform": "hacker_news",
            "external_id": str(post["id"]),
            "title": post.get("title"),
            "content": post.get("content", ""),
            "score": post.get("score", 0),
            "time": parsed_time.isoformat(),
            "url": post.get("url"),
            "metadata": {
                "author": post.get("author"),
                "type": post.get("raw_data", {}).get("type"),
                "descendants": post.get("raw_data", {}).get("descendants"),
            },
            "updated_at": datetime.utcnow().isoformat(),
        }
        _upsert_signal(signal_payload)
        logger.info(f"Saved HN signal: {signal_payload['external_id']}")


def save_product_hunt(posts):
    """
    Saves the fetched posts to the database.
    """
    for post in posts:
        raw_time = post.get("createdAt")
        try:
            # Handle ISO format like "2026-02-21T08:01:00Z"
            if isinstance(raw_time, str) and "T" in raw_time:
                parsed_time = datetime.fromisoformat(raw_time.replace("Z", "+00:00"))
            else:
                parsed_time = datetime.utcfromtimestamp(int(raw_time))
        except Exception:
            parsed_time = datetime.utcnow()

        signal_payload = {
            "platform": "product_hunt",
            "external_id": str(post["id"]),
            "title": post.get("name"),
            "content": post.get("description", ""),
            "score": post.get("votesCount", 0),
            "time": parsed_time.isoformat(),
            "url": post.get("url"),
            "metadata": {"tagline": post.get("tagline")},
            "updated_at": datetime.utcnow().isoformat(),
        }
        _upsert_signal(signal_payload)
        logger.info(f"Saved PH signal: {signal_payload['external_id']}")


def save_stack_overflow(posts):
    """
    Saves fetched Stack Overflow questions to the database.
    """
    for post in posts:
        raw_time = post.get("time")
        try:
            parsed_time = datetime.utcfromtimestamp(int(raw_time))
        except Exception:
            parsed_time = datetime.utcnow()

        raw_data = post.get("raw_data", {})
        signal_payload = {
            "platform": "stack_overflow",
            "external_id": f"so_{post['id']}",
            "title": post.get("title", "No title"),
            "content": post.get("content", ""),
            "score": post.get("score", 0),
            "time": parsed_time.isoformat(),
            "url": post.get("url", ""),
            "metadata": {
                "author": post.get("author"),
                "tags": raw_data.get("tags", []),
                "answer_count": raw_data.get("answer_count", 0),
                "view_count": raw_data.get("view_count", 0),
                "is_answered": raw_data.get("is_answered", False),
                "accepted_answer_id": raw_data.get("accepted_answer_id"),
            },
            "updated_at": datetime.utcnow().isoformat(),
        }
        _upsert_signal(signal_payload)
        logger.info(f"Saved SO signal: {signal_payload['external_id']}")
