from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SignalCreate(BaseModel):
    platform: str
    content: str

class SignalResponse(SignalCreate):
    id: str
    sentiment_score: Optional[float] = None
    created_at: datetime
    
    class Config:
        from_attributes = True
