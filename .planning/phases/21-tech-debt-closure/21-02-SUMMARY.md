---
phase: 21-tech-debt-closure
plan: 02
subsystem: scroll
tags: [lenis, scroll, context, reduced-motion, tech-debt]
dependency_graph:
  requires: [21-01]
  provides: [lenis.scrollTo routing for all programmatic scroll]
  affects: [25-interactive-detail-views]
tech_stack:
  added: []
  patterns: [React Context for hook-based instance sharing, lenisRef for DOM event handler access]
key_files:
  created: []
  modified:
    - components/layout/lenis-provider.tsx
    - hooks/use-scroll-restoration.ts
    - components/animation/page-transition.tsx
    - components/layout/back-to-top.tsx
    - components/layout/global-effects.tsx
    - components/layout/command-palette.tsx
decisions:
  - "lenisRef pattern for page-transition.tsx: transitionend DOM handler cannot close over React hook values — store Lenis in useRef updated by useEffect"
  - "immediate: true for scroll restoration and page transition wipe (matches original instant-scroll intent, not smooth)"
  - "lenis === null means reduced-motion is active, so window.scrollTo fallback uses behavior: auto (not smooth)"
metrics:
  duration: "2m 17s"
  completed: "2026-04-06T21:55:39Z"
  tasks_completed: 2
  files_modified: 6
---

# Phase 21 Plan 02: Lenis scrollTo Migration Summary

Replaced all `window.scrollTo` calls with `lenis.scrollTo` by adding React Context to LenisProvider and migrating 5 consumer files. Eliminates the scroll race condition where Lenis and window.scrollTo fight for scroll position. Prerequisites Phase 25 detail views which programmatically scroll to opened panels.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add LenisContext and useLenisInstance to LenisProvider | 884b61a | components/layout/lenis-provider.tsx |
| 2 | Migrate all window.scrollTo calls to lenis.scrollTo with fallback | 30c5a52 | hooks/use-scroll-restoration.ts, components/animation/page-transition.tsx, components/layout/back-to-top.tsx, components/layout/global-effects.tsx, components/layout/command-palette.tsx |

## Verification Results

1. `grep -rn "window\.scrollTo" components/ hooks/ app/` — all 5 matches are inside `} else {` fallback branches
2. `grep -rn "useLenisInstance" components/ hooks/` — matches in all 5 consumer files + lenis-provider.tsx (definition)
3. `grep -rn "lenis\.scrollTo|lenisRef\.current\.scrollTo" components/ hooks/` — matches in all 5 consumer files
4. `pnpm tsc --noEmit` — exit 0, no type errors
5. `pnpm build` — clean, 102KB shared bundle (unchanged from baseline)

## Decisions Made

- **lenisRef pattern for page-transition.tsx**: The `transitionend` DOM event handler is added via `addEventListener` inside a `useCallback` — it cannot safely close over a React hook value that may change. Store Lenis instance in `useRef(lenis)` and update via `useEffect(() => { lenisRef.current = lenis; }, [lenis])`. This is the pattern called out in AC-5.
- **`immediate: true` for scroll restoration and wipe**: Matches the original intent — instant position restore (not smooth) while the wipe panel covers the viewport, and instant scroll restore on page reload.
- **`behavior: "auto"` in else-branch fallbacks for global-effects.tsx**: When `lenis === null`, reduced-motion is active — instant scroll is correct. Removed the redundant `window.matchMedia` check from the onClick handler.

## Deviations from Plan

None — plan executed exactly as written.

## Requirements Addressed

- **TD-03**: lenis.scrollTo replaces window.scrollTo — COMPLETE

## Self-Check

- [x] components/layout/lenis-provider.tsx exists and exports useLenisInstance
- [x] hooks/use-scroll-restoration.ts contains useLenisInstance
- [x] components/animation/page-transition.tsx contains lenisRef
- [x] components/layout/back-to-top.tsx contains useLenisInstance
- [x] components/layout/global-effects.tsx contains useLenisInstance
- [x] components/layout/command-palette.tsx contains useLenisInstance
- [x] Commits 884b61a and 30c5a52 exist in git log
- [x] pnpm build clean — 102KB shared bundle

## Self-Check: PASSED
