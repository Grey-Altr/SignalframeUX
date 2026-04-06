# Phase 6: Generative SIGNAL Foundation - Context

**Gathered:** 2026-04-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Singleton WebGL infrastructure — SignalCanvas renderer, OKLCH-to-sRGB color bridge, reduced-motion fallback, SSR-safe dynamic imports, bundle isolation. No generative scenes; only the plumbing that scenes will plug into.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Key technical decisions:
- Three.js vs @react-three/fiber approach for SignalCanvas
- Singleton pattern implementation (portal vs context provider)
- Color-resolve API surface (sync vs async, caching strategy)
- Bundle splitting strategy for Three.js async chunk
- Reduced-motion detection method (CSS media query vs JS matchMedia)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/utils.ts` — `cn()` class merging utility
- `lib/gsap-core.ts`, `lib/gsap-plugins.ts` — established animation infrastructure
- `components/layout/global-effects.tsx` — global effect mounting pattern
- `components/layout/lenis-provider.tsx` — provider pattern in layout
- `hooks/use-scramble-text.ts` — example of reduced-motion-aware hook

### Established Patterns
- OKLCH color tokens defined in `app/globals.css` (18 files reference them)
- `prefers-reduced-motion` already handled in 22 components — well-established pattern
- Dynamic lazy loading used in `global-effects-lazy.tsx`
- `'use client'` directive used selectively for interactive components
- GSAP + ScrollTrigger for scroll-driven animation

### Integration Points
- `app/layout.tsx` — RootLayout where SignalCanvas mounts (alongside LenisProvider, GlobalEffectsLazy, PageAnimations)
- `app/globals.css` — OKLCH token source of truth for color-resolve bridge
- `components/animation/` — 17 animation components that may later interact with canvas
- `package.json` — no Three.js/R3F dependencies yet (clean install needed)

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
