# SignalframeUX — AI Tool Ingestion Manifest

> **Purpose.** Single-document design-system contract for AI tools (Claude Design, Figma Make, v0, Stitch, custom skills). Distilled from `CLAUDE.md`, `SIGNALFRAMEUX_REFERENCE.md`, `app/globals.css`, and `components/sf/`. Paste this into any AI design tool as grounding context before generating SignalframeUX artifacts.
>
> **Read order.** Identity → Philosophy → Hard Constraints → Tokens → Components → Aesthetic Register → Do-Nots → Usage Rules. Every section is decision-bearing. Do not skim.

---

## 1. Identity

**SignalframeUX** is a high-performance design system for **Culture Division**, a design studio operating at the intersection of electronic music culture, critical design, and product engineering. SignalframeUX powers the Culture Division portfolio, internal tooling (cdOS), and downstream studio work (CD-Operator).

- **Current version:** v0.1 (stabilization + sanctioned SIGNAL-layer growth — see §4.10–§4.12)
- **Aesthetic lineage:** Detroit Underground (DU) + The Designers Republic (TDR), with adjacent influences from Ryoji Ikeda, Autechre, Neville Brody / Fuse, and Rick Owens.
- **Register:** Sharp, controlled, structured, slightly tense. Sophisticated, not sterile. Not friendly, not playful, not cozy.
- **Quality bar:** Awwwards SOTD execution within Culture Division's aesthetic.

---

## 2. Design Philosophy — FRAME / SIGNAL Dual Layer

**FRAME** — the deterministic, legible, semantic, consistent structural layer. Typography, spacing, grid, hierarchy, semantic colors, borders. Must remain readable in all contexts.

**SIGNAL** — the generative, parametric, animated, data-driven expressive layer. Motion, noise, fields, seeded variations, `--sfx-signal-intensity`, VHS/CRT overlays, grain.

**Rule:** The signal runs through the frame. FRAME must remain readable. SIGNAL must not interfere with usability. Order of precedence is always SIGNAL/FRAME when naming or discussing the two — never FRAME/SIGNAL.

**Style:** Enhanced Flat Design. Depth comes from spacing, hierarchy, layout, contrast, and motion — never from skeuomorphism, shadows, or gradients.

---

## 3. Hard Constraints (non-negotiable)

AI tools generating SF output MUST respect these. Violations count as drift.

| Constraint | Rule |
|---|---|
| **Border radius** | Zero everywhere. All `--sfx-radius-*` tokens resolve to `0px`. No exceptions. |
| **Gradients** | No **decorative** gradients (blur-to-color, aurora, glassmorphic, rainbow, color-shift ornamentation, generic "mesh"). Permitted **structural** uses: hard-stop bars for typographic strikes, edge-vignette `mask-image` for scroll clipping, `repeating-linear-gradient` scanlines in the SIGNAL-layer overlay, halftone/grid hard-stop patterns. No soft color transitions anywhere. |
| **Shadows** | None decorative. Allowed only as micro-feedback (press/hover) or as `--sfx-deboss-*` tactile tokens. |
| **Rounded corners** | None. See Border radius. |
| **Skeuomorphism** | None. No textures imitating real materials. |
| **Generic dark-mode** | Forbidden. No "default black + neon accent" aesthetic. Must borrow directly from DU/TDR visual language. |
| **Arbitrary spacing** | Forbidden. Use only blessed stops (see §4.2). |
| **Palette expansion** | Forbidden. Work within core 5 + extended. Do not introduce new hues. |
| **Color space** | OKLCH only. Never hex except in prose documentation and two sanctioned escape hatches: (a) Edge-runtime files rendered by Satori / Next.js `icon`/`opengraph-image` / global error pages, where CSS custom properties cannot resolve — values must be sourced from a compile-time constant map derived from the OKLCH token definitions (see `lib/tokens.edge.ts` pattern); (b) Canvas 2D / WebGL fallback where `getComputedStyle()` cannot read the token at init — a single hex literal matching the default theme hue is permitted as last resort. Free-authored hex remains forbidden. |
| **New GSAP effects** | Forbidden in v0.1. Normalize existing usage, do not expand. |
| **New SF components** | Forbidden in v0.1 unless in stabilization scope (container/section/stack/grid/text primitives). |
| **Spring / bouncy easings** | Forbidden. Canonical easing is `cubic-bezier(0, 0, 0.2, 1)` (ease-out). No overshoot, no anticipation, no bounce. See §4.5 for rejected curves. |
| **System-level inventions** | Forbidden in generated output. Do not invent subsystems (elevation ladders, posture systems, new parametric axes, new utility classes). If an addition seems warranted, emit it as a proposal note at the end of the artifact — do not merge it into the primary output. **Sanctioned SIGNAL-layer subsystems** — Effects Pipeline (§4.10), Canvas Frame (§4.11), Keyframe Library (§4.12) — are in-scope and may be referenced. They are the complete sanctioned set; inventions beyond them still require the proposal workflow. |

---

## 4. Tokens

All tokens are CSS custom properties defined in `app/globals.css`. Source of truth. Two layers:
- `--sfx-*` — raw token values (the source)
- `--color-*`, `--text-*`, `--font-*`, etc. — Tailwind `@theme` aliases that reference `--sfx-*` (compile-time names, do not rename)

### 4.1 Colors (OKLCH, tiered)

**Theme hue is dynamic.** `--sfx-theme-hue: 350` (magenta) is the default. It is replaced at scaffolding time for downstream Culture Division products. Colors are constructed from the hue where possible, so the entire system rethemes by changing one value.

#### Core 5 (all new components MUST work with these)

| Token | Light mode | Dark mode | Purpose |
|---|---|---|---|
| `--color-background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` | Page background |
| `--color-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | Body text |
| `--color-primary` | `oklch(0.65 0.3 var(--sfx-theme-hue))` | same | Accent / CTA / brand |
| `--color-secondary` | `oklch(0.970 0.005 calc(hue+180))` | `oklch(0.269 0 0)` | Neutral-cool surface |
| `--color-accent` | `oklch(0.930 0.005 calc(hue+180))` | `oklch(0.269 0 0)` | Hover states, subtle emphasis |

#### Extended (component-specific use only)

| Token | Value (OKLCH) | Purpose |
|---|---|---|
| `--color-muted` | `oklch(0.930 0.005 calc(hue+180))` / dark `oklch(0.269 0 0)` | De-emphasized surface |
| `--color-card` | `oklch(1 0 0)` / dark `oklch(0.205 0 0)` | Card surface |
| `--color-popover` | `oklch(1 0 0)` / dark `oklch(0.205 0 0)` | Popover surface |
| `--color-destructive` | `oklch(0.550 0.180 25)` | Error / destructive action |
| `--color-success` | `oklch(0.85 0.25 145)` | SF green — success states |
| `--color-warning` | `oklch(0.91 0.18 98)` | SF yellow — caution states |
| `--color-border` | dark `oklch(0.400 0 0)` | Borders, dividers |
| `--color-ring` | `oklch(0.65 0.3 var(--sfx-theme-hue))` | Focus rings |

**Chart tokens** (`--sfx-chart-1..5`) are derived from primary + warning + success + neutral — do not introduce new chart colors.

### 4.2 Spacing (blessed stops)

Fluid-scaled from a 1280px canvas using `clamp()` and `--sf-vw`. Target values at 1440px viewport:

| Token | Scaled | Fixed target |
|---|---|---|
| `--sfx-space-1` | `clamp(2px, 0.278*vw, 6px)` | **4px** |
| `--sfx-space-2` | `clamp(4px, 0.556*vw, 12px)` | **8px** |
| `--sfx-space-3` | `clamp(8px, 0.833*vw, 16px)` | **12px** |
| `--sfx-space-4` | `clamp(12px, 1.111*vw, 24px)` | **16px** |
| `--sfx-space-6` | `clamp(16px, 1.667*vw, 36px)` | **24px** |
| `--sfx-space-8` | `clamp(24px, 2.222*vw, 48px)` | **32px** |
| `--sfx-space-12` | `clamp(32px, 3.333*vw, 72px)` | **48px** |
| `--sfx-space-16` | `clamp(48px, 4.444*vw, 96px)` | **64px** |
| `--sfx-space-24` | `clamp(64px, 6.667*vw, 144px)` | **96px** |

**Rule:** Only these values. Never `5px`, `10px`, `20px`, etc. If Tailwind utilities are used, map to these stops only.

**Anchor semantics:** The fixed-target column lists values at the 1440px viewport. The `clamp()` expressions produce scaled-but-proportional values at other viewports. Component spacing MUST reference `--sfx-space-N` tokens; never author raw pixel spacing that "aims for" an intermediate scaled value. A rendered value of `42px` at a 1280px viewport (where `--sfx-space-12` falls below its 72px ceiling) is compliant — the token is the contract, not the pixel.

### 4.3 Typography

**Fonts:**
- `--sfx-font-sans`: Inter (body, headings 2/3)
- `--sfx-font-mono`: JetBrains Mono (code, data labels)
- `--sfx-font-display`: Anton (display, heading-1, big numbers)
- `--sfx-font-electrolize`: Electrolize (specialty mono-style display)

**Scale (fluid, clamp-scaled):**

| Token | Target @1440 | Use |
|---|---|---|
| `--text-2xs` | 9px | micro labels, copy buttons |
| `--text-xs` | 10px | tag pills, stat labels |
| `--text-sm` | 11px | nav, footer, grid metadata |
| `--text-base` | 13px | body copy, descriptions |
| `--text-md` | 16px | hero body, prominent copy |
| `--text-lg` | 18px | section intros |
| `--text-xl` | 24px | subheadings |
| `--text-2xl` | 32px | section titles |
| `--text-3xl` | 48px | page headers |
| `--text-4xl` | 80px | display type |

**HUD micro-type scale (chrome only — never content):**

| Token | Target | Use |
|---|---|---|
| `--text-hud-xs` | 5px | Miniature preview pixel-grid labels |
| `--text-hud-sm` | 6px | Miniature preview inline chrome |
| `--text-hud-md` | 7px | Compact chrome rows in mini-previews |
| `--text-hud-lg` | 8px | HUD badges, footer pill text |

**Accessibility exception:** HUD micro-type falls below WCAG minimum readability. It is permitted ONLY for decorative chrome where the size IS the aesthetic signal (Ikeda perception-threshold register) — glyph chrome, instrumentation HUDs, inline meta labels, miniature-component previews. Must NEVER render text that users are expected to read.

**Semantic aliases (preferred for new work):**

| Alias | Family | Size | Weight | Leading |
|---|---|---|---|---|
| `--sfx-text-heading-1-*` | Anton | `--text-3xl` | 700 | 0.9 |
| `--sfx-text-heading-2-*` | Inter | `--text-2xl` | 700 | 1.1 |
| `--sfx-text-heading-3-*` | Inter | `--text-xl` | 600 | 1.2 |
| `--sfx-text-body-*` | Inter | `--text-base` | 400 | 1.5 |
| `--sfx-text-small-*` | Inter | `--text-sm` | 400 | 1.4 |

**Tracking:** `--sfx-tracking-label: 0.15em` for caps/labels.

### 4.4 Layout

| Token | Target @1440 | Purpose |
|---|---|---|
| `--sfx-max-w-content` | 672px | Prose, readable width |
| `--sfx-max-w-wide` | 1280px | Section width |
| `--sfx-max-w-full` | 100% | Full-bleed |
| `--sfx-gutter` | 24px | Standard horizontal padding |
| `--sfx-gutter-sm` | 16px | Mobile horizontal padding |
| `--sfx-nav-height` | 83px | Top nav fixed height |
| `--sfx-nav-chrome-gap` | 3px | Intra-nav gap (between cubes inside the stack, between stack and corner cluster, and inside the corner cluster). Paired with `--sf-nav-cube-pitch` which consumes this + the 32px cube size. Off the blessed spacing scale because the nav chrome has its own tight visual rhythm; chrome-only — do not use elsewhere. |

**Viewport-unit consumption policy:** Components rendered inside `<ScaleCanvas>` must consume `--sf-vw` / `--sf-vh` (see §4.11) instead of `vw` / `vh`, so that scaled / letterboxed canvas states remain coherent. Global chrome rendered OUTSIDE `<ScaleCanvas>` (nav, modals, portals) consumes standard viewport units OR the width/gutter/height tokens in this section. Fixed-position chrome that must align to canvas geometry consumes `--sf-frame-offset-x` / `--sf-frame-bottom-gap` / `--sf-canvas-h` (see §4.11).

### 4.5 Animation

| Token | Value | Use |
|---|---|---|
| `--sfx-duration-instant` | 34ms | CSS-only transitions |
| `--sfx-duration-fast` | 100ms | Micro-feedback (press, hover-out) |
| `--sfx-duration-normal` | 200ms | Default transition |
| `--sfx-duration-slow` | 400ms | Theme toggle, larger shifts |
| `--sfx-duration-glacial` | 600ms | Dramatic reveals |

**Canonical easing curve:** `cubic-bezier(0, 0, 0.2, 1)` (ease-out). All six easing tokens — `--sfx-ease-default`, `--sfx-ease-hover`, `--sfx-ease-spring`, `--ease-in`, `--ease-out`, `--ease-in-out` — resolve to this exact curve. The system has **no spring motion, no anticipation, no bounce.** Motion is decisive.

**Linear token (exception for continuous loops).** `--sfx-ease-linear: cubic-bezier(0, 0, 1, 1)` is the only non-ease-out easing in the system. Use ONLY for: marquee scroll, scanline drift, progress bar fill, shake / flash loops, scrub-driven sweeps. NEVER for UI transitions, hovers, fades, or reveals — those consume the ease-out token set above. Adding `--sfx-ease-linear` to a transition is a compliance violation.

**`--sfx-ease-spring` is deprecated.** The curve resolves to ease-out; the name misleads and encourages spring thinking. New code must use `--sfx-ease-default`. The deprecated token is retained as an alias for one version to avoid a breaking sweep; `globals.css` should carry a `@deprecated` comment on its declaration.

**Rejected curves — DO NOT substitute these anywhere in generated output:**

- `cubic-bezier(0.34, 1.56, 0.64, 1)` — overshoot/spring, forbidden
- `cubic-bezier(0.68, -0.55, 0.265, 1.55)` — back/anticipation, forbidden
- `cubic-bezier(0.175, 0.885, 0.32, 1.275)` — easeOutBack, forbidden
- `cubic-bezier(0.2, 0.8, 0.4, 1)` — different ease-out curve, do NOT substitute even though it *looks* similar
- `cubic-bezier(0.22, 1, 0.36, 1)` / `cubic-bezier(0.16, 1, 0.3, 1)` / `cubic-bezier(0.16, 0, 0.5, 1)` — alternate ease-out shapes, forbidden (multiple variants introduce inconsistency)
- Any `cubic-bezier` with y-values outside `[0, 1]` range — spring/overshoot territory
- CSS named easings (`ease`, `ease-in-out`, `ease-in`, `ease-out`, `linear`) — always explicit `cubic-bezier` or an `--ease-*` token

**Authoring discipline:** In any `transition:` or `animation:` declaration (CSS or inline), the timing function must be either (a) the literal canonical string `cubic-bezier(0, 0, 0.2, 1)` or (b) a reference to an `--sfx-ease-*` / `--ease-*` token. Any other literal bezier or CSS named easing in a transition/animation context fails compliance. Applies to `@keyframes` consumers equally — `animation-timing-function` references must resolve to the canonical curve.

**Procedural SIGNAL-layer motion (exception):** Parametric animations driven by CSS math functions (`pow()`, runtime-written custom properties, scrub variables) may compute progression via non-bezier functions, subject to:

1. Input must be monotonic (scrub progress, scroll position, time). No bouncing inputs.
2. Output must stay within `[0, 1]` for t in `[0, 1]`. No overshoot.
3. Usage is per-component and documented inline. This is NOT a reusable math-utility layer.
4. Not a license to reintroduce bezier overshoot curves. A `cubic-bezier` literal is a transition curve, not a procedural function.

Reference pattern — nav cube cascade (`--sf-nav-peel-frac: calc(1 - pow(calc(1 - var(--sf-nav-phase-frac)), 6))`).

### 4.6 Interaction Feedback

| Token | Value | Purpose |
|---|---|---|
| `--sfx-press-scale` | `0.97` | Scale-down on press |
| `--sfx-press-y` | `1px` | Y-displace on press (deboss feel) |
| `--sfx-hover-y` | `-2px` | Y-lift on hover |
| `--sfx-focus-ring-width` | `2px` | Focus ring thickness |
| `--sfx-focus-ring-offset` | `2px` | Focus ring offset |
| `--sfx-deboss-light` | `0 1px 0 oklch(1 0 0 / 0.1)` | Subtle highlight edge |
| `--sfx-deboss-shadow` | `0 -1px 0 oklch(0 0 0 / 0.15)` | Subtle shadow edge |

### 4.7 Borders

| Token | Value | Use |
|---|---|---|
| `--sfx-border-element` | 2px | Component borders (card, input) |
| `--sfx-border-divider` | 3px | In-content dividers |
| `--sfx-border-section` | 4px | Section boundaries |

### 4.8 Signal Layer (parametric)

| Token | Default | Purpose |
|---|---|---|
| `--sfx-signal-intensity` | `0.5` | Master expressive level (0–1) |
| `--sfx-signal-speed` | `1` | Animation speed multiplier |
| `--sfx-signal-accent` | `0` | Accent injection (boolean-like) |
| `--sfx-vhs-crt-opacity` | `0.05` | CRT scanline strength |
| `--sfx-vhs-noise-opacity` | `0.00375` | VHS noise strength |
| `--sfx-grain-opacity` | `0.03` | Idle grain texture |

### 4.9 Z-Index Scale

| Token | Value |
|---|---|
| `--sfx-z-above-bg` | 1 |
| `--sfx-z-content` | 10 |
| `--sfx-z-overlay` | 100 |
| `--sfx-z-scroll-top` | 200 |
| `--sfx-z-progress` | 300 |
| `--sfx-z-cursor` | 500 |
| `--sfx-z-skip` | 900 |
| `--sfx-z-nav` | 9999 |
| `--sfx-z-vhs` | 99999 |

### 4.10 Effects Pipeline (SIGNAL-layer parametric)

Runtime tokens written by `updateSignalDerivedProps()` in `components/layout/global-effects.tsx`. CSS consumers read them without JS. Primitives in `components/animation/` use the JS API in `lib/effects/` directly for numeric precision.

| Token | Default | Purpose |
|---|---|---|
| `--sfx-fx-tier` | `fallback` | Current effects tier (`fallback` / `baseline` / `enhanced` / `premium`) |
| `--sfx-fx-multiplier` | `0` | Master scalar for all effect-layer opacity/intensity (0–1) |
| `--sfx-fx-feedback-decay` | `0.88` | Feedback loop decay coefficient |
| `--sfx-fx-displace-gain` | `0` | Displacement field gain (0–1) |
| `--sfx-fx-bloom-intensity` | `0` | Bloom pass intensity (0–1) |
| `--sfx-fx-glitch-rate` | `0` | Glitch pass event rate (0–1) |
| `--sfx-fx-particle-opacity` | `0` | Particle field opacity (0–1) |
| `--sfx-audio-bass` | `0` | Audio-reactive bass amplitude (0–1) |
| `--sfx-audio-mid` | `0` | Audio-reactive mid amplitude (0–1) |
| `--sfx-audio-high` | `0` | Audio-reactive high amplitude (0–1) |

**Contract:** These tokens parameterize existing effect primitives. They do NOT spawn new CVA variants, new SF components, or new utility classes. Orchestrated through `SFSignalComposer` (§5).

### 4.11 Canvas Frame (SIGNAL-layer viewport remap)

The ScaleCanvas aspect-lock contract. Fixed-position chrome that must align to canvas geometry consumes these rather than raw `vw` / `vh`, so scaled / letterboxed canvas states remain coherent.

| Token | Default | Purpose |
|---|---|---|
| `--sf-vw` | `1vw` (no-canvas fallback) | Canvas-remapped viewport width unit |
| `--sf-vh` | `1vh` (no-canvas fallback) | Canvas-remapped viewport height unit |
| `--sf-canvas-scale` | `1` | Active canvas scale factor |
| `--sf-canvas-h` | `calc(100 * var(--sf-vh))` | Canvas height in CSS pixels |
| `--sf-frame-offset-x` | `0px` | Horizontal offset of canvas within viewport |
| `--sf-frame-bottom-gap` | `0px` | Bottom-edge gap for fixed HUD clearance |
| `--nav-height` | `83px` | Top nav fixed height (short-form alias; canonical is `--sfx-nav-height` §4.4) |

**Naming exception:** These use the `--sf-*` prefix rather than `--sfx-*` because they are runtime viewport variables written by `components/layout/scale-canvas.tsx`, not token values. The prefix distinction signals "consume freely, do not author."

### 4.12 Keyframe Library

v0.1.1 blocked new GSAP effects but left CSS `@keyframes` unbounded. The sanctioned families below are the complete inventory. Keyframes outside these families count as subsystem invention and route through the proposal workflow.

| Family | Keyframes | Purpose |
|---|---|---|
| Fade | `sf-typewriter-fade`, `sf-slow-fade-in`, `sf-hero-slow-fade-in`, `sf-feel-bloom-fade-in` | Intro / reveal timing |
| Nav | `sf-nav-roll-up`, `sf-nav-icon-hover-hold` | Nav chrome micro-behavior |
| Hero | `sf-hero-slash-enter`, `sf-period-in` | Display-type entries |
| VHS / CRT | `sf-vhs-ease-in`, `sf-scanline-drift`, `sf-idle-scan`, `sf-jfm-flicker` | Signal-layer overlay motion |
| Feedback | `sf-skeleton-sweep`, `sf-shake`, `sf-flash`, `sf-feel-pulse` | User-feedback micro-motion |
| Mesh | `sf-mesh-drift` | Background generative motion |
| Marquee | `sf-marquee-scroll` | Horizontal ticker |

**Addition policy:** New keyframes require a family assignment. All `animation-timing-function` references must resolve to the canonical ease-out curve (§4.5) or a monotonic procedural progression (§4.5 SIGNAL-layer exception). Every new keyframe ships with an inline comment naming its family and use site.

---

## 5. Component Inventory

All SF components are thin wrappers over shadcn/Radix bases in `components/ui/`. Always use SF-prefixed components in generated output; never reach into `components/ui/` directly. Import from `@/components/sf`.

### Layout Primitives
`SFContainer` · `SFSection` · `SFStack` · `SFGrid` · `SFText`

### Form / Input
`SFButton` · `SFInput` · `SFLabel` · `SFCheckbox` · `SFRadioGroup` · `SFSwitch` · `SFSlider` · `SFTextarea` · `SFSelect` (+ Trigger/Content/Group/Item/Label/Value) · `SFToggle` · `SFToggleGroup` · `SFInputGroup` (+ Addon/Button/Text/Input/Textarea) · `SFInputOTP` (+ Group/Slot/Separator)

### Surfaces
`SFCard` (+ Header/Title/Description/Content/Footer) · `SFDialog` (+ Trigger/Close/Content/Header/Footer/Title/Description) · `SFSheet` (same shape as Dialog) · `SFPopover` (+ Trigger/Content/Header/Title/Description) · `SFHoverCard` · `SFTooltip` · `SFDrawer` (lazy)

### Navigation
`SFTabs` (+ List/Trigger/Content) · `SFNavigationMenu` (+ List/Item/Trigger/Content/Link/Viewport/Mobile) · `SFBreadcrumb` (+ List/Item/Link/Page/Separator) · `SFPagination` (+ Content/Item/Link/Previous/Next) · `SFMenubar` (lazy) · `SFDropdownMenu` (+ Trigger/Content/Group/Item/Label/Separator/Shortcut) · `SFCommand` (+ Dialog/Input/List/Empty/Group/Item/Separator/Shortcut)

### Data Display
`SFTable` (+ Header/Head/Body/Row/Cell) · `SFBadge` · `SFAvatar` (+ Image/Fallback) · `SFStatusDot` · `SFProgress` · `SFSkeleton` · `SFSeparator`

### Collapsible / Disclosure
`SFAccordion` (+ Item/Trigger/Content) · `SFCollapsible` (+ Trigger/Content)

### Feedback
`SFAlert` (+ Title/Description) · `SFAlertDialog` (+ Trigger/Content/Header/Footer/Title/Description/Action/Cancel) · `SFToaster` / `sfToast` · `SFEmptyState`

### Multi-step / Selection
`SFStepper` · `SFStep`

### Scroll / Utility
`SFScrollArea` · `SFScrollBar`

### Symbols
`CDSymbol` (Culture Division mark)

### Effects Subsystem
`SFSignalComposer` — orchestrates `EffectPassName` passes (feedback/displace/bloom/glitch/particle tiers)

**Anti-use rules:**
- Do NOT invent SF components that don't exist in this list.
- Do NOT import from `components/ui/` in generated code — always `@/components/sf`.
- Do NOT add new variants to existing components without explicit instruction.
- Animation components live in `@/components/animation` — reference by name, do not redesign.
- Blocks (page sections) live in `@/components/blocks` — these are compositions, not primitives.

---

## 6. Aesthetic Register

The visual language SF inherits. When generating output, every decision must be traceable to one of these:

### Detroit Underground (DU)
- Hard-cut toggle (no fades)
- VHS/CRT overlay as default signal layer
- Idle grain texture
- "Slightly tense" emotional register
- Coded nomenclature (R08, R10, catalog numbers as first-class type)
- References: `detund.bandcamp.com`, `detroitunderground.net`, neubauberlin DU case study

### The Designers Republic (TDR)
- Maximum-minimalism — total design, no decoration
- Coded naming systems as visual language
- International Typographic Style roots, Japanese graphic tradition
- References: Wikipedia TDR + Ian Anderson, `warp.net`

### Ryoji Ikeda
- Data-as-material
- Perception thresholds (micro-type, near-imperceptible animation)
- `--sfx-signal-intensity` as a first-class design control

### Autechre
- Generative RULES, not randomness
- Per-entity artwork (every component has its own variation seed)
- Coded nomenclature over human-readable names

### Neville Brody / Fuse
- Legibility / expression boundary = the FRAME / SIGNAL tension in type

### Rick Owens
- Brutalist romanticism
- Truth to materials — don't hide the construction, celebrate it
- Exposed structure as aesthetic

### Adjacent
- Resident Advisor (`ra.co`) — data-dense electronic music UI
- International Typographic Style — grid discipline
- Japanese graphic design — spacing, rhythm, silence

---

## 7. Do-Nots (drift red flags)

If generated output contains any of these, it has drifted. Grade against this list explicitly.

### Visual
- ❌ Rounded corners anywhere
- ❌ Decorative gradients, glassmorphism, "aurora" backgrounds
- ❌ Drop shadows as decoration (allowed only as micro-feedback tokens)
- ❌ Generic dark-mode (black bg + neon accent, no aesthetic specificity)
- ❌ Cozy/friendly/playful register — bouncy animations, bubbly type, emoji-forward UI
- ❌ Skeuomorphism — textures imitating paper, metal, glass

### Tokens
- ❌ Hex colors **anywhere** in output — including comments, docs, class names, data attributes, and SVG `fill`/`stroke` attributes. OKLCH only. Convert any hex references to OKLCH before emitting.
- ❌ Arbitrary spacing values (`5px`, `10px`, `20px`, `padding: 1.5rem` if 1.5rem isn't a blessed stop)
- ❌ Invented color tokens (`--color-brand-2`, `--color-info`, etc.)
- ❌ Inline font-family strings — always use `--sfx-font-*` tokens

### Components
- ❌ Inventing SF components not in §5
- ❌ Importing from `components/ui/` in generated code
- ❌ Adding new CVA variants ad-hoc
- ❌ Re-implementing primitives inline

### Typography
- ❌ "Trendy" display types (outline fonts, chrome effects, arcade fonts)
- ❌ Excessive font-weight (display should be Anton 700, not Inter 900)
- ❌ Center-aligned long-form text
- ❌ Decorative underlines, italics for emphasis only (OK for citations)

### Motion
- ❌ Spring / bouncy easings. Canonical curve is `cubic-bezier(0, 0, 0.2, 1)`. Do NOT emit `cubic-bezier(0.34, 1.56, 0.64, 1)`, `cubic-bezier(0.68, -0.55, ...)`, `easeOutBack`, or any curve with a y-value outside `[0, 1]`.
- ❌ Multiple ease-out variants. Pick ONE canonical curve; do not substitute `0.2, 0.8, 0.4, 1` — it is a different curve and introduces inconsistency.
- ❌ CSS named easings (`ease`, `ease-in-out`). Always explicit `cubic-bezier` or an `--ease-*` token.
- ❌ Parallax for decoration
- ❌ New GSAP effects beyond existing set
- ❌ Scroll-jacking that breaks native scroll expectations

---

## 8. Quality Bar

Generated output targets:

| Metric | Target |
|---|---|
| CRT critique score | ≥ 90/100 (current baseline: 93/100) |
| Lighthouse | 100 / 100 / 100 / 100 |
| WCAG | AA minimum, keyboard navigable |
| LCP | < 1.0s |
| CLS | 0 |
| TTI | < 1.5s |
| Page weight | < 200KB initial (excluding images) |

---

## 9. Usage Rules for AI Tools

When generating SignalframeUX artifacts, AI tools MUST:

1. **Ground every token in §4.** If a color, spacing, or type value is not defined here, do not invent it.
2. **Name components exactly as written in §5.** `SFCard`, not `Card` or `sf-card` or `SignalCard`.
3. **Respect §3 hard constraints without exception.** A "just this once" rounded corner is a drift.
4. **Translate aesthetic register from §6, not from tool defaults.** If in doubt about visual register, default to DU/TDR — NOT to "modern SaaS" or "generic dark mode."
5. **Flag ambiguity, do not paper over it.** If a request is underspecified (e.g., "make a hero"), ask: core 5 colors only? which lineage influence? FRAME-weighted or SIGNAL-weighted?
6. **Report deviations.** If an external constraint forces breaking a rule (e.g., platform requires rounded tap targets), declare it explicitly in the output.
7. **Do not invent subsystems.** If generated output would benefit from a new parametric system, token category, utility class, or component family that does not already exist in §4 or §5, do NOT emit it as part of the primary artifact. Instead, produce a **proposal note** at the end of the artifact naming the proposed addition — the user will evaluate separately. Inventions merged into primary output count as drift, even when the invention is well-designed.

### When generating mockups
- Use Inter for body, Anton for display unless explicitly directed otherwise.
- Default to dark mode unless user specifies light — but remember dark mode in SF is NOT generic. It is DU-inflected: deep neutrals, magenta primary, VHS/CRT optional overlay, grain optional.
- Start from SF primitives (`SFSection > SFContainer > SFStack`). Layout first, content second, expression third.

### When generating code
- Import from `@/components/sf`.
- Use `cn()` from `@/lib/utils` for class merging.
- CVA for any variant logic — do not write inline class-name switches.
- Server Components by default. `'use client'` only for interactivity or hooks.
- TypeScript strict. No `any`.

### When generating decks / slides / one-pagers
- Honor `--sfx-tracking-label: 0.15em` for all caps labels.
- Numbers/metrics in Anton or JetBrains Mono, never Inter.
- Data-dense preferred over white-space-lush.
- Coded naming (R01, v0.1, hue:350) is a feature, not clutter.

---

## 10. Appendix — Source Files

This manifest is the distilled contract. Authoritative sources if an AI tool needs to drill deeper:

| Source | Role |
|---|---|
| `CLAUDE.md` | System rules (v0.1 scope, hard constraints, quality bar) |
| `SIGNALFRAMEUX_REFERENCE.md` | Expanded rationale, tech stack, file organization, CRT critique history |
| `app/globals.css` | Token source of truth (raw `--sfx-*` values + `@theme` aliases) |
| `components/sf/index.ts` | Canonical component barrel (authoritative inventory) |
| `lib/utils.ts` | `cn()` for class merging |
| `tailwind.config.*` / Tailwind v4 `@theme` in `globals.css` | Build-time token wiring |
| `~/greyaltaer/vaults/wiki/` (cdSB) | Intellectual lineage; FRAME/SIGNAL theory; aesthetic rationale |

**Updated:** 2026-04-18 · **Manifest version:** v0.1.3 · **Target SF version:** v0.1 (stabilization + sanctioned SIGNAL-layer growth)

### Changelog

- **v0.1.3** (2026-04-18) — Added `--sfx-ease-linear: cubic-bezier(0, 0, 1, 1)` to §4.5. Names the explicit linear curve needed for continuous loops (marquee, scanline, progress, shake/flash) that were previously authored as `cubic-bezier(0, 0, 1, 1)` literals during the v0.1.2 §C.5 named-easing sweep. Scope: one new token, consumers at 7 sites in `globals.css`. Token also shipped in `lib/tokens.css` for downstream consumers. Documented with explicit "UI transitions must NOT use this" guidance to prevent drift back into non-canonical ease-outs via this token.
- **v0.1.2** (2026-04-18) — Sanctioned SIGNAL-layer growth observed on `feature/navbar-redesign`. Added §4.10 Effects Pipeline, §4.11 Canvas Frame, §4.12 Keyframe Library. Extended §4.3 with HUD micro-type scale (5–8px chrome-only). Amended §4.5 with authoring discipline (no inline CSS named easings; timing function must be canonical bezier literal or token), procedural SIGNAL-layer motion exception (pow-based progression for scrub-driven animations), and `--sfx-ease-spring` deprecation. Rewrote §3 Gradients row to distinguish structural (permitted: hard-stop bars, edge vignettes, scanlines, halftone/grid) from decorative (forbidden). Extended §3 Color space row with Edge-runtime and Canvas 2D hex escape hatches tied to `lib/tokens.edge.ts` pattern. Amended §4.2 with anchor-value semantics, §4.4 with viewport-unit consumption policy, §3 System-level inventions row to name the sanctioned SIGNAL subsystems. Derived from `feature/navbar-redesign` at 64 commits ahead of main. Source delta doc: `.planning/proposals/v0.1.2-deltas.md`. Seven code-level items tracked in §C of the delta doc — not canonized, fix after branch lands.
- **v0.1.1** (2026-04-18) — Hardened against drift observed in Claude Design v0 probe. Canonical easing curve locked (`cubic-bezier(0, 0, 0.2, 1)`); rejected spring/bouncy curves named explicitly; hex ban reinforced across all contexts (comments, attributes, SVG); new "no subsystem invention" rule (§3, §9 rule 7). Two Claude Design inventions (Elevation ladder, Posture system) captured as v0.2+ proposals at `.planning/proposals/`. See `.planning/claude-design-probes/v0/notes.md` for full probe findings.
- **v0.1.0** (2026-04-17) — Initial manifest. Distilled from CLAUDE.md, SIGNALFRAMEUX_REFERENCE.md, app/globals.css, components/sf/.
