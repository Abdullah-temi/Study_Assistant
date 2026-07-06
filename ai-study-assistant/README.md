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
├── README.md
└── .gitignore
```

## Run The Backend

```powershell
cd ai-study-assistant\backend
python -m uvicorn app.main:app --reload --port 8000
```

FastAPI docs will be available at:

```text
http://localhost:8000/docs
```

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

The backend uses an in-memory user store for the skeleton. Sign up with any name, email, and password, then use the returned token during the same backend process.

Production auth will replace this with PostgreSQL-backed users, hashed passwords, refresh tokens, and stricter JWT validation.

## Next Milestone

The next feature should be persistent authentication:

1. Add PostgreSQL and SQLAlchemy models.
2. Hash passwords with `passlib`.
3. Store users in the database.
4. Add protected routes and frontend token refresh handling.

