---
gsd_state_version: 1.0
milestone: v1.8
milestone_name: Speed of Light
status: complete
last_updated: "2026-04-30T00:09:43.499Z"
last_activity: 2026-04-29 -- v1.8 milestone archived
progress:
  total_phases: 9
  completed_phases: 9
  total_plans: 23
  completed_plans: 23
  percent: 100
---

# STATE — SignalframeUX

## Quick Reference

| Property | Value |
|----------|-------|
| Project | SignalframeUX — Design System for Culture Division |
| Core Value | Dual-layer SIGNAL/FRAME model — generative expression through deterministic structure |
| Current Focus | Planning next milestone (v1.9 TBD) |
| Milestone | v1.8 Speed of Light — SHIPPED 2026-04-29 |

## Current Position

Phase: — (between milestones)
Plan: —
Status: v1.8 archived; v1.9 not yet started
Last activity: 2026-04-29 -- v1.8 Speed of Light milestone archived (PR #4 merged 22:39:56Z, commit 2a825cf)

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
v1.8: [██████████] 100% (9 phases / 23 plans) MILESTONE COMPLETE — shipped 2026-04-29
```

## v1.8 Phase Map

| Phase | Name | Requirements | Status |
|-------|------|--------------|--------|
| 57 | Diagnosis Pass + Aesthetic-of-Record Lock-in | DGN-01, DGN-02, DGN-03, AES-01, AES-02, AES-03, AES-04 | Complete (3/3 plans) |
| 58 | Lighthouse CI + Real-Device Telemetry | CIB-01, CIB-02, CIB-03, CIB-04, CIB-05 | Complete (2/2 plans, code-side green; 2 HUMAN-UAT items pending) |
| 59 | Critical-Path Restructure | CRT-01, CRT-02, CRT-03, CRT-04, CRT-05 | Complete (3/3 plans, AES-02 exception ratified) |
| 60 | LCP Element Repositioning | LCP-01, LCP-02, LCP-03 | Complete (2/2 plans, ratified 2026-04-27 via 62-03 W2b spot-check) |
| 61 | Bundle Hygiene | BND-01, BND-02, BND-03, BND-04 | Complete (3/3 plans, all 4 BND + AES-04 SATISFIED post-recalibration) |
| 62 | Real-Device Verification + Final Gate | VRF-01, VRF-02, VRF-03, VRF-04, VRF-05 | Closed-with-deferrals 2026-04-27 (3 PASS: VRF-02 post-path_b, VRF-03, AES-04; 3 DEFERRED to v1.9: VRF-01, VRF-04, VRF-05) |

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

- [Phase 63.1]: D-04 ratified: chunk 3302 dissolved in Phase 61; stable IDs now 4335/e9a6067a/74c6194b/7525 (feedback_ratify_reality_bias)
- [Phase 63.1]: optimizePackageImports additions rejected for Plan 01: any new entry reshuffles splitChunks graph non-additively; bundle reduction delegated to Plans 02+03
- [Phase 63.1]: next/dynamic ssr:true confirmed partial-split only (Next.js #61066): App Router Server Component dynamic imports do not emit separate JS chunks; structure preserved for Plan 02 rIC work
- [Phase 63.1]: CRT-04 rIC pattern applied to 4 section useGSAP callbacks: thesis/signal/proof/inventory deferred to idle; hook stays synchronous; single-ticker + no-polyfill invariants preserved
- [Phase 63.1]: D-03 Candidate A executed: CdCornerPanel hoisted to direct <body> child BEFORE TooltipProvider; Candidate B rejected (D-12 BLOCK); Candidate C reserved as WPT-triggered escalation
- [Phase 63.1]: D-12 wordmark fidelity baseline captured at 0% pixel diff across 4 viewports post-hoist; spec tests/v1.8-phase63-1-wordmark-hoist.spec.ts is the ongoing fidelity gate

### Roadmap Evolution

- Phase 63.1 inserted after Phase 63: LCP Fast-Path Remediation (URGENT) — addresses real-device LCP FAIL on all 3 profiles found by Phase 63 Plan 01 (Catchpoint/WPT synthesis); Pitfall #10 TRIGGER on LCP (real÷synthetic = 2.95×) and TTI (6.0×). Wordmark `<text>` element is the unambiguous LCP candidate across all viewports per `63-MID-MILESTONE-CHECKPOINT.md` §3.

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-29 after v1.8 archival)

**Core value:** Dual-layer SIGNAL/FRAME model — generative expression through deterministic structure
**Current focus:** Planning next milestone (v1.9 TBD)

## Session Continuity

Last session: 2026-04-29 -- v1.8 Speed of Light archived
Stopped at: v1.8 milestone complete (PR #4 merged 22:39:56Z, commit 2a825cf, 226 commits, 9 phases, 5 days)

**v1.9 carry-over backlog (from v1.8 path_decisions + deferred reqs):**

1. **VRF-01** — WPT real-device verification: 2 of 3 device profiles deferred (iPhone 14 Pro 4G LTE variance 2104ms; Moto G Power 3G Fast 3605ms — Next.js App Router framework chunk ~56 KB gzipped consumes 1867ms TBT, intrinsic to runtime)
2. **VRF-04** — Mid-milestone real-device synthesis: cascade from VRF-01; D-09 ratio gate fail (real÷synthetic 2.37× vs 1.3× threshold); synthetic baseline recalibration needed
3. **VRF-05** — Field RUM telemetry (p75 LCP <1.0s post-deploy ≥24h): activator = fresh prod deploy + 100 sessions; 6-step `v1_9_unblock_recipe` documented at `.planning/perf-baselines/v1.8/vrf-05-rum-p75-lcp.json`
4. **path_h close** — ScaleCanvas mobile breakpoint exception (`transform: none` below `sm`)
5. **path_i close** — GhostLabel low-contrast suppression mechanism (color: transparent + mask-image OR CSS pseudo-element)
6. **path_k close** — Bundle reduction phase allowed to break D-04 chunk-id lock (re-locks new chunk IDs)
7. **path_l close** — lcp-guard refactor (live PerformanceObserver → STRUCTURAL DOM-query test)
8. **Wordmark Linux/darwin pixel-diff** — D-12 0.1% may need 0.5% AES-04 alignment

**Active separate tracks (per memory, not v1.8/v1.9):**

- `cdb-v3-dossier` (separate worktree at `/Users/greyaltaer/code/projects/SignalframeUX-v3`) — T3-T7 plates pending
- `exp/pixel-sort-transitions` — SPIKE-2 awaits (kernel extraction → shader prototype). Unpin condition fired with v1.0 lock.

**Cleanup queue (pre-v1.9 hygiene):**

- Worktree removal: `.claude/worktrees/agent-pr4-merge`, `agent-a2067e28`, `agent-ac998ae6`, `agent-a61d9fac`, `agent-a363e836`, `agent-a6dc4e43` (all PR-merged or session-stale)
- `.planning/CONTINUE-HERE.md` consumed; remove or archive

**Resume:** `/clear` then `/pde:new-milestone` to start v1.9.
