---
phase: 13-config-provider
plan: "01"
subsystem: provider
tags: [provider, ssr, context, factory, gsap-motion, theme]
dependency_graph:
  requires: []
  provides: [DX-05]
  affects: [app/layout.tsx, lib/signalframe-provider.tsx, components/layout/signalframe-config.tsx]
tech_stack:
  added: []
  patterns: [hole-in-the-donut, client-wrapper-for-module-scope-factory, createContext-factory]
key_files:
  created:
    - lib/signalframe-provider.tsx
    - components/layout/signalframe-config.tsx
  modified:
    - app/layout.tsx
key_decisions:
  - createSignalframeUX called from 'use client' config wrapper, not module scope of Server Component
  - Standalone useSignalframe export alongside factory-returned hook for flexible consumer import
  - isDark SSR default: true (dark); DOM read deferred to useEffect to match blocking script
  - motionPreference: 'system' attaches MQL listener with cleanup; 'full'/'reduced' are static overrides
metrics:
  duration: "~2 minutes"
  completed: "2026-04-06T12:01:00Z"
  tasks_completed: 2
  files_changed: 3
---

# Phase 13 Plan 01: Config Provider Summary

One-liner: `createSignalframeUX(config)` factory via `'use client'` wrapper file — SSR-safe theme + GSAP motion control at app root.

## What Was Built

`lib/signalframe-provider.tsx` — client-only factory that creates a typed React context with:
- `createSignalframeUX(config)` returning `{ SignalframeProvider, useSignalframe }`
- `SignalframeUXConfig` accepting `defaultTheme` and `motionPreference`
- `UseSignalframeReturn` exposing `theme`, `setTheme`, and `motion` controller
- `motion.resume()` guarded by `prefersReduced` — no-op when reduced-motion is active
- Standalone `useSignalframe()` export for direct import without factory threading
- SSR-safe: `isDark` defaults `true` server-side, reads `classList.contains('dark')` on mount
- `motionPreference: 'system'` attaches MQL listener; `'full'/'reduced'` are static overrides

`components/layout/signalframe-config.tsx` — thin `'use client'` wrapper holding the module-scope `createSignalframeUX({ defaultTheme: 'dark' })` call.

`app/layout.tsx` — imports `SignalframeProvider` from the config wrapper; remains a Server Component with no `'use client'` directive.

## Acceptance Criteria Results

| AC | Description | Result |
|----|-------------|--------|
| AC-1 | createSignalframeUX exported from lib/signalframe-provider.tsx | PASS |
| AC-2 | 'use client' as first line | PASS |
| AC-3 | Config accepts defaultTheme + motionPreference string unions | PASS |
| AC-4 | useSignalframe() throws error naming SignalframeProvider | PASS |
| AC-5 | isDark reads classList.contains('dark'), not localStorage | PASS |
| AC-6 | motion.resume() guarded by prefersReduced | PASS |
| AC-7 | layout.tsx calls factory at module scope, mounts provider | PASS |
| AC-8 | layout.tsx has no 'use client' directive | PASS |
| AC-9 | pnpm tsc --noEmit exits 0 | PASS |
| AC-10 | pnpm build exits 0 | PASS |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Next.js 15 rejects module-scope 'use client' function call in Server Component**
- **Found during:** Task 2 — first `pnpm build` attempt
- **Issue:** `createSignalframeUX()` called at module scope in `app/layout.tsx` (Server Component) triggered: "Attempted to call createSignalframeUX() from the server but createSignalframeUX is on the client."
- **Fix:** Created `components/layout/signalframe-config.tsx` — a `'use client'` wrapper that holds the factory call and exports `SignalframeProvider`. `app/layout.tsx` imports from this wrapper. Mirrors the existing `SignalCanvasLazy`/`GlobalEffectsLazy` pattern already in the project.
- **Files modified:** components/layout/signalframe-config.tsx (created), app/layout.tsx (import updated)
- **Commit:** 5107d91

## Commits

| Hash | Message |
|------|---------|
| cfa69f1 | feat(13-01): create signalframe-provider.tsx — factory, context, provider, hook |
| 5107d91 | feat(13-01): mount SignalframeProvider in app root — hole-in-the-donut pattern |

## Self-Check: PASSED

All created files exist on disk. Both commits (cfa69f1, 5107d91) present in git history.
