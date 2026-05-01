# Phase 71: SFDataTable — Research

**Researched:** 2026-05-01
**Domain:** Headless data-table integration (TanStack Table v8) under SF FRAME constraints + P3 lazy bundle posture + first-runtime-dep ratification (`_dep_dt_01_decision`)
**Confidence:** HIGH

## Summary

SFDataTable is the first runtime-npm-dep introduction of v1.10. The architectural constraints are non-negotiable and already locked: `@tanstack/react-table@^8.21.3` (headless, ~12 KB gzip) ships in a P3 lazy chunk, never in `sf/index.ts`, never added to `optimizePackageImports` (D-04 lock holds — see `next.config.ts:32–41`), and the `_dep_dt_01_decision` 7-field block is committed BEFORE `pnpm add`. Bundle evidence is MEASURED via `rm -rf .next/cache .next && ANALYZE=true pnpm build`, not estimated. The build path is well-trodden: `sf-calendar-lazy.tsx` is the canonical P3 wrapper precedent, `sf-table.tsx` is the FRAME render surface, and `_wmk_01_decision` (v1.9 Phase 69) is the schema precedent — `_dep_X_decision` mirrors it field-for-field with a REQ-ID-namespaced key.

The component delivers DT-01..06 in one phase: column sort (asc → desc → none cycle, indicator glyph, accessible `<button type="button">`), per-column + global filter (300ms debounce), pagination composing `SFPagination`, row selection with indeterminate header, density CVA (compact / default / comfortable on blessed spacing stops), loading skeleton, empty state, and the `virtualize` prop documented in JSDoc as a v1.11 extension point (`_dep_dt_02_decision` — TanStack Virtual deferred). The render path is `useReactTable() → flexRender(header.column.columnDef.header) → <SFTableHead>` — TanStack Table emits no DOM, so all styling happens on existing SF primitives.

Three real risks: (1) accidental devtools import path leakage into a production chunk, prevented by treeshakable ESM and zero `devtools` subpath imports; (2) sort header WCAG 2.1.1 violation if `<div onClick>` ships instead of `<button type="button">` — axe-core test is a phase acceptance criterion; (3) bundle escape if the component or its lazy wrapper accidentally re-exports from `sf/index.ts`. All three are catchable at plan-time and verified at phase close.

**Primary recommendation:** Author `_dep_dt_01_decision` block in Plan 01 → install `@tanstack/react-table@^8.21.3` → measure → author `sf-data-table.tsx` (`'use client'`, NOT in barrel) + `sf-data-table-lazy.tsx` (`next/dynamic({ ssr: false })`, NOT in barrel) → author `useDebouncedValue` hook in `hooks/` (no lodash dep) → ship Playwright + axe-core test files same-phase → verify TanStack absent from `/page` First Load manifest.

<user_constraints>
## User Constraints (from ROADMAP.md Phase 71 + STATE.md v1.10 Critical Constraints + REQUIREMENTS.md)

> No CONTEXT.md exists for Phase 71 — this constraint surface is reconstructed VERBATIM from the locked phase-specific entries already ratified in ROADMAP.md (lines 52-61), REQUIREMENTS.md (DT-01..06, DEP-01, TST-03), and STATE.md v1.10 Critical Constraints. The Planner must honor these as hard locks.

### Locked Decisions (Phase-Specific, NOT for re-debate)

1. `_dep_dt_01_decision` block MUST be authored and committed BEFORE `pnpm add @tanstack/react-table`; bundle evidence field populated post-install via `ANALYZE=true pnpm build` (MEASURED, not estimated)
2. `@tanstack/react-table` NOT added to `optimizePackageImports` (D-04 chunk-id lock holds — P3 lazy is the correct mechanism)
3. `SFDataTable` and `sf-data-table-lazy.tsx` NOT exported from `sf/index.ts` barrel; consumers import via `@/components/sf/sf-data-table-lazy`
4. Sort headers MUST use `<button type="button">` (NOT `<div onClick>`) per WCAG 2.1.1; axe-core keyboard nav test is a phase acceptance criterion (TST-03)
5. JSDoc documents `virtualize` prop as a future extension point (v1.11 `SFDataTableVirtual`, `_dep_dt_02_decision`)
6. Verify `@/components/sf/sf-scroll-area` resolves correctly (file remains on disk post-Phase-67 DCE) before any SFScrollArea direct import
7. TanStack Table devtools path MUST NOT appear in any production chunk

### Locked Decisions (v1.10 Milestone-Wide)

- **200 KB First Load JS hard target** — currently 187.6 KB (12.4 KB headroom); regression requires `_dep_X_decision` ratification
- **Zero new runtime npm deps WITHOUT explicit ratification** — `_dep_dt_01_decision` is the per-component ratification block precedent
- **D-04 chunk-id stability lock holds throughout v1.10** — the 8-entry list (`@/components/sf`, `lucide-react`, `radix-ui`, `input-otp`, `cmdk`, `vaul`, `sonner`, `react-day-picker`) is FROZEN
- **P3 lazy mandatory for SFDataTable** — `next/dynamic({ ssr: false })`; never in barrel; consumers import direct path
- **Worktree leakage guard** — `git status` before every commit; untracked files in `components/sf/` not authored in-phase are leakage artifacts
- **Same-commit rule** — component file + registry entry land in one commit (no barrel export to land for SFDataTable since Pattern B)
- **`experimental.inlineCss: true` rejected** — breaks `@layer signalframeux` cascade
- **Single-ticker rule** — any new rAF call site is a violation (no rAF expected in SFDataTable)
- **PF-04 contract** — Lenis `autoResize: true` is code-of-record (irrelevant to SFDataTable but milestone-wide)
- **Zero border-radius everywhere** — override library defaults (`rounded-none` on every sub-element)
- **OKLCH only** — `--sfx-*` token classes; no hardcoded hex/HSL/RGB
- **CVA `intent` prop** — semantic variant prop is `intent`, not `variant`/`type`/`status`/`color` (precedent: `sf-button.tsx:8`)
- **Stale-chunk guard** — `rm -rf .next/cache .next && ANALYZE=true pnpm build` before any gating measurement

### Claude's Discretion

- Internal structure of `_dep_dt_01_decision` block file location: top-of-component-file comment block (mirrors `_wmk_01_decision` precedent at `tests/v1.8-phase63-1-wordmark-hoist.spec.ts:1-37`). Recommend top of `components/sf/sf-data-table.tsx` since that is the dep-introducing module
- Density variant naming: recommend `compact` / `default` / `comfortable` (clearest UX register; matches CLAUDE.md spacing-tier vocabulary)
- Column-sort cycle: research consensus is asc → desc → none (3-state) — confirmed locked in DT-01
- Filter debounce primitive: build new `hooks/use-debounced-value.ts` (no lodash dep, ~10 LOC)
- Sort glyph: SF-aligned flat geometric (▲/▼/—) inline SVG or text characters; NOT lucide chevron-soft (DU/TDR aesthetic register, FRAME layer)
- Pagination integration shape: SFDataTable internally renders `SFPagination` based on `table.getState().pagination` — consumer passes `pageSize` initial; component owns page state unless controlled
- Loading skeleton shape: `SFSkeleton` rows matching column count, count = `pageSize`
- Empty state shape: `SFEmptyState` (already in barrel) inside `<SFTableCell colSpan={columns.length}>`

### Deferred Ideas (OUT OF SCOPE for Phase 71)

- **DT-07+ Virtualization** (`SFDataTableVirtual` separate component) — requires `@tanstack/react-virtual@3.13.24` (`_dep_dt_02_decision`); v1.11 scope; only the `virtualize` JSDoc extension point lands in Phase 71
- **DT-08+ Server-side data mode** — v1.11 if user demand surfaces
- **DT-08+ Expandable rows / multi-column sort / global+per-column simultaneous filter UX** — v1.11
- **DT-09+ Column resize / reorder, sticky columns** — aesthetic-risk; deferred until usage validates need
- **TanStack Table v9** — RFC discussion #5834 open; pin to v8.x
- **AG Grid / Handsontable** — explicitly out of scope (REQUIREMENTS.md "Out of Scope" §)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| **DT-01** | Column sort (single-column asc → desc → none cycle) + sort indicator glyph + accessible header `<button type="button">` + keyboard nav (Enter/Space toggle); composes `getSortedRowModel` | Confirmed via TanStack v8 docs — `column.getToggleSortingHandler()` returns `() => void` for click/keyboard, `column.getIsSorted()` returns `'asc' \| 'desc' \| false`; `aria-sort="ascending" \| "descending" \| "none"` set on `<th>`. Pitfall #8 maps the WCAG 2.1.1 trap. See "Code Examples" §1 |
| **DT-02** | Per-column debounced text input (300ms) + global filter via `getFilteredRowModel`; controlled and uncontrolled API | TanStack v8: `setColumnFilters([{id, value}])` and `setGlobalFilter(string)` are the wired calls; `state.columnFilters` + `state.globalFilter`. No existing `useDebouncedValue` hook in repo (verified via grep — see "Don't Hand-Roll" §); recommend authoring new `hooks/use-debounced-value.ts` with React 19 idioms (no lodash dep). 300ms is the locked debounce per DT-02 |
| **DT-03** | Page-number pagination composing existing `SFPagination`; `getPaginationRowModel`; controlled `pageIndex` / `pageSize` API | TanStack v8 `state.pagination = { pageIndex, pageSize }`; `table.setPageIndex(n)`, `table.getPageCount()`, `table.getCanPreviousPage()`, `table.getCanNextPage()`. SFPagination already in barrel (verified `components/sf/index.ts:144-151`). Render path: pass `table.getState().pagination` + helpers into `<SFPagination>` composition |
| **DT-04** | Checkbox column (single + multi + indeterminate header state); composes existing `SFCheckbox`; `getRowModel().rows.filter(r => r.getIsSelected())` consumer accessor | TanStack v8: `state.rowSelection: Record<string, boolean>` keyed by row id; `row.getIsSelected()`, `row.toggleSelected()`; header indeterminate via `table.getIsSomeRowsSelected()` (NOT `getIsSomePageRowsSelected()` per docs); `table.getIsAllRowsSelected()`. SFCheckbox needs `data-state="indeterminate"` thread through — Radix CheckboxRoot accepts `checked={'indeterminate' \| boolean}` (sf-checkbox.tsx:19-34 already wraps Radix Checkbox; passthrough works) |
| **DT-05** | Density CVA variant (compact / default / comfortable) + loading skeleton + empty state + keyboard nav grid role + JSDoc `virtualize` extension point | Density precedent: `sf-button.tsx:5-31` shows CVA `intent`/`size` pattern with blessed-stop padding (`px-[var(--sfx-space-3)]` etc.). Skeleton: `SFSkeleton` (in barrel, `components/sf/index.ts:74`). Empty state: `SFEmptyState` (in barrel, `components/sf/index.ts:120`). Keyboard nav grid role: native `<table role="grid">` plus per-cell `tabIndex` is OPTIONAL — TanStack v8 docs do not require it; standard `<table>` semantic role is sufficient for screen readers and is the existing SFTable contract. JSDoc `virtualize` extension is one block comment — see "Code Examples" §6 |
| **DT-06** | P3 lazy via `components/sf/sf-data-table-lazy.tsx` using `next/dynamic({ ssr: false })`; component NOT exported from `sf/index.ts`; consumers import `@/components/sf/sf-data-table-lazy` | Canonical pattern at `components/sf/sf-calendar-lazy.tsx:17-35`. SFSkeleton fallback. See "Code Examples" §3 |
| **DEP-01** | `_dep_dt_01_decision` block ratified at Phase 71 plan time; 7 fields (decided / audit / dep_added / version / rationale / bundle_evidence / review_gate); covers `@tanstack/react-table@8.21.3`; bundle_evidence post-`pnpm add ANALYZE=true pnpm build` measurement (NOT estimate); review_gate fires on TanStack Table v9 stable | Schema precedent: `_wmk_01_decision` at `tests/v1.8-phase63-1-wordmark-hoist.spec.ts:1-37`. Field semantics for `_dep_X_decision` adapt as: decided/audit/dep_added (replaces original_threshold)/version (replaces new_threshold)/rationale/bundle_evidence (replaces evidence)/review_gate. See "Code Examples" §7 for the canonical block |
| **TST-03** | Per-component Playwright + axe-core test files land same-phase; covers controlled API + keyboard nav + open/close states; axe covers WCAG AA (sort header keyboard) | Axe-core precedent: `tests/v1.9-phase66-arc-axe.spec.ts:1-141` — direct `AxeBuilder({ page }).withRules([...])` pattern; per-rule scan for sort-header WCAG 2.1.1. Recommend two files: `tests/v1.10-phase71-sf-data-table.spec.ts` (Playwright keyboard + controlled API + selection) + `tests/v1.10-phase71-sf-data-table-axe.spec.ts` (axe-core button-name, aria-sort, table-fake-caption rules). See "Validation Architecture" § |
</phase_requirements>

## Standard Stack

### Core Runtime Dep (NEW — `_dep_dt_01_decision` ratified)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@tanstack/react-table` | ^8.21.3 | Headless table logic (sort/filter/pagination/selection) | De-facto React headless-table standard; zero DOM emission; 12 KB gzip; React 19 compatible (peer `react >=16.8` per npm); shadcn `data-table` example targets exactly this library |

### Existing Stack (No Install Needed — Already in Codebase)

| Library / Component | Path | Role in SFDataTable |
|---------------------|------|---------------------|
| `SFTable` family (`SFTable`, `SFTableHeader`, `SFTableBody`, `SFTableHead`, `SFTableRow`, `SFTableCell`) | `components/sf/sf-table.tsx` (in barrel: `index.ts:27-34`) | Render surface; consumed via barrel; receives `flexRender` output |
| `SFCheckbox` | `components/sf/sf-checkbox.tsx` (in barrel: `index.ts:97`) | Selection column header + per-row cell; passes `checked={'indeterminate' \| boolean}` through to Radix Checkbox |
| `SFPagination*` | `components/sf/sf-pagination.tsx` (in barrel: `index.ts:144-151`) | Pagination controls; consumes `table.getState().pagination` |
| `SFInput` | `components/sf/sf-input.tsx` (in barrel: `index.ts:18`) | Filter input — per-column + global; debounced via new hook |
| `SFSkeleton` | `components/sf/sf-skeleton.tsx` (in barrel: `index.ts:74`) | Loading state — N rows × M cols matching `pageSize` and `columns.length` |
| `SFEmptyState` | `components/sf/sf-empty-state.tsx` (in barrel: `index.ts:120`) | Empty state row — wrapped in `<SFTableCell colSpan={columns.length}>` |
| `SFScrollArea` | `components/sf/sf-scroll-area.tsx` (NOT in barrel post-Phase-67 DCE — verified `index.ts:83-86`) | Direct import for horizontal overflow on narrow viewports — `import { SFScrollArea } from "@/components/sf/sf-scroll-area"` |
| `SFButton` | `components/sf/sf-button.tsx` (in barrel: `index.ts:9`) | Sort header trigger — must wrap as `<button type="button">` semantic (CVA `intent="ghost"` + sort-header-specific size) OR plain `<button>` if SFButton's mono+uppercase is too noisy for column headers (consumer test: see "Architecture Patterns") |
| `cn()` | `lib/utils.ts` | Class merging — required convention |
| `class-variance-authority` (`cva`) | dep already installed | Density variant — see precedent at `sf-button.tsx:5-31` |

### Alternatives Considered (and Rejected)

| Instead of | Could Use | Why Not |
|------------|-----------|---------|
| TanStack Table v8 | AG Grid Community | 200+ KB gzip even community; destroys bundle budget even as lazy chunk |
| TanStack Table v8 | react-table v7 | Deprecated predecessor; React 18/19 concurrent-mode issues |
| TanStack Table v8 | TanStack Table v9 | RFC #5834 open; not yet released; pin to v8 (research_gate review fires on v9 stable per DEP-01) |
| Building debounce inline | `lodash.debounce` | New runtime dep — would require own `_dep_X_decision`; ~10-LOC custom hook avoids this |
| Building debounce inline | `usehooks-ts` `useDebounce` | New runtime dep; 13 KB tree of hooks for one ~10-LOC need |
| Custom DOM-based table | Continue using `<SFTable>` family | Would duplicate semantic-HTML primitive that already exists |
| `<div role="grid">` w/ aria-rowindex | `<table>` semantic | Native `<table>` ships correct screen-reader semantics; zero ARIA needed beyond `aria-sort` on `<th>` |

### Installation (After `_dep_dt_01_decision` Block Committed)

```bash
# Step 1 (in plan): author and commit _dep_dt_01_decision block in components/sf/sf-data-table.tsx
#                  with bundle_evidence: "TBD post-pnpm-add"
# Step 2: install
pnpm add @tanstack/react-table@^8.21.3
# Step 3: measure
rm -rf .next/cache .next && ANALYZE=true pnpm build
# Step 4: amend the bundle_evidence field with measured values; re-commit
```

## Architecture Patterns

### Recommended File Layout

```
components/sf/
├── sf-data-table.tsx          # Pattern B impl, 'use client', NOT in barrel.
│                              # Hosts _dep_dt_01_decision block at top of file
├── sf-data-table-lazy.tsx     # Pattern B lazy wrapper — public API surface.
│                              # next/dynamic({ ssr: false }), NOT in barrel
hooks/
└── use-debounced-value.ts     # 300ms debounce primitive — new file
public/r/
└── registry.json              # +1 entry: meta.layer=frame, meta.pattern=B, meta.heavy=true
tests/
├── v1.10-phase71-sf-data-table.spec.ts        # Playwright: keyboard nav, controlled API, selection
└── v1.10-phase71-sf-data-table-axe.spec.ts    # axe-core: button-name, aria-sort
```

**No modification to:**
- `components/sf/index.ts` (barrel) — Pattern B = NOT exported
- `next.config.ts` — D-04 lock; NO `optimizePackageImports` change
- `app/globals.css` — no new tokens; native `<table>` styled by SFTable

### Pattern 1: P3 Lazy Wrapper (Pattern B) — Canonical from `sf-calendar-lazy.tsx`

**What:** Heavy-dep component loaded via `next/dynamic({ ssr: false })` with `SFSkeleton` loading fallback. The lazy file is the public API surface. The implementation file is never in `sf/index.ts`.

**When to use:** Mandatory for SFDataTable per DT-06.

**Source pattern (`components/sf/sf-calendar-lazy.tsx:1-35` — verbatim):**

```typescript
"use client";

import dynamic from "next/dynamic";
import { SFSkeleton } from "@/components/sf";

const SFDataTableDynamic = dynamic(
  () =>
    import("@/components/sf/sf-data-table").then((m) => ({
      default: m.SFDataTable,
    })),
  {
    ssr: false,
    loading: () => <SFSkeleton className="h-[400px] w-full" />,
  }
);

export function SFDataTableLazy<TData>(
  props: React.ComponentProps<typeof SFDataTableDynamic>
) {
  return <SFDataTableDynamic {...props} />;
}
```

### Pattern 2: SF-Wrapped Headless Render — Canonical from `sf-table.tsx` Composition

**What:** TanStack Table's `flexRender(cellOrHeaderContent, context)` emits arbitrary React. SFDataTable threads it through the existing SFTable family — every visual primitive comes from SF tokens, every behavioral primitive comes from TanStack.

**Render skeleton:**

```typescript
'use client';
import { useReactTable, getCoreRowModel, getSortedRowModel,
         getFilteredRowModel, getPaginationRowModel, flexRender,
         type ColumnDef, type SortingState, type ColumnFiltersState,
         type RowSelectionState } from '@tanstack/react-table';
import { useState } from 'react';
import { SFTable, SFTableHeader, SFTableBody, SFTableRow,
         SFTableHead, SFTableCell, SFCheckbox, SFInput,
         SFSkeleton, SFEmptyState } from '@/components/sf';
// SFScrollArea is NOT in barrel post-Phase-67 — direct import:
import { SFScrollArea } from '@/components/sf/sf-scroll-area';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const sfDataTableVariants = cva('font-mono text-xs', {
  variants: {
    density: {
      compact:     '[&_td]:py-[var(--sfx-space-1)] [&_th]:h-7',
      default:     '[&_td]:py-[var(--sfx-space-2)] [&_th]:h-9',
      comfortable: '[&_td]:py-[var(--sfx-space-3)] [&_th]:h-11',
    },
  },
  defaultVariants: { density: 'default' },
});
```

### Pattern 3: SFCheckbox Indeterminate Threading

**What:** Radix Checkbox accepts `checked: boolean | 'indeterminate'`. SFCheckbox already wraps Radix verbatim (`components/sf/sf-checkbox.tsx:19-34` — `props` spread). Pass-through works.

```typescript
<SFCheckbox
  checked={
    table.getIsAllRowsSelected()
      ? true
      : table.getIsSomeRowsSelected()
        ? 'indeterminate'
        : false
  }
  onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
  aria-label="Select all rows"
/>
```

(Per TanStack v8 docs: `getIsSomeRowsSelected()` is the indeterminate signal; `getIsSomePageRowsSelected()` exists separately for page-scoped indeterminate but the canonical pattern is row-scoped.)

### Pattern 4: Sort Header `<button type="button">` (WCAG 2.1.1)

**What:** Every sortable column emits a `<button type="button">` (NOT `<div onClick>`) that wires `column.getToggleSortingHandler()`. The `<th>` carries `aria-sort`.

```typescript
<SFTableHead aria-sort={
  column.getIsSorted() === 'asc' ? 'ascending'
    : column.getIsSorted() === 'desc' ? 'descending'
    : 'none'
}>
  <button
    type="button"
    onClick={column.getToggleSortingHandler()}
    className="inline-flex items-center gap-[var(--sfx-space-1)] uppercase tracking-wider"
  >
    {flexRender(column.columnDef.header, ctx)}
    <span aria-hidden="true">
      {column.getIsSorted() === 'asc' ? '▲'
        : column.getIsSorted() === 'desc' ? '▼'
        : '—'}
    </span>
    <span className="sr-only">
      {column.getIsSorted() === 'asc' ? 'Sorted ascending'
        : column.getIsSorted() === 'desc' ? 'Sorted descending'
        : 'Click to sort'}
    </span>
  </button>
</SFTableHead>
```

**Glyph rationale (FRAME layer / DU/TDR aesthetic):**
Use flat geometric Unicode (`▲ ▼ —`) — not Lucide chevrons. SF aesthetic register is sharp/structured/coded; chevron-soft glyphs read as "generic SaaS table" and miss the DU/TDR coded nomenclature register documented in `wiki/analyses/culture-division-operating-principles.md` (Autechre / Brody/Fuse influence). The `▲▼—` triad is also the v1.0 ScrambleText nomenclature pattern.

### Pattern 5: 300ms Filter Debounce (New Hook)

**What:** No existing `useDebouncedValue` hook in repo (grep confirmed — `hooks/` contains 9 hooks; none is debounce). Author a minimal one to avoid lodash dep.

**File: `hooks/use-debounced-value.ts`**

```typescript
import { useEffect, useState } from 'react';

/**
 * Returns a debounced copy of `value`, updated `delay` ms after the last change.
 * Used by SFDataTable filter inputs to avoid setColumnFilters on every keystroke.
 *
 * @param value - The value to debounce
 * @param delay - Debounce window in ms (default 300, per DT-02)
 *
 * @example
 * const [raw, setRaw] = useState('');
 * const debounced = useDebouncedValue(raw, 300);
 * useEffect(() => { table.setColumnFilters([{id:'name', value:debounced}]); }, [debounced]);
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
```

### Pattern 6: `_dep_X_decision` Block (Comment, Top of File) — Schema from `_wmk_01_decision`

**Schema precedent:** `tests/v1.8-phase63-1-wordmark-hoist.spec.ts:1-37` (`_wmk_01_decision`). Adapted field semantics for runtime-dep ratification per DEP-01:

| Field | `_wmk_01_decision` (path-decision) | `_dep_dt_01_decision` (dep-decision) |
|-------|-----------------------------------|--------------------------------------|
| `decided` | ISO date | ISO date |
| `audit` | what is being ratified | scope identifier (e.g. "sf-data-table:runtime-dep") |
| `original_threshold` | OLD value | `dep_added` — package name(s) + path(s) imported |
| `new_threshold` | NEW value | `version` — exact version pinned (e.g. "^8.21.3") |
| `rationale` | freeform multi-line | freeform multi-line |
| `evidence` | list of refs | `bundle_evidence` — measured gzip + lazy-chunk-ID + First Load JS delta |
| `review_gate` | when to re-evaluate | when to re-evaluate (e.g. "TanStack Table v9 stable release") |

See "Code Examples" §7 for the canonical block.

### Anti-Patterns to Avoid

- **`<div onClick={sort}>` for column headers** — WCAG 2.1.1 fail; axe-core button-name violation. Always `<button type="button">`. See Pitfall #8.
- **`SFDataTable` exported from `sf/index.ts`** — TanStack Table (~12 KB gzip) into First Load JS. P3 lazy = NOT in barrel. See Pitfall #1 (sibling-class to Tiptap StarterKit escape).
- **`@tanstack/react-table` added to `optimizePackageImports`** — D-04 chunk-id reshuffles. Phase-71 plan must explicitly NOT touch `next.config.ts`. See Pitfall #3.
- **Importing devtools sub-path** — `@tanstack/react-table` does not auto-bundle devtools; the import path `@tanstack/react-table-devtools` is a separate (unused) package. Risk only if a developer copy-pastes a dev example. See Pitfall #2.
- **`{...props}` spread on `<th onClick>`** — `<th>` is not a button; keyboard activation is browser-default-undefined. Always wrap header content in `<button type="button">`.
- **`new Date()` at module level** — irrelevant to SFDataTable specifically (no date logic), but still a milestone-wide v1.10 trap (REQUIREMENTS.md, Phase 75).
- **`'use client'` in `sf/index.ts`** — turns layout primitives into Client Components. Barrel stays directive-free permanently (v1.3 invariant).
- **Worktree-leaked file commit** — `git status` before every commit. Untracked `components/sf/sf-data-table.tsx` before phase authoring it = leakage.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sort/filter/pagination/selection state machine | Custom `useReducer` | `@tanstack/react-table@^8.21.3` `useReactTable` | TanStack handles cycle states, multi-column tie-breaking, page-bound selection edge cases, server-data toggling. ~12 KB gzip in P3 lazy chunk = 0 KB First Load JS impact |
| Indeterminate header checkbox state | Custom 3-state useReducer | TanStack `table.getIsSomeRowsSelected()` + Radix `checked={'indeterminate'}` passthrough through `SFCheckbox` | Already supported by both libraries; threading is 1 line |
| Pagination controls | New paginator component | Existing `SFPagination` primitive (`components/sf/sf-pagination.tsx`) + TanStack `table.getState().pagination` + `setPageIndex()` | Already in barrel, already tested, mono+uppercase styled, inverted active state |
| Loading skeleton | Custom shimmer animation | `SFSkeleton` (in barrel) × N rows × M columns matching pageSize × columns.length | Tokens-aligned, animation-token-driven, already audited |
| Empty state | Custom message + icon | `SFEmptyState` (in barrel) inside `<SFTableCell colSpan={columns.length}>` | Already aesthetic-locked |
| Filter debounce | `lodash.debounce` runtime dep | New `hooks/use-debounced-value.ts` (~10 LOC, no dep) | Avoids second `_dep_X_decision` for a 10-line need |
| Horizontal overflow scroll | Native `overflow-x: auto` `<div>` | `SFScrollArea` (direct import — DCE'd from barrel post-Phase-67, file remains on disk per `next.config.ts` BND-05 comment) | SF-styled thumbs (sharp corners, foreground/30); `overflow-x: auto` with default scrollbar is generic-dark-mode aesthetic |
| Sort glyphs | Lucide chevron-up/chevron-down | Inline `▲ ▼ —` text glyphs with `aria-hidden` + `sr-only` paired text | Lucide chevrons are chevron-soft (rounded, "generic SaaS"); flat geometric triangles match DU/TDR coded register; zero new icon imports = zero bundle delta |
| Type-narrowed `ColumnDef<T>` | Custom column shape | TanStack `ColumnDef<T, TValue>` from `@tanstack/react-table` | Library type carries sortingFn/filterFn/cell/header inference; reinventing breaks DX |

**Key insight:** TanStack Table v8 is headless — it gives you the state machine, not the DOM. SFDataTable's job is to wire it to existing SF primitives. There is almost nothing to build that doesn't already exist; the phase is composition + ratification, not invention.

## Common Pitfalls

(See `.planning/research/PITFALLS.md` Pitfalls #1–13 for full v1.10-scope inventory; below are the SFDataTable-specific cuts.)

### Pitfall A: Sort Header WCAG 2.1.1 Failure (DT-01 acceptance gate)

**What goes wrong:** `<div onClick={...}>` or `<th onClick={...}>` for sort triggers — visually works, keyboard fails.
**Why it happens:** TanStack Table is headless — it provides no markup. Devs reach for the most visually obvious wrapper.
**How to avoid:** `<button type="button">` always; `<th aria-sort="ascending|descending|none">`; paired `sr-only` text for direction; axe-core test in same phase (TST-03).
**Warning signs:** axe-core `button-name` violation; manual Tab → Enter does not toggle sort; `<div onClick>` anywhere in column-header markup.

### Pitfall B: Devtools Path Leak Into Production Chunk (Phase-71 constraint #7)

**What goes wrong:** `import { ReactTableDevtools } from '@tanstack/react-table/build/lib/devtools'` (or any subpath that mentions `devtools`) ships to prod.
**Why it happens:** TanStack v8 ships a (rarely-used) devtools subpath. Copy-pasting a dev tutorial that uses it is the most common vector. (Verified: `@tanstack/react-table` does NOT auto-bundle devtools — they're opt-in via subpath; absence in our component file = absence in chunk.)
**How to avoid:** Only ever import from `@tanstack/react-table` top-level (`useReactTable`, `getCoreRowModel`, `getSortedRowModel`, `getFilteredRowModel`, `getPaginationRowModel`, `flexRender`, types). Never from any subpath. Bundle audit in Phase 76 must grep the homepage manifest for `devtools` and assert zero hits.
**Warning signs:** Any `from '@tanstack/react-table/'` (slash + subpath) line in `sf-data-table.tsx`; `devtools` substring in `.next/analyze/client.html`.

### Pitfall C: Bundle Escape Via Barrel Re-Export

**What goes wrong:** Future maintainer "helpfully" adds `export { SFDataTable } from './sf-data-table'` or `export { SFDataTableLazy } from './sf-data-table-lazy'` to `sf/index.ts`. Either spikes First Load JS.
**Why it happens:** Barrel-export hygiene is a learned discipline; not all SF components are excluded.
**How to avoid:** Phase 76 BND-08 audit asserts both component files absent from the barrel; same-commit registry entry (REG-01) does NOT touch the barrel; comment in `sf-data-table-lazy.tsx` explaining "NEVER re-export from barrel — Pattern B" mirrors the existing `sf-toast` non-barrel comment at `index.ts:128-132`.
**Warning signs:** `sf-data-table` substring in `components/sf/index.ts`; First Load JS at Phase 76 close > 200 KB.

### Pitfall D: D-04 Chunk-ID Lock Drift Via Stealth `optimizePackageImports` Edit

**What goes wrong:** "Just one entry" added to `optimizePackageImports` reshuffles webpack splitChunks; post-Phase-67 chunk IDs (8964, 584bde89, etc.) dissolve.
**Why it happens:** `optimizePackageImports` looks innocent — it's a "performance" knob.
**How to avoid:** Phase 71 plan EXPLICITLY does not touch `next.config.ts`. P3 lazy already gives us the deferred-load behavior without it.
**Warning signs:** `next.config.ts` modified in any Phase 71 plan diff.

### Pitfall E: SFCheckbox Indeterminate Visual Doesn't Render

**What goes wrong:** `checked='indeterminate'` is set but visual doesn't show indeterminate state — UI shows fully checked or unchecked.
**Why it happens:** Radix Checkbox renders a `data-state="indeterminate"` attribute; the visual treatment is up to consumer CSS. SFCheckbox currently styles only `data-[state=checked]` (sf-checkbox.tsx:27).
**How to avoid:** Phase 71 plan must add `data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary` (or a token-distinct treatment — e.g. partial fill via `before:` pseudo) to `sf-checkbox.tsx`. This is a one-line additive change to an existing barrel file — flag in plan as a deliberate SFCheckbox extension.
**Warning signs:** Manual visual test with `getIsSomeRowsSelected() === true` — checkbox shows blank.

### Pitfall F: Worktree File Leakage (Standing Hazard)

**What goes wrong:** Sub-agent authoring `sf-data-table.tsx` in `.claude/worktrees/agent-N/` leaks file to main tree as untracked.
**Why it happens:** Per `feedback_agent_worktree_leakage.md`, worktree isolation is "inconsistently leaking."
**How to avoid:** `git status` before every Phase 71 commit; defensive merge `git checkout --ours` if leakage observed.
**Warning signs:** Untracked `components/sf/sf-data-table.tsx` appearing before in-phase authoring; two versions of file (one in `.claude/worktrees/`, one in main).

## Code Examples

Verified patterns; all imports verified against `@tanstack/react-table@^8.21.3` API surface (TanStack v8 docs).

### Example 1: Imports + Sort Header (DT-01)

```typescript
// Source: TanStack Table v8 docs (tanstack.com/table/v8/docs/api/features/sorting)
'use client';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';

const [sorting, setSorting] = useState<SortingState>([]);

const table = useReactTable({
  data,
  columns,
  state: { sorting },
  onSortingChange: setSorting,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
});

// Sort header — accessible <button type="button">, <th aria-sort>, paired sr-only text
{table.getHeaderGroups().map(hg => (
  <SFTableRow key={hg.id}>
    {hg.headers.map(h => {
      const dir = h.column.getIsSorted();  // 'asc' | 'desc' | false
      const ariaSort = dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : 'none';
      return (
        <SFTableHead key={h.id} aria-sort={ariaSort}>
          {h.column.getCanSort() ? (
            <button
              type="button"
              onClick={h.column.getToggleSortingHandler()}
              className="inline-flex items-center gap-[var(--sfx-space-1)] uppercase tracking-wider"
            >
              {flexRender(h.column.columnDef.header, h.getContext())}
              <span aria-hidden="true">
                {dir === 'asc' ? '▲' : dir === 'desc' ? '▼' : '—'}
              </span>
              <span className="sr-only">
                {dir === 'asc' ? 'Sorted ascending'
                  : dir === 'desc' ? 'Sorted descending'
                  : 'Click to sort'}
              </span>
            </button>
          ) : (
            flexRender(h.column.columnDef.header, h.getContext())
          )}
        </SFTableHead>
      );
    })}
  </SFTableRow>
))}
```

### Example 2: Filter (Per-Column Debounced + Global) (DT-02)

```typescript
// Source: TanStack Table v8 docs (tanstack.com/table/v8/docs/api/features/filters)
import { getFilteredRowModel, type ColumnFiltersState } from '@tanstack/react-table';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

const [globalFilter, setGlobalFilter] = useState('');
const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
const [rawGlobal, setRawGlobal] = useState('');
const debouncedGlobal = useDebouncedValue(rawGlobal, 300);  // DT-02 locked 300ms

useEffect(() => { setGlobalFilter(debouncedGlobal); }, [debouncedGlobal]);

const table = useReactTable({
  data,
  columns,
  state: { globalFilter, columnFilters /*, sorting, pagination, rowSelection */ },
  onGlobalFilterChange: setGlobalFilter,
  onColumnFiltersChange: setColumnFilters,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
});

// Render
<SFInput
  value={rawGlobal}
  onChange={e => setRawGlobal(e.target.value)}
  placeholder="Filter all columns…"
  aria-label="Global filter"
/>
```

### Example 3: P3 Lazy Wrapper (DT-06)

See "Pattern 1" above — verbatim from `sf-calendar-lazy.tsx`.

### Example 4: Pagination Composition (DT-03)

```typescript
import { getPaginationRowModel } from '@tanstack/react-table';
import {
  SFPagination, SFPaginationContent, SFPaginationItem,
  SFPaginationLink, SFPaginationPrevious, SFPaginationNext,
} from '@/components/sf';

const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

const table = useReactTable({
  /* ...above... */
  state: { /*...*/, pagination },
  onPaginationChange: setPagination,
  getPaginationRowModel: getPaginationRowModel(),
});

// Render — composing existing SFPagination
<SFPagination>
  <SFPaginationContent>
    <SFPaginationItem>
      <SFPaginationPrevious
        onClick={() => table.previousPage()}
        aria-disabled={!table.getCanPreviousPage()}
      />
    </SFPaginationItem>
    {Array.from({ length: table.getPageCount() }, (_, i) => (
      <SFPaginationItem key={i}>
        <SFPaginationLink
          isActive={table.getState().pagination.pageIndex === i}
          onClick={() => table.setPageIndex(i)}
        >
          {i + 1}
        </SFPaginationLink>
      </SFPaginationItem>
    ))}
    <SFPaginationItem>
      <SFPaginationNext
        onClick={() => table.nextPage()}
        aria-disabled={!table.getCanNextPage()}
      />
    </SFPaginationItem>
  </SFPaginationContent>
</SFPagination>
```

### Example 5: Selection Column with Indeterminate Header (DT-04)

```typescript
import { type RowSelectionState } from '@tanstack/react-table';
import { SFCheckbox } from '@/components/sf';

const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

const table = useReactTable({
  /*...*/,
  state: { /*...*/, rowSelection },
  onRowSelectionChange: setRowSelection,
  enableRowSelection: true,
});

// Selection column definition (prepended to user columns)
const selectionColumn: ColumnDef<TData> = {
  id: 'select',
  header: ({ table }) => (
    <SFCheckbox
      checked={
        table.getIsAllRowsSelected() ? true
          : table.getIsSomeRowsSelected() ? 'indeterminate'
          : false
      }
      onCheckedChange={(v) => table.toggleAllRowsSelected(!!v)}
      aria-label="Select all rows"
    />
  ),
  cell: ({ row }) => (
    <SFCheckbox
      checked={row.getIsSelected()}
      onCheckedChange={row.getToggleSelectedHandler()}
      aria-label={`Select row ${row.id}`}
    />
  ),
  enableSorting: false,
};

// Consumer accessor (per Phase 71 acceptance criterion #4)
const selectedRows = table.getRowModel().rows.filter(r => r.getIsSelected());
// or canonical: table.getSelectedRowModel().rows
```

### Example 6: JSDoc `virtualize` Extension Point (DT-05)

```typescript
/**
 * SFDataTable — FRAME layer headless data table.
 *
 * Composes `@tanstack/react-table@^8.21.3` over the existing SFTable family.
 * Sort + filter + pagination + row selection. P3 lazy: import via
 * `@/components/sf/sf-data-table-lazy`, NEVER from the barrel.
 *
 * @param density - Spacing variant. "compact" | "default" | "comfortable"
 * @param virtualize - **Future v1.11 extension point** (`_dep_dt_02_decision`).
 *   When v1.11 lands `SFDataTableVirtual` with `@tanstack/react-virtual`, this
 *   prop will accept `{ rowHeight: number; overscan?: number }` and route the
 *   render path through `useVirtualizer`. In v1.10, passing this prop is a
 *   no-op + console warning. Do NOT remove this prop without bumping major.
 *
 * @example
 * <SFDataTableLazy
 *   data={users}
 *   columns={columns}
 *   density="default"
 *   pageSize={10}
 *   onRowSelectionChange={setSelected}
 * />
 */
```

### Example 7: `_dep_dt_01_decision` Block (Top of `sf-data-table.tsx`)

```typescript
// @dep_decision: DT-01 (REQ-namespaced)
//   _dep_dt_01_decision:
//     decided: "2026-05-XX"  (date of Phase 71 plan close)
//     audit: "sf-data-table:runtime-dep"
//     dep_added:
//       - "@tanstack/react-table"
//     version: "^8.21.3"
//     rationale: |
//       SFDataTable composes TanStack Table v8 headless logic over the existing
//       SFTable family. v8 is the maintained-track de-facto React headless-table
//       standard; v9 is open RFC #5834, not yet released. AG Grid (200+ KB) and
//       react-table v7 (deprecated, React 18/19 concurrent-mode issues) rejected
//       per .planning/research/STACK.md. P3 lazy posture (next/dynamic ssr:false,
//       NOT in sf/index.ts barrel, NOT in next.config.ts optimizePackageImports —
//       D-04 lock holds) keeps homepage First Load JS impact at 0 KB. Sort headers
//       use <button type="button"> per WCAG 2.1.1; axe-core enforces in Phase 71.
//     bundle_evidence:
//       - "TanStack Table chunk gzip: <MEASURED via ANALYZE=true pnpm build>"
//       - "Homepage First Load JS pre-add: 187.6 KB"
//       - "Homepage First Load JS post-add: <MEASURED — must remain ≤ 200 KB>"
//       - "Devtools subpath audit: zero references in .next/analyze/client.html"
//       - "ratified-to-main commit: <SHA — populated post-merge>"
//     review_gate: |
//       Re-evaluate when @tanstack/react-table v9 reaches stable release
//       (currently RFC #5834, no release date). Re-pin and re-measure if
//       v9 changes API surface or bundle profile materially. Also fires
//       if BND-08 budget changes (currently 200 KB hard target) or if D-04
//       chunk-id lock is intentionally broken in a future BND phase.
//     scope: "@tanstack/react-table runtime dep — single P3 lazy chunk"
//     ratified_to_main_via: "Phase 71 (this commit)"
```

### Example 8: Density CVA Variant (DT-05)

```typescript
// Source pattern: components/sf/sf-button.tsx:5-31 (size variant precedent)
const sfDataTableVariants = cva(
  'font-mono text-xs border-2 border-foreground',
  {
    variants: {
      density: {
        compact:     '[&_th]:h-7  [&_td]:px-[var(--sfx-space-2)] [&_td]:py-[var(--sfx-space-1)]',
        default:     '[&_th]:h-9  [&_td]:px-[var(--sfx-space-3)] [&_td]:py-[var(--sfx-space-2)]',
        comfortable: '[&_th]:h-12 [&_td]:px-[var(--sfx-space-4)] [&_td]:py-[var(--sfx-space-3)]',
      },
    },
    defaultVariants: { density: 'default' },
  }
);
// Spacing values use blessed stops: 4 / 8 / 12 / 16 — CLAUDE.md token rule.
```

### Example 9: `ANALYZE=true pnpm build` Bundle Measurement Protocol

```bash
# Stale-chunk guard (BND-04 standing rule)
rm -rf .next/cache .next

# Build with bundle analyzer (next.config.ts:4-6 wires @next/bundle-analyzer)
ANALYZE=true pnpm build

# Outputs (canonical paths):
# .next/analyze/client.html      — interactive treemap
# .next/analyze/edge.html
# .next/analyze/nodejs.html

# Inspect homepage First Load JS for `/` route:
# Open .next/analyze/client.html in browser, locate /page chunk
# Verify @tanstack/react-table appears in a SEPARATE lazy chunk, NOT /page

# Programmatic floor check (homepage First Load total):
node -e "const m = require('./.next/build-manifest.json'); console.log(JSON.stringify(m.pages['/'], null, 2))"
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `react-table` v7 (HOC API: `useTable`, `usePagination`, `useSortBy`) | `@tanstack/react-table` v8 (hook API: `useReactTable` + row-model factories) | TanStack rewrite, 2022 | API not backwards-compatible; v7 is deprecated; v8 is the maintained line. v9 is open RFC #5834. |
| `<th onClick>` for sort headers | `<button type="button">` inside `<th>` with `aria-sort` | Pre-WCAG 2.1.1 audit cycles; current standard | Old pattern fails axe-core `button-name` and is keyboard-broken |
| Lucide `ChevronUp` / `ChevronDown` icons | Flat geometric (`▲▼—`) inline glyphs OR custom SVG | DU/TDR aesthetic register lock (LOCKDOWN T2 glyph grammar) | Lucide chevrons are chevron-soft; flat triangles match SF/CD coded register |
| Lodash `debounce` runtime dep for filter input | Custom `useDebouncedValue` hook (~10 LOC) | Modern React idiom; bundle-discipline-driven | Avoids second `_dep_X_decision`; zero dep delta |
| `div` based scrollable container with `overflow-x: auto` | `SFScrollArea` (Radix ScrollArea wrapped) — direct import | Phase 67 DCE'd from barrel but kept on disk | SF-styled thumb (sharp corners, foreground/30); aesthetic lock |

**Deprecated/outdated (do not use):**
- `react-table` v7: deprecated, React 18/19 concurrent-mode issues
- `import 'react-day-picker/dist/style.css'`: irrelevant to SFDataTable but milestone-wide aesthetic violation
- `experimental.inlineCss: true`: rejected (vercel/next.js#47585; breaks `@layer signalframeux`)

## Open Questions

1. **TanStack Table v8 latest patch within `^8.21.3` range**
   - What we know: 8.21.3 is the version locked in research/STACK.md; npm `latest` for `@tanstack/react-table` was 8.21.3 at 2026-04-30; Angular adapter shows 8.21.4 (2026-04-03 per GitHub repo)
   - What's unclear: Whether 8.21.4 (or later patch) exists for the React adapter at Phase 71 ratification time
   - Recommendation: Pin `^8.21.3` (caret allows patch); plan-time verification step: `npm view @tanstack/react-table version` immediately before `pnpm add`. Record the exact resolved version in `_dep_dt_01_decision` `version` field.

2. **TanStack devtools package presence**
   - What we know: Public docs list a `devtools` subpath but never document a separate `@tanstack/react-table-devtools` npm package; bundle escape risk is via `import '@tanstack/react-table/build/lib/devtools'`-style subpath imports
   - What's unclear: Whether the `devtools` subpath even exists in `^8.21.3`'s ESM exports field, or if this risk is theoretical
   - Recommendation: Treat as theoretical risk; Phase 76 BND-08 audit greps homepage manifest for `devtools` substring → expect zero hits. Constraint #7 satisfied by absence-test, no special prevention code needed.

3. **SFCheckbox indeterminate visual treatment**
   - What we know: SFCheckbox at `components/sf/sf-checkbox.tsx:19-34` styles only `data-[state=checked]`. Radix's CheckboxRoot renders `data-state="indeterminate"` when `checked='indeterminate'`.
   - What's unclear: Exact aesthetic treatment for indeterminate — fully filled (same as checked, ambiguous), partial fill (a `before:` pseudo bar), or distinct token (e.g. `--sfx-yellow` or `--sfx-secondary`)
   - Recommendation: Phase 71 plan adds `data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:before:absolute data-[state=indeterminate]:before:inset-x-1 data-[state=indeterminate]:before:top-1/2 data-[state=indeterminate]:before:h-[2px] data-[state=indeterminate]:before:bg-primary-foreground` (horizontal bar fill — DU/TDR coded register; FRAME geometric). Author this as a 1-liner SFCheckbox extension; cite the change in plan.

4. **Filter input position — header row vs separate row vs single global input**
   - What we know: DT-02 specifies "per-column debounced text input + global filter via `getFilteredRowModel`"
   - What's unclear: Visual placement of per-column inputs — inline beneath `<th>` (extra row), inline within `<th>` (cramped), or only on demand (popover)
   - Recommendation: Plan-time choice; default recommendation is a SECOND header row beneath the sort row (`<tr>` with `<th>` containing `<SFInput>` per filterable column). Global filter sits ABOVE the table as a single `<SFInput>`. This is the densest, most legible FRAME-aligned shape.

5. **Page-size selector placement (DT-03 partial)**
   - What we know: DT-03 specifies "controlled `pageIndex` / `pageSize` API" — controlled by consumer
   - What's unclear: Whether to expose an internal page-size selector UI (e.g., `<SFSelect>` 10/25/50/100) or rely 100% on consumer
   - Recommendation: Plan-time choice; default to consumer-controlled (no internal selector). v1.10 scope minimization. Consumer can render their own `<SFSelect>` and call `table.setPageSize()` via prop callback.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright `^1.59.1` (E2E + a11y); Vitest 4.x (unit) |
| Config files | `playwright.config.ts` (existing); `vitest.config.ts` (existing, `passWithNoTests: true` per v1.6 carry-forward) |
| Quick run command (per task) | `pnpm exec playwright test tests/v1.10-phase71-sf-data-table.spec.ts --project=chromium` |
| Full suite command (per wave / phase gate) | `pnpm exec playwright test tests/v1.10-phase71-sf-data-table*.spec.ts && pnpm test` |
| Phase-gate command | `pnpm test && pnpm exec playwright test --project=chromium && rm -rf .next/cache .next && ANALYZE=true pnpm build` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DT-01 | Click column header cycles asc/desc/none + glyph + `aria-sort` updates | unit (vitest react) + e2e (playwright) | `pnpm exec playwright test tests/v1.10-phase71-sf-data-table.spec.ts -g "sort cycle" --project=chromium` | ❌ Wave 0 |
| DT-01 | Keyboard Enter/Space on header button toggles sort (WCAG 2.1.1) | e2e | `pnpm exec playwright test tests/v1.10-phase71-sf-data-table.spec.ts -g "sort keyboard" --project=chromium` | ❌ Wave 0 |
| DT-01 | axe-core `button-name` rule passes on sort headers; `aria-sort` set correctly | a11y | `pnpm exec playwright test tests/v1.10-phase71-sf-data-table-axe.spec.ts -g "sort headers" --project=chromium` | ❌ Wave 0 |
| DT-02 | Filter input debounces at 300ms; `setColumnFilters` called once per debounce window | unit (vitest fake timers) | `pnpm test hooks/use-debounced-value` | ❌ Wave 0 |
| DT-02 | Per-column filter reduces displayed rows on each debounced keystroke | e2e | `pnpm exec playwright test tests/v1.10-phase71-sf-data-table.spec.ts -g "filter rows" --project=chromium` | ❌ Wave 0 |
| DT-03 | Pagination buttons navigate pages; `pageIndex` prop reflects state | e2e | `pnpm exec playwright test tests/v1.10-phase71-sf-data-table.spec.ts -g "pagination" --project=chromium` | ❌ Wave 0 |
| DT-04 | Header checkbox indeterminate visible when some-but-not-all rows selected | e2e + visual | `pnpm exec playwright test tests/v1.10-phase71-sf-data-table.spec.ts -g "selection indeterminate" --project=chromium` | ❌ Wave 0 |
| DT-04 | `getRowModel().rows.filter(r => r.getIsSelected())` returns selected rows after multi-row click | unit (vitest react) | `pnpm test components/sf/sf-data-table` | ❌ Wave 0 |
| DT-05 | Density variants render with correct blessed-stop spacing | visual (Chromatic story) + unit (rendered className grep) | `pnpm test components/sf/sf-data-table -- -t density` | ❌ Wave 0 |
| DT-05 | Loading skeleton renders N×M cells matching pageSize × columns.length | unit | `pnpm test components/sf/sf-data-table -- -t skeleton` | ❌ Wave 0 |
| DT-05 | Empty state renders SFEmptyState in colSpan=N cell when zero rows | unit | `pnpm test components/sf/sf-data-table -- -t empty` | ❌ Wave 0 |
| DT-06 | `import { SFDataTableLazy } from "@/components/sf/sf-data-table-lazy"` resolves; SSR fallback is SFSkeleton | unit | `pnpm test components/sf/sf-data-table-lazy` | ❌ Wave 0 |
| DT-06 | `SFDataTable` and `SFDataTableLazy` ABSENT from `components/sf/index.ts` barrel | structural (grep) | `! grep -E 'sf-data-table' components/sf/index.ts` | manual / Wave 0 |
| DEP-01 | `@tanstack/react-table` ABSENT from homepage `/` First Load JS chunk manifest; PRESENT only in lazy chunk | bundle audit | `node -e "/* parse .next/build-manifest.json + grep analyze/client.html for tanstack */"` | ❌ Wave 0 (script) |
| DEP-01 | Homepage First Load JS ≤ 200 KB after `pnpm add @tanstack/react-table` | bundle audit | `rm -rf .next/cache .next && ANALYZE=true pnpm build && pnpm exec playwright test tests/v1.8-phase63-1-bundle-budget.spec.ts` (existing budget spec from v1.8) | exists (extend) |
| DEP-01 | `_dep_dt_01_decision` block exists at top of `sf-data-table.tsx` with all 7 fields populated | structural (grep) | `grep -E '_dep_dt_01_decision:' components/sf/sf-data-table.tsx && grep -E 'bundle_evidence:' components/sf/sf-data-table.tsx` | ❌ Wave 0 |
| DEP-01 | Devtools path absent from any production chunk | bundle audit | `! grep -r 'devtools' .next/analyze/` | manual at phase close |
| TST-03 | Playwright + axe-core spec files land in same phase as component | structural | file-exists check | ❌ Wave 0 (creates files) |

### Sampling Rate

- **Per task commit:** `pnpm exec playwright test tests/v1.10-phase71-sf-data-table.spec.ts --project=chromium` (~30s) AND `pnpm test components/sf/sf-data-table` (~5s)
- **Per wave merge:** Full SFDataTable test set (Playwright + axe + vitest) AND `rm -rf .next/cache .next && ANALYZE=true pnpm build` (smoke; ~60s)
- **Phase gate:** Full suite green + bundle budget spec PASS + `_dep_dt_01_decision` `bundle_evidence` field populated with measured values + manual `git status` clean (worktree leakage check) + manual grep `! grep -E 'sf-data-table' components/sf/index.ts`

### Wave 0 Gaps

- [ ] `tests/v1.10-phase71-sf-data-table.spec.ts` — covers DT-01 (sort cycle + keyboard), DT-02 (filter rows), DT-03 (pagination), DT-04 (selection + indeterminate)
- [ ] `tests/v1.10-phase71-sf-data-table-axe.spec.ts` — covers DT-01 axe-core (button-name, aria-sort, table semantic) + DT-04 axe-core (selection checkbox label) — mirror the structure of `tests/v1.9-phase66-arc-axe.spec.ts`
- [ ] `hooks/use-debounced-value.ts` — covers DT-02 debounce primitive (10 LOC)
- [ ] `hooks/use-debounced-value.test.ts` (vitest) — covers DT-02 unit (fake timers)
- [ ] Bundle budget spec extension: confirm `tests/v1.8-phase63-1-bundle-budget.spec.ts` asserts `BUDGET_BYTES = 200 * 1024` (already exists per v1.9 Phase 67 close — VERIFY at plan time)
- [ ] `components/sf/sf-data-table.tsx` AND `components/sf/sf-data-table-lazy.tsx` — covers DT-01..06 implementation + `_dep_dt_01_decision` block
- [ ] Optional: `components/sf/sf-data-table.stories.tsx` — Chromatic visual baseline for density variants + selection states
- [ ] Optional: registry entry update in `public/r/registry.json` (Phase 76 final-gate verification, but same-commit rule per REQUIREMENTS.md may push to phase 71)
- [ ] No framework install needed — Playwright `^1.59.1`, vitest 4.x, `@axe-core/playwright@^4.11.1` all present (verified `package.json`)

## Sources

### Primary (HIGH confidence)
- `.planning/research/STACK.md` (this milestone, 2026-05-01) — TanStack Table v8.21.3 version pin, gzip estimates, peer deps, alternatives rationale, full bundle accounting table
- `.planning/research/ARCHITECTURE.md` (this milestone, 2026-04-30) — File layout, P3 lazy pattern, Pattern B canonical form, integration points, SFTable composition
- `.planning/research/PITFALLS.md` (this milestone, 2026-04-30) — Pitfalls #1, 2, 3, 8, 12, 13 directly applicable to SFDataTable
- `.planning/research/SUMMARY.md` (this milestone, 2026-05-01) — Synthesis + projected bundle accounting + research flags
- `.planning/REQUIREMENTS.md` lines 25-32 — DT-01..06, DEP-01, TST-03 verbatim text
- `.planning/ROADMAP.md` lines 44-71 — Phase 71 phase-specific constraints (7 locked rules)
- `.planning/STATE.md` lines 226-237 — v1.10 Critical Constraints (dep-decision-at-plan-time, D-04 lock, P3 lazy mandatory, etc.)
- `.planning/MILESTONES.md` lines 18-19, 22 — Phase 67 BND-05 baseline (187.6 KB) + `_wmk_01_decision` precedent + Phase 69 schema reference
- `components/sf/sf-calendar-lazy.tsx:1-35` — canonical P3 lazy wrapper precedent
- `components/sf/sf-table.tsx:1-127` — render-surface primitive that SFDataTable composes
- `components/sf/sf-checkbox.tsx:1-34` — SFCheckbox indeterminate threading via Radix passthrough
- `components/sf/sf-pagination.tsx:1-135` — SFPagination existing primitive composed by DT-03
- `components/sf/sf-scroll-area.tsx:1-57` — DCE'd from barrel, file remains on disk
- `components/sf/index.ts:1-192` — barrel export inventory + non-barrel rationale comments (`SFCommand*`, `SFScrollArea`, `SFNavigationMenu*`, `SFToaster`/`sfToast`)
- `components/sf/sf-button.tsx:1-65` — CVA `intent`/`size` variant precedent for density variant
- `next.config.ts:1-56` — D-04 chunk-id stability lock comment block + 8-entry `optimizePackageImports` list
- `tests/v1.9-phase66-arc-axe.spec.ts:1-141` — axe-core Playwright test pattern precedent
- `tests/v1.8-phase63-1-wordmark-hoist.spec.ts:1-37` — `_wmk_01_decision` 7-field schema precedent (adapted to `_dep_X_decision`)
- TanStack Table v8 official docs (tanstack.com/table/v8) — sorting/filtering/pagination/selection feature APIs

### Secondary (MEDIUM confidence)
- TanStack Table v8 sorting docs (tanstack.com/table/v8/docs/api/features/sorting) — `getToggleSortingHandler`, `getIsSorted` return shape (verified)
- TanStack Table v8 row-selection docs (tanstack.com/table/v8/docs/guide/row-selection) — `RowSelectionState`, `getIsSomeRowsSelected`, `getSelectedRowModel` (verified)
- npm registry — `@tanstack/react-table` peer dep `react >=16.8`; latest version 8.21.3 (research/STACK.md, 2026-04-30)
- bundlephobia.com — `@tanstack/react-table` ~12-15 KB gzip estimate
- `feedback_agent_worktree_leakage.md` (memory) — worktree leakage hazard
- `feedback_lockin_before_execute.md` (memory) — milestone-wide canonical doc lock-in posture

### Tertiary (LOW confidence — flagged for plan-time verification)
- TanStack Table v8 patch version `8.21.3` vs `8.21.4`: GitHub repo shows angular-table@8.21.4 (2026-04-03) but does not confirm React adapter version. Plan-time verification: `npm view @tanstack/react-table version`.
- TanStack devtools subpath presence in `^8.21.3` ESM exports: theoretical bundle escape vector; plan-time verification: `node -e "console.log(Object.keys(require('@tanstack/react-table/package.json').exports))"` after `pnpm add`.

## Metadata

**Confidence breakdown:**
- Standard Stack: HIGH — version pin, peer deps, gzip range all cross-verified between research/STACK.md, npm registry, and TanStack official docs
- Architecture Patterns: HIGH — every pattern sourced from a shipped codebase file (sf-calendar-lazy.tsx, sf-table.tsx, sf-checkbox.tsx, sf-button.tsx, sf-pagination.tsx, tests/v1.9-phase66-arc-axe.spec.ts, tests/v1.8-phase63-1-wordmark-hoist.spec.ts) — zero external speculation
- Pitfalls: HIGH — derived from 9-milestone project pitfall history (.planning/research/PITFALLS.md) + direct codebase inspection
- Validation Architecture: HIGH — Playwright + axe-core precedent specs already in repo; vitest config already passes-with-no-tests; bundle budget spec from v1.8 Phase 63.1 reusable
- DEP-01 schema: HIGH — `_wmk_01_decision` precedent at `tests/v1.8-phase63-1-wordmark-hoist.spec.ts:1-37` is verbatim mappable to `_dep_dt_01_decision` field-for-field

**Research date:** 2026-05-01
**Valid until:** 2026-05-31 (30 days — TanStack v8.x is stable and unlikely to publish breaking patches; v9 RFC has no release date)
