---
phase: 28-route-infrastructure
plan: "01"
subsystem: routing
tags: [redirects, route-rename, next-config, playwright]
dependency_graph:
  requires: []
  provides: [/inventory route, /system route, /init route, 308 redirect chain]
  affects: [nav links (Plan 02), breadcrumbs (Plan 02)]
tech_stack:
  added: []
  patterns: [Next.js async redirects(), App Router directory rename]
key_files:
  created:
    - app/inventory/page.tsx
    - app/system/page.tsx
    - app/init/page.tsx
    - tests/phase-28-route-infra.spec.ts
  modified:
    - next.config.ts
decisions:
  - "Exact + wildcard redirect pairs (6 total) cover both root and nested paths per AC-1"
  - "Content copied verbatim — no updates to internal hrefs (/components, /tokens) in init/page.tsx; deferred to Plan 02 link surgery"
  - "Stale .next/types/ cache errors (3 entries) are build-artifact noise, not source errors — cleared on next build"
metrics:
  duration: "~8 minutes"
  completed: "2026-04-08T02:17:23Z"
  tasks_completed: 2
  files_created: 4
  files_modified: 1
---

# Phase 28 Plan 01: Route Infrastructure — Redirects + Directory Rename Summary

308 permanent redirects for three route renames (/components→/inventory, /tokens→/system, /start→/init) with wildcard pairs, new App Router directories at correct paths, old directories deleted, Playwright smoke test file ready.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add 308 redirects to next.config.ts and move route directories | 3e16898 | next.config.ts (M), app/inventory/page.tsx (C), app/system/page.tsx (C), app/init/page.tsx (C), app/components/ (D), app/tokens/ (D), app/start/ (D) |
| 2 | Create Phase 28 smoke test file | 99ba785 | tests/phase-28-route-infra.spec.ts (C) |

## Verification

- `grep -c "async redirects" next.config.ts` → 1 (PASS)
- `ls app/inventory/page.tsx app/system/page.tsx app/init/page.tsx` → all exist (PASS)
- `ls app/components/ app/tokens/ app/start/` → all fail "No such file or directory" (PASS)
- `tests/phase-28-route-infra.spec.ts` exists with 6 tests, 5× "308" references (PASS)
- `pnpm exec tsc --noEmit` → 0 source-level errors (PASS); 3 stale `.next/types/` cache errors for deleted routes (cleared on next build)

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- app/inventory/page.tsx: EXISTS
- app/system/page.tsx: EXISTS
- app/init/page.tsx: EXISTS
- tests/phase-28-route-infra.spec.ts: EXISTS
- next.config.ts has async redirects(): CONFIRMED (grep returns 1)
- Commit 3e16898: CONFIRMED (Task 1)
- Commit 99ba785: CONFIRMED (Task 2)
- Old directories app/components/, app/tokens/, app/start/: CONFIRMED DELETED
