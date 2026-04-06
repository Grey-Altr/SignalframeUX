# Phase 9: Extended Scenes + Production Integration - Research

**Researched:** 2026-04-06
**Domain:** GLSL fragment shaders (full-screen quad) · ASCII/ordered dither post-process · SF layout primitive migration · IntersectionObserver stagger animation · SignalMesh relocation
**Confidence:** HIGH (all stack read directly from installed node_modules + codebase; no external library installs required)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**ASCII/Dithering Post-Process Shader (SCN-03):**
- Renders on the hero section — ordered dither CRT aesthetic on the main hero background
- Ordered Bayer 4×4 matrix algorithm — classic CRT/terminal look, GPU-parallel per SCN-03
- Subtle blend (20-30% opacity) with normal rendering — DU/TDR accent, not overwhelming
- Monochrome using `--color-primary` — single-channel CRT aesthetic

**GLSL Hero Shader (SCN-04):**
- Animated noise field with geometric grid lines — DU/TDR album-art procedural background
- Scroll position shifts noise scale + grid density — subtle transformation as user scrolls
- GLSL hero shader REPLACES SignalMesh in hero section — GLSL IS the hero background, SignalMesh moves to /components
- Fragment shader only (no geometry) — full-screen quad, minimal draw calls, maximum performance

**Layout Migration & Stagger (INT-01, INT-02):**
- All section-level div wrappers on ALL 5 pages (homepage, /components, /tokens, /start, /reference) replaced with SFSection, inner layout with SFStack/SFGrid
- `data-anim="stagger"` attribute on component-grid blocks, triggered by IntersectionObserver one-shot on scroll into view
- Preserve visual output during migration — swap container divs for SF primitives without changing visual appearance
- Complete portfolio should consume SF layout primitives — zero raw div layout wrappers at section level

**INT-03: SignalMotion**
- Scroll-driven motion graphics for showcase sections (requirement stated; implementation detail at Claude's discretion)

**INT-04: Live SIGNAL overlay**
- Allows visitors to adjust SIGNAL intensity and parameters interactively

### Claude's Discretion
- Exact GLSL noise function and grid line rendering approach
- Bayer 4×4 dither threshold matrix values and blend mode
- SignalMesh relocation to /components page — exact placement
- Stagger animation timing (delay per item, total duration)
- SF primitive prop usage during migration (spacing, alignment props)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SCN-03 | ASCII/dithering post-process shader using ordered dithering (GPU-parallel) for CRT/terminal DU/TDR aesthetic | Bayer 4×4 matrix in GLSL verified; THREE.WebGLRenderTarget for offscreen render; full-screen quad (PlaneGeometry 2×2 + OrthographicCamera) established pattern; blend via ShaderMaterial opacity |
| SCN-04 | Custom GLSL hero shader — procedural generative background driven by scroll position and `--color-primary` uniforms | Fragment-only full-screen quad confirmed working (no vertex geometry needed); FBM noise via smoothstep + fract(sin()) established pattern; uniforms: uTime, uScroll, uColor, uGridDensity; resolveColorAsThreeColor already available |
| INT-01 | All showcase pages consume SFSection, SFStack, SFGrid primitives (resolving zero-consumer tech debt) | SFSection/SFStack/SFGrid APIs fully read; 5 pages audited; homepage uses raw `<div data-bg-shift>` divs — direct replacement targets identified; /tokens, /start use `<section>` and `<div>` at section level |
| INT-02 | `data-anim="stagger"` applied to production component grid blocks | PageAnimations already handles `[data-anim="stagger"] > *` via ScrollTrigger.batch — infrastructure exists; ComponentGrid uses `data-anim="comp-cell"` — migration adds `data-anim="stagger"` wrapper; initial opacity:0 + y offset needed in CSS |
| INT-03 | SignalMotion component provides scroll-driven motion graphics for showcase sections | GSAP ScrollTrigger.create() `onUpdate` pattern established in SignalMesh; component wraps a div with a ref, builds any GSAP scroll animation internally; no new library needed |
| INT-04 | Live SIGNAL overlay allows visitors to adjust SIGNAL intensity and parameters interactively | Requires client component with useState; writes to CSS custom properties or passes props to canvas uniforms; overlay UI uses existing SF primitives (SFSlider, SFBadge) |
</phase_requirements>

---

## Summary

Phase 9 is the final milestone phase for v1.1. It ships four work streams in parallel: two new shader scenes (SCN-03 ASCII dither, SCN-04 GLSL hero), two integration tasks (INT-01 layout migration, INT-02 stagger), and two smaller integration components (INT-03 SignalMotion, INT-04 SIGNAL overlay). The phase also includes relocating SignalMesh from the homepage hero to `/components` as part of the GLSL hero swap.

No new packages are required. Three.js 0.183.2 and GSAP 3.12.7 are installed. OGL is not installed and should not be installed — Three.js is sufficient for both shader scenes, and adding OGL now would violate the "don't introduce complexity" constraint from CLAUDE.md. Both shaders use the established `useSignalScene` + singleton renderer pattern. Both use `next/dynamic({ ssr: false })` wrapped in a client boundary component, exactly mirroring `SignalMeshLazy` and `TokenVizLoader`.

The layout migration (INT-01) is a pure refactor: swap `<div data-bg-shift ...>` wrappers on the homepage and `<section>` / `<div>` section-level containers on the other four pages for `<SFSection>`, with inner layout using `<SFStack>` / `<SFGrid>`. The visual output must not change. The stagger animation (INT-02) is already implemented in `PageAnimations.tsx` at line 368 — `ScrollTrigger.batch("[data-anim='stagger'] > *", ...)` — so the only task is applying `data-anim="stagger"` to the correct wrapper elements and ensuring their children start with `opacity: 0; transform: translateY(8px)` in CSS.

**Primary recommendation:** Implement in four plans: (1) SCN-04 GLSL hero shader + SignalMesh relocation, (2) SCN-03 ASCII dither shader, (3) INT-01/INT-02 layout migration + stagger, (4) INT-03/INT-04 SignalMotion + SIGNAL overlay. This ordering ships the most visually differentiated work first and leaves integration cleanup last.

---

## Standard Stack

### Core (all already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `three` | 0.183.2 | PlaneGeometry full-screen quad, ShaderMaterial, WebGLRenderTarget (ASCII post-process), OrthographicCamera | Project decision; all scenes use this |
| `gsap` + `ScrollTrigger` | 3.12.7 | Scroll-driven uniform mutation for SCN-04; stagger batch already in PageAnimations | Project decision; render driver |
| `@/lib/signal-canvas` | local | singleton renderer, registerScene, disposeScene | Phase 6 infrastructure |
| `@/hooks/use-signal-scene` | local | scene lifecycle, IntersectionObserver gating, GPU disposal | Phase 6 infrastructure |
| `@/lib/color-resolve` | local | OKLCH → sRGB for shader uniforms | Phase 6/8 infrastructure |

### No New Packages Required
All shader and layout work uses existing infrastructure. Do NOT install OGL.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Three.js full-screen quad | OGL (29KB lighter) | OGL not installed; adding it now violates "don't introduce complexity"; Three.js already handles this well |
| GSAP ScrollTrigger for stagger | Native IntersectionObserver | IO pattern exists in scroll-reveal.tsx but PageAnimations already implements the stagger via ScrollTrigger.batch — no duplication needed |
| ShaderMaterial blend overlay | CSS mix-blend-mode | GLSL blend gives precise per-pixel control required for Bayer dither; CSS blend operates on entire element |

---

## Architecture Patterns

### GLSL Full-Screen Quad Pattern (SCN-04 Hero Shader)

The hero background is a fragment-only shader: a 2×2 PlaneGeometry with an OrthographicCamera (-1, 1, 1, -1) positioned at z=0 looking down -z. The shader fills the entire viewport with procedural content. This is the correct approach for a background effect that does not need geometry.

**Scene setup:**
```typescript
// Source: signal-mesh.tsx pattern + Three.js geometry API
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const geo = new THREE.PlaneGeometry(2, 2);
const material = new THREE.ShaderMaterial({
  vertexShader: VERT,   // pass-through: gl_Position = vec4(position, 1.0)
  fragmentShader: FRAG, // all visual logic here
  uniforms: {
    uTime:        { value: 0 },
    uScroll:      { value: 0 },
    uColor:       { value: new THREE.Color() },
    uGridDensity: { value: 12.0 },
  },
  depthWrite: false,
  transparent: true,
});
const quad = new THREE.Mesh(geo, material);
scene.add(quad);
```

**Pass-through vertex shader:**
```glsl
void main() {
  gl_Position = vec4(position, 1.0);
}
```

**Fragment shader structure for GLSL hero (SCN-04):**
- `vUv` derived from `gl_FragCoord.xy / resolution` — requires `uResolution` uniform or use `gl_FragCoord`
- FBM (fractional Brownian motion) noise: 4-6 octaves of `fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453)`
- Grid lines: `step(fract(uv.x * uGridDensity), 0.02)` — thin lines at regular intervals
- Scroll drives `uGridDensity` uniform (10.0 → 20.0) and noise scale via `uScroll`
- Color: `mix(vec3(0.0), uColor, combinedSignal * 0.3)` — keeps it subtle

### ASCII/Ordered Dither Post-Process (SCN-03)

ASCII dither uses a TWO-PASS approach within the singleton renderer's scissor system:
1. **Pass 1:** Render the hero section's existing content to a `WebGLRenderTarget` (offscreen texture)
2. **Pass 2:** Apply a second ShaderMaterial full-screen quad that reads the texture and applies Bayer 4×4 dither

The Bayer 4×4 matrix in GLSL:
```glsl
// Source: established GPU dithering technique, no external dependency
float bayer4x4[16] = float[16](
   0.0/16.0,  8.0/16.0,  2.0/16.0, 10.0/16.0,
  12.0/16.0,  4.0/16.0, 14.0/16.0,  6.0/16.0,
   3.0/16.0, 11.0/16.0,  1.0/16.0,  9.0/16.0,
  15.0/16.0,  7.0/16.0, 13.0/16.0,  5.0/16.0
);
int ix = int(mod(gl_FragCoord.x, 4.0));
int iy = int(mod(gl_FragCoord.y, 4.0));
float threshold = bayer4x4[iy * 4 + ix];
float luma = dot(texture2D(uTexture, vUv).rgb, vec3(0.2126, 0.7152, 0.0722));
float dithered = step(threshold, luma);
gl_FragColor = vec4(uColor * dithered, uOpacity); // 20-30% opacity blend
```

**Alternative for SCN-03 (simpler approach):** Apply dither directly on the hero section's canvas area without a render target — use `gl_FragCoord` in the GLSL hero's fragment shader to overlay dither on top of the noise field. This eliminates the two-pass complexity. The CONTEXT.md says "ordered dither CRT aesthetic on the main hero background" — both approaches satisfy this. The simpler single-pass dither overlay is recommended.

### SignalMesh Relocation to /components

The existing `SignalMeshLazy` in `app/page.tsx` (line 31) is removed from the hero `<div data-bg-shift="white">` wrapper. The same `<SignalMeshLazy />` is placed in `app/components/page.tsx` as a section background — inside a containing div with `position: relative; height: 300px` or similar. The `/components` page currently has no generative scene, so this is a pure move.

**Important:** The homepage hero `<div data-bg-shift="white">` becomes an `<SFSection>` (INT-01 migration) and `<SignalMeshLazy />` is removed from it. The GLSL hero shader takes its place.

### Lazy Wrapper Pattern (confirmed from SignalMeshLazy + TokenVizLoader)

Every new WebGL component needs a `*-lazy.tsx` client boundary wrapper:
```typescript
// components/animation/glsl-hero-lazy.tsx
"use client";
import dynamic from "next/dynamic";

const GLSLHeroDynamic = dynamic(
  () => import("@/components/animation/glsl-hero").then((m) => ({ default: m.GLSLHero })),
  { ssr: false }
);

export function GLSLHeroLazy() {
  return <GLSLHeroDynamic />;
}
```

### SF Primitive Migration Pattern (INT-01)

The homepage uses raw `<div data-bg-shift="..." data-section="..." data-section-label="..." data-cursor ...>` wrappers. These map directly to `<SFSection>`:

```typescript
// BEFORE (app/page.tsx line 28)
<div data-bg-shift="white" data-section="hero" data-section-label="HERO" data-cursor className="relative">

// AFTER
<SFSection
  label="HERO"
  data-bg-shift="white"
  data-section="hero"
  data-cursor
  className="relative"
>
```

**Key constraint:** `SFSection` renders a `<section>` with `data-section` always present and `data-section-label={label}`. The `data-bg-shift` prop is consumed as a boolean (`bgShift`) by the existing `SFSection` API but the `applyBgShift()` function in `PageAnimations.tsx` reads `el.getAttribute("data-bg-shift")` expecting a string value (e.g., `"white"`, `"black"`, `"primary"`). The current `SFSection` implementation only supports `bgShift?: boolean` (present or absent) — **this is a mismatch that must be resolved in the plan.**

Two options:
1. Extend `SFSection` to accept `bgShift?: string` (the shift value) — preferred, resolves the mismatch at the primitive level
2. Pass `data-bg-shift="white"` as a spread prop via `{...props}` — works because SFSection spreads `...props` onto `<section>`; `data-bg-shift` is an arbitrary data attribute and will pass through

Option 2 requires no SFSection API change and is safe — SFSection's `...props` spread will forward `data-bg-shift="white"` to the `<section>` element directly, bypassing the `bgShift` boolean prop entirely. Use option 2 for zero-risk migration.

### Stagger Animation (INT-02)

`PageAnimations.tsx` line 368–382 already implements `ScrollTrigger.batch("[data-anim='stagger'] > *", ...)`. The animation is ready. The tasks are:

1. Add `data-anim="stagger"` to the wrapper `<div>` or grid container that holds the items to stagger
2. Add CSS initial state: `[data-anim="stagger"] > * { opacity: 0; transform: translateY(8px); }` in globals.css — prevents flash of unstyled content
3. The batch fires once (ScrollTrigger `once: true` equivalent via `onEnter` only), animating children to `opacity: 1, y: 0` with 40ms stagger

The ComponentGrid already uses `data-anim="comp-cell"` on individual cells. The existing converge animation targets `data-anim="comp-cell"` directly — adding a `data-anim="stagger"` wrapper on the grid container would create a conflict. **Use `data-anim="stagger"` on grids that do NOT already have `data-anim="comp-cell"` children.** On `/components` page grids and other showcase section grids.

### SignalMotion Component (INT-03)

`SignalMotion` is a thin GSAP ScrollTrigger wrapper that accepts children and animates them on scroll. It provides scroll-driven motion without requiring the heavy WebGL pipeline:

```typescript
// components/animation/signal-motion.tsx
"use client";
interface SignalMotionProps {
  children: React.ReactNode;
  className?: string;
  from?: gsap.TweenVars;  // initial state
  to?: gsap.TweenVars;    // target state
  scrub?: boolean | number;
  trigger?: string; // ScrollTrigger start
}
```

This differs from `ScrollReveal` (which is a one-shot entrance animation) by supporting scrub (value tied to scroll position). Implementation uses `useGSAP` + `ScrollTrigger.create` inside the component with `{ scope: ref }`.

### Live SIGNAL Overlay (INT-04)

A client-side panel component that reads and writes SIGNAL parameters. The simplest correct approach:

- A fixed or sticky UI panel (right side, bottom) with SFSlider components for "signal intensity"
- Writes values to CSS custom properties on `:root` via `document.documentElement.style.setProperty()`
- The MutationObserver in `color-resolve.ts` handles cache invalidation when properties change
- WebGL uniforms pick up changes on next ticker frame via `resolveColorToken` calls in render functions

The overlay toggles visibility via keyboard shortcut or a small icon button. Must not block interaction with the page content.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| GLSL noise function | Custom noise algorithm | `fract(sin(dot(...)))` hash + FBM — established GPU noise pattern | Mathematically verified; one-liner in fragment shader |
| Color space conversion | Custom OKLCH→RGB | `resolveColorToken` / `resolveColorAsThreeColor` in lib/color-resolve.ts | Already handles edge cases, cache, fallback |
| WebGL scene lifecycle | Custom init/dispose/IO | `useSignalScene` hook | Handles IntersectionObserver, GPU disposal, registration |
| Animation stagger | Custom scroll listener | `ScrollTrigger.batch` in PageAnimations.tsx (already implemented) | Already in production; zero-config activation |
| Dynamic import SSR guard | Custom module federation | `next/dynamic({ ssr: false })` via `*-lazy.tsx` pattern | Established pattern, used by SignalMeshLazy + TokenVizLoader |
| Canvas context management | Multiple renderers | Singleton `SignalCanvas` renderer | Context limit: browsers allow 8–16 WebGL contexts maximum |

---

## Common Pitfalls

### Pitfall 1: SFSection bgShift API Mismatch
**What goes wrong:** `SFSection.bgShift` is `boolean`, but `applyBgShift()` reads `el.getAttribute("data-bg-shift")` as a string value (e.g., `"white"`, `"black"`). Using `bgShift={true}` sets the attribute to `""` (empty string), which `applyBgShift()` returns null for — background shifts stop working.
**Why it happens:** SFSection was built before the bg-shift string values were needed.
**How to avoid:** Pass `data-bg-shift="white"` as a spread prop directly (not via `bgShift` prop). SFSection spreads `...props` onto `<section>` so custom data attributes pass through. Do NOT use the `bgShift` boolean prop during migration.
**Warning signs:** Background color stops changing on scroll; sections stay on default background.

### Pitfall 2: GLSL Hero + SignalCanvas Scissor Conflict
**What goes wrong:** The GLSL hero renders to the full viewport but the scissor test is set per-scene. If the hero element's `getBoundingClientRect()` doesn't cover the full viewport, the hero quad is clipped.
**Why it happens:** `renderAllScenes()` in signal-canvas.tsx sets scissor/viewport to `entry.element.getBoundingClientRect()`. A hero section that is `height: 100vh` but starts below a fixed nav will have `rect.top > 0`.
**How to avoid:** The full-screen quad in the GLSL hero only needs to fill the scissored viewport region — the vertex shader outputs `gl_Position = vec4(position, 1.0)` which fills NDC space (-1 to 1) but the scissor clips it to the element bounds. This is correct behavior. Verify visually that the shader fills the hero section and not outside it.

### Pitfall 3: Double-Registering Stagger and comp-cell Animations
**What goes wrong:** Adding `data-anim="stagger"` to the `ComponentGrid` wrapper while children still have `data-anim="comp-cell"` activates both the converge animation AND the stagger batch animation on the same elements. Children animate twice with conflicting transforms.
**Why it happens:** `PageAnimations.tsx` runs both `ScrollTrigger.batch("[data-anim='stagger'] > *")` and the comp-cell converge independently.
**How to avoid:** Apply `data-anim="stagger"` only to grids that do NOT contain `data-anim="comp-cell"` children. The homepage ComponentGrid retains its converge animation. Stagger targets showcase grids on `/components`, `/tokens`, etc.
**Warning signs:** Elements flicker or jump on scroll into view.

### Pitfall 4: SignalMesh Disposal Not Called on Relocation
**What goes wrong:** When SignalMesh moves from the homepage hero to /components, if the homepage renders during a route transition while /components hasn't mounted yet, the old scene registration lingers. Two SignalMesh registrations coexist.
**Why it happens:** `useSignalScene` cleanup runs on component unmount, but React route transitions can be fast enough that both mount briefly.
**How to avoid:** This is handled by the existing `useSignalScene` cleanup — it calls `deregisterScene(id)` and `disposeScene(scene)` on unmount. The `id = crypto.randomUUID()` ensures no collision. No special handling needed, but verify via `renderer.info.memory.geometries` that it returns to baseline after navigation.

### Pitfall 5: GLSL Shader Compile Errors Are Silent in Production
**What goes wrong:** A GLSL syntax error causes the shader to silently fail — black or transparent output, no console error in production builds.
**Why it happens:** WebGL shader compilation errors are logged to console but Turbopack doesn't surface them at build time.
**How to avoid:** Test shaders in development mode where `renderer.debug` can be enabled. Add `renderer.debug = { checkShaderErrors: true }` temporarily during development. Use a static GLSL fallback color when uniforms are missing.

### Pitfall 6: ASCII Shader WebGLRenderTarget Size vs DPR
**What goes wrong:** `WebGLRenderTarget` created at CSS pixel size (not physical pixel size) produces blurry output on HiDPI displays.
**Why it happens:** `devicePixelRatio` is not accounted for in render target dimensions.
**How to avoid:** Create render target at `width * dpr, height * dpr` where `dpr = Math.min(window.devicePixelRatio, 2)`. This matches the singleton renderer's pixel ratio setting in `initSignalCanvas`.

### Pitfall 7: INT-01 Migration Breaks Server Component Constraint
**What goes wrong:** Importing `SFSection` in a page file causes TypeScript to error if SFSection has `'use client'` (it doesn't currently, but if a future edit adds it).
**Why it happens:** App Router pages are Server Components by default. A `'use client'` in a layout primitive forces the entire import tree to client.
**How to avoid:** SFSection, SFStack, SFGrid are all Server Component-safe (no `'use client'`, no hooks, no browser APIs). Confirm this before migration. They currently use only `React.forwardRef` and `cn()` — both RSC-compatible.

---

## Code Examples

### Full-Screen Quad Scene Registration (SCN-04 reference pattern)
```typescript
// Source: signal-mesh.tsx buildScene pattern, adapted for fragment-only quad
const buildScene = () => {
  const scene = new THREE.Scene();
  // OrthographicCamera fills NDC space exactly: left=-1, right=1, top=1, bottom=-1
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const primaryColor = resolveColorAsThreeColor("--color-primary");

  const uniforms = {
    uTime:        { value: 0 },
    uScroll:      { value: 0 },
    uColor:       { value: primaryColor },
    uGridDensity: { value: 12.0 },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: VERT_PASSTHROUGH,
    fragmentShader: FRAG_HERO,
    uniforms,
    transparent: true,
    depthWrite: false,
  });

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(mesh);

  return { scene, camera };
};

useSignalScene(containerRef as React.RefObject<HTMLElement | null>, buildScene);
```

### ScrollTrigger Uniform Wiring (established from SignalMesh pattern)
```typescript
// Source: signal-mesh.tsx lines 259-272 — direct uniform mutation, no tween
ScrollTrigger.create({
  trigger: container,
  start: "top bottom",
  end: "bottom top",
  onUpdate: (self) => {
    if (!uniformsRef.current) return;
    uniformsRef.current.uScroll.value = self.progress;
    uniformsRef.current.uGridDensity.value = 12.0 + self.progress * 8.0;
  },
});
```

### Ticker Time Accumulation (established pattern)
```typescript
// Source: signal-mesh.tsx lines 276-288 — ticker-accumulation-guard
const tickerFn = () => {
  if (!uniformsRef.current) return;
  uniformsRef.current.uTime.value += 0.016;
};
gsap.ticker.remove(tickerFn); // HMR guard
gsap.ticker.add(tickerFn);

return () => { gsap.ticker.remove(tickerFn); };
```

### SFSection Migration with data-bg-shift passthrough
```typescript
// Source: sf-section.tsx — ...props spreads to <section>
// BEFORE (app/page.tsx)
<div data-bg-shift="white" data-section="hero" data-section-label="HERO" data-cursor className="relative">

// AFTER — data-bg-shift passed as spread prop, NOT via bgShift boolean
<SFSection
  label="HERO"
  data-bg-shift="white"   // spread prop — bypasses bgShift boolean, passes to <section>
  data-cursor
  className="relative"
  spacing="16"
>
// Note: data-section is always present on SFSection output; data-section-label set via label prop
```

### Stagger CSS Initial State (required for INT-02)
```css
/* app/globals.css — prevents flash of un-animated content */
[data-anim="stagger"] > * {
  opacity: 0;
  transform: translateY(8px);
}
```

---

## State of the Art (Project-Specific)

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| SignalMesh in homepage hero | GLSL hero shader in homepage; SignalMesh on /components | Phase 9 | Hero gets procedural background; /components gets interactive 3D scene |
| Raw `<div data-bg-shift>` on homepage | `<SFSection data-bg-shift="..." label="...">` | Phase 9 (INT-01) | Layout primitives now consumed everywhere; zero-consumer debt resolved |
| No stagger on showcase grids | `data-anim="stagger"` on grid wrappers | Phase 9 (INT-02) | Existing PageAnimations infra activates; no new code |
| OGL noted as candidate for shader effects | Three.js used throughout | STATE.md decision | OGL not installed; Three.js handles full-screen quads fine |

**Deprecated/outdated:**
- `SignalMeshLazy` in homepage hero: removed, replaced by `GLSLHeroLazy`
- `bgShift` boolean prop on SFSection: do not use during migration (use spread prop)

---

## Open Questions

1. **INT-04: SIGNAL overlay scope**
   - What we know: requirement is "visitors can adjust SIGNAL intensity and parameters interactively"
   - What's unclear: which parameters specifically (color, animation speed, blend opacity?); whether it persists across navigation; whether it's a floating panel or drawer
   - Recommendation: implement as a floating bottom-right panel with 2–3 sliders (signal intensity, animation speed, color accent). Write to CSS custom properties. No persistence needed for MVP. Keep it minimal — this is a showcase feature, not a product feature.

2. **INT-03: SignalMotion vs ScrollReveal distinction**
   - What we know: `ScrollReveal` already exists as a scroll-triggered entrance animation; `SignalMotion` must be distinct per the requirement
   - What's unclear: what "motion graphics for showcase sections" means beyond ScrollReveal
   - Recommendation: SignalMotion adds `scrub` support (animation tied to scroll position, not one-shot entrance) and supports custom GSAP tween configurations. It's a superset of ScrollReveal. Implement as a wrapper around GSAP ScrollTrigger with `scrub: 1` default.

3. **ASCII shader: single-pass vs two-pass**
   - What we know: CONTEXT.md says "renders on the hero section" at 20-30% opacity blend
   - What's unclear: whether the dither should post-process the GLSL hero content or independently overlay it
   - Recommendation: implement as a single-pass overlay baked into the GLSL hero fragment shader — the Bayer 4×4 dither modulates the output of the noise field directly. This avoids `WebGLRenderTarget` complexity entirely and satisfies SCN-03 without a two-pass pipeline. The "post-process" framing in the requirement refers to the visual effect (CRT dither look), not a mandatory render-target architecture.

---

## Sources

### Primary (HIGH confidence)
- Direct read of `/lib/signal-canvas.tsx` — singleton renderer, SceneEntry type, renderAllScenes scissor logic
- Direct read of `/hooks/use-signal-scene.ts` — scene lifecycle, IntersectionObserver, GPU disposal contract
- Direct read of `/components/animation/signal-mesh.tsx` — full working pattern: buildScene, useSignalScene, ScrollTrigger onUpdate, ticker accumulation, reduced-motion guard, SVG fallback
- Direct read of `/components/layout/page-animations.tsx` — existing stagger batch at lines 368–382 (already `data-anim="stagger"` ready)
- Direct read of `/components/sf/sf-section.tsx`, `sf-stack.tsx`, `sf-grid.tsx` — API confirmed, `...props` spread confirmed
- Direct read of all 5 page files — migration targets identified, section-level wrappers catalogued
- `pnpm list ogl` confirmed — OGL not installed
- Three.js 0.183.2 confirmed installed: `node_modules/three`

### Secondary (MEDIUM confidence)
- Bayer 4×4 matrix GLSL pattern — established GPU dithering technique documented across multiple GPU programming references; matrix values are mathematically derived and unchanging
- Full-screen quad with OrthographicCamera(-1,1,1,-1) — canonical Three.js pattern for post-process and shader backgrounds

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages confirmed installed, all APIs read from source
- Architecture: HIGH — all patterns derived from existing working code in the codebase
- Pitfalls: HIGH — all pitfalls derived from direct code reading (SFSection bgShift mismatch is observed, not inferred)
- INT-04 scope: MEDIUM — requirement is broad; implementation detail at Claude's discretion per CONTEXT.md

**Research date:** 2026-04-06
**Valid until:** 2026-05-06 (stable stack; Three.js and GSAP APIs are not changing)
