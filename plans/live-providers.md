# Goal
Implement real provider adapters (Exa, Gemini) for RealityCheck AI while preserving the existing RunResult shape and Hackathon-Market constraints.

# Affected Files
- `services/api/app/providers/exa.py` (New)
- `services/api/app/providers/gemini.py` (New)
- `services/api/app/flows/analyze.py` (Modified to route based on `demo_mode`)

# Data Flow
1. API receives `POST /analyze`.
2. `start_analysis_flow` launches a thread.
3. If `demo_mode=True`, `analyze_run_flow` yields fixture bundles.
4. If `demo_mode=False`:
   a. **Pulse Phase**: Call Gemini (extract semantic core) -> Call Exa (find competitors) -> Call Gemini (yield partial `MarketAtlas` and `PulseSummary`).
   b. Write partial state (`pulse_ready`).
   c. **Complete Phase**: Call Gemini (synthesize Brutal Truth and Opportunity).
   d. Write final state (`complete`).

# Acceptance Criteria
- `demo_mode` remains fully intact and untouched.
- The `RunResult` contract shape guarantees strict typing via Pydantic Models.
- `analyze_run_flow` gracefully handles Exa/Gemini exceptions by falling back to `fixtures.py` (fail-safe for demos).

# Claude Code Agent Instructions
To speed up development, Claude can run multiple agents at once. Use a terminal multiplexer (like `tmux`) or spawn background processes to execute testing, linting, and development commands concurrently:
```bash
# Agent 1: Watch server logs
uvicorn app.main:app --reload --port 8000

# Agent 2: Run frontend builder
cd apps/web && npm run dev

# Agent 3: Execute tests and type checks concurrently
python -m compileall services/api/app & npm run lint --prefix apps/web & wait
```
