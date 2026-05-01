# Architecture Research — v1.10 Library Completeness

**Domain:** Design system component integration (Next.js 15.5 App Router + SF dual-layer model)
**Researched:** 2026-04-30
**Confidence:** HIGH (sourced from shipped codebase files, no external speculation)

---

## System Overview

The existing integration architecture is stable and dictates how the 5 new components slot in:

```
┌──────────────────────────────────────────────────────────────────┐
│                    BUNDLE DELIVERY LAYER                          │
│                                                                   │
│  sf/index.ts barrel  ←  optimizePackageImports  ←  next.config   │
│  (Pattern A + C)         "@/components/sf"           (8 entries) │
│                                                                   │
│  P3 lazy files  (sf-*-lazy.tsx)  ←  next/dynamic(ssr:false)      │
│  (Pattern B)     NOT in barrel    SFSkeleton loading fallback     │
└──────────────────────────────────────────────────────────────────┘
           │                              │
           ▼                              ▼
┌──────────────────────┐    ┌─────────────────────────────────────┐
│  FRAME LAYER         │    │  P3 LAZY CHUNK  (per-component)     │
│  Server Components   │    │  'use client' required              │
│  by default          │    │  TanStack Table / Tiptap / etc.     │
│  'use client' only   │    │  Loaded on first render, not boot   │
│  if hooks/state      │    └─────────────────────────────────────┘
└──────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────────┐
│                 SHARED PRIMITIVES                                  │
│  SFTable  SFCalendar  SFCommand  SFPopover  SFInput               │
│  SFSkeleton  SFScrollArea(disk-only)  SFBadge  SFButton           │
└──────────────────────────────────────────────────────────────────┘
```

**Bundle baseline:** `/` First Load JS = 187.6 KB gzip (12.4 KB under 200 KB hard target).
**Chunk-ID lock:** D-04 RE-LOCKED at v1.9-bundle-reshape baseline. Any addition to `optimizePackageImports` is REJECTED until a future phase explicitly authorizes another D-04 unlock window.

---

## Component Integration Analysis

### 1. SFDataTable

**RSC vs Client:** Client Component. Sort, filter, and pagination state require `useState`/`useReducer`. URL param state (via `useSearchParams` + `useRouter`) is an option for shareable sort/filter state, but requires `Suspense` boundary wrapping — viable but not mandatory for v1.10.

**State location decision:** Local `useState` for v1.10 scope. URL params are a consumer concern, not a system default. The SFDataTable prop contract should expose `onSortChange`, `onFilterChange`, `onPageChange` callbacks so consumers can promote state to URL if needed.

**Composition with SFTable:** SFDataTable EXTENDS, does not replace SFTable. SFTable remains the simple semantic-HTML primitive for static data. SFDataTable wraps it: TanStack Table's `flexRender()` output feeds into `<SFTable>`, `<SFTableHeader>`, `<SFTableRow>`, `<SFTableHead>`, `<SFTableCell>` — the existing styled primitives become the render surface. Zero new table DOM styling needed.

**Virtualization decision:** SFScrollArea was barrel-DCE'd in Phase 67 (barrel re-export removed; implementation file `components/sf/sf-scroll-area.tsx` still on disk). For v1.10 SFDataTable: use `sf-scroll-area.tsx` via direct import (not barrel) for the scrollable container. TanStack Virtual (`@tanstack/react-virtual`) is a SEPARATE optional dep from TanStack Table — do NOT bundle it by default. SFDataTable virtualization (DT-04/DT-05) should be a lazy variant: `SFDataTableVirtual` using the same P3 lazy pattern. TanStack Virtual is ~4 KB gz; if bundled eagerly it still fits under 200 KB, but lazy is cleaner since most table consumers won't need it.

**New dep required:** `@tanstack/react-table` v8 (TanStack Table). Requires `_dep_01_decision` block. Bundlephobia: ~14 KB gz. This pushes `/` First Load JS only if SFDataTable is eagerly imported — it MUST be P3 lazy.

**P3 lazy decision:** YES. P3 lazy mandatory. `sf-data-table-lazy.tsx` is the public API. The main `sf-data-table.tsx` is never in the barrel.

**Registry entry:**
- `meta.layer`: `"frame"` (sorting/filtering is structural behavior, not expressive)
- `meta.pattern`: `"B"` (lazy, P3)
- `meta.heavy`: `true`
- `registryDependencies`: `["table"]` (shadcn table base)
- `dependencies`: `["@tanstack/react-table"]`

**Build order dependency:** Needs no shared primitive to land first. SFTable already exists. SFScrollArea is accessible via direct import. Phase 71 can proceed immediately.

**Files produced:**
- `components/sf/sf-data-table.tsx` (main impl, 'use client', NOT in barrel)
- `components/sf/sf-data-table-lazy.tsx` (next/dynamic wrapper, public API)
- No modification to `sf/index.ts`

---

### 2. SFCombobox

**RSC vs Client:** Client Component. Open/closed state for the popover and the search/filter state for the command list both require `useState`. No way around it.

**Composition pattern:** SFCombobox is Pattern C (pure-SF construction) that composes existing SF primitives — it does NOT add new Radix primitives. The architecture is:

```
SFCombobox
  └── SFPopover (existing — sf-popover.tsx)
        ├── SFPopoverTrigger
        │     └── SFButton or SFInput (trigger surface)
        └── SFPopoverContent
              └── SFCommand (existing — sf-command.tsx, direct import)
                    ├── SFCommandInput (search)
                    └── SFCommandList
                          ├── SFCommandEmpty
                          └── SFCommandGroup
                                └── SFCommandItem (per option)
```

**Critical barrel note:** `SFCommand` is explicitly NOT in the barrel (see `sf/index.ts` line 70-74: "cmdk (~12 kB gz) + nested radix-dialog/primitives add up"). SFCombobox must import from `"@/components/sf/sf-command"` directly.

**Async data contract:** The prop interface should accept either `options: Array<{value: string; label: string}>` (sync) or `onSearch: (query: string) => Promise<Array<{value: string; label: string}>>` (async). The async path requires an internal loading state with SFSkeleton fallback inside the command list. This is the only novel architectural element.

**No new dep:** SFCombobox is zero new runtime dep. All building blocks exist: `cmdk` (already in stack), `radix-ui` Popover (already in stack), SFCommand and SFPopover (already authored). Only composition code is new.

**P3 lazy decision:** NO. SFCombobox does not introduce a heavy dep. But it composes SFCommand which pulls `cmdk` (~12 KB gz). The `cmdk` chunk is already handled via `optimizePackageImports: ["cmdk"]` — it routes to a lazy per-route chunk, not the homepage First Load JS. SFCombobox itself can live in the barrel (exported from `sf/index.ts`) without impacting homepage bundle because it imports from the direct path, not the barrel, for SFCommand.

**Barrel rule exception check:** SFCombobox imports `SFCommand` from the direct file path. SFCommand is not in the barrel. Therefore SFCombobox in the barrel does NOT eagerly pull `cmdk` into the homepage bundle. SAFE to barrel-export.

**Registry entry:**
- `meta.layer`: `"frame"`
- `meta.pattern`: `"C"` (pure-SF composition, no Radix base of its own)
- `meta.heavy`: `false`
- `registryDependencies`: `["popover", "command", "input", "button"]`

**Build order dependency:** Needs SFCommand (exists), SFPopover (exists), SFInput (exists), SFButton (exists). No blocker. Can follow Phase 71 immediately as Phase 72.

**Files produced:**
- `components/sf/sf-combobox.tsx` ('use client', exported from barrel)
- No lazy wrapper needed

---

### 3. SFRichEditor

**RSC vs Client:** Client Component. Tiptap requires the browser DOM for ProseMirror. The editor instance lives inside the component via `useEditor()` hook. No SSR path is possible — this is the most strictly client-bound component in the set.

**Controlled vs uncontrolled:** Tiptap's `useEditor()` is inherently uncontrolled (the editor IS the state). Expose a controlled-compatible contract via:
- `defaultContent?: string | JSONContent` (initial value, uncontrolled)
- `content?: string | JSONContent` (controlled — syncs editor on change)
- `onUpdate?: (output: EditorOutput) => void` (change callback)

The `EditorOutput` type should carry all three formats simultaneously: `{ html: string; json: JSONContent; text: string }` — let the consumer choose. Do NOT force a single output format at the component API level.

**Tailwind v4 @theme integration:** Tiptap's editor content renders inside a ProseMirror-managed `<div>` with `.ProseMirror` class. SF styling of editor content requires a `@layer signalframeux` rule targeting `.ProseMirror` children (headings, paragraphs, lists, blockquotes). This is a globals.css addition, not a component-level concern. Use `--sfx-*` token references inside these rules. Anti-pattern: do NOT inject Tiptap's bundled CSS — use only SF tokens.

**New dep required:** `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`. Requires `_dep_02_decision` block. Bundlephobia: Tiptap starter-kit ~48 KB gz (includes ProseMirror core). This is the largest single new dep in v1.10 — P3 lazy is not optional, it's mandatory.

**P3 lazy decision:** YES. Mandatory. Tiptap's bundle cannot touch First Load JS. `sf-rich-editor-lazy.tsx` is the public API; the loading fallback should be an SFSkeleton with a fixed height matching the editor container.

**Toolbar architecture:** Keep the toolbar as a sub-component (`SFRichEditorToolbar`) authored inside `sf-rich-editor.tsx`. The v1.10 scope is "limited toolbar" (RE-02): bold, italic, heading levels, ordered/unordered lists, blockquote, link. Do NOT expose Tiptap's extension system directly through the SF API — accept an `extensions?: Extensions` pass-through prop for consumers who need to extend.

**Registry entry:**
- `meta.layer`: `"frame"` (editor is structural; consumers wire their own SIGNAL effects)
- `meta.pattern`: `"B"` (lazy, P3)
- `meta.heavy`: `true`
- `registryDependencies`: `["button", "separator", "tooltip"]`
- `dependencies`: `["@tiptap/react", "@tiptap/pm", "@tiptap/starter-kit"]`

**Build order dependency:** No shared primitive needed first. Standalone dep. Phase 73 can proceed after Phase 72 completes.

**Files produced:**
- `components/sf/sf-rich-editor.tsx` ('use client', NOT in barrel)
- `components/sf/sf-rich-editor-lazy.tsx` (next/dynamic wrapper, public API)
- `app/globals.css` additions: `.ProseMirror` scoped rules under `@layer signalframeux`

---

### 4. SFFileUpload

**RSC vs Client:** Client Component for the drag-drop surface (requires `dragover`, `drop` event listeners) and progress display (requires `useState` for progress). The upload action itself can be a React 19 Server Action.

**React 19 form action integration:** React 19's `useActionState` (successor to `useFormState`) is the correct pattern. The SFFileUpload component wraps a `<form action={serverAction}>` with:
- `useActionState(action, initialState)` for pending/error state
- `data-[pending]` attribute on the drop zone for CSS-driven pending state
- A `progressToken` prop for consumers using streaming progress via `ReadableStream` from the server action

**Progress reporting pattern:** Server Actions in Next.js 15 do not support streaming responses natively (they return a single value). The correct architecture for progress is a separate API route (`/api/upload`) using `ReadableStream` + `EventSource` or `fetch` with streaming, NOT Server Actions. SFFileUpload should accept either:
- `action: string` (URL for streaming fetch-based upload, progress via `onProgress`)
- `serverAction: (formData: FormData) => Promise<UploadResult>` (no progress, simpler)

Expose both via the prop contract. Do not conflate them.

**No new dep:** SFFileUpload uses only the browser File API, `DragEvent`, and `fetch`. No external dep required.

**Error boundary pattern:** SFFileUpload handles its own error states via internal `useState`. Do NOT require consumers to wrap in `<ErrorBoundary>` — errors from upload failure are UX states, not React render errors. Return `{ status: 'error'; message: string }` in the result type.

**P3 lazy decision:** NO. SFFileUpload has no heavy dep. It can live in the barrel. Bundle delta should be < 5 KB (SCAFFOLDING.md rule for FRAME-only components). It is pure TypeScript + JSX + browser APIs.

**Registry entry:**
- `meta.layer`: `"frame"`
- `meta.pattern`: `"C"` (pure-SF construction, no Radix base)
- `meta.heavy`: `false`
- `registryDependencies`: `["button", "progress", "label"]`

**Build order dependency:** Uses SFProgress (exists), SFButton (exists), SFLabel (exists). No blocker. But a shared `useFileUpload` hook pattern (if extracted) would be usable by both SFFileUpload and any consumer. Recommend keeping it internal for v1.10 — extract to `hooks/` only if a second consumer emerges.

**Files produced:**
- `components/sf/sf-file-upload.tsx` ('use client', exported from barrel)

---

### 5. SFDateRangePicker

**RSC vs Client:** Client Component. Date range selection state (`{ from: Date | undefined; to: Date | undefined }`) requires `useState`. The calendar must be mounted in the browser (SFCalendar is already P3 lazy + ssr:false). SFDateRangePicker itself needs 'use client'.

**Composition with existing SFCalendar:** SFDateRangePicker composes `SFCalendarLazy` (already exists at `components/sf/sf-calendar-lazy.tsx`) by passing `mode="range"` and `selected={dateRange}` to the underlying react-day-picker `Calendar`. No modification to `sf-calendar.tsx` needed — the range prop is already part of react-day-picker's API and flows through the existing `SFCalendarProps` passthrough (`type SFCalendarProps = React.ComponentProps<typeof Calendar>`).

**Popover wrapper:** The calendar dropdown is anchored via SFPopover (existing). Architecture:

```
SFDateRangePicker ('use client')
  └── SFPopover
        ├── SFPopoverTrigger
        │     └── SFButton (displays formatted date range)
        └── SFPopoverContent
              └── SFCalendarLazy (mode="range", ssr:false)
```

**Time picker primitive question:** The v1.10 scope includes a "time variant" (DR-03). A time picker is NOT a shared primitive that SFRichEditor needs — the date-link feature in a rich editor is a different interaction model. Do NOT extract a `SFTimePicker` primitive ahead of v1.10 scope. Instead, author a `SFTimeInput` sub-component directly inside `sf-date-range-picker.tsx` using `<SFInput type="time">` (the browser native time input, styled with SF tokens). This satisfies DR-03 without introducing a new primitive.

**Output format decision:** Expose `Date` objects in the prop contract (`value: { from?: Date; to?: Date }`), not ISO strings or unix timestamps. Formatting is a consumer concern. Include a `locale` prop (forwarded to react-day-picker) and a `formatDisplay?: (from: Date, to: Date) => string` prop for custom trigger label formatting.

**P3 lazy decision:** YES, but indirectly. SFDateRangePicker itself is lightweight, but it mounts `SFCalendarLazy` which is P3 lazy (react-day-picker). The outer SFDateRangePicker shell can be in the barrel — the heavy dep is already deferred inside `SFCalendarLazy`. However, since SFPopover + SFDateRangePicker together with calendar create a composed unit that most consumers will use together, and `react-day-picker` is already in `optimizePackageImports`, the lazy boundary is already handled. SFDateRangePicker can be barrel-exported.

**Registry entry:**
- `meta.layer`: `"frame"`
- `meta.pattern`: `"C"` (pure-SF composition — no single Radix base, composes multiple SF primitives)
- `meta.heavy`: `false` (heavy dep is inside SFCalendarLazy, not this component)
- `registryDependencies`: `["sf-calendar", "sf-popover", "sf-button", "sf-input"]`

**Build order dependency:** Depends on SFCalendarLazy (exists), SFPopover (exists), SFButton (exists), SFInput (exists). No blocker. Should be Phase 75 (last) because it's the most complex composition and the time-picker sub-component is novel.

**Files produced:**
- `components/sf/sf-date-range-picker.tsx` ('use client', exported from barrel)

---

## Registry Position for 5 New Entries

Current registry: 53 items. Post-v1.10: 58 items.

| Component | Pattern | Layer | Heavy | Position in Registry |
|-----------|---------|-------|-------|---------------------|
| SFDataTable | B | frame | true | After sf-table |
| SFCombobox | C | frame | false | After sf-command / sf-popover group |
| SFRichEditor | B | frame | true | New "Content" category |
| SFFileUpload | C | frame | false | Under Forms — Extended |
| SFDateRangePicker | C | frame | false | After sf-calendar |

**REG-01 implementation note:** The 5 registry entries must land in the same commit as their component files per SCAFFOLDING.md rule #4 (Registry Same-Commit Rule). Run `pnpm registry:build` to regenerate `public/r/` files per-component.

---

## Shared Primitives Analysis

The question was: what shared primitives should land BEFORE component phases?

**Verdict: NO new shared primitives needed.** All required building blocks exist:

| Needed By | Primitive | Status |
|-----------|-----------|--------|
| SFDataTable | SFTable, SFScrollArea (direct import) | Both exist on disk |
| SFCombobox | SFCommand (direct import), SFPopover, SFInput | All exist |
| SFRichEditor | SFButton, SFSeparator, SFTooltip | All in barrel |
| SFFileUpload | SFProgress, SFButton, SFLabel | All in barrel |
| SFDateRangePicker | SFCalendarLazy, SFPopover, SFButton, SFInput | All exist |

**The "TimePicker shared primitive" question:** Rejected. The time-variant in SFDateRangePicker (DR-03) is an `<SFInput type="time">` wrapper, not a standalone primitive. Only one consumer exists in v1.10 scope. Extracting a `SFTimePicker` to `sf/` preemptively violates the CLAUDE.md rule: "DO NOT add features, components, or tokens beyond stabilization scope."

**The "virtualization wrapper" question:** TanStack Virtual (for SFDataTable large-list virtualization) is not shared with SFCombobox in v1.10. SFCombobox async loading uses cmdk's built-in virtualization for command lists — it does NOT use TanStack Virtual. The two components have different virtualization needs. No shared wrapper.

---

## Build Order

Dependencies flow as follows. Phases must respect this order:

```
Phase 71: SFDataTable
  ← No new shared primitive needed
  ← SFTable (existing), SFScrollArea direct import (existing)
  ← @tanstack/react-table new dep (_dep_01_decision)

Phase 72: SFCombobox
  ← No new shared primitive needed
  ← SFCommand direct import (existing), SFPopover (existing)
  ← Zero new dep

Phase 73: SFRichEditor
  ← No new shared primitive needed
  ← SFButton, SFSeparator, SFTooltip (all existing)
  ← @tiptap/react + @tiptap/pm + @tiptap/starter-kit new dep (_dep_02_decision)
  ← globals.css .ProseMirror rules (new addition)

Phase 74: SFFileUpload
  ← No new shared primitive needed
  ← SFProgress, SFButton, SFLabel (all existing)
  ← Zero new dep

Phase 75: SFDateRangePicker
  ← SFCalendarLazy (existing, Phase 71-74 complete)
  ← SFPopover, SFInput, SFButton (all existing)
  ← Zero new dep (react-day-picker already in stack)

Phase 76: Final Gate
  ← All 5 components shipped
  ← Chromatic story coverage, bundle audit (BND-08), docs
```

Phase ordering rationale: SFDataTable first (largest new dep, sets the `_dep_01_decision` precedent for TanStack), SFCombobox second (no dep, low-risk), SFRichEditor third (largest overall dep, `_dep_02_decision`, globals.css mutation), SFFileUpload fourth (no dep, pure-SF), SFDateRangePicker last (most complex composition, depends on calendar which must be stable).

---

## Architectural Patterns

### Pattern: P3 Lazy Wrapper (Pattern B)

**What:** Heavy component loaded via `next/dynamic({ ssr: false })` with `SFSkeleton` as loading fallback. The lazy file is the public API. The implementation file is never in `sf/index.ts`.

**When to use:** When the component's own code or its direct deps would add >3 KB gz to First Load JS on the homepage. Both SFDataTable and SFRichEditor qualify.

**Canonical form (from sf-calendar-lazy.tsx):**
```typescript
"use client";
import dynamic from "next/dynamic";
import { SFSkeleton } from "@/components/sf";

const SFDataTableDynamic = dynamic(
  () => import("@/components/sf/sf-data-table").then((m) => ({
    default: m.SFDataTable,
  })),
  {
    ssr: false,
    loading: () => <SFSkeleton className="h-[400px] w-full" />,
  }
);

export function SFDataTableLazy(
  props: React.ComponentProps<typeof SFDataTableDynamic>
) {
  return <SFDataTableDynamic {...props} />;
}
```

### Pattern: Pure-SF Composition (Pattern C)

**What:** No Radix base. Composes existing SF components. Server Component by default unless hooks are required.

**When to use:** When the component's behavior is purely compositional — it assembles existing SF primitives into a higher-order pattern. SFCombobox, SFFileUpload, SFDateRangePicker all qualify.

**Key rule:** Pattern C components that compose P3-lazy sub-components (SFCombobox does not; SFDateRangePicker composes SFCalendarLazy) are still safe to barrel-export because the lazy boundary is inside the sub-component, not the wrapper.

### Pattern: Direct Import for Non-Barrel Components

**What:** Some SF components exist on disk but are deliberately NOT in `sf/index.ts`. They must be imported directly.

**Non-barrel components as of v1.9:**
- `SFCommand*` — cmdk too heavy for barrel
- `SFScrollArea` — DCE'd from barrel in Phase 67
- `SFNavigationMenu*` — DCE'd from barrel in Phase 67
- `SFToaster`/`sfToast` — sonner too heavy for barrel
- All P3 lazy impl files (`sf-calendar.tsx`, `sf-menubar.tsx`, etc.)

**New components that must use direct import internally:**
- SFDataTable imports `SFScrollArea` from `"@/components/sf/sf-scroll-area"` directly
- SFCombobox imports `SFCommand*` from `"@/components/sf/sf-command"` directly

---

## Anti-Patterns

### Anti-Pattern 1: Adding SFDataTable or SFRichEditor to the barrel

**What people do:** Export from `sf/index.ts` for convenience.
**Why it's wrong:** TanStack Table (~14 KB gz) or Tiptap (~48 KB gz) would enter First Load JS on every page, instantly blowing the 200 KB budget on the homepage.
**Do this instead:** Export only the `*Lazy` wrapper file from a direct import. Never touch the barrel for Pattern B components.

### Anti-Pattern 2: Adding entries to `optimizePackageImports` for new deps

**What people do:** Add `@tanstack/react-table` or `@tiptap/react` to `next.config.ts` `optimizePackageImports`.
**Why it's wrong:** Adding any entry non-additively reshuffles webpack's `splitChunks` boundaries, dissolving the post-Phase-67 stable chunk IDs (D-04 lock). Per the next.config.ts comment: "further additions to this list are REJECTED until a future phase explicitly authorizes another break of the chunk-id lock."
**Do this instead:** The P3 lazy pattern already defers these deps to per-route chunks without needing `optimizePackageImports`. Leave the 8-entry list untouched for v1.10.

### Anti-Pattern 3: Sharing a TimePicker primitive prematurely

**What people do:** Extract `SFTimePicker` as a shared primitive "for future use by SFRichEditor date-link."
**Why it's wrong:** Only one v1.10 consumer (SFDateRangePicker DR-03). Pre-extraction violates CLAUDE.md's "DO NOT add features beyond stabilization scope." The API will be wrong until a second real consumer exists.
**Do this instead:** Author the time input as `<SFInput type="time">` inside `sf-date-range-picker.tsx`. Extract only if/when a second consumer appears in a future milestone.

### Anti-Pattern 4: `'use client'` in `sf/index.ts`

**What people do:** Add 'use client' to the barrel when a new interactive component is added.
**Why it's wrong:** Turns all 6 layout primitives (SFContainer, SFSection, SFStack, SFGrid, SFText, SFPanel) into Client Components, silently inflating bundle by forcing them into client chunks.
**Do this instead:** Each interactive component declares `'use client'` in its own file only. The barrel has no directive. This is SCAFFOLDING.md rule #3 — verified as invariant across all 53 existing registry items.

### Anti-Pattern 5: Tiptap CSS injection

**What people do:** Import Tiptap's bundled CSS (`@tiptap/core/dist/tiptap.css` or Tiptap-provided starter styles).
**Why it's wrong:** Bypasses `@layer signalframeux` cascade ordering. Introduces generic dark-mode aesthetic. Violates token system.
**Do this instead:** Write `.ProseMirror` scoped rules in `app/globals.css` under `@layer signalframeux` using `--sfx-*` tokens. Only four elements need rules: `p`, `h1-h4`, `ul/ol/li`, `blockquote`.

---

## Bundle Accounting

Current budget headroom: 12.4 KB under 200 KB target (187.6 KB current).

| Component | Eager delta | P3 lazy? | Homepage impact |
|-----------|-------------|----------|-----------------|
| SFDataTable | ~0 KB | YES | 0 KB (lazy chunk) |
| SFCombobox | ~2-3 KB | NO | ~2-3 KB (composition code only; cmdk already lazy via optimizePackageImports) |
| SFRichEditor | ~0 KB | YES | 0 KB (lazy chunk) |
| SFFileUpload | ~3-4 KB | NO | ~3-4 KB (no heavy dep) |
| SFDateRangePicker | ~3-5 KB | NO | ~3-5 KB (react-day-picker already in optimizePackageImports, lazy) |

**Projected First Load JS after all 5:** ~195-198 KB gzip. Within 200 KB hard target under normal conditions.
**BND-08 gate:** Full fresh build (`rm -rf .next/cache .next && ANALYZE=true pnpm build`) required at Phase 76 close. AES-04 pixel-diff gate applies per-phase.

---

## Data Flow

### SFDataTable

```
Consumer provides: columns[], data[], optional callbacks
  ↓
TanStack Table useReactTable() → table instance (local state)
  ↓
SFTableHeader → flexRender(header.column.columnDef.header)
SFTableBody  → flexRender(cell.column.columnDef.cell)
  ↓
Sort click → column.getToggleSortingHandler() → local state update → re-render
Filter input → setColumnFilters() → local state update → re-render
Page change → setPagination() → local state update → re-render
```

### SFCombobox

```
Consumer provides: options[] or onSearch async fn, value, onValueChange
  ↓
SFPopover open/closed state (local useState)
  ↓ (open)
SFCommandInput value → filters SFCommandItem list (cmdk internal)
  OR onSearch(query) → async fetch → setItems (local useState)
  ↓
SFCommandItem selected → onValueChange(value) → popover closes
```

### SFRichEditor

```
Consumer provides: defaultContent | content, onUpdate, extensions
  ↓
useEditor({ extensions: [StarterKit, ...extensions] }) → editor instance
  ↓
content prop changes → editor.commands.setContent() (controlled sync)
  ↓
editor.on('update') → onUpdate({ html, json, text })
  ↓
SFRichEditorToolbar → editor.chain().focus().toggleBold().run() etc.
```

### SFFileUpload

```
Consumer provides: action (URL) | serverAction, accept, multiple, onComplete
  ↓
DragEvent / input change → FileList → validation (type, size)
  ↓
Path A (fetch streaming): fetch(action, { body: FormData }) + ReadableStream progress
Path B (server action): serverAction(formData) → useActionState result
  ↓
onProgress(0-100) → SFProgress tween update
onComplete(result) | onError(error) → consumer callback
```

### SFDateRangePicker

```
Consumer provides: value { from?: Date; to?: Date }, onValueChange
  ↓
SFPopoverTrigger → formatted string display (formatDisplay prop or default)
  ↓ (popover open)
SFCalendarLazy mode="range" selected=value onSelect=onValueChange
  ↓ (DR-03 time variant)
SFInput type="time" for from-time + to-time → merged into Date object
  ↓
onValueChange({ from: Date, to: Date }) → consumer state update
```

---

## Integration Points

### Existing SF Components Touched

| Component | Modified? | How |
|-----------|-----------|-----|
| `sf/index.ts` barrel | YES (add 3) | SFCombobox, SFFileUpload, SFDateRangePicker exported |
| `sf/index.ts` barrel | NO (2 omitted) | SFDataTable, SFRichEditor stay out of barrel |
| `sf-table.tsx` | NO | Consumed as-is by SFDataTable via import |
| `sf-calendar-lazy.tsx` | NO | Consumed as-is by SFDateRangePicker |
| `sf-calendar.tsx` | NO | Passthrough props already handle `mode="range"` |
| `sf-command.tsx` | NO | Consumed as-is by SFCombobox via direct import |
| `sf-popover.tsx` | NO | Consumed as-is by SFCombobox + SFDateRangePicker |
| `sf-scroll-area.tsx` | NO | Consumed as-is by SFDataTable via direct import |
| `app/globals.css` | YES (add) | `.ProseMirror` scoped rules for SFRichEditor |
| `public/r/registry.json` | YES (add 5) | New registry entries per REG-01 |
| `next.config.ts` | NO | D-04 lock holds; no new optimizePackageImports entries |

### New Files Created

| File | Pattern | Barrel? |
|------|---------|---------|
| `components/sf/sf-data-table.tsx` | B impl | NO |
| `components/sf/sf-data-table-lazy.tsx` | B lazy | NO |
| `components/sf/sf-combobox.tsx` | C | YES |
| `components/sf/sf-rich-editor.tsx` | B impl | NO |
| `components/sf/sf-rich-editor-lazy.tsx` | B lazy | NO |
| `components/sf/sf-file-upload.tsx` | C | YES |
| `components/sf/sf-date-range-picker.tsx` | C | YES |

---

## Sources

All findings sourced from codebase files. No external speculation.

- `components/sf/index.ts` — barrel exports, non-barrel rationale comments
- `components/sf/sf-calendar-lazy.tsx` — P3 lazy pattern reference
- `components/sf/sf-calendar.tsx` — react-day-picker range prop passthrough pattern
- `components/sf/sf-command.tsx` — SFCommand composition reference
- `components/sf/sf-popover.tsx` — SFPopover composition reference
- `components/sf/sf-table.tsx` — SFTable primitive (SFDataTable render surface)
- `components/sf/sf-menubar-lazy.tsx` — P3 lazy root component pattern variant
- `components/sf/sf-toast-lazy.tsx` — P3 lazy (simplified, no loading fallback variant)
- `components/sf/sf-drawer-lazy.tsx` — P3 lazy pattern with SFSkeleton fallback
- `next.config.ts` — D-04 chunk-ID lock rationale, optimizePackageImports list
- `.planning/codebase/v1.9-bundle-reshape.md` — bundle baseline, chunk IDs, Vector rationale
- `.planning/codebase/AESTHETIC-OF-RECORD.md` — AES-01..04 standing rules
- `SCAFFOLDING.md` — 9-point checklist, Pattern A/B/C definitions, registry template
- `.planning/PROJECT.md` — v1.10 requirements, standing rules, D-04 lock status

---

*Architecture research for: SignalframeUX v1.10 Library Completeness — 5-component integration*
*Researched: 2026-04-30*
