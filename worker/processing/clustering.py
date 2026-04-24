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


import json

def find_best_cluster(
    embedding: List[float], threshold: float = 0.78
) -> Tuple[Optional[str], float]:
    """
    Finds the existing cluster that best matches the given embedding using pgvector.
    Returns (cluster_id, similarity_score).
    """
    try:
        # Use formatting suitable for pgvector (passing list natively usually works, 
        # but string formatting '[0.1,0.2]' is safest)
        vector_str = f"[{','.join(map(str, embedding))}]"
        response = get_supabase().rpc(
            "match_cluster", 
            {"query_embedding": vector_str, "match_threshold": threshold}
        ).execute()

        if response.data and len(response.data) > 0:
            match = response.data[0]
            return str(match["id"]), float(match["similarity"])
    except Exception as e:
        logger.error(f"Error calling match_cluster rpc: {e}")

    return None, -1.0


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
        raw_centroid = cluster["embedding_centroid"]
        if isinstance(raw_centroid, str):
            raw_centroid = json.loads(raw_centroid)
        
        raw_signal = signal["embedding_vector"]
        if isinstance(raw_signal, str):
            raw_signal = json.loads(raw_signal)

        current_centroid = np.array(raw_centroid)
        new_v = np.array(raw_signal)
        
        updated_centroid = (1 - alpha) * current_centroid + alpha * new_v
        
        # pgvector expects string representation or list
        updates["embedding_centroid"] = f"[{','.join(map(str, l2_normalize(updated_centroid.tolist())))}]"

    if signal.get("type") == "startup":
        updates["total_startups"] += 1
    elif signal.get("type") == "discussion":
        updates["total_discussions"] += 1

    get_supabase().table("clusters").update(updates).eq("id", cluster_id).execute()
    logger.info(f"Updated cluster {cluster_id} with signal {signal.get('external_id')}")

