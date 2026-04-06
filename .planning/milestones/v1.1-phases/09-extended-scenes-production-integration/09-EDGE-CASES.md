---
phase: 09-extended-scenes-production-integration
generated: "2026-04-05T00:00:00Z"
finding_count: 5
high_count: 2
has_bdd_candidates: true
---

# Phase 9: Edge Cases

**Generated:** 2026-04-05
**Findings:** 5 (cap: 8)
**HIGH severity:** 2
**BDD candidates:** yes

## Findings

### 1. [HIGH] GLSL shader compile failure is silent in production builds

**Plan element:** `components/animation/glsl-hero.tsx`
**Category:** error_path

The fragment shader GLSL string is constructed inline in the TypeScript file. If the shader has a syntax error (mismatched braces, unsupported GLSL ES 1.0 syntax, integer array initialization issue with `float[16]` on some WebGL 1 implementations), the ShaderMaterial silently fails with transparent/black output. No `pnpm build` error surfaces this — it only manifests at runtime. The plan does not specify a fallback output color or developer-mode shader error checking (`renderer.debug.checkShaderErrors`).

**BDD Acceptance Criteria Candidate:**
```
Given the GLSL hero fragment shader contains the Bayer 4x4 float array initialization
When the component mounts on a WebGL 1 context (older mobile browsers)
Then the reduced-motion fallback renders rather than a transparent/invisible hero
```

### 2. [HIGH] Plan 03 Task 1 modifies app/page.tsx after Plan 01 Task 2 has already changed it — merge conflict risk

**Plan element:** `app/page.tsx`
**Category:** error_path

Both Plan 01 Task 2 and Plan 03 Task 1 modify `app/page.tsx`. Plan 01 replaces `SignalMeshLazy` with `GLSLHeroLazy`. Plan 03 then wraps hero sections in `SFSection`. The Plan 03 action references specific line numbers (line 28, 32, 37, etc.) that will be stale after Plan 01's changes. If the executor uses the line numbers literally, the SFSection wrapping may target the wrong elements.

**BDD Acceptance Criteria Candidate:**
```
Given Plan 01 has already modified app/page.tsx (GLSLHeroLazy swapped in)
When Plan 03 Task 1 runs and migrates sections to SFSection
Then the post-migration app/page.tsx contains both GLSLHeroLazy AND SFSection wrappers with no raw div layout wrappers
```

### 3. [MEDIUM] SignalOverlay keyboard shortcut (Shift+S) conflicts with browser shortcuts

**Plan element:** `components/animation/signal-overlay.tsx`
**Category:** boundary_condition

The overlay toggles on `e.shiftKey && e.key === 'S'`. On some browsers/OS combinations, Shift+S may activate browser-level features or conflict with the site's own keyboard navigation. The action does not specify `e.preventDefault()` or a check that the event target is not an input element. Users typing "S" in a search box or form could accidentally toggle the overlay.

### 4. [MEDIUM] data-anim="stagger" initial CSS state hides content if PageAnimations fails to mount

**Plan element:** `app/globals.css` (the `[data-anim="stagger"] > *` rule)
**Category:** error_path

The CSS `[data-anim="stagger"] > * { opacity: 0; transform: translateY(8px); }` is added globally. If PageAnimations (which reverses this via ScrollTrigger.batch) fails to initialize — JavaScript disabled, bundle load error, ScrollTrigger not registered — the stagger children remain invisible. The plan does not specify a `<noscript>` override or a JS-enabled class guard.

### 5. [LOW] SFSection data-section attribute collision on app/page.tsx

**Plan element:** `app/page.tsx`
**Category:** boundary_condition

Plan 03 Task 1 action notes "SFSection automatically adds `data-section` and `data-section-label={label}`" but also instructs keeping the explicit `data-section="hero"` as a spread prop. If SFSection internally sets `data-section` to a fixed value AND the spread prop also sets `data-section="hero"`, the spread wins (last write in JSX prop order). This is acceptable but the action's explanation is slightly ambiguous and could confuse the executor into removing the spread `data-section` prop, which would lose the specific section IDs PageAnimations depends on.
