---
phase: 12-signal-wiring
plan: "01"
subsystem: animation/WebGL
tags: [signal-wiring, webgl, gsap-ticker, mutation-observer, INT-04]
dependency_graph:
  requires: [10-01]
  provides: [INT-04]
  affects: [components/animation/glsl-hero.tsx, components/animation/signal-mesh.tsx]
tech_stack:
  added: []
  patterns: [module-level-cache, mutation-observer-invalidation, ticker-no-dom-access]
key_files:
  created: []
  modified:
    - components/animation/glsl-hero.tsx
    - components/animation/signal-mesh.tsx
decisions:
  - "Module-level cache (_signalIntensity/_signalSpeed/_signalAccent) shared across instances — avoids duplicate MutationObserver registrations and keeps ticker reads O(1)"
  - "Single MutationObserver per file (guarded by _signalObserver null check) — not per-component-instance, since multiple mounts would create redundant observers"
  - "FBM amplitude floor at 50% (0.5 + uIntensity * 0.5) — prevents GLSLHero going fully dark at uIntensity=0"
  - "uDisplacement ceiling multiplier at _signalIntensity * 2 — default 0.5 yields 1.0x (no behavior change), range [0, 2x]"
metrics:
  duration: "~12 minutes"
  completed: "2026-04-06T11:41:01Z"
  tasks_completed: 2
  tasks_total: 2
  files_modified: 2
requirements_completed: [INT-04]
---

# Phase 12 Plan 01: Signal Wiring — CSS vars to WebGL uniforms

**One-liner:** Module-level MutationObserver cache wires --signal-intensity/speed/accent CSS vars from SignalOverlay to GLSLHero and SignalMesh WebGL uniforms with zero per-frame DOM access.

## What Was Built

Closed the SignalOverlay → WebGL feedback loop. Both WebGL scenes now react to SignalOverlay slider changes in real time:

- **GLSLHero:** FBM noise amplitude scales with `--signal-intensity` via new `uIntensity` uniform; time delta scales with `--signal-speed`; `uAccent` uniform declared and wired (reserved for future hue rotation).
- **SignalMesh:** `uDisplacement` ceiling scales with `--signal-intensity`; uTime increment and mesh rotation scale with `--signal-speed`.

## Implementation Pattern

Both files use an identical module-level cache pattern:

```typescript
// Module-level — shared across component instances
let _signalIntensity = 0.5;
let _signalSpeed = 1.0;
let _signalAccent = 0.0;
let _signalObserver: MutationObserver | null = null;

function readSignalVars(): void {
  const style = getComputedStyle(document.documentElement);
  _signalIntensity = parseFloat(style.getPropertyValue("--signal-intensity") || "0.5");
  _signalSpeed     = parseFloat(style.getPropertyValue("--signal-speed")     || "1");
  _signalAccent    = parseFloat(style.getPropertyValue("--signal-accent")    || "0");
}

function ensureSignalObserver(): void {
  if (_signalObserver || typeof window === "undefined") return;
  readSignalVars();
  _signalObserver = new MutationObserver(readSignalVars);
  _signalObserver.observe(document.documentElement, { attributeFilter: ["style"] });
}
```

`ensureSignalObserver()` is called once inside `useGSAP` before `ScrollTrigger.create`. Ticker callbacks read only from module-level variables — zero DOM access per frame.

## Verification

All acceptance criteria confirmed:

| AC | Status | Evidence |
|----|--------|----------|
| AC-1: glsl-hero module-level cache + MutationObserver | PASS | Lines 46-65 |
| AC-2: FRAGMENT_SHADER uIntensity + uAccent + FBM scaling | PASS | Lines 90-91, 174 |
| AC-3: ticker reads cache only, zero getComputedStyle | PASS | getComputedStyle only at line 52 |
| AC-4: signal-mesh module-level cache + MutationObserver | PASS | Lines 48-67 |
| AC-5: ticker scales time/rotation by speed, onUpdate scales displacement by intensity | PASS | Lines 296, 300, 310, 314 |
| AC-6: pnpm build passes clean | PASS | 8/8 static pages, zero TS errors |

```
grep -rn "getComputedStyle" glsl-hero.tsx signal-mesh.tsx
→ only in readSignalVars() (line 52, line 54) — not in any ticker or onUpdate
grep -c "ensureSignalObserver" glsl-hero.tsx signal-mesh.tsx
→ 2:2 (definition + call each)
```

## Deviations from Plan

### Pre-existing state

`pnpm lint` was non-functional — no ESLint config in the project (next lint prompts interactively). This is a pre-existing project state unrelated to this plan. TypeScript type-check (`pnpm tsc --noEmit`) and full production build (`pnpm build`) passed clean as the quality gate.

Otherwise: plan executed exactly as written. Zero auto-fixes needed.

## Commits

| Task | Commit | Files |
|------|--------|-------|
| Task 1: glsl-hero.tsx signal wiring | `979b872` | components/animation/glsl-hero.tsx |
| Task 2: signal-mesh.tsx signal wiring | `fef77e3` | components/animation/signal-mesh.tsx |

## Self-Check: PASSED

- [x] components/animation/glsl-hero.tsx — modified, committed at 979b872
- [x] components/animation/signal-mesh.tsx — modified, committed at fef77e3
- [x] Module-level cache present in both files
- [x] ensureSignalObserver defined + called (2 occurrences) in both files
- [x] getComputedStyle only in readSignalVars, never in ticker/onUpdate
- [x] Build: 8/8 pages, zero errors
