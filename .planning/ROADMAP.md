# Roadmap: SignalframeUX

## Milestones

- [x] **v1.0 Craft & Feedback** — Phases 1-5 (shipped 2026-04-05)
- [ ] **v1.1 Generative Surface** — Phases 6-9 (active)

## Phases

<details>
<summary>v1.0 Craft & Feedback (Phases 1-5) — SHIPPED 2026-04-05</summary>

- [x] Phase 1: FRAME Foundation (3/3 plans) — completed 2026-04-06
- [x] Phase 2: FRAME Primitives (2/2 plans) — completed 2026-04-06
- [x] Phase 3: SIGNAL Expression (4/4 plans) — completed 2026-04-06
- [x] Phase 4: Above-the-Fold Lock (3/3 plans) — completed 2026-04-06
- [x] Phase 5: DX Contract & State (2/2 plans) — completed 2026-04-06

</details>

### v1.1 Generative Surface

- [ ] **Phase 6: Generative SIGNAL Foundation** — Singleton renderer, disposal contract, color bridge, SSR safety, performance gate
- [ ] **Phase 7: SIGNAL Activation** — Dormant effects activated: cursor, idle animation, audio, haptic
- [ ] **Phase 8: First Generative Scenes** — SignalMesh validates the full WebGL pipeline; token visualization via Canvas 2D
- [ ] **Phase 9: Extended Scenes + Production Integration** — ASCII shader, GLSL hero, showcase pages consuming SF primitives

## Phase Details

### Phase 6: Generative SIGNAL Foundation
**Goal**: The singleton WebGL infrastructure exists and is validated — no generative scenes, but every safety constraint is enforced before any scene is built
**Depends on**: Phase 5 (v1.0 complete)
**Requirements**: GEN-01, GEN-02, GEN-03, GEN-04, GEN-05
**Success Criteria** (what must be TRUE):
  1. A single `SignalCanvas` renderer is mounted in RootLayout; opening multiple routes with canvas components shows only one WebGL context in browser devtools
  2. `lib/color-resolve.ts` is importable by any canvas component and returns sRGB values that visually match adjacent CSS elements using the same OKLCH tokens
  3. Turning on "prefers-reduced-motion" in OS settings causes all canvas components to render a static fallback frame with no animation loop running
  4. `next build` completes with zero `window is not defined` errors; bundle analyzer confirms Three.js lands in an async chunk, not the initial load
  5. Lighthouse 100/100 is maintained across all pages after the WebGL infrastructure is added
**Plans**: 2 plans
Plans:
- [x] 06-01-PLAN.md — Install Three.js + bundle analyzer, create color-resolve.ts bridge, create SSR-safe signal-canvas-lazy.tsx wrapper
- [x] 06-02-PLAN.md — Build singleton SignalCanvas renderer, useSignalScene hook, mount in RootLayout

### Phase 7: SIGNAL Activation
**Goal**: Every dormant SIGNAL effect is activated — the canvas cursor fires on all showcase sections, the idle state proves the site is alive, audio and haptic feedback complete the multi-sensory terminal voice
**Depends on**: Phase 6
**Requirements**: SIG-06, SIG-07, SIG-08, SIG-09
**Success Criteria** (what must be TRUE):
  1. Moving the cursor into any showcase section activates the crosshair and particle trail from the existing CanvasCursor — no cursor code is rewritten, only `[data-cursor]` attributes are added
  2. After a defined inactivity period, the page surface visibly shifts (grain drift and OKLCH color pulse) without any layout movement or CLS
  3. Interacting with components plays audible oscillator tones in a browser with sound on; the tones match a DU/TDR terminal voice register (not UI sounds)
  4. On a supported device, interactions produce micro-vibration haptic feedback; on Safari/iOS the behavior degrades silently with no errors
  5. Toggling OS reduced-motion halts the idle animation and suppresses audio — the reduced-motion path is silent and static
**Plans**: 2 plans
Plans:
- [x] 07-01-PLAN.md — Audio feedback + haptic feedback utilities, document-level interaction listener
- [x] 07-02-PLAN.md — Idle state upgrade (8s threshold, OKLCH pulse, grain drift) + data-cursor placement on all showcase sections

### Phase 8: First Generative Scenes
**Goal**: The first WebGL scene (`SignalMesh`) validates the full pipeline under production conditions — scissor split, scroll-reactive uniforms, memory disposal; the token visualization proves the system can depict itself
**Depends on**: Phase 6
**Requirements**: SCN-01, SCN-02
**Success Criteria** (what must be TRUE):
  1. `SignalMesh` renders a parametric 3D geometry in the browser; scrolling the page visibly changes the geometry's appearance through GSAP ScrollTrigger-wired uniforms
  2. Navigating away from a page containing `SignalMesh` and back again shows no increase in `renderer.info.memory.geometries` — the disposal contract is working
  3. The data-driven token visualization renders the actual token values from the design system; the canvas output is visually legible and updates when tokens change
  4. OKLCH color tokens render in the canvas at the same perceived hue and lightness as the adjacent CSS elements using the same token — no color space mismatch visible
**Plans**: 2 plans
Plans:
- [ ] 08-01-PLAN.md — SignalMesh WebGL scene + color-resolve.ts TTL cache optimization
- [ ] 08-02-PLAN.md — Canvas 2D token visualization on /tokens page

### Phase 9: Extended Scenes + Production Integration
**Goal**: The DU/TDR aesthetic differentiators (ASCII shader, GLSL hero) are shipped; all showcase pages consume SF layout primitives and carry generative zones — the portfolio is complete as a SOTD entry
**Depends on**: Phase 8
**Requirements**: SCN-03, SCN-04, INT-01, INT-02, INT-03, INT-04
**Success Criteria** (what must be TRUE):
  1. The ASCII/dithering post-process shader renders visibly on at least one showcase surface with a recognizable ordered-dither pattern — not grain noise, but computed threshold dithering
  2. The hero section renders a custom GLSL procedural background that responds to scroll position and changes when `--color-primary` changes via the theme cycle
  3. All showcase pages (Work, Case Study, About, Components) use `SFSection`, `SFStack`, and `SFGrid` as the layout backbone — no raw `div` layout wrappers remain at section level
  4. Component grid blocks on showcase pages stagger-animate on scroll via `data-anim="stagger"` — the animation fires once per scroll into view
  5. Lighthouse 100/100 is maintained across all pages with generative content active; CRT critique score for pages with generative content reaches >= 90/100
**Plans**: 3 plans
Plans:
- [ ] 09-01-PLAN.md — GLSL hero shader with integrated Bayer 4x4 dither + SignalMesh relocation to /components
- [x] 09-02-PLAN.md — SignalMotion scroll-driven animation component + SIGNAL overlay parameter panel
- [ ] 09-03-PLAN.md — SF layout primitive migration across all 5 pages + stagger animation activation

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. FRAME Foundation | v1.0 | 3/3 | Complete | 2026-04-06 |
| 2. FRAME Primitives | v1.0 | 2/2 | Complete | 2026-04-06 |
| 3. SIGNAL Expression | v1.0 | 4/4 | Complete | 2026-04-06 |
| 4. Above-the-Fold Lock | v1.0 | 3/3 | Complete | 2026-04-06 |
| 5. DX Contract & State | v1.0 | 2/2 | Complete | 2026-04-06 |
| 6. Generative SIGNAL Foundation | v1.1 | 2/2 | In progress | - |
| 7. SIGNAL Activation | v1.1 | 2/2 | In progress | - |
| 8. First Generative Scenes | v1.1 | 0/2 | Not started | - |
| 9. Extended Scenes + Production Integration | v1.1 | 1/3 | In progress | - |
