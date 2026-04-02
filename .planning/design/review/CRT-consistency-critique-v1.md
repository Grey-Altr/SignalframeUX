---
Artifact: CRT
Version: 1
Domain: review
Type: critique
Focus: consistency
Status: complete
Date: 2026-04-01
---

# Consistency Critique -- SignalframeUX Implementation

**Scope:** Token usage, naming conventions, spacing patterns, component structure, shared vs duplicated styles, font usage, border widths, z-index layering across 16 reviewed files.

**Overall Score: 72 / 100**

The token system in `globals.css` is well-architected (OKLCH, semantic variables, motion tokens, layout tokens). However, the implementation files bypass these tokens frequently -- hardcoded OKLCH values, inline `fontFamily` overrides, inconsistent border widths, and duplicated style patterns are widespread. The foundation is strong; the discipline of using it consistently is what needs attention.

---

## Summary by Severity

| Severity | Count | Weight Impact |
|----------|-------|---------------|
| Critical | 3 | High -- systemic token bypass undermines the design system |
| Major | 11 | Medium -- patterns that compound into maintenance burden |
| Minor | 8 | Low -- localized inconsistencies |
| Nit | 5 | Negligible -- style preference or naming |

---

## Findings

| # | Severity | Effort | Location | Issue | Suggestion | Weight |
|---|----------|--------|----------|-------|------------|--------|
| 1 | critical | significant | global-effects.tsx:106-134 | **Hardcoded OKLCH primary color repeated 6 times.** The cursor styles use `oklch(0.65 0.29 350)` as a raw string in 6 separate CSS declarations instead of `var(--color-primary)`. If the primary color token changes, the cursor will not update. | Replace all instances of `oklch(0.65 0.29 350)` in the cursor CSS with `var(--color-primary)`. | 9 |
| 2 | critical | significant | nav.tsx:457,469 + hero.tsx:415 | **Hardcoded OKLCH primary in JSX style objects and keyframes.** LogoMark uses `oklch(0.65 0.29 350)` in both inline style (`showColor` ternary) and `@keyframes logoGlitch`. Hero uses it for the slash color. These bypass the token system entirely. | Use `var(--color-primary)` in all keyframe and inline style references. For JS-side conditional coloring, read the CSS variable or use a class toggle. | 9 |
| 3 | critical | moderate | component-grid.tsx:204-223 + components-explorer.tsx:388 | **Hardcoded OKLCH in component border colors.** `component-grid.tsx` waveform uses `oklch(0.25 0.05 350)` and `oklch(0.45 0.15 350)`. `components-explorer.tsx` uses `oklch(0.3_0_0)` for border color. None of these map to tokens. | Define `--sf-primary-dim` and `--sf-neutral-30` (or similar) tokens in `:root` and reference them. | 8 |
| 4 | major | moderate | hero.tsx:39, code-section.tsx:8, dual-layer.tsx:13,41, stats-band.tsx:24, component-grid.tsx:271, nav.tsx:389,205, footer.tsx:14, token-tabs.tsx:138-144, start/page.tsx:199-248 | **`fontFamily: "var(--font-anton)"` repeated in ~15 inline styles across 10 files.** The `sf-display` utility class already sets `font-family: var(--font-display)` which resolves to Anton. Most of these inline style overrides are redundant when `sf-display` is also applied, or could use `sf-display` instead. | Audit every `fontFamily: "var(--font-anton)"` usage. Where the element already has `className="sf-display"`, remove the inline style. Where it does not, add `sf-display` class instead. | 7 |
| 5 | major | moderate | hero.tsx:118-185 | **Scoped `<style jsx>` block with 65 lines of CSS duplicating token patterns.** The hero CTA border-draw animation uses hardcoded `0.1s ease`, `200ms cubic-bezier(...)`, and `3px` values that do not reference motion tokens (`--duration-fast`, `--ease-default`) or the border system. | Extract timing to motion tokens. Use `var(--duration-fast)` for the 0.1s steps, `var(--ease-default)` or `var(--ease-hover)` for the cubic-beziers where appropriate. Move to globals.css if reusable. | 6 |
| 6 | major | quick-fix | nav.tsx:495, global-effects.tsx:160,190, global-effects.tsx:93 | **Inconsistent z-index values without a token scale.** Nav uses `z-50` (Tailwind = 50). ScrollProgress uses `z-[999]`. ScrollToTop uses `z-[200]`. VHSBadge uses `z-[200]`. Cursor uses `z-index: 10000`. There is no z-index token scale defined. | Define a z-index scale in `:root` -- e.g., `--z-nav: 50; --z-overlay: 100; --z-cursor: 200; --z-progress: 300;` -- and reference consistently. | 7 |
| 7 | major | quick-fix | nav.tsx:495, footer.tsx:6 | **Border width inconsistency between nav and footer.** Nav bottom border is `border-b-[3px]`. Footer top border is `border-t-[3px]`. But the hero and stats sections use `border-b-4` (4px). The system mixes 2px (`sf-border`), 3px (nav/footer), and 4px (section dividers) without documented rationale. | Standardize on a border-width token scale: `--border-thin: 2px; --border-medium: 3px; --border-thick: 4px;`. Document usage: thin for internal dividers, medium for nav/footer chrome, thick for section separators. | 7 |
| 8 | major | moderate | token-tabs.tsx:316-317 | **Hardcoded colors in typography code sample.** The CODE type scale row uses `color: "oklch(0.6 0.28 145)"` and `background: "oklch(0.12 0 0)"` -- these are exactly `--sf-code-text` and `--sf-code-bg` tokens but spelled out as raw values. | Replace with `color: "var(--sf-code-text)"` and `background: "var(--sf-code-bg)"`. | 6 |
| 9 | major | moderate | token-tabs.tsx:240-241 | **Hardcoded foreground/background OKLCH in color swatch rendering.** The swatch text color uses `oklch(0.985 0 0)` and `oklch(0.145 0 0)` directly -- these match `--color-foreground` and `--color-background` (light mode values) but are not referenced as tokens. | Use `var(--color-foreground)` and `var(--color-background)`, or define `--sf-swatch-text-light` / `--sf-swatch-text-dark` to make the intent explicit. | 5 |
| 10 | major | moderate | api-explorer.tsx:92, start/page.tsx:156 | **Duplicated CodeBlock component definitions.** Both `api-explorer.tsx` and `start/page.tsx` define their own `CodeBlock` component with near-identical styling (same bg, font-mono, text size, inset shadow). They diverge slightly in shadow values (`inset 0 2px 4px` vs `inset 0 1px 3px`). | Extract a shared `<CodeBlock>` component to `components/blocks/code-block.tsx`. Standardize the inset shadow to use `var(--sf-inset-shadow)`. | 6 |
| 11 | major | quick-fix | api-explorer.tsx:281 | **Hardcoded color value for right panel text.** `text-[oklch(0.985_0_0)]` is used instead of the semantic token `text-primary-foreground` or `text-background` (which resolve to the same value in light mode). | Replace with `text-primary-foreground` or `text-foreground` depending on dark mode intent. | 5 |
| 12 | major | quick-fix | api-explorer.tsx:313,317 | **Hardcoded `text-white`, `text-black`, `bg-white` in preview buttons.** These Tailwind color keywords bypass the OKLCH token system and will not respond to theme changes. | Replace with `text-background`, `text-foreground`, `bg-background` or the appropriate semantic tokens. | 6 |
| 13 | major | moderate | components-explorer.tsx:96 | **Hardcoded `text-white` in tab preview.** `PreviewTabs` uses `text-white` which does not map to any token and will appear wrong in potential future theme variants. | Use `text-background` or `text-primary-foreground`. | 4 |
| 14 | major | quick-fix | manifesto-band.tsx:177, 192 | **Inline transition `duration-150` instead of motion token.** The manifesto word spans use `transition-opacity duration-150` (150ms), but the closest motion token is `--duration-fast: 100ms` or `--duration-normal: 200ms`. This is a one-off value. | Decide if 150ms should be `--duration-fast` or `--duration-normal`, then use `transition-[opacity] duration-[var(--duration-fast)]` or the chosen token. | 4 |
| 15 | minor | quick-fix | dual-layer.tsx:29 | **FRAME tags use `border` (1px) while SIGNAL tags also use `border` (1px), but the FRAME tags have `sf-pressable` and hover border-width change (`hover:border-2`) causing layout shift.** The hover state changes from 1px to 2px border and compensates with padding, but SIGNAL tags do not have this interaction at all. | Either make both tag sets interactive with `sf-pressable`, or remove the hover border thickening from FRAME tags to maintain visual consistency between the two columns. | 3 |
| 16 | minor | quick-fix | footer.tsx:18,21 | **Inconsistent font sizes in footer brand column.** "Universal design system" uses `text-[15px]` while "By Grey Altaer" uses `text-[16px]`. These are arbitrary pixel values that do not map to the Augmented Fourth type scale. | Standardize both to the same size, preferably using the type scale (`text-sm` = 0.707rem ~11px, or `text-base` = 1rem = 16px). | 2 |
| 17 | minor | quick-fix | footer.tsx:28,31,43,50,66 | **Footer columns use `text-[15px]` (5 instances) -- not on the type scale.** 15px falls between `--text-sm` (11.3px) and `--text-base` (16px) in the Augmented Fourth scale. | Replace with `text-base` (16px) for consistency with the type scale, or define a `--text-footer` token if 15px is intentional. | 3 |
| 18 | minor | moderate | start/page.tsx:187-190, component-grid.tsx:89-93, components-explorer.tsx:149-155, components-explorer.tsx:369 | **Duplicated grain/noise texture inline SVG.** The fractal noise background pattern is copy-pasted as an inline SVG data URI in at least 4 locations with slightly different `baseFrequency` values (0.65 vs 0.9). | Extract to a shared constant or a `<GrainOverlay>` component. The `sf-grain` utility class exists but uses `/grain.svg` -- consolidate to one approach. | 4 |
| 19 | minor | quick-fix | hero.tsx:19 | **Halftone circle uses `rgba()` instead of `oklch()`.** The decorative halftone gradient uses `rgba(255,255,255,0.3)` while the entire token system is OKLCH-based. | Convert to `oklch(1 0 0 / 0.3)` for color space consistency. This is decorative but sets a bad precedent. | 2 |
| 20 | minor | quick-fix | hero.tsx:40 | **`textShadow` uses `rgba()` instead of `oklch()`.** Two `rgba()` values in the hero title text-shadow. | Convert to `oklch()` equivalents: `oklch(1 0 0 / 0.05)` and `oklch(0 0 0 / 0.3)`. | 2 |
| 21 | minor | quick-fix | global-effects.tsx:97 | **Cursor transition uses hardcoded `0.2s` instead of motion token.** The cursor opacity transition is `transition: opacity 0.2s` rather than `transition: opacity var(--duration-normal)`. | Use `var(--duration-normal)` (200ms is the same value, but token-referenced). | 2 |
| 22 | minor | moderate | start/page.tsx:193-210, tokens/page.tsx:1-43, components/page.tsx:1-40 | **Page-level layout patterns are duplicated.** All three sub-pages (`start`, `tokens`, `components`) manually render `<Nav />` and `<Footer />` with `mt-[var(--nav-height)]`. This could be a shared layout. | Create `app/(pages)/layout.tsx` (or similar group) that wraps children with Nav + Footer + the nav-height margin, reducing duplication across pages. | 4 |
| 23 | nit | quick-fix | globals.css:197 | **`sf-mono` class name is misleading.** It sets `font-family: var(--font-sans)` (Electrolize) with uppercase + letter-spacing. The name suggests monospace but the font is the sans-serif body font. | Rename to `sf-label` or `sf-caps` to better describe its purpose (uppercase label styling). | 1 |
| 24 | nit | quick-fix | hero.tsx:82 | **Magic number `14px` for trademark symbol.** `text-[14px]` is used for the trademark superscript, not on the type scale. | Use `text-sm` or accept as a one-off decorative element. | 1 |
| 25 | nit | quick-fix | hero.tsx:112, code-section.tsx:23, api-explorer.tsx:94,284 | **Repeated `text-[10px]` and `text-[11px]` caption pattern.** At least 30 instances across files use `text-[10px]` or `text-[11px]` with `uppercase tracking-[0.15em]` or `tracking-[0.2em]` for captions/labels. This is a de facto style but is not formalized. | Define `sf-caption-sm` (10px) and `sf-caption` (11px) utility classes in globals.css to formalize this pattern and make future changes single-point. | 2 |
| 26 | nit | quick-fix | nav.tsx:284 | **Dark mode toggle shows scrambled "DARK" text but the label next to the toggle always shows plain "DARK".** `darkText` scramble result is computed but never used -- the right-side label is hardcoded as `DARK`. | Either use `{darkText}` for the right label (matching the scramble pattern of `{lightText}` on the left), or remove the unused `darkText` variable. | 1 |
| 27 | nit | quick-fix | components-explorer.tsx:112 | **`PreviewBadge` uses hardcoded `text-white` for badge text.** This is a preview component, but it still bypasses the token system. | Use `text-primary-foreground` or pass foreground color as a prop. | 1 |

---

## Pattern Analysis

### Token Adherence Breakdown

| Category | Token Usage | Hardcoded | Adherence |
|----------|------------|-----------|-----------|
| Colors (semantic) | High -- most text/bg use Tailwind semantic classes | 12+ raw OKLCH values, 3+ rgba(), 4+ `white`/`black` | ~80% |
| Typography (fonts) | Low -- `sf-display` exists but inline `fontFamily` dominates | 15+ inline style overrides | ~30% |
| Spacing | High -- clamp patterns are consistent | Minor one-offs | ~90% |
| Motion | Medium -- utility classes use tokens | JSX style + keyframes bypass tokens | ~60% |
| Borders | Low -- no formal width scale | 2px, 3px, 4px used without system | ~40% |
| Z-index | None -- no token scale exists | 5 different arbitrary values | 0% |
| Radius | Perfect -- all 0px as intended | None | 100% |

### Strongest Patterns
- OKLCH color space commitment is excellent across the token definitions
- `clamp()` usage for responsive sizing is remarkably consistent
- Utility classes (`sf-pressable`, `sf-hoverable`, `sf-link-draw`, `sf-grain`) are well-defined
- Reduced motion support is thorough
- Dark mode token overrides in `.dark` are complete

### Weakest Patterns
- Font family application (inline styles everywhere instead of utility classes)
- Z-index layering (no system at all)
- Border width standardization (three different widths with no tokens)
- Code block component duplication across pages
- Raw OKLCH values in keyframes and cursor styles

---

## Recommended Priority Order

1. **Z-index token scale** (Finding #6) -- Quick win, prevents future stacking bugs
2. **Primary color hardcoding** (Findings #1, #2, #3) -- Systemic token bypass, highest risk
3. **Font family inline cleanup** (Finding #4) -- 15 instances, biggest code reduction
4. **Border width tokens** (Finding #7) -- Documents existing intent, prevents drift
5. **CodeBlock extraction** (Finding #10) -- Reduces duplication, single source of truth
6. **Caption class formalization** (Finding #25) -- 30+ instances consolidated to 2 utility classes

---

*Generated by PDE Critique | Focus: Consistency | 2026-04-01*
