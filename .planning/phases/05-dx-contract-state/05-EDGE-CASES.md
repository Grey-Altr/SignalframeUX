---
phase: 05-dx-contract-state
generated: "2026-04-05T00:00:00Z"
finding_count: 3
high_count: 0
has_bdd_candidates: false
---

# Phase 5: Edge Cases

**Generated:** 2026-04-05
**Findings:** 3 (cap: 8)
**HIGH severity:** 0
**BDD candidates:** no

## Findings

### 1. [MEDIUM] color-cycle-frame.tsx setProperty guard: concurrent theme toggle not fully ruled out

**Plan element:** `components/animation/color-cycle-frame.tsx`
**Category:** boundary_condition

Task 3 in plan 05-01 calls for a 2-line guard (check for `sf-no-transition` class before calling `setProperty`) only if a conflict is found during the grep audit. The research conclusion is that `setProperty` is instant and does not conflict with the transition suppression mechanism. However, the edge case of a theme toggle occurring mid-cycle animation that overwrites `--color-primary` is real (acknowledged in the task action itself). The task should document the deliberate decision not to guard even when the theme toggle fires mid-cycle — the null-finding documentation path in `<done>` is adequate only if the rationale is captured. If the executor follows the "null finding → no guard" path without documenting the concurrent overwrite risk, the audit is incomplete.

### 2. [MEDIUM] JSDoc @example validity not verified against actual component props

**Plan element:** `components/sf/sf-button.tsx` (and all 28 targets)
**Category:** boundary_condition

Both plan 05-02 tasks require `@example` blocks to "use actual props from the component's interface." There is no automated check that the JSX in `@example` blocks is syntactically valid or that the prop names used match the exported interface. TypeScript does not type-check JSDoc `@example` content. An executor could write `<SFButton variant="primary">` when the actual prop is `intent="primary"` and the verify command (`grep -q "@example"`) would still pass. No mechanism catches stale or incorrect examples.

### 3. [LOW] docs/ directory creation not an explicit task step

**Plan element:** `docs/SCAFFOLDING.md`
**Category:** error_path

Plan 05-01 Task 1 action says "Create `docs/` directory. Write `docs/SCAFFOLDING.md`..." but the directory creation is embedded in the prose, not an explicit step or a separate Wave 0 task. Research pitfall 5 explicitly called this out as a known risk. If the executor skips the mkdir step on a system where the directory does not auto-create, the file write will fail. The `<verify>` command (`test -f docs/SCAFFOLDING.md`) would catch this failure, but only after the task has already failed.
