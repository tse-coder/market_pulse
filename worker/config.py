from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    MONGO_URI: str = Field(
        default="mongodb://localhost:27017", validation_alias="MONGO_URI"
    )
    DATABASE_NAME: str = Field(default="market_pulse", validation_alias="DATABASE_NAME")
    REDDIT_CLIENT_ID: str = Field(default="",validation_alias="REDDIT_CLIENT_ID")
    REDDIT_SECRET: str = Field(default="", validation_alias="REDDIT_SECRET")
    REDDIT_USER_AGENT: str = Field(
        default="market_pulse_worker/1.0", validation_alias="REDDIT_USER_AGENT"
    )
    OPENAI_API_KEY: str = Field(default="", validation_alias="OPENAI_API_KEY")
    GOOGLE_API_KEY: str = Field(default="", validation_alias="GOOGLE_API_KEY")
    ENVIRONMENT: str = Field(default="development", validation_alias="ENVIRONMENT")
    PH_TOKEN: str = Field(default="", validation_alias="PH_TOKEN")

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )


settings = Settings()
