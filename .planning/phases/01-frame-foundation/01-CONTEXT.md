# Phase 1: FRAME Foundation - Context

**Gathered:** 2026-04-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Lock the token system so every spacing, typography, layout, color, and variant decision has exactly one valid answer. This phase produces the definitive globals.css token contract, enforces blessed spacing stops across all components, adds semantic typography aliases, formalizes layout tokens, tiers the color palette, namespaces VHS tokens, standardizes CVA variants, adds CSS fallbacks, and creates a print stylesheet. No new components or features — pure foundation hardening.

</domain>

<decisions>
## Implementation Decisions

### Spacing Enforcement Strategy
- Batch audit + replace all 43 arbitrary spacing values with nearest blessed stop in one sweep
- Enforcement via Tailwind safelist approach — document blessed stops, manually enforce during review
- Define `--space-*` CSS custom properties in globals.css AND map to Tailwind utilities (both)
- Exempt structural measurements (nav-height: 83px, border-width, etc.) — only content spacing uses blessed stops

### Typography Token Architecture
- Semantic aliases named `--text-heading-1` through `--text-body`, `--text-small` as CSS custom properties
- Composite tokens that bundle font-family + size + weight (e.g., text-heading-1 = Anton/3xl/bold)
- Keep existing clamp() for hero/display type — semantic aliases cover everything else
- Implement as Tailwind `@utility` definitions referencing CSS custom properties

### Layout & Color Token Formalization
- Layout max-widths: `--max-w-content: 42rem` (672px), `--max-w-wide: 80rem` (1280px), `--max-w-full: 100%`
- Gutter tokens: `--gutter: 1.5rem` (24px), `--gutter-sm: 1rem` (16px mobile)
- Color tier enforcement via documentation + code review — tier definitions in globals.css comment block
- VHS → sf-vhs namespace migration as single atomic search-replace commit

### Fallback, CVA & Print Strategy
- CSS fallbacks on critical visual properties only (colors, fonts, spacing) — skip z-index, motion, decorative
- CVA `intent` standard values: `default`, `primary`, `secondary`, `destructive`, `ghost`, `outline`
- Minimal print stylesheet: invert dark backgrounds to white, suppress Signal layer, keep layout structure
- Retrofit `defaultVariants` with `intent: "default"` on every existing CVA call

### Claude's Discretion
- Exact blessed-stop mapping for each arbitrary value (nearest-stop judgment calls)
- CSS fallback value selection (reasonable defaults per property)
- Print stylesheet implementation details
- Order of operations within each requirement

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- 24 SF-wrapped components in `components/sf/` with barrel export from `sf/index.ts`
- 24 shadcn base components in `components/ui/`
- `lib/utils.ts` with `cn()` helper for class merging
- `lib/theme.ts` for theme toggle logic
- GSAP split: `gsap-core.ts` (lightweight) + `gsap-plugins.ts` (full)

### Established Patterns
- Tailwind CSS v4 with `@theme` block in globals.css as token source of truth
- OKLCH color space throughout
- Zero border-radius enforced via `--radius: 0px` tokens
- Motion tokens already defined: `--duration-instant` through `--duration-glacial`, three easings
- Z-index scale, border width scale, press feedback tokens exist
- CVA used for variants in SF components (but `intent` naming not yet standardized)

### Integration Points
- `app/globals.css` — primary token file, all changes center here
- `components/sf/*.tsx` — CVA variant standardization target
- `components/ui/*.tsx` — shadcn base (don't modify), but some have arbitrary spacing
- Dark mode via `.dark` class with OKLCH overrides
- VHS tokens (`--vhs-crt-opacity`, `--vhs-noise-opacity`) used by `global-effects.tsx`

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches. All decisions follow CLAUDE.md specifications and DU/TDR aesthetic principles.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>
