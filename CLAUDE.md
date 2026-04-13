# SIGNALFRAMEUX — SYSTEM RULES

> SignalframeUX is a high-performance design system for Culture Division.
> You are stabilizing and refining it to a usable v0.1 baseline — NOT rebuilding it.
> Every change must reduce friction. If it doesn't, don't do it.

## Tech Stack

Next.js 15.3 (App Router, Turbopack) · TypeScript 5.8 · Tailwind CSS v4 (`@theme` in globals.css) · CVA for variants · Radix UI via shadcn → SF-wrapped layer · GSAP 3.12 + ScrollTrigger · Lenis · OKLCH color space · Lucide React · `cn()` from `lib/utils.ts` · Vercel

## Dual-Layer Model

- **FRAME** — deterministic, legible, semantic, consistent. The structural layer.
- **SIGNAL** — generative, parametric, animated, data-driven. The expressive layer.
- **NON-NEGOTIABLE:** Frame layer MUST remain readable. Signal layer MUST NOT interfere with usability.

## Design Philosophy

**Style: Enhanced Flat Design** — inspired by Detroit Underground + The Designers Republic.

MUST: sharp, controlled, structured, slightly tense, sophisticated but not sterile.
Depth comes from spacing, hierarchy, layout, contrast, and motion ONLY.

DO NOT: skeuomorphism, fake depth, excessive shadows, decorative gradients, rounded corners (zero border-radius everywhere), generic dark-mode aesthetic.

## File Organization

`components/ui/` base shadcn (don't modify) · `components/sf/` SF-wrapped + barrel export · `components/blocks/` page sections · `components/animation/` GSAP components · `components/layout/` nav, footer, chrome · `lib/` utils, theme, GSAP helpers · `hooks/` custom hooks · `app/globals.css` token source of truth

## Component Conventions

- shadcn base in `ui/` → SF-wrapped in `sf/` (SF-prefix PascalCase: `SFButton`, `SFCard`). Barrel from `sf/index.ts`.
- CVA for variants. `cn()` for class merging. Server Components default; `'use client'` only when needed.
- **Exception:** Animation components and blocks may bypass SF-wrapping when no Radix base applies.
- Section data attributes: `data-section`, `data-section-label`, `data-bg-shift`, `data-anim`.

## Token System

### Colors (Tiered)
**Core 5 (required — all new components MUST work with these):**
background, foreground, primary, secondary, accent

**Extended (component-specific use only):**
muted, card, popover, destructive, success, warning

DO NOT expand the palette. All colors in OKLCH.

### Spacing
Blessed stops from Tailwind's 4px base: **4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96**.
DO NOT use arbitrary spacing values. Audit existing components for consistency.

### Typography
Scale: `--text-2xs` (10px) to `--text-4xl` (80px), minor third 1.2. Fonts: Inter, JetBrains Mono, Electrolize, Anton.
Semantic aliases (preferred for new work): heading-1 → 3xl+Anton · heading-2 → 2xl+Inter bold · heading-3 → xl+Inter semi · body → base+Inter · small → sm+Inter

### Layout
Define and use these tokens — no arbitrary max-widths:
- `--max-w-content` (prose/readable width)
- `--max-w-wide` (section width)
- `--max-w-full` (full-bleed)
- Standard gutters, column counts, margin behavior as CSS custom properties
- Breakpoints: Tailwind v4 defaults

### Animation
Durations: `--duration-instant` (34ms) to `--duration-glacial` (600ms). Easings: `--ease-default`, `--ease-hover`, `--ease-spring`.
DO NOT add new GSAP effects or animation components. Normalize existing usage. Refine, don't expand.

## Stabilization Scope (v0.1)

1. **Spacing** — audit and constrain to blessed stops across all components
2. **Typography** — add semantic alias tokens, document usage rules
3. **Layout** — formalize max-width/gutter/grid tokens in globals.css
4. **Primitives** — create thin SF-wrapped: `SFContainer`, `SFSection`, `SFStack`, `SFGrid`, `SFText` (enforce tokens)
5. **Colors** — tier the palette (core 5 + extended), freeze expansion
6. **Animation** — normalize token usage, do not expand

DO NOT: redesign the system, rename arbitrarily, introduce large abstractions, over-tokenize, expand the component library, build edge-case components.

## Process

**Friction-Driven:** Simulate building real UI → identify friction → fix at system root → apply globally.
**Visual QA:** Render examples → evaluate alignment/spacing/hierarchy/clarity → fix → re-test.
**Consistency:** Remove inconsistencies, normalize naming, unify spacing, align APIs.

## cdSB — Design Intelligence Layer

SignalframeUX's intellectual lineage, aesthetic rationale, and design theory live in the second-brain wiki:
`~/greyaltaer/vaults/wiki/`

**Start here:** `wiki/analyses/culture-division-operating-principles.md`

**FRAME/SIGNAL is not just a naming convention.** It draws from six converging traditions — Shannon's signal/noise, Goffman's frame analysis, Wiener's cybernetics, architectural framing, music production signal chains, and the grid/gesture duality in design theory. See `wiki/analyses/frame-signal-intellectual-lineage.md`.

**Every SF component decision should be traceable** to a wiki influence:
- DU → hard-cut toggle, VHS overlay, idle grain, "slightly tense" register
- tDR → maximum-minimalism, total design, coded naming
- Ikeda → data-as-material, perception thresholds, `--signal-intensity`
- Autechre → generative rules (not randomness), per-entity artwork, coded nomenclature
- Brody/Fuse → legibility/expression boundary = FRAME/SIGNAL tension in type
- Owens → brutalist romanticism, truth to materials, exposed construction

**Quality bar:** Awwwards SOTD execution within Culture Division's aesthetic. Scalable to all product types.

## Quality Bar

- CRT critique score: >= 90/100
- Lighthouse: 100/100 all categories
- WCAG AA minimum, keyboard-navigable
- LCP < 1.0s, CLS = 0, TTI < 1.5s
- Page weight < 200KB initial (excluding images)

## Hard Constraints

- DO NOT rebuild the system
- DO NOT introduce complexity — if the system grows, you are doing it wrong
- DO NOT add features, components, or tokens beyond stabilization scope
- DO NOT use rounded corners (zero border-radius everywhere)
- DO NOT produce generic dark-mode aesthetic — borrow directly from DU/TDR visual language
- Commit before every change for clean rollback points

## Git

Commit prefixes: `Feat:` / `Fix:` / `Chore:`
Commit before changes. Descriptive messages with metrics when applicable.

## Future Compatibility

System must remain compatible with: SignalframeUX evolution, cdOS (internal tool), CD-Operator (studio role).
