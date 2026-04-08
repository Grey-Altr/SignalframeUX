# Project Context — SignalframeUX

> Auto-generated baseline for subagent context. Do not edit manually.
> Regenerate with /pde:new-milestone or /pde:new-project.

## Tech Stack
Next.js 15.3 (App Router, Turbopack), TypeScript 5.8, Tailwind CSS v4, CVA for variants, Radix UI via shadcn, GSAP 3.12 + ScrollTrigger, Lenis smooth scroll, Three.js (async chunk), OKLCH color space, Vercel

## Conventions
- CommonJS (.cjs) modules in bin/lib/
- Markdown-based state in .planning/
- Zero npm dependencies at plugin root
- Server Components default; 'use client' only when needed
- CVA `intent` as standard variant prop
- Zero border-radius everywhere
- SIGNAL/FRAME ordering (signal first, never FRAME/SIGNAL)

## Constraints
- Lighthouse 100/100 all categories
- Dark mode primary, light mode available
- WCAG AA minimum, keyboard-navigable
- Page weight < 200KB initial (excluding images)
- LCP < 1.0s, CLS = 0, TTI < 1.5s
- Zero border-radius — DU/TDR industrial edges
- No generic dark-mode aesthetic — borrow directly from DU/TDR visual language

## Current Milestone
v1.5 Redesign — 8 phases (28–35)
Status: Roadmap created, Phase 28 next

## Key Decisions
| Decision | Milestone | Outcome |
|----------|-----------|---------|
| Raw Three.js over React Three Fiber | v1.1 | ✓ Good — R3F's independent rAF conflicts with GSAP timeScale(0) |
| GSAP ticker as WebGL render driver | v1.1 | ✓ Good — single animation loop, reduced-motion kills everything |
| Module-level MutationObserver cache for signal uniforms | v1.2 | ✓ Good — zero getComputedStyle in GSAP ticker |
| Hole-in-the-donut SSR pattern for SignalframeProvider | v1.2 | ✓ Good — layout primitives stay Server Components |
| Pattern B for lazy P3 components (next/dynamic + ssr:false) | v1.3 | ✓ Good — Calendar/Menubar zero bundle cost |
| Sonner with unstyled:true for SFToast | v1.3 | ✓ Good — full DU/TDR aesthetic control |
| CSS animation for NavigationMenu flyout (not GSAP) | v1.3 | ✓ Good — FRAME component, Radix built-in data-motion |
| 8 phases (28-35) not 9 for v1.5 | v1.5 | Observer consolidation absorbed into Infrastructure Hardening |
| Lenis kept over ScrollSmoother | v1.5 | Validated at Lighthouse 100/100; ScrollSmoother migration risk unjustified |
| Zero new npm packages for v1.5 | v1.5 | GSAP 3.14.2 has SplitText mask, Observer, ScrambleText all free |

## Active Requirements
- [ ] **RA-01**: /components renamed to /inventory with redirect
- [ ] **RA-05**: Homepage 6-section architecture (ENTRY→THESIS→PROOF→INVENTORY→SIGNAL→ACQUISITION)
- [ ] **EN-01**: GLSL hero fills 100vh — IS the viewport
- [ ] **EN-02**: SIGNALFRAME//UX at 120px+ centered on shader
- [ ] **TH-01**: Scroll-driven layout 200–300vh
- [ ] **TH-02**: Manifesto phrases via GSAP pin/scrub
- [ ] **PR-01**: Full-viewport interactive SIGNAL/FRAME demo
- [ ] **IV-01**: Coded nomenclature SF//BTN-001
- [ ] **SG-01**: Full-viewport WebGL at max SIGNAL intensity
- [ ] **VL-01**: Ghost labels 200px+
- [ ] **SP-01**: /system specimen-style diagrams
- [ ] **PF-01**: Bundle under 150 KB gzip
- [ ] **PF-02**: Lighthouse 100/100 all categories
- [ ] **LR-01**: Awwwards submission package
