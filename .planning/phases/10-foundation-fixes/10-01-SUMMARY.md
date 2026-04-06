---
phase: 10-foundation-fixes
plan: "01"
subsystem: globals-css, sf-section
tags: [signal-css-vars, type-safety, bgShift, css-custom-properties, foundation]
dependency_graph:
  requires: []
  provides: [FND-01, FND-02]
  affects: [phase-12-signal-wiring, sf-section-consumers, signal-overlay, page-animations]
tech_stack:
  added: []
  patterns: [":root css vars for runtime setProperty", "string union props over boolean presence attributes"]
key_files:
  created: []
  modified:
    - app/globals.css
    - components/sf/sf-section.tsx
decisions:
  - "--signal-* vars placed in :root (not @theme) — runtime-settable via JS setProperty(), not Tailwind design tokens"
  - "bgShift clean break to string union — no boolean | string hybrid, eliminates GSAP empty-string palette key bug"
metrics:
  duration_minutes: 8
  tasks_completed: 2
  files_modified: 2
  completed_date: "2026-04-06"
---

# Phase 10 Plan 01: Foundation CSS Vars + bgShift Type Fix Summary

SIGNAL runtime CSS defaults added to globals.css and SFSection bgShift prop narrowed from boolean to `"white" | "black"` string union.

## What Was Built

### Task 1: SIGNAL Runtime CSS Custom Property Defaults (app/globals.css)

Added three CSS custom properties to the `:root` block immediately after the VHS overlay tokens:

```css
/* ── SIGNAL Runtime Defaults ── */
/* Read by color-resolve.ts and WebGL uniforms. SignalOverlay overrides at runtime. */
--signal-intensity: 0.5;
--signal-speed: 1;
--signal-accent: 0;
```

Values derived from SignalOverlay's DEFAULTS constant: `intensity=50/100=0.5`, `speed=50/50=1.0`, `accent=0` (passthrough hue degrees). Eliminates magenta flash on first frame that occurred when color-resolve.ts read these vars before SignalOverlay had mounted and written its values.

Placement: inside `:root`, NOT inside `@theme` — these are runtime-settable vars that JavaScript writes via `document.documentElement.style.setProperty()`. Putting them in `@theme` would cause Tailwind v4 to generate unwanted utility classes.

### Task 2: SFSection bgShift Prop Type Fix (components/sf/sf-section.tsx)

Four targeted changes to the 51-line component:

1. **Interface:** `bgShift?: boolean` → `bgShift?: "white" | "black"`
2. **Render:** `data-bg-shift={bgShift ? "" : undefined}` → `data-bg-shift={bgShift}`
3. **JSDoc @param:** Updated to document "white" or "black" string values
4. **JSDoc @example:** `bgShift` bare attribute → `bgShift="white"` explicit value

The old boolean pattern wrote `data-bg-shift=""` (empty string) to the DOM. The GSAP `applyBgShift` function in `page-animations.tsx` reads `getAttribute("data-bg-shift")` as a key into a palette object `{ white: ..., black: ... }` — an empty string key returns `undefined`, silently breaking the animation. The string union fix makes the value explicit at the type level and correct at the DOM level.

No consumer call sites required updating — research confirmed zero usages of the `bgShift` prop in the codebase (all existing background shift usage passes `data-bg-shift` directly as a spread HTML attribute).

## Acceptance Criteria — All Passed

- [x] AC-1: `--signal-intensity: 0.5` in `:root`
- [x] AC-2: `--signal-speed: 1` and `--signal-accent: 0` in `:root`
- [x] AC-3: `bgShift="white"` compiles without TypeScript errors
- [x] AC-4: `bgShift={true}` now reports a TypeScript type error (boolean no longer accepted)
- [x] AC-5: `data-bg-shift` attribute receives `"black"` or `"white"` string value (not empty string)
- [x] AC-6: `pnpm tsc --noEmit` exits 0

## Verification Results

```
grep -n "signal-intensity|signal-speed|signal-accent" app/globals.css
  152:  /* ── SIGNAL Runtime Defaults ── */
  154:  --signal-intensity: 0.5;
  155:  --signal-speed: 1;
  156:  --signal-accent: 0;

pnpm tsc --noEmit → (no output, exit 0)

pnpm build → succeeds, all 6 routes compiled
```

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1    | e4ff901 | feat(10-01): add SIGNAL runtime CSS custom property defaults to globals.css |
| 2    | 81150ce | feat(10-01): fix SFSection bgShift prop type from boolean to string union |

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- [x] `app/globals.css` modified with `--signal-intensity: 0.5`, `--signal-speed: 1`, `--signal-accent: 0`
- [x] `components/sf/sf-section.tsx` modified with `bgShift?: "white" | "black"` and `data-bg-shift={bgShift}`
- [x] Commit e4ff901 exists
- [x] Commit 81150ce exists
- [x] `pnpm tsc --noEmit` exits 0
- [x] `pnpm build` succeeds
