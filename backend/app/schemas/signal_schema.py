from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SignalCreate(BaseModel):
    platform: str
    external_id: str
    title: Optional[str] = None
    content: str
    url: Optional[str] = None
    score: Optional[int] = None
    metadata: dict = {}


class SignalResponse(SignalCreate):
    id: str
    sentiment_score: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True
