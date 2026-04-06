# Phase 3: SIGNAL Expression - Context

**Gathered:** 2026-04-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Author, spec, and progressively enhance the SIGNAL layer. Every effect gets a timing spec, a CSS fallback, and a mobile behavior definition. This phase implements SIG-01 through SIG-05 (core behaviors), SIG-09 (signature cursor), and SIG-10 (mobile spec). SIG-06/07/08 (audio, haptic, idle) are formally deferred to post-v1.0. No FRAME token changes — consume Phase 1+2 tokens and primitives.

</domain>

<decisions>
## Implementation Decisions

### Core SIGNAL Behaviors (SIG-01 through SIG-05)
- ScrambleText fires via GSAP ScrollTrigger `onEnter` — triggers when heading enters viewport, consistent with existing scroll-reveal pattern
- Asymmetric hover timing via CSS `transition` with separate in/out durations: `transition: all var(--duration-fast) ease` base, `&:hover { transition-duration: var(--duration-slow) }` — 100ms in, 400ms out
- Hard-cut section transitions: `opacity: 0→1` with `duration-instant` (34ms) replacing any existing fade transitions on section boundaries
- `[data-anim]` CSS fallback: base CSS rule `[data-anim] { opacity: 1 }`, GSAP sets `opacity: 0` on init — content visible by default if GSAP fails
- Staggered grid entry on all `SFGrid` instances and `component-grid.tsx` — 40ms stagger via GSAP ScrollTrigger batch on `[data-anim="stagger"]` children

### Signature Cursor (SIG-09)
- Canvas overlay implementation — magenta crosshair rendered on fixed-position canvas with particle trail as fading dots
- Only active on sections with `[data-cursor]` attribute
- Color: `var(--color-primary)` for crosshair, fading alpha for trail particles
- Hidden on mobile (< md breakpoint)

### Mobile Signal Behavior (SIG-10)
- Spec document only this phase — define which effects collapse and their static fallbacks
- Effects that collapse on mobile: cursor (hidden), VHS grain (reduced opacity), circuit dividers (static SVG), hero-mesh (static frame)
- Effects that persist on mobile: ScrambleText, hover timing, staggered grid entry, hard-cut transitions

### Deferred to Post-v1.0
- SIG-06 (audio feedback) — Web Audio API synthesized tones, deferred per execution strategy
- SIG-07 (haptic feedback) — Vibration API patterns, deferred per execution strategy
- SIG-08 (idle animation) — grain drift / color pulse on inactive page, deferred per execution strategy

### Claude's Discretion
- GSAP ScrollTrigger configuration details (scrub, markers, pin behavior)
- Canvas particle system parameters (particle count, decay rate, trail length)
- Exact mobile breakpoint behavior for each effect beyond the spec categories
- Reduced-motion implementation details (`prefers-reduced-motion` query scope)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- 16 animation components in `components/animation/` — ScrambleText, scroll-reveal, hero-mesh, vhs-overlay, circuit-divider already exist
- GSAP split: `lib/gsap-core.ts` (lightweight) + `lib/gsap-plugins.ts` (full ScrollTrigger, etc.)
- Motion tokens in globals.css: `--duration-instant` through `--duration-glacial`, `--ease-default`, `--ease-hover`, `--ease-spring`
- `page-animations.tsx` in layout — handles page-level animation orchestration
- Existing `[data-anim]` usage across blocks and pages

### Established Patterns
- GSAP animations use `useGSAP` hook or `gsap.context()` for cleanup
- ScrollTrigger for scroll-based reveals
- `next/dynamic` for lazy-loading animation components (GlobalEffects)
- VHS overlay tokens: `--sf-vhs-crt-opacity`, `--sf-vhs-noise-opacity`

### Integration Points
- `components/layout/page-animations.tsx` — route-level animation controller
- `components/blocks/*.tsx` — blocks need `data-anim` and `data-cursor` attributes
- `app/globals.css` — CSS fallback rules added here
- `components/layout/global-effects.tsx` — lazy-loaded global visual effects

</code_context>

<specifics>
## Specific Ideas

No specific requirements beyond the locked decisions above. Follow DU/TDR aesthetic — sharp, controlled, slightly tense motion. No soft fades, no decorative easing.

</specifics>

<deferred>
## Deferred Ideas

- SIG-06: Audio feedback palette (Web Audio API) — post-v1.0
- SIG-07: Haptic feedback (Vibration API) — post-v1.0
- SIG-08: Idle state animation (grain drift, color pulse) — post-v1.0

</deferred>
