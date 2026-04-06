# Project Context — SignalframeUX

> Auto-generated baseline for subagent context. Do not edit manually.
> Regenerate with /pde:new-milestone or /pde:new-project.

## Tech Stack
TypeScript · Next.js 15.3 (App Router, Turbopack) · React 19.1 · Tailwind CSS v4 (@theme in globals.css) · CVA for variants · Radix UI via shadcn → SF-wrapped layer · GSAP 3.12 + ScrollTrigger · Lenis · OKLCH color space · Lucide React · Vercel

## Conventions
- SF-wrapped components in `sf/` with barrel export from `sf/index.ts`
- shadcn base in `ui/` (don't modify), SF layer in `sf/` (PascalCase with SF prefix)
- Animation components in `components/animation/`, blocks in `components/blocks/`
- `cn()` from `lib/utils.ts` for class merging
- Server Components default; `'use client'` only when needed
- All tokens defined in `app/globals.css`
- Zero border-radius everywhere
- Dual-layer: FRAME = structural, SIGNAL = expressive
- GSAP modular split: gsap-core (~8KB), gsap-split (~35KB), gsap-draw (~15KB), gsap-plugins (~100KB lazy)
- WebGL via raw Three.js (not R3F) + `next/dynamic({ ssr: false })`

## Constraints
- Lighthouse 100/100 all categories
- WCAG AA minimum, keyboard-navigable
- LCP < 1.0s, CLS = 0, TTI < 1.5s
- Page weight < 200KB initial (excluding images)
- Dark mode primary, light mode available
- No JavaScript required for core content (progressive enhancement)
- No skeuomorphism, no fake depth, no decorative gradients
- No R3F (rAF conflicts with GSAP scalar), no Lottie, no gradient meshes/glassmorphism

## Current Milestone
v1.1 Generative Surface — 4 phases (6–9)
Status: Roadmap created, planning Phase 6

## Key Decisions
| Decision | Milestone | Outcome |
|----------|-----------|---------|
| Dual-layer FRAME/SIGNAL model | v1.0 | ✓ Good — clean separation |
| OKLCH color space throughout | v1.0 | ✓ Good — perceptually uniform |
| Zero border-radius everywhere | v1.0 | ✓ Good — defines aesthetic |
| CVA `intent` as standard variant prop | v1.0 | ✓ Good — consistent API |
| Server Components default for primitives | v1.0 | ✓ Good |
| Raw Three.js over R3F | v1.1 | — Pending |
| Singleton SignalCanvas renderer | v1.1 | — Pending |
| GSAP ticker as WebGL render driver | v1.1 | — Pending |
| OGL for lightweight shader effects | v1.1 | — Pending |

## Active Requirements
- [ ] **GEN-01**: Singleton SignalCanvas renderer
- [ ] **GEN-02**: OKLCH→sRGB color bridge utility
- [ ] **GEN-03**: useSignalScene hook (disposal + GSAP ticker + IntersectionObserver)
- [ ] **GEN-04**: WebGL dynamic import + bundle validation
- [ ] **GEN-05**: Reduced-motion guard + ARIA for canvas
- [ ] **SIG-06**: Audio feedback palette (Web Audio API)
- [ ] **SIG-07**: Haptic feedback (Vibration API)
- [ ] **SIG-08**: Idle state animation
- [ ] **SIG-09**: [data-cursor] activation
- [ ] **SCN-01**: SignalMesh (first 3D)
- [ ] **SCN-02**: Token visualization (Canvas 2D)
- [ ] **SCN-03**: ASCII/dithering shader
- [ ] **SCN-04**: Custom GLSL hero shader
- [ ] **INT-01**: SF primitive consumers
- [ ] **INT-02**: Stagger on grids
- [x] **INT-03**: SignalMotion component
- [x] **INT-04**: Live SIGNAL overlay
