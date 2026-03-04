import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    MONGO_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "market_pulse"
    REDDIT_CLIENT_ID: str = ""
    REDDIT_SECRET: str = ""
    REDDIT_USER_AGENT: str = "market_pulse_worker/1.0"
    OPENAI_API_KEY: str = ""
    GOOGLE_API_KEY: str = "AIzaSyBWZmaAmz-IPLkuPbJEppV_5_YEML5cnc4"
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"


settings = Settings()
