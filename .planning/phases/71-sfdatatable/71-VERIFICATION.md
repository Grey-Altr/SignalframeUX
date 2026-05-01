---
phase: 71-sfdatatable
verified: 2026-05-01T00:00:00Z
status: passed
score: 8/8 requirements satisfied; 6/6 must-have truths verified; 5/5 critical locks held
re_verification:
  is_re_verification: false
---

# Phase 71: SFDataTable Verification Report

**Phase Goal (ROADMAP.md):** SFDataTable is shipped as a P3 lazy component with sort, filter, pagination, and row selection — the `_dep_dt_01_decision` ratification sets the precedent for runtime dep exceptions in this milestone.

**Verified:** 2026-05-01
**Status:** PASSED
**Re-verification:** No — initial verification

---

## Goal Achievement

Phase 71 ships the FRAME-layer SFDataTable<TData> headless data table over `@tanstack/react-table@8.21.3`, with a P3 lazy wrapper that lands the heavy dep in a separate chunk (homepage First Load JS unchanged at 187.6 KB / 200 KB target — 12.4 KB headroom preserved). The `_dep_dt_01_decision` 7-field block is the v1.10 precedent for runtime-dep exceptions, ratified at plan-time and back-filled with measured (not estimated) bundle_evidence including the lazy chunk size (`9339.7c1e528bda185d56.js`, 73,180 raw bytes / 19.3 KB gzip). 8/8 Playwright + axe specs green in 13.9s end-to-end on the verifier dev server.

### Observable Truths

| #   | Truth                                                                                                                                                | Status     | Evidence                                                                                                                                                                |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `_dep_dt_01_decision` 7-field block at top of `components/sf/sf-data-table.tsx` with measured bundle_evidence (not estimated)                        | VERIFIED   | sf-data-table.tsx:17-61. All 7 fields present. `bundle_evidence` array contains 11 measured entries including final lazy-chunk stamp. No TBD/placeholder strings remain. |
| 2   | DT-01 sort + DT-02 filter + DT-03 pagination + DT-04 row selection + DT-05 density/skeleton/empty wired through TanStack Table v8                    | VERIFIED   | sf-data-table.tsx:194-484. Sort `<button type="button">` + `getToggleSortingHandler()` + `aria-sort` on `<th>` + `▲ ▼ —` glyphs. Pagination `getPageCount() > 1` gate. Selection ColumnDef with `'indeterminate'` literal. Density CVA on `--sfx-space-1/2/3/4`. |
| 3   | DT-06 P3 lazy wrapper `SFDataTableLazy<TData>` via `next/dynamic({ ssr: false })`                                                                    | VERIFIED   | sf-data-table-lazy.tsx:37-52. `next/dynamic` + `ssr: false` + `<SFSkeleton>` fallback. Generic re-narrowed at boundary.                                                  |
| 4   | TST-03 Playwright + axe specs ship same-phase and pass against the playground fixture                                                                | VERIFIED   | tests/v1.10-phase71-sf-data-table.spec.ts (5 tests) + tests/v1.10-phase71-sf-data-table-axe.spec.ts (3 tests). Re-ran 8/8 PASS in 13.9s on verifier dev server.          |
| 5   | Production-grade audit: @tanstack/react-table absent from homepage chunks; devtools string absent from `.next/static/`; 200 KB First Load JS budget green | VERIFIED   | Bundle budget spec re-run (verifier session): PASS at 187.6 KB / 200 KB. SUMMARY documents homepage `/page` 12-chunk audit + 0 devtools strings; lazy chunks at 19.3 KB + 5.2 KB gzip live only on /dev-playground. |
| 6   | `_dep_dt_01_decision` precedent established for v1.10 runtime-dep exceptions (consumable by Phase 73 `_dep_re_01_decision`)                          | VERIFIED   | Schema borrows `_wmk_01_decision` 7-field shape verbatim; field-name adaptations documented. SUMMARY § decisions records the precedent + DEP-02 (Phase 73) cross-ref.    |

**Score:** 6/6 truths verified.

---

## Required Artifacts

| Artifact                                                          | Expected                                                                                              | Status     | Details                                                                                                                              |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `components/sf/sf-data-table.tsx`                                 | FRAME-layer SFDataTable<TData> impl with `_dep_dt_01_decision` block preserved                        | VERIFIED   | 496 lines. `_dep_dt_01_decision:` anchor at line 22; block fields all populated. Sort/filter/selection/pagination/density/skeleton/empty all wired via TanStack v8. |
| `components/sf/sf-data-table-lazy.tsx`                            | P3 lazy wrapper via next/dynamic({ ssr: false })                                                      | VERIFIED   | 52 lines. `next/dynamic` + `ssr: false` + `<SFSkeleton>` fallback. Generic re-narrowed at boundary; localized cast through dynamic.   |
| `components/sf/sf-checkbox.tsx`                                   | data-[state=indeterminate] horizontal-bar visual via `--sfx-primary-foreground` pair-slot              | VERIFIED   | 10 utility classes target the `data-[state=indeterminate]` selector. `before:bg-primary-foreground` + `before:h-[2px]` confirmed. `rounded-none` retained. |
| `hooks/use-debounced-value.ts`                                    | 10-LOC debounce primitive, zero new runtime deps                                                      | VERIFIED   | 27 lines (well under the 30-LOC ceiling). Imports only from `react`. No `lodash` substring. JSDoc + 300ms default delay.            |
| `app/dev-playground/sf-data-table/page.tsx` (renamed from `_dev`) | Playground fixture mounting SFDataTableLazy with 25 fixture rows for Playwright/axe                   | VERIFIED   | 70 lines. 25-row dataset (3 pages at pageSize=10). `data-testid="row-count"` exposes selected count. NOTE: original PLAN path `_dev/playground/...` was renamed (Rule 1 fix per fix commit `a907b09`) — Next.js App Router treats `_*` folders as private; the fix is the canonical path. |
| `tests/v1.10-phase71-sf-data-table.spec.ts`                       | 5 Playwright tests covering DT-01..04                                                                 | VERIFIED   | 116 lines. 5 `test(...)` cases: DT-01 sort cycle, DT-01 keyboard, DT-02 filter, DT-03 pagination, DT-04 selection. Re-ran 5/5 PASS.   |
| `tests/v1.10-phase71-sf-data-table-axe.spec.ts`                   | 3 axe-core scans (button-name+aria-allowed-attr, label+aria-required-attr, color-contrast)             | VERIFIED   | 113 lines. 3 `test(...)` cases. AxeBuilder per-rule scan precedent (Phase 66). Re-ran 3/3 PASS.                                       |
| `tests/v1.8-phase63-1-bundle-budget.spec.ts` (regression)         | Homepage First Load JS ≤ 200 KB (CLAUDE.md hard constraint)                                           | VERIFIED   | Re-ran during verification: PASS at 187.6 KB / 200 KB (12.4 KB headroom). Phase 71 contributes 0 KB to homepage path.                |
| `package.json` + `pnpm-lock.yaml`                                 | @tanstack/react-table@^8.21.3 declared + resolved                                                     | VERIFIED   | `package.json` `dependencies["@tanstack/react-table"] = "^8.21.3"`; `pnpm-lock.yaml` carries 3 references for the resolved tree.    |

---

## Key Link Verification

| From                                                  | To                                  | Via                                          | Status     | Details                                                                                                                                |
| ----------------------------------------------------- | ----------------------------------- | -------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `components/sf/sf-data-table.tsx`                     | `@tanstack/react-table`             | bare top-level import (no subpath)           | WIRED      | Line 67-79 imports 12 names from `"@tanstack/react-table"`. `grep -E "from ['\"]@tanstack/react-table/"` returns 0 (no subpath leak). |
| `components/sf/sf-data-table.tsx`                     | `@/components/sf` barrel            | imports SFTable family + SFCheckbox + SFInput + SFSkeleton + SFEmptyState + 6 SFPagination subcomponents | WIRED      | Lines 82-99. flexRender output threads through SFTableHeader/SFTableRow/SFTableHead/SFTableCell.                                       |
| `components/sf/sf-data-table.tsx`                     | `hooks/use-debounced-value.ts`      | direct import (DT-02)                        | WIRED      | Line 102: `import { useDebouncedValue } from "@/hooks/use-debounced-value";`. Used at line 231 with 300ms delay.                        |
| `components/sf/sf-data-table.tsx` selection ColumnDef | `components/sf/sf-checkbox.tsx`     | barrel import + `checked={'indeterminate'}` literal threading | WIRED      | Lines 268-279: header SFCheckbox passes `'indeterminate'` literal when `getIsSomeRowsSelected()` is true and not all selected.        |
| `components/sf/sf-data-table-lazy.tsx`                | `components/sf/sf-data-table.tsx`   | `next/dynamic` import + `ssr: false`         | WIRED      | Lines 39-48. Dynamic import correctly resolves the `SFDataTable` named export.                                                         |
| `app/dev-playground/sf-data-table/page.tsx`           | `components/sf/sf-data-table-lazy.tsx` | direct import (canonical lazy API path)    | WIRED      | Line 23. Renders `<SFDataTableLazy<Row> />` with 25-row fixture dataset.                                                                |
| `tests/v1.10-phase71-sf-data-table.spec.ts`           | `app/dev-playground/sf-data-table/page.tsx` | Playwright `page.goto(/dev-playground/sf-data-table)` | WIRED      | Line 20: PLAYGROUND_URL constant points to canonical `/dev-playground/sf-data-table`. Verifier curl confirmed HTTP 200.                 |
| `tests/v1.10-phase71-sf-data-table-axe.spec.ts`       | `@axe-core/playwright`              | `AxeBuilder` per-rule scan                   | WIRED      | Line 17: `import AxeBuilder from "@axe-core/playwright";`. Three test bodies invoke `new AxeBuilder({ page }).withRules(...).analyze()`. |

---

## Critical Lock Verification (per prompt)

| Lock                                | Check                                                                       | Required | Actual              | Verdict |
| ----------------------------------- | --------------------------------------------------------------------------- | -------- | ------------------- | ------- |
| Pattern B contract                  | `grep -c "sf-data-table" components/sf/index.ts`                            | 0        | 0                   | HOLDS   |
| D-04 chunk-id stability             | `grep -c "@tanstack/react-table" next.config.ts`                            | 0        | 0                   | HOLDS   |
| No TanStack subpath imports         | `grep -E "from ['\"]@tanstack/react-table/" components/sf/sf-data-table.tsx` | empty   | empty               | HOLDS   |
| bundle_evidence back-fill           | grep `Lazy chunk hosting @tanstack/react-table:` in sf-data-table.tsx        | ≥1      | 1 (line 50, 73180 raw bytes / 19.3 KB gzip)         | HOLDS   |
| 200 KB First Load JS hard target    | `tests/v1.8-phase63-1-bundle-budget.spec.ts` PASS                           | PASS    | PASS (187.6 KB / 200 KB; 12.4 KB headroom; verifier re-run 2026-05-01)                | HOLDS   |

All 5 critical locks held throughout Phase 71 and remained intact through verifier re-run.

---

## Requirements Coverage

| Requirement | Source Plan | Description (REQUIREMENTS.md)                                                                                                                                                  | Status    | Evidence                                                                                                                       |
| ----------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------ |
| DT-01       | 71-02 + 71-03 | Column sort cycle (asc → desc → none) + glyph + accessible header `<button>` + keyboard Enter/Space; composes `getSortedRowModel`                                                                   | SATISFIED | `<button type="button" onClick={h.column.getToggleSortingHandler()}>` co-located in sf-data-table.tsx:364-366. Spec DT-01 sort-cycle + DT-01 keyboard PASS. axe button-name + aria-allowed-attr + aria-valid-attr-value PASS. |
| DT-02       | 71-02       | Per-column + global filter, 300ms debounce; controlled + uncontrolled API                                                                                                       | SATISFIED | `useDebouncedValue(rawGlobal, 300)` at sf-data-table.tsx:231. Controlled `globalFilter` + `onGlobalFilterChange` props. Spec DT-02 PASS (debounced filter reduces row count then restores). |
| DT-03       | 71-03       | Pagination via existing SFPagination; controlled `pageIndex` / `pageSize` API; `getPaginationRowModel`                                                                          | SATISFIED | sf-data-table.tsx:330 `getPaginationRowModel()`; render block lines 442-481 composes SFPaginationContent/Item/Link/Previous/Next; conditional gate `getPageCount() > 1`. Spec DT-03 PASS. |
| DT-04       | 71-02       | Checkbox column with single + multi + indeterminate header state; composes SFCheckbox; selected-rows accessor exposed                                                            | SATISFIED | Selection ColumnDef sf-data-table.tsx:265-288. Header SFCheckbox passes `'indeterminate'` literal at `getIsSomeRowsSelected()`. SFCheckbox horizontal-bar visual ships in sf-checkbox.tsx:32. Spec DT-04 PASS. axe label + aria-required-attr PASS. |
| DT-05       | 71-02       | Density modes via CVA + skeleton + empty + JSDoc virtualize extension                                                                                                            | SATISFIED | `sfDataTableVariants` CVA at sf-data-table.tsx:108-123 (compact/default/comfortable on blessed stops 1/2/3/4). Skeleton branch at 402-412; empty branch at 413-419 (`<SFEmptyState title="NO DATA" />`). `@beta virtualize` JSDoc at 181-189 + cross-ref to `_dep_dt_02_decision`. axe color-contrast PASS. |
| DT-06       | 71-03       | P3 lazy via `sf-data-table-lazy.tsx` + `next/dynamic({ ssr: false })`; NOT in barrel                                                                                            | SATISFIED | sf-data-table-lazy.tsx:37-48 `next/dynamic` + `ssr: false` + SFSkeleton fallback. `grep -c "sf-data-table" components/sf/index.ts = 0` confirmed. |
| DEP-01      | 71-01 + 71-03 | `_dep_dt_01_decision` 7-field block ratified at plan-time; bundle_evidence MEASURED (not estimate); review_gate fires on TanStack v9 stable                                       | SATISFIED | sf-data-table.tsx:22-60 carries all 7 fields. `bundle_evidence` array has 11 measured entries — final entry `Lazy chunk hosting @tanstack/react-table: 9339.7c1e528bda185d56.js, 73180 raw bytes (19.3 KB gzip)`. No TBD strings remaining. `review_gate` fires on TanStack v9 stable. |
| TST-03      | 71-03       | Per-component Playwright + axe-core ship same-phase; controlled API + keyboard nav + WCAG AA                                                                                     | SATISFIED | 5 Playwright tests + 3 axe tests in `tests/v1.10-phase71-sf-data-table*.spec.ts`. Vacuous-green guards in beforeEach. Verifier re-run: 8/8 PASS in 13.9s.                  |

**No orphaned requirements.** All 8 IDs declared in plan frontmatters are present in REQUIREMENTS.md and SATISFIED. Plan-to-REQUIREMENTS coverage is complete.

---

## Anti-Patterns Scan

Files modified by Phase 71 (per SUMMARY key-files):
- `components/sf/sf-data-table.tsx` (created, 496 lines)
- `components/sf/sf-data-table-lazy.tsx` (created, 52 lines)
- `components/sf/sf-checkbox.tsx` (modified, +7/-2)
- `hooks/use-debounced-value.ts` (created, 27 lines)
- `app/dev-playground/sf-data-table/page.tsx` (created, 70 lines)
- `tests/v1.10-phase71-sf-data-table.spec.ts` (created, 116 lines)
- `tests/v1.10-phase71-sf-data-table-axe.spec.ts` (created, 113 lines)
- `package.json`, `pnpm-lock.yaml` (modified — dep declaration only)

| File                                                  | Pattern                                                  | Severity | Impact                                                                                              |
| ----------------------------------------------------- | -------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| (none)                                                | TODO / FIXME / HACK / XXX / placeholder                 | —        | None found. The "lands in Plan 02" / "lands in Plan 03" forward-references in earlier plans were superseded by the impl in those plans. Final state has no TODO/FIXME/HACK markers. |
| (none)                                                | `return null` / empty handler / `() => {}`               | —        | None found. All event handlers wire to TanStack updaters or component setters. The `virtualize` no-op fires a single console.warn (intentional v1.11 extension stub). |
| `components/sf/sf-data-table.tsx`                     | `console.warn` for virtualize stub                       | INFO     | Intentional. JSDoc documents v1.11 extension behavior; ref-guarded to fire once per mount. Forward-references `_dep_dt_02_decision`. |

No blocker or warning anti-patterns. The codebase reflects a substantively-implemented FRAME-layer data table with explicit forward-extension hooks (the virtualize prop), not stubs.

---

## Behavioral Verification (Live Test Re-run)

Verifier started a fresh dev server (`pnpm dev`) and re-ran the Phase 71 specs:

```
$ curl -o /dev/null -w "%{http_code}" http://localhost:3000/dev-playground/sf-data-table
200

$ pnpm exec playwright test tests/v1.10-phase71-sf-data-table.spec.ts \
                              tests/v1.10-phase71-sf-data-table-axe.spec.ts \
                              --project=chromium --reporter=line
8 passed (13.9s)

$ pnpm exec playwright test tests/v1.8-phase63-1-bundle-budget.spec.ts \
                              --project=chromium --reporter=line
1 passed
Total: 187.6 KB (budget: 200 KB, post-Phase-67 BND-06)

$ pnpm exec tsc --noEmit
(0 errors)
```

The verifier reproduced the SUMMARY's claimed 8/8 green + 200 KB headroom independently. The only delta from the SUMMARY's exact build IDs is webpack chunk hashes (`webpack-aa6002...` → `webpack-34ed3b2...`, etc.) — a normal byproduct of a fresh build. Total stayed exactly at 187.6 KB.

---

## Pre-existing Test Cluster Note (project memory `feedback_main_test_state_post_v1`)

The verifier did NOT run the full main test suite. Project memory documents ~22 pre-existing deferred test failures (clusters E/F/G/M + Lighthouse) that pre-date Phase 71 and are explicitly out of scope for phase-level verification. The phase prompt instructed verification to focus on (a) Phase 71's own 8 specs and (b) the bundle budget regression spec — both verified PASS above.

---

## Human Verification Required

None for this phase. SFDataTable is a FRAME-layer headless data table with deterministic, machine-verifiable behavior:

- Sort/filter/pagination/selection are all asserted via Playwright DOM observation (8/8 PASS).
- WCAG AA contrast + button-name + aria-required-attr verified by axe-core (3/3 PASS).
- Bundle posture verified by 200 KB regression spec + production-chunk audit script (documented in 71-03-SUMMARY.md).
- No animation, real-time, or external-service surfaces in scope.

Optional manual sanity check (NOT required for phase pass): visit `http://localhost:3000/dev-playground/sf-data-table` and visually confirm density variant toggling + pagination glyphs + sort glyphs (`▲ ▼ —`) match DU/TDR coded register. The 8 automated tests already exercise the underlying DOM state, so this is purely aesthetic.

---

## Phase Goal Verdict: PASSED

Phase 71 (SFDataTable) achieved its goal end-to-end. All 8 v1.10 Phase 71 requirement IDs (DT-01..06 + DEP-01 + TST-03) are SATISFIED with file + grep + spec + production-chunk-audit evidence. The `_dep_dt_01_decision` precedent is established for Phase 73's `_dep_re_01_decision` (Tiptap) and any future v1.10 runtime-dep introductions. Pattern B + D-04 + 200 KB First Load JS locks held throughout. Phase 71 ships clean.

---

_Verified: 2026-05-01_
_Verifier: Claude (gsd-verifier, Opus 4.7 1M)_
