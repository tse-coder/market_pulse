from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class TrendModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    topic_name: str
    volume: int
    related_signals: List[str] = []
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
