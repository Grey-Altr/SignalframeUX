# Architecture Research

**Domain:** Generative SIGNAL integration into existing SignalframeUX Next.js 15.3 design system
**Researched:** 2026-04-05
**Confidence:** HIGH (existing codebase verified, WebGL constraints from MDN + browser vendors, patterns from R3F official docs)

---

## Existing Architecture Baseline

Before addressing integration, the current system must be understood precisely. The decisions below are constrained by it.

### Current Rendering Stack

```
┌──────────────────────────────────────────────────────────────────┐
│                     Next.js 15.3 App Router                      │
│                    Server Components default                      │
├──────────────────────────────────────────────────────────────────┤
│  RootLayout (Server)                                             │
│  ├── LenisProvider ('use client' — smooth scroll)                │
│  ├── TooltipProvider (Radix, 'use client')                       │
│  ├── GlobalEffectsLazy (next/dynamic ssr:false)                  │
│  │    └── GlobalEffects ('use client')                           │
│  │         ├── VHSOverlay — GSAP + CSS, fixed overlay            │
│  │         ├── CanvasCursor — Canvas 2D, fixed full-viewport     │
│  │         ├── ScrollProgress, ScrollToTop, VHSBadge, IdleOverlay│
│  ├── PageAnimations ('use client' — GSAP ScrollTrigger)          │
│  └── PageTransition ('use client' — GSAP page wipes)            │
├──────────────────────────────────────────────────────────────────┤
│                     Page-level Components                        │
│  ├── Server Components: SF layout primitives, blocks             │
│  │    SFContainer, SFSection, SFStack, SFGrid, SFText            │
│  └── Client Components (animation/): HeroMesh, CircuitDivider,   │
│       ScrambleText, SplitHeadline, ScrollReveal, ColorCycleFrame │
├──────────────────────────────────────────────────────────────────┤
│                     GSAP Bundle Split                            │
│  gsap-core.ts     — gsap + ScrollTrigger + useGSAP (lightweight) │
│  gsap-plugins.ts  — + SplitText, ScrambleText, Flip, CustomEase  │
│  gsap-draw.ts     — + DrawSVG (CircuitDivider only)              │
├──────────────────────────────────────────────────────────────────┤
│                     Canvas Layer                                 │
│  CanvasCursor — Canvas 2D, fixed z-index 9999, full-viewport     │
│  HeroMesh     — Canvas 2D, absolute, parent-scoped               │
│  Both use: IntersectionObserver scoping, rAF pause on hidden tab  │
│  OKLCH→RGB: probe 1×1 canvas (fillStyle + getImageData)          │
└──────────────────────────────────────────────────────────────────┘
```

### Critical Existing Constraints

| Constraint | Source | Implication for Generative Layer |
|------------|--------|----------------------------------|
| `CanvasCursor` holds one Canvas 2D context, fixed viewport | `canvas-cursor.tsx` | A WebGL renderer is a second context; must budget carefully |
| `HeroMesh` holds one Canvas 2D context, parent-scoped | `hero-mesh.tsx` | Hero slot already has a canvas consumer |
| Browser WebGL context limit: ~8–16 (Chrome ≈16, Safari ≈8) | MDN, Chromium issue tracker | **Hard ceiling.** Multiple WebGL components across page sections will hit this |
| GlobalEffectsLazy pattern (next/dynamic ssr:false) | `global-effects-lazy.tsx` | The correct loading pattern for all browser-only rendering |
| GSAP global timeline scalar for reduced-motion | `gsap-plugins.ts` | Any generative loop must respect this or opt into its own guard |
| `data-anim`, `data-section`, `data-cursor` attributes | CLAUDE.md, existing code | Generative scoping should follow this data attribute convention |
| Page weight budget: <200KB initial (excluding images) | CLAUDE.md | Three.js minified+gzip ≈155KB. This consumes the entire budget if included eagerly |

---

## System Overview: Integrated Generative Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                     SSR Layer (unchanged)                        │
│  Server Components: SF primitives, page shells, metadata         │
│  data-signal="[type]" attribute on generative mount points       │
├──────────────────────────────────────────────────────────────────┤
│                     FRAME Layer (unchanged)                      │
│  SFSection, SFStack, SFGrid, SFContainer, SFText                 │
│  Deterministic structure — no generative behavior                │
├──────────────────────────────────────────────────────────────────┤
│                  SIGNAL Layer — Existing (unchanged)             │
│  Canvas 2D: CanvasCursor (fixed), HeroMesh (hero slot)           │
│  GSAP: VHSOverlay, CircuitDivider, ScrambleText, PageTransition  │
│  CSS: Asymmetric hover, section reveals, stagger                 │
├──────────────────────────────────────────────────────────────────┤
│               SIGNAL Layer — Generative Extension                │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │             SignalCanvas (singleton WebGL host)          │    │
│  │  One WebGLRenderer, fixed full-viewport, z behind FRAME  │    │
│  │  Manages scene multiplexing via scissor/viewport split   │    │
│  │  Coordinates: IntersectionObserver per registered scene  │    │
│  │  Pauses: tab visibility, reduced-motion, mobile          │    │
│  └──────────────────┬──────────────────────────────────────┘    │
│                     │ scene registry                             │
│        ┌────────────┼────────────┐                              │
│        ↓            ↓            ↓                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                        │
│  │ SceneA   │ │ SceneB   │ │ SceneC   │  (Three.js scenes)     │
│  │ Mesh/    │ │ Motion   │ │ Procedural│                        │
│  │ Geo      │ │ Graphic  │ │ Visual   │                        │
│  └──────────┘ └──────────┘ └──────────┘                        │
│                                                                  │
│  GSAP ScrollTrigger → proxy objects → scene uniforms/positions   │
│  No R3F render loop — GSAP drives redraws on-demand             │
└──────────────────────────────────────────────────────────────────┘
```

---

## Component Boundaries

### New Components vs Modified Existing

| Component | New or Modified | Location | Responsibility |
|-----------|----------------|----------|----------------|
| `SignalCanvas` | **New** | `components/animation/signal-canvas.tsx` | Singleton WebGL host. One renderer, viewport-sized, z-index below FRAME. Manages scene registry, scissor splits, IntersectionObserver lifecycle |
| `SignalCanvasLazy` | **New** | `components/layout/signal-canvas-lazy.tsx` | next/dynamic wrapper (ssr:false) for SignalCanvas. Mirrors GlobalEffectsLazy pattern |
| `useSignalScene` | **New** | `hooks/use-signal-scene.ts` | Hook that registers a Three.js scene with SignalCanvas, gets back a render callback and scroll-proxy ref. Used by scene components |
| `SignalMesh` | **New** | `components/animation/signal-mesh.tsx` | First generative scene: parametric 3D mesh/geometry. Uses useSignalScene. GSAP-driven uniforms |
| `SignalMotion` | **New** | `components/animation/signal-motion.tsx` | Motion graphics scene: particle systems, flow fields, data-driven visuals. Uses useSignalScene |
| `GlobalEffectsLazy` | **Not modified** | `components/layout/global-effects-lazy.tsx` | Unchanged. SignalCanvasLazy added alongside it in RootLayout |
| `RootLayout` | **Modified** | `app/layout.tsx` | Add `<SignalCanvasLazy />` alongside `<GlobalEffectsLazy />` |
| `HeroMesh` | **Not modified initially** | `components/animation/hero-mesh.tsx` | Existing Canvas 2D hero mesh stays. Migration to SignalCanvas is Phase 2 work after WebGL pipeline is proven |
| `CanvasCursor` | **Not modified** | `components/animation/canvas-cursor.tsx` | Canvas 2D cursor stays separate. Different z-layer, different lifecycle |

---

## Architectural Patterns

### Pattern 1: Singleton WebGL Renderer with Scene Registry

**What:** One `THREE.WebGLRenderer` owns one WebGL context for the entire application. Individual generative components register named scenes. The renderer uses `setScissor` and `setViewport` to render each scene into its corresponding DOM element's bounding rect during a single render pass.

**When to use:** Always, for all WebGL content in SignalframeUX. Never instantiate a second WebGLRenderer.

**Trade-offs:** More complex scene management in exchange for staying well under the browser's context limit (8–16). Single shared context means shared resource pool — textures and geometries can be reused across scenes.

**Rationale:** The existing codebase already has two Canvas 2D contexts (CanvasCursor + HeroMesh). Adding multiple independent WebGL contexts risks the Safari 8-context ceiling and Chromium's warning at context 9+. The singleton pattern is the only viable path given the constraint.

```typescript
// Signal from a section component:
// Server Component renders mount point with data attribute
<div data-signal="mesh-geo" data-signal-id="hero-3d" aria-hidden="true" />

// Client hook registers with singleton:
function SignalMesh() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { registerScene, unregisterScene } = useSignalCanvas();

  useEffect(() => {
    if (!mountRef.current) return;
    const scene = new THREE.Scene();
    // ... build scene
    const id = registerScene(mountRef.current, scene, camera);
    return () => unregisterScene(id);
  }, []);

  return <div ref={mountRef} data-signal="mesh-geo" aria-hidden="true" />;
}
```

### Pattern 2: GSAP-Driven Render Demand (frameloop: "demand")

**What:** The SignalCanvas render loop does NOT run on every rAF. Instead, `frameloop: "demand"` equivalent — the renderer only redraws when GSAP ScrollTrigger's `onUpdate` fires or when a ticker callback is scheduled. Outside of active scroll or animation, the GPU is idle.

**When to use:** All generative scenes. The existing VHSOverlay and HeroMesh already pause on tab hidden; generative WebGL must do the same and go further by only drawing when GSAP says something changed.

**Trade-offs:** Scenes that need ambient idle animation (grain drift, color pulse — SIG-08) must register themselves with a low-frequency ticker instead of relying on a continuous rAF loop.

**Implementation:** GSAP's `onUpdate` callback in ScrollTrigger gives the scroll progress value. Pass it to scene uniforms, then call `renderer.render(scene, camera)` inside that callback only.

```typescript
// Inside useSignalScene:
ScrollTrigger.create({
  trigger: mountEl,
  start: "top bottom",
  end: "bottom top",
  onUpdate: (self) => {
    scene.userData.scrollProgress = self.progress;
    requestRender(); // signals SignalCanvas to redraw on next rAF
  },
  onLeaveBack: () => { requestRender(); },
  onLeave: () => { requestRender(); },
});
```

### Pattern 3: Server Component Mount Points with data-signal Attributes

**What:** Server Components render semantic, content-safe placeholder divs with `data-signal` attributes. These are zero-JS on the server — just positioned containers. Client-side, `SignalMesh` and `SignalMotion` components hydrate them.

**When to use:** All generative content that sits behind or alongside FRAME content. Preserves SSR output, CLS = 0 (placeholder has same dimensions as rendered visual), and progressive enhancement (if WebGL fails, the placeholder is invisible, FRAME content remains intact).

**Rationale:** Matches existing pattern — `data-section`, `data-anim`, `data-cursor`, `data-bg-shift` are all authored in Server Components and consumed by client-side JS. `data-signal` extends this convention.

```typescript
// In a Server Component block:
export function CaseStudyHero() {
  return (
    <SFSection data-section data-signal-zone>
      <div
        data-signal="procedural-field"
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />
      <SFStack>
        {/* FRAME content — always visible, independent of WebGL */}
        <SFText as="h1" variant="heading-1">Case Study Title</SFText>
      </SFStack>
    </SFSection>
  );
}
```

### Pattern 4: FRAME/SIGNAL Legibility Contract for Generative Output

**What:** Generative visuals are constrained to SIGNAL zones that are physically behind FRAME content (z-index below), with controlled opacity (never above 0.15 for background mesh, never above 0.4 for midground elements). The `SignalCanvas` z-index sits below FRAME content, above the body background.

**When to use:** All generative visuals. Non-negotiable. Generative output is inherently unpredictable — the z-stack and opacity ceiling are the only hard enforcement mechanism.

**The contract in code:**

```typescript
// SignalCanvas fixed canvas — always behind FRAME:
style={{
  position: 'fixed',
  inset: 0,
  zIndex: 'var(--z-signal-canvas, 1)',  // below nav (--z-nav), below cursor (--z-cursor)
  pointerEvents: 'none',
}}

// New z-index tokens in globals.css:
// --z-signal-canvas: 1;    /* generative layer — behind everything */
// --z-frame-content: 10;   /* FRAME text, components */
// --z-cursor: 9999;         /* existing */
```

**Opacity budget:** Background generative meshes max 0.12 opacity. Midground motion graphics max 0.35. Foreground procedural (if any) max 0.6 and only in zones with no readable text.

### Pattern 5: Progressive Enhancement via WebGL Feature Detection

**What:** `SignalCanvasLazy` checks `WebGLRenderingContext` availability before mounting. On failure (WebGL blocked, low-end GPU, fallback browser), it returns null. FRAME content is unaffected. Canvas 2D fallbacks (HeroMesh already exists for hero) remain visible.

**When to use:** SignalCanvas initialization only.

**Trade-offs:** No explicit CSS fallback state needed for generative visuals — they are additive, not structural.

```typescript
// In SignalCanvas useEffect:
const canvas = canvasRef.current;
const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
if (!gl) {
  // WebGL not available — unmount gracefully, FRAME content unaffected
  setWebGLAvailable(false);
  return;
}
```

---

## Data Flow

### Generative Scene Render Flow

```
Page scroll event (Lenis)
    ↓
ScrollTrigger.onUpdate (GSAP)
    ↓
Scene proxy object updated (rotation, uniforms, progress)
    ↓
requestRender() called on SignalCanvas
    ↓
SignalCanvas rAF: forEach(registeredScene) {
    renderer.setScissor(scene.bounds);
    renderer.setViewport(scene.bounds);
    renderer.render(scene.threeScene, scene.camera);
}
```

### Scene Registration Flow

```
Component mounts (useSignalScene)
    ↓
IntersectionObserver created for mount element
    ↓
Scene registered in SignalCanvas registry (Map<id, SceneEntry>)
    ↓
On intersection: bounds cached, scroll-trigger created
    ↓
On leave: scroll-trigger paused, render skipped
    ↓
On unmount: unregisterScene(), observer.disconnect(), geometry.dispose()
```

### OKLCH Color Propagation to Generative Layer

The existing probe canvas technique (1×1 Canvas 2D fillStyle + getImageData) already resolves OKLCH to RGB for CanvasCursor. The same utility must be extended for the generative layer:

```
CSS token: --color-primary (oklch)
    ↓
lib/color-resolve.ts: resolveOklchToRgb(property) → { r, g, b }
    (extracted from canvas-cursor.tsx into shared utility)
    ↓
Three.js uniform: mesh.material.uniforms.uColor.value.set(r/255, g/255, b/255)
    ↓
ColorCycleFrame fires → color stutter → resolve again → update uniform
```

The `resolveOklchToRgb` function should be extracted from canvas-cursor.tsx into `lib/color-resolve.ts` and shared by both the existing cursor and new generative components.

---

## Project Structure — New Files

```
components/
├── animation/
│   ├── signal-canvas.tsx       NEW — singleton WebGL host, scene registry
│   ├── signal-mesh.tsx         NEW — parametric 3D geometry scene
│   ├── signal-motion.tsx       NEW — particle/flow field scene
│   └── hero-mesh.tsx           UNCHANGED (Canvas 2D, migrate later)
│
├── layout/
│   ├── signal-canvas-lazy.tsx  NEW — next/dynamic ssr:false wrapper
│   └── global-effects-lazy.tsx UNCHANGED
│
hooks/
│   └── use-signal-scene.ts     NEW — scene registration hook

lib/
│   ├── color-resolve.ts        NEW — extracted OKLCH→RGB probe utility
│   ├── gsap-core.ts            UNCHANGED
│   └── gsap-plugins.ts         UNCHANGED
```

---

## Integration Points

### External Services / APIs

| Integration | Pattern | Notes |
|-------------|---------|-------|
| Three.js r171+ | `next/dynamic ssr:false` — never server-imported | ~155KB gzip. Load only when WebGL confirmed available. Separate dynamic chunk |
| GSAP ScrollTrigger | Already loaded via gsap-core.ts — no new bundle cost | Connect to Three.js scene via onUpdate proxy pattern |
| Lenis smooth scroll | ScrollTrigger.scrollerProxy already wired via LenisProvider | Generative layer inherits this — no new wiring |
| `@react-three/fiber` (R3F) | NOT RECOMMENDED — see Anti-Pattern 1 | |
| `@react-three/drei` | NOT RECOMMENDED — see Anti-Pattern 1 | |

**Three.js import strategy:** Import raw Three.js, not via R3F. The existing architecture manages its own rAF loop (GlobalEffects, HeroMesh both do this manually). A raw Three.js singleton renderer follows the same pattern and avoids the R3F abstraction layer overhead.

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| SignalCanvas ↔ Scene components | React context + hook (useSignalScene) | Scenes register/unregister via context API — no prop drilling |
| SignalCanvas ↔ GlobalEffects | Both lazy-loaded, rendered in RootLayout body | No communication needed — independent fixed overlays |
| CanvasCursor ↔ SignalCanvas | No shared state | Separate canvases, separate contexts (2D vs WebGL). CanvasCursor stays Canvas 2D |
| ColorCycleFrame ↔ SignalCanvas | Shared color-resolve.ts utility | ColorCycleFrame fires a custom event or calls a ref callback when --color-primary changes; SignalCanvas listens and updates uniforms |
| GSAP globalTimeline ↔ SignalCanvas | `initReducedMotion` scalar = 0 pauses GSAP timelines | SignalCanvas must also check `prefers-reduced-motion` independently — GSAP controls its own timelines, not the WebGL rAF |

---

## Anti-Patterns

### Anti-Pattern 1: Using React Three Fiber (R3F)

**What people do:** Install `@react-three/fiber` and `@react-three/drei`, wrap everything in `<Canvas>`, use hooks like `useFrame`, `useThree`, `useLoader`.

**Why it's wrong for this project:** R3F creates its own render loop and React reconciler. This means a second React root embedded in the component tree, a separate rAF loop that cannot be paused by GSAP's globalTimeline scalar, a Canvas element that R3F owns (making scissor-based multi-scene management awkward), and an additional ~40KB bundle for fiber itself plus ~200KB for drei helpers. The existing architecture controls its own loops manually (GlobalEffects, HeroMesh, VHSOverlay all do this). R3F would introduce a separate uncontrolled loop.

**Do this instead:** Raw Three.js in a singleton pattern controlled by GSAP's onUpdate callbacks. Matches existing patterns exactly.

### Anti-Pattern 2: Multiple WebGL Contexts (One Per Section)

**What people do:** Add a `<canvas>` to each generative section, call `canvas.getContext('webgl2')` in each component's `useEffect`.

**Why it's wrong:** Browser limit is 8–16 simultaneous WebGL contexts. With CanvasCursor (Canvas 2D, not WebGL — exempt) and HeroMesh (Canvas 2D, not WebGL — exempt), the generative layer starts with a clean WebGL budget of 0. But even so, if each showcase section creates its own WebGL context, hitting 9+ on a page with many sections will silently destroy the oldest context (no error thrown). Safari's limit of 8 is particularly aggressive.

**Do this instead:** Singleton renderer (Pattern 1). One context, one renderer, scissor-split per scene.

### Anti-Pattern 3: Eagerly Importing Three.js

**What people do:** `import * as THREE from 'three'` at the top of a component file, or re-export from a shared module that gets imported in the component tree.

**Why it's wrong:** Three.js minified+gzip is ~155KB. The page weight budget is <200KB initial. An eager import blows the budget before any app code loads. Next.js cannot tree-shake a wildcard import of Three.js because Three.js is not fully tree-shakeable.

**Do this instead:** Three.js is imported exclusively inside the `next/dynamic` async factory in `signal-canvas-lazy.tsx`. It never appears in the synchronous import graph. This defers the ~155KB chunk to after initial paint, matching how `GlobalEffectsLazy` defers GSAP plugin bundles.

### Anti-Pattern 4: Letting Generative Output Overlap FRAME Text

**What people do:** Position a generative canvas at z-index 10 to appear "on top of" or "in front of" the UI for visual impact, without testing text readability.

**Why it's wrong:** Generative output is by definition unpredictable — a particle cluster, mesh vertex, or bright fragment shader region can land exactly on a heading. Because the generative layer is CSS-unpredictable, the only safe enforcement is z-index and opacity constraints, not visual judgment.

**Do this instead:** SignalCanvas z-index is always below FRAME content (`--z-signal-canvas: 1`). If foreground generative elements are needed, they go in dedicated generative-only zones with no overlapping text (empty SFSection with no text children).

### Anti-Pattern 5: Skipping Geometry Disposal on Unmount

**What people do:** Create `THREE.BufferGeometry`, `THREE.ShaderMaterial`, `THREE.Texture` in a useEffect and never call `.dispose()` on cleanup.

**Why it's wrong:** Three.js allocates GPU memory for geometries, materials, and textures. Without disposal, this memory leaks across route navigations. The existing architecture always cleans up (CanvasCursor: `cancelAnimationFrame + observer.disconnect`, HeroMesh: same pattern). Three.js requires the additional step of calling `.dispose()` on GPU resources.

**Do this instead:** `useSignalScene` cleanup function disposes all THREE objects. This is enforced at the hook level, not left to individual scene implementations.

---

## Suggested Build Order

Dependencies flow downward — each phase is unblocked only after the one above it.

### Phase A: Foundation (prerequisite for everything)

1. Extract `resolveOklchToRgb` from canvas-cursor.tsx into `lib/color-resolve.ts` and update CanvasCursor to import it. Zero behavior change — pure refactor. Establishes the shared utility.

2. Build `SignalCanvas` singleton + `useSignalScene` hook. No scenes yet — just the renderer, context management, IntersectionObserver pattern, visibility pause, reduced-motion guard, and WebGL feature detection. Test with a placeholder solid-color scene.

3. Build `SignalCanvasLazy` wrapper, add to RootLayout alongside `GlobalEffectsLazy`. Confirm Three.js chunk is deferred (check Network tab — must not appear in initial load waterfall).

**Gate:** Lighthouse 100/100 must be maintained. Bundle size must not increase by >5KB initial.

### Phase B: First Generative Scene (validates the pipeline)

4. Build `SignalMesh` — parametric 3D geometry scene. Register via `useSignalScene`. Wire GSAP ScrollTrigger onUpdate to mesh rotation/position uniforms. Test scroll-driven behavior. This is the most load-bearing validation — if the scissor/viewport split, GSAP wiring, and reduced-motion handling all work here, Phase C is straightforward.

5. Activate dormant `[data-cursor]` sections (the existing one-line tech debt fix from v1.0 audit). Apply to sections that will have generative visuals — cursor activation signals "this section is interactive and generative."

**Gate:** No WebGL context warnings in browser console. Cursor activates correctly. Mesh renders without CLS.

### Phase C: Extended Generative Scenes

6. Build `SignalMotion` — particle system or flow field scene. Reuses SignalCanvas pipeline established in Phase B. GSAP-driven particle parameters.

7. Wire ColorCycleFrame color changes to Three.js uniforms via color-resolve utility. Generative layer should respond to accent color cycling.

**Gate:** Multiple scenes on the same page do not cause context warnings. Color cycling propagates to WebGL layer correctly.

### Phase D: Integration with SF Primitives (consumers)

8. Apply `data-signal` mount points to showcase pages — CaseStudy sections, about hero, work grid. These are the first production consumers of SFSection/SFStack/SFGrid (resolving the PRM-02/03/04 tech debt from v1.0 audit) while also being the first generative zones.

9. SIGNAL authoring model documentation — a `SIGNAL-GENERATIVE-SPEC.md` that documents: which sections have generative zones, what scene each zone uses, opacity budget, scroll range, reduced-motion fallback.

**Gate:** CRT critique score ≥ 90 for pages with generative content. FRAME content legible over all generative output.

---

## Scaling Considerations

This is a portfolio site — "scaling" is about adding more generative scenes, not about user load. The relevant scaling axis is: how many scenes can the page support?

| Scene Count | Approach |
|-------------|----------|
| 1–3 scenes | Single SignalCanvas, all scenes rendered each frame via scissor split. Budget: fine |
| 4–8 scenes | Add IntersectionObserver culling — only render scenes currently in viewport. Others skip their render pass entirely |
| 9+ scenes | Profile first. Likely culling is sufficient. If not, consider WebGPU renderer (Three.js r171+ has automatic WebGL2 fallback) for better GPU throughput. Not needed for v1.1 scope |

**Note on WebGPU:** All major browsers ship WebGPU as of November 2025 (Chrome/Edge since 2023, Safari since June 2025 Safari 26, Firefox since July 2025). Three.js r171+ supports WebGPU with automatic WebGL2 fallback. This is not needed for v1.1 but is a clean upgrade path if shader complexity grows.

---

## Sources

- MDN WebGL best practices: [https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)
- WebGL multiple views pattern (scissor): [https://webglfundamentals.org/webgl/lessons/webgl-multiple-views.html](https://webglfundamentals.org/webgl/lessons/webgl-multiple-views.html)
- Chromium WebGL context limit issue: [https://github.com/openlayers/openlayers/issues/16118](https://github.com/openlayers/openlayers/issues/16118)
- R3F Canvas API (fallback, gl, frameloop): [https://r3f.docs.pmnd.rs/api/canvas](https://r3f.docs.pmnd.rs/api/canvas)
- R3F too many contexts (Safari): [https://github.com/pmndrs/react-three-fiber/discussions/2457](https://github.com/pmndrs/react-three-fiber/discussions/2457)
- Next.js lazy loading (next/dynamic): [https://nextjs.org/docs/app/guides/lazy-loading](https://nextjs.org/docs/app/guides/lazy-loading)
- GSAP + Three.js integration (Frontend Horse): [https://frontend.horse/episode/using-threejs-with-gsap-scrolltrigger/](https://frontend.horse/episode/using-threejs-with-gsap-scrolltrigger/)
- Codrops WebGL + GSAP gallery (Feb 2026): [https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/](https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/)
- WebGPU browser support (all majors as of Nov 2025): [https://www.webgpu.com/news/webgpu-hits-critical-mass-all-major-browsers/](https://www.webgpu.com/news/webgpu-hits-critical-mass-all-major-browsers/)
- Three.js WebGPU support r171+: [https://developer.chrome.com/docs/web-platform/webgpu/from-webgl-to-webgpu](https://developer.chrome.com/docs/web-platform/webgpu/from-webgl-to-webgpu)
- Non-intrusive WebGL context loss patterns: [https://medium.com/@mattdesl/non-intrusive-webgl-cebd176c281d](https://medium.com/@mattdesl/non-intrusive-webgl-cebd176c281d)
- r3f-scroll-rig (scroll-synced 3D + DOM): [https://github.com/14islands/r3f-scroll-rig](https://github.com/14islands/r3f-scroll-rig)

---
*Architecture research for: SignalframeUX v1.1 Generative Surface*
*Researched: 2026-04-05*
