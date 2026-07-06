from fastapi import APIRouter
from pydantic import BaseModel

from app.ai.service import generate_summary

router = APIRouter()


class SummaryRequest(BaseModel):
    document_id: str | None = None


@router.post("")
def create_summary(payload: SummaryRequest) -> dict[str, object]:
    return generate_summary(payload.document_id)

