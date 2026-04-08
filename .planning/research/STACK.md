# Stack Research

**Domain:** Design system showcase + creative portfolio (Next.js 15 / React 19)
**Researched:** 2026-04-07
**Scope:** NEW capabilities only — v1.5 Redesign (scroll-driven typographic animation, full-viewport GLSL heroes, FRAME/SIGNAL demo, coded nomenclature catalog, specimen-style subpages, Awwwards SOTD-level scroll experiences)
**Confidence:** HIGH (claims verified against official GSAP docs, npm registry, official Three.js docs, and direct codebase inspection)

---

## Context: What This Covers

This is an additive stack document for the v1.5 milestone. The validated v1.4 baseline is:

- Next.js 15.3, TypeScript 5.8, Tailwind CSS v4, CVA, Radix UI via shadcn
- GSAP 3.14.2 + @gsap/react 2.1.2 (ScrollTrigger, SplitText, ScrambleText, Flip, CustomEase, DrawSVGPlugin already registered)
- Lenis 1.1.20 (smooth scroll, GSAP ticker-driven via `autoRaf: false`)
- Three.js 0.183.2 + SignalCanvas singleton (scissor/viewport rendering, single WebGL context)
- shiki 4.0.2, OKLCH color space, 49-item component registry, 100-107 KB shared bundle

**GSAP licensing:** As of May 2025, GSAP 3.13+ is 100% free for commercial use including all previously Club-only plugins (ScrollSmoother, SplitText, MorphSVG, etc.). Current installed version is 3.14.2. All plugins listed in `node_modules/gsap/` are already available — no new GSAP purchase or subscription needed.

---

## Recommended Stack

### No New Runtime Dependencies Required

The v1.5 feature set is achievable entirely within the existing dependency graph. Every required capability is already present in the installed packages — this milestone is a configuration and implementation exercise, not a dependency addition exercise.

| Feature | Implementation Path | Required Package | Status |
|---------|--------------------|--------------------|--------|
| Scroll-driven typographic animation (200-300vh) | GSAP ScrollTrigger `pin + scrub + end: "+=300vh"` + SplitText `mask: "chars"` | `gsap` (3.14.2) | Already installed |
| Full-viewport GLSL hero variants | Extend `GLSLHero` — new fragment shader variants via `useSignalScene` + SignalCanvas singleton | `three` (0.183.2) | Already installed |
| Multiple WebGL scenes one page | SignalCanvas scissor/viewport architecture already handles this — IntersectionObserver gates rendering per scene | `three` (0.183.2) | Architecture already handles it |
| Interactive FRAME/SIGNAL separation demo | CSS `isolation: isolate` + GSAP `gsap.to()` on opacity/transform + `data-layer` attributes — no new dep | `gsap` (3.14.2) | Already installed |
| Coded nomenclature catalog | Static data structure + `SFText`, `SFGrid`, `SFContainer` from SF layer — no new dep | None | CSS + components only |
| Specimen-style token visualization | Extend `TokenViz` component + `token-viz.tsx` — already renders CSS custom property values | None | Extend existing component |
| Awwwards-level scroll pinning | ScrollTrigger `pin: true`, `pinSpacing`, `snap`, `invalidateOnRefresh` — already in installed GSAP | `gsap` (3.14.2) | Already installed |
| GSAP Observer (gesture/velocity) | Bundled inside ScrollTrigger — `ScrollTrigger.observe()` is identical to `Observer.create()` | `gsap` (3.14.2) | Already installed, not registered |

### GSAP Plugin Activation (Zero New Packages)

The only stack action needed is registering `Observer` in the appropriate `gsap-*` entry point. Observer is already in `node_modules/gsap/Observer.js` — it just needs to be imported and registered.

**Add to `lib/gsap-plugins.ts`** (the full plugin bundle used by complex components):

```typescript
import { Observer } from "gsap/Observer";
gsap.registerPlugin(Observer);
export { Observer };
```

Observer is already bundled inside ScrollTrigger, so this is zero additional bundle cost when ScrollTrigger is already registered. The explicit import is cleaner for TypeScript types.

### ScrollSmoother Decision: Keep Lenis

ScrollSmoother (previously Club-only, now free in 3.13+) is available but should NOT replace Lenis for this project. Lenis is already integrated with the GSAP ticker (`autoRaf: false`, Lenis RAF → `gsap.ticker.add()`) and is validated at Lighthouse 100/100. Introducing ScrollSmoother would require:

1. Removing Lenis entirely (it conflicts with ScrollSmoother — two smooth scroll systems)
2. Rebuilding all ScrollTrigger proxy configuration
3. Re-testing Lighthouse

**Decision: keep Lenis.** The ScrollTrigger + Lenis integration pattern in this codebase is already correct and battle-tested.

---

## ScrollTrigger Patterns for v1.5 Features

### Pattern 1: Extended Pin + Scrub (200-300vh typographic animation)

The core architecture for scroll-driven type sequences. Pin the section, scrub a GSAP timeline through the scroll distance.

```typescript
// lib/gsap-core.ts — already registered
// Use in a new component: components/animation/signal-type-sequence.tsx

const tl = gsap.timeline();

// Build the timeline: proportional durations determine scroll pacing
// A tween that takes 2 units plays for 2x longer in the scroll window than a 1-unit tween
tl.from(chars, { y: "120%", stagger: 0.02, duration: 1 })
  .to(words, { opacity: 0.15, stagger: 0.05, duration: 0.5 }, "+=0.2")
  .from(nextChars, { x: "-40%", opacity: 0, stagger: 0.03, duration: 1 }, "-=0.2");

ScrollTrigger.create({
  trigger: sectionRef.current,
  pin: true,              // Pin section while scrolling through it
  start: "top top",       // Lock when section top hits viewport top
  end: "+=2400",          // 300vh at 8px/px — extend the pin window
  scrub: 1.5,             // 1.5s smoothing lag (avoid jerky type)
  animation: tl,          // Link timeline directly
  invalidateOnRefresh: true, // Recalculate on resize (required with SplitText)
});
```

**Key constraint:** When using `pin: true`, never animate the pinned element itself — animate its children. GSAP's pinning wraps the element; animating it breaks measurements. Always animate the inner content container.

**SplitText with mask (3.13+ API — already installed):**

```typescript
SplitText.create(headingRef.current, {
  type: "chars,words,lines",
  mask: "chars",          // Auto-wraps each char in overflow:hidden container
  autoSplit: true,        // Re-splits on container resize (required for scrub + pin combos)
  onSplit(self) {
    // Build tween against self.chars, self.words, self.lines
    // These arrays are available immediately for timeline construction
  }
});
```

The `mask: "chars"` option was added in SplitText 3.13.0 (confirmed in GSAP community docs). This project already has 3.14.2 installed — this is a zero-upgrade capability.

### Pattern 2: Nested Pinning with pinnedContainer

When a scroll-driven type sequence sits inside an outer pinned section (e.g., a hero that is itself pinned), use `pinnedContainer`:

```typescript
ScrollTrigger.create({
  trigger: innerRef.current,
  pinnedContainer: outerPinnedRef.current, // Essential — without this, offsets are wrong
  start: "top center",
  end: "top 20%",
  scrub: 1,
});
```

Missing `pinnedContainer` is the #1 cause of misaligned scrub animations in nested pin scenarios.

### Pattern 3: Observer for FRAME/SIGNAL Interactive Demo

The FRAME/SIGNAL separation demo needs gesture-based interaction (drag to reveal, swipe to toggle layers). Observer is the right tool — not ScrollTrigger, which is position-based.

```typescript
import { Observer } from "gsap/Observer";

// Already bundled in ScrollTrigger — just import the class for types
const obs = Observer.create({
  target: demoRef.current,
  type: "pointer,touch",
  onDrag: (self) => {
    // self.deltaX gives drag distance — drive layer opacity/translate
    const progress = Math.max(0, Math.min(1, self.x / containerWidth));
    gsap.set(signalLayerRef.current, { opacity: progress });
    gsap.set(frameLayerRef.current, { opacity: 1 - progress * 0.5 });
  },
  onDragEnd: () => {
    // Snap to nearest clean state
    gsap.to(signalLayerRef.current, { opacity: progress > 0.5 ? 1 : 0, duration: 0.3, ease: "power2.out" });
  },
});
```

### Pattern 4: Snap Scroll Between Sections

For Awwwards-level section transitions — snapping to labeled positions in a pinned timeline:

```typescript
ScrollTrigger.create({
  trigger: containerRef.current,
  pin: true,
  end: "+=4000",
  scrub: true,
  animation: masterTimeline,
  snap: {
    snapTo: "labels",           // Snap to gsap timeline label positions
    duration: { min: 0.2, max: 0.8 },
    ease: "power1.inOut",
    delay: 0.05,
  },
});
```

---

## Multiple WebGL Scenes: Architecture + Constraints

### What Already Works

The SignalCanvas singleton architecture (`lib/signal-canvas.tsx`) already implements the correct pattern for multiple WebGL scenes:

1. Single `WebGLRenderer` instance (one GPU context — avoids the browser ~8 context limit)
2. Scissor/viewport split per scene (`renderer.setScissor` + `renderer.setViewport`)
3. IntersectionObserver per scene — offscreen scenes skip the render loop entirely
4. Single GSAP ticker drives all rendering (no separate `requestAnimationFrame` loops)

This is exactly the pattern endorsed by WebGL Fundamentals and used in production by pmndrs/react-three-scissor. No architecture change is needed.

### Performance Budget for Multiple GLSL Hero Scenes

Running 2-4 full-viewport GLSL scenes on a single page is viable with these constraints:

| Constraint | Budget | Current GLSLHero Status |
|------------|--------|-------------------------|
| Total draw calls per frame | Under 100 | Each GLSL scene = 1 draw call (full-screen quad). 4 scenes = 4 draw calls. Well within budget. |
| GPU memory per shader | Minimal — FBM shaders use no textures | GLSLHero: 0 texture allocations, 1 geometry, 1 material |
| Shader compilation | Happens once at scene register | Each unique GLSL variant compiles once on mount, not per frame |
| Pixel ratio | `Math.min(devicePixelRatio, 2)` | Already capped in `initSignalCanvas` — prevents GPU overload on 3x displays |

**Key risk: shader permutation proliferation.** If each hero variant has unique GLSL source, each compiles a new shader program. 4 scenes × 1 unique shader each = 4 GPU programs (fine). Avoid dynamic GLSL string interpolation — it generates new programs per render.

**Correct pattern for hero variants:**

```typescript
// Use uniforms to differentiate behavior — ONE shader, many configurations
// The existing GLSLHero already does this correctly via uIntensity, uGridDensity, uAccent

// DO: vary behavior via uniforms
uniforms.uMode.value = 1; // "mode 1" vs "mode 2" behavior branched in GLSL

// DO NOT: generate new shader source strings per variant
const shader = `... ${condition ? "line A" : "line B"} ...`; // Creates new GPU program each time
```

**Dispose discipline:** The existing `disposeScene()` in `signal-canvas.tsx` already handles `geometry.dispose()`, `material.dispose()`, and texture traversal. When a hero component unmounts, `useSignalScene`'s cleanup calls this correctly. No change needed.

### When Multiple Scenes Becomes a Problem

The scissor architecture handles 2-4 scenes comfortably. If the v1.5 page puts 6+ concurrent visible GLSL scenes in the viewport simultaneously, re-evaluate. The IntersectionObserver visibility gate already prevents offscreen scenes from running, so the real constraint is how many scenes are visible at the same time.

At 100vh sections with smooth scroll: maximum 2 scenes visible simultaneously (current section + next peeking in). This is safe.

---

## FRAME/SIGNAL Layer Separation Demo

### CSS Architecture (No New Deps)

The interactive layer separation demo can be built entirely with CSS isolation properties and GSAP tweens:

```css
/* Container creates a new stacking context */
.signal-frame-demo {
  isolation: isolate; /* New stacking context — prevents blend bleed-through */
}

/* FRAME layer: structural, always legible */
[data-layer="frame"] {
  position: absolute;
  inset: 0;
  mix-blend-mode: normal;
  /* Grid lines, type, structural elements */
}

/* SIGNAL layer: generative, parametric */
[data-layer="signal"] {
  position: absolute;
  inset: 0;
  mix-blend-mode: screen; /* Or multiply — depends on desired effect */
  /* WebGL canvas, noise field, color field */
}
```

GSAP drives the reveal on drag (Observer pattern above) or on scroll (ScrollTrigger scrub). The `isolation: isolate` on the container confines the `mix-blend-mode` to the demo's stacking context and prevents it from bleeding into page elements.

### No React State for Animation Values

Drive the layer separation via GSAP directly mutating CSS properties or `data-` attributes — not React `useState`. Setting state in an `onDrag` callback at 60fps causes excessive re-renders. GSAP's direct DOM mutation avoids this.

---

## Coded Nomenclature Catalog

### Implementation (Zero New Deps)

This is a structured data problem, not a new package problem. The existing `component-registry.ts` pattern scales directly to a nomenclature catalog.

**Data shape:**

```typescript
// lib/nomenclature-catalog.ts
export type NomenclatureEntry = {
  code: string;         // "SF-01", "SIG-A", "FRM-3"
  term: string;         // Human-readable name
  layer: "FRAME" | "SIGNAL" | "SYSTEM";
  definition: string;   // 1-2 sentence description
  related: string[];    // Other entry codes
  examples?: string[];  // Usage examples
};

export const NOMENCLATURE: NomenclatureEntry[] = [ /* ... */ ];
```

**Rendering:** Use `SFGrid`, `SFText`, `SFContainer` from the SF layer. Index alphabetically by `code`. Filter by `layer`. The existing `SFBadge` or a simple `data-badge` pattern handles the layer tag.

**No virtualization needed.** The catalog is a bounded, known dataset (not user-generated infinite data). Standard DOM rendering is fine.

---

## Specimen-Style Token Visualization

### Extend `token-viz.tsx` (Existing Component)

The existing `TokenViz` component (`components/animation/token-viz.tsx`, 259 lines) already renders CSS custom property values. Specimen-style visualization means extending the visual treatment — not adding packages.

**Specimen patterns to implement:**

| Specimen Type | Implementation | New Dep? |
|--------------|---------------|----------|
| Type scale specimen | Render each `--text-*` token as live text at that scale | No |
| Color specimen | Render swatches using `background: var(--color-*)` | No |
| Spacing specimen | Render boxes with `height: var(--spacing-*)`, label with pixel value | No |
| Easing specimen | GSAP `gsap.to()` on a test element using each `--ease-*` var | No — GSAP already installed |
| Duration specimen | GSAP tween with each `--duration-*` value, visual timing comparison | No — GSAP already installed |
| Animation specimen | Replay `ScrollReveal` / `SignalMotion` with live controls | No |

For easing/duration specimens: GSAP's `CustomEase` can parse the CSS `cubic-bezier()` value from `getComputedStyle()` and run a tween. This creates an interactive visual proof that the token equals the animation.

---

## What NOT to Add

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `ScrollSmoother` | Conflicts with Lenis — can't run two smooth scroll systems. Lenis is validated at Lighthouse 100/100. Migration risk with no gain. | Lenis (existing) |
| `framer-motion` / `motion` | Second animation system conflicts with `gsap.globalTimeline.timeScale(0)` reduced-motion kill switch. All animation runs through GSAP. | GSAP (existing) |
| `@react-three/fiber` | R3F abstracts Three.js in a way that conflicts with the manual SignalCanvas singleton architecture. Adding R3F would require replacing the entire WebGL layer — a rewrite, not an addition. | Three.js direct (existing) |
| `@react-three/drei` | Same reason as R3F. Additionally, Drei pulls in heavy optional dependencies. | Three.js direct (existing) |
| `react-spring` | Third animation system. No. | GSAP (existing) |
| `lottie-react` | Pre-baked animations contradict the DU/TDR real-time generative aesthetic. | GSAP + Three.js (existing) |
| CSS native scroll-driven animations (`animation-timeline: scroll()`) | Firefox support as of April 2026 is still absent for the full spec. Cannot be used as primary mechanism — only as progressive enhancement. Lighthouse performance advantage is real but insufficient to justify cross-browser breakage at this audience target. | GSAP ScrollTrigger (existing) |
| `WebGPU` / `THREE.WebGPURenderer` | Three.js WebGPU renderer is not production-stable as of 0.183. Safari WebGPU support is partial. The existing WebGL + Bayer dither aesthetic would need to be re-validated. | THREE.WebGLRenderer (existing) |
| Any additional npm package for the nomenclature catalog | Structured data in a TypeScript file needs no package. Adding a CMS or headless data layer for a bounded design system catalog is over-engineering. | `lib/nomenclature-catalog.ts` (new file, zero deps) |

---

## Bundle Impact Assessment

**Baseline:** 107-110 KB shared JS (estimated v1.4 end state). Target: stay under 150 KB gate. Lighthouse 100/100 target maintained.

| Change | Initial Bundle Impact | Strategy |
|--------|----------------------|----------|
| Observer registration in `gsap-plugins.ts` | 0 KB (Observer is already inside ScrollTrigger's bundle) | Just import the type — no new code shipped |
| New GLSL hero variants | 0 KB JS (shader source is a string literal, not a separate file) | GLSL stays inline as template literals in the component |
| FRAME/SIGNAL demo component | ~2-4 KB (new component, no deps) | Standard RSC → client boundary pattern |
| Nomenclature catalog data | ~3-8 KB (TypeScript object, tree-shaken to only used entries) | Static data file, imported server-side |
| Extended TokenViz specimen views | ~1-2 KB (extending existing 259-line component) | Same component, new render branches |
| `lib/gsap-split.ts` additions (mask API) | 0 KB (capability is already in installed SplitText) | API call change, no new code shipped |

**Projected bundle after v1.5:** ~115-125 KB — comfortably under 150 KB gate. Lighthouse 100/100 maintained given no new client JS packages are added.

---

## Alternatives Considered

| Recommended | Alternative | Why Not |
|-------------|-------------|---------|
| GSAP ScrollTrigger `pin + scrub` | CSS `animation-timeline: scroll()` native | No Firefox support as of April 2026. Cannot be used as primary scroll driver for an audience that includes Firefox users. |
| Extend GLSLHero with uniform variants | Multiple separate Three.js renderers | Browser limits WebGL contexts to ~8. Multiple renderers = GPU memory duplication per shader, per geometry. The scissor architecture avoids this entirely. |
| GSAP Observer for FRAME/SIGNAL drag demo | Custom `pointerdown`/`pointermove` handlers | Observer normalizes touch/mouse/pointer events, handles velocity, and provides `deltaX`/`deltaY` already calibrated. Reimplementing this is 100+ lines of boilerplate for the same result. |
| Lenis (keep existing) | Replace with ScrollSmoother | ScrollSmoother uses CSS `translate` to fake smooth scroll — it does not use native scrolling. This can cause ScrollTrigger position calculation discrepancies. Lenis drives native scroll position. The existing Lenis + ScrollTrigger integration is verified at Lighthouse 100. Migration risk is unjustified. |
| Static TypeScript data for nomenclature | Contentful / Sanity CMS | A design system's internal nomenclature is not user-editable content. A CMS adds API latency, auth, and runtime dependency for data that changes during development only. |
| Three.js direct | @react-three/fiber | R3F's reconciler conflicts with the manual scene registration pattern in `lib/signal-canvas.tsx`. R3F assumes it owns the renderer. This project's SignalCanvas singleton architecture is more efficient for the scissor-multi-scene use case. |

---

## Sources

- `node_modules/gsap/package.json` — version 3.14.2, all plugins present (HIGH confidence — direct codebase inspection)
- `node_modules/gsap/Observer.js`, `node_modules/gsap/ScrollSmoother.js` — confirmed present (HIGH confidence — direct inspection)
- [GSAP now 100% free — CSS-Tricks](https://css-tricks.com/gsap-is-now-completely-free-even-for-commercial-use/) — confirms all plugins free as of May 2025 / v3.13 (HIGH confidence)
- [GSAP ScrollTrigger docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) — `pin`, `pinnedContainer`, `scrub`, `end`, `snap`, `invalidateOnRefresh` API (HIGH confidence — official docs)
- [GSAP Observer docs](https://gsap.com/docs/v3/Plugins/Observer/) — `type`, `onDrag`, `deltaX`, velocity API. Confirmed: Observer is bundled inside ScrollTrigger (HIGH confidence — official docs)
- [GSAP SplitText docs](https://gsap.com/docs/v3/Plugins/SplitText/) — `mask: "chars"` added in 3.13.0, `autoSplit: true` (HIGH confidence — official docs, version confirmed in installed package)
- [Codrops: Building Efficient Three.js Scenes (Feb 2025)](https://tympanus.net/codrops/2025/02/11/building-efficient-three-js-scenes-optimize-performance-while-maintaining-quality/) — draw call budget <100, dispose discipline, shared renderer pattern (MEDIUM confidence — editorial source, consistent with Three.js docs)
- [WebGL Fundamentals: Multiple Views](https://webglfundamentals.org/webgl/lessons/webgl-multiple-views.html) — scissor/viewport pattern for multiple scenes, one canvas (HIGH confidence — authoritative WebGL reference)
- [Lenis compatibility with ScrollTrigger — GSAP forum](https://gsap.com/community/forums/topic/43737-lenis-scroll-and-gsap-compatibility/) — confirmed coexistence pattern with `autoRaf: false` (MEDIUM confidence — community forum, consistent with installed codebase implementation)
- `lib/signal-canvas.tsx`, `hooks/use-signal-scene.ts`, `components/animation/glsl-hero.tsx` — existing SignalCanvas architecture (HIGH confidence — direct codebase inspection)
- `lib/gsap-plugins.ts`, `lib/gsap-core.ts`, `lib/gsap-split.ts`, `lib/gsap-flip.ts`, `lib/gsap-draw.ts` — current plugin registration state (HIGH confidence — direct codebase inspection)

---

*Stack research for: SignalframeUX v1.5 Redesign milestone*
*Researched: 2026-04-07*
