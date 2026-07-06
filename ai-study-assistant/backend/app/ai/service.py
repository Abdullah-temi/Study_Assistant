from app.ai.prompts import SYSTEM_RAG_PROMPT


def answer_from_notes(question: str) -> dict[str, object]:
    return {
        "answer": (
            "This is a skeleton response. In the RAG milestone, I will retrieve relevant chunks "
            "from the student's uploaded notes and answer only from that context."
        ),
        "question": question,
        "sources": [],
        "prompt_policy": SYSTEM_RAG_PROMPT.strip(),
    }


def generate_summary(document_id: str | None = None) -> dict[str, object]:
    return {
        "document_id": document_id,
        "summary": [
            "Upload processing is wired, and real summary generation will use extracted text.",
            "The next implementation step is to store document text and pass it to the LLM.",
        ],
    }


def generate_flashcards(document_id: str | None = None) -> list[dict[str, str]]:
    return [
        {
            "id": "demo-card-1",
            "front": "What does RAG stand for?",
            "back": "Retrieval-Augmented Generation.",
        },
        {
            "id": "demo-card-2",
            "front": "Why use embeddings?",
            "back": "Embeddings help search notes by meaning instead of exact keywords.",
        },
    ]


def generate_quiz(document_id: str | None = None) -> dict[str, object]:
    return {
        "document_id": document_id,
        "questions": [
            {
                "type": "mcq",
                "prompt": "What is the purpose of RAG?",
                "options": [
                    "To answer using retrieved source context",
                    "To replace authentication",
                    "To deploy the frontend",
                    "To compress images",
                ],
                "answer": "To answer using retrieved source context",
            },
            {
                "type": "true_false",
                "prompt": "The assistant should answer only from uploaded notes.",
                "answer": "True",
            },
        ],
    }

