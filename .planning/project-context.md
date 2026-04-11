# Project Context — SignalframeUX

> Auto-generated baseline for subagent context. Do not edit manually.
> Regenerate with /pde:new-milestone or /pde:new-project.

## Tech Stack
Next.js 16, TypeScript 5.8, Tailwind CSS v4, CVA for variants, Radix UI via shadcn, GSAP 3.12 + ScrollTrigger, Lenis smooth scroll, Three.js (WebGL singleton), OKLCH color space, Vercel deployment

## Conventions
- pnpm package manager
- Markdown-based state in .planning/
- SF-wrapped components in components/sf/ with barrel export
- CVA `intent` as standard variant prop
- Server Components default; 'use client' only when needed
- Zero border-radius everywhere
- SIGNAL/FRAME ordering (signal first) in all docs/code/UI

## Constraints
- Lighthouse 100/100 A11y/BP/SEO (Performance 78 baseline accepted due to WebGL)
- WCAG AA minimum, keyboard-navigable
- Bundle: 50KB gzip library, 150KB gzip app shared chunks
- LCP < 1.0s, CLS = 0
- Zero new npm runtime dependencies in v1.7
- Static grain ceiling: never > 0.07 opacity (parametric escalation only)
- Safari backdrop-filter: literal values only, no var() references

## Current Milestone
v1.7 Tightening, Polish, and Aesthetic Push — 13 phases (44-56)
Status: Roadmap created, Phase 44 next

## Key Decisions
| Decision | Rationale |
|----------|-----------|
| Phase 48 (intensity bridge) before all effects | Architectural prerequisite — every effect reads derived properties |
| Parametric grain (not static raise) | SOTD research: static > 0.07 is anti-feature; escalate via intensity dial |
| @layer cascade for token bridge | Browser-native, no Style Dictionary needed for web-only consumers |
| Derived-property bridge for intensity | Per-effect perceptual curves solve the linear 0-1 dial problem |
| Particle field via singleton useSignalScene() | iOS Safari WebGL context limit (2-8); no second renderer |

## Active Requirements
- [ ] COP-01: Component count reconciled across all pages
- [ ] TBR-01: CD site imports signalframeux.css + cd-tokens.css override
- [ ] TBR-02: @layer cascade: sf.tokens → consumer.overrides
- [ ] TGH-01: Light mode muted-foreground passes WCAG AA
- [ ] TGH-02: 15 hardcoded durations → token references
- [ ] SIG-01: updateSignalDerivedProps(intensity) in global-effects.tsx
- [ ] SIG-02: VHS scales with --signal-intensity
- [ ] GRN-01: Grain baseline 0.03-0.05; parametric escalation
- [ ] GRN-02: useIdleEscalation(thresholds[]) with 3 phases
- [ ] VHS-01: Chromatic aberration scaled by derived intensity
- [ ] HLF-01: CSS-only halftone dot pattern
- [ ] PTL-01: WebGL particles via useSignalScene() singleton
- [ ] VRG-01: Chromatic installed as devDependency
- [ ] PRF-01: Lighthouse A11y/BP/SEO remain 100/100/100
