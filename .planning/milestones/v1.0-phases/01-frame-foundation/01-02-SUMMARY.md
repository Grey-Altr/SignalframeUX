---
phase: 01-frame-foundation
plan: 02
subsystem: spacing-tokens, cva-standard
tags: [spacing, cva, token-enforcement, sf-components]
dependency_graph:
  requires: []
  provides: [blessed-spacing-enforcement, cva-intent-standard]
  affects: [components/sf, components/blocks]
tech_stack:
  added: []
  patterns: [CVA intent+defaultVariants standard, blessed spacing stops enforcement]
key_files:
  created: []
  modified:
    - components/sf/sf-button.tsx
    - components/blocks/shared-code-block.tsx
    - components/blocks/code-section.tsx
    - components/blocks/components-explorer.tsx
    - components/blocks/api-explorer.tsx
    - components/blocks/token-tabs.tsx
decisions:
  - "p-5 px-6 → p-6 px-6: when p-5 is followed by a more-specific axis override, p-5 is still non-blessed and should be replaced"
  - "signal intent kept as pre-standard extension: documented via comment rather than removed; brand usage is legitimate"
  - "shared-code-block.tsx p-5 pr-6 → p-6: pr-6 override dropped since p-6 already provides pr-6"
metrics:
  duration_minutes: 18
  tasks_completed: 2
  tasks_total: 2
  files_modified: 6
  completed_date: 2026-04-05
requirements_satisfied:
  - FRM-01
  - FRM-07
requirements_completed: [FRM-01, FRM-07]
---

# Phase 01 Plan 02: Spacing Sweep + CVA Compliance Summary

**One-liner:** Mechanical enforcement pass eliminating all non-blessed Tailwind spacing values (5/7/10) from sf/, blocks/, and layout/ and documenting the CVA intent standard across all three SF components.

## What Was Built

### Task 1: Spacing Sweep

Replaced every non-blessed spacing value in the target component files with the correct blessed stop (4/8/12/16/24/32/48/64/96). The replacement map applied:

- `p-5` → `p-6` (20px → 24px)
- `px-5` → `px-6`
- `py-10` → `py-12` (40px → 48px)
- `pt-10` → `pt-12`
- `p-10` → `p-12`
- `mt-5` → `mt-6`
- `px-10` → `px-12` (sf-button xl size)
- `top-5 left-5` → `top-6 left-6`

**Files modified:**

| File | Changes |
|------|---------|
| `components/sf/sf-button.tsx` | `px-10` → `px-12` on xl size variant |
| `components/blocks/shared-code-block.tsx` | `p-5 pr-6` → `p-6` |
| `components/blocks/code-section.tsx` | `py-10` → `py-12` |
| `components/blocks/components-explorer.tsx` | `px-5` → `px-6` (3x filter bar), `p-5` → `p-6` (grid cards) |
| `components/blocks/api-explorer.tsx` | `pt-10` → `pt-12`, `py-10` → `py-12`, `p-5` → `p-6` (2x), `p-10` → `p-12`, `top-5 left-5` → `top-6 left-6` |
| `components/blocks/token-tabs.tsx` | `py-10` → `py-12`, `mt-5` → `mt-6`, `p-5` → `p-6` (9x across Typography, Elevation, Radius tables) |

Post-sweep verification: `grep -rEn " (p|px|py|...)-(5|7|10)[^0-9]" components/sf/ components/blocks/ components/layout/` returns exit code 1 (zero matches).

### Task 2: CVA Compliance Audit

Confirmed all three CVA-using SF components follow the `intent + defaultVariants` standard:

| Component | CVA variant prop | defaultVariants | Status |
|-----------|-----------------|-----------------|--------|
| sf-button.tsx | `intent` | `{ intent: "primary", size: "md" }` | COMPLIANT |
| sf-badge.tsx | `intent` | `{ intent: "default" }` | COMPLIANT |
| sf-toggle.tsx | `intent` | `{ intent: "default", size: "md" }` | COMPLIANT |

Added comment above the `signal` intent value in sf-button.tsx documenting it as a pre-standard extension:

```typescript
// signal: pre-standard extension — kept for SignalframeUX brand accent usage.
// Blessed intent set: default, primary, secondary, destructive, ghost, outline.
signal: "bg-foreground text-background border-primary hover:bg-primary hover:text-primary-foreground",
```

No additional CVA-using SF components were discovered beyond the three known ones.

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written with one minor adjustment:

**Adjustment: shared-code-block.tsx `p-5 pr-6` → `p-6`**
- The plan specified `p-5` → `p-6` but the original class was `p-5 pr-6`.
- Since `p-6` already applies `pr-6` (24px right padding), the redundant `pr-6` override was dropped.
- This maintains the same visual result with cleaner class composition.

## Self-Check: PASSED

All key files confirmed present. Both task commits verified in git log.

<details>
<summary>Verification commands run</summary>

```
grep -rEn " (p|px|py|...)-(5|7|10)[^0-9]" components/sf/ components/blocks/ components/layout/ → EXIT:1 (zero matches)
grep -l "cva" components/sf/*.tsx → sf-badge.tsx, sf-button.tsx, sf-toggle.tsx (exactly 3)
grep "defaultVariants" components/sf/sf-button.tsx components/sf/sf-badge.tsx components/sf/sf-toggle.tsx → 3 matches
grep -c "pre-standard extension" components/sf/sf-button.tsx → 1
```

</details>
