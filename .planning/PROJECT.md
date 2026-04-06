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
- ✓ Singleton WebGL infrastructure (SignalCanvas, useSignalScene, color-resolve) — v1.1
- ✓ Multi-sensory SIGNAL activation: audio (Web Audio), haptics (Vibration API), idle animation — v1.1
- ✓ SignalMesh + TokenViz validate full generative pipeline under production conditions — v1.1
- ✓ GLSL procedural hero with integrated Bayer 4×4 ordered dither — v1.1
- ✓ All 5 pages consume SF layout primitives (32 SFSection instances, zero raw div wrappers) — v1.1
- ✓ [data-cursor] activated on all showcase sections — v1.1
- ✓ data-anim="stagger" on production grid blocks — v1.1
- ✓ Performance budget maintained with Three.js in async chunk (102 kB initial) — v1.1

- ✓ SignalMotion scroll-driven animation on 4 homepage sections — v1.2
- ✓ SignalOverlay CSS→WebGL uniform bridge via module-level MutationObserver cache — v1.2
- ✓ CSS var defaults (--signal-intensity, --signal-speed, --signal-accent) in globals.css — v1.2
- ✓ SFSection bgShift typed "white" | "black" (was boolean) — v1.2
- ✓ Reference page nav clearance + NEXT_CARDS in SFSection — v1.2
- ✓ Full 33-item shadcn CLI registry with meta.layer/meta.pattern fields — v1.2
- ✓ createSignalframeUX(config) factory + useSignalframe() hook with SSR-safe provider — v1.2
- ✓ Session persistence: useSessionState + useScrollRestoration hooks (hydration-safe) — v1.2
- ✓ Documentation cleanup: SUMMARY frontmatter, archive checkboxes, SCAFFOLDING.md API contract — v1.2

### Active

(No active requirements — planning next milestone)

### Out of Scope

- Mobile app — web-first, responsive design handles mobile
- Backend API — design system is frontend-only
- CMS integration — MDX + JSON for content
- React Three Fiber — excluded; R3F's independent rAF loop conflicts with GSAP globalTimeline.timeScale(0)
- Lottie — JSON-replayed animation, not generative/procedural; incompatible with DU/TDR aesthetic

## Current Milestone: v1.3 Component Expansion

**Goal:** Build a comprehensive, production-complete component library — every UI pattern a product engineer would reach for, prepared for edge cases, filtered through real consumer use cases.

**Target features:**
- Precondition infrastructure (SF wrapper checklist, performance baseline, ComponentsExplorer categories, prop vocabulary)
- P1 components: Accordion, Toast, Progress, AlertDialog, Avatar, Breadcrumb, EmptyState
- P2 components: NavigationMenu, Pagination, Stepper, StatusDot, ToggleGroup
- P3 registry-only: Calendar, Menubar (lazy-loaded, heavy deps annotated)
- SIGNAL layer integration on animation-eligible components (Progress fill, Toast slide, Accordion stagger)
- Full registry + SCAFFOLDING.md coverage for every addition

## Context

**Shipped v1.1 Generative Surface** (2026-04-06):
- 26 files modified, +2,388 lines across 20 feat commits
- Singleton WebGL infrastructure: SignalCanvas, useSignalScene, color-resolve with TTL cache
- Multi-sensory SIGNAL: audio feedback (Web Audio square wave), haptic feedback (Vibration API), idle animation (8s grain drift + OKLCH lightness pulse)
- Two generative scenes: SignalMesh (IcosahedronGeometry + vertex displacement) and TokenViz (Canvas 2D self-depicting visualization)
- GLSL procedural hero shader with FBM noise, geometric grid lines, and integrated Bayer 4×4 ordered dither
- SF layout primitives consumed across all 5 pages (32 SFSection instances)
- Three.js in async chunk (102 kB initial shared bundle)

**Shipped v1.0 Craft & Feedback** (2026-04-06):
- 115 files modified, +12,440 lines across 82 commits
- 29 SF-wrapped components (24 interactive + 5 layout primitives)
- Token system: 9 blessed spacing stops, 5 semantic typography aliases, 5 layout tokens, tiered color palette
- SIGNAL layer: ScrambleText, asymmetric hover (100ms/400ms), 34ms hard-cut, canvas cursor, stagger batch
- DX: SCAFFOLDING.md (337 lines), JSDoc coverage, DX-SPEC.md with deferred interface sketches

**Shipped v1.2 Tech Debt Sweep** (2026-04-06):
- 124 files modified, +8,639 lines across 6 phases, 9 plans
- All v1.0/v1.1 tech debt closed: CSS var defaults, bgShift type fix, reference page layout
- CSS→WebGL signal bridge via MutationObserver cache (zero getComputedStyle in ticker)
- SignalMotion scroll-driven entrance on 4 homepage sections
- Full shadcn CLI registry: 33 items with meta.layer/meta.pattern
- createSignalframeUX config factory + SSR-safe SignalframeProvider (hole-in-the-donut)
- Session persistence: useSessionState + useScrollRestoration hooks (hydration-safe)
- Documentation: 30 SUMMARY frontmatters normalized, 14 stale archive checkboxes fixed, SCAFFOLDING.md API contract

**Minor tech debt (v1.2, non-blocking):**
- MutationObserver in WebGL scenes has no disconnect on unmount
- readSignalVars has no NaN guard
- Lenis vs window.scrollTo race on scroll restoration (rAF mitigates)

## Key Decisions

| Decision | Milestone | Outcome |
|----------|-----------|---------|
| Dual-layer FRAME/SIGNAL model | v1.0 | ✓ Good — clean separation of structure and expression |
| OKLCH color space throughout | v1.0 | ✓ Good — perceptually uniform, canvas bridge works via probe |
| Zero border-radius everywhere | v1.0 | ✓ Good — defines the DU/TDR industrial aesthetic |
| CVA `intent` as standard variant prop | v1.0 | ✓ Good — consistent API across all SF components |
| Deferred SIG-06/07/08 to post-v1.0 | v1.0 | ✓ Good — shipped in v1.1 with native APIs, zero dependencies |
| Server Components default for primitives | v1.0 | ✓ Good — no 'use client' on any layout primitive |
| Raw Three.js over React Three Fiber | v1.1 | ✓ Good — R3F's independent rAF conflicts with GSAP timeScale(0) |
| GSAP ticker as WebGL render driver | v1.1 | ✓ Good — single animation loop, reduced-motion kills everything |
| Single-pass GLSL hero with integrated dither | v1.1 | ✓ Good — avoided WebGLRenderTarget two-pass complexity |
| Document-level event listener for audio/haptics | v1.1 | ✓ Good — single listener vs modifying every SF component |
| pnpm over npm | v1.1 | ✓ Good — project convention, all plans auto-corrected |
| Module-level MutationObserver cache for signal uniforms | v1.2 | ✓ Good — zero getComputedStyle in GSAP ticker |
| Hole-in-the-donut SSR pattern for SignalframeProvider | v1.2 | ✓ Good — layout primitives stay Server Components |
| sessionStorage over localStorage for session state | v1.2 | ✓ Good — clears on tab close, correct semantics |
| useEffect-deferred sessionStorage reads for SSR safety | v1.2 | ✓ Good — zero hydration mismatches |

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

*Last updated: 2026-04-06 after v1.2 Tech Debt Sweep milestone shipped*
