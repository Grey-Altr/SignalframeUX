---
phase: 03-signal-expression
plan: "01"
subsystem: signal-css
tags: [globals.css, data-anim, hover-timing, section-reveal, progressive-enhancement]
dependency_graph:
  requires: []
  provides: [data-anim-fallback, asymmetric-hover-timing, hard-cut-section-reveal]
  affects: [app/globals.css, components/layout/page-animations.tsx]
tech_stack:
  added: []
  patterns: [css-attribute-presence-fallback, asymmetric-transition-timing, hard-cut-gsap]
key_files:
  created: []
  modified:
    - app/globals.css
    - components/layout/page-animations.tsx
decisions:
  - "[data-anim] catch-all placed after specific attribute-value rules — CSS specificity ensures [data-anim=\"section-reveal\"] overrides the presence selector for GSAP-animated elements"
  - "Asymmetric hover: base state holds 400ms (out), :hover overrides to 100ms (in) — this is the correct CSS pattern since base state governs the return transition"
  - "sf-hoverable:not(:hover) rule removed — redundant now that base state is --duration-slow"
  - "Hard cut section-reveal: duration 0.034 / ease none — DU aesthetic signature; opacity snaps, no lerp"
metrics:
  duration_minutes: 8
  completed_date: "2026-04-06"
  tasks_completed: 2
  tasks_total: 2
  files_modified: 2
  commits: 2
---

# Phase 3 Plan 01: CSS Interaction Layer and Progressive Enhancement Summary

CSS safety net and interaction timing foundation for SIGNAL: `[data-anim]` catch-all visibility fallback, 100ms-in/400ms-out asymmetric hover across all interaction classes, and section-reveal converted from 700ms fade to 34ms hard cut.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add [data-anim] catch-all fallback and update asymmetric hover timing | 87e8699 | app/globals.css |
| 2 | Convert section-reveal to 34ms hard-cut in page-animations.tsx | 08f282f | components/layout/page-animations.tsx |

## Changes Made

### app/globals.css

**Reduced-motion block** — added `[data-anim]` to the selector list so the catch-all is also reset under `prefers-reduced-motion: reduce`.

**[data-anim] catch-all** — new rule placed after the four specific `[data-anim="..."]` rules. CSS attribute presence selector (`[data-anim]`) has lower specificity than attribute value selectors (`[data-anim="section-reveal"]`), so the specific rules win and the catch-all only applies to unhandled `[data-anim]` values. Guarantees visibility without JS.

**Interaction class updates:**
- `.sf-pressable` base: `--duration-normal` → `--duration-slow` (400ms out)
- `.sf-pressable:hover`: added `transition-duration: var(--duration-fast)` (100ms snap-in)
- `.sf-hoverable` base: `--duration-normal` → `--duration-slow` (400ms out)
- `.sf-hoverable:hover`: added `transition-duration: var(--duration-fast)` (100ms snap-in)
- `.sf-hoverable:not(:hover)`: removed entirely (base now handles the 400ms out)
- `.sf-invert-hover` base: `--duration-fast` → `--duration-slow` for both bg + color (400ms out)
- `.sf-invert-hover:hover`: added `transition-duration: var(--duration-fast)` (100ms snap-in)
- `.sf-link-draw:hover::after`: added `transition-duration: var(--duration-fast)` (draw width at 100ms)

### components/layout/page-animations.tsx

Section-reveal `onEnter` handler: `duration: 0.7` → `0.034`, `ease: "power2.out"` → `"none"`. ScrollTrigger config (start, once) and `y: 0, opacity: 1` targets unchanged. No other animations in `initCoreAnimations` modified.

## Acceptance Criteria Verified

- AC-1: `[data-anim]` without specific CSS rule renders `opacity: 1` without JS
- AC-2: Catch-all rule at line 1034 — after specific rules at lines 1015–1028
- AC-3: `.sf-pressable` base uses `--duration-slow` (400ms out)
- AC-4: `.sf-pressable:hover` uses `--duration-fast` (100ms snap-in)
- AC-5: `.sf-hoverable` base uses `--duration-slow` (400ms out)
- AC-6: `.sf-invert-hover` base `--duration-slow`, hover `--duration-fast`
- AC-7: `.sf-link-draw:hover::after` overrides to `--duration-fast`
- AC-8: Section-reveal fires at `duration: 0.034` / `ease: "none"`
- AC-9: `[data-anim]` included in reduced-motion selector list

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check

### Files exist
- app/globals.css — modified, exists
- components/layout/page-animations.tsx — modified, exists

### Commits exist
- 87e8699 — feat(03-01): add [data-anim] catch-all fallback and asymmetric hover timing
- 08f282f — feat(03-01): convert section-reveal to 34ms hard cut

## Self-Check: PASSED
