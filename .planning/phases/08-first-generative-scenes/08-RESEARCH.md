# Phase 8: First Generative Scenes - Research

**Researched:** 2026-04-05
**Domain:** Three.js procedural mesh · ScrollTrigger uniform wiring · Canvas 2D token visualization · OKLCH color bridge · GPU disposal validation
**Confidence:** HIGH (all stack verified against installed node_modules 0.183.2, codebase read directly)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**SignalMesh Geometry & Appearance:**
- IcosahedronGeometry with vertex displacement — organic yet structured, DU/TDR wireframe aesthetic
- Wireframe rendering with subtle solid fill at low opacity — terminal/technical aesthetic, not game-engine look
- ScrollTrigger drives rotation speed + vertex displacement amplitude — geometry "breathes" as you scroll
- Color sourced from `--color-primary` via `resolveColorAsThreeColor` — mesh matches site color identity

**Token Visualization:**
- Canvas 2D approach (not WebGL) — per SCN-02 requirement
- Visualizes core 5 colors + blessed spacing stops + typography scale — the essentials
- Placed on `/tokens` page — dedicated design system showcase
- Live update: re-reads CSS custom properties on theme change / mutation — proves tokens are source of truth

**Pipeline Validation & Integration:**
- SignalMesh placed in homepage hero section — high-visibility pipeline validation
- Disposal validation: `renderer.info.memory.geometries` logged to console on unmount
- WebGL unavailable fallback: static SVG silhouette of the mesh — same shape, no animation
- Performance budget: max 2ms per frame on mid-range GPU

### Claude's Discretion
- Exact icosahedron detail level and displacement shader specifics
- Token visualization layout grid sizing and spacing
- ScrollTrigger pin behavior (if any) for SignalMesh section
- SVG fallback generation approach (pre-rendered vs runtime)
- Canvas 2D rendering optimization (offscreen canvas, requestAnimationFrame throttle)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SCN-01 | SignalMesh — first procedural 3D mesh component validates full pipeline (Three.js + GSAP ticker + singleton renderer + disposal) | IcosahedronGeometry detail=2 (540 vertices, good displacement resolution); ShaderMaterial uniforms verified; WireframeGeometry + EdgesGeometry both confirmed; ScrollTrigger onUpdate pattern for uniform mutation |
| SCN-02 | Data-driven token visualization renders the token system visually using Canvas 2D (system demonstrates itself) | `getComputedStyle` + MutationObserver on `:root` for live token reads; resolveColorToken pattern already established in color-resolve.ts; canvas 2D rendering without additional deps |
</phase_requirements>

---

## Summary

Phase 8 consumes the Phase 6 singleton infrastructure end-to-end. Both requirements are first-time consumers of `useSignalScene` and `resolveColorToken` in production scenes. The primary technical challenge for SCN-01 is writing a ShaderMaterial vertex displacement shader that accepts time and amplitude uniforms, wiring those uniforms via GSAP ScrollTrigger `onUpdate`, and confirming that the disposal contract actually zeroes `renderer.info.memory.geometries`. The primary technical challenge for SCN-02 is reading live CSS custom properties from `:root` in a Canvas 2D context and re-rendering on token change — solved entirely without additional libraries.

Neither scene requires new package installations. Three.js 0.183.2 is already installed. The full API surface needed (IcosahedronGeometry, ShaderMaterial, WireframeGeometry, EdgesGeometry, LineSegments, LineBasicMaterial, MeshBasicMaterial) is verified present. The `resolveColorAsThreeColor` function in `lib/color-resolve.ts` returns `new THREE.Color(r/255, g/255, b/255)` — normalized sRGB input, which is correct given `renderer.outputColorSpace = THREE.SRGBColorSpace`.

One caching optimization is explicitly scheduled for this phase by the STATE.md comment on `color-resolve.ts`: "No caching — optimize in Phase 8." This is relevant to SCN-01 which calls `resolveColorAsThreeColor("--color-primary")` and potentially to SCN-02 which needs rapid token reads for Canvas 2D. A simple module-level cache with a `MutationObserver`-triggered invalidation is the right pattern.

**Primary recommendation:** SignalMesh builds on `useSignalScene` exactly as designed. A `ShaderMaterial` with `uTime`, `uDisplacement`, `uColor`, `uOpacity` uniforms drives vertex displacement. GSAP ScrollTrigger `onUpdate` callback mutates `uDisplacement.value` directly — no GSAP tween targets a Three.js object. The token visualization is a standalone Canvas 2D component using `getComputedStyle` + `MutationObserver` with no WebGL dependency.

---

## Standard Stack

### Core (all already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `three` | 0.183.2 (installed) | IcosahedronGeometry, ShaderMaterial, WireframeGeometry, renderer.info | Project decision; already in node_modules |
| `gsap` + `ScrollTrigger` | 3.12.7 (installed) | `onUpdate` callback for uniform mutation; GSAP ticker drives render loop | Already drives all GSAP animations in project |

### No New Packages Required
Both SCN-01 and SCN-02 are implementable with the current stack. Canvas 2D and MutationObserver are browser built-ins.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| ShaderMaterial (custom GLSL) | MeshBasicMaterial (no displacement) | MeshBasicMaterial has no vertex shader access; can't implement vertex displacement |
| WireframeGeometry + LineSegments | `wireframe: true` on ShaderMaterial | `wireframe: true` on ShaderMaterial still renders triangulation diagonals; WireframeGeometry/EdgesGeometry produces cleaner icosahedron edges |
| EdgesGeometry (hard edges only) | WireframeGeometry (all edges) | EdgesGeometry gives cleaner icosahedron silhouette (shows only geometric edges); WireframeGeometry shows all triangulation — both are verified present in Three.js 0.183.2 |
| MutationObserver for token updates | setInterval polling | MutationObserver fires on actual DOM attribute changes; zero waste when tokens don't change |

---

## Architecture Patterns

### SignalMesh Component Structure
```
components/animation/signal-mesh.tsx   — 'use client'; useSignalScene consumer
components/layout/                     — NO new lazy wrapper needed; reuses SignalCanvas in layout.tsx
app/page.tsx                           — hero section hosts <SignalMeshContainer>
```

### Token Visualization Structure
```
components/animation/token-viz.tsx     — 'use client'; standalone Canvas 2D component
app/tokens/page.tsx                    — receives <TokenViz /> in new section below TokenTabs
```

### Pattern 1: SignalMesh — useSignalScene Consumer

The `useSignalScene` hook accepts a container `ref` (the DOM element that defines the viewport rectangle for the scissor split) and a `buildScene` factory. SignalMesh builds its scene inside the factory, stores material uniform refs outside the effect for ScrollTrigger access.

```typescript
// Source: hooks/use-signal-scene.ts (existing) + Three.js 0.183.2 verified
"use client";

import { useRef } from "react";
import { useSignalScene } from "@/hooks/use-signal-scene";
import { resolveColorAsThreeColor } from "@/lib/color-resolve";
import { gsap, ScrollTrigger } from "@/lib/gsap-core";
import * as THREE from "three";

export function SignalMesh() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Uniforms live outside buildScene so ScrollTrigger can mutate them
  const uniformsRef = useRef<{
    uTime: THREE.IUniform<number>;
    uDisplacement: THREE.IUniform<number>;
    uColor: THREE.IUniform<THREE.Color>;
    uOpacity: THREE.IUniform<number>;
  } | null>(null);

  useSignalScene(containerRef, () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 2.5;

    const uniforms = {
      uTime: { value: 0.0 },
      uDisplacement: { value: 0.0 },
      uColor: { value: resolveColorAsThreeColor("--color-primary") },
      uOpacity: { value: 0.85 },
    };
    uniformsRef.current = uniforms;

    // Icosahedron detail=2: 540 vertices — sufficient displacement resolution
    const geo = new THREE.IcosahedronGeometry(1, 2);
    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // Wireframe overlay on EdgesGeometry for clean icosahedron edges
    const edgesGeo = new THREE.EdgesGeometry(geo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: uniforms.uColor.value,
      transparent: true,
      opacity: 0.5,
    });
    const wireframe = new THREE.LineSegments(edgesGeo, edgesMat);
    scene.add(wireframe);

    return { scene, camera };
  });

  // ScrollTrigger wires uniforms after mount
  // ...
}
```

**Key constraint:** `buildScene` runs once inside `useEffect([])`. Refs storing uniforms must be set during `buildScene` so the ScrollTrigger setup (in a separate `useGSAP` or `useEffect`) can access them after mount.

### Pattern 2: GLSL Vertex Displacement Shader

```glsl
// Vertex shader — displacement along vertex normal
// uTime drives slow ambient rotation; uDisplacement is scroll-driven
uniform float uTime;
uniform float uDisplacement;

void main() {
  vec3 displaced = position + normal * (sin(position.x * 5.0 + uTime) * 0.1 + uDisplacement);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
```

**Detail level reasoning:** `detail=2` (540 vertices) gives enough geometry for visible displacement without overloading a mid-range GPU. `detail=4` (1500 vertices) is unnecessary at hero section size. `detail=1` (240 vertices) looks faceted, not smooth.

### Pattern 3: ScrollTrigger → Uniform Mutation

ScrollTrigger `onUpdate` fires on every scroll position change. Mutating `uniform.value` directly is the correct Three.js pattern — never use GSAP to tween a uniform object (GSAP doesn't know how to interpolate `THREE.IUniform`).

```typescript
// Source: GSAP ScrollTrigger docs + Three.js uniform mutation pattern
ScrollTrigger.create({
  trigger: containerRef.current,
  start: "top bottom",
  end: "bottom top",
  onUpdate: (self) => {
    if (!uniformsRef.current) return;
    // progress 0→1 maps to no displacement → full displacement
    uniformsRef.current.uDisplacement.value = self.progress * 0.4;
  },
});
```

**Critical:** ScrollTrigger must be created after `useSignalScene` registers the scene. Use a separate `useEffect` that runs after the first render, or use `useGSAP` with `{ scope: containerRef }`. The `useGSAP` hook's cleanup automatically kills ScrollTrigger instances on unmount.

### Pattern 4: Canvas 2D Token Visualization with Live Update

```typescript
// Source: color-resolve.ts probe technique (lib/color-resolve.ts lines 26-43)
// MutationObserver fires on :root attributeChange (Tailwind dark mode class)
"use client";

import { useEffect, useRef } from "react";
import { resolveColorToken } from "@/lib/color-resolve";

const TOKENS_TO_VISUALIZE = {
  colors: ["--color-primary", "--color-foreground", "--color-background", "--color-secondary", "--color-accent"],
  spacing: ["--space-1", "--space-2", "--space-3", "--space-4", "--space-6", "--space-8", "--space-12", "--space-16", "--space-24"],
};

export function TokenViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function draw() {
      // Read tokens fresh via getComputedStyle on every draw
      // Use resolveColorToken for colors, getPropertyValue for spacing
    }

    draw(); // initial draw

    // MutationObserver on document.documentElement for class changes (dark mode)
    const mo = new MutationObserver(draw);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => mo.disconnect();
  }, []);

  return <canvas ref={canvasRef} aria-label="Token visualization" role="img" />;
}
```

### Pattern 5: Disposal Validation

`renderer.info.memory.geometries` is a live counter on the singleton renderer. The test:
1. Load a page with SignalMesh — observe `renderer.info.memory.geometries > 0`
2. Navigate away — `useSignalScene` cleanup runs: `deregisterScene` + `disposeScene`
3. Navigate back — counter should return to same value as step 1 (or 0 if no other scenes)

The `disposeScene` traversal in `signal-canvas.tsx` (lines 201-226) already handles geometry + material + texture disposal. The Phase 8 task is to verify the contract holds for the actual SignalMesh scene graph (Mesh + geometry + material + LineSegments + EdgesGeometry + LineBasicMaterial).

**Note:** `disposeScene` in `signal-canvas.tsx` traverses `scene.children` recursively. Both the Mesh and LineSegments will be traversed. Both geometry objects and both materials will be disposed. This is correct — no additional disposal logic needed.

### Anti-Patterns to Avoid

- **Animating uniforms with `gsap.to(uniform, { value: x })`:** GSAP tweens a plain object property, which works syntactically but bypasses GSAP's type system and may produce unexpected behavior. Use `onUpdate` direct mutation for scroll-driven values. Use GSAP tween only for entrance/exit animations where easing matters.
- **Creating ScrollTrigger inside `buildScene`:** `buildScene` runs inside `useEffect`. ScrollTrigger created there will not be cleaned up by `useGSAP` cleanup (which only kills ScrollTrigger created via `useGSAP`). Either use `useGSAP` for ScrollTrigger separately, or manually kill it in the `useEffect` cleanup.
- **Calling `resolveColorAsThreeColor` inside the render loop:** Each call creates a new 1x1 canvas DOM element. With Phase 8 caching, resolve once at scene build time and on mutation. Never call during the GSAP ticker frame.
- **Setting `wireframe: true` on ShaderMaterial:** This renders all triangulation diagonals. Use EdgesGeometry + LineSegments for clean icosahedron edge rendering.
- **Forgetting camera aspect ratio:** The camera is created with `aspect: 1` in `buildScene`. The scissor/viewport pattern resizes the renderer but does not update individual camera aspects. Update the camera aspect ratio inside a resize handler or accept the fixed aspect from `buildScene`. The container element's aspect ratio defines the rendered area.
- **Non-null assertion on `uniformsRef.current` in ScrollTrigger:** The ScrollTrigger `onUpdate` fires after mount, but there is a tiny window between component mount and `useSignalScene` completing `buildScene` where `uniformsRef.current` is null. Always guard with `if (!uniformsRef.current) return`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scene registration + disposal | Custom registration map | `useSignalScene` hook | Already built in Phase 6; disposal traversal verified; IntersectionObserver already wired |
| OKLCH→sRGB conversion | CSS color parsing | `resolveColorToken` / `resolveColorAsThreeColor` | Phase 6 probe technique; browser-native accuracy; handles all CSS color formats |
| WebGL render loop | `requestAnimationFrame` / `setAnimationLoop` | GSAP ticker (already running) | GSAP ticker is the sole render driver per architecture decision; desyncing creates reduced-motion failures |
| Canvas 2D font loading | Custom font loading | `document.fonts.ready.then(draw)` | CSS fonts take time to load; drawing before fonts are ready produces system font |
| SVG fallback for WebGL unavailable | Runtime Three.js check | `<canvas>` with `getContext('webgl2') ?? getContext('webgl')` null check | Simple, reliable; render SVG fallback as static element when null |

---

## Common Pitfalls

### Pitfall 1: Camera Aspect Ratio Mismatch
**What goes wrong:** Icosahedron renders stretched or squashed, especially on non-square containers.
**Why it happens:** `PerspectiveCamera` is created with `aspect: 1` at scene build time. The scissor viewport clips to the container's actual dimensions, but the camera projection was computed for a 1:1 ratio.
**How to avoid:** After building the camera, compute aspect from the container element: `containerRef.current.clientWidth / containerRef.current.clientHeight`. Store camera in a ref. On window resize, update `camera.aspect` and call `camera.updateProjectionMatrix()`.
**Warning signs:** Sphere/icosahedron appears elliptical when container is wider or taller than square.

### Pitfall 2: ScrollTrigger Trigger Element vs Container Element
**What goes wrong:** ScrollTrigger fires at wrong scroll position, or never fires.
**Why it happens:** The `containerRef` element might be inside the hero section which has overflow:hidden or a specific height. ScrollTrigger's `trigger` must be a visible, non-zero-size element that exists in the scroll container.
**How to avoid:** Set `trigger: containerRef.current` with `start: "top bottom"` (enters viewport). Verify the element has non-zero clientHeight before creating the trigger. Lenis is the scroll driver — confirm ScrollTrigger is using Lenis proxy (check if lenis-provider.tsx wires ScrollTrigger.scrollerProxy).
**Warning signs:** `self.progress` stays at 0 or 1 and never changes while scrolling.

### Pitfall 3: Disposal Count Not Zeroing
**What goes wrong:** `renderer.info.memory.geometries` increments by +2 on each page revisit (one for IcosahedronGeometry, one for EdgesGeometry).
**Why it happens:** The SignalMesh component unmounts but the scene cleanup in `useSignalScene` didn't run because the component was wrapped in a way that prevents unmount, or `disposeScene` doesn't reach the LineSegments object.
**How to avoid:** Confirm `disposeScene` traverses the full scene: both Mesh and LineSegments are children. `scene.traverse` is depth-first and visits all descendants. Log `renderer.info.memory.geometries` before and after navigation in dev.
**Warning signs:** Count increases monotonically with each page visit; `scene.children.length` log shows non-zero after dispose.

### Pitfall 4: color-resolve.ts Cache Staleness
**What goes wrong:** SignalMesh renders with stale color after theme change.
**Why it happens:** Phase 6 deliberately omitted caching from `color-resolve.ts` because `color-cycle-frame.tsx` dynamically mutates `--color-primary`. If a cache is added in Phase 8, it must be invalidated on mutation.
**How to avoid:** If caching is added to `color-resolve.ts`, invalidate on `MutationObserver` (class changes on `documentElement` for dark mode) and on `color-cycle-frame.tsx` mutation events. Alternatively, don't cache for `--color-primary` specifically — resolve once per scene build, and re-resolve on a MutationObserver if dark-mode support is needed.
**Warning signs:** Mesh color doesn't update when user switches dark/light mode.

### Pitfall 5: GSAP Ticker Adds Accumulating on HMR
**What goes wrong:** In development, each hot-module reload creates a new ScrollTrigger + additional GSAP ticker callbacks. Frame budget degrades.
**Why it happens:** React StrictMode double-invokes effects. Each invoke registers ticker callbacks.
**How to avoid:** The `useGSAP` hook handles its own cleanup. For manual `gsap.ticker.add()` calls outside `useGSAP`, always return a cleanup that calls `gsap.ticker.remove()`. Follow the ticker-accumulation-guard pattern from Phase 7 (07-02-SUMMARY.md).
**Warning signs:** CPU usage climbs with each hot reload in dev; frame time exceeds 2ms budget.

### Pitfall 6: Canvas 2D Font Not Loaded
**What goes wrong:** Token visualization renders with system font instead of Inter/JetBrains Mono.
**Why it happens:** Canvas 2D `ctx.font` renders immediately; if the web font isn't loaded yet, it falls back.
**How to avoid:** Wrap the initial draw in `document.fonts.ready.then(() => draw())`. Subsequent redraws triggered by MutationObserver will fire after fonts are loaded.
**Warning signs:** Token labels render in a different typeface than the surrounding page.

---

## Code Examples

Verified patterns from codebase and Three.js 0.183.2 (node_modules verified):

### IcosahedronGeometry with EdgesGeometry (verified Three.js 0.183.2)
```typescript
// Source: Three.js 0.183.2 node_modules — verified API
const geo = new THREE.IcosahedronGeometry(1, 2); // detail=2: 540 vertices
const edgesGeo = new THREE.EdgesGeometry(geo);   // clean geometric edges only
const edges = new THREE.LineSegments(
  edgesGeo,
  new THREE.LineBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.6 })
);
scene.add(mesh);   // solid mesh (low opacity fill)
scene.add(edges);  // wireframe overlay
```

### ShaderMaterial with Displacement Uniforms (verified Three.js 0.183.2)
```typescript
// Source: Three.js 0.183.2 node_modules — ShaderMaterial constructor verified
const uniforms = {
  uTime:         { value: 0.0 },
  uDisplacement: { value: 0.0 },
  uColor:        { value: resolveColorAsThreeColor("--color-primary") },
  uOpacity:      { value: 1.0 },
};

const mat = new THREE.ShaderMaterial({
  uniforms,
  vertexShader: `
    uniform float uTime;
    uniform float uDisplacement;
    void main() {
      float wave = sin(position.x * 4.0 + uTime * 0.8) * 0.5
                 + sin(position.y * 3.5 + uTime * 0.6) * 0.5;
      vec3 displaced = position + normal * wave * uDisplacement;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    uniform float uOpacity;
    void main() {
      gl_FragColor = vec4(uColor, uOpacity);
    }
  `,
  transparent: true,
  side: THREE.DoubleSide,
});
```

### ScrollTrigger → Uniform Mutation (verified GSAP 3.12.7)
```typescript
// Source: gsap-core.ts pattern + GSAP ScrollTrigger onUpdate
// Created in useGSAP() for automatic cleanup on unmount
useGSAP(
  () => {
    if (!containerRef.current || !uniformsRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        if (!uniformsRef.current) return;
        uniformsRef.current.uDisplacement.value = self.progress * 0.4;
        // uTime incremented by ticker — don't set it here
      },
    });
  },
  { scope: containerRef }
);
```

### Disposal Verification (renderer.info.memory)
```typescript
// Source: Three.js WebGLRenderer.info — standard disposal validation
// In browser dev console after navigation:
const state = (window as Record<string, unknown>).__sf_signal_canvas as SignalCanvasState;
console.log("geometries in GPU:", state.renderer?.info.memory.geometries);
// Expected: 0 after navigation away from a page with SignalMesh
```

### resolveColorAsThreeColor (existing, from lib/color-resolve.ts)
```typescript
// Source: lib/color-resolve.ts lines 52-55 — existing API
// Returns THREE.Color with r/g/b normalized 0-1 from sRGB
// Call once at buildScene time; re-resolve on theme change if needed
const color = resolveColorAsThreeColor("--color-primary");
// color.r, color.g, color.b all in 0-1 range
// Compatible with renderer.outputColorSpace = THREE.SRGBColorSpace
```

### Canvas 2D Token Reader (MutationObserver pattern)
```typescript
// Source: canvas-cursor.tsx probe pattern + browser MutationObserver
// getComputedStyle reads CURRENT computed value — always up to date
function readSpacingToken(cssVar: string): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(cssVar).trim();
  // e.g. "1rem" → parse to pixels
  const rem = parseFloat(raw);
  return rem * 16; // px (16px base assumed — standard browser default)
}

// MutationObserver for live dark-mode switching
const mo = new MutationObserver(() => {
  draw(); // re-read all tokens and redraw canvas
});
mo.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["class"], // Tailwind toggles .dark class
});
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `renderer.setAnimationLoop` | GSAP ticker (`gsap.ticker.add`) | Phase 6 decision | GSAP globalTimeline scalar controls reduced-motion for WebGL too |
| One renderer per canvas component | Singleton scissor/viewport renderer | Phase 6 (GEN-01) | Prevents context exhaustion; all scenes share one GPU context |
| Inline OKLCH→sRGB per component | `resolveColorToken` / `resolveColorAsThreeColor` in `lib/color-resolve.ts` | Phase 6 (GEN-02) | Shared, typed, probe-based color bridge |
| No caching in color-resolve.ts | Cache with MutationObserver invalidation | Phase 8 (this phase) | Eliminates repeated 1x1 canvas DOM allocations during scroll |
| R3F for 3D | Raw Three.js | v1.1 architecture decision | Avoids rAF loop conflict with GSAP globalTimeline |

**Note on Three.js version:** Project is on 0.183.2. Three.js r152+ introduced `outputColorSpace` replacing `outputEncoding`. The renderer in `signal-canvas.tsx` uses `renderer.outputColorSpace = THREE.SRGBColorSpace` — this is correct for 0.183.2.

---

## Open Questions

1. **Lenis + ScrollTrigger proxy wiring**
   - What we know: `lenis-provider.tsx` exists and drives smooth scroll. ScrollTrigger needs to be aware of Lenis's scroll position, not native scroll.
   - What's unclear: Whether `lenis-provider.tsx` already calls `ScrollTrigger.scrollerProxy()` or `lenis.on("scroll", ScrollTrigger.update)`.
   - Recommendation: Read `lenis-provider.tsx` at plan time. If the proxy is already wired, SignalMesh ScrollTrigger works automatically. If not, the plan must add the proxy wiring before creating any scroll-reactive ScrollTrigger.

2. **color-resolve.ts caching scope**
   - What we know: STATE.md explicitly flags "No caching in color-resolve.ts (Phase 6) — optimize in Phase 8." The `color-cycle-frame.tsx` dynamically mutates `--color-primary` via `setProperty`, so naive caching goes stale.
   - What's unclear: Whether Phase 8 should add caching to `color-resolve.ts` globally (affects all consumers) or just add a local cache inside SignalMesh.
   - Recommendation: Add an optional time-to-live cache parameter to `resolveColorToken` (default: no cache). SignalMesh can pass `{ ttl: 5000 }`. This avoids breaking color-cycle-frame.tsx behavior.

3. **Hero section layout impact of SignalMesh placement**
   - What we know: The hero section (`components/blocks/hero.tsx`) is a two-panel grid. The left panel has `HeroMesh` (Canvas 2D). SignalMesh (Three.js via singleton) is a separate element — it does not replace HeroMesh.
   - What's unclear: Where exactly in the hero section the SignalMesh container div sits, and whether it overlaps with HeroMesh or occupies a different region (right panel? full-bleed behind the grid?).
   - Recommendation: Clarify at plan time. If SignalMesh replaces HeroMesh (same left panel, z-index layering), the existing Canvas 2D HeroMesh should be removed or conditioned. If it's a new region, the layout needs a dedicated container div for the scissor rect.

---

## Validation Architecture

> workflow.nyquist_validation key absent in .planning/config.json — treated as enabled.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected — no jest.config, vitest.config, or test/ directory found |
| Config file | None — Wave 0 must establish framework |
| Quick run command | N/A until framework established |
| Full suite command | N/A until framework established |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SCN-01a | SignalMesh renders without throwing | smoke | manual (browser) | N/A |
| SCN-01b | Scroll changes displacement uniform | manual | visual check in browser | N/A |
| SCN-01c | `renderer.info.memory.geometries` returns to baseline after navigation | manual | browser devtools check | N/A |
| SCN-02a | Token visualization renders in browser without throwing | smoke | manual (browser) | N/A |
| SCN-02b | Canvas shows color swatches matching CSS token values | manual | visual comparison | N/A |
| SCN-02c | Dark mode toggle updates canvas without page reload | manual | browser toggle test | N/A |

**Note:** Phase 8 scenes are WebGL/Canvas 2D browser-only. Unit tests for Three.js scene construction require jsdom + webgl mocking (heavy setup). All phase acceptance criteria are manual browser verification steps. The disposal check specifically requires a WebGLRenderer instance, which cannot run in Node.

### Wave 0 Gaps
No test framework exists in this project. Phase 8 does not require establishing one — all acceptance criteria are visual/browser verification. No Wave 0 test infrastructure tasks needed.

---

## Sources

### Primary (HIGH confidence)
- Three.js 0.183.2 node_modules — IcosahedronGeometry, ShaderMaterial, WireframeGeometry, EdgesGeometry, LineSegments, LineBasicMaterial, MeshBasicMaterial all verified via `node -e` execution against installed package
- `lib/signal-canvas.tsx` — singleton renderer implementation, scissor/viewport pattern, disposeScene traversal (lines 201-226), renderer.outputColorSpace = THREE.SRGBColorSpace
- `hooks/use-signal-scene.ts` — buildScene factory pattern, IntersectionObserver, cleanup order (deregisterScene then disposeScene)
- `lib/color-resolve.ts` — resolveColorToken probe technique, resolveColorAsThreeColor return type
- `lib/gsap-core.ts` — ScrollTrigger import, useGSAP import confirmed
- `app/globals.css` — all token CSS custom property names verified (--color-primary, --space-*, --text-*)
- `.planning/STATE.md` — "No caching in color-resolve.ts — optimize in Phase 8" explicit flag

### Secondary (MEDIUM confidence)
- `components/animation/scroll-reveal.tsx` — ScrollTrigger + useGSAP cleanup pattern in this codebase
- `.planning/phases/06-generative-signal-foundation/06-02-SUMMARY.md` — confirmed Phase 6 implementation decisions including Y-axis inversion, GSAP-ticker-only render driver
- `.planning/phases/07-signal-activation/07-02-SUMMARY.md` — ticker-accumulation-guard pattern (directly applicable to Phase 8 ScrollTrigger cleanup)

### Tertiary (LOW confidence — not independently verified)
- GLSL vertex displacement shader specifics — standard Three.js GLSL pattern, but the exact sine wave formula is author's interpretation; needs visual validation
- `document.fonts.ready` timing for Canvas 2D — standard browser API, but interaction with Next.js font loading (`next/font`) not verified

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Three.js 0.183.2 verified in node_modules; all API calls confirmed executable
- Architecture: HIGH — `useSignalScene` hook and `signal-canvas.tsx` read directly; patterns verified
- Pitfalls: HIGH — derived from reading actual Phase 6/7 implementation notes and codebase; not speculative
- GLSL shaders: MEDIUM — vertex displacement pattern is standard but specific formula needs visual iteration

**Research date:** 2026-04-05
**Valid until:** 2026-05-05 (Three.js patch versions may change; core APIs stable within minor)
