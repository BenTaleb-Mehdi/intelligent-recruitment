# Intelligent Recruitment Platform

This repository contains the recruitment platform frontend and backend.

## Project structure

- `frontend/` - Next.js application
- `backend/` - Express, Better Auth, Prisma, and Socket.IO API

## Requirements

- Node.js 20 or newer
- pnpm
- MySQL for Prisma application data
- MongoDB for messaging data

## Local setup

Install dependencies in both applications:

```bash
cd backend
pnpm install

cd ../frontend
pnpm install
```

Configure environment files before starting the applications. The backend needs a MySQL `DATABASE_URL`, MongoDB connection settings, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and allowed frontend origins. The frontend needs `NEXT_PUBLIC_API_URL` pointing to the backend (for example, `http://localhost:5000`). Never commit real credentials or secrets.

Start the applications in separate terminals:

```bash
# Terminal 1
cd backend
pnpm dev

# Terminal 2
cd frontend
pnpm dev
```

The frontend runs on `http://localhost:3000` and the API runs on `http://localhost:5000` by default.

## Database setup for a new deployment

The project uses Prisma migrations for the MySQL schema. For a new, empty database, set `DATABASE_URL` to that database and run:

```bash
cd backend
pnpm prisma migrate deploy
pnpm prisma generate
```

Run migrations before starting the backend. The migration chain creates the authentication tables, candidate/recruiter/job/quiz tables, reporting workflow, and related indexes.

After deployment, provision the first administrator through a trusted administrative process. The account must have the `ADMIN` role; public users must not be allowed to self-assign this role.

### Existing database warning

Do not run `prisma migrate deploy` against an existing database until its schema and `_prisma_migrations` history have been checked. The repository contains historical migrations from development, including an intentional no-op migration that prevents a duplicate `isOnboarded` column. If a database has already applied an older version of these migrations, reconcile or baseline the migration history first rather than editing applied migrations.

## Verification

Before release, verify that:

1. An unauthenticated request receives `401` from `/api/admin/stats`, `/api/admin/reports`, and `/api/admin/notifications`.
2. An authenticated admin can load dashboard statistics, reports, jobs, and quizzes.
3. Report moderation actions update the report status.
4. New reports, jobs, and quizzes refresh the admin notification dropdown through Socket.IO.
5. The frontend production build succeeds:

```bash
cd frontend
pnpm build
```
