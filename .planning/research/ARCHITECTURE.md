# Architecture Patterns — v1.7 Aesthetic Effects Integration

**Domain:** SIGNAL layer compositing architecture for 8 visual effects
**Researched:** 2026-04-11
**Confidence:** HIGH — all findings based on direct codebase audit (globals.css, vhs-overlay.tsx, global-effects.tsx, signal-canvas.tsx, signal-overlay.tsx, tokens.css, aesthetic-prototypes.md, analyst-brief-v2.md)

---

## Existing Layer Model (Verified)

Before designing the integration architecture, the actual layer stack in production must be understood. This is what currently renders in z-index order:

```
z: -1         SignalCanvas fixed canvas (WebGL scenes via scissor/viewport)
z: 1          #bg-shift-wrapper (section background colors)
z: 10         Page content (blocks, typography, SF components)
z: 100        .sf-idle-overlay (scan line drift, fixed, pointer-events: none)
z: 200        .sf-scroll-top button
z: 300        .sf-progress bar
z: 500        CanvasCursor canvas (crosshair + particle trail, Canvas 2D)
z: 9999       Nav
z: 99999      .vhs-overlay (the entire VHS layer stack)
```

The VHS overlay occupies `--z-vhs: 99999`, sitting above everything including nav. It is the topmost element in the compositing order. This is intentional — it must read as a physical substrate applied over the entire display.

### VHS Overlay Internal Layer Structure (7 sub-layers)

All inside `.vhs-overlay` (fixed, inset: 0, `filter: blur(0.8px) brightness(1.08) contrast(1.04)`):

| Sub-layer | Element | Technique | Current Opacity |
|-----------|---------|-----------|----------------|
| CRT lines | `.vhs-crt` | `repeating-linear-gradient` 4px period | `var(--sf-vhs-crt-opacity)` = **0.2** (hardcoded token) |
| Scanline fast | `.vhs-scanline` | `::before` 1px magenta glow line, `::after` backdrop-filter | GSAP: `y: 100vh` over 28s |
| Scanline slow | `.vhs-scanline--slow` | Same structure, 1px, no glow | GSAP: `y: 100vh` over 84s |
| Noise | `.vhs-noise` | Inline SVG feTurbulence, baseFrequency 0.85 | `var(--sf-vhs-noise-opacity)` = **0.015** (hardcoded token) |
| Burst | `.vhs-burst` | Inline SVG feTurbulence, baseFrequency 1.2 | GSAP: 0 → 0.015–0.035 every 12–25s |
| Glitch | `.vhs-glitch` | Linear gradient, `mix-blend-mode: difference` | GSAP: 0 → clip-path slices every 25–50s |
| Aberration | `.vhs-aberration--top/bottom` | 140px gradient strips at edges | ~0.12 max at edges |

### Grain Layer

`.sf-grain::after` — `position: absolute` pseudo-element, `background: url("/grain.svg") repeat`, `mix-blend-mode: multiply`, `opacity: var(--sf-grain-opacity)` = **0.03** (hardcoded token).

Animated variant: `.sf-grain-animated::after` — same grain with `@keyframes sf-grain-drift` (0.8s steps(4) infinite), triggered by idle state.

### Signal Intensity — Current State

`--signal-intensity: 0.5` is the single dial. It is read by:
- WebGL shader uniforms (`uIntensity`) in GLSLHero, ProofShader, SignalMesh
- `SignalOverlay` panel displays its value
- `InstrumentHUD` shows `SIG:0.5`

**Critical finding (verified, not assumed):** `--signal-intensity` does NOT govern the VHS overlay. `--sf-vhs-crt-opacity` (0.2) and `--sf-vhs-noise-opacity` (0.015) are hardcoded tokens in `lib/tokens.css:145-148` and `globals.css:164-165`. There is no CSS calc() expression linking them to `--signal-intensity`. VHS runs at full token values regardless of what the intensity dial is set to.

This is the core architectural inconsistency the analyst identified. The system claims a single dial governs the aesthetic register, but VHS is exempt from that dial.

---

## The Compositing Question: Separate Z-Layers vs. Single Composite

The downstream consumer question was "separate z-layers, single composite layer, or something else?" The answer is the system already uses separate z-layers and that architecture is the correct one to extend — with one refinement.

**Recommendation: Stratified z-layer model with two compositing groups.**

Do not collapse effects into a single composite layer. CSS `filter` on a wrapper compositor-promotes all children, which prevents children from using `mix-blend-mode` relative to content below. The existing VHS overlay cannot use `mix-blend-mode: difference` on its glitch layer while also blending against page content — the outer `filter` creates an isolated compositing context. This is already an accepted constraint in the current code. Accept it; do not fight it.

Instead, define two compositing groups with different compositing semantics:

**Group A — Substrate effects (sit above content, multiply/overlay blend):**
- Grain overlay (CSS pseudo-element)
- CRT scanlines (CSS)
- VHS enhancements (extensions of the existing `.vhs-overlay`)
- Halftone texture (new, CSS SVG filter)
- Circuit overlay (new, CSS)

All Group A effects are composited inside the existing `.vhs-overlay` container (z: 99999) or at the `.sf-grain` level. They apply globally to all content beneath them.

**Group B — Generative background (sit beneath content, render as world-space):**
- Mesh gradient / organic color field (new, CSS or WebGL)
- Particle field (new, WebGL — adds to SignalCanvas)
- WebGL shaders already in place (GLSLHero, GLSLSignal, ProofShader, SignalMesh)

Group B effects are composited at z: -1 (the SignalCanvas canvas) or as `position: fixed; z-index: -1` CSS elements behind the content layer.

**Group C — Event-driven overlays (fire on trigger, then recede):**
- Glitch transition (new, positioned on top of content, then opacity: 0)
- Symbol system / CD glyphs (new, decorative, positioned)

Group C effects live at the existing `--z-overlay` (100) level and are activated by the idle escalation system or specific events.

---

## The Intensity Problem — Why Linear Scaling Fails

The analyst identified this clearly and it is borne out by the codebase. A linear 0–1 dial cannot govern 8 heterogeneous effects coherently because each effect has a different perceptual threshold:

| Effect | Perceptual threshold | Linear behavior at 1.0 | Actual need |
|--------|---------------------|------------------------|-------------|
| CRT scan lines | Visible at ~5% opacity | 0.2 opacity at 1.0 is strong | Logarithmic: loud fast, quiet long tail |
| Grain | "Film texture" → "noise interference" at ~0.12 | 0.12 is already at the limit | Hard ceiling, not linear |
| Chromatic aberration | Atmospheric at 1–2px, broken at 5px+ | Unbounded linear → visual break | Clamped: max 3px regardless of intensity |
| Glitch timing | Rare (25–50s interval) is diegetic; frequent (3s) is broken | Linear frequency → visual chaos | Threshold-gated: only fires above 0.7 |
| Halftone | Texture at 10–15%, pattern foreground at 30% | Linear → occlude content | Hard ceiling at 15%, off below 0.4 |
| Particle field | Subtle at 2k particles, busy at 10k | Linear particle count → mud | Stepped: 0-0.4 off, 0.4-0.7 sparse, 0.7-1.0 dense |
| Mesh gradient | Always atmospheric; safe to scale linearly | No collision | Linear opacity OK |
| Circuit overlay | Invisible behind grain above 0.08 | Layer occluded → wasted | Must be exclusive with high grain |

### Solution: Perceptual Intensity Curves

Instead of each effect reading `--signal-intensity` directly, route intensity through per-effect derived custom properties that encode the correct perceptual mapping. These are computed once (by a small JS function in `global-effects.tsx` on intensity change) and written to `:root`.

This is the "intensity bridge" pattern. The SignalOverlay already writes to `:root`. Extend this pattern.

**New derived custom properties (computed from `--signal-intensity`):**

```css
/* These are COMPUTED values, not authored by designers.
   They are set by updateSignalDerivedProps() in global-effects.tsx. */
--signal-grain-opacity:       /* 0–0.10, logarithmic, ceiling at 0.10 */
--signal-vhs-crt-opacity:     /* 0.05–0.22, replaces hardcoded --sf-vhs-crt-opacity */
--signal-vhs-noise-opacity:   /* 0.005–0.025, replaces hardcoded --sf-vhs-noise-opacity */
--signal-halftone-opacity:    /* 0–0.12, off below intensity 0.4, ceiling at 0.12 */
--signal-circuit-opacity:     /* 0–0.04, off above intensity 0.6 (grain occlusion) */
--signal-aberration-px:       /* 0–3px, clamped, feeds CSS transforms */
--signal-mesh-gradient:       /* 0–1, linear, safe for this effect */
```

**The mapping function lives in `global-effects.tsx`** (the file that already orchestrates GlobalEffects). It fires on every `--signal-intensity` change via a MutationObserver on `document.documentElement` style attribute (the same observer pattern the WebGL scenes use via `getSignalVars()` in the singleton).

```typescript
// In global-effects.tsx — new function, called from a useEffect
function updateSignalDerivedProps(intensity: number): void {
  const root = document.documentElement;

  // Grain: logarithmic, ceiling at 0.10
  const grain = Math.min(0.10, 0.03 + (intensity ** 0.6) * 0.07);
  root.style.setProperty("--signal-grain-opacity", grain.toFixed(4));

  // VHS CRT lines: replace hardcoded token
  const crt = 0.05 + intensity * 0.17;
  root.style.setProperty("--signal-vhs-crt-opacity", crt.toFixed(4));

  // VHS noise: replace hardcoded token
  const noise = 0.005 + intensity * 0.02;
  root.style.setProperty("--signal-vhs-noise-opacity", noise.toFixed(4));

  // Halftone: off below 0.4, max 0.12
  const halftone = intensity < 0.4 ? 0 : Math.min(0.12, (intensity - 0.4) * 0.20);
  root.style.setProperty("--signal-halftone-opacity", halftone.toFixed(4));

  // Circuit: off above 0.6 (grain occlusion)
  const circuit = intensity > 0.6 ? 0 : Math.min(0.04, intensity * 0.067);
  root.style.setProperty("--signal-circuit-opacity", circuit.toFixed(4));

  // Aberration: clamped at 3px
  const aberration = Math.min(3, intensity * 3);
  root.style.setProperty("--signal-aberration-px", `${aberration.toFixed(1)}px`);
}
```

**Each effect's CSS reads its derived property, not `--signal-intensity` directly.** This is the critical boundary. `--signal-intensity` is a user-facing control. `--signal-grain-opacity` is an implementation detail of the grain effect. They are decoupled.

---

## Component Boundaries

### Modified Components

**`lib/tokens.css`** (MODIFY)
- Remove hardcoded values for `--sf-vhs-crt-opacity` and `--sf-vhs-noise-opacity`
- Replace with derived property references: `var(--signal-vhs-crt-opacity, 0.2)` and `var(--signal-vhs-noise-opacity, 0.015)`
- The fallback values preserve existing behavior when derived props have not been initialized yet (SSR, reduced motion)
- The grain token `--sf-grain-opacity` similarly becomes the fallback for `--signal-grain-opacity`

**`components/animation/vhs-overlay.tsx`** (MODIFY)
- No structural changes; the layer architecture stays identical
- CSS classes `.vhs-crt` and `.vhs-noise` already read from the tokens, so once tokens.css is updated the VHS overlay responds to intensity automatically
- No JS changes required in the component itself

**`app/globals.css`** (MODIFY)
- `.vhs-crt { opacity: var(--signal-vhs-crt-opacity, 0.2); }` — change token reference
- `.vhs-noise { opacity: var(--signal-vhs-noise-opacity, 0.015); }` — change token reference
- `.sf-grain::after { opacity: var(--signal-grain-opacity, 0.03); }` — change token reference
- `.sf-grain-animated::after { opacity: var(--signal-grain-opacity, 0.03); }` — same
- Add new `.sf-halftone` utility class reading `var(--signal-halftone-opacity, 0)`
- Add new `.sf-circuit-overlay` utility class reading `var(--signal-circuit-opacity, 0)`

**`components/animation/signal-overlay.tsx`** (MODIFY — small)
- The `handleIntensity()` function currently writes only `--signal-intensity`
- Extend it to also call `updateSignalDerivedProps(value / 100)` after writing the base value
- OR: the MutationObserver in global-effects.tsx picks up the `:root` style mutation and fires `updateSignalDerivedProps()` automatically — no changes needed in signal-overlay.tsx
- Recommend the MutationObserver approach (zero coupling between SignalOverlay and the derived props function)

**`components/layout/global-effects.tsx`** (MODIFY)
- Add `useEffect` that registers a MutationObserver on `document.documentElement` watching the `style` attribute
- On mutation, read `--signal-intensity` from computed style and call `updateSignalDerivedProps()`
- Fire `updateSignalDerivedProps()` once on mount with the default value (0.5) to initialize derived props
- This observer is the same pattern as `getSignalVars()` in signal-canvas.tsx — one more observer for the CSS layer (separate from the WebGL uniform observer)
- The idle escalation recalibration also lives here: after the aesthetic push raises grain baseline, the Phase 2 idle escalation tween must target `--signal-grain-opacity` (not `--sf-grain-opacity`) and must tween to a value above the baseline set by the intensity curve, not below it

**`lib/signal-canvas.tsx`** (MODIFY — minor)
- The existing `getSignalVars()` / `getState()` pattern is unchanged
- Add `updateSignalDerivedProps` export so it can be called from the singleton's MutationObserver as well, ensuring WebGL scenes and CSS effects are derived from the same single source of truth
- Alternative: keep the CSS derived props entirely in global-effects.tsx (simpler, avoids coupling signal-canvas to CSS concerns) — this is the recommended approach

### New Components

**`components/animation/grain-overlay.tsx`** (NEW)
- Wraps the grain texture as a standalone component (not just a CSS utility class)
- Props: `opacity?: number` (overrides derived prop for local use), `animated?: boolean`
- Reads `--signal-grain-opacity` from CSS (no JS state)
- Used in Storybook story with controls
- Renders a `<div className="sf-grain" aria-hidden="true" />` with the derived token
- This is a thin wrapper for Storybook discoverability; the actual effect is CSS

**`components/animation/halftone-texture.tsx`** (NEW)
- CSS SVG filter technique: `feTurbulence` + `feComponentTransfer` (or `feBlend` + threshold)
- `position: absolute; inset: 0; pointer-events: none; z-index: var(--z-above-bg)`
- `opacity: var(--signal-halftone-opacity, 0)` — reads derived property, invisible by default
- Groups A substrate: always present in DOM, opacity drives presence
- Must be CSS-first: no JS animation, no WebGL
- Performance note: SVG `feTurbulence` is CPU-composited in many browsers; do not apply at full-page coverage at high resolution — use a tiled background-image SVG pattern instead (same technique as grain)

**`components/animation/mesh-gradient.tsx`** (NEW — CSS implementation)
- `position: fixed; inset: 0; z-index: -1; pointer-events: none`
- CSS `background: radial-gradient(...)` with slow CSS animation (`@keyframes`)
- NOT WebGL — keeps particle field as the only new WebGL addition
- Opacity governed by `var(--signal-mesh-gradient, 0)`
- Sits at z: -1, same as SignalCanvas canvas — they must not conflict visually; the mesh gradient appears behind WebGL content by rendering order (WebGL canvas draws on top via alpha compositing)
- Alternative for the WebGL-required particle field interaction: mesh gradient is CSS, particle field is WebGL — they coexist at the same z-level but the canvas is on top due to DOM order

**`components/animation/particle-field.tsx`** (NEW — WebGL, extends SignalCanvas)
- Uses `useSignalScene()` hook to register with the singleton renderer
- Does NOT create a new WebGL context
- `BufferGeometry` with `PointsMaterial` (not a shader from scratch)
- Particle count stepped: `intensity < 0.4 → 0 particles, 0.4–0.7 → 2000, 0.7–1.0 → 5000`
- Full 10,000 particles is too expensive on non-M1 hardware (analyst finding)
- IntersectionObserver gating inherited from `useSignalScene()` — if particle container is not in viewport, zero GPU cost
- Reduced-motion: `if (reducedMotion) { return static particle positions, no animation loop }` — must be explicit, not speed-throttled
- Registers as a single scene entry; participates in the existing scissor/viewport render loop
- This is the one new WebGL scene addition

**`components/animation/circuit-overlay.tsx`** (NEW — CSS)
- Low-opacity SVG circuit diagram pattern as CSS `background-image`
- `opacity: var(--signal-circuit-opacity, 0)` — reads derived property
- Designed to be exclusive with high grain (the derived prop mapping ensures circuit goes to 0 above intensity 0.6)
- `position: fixed; inset: 0; z-index: var(--z-above-bg); pointer-events: none`

**`components/animation/glitch-transition.tsx`** (NEW — GSAP)
- Event-triggered overlay, not ambient
- Extends the existing `.vhs-glitch` technique already in `vhs-overlay.tsx` (GSAP clip-path slices)
- Exposed as an imperative trigger function: `triggerGlitch(element?: HTMLElement)` — called by idle escalation Phase 4 and potentially by other interaction points
- Renders a fixed overlay that is normally `opacity: 0; pointer-events: none`
- Fires a 100–300ms GSAP timeline on trigger, then returns to hidden
- Respects `prefers-reduced-motion` (guard in the trigger function before GSAP fires)

**`components/animation/cd-symbol-system.tsx`** (NEW — CSS/SVG)
- Decorative glyph system for diegetic layering
- CSS-only: SVG sprites positioned via CSS, opacity driven by scroll position or idle state
- Not wired to `--signal-intensity` directly — wired to idle escalation class (`.sf-idle-3`)

### Unchanged Components

- `lib/signal-canvas.tsx` — singleton architecture unchanged
- `hooks/use-signal-scene.ts` — particle field uses this hook as-is
- `components/animation/vhs-overlay.tsx` — no structural changes; CSS token change is sufficient
- `components/animation/signal-overlay.tsx` — unchanged if MutationObserver approach is used

---

## Data Flow

### Intensity Change → All 8 Effects

```
User moves SignalOverlay slider (or SignalSection sets intensity to 1.0 on scroll)
    ↓
signal-overlay.tsx: document.documentElement.style.setProperty("--signal-intensity", value)
    ↓
MutationObserver in global-effects.tsx fires (watching documentElement.style)
    ↓
updateSignalDerivedProps(intensity):
    → writes --signal-grain-opacity      (logarithmic curve)
    → writes --signal-vhs-crt-opacity    (linear, replaces hardcoded token)
    → writes --signal-vhs-noise-opacity  (linear, replaces hardcoded token)
    → writes --signal-halftone-opacity   (gated: off below 0.4)
    → writes --signal-circuit-opacity    (inverted: off above 0.6)
    → writes --signal-aberration-px      (clamped: max 3px)
    → writes --signal-mesh-gradient      (linear, safe)
    ↓
CSS reads derived props immediately (next paint):
    .vhs-crt → opacity: var(--signal-vhs-crt-opacity)     [VHS CRT lines]
    .vhs-noise → opacity: var(--signal-vhs-noise-opacity)  [VHS noise]
    .sf-grain::after → opacity: var(--signal-grain-opacity) [grain substrate]
    .sf-halftone → opacity: var(--signal-halftone-opacity) [halftone texture]
    .sf-circuit-overlay → opacity: var(--signal-circuit-opacity) [circuit]
    ↓
MutationObserver in signal-canvas.tsx (existing) also fires:
    → getState().signalVars = { intensity, speed, accent }
    ↓
WebGL ticker reads cached signal vars (next GSAP ticker frame):
    → shader uIntensity uniforms update
    → ParticleField steps particle count (0 / 2000 / 5000) based on thresholds
```

### Idle Escalation → Effects

```
IdleOverlay in global-effects.tsx (existing): setTimeout chain
    ↓
8s:   Phase 1 → grain drift + scan line overlay (existing, unchanged)
30s:  Phase 2 → tween --signal-grain-opacity upward
              (must tween to value ABOVE the baseline set by current intensity)
              Safe formula: target = min(0.10, currentGrainOpacity + 0.04)
60s:  Phase 3 → adds .sf-idle-3 class → CSS shows cd-symbol glyphs
120s: Phase 4 → triggerGlitch() on the glitch-transition overlay
              (reduced-motion guard inside triggerGlitch — JS-level, not CSS-only)
```

### SSR / Token Bridge Cascade Order

```
Server render:
    CSS custom property defaults (tokens.css :root block) apply:
        --signal-intensity: 0.5  (token default)
        --sf-vhs-crt-opacity: 0.2  (still exists as fallback)
        --sf-vhs-noise-opacity: 0.015 (still exists as fallback)
        --signal-grain-opacity: not yet set → fallback var(--sf-grain-opacity, 0.03)
    ↓
Client hydration:
    global-effects.tsx mounts → useEffect fires → updateSignalDerivedProps(0.5)
    → derived props written to :root
    → CSS var() references now resolve to computed values
    → VHS opacity changes from fallback 0.2 to computed 0.14 (at intensity 0.5)
```

**SSR behavior:** During SSR and the hydration window, effects fall back to their hardcoded token values (VHS at 0.2, grain at 0.03). After hydration, they jump to the intensity-derived values. At intensity 0.5, the difference is small (grain stays near 0.03, VHS changes slightly). This is acceptable — it is a perceptually minor transition, not a flash.

If intensity needs to be SSR-correct (grain at the right value from first paint), move the default value into the `:root` CSS block as `--signal-grain-opacity: 0.04` (the computed value for intensity 0.5). This eliminates the post-hydration adjustment for the default case.

---

## Build Order

Dependencies determine sequence. This is not negotiable.

### Phase 1 — Intensity Bridge (prerequisite for everything)

**What:** `updateSignalDerivedProps()` in `global-effects.tsx` + token.css/globals.css to reference derived props.

**Why first:** Every subsequent effect must consume derived properties, not raw `--signal-intensity`. If this foundation is absent, effects added later will not be coherently governed. The analyst identified this as P0.

**Deliverables:**
- `updateSignalDerivedProps()` function in `global-effects.tsx`
- MutationObserver registered on mount in `GlobalEffects` useEffect
- `lib/tokens.css`: `--sf-vhs-crt-opacity` and `--sf-vhs-noise-opacity` replaced with derived var() references
- `app/globals.css`: `.vhs-crt`, `.vhs-noise`, `.sf-grain::after` opacity references updated
- VHS now scales with intensity at zero new component count

**Acceptance:** At intensity 0.0, VHS CRT lines drop to ~0.05 opacity (not 0.2). At intensity 1.0, they reach 0.22. Grain drops to near-zero at intensity 0.0.

---

### Phase 2 — Grain Elevated Baseline + Idle Escalation Recalibration

**Depends on:** Phase 1 (derived props exist)

**What:** Raise grain baseline by adjusting the `updateSignalDerivedProps` curve. The default intensity 0.5 now yields `--signal-grain-opacity ≈ 0.06–0.08` rather than the current 0.03. Recalibrate Phase 2 idle escalation tween to target `currentValue + 0.04` instead of a hardcoded 0.08 (which would reduce grain if baseline is already 0.08).

**Why this order:** Grain is the lowest-risk effect and the thematic foundation. All other overlay effects (halftone, circuit) must be evaluated against a visible grain layer to detect moiré and occlusion.

**Acceptance:** Grain visibly readable as film texture at default intensity. Idle Phase 2 escalation increases grain visibly (upward direction confirmed).

---

### Phase 3 — VHS Enhancement (existing component, CSS-only changes)

**Depends on:** Phase 1 (VHS now intensity-governed)

**What:** Tune VHS layer opacities now that they respond to intensity. The hardcoded values (0.2 CRT, 0.015 noise) were tuned in isolation. Re-tune the curve endpoints in `updateSignalDerivedProps`. May also involve adjusting GSAP timing on scanline travel, burst frequency, glitch frequency — these remain GSAP-controlled, not intensity-derived (timing is aesthetic, not parametric).

**Why before halftone:** VHS + grain stacking must be visually resolved before adding halftone, because VHS and halftone have independent texture frequencies that can create moiré. Evaluate VHS + grain at multiple intensities before halftone is introduced.

**Acceptance:** Manual visual QA at intensity 0.0, 0.5, 1.0 with only grain and VHS active. No moiré artifacts, no "visually broken" territory at 1.0.

---

### Phase 4 — Halftone Texture

**Depends on:** Phases 2 and 3 (visual baseline established)

**What:** `components/animation/halftone-texture.tsx` (new component). SVG tiled background-image pattern (not `feTurbulence` at full-page — too expensive on non-M1 hardware). Opacity from `--signal-halftone-opacity` (zero below intensity 0.4).

**Why this position:** Halftone is the highest moiré risk (grain + halftone = interference pattern if frequencies collide). Must be evaluated against the existing grain layer. The gate between phases 2/3 and phase 4 is the combined visual coherence review the analyst requires.

**Acceptance:** Halftone visible as atmospheric dot texture at intensity 0.6+, invisible below 0.4. No moiré with grain (validated by visual review). No scroll jank on non-M1 hardware (test on Intel MacBook or equivalent).

---

### Phase 5 — Circuit Overlay

**Depends on:** Phase 2 (grain level established, circuit must be exclusive with high grain)

**What:** `components/animation/circuit-overlay.tsx`. Low-opacity SVG circuit pattern. Reads `--signal-circuit-opacity` which is 0 above intensity 0.6 (automatically exclusive with elevated grain).

**Why here:** Circuit is a subtle background texture that only works when grain is low. The derived property mapping handles this automatically once Phase 1 is in place. The component itself is simple — the complexity is in Phase 1.

**Acceptance:** Circuit visible at intensity 0.0–0.5, invisible above 0.6. Invisible behind elevated grain (confirmed by visual review at intensity 0.5).

---

### Phase 6 — Mesh Gradient (CSS)

**Depends on:** None (purely CSS, no signal routing needed beyond `--signal-mesh-gradient`)

**What:** `components/animation/mesh-gradient.tsx`. CSS `radial-gradient` background with slow animation. Fixed position, z: -1. Does not use WebGL.

**Why defer:** Low risk, low dependency. Deferring until phase 6 prevents it from polluting the visual evaluation of grain/VHS/halftone stacking decisions.

**Acceptance:** Atmospheric color field visible at default intensity. Does not compete visually with WebGL shader scenes above it.

---

### Phase 7 — Particle Field (WebGL)

**Depends on:** Phase 1 (intensity mapping), confirmed WebGL context availability

**What:** `components/animation/particle-field.tsx`. Uses `useSignalScene()`. `PointsMaterial` with `BufferGeometry`. Stepped particle count (0 / 2000 / 5000). Gated by `IntersectionObserver` from the hook.

**Why last among ambient effects:** WebGL addition has the highest risk (GPU memory, context limits, mobile compatibility). Build confidence that all CSS effects are stable before adding WebGL complexity.

**Acceptance:** Particles visible at intensity 0.5+ (2000 points). No second WebGL context created. No frame drops on Intel MacBook at 2000 particles. Reduced-motion: static particle positions, animation loop stopped.

---

### Phase 8 — Glitch Transition + CD Symbol System

**Depends on:** Phases 1 (intensity bridge) and idle escalation recalibration (Phase 2)

**What:** `glitch-transition.tsx` as imperative trigger component, `cd-symbol-system.tsx` as CSS/SVG decorative layer. Wire both into idle escalation phases 3 and 4.

**Acceptance:** Glitch fires on idle Phase 4 (120s). Symbols visible on idle Phase 3 (60s). Both suppressed by `prefers-reduced-motion` at JS level.

---

### Phase 9 — SignalOverlay Panel Extension

**Depends on:** All ambient effects in place

**What:** Extend the `SignalOverlay` (Shift+S) panel to expose per-effect toggles or show the derived property values as read-only readouts. This is a UX convenience — operators can inspect what the intensity dial is producing.

**Acceptance:** Panel shows derived property values. Optional: per-effect toggle checkboxes to disable individual effects for debugging.

---

## Integration Points Table

| File | Change Type | What Changes | Integrates With |
|------|-------------|--------------|-----------------|
| `lib/tokens.css` | MODIFY | `--sf-vhs-crt-opacity` → `var(--signal-vhs-crt-opacity, 0.2)` fallback | `globals.css`, `vhs-overlay.tsx` (via CSS) |
| `lib/tokens.css` | MODIFY | `--sf-vhs-noise-opacity` → `var(--signal-vhs-noise-opacity, 0.015)` fallback | Same |
| `app/globals.css` | MODIFY | `.vhs-crt`, `.vhs-noise` opacity token references | `lib/tokens.css` |
| `app/globals.css` | MODIFY | `.sf-grain::after` opacity → `var(--signal-grain-opacity, 0.03)` | `lib/tokens.css` |
| `app/globals.css` | ADD | `.sf-halftone` utility class | `HalftoneTexture` component |
| `app/globals.css` | ADD | `.sf-circuit-overlay` utility class | `CircuitOverlay` component |
| `components/layout/global-effects.tsx` | MODIFY | Add `updateSignalDerivedProps()` + MutationObserver | All CSS-driven effects |
| `components/layout/global-effects.tsx` | MODIFY | Idle escalation Phase 2 tween target recalibration | `--signal-grain-opacity` |
| `components/layout/global-effects.tsx` | MODIFY | Idle Phase 3 → trigger CD symbol visibility | `cd-symbol-system.tsx` |
| `components/layout/global-effects.tsx` | MODIFY | Idle Phase 4 → call `triggerGlitch()` | `glitch-transition.tsx` |
| `components/animation/vhs-overlay.tsx` | UNCHANGED | CSS token change is sufficient | — |
| `components/animation/signal-overlay.tsx` | UNCHANGED | MutationObserver in global-effects catches the write | — |
| `components/animation/grain-overlay.tsx` | NEW | Storybook wrapper for grain utility | `app/globals.css` |
| `components/animation/halftone-texture.tsx` | NEW | CSS SVG pattern overlay | `app/globals.css`, `--signal-halftone-opacity` |
| `components/animation/mesh-gradient.tsx` | NEW | CSS radial-gradient background | `--signal-mesh-gradient` |
| `components/animation/particle-field.tsx` | NEW | WebGL points scene via useSignalScene | `lib/signal-canvas.tsx`, `hooks/use-signal-scene.ts` |
| `components/animation/circuit-overlay.tsx` | NEW | CSS SVG background texture | `--signal-circuit-opacity` |
| `components/animation/glitch-transition.tsx` | NEW | GSAP clip-path imperative trigger | `global-effects.tsx` idle Phase 4 |
| `components/animation/cd-symbol-system.tsx` | NEW | CSS/SVG decorative glyphs | `global-effects.tsx` idle Phase 3 |

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Each New Effect Reading `--signal-intensity` Directly

**What goes wrong:** Grain at 0.12, halftone at 30%, and chromatic aberration at 5px all activate simultaneously at intensity 1.0. The moiré between grain and halftone appears. Aberration enters "visually broken" territory. The compound effect exceeds the engineered-imperfection register.

**Instead:** Each effect reads its own derived custom property (`--signal-grain-opacity`, `--signal-halftone-opacity`, etc.) computed by `updateSignalDerivedProps()`. The mapping function encodes perceptual curves and inter-effect exclusions.

---

### Anti-Pattern 2: Adding a Second WebGL Renderer for the Particle Field

**What goes wrong:** iOS Safari enforces a WebGL context limit. Two concurrent WebGLRenderer instances on one page is a known GPU context pressure point. The singleton was designed specifically to prevent this.

**Instead:** `particle-field.tsx` uses `useSignalScene()` exactly as GLSLHero and SignalMesh do. It registers as a scene entry in the existing singleton. One renderer, N scenes via scissor/viewport split.

---

### Anti-Pattern 3: Idle Escalation Phase 2 Tweening to a Hardcoded Grain Value

**What goes wrong:** The current idle Phase 2 tween targets `--sf-grain-opacity: 0.08`. After the aesthetic push raises the baseline to 0.08 (at default intensity 0.5), this tween reduces grain rather than intensifying it. The idle escalation runs in the wrong direction.

**Instead:** The Phase 2 tween target is `currentValue + 0.04`, where `currentValue` is `parseFloat(getComputedStyle(root).getPropertyValue("--signal-grain-opacity"))`. The escalation always produces an increase regardless of the current baseline.

---

### Anti-Pattern 4: CSS `filter` Wrapper on Individual New Effects

**What goes wrong:** Wrapping a new overlay in `filter: blur() brightness()` creates an isolated compositing context. Children of that element cannot `mix-blend-mode` against content below the wrapper — blend modes are isolated within the compositing group.

**Instead:** New effects that need `mix-blend-mode` (grain uses `multiply`, glitch uses `difference`) must not be inside a parent with `filter`. The VHS overlay's outer `filter: blur(0.8px) brightness(1.08) contrast(1.04)` already creates one such isolated group — this is intentional and accepted. New effects that must blend against page content belong outside the VHS overlay container. New effects that only need to blend within the VHS stack belong inside it.

---

### Anti-Pattern 5: Halftone via Full-Page `feTurbulence` Filter

**What goes wrong:** An SVG filter with `feTurbulence` applied as a CSS `filter` property at full-page dimensions is CPU-composited in most browsers. At viewport resolution, this produces visible scroll jank on non-M1 hardware. The analyst correctly flagged this.

**Instead:** Implement halftone as a CSS `background-image: url("data:image/svg+xml,...")` with a small repeating tile (same pattern as grain). The SVG tile is rasterized once and tiled at compositor level — GPU-accelerated. The tile size (6–10px dot period) is small enough that the SVG is trivially small.

---

### Anti-Pattern 6: Particle Field Active at Full Viewport with No Intersection Gate

**What goes wrong:** If the particle field container element is full-screen and always in the viewport, `IntersectionObserver` never sets it invisible. The WebGL scene renders every GSAP ticker frame indefinitely, adding constant GPU load.

**Instead:** Place the particle field container on a specific page section, not as a fixed full-screen overlay. When that section scrolls out of view, IntersectionObserver gates the render loop off. If a full-screen ambient effect is truly needed, implement it as the CSS mesh gradient instead.

---

## Stacking Coherence at Intensity 1.0 — Expected Output

With the perceptual curve architecture in place, intensity 1.0 should produce:

| Effect | Value at 1.0 | Visual result |
|--------|-------------|---------------|
| Grain | 0.10 (capped) | Heavy film texture, sub-threshold for noise interference |
| VHS CRT lines | 0.22 | Strong horizontal lines, clearly legible |
| VHS noise | 0.025 | Visible analog texture |
| Halftone | 0.12 (max) | Atmospheric dot pattern, not foreground |
| Circuit | 0 (off above 0.6) | Invisible — grain has precedence |
| Aberration | 3px (clamped) | Atmospheric, at the aesthetic limit |
| Mesh gradient | 1.0 (linear) | Full color field behind content |
| Particles | 5000 (stepped) | Dense, atmospheric — not mud |

At 1.0, grain and halftone do not produce moiré because halftone's tile size (6px dots) and grain's baseFrequency (0.65) are at different spatial frequencies. The circuit is explicitly off. The glitch aberration is clamped at 3px. The compound effect reads as "maximum signal" rather than "broken display."

---

## Sources

- Direct codebase audit (all findings verified):
  - `app/globals.css:163-165` — hardcoded VHS opacity tokens
  - `lib/tokens.css:145-153` — `--sf-vhs-crt-opacity: 0.2`, `--sf-vhs-noise-opacity: 0.015`
  - `components/animation/vhs-overlay.tsx` — full 7-layer structure, GSAP timing
  - `components/layout/global-effects.tsx` — idle system, `IDLE_TIMEOUT = 8000`
  - `components/animation/signal-overlay.tsx` — `handleIntensity()` writes only base var
  - `lib/signal-canvas.tsx` — singleton architecture, `getState()`, scissor/viewport pattern
  - `hooks/use-signal-scene.ts` — `IntersectionObserver` gating, scene registration API
  - `lib/color-resolve.ts` — `resolveColorToken()` — 1x1 canvas probe pattern
  - `.planning/v1.7-prep/aesthetic-prototypes.md` — per-effect feasibility, existing VHS layer audit
  - `.planning/ANL-analyst-brief-v2.md` — critical findings on intensity boundary behavior, stacking coherence, idle escalation direction, performance headroom
