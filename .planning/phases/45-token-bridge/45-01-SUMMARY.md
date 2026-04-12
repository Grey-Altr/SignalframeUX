---
phase: 45-token-bridge
plan: 01
subsystem: tokens
tags: [css-tokens, tailwind-v4, consumer-override, build-pipeline]
dependency_graph:
  requires: []
  provides: [sfx-token-namespace, layer-wrapped-dist, @theme-inline-bridge]
  affects: [app/globals.css, lib/tokens.css, dist/signalframeux.css, all-var-consumers]
tech_stack:
  added: []
  patterns: [@theme-inline aliasing, @layer signalframeux isolation, tsx build script]
key_files:
  created:
    - scripts/wrap-tokens-layer.ts
  modified:
    - lib/tokens.css
    - app/globals.css
    - package.json
    - dist/signalframeux.css
decisions:
  - "@theme inline (not bare @theme) used so Tailwind utilities reference --sfx-* vars directly at runtime"
  - "All --sf-* extension tokens renamed to --sfx-* for namespace consistency"
  - "next/font vars (--font-inter, --font-anton, --font-jetbrains) left unchanged — Next.js generates these"
  - "wrap-tokens-layer.ts uses block-level parsing (not regex) for correctness with multiline CSS blocks"
metrics:
  duration: "8 minutes"
  completed: "2026-04-12"
  tasks_completed: 2
  tasks_total: 2
  files_modified: 4
  files_created: 1
requirements: [TBR-01, TBR-02]
---

# Phase 45 Plan 01: Token Bridge — --sfx-* Namespace + @layer Build Pipeline Summary

**One-liner:** @theme inline aliasing with --sfx-* namespace in lib/tokens.css + app/globals.css, @layer signalframeux wrapping in dist/signalframeux.css via tsx build script.

## What Was Built

### Task 1: lib/tokens.css rename + build pipeline (commits: 04bd46d)

Rewrote `lib/tokens.css` from a flat `@theme { --color-*: oklch(...) }` block to the two-tier pattern:

- `@theme inline { --color-background: var(--sfx-background); ... }` — Tailwind utility class aliases, pointing to `--sfx-*`
- `:root { --sfx-background: oklch(1 0 0); ... }` — actual values under the new namespace
- `.dark { --sfx-background: oklch(0.145 0 0); ... }` — dark overrides

All token categories renamed: 33 colors, 9 radius values, 5 fonts, 10 type scale stops, 29 --sf-* extension vars, 5 duration tokens, 3 ease tokens, 9 spacing tokens, 6 layout tokens, 9 z-index tokens, 3 border tokens, 5 interaction tokens, 15 semantic typography tokens, 3 signal runtime tokens.

Created `scripts/wrap-tokens-layer.ts` — a block-level state machine parser that reads `lib/tokens.css` and emits `dist/signalframeux.css` with `@theme inline` outside the layer and `:root`/`.dark` blocks wrapped in `@layer signalframeux { }`.

Updated `package.json` `build:lib` from `tsup && cp lib/tokens.css dist/signalframeux.css` to `tsup && tsx scripts/wrap-tokens-layer.ts`.

### Task 2: app/globals.css rename (commit: b604740)

Full rewrite of `app/globals.css` token sections (lines 1–287 equivalent) to match lib/tokens.css structure exactly. Then replaced all ~366 `--sfx-*` references throughout the utility classes, keyframes, and component styles:

- `var(--sf-*)` → `var(--sfx-*)` across all occurrences
- `var(--duration-*)` → `var(--sfx-duration-*)`
- `var(--ease-*)` → `var(--sfx-ease-*)`
- `var(--space-*)` → `var(--sfx-space-*)`
- `var(--press-*)`, `var(--hover-y)`, `var(--focus-ring-*)` → `var(--sfx-*)`
- `var(--z-*)`, `var(--border-*)`, `var(--gutter)`, `var(--nav-height)` → `var(--sfx-*)`
- All `var(--color-*)` fallback literals in utility classes → `var(--sfx-*)` fallbacks
- `[data-bg-shift]` contrast override updated to `--sfx-muted-foreground`

## Acceptance Criteria Status

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | lib/tokens.css has `@theme inline` + maps --color-background to var(--sfx-background) | PASS |
| AC-2 | lib/tokens.css :root has `--sfx-background:` OKLCH value, no --color-background in :root | PASS |
| AC-3 | lib/tokens.css .dark has `--sfx-background:` dark value | PASS |
| AC-4 | All --sfx-duration-instant, --sfx-space-1, --sfx-ease-default etc. present in :root | PASS |
| AC-5 | app/globals.css has `@theme inline` | PASS |
| AC-6 | Zero `var(--sf-[^x]` in app/globals.css | PASS |
| AC-7 | Zero `var(--duration-`, `var(--space-`, `var(--ease-` in globals.css | PASS |
| AC-8 | `pnpm build:lib` produces dist/signalframeux.css with `@layer signalframeux {` wrapping :root/.dark | PASS |
| AC-9 | `@theme inline` exists outside @layer in dist/signalframeux.css | PASS |
| AC-10 | `pnpm tsc --noEmit` passes with zero type errors | PASS |

## Verification Results

```
sfx- refs in lib/tokens.css:    242 (expect 100+) ✓
@theme inline in lib/tokens.css: 2 (1 comment + 1 directive, expect ≥1) ✓
sfx- refs in app/globals.css:   366 (expect 200+) ✓
@layer signalframeux in dist:    present ✓
@theme inline in dist:           present outside @layer ✓
pnpm build:lib:                  succeeds ✓
pnpm tsc --noEmit:               zero errors ✓
```

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing functionality] --color-muted-foreground override in [data-bg-shift]**
- **Found during:** Task 2
- **Issue:** The `[data-bg-shift]` rule was overriding `--color-muted-foreground` directly — this would now be a stale override since the @theme alias points to `--sfx-muted-foreground`. Updated to override `--sfx-muted-foreground` instead.
- **Fix:** Changed `--color-muted-foreground: oklch(0.65 0 0)` to `--sfx-muted-foreground: oklch(0.65 0 0)` in the data-bg-shift rule.
- **Files modified:** app/globals.css
- **Commit:** b604740

**2. [Rule 1 - Bug] @theme inline count shows 2 in lib/tokens.css**
- **Found during:** Verification
- **Issue:** `grep -c "@theme inline"` returns 2 because one match is in a comment line. AC-1 requires "at least one match" — passes correctly. No fix needed; noted for clarity.

None — all plan tasks executed exactly as written otherwise.

## Architecture Notes

The consumer override pattern is now live:

```css
/* Consumer app (e.g. cd-site) */
@import "signalframeux/signalframeux.css"; /* @layer signalframeux — layered, can be overridden */

/* cd-tokens.css — unlayered, always wins */
:root {
  --sfx-primary: oklch(0.96 0 0); /* overrides SF//UX magenta */
  --sfx-background: oklch(0.08 0 0);
}
```

Tailwind utility classes (`bg-primary`, `text-foreground`) continue working unchanged — they resolve through `@theme inline` aliases at compile time.

## Self-Check: PASSED

All files present:
- FOUND: lib/tokens.css
- FOUND: app/globals.css
- FOUND: scripts/wrap-tokens-layer.ts
- FOUND: dist/signalframeux.css

All commits present:
- b604740: feat(45-01): rename app/globals.css to --sfx-* namespace
- 04bd46d: feat(45-01): rename lib/tokens.css to --sfx-* namespace + create @layer build pipeline
