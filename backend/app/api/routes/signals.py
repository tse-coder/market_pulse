from fastapi import APIRouter, HTTPException, Query
from app.db.database import db
from app.core.config import settings
from typing import List

router = APIRouter()


@router.get("/", response_model=List[dict])
async def get_signals(page: int = Query(1, ge=1), limit: int = Query(25, ge=1, le=100)):
    """Fetch signals with pagination. Returns list of signals for requested page.

    - `page` is 1-based.
    - `limit` is items per page.
    """
    client = db.client
    if not client:
        raise HTTPException(status_code=503, detail="Database client not initialized")

    coll = client[settings.DATABASE_NAME].signal

    # Calculate skip and limit
    skip = (page - 1) * limit

    # Sort by total_score descending
    cursor = coll.find().sort("total_score", -1).skip(skip).limit(limit)
    results = []
    async for doc in cursor:
        results.append(
            {
                "id": str(doc.get("_id")),
                "platform": doc.get("platform"),
                "title": doc.get("title"),
                "content": doc.get("content"),
                "score": doc.get("score"),
                "total_score": doc.get("total_score"),
                "trend_score": doc.get("trend_score"),
                "sentiment_score": doc.get("sentiment_score"),
                "ai_summary": doc.get("ai_summary"),
                "ai_sentiment": doc.get("ai_sentiment"),
                "ai_topics": doc.get("ai_topics"),
                "cluster_id": doc.get("cluster_id"),
                "metadata": doc.get("metadata"),
                "time": doc.get("time").isoformat() if doc.get("time") else None,
                "url": doc.get("url"),
            }
        )

    return results


@router.post("/")
async def create_signal(signal: dict):
    client = db.client
    if not client:
        raise HTTPException(status_code=503, detail="Database client not initialized")
    coll = client[settings.DATABASE_NAME].signal
    res = await coll.insert_one(signal)
    return {"message": "Signal created successfully", "id": str(res.inserted_id)}
