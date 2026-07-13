from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Shared declarative base. Every SQLAlchemy model in the app inherits from this
    so Alembic's autogenerate can discover all tables via `Base.metadata`."""
