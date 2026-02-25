from fastapi import APIRouter, HTTPException
from app.db.database import db
from app.core.config import settings
from typing import List

router = APIRouter()


@router.get("/", response_model=List[dict])
async def get_signals():
    """Fetch signals from MongoDB (worker writes to `signal` collection)."""
    client = db.client
    if not client:
        raise HTTPException(status_code=503, detail="Database client not initialized")

    coll = client[settings.DATABASE_NAME].signal
    cursor = coll.find().sort("time", -1).limit(200)
    results = []
    async for doc in cursor:
        results.append({
            "id": str(doc.get("_id")),
            "platform": doc.get("platform"),
            "content": doc.get("content"),
            "time": doc.get("time").isoformat() if doc.get("time") else None,
            "url": doc.get("url"),
        })

    return results


@router.post("/")
async def create_signal(signal: dict):
    client = db.client
    if not client:
        raise HTTPException(status_code=503, detail="Database client not initialized")
    coll = client[settings.DATABASE_NAME].signal
    res = await coll.insert_one(signal)
    return {"message": "Signal created successfully", "id": str(res.inserted_id)}
