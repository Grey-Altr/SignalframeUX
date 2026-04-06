---
phase: 07-signal-activation
generated: "2026-04-05T00:00:00Z"
finding_count: 3
high_count: 1
has_bdd_candidates: true
---

# Phase 7: Edge Cases

**Generated:** 2026-04-05
**Findings:** 3 (cap: 8)
**HIGH severity:** 1
**BDD candidates:** yes

## Findings

### 1. [HIGH] AudioContext resume() not awaited — first playTone() call may silently fail

**Plan element:** `getCtx()` in `lib/audio-feedback.ts`
**Category:** error_path

`getCtx()` calls `_ctx.resume()` synchronously but `resume()` returns a Promise and is not awaited. If the AudioContext is in `suspended` state on first call (which it will be on first user gesture in Chrome/Safari), `_ctx.state` may still be `"suspended"` by the time `osc.start()` is called in the same tick. The oscillator will start into a suspended context and produce no audio. Subsequent calls (after resume() has resolved) will work correctly. The practical result: the very first hover/click interaction after page load produces no sound.

**BDD Acceptance Criteria Candidate:**
```
Given a page that has just loaded with no prior audio interaction
When the user hovers an interactive element for the first time
Then an audible oscillator tone plays (not silent)
```

### 2. [MEDIUM] Coarse-pointer early-return silently suppresses haptics on Android Chrome

**Plan element:** `window.matchMedia("(pointer: coarse)").matches` early-return in `InteractionFeedback`
**Category:** boundary_condition

The `InteractionFeedback` component returns early when `(pointer: coarse)` matches, suppressing BOTH audio AND haptics. Android Chrome devices have coarse primary pointers AND support `navigator.vibrate()`. SIG-07 specifically requires haptic feedback on supported devices, and Android Chrome is the primary supported device. The coarse-pointer guard silently eliminates haptics for the exact hardware the haptic spec targets. Audio suppression on coarse-pointer is reasonable; haptic suppression is not.

### 3. [MEDIUM] onPointerOut clears lastHoveredRef when interactive === null

**Plan element:** `onPointerOut` function in `components/layout/global-effects.tsx`
**Category:** error_path

In `onPointerOut`, the guard is `if (interactive === lastHoveredRef.current)`. When the pointer leaves a non-interactive element, `target.closest(INTERACTIVE)` returns `null`. If `lastHoveredRef.current` is also `null` (no interactive element was previously hovered), then `null === null` evaluates to `true` and the ref is reset unnecessarily. This is a no-op reset (null to null), so no functional consequence. Risk is low but the intent of the guard is only to reset when leaving the previously-tracked element.
