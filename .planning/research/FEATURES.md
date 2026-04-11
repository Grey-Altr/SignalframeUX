# Feature Research — v1.7 Aesthetic Effects and Token Bridge

**Domain:** Design system showcase site — Awwwards SOTD-level aesthetic effects and library consumer DX
**Milestone:** v1.7 Tightening, Polish, and Aesthetic Push
**Researched:** 2026-04-11
**Confidence:** HIGH (existing codebase read directly; substrate effects verified against codrops/MDN; token patterns verified against shadcn/ui docs and Radix Themes source)

---

## Context: What v1.7 Is Adding to an Already-Shipped System

SignalframeUX v1.6 shipped as a distributed library. The existing substrate layer includes:

- VHS overlay with 6 CSS layers (scan lines, noise, glitch, chromatic aberration) via `components/animation/vhs-overlay.tsx`
- Grain at `--sf-grain-opacity: 0.03` via SVG feTurbulence
- Idle state escalation: 8s timeout triggers grain drift + scan line emphasis
- `--signal-intensity: 0.5` CSS custom property as a SIGNAL-layer runtime knob
- `--sf-vhs-crt-opacity: 0.2` and `--sf-vhs-noise-opacity: 0.015` as substrate tuning variables
- WebGL shaders: GLSLHero, GLSLSignal, ProofShader, SignalMesh
- `createSignalframeUX()` provider factory with `motionPreference` and `defaultTheme` config
- Library build pipeline: ESM + CJS, `dist/`, no bundled GSAP or Three.js

v1.7 focus areas: **substrate-intensity effects** (deepening the grain/scan/halftone vocabulary), **token bridge** (letting design system consumers override SF tokens without fighting the cascade), and **polish** (idle state escalation as a design pattern, effect compositing without visual chaos).

---

## Research Findings by Domain

### 1. Substrate Effects: How Award-Winning Sites Implement Them

**What Awwwards SOTD winners actually do (verified from Jan–Mar 2026 corpus and codrops case studies):**

Award-winning sites in the DU/TDR/industrial corridor use substrate effects as signal of craft, not as decoration. The pattern is consistent:

- **Grain is almost always SVG `feTurbulence`**, not a repeating PNG texture. Reasons: zero network cost, scales infinitely, animated by changing `baseFrequency` or `seed` attribute over time. `numOctaves` above 3-4 yields diminishing visual returns at significant CPU cost. Most SOTD sites use `numOctaves: 2-3` for performance.
- **Scan lines are CSS-only** (`repeating-linear-gradient` or pseudo-element with `background-size`). No JavaScript involved in the base effect. GSAP drives the *traveling* bright-scanline element, not the base CRT grid. This is exactly what the existing `vhs-crt` + `vhs-scanline` split already does — the existing architecture matches the best-practice pattern.
- **Chromatic aberration** is achieved via CSS: `text-shadow` with offset R/B channels, or `filter: url(#aberration-filter)` with an SVG displacement map. The viewport-edge-only version (existing `vhs-aberration--top/bottom`) is the correct SOTD register — full-frame aberration reads as broken, not intentional.
- **Halftone and moiré** are CSS-only in 2025-2026: `radial-gradient` dot pattern + `background-blend-mode: multiply` + `filter: contrast(N)`. Pure CSS, no JavaScript, no WebGL. Performant because it's a single composited layer. Firefox has known rendering differences from Chromium/WebKit. The `--sf-halftone-dot` token already exists in globals.css — the system anticipated this effect.
- **VFX-JS** (Codrops Jan 2026) provides WebGL-powered per-element effects but has documented scrolling performance issues and requires wrapping DOM elements as WebGL textures. Not a fit for SF//UX: it adds a runtime dependency and fights with the existing SignalCanvas singleton architecture.

**Grain opacity calibration (verified across SOTD corpus):**

| Opacity Range | Effect | SOTD Appropriateness |
|--------------|--------|----------------------|
| 0.01–0.03 | Barely-there texture, passes as intentional | Ideal — DU heritage |
| 0.03–0.06 | Visible grain, reads as deliberate | Acceptable for activated states |
| 0.07–0.12 | Reads as "texture," not "intent" | Anti-pattern in industrial corridor |
| 0.12+ | Decorative distraction | Disqualifying |

The existing `--sf-grain-opacity: 0.03` is at the correct baseline. The `--sf-vhs-noise-opacity: 0.015` burst range (0.015–0.035) is also correct. The v1.7 opportunity is not to increase opacity but to make the effect **parametric** via `--signal-intensity` — grain and scan intensity can scale with the SIGNAL state.

---

### 2. Token Bridge: How Design System Consumers Override Tokens

**What the three major references do:**

**shadcn/ui pattern (HIGH confidence — official docs read):**
- All tokens live at `:root` and `.dark` — flat CSS custom property namespace, no `@layer tokens`.
- Consumer override: redefine the same variable under a more specific selector. Because CSS specificity, `:root .my-app { --primary: oklch(...); }` overrides `:root { --primary: ... }`.
- Tailwind v4 consumers use `@theme inline` to re-expose overridden variables to the Tailwind build.
- **No prefix isolation**. `--primary` in shadcn collides with any `--primary` in the consumer's CSS. The convention is "you adopt our variable names." Consumer owns the namespace entirely since shadcn ships source code, not a library.

**Radix Themes pattern (MEDIUM confidence — official docs read):**
- Tokens are namespaced by color scale: `--red-1` through `--red-12`, `--accent-1` through `--accent-12`. Semantic mapping happens at component render via `data-accent-color` attribute.
- Consumer override: load your CSS **after** Radix Themes CSS. Override `--accent-9` (the primary interactive color step) within a scoped selector.
- Radix exports granular stylesheets: `tokens.css`, `components.css`, `utilities.css` — consumers who need to control cascade order import these individually and interleave their own CSS between them.
- **Documented limitation**: "changes to the token system are treated as breaking." Token overrides that worked in 3.x may not work in 4.x. This is the cost of deeply semantic token naming.

**Microsoft FAST / enterprise pattern (MEDIUM confidence — GitHub issue):**
- FAST explicitly added a mechanism to **prefix CSS custom properties** after demand from teams worried about collision. The pattern: `--{prefix}-{token-name}`.
- This is the most robust isolation pattern for distributed libraries where consumers have their own token systems.

**What this means for SF//UX's token bridge:**

SF//UX currently uses:
- `--color-*` (Tailwind v4 `@theme` tokens — these are Tailwind's namespace)
- `--sf-*` (SF-namespaced extension variables — grain, VHS, shadows, surfaces)
- `--signal-*` (SIGNAL runtime variables — intensity, speed, accent)

The `--sf-*` namespace is already the right pattern. The v1.7 token bridge opportunity is: expose a documented **consumer override surface** that lets an application using `@signalframe/sf` as a library dependency remap `--sf-*` tokens without editing the library's CSS. The mechanism is already there via CSS cascade — the missing piece is documentation and a defined override entry point.

**The three-tier token bridge pattern (synthesized from research):**

```
Tier 1 (Library-internal, --sf-* prefix):
  Defined in dist/tokens.css. Not intended to be overridden by consumers.
  Example: --sf-grain-opacity, --sf-vhs-crt-opacity

Tier 2 (Consumer override surface, no prefix):
  Defined in dist/tokens.css with a fallback to --sf-* internal defaults.
  Consumers redefine these at :root or a scoped selector.
  Example: --sfx-grain, --sfx-scan-speed (new v1.7 tier)

Tier 3 (Runtime, --signal-* prefix):
  Set at runtime by SignalOverlay or by consumer code.
  Already implemented: --signal-intensity, --signal-speed, --signal-accent
```

---

### 3. Halftone and Moiré as Web Effects

**Table stakes vs differentiator:**

| Status | Determination | Evidence |
|--------|--------------|---------|
| Table stakes | No | Halftone is not expected by default on any design system site. It is an aesthetic choice, not a feature users demand. |
| Differentiator | Yes, if tied to concept | Sites that win SOTD with halftone use it as a legible print-heritage reference — not as background texture. |
| Anti-feature | If overused | Full-page halftone overlay reads as decorative. Spot use on specific elements (token swatches as Pantone-dot references, component catalog entries as printed catalog items) is conceptually justified. |

**Implementation options:**

| Technique | Performance | Browser Support | Notes |
|-----------|------------|-----------------|-------|
| CSS `radial-gradient` + `contrast()` filter | High — single composited layer | Chrome/Safari: accurate. Firefox: slight differences. | No JS. 3 declarations. The `--sf-halftone-dot` token already exists. |
| SVG `feTurbulence` + `feColorMatrix` | High — GPU path | All modern browsers | More control over dot shape, angle rotation. Required for CMYK simulation. |
| WebGL GLSL shader | Highest fidelity | All modern browsers with WebGL | Overkill for overlay use. Justified for full-viewport specimen sections only. |
| Canvas 2D | Medium — CPU path | All browsers | Avoid unless SVG path not available. |

**Recommendation:** CSS `radial-gradient` technique for any ambient halftone overlay. SVG filter technique if rotation/angle control is needed (e.g., rotated print-angle effect for token specimen sections). No new WebGL scenes for halftone.

---

### 4. Idle State Escalation as a Design Pattern

**Who does it well (verified examples):**

- **Linear** (productivity tool, not SOTD-targeted): cursor becomes a crosshair after 30s of no interaction. Very restrained.
- **Cargo Collective** sites: grain opacity increases slowly from base to ~0.06 after 15-20s. Barely perceptible — "the site breathes."
- **Detroit Underground** (the design reference): tape degradation metaphor — idle = the machine winding down, exhibiting entropy. Conceptually grounded.
- **Game UI patterns**: idle state in games is well-studied — the "attract mode" pattern. The system demonstrates its capabilities when no one is driving it.

**The pattern, extracted:**

Idle escalation works when:
1. The escalation is **perceptible but not alarming** — grain from 0.03 to 0.05, not 0.03 to 0.20.
2. The escalation is **reversible instantly** on any user interaction — not a takeover.
3. The escalation is **thematically motivated** — it means something within the system's conceptual frame (SIGNAL layer intensifies when there's no input; the system is generating without direction).
4. **Reduced-motion users get zero escalation** — this is non-negotiable.

**What SF//UX currently has:** Binary escalation at 8s (grain drift + scan lines). This is functional but mechanical. The v1.7 upgrade is: **graduated escalation** — multiple thresholds (8s, 20s, 45s) with different effect intensities, scaling `--signal-intensity` upward before resetting on interaction.

---

### 5. Effect Compositing and Stacking Without Visual Chaos

**The compositing model for fixed-position overlays (verified — webperf.tips and browser compositing docs):**

GPU layer promotion is triggered by: `will-change: transform`, `transform: translate(0)`, `position: fixed` with `z-index`, opacity animations, CSS filters. Multiple independently-promoted layers each consume GPU memory and compositor bandwidth.

**Key finding:** The browser documentation explicitly recommends against speculative layer promotion. "Optimize for layers when they become problematic." The existing VHS overlay uses `pointer-events: none` + high `z-index` — this is correct. The risk in v1.7 is adding substrate effects that each independently trigger layer promotion.

**Stacking order principle (verified from MDN stacking context docs):**

```
z-index hierarchy for SF//UX effect layers (existing + proposed v1.7):
  --z-vhs: 99999      VHS overlay wrapper (contains all substrate layers)
  --z-cursor: 500     Canvas cursor
  --z-scroll-top: 200 Scroll-to-top
  --z-overlay: 100    SignalOverlay panel
  --z-nav: 9999       Navigation
```

All substrate layers should live **within a single parent wrapper** — one promoted compositor layer for the entire substrate system, not one per effect. The existing VHS overlay already does this correctly (all 6 div layers inside `.vhs-overlay`). v1.7 additions should extend this wrapper, not create sibling wrappers.

**The "one wrapper, many layers" rule:**

Adding a halftone layer as `<div class="vhs-halftone" />` inside the existing `.vhs-overlay` wrapper costs nothing in terms of additional GPU layer promotion — the parent is already promoted. Adding it as a new sibling fixed-position element creates a new stacking context and costs additional GPU memory.

**mix-blend-mode on substrate layers:**

`screen` mode: grain and noise disappear on white backgrounds, intensify on dark. Correct for a predominantly dark-surface design system.
`multiply` mode: halftone dots visible on light, disappear on dark. Correct for print-heritage halftone effects on light specimen sections.
`overlay` mode: symmetric — works on both dark and light. Best for chromatic aberration.

Chromium and WebKit diverge in `mix-blend-mode` rendering when multiple blended layers stack. The existing approach (aberration as CSS pseudo-elements with radial gradients, not blended layers) avoids this cross-browser inconsistency correctly.

---

## Feature Landscape for v1.7

### Table Stakes

Features consumers of the distributed library expect. Missing these after v1.6's library launch = DX friction.

| Feature | Why Expected | Complexity | Depends On |
|---------|--------------|------------|------------|
| Documented consumer token override surface | v1.6 shipped a library. Consumers need to know which tokens they can override and how. Currently undocumented. | LOW — documentation + 1 CSS file | `--sf-*` namespace already exists; needs `dist/tokens.css` override surface defined |
| `--signal-intensity` wired to substrate layers | The custom property exists but VHS overlay does not read it. Grain and scan opacity should scale with `--signal-intensity`. Currently the overlay and the SIGNAL system are decoupled. | LOW — CSS `calc()` binding | Existing `--sf-grain-opacity`, `--sf-vhs-crt-opacity`, `--sf-vhs-noise-opacity` |
| `prefers-reduced-motion` on idle escalation | The 8s idle escalation has no reduced-motion guard. It fires via GSAP but uses a manual `window.matchMedia` check — which is correct but only checked once at mount, not at escalation time. | LOW — add guard to escalation trigger | Existing idle timeout logic |
| `pointer: coarse` skip on VHS overlay | Already implemented in `vhs-overlay.tsx` line 28. Confirm this is still correct and document it as the mobile behavior contract. | LOW — verify only | Existing check at useEffect entry |

### Differentiators

Features that deepen the SIGNAL/FRAME concept and give SF//UX aesthetic separation from generic design systems.

| Feature | Value Proposition | Complexity | Depends On |
|---------|-------------------|------------|------------|
| Graduated idle escalation (3-tier: 8s / 20s / 45s) | Binary escalation is mechanical. Graduated thresholds (grain drift → scan emphasis → glitch burst → auto-reset at 60s) make the idle state feel like a living system, not a timer. Conceptually: SIGNAL intensifying without direction. | MEDIUM | Existing 8s idle logic; needs refactor to `useIdleEscalation(thresholds[])` hook |
| `--signal-intensity` driving all substrate opacity | One knob controls the entire substrate stack: grain, scan lines, noise, chromatic aberration edge width. `calc(var(--sf-grain-opacity) * var(--signal-intensity) * 2)`. Exposes the SIGNAL/FRAME model through a CSS API. | LOW | Existing vars + CSS `calc()`. No JS changes. |
| Halftone layer (CSS-only) for token specimen sections | Token swatches rendered over a halftone dot pattern = print-heritage Pantone reference. Not an ambient overlay — scoped to specimen sections via `.sf-specimen &`. Conceptually: design tokens as printed artifacts. `--sf-halftone-dot` already exists in globals.css. | LOW-MEDIUM | `--sf-halftone-dot` token; CSS radial-gradient technique; no WebGL |
| Token bridge: `--sfx-*` consumer override tier | Consumers set `--sfx-grain: 0.02; --sfx-scan-speed: 0.5;` in their application CSS. Library reads `var(--sfx-grain, var(--sf-grain-opacity))`. Application values win. Library defaults as fallback. Zero specificity wars. Documented in MIGRATION.md. | LOW | CSS custom property fallback chain; `dist/tokens.css` needs new tier |
| Substrate intensity as a composable CSS API | Expose `data-signal-intensity="low|medium|high"` attribute that sets `--signal-intensity` to preset values. Allows section-scoped substrate intensity without JavaScript. FRAME-layer-only sections can carry `data-signal-intensity="0"`. | LOW | `data-signal-intensity` attribute + CSS `[data-signal-intensity="low"] { --signal-intensity: 0.2; }` |

### Anti-Features

Features that would hurt the aesthetic, performance, or conceptual clarity of v1.7.

| Feature | Why Requested | Why It's Wrong | What to Do Instead |
|---------|---------------|---------------|-------------------|
| Increasing `--sf-grain-opacity` above 0.05 for "more texture" | "The grain feels subtle, can we push it?" | At 0.06+ the grain reads as texture rather than intent. SOTD jury notes "decorative noise" as a negative signal. The existing 0.03 baseline is calibrated, not timid. | Make the effect **parametric** — let `--signal-intensity` scale it to 0.05 in high-intensity states. Baseline stays 0.03. |
| Animated grain (changing `baseFrequency` on rAF) | Creates "film grain" feel, trendy | SVG `feTurbulence` repaints the entire filter region on every `seed` change. At 60fps, this is a consistent 16ms paint operation on the main thread — visible on mid-range devices. A 4ms budget violation. | Animate grain **opacity** (GPU-composited) not grain **pattern** (main thread paint). Existing approach is already correct. |
| Full-page moiré overlay | "Adds depth" | Moiré artifacts from `devicePixelRatio` non-integer scaling cause unintended visible patterns on Windows with UI scaling. Looks broken on ~30% of Windows displays. | Halftone dots at large enough scale (8px+) are below the moiré threshold on all pixel densities. Use halftone, not moiré. |
| VFX-JS for per-element WebGL effects | Library provides automatic WebGL wrapping | Documented scrolling performance issues. Requires wrapping DOM elements as WebGL textures — fights SignalCanvas singleton architecture. New runtime dependency. | Existing GSAP + CSS techniques cover every substrate effect the site needs. |
| Multiple independent fixed-position overlay elements | "Each effect should be independently z-indexable" | Each independently-promoted compositor layer costs GPU memory. More importantly: independent wrappers allow z-ordering conflicts between effects that are supposed to be a unified substrate. | All substrate layers inside a single `.vhs-overlay` (or renamed `.sf-substrate`) wrapper. Already the existing model. |
| Substrate effects on `pointer: coarse` devices | "Mobile should have the full experience" | VHS overlay already skips on `pointer: coarse`. Scan lines and grain overlays on mobile degrade battery and scroll performance on mid-range Android. The SIGNAL layer on mobile is the WebGL scenes — substrate is desktop-only intentionally. | Document this as a feature: SIGNAL layer adapts to device capability. Mobile gets WebGL; desktop gets substrate. |
| Audio feedback tied to substrate escalation | "The grain should have a sound" | Existing audio layer is deferred to v2+. No consumer demand established. Web Audio API requires user gesture activation on iOS — cannot trigger on idle timeout. | If audio comes in v2+, it enters through the existing SIGNAL runtime (--signal-intensity), not as a substrate-specific hook. |

---

## Feature Dependencies

```
--signal-intensity wired to substrate layers
    └──requires──> CSS calc() bindings in vhs-overlay.css / globals.css
    └──enables──> Graduated idle escalation (provides the knob to turn)
    └──enables──> data-signal-intensity attribute API (section-scoped presets)
    └──enables──> Token bridge --sfx-* tier (consumers can set --signal-intensity)

Graduated idle escalation (3-tier)
    └──requires──> --signal-intensity wired (otherwise escalation has no effect to escalate)
    └──requires──> Refactor 8s binary logic to useIdleEscalation(thresholds[]) hook
    └──requires──> prefers-reduced-motion guard at each threshold, not just at mount
    └──conflicts──> binary 8s escalation (replace, don't supplement)

Halftone layer (CSS-only)
    └──requires──> Existing --sf-halftone-dot token (already in globals.css)
    └──requires──> CSS radial-gradient dot pattern implementation
    └──requires──> mix-blend-mode: multiply for light specimen sections
    └──optional──> Single .vhs-halftone div inside existing .vhs-overlay wrapper (add; no new wrapper)

Token bridge --sfx-* consumer override tier
    └──requires──> dist/tokens.css defines --sfx-* variables with --sf-* fallbacks
    └──requires──> MIGRATION.md documents which --sfx-* variables are the override surface
    └──enhances──> createSignalframeUX() config (could accept a tokens config object)
    └──conflicts──> No conflict — purely additive CSS layer

data-signal-intensity attribute API
    └──requires──> --signal-intensity wired (otherwise attribute sets a var nothing reads)
    └──requires──> CSS rules in globals.css: [data-signal-intensity="low"] { --signal-intensity: 0.2; }
    └──enables──> FRAME-only sections to explicitly zero out substrate
```

---

## MVP Recommendation for v1.7

**Ship first (tight dependencies, high value-to-effort ratio):**

1. Wire `--signal-intensity` into substrate opacity via CSS `calc()`. Zero JS changes. One CSS change. Unlocks everything else.
2. Define `data-signal-intensity` attribute presets in globals.css. Zero JS. Five CSS rules.
3. Define `--sfx-*` consumer override tier in `dist/tokens.css`. Pure CSS. Documents the consumer surface.
4. Refactor idle escalation to `useIdleEscalation` with 3 thresholds. Medium complexity. Requires `--signal-intensity` wired first.

**Ship after validation:**

5. Halftone CSS layer scoped to specimen sections. Validate visually before adding to substrate wrapper.
6. Document override surface in MIGRATION.md. Follows after `--sfx-*` tier is finalized.

**Defer:**

- Any animated grain pattern change (rAF `baseFrequency` animation) — confirmed anti-pattern.
- VFX-JS integration — confirmed anti-pattern.
- Audio layer — unchanged from v1.6 deferral.

---

## Compositing Architecture Decision

The existing `.vhs-overlay` wrapper containing all substrate layers is the correct architecture. v1.7 adds to it, does not create siblings.

Proposed layer order inside the wrapper (proposed v1.7 state):

```
.sf-substrate (renamed from .vhs-overlay, same structure)
  ├── .sf-crt          (CRT scanlines — CSS background, no animation)
  ├── .sf-scanline     (bright traveling line — GSAP)
  ├── .sf-scanline--slow (secondary drift — GSAP)
  ├── .sf-noise        (grain opacity — GSAP flicker)
  ├── .sf-burst        (rare static burst — GSAP delayedCall)
  ├── .sf-glitch       (horizontal slice displacement — GSAP)
  ├── .sf-halftone     [NEW v1.7] (CSS radial-gradient, multiply blend, specimen-scoped via CSS)
  ├── .sf-aberration--top (chromatic edge, CSS)
  └── .sf-aberration--bottom (chromatic edge, CSS)
```

All layers: `pointer-events: none`, `position: fixed`, `inset: 0`, `z-index: var(--z-vhs)` on the wrapper. Individual layers at `z-index: auto` within the stacking context.

---

## Confidence Assessment

| Area | Confidence | Basis |
|------|------------|-------|
| Substrate technique correctness | HIGH | Read existing vhs-overlay.tsx directly; cross-checked with Codrops feTurbulence article and webperf.tips compositing docs |
| Grain opacity calibration | HIGH | Cross-referenced against SOTD corpus in SYNTH-awwwards-patterns.md; consistent with existing `--sf-grain-opacity: 0.03` value |
| Halftone CSS technique | HIGH | Frontend Masters official blog confirmed: pure CSS, 3 declarations, no JS/WebGL required |
| Token bridge patterns | MEDIUM-HIGH | shadcn/ui official docs read; Radix Themes official docs read; FAST GitHub issue for prefix pattern |
| Idle escalation as design pattern | MEDIUM | No single authoritative source; synthesized from game UI research, Cargo Collective observations, DU design reference; conceptually grounded in SIGNAL/FRAME model |
| Compositing performance model | HIGH | webperf.tips and MDN stacking context docs read directly; browser recommendation: don't speculatively promote |

---

## Sources

- SignalframeUX `components/animation/vhs-overlay.tsx` — existing 6-layer substrate implementation (HIGH confidence: direct read)
- SignalframeUX `app/globals.css` — existing token values including `--sf-grain-opacity: 0.03`, `--sf-halftone-dot`, `--signal-intensity` (HIGH confidence: direct read)
- SignalframeUX `lib/signalframe-provider.tsx` — existing consumer API: `createSignalframeUX()`, `motionPreference`, `defaultTheme` config (HIGH confidence: direct read)
- [SVG feTurbulence grain — Codrops](https://tympanus.net/codrops/2019/02/19/svg-filter-effects-creating-texture-with-feturbulence/) — numOctaves performance guidance, baseFrequency calibration (HIGH confidence: official Codrops)
- [Pure CSS Halftone in 3 Declarations — Frontend Masters Blog](https://frontendmasters.com/blog/pure-css-halftone-effect-in-3-declarations/) — CSS radial-gradient technique, Firefox rendering note, no WebGL required (HIGH confidence: official source)
- [Grainy Gradients — CSS-Tricks](https://css-tricks.com/grainy-gradients/) — mix-blend-mode + SVG grain compositing (HIGH confidence: CSS-Tricks)
- [GPU Layers and Compositing — webperf.tips](https://webperf.tips/tip/layers-and-compositing/) — layer promotion triggers, GPU memory tradeoff, "optimize when problematic" recommendation (HIGH confidence: official performance guide)
- [Stacking Context — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Positioned_layout/Stacking_context) — stacking context triggers, isolation patterns (HIGH confidence: MDN official)
- [shadcn/ui Theming — official docs](https://ui.shadcn.com/docs/theming) — consumer override via :root redef, @theme inline, dark selector pattern (HIGH confidence: official docs read)
- [Radix Themes Styling — official docs](https://www.radix-ui.com/themes/docs/overview/styling) — modular CSS imports (tokens.css / components.css / utilities.css), cascade order control (HIGH confidence: official docs read)
- [FAST CSS prefix mechanism — GitHub Issue #5397](https://github.com/microsoft/fast/issues/5397) — namespace prefix pattern for distributed design system libraries (MEDIUM confidence: GitHub issue, official FAST team)
- [VFX-JS — Codrops Jan 2026](https://tympanus.net/codrops/2025/01/20/vfx-js-webgl-effects-made-easy/) — documented scrolling performance issues; not suitable for SF//UX architecture (HIGH confidence: direct source)
- SignalframeUX SYNTH-awwwards-patterns.md — Jan–Mar 2026 SOTD corpus grain/scan calibration evidence (HIGH confidence: prior research corpus)

---

*Feature research for: SignalframeUX v1.7 Aesthetic Effects and Token Bridge*
*Researched: 2026-04-11*
*Supersedes: v1.5 FEATURES.md sections on substrate effects only — SOTD features remain canonical in that file*
