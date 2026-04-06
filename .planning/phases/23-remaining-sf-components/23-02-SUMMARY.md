---
phase: 23-remaining-sf-components
plan: "02"
subsystem: sf-components
tags: [sf-wrapper, pattern-b, lazy-load, vaul, registry, components-explorer]
dependency_graph:
  requires: [23-01]
  provides: [CMP-01]
  affects: [components/sf/sf-drawer.tsx, components/sf/sf-drawer-lazy.tsx, components/blocks/components-explorer.tsx, registry.json, public/r/]
tech_stack:
  added: []
  patterns: [Pattern B lazy wrapper, next/dynamic ssr:false, SFSkeleton fallback, registry:build]
key_files:
  created:
    - components/sf/sf-drawer.tsx
    - components/sf/sf-drawer-lazy.tsx
    - public/r/sf-drawer.json
    - public/r/sf-hover-card.json
    - public/r/sf-input-otp.json
    - public/r/sf-input-group.json
  modified:
    - components/blocks/components-explorer.tsx
    - registry.json
decisions:
  - "SFDrawerContent applies rounded-none + border-t-2 — vaul's data-[vaul-drawer-direction=bottom]:rounded-t-xl is class-level on DrawerPrimitive.Content so cn() override at SFDrawerContent level fully supercedes it"
  - "SFDrawer NOT exported from sf/index.ts barrel — heavy component convention matching sf-calendar and sf-menubar lazy pattern"
  - "DRAWER at index 012 version updated from v2.0.0 to v1.4.0 to reflect actual ship milestone (SFDrawer ships in v1.4)"
metrics:
  duration: "~5 min"
  completed: 2026-04-06
  tasks_completed: 2
  tasks_total: 2
  files_created: 6
  files_modified: 2
key_decisions:
  - "SFDrawerContent applies rounded-none + border-t-2 overriding vaul's built-in rounded-t-xl via cn() class merge"
  - "SFDrawer NOT exported from sf/index.ts barrel — matches sf-calendar and sf-menubar lazy pattern; heavy:true in registry"
  - "DRAWER at 012 version updated from v2.0.0 to v1.4.0 — SFDrawer is a v1.4 deliverable, not a v2 artifact"
---

# Phase 23 Plan 02: SFDrawer (Pattern B) + Phase Close Summary

SFDrawer Pattern B lazy wrapper with 8 vaul sub-components (DU/TDR rounded-none + 2px border styling), all four Phase 23 components wired into ComponentsExplorer, four /r/ registry artifacts generated, bundle gate at 102 KB.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create SFDrawer (real + lazy) with registry entry | c393b40 | components/sf/sf-drawer.tsx, sf-drawer-lazy.tsx, registry.json |
| 2 | ComponentsExplorer entries + registry artifacts + bundle gate | db4b1ee | components/blocks/components-explorer.tsx, public/r/sf-drawer.json, sf-hover-card.json, sf-input-otp.json, sf-input-group.json |

## What Was Built

### SFDrawer (CMP-01)

Wraps all 8 relevant exports from `components/ui/drawer.tsx`. Key styling decisions:

- `SFDrawer` — passthrough root, no style changes
- `SFDrawerTrigger` — passthrough
- `SFDrawerClose` — passthrough
- `SFDrawerContent` — applies `rounded-none border-t-2 border-foreground bg-background`. The `rounded-none` overrides vaul's `data-[vaul-drawer-direction=bottom]:rounded-t-xl`. The `border-t-2` gives the DU/TDR hard edge at the top of the sheet.
- `SFDrawerHeader` — `border-b-2 border-foreground` for structured header separation
- `SFDrawerFooter` — `border-t-2 border-foreground` for footer separation
- `SFDrawerTitle` — `font-mono uppercase tracking-wider text-xs` matching SFSheetTitle convention
- `SFDrawerDescription` — `text-muted-foreground text-xs` matching SFPopoverDescription convention

### SFDrawerLazy

Follows `sf-calendar-lazy.tsx` pattern exactly. `next/dynamic` with `ssr: false` and `SFSkeleton className="h-[200px] w-full"` fallback. Exports `SFDrawerLazy` — the only public surface for consumer use. The real `SFDrawer` is accessed directly when composing sub-components.

### ComponentsExplorer Updates

Three new entries added after MENUBAR (index 027):

| Index | Name | Category | Version |
|-------|------|----------|---------|
| 028 | HOVER_CARD | LAYOUT/FRAME | v1.4.0 |
| 029 | INPUT_OTP | FORMS/FRAME | v1.4.0 |
| 030 | INPUT_GROUP | FORMS/FRAME | v1.4.0 |

DRAWER at index 012 version updated from `v2.0.0` to `v1.4.0`.

Three CSS-only preview functions added: `PreviewHoverCard`, `PreviewInputOTP`, `PreviewInputGroup` — lightweight span/div sketches consistent with existing explorer preview pattern.

### Registry Artifacts

All four `/r/` JSON artifacts generated via `pnpm run registry:build`:
- `public/r/sf-drawer.json` — Pattern B, heavy: true, vaul dependency
- `public/r/sf-hover-card.json` — Pattern A
- `public/r/sf-input-otp.json` — Pattern A
- `public/r/sf-input-group.json` — Pattern A

## Acceptance Criteria Results

| AC | Criterion | Result |
|----|-----------|--------|
| AC-1 | SFDrawer has >= 8 function SF exports | PASS (8) |
| AC-2 | rounded-none on SFDrawerContent | PASS |
| AC-3 | sf-drawer-lazy.tsx contains ssr: false | PASS |
| AC-4 | drawer NOT in sf/index.ts barrel | PASS (0 matches) |
| AC-5 | registry.json sf-drawer entry has heavy: true and pattern: B | PASS |
| AC-6 | ComponentsExplorer has HOVER_CARD, INPUT_OTP, INPUT_GROUP | PASS (3 entries) |
| AC-7 | All four /r/ artifacts exist | PASS |
| AC-8 | pnpm build exits 0, vaul in async chunk, under 150 KB | PASS (102 KB) |

## Deviations from Plan

None — plan executed exactly as written. The `rounded-none` override on `SFDrawerContent` via `cn()` successfully overrides vaul's built-in `data-[vaul-drawer-direction=bottom]:rounded-t-xl` class because `cn()` appends `rounded-none` last in the merge, taking precedence in Tailwind's class resolution.

## Bundle Impact

| Metric | Before | After |
|--------|--------|-------|
| Shared bundle | 102 KB | 102 KB |
| First Load JS /components | 295 KB | 295 KB |
| Gate | 150 KB | 150 KB |
| Status | PASS | PASS |

vaul is loaded only via `next/dynamic` with `ssr: false` — it appears in an async chunk and has zero cost in the initial shared bundle.

## Phase 23 Completion

All four Phase 23 requirements delivered:
- CMP-01: SFDrawer — Pattern B lazy wrapper (this plan)
- CMP-02: SFHoverCard — Pattern A wrapper (23-01)
- CMP-03: SFInputOTP — Pattern A wrapper (23-01)
- CMP-04: SFInputGroup — Pattern A wrapper (23-01)

## Self-Check

- [x] `components/sf/sf-drawer.tsx` exists
- [x] `components/sf/sf-drawer-lazy.tsx` exists
- [x] `public/r/sf-drawer.json` exists
- [x] `public/r/sf-hover-card.json` exists
- [x] `public/r/sf-input-otp.json` exists
- [x] `public/r/sf-input-group.json` exists
- [x] Commit c393b40 exists
- [x] Commit db4b1ee exists
- [x] sf/index.ts has zero drawer references
- [x] COMPONENTS array has indices 028, 029, 030
- [x] registry.json has sf-drawer with pattern B and heavy: true

## Self-Check: PASSED
