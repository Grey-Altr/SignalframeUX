---
pde_state_version: 1.0
milestone: v1.2
milestone_name: Tech Debt Sweep
status: roadmap_ready
stopped_at: Roadmap created — ready for Phase 10 planning
last_updated: "2026-04-06T13:30:00.000Z"
last_activity: "2026-04-06 — v1.2 roadmap created (6 phases, 9 requirements)"
progress:
  total_phases: 6
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
---

# STATE — SignalframeUX

## Quick Reference

| Property | Value |
|----------|-------|
| Project | SignalframeUX — Design System for Culture Division |
| Core Value | Dual-layer FRAME/SIGNAL model — deterministic structure + generative expression |
| Current Focus | v1.2 Tech Debt Sweep — close all carried debt |
| Milestone | v1.2 Tech Debt Sweep |

## Current Position

Phase: Phase 10 — Foundation Fixes (not started)
Plan: —
Status: Roadmap ready, awaiting Phase 10 planning
Last activity: 2026-04-06 — v1.2 roadmap created (6 phases, 9 requirements mapped)

## Progress

```
v1.0: [██████████] 100% (14/14 plans) MILESTONE COMPLETE — shipped 2026-04-05
v1.1: [██████████] 100% (9/9 plans) MILESTONE COMPLETE — shipped 2026-04-06
v1.2: [░░░░░░░░░░]   0% (0/? plans) ROADMAP READY — Phase 10 next
```

## v1.2 Phase Map

| Phase | Goal | Requirements | Status |
|-------|------|--------------|--------|
| 10. Foundation Fixes | Zero type mismatches, correct CSS var defaults | FND-01, FND-02, INT-01 | Not started |
| 11. Registry Completion | Full 34-component CLI-installable registry | DX-04 | Not started |
| 12. SIGNAL Wiring | CSS→WebGL bridge + SignalMotion on showcase | INT-04, INT-03 | Not started |
| 13. Config Provider | createSignalframeUX factory + useSignalframe | DX-05 | Not started |
| 14. Session Persistence | Filter/tab/scroll state via sessionStorage | STP-01 | Not started |
| 15. Documentation Cleanup | Frontmatters, stale checkboxes, API contracts | DOC-01 | Not started |

## Accumulated Context

### From v1.0 (Carried Forward)
- Token system locked: 9 blessed spacing stops, 5 semantic typography aliases, 5 layout tokens, tiered color palette
- 29 SF-wrapped components (24 interactive + 5 layout primitives)
- SIGNAL layer: ScrambleText, asymmetric hover (100ms/400ms), 34ms hard-cut, canvas cursor, stagger batch
- DX: SCAFFOLDING.md (337 lines), JSDoc coverage, DX-SPEC.md with deferred interface sketches

### From v1.1
- Singleton WebGL infrastructure: SignalCanvas, useSignalScene, color-resolve with TTL cache
- Multi-sensory SIGNAL: audio (Web Audio), haptics (Vibration API), idle animation (grain drift + OKLCH pulse)
- Generative scenes: SignalMesh (Three.js), TokenViz (Canvas 2D), GLSLHero (GLSL + Bayer dither)
- SF primitives consumed across all 5 pages (32 SFSection instances)
- Three.js in async chunk (102 kB initial shared bundle)

### v1.2 Research Findings (Critical)
- FND-01 FIRST: --signal-* CSS var defaults must exist before INT-04 wiring — missing defaults cause magenta flash via color-resolve.ts fallback
- INT-04 performance rule: NO per-frame getComputedStyle() — module-level cache + MutationObserver or direct invalidation from SignalOverlay
- --signal-accent is a float (hue degrees), not a color token — use parseFloat() directly, never resolveColorToken
- DX-05 SSR boundary: "hole in the donut" pattern mandatory — SignalframeProvider is 'use client' but {children} remain Server Components
- STP-01 hydration safety: render default state first, read sessionStorage only in useEffect after mount
- bgShift type fix: fix all consumer call sites in same commit, never @ts-ignore, run tsc --noEmit before and after

### Decisions

| Decision | Rationale |
|----------|-----------|
| Include all 9 debt items | User wants full sweep, no deferral |
| v1.2 (not v2.0) | Maintenance release, no breaking API changes |
| Phase 10 groups FND-01, FND-02, INT-01 | All are mechanical zero-dependency fixes, fastest to clear together |
| Phase 11 (registry) before Phase 14 (session) | ComponentsExplorer fully populated before session state wired |
| Phase 12 requires Phase 10 | FND-01 CSS var defaults are prerequisite for INT-04 WebGL reads |
| Phase 13 after Phase 12 | Provider architecture benefits from stable SIGNAL wiring |

### Blockers
- None

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-06)

**Core value:** Dual-layer FRAME/SIGNAL model — deterministic structure + generative expression
**Current focus:** v1.2 Tech Debt Sweep — close all carried debt

## Session Continuity

Last session: 2026-04-06
Stopped at: v1.2 roadmap created
Resume with: `/pde:plan-phase 10`
