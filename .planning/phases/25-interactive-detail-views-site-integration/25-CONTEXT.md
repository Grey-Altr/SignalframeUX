# Phase 25: Interactive Detail Views + Site Integration - Context

**Gathered:** 2026-04-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Clicking any component card on /components or the homepage grid expands an inline detail panel showing variants, props, and copyable code. This is the milestone's primary feature. Includes ComponentDetail panel creation, ComponentsExplorer wiring, homepage grid wiring, and DU/TDR styling. All data comes from Phase 24's component-registry.ts and api-docs.ts — no new data authoring.

Requirements: DV-04 through DV-12, SI-01 through SI-04.

</domain>

<decisions>
## Implementation Decisions

### Detail Panel Layout
- Full-width row inserted below the clicked card's grid row — not a side panel, not overlaying the grid
- Panel is a DOM sibling outside the GSAP Flip grid container (DV-11) — avoids Flip layout interference
- Panel sits between grid rows: after the row containing the clicked card, before the next row
- Only one panel open at a time — clicking another card closes the current and opens below the new card's row

### Tab Interaction
- Three tabs: VARIANTS / PROPS / CODE (DV-04)
- Default tab on open: VARIANTS — most visual impact, shows live SF component renders
- Tab switching is instant (no animation between tab content)
- Tab bar uses uppercase labels with accent color on the active tab (SI-03)

### Animation Behavior
- GSAP height tween from 0 to auto using --duration-moderate (200ms) and --ease-default (DV-04)
- On close: reverse tween (auto to 0) with same duration
- Escape key closes panel and returns focus to trigger card (DV-10)
- Reduced-motion: skip height tween, show/hide instantly with display toggle

### Homepage Grid Integration
- Same ComponentDetail component used on both /components and homepage grid (SI-02)
- Imported via next/dynamic with ssr: false in both locations (DV-12, bundle gate compliance)
- Homepage grid cards get onClick handler matching ComponentsExplorer pattern (SI-02)
- Session state persistence: remember last-opened component across navigation (SI-01)

### Detail Panel Content
- Header: component name, FRAME/SIGNAL layer badge, pattern tier A/B/C badge (DV-08)
- VARIANTS tab: grid of all intent/size values rendered as live SF components (DV-05)
- PROPS tab: table with name, type, default, required, description columns (DV-06)
- CODE tab: usage snippet with copy-to-clipboard + CLI install command with copy-to-clipboard (DV-07)
- Animation token callout: durations and easings used by the component (DV-09)
- Code highlighting via lib/code-highlight.ts (shiki RSC, server-only)

### Z-Index Contract
- Detail panel uses --z-content (10) — sits in normal content flow, below nav (--z-nav: 9999)
- Panel must not compete with canvas cursor (--z-cursor: 500) or SignalOverlay (--z-vhs: 99999)
- No new z-index tokens needed — existing scale covers the use case (SI-04)

### DU/TDR Aesthetic
- Sharp edges (zero border-radius), uppercase labels, monospace for code
- Accent color on selected tab, foreground/background from core token palette
- Separator lines using --color-border or --color-accent at low opacity
- No decorative gradients, no shadows — depth from spacing and hierarchy only (SI-03)

### Claude's Discretion
- Internal component structure of ComponentDetail (sub-components, file organization)
- Exact variant grid layout (columns, gap, responsive breakpoints)
- Props table styling details (column widths, overflow handling)
- Copy-to-clipboard implementation (navigator.clipboard vs fallback)
- Session state key naming for persistence
- How variant previews handle components that need specific container context

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Data Layer (Phase 24 outputs)
- `lib/component-registry.ts` — ComponentRegistryEntry type and COMPONENT_REGISTRY map; source of all detail panel data
- `lib/api-docs.ts` — ComponentDoc entries with PropDef interface; consumed via docId pointer from registry
- `lib/code-highlight.ts` — shiki/core RSC module for syntax highlighting; server-only import

### Integration Points
- `components/blocks/components-explorer.tsx` — Grid component with GSAP Flip; onClick wiring target for SI-01
- `components/blocks/component-grid.tsx` — Homepage grid; onClick wiring target for SI-02
- `public/r/registry.json` — 49-item registry with meta.layer/meta.pattern; source of truth for component metadata

### Design System
- `app/globals.css` — Z-index scale (lines 194-202), animation tokens, OKLCH color tokens
- `SCAFFOLDING.md` — SF wrapper patterns, prop vocabulary, registry template
- `components/sf/index.ts` — Barrel export for all SF components (variant render imports)

### Session State
- `hooks/use-session-state.ts` — useSessionState hook + SESSION_KEYS; persistence mechanism for SI-01
- `hooks/use-scroll-restoration.ts` — useScrollRestoration hook; used alongside session state

### Requirements
- `.planning/REQUIREMENTS.md` §DV-04 through §DV-12 — Detail view feature requirements
- `.planning/REQUIREMENTS.md` §SI-01 through §SI-04 — Site integration requirements

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/component-registry.ts` — COMPONENT_REGISTRY with 34 entries, each has variants[], code, docId, layer, pattern, category
- `lib/api-docs.ts` — API_DOCS with ~107 ComponentDoc entries, PropDef interface with name/type/default/required/description
- `lib/code-highlight.ts` — highlightCode() function, shiki/core with custom OKLCH theme, server-only
- `components/sf/index.ts` — Barrel export of all 49+ SF components for live variant rendering
- `hooks/use-session-state.ts` — useSessionState<T>(key, defaultValue) with SESSION_KEYS constants
- `lib/gsap-core.ts` — GSAP core import, used by all animation components
- `lib/gsap-flip.ts` — GSAP Flip plugin, already used by ComponentsExplorer for filter transitions

### Established Patterns
- GSAP Flip for grid animations in ComponentsExplorer (async import pattern)
- useSessionState for persistence (SESSION_KEYS pattern, sessionStorage-backed)
- next/dynamic with ssr: false for heavy components (SFCalendar, SFMenubar precedent)
- Server Components default; 'use client' only when needed
- CVA for component variants; cn() for class merging
- DU/TDR uppercase labels, monospace code, accent highlights throughout existing UI

### Integration Points
- ComponentsExplorer grid items have onClick that currently calls handleSelect → needs detail panel expansion
- Homepage component-grid.tsx cards need onClick wiring (currently display-only)
- Z-index scale in globals.css has clear tiers: content(10) < overlay(100) < cursor(500) < nav(9999) < vhs(99999)
- GSAP Flip grid in ComponentsExplorer — detail panel must be DOM sibling OUTSIDE the Flip container

</code_context>

<specifics>
## Specific Ideas

No specific requirements — auto-selected recommended defaults for all decisions.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 25-interactive-detail-views-site-integration*
*Context gathered: 2026-04-06*
