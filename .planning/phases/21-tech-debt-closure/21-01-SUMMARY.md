---
phase: 21
plan: "01"
subsystem: animation/signal
tags: [tech-debt, webgl, observer-lifecycle, nan-guard, components-explorer]
dependency_graph:
  requires: []
  provides: [TD-01, TD-02, TD-04]
  affects: [components/animation/signal-mesh.tsx, components/animation/glsl-hero.tsx, components/blocks/components-explorer.tsx]
tech_stack:
  added: []
  patterns: [MutationObserver disconnect on cleanup, isNaN fallback guard for CSS var parsing]
key_files:
  created: []
  modified:
    - components/animation/signal-mesh.tsx
    - components/animation/glsl-hero.tsx
    - components/blocks/components-explorer.tsx
decisions:
  - "readSignalVars uses explicit isNaN() guard with inline raw() helper rather than || fallback — || fails when getPropertyValue returns truthy non-numeric strings like 'auto'"
  - "Observer disconnect placed inside the useGSAP cleanup return (not a separate useEffect) so it fires in the same teardown pass as the ticker removal"
  - "TOAST disambiguated with layer suffix in parens — (FRAME) and (SIGNAL) — matching the existing subcategory values for discoverability"
metrics:
  duration: "6 minutes"
  completed_date: "2026-04-06"
  tasks_completed: 2
  files_modified: 3
---

# Phase 21 Plan 01: Tech Debt Closure — Observer + NaN + TOAST Summary

Three surgical patches to WebGL animation scenes and ComponentsExplorer: MutationObserver lifecycle correction (TD-01), CSS var NaN guard (TD-02), duplicate TOAST display name resolution (TD-04).

## What Was Built

**TD-01 — MutationObserver disconnect on unmount**

Both `signal-mesh.tsx` and `glsl-hero.tsx` now disconnect and null-reset `_signalObserver` inside the `useGSAP` cleanup return, immediately after `gsap.ticker.remove(tickerFn)`. Previously the observer accumulated on each mount without cleanup, causing WebGL jank during frequent mount/unmount cycles — a critical fix before Phase 25 detail views dramatically increase mount frequency.

**TD-02 — isNaN guard in readSignalVars**

Replaced `parseFloat(value || "0.5")` pattern with an explicit `isNaN()` check in a local `raw()` helper. The `||` fallback fails when `getPropertyValue` returns a truthy non-numeric string (e.g. `"auto"` or `" "` with leading space) — `parseFloat` returns `NaN` in those cases, and the non-empty string is truthy so the fallback never fires. The `isNaN()` guard catches all NaN cases regardless of the raw string content.

**TD-04 — Distinct TOAST display names**

`ComponentsExplorer` COMPONENTS array: index `010` renamed from `"TOAST"` to `"TOAST (FRAME)"`, index `022` renamed from `"TOAST"` to `"TOAST (SIGNAL)"`. No other fields changed. Eliminates ambiguous grid entries before Phase 25 routes detail views by component name.

## Tasks

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | MutationObserver disconnect + isNaN guard (signal-mesh, glsl-hero) | 1ff1156 | components/animation/signal-mesh.tsx, components/animation/glsl-hero.tsx |
| 2 | Resolve duplicate TOAST display names | 823c95b | components/blocks/components-explorer.tsx |

## Verification

All acceptance criteria passed:

- AC-1: `grep -A5 "ticker.remove" signal-mesh.tsx` shows `_signalObserver.disconnect()` + `null` reset
- AC-2: `grep -A5 "ticker.remove" glsl-hero.tsx` shows `_signalObserver.disconnect()` + `null` reset
- AC-3: `grep "isNaN" signal-mesh.tsx` returns match
- AC-4: `grep "isNaN" glsl-hero.tsx` returns match
- AC-5: `grep 'name: "TOAST' components-explorer.tsx` shows `"TOAST (FRAME)"` at 010 and `"TOAST (SIGNAL)"` at 022
- AC-6: `pnpm tsc --noEmit` exits 0 with zero errors

## Deviations from Plan

None — plan executed exactly as written. Line numbers in plan were accurate for both cleanup return blocks and readSignalVars functions.

## Self-Check: PASSED

| Item | Status |
|------|--------|
| components/animation/signal-mesh.tsx | FOUND |
| components/animation/glsl-hero.tsx | FOUND |
| components/blocks/components-explorer.tsx | FOUND |
| .planning/phases/21-tech-debt-closure/21-01-SUMMARY.md | FOUND |
| commit 1ff1156 | FOUND |
| commit 823c95b | FOUND |
