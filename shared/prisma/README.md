# Prisma schema – single source of truth

This directory contains the only Prisma schema used across the monorepo.

- Schema path: `shared/prisma/schema.prisma`
- Migrations: `shared/prisma/migrations/`
- Generation: Prisma Client should be generated from this schema for all server-side code (backend and any scripts).

## How to generate Prisma Client

From the repo root (PowerShell):

```powershell
pnpm --filter shared exec prisma generate --schema shared/prisma/schema.prisma
```

Or rely on package-level postinstall hooks that run `prisma generate`.

## How to apply migrations

```powershell
pnpm --filter shared exec prisma migrate deploy --schema shared/prisma/schema.prisma
```

## Notes

- The previous `backend/prisma/schema.prisma` has been removed to avoid divergence.
- Frontend must not use Prisma Client. Use the backend HTTP API instead.
- Ensure `DATABASE_URL` is set in `backend/.env` before running the backend.
