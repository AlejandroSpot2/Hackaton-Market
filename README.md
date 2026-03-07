# RealityCheck AI

RealityCheck AI is a hackathon MVP that turns a startup idea into a navigable market atlas.

The current scaffold is intentionally mock-first. It demonstrates the full happy path with:
- a landing page for idea intake
- a run page with polling and progressive statuses
- a Market Pulse partial result
- a richer Market Atlas rendered with React Flow
- competitor details plus Brutal Truth and Opportunity cards
- local JSON persistence for runs and fixtures

## Repository layout

```text
apps/web            Next.js frontend
services/api        FastAPI gateway and lightweight flow runner
data/runs           persisted runtime run files
data/fixtures       demo result bundles for mock analysis
docs                product and architecture notes
plans               task plans for larger changes
```

## Run lifecycle

Every analysis run moves through these states:
- `queued`
- `running`
- `pulse_ready`
- `complete`
- `failed`

The web app polls the API every 2.5 seconds on the run page and renders the latest partial or final payload.

## Local setup

### 1. API

```bash
cd services/api
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

### 2. Web

```bash
cd apps/web
npm install
copy .env.example .env.local
npm run dev
```

### 3. Open the app

Visit [http://localhost:3000](http://localhost:3000).

Set the web API base URL to `http://localhost:8000` unless you expose the API elsewhere.

## API contract

### `GET /health`
Returns a simple health payload.

### `POST /analyze`
Creates a queued run and starts a lightweight local background flow.

Request body:

```json
{
  "idea": "AI assistant for small dental clinics in LatAm",
  "demo_mode": true
}
```

Response body:

```json
{
  "run_id": "run_20260307123000_ab12cd34",
  "status": "queued"
}
```

### `GET /runs/{run_id}/status`
Returns run metadata, timestamps, and the latest status.

### `GET /runs/{run_id}/result`
Returns the full run record, including the latest partial or final result payload.

## Demo fixtures

The scaffold ships with three fixture bundles:
- AI job application agent
- AI mobile coding copilot
- AI travel planner

The backend picks a fixture by keyword and personalizes the idea node with the submitted prompt.

## What is mocked

- semantic reasoning and web research
- provider integrations for Gemini and Exa
- Prefect infrastructure beyond a lightweight local flow wrapper

## What remains for the second pass

- real provider adapters in `services/api/app/providers/`
- deeper evidence handling and source scoring
- richer atlas clustering and ranking heuristics
- optional chat over saved run results