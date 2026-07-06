from pathlib import Path


def extract_text(path: Path, content_type: str = "") -> str:
    extension = path.suffix.lower()

    if extension == ".txt":
        return path.read_text(encoding="utf-8", errors="ignore")

    if extension == ".pdf":
        return _extract_pdf_text(path)

    if extension == ".docx":
        return _extract_docx_text(path)

    return ""


def _extract_pdf_text(path: Path) -> str:
    try:
        from pypdf import PdfReader
    except ImportError:
        return "PDF text extraction dependency is not installed yet."

    reader = PdfReader(str(path))
    return "\n".join(page.extract_text() or "" for page in reader.pages)


def _extract_docx_text(path: Path) -> str:
    try:
        from docx import Document
    except ImportError:
        return "DOCX text extraction dependency is not installed yet."

    document = Document(str(path))
    return "\n".join(paragraph.text for paragraph in document.paragraphs)

