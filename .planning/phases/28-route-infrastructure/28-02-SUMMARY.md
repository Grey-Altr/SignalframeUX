---
phase: 28-route-infrastructure
plan: "02"
subsystem: routing
tags: [route-rename, link-surgery, nav, sitemap, playwright]
dependency_graph:
  requires: [28-01]
  provides: [zero old route strings in source (AC-10), all nav/footer/command links updated, sitemap correct, tests updated]
  affects: []
tech_stack:
  added: []
  patterns: [grep-to-zero link audit, route string surgery across 9 files]
key_files:
  created: []
  modified:
    - components/layout/nav.tsx
    - components/layout/footer.tsx
    - components/layout/command-palette.tsx
    - app/sitemap.ts
    - components/blocks/hero.tsx
    - components/blocks/manifesto-band.tsx
    - app/init/page.tsx
    - lib/component-registry.ts
    - tests/phase-25-detail-view.spec.ts
decisions:
  - "tests/phase-28-route-infra.spec.ts retains old route strings intentionally — those lines test that /components, /tokens, /start return 308 redirects, not navigation links"
  - "app/sitemap.ts uses template literals (${BASE}/inventory) not quoted strings — grep-c pattern in plan verification was mismatched but content is correct"
metrics:
  duration: "~6 minutes"
  completed: "2026-04-08T02:35:00Z"
  tasks_completed: 2
  files_created: 0
  files_modified: 9
---

# Phase 28 Plan 02: Route Infrastructure — Link Surgery Summary

Zero old route strings in all source nav/link/sitemap files; all 9 files updated with /inventory, /system, /init route names and grep-to-zero AC-10 passes (excluding intentional redirect smoke tests and build artifacts).

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Update all navigation and layout link references | 41edafc | nav.tsx (M), footer.tsx (M), command-palette.tsx (M), sitemap.ts (M) |
| 2 | Update block components, init page, registry, and tests | 0b82633 | hero.tsx (M), manifesto-band.tsx (M), app/init/page.tsx (M), component-registry.ts (M), phase-25-detail-view.spec.ts (M) |

## Verification

- `grep -n '"/components"\|"/tokens"\|"/start"' nav.tsx footer.tsx command-palette.tsx sitemap.ts` → 0 results (PASS)
- `grep -c '"/inventory"' components/layout/nav.tsx` → 1 (PASS)
- `grep -c '"/system"' components/layout/nav.tsx` → 1 (PASS)
- `grep -c '"/init"' components/layout/nav.tsx` → 1 (PASS)
- `grep -n 'inventory' app/sitemap.ts` → `/inventory` present on line 8 (PASS)
- `grep -c 'goto("/inventory")' tests/phase-25-detail-view.spec.ts` → 4 (PASS)
- `pnpm exec tsc --noEmit` → 0 source-level errors (PASS)
- Remaining `"/components"` hits: 3 lines in `tests/phase-28-route-infra.spec.ts` — intentional redirect verification tests, correct behavior

## Deviations from Plan

### Clarification (not a deviation)

**1. phase-28-route-infra.spec.ts retains old route strings**
- **Found during:** Task 2 grep-to-zero verification
- **Issue:** AC-10 grep returns 3 hits in `tests/phase-28-route-infra.spec.ts`
- **Explanation:** These are `request.get("/components")` calls that verify the 308 redirect fires from the old URL. They are redirect smoke tests, not stale navigation links. Removing them would break redirect verification.
- **Action:** No change — correct behavior, documented.

**2. sitemap.ts uses template literals not quoted strings**
- **Found during:** Task 1 verification
- **Issue:** Plan verification command `grep -c '"/inventory"' app/sitemap.ts` returns 0 because sitemap uses `${BASE}/inventory` template literals
- **Explanation:** Content is correct (`/inventory`, `/system`, `/init` all present). Grep pattern in plan was mismatched for this file's syntax.
- **Action:** Verified content directly with `grep -n 'inventory\|system\|init' app/sitemap.ts` — all three present.

## Self-Check: PASSED

- components/layout/nav.tsx: `/inventory`, `/system`, `/init` present (grep confirmed)
- components/layout/footer.tsx: old links replaced (grep-to-zero on file passes)
- components/layout/command-palette.tsx: NAV_ITEMS updated (grep-to-zero on file passes)
- app/sitemap.ts: template literals use new routes (content verified)
- components/blocks/hero.tsx: CTA href=/init (updated)
- components/blocks/manifesto-band.tsx: 4 links updated (/init x2, /inventory, /system)
- app/init/page.tsx: NEXT_CARDS + community link updated (3 hrefs)
- lib/component-registry.ts: JSX code sample href=/inventory (updated)
- tests/phase-25-detail-view.spec.ts: 4x goto("/inventory") confirmed
- Commit 41edafc: CONFIRMED (Task 1)
- Commit 0b82633: CONFIRMED (Task 2)
