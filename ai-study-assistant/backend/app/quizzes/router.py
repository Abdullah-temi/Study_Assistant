from fastapi import APIRouter
from pydantic import BaseModel

from app.ai.service import generate_quiz

router = APIRouter()


class QuizRequest(BaseModel):
    document_id: str | None = None


@router.get("")
def list_quizzes() -> list[dict[str, str]]:
    return [
        {
            "id": "demo-quiz-1",
            "title": "RAG Basics",
            "questions": "2",
        }
    ]


@router.post("/generate")
def create_quiz(payload: QuizRequest) -> dict[str, object]:
    return generate_quiz(payload.document_id)

