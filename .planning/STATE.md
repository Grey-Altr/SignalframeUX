---
pde_state_version: 1.0
milestone: v1.4
milestone_name: Feature Complete
status: in_progress
stopped_at: "Completed 21-02-PLAN.md"
last_updated: "2026-04-06T21:55:39Z"
last_activity: "2026-04-06 — Phase 21 Plan 02 complete: TD-03 resolved (lenis.scrollTo migration)"
progress:
  total_phases: 6
  completed_phases: 0
  total_plans: 2
  completed_plans: 2
---

# STATE — SignalframeUX

## Quick Reference

| Property | Value |
|----------|-------|
| Project | SignalframeUX — Design System for Culture Division |
| Core Value | Dual-layer FRAME/SIGNAL model — deterministic structure + generative expression |
| Current Focus | v1.4 Feature Complete — tech debt, token finalization, remaining components, interactive detail views |
| Milestone | v1.4 Feature Complete |

## Current Position

Phase: Phase 21 (in progress)
Plan: 21-02 complete, Phase 21 done
Status: Plans 21-01 and 21-02 shipped — TD-01, TD-02, TD-03, TD-04 all resolved
Last activity: 2026-04-06 — 21-02 complete (2 tasks, 6 files, 2m17s)

## Progress

```
v1.0: [██████████] 100% (14/14 plans) MILESTONE COMPLETE — shipped 2026-04-05
v1.1: [██████████] 100% (9/9 plans) MILESTONE COMPLETE — shipped 2026-04-06
v1.2: [██████████] 100% (9/9 plans) MILESTONE COMPLETE — shipped 2026-04-06
v1.3: [██████████] 100% (10/10 plans) MILESTONE COMPLETE — shipped 2026-04-06
v1.4: [█_________] ~18% (2/? plans) IN PROGRESS
```

## v1.4 Phase Map

| Phase | Goal | Requirements | Status |
|-------|------|--------------|--------|
| 21. Tech Debt Closure | Eliminate all known instability before feature work | TD-01, TD-02, TD-03, TD-04 | Complete (2/2 plans) |
| 22. Token Finalization | Token system complete, WebGL bridge audited | TK-01, TK-02, TK-03, TK-04 | Not started |
| 23. Remaining SF Components | Component set complete for v1.4 | CMP-01, CMP-02, CMP-03, CMP-04 | Not started |
| 24. Detail View Data Layer | All component data authored, shiki RSC wired | DV-01, DV-02, DV-03 | Not started |
| 25. Interactive Detail Views + Site Integration | Inline detail panel live on /components and homepage | DV-04–DV-12, SI-01–SI-04 | Not started |
| 26. Verification + Launch Gate | Bundle gate + Lighthouse 100/100 against deployed URL | VF-01, VF-02 | Not started |

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

### From v1.3

- rounded-none everywhere: Radix-generated `rounded-full` and `rounded-md` survive the global `--radius: 0px` token. Every SF wrapper must apply `rounded-none` explicitly on every sub-element.
- Barrel directive rule: `sf/index.ts` must remain directive-free permanently. `'use client'` in the barrel turns all 5 layout primitives into Client Components and silently inflates the bundle.
- Bundle budget gate: Measured baseline 103KB shared; hard limit 200KB; gate at 150KB. Calendar and Menubar are P3/lazy — non-negotiable. Run `ANALYZE=true pnpm build` after every P1 component.
- CVA `intent` prop: Every new SF wrapper uses `intent:` as the CVA variant key. Never `variant`, `type`, `status`, or `color`.
- Same-commit rule: Component file + barrel export + registry entry must land in one commit. No partial shipments.
- Toast position: SFToaster defaults to `bottom-left` with `--z-toast: 100`. SignalOverlay occupies `bottom-right` at z~210 — the two must never overlap.
- SFProgress before SFStepper: Hard dependency — Stepper uses Progress fill as step connector.
- Calendar/Menubar lazy: Both use `next/dynamic` with `ssr: false` and are NOT exported from `sf/index.ts` barrel.
- Component count at v1.3 ship: 49-item registry, 45 SF components total (includes 5 layout primitives)

### v1.4 Critical Constraints (from Research)

- **Phase ordering is dependency-forced**: tech debt → tokens → components → detail data → detail views → verification. Do not reorder.
- **MutationObserver disconnect FIRST**: Detail views dramatically increase mount/unmount frequency. Observer accumulation without disconnect causes WebGL jank. TD-01 MUST precede Phase 25.
- **ComponentDetail as DOM sibling**: The panel must be rendered after the GSAP Flip grid div, NOT inside it. Child position corrupts Flip state captures during filter animations. See DV-11.
- **next/dynamic for ComponentDetail**: Bundle gate compliance is non-negotiable. Import all 49 component previews at top-level = bundle balloon. DV-12 is not optional.
- **shiki/core only**: Use `shiki/core` fine-grained (~50-80 KB async, server-only). Never `shiki/bundle/web` (695 KB gzip) or `shiki/bundle/full` (6.4 MB).
- **Z-index contract**: Canvas cursor at z-500; detail panel must use `--z-overlay` token; add `[data-modal-open]` CSS rule dropping cursor z-index below panel when open. See SI-04.
- **lenis.scrollTo only**: Any programmatic scroll from detail view code must use `lenis.scrollTo`. Never `window.scrollTo`. Grep check before Phase 25.
- **vaul transitive check**: vaul may already be present transitively via Sonner. Check `pnpm-lock.yaml` before Phase 23 begins.
- **api-docs.ts audit at Phase 24 start**: ~15 of 31+ grid components have existing entries. Exact delta must be confirmed via pre-phase audit before estimating authoring effort.
- **shiki OKLCH theme prototype at Phase 25 start**: The custom OKLCH theme object construction must be prototyped before full implementation begins.
- **color-resolve.ts alpha syntax**: Audit `oklch(L C H / A)` parser support before Phase 22 modifies any color tokens.

### Decisions

| Decision | Rationale |
|----------|-----------|
| Phase 21 before any v1.4 feature work | MutationObserver, Lenis, and TOAST naming issues are directly activated by detail view patterns — fix first |
| readSignalVars uses isNaN() guard via inline raw() helper (not || fallback) | getPropertyValue can return truthy non-numeric strings ("auto", " ") — || fallback is bypassed, NaN propagates to shader uniforms |
| Observer disconnect inside useGSAP cleanup return (not separate useEffect) | Fires in same teardown pass as ticker removal; avoids separate cleanup lifecycle and potential ordering issues |
| TOAST display names use (FRAME) / (SIGNAL) suffix matching subcategory field | Consistent with existing data model; enables Phase 25 routing by name without schema changes |
| Phase 22 (tokens) before Phase 23 (components) | New SF wrappers must use the final token vocabulary; WebGL bridge audit happens before any OKLCH values are touched |
| Phase 23 (components) before Phase 24 (data) | Component set must be final before documenting all components in api-docs.ts and component-registry.ts |
| Phase 24 (data) before Phase 25 (UI) | Detail UI has no value without data; decoupling data authoring reduces Phase 25 tail risk |
| Phase 25 includes SI-01 through SI-04 | Site integration is inseparable from detail view feature — they form one delivery boundary |
| Phase 26 is standalone verification | Bundle + Lighthouse audit is a gate, not implementation work — isolated phase keeps it verifiable |
| CMP-02 (SFHoverCard) and CMP-03 (SFInputOTP) in Phase 23 | Research originally deferred these to v1.4.x but REQUIREMENTS.md scopes them to v1.4 — included |
| lenisRef pattern for page-transition.tsx | transitionend DOM handler cannot safely close over React hook values — store Lenis in useRef updated via useEffect |
| immediate: true for scroll restoration and page wipe | Matches original instant-scroll intent; smooth scroll is inappropriate while wipe panel covers the viewport |

### Blockers

- None

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-06)

**Core value:** Dual-layer FRAME/SIGNAL model — deterministic structure + generative expression
**Current focus:** v1.4 Feature Complete — all remaining components, token finalization, interactive showcase detail views

## Session Continuity

Last session: 2026-04-06
Stopped at: Completed 21-01-PLAN.md — TD-01, TD-02, TD-04 resolved
Resume with: `/pde:execute-phase 21 02` — Tech Debt Closure Plan 02 (TD-03: lenis.scrollTo)
