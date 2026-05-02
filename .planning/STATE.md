---
gsd_state_version: 1.0
milestone: v1.10
milestone_name: milestone
status: executing
stopped_at: Phase 71 planning complete — 3 plans (DEP-01 + DT-01..06 + TST-03), 11 tasks, plan-checker PASS
last_updated: "2026-05-02T23:04:33.322Z"
last_activity: 2026-05-02
progress:
  total_phases: 6
  completed_phases: 5
  total_plans: 12
  completed_plans: 13
  percent: 100
---

# STATE — SignalframeUX

## Quick Reference

| Property | Value |
|----------|-------|
| Project | SignalframeUX — Design System for Culture Division |
| Core Value | Dual-layer SIGNAL/FRAME model — generative expression through deterministic structure |
| Current Focus | v1.10 Library Completeness — Phase 71 complete; ready for Phase 72 (SFCombobox) |
| Milestone | v1.10 Library Completeness (active) |

## Current Position

Phase: 76
Plan: Not started
Status: Executing Phase 75
Last activity: 2026-05-02

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
v1.9: [██████████] 100% (5 phases / 11 plans) MILESTONE COMPLETE — shipped 2026-04-30
v1.10: [█▋        ] 17% (1/6 phases) IN PROGRESS — Phase 71 complete
```

## v1.10 Phase Map

| Phase | Name | Requirements | Status |
|-------|------|--------------|--------|
| 71 | SFDataTable | DT-01..06, DEP-01, TST-03 | Complete (3 plans) |
| 72 | SFCombobox | CB-01..04, TST-03 | Not started |
| 73 | SFRichEditor | RE-01..06, DEP-02, TST-03 | Not started |
| 74 | SFFileUpload | FU-01..05, TST-03, TST-04 | Not started |
| 75 | SFDateRangePicker | DR-01..06, TST-03 | Not started |
| 76 | Final Gate | REG-01, BND-08, AES-05 | Not started (hard dep: 71–75 all) |

**Build-order constraints (encoded in ROADMAP.md):**

- Phases 71–75 have NO hard build-order dependencies among themselves — all building blocks exist; ordering is risk-sequencing only.
- Phase 76 is a HARD dependency on all of Phases 71–75.
- Risk sequence rationale: dep-first (71: TanStack Table), confidence-builder (72: zero-dep Pattern C), SSR-complexity (73: Tiptap), zero-dep breathing room (74: FileUpload), complex-composition (75: DateRangePicker).

## v1.9 Phase Map (archived)

| Phase | Name | Requirements | Status |
|-------|------|--------------|--------|
| 66 | ScaleCanvas Track B + GhostLabel Pseudo-Element | ARC-01..04 | Complete |
| 67 | Bundle Barrel-Optimization (D-04 Unlock) | BND-05..07 | Complete |
| 68 | lcp-guard Structural Refactor | TST-01..02 | Complete |
| 69 | Wordmark Cross-Platform Pixel-Diff Alignment | WMK-01..02 | Complete |
| 70 | v1.8 Verification Closure (VRF-01/04/05) | VRF-06..08 | Complete |

## v1.8 Phase Map (archived)

| Phase | Name | Requirements | Status |
|-------|------|--------------|--------|
| 57 | Diagnosis Pass + Aesthetic-of-Record Lock-in | DGN-01, DGN-02, DGN-03, AES-01, AES-02, AES-03, AES-04 | Complete (3/3 plans) |
| 58 | Lighthouse CI + Real-Device Telemetry | CIB-01, CIB-02, CIB-03, CIB-04, CIB-05 | Complete (2/2 plans, code-side green; 2 HUMAN-UAT items pending) |
| 59 | Critical-Path Restructure | CRT-01, CRT-02, CRT-03, CRT-04, CRT-05 | Complete (3/3 plans, AES-02 exception ratified) |
| 60 | LCP Element Repositioning | LCP-01, LCP-02, LCP-03 | Complete (2/2 plans, ratified 2026-04-27 via 62-03 W2b spot-check) |
| 61 | Bundle Hygiene | BND-01, BND-02, BND-03, BND-04 | Complete (3/3 plans, all 4 BND + AES-04 SATISFIED post-recalibration) |
| 62 | Real-Device Verification + Final Gate | VRF-01, VRF-02, VRF-03, VRF-04, VRF-05 | Closed-with-deferrals 2026-04-27 (3 PASS: VRF-02 post-path_b, VRF-03, AES-04; 3 DEFERRED to v1.9: VRF-01, VRF-04, VRF-05) |

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

### v1.10 Critical Constraints (New)

- **`_dep_X_decision` blocks at plan-time, not post-hoc** — authored before `pnpm add`; bundle_evidence field populated post-install from `ANALYZE=true pnpm build` measurement (not an estimate). Pattern extends `_wmk_01_decision` (v1.9 Phase 69).
- **D-04 chunk-ID lock holds throughout v1.10** — no `optimizePackageImports` additions; new heavy deps (TanStack Table, Tiptap) land in P3 lazy chunks by route, which is the correct mechanism without touching the 8-entry list.
- **P3 lazy mandatory for SFDataTable + SFRichEditor** — `next/dynamic({ ssr: false })`; never in barrel; consumers import direct path. SFDateRangePicker achieves laziness through SFCalendarLazy composition.
- **Tiptap CSS isolation is non-negotiable** — `injectCSS: false` on every `useEditor()`; `.ProseMirror *` rules in `app/globals.css` under `@layer signalframeux`; no Tiptap CSS imports anywhere.
- **react-day-picker CSS isolation is non-negotiable** — `classNames` prop only; `import 'react-day-picker/dist/style.css'` is prohibited.
- **`new Date()` only in `useEffect` or `useMemo`** — module-level `new Date()` in SFDateRangePicker is an SSR hydration mismatch trap.
- **SFFileUpload `dataTransfer.files` gap is permanent** — split test strategy (setInputFiles + Chromatic) must be documented in the plan, not treated as a TODO.
- **Bundle headroom at v1.10 start: 12.4 KB** — (200 KB hard target − 187.6 KB current); both new dep sets (TanStack Table ~12 KB gzip + Tiptap ~55-70 KB gzip) must land in lazy chunks only.
- **SCAFFOLDING.md component count target: 58** — stale at "49" as of v1.9 close; v1.10 ships 5 new components; Phase 76 updates the header.
- **Worktree leakage guard**: `git status` before every commit; untracked files in `components/sf/` not authored in-phase are leakage artifacts (`.claude/worktrees/` gitignored but leakage mechanism active).

### Decisions

| Decision | Rationale |
|----------|-----------|
| 6 phases (71-76) — per-component + final gate | Each component phase delivers one complete, verifiable component; Phase 76 gates bundle + aesthetic + registry; research-confirmed shape |
| Risk-sequencing order (71→72→73→74→75) | No hard build-order deps; dep-first (71 TanStack), confidence-builder (72 zero-dep), SSR-complexity (73 Tiptap), breathing room (74 FileUpload), complex-composition (75 DateRangePicker) |
| P3 lazy for SFDataTable + SFRichEditor | Only mechanism that keeps First Load JS under 200 KB with two heavy new dep sets; D-04 lock means optimizePackageImports cannot be used |
| Pattern C barrel export for SFCombobox, SFFileUpload, SFDateRangePicker | Pure-SF compositions with no new runtime deps; safe for barrel inclusion; sf/index.ts remains directive-free |
| Virtualization (SFDataTableVirtual) deferred to v1.11 | Research consensus: `_dep_dt_02_decision` (TanStack Virtual) is v1.11 scope; DT-05 documents `virtualize` prop as JSDoc extension point only |
| Tiptap version chosen at Phase 73 plan time via `_dep_re_01_decision` | v3.22.5 recommended (maintained track); final choice + ProseMirror chain recorded before `pnpm add` |
| No SFTimePicker extraction | Single v1.10 consumer (SFDateRangePicker); `<SFInput type="time">` inline avoids premature abstraction |

- [Phase 63.1]: D-04 ratified: chunk 3302 dissolved in Phase 61; stable IDs now 4335/e9a6067a/74c6194b/7525 (feedback_ratify_reality_bias)
- [Phase 63.1]: optimizePackageImports additions rejected for Plan 01: any new entry reshuffles splitChunks graph non-additively; bundle reduction delegated to Plans 02+03
- [Phase 63.1]: next/dynamic ssr:true confirmed partial-split only (Next.js #61066): App Router Server Component dynamic imports do not emit separate JS chunks; structure preserved for Plan 02 rIC work
- [Phase 63.1]: CRT-04 rIC pattern applied to 4 section useGSAP callbacks: thesis/signal/proof/inventory deferred to idle; hook stays synchronous; single-ticker + no-polyfill invariants preserved
- [Phase 63.1]: D-03 Candidate A executed: CdCornerPanel hoisted to direct <body> child BEFORE TooltipProvider; Candidate B rejected (D-12 BLOCK); Candidate C reserved as WPT-triggered escalation
- [Phase 63.1]: D-12 wordmark fidelity baseline captured at 0% pixel diff across 4 viewports post-hoist; spec tests/v1.8-phase63-1-wordmark-hoist.spec.ts is the ongoing fidelity gate

### Roadmap Evolution

- Phase 63.1 inserted after Phase 63: LCP Fast-Path Remediation (URGENT) — addresses real-device LCP FAIL on all 3 profiles found by Phase 63 Plan 01 (Catchpoint/WPT synthesis); Pitfall #10 TRIGGER on LCP (real÷synthetic = 2.95×) and TTI (6.0×). Wordmark `<text>` element is the unambiguous LCP candidate across all viewports per `63-MID-MILESTONE-CHECKPOINT.md` §3.
- v1.10 roadmap finalized 2026-05-01: 6 phases (71-76), 34 REQ-IDs, research-confirmed shape; DT virtualization out of scope (research consensus); D-04 lock holds (no optimizePackageImports changes needed)

## Project Reference

See: .planning/PROJECT.md (updated 2026-05-01 for v1.10 kickoff)

**Core value:** Dual-layer SIGNAL/FRAME model — generative expression through deterministic structure
**Current focus:** Phase 75 — sfdaterangepicker

## Session Continuity

Last session: 2026-05-01T19:09:36.150Z
Stopped at: Phase 71 planning complete — 3 plans (DEP-01 + DT-01..06 + TST-03), 11 tasks, plan-checker PASS

**v1.10 carry-forward backlog (from v1.9 close):**

1. **VRF-07 iOS sub-cohort partition** — auto-resolves when Vercel CLI exposes `proxy.userAgent` from Drains-style records; not actionable in v1.10
2. **13 stale agent worktrees** in `.claude/worktrees/` from 2026-04-28..30 — gitignored 2026-04-30, pruning deferred per worktree-leakage caution
3. **Cosmetic dual-source-of-truth** in `scripts/launch-gate-vrf02-runner.mjs:30` — `cls_max:0` vs lighthouserc `cls 0.005`; observed 0.0042 satisfies both, alignment is hygiene
4. **Localhost Phase 60 LCP=810ms** baseline carry-over — superseded by Phase 62 prod 657ms + Phase 70 RUM p75=264ms; v1.10 reviewers should treat 810ms as superseded

**Active separate tracks (per memory, not v1.10):**

- `cdb-v3-dossier` — fully shipped (T1-T8 + D8.x + D9.x + D10.x polish waves); parallel aesthetic branch, no merge-to-main intent
- `exp/pixel-sort-transitions` — SPIKE-2 awaits (kernel extraction → shader prototype); could be pulled into v1.11 craft-completion milestone

**Resume:** `/pde:execute-phase 71` to execute SFDataTable (Wave 1 = 71-01 `_dep_dt_01_decision` + install + bundle measurement; sequential through Wave 3).
