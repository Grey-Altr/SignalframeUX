# Phase 8: First Generative Scenes - Context

**Gathered:** 2026-04-05
**Status:** Ready for planning

<domain>
## Phase Boundary

First WebGL scene (SignalMesh) validates the full Phase 6 pipeline under production conditions — scissor split, scroll-reactive uniforms, memory disposal. Data-driven token visualization via Canvas 2D proves the system can depict itself. Both scenes use OKLCH color bridge for visual consistency.

</domain>

<decisions>
## Implementation Decisions

### SignalMesh Geometry & Appearance
- IcosahedronGeometry with vertex displacement — organic yet structured, DU/TDR wireframe aesthetic
- Wireframe rendering with subtle solid fill at low opacity — terminal/technical aesthetic, not game-engine look
- ScrollTrigger drives rotation speed + vertex displacement amplitude — geometry "breathes" as you scroll
- Color sourced from `--color-primary` via `resolveColorAsThreeColor` — mesh matches site color identity

### Token Visualization
- Canvas 2D approach (not WebGL) — per SCN-02 requirement
- Visualizes core 5 colors + blessed spacing stops + typography scale — the essentials
- Placed on `/tokens` page — dedicated design system showcase
- Live update: re-reads CSS custom properties on theme change / mutation — proves tokens are source of truth

### Pipeline Validation & Integration
- SignalMesh placed in homepage hero section — high-visibility pipeline validation
- Disposal validation: `renderer.info.memory.geometries` logged to console on unmount
- WebGL unavailable fallback: static SVG silhouette of the mesh — same shape, no animation
- Performance budget: max 2ms per frame on mid-range GPU

### Claude's Discretion
- Exact icosahedron detail level and displacement shader specifics
- Token visualization layout grid sizing and spacing
- ScrollTrigger pin behavior (if any) for SignalMesh section
- SVG fallback generation approach (pre-rendered vs runtime)
- Canvas 2D rendering optimization (offscreen canvas, requestAnimationFrame throttle)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/signal-canvas.tsx` — singleton SignalCanvas renderer with scissor/viewport (Phase 6)
- `hooks/use-signal-scene.ts` — scene registration, IntersectionObserver, disposal (Phase 6)
- `lib/color-resolve.ts` — OKLCH→sRGB bridge, `resolveColorAsThreeColor` returns Three.Color (Phase 6)
- `lib/gsap-core.ts` + `lib/gsap-plugins.ts` — GSAP + ScrollTrigger infrastructure
- `components/animation/hero-mesh.tsx` — existing hero animation pattern (non-WebGL)
- `app/tokens/page.tsx` — tokens page where visualization will be placed

### Established Patterns
- `useSignalScene` hook handles full lifecycle: register → render → dispose
- GSAP ScrollTrigger wiring pattern used across multiple components
- `next/dynamic({ ssr: false })` for WebGL components via signal-canvas-lazy.tsx
- `prefers-reduced-motion` guard pattern (22+ components)

### Integration Points
- `app/page.tsx` — homepage hero section for SignalMesh placement
- `app/tokens/page.tsx` — tokens page for Canvas 2D visualization
- `app/globals.css` — CSS custom property source of truth for token values
- `components/layout/signal-canvas-lazy.tsx` — SSR-safe wrapper already in RootLayout

</code_context>

<specifics>
## Specific Ideas

- SignalMesh wireframe should evoke Detroit Underground album art — geometric, precise, slightly alien
- Token visualization should feel like a control panel reading its own diagnostics — the system depicting itself
- The "breathing" scroll behavior should be subtle — not a gimmick, more like the mesh is alive and responsive

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
