from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class SignalModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    platform: str
    external_id: str
    title: Optional[str] = None
    content: str
    url: Optional[str] = None
    type: str = "discussion"
    score: Optional[int] = None
    trend_score: Optional[float] = None
    total_score: Optional[float] = None
    sentiment_score: Optional[float] = None
    embedding_vector: list[float] = Field(default_factory=list)
    cluster_id: Optional[str] = None
    tags: list[str] = Field(default_factory=list)
    ai_summary: Optional[str] = None
    ai_sentiment: Optional[str] = None
    ai_topics: list[str] = Field(default_factory=list)
    metadata: dict = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
