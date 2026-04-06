# Project Context — SignalframeUX

> Auto-generated baseline for subagent context. Do not edit manually.
> Regenerate with /pde:new-milestone or /pde:new-project.

## Tech Stack
TypeScript · Next.js 15.3 (App Router, Turbopack) · React 19.1 · Tailwind CSS v4 (@theme in globals.css) · CVA for variants · Radix UI via shadcn → SF-wrapped layer · GSAP 3.12 + ScrollTrigger · Lenis · OKLCH color space · Lucide React · Vercel · Raw Three.js (not R3F) · Web Audio API · Vibration API · Sonner · shiki/core (v1.4+, server-only RSC)

## Conventions
- SF-wrapped components in `sf/` with barrel export from `sf/index.ts`
- shadcn base in `ui/` (don't modify), SF layer in `sf/` (PascalCase with SF prefix)
- Animation components in `components/animation/`, blocks in `components/blocks/`
- `cn()` from `lib/utils.ts` for class merging
- Server Components default; `'use client'` only when needed
- All tokens defined in `app/globals.css`
- Zero border-radius everywhere — explicit `rounded-none` on Radix sub-elements
- Dual-layer: FRAME = structural, SIGNAL = expressive
- CVA `intent` as standard variant prop (never `variant`, `type`, `color`)
- Barrel `sf/index.ts` must remain directive-free (no `'use client'`)
- Same-commit rule: component file + barrel export + registry entry in one commit
- pnpm over npm

## Constraints
- Lighthouse 100/100 all categories
- WCAG AA minimum, keyboard-navigable
- LCP < 1.0s, CLS = 0, TTI < 1.5s
- Page weight < 200KB initial (excluding images), gate at 150KB
- Dark mode primary, light mode available
- No skeuomorphism, no fake depth, no decorative gradients
- No R3F (rAF conflicts with GSAP timeScale(0)), no Lottie
- Zero border-radius — DU/TDR industrial edges

## Current Milestone
Feature Complete (v1.4) — 6 phases (21–26)
Status: Roadmap defined, ready for Phase 21 planning

## Key Decisions
| Decision | Milestone | Outcome |
|----------|-----------|---------|
| Hole-in-the-donut SSR pattern for SignalframeProvider | v1.2 | ✓ Good — layout primitives stay Server Components |
| Pattern B for lazy P3 components (next/dynamic + ssr:false) | v1.3 | ✓ Good — Calendar/Menubar zero bundle cost |
| SFToggleGroup imports Radix directly (not through ui/ base) | v1.3 | ✓ Good — avoids variant→intent CVA remapping conflict |
| CSS animation for NavigationMenu flyout (not GSAP) | v1.3 | ✓ Good — FRAME component, Radix provides built-in data-motion |
| Phase ordering dependency-forced for v1.4 | v1.4 | tech debt → tokens → components → detail data → detail views → verification |
| ComponentDetail as DOM sibling of Flip grid | v1.4 | Child position corrupts GSAP Flip state captures |
| shiki/core only (not bundle/web or bundle/full) | v1.4 | ~50-80 KB async server-only vs 695 KB or 6.4 MB |
| Inline expand for detail views (not full page or drawer) | v1.4 | Grid context preserved; GSAP FLIP pattern-consistent |

## Active Requirements
- [ ] **TD-01**: MutationObserver disconnect on unmount
- [ ] **TD-02**: readSignalVars isNaN() guard
- [ ] **TD-03**: lenis.scrollTo replaces window.scrollTo
- [ ] **TD-04**: Duplicate TOAST entries resolved
- [ ] **TK-01**: success/warning tokens into @theme
- [ ] **TK-02**: Elevation absence documented
- [ ] **TK-03**: Sidebar/chart tokens documented
- [ ] **TK-04**: WebGL color bridge audited
- [ ] **CMP-01**: SFDrawer (vaul, lazy)
- [ ] **CMP-02**: SFHoverCard (FRAME-only)
- [ ] **CMP-03**: SFInputOTP
- [ ] **CMP-04**: SFInputGroup wrapper
- [ ] **DV-01**: component-registry.ts data map
- [ ] **DV-02**: api-docs.ts full coverage
- [ ] **DV-03**: code-highlight.ts (shiki RSC)
- [ ] **DV-04**: ComponentDetail panel (3 tabs, GSAP)
- [ ] **DV-05**: Variant grid (live SF renders)
- [ ] **DV-06**: Props table
- [ ] **DV-07**: Code tab + copy-to-clipboard
- [ ] **DV-08**: FRAME/SIGNAL badge + pattern tier
