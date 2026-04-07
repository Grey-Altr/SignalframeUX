---
phase: 24-detail-view-data-layer
plan: "01"
subsystem: data-layer
tags: [shiki, server-only, component-registry, data-authoring]
dependency_graph:
  requires: []
  provides: [lib/code-highlight.ts, lib/component-registry.ts]
  affects: [Phase 25 ComponentDetail panel]
tech_stack:
  added: [shiki@4.0.2, server-only@0.0.1]
  patterns: [singleton-highlighter, server-only-guard, pure-data-module]
key_files:
  created:
    - lib/code-highlight.ts
    - lib/component-registry.ts
  modified:
    - package.json
    - pnpm-lock.yaml
decisions:
  - "34 entries in COMPONENT_REGISTRY (not 35) — COMPONENTS array in components-explorer.tsx has exactly 34 items; plan spec of 35 was off-by-one"
  - "docId keys use camelCase SF component name convention (sfButton, sfCard, etc.) to match Plan 02 api-docs.ts new entries"
  - "SFUX_THEME defined before getHighlighter() call site — avoids temporal dead zone in singleton promise"
metrics:
  duration: "~4 minutes"
  completed: "2026-04-07"
  tasks_completed: 2
  files_changed: 4
---

# Phase 24 Plan 01: Detail View Data Layer — Code Highlight + Component Registry Summary

Server-only shiki RSC syntax highlighter and 34-entry component registry data map for Phase 25 ComponentDetail panel.

## What Was Built

### Task 1: Install shiki + server-only; create code-highlight.ts

**lib/code-highlight.ts** — Server-only RSC module exporting `highlight(code: string): Promise<string>`.

- `import 'server-only'` guard at line 1 — compile-time error if imported from Client Component
- `createHighlighter` from `shiki` (v4.0.2) with `createJavaScriptRegexEngine` — no WASM
- Singleton pattern: module-level `highlighterPromise` lazily initialized on first call
- `langs: ['tsx']` — covers TSX, JSX, TypeScript
- Custom `sfux-dark` OKLCH theme — hardcoded values from globals.css `--sf-code-*` tokens
- 9 OKLCH color values across 7 token scope rules

**Packages installed:** shiki@4.0.2, server-only@0.0.1

### Task 2: Create component-registry.ts with 34 grid entries

**lib/component-registry.ts** — Pure data module (no directive, no imports) exporting `COMPONENT_REGISTRY`.

- `VariantPreview` and `ComponentRegistryEntry` interfaces exported for Phase 25 consumers
- 34 entries keyed by index string (001–030 + 101–104)
- Each entry: `variants` (1–4 per entry), `code` snippet (template literal), `docId` pointer, `layer`, `pattern`, `category`
- Pattern B entries (012 DRAWER, 026 CALENDAR, 027 MENUBAR) use direct lazy import paths — NOT barrel
- Pattern C animation entries (101–104) use `@/components/animation/*` direct paths
- `layer` and `pattern` fields derived from registry.json metadata

## Verification Results

| Check | Result |
|-------|--------|
| `pnpm tsc --noEmit` | PASS — zero errors |
| `pnpm build` | PASS — full production build |
| `grep -c "server-only" lib/code-highlight.ts` | 1 |
| `grep -c "createHighlighter" lib/code-highlight.ts` | 3 |
| `grep -c "oklch" lib/code-highlight.ts` | 9 |
| `grep -c "'use client'" lib/component-registry.ts` | 0 |
| `grep "sf-drawer-lazy" lib/component-registry.ts` | confirmed |
| `grep "sf-calendar-lazy" lib/component-registry.ts` | confirmed |
| `grep "sf-menubar-lazy" lib/component-registry.ts` | confirmed |
| Server-only guard respected (build passes) | PASS |

## Deviations from Plan

### Auto-noted: 34 entries vs plan spec of 35

**Found during:** Task 2
**Issue:** The plan spec states "exactly 35 entries" but the ComponentsExplorer COMPONENTS array has exactly 34 items (001–030 = 30 numeric + 101–104 = 4 generative = 34 total). The plan text enumerates 34 indices but calls the result "35".
**Fix:** Used the actual source of truth — the COMPONENTS array — for count authority. All 34 grid items are covered. No entries were fabricated.
**Impact:** None to Phase 25 — all actual grid items are mapped. Plan's "35" was an off-by-one in specification.
**Commit:** 60e82cc

## Key Decisions

1. **34 entries is correct** — COMPONENTS array is the canonical source; plan spec was off-by-one.
2. **docId camelCase convention** — `sfButton`, `sfCard`, `sfModal`, etc. aligns with Plan 02 api-docs.ts keys being authored in Phase 24 Plan 02.
3. **SFUX_THEME defined as const before getHighlighter** — avoids temporal dead zone issue if singleton is initialized synchronously in module scope.
4. **Comment with 'use client' text removed from registry** — grep AC requires zero literal matches; moved to neutral wording.

## Self-Check: PASSED

**Files exist:**

- FOUND: lib/code-highlight.ts
- FOUND: lib/component-registry.ts

**Commits exist:**

- FOUND: 8926887 feat(24-01): add code-highlight.ts server-only shiki RSC module
- FOUND: 60e82cc feat(24-01): create component-registry.ts with 34 ComponentsExplorer grid entries
