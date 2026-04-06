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

## Constraints
- Lighthouse 100/100 all categories
- WCAG AA minimum, keyboard-navigable
- LCP < 1.0s, CLS = 0, TTI < 1.5s
- Page weight < 200KB initial (excluding images)
- Dark mode primary, light mode available
- No JavaScript required for core content (progressive enhancement)
- No skeuomorphism, no fake depth, no decorative gradients

## Current Milestone
v1.0 Craft & Feedback — 5 phases
Status: Phase 1 not started

## Key Decisions
- FRAME = structure, SIGNAL = expression (the signal runs through the frame)
- Awwwards SOTD target (>= 8.0 weighted)
- Three pillars: Foundation, Feeling, Fluency
- AI DX is first-class — "as easy as feeling"
- Phase order: FRAME tokens → primitives → SIGNAL → ATF → DX
- 40% FRAME (strict) / 60% SIGNAL+ATF (iteration budget)
- Enhanced Flat Design inspired by Detroit Underground + The Designers Republic

## Active Requirements
- [ ] FRM-01: Spacing blessed stops enforced
- [ ] FRM-02: Semantic typography aliases
- [ ] FRM-03: Layout tokens defined
- [ ] FRM-04: CSS fallback values on all tokens
- [ ] FRM-05: Color palette tiered and frozen
- [ ] FRM-06: VHS tokens namespaced to --sf-vhs-*
- [ ] FRM-07: CVA intent standardization
- [ ] FRM-08: Print media styles
- [ ] PRM-01–06: Six SF primitives
- [ ] SIG-01–10: Signal expression layer
- [ ] ATF-01–06: Above-the-fold lock
- [ ] DX-01–05: DX contract
- [ ] STP-01–02: State persistence
