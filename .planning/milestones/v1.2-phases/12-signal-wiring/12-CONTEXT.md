# Phase 12: SIGNAL Wiring - Context

**Gathered:** 2026-04-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Wire SignalOverlay CSS custom properties to WebGL scene uniforms (GLSLHero, SignalMesh) via cached reads, and activate scroll-driven entrance motion (SignalMotion) on homepage showcase sections.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/animation/glsl-hero.tsx` — GLSL hero shader scene
- `components/animation/signal-mesh.tsx` — Signal mesh WebGL scene
- `components/animation/signal-motion.tsx` — ScrollTrigger-based entrance animation component
- `components/animation/signal-overlay.tsx` — Writes `--signal-intensity`, `--signal-speed`, `--signal-accent` to `:root`
- `lib/color-resolve.ts` — Existing CSS var resolution with MutationObserver cache pattern
- `app/globals.css` — Now has `--signal-*` defaults (Phase 10 FND-01)

### Established Patterns
- GSAP 3.12 + ScrollTrigger for scroll-driven animation
- MutationObserver in `color-resolve.ts` for CSS var change detection
- `getComputedStyle` currently used in 4 files — must avoid in GSAP ticker callbacks

### Integration Points
- `glsl-hero.tsx` — needs to read `--signal-intensity`, `--signal-speed` as WebGL uniforms
- `signal-mesh.tsx` — needs to read `--signal-intensity`, `--signal-speed`, `--signal-accent` as uniforms
- Homepage sections — MANIFESTO, SIGNAL/FRAME, API, COMPONENTS need SignalMotion wrapping
- `prefers-reduced-motion` — SignalMotion must respect and disable without errors

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
