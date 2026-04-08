# Phase 33: INVENTORY + ACQUISITION Sections — Research

**Researched:** 2026-04-08
**Domain:** Component catalog table UI, coded nomenclature, fixed overlay portal, filter extension, CLI acquisition panel
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **INVENTORY layout:** Monospaced row table — 5 fixed-width columns per row. No cards, no flip animation, no hover-card previews. Column 1: `SF//[CAT]-NNN` (font-mono, primary accent), Column 2: component name (font-mono, foreground), Column 3: layer tag (SIGNAL in magenta, FRAME neutral gray), Column 4: pattern tier (neutral), Column 5: expand trigger (minimal char, not a button).
- **INVENTORY 12-item subset:** Exactly 2 per category, 6 categories = 12 items. Fixed selection per CONTEXT.md table. GEN items last.
- **ComponentDetail on homepage:** Fixed/overlay panel via `createPortal(detail, document.body)`, position fixed, `--z-overlay` token. On `/inventory` page: expand-in-place PRESERVED.
- **Coded nomenclature:** `SF//[CAT]-NNN` — 6 category codes: FRM, LAY, NAV, FBK, DAT, GEN. Derived programmatically at runtime (not hardcoded). Sort by category before assigning.
- **ACQUISITION:** Terminal instrument panel, ≤50vh. CLI hero: `npx signalframeux init`. Stats: COMPONENTS // [count], BUNDLE // [measured gzip], LIGHTHOUSE // 100. Two text links: `→ /init` and `→ /inventory`. No CTA energy, no rounded elements.
- **`/inventory` page:** Replace 30-item hardcoded `COMPONENTS` array with live `COMPONENT_REGISTRY`. Add layer filter (FRAME/SIGNAL/ALL) and pattern filter (A/B/C/ALL). Preserve existing category filter, search, grid layout, and expand-in-place ComponentDetail behavior.
- **No new npm packages.** All animation via GSAP + Lenis. No staggered row animations in Phase 33 (deferred to Phase 34).
- **No search input on homepage INVENTORY** (12 items, no need).

### Claude's Discretion

Not explicitly listed — all key decisions are locked.

### Deferred Items (OUT OF SCOPE)

- Pattern B lazy components' ComponentDetail preview may render a stub — acceptable for Phase 33
- Staggered row reveals on scroll-enter — Phase 34
- Full lazy preview for Calendar, Menubar, Drawer — Phase 34+
- D-34 Physical iPhone Safari verification — carry as first human verification task in Phase 33
- Search on homepage INVENTORY subset
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| IV-01 | Component catalog uses coded nomenclature: `SF//[CAT]-NNN` | Programmatic `assignCodes()` utility on COMPONENT_REGISTRY; CONTEXT.md specifies exact 6 category codes |
| IV-02 | Each entry shows layer tag, pattern tier, and component name — all three visible without expanding | 5-column table row layout; layer + pattern already in ComponentRegistryEntry interface |
| IV-03 | Monospaced type for catalog entries — dense, systematic, not card-based | JetBrains Mono via `font-mono` class; table layout with fixed column structure |
| IV-04 | Click/tap expands existing ComponentDetail panel | Homepage: `createPortal` fixed overlay. `/inventory`: expand-in-place (existing behavior). ComponentDetail component unchanged. |
| IV-05 | Homepage shows 12-item subset; `/inventory` shows full catalog | Homepage: hardcoded 12-item HOMEPAGE_INVENTORY array. `/inventory`: live COMPONENT_REGISTRY (34 real entries) |
| IV-06 | Filter by layer, pattern, and category functional on `/inventory` | Extend ComponentsExplorer `useMemo` filter + add layer/pattern state + filter bar buttons |
| AQ-01 | `npx signalframeux init` displayed prominently with copy-to-clipboard | CLI hero in monospace, CopyButton pattern already exists in `component-detail.tsx` |
| AQ-02 | Key system stats as monospaced data points | Stats validated: 34 current registry entries (not 54). PROOF section hardcodes "51". Requires alignment before locking. |
| AQ-03 | Links to `/init` and `/inventory` | Standard Next.js Link tags styled as monospaced text anchors |
| AQ-04 | Section height ≤ 50vh | CSS `max-height: 50vh` with padding reduction if overflow |
| AQ-05 | No "Get Started" button energy — technical instrument presentation | DU/tDR terminal register: no CTAs, no rounded elements, hard cut |
</phase_requirements>

---

## Summary

Phase 33 delivers two homepage sections (INVENTORY and ACQUISITION) plus an upgrade to the `/inventory` page. The infrastructure is largely in place: ComponentDetail exists and has the `data-modal-open` contract, ComponentsExplorer exists with `useMemo` filter logic, and the homepage has stub slots for both sections.

The most complex work is (1) the `InventoryTable` component — a new, purpose-built table block that does not share code with ComponentsExplorer, (2) the fixed portal for ComponentDetail on the homepage, and (3) extending ComponentsExplorer with two additional filter axes.

**Critical finding:** The live `COMPONENT_REGISTRY` has **34 entries** (not 54 as stated in CONTEXT.md and REQUIREMENTS.md). The PROOF section currently hardcodes "51". The ACQUISITION stats must be validated against the real count before the section is built. The "54" figure in CONTEXT.md appears to be a planning-time projection. The ComponentsExplorer `COMPONENTS` array has 30 entries; the registry has 34.

**Primary recommendation:** Build the `assignCodes()` utility first (Wave 0), validate the actual registry count, lock the stat constants, then build the table and ACQUISITION in that order.

---

## Standard Stack

### Core (already in project — no new installs)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React `createPortal` | React 18 (in stack) | Render ComponentDetail into `document.body` for fixed overlay | Avoids z-index stacking context issues with homepage scroll sections |
| GSAP | 3.12 (in stack) | Panel open/close animation | Already used by ComponentDetail — same animation pattern |
| `useMemo` | React 18 | Filtered catalog derived state | Already used in ComponentsExplorer |
| `useSessionState` | `hooks/use-session-state.ts` | Persist filter state across navigation | Same pattern as ComponentsExplorer |
| `dynamic` from `next/dynamic` | Next.js 15.3 | Lazy-load ComponentDetail on homepage | Bundle gate compliance — DV-12 pattern already established |
| `cn()` from `lib/utils.ts` | in stack | Class merging | Project standard |
| `navigator.clipboard.writeText` | Browser API | Copy CLI command | Same CopyButton pattern in ComponentDetail |

**Installation:** No new packages required.

---

## Architecture Patterns

### Recommended New File Structure

```
components/blocks/
├── inventory-section.tsx        # Homepage INVENTORY: 12-row table + portal ComponentDetail
├── acquisition-section.tsx      # Homepage ACQUISITION: terminal stats panel
└── components-explorer.tsx      # MODIFIED: add layer + pattern filter axes

lib/
├── nomenclature.ts              # NEW: assignCodes() utility + CATEGORY_CODE map
└── system-stats.ts              # NEW: SYSTEM_STATS constants (single source of truth)
```

### Pattern 1: Programmatic Code Assignment

Sort registry entries by category, then assign sequential codes within each category. Must produce stable output across builds (same input order = same codes).

```typescript
// lib/nomenclature.ts
const CATEGORY_CODE: Record<string, string> = {
  FORMS: 'FRM',
  LAYOUT: 'LAY',
  NAVIGATION: 'NAV',
  FEEDBACK: 'FBK',
  DATA_DISPLAY: 'DAT',
  GENERATIVE: 'GEN',
}

const CATEGORY_ORDER = ['FORMS', 'LAYOUT', 'NAVIGATION', 'FEEDBACK', 'DATA_DISPLAY', 'GENERATIVE']

export function assignCodes<T extends { category: string }>(
  entries: T[]
): (T & { sfCode: string })[] {
  const sorted = [...entries].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
  )
  const counters: Record<string, number> = {}
  return sorted.map(entry => {
    const cat = CATEGORY_CODE[entry.category] ?? 'UNK'
    counters[cat] = (counters[cat] ?? 0) + 1
    return { ...entry, sfCode: `SF//${cat}-${String(counters[cat]).padStart(3, '0')}` }
  })
}
```

**Key note:** Add `sfCode` as a computed field (separate from the existing `code` field which is the usage snippet). Do NOT reuse the `code` property — it already means "canonical usage snippet" in ComponentRegistryEntry. Use `sfCode` or a distinct name to avoid collision.

### Pattern 2: Homepage Inventory Table Row

```tsx
// Each row in InventorySection — pure presentation, no state
interface InventoryRow {
  sfCode: string        // SF//FRM-001
  name: string          // BUTTON
  layer: 'frame' | 'signal'
  pattern: 'A' | 'B' | 'C'
  registryIndex: string // "001" — key into COMPONENT_REGISTRY
}

// Row JSX sketch:
<div
  role="row"
  onClick={() => setOpenIndex(row.registryIndex)}
  className="grid grid-cols-[14ch_20ch_12ch_4ch_2ch] font-mono text-sm cursor-pointer hover:bg-foreground hover:text-background border-b border-foreground/20 px-0 py-1.5"
>
  <span className="text-primary">{row.sfCode}</span>
  <span>{row.name}</span>
  <span className={row.layer === 'signal' ? 'text-primary' : 'text-muted-foreground'}>
    {row.layer === 'signal' ? '[//SIGNAL]' : '[FRAME]'}
  </span>
  <span className="text-muted-foreground">{row.pattern}</span>
  <span>→</span>
</div>
```

### Pattern 3: Fixed Portal for ComponentDetail (Homepage)

```tsx
// inventory-section.tsx
import { createPortal } from 'react-dom'
import dynamic from 'next/dynamic'

const ComponentDetailLazy = dynamic(
  () => import('@/components/blocks/component-detail').then(m => ({ default: m.ComponentDetail })),
  { ssr: false, loading: () => null }
)

// In render — portal to body:
{openIndex && mounted && createPortal(
  <>
    {/* Backdrop — semi-transparent, catalog rows stay visible */}
    <div
      className="fixed inset-0 bg-background/60 backdrop-blur-none"
      style={{ zIndex: 'calc(var(--z-overlay) - 1)' }}
      onClick={() => setOpenIndex(null)}
    />
    {/* Panel */}
    <div
      className="fixed right-0 top-0 bottom-0 overflow-y-auto bg-background border-l-4 border-foreground"
      style={{ zIndex: 'var(--z-overlay)', width: 'clamp(320px, 40vw, 600px)' }}
    >
      <ComponentDetailLazy
        entry={COMPONENT_REGISTRY[openIndex]}
        doc={API_DOCS[COMPONENT_REGISTRY[openIndex].docId]}
        highlightedCode={highlightedCodeMap[openIndex] ?? ''}
        onClose={() => setOpenIndex(null)}
        triggerRef={triggerRef}
      />
    </div>
  </>,
  document.body
)}
```

**Note on `triggerRef`:** The existing ComponentDetail accepts a `triggerRef` for focus-return after close. On homepage, create a `useRef<HTMLElement | null>` and pass it; set `triggerRef.current` to the row element on click.

**Note on SSR safety:** `createPortal` requires `document.body` — must be guarded by `mounted` state (set in useEffect). Pattern: `const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true), [])`.

**Note on `data-modal-open`:** ComponentDetail already sets `document.body.setAttribute('data-modal-open', 'true')` in its own useEffect and removes it on unmount. No additional wiring needed.

### Pattern 4: Extending ComponentsExplorer Filter

The existing filter is a `useMemo` with two conditions (category + search). Add layer and pattern as additional filter axes:

```typescript
// Add to ComponentsExplorer state:
const [activeLayer, setActiveLayer] = useSessionState<LayerFilter>(SESSION_KEYS.COMPONENTS_LAYER, 'ALL')
const [activePattern, setActivePattern] = useSessionState<PatternFilter>(SESSION_KEYS.COMPONENTS_PATTERN, 'ALL')

// Extend useMemo:
const filtered = useMemo(() => COMPONENTS.filter((comp) => {
  const matchesCategory = activeFilter === 'ALL' || comp.filterTag === activeFilter
  const matchesSearch = searchQuery === '' || comp.name.toLowerCase().includes(searchQuery.toLowerCase())
  const matchesLayer = activeLayer === 'ALL' || comp.subcategory.toLowerCase() === activeLayer.toLowerCase()
  const matchesPattern = activePattern === 'ALL' || registryEntry?.pattern === activePattern
  return matchesCategory && matchesSearch && matchesLayer && matchesPattern
}), [activeFilter, searchQuery, activeLayer, activePattern])
```

**Field alignment issue:** The `COMPONENTS` array in ComponentsExplorer uses `subcategory: "FRAME" | "SIGNAL"` for the layer — NOT `layer: "frame" | "signal"` from the registry. When adding layer filter, match against `comp.subcategory` (which is already "FRAME" or "SIGNAL" as uppercase strings).

For pattern, `COMPONENTS` entries do NOT have a `pattern` field — it lives only in `COMPONENT_REGISTRY`. Either: (a) add `pattern: 'A' | 'B' | 'C'` to the `ComponentEntry` interface and populate the `COMPONENTS` array, or (b) do a registry lookup per item in the filter. Option (a) is cleaner; the `COMPONENTS` array already has all fields that map to registry fields.

### Pattern 5: ACQUISITION Section Structure

```tsx
// acquisition-section.tsx — Server Component (no 'use client' needed)
// The copy button is the only interactive element — use a separate 'use client' child

export function AcquisitionSection() {
  return (
    <section
      data-section="acquisition"
      data-acquisition-root
      className="font-mono border-t-4 border-foreground"
      style={{ maxHeight: '50vh', overflowY: 'hidden' }}
    >
      <div className="px-8 md:px-12 py-8 md:py-10 flex flex-col gap-6">
        {/* Header */}
        <span className="text-muted-foreground text-xs tracking-widest">— ACQUIRE</span>

        {/* CLI Hero */}
        <div className="flex items-baseline gap-6">
          <span className="text-2xl md:text-3xl tracking-tight">npx signalframeux init</span>
          <AcquisitionCopyButton command="npx signalframeux init" />
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-1 text-sm">
          <span>COMPONENTS     // {SYSTEM_STATS.components}</span>
          <span>BUNDLE         // {SYSTEM_STATS.bundle}</span>
          <span>LIGHTHOUSE     // {SYSTEM_STATS.lighthouse}</span>
        </div>

        {/* Links */}
        <div className="flex gap-8 text-sm">
          <a href="/init" className="hover:text-primary transition-colors">→ /init</a>
          <a href="/inventory" className="hover:text-primary transition-colors">→ /inventory</a>
        </div>
      </div>
    </section>
  )
}
```

### Anti-Patterns to Avoid

- **Using `variant:` instead of `intent:` in any CVA component** — all SF wrappers use `intent`. Per v1.3 constraint.
- **Card grid for INVENTORY rows** — the existing ComponentsExplorer card grid must not be reused or imported into the homepage table. The table is architecturally separate.
- **Re-exporting InventorySection from `sf/index.ts` barrel** — blocks are not SF-wrapped primitives.
- **Hardcoding `sfCode` strings instead of deriving them** — CONTEXT.md is explicit: derive programmatically.
- **Adding `border-radius` anywhere** — zero border-radius everywhere, per hard constraint.
- **Using `code` field name for nomenclature** — `code` already means usage snippet in ComponentRegistryEntry. Use `sfCode` or similar.
- **ComponentsExplorer Flip state during filter change** — the GSAP Flip animation captures `.flip-card` elements. Phase 33 layer/pattern filters must also call `captureFlipState()` before updating filter state, same as existing category filter. Missing this causes jumpless Flip.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Copy to clipboard | Custom clipboard impl | Pattern from `component-detail.tsx` `CopyButton` component | Already handles async clipboard, error silent-fail, copied state feedback |
| Fixed overlay z-index | Custom z-index values | `--z-overlay` token (100) from `globals.css` | Already wired with `[data-modal-open]` contract |
| Session-persisted filter state | `useState` + `localStorage` | `useSessionState` hook from `hooks/use-session-state.ts` | Already used by ComponentsExplorer; maintains scroll restoration compat |
| Code highlighting in inventory page | Client-side shiki | Server `highlight()` from `lib/code-highlight.ts` | Already used by `/inventory` page; zero client JS cost |
| Lazy ComponentDetail import | Inline dynamic import | Pattern from ComponentsExplorer (lines 13-16) | Established bundle gate pattern (DV-12) |

---

## Common Pitfalls

### Pitfall 1: Registry Entry Count Mismatch

**What goes wrong:** CONTEXT.md and REQUIREMENTS.md state 54 components. The live `COMPONENT_REGISTRY` has **34 entries**. The PROOF section displays "51". The ComponentsExplorer `COMPONENTS` array has 30 items. These four numbers are all different.

**Why it happens:** Registry grew from 30 → 34 across phases. v1.3 note says "49-item registry, 45 SF components" but the file only has 34 keyed entries now. The 54 figure in CONTEXT.md was a planning projection.

**How to avoid:** Before locking any stats, run `Object.keys(COMPONENT_REGISTRY).length` at build time. The authoritative count for AQ-02 and IV-05 is the live registry, not any hardcoded projection. The "12-item homepage subset" table in CONTEXT.md names specific registry indices — verify each index exists in the registry before Wave 1.

**Warning signs:** TypeScript error when looking up `COMPONENT_REGISTRY["031"]` — that key does not exist.

### Pitfall 2: `code` Field Name Collision

**What goes wrong:** Adding `code: string` to ComponentRegistryEntry would overwrite the existing `code` field, which already holds the canonical usage snippet (template literal).

**Why it happens:** CONTEXT.md says "Phase 33 adds `code: string` field (e.g. `SF//FRM-001`) to each entry." But `code` is already in use for the usage snippet.

**How to avoid:** Use `sfCode: string` as the field name for the nomenclature code, or `catalogCode`, or `id`. Do NOT use `code`. The CONTEXT.md description was written before examining the actual interface.

**Warning signs:** ComponentDetail stops rendering usage snippets correctly; TypeScript type error on `entry.code` in component-detail.tsx.

### Pitfall 3: Portal SSR Error

**What goes wrong:** `createPortal(el, document.body)` throws during SSR because `document` is undefined server-side.

**Why it happens:** InventorySection is a 'use client' component but Next.js still SSRs client components on the server.

**How to avoid:** Guard portal render with `mounted` state: `const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true), [])`. Only render portal when `mounted` is true.

**Warning signs:** Hydration mismatch error in browser console; "document is not defined" during build.

### Pitfall 4: Flip State Not Captured for New Filters

**What goes wrong:** Adding layer/pattern filter buttons to ComponentsExplorer without calling `captureFlipState()` before state update causes Flip to animate from incorrect positions.

**Why it happens:** The existing `handleFilter` calls `captureFlipState()` before setting state. New filter handlers must do the same.

**How to avoid:** Create `handleLayerFilter` and `handlePatternFilter` callbacks that call `captureFlipState()` before `setActiveLayer`/`setActivePattern`.

### Pitfall 5: 12-Item Subset Index Mismatch

**What goes wrong:** The CONTEXT.md 12-item table lists `SF//FRM-001` = BUTTON = registry index "001", `SF//LAY-001` = CONTAINER = registry index TBD, etc. The registry does NOT have a "CONTAINER" entry. The homepage subset refers to `SF//LAY-001` as CONTAINER but the LAYOUT category in the registry has: CARD (005), MODAL (006), DRAWER (012), HOVER_CARD (028).

**Why it happens:** The CONTEXT.md 12-item table was written based on a projected registry, not the actual one.

**How to avoid:** Before building InventorySection, map each of the 12 CONTEXT.md rows to actual registry entries. Some names may differ (CONTAINER may not exist; may need to substitute SFSection/SFContainer from layout primitives, or use CARD as LAY-001). **This is a Wave 0 task requiring human decision.**

**Warning signs:** `COMPONENT_REGISTRY["005"]` has `name: "CARD"` not "CONTAINER". No registry entry named "CONTAINER" or "SECTION" (these are layout primitives in `components/sf/` but not in the registry).

### Pitfall 6: ACQUISITION Section Exceeds 50vh

**What goes wrong:** Section content + padding overflows the 50vh cap, especially at small viewports.

**Why it happens:** The stats block + CLI hero + links + header can stack to more than 50vh on mobile.

**How to avoid:** Use `max-height: 50vh; overflow: hidden` on the section root, with compact padding (`py-8` not `py-16`). Test at 375px viewport height.

### Pitfall 7: `highlightedCodeMap` Missing for Homepage

**What goes wrong:** ComponentDetail requires a `highlightedCode: string` prop. The homepage `page.tsx` is a sync Server Component (converted in Phase 30 — see STATE.md decision: "page.tsx converted from async Server Component to sync"). It cannot await `highlight()` for all 12 components.

**Why it happens:** `/inventory` page is async and pre-computes highlights server-side. Homepage was explicitly made sync.

**How to avoid:** Either (a) make the homepage INVENTORY section use lazy/client-side code highlighting (ComponentDetail falls back gracefully if no highlighted code is passed — verify this), or (b) pass raw code string and let ComponentDetail render unhighlighted. The detail panel still works without highlighted code — verify the ComponentDetailLazy render path handles `highlightedCode: ""` gracefully. Check `component-detail.tsx` code tab rendering.

---

## Code Examples

### Verified: ComponentRegistryEntry Interface (from `lib/component-registry.ts`)

```typescript
// Source: lib/component-registry.ts (lines 5-21)
export interface ComponentRegistryEntry {
  index: string;          // e.g. "001"
  name: string;           // e.g. "BUTTON"
  component: string;      // e.g. "SFButton"
  importPath: string;
  variants: VariantPreview[];
  code: string;           // USAGE SNIPPET — do not overwrite with nomenclature code
  docId: string;
  layer: "frame" | "signal";
  pattern: "A" | "B" | "C";
  category: string;       // "FORMS" | "LAYOUT" | "NAVIGATION" | "FEEDBACK" | "DATA_DISPLAY" | "GENERATIVE"
}
```

### Verified: ComponentDetail Props Interface (from `components/blocks/component-detail.tsx`)

```typescript
// Source: components/blocks/component-detail.tsx (lines 72-78)
export interface ComponentDetailProps {
  entry: ComponentRegistryEntry;
  doc: ComponentDoc | undefined;
  highlightedCode: string;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}
```

### Verified: ComponentsExplorer useMemo Filter (from `components/blocks/components-explorer.tsx`)

```typescript
// Source: components/blocks/components-explorer.tsx (lines 567-574)
const filtered = useMemo(() => COMPONENTS.filter((comp) => {
  const matchesCategory =
    activeFilter === 'ALL' || comp.filterTag === activeFilter;
  const matchesSearch =
    searchQuery === '' ||
    comp.name.toLowerCase().includes(searchQuery.toLowerCase());
  return matchesCategory && matchesSearch;
}), [activeFilter, searchQuery]);
```

### Verified: data-modal-open Contract (from `app/globals.css`)

```css
/* Source: app/globals.css (lines 241-250) */
/* --z-overlay: 100 (line 197) */

[data-modal-open] .sf-cursor {
  z-index: var(--z-content);  /* drops canvas cursor from z-500 to z-10 */
}

[data-modal-open] .signal-overlay-toggle,
[data-modal-open] #signal-overlay-panel {
  pointer-events: none;
  opacity: 0.4;
}
```

### Verified: Homepage Stub Slots (from `app/page.tsx`)

```tsx
// Source: app/page.tsx (lines 56-91)
// INVENTORY stub — Phase 33 replaces the h2 placeholder:
<SFSection label="INVENTORY" bgShift="white" id="inventory" data-section="inventory"
  className="py-0 min-h-screen flex items-center justify-center">
  <h2 className="font-mono text-sm text-muted-foreground uppercase tracking-widest">INVENTORY</h2>
</SFSection>

// ACQUISITION stub — Phase 33 replaces the h2 placeholder:
<SFSection label="ACQUISITION" bgShift="white" id="acquisition" data-section="acquisition"
  className="py-0 min-h-screen flex items-center justify-center">
  <h2 className="font-mono text-sm text-muted-foreground uppercase tracking-widest">ACQUISITION</h2>
</SFSection>
```

### Verified: PROOF Section Stats (from `components/blocks/proof-section.tsx`)

```tsx
// Source: proof-section.tsx (lines 312-319)
// Current hardcoded stats — must be replaced with SYSTEM_STATS constants:
<span>COMPONENTS // 51</span>
<span>BUNDLE // 100KB</span>
<span>LIGHTHOUSE // 100/100</span>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| ComponentsExplorer hardcoded 30-item COMPONENTS array | Stays for now; Phase 33 adds live registry bridge | Phase 33 | /inventory page gets 34 live items + new filters |
| Homepage INVENTORY section: h2 placeholder stub | InventorySection: 12-row monospace table + fixed portal | Phase 33 | Catalog data visible on homepage |
| ACQUISITION section: h2 placeholder stub | AcquisitionSection: terminal stats panel | Phase 33 | CLI command as acquisition vector |
| Stats hardcoded inline in proof-section.tsx | Imported from `lib/system-stats.ts` | Phase 33 | Single source of truth for component count, bundle, Lighthouse |
| proof-components.ts uses old BTN/CRD/INP codes | New nomenclature uses FRM/LAY/NAV/FBK/DAT/GEN codes | Phase 33 | Consistent with registry category structure |

**Deprecated / needs replacement:**
- `PROOF_COMPONENT_SKELETONS` in `lib/proof-components.ts`: Uses old category codes (BTN, CRD, INP, TGL, etc.) that do not match the Phase 33 nomenclature (FRM, LAY, NAV, etc.). The PROOF section display of `SF//BTN-001` etc. will be inconsistent with the INVENTORY table showing `SF//FRM-001`. This is a visual inconsistency to note but NOT required to fix in Phase 33 (PROOF section is done; fixing it would reopen Phase 32 tests).

---

## Open Questions

1. **12-item subset alignment with actual registry**
   - What we know: CONTEXT.md names CONTAINER and SECTION as LAY-001 and LAY-002, but the registry has no entries with those names (LAYOUT category has CARD, MODAL, DRAWER, HOVER_CARD).
   - What's unclear: Which 2 LAYOUT components should appear as LAY-001/LAY-002? Use CARD + MODAL? Or use layout primitives (SFContainer, SFSection) which are in `components/sf/` but NOT in the registry?
   - Recommendation: Flag as Wave 0 human decision. Propose CARD (005) and MODAL (006) as LAY-001/LAY-002 since they are in the registry. If CONTAINER is desired, it must be added to the registry.

2. **Actual component count for AQ-02**
   - What we know: Registry has 34 entries. PROOF section shows "51". CONTEXT.md says 54.
   - What's unclear: Is there a separate count including layout primitives, lazy components, or sub-components?
   - Recommendation: Use `Object.keys(COMPONENT_REGISTRY).length` (34) as the authoritative count unless grey explicitly wants a different number. Update both PROOF section and ACQUISITION to use `SYSTEM_STATS.components`. Raise this with grey before locking.

3. **`highlightedCode` for homepage ComponentDetail**
   - What we know: Homepage `page.tsx` is sync. ComponentDetail requires `highlightedCode: string`.
   - What's unclear: Does ComponentDetail handle `""` gracefully for the code tab?
   - Recommendation: Check `component-detail.tsx` code tab rendering (around line 220+). If it renders gracefully with empty string, pass `""` and accept no syntax highlighting on homepage. If not, add a conditional fallback.

4. **ACQUISITION bgShift and section background**
   - What we know: The ACQUISITION stub has `bgShift="white"` and sits after SIGNAL (`bgShift="black"`).
   - What's unclear: The terminal instrument panel aesthetic — should ACQUISITION be on a dark background (continuing SIGNAL's black) or the white background from the stub?
   - Recommendation: The stub has `bgShift="white"`. Given the "terminal session that ended" aesthetic, dark background feels more correct. But `bgShift` is controlled at the SFSection wrapper level in page.tsx — check with grey if this should change.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright (existing) |
| Config file | `playwright.config.ts` |
| Quick run command | `pnpm playwright test tests/phase-33-inventory-acquisition.spec.ts` |
| Full suite command | `pnpm playwright test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| IV-01 | Each row in homepage INVENTORY has `SF//[CAT]-NNN` format | source + DOM | `pnpm playwright test tests/phase-33-inventory-acquisition.spec.ts --grep "IV-01"` | ❌ Wave 0 |
| IV-02 | Each row shows layer tag, pattern tier, name — all three visible | DOM | same spec | ❌ Wave 0 |
| IV-03 | Rows use `font-mono`, no `.flip-card` card layout | source + DOM | same spec | ❌ Wave 0 |
| IV-04 | Click row → ComponentDetail opens; click again/Escape → closes | DOM interaction | same spec | ❌ Wave 0 |
| IV-05 | Homepage shows exactly 12 rows; /inventory shows registry count | DOM | same spec | ❌ Wave 0 |
| IV-06 | Layer + pattern filter toggles on /inventory reduce results correctly | DOM interaction | same spec | ❌ Wave 0 |
| AQ-01 | ACQUISITION section contains "npx signalframeux init" text + copy trigger | DOM | same spec | ❌ Wave 0 |
| AQ-02 | Stats block contains component count, bundle size, lighthouse score | DOM | same spec | ❌ Wave 0 |
| AQ-03 | Links to /init and /inventory present | DOM | same spec | ❌ Wave 0 |
| AQ-04 | Section height ≤ 50vh | DOM geometry | same spec | ❌ Wave 0 |
| AQ-05 | No button[type="button"] inside ACQUISITION section (no CTA buttons) | DOM | same spec | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `pnpm playwright test tests/phase-33-inventory-acquisition.spec.ts`
- **Per wave merge:** `pnpm playwright test`
- **Phase gate:** Full suite (11 existing + N new phase-33 tests) green before `/pde:verify-work`

### Test Patterns (from established phases)

Based on phase-32 patterns: mix source-level `fs.readFileSync` assertions with browser-level DOM tests. Key patterns to reuse:

```typescript
// Source-level pattern (from phase-32):
const src = fs.readFileSync(path.resolve(ROOT, 'components/blocks/inventory-section.tsx'), 'utf-8')
expect(src).toContain('createPortal')
expect(src).not.toContain('border-radius')

// DOM row count pattern:
const rows = page.locator('#inventory [data-inventory-row]')
await expect(rows).toHaveCount(12)

// Text content pattern:
const firstCode = page.locator('#inventory [data-inventory-row]').first().locator('[data-sf-code]')
await expect(firstCode).toContainText('SF//')

// Section height pattern (from PR-01):
const box = await page.locator('[data-acquisition-root]').boundingBox()
const vh = page.viewportSize()!.height
expect(box!.height).toBeLessThanOrEqual(vh * 0.5 + 5)
```

### Wave 0 Gaps

- [ ] `tests/phase-33-inventory-acquisition.spec.ts` — all IV and AQ tests
- [ ] `lib/nomenclature.ts` — `assignCodes()` utility (dependency for all IV tests)
- [ ] `lib/system-stats.ts` — `SYSTEM_STATS` constants (dependency for AQ-02 test and proof-section fix)
- [ ] Human decision: 12-item subset alignment (CONTAINER vs CARD for LAY-001/002)
- [ ] Human decision: Validate component count for SYSTEM_STATS.components (34 actual vs 54 planned)

---

## Sources

### Primary (HIGH confidence)

- Direct file reads: `lib/component-registry.ts`, `components/blocks/components-explorer.tsx`, `components/blocks/component-detail.tsx`, `app/page.tsx`, `app/inventory/page.tsx`, `app/globals.css`, `lib/proof-components.ts`, `components/blocks/proof-section.tsx`
- All interface shapes, filter logic, z-index tokens, and existing patterns are read directly from source

### Secondary (MEDIUM confidence)

- `.planning/phases/32-signal-proof-sections/32-02-SUMMARY.md` — ScrollTrigger pattern for SIGNAL section (sticky not scrub)
- `.planning/STATE.md` — z-index contract, v1.4 bundle gate history
- Playwright test pattern inference from `tests/phase-32-signal-proof.spec.ts`

### Tertiary (LOW confidence)

- Component count discrepancy (34 actual vs 51/54 referenced) — requires human validation before locking

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new libraries; all tools already in codebase
- Architecture: HIGH — direct codebase inspection; interface shapes verified from source
- Pitfalls: HIGH for registry count mismatch and field name collision (confirmed by reading source); MEDIUM for 12-item subset mismatch (partial confirmation — CONTAINER not found but requires full mapping exercise)
- Stats validation: LOW — actual bundle gzip not re-measured (last known: 100KB per PROOF section and v1.4 gate); Lighthouse confirmed 100/100 at v1.4

**Research date:** 2026-04-08
**Valid until:** 2026-05-08 (stable codebase — registry changes would invalidate count findings)
