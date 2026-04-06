# Architecture Research — v1.4 Feature Complete

**Domain:** Design system showcase site — remaining SF components + interactive component detail views + token finalization
**Researched:** 2026-04-06
**Confidence:** HIGH — all findings verified against direct codebase audit

---

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     ROUTE LAYER (app/)                           │
│                                                                   │
│  /              /components       /reference      /tokens        │
│  page.tsx       page.tsx          page.tsx        page.tsx       │
│  (Server)       (Server)          (Server)        (Server)       │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                   BLOCK LAYER (components/blocks/)               │
│                                                                   │
│  ComponentsExplorer       APIExplorer      ComponentDetail       │
│  (Client — grid +         (Client —        (Client — NEW         │
│   filter + GSAP Flip)      sidebar+tabs)    expandable panel)    │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    SF LAYER (components/sf/)                      │
│                                                                   │
│  Layout Primitives    Interactive        Animated (SIGNAL)       │
│  SFContainer          SFButton           SFAccordion             │
│  SFSection            SFDialog           SFProgress              │
│  SFGrid               SFSheet            SFToast/SFToaster       │
│  SFStack              SFSelect           SFStepper               │
│  SFText               SFNavigationMenu   (+ all others)          │
│                       SFInputGroup  ←── NEW                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│              DATA LAYER (lib/ + public/r/ + globals.css)         │
│                                                                   │
│  api-docs.ts           component-registry.ts  (NEW)             │
│  ComponentDoc type     ComponentRegistryEntry type               │
│  (~15 entries)         (one per grid cell — bridges to doc)      │
│                                                                   │
│  public/r/registry.json   globals.css @theme                    │
│  49 registry items        Token source of truth                  │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | State |
|-----------|----------------|-------|
| `app/components/page.tsx` | Route shell, Server Component, metadata | Exists |
| `ComponentsExplorer` | Grid browse, filter/search, GSAP Flip, detail trigger | Exists — needs click handler + activeDetail state |
| `APIExplorer` | Sidebar nav + tabbed doc viewer at /reference | Exists — needs doc entries for v1.3 components |
| `ComponentDetail` | Expandable panel: props, variants, code, a11y | **NEW** |
| `lib/api-docs.ts` | `ComponentDoc` type + prop/usage/a11y data | Exists — needs entries for all 31 grid items |
| `lib/component-registry.ts` | Bridge: grid cell index → ComponentDoc id + variants + code snippet | **NEW** |
| `public/r/*.json` | Registry items with meta.layer, meta.pattern | Exists (49 items) |
| `components/sf/sf-input-group.tsx` | SF wrapper for `ui/input-group.tsx` | **NEW — only remaining gap** |

---

## Recommended Project Structure

No new top-level directories. All v1.4 work fits the existing structure:

```
components/
├── blocks/
│   ├── components-explorer.tsx   # MODIFY: add onClick, activeDetail state
│   └── component-detail.tsx      # NEW: expandable detail panel
├── sf/
│   └── sf-input-group.tsx        # NEW: only remaining unwrapped ui/ component
lib/
│   ├── api-docs.ts               # MODIFY: add entries for all 31 grid components
│   └── component-registry.ts     # NEW: static map of grid index → detail data
hooks/
│   └── use-session-state.ts      # MODIFY: add SESSION_KEYS.DETAIL_OPEN
app/
│   └── globals.css               # MODIFY: move --color-success/warning into @theme
public/r/
│   ├── sf-input-group.json       # NEW: registry entry
│   └── registry.json             # MODIFY: append sf-input-group
```

### Structure Rationale

- **No new routes for component detail:** The detail view is an in-page expansion below the grid, not a separate URL. This preserves browse UX (filter/scroll state intact), avoids full-page navigation cost, and matches the DU/TDR aesthetic of revealing structure rather than overlaying it.
- **`lib/component-registry.ts` as new data file:** The `COMPONENTS[]` array in `components-explorer.tsx` stores only thumbnail previews. Richer detail data (variants, live preview, code snippet, pointer to `ComponentDoc`) lives in a separate `lib/` file. This keeps the explorer file lean and makes the detail panel's data access synchronous and tree-shakeable.
- **`api-docs.ts` stays the props/usage source of truth:** `ComponentDoc` already has the correct shape. The detail panel reads from this — no duplication of prop tables.
- **`sf-input-group.tsx` is the only missing wrapper:** Direct diff of `components/ui/` vs `components/sf/` confirms `input-group.tsx` has no SF counterpart. Every other `ui/` component is wrapped. All other "new" SF items (`SFContainer`, `SFEmptyState`, etc.) were v1.3 pure-SF constructions that already exist.

---

## Architectural Patterns

### Pattern 1: In-Page Detail Expansion (Not Modal, Not Route)

**What:** Clicking a component card expands a full-width detail panel rendered as a sibling to the flip grid div, after it in the DOM. The panel height animates from 0 to auto using GSAP. A close button (or Escape key) collapses it.

**When to use:** When the content is contextually related to the item clicked, the user should maintain browse context, and there is no need for a shareable URL per item.

**Trade-offs:**
- Pros: No focus trap needed, no overlay layer, grid remains visible above the panel, no route change.
- Cons: In-page layout shift on expand — mitigated by GSAP `--ease-spring` and keeping the grid container height stable (the grid div does not resize; the panel appears below it as a new full-width block).

**Critical constraint:** `ComponentDetail` must render OUTSIDE the GSAP Flip container. The flip grid div is `gridRef`. If the detail panel is inside `gridRef`, `Flip.getState()` captures its geometry and produces wrong animation origins when the filter changes.

**Example structure in ComponentsExplorer:**
```typescript
// Outside the flip grid:
<div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4">
  {filtered.map(comp => (
    <div
      key={comp.index}
      className="flip-card ..."
      onClick={() => setActiveDetail(comp.index)}
    >
      ...
    </div>
  ))}
</div>

{/* Sibling — NOT inside gridRef */}
<ComponentDetail
  componentId={activeDetail}
  onClose={() => setActiveDetail(null)}
/>
```

### Pattern 2: Static Detail Data in `lib/component-registry.ts`

**What:** A static TypeScript map keyed by `ComponentEntry.index` (the three-digit string like `"001"`) that stores: variant list with preview JSX, the copy-ready primary code snippet, and a `docId` pointer to the `ComponentDoc` in `api-docs.ts`.

**When to use:** The detail panel needs richer data than the thumbnail previews in `COMPONENTS[]`, but all of this data is static and bounded. No runtime fetching needed.

**Trade-offs:** Static TypeScript means zero loading states, zero CLS, tree-shakeable. The file grows as components are added — acceptable given the system has a bounded component set.

**Type contract:**
```typescript
// lib/component-registry.ts
export interface ComponentRegistryEntry {
  id: string;               // matches ComponentEntry.index ("001", "002" ...)
  docId: string;            // matches ComponentDoc.id in api-docs.ts
  name: string;             // human label ("BUTTON")
  variants: {
    label: string;          // "PRIMARY", "GHOST", "SIGNAL"
    preview: React.ReactNode;
  }[];
  codeSnippet: string;      // primary usage — raw string for SharedCodeBlock
  registryFile?: string;    // "sf-button.json" — for registry link display
}

export const COMPONENT_REGISTRY: Record<string, ComponentRegistryEntry> = {
  "001": { id: "001", docId: "button", name: "BUTTON", ... },
  // one entry per item in COMPONENTS[]
};
```

### Pattern 3: Token Finalization as CSS-Only Work

**What:** All structural tokens are already defined in `globals.css`. "Finalization" means:
1. Moving `--color-success` and `--color-warning` from `:root` into the `@theme` block so Tailwind v4 generates `bg-success` / `text-warning` utilities.
2. Auditing all components for arbitrary spacing values that should use blessed stops.
3. No net-new tokens — the token freeze holds.

**Why `--color-success` / `--color-warning` are not yet in `@theme`:** These were added to `:root` in v1.2 as extension variables. Tailwind v4 only generates utilities for values declared inside `@theme {}`. Moving them there is a one-line change per token — zero visual change, zero risk, unlocks `bg-success` and `text-warning` as proper utilities.

**Z-index tokens:** The `--z-*` scale exists in `:root` and is correctly NOT in `@theme`. CSS custom properties are the right mechanism for z-index — Tailwind utilities for z-index would conflict with Tailwind's own `z-*` scale. No change needed here.

---

## Data Flow

### Component Detail Request Flow

```
User clicks grid cell
    ↓
ComponentsExplorer.onClick fires → setActiveDetail(comp.index)
    ↓
activeDetail stored to sessionStorage via useSessionState(SESSION_KEYS.DETAIL_OPEN)
    ↓
ComponentDetail renders with componentId = activeDetail
    ↓
ComponentDetail reads COMPONENT_REGISTRY[componentId]   (synchronous, static import)
    ↓
ComponentDetail reads API_DOCS[entry.docId]             (synchronous, static import)
    ↓
Renders:  SFTabs (Props | Variants | Code | A11y)
          SFScrollArea for overflow
          SharedCodeBlock for code panel
          Variant switcher for live previews
    ↓
GSAP: gsap.fromTo(panelRef, { height: 0 }, { height: "auto", duration: 0.4, ease: "sf-snap" })
    ↓
User clicks close or presses Escape
    ↓
GSAP: gsap.to(panelRef, { height: 0, duration: 0.3 }) → then setActiveDetail(null)
```

### State Management

```
sessionStorage (useSessionState)
    ↓ (SSR-safe: defaultValue on server, reads from storage after mount)
ComponentsExplorer state:
  - activeFilter: Category              (SESSION_KEYS.COMPONENTS_FILTER)
  - searchQuery: string
  - activeDetail: string | null         (SESSION_KEYS.DETAIL_OPEN — NEW)
    ↓
GSAP Flip: captures grid state before filter change, animates card reposition
ComponentDetail: mounts when activeDetail !== null, unmounts on close
```

### Key Data Flows

1. **Grid → Detail:** `ComponentEntry.index` (e.g. `"001"`) is the primary key. It maps to `ComponentRegistryEntry` in `component-registry.ts`, which contains `docId` for looking up the `ComponentDoc` in `api-docs.ts`.
2. **Filter → GSAP Flip:** Existing behavior. `captureFlipState()` before filter update, `Flip.from()` after. The detail panel must be outside `gridRef` — its height changes must not be captured in Flip state.
3. **Token → Component:** All tokens flow `globals.css @theme` → Tailwind v4 utility classes → component `className`. The one exception is `color-resolve.ts` (WebGL uniform bridge), which reads CSS custom properties via a probe element.
4. **Registry → Consumer:** `public/r/registry.json` and individual `public/r/sf-*.json` files are served statically. External consumers use `pnpm dlx shadcn@latest add [url]`. No v1.4 changes needed to this pipeline beyond adding the `sf-input-group.json` entry.

---

## Integration Points

### New vs Modified Files

| File | Change Type | What Changes | Integrates With |
|------|------------|--------------|-----------------|
| `components/blocks/component-detail.tsx` | NEW | Full new file | `api-docs.ts`, `component-registry.ts`, `SharedCodeBlock`, `SFTabs`, `SFScrollArea` |
| `lib/component-registry.ts` | NEW | Full new file | `component-detail.tsx`, `api-docs.ts` |
| `components/sf/sf-input-group.tsx` | NEW | Single SF wrapper | `ui/input-group.tsx`, `sf/index.ts` |
| `public/r/sf-input-group.json` | NEW | Registry entry | `public/r/registry.json` |
| `components/blocks/components-explorer.tsx` | MODIFY | Add `activeDetail` state + cell onClick handler | `component-registry.ts`, `use-session-state.ts` |
| `lib/api-docs.ts` | MODIFY | Add `ComponentDoc` entries for all 31 grid items | `component-detail.tsx` |
| `hooks/use-session-state.ts` | MODIFY | Add `SESSION_KEYS.DETAIL_OPEN` constant | `components-explorer.tsx` |
| `app/globals.css` | MODIFY | Move `--color-success` / `--color-warning` into `@theme` | Tailwind v4 utility generation |
| `components/sf/index.ts` | MODIFY | Append `SFInputGroup` export | All consumers |
| `public/r/registry.json` | MODIFY | Append `sf-input-group` entry | shadcn CLI consumers |

### Internal Boundaries

| Boundary | Communication | Constraint |
|----------|---------------|------------|
| `ComponentsExplorer` ↔ `ComponentDetail` | `activeDetail: string \| null` prop/state | Detail is a sibling of the flip grid div, not a child |
| `ComponentDetail` ↔ `api-docs.ts` | Direct static import | `ComponentDoc` type is the stable contract |
| `ComponentDetail` ↔ `component-registry.ts` | Direct static import | `ComponentRegistryEntry` is the stable contract |
| `ComponentsExplorer` ↔ `sessionStorage` | `useSessionState` hook | Add `DETAIL_OPEN` key (null = no active detail) |
| `sf/` ↔ `ui/` | SF wrapper imports from `ui/` base | One-way: `sf/` → `ui/`. `ui/` never imports `sf/` |
| `sf/` ↔ consumer pages/blocks | Barrel import from `sf/index.ts` | P3 lazy components (Calendar, Menubar) NOT in barrel — import from their `-lazy.tsx` file directly |

---

## Build Order

Dependencies determine sequencing. Each phase has a hard prerequisite.

### Phase 1: Token Finalization (no prerequisites — pure CSS)

Move `--color-success` and `--color-warning` into the `@theme {}` block in `globals.css`. This is a two-line change. Verify with `bg-success` on SFStatusDot after the change.

**Output:** Updated `globals.css`.
**Risk:** Zero — CSS custom property values are unchanged, only the declaration context moves.

### Phase 2: Remaining SF Component — SFInputGroup (depends on: Phase 1 tokens)

Create `components/sf/sf-input-group.tsx`. The base `ui/input-group.tsx` already uses `var(--radius)` which resolves to `0px` — the SF wrapper's main job is stripping the generic border radius and adding SF border conventions (`border-2 border-foreground`). Add to `sf/index.ts` barrel. Create `public/r/sf-input-group.json` and append to `registry.json`.

**Output:** `sf-input-group.tsx`, `sf/index.ts` (modified), `public/r/sf-input-group.json`, `registry.json` (modified).
**Note:** `ui/input-group.tsx` has `"use client"` — the SF wrapper needs it too.

### Phase 3: Detail Data Authoring (depends on: Phases 1-2 so component list is final)

Two parallel tasks:

**3a.** Create `lib/component-registry.ts` with `ComponentRegistryEntry` for all 31+ items in `COMPONENTS[]`. Each entry needs: `docId` pointing to `api-docs.ts`, `variants[]` with preview JSX, `codeSnippet` string.

**3b.** Extend `lib/api-docs.ts` with `ComponentDoc` entries for all components that are in the grid but lack a doc entry. The v1.3 additions (Avatar, Breadcrumb, Alert, AlertDialog, Collapsible, EmptyState, StatusDot, Accordion, Toast, Progress, ToggleGroup, Stepper, NavMenu, Calendar, Menubar, Pagination) likely need entries; the existing entries cover Core/Button/Input/Card/Modal/Table/Tabs/Dropdown/Badge/Drawer plus SIGNAL layer.

**Output:** `lib/component-registry.ts` (new), extended `lib/api-docs.ts`.

### Phase 4: ComponentDetail Panel (depends on: Phase 3 data exists)

Build `components/blocks/component-detail.tsx` as a Client Component (`'use client'`). Accepts `componentId: string | null` and `onClose: () => void`.

Internal structure:
- Top bar: component name (SF display type), layer badge (SFBadge), close button (SFButton ghost)
- Tab bar: `SFTabs` with triggers: PROPS / VARIANTS / CODE / A11Y
- PROPS tab: `SFTable` rendering `doc.props[]` — name, type, default, description
- VARIANTS tab: variant switcher buttons + live preview area
- CODE tab: `SharedCodeBlock` with `entry.codeSnippet`
- A11Y tab: `SFScrollArea` with `doc.a11y[]` list

GSAP integration:
```typescript
// Open: animate height from 0 to auto
gsap.fromTo(panelRef.current,
  { height: 0, opacity: 0 },
  { height: "auto", opacity: 1, duration: 0.4, ease: "sf-snap" }
);

// Close: animate height to 0 before calling onClose
gsap.to(panelRef.current,
  { height: 0, opacity: 0, duration: 0.3, ease: "power2.in",
    onComplete: onClose }
);
```

**Output:** `components/blocks/component-detail.tsx`.

### Phase 5: Explorer Integration (depends on: Phase 4 component exists)

Modify `ComponentsExplorer`:
1. Add `SESSION_KEYS.DETAIL_OPEN` to `hooks/use-session-state.ts`.
2. Add `activeDetail` / `setActiveDetail` via `useSessionState(SESSION_KEYS.DETAIL_OPEN, null)`.
3. Add `onClick={() => setActiveDetail(comp.index)}` to each grid cell div.
4. Add `onKeyDown` handler: Enter/Space opens detail, Escape closes. Extend existing `handleGridKeyDown`.
5. Render `<ComponentDetail componentId={activeDetail} onClose={() => setActiveDetail(null)} />` as a sibling after the `gridRef` div, inside the same parent.

**Output:** Modified `components-explorer.tsx`, modified `hooks/use-session-state.ts`.

### Phase 6: Audit and Tech Debt (depends on: all above)

- Verify duplicate TOAST entry (indices 010 and 022) — resolve to single correct entry
- Confirm Lighthouse 100/100 not regressed by new client components
- Close v1.3 deferred human validation (NavigationMenu flyout, keyboard nav, Stepper connectors)
- Update SCAFFOLDING.md with SFInputGroup API contract

---

## Anti-Patterns

### Anti-Pattern 1: ComponentDetail Inside the GSAP Flip Container

**What people do:** Render the detail panel inside the `gridRef` div so it flows naturally below the grid cards.

**Why it's wrong:** `Flip.getState()` captures the geometry of everything inside `gridRef`, including the variable-height detail panel. When a filter change triggers `Flip.from()`, the panel's old geometry is baked into the Flip snapshot — producing wrong animation origins and jumpy card positions.

**Do this instead:** Render `ComponentDetail` as a sibling after `gridRef` in the DOM, inside the same containing section. The grid Flip animation is unaffected; the panel appears/disappears below without being captured.

### Anti-Pattern 2: Fetching Component Data at Runtime

**What people do:** Store component metadata in a JSON file and `fetch()` it when a card is clicked.

**Why it's wrong:** Adds loading state, waterfall delay on interaction, and breaks the performance budget. All component data is static and known at build time.

**Do this instead:** Static imports from `lib/component-registry.ts` and `lib/api-docs.ts`. Synchronous, zero loading states, tree-shakeable, no API.

### Anti-Pattern 3: New Route per Component (`/components/[slug]`)

**What people do:** Create `app/components/[slug]/page.tsx` so each component has a dedicated URL.

**Why it's wrong:** Full-page navigation destroys the browse UX. The user is exploring a filterable grid — a route change loses filter/scroll context even with session restoration. The showcase intent does not require per-component URLs.

**Do this instead:** In-page expansion. If shareable component URLs become needed later, they can be added as `?component=button` query params (read on mount via `useSearchParams`) without route changes.

### Anti-Pattern 4: Duplicating ComponentDoc Data in ComponentEntry

**What people do:** Add `props`, `description`, and usage examples directly to the `ComponentEntry` type in `components-explorer.tsx`.

**Why it's wrong:** `api-docs.ts` already owns this data with a well-defined, documented type. Duplication creates drift between the grid view and the reference page.

**Do this instead:** `ComponentEntry` stays minimal (index, name, category, variant, thumbnail preview). `ComponentRegistryEntry` in `lib/component-registry.ts` bridges to `ComponentDoc` via `docId`. Single source of truth.

### Anti-Pattern 5: Adding New Tokens for the Detail Panel

**What people do:** Add `--sf-panel-bg`, `--sf-panel-border`, `--sf-panel-header-height` tokens for the new detail component.

**Why it's wrong:** The token expansion policy is explicit: new tokens require architectural review and must be needed by three or more components. The detail panel is a single component — use existing tokens (`background`, `foreground`, `border`, `--border-section`, `--space-*`).

**Do this instead:** Build `ComponentDetail` entirely from the existing token vocabulary. If a value is truly unique to this one component, use an inline Tailwind class — not a new token.

---

## Scaling Considerations

| Scale | Architecture Note |
|-------|-------------------|
| Current (31 grid items) | Static data in `lib/` — no changes needed |
| 60+ components | Split `component-registry.ts` by category; lazy-import the active category's data in the detail panel |
| External consumers (portfolio, cdOS) | `ComponentDoc` type and registry JSON are already the public contract — no structural changes needed |

---

## Sources

- Direct codebase audit (all findings verified):
  - `components/blocks/components-explorer.tsx` — COMPONENTS array (31 entries), flip grid, session state
  - `components/sf/index.ts` — barrel (46 exports confirmed)
  - `components/ui/` vs `components/sf/` diff — `input-group.tsx` is the only unwrapped base component
  - `lib/api-docs.ts` — `ComponentDoc` type, existing entries (~15 covering CORE + legacy COMPONENTS section)
  - `lib/signalframe-provider.tsx` — SSR-safe provider pattern
  - `hooks/use-session-state.ts` — `SESSION_KEYS` (2 keys currently)
  - `public/r/registry.json` — 49 items confirmed
  - `app/globals.css` — `--color-success` / `--color-warning` in `:root`, NOT in `@theme` (confirmed gap)
  - `components/blocks/shared-code-block.tsx` — reusable code display component (usable in detail panel)
- Project context: `.planning/PROJECT.md` — v1.4 goal definition confirmed
- System rules: `CLAUDE.md` — token policy, dual-layer model, component conventions

---

*Architecture research for: SignalframeUX v1.4 Feature Complete*
*Researched: 2026-04-06*
