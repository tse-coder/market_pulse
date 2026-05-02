from google import genai
from config import settings
import json
import logging

logger = logging.getLogger(__name__)


def process_signals_batch(signals_data):
    """
    Processes a batch of signals using Gemini to generate sentiment and analysis.
    signals_data should be a list of dicts with 'id', 'title', and 'content'.
    """
    if not settings.GOOGLE_API_KEY:
        logger.warning("GOOGLE_API_KEY not set, skipping AI processing")
        return []

    client = genai.Client(api_key=settings.GOOGLE_API_KEY)

    results = []
    chunk_size = 20
    for i in range(0, len(signals_data), chunk_size):
        chunk = signals_data[i:i + chunk_size]
        
        prompt = (
            "You are a market analyst. Analyze the following signals and provide:\n"
            "1. Sentiment (Positive, Negative, or Neutral)\n"
            "2. A brief summary (1-2 sentences)\n"
            "3. A list of key topics\n"
            "4. Similarity grouping: Assign a unique 'cluster_id' string (e.g., 'cluster_1') to signals that talk about the same specific event, product, or news. If a signal is unique, give it a unique ID.\n\n"
            "Response MUST be a valid JSON array of objects with the following keys: "
            "'external_id', 'sentiment', 'summary', 'topics', 'cluster_id'.\n\n"
            "Signals:\n"
        )
        
        for signal in chunk:
            prompt += f"--- ID: {signal['external_id']} ---\nTitle: {signal['title']}\nContent: {signal['content']}\n\n"
        
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                },
            )
            results.extend(json.loads(response.text))
        except Exception as e:
            logger.error(f"Error processing signals with Gemini: {e}")
            raise e # Raise to trigger Celery retry with backoff

    return results


def generate_market_thesis(cluster_name, cluster_tags, signals_context):
    """
    Generates a markdown-formatted market thesis for a given cluster using Gemini.
    """
    if not settings.GOOGLE_API_KEY:
        logger.warning("GOOGLE_API_KEY not set, skipping thesis generation")
        return None

    client = genai.Client(api_key=settings.GOOGLE_API_KEY)

    prompt = (
        f"You are an expert venture capitalist and market researcher. "
        f"Write a short, insightful 'Market Thesis' in Markdown format for the following trend cluster.\n\n"
        f"Cluster Name: {cluster_name}\n"
        f"Tags/Topics: {', '.join(cluster_tags)}\n\n"
        f"Context from recent signals (news/discussions/startups):\n"
        f"{signals_context}\n\n"
        f"The thesis should include:\n"
        f"1. **Core Insight**: What is the fundamental shift happening here?\n"
        f"2. **Why Now**: The catalyst driving this trend currently.\n"
        f"3. **Opportunities/Risks**: Where the value will be captured, and what are the potential pitfalls.\n"
        f"Keep it concise, analytical, and professional. Return ONLY the markdown text."
    )

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        return response.text
    except Exception as e:
        logger.error(f"Error generating thesis with Gemini: {e}")
        return None
