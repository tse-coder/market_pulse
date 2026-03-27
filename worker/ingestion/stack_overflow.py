import logging
import re
from html import unescape

import requests

from config import settings

logger = logging.getLogger(__name__)

BASE_URL = "https://api.stackexchange.com/2.3/questions"
DEFAULT_TAGS = ["startup", "saas", "machine-learning", "ai", "python", "next.js"]


def _clean_html(value: str) -> str:
    if not value:
        return ""

    text = re.sub(r"<[^>]+>", " ", value)
    text = unescape(text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def fetch_latest_posts(limit=20, tags=None):
    """
    Fetches high-signal questions from Stack Overflow.
    """
    tag_list = tags or DEFAULT_TAGS
    pagesize = max(1, min(limit, 50))
    logger.info(
        "Fetching %s Stack Overflow questions with tags: %s",
        pagesize,
        ",".join(tag_list),
    )

    params = {
        "site": "stackoverflow",
        "order": "desc",
        "sort": "votes",
        "pagesize": pagesize,
        "filter": "withbody",
    }

    if settings.STACK_OVERFLOW_API_KEY:
        params["key"] = settings.STACK_OVERFLOW_API_KEY
    else:
        logger.warning(
            "STACK_OVERFLOW_API_KEY is not configured. Requests may be throttled by the API."
        )

    try:
        merged = {}

        for tag in tag_list:
            request_params = {**params, "tagged": tag}
            response = requests.get(BASE_URL, params=request_params, timeout=30)
            response.raise_for_status()
            data = response.json()

            for item in data.get("items", []):
                question_id = item.get("question_id")
                if question_id:
                    merged[str(question_id)] = item

        # Keep highest-signal questions first.
        sorted_items = sorted(
            merged.values(),
            key=lambda item: item.get("score", 0),
            reverse=True,
        )[:limit]

        posts = []
        for item in sorted_items:
            question_id = item.get("question_id")
            title = unescape(item.get("title", "No title"))
            body = _clean_html(item.get("body", ""))

            posts.append(
                {
                    "id": str(question_id),
                    "title": title,
                    "content": body or title,
                    "score": item.get("score", 0),
                    "author": item.get("owner", {}).get("display_name", "unknown"),
                    "time": item.get("creation_date", 0),
                    "url": item.get(
                        "link", f"https://stackoverflow.com/questions/{question_id}"
                    ),
                    "raw_data": item,
                }
            )

        logger.info("Successfully fetched %s Stack Overflow questions", len(posts))
        return posts
    except Exception as exc:
        logger.error("Failed to fetch Stack Overflow data: %s", exc)
        return []