# Phase 46: Tightening Pass - Research

**Researched:** 2026-04-11
**Domain:** CSS token consistency, WCAG contrast, animation duration normalization
**Confidence:** HIGH

## Summary

Phase 46 is a codebase hygiene pass with four discrete requirements: (1) verify/fix light-mode muted-foreground contrast, (2) replace 15 hardcoded animation durations with token references, (3) replace 7 hardcoded color values with CSS custom property references, and (4) align sf-button hover duration from `--sfx-duration-normal` to `--sfx-duration-fast`.

All four requirements are surgical find-and-replace operations with clear targets identified in this research. The codebase grep reveals exact files and line numbers for every change. No architectural decisions are needed -- this is pure token normalization.

**Primary recommendation:** Execute as a single plan with four task groups matching the four requirements. Each task is a targeted edit with a verification grep to confirm no remaining hardcoded values.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| TGH-01 | Light mode --muted-foreground on bg-muted passes WCAG AA (>= 4.5:1 contrast ratio) | Current values already compute to 5.81:1 (PASSES AA). Verification task only -- no color change needed. See Contrast Analysis section. |
| TGH-02 | All 15 hardcoded animation durations replaced with --sfx-duration-* token references | 15 specific locations identified across components/blocks/, components/layout/, and components/sf/. Full file+line inventory below. |
| TGH-03 | All 7 hardcoded color values in component/page code replaced with CSS custom property references | 7 locations identified: 2 in shared-code-block/copy-button (#999999, #000000), 1 in init/page (#999999), 1 in component-detail (oklch hardcoded bg), plus 3 contextual. Full inventory below. |
| TGH-04 | sf-button hover duration aligned with other SF components (--sfx-duration-fast not --sfx-duration-normal) | Single edit in sf-button.tsx line 6: change `--duration-normal` to `--sfx-duration-fast`. All other SF components already use `--sfx-duration-fast`. |
</phase_requirements>

## Token Naming: Critical Discovery

**The codebase has a naming inconsistency.** Duration and easing tokens are defined as `--sfx-duration-*` and `--sfx-ease-*` in globals.css `:root`, but components reference them as `--duration-*` and `--ease-*` (without the `--sfx-` prefix). Unlike color tokens, there are NO `@theme inline` aliases mapping `--duration-*` to `--sfx-duration-*`.

**Current state of references in components:**
- SF components use: `var(--duration-fast)`, `var(--duration-normal)`, `var(--ease-default)` 
- Defined tokens are: `--sfx-duration-fast`, `--sfx-duration-normal`, `--sfx-ease-default`
- No alias layer exists for motion tokens

**This means the `var(--duration-*)` references are currently resolving to nothing** (or browser default). TGH-02 should update ALL references to use the `--sfx-duration-*` prefix, which is the actual defined token name.

**Confidence:** HIGH -- verified by grepping both the token definitions and the references.

## TGH-01: Contrast Analysis

### Current Values (Light Mode :root)
| Token | Value | Hex Equivalent |
|-------|-------|----------------|
| `--sfx-muted` (bg) | `oklch(0.930 0.005 298)` | #e8e7ea |
| `--sfx-muted-foreground` (text) | `oklch(0.460 0.010 298)` | #58565d |

### Calculated Contrast
- **Relative luminance (bg):** 0.8034
- **Relative luminance (fg):** 0.0969
- **Contrast ratio:** 5.81:1
- **WCAG AA minimum:** 4.5:1
- **Result: PASSES AA**

The existing code comment at globals.css line 612 ("the light-mode --sfx-muted-foreground (#58575d) fails WCAG AA") describes a different context: muted-foreground on `[data-bg-shift="black"]` dark backgrounds, which has already been fixed with the override at line 620.

**Recommendation:** TGH-01 is a verification-only task. Add a code comment confirming the 5.81:1 ratio passes AA. No color change needed.

## TGH-02: Hardcoded Animation Durations Inventory

### Category A: Tailwind `duration-[34ms]` (hardcoded instant -- should use token)
These use `duration-[34ms]` directly instead of `duration-[var(--sfx-duration-instant)]`:

| # | File | Line | Current | Replace With |
|---|------|------|---------|--------------|
| 1 | `components/blocks/acquisition-section.tsx` | 57 | `duration-[34ms]` | `duration-[var(--sfx-duration-instant)]` |
| 2 | `components/blocks/acquisition-section.tsx` | 63 | `duration-[34ms]` | `duration-[var(--sfx-duration-instant)]` |
| 3 | `components/blocks/acquisition-copy-button.tsx` | 45 | `duration-[34ms]` | `duration-[var(--sfx-duration-instant)]` |
| 4 | `components/blocks/inventory-section.tsx` | 138 | `duration-[34ms]` | `duration-[var(--sfx-duration-instant)]` |
| 5 | `components/blocks/inventory-section.tsx` | 180 | `duration-[34ms]` | `duration-[var(--sfx-duration-instant)]` |
| 6 | `components/blocks/components-explorer.tsx` | 770 | `duration-[34ms]` | `duration-[var(--sfx-duration-instant)]` |
| 7 | `components/blocks/components-explorer.tsx` | 790 | `duration-[34ms]` | `duration-[var(--sfx-duration-instant)]` |

### Category B: Tailwind `duration-NNN` (numeric -- should use token var)
These use Tailwind's built-in duration utilities instead of token references:

| # | File | Line | Current | Replace With |
|---|------|------|---------|--------------|
| 8 | `components/layout/copy-button.tsx` | 40 | `duration-150` | `duration-[var(--sfx-duration-normal)]` (200ms closest) |
| 9 | `components/layout/back-to-top.tsx` | 41 | `duration-200` | `duration-[var(--sfx-duration-normal)]` |
| 10 | `components/layout/global-effects.tsx` | 155 | `duration-200` | `duration-[var(--sfx-duration-normal)]` |
| 11 | `components/blocks/component-grid.tsx` | 308 | `duration-150` | `duration-[var(--sfx-duration-fast)]` (100ms closest) |
| 12 | `components/blocks/component-grid.tsx` | 316 | `duration-200` | `duration-[var(--sfx-duration-normal)]` |
| 13 | `components/blocks/components-explorer.tsx` | 532 | `duration-200` | `duration-[var(--sfx-duration-normal)]` |
| 14 | `components/blocks/components-explorer.tsx` | 852 | `duration-100` | `duration-[var(--sfx-duration-fast)]` |
| 15 | `components/blocks/components-explorer.tsx` | 875 | `duration-150` | `duration-[var(--sfx-duration-fast)]` |

### Category C: Existing token var references that need prefix fix
These already use `var(--duration-*)` but reference the WRONG variable name (missing `--sfx-` prefix):

| # | File | Line | Current | Replace With |
|---|------|------|---------|--------------|
| - | `components/sf/sf-button.tsx` | 6 | `var(--duration-normal)` | `var(--sfx-duration-fast)` (TGH-04) |
| - | `components/sf/sf-card.tsx` | 41 | `var(--duration-fast)` | `var(--sfx-duration-fast)` |
| - | `components/sf/sf-tabs.tsx` | 63 | `var(--duration-fast)` | `var(--sfx-duration-fast)` |
| - | `components/sf/sf-toggle.tsx` | 8 | `var(--duration-fast)` | `var(--sfx-duration-fast)` |
| - | `components/sf/sf-toggle-group.tsx` | 35 | `var(--duration-fast)` | `var(--sfx-duration-fast)` |
| - | `components/sf/sf-navigation-menu.tsx` | 113 | `var(--duration-fast)` | `var(--sfx-duration-fast)` |
| - | `components/sf/sf-table.tsx` | 88 | `var(--duration-fast)` | `var(--sfx-duration-fast)` |
| - | `components/sf/sf-button.tsx` | 6 | `var(--ease-default)` | `var(--sfx-ease-default)` |
| - | `components/animation/signal-overlay.tsx` | 177, 206, 263 | `var(--duration-fast,67ms)` | `var(--sfx-duration-fast)` |
| - | `components/layout/global-effects.tsx` | 161 | `var(--duration-normal)`, `var(--duration-fast)`, `var(--ease-default)` | `var(--sfx-duration-normal)`, `var(--sfx-duration-fast)`, `var(--sfx-ease-default)` |
| - | `components/animation/hover-preview.tsx` | 75 | `var(--ease-default)` | `var(--sfx-ease-default)` |
| - | `components/animation/xray-reveal.tsx` | 72 | `var(--ease-default)` | `var(--sfx-ease-default)` |
| - | `components/layout/nav-overlay.tsx` | 90 | `var(--ease-default)` | `var(--sfx-ease-default)` |
| - | `components/animation/border-draw.tsx` | 44, 57, 70, 83 | `var(--ease-default)` | `var(--sfx-ease-default)` |

**Note:** Category C items are not counted in the "15 hardcoded durations" but MUST be fixed as part of this phase. The unprefixed `var(--duration-*)` references resolve to nothing since no `--duration-*` custom properties exist. This is a latent bug.

### Files NOT in scope (legitimate hardcoded durations)
- **globals.css animations** (`@keyframes`, animation shorthand): These ARE the token source of truth or CSS-only animation definitions -- not component code.
- **GSAP `duration:` in JS**: GSAP doesn't read CSS vars natively. These are animation-specific JS values, not CSS transition durations.
- **`components/ui/` (shadcn base)**: Per project rules, don't modify `ui/` files.
- **`components/animation/` inline style transitions**: Complex animation timings (logo-draw, page-transition, dark-mode-toggle, nav-overlay computed transitions) are intentional per-animation choreography, not standardizable to tokens.

## TGH-03: Hardcoded Color Values Inventory

### Component/Page Code (in scope)

| # | File | Line | Current Value | Replace With |
|---|------|------|---------------|--------------|
| 1 | `components/blocks/shared-code-block.tsx` | 23 | `style={{ color: "#999999" }}` | `className="text-muted-foreground"` |
| 2 | `components/layout/copy-button.tsx` | 41 | `style={{ color: "#000000" }}` | `className="text-background"` (or `text-primary-foreground`) |
| 3 | `app/init/page.tsx` | 147 | `style={{ color: "#999999" }}` | `className="text-muted-foreground"` |
| 4 | `components/blocks/component-detail.tsx` | 302 | `bg-[oklch(0.12_0_0)]` | `bg-card` or `bg-[var(--sfx-background)]` (dark code block bg -- use a semantic token) |
| 5 | `components/animation/color-cycle-frame.tsx` | 81 | `"oklch(0.145 0 0)"` fallback + line 52-58 palette | These are JS-computed GSAP animation colors; may need `getComputedStyle` for the cover color |
| 6 | `components/layout/page-animations.tsx` | 457-458 | `"#fff"`, `"oklch(0.145 0 0)"`, `"oklch(0.65 0.3 350)"` | Read from CSS custom properties via `getComputedStyle` |
| 7 | `components/animation/glsl-signal.tsx` | 171 | `oklch(0.145 0 0 / 0.06)` in inline CSS | `var(--sfx-foreground)` with opacity |

### Files NOT in scope (legitimate hardcoded colors)
- **`app/global-error.tsx`**: Error boundary renders outside React -- cannot use CSS custom properties safely.
- **`app/opengraph-image.tsx`** and **`app/icon.tsx`**: OG image generation uses Satori which requires inline styles with literal color values. CSS vars don't work in `ImageResponse`.
- **`components/animation/hero-mesh.tsx`**: Canvas 2D `rgba()` for white dots/lines -- theme-neutral design element.
- **`components/animation/canvas-cursor.tsx`**: Canvas 2D requires computed RGB values.
- **`components/animation/token-viz.tsx`**: Canvas 2D color generation utility.
- **`components/blocks/token-tabs.tsx`**: Shadow specimen display data -- showing literal values as documentation.
- **`components/blocks/token-specimens/color-specimen.tsx`**: Programmatically generating oklch swatches -- legitimate.
- **`components/blocks/component-grid.tsx`** lines 92, 96: Specimen display showing example color values.
- **`components/layout/dark-mode-toggle.tsx`**: White flash overlay for theme transition -- intentional literal white.
- **`components/blocks/code-section.tsx`**: Uses a const `ANNOTATION_ACCENT` -- should verify if this references a token.

## TGH-04: sf-button Hover Duration

### Current State
`components/sf/sf-button.tsx` line 6:
```
duration-[var(--duration-normal)] ease-[var(--ease-default)]
```

This resolves to `--duration-normal` which (a) doesn't exist (missing `--sfx-` prefix) and (b) per TGH-04 should be `--sfx-duration-fast` (100ms) not `--sfx-duration-normal` (200ms).

### Other SF Component Comparison
| Component | Duration Token | Value |
|-----------|---------------|-------|
| sf-card | `var(--duration-fast)` | 100ms |
| sf-tabs | `var(--duration-fast)` | 100ms |
| sf-toggle | `var(--duration-fast)` | 100ms |
| sf-toggle-group | `var(--duration-fast)` | 100ms |
| sf-navigation-menu | `var(--duration-fast)` | 100ms |
| sf-table | `var(--duration-fast)` | 100ms |
| **sf-button** | **`var(--duration-normal)`** | **200ms** |

**Every other SF component uses `--duration-fast`.** sf-button is the only outlier.

### Fix
Change sf-button.tsx line 6 to:
```
duration-[var(--sfx-duration-fast)] ease-[var(--sfx-ease-default)]
```

This simultaneously fixes TGH-04 (fast not normal) and the prefix bug (--sfx- prefix).

### JSDoc Update
The JSDoc comment at line 41 says "asymmetric hover timing (100ms in / 400ms out)". After this change the CSS transition will be 100ms for color. The asymmetric timing (100ms in / 400ms out) is actually handled by `.sf-pressable` in globals.css, not by the `duration-[]` utility. Verify that the JSDoc remains accurate.

## Architecture Patterns

### Token Reference Pattern
All CSS transition durations in component code should use:
```
duration-[var(--sfx-duration-fast)]    // 100ms
duration-[var(--sfx-duration-normal)]  // 200ms  
duration-[var(--sfx-duration-instant)] // 34ms
```

All inline style transitions should use:
```typescript
transition: `property var(--sfx-duration-fast) var(--sfx-ease-default)`
```

### Color Reference Pattern
Replace hardcoded hex/oklch in style props with:
```tsx
// BAD
style={{ color: "#999999" }}

// GOOD
className="text-muted-foreground"
```

For JS-computed colors that need the actual value:
```typescript
const color = getComputedStyle(document.documentElement)
  .getPropertyValue("--sfx-primary").trim();
```

## Common Pitfalls

### Pitfall 1: signal-overlay.tsx Fallback Values
**What goes wrong:** The signal-overlay uses `var(--duration-fast,67ms)` with a 67ms fallback. After fixing to `var(--sfx-duration-fast)` which resolves to 100ms, the behavior changes from 67ms to 100ms.
**How to avoid:** This is intentional -- 100ms is the correct system value. Remove the fallback entirely since `--sfx-duration-fast` is always defined in `:root`.

### Pitfall 2: Canvas 2D and Satori Cannot Use CSS Custom Properties
**What goes wrong:** Trying to replace hardcoded colors in Canvas 2D contexts or OG image generation.
**How to avoid:** Leave `hero-mesh.tsx`, `canvas-cursor.tsx`, `token-viz.tsx`, `opengraph-image.tsx`, `icon.tsx`, and `global-error.tsx` as-is.

### Pitfall 3: GSAP Duration Values Are JS, Not CSS
**What goes wrong:** Trying to make GSAP's `duration: 0.2` read from CSS custom properties.
**How to avoid:** GSAP durations in JS are animation choreography values, not CSS transitions. They don't need tokenization unless they represent a standard system timing (like the 34ms instant). Leave GSAP JS durations alone.

### Pitfall 4: shadcn ui/ Files Must Not Be Modified
**What goes wrong:** Editing `components/ui/dropdown-menu.tsx` etc. to replace `duration-100` or `duration-200`.
**How to avoid:** Per project rules, `components/ui/` base shadcn files are not modified. Only `components/sf/`, `components/blocks/`, `components/animation/`, and `components/layout/` are in scope.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| WCAG contrast checking | Manual hex math | Browser devtools or `python3` calculation | Edge cases with oklch gamut mapping |
| Token linting | Custom eslint rule | Grep verification after changes | One-time cleanup, not recurring |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.x + Playwright |
| Config file | `vitest.config.ts`, `playwright.config.ts` |
| Quick run command | `pnpm vitest run --reporter=verbose` |
| Full suite command | `pnpm test && pnpm exec playwright test` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TGH-01 | Muted-foreground contrast >= 4.5:1 on bg-muted | manual-only | Calculation-based verification (oklch math) | N/A |
| TGH-02 | No hardcoded duration values in component code | smoke | `grep -rn 'duration-\[34ms\]\|duration-100\|duration-150\|duration-200\|duration-300' components/ --include='*.tsx'` | N/A |
| TGH-03 | No hardcoded color hex/oklch in component code | smoke | `grep -rn 'style=.*color.*#\|bg-\[oklch' components/blocks/ components/sf/ components/layout/` filtered for in-scope files | N/A |
| TGH-04 | sf-button uses --sfx-duration-fast | unit | `grep 'duration-fast' components/sf/sf-button.tsx` | N/A |

### Sampling Rate
- **Per task commit:** Grep verification for removed hardcoded values
- **Per wave merge:** `pnpm build && pnpm vitest run`
- **Phase gate:** Full build + existing Playwright suite (no visual regressions from token swaps)

### Wave 0 Gaps
None -- this phase is pure find-and-replace with grep verification. No new test infrastructure needed.

## Open Questions

1. **color-cycle-frame.tsx and page-animations.tsx palette arrays**
   - What we know: These contain 7 oklch color values as a JS array for GSAP color cycling animations.
   - What's unclear: Whether these should be read from CSS custom properties via `getComputedStyle` or if they are intentionally hardcoded as a curated accent palette.
   - Recommendation: The palette IS the primary color cycling through alternatives. The base `oklch(0.65 0.3 350)` (magenta) should reference `--sfx-primary`. The cover color `oklch(0.145 0 0)` should reference `--sfx-foreground`. The other palette entries are intentional artistic choices -- leave as hardcoded array but make the base/cover reference tokens.

2. **Token prefix migration scope**
   - What we know: All `var(--duration-*)` and `var(--ease-*)` references are broken (no such custom properties exist).
   - What's unclear: Whether to add `@theme inline` aliases for `--duration-*` -> `--sfx-duration-*` (backward compat) or just fix all references to use `--sfx-` prefix directly.
   - Recommendation: Fix all references to use `--sfx-` prefix directly. Adding aliases would expand the token surface area, which violates the "don't expand" rule.

## Sources

### Primary (HIGH confidence)
- `app/globals.css` lines 121-234 -- token definitions (direct file read)
- `components/sf/sf-button.tsx` -- full file read
- All component files -- grep results for hardcoded values

### Secondary (MEDIUM confidence)
- WCAG contrast calculation via oklch -> linear sRGB -> luminance conversion (mathematical derivation, verified against hex values)

## Metadata

**Confidence breakdown:**
- TGH-01 contrast analysis: HIGH -- mathematical calculation from source values
- TGH-02 duration inventory: HIGH -- comprehensive grep of entire codebase
- TGH-03 color inventory: HIGH -- comprehensive grep with exclusion analysis
- TGH-04 button alignment: HIGH -- direct file read + comparison

**Research date:** 2026-04-11
**Valid until:** 2026-05-11 (stable -- token values don't change frequently)
