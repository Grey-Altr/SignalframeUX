# Requirements — v1.4 Feature Complete

## Tech Debt
- [ ] **TD-01**: MutationObserver in signal-mesh.tsx and glsl-hero.tsx disconnects on unmount
- [ ] **TD-02**: readSignalVars has explicit isNaN() guard in both WebGL scenes
- [ ] **TD-03**: Programmatic scroll routes through lenis.scrollTo (not window.scrollTo)
- [ ] **TD-04**: Duplicate TOAST entries in ComponentsExplorer resolved (unique names/indices)

## Token System
- [ ] **TK-01**: --color-success and --color-warning moved into @theme block in globals.css
- [ ] **TK-02**: Elevation absence explicitly documented in globals.css and SCAFFOLDING.md
- [ ] **TK-03**: Sidebar and chart color tokens documented in SCAFFOLDING.md
- [ ] **TK-04**: WebGL color bridge (color-resolve.ts) audited for token dependency safety

## Components
- [ ] **CMP-01**: SFDrawer (vaul-based, lazy, meta.heavy: true) with registry + explorer entry
- [ ] **CMP-02**: SFHoverCard (FRAME-only, Pattern A) with registry + explorer entry
- [ ] **CMP-03**: SFInputOTP (input-otp, Pattern A) with registry + explorer entry
- [ ] **CMP-04**: SFInputGroup wrapper closes last unwrapped ui/ component gap

## Detail View Data
- [ ] **DV-01**: lib/component-registry.ts maps all grid items to variants, code snippets, doc pointers
- [ ] **DV-02**: lib/api-docs.ts extended with ComponentDoc entries for all ~45 components
- [ ] **DV-03**: lib/code-highlight.ts (shiki/core, server-only RSC module) for syntax highlighting

## Interactive Detail Views
- [ ] **DV-04**: ComponentDetail panel with 3 tabs (VARIANTS/PROPS/CODE) and GSAP height animation
- [ ] **DV-05**: Variant grid renders all intent/size values as live SF components
- [ ] **DV-06**: Props table with name, type, default, required, description per component
- [ ] **DV-07**: Code tab with usage snippet + CLI install command, both copy-to-clipboard
- [ ] **DV-08**: FRAME/SIGNAL layer badge and pattern tier (A/B/C) visible in detail header
- [ ] **DV-09**: Animation token callout per component (durations, easings used)
- [ ] **DV-10**: Keyboard accessible (Escape closes, focus returns to trigger card)
- [ ] **DV-11**: Detail panel as DOM sibling outside GSAP Flip grid (not child)
- [ ] **DV-12**: next/dynamic lazy load for ComponentDetail (bundle gate compliance)

## Site Integration
- [ ] **SI-01**: ComponentsExplorer onClick expands detail panel with session state persistence
- [ ] **SI-02**: Homepage grid cards clickable with same detail expansion behavior
- [ ] **SI-03**: DU/TDR aesthetic on detail panel (sharp edges, uppercase labels, accent on selected)
- [ ] **SI-04**: Z-index contract for detail panel vs canvas cursor and SignalOverlay

## Verification
- [ ] **VF-01**: Shared JS bundle remains under 150 KB gate after all additions
- [ ] **VF-02**: Lighthouse audit against deployed URL (target 100/100)

## Future Requirements (v1.4.x)
- Component composition callout in detail view (which SF components compose another)
- Token usage callout per component in detail view

## Out of Scope
- SFCarousel — GSAP animation frame conflict; DU/TDR aesthetic misalignment
- SFChart — recharts ~50KB dependency; no current consumer
- SFResizable — no identified use case
- SFContextMenu — inaccessible on touch; aesthetic misalignment
- SFSidebar — deferred to cdOS milestone (large composable system)
- DataTable composite block — deferred to cdOS milestone
- Storybook — duplicates existing in-site explorer
- MDX pipeline — TypeScript data in api-docs.ts is established pattern
- Interactive prop knobs — show all variants statically instead
- Localization (JFM) — separate future milestone

## Traceability
(To be filled by roadmapper)
