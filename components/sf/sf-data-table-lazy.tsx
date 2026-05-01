"use client";

/**
 * Lazy loader for SFDataTable — loads @tanstack/react-table only when rendered.
 *
 * P3 component (Pattern B): NEVER exported from sf/index.ts barrel.
 * Import this file directly when you need the data table.
 *
 * Adding `export { SFDataTableLazy } from "./sf-data-table-lazy"` to
 * components/sf/index.ts will spike homepage First Load JS by ~12 KB
 * (TanStack Table) and break BND-08. Phase 76 audit asserts absence of
 * "sf-data-table" substring from the barrel.
 *
 * @example
 * ```tsx
 * import { SFDataTableLazy } from "@/components/sf/sf-data-table-lazy";
 *
 * <SFDataTableLazy
 *   data={users}
 *   columns={columns}
 *   density="default"
 *   pageSize={10}
 *   enableRowSelection
 * />
 * ```
 */

import dynamic from "next/dynamic";
import { SFSkeleton } from "@/components/sf";
import type { SFDataTableProps } from "@/components/sf/sf-data-table";

// next/dynamic does NOT preserve generic type parameters. The localized cast
// in the inner .then() and the prop spread is accepted here for Pattern B
// parity with sf-calendar-lazy.tsx. Consumers retain full type-safety on
// `data`/`columns` because SFDataTableLazy<TData>(props: SFDataTableProps<TData>)
// re-narrows at the boundary.
const SFDataTableDynamic = dynamic(
  () =>
    import("@/components/sf/sf-data-table").then((m) => ({
      default: m.SFDataTable as <TData>(
        props: SFDataTableProps<TData>
      ) => React.ReactElement,
    })),
  {
    ssr: false,
    loading: () => <SFSkeleton className="h-[400px] w-full" />,
  }
);

export function SFDataTableLazy<TData>(props: SFDataTableProps<TData>) {
  return <SFDataTableDynamic {...(props as SFDataTableProps<unknown>)} />;
}
