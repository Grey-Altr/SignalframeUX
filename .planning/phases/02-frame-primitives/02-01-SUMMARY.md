---
phase: 02-frame-primitives
plan: "01"
subsystem: layout-primitives
tags: [primitives, layout, tokens, server-components, forwardref]
dependency_graph:
  requires: [01-01-SUMMARY.md, 01-02-SUMMARY.md, 01-03-SUMMARY.md]
  provides: [SFContainer, SFSection, SFStack]
  affects: [components/sf/index.ts]
tech_stack:
  added: []
  patterns: [cva-variants, forwardRef, cn-merging, css-custom-property-arbitrary-values]
key_files:
  created:
    - components/sf/sf-container.tsx
    - components/sf/sf-section.tsx
    - components/sf/sf-stack.tsx
  modified:
    - components/sf/index.ts
decisions:
  - SFSection uses typed prop-based spacing (no CVA) — simpler API for a two-variant component
  - SFStack includes align variant with stretch default — Claude's discretion item from plan, adds useful flex control with zero API complexity cost
  - data-bg-shift uses presence-only boolean pattern (value="" when true, undefined when false) — consistent with data-section-label omission pattern
metrics:
  duration: 8m
  completed: 2026-04-06
  tasks_completed: 2
  files_created: 3
  files_modified: 1
---

# Phase 2 Plan 01: Layout Primitives Summary

Three Server Component layout primitives — SFContainer (responsive max-width via CSS var tokens), SFSection (semantic section with auto-injected data attributes and typed vertical spacing stops), SFStack (flex primitive with all 9 blessed gap stops enforced via TypeScript union type) — wired into the SF barrel export under a Layout Primitives heading.

## What Was Built

### SFContainer (`components/sf/sf-container.tsx`)

CVA-based div primitive enforcing max-width layout tokens and responsive gutters.

- Default: `wide` = `max-w-[var(--max-w-wide)]` (80rem) with `px-[var(--gutter-sm)] md:px-[var(--gutter)]`
- Variants: `content` (42rem prose width), `full` (100%)
- forwardRef to HTMLDivElement for GSAP targeting
- No `'use client'` — pure Server Component

### SFSection (`components/sf/sf-section.tsx`)

Prop-based semantic section element with automatic GSAP/scroll-targeting data attributes.

- Always emits `data-section` boolean attribute
- Emits `data-section-label={label}` when label prop provided; React omits when undefined
- Emits `data-bg-shift=""` when bgShift=true; React omits when false/undefined
- Typed `spacing` prop: `"8" | "12" | "16" | "24"` — blessed vertical stops only, defaults to `"16"` (py-16 = 64px)
- forwardRef to HTMLElement

### SFStack (`components/sf/sf-stack.tsx`)

CVA-based flex container enforcing blessed gap stops via TypeScript union.

- `direction`: `vertical` (flex-col default) | `horizontal` (flex-row flex-wrap)
- `gap`: all 9 blessed stops (`"1"` | `"2"` | `"3"` | `"4"` | `"6"` | `"8"` | `"12"` | `"16"` | `"24"`) — arbitrary gap values cannot compile
- `align`: `start` | `center` | `end` | `stretch` (default) — added per plan's discretion note
- forwardRef to HTMLDivElement

### Barrel Update (`components/sf/index.ts`)

Added `// Layout Primitives` heading at line 1 followed by SFContainer, SFSection, SFStack exports before all existing component exports.

## Acceptance Criteria Verification

| AC | Status | Evidence |
|----|--------|----------|
| AC-1 | PASS | Default render: `mx-auto max-w-[var(--max-w-wide)] px-[var(--gutter-sm)] md:px-[var(--gutter)]` |
| AC-2 | PASS | `width="content"` → `max-w-[var(--max-w-content)]` |
| AC-3 | PASS | `label="hero"` → `data-section` + `data-section-label="hero"` |
| AC-4 | PASS | No label prop → React omits `data-section-label` attribute |
| AC-5 | PASS | Default `spacing="16"` → `py-16` |
| AC-6 | PASS | Default → `flex flex-col gap-4` (+ `items-stretch` from align default) |
| AC-7 | PASS | `direction="horizontal" gap="8"` → `flex flex-row flex-wrap gap-8` |
| AC-8 | PASS | `// Layout Primitives` at line 1, exports before SFButton |
| AC-9 | PASS | `grep -c "forwardRef"` returns 1 for each file |
| AC-10 | PASS | `grep -c "'use client'"` returns 0 for each file |

## Commits

| Hash | Message |
|------|---------|
| 9a502b7 | feat(02-01): create SFContainer, SFSection, SFStack layout primitives |
| b49913b | feat(02-01): add Layout Primitives section to sf barrel export |

## Deviations from Plan

None — plan executed exactly as written. The `align` variant for SFStack was explicitly listed as "Claude's discretion" in the plan action and was included.

## Self-Check: PASSED

- components/sf/sf-container.tsx — exists
- components/sf/sf-section.tsx — exists
- components/sf/sf-stack.tsx — exists
- components/sf/index.ts — updated with Layout Primitives heading
- Commits 9a502b7 and b49913b — verified in git log
- TypeScript: only pre-existing errors (color-cycle-frame.tsx, dark-mode-toggle.tsx), no new errors
