# Pitfalls Research

**Domain:** Adding generative/3D visuals (WebGL, Three.js) to an existing high-performance design system
**Researched:** 2026-04-05
**Confidence:** HIGH (WebGL context limits, memory leaks, SSR patterns) / MEDIUM (OKLCH/shader bridge, GSAP+Three.js integration specifics)

---

## Critical Pitfalls

### Pitfall 1: WebGL Context Exhaustion

**What goes wrong:**
Browsers enforce a hard cap on concurrent WebGL contexts: Chrome allows ~16 total (8 on Android), Firefox allows 8 per page origin. When the cap is hit, the browser silently destroys the oldest context — your canvas goes blank with "THREE.WebGLRenderer: Context Lost" and no user-facing error. On pages with multiple canvases (hero, section backgrounds, interactive components), this cap is reached faster than expected.

**Why it happens:**
Each `new THREE.WebGLRenderer()` or `new WebGLRenderingContext()` creates an independent context. Developers mount a renderer per component, navigate between routes without cleanup, and accumulate orphaned contexts that persist in GPU memory even after the DOM node is removed.

**How to avoid:**
- Enforce a single shared WebGLRenderer per page, passed via React context or a module singleton. Never instantiate inside a component that can remount.
- On route unmount: call `renderer.forceContextLoss()` then `renderer.dispose()` in the component cleanup function.
- For decorative secondary canvases (grain, noise fields), prefer 2D canvas or CSS — reserve WebGL for the primary hero/focal element only.
- Use `virtual-webgl` as a last resort if multiple contexts are unavoidable.

**Warning signs:**
- Console: `"WARNING: Too many active WebGL contexts"` or `"THREE.WebGLRenderer: Context Lost"`
- Canvas goes blank after navigating between pages and returning
- `renderer.info.memory.geometries` growing monotonically across page navigations

**Phase to address:**
Phase 1 (Generative SIGNAL Foundation) — establish the shared renderer pattern as the architectural baseline before any generative component is built. Retrofitting this later requires touching every canvas component.

---

### Pitfall 2: GPU Memory Leaks from Undisposed Three.js Resources

**What goes wrong:**
Three.js does not garbage-collect GPU resources automatically. Geometries, materials, and textures remain in VRAM until explicitly `.dispose()`d — even after being removed from the scene or when the JavaScript object is GC'd. On a design system showcase with animated sections that mount/unmount on scroll or tab navigation, this compounds into a progressive slowdown and eventual browser crash.

**Why it happens:**
The disconnect between JavaScript's GC model and GPU memory is non-obvious. `scene.remove(mesh)` removes the object from the scene graph but does not free VRAM. `scene.clear()` has the same problem. Developers assume memory is released when objects go out of scope — it is not.

**How to avoid:**
- On any component unmount or scene teardown, traverse the scene graph and dispose each resource:
  ```js
  scene.traverse((obj) => {
    obj.geometry?.dispose();
    if (Array.isArray(obj.material)) {
      obj.material.forEach(m => { m.dispose(); m.map?.dispose(); });
    } else {
      obj.material?.dispose();
      obj.material?.map?.dispose();
    }
  });
  renderer.dispose();
  ```
- Monitor `renderer.info.memory` during development — if `geometries` or `textures` count grows over time, there is a leak.
- Prefer instancing (`InstancedMesh`) and geometry merging over many independent mesh objects.

**Warning signs:**
- `renderer.info.memory.textures` or `.geometries` increasing between page navigations in DevTools
- Page FPS dropping progressively over a session without reload
- Chrome Task Manager showing GPU memory growing over time

**Phase to address:**
Phase 1 (Generative SIGNAL Foundation) — build disposal as a required contract for every canvas component, enforced in the component scaffold/template. Do not ship any generative component without a verified cleanup path.

---

### Pitfall 3: SSR Hydration Failure from WebGL Browser Globals

**What goes wrong:**
`THREE.WebGLRenderer`, `window`, `document`, `navigator.gpu`, and canvas APIs do not exist in the Node.js SSR environment. Importing Three.js or any WebGL library at the module level in a Server Component (or in a file that gets evaluated server-side) throws during build or causes a hydration mismatch that corrupts the page shell.

**Why it happens:**
Next.js App Router renders the entire component tree on the server by default. Even if the canvas element is wrapped in a Client Component, a top-level `import * as THREE from 'three'` in a shared utility file will execute server-side. The hydration mismatch occurs when the server renders one DOM state and the client renders another — WebGL canvases are invisible on the server so the initial HTML has no canvas element, but React expects one.

**How to avoid:**
- All Three.js and WebGL components must be Client Components with `'use client'`.
- Import via `next/dynamic` with `{ ssr: false }`:
  ```js
  const SignalCanvas = dynamic(() => import('@/components/animation/SignalCanvas'), { ssr: false });
  ```
- Never import Three.js in shared utility files that are consumed by Server Components.
- Use `useEffect` for any WebGL initialization — never in component body or module scope.
- Wrap canvas placeholders in a `<Suspense fallback={<div className="signal-placeholder" />}>` to prevent layout shift while the component loads.

**Warning signs:**
- Build error: `ReferenceError: window is not defined` during `next build`
- Hydration error: `"Hydration failed because the initial UI does not match"`
- Canvas component rendering as empty div in production but working in dev (dev mode is more lenient about hydration mismatches)

**Phase to address:**
Phase 1 (Generative SIGNAL Foundation) — establish the `dynamic({ ssr: false })` import pattern as the single canonical approach for all WebGL components. Document in SCAFFOLDING.md before building any canvas component.

---

### Pitfall 4: GSAP Animation Loop Conflict with Three.js Render Loop

**What goes wrong:**
Three.js uses `renderer.setAnimationLoop()` (which wraps `requestAnimationFrame`) for its render loop. GSAP uses `gsap.ticker` (also RAF-based). When both run independently, they may fire at different times within the same frame, causing visual jitter — GSAP-driven values (camera position, uniforms, mesh transforms) are written after the Three.js renderer has already consumed them for that frame. The result is one-frame-behind animation, especially noticeable on ScrollTrigger-driven 3D transitions.

**Why it happens:**
Two separate RAF callbacks running in the same frame have undefined execution order relative to each other. The GSAP ticker and Three.js's internal RAF callback are registered independently by their respective libraries.

**How to avoid:**
- Do not use `renderer.setAnimationLoop()`. Instead, drive the Three.js render call from inside `gsap.ticker.add()`:
  ```js
  gsap.ticker.add(() => {
    // update uniforms, camera, mesh transforms here (GSAP writes)
    renderer.render(scene, camera); // then render
  });
  ```
- This gives GSAP full control of the frame budget and ensures Three.js renders exactly once per GSAP tick, after all tweens have been applied.
- For ScrollTrigger-driven scenes: update Three.js uniforms in `onUpdate` callbacks, render in the ticker.
- Lenis (already in the stack) integrates with GSAP ticker via `lenis.raf(time)` — add Three.js to the same ticker chain.

**Warning signs:**
- 3D meshes appear to stutter or lag one frame behind scroll position
- Console warnings about multiple RAF callbacks per frame
- GSAP ScrollTrigger scrub animations look smooth in CSS but jittery in Three.js

**Phase to address:**
Phase 1 (Generative SIGNAL Foundation) — define the unified animation loop architecture before any animated canvas component is built. This is not retrofittable without touching all animation components.

---

### Pitfall 5: Breaking the 200KB Initial Bundle Budget

**What goes wrong:**
`three` (minified + gzipped) is approximately 160–580KB depending on what is imported. Adding it to the initial bundle immediately blows the 200KB page weight budget, destroying the Lighthouse 100/100 score and the LCP < 1.0s target.

**Why it happens:**
Developers import Three.js in a file that gets included in the main chunk, either directly or transitively. Even with tree shaking, Three.js is a monolithic library where many internals are tightly coupled — tree shaking yields limited savings compared to a full naive import.

**How to avoid:**
- Always use `next/dynamic` with `ssr: false` for canvas components — this splits Three.js into a separate async chunk loaded only when the component mounts.
- Audit with `@next/bundle-analyzer` after every new generative component addition.
- Prefer named imports from Three.js submodules where possible (`import { WebGLRenderer } from 'three'`).
- Canvas components should load after `LCP` is reported — use `IntersectionObserver` or a `useEffect` delay to defer canvas initialization until the critical path is complete.
- For non-hero canvases, consider whether a canvas-2D or pure CSS/SVG procedural approach achieves the same visual effect at a fraction of the cost.

**Warning signs:**
- `@next/bundle-analyzer` shows `three` in the main or shared chunk
- Lighthouse TBT (Total Blocking Time, 30% of score) increases after adding generative components
- LCP exceeds 1.0s on pages that previously passed

**Phase to address:**
Phase 1 (Generative SIGNAL Foundation) — validate bundle budget with `@next/bundle-analyzer` before and after adding Three.js. Establish a bundle size CI gate if not already present.

---

### Pitfall 6: OKLCH Colors Breaking in WebGL Shaders

**What goes wrong:**
CSS OKLCH values cannot be passed directly to GLSL shaders. WebGL operates in linear sRGB color space by default. CSS OKLCH is a perceptual color space with a different gamut and gamma encoding. If you read CSS custom property values (e.g. `oklch(0.5 0.15 240)`) and pass them naively to a shader uniform, the rendered color will be visually wrong — different lightness, shifted hue, incorrect contrast — breaking the FRAME/SIGNAL color contract.

**Why it happens:**
There is no built-in bridge between CSS color spaces and GLSL. Developers probe a DOM element's computed color and pass the resulting string (still OKLCH syntax) to a shader, which does not understand the OKLCH encoding. Even if converted to hex first, the conversion may skip the sRGB gamma correction step that WebGL expects.

**How to avoid:**
- Establish a CSS-to-shader color bridge utility at project start:
  1. Create an off-screen `<canvas>` element
  2. Draw a 1x1 pixel using the CSS color (the browser resolves OKLCH to device sRGB)
  3. Read back the pixel with `getImageData` — this gives you linear sRGB values the shader can consume
  4. Pass as `vec3` uniform (values 0–1)
- Alternatively, maintain a parallel token map: for each OKLCH design token, pre-compute and store the linear sRGB equivalent in a JS constant used only for shader uniforms.
- In shaders, apply gamma correction if you need perceptually uniform interpolation:
  ```glsl
  vec3 linearToSRGB(vec3 linear) {
    return pow(linear, vec3(1.0 / 2.2));
  }
  ```
- Document this bridge pattern in SIGNAL-SPEC.md so it is not re-invented per component.

**Warning signs:**
- Shader colors look visually different from adjacent CSS elements using the same design tokens
- Theme toggle (light/dark) causes shader colors to appear inconsistent with the UI
- Colors in canvas appear washed out or over-saturated compared to the design

**Phase to address:**
Phase 1 (Generative SIGNAL Foundation) — implement the color bridge utility before building any shader-based component. The OKLCH probe pattern from v1.0 (theme toggle GSAP guard) is the precedent — extend it.

---

### Pitfall 7: Mobile GPU Battery Drain and Thermal Throttling

**What goes wrong:**
An unthrottled WebGL animation loop running at 60fps continuously — even when the page is idle or below the fold — aggressively clocks the GPU on mobile devices, draining battery and triggering thermal throttling within minutes. Throttled GPUs drop to 20–30fps regardless of your optimization work, making the SIGNAL layer feel broken on mobile rather than elevated.

**Why it happens:**
`requestAnimationFrame` runs at full refresh rate (60–120Hz) by default, regardless of whether anything visible is changing on screen. Mobile GPUs do not have the power headroom that desktop GPUs do. A continuous render loop with even a simple shader draws measurably more power than CSS-only animation.

**How to avoid:**
- Use `IntersectionObserver` to pause the render loop when the canvas is not in the viewport: `renderer.setAnimationLoop(null)` when out of view, restart when intersecting.
- Cap mobile frame rate at 30fps using a time-delta throttle:
  ```js
  let lastFrame = 0;
  const TARGET_FPS = 30;
  gsap.ticker.add((time) => {
    if (time - lastFrame < 1000 / TARGET_FPS) return;
    lastFrame = time;
    renderer.render(scene, camera);
  });
  ```
- Detect mobile with `navigator.hardwareConcurrency <= 4` or a user-agent check, apply reduced quality settings (lower pixel ratio, simplified geometry).
- Set `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))` — retina rendering at 2x doubles GPU workload for marginal visual gain.

**Warning signs:**
- Device heats up during browsing session
- FPS drops from 60 to 15–20 after ~2 minutes on mobile
- Battery percentage drops noticeably faster than expected
- Chrome DevTools Performance panel shows frame time spiking on mobile emulation

**Phase to address:**
Phase 1 (Generative SIGNAL Foundation) — build mobile throttling into the base canvas component template. Never ship a canvas component without IntersectionObserver pause logic.

---

### Pitfall 8: Reduced-Motion Handling for Procedural/Generative Content

**What goes wrong:**
`prefers-reduced-motion` is honored by the existing GSAP animations (per SIGNAL-SPEC.md), but generative/procedural content — noise fields, particle systems, shader animations — is not covered by CSS media queries. If the Three.js render loop runs unconditionally, users who need reduced motion (vestibular disorders, epilepsy) are exposed to continuous motion in violation of WCAG 2.3.3 (Animation from Interactions) and 2.2.2 (Pause, Stop, Hide). This is a legal accessibility risk, not just a quality issue.

**Why it happens:**
CSS `prefers-reduced-motion` stops CSS transitions and animations automatically when honored in CSS. JavaScript-driven WebGL animations have no such automatic brake — they require explicit detection. Teams that have already handled the CSS layer assume they are compliant.

**How to avoid:**
- Detect at initialization and subscribe to changes:
  ```js
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  const shouldReduceMotion = () => mql.matches;
  mql.addEventListener('change', () => {
    if (shouldReduceMotion()) renderer.setAnimationLoop(null);
    else renderer.setAnimationLoop(tick);
  });
  ```
- For generative content: when reduced-motion is active, render a single static frame (the initial state) and halt the loop. Do not simply slow it down — the static frame must be intentionally designed.
- The SIGNAL-SPEC.md already documents reduced-motion as "intentional alternative design" — generative components must follow the same contract: define the static state, not just "stop the animation."
- Any animation lasting more than 5 seconds requires a user-accessible pause control regardless of system preference.

**Warning signs:**
- WAVE or axe accessibility scanner flags: "Content moves, blinks, scrolls" on canvas elements
- Lighthouse accessibility score drops after adding canvas components
- System reduced-motion setting has no effect on canvas elements

**Phase to address:**
Phase 1 (Generative SIGNAL Foundation) — add reduced-motion detection to the base canvas component template. Requires design decision per component: what is the static/halted state? Must be specified before coding, not retrofitted.

---

### Pitfall 9: Canvas Accessibility Void (Screen Reader Black Hole)

**What goes wrong:**
Canvas elements are invisible to screen readers by default — no role, no name, no accessible content. A page section whose primary visual content is a WebGL canvas provides zero information to assistive technology users. This violates WCAG 1.1.1 (Non-text Content) and 4.1.2 (Name, Role, Value). The WCAG AA requirement in the constraints is not satisfied by adding `aria-hidden="true"` — that only removes the element from the tree entirely, which is only acceptable if the canvas is purely decorative.

**Why it happens:**
Canvas elements have no implicit ARIA role. Screen readers treat them as generic containers with no content. Developers add `aria-hidden` to suppress screen reader noise, which is correct for purely decorative canvases but incorrect for canvases conveying information (data visualizations, interactive 3D objects, mood-setting hero content that establishes context).

**How to avoid:**
- For purely decorative canvases (background noise, ambient generative texture): `aria-hidden="true"` is correct.
- For canvases that convey content or mood (hero SIGNAL layer, project showcase visuals): add `role="img"` and `aria-label="[descriptive label]"`.
- For interactive canvases: expose an accessible text alternative via a visually hidden element adjacent to the canvas, or use the shadow DOM approach to mirror semantic structure.
- Audit each canvas component against this decision tree: Decorative → `aria-hidden`. Informational → `role="img" aria-label`. Interactive → full accessible equivalent.

**Warning signs:**
- axe or NVDA reports canvas elements with no accessible name
- VoiceOver skips canvas content with no announcement
- Lighthouse accessibility category drops below 100

**Phase to address:**
Phase 1 (Generative SIGNAL Foundation) — establish the accessibility classification (decorative vs. informational) as a required field in every canvas component's spec. The answer must be decided at design time, not added as an afterthought.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| One renderer per canvas component | Simpler component isolation | Context exhaustion, memory leak on route change | Never — use shared renderer from day one |
| Skip `dispose()` on scene teardown | Faster development iteration | Progressive VRAM leak, eventual crash | Never in production |
| Import Three.js at module level (not dynamic) | Simpler import syntax | Blows 200KB bundle budget, Lighthouse regression | Never — always `next/dynamic` with `ssr: false` |
| Use `renderer.setAnimationLoop` instead of GSAP ticker | Three.js "just works" | Frame timing conflicts with GSAP ScrollTrigger, visual jitter | Never when GSAP ScrollTrigger is in use |
| Pass OKLCH CSS values directly to shader uniforms | No color bridge to build | Wrong colors, FRAME/SIGNAL color contract broken | Never |
| Skip reduced-motion check on generative components | Simpler component code | WCAG violation, legal accessibility risk | Never in public-facing output |
| Run render loop when canvas is off-screen | Simpler animation code | Mobile battery drain, thermal throttling | Never — always IntersectionObserver |
| `aria-hidden` on all canvases | Suppresses screen reader noise | WCAG 1.1.1 violation if canvas conveys content | Only for purely decorative canvases |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Three.js + GSAP ticker | Running two independent RAF loops | Drive `renderer.render()` from inside `gsap.ticker.add()` |
| Three.js + Lenis | Not integrating Lenis RAF with GSAP ticker | Call `lenis.raf(time)` inside `gsap.ticker.add()`, same loop as Three.js render |
| Three.js + Next.js App Router | Module-level imports causing SSR errors | Always `next/dynamic({ ssr: false })` — never top-level import in shared files |
| Three.js + React route changes | Not disposing renderer on unmount | `useEffect` cleanup: `renderer.forceContextLoss(); renderer.dispose()` |
| OKLCH tokens + GLSL shaders | Passing CSS oklch() strings to uniforms | Use DOM canvas probe to convert to linear sRGB before passing as uniform |
| Three.js + Turbopack (Next.js 15) | ESM/CJS interop issues with some Three.js addons | Verify addon imports are ESM-compatible; use `transpilePackages` if needed |
| GSAP ScrollTrigger + Three.js | Updating uniforms in `onUpdate` after render call | Write all uniform updates in `onUpdate`, render last in ticker |
| Canvas + Lighthouse | Canvas element in LCP candidate causing score regression | Ensure canvas loads async and is not the LCP element; place above-fold text in DOM |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Continuous render loop (no pause) | Mobile battery drain, thermal throttle | IntersectionObserver → `setAnimationLoop(null)` off-screen | Immediately on mobile |
| High DPR canvas (devicePixelRatio 3+) | GPU overload on retina mobile, frame drops | Cap at `Math.min(dpr, 1.5)` | iPhone Pro / high-DPR Android |
| Many draw calls per frame | FPS drops progressively as scene grows | Instancing, geometry merging, frustum culling | Scene complexity scales |
| Shader recompilation on hot path | Frame hitches during animation | Compile shaders once at init, cache materials | First frame or material changes |
| Three.js in initial JS chunk | LCP > 1.0s, TBT spike, Lighthouse regression | `next/dynamic({ ssr: false })`, bundle analyzer CI gate | Always — from first addition |
| Texture loading blocking render | Blank canvas then pop-in | Preload textures with `TextureLoader.load()` before scene start | Any textured geometry |
| Unbounded particle/vertex count | FPS drops on mid-range hardware | Fixed max counts (e.g., 10k particles), LOD for complex geometry | Mid-range mobile, integrated GPU |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| SIGNAL dominates FRAME on load | User cannot read content until generative animation settles | FRAME content must be readable at t=0; SIGNAL layers in afterward |
| Canvas pop-in after lazy load | Layout shift (CLS), jarring appearance | Reserve canvas space with fixed dimensions before load, use `<Suspense>` fallback |
| Generative content causes reading context loss | User loses their place in content when SIGNAL distracts | SIGNAL must be ambient, not focal; motion hierarchy: content > signal |
| No static fallback for JS-disabled users | Blank section, broken layout | CSS background fallback for all canvas sections (already a SIGNAL-SPEC.md contract) |
| Canvas cursor overrides system cursor without indication | Confusing, feels broken for some users | `[data-cursor]` activation must have CSS fallback cursor |

---

## "Looks Done But Isn't" Checklist

- [ ] **Canvas component:** Verify `renderer.dispose()` and `renderer.forceContextLoss()` are called on component unmount — not just scene.clear()
- [ ] **Bundle budget:** Run `@next/bundle-analyzer` and confirm Three.js is NOT in the main/shared chunk
- [ ] **SSR safety:** Run `next build` — any `window is not defined` error means a non-dynamic import leaked
- [ ] **Reduced-motion:** Toggle `prefers-reduced-motion: reduce` in OS — verify canvas animation halts and shows intentional static state
- [ ] **Mobile battery:** Open Chrome DevTools → Performance → record 2 minutes on mobile emulation — verify frame budget and no thermal indicators
- [ ] **Context count:** Open multiple pages with canvases — verify no "Too many active WebGL contexts" warning in console
- [ ] **OKLCH color parity:** Visually compare canvas colors against adjacent CSS elements using same tokens — should match
- [ ] **Accessibility:** Run axe → no canvas elements without `aria-hidden` or `role="img" aria-label`
- [ ] **Lenis + Three.js loop:** Verify scroll smoothness — no one-frame-behind jitter on ScrollTrigger-driven 3D elements
- [ ] **CLS:** Measure with WebPageTest — canvas lazy load must not cause layout shift (placeholder required)

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Context exhaustion (multiple renderers) | HIGH | Audit all canvas components, refactor to shared renderer singleton, test all route transitions |
| GPU memory leak | MEDIUM | Add disposal traversal to all unmount effects, verify with renderer.info.memory in DevTools |
| SSR/hydration failure in production | HIGH | Move all Three.js imports behind `next/dynamic({ ssr: false })`, audit shared utility files |
| Bundle budget blown | MEDIUM | Move to `next/dynamic`, run bundle analyzer, verify chunk separation, re-run Lighthouse |
| GSAP/Three.js frame conflict | MEDIUM | Refactor to single ticker pattern, remove `setAnimationLoop`, test ScrollTrigger scrub |
| OKLCH color mismatch in shaders | LOW | Implement DOM canvas probe utility, update all shader uniform setters |
| Reduced-motion violation | LOW | Add `matchMedia` detection to base canvas template, define static states for each component |
| Accessibility audit failure | LOW-MEDIUM | Classify each canvas (decorative vs. informational), add appropriate ARIA attributes |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| WebGL context exhaustion | Phase 1: Generative SIGNAL Foundation — shared renderer architecture | Navigate between all pages with canvases, check console for context warnings |
| GPU memory leak | Phase 1: Generative SIGNAL Foundation — disposal contract in component template | Monitor `renderer.info.memory` across route navigations |
| SSR hydration failure | Phase 1: Generative SIGNAL Foundation — `next/dynamic` import pattern | Run `next build`; zero `window is not defined` errors |
| GSAP + Three.js loop conflict | Phase 1: Generative SIGNAL Foundation — unified ticker architecture | Verify ScrollTrigger scrub smoothness on 3D elements |
| Bundle budget regression | Phase 1: Generative SIGNAL Foundation — bundle analyzer gate | `@next/bundle-analyzer` shows Three.js in async chunk only |
| OKLCH color mismatch | Phase 1: Generative SIGNAL Foundation — color bridge utility | Visual comparison: canvas vs. adjacent CSS element |
| Mobile battery drain | Phase 1: Generative SIGNAL Foundation — IntersectionObserver pause in template | 2-minute mobile DevTools performance trace |
| Reduced-motion violation | Phase 1: Generative SIGNAL Foundation — detection in template | OS reduced-motion toggle → canvas halts |
| Canvas accessibility void | Phase 1: Generative SIGNAL Foundation — ARIA classification per component | axe scan → zero canvas accessibility violations |
| Performance regression on existing pages | Phase 2: SIGNAL Activation (dormant effects) — Lighthouse regression gate | Full Lighthouse run before and after each canvas addition |

---

## Sources

- [Chrome WebGL context limits (Chromium issue tracker)](https://issues.chromium.org/issues/40939743)
- [Firefox WebGL context limits (Mozilla Bugzilla)](https://bugzilla.mozilla.org/show_bug.cgi?id=790138)
- [Three.js dispose guidance (three.js forum)](https://discourse.threejs.org/t/dispose-things-correctly-in-three-js/6534)
- [When to dispose: complete Three.js scene cleanup (three.js forum)](https://discourse.threejs.org/t/when-to-dispose-how-to-completely-clean-up-a-three-js-scene/1549)
- [React Three Fiber context loss on route change (GitHub)](https://github.com/pmndrs/react-three-fiber/issues/3176)
- [Three.js memory leak fixes (Mindful Chase)](https://www.mindfulchase.com/explore/troubleshooting-tips/frameworks-and-libraries/fixing-performance-drops-and-memory-leaks-in-three-js-applications.html)
- [100 Three.js performance tips (Utsubo, 2026)](https://www.utsubo.com/blog/threejs-best-practices-100-tips)
- [GSAP ticker documentation](https://gsap.com/docs/v3/GSAP/gsap.ticker/)
- [GSAP + Three.js animation conflict (GSAP community)](https://gsap.com/community/forums/topic/34228-threejs-and-gsap-conflict-animation/)
- [Building interactive WebGL with Next.js (Vercel)](https://vercel.com/blog/building-an-interactive-webgl-experience-in-next-js)
- [Next.js lazy loading guide](https://nextjs.org/docs/app/guides/lazy-loading)
- [WebGL best practices (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)
- [prefers-reduced-motion + JavaScript (W3C WCAG technique SCR40)](https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR40)
- [Accessible animation design (Pope Tech, 2025)](https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/)
- [Canvas ARIA role=img (MDN)](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/img_role)
- [WebGL mobile battery drain and thermal throttling (Pixel Free Studio)](https://blog.pixelfreestudio.com/webgl-in-mobile-development-challenges-and-solutions/)
- [OKLCH in CSS — why and how (Evil Martians)](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)
- [GLSL color space conversion library (tobspr)](https://github.com/tobspr/GLSL-Color-Spaces)
- [Fixing WebGL scroll jank (Psychoactive)](https://www.psychoactive.co.nz/content-hub/fixing-scrolling-jank-in-webgl-using-curtain-js-and-virtual-scroll)
- [Next.js package bundling guide](https://nextjs.org/docs/app/guides/package-bundling)

---
*Pitfalls research for: Generative/3D visual layer added to SignalframeUX design system*
*Researched: 2026-04-05*
