---
phase: 17-p1-non-animated-components
plan: "01"
subsystem: sf-wrappers
tags: [avatar, breadcrumb, alert, collapsible, frame-layer, pattern-a]
requirements_completed: [NAV-01, NAV-02, FD-05, FD-06]
dependency_graph:
  requires: [components/ui/avatar.tsx, components/ui/collapsible.tsx, components/ui/alert.tsx, components/ui/breadcrumb.tsx]
  provides: [SFAvatar, SFBreadcrumb, SFAlert, SFCollapsible]
  affects: [components/sf/index.ts, registry.json]
tech_stack:
  added: []
  patterns: [pattern-a-compound, cva-intent, server-component-breadcrumb, rounded-none-override]
key_files:
  created:
    - components/sf/sf-avatar.tsx
    - components/sf/sf-breadcrumb.tsx
    - components/sf/sf-alert.tsx
    - components/sf/sf-collapsible.tsx
    - components/ui/alert.tsx
    - components/ui/breadcrumb.tsx
  modified:
    - components/sf/index.ts
    - registry.json
decisions:
  - "SFAlert is Server Component (no 'use client') — base alert.tsx has no directive and SFAlert uses no hooks"
  - "SFBreadcrumb is Server Component with monospace / separator — base breadcrumb.tsx has no directive"
metrics:
  duration: 175s
  completed: "2026-04-06T18:55:53Z"
  tasks: 2
  files_created: 6
  files_modified: 2
---

# Phase 17 Plan 01: SF Wrappers Wave 1 Summary

Four Pattern A SF wrappers (SFCollapsible, SFBreadcrumb, SFAvatar, SFAlert) with shadcn bases installed, barrel exports, and registry entries — bundle unchanged at 103 KB shared.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Install shadcn bases + SFCollapsible + SFBreadcrumb | 44e5dc0 | ui/alert.tsx, ui/breadcrumb.tsx, sf/sf-collapsible.tsx, sf/sf-breadcrumb.tsx |
| 2 | SFAvatar + SFAlert + barrel + registry | 1900085 | sf/sf-avatar.tsx, sf/sf-alert.tsx, sf/index.ts, registry.json |

## Key Implementation Details

### SFCollapsible
- Thin Radix passthrough with `'use client'` (base has it)
- Supports `asChild` on trigger via props passthrough

### SFBreadcrumb
- **Server Component** (no `'use client'`) — base breadcrumb.tsx has no directive
- Monospace `/` separator replaces default ChevronRight icon
- `font-mono` applied to BreadcrumbList for consistent typography

### SFAvatar
- `rounded-none` on Root (+ `after:rounded-none`), Image, and Fallback — overrides Radix's `rounded-full`
- Default fallback: Lucide `User` icon at `size-[60%]` when no children provided
- `'use client'` matches base avatar.tsx

### SFAlert
- **Server Component** — base alert.tsx has no `'use client'` directive, no hooks used
- CVA `intent` variants: info (primary), warning (accent), destructive, success
- `rounded-none border-2` overrides base's `rounded-lg border`
- Monospace uppercase tracking on SFAlertTitle

## Decisions Made

1. **SFAlert as Server Component**: Base `alert.tsx` has no `'use client'` and SFAlert uses no React hooks — keeping it as Server Component reduces client bundle
2. **SFBreadcrumb as Server Component**: Base `breadcrumb.tsx` has no `'use client'` — confirmed per NAV-02 requirement

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

- `pnpm build`: passes with zero errors
- Barrel `sf/index.ts`: 0 occurrences of `'use client'` (directive-free)
- `sf-avatar.tsx`: `rounded-none` on Root, Image, Fallback (3 sub-elements)
- `sf-alert.tsx`: CVA variant key is `intent` with 4 variants
- `sf-breadcrumb.tsx`: no `'use client'` (Server Component)
- All 4 components in `sf/index.ts` exports (11 total references)
- All 4 components in `registry.json` with `meta.layer: "frame"`, `meta.pattern: "A"`
- Bundle: 103 KB shared (unchanged from baseline)

## Self-Check: PASSED
