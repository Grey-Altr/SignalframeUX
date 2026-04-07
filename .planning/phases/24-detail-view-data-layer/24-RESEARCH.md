# Phase 24: Detail View Data Layer - Research

**Researched:** 2026-04-06
**Domain:** Static TypeScript data authoring, shiki/core RSC syntax highlighting
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- `lib/component-registry.ts` maps each ComponentsExplorer grid item index to: variant previews (props arrays to spread onto live SF components), a code snippet (template literal string), and a `docId` pointer into `api-docs.ts`
- Variant previews are live SF component renders — props objects spread onto real components, NOT static HTML
- Additional fields: `layer` ("frame" | "signal"), `pattern` ("A" | "B" | "C"), `category` — derived from `registry.json` to avoid duplication
- One canonical usage snippet per component, authored inline as template literal strings in `component-registry.ts`
- `lib/api-docs.ts`: extend existing 27 entries to cover all ~49 registry items — non-destructive extension, keep all existing entries
- Every new entry must have at least one PropDef with name, type, default, required, and description fields
- Follow existing `ComponentDoc` interface — no schema changes
- `lib/code-highlight.ts`: `shiki/core` only (NOT `shiki/bundle/web` or `shiki/bundle/full`), selective tsx language loading, `import 'server-only'` guard, custom minimal theme derived from vitesse-dark mapped to OKLCH CSS vars, returns highlighted HTML string

### Claude's Discretion

- Exact PropDef values for each component (types, defaults, descriptions) — derived from source and JSDoc
- Internal organization of `component-registry.ts` (grouping, ordering)
- Shiki theme token-to-OKLCH mappings (specific color choices within design system palette)
- Whether to use a shared types file or co-locate types with each module

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DV-01 | `lib/component-registry.ts` maps all grid items to variants, code snippets, doc pointers | Registry data shape defined; 35 grid items mapped via `components-explorer.tsx` COMPONENTS array; registry.json provides layer/pattern/category meta |
| DV-02 | `lib/api-docs.ts` extended with ComponentDoc entries for all ~45 components | Existing interface is stable; 27 entries cover CORE/HOOK/TOKEN plus partial FRAME; gap analysis identifies ~22 new entries needed for FRAME/SIGNAL components not yet documented |
| DV-03 | `lib/code-highlight.ts` (shiki/core, server-only RSC module) for syntax highlighting | shiki not yet installed; API verified via official docs; JS regex engine recommended over Oniguruma for no-WASM server-only usage; OKLCH vars exist in globals.css as `--sf-code-*` tokens |

</phase_requirements>

---

## Summary

Phase 24 is a data authoring phase — no UI is rendered, no user-facing behaviour changes. It creates three TypeScript modules that Phase 25 will consume. The work splits cleanly into three tracks: (1) registry data authoring, (2) api-docs extension, (3) shiki wiring.

The component-registry.ts module is a new file from scratch. It maps 35 ComponentsExplorer grid items by `index` string (e.g., `"001"`, `"101"`) to `ComponentRegistryEntry` objects. The entry shape is: variant preview props arrays (one per visual variant, spread onto the live SF component at render time), a code snippet string, a `docId` key pointing into `API_DOCS`, plus `layer`, `pattern`, and `category` fields pulled from `registry.json`. The key design decision — already locked — is that variant previews are props objects, not JSX. This keeps `component-registry.ts` directive-free (no `'use client'` needed in the data file itself).

The api-docs.ts extension is pure data authoring. The existing `ComponentDoc` interface has 5 required fields (`id`, `name`, `layer`, `version`, `status`, `description`, `importPath`, `importName`, `props`, `usage`, `a11y`). The 27 existing entries use a fictional API surface (`@sfux/core`, `@sfux/components`) that does not match the actual import paths in the codebase. New entries for Phase 24 should use real import paths (`@/components/sf/sf-button`, or barrel `@/components/sf`). The existing entries use UPPERCASE string conventions throughout — all new entries must follow this convention.

The shiki/core module requires a new package install (`pnpm add shiki server-only`). The `shiki` package is not currently in `package.json` or `pnpm-lock.yaml`. The project-context.md already documents `shiki/core (v1.4+, server-only RSC)` as part of the stack, indicating this was planned. The correct API for Next.js RSC is `createHighlighter` (or `createHighlighterCore`) with `createJavaScriptRegexEngine` (no WASM, smaller than Oniguruma). OKLCH theme tokens `--sf-code-*` already exist in `globals.css` as CSS custom properties — the shiki theme object must hardcode these OKLCH values (not reference CSS vars, since shiki operates server-side and cannot read computed CSS).

**Primary recommendation:** Author the three modules in dependency order: api-docs.ts first (no external deps), component-registry.ts second (references api-docs docIds), code-highlight.ts third (requires new package install). Split into two tasks: Task 01 = api-docs + registry, Task 02 = shiki RSC module.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `shiki` | v4.x (latest) | Server-side syntax highlighting returning HTML strings | ~50-80 KB async server-only; project-context.md already lists it as part of stack |
| `server-only` | latest | Compile-time guard preventing server modules from being imported in client bundles | Next.js 15 App Router standard pattern for RSC-only modules |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `shiki/engine/javascript` | (bundled with shiki) | JS regex engine — no WASM overhead | Always for Next.js RSC; avoids loading `shiki/wasm` |
| TypeScript template literals | n/a | Code snippet authoring inline | All component-registry.ts code snippets |

### Alternatives NOT to Use
| Instead of | Could Use | Why We Don't |
|------------|-----------|--------------|
| `shiki/bundle/web` | shiki/core fine-grained | 695 KB gzip — project decided against (see STATE.md) |
| `shiki/bundle/full` | shiki/core fine-grained | 6.4 MB — obviously excluded |
| `highlight.js` | shiki/core | No OKLCH theme support; project already decided on shiki |
| `prism` | shiki/core | No OKLCH theme support; project already decided on shiki |
| Oniguruma engine | JS regex engine | Requires WASM binary; no bundle-size advantage in RSC context |

**Installation:**
```bash
pnpm add shiki server-only
```

---

## Architecture Patterns

### Module Locations
```
lib/
├── component-registry.ts    # NEW — ComponentRegistryEntry map (35 grid items)
├── api-docs.ts              # EXTEND — add ~22 new ComponentDoc entries
└── code-highlight.ts        # NEW — shiki/core RSC module, server-only guard
```

### Pattern 1: ComponentRegistryEntry Shape

**What:** A TypeScript record keyed by grid item `index` string. Each entry has typed props arrays for each visual variant, a code snippet string, a `docId` pointing to `API_DOCS`, and metadata fields.

**Why this shape:** Phase 25 `ComponentDetail` panel will look up by index string (matching ComponentsExplorer `data-flip-id`). Variant previews as props arrays (not JSX) keeps this file directive-free. `layer`/`pattern`/`category` fields eliminate redundant data since they're already in `registry.json` — but co-locating them in registry.ts avoids a second import in Phase 25 consumers.

```typescript
// lib/component-registry.ts
// NO 'use client' directive — this is pure data

export interface VariantPreview {
  label: string;          // e.g. "PRIMARY", "GHOST"
  props: Record<string, unknown>;  // spread onto the live SF component
}

export interface ComponentRegistryEntry {
  index: string;          // matches ComponentsExplorer COMPONENTS[n].index
  name: string;           // display name, matches COMPONENTS[n].name
  component: string;      // import name, e.g. "SFButton"
  importPath: string;     // e.g. "@/components/sf" (barrel) or direct path for Pattern B
  variants: VariantPreview[];
  code: string;           // canonical usage snippet — template literal
  docId: string;          // key into API_DOCS, e.g. "button"
  layer: "frame" | "signal";
  pattern: "A" | "B" | "C";
  category: string;       // matches COMPONENTS[n].category
}

export const COMPONENT_REGISTRY: Record<string, ComponentRegistryEntry> = {
  "001": {
    index: "001",
    name: "BUTTON",
    component: "SFButton",
    importPath: "@/components/sf",
    variants: [
      { label: "PRIMARY", props: { intent: "primary", size: "md", children: "LAUNCH" } },
      { label: "GHOST",   props: { intent: "ghost",   size: "md", children: "CANCEL" } },
      { label: "SIGNAL",  props: { intent: "signal",  size: "md", children: "DEPLOY" } },
    ],
    code: `import { SFButton } from '@/components/sf'\n\n<SFButton intent="primary" size="md">LAUNCH</SFButton>`,
    docId: "button",
    layer: "frame",
    pattern: "A",
    category: "FORMS",
  },
  // ... 34 more entries
};
```

### Pattern 2: api-docs.ts New Entry Shape

**What:** A `ComponentDoc` object following the exact existing interface. New entries for Phase 24 cover the 22 components in the ComponentsExplorer grid that do NOT yet have entries.

**Conventions to follow (verified from existing file):**
- All `description` strings UPPERCASE
- All `desc` strings in PropDef UPPERCASE
- `importPath` should use real import path (not fictional `@sfux/*`)
- `props` array: at minimum 1 PropDef with `name`, `type`, `default`, `required` (if applicable), `desc`
- `usage` array: at minimum 1 `UsageExample` with `label` and `code`
- `a11y` array: at minimum 2 strings

```typescript
// Pattern for a new FRAME component entry
sfButton: {
  id: "sfButton",
  name: "SFButton",
  layer: "FRAME",
  version: "v2.1.0",
  status: "STABLE",
  description: "PRIMARY ACTION BUTTON. FRAME LAYER INTERACTIVE PRIMITIVE. FONT-MONO, UPPERCASE, 2PX BORDER, ASYMMETRIC HOVER TIMING (100MS IN / 400MS OUT). THREE INTENT VARIANTS: PRIMARY, GHOST, SIGNAL.",
  importPath: "@/components/sf",
  importName: "SFButton",
  props: [
    { name: "intent", type: "'primary' | 'ghost' | 'signal'", default: "'primary'", desc: "VISUAL VARIANT" },
    { name: "size",   type: "'sm' | 'md' | 'lg' | 'xl'",     default: "'md'",       desc: "HEIGHT AND PADDING SCALE" },
    { name: "className", type: "string", default: "—", desc: "MERGED VIA cn() — APPENDED, NEVER REPLACES BASE" },
  ],
  usage: [
    { label: "PRIMARY", code: `<SFButton intent="primary" size="md">LAUNCH</SFButton>` },
    { label: "GHOST",   code: `<SFButton intent="ghost" size="sm" onClick={handleCancel}>CANCEL</SFButton>` },
  ],
  a11y: [
    "NATIVE <BUTTON> ELEMENT — FULL KEYBOARD AND SCREEN READER SUPPORT",
    "FOCUS RING: 2PX SOLID PRIMARY VIA .SF-FOCUSABLE",
    "DISABLED STATE USES NATIVE DISABLED ATTRIBUTE",
  ],
},
```

### Pattern 3: code-highlight.ts Module

**What:** Server-only RSC module that creates a singleton shiki highlighter and exports a `highlight(code: string): Promise<string>` function.

**Key constraints:**
- `import 'server-only'` at top — compile-time error if imported from a client component
- `createHighlighter` from `shiki` (not `shiki/core` directly — `shiki` re-exports core API cleanly per v4 docs)
- `createJavaScriptRegexEngine` from `shiki/engine/javascript` — no WASM
- Load only `tsx` language (covers TSX, JSX, and TypeScript)
- Custom theme object with OKLCH values hardcoded (NOT CSS var references — shiki runs server-side, cannot read computed CSS)

```typescript
// lib/code-highlight.ts
import 'server-only';
import { createHighlighter } from 'shiki';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

// Singleton — created once per server process
let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      langs: ['tsx'],
      themes: [SFUX_THEME],
      engine: createJavaScriptRegexEngine(),
    });
  }
  return highlighterPromise;
}

export async function highlight(code: string): Promise<string> {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code, {
    lang: 'tsx',
    theme: 'sfux-dark',
  });
}

// Custom theme — OKLCH values from globals.css --sf-code-* tokens
// MUST be hardcoded (not CSS var references — shiki is server-side only)
const SFUX_THEME = {
  name: 'sfux-dark',
  type: 'dark' as const,
  colors: {
    'editor.background': 'oklch(0.12 0 0)',         // --sf-code-bg
    'editor.foreground': 'oklch(0.85 0 0)',
  },
  tokenColors: [
    { scope: ['keyword', 'storage'],       settings: { foreground: 'oklch(0.7 0.15 25)' } },   // --sf-code-keyword
    { scope: ['entity.name', 'variable.other.constant'], settings: { foreground: 'oklch(0.7 0.18 350)' } }, // --sf-code-const
    { scope: ['string'],                   settings: { foreground: 'oklch(0.6 0.28 145)' } },   // --sf-code-text
    { scope: ['comment'],                  settings: { foreground: 'oklch(0.52 0 0)', fontStyle: 'italic' } }, // --sf-dim-text
    { scope: ['punctuation'],              settings: { foreground: 'oklch(0.65 0 0)' } },
  ],
};
```

### Anti-Patterns to Avoid

- **CSS var references in shiki theme:** `var(--sf-code-bg)` does NOT work in shiki theme objects. Shiki is a server-side Node.js process — it cannot resolve CSS custom properties. Hardcode OKLCH values copied from globals.css.
- **JSX in component-registry.ts:** Variant previews must be props objects, not `<SFButton>` JSX. Putting JSX here adds a `'use client'` requirement and bloats the bundle with all 49 component imports.
- **Importing 'shiki/bundle/web' or 'shiki/bundle/full':** Confirmed excluded by STATE.md decision.
- **Duplicate `API_DOCS` keys:** `api-docs.ts` already has a known structural issue (see line 789+ — the `PREVIEW_DATA` block at the bottom uses the same key names but is a separate `const`, not a conflict in `API_DOCS`). New entries append to the main `API_DOCS` object before the closing `};` at line 785.
- **`'use client'` in component-registry.ts or api-docs.ts:** These are pure data modules. No directives. Phase 25 will handle client-side consumption.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Syntax highlighting | Custom regex tokenizer | shiki/core | TextMate grammar, OKLCH theme support, HTML output, server-only |
| Server-only module guard | Runtime check via `typeof window` | `import 'server-only'` | Compile-time error — catches misuse at build time, not runtime |
| TSX language grammar | Custom grammar object | `shiki` bundled `tsx` grammar | Full TSX/JSX/TypeScript coverage including generics, type annotations |

---

## Common Pitfalls

### Pitfall 1: api-docs.ts has Duplicate Structure After PREVIEW_DATA Block

**What goes wrong:** Lines 787–900+ in api-docs.ts contain a `PREVIEW_DATA` const followed by a loop that attaches previews to `API_DOCS`. The key names in `PREVIEW_DATA` match `API_DOCS` keys but this is NOT a TypeScript duplicate key error — they're in different objects. New entries must be added to `API_DOCS` (before line 785 closing `};`), NOT to `PREVIEW_DATA`.

**How to avoid:** Read api-docs.ts carefully before appending. New entries go into `API_DOCS` only. `PREVIEW_DATA` is optional supplementary display data — Phase 24 does not need to add preview HUD data for new entries.

### Pitfall 2: Component-Registry DocId Must Match Existing API_DOCS Keys

**What goes wrong:** If `component-registry.ts` uses `docId: "sfButton"` but `api-docs.ts` only has `id: "button"`, the Phase 25 panel will look up the wrong (or non-existent) entry and render empty props.

**How to avoid:** Establish a consistent naming convention for new `API_DOCS` entries before writing the registry. Recommendation: use camelCase component name as key, e.g., `sfButton`, `sfInput`, `sfAccordion`. Existing entries use lowercase: `input`, `card`, `modal`, `table`, `tabs`, `toast`, `dropdown`, `drawer`, `badge`. The `docId` in component-registry.ts must match the object key exactly.

### Pitfall 3: Pattern B Components Cannot Use Barrel Import in Registry

**What goes wrong:** `SFCalendar`, `SFMenubar`, `SFDrawer` are NOT exported from `sf/index.ts`. If component-registry.ts sets `importPath: "@/components/sf"` for these, Phase 25 will fail to render variant previews.

**How to avoid:** For Pattern B components, use direct import path in the registry entry: `importPath: "@/components/sf/sf-calendar-lazy"` (for the lazy wrapper). Document this exception clearly in the registry entry comment.

### Pitfall 4: Shiki Singleton vs Per-Request Instantiation

**What goes wrong:** If `createHighlighter` is called on every `highlight()` invocation, it re-initializes the language grammar on every render. In RSC context this is slow (10–100ms per call) and may cause cold-start issues on Vercel serverless.

**How to avoid:** The singleton pattern (module-level promise cached after first call) is the correct approach. The highlighter promise is awaited on first call and reused on subsequent calls within the same server process lifetime.

### Pitfall 5: shiki Theme 'type' Must Be 'dark' or 'light' (Literal)

**What goes wrong:** TypeScript will error if `type` is typed as `string` instead of `'dark' | 'light'`. The `as const` cast is required.

**How to avoid:** Always use `type: 'dark' as const` in the theme object literal.

### Pitfall 6: SIGNAL Animation Component Import Paths in Registry

**What goes wrong:** Animation components (CircuitDivider, VHSOverlay, HeroMesh, ScrambleText) live in `components/animation/`, not `components/sf/`. If component-registry.ts uses the sf barrel path for these, Phase 25 imports will fail.

**How to avoid:** Use direct paths: `@/components/animation/circuit-divider`, etc. These are Pattern C components (no Radix base).

---

## Code Examples

### shiki/core Fine-Grained Setup (verified from official docs)

```typescript
// Source: https://shiki.style/guide/regex-engines (verified 2026-04-06)
import { createHighlighter } from 'shiki';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

const highlighter = await createHighlighter({
  langs: ['tsx'],
  themes: [myTheme],
  engine: createJavaScriptRegexEngine(),
});

const html = highlighter.codeToHtml('const a = 1', {
  lang: 'tsx',
  theme: 'sfux-dark',
});
```

### server-only guard (Next.js 15 standard pattern)

```typescript
// Source: Next.js docs — server-only module pattern
import 'server-only';
// Any attempt to import this module from a Client Component throws at build time
```

### ComponentDoc entry for a SIGNAL component with animation tokens

```typescript
sfAccordion: {
  id: "sfAccordion",
  name: "SFAccordion",
  layer: "SIGNAL",
  version: "v1.3.0",
  status: "STABLE",
  description: "ACCORDION WITH GSAP STAGGER ON EXPAND, REVERSE ON COLLAPSE. REDUCED-MOTION GUARD VIA MATCHMEDIA. RADIX ACCORDION PRIMITIVE BASE.",
  importPath: "@/components/sf",
  importName: "SFAccordion",
  props: [
    { name: "type",          type: "'single' | 'multiple'", default: "'single'",  desc: "SELECTION MODE" },
    { name: "collapsible",   type: "boolean",               default: "false",     desc: "ALLOW DESELECTING ACTIVE ITEM (TYPE='SINGLE' ONLY)" },
    { name: "defaultValue",  type: "string | string[]",     default: "—",         desc: "INITIALLY EXPANDED ITEM(S)" },
    { name: "onValueChange", type: "(val: string | string[]) => void", default: "—", desc: "CHANGE HANDLER" },
  ],
  usage: [
    {
      label: "SINGLE EXPAND",
      code: `<SFAccordion type="single" collapsible>\n  <SFAccordionItem value="a">\n    <SFAccordionTrigger>SECTION A</SFAccordionTrigger>\n    <SFAccordionContent>CONTENT</SFAccordionContent>\n  </SFAccordionItem>\n</SFAccordion>`,
    },
  ],
  a11y: [
    "RADIX ACCORDION — FULL KEYBOARD NAVIGATION (SPACE/ENTER TO TOGGLE)",
    "GSAP ANIMATION PAUSED ON PREFERS-REDUCED-MOTION",
    "ARIA-EXPANDED ON TRIGGER BUTTON",
  ],
},
```

---

## Gap Analysis: api-docs.ts vs ComponentsExplorer

### Existing API_DOCS entries (27 total, including CORE/HOOK/TOKEN)

**CORE (4):** createSignalframeUX, useSignalframe, SFUXProvider, defineTheme

**FRAME components (8):** input, card, modal, table, tabs, toast, dropdown, drawer, badge

**SIGNAL components (4):** noisebg, particlemesh, glitchtext, waveform, reactivecanvas (5 if counting reactivecanvas)

**TOKEN (5):** colors, spacing, typography, motion, elevation

**HOOK (4):** useSignalEffect, useToken, useMotion, useBreakpoint

### ComponentsExplorer COMPONENTS array — 35 grid items

FORMS (8): BUTTON(001), INPUT(002), TOGGLE(003), SLIDER(004), TOGGLE_GRP(023), CALENDAR(026), INPUT_OTP(029), INPUT_GROUP(030)

LAYOUT (4): CARD(005), MODAL(006), DRAWER(012), HOVER_CARD(028)

NAVIGATION (6): TABS(007), PAGINATION(011), AVATAR(013), BREADCRUMB(014), NAV_MENU(025), MENUBAR(027)

FEEDBACK (10): BADGE(008), TOAST FRAME(010), ALERT(015), DIALOG_CFM(016), COLLAPSE(017), EMPTY(018), ACCORDION(020), PROGRESS(021), TOAST SIGNAL(022), STEPPER(024)

DATA_DISPLAY (2): TABLE(009), STATUS_DOT(019)

GENERATIVE (4): NOISE_BG(101), WAVEFORM(102), GLITCH_TXT(103), PARTICLE(104)

### Registry items NOT in grid (14):
sf-separator, sf-tooltip, sf-dialog, sf-sheet, sf-dropdown-menu, sf-command, sf-skeleton, sf-popover, sf-scroll-area, sf-label, sf-select, sf-checkbox, sf-radio-group, sf-switch, sf-textarea, sf-container, sf-section, sf-grid, sf-stack, sf-text, sf-theme, circuit-divider, vhs-overlay, hero-mesh, scramble-text

### New api-docs entries needed for Phase 24 (DV-02 requires all ~49)

These 35 grid items need `ComponentDoc` entries — map from existing vs needed:

| Grid Item | API_DOCS Key | Status |
|-----------|-------------|--------|
| BUTTON (001) | `button` | MISSING — needs new `sfButton` entry |
| INPUT (002) | `input` | EXISTS (matches closely) |
| TOGGLE (003) | — | MISSING |
| SLIDER (004) | — | MISSING |
| CARD (005) | `card` | EXISTS |
| MODAL (006) | `modal` | EXISTS |
| TABS (007) | `tabs` | EXISTS |
| BADGE (008) | `badge` | EXISTS |
| TABLE (009) | `table` | EXISTS |
| TOAST FRAME (010) | `toast` | EXISTS (partial match) |
| PAGINATION (011) | — | MISSING |
| DRAWER (012) | `drawer` | EXISTS |
| AVATAR (013) | — | MISSING |
| BREADCRUMB (014) | — | MISSING |
| ALERT (015) | — | MISSING |
| DIALOG_CFM (016) | — | MISSING |
| COLLAPSE (017) | — | MISSING |
| EMPTY (018) | — | MISSING |
| STATUS_DOT (019) | — | MISSING |
| ACCORDION (020) | — | MISSING |
| PROGRESS (021) | — | MISSING |
| TOAST SIGNAL (022) | — | MISSING (existing `toast` covers sonner, not the SIGNAL variant) |
| TOGGLE_GRP (023) | — | MISSING |
| STEPPER (024) | — | MISSING |
| NAV_MENU (025) | — | MISSING |
| CALENDAR (026) | — | MISSING |
| MENUBAR (027) | — | MISSING |
| HOVER_CARD (028) | — | MISSING |
| INPUT_OTP (029) | — | MISSING |
| INPUT_GROUP (030) | — | MISSING |
| NOISE_BG (101) | `noisebg` | EXISTS |
| WAVEFORM (102) | `waveform` | EXISTS |
| GLITCH_TXT (103) | `glitchtext` | EXISTS |
| PARTICLE (104) | `particlemesh` | EXISTS |

**New entries needed for grid items: ~22**

For DV-02 full coverage (~49 registry items), also need entries for the 14 non-grid registry items: separator, tooltip, dialog, sheet, dropdown, command, skeleton, popover, scroll-area, label, select, checkbox, radio-group, switch, textarea, container, section, grid, stack, text, theme (token entry), circuit-divider, vhs-overlay, hero-mesh, scramble-text. That's another ~14 entries.

**Total new entries for DV-02: approximately 22 (grid) + 14 (non-grid) = 36 new entries.**

This is significant authoring volume. Plan accordingly — split grid items (consumer-facing) into Task 01 and non-grid items into Task 01 as well, since api-docs.ts is pure data. The 36 new entries are the dominant work item in this phase.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `shiki` with Oniguruma WASM | `shiki` with `createJavaScriptRegexEngine` | Shiki v3.9.1+ | No WASM file, smaller bundle, no Node.js version constraints |
| `shiki/bundle/web` for Next.js | `shiki/core` fine-grained | Shiki v1.x+ | ~50-80KB async vs 695KB gzip |
| highlight.js / prism | shiki/core | Project decision | Full grammar support, theme customization, OKLCH-compatible |

---

## OKLCH Token Map for Shiki Theme

These are the `--sf-code-*` CSS custom properties from `app/globals.css` that the shiki theme should use. They are OKLCH values that must be hardcoded into the theme object (not referenced as CSS vars):

| CSS Token | OKLCH Value | Shiki Use |
|-----------|-------------|-----------|
| `--sf-code-bg` | `oklch(0.12 0 0)` | `editor.background` |
| `--sf-code-text` | `oklch(0.6 0.28 145)` | String literals, default text |
| `--sf-code-keyword` | `oklch(0.7 0.15 25)` | Keywords, storage (`import`, `const`, `function`) |
| `--sf-code-const` | `oklch(0.7 0.18 350)` | Constants, type names, component names (magenta) |
| `--sf-dim-text` | `oklch(0.52 0 0)` | Comments |
| `--sf-muted-text-dark` | `oklch(0.65 0 0)` | Punctuation |

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | No test framework detected in project |
| Config file | None |
| Quick run command | `pnpm tsc --noEmit` (TypeScript type check as validation proxy) |
| Full suite command | `pnpm tsc --noEmit && pnpm build` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DV-01 | `COMPONENT_REGISTRY` has entry for all 35 grid items | manual-only (data audit) | `pnpm tsc --noEmit` (type safety) | ❌ Wave 0 |
| DV-02 | `API_DOCS` has ComponentDoc for all ~49 registry items | manual-only (data audit) | `pnpm tsc --noEmit` (type safety) | ❌ Wave 0 |
| DV-03 | `highlight(code)` returns non-empty HTML string from server module | smoke | `pnpm tsc --noEmit` | ❌ Wave 0 |

**Note:** This phase has no automated test infrastructure in the project. TypeScript type-checking (`pnpm tsc --noEmit`) is the primary correctness gate. Manual spot-checks of data completeness are required.

### Sampling Rate
- **Per task commit:** `pnpm tsc --noEmit` — catches interface violations, missing fields, wrong types
- **Per wave merge:** `pnpm tsc --noEmit && pnpm build` — full build verifies no import errors, no server-only violations
- **Phase gate:** Full build green before `/pde:verify-work`

### Wave 0 Gaps
- [ ] No test infrastructure in project — `pnpm tsc --noEmit` serves as the gating check
- [ ] Manual completeness audit script: count `Object.keys(COMPONENT_REGISTRY).length === 35`
- [ ] Manual completeness audit: count new `API_DOCS` entries matches ~49 registry items

---

## Open Questions

1. **Existing api-docs entries use fictional import paths (`@sfux/core`)**
   - What we know: All 27 existing entries use `@sfux/components`, `@sfux/core`, `@sfux/signal`, `@sfux/hooks`, `@sfux/tokens` — none of these packages exist. These are aspirational future package names.
   - What's unclear: Should new entries follow the fictional convention (consistency) or use real import paths (`@/components/sf`)?
   - Recommendation: New entries for Phase 24 should use real import paths (`@/components/sf`) since they will be consumed by Phase 25 and must be accurate. Add a comment noting the discrepancy. Do NOT update the existing 27 entries — that would be out of scope.

2. **sf-toggle.tsx — in barrel but not in COMPONENTS array**
   - What we know: `SFToggle` is exported from `sf/index.ts` (line 67) and exists as `sf-toggle.tsx`. It appears in registry.json as `sf-toggle`. It is NOT in the ComponentsExplorer COMPONENTS array (index 003 is "TOGGLE" which maps to the switch-style toggle component). The registry entry for `sf-toggle` exists.
   - What's unclear: Index `"003"` labeled "TOGGLE" — which component does this actually render? Looking at `PreviewToggle()` it renders a switch-like div, suggesting this maps to `SFToggle` (the toggle button), not `SFSwitch`.
   - Recommendation: Treat index `"003"` as `SFToggle` (toggle button). Add a `sfToggle` entry to api-docs.ts. If this is actually `SFSwitch`, the executor should check the source file to confirm.

3. **ReactiveCanvas in api-docs.ts but not in registry.json**
   - What we know: `reactivecanvas` exists in `API_DOCS` but is not in `registry.json` or the ComponentsExplorer grid.
   - What's unclear: Whether to add a `component-registry.ts` entry for it.
   - Recommendation: Skip it for DV-01 (registry.ts only covers the 35 grid items). It can stay in api-docs.ts as-is.

---

## Sources

### Primary (HIGH confidence)
- `/Users/greyaltaer/code/projects/SignalframeUX/components/blocks/components-explorer.tsx` — verified COMPONENTS array with all 35 grid items and their indices
- `/Users/greyaltaer/code/projects/SignalframeUX/lib/api-docs.ts` — verified existing 27 entries, ComponentDoc interface, PropDef interface, PREVIEW_DATA block structure
- `/Users/greyaltaer/code/projects/SignalframeUX/public/r/registry.json` — verified all 49 items, layer/pattern metadata
- `/Users/greyaltaer/code/projects/SignalframeUX/components/sf/index.ts` — verified barrel exports, Pattern B exclusions
- `/Users/greyaltaer/code/projects/SignalframeUX/app/globals.css` — verified `--sf-code-*` OKLCH token values
- `/Users/greyaltaer/code/projects/SignalframeUX/package.json` — confirmed shiki and server-only NOT installed

### Secondary (MEDIUM confidence)
- https://shiki.style/guide/regex-engines — verified JS regex engine API and import paths
- https://shiki.style/packages/next — verified Next.js RSC usage pattern and singleton recommendation
- https://shiki.style/guide/bundles — verified bundle size figures and shiki/core fine-grained approach

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — shiki not yet installed, API verified from official docs; existing data interfaces verified from source
- Architecture: HIGH — ComponentDoc interface stable, ComponentsExplorer COMPONENTS array fully read, registry.json fully read
- Gap analysis (api-docs): HIGH — manually counted existing keys, compared against 35-item COMPONENTS array
- Shiki theme token mapping: HIGH — OKLCH values read directly from globals.css
- Pitfalls: HIGH — api-docs.ts structure verified by reading the file; Pattern B exclusions verified from barrel

**Research date:** 2026-04-06
**Valid until:** 2026-05-06 (stable data authoring domain; shiki API stable at v4.x)
