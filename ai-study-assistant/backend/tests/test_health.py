from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.database.session import get_db
from app.main import app


@pytest.fixture()
def client() -> Generator[TestClient, None, None]:
    """Override get_db with an in-memory SQLite session so this test proves the
    dependency wiring works without requiring a live Postgres container."""
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
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


def test_health_reports_ok_database(client: TestClient) -> None:
    response = client.get("/api/health")

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["database"] == "ok"


def test_health_reports_error_when_db_unreachable(client: TestClient) -> None:
    """Simulates the realistic failure mode: the session is obtained fine (SQLAlchemy
    connects lazily), but the actual query fails — e.g. Postgres container is down."""

    class BrokenSession:
        def execute(self, *args: object, **kwargs: object) -> None:
            raise RuntimeError("simulated connection failure")

        def close(self) -> None:
            pass

    def broken_get_db() -> Generator[Session, None, None]:
        yield BrokenSession()  # type: ignore[misc]

    app.dependency_overrides[get_db] = broken_get_db
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json()["database"] == "error"
