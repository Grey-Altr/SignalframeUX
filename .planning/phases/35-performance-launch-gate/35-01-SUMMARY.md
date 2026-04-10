---
phase: 35-performance-launch-gate
plan: 01
subsystem: wave-0-scaffolding
tags: [wave-0, test-seeds, hud-wiring, roadmap-fix, vercel-cli]
requires: []
provides: [gap-2-test-seed, ci-gate-stubs, hud-data-section-wiring, open-items]
affects: [tests, components/layout/instrument-hud.tsx, app/system, app/init, app/reference, app/inventory]
tech-stack:
  added: []
  patterns: [wave-0-red-before-green, brain-wins-pre-fix]
key-files:
  created:
    - .planning/phases/35-performance-launch-gate/OPEN-ITEMS.md
    - tests/phase-35-init.spec.ts
    - tests/phase-35-reference.spec.ts
    - tests/phase-35-bundle-gate.spec.ts
    - tests/phase-35-lcp-homepage.spec.ts
    - tests/phase-35-cls-all-routes.spec.ts
  modified:
    - components/layout/instrument-hud.tsx
    - app/system/page.tsx
    - app/init/page.tsx
    - app/reference/page.tsx
    - app/inventory/page.tsx
key-decisions:
  - "Gap 2 EDGE-2 test is RED against current code (data-nav-visible not wired on body) — expected, Wave 3 triage item"
  - "Vercel CLI upgraded from 50.28.0 to 50.43.0 via npm i -g vercel@latest"
  - "sectionLabel patch uses sections[0].id.toUpperCase() for single-section pages, preserving ordinal prefix for multi-section homepage"
requirements-completed: []
duration: 8 min
completed: 2026-04-10
---

# Phase 35 Plan 01: Wave 0 Scaffolding Summary

Wave 0 scaffolding for Phase 35 Launch Gate — ROADMAP verification, Vercel CLI upgrade, Gap 2 test seed, CI-gate stubs, and D-2 subpage HUD label pre-fix landed in 4 atomic commits across 5 tasks.

## Execution

- **Duration:** 8 min
- **Start:** 2026-04-10T16:12:32Z
- **End:** 2026-04-10T16:20:51Z
- **Tasks:** 5 (1 idempotent verify, 1 human-action checkpoint, 3 auto)
- **Files created:** 6
- **Files modified:** 5
- **Commits:** 4

## Task Results

| Task | Commit | Result |
|------|--------|--------|
| 1. ROADMAP verify + OPEN-ITEMS.md | `86f503f` | ROADMAP already clean (idempotent). OPEN-ITEMS.md created with OPEN-1 (credits) + OPEN-2 (metadataBase). |
| 2. Vercel CLI upgrade (checkpoint) | — | Upgraded 50.28.0 → 50.43.0. Team verified: grey-altr / team_uY4PqYooW9d80d9fTlGHAMB3. |
| 3. Gap 2 EDGE-2 test seed | `26ba27d` | Both init + reference specs contain verbatim locked test body. **RED** against current code — `data-nav-visible` attribute not yet wired on `<body>`. Expected at Wave 0. |
| 4. CI-gate stubs (bundle, LCP, CLS) | `2b521ed` | 3 files, 3 skipped tests, all registered with Playwright via `@phase35` tag. D-3 hard-fail guard landed in bundle-gate stub (commented, Wave 1 activates). |
| 5. D-2 subpage HUD wiring | `5e4c933` | 4 subpages carry `data-section` + `data-section-label`. instrument-hud sectionLabel patched for single-section id prefix. |

## Gap 2 Test Status

**RED.** The EDGE-2 test fails because `<body>` does not have `data-nav-visible="true"` — the `toHaveAttribute` assertion times out. This is a Wave 3 triage item, not a Wave 0 blocker. The RED state is the correct baseline for the brain-wins contract.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## Next Phase Readiness

Ready for 35-02-PLAN.md (Wave 1: CI-blocking gate assertions + visual-QA agent suites). All Wave 0 prerequisites are in place:
- 5 test files registered with Playwright
- Gap 2 seed is RED (triage target identified)
- CI-gate stubs await Wave 1 locked assertion bodies
- D-2 HUD wiring is live — Wave 1 agents 2/3/4 HUD label assertions will GREEN from day 1
- OPEN-ITEMS.md documents the two blocking Grey decisions (35-03 and 35-04 gate on these)
