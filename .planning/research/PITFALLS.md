# Domain Pitfalls — v1.7 Aesthetic Effects + Token Bridge

**Domain:** Adding layered CSS visual effects (grain, VHS, halftone, glitch, particles, mesh gradient), a design token bridge, and copy audit to an existing Next.js 15.3 + GSAP + Three.js production site.
**Researched:** 2026-04-11
**Milestone scope:** v1.7 — CSS-first effects, `--signal-intensity` wiring, token bridge for CD site, copy audit, Storybook story additions.
**Confidence:** HIGH (WebGL context limits, GSAP CSS conflicts — verified against official GSAP docs and browser bug trackers) / HIGH (backdrop-filter Safari issues — verified against MDN browser compat data and active bug reports) / HIGH (SSR flash / token cascade — verified against Next.js discussions and next-themes patterns) / MEDIUM (feTurbulence CPU compositing — confirmed for Chrome, Firefox recently improved but GPU path is conditional) / MEDIUM (Lighthouse sensitivity to CSS effects — derived from Chromium rendering architecture documentation) / LOW (combined-effect moiré and GPU budget — no automated benchmark exists; based on analyst brief + rendering model)

---

## Critical Pitfalls

### Pitfall 1: Token Bridge Flash of Wrong Color During RSC Streaming

**What goes wrong:**
`signalframeux.css` sets `--color-primary` to magenta in `:root`. When CD imports `signalframeux/signalframeux.css` followed by `cd-tokens.css` in `app/layout.tsx`, any RSC chunk that streams before the override CSS fully resolves will receive the magenta primary color for that render frame. This produces a magenta flash on the CD homepage — a client-visible regression on the production front door.

A separate flash window exists for dark mode: SF//UX's `:root` block is light mode (off-white background, dark text). CD is dark-only. If CD's `<html>` does not have `class="dark"` synchronously server-rendered, SF//UX components will render in light mode until the dark class is applied. Client-side ThemeProviders apply the class after hydration, creating a visible flash of white.

**Why it happens:**
Next.js App Router streams RSC chunks as they resolve. The layout's CSS imports are not guaranteed to block all streaming boundaries. The browser processes the import chain sequentially, but streaming can deliver a component's HTML before the cascade has settled to the override values. `next-themes` and similar libraries apply the dark class via a client-side script, which runs after the initial paint.

**Consequences:**
Magenta flash on first load in production. White background flash if dark class is not server-rendered. Both are visible to real users; neither is caught by local Lighthouse testing (Lighthouse simulates a clean load but doesn't capture visual flash windows at the millisecond level).

**Prevention:**
- Inline the critical CD token overrides (`--color-primary`, `--color-background`, `--color-foreground`) as a `<style>` block in the `<head>` before the SF//UX import, so they are present before any HTML streams.
- Server-render `class="dark"` on `<html>` unconditionally — not via a client ThemeProvider. In CD's `app/layout.tsx`, hardcode `<html className="dark">` since CD is dark-only. Never delegate this to a client component.
- Document in CD's `app/layout.tsx` import comment: "Must import from `signalframeux/signalframeux.css` (dist artifact), never from source, to avoid PostCSS reprocessing SF//UX's `@theme` blocks through CD's Tailwind instance."
- Test by throttling network to Slow 3G in Chrome DevTools, then hard-reload CD's homepage. If there is a flash, it is visible at this speed.

**Detection warning signs:**
- Magenta visible for < 200ms on first load in production (not seen in local dev due to hot module cache).
- White page flash before dark mode applies on first load.
- `next-themes` in use on CD — nearly always means the dark class is applied client-side.

**Phase to address:** Phase 0 (token bridge import chain). Must be resolved before any Phase 1 component swaps. Retrofit is painful because every subsequent phase tests against a broken base.

---

### Pitfall 2: CSS `backdrop-filter` Requires `-webkit-` Prefix on Safari and Cannot Use CSS Variables

**What goes wrong:**
As of Safari 18 (2025), `backdrop-filter` still requires the `-webkit-` prefix to work reliably. Additionally — and this is the less-known issue — CSS custom properties (`var(--token)`) cannot be used as values inside `backdrop-filter` on Safari. Writing `backdrop-filter: blur(var(--sf-blur-amount))` is valid CSS but silently fails in Safari; the property is ignored entirely. This affects the VHSOverlay and any glassmorphism-adjacent effects built with token-driven blur values.

A second rendering bug in Safari 18: when `background-color` and `backdrop-filter: blur()` are combined, the element renders completely white instead of the intended frosted effect. This affects components using semi-transparent backgrounds with blur.

**Why it happens:**
Safari's implementation of `backdrop-filter` lags the spec. The variable resolution bug is a WebKit limitation — custom properties are resolved at computed-value time, but `backdrop-filter` parsing in WebKit does not accept the resolved value from a variable reference. This is a known open MDN compatibility bug (issue #25914).

**Consequences:**
VHS effects with token-driven opacity or blur values silently degrade to no-effect on all iOS Safari and macOS Safari. This is > 20% of traffic for most design-forward audiences. The effect appears to work in Chrome DevTools mobile simulation (Chrome resolves the variable correctly) and fails only on real Safari.

**Prevention:**
- Always write `backdrop-filter` values as literals, not `var()` references. If a token governs the value, compute the literal at build time or use a PostCSS plugin to inline the value.
- Always write both `-webkit-backdrop-filter` and `backdrop-filter` properties, in that order.
- Test specifically on Safari for Mac (not Chrome) and on a real iOS device (not Simulator — iOS Simulator uses the macOS rendering engine, which may differ from device behavior).
- For semi-transparent backgrounds with blur, test the combination of `background-color: rgba(...)` + `backdrop-filter` on Safari 18 specifically. If white rendering occurs, switch to `background-color: transparent` with the blur applied to a pseudo-element.

**Detection warning signs:**
- Blur effect visible in Chrome, absent in Safari.
- Component renders correctly in Chrome DevTools iOS emulation but fails on real iPhone Safari.
- No console error — the property is silently ignored.

**Phase to address:** Any phase adding or modifying `backdrop-filter` usage (VHSOverlay enhancement phases). Add a Safari-specific smoke test to the manual verification checklist before each such phase ships.

---

### Pitfall 3: GSAP CSS Transition Conflict on Effect-Animated Elements

**What goes wrong:**
If a CSS transition is applied to an element that GSAP also animates (e.g., tweening `--sf-grain-opacity` on an element that has `transition: opacity 0.3s ease`), the browser enters a loop: every GSAP `requestAnimationFrame` tick sets a new interpolated value, the CSS transition intercepts it and starts animating toward that value, then the next tick sets another new value and the transition starts over. The result is the element never reaches its target value — it lags indefinitely. With `--sf-grain-opacity` governed by both `--signal-intensity` CSS expressions and GSAP idle escalation tweens, this conflict is likely to occur on any element that also has hover transitions.

**Why it happens:**
The idle escalation system (Phase 2 grain tween, Phase 4 VHS glitch timing) uses GSAP to tween CSS custom properties. SF//UX components typically include CSS transitions for hover states. If both target the same property on the same element (even indirectly through `calc()` expressions), the conflict is silent but produces incorrect animation behavior.

**Consequences:**
Idle escalation effects lag or fail to reach their target intensity. Hover transitions on components conflict with GSAP-driven effect tweens. The idle system's 4-phase timing sequence breaks: Phase 2 may start before Phase 1 reaches its target, compounding into a cascade failure of the escalation sequence.

**Prevention:**
- Establish a rule: if GSAP owns an animation for an element or custom property, remove all CSS transitions from that property on that element. This must be enforced as a code review criterion.
- For the idle escalation system, scope GSAP tweens to CSS custom properties on `:root` (e.g., tweening `--sf-grain-opacity` at the `:root` level) rather than targeting component elements directly. `:root` custom property tweens do not conflict with component-level CSS transitions.
- Audit all effect components (`GrainOverlay`, `VHSOverlay`) for CSS transitions on the same properties that GSAP idle escalation tweens.

**Detection warning signs:**
- Effect intensity "wobbles" rather than reaching a clean target value during idle escalation.
- Hover interaction on a component causes an effect overlay to stutter.
- Animation duration feels "doubled" — property takes twice as long to settle as specified.

**Phase to address:** Before any idle escalation GSAP implementation (currently Phase 3 escalation work). Audit and remove conflicting CSS transitions before writing the tween code.

---

### Pitfall 4: WebGL Context Limit on iOS Safari Breaks Particle Field

**What goes wrong:**
iOS Safari has a hard limit on simultaneous WebGL contexts per page (documented behavior: 2–8 contexts depending on device generation and available GPU memory). The existing SignalframeUX implementation runs 4 WebGL scenes (GLSLHero, GLSLSignal, ProofShader, SignalMesh) through a singleton `WebGLRenderer`. Adding a particle field (effect 5) that requires its own WebGL canvas — rather than sharing the singleton renderer — creates a second WebGL context. On lower-end iOS devices, this exceeds the safe limit.

When the limit is exceeded, iOS Safari issues a "WebGL: context lost" error to one or more canvases. This is not a graceful degradation — the WebGL scene goes black and the `webglcontextlost` event fires. The user sees a blank or partially blank page section.

**Why it happens:**
Each `<canvas>` element with a distinct `WebGLRenderingContext` counts toward the device's context limit. The singleton renderer pattern avoids this by sharing one context across multiple scenes via render targets. A particle field built with its own canvas and context (common Three.js BufferGeometry pattern) breaks the singleton architecture.

Context loss is also triggered by: backgrounding Safari (iOS 17+ bug, webkit.org/b/261331), exceeding GPU memory budget, and switching tabs when 2+ pages are using WebGL simultaneously.

**Consequences:**
Particle field goes black on iPhone XR/11/12/13 (the most common devices in the target audience). Existing WebGL scenes may also lose context if the OS reclaims GPU resources. No console error in production builds (context loss is handled silently by many WebGL frameworks unless explicit `webglcontextlost` listeners are registered).

**Prevention:**
- Do not create a separate WebGL canvas for the particle field. Implement it within the existing singleton `WebGLRenderer` as an additional scene or render pass, using IntersectionObserver to gate its rendering (same pattern as existing scenes).
- If a separate canvas is unavoidable, implement `webglcontextlost` and `webglcontextrestored` event handlers on every WebGL canvas to gracefully show a fallback and attempt restoration.
- Test on physical iOS devices, not Simulator. The Simulator does not enforce the same GPU memory limits as hardware.
- Alternatively, implement the particle field as a CSS-only solution (radial gradients, `@keyframes`, `box-shadow` sprite sheets) to eliminate WebGL context dependency entirely — this also satisfies the "CSS-first" constraint stated in the milestone.

**Detection warning signs:**
- "WebGL: context lost" in Safari console on iOS.
- Black canvas element visible in DOM with correct dimensions.
- Inconsistent behavior between Chrome iOS and Safari iOS on the same device.

**Phase to address:** Particle field implementation phase (effect 5). Architecture decision (singleton vs separate canvas) must be made before any WebGL particle code is written. Retrofitting context management is expensive.

---

### Pitfall 5: Idle Escalation Tweens Run in the Wrong Direction After Grain Baseline Raise

**What goes wrong:**
The idle escalation system's Phase 2 tweens `--sf-grain-opacity` toward `0.08` (the escalation target). This assumes the resting baseline grain is `0.03`. After the aesthetic push raises the baseline to `0.08–0.12`, the Phase 2 escalation target (`0.08`) is at or below the new baseline. The tween fires, reaches `0.08`, and then the property stays at `0.08` — which is either no change or a reduction from the `0.12` baseline. The idle system runs, consumes its timing cycle, but produces no perceivable effect or produces the wrong direction of change (grain dims during idle instead of intensifying).

**Why it happens:**
The idle escalation thresholds (`0.03` baseline, `0.08` Phase 2 target) were specified against the pre-v1.7 grain system. The aesthetic push changes the baseline without recalibrating the escalation targets. The audit notes this risk explicitly, but it is easy to implement the grain raise in isolation without auditing the escalation code.

**Consequences:**
The idle escalation system silently fails to produce the intended atmospheric intensification. A 4-phase escalation sequence does nothing visible at Phase 2. At Phase 4, VHS glitch effects may still fire (if they are not grain-dependent), creating an inconsistency where heavy effects appear but the grain foundation does not build toward them.

**Prevention:**
- Before implementing any grain baseline change, document the new escalation target values for all 4 phases and update the constants in a single commit.
- The escalation thresholds must be defined as offsets from the current baseline, not absolute values: `IDLE_PHASE_2_GRAIN = currentBaseline * 1.5`, not `IDLE_PHASE_2_GRAIN = 0.08`.
- After raising the grain baseline, run the idle escalation sequence end-to-end on the homepage and verify grain visibly increases at each phase.

**Detection warning signs:**
- Idle escalation timer fires (visible in GSAP DevTools) but no visual change occurs.
- Console logging `--sf-grain-opacity` during idle shows it tweening to a value equal to or less than the current computed value.
- Phase 4 VHS glitch fires but grain has not built toward it.

**Phase to address:** Grain baseline raise phase. The escalation recalibration must be in the same PR as the baseline change — not a follow-up.

---

## Moderate Pitfalls

### Pitfall 6: Grain + Halftone Moiré at High `--signal-intensity`

**What goes wrong:**
Grain texture (noise at `0.12` opacity) composited with halftone (dot-grid at any coverage) produces a moiré interference pattern — a visible secondary pattern that neither effect intends. This occurs because both effects are frequency-based textures rendered at similar spatial frequencies on screen. The moiré is most visible at medium intensity values and at specific screen resolutions where the dot pitch of the halftone aligns with the pixel-level noise of the grain.

**Why it happens:**
Moiré is a physical consequence of combining two periodic or quasi-periodic patterns. feTurbulence grain is not strictly periodic, but at lower `numOctaves` values, it has characteristic frequencies. Halftone dot patterns are periodic. When their frequencies are close enough, the beat frequency (the moiré) becomes visible.

**Consequences:**
A vibrating, pulsing visual artifact that reads as a rendering error rather than intentional texture. Most visible in screenshots and screen recordings (which may alias the moiré differently than direct screen viewing). Will not be caught by per-effect Lighthouse testing. Cannot be detected by automated visual regression unless a baseline is captured at full-stack intensity.

**Prevention:**
- Test grain + halftone together at `--signal-intensity: 0.5` and `1.0` before shipping both effects. This must be a deliberate human visual review step.
- Mitigate by ensuring the halftone dot frequency is at least 2x or 0.5x the grain's characteristic frequency (different enough that the moiré beat frequency is below perceptual threshold).
- If moiré is unavoidable, offset by rotating the halftone pattern 45°, which shifts the moiré out of the most sensitive diagonal axis.
- Apply the halftone at a different z-index layer with a `mix-blend-mode` that is less additive than the grain's `multiply` mode.

**Detection warning signs:**
- Zooming in on the combined effect in a browser reveals a secondary grid or wave pattern.
- The effect looks correct in isolation but "fizzes" or "hums" when both are active.
- Screenshots at 2x pixel density show a different moiré pattern than 1x (a hallmark of aliasing-induced moiré, not perceptual moiré).

**Phase to address:** Halftone implementation phase AND grain baseline raise phase must each include a combined-effect visual review step with the other effect active.

---

### Pitfall 7: VHS Opacity Tokens Hardcoded — Intensity 0 Is Not a Clean State

**What goes wrong:**
`--sf-vhs-crt-opacity: 0.2` and `--sf-vhs-noise-opacity: 0.015` are hardcoded token values. They are not `calc()` expressions of `--signal-intensity`. This means VHS scan lines run at 20% opacity even when `--signal-intensity` is 0. The stated system behavior — "intensity governs the entire aesthetic register" — is violated. Turning the intensity dial to 0 suppresses all new effects (grain, halftone, glitch, particles) but leaves VHS active.

**Consequences:**
Intensity 0 is not a clean state. This is observable in any integration context where CD sets a low initial intensity for component explorer or documentation pages. The VHS "imperfection" aesthetic persists even in lowest-intensity states.

**Prevention:**
Rewrite VHS opacity tokens as CSS `calc()` expressions: `--sf-vhs-crt-opacity: calc(0.2 * var(--signal-intensity))`. This makes the token value proportional to intensity without requiring JavaScript. Apply the same to `--sf-vhs-noise-opacity`. Verify that at intensity 0, both overlays are invisible; at intensity 0.5, they are at their prior baseline; at intensity 1.0, they are at maximum.

**Detection warning signs:**
- Setting `--signal-intensity: 0` in browser DevTools on the SF//UX homepage — VHS scan lines remain visible.
- CD component library pages (which may want minimal intensity) still show VHS texture.

**Phase to address:** VHSOverlay audit/wiring phase. This is a small CSS token change that unlocks correct system-wide behavior.

---

### Pitfall 8: `feTurbulence` Halftone Is CPU-Composited on Many Browser/Hardware Combinations

**What goes wrong:**
The halftone effect uses an SVG `feTurbulence` + `feComponentTransfer` filter pipeline. In Chrome, the GPU filter path is only triggered for elements already in a composited layer (canvas, WebGL, video, 3D CSS transforms). SVG filters applied to regular DOM elements (`<div>`, pseudo-elements) remain on the CPU compositor. Firefox accelerated SVG filter rendering in Firefox 132 (2024), but Chrome's SVG filter path has remained CPU-bound for non-composited sources.

At the `< 2ms` paint time benchmark, halftone is within budget on modern hardware. On a 2019 Intel MacBook Pro or Windows integrated GPU, feTurbulence at full-page coverage can produce 8–15ms paint times — visible scroll jank at 60fps.

**Consequences:**
Scroll jank on mid-range hardware during the halftone phase. Lighthouse Performance on simulated Moto G4 may flag this (Lighthouse simulates a throttled CPU, which stresses CPU-composited effects more than GPU ones). Production Performance score may drop 2–4 points depending on filter area.

**Prevention:**
- Constrain the halftone SVG filter `filterUnits` region to the smallest area required. A full-page `x="0" y="0" width="100%" height="100%"` filter is maximally expensive. If the halftone is used as a section texture rather than a page overlay, scope the filter region to the section height.
- Avoid animating `feTurbulence` attributes (especially `baseFrequency` or `seed`) — each animation frame recomputes the turbulence function across the entire filter region on the CPU.
- Test on a MacBook with integrated graphics (Intel UHD 620 or equivalent) or a mid-range Android device before committing the halftone effect at full-page scale.
- Consider a CSS `background-image: url("data:image/svg+xml,...")` pattern with a pre-rendered static noise texture instead of a live `feTurbulence` computation, where the texture is generated once at build time.

**Detection warning signs:**
- Chrome DevTools Performance panel shows "Update Layer Tree" or "Paint" events > 8ms during scroll.
- "Recalculate Style" events that normally take 0.1ms suddenly take 2–4ms when halftone is active.
- Scroll performance is noticeably worse at `--signal-intensity: 1.0` vs `0.3`.

**Phase to address:** Halftone implementation phase. Test on non-M1 hardware before the phase is marked complete.

---

### Pitfall 9: Copy Fix Breaks `phase-35-metadata.spec.ts` Assertions Silently Without CI

**What goes wrong:**
`phase-35-metadata.spec.ts` lines 35–36 assert:
```
expect(src).toContain("v1.5");
expect(src).toContain("REDESIGN");
```
The copy audit Hard Flag 2 requires fixing `opengraph-image.tsx:64` from `v1.5 -- REDESIGN` to the current version string. When this fix is applied, both assertions fail. With no CI/CD pipeline, the only enforcement is running `phase-35-metadata.spec.ts` explicitly. A developer who applies the copy fix and runs only visual or component tests (not metadata tests) will have a green local run with a broken assertion sitting silently in the test file.

**Why it happens:**
No CI enforces "run all 26 spec files after every commit." Developers run the tests that feel relevant to their change. Copy fixes do not feel like they would break metadata tests. The connection between `opengraph-image.tsx` (a visual template) and `phase-35-metadata.spec.ts` (a metadata validator) is non-obvious.

**Consequences:**
Broken test assertions committed to the repository. The metadata spec becomes misleading — it reports passing state for an old version string. Future developers see a passing test and assume the metadata is correct.

**Prevention:**
- Create a file:line mapping before Phase 1: for every file touched by the copy audit, list which spec files assert against those files' content. This mapping must exist as a checklist before Phase 1 execution begins.
- Apply the copy fix and the spec update in the same commit. Never commit a copy change without simultaneously checking for spec assertions against that content.
- After Phase 1, run all 26 spec files end-to-end, not a subset.

**Detection warning signs:**
- Phase 1 copy changes committed without a corresponding spec file update.
- Running `phase-35-metadata.spec.ts` in isolation after Phase 1 shows failures that weren't present before the phase.

**Phase to address:** Phase 1 (copy audit). The file:line cross-reference must exist before Phase 1 begins, not after.

---

### Pitfall 10: Storybook Stories Visually Change Without Code Changes When Grain Baseline Is Raised

**What goes wrong:**
All 52 existing Storybook stories import `globals.css` via `.storybook/preview.ts`. When `--sf-grain-opacity` is raised from `0.03` to `0.12`, every story renders with 4x more visible grain — a significant visual change — without any story code changing. A developer reviewing stories during the aesthetic tightening phase sees changed visuals and cannot determine whether the change is intentional (the grain raise is working correctly) or an unintentional regression (a different change caused the grain to increase).

Without Chromatic or Playwright screenshot baselines captured before the grain baseline change, there is no automated way to distinguish intentional from unintentional visual changes in stories.

**Consequences:**
The visual regression safety net in Storybook is effectively disabled for aesthetic token changes. The `phase-40-03-storybook.spec.ts` gate only validates that stories compile and that story count `>= 40` — it does not validate visual output. A story can look completely different before and after the aesthetic push while the gate passes.

**Prevention:**
- Capture Playwright screenshots of the full story list at the current grain `0.03` baseline, stored as `.planning/visual-baselines/`, before the grain baseline change. This gives a diff anchor for Phase 1.
- After the grain raise, review all 52 story thumbnails against the baseline images and explicitly approve each visual change.
- Update the Storybook story count gate from `>= 40` to `>= 52` (current count) so story deletions cannot pass silently.
- Copy audit changes to component text (e.g., `SFButton` default label changes) must cross-reference Storybook story default args — the copy audit currently only cross-references page files.

**Detection warning signs:**
- All stories look "dirtier" or "noisier" simultaneously after a CSS token change — this is correct behavior but indistinguishable from a regression without a baseline.
- The `>= 40` story count gate passes but story thumbnails have changed.

**Phase to address:** Before Phase 1 (grain baseline raise). Baseline capture must precede the first grain token change.

---

## Minor Pitfalls

### Pitfall 11: `mix-blend-mode: multiply` Makes Grain Invisible on Light Sections

**What goes wrong:**
Grain overlay uses `mix-blend-mode: multiply`. Multiply blending on a white or near-white surface produces no visible grain (white × any color = white). SF//UX's `data-bg-shift` scroll effect produces white or light sections as the user scrolls. At `--signal-intensity: 0.12`, grain is invisible on these sections while dark sections show grain at full opacity. The grain system fails to provide a consistent substrate texture across all sections.

**Prevention:**
Switch grain overlay to `mix-blend-mode: overlay`, which works on both light and dark backgrounds. Audit bgShift sections before setting 0.12 as the grain baseline to confirm the intended effect is visible on all section backgrounds.

**Phase to address:** Grain baseline raise phase.

---

### Pitfall 12: Particle Field Must Fully Stop RAF Loop Under `prefers-reduced-motion`

**What goes wrong:**
The standard `prefers-reduced-motion` mitigation for animated effects is to slow the animation to near-zero rather than stop it. For a Three.js particle field, "near-zero speed" still runs the `requestAnimationFrame` loop every frame, consuming GPU time and triggering repaints. The correct implementation is to cancel the RAF loop entirely and render a single static frame of particle positions.

The existing WebGL scenes have explicit reduced-motion guards; the particle field spec does not yet document its reduced-motion behavior. This is likely to be omitted in implementation.

**Prevention:**
In the particle field implementation spec, explicitly require: "Under `prefers-reduced-motion: reduce`, cancel the rAF loop via `cancelAnimationFrame()`. Render one static frame at initialization. Register a `matchMedia` listener to restart/stop the loop if the preference changes dynamically."

**Phase to address:** Particle field implementation phase. Include in the acceptance criteria for that phase.

---

### Pitfall 13: `will-change` Abuse Causes Compositor Layer Explosion on Mobile

**What goes wrong:**
`will-change: transform` or `will-change: opacity` applied to multiple layered effect elements simultaneously creates a compositor layer for each element. Each compositor layer consumes additional GPU memory — the texture must be uploaded and stored. On mobile devices, GPU memory is shared with system RAM (typically 1–2GB total on older iPhones). With 8 effect layers simultaneously active and each promoted to a compositor layer, GPU memory pressure can trigger browser crashes on lower-end devices.

The pattern that causes this: a developer adds `will-change: transform` to GrainOverlay, VHSOverlay, HalftoneTexture, and MeshGradient to "improve performance," when those effects are already compositor-thread operations by nature of their CSS properties.

**Prevention:**
- Apply `will-change` only to elements that will actually animate (change in value over time), and remove it after animation ends.
- Effect overlays that are static (grain doesn't animate, scan lines scroll at a fixed pace) should never have `will-change`.
- For the idle escalation GSAP tweens, set `will-change` at tween start and clear it at tween complete:
  ```typescript
  gsap.set(element, { willChange: "opacity" });
  gsap.to(element, { opacity: 1, onComplete: () => gsap.set(element, { willChange: "auto" }) });
  ```

**Phase to address:** Any phase adding effects with animation. Establish this rule before the first effect is implemented.

---

### Pitfall 14: VHS Effect Storybook Stories Clip at Canvas Boundary

**What goes wrong:**
VHSOverlay uses `position: fixed; inset: 0`, which positions the overlay relative to the browser viewport. In Storybook's canvas, fixed-position elements render relative to the canvas element's frame, not the browser viewport. Scan lines appear to clip at story canvas boundaries rather than covering a full simulated screen. The story renders misleadingly — it looks like the effect has a bug, when the effect is correct in production.

**Prevention:**
Add a Storybook decorator for effect overlay stories that wraps the canvas in a `position: relative; overflow: hidden; height: 600px` container. Change `VHSOverlay` from `position: fixed` to `position: absolute` within this decorator context, or create a separate story variant (`VHSOverlay.Contained`) specifically for Storybook demonstration.

**Phase to address:** Effect Storybook story implementation phase. Include in the story template for each fixed-position effect.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|---|---|---|
| Phase 0: Token bridge import | SSR color flash (magenta primary, white background) | Inline critical token overrides; server-render `class="dark"` unconditionally |
| Phase 1: Copy audit | `phase-35-metadata.spec.ts` silent breakage | File:line cross-reference checklist; atomic commit with spec update |
| Phase 1: Copy audit | Storybook story text drift | Cross-reference copy changes against story default args |
| Grain baseline raise | Idle escalation runs in wrong direction | Recalibrate all 4 escalation targets before changing baseline |
| Grain baseline raise | Invisible grain on light bgShift sections | Switch blend mode to `overlay`; audit all section backgrounds |
| Grain baseline raise | All 52 stories visually change silently | Capture Playwright screenshot baselines before the change |
| VHSOverlay wiring | `var()` references in `backdrop-filter` fail on Safari | Use literals; `-webkit-backdrop-filter` prefix required |
| VHSOverlay wiring | VHS runs at full opacity at intensity 0 | Rewrite tokens as `calc(value * var(--signal-intensity))` |
| Halftone implementation | CPU compositing scroll jank on non-M1 hardware | Constrain filter region; test on Intel GPU; avoid animating feTurbulence |
| Halftone + Grain combined | Moiré interference pattern | Combined human visual review at intensity 0.5 and 1.0; adjust frequency gap |
| Particle field | WebGL context limit on iOS Safari | Integrate into singleton renderer; implement context loss handlers |
| Particle field | RAF loop runs under `prefers-reduced-motion` | Cancel RAF loop; render single static frame |
| GSAP idle escalation | CSS transition conflict with tweened properties | Remove CSS transitions from GSAP-owned properties; tween at `:root` level |
| Any effect with animation | `will-change` applied to static overlays | Apply only at tween start; clear at tween complete |
| Combined effects at 1.0 | No combined budget; no automated detection | Manual visual review gate: all 8 effects simultaneously at intensity 1.0 before phase sign-off |
| Storybook effect stories | Fixed-position effects clip at story canvas | Story decorator with `position: relative; overflow: hidden` wrapper |

---

## Confidence Assessment

| Finding | Confidence | Basis |
|---|---|---|
| Safari `backdrop-filter` + `var()` failure | HIGH | MDN browser compat data issue #25914; active bug tracker entries 2024-2025 |
| Safari `backdrop-filter` `-webkit-` prefix required | HIGH | MDN compat data; multiple production reports 2024-2025 |
| WebGL context loss on iOS Safari | HIGH | webkit.org/b/261331; webkit.org/b/262628; confirmed on iOS 17 and 18 |
| GSAP + CSS transition conflict | HIGH | Official GSAP documentation "Common Mistakes" |
| SSR flash of wrong color via RSC streaming | HIGH | Next.js discussions/53063; well-documented next-themes pattern |
| Idle escalation direction failure after baseline raise | HIGH | Directly derived from analyst brief v2 round 3 findings; mathematical certainty |
| Copy audit → metadata spec silent breakage | HIGH | Directly derived from analyst brief v2 round 4; specific line numbers confirmed |
| feTurbulence CPU compositing | MEDIUM | Chrome rendering architecture docs; Firefox recently accelerated but Chrome GPU path requires composited source |
| Grain + halftone moiré | MEDIUM | Physical rendering model; no automated benchmark; requires human visual confirmation |
| Storybook story visual drift from token changes | MEDIUM | Derived from analyst brief; standard Storybook behavior |
| Particle field WebGL singleton requirement | MEDIUM | Three.js/react-three-fiber community; iOS context limit documented but exact number varies by device |
| `will-change` abuse on mobile | MEDIUM | Smashing Magazine rendering docs; GSAP motion library guidance |

---

## Sources

- [GSAP Common Mistakes — Official Documentation](https://gsap.com/resources/mistakes/)
- [MDN: backdrop-filter `var()` CSS variables not supported in Safari 18 — Issue #25914](https://github.com/mdn/browser-compat-data/issues/25914)
- [WebKit Bug 261331: WebGL context lost when backgrounding Safari iOS 17](https://bugs.webkit.org/show_bug.cgi?id=261331)
- [WebKit Bug 262628: WebGL context lost — iOS 17 Safari](https://bugs.webkit.org/show_bug.cgi?id=262628)
- [Next.js Discussion #53063: Implementing dark mode with App Router + RSC](https://github.com/vercel/next.js/discussions/53063)
- [Chrome Rendering Architecture: Image Filters and GPU compositing path conditions](https://www.chromium.org/developers/design-documents/image-filters/)
- [Mozilla dev-platform: Intent to ship WebRender accelerated SVG filter graphs (Firefox 132)](https://groups.google.com/a/mozilla.org/g/dev-platform/c/-M0HVkCWjx0)
- [Smashing Magazine: GPU Animation Doing It Right — compositor layer memory on mobile](https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/)
- [Motion.dev: Web Animation Performance Tier List — `will-change` guidance](https://motion.dev/magazine/web-animation-performance-tier-list)
- [react-three-fiber Discussion #2457: Too many active WebGL contexts on Safari](https://github.com/pmndrs/react-three-fiber/discussions/2457)
- [ANL-analyst-brief-v2.md: Rounds 2, 3, 4, 5, 6 — project-specific risk analysis](file://.planning/ANL-analyst-brief-v2.md)
