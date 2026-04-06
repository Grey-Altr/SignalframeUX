---
phase: 08-first-generative-scenes
generated: "2026-04-05T00:00:00Z"
finding_count: 5
high_count: 2
has_bdd_candidates: true
---

# Phase 8: Edge Cases

**Generated:** 2026-04-05
**Findings:** 5 (cap: 8)
**HIGH severity:** 2
**BDD candidates:** yes

## Findings

### 1. [HIGH] uniformsRef race between buildScene completion and ScrollTrigger creation

**Plan element:** `buildScene` factory in `components/animation/signal-mesh.tsx`
**Category:** error_path

`uniformsRef.current` is set inside `buildScene`. If `useGSAP` fires its `ScrollTrigger.create` callback before `buildScene` completes (narrow race on initial render), `uniformsRef.current` is null and the null guard `if (!uniformsRef.current) return` will silently skip all scroll-driven updates. The mesh renders but never reacts to scroll. No error surfaces.

**BDD Acceptance Criteria Candidate:**
```
Given SignalMesh mounts and useSignalScene begins buildScene
When the useGSAP hook fires ScrollTrigger.create before buildScene completes
Then uniformsRef.current should be defined (or ScrollTrigger creation should be deferred until after buildScene)
```

---

### 2. [HIGH] Zero-height container produces NaN camera aspect in buildScene

**Plan element:** `containerRef.current.clientWidth / containerRef.current.clientHeight` in `buildScene`
**Category:** error_path

Camera aspect is computed from container dimensions inside `buildScene`. If the container has `clientHeight === 0` at buildScene time (before layout paint, or hero section briefly hidden), division produces `Infinity` or `NaN`. The plan notes `(fallback 1)` but does not specify the guard expression to trigger it. A degenerate projection matrix will render nothing or produce visual corruption.

**BDD Acceptance Criteria Candidate:**
```
Given the hero container has clientHeight = 0 at buildScene invocation time
When buildScene computes camera.aspect = clientWidth / clientHeight
Then camera.aspect should fall back to 1 (not NaN or Infinity) and camera.updateProjectionMatrix() called
```

---

### 3. [MEDIUM] setProperty() theme mutation bypasses MutationObserver in TokenViz

**Plan element:** `MutationObserver` in `components/animation/token-viz.tsx`
**Category:** empty_state

The MutationObserver watches `attributeFilter: ["class", "style"]` on documentElement. If a theme mutation changes token values via `element.style.setProperty("--color-primary", ...)` (as `color-cycle-frame.tsx` does), the `style` attribute filter should catch it — however, if the mutation targets a child element's inline style or a CSS rule rather than documentElement's attributes, the observer will not fire. Canvas will display stale token values silently.

---

### 4. [MEDIUM] Zero-width parent container produces invisible canvas in TokenViz

**Plan element:** `canvas.parentElement.clientWidth` in `components/animation/token-viz.tsx`
**Category:** error_path

Canvas width is read from `parentElement.clientWidth`. If rendered inside a display:none container or before layout paint, `clientWidth` is 0, producing a 0x0 canvas. The plan does not guard against this case; the initial draw renders nothing and the MutationObserver/ResizeObserver may not fire to correct it.

---

### 5. [LOW] pnpm build tail -15 may truncate real SSR errors

**Plan element:** `pnpm build 2>&1 | tail -15` verify command in both plans
**Category:** boundary_condition

The automated verify captures only the last 15 lines of build output. An SSR error (e.g., `window is not defined`) may appear hundreds of lines earlier and be silently truncated. The verify command would output `PASS` (exit 0) while hiding real errors.
