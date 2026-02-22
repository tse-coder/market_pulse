from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import health, signals, trends
import logging

logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Backend for Market Pulse"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api/health", tags=["health"])
app.include_router(signals.router, prefix="/api/signals", tags=["signals"])
app.include_router(trends.router, prefix="/api/trends", tags=["trends"])

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up Market Pulse Backend")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down Market Pulse Backend")
