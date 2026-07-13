from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Typed application configuration, loaded from environment variables / .env."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "AI Study Assistant"
    frontend_origin: str = "http://localhost:5173"
    jwt_secret: str = "dev-secret"
    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/ai_study_assistant"
    uploads_dir: str = "../uploads"
    openai_api_key: str = ""


@lru_cache
def get_settings() -> Settings:
    """Cached settings instance so we parse the environment exactly once."""
    return Settings()


# Kept as a module-level singleton for backward-compatible `from app.core.config import settings`
# imports throughout the codebase.
settings = get_settings()
