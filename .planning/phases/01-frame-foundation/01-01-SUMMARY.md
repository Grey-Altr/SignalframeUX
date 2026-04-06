---
phase: 01-frame-foundation
plan: "01"
subsystem: token-system
tags: [tokens, typography, spacing, layout, css-variables]
dependency-graph:
  requires: []
  provides: [spacing-tokens, layout-tokens, semantic-typography, color-tier-docs, vhs-namespace]
  affects: [globals.css, future-SF-primitives, all-components]
tech-stack:
  added: []
  patterns: [css-custom-properties-in-root, layer-utilities-semantic-aliases, oklch-color-space]
key-files:
  created: []
  modified:
    - app/globals.css
decisions:
  - Spacing tokens placed in :root (not @theme) to avoid generating unnecessary Tailwind utility classes
  - Semantic typography defined as both @layer utilities classes AND :root custom properties for JS/inline style access
  - VHS token rename is CSS-property-only — class names (.vhs-overlay, .vhs-crt etc) left unchanged per boundary rule
metrics:
  duration: "130s"
  tasks-completed: 2
  tasks-total: 2
  files-modified: 1
  completed-date: "2026-04-06"
  commits: [f1fd5a8, b8f09bf]
requirements_completed: []
---

# Phase 1 Plan 1: Token Foundation — globals.css Summary

**One-liner:** Established spacing (9 blessed stops), layout (5 tokens), semantic typography (5 utilities + 20 custom properties), color tier docs, and VHS namespace migration all in app/globals.css.

## What Was Built

### Task 1: Spacing Tokens, Layout Tokens, Semantic Typography Aliases (f1fd5a8)

Added to `:root`:
- 9 spacing custom properties (`--space-1` through `--space-24`) covering all blessed stops (4/8/12/16/24/32/48/64/96px)
- 5 layout custom properties (`--max-w-content: 42rem`, `--max-w-wide: 80rem`, `--max-w-full: 100%`, `--gutter: 1.5rem`, `--gutter-sm: 1rem`)
- 20 semantic typography custom properties (`--text-heading-1-family` through `--text-small-leading`) for JS/inline access

Added to `@layer utilities`:
- 5 semantic typography utility classes: `.text-heading-1` (Anton/3xl/700/0.9/uppercase), `.text-heading-2` (Inter/2xl/700/1.1), `.text-heading-3` (Inter/xl/600/1.2), `.text-body` (Inter/base/400/1.5), `.text-small` (Inter/sm/400/1.4)

### Task 2: Color Tier Documentation and VHS Namespace Migration (b8f09bf)

Added COLOR TIERS comment block immediately before `@theme` with CORE 5, EXTENDED 6, and EXPANSION POLICY documented.

VHS namespace migration:
- `:root` declarations: `--vhs-crt-opacity` → `--sf-vhs-crt-opacity`, `--vhs-noise-opacity` → `--sf-vhs-noise-opacity`
- CSS rule usages: `var(--vhs-crt-opacity, 0.6)` → `var(--sf-vhs-crt-opacity, 0.6)`, `var(--vhs-noise-opacity, 0.03)` → `var(--sf-vhs-noise-opacity, 0.03)`
- Section header updated to `/* ── VHS Overlay Tokens (sf-namespaced) ── */`
- Zero `--vhs-` tokens remain without sf- prefix

## Acceptance Criteria Status

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | `text-heading-1` → Anton/3xl/700/0.9/uppercase | PASS |
| AC-2 | `text-body` → Inter/base/400/1.5 | PASS |
| AC-3 | `text-small` → Inter/sm/400/1.4 | PASS |
| AC-4 | Layout tokens: max-w-content=42rem, max-w-wide=80rem, max-w-full=100%, gutter=1.5rem, gutter-sm=1rem | PASS |
| AC-5 | Color tier comment block with CORE, EXTENDED, EXPANSION POLICY | PASS |
| AC-6 | Zero `--vhs-` without sf- prefix | PASS |
| AC-7 | `--space-1` through `--space-24` covering 9 blessed stops | PASS |

## Deviations from Plan

### Pre-Existing Issue (Out of Scope)

**Pre-existing TypeScript error in unrelated file**
- **Found during:** Task 1 build verification
- **File:** `components/animation/color-cycle-frame.tsx` line 79 — `useRef<ReturnType<typeof setTimeout>>()` expects 1 argument
- **Action:** Confirmed pre-existing (error present on original branch before any changes). Logged to deferred items. Build CSS compilation passes (3.9s); TypeScript type check fails on unrelated file.
- **Impact:** None — CSS token changes are valid. Build check criterion requires investigation in separate plan.
- **Deferred to:** `deferred-items.md`

## Requirements Covered

- FRM-02: Spacing tokens defined (9 blessed stops)
- FRM-03: Layout tokens defined (max-width, gutter)
- FRM-05: Semantic typography aliases defined
- FRM-06: Color tier documentation and VHS namespace migration

## Self-Check: PASSED

Files verified:
- app/globals.css modified: FOUND
- Commit f1fd5a8: FOUND (`feat(01-01): add spacing tokens...`)
- Commit b8f09bf: FOUND (`feat(01-01): add color tier documentation...`)
- `text-heading-1` in globals.css: FOUND (line 502)
- `--max-w-content: 42rem` in globals.css: FOUND (line 166)
- `--space-1` through `--space-24`: FOUND (9 tokens)
- EXPANSION POLICY: FOUND (line 21)
- Zero `--vhs-[^s]` matches: CONFIRMED (0)
- `--sf-vhs-*` occurrences: 4 (2 declarations + 2 usages)
