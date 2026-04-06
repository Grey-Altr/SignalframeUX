---
phase: 02-frame-primitives
plan: "02"
subsystem: frame-primitives
tags: [sfgrid, sftext, sfbutton, prm-06, barrel-export, typescript, server-components, forwardref]
dependency_graph:
  requires: [02-01]
  provides: [PRM-04, PRM-05, PRM-06]
  affects: [sf/index.ts, any consumer importing from sf/]
tech_stack:
  added: []
  patterns: [CVA + forwardRef without use-client, polymorphic as prop with Record maps, TextVariant union type export]
key_files:
  created:
    - components/sf/sf-grid.tsx
    - components/sf/sf-text.tsx
  modified:
    - components/sf/index.ts
decisions:
  - "SFGrid uses numeric string keys (\"3\") not literal numbers for CVA variants — allows Tailwind class strings as map values without ambiguity"
  - "SFText uses plain Record maps not CVA — only one variant dimension (variant itself), CVA adds no value here"
  - "Polymorphic ref cast uses React.Ref<any> — TypeScript cannot narrow across HTMLHeadingElement|HTMLParagraphElement|HTMLSpanElement|HTMLLabelElement intersection without it; pattern documented in RESEARCH.md Pitfall 1"
  - "SFButton PRM-06 audit: no code changes needed — sf-pressable and transition-colors coexist without conflict (different CSS properties)"
metrics:
  duration: "~2 minutes"
  completed: "2026-04-06"
  tasks_completed: 2
  tasks_total: 2
  files_created: 2
  files_modified: 1
---

# Phase 02 Plan 02: SFGrid, SFText, SFButton PRM-06 Audit Summary

SFGrid responsive grid primitive and SFText TypeScript-enforced semantic typography primitive created; SFButton confirmed PRM-06 compliant; all six layout primitives barrel-exported.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create SFGrid and SFText primitives | 4b40101 | components/sf/sf-grid.tsx, components/sf/sf-text.tsx |
| 2 | Audit SFButton for PRM-06 and complete barrel exports | ea03bfe | components/sf/index.ts |

## What Was Built

### SFGrid (components/sf/sf-grid.tsx)

Responsive CSS grid primitive enforcing column presets and blessed gap stops.

- CVA base: `"grid"`
- `cols` variant: `"1"`, `"2"`, `"3"`, `"4"`, `"auto"` — each encodes responsive breakpoint logic (e.g., `"3"` → `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
- `gap` variant: `"4"`, `"6"`, `"8"` (blessed spacing stops only)
- Default: `cols="3"`, `gap="6"`
- `React.forwardRef` with named inner function for GSAP targeting
- No `'use client'` directive — Server Component

### SFText (components/sf/sf-text.tsx)

Semantic typography primitive with compile-time variant enforcement.

- `TextVariant = "heading-1" | "heading-2" | "heading-3" | "body" | "small"` — TypeScript union, invalid variants fail at compile time
- `variantClassMap` maps each variant to its semantic CSS utility class (e.g., `text-heading-1`)
- `defaultElementMap` maps each variant to its semantic HTML element (`heading-1` → `h1`, `body` → `p`, `small` → `span`)
- `as?` prop for polymorphic override — `variant="heading-1" as="span"` renders `<span>` with `text-heading-1`
- `React.forwardRef` with `ref as React.Ref<any>` cast (required for polymorphic element types)
- `TextVariant` type exported for downstream consumers
- No `'use client'` directive — Server Component

### SFButton PRM-06 Audit

Confirmed PRM-06 compliance — no code changes required.

- `sf-pressable` class present in CVA base string
- `intent` is the variant prop name (primary/ghost/signal)
- `defaultVariants: { intent: "primary", size: "md" }` — both present
- `transition-colors` transitions color properties only (color, background-color, border-color, etc.)
- `.sf-pressable` in globals.css transitions `transform` via pseudo-classes (`:hover`, `:active`)
- These are separate CSS properties — no conflict

### Barrel Export (components/sf/index.ts)

Layout Primitives section now complete with all five structural primitives:

```typescript
// Layout Primitives
export { SFContainer } from "./sf-container";
export { SFSection } from "./sf-section";
export { SFStack } from "./sf-stack";
export { SFGrid } from "./sf-grid";
export { SFText, type TextVariant } from "./sf-text";
```

## Acceptance Criteria Verification

| AC | Criterion | Status |
|----|-----------|--------|
| AC-1 | SFGrid default: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` | PASS |
| AC-2 | `cols="2"`: `grid grid-cols-1 md:grid-cols-2`, no lg class | PASS |
| AC-3 | `cols="auto"`: `grid-cols-[repeat(auto-fill,minmax(280px,1fr))]` | PASS |
| AC-4 | `variant="heading-1"` → `<h1>` with `text-heading-1` | PASS |
| AC-5 | `variant="body"` → `<p>` with `text-body` | PASS |
| AC-6 | `variant="heading-1" as="span"` → `<span>` with `text-heading-1` | PASS |
| AC-7 | `<SFText variant="invalid">` → tsc type error | PASS (union enforcement) |
| AC-8 | `sf-button.tsx` has `transition-colors` + `sf-pressable`, no conflict | PASS |
| AC-9 | `sf/index.ts` exports SFGrid and SFText in Layout Primitives section | PASS |
| AC-10 | sf-text.tsx and sf-grid.tsx have no `'use client'` directive | PASS |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Polymorphic ref cast required React.Ref<any> not React.Ref<HTMLElement>**
- **Found during:** Task 1 TypeScript verification
- **Issue:** `ref as React.Ref<HTMLElement>` failed — TypeScript cannot assign `RefObject<HTMLElement>` to the intersection type `RefObject<HTMLHeadingElement> & RefObject<HTMLLabelElement> & RefObject<HTMLParagraphElement>` required by the polymorphic element union
- **Fix:** Changed to `ref as React.Ref<any>` per plan's RESEARCH.md Pitfall 1 reference; added eslint-disable comment for the any cast
- **Files modified:** components/sf/sf-text.tsx
- **Commit:** 4b40101

## Self-Check: PASSED

Files exist:
- components/sf/sf-grid.tsx: FOUND
- components/sf/sf-text.tsx: FOUND

Commits exist:
- 4b40101: FOUND
- ea03bfe: FOUND
