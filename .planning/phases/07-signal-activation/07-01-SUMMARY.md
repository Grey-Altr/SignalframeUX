---
phase: 07-signal-activation
plan: "01"
subsystem: signal-feedback
tags: [audio-feedback, haptic-feedback, web-audio-api, vibration-api, global-effects]
dependency_graph:
  requires: []
  provides: [SIG-06, SIG-07]
  affects: [components/layout/global-effects.tsx]
tech_stack:
  added: []
  patterns:
    - Lazy AudioContext singleton — created inside first gesture, never at module load
    - Create-and-stop OscillatorNode per event — no persistent oscillator
    - Document-level event delegation with target.closest() — no per-component wiring
    - lastHoveredRef debounce — prevents rapid-fire OscillatorNode creation on pointerover
key_files:
  created:
    - lib/audio-feedback.ts
    - lib/haptic-feedback.ts
  modified:
    - components/layout/global-effects.tsx
decisions:
  - "Document-level delegation over per-component wiring — single InteractionFeedback component in GlobalEffects handles all interactive elements without touching individual SF components"
  - "coarse-pointer check skips hover audio — touch devices have no hover state, pointerdown haptics still fire"
metrics:
  duration_seconds: 119
  completed_date: "2026-04-06"
  tasks_completed: 2
  files_modified: 3
requirements_met: [SIG-06, SIG-07]
---

# Phase 7 Plan 01: Audio and Haptic Feedback Utility Modules Summary

**One-liner:** Lazy Web Audio API square wave oscillator palette (200-800Hz) + Vibration API haptic micro-vibration wired via single document-level delegation listener with lastHoveredRef debounce.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create audio-feedback.ts and haptic-feedback.ts | 08cb7b5 | lib/audio-feedback.ts, lib/haptic-feedback.ts |
| 2 | Wire document-level interaction listener | f36911e | components/layout/global-effects.tsx |

## Acceptance Criteria Status

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | playTone exports ToneType = "hover"\|"click"\|"focus", square wave 200-800Hz, gain 0.03-0.08 | PASS |
| AC-2 | AudioContext NOT created at module load — lazy singleton in getCtx() | PASS |
| AC-3 | playTone() returns immediately when prefers-reduced-motion matches | PASS |
| AC-4 | triggerHaptic exports HapticType = "click"\|"hover", durations 10ms / 5ms | PASS |
| AC-5 | triggerHaptic() returns immediately when navigator.vibrate absent | PASS |
| AC-6 | InteractionFeedback in global-effects.tsx with lastHoveredRef debounce | PASS |
| AC-7 | target.closest() filters interactive elements (button, a, [role='button']) | PASS |
| AC-8 | pnpm build passes with zero TypeScript errors | PASS |

## Key Implementation Notes

### Audio (lib/audio-feedback.ts)
- `let _ctx: AudioContext | null = null` at module scope — explicitly not initialized
- `getCtx()` creates AudioContext on first call from within a gesture handler, calls `.resume()` if suspended
- `TONES` map: hover (320Hz, 60ms, gain 0.04), click (600Hz, 80ms, gain 0.06), focus (200Hz, 50ms, gain 0.03)
- Each call creates a fresh `OscillatorNode` connected through a `GainNode` with exponential ramp decay to 0.0001
- `osc.start()` + `osc.stop()` at `ctx.currentTime` and `ctx.currentTime + duration` — no persistent oscillator

### Haptic (lib/haptic-feedback.ts)
- `DURATIONS`: click = 10ms, hover = 5ms
- Double guard: `typeof navigator === "undefined"` + `!("vibrate" in navigator)` — covers SSR and Safari/iOS

### InteractionFeedback (components/layout/global-effects.tsx)
- Renders `null` — pure side-effect component
- Skips setup entirely on `prefers-reduced-motion` AND `pointer: coarse`
- Three document listeners: `pointerover` (hover tone + haptic), `pointerout` (ref reset), `pointerdown` (click tone + haptic)
- `lastHoveredRef` tracks last interactive element — `onPointerOver` no-ops if `target.closest()` returns same element
- `onPointerOut` clears ref when pointer leaves, enabling re-entry fire
- All listeners `{ passive: true }` — no scroll performance impact
- Rendered inside `GlobalEffects` after `<IdleOverlay />`

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check

- [x] lib/audio-feedback.ts exists with playTone, ToneType exports
- [x] lib/haptic-feedback.ts exists with triggerHaptic, HapticType exports
- [x] global-effects.tsx imports both utilities, renders InteractionFeedback
- [x] `let _ctx: AudioContext | null = null` confirmed at line 13 (not created at import)
- [x] prefers-reduced-motion guard in playTone at line 47
- [x] `"vibrate" in navigator` guard in triggerHaptic at line 31
- [x] lastHoveredRef debounce implemented in InteractionFeedback
- [x] pnpm build: zero TypeScript errors, zero warnings

## Self-Check: PASSED
