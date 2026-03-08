# RPG Floating-Island UI Refactor

## Goal

Transform the RealityCheck AI frontend from an observatory/orb dark-SaaS aesthetic into a stylized 2.5D floating-island RPG world. The atlas must feel like an explorable diorama of floating islands in a dusk sky, not a dashboard of cards.

## Design direction

- Floating landmass nodes with visible cliff depth and distinct biome per type
- Winding ley-line paths between islands instead of generic graph edges
- Dusk palette: deep violets, rose, amber, misty blues, dusty earth tones
- Atmospheric sky with layered mist, distant clouds, and subtle stars
- Detail panel as a leather-bound field journal / codex
- Summary cards as discovered artifacts / relics
- Landing page as an approach to a mystical cartographer's desk

## Node type → island metaphor

| Node type         | Visual metaphor              | Palette              |
|-------------------|------------------------------|----------------------|
| idea              | Citadel / central island     | Gold / amber glow    |
| competitor        | Fortress / camp / tower      | Teal / emerald       |
| segment           | Large biome plateau          | Sky blue / mist      |
| adjacent_category | Coastal / border territory   | Warm terracotta      |
| opportunity       | Shrine / beacon / portal     | Bright gold / rose   |

## Affected files

- `apps/web/app/globals.css` — full palette + atmosphere rewrite
- `apps/web/app/page.tsx` — landing page hero redesign
- `apps/web/app/layout.tsx` — font import if needed
- `apps/web/components/idea-form.tsx` — visual match
- `apps/web/components/atlas-canvas.tsx` — island nodes, terrain edges
- `apps/web/components/run-workspace.tsx` — scene layout
- `apps/web/components/detail-panel.tsx` — codex / journal
- `apps/web/components/status-strip.tsx` — ritual progress
- `apps/web/components/pulse-card.tsx` — artifact card
- `apps/web/components/summary-card.tsx` — artifact card
- `apps/web/components/run-summary-shell.tsx` — artifact dock
- `apps/web/lib/constants.ts` — updated node tone map

## Data flow

Unchanged. Polling, view-model adapter, API contract, and Prefab gate all stay as-is.

## Acceptance criteria

- Run page feels like a floating-island scene, not a dashboard
- Atlas dominates above the fold
- Node types are visually distinct islands
- Selected node focus feels intentional
- Detail panel reads as a codex / field journal
- Summary cards feel like discovered artifacts
- Landing page matches the same world
- Polling and progressive states still work
- `npm run lint` passes
- `npm run build` passes

## Rollback / cut scope

If time runs short, cut in this order (last to first):
1. Animated cloud layers (static gradient is fine)
2. Landing page island visual (keep simpler hero)
3. Per-node SVG island silhouettes (keep styled rectangles with depth)
4. Never cut: palette, atmosphere, node differentiation, codex panel
