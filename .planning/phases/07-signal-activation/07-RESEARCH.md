# Phase 7: SIGNAL Activation — Research

**Researched:** 2026-04-05
**Domain:** Web Audio API · Vibration API · Idle state animation · data attribute placement
**Confidence:** HIGH

---

## Summary

Phase 7 activates four dormant SIGNAL effects. Three are pure integration tasks on top of already-built infrastructure (SIG-09 cursor placement, SIG-08 idle state upgrade, SIG-07 haptics); only SIG-06 audio feedback requires new code from scratch. The codebase is extremely well-prepared: `CanvasCursor` uses `IntersectionObserver` on `[data-cursor]` and just needs the attribute placed on markup; `IdleOverlay` in `global-effects.tsx` already exists with a 60-second timer and CSS animation (`sf-idle-scan`) but needs to be upgraded to the 8-second threshold and expanded with grain drift + OKLCH color pulse; the `prefers-reduced-motion` guard pattern exists in 22+ components and is trivially applied.

The one genuinely new system is the Web Audio API oscillator palette (SIG-06). Browser autoplay policy requires a lazy `AudioContext` that is created/resumed only after a user gesture — never on page load. The correct pattern is a singleton `AudioContext` created on first interaction, with a `GainNode` controlling per-event output. Safari/iOS does not support the Vibration API but `'vibrate' in navigator` is a reliable feature-detect that degrades silently.

**Primary recommendation:** Build SIG-06 (audio) as a singleton module (`lib/audio-feedback.ts`) with lazy init, expose a single `playTone(type)` function, and wire it into existing interactive SF components via `onMouseEnter`/`onClick`. All other requirements are attribute placement or timer adjustments.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Audio Feedback Design:**
- Hover on interactive components (buttons, cards, links) triggers audio — DU/TDR terminal "acknowledgment" pattern
- Square wave oscillator, 200-800Hz frequency range — terminal/CRT register, not musical or UI-sounding
- Very low gain (0.03-0.08) — ambient, not attention-grabbing
- Audio entirely suppressed when prefers-reduced-motion is active — silent + static

**Idle State Behavior:**
- 8-second inactivity threshold before idle activates
- Subtle grain drift — shift existing grain overlay opacity/position via `lib/grain.ts`
- OKLCH color pulse: slow oscillation of `--color-primary` lightness ±5% over 4s cycle — barely perceptible
- Instant snap-back on any mouse/keyboard/touch event — no fade transition

**Haptic & Cursor Activation:**
- Haptic vibration: single 10ms pulse on click, 5ms on hover — micro-vibration
- All sections on homepage + all showcase pages get `[data-cursor]` — blanket coverage per SIG-09
- Same crosshair + particle trail everywhere — consistency is the aesthetic
- Safari/iOS: silent no-op via `navigator.vibrate` check, no error, no console warning

### Claude's Discretion
- Web Audio API initialization timing (user gesture gating strategy)
- Idle state animation implementation approach (CSS custom properties vs GSAP)
- Audio oscillator parameter tuning (exact frequencies per interaction type)
- Grain drift implementation details (reuse vs extend lib/grain.ts)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SIG-06 | Audio feedback palette via Web Audio API with gesture-gating for browser autoplay policy compliance | Singleton AudioContext pattern (lazy init on first interaction), OscillatorNode square wave type, GainNode for per-event volume control |
| SIG-07 | Haptic feedback via Vibration API with graceful degradation on unsupported browsers (Safari/iOS) | `'vibrate' in navigator` feature detect, 10ms/5ms pulse values, confirmed silent no-op on unsupported devices |
| SIG-08 | Idle state animation (grain drift + color pulse) activates after inactivity threshold | Existing IdleOverlay in global-effects.tsx upgraded from 60s→8s, GSAP setProperty loop for OKLCH lightness oscillation |
| SIG-09 | `[data-cursor]` attribute placed on all showcase sections, activating existing CanvasCursor crosshair + particle trail | IntersectionObserver in canvas-cursor.tsx already implemented, only attribute placement needed |
</phase_requirements>

---

## Standard Stack

### Core (no new dependencies needed)

| API / Module | Notes | Why Standard |
|---|---|---|
| Web Audio API | Native browser API, no install | Only standard for imperative audio generation |
| Vibration API | Native browser API, no install | The Vibration API platform standard; iOS doesn't implement it |
| `document.documentElement.style.setProperty()` | Already used in color-cycle-frame.tsx | Direct OKLCH token mutation, instant, zero transition issues |
| GSAP ticker (`gsap.ticker.add()`) | Already in lib/gsap-core.ts | Synchronized render driver across the codebase |
| `matchMedia('prefers-reduced-motion: reduce')` | Already in 22+ components | Established codebase pattern |

### No New npm Packages Required

All four requirements are implemented with native browser APIs and existing codebase infrastructure. No new packages need to be installed.

**Install command:** none

---

## Architecture Patterns

### Recommended File Structure

```
lib/
├── audio-feedback.ts     # NEW — singleton AudioContext + playTone() factory (SIG-06)
├── haptic-feedback.ts    # NEW — vibrate() wrapper with feature detect (SIG-07)
└── grain.ts              # EXISTING — no changes needed (drift handled via CSS animation)

components/layout/
└── global-effects.tsx    # MODIFY — upgrade IdleOverlay threshold + add color pulse (SIG-08)

app/
└── page.tsx              # MODIFY — add data-cursor to all homepage sections (SIG-09)

app/components/page.tsx   # MODIFY — add data-cursor to showcase sections
app/tokens/page.tsx       # MODIFY — add data-cursor to showcase sections
app/start/page.tsx        # MODIFY — add data-cursor to showcase sections
app/reference/page.tsx    # MODIFY — add data-cursor to showcase sections
```

### Pattern 1: Lazy AudioContext Singleton (SIG-06)

**What:** AudioContext is NOT created at module load. It is created on the first user interaction event (click or hover). This is the only approach that reliably passes browser autoplay policy across Chrome, Firefox, and Safari.

**When to use:** Any audio feedback triggered by user gesture.

**Why:** If `new AudioContext()` is called outside a gesture, the context starts in `'suspended'` state. Even calling `.resume()` later is unreliable across browsers. Creating inside the gesture is the guaranteed pattern.

```typescript
// Source: MDN Web Audio API Best Practices
// lib/audio-feedback.ts

let ctx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    ctx = new AudioContext();
  }
  // Always resume in case browser suspended it
  if (ctx.state === "suspended") {
    ctx.resume();
  }
  return ctx;
}

export type ToneType = "hover" | "click" | "focus";

const TONE_MAP: Record<ToneType, { freq: number; duration: number; gain: number }> = {
  hover:  { freq: 320,  duration: 0.06, gain: 0.04 },
  click:  { freq: 600,  duration: 0.08, gain: 0.06 },
  focus:  { freq: 200,  duration: 0.05, gain: 0.03 },
};

export function playTone(type: ToneType): void {
  // Respect prefers-reduced-motion — audio is suppressed when motion is reduced
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const audioCtx = getAudioContext();
  if (!audioCtx) return;

  const { freq, duration, gain } = TONE_MAP[type];

  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc.type = "square";
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  gainNode.gain.setValueAtTime(gain, audioCtx.currentTime);
  // Fast decay envelope — terminal acknowledgment, not sustain
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + duration);
}
```

### Pattern 2: Haptic Singleton (SIG-07)

**What:** Feature-detect wrapper. Returns immediately if `navigator.vibrate` is absent (Safari/iOS, desktop browsers). No error, no console warning. Call site is unconditional — the guard lives in the utility.

```typescript
// Source: MDN Navigator.vibrate(), confirmed feature-detect pattern
// lib/haptic-feedback.ts

export type HapticType = "click" | "hover";

const HAPTIC_MAP: Record<HapticType, number> = {
  click: 10,
  hover: 5,
};

export function triggerHaptic(type: HapticType): void {
  if (typeof navigator === "undefined") return;
  if (!("vibrate" in navigator)) return; // Safari/iOS silent no-op
  navigator.vibrate(HAPTIC_MAP[type]);
}
```

### Pattern 3: Upgraded IdleOverlay (SIG-08)

**What:** The existing `IdleOverlay` in `global-effects.tsx` already handles the pattern — `setTimeout` resets on interaction events. Three changes are needed:

1. Threshold: `IDLE_TIMEOUT` from `60_000` → `8_000`
2. Grain drift: existing `.sf-idle-overlay--active` CSS animation (`sf-idle-scan`) is a scanline. Add `sf-grain-animated` class on idle body, or add a second fixed overlay with `sf-grain-animated` — no lib/grain.ts changes needed.
3. OKLCH color pulse: use `gsap.to()` targeting the documentElement's CSS custom property via string target — GSAP's CSS plugin supports `setProperty` via the `"--property"` syntax when using the `attr` or direct approach.

**IMPORTANT:** GSAP cannot tween CSS custom properties directly using its CSS plugin in the usual `{ "--color-primary": "value" }` syntax — CSS variables are not natively tweened by GSAP's CSS plugin. The correct approach is to use a GSAP tween on a JS object and call `setProperty` in `onUpdate`, OR use `gsap.to(document.documentElement, { "--color-primary": ... })` which works via CSS.registerProperty (Houdini) if available, but is not reliable cross-browser.

**Recommended approach for lightness pulse:** Use `gsap.ticker.add()` with a `Math.sin()` oscillator on a JS variable, writing to `setProperty` each tick. This mirrors the color-cycle-frame.tsx pattern and is consistent with established codebase conventions.

```typescript
// Source: Established pattern from color-cycle-frame.tsx + gsap-core.ts
// Inside upgraded IdleOverlay — idle active state handler

import { gsap } from "@/lib/gsap-core";

// Parse base lightness from --color-primary OKLCH string
// e.g. "oklch(0.65 0.3 350)" → 0.65
function parseOKLCHLightness(val: string): number | null {
  const m = val.match(/oklch\(([\d.]+)/);
  return m ? parseFloat(m[1]) : null;
}

function buildPulseTicker(basePrimary: string, baseLightness: number) {
  let t = 0;
  const PERIOD = 4; // 4s cycle
  return function tickerFn(time: number, deltaTime: number) {
    t += deltaTime / 1000;
    // ±5% lightness oscillation around base
    const l = baseLightness + 0.05 * Math.sin((2 * Math.PI * t) / PERIOD);
    // Replace lightness component only
    const next = basePrimary.replace(/oklch\([\d.]+/, `oklch(${l.toFixed(3)}`);
    document.documentElement.style.setProperty("--color-primary", next);
  };
}
```

**Snap-back on activity:** Call `gsap.ticker.remove(tickerFn)` and restore original `--color-primary` on any interaction event. Because snap-back is instant (no transition), this is a single `setProperty` restore call.

**Reduced-motion guard:** The existing `if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;` at the top of the `IdleOverlay` `useEffect` already handles this — the entire idle system simply does not mount. This satisfies "silent and static."

### Pattern 4: data-cursor Placement (SIG-09)

**What:** `CanvasCursor` already queries `document.querySelectorAll("[data-cursor]")` at mount and establishes an `IntersectionObserver`. Adding the attribute to markup is the complete implementation.

**Homepage (`app/page.tsx`):** The existing section divs with `data-section` attributes receive `data-cursor` additionally. Target: every `data-bg-shift` wrapper div — these are the showcase areas.

**Showcase pages:** Each page's `<main>` or its primary content section gets `data-cursor`. The cursor should activate everywhere on these pages since they are all showcase surfaces.

**SFSection consideration:** `sf-section.tsx` does NOT auto-add `data-cursor` — this would be over-broad and would activate the cursor on utility/nav sections. Attribute is authored explicitly on intended showcase sections.

```tsx
// Source: canvas-cursor.tsx lines 154-173 — existing IntersectionObserver
// app/page.tsx — example change
<div
  data-bg-shift="white"
  data-section="signal"
  data-section-label="SIGNAL / FRAME"
  data-cursor           // ← ADD THIS
  className="relative overflow-hidden"
>
```

### Anti-Patterns to Avoid

- **Creating `AudioContext` at module load:** The context starts `suspended`, `.resume()` is unreliable outside gesture handlers. Always lazy-init inside the first event handler.
- **One `OscillatorNode` kept running and gated by `GainNode`:** A running square oscillator has nonzero CPU cost even at gain=0. For brief micro-tones (60-80ms), create-and-stop per event is the correct pattern. No singleton oscillator.
- **Calling `navigator.vibrate()` without feature detect:** Throws on browsers that haven't implemented the API. Always gate on `'vibrate' in navigator`.
- **Animating GSAP CSS custom properties with `{ "--color-primary": ... }` object syntax:** GSAP's CSS plugin does not natively interpolate CSS custom properties as strings in all browsers. Use a ticker + `setProperty` for reliable cross-browser OKLCH value mutation.
- **Adding `data-cursor` at the SFSection primitive level:** Blanket cursor activation on structural/nav sections degrades the effect. Explicit attribute placement per section preserves the "showcase zone" intentionality.
- **Relying on CSS `transition` for idle snap-back:** Instant snap-back is a locked decision. Remove the `transition` on `sf-idle-overlay` for the snap-back direction, or use JS to remove and re-add active class without transition.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| OKLCH-to-RGB for audio-driven visuals | Custom color math | `lib/color-resolve.ts` (Phase 6) | Already extracted, tested, shared |
| Reduced-motion detection | Custom hook | `window.matchMedia("(prefers-reduced-motion: reduce)")` inline | 22+ components use this pattern — stay consistent |
| Sine oscillation for lightness pulse | Custom requestAnimationFrame loop | GSAP ticker (`gsap.ticker.add`) | GSAP ticker is already the codebase's animation clock |
| Feature detection abstraction for Vibration | Complex polyfill or utility | Direct `'vibrate' in navigator` guard | Two-character check, zero abstraction overhead warranted |

---

## Common Pitfalls

### Pitfall 1: AudioContext Autoplay Suspension

**What goes wrong:** `new AudioContext()` called at module-import or component mount → context state is `'suspended'` → `osc.start()` produces no audio → developer adds `.resume()` at mount → still silent because no gesture has occurred.

**Why it happens:** Browser autoplay policy blocks audio unless triggered by a user gesture (click, keydown, pointerdown, touchstart). `resume()` outside a gesture is a no-op on Chrome/Safari.

**How to avoid:** Lazy-init the `AudioContext` inside the first gesture event handler. The `getAudioContext()` singleton function in Pattern 1 above is called from `onMouseEnter`/`onClick` — these ARE gesture events.

**Warning signs:** Console warning: `"The AudioContext was not allowed to start. It must be resumed (or created) after a user gesture on the page."` No sound despite oscillator code appearing correct.

### Pitfall 2: GSAP CSS Variable Interpolation Fails Cross-Browser

**What goes wrong:** `gsap.to(document.documentElement, { "--color-primary": "oklch(0.70 0.3 350)", duration: 4 })` — GSAP attempts to interpolate the string but cannot parse OKLCH format natively. The tween either snaps or produces NaN mid-values.

**Why it happens:** GSAP's CSS plugin interpolates numeric CSS properties. CSS custom properties are opaque strings unless registered via CSS.registerProperty (Houdini). GSAP 3.12 does not auto-parse OKLCH strings.

**How to avoid:** Use a GSAP ticker that maintains a JS float `t` variable, computes the OKLCH string, and calls `setProperty` directly. See Pattern 3 above.

**Warning signs:** `--color-primary` snaps from one value to another instantly, or the computed value becomes `"oklch(NaN 0.3 350)"`.

### Pitfall 3: Idle Color Pulse Conflicts with ColorCycleFrame

**What goes wrong:** `IdleOverlay` pulses `--color-primary` via `setProperty`. `ColorCycleFrame` also mutates `--color-primary` via `setProperty` on wheel events. If both run simultaneously, the idle pulse is immediately overwritten.

**Why it happens:** Both write to the same CSS custom property on `document.documentElement`. No coordination mechanism exists.

**How to avoid:** Idle state snap-back on ANY interaction event (the existing `resetIdle` callback) fires on `mousedown` — which precedes wheel scroll. The idle ticker is removed on `resetIdle`. Since idle requires 8 seconds of full inactivity, and ColorCycleFrame activates on wheel-over-section (an interaction), the idle ticker will have been removed before ColorCycleFrame fires. This is naturally safe. Document this reasoning in code comments.

**Warning signs:** `--color-primary` oscillates briefly then locks to a cycling accent color, or the idle snap-back value differs from the expected base color.

### Pitfall 4: Idle Snap-Back Value Is Wrong

**What goes wrong:** On activity, `--color-primary` is restored to a hardcoded value, but `ColorCycleFrame` may have already changed it to a cycling accent. The restore reverts to the wrong color.

**Why it happens:** The idle system doesn't know what the "current correct" value of `--color-primary` is.

**How to avoid:** Capture the value of `--color-primary` at the moment idle activates (before the pulse begins), and restore that captured value on snap-back. This handles both the default magenta state and any active ColorCycleFrame accent.

### Pitfall 5: IntersectionObserver Runs Before DOM Is Populated

**What goes wrong:** `CanvasCursor`'s `useEffect` queries `[data-cursor]` at mount time. If sections are rendered after the cursor mounts (e.g., deferred via dynamic imports or client-only blocks), the observer finds zero sections.

**Why it happens:** `useEffect` runs after the component tree is committed, but dynamic/lazy-loaded sections may not yet be in the DOM.

**How to avoid:** All showcase sections in this codebase are static HTML rendered at route level (Server Components). They are fully present in the DOM when the client hydrates. No deferred section rendering exists. This pitfall does not apply but is worth confirming for each target page.

### Pitfall 6: Multiple Audio Callbacks Fire Per Hover

**What goes wrong:** `onMouseEnter` fires once on section entry. But if wired to `onMouseMove`, it fires on every pixel of movement → hundreds of oscillators per second → browser audio graph overload → audio distortion or browser slowdown.

**How to avoid:** Wire `playTone("hover")` to `onMouseEnter` only (single fire per entry). Wire `playTone("click")` to `onMouseDown` or `onClick`.

---

## Code Examples

### Web Audio Singleton with Lazy Init

```typescript
// Source: MDN AudioContext + OscillatorNode documentation
// lib/audio-feedback.ts — complete implementation skeleton

let _ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!_ctx) _ctx = new AudioContext();
  if (_ctx.state === "suspended") _ctx.resume();
  return _ctx;
}

export type ToneType = "hover" | "click" | "focus";

const TONES: Record<ToneType, { freq: number; duration: number; gain: number }> = {
  hover:  { freq: 320,  duration: 0.06, gain: 0.04 },
  click:  { freq: 600,  duration: 0.08, gain: 0.06 },
  focus:  { freq: 200,  duration: 0.05, gain: 0.03 },
};

export function playTone(type: ToneType): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = getCtx();
  if (!ctx) return;
  const { freq, duration, gain } = TONES[type];
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  g.gain.setValueAtTime(gain, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}
```

### Haptic Feedback Utility

```typescript
// Source: MDN Navigator.vibrate()
// lib/haptic-feedback.ts

export type HapticType = "click" | "hover";
const DURATIONS: Record<HapticType, number> = { click: 10, hover: 5 };

export function triggerHaptic(type: HapticType): void {
  if (typeof navigator === "undefined") return;
  if (!("vibrate" in navigator)) return;
  navigator.vibrate(DURATIONS[type]);
}
```

### IdleOverlay Upgrade — Timer Change + Color Pulse

```typescript
// Source: existing IdleOverlay in global-effects.tsx + gsap-core.ts pattern
// Key changes from current code:

// 1. Change threshold
const IDLE_TIMEOUT = 8_000; // was 60_000

// 2. Color pulse via GSAP ticker
// Capture base value when idle activates
// Oscillate lightness via Math.sin on ticker
// Remove ticker + restore captured value on resetIdle
```

### data-cursor Placement Example

```tsx
// Source: canvas-cursor.tsx — existing IntersectionObserver consumer
// app/page.tsx — blanket coverage on all showcase sections

// Before:
<div data-bg-shift="white" data-section="signal" data-section-label="SIGNAL / FRAME" className="relative overflow-hidden">

// After:
<div data-bg-shift="white" data-section="signal" data-section-label="SIGNAL / FRAME" data-cursor className="relative overflow-hidden">
```

---

## Existing Code Audit: What Already Works

| Component / File | Current State | Phase 7 Action |
|---|---|---|
| `canvas-cursor.tsx` | IntersectionObserver on `[data-cursor]` fully implemented | Add attribute to markup only |
| `global-effects.tsx` — `IdleOverlay` | 60s timer, CSS `sf-idle-scan` animation, reduced-motion guard | Reduce to 8s, add color pulse ticker, add grain effect |
| `global-effects.tsx` — reduced-motion pattern | `matchMedia` check at top of useEffect | Reuse exactly — no changes |
| `lib/grain.ts` | SVG grain data URI | No changes needed — grain drift via CSS animation class toggle |
| `lib/color-resolve.ts` | Canvas probe for OKLCH→RGB | Available for use in audio-visual sync (not required for Phase 7) |
| `color-cycle-frame.tsx` | Mutates `--color-primary` via `setProperty` | Read pattern for idle pulse implementation |
| `app/page.tsx` | 7 section divs, none have `data-cursor` | Add `data-cursor` to all 7 showcase divs |
| Showcase pages | `<main>` content sections, no `data-cursor` | Add `data-cursor` to primary content section on each page |

---

## State of the Art

| Old Approach | Current Approach | Impact |
|---|---|---|
| Audio feedback via third-party sound libraries (Howler.js) | Native Web Audio API oscillators — no dependency | Zero bundle cost, full control |
| Vibration via wrapper libraries | Direct `navigator.vibrate()` with feature detect | Same result, zero overhead |
| CSS animation for color pulse | GSAP ticker + setProperty for OKLCH string mutation | Reliable cross-browser OKLCH manipulation without Houdini dependency |
| Autoplay via `new AudioContext()` on load | Lazy singleton inside first gesture handler | Only pattern that passes Chrome/Safari/Firefox autoplay policy |

---

## Validation Architecture

> workflow.nyquist_validation key absent from .planning/config.json — treating as enabled.

### Test Framework

| Property | Value |
|---|---|
| Framework | None detected — no jest.config, vitest.config, or test directory present |
| Config file | Wave 0 gap — no framework configured |
| Quick run command | `pnpm dev` (manual visual validation) |
| Full suite command | `pnpm build && pnpm start` (Lighthouse + manual) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SIG-06 | Audio tones play on hover/click (browser with sound on) | manual-visual | N/A — browser audio requires manual verification | ❌ Wave 0 |
| SIG-06 | Audio suppressed when prefers-reduced-motion active | manual-visual | N/A — OS setting required | ❌ Wave 0 |
| SIG-07 | 10ms pulse on click on Android Chrome | manual-device | N/A — hardware required | ❌ Wave 0 |
| SIG-07 | Silent no-op on Safari/iOS — no error thrown | manual-device | N/A — device required | ❌ Wave 0 |
| SIG-08 | Idle activates at 8s — grain + color pulse visible | manual-visual | N/A — requires inactivity | ❌ Wave 0 |
| SIG-08 | Instant snap-back on mouse/keyboard/touch | manual-visual | N/A — interaction required | ❌ Wave 0 |
| SIG-08 | No CLS during idle animation | automated | `pnpm build && npx lighthouse http://localhost:3000 --output json` | ❌ Wave 0 |
| SIG-09 | Crosshair + particle trail in all showcase sections | manual-visual | N/A — requires mouse movement | ❌ Wave 0 |
| SIG-09 | Cursor inactive outside showcase sections | manual-visual | N/A — requires mouse movement | ❌ Wave 0 |
| SIG-09 | No cursor on touch/coarse-pointer devices | manual-device | N/A — device/emulation required | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `pnpm dev` + manual visual check in browser
- **Per wave merge:** `pnpm build` (no type errors) + manual walkthrough all 5 pages
- **Phase gate:** All manual checks pass + Lighthouse CLS = 0 confirmed before `/pde:verify-work`

### Wave 0 Gaps

No automated test framework detected. All Phase 7 requirements are interaction-driven behaviors (audio, haptics, cursor, idle animation) that require manual verification in a running browser. The CLS check via Lighthouse is the only automatable gate.

- [ ] No jest/vitest configured — not required for this phase
- [ ] Lighthouse CLS validation: `pnpm build && npx lighthouse http://localhost:3000 --output json --only-categories=performance`

---

## Open Questions

1. **Audio frequency tuning: exact values per interaction type**
   - What we know: 200-800Hz range is locked; square wave type is locked; gain 0.03-0.08
   - What's unclear: Exact per-event frequencies (hover vs click vs focus) — initial values in TONES map above are starting proposals
   - Recommendation: Implement with proposed values (hover:320Hz, click:600Hz, focus:200Hz), tune subjectively during visual QA

2. **Which specific elements get audio/haptic wiring**
   - What we know: "buttons, cards, links" per CONTEXT.md
   - What's unclear: Whether global-effects.tsx gets a single document-level listener (filtering interactive elements) vs per-component wiring
   - Recommendation: Single document-level listener on `pointerdown` + `pointerenter` filtering with `target.closest("button, a, [role='button'], .sf-card")` — avoids modifying every SF component

3. **Grain drift implementation for idle: CSS class vs new overlay**
   - What we know: `sf-grain-animated` exists in globals.css with `sf-grain-drift` keyframe; `lib/grain.ts` provides the SVG
   - What's unclear: Whether to add `sf-grain-animated` to `<body>` during idle (affects all grain-using elements) vs a separate fixed overlay
   - Recommendation: Separate fixed overlay element matching `sf-idle-overlay` pattern — controlled isolation, no side effects on existing components

---

## Sources

### Primary (HIGH confidence)
- MDN Web Audio API Best Practices — AudioContext user gesture requirement, suspended state, resume() pattern
- MDN OscillatorNode — type values, frequency AudioParam, start/stop lifecycle
- MDN Navigator.vibrate() — feature detect pattern, iOS/Safari compatibility status
- canvas-cursor.tsx (codebase) — IntersectionObserver [data-cursor] implementation
- global-effects.tsx (codebase) — existing IdleOverlay pattern
- color-cycle-frame.tsx (codebase) — setProperty OKLCH mutation precedent
- app/globals.css (codebase) — sf-idle-overlay, sf-grain-animated, sf-grain-drift keyframes

### Secondary (MEDIUM confidence)
- Chrome for Developers autoplay blog — confirms gesture requirement, resume() behavior
- caniuse Vibration API — confirms Safari desktop/iOS as unsupported, ~80% overall support

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all APIs are native browser + established codebase patterns
- Architecture: HIGH — direct extension of existing code; patterns sourced from within codebase
- Pitfalls: HIGH — AudioContext autoplay and CSS variable interpolation are well-documented; conflict analysis is from codebase source reading

**Research date:** 2026-04-05
**Valid until:** 2026-05-05 (Web Audio API and Vibration API are stable; unlikely to change)
