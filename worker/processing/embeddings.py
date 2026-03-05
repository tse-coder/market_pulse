from google import genai
from config import settings
import logging
from typing import List, Optional

logger = logging.getLogger(__name__)


def generate_embeddings(
    text_batch: List[str], model: str = "gemini-embedding-001"
) -> List[List[float]]:
    """
    Generates semantic embeddings for a batch of texts using Gemini.
    Uses 'gemini-embedding-001' (free tier).
    """
    if not settings.GOOGLE_API_KEY:
        logger.warning("GOOGLE_API_KEY not set, skipping embedding generation")
        return []

    try:
        client = genai.Client(api_key=settings.GOOGLE_API_KEY)

        # Gemini embedding batch size limit is usually high, but we process in pipeline batches
        response = client.models.embed_content(
            model=model,
            contents=text_batch,
            config={
                "task_type": "RETRIEVAL_DOCUMENT"  # Optimizes for categorization/retrieval
            },
        )

        # Extract embeddings from response
        # Note: Response structure depends on the SDK version, for google-genai it's direct
        embeddings = [item.values for item in response.embeddings]

        logger.info(
            f"Successfully generated {len(embeddings)} embeddings using {model}"
        )
        return embeddings

    except Exception as e:
        logger.error(f"Error generating embeddings with Gemini: {e}")
        return []


def get_single_embedding(text: str) -> Optional[List[float]]:
    """Helper for single text embedding"""
    results = generate_embeddings([text])
    return results[0] if results else None
