from fastapi import APIRouter, File, UploadFile

from app.documents.service import list_documents, save_document

router = APIRouter()


@router.get("")
def get_documents() -> list[dict[str, str]]:
    return list_documents()


@router.post("")
async def upload_document(file: UploadFile = File(...)) -> dict[str, str | int]:
    return await save_document(file)

