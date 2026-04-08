# Phase 33: INVENTORY + ACQUISITION Sections — Context

**Gathered:** 2026-04-08
**Status:** Ready for planning
**Source:** cdBrain research pass + grey decision session 2026-04-08

<domain>
## Phase Boundary

Phase 33 delivers two homepage sections and upgrades the existing /inventory page:

1. **INVENTORY (homepage)** — 12-item monospaced catalog subset. Dense, systematic, tabular. Each row is a line of data, not a card. Click expands ComponentDetail as a fixed overlay panel (does not displace scroll position).
2. **INVENTORY (/inventory page)** — Full 54-item catalog. Existing page and ComponentsExplorer infrastructure preserved; hardcoded 30-item array replaced with live registry data. Filters extended: layer (FRAME/SIGNAL) + pattern (A/B/C) added to existing category filter.
3. **ACQUISITION (homepage)** — Terminal instrument panel ≤50vh. CLI command as the hero. Monospaced stats. Two text links. Zero CTA energy.

**Phase order within Phase 33:** INVENTORY before ACQUISITION. INVENTORY carries more structural decisions (nomenclature, subset selection, ComponentDetail wiring). ACQUISITION is low-risk once the stats are validated.

</domain>

<decisions>
## Implementation Decisions

### INVENTORY — Layout: monospaced row table, not cards

**LOCKED 2026-04-08.** Five fixed-width columns per row:

```
SF//FRM-001    BUTTON          [FRAME]    A    →
SF//FRM-002    INPUT           [FRAME]    A    →
SF//NAV-001    NAV_MENU        [FRAME]    A    →
SF//GEN-001    SCRAMBLE_TEXT   [//SIGNAL] C    →
```

- Column 1: coded nomenclature (`SF//[CAT]-NNN`) — `font-mono`, primary accent color
- Column 2: component name — `font-mono`, foreground
- Column 3: layer tag (`[//SIGNAL]` or `[FRAME]`) — `[//SIGNAL]` gets primary red/magenta accent; `[FRAME]` stays neutral gray
- Column 4: pattern tier (`A` / `B` / `C`) — neutral, subdued
- Column 5: expand trigger — a minimal arrow or `+` character, not a button

**No card layout. No flip animation. No hover-card previews.** The density IS the design. At a glance, the table should read like a terminal process list or a datasheet.

### INVENTORY — 12-item homepage subset: breadth sample

**LOCKED 2026-04-08.** Exactly 2 per category, 6 categories = 12 items. The GEN items appear last and function as the showpiece — the two SIGNAL-layer components that make the system's nature legible.

| # | Code | Name | Layer | Tier |
|---|------|------|-------|------|
| 1 | SF//FRM-001 | BUTTON | FRAME | A |
| 2 | SF//FRM-002 | INPUT | FRAME | A |
| 3 | SF//LAY-001 | CARD | FRAME | A |
| 4 | SF//LAY-002 | HOVER_CARD | FRAME | A |
| 5 | SF//NAV-001 | NAV_MENU | FRAME | A |
| 6 | SF//NAV-002 | BREADCRUMB | FRAME | A |
| 7 | SF//FBK-001 | TOAST | SIGNAL | A |
| 8 | SF//FBK-002 | PROGRESS | SIGNAL | A |
| 9 | SF//DAT-001 | TABLE | FRAME | A |
| 10 | SF//DAT-002 | BADGE | FRAME | A |
| 11 | SF//GEN-001 | SCRAMBLE_TEXT | SIGNAL | C |
| 12 | SF//GEN-002 | CIRCUIT_DIVIDER | SIGNAL | C |

The two GEN rows (`[//SIGNAL]`) break the run of FRAME rows and signal what this system actually is. They should sit at the bottom of the homepage table where the eye lands last.

A "→ /inventory" text link sits below the 12-item table. Not a button.

### INVENTORY — ComponentDetail on homepage: fixed overlay panel

**LOCKED 2026-04-08.** Expand-in-place would push SIGNAL and ACQUISITION sections below — disrupts page flow and conflicts with SIGNAL ScrollTrigger timing. Fixed/overlay panel floats above the catalog.

**Implementation:**
- Use existing `--z-overlay` token and `[data-modal-open]` infrastructure from STATE.md
- `[data-modal-open]` drops canvas cursor z-index below panel (already wired in v1.4)
- Panel anchors to viewport (position: fixed) rather than to the INVENTORY section DOM
- On `/inventory` page: expand-in-place behavior PRESERVED (no sections below to displace — different context, not inconsistency)
- ComponentDetail component itself is unchanged — only the trigger and positioning logic differs between homepage and /inventory

### INVENTORY — coded nomenclature: extend from 12 to 54

The `SF//[CAT]-NNN` format was established in Phase 32's `proof-components.ts` for 12 items. Phase 33 extends it to all registry entries.

**6 validated category codes:**
| Category | Code |
|----------|------|
| FORMS | FRM |
| LAYOUT | LAY |
| NAVIGATION | NAV |
| FEEDBACK | FBK |
| DATA_DISPLAY | DAT |
| GENERATIVE | GEN |

Sequential numbering within each category: `FRM-001`, `FRM-002`, ... `GEN-012`.

The `COMPONENT_REGISTRY` in `lib/component-registry.ts` already has `category`, `layer`, and `pattern` fields. Phase 33 adds `code: string` field (e.g. `SF//FRM-001`) to each entry. Do not hardcode the codes — derive them at build time from category + sequential index within category.

### ACQUISITION — terminal instrument panel, ≤50vh

**LOCKED 2026-04-08.** The section is a single monospace panel. No marketing copy. No rounded CTA.

```
— ACQUIRE

npx signalframeux init                         [copy]

COMPONENTS     // 54
BUNDLE         // [measured gzip]
LIGHTHOUSE     // 100

→ /init        → /inventory
```

- The CLI command is the hero: large, monospaced, the whole pitch
- `[copy]` trigger is a minimal text label or icon — not a styled button
- Stats use the same column-aligned format as PROOF section data points (consistency)
- Links are `→ /init` and `→ /inventory` styled as monospaced text anchors, not buttons
- Section height: hard cap at 50vh — if content exceeds, reduce padding, do not grow the section
- `AQ-05`: the section should feel like a terminal session that ended. No invitation. No energy. You either know what to do with `npx signalframeux init` or you don't.

**Component count for AQ-02:** Run `pnpm build` and measure actual gzip bundle before locking the stat. Registry shows 54 items total (including the `signalframeux` umbrella entry). Confirm the display count (may be 53 discrete components, or 54 including umbrella) — match it to what PROOF section currently shows and document the delta.

### /inventory page — replace hardcoded array, extend filters

The `/inventory` page (`app/inventory/page.tsx`) and `ComponentsExplorer` block already exist with:
- 30-item hardcoded `COMPONENTS` array
- Category filter (7 options: ALL + 6 categories)
- Search input
- Grid display with ComponentDetail expand-in-place

Phase 33 changes:
1. Replace the 30-item hardcoded array with the full live `COMPONENT_REGISTRY` (54 items, all with codes)
2. Add `layer` filter toggle (FRAME / SIGNAL / ALL)
3. Add `pattern` filter toggle (A / B / C / ALL)
4. The `filterTag` field used by the existing filter maps to the `category` field — confirm field name alignment before rewriting

Do NOT change the ComponentDetail expand-in-place behavior on `/inventory`. Do NOT change the grid layout. Extend, don't rebuild.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### cdBrain — Design Intent

The following cdBrain wiki sources were used to develop this context. They contain the aesthetic register that makes Phase 33 CD-quality rather than generic.

**Brando Corp / ENERO.STUDIO (`wiki/sources/brando-corp-symbols.md`):**
The 250-symbol grid at thumbnail density reads as a typographic system — each cell a glyph in an imaginary heavy-geometric typeface. This is the visual prototype for the INVENTORY table: dense, systematic, each row a named object. The "imaginary corporation" register of the Brando Corp naming is the same register as `SF//FRM-001` — official, technical, fictional-serious. The ACQUISITION section's instrument-panel energy inherits from this.

**Liquid Glass (`wiki/concepts/liquid-glass.md`, `wiki/sources/liquid-glass-resource.md`):**
Apple's 2026 consumer design language. Iridescent, pill-shaped, chromatic, bright, refraction-soft. CD's design language is its formal opposite in every dimension: dark, zero-radius, achromatic, hard-cut. Phase 33 is not positioned against "generic web design" — it is positioned against a specific named counter-aesthetic that is now the dominant consumer grammar of 2026. Every design decision in ACQUISITION that refuses a rounded CTA, refuses a gradient, refuses softness — is a conscious formal opposition. The design language is the product claim.

**Kloroform SPACE 1 (`wiki/sources/studio-kloroform-space1.md`):**
Particle-field astronomical forms — the same register as SF's existing generative scenes (GLSLHero, SignalMesh, GLSLSignal). The `[//SIGNAL]` rows in the INVENTORY table should feel like entries from this vocabulary: precise, systematic, scientific-illustration register. The GEN category items (SCRAMBLE_TEXT, CIRCUIT_DIVIDER) are the closest things in the SF registry to Kloroform objects.

### Project Infrastructure (already shipped)

- `.planning/phases/32-signal-proof-sections/32-02-SUMMARY.md` — GLSLSignal ScrollTrigger setup; INVENTORY ScrollTrigger must not conflict with SIGNAL's `scrub: 2` parallax
- `.planning/phases/25-interactive-detail-views-site-integration/` — ComponentDetail panel implementation, GSAP height animation, `data-modal-open` contract, z-index
- `components/blocks/components-explorer.tsx` — existing filter logic (useMemo pattern), extend for layer + pattern filters
- `lib/component-registry.ts` — full registry with `layer`, `pattern`, `category` fields; add `sfCode` field here (NOT `code` — that field is already used for the usage snippet)
- `.planning/STATE.md` — z-index contract: `--z-overlay` token, `[data-modal-open]` cursor z-index rule

### Quality Tests

- **INVENTORY test:** "Does this read like a specification sheet or like a storefront?" — Must be specification sheet. If any row looks like a product tile, it's wrong.
- **ACQUISITION test:** "Would someone who doesn't know what `npx init` means feel excluded or feel like they arrived at the wrong place?" — Yes. That exclusion is correct. This section is not for them.
- **Liquid Glass test:** "Could this section exist in an Apple-adjacent consumer product?" — If yes, redesign. The design language must be legible as formally opposed to the 2026 consumer moment.
- **Density test:** "Could you add 6 more rows to the INVENTORY table without the layout feeling overcrowded?" — Must be yes. The table should feel like it has room for infinity.

</canonical_refs>

<specifics>
## Specific Implementation Notes

### Coded nomenclature generation

**AMENDMENT 2026-04-08:** Registry has 34 entries (not 54). Grey confirmed: reconcile registry first — add all missing shipped SF components before locking stats. Plan 1 of Phase 33 must include a registry audit + fill task. Authoritative component count is determined by the reconciled registry, not prior documentation.

**AMENDMENT 2026-04-08:** `code` field name collision — use `sfCode` (not `code`). The `code` field on `ComponentRegistryEntry` is already the usage snippet template literal. The nomenclature field MUST be `sfCode`.

**AMENDMENT 2026-04-08:** 12-item LAYOUT subset — CONTAINER/SECTION do not exist. Use CARD (LAY-001) + HOVER_CARD (LAY-002).

Derive codes programmatically — do not hardcode the count:

```typescript
// In lib/component-registry.ts or a separate lib/nomenclature.ts
const CATEGORY_CODE: Record<string, string> = {
  FORMS: 'FRM',
  LAYOUT: 'LAY',
  NAVIGATION: 'NAV',
  FEEDBACK: 'FBK',
  DATA_DISPLAY: 'DAT',
  GENERATIVE: 'GEN',
}

function assignCodes(registry: ComponentRegistryEntry[]): ComponentRegistryEntry[] {
  const counters: Record<string, number> = {}
  return registry.map(entry => {
    const cat = CATEGORY_CODE[entry.category] ?? 'UNK'
    counters[cat] = (counters[cat] ?? 0) + 1
    const sfCode = `SF//${cat}-${String(counters[cat]).padStart(3, '0')}`
    return { ...entry, sfCode }
  })
}
```

Sort by category before assigning — codes should be stable (same order every build).

### Fixed overlay — homepage ComponentDetail

```tsx
// Homepage INVENTORY: fixed overlay variant
// ComponentDetail renders into a portal anchored to viewport
// Same component, different render target:

// /inventory (expand-in-place):
// parent: ComponentsExplorer grid row — expands inline

// homepage (fixed overlay):
// parent: createPortal(detail, document.body)
// position: fixed, top/left/width/height via --z-overlay
// backdrop: semi-transparent dark layer (not full modal — catalog rows stay visible)
```

### ScrollTrigger safety

Phase 32 SIGNAL section uses `scrub: 2` parallax anchored to its section. If INVENTORY section uses ScrollTrigger for any animation (e.g. staggered row reveals), ensure:
- Triggers are scoped to `#inventory-section` not `document`
- `invalidateOnRefresh: true` on all triggers
- No `pin` on INVENTORY (pinned sections above — THESIS — are complete; adding another pin in the middle of the page risks Lenis/ScrollTrigger offset errors)

### Stats validation before locking AQ-02

Run this before writing the ACQUISITION component:
```bash
ANALYZE=true pnpm build
# Check .next/analyze/client.html for actual gzip shared bundle
# Run lighthouse against deployed preview URL for live scores
```

Lock the numbers in a constant, not a hardcode:
```typescript
// lib/system-stats.ts
export const SYSTEM_STATS = {
  components: 54,      // validate against registry count
  bundle: '100KB',     // update from build output
  lighthouse: '100',   // update from live Lighthouse run
} as const
```

Import into both PROOF section (where they already display) and ACQUISITION section — single source of truth.

</specifics>

<deferred>
## Deferred Items

- **Pattern B (lazy) components on /inventory:** `sf-calendar`, `sf-menubar`, `sf-drawer` are lazy-loaded and not in the main barrel. Their catalog entries should still appear in INVENTORY with a `[LAZY]` indicator or equivalent — but their ComponentDetail preview may render a stub rather than the full live component. Acceptable for Phase 33; full lazy preview is Phase 34+ if needed.
- **Search on homepage INVENTORY subset:** The 12-item homepage table does not need a search input (too few items). `/inventory` page retains search. Do not add search to homepage.
- **Animation on INVENTORY rows:** Staggered row reveals on scroll-enter are a Phase 34 Visual Language enhancement. Phase 33 INVENTORY rows render immediately (no stagger). Ship the data first, animate in Phase 34.
- **D-34 Physical iPhone Safari (Phase 31 deferred item):** Carry this into Phase 33 as the first human verification task. THESIS pin scroll test on physical iPhone 14/15 — 6 statements reveal/dismiss cleanly. Do not skip again.

</deferred>

---

*Phase: 33-inventory-acquisition-sections*
*Context gathered: 2026-04-08 from cdBrain research pass + grey decision session*
*All gray areas resolved. Ready for `/pde:plan-phase 33`.*
