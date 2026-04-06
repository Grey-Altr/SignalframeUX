# Project Research Summary

**Project:** SignalframeUX — v1.1 Generative Surface
**Domain:** Generative WebGL/SIGNAL layer added to a production Next.js 15.3 design system
**Researched:** 2026-04-05
**Confidence:** HIGH

## Executive Summary

SignalframeUX v1.1 is not a new build — it is a targeted generative extension to a proven, Lighthouse-100 design system. The v1.0 FRAME layer is stable and complete. The research question is how to introduce WebGL-based procedural visuals (the SIGNAL generative extension) without destroying the performance budget, breaking the FRAME/SIGNAL legibility contract, or violating the DU/TDR aesthetic identity. The research answer is clear: use a singleton WebGL renderer driven by the GSAP ticker, loaded lazily via `next/dynamic({ ssr: false })`, with all scenes managed via a shared context and scissor-split viewport. This mirrors patterns already proven in the codebase (GlobalEffectsLazy, HeroMesh) and avoids every major failure mode.

The recommended WebGL approach is raw Three.js (not React Three Fiber) in a singleton `SignalCanvas` component. R3F is explicitly rejected by the architecture research because it creates an uncontrolled second React reconciler and render loop that cannot be managed by GSAP's globalTimeline scalar. Three.js selective imports land in a separate async chunk — not the initial 200KB budget — preserving Lighthouse 100. OGL (~29KB) is the preferred renderer for isolated 2D shader effects where Three.js is overkill. The highest-ROI item in the entire milestone is activating the already-built canvas cursor: one `data-cursor` attribute per section, zero new code, immediate craft credibility with Awwwards jury.

The primary risk is not technical complexity but discipline: every pitfall identified in research (context exhaustion, GPU memory leaks, bundle budget regression, reduced-motion violations, OKLCH color mismatch in shaders) results from skipping a Foundation phase gate. All nine critical pitfalls are preventable if the shared renderer pattern, disposal contract, dynamic import pattern, and color bridge utility are established before any generative scene is built. If Phase 1 ships these primitives correctly, Phases 2–4 are straightforward. If Phase 1 is skipped or rushed, later phases require expensive retrofitting across every canvas component.

## Key Findings

### Recommended Stack

The existing stack (Next.js 15.3, GSAP 3.12, Lenis, Tailwind v4) is unchanged. The generative extension adds Three.js `^0.183.2` as the WebGL scene graph, loaded exclusively via dynamic import. OGL `^1.x` is the alternative for lightweight isolated shader effects — at ~29KB it does not require the same bundle isolation caution as Three.js. `@react-three/fiber` and `@react-three/drei` are explicitly excluded: they introduce an uncontrolled render loop and are architecturally incompatible with the GSAP-driven singleton renderer pattern. Raw-loader (`^4.0.2`) is added if GLSL files are authored as separate `.glsl` files; the alternative is TypeScript template literals (no config required).

**Core technologies:**
- `three@^0.183.2`: WebGL scene graph, geometry, shaders — industry standard, selective imports only, deferred async chunk via `next/dynamic`
- `ogl@^1.x`: Minimal WebGL (~29KB) for isolated 2D shader quads and noise fields — preferred for non-scene effects, avoids Three.js overhead
- `@next/bundle-analyzer`: Post-build validation that Three.js lands in async chunk — run after every generative component addition
- `raw-loader@^4.0.2`: GLSL file import support (Turbopack + Webpack dual config) — optional; template literals are acceptable alternative

**What NOT to add:**
- `@react-three/fiber` or `@react-three/drei` — incompatible with singleton pattern, uncontrolled render loop
- `lottie-web` or `@lottiefiles/*` — not generative, not DU/TDR, 60–200KB dead weight
- `babylon.js` — ~500KB+, no advantage over Three.js for this use case
- Any new GSAP effects — CLAUDE.md explicitly forbids expanding GSAP animations

### Expected Features

The DU/TDR industrial aesthetic occupies an uncontested SOTD niche as of April 2026. No current SOTD winner combines Awwwards-level WebGL generative work with a terminal/industrial voice. This is the competitive gap SignalframeUX fills.

**Must have — v1.1 Launch (table stakes for SOTD credibility):**
- `[data-cursor]` activation on showcase sections — zero new code, highest ROI item, cursor is already built
- Idle-state animation SIG-08 (grain drift + OKLCH color pulse) — CSS + GSAP loop, answers "is this alive?"
- Audio feedback palette SIG-06 — Web Audio API oscillator tones, terminal voice reinforcement, no library
- Data-driven token visualization — Canvas 2D animation on existing token explorer, "the system demonstrates itself"
- WebGL procedural background via OGL (one surface) — establishes the generative foundation, vertex displacement via simplex noise

**Should have — v1.1.x (competitive differentiators after foundation is stable):**
- Custom GLSL shader on hero surface — authorship signal to Awwwards jury, distinguishes "library work" from "authored work"
- Scroll-reactive shader uniforms — ScrollTrigger progress piped to WebGL uniforms, makes SIGNAL intentional not decorative
- ASCII / ordered dithering post-process shader — highest-value DU/TDR differentiator, directly references computational visual history
- Haptic feedback SIG-07 — 3 lines of code, add after audio is validated

**Defer to v2+:**
- Parametric mesh with token system — requires stable SIGNAL authoring model, high creativity score potential
- Live SIGNAL authoring overlay — requires all parametric systems in place, devtool for parameter editing
- Procedural noise on typographic surfaces — Three.js character mesh displacement, highest complexity, defer until core is proven

**Anti-features (never build):**
- Gradient mesh / aurora backgrounds — explicit Creativity penalty in SOTD research, generic dark-mode aesthetic
- Particle storm as primary effect — reads as "accident, not intent" per SOTD research corpus
- Full Three.js scene with camera controls — ~600KB bundle, fights flat DU/TDR aesthetic
- Parallax depth >20px — spatial noise, causes CLS, not spatial intelligence

### Architecture Approach

The architecture is a singleton WebGL host (`SignalCanvas`) mounted in RootLayout alongside the existing `GlobalEffectsLazy`, loaded via the identical `next/dynamic({ ssr: false })` pattern. One `THREE.WebGLRenderer` manages all generative scenes via scissor/viewport splitting — never one renderer per component. Scenes register with a React context hook (`useSignalScene`), receive a render callback and scroll-proxy ref, and unregister (with full disposal) on unmount. The GSAP ticker drives all rendering: Three.js `renderer.render()` is called inside `gsap.ticker.add()`, eliminating the loop conflict pitfall. Server Components render `data-signal` mount points — inert, dimensionally-correct divs — which Client Components hydrate. OKLCH tokens cross to GLSL via an extracted `lib/color-resolve.ts` probe utility (the probe canvas technique already exists in CanvasCursor — this is an extraction, not new code).

**Major components:**
1. `SignalCanvas` (`components/animation/signal-canvas.tsx`) — singleton WebGL host; one renderer, one context, scissor-split scene management, IntersectionObserver lifecycle, reduced-motion guard, WebGL feature detection
2. `SignalCanvasLazy` (`components/layout/signal-canvas-lazy.tsx`) — `next/dynamic({ ssr: false })` wrapper; mirrors GlobalEffectsLazy pattern exactly
3. `useSignalScene` (`hooks/use-signal-scene.ts`) — registration hook; scenes register/unregister via context; enforces disposal contract at hook level
4. `SignalMesh` (`components/animation/signal-mesh.tsx`) — first generative scene; parametric 3D geometry driven by GSAP ScrollTrigger uniforms
5. `SignalMotion` (`components/animation/signal-motion.tsx`) — particle/flow field scene; reuses established SignalCanvas pipeline
6. `lib/color-resolve.ts` — extracted OKLCH-to-RGB probe utility; shared by CanvasCursor (existing) and all new generative components

### Critical Pitfalls

1. **WebGL context exhaustion** — Never instantiate more than one `WebGLRenderer`. Browser limit is 8 (Safari) to 16 (Chrome). Multiple components each creating a context will silently destroy the oldest one. Prevention: singleton renderer established in Phase 1 Foundation before any scene component is built. Cannot be retrofitted without touching every canvas component.

2. **GPU memory leak from undisposed Three.js resources** — `scene.remove(mesh)` does not free VRAM. `.dispose()` must be called explicitly on geometry, material, textures, and the renderer itself. Prevention: `useSignalScene` enforces disposal at hook level. Monitor `renderer.info.memory.geometries` during development.

3. **SSR hydration failure** — `THREE.WebGLRenderer` and `window` do not exist in Node.js. Any module-level Three.js import that enters the Server Component tree throws during `next build`. Prevention: all canvas components must be behind `next/dynamic({ ssr: false })`; Three.js must never appear in the synchronous import graph of any shared utility file.

4. **GSAP + Three.js render loop conflict** — Two independent RAF loops (`renderer.setAnimationLoop` + `gsap.ticker`) fire in undefined order within a frame. GSAP-written uniform values may be consumed by Three.js before GSAP writes them. Prevention: never use `renderer.setAnimationLoop()`. Drive `renderer.render()` exclusively from inside `gsap.ticker.add()`. Lenis RAF must also be in the same ticker chain.

5. **OKLCH colors breaking in WebGL shaders** — CSS OKLCH cannot be passed directly to GLSL uniforms. WebGL operates in linear sRGB; OKLCH is a perceptual color space with different gamma encoding. Prevention: use the DOM canvas probe technique (already in CanvasCursor) to resolve OKLCH to linear sRGB before passing as `vec3` uniform. Extract to `lib/color-resolve.ts` in Phase 1 — never re-invent per component.

6. **Bundle budget blown by Three.js** — Three.js minified+gzip is ~155KB. Eager import in any file reachable by the initial load waterfall destroys the 200KB budget and breaks Lighthouse 100. Prevention: Three.js lives exclusively inside the `next/dynamic` async factory. Run `@next/bundle-analyzer` as a validation gate after Phase 1.

7. **Mobile GPU battery drain and thermal throttling** — Continuous WebGL render loop at 60fps on mobile drains battery and triggers thermal throttling within minutes. Prevention: `IntersectionObserver` pauses the render loop when canvas is off-screen; 30fps cap on mobile via time-delta throttle; pixel ratio capped at 1.5.

## Implications for Roadmap

The dependency structure from FEATURES.md and build order from ARCHITECTURE.md maps directly to a 4-phase implementation. Every pitfall in PITFALLS.md is addressable in Phase 1 — which means Phase 1 is the critical path.

### Phase 1: Generative SIGNAL Foundation

**Rationale:** All 9 critical pitfalls are addressed here. Every downstream phase depends on the singleton renderer, disposal contract, dynamic import pattern, color bridge utility, reduced-motion detection, and accessibility classification being in place. This phase produces no user-visible generative output — it produces the infrastructure that makes user-visible output safe to ship. Skipping or rushing this phase makes every subsequent phase a liability.

**Delivers:** `SignalCanvas` singleton, `SignalCanvasLazy` wrapper, `useSignalScene` hook, `lib/color-resolve.ts`, z-index token additions to globals.css, placeholder scene validation (solid-color rectangle confirming scissor split works), Lighthouse 100 maintained, Three.js confirmed in async chunk only via bundle analyzer.

**Addresses:** WebGL procedural background (foundation), the performance budget requirement, the SSR safety requirement, reduced-motion compliance, canvas accessibility contract.

**Avoids:** All 9 critical pitfalls from PITFALLS.md — this phase IS the prevention strategy.

**Gate:** Lighthouse 100/100 unchanged. Bundle size initial increase < 5KB. `next build` produces zero `window is not defined` errors. No WebGL context warnings in browser console.

### Phase 2: SIGNAL Activation (Dormant Effects + Low-Cost Wins)

**Rationale:** The highest-ROI items in the entire milestone require no new WebGL work. `[data-cursor]` activation is one attribute per section. SIG-08 idle animation is CSS + GSAP loop. SIG-06 audio feedback is Web Audio API with no dependencies. These ship before any WebGL scene component, proving the SIGNAL authoring model on the simplest cases and delivering immediate craft credibility.

**Delivers:** `[data-cursor]` attributes on all showcase sections (canvas cursor fully activated), idle-state grain drift + OKLCH color pulse (SIG-08), audio feedback oscillator palette (SIG-06), haptic feedback SIG-07.

**Addresses:** One-line cursor fix from v1.0 tech debt, "breathing surface" requirement, terminal voice reinforcement, mobile tactile feedback.

**Uses:** Existing CanvasCursor (zero changes), existing GSAP looping pattern, Web Audio API (no library).

**Gate:** Canvas cursor activates on all `[data-cursor]` sections. OS reduced-motion toggle halts idle animation and audio. No Lighthouse regression.

### Phase 3: First Generative WebGL Scene (Foundation Validation)

**Rationale:** The first WebGL scene validates the entire Phase 1 pipeline under real conditions. `SignalMesh` (parametric 3D geometry) is the load-bearing test: scissor/viewport split, GSAP ScrollTrigger → uniform wiring, IntersectionObserver pause, disposal on unmount, color token propagation from CSS OKLCH to GLSL. If this works correctly, Phase 4 is additive. The data-driven token visualization ships here using Canvas 2D (not WebGL) — it shares the "generative surface" concept without WebGL risk.

**Delivers:** `SignalMesh` component — parametric 3D geometry driven by scroll, GSAP-wired uniforms, correct disposal. Data-driven token visualization (Canvas 2D animation on existing token explorer). ColorCycleFrame color changes propagated to Three.js uniforms via `color-resolve.ts`.

**Addresses:** WebGL procedural background (fully delivered), scroll-reactive visual layer (SIGNAL generative requirement), "the system demonstrates itself" concept for token explorer.

**Uses:** Three.js (async chunk), GSAP ScrollTrigger onUpdate pattern, `lib/color-resolve.ts`, `useSignalScene` hook.

**Gate:** No WebGL context warnings across all pages. `renderer.info.memory.geometries` stable across route navigations. OKLCH colors in canvas visually match adjacent CSS elements using same tokens. CLS = 0 (canvas placeholder sized correctly).

### Phase 4: Extended Generative Scenes + Production Integration

**Rationale:** With the WebGL pipeline proven, additional scenes and production integration of SF primitives into showcase pages are straightforward. This phase ships the DU/TDR differentiators (ASCII/dithering shader, custom GLSL hero) and applies `data-signal` mount points to production pages, resolving the v1.0 PRM-02/03/04 tech debt while activating generative zones.

**Delivers:** `SignalMotion` component (particle/flow field via established pipeline), ASCII/ordered dithering post-process shader (OGL, GPU-parallel), custom GLSL shader on hero surface, `data-signal` mount points on CaseStudy/About/Work sections, `SIGNAL-GENERATIVE-SPEC.md` documentation.

**Addresses:** GLSL authorship signal to Awwwards jury, DU/TDR visual language at WebGL level, production consumer integration resolving PRM-02/03/04 tech debt.

**Gate:** CRT critique score ≥ 90 for pages with generative content. FRAME content legible over all generative output at all viewport sizes. Lighthouse 100/100 maintained. axe scan: zero canvas accessibility violations.

### Phase Ordering Rationale

- **Foundation before scenes:** Every pitfall in PITFALLS.md is a Phase 1 concern. There is no safe path to building scenes before the singleton renderer, disposal contract, and dynamic import pattern exist.
- **Dormant effects before WebGL:** Phase 2 items (cursor, idle, audio) deliver Awwwards craft credibility immediately with zero WebGL risk. They also establish the SIGNAL authoring model on the simplest cases before the complex cases.
- **One scene before many:** Phase 3's single `SignalMesh` validates the entire pipeline. Shipping multiple scenes before one is proven is how context exhaustion and memory leaks slip through.
- **Integration last:** `data-signal` production integration (Phase 4) requires the pipeline to be stable and the SF primitives to have real consumers — Phase 4 satisfies both simultaneously.

### Research Flags

Phases likely needing deeper research during planning:

- **Phase 1 (Foundation):** Turbopack raw-loader integration is MEDIUM confidence — community solution, not official Next.js docs. Verify `experimental.turbopack.rules` behavior on the specific Next.js 15.3 build before shipping. Template literal shaders are the safe fallback if this proves unstable.
- **Phase 3 (First WebGL Scene):** GSAP ScrollTrigger + Three.js uniform timing under Lenis has not been verified in this specific stack combination. The `lenis.raf(time)` + `gsap.ticker` integration needs a focused integration test before building scene scroll reactivity at scale.
- **Phase 4 (ASCII Shader):** OGL post-process pipeline for ordered dithering involves fragment shader architecture that has no existing precedent in this codebase. Review the Codrops Jan 2026 Efecto implementation before committing to an approach.

Phases with standard patterns (skip research-phase):

- **Phase 2 (SIGNAL Activation):** All items are well-documented. `[data-cursor]` is attribute addition. SIG-08 is CSS animation + GSAP loop. SIG-06 is MDN-documented Web Audio API. No ambiguity.
- **Phase 1 `next/dynamic` pattern:** Established pattern with HIGH confidence sources. The GlobalEffectsLazy precedent in this codebase is the exact template.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Core library recommendations (Three.js, OGL, version numbers) confirmed via npm registry and official docs. Turbopack raw-loader config is MEDIUM — community pattern. R3F exclusion is HIGH confidence based on confirmed GitHub issue #71836. |
| Features | HIGH | Awwwards SOTD corpus (Jan–Mar 2026), Codrops case studies with named site examples. Anti-feature list derived from verified SOTD research patterns. DU/TDR niche unoccupied status is HIGH confidence observation as of April 2026. |
| Architecture | HIGH | Singleton WebGL pattern verified via MDN WebGL best practices and WebGL fundamentals scissor multi-view docs. GSAP ticker integration pattern verified via GSAP docs. Existing codebase verified directly. R3F anti-pattern confirmed via R3F own docs and GitHub discussions. |
| Pitfalls | HIGH (WebGL/SSR/memory/bundle) / MEDIUM (OKLCH-shader bridge, GSAP+Three.js timing specifics) | Context limits, memory leak patterns, and SSR constraints are HIGH — multiple authoritative sources. OKLCH/shader bridge and specific GSAP+Three.js timing under Lenis is MEDIUM — needs integration test to confirm. |

**Overall confidence:** HIGH

### Gaps to Address

- **Turbopack raw-loader stability:** The `experimental.turbopack.rules` config for GLSL files is a community pattern, not official Next.js documentation. During Phase 1, validate this works on the actual Next.js 15.3 build before committing. If it fails, use TypeScript template literals for all shaders — acceptable for v1.1 scope.
- **Lenis + GSAP ticker + Three.js render ordering:** The specific integration of `lenis.raf(time)` inside `gsap.ticker.add()` alongside `renderer.render()` has not been tested in this stack. Build a minimal integration test in Phase 1 or Phase 3 before scroll-reactive uniforms are added to production scenes.
- **OGL vs Three.js choice per scene:** Research recommends OGL for isolated 2D shader effects and Three.js for 3D geometry. The ASCII shader (Phase 4) is the most architecturally ambiguous — verify whether OGL's post-process pipeline is sufficient before choosing. If not, Three.js postprocessing library is the alternative (but requires the same dynamic import isolation).
- **Three.js selective import tree-shaking ceiling:** Bundle size estimates for selective Three.js imports (40–80KB) are MEDIUM confidence. Actual size depends on which Three.js internals are transitively required. Validate with `@next/bundle-analyzer` after Phase 1 scaffold is built.

## Sources

### Primary (HIGH confidence)

- R3F docs (r3f.docs.pmnd.rs) — v9/React 19 pairing, Next.js transpilePackages requirement
- GitHub vercel/next.js issue #71836 — R3F v8 incompatible with Next.js 15/React 19 confirmed
- Next.js Turbopack docs (nextjs.org/docs/app/api-reference/config) — loader rules format
- MDN WebGL best practices — context limits, disposal patterns, accessibility
- WebGL fundamentals scissor pattern (webglfundamentals.org/webgl/lessons/webgl-multiple-views.html)
- GitHub oframe/ogl — OGL ~29KB total, zero deps, ES6 modules
- GSAP ticker documentation (gsap.com/docs/v3/GSAP/gsap.ticker)
- npm registry — three@0.183.2, @react-three/fiber@9.5.0 latest confirmed

### Secondary (MEDIUM confidence)

- Codrops Jan 2026 — Efecto: ASCII and Dithering Shaders with WebGL
- Codrops Mar 2026 — Inside Corentin Bernadou's Portfolio (Three.js + GLSL architecture)
- Codrops Mar 2026 — Arnaud Rocca's Portfolio: GSAP to WebGL (OGL fluid simulation)
- Codrops Oct 2025 — Eloy Benoffi's Brutalist Portfolio (ASCII art, SOTD industrial aesthetic)
- Frontend Horse — GSAP + Three.js ScrollTrigger integration patterns
- GitHub vercel/next.js discussion #64964 — Turbopack raw-loader via experimental.turbopack.rules (community, not official)
- SYNTH-awwwards-patterns.md (SignalframeUX project research, 2026-04-05) — Awwwards SOTD Jan–Mar 2026 corpus

### Tertiary (LOW confidence)

- bundlephobia.com — Three.js bundle size estimates (verify manually with bundle-analyzer after install)
- WebSearch — Three.js tree-shaking ceiling estimates (project-specific validation required)

---
*Research completed: 2026-04-05*
*Ready for roadmap: yes*
