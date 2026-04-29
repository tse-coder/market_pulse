from .hacker_news import fetch_latest_posts as fetch_hackernews
from .product_hunt import fetch_latest_posts as fetch_producthunt
from .reddit import fetch_latest_posts as fetch_reddit
from .stack_overflow import fetch_latest_posts as fetch_stackoverflow
from .dev_to import fetch_dev_to
from .github import fetch_github

__all__ = [
    "fetch_hackernews",
    "fetch_producthunt",
    "fetch_reddit",
    "fetch_stackoverflow",
    "fetch_dev_to",
    "fetch_github"
]