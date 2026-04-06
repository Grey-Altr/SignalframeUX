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

- ✓ SF wrapper creation checklist codified in SCAFFOLDING.md (9-point checklist) — v1.3
- ✓ Performance baseline captured (103 KB shared, Lighthouse CLI 88/100) — v1.3
- ✓ ComponentsExplorer grouped by 6 named categories (Forms, Feedback, Navigation, Data Display, Layout, Generative) — v1.3
- ✓ Prop vocabulary locked (`intent` for semantic variants, `size` for scale, `asChild` for composition) — v1.3
- ✓ 7 P1 FRAME-only components: SFAvatar, SFBreadcrumb, SFEmptyState, SFAlertDialog, SFAlert, SFCollapsible, SFStatusDot — v1.3
- ✓ 3 P1 animated components: SFAccordion (GSAP stagger), SFToast/SFToaster (Sonner + GSAP slide), SFProgress (GSAP fill tween) — v1.3
- ✓ 4 P2 components: SFNavigationMenu (flyout + mobile SFSheet), SFPagination (Server Component), SFStepper (SFProgress connectors), SFToggleGroup — v1.3
- ✓ 2 P3 registry-only lazy components: SFCalendar, SFMenubar (next/dynamic, meta.heavy: true) — v1.3
- ✓ Full 49-item registry with corrected meta.pattern values (35 A, 2 B, 12 C) — v1.3
- ✓ 102 KB shared JS bundle (under 150 KB gate) after 16 new components — v1.3

### Active

(Defining requirements for v1.4)

### Out of Scope

- Mobile app — web-first, responsive design handles mobile
- Backend API — design system is frontend-only
- CMS integration — MDX + JSON for content
- React Three Fiber — excluded; R3F's independent rAF loop conflicts with GSAP globalTimeline.timeScale(0)
- Lottie — JSON-replayed animation, not generative/procedural; incompatible with DU/TDR aesthetic

## Current Milestone: v1.4 Feature Complete

**Goal:** Ship every remaining component, finalize tokens, and build an interactive showcase site where each component expands to show props, variants, and implementation details.

**Target features:**
- All remaining shadcn/Radix components SF-wrapped and registered
- Token system finalized — no gaps
- Site as coherent showcase demonstrating every component
- Interactive component detail views (click to expand props, variants, usage, implementation info)
- Homepage grid components clickable with same detail expansion
- Close all outstanding tech debt from v1.2/v1.3

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

**Shipped v1.3 Component Expansion** (2026-04-06):
- 100 files modified, +11,072 lines across 52 commits, 5 phases, 10 plans
- 16 new SF components shipped (45 total): 7 FRAME-only (Avatar, Breadcrumb, EmptyState, AlertDialog, Alert, Collapsible, StatusDot), 3 animated (Accordion, Toast, Progress), 4 P2 (NavigationMenu, Pagination, Stepper, ToggleGroup), 2 P3 lazy (Calendar, Menubar)
- SCAFFOLDING.md: 9-point wrapper checklist, prop vocabulary, registry template
- ComponentsExplorer: 31 entries across 6 named categories
- 49-item shadcn CLI registry with corrected meta.pattern values
- SFStepper consumes SFProgress as vertical connectors (writing-mode:vertical-lr)
- SFEmptyState with Bayer dither texture matching hero SIGNAL aesthetic
- SFToast via Sonner with GSAP slide entrance, DU/TDR minimal bar aesthetic
- Bundle: 102 KB shared JS (unchanged from v1.2 baseline)

**Minor tech debt (v1.2, non-blocking):**
- MutationObserver in WebGL scenes has no disconnect on unmount
- readSignalVars has no NaN guard
- Lenis vs window.scrollTo race on scroll restoration (rAF mitigates)

**Minor tech debt (v1.3, non-blocking):**
- Lighthouse 100/100 not yet confirmed against deployed URL (CLI headless not representative with WebGL)
- Duplicate TOAST name in ComponentsExplorer (indices 010 and 022, cosmetic)
- Phase 19 human validation deferred (NavigationMenu flyout, keyboard nav, Stepper connectors)

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
| Pattern B for lazy P3 components (next/dynamic + ssr:false) | v1.3 | ✓ Good — Calendar/Menubar zero bundle cost |
| SFStepper uses actual SFProgress as connectors (not reimplementation) | v1.3 | ✓ Good — single animation primitive, GSAP tween reuse |
| Sonner with unstyled:true for SFToast | v1.3 | ✓ Good — full DU/TDR aesthetic control, no !important battles |
| SFToggleGroup imports Radix directly (not through ui/ base) | v1.3 | ✓ Good — avoids variant→intent CVA remapping conflict |
| CSS animation for NavigationMenu flyout (not GSAP) | v1.3 | ✓ Good — FRAME component, Radix provides built-in data-motion |

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

*Last updated: 2026-04-06 after v1.4 Feature Complete milestone started*
