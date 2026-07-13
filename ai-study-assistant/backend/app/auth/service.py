"""Auth business logic: orchestrates crud.py calls with password hashing and token
creation. NOTE: password hashing (sha256) and token signing (hand-rolled HMAC in
app/core/security.py) are unchanged placeholders carried over from the in-memory
skeleton. Sprint 1 swaps these for passlib[bcrypt] and python-jose."""

import hashlib

from sqlalchemy.orm import Session

from app.auth import crud
from app.auth.models import User
from app.auth.schemas import AuthResponse, UserPublic
from app.core.security import create_access_token


def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def _auth_response(user: User) -> AuthResponse:
    return AuthResponse(
        access_token=create_access_token(str(user.id)),
        user=UserPublic(id=str(user.id), name=user.name, email=user.email),
    )


def create_user(db: Session, name: str, email: str, password: str) -> AuthResponse:
    if crud.get_user_by_email(db, email) is not None:
        raise ValueError("A user with this email already exists")

    user = crud.create_user_row(
        db, name=name, email=email, password_hash=_hash_password(password)
    )
    return _auth_response(user)


def authenticate_user(db: Session, email: str, password: str) -> AuthResponse | None:
    user = crud.get_user_by_email(db, email)
    if user is None or user.password_hash != _hash_password(password):
        return None
    return _auth_response(user)
