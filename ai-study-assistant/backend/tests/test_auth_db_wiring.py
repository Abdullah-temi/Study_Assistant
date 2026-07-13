"""Confirms auth signup/login now round-trips through SQLAlchemy + the users table,
instead of the old in-memory dict. Table creation via Base.metadata.create_all()
here is a test-only shortcut — real environments use Alembic migrations."""

from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.base import Base
from app.database.session import get_db
from app.main import app


@pytest.fixture()
def client() -> Generator[TestClient, None, None]:
    # StaticPool pins a single underlying connection so the in-memory SQLite DB
    # (and the tables created on it) persists across requests in this test.
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    def override_get_db() -> Generator[Session, None, None]:
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def test_signup_persists_user_and_login_succeeds(client: TestClient) -> None:
    signup_response = client.post(
        "/api/auth/signup",
        json={"name": "Ada Lovelace", "email": "ada@example.com", "password": "supersecret"},
    )
    assert signup_response.status_code == 201
    assert signup_response.json()["user"]["email"] == "ada@example.com"

    # A second signup with the same email must now fail via a real UNIQUE constraint
    # lookup (crud.get_user_by_email), not an in-memory dict key check.
    duplicate_response = client.post(
        "/api/auth/signup",
        json={"name": "Ada Duplicate", "email": "ada@example.com", "password": "supersecret"},
    )
    assert duplicate_response.status_code == 409

    login_response = client.post(
        "/api/auth/login",
        json={"email": "ada@example.com", "password": "supersecret"},
    )
    assert login_response.status_code == 200
    assert "access_token" in login_response.json()

    wrong_password_response = client.post(
        "/api/auth/login",
        json={"email": "ada@example.com", "password": "wrongpassword"},
    )
    assert wrong_password_response.status_code == 401
