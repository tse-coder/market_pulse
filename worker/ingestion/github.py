import requests
import logging
from typing import List, Dict, Any
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

def fetch_github(limit: int = 40) -> List[Dict[str, Any]]:
    date_threshold = (datetime.utcnow() - timedelta(days=7)).strftime('%Y-%m-%d')
    url = f"https://api.github.com/search/repositories?q=created:>{date_threshold}&sort=stars&order=desc&per_page={limit}"
    
    logger.info(f"Fetching top {limit} new GitHub repositories")
    try:
        response = requests.get(url, timeout=10, headers={"Accept": "application/vnd.github.v3+json"})
        response.raise_for_status()
        data = response.json()
        
        posts = []
        for item in data.get("items", []):
            posts.append({
                "id": str(item.get("id")),
                "title": item.get("full_name", ""),
                "content": (item.get("description") or "") + " " + " ".join(item.get("topics", [])),
                "url": item.get("html_url", ""),
                "score": item.get("stargazers_count", 0),
                "time": item.get("created_at"),
                "author": item.get("owner", {}).get("login"),
                "raw_data": item
            })
        return posts
    except Exception as e:
        logger.error(f"Error fetching GitHub: {e}")
        return []
