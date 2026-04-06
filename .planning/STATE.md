---
pde_state_version: 1.0
milestone: v1.1
milestone_name: Generative Surface
status: active
stopped_at: ""
last_updated: "2026-04-06T07:23:00.000Z"
last_activity: "2026-04-06 — Phase 6 Plan 02 complete: singleton SignalCanvas renderer + useSignalScene hook"
progress:
  total_phases: 4
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
| Current Focus | Phase 6: Generative SIGNAL Foundation |
| Milestone | v1.1 Generative Surface |

## Current Position

Phase: 6 — Generative SIGNAL Foundation
Plan: 03 (next)
Status: Plan 02 complete — singleton SignalCanvas renderer + useSignalScene hook delivered
Last activity: 2026-04-06 — Plan 02 complete (3 tasks, 3 commits: 26f0861, d120beb, 78c957b)

## Progress

```
Phase 1 — FRAME Foundation:                    [██████████] 100% (3/3 plans) COMPLETE
Phase 2 — FRAME Primitives:                    [██████████] 100% (2/2 plans) COMPLETE
Phase 3 — SIGNAL Expression:                   [██████████] 100% (4/4 plans) COMPLETE
Phase 4 — Above-the-Fold Lock:                 [██████████] 100% (3/3 plans) COMPLETE
Phase 5 — DX Contract & State:                 [██████████] 100% (2/2 plans) COMPLETE
Phase 6 — Generative SIGNAL Foundation:        [██        ]  ~40% (2/? plans) In progress
Phase 7 — SIGNAL Activation:                   [          ]   0% (0/? plans) Not started
Phase 8 — First Generative Scenes:             [          ]   0% (0/? plans) Not started
Phase 9 — Extended Scenes + Integration:       [          ]   0% (0/? plans) Not started

v1.0: [██████████] 100% (15/15 plans) MILESTONE COMPLETE
v1.1: [█         ]  ~10% (2/? plans)
```

## Accumulated Context

### From v1.0 (Carried Forward)
- Token system locked: 9 blessed spacing stops, 5 semantic typography aliases, 5 layout tokens, tiered color palette
- 29 SF-wrapped components (24 interactive + 5 layout primitives)
- SIGNAL layer: ScrambleText, asymmetric hover (100ms/400ms), 34ms hard-cut, canvas cursor, stagger batch
- DX: SCAFFOLDING.md (337 lines), JSDoc coverage, DX-SPEC.md with deferred interface sketches
- SIGNAL-SPEC.md (259 lines) documenting all effects with timing, fallback, mobile, reduced-motion
- GlobalEffectsLazy pattern via `next/dynamic({ ssr: false })` — template for SignalCanvasLazy

### Known Tech Debt Entering v1.1 (from v1.0 audit)
- SFSection, SFStack, SFGrid exported but zero production consumers — resolved in Phase 9
- [data-cursor] not placed on any section (cursor never activates) — resolved in Phase 7
- Pre-existing TypeScript error in color-cycle-frame.tsx:79 — carry into Phase 6 investigation

### v1.1 Architecture Decisions
- Raw Three.js over R3F — R3F independent rAF loop conflicts with GSAP globalTimeline scalar (confirmed via GitHub #71836)
- OGL (~29KB) for isolated 2D shader effects where Three.js is overkill (ASCII shader, noise fields)
- Singleton `SignalCanvas` renderer — scissor/viewport split, never one renderer per component
- GSAP ticker as render driver — `renderer.render()` called inside `gsap.ticker.add()`, never `renderer.setAnimationLoop()`
- `lib/color-resolve.ts` extracted from canvas-cursor.tsx probe technique — shared by all canvas/WebGL components
- `next/dynamic({ ssr: false })` for all WebGL components — mirrors GlobalEffectsLazy exactly
- Template literal shaders preferred over raw-loader — Turbopack raw-loader is community pattern (MEDIUM confidence)

### Research Flags (Needs Integration Test)
- Turbopack `experimental.turbopack.rules` for GLSL files — validate in Phase 6 before committing; fallback to template literals if unstable
- Lenis + GSAP ticker + Three.js render ordering — build minimal integration test in Phase 6 or Phase 8 before scroll-reactive uniforms at scale
- OGL vs Three.js for ASCII shader (Phase 9) — verify OGL post-process pipeline sufficient before choosing; fallback is Three.js postprocessing with same dynamic import isolation

### Decisions

**06-01:** Project uses pnpm (not npm) — pnpm-lock.yaml present, npm install fails against .pnpm virtual store. Use `pnpm add` for all installs.
**06-01:** No transpilePackages for Three.js — next/dynamic({ ssr: false }) is sufficient SSR guard; transpilePackages has known Turbopack issues (vercel/next.js#63230).
**06-01:** No caching in color-resolve.ts (Phase 6) — color-cycle-frame.tsx mutates --color-primary dynamically; cached values go stale. Optimize in Phase 8.
**06-02:** signal-canvas.tsx not .ts — lib/ file contains a React component with JSX; .tsx extension required by Next.js/Turbopack; @/lib/signal-canvas path alias resolves both extensions.
**06-02:** disposeScene and deregisterScene are separate calls — hook calls both; separation allows future temporary deregistration without GPU disposal.

### Blockers
- None

## Roadmap

| Phase | Goal | Requirements | Status |
|-------|------|--------------|--------|
| 6 — Generative SIGNAL Foundation | Singleton WebGL infrastructure validated, all safety constraints enforced | GEN-01–05 (5 reqs) | In progress (2/? plans) |
| 7 — SIGNAL Activation | Dormant effects activated: cursor, idle, audio, haptic | SIG-06, SIG-07, SIG-08, SIG-09 (4 reqs) | Not started |
| 8 — First Generative Scenes | SignalMesh validates full WebGL pipeline; token viz via Canvas 2D | SCN-01, SCN-02 (2 reqs) | Not started |
| 9 — Extended Scenes + Integration | ASCII shader, GLSL hero, showcase pages on SF primitives | SCN-03, SCN-04, INT-01–04 (6 reqs) | Not started |

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-05)

**Core value:** Dual-layer FRAME/SIGNAL model — deterministic structure + generative expression
**Current focus:** Phase 6 — Generative SIGNAL Foundation

## Session Continuity

Last session: 2026-04-06
Stopped at: Completed 06-02-PLAN.md (singleton SignalCanvas renderer + useSignalScene hook)
Resume file: .planning/phases/06-generative-signal-foundation/06-03-PLAN.md
