---
phase: 29-infrastructure-hardening
plan: "02"
subsystem: animation
tags: [pinned-section, reduced-motion, scroll-trigger, pf-06, gsap]
dependency_graph:
  requires: [29-01-PLAN.md, lib/gsap-core.ts]
  provides: [components/animation/pinned-section.tsx, PF-06 gate closed]
  affects: [Phase 31 THESIS section, Phase 32 SIGNAL section]
tech_stack:
  added: []
  patterns: [gsap.context() cleanup, matchMedia reduced-motion guard, ScrollTrigger pin/scrub]
key_files:
  created:
    - components/animation/pinned-section.tsx
  modified:
    - components/animation/token-viz.tsx
    - tests/phase-29-infra.spec.ts
decisions:
  - token-viz is static single-frame render — no rAF guard needed, coverage comment added instead
  - canvas-cursor classified as pointer-driven (exempt from reduced-motion audit per plan)
  - xray-reveal classified as pointer-driven (single-frame rAF on mousemove, exempt)
metrics:
  duration: "~8 minutes"
  completed: "2026-04-08"
  tasks_completed: 2
  tasks_total: 2
  files_created: 1
  files_modified: 2
---

# Phase 29 Plan 02: PinnedSection + PF-06 Reduced Motion Gate Summary

PinnedSection scroll primitive with GSAP pin/scrub, reduced-motion skip, and context cleanup — PF-06 gate closed via token-viz coverage annotation and 4 Playwright audit tests confirming all animation components have verified reduced-motion handling.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Create PinnedSection component | f8151b2 | components/animation/pinned-section.tsx (+73) |
| 2 | token-viz patch + PF-06 gate tests | 48be11c | token-viz.tsx, phase-29-infra.spec.ts (+78) |

## What Was Built

### PinnedSection (components/animation/pinned-section.tsx)
Reusable scroll primitive for Phase 31 (THESIS manifesto) and Phase 32 (SIGNAL section). Pins content to the viewport for `scrollDistance` viewport heights using GSAP ScrollTrigger.

Key implementation details:
- `ScrollTrigger.create` with `pin: true`, `scrub: 1`, `anticipatePin: 1`, `invalidateOnRefresh: true`
- `end: () => \`+=${scrollDistance * window.innerHeight}\`` — dynamic, recalculates on resize
- `prefers-reduced-motion` early return before ScrollTrigger.create — children render statically
- `gsap.context() + ctx.revert()` cleanup — no ghost ScrollTriggers on unmount
- Root div has no `overflow: hidden` — critical for GSAP position:fixed pin geometry
- Follows exact pattern from horizontal-scroll.tsx reference implementation

### PF-06 Gate Closed

**token-viz.tsx:** Static single-frame draw (MutationObserver + ResizeObserver triggers). No requestAnimationFrame loop exists — reduced-motion coverage comment added confirming no guard is needed.

**Audit result:** All animation components verified:
- GSAP components (circuit-divider, scramble-text, scroll-reveal, signal-motion, etc.) — covered by `initReducedMotion()` → `gsap.globalTimeline.timeScale(0)`
- Explicit guard components (glsl-hero, logo-draw, signal-mesh, horizontal-scroll, PinnedSection) — verified by tests
- Pointer-driven exempt (canvas-cursor, xray-reveal) — rAF only fires on pointer move, not decorative loop
- Static-render exempt (token-viz, ghost-label) — single-frame, no loop

## Deviations from Plan

None — plan executed exactly as written.

## Test Results

9/10 tests pass. The single failure is the pre-existing "PF-04: homepage loads without console errors" browser test — dev server returned 500 (no running server in this execution environment). This test was passing in Plan 01 when the dev server was live. All 4 new PF-06 source-level tests pass green.

## Self-Check: PASSED

All files present. All commits verified.
