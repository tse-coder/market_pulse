from datetime import datetime
import numpy as np
from typing import List, Optional, Tuple
import logging
from database.models.cluster import Cluster

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
    embedding: List[float], threshold: float = 0.80
) -> Tuple[Optional[str], float]:
    """
    Finds the existing cluster that best matches the given embedding.
    Returns (cluster_id, similarity_score).
    """
    best_cluster_id = None
    max_similarity = -1.0

    # In a real high-scale system, this would be a vector search query.
    # For this implementation, we iterate through active clusters.
    all_clusters = Cluster.objects().only("id", "embedding_centroid")

    for cluster in all_clusters:
        if not cluster.embedding_centroid:
            continue

        similarity = calculate_cosine_similarity(embedding, cluster.embedding_centroid)
        if similarity > max_similarity:
            max_similarity = similarity
            best_cluster_id = str(cluster.id)

    if max_similarity >= threshold:
        return best_cluster_id, max_similarity

    return None, max_similarity


def update_cluster_centroid(cluster_id: str, signal, alpha: float = 0.1):
    """
    Updates the cluster's centroid and increments signal counters.
    """
    cluster = Cluster.objects(id=cluster_id).first()
    if not cluster:
        return

    if cluster.embedding_centroid and signal.embedding_vector:
        current_centroid = np.array(cluster.embedding_centroid)
        new_v = np.array(signal.embedding_vector)
        updated_centroid = (1 - alpha) * current_centroid + alpha * new_v
        cluster.embedding_centroid = l2_normalize(updated_centroid.tolist())

    cluster.total_signals += 1
    if signal.type == "startup":
        cluster.total_startups += 1
    elif signal.type == "discussion":
        cluster.total_discussions += 1

    cluster.updated_at = datetime.utcnow()
    cluster.save()
    logger.info(f"Updated cluster {cluster_id} with signal {signal.external_id}")
