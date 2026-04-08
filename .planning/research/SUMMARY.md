# Project Research Summary

**Project:** SignalframeUX v1.5 Redesign — "Designed Artifact"
**Domain:** Awwwards SOTD-level design system showcase site
**Researched:** 2026-04-07
**Confidence:** HIGH

## Executive Summary

SignalframeUX v1.5 is an additive redesign of a mature Next.js 15.3 / GSAP 3.14.2 / Three.js codebase — not a rebuild. Every capability required — scroll-driven typographic animation, multi-scene WebGL, interactive layer separation, coded nomenclature catalog, specimen token visualization — is achievable without adding a single new npm package.

SignalframeUX has zero direct competitors in the Awwwards SOTD corridor with DU/TDR aesthetic applied to a design system. The path to SOTD runs through one unforgettable signature interaction (200-300vh scroll manifesto), one site-wide craft detail (magenta crosshair cursor), and hard-cut mechanical color transitions.

The primary technical risk is three known integration hazards: Lenis + GSAP pin on iOS Safari, multiple WebGL contexts on mobile, and LCP suppression from opacity-from-zero animations. All preventable with infrastructure setup before features are built.

## Stack Additions

**Zero new runtime dependencies required.**

- GSAP 3.14.2 already includes SplitText `mask`, ScrollTrigger, Observer, ScrambleText — all free since v3.13
- SignalCanvas scissor singleton already supports N concurrent WebGL scenes
- Lenis integration validated at Lighthouse 100/100; do NOT migrate to ScrollSmoother
- One activation needed: register `Observer` in `lib/gsap-plugins.ts`

## Feature Table Stakes (SOTD Gate)

| Feature | Priority | Complexity | Notes |
|---------|----------|------------|-------|
| 100vh above-fold lock | P1 | LOW | Mandatory SOTD entry criterion |
| Scroll-driven manifesto (200-300vh) | P1 | HIGH | Zero Awwwards precedent in design system category |
| Magenta crosshair cursor | P1 | LOW | Highest impact/complexity ratio |
| Hard-cut section transitions | P1 | MEDIUM | Mechanical, not gradient; `onEnter`/`onLeave` |
| ScrambleText route entry | P1 | LOW | Complete v1.3 partial implementation |
| Coded nomenclature catalog | P1 | MEDIUM | DU release-catalog grammar; no Awwwards precedent |
| Staggered grid entry | P1 | LOW | ScrollTrigger batch on all content grids |
| Hover state audit | P1 | LOW | Asymmetric 100ms/400ms on every interactive element |

**P2 (post-validation):** Interactive FRAME/SIGNAL demo, specimen-style TokenViz, reduced-motion fallback demo

**Anti-features:** Aurora/gradient backgrounds, glassmorphism, 20+ SIGNAL effects, rounded corners

## Architecture Approach

- SignalCanvas singleton handles all WebGL scenes via scissor/viewport split — no new renderers
- Route rename via `next.config.ts` redirects (308 permanent)
- PinnedSection component: `pin:true, scrub:1, anticipatePin:1, invalidateOnRefresh:true`
- 6-section homepage slots into existing `data-anim` / `data-bg-shift` system
- MutationObserver must be consolidated into singleton before 3rd WebGL scene

## Watch Out For

1. **iOS Safari address bar** — `ignoreMobileResize: true` from day one
2. **WebGL context limit** — Safari iOS enforces 2-8 contexts; single renderer mandatory
3. **LCP suppression** — `opacity: 0` start suppresses LCP; use `opacity: 0.01` or `clip-path`
4. **Font reflow** — `document.fonts.ready.then(ScrollTrigger.refresh)` in root layout
5. **Lenis + pin flicker** — exact ticker pattern is load-bearing; no `scrollerProxy`

## Suggested Phase Order

1. Route Infrastructure — redirects before rename
2. Infrastructure Hardening — fonts-ready, overscroll-behavior, Lenis audit
3. SignalCanvas Observer Consolidation — before 3rd WebGL scene
4. PinnedSection + SignalField — new primitives tested in isolation
5. Homepage Reconstruction — 6 sections, manifesto, 3 WebGL scenes
6. Global Interaction Layer — cursor, ScrambleText, hover audit
7. Coded Nomenclature Catalog — data schema before UI
8. Subpage Redesigns — incremental, bundle gate per subpage
9. P2 Features — FRAME/SIGNAL demo, specimen TokenViz

## Research Gaps

- **Manifesto copy:** Engineering resolved, text content not determined. Finalize before Phase 5.
- **SF//[CAT]-NNN schema:** Validate 6 category abbreviations against all 49 registry components.
- **Physical iOS Safari testing:** Mandatory after Phase 5; simulators do not replicate address bar.

---

*Research completed: 2026-04-07 | Ready for roadmap: yes*
