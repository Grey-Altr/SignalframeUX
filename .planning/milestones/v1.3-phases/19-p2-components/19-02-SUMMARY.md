---
phase: 19-p2-components
plan: 02
subsystem: sf-components
tags: [navigation-menu, components-explorer, frame, mobile, sheet, radix]
dependency_graph:
  requires: [navigation-menu-base, sf-sheet, sf-toggle-group, sf-pagination, sf-stepper]
  provides: [sf-navigation-menu, explorer-p2-entries]
  affects: [sf/index.ts, registry.json, components-explorer.tsx]
tech_stack:
  added: []
  patterns: [radix-wrap, sf-sheet-mobile-collapse, css-only-previews]
key_files:
  created:
    - components/sf/sf-navigation-menu.tsx
    - public/r/sf-navigation-menu.json
  modified:
    - components/sf/index.ts
    - registry.json
    - components/blocks/components-explorer.tsx
decisions:
  - "Updated PAGINATION (011) in-place rather than adding duplicate 024 entry"
  - "SFNavigationMenuIndicator not exported per DU/TDR aesthetic (no decorative arrow)"
  - "SFNavigationMenuMobile uses direct sf-sheet import to avoid circular dependency"
metrics:
  duration: "2m 47s"
  completed: "2026-04-06T20:17:00Z"
  bundle_shared: "102 KB"
  tasks: 2
  files_changed: 5
---

# Phase 19 Plan 02: SFNavigationMenu + ComponentsExplorer P2 Entries Summary

SFNavigationMenu with desktop Radix flyout (zero border-radius, 2px industrial borders) and mobile SFSheet collapse; all four P2 components discoverable in ComponentsExplorer at 102 KB shared bundle.

## Tasks Completed

### Task 1: SFNavigationMenu -- Radix wrap + SFSheet mobile collapse
**Commit:** `72ea3b7`

- Created `components/sf/sf-navigation-menu.tsx` with 8 exports: SFNavigationMenu, SFNavigationMenuList, SFNavigationMenuItem, SFNavigationMenuTrigger, SFNavigationMenuContent, SFNavigationMenuLink, SFNavigationMenuViewport, SFNavigationMenuMobile
- Desktop: Radix NavigationMenu wrapped with `rounded-none` on root, trigger, content, link, viewport (5 sub-elements). `sf-focusable` replaces default focus ring. Mono uppercase tracking-wider on trigger and link.
- Mobile: SFNavigationMenuMobile renders SFSheet with hamburger Menu icon trigger, `side="left"` content, visible only below md breakpoint
- Indicator arrow not exported (hidden per DU/TDR aesthetic)
- Viewport: `border-2 border-foreground shadow-none ring-0` replaces rounded/shadow defaults
- Barrel export added to `sf/index.ts` under Navigation section
- Registry entry: `meta.layer: "frame"`, `meta.pattern: "A"`
- Public registry JSON at `public/r/sf-navigation-menu.json`

### Task 2: ComponentsExplorer entries + bundle gate
**Commit:** `6f6cf82`

- Added 4 CSS-only preview components: PreviewToggleGroup, PreviewPagination, PreviewStepper, PreviewNavMenu
- Updated existing PAGINATION (011) entry from placeholder dots preview to numbered squares, version bumped to v1.3.0
- Added TOGGLE_GRP (023), STEPPER (024), NAV_MENU (025) as new entries
- Bundle gate: 102 KB shared (baseline 103 KB, gate 150 KB) -- no regression
- `pnpm build` passes with zero errors

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing] PAGINATION entry deduplication**
- **Found during:** Task 2
- **Issue:** Plan suggested adding new 024 PAGINATION entry, but index 011 already had a PAGINATION placeholder
- **Fix:** Updated 011 in-place with new preview and v1.3.0 version rather than creating duplicate
- **Files modified:** components/blocks/components-explorer.tsx

## Acceptance Criteria

| AC | Status | Evidence |
|----|--------|----------|
| AC-1: Desktop flyout with rounded-none on viewport, content, trigger, link | PASS | 5x `rounded-none` in sf-navigation-menu.tsx |
| AC-2: Mobile SFSheet below md, desktop flyout above md | PASS | SFNavigationMenuMobile with `md:hidden`, desktop with `hidden md:flex` pattern |
| AC-3: Keyboard nav preserved (Tab, Enter, arrows, Escape) | PASS | Only class overrides applied, no Radix data-*/aria-* attributes modified |
| AC-4: Indicator arrow hidden | PASS | SFNavigationMenuIndicator not exported |
| AC-5: ComponentsExplorer entries for all 4 P2 components | PASS | TOGGLE_GRP, PAGINATION (updated), STEPPER, NAV_MENU present |
| AC-6: Shared bundle under 150KB gate | PASS | 102 KB shared |
| AC-7: Barrel export + registry entry | PASS | sf/index.ts and registry.json updated |

## Bundle Analysis

| Metric | Value |
|--------|-------|
| Shared JS | 102 KB |
| /components First Load | 285 KB |
| Gate (150 KB shared) | PASS |

## Self-Check: PASSED
