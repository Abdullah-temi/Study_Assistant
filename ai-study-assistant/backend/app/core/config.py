import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    app_name: str = "AI Study Assistant"
    frontend_origin: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
    jwt_secret: str = os.getenv("JWT_SECRET", "dev-secret")
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/ai_study_assistant",
    )
    uploads_dir: str = os.getenv("UPLOADS_DIR", "../uploads")


settings = Settings()

