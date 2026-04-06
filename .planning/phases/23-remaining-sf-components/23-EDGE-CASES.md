---
phase: 23-remaining-sf-components
generated: "2026-04-06T00:00:00Z"
finding_count: 5
high_count: 2
has_bdd_candidates: true
---

# Phase 23: Edge Cases

**Generated:** 2026-04-06
**Findings:** 5 (cap: 8)
**HIGH severity:** 2
**BDD candidates:** yes

## Findings

### 1. [HIGH] vaul SSR crash if sf-drawer.tsx is imported outside lazy boundary

**Plan element:** `components/sf/sf-drawer-lazy.tsx`
**Category:** error_path

Plan 02 Task 1 creates `sf-drawer-lazy.tsx` with `ssr: false` but the real `sf-drawer.tsx` has `"use client"` at top. If a consumer accidentally imports `sf-drawer.tsx` directly in a Server Component context (bypassing the lazy loader), vaul's `window` references will throw `ReferenceError: window is not defined` during build. The plan's Task 1 Step 3 only verifies absence from barrel — it does not add a guard or JSDoc warning strong enough to prevent direct server-side import.

**BDD Acceptance Criteria Candidate:**
```
Given a developer imports sf-drawer.tsx directly (not sf-drawer-lazy.tsx)
When Next.js attempts to render the importing Server Component during SSR
Then the build exits with code non-zero and a clear error message referencing vaul/window
```

### 2. [HIGH] SFInputGroupButton rounded-none override may lose to CVA specificity

**Plan element:** `components/sf/sf-input-group.tsx`
**Category:** error_path

Plan 01 Task 1 Step 2 instructs wrapping `InputGroupButton` with `cn("rounded-none", ...)` to override CVA's `rounded-[calc(var(--radius)-3px)]`. However, the RESEARCH explicitly documents (Pitfall 4) that CVA applies classes at the sub-element level. Tailwind Merge resolves conflicting `rounded-*` by last-write-wins, but if the CVA variant string produces `rounded-[calc(var(--radius)-3px)]` and the SF cn() call places `rounded-none` before it in the merge order, the CVA value may survive. The plan action says to apply `rounded-none` "in cn()" but does not specify whether it is placed before or after the spread of className. If executor places `rounded-none` first in cn(), and CVA applies after, the constraint is silently violated.

**BDD Acceptance Criteria Candidate:**
```
Given SFInputGroupButton renders with default CVA variant
When computed border-radius is inspected in browser DevTools
Then border-radius is 0px on all sides of the button element
```

### 3. [MEDIUM] 23-01-SUMMARY.md referenced in plan 02 but does not exist at plan-check time

**Plan element:** `components/sf/sf-drawer-lazy.tsx` (plan 02 read_first list)
**Category:** empty_state

Plan 02 Task 1 lists `.planning/phases/23-remaining-sf-components/23-01-SUMMARY.md` in `read_first`. This file is created as the output of plan 01 execution. At plan-check time, the file does not exist. During execution, if plan 02 is executed before plan 01 completes (or if the executor reads context before the SUMMARY is written), the read_first will silently miss context. The wave 2 depends_on enforces order, but the SUMMARY creation is noted as an `<output>` block — if the executor skips writing it, plan 02 loses its intended context.

### 4. [MEDIUM] SFDrawer sub-components inaccessible from barrel for direct composition

**Plan element:** `components/sf/sf-drawer.tsx`
**Category:** empty_state

The RESEARCH (Pitfall 3) correctly identifies that sub-components (`SFDrawerContent`, `SFDrawerHeader`, etc.) must be imported directly from `sf-drawer.tsx` since they cannot go in the barrel. However, plan 02 Task 1 does not include any task that documents or tests this direct import pattern. The JSDoc in `sf-drawer-lazy.tsx` shows the correct usage, but the ComponentsExplorer preview at index "012" does not use the real SF components (it uses CSS-only sketches), so the pattern is never exercise-tested within this phase. A consumer building against v1.4 could discover the import pattern only from the JSDoc.

### 5. [LOW] ComponentsExplorer DRAWER entry version update is implicit, not verified

**Plan element:** `components/blocks/components-explorer.tsx`
**Category:** boundary_condition

Plan 02 Task 2 Step 2 instructs updating DRAWER's `version` field from `"v2.0.0"` to `"v1.4.0"`. This is noted in the action but is not covered by any `<verify>` automated command. The task's `<verify>` block checks `grep 'HOVER_CARD\|INPUT_OTP\|INPUT_GROUP'` and `ls public/r/...` — neither verifies the DRAWER version field was updated. This is a low-risk oversight (cosmetic), but it could leave DRAWER at `"v2.0.0"` if the executor misses the step.

