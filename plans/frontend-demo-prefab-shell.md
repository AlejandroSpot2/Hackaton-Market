## Goal

Stabilize the frontend run experience for demo use by introducing a run-page view model, clearer progressive states, improved node-aware detail rendering, and an isolated experimental Prefab shell boundary for non-atlas UI.

## Affected files

- `plans/frontend-demo-prefab-shell.md`
- `apps/web/lib/api.ts`
- `apps/web/lib/constants.ts`
- `apps/web/lib/types.ts`
- `apps/web/components/run-workspace.tsx`
- `apps/web/components/atlas-canvas.tsx`
- `apps/web/components/detail-panel.tsx`
- `apps/web/components/status-strip.tsx`
- `apps/web/components/summary-card.tsx`
- `apps/web/components/idea-form.tsx`
- `apps/web/app/page.tsx`
- `apps/web/app/globals.css`

## Data flow

1. Fetch raw `status` and `result` payloads from the existing API.
2. Normalize them into a frontend view model that tolerates empty, partial, and complete results.
3. Feed atlas props only into the React Flow canvas.
4. Feed shell props into status, pulse, summary, loading, and error components.
5. Render the shell through a contained Prefab wrapper only if the client-only renderer proves compatible; otherwise render the local fallback using the same view model.

## Acceptance criteria

- Polling remains at 2.5 seconds and stops on `complete` or `failed`.
- `pulse_ready` shows the pulse and atlas immediately, with explicit placeholders for final cards.
- Selected atlas node persists across polling updates when possible.
- Detail panel renders node-type-aware content instead of competitor-only content.
- Landing page provides stronger prompt guidance and sample prompts.
- The non-atlas shell stays readable and demo-safe with or without Prefab enabled.
- `npm run lint` and `npm run build` pass.

## Rollback / cut scope

- If Prefab causes SSR, hydration, or build instability, keep the adapter, shell redesign, and local fallback components and leave Prefab isolated behind a non-default wrapper.
