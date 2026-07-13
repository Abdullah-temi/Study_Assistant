# AI Study Assistant

A full-stack study assistant that will let students upload course materials, ask questions grounded in their notes, generate summaries, build flashcards, and create quizzes.

This first milestone is a clean local skeleton:

- React + TypeScript + Tailwind CSS frontend
- FastAPI backend with modular routers
- Placeholder service layer for documents, chat, summaries, flashcards, and quizzes
- Project folders for database docs, uploads, and implementation notes

## Project Structure

```text
ai-study-assistant/
├── frontend/
├── backend/
├── database/
├── docs/
├── uploads/
├── docker-compose.yml
├── README.md
└── .gitignore
```

## Run The Database

```powershell
cd ai-study-assistant
docker compose up -d db
```

This starts a local PostgreSQL 16 container matching the `DATABASE_URL` in
`.env.example`. Data persists in a named Docker volume across restarts.

Copy the env file into the backend, then apply migrations:

```powershell
cd ai-study-assistant\backend
copy ..\.env.example .env
python -m alembic upgrade head
```

## Run The Backend

```powershell
cd ai-study-assistant\backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

FastAPI docs will be available at:

```text
http://localhost:8000/docs
```

Visit `http://localhost:8000/api/health` — it now checks live database
connectivity and returns `"database": "ok"` once the container and migrations
are up, or `"database": "error"` if Postgres isn't reachable.

## Run The Frontend

```powershell
cd ai-study-assistant\frontend
npm install
npm run dev
```

The app will be available at:

```text
http://localhost:5173
```

## Current Login Behavior

Users now persist in PostgreSQL via SQLAlchemy (`app/auth/models.py`), so
accounts survive backend restarts. Password hashing (`sha256`, unsalted) and
JWT signing (hand-rolled HMAC, no `python-jose`) are still placeholders
carried over from the original skeleton — **not production-safe yet**.

## Next Milestone

Sprint 1 — real authentication:

1. Replace `sha256` password hashing with `passlib[bcrypt]`.
2. Replace the hand-rolled JWT in `app/core/security.py` with `python-jose`,
   with real signature verification and expiry handling.
3. Wire `app/auth/dependencies.py::get_current_user` into protected routes.
4. Add frontend token refresh / expiry handling.

