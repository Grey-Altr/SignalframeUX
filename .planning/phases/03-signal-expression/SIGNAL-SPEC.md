# SIGNAL Layer Specification — SignalframeUX v1.0

**Created:** 2026-04-06
**Phase:** 03 — SIGNAL Expression
**Status:** Active
**Source:** Codifies Plans 03-01, 03-02, 03-03 and defers SIG-06/07/08 to post-v1.0

---

## 1. Motion Tokens Reference

All timing and easing values in the SIGNAL layer use these tokens. No hardcoded ms or cubic-bezier values.

| Token | CSS Variable | Value | Usage |
|-------|-------------|-------|-------|
| instant | `--duration-instant` | 34ms | Hard cuts, active press, section reveals |
| fast | `--duration-fast` | 100ms | Hover snap-in, quick interactions |
| normal | `--duration-normal` | 200ms | Standard transitions |
| slow | `--duration-slow` | 400ms | Hover return, stagger items |
| glacial | `--duration-glacial` | 600ms | Dramatic reveals, hero sequences |
| ease-default | `--ease-default` | `cubic-bezier(0.16, 1, 0.3, 1)` | Default out — decelerating settle |
| ease-hover | `--ease-hover` | `cubic-bezier(0.33, 1, 0.68, 1)` | Hover transitions — sharp entry |
| ease-spring | `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Spring overshoot (use sparingly) |

---

## 2. Effect Specifications

### ScrambleText — SIG-01

| Property | Value |
|----------|-------|
| Timing | 800ms (no token — GSAP duration in seconds: 0.8) |
| Easing | `power2.out` (GSAP internal) |
| Trigger | `ScrollTrigger.create({ start: "top bottom", once: true })` — fires on viewport entry; above-fold headings trigger on page load |
| Stagger | 100ms base delay + 50ms per heading index (`delay: 0.1 + i * 0.05`) |
| Mobile | **Persist** — ScrambleText fires on all screen sizes |
| CSS Fallback | `[data-anim="page-heading"]` text is visible by default (GSAP sets opacity:0 on init; if GSAP fails, text shows immediately) |
| Reduced Motion | `[data-anim="page-heading"]` covered by `[data-anim]` catch-all — `opacity: 1 !important; transform: none !important` — text shown instantly, no scramble |
| File | `components/layout/page-animations.tsx` → `initPageHeadingScramble()` |
| Characters | `"01!<>-_\\/[]{}—=+*^?#"` (binary + punctuation set — DU/TDR aesthetic) |

### Asymmetric Hover Timing — SIG-02

| Property | Value |
|----------|-------|
| Timing — in | 100ms (`--duration-fast`) — snap to hover state |
| Timing — out | 400ms (`--duration-slow`) — slow release from hover |
| Easing | CSS `transition` (no JS required) |
| Trigger | CSS `:hover` pseudo-class override — base state governs out; `:hover` override governs in |
| Applies To | `.sf-pressable`, `.sf-hoverable`, `.sf-invert-hover`, `.sf-link-draw::after` |
| Mobile | **Persist** — asymmetric timing is pure CSS, works on all pointer types |
| CSS Fallback | N/A — this IS the CSS implementation; no GSAP dependency |
| Reduced Motion | `@media (prefers-reduced-motion: reduce)` suppresses all transitions — both in and out timings are reset |
| File | `app/globals.css` — interaction class block |

**CSS Pattern:**
```css
.sf-hoverable {
  transition: all var(--duration-slow) var(--ease-default);  /* out: 400ms */
}
.sf-hoverable:hover {
  transition-duration: var(--duration-fast);                  /* in: 100ms override */
}
```

### Hard-Cut Section Reveal — SIG-03

| Property | Value |
|----------|-------|
| Timing | 34ms (`--duration-instant`) — opacity snap, not fade |
| Easing | `none` — no lerp, no softening |
| Trigger | `ScrollTrigger({ start: "top 80%", once: true })` — fires when section enters viewport |
| Animation | `opacity: 0 → 1` with `y: 20 → 0` |
| Mobile | **Persist** — hard cuts are architectural, not decorative |
| CSS Fallback | `[data-anim="section-reveal"] { opacity: 1; transform: none }` catch-all ensures content visible without GSAP |
| Reduced Motion | Section visible immediately — no animation sequence |
| File | `components/layout/page-animations.tsx` → `initCoreAnimations()` |

**DU/TDR Design Note:** 34ms is perceptually instant — this is a mechanical snap, not a cinematic fade. The contrast between the static frame and the revealed state IS the effect.

### Staggered Grid Entry — SIG-04

| Property | Value |
|----------|-------|
| Timing | 400ms per item (`--duration-slow`) |
| Stagger | 40ms interval between items (0.04s) |
| Easing | `power2.out` |
| Trigger | `ScrollTrigger.batch("[data-anim='stagger'] > *", { start: "top 85%", once: true })` |
| Batch Config | `interval: 0.04`, `batchMax: 12` — groups nearby items for synchronized wave |
| Initial State | `[data-anim="stagger"] > * { opacity: 0; transform: translateY(20px) }` (set in globals.css) |
| Mobile | **Persist** — stagger entry is structural reveal behavior |
| CSS Fallback | `[data-anim="stagger"] > *` covered by catch-all + reduced-motion reset — children visible immediately without GSAP |
| Reduced Motion | `[data-anim="stagger"] > *` included in reduced-motion selector — `opacity: 1 !important; transform: none !important` |
| File | `components/layout/page-animations.tsx` → `initCoreAnimations()` / `app/globals.css` |

### [data-anim] Progressive Enhancement — SIG-05

| Property | Value |
|----------|-------|
| Timing | N/A — CSS rule, no animation |
| Easing | N/A |
| Trigger | CSS presence selector — always active |
| Guarantee | Any element with `[data-anim]` (unrecognized value) renders `opacity: 1` without JS |
| Specificity Rule | `[data-anim]` (presence) has LOWER specificity than `[data-anim="value"]` (value) — specific rules override; catch-all only applies to unhandled values |
| Mobile | **Persist** — this is the safety net, not an effect |
| CSS Fallback | This IS the fallback — the entire mechanism exists for no-JS environments |
| Reduced Motion | `[data-anim]` included in `@media (prefers-reduced-motion: reduce)` selector list — all animated elements reset to visible |
| File | `app/globals.css` — `[data-anim]` catch-all block, after all specific `[data-anim="..."]` rules |

**Rule Ordering in globals.css:**
```css
[data-anim="section-reveal"] { opacity: 0; transform: translateY(20px); }
[data-anim="tag"] { opacity: 0; }
[data-anim="comp-cell"] { opacity: 0; transform: translateY(10px); }
[data-anim="cta-btn"] { opacity: 0; transform: translateY(8px); }
[data-anim="stagger"] > * { opacity: 0; transform: translateY(20px); }
[data-anim] { opacity: 1; }  /* CATCH-ALL — must be last */
```

### Canvas Cursor — SIG-09

| Property | Value |
|----------|-------|
| Timing | rAF loop — ~16ms per frame (60fps target) |
| Easing | N/A — direct position tracking, no lerp |
| Trigger | IntersectionObserver on `[data-cursor]` sections — activates when any cursor section is in viewport |
| Crosshair | 4 arms, 24px length, 1px stroke, color from `--color-primary` (OKLCH resolved to RGB via probe canvas at mount) |
| Particle Trail | Alpha-decay dots: `alpha -= 0.02/frame`, capped at 60 particles, drawn oldest-first |
| Section Scoping | `activeSectionCount` counter (not boolean) — handles multiple `[data-cursor]` sections intersecting simultaneously; canvas clears when no sections active |
| Mobile | **Collapse** — exits `useEffect` early on `(pointer: coarse)` — no canvas writes, no listeners, no rAF |
| CSS Fallback | System cursor (`cursor: auto`) — canvas hidden; `.sf-cursor { display: none }` on coarse pointer |
| Reduced Motion | System cursor only — canvas cursor suppressed via `.sf-cursor { display: none }` in reduced-motion block |
| HiDPI | `devicePixelRatio` scaling on canvas dimensions; CSS size locked to `100vw/100vh` |
| Tab Visibility | `visibilitychange` listener — cancels rAF on hide, restarts on show |
| z-index | `var(--z-cursor, 9999)` |
| File | `components/animation/canvas-cursor.tsx` → wired in `components/layout/global-effects.tsx` |

### VHS Overlay — (SIG-03 family, existing)

| Property | Value |
|----------|-------|
| Timing | GSAP timeline with multiple simultaneous layers |
| Trigger | Mounts on page load via GlobalEffects (lazy-loaded) |
| Layers | CRT scan overlay + noise texture — separate opacity controls via `--sf-vhs-crt-opacity`, `--sf-vhs-noise-opacity` |
| Mobile | **Collapse** — `@media (pointer: coarse) { .vhs-overlay { display: none } }` in globals.css |
| CSS Fallback | Hidden if GSAP timeline fails to initialize |
| Reduced Motion | VHS overlay suppressed — included in `@media print` and `@media (prefers-reduced-motion)` signal layer suppression |
| File | `components/animation/vhs-overlay.tsx` |

### Circuit Dividers — (SIG family, existing)

| Property | Value |
|----------|-------|
| Timing | DrawSVGPlugin scrub — tied to scroll position |
| Trigger | ScrollTrigger with scrub |
| Mobile | **Collapse** — DrawSVG animation disabled; static SVG remains visible |
| CSS Fallback | Static SVG path visible (SVG renders without GSAP; only the draw animation is GSAP) |
| Reduced Motion | Static SVG — no draw animation |
| File | `components/animation/circuit-divider.tsx` |

### Hero Mesh — (SIG family, existing)

| Property | Value |
|----------|-------|
| Timing | GSAP timeline — multiple layer orchestration |
| Trigger | Mounts on page load via GlobalEffects |
| Mobile | **Collapse** — static first frame shown on mobile |
| CSS Fallback | Static background — hero renders without GSAP timeline |
| Reduced Motion | Static frame — timeline suppressed |
| File | `components/animation/hero-mesh.tsx` |

---

## 3. Mobile Behavior Matrix

**Signal principle:** SIGNAL decorates FRAME — when decoration cannot run, FRAME remains intact.

| Effect | Desktop | Mobile (pointer: coarse) | Fallback |
|--------|---------|--------------------------|----------|
| **PERSISTS** | | | |
| ScrambleText (SIG-01) | Full scramble on scroll entry | Full scramble on scroll entry | Text visible immediately |
| Asymmetric Hover (SIG-02) | 100ms in / 400ms out | CSS transitions active (touch: no hover) | Standard CSS transition |
| Hard-Cut Section Reveal (SIG-03) | 34ms opacity snap on scroll | 34ms opacity snap on scroll | Section visible immediately |
| Staggered Grid Entry (SIG-04) | 400ms + 40ms stagger cascade | 400ms + 40ms stagger cascade | Children visible immediately |
| [data-anim] Catch-all (SIG-05) | CSS safety net active | CSS safety net active | Content visible — always |
| **COLLAPSES** | | | |
| Canvas Cursor (SIG-09) | Crosshair + particle trail on `[data-cursor]` | Hidden — no canvas, no listeners | System cursor |
| VHS Overlay | CRT + noise layers active | `display: none` | Clean background |
| Circuit Dividers | DrawSVG scrub animation | Static SVG | Static SVG path |
| Hero Mesh | Full GSAP timeline | Static first frame | Static background |

**Collapse mechanism:** `@media (pointer: coarse)` — targets touch devices correctly without viewport-width heuristics.

---

## 4. Deferred Effects — Post-v1.0

These effects are formally out of scope for v1.0. They are listed here to prevent rediscovery and to anchor the rationale.

### Audio Feedback Palette — SIG-06

**Status:** DEFERRED — post-v1.0

**Rationale:** Web Audio API synthesized tones require gesture-gating (browser autoplay policy), volume control UX, and per-interaction audio design. Implementing correctly without creating a distracting or inaccessible experience requires dedicated iteration beyond Phase 3 scope.

**Implementation path (future):** `AudioContext` with programmatic oscillator tones; gesture gate on first interaction; respect `prefers-reduced-motion` as proxy for low-stimulation preference; per-interaction tone library.

---

### Haptic Feedback — SIG-07

**Status:** DEFERRED — post-v1.0

**Rationale:** `navigator.vibrate()` (Vibration API) has limited browser support (no Safari/iOS), requires device-specific pattern tuning, and is not detectable without try/catch. Not critical for Awwwards SOTD evaluation which is desktop-primary.

**Implementation path (future):** Feature-detect `navigator.vibrate`, define pattern map per interaction type (press: [10], error: [50, 25, 50]), wrap in user-gesture handler.

---

### Idle State Animation — SIG-08

**Status:** DEFERRED — post-v1.0

**Rationale:** `IdleOverlay` component exists in `global-effects.tsx` but grain drift and color pulse refinement require dedicated visual QA iteration. Current implementation shows a basic idle indicator. Full refinement is post-v1.0 polish after core SIGNAL layer is stable.

**Implementation path (future):** GSAP timeline triggered by `document` inactivity (mousemove/keydown idle timer), grain drift via noise texture translateX, color pulse via CSS custom property animation on `--color-primary`.

---

## 5. Progressive Enhancement Guarantee

The SIGNAL layer is built on a hard contract: **all content must be visible without JavaScript.**

**Mechanism:**
1. CSS sets `opacity: 1` on all `[data-anim]` elements (catch-all rule, lowest specificity)
2. Specific `[data-anim="value"]` rules set the animated initial state (`opacity: 0`, `transform: translateY(...)`)
3. GSAP reads the initial state and animates to visible on trigger
4. If GSAP fails to load: CSS catch-all wins — everything visible
5. If JavaScript is disabled: CSS catch-all wins — everything visible
6. If `prefers-reduced-motion: reduce`: reduced-motion block resets all animated elements to `opacity: 1; transform: none` before GSAP runs

**Result:** Zero content is hidden without a GSAP-delivered reveal pathway. The SIGNAL layer is purely additive — it enhances the experience but cannot break it.

This is the SIG-05 model: CSS default visibility, GSAP initial-state override, animation reveals. No JS = all content visible.

---

## 6. Key Links

| Spec Reference | Source File | Pattern |
|---------------|-------------|---------|
| Timing values (34ms, 100ms, 400ms) | `app/globals.css` — `:root` motion tokens | `--duration-*` |
| Section reveal 34ms hard cut | `components/layout/page-animations.tsx` | `duration: 0.034, ease: "none"` |
| [data-anim] catch-all + reduced-motion | `app/globals.css` — SIGNAL fallbacks block | `[data-anim] { opacity: 1 }` |
| Asymmetric hover classes | `app/globals.css` — interaction classes | `.sf-pressable`, `.sf-hoverable` |
| Canvas cursor implementation | `components/animation/canvas-cursor.tsx` | rAF + IntersectionObserver |
| ScrambleText + stagger | `components/layout/page-animations.tsx` | `initPageHeadingScramble`, `ScrollTrigger.batch` |
| VHS mobile collapse | `app/globals.css` — pointer: coarse block | `@media (pointer: coarse) { .vhs-overlay { display: none } }` |
