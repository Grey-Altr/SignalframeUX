# §14.18 — `/reference` APIExplorer Pagination Retrofit · Design Spec v1

**Status:** DESIGN LOCKED — awaits user sign-off before planning.
**Closes:** LOCKDOWN.md §14 item 18 (R-63-g retrofit of 158-surface API index).
**Depends on:** §14.17 (-fluid typography, shipped @ 5878185), §14.14 (/reference hero SFPanel, shipped @ 2ead69b).
**Does not depend on:** §14.15 (R-63-b assertion — independent), §14.16 (overlay focus-return audit — independent).

---

## 0 · Context

`/reference` is the prose-heaviest page in the system and the last R-63-g exception (per `app/reference/page.tsx:42-48`). The current `APIExplorer` is a single scrolling block with sticky filter + inline row-expand, which violates R-63-c (no internal scroll inside a panel) and SFPanel `overflow: hidden`. This spec retrofits that block to a panel-composed pagination chain compatible with R-63 + R-64.

**Data shape (measured):**
- FRAME 138 + SIGNAL 15 + CORE 5 = **158** → classifies to `COMPONENTS` bucket
- HOOK 5 → `HOOKS` bucket
- TOKEN 0 → `TOKENS` bucket (empty; TOKEN layer exists in `types.ts` but no entries yet)
- Total registered surfaces: **163** (LOCKDOWN's "158" refers to COMPONENTS only — see §7 note)

**Detail-sheet audit (measured against `lib/api-docs/*`):**
- Max props per entry: **4** (SFSection, SFStack, SFToggleGroup)
- Mean props per entry: 0.3
- Usage examples per entry: exactly 1
- A11y notes per entry: avg 2.2, max 3
- Worst-case `EntryDataSheet` height: ~650px → fits one port at default fluid type on every supported viewport. **Detail-fits-one-port is an authoring invariant, not a runtime mechanism.**

---

## 1 · Decisions locked (during brainstorming)

| # | Question | Decision |
|---|---|---|
| Q1 | Where does the expanded `EntryDataSheet` live? | **(a) In-panel replace.** Panel swaps children: index-grid ↔ detail. Re-click / Esc returns. Never reads layout during swap. |
| Q2 | Category arrangement across panels | **(B) COMPONENTS paginates strictly; HOOKS + TOKENS merge into one `AUXILIARY SURFACES` tail panel.** Avoids a deliberately-empty TOKENS frame before v0.2. |
| Q3 | Column layout | **(C) Responsive hybrid.** 1-col mobile (< 768px), 2-col "A-side / B-side" desktop (≥ 768px). `status` column drops on 2-col (preserved in detail). |
| Q4 | Filter / search behavior cross-panel | **(C) Command palette only.** No visible filter chrome anywhere. `⌘K` + `/` open the palette in "API surface search" scope. Discoverability via R-64-i `?` cheatsheet + nav chrome hint. |

**Baked-in defaults (not questioned further):**
- **Entry order:** alphabetical across the entire `COMPONENTS` bucket — the FRAME/SIGNAL/CORE sub-layer grouping is dissolved at the pagination layer; sub-layer is preserved only as the `[LAYER]` row column. `HOOKS` entries sort alphabetically within the AUX panel.
- **Deep-link model:** URL hash `#SFButton` for active entry; URL search param `?q=button` for filter.
- **Motion:** existing R-64 Lenis snap between panels + existing GSAP row-stagger on panel entry. No new motion primitives.
- **Keybind ownership:** `/` focuses the palette in API-search scope. `⌘K` opens the palette globally (shipped). `/` must not conflict with any future R-64 keybind — coordinate with R-64 owner during planning. No other new keybinds introduced by this retrofit.

---

## 2 · Panel roster & page composition

**Mobile (1-col, ≤ 28 rows/panel):**

```
[Hero panel]        HERO (shipped 2ead69b — unchanged)
[Panel 1]           COMPONENTS 01/06 · SURFACES [001–028]
[Panel 2]           COMPONENTS 02/06 · SURFACES [029–056]
[Panel 3]           COMPONENTS 03/06 · SURFACES [057–084]
[Panel 4]           COMPONENTS 04/06 · SURFACES [085–112]
[Panel 5]           COMPONENTS 05/06 · SURFACES [113–140]
[Panel 6]           COMPONENTS 06/06 · SURFACES [141–158]
[Panel 7]           AUXILIARY SURFACES · HOOKS [5] + TOKENS [0 · placeholder]
[Footer]            global chrome, outside SFPanel, outside R-63-b window
```

**Desktop ≥ md (2-col A-side / B-side, ≤ 56 rows/panel):**

```
[Hero panel]        HERO (unchanged)
[Panel 1]           COMPONENTS 01/03 · SURFACES [001–056] (A-side 001–028 / B-side 029–056)
[Panel 2]           COMPONENTS 02/03 · SURFACES [057–112] (A-side 057–084 / B-side 085–112)
[Panel 3]           COMPONENTS 03/03 · SURFACES [113–158] (A-side 113–140 / B-side 141–158)
[Panel 4]           AUXILIARY SURFACES · HOOKS [5] + TOKENS [0 · placeholder]
[Footer]            global chrome
```

**Panel chrome contract (every index panel + AUX panel):**

- Top: panel label, 32px, `text-xs uppercase tracking-[0.25em]`.
- Bottom: pagination chrome `◀ NN/TT ▶`, 32px, right-aligned. `◀` / `▶` are focusable buttons with `aria-label="Previous panel / Next panel"` (mouse parity for Space / Shift+Space per R-64-a).
- Padding: `var(--sfx-space-4)` on all edges.
- Content zone height: `100dvh − 64px − 2 × var(--sfx-space-4)`.
- **No filter bar.** (Q4.)

When a row activates → panel children swap from index grid → single `EntryDataSheet`. Panel label updates: `COMPONENTS 03/03` → `COMPONENTS 03/03 · SFButton`. Re-click / Esc reverses.

---

## 3 · Component architecture

### New files

| File | Responsibility |
|---|---|
| `components/blocks/api-explorer-paginated.tsx` | Orchestrator. Reads `API_DOCS`, consumes `APIExplorerContext` for `query`, hashes entries into `COMPONENTS` panels + `AUX` panel, renders sequence. Handles hash → `activeEntryId`, Esc clears active. |
| `components/blocks/api-index-panel.tsx` | One COMPONENTS panel. 1-col mobile / 2-col desktop. Handles in-panel swap (grid ↔ detail). Wraps in `SFPanel mode="fit"`. |
| `components/blocks/api-aux-panel.tsx` | HOOKS + TOKENS composite. Same in-panel swap. |
| `components/blocks/api-entry-row.tsx` | Extracted row primitive (current inline `<button>` grid in `api-explorer.tsx:222-258`). Reused by index + aux. |
| `components/blocks/api-entry-data-sheet.tsx` | Moved verbatim from `api-explorer.tsx:281-379`. No internal composition changes. |
| `hooks/use-api-pagination.ts` | Pure: `(entries, rowsPerPanel) → panelSlices[]`. Unit-testable. |
| `lib/api-search-command.ts` | Registers API-surface-search commands into the existing `CommandPalette`. Returns matched entries; writes `?q=…` + `#{id}` to URL; closes palette; Lenis `scrollTo` to target panel. |
| `context/api-explorer-context.tsx` | React context. Exposes `{ query, setQuery, activeEntryId, setActiveEntryId }`. Provider mounted in `app/reference/page.tsx`. |

### Removed / retired

| File / behavior | Reason |
|---|---|
| `components/blocks/api-explorer.tsx` (current single-block) | Replaced by paginated split. Delete after new files ship + all references migrated. |
| Sticky filter bar | R-63-c + Q4 (C). |
| In-place expand-below-row | R-63-c + Q1 (a). |
| `app/reference/page.tsx:42-48` R-63-g exception comment | Retrofit closes this exception. Remove after shipping. |

### Data layer

`lib/api-docs*` unchanged. Retrofit is render-layer only (matches the existing `data layer frozen` comment at `api-explorer.tsx:12`).

---

## 4 · State & data flow

| State | Source of truth | Persists | Mutates via |
|---|---|---|---|
| `query` | `APIExplorerContext` | URL `?q=button` | Command palette input, `/` keybind |
| `activeEntryId` | URL hash `#SFButton` | Hash | Row click, palette selection, Esc, filter-collision |
| `panelSlices` | `useMemo((filteredEntries, rowsPerPanel))` | — | Recomputes on `query` or viewport bucket change |
| `isDesktop` | `useMediaQuery('(min-width: 768px)')` | — | Viewport resize; determines `rowsPerPanel ∈ { 28, 56 }` |

**Flow:**

```
URL hash change ──┐
                  ├──► APIExplorerContext ──► APIExplorerPaginated
URL ?q= change ───┘                            │
                                               ├─► slice entries into N panels
⌘K / "/" keypress ──► CommandPalette           ├─► render N × APIIndexPanel
                      (API-search scope)       └─► render APIAuxPanel
                      writes ?q= + #id
                      closes palette
                      Lenis scrollTo #panel
```

---

## 5 · Fit-mode column layout contract

### Mobile (1-col)

Row grid: `[icon 16px][name 1fr][version 6ch][layer 8ch][status 8ch]`.
Gutters: `var(--sfx-space-6)` horizontal, `var(--sfx-space-1)` vertical.
Row height at `text-sm-fluid` + `leading-[1.3]`: 22–24px.

### Desktop ≥ md (2-col)

Per column: `[icon 16px][name 1fr][version 7ch][layer 7ch]`. `status` column **dropped** (near-constant STABLE — preserved in detail sheet).
Column divider: 1px `foreground/20`, no gutter padding (schematic register, not newspaper-gutter).

### Type scale

- Rows: `text-sm-fluid` (`clamp(0.813rem, 1.2vi, 1.125rem)`).
- Panel label + pagination chrome: `text-xs` fixed (chrome doesn't scale).
- Detail sheet: inherits fluid scale from shipped `-fluid` tier.

### Overflow guard

Dev-only assertion after mount + on resize: `contentZone.scrollHeight <= contentZone.clientHeight` within 1px tolerance. Warn in console if any row pushes past. Sibling to the shipped R-63-b `PanelHeightAssertion`.

### In-panel swap motion

Active row click → fade grid out (opacity 1→0, 120ms `var(--sfx-ease-default)`) → swap children → fade detail in (opacity 0→1, 160ms). Panel height constant at `100dvh` throughout. Esc / re-click reverses. **No layout reads during swap** (pure opacity transition).

---

## 6 · Edge cases

| Case | Handling |
|---|---|
| Load cold (`/reference`) | No hash, no query. All 4–7 panels render. No active entry. |
| Load `/reference#SFButton` | `activeEntryId = "SFButton"`. Containing panel swaps to detail on mount. Lenis scrolls to panel boundary. |
| Load `/reference?q=button` | Filter applied. Panels repaginate (e.g., 12 matches → 1 COMPONENTS panel + hero + footer). R-63-b assertion recomputes against new N. |
| Load `/reference?q=button#SFButton` | Both applied. Filtered panel list + SFButton active inside its panel. |
| Filter → zero matches | Single "NO SURFACES MATCH `{q}`" panel below hero. Keyboard navigation still works — Space lands on it, no visual state change. |
| Active entry + filter that excludes it | Clear `activeEntryId` silently (strip hash). Filter takes precedence. |
| Entry slice boundary straddles an open detail | Detail closes first (grid restored) → reslice → new panels settle. Prevents orphaned detail. |
| Viewport resize across md breakpoint | Reslice. Active entry preserved — panel index recomputed. Lenis re-snaps. |
| Deep-link to non-existent `#FOO` | Ignore hash. Strip from URL. No error state. |
| Narrow viewport (< 320px) | 1-col fallback. Overflow assertion fires if content breaches; v1 ships with audit-confirmed safe counts, no dynamic shrink. |
| SSR | Panel count serializes assuming `isDesktop = false` (7-panel layout). Hydration reads `matchMedia`, reslices if desktop. One hydration reflow acceptable. |
| `@media print` | Out of scope for this retrofit. Log as follow-up. |
| `⌘K` palette open mid-swap | Palette takes focus (shipped). Swap completes in background. Esc on palette returns to whatever state settled. |

---

## 7 · Count reconciliation

LOCKDOWN.md §14.18 says "158 surfaces". Live code exports 163 total. Reconciliation:

- `COMPONENTS` bucket (FRAME + SIGNAL + CORE) = **158** → matches LOCKDOWN's "158".
- `HOOKS` bucket = 5.
- `TOKENS` bucket = 0.

**No LOCKDOWN amendment.** Spec codifies that "158" refers to the `COMPONENTS` bucket specifically; AUX panel label makes the HOOKS + TOKENS asymmetry explicit. Hero panel display count stays at 163 (total registered surfaces).

---

## 8 · Verification gates

| Check | Mechanism |
|---|---|
| R-63-b: `scrollHeight === N × innerHeight` | Existing global `PanelHeightAssertion` applies to `/reference` after retrofit; `app/reference/page.tsx:42-48` exception comment removed. |
| R-63-c: no internal scroll within any panel | Dev-only assertion per §5 overflow guard. |
| R-63-f: every page panel uses `SFPanel` | Code review — no raw `<section>` / `<div>` with panel-sized height. |
| R-63-g: prose paginates across panels | This retrofit IS the R-63-g closure for `/reference`. |
| R-64-c: Space advances one panel boundary | Playwright: Space from panel N → panel N+1 ±1px. All COMPONENTS + AUX panels. |
| R-64-d: focus guards | Playwright: palette input focused, Space → input takes char, no advance. |
| R-64-j: focus-return-to-trigger | Playwright: row click → detail → Esc → focus on row button. |
| R-61: no layout reads in hot paths | Code review: no `getBoundingClientRect` in palette handler, row click, or arrow handler. Offsets from R-63-i registry only. |
| Deep-link load | Playwright: `/reference#SFButton` cold → panel in view, detail swapped in. |
| Filter repagination | Playwright: `/reference?q=button` → panel count matches; R-63-b passes. |
| Detail fits one port (authoring invariant) | Build-time `scripts/audit-api-detail-size.ts`: server-render each `EntryDataSheet`, measure, fail build if any > 650px at default fluid type. |
| CRT register | Visual QA — screenshot first COMPONENTS panel, mid COMPONENTS panel, AUX panel across mobile + desktop; compare to aesthetic digest; ≥ 90/100. |
| Quality bar | Lighthouse 100/100; LCP < 1.0s; CLS = 0. |

---

## 9 · Out of scope

- Reordering entries beyond alphabetical within category.
- Per-entry interactive previews.
- Modifying `lib/api-docs/*` or `scripts/generate-api-docs.ts`.
- Introducing `/reference/[id]` routes (data audit confirms no entry needs it).
- New motion primitives or animation components (LOCKDOWN §14 Tier 3 scope fence).
- `@media print` composition.

---

## 10 · Follow-ups flagged

- **`@media print`** composition for `/reference` (all routes share this gap — track as its own item, not part of §14.18).
- **TOKENS bucket population** — v0.2 decision. AUX panel placeholder ships now; when TOKEN entries are added, AUX panel may split into two panels (strict-category rule would then demand it).
- **Hero `totalAll` count display** — currently shows `163` via `Object.keys(API_DOCS).length`. Spec keeps this; confirms the display and LOCKDOWN's "158" refer to different scopes (all surfaces vs COMPONENTS bucket). If product prefers a single number, pick one and document.
- **Palette API-search scope UX** — exact label text and ranking are a palette-layer concern, not a pagination concern. Defer to palette owner during implementation.
