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
    embedding: List[float], threshold: float = 0.85
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


def update_cluster_centroid(
    cluster_id: str, new_embedding: List[float], alpha: float = 0.1
):
    """
    Updates the cluster's centroid using a moving average.
    centroid = (1 - alpha) * centroid + alpha * new_embedding
    """
    cluster = Cluster.objects(id=cluster_id).first()
    if not cluster or not cluster.embedding_centroid:
        return

    current_centroid = np.array(cluster.embedding_centroid)
    new_v = np.array(new_embedding)

    updated_centroid = (1 - alpha) * current_centroid + alpha * new_v
    # Re-normalize to maintain L2 property
    cluster.embedding_centroid = l2_normalize(updated_centroid.tolist())
    cluster.save()
    logger.info(f"Updated centroid for cluster {cluster_id}")
