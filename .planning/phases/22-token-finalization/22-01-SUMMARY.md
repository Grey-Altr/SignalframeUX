---
phase: 22-token-finalization
plan: "01"
subsystem: tokens
tags: [globals.css, tailwind-v4, oklch, color-tokens, webgl-bridge]
dependency_graph:
  requires: []
  provides: [bg-success, text-success, border-success, bg-warning, text-warning, border-warning]
  affects: [components/sf/sf-alert.tsx, components/sf/sf-status-dot.tsx, components/sf/sf-toast.tsx, components/blocks/components-explorer.tsx]
tech_stack:
  added: []
  patterns: [tailwind-v4-@theme-utility-generation, 1x1-canvas-color-probe]
key_files:
  created: []
  modified:
    - app/globals.css
key_decisions:
  - "--color-success and --color-warning belong in @theme (not :root) because Tailwind v4 only generates utilities from @theme-declared custom properties"
  - "No dark mode overrides needed — L=0.85 green and L=0.91 yellow have sufficient contrast against L=0.145 background"
  - "color-resolve.ts requires zero code changes — WebGL bridge resolves only opaque core tokens, never success/warning"
metrics:
  duration: "~86 seconds"
  completed: "2026-04-06T22:20:59Z"
  tasks_completed: 2
  files_modified: 1
  files_created: 0
---

# Phase 22 Plan 01: Token Finalization — success/warning into @theme Summary

**One-liner:** Migrated --color-success and --color-warning from :root into @theme so Tailwind v4 generates bg-success, border-success, bg-warning, border-warning utilities; confirmed WebGL bridge has zero callers of these tokens.

## What Was Built

Moved two OKLCH color token declarations from the `:root` extension block into the `@theme` block in `app/globals.css`. This single-file change unblocks four components (SFAlert, SFStatusDot, SFToast, ComponentsExplorer) that reference Tailwind utility classes (`bg-success`, `border-success`, `text-success`, `border-warning`) which were previously resolving to nothing because Tailwind v4 only generates utilities from tokens declared inside `@theme`.

**Token placement (after migration):**

Inside `@theme` (generates utilities):
```css
/* ── Extended Palette — status/feedback colors ── */
--color-success: oklch(0.85 0.25 145);
--color-warning: oklch(0.91 0.18 98);
```

`:root` extension block (unchanged, sf-namespaced decorative aliases):
```css
--sf-yellow: oklch(0.91 0.18 98);
--sf-green: oklch(0.85 0.25 145);
```

**WebGL bridge audit (lib/color-resolve.ts):**
- Uses 1x1 canvas probe via `ctx.fillStyle` — browser's native OKLCH parser
- Magenta fallback `{ r: 255, g: 0, b: 128 }` on empty `getPropertyValue`
- MutationObserver on `:root` class/style attributes for cache invalidation
- Callers: signal-mesh.tsx (`--color-primary`), glsl-hero.tsx (`--color-primary` + TTL), token-viz.tsx (`--color-foreground`, `--color-background`, core 5)
- No caller references `--color-success` or `--color-warning`
- Zero code changes required

## Acceptance Criteria Results

| AC | Description | Result |
|----|-------------|--------|
| AC-1 | bg-success, text-success, border-success, bg-warning, text-warning, border-warning generated | PASS — confirmed in .next/static/css/*.css |
| AC-2 | --color-success and --color-warning absent from :root | PASS — grep confirms no presence |
| AC-3 | --sf-yellow and --sf-green remain in :root untouched | PASS — lines 107-108 unchanged |
| AC-4 | color-resolve.ts requires zero code changes | PASS — git diff empty |
| AC-5 | pnpm tsc --noEmit exits 0 | PASS — zero errors |

Build also passes: `pnpm build` exits 0, 8/8 static pages generated.

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check

**Created files:**
- `.planning/phases/22-token-finalization/22-01-SUMMARY.md` — this file

**Commits:**
- `c71c9d8` — feat(22-01): move success/warning tokens from :root to @theme
- `bfed30c` — chore(22-01): audit color-resolve.ts WebGL bridge — zero code changes

## Self-Check: PASSED

All AC verified. Build clean. No regressions. No code changes to color-resolve.ts.
