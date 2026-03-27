from .hacker_news import fetch_latest_posts as fetch_hackernews
from .product_hunt import fetch_latest_posts as fetch_producthunt
from .reddit import fetch_latest_posts as fetch_reddit
from .stack_overflow import fetch_latest_posts as fetch_stackoverflow

__all__ = [
    "fetch_hackernews",
    "fetch_producthunt",
    "fetch_reddit",
    "fetch_stackoverflow",
]