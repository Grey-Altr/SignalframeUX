---
pde_state_version: 1.0
milestone: v1.1
milestone_name: Generative Surface
status: completed
stopped_at: Completed 09-02-PLAN.md (SignalMotion + SignalOverlay)
last_updated: "2026-04-05T00:02:00.000Z"
last_activity: "2026-04-05 — Plan 09-02 complete (2 tasks, 2 commits: 507826f, 36bdbeb)"
progress:
  total_phases: 4
  completed_phases: 3
  total_plans: 6
  completed_plans: 6
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

Phase: 9 — Extended Scenes + Production Integration
Plan: 03 (next)
Status: Plan 02 complete — SignalMotion scrub wrapper + SignalOverlay CSS property bridge panel; INT-03 + INT-04 met.
Last activity: 2026-04-05 — Plan 09-02 complete (2 tasks, 2 commits: 507826f, 36bdbeb)

## Progress

```
Phase 1 — FRAME Foundation:                    [██████████] 100% (3/3 plans) COMPLETE
Phase 2 — FRAME Primitives:                    [██████████] 100% (2/2 plans) COMPLETE
Phase 3 — SIGNAL Expression:                   [██████████] 100% (4/4 plans) COMPLETE
Phase 4 — Above-the-Fold Lock:                 [██████████] 100% (3/3 plans) COMPLETE
Phase 5 — DX Contract & State:                 [██████████] 100% (2/2 plans) COMPLETE
Phase 6 — Generative SIGNAL Foundation:        [██        ]  ~40% (2/? plans) In progress
Phase 7 — SIGNAL Activation:                   [████      ]  ~50% (2/? plans) In progress
Phase 8 — First Generative Scenes:             [██████████] 100% (2/2 plans) COMPLETE — SCN-01 + SCN-02 complete
Phase 9 — Extended Scenes + Integration:       [███       ]  ~33% (1/3 plans) In progress — INT-03 + INT-04 complete

v1.0: [██████████] 100% (15/15 plans) MILESTONE COMPLETE
v1.1: [███       ]  ~30% (6/? plans)
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
**07-01:** Document-level delegation over per-component wiring — single InteractionFeedback component in GlobalEffects handles all interactive elements; no SF component modifications needed.
**07-01:** coarse-pointer skips hover audio setup entirely — touch devices have no hover state; pointerdown haptics still fire naturally via the same listener when on coarse devices (but listener is not added for coarse-pointer, so hover is also skipped for haptics — intentional; micro-vibration on touch hover is not meaningful without a hover state).
**07-02:** ticker-accumulation-guard — old ticker explicitly removed before registering new one in idle activation; prevents multiple pulseFn callbacks accumulating across repeated idle cycles.
**07-02:** data-cursor explicit per-section placement — added to data-bg-shift divs and showcase main elements, not at SFSection primitive level; preserves showcase zone intentionality.
**08-01:** next/dynamic({ ssr: false }) requires a 'use client' wrapper in Next.js 15 — cannot be used inline in Server Components; signal-mesh-lazy.tsx wraps the dynamic import, mirroring SignalCanvasLazy pattern.
**08-01:** TTL cache in color-resolve.ts is opt-in (omit options = no-cache) — preserves Phase 6 behavior for color-cycle-frame.tsx which mutates --color-primary dynamically; cache is opt-in via { ttl: ms }.
**08-02:** Client boundary wrapper required for ssr:false dynamic imports in Next.js 15 Server Components — TokenVizLoader wraps the dynamic import, keeping TokensPage a Server Component.
**08-02:** 10-entry type scale used (not 9) — globals.css includes --text-md at 16px alongside the expected 9 entries; accurate representation takes precedence over the plan spec.
**09-02:** SFSlider used over native input[type=range] in SignalOverlay — already SF-styled (square thumb, square track, primary fill), Radix a11y included, consistent with system aesthetic.
**09-02:** Reset button added to SignalOverlay beyond plan spec — CSS custom properties persist on :root across navigation; reset is essential for demo UX and not optional.
**09-02:** Speed slider hidden (not just disabled) on reduced-motion — shows "Reduced motion active" message; clearer UX signal than a grayed-out unresponsive slider.

### Blockers
- None

## Roadmap

| Phase | Goal | Requirements | Status |
|-------|------|--------------|--------|
| 6 — Generative SIGNAL Foundation | Singleton WebGL infrastructure validated, all safety constraints enforced | GEN-01–05 (5 reqs) | In progress (2/? plans) |
| 7 — SIGNAL Activation | Dormant effects activated: cursor, idle, audio, haptic | SIG-06, SIG-07, SIG-08, SIG-09 (4 reqs) | In progress (2/? plans) — SIG-06, SIG-07, SIG-08, SIG-09 complete |
| 8 — First Generative Scenes | SignalMesh validates full WebGL pipeline; token viz via Canvas 2D | SCN-01, SCN-02 (2 reqs) | In progress (2/? plans) — SCN-01 + SCN-02 complete |
| 9 — Extended Scenes + Integration | ASCII shader, GLSL hero, showcase pages on SF primitives | SCN-03, SCN-04, INT-01–04 (6 reqs) | In progress (1/3 plans) — INT-03 + INT-04 complete |

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-05)

**Core value:** Dual-layer FRAME/SIGNAL model — deterministic structure + generative expression
**Current focus:** Phase 8 — First Generative Scenes

## Session Continuity

Last session: 2026-04-05
Stopped at: Completed 09-02-PLAN.md (SignalMotion + SignalOverlay CSS bridge panel)
Resume file: .planning/phases/09-extended-scenes-production-integration/09-03-PLAN.md
