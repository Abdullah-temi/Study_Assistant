from fastapi import APIRouter

router = APIRouter()


@router.get("/me")
def get_current_user_placeholder() -> dict[str, str]:
    return {
        "id": "Abdullah",
        "name": "Abdullah Adenekan",
        "email": "abdullahadenekan@yahoo.com",
        "note": "This placeholder will read the authenticated user from JWT in the auth milestone.",
    }

