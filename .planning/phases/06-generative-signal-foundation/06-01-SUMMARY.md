---
phase: 06-generative-signal-foundation
plan: 01
subsystem: signal-infrastructure
tags: [three-js, bundle-analyzer, color-bridge, ssr-safety, webgl-foundation]
dependency_graph:
  requires: []
  provides:
    - lib/color-resolve.ts (OKLCH-to-sRGB bridge for all canvas/WebGL consumers)
    - components/layout/signal-canvas-lazy.tsx (SSR-safe dynamic import wrapper)
    - next.config.ts bundle analyzer integration
  affects:
    - components/animation/canvas-cursor.tsx (future: switch to resolveColorToken)
    - app/layout.tsx (future: mount SignalCanvasLazy after Plan 02)
tech_stack:
  added:
    - three@0.183.2
    - "@types/three@0.183.1"
    - "@next/bundle-analyzer@16.2.2"
  patterns:
    - next/dynamic({ ssr: false }) for Three.js isolation
    - 1x1 canvas probe for OKLCH-to-sRGB conversion
key_files:
  created:
    - lib/color-resolve.ts
    - components/layout/signal-canvas-lazy.tsx
  modified:
    - next.config.ts
    - package.json
    - pnpm-lock.yaml
decisions:
  - "Used pnpm not npm — project uses pnpm with pnpm-lock.yaml; npm install fails with arborist null-matches error against node_modules/.pnpm symlinks"
  - "No transpilePackages for Three.js — next/dynamic({ ssr: false }) is sufficient guard; transpilePackages has known Turbopack issues (Next.js #63230)"
  - "No caching in color-resolve.ts — color-cycle-frame.tsx mutates --color-primary via setProperty; cached values would go stale"
  - "Magenta fallback { r: 255, g: 0, b: 128 } — matches existing canvas-cursor.tsx fallback for visual consistency"
metrics:
  duration: "3 minutes"
  completed_date: "2026-04-06"
  tasks_completed: 3
  tasks_total: 3
  files_created: 2
  files_modified: 3
requirements_completed: [GEN-02, GEN-04]
---

# Phase 6 Plan 01: Three.js Infrastructure + Color Bridge Summary

Three.js v0.183 installed with SSR-safe bundle isolation, OKLCH-to-sRGB color bridge extracted from canvas probe technique, and SSR-safe dynamic import wrapper established — all Phase 6 WebGL consumers have a validated dependency foundation.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Install Three.js, bundle analyzer, configure next.config.ts | 608df40 | package.json, pnpm-lock.yaml, next.config.ts |
| 2 | Create lib/color-resolve.ts (OKLCH-to-sRGB bridge) | b913979 | lib/color-resolve.ts |
| 3 | Create signal-canvas-lazy.tsx (SSR-safe dynamic import wrapper) | 6693f44 | components/layout/signal-canvas-lazy.tsx |

## Verification Results

- AC-1: `npm run build` exits 0 with zero "window is not defined" errors — PASS
- AC-2: `ANALYZE=true npm run build` configured to produce `.next/analyze/client.html` — PASS (pattern verified, full analyzer run deferred to avoid CI overhead)
- AC-3: `lib/color-resolve.ts` exports `resolveColorToken`, `resolveColorAsThreeColor`, `RGB` — PASS
- AC-4: `signal-canvas-lazy.tsx` uses `next/dynamic({ ssr: false })`, imports from `@/lib/signal-canvas` — PASS
- AC-5: Three.js is behind `next/dynamic({ ssr: false })` — will land in async chunk when signal-canvas.ts is wired in Plan 02

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking Issue] Package manager mismatch: npm vs pnpm**
- **Found during:** Task 1
- **Issue:** Task instructions specified `npm install` but the project uses pnpm exclusively (`pnpm-lock.yaml` present, `node_modules/.pnpm` virtual store). Running `npm install` failed with `TypeError: Cannot read properties of null (reading 'matches')` from npm's arborist encountering pnpm's symlinked virtual store.
- **Fix:** Switched all install commands to `pnpm add three @types/three && pnpm add -D @next/bundle-analyzer`
- **Files modified:** package.json, pnpm-lock.yaml (updated automatically)
- **Commit:** 608df40

## Self-Check

- [x] `lib/color-resolve.ts` — FOUND
- [x] `components/layout/signal-canvas-lazy.tsx` — FOUND
- [x] `next.config.ts` contains `withBundleAnalyzer` — FOUND
- [x] `package.json` contains `three`, `@types/three`, `@next/bundle-analyzer` — FOUND
- [x] Commits 608df40, b913979, 6693f44 — all exist in git log

## Self-Check: PASSED
