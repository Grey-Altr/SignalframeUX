---
pde_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: completed
stopped_at: Completed 19-01-PLAN.md
last_updated: "2026-04-06T20:08:55Z"
last_activity: "2026-04-06 — Plan 19-01: SFToggleGroup + SFPagination + SFStepper, 102 KB shared"
progress:
  total_phases: 11
  completed_phases: 3
  total_plans: 7
  completed_plans: 7
---

# STATE — SignalframeUX

## Quick Reference

| Property | Value |
|----------|-------|
| Project | SignalframeUX — Design System for Culture Division |
| Core Value | Dual-layer FRAME/SIGNAL model — deterministic structure + generative expression |
| Current Focus | v1.3 Component Expansion — comprehensive, production-complete component library |
| Milestone | v1.3 Component Expansion |

## Current Position

Phase: Phase 19 — P2 Components (in progress)
Plan: 01 complete — SFToggleGroup + SFPagination + SFStepper
Status: Plan 19-01 complete (1/2 plans), Plan 19-02 next
Last activity: 2026-04-06 — Plan 19-01: Three P2 components, 102 KB shared

## Progress

```
v1.0: [██████████] 100% (14/14 plans) MILESTONE COMPLETE — shipped 2026-04-05
v1.1: [██████████] 100% (9/9 plans) MILESTONE COMPLETE — shipped 2026-04-06
v1.2: [██████████] 100% (9/9 plans) MILESTONE COMPLETE — shipped 2026-04-06
v1.3: [███████   ] 54% (7/? plans) — in progress
```

## v1.3 Phase Map

| Phase | Goal | Requirements | Status |
|-------|------|--------------|--------|
| 16. Infrastructure Baseline | All authoring preconditions satisfied — checklist, baseline, categories, prop vocabulary | INFRA-01, INFRA-02, INFRA-03, INFRA-04 | In progress (2/? plans) |
| 17. P1 Non-Animated Components | Seven FRAME-only components live — Avatar, Breadcrumb, EmptyState, AlertDialog, Alert, Collapsible, StatusDot | NAV-01, NAV-02, NAV-03, FD-04, FD-05, FD-06, MS-02 | Complete (2/2 plans) |
| 18. P1 Animated Components | Accordion stagger, Toast slide, Progress fill tween live with prefers-reduced-motion guards | FD-01, FD-02, FD-03 | Complete (2/2 plans) |
| 19. P2 Components | NavigationMenu, Pagination, Stepper (depends on SFProgress), ToggleGroup | NAV-04, NAV-05, MS-01, MS-03 | In progress (1/2 plans) |
| 20. P3 Registry-Only + Final Audit | Calendar and Menubar as lazy registry entries; Lighthouse 100/100 confirmed | REG-01, REG-02 | Not started |

## Accumulated Context

### From v1.0 (Carried Forward)
- Token system locked: 9 blessed spacing stops, 5 semantic typography aliases, 5 layout tokens, tiered color palette (core 5 + extended), animation durations/easings
- 29 SF-wrapped components (24 interactive + 5 layout primitives)
- SIGNAL layer: ScrambleText, asymmetric hover (100ms/400ms), 34ms hard-cut, canvas cursor, stagger batch
- DX: SCAFFOLDING.md (337 lines), JSDoc coverage, DX-SPEC.md with deferred interface sketches

### From v1.1
- Singleton WebGL infrastructure: SignalCanvas, useSignalScene, color-resolve with TTL cache
- Multi-sensory SIGNAL: audio (Web Audio), haptics (Vibration API), idle animation (grain drift + OKLCH pulse)
- Generative scenes: SignalMesh (Three.js), TokenViz (Canvas 2D), GLSLHero (GLSL + Bayer dither)
- SF primitives consumed across all 5 pages (32 SFSection instances)
- Three.js in async chunk (102 kB initial shared bundle)

### From v1.2
- FND-01 FIRST: --signal-* CSS var defaults must exist before INT-04 wiring — missing defaults cause magenta flash via color-resolve.ts fallback
- INT-04 performance rule: NO per-frame getComputedStyle() — module-level cache + MutationObserver or direct invalidation from SignalOverlay
- --signal-accent is a float (hue degrees), not a color token — use parseFloat() directly, never resolveColorToken
- DX-05 SSR boundary: "hole in the donut" pattern mandatory — SignalframeProvider is 'use client' but {children} remain Server Components
- STP-01 hydration safety: render default state first, read sessionStorage only in useEffect after mount
- bgShift type fix: fix all consumer call sites in same commit, never @ts-ignore, run tsc --noEmit before and after

### v1.3 Critical Constraints (from Research)
- **rounded-none everywhere**: Radix-generated `rounded-full` and `rounded-md` survive the global `--radius: 0px` token. Every SF wrapper must apply `rounded-none` explicitly on every sub-element. Audit with DevTools computed styles before marking any component complete.
- **Barrel directive rule**: `sf/index.ts` must remain directive-free permanently. `'use client'` in the barrel turns all 5 layout primitives into Client Components and silently inflates the bundle. Each interactive SF wrapper declares `'use client'` in its own file only.
- **Bundle budget gate**: Measured baseline 103KB shared; hard limit 200KB; gate at 150KB. Calendar and Menubar are P3/lazy — non-negotiable. Run `ANALYZE=true pnpm build` after every P1 component.
- **CVA `intent` prop**: Every new SF wrapper uses `intent:` as the CVA variant key. Never `variant`, `type`, `status`, or `color`.
- **Toast position**: SFToaster defaults to `bottom-left` with `--z-toast: 100`. SignalOverlay occupies `bottom-right` at z~210 — the two must never overlap.
- **Same-commit rule**: Component file + barrel export + registry entry must land in one commit. No partial shipments.
- **SFProgress before SFStepper**: Hard dependency — Stepper uses Progress fill as step connector. Phase 18 must complete before Phase 19 begins.
- **Calendar/Menubar lazy**: Both use `next/dynamic` with `ssr: false` and are NOT exported from `sf/index.ts` barrel.
- **NavigationMenu is last in P2**: Most complex, highest keyboard-regression risk, nothing depends on it — always last.

### Decisions

| Decision | Rationale |
|----------|-----------|
| Phase 16 before any component | All pitfall prevention front-loaded — checklist, baseline, categories codified before first wrapper line |
| Non-animated before animated (Phase 17 before 18) | Isolates SIGNAL layer risk from FRAME layer risk — simpler components validate pattern before adding GSAP |
| Phase 17 groups FD-04, FD-05, FD-06 with navigation components | All are FRAME-only, Pattern A or C — same authoring complexity, logical to batch |
| MS-02 (SFStatusDot) in Phase 17, not Phase 19 | StatusDot is FRAME-primary with a simple GSAP pulse — closer to Phase 17 complexity than P2 |
| Phase 19 SFNavigationMenu last | Most complex Radix primitive with non-obvious data-state CSS interactions; nothing depends on it |
| Phase 20 batches REG-01 and REG-02 with final audit | Registry-only components warrant no separate phase; Lighthouse check is natural companion |
| DataTable deferred to v1.4 | Depends on SFPagination (Phase 19); composite block is application-layer work, not design system scope for v1.3 |
| SCAFFOLDING.md at project root | Maximum discoverability for Phase 17-20 executors |
| Six named categories replace layer-based tags | Product-language taxonomy (FORMS/FEEDBACK/NAVIGATION/DATA_DISPLAY/LAYOUT/GENERATIVE) matches component purpose, not implementation layer |
| No session migration for stale filterTag | useSessionState defaults to ALL; stale values gracefully ignored |
| Bundle gate is shared JS (103 KB), not per-route | Per-route First Load varies 103-264 KB due to Three.js async chunks; shared is deterministic |
| Lighthouse CLI headless not representative | Use browser DevTools against deployed Vercel for accurate LCP/TTI; CLI numbers inflated by WebGL |
| SFAlert as Server Component | Base alert.tsx has no 'use client' and SFAlert uses no hooks — reduces client bundle |
| SFBreadcrumb as Server Component | Base breadcrumb.tsx has no 'use client' — per NAV-02 requirement |
| SFStatusDot uses gsap-core not gsap-split | Only needs core tween for pulse — avoids loading SplitText/ScrambleText plugins |
| SFEmptyState Bayer dither as base64 PNG | Inline data URI avoids network request; 8x8 pattern at opacity-[0.04] is DU/TDR visual language |
| SFProgress wraps Radix directly, not shadcn base | Base ui/progress.tsx has transition-all on indicator (conflicts with GSAP) and lacks ref access |
| GSAP stagger runs on SFAccordionContent mount | Radix unmounts content when closed by default; mount === panel open, no observer needed |
| Kept Radix CSS height animation on AccordionContent | GSAP only staggers inner children; container height handled by animate-accordion-down/up |
| SFToggleGroup uses intersection type for Root props | Radix ToggleGroup.Root is a discriminated union (single/multiple); interface extends fails |
| SFPagination as Server Component | Base pagination.tsx has no 'use client' and SFPagination uses no hooks |
| SFStepper writing-mode:vertical-lr for vertical connectors | SFProgress uses xPercent tween; writing-mode rotates the fill direction |

### Blockers
- None

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-06)

**Core value:** Dual-layer FRAME/SIGNAL model — deterministic structure + generative expression
**Current focus:** v1.3 Component Expansion — comprehensive, production-complete component library

## Session Continuity

Last session: 2026-04-06
Stopped at: Completed 19-01-PLAN.md
Resume with: Phase 19 Plan 02 (SFNavigationMenu)
