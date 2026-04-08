# Phase 29: Infrastructure Hardening - Context

**Gathered:** 2026-04-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Harden scroll, font, and Observer infrastructure against known Awwwards-class integration hazards. All Phase 30+ scroll-driven and WebGL work must build on proven foundations: fonts-ready refresh, overscroll suppression, GSAP Observer registration, Lenis hardening, PinnedSection primitive, and reduced-motion gate.

This phase delivers NO visual changes — it is pure infrastructure correctness.

</domain>

<decisions>
## Implementation Decisions

### PinnedSection API Design
- Minimal props surface: `children`, `className`, `scrollDistance` (number, in vh units), `id`
- ScrollTrigger config is hardcoded internally: `pin: true`, `scrub: 1`, `anticipatePin: 1`, `invalidateOnRefresh: true`
- Component lives at `components/animation/pinned-section.tsx`
- Test with a placeholder content block in isolation before Phase 31 consumes it
- Must respect `prefers-reduced-motion` — instant placement, no scroll-driven animation

### Lenis Hardening
- Add `ignoreMobileResize: true` to Lenis config in `components/layout/lenis-provider.tsx`
- DO NOT touch the rAF ticker pattern (`gsap.ticker.add(time * 1000)`) — load-bearing from v1.2, validated at Lighthouse 100/100
- Confirm `scrollerProxy` remains absent — correct for our Lenis + ScrollTrigger setup
- No other Lenis config changes

### Observer Consolidation
- Register GSAP `Observer` plugin in `lib/gsap-plugins.ts` alongside existing plugins (ScrollTrigger, SplitText, etc.)
- Verify MutationObserver disconnect in `lib/color-resolve.ts` — singleton pattern exists but needs confirmation that disconnect is called on unmount paths
- No consolidation of separate Observer instances needed — only one MutationObserver exists (color-resolve.ts)

### Reduced-Motion Verification (PF-06 Gate)
- Automated `matchMedia` mock tests for GSAP `initReducedMotion()` — verify `globalTimeline.timeScale(0)` fires
- Grep audit of all `components/animation/*.tsx` to confirm every GSAP-animated component either uses ScrollTrigger (covered by global timeScale) or has explicit reduced-motion handling
- 11 CSS `@media (prefers-reduced-motion: reduce)` queries already exist in `globals.css` — verify coverage is complete
- This is a gate: PF-06 must be confirmed before Phase 30 begins

### Claude's Discretion
- Test file structure and naming for PinnedSection isolation tests
- Whether to add `overscroll-behavior: none` on `html` only or `html, body`
- Implementation order within the phase (fonts-ready vs Observer vs Lenis — no dependencies between them)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Scroll Infrastructure
- `.planning/research/PITFALLS.md` — Font reflow hazards, ScrollTrigger pin-spacer gotchas, overscroll-behavior rationale
- `.planning/research/ARCHITECTURE.md` — PinnedSection pattern recommendation, Observer registration requirement

### Existing Code (modify in place)
- `lib/gsap-plugins.ts` — Add Observer registration here (lines 13-20)
- `components/layout/lenis-provider.tsx` — Add `ignoreMobileResize: true` here (line 23-27)
- `app/globals.css` — Add `overscroll-behavior: none` here
- `lib/color-resolve.ts` — Verify MutationObserver disconnect (lines 35-47)

### Requirements
- `.planning/REQUIREMENTS.md` §Performance — PF-04 (CLS=0), PF-05 (no new animation libs), PF-06 (reduced-motion)

### Prior Phase Context
- `.planning/phases/28-route-infrastructure/28-CONTEXT.md` — Route renames complete, routes stable

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/gsap-plugins.ts`: Central GSAP plugin registration — add Observer import + registration here
- `lib/gsap-core.ts`: Re-exports gsap + ScrollTrigger (may need Observer added to exports)
- `initReducedMotion()`: Already handles JS-side reduced-motion for GSAP — needs test coverage
- 11 CSS `@media (prefers-reduced-motion: reduce)` blocks in globals.css — broad coverage

### Established Patterns
- Animation components in `components/animation/` — 26 files, all use `'use client'`
- GSAP imports come from `lib/gsap-plugins.ts` or `lib/gsap-core.ts` — centralized registration
- Lenis provider wraps the app via `components/layout/lenis-provider.tsx` — single instance
- `color-resolve.ts` MutationObserver is a singleton (module-level variable, lazy init)

### Integration Points
- Root layout imports `gsap-plugins.ts` side-effect — fonts-ready hook goes in the same provider chain
- `components/layout/global-effects.tsx` — may be the right place for fonts-ready ScrollTrigger refresh
- PinnedSection will be consumed by Phase 31 (THESIS) and Phase 32 (SIGNAL section)

</code_context>

<specifics>
## Specific Ideas

- `document.fonts.ready.then(() => ScrollTrigger.refresh())` must fire in root layout, not per-component
- PinnedSection needs `anticipatePin: 1` to prevent visual jump when pin activates
- `overscroll-behavior: none` prevents iOS Safari rubber-band from flickering pinned sections
- Token-viz.tsx already uses `document.fonts.ready` but only for its own draw call — not a global pattern

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 29-infrastructure-hardening*
*Context gathered: 2026-04-07*
