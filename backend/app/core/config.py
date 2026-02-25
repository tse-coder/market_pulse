from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Market Pulse"
    ENVIRONMENT: str = "development"
    MONGO_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "market-pulse"

    class Config:
        env_file = ".env"

settings = Settings()
