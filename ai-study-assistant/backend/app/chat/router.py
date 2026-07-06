from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.ai.service import answer_from_notes

router = APIRouter()


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)


@router.get("/recent")
def recent_chats() -> list[dict[str, str]]:
    return [
        {
            "id": "demo-chat-1",
            "title": "Chapter 3 concepts",
            "last_message": "Explain polymorphism using my uploaded notes.",
        }
    ]


@router.post("")
def send_chat_message(payload: ChatRequest) -> dict[str, object]:
    return answer_from_notes(payload.message)

