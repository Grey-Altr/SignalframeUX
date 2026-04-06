---
phase: 02-frame-primitives
verified: 2026-04-06T00:00:00Z
status: passed
score: 9/9 must-haves verified
re_verification: false
---

# Phase 2: FRAME Primitives Verification Report

**Phase Goal:** Six SF primitives exist that enforce Phase 1 tokens by construction — using them correctly is easier than deviating from them
**Verified:** 2026-04-06
**Status:** PASSED
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | SFContainer renders a div with max-width from layout tokens and gutter padding at all breakpoints | VERIFIED | CVA base `px-[var(--gutter-sm)] md:px-[var(--gutter)]`; variants reference `var(--max-w-wide)`, `var(--max-w-content)`, `var(--max-w-full)` |
| 2 | SFSection renders a semantic section element with data-section and data-section-label attributes automatically | VERIFIED | `data-section` always present; `data-section-label={label}` React-omitted when undefined; `data-bg-shift` presence-only pattern |
| 3 | SFStack enforces blessed spacing stops via TypeScript union type — no arbitrary gap values compile | VERIFIED | CVA gap variant: union of `"1" | "2" | "3" | "4" | "6" | "8" | "12" | "16" | "24"` — maps to Tailwind gap utilities; non-union values fail at compile time |
| 4 | All three layout primitives forward refs to their underlying DOM elements for GSAP compatibility | VERIFIED | `React.forwardRef` count = 1 per file for sf-container, sf-section, sf-stack |
| 5 | SFGrid renders a responsive CSS grid with correct column counts at mobile/md/lg breakpoints | VERIFIED | cols="3" default → `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`; auto → `grid-cols-[repeat(auto-fill,minmax(280px,1fr))]` |
| 6 | SFText renders the correct semantic typography utility class for each variant and rejects invalid variants at compile time | VERIFIED | `TextVariant = "heading-1" | "heading-2" | "heading-3" | "body" | "small"` union; `variantClassMap` maps to `text-heading-1` through `text-small` |
| 7 | SFText defaults to the semantically correct HTML element for each variant | VERIFIED | `defaultElementMap`: heading-1→h1, heading-2→h2, heading-3→h3, body→p, small→span; `as?` prop allows override |
| 8 | SFButton interaction feedback tokens are wired and transition properties do not conflict | VERIFIED | `sf-pressable` in CVA base string; `transition-colors` (color properties only); `.sf-pressable` in globals.css transitions `transform` via pseudo-classes — separate CSS properties, no conflict |
| 9 | All six primitives exported from sf/index.ts under Layout Primitives heading before existing components | VERIFIED | Lines 1-6 of index.ts: `// Layout Primitives` comment followed by SFContainer, SFSection, SFStack, SFGrid, `SFText, type TextVariant` — all before `SFButton` export at line 8 |

**Score:** 9/9 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `components/sf/sf-container.tsx` | SFContainer layout primitive with width variants | VERIFIED | CVA, forwardRef, no `use client`, 39 lines |
| `components/sf/sf-section.tsx` | SFSection semantic section with data attributes and vertical spacing | VERIFIED | prop-based (no CVA), forwardRef, no `use client`, 32 lines |
| `components/sf/sf-stack.tsx` | SFStack flex primitive with blessed gap enforcement | VERIFIED | CVA, forwardRef, align variant bonus, no `use client`, 54 lines |
| `components/sf/sf-grid.tsx` | SFGrid responsive grid primitive | VERIFIED | CVA, forwardRef, 5 col variants, no `use client`, 44 lines |
| `components/sf/sf-text.tsx` | SFText semantic typography primitive with polymorphic as | VERIFIED | Record maps, forwardRef, TextVariant type exported, no `use client`, 55 lines |
| `components/sf/sf-button.tsx` | SFButton with verified interaction feedback tokens | VERIFIED | sf-pressable + transition-colors + intent variant + defaultVariants present |
| `components/sf/index.ts` | Barrel exports for all layout primitives | VERIFIED | `// Layout Primitives` at line 1; 5 primitives + TextVariant type exported; all before existing SFButton |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `sf-container.tsx` | `app/globals.css` | CSS custom properties in Tailwind arbitrary values | VERIFIED | `var(--max-w-wide)`, `var(--max-w-content)`, `var(--max-w-full)`, `var(--gutter-sm)`, `var(--gutter)` all referenced |
| `sf/index.ts` | `sf-container.tsx` | barrel re-export | VERIFIED | Line 2: `export { SFContainer } from "./sf-container"` |
| `sf-text.tsx` | `app/globals.css` | semantic typography utility classes | VERIFIED | variantClassMap references `text-heading-1`, `text-heading-2`, `text-heading-3`, `text-body`, `text-small` |
| `sf-button.tsx` | `app/globals.css` | sf-pressable CSS class for press/hover feedback | VERIFIED | `sf-pressable` in CVA base; globals.css defines `.sf-pressable` with `--press-scale`, `--press-y`, `--hover-y` tokens at lines 190-573 |
| `sf/index.ts` | `sf-grid.tsx` | barrel re-export | VERIFIED | Line 5: `export { SFGrid } from "./sf-grid"` |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| PRM-01 | 02-01-PLAN.md | SFContainer primitive enforces layout tokens (max-width, gutters, responsive behavior) | SATISFIED | sf-container.tsx CVA references `var(--max-w-wide)`, `var(--max-w-content)`, `var(--max-w-full)`, `var(--gutter-sm)`, `var(--gutter)` with responsive breakpoint |
| PRM-02 | 02-01-PLAN.md | SFSection primitive with data-section, data-section-label, consistent vertical spacing | SATISFIED | data-section always present; data-section-label conditional; typed spacing union `"8" | "12" | "16" | "24"` |
| PRM-03 | 02-01-PLAN.md | SFStack primitive enforcing blessed spacing stops for vertical rhythm | SATISFIED | CVA gap union maps all 9 blessed stops; arbitrary gap values produce TypeScript compile error |
| PRM-04 | 02-02-PLAN.md | SFGrid primitive with column system and responsive breakpoints | SATISFIED | cols variant encodes 1/2/3/4/auto responsive logic; gap limited to blessed stops 4/6/8 |
| PRM-05 | 02-02-PLAN.md | SFText primitive enforcing semantic typography aliases | SATISFIED | TextVariant union enforced at compile time; variantClassMap → text-heading-* utilities; defaultElementMap for semantic HTML |
| PRM-06 | 02-02-PLAN.md | SFButton refinement — consistent with new intent standard, interaction feedback tokens wired | SATISFIED | sf-pressable wired; transition-colors (no conflict); intent variant with defaultVariants; globals.css --press-scale/--press-y/--hover-y tokens consumed |

All 6 PRM-* requirements claimed by Phase 2 plans are satisfied. No orphaned requirements detected.

---

### Anti-Patterns Found

No anti-patterns detected. Specific checks run:

- `TODO/FIXME/XXX/HACK/PLACEHOLDER` in all 5 new primitive files: clean (exit code 1)
- `'use client'` directive in sf-container, sf-section, sf-stack, sf-grid, sf-text: clean (exit code 1)
- `return null / return {} / return []` patterns: none found
- Empty handler patterns: none found

**Pre-existing TypeScript errors (not introduced by Phase 2):**
- `components/animation/color-cycle-frame.tsx:79` — `useRef` missing argument (TS2554) — deferred from Phase 1, does not affect Phase 2 primitives
- `components/layout/dark-mode-toggle.tsx:47` — `webkitBackdropFilter` property type error (TS2551) — pre-existing, does not affect Phase 2 primitives

---

### Human Verification Required

#### 1. SFContainer Responsive Gutter Behavior

**Test:** Render `<SFContainer>` in the dev server. Resize viewport from 320px to 1440px.
**Expected:** Padding switches from `--gutter-sm` (16px) to `--gutter` (24px) at the Tailwind `md` breakpoint (768px).
**Why human:** CSS arbitrary value breakpoint behavior requires visual browser confirmation.

#### 2. SFGrid Column Responsiveness

**Test:** Render `<SFGrid>` with default props and 6 child elements. Observe at 320px, 768px, and 1024px+ viewports.
**Expected:** 1-column at mobile, 2-column at md, 3-column at lg.
**Why human:** Responsive grid layout transitions require visual browser confirmation.

#### 3. SFButton Press Feedback

**Test:** Click an `<SFButton>` and observe the press animation.
**Expected:** Element translates down 1px and scales to 0.97 on press; translates up -2px on hover; both transitions are smooth and do not conflict.
**Why human:** CSS transform animation quality requires visual and tactile browser confirmation.

---

### Adoption Note

The six primitives are not yet consumed in `app/` or `components/blocks/` — no call sites exist. This is expected: Phase 2's goal is construction and availability, not adoption. Phase 3+ plans will consume these primitives. The barrel export (`components/sf/index.ts`) makes all six available as a single import surface. This is not a gap.

### SFButton forwardRef Note

`sf-button.tsx` does not use `React.forwardRef` explicitly, nor does the underlying shadcn `components/ui/button.tsx`. In React 19 (this project: `react@^19.1.0`), `ref` is passed as a regular prop via `React.ComponentProps<"button">` — the `forwardRef` wrapper is no longer required. GSAP ref targeting will work by passing `ref` directly to `SFButton`, which propagates through the shadcn `Button` to the underlying `<button>` element. This is the React 19 idiomatic pattern. Not a gap.

---

## Gaps Summary

No gaps. All 9 observable truths verified, all 6 requirements satisfied, all key links confirmed wired, no anti-patterns found.

---

_Verified: 2026-04-06_
_Verifier: Claude (gsd-verifier)_
