---
phase: 29-infrastructure-hardening
plan: "01"
subsystem: scroll-gsap-animation
tags: [lenis, gsap, observer, fonts-ready, overscroll, playwright]
dependency_graph:
  requires: []
  provides: [gsap-observer-export, lenis-mobile-resize-hardening, fonts-ready-cls-fix, overscroll-none]
  affects: [lib/gsap-plugins.ts, lib/gsap-core.ts, components/layout/lenis-provider.tsx, components/layout/page-animations.tsx, app/globals.css]
tech_stack:
  added: []
  patterns: [fonts-ready-scroll-trigger-refresh, gsap-observer-registration, lenis-autoResize-false]
key_files:
  created: [tests/phase-29-infra.spec.ts]
  modified: [app/globals.css, components/layout/lenis-provider.tsx, lib/gsap-plugins.ts, lib/gsap-core.ts, components/layout/page-animations.tsx]
decisions:
  - "autoResize: false instead of ignoreMobileResize: true — Lenis 1.3.x dropped ignoreMobileResize; autoResize: false is the equivalent suppressant for iOS address bar resize events"
metrics:
  duration: "~3.5 minutes"
  completed: "2026-04-08T03:18:00Z"
  tasks_completed: 2
  files_modified: 5
  files_created: 1
---

# Phase 29 Plan 01: Infrastructure Hardening Summary

**One-liner:** Five targeted edits harden scroll/font/Observer infrastructure — overscroll-behavior: none, Lenis autoResize: false, GSAP Observer registered and exported from both plugin entry points, ScrollTrigger.refresh deferred to document.fonts.ready with StrictMode cancellation guard.

## Tasks Completed

| # | Task | Commit | Key Files |
|---|------|--------|-----------|
| 1 | Infrastructure micro-edits (overscroll, Lenis, Observer, fonts-ready) | bf3ead5 | globals.css, lenis-provider.tsx, gsap-plugins.ts, gsap-core.ts, page-animations.tsx |
| 2 | Playwright smoke tests for infrastructure edits | 6891071 | tests/phase-29-infra.spec.ts |

## Verification

- `pnpm build` passes with zero errors (102 KB shared bundle — unchanged)
- `pnpm exec playwright test tests/phase-29-infra.spec.ts` — 6/6 tests green
- `grep -c "Observer" lib/gsap-plugins.ts` returns 3 (import, register, export) — confirmed
- `grep -c "Observer" lib/gsap-core.ts` returns 3 (import, register, export) — confirmed
- No new entries in package.json dependencies (PF-05 zero-package constraint met)

## Acceptance Criteria Status

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | globals.css contains `overscroll-behavior: none` inside `@layer base` html rule | PASS |
| AC-2 | lenis-provider.tsx suppresses iOS address bar resize (autoResize: false) | PASS |
| AC-3 | gsap-plugins.ts: Observer imported, registered, exported | PASS |
| AC-4 | gsap-core.ts: Observer imported, registered, exported | PASS |
| AC-5 | page-animations.tsx: `document.fonts.ready.then` with `cancelledRef.current` guard | PASS |
| AC-6 | All 6 Playwright smoke tests pass | PASS |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] `ignoreMobileResize` does not exist in Lenis 1.3.x `LenisOptions`**
- **Found during:** Task 1, build verification
- **Issue:** Plan specified `ignoreMobileResize: true` but Lenis 1.3.21 (installed version) does not have this property in `LenisOptions`. Build failed with TypeScript type error.
- **Fix:** Replaced with `autoResize: false` — this is the Lenis 1.3.x equivalent that prevents automatic resize handling on iOS address bar show/hide events. The `autoResize: false` option suppresses Lenis's ResizeObserver-driven recalculation, which is what causes jank when the iOS address bar animates.
- **Files modified:** `components/layout/lenis-provider.tsx`
- **Commit:** bf3ead5

**Note on test assertion:** AC-2 Playwright test asserts `autoResize: false` (not `ignoreMobileResize: true`) to match the actual shipped value.

## Self-Check: PASSED

Files exist:
- app/globals.css — FOUND (contains `overscroll-behavior: none` at line 488)
- components/layout/lenis-provider.tsx — FOUND (contains `autoResize: false` at line 27)
- lib/gsap-plugins.ts — FOUND (Observer at lines 9, 20, 57)
- lib/gsap-core.ts — FOUND (Observer at lines 9, 12, 14)
- components/layout/page-animations.tsx — FOUND (document.fonts.ready at line 48)
- tests/phase-29-infra.spec.ts — FOUND (6 tests, all passing)

Commits exist:
- bf3ead5 — feat(29-01): infrastructure micro-edits — FOUND
- 6891071 — test(29-01): Playwright smoke tests — FOUND
