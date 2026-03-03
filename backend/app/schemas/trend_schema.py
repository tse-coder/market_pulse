from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TrendResponse(BaseModel):
    id: str
    topic_name: str
    volume: int
    related_signals: List[str] = []
    generated_at: datetime
    
    class Config:
        from_attributes = True
