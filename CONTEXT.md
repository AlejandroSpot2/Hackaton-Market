# RealityCheck AI Project Context

## One-line summary

RealityCheck AI converts a startup idea into a navigable market atlas with progressive analysis.

## Product framing

The product is not a giant report generator.
The product is a decision aid that helps a founder see where to enter a market.

Core questions:
- Is the space crowded?
- Which competitors matter most?
- What adjacent wedges exist?
- Where is the whitespace?
- What entry angle looks realistic?

## UX principles

1. Map first, prose second.
2. Show a fast pulse before the deep atlas.
3. Keep evidence and heuristics inspectable.
4. Stay demo-safe with fallback fixtures.

## Current scaffold architecture

### Frontend
- Next.js App Router with TypeScript
- client-side polling on `/runs/[id]`
- React Flow for the atlas canvas
- deterministic typed props for atlas rendering

### Backend
- FastAPI routes for health, run creation, status, and result retrieval
- Pydantic models for the run contract and atlas payloads
- lightweight local background execution with Prefect-shaped flow boundaries
- JSON-backed run persistence in `data/runs`

### Mock data
- fixture bundles stored as JSON in `data/fixtures`
- keyword routing to demo scenarios
- partial `pulse_ready` and final `complete` payloads for each scenario

## Data flow

1. The landing page submits an idea to `POST /analyze`.
2. The API creates a queued run JSON file.
3. A local background worker marks the run as `running`.
4. The worker writes a partial `pulse_ready` result.
5. The worker writes a final `complete` result.
6. The run page polls the API and progressively updates the UI.

## Progressive result invariant

The run lifecycle produces two result stages with different completeness:

- **At `pulse_ready` status**: `brutal_truth` and `opportunity` are `null`. The atlas contains the idea node, 3 competitors, and 1 segment node (~5 nodes). `competitor_details` has entries for the pulse competitors only.
- **At `complete` status**: `brutal_truth` and `opportunity` are populated `SummaryCard` objects. The atlas is expanded with `adjacent_category` and `opportunity` nodes (~9 nodes). `competitor_details` has entries for all competitors.

This invariant is enforced by fixture structure and expected from live providers.

## Integration boundary for real providers

When real providers are added:
- Gemini should handle semantic reasoning and synthesis.
- Exa should handle search and page contents.
- storage, status transitions, and response contracts must remain deterministic in code.

Rule of thumb:
- LLMs for semantics
- application code for lifecycle control

## MVP non-goals

Not part of this scaffold:
- auth
- databases
- websockets
- in-browser provider calls
- full 3D visualization
- chat as a required part of the flow