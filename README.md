# SIGNALFRAME//UX

High-performance design system. Dual-layer SIGNAL/FRAME model. Zero border-radius. OKLCH color space. Enhanced flat design.

## INSTALL

```sh
npm install signalframeux
```

## QUICK START

```tsx
import { SFButton } from "signalframeux"
import "signalframeux/signalframeux.css"

export default function Page() {
  return <SFButton intent="primary">LAUNCH</SFButton>
}
```

## SIGNAL / FRAME MODEL

Two orthogonal layers. Both required. Neither optional.

**FRAME** — deterministic, legible, semantic, consistent. The structural layer. Enforces layout tokens, spacing stops, and typographic hierarchy. Always readable.

**SIGNAL** — generative, parametric, animated, data-driven. The expressive layer. GSAP motion, WebGL canvas, scramble text, real-time reactivity. Must not interfere with usability.

Intellectual lineage: Shannon's signal/noise, Goffman's frame analysis, Wiener's cybernetics, architectural framing, music production signal chains, grid/gesture duality in design theory.

Rule: FRAME stability is non-negotiable. SIGNAL intensity is controlled. The tension between legibility and expression is the design.

## TOKEN SYSTEM

Import the token CSS at your app entry point:

```tsx
import "signalframeux/signalframeux.css"
```

Provides all CSS custom properties as `--sf-*` namespaced variables. Requires Tailwind CSS v4.

**Token categories:**

| Category   | Description                                                                 |
|------------|-----------------------------------------------------------------------------|
| Colors     | Core 5 (background, foreground, primary, secondary, accent) + extended. All OKLCH. |
| Spacing    | 9 blessed stops from 4px base: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96   |
| Typography | Scale `--text-2xs` (9px) to `--text-4xl` (80px), minor third 1.2. Semantic aliases: heading-1 → 3xl+Anton, body → base+Inter |
| Animation  | Durations: `--duration-instant` (34ms) to `--duration-glacial` (600ms). Easings: `--ease-default`, `--ease-hover`, `--ease-spring` |
| Layout     | `--max-w-content`, `--max-w-wide`, `--max-w-full`. Standard gutters and column counts. |

DO NOT expand the palette. DO NOT use arbitrary spacing values.

## ENTRY POINTS

| Import | Peer deps | Contents |
|--------|-----------|----------|
| `signalframeux` | react >=19, react-dom >=19 | 45+ SF components (SFButton, SFCard, SFContainer, SFGrid, SFText, etc.), hooks, utilities (cn, toggleTheme), config provider |
| `signalframeux/animation` | + gsap >=3.12, @gsap/react >=2.0 | SFAccordion, SFProgress, SFStepper, SFEmptyState, SFToaster, GSAP utilities and hooks |
| `signalframeux/webgl` | + three >=0.183 | SignalCanvas, useSignalScene, resolveColorToken |
| `signalframeux/signalframeux.css` | tailwindcss >=4.0 | Design tokens, CSS custom properties |

All peer dependencies are optional except `react` and `react-dom`. Install only what your entry points require.

See [MIGRATION.md](MIGRATION.md) for upgrade guide.
