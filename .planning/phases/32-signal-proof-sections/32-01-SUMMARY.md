---
phase: 32-signal-proof-sections
plan: 01
subsystem: proof-section
tags: [webgl, pointer-events, gyroscope, raf-lerp, scroll-trigger, ios-compat]
requires:
  - lib/proof-components.ts
  - components/animation/proof-shader.tsx
  - components/animation/component-skeleton.tsx
  - components/blocks/proof-section.tsx
  - tests/phase-32-signal-proof.spec.ts
provides:
  - PROOF section — full-viewport A+B+C layer interactive demo
  - PROOF_COMPONENT_SKELETONS constant (shared with Phase 33 INVENTORY)
  - ProofShader — GLSLHero fork with section-scoped Observer + geometric lattice
  - ComponentSkeleton / SkeletonGrid — stroke-only FRAME skeletons, forwardRef
  - ProofSection — rAF lerp + pointermove/gyroscope + ScrollTrigger lifecycle
affects:
  - app/page.tsx (PROOF stub replaced)
  - hooks/use-signal-scene.ts (crypto.randomUUID polyfill — iOS <15.4 compat)
  - components/animation/glsl-hero.tsx (checkWebGL globalThis cache — iOS context fix)
  - components/animation/signal-mesh.tsx (checkWebGL globalThis cache — iOS context fix)
tech-stack:
  added: []
  patterns:
    - section-scoped CSS custom property bridging (sectionRef.current, not :root)
    - globalThis WebGL context check cache (survives HMR, force-loses test context)
    - next/dynamic ssr:false for Three.js components
    - rAF lerp loop (module-level, not useGSAP tween)
key-files:
  created:
    - lib/proof-components.ts
    - components/animation/proof-shader.tsx
    - components/animation/component-skeleton.tsx
    - components/animation/proof-shader-lazy.tsx
    - components/blocks/proof-section.tsx
    - tests/phase-32-signal-proof.spec.ts
  modified:
    - app/page.tsx
    - hooks/use-signal-scene.ts
    - components/animation/glsl-hero.tsx
    - components/animation/signal-mesh.tsx
key-decisions:
  - Section-scoped --signal-intensity on sectionRef.current (not :root) prevents CSS custom property bleed across ENTRY/PROOF/SIGNAL shaders
  - IntersectionObserver alongside ScrollTrigger to handle GSAP coordinate mismatch after THESIS pin-spacer inflation
  - ProofShader data-proof-layer wrapper always renders (WebGL canvas or static fallback inside) to satisfy PR-03 layer count assertion in headless Playwright
  - globalThis WebGL check cache applied to all 3 WebGL components — eliminates iOS Safari context limit crash on page load
  - crypto.randomUUID() polyfill in useSignalScene — iOS <15.4 does not implement this (root cause of iOS crash, predating Phase 32)
requirements-completed:
  - PR-01
  - PR-02
  - PR-03
  - PR-04
  - PR-05
  - PR-06
duration: 1h 1m
completed: "2026-04-08T19:44:55Z"
---

# Phase 32 Plan 01: PROOF Section Summary

PROOF section delivered — full-viewport rAF-lerped interactive demo of SIGNAL/FRAME layer separation driven by pointer (desktop), touch drag (mobile), and device tilt (iOS/Android gyroscope). Three concurrent layers (A: geometric-lattice/FBM shader, B: stroke-only SF component skeletons, C: FRAME-pole system stats column) read a single section-scoped `--signal-intensity` CSS custom property.

**Duration:** 1h 1m | **Tasks:** 5 (Tasks 0-4 auto + Task 5 human-verify) | **Files:** 10 created/modified | **Commits:** 10

## Tasks Completed

| Task | Name | Commit | Status |
|------|------|--------|--------|
| 0 | Wave 0 test scaffold + PROOF_COMPONENT_SKELETONS | `8410890`, `5e23240` | Done |
| 1 | ProofShader (GLSLHero fork + section-scoped Observer) | `3cdd5af` | Done |
| 2 | ComponentSkeleton + SkeletonGrid | `c6fe526` | Done |
| 3 | ProofSection block (rAF lerp + pointer/gyro + A+B+C) | `dfec70f` | Done |
| 4 | Wire into page.tsx + green Playwright tests | `7f00564` | Done |
| 5 | Physical iOS Safari verification | — | APPROVED |

## Playwright Results

All 6 PR tests: **6/6 PASSED**

| Test | AC | Result |
|------|----|--------|
| PR-01: PROOF section 100vh | AC-1 | PASS |
| PR-02: pointer changes --signal-intensity | AC-2 | PASS |
| PR-03: three concurrent layers | AC-3 | PASS |
| PR-04: stats in frame-pole column | AC-4 | PASS |
| PR-05: pointermove not touchmove (source) | AC-5 | PASS |
| PR-06: reduced-motion static split | AC-6 | PASS |

## Physical iOS Safari Verification

✅ **APPROVED** — user confirmed:
- Desktop: mouse left→right transitions geometric lattice → FBM noise; skeletons fade; FRAME-pole always visible
- iPhone: tap + tilt separates layers in real time, discoverable in ≤5s, no instruction overlay
- Reduced-motion: static split rendered, no canvas, no animation

## Deviations from Plan

**[Rule 1 - Bug] ScrollTrigger coordinate mismatch after THESIS pin-spacer**
Found during: Task 4 (PR-02, PR-03 failing in Playwright)
Issue: GSAP computed PROOF's scroll position before THESIS pin-spacer inflated the DOM; `onEnter` fired at wrong scroll position, deactivating the rAF loop before PROOF was visible.
Fix: Added `IntersectionObserver` alongside ScrollTrigger. ST satisfies AC-10 (lifecycle callbacks); IO provides reliable native visibility gating immune to GSAP coordinate drift.
Files: `components/blocks/proof-section.tsx`
Commit: `7f00564`

**[Rule 1 - Bug] ProofShader fallback missing data-proof-layer attribute in headless Playwright**
Found during: Task 4 (PR-03 failing — 0 layer elements when WebGL unavailable)
Issue: Early return to `<ProofShaderFallback />` omitted the `data-proof-layer="shader"` attribute.
Fix: Restructured ProofShader to always render outer `div[data-proof-layer="shader"]` with canvas/fallback as children.
Files: `components/animation/proof-shader.tsx`
Commit: `7f00564`

**[Rule 2 - Missing Critical] PR-02 test needed reliable scroll + lerp wait timing**
Found during: Task 4 (PR-02 timing out on intensity read)
Fix: Updated test to scroll to native DOM position (getBoundingClientRect + scrollY) and wait via `waitForFunction` for intensity change before sampling.
Files: `tests/phase-32-signal-proof.spec.ts`
Commit: `7f00564`

**[Rule 1 - Bug] ProofShader requires next/dynamic ssr:false (Three.js module-level import)**
Found during: iOS checkpoint — page error on mobile (SSR crash)
Issue: `import * as THREE from "three"` at module level in proof-shader.tsx caused crash during SSR. Pattern existed in GLSLHeroLazy but was not applied to ProofShader.
Fix: Created `proof-shader-lazy.tsx` wrapping ProofShader with `next/dynamic({ ssr: false })`; updated proof-section import.
Files: `components/animation/proof-shader-lazy.tsx`, `components/blocks/proof-section.tsx`
Commit: `84fd4f4`

**[Rule 1 - Bug] WebGL context leak — checkWebGL() creates un-disposed contexts on every mount**
Found during: iOS checkpoint — 200+ "Too many active WebGL contexts" in Chrome DevTools
Issue: All 3 WebGL components (glsl-hero, proof-shader, signal-mesh) call `checkWebGL()` via `useState()` on every mount, creating canvas+WebGL contexts without disposing them. On HMR each hot reload creates another leaked context. iOS Safari's 2-8 context limit crashes the page.
Fix: Cached check result on `globalThis.__sf_has_webgl` (survives HMR); added `WEBGL_lose_context.loseContext()` to dispose test context immediately after check.
Files: `components/animation/glsl-hero.tsx`, `components/animation/proof-shader.tsx`, `components/animation/signal-mesh.tsx`
Commits: `dcf1e14`, `584a4ce`

**[Rule 1 - Bug] crypto.randomUUID() not available on iOS <15.4 — root cause iOS crash**
Found during: iOS checkpoint — `crypto.randomUUID is not a function` in Next.js DevTools overlay
Issue: `useSignalScene` calls `crypto.randomUUID()` on line 44. Not available on iOS <15.4. Predates Phase 32 (triggered by GLSLHero → useSignalScene in EntrySection).
Fix: Polyfill with `typeof crypto?.randomUUID === "function"` guard; fallback to `Math.random().toString(36) + Date.now().toString(36)`.
Files: `hooks/use-signal-scene.ts`
Commit: `cb4884d`

**Total deviations:** 6 auto-fixed (3 Rule 1 bugs during Playwright, 3 Rule 1 bugs during iOS checkpoint).
**Impact:** All iOS Safari compatibility issues are now resolved. The crypto.randomUUID and WebGL context fixes benefit all existing phases (Phase 30 GLSLHero, Phase 31 ThesisSection) — they were latent bugs that Phase 32 surfaced by adding a 3rd WebGL component.

## Issues Encountered

None outstanding. All deviations resolved. iOS verification approved.

## Self-Check: PASSED

- All key files exist on disk ✓
- 6/6 Playwright PR tests green ✓
- Physical iOS Safari verified and approved ✓
- No outstanding blockers ✓

## Next

Ready for Plan 02 — SIGNAL section (SG-01 through SG-05).
