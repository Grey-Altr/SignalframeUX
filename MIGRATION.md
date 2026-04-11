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
