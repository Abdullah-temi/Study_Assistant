from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status

from app.core.config import settings
from app.utils.text_extraction import extract_text


_DOCUMENTS: list[dict[str, str]] = []
_ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}


def _uploads_path() -> Path:
    backend_dir = Path(__file__).resolve().parents[2]
    return (backend_dir / settings.uploads_dir).resolve()


def list_documents() -> list[dict[str, str]]:
    return _DOCUMENTS


async def save_document(file: UploadFile) -> dict[str, str | int]:
    extension = Path(file.filename or "").suffix.lower()
    if extension not in _ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Upload a PDF, DOCX, or TXT file.",
        )

    content = await file.read()
    if not content:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="The uploaded file is empty.")

    uploads_dir = _uploads_path()
    uploads_dir.mkdir(parents=True, exist_ok=True)
    stored_name = f"{uuid4()}{extension}"
    destination = uploads_dir / stored_name
    destination.write_bytes(content)

    extracted_text = extract_text(destination, content_type=file.content_type or "")
    document = {
        "id": str(uuid4()),
        "filename": file.filename or stored_name,
        "stored_name": stored_name,
        "content_type": file.content_type or "application/octet-stream",
        "characters": str(len(extracted_text)),
    }
    _DOCUMENTS.append(document)

    return {
        "id": document["id"],
        "filename": document["filename"],
        "characters": len(extracted_text),
        "status": "processed",
    }

