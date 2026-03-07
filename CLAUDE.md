# CLAUDE.md

RealityCheck AI is an atlas-first hackathon MVP.

Before changing code, read `AGENTS.md`, `CONTEXT.md`, and `README.md`.

Important constraints:
- keep the happy path working end to end
- preserve progressive statuses: `queued`, `running`, `pulse_ready`, `complete`, `failed`
- use polling, not websockets
- keep storage on local JSON files
- treat Exa and Gemini as future provider integrations behind interfaces
- do not let optional chat or 3D work block the core atlas flow