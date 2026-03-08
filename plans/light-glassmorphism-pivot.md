# Light Glassmorphism Pivot

## Goal
- Replace the current fantasy-heavy frontend styling with a light editorial glassmorphism system centered on `#630330`.
- Keep the run lifecycle, polling flow, and atlas interaction intact while making the shell feel presentation-ready.

## Affected Files
- `apps/web/app/*`
- `apps/web/components/*`
- `apps/web/lib/constants.ts`
- `apps/web/lib/run-view-model.ts`
- `apps/web/package.json`
- `apps/web/postcss.config.mjs`
- `apps/web/components.json`

## Data Flow
- No API or run-contract changes.
- `buildRunViewModel` still normalizes API payloads and drives the same UI states.
- Landing page still submits through `createRun`.
- Run page still polls every 2.5 seconds and updates atlas, status shell, and summary cards progressively.

## Acceptance Criteria
- The app reads as light editorial glass, not fantasy/RPG.
- Landing page and run page share one coherent visual system.
- Atlas remains the dominant run-page surface.
- Clicking atlas nodes still updates the detail panel.
- `npm run lint` and `npm run build` pass.

## Rollback / Cut Scope
- If time gets tight, keep Tailwind, tokens, landing page, and run-shell refactor.
- Limit atlas changes to chrome, legend, controls, and lighter node styling.
- Leave Prefab behind its existing flag and avoid tuning it unless the local shell is stable.
