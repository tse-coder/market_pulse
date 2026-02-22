from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class SignalModel(BaseModel):
    # MongoDB typically uses _id, mapped to id in pydantic
    id: Optional[str] = Field(None, alias="_id")
    platform: str
    content: str
    sentiment_score: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
