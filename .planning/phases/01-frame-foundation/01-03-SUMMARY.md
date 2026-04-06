---
phase: 01-frame-foundation
plan: "03"
subsystem: token-system
tags: [css-fallbacks, print-stylesheet, accessibility, token-resilience]
dependency-graph:
  requires: [01-01]
  provides: [css-fallback-values, print-stylesheet]
  affects: [globals.css]
tech-stack:
  added: []
  patterns: [css-custom-property-fallbacks, media-print, signal-layer-suppression]
key-files:
  created: []
  modified:
    - app/globals.css
decisions:
  - Motion tokens (duration, ease) intentionally exempt from fallbacks per CONTEXT.md — decorative properties only
  - Z-index tokens intentionally exempt from fallbacks — numeric values with no visual silent-failure risk
  - Commented-out sf-cursor block (lines 1240-1300) left as-is — dead code, not active CSS
  - Custom property declarations in :root (e.g. --text-heading-1-family: var(--font-display)) exempt — these are declarations not consumers
  - print position: static applied only to nav/scroll-to-top/fixed/sticky selectors, NOT blanket * — preserves flex/grid layout structure
metrics:
  duration: "180s"
  tasks-completed: 2
  tasks-total: 2
  files-modified: 1
  completed-date: "2026-04-06"
  commits: [7f94179, 01118d9]
requirements_completed: [FRM-04, FRM-08]
---

# Phase 1 Plan 3: CSS Fallbacks and Print Stylesheet Summary

**One-liner:** Added OKLCH literal fallbacks to all active critical var() calls (colors, fonts) and appended a @media print block that suppresses the Signal layer, inverts dark surfaces, and preserves flex/grid layout structure.

## What Was Built

### Task 1: CSS Fallback Values on All Critical var() Usages (7f94179)

Added inline comma-fallback values to all active CSS rule consumers of critical custom properties in globals.css:

**Color fallbacks added (36 changes):**
- `var(--color-background, oklch(1 0 0))` — background surface
- `var(--color-foreground, oklch(0.145 0 0))` — text/border
- `var(--color-primary, oklch(0.65 0.3 350))` — magenta accent (most frequent)
- `var(--color-muted, oklch(0.930 0.005 298))` — skeleton background
- `var(--color-destructive, oklch(0.550 0.180 25))` — error state
- `var(--color-border, oklch(0.205 0 0))` — border default
- `var(--color-ring, oklch(0.65 0.3 350))` — focus ring
- `var(--sf-yellow, oklch(0.91 0.18 98))` — yellow band
- `var(--sf-inset-shadow-color, oklch(0 0 0 / 0.2))` — press feedback

**Font fallbacks added (8 changes):**
- `var(--font-sans, "Inter", system-ui, sans-serif)` — all body/UI utility classes
- `var(--font-display, "Anton", "Impact", sans-serif)` — heading-1, display utilities

**Intentionally exempt:**
- Motion tokens (`--duration-*`, `--ease-*`) — decorative, per CONTEXT.md
- Z-index tokens — no silent visual failure risk
- Commented-out sf-cursor block (lines 1240–1300) — dead code
- Custom property declarations in `:root` (e.g. `--text-heading-1-family: var(--font-display)`) — these are declarations not consumers

### Task 2: @media print Stylesheet (01118d9)

Appended complete print stylesheet at end of globals.css (after line 1643):

**Signal layer suppression (display: none !important):**
- `.vhs-overlay`, `.vhs-crt`, `.vhs-noise`, `.vhs-scanlines`
- `[data-anim]` — GSAP animated elements
- `.sf-cursor` — custom cursor
- `.sf-grain::after` — grain texture
- `.sf-idle-overlay` — idle standby overlay
- GSAP debug markers (`gsap-marker-*`)

**Dark surface inversion:**
- `body`, `.dark body`, `.dark` → `background: white !important; color: black !important`
- `* { color: black !important }` — universal text contrast

**Layout preservation:**
- `position: static` applied only to `nav`, `.scroll-to-top`, `[style*="position: fixed"]`, `[style*="position: sticky"]`
- No blanket `* { position: static }` — flex/grid layout structure preserved

**Utility additions:**
- `.sf-border { border-color: black !important }` — visible borders on paper
- `button, [role="button"] { display: none !important }` — hide interactive-only elements
- `a[href]::after { content: " (" attr(href) ")" }` — show URLs for reference
- `body { max-width: 100% !important; padding: 1cm !important }` — page-width content

## Acceptance Criteria Status

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | Zero color var() calls without comma-fallback (outside @theme/comments) | PASS |
| AC-2 | Zero font var() calls without comma-fallback in non-@theme utility contexts | PASS |
| AC-3 | Motion/decorative var() calls (--duration-*, --ease-*) intentionally exempt | PASS |
| AC-4 | Exactly one `@media print` match in globals.css | PASS |
| AC-5 | `.vhs-overlay` has `display: none !important` in print block | PASS |
| AC-6 | `body` in print block has `background: white` and `color: black` | PASS |
| AC-7 | Layout/spacing var() calls — no var(--max-w-*), var(--gutter*), var(--nav-height) consumers found in globals.css (only declarations in :root) | PASS |

## Deviations from Plan

None — plan executed exactly as written.

## Requirements Covered

- FRM-04: CSS custom property fallbacks on all critical var() calls — components render with fallback when token undefined
- FRM-08: Print stylesheet exists, inverts dark backgrounds, suppresses Signal layer, preserves layout

## Self-Check: PASSED

Files verified:
- app/globals.css modified: FOUND
- Commit 7f94179: FOUND (`feat(01-03): add CSS fallback values to all critical var() usages`)
- Commit 01118d9: FOUND (`feat(01-03): add @media print stylesheet at end of globals.css`)
- `@media print` count = 1: CONFIRMED
- `background: white !important` in print block: CONFIRMED
- `display: none !important` for Signal layer in print: CONFIRMED
- `position: static` only for nav/fixed/sticky (not blanket *): CONFIRMED
- Active color var() calls without fallback: 0 (commented-out block excluded)
- Font var() utility class fallbacks: CONFIRMED (8 changes)
