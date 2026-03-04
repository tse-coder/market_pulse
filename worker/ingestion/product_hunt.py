import logging
import requests
from config import settings

logger = logging.getLogger(__name__)

BASE_URL = "https://api.producthunt.com/v2/api/graphql"

def fetch_latest_posts(limit=20):
    """
    Fetches the latest posts from Product Hunt.
    Requires PRODUCT_HUNT_TOKEN environment variable.
    """
    logger.info(f"Fetching {limit} latest posts from Product Hunt...")

    if not settings.PH_TOKEN:
        raise ValueError("PH_TOKEN environment variable not set")

    headers = {
        "Authorization": f"Bearer {settings.PH_TOKEN}",
        "Content-Type": "application/json",
        "user-agent": "market-pulse"
    }

    query = """
    query ($limit: Int!) {
      posts(first: $limit, order: VOTES) {
        edges {
          node {
            id
            name
            tagline
            description
            url
            votesCount
            createdAt
          }
        }
      }
    }
    """

    payload = {
        "query": query,
        "variables": {"limit": limit},
    }

    try:
        response = requests.post(BASE_URL, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()

        if "errors" in data:
            logger.error(f"GraphQL errors: {data['errors']}")
            return None

        posts = [
            edge["node"]
            for edge in data["data"]["posts"]["edges"]
        ]
        print(posts)

        logger.info(f"Successfully fetched {len(posts)} posts.")
        return posts

    except requests.RequestException as e:
        logger.exception("Request failed")
        raise e