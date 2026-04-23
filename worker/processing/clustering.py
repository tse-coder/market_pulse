from datetime import datetime
from typing import List, Optional, Tuple
import logging
import numpy as np
from database import get_supabase

logger = logging.getLogger(__name__)


def l2_normalize(vector: List[float]) -> List[float]:
    """
    Performs L2 normalization on a vector to ensure stable cosine similarity.
    """
    v = np.array(vector)
    norm = np.linalg.norm(v)
    if norm == 0:
        return vector
    return (v / norm).tolist()


def calculate_cosine_similarity(v1: List[float], v2: List[float]) -> float:
    """
    Calculates cosine similarity between two (ideally normalized) vectors.
    """
    return np.dot(v1, v2)


def find_best_cluster(
    embedding: List[float], threshold: float = 0.78
) -> Tuple[Optional[str], float]:
    """
    Finds the existing cluster that best matches the given embedding.
    Returns (cluster_id, similarity_score).
    """
    best_cluster_id = None
    max_similarity = -1.0

    response = get_supabase().table("clusters").select("id, embedding_centroid").execute()
    all_clusters = response.data or []

    for cluster in all_clusters:
        centroid = cluster.get("embedding_centroid") or []
        if not centroid:
            continue

        similarity = calculate_cosine_similarity(embedding, centroid)
        if similarity > max_similarity:
            max_similarity = similarity
            best_cluster_id = str(cluster["id"])

    if max_similarity >= threshold:
        return best_cluster_id, max_similarity

    return None, max_similarity


def update_cluster_centroid(cluster_id: str, signal, alpha: float = 0.1):
    """
    Updates the cluster's centroid and increments signal counters.
    """
    response = (
        get_supabase()
        .table("clusters")
        .select("id, embedding_centroid, total_signals, total_startups, total_discussions")
        .eq("id", cluster_id)
        .limit(1)
        .execute()
    )
    if not response.data:
        return

    cluster = response.data[0]
    updates = {
        "updated_at": datetime.utcnow().isoformat(),
        "total_signals": int(cluster.get("total_signals") or 0) + 1,
        "total_startups": int(cluster.get("total_startups") or 0),
        "total_discussions": int(cluster.get("total_discussions") or 0),
    }

    if cluster.get("embedding_centroid") and signal.get("embedding_vector"):
        current_centroid = np.array(cluster["embedding_centroid"])
        new_v = np.array(signal["embedding_vector"])
        updated_centroid = (1 - alpha) * current_centroid + alpha * new_v
        updates["embedding_centroid"] = l2_normalize(updated_centroid.tolist())

    if signal.get("type") == "startup":
        updates["total_startups"] += 1
    elif signal.get("type") == "discussion":
        updates["total_discussions"] += 1

    get_supabase().table("clusters").update(updates).eq("id", cluster_id).execute()
    logger.info(f"Updated cluster {cluster_id} with signal {signal.get('external_id')}")
