---
pde_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
stopped_at: Phase 31 plans created — blocked on Phase 30 execution
last_updated: "2026-04-08T05:21:32.977Z"
last_activity: 2026-04-08 -- Phase 30 planning complete
progress:
  total_phases: 26
  completed_phases: 9
  total_plans: 21
  completed_plans: 17
---

# STATE — SignalframeUX

## Quick Reference

| Property | Value |
|----------|-------|
| Project | SignalframeUX — Design System for Culture Division |
| Core Value | Dual-layer SIGNAL/FRAME model — generative expression through deterministic structure |
| Current Focus | v1.5 Redesign — transform site into Awwwards SOTD-level designed artifact |
| Milestone | v1.5 Redesign |

## Current Position

Phase: 29 — Infrastructure Hardening
Plan: 01 complete
Status: Ready to execute
Last activity: 2026-04-08 -- Phase 30 planning complete

## Progress

```
v1.0: [██████████] 100% (14/14 plans) MILESTONE COMPLETE — shipped 2026-04-05
v1.1: [██████████] 100% (9/9 plans) MILESTONE COMPLETE — shipped 2026-04-06
v1.2: [██████████] 100% (9/9 plans) MILESTONE COMPLETE — shipped 2026-04-06
v1.3: [██████████] 100% (10/10 plans) MILESTONE COMPLETE — shipped 2026-04-06
v1.4: [██████████] 100% (13/13 plans) MILESTONE COMPLETE — shipped 2026-04-08
v1.5: [██________] 25% (3/? plans) IN PROGRESS — Phase 29 Plan 01 complete
```

## v1.5 Phase Map

| Phase | Name | Requirements | Status |
|-------|------|--------------|--------|
| 28 | Route Infrastructure | RA-01, RA-02, RA-03, RA-04 | Complete (2/2 plans) |
| 29 | Infrastructure Hardening | PF-04, PF-05, PF-06 | Not started |
| 30 | Homepage Architecture + ENTRY Section | RA-05, EN-01–05, VL-03, VL-07 | Not started |
| 31 | THESIS Section | TH-01–06 | Not started |
| 32 | SIGNAL + PROOF Sections | SG-01–05, PR-01–06 | Not started |
| 33 | INVENTORY + ACQUISITION Sections | IV-01–06, AQ-01–05 | Not started |
| 34 | Visual Language + Subpage Redesign | VL-01, VL-02, VL-04–06, SP-01–05 | Not started |
| 35 | Performance + Launch Gate | PF-01–03, LR-01–04 | Not started |

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

### From v1.4

- **Phase ordering is dependency-forced**: tech debt → tokens → components → detail data → detail views → verification. Do not reorder.
- **MutationObserver disconnect FIRST**: Detail views dramatically increase mount/unmount frequency. Observer accumulation without disconnect causes WebGL jank. TD-01 MUST precede Phase 25.
- **ComponentDetail as DOM sibling**: The panel must be rendered after the GSAP Flip grid div, NOT inside it. Child position corrupts Flip state captures during filter animations. See DV-11.
- **next/dynamic for ComponentDetail**: Bundle gate compliance is non-negotiable. Import all 49 component previews at top-level = bundle balloon. DV-12 is not optional.
- **shiki/core only**: Use `shiki/core` fine-grained (~50-80 KB async, server-only). Never `shiki/bundle/web` (695 KB gzip) or `shiki/bundle/full` (6.4 MB).
- **Z-index contract**: Canvas cursor at z-500; detail panel must use `--z-overlay` token; add `[data-modal-open]` CSS rule dropping cursor z-index below panel when open. See SI-04.
- **lenis.scrollTo only**: Any programmatic scroll from detail view code must use `lenis.scrollTo`. Never `window.scrollTo`. Grep check before Phase 25.
- **vaul transitive check**: vaul may already be present transitively via Sonner. Check `pnpm-lock.yaml` before Phase 23 begins.
- **Bundle gate at v1.4 ship**: 100.0 KB gzip shared bundle (50 KB under 150 KB gate)
- **Lighthouse at v1.4 ship**: 100/100 all categories confirmed against deployed URL

### v1.5 Critical Constraints (from Research)

- **Infrastructure before features**: fonts-ready, overscroll-behavior, Lenis audit, and Observer registration MUST precede any new scroll or WebGL work. Phase 29 is non-negotiable before Phase 30+.
- **MutationObserver consolidation before 3rd WebGL scene**: Phase 32 (SIGNAL section) adds a 3rd concurrent WebGL scene. Singleton Observer consolidation must be complete — confirmed at Phase 29 close.
- **PinnedSection before THESIS**: PinnedSection component must exist and be tested in isolation (Phase 29) before Phase 31 uses it for 200-300vh manifesto scroll.
- **LCP suppression hazard**: `SIGNALFRAME//UX` heading must NOT use `opacity: 0` as its start state. Use `opacity: 0.01` or `clip-path` reveal. Applies to Phase 30 ENTRY implementation.
- **iOS Safari address bar**: `ignoreMobileResize: true` must be confirmed in Lenis config at Phase 29. Do not defer.
- **WebGL context limit on mobile**: Safari iOS enforces 2-8 WebGL contexts. SignalCanvas scissor singleton already handles this — do not create additional renderers in Phase 32.
- **Manifesto copy is a Phase 31 dependency**: The scroll manifesto engineering (TH-01 through TH-06) requires finalized text content covering SIGNAL/FRAME thesis, Enhanced Flat Design position, and cybernetic biophilia — as statements, not explanations. Resolve content before Phase 31 planning.
- **SF//[CAT]-NNN schema**: The 6 category abbreviations for coded nomenclature must be validated against all 49 registry components before Phase 33 implementation begins.
- **Route rename first**: RA-01 through RA-04 (Phase 28) uses `next.config.ts` redirects (308 permanent). Confirm redirect config syntax for Next.js 15.3 before writing.
- **SIGNAL/FRAME ordering**: Always written as SIGNAL/FRAME (signal first), never FRAME/SIGNAL, in all code comments, docs, and UI labels.
- **Zero new npm packages**: All animation via GSAP ScrollTrigger + Lenis (already in stack). No new runtime dependencies in v1.5.
- **Physical iOS Safari testing**: Mandatory after Phase 32. Simulators do not replicate address bar behavior.

### Decisions

| Decision | Rationale |
|----------|-----------|
| 8 phases (28-35) not 9 | Observer consolidation absorbed into Phase 29 Infrastructure Hardening — avoids a phase with zero explicit requirement coverage |
| Phase 28 first (route renames) | Zero risk, zero dependencies; permanent redirects land before any structural work touches the pages |
| Phase 29 (infrastructure) before Phase 30 (homepage) | Lenis, fonts-ready, Observer, and PinnedSection must all be proven before scroll-driven features build on them |
| THESIS in its own phase (31) | 200-300vh manifesto is the primary SOTD signature interaction — deserves isolated delivery boundary and content dependency callout |
| SIGNAL + PROOF together in Phase 32 | Both are full-viewport sections with WebGL involvement; shipping together respects the 3rd-scene Observer dependency |
| INVENTORY + ACQUISITION together in Phase 33 | Both deliver the catalog experience; ACQUISITION depends on INVENTORY section slot existing |
| Visual language + subpages together in Phase 34 | Ghost labels and HUD indicators apply across all subpages — more efficient to audit and apply globally in one phase |
| Phase 35 is standalone verification | Launch gate is a hard gate, not implementation work — isolated phase keeps it verifiable and non-skippable |

- [Phase 28]: phase-28-route-infra.spec.ts retains old route strings — intentional redirect verification tests, not stale nav links
- [Phase 28]: sitemap.ts uses template literals (${BASE}/route) not quoted strings — grep pattern must account for this syntax
- [Phase 29]: autoResize: false instead of ignoreMobileResize: true — Lenis 1.3.x dropped ignoreMobileResize; autoResize: false is the equivalent for iOS address bar resize suppression
- [Phase 29]: token-viz is static single-frame render — no rAF guard needed, reduced-motion coverage comment added to satisfy PF-06 audit
- [Phase 29]: canvas-cursor and xray-reveal classified as pointer-driven (exempt from reduced-motion guard — rAF only fires on pointer move)

### Blockers

- **Manifesto copy**: Text content for THESIS section (TH-05) is not yet determined. Must be resolved before Phase 31 planning begins. (Research gap noted 2026-04-07)
- **SF//[CAT]-NNN schema**: 6 category abbreviations not yet validated against full 49-item registry. Must be resolved before Phase 33 planning begins. (Research gap noted 2026-04-07)

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-07)

**Core value:** Dual-layer SIGNAL/FRAME model — generative expression through deterministic structure
**Current focus:** v1.5 Redesign — transform site into Awwwards SOTD-level designed artifact

## Session Continuity

Last session: 2026-04-08T05:21:32.972Z
Stopped at: Phase 31 plans created — blocked on Phase 30 execution
Resume with: `/pde:execute-phase 29` to begin Phase 29 (Infrastructure Hardening)
