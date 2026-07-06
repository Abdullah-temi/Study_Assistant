from fastapi import APIRouter
from pydantic import BaseModel

from app.ai.service import generate_flashcards

router = APIRouter()


class FlashcardRequest(BaseModel):
    document_id: str | None = None


@router.get("")
def list_flashcards() -> list[dict[str, str]]:
    return generate_flashcards()


@router.post("/generate")
def create_flashcards(payload: FlashcardRequest) -> list[dict[str, str]]:
    return generate_flashcards(payload.document_id)

