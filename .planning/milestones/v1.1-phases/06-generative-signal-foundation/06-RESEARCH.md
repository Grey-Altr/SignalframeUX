# Phase 6: Generative SIGNAL Foundation - Research

**Researched:** 2026-04-05
**Domain:** Three.js singleton WebGL renderer · SSR-safe dynamic import · OKLCH→sRGB color bridge · reduced-motion guard · GSAP ticker integration
**Confidence:** HIGH (core patterns verified against official Three.js docs and existing codebase)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
All five requirements (GEN-01–05) are pure infrastructure. No scenes are built in this phase.

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Key technical decisions:
- Three.js vs @react-three/fiber approach for SignalCanvas
- Singleton pattern implementation (portal vs context provider)
- Color-resolve API surface (sync vs async, caching strategy)
- Bundle splitting strategy for Three.js async chunk
- Reduced-motion detection method (CSS media query vs JS matchMedia)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| GEN-01 | Singleton SignalCanvas renderer manages all WebGL contexts from a single shared instance, preventing context exhaustion | Three.js scissor/viewport pattern; globalThis singleton; context limit verified |
| GEN-02 | OKLCH→sRGB color bridge utility extracted from canvas-cursor.tsx probe technique into `lib/color-resolve.ts` | Existing probe technique in canvas-cursor.tsx lines 38–58; verified sRGB conversion |
| GEN-03 | `useSignalScene` hook: auto `.dispose()` traversal, GSAP ticker render driver, IntersectionObserver pause | GSAP ticker.add pattern; Three.js dispose traversal; IntersectionObserver pattern in hero-mesh.tsx |
| GEN-04 | All WebGL components load via `next/dynamic({ ssr: false })` in `'use client'` wrapper; bundle validated under 200KB | GlobalEffectsLazy pattern already in codebase; @next/bundle-analyzer; transpilePackages |
| GEN-05 | `matchMedia('prefers-reduced-motion')` guard on every canvas/WebGL component; static fallback; ARIA role | hero-mesh.tsx and lenis-provider.tsx demonstrate the exact pattern; 22 existing consumers |
</phase_requirements>

---

## Summary

Phase 6 is pure plumbing: install Three.js, establish the singleton `SignalCanvas` renderer, extract the OKLCH color bridge into a shared utility, build the `useSignalScene` hook, SSR-proof all WebGL imports, and enforce reduced-motion guards. No generative scenes are built. The infrastructure must be invisible to Lighthouse (100/100, <200KB initial) and survive React StrictMode double-mounts, route transitions, and OS-level reduced-motion toggles.

The critical insight is that browsers hard-cap WebGL contexts at ~8–16 per page. If each canvas component creates its own `WebGLRenderer`, a multi-scene portfolio page will exhaust that limit and silently fail on some scenes. The Three.js official solution is to mount a single full-viewport canvas, use `setScissorTest + setScissor + setViewport` to paint only the rectangle occupied by each virtual scene element, and drive the entire loop from a single GSAP ticker callback. This is architecturally identical to how `GlobalEffectsLazy` and `LenisProvider` share the GSAP ticker already in use.

The OKLCH→sRGB probe is already solved in `canvas-cursor.tsx` (lines 38–58). `lib/color-resolve.ts` is a direct extraction with a module-level cache, a refresh-on-theme-change listener, and a typed API that the color bridge consumers import.

**Primary recommendation:** Use a `globalThis`-keyed singleton for `SignalCanvas` (matching the `useScrambleText` HMR pattern), drive renders exclusively via `gsap.ticker.add()`, and wire reduced-motion as a `matchMedia` listener that cancels the ticker callback and renders one static frame.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `three` | ^0.176.0 (latest stable) | 3D scene graph, WebGLRenderer, geometry, materials | Project decision; raw Three.js chosen explicitly over R3F to avoid rAF conflict with GSAP |
| `@types/three` | ^0.176.0 | TypeScript definitions for three | Ships separately from three; must match major |
| `@next/bundle-analyzer` | ^15.x | Visual treemap to verify Three.js lands in async chunk | Standard Next.js auditing tool |

**Note on versions:** Three.js latest as of research is r176/0.176.x. `@types/three` latest is 0.183.x (DefinitelyTyped ships slightly ahead). Install with matching major. Always pin `@types/three` to same major as `three`.

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `gsap` (already installed) | ^3.12.7 | `gsap.ticker.add()` as render driver | Already in project; drives WebGL render loop instead of `rAF` or `setAnimationLoop` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Raw Three.js | @react-three/fiber | R3F's independent rAF loop conflicts with `gsap.globalTimeline.timeScale(0)` — explicitly excluded per REQUIREMENTS.md |
| GSAP ticker | `WebGLRenderer.setAnimationLoop` | setAnimationLoop runs independently of GSAP timeline; using it breaks GSAP globalTimeline scalar for reduced-motion |
| GSAP ticker | `requestAnimationFrame` directly | Same problem — desynchronized from GSAP animations |
| Scissor/viewport singleton | One renderer per component | Context exhaustion: browsers limit to ~8–16 WebGL contexts per page |
| Sync probe for color resolve | CSS Color Level 5 API | `CSS.supports()` and typed OM are not yet widely supported enough; probe technique is already validated in codebase |

**Installation:**
```bash
npm install three @types/three
npm install --save-dev @next/bundle-analyzer
```

---

## Architecture Patterns

### Recommended Project Structure
```
lib/
├── signal-canvas.ts         # GEN-01: Singleton SignalCanvas renderer + scene registry
├── color-resolve.ts         # GEN-02: OKLCH→sRGB probe utility with cache
hooks/
├── use-signal-scene.ts      # GEN-03: Disposal + GSAP ticker + IntersectionObserver
components/
├── layout/
│   ├── signal-canvas-lazy.tsx   # GEN-04: next/dynamic({ ssr: false }) wrapper
```

### Pattern 1: Singleton SignalCanvas (GEN-01)

**What:** One `WebGLRenderer` instance stored on `globalThis`, keyed with a project-specific symbol. Components register themselves as "scenes" with a DOM element reference and a render callback. The singleton's GSAP ticker callback iterates all registered scenes, checks their bounding rect, applies scissor/viewport, and calls each scene's render function.

**When to use:** Every route/page that wants 3D WebGL content mounts `SignalCanvasLazy` and registers scenes via `useSignalScene`.

**The globalThis pattern** — identical to `useScrambleText`'s HMR-safe state:

```typescript
// Source: lib/signal-canvas.ts
// Mirrors the pattern from hooks/use-scramble-text.ts lines 23-32

const SIGNAL_KEY = "__sf_signal_canvas" as const;

type SignalCanvasState = {
  renderer: THREE.WebGLRenderer | null;
  canvas: HTMLCanvasElement | null;
  scenes: Map<string, SceneEntry>;
  tickerCallback: ((time: number, deltaTime: number) => void) | null;
};

function getSignalState(): SignalCanvasState {
  const g = globalThis as unknown as Record<string, SignalCanvasState | undefined>;
  if (!g[SIGNAL_KEY]) {
    g[SIGNAL_KEY] = { renderer: null, canvas: null, scenes: new Map(), tickerCallback: null };
  }
  return g[SIGNAL_KEY]!;
}
```

**Scissor/viewport render loop:**

```typescript
// Source: https://threejs.org/manual/en/multiple-scenes.html
function renderAllScenes(renderer: THREE.WebGLRenderer) {
  renderer.setScissorTest(false);
  renderer.clear();
  renderer.setScissorTest(true);

  for (const [, entry] of state.scenes) {
    if (!entry.visible) continue; // IntersectionObserver gate
    const rect = entry.element.getBoundingClientRect();
    const { left, bottom, width, height } = rect;
    const canvasBottom = renderer.domElement.clientHeight - bottom;

    renderer.setScissor(left, canvasBottom, width, height);
    renderer.setViewport(left, canvasBottom, width, height);
    entry.renderFn(entry.scene, entry.camera);
  }
}
```

**CRITICAL: coordinate system.** Three.js `setScissor`/`setViewport` use Y-up coordinates (origin at bottom-left). `getBoundingClientRect()` gives Y-down (origin at top-left). Convert with: `canvasBottom = canvas.clientHeight - rect.bottom`.

**Canvas sizing — fixed, full-viewport:**

```typescript
// Canvas must cover full viewport. Resize on window resize.
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // cap at 2× for perf
```

### Pattern 2: GSAP Ticker as Render Driver (GEN-01 + GEN-03)

**What:** `gsap.ticker.add(callback)` — callback receives `(time, deltaTime, frame)`. Call `renderer.render()` inside it. Never call `renderer.setAnimationLoop()`.

```typescript
// Source: https://gsap.com/docs/v3/GSAP/gsap.ticker/
// Mirrors lenis-provider.tsx pattern (lines 25-28)
import { gsap } from "@/lib/gsap-core";

const tickerCallback = () => renderAllScenes(renderer);
gsap.ticker.add(tickerCallback);

// Cleanup (mirrors lenis-provider.tsx line 34):
gsap.ticker.remove(tickerCallback);
```

**Why this works with reduced-motion:** When `gsap.globalTimeline.timeScale(0)` is called by any external motion guard, the ticker still fires but at paused time — `useSignalScene` checks `prefersReducedMotion` on the callback to skip drawing or render a static frame. This is the correct integration point.

### Pattern 3: OKLCH→sRGB Color Bridge (GEN-02)

**What:** Extract the probe technique already written in `canvas-cursor.tsx` (lines 38–58) into a cacheable module. Three.js `Color` constructor and Canvas 2D `fillStyle` both accept `rgb(r,g,b)` strings but NOT `oklch()` values. The probe resolves this without any third-party color math library.

```typescript
// Source: extracted from components/animation/canvas-cursor.tsx lines 38-58
// lib/color-resolve.ts

type RGB = { r: number; g: number; b: number };

// Module-level cache — survives across hook calls on same page
const cache = new Map<string, RGB>();

export function resolveColorToken(token: string): RGB {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();

  if (cache.has(raw)) return cache.get(raw)!;

  const probe = document.createElement("canvas");
  probe.width = 1;
  probe.height = 1;
  const ctx = probe.getContext("2d")!;
  ctx.fillStyle = raw;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  const result = { r, g, b };
  cache.set(raw, result);
  return result;
}

export function resolveColorAsThreeColor(token: string): THREE.Color {
  const { r, g, b } = resolveColorToken(token);
  return new THREE.Color(r / 255, g / 255, b / 255);
}

// Call on theme change to bust cache — wire to color-cycle-frame's setProperty events
export function bustColorCache(): void {
  cache.clear();
}
```

**Cache invalidation:** `color-cycle-frame.tsx` mutates `--color-primary` via `setProperty`. The color bridge must either re-probe on each use (no cache) or listen for theme change. Recommended: invalidate cache on `'sf-theme-change'` custom event or observe `MutationObserver` on `document.documentElement` style. The simpler approach for Phase 6: no cache, just probe on each Three.js render tick for the handful of tokens in use. Optimize to cache-with-invalidation in Phase 8 when scene count grows.

### Pattern 4: SSR-Safe Dynamic Import (GEN-04)

**What:** Mirror `GlobalEffectsLazy` exactly. The wrapper file uses `'use client'` + `next/dynamic({ ssr: false })`. This is the **only** pattern that satisfies Next.js 15's constraint that `ssr: false` cannot be called from a Server Component.

```typescript
// Source: components/layout/global-effects-lazy.tsx (direct mirror)
// components/layout/signal-canvas-lazy.tsx
"use client";

import dynamic from "next/dynamic";

const SignalCanvas = dynamic(
  () => import("@/lib/signal-canvas").then((m) => m.SignalCanvas),
  { ssr: false }
);

export function SignalCanvasLazy() {
  return <SignalCanvas />;
}
```

Mount in `app/layout.tsx` alongside `GlobalEffectsLazy`:
```tsx
// After <GlobalEffectsLazy /> in layout.tsx body
<SignalCanvasLazy />
```

**`transpilePackages` for Three.js:** The `next/dynamic({ ssr: false })` guard prevents `window is not defined` errors without needing `transpilePackages: ['three']`. Add `transpilePackages` only if TypeScript/import errors appear during `next build`. Turbopack has known issues with `transpilePackages` in monorepo scenarios (GitHub issue #63230) — avoid it unless needed. Do not configure it pre-emptively.

### Pattern 5: Reduced-Motion Guard (GEN-05)

**What:** `matchMedia('(prefers-reduced-motion: reduce)')` guard with a `change` listener. When reduced-motion is active: remove the GSAP ticker callback, render one static frame (first frame of animation, no loop), and set `aria-label` on the canvas element.

This pattern is established in 22 existing components. The hero-mesh.tsx pattern (lines 52–60) is the closest reference:

```typescript
// Source: components/animation/hero-mesh.tsx lines 52-60 (adapted for GSAP ticker)
const mql = window.matchMedia("(prefers-reduced-motion: reduce)");

function handleMotionChange(e: MediaQueryListEvent) {
  if (e.matches) {
    // Remove from ticker — GSAP continues but canvas stops updating
    gsap.ticker.remove(state.tickerCallback!);
    // Render one static frame
    renderAllScenes(renderer);
  } else {
    gsap.ticker.add(state.tickerCallback!);
  }
}

mql.addEventListener("change", handleMotionChange);
// Cleanup:
mql.removeEventListener("change", handleMotionChange);
```

**ARIA pattern for canvas:**
```tsx
// Canvas element in SignalCanvas component
<canvas
  ref={canvasRef}
  aria-label="Generative visual — decorative"
  role="img"
  style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: "var(--z-canvas, -1)" }}
/>
```
When reduced-motion is active, add `aria-hidden="true"` and remove `role="img"` since the static frame is purely decorative.

### Pattern 6: Dispose Traversal (GEN-03)

**What:** Three.js does NOT garbage-collect GPU resources automatically. On scene unmount, traverse the scene graph and call `.dispose()` on geometry, materials, and textures.

```typescript
// Source: Three.js dispose documentation + discourse.threejs.org/t/dispose-things-correctly
function disposeScene(scene: THREE.Scene): void {
  scene.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;

    object.geometry?.dispose();

    const materials = Array.isArray(object.material)
      ? object.material
      : [object.material];

    for (const mat of materials) {
      if (!mat) continue;
      // Dispose all texture maps
      for (const key of Object.keys(mat)) {
        const value = (mat as Record<string, unknown>)[key];
        if (value instanceof THREE.Texture) value.dispose();
      }
      mat.dispose();
    }
  });
}
```

**The renderer itself is NOT disposed on scene unmount** — it's a singleton. Only dispose the renderer when the entire SignalCanvas component unmounts (i.e., the app is torn down). Unmounting a route should only deregister the scene entry and call `disposeScene`.

### Anti-Patterns to Avoid

- **One renderer per component:** Context exhaustion. Browsers hard-limit ~8–16 WebGL contexts. Use the singleton.
- **`renderer.setAnimationLoop()` instead of GSAP ticker:** Runs independently of GSAP timeline; breaks `globalTimeline.timeScale(0)` reduced-motion mechanism already in use by Lenis.
- **`requestAnimationFrame` in scene hook:** Same problem as setAnimationLoop. Everything goes through `gsap.ticker`.
- **Calling `renderer.dispose()` on route change:** Destroys the singleton. Only the scene objects are disposed on unmount.
- **Importing `three` in a Server Component:** Causes `window is not defined`. All Three.js code must live behind `'use client'` boundary and `next/dynamic({ ssr: false })`.
- **Resolving OKLCH in Three.js uniform directly:** `THREE.Color('oklch(0.65 0.3 350)')` silently produces black. Always go through `lib/color-resolve.ts`.
- **Caching color tokens without invalidation:** `color-cycle-frame.tsx` dynamically mutates `--color-primary`. Cached sRGB values go stale on color cycle. Phase 6: no cache or listen for mutation.
- **Y-up vs Y-down coordinate confusion:** `getBoundingClientRect().bottom` is Y-down. Three.js scissor Y is Y-up. Always convert: `canvasBottom = canvas.clientHeight - rect.bottom`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scene graph disposal | Custom recurse-and-dispose | `scene.traverse()` + instanceof checks | Three.js traverse handles nested Object3D correctly; custom recursion misses instanced meshes |
| OKLCH→sRGB | Color math library (culori, chroma-js) | 1×1 canvas probe (already in codebase) | Zero bundle cost; uses browser's own color engine; already validated in production |
| Animation sync | Custom RAF loop | `gsap.ticker.add()` | GSAP ticker is already the project's global heartbeat; adding a second RAF loop desynchronizes WebGL with all existing GSAP animations |
| WebGL context management | Custom context pool | Scissor/viewport singleton | Three.js official pattern; proven against browser context limits |
| Bundle size validation | Manual size check | `@next/bundle-analyzer` | Visual treemap shows exactly which async chunk contains Three.js; one command: `ANALYZE=true npm run build` |

**Key insight:** Every "custom solution" listed above is solved by either the existing codebase pattern (probe technique, GSAP ticker) or official Three.js documentation (scissor/viewport, traverse). Phase 6 is about wiring existing primitives together, not building new ones.

---

## Common Pitfalls

### Pitfall 1: Y-axis Inversion in Scissor/Viewport
**What goes wrong:** Scenes render in wrong vertical position or at bottom of canvas instead of where the DOM element is.
**Why it happens:** `getBoundingClientRect()` measures from top-left (Y increases downward). Three.js scissor/viewport use bottom-left origin (Y increases upward).
**How to avoid:** Always convert: `const canvasBottom = renderer.domElement.clientHeight - rect.bottom;`
**Warning signs:** Scene appears mirrored vertically or displaced by `rect.height`.

### Pitfall 2: `window is not defined` on `next build`
**What goes wrong:** Build fails with SSR error; Three.js or color-resolve code runs on server.
**Why it happens:** Next.js App Router runs Server Components on Node.js where `window` is undefined. Three.js imports `window` at module evaluation time.
**How to avoid:** All Three.js imports must be in files with `'use client'` directive, loaded via `next/dynamic({ ssr: false })`. Never import `three` in a Server Component or any file that might be imported by one.
**Warning signs:** Error in `next build` output; works in `next dev` but fails in production build.

### Pitfall 3: GSAP Ticker Not Removed on Unmount
**What goes wrong:** After route navigation away from a page with a canvas scene, the ticker callback continues to fire, trying to render to a detached canvas.
**Why it happens:** GSAP ticker is global and persistent. React lifecycle cleanup (`useEffect` return) must explicitly remove the callback.
**How to avoid:** Every `useSignalScene` call returns a cleanup function that calls `gsap.ticker.remove(tickerCallback)` and deregisters the scene from the singleton.
**Warning signs:** Console errors about null canvas refs; GPU performance doesn't recover after navigation.

### Pitfall 4: Color Cache Staleness
**What goes wrong:** Canvas renders with wrong color after user triggers color cycle (scroll on `ColorCycleFrame`).
**Why it happens:** `color-cycle-frame.tsx` calls `document.documentElement.style.setProperty("--color-primary", ...)` which changes the CSS token but not any JS-land cached value.
**How to avoid:** For Phase 6, do not cache color resolves. Probe on each use. In Phase 8, add `MutationObserver` on `documentElement.style` to bust cache on property changes.
**Warning signs:** Canvas shows stale primary color after user scrolls on the hero heading.

### Pitfall 5: Double-Mount in React StrictMode
**What goes wrong:** Singleton `SignalCanvas` is initialized twice in development; two WebGL contexts created; one is leaked.
**Why it happens:** React StrictMode double-invokes `useEffect` in development. The first mount creates a renderer, the cleanup function destroys it, the second mount creates another.
**How to avoid:** The `globalThis` singleton pattern handles this: cleanup should call `gsap.ticker.remove()` and deregister scenes but NOT call `renderer.dispose()` unless all scenes are deregistered. Check `state.scenes.size === 0` before disposing renderer.
**Warning signs:** Dev tools show two WebGL contexts; works in production but not in `next dev`.

### Pitfall 6: `setAnimationLoop` vs GSAP Ticker Conflict
**What goes wrong:** WebGL renders at wrong time or creates two render cycles.
**Why it happens:** Calling `renderer.setAnimationLoop(fn)` starts an internal RAF loop independent of GSAP. If also registered with `gsap.ticker`, the scene renders twice per frame.
**How to avoid:** Never call `renderer.setAnimationLoop()`. Use only `gsap.ticker.add()`. Verify by checking `renderer.info.render.frame` increments exactly once per RAF.
**Warning signs:** `renderer.info.render.frame` increments by 2 per RAF; GPU usage doubled; animations appear to render at wrong phase relative to GSAP tweens.

### Pitfall 7: `transpilePackages: ['three']` with Turbopack
**What goes wrong:** `transpilePackages` for Three.js may silently fail with Turbopack (known issue: GitHub vercel/next.js#63230 and #85316).
**Why it happens:** Turbopack has partial/broken support for `transpilePackages` in some configurations as of 2025.
**How to avoid:** Do NOT add `transpilePackages: ['three']` pre-emptively. The `next/dynamic({ ssr: false })` guard is sufficient to prevent SSR errors. Add `transpilePackages` only if you see TypeScript compilation errors in `next build` that cannot be resolved another way. If needed, test with `next build` (Webpack), not `next dev --turbopack`.
**Warning signs:** Build succeeds with webpack but fails with `--turbopack` after adding `transpilePackages`.

---

## Code Examples

Verified patterns from official sources and existing codebase:

### Full SignalCanvas Singleton Init
```typescript
// Source: lib/signal-canvas.ts
// Pattern: globalThis HMR-safe key (mirrors use-scramble-text.ts)
// + Three.js scissor/viewport (https://threejs.org/manual/en/multiple-scenes.html)
"use client";

import * as THREE from "three";
import { gsap } from "@/lib/gsap-core";

const SIGNAL_KEY = "__sf_signal_canvas" as const;

type SceneEntry = {
  element: HTMLElement;
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderFn: (scene: THREE.Scene, camera: THREE.Camera) => void;
  visible: boolean;
};

type SignalCanvasState = {
  renderer: THREE.WebGLRenderer | null;
  canvas: HTMLCanvasElement | null;
  scenes: Map<string, SceneEntry>;
  tickerCallback: (() => void) | null;
  reducedMotion: boolean;
  mql: MediaQueryList | null;
};

function getState(): SignalCanvasState {
  const g = globalThis as unknown as Record<string, SignalCanvasState | undefined>;
  if (!g[SIGNAL_KEY]) {
    g[SIGNAL_KEY] = {
      renderer: null, canvas: null, scenes: new Map(),
      tickerCallback: null, reducedMotion: false, mql: null,
    };
  }
  return g[SIGNAL_KEY]!;
}

export function initSignalCanvas(canvas: HTMLCanvasElement): void {
  const state = getState();
  if (state.renderer) return; // already initialized

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false, // perf: disable for pixel-art DU/TDR aesthetic
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  state.renderer = renderer;
  state.canvas = canvas;

  // Reduced-motion setup
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  state.mql = mql;
  state.reducedMotion = mql.matches;

  const tickerCallback = () => {
    if (state.reducedMotion) return;
    renderAll(state);
  };
  state.tickerCallback = tickerCallback;

  const motionHandler = (e: MediaQueryListEvent) => {
    state.reducedMotion = e.matches;
    if (e.matches) {
      gsap.ticker.remove(tickerCallback);
      renderAll(state); // one static frame
    } else {
      gsap.ticker.add(tickerCallback);
    }
  };
  mql.addEventListener("change", motionHandler);

  if (!mql.matches) {
    gsap.ticker.add(tickerCallback);
  } else {
    renderAll(state); // initial static frame
  }

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, { passive: true });
}
```

### useSignalScene Hook Skeleton
```typescript
// Source: hooks/use-signal-scene.ts
// Disposal pattern: https://discourse.threejs.org/t/dispose-things-correctly/6534
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { registerScene, deregisterScene } from "@/lib/signal-canvas";

export function useSignalScene(
  elementRef: React.RefObject<HTMLElement>,
  buildScene: () => { scene: THREE.Scene; camera: THREE.Camera }
) {
  const idRef = useRef(crypto.randomUUID());

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const { scene, camera } = buildScene();

    const observer = new IntersectionObserver(([entry]) => {
      // setSceneVisibility will enable/disable rendering in the singleton loop
      setSceneVisibility(idRef.current, entry.isIntersecting);
    }, { threshold: 0 });
    observer.observe(element);

    registerScene(idRef.current, { element, scene, camera, visible: true });

    return () => {
      observer.disconnect();
      deregisterScene(idRef.current);
      disposeScene(scene); // GPU cleanup
    };
  }, []); // intentionally empty — runs once per mount
}

function disposeScene(scene: THREE.Scene): void {
  scene.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.geometry?.dispose();
    const mats = Array.isArray(object.material) ? object.material : [object.material];
    for (const mat of mats) {
      if (!mat) continue;
      for (const val of Object.values(mat as Record<string, unknown>)) {
        if (val instanceof THREE.Texture) val.dispose();
      }
      mat.dispose();
    }
  });
}
```

### OKLCH→sRGB Color Resolve
```typescript
// Source: lib/color-resolve.ts
// Extracted from: components/animation/canvas-cursor.tsx lines 38-58
"use client";

import * as THREE from "three";

export type RGB = { r: number; g: number; b: number };

export function resolveColorToken(cssVar: string): RGB {
  // No cache in Phase 6 — color-cycle-frame.tsx mutates --color-primary dynamically
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(cssVar)
    .trim();

  const probe = document.createElement("canvas");
  probe.width = 1;
  probe.height = 1;
  const ctx = probe.getContext("2d")!;
  ctx.fillStyle = raw;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return { r, g, b };
}

export function resolveColorAsThreeColor(cssVar: string): THREE.Color {
  const { r, g, b } = resolveColorToken(cssVar);
  return new THREE.Color(r / 255, g / 255, b / 255);
}
```

### Bundle Analyzer Setup
```typescript
// Source: https://www.npmjs.com/package/@next/bundle-analyzer
// next.config.ts
import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default bundleAnalyzer(nextConfig);
```

Run: `ANALYZE=true npm run build` — opens `client.html` treemap showing Three.js chunk isolation.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| One `WebGLRenderer` per canvas component | Single renderer with scissor/viewport | Three.js r125+ | Prevents context exhaustion on multi-scene pages |
| `requestAnimationFrame` directly | `gsap.ticker.add()` | GSAP 3.x established | WebGL renders in sync with all GSAP animations; `globalTimeline.timeScale(0)` affects canvas too |
| `renderer.setAnimationLoop()` | Explicit `gsap.ticker.add()` | Architectural choice | `setAnimationLoop` is a hidden RAF that bypasses GSAP timeline control |
| `@types/three` separate from `three` | Still separate, must version-match | Ongoing | `@types/three` 0.183.x covers three 0.176.x — install both |
| `transpilePackages: ['three']` as required | Only needed if build errors appear | Next.js 13+ improvements | `next/dynamic({ ssr: false })` alone prevents SSR errors; `transpilePackages` has Turbopack issues |

**Deprecated/outdated:**
- `renderer.gammaOutput`: Removed in Three.js r127. Use `renderer.outputColorSpace = THREE.SRGBColorSpace` instead.
- `THREE.WebGLRenderer({ antialias: true })` for all scenes: Costly for pixel-art / DU/TDR aesthetic. Set `antialias: false` for this project.

---

## Open Questions

1. **Turbopack GLSL import support**
   - What we know: The project's STATE.md flags this: "Turbopack `experimental.turbopack.rules` for GLSL files — validate in Phase 6"
   - What's unclear: Whether Turbopack 15.3 handles `.glsl` raw-loader reliably for template literal import
   - Recommendation: Phase 6 does not build any GLSL shaders. Do not validate GLSL import in Phase 6. Defer to Phase 9 (SCN-03, SCN-04). Use template literal strings for any shader snippets in Phase 6 tests.

2. **Lenis + GSAP ticker ordering with Three.js**
   - What we know: Lenis updates scroll via `gsap.ticker.add(tickerCallback)`. Three.js render will also be registered via `gsap.ticker.add()`. GSAP ticker fires multiple callbacks in registration order.
   - What's unclear: Whether render order matters (Lenis scroll update → Three.js render vs. Three.js render → Lenis update)
   - Recommendation: Register Three.js render callback AFTER Lenis registers its callback. Lenis runs first, then Three.js captures the updated scroll position for any scroll-reactive uniforms. This is the same ordering used in the GSAP + Lenis integration guide.

3. **`color-cycle-frame.tsx` TypeScript error at line 79**
   - What we know: STATE.md flags a pre-existing TypeScript error at `color-cycle-frame.tsx:79`
   - What's unclear: Nature of the error — may be a null-check issue on `wipeEl` reference
   - Recommendation: Investigate during Wave 0 of Phase 6 planning. If the error is benign (type assertion issue, not a runtime bug), document it in a code comment and leave it. If it affects the `color-resolve.ts` extraction, fix it as part of GEN-02 plan.

---

## Validation Architecture

`workflow.nyquist_validation` key absent from `.planning/config.json` — treat as enabled.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected in codebase |
| Config file | None — Wave 0 gap |
| Quick run command | `npm run build 2>&1 \| grep -E "(error\|warning\|✓\|✗)"` |
| Full suite command | `ANALYZE=true npm run build` |

**Note:** This project has no unit test framework installed. Validation for Phase 6 is structural: `next build` zero errors + bundle analysis confirming Three.js in async chunk + browser devtools confirming single WebGL context + OS reduced-motion toggle test.

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| GEN-01 | Single WebGL context across multiple route views | Manual (browser devtools) | — open devtools GPU panel, navigate 3 routes, confirm 1 context | ❌ manual only |
| GEN-02 | `resolveColorToken('--color-primary')` returns sRGB matching adjacent CSS | Manual (visual) | — render component, compare canvas color to CSS text color | ❌ manual only |
| GEN-03 | Scene disposes GPU resources on unmount; offscreen pause works | Manual (devtools memory snapshot) | — navigate away, check Memory panel for no growth | ❌ manual only |
| GEN-04 | `next build` zero `window is not defined` errors; Three.js in async chunk | Automated build | `npm run build 2>&1 \| grep "window is not defined"` must return 0 lines | ✅ via build |
| GEN-05 | Reduced-motion OS toggle → no animation loop running | Manual (OS setting + devtools) | — enable OS reduced-motion, confirm no RAF in Performance tab | ❌ manual only |

### Sampling Rate
- **Per task commit:** `npm run build` — confirms zero SSR errors
- **Per wave merge:** `ANALYZE=true npm run build` — confirm Three.js in async chunk, initial bundle < 200KB
- **Phase gate:** Full build green + manual WebGL context count = 1 before `/pde:verify-work`

### Wave 0 Gaps
- [ ] No unit test framework — GEN-01 through GEN-05 rely on build-time + manual browser verification
- [ ] `ANALYZE=true npm run build` requires `@next/bundle-analyzer` installed and `next.config.ts` updated — this is Wave 1 work (GEN-04 plan)

*(All phase validation is manual + build-based. No `.test.ts` files needed for this infrastructure phase.)*

---

## Sources

### Primary (HIGH confidence)
- [Three.js Manual — Multiple Scenes](https://threejs.org/manual/en/multiple-scenes.html) — scissor/viewport singleton pattern, coordinate system, render loop structure
- [Three.js Docs — WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html) — constructor options, setScissor, setViewport, setScissorTest, dispose API
- Existing codebase — `canvas-cursor.tsx` (probe technique, lines 38–58), `use-scramble-text.ts` (globalThis HMR pattern), `lenis-provider.tsx` (GSAP ticker integration), `hero-mesh.tsx` (reduced-motion + IntersectionObserver pattern), `global-effects-lazy.tsx` (next/dynamic SSR-false pattern)

### Secondary (MEDIUM confidence)
- [GSAP ticker docs](https://gsap.com/docs/v3/GSAP/gsap.ticker/) — ticker.add/remove API, sync with renderer
- [@next/bundle-analyzer npm](https://www.npmjs.com/package/@next/bundle-analyzer) — setup, ANALYZE=true command, output files
- [Codrops 2026 — GSAP + Three.js + Lenis integration](https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/) — confirms GSAP-as-ticker-for-three pattern in production 2026 projects

### Tertiary (LOW confidence)
- [Three.js forum — dispose correctly](https://discourse.threejs.org/t/dispose-things-correctly-in-three-js/6534) — disposal traversal patterns (needs cross-check with current Three.js docs)
- GitHub vercel/next.js #63230 — Turbopack `transpilePackages` gap (open issue, current status may have changed)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Three.js is an explicit project decision; GSAP ticker is already in use; versions verified
- Architecture: HIGH — scissor/viewport pattern from official Three.js manual; globalThis pattern mirrors existing codebase; GSAP ticker integration mirrors lenis-provider.tsx directly
- Pitfalls: HIGH — Y-axis inversion and context exhaustion from official docs; StrictMode double-mount from known React behavior; color cache staleness from reading existing color-cycle-frame.tsx code
- Disposal: MEDIUM — traversal pattern from Three.js forum + Medium articles; not in Context7

**Research date:** 2026-04-05
**Valid until:** 2026-05-05 (Three.js stable; Next.js 15.3 stable; GSAP 3.12 stable — 30-day window)
