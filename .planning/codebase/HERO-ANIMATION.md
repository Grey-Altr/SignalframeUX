# Hero Animation Inventory

**Last verified:** 2026-04-20 (commits `3a7be99`, `752075e`)
**Purpose:** Complete map of every file, token, and runtime dep that participates in the ENTRY hero on `/`. Written for a future packaging pass where this subsystem becomes an installable design-system module (`@culture-division/sf-hero` or similar).

This doc is a **living reference**. When you touch any file in the inventory below, update the relevant section here in the same commit. Line numbers rot — reference by exported symbol/function name, not by line.

---

## 1. Intent

The hero is a **four-layer composite** rendered inside a `100vh` viewport:

1. **GLSL field** — procedural FBM noise + orthogonal grid + Bayer 4×4 dither, monochrome in the cycling accent color.
2. **Canvas 2D particle ring + iris cloud** — two coherent pointclouds sharing an angular-groups table so wedge modulations align across layers. Post-processed with a per-frame horizontal pixel-sort pass that smears bright runs into streaks.
3. **HTML wordmark overlay** — SIGNALFRAME//UX lockup with per-character roll-up, multilingual ScrambleText sequence, and a scroll-scrubbed VL-05 magenta slash moment.
4. **Site-wide VHS overlay** — composited on top, not hero-specific but always visible within the hero.

All four couple through a small number of CSS custom properties (`--sfx-primary`, `--sf-hero-particle-lch`, `--sfx-signal-intensity`) and a shared `SharedGroups` table exported from `pointcloud-ring.tsx`.

---

## 2. File inventory (paint order, back → front)

### 2.1 Shell & routing
| File | Role | Packaging note |
|---|---|---|
| `app/page.tsx` | Hosts `<EntrySection />` inside an `SFSection label="ENTRY" bgShift="black" h-screen overflow-hidden`. | Consumer-side. Example usage only. |
| `components/sf/sf-section.tsx` | Emits `data-bg-shift` + `data-section-label` attrs. | Keep as peer dep on `@sf/primitives`. |

### 2.2 Orchestrator
| File | Role |
|---|---|
| `components/blocks/entry-section.tsx` | Mounts GLSL + ring + iris + HTML overlay + VL-05 slash. Owns the `Float32Array(128)` shared-groups table and its 13s / 13% re-roll loop. Exports nothing — homepage-only. |

### 2.3 GLSL field (z-0)
| File | Role |
|---|---|
| `components/animation/glsl-hero-lazy.tsx` | `next/dynamic({ssr:false})` wrapper — required because `GLSLHero` uses WebGL. |
| `components/animation/glsl-hero.tsx` | `GLSLHero` component. Full-screen quad (`PlaneGeometry(2,2)` + `OrthographicCamera(-1,1,1,-1,0,1)`). Fragment: `fbm(uv*4 + vec2(uTime*.1, uTime*.07)) * 0.5±.5*uIntensity` + grid lines (`step(fract(uv*uDensity), .02)`) + Bayer 4×4 threshold → `uColor * dithered`. Uniforms mutated externally (never via `gsap.to`): `uScroll/uGridDensity` from ScrollTrigger, `uTime/uIntensity/uSpeed/uAccent` from GSAP ticker, `uMouse` from pointermove, `uColor` from `resolveColorAsThreeColor('--sfx-primary', ttl:2000)`. WebGL check cached on `globalThis.__sf_has_webgl` to survive HMR. Reduced-motion → static fallback div at `--color-primary / 0.1 opacity`. |
| `hooks/use-signal-scene.ts` | `useSignalScene(elementRef, buildScene)` — registers with the `SignalCanvas` singleton, gates rendering via IntersectionObserver, disposes geometry/material/textures on unmount. |
| `lib/signal-canvas.tsx` | Singleton WebGL renderer + shared GSAP ticker render loop. Exports `registerScene/deregisterScene/setSceneVisibility/disposeScene`. |
| `components/layout/signal-canvas-lazy.tsx` | Mounts the singleton once at the root layout. |
| `lib/color-resolve.ts` | TTL-cached CSS var → `THREE.Color` parser. Keeps shader `uColor` updates decoupled from per-frame `getComputedStyle`. |

### 2.4 Canvas 2D particles (above GLSL, below text)

Both pointclouds now render entirely off the main thread. Each React wrapper creates a dedicated Web Worker, calls `canvas.transferControlToOffscreen()` and posts the handle + config to the worker; the worker owns particle state, the rAF loop, and the pixel-sort pass. Main thread only forwards lifecycle events (theme, resize, visibility, group re-rolls) via `postMessage` + `BroadcastChannel`.

| File | Role |
|---|---|
| `components/dossier/pointcloud-ring.tsx` | Thin React host. Transfers the canvas, spawns `pointcloud-ring-worker.ts`, owns the `IntersectionObserver` (visibility gate), `MutationObserver` (`--sf-hero-particle-lch` forwarding), and `window.resize` forwarding. Exports the `SharedGroups` type. |
| `components/dossier/pointcloud-ring-worker.ts` | Dedicated worker. Owns ~4 200 particles across 6 nested radial bands (core/halo/outer1–4), counter-rotating band groups, breath oscillation, offscreen `OffscreenCanvas` buffer + `destination-out` trail fade, **in-place Uint32 row-sort** (sort key = alpha high byte under LE native Uint32; matches original `DataView BE + & 0xff` semantics). **180-frame synchronous warmup** on init so streaks are mature at first visible frame. Subscribes to `sf-hero-shared-groups` BroadcastChannel for cross-layer group coherence. |
| `components/dossier/iris-cloud.tsx` | Thin React host. Same pattern as ring host; spawns `iris-cloud-worker.ts`. |
| `components/dossier/iris-cloud-worker.ts` | Dedicated worker. Owns ~4 500 particles drifting radially outer→pupil. Same warmup + in-place Uint32 sort + BroadcastChannel subscription. Particle `groupIdx` derived from `theta` so wedges align with the ring. |

### 2.5 HTML wordmark (z-10 — LCP target)
| Location | Role |
|---|---|
| `entry-section.tsx` inline `<h1>` | Per-character `<span data-anim="hero-char">` spans for S·I·G·N·A·L·F·R·A·M·E + primary-colored `//` + U·X. Subtitle `[data-anim="hero-subtitle"]`. Initial `opacity:0.01` hints so Lighthouse sees text without visible flicker. |

### 2.6 VL-05 magenta slash moment (z-20)
| Location | Role |
|---|---|
| `entry-section.tsx` inline div | Invisible spacer spans ("SIGNALFRAME" + "UX") pin the `//` glyph to the exact x-position of the h1 slash. `mix-blend-mode: screen` + `text-primary` + scroll-scrubbed opacity (triangle curve peaking at t=0.3). |

### 2.7 GSAP choreography
All in `components/layout/page-animations.tsx`:
- `initHeroAnimations()` — lazy-imported with SplitText + ScrambleText from `lib/gsap-plugins`. Runs in its own `gsap.context` tracked separately from core.
  - **hero-char timeline**: `y:100%→0` roll-up + 4-step flicker, then `onComplete → revealMultilingual()`.
  - **revealMultilingual()**: ScrambleText across katakana → farsi → mandarin, then subtitle `y:20→0`.
  - **Accent color cycle**: `delay:2` timeline flashes `--sfx-primary` through 7 hues, lands on magenta + `triggerColorStutter()`. Mutates `<html>.style`; GLSL shader `uColor` picks it up on its next 2s TTL refresh.
  - **VL-05 scrub**: `ScrollTrigger.create({ trigger: '[data-entry-section]', ... })` with an `onUpdate` that writes `slashMoment.style.opacity` as `peak=0.3, rise:0.25→1.0, fall:1.0→0.2`.
  - Guarded legacy steps (hero-mesh, hero-slashes, hero-feel, hero-copy, cta-btn, hero-copy-dot): targets live on the retired `components/blocks/hero.tsx`, no-op on EntrySection.
- `applyBgShift()` + sibling ScrollTrigger loop — homepage background flip system (see §3).

### 2.8 Signal intensity plumbing
| File | Role |
|---|---|
| `components/layout/global-effects.tsx` | `SignalIntensityBridge` reads `--sfx-signal-intensity` and writes derived tokens via `updateSignalDerivedProps()`. Observes `<html>.style`. |
| `components/animation/signal-overlay.tsx` | Off-screen slider UI that writes the intensity var. |
| `lib/signal-derived.ts` (implicit — ships with `SignalIntensityBridge`) | Maps raw intensity → derived effect tokens (noise opacity, scanline opacity, chromatic opacity). |

### 2.9 VHS overlay (site-wide — always over the hero)
| File | Role |
|---|---|
| `components/animation/vhs-overlay.tsx` | 10-layer overlay. Layers most relevant to hero: `.vhs-aberration--top/--bottom` (just reduced to 0.5 opacity per `752075e`), `.vhs-chromatic--red/--cyan` (intensity-gated >0.3), `.vhs-noise`, scanlines. |
| `app/globals.css` `.vhs-*` block (≈ lines 1900–2100) | All layer styles. Keep this block atomic when extracting. |

---

## 3. Cross-cutting systems the hero depends on

### bgShift palette (light-mode particle visibility)
- `page-animations.tsx` — `applyBgShift(target)` reads `--sfx-background` / `--sfx-foreground` / `--sfx-primary`, builds palette.
  - **Dark mode**: `{white: var(--color-background), black: oklch(0.08 0 0), primary}`
  - **Light mode**: `{white: fg, black: bg, primary}` — **palette is inverted**, so `bgShift="black"` on EntrySection resolves to `--sfx-background` (white) in light mode.
  - This inversion is exactly why `--sf-hero-particle-lch` needs a light-mode variant.
- `#bg-shift-wrapper` in `globals.css:713-721` — `transition: background-color 0.05s step-end` → hard cuts between sections (no fade).

### Dark-section text overrides
- `globals.css:733-736` — `[data-bg-shift="black"] { --sfx-muted-foreground: oklch(0.65 0 0) }` for WCAG AA on near-black.

---

## 4. CSS tokens required

| Token | Defined in | Consumed by |
|---|---|---|
| `--sfx-primary` | `:root`, `.dark`, color-cycle timeline, `ColorCycleFrame` | GLSL `uColor`, VL-05 slash `text-primary`, VHS aberration edge hue |
| `--sfx-theme-hue` | `:root` | derivation of `--sfx-primary`, `.vhs-aberration--top` |
| `--sfx-signal-intensity` | `:root` + slider writes | `SignalIntensityBridge` derives GLSL uniforms |
| `--sfx-signal-speed` | derived | GLSL ticker `uTime` scale |
| `--sfx-signal-accent` | derived | GLSL `uAccent` (reserved) |
| `--sf-hero-particle-lch` | `:root` = `0.7 0 0`, `.dark` = `0.96 0.01 90` | ring + iris `fillStyle`/`strokeStyle` |
| `--sfx-background`, `--sfx-foreground` | `:root`, `.dark` | bgShift palette + #bg-shift-wrapper |
| `--sfx-vhs-noise-opacity`, `--sfx-vhs-scanline-opacity`, `--sfx-vhs-chromatic-opacity` | derived by `SignalIntensityBridge` | VHS overlay layers |

---

## 5. Runtime dependencies

- `next` `>=15.3.0` — `dynamic({ssr:false})` for WebGL, App Router `"use client"`
- `react` `>=19.0.0`, `react-dom` `>=19.0.0`
- `three` `>=0.183.0` — `ShaderMaterial`, `OrthographicCamera`, `PlaneGeometry`, `Scene`, `Mesh`, `Color`, `Vector2`
- `gsap` `^3.14` — core + ScrollTrigger + `useGSAP`. Lazy-loaded plugins for hero: SplitText, ScrambleText
- `clsx` + `tailwind-merge` — via `lib/utils.ts` `cn()`
- `lenis` `^1.1.20` — site-wide smooth scroll, indirectly influences ScrollTrigger progress
- Tailwind CSS v4 (`@theme` in `globals.css`) — required for `--sfx-*` tokens and `text-primary` / `bg-background` class resolution

**Zero-dep footprint for canvas layers**: `pointcloud-ring` + `iris-cloud` + `vhs-overlay` use only browser APIs + GSAP. GLSL needs Three.js.

---

## 6. Data flow diagrams

### Signal intensity → shader
```
signal-overlay.tsx (slider)
  → root.style.setProperty('--sfx-signal-intensity', v)
  → MutationObserver([style]) in SignalIntensityBridge
  → updateSignalDerivedProps(intensity)  (sets vhs-noise-opacity, etc.)
  → MutationObserver([style]) in glsl-hero.tsx (_signalIntensity cache)
  → next ticker tick → uniforms.uIntensity.value = _signalIntensity
  → WebGL uniform upload on next render
```

### Theme flip → particle color
```
lib/theme.ts (toggle)
  → document.documentElement.classList.toggle('dark')
  → MutationObserver([class]) in pointcloud-ring.tsx (particleLCH cache)
  → next frame → fillStyle = `oklch(${particleLCH} / 0.75)`
```

### Scroll → hero slash opacity
```
window scroll
  → Lenis smooth-scroll update
  → ScrollTrigger.update() on next rAF
  → VL-05 onUpdate(self) → triangle curve(self.progress)
  → slashMoment.style.opacity = String(intensity)
```

### Shared groups re-roll
```
setInterval(13000)
  → rewrite 13% random entries of sharedGroups.intensity/fade
  → pointcloud-ring + iris-cloud both read arrays live per frame
  → visible coherent wedge modulation across layers
```

---

## 7. Legacy / adjacent code (NOT on `/`)

Keep these out of the packaged module but note them for context:
- `components/blocks/hero.tsx` — 2-panel retired hero, still used at `/init` and as a reference layout.
- `components/animation/hero-mesh.tsx` — canvas dot grid w/ mouse repulsion. White-on-dark only; no theme awareness needed because its host panel is always dark.
- `components/animation/color-cycle-frame.tsx` — scroll-wheel accent cycling + text-clip wipe. Not active on EntrySection.

---

## 8. Packaging constraints

When extracting this subsystem for distribution:

### Must travel together
- EntrySection orchestrator + both canvas components (`SharedGroups` coupling is tight).
- `useSignalScene` + `signal-canvas` singleton + `color-resolve` (co-dependent).
- All tokens in §4 and the `#bg-shift-wrapper` rule — without them, light-mode particles vanish and the section transitions animate instead of hard-cutting.

### Can be stubbed
- `SignalIntensityBridge` — default `uIntensity = 0.5` gives a reasonable baseline. The bridge + slider can ship as an optional peer package.
- VHS overlay — visually dependent but functionally independent. Can ship as a separate `@sf/vhs` module.
- GSAP plugin-driven hero-char reveal — nice-to-have. Without it, the wordmark just appears immediately.

### Requires renaming / namespacing
- `[data-anim="hero-char"]`, `[data-anim="hero-subtitle"]`, `[data-anim="hero-slash-moment"]`, `[data-entry-section]` — scope under a `[data-sf-hero-*]` prefix when packaging to avoid consumer-project collisions.
- `--sf-hero-particle-lch` — already prefixed correctly. `--sfx-primary` / `--sfx-signal-*` need a rename decision: keep `sfx-` or adopt `sf-hero-` for the packaged surface.

### Carry-over hazards
- `globalThis.__sf_has_webgl` cache is global; multiple packaged instances on one page would share it.
- The 128-wedge `SHARED_GROUP_COUNT` is hardcoded in `entry-section.tsx`; expose as a prop when packaging.
- `WARMUP_FRAMES = 180` in both canvas components is a visual quality vs. hydration-cost tradeoff. Consider a prop with defaults per deployment context.

---

## 9. Known omissions / deferred decisions

- **GLSL in light mode**: `uColor` is still `--sfx-primary` (the cycling accent) in light mode. User hasn't asked for this to be toned. If future light-mode audit demands a desaturated field, add a parallel `--sf-hero-field-hue` token.
- **`.vhs-chromatic--red/--cyan` (Layer 7 of VHS)** are viewport-wide, not edge-limited. The `opacity: 0.5` reduction we shipped in `752075e` only affects `.vhs-aberration--top/--bottom`. If the full-viewport RGB offset needs the same treatment, it would apply at `--sfx-vhs-chromatic-opacity` derivation in `SignalIntensityBridge`.
- **Token consolidation**: `--sfx-*` vs `--sf-*` prefixes coexist. Packaging will force a naming pass.

---

## 10. Related references

- **Aesthetic lineage & design rationale**: `~/greyaltaer/vaults/wiki/` — see `analyses/culture-division-operating-principles.md` and `analyses/frame-signal-intellectual-lineage.md`.
- **Other codebase intel**: `.planning/codebase/ARCHITECTURE.md`, `STRUCTURE.md`, `INTEGRATIONS.md`.
- **Aesthetic prototype audit**: `.planning/v1.7-prep/aesthetic-prototypes.md` (documents chromatic aberration patterns and halftone options).
- **Phase context for recent changes**: `.planning/phases/` — particularly phases touching pointcloud-ring + iris-cloud.

---

## Changelog

- 2026-04-21 — **CLS fix.** `ScaleCanvas` was applying its scale transform + setting `--sf-content-scale` in a `useEffect`. First paint: sections resolved `h-screen = 100vh = 810px` (fallback). Effect fires → var set → sections become `100vh/scale = 2073px` → flex-center jumped every absolutely-positioned hero element by ~247px. Chrome measured **CLS 0.6529 @ t=646ms**. Fix: blocking inline `scaleScript` in `app/layout.tsx` sets the CSS vars pre-hydration; new CSS rule `[data-sf-canvas] { transform: scale(var(--sf-content-scale, 1)); transform-origin: top left; }` drives the transform from first paint. `ScaleCanvas.applyScale()` no longer writes inline `transform` (CSS handles it) and no longer sets `data-nav-layout` (now static on `<body>` in layout.tsx). Verified: **CLS 0.65 → 0.00** (Chrome trace), mobile CLS 0.0004, desktop CLS 0.0013. LCP unchanged.
- 2026-04-20 — Initial map. Captures state at commits `3a7be99` (theme-aware hero particle color) + `752075e` (halved aberration edges).
- 2026-04-19 — **Hero perf refactor.** PointcloudRing + IrisCloud render loops moved off main thread via OffscreenCanvas + dedicated Web Workers. Shared-group re-rolls now fan out through the `sf-hero-shared-groups` BroadcastChannel (owned by EntrySection). Row-sort switched to in-place `Uint32Array` subarray sort. IntersectionObserver gates both canvases' rAF. Commits: `6a1dd1c` (A1 IO pause), `26fcea8` (A2 in-place sort), `7558022` (B1 ring worker), `be564a4` (B2 iris worker). Steady-state prod hero-visible FPS: **10 → 120**. Long-task main-thread time in a 6s window: **6062ms → 0ms**. LCP: 198 → 77 ms. Visuals unchanged. CLS (0.65) and bundle size (452 kB) remain as separate open items.
