# RealityCheck AI

> Turn a startup idea into a navigable market atlas in under 60 seconds.

RealityCheck AI is a market intelligence tool for founders. Enter a SaaS or AI software idea and the platform generates a live, interactive atlas of competitors, market segments, adjacencies, and opportunity wedges — powered by real web research via Exa and analysis via Google Gemini.

---

## What it does

Most founders spend weeks doing manual market research before they can answer basic questions: *Who are my real competitors? Which segment should I enter first? Where is the whitespace?*

RealityCheck AI compresses that process into a single run. The result is a structured, visual market map — not a report, not a slide deck, but an explorable graph you can reason with.

---

## How it works

1. You submit a startup idea in plain language (problem + buyer + software wedge)
2. The backend searches the web for real competitors using **Exa neural search**
3. **Google Gemini** analyzes the results and generates a structured market atlas
4. The frontend renders a live, draggable graph that updates in stages:
   - `queued → running → pulse_ready → complete`
5. The final atlas includes competitor details, segment clusters, adjacent categories, a brutal truth card, and an opportunity wedge

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React Flow, Tailwind CSS, shadcn/ui |
| Backend | FastAPI, Python 3.11+ |
| LLM | Google Gemini 3 Flash via GMI Cloud |
| Search | Exa neural search |
| Storage | Local JSON (file-based run persistence) |
| Polling | 2.5s frontend polling over REST |

---

## Project structure

```
Hackaton-Market/
├── apps/
│   └── web/                  # Next.js frontend
│       ├── app/              # App router pages
│       ├── components/       # UI components (atlas, forms, cards)
│       └── lib/              # API client, types, view models
├── services/
│   └── api/                  # FastAPI backend
│       └── app/
│           ├── flows/        # Run orchestration (analyze.py)
│           ├── providers/    # Exa + Gemini integrations
│           ├── models.py     # Pydantic schemas
│           ├── storage/      # JSON run persistence
│           └── utils/        # Layout engine for atlas nodes
└── plans/                    # Design and architecture notes
```

---

## Getting started

### Prerequisites

- Python 3.11+
- Node.js 18+
- A GMI Cloud API key (for Gemini 3 Flash)
- An Exa API key

### Backend

```bash
cd services/api
cp .env.example .env
# Add your GMI_API_KEY and EXA_API_KEY to .env
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd apps/web
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

**`services/api/.env`**
```
GMI_API_KEY=your_gmi_cloud_key
EXA_API_KEY=your_exa_key
```

**`apps/web/.env.local`**
```
NEXT_PUBLIC_DEMO_MODE=false
```

---

## Run modes

| Mode | Description |
|---|---|
| **Demo** | Uses pre-built fixture data. Instant, no API keys needed. |
| **Live AI** | Calls Exa + Gemini in real time. Enable via the checkbox on the form. ~$0.05/run. |

---

## API

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/analyze` | Start a new analysis run |
| `GET` | `/runs/{run_id}/status` | Poll run status and result |

**Start a run:**
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"idea": "AI job application agent for software engineers", "demo_mode": false}'
```

---

## Run lifecycle

```
queued → running → pulse_ready → complete
                              ↘ failed
```

- **pulse_ready** — competitor nodes and market pulse available, atlas is live
- **complete** — full atlas with brutal truth card and opportunity wedge
- **failed** — error message available in run status

---

## Sponsors & powered by

- [GMI Cloud](https://gmi-serving.com) — Gemini 3 Flash inference
- [Exa](https://exa.ai) — neural web search


## License

MIT
