# AGENTS.md

## Mission

Build a hackathon MVP for **RealityCheck AI**: a web app that turns a startup idea into a navigable market atlas.

## Source of truth

Before making changes, read these files in order:
1. `AGENTS.md`
2. `CONTEXT.md`
3. `README.md`
4. relevant code in the target directory

## Product invariants

These rules are non-negotiable:
- The primary output is the **atlas**, not a giant report.
- The app must support **progressive results**: `queued` -> `running` -> `pulse_ready` -> `complete`.
- The hackathon scope is **SaaS / AI tools / software ideas** only.
- **React Flow** is the default atlas implementation.
- **Polling** is preferred over websockets for the MVP.
- **Local JSON file storage** is preferred over a database for the MVP.
- **Chat is optional**. Do not block the core flow on chat.
- **Full 3D is out of scope**.

## Technical mental model

- Frontend = visualization and UX only
- FastAPI = app gateway
- Prefect = long-running orchestration
- Gemini = semantic reasoning
- Exa = web research and page contents
- JSON files = persisted runs for MVP

## Coding priorities

When time is limited, prioritize in this order:
1. end-to-end happy path
2. stable run lifecycle
3. atlas rendering
4. detail panel
5. Brutal Truth card
6. Opportunity card
7. fallback/demo mode
8. polish
9. extras

## Avoid

Avoid these unless explicitly requested:
- introducing auth
- adding a database
- adding websockets
- using D3 force layout as the primary graph engine
- adding multi-agent complexity inside the app runtime
- calling live provider APIs from the browser
- over-abstracting early

## Repo structure

Expected high-level layout:
```text
apps/web
services/api
data/runs
docs
plans
```

## Conventions

### Frontend
- Use TypeScript.
- Prefer small components with clear props.
- Keep data-fetching logic in `lib/` or route-level hooks/helpers.
- Use a single atlas component boundary with deterministic input props.
- Do not hardcode provider secrets in the client.

### Backend
- Use FastAPI + Pydantic.
- Keep provider code behind interfaces in `providers/`.
- Keep orchestration in `flows/`.
- Keep storage logic in `storage/`.
- Routes should remain thin.

### Data
- Persist every run to disk.
- Persist partial results, not only final results.
- Keep fixture/demo data in a stable format so UI work can continue without providers.

## Run contract

Every run must expose:
- `run_id`
- `status`
- timestamps
- optional progress message
- partial or final result payload

Valid statuses:
- `queued`
- `running`
- `pulse_ready`
- `complete`
- `failed`

## Working style

- Ship the simplest working thing first.
- Mock before integrating providers.
- Keep components and modules replaceable.
- If you add a new architectural pattern, document it.
- If you correct a repeated mistake, update this file.

## Planning rule

If a task is likely to:
- touch more than 3 files, or
- take more than 30 minutes, or
- change the API contract,

then write a short plan in `plans/<task-name>.md` before implementing.

A good plan should include:
- goal
- affected files
- data flow
- acceptance criteria
- rollback/cut scope option

## Validation

Before marking work complete:
- run the web app lint/build if available
- run the API server or tests if available
- verify the happy path manually
- verify fallback/demo mode still works

## Documentation rule

If you change any of the following, update docs in the same PR/task:
- API contract
- repo structure
- environment variables
- run statuses
- build commands
- product scope

At minimum, update:
- `README.md` for setup changes
- `CONTEXT.md` for architecture/product changes
- `AGENTS.md` for durable workflow rules

## Prompting guidance for coding agents

When asked to implement something:
1. restate the requested scope in one paragraph
2. identify the minimum working slice
3. implement that slice first
4. validate locally if tools are available
5. report what was built, what was mocked, and what remains

## Preferred first implementation

For the initial scaffold, prefer:
- Next.js app with a landing page and run page
- FastAPI service with `/health`, `/analyze`, `/runs/{id}/status`, `/runs/{id}/result`
- mock Prefect flow or light real flow wrapper
- JSON-backed storage in `data/runs`
- demo fixtures for 3 startup ideas

## Handoff note

If this repo is being used by multiple coding agents, keep `AGENTS.md` short and durable, and put broader architectural context in `CONTEXT.md`.
