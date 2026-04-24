# MIGRATION GUIDE

Migrating from internal SFUX app usage to the published `signalframeux` npm package.

## IMPORT PATH CHANGES

Named exports are identical. Only the import source changes.

**Rule:** every `@/components/sf/*`, `@/hooks/*`, and `@/lib/*` path collapses to one of three entry points based on its dependency surface:

| Internal path pattern | Package entry |
|-----------------------|---------------|
| Most SF components + hooks + `cn` / `toggleTheme` / `GRAIN_SVG` / `use-scramble-text` / `use-session-state` / `signalframe-provider` | `signalframeux` |
| Components with transitive GSAP (`SFAccordion`, `SFProgress`, `SFStatusDot`, `SFToast`, `SFStepper`, `SFEmptyState`), plus `use-nav-reveal` and every `lib/gsap-*` module | `signalframeux/animation` |
| WebGL surface: `signal-canvas`, `use-signal-scene`, `color-resolve` | `signalframeux/webgl` |
| Design tokens: `@/app/globals.css` | `signalframeux/signalframeux.css` |

If you're unsure which entry owns a symbol, import from `signalframeux` first — a TypeScript error will point you at the right subpath.

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

### Rename Rule

Every authoritative token moved into a single `--sfx-*` namespace. The renames follow two mechanical patterns:

- Any `--color-*` token → `--sfx-*` (drops the `color-` segment).
  Covers the full semantic palette (`background`, `foreground`, `primary[-foreground]`, `secondary[-foreground]`, `accent[-foreground]`, `muted[-foreground]`, `card[-foreground]`, `popover[-foreground]`, `destructive`, `success`, `warning`, `border`, `input`, `ring`, `chart-1` … `chart-5`, `sidebar[-foreground|-primary|-accent|-border|-ring]`).
- Any unprefixed or legacy-`--sf-*` design-system token → `--sfx-*` (prepends `sfx-`).
  Covers animation (`duration-*`, `ease-*`), typography (`text-2xs` … `text-4xl`), spacing (`space-1` … `space-24`), layout (`max-w-content|wide|full`), z-index (`z-content` … `z-vhs`), signal (`signal-intensity|speed|accent`), and legacy chrome (`sf-grain-opacity`, `sf-yellow`, `sf-green`, `sf-clock`, `sf-tracking-label`).

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
