from fastapi import Depends
from motor.motor_asyncio import AsyncIOMotorClient
from app.db.base import get_database

async def get_db_client(db_client: AsyncIOMotorClient = Depends(get_database)):
    # Dependency placeholder
    return db_client
