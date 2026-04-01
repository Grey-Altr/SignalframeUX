# RSH-interaction-feedback-research.md
# Satisfying Interaction Feedback — Deep Research for SignalframeUX
**Generated: 2026-03-31 | Depth: Maximum**

---

## EXECUTIVE SUMMARY

This document catalogs every technique for making user interactions feel *satisfying* — that visceral "this feels good" response — filtered through SignalframeUX's flat DU/TDR brutalist aesthetic. The goal: every click, hover, scroll, type, and drag should produce feedback that feels **deliberate, mechanical, and alive** — like operating a well-machined instrument — without ever crossing into decorative excess.

### The SignalframeUX Feedback Philosophy

> **"Industrial Tactility"** — Feedback should feel like flipping a physical switch on a mixing console, not like petting a cartoon puppy. Every response is immediate, physical, and earned.

**Three Rules:**
1. **Acknowledge instantly** — The user must never wonder "did that work?"
2. **Match force to action** — Small actions get small feedback, destructive actions get dramatic feedback
3. **Stay flat** — No bouncy bubbles, no confetti, no emoji celebrations. Feedback comes from motion, contrast, and sound — never decoration

---

## 1. THE FEEDBACK TAXONOMY

Every user interaction falls into one of these categories. Each needs a distinct feedback response.

### 1.1 Interaction → Feedback Matrix

| Interaction | Feedback Channel | Intensity | Duration |
|-------------|-----------------|-----------|----------|
| **Hover (enter)** | Visual: color shift + subtle lift | Whisper | 100–200ms |
| **Hover (exit)** | Visual: slow settle back | Whisper | 400–600ms |
| **Click/Tap (press)** | Visual: scale down + darken | Crisp | 34–50ms |
| **Click/Tap (release)** | Visual: spring back + state change | Satisfying | 200–400ms |
| **Focus (keyboard)** | Visual: ring + slight scale | Clear | 150ms |
| **Toggle on/off** | Visual: snap + color invert | Decisive | 150ms |
| **Text input** | Visual: cursor blink + border activation | Subtle | Continuous |
| **Copy to clipboard** | Visual: flash + label swap | Confirming | 200ms + 2s hold |
| **Form submit (success)** | Visual: button morph + checkmark draw | Rewarding | 400–600ms |
| **Form submit (error)** | Visual: shake + border flash | Corrective | 300ms |
| **Scroll (content enter)** | Visual: stagger reveal | Choreographed | 75ms stagger |
| **Drag** | Visual: lift + shadow + cursor change | Physical | Continuous |
| **Long press** | Visual: fill progress ring | Building | 500ms–1s |
| **Navigation** | Visual: page transition + breadcrumb update | Spatial | 200–300ms |
| **Loading** | Visual: shimmer + progress | Reassuring | Variable |
| **Destructive action** | Visual: red flash + confirmation pause | Warning | 200ms + modal |

---

## 2. VISUAL FEEDBACK TECHNIQUES

### 2.1 The Press Response — "The Click That Clicks"

The single most important micro-interaction. Every clickable element needs this.

**The Josh Comeau Pattern (adapted for flat/brutalist):**

Instead of 3D depth illusion (too skeuomorphic for SignalframeUX), use **translateY + scale compression**:

```css
/* SignalframeUX Press Response */
.sf-pressable {
  transition: transform var(--duration-slow) var(--ease-spring);
}

.sf-pressable:hover {
  transform: translateY(-2px);
  transition: transform var(--duration-normal) cubic-bezier(0.3, 0.7, 0.4, 1.5);
}

.sf-pressable:active {
  transform: translateY(1px) scale(0.97);
  transition: transform var(--duration-instant);
}
```

**Why this feels satisfying:**
- **Hover lifts** (anticipation — the button rises to meet your cursor)
- **Press snaps down instantly** (34–50ms — feels mechanical, like a key switch)
- **Release springs back slowly** (400ms with spring overshoot — the satisfying bounce)
- **Asymmetric timing is the secret**: fast in, slow out. This mimics physical objects (a key snaps down but bounces back)

**DU/TDR Adaptation:**
- No rounded corners, no shadows — the motion itself is the affordance
- On black-bg buttons: press response is a **brief white flash** on the border (1 frame at 60fps = 16ms)
- On magenta elements: scale(0.97) is enough — the color carries the weight

### 2.2 The Hover State — "I See You"

**Current system:** Spring physics transform + color shift (defined in MCK spec)

**Enhanced approach — Layered Hover:**

```css
/* Layer 1: Immediate (CSS) — color shift */
.sf-button:hover {
  background-color: var(--color-primary-hover); /* slightly lighter/darker */
  transition: background-color var(--duration-fast) var(--ease-out);
}

/* Layer 2: Physical (CSS) — subtle lift */
.sf-button:hover {
  transform: translateY(-1px);
  transition: transform var(--duration-normal) var(--ease-spring);
}

/* Layer 3: Environmental (GSAP) — ScrambleText on label */
/* Only on nav items and feature-highlight buttons */
```

**The DU/TDR Hover Vocabulary:**
| Element Type | Hover Response | Character |
|-------------|---------------|-----------|
| Nav links | ScrambleText glitch (chars randomize then resolve) | Hacker terminal |
| Buttons (primary) | Background invert (black→white or magenta→black) | Hard switch |
| Buttons (ghost) | Border thickens 1px→2px + slight lift | Industrial |
| Cards | Translate -2px + border becomes magenta | Signal activation |
| Code blocks | Subtle green tint on border (matrix aesthetic) | Terminal warmth |
| Table rows | Full-width background bar appears | DU archive style |
| Links (inline) | Underline draws left-to-right (not instant appear) | Typewriter |
| Icon buttons | Scale(1.1) + rotate(5deg) on icon only | Mechanical pivot |

### 2.3 The Focus Ring — "You're Here"

**Current:** 3px solid focus ring, 2px offset.

**Enhanced for satisfaction:**

```css
.sf-focusable:focus-visible {
  outline: 2px solid var(--color-primary); /* magenta */
  outline-offset: 3px;
  /* The magic: animate the offset outward */
  animation: sf-focus-pulse var(--duration-normal) var(--ease-out);
}

@keyframes sf-focus-pulse {
  from {
    outline-offset: 0px;
    outline-color: oklch(0.65 0.29 350 / 0.5);
  }
  to {
    outline-offset: 3px;
    outline-color: oklch(0.65 0.29 350 / 1);
  }
}
```

The outline *expands outward* from the element — feels like the element is being "selected" by a targeting system (very TDR/Wipeout HUD energy).

### 2.4 The Toggle — "Decisive Snap"

Toggles should feel like flipping a physical switch. No smooth slide — a **snap**.

```css
.sf-toggle-thumb {
  transition: transform var(--duration-fast) cubic-bezier(0.68, -0.2, 0.27, 1.2);
  /* The negative Y value creates a slight "pull back before snap" feel */
}

.sf-toggle[aria-checked="true"] .sf-toggle-thumb {
  transform: translateX(var(--toggle-travel));
}
```

**GSAP enhancement for the track:**
On toggle, the track background doesn't fade — it **wipes** from left to right like a progress bar filling. 100ms. Sharp.

### 2.5 Color Inversion Flash — "The Strobe"

Unique to SignalframeUX. On significant actions (submit, save, copy), the clicked element briefly **inverts** its colors for 1–2 frames:

```css
@keyframes sf-flash-invert {
  0%, 100% { filter: invert(0); }
  15% { filter: invert(1); }
}

.sf-flash-on-action {
  animation: sf-flash-invert 150ms var(--ease-out);
}
```

This reads as a camera flash / VHS glitch — very DU. Used sparingly (only on confirm actions, not every click).

---

## 3. TEXT FEEDBACK TECHNIQUES

### 3.1 ScrambleText on Hover (GSAP)

The signature SignalframeUX interaction. When hovering nav items or feature headings, characters scramble through random glyphs before resolving.

```tsx
// Using GSAP ScrambleText
const handleHover = contextSafe((target: HTMLElement) => {
  gsap.to(target, {
    duration: 0.4,
    scrambleText: {
      text: target.dataset.text, // original text
      chars: 'SIGNAL//01フレーム▓░▒',
      speed: 0.6,
      revealDelay: 0.1,
    },
  });
});
```

**Character set matters:** Using `SIGNAL//01フレーム▓░▒` as the scramble character set keeps the glitch on-brand (katakana + block characters + forward slashes from the SIGNAL//FRAME branding).

### 3.2 Typewriter Cursor on Active Inputs

When an input field is focused, the placeholder text gets a blinking block cursor (█) instead of the default thin cursor:

```css
.sf-input:focus::placeholder {
  animation: sf-cursor-blink 800ms steps(2) infinite;
}

@keyframes sf-cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
```

### 3.3 Character Count Feedback

As the user types toward a character limit, the counter changes behavior:
- **0–80%**: Static monospace counter
- **80–100%**: Counter turns magenta, pulses subtly on each keystroke
- **100%**: Counter turns red, brief shake (same as error pattern)

### 3.4 Copy-to-Clipboard Text Swap

When code is copied, the button label scramble-transitions from "COPY" → "COPIED" using ScrambleText (200ms), holds for 2s, then scrambles back. No toast needed — the feedback is *in the button itself*.

---

## 4. SCROLL FEEDBACK TECHNIQUES

### 4.1 Staggered Entrance Choreography

**Current system:** GSAP ScrollTrigger with batch + stagger.

**Enhanced pattern — Reading-Order Cascade:**

Elements don't just fade in — they enter in *reading order* with distinct personality per element type:

| Element | Entrance | Duration | Stagger |
|---------|----------|----------|---------|
| Section headline | SplitText chars, left-to-right reveal | 400ms | 15ms/char |
| Body text | Fade up from y: 20px | 300ms | — |
| Cards (grid) | Scale from 0.95 + fade, batch stagger | 200ms each | 75ms between |
| Code blocks | Border draws first (top→right→bottom→left), then content fades | 500ms total | — |
| Separator rules | Width grows from 0% to 100% (left to right) | 300ms | — |
| Stats/numbers | CountUp animation (0 → final value) | 600ms | 100ms between |
| Images | Clip-path reveal (rect expanding from center) | 400ms | — |

```tsx
// GSAP ScrollTrigger.batch for card grids
ScrollTrigger.batch('.sf-card', {
  onEnter: (batch) => {
    gsap.from(batch, {
      opacity: 0,
      scale: 0.95,
      y: 20,
      duration: 0.3,
      stagger: 0.075,
      ease: 'power2.out',
    });
  },
  once: true,
  start: 'top 85%',
});
```

### 4.2 Scroll Progress Indicator

A thin (2px) magenta bar at the very top of the viewport that fills left→right as the user scrolls. Pure CSS:

```css
.sf-scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: var(--color-primary); /* magenta */
  width: 0%;
  z-index: 9999;
  animation: sf-scroll-fill linear;
  animation-timeline: scroll();
}

@keyframes sf-scroll-fill {
  to { width: 100%; }
}
```

### 4.3 Parallax Section Dividers

The 3px black horizontal rules between sections have a subtle parallax — they move at 0.95x scroll speed, creating a barely-perceptible depth separation. Not enough to trigger vestibular issues, but enough to make sections feel like distinct plates.

### 4.4 Smooth Scroll with Lenis

Already planned in the tech stack. Key config for "satisfying" feel:

```tsx
const lenis = new Lenis({
  duration: 1.2,        // slightly slower than default (feels luxurious)
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential decay
  smoothWheel: true,
  touchMultiplier: 1.5,  // slightly more responsive on touch
});
```

---

## 5. LOADING & STATE TRANSITION FEEDBACK

### 5.1 Skeleton Screens — "The Grid"

Instead of generic gray blobs, SignalframeUX skeletons should look like the **DU grid loading**:

- Thin black border rectangles in the exact layout positions
- A single horizontal **scanline** (2px magenta band) sweeps top-to-bottom repeatedly
- No rounded corners, no gradient shimmer — just the scanline pass

```css
.sf-skeleton {
  border: 1px solid var(--color-border);
  position: relative;
  overflow: hidden;
}

.sf-skeleton::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-primary);
  animation: sf-scanline 1.5s var(--ease-in-out) infinite;
}

@keyframes sf-scanline {
  0% { top: -2px; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}
```

### 5.2 Button Loading States

When a button triggers an async action:

1. **Immediate** (0ms): Button text scrambles to `PROCESSING...` via ScrambleText
2. **During** (continuous): A 2px progress bar fills across the bottom edge of the button
3. **Complete (success)**: Text scrambles to `DONE ✓`, bar fills to 100%, brief green flash on border
4. **Complete (error)**: Text scrambles to `ERROR`, button shakes (translateX oscillation), red border

```tsx
// Button loading timeline
const loadingTimeline = gsap.timeline();

loadingTimeline
  .to(buttonLabel, {
    scrambleText: { text: 'PROCESSING...', chars: '▓░▒01', speed: 0.4 },
    duration: 0.3,
  })
  .to(progressBar, {
    scaleX: 0.9, // stops at 90% until actual completion
    duration: 2,
    ease: 'power1.out',
  })
  // On success callback:
  .to(progressBar, { scaleX: 1, duration: 0.1 })
  .to(buttonLabel, {
    scrambleText: { text: 'DONE', chars: '▓░▒01', speed: 0.8 },
    duration: 0.2,
  });
```

### 5.3 Page Transitions

Between routes, a **horizontal wipe** (black bar sweeps left→right, reveals new content underneath). 300ms total. Feels like a film cut.

```tsx
// Using Next.js App Router + GSAP
const pageTransition = gsap.timeline();

pageTransition
  .to('.sf-page-wipe', { scaleX: 1, transformOrigin: 'left', duration: 0.15, ease: 'power2.in' })
  .set('.sf-page-content', { opacity: 0 })
  .to('.sf-page-wipe', { scaleX: 0, transformOrigin: 'right', duration: 0.15, ease: 'power2.out' })
  .from('.sf-page-content', { opacity: 0, y: 10, duration: 0.2 });
```

---

## 6. ERROR & VALIDATION FEEDBACK

### 6.1 The Shake — "Rejected"

The classic error shake, but tuned for industrial feel — **tight and fast**, not wobbly:

```css
@keyframes sf-shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-4px); }
  40% { transform: translateX(4px); }
  60% { transform: translateX(-2px); }
  80% { transform: translateX(2px); }
}

.sf-shake {
  animation: sf-shake 300ms var(--ease-default);
}
```

4px amplitude, 300ms total, decaying oscillation. Not a cartoon wiggle — a mechanical rejection.

### 6.2 Inline Validation

**As-you-type validation with deferred feedback** (don't show errors until the user pauses or blurs):

1. **While typing**: No error state shown (don't punish mid-thought)
2. **On blur or 1s pause**: If invalid, border transitions to red (200ms), error text fades in below (150ms)
3. **On correction**: The moment input becomes valid, border transitions to green (100ms — faster than error appearance, feels rewarding), then back to default after 1.5s

The **green flash of correctness** disappearing quickly is key — it rewards without lingering. Error states persist until fixed.

### 6.3 Field-Level Error Animation

Error messages don't just appear — they **slide down from behind the input** (translateY: -100% → 0, clip-path masking the overflow). Feels like a label tape emerging from a machine.

---

## 7. SOUND FEEDBACK (OPTIONAL LAYER)

### 7.1 Philosophy

Sound is the most powerful — and most dangerous — feedback channel. It must be:
- **Off by default** (opt-in via a sound toggle in the nav)
- **Extremely short** (< 100ms for clicks, < 300ms for confirms)
- **Synthesized, not sampled** (Web Audio API oscillators — smaller, more controllable, more industrial)
- **Monophonic** (one sound at a time, new sounds cut previous)

### 7.2 Sound Palette

| Interaction | Sound | Web Audio Implementation |
|-------------|-------|------------------------|
| Button click | Short tick — 1200Hz square wave, 30ms, quick decay | `OscillatorNode('square')` at 1200Hz, `GainNode` envelope 30ms |
| Toggle on | Rising blip — 800Hz→1200Hz sine, 60ms | Frequency ramp up |
| Toggle off | Falling blip — 1200Hz→800Hz sine, 60ms | Frequency ramp down |
| Copy success | Double tick — two 1500Hz ticks, 20ms each, 40ms gap | Two sequential oscillators |
| Error/reject | Low buzz — 200Hz sawtooth, 100ms | `OscillatorNode('sawtooth')` at 200Hz |
| Submit success | Rising chord — 800Hz + 1000Hz + 1200Hz sine, 200ms with 400ms decay | Three oscillators, major triad |
| Hover (nav only) | Tiny click — 2000Hz sine, 10ms, very quiet | Barely audible at 0.05 gain |
| Page transition | Woosh — white noise burst, 80ms, bandpass filter sweep | `AudioBufferSourceNode` with `BiquadFilterNode` |

### 7.3 Web Audio API Implementation Pattern

```tsx
class SFAudio {
  private ctx: AudioContext | null = null;
  private enabled = false;

  enable() {
    // Must be called from user gesture
    this.ctx = new AudioContext();
    this.enabled = true;
  }

  tick() {
    if (!this.ctx || !this.enabled) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 1200;
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.03);
  }

  // ... similar methods for each sound
}
```

### 7.4 Haptic Feedback (Mobile)

Using the `web-haptics` library or raw Vibration API as progressive enhancement:

```tsx
function triggerHaptic(pattern: 'tap' | 'success' | 'error') {
  if (!navigator.vibrate) return; // silent fail on unsupported

  const patterns = {
    tap: [10],           // single short pulse
    success: [10, 50, 10], // double tap
    error: [30, 30, 30, 30, 30], // rapid buzz
  };

  navigator.vibrate(patterns[pattern]);
}
```

**Important caveats:**
- Vibration API is NOT supported on iOS Safari (not Baseline)
- Android Chrome supports it well
- Must be triggered inside a user gesture handler
- Silent/DND mode can block it
- Use as progressive enhancement only — never rely on it

---

## 8. CURSOR FEEDBACK

### 8.1 Custom Cursor (Desktop Only)

A small (8px) black dot that follows the mouse at 0.8x speed (slight lag = physical feel). On interactive elements, the dot:

| Context | Cursor Behavior |
|---------|----------------|
| Default | 8px black circle, 0.8x follow speed |
| Hovering button | Dot scales to 40px, becomes hollow ring |
| Hovering link | Dot becomes magenta, 12px |
| Hovering drag handle | Dot becomes ↕ indicator |
| Pressing (any) | Dot shrinks to 4px (compression) |
| Over text | Reverts to native text cursor (don't fight OS) |
| Over code | Reverts to native text cursor |

**Implementation:** GSAP `quickTo()` for the smoothed follow:

```tsx
const xTo = gsap.quickTo('.sf-cursor', 'x', { duration: 0.15, ease: 'power2.out' });
const yTo = gsap.quickTo('.sf-cursor', 'y', { duration: 0.15, ease: 'power2.out' });

window.addEventListener('mousemove', (e) => {
  xTo(e.clientX);
  yTo(e.clientY);
});
```

**Important:** Custom cursors must be opt-in or at least include a way to disable. They can interfere with accessibility tools. Hide on touch devices.

---

## 9. AMBIENT FEEDBACK (ALWAYS-ON ENVIRONMENTAL CUES)

### 9.1 Live Clock Tick

The DU-homage live clock in the nav. Every second, the colon blinks and the seconds digit updates with a micro ScrambleText (just the changing digits, not the whole time string). Subtle proof the interface is alive.

### 9.2 Scroll Position Memory

When navigating away and back, scroll position is restored with a brief "fast-forward" animation (content scrolls to position at 3x speed rather than instant jump). The user *sees* where they are in the page.

### 9.3 Active Section Indicator

As the user scrolls, the nav highlights the current section. The highlight doesn't just swap — it **slides** from the previous item to the current one (a magenta underline that physically moves between nav items). Uses GSAP Flip or simple translateX animation.

### 9.4 Idle State — "Standby Mode"

After 60s of no interaction, the interface enters a subtle standby state:
- The live clock's colon blinks slower (2s instead of 1s)
- A very faint (3% opacity) scanline overlay drifts across the viewport
- On any interaction, the scanline fades and clock resumes normal speed (200ms)

This is the "screensaver" energy — it tells the user the system is on standby, waiting for input. Very DU mixing-console.

---

## 10. DESIGN SYSTEM INTEGRATION PLAN

### 10.1 New Motion Tokens Required

```css
:root {
  /* --- Interaction Feedback Tokens --- */

  /* Press Response */
  --press-scale: 0.97;
  --press-translate-y: 1px;
  --press-duration: var(--duration-instant); /* 50ms — snap */
  --release-duration: var(--duration-slow);  /* 400ms — spring back */
  --release-ease: var(--ease-spring);

  /* Hover Response */
  --hover-lift: -2px;
  --hover-duration: var(--duration-normal);  /* 200ms */
  --hover-ease: cubic-bezier(0.3, 0.7, 0.4, 1.5); /* slight overshoot */
  --hover-exit-duration: var(--duration-slow); /* 600ms — slow settle */

  /* Focus Response */
  --focus-ring-width: 2px;
  --focus-ring-offset: 3px;
  --focus-ring-color: var(--color-primary);
  --focus-expand-duration: var(--duration-normal);

  /* State Transitions */
  --state-enter-duration: var(--duration-fast);  /* 100ms */
  --state-exit-duration: var(--duration-normal); /* 200ms */

  /* Error Feedback */
  --shake-amplitude: 4px;
  --shake-duration: 300ms;

  /* Scroll Entrance */
  --entrance-stagger: var(--delay-stagger);    /* 75ms */
  --entrance-duration: var(--duration-normal);  /* 200ms */
  --entrance-distance: 20px;

  /* Feedback Flash */
  --flash-duration: 150ms;

  /* Cursor */
  --cursor-size: 8px;
  --cursor-hover-size: 40px;
  --cursor-follow-speed: 0.15s;

  /* Sound (volumes as gain values) */
  --audio-click-gain: 0.08;
  --audio-confirm-gain: 0.06;
  --audio-error-gain: 0.10;
}
```

### 10.2 Component Mixin Classes

Every interactive component gets these base behaviors via utility classes:

| Class | Behavior | Applied To |
|-------|----------|------------|
| `.sf-pressable` | Press scale + spring release | All buttons, toggles, clickable cards |
| `.sf-hoverable` | Lift on hover, slow settle on exit | Buttons, cards, nav items |
| `.sf-focusable` | Expanding focus ring animation | All interactive elements |
| `.sf-scramble` | ScrambleText on hover (requires GSAP) | Nav items, feature headings |
| `.sf-flash` | Color inversion flash on action | Submit buttons, copy buttons |
| `.sf-shake-on-error` | Shake animation triggered by error state | Form inputs, action buttons |
| `.sf-entrance` | Scroll-triggered entrance animation | Section-level containers |
| `.sf-entrance-stagger` | Staggered children entrance | Grid parents |
| `.sf-scanline-skeleton` | Scanline loading skeleton | Any loading placeholder |

### 10.3 Implementation Priority

| Phase | Items | Effort | Impact |
|-------|-------|--------|--------|
| **P0 — Foundation** | Press response, hover lift, focus ring, error shake | CSS only | Massive — every interaction feels better immediately |
| **P1 — Signature** | ScrambleText hover, copy feedback, button loading states | GSAP required | High — establishes the DU/TDR character |
| **P2 — Polish** | Scroll entrances, page transitions, skeleton scanlines | GSAP + Lenis | Medium — completes the experience |
| **P3 — Optional** | Sound system, custom cursor, haptic feedback, idle state | Web Audio API + progressive enhancement | Bonus — "wow factor" for those who enable it |

### 10.4 Accessibility Commitments

| Concern | Mitigation |
|---------|------------|
| Motion sensitivity | All animations respect `prefers-reduced-motion: reduce` — durations go to 0ms |
| Sound | Off by default, opt-in toggle, never carries semantic information alone |
| Custom cursor | Hidden on touch, disabled via a11y settings, never blocks native cursor for text |
| Haptic | Progressive enhancement only, no functional reliance |
| Color flash | Never the sole indicator of state change — always paired with text/icon change |
| Keyboard users | Focus ring is always visible, spring animation still works |
| Screen readers | All state changes communicated via ARIA (`aria-busy`, `aria-invalid`, `aria-pressed`) |
| Seizure risk | No element flashes more than 3x/second, color inversions are single-flash only |

---

## 11. REFERENCE SITES & INSPIRATION

### Sites With Exceptional Interaction Feedback
- **Linear.app** — Keyboard-first UI with satisfying state transitions
- **Raycast** — Command palette with spring-physics list items
- **Vercel Dashboard** — Minimal but precise hover/press feedback
- **Stripe Docs** — Copy-to-clipboard inline feedback pattern
- **Josh Comeau's blog** — 3D button, spring physics examples
- **Aaron Iker (CodePen)** — GSAP-powered celebratory buttons
- **Locomotive.ca** — Custom cursor + scroll-based choreography
- **Detroit Underground** — The reference. Minimal, mechanical, alive.

### Key Research Sources
- Stephanie Walter — "Enhancing UX With CSS Animations" (timing, cognitive load)
- Material Design 3 — States specification (enabled, hover, focus, pressed, dragged)
- NNG — Button States: Communicate Interaction (state visibility research)
- Colorado DCS — Motion & Interaction accessibility guidelines
- Smashing Magazine — Ambient Animations in Web Design
- Josh Comeau — Interactive Guide to CSS Transitions + 3D Button tutorial
- Frontend Horse — Buttons That Spark Joy (GSAP Physics2D, MorphSVG)
- web-haptics npm — Mobile haptic feedback library

---

## 12. ANTI-PATTERNS FOR SIGNALFRAME UX

Things that would feel satisfying on *other* sites but are **wrong for this aesthetic**:

| Anti-Pattern | Why It's Wrong Here |
|-------------|-------------------|
| Confetti / particle celebrations | Too playful — DU is industrial, not festive |
| Bouncy elastic overshoots | Feels cartoon-y — use tight spring, not rubber band |
| Rounded morphing shapes | Conflicts with 0px radius rule |
| Color gradient transitions | Gradients are banned in the flat system |
| Emoji in feedback | Never — use monospace text changes |
| Mascot animations | Obviously not |
| Smooth corner-radius animations | No rounded corners exist to animate |
| Parallax depth illusions | Keep subtle (0.95x max) — vestibular risk |
| Auto-playing video backgrounds | Against DU ethos — user controls everything |
| Toast notifications | Replace with inline feedback at the interaction point |

---

*This document should be read alongside:*
- `RSH-gsap-animation-research.md` — Technical GSAP implementation patterns
- `SYS-motion.css` — Current motion token definitions
- `MCK-mockup-spec-v1.md` — Existing interaction state definitions
- `INTEGRATION-SPEC.md` — Component architecture for applying these patterns
