# Feature Research

**Domain:** Generative design system showcase — creative technology portfolio
**Researched:** 2026-04-05
**Confidence:** HIGH (Awwwards SOTD corpus, Codrops case studies 2025-2026, official docs)

---

## Context: What Is Already Built

The following SIGNAL effects are **fully implemented in v1.0** and are NOT in scope for this milestone. They are listed here only to establish dependency anchors and prevent duplication:

| Effect | Spec ID | Status |
|--------|---------|--------|
| ScrambleText on route entry | SIG-01 | Shipped |
| Asymmetric hover (100ms/400ms) | SIG-02 | Shipped |
| Hard-cut 34ms section reveals | SIG-03 | Shipped |
| Staggered grid entry (ScrollTrigger.batch) | SIG-04 | Shipped |
| Progressive enhancement `[data-anim]` catch-all | SIG-05 | Shipped |
| Canvas cursor (crosshair + particle trail) | SIG-09 | Mounted, `[data-cursor]` not yet placed on sections |
| VHS/CRT overlay | SIG family | Shipped |
| Circuit divider DrawSVG scrub | SIG family | Shipped |
| Hero mesh (canvas-based) | SIG family | Shipped |
| Marquee text bands | SIG family | Shipped |

The new milestone (v1.1 Generative Surface) adds **generative/procedural SIGNAL capabilities** beyond this baseline.

---

## Feature Landscape

### Table Stakes (Awwwards-Level Baseline for Creative Tech Sites)

Features that any 2026 SOTD-level generative design system showcase is expected to have. Their absence caps the Creativity score and signals technical incompleteness to a jury that sees 300+ sites per week.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| WebGL procedural background or environment | Every 2026 SOTD in the industrial/generative corridor uses WebGL for at least one hero-moment surface (Darknode, Shift 5, Corentin Bernadou portfolio). Canvas-only is read as "not generative." | MEDIUM | OGL (minimal, ~40KB) preferred over Three.js (~600KB) for single-effect use. Must not block LCP. `dynamic(() => import(...), { ssr: false })` required in Next.js 15. |
| GLSL shader driving at least one surface | Awwwards jury distinguishes between "libraries doing the work" and "authored shader work." A custom GLSL shader — even one — signals technical authorship. DrawSVG on circuit dividers (already shipped) does not count as generative in this dimension. | HIGH | Vertex displacement + noise (simplex/Perlin) is the standard entry point. Can reuse the hero-mesh canvas component as foundation. |
| Scroll-reactive visual layer (not just layout) | ScrollTrigger reveal animations (shipped) are table stakes for the FRAME layer. For the SIGNAL generative layer, the expectation is that scroll modulates a procedural parameter — mesh density, shader intensity, particle speed — not just opacity/transform. | MEDIUM | Can be implemented as ScrollTrigger progress value piped into a uniform or canvas parameter. GSAP scrub pattern already used in circuit dividers. |
| Idle-state animation on background surfaces | Static hero after initial reveal is a craft failure in 2026. The 60-90s jury evaluation window (SYNTH-awwwards-patterns.md §3) requires something alive when the user stops scrolling. SIG-08 (grain drift, color pulse) is already identified in PROJECT.md as active requirement. | LOW | CSS animation on a grain texture or GSAP looping timeline on shader uniform. Very low CPU cost when done as CSS animation. |
| One signature cursor interaction detail | The Lookback, Corentin Bernadou, and Arnaud Rocca all cite cursor behavior as their "craft clincher" moment. CanvasCursor is mounted but `[data-cursor]` is not placed on any section (known tech debt). | LOW | One-line fix per section. Zero new code required — this is activation, not implementation. Highest ROI item in the entire milestone. |

### Differentiators (Competitive Advantage Within DU/TDR Aesthetic)

Features that create SOTD-level distinctiveness specifically for the industrial/brutalist corridor that SignalframeUX occupies. These are NOT generic creative-tech features — they must cohere with the DU/TDR visual language.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| ASCII / dithering post-process shader | CRT-era retro-brutalist effect that directly references early computing visual language — aligns with DU/TDR aesthetic without being decorative. Efecto (Codrops Jan 2026) demonstrates GPU-accelerated ASCII shader in WebGL. Eloy Benoffi's brutalist portfolio won SOTD using this exact technique (Oct 2025). | HIGH | Fragment shader post-processing pass over the WebGL scene or over an image/video element. Floyd-Steinberg dithering is CPU-only (avoid); ordered dithering is GPU-parallel (use). OGL or raw WebGL context. Must have CSS fallback for no-WebGL. |
| Parametric mesh that responds to SIGNAL tokens | A 3D surface (wireframe or solid) whose parameters — density, displacement amplitude, speed — are driven by the same token system as the FRAME layer. This makes the generative layer legible as a system, not just a visual effect. No other SOTD-winner design system has demonstrated this. | HIGH | WebGL geometry (OGL or Three.js) with uniforms reading from CSS custom property values resolved at render time. GSAP ScrollTrigger drives the uniform. Requires WebGL component isolated behind `dynamic import`. |
| Data-driven visualization as design token display | Rather than a static token table, display spacing/color/typography tokens as a living generative grid — bars animated from 0 to their token value, OKLCH values rendered as procedurally blended color fields, duration tokens shown as real-time oscilloscope traces. This makes the token explorer itself a generative output. | MEDIUM | Canvas 2D (not WebGL) is sufficient here. The visualization IS the data — no shader complexity needed. Directly maps to existing token explorer component. High jury Creativity score because the concept is unified (the system demonstrates itself). |
| Procedural noise applied to typographic surfaces | Vertex displacement on SplitText characters — a GLSL noise function displacing individual character meshes on hover or scroll. Corentin Bernadou (SOTD Mar 2026) used Three.js geometry for this exact effect. Aligns with existing ScrambleText + DU/TDR terminal aesthetic. | HIGH | Requires Three.js or OGL. Characters must be rendered as WebGL geometry (not DOM text), then transitioned back to DOM for the legible state. Complex FRAME/SIGNAL boundary management. Defer unless core generative layer is stable first. |
| Audio feedback palette (SIG-06) | Subtle click/hover sounds mapped to interaction events — not music, not interface sounds, but the "terminal feedback" layer that DU/TDR electronic music production contexts use. Already identified in PROJECT.md. Low implementation cost via Web Audio API oscillator tones. | LOW | Web Audio API, no library. OscillatorNode + GainNode. 2-3 tones: click (sharp 440hz 20ms), hover (soft 220hz 50ms), route change (descending 3-tone 200ms). Must respect `prefers-reduced-motion` and provide opt-out. No autoplay — user gesture required to unlock AudioContext. |
| Haptic feedback on mobile (SIG-07) | Vibration API — a single short pulse on tap events. 10ms at most. Reinforces the tactile terminal voice on mobile where cursor effects are suppressed. Already in PROJECT.md. | LOW | `navigator.vibrate([10])` — 3 lines. Zero dependencies. Android only (iOS blocks Vibration API). Feature-detect before calling. |
| Idle-state color pulse / grain drift (SIG-08) | When the user stops interacting for >3s, background grain texture begins a slow drift — a 0.3% shift in noise seed per second, imperceptible but alive. Color temperature of the primary surface shifts ±2% in OKLCH L-channel. Signals that the system is "breathing." Already in PROJECT.md. | LOW | CSS animation on grain texture `background-position`. GSAP looping timeline on a CSS custom property for the OKLCH shift. No WebGL required. |
| Live SIGNAL authoring controls (devtool overlay) | An overlay (keyboard-toggled, not shown by default) where parameters of any active SIGNAL effect can be adjusted in real-time — mesh density slider, scramble character set selector, duration multiplier. This demonstrates the parametric/token model to a technical audience. Extremely high Creativity + Technical score impact on Awwwards jury. | HIGH | React state + CSS custom property writes + postMessage to WebGL worker if using offscreen canvas. Must be keyboard-only accessible (no mouse required). Opt-in via `?debug=signal` query param or `Shift+D` keyboard shortcut. |

### Anti-Features (Commonly Requested, Often Fatal to This Aesthetic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Gradient mesh / aurora background | Visually impressive, commonly seen on award sites | Zero SOTD winners in the industrial/brutalist corridor use them. They signal "generic dark-mode aesthetic" — the explicit anti-target of SignalframeUX. The Awwwards SOTD research (SYNTH-awwwards-patterns.md §5) lists gradient meshes as the top Creativity penalty. | Hard-edge color field transitions (already shipped as SIG-03) + procedural noise at <3% opacity |
| Particle storm / floating particles as primary effect | Adds motion and depth, common on creative tech sites | "Particles on an industrial site read as accident, not intent" (SYNTH-awwwards-patterns.md §5). Particle systems with no semantic grounding score poorly on Creativity. Also: significant performance cost for minimal conceptual return. | Particle trail on the canvas cursor (already shipped as SIG-09) — same technology, purposeful semantic: the cursor IS the particle source |
| Full Three.js scene with camera controls | Demonstrates 3D capability | Bundles ~600KB of Three.js, requires `'use client'` on the containing page, breaks Lighthouse score, and often introduces the Next.js 15 / React 19 `ReactCurrentOwner` compatibility error. Full 3D scenes also fight the flat DU/TDR aesthetic. | OGL (minimal ~40KB) for shader effects. Three.js only if 3D geometry is the concept (typographic mesh, parametric surface) — isolated behind `dynamic import({ ssr: false })` |
| Real-time audio reactive visuals | High visual spectacle | Requires user-initiated audio unlock (browser autoplay policy), adds significant implementation complexity for uncertain UX return. Audio-reactive assumes audio is playing — no design system showcase has a guaranteed audio context. | Audio feedback palette (SIG-06) — output only, no audio input analysis required |
| Glassmorphism or frosted glass surfaces | Modern and popular | Zero border-radius policy + hard-edge identity = direct conflict. Also cited as Creativity penalty in SOTD research (contrast failure). | Hard-cut background switches at section boundaries (SIG-03) achieve the same "layered depth" signal without frosted treatment |
| Parallax depth >20px | Creates dimension and interest | Spatial noise, not spatial intelligence (SYNTH-awwwards-patterns.md §5). Also causes CLS issues on scroll. | Scroll-linked shader uniform modulation — depth communicated through procedural change, not pixel offset |
| WebGPU (primary renderer) | Future-facing, impressive spec | WebGPU support is still uneven (Safari iOS has known issues as of 2026, Firefox partial). Three.js offers automatic WebGL 2 fallback — but only if you design for it from the start. A showcase that breaks on Safari costs the Developer Award. | WebGL 2 as primary target. WebGPU as opt-in enhancement when `navigator.gpu` is available. |
| GPGPU / compute shader particle simulation | Maximum technical flex | GPGPU requires WebGL 2 transform feedback or WebGPU compute — no canvas 2D fallback possible. Guaranteed failure path on older hardware and mobile. Lighthouse performance score impact. | CPU-side noise-driven animation via GSAP + minimal WebGL for visual output only |

---

## Feature Dependencies

```
[data-cursor] activation (one-line fix)
    └──requires──> CanvasCursor mounted in GlobalEffects (already done)

WebGL procedural background
    └──requires──> dynamic import with ssr:false
    └──requires──> FRAME/SIGNAL legibility contract defined (PROJECT.md active requirement)
    └──requires──> Performance budget reconciled (PROJECT.md active requirement)

GLSL shader on surface
    └──requires──> WebGL procedural background (above)
    └──requires──> OGL or Three.js installed and isolated

Scroll-reactive shader uniform
    └──requires──> GLSL shader on surface (above)
    └──requires──> ScrollTrigger progress value piped to uniform (GSAP already installed)

Parametric mesh with token system
    └──requires──> WebGL procedural background (above)
    └──requires──> SIGNAL authoring model defined (PROJECT.md active requirement)
    └──enhances──> Data-driven token visualization (shared parametric concept)

ASCII / dithering shader
    └──requires──> WebGL procedural background (above)
    └──requires──> Fragment shader post-process pass
    └──conflicts──> Full Three.js scene (different render pipeline; pick one)

Data-driven token visualization
    └──requires──> Existing token explorer component (already shipped in v1.0)
    └──NO WebGL required──> Canvas 2D sufficient

Audio feedback palette (SIG-06)
    └──requires──> User gesture to unlock AudioContext (browser policy)
    └──NO dependencies on WebGL layer

Haptic feedback (SIG-07)
    └──requires──> Mobile detection (pointer: coarse already used in codebase)
    └──NO dependencies on WebGL layer

Idle-state animation (SIG-08)
    └──NO dependencies on WebGL or audio
    └──enhances──> Static FRAME layer (activates between user interactions)

Live SIGNAL authoring overlay
    └──requires──> WebGL procedural background (above, for uniform controls)
    └──requires──> Parametric token integration (above)
    └──enhances──> All SIGNAL effects (universal parameter exposure)
```

### Dependency Notes

- **[data-cursor] activation requires nothing new:** This is a one-line `data-cursor` attribute add to existing showcase sections. Highest ROI item — zero implementation risk.
- **WebGL procedural background blocks three other features:** ASCII shader, scroll-reactive shader, and parametric mesh all require the WebGL context to exist first. Build in order.
- **Audio/haptic/idle are fully independent:** SIG-06, SIG-07, SIG-08 have no WebGL dependency and can be built in any order, in parallel with the WebGL work.
- **ASCII shader conflicts with full Three.js scene:** They use different render pipelines. Choose OGL + custom GLSL (preferred for DU/TDR aesthetic) or Three.js + postprocessing library — not both.
- **Data-driven token visualization is fully independent:** Canvas 2D. No WebGL. Can ship before any generative 3D work.

---

## MVP Definition (v1.1 Generative Surface)

### Launch With (v1.1 — Core Generative Surface)

The minimum set that makes the showcase definitively "generative" for Awwwards jury evaluation, without risking the Lighthouse 100/100 constraint or the DU/TDR aesthetic contract:

- [ ] `[data-cursor]` activated on all showcase sections — activates the already-built canvas cursor. One attribute per section. SOTD craft clincher moment. Zero risk.
- [ ] Idle-state animation (SIG-08) — grain drift + OKLCH color pulse. CSS + GSAP looping. No dependencies. Answers "is this alive?"
- [ ] Audio feedback palette (SIG-06) — 2-3 oscillator tones on interaction events. Web Audio API. No library. Terminal voice reinforcement.
- [ ] Data-driven token visualization — Canvas 2D animation on existing token explorer. No WebGL. Demonstrates "the system demonstrates itself."
- [ ] WebGL procedural background (OGL, one surface) — Establishes the generative surface foundation. Vertex displacement via simplex noise. Must pass Lighthouse 100 with `dynamic import`.

### Add After Validation (v1.1.x)

Features to add once the WebGL foundation is stable and performance is confirmed:

- [ ] GLSL shader on hero surface — Custom fragment/vertex shader replacing or enhancing the existing hero-mesh component. Establishes authorship signal to Awwwards jury.
- [ ] Scroll-reactive shader uniforms — ScrollTrigger progress piped to WebGL uniforms. Makes generative layer feel intentionally designed, not decorative.
- [ ] Haptic feedback (SIG-07) — 3 lines of code. Add after audio feedback is validated.
- [ ] ASCII / dithering post-process shader — High-value DU/TDR differentiator. Add once OGL context is established. Requires ordered dithering (GPU) not Floyd-Steinberg (CPU).

### Future Consideration (v2+)

Features that require stable generative foundation and more implementation time:

- [ ] Parametric mesh with token system — The "system demonstrates itself" at the 3D level. High Creativity score potential. Defer until SIGNAL authoring model is fully defined.
- [ ] Live SIGNAL authoring overlay — Devtool for real-time parameter editing. Requires all parametric systems to be in place first.
- [ ] Procedural noise on typographic surfaces — Three.js character mesh displacement. Highest complexity. Defer until core generative layer is proven.

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| `[data-cursor]` activation | HIGH — immediate craft moment | LOW — one attribute per section | P1 |
| Idle-state animation (SIG-08) | HIGH — "breathing" surface | LOW — CSS + GSAP loop | P1 |
| Audio feedback palette (SIG-06) | MEDIUM — terminal voice | LOW — Web Audio API, no library | P1 |
| Data-driven token visualization | HIGH — concept unity | MEDIUM — Canvas 2D animation | P1 |
| WebGL procedural background (OGL) | HIGH — generative foundation | MEDIUM — OGL setup + simplex noise | P1 |
| GLSL custom shader (hero) | HIGH — authorship signal | HIGH — shader writing + fallbacks | P2 |
| Scroll-reactive shader uniforms | HIGH — intentional design | MEDIUM — ScrollTrigger → uniform | P2 |
| Haptic feedback (SIG-07) | LOW — mobile only, iOS blocked | LOW — 3 lines | P2 |
| ASCII / dithering shader | HIGH — DU/TDR differentiator | HIGH — post-process pipeline | P2 |
| Parametric mesh + token system | HIGH — concept crown jewel | HIGH — full WebGL system | P3 |
| Live SIGNAL authoring overlay | HIGH — jury demonstration | HIGH — full devtool | P3 |
| Procedural typographic mesh | MEDIUM — visual spectacle | VERY HIGH — Three.js + DOM bridge | P3 |

---

## Competitor / Reference Analysis

| Feature | Active Theory (v5) | Corentin Bernadou (SOTD Mar 2026) | Arnaud Rocca (Codrops Mar 2026) | SignalframeUX Approach |
|---------|-------------------|-----------------------------------|----------------------------------|------------------------|
| WebGL approach | Custom Hydra engine (Three.js base), full 3D world | Three.js + custom GLSL shaders | OGL fluid simulation | OGL (smaller, fits aesthetic) |
| Generative technique | Interactive multi-user particle tubes | 3D geometry with shader distortion | Mouse-driven fluid density buffer | Noise displacement + ASCII/dither shader |
| FRAME/SIGNAL relationship | Signal overwhelms frame | Signal subtly enhances frame ("2D interface stays clear") | Signal responds to user input | FRAME must remain readable — SIGNAL decorates |
| Performance strategy | LCP ~1.3s desktop (acceptable for creative studio) | Unknown, vanilla JS | Frame-rate independent dissipation | Lighthouse 100 non-negotiable |
| Audio | None | None | None | SIG-06 (oscillator palette — terminal voice) |
| Aesthetic | LA studio / office environment | Swiss grid + WebGL geometry | Minimal, motion-first | DU/TDR industrial / terminal |

The key insight from this reference analysis: **the DU/TDR aesthetic is unoccupied at the SOTD level.** Corentin Bernadou's Swiss-grid approach is the closest competitor but uses imagery and organic 3D geometry. SignalframeUX's industrial terminal voice — noise-driven mesh displacement, ordered dithering, ASCII fragments — has no direct SOTD competitor as of April 2026.

---

## Performance Budget Notes

These constraints are non-negotiable (from PROJECT.md and CLAUDE.md):
- Page weight: <200KB initial (excluding images)
- LCP: <1.0s
- Lighthouse: 100/100 all categories

**WebGL library budget:**
- OGL: ~40KB minified+gzipped (fits budget, preferred)
- Three.js core: ~600KB minified (exceeds budget alone — must use `dynamic import` + tree-shake)
- React Three Fiber: adds ~50KB on top of Three.js (total >650KB — use only if Three.js is already required)

**R3F + Next.js 15 known issue:** GitHub Issue #71836 documents a `ReactCurrentOwner` error with React Three Fiber on Next.js 15 + React 19. Resolved in R3F v9 (breaking changes vs v8). If Three.js is used, prefer raw Three.js with `dynamic import` over R3F until compatibility is confirmed stable.

**Recommended WebGL strategy:** OGL as primary renderer for all v1.1 generative effects. Three.js only if a specific scene requires it (parametric mesh with complex geometry), isolated as a separate `dynamic import` chunk.

---

## Sources

- SYNTH-awwwards-patterns.md (SignalframeUX project research, 2026-04-05) — Awwwards SOTD Jan-Mar 2026 corpus analysis
- [Arnaud Rocca's Portfolio: From GSAP to WebGL — Codrops Mar 2026](https://tympanus.net/codrops/2026/03/31/arnaud-roccas-portfolio-from-a-gsap-powered-motion-system-to-fluid-webgl/) — OGL fluid simulation case study
- [Inside Corentin Bernadou's Portfolio — Codrops Mar 2026](https://tympanus.net/codrops/2026/03/05/inside-corentin-bernadous-portfolio-swiss-inspired-layouts-webgl-geometry-and-thoughtful-motion/) — Three.js + GLSL architecture
- [Efecto: ASCII and Dithering Shaders — Codrops Jan 2026](https://tympanus.net/codrops/2026/01/04/efecto-building-real-time-ascii-and-dithering-effects-with-webgl-shaders/) — GPU dithering technique
- [Eloy Benoffi's Brutalist Portfolio — Codrops Oct 2025](https://tympanus.net/codrops/2025/10/15/from-blank-canvas-to-mayhem-eloy-benoffis-brutalist-glitchy-portfolio-built-with-webflow-and-gsap/) — ASCII art + SOTD industrial aesthetic
- [OGL — Minimal WebGL Library](https://github.com/oframe/ogl) — Zero-dependency WebGL library
- [Next.js 15 + R3F ReactCurrentOwner Issue #71836](https://github.com/vercel/next.js/issues/71836) — Compatibility warning
- [React Three Fiber v9 Migration Guide](https://r3f.docs.pmnd.rs/tutorials/v9-migration-guide) — R3F React 19 compatibility notes
- [Three.js 2026 WebGPU Overview](https://www.utsubo.com/blog/threejs-2026-what-changed) — WebGPU status and fallback patterns
- [Making Motion Behave — Vladyslav Penev, Codrops Feb 2026](https://tympanus.net/codrops/2026/02/04/making-motion-behave-inside-vladyslav-penevs-production-ready-interaction-systems/) — Production motion system patterns
- [Building Real-Time Dithering Shader — Codrops Jun 2025](https://tympanus.net/codrops/2025/06/04/building-a-real-time-dithering-shader/) — Ordered dithering GPU implementation
- Web Audio API — MDN: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- SIGNAL-SPEC.md (SignalframeUX project, 2026-04-06) — Existing effect specifications

---

*Feature research for: SignalframeUX v1.1 Generative Surface milestone*
*Researched: 2026-04-05*
