# Phase 9: Extended Scenes + Production Integration - Context

**Gathered:** 2026-04-05
**Status:** Ready for planning

<domain>
## Phase Boundary

DU/TDR aesthetic differentiators (ASCII dither shader on hero, GLSL procedural hero background), SF layout primitive migration across all 5 pages, stagger animation on component grids, production polish to maintain Lighthouse 100/100 and CRT critique >= 90/100.

</domain>

<decisions>
## Implementation Decisions

### ASCII/Dithering Post-Process Shader
- Renders on the hero section — ordered dither CRT aesthetic on the main hero background
- Ordered Bayer 4×4 matrix algorithm — classic CRT/terminal look, GPU-parallel per SCN-03
- Subtle blend (20-30% opacity) with normal rendering — DU/TDR accent, not overwhelming
- Monochrome using `--color-primary` — single-channel CRT aesthetic

### GLSL Hero Shader
- Animated noise field with geometric grid lines — DU/TDR album-art procedural background
- Scroll position shifts noise scale + grid density — subtle transformation as user scrolls
- GLSL hero shader REPLACES SignalMesh in hero section — GLSL IS the hero background, SignalMesh moves to /components
- Fragment shader only (no geometry) — full-screen quad, minimal draw calls, maximum performance

### Layout Migration & Stagger
- All section-level div wrappers on ALL 5 pages (homepage, /components, /tokens, /start, /reference) replaced with SFSection, inner layout with SFStack/SFGrid
- `data-anim="stagger"` attribute on component-grid blocks, triggered by IntersectionObserver one-shot on scroll into view
- Preserve visual output during migration — swap container divs for SF primitives without changing visual appearance
- Complete portfolio should consume SF layout primitives — zero raw div layout wrappers at section level

### Claude's Discretion
- Exact GLSL noise function and grid line rendering approach
- Bayer 4×4 dither threshold matrix values and blend mode
- SignalMesh relocation to /components page — exact placement
- Stagger animation timing (delay per item, total duration)
- SF primitive prop usage during migration (spacing, alignment props)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/sf/sf-section.tsx`, `sf-stack.tsx`, `sf-grid.tsx` — layout primitives (exist, barely consumed)
- `components/sf/index.ts` — barrel export for all SF components
- `components/animation/signal-mesh.tsx` — SignalMesh scene to relocate from hero to /components
- `lib/signal-canvas.tsx` — singleton renderer for GLSL hero shader
- `hooks/use-signal-scene.ts` — scene lifecycle hook
- `lib/color-resolve.ts` — OKLCH→sRGB bridge with TTL cache
- `components/layout/page-animations.tsx` — existing stagger animation patterns
- `components/animation/scroll-reveal.tsx` — IntersectionObserver animation trigger pattern

### Established Patterns
- `useSignalScene` for WebGL scene lifecycle
- GSAP ScrollTrigger for scroll-driven effects
- `next/dynamic({ ssr: false })` via lazy wrappers for WebGL components
- `data-anim` attribute system for animation triggers
- SF primitive API: `SFSection` (data-section, data-bg-shift), `SFStack` (gap, align), `SFGrid` (cols, gap)

### Integration Points
- `app/page.tsx` — hero section (GLSL shader replaces SignalMesh)
- `app/components/page.tsx` — receives relocated SignalMesh + stagger animation
- `app/tokens/page.tsx`, `app/start/page.tsx`, `app/reference/page.tsx` — SF primitive migration
- `components/blocks/component-grid.tsx` — receives `data-anim="stagger"`

</code_context>

<specifics>
## Specific Ideas

- GLSL hero should feel like staring at an operating system's boot sequence — geometric, procedural, alive
- ASCII dither should evoke CRT phosphor decay — the kind of texture you'd see on a Detroit Underground vinyl sleeve
- Layout migration should be invisible to users — same visual output, better code architecture
- Stagger animation should feel mechanical, not bouncy — items slide in with DU/TDR precision

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
