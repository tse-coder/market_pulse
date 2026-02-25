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
        # Ensure `time` is a datetime for DateTimeField
        raw_time = post.get("time")
        try:
            parsed_time = datetime.utcfromtimestamp(int(raw_time))
        except Exception:
            parsed_time = datetime.utcnow()

        signal = Signal(
            platform="hacker news",
            content=post["content"],
            # author=post["author"],
            time=parsed_time,
            url=post["url"]
        )
        signal.save()
        logger.info(f"Saved signal: {signal.id}")

def save_product_hunt(posts):
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
            platform="product hunt",
            content=post["content"],
            # author=post["author"],
            time=parsed_time,
            url=post["url"]
        )
        signal.save()
        logger.info(f"Saved signal: {signal.id}")