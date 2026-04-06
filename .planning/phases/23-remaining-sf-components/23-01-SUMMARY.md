---
phase: 23-remaining-sf-components
plan: "01"
subsystem: sf-components
tags: [sf-wrapper, pattern-a, form-primitives, overlay, barrel]
dependency_graph:
  requires: [22-02]
  provides: [CMP-02, CMP-03, CMP-04]
  affects: [components/sf/index.ts, registry.json, Phase 24 data layer]
tech_stack:
  added: [vaul@1.1.2, input-otp]
  patterns: [Pattern A SF wrapper, rounded-none enforcement, same-commit rule]
key_files:
  created:
    - components/sf/sf-input-group.tsx
    - components/sf/sf-hover-card.tsx
    - components/sf/sf-input-otp.tsx
    - components/ui/hover-card.tsx
    - components/ui/input-otp.tsx
    - components/ui/drawer.tsx
  modified:
    - components/sf/index.ts
    - registry.json
    - package.json
    - pnpm-lock.yaml
decisions:
  - "SFInputOTPSlot overrides first:rounded-none and last:rounded-none explicitly to beat base's first:rounded-l-lg and last:rounded-r-lg (Tailwind Merge class ordering)"
  - "SFInputGroupAddon uses [>kbd]:rounded-none selector to reach CVA-generated kbd radius that outer rounded-none cannot cascade into"
  - "vaul v1.1.2 added as direct dependency — confirmed compatible via shadcn CLI vetting"
metrics:
  duration: "~3 min"
  completed: 2026-04-06
  tasks_completed: 2
  tasks_total: 2
  files_created: 6
  files_modified: 4
key_decisions:
  - "SFInputOTPSlot overrides base rounded-l/r-lg with first:rounded-none + last:rounded-none (class specificity via Tailwind Merge)"
  - "SFInputGroupAddon uses [>kbd]:rounded-none to reach inside CVA-generated radius that outer className cannot cascade into"
  - "Barrel section 'Overlays' added for SFHoverCard; 'Forms — Extended' for SFInputGroup + SFInputOTP — grouping matches existing pattern"
---

# Phase 23 Plan 01: Remaining SF Components (Pattern A) Summary

Three Pattern A SF wrappers (SFInputGroup, SFHoverCard, SFInputOTP) installed with shadcn bases, rounded-none enforcement, barrel exports, and registry entries — build-clean at 102KB shared bundle.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Install shadcn bases + create SFInputGroup wrapper | ff7f768 | components/ui/hover-card.tsx, input-otp.tsx, drawer.tsx, components/sf/sf-input-group.tsx, sf/index.ts, registry.json |
| 2 | Create SFHoverCard + SFInputOTP wrappers with barrel and registry | 73d8347 | components/sf/sf-hover-card.tsx, sf-input-otp.tsx, sf/index.ts, registry.json |

## What Was Built

### SFInputGroup (CMP-04)
Wraps all 6 exports from `components/ui/input-group.tsx`. The base uses CVA-generated `rounded-lg` on the root, `rounded-[calc(var(--radius)-5px)]` on kbd children inside addons, and `rounded-[calc(var(--radius)-3px)]` on buttons. The SF wrapper applies `rounded-none` at each level:
- `SFInputGroup` — root `rounded-none`
- `SFInputGroupAddon` — `rounded-none [>kbd]:rounded-none` (reaches inside CVA)
- `SFInputGroupButton` — `rounded-none` (overrides CVA button size variants)
- `SFInputGroupText`, `SFInputGroupInput`, `SFInputGroupTextarea` — passthrough with `rounded-none`

### SFHoverCard (CMP-02)
Follows `sf-popover.tsx` pattern exactly. 3 exports: SFHoverCard (root passthrough), SFHoverCardTrigger (passthrough), SFHoverCardContent (applies `rounded-none border-2 border-foreground bg-background shadow-none ring-0`). The Radix base renders `rounded-lg bg-popover shadow-md ring-1` — all overridden.

### SFInputOTP (CMP-03)
Wraps 4 sub-components from `ui/input-otp.tsx`. Key issue: base `InputOTPSlot` applies `first:rounded-l-lg last:rounded-r-lg` for grouped slot styling. The SF wrapper adds `first:rounded-none last:rounded-none` after the override to ensure Tailwind Merge picks up the last class wins in the merge. Active state uses `data-[active=true]:border-primary data-[active=true]:ring-1 data-[active=true]:ring-primary` matching the SF design language.

## Acceptance Criteria Results

| AC | Criterion | Result |
|----|-----------|--------|
| AC-1 | Three shadcn ui/ bases exist | PASS |
| AC-2 | SFInputGroup exports >= 6 | PASS (6 named exports) |
| AC-3 | SFInputGroup rounded-none count >= 3 | PASS (9 instances) |
| AC-4 | SFHoverCard has rounded-none in content | PASS |
| AC-5 | SFInputOTP exports >= 4 | PASS (4 named exports) |
| AC-6 | Barrel has all three component families | PASS |
| AC-7 | Registry has all three names | PASS |
| AC-8 | pnpm build exits 0 | PASS |

## Deviations from Plan

None — plan executed exactly as written. The SFInputOTPSlot implementation used `first:rounded-none last:rounded-none` in addition to the base `rounded-none` to explicitly beat the base component's `first:rounded-l-lg last:rounded-r-lg` classes. This is consistent with project convention (rounded-none everywhere) documented in STATE.md from v1.3.

## Bundle Impact

| Metric | Before | After |
|--------|--------|-------|
| Shared bundle | 102 KB | 102 KB |
| First Load JS /components | 291 KB | 295 KB |
| Gate | 150 KB | 150 KB |
| Status | PASS | PASS |

vaul (drawer dependency) was installed but SFDrawer is not in this plan (CMP-01 deferred to 23-02). The vaul package is present in node_modules but not imported by any bundle paths — zero bundle cost in this plan.

## Self-Check

- [x] `components/sf/sf-input-group.tsx` exists
- [x] `components/sf/sf-hover-card.tsx` exists
- [x] `components/sf/sf-input-otp.tsx` exists
- [x] `components/ui/hover-card.tsx` exists
- [x] `components/ui/input-otp.tsx` exists
- [x] `components/ui/drawer.tsx` exists
- [x] Commit ff7f768 exists
- [x] Commit 73d8347 exists
- [x] sf/index.ts is directive-free (no 'use client')
- [x] registry.json has sf-input-group, sf-hover-card, sf-input-otp entries

## Self-Check: PASSED
