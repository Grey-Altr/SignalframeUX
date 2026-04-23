# §14.18 — `/reference` APIExplorer Pagination Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Retrofit `/reference` from a single scrolling APIExplorer block into a paginated SFPanel chain (R-63-g closure), with in-panel detail swap, responsive 1/2-col columns, and command-palette-only filter.

**Architecture:** Responsive slice of 158 alphabetically-ordered COMPONENTS across N fit-mode SFPanels (6 mobile / 3 desktop) + one AUX panel for HOOKS+TOKENS. Active entry swaps its panel's children (grid ↔ detail sheet) via opacity crossfade. Filter lives only in the existing CommandPalette (new "API SURFACES" scope) plus `/` keybind. URL hash = active entry; URL `?q=` = filter.

**Tech Stack:** Next.js 15.3 App Router · React 19 · TypeScript 5.8 · Tailwind v4 (`@theme`) · Vitest (unit) · Playwright (E2E) · Lenis · cmdk (via existing `SFCommand*`) · GSAP 3.12.

**Reference spec:** `.planning/S14-18-reference-pagination-spec.md` — every decision (Q1–Q4 + baked-in defaults) is codified there. Read it first.

**Commit convention:** Every task ships as one atomic commit prefixed `Feat: §14.18 ...` or `Chore: §14.18 ...` (per CLAUDE.md). Direct to `main` — matches the cadence of §14.14 / §14.17.

---

## File structure map

### Create

| File | Responsibility |
|---|---|
| `lib/pagination.ts` | Pure `sliceIntoPanels(entries, rowsPerPanel)`. Zero React. Unit-testable. |
| `hooks/use-api-pagination.ts` | React wrapper: consumes viewport bucket, memoizes slices. |
| `context/api-explorer-context.tsx` | Provider + `useAPIExplorer()`. Syncs `query` ↔ `?q=`, `activeEntryId` ↔ `#hash`. |
| `components/blocks/api-entry-row.tsx` | Extracted row primitive (from current `api-explorer.tsx:222-258`). |
| `components/blocks/api-entry-data-sheet.tsx` | Extracted from current `api-explorer.tsx:281-379`. |
| `components/blocks/api-index-panel.tsx` | One COMPONENTS panel. SFPanel `mode="fit"`. Handles grid↔detail swap. |
| `components/blocks/api-aux-panel.tsx` | HOOKS + TOKENS composite panel. |
| `components/blocks/api-explorer-paginated.tsx` | Orchestrator. Slices entries, renders panel sequence. |
| `lib/api-search-command.ts` | Registers API-surface-search commands into `CommandPalette`. Helpers only; actual `<SFCommandGroup>` render lives in `command-palette.tsx`. |
| `components/layout/slash-focus-listener.tsx` | Client component: `/` keypress → opens palette (R-64-d focus-guarded). Mounted in `nav.tsx` alongside the existing palette. |
| `scripts/audit-api-detail-size.ts` | Build-time audit: computes each `EntryDataSheet` estimate, fails if > 650px. |
| `tests/s14-18-reference-pagination.spec.ts` | Playwright suite covering panel count, R-64-c/d/j, deep-link, repagination, zero-match. |
| `lib/pagination.test.ts` | Vitest unit tests for `sliceIntoPanels`. |

### Modify

| File | Change |
|---|---|
| `app/reference/page.tsx` | Wrap in `<APIExplorerProvider>`, swap `<APIExplorer />` → `<APIExplorerPaginated />`, remove the R-63-g exception comment (lines 42-48), remove `<SFSection>` wrapper (no longer needed). |
| `components/layout/command-palette.tsx` | Add a route-aware `API SURFACES` group. When open and `pathname === "/reference"`, render the group above `NAV_ITEMS` with live-filtered API entries. |
| `components/layout/nav.tsx` | Mount `<SlashFocusListener>` alongside `<CommandPalette>`. |
| `package.json` | Add `"audit:detail-size": "tsx scripts/audit-api-detail-size.ts"` script. |

### Delete

| File | Reason |
|---|---|
| `components/blocks/api-explorer.tsx` | Replaced by `api-explorer-paginated.tsx` + split components. Delete after Task 9 confirms no stale imports. |

---

## Pre-flight

- [ ] **Step 0.1: Confirm clean tree**

Run: `git status`
Expected: on `main`, no uncommitted changes (or only unrelated `.handoffs/` / `.planning/logs/` noise the user is aware of).

- [ ] **Step 0.2: Confirm spec + plan are committed**

Run: `git log --oneline -3 -- .planning/S14-18-*`
Expected: at least one `Chore: §14.18 design spec v1` commit visible.

- [ ] **Step 0.3: Launch dev server in a side terminal**

Run (separate terminal): `pnpm dev`
Expected: `http://localhost:3000` reachable. Navigate to `/reference` — confirm current single-block APIExplorer renders (baseline before retrofit).

---

## Task 1: Pure slicer `lib/pagination.ts`

**Files:**
- Create: `lib/pagination.ts`
- Test: `lib/pagination.test.ts`

- [ ] **Step 1.1: Write failing test**

`lib/pagination.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { sliceIntoPanels } from "./pagination";

describe("sliceIntoPanels", () => {
  const mk = (n: number) =>
    Array.from({ length: n }, (_, i) => ({ id: `e${String(i).padStart(3, "0")}`, pos: i }));

  it("returns empty array for zero entries", () => {
    expect(sliceIntoPanels([], 28)).toEqual([]);
  });

  it("returns single slice when entries <= rowsPerPanel", () => {
    const slices = sliceIntoPanels(mk(5), 28);
    expect(slices).toHaveLength(1);
    expect(slices[0]).toHaveLength(5);
  });

  it("slices 158 into 6 panels of 28 (mobile default)", () => {
    const slices = sliceIntoPanels(mk(158), 28);
    expect(slices).toHaveLength(6);
    expect(slices.slice(0, 5).every((s) => s.length === 28)).toBe(true);
    expect(slices[5]).toHaveLength(18);
  });

  it("slices 158 into 3 panels of 56 (desktop default)", () => {
    const slices = sliceIntoPanels(mk(158), 56);
    expect(slices).toHaveLength(3);
    expect(slices[0]).toHaveLength(56);
    expect(slices[1]).toHaveLength(56);
    expect(slices[2]).toHaveLength(46);
  });

  it("preserves stable order", () => {
    const slices = sliceIntoPanels(mk(10), 4);
    const flat = slices.flatMap((s) => s.map((e) => e.pos));
    expect(flat).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("throws on non-positive rowsPerPanel", () => {
    expect(() => sliceIntoPanels(mk(5), 0)).toThrow();
    expect(() => sliceIntoPanels(mk(5), -1)).toThrow();
  });
});
```

- [ ] **Step 1.2: Run test — expect FAIL**

Run: `pnpm test lib/pagination.test.ts`
Expected: FAIL — `sliceIntoPanels is not a function` (module missing).

- [ ] **Step 1.3: Implement**

`lib/pagination.ts`:

```ts
/**
 * §14.18 · R-63-g support. Pure slicer for paginating entries across SFPanels.
 * Consumed by `hooks/use-api-pagination.ts`. Kept React-free for unit testing.
 */
export function sliceIntoPanels<T>(entries: T[], rowsPerPanel: number): T[][] {
  if (rowsPerPanel <= 0) {
    throw new RangeError(`rowsPerPanel must be > 0, got ${rowsPerPanel}`);
  }
  if (entries.length === 0) return [];
  const slices: T[][] = [];
  for (let i = 0; i < entries.length; i += rowsPerPanel) {
    slices.push(entries.slice(i, i + rowsPerPanel));
  }
  return slices;
}
```

- [ ] **Step 1.4: Run test — expect PASS**

Run: `pnpm test lib/pagination.test.ts`
Expected: 6 passing.

- [ ] **Step 1.5: Commit**

```bash
git add lib/pagination.ts lib/pagination.test.ts
git commit -m "Feat: §14.18 pure sliceIntoPanels utility + unit tests"
```

---

## Task 2: `APIExplorerContext` provider

**Files:**
- Create: `context/api-explorer-context.tsx`

Rationale for scope: sync `query` ↔ `?q=`, `activeEntryId` ↔ `#hash`. Uses Next.js `useSearchParams` + `useRouter` (App Router). URL is source of truth; context is the React surface.

- [ ] **Step 2.1: Scaffold provider + hooks**

`context/api-explorer-context.tsx`:

```tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface APIExplorerState {
  query: string;
  activeEntryId: string | null;
  setQuery: (q: string) => void;
  setActiveEntryId: (id: string | null) => void;
}

const Ctx = createContext<APIExplorerState | null>(null);

export function APIExplorerProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const urlQuery = params.get("q") ?? "";
  const [query, setQueryState] = useState(urlQuery);

  // hash → activeEntryId
  const [activeEntryId, setActiveEntryIdState] = useState<string | null>(null);
  useEffect(() => {
    const read = () => {
      const h = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
      setActiveEntryIdState(h || null);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const setQuery = useCallback(
    (q: string) => {
      setQueryState(q);
      const next = new URLSearchParams(params.toString());
      if (q) next.set("q", q);
      else next.delete("q");
      const qs = next.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}${window.location.hash}`, { scroll: false });
    },
    [params, pathname, router],
  );

  const setActiveEntryId = useCallback(
    (id: string | null) => {
      setActiveEntryIdState(id);
      const qs = params.toString();
      const url = `${pathname}${qs ? `?${qs}` : ""}${id ? `#${id}` : ""}`;
      router.replace(url, { scroll: false });
    },
    [params, pathname, router],
  );

  const value = useMemo(
    () => ({ query, activeEntryId, setQuery, setActiveEntryId }),
    [query, activeEntryId, setQuery, setActiveEntryId],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAPIExplorer(): APIExplorerState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAPIExplorer must be used inside <APIExplorerProvider>");
  return v;
}
```

- [ ] **Step 2.2: Type-check**

Run: `pnpm tsc --noEmit`
Expected: no errors.

- [ ] **Step 2.3: Commit**

```bash
git add context/api-explorer-context.tsx
git commit -m "Feat: §14.18 APIExplorerProvider — URL-synced query + hash state"
```

---

## Task 3: Extract `APIEntryRow` + `APIEntryDataSheet` primitives

No behavior change. Pure code motion from `api-explorer.tsx` to focused files. Future tasks import from here.

**Files:**
- Create: `components/blocks/api-entry-row.tsx`
- Create: `components/blocks/api-entry-data-sheet.tsx`

- [ ] **Step 3.1: Create `api-entry-row.tsx`**

Move the `<button data-api-entry …>` block (currently lines 222-258 of `api-explorer.tsx`) into a dedicated component.

`components/blocks/api-entry-row.tsx`:

```tsx
"use client";

import type { ComponentDoc } from "@/lib/api-docs";

interface APIEntryRowProps {
  id: string;
  doc: ComponentDoc;
  active: boolean;
  showStatus?: boolean; // 1-col mobile: true. 2-col desktop: false.
  onClick: (id: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>, id: string) => void;
}

function formatSignature(doc: ComponentDoc): string {
  if (doc.layer === "HOOK") return "()";
  if (doc.layer === "TOKEN") return ":";
  return "(";
}

export function APIEntryRow({ id, doc, active, showStatus = true, onClick, onKeyDown }: APIEntryRowProps) {
  const cols = showStatus
    ? "grid-cols-[16px_1fr_6ch_8ch_8ch] md:grid-cols-[16px_1fr_8ch_10ch_9ch]"
    : "grid-cols-[16px_1fr_7ch_7ch]";

  return (
    <button
      type="button"
      data-api-entry={id}
      data-api-entry-active={active ? "true" : undefined}
      aria-current={active ? "location" : undefined}
      aria-expanded={active}
      onClick={() => onClick(id)}
      onKeyDown={(e) => onKeyDown(e, id)}
      className={`group w-full text-left px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] py-[var(--sfx-space-1)] grid ${cols} items-baseline gap-[var(--sfx-space-4)] border-l-[3px] transition-colors outline-none ${
        active
          ? "border-l-primary bg-foreground/[0.06]"
          : "border-l-transparent hover:bg-foreground/[0.04] focus-visible:bg-foreground/[0.08] focus-visible:border-l-foreground/40"
      }`}
    >
      <span aria-hidden="true" className="text-[var(--text-xs)] tabular-nums text-muted-foreground">
        {active ? "◉" : "○"}
      </span>
      <span className="min-w-0 text-foreground tracking-tight text-[var(--text-sm)] truncate">
        {doc.importName}
        <span className="text-muted-foreground">{formatSignature(doc)}</span>
      </span>
      <span className="text-[var(--text-xs)] tabular-nums text-muted-foreground text-right">
        {doc.version}
      </span>
      <span className="text-[var(--text-xs)] uppercase tracking-[0.15em] text-muted-foreground text-right">
        [{doc.layer}]
      </span>
      {showStatus && (
        <span className="hidden md:inline text-[var(--text-xs)] uppercase tracking-[0.15em] text-muted-foreground text-right">
          {doc.status}
        </span>
      )}
    </button>
  );
}
```

- [ ] **Step 3.2: Create `api-entry-data-sheet.tsx`**

Move the current `EntryDataSheet` function from `api-explorer.tsx:281-379` verbatim, renamed to `APIEntryDataSheet`.

`components/blocks/api-entry-data-sheet.tsx`:

```tsx
"use client";

import { Fragment } from "react";
import type { ComponentDoc } from "@/lib/api-docs";

export function APIEntryDataSheet({ doc }: { doc: ComponentDoc }) {
  const propsLabel =
    doc.layer === "HOOK" ? "RETURNS" : doc.layer === "TOKEN" ? "TOKENS" : "PROPS";

  return (
    <div className="max-w-[var(--max-w-wide)]">
      <p className="font-mono text-[var(--text-sm)] uppercase tracking-tight text-muted-foreground leading-[1.6] max-w-[72ch] mb-[var(--sfx-space-8)]">
        {doc.description}
      </p>

      <section className="mb-[var(--sfx-space-8)]">
        <div className="text-[var(--text-xs)] uppercase tracking-[0.2em] text-muted-foreground mb-[var(--sfx-space-2)] border-b border-foreground/15 pb-[var(--sfx-space-1)]">
          IMPORT
        </div>
        <pre className="overflow-x-auto font-mono text-[var(--text-sm)] text-foreground whitespace-pre-wrap break-all">
          {`import { ${doc.importName} } from "${doc.importPath}";`}
        </pre>
      </section>

      {doc.props.length > 0 && (
        <section className="mb-[var(--sfx-space-8)]">
          <div className="text-[var(--text-xs)] uppercase tracking-[0.2em] text-muted-foreground mb-[var(--sfx-space-3)] border-b border-foreground/15 pb-[var(--sfx-space-1)]">
            {propsLabel}
          </div>
          <div
            data-api-props-table
            role="list"
            aria-label={`${doc.name} ${propsLabel.toLowerCase()}`}
            className="grid grid-cols-[minmax(120px,auto)_minmax(140px,1.4fr)_minmax(90px,auto)_minmax(200px,2fr)] gap-x-6 gap-y-2 font-mono text-[var(--text-xs)] pt-[var(--sfx-space-2)]"
          >
            <div className="uppercase tracking-[0.15em] text-muted-foreground">NAME</div>
            <div className="uppercase tracking-[0.15em] text-muted-foreground">TYPE</div>
            <div className="uppercase tracking-[0.15em] text-muted-foreground">DEFAULT</div>
            <div className="uppercase tracking-[0.15em] text-muted-foreground">DESCRIPTION</div>
            {doc.props.map((prop) => (
              <Fragment key={prop.name}>
                <div className="text-foreground break-all">
                  {prop.name}
                  {prop.required ? <span className="text-primary">*</span> : null}
                </div>
                <div className="text-muted-foreground break-all">{prop.type}</div>
                <div className="text-muted-foreground tabular-nums break-all">
                  {prop.default || "—"}
                </div>
                <div className="text-muted-foreground uppercase tracking-tight leading-[1.5]">
                  {prop.desc}
                </div>
              </Fragment>
            ))}
          </div>
        </section>
      )}

      {doc.usage.length > 0 && (
        <section className="mb-[var(--sfx-space-8)]">
          <div className="text-[var(--text-xs)] uppercase tracking-[0.2em] text-muted-foreground mb-[var(--sfx-space-3)] border-b border-foreground/15 pb-[var(--sfx-space-1)]">
            USAGE
          </div>
          <div className="space-y-4">
            {doc.usage.map((ex) => (
              <div key={ex.label}>
                <div className="text-[var(--text-xs)] uppercase tracking-[0.15em] text-muted-foreground mb-[var(--sfx-space-1)]">
                  {"// "}{ex.label}
                </div>
                <pre className="overflow-x-auto font-mono text-[var(--text-sm)] text-foreground bg-foreground/[0.05] border border-foreground/10 p-[var(--sfx-space-4)] whitespace-pre">
                  {ex.code}
                </pre>
              </div>
            ))}
          </div>
        </section>
      )}

      {doc.a11y.length > 0 && (
        <section>
          <div className="text-[var(--text-xs)] uppercase tracking-[0.2em] text-muted-foreground mb-[var(--sfx-space-3)] border-b border-foreground/15 pb-[var(--sfx-space-1)]">
            A11Y
          </div>
          <ul className="list-none m-0 p-0 font-mono text-[var(--text-xs)] uppercase tracking-tight text-muted-foreground space-y-1">
            {doc.a11y.map((note, i) => (
              <li key={i} className="leading-[1.6]">
                <span aria-hidden="true" className="text-muted-foreground">{"// "}</span>
                {note}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
```

- [ ] **Step 3.3: Type-check + lint**

Run: `pnpm tsc --noEmit && pnpm lint`
Expected: clean.

- [ ] **Step 3.4: Commit**

```bash
git add components/blocks/api-entry-row.tsx components/blocks/api-entry-data-sheet.tsx
git commit -m "Feat: §14.18 extract APIEntryRow + APIEntryDataSheet primitives"
```

---

## Task 4: `useAPIPagination` hook + entry builder

**Files:**
- Create: `hooks/use-api-pagination.ts`

Responsibilities:
1. Build alphabetically-sorted entries from `API_DOCS`.
2. Classify into COMPONENTS (FRAME+SIGNAL+CORE), HOOKS, TOKENS.
3. Apply `query` filter.
4. Read viewport bucket → `rowsPerPanel`.
5. Return `{ componentsSlices, hooksEntries, tokensEntries, totalAll, totalVisible }`.

- [ ] **Step 4.1: Scaffold hook**

`hooks/use-api-pagination.ts`:

```ts
"use client";

import { useEffect, useMemo, useState } from "react";
import { API_DOCS, type ComponentDoc } from "@/lib/api-docs";
import { sliceIntoPanels } from "@/lib/pagination";

export interface APIEntry {
  id: string;
  doc: ComponentDoc;
}

type SurfaceKey = "COMPONENTS" | "HOOKS" | "TOKENS";

function classify(doc: ComponentDoc): SurfaceKey {
  if (doc.layer === "HOOK") return "HOOKS";
  if (doc.layer === "TOKEN") return "TOKENS";
  return "COMPONENTS";
}

const ROWS_PER_PANEL_MOBILE = 28;
const ROWS_PER_PANEL_DESKTOP = 56;
const DESKTOP_MQ = "(min-width: 768px)";

function matchEntry(entry: APIEntry, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  return (
    entry.id.toLowerCase().includes(needle) ||
    entry.doc.name.toLowerCase().includes(needle) ||
    entry.doc.description.toLowerCase().includes(needle)
  );
}

export interface PaginationResult {
  componentsSlices: APIEntry[][];
  hooksEntries: APIEntry[];
  tokensEntries: APIEntry[];
  totalAll: number;
  totalVisible: number;
  isDesktop: boolean;
  rowsPerPanel: number;
}

export function useAPIPagination(query: string): PaginationResult {
  const allEntries = useMemo<APIEntry[]>(() => {
    const list: APIEntry[] = Object.keys(API_DOCS).map((id) => ({ id, doc: API_DOCS[id] }));
    list.sort((a, b) => a.doc.name.localeCompare(b.doc.name));
    return list;
  }, []);

  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_MQ);
    const read = () => setIsDesktop(mql.matches);
    read();
    mql.addEventListener("change", read);
    return () => mql.removeEventListener("change", read);
  }, []);

  const rowsPerPanel = isDesktop ? ROWS_PER_PANEL_DESKTOP : ROWS_PER_PANEL_MOBILE;

  return useMemo(() => {
    const buckets: Record<SurfaceKey, APIEntry[]> = { COMPONENTS: [], HOOKS: [], TOKENS: [] };
    for (const entry of allEntries) {
      if (!matchEntry(entry, query)) continue;
      buckets[classify(entry.doc)].push(entry);
    }
    const componentsSlices = sliceIntoPanels(buckets.COMPONENTS, rowsPerPanel);
    const totalVisible = buckets.COMPONENTS.length + buckets.HOOKS.length + buckets.TOKENS.length;
    return {
      componentsSlices,
      hooksEntries: buckets.HOOKS,
      tokensEntries: buckets.TOKENS,
      totalAll: allEntries.length,
      totalVisible,
      isDesktop,
      rowsPerPanel,
    };
  }, [allEntries, query, rowsPerPanel, isDesktop]);
}
```

- [ ] **Step 4.2: Sanity-check counts against spec**

Temporarily add `console.log("[§14.18]", componentsSlices.map(s => s.length))` inside the final `useMemo` (gated on `process.env.NODE_ENV !== "production"`). Load `/reference` after Task 9 wires the page. Expected on mobile: `[28, 28, 28, 28, 28, 18]`. On desktop: `[56, 56, 46]`. Remove the log before final commit.

- [ ] **Step 4.3: Type-check**

Run: `pnpm tsc --noEmit`
Expected: clean.

- [ ] **Step 4.4: Commit**

```bash
git add hooks/use-api-pagination.ts
git commit -m "Feat: §14.18 useAPIPagination hook — alpha sort + viewport-aware slicing"
```

---

## Task 5: `APIIndexPanel` — one COMPONENTS panel

**Files:**
- Create: `components/blocks/api-index-panel.tsx`

Handles in-panel grid ↔ detail swap. Uses SFPanel `mode="fit"`. Splits into A-side / B-side columns when `isDesktop`.

- [ ] **Step 5.1: Scaffold panel component**

`components/blocks/api-index-panel.tsx`:

```tsx
"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { SFPanel } from "@/components/sf";
import { useAPIExplorer } from "@/context/api-explorer-context";
import { APIEntryRow } from "./api-entry-row";
import { APIEntryDataSheet } from "./api-entry-data-sheet";
import type { APIEntry } from "@/hooks/use-api-pagination";

interface APIIndexPanelProps {
  slice: APIEntry[];
  panelIndex: number; // 0-based
  totalPanels: number;
  isDesktop: boolean;
  onPrev?: () => void;
  onNext?: () => void;
}

export function APIIndexPanel({ slice, panelIndex, totalPanels, isDesktop, onPrev, onNext }: APIIndexPanelProps) {
  const { activeEntryId, setActiveEntryId } = useAPIExplorer();
  const panelRef = useRef<HTMLElement>(null);

  const activeInSlice = useMemo(
    () => (activeEntryId ? slice.find((e) => e.id === activeEntryId) ?? null : null),
    [slice, activeEntryId],
  );

  const handleRowClick = useCallback(
    (id: string) => setActiveEntryId(activeEntryId === id ? null : id),
    [activeEntryId, setActiveEntryId],
  );

  const handleRowKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, id: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleRowClick(id);
      } else if (e.key === "Escape" && activeEntryId) {
        e.preventDefault();
        setActiveEntryId(null);
      }
    },
    [activeEntryId, handleRowClick, setActiveEntryId],
  );

  const label = `COMPONENTS ${String(panelIndex + 1).padStart(2, "0")}/${String(totalPanels).padStart(2, "0")}${
    activeInSlice ? ` · ${activeInSlice.doc.importName}` : ""
  }`;

  // Dev-only overflow guard (R-63-c compliance check).
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const el = panelRef.current;
    if (!el) return;
    const contentZone = el.querySelector<HTMLElement>("[data-panel-content]");
    if (!contentZone) return;
    const check = () => {
      if (contentZone.scrollHeight > contentZone.clientHeight + 1) {
        console.warn(
          `[§14.18 R-63-c] APIIndexPanel ${panelIndex + 1}/${totalPanels} overflows port: ` +
            `${contentZone.scrollHeight}px content vs ${contentZone.clientHeight}px port.`,
        );
      }
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(contentZone);
    return () => ro.disconnect();
  }, [panelIndex, totalPanels, activeInSlice]);

  const half = Math.ceil(slice.length / 2);
  const aSide = isDesktop ? slice.slice(0, half) : slice;
  const bSide = isDesktop ? slice.slice(half) : [];

  return (
    <SFPanel
      ref={panelRef}
      name={`components-${panelIndex + 1}`}
      mode="fit"
      label={label}
      className="flex flex-col font-mono bg-background"
    >
      <div className="flex items-center justify-between px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] pt-[var(--sfx-space-4)] pb-[var(--sfx-space-2)] text-[var(--text-xs)] uppercase tracking-[0.25em] text-muted-foreground border-b border-foreground/15 shrink-0">
        <span className="text-foreground">{label}</span>
        <span aria-hidden="true" className="tabular-nums text-muted-foreground">
          [{String(slice.length).padStart(2, "0")}]
        </span>
      </div>

      <div data-panel-content className="flex-1 min-h-0 overflow-hidden">
        {activeInSlice ? (
          <div className="px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] pt-[var(--sfx-space-6)] pb-[var(--sfx-space-6)]">
            <APIEntryDataSheet doc={activeInSlice.doc} />
          </div>
        ) : isDesktop ? (
          <div className="grid grid-cols-2 divide-x divide-foreground/20 h-full">
            <ul role="list" className="list-none m-0 p-0 divide-y divide-foreground/10 overflow-hidden">
              {aSide.map((entry) => (
                <li key={entry.id}>
                  <APIEntryRow
                    id={entry.id}
                    doc={entry.doc}
                    active={false}
                    showStatus={false}
                    onClick={handleRowClick}
                    onKeyDown={handleRowKeyDown}
                  />
                </li>
              ))}
            </ul>
            <ul role="list" className="list-none m-0 p-0 divide-y divide-foreground/10 overflow-hidden">
              {bSide.map((entry) => (
                <li key={entry.id}>
                  <APIEntryRow
                    id={entry.id}
                    doc={entry.doc}
                    active={false}
                    showStatus={false}
                    onClick={handleRowClick}
                    onKeyDown={handleRowKeyDown}
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <ul role="list" className="list-none m-0 p-0 divide-y divide-foreground/10 overflow-hidden">
            {slice.map((entry) => (
              <li key={entry.id}>
                <APIEntryRow
                  id={entry.id}
                  doc={entry.doc}
                  active={false}
                  showStatus
                  onClick={handleRowClick}
                  onKeyDown={handleRowKeyDown}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center justify-end gap-[var(--sfx-space-4)] px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] py-[var(--sfx-space-2)] text-[var(--text-xs)] uppercase tracking-[0.2em] text-muted-foreground border-t border-foreground/15 shrink-0">
        <button
          type="button"
          onClick={onPrev}
          disabled={!onPrev}
          aria-label="Previous panel"
          className="disabled:opacity-30 hover:text-foreground focus-visible:text-foreground outline-none"
        >
          ◀
        </button>
        <span className="tabular-nums">
          {String(panelIndex + 1).padStart(2, "0")}/{String(totalPanels).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={!onNext}
          aria-label="Next panel"
          className="disabled:opacity-30 hover:text-foreground focus-visible:text-foreground outline-none"
        >
          ▶
        </button>
      </div>
    </SFPanel>
  );
}
```

- [ ] **Step 5.2: Type-check + lint**

Run: `pnpm tsc --noEmit && pnpm lint`
Expected: clean.

- [ ] **Step 5.3: Commit**

```bash
git add components/blocks/api-index-panel.tsx
git commit -m "Feat: §14.18 APIIndexPanel — fit-mode panel with in-panel detail swap"
```

---

## Task 6: `APIAuxPanel` — HOOKS + TOKENS composite

**Files:**
- Create: `components/blocks/api-aux-panel.tsx`

- [ ] **Step 6.1: Scaffold**

`components/blocks/api-aux-panel.tsx`:

```tsx
"use client";

import { useCallback, useMemo } from "react";
import { SFPanel } from "@/components/sf";
import { useAPIExplorer } from "@/context/api-explorer-context";
import { APIEntryRow } from "./api-entry-row";
import { APIEntryDataSheet } from "./api-entry-data-sheet";
import type { APIEntry } from "@/hooks/use-api-pagination";

interface APIAuxPanelProps {
  hooksEntries: APIEntry[];
  tokensEntries: APIEntry[];
  onPrev?: () => void;
}

export function APIAuxPanel({ hooksEntries, tokensEntries, onPrev }: APIAuxPanelProps) {
  const { activeEntryId, setActiveEntryId } = useAPIExplorer();

  const activeInPanel = useMemo(() => {
    if (!activeEntryId) return null;
    return (
      hooksEntries.find((e) => e.id === activeEntryId) ??
      tokensEntries.find((e) => e.id === activeEntryId) ??
      null
    );
  }, [activeEntryId, hooksEntries, tokensEntries]);

  const handleRowClick = useCallback(
    (id: string) => setActiveEntryId(activeEntryId === id ? null : id),
    [activeEntryId, setActiveEntryId],
  );

  const handleRowKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, id: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleRowClick(id);
      } else if (e.key === "Escape" && activeEntryId) {
        e.preventDefault();
        setActiveEntryId(null);
      }
    },
    [activeEntryId, handleRowClick, setActiveEntryId],
  );

  const label = `AUXILIARY SURFACES${activeInPanel ? ` · ${activeInPanel.doc.importName}` : ""}`;

  return (
    <SFPanel name="aux-surfaces" mode="fit" label={label} className="flex flex-col font-mono bg-background">
      <div className="flex items-center justify-between px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] pt-[var(--sfx-space-4)] pb-[var(--sfx-space-2)] text-[var(--text-xs)] uppercase tracking-[0.25em] text-muted-foreground border-b border-foreground/15 shrink-0">
        <span className="text-foreground">{label}</span>
        <span aria-hidden="true" className="tabular-nums text-muted-foreground">
          [{String(hooksEntries.length + tokensEntries.length).padStart(2, "0")}]
        </span>
      </div>

      <div data-panel-content className="flex-1 min-h-0 overflow-hidden">
        {activeInPanel ? (
          <div className="px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] pt-[var(--sfx-space-6)] pb-[var(--sfx-space-6)]">
            <APIEntryDataSheet doc={activeInPanel.doc} />
          </div>
        ) : (
          <div className="px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] py-[var(--sfx-space-4)] space-y-[var(--sfx-space-6)]">
            <section>
              <div className="text-[var(--text-xs)] uppercase tracking-[0.25em] text-muted-foreground mb-[var(--sfx-space-2)] border-b border-foreground/15 pb-[var(--sfx-space-1)]">
                HOOKS <span className="text-muted-foreground">{"//"}</span> {hooksEntries.length} SURFACES
              </div>
              {hooksEntries.length === 0 ? (
                <div className="text-[var(--text-xs)] uppercase tracking-[0.15em] text-muted-foreground">
                  {"// NO MATCH"}
                </div>
              ) : (
                <ul role="list" className="list-none m-0 p-0 divide-y divide-foreground/10">
                  {hooksEntries.map((entry) => (
                    <li key={entry.id}>
                      <APIEntryRow
                        id={entry.id}
                        doc={entry.doc}
                        active={false}
                        showStatus
                        onClick={handleRowClick}
                        onKeyDown={handleRowKeyDown}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <div className="text-[var(--text-xs)] uppercase tracking-[0.25em] text-muted-foreground mb-[var(--sfx-space-2)] border-b border-foreground/15 pb-[var(--sfx-space-1)]">
                TOKENS <span className="text-muted-foreground">{"//"}</span> {tokensEntries.length} SURFACES
              </div>
              {tokensEntries.length === 0 ? (
                <div className="text-[var(--text-xs)] uppercase tracking-[0.15em] text-muted-foreground">
                  {"// NO TOKENS REGISTERED — pending v0.2"}
                </div>
              ) : (
                <ul role="list" className="list-none m-0 p-0 divide-y divide-foreground/10">
                  {tokensEntries.map((entry) => (
                    <li key={entry.id}>
                      <APIEntryRow
                        id={entry.id}
                        doc={entry.doc}
                        active={false}
                        showStatus
                        onClick={handleRowClick}
                        onKeyDown={handleRowKeyDown}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-[var(--sfx-space-4)] px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] py-[var(--sfx-space-2)] text-[var(--text-xs)] uppercase tracking-[0.2em] text-muted-foreground border-t border-foreground/15 shrink-0">
        <button
          type="button"
          onClick={onPrev}
          disabled={!onPrev}
          aria-label="Previous panel"
          className="disabled:opacity-30 hover:text-foreground focus-visible:text-foreground outline-none"
        >
          ◀
        </button>
        <span className="tabular-nums">AUX</span>
      </div>
    </SFPanel>
  );
}
```

- [ ] **Step 6.2: Type-check + lint**

Run: `pnpm tsc --noEmit && pnpm lint`
Expected: clean.

- [ ] **Step 6.3: Commit**

```bash
git add components/blocks/api-aux-panel.tsx
git commit -m "Feat: §14.18 APIAuxPanel — HOOKS + TOKENS composite tail panel"
```

---

## Task 7: `APIExplorerPaginated` orchestrator

**Files:**
- Create: `components/blocks/api-explorer-paginated.tsx`

- [ ] **Step 7.1: Scaffold**

`components/blocks/api-explorer-paginated.tsx`:

```tsx
"use client";

import { useCallback } from "react";
import { useLenisInstance } from "@/components/layout/lenis-provider";
import { useAPIExplorer } from "@/context/api-explorer-context";
import { useAPIPagination } from "@/hooks/use-api-pagination";
import { APIIndexPanel } from "./api-index-panel";
import { APIAuxPanel } from "./api-aux-panel";

export function APIExplorerPaginated() {
  const { query } = useAPIExplorer();
  const { componentsSlices, hooksEntries, tokensEntries, totalVisible, isDesktop } = useAPIPagination(query);
  const lenis = useLenisInstance();

  const scrollToPanel = useCallback(
    (name: string) => {
      const el = document.querySelector<HTMLElement>(`[data-section="${name}"]`);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      if (lenis) lenis.scrollTo(top, { lock: true });
      else window.scrollTo({ top, behavior: "smooth" });
    },
    [lenis],
  );

  if (totalVisible === 0) {
    return (
      <div
        data-section="no-match"
        className="h-[var(--sf-panel-height)] overflow-hidden flex items-center justify-center font-mono text-[var(--text-sm)] uppercase tracking-[0.2em] text-muted-foreground"
      >
        {`// NO SURFACES MATCH "${query}"`}
      </div>
    );
  }

  const hasAux = hooksEntries.length > 0 || tokensEntries.length > 0;
  const totalWithAux = componentsSlices.length + (hasAux ? 1 : 0);

  return (
    <>
      {componentsSlices.map((slice, i) => (
        <APIIndexPanel
          key={`components-${i}`}
          slice={slice}
          panelIndex={i}
          totalPanels={componentsSlices.length}
          isDesktop={isDesktop}
          onPrev={i > 0 ? () => scrollToPanel(`components-${i}`) : undefined}
          onNext={
            i < totalWithAux - 1
              ? () => scrollToPanel(i + 1 < componentsSlices.length ? `components-${i + 2}` : "aux-surfaces")
              : undefined
          }
        />
      ))}
      {hasAux && (
        <APIAuxPanel
          hooksEntries={hooksEntries}
          tokensEntries={tokensEntries}
          onPrev={
            componentsSlices.length > 0
              ? () => scrollToPanel(`components-${componentsSlices.length}`)
              : undefined
          }
        />
      )}
    </>
  );
}
```

- [ ] **Step 7.2: Type-check + lint**

Run: `pnpm tsc --noEmit && pnpm lint`
Expected: clean.

- [ ] **Step 7.3: Commit**

```bash
git add components/blocks/api-explorer-paginated.tsx
git commit -m "Feat: §14.18 APIExplorerPaginated orchestrator + zero-match panel"
```

---

## Task 8: Command palette integration — `API SURFACES` group + `/` focus

**Files:**
- Create: `lib/api-search-command.ts`
- Create: `components/layout/slash-focus-listener.tsx`
- Modify: `components/layout/command-palette.tsx`
- Modify: `components/layout/nav.tsx`

- [ ] **Step 8.1: Build helper `lib/api-search-command.ts`**

```ts
import { API_DOCS, type ComponentDoc } from "@/lib/api-docs";

export interface APISearchItem {
  id: string;
  label: string;
  sublabel: string;
  value: string; // cmdk search field — combined haystack
}

export function buildAPISearchItems(): APISearchItem[] {
  return Object.keys(API_DOCS)
    .map((id) => {
      const doc: ComponentDoc = API_DOCS[id];
      return {
        id,
        label: doc.importName,
        sublabel: `${doc.layer} · ${doc.version}`,
        value: `${doc.importName} ${id} ${doc.layer} ${doc.name} ${doc.description}`.toLowerCase(),
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));
}
```

- [ ] **Step 8.2: Wire pathname-aware group into `command-palette.tsx`**

Read `components/layout/command-palette.tsx` first. Add these imports near the top:

```tsx
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { buildAPISearchItems } from "@/lib/api-search-command";
```

Inside the `CommandPalette` component, before the returned JSX:

```tsx
const pathname = usePathname();
const isReference = pathname === "/reference";
const apiItems = useMemo(() => (isReference ? buildAPISearchItems() : []), [isReference]);
```

Inside the returned `<SFCommandList>`, **above** the existing `NAV_ITEMS` `<SFCommandGroup>`, insert:

```tsx
{isReference && apiItems.length > 0 && (
  <>
    <SFCommandGroup heading="API SURFACES">
      {apiItems.map((item) => (
        <SFCommandItem
          key={item.id}
          value={item.value}
          onSelect={() => {
            onOpenChange(false);
            // Hash-change listener in APIExplorerProvider picks this up and
            // swaps the containing panel. Keep this handler light.
            window.location.hash = `#${item.id}`;
          }}
        >
          <span>{item.label}</span>
          <span className="ml-auto text-[var(--text-xs)] uppercase tracking-[0.15em] text-muted-foreground">
            {item.sublabel}
          </span>
        </SFCommandItem>
      ))}
    </SFCommandGroup>
    <SFCommandSeparator />
  </>
)}
```

The `cmdk` input already filters items by matching the typed text against the `value` haystack — no extra wiring needed.

- [ ] **Step 8.3: Build `/` focus listener**

`components/layout/slash-focus-listener.tsx`:

```tsx
"use client";

import { useEffect } from "react";

/**
 * §14.18 + R-64-d compliant: `/` opens the command palette. Guarded against
 * input-focus contexts so typing `/` inside a form/search/content-editable
 * element does not hijack the character.
 */
export function SlashFocusListener({ openPalette }: { openPalette: () => void }) {
  useEffect(() => {
    function isEditableTarget(target: EventTarget | null): boolean {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      if (target.isContentEditable) return true;
      const role = target.getAttribute("role");
      if (role === "textbox" || role === "combobox") return true;
      return false;
    }
    function onKey(e: KeyboardEvent) {
      if (e.key !== "/") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isEditableTarget(e.target)) return;
      e.preventDefault();
      openPalette();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openPalette]);

  return null;
}
```

- [ ] **Step 8.4: Wire `SlashFocusListener` into `nav.tsx`**

In `components/layout/nav.tsx`, add the import near the other layout imports:

```tsx
import { SlashFocusListener } from "./slash-focus-listener";
```

Right before the existing `<CommandPalette …/>` mount (line ~788):

```tsx
<SlashFocusListener openPalette={() => setCommandOpen(true)} />
<CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
```

- [ ] **Step 8.5: Type-check + lint**

Run: `pnpm tsc --noEmit && pnpm lint`
Expected: clean.

- [ ] **Step 8.6: Manual smoke**

With dev server running on `/reference` (pre-Task-9 state is fine):
1. Press `⌘K` → palette opens → `API SURFACES` group visible.
2. Type `button` → list filters live.
3. Press `/` anywhere on the page (outside any input) → palette opens.
4. Focus the palette input, press `/` → `/` enters the input (guard works).

- [ ] **Step 8.7: Commit**

```bash
git add lib/api-search-command.ts components/layout/command-palette.tsx components/layout/slash-focus-listener.tsx components/layout/nav.tsx
git commit -m "Feat: §14.18 command palette API SURFACES group + / focus keybind"
```

---

## Task 9: Swap `/reference` page to paginated explorer + remove legacy

**Files:**
- Modify: `app/reference/page.tsx`
- Delete: `components/blocks/api-explorer.tsx`

- [ ] **Step 9.1: Edit `app/reference/page.tsx`**

Replace the entire file (56 lines) with:

```tsx
import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { APIExplorerPaginated } from "@/components/blocks/api-explorer-paginated";
import { APIExplorerProvider } from "@/context/api-explorer-context";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { SFPanel } from "@/components/sf";

export const metadata: Metadata = {
  title: "API Reference — SIGNALFRAME//UX",
  description: "Full API documentation — props, hooks, tokens, and the programmable surface.",
};

export default function APIPage() {
  return (
    <>
      <main
        id="main-content"
        data-cursor
        data-section="ref"
        data-section-label="API"
        data-primary
        className="mt-[var(--nav-height)]"
      >
        <Breadcrumb segments={[{ label: "API" }]} />
        <APIExplorerProvider>
          <SFPanel
            name="reference-hero"
            mode="fit"
            label="API REFERENCE"
            className="relative flex flex-col justify-end"
          >
            <header
              data-nav-reveal-trigger
              className="grid grid-cols-1 md:grid-cols-[1fr_auto] border-b-4 border-foreground items-end min-w-0"
            >
              <h1
                aria-label="API Reference"
                className="sf-display px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] pt-[var(--sfx-space-12)] pb-[var(--sfx-space-6)] leading-[0.9] uppercase tracking-[-0.02em] min-w-0 break-all"
                style={{ fontSize: "clamp(80px, calc(12*var(--sf-vw)), 160px)" }}
              >
                <span data-anim="page-heading" suppressHydrationWarning>API</span>
                <br />
                <span data-anim="page-heading" suppressHydrationWarning>REFERENCE</span>
              </h1>
              <div className="hidden md:block px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] pb-[var(--sfx-space-6)] text-right text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                PROGRAMMABLE SURFACES
              </div>
            </header>
          </SFPanel>

          {/* §14.18 R-63-g closure: APIExplorerPaginated emits N fit-mode SFPanels.
              Total page scroll = (hero + N COMPONENTS + 1 AUX) × port. */}
          <APIExplorerPaginated />
        </APIExplorerProvider>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 9.2: Visual smoke — load `/reference` in dev**

Navigate to `http://localhost:3000/reference`.
Expected:
- Hero panel renders as before.
- Below hero: 6 panels mobile / 3 desktop — each labelled `COMPONENTS NN/TT · SURFACES [xxx–yyy]` and headed with `[count]`.
- One final AUX panel with `HOOKS [5]` + empty `TOKENS` placeholder.
- Click any row → that panel's children swap to the detail sheet. Click again or Esc → back to grid.
- `⌘K` or `/` opens palette with `API SURFACES` group. Select → panel swaps + URL hash updates.
- Mouse-wheel scroll is continuous (no wheel-snap).
- Resize across 768px → panel count changes 6↔3.

- [ ] **Step 9.3: Delete legacy**

```bash
git rm components/blocks/api-explorer.tsx
```

Run: `pnpm tsc --noEmit && pnpm lint && pnpm build`
Expected: clean — no dangling imports of `APIExplorer`.

- [ ] **Step 9.4: Commit**

```bash
git add app/reference/page.tsx
git commit -m "Feat: §14.18 retrofit /reference to SFPanel pagination (R-63-g closure)"
```

---

## Task 10: Build-time detail-size audit

**Files:**
- Create: `scripts/audit-api-detail-size.ts`
- Modify: `package.json` (add script)

Protects the authoring invariant: "detail fits one port". Fails if any entry's `EntryDataSheet` would exceed ~650px at default fluid type — a deterministic estimate (no DOM; computed from `doc.props.length`, `doc.usage`, `doc.a11y`, description length).

- [ ] **Step 10.1: Write the estimator + assertion**

`scripts/audit-api-detail-size.ts`:

```ts
/**
 * §14.18 · Authoring invariant: every API_DOCS entry's EntryDataSheet
 * must fit one port (~650px at default fluid type). This script estimates
 * sheet height deterministically and fails if any entry overflows.
 *
 * Run: pnpm audit:detail-size
 */
import { API_DOCS } from "../lib/api-docs";

const LIMIT_PX = 650;
const CHAR_PER_LINE = 72;

const DESC_LINE_PX = 28;
const IMPORT_BLOCK_PX = 72;
const PROPS_HEADER_PX = 36;
const PROPS_ROW_PX = 28;
const USAGE_HEADER_PX = 36;
const USAGE_BLOCK_PX = 120;
const A11Y_HEADER_PX = 36;
const A11Y_ROW_PX = 24;
const SECTION_GAP_PX = 32;

function estimate(docId: string): { px: number; breakdown: Record<string, number> } {
  const doc = API_DOCS[docId];
  const descLines = Math.max(1, Math.ceil(doc.description.length / CHAR_PER_LINE));
  const descPx = descLines * DESC_LINE_PX;
  const propsPx = doc.props.length > 0 ? PROPS_HEADER_PX + doc.props.length * PROPS_ROW_PX : 0;
  const usagePx = doc.usage.length > 0 ? USAGE_HEADER_PX + doc.usage.length * USAGE_BLOCK_PX : 0;
  const a11yPx = doc.a11y.length > 0 ? A11Y_HEADER_PX + doc.a11y.length * A11Y_ROW_PX : 0;
  const sections = [descPx, IMPORT_BLOCK_PX, propsPx, usagePx, a11yPx].filter((p) => p > 0);
  const gaps = Math.max(0, sections.length - 1) * SECTION_GAP_PX;
  const px = sections.reduce((a, b) => a + b, 0) + gaps;
  return { px, breakdown: { descPx, IMPORT_BLOCK_PX, propsPx, usagePx, a11yPx, gaps } };
}

let violations = 0;
for (const id of Object.keys(API_DOCS)) {
  const { px, breakdown } = estimate(id);
  if (px > LIMIT_PX) {
    violations += 1;
    console.error(`[§14.18 overflow] ${id}: ${px}px > ${LIMIT_PX}px limit`, breakdown);
  }
}

if (violations > 0) {
  console.error(`\n${violations} entries exceed the one-port detail budget.`);
  process.exit(1);
}

console.log(`✓ §14.18 — all ${Object.keys(API_DOCS).length} entries fit one port (≤ ${LIMIT_PX}px).`);
```

- [ ] **Step 10.2: Add npm script**

Open `package.json` and insert inside `"scripts"` after `docs:generate`:

```json
"audit:detail-size": "tsx scripts/audit-api-detail-size.ts",
```

- [ ] **Step 10.3: Run audit**

Run: `pnpm audit:detail-size`
Expected: `✓ §14.18 — all 163 entries fit one port (≤ 650px).`

If any entry exceeds: the script points at which entry and which section bloated. Either trim the entry's description/usage/a11y content in `lib/api-docs/*` (and re-run `pnpm docs:generate` if the offending content came from source JSDoc), or accept the overflow case as a v0.2 follow-up flagged in spec §10. **Do not raise `LIMIT_PX` silently** — treat as an authoring problem.

- [ ] **Step 10.4: Commit**

```bash
git add scripts/audit-api-detail-size.ts package.json
git commit -m "Feat: §14.18 build-time audit — every EntryDataSheet fits one port"
```

---

## Task 11: Playwright verification suite

**Files:**
- Create: `tests/s14-18-reference-pagination.spec.ts`

Uses Playwright's native assertion APIs (`toHaveCount`, `toBeInViewport`, `toHaveURL`, `toHaveValue`, `toBeFocused`, `toBeVisible`) — no DOM property introspection hacks, no hand-rolled scroll-math probes. Each assertion is a single semantic claim.

- [ ] **Step 11.1: Scaffold suite**

```ts
import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

test.describe("§14.18 — /reference pagination retrofit", () => {
  test("Desktop panel count: hero + 3 components + aux = 5", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${BASE}/reference`);
    await expect(page.locator('[data-section="reference-hero"]')).toBeVisible();
    await expect(page.locator('[data-section="aux-surfaces"]')).toBeAttached();
    await expect(page.locator('[data-panel-mode="fit"]')).toHaveCount(5);
  });

  test("Mobile panel count: hero + 6 components + aux = 8", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE}/reference`);
    await expect(page.locator('[data-section="components-6"]')).toBeAttached();
    await expect(page.locator('[data-section="aux-surfaces"]')).toBeAttached();
    await expect(page.locator('[data-panel-mode="fit"]')).toHaveCount(8);
  });

  test("R-64-c: Space advances from hero to first COMPONENTS panel", async ({ page }) => {
    await page.goto(`${BASE}/reference`);
    await expect(page.locator('[data-section="reference-hero"]')).toBeInViewport();
    await page.keyboard.press("Space");
    await expect(page.locator('[data-section="components-1"]')).toBeInViewport({ ratio: 0.5 });
  });

  test("R-64-d: Space inside palette input enters char, does not advance", async ({ page }) => {
    await page.goto(`${BASE}/reference`);
    await expect(page.locator('[data-section="reference-hero"]')).toBeInViewport();
    await page.keyboard.press("Meta+K");
    const input = page.locator("[cmdk-input]").first();
    await input.focus();
    await input.type("a b");
    await expect(input).toHaveValue("a b");
    await page.keyboard.press("Escape");
    await expect(page.locator('[data-section="reference-hero"]')).toBeInViewport();
  });

  test("R-64-j: focus returns to row after Esc closes detail", async ({ page }) => {
    await page.goto(`${BASE}/reference#SFButton`);
    await expect(page.locator("[data-api-props-table]")).toBeVisible();
    const row = page.locator('[data-api-entry="SFButton"]').first();
    await row.focus();
    await page.keyboard.press("Escape");
    await expect(row).toBeFocused();
  });

  test("Deep-link /reference#SFButton lands with detail visible", async ({ page }) => {
    await page.goto(`${BASE}/reference#SFButton`);
    await expect(page.locator("[data-api-props-table]")).toBeVisible();
    await expect(page).toHaveURL(/#SFButton$/);
  });

  test("Filter ?q=button drops panel count below default", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${BASE}/reference?q=button`);
    await expect(page.locator('[data-panel-mode="fit"]').first()).toBeVisible();
    const n = await page.locator('[data-panel-mode="fit"]').count();
    expect(n).toBeLessThan(5);
  });

  test("Zero-match ?q=zzzzzz shows NO MATCH panel, no AUX", async ({ page }) => {
    await page.goto(`${BASE}/reference?q=zzzzzz`);
    await expect(page.locator('[data-section="no-match"]')).toBeVisible();
    await expect(page.locator('[data-section="aux-surfaces"]')).toHaveCount(0);
  });

  test("Palette API-search → select navigates + opens detail", async ({ page }) => {
    await page.goto(`${BASE}/reference`);
    await expect(page.locator('[data-section="reference-hero"]')).toBeInViewport();
    await page.keyboard.press("Meta+K");
    const input = page.locator("[cmdk-input]").first();
    await input.fill("SFButton");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#SFButton$/);
    await expect(page.locator("[data-api-props-table]")).toBeVisible();
  });
});
```

- [ ] **Step 11.2: Run suite**

With dev server running:

Run: `npx playwright test tests/s14-18-reference-pagination.spec.ts --reporter=list`
Expected: 9 passing. If any fail, read the test's claim vs. what the page actually does — either adjust the impl to match the spec or correct the test if it over-constrained a detail the spec didn't lock. **Do not weaken assertions to make tests pass.**

- [ ] **Step 11.3: Commit**

```bash
git add tests/s14-18-reference-pagination.spec.ts
git commit -m "Test: §14.18 Playwright suite — panels, R-64, deep-link, repagination"
```

---

## Task 12: Final QA + CRT + Lighthouse

- [ ] **Step 12.1: Visual register check**

With dev server running, load `/reference`. Screenshot at 390×844 (mobile) and 1440×900 (desktop):
1. First COMPONENTS panel (grid state).
2. Mid COMPONENTS panel with a row active (detail state).
3. AUX panel (HOOKS + TOKENS empty state).

Compare against `.planning/design/strategy/DESIGN-STATE.md` and the aesthetic digest. Target: ≥ 90/100 CRT — tight grid, zero radius, schematic register, no newspaper-gutter between A-side/B-side, typography reads as MIDI-spec / Dischord tracklist.

- [ ] **Step 12.2: R-63-b global assertion check**

Load `/reference` with dev console open. The existing `PanelHeightAssertion` (if §14.15 has shipped) should NOT emit warnings. If §14.15 hasn't shipped yet, this check is implicit — `document.documentElement.scrollHeight / window.innerHeight` should be close to the expected panel count (allowing for the Footer outside the panel chain).

- [ ] **Step 12.3: Lighthouse**

Run Lighthouse on `/reference` (Chrome DevTools, mobile profile). Target thresholds per project quality bar:
- Performance ≥ 90 (retrofit baseline; 100 is stretch)
- Accessibility = 100
- Best Practices ≥ 95
- SEO = 100
- LCP < 1.0s · CLS = 0 · TTI < 1.5s

Record numbers. If Performance regressed vs. pre-retrofit, investigate — likely suspects: too many panels at cold-load (missing `React.memo` on index panels), or the hash listener firing layout too aggressively.

- [ ] **Step 12.4: Final regression sweep**

Run the full test suite:

```bash
pnpm test
npx playwright test
pnpm lint
pnpm build
```

Expected: all clean. `pnpm build` in particular catches any remaining stale imports or SSR hydration mismatches.

- [ ] **Step 12.5: Commit any fixes found**

If QA/Lighthouse surfaced fixes: commit each as its own atomic `Fix: §14.18 <what>` commit. Do not bundle.

- [ ] **Step 12.6: Update LOCKDOWN.md §14 item 18**

Edit `.planning/LOCKDOWN.md` §14 item 18 to replace `pending execution` with `SHIPPED @ <commit sha>`. Remove the R-63-g exception note from the open-issues list in the audit section if present.

Commit:

```bash
git add .planning/LOCKDOWN.md
git commit -m "Chore: §14.18 mark SHIPPED in LOCKDOWN.md §14"
```

---

## Self-review checklist (run before handing off for merge)

**Spec coverage** — every spec section maps to a task:
- §1 Decisions Q1–Q4 → Tasks 5, 6 (in-panel swap + category layout), 7 (responsive cols), 8 (palette filter)
- §2 Panel roster → Task 7 (orchestrator)
- §3 Component architecture → Tasks 1–7 (all new files)
- §4 State / data flow → Task 2 (context) + Task 8 (palette)
- §5 Fit-mode layout → Tasks 5, 6 (panels) + existing `-fluid` tokens (shipped §14.17)
- §6 Edge cases → Task 7 (zero-match, filter collision) + Task 11 (Playwright regression)
- §7 Count reconciliation → Task 6 label + Task 11 zero-match test
- §8 Verification gates → Task 10 (detail-size audit) + Task 11 (Playwright) + Task 12 (CRT / Lighthouse)
- §9 Out-of-scope → honored (no `/reference/[id]` route, no new motion, no api-docs mutation)
- §10 Follow-ups → flagged in spec; not addressed here

**Placeholder scan** — no `TODO`, `TBD`, `"implement later"`, or vague instructions. Every step shows exact code or exact command.

**Type consistency** — `APIEntry`, `PaginationResult`, `SurfaceKey`, `APISearchItem` — single definitions, consistent names across tasks. `sliceIntoPanels` takes `rowsPerPanel` everywhere (not `perPage`). `activeEntryId` (not `activeId`, not `activeSurface`) across context + panels + tests.

**Commit atomicity** — 12 task commits + optional `Fix:` commits in Task 12. Each independently revertable.

---

**End of plan.** 12 tasks · ~12 commits · 13 new files · 4 modified · 1 deleted. Spec at `.planning/S14-18-reference-pagination-spec.md` is the companion — read it first.
