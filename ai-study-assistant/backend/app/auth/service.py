import hashlib
from uuid import uuid4

from app.core.security import create_access_token


_USERS_BY_EMAIL: dict[str, dict[str, str]] = {}


def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def _auth_response(user: dict[str, str]) -> dict[str, object]:
    return {
        "access_token": create_access_token(user["id"]),
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
        },
    }


def create_user(name: str, email: str, password: str) -> dict[str, object]:
    normalized_email = email.lower()
    if normalized_email in _USERS_BY_EMAIL:
        raise ValueError("A user with this email already exists")

    user = {
        "id": str(uuid4()),
        "name": name.strip(),
        "email": normalized_email,
        "password_hash": _hash_password(password),
    }
    _USERS_BY_EMAIL[normalized_email] = user
    return _auth_response(user)


def authenticate_user(email: str, password: str) -> dict[str, object] | None:
    user = _USERS_BY_EMAIL.get(email.lower())
    if user is None or user["password_hash"] != _hash_password(password):
        return None
    return _auth_response(user)

