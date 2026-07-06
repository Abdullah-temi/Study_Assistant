import base64
import hashlib
import hmac
import json
import time
from typing import Any

from app.core.config import settings


def _base64url_encode(payload: bytes) -> str:
    return base64.urlsafe_b64encode(payload).rstrip(b"=").decode("utf-8")


def create_access_token(subject: str, expires_in_seconds: int = 3600) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    body = {"sub": subject, "exp": int(time.time()) + expires_in_seconds}

    encoded_header = _base64url_encode(json.dumps(header, separators=(",", ":")).encode())
    encoded_body = _base64url_encode(json.dumps(body, separators=(",", ":")).encode())
    signing_input = f"{encoded_header}.{encoded_body}".encode()
    signature = hmac.new(settings.jwt_secret.encode(), signing_input, hashlib.sha256).digest()

    return f"{encoded_header}.{encoded_body}.{_base64url_encode(signature)}"


def decode_unverified_subject(token: str) -> str | None:
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        padded_payload = parts[1] + "=" * (-len(parts[1]) % 4)
        payload: dict[str, Any] = json.loads(base64.urlsafe_b64decode(padded_payload))
        if int(payload.get("exp", 0)) < int(time.time()):
            return None
        return str(payload.get("sub"))
    except (ValueError, json.JSONDecodeError, TypeError):
        return None

