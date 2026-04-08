---
phase: 32-signal-proof-sections
plan: 02
subsystem: signal-section
tags: [webgl, glsl, ikeda, scanlines, sticky-scroll, three-scene-concurrency]
requires:
  - components/animation/glsl-signal.tsx
  - components/animation/glsl-signal-lazy.tsx
  - components/blocks/signal-section.tsx
  - tests/phase-32-signal-proof.spec.ts (SG-01..05 added)
provides:
  - SIGNAL section — 150vh Ikeda data field with sticky viewport lock
  - GLSLSignal — scanlines + data columns + yellow spike markers
  - 3rd concurrent WebGL scene in SignalCanvas singleton
affects:
  - app/page.tsx (SIGNAL stub replaced)
  - playwright.config.ts (--use-gl=swiftshader for headless WebGL)
tech-stack:
  added: []
  patterns:
    - sticky top-0 h-screen for scroll-through viewport lock (no GSAP pin)
    - three-color GLSL uniform registers (foreground/primary/warning)
    - next/dynamic ssr:false for Three.js GLSLSignal
key-files:
  created:
    - components/animation/glsl-signal.tsx
    - components/animation/glsl-signal-lazy.tsx
  modified:
    - components/blocks/signal-section.tsx
    - app/page.tsx
    - tests/phase-32-signal-proof.spec.ts
    - playwright.config.ts
key-decisions:
  - sticky top-0 h-screen instead of parallax translateY — avoids scissor drift + Lenis conflict
  - Ikeda shader rewrite: scanlines + 32-column binary strobing + horizontal bursts + yellow crosshair spikes
  - Three color uniforms (foreground/primary/warning) replace single uColor — brings yellow into the palette
  - No ScrollTrigger scrub — onEnter/onLeave lifecycle only (AC-10 pattern from Plan 01)
requirements-completed:
  - SG-01
  - SG-02
  - SG-03
  - SG-04
  - SG-05
duration: 53m
completed: "2026-04-08T20:39:53Z"
---

# Phase 32 Plan 02: SIGNAL Section Summary

SIGNAL section delivered — 150vh Ikeda-inspired data field with sticky viewport lock. Three concurrent WebGL scenes (ENTRY/GLSLHero, PROOF/ProofShader, SIGNAL/GLSLSignal) now coexist via SignalCanvas scissor singleton.

**Duration:** 53m | **Tasks:** 4 (Tasks 1-3 auto + Task 4 human-verify) | **Commits:** 4

## Tasks Completed

| Task | Name | Commit | Status |
|------|------|--------|--------|
| 1 | GLSLSignal WebGL component | `cf17efe` | Done |
| 2 | SignalSection block (150vh sticky) | `bddf18b` | Done |
| 3 | Wire into page.tsx + SG-01..05 tests | `6d56266` | Done |
| Fixes | SSR hydration + Playwright WebGL | `9289639` | Done |
| Fixes | Ikeda shader rewrite + sticky scroll | `8daef99` | Done |
| 4 | Visual verification | — | APPROVED (move on) |

## Playwright Results — 11/11 Green

| Test | Result |
|------|--------|
| PR-01..06 (PROOF) | All pass |
| SG-01: SIGNAL WebGL scene registered | PASS |
| SG-02: SIGNAL scroll distance ~150vh | PASS |
| SG-03: SIGNAL minimal text content | PASS |
| SG-04: scroll into SIGNAL → --signal-intensity 1.0 | PASS |
| SG-05: SIGNAL reduced-motion fallback | PASS |

## Known Issues (deferred to Phase 34)

- Ikeda visual quality: approved to move forward, not at full quality bar yet
- Some layout/visual issues noted during checkpoint — deferred to Phase 34 visual language audit

## Deviations from Plan

**[Rule 1 - Bug] SSR hydration mismatch + duplicate data-section key**
Found during: Task 3 Playwright run
Fix: Created `glsl-signal-lazy.tsx` (next/dynamic ssr:false); removed duplicate data-section from inner section element.

**[Rule 2 - Missing Critical] Playwright headless WebGL config**
Fix: Added `--use-gl=swiftshader` to playwright.config.ts chromium project.

**[Rule 1 - Bug] Parallax translateY causes scissor drift + scroll breakage**
Found during: checkpoint visual review
Fix: Replaced parallax translateY + onUpdate scrub with CSS `sticky top-0 h-screen` — canvas scissor tracks sticky wrapper rect, no transform needed.

**[Rule 1 - Bug] Shader aesthetic (FBM blob, missing colors)**
Found during: checkpoint visual review
Fix: Rewrote FRAGMENT_SHADER with Ikeda-inspired composition: 120 horizontal scanlines (uForeground), 32 binary-strobing data columns (uPrimary/pink), sparse horizontal bursts, rare yellow crosshair spikes (uWarning). Three color uniforms replace single uColor.

**Total deviations:** 4 auto-fixed. **Impact:** SIGNAL section functions correctly; visual quality deferred to Phase 34.

## Self-Check: PASSED

- All key files exist on disk ✓
- 11/11 Playwright tests green ✓
- Checkpoint approved ✓

## Next

Phase 32 complete. Ready for Phase 33 — INVENTORY + ACQUISITION Sections.
