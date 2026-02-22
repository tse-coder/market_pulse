import requests
import logging

logger = logging.getLogger(__name__)

BASE_URL = "https://hacker-news.firebaseio.com/v0"

def fetch_latest_posts(limit=20):
    """
    Fetches the top stories from Hacker News using the official Firebase API.
    """
    logger.info(f"Fetching {limit} top stories from Hacker News...")
    try:
        response = requests.get(f"{BASE_URL}/topstories.json")
        response.raise_for_status()
        story_ids = response.json()
        
        posts = []
        for story_id in story_ids[:limit]:
            item_resp = requests.get(f"{BASE_URL}/item/{story_id}.json")
            if item_resp.status_code == 200:
                item = item_resp.json()
                if item and "title" in item:
                    # Construct content
                    content = f"{item.get('title', '')}\n{item.get('text', '')}"
                    
                    posts.append({
                        "platform": "hacker news",
                        "content": content.strip(),
                        "score": item.get('score', 0),
                        "author": item.get('by', 'unknown'),
                        "time": item.get('time', 0),
                        "url": item.get('url', f"https://news.ycombinator.com/item?id={story_id}")
                    })
        return posts
    except Exception as e:
        logger.error(f"Failed to fetch Hacker News data: {e}")
        return []
