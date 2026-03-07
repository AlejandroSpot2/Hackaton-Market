# AI Research Sprint Plan

## 1. CURRENT STATE

### What is implemented

| File | Status | Notes |
|------|--------|-------|
| `services/api/app/providers/fixtures.py` | Fully implemented | Loads fixture JSON bundles, selects by keyword, personalizes idea node |
| `services/api/app/storage/runs.py` | Fully implemented | Create, get, save, update with atomic `.tmp` → rename writes |
| `services/api/app/models.py` | Fully implemented | All Pydantic models for the run contract and atlas payloads |
| `services/api/app/config.py` | Partially implemented | Has RUNS_DIR, FIXTURES_DIR, CORS_ORIGINS — no API key fields |
| `services/api/app/routes/runs.py` | Fully implemented | POST /analyze, GET /runs/{id}/status, GET /runs/{id}/result |
| `services/api/app/main.py` | Fully implemented | FastAPI app with CORS middleware |
| `services/api/.env.example` | Partial | Has CORS_ORIGINS, RUNS_DIR, FIXTURES_DIR — no GEMINI_API_KEY, no EXA_API_KEY |

### What does NOT exist yet

| File | Status | Impact |
|------|--------|--------|
| `services/api/app/flows/analyze.py` | MISSING — **critical** | `routes/runs.py` imports `start_analysis_flow` from this module; the API server cannot start without it |
| `services/api/app/providers/gemini.py` | MISSING | No Gemini calls anywhere in the codebase |
| `services/api/app/providers/exa.py` | MISSING | No Exa calls anywhere in the codebase |

### What is mocked

- The entire analysis pipeline is a fixture lookup. `start_analysis_flow` is imported but the module that defines it does not exist.
- `providers/__init__.py` is empty (1 line); no provider interface is defined.
- `flows/__init__.py` is empty (1 line); no flow logic is present.
- `requirements.txt` has no Gemini SDK (`google-generativeai`) or Exa SDK (`exa-py`).
- `config.py` reads no API key from the environment.

---

## 2. SCHEMA MAP

Every Pydantic model in `models.py` that the AI providers must output, with field names and types.

### `AtlasPosition`
```
x: float
y: float
```

### `AtlasNode`
```
id: str                                         # slugified unique identifier, e.g. "lazyapply"
type: "idea" | "competitor" | "segment" | "adjacent_category" | "opportunity"
label: str                                      # short display name, ≤36 chars recommended
summary: str                                    # one sentence description of the node
market_signal: str                              # short phrase (5–10 words) about market positioning
position: AtlasPosition                         # {x: float, y: float} — canvas layout coordinates
```

### `AtlasEdge`
```
id: str                                         # unique, e.g. "e1", "e2"
source: str                                     # must match an existing AtlasNode.id
target: str                                     # must match an existing AtlasNode.id
type: "competes_with" | "belongs_to_segment" | "adjacent_to" | "opportunity_in"
label: str                                      # short edge annotation, e.g. "competes" or "belongs to"
```

### `MarketAtlas`
```
nodes: list[AtlasNode]
edges: list[AtlasEdge]
```

### `CompetitorDetail`
```
node_id: str                                    # must exactly match the corresponding AtlasNode.id
name: str                                       # full product name
website: str                                    # URL string
tagline: str                                    # one-line positioning phrase
why_it_wins: str                                # 1–2 sentences on their core competitive advantage
risks: list[str]                                # 1–3 short risk statements
pricing_hint: str                               # e.g. "Freemium plus premium tools"
signals: list[str]                              # 2–4 short market signal strings
sources: list[str]                              # list of URL strings used as evidence
```

### `SummaryCard`  (used for `brutal_truth` and `opportunity`)
```
title: str                                      # static label: "Brutal Truth" or "Opportunity"
headline: str                                   # punchy one-liner
body: str                                       # 2–4 sentence prose paragraph
bullets: list[str]                              # 3–5 action-oriented bullet strings
```

### `PulseSummary`
```
idea: str                                       # echoed from the submitted idea string
summary: str                                    # 1–2 sentence market read
market_temperature: "cold" | "warm" | "heated"
competition_level: "low" | "medium" | "high"
whitespace: str                                 # 1–2 sentence description of the open opportunity
top_signals: list[str]                          # 3–5 short market signal strings
```

### `RunResult`  (the top-level output contract)
```
idea: str
pulse: PulseSummary
atlas: MarketAtlas
competitor_details: dict[str, CompetitorDetail] # keys must be AtlasNode.id values for competitor nodes
brutal_truth: SummaryCard | None                # null in pulse_ready; populated in complete
opportunity: SummaryCard | None                 # null in pulse_ready; populated in complete
sources: list[str]                              # union of all competitor source URLs
```

### Critical referential integrity rules
- Every `AtlasEdge.source` and `AtlasEdge.target` must be a value that exists as `AtlasNode.id` in the same atlas.
- Every key in `competitor_details` must be the `id` of a node with `type == "competitor"` in the atlas.
- `CompetitorDetail.node_id` must match the key it is stored under in `competitor_details`.
- The `idea` node (type `"idea"`) must always be present and its `id` should be `"idea"`.
- Positions do not need to be semantically meaningful; they will be used directly by React Flow `fitView`. Spread nodes enough to avoid overlap (x range ≈ ±400, y range ≈ ±300).

---

## 3. GAPS

### Structural gaps (app cannot start)

1. **`flows/analyze.py` is missing entirely.**
   `routes/runs.py` line 4: `from ..flows.analyze import start_analysis_flow`
   This import fails at startup. The server does not run today.

### Provider gaps (demo_mode=false is broken)

2. **`providers/gemini.py` does not exist.**
   No Gemini client, no prompts, no structured output parsing.

3. **`providers/exa.py` does not exist.**
   No Exa client, no search query construction, no result extraction.

4. **`config.py` does not read `GEMINI_API_KEY` or `EXA_API_KEY`.**
   Even if providers were written, they would have no way to retrieve API keys through the shared settings object.

5. **`.env.example` does not document `GEMINI_API_KEY` or `EXA_API_KEY`.**
   Developer setup instructions are incomplete.

6. **`requirements.txt` has no provider SDKs.**
   `google-generativeai` (or `google-genai`) and `exa-py` are not listed.

### Prompt gaps (inside gemini.py once written)

7. **`generate_pulse` prompt is entirely absent.**
   The function does not exist yet. When written, it needs to instruct Gemini to:
   - classify market temperature and competition level using only allowed enum values
   - output a complete `PulseSummary` in strict JSON
   - include an initial `MarketAtlas` with at least 3 competitors, one segment node, and the idea node
   - output `CompetitorDetail` records for every competitor node in the atlas
   - leave `brutal_truth` and `opportunity` null

8. **`generate_deep_insights` prompt is entirely absent.**
   When written, it needs to instruct Gemini to:
   - take the pulse result plus Exa research findings as context
   - expand the atlas (add `adjacent_category` and `opportunity` nodes)
   - synthesize and populate `brutal_truth` and `opportunity` cards
   - update or refine `PulseSummary.whitespace` and `top_signals`

9. **Node position generation is not addressed.**
   Gemini has no spatial reasoning. The prompt or application code must produce `position.x` and `position.y` for every node deterministically (e.g., algorithmic layout by node type: idea at center, competitors in a ring, segment below, opportunity above).

---

## 4. TASK LIST

Ordered by dependency. Each task is the minimum slice needed to unblock the next.

### Task 1 — Create `flows/analyze.py` with demo-mode routing
**File:** `services/api/app/flows/analyze.py`
**Function:** `start_analysis_flow(run_id: str, idea: str, demo_mode: bool) -> None`
**Why first:** The API server cannot start without this import. Start with a stub that routes demo_mode=True through fixtures (the existing happy path) and raises NotImplementedError for demo_mode=False. This unblocks all other development and testing.

### Task 2 — Add API key fields to `config.py` and `.env.example`
**File:** `services/api/app/config.py`
**Fields to add:** `gemini_api_key: str | None` (from `GEMINI_API_KEY`), `exa_api_key: str | None` (from `EXA_API_KEY`)
**File:** `services/api/.env.example`
**Lines to add:** `GEMINI_API_KEY=your-key-here`, `EXA_API_KEY=your-key-here`
**Why second:** Both provider modules need these keys at import time; config must exist before providers are written.

### Task 3 — Add provider SDKs to `requirements.txt`
**File:** `services/api/requirements.txt`
**Additions:** `google-generativeai>=0.8,<1` (or `google-genai>=0.8,<1`), `exa-py>=1,<2`
**Why third:** Providers cannot be written or tested until the SDKs are installable.

### Task 4 — Create `providers/exa.py`
**File:** `services/api/app/providers/exa.py`
**Functions:**
- `search_competitors(idea: str, n: int = 8) -> list[dict]` — queries Exa for real competitor URLs and extracts title, url, and text snippet for each result
- `fetch_page_contents(urls: list[str]) -> list[dict]` — fetches full text for each URL (optional; use only if time permits)
**Why fourth:** Exa results feed the Gemini prompts; must exist before gemini.py is written.

### Task 5 — Create `providers/gemini.py`
**File:** `services/api/app/providers/gemini.py`
**Functions:**
- `generate_pulse(idea: str, exa_results: list[dict]) -> RunResult` — calls Gemini with the pulse prompt, parses structured JSON output into a validated `RunResult` with `brutal_truth=None` and `opportunity=None`
- `generate_deep_insights(idea: str, pulse_result: RunResult, exa_results: list[dict]) -> RunResult` — calls Gemini with the deep-insights prompt, returns a final `RunResult` with all fields populated
**Why fifth:** Depends on `RunResult` shape (already defined) and Exa result shape from Task 4.

### Task 6 — Wire the live path in `flows/analyze.py`
**File:** `services/api/app/flows/analyze.py`
**Function:** `start_analysis_flow` (replace NotImplementedError stub)
**Logic:**
- demo_mode=True: existing fixture path (unchanged)
- demo_mode=False:
  1. update run to `running`
  2. call `exa.search_competitors(idea)`
  3. call `gemini.generate_pulse(idea, exa_results)` → write `pulse_ready` result
  4. call `gemini.generate_deep_insights(idea, pulse_result, exa_results)` → write `complete` result
  5. catch all provider exceptions → write `failed` status with error_message

### Task 7 — Add node position helper
**File:** `services/api/app/providers/gemini.py` (or a new `services/api/app/utils/layout.py`)
**Function:** `assign_positions(nodes: list[AtlasNode]) -> list[AtlasNode]` — deterministic layout by node type: idea at (0,0), competitors in a ring at radius ~280, segment below at y~240, adjacent_category at y~240 x~380, opportunity above at y~-260. This keeps Gemini from needing spatial reasoning and guarantees non-overlapping nodes in React Flow.

---

## 5. PROMPT REWRITE PLAN

### `generate_pulse` — system prompt intent

**Goal:** Given a startup idea and a list of Exa search results (title + URL + snippet), produce a complete `RunResult` with:
- a full `PulseSummary`
- a `MarketAtlas` with 3–6 competitor nodes, 1–2 segment nodes, and the idea node
- a `CompetitorDetail` for each competitor node
- `brutal_truth: null` and `opportunity: null`

**Tone instructions to include in prompt:**
- Be a senior market analyst writing for a founder, not a consultant writing a report.
- Be direct. No hedge phrases like "it's worth noting" or "it may be the case that."
- market_signal values should be 5–10 words, scannable at a glance.
- summary and whitespace should be 1–2 tight sentences.

**Output format instructions:**
- Respond with a single JSON object and nothing else. No markdown fences, no explanation.
- The JSON must conform exactly to the RunResult schema below. (Embed the full JSON schema or a clear field-by-field description in the prompt.)
- All enum fields (`market_temperature`, `competition_level`, `type` for nodes and edges) must use only the exact allowed string values.
- All `AtlasEdge.source` and `AtlasEdge.target` values must match existing node `id` fields in the same atlas.
- All keys in `competitor_details` must match an `id` value of a node with `type: "competitor"`.
- `CompetitorDetail.node_id` must equal the key it is stored under.

**Node/edge linking rules to state explicitly:**
- Always include one node with `id: "idea"` and `type: "idea"`.
- Competitor nodes: use lowercase slugified names as `id` (e.g., `"lazyapply"`, `"github_copilot"`). No spaces or special characters.
- Add at least one `segment` node that groups the competitors via `belongs_to_segment` edges.
- Connect each competitor to the idea node with a `competes_with` edge.
- Connect each competitor to the segment node with a `belongs_to_segment` edge.
- Do not generate `position` fields; they will be assigned programmatically after parsing. (Or alternatively: provide a position formula in the prompt and include position fields in the schema.)

**Example structure to include in prompt:**
Embed a minimal valid JSON example (2 competitors, 1 segment, 3 edges) that demonstrates all field names and value formats. Mirror the fixture JSON shape exactly so there is no ambiguity.

---

### `generate_deep_insights` — system prompt intent

**Goal:** Given the startup idea, the pulse RunResult (partial atlas + pulse summary), and the Exa research results, produce a final `RunResult` with:
- an expanded `MarketAtlas` — add at least one `adjacent_category` node and one `opportunity` node
- refined `PulseSummary.whitespace` and `top_signals` based on the Exa content
- a fully populated `brutal_truth` SummaryCard
- a fully populated `opportunity` SummaryCard
- a merged `sources` list from all Exa URLs

**Tone instructions:**
- `brutal_truth.headline` should be a single declarative sentence that a founder would wince at slightly. No softening.
- `brutal_truth.body` should state the core structural problem in 2–4 sentences. No advice yet.
- `brutal_truth.bullets` should be 3 tight observations, each under 12 words.
- `opportunity.headline` should be a forward-leaning framing of the most defensible wedge.
- `opportunity.body` should give the why in 2–4 sentences.
- `opportunity.bullets` should be 3 action-level directives, each starting with an imperative verb.

**Output format instructions:**
- Same JSON-only constraint as above.
- The output must be a complete RunResult, not a diff. Re-emit all nodes from the pulse phase plus the new ones.
- All new nodes and edges must maintain the same referential integrity rules.
- `opportunity` node in the atlas must be connected via an `opportunity_in` edge to the most relevant segment or adjacent_category node.
- `adjacent_category` node must be connected via an `adjacent_to` edge from the relevant segment node.

**Context packing:**
- Include the Exa snippets as a numbered list in the prompt: `[1] <title> — <url>\n<snippet>`.
- Include the existing pulse result as a JSON block prefixed with a clear label.
- Tell the model to cite Exa result indices when selecting sources for competitor detail records.

---

## 6. RISKS

### High probability / high impact

**R1 — Schema mismatch from Gemini JSON output**
Gemini may produce keys in wrong case, emit extra fields, or omit required fields. Pydantic will raise `ValidationError`.
Mitigation: use `model_validate` inside a try/except; log the raw response before parsing; include `response_mime_type="application/json"` and a `response_schema` in the Gemini API call (the Python SDK supports this via `generation_config`).

**R2 — Invalid enum values in node type or edge type**
Gemini might emit `"competitor_node"` instead of `"competitor"`, or `"is_adjacent_to"` instead of `"adjacent_to"`.
Mitigation: embed the exact enum values with their exact string representations in the prompt. Include a field-level example for every enum field.

**R3 — Broken node/edge references**
An edge source or target references a node id that does not exist in the atlas (e.g., Gemini slugifies a name differently in the node vs. the edge).
Mitigation: add a post-parse validation step in the application code that checks all edge source/target ids against the node id set and removes or repairs broken edges before writing the run result.

**R4 — `competitor_details` keys don't match node ids**
Gemini emits `competitor_details["GitHub Copilot"]` but the node has `id: "github_copilot"`.
Mitigation: the prompt must be explicit that the keys are the same slugified ids used in the atlas nodes. Add a post-parse normalization step that re-keys by `node_id` field if mismatch is detected.

**R5 — Exa results shape unpredictable**
The Exa Python SDK returns a `SearchResponse` object; the shape of `.results` items (fields: `url`, `title`, `text`, `highlights`) may not match naive dict access.
Mitigation: in `exa.py`, always convert to plain dicts via explicit field extraction. Never pass SDK objects directly to the Gemini prompt builder.

### Medium probability / medium impact

**R6 — Missing env vars (`GEMINI_API_KEY`, `EXA_API_KEY`) cause 500 at runtime, not startup**
If keys are absent and `config.py` uses `Optional[str]`, the provider modules will only fail when called, giving a confusing error in a background thread.
Mitigation: in `flows/analyze.py`, check that both keys are non-None before starting the live path; if missing, fail fast with a clear `error_message` and `failed` status rather than propagating a deep stack trace.

**R7 — Gemini rate limits or latency spikes during demo**
The pulse + deep-insights sequence makes 2 Gemini calls per run. Under load or cold-start latency, this can take 10–30 seconds.
Mitigation: update `progress_message` at each step (`"Scanning market..."`, `"Synthesizing atlas..."`) so the frontend status strip reflects real progress. The 2.5-second polling loop will surface these.

**R8 — Prefect dependency conflict**
`requirements.txt` includes `prefect>=3,<4`, but the flow layer currently uses plain Python threads via FastAPI `BackgroundTasks`. Prefect is not actually used. At import time Prefect does not conflict, but its presence may slow startup and create version pin tensions when adding `google-generativeai`.
Mitigation: do not remove Prefect now (the plan intends to use it for orchestration), but verify that `pip install` of the full requirements set succeeds before writing provider code.

**R9 — `flows/analyze.py` import failure blocks every other test**
Because runs.py imports `start_analysis_flow` at module level, any import error in `flows/analyze.py` will cause the entire FastAPI app to fail to start. This means a syntax error in the new file breaks demo mode too.
Mitigation: create the file as a minimal stub (Task 1) and validate app startup before adding provider logic.

**R10 — Atlas positions hard-coded to (0,0) break React Flow layout**
React Flow's `fitView` will stack all nodes at the origin if positions are all zero. The fixture JSON shows a deliberate layout (competitors in a ring, opportunity above, segment below).
Mitigation: implement the `assign_positions` layout helper (Task 7) and always apply it after parsing the Gemini response, before writing the run result. Never let position generation depend on Gemini.
