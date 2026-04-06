# Project Context — SignalframeUX

> Auto-generated baseline for subagent context. Do not edit manually.
> Regenerate with /pde:new-milestone or /pde:new-project.

## Tech Stack
TypeScript · Next.js 15.3 (App Router, Turbopack) · React 19.1 · Tailwind CSS v4 (@theme in globals.css) · CVA for variants · Radix UI via shadcn → SF-wrapped layer · GSAP 3.12 + ScrollTrigger · Lenis · OKLCH color space · Lucide React · Vercel · Raw Three.js (not R3F) · Web Audio API · Vibration API

## Conventions
- SF-wrapped components in `sf/` with barrel export from `sf/index.ts`
- shadcn base in `ui/` (don't modify), SF layer in `sf/` (PascalCase with SF prefix)
- Animation components in `components/animation/`, blocks in `components/blocks/`
- `cn()` from `lib/utils.ts` for class merging
- Server Components default; `'use client'` only when needed
- All tokens defined in `app/globals.css`
- Zero border-radius everywhere
- Dual-layer: FRAME = structural, SIGNAL = expressive
- WebGL via raw Three.js + `next/dynamic({ ssr: false })`
- GSAP ticker as WebGL render driver (single animation loop)
- pnpm over npm

## Constraints
- Lighthouse 100/100 all categories
- WCAG AA minimum, keyboard-navigable
- LCP < 1.0s, CLS = 0, TTI < 1.5s
- Page weight < 200KB initial (excluding images)
- Dark mode primary, light mode available
- No skeuomorphism, no fake depth, no decorative gradients
- No R3F (rAF conflicts with GSAP timeScale(0)), no Lottie
- Zero border-radius — DU/TDR industrial edges

## Current Milestone
Tech Debt Sweep (v1.2) — 6 phases (10–15)
Status: Roadmap ready, Phase 10 next

## Key Decisions
| Decision | Milestone | Outcome |
|----------|-----------|---------|
| Raw Three.js over React Three Fiber | v1.1 | ✓ Good — R3F's independent rAF conflicts with GSAP timeScale(0) |
| GSAP ticker as WebGL render driver | v1.1 | ✓ Good — single animation loop, reduced-motion kills everything |
| Single-pass GLSL hero with integrated dither | v1.1 | ✓ Good — avoided WebGLRenderTarget two-pass complexity |
| Document-level event listener for audio/haptics | v1.1 | ✓ Good — single listener vs modifying every SF component |
| pnpm over npm | v1.1 | ✓ Good — project convention, all plans auto-corrected |

## Active Requirements
- [ ] **FND-01**: --signal-intensity, --signal-speed, --signal-accent CSS defaults in globals.css
- [ ] **FND-02**: SFSection bgShift prop type boolean → "white" | "black"
- [ ] **INT-03**: SignalMotion wraps at least 3 showcase sections on homepage
- [ ] **INT-04**: SignalOverlay CSS vars read by WebGL scenes via cached module-level reads
- [x] **INT-01**: Reference page nav-height spacing + NEXT_CARDS in SFSection
- [ ] **DX-04**: registry.json complete (34 components + sf-theme)
- [ ] **DX-05**: createSignalframeUX(config) factory with SSR-safe provider
- [ ] **STP-01**: Filter/tab/scroll state persistence via sessionStorage
- [ ] **DOC-01**: SUMMARY frontmatters + stale checkboxes corrected
