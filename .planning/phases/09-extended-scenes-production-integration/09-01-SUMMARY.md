---
phase: 09-extended-scenes-production-integration
plan: "01"
subsystem: animation / generative-surface
tags: [glsl, shader, webgl, bayer-dither, fbm-noise, signal-canvas, scrolltrigger, three-js]
dependency_graph:
  requires:
    - hooks/use-signal-scene (scene lifecycle, GPU disposal, IntersectionObserver)
    - lib/color-resolve (resolveColorAsThreeColor with TTL cache)
    - lib/signal-canvas (singleton renderer, scissor/viewport split)
    - lib/gsap-core (gsap, ScrollTrigger, useGSAP)
  provides:
    - components/animation/glsl-hero.tsx (GLSLHero — SCN-04 + SCN-03 combined)
    - components/animation/glsl-hero-lazy.tsx (SSR-safe wrapper)
  affects:
    - app/page.tsx (hero section uses GLSLHeroLazy instead of SignalMeshLazy)
    - app/components/page.tsx (SignalMesh icosahedron showcase added)
tech_stack:
  added: []
  patterns:
    - Full-screen quad: OrthographicCamera(-1,1,1,-1,0,1) + PlaneGeometry(2,2) fills NDC space
    - GLSL template literals in .tsx files (no raw-loader needed, confirmed stable with Turbopack)
    - uResolution uniform + ResizeObserver keeps fragment shader UV correct on container resize
    - Bayer 4x4 threshold via index arithmetic (GLSL array literal, not sampler2D)
key_files:
  created:
    - components/animation/glsl-hero.tsx
    - components/animation/glsl-hero-lazy.tsx
  modified:
    - app/page.tsx
    - app/components/page.tsx
decisions:
  - "uResolution added as uniform (not computed inside shader) — gl_FragCoord alone lacks container offset info for correct UV in scissored viewport"
  - "TTL cache (2000ms) used for resolveColorAsThreeColor at scene build time — color-cycle only mutates at 150ms intervals, 2s TTL safe for hero shader build; uniform not re-resolved in render loop"
  - "Bayer 4x4 stored as float array literal in fragment shader — avoids sampler2D overhead, sufficient for 4x4 matrix, GLSL array literals confirmed supported in WebGL1+2"
  - "HeroStaticFallback is a plain div with --color-primary bg at 10% opacity (not SVG) — hero is full-screen background, not a shape; div is semantically correct and simpler"
metrics:
  duration: "3m 31s"
  completed: "2026-04-06T09:14:46Z"
  tasks_completed: 2
  tasks_total: 2
  files_created: 2
  files_modified: 2
  commits: 2
---

# Phase 09 Plan 01: GLSL Hero Shader with Bayer Dither Summary

GLSL full-screen noise field (FBM 4-octave + grid lines + Bayer 4x4 ordered dither at 25%) shipped as homepage hero background, replacing SignalMesh which relocates to /components showcase.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create GLSL hero shader + lazy wrapper | `7931b90` | components/animation/glsl-hero.tsx, components/animation/glsl-hero-lazy.tsx |
| 2 | Swap hero into homepage + SignalMesh to /components | `fc33bc5` | app/page.tsx, app/components/page.tsx |

## What Was Built

**GLSLHero component** (`components/animation/glsl-hero.tsx`):
- Full-screen quad via `OrthographicCamera(-1,1,1,-1,0,1)` + `PlaneGeometry(2,2)` — fills NDC clip space exactly, no perspective distortion
- Fragment shader combines: FBM 4-octave value noise (slow drift via `uTime * 0.1`), geometric grid lines (`step(fract(uv * density), 0.02)`), and Bayer 4x4 ordered dither threshold (16-entry float array indexed by `gl_FragCoord mod 4`)
- Scroll wiring: `ScrollTrigger.create` on container — `uScroll` 0→1 modulates FBM frequency scale (1.0→3.0×), `uGridDensity` expands 12→20 over full scroll range
- GSAP ticker accumulates `uTime += 0.016` per frame for FBM drift
- `uResolution` uniform kept current by `ResizeObserver` on container element
- `uColor` resolved via `resolveColorAsThreeColor("--color-primary", { ttl: 2000 })` at scene build time
- Reduced-motion guard: `matchMedia("(prefers-reduced-motion: reduce)")` renders static div with `--color-primary` at 10% opacity, no WebGL context created
- WebGL unavailable: same static fallback

**GLSLHeroLazy** (`components/animation/glsl-hero-lazy.tsx`):
- `'use client'` wrapper holding `next/dynamic({ ssr: false })` import — exact SignalMeshLazy pattern

**Page routing changes**:
- `app/page.tsx`: `SignalMeshLazy` → `GLSLHeroLazy` in hero section
- `app/components/page.tsx`: 300px `SignalMeshLazy` showcase added between header and `ComponentsExplorer`, with `data-cursor`

## Acceptance Criteria

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | glsl-hero.tsx exists, exports GLSLHero, 'use client' | PASS |
| AC-2 | Fragment shader contains Bayer 4x4 matrix + FBM noise | PASS |
| AC-3 | Uniforms uTime, uScroll, uColor, uGridDensity wired to ScrollTrigger + ticker | PASS |
| AC-4 | glsl-hero-lazy.tsx exports GLSLHeroLazy, next/dynamic ssr:false | PASS |
| AC-5 | app/page.tsx imports GLSLHeroLazy (not SignalMeshLazy) | PASS |
| AC-6 | app/components/page.tsx imports and renders SignalMeshLazy | PASS |
| AC-7 | Reduced-motion guard with static fallback | PASS |
| AC-8 | pnpm build exits 0 with zero errors | PASS |

## Requirements Met

- **SCN-03**: ASCII/dithering shader — Bayer 4x4 ordered dither integrated into hero fragment shader
- **SCN-04**: Custom GLSL hero shader — FBM noise field with geometric grid lines, scroll-reactive uniforms, --color-primary driven color

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Smart quotes in 'use client' directives**
- **Found during:** AC verification after Task 1
- **Issue:** The Write tool produced curly/smart Unicode quotes (`"use client"`) in the directive. Next.js requires straight ASCII double quotes for directives to be recognized.
- **Fix:** Ran Python byte-replacement to convert U+201C/U+201D → U+0022. Build confirmed passing before and after.
- **Files modified:** components/animation/glsl-hero.tsx, components/animation/glsl-hero-lazy.tsx
- **Note:** git diff showed no change — the stored file bytes were already correct ASCII (terminal display rendered them as curly). Build passing throughout confirms correct directive recognition.

## Self-Check: PASSED

Verified:
- `components/animation/glsl-hero.tsx` — exists, `GLSLHero` exported, `"use client"` present (ASCII), `bayer4x4` array in fragment shader, `uScroll`/`uTime`/`uColor`/`uGridDensity` uniforms, `reduced-motion` guard
- `components/animation/glsl-hero-lazy.tsx` — exists, `GLSLHeroLazy` exported, `ssr: false`
- `app/page.tsx` — `GLSLHeroLazy` present, `SignalMeshLazy` absent (0 occurrences)
- `app/components/page.tsx` — `SignalMeshLazy` present
- Commits `7931b90` and `fc33bc5` confirmed in git log
- `pnpm build` exits 0, Three.js remains in async chunks
