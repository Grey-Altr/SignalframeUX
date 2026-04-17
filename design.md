# SignalframeUX — AI Tool Ingestion Manifest

> **Purpose.** Single-document design-system contract for AI tools (Claude Design, Figma Make, v0, Stitch, custom skills). Distilled from `CLAUDE.md`, `SIGNALFRAMEUX_REFERENCE.md`, `app/globals.css`, and `components/sf/`. Paste this into any AI design tool as grounding context before generating SignalframeUX artifacts.
>
> **Read order.** Identity → Philosophy → Hard Constraints → Tokens → Components → Aesthetic Register → Do-Nots → Usage Rules. Every section is decision-bearing. Do not skim.

---

## 1. Identity

**SignalframeUX** is a high-performance design system for **Culture Division**, a design studio operating at the intersection of electronic music culture, critical design, and product engineering. SignalframeUX powers the Culture Division portfolio, internal tooling (cdOS), and downstream studio work (CD-Operator).

- **Current version:** v0.1 (stabilization phase — not expansion)
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
| **Gradients** | None. No decorative gradients, no fake depth, no "glassmorphism." |
| **Shadows** | None decorative. Allowed only as micro-feedback (press/hover) or as `--sfx-deboss-*` tactile tokens. |
| **Rounded corners** | None. See Border radius. |
| **Skeuomorphism** | None. No textures imitating real materials. |
| **Generic dark-mode** | Forbidden. No "default black + neon accent" aesthetic. Must borrow directly from DU/TDR visual language. |
| **Arbitrary spacing** | Forbidden. Use only blessed stops (see §4.2). |
| **Palette expansion** | Forbidden. Work within core 5 + extended. Do not introduce new hues. |
| **Color space** | OKLCH only. Never hex except in prose documentation. |
| **New GSAP effects** | Forbidden in v0.1. Normalize existing usage, do not expand. |
| **New SF components** | Forbidden in v0.1 unless in stabilization scope (container/section/stack/grid/text primitives). |

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

### 4.5 Animation

| Token | Value | Use |
|---|---|---|
| `--sfx-duration-instant` | 34ms | CSS-only transitions |
| `--sfx-duration-fast` | 100ms | Micro-feedback (press, hover-out) |
| `--sfx-duration-normal` | 200ms | Default transition |
| `--sfx-duration-slow` | 400ms | Theme toggle, larger shifts |
| `--sfx-duration-glacial` | 600ms | Dramatic reveals |

**All easings currently resolve to `cubic-bezier(0, 0, 0.2, 1)`** (ease-out). This is intentional — no spring, no bounce, no anticipation. Motion is decisive.

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
- ❌ Hex colors in output (OKLCH only)
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
- ❌ Bouncy/spring easings (all easings are ease-out)
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

**Updated:** 2026-04-17 · **Manifest version:** v0.1.0 · **Target SF version:** v0.1 (stabilization)
