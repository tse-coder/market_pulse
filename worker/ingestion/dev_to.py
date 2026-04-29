import requests
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

def fetch_dev_to(limit: int = 40) -> List[Dict[str, Any]]:
    logger.info(f"Fetching top {limit} articles from Dev.to")
    url = f"https://dev.to/api/articles?state=rising&per_page={limit}"
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        posts = []
        for item in data:
            posts.append({
                "id": str(item.get("id")),
                "title": item.get("title", ""),
                "content": (item.get("description") or "") + " " + (item.get("tags") or ""),
                "url": item.get("url", ""),
                "score": item.get("public_reactions_count", 0),
                "time": item.get("published_at"),
                "author": item.get("user", {}).get("username"),
                "raw_data": item
            })
        return posts
    except Exception as e:
        logger.error(f"Error fetching Dev.to: {e}")
        return []
