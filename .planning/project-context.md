# Project Context — SignalframeUX

> Auto-generated baseline for subagent context. Do not edit manually.
> Regenerate with /pde:new-milestone or /pde:new-project.

## Tech Stack
TypeScript · Next.js 15.3 (App Router, Turbopack) · React 19.1 · Tailwind CSS v4 (@theme in globals.css) · CVA for variants · Radix UI via shadcn → SF-wrapped layer · GSAP 3.12 + ScrollTrigger · Lenis · OKLCH color space · Lucide React · Vercel · Raw Three.js (not R3F) · Web Audio API · Vibration API · Sonner (v1.3+)

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
Component Expansion (v1.3) — 5 phases (16–20)
Status: Roadmap defined, ready for Phase 16 planning

## Key Decisions
| Decision | Milestone | Outcome |
|----------|-----------|---------|
| CVA `intent` as standard variant prop | v1.0 | ✓ Good — consistent API across all SF components |
| Server Components default for primitives | v1.0 | ✓ Good — no 'use client' on any layout primitive |
| Hole-in-the-donut SSR pattern for SignalframeProvider | v1.2 | ✓ Good — layout primitives stay Server Components |
| useEffect-deferred sessionStorage reads for SSR safety | v1.2 | ✓ Good — zero hydration mismatches |
| Phase 16 infrastructure before any component | v1.3 | Pitfall prevention front-loaded |
| Non-animated before animated (Phase 17 before 18) | v1.3 | Isolates SIGNAL layer risk from FRAME layer risk |
| SFProgress before SFStepper | v1.3 | Hard dependency — Stepper uses Progress as connector |
| Calendar/Menubar lazy via next/dynamic | v1.3 | Bundle budget non-negotiable; NOT in sf/index.ts |
| Toast bottom-left, z-100 | v1.3 | Avoids SignalOverlay conflict at bottom-right z-210 |
| DataTable deferred to v1.4 | v1.3 | Composite block is application-layer scope |

## Active Requirements
- [ ] **INFRA-01**: SF wrapper creation checklist in SCAFFOLDING.md
- [ ] **INFRA-02**: Performance baseline captured
- [ ] **INFRA-03**: ComponentsExplorer grouped by category
- [ ] **INFRA-04**: Prop vocabulary locked and documented
- [ ] **FD-01**: SFAccordion with stagger SIGNAL animation
- [ ] **FD-02**: SFToast (Sonner) with GSAP slide, bottom-left
- [ ] **FD-03**: SFProgress with SIGNAL fill intensity tween
- [ ] **FD-04**: SFAlertDialog with loading state
- [ ] **FD-05**: SFAlert with intent variants
- [ ] **FD-06**: SFCollapsible
- [ ] **NAV-01**: SFAvatar square, Radix fallback chain
- [ ] **NAV-02**: SFBreadcrumb as Server Component
- [ ] **NAV-03**: SFEmptyState with optional ScrambleText
- [ ] **NAV-04**: SFNavigationMenu with flyout + mobile behavior
- [ ] **NAV-05**: SFPagination
- [ ] **MS-01**: SFStepper with per-step error state
- [ ] **MS-02**: SFStatusDot with GSAP pulse
- [ ] **MS-03**: SFToggleGroup
- [ ] **REG-01**: SFCalendar lazy, `meta.heavy: true`
- [ ] **REG-02**: SFMenubar lazy, registry-only
