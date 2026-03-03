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

    # Prepare the prompt
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

    for signal in signals_data:
        prompt += f"--- ID: {signal['external_id']} ---\nTitle: {signal['title']}\nContent: {signal['content']}\n\n"

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config={
                "response_mime_type": "application/json",
            },
        )

        results = json.loads(response.text)
        return results
    except Exception as e:
        logger.error(f"Error processing signals with Gemini: {e}")
        return []
