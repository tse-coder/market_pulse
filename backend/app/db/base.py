from typing import Generator
from app.db.database import db

# Dependency for FastAPI
async def get_database() -> Generator:
    try:
        yield db.client
    finally:
        pass
