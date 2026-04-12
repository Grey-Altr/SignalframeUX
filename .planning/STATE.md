---
pde_state_version: 1.0
milestone: v1.7
milestone_name: v1.7 Tightening, Polish, and Aesthetic Push
status: verification
stopped_at: Phase 56 complete (symbol system + final gate)
last_updated: "2026-04-12T00:00:00Z"
last_activity: 2026-04-12 — Phase 56 complete (CDSymbol + 24-symbol sprite + stories). Awaiting PRF Lighthouse verification.
progress:
  total_phases: 56
  completed_phases: 56
  total_plans: 74
  completed_plans: 74
---

# STATE — SignalframeUX

## Quick Reference

| Property | Value |
|----------|-------|
| Project | SignalframeUX — Design System for Culture Division |
| Core Value | Dual-layer SIGNAL/FRAME model — generative expression through deterministic structure |
| Current Focus | v1.7 Tightening, Polish, and Aesthetic Push |
| Milestone | v1.7 |

## Current Position

Phase: 56 (complete — all plans)
Status: All v1.7 phases complete — awaiting PRF Lighthouse verification (PRF-01, PRF-02)
Last activity: 2026-04-12 — Phase 56 complete (CDSymbol + 24-symbol sprite + 61 stories). PRF-04 bundle gate ✓ (19KB lib / 102KB app). VRG-03 story count ✓ (61 ≥ 60). Lighthouse runs needed for PRF-01/02.

## Progress

```
v1.0: [██████████] 100% (14/14 plans) MILESTONE COMPLETE — shipped 2026-04-05
v1.1: [██████████] 100% (9/9 plans) MILESTONE COMPLETE — shipped 2026-04-06
v1.2: [██████████] 100% (9/9 plans) MILESTONE COMPLETE — shipped 2026-04-06
v1.3: [██████████] 100% (10/10 plans) MILESTONE COMPLETE — shipped 2026-04-06
v1.4: [██████████] 100% (13/13 plans) MILESTONE COMPLETE — shipped 2026-04-08
v1.5: [██████████] 100% (20/20 plans) MILESTONE COMPLETE — shipped 2026-04-10
v1.6: [██████████] 100% (10/10 plans) MILESTONE COMPLETE — shipped 2026-04-11
v1.7: [█████████░]  95% VERIFICATION — Lighthouse PRF-01/PRF-02 pending
```

## v1.7 Phase Map

| Phase | Name | Requirements | Status |
|-------|------|--------------|--------|
| 44 | Copy Audit Fixes | COP-01, COP-02, COP-03, COP-04, COP-05, COP-06 | Complete |
| 45 | Token Bridge | TBR-01, TBR-02, TBR-03, TBR-04 | Complete |
| 46 | Tightening Pass | TGH-01, TGH-02, TGH-03, TGH-04 | Complete |
| 47 | Viewport Polish | VPT-01, VPT-02, VPT-03, VPT-04 | Complete |
| 48 | Intensity Bridge + Chromatic Setup | SIG-01, SIG-02, SIG-03, SIG-04, SIG-05, VRG-01 | Complete |
| 49 | Grain + Idle Escalation + Visual Baseline | GRN-01, GRN-02, GRN-03, GRN-04, VRG-02 | Complete |
| 50 | VHS Enhancement | VHS-01, VHS-02, VHS-03, VHS-04, VHS-05, VHS-06 | Complete |
| 50.1 | Datamosh Overlay | DTM-01, DTM-02, DTM-03, DTM-04 | Complete |
| 51 | Halftone Texture | HLF-01, HLF-02, HLF-03, HLF-04 | Complete |
| 52 | Circuit Overlay | CIR-01, CIR-02, CIR-03 | Complete |
| 53 | Mesh Gradient | MSH-01, MSH-02, MSH-03 | Complete |
| 54 | Particle Field | PTL-01, PTL-02, PTL-03, PTL-04 | Complete |
| 55 | Glitch Transition | GLT-01, GLT-02, GLT-03 | Complete |
| 56 | Symbol System + Final Gate | SYM-01, SYM-02, SYM-03, VRG-03, PRF-01, PRF-02, PRF-03, PRF-04 | Verification pending |

## v1.6 Phase Map (archived)

| Phase | Name | Requirements | Status |
|-------|------|--------------|--------|
| 36 | Housekeeping & Carry-Overs | CO-01, CO-02, CO-03, CO-04 | Complete |
| 37 | Next.js 16 Migration | MG-01, MG-02, MG-03 | Complete |
| 38 | Test & Quality Hardening | QA-01, QA-02, QA-03 | Complete |
| 39 | Library Build Pipeline | LIB-01, LIB-02, LIB-03 | Complete |
| 40 | API Documentation & DX | DOC-01, DOC-02, DOC-03, DOC-04 | Complete |
| 41 | Distribution & Launch Gate | DIST-01, DIST-02, DIST-03, DIST-04 | Complete |
| 42 | Tracking Reconciliation + peerDep Fix | CO-01-04, LIB-01-03 (gap closure) | Complete |
| 43 | Production Deploy + Lighthouse Gate | DIST-04 (gap closure) | Complete |

## v1.5 Phase Map (archived)

| Phase | Name | Requirements | Status |
|-------|------|--------------|--------|
| 28 | Route Infrastructure | RA-01, RA-02, RA-03, RA-04 | Complete (2/2 plans) |
| 29 | Infrastructure Hardening | PF-04, PF-05, PF-06 | Not started |
| 30 | Homepage Architecture + ENTRY Section | RA-05, EN-01–05, VL-03, VL-07 | Complete (2/2 plans) |
| 31 | THESIS Section | TH-01–06 | Complete (2/2 plans) |
| 32 | SIGNAL + PROOF Sections | SG-01–05, PR-01–06 | Complete (2/2 plans) |
| 33 | INVENTORY + ACQUISITION Sections | IV-01–06, AQ-01–05 | Complete (4/4 plans) |
| 34 | Visual Language + Subpage Redesign | VL-01, VL-02, VL-04–06, SP-01–05 | Complete (4/4 plans) |
| 35 | Performance + Launch Gate | PF-01–03, LR-01–04 | Complete (5/5 plans) |

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

### v1.5 Critical Constraints (Carried Forward)

- **Infrastructure before features**: fonts-ready, overscroll-behavior, Lenis audit, and Observer registration MUST precede any new scroll or WebGL work.
- **WebGL context limit on mobile**: Safari iOS enforces 2-8 WebGL contexts. SignalCanvas scissor singleton already handles this — do not create additional renderers.
- **LCP suppression hazard**: Hero heading must NOT use `opacity: 0` as start state. Use `opacity: 0.01` or `clip-path` reveal.
- **SIGNAL/FRAME ordering**: Always written as SIGNAL/FRAME (signal first), never FRAME/SIGNAL, in all code comments, docs, and UI labels.
- **Zero new npm packages**: All animation via GSAP ScrollTrigger + Lenis (already in stack). No new runtime dependencies in v1.7.

### v1.6 Decisions (Carried Forward)

- [Phase 36]: @typescript-eslint packages need direct devDep install in pnpm projects — transitive deps are not hoisted
- [Phase 36]: JSX // text content must be wrapped in {"//"} expressions — react/jsx-no-comment-textnodes fires on any // sequence in JSX children
- [Phase 36-01]: headers() in layout.tsx forces dynamic rendering — remove entirely; layout becomes sync, all routes static
- [Phase 38]: passWithNoTests: true required in vitest.config.ts — vitest 4.x exits code 1 on empty suite by default
- [Phase 38-02]: color: transition removed from global * rule — axe-core samples mid-transition interpolated hex values
- [Phase 41-distribution-launch-gate]: GSAP SSR guard: all module-level registerPlugin() calls wrapped in typeof window check
- [Phase 42-tracking-reconciliation-peerdep-fix]: next moved from dependencies to peerDependencies with optional:true

### v1.7 Critical Constraints

- **Phase 48 is the prerequisite for all effect phases**: intensity bridge (updateSignalDerivedProps) MUST exist before any effect reads derived properties. Phases 49-56 depend on Phase 48.
- **Phase 49 (grain) MUST precede Phase 50 (VHS)**: grain establishes the visual baseline; VHS layers on top. Coherence review requires both in the correct order.
- **Phase 50 (VHS) MUST precede Phase 51 (halftone)**: combined review of VHS + halftone is required per HLF-04 before halftone ships.
- **VRG-01 (Chromatic) lands in Phase 48**: baselines must be capturable before Phase 49 changes grain opacity. Do not defer Chromatic install.
- **VRG-02 (baselines) lands in Phase 49**: capture before any grain opacity values change; commit the baseline snapshot.
- **PTL-01 WebGL singleton rule**: particle field MUST use useSignalScene() singleton. Creating a second WebGL context on iOS Safari will cause context loss.
- **Static grain ceiling**: per research, static grain > 0.07 opacity is an anti-feature (SOTD research flag). Parametric escalation only — never set static grain above 0.07.
- **PRF-01-04 are launch gate requirements**: they block v1.7 ship. Phase 56 cannot complete until all four pass.
- **Safari backdrop-filter rule**: no var() references in -webkit-backdrop-filter — literal values only. Applies to VHS-05 and any future backdrop-filter usage.
- **No new runtime dependencies**: Chromatic is a devDependency; CDSymbol is a local component. Zero new npm runtime packages in v1.7.

### Decisions

| Decision | Rationale |
|----------|-----------|
| 13 phases (44-56) not fewer | Each phase delivers one coherent, verifiable capability; effects are naturally sequential due to visual coherence review dependencies |
| Phase 44 first (copy audit) | Zero dependencies, zero risk, immediate integrity — clear the slate before any aesthetic work |
| Phase 45 second (token bridge) | Validates @layer cascade architecture before aesthetic changes; establishing the override pattern is foundational |
| Phases 46-47 before effects | All tightening and viewport polish must be stable before the visual effect stack is built on top |
| Phase 48 (intensity bridge) before all effects | Architectural prerequisite — every effect in phases 49-55 reads derived properties from updateSignalDerivedProps |
| VRG-01 in Phase 48 | Chromatic needs to be installed before baselines can be captured in Phase 49; cannot install and capture in same phase |
| Phase 49 (grain) before Phase 50 (VHS) | Grain is the visual baseline for all other effects; VHS, halftone, and particles layer on top |
| Phase 52 (circuit) and 53 (mesh) parallel-eligible | Both depend only on Phase 48; neither depends on the other; can be executed in any order |
| Phase 54 (particles) late | WebGL, highest complexity, iOS Safari risk — defer until all CSS-only effects are validated |
| Phase 56 as the launch gate | Consolidates VRG-03, PRF-01-04, and SYM as the final verification boundary; no phase can be declared complete without passing these |
- [Phase 45-token-bridge]: @theme inline aliasing: --color-* utility aliases point to --sfx-* vars so Tailwind classes work without renaming utility class names
- [Phase 45-token-bridge]: @layer signalframeux wraps :root/.dark in dist only — app globals stay unlayered; consumer CSS wins by loading after the layered dist

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-07)

**Core value:** Dual-layer SIGNAL/FRAME model — generative expression through deterministic structure
**Current focus:** v1.7 Tightening, Polish, and Aesthetic Push

## Session Continuity

Last session: 2026-04-12
Stopped at: Phase 56 complete (symbol system + final gate). All v1.7 implementation done.
Resume with: Run Lighthouse against deployed URL — verify PRF-01 (A11y/BP/SEO = 100) and PRF-02 (Performance ≥ 75). Then /gsd-complete-milestone to close v1.7.
