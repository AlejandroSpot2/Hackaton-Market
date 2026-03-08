## Goal

Fix local development fetch failures when the Next.js app runs on a different localhost port than `3000` by broadening API CORS handling for localhost origins and improving frontend network error messaging.

## Affected files

- `plans/local-dev-cors-fix.md`
- `services/api/app/config.py`
- `services/api/app/main.py`
- `services/api/.env.example`
- `apps/web/lib/api.ts`
- `README.md`

## Data flow

1. Browser sends `POST /analyze` from the current web origin.
2. FastAPI CORS middleware should accept common localhost and `127.0.0.1` origins, not just `localhost:3000`.
3. Frontend fetch helper should translate browser network failures into actionable local-dev guidance.

## Acceptance criteria

- `POST /analyze` preflight succeeds from `localhost:3000` and `localhost:3001`.
- Existing API routes and payloads remain unchanged.
- Frontend shows a clearer message than raw `failed to fetch` when the API is unavailable.
- Web lint/build still pass.

## Rollback / cut scope

- If regex-based CORS handling proves unreliable, keep the broader explicit localhost origin list and skip the regex.
