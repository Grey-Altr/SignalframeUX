# Technology Stack

**Project:** SignalframeUX v1.7 — Substrate Effects + Token Bridge
**Researched:** 2026-04-11
**Scope:** NEW capabilities only — substrate-intensity effects (grain enhancement, halftone, mesh gradient, VHS/scanline, glitch), token bridge for CD consumer site, viewport polish, visual regression testing
**Confidence:** HIGH for CSS techniques (cross-verified against MDN, Frontend Masters, CSS-Tricks). MEDIUM for Chromatic (current version from npm registry). HIGH for Houdini Paint API exclusion (verified against Can I Use data).

---

## Context: What This Covers

Additive stack document for the v1.7 milestone. Validated v1.6 baseline (DO NOT re-research):
- Next.js 16, TypeScript 5.8, Tailwind CSS v4, GSAP 3.12, Lenis, Three.js
- 54 SF components, OKLCH color space, WebGL singleton renderer
- VHS overlay (CSS pseudo-elements), grain (SVG feTurbulence), idle animation
- tsup library build, Storybook 10, Playwright tests

This document covers only what needs to change or be added.

---

## Recommended Stack Additions

### One New Dev Dependency: Chromatic

| Package | Version | Purpose | Why |
|---------|---------|---------|-----|
| `@chromatic-com/storybook` | `^5.1.1` | Visual regression testing via Storybook 10 addon | First-party Storybook addon, zero-config setup, integrates directly into the existing Storybook 10 instance. Captures per-story screenshots and flags visual diffs on every CI run. Critical for substrate effects — grain, halftone, mesh gradient are pixel-level outputs where diffing catches regressions invisible to unit tests. |
| `chromatic` CLI | `^16.2.0` | CI upload + baseline management | Companion CLI to the addon. Needed for `npx chromatic --project-token=<token>` in CI. Peer to the addon — install both. |

**Install:**
```bash
npm install -D @chromatic-com/storybook chromatic
```

**Configuration:** Zero-config. Run `npx storybook@latest add @chromaui/addon-visual-tests` to wire the addon into `.storybook/main.ts` automatically. A `chromatic.config.json` file is optional — only needed for viewport overrides or multi-browser configuration.

**No other new runtime or dev dependencies are required for this milestone.** All eight aesthetic effects are achievable with existing CSS primitives, SVG filters, and the installed GSAP/Three.js stack.

---

## Substrate Effects: CSS Technique Decisions

### The Central Question: CSS Houdini Paint Worklets vs SVG feTurbulence

**Verdict: SVG feTurbulence wins. Houdini Paint API is excluded.**

CSS Paint API (Houdini) browser support as of April 2026 (verified against Can I Use):
- Chrome/Edge/Opera: Yes (v65+)
- Safari: Disabled by default in all versions. Can be enabled in Develop > Experimental Features — not available for general users.
- Firefox: No support across all versions (v2–v152).
- Global usage: ~76% (Chromium-only)

At the quality bar this project targets (Lighthouse 100/100, WCAG AA, production-grade), a technique absent in Firefox and requiring an opt-in flag in Safari is not viable as a primary implementation path. The polyfill (GoogleChromeLabs/css-paint-polyfill) ships JS to every browser, violating the CSS-first constraint. **Houdini is excluded for all eight effects.**

SVG feTurbulence is implemented in all browsers, requires no JavaScript, and is already used in the codebase for grain. The approach for this milestone is: extend the existing SVG filter pattern, not introduce a new rendering API.

---

### Effect-by-Effect Implementation Decisions

#### Effect 1: Grain (Enhancement of Existing)

The existing `feTurbulence` grain is correct. Enhancement means exposing `--signal-intensity` as a typed `@property` to drive `baseFrequency` and `opacity` in a composited overlay, rather than hardcoding values.

**Technique:**
```css
@property --grain-intensity {
  syntax: '<number>';
  inherits: true;
  initial-value: 0.4;
}
```

SVG filter stays as-is (`feTurbulence type="fractalNoise"`). The `--grain-intensity` property drives the `opacity` of the `::after` pseudo-element carrying the filter. Keep `numOctaves` at 3–4 max — above that the performance cost exceeds the visual gain (verified: Frontend Masters).

**Why `@property` not raw custom property:** A typed `@property` with `syntax: '<number>'` enables CSS `transition` on the value directly, giving GSAP a single numeric handle to tween via `gsap.to(el, { "--grain-intensity": 0.8 })`. Without `@property`, the browser cannot interpolate custom properties — GSAP's CSS plugin handles it via inline style mutation, but transitions won't fire from CSS alone.

Browser support for `@property`: Chrome 85+, Firefox 128+, Safari 16.4+. All modern browsers. Safe to use without fallback.

#### Effect 2: Halftone

**Technique: Pure CSS — radial-gradient + filter: contrast() + background-blend-mode**

No SVG filters required. Three declarations per element:

```css
.sf-halftone {
  /* Layer 1: repeating dot grid */
  background:
    radial-gradient(circle, black 40%, transparent 40%) 0 0 / 6px 6px,
    /* Layer 2: size-variation map (linear or radial gradient) */
    linear-gradient(to bottom, white, black);
  background-blend-mode: multiply;
  filter: contrast(16);
}
```

The `filter: contrast()` at high values (12–20) pushes all pixels to binary black/white, posterizing the blended gradient into discrete dots that vary in apparent size. A contrast value of 2–3× the blur value in pixels works well for smooth edges if chaining `contrast(80) blur(2px) contrast(5)`.

This technique is pure CSS, no SVG, no JS, and is a single GPU compositing pass. Performance is acceptable — the `filter` does trigger an offscreen render, but it is not animated at runtime so it fires once per paint.

**Moiré control:** Use consistent `background-size` across layers and avoid rotating the dot grid unless intentional. Staggered rows (offset by `50% 50%`) reduce moiré risk.

#### Effect 3: Mesh Gradient

**Technique: Multiple `radial-gradient()` layers via CSS `background` shorthand + `mix-blend-mode`**

True CSS mesh gradients (as in Figma's mesh tool) do not exist natively. The closest pure-CSS approximation is layering 4–6 radial gradients at different positions, sizes, and OKLCH colors:

```css
.sf-mesh-gradient {
  background:
    radial-gradient(ellipse 80% 60% at 20% 30%, oklch(0.6 0.2 270 / 0.6), transparent),
    radial-gradient(ellipse 60% 80% at 80% 70%, oklch(0.5 0.25 190 / 0.5), transparent),
    radial-gradient(ellipse 100% 100% at 50% 50%, oklch(0.15 0.05 240), transparent);
  background-blend-mode: screen;
}
```

Each gradient is GPU-rendered by the compositor — no pixel-by-pixel JS computation. This is significantly faster than canvas-based mesh gradient libraries. The alpha channel handles blending.

**OKLCH advantage:** This project already uses OKLCH. Mesh gradient colors defined in OKLCH interpolate perceptually in the `color-interpolation-method: oklch` space (supported in all major browsers as of 2025, ~91% global coverage). Use `in oklch` in the gradient syntax for correct perceptual blending:

```css
background: radial-gradient(in oklch, oklch(0.6 0.2 270), transparent);
```

#### Effect 4: VHS/Scanline (Enhancement of Existing)

The existing VHS overlay uses CSS pseudo-elements. Enhancement means adding a moving phosphor scanline on top of the static line pattern.

**Technique: `::before` for animated scanline + `::after` for static scanline grid (both already in use pattern)**

```css
.sf-vhs::before {
  /* Moving scanline */
  background: linear-gradient(transparent 50%, rgba(0, 0, 0, 0.08) 51%);
  background-size: 100% 4px;
  animation: scanline-sweep 8s linear infinite;
  opacity: var(--vhs-intensity, 0.4);
}

@keyframes scanline-sweep {
  from { transform: translateY(-100%); }
  to   { transform: translateY(100vh); }
}
```

The animation uses `transform: translateY` — composited on the GPU, does not trigger layout or paint. Keep opacity under 0.15 for the static grid (above this the stripes become distracting at the DU aesthetic level).

**`--signal-intensity` tie-in:** Drive `--vhs-intensity` from the parent `--signal-intensity` token using `calc()`:

```css
--vhs-intensity: calc(var(--signal-intensity, 0.4) * 0.7);
```

#### Effect 5: Glitch

**Technique: Pure CSS — `clip-path: inset()` + `@keyframes` + pseudo-elements for chromatic aberration**

No JS, no canvas, no SVG:

```css
.sf-glitch::before,
.sf-glitch::after {
  content: attr(data-text); /* duplicate text via data attribute */
  position: absolute;
  inset: 0;
}

.sf-glitch::before {
  clip-path: inset(20% 0 60% 0);
  animation: glitch-top 3s steps(1) infinite;
  color: oklch(0.7 0.3 200); /* cyan shift */
  mix-blend-mode: screen;
}

.sf-glitch::after {
  clip-path: inset(60% 0 20% 0);
  animation: glitch-bottom 2.7s steps(1) infinite;
  color: oklch(0.7 0.3 350); /* magenta shift */
  mix-blend-mode: screen;
}

@keyframes glitch-top {
  0%, 90%, 100% { clip-path: inset(20% 0 60% 0); transform: translate(0); }
  92% { clip-path: inset(15% 0 65% 0); transform: translate(-3px, 0); }
  95% { clip-path: inset(25% 0 55% 0); transform: translate(3px, 0); }
}
```

`steps(1)` timing function is the correct choice — it creates the discrete, robotic glitch jumps rather than smooth interpolation. `clip-path` is GPU-composited. The `mix-blend-mode: screen` on the color-shifted pseudo-elements produces chromatic aberration without double-rendering the full element.

**Performance note:** `clip-path` on pseudo-elements with `mix-blend-mode` creates new compositing layers. Fine at idle/hover trigger. Do not animate continuously on large full-viewport elements — gate with `animation-play-state` and only activate on `[data-glitch-active]` attribute.

#### Effect 6: Moiré (Bonus/Related to Halftone)

Moiré is a natural consequence of two overlapping repeating patterns at slightly different frequencies. Intentional moiré as an aesthetic effect:

```css
.sf-moire {
  background:
    repeating-linear-gradient(0deg, transparent, transparent 3px, oklch(0.3 0 0 / 0.3) 3px, oklch(0.3 0 0 / 0.3) 4px),
    repeating-linear-gradient(1.5deg, transparent, transparent 3px, oklch(0.3 0 0 / 0.3) 3px, oklch(0.3 0 0 / 0.3) 4px);
}
```

The slight angle difference (0deg vs 1.5deg) between the two `repeating-linear-gradient` layers generates the interference pattern. Adjusting the degree difference controls moiré density. This is pure CSS, one paint pass, no animation overhead.

---

### Stacking Multiple Effects

**Compositing strategy:** Each effect is implemented as a separate pseudo-element layer or wrapper element, not as combined filters on a single element. This avoids the exponential GPU cost of stacked `backdrop-filter` and `filter` properties on the same element.

Structure per component:
```
[data-substrate] container          ← isolation: isolate
  ├── .sf-content                   ← actual content
  ├── .sf-grain-overlay ::after     ← SVG feTurbulence grain
  ├── .sf-scanline-overlay ::before ← VHS scanline animation
  └── .sf-halftone-overlay          ← contrast() + radial-gradient
```

Using `isolation: isolate` on the container confines `mix-blend-mode` blending to within the component's stacking context, preventing bleed-through to parent page elements. This is the same pattern already used in the FRAME/SIGNAL layer separation demo.

**What NOT to stack:** Do not apply `backdrop-filter` to multiple nested elements simultaneously. Each `backdrop-filter` requires a separate offscreen render pass — nesting them doubles memory per level. Instead, apply a single `backdrop-filter` at the topmost overlay layer if blur is needed.

---

## Token Bridge: CSS @layer Cascade Pattern

### Purpose

Consumer sites (cdOS, CD-Operator, CD consumer site) import the SF design system tokens and need to override or extend them without specificity conflicts. The `@layer` cascade provides the mechanism.

### Architecture

The SF system ships tokens in a named layer. Consumer sites declare their override layer after:

```css
/* In SF system CSS (shipped in the library) */
@layer sf.tokens {
  :root {
    --color-background: oklch(0.1 0.02 250);
    --color-foreground: oklch(0.97 0.005 250);
    --color-primary: oklch(0.65 0.22 200);
    --signal-intensity: 0.4;
    /* ... all SF tokens */
  }
}

@layer sf.components {
  /* SF component styles reference @layer sf.tokens values */
}
```

```css
/* In consumer site CSS */
@layer sf.tokens, sf.components, consumer.overrides;

@layer consumer.overrides {
  :root {
    --color-primary: oklch(0.7 0.25 150); /* consumer brand override */
    --signal-intensity: 0.6;              /* higher intensity for this context */
  }
}
```

Layer order in the cascade: later layers win. By declaring `consumer.overrides` after `sf.components`, the consumer layer's specificity is always higher regardless of selector complexity. This eliminates the `!important` arms race.

**Why this pattern:** @layer is fully supported in all modern browsers since 2022 (Chrome 99+, Firefox 97+, Safari 15.4+). It is the browser-native mechanism for design system layering without the runtime overhead of CSS-in-JS theming systems.

### @property for Typed Token Animation

Tokens that need to animate (e.g., `--signal-intensity` driving grain opacity, VHS strength) MUST be registered as typed `@property` declarations:

```css
@property --signal-intensity {
  syntax: '<number>';
  inherits: true;
  initial-value: 0;
}

@property --color-primary {
  syntax: '<color>';
  inherits: true;
  initial-value: oklch(0.65 0.22 200);
}
```

Typed `@property` enables:
1. CSS `transition` and `animation` on custom properties (browser-native, no GSAP required for simple fades)
2. GSAP tween targets (GSAP reads typed properties via `getComputedStyle` and mutates via `style.setProperty`)
3. Type safety — invalid values fall back to `initial-value` rather than silently breaking

Register all animatable tokens this way. Non-animatable tokens (breakpoints, font family names) do not need `@property`.

### No Style Dictionary Needed

For this milestone, the token bridge does not require Style Dictionary or any additional tooling. The `@layer` cascade pattern is sufficient for CSS-to-CSS bridging. Style Dictionary becomes relevant only if tokens need to be output to non-CSS targets (iOS, Android, JSON). This project's consumer sites are web-only. Decision: no new tooling.

---

## Visual Regression Testing: Chromatic Integration

### How It Integrates with Storybook 10

The existing Storybook 10 instance already has stories for SF components. Chromatic reads those stories, captures screenshots, and establishes baselines. No story modifications are needed for the initial setup.

**Setup sequence:**
1. `npm install -D @chromatic-com/storybook chromatic`
2. `npx storybook@latest add @chromaui/addon-visual-tests` — auto-wires the addon into `.storybook/main.ts`
3. Create a Chromatic project at chromatic.com, get project token
4. Add to CI: `npx chromatic --project-token=$CHROMATIC_PROJECT_TOKEN`
5. First run establishes baselines; subsequent runs flag regressions

**Stories needed for substrate effects:** Each effect variant needs a dedicated story at controlled `--signal-intensity` values (0, 0.5, 1.0) to give Chromatic a stable baseline. Animated effects (glitch, VHS scanline sweep) need `chromatic: { pauseAnimationAtEnd: true }` in story parameters to freeze the frame before screenshotting.

```typescript
// Example story parameter for animated effects
export const GlitchActive: Story = {
  parameters: {
    chromatic: { pauseAnimationAtEnd: true },
  },
};
```

### Performance Measurement for Stacked CSS Effects

Chromatic captures rendering correctness, not performance. For performance measurement of stacked CSS effects, use the existing Lighthouse CI pipeline. The key metric is whether stacked substrate effects push the Composite + Paint timeline over budget.

**Measurement approach:** Chrome DevTools Performance panel → record a frame in the substrate-heavy section → inspect the "Rendering" swimlane. Target: Composite + Paint under 4ms per frame at 60fps on a mid-range device (simulated via 4x CPU throttle in DevTools).

If a substrate effect exceeds budget: reduce `numOctaves` on feTurbulence (3 is the safe limit), reduce the number of simultaneously visible layered effects, or gate effect activation with `IntersectionObserver` (same pattern as the existing WebGL scene visibility gate).

---

## What NOT to Add

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| CSS Houdini Paint API (worklets) | Safari disabled by default, Firefox no support (verified Can I Use). ~24% of users cannot see Houdini effects without polyfill JS. The polyfill violates CSS-first constraint. | SVG feTurbulence + CSS filter (existing + extensions) |
| CSS `animation-timeline: scroll()` | Already excluded in v1.5 STACK.md — Firefox support absent as of April 2026 | GSAP ScrollTrigger |
| Canvas-based mesh gradient libraries (e.g., `meshgradient.js`) | Adds a JS runtime dependency for an effect achievable with 5 CSS declarations. Violates CSS-first constraint. Blocks SSR. | Layered `radial-gradient()` in CSS |
| Style Dictionary | Token bridge for this milestone is CSS-to-CSS only. Style Dictionary is needed only for multi-platform token output (iOS, Android). Over-engineering for web-only consumers. | `@layer` cascade + `@property` |
| `playwright-visual-comparisons` | Playwright already installed for E2E tests — adding visual regression to it creates a duplicate testing concern (functional test vs visual diff are different jobs). Chromatic via Storybook is the purpose-built tool for component-level visual regression. | Chromatic + Storybook |
| `motion` / `framer-motion` for substrate animation | Second animation system. All animation already runs through GSAP. `--signal-intensity` animation is handled by GSAP tweening a typed `@property`. | GSAP (existing) + `@property` |
| `backdrop-filter: blur()` on substrate overlays | Each `backdrop-filter` triggers an independent offscreen render pass. Stacking multiple `backdrop-filter` elements causes exponential GPU cost. Substrate effects are overlay-based, not blur-based. | `mix-blend-mode` + `opacity` compositing |
| CSS `filter()` function | Not cross-browser — only Safari shipped it in 2015, no other browser followed. | Apply `filter` to the element, not to individual gradient images |

---

## Bundle Impact

**Zero new runtime JS.** All eight substrate effects are pure CSS (+ SVG filter markup). The `@property` declarations and `@layer` structures are CSS, not JS. GSAP already in the bundle handles any `--signal-intensity` tweening.

| Change | Bundle Impact | Strategy |
|--------|--------------|----------|
| `@chromatic-com/storybook` | Dev-only — zero production bundle impact | `devDependencies` only |
| `chromatic` CLI | Dev-only — CI usage only | `devDependencies` only |
| SVG filter definitions for grain | ~200–400 bytes inline SVG per effect | Inline in component template, not an image request |
| `@property` declarations | Bytes in CSS only — negligible | Add to `globals.css` token block |
| `@layer` cascade structure | Bytes in CSS only — negligible | Restructure existing token block in `globals.css` |

**Projected bundle after v1.7:** No change from v1.6 baseline. Lighthouse 100/100 maintained.

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Grain texture | SVG `feTurbulence` (extend existing) | CSS Houdini Paint API | Safari/Firefox support missing — affects ~24% of users. Polyfill requires JS. |
| Halftone | Pure CSS `radial-gradient` + `filter: contrast()` | SVG halftone filter or canvas | CSS achieves identical effect in 3 declarations. No new rendering context required. |
| Mesh gradient | Layered `radial-gradient()` in CSS | `meshgradient.js`, canvas-based | Library adds JS runtime for what CSS achieves natively. Blocks RSC server render. |
| Glitch animation | `clip-path: inset()` + `@keyframes` | GSAP timeline driving clip-path | Pure CSS is zero JS, fires from CSS class toggle. GSAP adds overhead for an effect that doesn't need JS orchestration. Use GSAP only if glitch needs to be scroll-synced. |
| Token bridge | `@layer` cascade + `@property` | Style Dictionary | Style Dictionary is for multi-platform token output. Web-only consumers need CSS-to-CSS layering only. |
| Visual regression | Chromatic (`@chromatic-com/storybook` 5.1.1) | Playwright visual comparisons | Chromatic is purpose-built for Storybook story-level visual diff. Playwright visual testing at page level has higher false-positive rate for animated components. |

---

## Sources

- Can I Use — CSS Painting API: https://caniuse.com/css-paint-api — Firefox 0%, Safari disabled by default. (HIGH confidence — verified directly)
- MDN — @property: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@property — browser support, syntax (HIGH confidence — official docs)
- MDN — CSS Cascade Layers: https://developer.mozilla.org/en-US/docs/Web/CSS/@layer (HIGH confidence — official docs)
- Frontend Masters — "Pure CSS Halftone Effect in 3 Declarations": https://frontendmasters.com/blog/pure-css-halftone-effect-in-3-declarations/ — `radial-gradient` + `filter: contrast()` technique (HIGH confidence — verified technique)
- Frontend Masters — "Grainy Gradients": https://frontendmasters.com/blog/grainy-gradients/ — feTurbulence + feDisplacementMap, numOctaves 3–4 performance limit (HIGH confidence — verified technique)
- CSS { in Real Life } — "CSS Halftone Patterns": https://css-irl.info/css-halftone-patterns/ — `mask-image` variation technique (MEDIUM confidence — editorial, consistent with MDN gradient spec)
- Josh W. Comeau — "Color Shifting": https://www.joshwcomeau.com/animation/color-shifting/ — OKLCH + @property animation technique (HIGH confidence — author is well-known, consistent with MDN spec)
- Codrops — CSS Glitch Effect: https://tympanus.net/codrops/2017/12/21/css-glitch-effect/ — clip-path + pseudo-element glitch pattern (MEDIUM confidence — older article, technique is stable CSS)
- utilitybend — "Revisiting SVG filters": https://utilitybend.com/blog/revisiting-svg-filters-my-forgotten-powerhouse-for-duotones-noise-and-other-effects/ — feTurbulence remains valid vs CSS alternatives (MEDIUM confidence — editorial)
- npm registry — `@chromatic-com/storybook` version 5.1.1, `chromatic` version 16.2.0 (HIGH confidence — live registry query)
- Chromatic docs: https://www.chromatic.com/docs/quickstart/ — setup, `pauseAnimationAtEnd` story parameter (MEDIUM confidence — official docs)
- Go Make Things — "Public and private CSS cascade layers in a design system": https://gomakethings.com/public-and-private-css-cascade-layers-in-a-design-system/ — @layer design system pattern (MEDIUM confidence — editorial, consistent with spec)

---

*Stack research for: SignalframeUX v1.7 Substrate Effects + Token Bridge milestone*
*Researched: 2026-04-11*
