---
phase: 03-signal-expression
plan: "03"
subsystem: signal-gsap
tags: [scrolltrigger, scrambletext, stagger-batch, page-animations, progressive-enhancement]
dependency_graph:
  requires: [03-01]
  provides: [scrolltrigger-scramble, stagger-batch-entry]
  affects: [components/layout/page-animations.tsx, app/globals.css]
tech_stack:
  added: []
  patterns: [scrolltrigger-once-per-element, scrolltrigger-batch-stagger, css-gsap-initial-state]
key_files:
  created: []
  modified:
    - components/layout/page-animations.tsx
    - app/globals.css
decisions:
  - "ScrollTrigger start: 'top bottom' chosen for headings — fires immediately for above-fold elements (trigger is already past 'bottom of viewport') while still wiring scroll-based reveal for below-fold headings"
  - "Per-heading ScrollTrigger.create (not batch) for page headings — each heading gets individual once: true so scroll-back never re-triggers a completed scramble"
  - "stagger: 0.04 and interval: 0.04 kept in sync — grouping window and per-item delay match for clean cascade without bunching"
metrics:
  duration_minutes: 10
  completed_date: "2026-04-06"
  tasks_completed: 2
  tasks_total: 2
  files_modified: 2
  commits: 2
---

# Phase 3 Plan 03: ScrollTrigger-Based ScrambleText and Stagger Batch Entry Summary

ScrambleText heading animation wired to ScrollTrigger viewport entry (replacing setTimeout) and staggered grid entry added via ScrollTrigger.batch with 40ms cascade — both changes ensure SIGNAL effects fire when seen, not on DOM ready.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Replace setTimeout with ScrollTrigger in initPageHeadingScramble | 9da3179 | components/layout/page-animations.tsx |
| 2 | Add ScrollTrigger.batch stagger entry and CSS initial state | c554ebd | components/layout/page-animations.tsx, app/globals.css |

## Changes Made

### components/layout/page-animations.tsx

**initPageHeadingScramble** — removed `setTimeout(() => { ... }, 0)` wrapper entirely. Each heading now gets an individual `ScrollTrigger.create({ trigger: htmlEl, start: "top bottom", once: true, onEnter })`. The `start: "top bottom"` threshold means the trigger fires as soon as the top edge of the element crosses the bottom of the viewport — which happens immediately on page load for above-fold headings. `once: true` guarantees no re-trigger on scroll back. The ScrambleText config (chars, speed, duration, delay) is unchanged.

**initCoreAnimations** — added `ScrollTrigger.batch("[data-anim='stagger'] > *", ...)` at the end of the function, after the click-pop block. Config: `interval: 0.04` (40ms grouping window), `batchMax: 12`, `start: "top 85%"`, `stagger: 0.04` per item, `duration: 0.4`, `ease: "power2.out"`, `once: true`. Children animate from `opacity: 0, y: 20px` (set via CSS) to `opacity: 1, y: 0`.

### app/globals.css

**CSS initial state** — added `[data-anim="stagger"] > * { opacity: 0; transform: translateY(20px); }` after the `[data-anim="cta-btn"]` rule and before the catch-all `[data-anim]` rule. This hides stagger children via CSS (no GSAP.set needed) so the reveal is clean on first entry.

**Reduced-motion block** — added `[data-anim="stagger"] > *` to the selector list in the `@media (prefers-reduced-motion: reduce)` reset block. Stagger children surface immediately at `opacity: 1; transform: none !important` when reduced motion is preferred.

## Acceptance Criteria Verified

- AC-1: `initPageHeadingScramble` uses `ScrollTrigger.create()` with `once: true` per element — confirmed
- AC-2: `start: "top bottom"` fires immediately for above-fold elements — confirmed by pattern
- AC-3: `once: true` prevents re-trigger on scroll back — confirmed per element
- AC-4: `ScrollTrigger.batch("[data-anim='stagger'] > *", ...)` with `interval: 0.04` and `stagger: 0.04` — confirmed
- AC-5: `[data-anim="stagger"] > * { opacity: 0; transform: translateY(20px); }` present in globals.css — confirmed
- AC-6: batch animates to `opacity: 1, y: 0` with 40ms stagger and `once: true` — confirmed
- AC-7: `[data-anim="stagger"] > *` in reduced-motion reset block — confirmed

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check

### Files exist
- components/layout/page-animations.tsx — modified, exists
- app/globals.css — modified, exists

### Commits exist
- 9da3179 — feat(03-03): replace setTimeout with ScrollTrigger in initPageHeadingScramble
- c554ebd — feat(03-03): add ScrollTrigger.batch stagger entry and CSS initial state

## Self-Check: PASSED
