---
phase: 06-generative-signal-foundation
generated: "2026-04-05T00:00:00Z"
finding_count: 4
high_count: 2
has_bdd_candidates: true
---

# Phase 6: Edge Cases

**Generated:** 2026-04-05
**Findings:** 4 (cap: 8)
**HIGH severity:** 2
**BDD candidates:** yes

## Findings

### 1. [HIGH] initSignalCanvas has no explicit StrictMode double-mount guard in SignalCanvas useEffect

**Plan element:** `initSignalCanvas()` in `lib/signal-canvas.ts`
**Category:** error_path

In React StrictMode, `useEffect` fires twice (mount → unmount → mount). The plan's comment says "Do NOT dispose renderer on unmount" but provides no cleanup function in the `SignalCanvas` useEffect. Without cleanup, the globalThis guard (`if (state.renderer) return`) may pass correctly on the second mount — but the GSAP ticker callback registration in `initSignalCanvas` may be called twice if state is not robustly re-checked, producing duplicate render callbacks and double-rendering per frame.

**BDD Acceptance Criteria Candidate:**
```
Given React StrictMode double-invokes useEffect (mount + unmount + mount)
When SignalCanvas mounts for the second time
Then gsap.ticker callbacks are not duplicated and exactly one WebGLRenderer exists on globalThis
```

### 2. [HIGH] registerScene renderFn optional type inconsistency may cause runtime error on default render path

**Plan element:** `registerScene` function in `lib/signal-canvas.ts`
**Category:** boundary_condition

Task 1 action defines `registerScene` parameter type as `Omit<SceneEntry, 'renderFn'> & { renderFn?: ... }` while `SceneEntry` has `renderFn` non-optional. The render loop calls `entry.renderFn(entry.scene, entry.camera)`. If `renderFn` is undefined at call time (standard case — most scenes use the default), this throws at runtime. The action text mentions "default renderFn calls `state.renderer.render(scene, camera)`" but doesn't specify whether the default is applied at registerScene time or at render time.

**BDD Acceptance Criteria Candidate:**
```
Given a scene is registered without a custom renderFn
When the GSAP ticker fires and renderAllScenes iterates the scene
Then renderer.render(scene, camera) is called as the default without throwing a TypeError
```

### 3. [MEDIUM] Resize handler updates renderer dimensions but provides no mechanism to notify registered scenes for camera aspect ratio updates

**Plan element:** resize handler in `lib/signal-canvas.ts`
**Category:** boundary_condition

The resize handler calls `renderer.setSize(window.innerWidth, window.innerHeight)`. Scene `getBoundingClientRect()` is read each frame, so viewport coordinates update automatically. However, PerspectiveCamera aspect ratio must be updated by the scene itself on resize. The singleton has no resize event propagation to registered scenes — scenes will render with distorted perspective after window resize unless they independently manage their camera aspect ratio.

### 4. [LOW] useSignalScene empty dep array with eslint-disable may silently break for consumers who pass non-stable buildScene factories

**Plan element:** empty `useEffect` deps in `hooks/use-signal-scene.ts`
**Category:** boundary_condition

The `// eslint-disable-line react-hooks/exhaustive-deps` is intentional and documented inline. Scene consumers must ensure `buildScene` does not capture frequently-changing props. Not a plan defect — risk is documented and the pattern is standard for once-per-mount initialization hooks. Flagged only as LOW advisory.
