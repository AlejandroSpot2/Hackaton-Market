from __future__ import annotations

import json

from openai import OpenAI

from ..config import settings

_PULSE_SYSTEM = """\
You are a senior market analyst specializing in SaaS and AI tools.
You help founders understand if their startup idea has a realistic path to market.

You respond ONLY with a valid JSON object.
No markdown fences, no explanation, no preamble. Raw JSON only.

RULES:
- Be direct. No hedge phrases like "it's worth noting" or "it may be the case that".
- market_signal values must be 5-10 words, scannable at a glance.
- summary and whitespace must be 1-2 tight sentences.
- Node ids must be lowercase slugs with underscores only (e.g. "github_copilot", "linear_app"). \
No spaces, no hyphens, no special characters.
- Every AtlasEdge source and target must exactly match an existing node id in the same atlas.
- Every key in competitor_details must exactly match a node id with type "competitor" in the atlas.
- CompetitorDetail.node_id must equal the key it is stored under.
- Always include exactly one node with id "idea" and type "idea".
- brutal_truth must be null.
- opportunity must be null.
- Set all position values to x:0 y:0 — they will be computed later.

VALID ENUM VALUES — use these exact strings, nothing else:
- node type: "idea", "competitor", "segment", "adjacent_category", "opportunity"
- edge type: "competes_with", "belongs_to_segment", "adjacent_to", "opportunity_in"
- market_temperature: "cold", "warm", "heated"
- competition_level: "low", "medium", "high"\
"""

_DEEP_SYSTEM = """\
You are a senior market analyst specializing in SaaS and AI tools.
You help founders understand exactly where to enter a market.

You respond ONLY with a valid JSON object.
No markdown fences, no explanation, no preamble. Raw JSON only.

RULES:
- Re-emit ALL nodes from the pulse atlas. Do not drop any existing nodes.
- Add at least one node with type "adjacent_category" and one with type "opportunity".
- Connect adjacent_category nodes via "adjacent_to" edges from the relevant segment node.
- Connect the opportunity node via "opportunity_in" edge to the most relevant segment \
or adjacent_category node.
- Keep all existing node ids exactly as they are.
- New nodes follow the same lowercase underscore slug rules.
- Set all position values to x:0 y:0 — they will be computed later.

brutal_truth card tone:
- headline: one declarative sentence a founder would wince at. No softening.
- body: the core structural problem in 2-4 sentences. State facts, no advice yet.
- bullets: exactly 3 observations, each under 12 words.

opportunity card tone:
- headline: forward-leaning framing of the most defensible market wedge.
- body: explain the why in 2-4 sentences.
- bullets: exactly 3 action directives, each starting with an imperative verb.\
"""


def _make_client() -> OpenAI:
    if not settings.gmi_api_key:
        raise ValueError("GMI_API_KEY not configured")
    return OpenAI(
        api_key=settings.gmi_api_key,
        base_url="https://api.gmi-serving.com/v1",
    )


def _format_exa_context(exa_results: list[dict]) -> str:
    lines = []
    for i, r in enumerate(exa_results):
        snippet = r.get("snippet") or r.get("text") or ""
        lines.append(f"[{i + 1}] {r.get('title', '')} — {r.get('url', '')}\n{snippet}")
    return "\n\n".join(lines)


def _call(client: OpenAI, system: str, user: str) -> dict:
    response = client.chat.completions.create(
        model="google/gemini-3-flash-preview",
        temperature=0.2,
        max_tokens=8192,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
    )
    raw = response.choices[0].message.content
    try:
        return json.loads(raw)
    except (json.JSONDecodeError, TypeError):
        print(f"[llm] raw response: {raw}")
        raise ValueError("LLM returned invalid JSON — check raw response above")


def generate_pulse(idea: str, exa_results: list[dict]) -> dict:
    client = _make_client()
    exa_context = _format_exa_context(exa_results)

    user = f"""\
Analyze this startup idea: {idea}

Real competitors found via web research:
{exa_context}

Return a JSON object with this exact structure:
{{
  "idea": "<the submitted idea string>",
  "pulse": {{
    "idea": "<echoed idea>",
    "summary": "<1-2 sentence market read>",
    "market_temperature": "<cold|warm|heated>",
    "competition_level": "<low|medium|high>",
    "whitespace": "<1-2 sentence open opportunity>",
    "top_signals": ["<signal>", "<signal>", "<signal>"]
  }},
  "atlas": {{
    "nodes": [
      {{"id": "idea", "type": "idea", "label": "<short label>", "summary": "<one sentence>", "market_signal": "<5-10 words>", "position": {{"x": 0, "y": 0}}}},
      {{"id": "<slug>", "type": "competitor", "label": "<name>", "summary": "<one sentence>", "market_signal": "<5-10 words>", "position": {{"x": 0, "y": 0}}}},
      {{"id": "<slug>", "type": "segment", "label": "<segment name>", "summary": "<one sentence>", "market_signal": "<5-10 words>", "position": {{"x": 0, "y": 0}}}}
    ],
    "edges": [
      {{"id": "e1", "source": "<competitor_id>", "target": "idea", "type": "competes_with", "label": "competes"}},
      {{"id": "e2", "source": "<competitor_id>", "target": "<segment_id>", "type": "belongs_to_segment", "label": "belongs to"}}
    ]
  }},
  "competitor_details": {{
    "<competitor_node_id>": {{
      "node_id": "<same competitor_node_id>",
      "name": "<full name>",
      "website": "<url>",
      "tagline": "<one line positioning>",
      "why_it_wins": "<1-2 sentences>",
      "risks": ["<risk>", "<risk>"],
      "pricing_hint": "<e.g. Freemium>",
      "signals": ["<signal>", "<signal>"],
      "sources": ["<url>"]
    }}
  }},
  "brutal_truth": null,
  "opportunity": null,
  "sources": ["<url>", "<url>"]
}}

Include 3-5 competitor nodes and 1-2 segment nodes.
Connect every competitor to the idea node with a competes_with edge.
Connect every competitor to a segment node with a belongs_to_segment edge.
Use sequential edge ids: e1, e2, e3...\
"""

    return _call(client, _PULSE_SYSTEM, user)


def generate_deep_insights(idea: str, pulse_result: dict, exa_results: list[dict]) -> dict:
    client = _make_client()
    exa_context = _format_exa_context(exa_results)

    user = f"""\
Startup idea: {idea}

Existing pulse analysis (do not lose any of this data):
{json.dumps(pulse_result, indent=2)}

Additional web research:
{exa_context}

Return the complete RunResult JSON. Same schema as before.
brutal_truth and opportunity must both be fully populated this time.
Re-emit all existing atlas nodes plus new adjacent_category and opportunity nodes.
All new edges must reference valid node ids.\
"""

    return _call(client, _DEEP_SYSTEM, user)


if __name__ == "__main__":
    result = generate_pulse("AI coding assistant for mobile developers", [])
    print(json.dumps(result, indent=2))
