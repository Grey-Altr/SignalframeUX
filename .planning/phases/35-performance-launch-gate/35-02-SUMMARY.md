---
phase: 35-performance-launch-gate
plan: "02"
subsystem: testing
tags: [playwright, performance-gates, wave1, test-authoring, visual-qa]
dependency_graph:
  requires: [35-01]
  provides: [35-03, 35-04]
  affects: [tests/phase-35-*.spec.ts, .planning/phases/35-performance-launch-gate/visual-qa/]
tech_stack:
  added: []
  patterns: [playwright-parameterized-viewports, source-read-assertions, PerformanceObserver-gating, gzip-bundle-measurement]
key_files:
  created:
    - tests/phase-35-bundle-gate.spec.ts
    - tests/phase-35-lcp-homepage.spec.ts
    - tests/phase-35-cls-all-routes.spec.ts
    - tests/phase-35-homepage.spec.ts
    - tests/phase-35-system.spec.ts
    - tests/phase-35-inventory.spec.ts
    - .planning/phases/35-performance-launch-gate/visual-qa/agent-1-homepage.md
    - .planning/phases/35-performance-launch-gate/visual-qa/agent-2-system.md
    - .planning/phases/35-performance-launch-gate/visual-qa/agent-3-init.md
    - .planning/phases/35-performance-launch-gate/visual-qa/agent-4-reference.md
    - .planning/phases/35-performance-launch-gate/visual-qa/agent-5-inventory.md
  modified:
    - tests/phase-35-init.spec.ts
    - tests/phase-35-reference.spec.ts
decisions:
  - "All runtime tests (ERR_CONNECTION_REFUSED) tagged FLAG/BLOCK in Wave 1 reports — no server required for test authoring; Wave 3 re-runs against pnpm build && pnpm start"
  - "schematic register source-read targets api-explorer.tsx not app/reference/page.tsx — font-mono lives in component, not page; Wave 3 fix required"
  - "PF-01 bundle gate is the only test that can run without a server — .next/build-manifest.json present and PASSES"
  - "LR-02 OG image test intentionally RED — ships in plan 35-03; not a regression"
metrics:
  duration_minutes: 8
  completed: "2026-04-10"
  tasks_completed: 3
  tasks_total: 3
  files_created: 11
  files_modified: 2
---

# Phase 35 Plan 02: Wave 1 Test Suite Authoring Summary

Wave 1 Playwright test suite — 8 spec files encoding every locked brain assertion from the Phase 35 pre-brief as grep-verifiable Playwright assertions, with 5 agent findings reports.

## What Was Built

**3 CI-blocking gate files:**
- `tests/phase-35-bundle-gate.spec.ts` — PF-01: gzip shared chunks < 150KB + 7 forbidden WebGL substrings absent; D-3 hard-fail guard throws when `.next/` manifest is missing
- `tests/phase-35-lcp-homepage.spec.ts` — PF-03: PerformanceObserver LCP < 1000ms with D-08 comment preserved verbatim
- `tests/phase-35-cls-all-routes.spec.ts` — PF-04: parameterized layout-shift sweep across all 5 routes, tolerance < 0.001

**5 route spec files** (all with locked VIEWPORTS constant: 1440/768/375, Gap 1 tightened nav-visible pattern, no `timeout: 2000`):
- `tests/phase-35-homepage.spec.ts` — Agent 1: VL-05 status-quo lock, magenta proxy, GhostLabel pair lock, LR-04 W0-A/B/C mobile triad, LR-02 OG (intentionally RED)
- `tests/phase-35-system.spec.ts` — Agent 2: PF-04 CLS parameterized sweep (Agent 2 owns), SYS//TOK HUD, specimen ladder, GhostLabel overflow guard
- `tests/phase-35-init.spec.ts` — Gap 2 EDGE-2 preserved verbatim + SYSTEM READY terminal, INIT//SYS HUD, bringup-sequence code labels
- `tests/phase-35-reference.spec.ts` — Gap 2 preserved verbatim + REF//API HUD, font-mono schematic density check
- `tests/phase-35-inventory.spec.ts` — Agent 5: SP-05 nav-reveal gap closure (Phase 34 exclusion fixed), 12-row breadth registry check, expand-in-place ComponentDetail

**5 agent findings reports** in `.planning/phases/35-performance-launch-gate/visual-qa/`:
- Each contains a test-by-test findings table with BLOCK/FLAG/PASS severity tags
- Wave 3 triage candidates identified for all runtime-blocked tests

## Test Run Results (Wave 1)

Run without live server — no `pnpm dev` or `pnpm build && pnpm start` active.

**PASS (source-read / file-system tests — no server needed):**
- PF-01 bundle gate — shared JS 100.0 KB gzip (50KB under 150KB gate); all 7 WebGL substrings absent from shared chunks
- GhostLabel pair lock (homepage + /system) — confirmed in source
- VL-05 status-quo lock — `data-anim="hero-slash-moment"`, `mixBlendMode: "screen"`, `opacity: 0.25` intact
- Magenta budget — 0 `text-primary` hits on homepage, system, inventory source files
- 12-row breadth — all 6 categories (FORMS/LAYOUT/NAVIGATION/FEEDBACK/DATA_DISPLAY/GENERATIVE) confirmed in `lib/component-registry.ts`; 2+ GEN entries

**FAIL (runtime tests — all ERR_CONNECTION_REFUSED, no server):**
- All nav-reveal, HUD, DOM, LCP, CLS, reduced-motion tests — normal for test-authoring phase
- These are Wave 3 triage items, not regressions

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written.

### Observed Issues for Wave 3

**[FLAG] schematic register font-mono source path mismatch:**
- Found during: Task 3 report authoring
- Issue: `tests/phase-35-reference.spec.ts` reads `app/reference/page.tsx` for `font-mono`, but the class lives in `components/blocks/api-explorer.tsx` (confirmed at lines 166, 181, 291, 315)
- Fix: update source path to `components/blocks/api-explorer.tsx` in Wave 3 (plan 35-04)
- Files: `tests/phase-35-reference.spec.ts:61`

## Self-Check: PASSED

All 8 spec files confirmed on disk. All 5 agent reports confirmed on disk. All 3 task commits confirmed in git log (d64e97a, e0a1ce1, 96b6791).
