---
phase: 08-first-generative-scenes
plan: 01
subsystem: ui
tags: [three-js, webgl, glsl, gsap, scroll-trigger, shader-material, icosahedron, color-resolve]

# Dependency graph
requires:
  - phase: 06-generative-signal-foundation
    provides: "SignalCanvas singleton renderer, useSignalScene hook, color-resolve.ts probe utility"
  - phase: 07-signal-activation
    provides: "GSAP ticker patterns, ticker-accumulation-guard, data-cursor placement"

provides:
  - "components/animation/signal-mesh.tsx: First WebGL 3D scene using SignalCanvas singleton"
  - "components/animation/signal-mesh-lazy.tsx: SSR-safe Client Component wrapper"
  - "lib/color-resolve.ts: Optional TTL cache with MutationObserver invalidation"
  - "app/page.tsx: Homepage renders SignalMesh in hero section via next/dynamic"

affects: [09-extended-scenes-integration, SCN-02, token-visualization, ASCII-shader]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "EdgesGeometry + LineSegments for clean icosahedron wireframe (not wireframe:true on ShaderMaterial)"
    - "Shader uniforms in useRef — accessible from ScrollTrigger + ticker closures"
    - "SSR-safe client wrapper: 'use client' component with next/dynamic({ ssr: false })"
    - "buildScene factory stores refs externally before returning { scene, camera }"
    - "Ticker-accumulation-guard: gsap.ticker.remove before gsap.ticker.add in useGSAP"

key-files:
  created:
    - components/animation/signal-mesh.tsx
    - components/animation/signal-mesh-lazy.tsx
  modified:
    - lib/color-resolve.ts
    - app/page.tsx

key-decisions:
  - "next/dynamic({ ssr: false }) cannot be used directly in Server Components (Next.js 15 restriction) — extract to a 'use client' wrapper file mirroring SignalCanvasLazy pattern"
  - "TTL cache default is no-cache — omitting options preserves Phase 6 behavior for color-cycle-frame.tsx"
  - "MutationObserver initialized lazily on first cached resolve — no cost if cache is never used"
  - "SignalMesh placed in hero section wrapper div in page.tsx; renders absolute inset-0 z-0 behind Hero content; HeroMesh (Canvas 2D) remains for layered effect"

patterns-established:
  - "SSR-safe WebGL pattern: create 'use client' lazy wrapper with next/dynamic({ ssr: false }), import named export via .then((m) => ({ default: m.Export }))"
  - "ShaderMaterial uniforms in useRef outside buildScene — allows ScrollTrigger + ticker to mutate without stale closures"
  - "EdgesGeometry for wireframe overlay: new THREE.EdgesGeometry(geo) + new THREE.LineSegments() gives clean icosahedron edges without triangulation diagonals"
  - "resolveColorAsThreeColor called once at buildScene time — never in render loop"

requirements-completed: [SCN-01]

# Metrics
duration: ~2min
completed: 2026-04-06
---

# Phase 8 Plan 01: SignalMesh Summary

**Wireframe icosahedron WebGL scene via SignalCanvas singleton: GLSL vertex displacement driven by GSAP ScrollTrigger, optional TTL cache in color-resolve.ts, SSR-safe via lazy wrapper pattern**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-04-06T08:34:50Z
- **Completed:** 2026-04-06T08:37:10Z
- **Tasks:** 2
- **Files modified:** 4 (2 created, 2 modified)

## Accomplishments

- SignalMesh WebGL component using SignalCanvas singleton with scissor/viewport rendering
- GLSL ShaderMaterial: vertex displacement along normals via uTime + uDisplacement uniforms; GSAP ScrollTrigger mutates uDisplacement directly from scroll progress (0-0.4 range); EdgesGeometry wireframe overlay for clean icosahedron edges
- color-resolve.ts TTL cache with MutationObserver invalidation on :root class/style changes; no-cache default preserves existing behavior
- Homepage hero section renders SignalMesh via SSR-safe Client Component lazy wrapper; pnpm build exits 0, Three.js in async chunk (10.2 kB initial bundle for /)

## Task Commits

1. **Task 1: Add TTL cache to color-resolve.ts + create SignalMesh component** - `e164e59` (feat)
2. **Task 2: Place SignalMesh in homepage hero + build validation** - `a4e208d` (feat)

**Plan metadata:** (see state commit below)

## Files Created/Modified

- `components/animation/signal-mesh.tsx` — WebGL icosahedron scene: useSignalScene, ShaderMaterial, EdgesGeometry, ScrollTrigger, ResizeObserver, SVG fallback
- `components/animation/signal-mesh-lazy.tsx` — 'use client' wrapper with next/dynamic({ ssr: false })
- `lib/color-resolve.ts` — Added optional TTL cache with MutationObserver invalidation; backward-compatible API
- `app/page.tsx` — Import SignalMeshLazy, added to hero section wrapper with relative positioning

## Decisions Made

- **next/dynamic in Server Components blocked**: Next.js 15 disallows `{ ssr: false }` in Server Components. Extracted to a separate `'use client'` wrapper file (`signal-mesh-lazy.tsx`), mirroring the existing `SignalCanvasLazy` pattern. Page.tsx imports the wrapper, not the dynamic call directly.
- **TTL cache default is no-cache**: Omitting the `options` argument calls `probeColor()` directly on every invocation — preserving Phase 6 behavior for `color-cycle-frame.tsx` which mutates `--color-primary` dynamically. Cache is opt-in via `{ ttl: ms }`.
- **HeroMesh not removed**: The existing Canvas 2D dot grid in `hero.tsx` left panel remains. SignalMesh adds a second WebGL layer at the hero section level (`absolute inset-0 z-0` in the wrapper div). Both are low-opacity overlays creating a layered generative effect. Phase 9 can clean up if desired.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Extracted next/dynamic to Client Component wrapper**
- **Found during:** Task 2 (build validation)
- **Issue:** `ssr: false` is not allowed with `next/dynamic` in Server Components — Next.js 15 build error. `app/page.tsx` is a Server Component (no `'use client'`).
- **Fix:** Created `components/animation/signal-mesh-lazy.tsx` as a `'use client'` wrapper with the dynamic import inside. Updated `app/page.tsx` to import the wrapper instead. This mirrors the exact `SignalCanvasLazy` pattern already in the codebase.
- **Files modified:** app/page.tsx (removed inline dynamic), components/animation/signal-mesh-lazy.tsx (created)
- **Verification:** pnpm build exits 0 with zero errors
- **Committed in:** a4e208d (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 3 — blocking)
**Impact on plan:** Required for correctness — Next.js 15 enforces this boundary strictly. No scope creep; the fix follows the existing codebase pattern exactly.

## Issues Encountered

None beyond the auto-fixed blocking issue above.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- SCN-01 complete: SignalMesh validates the full Phase 6 WebGL pipeline (singleton renderer, GSAP ticker, scissor split, disposal contract) in a real production scene
- Browser verification needed: visit homepage, confirm icosahedron wireframe visible in hero, scroll to verify displacement, navigate away/back to confirm `renderer.info.memory.geometries` returns to baseline
- SCN-02 (Canvas 2D token visualization) and remaining Phase 8 plans can proceed
- TTL cache in color-resolve.ts available for all consumers that need stable colors across frames

## Self-Check: PASSED

- `components/animation/signal-mesh.tsx` — FOUND
- `components/animation/signal-mesh-lazy.tsx` — FOUND
- `lib/color-resolve.ts` — FOUND (TTL cache present)
- `app/page.tsx` — FOUND (SignalMesh imported)
- `.planning/phases/08-first-generative-scenes/08-01-SUMMARY.md` — FOUND
- Commit `e164e59` — FOUND (Task 1)
- Commit `a4e208d` — FOUND (Task 2)
- `pnpm build` — EXIT 0 (zero SSR errors, Three.js in async chunk)

---
*Phase: 08-first-generative-scenes*
*Completed: 2026-04-06*
