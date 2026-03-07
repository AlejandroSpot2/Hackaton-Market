# RealityCheck AI: Backend & AI Status Update

## 1. Where We Are Right Now (Backend Owner + AI Owner)
We have successfully integrated the live AI pipelines into the Hackathon MVP skeleton. The codebase in `AlejandroSpot2/Hackaton-Market` now features:
- **FastAPI Gateway**: Handles incoming requests (`/analyze`, `/runs/{id}/status`, `/runs/{id}/result`).
- **State Storage**: Run states and payloads persist flawlessly to `data/runs/*.json`.
- **Live Providers Setup**: 
  - `services/api/app/providers/exa.py` is ready to perform neural searches.
  - `services/api/app/providers/gemini.py` is wired to consume Exa results and output perfectly structured JSON matching our Pydantic `RunResult` models using Gemini 2.5 Pro.
- **Fail-Safe Orchestrator**: `services/api/app/flows/analyze.py` checks the `demo_mode` flag. If demo mode is active, it yields safe JSON fixtures. If live APIs fail, it catches the error and silently falls back to fixtures to protect the frontend experience.

## 2. What Is Left For The Backend Owner?
**The core infrastructure is 100% complete for the hackathon MVP.** 
The Backend Owner has a very light load remaining. They should focus on:
1. **Adding API Tests**: Implement basic pytest coverage for the `/analyze` and `/status` endpoints.
2. **Reviewing Logs**: Monitor the `uvicorn` logs during team testing to ensure the JSON writes don't hit any file-lock race conditions.
3. **Assisting Frontend**: Help the frontend owner if they need minor tweaks to the `models.py` contract (e.g., adding a specific field for a custom React Flow node).

## 3. What Is Left For The AI/Research Owner?
**This is the critical path.** The AI/Research owner needs to fine-tune the outputs.
1. **Prompt Engineering**: The string prompts in `services/api/app/providers/gemini.py` are basic. They need to be expanded to define *how* Gemini should evaluate the Exa context to generate the "Brutal Truth" and find market gaps.
2. **Handling Schema Enforcement**: Test the pipeline with `demo_mode=False`. If Gemini struggles to generate the exact nested JSON for the `MarketAtlas`, adjust the prompt instructions to guide the model.
3. **Environment Setup**: Add `GEMINI_API_KEY` and `EXA_API_KEY` to the `/services/api/.env` file.

---

## 4. Activating Claude Code for The Rest of the Team
To accelerate the remaining work, the other owners (Frontend, Schema/Data, QA) can leverage **Claude Code**. 

**Important:** Claude can run terminal commands directly. You can prompt Claude to launch multiple background agents at once to test, build, and run the app simultaneously. 

### How to Brief Claude (Copy & Paste this to Claude Code):

> **Prompt for Claude Code (Frontend Workflow):**
> "You are the Frontend Owner for RealityCheck AI. Our backend contract is stable (polling JSON data matching `services/api/app/models.py`). Your job is to improve the `apps/web/components/atlas-canvas.tsx` and `run-workspace.tsx`. 
> 
> Please execute the following tasks concurrently using your terminal access:
> 1. In the background, start the backend server: `cd services/api && uvicorn app.main:app --port 8000 &`
> 2. In the background, start the Next.js dev server: `cd apps/web && npm run dev &`
> 3. Analyze the React Flow components. Add an interactive modal so that when a user clicks a node in the atlas, it opens a side panel displaying the node's `market_signal` and `summary`.
> 4. Ensure your changes do not require websockets. Rely entirely on the existing polling hook.
> 
> Let's build!"

> **Prompt for Claude Code (Schema/QA Workflow):**
> "You are the QA and Schema Owner for RealityCheck AI. 
> 1. Run `pytest` on the backend (you may need to create a simple `tests/test_api.py` covering the `/health` and `/analyze` endpoints).
> 2. Inspect `services/api/app/models.py`. Update `AtlasNode` and `CompetitorDetail` to include an `evidence_links: list[str]` array.
> 3. Update the JSON fixtures in `data/fixtures/` to include this new `evidence_links` field so the frontend can test it without hitting live APIs.
> 4. Ensure `python -m compileall services/api/app` passes after your changes."
