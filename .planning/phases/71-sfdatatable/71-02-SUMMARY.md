---
phase: 71-sfdatatable
plan: 02
subsystem: sf-data-table-impl
tags: [dt-01, dt-02, dt-04, dt-05, sf-data-table, tanstack-react-table, sf-checkbox-indeterminate, use-debounced-value, density-cva, pattern-b, frame-layer, p3-lazy]
status: complete
completed: 2026-05-01
duration: ~5m
requirements: [DT-01, DT-02, DT-04, DT-05]
nyquist_compliant: true

dependency_graph:
  requires:
    - components/sf/sf-data-table.tsx (Plan 01 placeholder + _dep_dt_01_decision block)
    - "@tanstack/react-table@8.21.3 (Plan 01 install)"
    - components/sf/sf-table.tsx (SFTable family — composed via barrel)
    - components/sf/sf-checkbox.tsx (Task 2 of this plan extends with indeterminate visual)
    - components/sf/sf-input.tsx (filter input)
    - components/sf/sf-skeleton.tsx (loading state)
    - components/sf/sf-empty-state.tsx (empty branch)
    - components/sf/sf-scroll-area.tsx (direct import — DCE'd from barrel post-Phase-67)
    - lib/utils.ts (cn helper)
    - .planning/phases/71-sfdatatable/71-RESEARCH.md (Patterns 4, 5, 6, 8 verbatim references)
  provides:
    - hooks/use-debounced-value.ts (DT-02 300ms primitive — consumed by SFDataTable filter)
    - components/sf/sf-checkbox.tsx data-[state=indeterminate] visual treatment (horizontal-bar fill via --sfx-primary-foreground)
    - components/sf/sf-data-table.tsx SFDataTable<TData> Client Component impl — DT-01 sort + DT-02 filter + DT-04 selection + DT-05 density/skeleton/empty/JSDoc-virtualize
  affects:
    - Plan 03 (DT-03 pagination + DT-06 lazy wrapper + TST-03 Playwright/axe) — directly consumes SFDataTable export and the playground fixture (Wave 0) will mount it
    - Future v1.11 SFDataTableVirtual (`_dep_dt_02_decision`) — virtualize prop is the documented extension hook

tech-stack:
  added:
    - "hooks/use-debounced-value.ts (10-LOC primitive; zero new runtime deps)"
  patterns:
    - "FRAME-layer headless data table — TanStack v8 state machine wired to SFTable family"
    - "Pattern 4 (sort header <button type=button> + aria-sort on <th> + flat geometric ▲ ▼ — glyphs)"
    - "Pattern 5 (selection ColumnDef with table.getIsSomeRowsSelected() → SFCheckbox checked='indeterminate')"
    - "Pattern 8 (density CVA on blessed stops 1/2/3/4 — sf-button.tsx size precedent)"
    - "Controlled global filter API with component-owned 300ms debounce (consumer fires post-debounce, not per-keystroke)"
    - "@beta JSDoc extension-point convention referencing future _dep_dt_02_decision"
    - "Anti-pattern source comments: zero TanStack subpath imports (bundle audit Phase 76 BND-08)"

key-files:
  created:
    - hooks/use-debounced-value.ts (27 lines — useDebouncedValue<T>(value, delay=300))
  modified:
    - components/sf/sf-checkbox.tsx (+7/-2 lines — data-[state=indeterminate] horizontal-bar pseudo-element via --sfx-primary-foreground)
    - components/sf/sf-data-table.tsx (+363/-7 lines — SFDataTable<TData> impl; _dep_dt_01_decision block preserved verbatim from Plan 01)

decisions:
  - "useDebouncedValue rationale comment scrubbed of the literal 'lodash' substring (avoid-third-party-debounce-libs phrasing) so the plan's `! grep -q lodash` acceptance gate passes — semantics preserved."
  - "Anti-pattern reminder comment in sf-data-table.tsx reworded to avoid the literal `from \"@tanstack/react-table/...\"` substring (which would otherwise trip the plan's `grep -E from ['\\\"]@tanstack/react-table/` zero-match acceptance gate) — semantics preserved as 'never use any TanStack Table sub-path'."
  - "Selection column `cell` callback uses `row.toggleSelected(!!v)` instead of `row.getToggleSelectedHandler()` because TanStack's getToggleSelectedHandler returns a CHANGE-event handler that expects e.target.checked, while SFCheckbox (Radix-based) emits a boolean via onCheckedChange. The toggleSelected(boolean) overload matches Radix's signature directly — zero adapter glue."
  - "onRowSelectionChange wrapped in functional-updater bridge so consumers receiving the canonical (state) => state callback shape get the resolved next-state object, while still feeding TanStack's internal updater pattern."
  - "Empty-state title 'NO DATA' chosen as smallest-payload semantic placeholder; consumers can wrap SFDataTable for project-specific copy without reaching into the impl."
  - "Plan-1 _dep_dt_01_decision block (lines 17-58 of Plan-01 file) preserved BYTE-FOR-BYTE — only the body of the file (post-line-58) was rewritten. All 8 measured bundle_evidence entries, version 8.21.3 pin, review_gate trigger, and ratified_to_main_via reference held intact."

metrics:
  tasks_completed: 3
  files_created: 1
  files_modified: 2
  lines_added: 397
  lines_removed: 9
  net_loc: 388
  bundle_first_load_kb_pre: 187.6
  bundle_first_load_kb_post: 187.6
  bundle_headroom_kb: 12.4
  duration_minutes: 5
---

# Phase 71 Plan 02: SFDataTable Sort + Filter + Selection + Density Summary

Shipped the SFDataTable<TData> FRAME-layer headless data table. TanStack
Table v8 state machine wired to the existing SFTable family + SFCheckbox
(extended with horizontal-bar indeterminate visual) + SFInput (filter) +
new in-house useDebouncedValue 300ms hook. Density CVA on blessed
spacing stops, sort headers as `<button type="button">` with flat
geometric `▲ ▼ —` glyphs (DU/TDR coded register, NOT Lucide chevrons),
@beta virtualize JSDoc extension point referencing v1.11
`_dep_dt_02_decision`. Plan-01 `_dep_dt_01_decision` 7-field block
preserved verbatim. Pattern B contract held: file is NOT in the barrel,
no TanStack subpath imports, no `next.config.ts` change. Bundle budget
unchanged at 187.6 KB / 200 KB (12.4 KB headroom — placeholder still
has zero homepage import path; lazy wrapper lands Plan 03).

## Tasks Shipped

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | useDebouncedValue hook (DT-02 300ms primitive, no lodash) | `bf54b79` | hooks/use-debounced-value.ts |
| 2 | SFCheckbox indeterminate visual (horizontal bar via `--sfx-primary-foreground` pair-slot) | `c2d314e` | components/sf/sf-checkbox.tsx |
| 3 | SFDataTable impl — sort + filter + selection + density CVA + skeleton + empty + @beta virtualize | `a37f42d` | components/sf/sf-data-table.tsx |

## What Landed Per Requirement

### DT-01 (sort)

- `<button type="button" onClick={column.getToggleSortingHandler()}>` inside `<SFTableHead aria-sort=...>` (Pattern 4 verbatim)
- Click cycles `'asc' → 'desc' → false`; visible glyph swap `▲ → ▼ → —` (flat geometric, FRAME-aligned)
- `<th aria-sort>` updates between `"ascending"`, `"descending"`, `"none"`
- Keyboard: native `<button>` Enter/Space activation — no JS handler needed
- Paired `sr-only` text announces direction
- `column.getCanSort()` branch falls through to plain `flexRender(header)` for non-sortable columns

### DT-02 (filter)

- Global filter `<SFInput>` above the table; `useDebouncedValue(rawGlobal, 300)` 300ms window
- `useEffect` syncs debounced value into TanStack `globalFilter` state AND fires `onGlobalFilterChange?.(debouncedGlobal)` (controlled API)
- Reverse-sync useEffect honors consumer-pushed `globalFilter` prop into raw input
- Per-keystroke calls do NOT touch `setColumnFilters` / `setGlobalFilter`; only one settles per debounce window
- Comment explicitly notes React text-node escaping covers any HTML/script-like user input; future maintainers warned not to introduce raw-HTML cell rendering

### DT-04 (selection)

- `selectionColumn` ColumnDef prepended when `enableRowSelection={true}`
- Header: `<SFCheckbox checked={getIsAllRowsSelected ? true : getIsSomeRowsSelected ? 'indeterminate' : false}>` (Pattern 5 verbatim)
- Row: `<SFCheckbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)}>`
- Indeterminate visual ships in Task 2's SFCheckbox extension (10 utility classes; horizontal 2px bar via `before:` pseudo using `--sfx-primary-foreground` pair-slot — never hardcoded magenta)
- `onRowSelectionChange` callback bridge: TanStack functional-updater → resolved next-state object for consumer
- Consumer accessor: `table.getRowModel().rows.filter(r => r.getIsSelected())` works directly

### DT-05 (density + skeleton + empty + JSDoc virtualize)

- CVA `density: compact | default | comfortable` maps to blessed spacing stops (`--sfx-space-1/2/3/4`)
- `loading={true}` renders `pageSize` (default 10) skeleton rows × column count via `<SFSkeleton className="h-4 w-full" />`
- `data.length === 0 && !loading` renders `<SFEmptyState title="NO DATA" />` inside `<SFTableCell colSpan={columns.length}>`
- JSDoc on `virtualize` prop documents v1.11 extension point; cross-refs `_dep_dt_02_decision`; `useEffect` fires single console.warn when prop is non-undefined (ref guard prevents repeat fires)

## Verification Trace

```
pnpm exec tsc --noEmit
→ exit 0 (clean)

grep -E "from ['\"]@tanstack/react-table/" components/sf/sf-data-table.tsx | wc -l
→ 0  (no devtools/subpath imports; bare top-level only)

grep -c "sf-data-table" components/sf/index.ts
→ 0  (Pattern B contract holds — file NOT in barrel)

grep -c "@tanstack/react-table" next.config.ts
→ 0  (D-04 chunk-id stability lock holds — no optimizePackageImports edit)

pnpm exec playwright test tests/v1.8-phase63-1-bundle-budget.spec.ts --project=chromium
→ 1 passed (Total: 187.6 KB / 200 KB; 12.4 KB headroom intact)

git log --oneline -- hooks/use-debounced-value.ts components/sf/sf-checkbox.tsx components/sf/sf-data-table.tsx
→ 3 commits since plan start (bf54b79, c2d314e, a37f42d)

git status --porcelain | grep -v "use-debounced-value.ts|sf-checkbox.tsx|sf-data-table.tsx"
→ Only baseline noise (.planning/ROADMAP.md, STATE.md, config.json, .lighthouseci/links.json)
   — none of these were touched by Plan 02; identical to Plan 01's baseline carry
```

## `_dep_dt_01_decision` Block Preservation

The 7-field ratification block authored in Plan 01 (Tasks 1+3 commits
`644293a` + `1251d2d`) is preserved BYTE-FOR-BYTE at lines 17-58 of
`components/sf/sf-data-table.tsx`. All measured fields intact:

- `decided: "2026-05-01"` (unchanged)
- `version: "8.21.3"` (unchanged — resolved from `pnpm add @tanstack/react-table@^8.21.3`)
- `bundle_evidence:` 8 entries (homepage pre/post baseline 187.6 KB, 12.4 KB headroom, TanStack chunk absent from manifest, devtools subpath audit zero, resolved version, measurement command + date) — unchanged
- `review_gate: |` (unchanged — TanStack v9 stable / BND-08 budget change / D-04 break)
- `ratified_to_main_via: "Phase 71 (Plan 01 commit)"` (unchanged)

Verifiable: `git diff bf54b79^ -- components/sf/sf-data-table.tsx | grep "_dep_dt_01_decision"` shows the block at the same offset post-impl.

## Locks Held

| Lock | Mechanism | Verification |
|------|-----------|--------------|
| Pattern B contract | sf-data-table NOT in barrel + trailing-comment reminder block | `grep -c sf-data-table components/sf/index.ts` → 0 |
| D-04 chunk-id stability | next.config.ts untouched (8-entry optimizePackageImports unchanged) | `grep -c "@tanstack/react-table" next.config.ts` → 0 |
| Devtools subpath absence | bare top-level imports only; rewritten anti-pattern comment avoids literal subpath syntax | `grep -E "from ['\"]@tanstack/react-table/" components/sf/sf-data-table.tsx` → 0 |
| Zero border-radius | sf-checkbox.tsx retains `rounded-none`; sort `<button>` declares `rounded-none` explicitly | `grep -E "rounded-(sm|md|lg|xl|2xl|full)" sf-data-table.tsx sf-checkbox.tsx` → 0 |
| --sfx-primary-foreground pair-slot policy | indeterminate horizontal bar uses `before:bg-primary-foreground` (not hardcoded magenta) | `grep -c "before:bg-primary-foreground" sf-checkbox.tsx` → 1 |
| Blessed spacing stops only | CVA density variant uses `--sfx-space-1/2/3/4` only | Manual review of sfDataTableVariants in sf-data-table.tsx |
| 200 KB First Load JS hard target | bundle-budget spec green at 187.6 KB | `tests/v1.8-phase63-1-bundle-budget.spec.ts` PASS |
| Worktree-leakage guard | `git status` before each commit; only declared files staged | `git show --stat HEAD~2..HEAD` per commit confirms clean attribution |

## Deviations from Plan

Two acceptance-vs-action contradictions were auto-fixed at the comment level (Rule 1 — bug). In both cases the **action body** of the plan instructed me to write text containing a literal substring, and the **acceptance criterion** for the same task asserted that substring count must be 0. Resolution: reword the comment to preserve semantics while removing the trigger substring. No behavior change; no test impact.

### Auto-fixed Issues

**1. [Rule 1 - Bug] useDebouncedValue JSDoc rationale removed literal "lodash" substring**

- **Found during:** Task 1 verification
- **Issue:** Plan action specified the JSDoc body include "avoid a runtime dep on lodash.debounce or usehooks-ts" while acceptance criterion asserted `grep -c lodash hooks/use-debounced-value.ts` returns 0.
- **Fix:** Reworded to "avoid a runtime dep on third-party debounce libraries — a 10-LOC primitive does not justify a second `_dep_X_decision` ratification". Same rationale, no `lodash` literal.
- **Files modified:** hooks/use-debounced-value.ts
- **Commit:** `bf54b79` (single Task-1 commit; the fix landed before the commit)

**2. [Rule 1 - Bug] sf-data-table.tsx anti-pattern comment scrubbed of literal subpath import syntax**

- **Found during:** Task 3 verification
- **Issue:** Plan action specified the anti-pattern comment include `never import from "@tanstack/react-table/devtools"` while acceptance criterion asserted `grep -E "from ['\"]@tanstack/react-table/" components/sf/sf-data-table.tsx` returns 0 matches.
- **Fix:** Reworded to "never use any TanStack Table sub-path (e.g. the dev-tools helper). Bare top-level imports only. Bundle audit (Phase 76 BND-08) greps the homepage manifest for the 'devtools' string — must remain zero." Same warning, no `from "@tanstack/react-table/..."` literal.
- **Files modified:** components/sf/sf-data-table.tsx
- **Commit:** `a37f42d` (single Task-3 commit; the fix landed before the commit)

## Authentication Gates

None encountered.

## Worktree Hygiene

Each commit verified clean via `git show --stat HEAD~N`:

- Commit `bf54b79`: `hooks/use-debounced-value.ts` only (1 file, +27 lines)
- Commit `c2d314e`: `components/sf/sf-checkbox.tsx` only (1 file, +7/-2 lines)
- Commit `a37f42d`: `components/sf/sf-data-table.tsx` only (1 file, +363/-7 lines)

Pre-existing modifications to `.planning/STATE.md`, `.planning/ROADMAP.md`,
`.planning/config.json`, and untracked `.lighthouseci/links.json` are
baseline noise from before Plan 02 started; NOT touched by any Plan 02
commit (identical baseline to Plan 01's residual carry).

## Forward Links

- **Plan 03 (DT-03 pagination + DT-06 lazy wrapper + TST-03)** — composes `SFPagination` inside the table for `pageIndex`/`pageSize`; ships `components/sf/sf-data-table-lazy.tsx` via `next/dynamic({ ssr: false })` with `<SFSkeleton>` fallback; production-chunk audit confirms zero TanStack devtools strings in `.next/static/**/*.js`; Playwright fixture at `app/_dev/playground/sf-data-table` exercises DT-01..06 + axe-core scan. Wave-0 of Plan 03 will mount `SFDataTable` (the symbol shipped here) directly.
- **v1.11 SFDataTableVirtual (`_dep_dt_02_decision`)** — virtualize prop in this impl is the documented extension hook; v1.11 swaps the no-op + console.warn for an actual `useVirtualizer` integration without breaking the consumer-facing API.
- **Phase 73 (SFRichEditor)** — useDebouncedValue (Task 1 here) is reusable for any future editor input that needs debounced state propagation; project-wide hook with no SFDataTable-specific assumptions.

## Self-Check: PASSED

- [x] `hooks/use-debounced-value.ts` exists at `/Users/greyaltaer/code/projects/SignalframeUX/hooks/use-debounced-value.ts` (verified via Read tool)
- [x] `components/sf/sf-checkbox.tsx` exists with `data-[state=indeterminate]` cluster (10 classes; ≥8 required)
- [x] `components/sf/sf-data-table.tsx` exists at 419 LOC (≥200 required); `_dep_dt_01_decision:` anchor present
- [x] Commit `bf54b79` exists in `git log` (Task 1)
- [x] Commit `c2d314e` exists in `git log` (Task 2)
- [x] Commit `a37f42d` exists in `git log` (Task 3)
- [x] `pnpm exec tsc --noEmit` returns exit 0
- [x] No TanStack subpath imports: `grep -E "from ['\"]@tanstack/react-table/" components/sf/sf-data-table.tsx` → 0 matches
- [x] Pattern B contract: `grep -c sf-data-table components/sf/index.ts` → 0
- [x] D-04 lock: `grep -c "@tanstack/react-table" next.config.ts` → 0
- [x] Bundle budget spec PASSED at 187.6 KB / 200 KB
- [x] No unexpected files in worktree (only pre-existing baseline noise carried from Plan 01)
- [x] Plan-01 `_dep_dt_01_decision` block preserved verbatim (all 7 fields + 8 bundle_evidence entries intact)
