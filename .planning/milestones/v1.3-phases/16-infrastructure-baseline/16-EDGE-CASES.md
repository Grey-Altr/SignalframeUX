---
phase: 16-infrastructure-baseline
generated: "2026-04-06T20:00:00.000Z"
finding_count: 4
high_count: 0
has_bdd_candidates: false
---

# Phase 16: Edge Cases

**Generated:** 2026-04-06
**Findings:** 4 (cap: 8)
**HIGH severity:** 0
**BDD candidates:** no

## Findings

### 1. [MEDIUM] Lighthouse CLI unavailability leaves BASELINE.md with placeholder metrics

**Plan element:** `.planning/phases/16-infrastructure-baseline/BASELINE.md`
**Category:** error_path

Plan 01 Task 2 gracefully handles missing Lighthouse CLI by recording placeholder instructions instead of measured LCP/TTI/Performance values. This means INFRA-02 ("Lighthouse LCP/TTI/bundle size recorded") may only be partially satisfied -- bundle size will be measured from build output, but Lighthouse metrics could remain as manual instructions. The acceptance criteria AC-3 specifies "numbered values" which placeholders would not satisfy.

### 2. [MEDIUM] shadcn @latest fallback may produce different class patterns

**Plan element:** `components/ui/accordion.tsx`
**Category:** boundary_condition

Plan 01 Task 1 allows fallback from `shadcn@4.1.2` to `shadcn@latest` if the pinned version fails. A newer shadcn version could generate different Tailwind classes (different `rounded-*` patterns, different component structure), making the rounded-* audit in step 6 inaccurate for downstream SF wrapper authors in Phases 17-19. The SCAFFOLDING.md Known Pitfalls section warns about version pinning but the fallback path does not require re-verification.

### 3. [LOW] Stale session filter values default silently

**Plan element:** `components/blocks/components-explorer.tsx`
**Category:** empty_state

Users with existing sessions storing old filterTag values (e.g., "INPUT", "SIGNAL") will see stale values that don't match any new CATEGORIES entry. The plan correctly notes this defaults to "ALL" via useSessionState, so no data loss occurs. This is handled appropriately.

### 4. [MEDIUM] VALIDATION.md references stale 3-plan structure

**Plan element:** `16-VALIDATION.md`
**Category:** error_path

The VALIDATION.md Per-Task Verification Map references task IDs 16-01-01 through 16-03-01 across 3 plans, but only 2 plans exist. Requirement mappings in VALIDATION.md (e.g., 16-01-01 -> INFRA-01) don't match actual plan requirement claims (Plan 01 claims INFRA-02, Plan 02 claims INFRA-01/03/04). If executors reference VALIDATION.md for task guidance, the mappings will be misleading.
