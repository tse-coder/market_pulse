from .connect import connect
from .models.signal import Signal
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


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

        signal = Signal(
            platform="hacker_news",
            external_id=post["id"],
            title=post["title"],
            content=post["content"],
            score=post.get("score", 0),
            time=parsed_time,
            url=post["url"],
            metadata={
                "author": post.get("author"),
                "type": post.get("raw_data", {}).get("type"),
                "descendants": post.get("raw_data", {}).get("descendants"),
            },
        )
        signal.save()
        logger.info(f"Saved HN signal: {signal.external_id}")


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

        signal = Signal(
            platform="product_hunt",
            external_id=post["id"],
            title=post["name"],
            content=post["description"],
            score=post.get("votesCount", 0),
            time=parsed_time,
            url=post["url"],
            metadata={"tagline": post.get("tagline")},
        )
        signal.save()
        logger.info(f"Saved PH signal: {signal.external_id}")
