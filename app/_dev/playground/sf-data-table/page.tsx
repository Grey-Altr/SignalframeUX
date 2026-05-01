/**
 * Playground fixture — Phase 71 Playwright + axe-core tests target this URL.
 *
 * Path: /_dev/playground/sf-data-table
 *
 * Convention-only suppression: leading underscore in `_dev` keeps this out
 * of typical sitemap/discovery paths. This is a TEST FIXTURE, not a public
 * surface. Do not link to it from production navigation. The hard-coded
 * sitemap at app/sitemap.ts does not enumerate /_dev/* — verified Phase 71.
 * If a sitemap or robots.txt is added in a future phase, ensure /_dev/* is
 * excluded.
 */

"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { SFDataTableLazy } from "@/components/sf/sf-data-table-lazy";

type Row = {
  id: string;
  name: string;
  status: "active" | "pending" | "archived";
  created: string;
};

// 25 rows of test data — exercises pagination (page size 10 => 3 pages),
// filter (typing "user-1" matches user-1, user-10..19), and sort cycles.
const data: Row[] = Array.from({ length: 25 }, (_, i) => ({
  id: `user-${i}`,
  name: `User ${String.fromCharCode(65 + (i % 26))}${i}`,
  status: (["active", "pending", "archived"] as const)[i % 3],
  created: `2026-${String((i % 12) + 1).padStart(2, "0")}-15`,
}));

const columns: ColumnDef<Row, unknown>[] = [
  { accessorKey: "id", header: "ID", enableSorting: true, enableColumnFilter: true },
  { accessorKey: "name", header: "Name", enableSorting: true, enableColumnFilter: true },
  { accessorKey: "status", header: "Status", enableSorting: true },
  { accessorKey: "created", header: "Created", enableSorting: true },
];

export default function SFDataTablePlayground() {
  const [selected, setSelected] = useState({});

  return (
    <main className="p-[var(--sfx-space-6)] min-h-screen bg-background text-foreground">
      <h1 className="font-mono text-xs uppercase tracking-wider mb-[var(--sfx-space-4)]">
        Phase 71 — SFDataTable Playground
      </h1>
      <p data-testid="row-count" className="font-mono text-xs mb-[var(--sfx-space-3)]">
        Selected: {Object.keys(selected).length} of {data.length}
      </p>
      <SFDataTableLazy<Row>
        data={data}
        columns={columns}
        density="default"
        pageSize={10}
        enableRowSelection
        rowSelection={selected}
        onRowSelectionChange={setSelected}
      />
    </main>
  );
}
