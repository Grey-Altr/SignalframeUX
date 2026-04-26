---
gsd_state_version: 1.0
milestone: v1.8
milestone_name: Build-Order Constraints
status: Phase 59 PLANNED (3 plans, 5/5 CRT reqs covered). 59-RESEARCH.md (877 lines), 59-VALIDATION.md (per-task map), 59-01..03-PLAN.md committed (377+923+537 lines). Plan-checker iteration 2/3 PASSED with 0 BLOCKERs. CRT-05 strict bisect order enforced via Plan B `depends_on: [59-01]` + Plan C `depends_on: [59-01, 59-02]`. Plan B Task 0 BLOCKING-HUMAN gates PR-open on Phase 58 HUMAN-UAT items 1+2 verification; Task 6 inner blocking-human gates Chromatic cohort review; AES-02 exception logged at 59-AES02-EXCEPTION.md (created at execute-time). Anton CLS history (Wave 3 0.485 regression on /system) honored — Plan B Wave 0 measurement script supersedes RESEARCH placeholders before layout.tsx edit. Upstream-doc traceability fixed: REQUIREMENTS.md L28 + ROADMAP.md L917 path drift `components/animation/lenis-provider.tsx` → `components/layout/lenis-provider.tsx` ratified per feedback_ratify_reality_bias.md.
stopped_at: Completed plan-phase 59 (3 PLAN.md files, 14 tasks total: 3+8+3); auto-advancing to /pde:execute-phase 59 --auto
last_updated: "2026-04-25T22:00:00.000Z"
last_activity: 2026-04-25
progress:
  total_phases: 54
  completed_phases: 40
  total_plans: 80
  completed_plans: 77
  percent: 96
---

# STATE — SignalframeUX

## Quick Reference

| Property | Value |
|----------|-------|
| Project | SignalframeUX — Design System for Culture Division |
| Core Value | Dual-layer SIGNAL/FRAME model — generative expression through deterministic structure |
| Current Focus | v1.8 Speed of Light — performance recovery to original CLAUDE.md gate |
| Milestone | v1.8 Speed of Light |

## Current Position

Phase: 59
Plan: Planned (3 plans, 0/3 executed)
Status: Phase 59 PLANNED with 3 PLAN.md files + RESEARCH.md (877 lines) + VALIDATION.md committed (commits cea63e5 → 501e8f2 → bb20693). Plan-checker iteration 2/3 PASSED — 0 BLOCKERs. Plan A (59-01) — canvas-sync inline + delete (CRT-01); Plan B (59-02) — Anton subset+swap (CRT-02, CRT-03); Plan C (59-03) — Lenis rIC deferral (CRT-04). CRT-05 strict bisect order: A → B → C. Plan B Task 0 blocks PR-open on Phase 58 HUMAN-UAT 1+2 verification. Anton CLS history (Wave 3 0.485 regression) honored — Plan B Wave 0 measures descriptors before layout.tsx edit. Path drift in REQUIREMENTS.md L28 + ROADMAP.md L917 ratified to `components/layout/lenis-provider.tsx`. Auto-chain active → execute-phase next.
Last activity: 2026-04-25

## Progress

```
v1.0: [██████████] 100% (14/14 plans) MILESTONE COMPLETE — shipped 2026-04-05
v1.1: [██████████] 100% (9/9 plans) MILESTONE COMPLETE — shipped 2026-04-06
v1.2: [██████████] 100% (9/9 plans) MILESTONE COMPLETE — shipped 2026-04-06
v1.3: [██████████] 100% (10/10 plans) MILESTONE COMPLETE — shipped 2026-04-06
v1.4: [██████████] 100% (13/13 plans) MILESTONE COMPLETE — shipped 2026-04-08
v1.5: [██████████] 100% (20/20 plans) MILESTONE COMPLETE — shipped 2026-04-10
v1.6: [██████████] 100% (10/10 plans) MILESTONE COMPLETE — shipped 2026-04-11
v1.7: [██████████] 100% MILESTONE COMPLETE — shipped 2026-04-25
v1.8: [████░░░░░░]  33% (2/6 phases complete; 1 planned) Phases 57+58 COMPLETE; Phase 59 PLANNED (3 plans, 0/3 executed)
```

## v1.8 Phase Map

| Phase | Name | Requirements | Status |
|-------|------|--------------|--------|
| 57 | Diagnosis Pass + Aesthetic-of-Record Lock-in | DGN-01, DGN-02, DGN-03, AES-01, AES-02, AES-03, AES-04 | Complete (3/3 plans) |
| 58 | Lighthouse CI + Real-Device Telemetry | CIB-01, CIB-02, CIB-03, CIB-04, CIB-05 | Complete (2/2 plans, code-side green; 2 HUMAN-UAT items pending) |
| 59 | Critical-Path Restructure | CRT-01, CRT-02, CRT-03, CRT-04, CRT-05 | Planned (3 plans, 0/3 executed) |
| 60 | LCP Element Repositioning | LCP-01, LCP-02, LCP-03 | Not started |
| 61 | Bundle Hygiene | BND-01, BND-02, BND-03, BND-04 | Not started |
| 62 | Real-Device Verification + Final Gate | VRF-01, VRF-02, VRF-03, VRF-04, VRF-05 | Not started |

**Build-order constraints (encoded in ROADMAP.md):**

- Phase 57 is HARD prereq for all others.
- Phase 58 must land BEFORE Phase 59.
- Phase 60 ⊥ Phase 61 (parallel-safe).
- Phase 59 expects ≥3 plans per CRT-05 (clean bisect).
- Phase 62 mid-milestone real-device checkpoint (VRF-04) fires after Phase 60, not deferred.

## v1.7 Phase Map (archived)

| Phase | Name | Requirements | Status |
|-------|------|--------------|--------|
| 44 | Copy Audit Fixes | COP-01..06 | Complete |
| 45 | Token Bridge | TBR-01..04 | Complete |
| 46 | Tightening Pass | TGH-01..04 | Complete |
| 47 | Viewport Polish | VPT-01..04 | Complete |
| 48 | Intensity Bridge + Chromatic Setup | SIG-01..05, VRG-01 | Complete |
| 49 | Grain + Idle Escalation + Visual Baseline | GRN-01..04, VRG-02 | Complete |
| 50 | VHS Enhancement | VHS-01..06 | Complete |
| 50.1 | Datamosh Overlay | DTM-01..04 | Complete |
| 51 | Halftone Texture | HLF-01..04 | Complete |
| 52 | Circuit Overlay | CIR-01..03 | Complete |
| 53 | Mesh Gradient | MSH-01..03 | Complete |
| 54 | Particle Field | PTL-01..04 | Complete |
| 55 | Glitch Transition | GLT-01..03 | Complete |
| 56 | Symbol System + Final Gate | SYM-01..03, VRG-03, PRF-01..04 | Complete |

## v1.6 Phase Map (archived)

| Phase | Name | Requirements | Status |
|-------|------|--------------|--------|
| 36 | Housekeeping & Carry-Overs | CO-01..04 | Complete |
| 37 | Next.js 16 Migration | MG-01..03 | Complete |
| 38 | Test & Quality Hardening | QA-01..03 | Complete |
| 39 | Library Build Pipeline | LIB-01..03 | Complete |
| 40 | API Documentation & DX | DOC-01..04 | Complete |
| 41 | Distribution & Launch Gate | DIST-01..04 | Complete |
| 42 | Tracking Reconciliation + peerDep Fix | CO-01-04, LIB-01-03 (gap closure) | Complete |
| 43 | Production Deploy + Lighthouse Gate | DIST-04 (gap closure) | Complete |

## v1.5 Phase Map (archived)

| Phase | Name | Requirements | Status |
|-------|------|--------------|--------|
| 28 | Route Infrastructure | RA-01..04 | Complete |
| 29 | Infrastructure Hardening | PF-04..06 | Complete |
| 30 | Homepage Architecture + ENTRY Section | RA-05, EN-01..05, VL-03, VL-07 | Complete |
| 31 | THESIS Section | TH-01..06 | Complete |
| 32 | SIGNAL + PROOF Sections | SG-01..05, PR-01..06 | Complete |
| 33 | INVENTORY + ACQUISITION Sections | IV-01..06, AQ-01..05 | Complete |
| 34 | Visual Language + Subpage Redesign | VL-01..02, VL-04..06, SP-01..05 | Complete |
| 35 | Performance + Launch Gate | PF-01..03, LR-01..04 | Complete |

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

- Phase ordering is dependency-forced: tech debt → tokens → components → detail data → detail views → verification. Do not reorder.
- MutationObserver disconnect FIRST: Detail views dramatically increase mount/unmount frequency. Observer accumulation without disconnect causes WebGL jank.
- ComponentDetail as DOM sibling: The panel must be rendered after the GSAP Flip grid div, NOT inside it. Child position corrupts Flip state captures during filter animations.
- next/dynamic for ComponentDetail: Bundle gate compliance is non-negotiable. Import all 49 component previews at top-level = bundle balloon.
- shiki/core only: Use `shiki/core` fine-grained (~50-80 KB async, server-only). Never `shiki/bundle/web` (695 KB gzip) or `shiki/bundle/full` (6.4 MB).
- Z-index contract: Canvas cursor at z-500; detail panel must use `--z-overlay` token; add `[data-modal-open]` CSS rule dropping cursor z-index below panel when open.
- lenis.scrollTo only: Any programmatic scroll from detail view code must use `lenis.scrollTo`. Never `window.scrollTo`. Grep check before any scroll-touching phase.
- Bundle gate at v1.4 ship: 100.0 KB gzip shared bundle (50 KB under 150 KB gate)
- Lighthouse at v1.4 ship: 100/100 all categories confirmed against deployed URL

### v1.5 Critical Constraints (Carried Forward)

- Infrastructure before features: fonts-ready, overscroll-behavior, Lenis audit, and Observer registration MUST precede any new scroll or WebGL work.
- WebGL context limit on mobile: Safari iOS enforces 2-8 WebGL contexts. SignalCanvas scissor singleton already handles this — do not create additional renderers.
- LCP suppression hazard: Hero heading must NOT use `opacity: 0` as start state. Use `opacity: 0.01` or `clip-path` reveal.
- SIGNAL/FRAME ordering: Always written as SIGNAL/FRAME (signal first), never FRAME/SIGNAL, in all code comments, docs, and UI labels.
- Zero new npm runtime packages: All animation via GSAP ScrollTrigger + Lenis (already in stack).

### v1.6 Decisions (Carried Forward)

- [Phase 36]: @typescript-eslint packages need direct devDep install in pnpm projects — transitive deps are not hoisted
- [Phase 36]: JSX // text content must be wrapped in {"//"} expressions — react/jsx-no-comment-textnodes fires on any // sequence in JSX children
- [Phase 36-01]: headers() in layout.tsx forces dynamic rendering — remove entirely; layout becomes sync, all routes static
- [Phase 38]: passWithNoTests: true required in vitest.config.ts — vitest 4.x exits code 1 on empty suite by default
- [Phase 38-02]: color: transition removed from global * rule — axe-core samples mid-transition interpolated hex values
- [Phase 41-distribution-launch-gate]: GSAP SSR guard: all module-level registerPlugin() calls wrapped in typeof window check
- [Phase 42-tracking-reconciliation-peerdep-fix]: next moved from dependencies to peerDependencies with optional:true

### v1.7 Critical Constraints (Carried Forward)

- Phase 48 was prerequisite for all v1.7 effect phases (intensity bridge); pattern transferable: prerequisite phases gate downstream measurement.
- WebGL singleton rule (PTL-01) absolute on iOS Safari — context creation hard cap 2-8.
- Static grain ceiling: > 0.07 opacity is anti-feature.
- PRF-01-04 launch gate requirements (closed in v1.7); v1.8's CIB gate is the durable replacement.
- Safari backdrop-filter: no var() references in -webkit-backdrop-filter — literal values only.
- Zero new runtime npm dependencies (Chromatic devDep only).

### v1.8 Critical Constraints

- **Phase 57 is HARD prerequisite for Phases 58-62.** Diagnosis (LCP element identity, per-chunk attribution) gates every optimization commit.
- **Phase 58 must land before Phase 59** — LHCI gate is non-optional given Phase 59's CLS-protection-touching changes.
- **Aesthetic preservation is the milestone-wide standing rule** (AES-01..04 documented in Phase 57). No Chromatic re-baseline for perf changes; only documented exception is Anton `optional → swap` in Phase 59 per `feedback_ratify_reality_bias.md`.
- **CRT-05 split**: Phase 59 ships ≥3 plans (sync-script, Anton subset+swap, Lenis rIC) for clean bisect. Single-PR collapse is a phase failure.
- **Phase 60 ⊥ Phase 61** (parallel-safe); both depend only on Phase 57.
- **VRF-04 mid-milestone real-device checkpoint after Phase 60** is non-negotiable per Pitfall #10 — discovering real-device blocker at end is a refactor crisis.
- **`/sf-canvas-sync.js` is NOT dead code** — inline IIFE in `<body>` tail, never `defer`/`async`, never `next/script strategy="beforeInteractive"` (Pitfalls #2, #8).
- **PF-04 contract**: Lenis `autoResize: true` is code-of-record. Do not revert under perf pressure.
- **Single-ticker rule**: any new rAF call site is a violation. Use GSAP ticker or PerformanceObserver only (Pitfall #5).
- **`experimental.inlineCss: true` is rejected** — breaks `@layer signalframeux` cascade ordering (vercel/next.js#47585; Pitfall #7).
- **No new runtime npm dependencies in v1.8** — devDep additions limited to `@lhci/cli` + optional `web-vitals` (attribution only).
- **Stale-chunk guard**: `rm -rf .next/cache .next` before any gating measurement (BND-04).

### Decisions

| Decision | Rationale |
|----------|-----------|
| 6 phases (57-62) — diagnosis, gate, restructure, LCP, bundle, verification | Each phase delivers one coherent, verifiable capability; dependency ordering forces this minimum count |
| Phase 57 owns AES-01..04 (not a separate phase) | AES-02..04 are standing rules referenced from `AESTHETIC-OF-RECORD.md`, not a phase's own deliverables. Avoids phase proliferation while keeping single-source traceability |
| Phase 58 LHCI gate before Phase 59 | Phase 59 actively manipulates CLS-protection critical path (HIGH RISK). Without LHCI, regression caught only at end-milestone |
| Phase 59 ships 3 separate PRs (CRT-05) | Clean bisect if any single change regresses (sync-script vs Anton vs Lenis are independent intervention surfaces) |
| Phase 60 plan shape contingent on Phase 57 diagnosis | Three intervention paths (THESIS clip-path, ghost-label content-visibility, hero h1 char-reveal); diagnosis picks one |
| Phase 60 ⊥ Phase 61 parallel-safe | Both depend on Phase 57 audit; if executed in parallel, separate plans within each phase, not interleaved |
| VRF-04 mid-milestone (post-Phase-60), not phase-end | Pitfall #10: discovering real-device blocker after all phases ship is a refactor crisis |
| `@lhci/cli` over `launch-gate.ts` extension | LHCI natively supports cold-start variance discipline (warmup×2, numberOfRuns:5, median, threshold buffer); `launch-gate.ts` retained for prod 100/100 manual verification |
| `useReportWebVitals` (built-in) over `@vercel/speed-insights` | Zero new runtime dep. Self-hosted RUM endpoint via `navigator.sendBeacon` |
| Inline `/sf-canvas-sync.js` IIFE in `<body>` tail (NOT delete) | Direct read of script content + scale-canvas.tsx confirms it is NOT dead code; STACK.md "delete" recommendation is wrong. Inline preserves CLS=0, removes render-blocking external request |
| Phase 57 Plan 03 Task 4 executed autonomously (D-04 override) | Programmatic `chartData` JSON extraction from `.next/analyze/client.html` replaces human treemap inspection. User memory `feedback_autonomous_forward_motion` mandates no pause; equivalent fidelity. Override documented in v1.8-lcp-diagnosis.md header for audit. |
| LCP candidate diverges across viewports (mobile vs desktop) | Mobile = THESIS GhostLabel (4% opacity wayfinding glyph, ghost-label.tsx:11-23); desktop = VL-05 magenta `//` overlay (entry-section.tsx:208). Phase 60 LCP-02 selection MUST branch on viewport — single-intervention shipping picks one viewport, regresses the other. |
| All 4 v1.7 named chunk IDs MATCHED in v1.8 build | Pitfall D fallback NOT triggered. Chunk IDs 3302, e9a6067a, 74c6194b, 7525 all preserved across v1.7→v1.8 webpack output. Phase 61 BND-02 work targets known IDs without rediscovery. |

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-25 after v1.7 archival, v1.8 milestone defined)

**Core value:** Dual-layer SIGNAL/FRAME model — generative expression through deterministic structure
**Current focus:** v1.8 Speed of Light — performance recovery to original CLAUDE.md gate (Lighthouse 100/100, LCP <1.0s, CLS=0, TTI <1.5s, <200KB initial)

## Session Continuity

Last session: 2026-04-26T01:38:24.407Z
Stopped at: Completed 57-03-PLAN.md — Phase 57 COMPLETE (3/3 plans, 7/7 reqs); Phases 58-62 unblocked
Resume with: `/pde:plan-phase 58` for Lighthouse CI + Real-Device Telemetry (CIB-01..05). Phase 58 must land BEFORE Phase 59 (LHCI gate is non-optional given Phase 59's CLS-protection-touching changes). Phase 60 plan-shape is contingent on `v1.8-lcp-diagnosis.md` §1 — note cross-viewport LCP divergence (mobile = THESIS GhostLabel, desktop = VL-05 `//` overlay) requires per-viewport intervention selection. Phase 61 BND-02 reads §2 chunk attribution (all 4 v1.7 IDs matched + 7 NEW_FINDING chunks > 50KB).
