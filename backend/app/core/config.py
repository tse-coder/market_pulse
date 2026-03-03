from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Market Pulse"
    ENVIRONMENT: str = "development"
    MONGO_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "market-pulse"
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
    ]

    class Config:
        env_file = ".env"

settings = Settings()
