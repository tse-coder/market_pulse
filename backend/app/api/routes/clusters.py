from fastapi import APIRouter, HTTPException, Query
from app.db.database import db
from app.core.config import settings
from typing import List
# removed unused imports to satisfy linting

router = APIRouter()


@router.get("/", response_model=List[dict])
async def get_clusters(
    page: int = Query(1, ge=1), limit: int = Query(25, ge=1, le=100)
):
    client = db.client
    if not client:
        raise HTTPException(status_code=503, detail="Database client not initialized")

    coll = client[settings.DATABASE_NAME].cluster
    skip = (page - 1) * limit

    # Sort by momentum_score descending
    cursor = coll.find().sort("momentum_score", -1).skip(skip).limit(limit)
    results = []
    async for doc in cursor:
        results.append(
            {
                "id": str(doc.get("_id")),
                "name": doc.get("name"),
                "description": doc.get("description"),
                "total_signals": doc.get("total_signals", 0),
                "total_startups": doc.get("total_startups", 0),
                "total_discussions": doc.get("total_discussions", 0),
                "avg_sentiment": doc.get("avg_sentiment", 0.0),
                "momentum_score": doc.get("momentum_score", 0.0),
                "pain_score": doc.get("pain_score", 0.0),
                "opportunity_score": doc.get("opportunity_score", 0.0),
                "primary_tags": doc.get("primary_tags", []),
                "created_at": doc.get("created_at").isoformat()
                if doc.get("created_at")
                else None,
            }
        )
    return results


@router.get("/{cluster_id}/signals", response_model=List[dict])
async def get_cluster_signals(cluster_id: str):
    client = db.client
    if not client:
        raise HTTPException(status_code=503, detail="Database client not initialized")

    coll = client[settings.DATABASE_NAME].signal
    cursor = coll.find({"cluster_id": cluster_id}).sort("total_score", -1)

    results = []
    async for doc in cursor:
        results.append(
            {
                "id": str(doc.get("_id")),
                "platform": doc.get("platform"),
                "title": doc.get("title"),
                "content": doc.get("content"),
                "type": doc.get("type", "discussion"),
                "score": doc.get("score"),
                "total_score": doc.get("total_score"),
                "sentiment_score": doc.get("sentiment_score"),
                "ai_summary": doc.get("ai_summary"),
                "ai_sentiment": doc.get("ai_sentiment"),
                "ai_topics": doc.get("ai_topics"),
                "url": doc.get("url"),
                "time": doc.get("time").isoformat() if doc.get("time") else None,
            }
        )
    return results
