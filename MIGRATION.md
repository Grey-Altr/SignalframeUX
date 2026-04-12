# MIGRATION GUIDE

Migrating from internal SFUX app usage to the published `signalframeux` npm package.

## IMPORT PATH CHANGES

Named exports are identical. Only the import source changes.

| Old (internal app path) | New (npm package) |
|-------------------------|-------------------|
| `@/components/sf/sf-button` | `signalframeux` |
| `@/components/sf/sf-card` | `signalframeux` |
| `@/components/sf/sf-container` | `signalframeux` |
| `@/components/sf/sf-section` | `signalframeux` |
| `@/components/sf/sf-stack` | `signalframeux` |
| `@/components/sf/sf-grid` | `signalframeux` |
| `@/components/sf/sf-text` | `signalframeux` |
| `@/components/sf/sf-input` | `signalframeux` |
| `@/components/sf/sf-badge` | `signalframeux` |
| `@/components/sf/sf-tabs` | `signalframeux` |
| `@/components/sf/sf-table` | `signalframeux` |
| `@/components/sf/sf-dialog` | `signalframeux` |
| `@/components/sf/sf-sheet` | `signalframeux` |
| `@/components/sf/sf-dropdown-menu` | `signalframeux` |
| `@/components/sf/sf-popover` | `signalframeux` |
| `@/components/sf/sf-select` | `signalframeux` |
| `@/components/sf/sf-checkbox` | `signalframeux` |
| `@/components/sf/sf-radio-group` | `signalframeux` |
| `@/components/sf/sf-switch` | `signalframeux` |
| `@/components/sf/sf-alert` | `signalframeux` |
| `@/components/sf/sf-alert-dialog` | `signalframeux` |
| `@/components/sf/sf-avatar` | `signalframeux` |
| `@/components/sf/sf-breadcrumb` | `signalframeux` |
| `@/components/sf/sf-navigation-menu` | `signalframeux` |
| `@/components/sf/sf-pagination` | `signalframeux` |
| `@/components/sf/sf-command` | `signalframeux` |
| `@/components/sf/sf-input-group` | `signalframeux` |
| `@/components/sf/sf-input-otp` | `signalframeux` |
| `@/components/sf/sf-hover-card` | `signalframeux` |
| `@/components/sf/sf-separator` | `signalframeux` |
| `@/components/sf/sf-skeleton` | `signalframeux` |
| `@/components/sf/sf-tooltip` | `signalframeux` |
| `@/components/sf/sf-scroll-area` | `signalframeux` |
| `@/components/sf/sf-label` | `signalframeux` |
| `@/components/sf/sf-toggle` | `signalframeux` |
| `@/components/sf/sf-toggle-group` | `signalframeux` |
| `@/components/sf/sf-slider` | `signalframeux` |
| `@/components/sf/sf-collapsible` | `signalframeux` |
| `@/lib/signalframe-provider` | `signalframeux` |
| `@/lib/utils` (cn) | `signalframeux` |
| `@/lib/theme` (toggleTheme) | `signalframeux` |
| `@/lib/grain` (GRAIN_SVG) | `signalframeux` |
| `@/hooks/use-scramble-text` | `signalframeux` |
| `@/hooks/use-session-state` | `signalframeux` |
| `@/components/sf/sf-accordion` | `signalframeux/animation` |
| `@/components/sf/sf-progress` | `signalframeux/animation` |
| `@/components/sf/sf-status-dot` | `signalframeux/animation` |
| `@/components/sf/sf-toast` | `signalframeux/animation` |
| `@/components/sf/sf-stepper` | `signalframeux/animation` |
| `@/components/sf/sf-empty-state` | `signalframeux/animation` |
| `@/hooks/use-nav-reveal` | `signalframeux/animation` |
| `@/lib/gsap-core` | `signalframeux/animation` |
| `@/lib/gsap-easings` | `signalframeux/animation` |
| `@/lib/gsap-plugins` | `signalframeux/animation` |
| `@/lib/gsap-draw` | `signalframeux/animation` |
| `@/lib/gsap-flip` | `signalframeux/animation` |
| `@/lib/gsap-split` | `signalframeux/animation` |
| `@/lib/signal-canvas` | `signalframeux/webgl` |
| `@/hooks/use-signal-scene` | `signalframeux/webgl` |
| `@/lib/color-resolve` | `signalframeux/webgl` |
| `@/app/globals.css` (tokens) | `signalframeux/signalframeux.css` |

## PEER DEPENDENCIES

```sh
# Core (required)
npm install signalframeux react@>=19 react-dom@>=19

# Animation entry point (optional)
npm install gsap@>=3.12 @gsap/react@>=2.0

# WebGL entry point (optional)
npm install three@>=0.183

# Token CSS (optional, recommended)
# requires Tailwind CSS v4 in your project
npm install tailwindcss@>=4.0
```

## TOKEN CSS SETUP

Import the token CSS at your app entry point (e.g., `layout.tsx` or `_app.tsx`):

```tsx
import "signalframeux/signalframeux.css"
```

Provides all CSS custom properties: colors (OKLCH), spacing stops, typography scale, animation durations and easings, layout max-widths. Requires Tailwind CSS v4.

For Tailwind v4 integration, add to your CSS:

```css
@import "signalframeux/signalframeux.css";
```

## COMPONENT API CHANGES

None. All SF component props, CVA `intent` variants, and behavior are identical to the internal app versions. Only the import source changes.

Type exports (`TextVariant`, `SignalframeUXConfig`, `UseSignalframeReturn`, `SFStatusDotStatus`) are available from the same entry point as their parent module.

## NOTES

- `@sfux/*` namespace imports seen in older documentation never existed as published packages. Use `signalframeux` directly.
- Animation components with transitive GSAP dependencies (`SFAccordion`, `SFProgress`, `SFStepper`, `SFEmptyState`) are in `signalframeux/animation`, not core. This prevents GSAP from entering bundles that don't need it.
- `SFEmptyState` and `SFStepper` were in the internal `sf/` barrel but moved to the animation entry due to transitive GSAP dependencies. Import from `signalframeux/animation`.

---

## TOKEN NAMESPACE MIGRATION (--color-\* → --sfx-\*)

As of v1.7, all SignalframeUX CSS custom properties use the `--sfx-*` namespace. This prevents collisions when SF//UX tokens are consumed alongside other design systems or frameworks.

**Tailwind utility classes are unchanged.** `bg-primary`, `text-foreground`, `border-accent`, etc. continue to work via `@theme inline` aliases that map `--color-*` → `var(--sfx-*)` at compile time.

**What changed:** the authoritative token values live under `--sfx-*` in `:root`. Any JS/TS code that reads or writes tokens via `getPropertyValue()` or `setProperty()` must use the `--sfx-*` name.

### Full Rename Table

| Old Name | New Name |
|----------|----------|
| `--color-background` | `--sfx-background` |
| `--color-foreground` | `--sfx-foreground` |
| `--color-primary` | `--sfx-primary` |
| `--color-primary-foreground` | `--sfx-primary-foreground` |
| `--color-secondary` | `--sfx-secondary` |
| `--color-secondary-foreground` | `--sfx-secondary-foreground` |
| `--color-accent` | `--sfx-accent` |
| `--color-accent-foreground` | `--sfx-accent-foreground` |
| `--color-muted` | `--sfx-muted` |
| `--color-muted-foreground` | `--sfx-muted-foreground` |
| `--color-card` | `--sfx-card` |
| `--color-card-foreground` | `--sfx-card-foreground` |
| `--color-popover` | `--sfx-popover` |
| `--color-popover-foreground` | `--sfx-popover-foreground` |
| `--color-destructive` | `--sfx-destructive` |
| `--color-success` | `--sfx-success` |
| `--color-warning` | `--sfx-warning` |
| `--color-border` | `--sfx-border` |
| `--color-input` | `--sfx-input` |
| `--color-ring` | `--sfx-ring` |
| `--color-chart-1` through `--color-chart-5` | `--sfx-chart-1` through `--sfx-chart-5` |
| `--color-sidebar` | `--sfx-sidebar` |
| `--color-sidebar-foreground` | `--sfx-sidebar-foreground` |
| `--color-sidebar-primary` | `--sfx-sidebar-primary` |
| `--color-sidebar-primary-foreground` | `--sfx-sidebar-primary-foreground` |
| `--color-sidebar-accent` | `--sfx-sidebar-accent` |
| `--color-sidebar-accent-foreground` | `--sfx-sidebar-accent-foreground` |
| `--color-sidebar-border` | `--sfx-sidebar-border` |
| `--color-sidebar-ring` | `--sfx-sidebar-ring` |
| `--sf-grain-opacity` | `--sfx-grain-opacity` |
| `--sf-yellow` | `--sfx-yellow` |
| `--sf-green` | `--sfx-green` |
| `--sf-clock` | `--sfx-clock` |
| `--sf-tracking-label` | `--sfx-tracking-label` |
| `--signal-intensity` | `--sfx-signal-intensity` |
| `--signal-speed` | `--sfx-signal-speed` |
| `--signal-accent` | `--sfx-signal-accent` |
| `--duration-instant` | `--sfx-duration-instant` |
| `--duration-fast` | `--sfx-duration-fast` |
| `--duration-normal` | `--sfx-duration-normal` |
| `--duration-slow` | `--sfx-duration-slow` |
| `--duration-glacial` | `--sfx-duration-glacial` |
| `--ease-default` | `--sfx-ease-default` |
| `--ease-hover` | `--sfx-ease-hover` |
| `--ease-spring` | `--sfx-ease-spring` |
| `--text-2xs` through `--text-4xl` | `--sfx-text-2xs` through `--sfx-text-4xl` |
| `--space-1` through `--space-24` | `--sfx-space-1` through `--sfx-space-24` |
| `--max-w-content` | `--sfx-max-w-content` |
| `--max-w-wide` | `--sfx-max-w-wide` |
| `--max-w-full` | `--sfx-max-w-full` |
| `--z-content` through `--z-vhs` | `--sfx-z-content` through `--sfx-z-vhs` |

### JS/TS Code Migration

Before:
```ts
const raw = getComputedStyle(document.documentElement)
  .getPropertyValue("--color-primary");
document.documentElement.style.setProperty("--signal-intensity", "0.8");
```

After:
```ts
const raw = getComputedStyle(document.documentElement)
  .getPropertyValue("--sfx-primary");
document.documentElement.style.setProperty("--sfx-signal-intensity", "0.8");
```

---

## CONSUMER CSS INTEGRATION

SignalframeUX ships its token CSS wrapped in `@layer signalframeux { }`. This means any unlayered CSS you write automatically wins — no `!important` needed.

### Import Pattern

```css
/* Your app's CSS entry point */
@import "signalframeux/signalframeux.css";  /* layered defaults */
@import "./your-tokens.css";                /* unlayered overrides — always wins */
```

The `@layer` cascade rule: unlayered CSS > layered CSS. Since `signalframeux.css` wraps all `:root` and `.dark` token declarations inside `@layer signalframeux { }`, your unlayered `:root { --sfx-primary: ... }` declaration always takes precedence.

### Consumer Override Example

**Before** (without overrides): SF//UX ships magenta primary (`oklch(0.65 0.3 350)`), dark-mode default.

**After** (with `cd-tokens.css`): CD site replaces magenta with achromatic white (`oklch(0.96 0 0)`), deeper background (`oklch(0.08 0 0)`), Geist font stack.

No SSR flash because the override CSS is loaded synchronously in the CSS import chain — the browser resolves the final `--sfx-*` values before first paint.

---

## CD SITE INTEGRATION EXAMPLE

The included `cd-tokens.css` demonstrates the consumer override pattern for the Culture Division site:

1. **Import order** in CD's CSS entry:
   ```css
   @import "signalframeux/signalframeux.css";
   @import "./cd-tokens.css";
   ```

2. **What it overrides:**
   - `--sfx-primary`: magenta → achromatic white (`oklch(0.96 0 0)`)
   - `--sfx-background`: neutral → deep black (`oklch(0.08 0 0)`)
   - `--sfx-font-sans/mono/heading/display`: Inter/JetBrains Mono → Geist/Geist Mono
   - All extended palette tokens → achromatic values

3. **Server-rendered dark mode:** Add `class="dark"` to `<html>` in `layout.tsx`. The `.dark` selector in `signalframeux.css` activates dark-mode token values. CD's `cd-tokens.css` overrides these at `:root` level since CD is always dark.

4. **No runtime cost:** Pure CSS cascade — zero JavaScript involved in the override.

---

## FONT TOKEN STRUCTURE

SignalframeUX provides four semantic font tokens designed for future typeface swaps:

| Token | Default (SF//UX) | CD Override |
|-------|-------------------|-------------|
| `--sfx-font-sans` | Inter | Geist |
| `--sfx-font-mono` | JetBrains Mono | Geist Mono |
| `--sfx-font-heading` | Inter | Geist |
| `--sfx-font-display` | Anton | Geist |

To swap typefaces, override these four tokens in your consumer CSS. The structure is stable — only the font-family values change. Components reference these tokens via the `@theme inline` aliases (`--font-sans`, `--font-mono`, etc.).
