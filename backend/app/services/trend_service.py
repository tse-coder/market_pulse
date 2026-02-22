from typing import List
from app.schemas.trend_schema import TrendResponse

class TrendService:
    async def get_trends(self) -> List[TrendResponse]:
        # Query highest volume trends
        return []
        
    async def get_trend(self, trend_id: str) -> TrendResponse:
        # Fetch detailed trend
        pass
