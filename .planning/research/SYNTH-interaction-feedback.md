# SYNTH-interaction-feedback.md
# Interaction Feedback Synthesis — SignalframeUX v1.0 "Craft & Feedback"
**Synthesized: 2026-04-05 | Sources: RSH-interaction-feedback-research, RSH-gsap-animation-research, firecrawl corpus**

---

## 1. Micro-Interaction Patterns That Create Satisfaction

**Hover — asymmetric timing is the mechanism**
- Enter: 100–150ms, power2.out. Exit: 400–600ms, power1.out. Never symmetric — symmetry reads as template.
- Layered: CSS handles immediate color shift (no perceptible delay), GSAP handles physical lift (-2px translateY with cubic-bezier(0.3, 0.7, 0.4, 1.5) slight overshoot). Separation avoids jank.
- DU vocabulary per element: nav items → ScrambleText (chars: `SIGNAL//01フレーム▓░▒`, revealDelay: 0.1); primary buttons → hard color invert; ghost buttons → border 1→2px; cards → magenta border activation; inline links → underline draws left→right (not instant appear).

**Click/Press — most important single interaction**
- Pattern: hover lifts (anticipation), press snaps down in 34–50ms (`--duration-instant`), release springs back at 300–400ms with cubic-bezier(0.68, -0.2, 0.27, 1.2). Scale: 0.97 + translateY(1px).
- Asymmetric: fast compression (mechanical snap) + slow release (physics decompression). Any symmetric press reads as CSS boilerplate.
- On confirm actions only (save, copy, submit): single color inversion flash at 150ms. VHS strobe / camera flash register. Not on every click — earns its use.

**Focus (keyboard)**
- Outline expands outward: outline-offset animates 0→3px over 150ms, color from 50% to 100% opacity. Reads as targeting reticle acquiring — Wipeout HUD / TDR energy.
- Never just "appears" — the expansion is the signal.

**Toggle — decisive snap**
- cubic-bezier(0.68, -0.2, 0.27, 1.2): slight pullback before snap forward. Track background wipes left→right in 100ms (not fade). Reads as physical switch throw.

**Scroll Entrance — reading-order cascade**
- Headlines: SplitText chars, 15ms/char stagger, slide up from y:16px, 300ms.
- Body: fade from y:20px, 300ms, no stagger.
- Card grids: ScrollTrigger.batch, scale 0.95→1 + fade, 200ms each, 75ms between, `once: true`.
- Separator rules: width 0→100% left-to-right, 300ms.
- Stats: CountUp 0→value, 600ms, 100ms between items.
- Trigger at `top 85%` — content arrives with reading, not late.

**Loading — skeleton and async**
- Skeleton: sharp-cornered bordered rects, single 2px magenta scanline sweeps top→bottom at 1.5s loop. No shimmer, no gradients, no rounded corners.
- Button async: scramble to `PROCESSING...` at 0ms, progress bar fills bottom edge to 90% (holds), snaps to 100% on resolve, scrambles to `DONE`. Error: shake + `ERROR` + red border at 300ms.

---

## 2. Macro-Transition Patterns

**Page Transitions**
- Horizontal black bar wipe: scaleX 0→1 from left (150ms, power2.in), content opacity 0, scaleX 1→0 from right (150ms, power2.out), new content fades up from y:10 (200ms). Total: ~300ms. Film cut, not dissolve.
- No crossfade. No slide from edge. The wipe is a mechanical shutter — DU edit-suite energy.

**State Changes (filter, sort, layout)**
- GSAP Flip: capture → mutate DOM → animate from previous position. Stagger: 40ms. Departing items scale to 0, entering items scale from 0. No reflow jank.
- Layout transitions feel fast because the user sees items traveling to new positions — spatial memory preserved.

**Content Reveals (scroll-driven)**
- Section plates feel distinct via parallax dividers at 0.95x scroll speed (scrub: 1, not true). Barely perceptible — establishes depth without vestibular risk.
- Active nav indicator: magenta underline slides between items via GSAP Flip or translateX — never instant-swaps.

**Idle / Standby**
- After 60s: clock colon blinks at 2s intervals, faint scanline drifts viewport at 3% opacity. First interaction resumes at 200ms. "System waiting" — mixing console standby, not screensaver kitsch.

---

## 3. GSAP Techniques for SOTD-Quality Motion

- **Plugin stack (all free post-Webflow acquisition):** ScrollTrigger + SplitText + ScrambleText + Flip + DrawSVG + CustomEase. Register once in `lib/gsap-plugins.ts`, import from there system-wide.
- **`useGSAP({ scope: containerRef })`** for all component animations — auto-cleanup on unmount, Strict Mode safe, no duplicate animations.
- **`contextSafe()`** required for event-handler animations (onClick, onMouseEnter) — without it, animations leak on unmount.
- **`quickTo()`** for cursor follow — builds a reusable setter with built-in smoothing. Far cheaper than `gsap.to()` on every mousemove event.
- **SplitText `mask: 'chars'`** creates clip wrappers automatically — slide-up char reveals without manual overflow:hidden markup.
- **ScrambleText: `revealDelay: 0.1`** holds scramble briefly before resolving — builds tension before payoff.
- **CustomEase signatures:** `signal-snap` (harsh mechanical step at midpoint), `signal-punch` (1.3x overshoot, fast settle). Define once in `lib/gsap-plugins.ts`, reference everywhere.
- **DrawSVG** for circuit-trace reveals and logo draws. `drawSVG: '0%' → '100%'`, staggered paths, scroll-triggered.
- **Scrub `1` not `true`** — 1s smoothing on scroll-linked animations prevents stutter on trackpads.
- **Locomotive reference:** Char-by-char headline reveals with staggered opacity, full-bleed image clip-path expands, custom cursor scale morphs. All driven by a single Lenis → GSAP ticker integration.

---

## 4. Audio / Haptic Feedback Possibilities

**Web Audio API — synthesized, never sampled**
- Click: 1200Hz square wave, 30ms, exponential decay to 0.001, `gain: 0.08`.
- Toggle on/off: 800→1200Hz sine ramp (on) / 1200→800Hz (off), 60ms each.
- Copy success: two 1500Hz ticks, 20ms each, 40ms gap between.
- Error: 200Hz sawtooth, 100ms. Low frequency = physical rejection.
- Submit success: 800 + 1000 + 1200Hz sine triad, 200ms attack, 400ms decay.
- Nav hover: 2000Hz sine, 10ms, `gain: 0.05` — barely audible, atmospheric.
- Page transition: white noise burst, 80ms, bandpass filter sweep.

**Rules:** Off by default (opt-in toggle in nav). Monophonic — new sound cuts previous. AudioContext created on first user gesture only (browser security requirement). Sound never carries semantic information alone — always paired with visual state change.

**Haptic (Vibration API — Android Chrome only)**
- Tap: `[10]ms`. Success: `[10, 50, 10]`. Error: `[30, 30, 30, 30, 30]`.
- iOS Safari does not support Vibration API. Treat as progressive enhancement — silent fail always. Never rely on it.

---

## 5. Tight vs Loose Feedback

| Property | Tight (target) | Loose (avoid) |
|---|---|---|
| Press latency | 34–50ms snap | >100ms (perceptible lag) |
| Enter easing | power2.in or linear | ease-in-out (mushy start) |
| Exit easing | spring, 1.1–1.2x overshoot | elastic >1.5x (cartoon bounce) |
| Shake amplitude | 4px, decaying oscillation | >8px (wiggle not rejection) |
| Stagger | 50–75ms between items | >150ms (feels broken) |
| Hover lift | 1–2px | >4px (floaty) |
| Spring overshoot | 2–5% beyond target | 20%+ (rubber band) |
| Instant action duration | 34ms | 0ms (imperceptible) or >100ms (sluggish) |
| Release/settle duration | 300–600ms | <200ms (abrupt) or >800ms (laggy) |

**Core principle:** Tight = asymmetric. Actions compress fast, release slow. Fast = mechanical precision. Slow exit = physical weight. Symmetric timing always reads as "CSS template."

Raycast reference: keyboard list items respond to arrow navigation in <16ms — the selection indicator slides to new position instantly (no duration), content cross-fades at 80ms. The combination reads as native-app speed in a web layer.

Linear reference: issue state transitions use 120ms ease-out for badge color change, 0ms for label text swap, 200ms for modal appear. The mix of instant + animated reads as "database confirmed, UI caught up."

---

## 6. Flat / Brutalist / Industrial Aesthetic Patterns (DU/TDR)

**What works in this register:**
- Motion is the affordance — no shadows, no depth illusions. Movement communicates state.
- Hard switches, not fades: toggles snap, filters snap, states change with a brief flash rather than crossfade.
- Negative space as stage: reveals emerge from void (opacity:0 + clip-path, not sliding from off-screen edge).
- Typographic motion: ScrambleText, SplitText char reveals, CountUp numbers. The text surface is the animation surface.
- Monochrome vocabulary with single accent punctuation: black-and-white transitions interrupted by a magenta flash or single indicator line.
- Scanlines as loading metaphor: CRT heritage, DU visual language. No gradients, no glows, no blurs.
- Error as machine rejection: shake is mechanical, not apologetic. Low-frequency audio + tight oscillation = "denied."
- Sound design from synthesis. Square and sawtooth waves = industrial signal, not UI chime.
- Aristide Benoist reference: per-character z-axis reveals on hero type, strict grid adherence even in motion — each element occupies its cell, animation respects the column structure.

**Banned:** confetti, particle celebrations, bouncy rubber-band overshoots, rounded corner morphs, gradient transitions, emoji in feedback states, toast notifications (replace with inline point-of-action feedback), parallax beyond 0.95x, auto-playing video, smooth corner-radius animations, blur effects.

---

## 7. FRAME + SIGNAL Interaction Layer Model

The dual-layer model maps directly onto two distinct feedback registers:

**FRAME layer — structural feedback (deterministic, always present)**
- Handles: layout integrity under state change, tab order signaling, keyboard focus management, scroll anchor preservation, loading skeleton geometry.
- Expresses: "the structure acknowledged your action." Feedback is positional and architectural — where things are, whether they moved, whether layout held.
- Timing: immediate to 150ms. Never delayed — structure never waits.
- Examples: focus ring expansion, skeleton border geometry, nav indicator position slide, layout Flip transitions, tab order highlight.
- Rule: FRAME feedback must function with motion disabled (`prefers-reduced-motion: reduce`). It is the baseline legibility layer.

**SIGNAL layer — expressive feedback (generative, contextual)**
- Handles: ScrambleText glitch, color inversion flash, scanline motion, ambient clock tick, idle standby state, sound synthesis, haptic pulse, scroll entrance choreography.
- Expresses: "the system is alive and responded to you." Feedback is atmospheric and behavioral — the interface has character.
- Timing: 34ms to 600ms, deliberate asymmetry. Signal feedback has personality.
- Examples: ScrambleText on hover, VHS color inversion on confirm, magenta scanline on skeleton, button scramble-to-PROCESSING, page wipe transition, idle scanline drift.
- Rule: SIGNAL feedback is progressive enhancement. If stripped out, FRAME must still communicate all state changes. SIGNAL cannot be the sole carrier of semantic information.

**Integration principle — "as easy as feeling"**
When both layers fire together, the result is: structure confirms (FRAME), character responds (SIGNAL). The user never consciously separates them — they just feel like the system is precise and alive. Neither layer alone achieves this. FRAME without SIGNAL is a spreadsheet. SIGNAL without FRAME is a demo reel.

Layered example — button click:
1. FRAME (0ms): `translateY(1px) scale(0.97)` — structure compresses.
2. SIGNAL (0ms): border flash at 150ms inversion — the system strobes.
3. FRAME (34ms): spring release begins — structure decompresses.
4. SIGNAL (200ms): text scrambles to `PROCESSING...` — character speaks.

---

*Apply alongside: `RSH-interaction-feedback-research.md` (full technique catalog) · `RSH-gsap-animation-research.md` (GSAP reference) · `SYS-motion.css` (token definitions)*
