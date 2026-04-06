# SignalframeUX — Design System for Culture Division

## Vision

A high-performance design system combining deterministic structure (FRAME) and generative expression (SIGNAL). Built for product design engineers who demand both precision and craft. The flagship implementation is a portfolio website that serves as both a case study and living reference.

## Product Type

Software — design system library + component library (TypeScript/React)

## Tech Stack

- **Language:** TypeScript
- **Framework:** Next.js 15.3 (App Router, Turbopack)
- **UI:** React, Tailwind CSS v4, CVA for variants, Radix UI via shadcn
- **Animation:** GSAP 3.12 + ScrollTrigger, Lenis smooth scroll
- **Design System:** SignalframeUX — housed at ~/code/projects/SignalframeUX
- **Deployment:** Vercel
- **Color Space:** OKLCH throughout

## Core Value

The dual-layer model: FRAME provides deterministic, legible, semantic structure. SIGNAL provides generative, parametric, animated expression. The signal runs through the frame.

## Requirements

### Validated

- ✓ Token system locked and enforced (spacing, typography, layout, colors, animation) — v1.0
- ✓ 5 SF layout primitives enforce tokens by construction (SFContainer, SFSection, SFStack, SFGrid, SFText) — v1.0
- ✓ SIGNAL layer authored with timing specs, CSS fallbacks, and mobile behavior definitions — v1.0
- ✓ Hero at 1440x900 is standalone SOTD jury moment with sub-500ms first motion — v1.0
- ✓ Crafted error/404 pages and 3 empty states as first-class design moments — v1.0
- ✓ Reduced-motion experience QA'd as intentional alternative design — v1.0
- ✓ DX contract: SCAFFOLDING.md, JSDoc 28/28 components, import boundary documented — v1.0
- ✓ Theme toggle GSAP guard prevents OKLCH/inline color conflicts — v1.0

### Active

- [ ] Audio feedback palette (Web Audio API) — SIG-06
- [ ] Haptic feedback (Vibration API) — SIG-07
- [ ] Idle state animation (grain drift, color pulse) — SIG-08
- [ ] registry.json for AI/CLI component installation — DX-04
- [ ] createSignalframeUX(config) + useSignalframe() API — DX-05
- [ ] Session state persistence (filters, scroll, tabs) — STP-01
- [ ] Portfolio pages consuming SFSection, SFStack, SFGrid primitives
- [ ] data-anim="stagger" applied to production grid blocks

### Out of Scope

- Mobile app — web-first, responsive design handles mobile
- Backend API — design system is frontend-only
- CMS integration — MDX + JSON for content

## Context

**Shipped v1.0 Craft & Feedback** (2026-04-06):
- 115 files modified, +12,440 lines across 82 commits
- 29 SF-wrapped components (24 interactive + 5 layout primitives)
- Token system: 9 blessed spacing stops, 5 semantic typography aliases, 5 layout tokens, tiered color palette
- SIGNAL layer: ScrambleText, asymmetric hover (100ms/400ms), 34ms hard-cut, canvas cursor, stagger batch
- DX: SCAFFOLDING.md (337 lines), JSDoc coverage, DX-SPEC.md with deferred interface sketches
- SIGNAL-SPEC.md (259 lines) documenting all effects with timing, fallback, mobile, reduced-motion

**Known tech debt:**
- 3 primitives (SFSection, SFStack, SFGrid) exported but awaiting first production consumer
- data-anim="stagger" wired but no block uses it yet
- Both resolve when portfolio pages are built

## Key Decisions

| Decision | Milestone | Outcome |
|----------|-----------|---------|
| Dual-layer FRAME/SIGNAL model | v1.0 | ✓ Good — clean separation of structure and expression |
| OKLCH color space throughout | v1.0 | ✓ Good — perceptually uniform, canvas bridge works via probe |
| Zero border-radius everywhere | v1.0 | ✓ Good — defines the DU/TDR industrial aesthetic |
| CVA `intent` as standard variant prop | v1.0 | ✓ Good — consistent API across all SF components |
| Deferred SIG-06/07/08 to post-v1.0 | v1.0 | — Pending — audio/haptic/idle remain as interface sketches |
| Server Components default for primitives | v1.0 | ✓ Good — no 'use client' on any layout primitive |

## Constraints

- Lighthouse 100/100 all categories
- Dark mode primary, light mode available
- WCAG AA minimum, keyboard-navigable
- Page weight < 200KB initial (excluding images)
- LCP < 1.0s, CLS = 0, TTI < 1.5s
- Zero border-radius — DU/TDR industrial edges
- No generic dark-mode aesthetic — borrow directly from DU/TDR visual language

## Relationship to Culture Division

SignalframeUX is the design system for Culture Division. It powers the portfolio (first consumer), cdOS (internal tool, future), and CD-Operator (studio role, future).

- **SignalframeUX location:** ~/code/projects/SignalframeUX
- **Portfolio location:** ~/code/projects/portfolio (to be created)

---

*Last updated: 2026-04-06 after v1.0 Craft & Feedback milestone*
