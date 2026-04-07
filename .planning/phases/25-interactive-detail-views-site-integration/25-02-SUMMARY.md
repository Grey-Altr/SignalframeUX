---
phase: 25-interactive-detail-views-site-integration
plan: 02
subsystem: homepage-integration
tags: [component-grid, homepage, next-dynamic, bundle-gate, server-component-async]
dependency_graph:
  requires: [components/blocks/component-detail.tsx, lib/component-registry.ts, lib/api-docs.ts, lib/code-highlight.ts]
  provides: [components/blocks/component-grid.tsx (client component with detail panel), app/page.tsx (async with highlight pre-computation)]
  affects: [app/page.tsx, components/blocks/component-grid.tsx]
tech_stack:
  added: []
  patterns: [client-component-conversion, next/dynamic ssr:false bundle gate, server-async-page highlight pre-computation, triggerRefs for focus return]
key_files:
  created: []
  modified:
    - components/blocks/component-grid.tsx
    - app/page.tsx
decisions:
  - "Homepage uses plain useState(openIndex) — not useSessionState — per SI-01 which scopes session persistence to /components only"
  - "triggerRefs keyed by comp.id (not index string) matching COMPONENTS array id field — consistent with homepage data model"
  - "ComponentDetailLazy rendered inside <section> but outside grid div — correct DOM sibling placement matching /components pattern"
  - "highlight() pre-computed for all 12 homepage IDs via Promise.all in async Server Component — zero client JS cost"
  - "Shared bundle held at 102 kB after homepage integration — ComponentDetail remains async chunk only"
metrics:
  duration_seconds: 240
  completed_date: "2026-04-07T02:08:00Z"
  tasks_completed: 2
  tasks_total: 2
  files_created: 0
  files_modified: 2
---

# Phase 25 Plan 02: Homepage ComponentGrid Integration Summary

**One-liner:** Homepage grid cards open the same ComponentDetail panel as /components via 'use client' conversion, next/dynamic, and async server-side shiki pre-computation — shared bundle unchanged at 102 kB.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Convert ComponentGrid to client component with detail panel | 5b27832 | components/blocks/component-grid.tsx, app/page.tsx |
| 2 | Bundle gate verification | (no commit — verification only) | — |

## What Was Built

### ComponentGrid conversion (components/blocks/component-grid.tsx)

Converted from Server Component to `'use client'` with:
- `useState<string | null>(null)` for `openIndex` — plain state (not session, per SI-01)
- `useRef<Record<string, HTMLElement | null>>({})` for `triggerRefs` — O(1) focus return by id
- `useCallback` for `handleCardClick` — toggle open/close
- All 12 `<Link href="/components">` replaced with `<div role="button" tabIndex={0}>` with onClick, onKeyDown (Enter/Space), aria-expanded, ref callback
- `ComponentDetailLazy` via `next/dynamic({ ssr: false, loading: () => null })` — keeps component-detail out of shared bundle
- Detail panel rendered as DOM sibling below grid div, inside outer `<section>`, matching /components pattern
- Props signature updated: `ComponentGrid({ highlightedCodeMap }: { highlightedCodeMap: Record<string, string> })`

### app/page.tsx (async Server Component)

- `export default async function HomePage()` — made async
- Added imports: `highlight` from `@/lib/code-highlight`, `COMPONENT_REGISTRY` from `@/lib/component-registry`
- `Promise.all` over ids 001-012 to pre-compute `highlightedCodeMap` server-side
- `highlightedCodeMap` passed as prop to `<ComponentGrid />`

## Acceptance Criteria Status

| AC | Status | Notes |
|----|--------|-------|
| AC-1: Homepage card click opens ComponentDetail with 3 tabs | PASS | openIndex state + ComponentDetailLazy rendered below grid |
| AC-2: component-grid.tsx has 'use client', useState, dynamic import | PASS | All 3 present — grep verified |
| AC-3: Shared JS bundle under 150 KB | PASS | 102 kB (gate: 150 kB) — unchanged from Plan 01 baseline |

## Deviations from Plan

None — plan executed exactly as written.

## Build Metrics

- Shared bundle: 102 kB (gate: 150 kB — PASS)
- ComponentDetail: async chunk only, not in shared bundle (both component-grid and components-explorer use dynamic import — PASS)
- window.scrollTo violations: 0 (grep returned exit:1 — PASS)
- pnpm build exit code: 0

## Self-Check: PASSED

- FOUND: components/blocks/component-grid.tsx contains 'use client'
- FOUND: component-grid.tsx contains `dynamic(` and `component-detail`
- FOUND: component-grid.tsx contains `useState`
- FOUND: component-grid.tsx contains `handleCardClick`
- FOUND: component-grid.tsx does NOT contain `import Link`
- FOUND: component-grid.tsx contains `ComponentDetailLazy`
- FOUND: component-grid.tsx contains `highlightedCodeMap`
- FOUND: app/page.tsx contains `import { highlight }`
- FOUND: app/page.tsx contains `import { COMPONENT_REGISTRY }`
- FOUND: app/page.tsx function is `async`
- FOUND: app/page.tsx contains `highlightedCodeMap` passed to `ComponentGrid`
- FOUND commit 5b27832 (Task 1)
- Build passes with zero errors, shared bundle 102 kB
