"""Raw database operations for users. No business logic (hashing, tokens) lives here —
that belongs in service.py. This module only knows how to talk to the `users` table."""

from sqlalchemy.orm import Session

from app.auth.models import User


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email.lower()).first()


def create_user_row(db: Session, *, name: str, email: str, password_hash: str) -> User:
    user = User(name=name.strip(), email=email.lower(), password_hash=password_hash)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
