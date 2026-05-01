---
phase: 71-sfdatatable
plan: 03
subsystem: sf-data-table-lazy-and-tst
tags: [dt-03, dt-06, tst-03, dep-01, sf-data-table-lazy, sf-pagination, playwright, axe-core, p3-lazy, pattern-b, dev-playground, bundle-audit]
status: complete
completed: 2026-05-01
duration: ~12m
requirements: [DT-03, DT-06, TST-03, DEP-01]
nyquist_compliant: true

dependency_graph:
  requires:
    - components/sf/sf-data-table.tsx (Plan 02 impl — sort/filter/selection/density)
    - components/sf/sf-pagination.tsx (existing primitive in barrel)
    - components/sf/sf-calendar-lazy.tsx (P3 lazy wrapper precedent)
    - "@tanstack/react-table@8.21.3 (Plan 01 install)"
    - tests/v1.9-phase66-arc-axe.spec.ts (AxeBuilder direct-rule scan precedent)
    - tests/v1.8-phase63-1-bundle-budget.spec.ts (200 KB budget gate)
    - .planning/phases/71-sfdatatable/71-RESEARCH.md (Pattern 4 + Pitfall B)
  provides:
    - components/sf/sf-data-table-lazy.tsx (consumer-facing P3 lazy wrapper — SFDataTableLazy<TData>)
    - app/dev-playground/sf-data-table/page.tsx (Playwright/axe fixture mount surface)
    - tests/v1.10-phase71-sf-data-table.spec.ts (5 Playwright tests, DT-01..04 coverage)
    - tests/v1.10-phase71-sf-data-table-axe.spec.ts (3 axe-core scans, button-name/label/color-contrast)
    - DT-03 pagination composition inside components/sf/sf-data-table.tsx
    - "_dep_dt_01_decision.bundle_evidence — back-filled with measured lazy-chunk size (19.3 KB gzip)"
  affects:
    - Phase 71 closes feature-complete (8/8 requirement IDs satisfied)
    - v1.10 Pattern B contract validated at production-build level (TanStack absent from homepage chunks)
    - Future P3 lazy wrappers consume sf-data-table-lazy.tsx as reference precedent

tech-stack:
  added: []  # No new runtime deps; @axe-core/playwright pre-existed (4.11.1)
  patterns:
    - "P3 lazy wrapper for generic-typed components — generic re-narrowing at boundary, localized cast through next/dynamic"
    - "Playground fixture in /dev-playground/* (NOT /_dev/*) — Next.js private-folder collision avoided"
    - "Per-rule axe scan with vacuous-green guard (table-visible + tbody count) before scanning"
    - "Production-build chunk audit — read .next/app-build-manifest.json pages['/page'] then grep each chunk"
    - "_dep_X_decision.bundle_evidence final stamp — measured lazy-chunk name + raw bytes + gzip"

key-files:
  created:
    - components/sf/sf-data-table-lazy.tsx (52 lines — SFDataTableLazy<TData> via next/dynamic ssr:false)
    - app/dev-playground/sf-data-table/page.tsx (65 lines — 25-row fixture)
    - tests/v1.10-phase71-sf-data-table.spec.ts (116 lines — 5 Playwright tests)
    - tests/v1.10-phase71-sf-data-table-axe.spec.ts (113 lines — 3 axe tests)
    - .planning/phases/71-sfdatatable/deferred-items.md (scope-boundary log for Plan 02 lint warning)
  modified:
    - components/sf/sf-data-table.tsx (+78/-1 lines — DT-03 pagination composition + bundle_evidence back-fill)

decisions:
  - "Playground route renamed from /_dev/playground/sf-data-table to /dev-playground/sf-data-table (Rule 1 fix). Next.js App Router treats folders prefixed with `_` as PRIVATE folders excluded from routing entirely; original plan path returned 404. New path returns HTTP 200, preserves public-discovery suppression (sitemap.ts hard-coded; no link from production)."
  - "axe-core rule list adjusted (Rule 3 fix): aria-checked is a state attribute, not an axe rule. Substituted aria-required-attr (which validates that role=checkbox carries the required aria-checked attribute). DT-04 axe test still covers checkbox a11y semantics; rule selection corrected."
  - "Pagination state owned by component internally; consumer override (paginationProp) wins when present. onPaginationChange wires both internal setter and consumer callback via TanStack updater pattern (mirrors Plan 02 onRowSelectionChange bridge)."
  - "SFPagination Previous/Next/Link components require href prop (anchor-based); used href='#' + e.preventDefault() in onClick to keep the anchor accessible while disabling navigation. Aligns with shadcn pagination contract."
  - "Production-build chunk audit reads from .next/app-build-manifest.json pages['/page'] (Next 15 App Router shape), NOT .next/build-manifest.json which lists pages['/'] = [] for App Router builds. Audit script in plan corrected during execution."
  - "Bundle_evidence back-filled with TWO chunks: 9339 (TanStack runtime, 73180 raw / 19.3 KB gzip) AND 7732 (SFDataTable component, 18050 raw / 5.2 KB gzip). Both lazy-loaded only on /dev-playground/sf-data-table; absent from homepage / page chunks."

metrics:
  tasks_completed: 5
  fix_commits: 1
  files_created: 5
  files_modified: 1
  lines_added: 424
  lines_removed: 1
  net_loc: 423
  bundle_first_load_kb: 187.6
  bundle_headroom_kb: 12.4
  lazy_chunk_tanstack_raw_bytes: 73180
  lazy_chunk_tanstack_gzip_bytes: 19738
  lazy_chunk_sfdatatable_raw_bytes: 18050
  lazy_chunk_sfdatatable_gzip_bytes: 5298
  playwright_tests_green: "8/8"
  duration_minutes: 12
---

# Phase 71 Plan 03: SFDataTable Lazy Wrapper + Pagination + TST-03 Summary

Closed Phase 71 feature-complete with 8 of 8 requirement IDs satisfied
(DT-01..06 + DEP-01 + TST-03). Shipped DT-03 pagination composition, the
P3 lazy wrapper consumers actually touch (`SFDataTableLazy<TData>`), the
playground fixture for Playwright, and 8 acceptance tests across 2 files
(5 Playwright + 3 axe-core). Production-grade chunk audit confirms
Pattern B holds at the bundle level (`@tanstack/react-table` absent from
homepage `/page` chunk manifest), zero `devtools` substring matches under
`.next/static/`, and homepage First Load JS unchanged at 187.6 KB / 200
KB hard target (12.4 KB headroom preserved). `_dep_dt_01_decision.bundle_evidence`
back-filled with the measured TanStack lazy chunk (`9339.7c1e528bda185d56.js`,
73,180 raw bytes / 19.3 KB gzip) — closing DEP-01.

## Tasks Shipped

| # | Task                                                    | Commit    | Files                                                  |
| - | ------------------------------------------------------- | --------- | ------------------------------------------------------ |
| 1 | DT-03 pagination composition (SFPagination)             | `5973238` | components/sf/sf-data-table.tsx                        |
| 2 | DT-06 SFDataTableLazy P3 wrapper                        | `c9cc3e5` | components/sf/sf-data-table-lazy.tsx                   |
| 3 | Playground fixture for Playwright/axe                   | `34c4488` | app/dev-playground/sf-data-table/page.tsx              |
| 3.fix | Rule 1 fix: rename _dev → dev-playground (NextJS) | `a907b09` | app/dev-playground/sf-data-table/page.tsx              |
| 4 | Playwright spec — DT-01..04 acceptance (TST-03)         | `fe1b1cc` | tests/v1.10-phase71-sf-data-table.spec.ts              |
| 5 | axe spec + production chunk audit + DEP-01 close        | `783efda` | tests/v1.10-phase71-sf-data-table-axe.spec.ts + sf-data-table.tsx + deferred-items.md |

## What Landed Per Requirement

### DT-03 (pagination)

- `getPaginationRowModel` + `PaginationState` imported from `@tanstack/react-table`
- 6 SFPagination sub-components imported from barrel (already exported pre-Phase-71)
- Internal `PaginationState` owned by component (default `{ pageIndex: 0, pageSize: 10 }`)
- Controlled `pagination` + `onPaginationChange` props for consumer override
- Conditional render: pagination block only when `table.getPageCount() > 1`
- `aria-disabled` threaded through Previous/Next via `getCanPreviousPage`/`getCanNextPage`
- `href="#"` + `e.preventDefault()` keeps anchors accessible while preventing navigation

### DT-06 (P3 lazy)

- `components/sf/sf-data-table-lazy.tsx` — 52 lines, mirrors `sf-calendar-lazy.tsx` precedent
- `next/dynamic({ ssr: false })` keeps `@tanstack/react-table` out of SSR bundle
- `<SFSkeleton className="h-[400px] w-full">` loading fallback
- Generic `<TData>` re-narrowed at `SFDataTableLazy` boundary; localized cast through dynamic import
- JSDoc warns maintainers: NEVER add to `sf/index.ts` barrel
- Pattern B contract verified: `grep -c "sf-data-table" components/sf/index.ts` = `0`

### TST-03 (Playwright + axe)

**`tests/v1.10-phase71-sf-data-table.spec.ts`** — 5 tests, all green in 13.7s end-to-end:

| Test  | Focus                                            | Status |
| ----- | ------------------------------------------------ | ------ |
| DT-01 | Sort cycle asc → desc → none on header click     | PASS   |
| DT-01 | Keyboard Enter + Space trigger sort identically  | PASS   |
| DT-02 | Filter input debounces 300ms, reduces row count, restores on clear | PASS |
| DT-03 | Page-2 click advances tbody rows (25/10 = 3 pages) | PASS |
| DT-04 | Row selection → indeterminate header → select-all | PASS  |

**`tests/v1.10-phase71-sf-data-table-axe.spec.ts`** — 3 tests, all green:

| Test  | Rules                                            | Status |
| ----- | ------------------------------------------------ | ------ |
| DT-01 | button-name + aria-allowed-attr + aria-valid-attr-value | PASS |
| DT-04 | label + aria-required-attr                        | PASS  |
| DT-05 | color-contrast (WCAG AA, light scheme)            | PASS  |

Vacuous-green guards in both spec files: `await expect(page.locator("table")).toBeVisible()` + `await expect(page.locator("tbody tr")).toHaveCount(10)` before any rule scan.

### DEP-01 (close)

`_dep_dt_01_decision.bundle_evidence` back-filled with three new measured entries:

```
- "Lazy chunk hosting @tanstack/react-table: 9339.7c1e528bda185d56.js, 73180 raw bytes (19.3 KB gzip) — measured Phase 71 Plan 03 close"
- "SFDataTable component lazy chunk: 7732.b87c4535003bf283.js, 18050 raw bytes (5.2 KB gzip) — sibling of TanStack runtime chunk"
- "Final ratification: Phase 71 Plan 03 close (TST-03 green; production chunk audit OK; BND-08 200 KB green at 187.6 KB)"
```

Production chunk audit (PART B):
- Build: `rm -rf .next/cache .next && ANALYZE=true pnpm build` — clean (1 pre-existing eslint warning logged to `deferred-items.md`)
- Homepage `/page` chunk count: 12
- TanStack symbol leak scan (`getCoreRowModel|table-core` regex): 0 matches across all 12 homepage chunks
- Devtools string scan (`react-table-devtools|tanstack.*devtools|TanStackTableDevtools` regex): 0 matches across `.next/static/`
- Bundle budget spec (`tests/v1.8-phase63-1-bundle-budget.spec.ts`): PASS at 187.6 KB / 200 KB

## End-to-End Verification

```
=== (1) Full Playwright + axe pass ===
8/8 tests green in 13.7s

=== (2) Production-grade bundle audit ===
rm -rf .next/cache .next && ANALYZE=true pnpm build → 0
tests/v1.8-phase63-1-bundle-budget.spec.ts → PASS (187.6 KB / 200 KB)

=== (3) Pattern B + D-04 locks ===
grep -c "sf-data-table" components/sf/index.ts → 0
grep -c "@tanstack/react-table" next.config.ts → 0

=== (4) Production chunk audit ===
.next/static/ devtools string scan → 0 hits
Homepage /page chunks (12 files): TanStack runtime symbols absent → all clean

=== (5) Decision block fully populated ===
grep -E "TBD" components/sf/sf-data-table.tsx → empty
grep -E "Lazy chunk hosting @tanstack/react-table:.*\.js, [0-9]+ raw bytes" → 1 match

=== (6) TS clean ===
pnpm exec tsc --noEmit → 0 errors

=== (7) Worktree status ===
Only pre-existing baseline noise (.planning/STATE.md, ROADMAP.md, config.json, .lighthouseci/links.json)
```

## Locks Held

| Lock                          | Mechanism                                                  | Verification                                                      |
| ----------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------- |
| Pattern B contract            | sf-data-table + sf-data-table-lazy NOT in barrel           | `grep -c "sf-data-table" components/sf/index.ts` → `0`            |
| D-04 chunk-id stability       | next.config.ts unchanged; no @tanstack/react-table entry   | `grep -c "@tanstack/react-table" next.config.ts` → `0`            |
| Devtools subpath absence      | Production chunk scan + Plan 02 anti-pattern comment       | `grep -rEl "tanstack.*devtools" .next/static/` → empty            |
| Zero border-radius            | SFPagination primitives carry `rounded-none` (Plan 02 carry) | Existing repo convention; no override needed                    |
| 200 KB First Load JS hard target | Bundle budget spec green at 187.6 KB                    | `tests/v1.8-phase63-1-bundle-budget.spec.ts` PASS                 |
| Worktree-leakage guard        | Each task commit modified ONLY its declared files          | `git show --stat` per commit confirms clean attribution           |
| Vacuous-green guard           | beforeEach asserts table-visible + 10 tbody rows           | All 8 tests would fail on a 404 / blank fixture                   |

## Deviations from Plan

Three deviations applied during execution. All are auto-fix per execute-plan deviation rules.

### Auto-fixed Issues

**1. [Rule 1 - Bug] Playground path /_dev/playground/sf-data-table unreachable**

- **Found during:** Task 3 verification (curl probe returned 404)
- **Issue:** Plan specified `app/_dev/playground/sf-data-table/`. Next.js App Router treats folders prefixed with `_` as PRIVATE folders that are excluded from routing entirely (returns 404). Playwright cannot reach the fixture.
- **Fix:** Renamed `app/_dev/playground/` → `app/dev-playground/` (flattened structure to remove redundant `playground` subdirectory level since `dev-playground` already conveys the role). Updated all 4 consumers (page.tsx comment, Playwright spec URL, axe spec URL, this SUMMARY).
- **Files modified:** `app/dev-playground/sf-data-table/page.tsx`
- **Commit:** `a907b09` (separate fix commit, between Tasks 3 and 4)
- **Public-discovery suppression preserved:** sitemap.ts is hard-coded (verified Phase 71); no link from production navigation; directory name `dev-playground` self-documents as fixture surface.

**2. [Rule 3 - Blocking] Invalid axe rule name `aria-checked`**

- **Found during:** Task 5 axe spec first run (axe-core threw "unknown rule `aria-checked`")
- **Issue:** Plan action specified the DT-04 axe test should scan `["label", "aria-checked"]`. `aria-checked` is a state attribute (`role="checkbox"` carries it as `"true" | "false" | "mixed"`), NOT an axe-core rule.
- **Fix:** Substituted `aria-required-attr` — the rule that validates `role="checkbox"` elements MUST carry `aria-checked`. Semantics preserved: DT-04 checkbox a11y still covered.
- **Files modified:** `tests/v1.10-phase71-sf-data-table-axe.spec.ts`
- **Commit:** `783efda` (Task 5 atomic commit; fix landed before commit)

**3. [Rule 3 - Blocking] Production-build chunk-audit script targeted wrong manifest**

- **Found during:** Task 5 PART B execution (initial `node -e` script reported homepage chunks count = 0)
- **Issue:** Plan action specified reading `.next/build-manifest.json` `m.pages['/']`. Next 15 App Router populates `.next/app-build-manifest.json` `pages['/page']` instead; `build-manifest.json` `pages['/']` is `[]` for App Router builds.
- **Fix:** Read from `.next/app-build-manifest.json` with `pages['/page']` fallback to `pages['/']`. Audit shape verified (12 chunks scanned).
- **Files modified:** None (in-flight script only; final audit logged in this SUMMARY)
- **Commit:** N/A (transient script; not committed)

## Authentication Gates

None encountered.

## Worktree Hygiene

Each commit verified clean via `git show --stat HEAD~N`:

- Commit `5973238`: `components/sf/sf-data-table.tsx` only (1 file, +75/-1 lines — pagination composition)
- Commit `c9cc3e5`: `components/sf/sf-data-table-lazy.tsx` only (1 file, +52 lines — lazy wrapper)
- Commit `34c4488`: `app/_dev/playground/sf-data-table/page.tsx` only (1 file, +65 lines — playground)
- Commit `a907b09`: rename + path-comment update (1 file, +12/-7 lines — Rule 1 fix)
- Commit `fe1b1cc`: `tests/v1.10-phase71-sf-data-table.spec.ts` only (1 file, +116 lines — Playwright)
- Commit `783efda`: 3 files (axe spec +113, sf-data-table.tsx +3, deferred-items.md +12)

Pre-existing modifications to `.planning/STATE.md`, `.planning/ROADMAP.md`,
`.planning/config.json`, and untracked `.lighthouseci/links.json` are
baseline noise from before Plan 03 started; NOT touched by any Plan 03
commit (orchestrator owns those writes per execute-plan contract).

## Forward Links

- **Phase 72 (SFCombobox)** — next v1.10 component plan; should follow same Pattern B + P3 lazy posture if any heavy dep introduced (e.g., `cmdk` is already in barrel from prior milestone, may not need ratification block).
- **Phase 73 (SFRichEditor)** — `_dep_re_01_decision` block uses Phase 71's two precedents: schema (`_dep_dt_01_decision`) + the back-fill discipline (lazy-chunk-name + raw bytes from `ANALYZE=true pnpm build`).
- **v1.11 SFDataTableVirtual (`_dep_dt_02_decision`)** — `virtualize` prop in Plan 02 impl is the documented extension hook; v1.11 swaps the no-op + console.warn for a real `useVirtualizer` integration.
- **Phase 76 audit** — final v1.10 audit will re-run `grep -c "sf-data-table" components/sf/index.ts` (must be 0) and the production-chunk devtools scan as final lock-in checks.

## Self-Check: PASSED

- [x] `components/sf/sf-data-table-lazy.tsx` exists at `/Users/greyaltaer/code/projects/SignalframeUX/components/sf/sf-data-table-lazy.tsx` (52 lines, verified via grep)
- [x] `app/dev-playground/sf-data-table/page.tsx` exists with 25-row fixture
- [x] `tests/v1.10-phase71-sf-data-table.spec.ts` exists with 5 tests (`grep -c '^  test('` = 5)
- [x] `tests/v1.10-phase71-sf-data-table-axe.spec.ts` exists with 3 tests (`grep -c '^  test('` = 3)
- [x] `components/sf/sf-data-table.tsx` contains DT-03 pagination block (`getPaginationRowModel` + `SFPaginationLink` + `table.previousPage` + `table.nextPage` + `table.setPageIndex` + `table.getPageCount` + `getCanPreviousPage` + `getCanNextPage` all present)
- [x] `_dep_dt_01_decision.bundle_evidence` final entry: `Lazy chunk hosting @tanstack/react-table: 9339.7c1e528bda185d56.js, 73180 raw bytes` (verifiable: `grep -E "Lazy chunk hosting @tanstack/react-table:.*\.js, [0-9]+ raw bytes" components/sf/sf-data-table.tsx` returns 1 match)
- [x] All 6 commits exist in `git log`: `5973238`, `c9cc3e5`, `34c4488`, `a907b09`, `fe1b1cc`, `783efda`
- [x] Pattern B contract: `grep -c "sf-data-table" components/sf/index.ts` → `0`
- [x] D-04 lock: `grep -c "@tanstack/react-table" next.config.ts` → `0`
- [x] Production-build chunk audit: `@tanstack/react-table` symbols absent from all 12 homepage `/page` chunks
- [x] Devtools string scan under `.next/static/`: 0 hits
- [x] Bundle budget spec: PASS at 187.6 KB / 200 KB (12.4 KB headroom)
- [x] TypeScript: `pnpm exec tsc --noEmit` returns 0 errors
- [x] Playwright + axe: 8/8 tests green in 13.7s end-to-end
- [x] No TBD strings remaining in `components/sf/sf-data-table.tsx`
