from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth.router import router as auth_router
from app.chat.router import router as chat_router
from app.documents.router import router as documents_router
from app.flashcards.router import router as flashcards_router
from app.quizzes.router import router as quizzes_router
from app.summaries.router import router as summaries_router
from app.users.router import router as users_router
from app.core.config import settings


app = FastAPI(
    title="AI Study Assistant API",
    version="0.1.0",
    description="Backend API for uploading notes and generating study help from course materials.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", tags=["health"])
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "ai-study-assistant"}


app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(users_router, prefix="/api/users", tags=["users"])
app.include_router(documents_router, prefix="/api/documents", tags=["documents"])
app.include_router(chat_router, prefix="/api/chat", tags=["chat"])
app.include_router(summaries_router, prefix="/api/summaries", tags=["summaries"])
app.include_router(flashcards_router, prefix="/api/flashcards", tags=["flashcards"])
app.include_router(quizzes_router, prefix="/api/quizzes", tags=["quizzes"])

