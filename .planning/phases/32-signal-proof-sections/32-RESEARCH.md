# Phase 32: SIGNAL + PROOF Sections — Research

**Researched:** 2026-04-08
**Domain:** WebGL singleton + ScrollTrigger + CSS custom property bridging + gyroscope input
**Confidence:** HIGH (all critical claims verified against live codebase)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **PROOF FRAME-at-zero:** A + B + C simultaneously — NOT alternatives, NOT states:
  - A — Geometric lattice shader branch: `u_signal_intensity < 0.3` → structured geometry (squares, right angles). `> 0.7` → noise. Smooth blend between.
  - B — Component skeleton layer: SF components in stroke-only FRAME state, `opacity 1→0` as intensity rises, absolutely positioned behind shader
  - C — FRAME-pole left column: JetBrains Mono codes, system specs, architecture readout at intensity:0 side

- **`--signal-intensity` scope:** Set on `sectionRef` element (NOT `documentElement`) — prevents bleed into ENTRY/SIGNAL shaders

- **Lerp via rAF:** NOT CSS `transition`. Raw pointermove is jittery; rAF lerp loop required.

- **Restore on leave:** `pointerleave` and ScrollTrigger `onLeave`/`onLeaveBack` → restore `--signal-intensity` to `1.0`, deactivate listener

- **PROOF ScrollTrigger:** No pin, no scrub. Only `onEnter`/`onLeave`/`onEnterBack`/`onLeaveBack` callbacks to activate/deactivate pointer listener

- **Mobile input:** Gyroscope (`DeviceOrientationEvent.gamma`, range -90 to +90 → map to 0..1) is peer surface, not fallback. `pointermove` Pointer Events API (not `touchmove`) for touch. iOS 13+ `requestPermission()` triggered on first `touchstart` on the PROOF section.

- **PROOF reduced-motion:** Static split view — both layers visible side-by-side. Two-pole layout always visible.

- **SIGNAL ScrollTrigger:** `scrub: 2`, `start: 'top bottom'`, `end: 'bottom top'`, `onUpdate` drives `translateY(${-progress * 40}px)` on the canvas. `onEnter` sets `--signal-intensity` to `1.0`. Log `trigger.start`/`trigger.end` on creation to confirm non-zero range.

- **SIGNAL section height:** 150vh (via `min-height: 150vh` or `height: 150vh` on the SFSection, replacing the current stub)

- **SIGNAL reduced-motion:** Static frame of generative output, no parallax

- **WebGL:** No new npm packages. SignalCanvas singleton handles all concurrent context management via scissor/viewport. SIGNAL adds a 3rd WebGL scene to the singleton.

- **Phase build order:** PROOF plans first, then SIGNAL plans

- **Component skeletons (Approach B):** Same 12 components that will appear in Phase 33 INVENTORY (visual coherence span). Stroke-only, no fill, monochrome.

- **FRAME-pole content (Approach C):** `SF//BTN-001`, `SF//CRD-001`, etc. coded preview. Stats: component count 51, bundle size 100KB, Lighthouse 100/100.

- **Data points in PROOF:** Inside the FRAME-pole column (Approach C content), not a separate band.

### Claude's Discretion

None identified — all Phase 32 decisions are locked from cdBrain wiki.

### Deferred Items (OUT OF SCOPE)

- Char-level SplitText animation (dropped Phase 31, can return Phase 34+ only with pre-split-before-hydration)
- Phase 33 INVENTORY section
- Phase 33 ACQUISITION section
- Gyroscope haptic feedback (Vibration API pressure layer)
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SG-01 | Full-viewport generative WebGL scene at maximum SIGNAL intensity | GLSLHero + useSignalScene already handle this; SIGNAL section is GLSLHero reuse at `uIntensity: 1.0` |
| SG-02 | 150vh scroll distance with slow parallax (atmospheric breathing) | ScrollTrigger `scrub:2` on `translateY` — locked pattern in CONTEXT.md |
| SG-03 | Minimal/no text — pure visual/generative experience | Single optional monospaced data point only |
| SG-04 | SIGNAL parameters animated by scroll position | `onUpdate` drives parallax offset; `onEnter` sets `--signal-intensity: 1.0` |
| SG-05 | prefers-reduced-motion: static frame, no animation | HeroStaticFallback pattern already in GLSLHero — replicate |
| PR-01 | Full-viewport interactive SIGNAL/FRAME layer separation | 100vh ProofSection component with A+B+C concurrent layers |
| PR-02 | Mouse/pointer controls SIGNAL layer intensity in real-time | rAF lerp on `--signal-intensity` CSS var, section-scoped pointermove |
| PR-03 | Visual separation of SIGNAL and FRAME layers | A (shader branch) + B (skeleton opacity) + C (FRAME-pole column) simultaneously |
| PR-04 | Stats integrated as data points within the interactive section | Approach C FRAME-pole column content |
| PR-05 | Touch support — tap and drag produces same SIGNAL/FRAME effect | Pointer Events API (pointermove fires on touch too), gyroscope for mobile |
| PR-06 | prefers-reduced-motion: static split view showing both layers | Static two-pole layout, no animation, no interaction |
</phase_requirements>

---

## Summary

Phase 32 delivers two full-viewport homepage sections in build order: PROOF first (higher complexity, structural A+B+C decision), then SIGNAL (lower risk, reuses existing GLSLHero infrastructure). Both sections are already stubbed in `app/page.tsx` as `min-h-screen` `SFSection` wrappers — Phase 32 replaces the stub content with real implementations.

The critical technical domain is the bridge between CSS custom properties and WebGL uniforms. The existing `GLSLHero` component reads `--signal-intensity` from a module-level cache updated by a `MutationObserver` on `document.documentElement.style`. PROOF sets `--signal-intensity` on the section element (not `documentElement`), which means the existing MutationObserver in `GLSLHero` will NOT pick it up — this is the central architectural challenge. The PROOF shader must have its own uniform bridge that reads from the section element's computed style directly.

The SignalCanvas singleton already handles three concurrent WebGL contexts via scissor/viewport rendering. SIGNAL adding a third scene (alongside ENTRY and SIGNAL simultaneously during scroll overlap) is architecturally safe — `useSignalScene`'s `IntersectionObserver` gates each scene to render only when in-viewport.

**Primary recommendation:** Build `ProofSection` as a `'use client'` block component with its own rAF loop for intensity lerping, its own shader (fork of GLSLHero with geometric lattice branch), and explicit section-scoped `--signal-intensity` that does NOT touch the singleton MutationObserver. Build `SignalSection` as a thin wrapper over a new `GLSLSignal` component (GLSLHero clone with `uIntensity: 1.0` locked, parallax translateY wired to ScrollTrigger).

---

## Standard Stack

### Core (all already in project — zero new installs)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Three.js | `^0.183.2` | WebGL scene for SIGNAL parallax + PROOF shader branch | Singleton infrastructure already built |
| GSAP + ScrollTrigger | `^3.12.7` | SIGNAL parallax scrub, PROOF enter/leave lifecycle | Only animation library allowed |
| `@gsap/react` useGSAP | `^2.1.2` | GSAP effects scoped to React component lifecycle | Same pattern as GLSLHero |
| React | `^19.1.0` | Component framework | N/A |
| Next.js | `^15.3.0` | App Router, 'use client' boundary | N/A |

[VERIFIED: package.json `dependencies`]

### No New Packages
Phase 32 uses zero new npm packages. All motion via GSAP ScrollTrigger + Lenis. WebGL via Three.js. This is a hard constraint from CLAUDE.md and STATE.md.

[VERIFIED: STATE.md "Zero new npm packages"]

---

## Architecture Patterns

### Recommended File Structure

```
components/blocks/
├── proof-section.tsx        # NEW: 'use client', A+B+C layers, rAF lerp, gyroscope
├── signal-section.tsx       # NEW: 'use client', GLSLSignal wrapper + parallax ST
└── entry-section.tsx        # EXISTING (reference)

components/animation/
├── glsl-signal.tsx          # NEW: GLSLHero fork — uIntensity locked to 1.0, u_signal_intensity bridged from parent
├── proof-shader.tsx         # NEW: GLSLHero fork — geometric lattice branch, reads section-scoped --signal-intensity
├── component-skeleton.tsx   # NEW: stroke-only SF component skeleton (Approach B)
├── glsl-hero.tsx            # EXISTING (reference — do not modify)
└── pinned-section.tsx       # EXISTING (reference — no pin on PROOF)
```

### Pattern 1: Section-Scoped CSS Custom Property Bridge

The existing `GLSLHero` reads `--signal-intensity` from `document.documentElement` via a module-level MutationObserver. PROOF sets `--signal-intensity` on the PROOF section element only. These are two different CSS custom property scopes — child elements inherit from the nearest ancestor that sets the property, but `getComputedStyle(documentElement)` will NOT see the section-element-scoped value.

**The bridge pattern for PROOF shader:**
```typescript
// Source: verified from glsl-hero.tsx INT-04 pattern + CSS custom property inheritance spec
// In proof-shader.tsx — reads from sectionRef, NOT documentElement

let _proofIntensity = 0.5;
let _proofObserver: MutationObserver | null = null;

function ensureProofObserver(sectionEl: HTMLElement): void {
  if (_proofObserver) return;
  const read = () => {
    const v = parseFloat(getComputedStyle(sectionEl).getPropertyValue('--signal-intensity'));
    _proofIntensity = isNaN(v) ? 0.5 : v;
  };
  read();
  _proofObserver = new MutationObserver(read);
  _proofObserver.observe(sectionEl, { attributeFilter: ['style'] });
}
```

**Why section-scoped:** Setting on `documentElement` would cause `--signal-intensity` to bleed into the ENTRY and SIGNAL shaders, which both read from `documentElement` via the existing singleton observer. PROOF must be isolated.

[VERIFIED: glsl-hero.tsx lines 46-68 (MutationObserver pattern); CSS spec — custom property inheritance is scoped to element tree]

### Pattern 2: rAF Lerp Loop for Intensity (PROOF)

Raw `pointermove` is jittery at high frequency. rAF lerp smooths it. This is the locked pattern from CONTEXT.md.

```typescript
// Source: CONTEXT.md locked decision + general rAF lerp pattern
let _targetIntensity = 0.5;
let _currentIntensity = 0.5;
let _rafId: number | null = null;
const LERP_FACTOR = 0.08; // ~8 frames to settle — smooth but responsive

function startLerpLoop(sectionEl: HTMLElement): void {
  if (_rafId !== null) return; // already running

  const tick = () => {
    _currentIntensity += (_targetIntensity - _currentIntensity) * LERP_FACTOR;
    sectionEl.style.setProperty('--signal-intensity', _currentIntensity.toFixed(4));
    _rafId = requestAnimationFrame(tick);
  };
  _rafId = requestAnimationFrame(tick);
}

function stopLerpLoop(): void {
  if (_rafId !== null) {
    cancelAnimationFrame(_rafId);
    _rafId = null;
  }
}
```

**Restore on leave:** `_targetIntensity = 1.0` (not instant set — lerps back gracefully).

[VERIFIED: CONTEXT.md "Lerp via rAF" locked decision]

### Pattern 3: ScrollTrigger Lifecycle Callbacks (PROOF — no pin, no scrub)

```typescript
// Source: CONTEXT.md locked decision; GLSLHero ScrollTrigger pattern (glsl-hero.tsx:316-327)
// No pin, no scrub — pure lifecycle callbacks
ScrollTrigger.create({
  trigger: sectionRef.current,
  start: 'top bottom',
  end: 'bottom top',
  onEnter: () => {
    activatePointerListener();
    startLerpLoop(sectionRef.current!);
  },
  onLeave: () => {
    deactivatePointerListener();
    stopLerpLoop();
    sectionRef.current?.style.setProperty('--signal-intensity', '1.0');
  },
  onEnterBack: () => {
    activatePointerListener();
    startLerpLoop(sectionRef.current!);
  },
  onLeaveBack: () => {
    deactivatePointerListener();
    stopLerpLoop();
    sectionRef.current?.style.setProperty('--signal-intensity', '1.0');
  },
});
```

[VERIFIED: CONTEXT.md; GLSLHero ScrollTrigger pattern verified at glsl-hero.tsx:316-327]

### Pattern 4: SIGNAL Parallax ScrollTrigger

```typescript
// Source: CONTEXT.md locked pattern
// Log trigger.start/end — required by compile-back zero-range trap mitigation
const trigger = ScrollTrigger.create({
  trigger: sectionRef.current,
  start: 'top bottom',
  end: 'bottom top',
  scrub: 2,
  onEnter: () => {
    document.documentElement.style.setProperty('--signal-intensity', '1.0');
  },
  onUpdate: (self) => {
    const parallaxOffset = self.progress * 40;
    if (canvasWrapRef.current) {
      canvasWrapRef.current.style.transform = `translateY(${-parallaxOffset}px)`;
    }
  },
});
console.debug('[SIGNAL ST]', 'start:', trigger.start, 'end:', trigger.end);
// Assert trigger.start !== trigger.end — if equal, zero-range trap is active
```

[VERIFIED: CONTEXT.md locked pattern; compile-back.md Bug 1 mitigation]

### Pattern 5: SignalCanvas Singleton — Third Scene

The `useSignalScene` hook assigns a UUID per mount, registers with the singleton, and attaches an `IntersectionObserver` that gates visibility. The singleton `renderAllScenes` iterates all entries, skips `visible: false`. Three concurrent scenes (ENTRY + SIGNAL + PROOF shader) are handled automatically.

**Critical:** Do NOT create a second `WebGLRenderer`. The singleton lives in `globalThis.__sf_signal_canvas.renderer`. Any component using `useSignalScene` shares this renderer.

[VERIFIED: signal-canvas.tsx lines 60-83, 156-170; use-signal-scene.ts lines 40-78]

### Pattern 6: iOS DeviceOrientation Permission Gate

```typescript
// Source: [CITED: https://developer.apple.com/documentation/webkitjs/deviceorientationevent/requestpermission]
// iOS 13+ requires user gesture. Trigger on first touchstart on the PROOF section.
// LOCKED: CONTEXT.md "trigger on first touchstart on the PROOF section"

async function requestGyroPermission(): Promise<boolean> {
  if (typeof DeviceOrientationEvent === 'undefined') return false;
  // iOS 13+ has requestPermission; older iOS and Android do not
  if (typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function') {
    const permission = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
    return permission === 'granted';
  }
  // Android / non-iOS: no permission required, events fire immediately
  return true;
}

// Attach on first touchstart — this IS the user gesture iOS requires
let gyroPermissionRequested = false;
const onFirstTouch = async () => {
  if (gyroPermissionRequested) return;
  gyroPermissionRequested = true;
  const granted = await requestGyroPermission();
  if (granted) attachGyroListener();
  // No instruction overlay regardless of outcome — CONTEXT.md constraint
};
sectionEl.addEventListener('touchstart', onFirstTouch, { once: true, passive: true });
```

**Gamma mapping:** `(gamma + 90) / 180` maps -90..+90 to 0..1. Set as `_targetIntensity` (same lerp loop as pointer).

[CITED: https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent/requestPermission — iOS 13+ requirement verified]
[VERIFIED: CONTEXT.md "DeviceOrientationEvent.gamma (range: -90 to +90). Map: (gamma + 90) / 180"]

### Pattern 7: Geometric Lattice Shader Branch (Approach A)

The PROOF shader is a fork of `glsl-hero.tsx`'s FRAGMENT_SHADER with an additional `u_signal_intensity` uniform and a conditional geometry mode:

```glsl
// At low intensity → structured geometry. At high intensity → FBM noise.
// Smooth crossfade between. Verified pattern — extends existing GLSLHero GLSL.
uniform float u_signal_intensity;

// Geometric lattice: regular grid + right angles
float latticeX = step(fract(uv.x * 8.0), 0.04);
float latticeY = step(fract(uv.y * 8.0), 0.04);
float lattice = clamp(latticeX + latticeY, 0.0, 1.0);

// FBM noise (same as GLSLHero)
float n = fbm(uv * 4.0 + vec2(uTime * 0.1, uTime * 0.07));

// Blend: intensity 0 = lattice, intensity 1 = noise
// Breakpoints from CONTEXT.md: <0.3 = lattice, >0.7 = noise
float blend = smoothstep(0.3, 0.7, u_signal_intensity);
float signal = mix(lattice * 0.8, n * 0.6, blend);
```

[VERIFIED: CONTEXT.md Approach A spec; GLSLHero FRAGMENT_SHADER lines 85-198 as base template]

### Component Skeleton Pattern (Approach B)

Approach B skeletons are absolutely-positioned div layers rendered BEHIND the shader canvas in the PROOF section. They use CSS `opacity` driven by the CSS custom property (via CSS `calc()` or JS lerp read-back):

```css
/* opacity is 1 at intensity:0, 0 at intensity:1 */
/* Use JS — CSS custom property as number doesn't directly drive opacity without Houdini */
/* Set opacity on the skeleton layer from the same rAF loop that sets --signal-intensity */
```

**Implementation note:** CSS `opacity` cannot directly consume a `--signal-intensity` float without CSS Houdini `@property` registration (not available in all targets). Use the JS rAF loop to also update `.skeletonLayerEl.style.opacity = (1 - _currentIntensity).toFixed(4)`.

[VERIFIED: CSS spec — custom properties are strings, opacity requires a number. Direct consumption requires @property or JS bridge]

### Anti-Patterns to Avoid

- **`window.scrollTo` from any PROOF/SIGNAL code** — must use `lenis.scrollTo`. STATE.md "lenis.scrollTo only" rule.
- **`getComputedStyle` inside rAF/ticker** — INT-04 rule: never read DOM inside animation loops. Use the MutationObserver cache pattern.
- **`display: none` on reduced-motion fallback** — use `visibility: hidden` + `opacity: 0` to preserve a11y tree (established Phase 30 decision).
- **`overflow: hidden` on PinnedSection parent** — breaks GSAP pin geometry. Already caught in PinnedSection.tsx comments. SIGNAL does NOT use PinnedSection (150vh height + ScrollTrigger parallax only, no pin).
- **Second `WebGLRenderer` instantiation** — the singleton guard in `initSignalCanvas` silently no-ops on second call. But creating a second renderer outside the singleton wastes a WebGL context slot (Safari iOS allows only 2-8).
- **`transition: --signal-intensity`** — CSS transitions on custom properties require `@property` registration and are not supported everywhere. rAF lerp is the locked approach.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| WebGL context management | Multiple renderers | SignalCanvas singleton (`useSignalScene`) | Already handles scissor/viewport, IntersectionObserver gating, GPU disposal |
| Scroll-to-progress mapping | Manual scroll listener | GSAP ScrollTrigger `onUpdate(self.progress)` | Handles Lenis scroll proxy automatically |
| Smooth intensity lerp | CSS `transition` | rAF lerp loop (locked pattern) | CSS transition on custom props requires `@property`; rAF is jitter-free |
| iOS permission UX | Custom permission modal | `touchstart` gate with `requestPermission()` then silent attach | No instruction overlay constraint — silence IS the UX |
| Reduced-motion detection | Manual `window.matchMedia` calls | React `useState` + `matchMedia` check on mount (same as GLSLHero `checkWebGL` pattern) | Consistent with existing reduced-motion pattern across all components |

---

## Common Pitfalls

### Pitfall 1: Zero-Range ScrollTrigger Trap (SIGNAL section)

**What goes wrong:** ScrollTrigger `scrub` does nothing. `trigger.start === trigger.end`. No error.

**Why it happens:** ScrollTrigger created before element has final layout height. The SIGNAL section starts as a `min-h-screen` stub — when replaced with a `150vh` element, layout must be stable before ScrollTrigger measurement. Fonts, Lenis init, and GSAP `ScrollTrigger.refresh()` must all have fired.

**How to avoid:** Always log `trigger.start` and `trigger.end` on creation (enforced in CONTEXT.md). If equal: force `ScrollTrigger.refresh()` after Lenis confirms layout. Create all ScrollTriggers inside `useGSAP` with `{ scope: containerRef }` and `invalidateOnRefresh: true`.

**Warning signs:** Parallax canvas doesn't move. `trigger.start` equals `trigger.end` in console.

[VERIFIED: compile-back.md Bug 1 "Zero-Range Scrub Trap"]

### Pitfall 2: CSS Custom Property Scope Bleed

**What goes wrong:** PROOF section's mouse movement changes `--signal-intensity` on ENTRY or SIGNAL shaders.

**Why it happens:** Setting `--signal-intensity` on `document.documentElement` (global scope) instead of `sectionRef.current` (local scope). The existing GLSLHero MutationObserver watches `documentElement.style`, so a global set bleeds into ENTRY immediately.

**How to avoid:** ALWAYS call `sectionRef.style.setProperty('--signal-intensity', value)` — never `document.documentElement.style.setProperty`. The PROOF shader's own MutationObserver watches `sectionRef`, not `documentElement`.

[VERIFIED: CONTEXT.md "NOT documentElement — scope to section to avoid bleeding"; glsl-hero.tsx line 63 `_signalObserver.observe(document.documentElement)`]

### Pitfall 3: MutationObserver Leak on PROOF Unmount

**What goes wrong:** PROOF's section-element MutationObserver is never disconnected. Accumulation causes increasing DOM observation overhead (especially during route changes).

**Why it happens:** Module-level observer pattern from GLSLHero is reused without adapting the cleanup path. GLSLHero's observer is disconnected in the GSAP context cleanup (line 345 `_signalObserver.disconnect()`). PROOF must do the same.

**How to avoid:** In `useEffect` cleanup (or `useGSAP` return), call `_proofObserver.disconnect(); _proofObserver = null`. Also `stopLerpLoop()` in the same cleanup.

[VERIFIED: compile-back.md; STATE.md "MutationObserver disconnect FIRST" v1.4 accumulated context]

### Pitfall 4: Tween Property Collision (Approach B Opacity)

**What goes wrong:** Two separate mechanisms writing to the same DOM element's `opacity`. GSAP kills one silently.

**Why it happens:** If a GSAP tween is also assigned to Approach B skeleton opacity (e.g., for the reduced-motion entrance), it will collide with the JS rAF that also sets `opacity` on the same element.

**How to avoid:** The skeleton opacity is driven ONLY by the rAF lerp loop. No GSAP tweens targeting `opacity` on Approach B skeleton elements. Use GSAP only for non-opacity properties (e.g., `yPercent` on phrase reveals if needed).

[VERIFIED: compile-back.md Bug 3 "Tween Property Collision"]

### Pitfall 5: SplitText — Do Not Use in Phase 32

**What goes wrong:** SplitText under Lenis causes reflow thrash, jump artifacts, and wrong character counts.

**Why it happens:** SplitText DOM insertion happens after Lenis measures scroll height. See compile-back.md Plan Deviation AC-11.

**How to avoid:** Phase 32 has no text animation that requires SplitText. The FRAME-pole column (Approach C) uses static monospaced text. If any text animation is needed, use whole-span `opacity + yPercent` only (Phase 31 established pattern).

[VERIFIED: compile-back.md "Plan Deviation: AC-11 — Char-Level vs. Span-Level Animation"]

### Pitfall 6: DeviceOrientationEvent Gamma Discontinuity at ±90

**What goes wrong:** Gamma jumps discontinuously from +90 to -90 (or vice versa) when phone is held near vertical. This creates a sudden snap from intensity:1 to intensity:0.

**Why it happens:** `DeviceOrientationEvent.gamma` has range -90..+90 with a discontinuity at ±90 (alpha wraps there). Phones held near-vertical frequently cross this threshold.

**How to avoid:** Clamp gamma to a usable sub-range, e.g., -60..+60, then map: `clamp((gamma + 60) / 120, 0, 1)`. This loses the extreme tilt positions but eliminates the snap. Alternatively: detect and ignore deltas > 30 degrees in a single event.

[CITED: https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent/gamma]

### Pitfall 7: PROOF Section Height Must Be Exactly 100vh

**What goes wrong:** ProofSection height inflation (e.g., `min-h-screen` with padding) causes the ScrollTrigger `onEnter`/`onLeave` callbacks to fire at unexpected scroll positions.

**Why it happens:** The stub uses `min-h-screen flex items-center justify-center` with `py-0`. The A+B+C layer implementation needs `height: 100vh; position: relative; overflow: hidden` — absolute positioning of layers requires a positioned parent. `min-h-screen` plus child content can expand the box.

**How to avoid:** Set explicit `style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}` on the PROOF section root. Remove `flex items-center` from the SFSection className once content replaces the stub.

### Pitfall 8: Lenis + Fixed-position Canvas in SIGNAL

**What goes wrong:** The SignalCanvas is `position: fixed; inset: 0` at `z-index: -1`. The SIGNAL section registers a scene that moves via `translateY` on a canvas wrapper. But the fixed canvas is always at viewport coordinates — the `translateY` approach in the locked pattern applies to a SEPARATE canvas wrapper div, NOT the singleton fixed canvas.

**Why it happens:** The parallax in the CONTEXT.md pattern (`shaderRef.current.style.transform = translateY(...)`) targets a canvas/div wrapper WITHIN the SIGNAL section, not the singleton canvas. The singleton canvas is fixed and covers all scenes via scissor.

**How to avoid:** The SIGNAL section has its own scene registered via `useSignalScene`. The parallax offset is achieved by adjusting the scene's VIEWPORT/SCISSOR coordinates — OR by shifting the section's child div (which contains the scene's bounding rect that the singleton uses). The simplest approach: move the section's container div (the one passed to `useSignalScene`) with `translateY`, which shifts the rect returned by `getBoundingClientRect()`, which shifts the scissor/viewport in the next render frame.

[VERIFIED: signal-canvas.tsx lines 71-82 — scissor/viewport derived from `entry.element.getBoundingClientRect()`]

---

## Code Examples

### Existing Uniform Bridge Pattern (GLSLHero — reference)
```typescript
// Source: components/animation/glsl-hero.tsx lines 46-68
// Module-level cache + MutationObserver on documentElement
let _signalIntensity = 0.5;
let _signalObserver: MutationObserver | null = null;

function readSignalVars(): void {
  const style = getComputedStyle(document.documentElement);
  _signalIntensity = parseFloat(style.getPropertyValue('--signal-intensity')) || 0.5;
}

function ensureSignalObserver(): void {
  if (_signalObserver || typeof window === 'undefined') return;
  readSignalVars();
  _signalObserver = new MutationObserver(readSignalVars);
  _signalObserver.observe(document.documentElement, { attributeFilter: ['style'] });
}
```

### useSignalScene Registration (reference)
```typescript
// Source: hooks/use-signal-scene.ts lines 40-78
// Register a buildScene factory — singleton handles everything else
useSignalScene(containerRef as React.RefObject<HTMLElement | null>, buildScene);
```

### SignalCanvas Scissor Rendering (key insight)
```typescript
// Source: lib/signal-canvas.tsx lines 60-82
// Parallax works by moving the REGISTERED ELEMENT — its getBoundingClientRect()
// drives the scissor/viewport each frame automatically.
const rect = entry.element.getBoundingClientRect();
renderer.setScissor(rect.left, canvasY, rect.width, rect.height);
renderer.setViewport(rect.left, canvasY, rect.width, rect.height);
```

### Container-Scoped Pointer Interaction (Phase 30 template)
```typescript
// Source: components/animation/glsl-hero.tsx lines 355-376
// Template for PROOF's section-scoped pointermove
const handlePointerMove = (e: PointerEvent) => {
  const x = e.clientX / window.innerWidth; // PROOF uses window width, not container
  _targetIntensity = x; // feed into rAF lerp
};
container.addEventListener('pointermove', handlePointerMove, { passive: true });
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `touchmove` for mobile touch | Pointer Events API (`pointermove`) | Phase 30 established | Unified desktop+mobile handler, no separate touchmove needed |
| Multiple WebGL renderers | SignalCanvas singleton (scissor) | v1.1 | No WebGL context limit issues on Safari iOS |
| `ignoreMobileResize: true` (Lenis) | `autoResize: false` | Phase 29 (Lenis 1.3.x dropped the old prop) | STATE.md confirmed |
| GSAP `timeScale(0)` pause | rAF + GSAP ticker | v1.1 | R3F excluded because its independent rAF conflicts |

---

## Open Questions

1. **PROOF shader: separate component or inline in ProofSection?**
   - What we know: GLSLHero is a standalone component; ProofSection is complex (A+B+C)
   - What's unclear: Whether the shader logic should live in `proof-shader.tsx` or inline in `proof-section.tsx`
   - Recommendation: Separate `ProofShader` component — mirrors GLSLHero pattern, keeps ProofSection readable, allows the planner to assign separate tasks

2. **Approach B: 12 component skeletons — which 12?**
   - What we know: "Same 12 components that will appear in Phase 33 INVENTORY" (CONTEXT.md)
   - What's unclear: The Phase 33 INVENTORY 12-item subset selection is a Phase 33 blocker (STATE.md). Approach B in Phase 32 needs this list.
   - Recommendation: Plan should include a Wave 0 task to lock the 12-component subset before implementing Approach B. Use a simple constant in `lib/proof-components.ts` that Phase 33 can reference.

3. **SIGNAL section: does `--signal-intensity: 1.0` set on `onEnter` override PROOF's section-scoped value?**
   - What we know: SIGNAL sets on `documentElement`; PROOF sets on sectionRef. CSS cascade: the more specific (section element) wins over documentElement.
   - What's unclear: After PROOF exits and SIGNAL enters, is there a residual section-scoped `--signal-intensity` on the PROOF element that could interfere?
   - Recommendation: `onLeave` and `onLeaveBack` on PROOF's ScrollTrigger should explicitly restore PROOF's section element to `--signal-intensity: 1.0` (which equals the SIGNAL global anyway). This is already in the locked pattern.

4. **`position: absolute` on canvas vs. using the registered element directly (SIGNAL parallax)**
   - What we know: The CONTEXT.md pattern says `position: absolute` on the canvas. The SignalCanvas is fixed and uses `getBoundingClientRect()` of the registered element.
   - Recommendation: SIGNAL section's `useSignalScene` registers a `containerRef` div with `position: absolute; inset: 0` inside the 150vh section. Parallax is achieved by setting `translateY` on this div — the scissor follows automatically. No need to touch the singleton canvas.

---

## Environment Availability

Step 2.6: All dependencies are already installed (verified via package.json). No external services, CLIs, or databases required. Playwright and dev server already confirmed working from Phase 31.

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Three.js | SIGNAL + PROOF WebGL | ✓ | 0.183.2 | — |
| GSAP ScrollTrigger | SIGNAL parallax, PROOF enter/leave | ✓ | 3.12.7 | — |
| Playwright | Phase 32 spec tests | ✓ | (existing) | — |
| Node.js | Build tooling | ✓ | v20.20.0 | — |

[VERIFIED: package.json, node --version]

---

## Validation Architecture

Nyquist validation is enabled (config.json has no `nyquist_validation: false` key).

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright (existing, chromium only) |
| Config file | `playwright.config.ts` |
| Quick run command | `pnpm exec playwright test tests/phase-32-signal-proof.spec.ts` |
| Full suite command | `pnpm exec playwright test` |
| Base URL | `http://localhost:3000` (dev server must be running) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | Notes |
|--------|----------|-----------|-------------------|-------|
| SG-01 | SIGNAL section has a canvas element (WebGL active) | Playwright browser | `playwright test phase-32 --grep "SG-01"` | Check `data-section="signal"` contains canvas or registered scene |
| SG-02 | SIGNAL section occupies 150vh scroll distance | Playwright browser | `playwright test phase-32 --grep "SG-02"` | `boundingBox().height / viewportHeight >= 1.5` on `#signal` |
| SG-03 | SIGNAL has no text content beyond one optional data point | Playwright browser (source-level) | `playwright test phase-32 --grep "SG-03"` | Count text nodes in `#signal`; assert ≤1 |
| SG-04 | `--signal-intensity: 1.0` set on enter | Playwright browser | `playwright test phase-32 --grep "SG-04"` | Scroll to SIGNAL, check `documentElement` computed style |
| SG-05 | prefers-reduced-motion: static fallback, no canvas | Playwright browser | `playwright test phase-32 --grep "SG-05"` | Set `reducedMotion: 'reduce'` in Playwright; assert no canvas, static div present |
| PR-01 | PROOF section is full-viewport | Playwright browser | `playwright test phase-32 --grep "PR-01"` | `#proof` `boundingBox().height === viewportHeight` (±5px) |
| PR-02 | `--signal-intensity` on PROOF section element changes on pointer move | Playwright browser | `playwright test phase-32 --grep "PR-02"` | `page.mouse.move()` in PROOF viewport, check `sectionEl.style.getPropertyValue('--signal-intensity')` differs from initial |
| PR-03 | PROOF has three concurrent layer elements (A, B, C) | Playwright source-level | `playwright test phase-32 --grep "PR-03"` | Check `proof-section.tsx` source for all three data-layer attributes |
| PR-04 | Stats appear inside PROOF section | Playwright browser | `playwright test phase-32 --grep "PR-04"` | Assert `#proof` contains text matching component count + Lighthouse score |
| PR-05 | Touch (pointermove from Pointer Events) fires same handler | Manual + source-level | grep `pointermove` in proof-section.tsx, not `touchmove` | Playwright cannot simulate Gyroscope; touch pointermove can be simulated |
| PR-06 | reduced-motion: static split visible | Playwright browser | `playwright test phase-32 --grep "PR-06"` | Set `reducedMotion: 'reduce'`; assert both FRAME-pole and SIGNAL-pole visible; no canvas |

### Detailed Test Patterns (Phase 31 spec as template)

```typescript
// tests/phase-32-signal-proof.spec.ts — Wave 0 file to create

test('SG-02: SIGNAL section is 150vh', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const signal = page.locator('#signal');
  const box = await signal.boundingBox();
  const vh = page.viewportSize()!.height;
  expect(box!.height / vh).toBeGreaterThanOrEqual(1.45); // 150vh with rounding
  expect(box!.height / vh).toBeLessThanOrEqual(1.55);
});

test('PR-01: PROOF section is 100vh', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const proof = page.locator('#proof');
  const box = await proof.boundingBox();
  const vh = page.viewportSize()!.height;
  expect(box!.height).toBeGreaterThanOrEqual(vh - 5);
  expect(box!.height).toBeLessThanOrEqual(vh + 5);
});

test('PR-02: pointermove in PROOF changes --signal-intensity on section element', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  // Scroll to PROOF
  await page.locator('#proof').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300); // allow ScrollTrigger onEnter
  const before = await page.locator('#proof').evaluate(
    el => el.style.getPropertyValue('--signal-intensity')
  );
  await page.mouse.move(200, 450); // left side → low intensity
  await page.waitForTimeout(200);
  const after = await page.locator('#proof').evaluate(
    el => el.style.getPropertyValue('--signal-intensity')
  );
  expect(parseFloat(after)).toBeLessThan(parseFloat(before || '1'));
});

test('SG-05 + PR-06: reduced-motion shows static fallbacks', async ({ browser }) => {
  const ctx = await browser.newContext({
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  await page.goto('/');
  // SIGNAL: no canvas, static div
  const signalCanvas = page.locator('#signal canvas');
  await expect(signalCanvas).toHaveCount(0);
  // PROOF: no canvas animation, both poles visible
  // (source-level: assert proof-section.tsx has reduced-motion branch)
  await ctx.close();
});
```

### Sampling Rate
- **Per task commit:** `pnpm exec playwright test tests/phase-32-signal-proof.spec.ts`
- **Per wave merge:** `pnpm exec playwright test`
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `tests/phase-32-signal-proof.spec.ts` — all SG-01..05 and PR-01..06 tests, following Phase 31 spec pattern

---

## Security Domain

Phase 32 involves no authentication, no user data storage, no network requests, no form input beyond pointer position. ASVS categories do not apply. `DeviceOrientationEvent` permission is a browser API with no data persistence.

Security domain: SKIPPED (no applicable ASVS categories — pure client-side visual interaction with no data storage or transmission).

---

## Project Constraints (from CLAUDE.md)

Directives the planner MUST verify compliance with:

| Directive | Impact on Phase 32 |
|-----------|-------------------|
| Zero `border-radius` | Component skeletons (Approach B) must have `rounded-none` on every element |
| No new npm packages | All animation via GSAP + existing Three.js. No new runtime dependencies. |
| `'use client'` only when needed | `ProofSection` and `SignalSection` will need `'use client'` (WebGL, event listeners). `sf/index.ts` barrel must stay directive-free. |
| `cn()` for class merging | Any className composition in new components uses `cn()` from `lib/utils.ts` |
| Blessed spacing stops only | FRAME-pole column padding/gap: 4/8/12/16/24/32/48/64/96px only. No arbitrary values. |
| SIGNAL/FRAME ordering | All code comments, data attributes, and UI labels: SIGNAL first, never FRAME/SIGNAL |
| Commit before changes | Plan must include a Wave 0 commit checkpoint before any implementation task |
| Section data attributes | PROOF: `data-section="proof"`. SIGNAL: `data-section="signal"`. Already on page.tsx stubs. |
| `data-anim` for animated sections | New sections with scroll animation should carry `data-anim` attribute |
| Typography: JetBrains Mono for FRAME-pole | Approach C monospaced content uses `font-mono` (JetBrains Mono token) |
| No `getComputedStyle` in rAF/ticker | Use MutationObserver cache (INT-04 rule) |
| `lenis.scrollTo` only | No `window.scrollTo` in PROOF/SIGNAL code |
| `rounded-none` on every sub-element | Approach B component skeletons must apply explicitly — Radix-generated `rounded-*` survives the CSS token |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The 12 Approach B component skeletons are "the same 12 as Phase 33 INVENTORY" — but Phase 33's 12-item subset is not yet defined | Architecture Patterns | Approach B might render wrong set; Phase 33 has to match anyway. Low risk: use a constant that Phase 33 imports. |
| A2 | Gyroscope gamma discontinuity at ±90 can be mitigated by clamping to -60..+60 | Common Pitfalls | If users hold phone more extreme than ±60 and the interaction feels broken — adjust clamp range. Medium risk. |
| A3 | Moving the `useSignalScene` registered element with `translateY` causes the singleton's scissor to follow in the next GSAP ticker frame | Code Examples (SIGNAL parallax) | Verified via signal-canvas.tsx getBoundingClientRect() pattern. Extremely low risk — this is how the singleton is designed. |

---

## Sources

### Primary (HIGH confidence)
- `components/animation/glsl-hero.tsx` — uMouse bridge pattern, MutationObserver cache, INT-04 pattern, ScrollTrigger uniform mutation
- `lib/signal-canvas.tsx` — Singleton architecture, scissor/viewport rendering, registerScene API
- `hooks/use-signal-scene.ts` — IntersectionObserver gating, scene registration lifecycle
- `components/animation/pinned-section.tsx` — ScrollTrigger pattern (confirmed PROOF does NOT use PinnedSection)
- `app/page.tsx` — Current stub structure for PROOF and SIGNAL sections
- `.planning/phases/32-signal-proof-sections/32-CONTEXT.md` — All locked decisions
- `.planning/phases/30-homepage-architecture-entry-section/30-02-SUMMARY.md` — Container-scoped pointer interaction template
- `wiki/analyses/v1.5-compile-back.md` — Zero-range trap, SplitText race, tween collision
- `wiki/analyses/v1.5-section-reference-map.md` — Design intent for SIGNAL (Ikeda) and PROOF (Pompidou), mobile references

### Secondary (MEDIUM confidence)
- `.planning/STATE.md` — Accumulated constraints from v1.1-v1.5
- `.planning/REQUIREMENTS.md` — SG-01..05 and PR-01..06 definitions
- `tests/phase-31-thesis.spec.ts` — Playwright pattern to follow for phase-32 spec
- MDN DeviceOrientationEvent.requestPermission documentation (iOS 13+ permission requirement)
- MDN DeviceOrientationEvent.gamma (range spec, discontinuity behavior)

### Tertiary (LOW confidence — training knowledge only)
- None — all critical claims verified against live codebase or official MDN references

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified from package.json
- Architecture: HIGH — verified from live codebase (GLSLHero, SignalCanvas, useSignalScene)
- CSS custom property scope: HIGH — verified from GLSLHero MutationObserver on documentElement vs. section element
- Pitfalls: HIGH — compile-back.md is first-hand Phase 31 lessons
- iOS gyroscope permission: MEDIUM — MDN cited, not tested on device

**Research date:** 2026-04-08
**Valid until:** 2026-05-08 (stack is stable; GSAP/Three/Next.js are not in rapid churn for these APIs)
