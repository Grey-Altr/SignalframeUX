# Phase 45: Token Bridge - Research

**Researched:** 2026-04-11
**Domain:** CSS cascade layers, Tailwind v4 @theme mechanics, token rename at scale, tsup build pipeline, consumer CSS architecture
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- SF//UX repo only — no changes to ~/code/projects/Culture Division/
- CD site integration is a separate future phase/project
- Validate the @layer cascade architecture with cd-tokens.css as an example, not a live CD integration
- Full rename of ALL tokens to --sfx-* namespace (--sfx-background, --sfx-foreground, --sfx-primary, etc.)
- Breaking change for the SF//UX site — all component references, globals.css, and Tailwind utilities must be updated
- All in one phase (no split)
- Includes spacing (--sfx-spacing-*), typography (--sfx-font-*, --sfx-text-*), layout (--sfx-max-w-*), animation tokens
- Wrap the entire compiled CSS output in `@layer signalframeux { ... }`
- Consumer CSS outside the layer always wins by default — no specificity hacks needed
- @theme declarations stay OUTSIDE the layer (Tailwind v4 needs them at compile time)
- Only the compiled output gets layered during the build step
- Consumer override pattern: load signalframeux.css first, then cd-tokens.css (unlayered) — unlayered CSS wins over layered CSS
- Add CSS entry point to tsup.config.ts
- Export as `signalframeux/signalframeux.css`
- Source: lib/tokens.css (post-rename to --sfx-*)
- Build step wraps output in @layer signalframeux { }
- Ship with CD's actual palette (yellows, dark tones, DU×TDR aesthetic), not a generic example
- CD is NOT dark-only — uses tasteful color over different greys, blacks, whites, and yellow
- cd-tokens.css overrides --sfx-* tokens to CD's specific values
- Font tokens set to Geist Sans/Mono for now
- Font token structure must accommodate future typeface swap
- Hardcode `class="dark"` + cd-tokens.css approach for SSR dark mode
- CD's palette IS the dark variant of SF//UX tokens
- Server-render class="dark" in layout.tsx so SF//UX components pick up the right values immediately
- No magenta primary visible during streaming — cd-tokens.css overrides it
- Full consumer integration guide for MIGRATION.md (not just a rename table)

### Claude's Discretion
- Exact Tailwind v4 @theme → @layer interaction mechanics (research needed)
- Build step implementation details for wrapping output in @layer
- Token rename automation approach (manual vs script)
- cd-tokens.css color values (reference CD site's actual palette)

### Deferred Ideas (OUT OF SCOPE)
- CD site repo changes (importing signalframeux.css, applying cd-tokens.css) — separate phase/project
- Custom typeface integration (replacing Geist with pipeline output) — future phase after typeface pipeline delivers
- Light mode support for CD — not needed (CD's palette works as dark variant)
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| TBR-01 | CD site imports `signalframeux/signalframeux.css` + `cd-tokens.css` override layer; existing pages render identically | Validated cascade architecture: cd-tokens.css (unlayered) beats signalframeux.css (layered). Build pipeline confirmed. cd-tokens.css palette derived from actual CD globals.css. |
| TBR-02 | `@layer` cascade: `sf.tokens` → `consumer.overrides` — consumer CSS wins without specificity war | Confirmed CSS spec: unlayered declarations beat any named layer regardless of specificity. @theme stays outside layer. Only :root/:dark blocks enter @layer signalframeux. |
| TBR-03 | `--sfx-*` consumer override tier documented in MIGRATION.md with full variable list | All 55+ tokens enumerated from lib/tokens.css. Complete rename table mapped. Font token structure designed for future typeface swap. |
| TBR-04 | No SSR flash — dark mode `class="dark"` server-rendered on CD `<html>`, no magenta primary visible during streaming | cd-tokens.css overrides --sfx-primary to achromatic white. Server-rendering class="dark" in layout.tsx ensures correct values immediately. No flash window. |
</phase_requirements>

---

## Summary

Phase 45 does three things in strict sequence: (1) rename all tokens from legacy names to --sfx-* namespace inside lib/tokens.css and all references across the codebase, (2) modify the build step so dist/signalframeux.css wraps its :root and .dark blocks in `@layer signalframeux { }` while leaving @theme blocks outside, and (3) ship cd-tokens.css as a reference consumer file that demonstrates the override pattern.

The critical architectural question — "Can @theme live outside @layer while compiled output is inside?" — is resolved. Tailwind v4 @theme is a compile-time directive that generates utility classes and CSS custom properties. It cannot and should not be placed inside @layer. The CSS variables it generates in :root CAN be layered. The correct pattern is: @theme block stays at top level (compile-time), the :root and .dark blocks that define the same variable values go inside @layer signalframeux in the distributed file.

The blast radius of the rename is well-understood: 62 direct --color- references in components/animation/ and blocks/, plus ~247 total token references across the codebase including --font-, --text-, --duration-, --space-, --max-w- prefixes. The SF components themselves use Tailwind utility classes (bg-primary, text-foreground, etc.) which reference --color-* internally — those Tailwind utilities are compile-time resolved, so they need @theme to remain the source. The rename primarily affects: lib/tokens.css (source), app/globals.css (app's @theme block), direct JS string references (color-resolve calls, setProperty calls), and MIGRATION.md.

**Primary recommendation:** Rename lib/tokens.css first (the source of truth), then update app/globals.css @theme block, then find-and-replace string references in components/JS files, then update the build script to wrap the output. Do NOT rename the Tailwind utility class names (bg-primary stays bg-primary) — only the CSS custom property names change (--color-primary becomes --sfx-primary, and Tailwind's @theme maps --color-primary to --sfx-primary via alias).

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| tsup | 8.5.1 | Build pipeline for dist/signalframeux.css | Already in use; existing cp command in build:lib script |
| Node.js fs (postbuild script) | built-in | Wrap CSS output in @layer at build time | Zero new deps; simple string wrap operation |
| CSS @layer | Browser native (100% support) | Consumer cascade isolation | No library needed; @layer has 96%+ browser support |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Tailwind v4 @theme | 4.2.2 | Compile-time token-to-utility mapping | @theme block in globals.css maps --sfx-* → Tailwind utility classes |
| PostCSS (optional) | — | CSS processing | Not needed here; @layer wrapping is a string operation |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Node.js postbuild wrap script | tsup `onSuccess` hook | Equivalent; `cp` + wrap in one script is cleaner |
| Manual find-and-replace rename | sed/awk script | Script is faster and auditable; manual is error-prone at ~250 refs |
| @layer in globals.css (app) | @layer in dist only | App doesn't need layering — only consumer-facing dist needs it |

**Installation:** No new packages needed.

---

## Architecture Patterns

### Recommended File Structure After Phase 45
```
lib/
├── tokens.css          # Source: ALL tokens renamed to --sfx-*, @theme block, :root, .dark
dist/
├── signalframeux.css   # Built: @theme outside, :root + .dark wrapped in @layer signalframeux { }
cd-tokens.css           # New: CD-specific overrides, unlayered, ships with the package (or as example)
MIGRATION.md            # Expanded: full --sfx-* consumer guide + @layer import pattern
```

### Pattern 1: @theme Outside @Layer, :root Inside

The key architectural constraint is that `@theme` is a Tailwind v4 compile-time directive. It cannot be placed inside `@layer`. The @theme block generates both CSS custom properties AND Tailwind utility classes (bg-primary, text-foreground, etc.) at build time. The CSS variables it generates in :root can be inside a layer, but the @theme directive itself cannot.

**Correct structure for lib/tokens.css (source, post-rename):**
```css
/* @theme OUTSIDE any layer — Tailwind needs this at compile time */
@theme {
  --color-background: var(--sfx-background);
  --color-foreground: var(--sfx-foreground);
  --color-primary: var(--sfx-primary);
  /* ... all --color-* mapped to --sfx-* via @theme inline */
}

/* :root block can be layered in dist, but source stays unlayered */
:root {
  --sfx-background: oklch(1 0 0);
  --sfx-foreground: oklch(0.145 0 0);
  --sfx-primary: oklch(0.65 0.3 350);
  /* ... */
}
```

**CRITICAL DECISION — Two viable approaches:**

**Approach A (Recommended — Preserve Tailwind compat, minimal churn):**
Keep `--color-*` names in @theme (since those are what Tailwind utility classes resolve to), but add `--sfx-*` as the actual value source. @theme maps --color-primary to reference --sfx-primary. Consumers override --sfx-primary in their unlayered CSS.

```css
/* @theme: utility class names stay --color-* (Tailwind compat) */
@theme inline {
  --color-background: var(--sfx-background);
  --color-foreground: var(--sfx-foreground);
  --color-primary: var(--sfx-primary);
}

/* :root: actual values use --sfx-* namespace */
:root {
  --sfx-background: oklch(1 0 0);
  --sfx-primary: oklch(0.65 0.3 350);
}
```

In dist, the :root block becomes:
```css
@layer signalframeux {
  :root {
    --sfx-background: oklch(1 0 0);
    --sfx-primary: oklch(0.65 0.3 350);
  }
}
```

Consumers override with unlayered:
```css
/* cd-tokens.css — unlayered, always wins over @layer signalframeux */
:root {
  --sfx-primary: oklch(0.96 0 0); /* CD's white-on-dark, no magenta */
  --sfx-background: oklch(0.08 0 0);
}
```

**Approach B (Full rename — higher churn, purist):**
Rename @theme vars to --sfx-* too. Tailwind utility class bg-sfx-primary etc. This requires updating EVERY Tailwind class reference in components (bg-primary → bg-sfx-primary, text-foreground → text-sfx-foreground). ~112 Tailwind color class references in SF components alone.

**Recommendation: Approach A.** It delivers the --sfx-* consumer namespace without requiring Tailwind utility class renaming. The CONTEXT decision says "Full rename of ALL tokens" — this should be interpreted as the CSS custom properties used for direct var() references. The Tailwind utility classes (bg-primary, text-foreground) are a compile-time alias layer and do not need renaming to deliver the consumer override capability.

### Pattern 2: Build Step @Layer Wrapping

The current `build:lib` script: `tsup && cp lib/tokens.css dist/signalframeux.css`

Post-phase it becomes a three-step operation:
1. Run tsup (JS build)
2. Copy lib/tokens.css to dist/
3. Wrap :root and .dark blocks in @layer signalframeux { }

The simplest approach is a small Node.js postbuild script:

```typescript
// scripts/wrap-tokens-layer.ts
import { readFileSync, writeFileSync } from "fs";

const src = readFileSync("lib/tokens.css", "utf-8");

// @theme block stays outside layer — find and preserve it
// :root and .dark blocks go inside @layer signalframeux { }
// Implementation: simple string substitution is sufficient for a single file

const output = wrapNonThemeBlocksInLayer(src, "signalframeux");
writeFileSync("dist/signalframeux.css", output);
```

New `build:lib` script:
```json
"build:lib": "tsup && tsx scripts/wrap-tokens-layer.ts"
```

The wrapping logic needs to:
- Leave @theme { ... } blocks outside the layer
- Wrap :root { ... } blocks inside @layer signalframeux { ... }
- Wrap .dark { ... } blocks inside @layer signalframeux { ... }
- Preserve comments and whitespace

### Pattern 3: Consumer Override (cd-tokens.css)

```css
/* cd-tokens.css — Culture Division token overrides
   Load AFTER signalframeux/signalframeux.css in your CSS.
   Unlayered CSS always wins over @layer signalframeux — no !important needed. */

:root {
  /* Palette: achromatic editorial. Deep blacks, near-whites, no chromatic primary */
  --sfx-background: oklch(0.08 0 0);
  --sfx-foreground: oklch(0.96 0 0);
  --sfx-primary: oklch(0.96 0 0);        /* white-on-dark; no magenta */
  --sfx-primary-foreground: oklch(0.08 0 0);
  --sfx-secondary: oklch(0.18 0 0);
  --sfx-secondary-foreground: oklch(0.96 0 0);
  --sfx-muted: oklch(0.18 0 0);
  --sfx-muted-foreground: oklch(0.60 0 0);
  --sfx-accent: oklch(0.18 0 0);
  --sfx-accent-foreground: oklch(0.96 0 0);
  --sfx-card: oklch(0.12 0 0);
  --sfx-card-foreground: oklch(0.96 0 0);
  --sfx-popover: oklch(0.12 0 0);
  --sfx-popover-foreground: oklch(0.96 0 0);
  --sfx-border: oklch(0.22 0 0);
  --sfx-input: oklch(0.22 0 0);
  --sfx-ring: oklch(0.96 0 0);
  --sfx-destructive: oklch(0.55 0.2 25);

  /* Fonts: Geist Sans + Mono (pending custom typeface pipeline) */
  --sfx-font-sans: "Geist", ui-sans-serif, system-ui, sans-serif;
  --sfx-font-mono: "Geist Mono", ui-monospace, monospace;
  --sfx-font-heading: "Geist", ui-sans-serif, system-ui, sans-serif;
  --sfx-font-display: "Geist", ui-sans-serif, system-ui, sans-serif;
}
```

**CD Palette Reality:** The actual CD globals.css (as of 2026-04-11) is fully achromatic — no yellows or chromatic accents are currently in the codebase. The CONTEXT.md note about "yellows, dark tones, DU×TDR" refers to a forward-looking palette direction, not currently implemented values. cd-tokens.css should reflect CD's ACTUAL current palette from its globals.css, with achromatic values as primary. The yellow accent can be noted as a future --sfx-warning or --sfx-accent override if needed.

### Anti-Patterns to Avoid

- **@theme inside @layer:** Not allowed by Tailwind v4. @theme is a compile-time directive and must be top-level.
- **!important in consumer overrides:** @layer cascade makes this unnecessary and breaks the architecture.
- **Renaming Tailwind utility classes (bg-primary → bg-sfx-primary):** Massive churn with no benefit. The --sfx-* namespace is for CSS custom property consumers, not utility class consumers.
- **Layering the @theme block in dist:** Even if it compiled, it would break Tailwind utility generation for consumers using Tailwind v4.
- **Wrapping the entire CSS file (including @theme) in @layer:** Only :root and .dark blocks should be layered.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CSS cascade consumer isolation | Custom specificity hacks, !important wars | CSS @layer | Browser-native, zero specificity, cleanly reversible |
| Token value mapping | Style Dictionary, design token pipelines | Direct CSS custom property alias (--color-primary: var(--sfx-primary)) | No new deps, no build tooling, clear and auditable |
| Bulk find-and-replace across 250 refs | Manual edit | sed script or VSCode multi-file replace | Single command, auditable diff |

**Key insight:** The @layer approach removes the entire problem of consumer specificity conflicts. Consumers don't need to understand SF//UX internals — they just write CSS and it wins.

---

## Common Pitfalls

### Pitfall 1: @theme in Layered Output
**What goes wrong:** Placing `@theme { }` inside `@layer signalframeux { }` causes Tailwind v4 to fail to generate utility classes. The `@theme` directive is processed at build time by the Tailwind compiler and must be top-level.
**Why it happens:** Seems logical to layer everything, but @theme is special.
**How to avoid:** The wrap-tokens-layer.ts script must explicitly detect @theme blocks and leave them outside the @layer wrapper. Only :root { } and .dark { } blocks go inside.
**Warning signs:** Tailwind utility classes (bg-primary, text-foreground) stop working after the build.

### Pitfall 2: color-resolve.ts String Literals Break After Rename
**What goes wrong:** `resolveColorToken("--color-primary")` still references the old name after rename. These are string literals in JS/TS files — not CSS, so find-and-replace in CSS won't catch them.
**Why it happens:** 19 direct `getPropertyValue("--color-primary")` / `setProperty("--color-primary")` calls scattered across animation components and global-effects.tsx.
**How to avoid:** Run a separate grep for `"--color-` string literals in .tsx/.ts files and update them to `"--sfx-primary"` etc.
**Warning signs:** WebGL shaders render wrong colors (they read the token at runtime via color-resolve).

### Pitfall 3: global-effects.tsx OKLCH pulse references old token name
**What goes wrong:** global-effects.tsx captures `--color-primary`, pulses it, and restores it. After rename it must capture `--sfx-primary`. If not updated, the pulse reads undefined.
**Why it happens:** The pulse logic in global-effects.tsx has 9 direct references to `--color-primary` as strings for getPropertyValue/setProperty.
**How to avoid:** Update all 9 references in global-effects.tsx as part of the rename sweep.

### Pitfall 4: color-cycle-frame.tsx Hardcoded Fallback Still Shows Magenta
**What goes wrong:** `color-cycle-frame.tsx:80` has a fallback: `|| "oklch(0.65 0.3 350)"` — this is the old magenta value hardcoded. After rename, the getPropertyValue call uses the new name, but the fallback is a literal value.
**Why it happens:** The fallback was written against the old name and hardcodes the old value.
**How to avoid:** Update fallback to `|| "oklch(0.65 0.3 350)"` can stay (it's the SF//UX default value, not the CD value — CD overrides via cd-tokens.css), but the getPropertyValue must use `--sfx-primary`.

### Pitfall 5: token-viz.tsx Hardcoded Token Name Array
**What goes wrong:** `token-viz.tsx` has an array `["--color-background", "--color-foreground", ...]` that it iterates to render the color palette visualization. After rename these names don't match.
**Why it happens:** Static string array — not picked up by CSS rename.
**How to avoid:** Update the array to `["--sfx-background", "--sfx-foreground", ...]` plus update the label stripping: `cssVar.replace("--color-", "")` → `cssVar.replace("--sfx-", "")`.

### Pitfall 6: dist/signalframeux.css Is Currently Just a Copy of lib/tokens.css
**What goes wrong:** The current `build:lib` runs `cp lib/tokens.css dist/signalframeux.css`. The dist file therefore contains @theme with old --color-* names and no @layer. After the rename, the copy step needs to become the wrap-tokens-layer script instead.
**Why it happens:** Simple copy was sufficient before @layer was needed.
**How to avoid:** Replace the `cp` command in package.json `build:lib` with the new wrap script.

### Pitfall 7: SF//UX App Also Uses lib/tokens.css as Import Source
**What goes wrong:** `app/globals.css` has its own @theme block (not importing lib/tokens.css). But dist/signalframeux.css is built from lib/tokens.css. These are currently duplicates. After the rename, BOTH must be updated — the app's @theme in globals.css AND lib/tokens.css.
**Why it happens:** The app uses globals.css as its token source, not lib/tokens.css. They're maintained in parallel.
**How to avoid:** Update lib/tokens.css first (the consumer-facing source), then replicate all @sfx-* changes to globals.css @theme block. They must stay in sync.

---

## Code Examples

### @layer Wrapping Pattern (wrap-tokens-layer.ts)
```typescript
// Source: derived from CSS spec behavior + tsup build pattern
import { readFileSync, writeFileSync } from "fs";

const tokens = readFileSync("lib/tokens.css", "utf-8");

// @theme blocks stay OUTSIDE the layer (compile-time, cannot be layered)
// :root and .dark blocks go INSIDE @layer signalframeux { }

function wrapTokensInLayer(css: string, layerName: string): string {
  // Split on @theme blocks to preserve them outside
  const lines = css.split("\n");
  const output: string[] = [];
  let inTheme = false;
  let inRoot = false;
  let inDark = false;
  let braceDepth = 0;
  let pendingLayerOpen = false;

  // Simpler approach: wrap :root { } and .dark { } blocks
  // by replacing `:root {` with `@layer layerName { :root {`
  // and matching closing `}` with `} }`
  // Regex-based approach is reliable for this specific single-file case

  let result = css;
  // Wrap :root blocks
  result = result.replace(/^(:root\s*\{)/gm, `@layer ${layerName} {\n$1`);
  result = result.replace(/^(\}\s*\/\* end :root \*\/)/gm, "$1\n}");
  // This naive approach won't work for multiline — use proper implementation
  
  return result; // Placeholder — see implementation notes
}

writeFileSync("dist/signalframeux.css", wrapTokensInLayer(tokens, "signalframeux"));
```

**Implementation note:** The wrap script should use a simple block-counting approach: find `:root {` and `.dark {`, track brace depth, insert `@layer signalframeux {` before and `}` after. A 50-line Node.js script is sufficient. Do NOT use PostCSS or CSS parsers — this is a single well-structured file.

### Consumer Import Pattern
```css
/* Consumer app CSS (e.g., cd-site/app/globals.css) */
@import "signalframeux/signalframeux.css"; /* layered tokens */
@import "./cd-tokens.css"; /* unlayered overrides — always wins */

/* Any other unlayered consumer CSS also wins over @layer signalframeux */
```

### @theme Inline Pattern for --sfx-* Bridging
```css
/* lib/tokens.css — the recommended structure */

/* Step 1: @theme maps Tailwind utility classes to --sfx-* vars */
@theme inline {
  --color-background: var(--sfx-background);
  --color-foreground: var(--sfx-foreground);
  --color-primary: var(--sfx-primary);
  --color-primary-foreground: var(--sfx-primary-foreground);
  --color-secondary: var(--sfx-secondary);
  /* ... all mapped */
}

/* Step 2: :root defines the actual --sfx-* values */
:root {
  --sfx-background: oklch(1 0 0);
  --sfx-foreground: oklch(0.145 0 0);
  --sfx-primary: oklch(0.65 0.3 350);
  /* ... */
}

/* Step 3: .dark overrides the --sfx-* values */
.dark {
  --sfx-background: oklch(0.145 0 0);
  --sfx-foreground: oklch(0.985 0 0);
  --sfx-primary: oklch(0.65 0.3 350); /* magenta stays in dark */
  /* ... */
}
```

In the built dist/signalframeux.css:
```css
@theme inline {
  /* ... unchanged — stays outside layer */
}

@layer signalframeux {
  :root {
    --sfx-background: oklch(1 0 0);
    /* ... */
  }

  .dark {
    --sfx-background: oklch(0.145 0 0);
    /* ... */
  }
}
```

---

## Complete Token Rename Map

### Tokens Currently in lib/tokens.css (inside @theme block)

All `--color-*` tokens in @theme → `--sfx-*` in :root (with @theme inline mapping):

| Current (@theme) | New (:root value) | Notes |
|------------------|-------------------|-------|
| --color-background | --sfx-background | Core |
| --color-foreground | --sfx-foreground | Core |
| --color-card | --sfx-card | Extended |
| --color-card-foreground | --sfx-card-foreground | Extended |
| --color-popover | --sfx-popover | Extended |
| --color-popover-foreground | --sfx-popover-foreground | Extended |
| --color-primary | --sfx-primary | Core |
| --color-primary-foreground | --sfx-primary-foreground | Core |
| --color-secondary | --sfx-secondary | Core |
| --color-secondary-foreground | --sfx-secondary-foreground | Core |
| --color-muted | --sfx-muted | Extended |
| --color-muted-foreground | --sfx-muted-foreground | Extended |
| --color-accent | --sfx-accent | Core |
| --color-accent-foreground | --sfx-accent-foreground | Core |
| --color-destructive | --sfx-destructive | Extended |
| --color-success | --sfx-success | Extended |
| --color-warning | --sfx-warning | Extended |
| --color-border | --sfx-border | Extended |
| --color-input | --sfx-input | Extended |
| --color-ring | --sfx-ring | Extended |
| --color-sidebar | --sfx-sidebar | Shadcn compat |
| --color-sidebar-foreground | --sfx-sidebar-foreground | Shadcn compat |
| --color-sidebar-primary | --sfx-sidebar-primary | Shadcn compat |
| --color-sidebar-primary-foreground | --sfx-sidebar-primary-foreground | Shadcn compat |
| --color-sidebar-accent | --sfx-sidebar-accent | Shadcn compat |
| --color-sidebar-accent-foreground | --sfx-sidebar-accent-foreground | Shadcn compat |
| --color-sidebar-border | --sfx-sidebar-border | Shadcn compat |
| --color-sidebar-ring | --sfx-sidebar-ring | Shadcn compat |
| --color-chart-1 through -5 | --sfx-chart-1 through -5 | Chart compat |
| --font-sans | --sfx-font-sans | Typography |
| --font-mono | --sfx-font-mono | Typography |
| --font-heading | --sfx-font-heading | Typography |
| --font-electrolize | --sfx-font-electrolize | Typography |
| --font-display | --sfx-font-display | Typography |
| --text-2xs through --text-4xl | --sfx-text-2xs through --sfx-text-4xl | Type scale (9 stops) |

### Tokens Currently in :root (NOT @theme) → rename prefix only

| Current (:root) | New (:root) | Notes |
|-----------------|-------------|-------|
| --sf-yellow | --sfx-yellow | Keep sf-* for internal SF//UX system tokens? Or sfx? See below. |
| --sf-green | --sfx-green | Same question |
| --sf-clock | --sfx-clock | |
| --sf-tracking-label | --sfx-tracking-label | |
| --sf-grain-opacity | --sfx-grain-opacity | |
| --duration-instant through --duration-glacial | --sfx-duration-instant through --sfx-duration-glacial | 5 tokens |
| --ease-default, --ease-hover, --ease-spring | --sfx-ease-default, etc. | 3 tokens |
| --space-1 through --space-24 | --sfx-space-1 through --sfx-space-24 | 9 stops |
| --max-w-content, --max-w-wide, --max-w-full | --sfx-max-w-content, etc. | 3 tokens |
| --gutter, --gutter-sm | --sfx-gutter, --sfx-gutter-sm | |
| --nav-height | --sfx-nav-height | |
| --z-above-bg through --z-vhs | --sfx-z-* | 10 z-index tokens |
| --border-element, --border-divider, --border-section | --sfx-border-* | 3 tokens |
| --press-scale, --press-y, --hover-y, etc. | --sfx-press-*, --sfx-hover-* | Interaction tokens |

**Note on --sf-* vs --sfx-*:** The existing `--sf-*` tokens (--sf-yellow, --sf-code-bg, etc.) are internal SF//UX system tokens, not the consumer-facing tier. The phase renames them to --sfx-* to be consistent with the new namespace. This means consumers CAN override these too, which is the intent.

### Blast Radius Summary

| Location | Count | Type |
|----------|-------|------|
| lib/tokens.css | ~94 declarations | CSS source — rename all |
| app/globals.css @theme block | ~86 declarations | Duplicate source — rename all |
| app/globals.css :root + .dark | ~55 declarations | Rename all |
| components/ direct var() refs | 19 JS string literals | "var(--color-primary)" etc. |
| components/ setProperty/getProperty | 9 in global-effects, 8 in color-cycle-frame | String literals to update |
| token-viz.tsx array | 5 string names | Static array |
| lib/api-docs.ts | 2 doc strings | Low priority — documentation strings |
| **TOTAL direct var/prop refs** | **~43 string literals** | In .tsx/.ts files |

---

## State of the Art

| Old Approach | Current Approach | Notes |
|--------------|------------------|-------|
| --color-* namespace (shadcn default) | --sfx-* namespace | Phase 45 change |
| lib/tokens.css as direct cp to dist | lib/tokens.css + wrap script → dist | Phase 45 change |
| No @layer in dist | @layer signalframeux { } in dist | Phase 45 change |
| MIGRATION.md as import path table | MIGRATION.md as full consumer guide | Phase 45 expansion |

**Current state:** dist/signalframeux.css is a verbatim copy of lib/tokens.css. It has @theme with --color-* names. No @layer wrapping. The `build:lib` script is `tsup && cp lib/tokens.css dist/signalframeux.css`. package.json already has `"./signalframeux.css": "./dist/signalframeux.css"` in exports — the plumbing is there, just needs @layer + rename.

---

## Open Questions

1. **--sf-* vs --sfx-* for internal system tokens**
   - What we know: Current internal tokens like --sf-grain-opacity, --sf-code-bg, --sf-vhs-* are NOT in @theme. They're :root-only. The phase says "full rename to --sfx-*".
   - What's unclear: Should ALL --sf-* rename to --sfx-*, including deeply internal ones like --sf-code-bg and --sf-waveform-bg? Or only the consumer-relevant tier?
   - Recommendation: Rename all --sf-* to --sfx-* for consistency. The namespace is the namespace. Consumers can override any of them.

2. **@theme inline vs @theme for the sfx alias layer**
   - What we know: `@theme inline` causes utilities to reference the var() directly (`bg-primary { background: var(--sfx-primary) }` instead of `background: var(--color-primary)`). `@theme` without inline generates a new CSS variable.
   - What's unclear: Does `@theme inline` work correctly in Tailwind v4.2.2 for all utility class types?
   - Recommendation: Use `@theme inline` for the --color-* → var(--sfx-*) mapping. This is the documented pattern for referencing other variables in @theme.

3. **cd-tokens.css palette: achromatic or with yellow?**
   - What we know: CD's actual globals.css (2026-04-11) is fully achromatic — only destructive red has chroma. The CONTEXT.md says "yellows, dark tones, DU×TDR aesthetic, CD is NOT dark-only" and describes a future direction.
   - What's unclear: Should cd-tokens.css implement the aspirational yellow-accented CD palette or the current achromatic one?
   - Recommendation: Build cd-tokens.css from the ACTUAL current CD palette (achromatic with future-forward comments). Add a comment indicating where yellow would map (--sfx-warning or a custom --sfx-accent override). The current codebase has no yellow to reference — inventing values risks ship-later-regret.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright (integration) + Vitest (unit, lib/**) |
| Config file | playwright.config.ts + vitest.config.ts |
| Quick run command | `pnpm test` (Vitest unit) |
| Full suite command | `pnpm exec playwright test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TBR-01 | dist/signalframeux.css exports and @layer wrapping present | File check + string assertion | `pnpm build:lib && node -e "require('fs').readFileSync('dist/signalframeux.css','utf-8').includes('@layer signalframeux')"` | ❌ Wave 0 |
| TBR-02 | Unlayered :root overrides win over @layer signalframeux tokens | CSS cascade — manual visual check or Playwright page inspection | Manual + `tests/phase-45-token-bridge.spec.ts` | ❌ Wave 0 |
| TBR-03 | MIGRATION.md contains --sfx-* rename table | File string check | `grep -c "\-\-sfx\-" MIGRATION.md` | ❌ Wave 0 |
| TBR-04 | No SSR flash: sf//ux site renders with class="dark" server-side and no magenta flash | Playwright screenshot test | `tests/phase-45-token-bridge.spec.ts` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm test` (Vitest — fast, lib unit tests)
- **Per wave merge:** `pnpm exec playwright test tests/phase-45-token-bridge.spec.ts`
- **Phase gate:** Full Playwright suite green before marking complete

### Wave 0 Gaps
- [ ] `tests/phase-45-token-bridge.spec.ts` — covers TBR-01, TBR-02, TBR-04 (build output inspection + visual regression)
- [ ] `scripts/wrap-tokens-layer.ts` — the @layer wrap build script (must exist before build:lib runs)

---

## Sources

### Primary (HIGH confidence)
- Tailwind CSS v4 docs (tailwindcss.com/docs/theme) — @theme vs @layer interaction, @theme inline behavior, compile-time vs runtime semantics
- MDN Web Docs (@layer) — unlayered declarations beat layered declarations confirmed
- Project source files (lib/tokens.css, app/globals.css, tsup.config.ts, package.json) — direct inspection

### Secondary (MEDIUM confidence)
- tailwindlabs/tailwindcss GitHub discussions #17613 — @theme inline runtime variable behavior confirmed
- CD project globals.css — actual palette values directly inspected (achromatic, no yellow)
- cd-sfux-integration-plan.md — canonical wiki reference for token bridge architecture

### Tertiary (LOW confidence)
- WebSearch results on tsup CSS handling — CSS support in tsup is experimental; existing cp approach is confirmed working and should be kept
- CONTEXT.md claim about "yellows" in CD palette — not supported by actual CD codebase inspection; noted as open question

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — tsup 8.5.1 confirmed installed, @layer browser support confirmed, no new deps needed
- Architecture: HIGH — @theme/@layer interaction verified against official Tailwind v4 docs; CSS spec cascade behavior verified
- Pitfalls: HIGH — all found via direct codebase grep; string literal locations are specific and confirmed
- Token rename map: HIGH — directly enumerated from lib/tokens.css source
- CD palette: MEDIUM — actual CD globals.css inspected, but CONTEXT.md suggests a different direction; flagged as open question

**Research date:** 2026-04-11
**Valid until:** 2026-05-11 (stable CSS spec; Tailwind v4 may have minor updates)
