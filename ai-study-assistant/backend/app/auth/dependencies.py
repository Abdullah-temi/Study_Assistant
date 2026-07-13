"""Auth dependencies for protected routes.

NOTE: This is a Sprint 0 placeholder. `decode_unverified_subject` (see
app/core/security.py) does not cryptographically verify the JWT signature in a
production-safe way and there is no revocation/refresh handling. Sprint 1 replaces
this with a real `python-jose`-backed implementation and wires it into protected
routers. Nothing in the app currently depends on this function.
"""

from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.auth.models import User
from app.core.security import decode_unverified_subject
from app.database.session import get_db

_bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    subject = decode_unverified_subject(credentials.credentials)
    if subject is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    user = db.get(User, UUID(subject))
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User no longer exists")

    return user
