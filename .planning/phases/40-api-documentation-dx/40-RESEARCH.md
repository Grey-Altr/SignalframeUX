# Phase 40: API Documentation & DX - Research

**Researched:** 2026-04-10
**Domain:** Storybook 10 + JSDoc audit + auto-generation script + README/MIGRATION authoring
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Storybook**
- D-01: Storybook serves dual purpose — local dev sandbox AND published consumer showcase
- D-02: Tiered story approach — all exported components get a basic story, 10-15 flagship components (layout primitives, interactive components, SIGNAL layer examples) get rich stories with interactive controls, variants, and composition examples
- D-03: Custom branded Storybook theme — dark, zero rounded corners, OKLCH colors from SFUX tokens, monospaced labels. Must reinforce the DU/TDR design system identity.
- D-04: Storybook deployed to Vercel subdomain (e.g. storybook.signalframeux.com) — separate Vercel project, auto-deploys on push

**README**
- D-05: Technical specimen tone — terse, monospaced code blocks, minimal prose, data-dense. Matches the /init page's system initialization aesthetic. No warm/friendly developer guide style.
- D-06: Four required sections: Install + Quick Start (under 10 lines to first component), FRAME/SIGNAL model explainer, Token system overview (import, custom properties, OKLCH rationale), Entry point guide (core vs animation vs webgl, peer dependency requirements)
- D-07: README lives at repo root as `README.md`

**/reference Alignment**
- D-08: Auto-generate `api-docs.ts` from source — build script parses entry files + JSDoc to produce the data layer automatically. Zero drift between exports and documentation.
- D-09: /reference page shows ALL library exports — everything in entry-core + entry-animation + entry-webgl. Complete API surface, nothing hidden.

**Migration Guide**
- D-10: Concise cheat sheet format — single page under 200 lines. Old import -> new import mapping table, peer deps checklist, token CSS setup.
- D-11: Lives at `MIGRATION.md` in repo root — standalone file linked from README

### Claude's Discretion
- Storybook version and addon selection
- Which 10-15 components qualify as "flagship" for rich stories
- Auto-generation script implementation approach (AST parsing, regex, or TypeScript compiler API)
- Storybook directory structure and naming conventions
- JSDoc audit scope — verify existing coverage is complete and accurate vs the export surface

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DOC-01 | All exported SF components have JSDoc with description, props table, and usage example | All 51 SF files already have JSDoc blocks. Audit pass needed: verify `@param`, `@example`, description accuracy vs actual API. Planner task: script checks `/**` presence, human reviews content quality. |
| DOC-02 | README.md covers installation, quick start, token system, and FRAME/SIGNAL model | No README.md exists at repo root. Four sections locked by D-06. Token CSS is at `dist/signalframeux.css` (from `lib/tokens.css`). Entry points are `signalframeux`, `signalframeux/animation`, `signalframeux/webgl`. |
| DOC-03 | Storybook runs locally with stories for all SF-wrapped components | No Storybook installed. Greenfield setup. `@storybook/nextjs-vite` 10.x is the recommended path. Tailwind CSS v4 works via `@tailwindcss/postcss` + importing `app/globals.css` in preview.ts. |
| DOC-04 | `/reference` route reflects actual exported API (not stale internal-only components) | `lib/api-docs.ts` (2203 lines, 107 entries) uses stale `@sfux/components`, `@sfux/core`, `@sfux/signal`, `@sfux/hooks`, `@sfux/tokens` import paths — actual package name is `signalframeux`. D-08 mandates auto-generating from entry files + JSDoc to replace the hand-curated data. |
</phase_requirements>

---

## Summary

Phase 40 is a documentation-artifacts-only phase. No component or build pipeline changes. The work has four parallel streams: JSDoc audit, Storybook greenfield setup, README/MIGRATION authoring, and a build script to auto-generate `lib/api-docs.ts` from the actual export surface.

The audit finding most important for planning: `lib/api-docs.ts` is materially stale. It uses `@sfux/*` import paths (a namespace that never existed in the published package — the real package name is `signalframeux`), and its 107 entries are hand-curated against an older component surface. The auto-generation script (D-08) is the highest-priority deliverable because it feeds the `/reference` route. Everything else flows from accurate data.

Storybook is not installed. The greenfield setup uses Storybook 10.x with the `@storybook/nextjs-vite` framework (Vite-based, recommended over Webpack for Next.js 15). Tailwind CSS v4 works in Storybook by importing `app/globals.css` into `.storybook/preview.ts` — Storybook 10 + `@storybook/nextjs-vite` handles the PostCSS pipeline automatically via the project's existing `postcss.config.mjs`.

**Primary recommendation:** Auto-generate `api-docs.ts` first (Wave 1), then Storybook setup (Wave 2), then README/MIGRATION (Wave 3). /reference alignment is the most complex piece with the most drift risk — generate it from source, never maintain it by hand again.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@storybook/nextjs-vite` | 10.x (current stable) | Storybook framework for Next.js + Vite | Official Storybook recommendation for Next.js; faster than Webpack variant; handles Next.js router stubs, Image, Font automatically |
| `storybook` | 10.x | Core Storybook CLI and essentials | Main package; includes autodocs, controls, actions, backgrounds addons |
| `@storybook/addon-themes` | 10.x | Dark/light theme switcher in toolbar | Required for DU/TDR dark-mode-primary requirement |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@storybook/theming` | 10.x | Custom branded Storybook UI theme | D-03 — brand the manager chrome with SFUX tokens |
| `tsx` | already in stack | Run auto-generation script | Script is TypeScript; `tsx` already present for `scripts/` |
| `typescript` compiler API | built-in | Parse JSDoc + re-export chains | If regex approach proves too fragile for complex re-exports |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@storybook/nextjs-vite` (Vite) | `@storybook/nextjs` (Webpack) | Webpack is slower and adds complexity; Vite handles this stack cleanly; only choose Webpack if custom Webpack config is needed (we have none) |
| TypeScript compiler API for auto-gen | regex parsing of entry files | Regex on entry files is sufficient because the entry files are clean, flat `export { X } from "./path"` patterns with no dynamic re-exports; simpler and faster to implement |
| Hand-maintained `MIGRATION.md` | automated diff tool | Manual is correct here: migration path is well-defined (internal app consumer → npm package consumer), one-time content, under 200 lines |

### Installation

```bash
# Storybook init — interactive, choose "Next.js (Vite)" when prompted
npx storybook@latest init

# Or direct install (skip interactive)
pnpm add -D @storybook/nextjs-vite@latest storybook@latest @storybook/addon-themes @storybook/theming
```

---

## Architecture Patterns

### Recommended Project Structure

```
.storybook/
├── main.ts              # Framework config, addon registration
├── preview.ts           # Global decorators, Tailwind CSS import, dark theme default
└── manager.ts           # Custom SFUX brand theme (D-03)

stories/
├── introduction.mdx     # Welcome page with SFUX identity
├── sf-button.stories.tsx
├── sf-card.stories.tsx
├── ... (one file per exported SF component)
└── flagship/
    ├── sf-accordion.stories.tsx   # Rich stories with full controls
    └── signal-canvas.stories.tsx  # WebGL — static screenshot fallback

scripts/
└── generate-api-docs.ts    # D-08 auto-gen script (new file, existing scripts/ dir)

# Root files
README.md                   # D-07 (new)
MIGRATION.md                # D-11 (new)
```

### Pattern 1: Storybook main.ts for Next.js + Vite

**What:** Framework configuration wiring Storybook 10 to the Next.js project with Tailwind CSS v4 support
**When to use:** Greenfield — write this first

```typescript
// .storybook/main.ts
// Source: https://storybook.js.org/docs/get-started/frameworks/nextjs-vite
import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(ts|tsx)", "../stories/**/*.mdx"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-themes",
  ],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
};

export default config;
```

### Pattern 2: preview.ts — Tailwind CSS v4 + dark default

**What:** Import `app/globals.css` so all SFUX tokens and Tailwind utilities apply to stories
**When to use:** Required for any styled story to render correctly

```typescript
// .storybook/preview.ts
import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import "../app/globals.css";

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: {
        dark: "dark",
        light: "",
      },
      defaultTheme: "dark",
    }),
  ],
  parameters: {
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "oklch(0.145 0 0)" },
        { name: "light", value: "oklch(1 0 0)" },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /date$/i,
      },
    },
  },
};

export default preview;
```

### Pattern 3: Custom SFUX brand theme (D-03)

**What:** Brand the Storybook manager chrome with SFUX identity — dark background, OKLCH magenta accent, JetBrains Mono
**When to use:** D-03 is locked — must be implemented

```typescript
// .storybook/manager.ts
import { addons } from "storybook/manager-api";
import { create } from "@storybook/theming/create";

const sfuxTheme = create({
  base: "dark",
  brandTitle: "SIGNALFRAME//UX",
  brandUrl: "https://signalframe.culturedivision.com",
  fontBase: "Inter, sans-serif",
  fontCode: "'JetBrains Mono', monospace",
  // OKLCH colors from globals.css — converted to hex for Storybook compat
  // oklch(0.145 0 0) ≈ #1a1a1a
  appBg: "#1a1a1a",
  appContentBg: "#0a0a0a",
  appBorderColor: "#1a1a1a",
  appBorderRadius: 0,           // Zero border-radius — DU/TDR hard edges
  // oklch(0.65 0.3 350) ≈ #e0306c (magenta primary)
  colorPrimary: "#e0306c",
  colorSecondary: "#e0306c",
  barBg: "#0a0a0a",
  barTextColor: "#999999",
  barSelectedColor: "#e0306c",
  inputBg: "#1a1a1a",
  inputBorder: "#333333",
  inputBorderRadius: 0,
});

addons.setConfig({ theme: sfuxTheme });
```

**Note:** Storybook's `create()` API does not accept OKLCH values directly — convert to hex equivalents. The canvas preview area (where components render) uses `preview.ts` backgrounds, which CAN use OKLCH since they're rendered in the browser.

### Pattern 4: Story file structure (tiered approach)

**What:** Basic story for all exports; rich story for 10-15 flagship components (D-02)

```typescript
// stories/sf-button.stories.tsx — BASIC (most components)
import type { Meta, StoryObj } from "@storybook/react";
import { SFButton } from "@/components/sf/sf-button";

const meta: Meta<typeof SFButton> = {
  title: "Core/SFButton",
  component: SFButton,
  tags: ["autodocs"],  // enables auto-generated props table from JSDoc
};
export default meta;

type Story = StoryObj<typeof SFButton>;

export const Primary: Story = {
  args: { intent: "primary", size: "md", children: "LAUNCH" },
};

export const Ghost: Story = {
  args: { intent: "ghost", size: "md", children: "CANCEL" },
};
```

```typescript
// stories/flagship/sf-accordion.stories.tsx — RICH (flagship)
// Full args table, composition example, dark/light variants, controls panel
import type { Meta, StoryObj } from "@storybook/react";
import { SFAccordion, SFAccordionItem, SFAccordionTrigger, SFAccordionContent } from "@/components/sf/sf-accordion";

const meta: Meta<typeof SFAccordion> = {
  title: "SIGNAL/SFAccordion",
  component: SFAccordion,
  tags: ["autodocs"],
  argTypes: {
    type: { control: "radio", options: ["single", "multiple"] },
    collapsible: { control: "boolean" },
  },
};
export default meta;

// ... full stories with composition
```

### Pattern 5: Auto-generation script (D-08)

**What:** Parse `lib/entry-*.ts` files to extract export names, look up JSDoc from source files, produce `lib/api-docs.ts` data layer
**Approach:** Regex/AST hybrid — regex for entry file parsing (flat `export { X } from "..."` patterns), TypeScript compiler API for JSDoc extraction from source files

```typescript
// scripts/generate-api-docs.ts (new file, run via: pnpm tsx scripts/generate-api-docs.ts)
// 1. Read lib/entry-core.ts, lib/entry-animation.ts, lib/entry-webgl.ts
// 2. Parse each export line: extract { ExportName } and source file path
// 3. For each source file, use TypeScript compiler API to extract JSDoc:
//    - @description (or first paragraph of /** ... */)
//    - @param tags → props table entries
//    - @example tags → usage examples
// 4. Determine layer (FRAME/SIGNAL/CORE/HOOK/TOKEN) from:
//    - Entry file source (core=FRAME/CORE, animation=SIGNAL, webgl=SIGNAL)
//    - JSDoc @layer tag if present (future extensibility)
// 5. Determine importPath from entry file:
//    - entry-core.ts → "signalframeux"
//    - entry-animation.ts → "signalframeux/animation"
//    - entry-webgl.ts → "signalframeux/webgl"
// 6. Write output to lib/api-docs.ts preserving ComponentDoc interface
```

**Add to package.json scripts:**
```json
"docs:generate": "tsx scripts/generate-api-docs.ts",
"build:lib": "tsup && cp lib/tokens.css dist/signalframeux.css && pnpm docs:generate"
```

### Pattern 6: Storybook for WebGL components

**What:** `SignalCanvas` and `useSignalScene` require a browser WebGL context — Storybook's jsdom environment does not support WebGL
**Resolution:** Static screenshot stories with `render: () => null` body + decorative preview image, or manual-only story designation

```typescript
// stories/webgl/signal-canvas.stories.tsx
// WebGL components cannot render in Storybook's canvas without a real browser
// Strategy: document the API with autodocs, provide a static screenshot as preview
const meta: Meta = {
  title: "WebGL/SignalCanvas",
  component: SignalCanvas,
  tags: ["autodocs"],
  parameters: {
    // Static screenshot from public/ or a data URI
    backgrounds: { disable: true },
  },
};
```

### Anti-Patterns to Avoid

- **Stale hand-maintained api-docs.ts:** D-08 exists precisely to prevent this. The existing 107-entry hand-curated file uses `@sfux/*` namespaces that were never published. Never maintain this file manually going forward.
- **Importing story files with `'use server'` components directly:** Next.js RSC with Storybook requires `experimentalRSC: true` in main.ts — or wrapping RSC in Client Component story files. Layout primitives (SFContainer, SFSection, SFStack, SFGrid, SFText) are Server Components — their stories must use `"use client"` at file top or use `experimentalRSC` flag.
- **Using OKLCH in Storybook's `create()` theme:** Storybook's theming system does not process OKLCH. Convert to hex equivalents for the manager theme. OKLCH is fine in `preview.ts` backgrounds (browser context).
- **Adding `@source` to globals.css for stories/ directory:** Tailwind CSS v4 uses `@source` directives. The existing `app/globals.css` already excludes `.planning/`. Add `@source "../stories"` if Tailwind classes used in stories fail to apply — but try without it first; `@storybook/nextjs-vite` may handle source scanning automatically.
- **Importing from `@/` alias in stories without alias config in main.ts:** The `@/` TypeScript alias must be resolved in Storybook. `@storybook/nextjs-vite` respects `tsconfig.json` path aliases automatically — verify this works before writing all stories.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Props table generation | Custom JSDoc parser | Storybook autodocs + `tags: ["autodocs"]` on story meta | Storybook extracts TypeScript interfaces via react-docgen automatically |
| Dark/light theme switching | Custom toolbar widget | `@storybook/addon-themes` with `withThemeByClassName` | Battle-tested, handles body class toggling, integrates with Storybook toolbar |
| Story deployment | Custom CI script | Storybook's `pnpm build-storybook` + Vercel project | `build-storybook` produces static output; Vercel auto-deploys on push |
| Component discovery index | Custom catalog builder | Storybook sidebar (auto from story `title` field) | Storybook's title hierarchy creates nested sidebar navigation automatically |
| Import path mapping | Manual update of api-docs.ts | `scripts/generate-api-docs.ts` reading entry files | Entry files ARE the source of truth; script reads them to derive importPaths |

**Key insight:** Storybook's autodocs feature, combined with TypeScript interface inference (react-docgen), generates a full props table from the existing TypeScript interfaces — without any additional tooling. The `@param` JSDoc tags on SF components map to the description column in that props table. This means the JSDoc audit (DOC-01) directly feeds Storybook's autodocs output (DOC-03) — they are the same work, not separate tasks.

---

## Common Pitfalls

### Pitfall 1: `@storybook/nextjs-vite` vs `@storybook/nextjs` (Webpack)

**What goes wrong:** Running `npx storybook@latest init` in the existing Next.js project defaults to Webpack (`@storybook/nextjs`) instead of Vite.
**Why it happens:** The CLI prompt defaults to Webpack for existing Next.js projects.
**How to avoid:** Explicitly select "Next.js (Vite)" in the init prompt, or install `@storybook/nextjs-vite` directly. The Vite variant is the officially recommended path as of Storybook 10.
**Warning signs:** Build times > 30s on cold start; `@storybook/nextjs` in package.json instead of `@storybook/nextjs-vite`.

### Pitfall 2: Tailwind CSS v4 classes not applying in Storybook canvas

**What goes wrong:** Components render with no styling — OKLCH colors, spacing tokens absent.
**Why it happens:** Storybook's preview iframe doesn't have the Tailwind CSS injected unless explicitly imported in `preview.ts`.
**How to avoid:** Add `import "../app/globals.css"` as the first line in `.storybook/preview.ts`. The `@storybook/nextjs-vite` framework processes the file through the project's existing `postcss.config.mjs` automatically.
**Warning signs:** Components render with raw unstyled HTML in the Storybook canvas.

### Pitfall 3: Server Component stories break without RSC flag

**What goes wrong:** Layout primitives (SFContainer, SFSection, SFStack, SFGrid, SFText) are Server Components — importing them in a story without RSC support causes `TypeError: Cannot read properties of undefined`.
**Why it happens:** Storybook's default environment treats all components as Client Components.
**How to avoid:** Either add `features: { experimentalRSC: true }` to `main.ts` OR add `"use client"` at the top of story files that import Server Components. The simpler path is `experimentalRSC: true` — it's been stable since Storybook 8.4.
**Warning signs:** Story canvas shows error: "Objects are not valid as a React child" or undefined component errors for layout primitives.

### Pitfall 4: auto-gen script produces incorrect `importPath` for re-exported names

**What goes wrong:** `gsap-core.ts` is exported via `export * from "./gsap-core"` — regex on entry-animation.ts correctly identifies the source file but the exported names are all the internal GSAP utility functions, not named SF components.
**Why it happens:** `export *` re-exports everything from a module — the script must resolve what's actually exported, not just the file name.
**How to avoid:** For `export * from "./gsap-*"` lines, use TypeScript compiler API to resolve the full export list from those files. Only include names that match the ComponentDoc interface requirements (have JSDoc descriptions).
**Warning signs:** api-docs.ts output contains hundreds of low-level GSAP utility entries.

### Pitfall 5: MIGRATION.md import path mismatch

**What goes wrong:** MIGRATION.md documents imports like `import { SFButton } from "@sfux/components"` — the namespace that never existed. Consumers following this guide fail immediately.
**Why it happens:** `lib/api-docs.ts` has been using `@sfux/*` namespaces as aspirational placeholders. The actual published package name is `signalframeux`.
**How to avoid:** Use the actual package name from `package.json` (`signalframeux`) throughout all documentation. Correct import paths:
  - Core: `import { SFButton } from "signalframeux"`
  - Animation: `import { SFAccordion } from "signalframeux/animation"`
  - WebGL: `import { SignalCanvas } from "signalframeux/webgl"`
  - Tokens CSS: `import "signalframeux/signalframeux.css"` (maps to `dist/signalframeux.css`)
**Warning signs:** Any `@sfux/*` string in new documentation files.

### Pitfall 6: JSDoc audit finds gaps only in composite components

**What goes wrong:** Top-level SF components have JSDoc (`SFButton`, `SFCard`) but sub-components (`SFCardHeader`, `SFCardContent`, etc.) are exported from the same file without JSDoc.
**Why it happens:** JSDoc was written for the root component; sub-components were treated as implementation details even though they're exported publicly.
**How to avoid:** DOC-01 audit must check JSDoc presence on every named export in the entry files, not just the primary component. Sub-components need at minimum a one-line description `/** Card header container — receives standard div props. */`.
**Warning signs:** Storybook autodocs shows "No description" for sub-components in the props table.

---

## Code Examples

### JSDoc pattern that satisfies DOC-01

```typescript
// Source: existing components/sf/sf-button.tsx — this is the reference pattern
/**
 * Primary action button — FRAME layer interactive primitive.
 *
 * Enforces SF button contract: font-mono, uppercase, 2px border,
 * asymmetric hover timing (100ms in / 400ms out), and press transform
 * via .sf-pressable. "signal" intent uses primary border accent — use
 * for brand-level CTAs only.
 *
 * @param intent - Visual variant. "primary" | "ghost" | "signal"
 * @param size - Height and padding scale. "sm" | "md" | "lg" | "xl"
 * @param className - Merged via cn() — appended, never replaces base classes
 *
 * @example
 * <SFButton intent="primary" size="md">Launch</SFButton>
 * <SFButton intent="ghost" size="sm" onClick={handleCancel}>Cancel</SFButton>
 */
```

### Minimal JSDoc for sub-components (DOC-01 compliance)

```typescript
/**
 * Card header container — FRAME layer. Receives standard div props.
 * @example
 * <SFCardHeader><SFCardTitle>Title</SFCardTitle></SFCardHeader>
 */
```

### README structure template (D-06)

```markdown
# SIGNALFRAME//UX

High-performance design system. Dual-layer FRAME/SIGNAL model.

## INSTALL

\`\`\`sh
npm install signalframeux
\`\`\`

## QUICK START

\`\`\`tsx
import { SFButton, createSignalframeUX } from "signalframeux"
import "signalframeux/signalframeux.css"

createSignalframeUX({ theme: "dark" })

export default function Page() {
  return <SFButton intent="primary">LAUNCH</SFButton>
}
\`\`\`

## FRAME / SIGNAL MODEL

FRAME — deterministic, legible, semantic, consistent. Structural layer.
SIGNAL — generative, parametric, animated, data-driven. Expressive layer.

## TOKEN SYSTEM

...

## ENTRY POINTS

| Import | Peer deps required | Contents |
|--------|--------------------|----------|
| `signalframeux` | react, react-dom | SF components, hooks, utilities |
| `signalframeux/animation` | + gsap, @gsap/react | SFAccordion, SFProgress, GSAP utilities |
| `signalframeux/webgl` | + three | SignalCanvas, useSignalScene |
| `signalframeux/signalframeux.css` | tailwindcss | Design tokens, CSS custom properties |
```

### Auto-gen script skeleton

```typescript
// scripts/generate-api-docs.ts
import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");

const ENTRY_MAP: Record<string, string> = {
  "lib/entry-core.ts": "signalframeux",
  "lib/entry-animation.ts": "signalframeux/animation",
  "lib/entry-webgl.ts": "signalframeux/webgl",
};

// For each entry file, extract { ExportName, sourceFile, importPath }
// For each sourceFile, use TS compiler API to get JSDoc from the exported symbol
// Build ComponentDoc record and write to lib/api-docs.ts
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@storybook/nextjs` (Webpack) | `@storybook/nextjs-vite` (Vite) recommended | Storybook 8.4+ | Faster startup, better tree-shaking, native ESM |
| `tailwind.config.js` content paths | `@source` directives in CSS | Tailwind CSS v4 | Config-free, CSS-native; Storybook respects `postcss.config.mjs` |
| Manual `argTypes` definition | `tags: ["autodocs"]` + react-docgen | Storybook 7+ | Props table auto-generated from TypeScript interfaces |
| Storybook 8.x | Storybook 10.x (current) | 2025 | 10.x is the `npx storybook@latest init` result as of April 2026 |

**Deprecated/outdated:**
- `@storybook/addon-styling-webpack`: No longer needed for Next.js + Vite setup; replaced by direct `globals.css` import in `preview.ts`
- Hand-maintained `lib/api-docs.ts`: Will be replaced by auto-gen script output; existing `ComponentDoc` interface and `APIExplorer` consumer remain unchanged

---

## Open Questions

1. **`experimentalRSC` stability in Storybook 10.x**
   - What we know: Feature was introduced in Storybook 8.4, marked experimental; docs show it works for async Server Components
   - What's unclear: Whether it's still experimental in 10.x or promoted to stable
   - Recommendation: Enable it in `main.ts`; if it causes issues with any layout primitive, fall back to `"use client"` in the story file

2. **Storybook + Vercel subdomain deployment config**
   - What we know: `pnpm build-storybook` produces a static `storybook-static/` directory; Vercel can deploy this as a separate project
   - What's unclear: Whether a `storybook.signalframeux.com` subdomain requires a custom domain in Vercel or just a project alias
   - Recommendation: Create a second Vercel project pointing to the same repo; set root directory to `/` and build command to `pnpm build-storybook`; output to `storybook-static/`. Handle DNS config outside this phase.

3. **Flagship component selection (Claude's discretion)**
   - Recommended 12 flagships: SFButton, SFCard, SFAccordion (SIGNAL), SFDialog, SFDropdownMenu, SFContainer, SFSection, SFProgress (SIGNAL), SFStatusDot (SIGNAL), SignalCanvas (WebGL), SFNavigationMenu, SFStepper
   - Rationale: Covers all three entry points, both FRAME and SIGNAL layers, layout + interactive + feedback + navigation categories
   - Flag: SignalCanvas as WebGL component gets static screenshot story per Pitfall 6 above

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright (existing, `@playwright/test` ^1.59.1) + Vitest (existing, `vitest` ^4.1.4) |
| Config file | `playwright.config.ts` / `vitest.config.ts` (both exist) |
| Quick run command | `pnpm test` (Vitest, lib/ only) |
| Full suite command | `npx playwright test tests/phase-40-*.spec.ts` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DOC-01 | All exported SF components have JSDoc with `/**` block | unit (file-content) | `npx playwright test tests/phase-40-01-jsdoc-audit.spec.ts` | ❌ Wave 0 |
| DOC-01 | JSDoc contains `@param` for each prop | unit (file-content) | same spec | ❌ Wave 0 |
| DOC-01 | JSDoc contains `@example` | unit (file-content) | same spec | ❌ Wave 0 |
| DOC-02 | README.md exists at repo root with 4 required sections | unit (file-content) | `npx playwright test tests/phase-40-02-readme.spec.ts` | ❌ Wave 0 |
| DOC-03 | Storybook builds without error (`pnpm build-storybook` exits 0) | smoke | `npx playwright test tests/phase-40-03-storybook.spec.ts` | ❌ Wave 0 |
| DOC-03 | `storybook-static/` contains index.html | smoke | same spec | ❌ Wave 0 |
| DOC-04 | `lib/api-docs.ts` contains no `@sfux/` import paths | unit (file-content) | `npx playwright test tests/phase-40-04-api-docs.spec.ts` | ❌ Wave 0 |
| DOC-04 | `lib/api-docs.ts` importPaths use `signalframeux`, `signalframeux/animation`, `signalframeux/webgl` | unit (file-content) | same spec | ❌ Wave 0 |
| DOC-04 | All names from entry-core.ts appear as keys in API_DOCS | unit (file-content) | same spec | ❌ Wave 0 |

**Note on DOC-03:** `pnpm build-storybook` does NOT require a running server — it reads the file system. This is safe as a CI-style file-content + exit-code test in Playwright.

**Note on DOC-01 test approach:** Follow the Phase 39 pattern of `fs.readFileSync` checks in Playwright test files (no server needed). Test checks: (1) every named export in entry-core/animation/webgl appears in a source file that has `/**`, `@param` or `@example`.

### Sampling Rate

- **Per task commit:** `pnpm test` (Vitest unit tests, < 5s)
- **Per wave merge:** `npx playwright test tests/phase-40-*.spec.ts` (file-content checks, < 30s)
- **Phase gate:** All DOC-* Playwright specs green before `/pde:verify-work`

### Wave 0 Gaps

- [ ] `tests/phase-40-01-jsdoc-audit.spec.ts` — covers DOC-01
- [ ] `tests/phase-40-02-readme.spec.ts` — covers DOC-02
- [ ] `tests/phase-40-03-storybook.spec.ts` — covers DOC-03 (build-storybook exit code + output check)
- [ ] `tests/phase-40-04-api-docs.spec.ts` — covers DOC-04

---

## Sources

### Primary (HIGH confidence)

- Storybook official docs — `https://storybook.js.org/docs/get-started/frameworks/nextjs-vite` — Next.js + Vite framework setup, RSC support, version 10.x confirmed
- Storybook theming docs — `https://storybook.js.org/docs/configure/user-interface/theming` — `create()` API properties, color system
- Project source — `lib/entry-core.ts`, `lib/entry-animation.ts`, `lib/entry-webgl.ts` — actual export surface
- Project source — `lib/api-docs.ts` — 107 entries, stale `@sfux/*` import paths confirmed
- Project source — `package.json` — actual package name `signalframeux`, peer deps, scripts
- Project source — `components/sf/*.tsx` (51 files) — all 51 have `/**` JSDoc blocks confirmed

### Secondary (MEDIUM confidence)

- Storybook Tailwind CSS recipe — `https://storybook.js.org/recipes/tailwindcss` — confirmed `globals.css` import in `preview.ts` approach
- Medium article (April 2025) — `https://medium.com/@ayomitunde.isijola/integrating-storybook-with-tailwind-css-v4-1-f520ae018c10` — verified Tailwind v4 + Storybook via PostCSS approach works

### Tertiary (LOW confidence)

- WebSearch: Storybook 10.x confirmed as current `storybook@latest` version — flagged as needing validation at install time since version numbers change rapidly

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Storybook 10 + `@storybook/nextjs-vite` confirmed from official docs; Tailwind CSS v4 integration confirmed working via `globals.css` import
- Architecture: HIGH — all patterns derived from official docs and direct source code inspection
- Pitfalls: HIGH — pitfalls 1, 2, 3, 5 verified against official docs; pitfall 4 derived from source code analysis of entry-animation.ts `export *` pattern; pitfall 6 verified by inspecting actual SF component files

**Research date:** 2026-04-10
**Valid until:** 2026-05-10 (Storybook version number should be re-verified at install time; all other findings stable)
