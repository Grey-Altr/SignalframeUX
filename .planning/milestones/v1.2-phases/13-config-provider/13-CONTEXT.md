# Phase 13: Config Provider - Context

**Gathered:** 2026-04-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Create a `createSignalframeUX(config)` factory that returns `{ SignalframeProvider, useSignalframe }` for external consumers. SSR-safe, type-checked config, global motion control. Layout primitives must remain Server Components.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/` — existing utils, theme helpers, GSAP helpers
- `components/sf/` — layout primitives (SFContainer, SFSection, SFGrid, SFStack, SFText) are Server Components
- `components/animation/` — GSAP-based animation components (client-side)
- `app/layout.tsx` — root layout, current provider mounting point

### Established Patterns
- Server Components by default, `'use client'` only when needed
- GSAP 3.12 for all animation; ScrollTrigger for scroll effects
- CSS custom properties on `:root` for theming
- `cn()` from `lib/utils.ts` for class merging

### Integration Points
- New `lib/signalframe-config.ts` (or similar) — factory + types
- New `components/sf/signalframe-provider.tsx` — client provider component
- `app/layout.tsx` — mount provider
- GSAP global instance — `motion.pause()`/`motion.resume()` via `gsap.globalTimeline`

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
