# Phase 10: Foundation Fixes - Context

**Gathered:** 2026-04-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Fix CSS var defaults, TypeScript type mismatches, and layout issues so the codebase compiles clean and renders correctly before any wiring work begins.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/sf/sf-section.tsx` — SFSection with `bgShift?: boolean` (needs type change to string union)
- `components/animation/signal-overlay.tsx` — SignalOverlay writes `--signal-intensity`, `--signal-speed`, `--signal-accent` to `:root`
- `app/globals.css` — token source of truth, currently missing `--signal-*` defaults

### Established Patterns
- OKLCH color space throughout; CSS custom properties on `:root`
- CVA for variants, `cn()` for class merging
- Blessed spacing stops: 4/8/12/16/24/32/48/64/96

### Integration Points
- `globals.css` `:root` block — add `--signal-intensity: 0.5; --signal-speed: 1; --signal-accent: 0`
- `sf-section.tsx` — change `bgShift` from `boolean` to `"white" | "black" | undefined`
- `app/start/page.tsx` — reference page layout (NEXT_CARDS grid wrapping, nav clearance)
- All components consuming `SFSection` with bgShift — update call sites

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
