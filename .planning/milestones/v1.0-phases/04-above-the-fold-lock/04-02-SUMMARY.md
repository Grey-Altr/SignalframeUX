---
phase: 04-above-the-fold-lock
plan: "02"
subsystem: crafted-states
tags: [error-page, empty-states, frame-signal, reduced-motion, gsap-scrambletext]
dependency_graph:
  requires: [components/sf/index.ts, lib/gsap-plugins.ts, app/globals.css]
  provides: [app/error.tsx, app/not-found.tsx, crafted-empty-states]
  affects: [components/blocks/components-explorer.tsx, components/blocks/api-explorer.tsx, components/blocks/token-tabs.tsx]
tech_stack:
  added: []
  patterns: [frame-signal-dual-layer, reduced-motion-guard, data-anim-css-initial-state]
key_files:
  created: []
  modified:
    - app/error.tsx
    - app/not-found.tsx
    - app/globals.css
    - components/blocks/components-explorer.tsx
    - components/blocks/api-explorer.tsx
    - components/blocks/token-tabs.tsx
decisions:
  - "error.tsx ScrambleText guarded with matchMedia reduce before async gsap-plugins import — prevents unnecessary code load on reduced-motion devices"
  - "not-found.tsx is Server Component using data-anim='page-heading' — wired to existing initPageHeadingScramble automatically, no new client wrapper needed"
  - "ComponentsExplorer empty state resets both searchInput and searchQuery (debounced) to avoid stale state mismatch"
  - "token-tabs.tsx placeholder uses SFButton with ghost intent matching existing toggle — single button pattern preserved, not duplicated"
  - "api-explorer.tsx arrow removed from CTA text — cleaner, consistent with other CTAs in the system"
metrics:
  duration_minutes: 3
  completed_date: "2026-04-05"
  tasks_completed: 2
  files_modified: 6
requirements: [ATF-04, ATF-05]
requirements_completed: [ATF-04, ATF-05]
---

# Phase 04 Plan 02: Crafted States — FRAME+SIGNAL Design Moments Summary

**One-liner:** Error, 404, and three empty states redesigned as FRAME+SIGNAL design moments — SFContainer/SFText FRAME structure with ScrambleText SIGNAL expression, DU/TDR voice throughout, full reduced-motion coverage.

## Tasks Completed

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | Craft error.tsx and not-found.tsx as FRAME+SIGNAL moments | faed310 | app/error.tsx, app/not-found.tsx, app/globals.css |
| 2 | Add designed empty states to ComponentsExplorer, API explorer, token explorer | 8b64dbe | components/blocks/components-explorer.tsx, components/blocks/api-explorer.tsx, components/blocks/token-tabs.tsx |

## What Was Built

**error.tsx:** Rewritten as a FRAME+SIGNAL design moment. SFContainer enforces max-width/gutters. SFText handles body/small copy with semantic variants. Large "ERROR" display element carries both `sf-glitch` (VHS CSS animation) and `data-anim="error-code"` for GSAP ScrambleText. The ScrambleText effect is gated behind a `matchMedia` check before the async import of `@/lib/gsap-plugins` — no unnecessary code load on reduced-motion devices. Spacing uses blessed stops: mb-4 (16px), mb-6 (24px), mb-8 (32px).

**not-found.tsx:** Server Component (no `"use client"`) rewritten with SFContainer + SFText FRAME structure. Uses `data-anim="page-heading"` on the 404 heading — automatically picked up by the existing `initPageHeadingScramble()` in page-animations.tsx, requiring no new client wrapper. `suppressHydrationWarning` added to the heading since ScrambleText mutates textContent. Primary color accent on the "0" preserved.

**globals.css:** Added `[data-anim="error-code"] { opacity: 0; }` as an initial state rule (before the catch-all, so GSAP can animate from hidden). Added `[data-anim="error-code"]` to the reduced-motion reset block so it gets `opacity: 1 !important` when animations are suppressed.

**ComponentsExplorer empty state:** When `filtered.length === 0`, the grid area renders "0 MATCHES" in sf-display typography with `text-muted-foreground`. A "RESET FILTERS" button resets both `searchInput` and `searchQuery` state setters (debounced search has two state vars). Uses `py-24` (96px) blessed stop, `border-b-2 border-foreground` hard edge, DU/TDR tone ("NO COMPONENTS MATCH THE CURRENT FILTER.").

**API explorer COMING SOON placeholder:** Updated copy from generic "UNDER CONSTRUCTION" to split-line DU/TDR voice: "API DOCUMENTATION FOR THIS COMPONENT IS UNDER CONSTRUCTION. / THE SIGNAL WILL BE TRANSMITTED WHEN READY." Tracking widened from 0.1em to 0.15em. Arrow removed from CTA button text.

**Token explorer structural placeholder:** Added below the `visibleScales.map()` grid, visible only when `!showAll`. Shows extended scale count (`COLOR_SCALES.length - CORE_SCALE_COUNT = 43`), DU/TDR technical copy ("FULL SPECTRUM COVERAGE AT 8-DEGREE HUE INTERVALS"), and a "SHOW ALL {N} SCALES" CTA using the existing `setShowAll(true)` toggle. `border-t-2 border-foreground` divider, `py-12` (48px) blessed spacing.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed pre-existing TypeScript build errors**
- **Found during:** Build verification for Task 1
- **Issue:** Two pre-existing TS errors blocked `npm run build`: `color-cycle-frame.tsx:79` (`useRef()` missing argument, noted in agent memory) and `dark-mode-toggle.tsx:47` (`webkitBackdropFilter` not on `CSSStyleDeclaration`). Both were already fixed in a previous stash that included other in-progress work.
- **Fix:** `useRef<ReturnType<typeof setTimeout> | undefined>(undefined)` for the timer ref; `(bloom.style as CSSStyleDeclaration & { webkitBackdropFilter: string }).webkitBackdropFilter` cast for the webkit property.
- **Files modified:** components/animation/color-cycle-frame.tsx, components/layout/dark-mode-toggle.tsx
- **Commit:** faed310 (bundled with Task 1)

**2. [Rule 2 - Missing] token-tabs placeholder uses SFButton ghost instead of raw button**
- **Found during:** Task 2 Part C implementation
- **Issue:** Plan specified a raw `<button>` with `sf-pressable sf-invert-hover` classes. However, the existing "SHOW ALL" toggle button already uses `SFButton intent="ghost"` pattern. Adding a second raw button would create inconsistency.
- **Fix:** Used `SFButton intent="ghost" onClick={() => setShowAll(true)}` matching the existing toggle pattern, rather than a duplicate raw button. The existing toggle button handles "SHOW CORE" / "SHOW ALL" toggle; the new placeholder is only visible when `!showAll` and always calls `setShowAll(true)`.
- **Files modified:** components/blocks/token-tabs.tsx

## Decisions Made

- **ScrambleText guard pattern:** `matchMedia` check before async `gsap-plugins` import — most efficient approach, prevents code fetch on reduced-motion devices entirely.
- **not-found.tsx Server Component:** `data-anim="page-heading"` reuses the existing PageAnimations scramble system rather than adding a new client boundary. Cleaner, zero new code paths.
- **ComponentsExplorer state reset:** Must reset both `searchInput` (controlled input value) and `searchQuery` (debounced actual filter value) to avoid the search box appearing empty while the filter still applies.
- **token-tabs placeholder position:** Placed inside the `<SFTabsContent>` but outside the `color-scale-grid` div — ensures it's always visible below the grid, not inside the scrollable area.

## Self-Check: PASSED

All 6 modified files verified on disk. Both task commits (faed310, 8b64dbe) confirmed in git log. Build passes cleanly with zero TypeScript errors.
