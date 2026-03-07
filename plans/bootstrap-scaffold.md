# Bootstrap Scaffold Plan

## Goal

Create the initial RealityCheck AI MVP scaffold with a mocked but real run lifecycle across a Next.js frontend and FastAPI backend, using local JSON files and progressive statuses.

## Affected files

- root docs and metadata
- frontend scaffold under `apps/web`
- backend scaffold under `services/api`
- demo fixtures under `data/fixtures`
- architecture docs under `docs/`

## Data flow

1. User submits an idea on the web landing page.
2. Frontend calls `POST /analyze`.
3. API creates a queued run JSON file, then starts a lightweight local background flow.
4. The flow updates the run to `running`, writes a partial `pulse_ready` payload, then writes a final `complete` payload.
5. Frontend navigates to `/runs/[id]`, polls the status and result endpoints, and progressively renders the pulse and full atlas.

## Acceptance criteria

- API exposes `/health`, `/analyze`, `/runs/{id}/status`, and `/runs/{id}/result`.
- Runs are persisted under `data/runs` and include partial and final results.
- The web app supports idea submission, redirect, polling, atlas rendering, detail inspection, and summary cards.
- Demo fixtures exist for at least three ideas and power the entire happy path without external providers.

## Rollback / cut scope

If tooling or time gets tight, preserve the API contract and happy path while cutting non-essential polish.