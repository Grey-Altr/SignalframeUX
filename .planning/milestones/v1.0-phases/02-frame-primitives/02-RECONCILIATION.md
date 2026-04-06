---
phase: 02-frame-primitives
plans: [02-01, 02-02]
requirements: [PRM-01, PRM-02, PRM-03, PRM-04, PRM-05, PRM-06]
reconciled: 2026-04-06
status: complete
---

# Phase 02 — FRAME Primitives: Reconciliation

**Phase first commit:** 9a502b7
**Final commit:** ea03bfe
**Total duration:** ~10 minutes (02-01: 8m, 02-02: ~2m)
**Plans executed:** 2/2
**Tasks completed:** 4/4

---

## Plan-by-Plan Summary

### Plan 02-01 — Layout Primitives (SFContainer, SFSection, SFStack)

**Objective:** Create three structural layout primitives enforcing Phase 1 tokens by construction.

**Commits:**
- `9a502b7` — feat(02-01): create SFContainer, SFSection, SFStack layout primitives
- `b49913b` — feat(02-01): add Layout Primitives section to sf barrel export

**Files created:** components/sf/sf-container.tsx, components/sf/sf-section.tsx, components/sf/sf-stack.tsx
**Files modified:** components/sf/index.ts

### Plan 02-02 — Grid, Text, Button Audit (SFGrid, SFText, PRM-06)

**Objective:** Create SFGrid and SFText primitives, audit SFButton for PRM-06 compliance, complete barrel export.

**Commits:**
- `4b40101` — feat(02-02): create SFGrid and SFText primitives
- `ea03bfe` — feat(02-02): audit SFButton PRM-06, complete Layout Primitives barrel export

**Files created:** components/sf/sf-grid.tsx, components/sf/sf-text.tsx
**Files modified:** components/sf/index.ts

---

## Acceptance Criteria Status

### Plan 02-01 ACs

| AC | Criterion | Planned | Delivered | Status |
|----|-----------|---------|-----------|--------|
| AC-1 | SFContainer default renders with `mx-auto`, `max-w-[var(--max-w-wide)]`, `px-[var(--gutter-sm)]`, `md:px-[var(--gutter)]` | Yes | Yes — CVA base + wide default variant | PASS |
| AC-2 | `width="content"` → `max-w-[var(--max-w-content)]` | Yes | Yes — content variant in sfContainerVariants | PASS |
| AC-3 | `label="hero"` → `<section data-section data-section-label="hero">` | Yes | Yes — always emits data-section, conditionally emits label | PASS |
| AC-4 | No label prop → `data-section` present, NO `data-section-label` | Yes | Yes — React omits undefined attributes | PASS |
| AC-5 | Default `spacing` → `py-16` (64px blessed stop) | Yes | Yes — defaultVariants spacing="16" | PASS |
| AC-6 | Default SFStack → `flex flex-col gap-4` | Yes | Yes — CVA defaults produce this (plus items-stretch from align default) | PASS |
| AC-7 | `direction="horizontal" gap="8"` → `flex flex-row flex-wrap gap-8` | Yes | Yes — horizontal variant + gap-8 variant | PASS |
| AC-8 | `sf/index.ts` has `// Layout Primitives` comment with SFContainer, SFSection, SFStack before existing exports | Yes | Yes — added at line 1 before SFButton | PASS |
| AC-9 | All three primitives use forwardRef | Yes | Yes — forwardRef on all three files | PASS |
| AC-10 | None of the three primitive files contain `'use client'` | Yes | Yes — all three are Server Components | PASS |

### Plan 02-02 ACs

| AC | Criterion | Planned | Delivered | Status |
|----|-----------|---------|-----------|--------|
| AC-1 | SFGrid default → `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` | Yes | Yes — cols="3" gap="6" defaults | PASS |
| AC-2 | `cols="2"` → `grid grid-cols-1 md:grid-cols-2`, no lg class | Yes | Yes — "2" variant scoped to md breakpoint only | PASS |
| AC-3 | `cols="auto"` → `grid-cols-[repeat(auto-fill,minmax(280px,1fr))]` | Yes | Yes — auto variant maps to this utility string | PASS |
| AC-4 | `variant="heading-1"` → `<h1>` with `text-heading-1` | Yes | Yes — defaultElementMap["heading-1"] = "h1" | PASS |
| AC-5 | `variant="body"` → `<p>` with `text-body` | Yes | Yes — defaultElementMap["body"] = "p" | PASS |
| AC-6 | `variant="heading-1" as="span"` → `<span>` with `text-heading-1` | Yes | Yes — as prop overrides defaultElementMap | PASS |
| AC-7 | `<SFText variant="invalid">` → tsc type error | Yes | Yes — TextVariant union enforces at compile time | PASS |
| AC-8 | sf-button.tsx has `transition-colors` AND `sf-pressable`, no conflict | Yes | Yes — separate CSS properties, no conflict confirmed | PASS |
| AC-9 | `sf/index.ts` exports SFGrid and SFText in Layout Primitives section | Yes | Yes — both added to Layout Primitives block | PASS |
| AC-10 | sf-text.tsx and sf-grid.tsx have no `'use client'` | Yes | Yes — both are Server Components | PASS |

**Total ACs: 20/20 PASS**

---

## Requirement Coverage

| Requirement | Description | Evidence | Status |
|-------------|-------------|----------|--------|
| PRM-01 | SFContainer enforces layout tokens by construction | sf-container.tsx uses `var(--max-w-*)` and `var(--gutter*)` via CVA — arbitrary widths cannot compile | DELIVERED |
| PRM-02 | SFSection enforces semantic section structure and data attributes | sf-section.tsx emits `data-section` always; typed spacing stops block non-blessed values | DELIVERED |
| PRM-03 | SFStack enforces blessed gap stops via TypeScript union | sfStackVariants gap variant typed as `"1"|"2"|"3"|"4"|"6"|"8"|"12"|"16"|"24"` — arbitrary gaps fail at compile time | DELIVERED |
| PRM-04 | SFGrid enforces responsive column presets and blessed gap stops | sfGridVariants cols/gap variants typed; col preset encodes breakpoint logic; no arbitrary grid values | DELIVERED |
| PRM-05 | SFText enforces semantic typography via TypeScript union | TextVariant union + variantClassMap + defaultElementMap — invalid variants fail tsc, semantic elements default correctly | DELIVERED |
| PRM-06 | SFButton interaction feedback tokens wired without transition conflict | Audit confirmed: sf-pressable (transform) + transition-colors (color) are separate CSS properties; no conflict | DELIVERED |

**Requirement coverage: 6/6 (100%)**

---

## Deviations from Plan

### Plan 02-01

**None.** Plan executed exactly as written. The `align` variant on SFStack was explicitly listed as "Claude's discretion" in the plan action and was included — this is authorized plan latitude, not a deviation.

### Plan 02-02

**1. [Rule 1 - Bug] Polymorphic ref cast required `React.Ref<any>` instead of `React.Ref<HTMLElement>`**

- **Found during:** Task 1 TypeScript verification
- **Issue:** TypeScript cannot assign `RefObject<HTMLElement>` to the intersection type `RefObject<HTMLHeadingElement> & RefObject<HTMLLabelElement> & RefObject<HTMLParagraphElement>` required by the polymorphic element union — tsc emits an error on `ref as React.Ref<HTMLElement>`
- **Fix:** Changed to `ref as React.Ref<any>` per the plan's RESEARCH.md Pitfall 1 reference; added `// eslint-disable-next-line @typescript-eslint/no-explicit-any` comment to the cast
- **Files modified:** components/sf/sf-text.tsx
- **Commit:** 4b40101
- **Note:** This outcome was pre-anticipated by the plan's RESEARCH.md reference and is not a surprising deviation — it is the expected correct implementation

**No architectural deviations. No Rule 4 stops.**

---

## Artifacts Delivered

| Artifact | Type | File Path | Commit |
|----------|------|-----------|--------|
| SFContainer | Created | components/sf/sf-container.tsx | 9a502b7 |
| SFSection | Created | components/sf/sf-section.tsx | 9a502b7 |
| SFStack | Created | components/sf/sf-stack.tsx | 9a502b7 |
| sf/index.ts Layout Primitives block (initial) | Modified | components/sf/index.ts | b49913b |
| SFGrid | Created | components/sf/sf-grid.tsx | 4b40101 |
| SFText | Created | components/sf/sf-text.tsx | 4b40101 |
| sf/index.ts Layout Primitives block (complete) | Modified | components/sf/index.ts | ea03bfe |

All artifacts exist on disk and in git history.

---

## Key Decisions Made

| Decision | Rationale | Impacts |
|----------|-----------|---------|
| SFSection uses prop-based spacing (no CVA) | Single dimension with 4 values — CVA adds wrapper complexity with zero benefit | sf-section.tsx API simplicity |
| SFStack includes `align` variant (stretch default) | Plan explicitly offered this as Claude's discretion; adds flex alignment control with no API cost | SFStack API surface |
| data-bg-shift uses presence-only boolean pattern | Consistent with data-section-label omission pattern — undefined = absent, "" = present | SFSection data attribute behavior |
| SFGrid uses numeric string keys ("3") not literal numbers for CVA | CVA variant keys must match Tailwind class strings without ambiguity | SFGrid cols variant type safety |
| SFText uses plain Record maps not CVA | Single variant dimension; CVA abstraction adds no value over a direct Record lookup | SFText implementation clarity |
| Polymorphic ref cast uses `React.Ref<any>` | TypeScript cannot narrow across HTMLHeadingElement|HTMLParagraphElement|HTMLSpanElement|HTMLLabelElement intersection | SFText forwardRef compatibility |
| SFButton PRM-06 audit: no code changes | transition-colors (color props) and .sf-pressable (transform) are separate CSS properties — no conflict exists | SFButton remains unchanged |

---

## Verifier Handoff

### What was built

Phase 2 delivered five Server Component primitives that enforce the Phase 1 token system by construction. An existing component (SFButton) was audited and confirmed compliant. All six are barrel-exported from `components/sf/index.ts` under the `// Layout Primitives` heading.

The enforcement mechanism is TypeScript — not documentation, not convention. Invalid spacing values, invalid grid column counts, and invalid typography variants produce compile-time errors. The system makes the correct path the easy path.

### How to verify

**Compile-time enforcement (no server needed):**

```bash
# TypeScript compilation — must pass with no new errors
cd /Users/greyaltaer/code/projects/SignalframeUX
npx tsc --noEmit 2>&1 | head -30

# All five primitives use forwardRef (each file must return 1)
grep -c "forwardRef" components/sf/sf-container.tsx components/sf/sf-section.tsx components/sf/sf-stack.tsx components/sf/sf-grid.tsx components/sf/sf-text.tsx

# No primitive uses 'use client' (each file must return 0)
grep -c "'use client'" components/sf/sf-container.tsx components/sf/sf-section.tsx components/sf/sf-stack.tsx components/sf/sf-grid.tsx components/sf/sf-text.tsx

# Barrel export structure
grep -n "Layout Primitives\|SFContainer\|SFSection\|SFStack\|SFGrid\|SFText\|TextVariant" components/sf/index.ts

# SFButton PRM-06 compliance
grep "sf-pressable\|transition-colors" components/sf/sf-button.tsx
```

**Token linkage (layout tokens consumed by SFContainer):**

```bash
grep "var(--max-w-\|var(--gutter" components/sf/sf-container.tsx
```

**Data attribute injection (SFSection):**

```bash
grep "data-section" components/sf/sf-section.tsx
```

**Blessed gap enforcement (SFStack):**

```bash
# Gap variant keys must be exactly the 9 blessed stops
grep "gap:" components/sf/sf-stack.tsx
```

**Semantic typography class linkage (SFText):**

```bash
grep "text-heading-\|text-body\|text-small" components/sf/sf-text.tsx
```

### What is NOT verified here (and what to verify next)

The primitives are structurally correct and compile. What requires visual verification (Phase 4 scope):

1. **Rendered output in browser** — that CSS custom properties resolve correctly at runtime (e.g., `var(--max-w-wide)` = 80rem in Tailwind's JIT output)
2. **Responsive breakpoints** — that SFGrid `cols="3"` actually produces the expected 1→2→3 column progression at sm/md/lg
3. **GSAP ref targeting** — that `ref.current` resolves to the expected DOM element type in a real GSAP animation context
4. **SFText semantic rendering** — that `variant="heading-1"` visually applies Anton font + 3xl size from `text-heading-1` utility class

### Known pre-existing issues (out of scope for Phase 2)

- `components/animation/color-cycle-frame.tsx` — TypeScript error (useRef missing argument) pre-dates Phase 2; deferred
- `components/ui/dark-mode-toggle.tsx` — pre-existing TypeScript error; deferred

Neither issue was introduced by Phase 2 work. Both were present before Phase 2 first commit (9a502b7).

### Ready for Phase 3

Phase 2 is complete. All six layout primitives are in place. Phase 1 token system is consumed by construction. The FRAME layer is stable.

Phase 3 (SIGNAL Expression) can begin from `.planning/phases/03-signal-expression/`.
