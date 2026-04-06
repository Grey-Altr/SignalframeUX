---
phase: 03-signal-expression
plan: "02"
subsystem: animation
tags: [canvas-cursor, signal-layer, intersection-observer, particle-trail, raf]
one_liner: "Canvas crosshair + alpha-decay particle trail scoped to [data-cursor] sections via IntersectionObserver, replacing div-based CustomCursor"

dependency_graph:
  requires: []
  provides:
    - components/animation/canvas-cursor.tsx (CanvasCursor)
  affects:
    - components/layout/global-effects.tsx (GlobalEffects now renders CanvasCursor)

tech_stack:
  added: []
  patterns:
    - "Canvas 2D requestAnimationFrame render loop with tab-hidden pause"
    - "IntersectionObserver for section-scoped activation"
    - "1x1 probe canvas trick for OKLCH→RGB resolution at mount"
    - "devicePixelRatio scaling for HiDPI sharpness"

key_files:
  created:
    - components/animation/canvas-cursor.tsx
  modified:
    - components/layout/global-effects.tsx

key_decisions:
  - "Canvas zIndex accepts only number in React CSSProperties — used 'as unknown as number' cast for CSS custom property string value; this is a typing limitation, not a design error"
  - "Color resolution via probe 1x1 canvas rather than manual oklch→sRGB math — correct, maintainable, handles any CSS value browser can parse"
  - "CustomCursor function definition preserved in global-effects.tsx for rollback capability — not exported, tree-shaken at build time"
  - "activeSectionCount counter pattern (not boolean toggle) correctly handles multiple [data-cursor] sections intersecting simultaneously"

metrics:
  duration_minutes: 5
  completed_date: "2026-04-06"
  tasks_completed: 2
  tasks_total: 2
  files_created: 1
  files_modified: 1
requirements_completed: [SIG-09]
---

# Phase 03 Plan 02: Canvas Cursor Summary

Canvas crosshair + alpha-decay particle trail scoped to [data-cursor] sections via IntersectionObserver, replacing div-based CustomCursor.

## What Was Built

`CanvasCursor` — a `'use client'` animation component in `components/animation/canvas-cursor.tsx` that renders a fixed-position full-viewport canvas with:

- **Crosshair:** 4 arms extending 24px from cursor center, 1px stroke, color from `--color-primary` (OKLCH resolved to RGB via probe canvas at mount)
- **Particle trail:** Alpha-decay dots (alpha -= 0.02/frame), capped at 60 particles, drawn oldest-first for correct painter order
- **Section scoping:** IntersectionObserver on all `[data-cursor]` elements — `activeSectionCount` ref counter correctly handles multiple sections intersecting simultaneously; canvas clears when no sections are active
- **Touch guard:** Exits useEffect early on `(pointer: coarse)` — no canvas writes, no listeners attached
- **Tab visibility:** `visibilitychange` listener cancels rAF on hide, restarts on show
- **HiDPI:** `devicePixelRatio` scaling on canvas dimensions, CSS size locked to 100vw/100vh
- **Canvas style (AC-8):** `position: fixed; inset: 0; pointer-events: none; z-index: var(--z-cursor, 9999)`

`GlobalEffects` updated: import added, `{/* <CustomCursor /> */}` replaced with `<CanvasCursor />`.

## Acceptance Criteria Status

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | 'use client' directive + CanvasCursor export | PASS |
| AC-2 | No canvas/listeners on (pointer: coarse) | PASS |
| AC-3 | Magenta crosshair at mouse position in [data-cursor] section | PASS |
| AC-4 | Fading particle trail with alpha decay | PASS |
| AC-5 | rAF cancels on tab hidden, resumes on visible | PASS |
| AC-6 | Canvas clears when mouse outside [data-cursor] sections | PASS |
| AC-7 | GlobalEffects renders CanvasCursor (not CustomCursor) | PASS |
| AC-8 | Canvas: fixed, inset 0, pointer-events none, z-cursor token | PASS |

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check

### Files

- [x] `components/animation/canvas-cursor.tsx` — created
- [x] `components/layout/global-effects.tsx` — modified

### Commits

- `f8a3a68` — feat(03-02): create canvas-cursor with crosshair + particle trail
- `9af4878` — feat(03-02): wire CanvasCursor into GlobalEffects

## Self-Check: PASSED
