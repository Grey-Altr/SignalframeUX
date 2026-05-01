"use client";

/**
 * SFDataTable — FRAME layer headless data table (Pattern B, P3 lazy).
 *
 * Composes `@tanstack/react-table@^8.21.3` over the existing SFTable family.
 * Sort + filter + row selection + density CVA + skeleton + empty state.
 * Pagination composition + lazy wrapper land in Plan 03.
 *
 * Pattern B contract (DO NOT VIOLATE):
 *   - NEVER export from components/sf/index.ts barrel
 *   - NEVER add @tanstack/react-table to next.config.ts optimizePackageImports (D-04 lock)
 *   - Consumers import via @/components/sf/sf-data-table-lazy (lands in Plan 03)
 *   - Direct import of this file is SUPPORTED but discouraged outside the lazy wrapper
 */

// ---------------------------------------------------------------------------
// _dep_dt_01_decision — runtime-dep ratification block (REQ-namespaced)
//
// Schema precedent: _wmk_01_decision at tests/v1.8-phase63-1-wordmark-hoist.spec.ts:1-37
//
// _dep_dt_01_decision:
//   decided: "2026-05-01"          # populated by Task 1 author
//   audit: "sf-data-table:runtime-dep"
//   dep_added:
//     - "@tanstack/react-table"
//   version: "8.21.3"
//   rationale: |
//     SFDataTable composes TanStack Table v8 headless logic (sort, filter,
//     pagination, row selection state machine; ~12 KB gzip; zero DOM) over
//     the existing SFTable family. v8 is the maintained-track de-facto React
//     headless-table standard; v9 is open RFC #5834, not yet released.
//     AG Grid (200+ KB) and react-table v7 (deprecated; React 18/19
//     concurrent-mode issues) rejected per .planning/research/STACK.md.
//
//     P3 lazy posture (next/dynamic ssr:false in sf-data-table-lazy.tsx,
//     NOT in sf/index.ts barrel, NOT in next.config.ts optimizePackageImports
//     — D-04 chunk-id stability lock holds) keeps homepage First Load JS
//     impact at 0 KB. Sort headers use <button type="button"> per WCAG 2.1.1;
//     axe-core enforces in Phase 71 Plan 03 TST-03.
//   bundle_evidence:
//     - "Homepage / First Load JS pre-add baseline: 187.6 KB gzip (Phase 67 close)"
//     - "Homepage / First Load JS post-add (placeholder file, no impl): 187.6 KB gzip"
//     - "Headroom remaining: 12.4 KB under 200 KB hard target"
//     - "TanStack Table chunk: ABSENT from homepage manifest (placeholder file has no import — real chunk lands Plan 02)"
//     - "Devtools subpath audit: zero references in .next/analyze/client.html (verified via grep)"
//     - "Resolved version: 8.21.3"
//     - "Measurement command: rm -rf .next/cache .next && ANALYZE=true pnpm build"
//     - "Measurement date: 2026-05-01"
//   review_gate: |
//     Re-evaluate when @tanstack/react-table v9 reaches stable release
//     (currently RFC #5834, no release date). Re-pin and re-measure if
//     v9 changes API surface or bundle profile materially. Also fires
//     if BND-08 budget changes (currently 200 KB hard target) or if D-04
//     chunk-id stability lock is intentionally broken in a future BND phase.
//   scope: "@tanstack/react-table runtime dep — single P3 lazy chunk"
//   ratified_to_main_via: "Phase 71 (Plan 01 commit)"
// ---------------------------------------------------------------------------

// ANTI-PATTERN: never use any TanStack Table sub-path (e.g. the dev-tools
// helper). Bare top-level imports only. Bundle audit (Phase 76 BND-08) greps
// the homepage manifest for the "devtools" string — must remain zero.
// See 71-RESEARCH.md Pitfall B.
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type RowSelectionState,
  type PaginationState,
} from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  SFTable,
  SFTableHeader,
  SFTableBody,
  SFTableRow,
  SFTableHead,
  SFTableCell,
  SFCheckbox,
  SFInput,
  SFSkeleton,
  SFEmptyState,
  SFPagination,
  SFPaginationContent,
  SFPaginationItem,
  SFPaginationLink,
  SFPaginationPrevious,
  SFPaginationNext,
} from "@/components/sf";
// SFScrollArea is NOT in barrel post-Phase-67 — direct import:
import { SFScrollArea } from "@/components/sf/sf-scroll-area";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn } from "@/lib/utils";

// CVA density variant — blessed spacing stops only (4 / 8 / 12 / 16).
// Source pattern: components/sf/sf-button.tsx:5-31 (size variant precedent).
// Pattern 8 in 71-RESEARCH.md.
const sfDataTableVariants = cva(
  "font-mono text-xs border-2 border-foreground",
  {
    variants: {
      density: {
        compact:
          "[&_th]:h-7 [&_td]:px-[var(--sfx-space-2)] [&_td]:py-[var(--sfx-space-1)]",
        default:
          "[&_th]:h-9 [&_td]:px-[var(--sfx-space-3)] [&_td]:py-[var(--sfx-space-2)]",
        comfortable:
          "[&_th]:h-12 [&_td]:px-[var(--sfx-space-4)] [&_td]:py-[var(--sfx-space-3)]",
      },
    },
    defaultVariants: { density: "default" },
  }
);

/**
 * SFDataTable — FRAME layer headless data table.
 *
 * Composes `@tanstack/react-table@^8.21.3` over the existing SFTable family.
 * Sort + filter + row selection + density CVA + skeleton + empty state in v1.10.
 * Pagination composition + lazy wrapper compose in Plan 03.
 *
 * P3 lazy: import via `@/components/sf/sf-data-table-lazy`, NEVER from the barrel.
 *
 * @param data - Array of row records of type `TData`
 * @param columns - TanStack `ColumnDef<TData, unknown>[]` definitions
 * @param density - Spacing variant: "compact" | "default" | "comfortable"
 * @param loading - When true, renders SFSkeleton rows × pageSize × columns
 * @param pageSize - Skeleton row count when loading (default 10)
 * @param enableRowSelection - When true, prepends a checkbox column with indeterminate header (DT-04)
 * @param rowSelection - Controlled row selection state
 * @param onRowSelectionChange - Controlled row selection setter
 * @param globalFilter - Controlled global filter input value (component owns 300ms debounce)
 * @param onGlobalFilterChange - Controlled global filter setter (fired post-debounce)
 * @param virtualize - **@beta — Future v1.11 extension point** (`_dep_dt_02_decision`).
 *   When v1.11 lands `SFDataTableVirtual` with `@tanstack/react-virtual`, this
 *   prop will accept `{ rowHeight: number; overscan?: number }` and route the
 *   render path through `useVirtualizer`. In v1.10, passing this prop is a
 *   no-op + a single console warning. Do NOT remove this prop without bumping major.
 * @param className - Merged via cn() onto the underlying SFTable
 *
 * @example
 * <SFDataTable
 *   data={users}
 *   columns={columns}
 *   density="default"
 *   pageSize={10}
 *   enableRowSelection
 *   onRowSelectionChange={setSelected}
 * />
 */
export interface SFDataTableProps<TData>
  extends VariantProps<typeof sfDataTableVariants> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  /** Loading state — renders SFSkeleton rows × pageSize × columns */
  loading?: boolean;
  /** Initial pageSize used for the skeleton fallback (default 10) */
  pageSize?: number;
  /** Enable row-selection checkbox column (DT-04). Default false. */
  enableRowSelection?: boolean;
  /** Controlled row selection state. */
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (state: RowSelectionState) => void;
  /** Controlled global filter input value. Component owns debouncing. */
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  /** Controlled pagination state (DT-03). When omitted, component owns state internally. */
  pagination?: PaginationState;
  onPaginationChange?: (state: PaginationState) => void;
  /**
   * @beta virtualize — Future v1.11 extension point.
   *
   * When v1.11 lands `SFDataTableVirtual` with `@tanstack/react-virtual`
   * (see `_dep_dt_02_decision`), this prop will accept
   * `{ rowHeight: number; overscan?: number }` and route the render
   * path through `useVirtualizer`. In v1.10, passing this prop is a
   * no-op + a single console warning. Do NOT remove this prop without
   * bumping major.
   */
  virtualize?: { rowHeight: number; overscan?: number };
  className?: string;
}

export function SFDataTable<TData>(props: SFDataTableProps<TData>) {
  const {
    data,
    columns: userColumns,
    density,
    loading = false,
    pageSize = 10,
    enableRowSelection = false,
    rowSelection,
    onRowSelectionChange,
    globalFilter: globalFilterProp,
    onGlobalFilterChange,
    pagination: paginationProp,
    onPaginationChange,
    virtualize,
    className,
  } = props;

  // -------- DT-01 sort + DT-02 filter + DT-03 pagination state --------
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // DT-03: pagination state owned by component unless consumer overrides.
  // Pattern 4 in 71-RESEARCH.md — getPaginationRowModel + page* helpers.
  const [internalPagination, setInternalPagination] = useState<PaginationState>(
    {
      pageIndex: 0,
      pageSize: pageSize,
    }
  );

  // DT-02: 300ms debounced global filter. Component owns the debounce window;
  // controlled API fires onGlobalFilterChange ONLY after the debounce settles.
  // Note on safety: filter values are passed only to TanStack getFilteredRowModel
  // (data-only, no DOM injection). React's default text-node escaping covers
  // any HTML/script-like content the user types. Future maintainers: do NOT
  // introduce raw-HTML cell rendering paths or this assumption breaks.
  const [rawGlobal, setRawGlobal] = useState<string>(globalFilterProp ?? "");
  const debouncedGlobal = useDebouncedValue(rawGlobal, 300);
  const [internalGlobalFilter, setInternalGlobalFilter] = useState<string>(
    globalFilterProp ?? ""
  );

  useEffect(() => {
    setInternalGlobalFilter(debouncedGlobal);
    onGlobalFilterChange?.(debouncedGlobal);
    // We intentionally exclude onGlobalFilterChange from deps to avoid
    // re-firing when consumers pass a non-memoized callback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedGlobal]);

  // Sync controlled globalFilter prop into raw input when consumer overrides.
  useEffect(() => {
    if (globalFilterProp !== undefined && globalFilterProp !== rawGlobal) {
      setRawGlobal(globalFilterProp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalFilterProp]);

  // -------- @beta virtualize — v1.11 extension stub --------
  const virtualizeWarnedRef = useRef(false);
  useEffect(() => {
    if (virtualize && !virtualizeWarnedRef.current) {
      virtualizeWarnedRef.current = true;
      // eslint-disable-next-line no-console
      console.warn(
        "SFDataTable: virtualize prop is a v1.11 extension stub — see _dep_dt_02_decision; current render path ignores it."
      );
    }
  }, [virtualize]);

  // -------- DT-04 selection column (Pattern 5 in 71-RESEARCH.md) --------
  const selectionColumn: ColumnDef<TData, unknown> = {
    id: "select",
    header: ({ table }) => (
      <SFCheckbox
        checked={
          table.getIsAllRowsSelected()
            ? true
            : table.getIsSomeRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={(v) => table.toggleAllRowsSelected(!!v)}
        aria-label="Select all rows"
      />
    ),
    cell: ({ row }) => (
      <SFCheckbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        aria-label={`Select row ${row.id}`}
      />
    ),
    enableSorting: false,
  };

  const columns: ColumnDef<TData, unknown>[] = enableRowSelection
    ? [selectionColumn, ...userColumns]
    : userColumns;

  // Resolved pagination — controlled prop wins over internal state.
  const resolvedPagination = paginationProp ?? internalPagination;

  // -------- TanStack Table instance --------
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter: internalGlobalFilter,
      pagination: resolvedPagination,
      ...(rowSelection !== undefined ? { rowSelection } : {}),
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setInternalGlobalFilter,
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(resolvedPagination) : updater;
      setInternalPagination(next);
      onPaginationChange?.(next);
    },
    onRowSelectionChange: onRowSelectionChange
      ? (updater) => {
          const next =
            typeof updater === "function"
              ? updater(rowSelection ?? {})
              : updater;
          onRowSelectionChange(next);
        }
      : undefined,
    enableRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rows = table.getRowModel().rows;
  const colCount = columns.length;

  return (
    <div className="flex flex-col gap-[var(--sfx-space-3)]">
      {/* DT-02 global filter — component owns 300ms debounce */}
      <SFInput
        value={rawGlobal}
        onChange={(e) => setRawGlobal(e.target.value)}
        placeholder="Filter all columns…"
        aria-label="Global filter"
      />

      <SFScrollArea className="w-full">
        <SFTable className={cn(sfDataTableVariants({ density }), className)}>
          <SFTableHeader>
            {table.getHeaderGroups().map((hg) => (
              <SFTableRow key={hg.id}>
                {hg.headers.map((h) => {
                  const dir = h.column.getIsSorted();
                  const ariaSort: "ascending" | "descending" | "none" =
                    dir === "asc"
                      ? "ascending"
                      : dir === "desc"
                        ? "descending"
                        : "none";
                  return (
                    <SFTableHead key={h.id} aria-sort={ariaSort}>
                      {h.isPlaceholder
                        ? null
                        : h.column.getCanSort() ? (
                            <button
                              type="button"
                              onClick={h.column.getToggleSortingHandler()}
                              className="sf-focusable inline-flex items-center gap-[var(--sfx-space-1)] uppercase tracking-wider rounded-none cursor-pointer"
                            >
                              {flexRender(
                                h.column.columnDef.header,
                                h.getContext()
                              )}
                              <span aria-hidden="true">
                                {dir === "asc"
                                  ? "▲"
                                  : dir === "desc"
                                    ? "▼"
                                    : "—"}
                              </span>
                              <span className="sr-only">
                                {dir === "asc"
                                  ? "Sorted ascending"
                                  : dir === "desc"
                                    ? "Sorted descending"
                                    : "Click to sort"}
                              </span>
                            </button>
                          ) : (
                            flexRender(
                              h.column.columnDef.header,
                              h.getContext()
                            )
                          )}
                    </SFTableHead>
                  );
                })}
              </SFTableRow>
            ))}
          </SFTableHeader>

          <SFTableBody>
            {loading ? (
              // DT-05 skeleton — pageSize rows × column count
              Array.from({ length: pageSize }).map((_, rIdx) => (
                <SFTableRow key={`sf-dt-skel-${rIdx}`}>
                  {Array.from({ length: colCount }).map((__, cIdx) => (
                    <SFTableCell key={`sf-dt-skel-${rIdx}-${cIdx}`}>
                      <SFSkeleton className="h-4 w-full" />
                    </SFTableCell>
                  ))}
                </SFTableRow>
              ))
            ) : rows.length === 0 ? (
              // DT-05 empty state
              <SFTableRow>
                <SFTableCell colSpan={colCount}>
                  <SFEmptyState title="NO DATA" />
                </SFTableCell>
              </SFTableRow>
            ) : (
              rows.map((row) => (
                <SFTableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <SFTableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </SFTableCell>
                  ))}
                </SFTableRow>
              ))
            )}
          </SFTableBody>
        </SFTable>
      </SFScrollArea>

      {/* DT-03 pagination — only when more than one page exists */}
      {table.getPageCount() > 1 && (
        <SFPagination className="mt-[var(--sfx-space-3)]">
          <SFPaginationContent>
            <SFPaginationItem>
              <SFPaginationPrevious
                onClick={(e) => {
                  e.preventDefault();
                  table.previousPage();
                }}
                aria-disabled={!table.getCanPreviousPage()}
                href="#"
              />
            </SFPaginationItem>
            {Array.from({ length: table.getPageCount() }, (_, i) => (
              <SFPaginationItem key={i}>
                <SFPaginationLink
                  isActive={table.getState().pagination.pageIndex === i}
                  onClick={(e) => {
                    e.preventDefault();
                    table.setPageIndex(i);
                  }}
                  href="#"
                >
                  {i + 1}
                </SFPaginationLink>
              </SFPaginationItem>
            ))}
            <SFPaginationItem>
              <SFPaginationNext
                onClick={(e) => {
                  e.preventDefault();
                  table.nextPage();
                }}
                aria-disabled={!table.getCanNextPage()}
                href="#"
              />
            </SFPaginationItem>
          </SFPaginationContent>
        </SFPagination>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------
// Pattern B contract reminder (DO NOT VIOLATE):
//   - This file is NEVER added to components/sf/index.ts
//   - Plan 03 ships sf-data-table-lazy.tsx as the consumer-facing API
//   - Direct imports of SFDataTable are SUPPORTED for advanced use cases
//     (e.g., the playground fixture in app/_dev/playground/sf-data-table)
//     but the canonical consumer path is the lazy wrapper.
//   - Adding `export { SFDataTable } from "./sf-data-table"` to
//     components/sf/index.ts will spike homepage First Load JS by ~12 KB
//     and break BND-08. Phase 76 audit asserts absence.
// -----------------------------------------------------------------------
