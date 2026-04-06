---
phase: 06-generative-signal-foundation
plan: 02
subsystem: signal-infrastructure
tags: [webgl-singleton, gsap-ticker, reduced-motion, intersection-observer, scene-lifecycle]
dependency_graph:
  requires:
    - lib/color-resolve.ts (from 06-01, OKLCH bridge for future scene consumers)
    - components/layout/signal-canvas-lazy.tsx (from 06-01, dynamic import wrapper)
    - lib/gsap-core.ts (GSAP ticker as render driver)
  provides:
    - lib/signal-canvas.tsx (singleton renderer — all future WebGL scenes plug into this)
    - hooks/use-signal-scene.ts (scene registration + disposal + visibility hook)
    - app/layout.tsx (SignalCanvasLazy mounted in RootLayout)
  affects:
    - app/layout.tsx (SignalCanvasLazy added after GlobalEffectsLazy)
    - All future Phase 8/9 scene components (consume useSignalScene hook)
tech_stack:
  added: []
  patterns:
    - globalThis singleton (HMR-safe, mirrors use-scramble-text.ts pattern)
    - GSAP ticker as WebGL render driver (gsap.ticker.add — never setAnimationLoop)
    - scissor/viewport Y-axis inversion for multi-scene rendering
    - IntersectionObserver offscreen pause (mirrors hero-mesh.tsx pattern)
    - next/dynamic ssr:false for WebGL components (confirmed working)
key_files:
  created:
    - lib/signal-canvas.tsx
    - hooks/use-signal-scene.ts
  modified:
    - app/layout.tsx
decisions:
  - "signal-canvas.tsx not .ts — React component (JSX) in lib/ requires .tsx extension; Next.js module resolution handles @/lib/signal-canvas alias correctly"
  - "GSAP ticker drives all WebGL rendering — never setAnimationLoop or raw rAF, enforcing GSAP globalTimeline scalar correctness"
  - "disposeScene separated from deregisterScene — hook calls both; consumers must call both or GPU memory leaks"
metrics:
  duration_seconds: 227
  tasks_completed: 3
  tasks_total: 3
  files_created: 2
  files_modified: 1
  lines_added: 338
  completed_date: "2026-04-06"
requirements_completed: [GEN-01, GEN-03, GEN-05]
---

# Phase 6 Plan 2: Singleton SignalCanvas Renderer + useSignalScene Hook Summary

**One-liner:** globalThis-keyed WebGLRenderer singleton with scissor/viewport multi-scene rendering, GSAP ticker drive, reduced-motion static fallback, and IntersectionObserver offscreen pause.

## Objective

Build the core WebGL infrastructure that all future generative scenes plug into. A single `WebGLRenderer` mounts in `RootLayout` and paints multiple virtual scenes by scissoring its viewport to each scene component's `getBoundingClientRect()`. The GSAP ticker is the sole render driver. Reduced-motion users get one static frame. Offscreen scenes are paused via `IntersectionObserver`.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create lib/signal-canvas.tsx | 26f0861 | lib/signal-canvas.tsx (created, 258 lines) |
| 2 | Create hooks/use-signal-scene.ts | d120beb | hooks/use-signal-scene.ts (created, 78 lines) |
| 3 | Mount SignalCanvasLazy in layout + build | 78c957b | app/layout.tsx (modified, +2 lines) |

## Key Decisions Made

**signal-canvas.tsx extension (not .ts):** The file contains a React component with JSX. TypeScript/Next.js require `.tsx` for JSX syntax. The plan specified `.ts` but the correct extension is `.tsx`. The `@/lib/signal-canvas` path alias resolves both, confirmed by successful build.

**GSAP ticker as render driver:** `gsap.ticker.add(tickerCallback)` is called in `initSignalCanvas`. The ticker callback skips rendering when `reducedMotion` is true or `scenes.size === 0`. This ensures Three.js renders are fully synchronised with GSAP's timeline — critical for `gsap.globalTimeline.timeScale(0)` (reduced-motion) to suppress Three.js animation exactly.

**disposeScene vs deregisterScene separation:** `deregisterScene(id)` removes the entry from the singleton Map. `disposeScene(scene)` traverses the scene graph and calls `.dispose()` on all geometries, materials, and textures. The hook calls both in sequence. This separation allows future use cases where a scene needs to be deregistered without GPU disposal (e.g., temporarily hidden but held in memory).

**Static frame for reduced-motion:** When `matchMedia("(prefers-reduced-motion: reduce)").matches` is true at init, `renderAllScenes` is called once immediately after renderer creation. When the user toggles motion at runtime, `gsap.ticker.remove(tickerCallback)` stops the loop and `renderAllScenes` fires one final frame.

**Render loop Y-axis conversion:** `getBoundingClientRect()` is Y-down (top-left origin). Three.js `setScissor` / `setViewport` are Y-up (bottom-left origin). Conversion: `canvasY = renderer.domElement.clientHeight - rect.bottom`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] JSX in lib/signal-canvas.ts requires .tsx extension**
- **Found during:** Task 3 — build failed with `Expected '>', got 'ref'` SWC parse error
- **Issue:** Next.js 15 / Turbopack does not parse JSX in `.ts` files. The plan artifact path listed `.ts` but the file contains a React component.
- **Fix:** Renamed `lib/signal-canvas.ts` → `lib/signal-canvas.tsx`. Import paths via `@/lib/signal-canvas` alias resolve both extensions; no downstream changes needed.
- **Files modified:** lib/signal-canvas.tsx (rename only, no content change)
- **Commit:** 78c957b (included in Task 3 commit)

## Acceptance Criteria Results

| AC | Description | Result |
|----|-------------|--------|
| AC-1 | globalThis singleton with `"__sf_signal_canvas"` key | PASS |
| AC-2 | GSAP ticker calls setScissor/setViewport with Y-axis inversion | PASS |
| AC-3 | prefers-reduced-motion skips ticker, renders one static frame | PASS |
| AC-4 | deregisterScene + disposeScene traverse/dispose GPU resources | PASS |
| AC-5 | Hook imports from @/lib/signal-canvas, uses IntersectionObserver | PASS |
| AC-6 | layout.tsx contains SignalCanvasLazy after GlobalEffectsLazy | PASS |
| AC-7 | SignalCanvas canvas element has role="img" and aria-label | PASS |
| AC-8 | npm run build exits 0 with zero errors | PASS |

## Build Output

```
Route (app)                                 Size  First Load JS
┌ ƒ /                                    8.88 kB         261 kB
├ ƒ /_not-found                            123 B         103 kB
├ ƒ /components                          4.41 kB         212 kB
├ ƒ /reference                           16.7 kB         225 kB
├ ƒ /start                                 364 B         208 kB
└ ƒ /tokens                              5.82 kB         214 kB
+ First Load JS shared by all             102 kB
```

Three.js lands in async chunk (loaded only when SignalCanvas mounts client-side). Initial shared bundle: 102 kB. Zero `window is not defined` SSR errors.

## Self-Check: PASSED

- lib/signal-canvas.tsx exists: FOUND
- hooks/use-signal-scene.ts exists: FOUND
- app/layout.tsx contains SignalCanvasLazy: FOUND
- Commits 26f0861, d120beb, 78c957b: FOUND
