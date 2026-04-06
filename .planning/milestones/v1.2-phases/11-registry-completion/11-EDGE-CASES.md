---
phase: 11-registry-completion
generated: "2026-04-06T00:00:00Z"
finding_count: 3
high_count: 1
has_bdd_candidates: true
---

# Phase 11: Edge Cases

**Generated:** 2026-04-06
**Findings:** 3 (cap: 8)
**HIGH severity:** 1
**BDD candidates:** yes

## Findings

### 1. [HIGH] shadcn build failure leaves public/r/ in partial state

**Plan element:** `pnpm registry:build` (Task 2, Step 3)
**Category:** error_path

If `shadcn build` exits non-zero mid-write (e.g., a malformed registry item causes the CLI to abort), public/r/ may contain a mix of old and new files. The plan backs up base.json but does not handle a partial registry build state. The verify command checks file count post-build but cannot distinguish between a clean build and a partial one where old files remain alongside new ones.

**BDD Acceptance Criteria Candidate:**
```
Given shadcn build fails on item N of 33
When Task 2 verify runs `ls public/r/*.json | wc -l`
Then the command should still pass (old files remain) even though the registry is inconsistent — exposing a false-green verification
```

### 2. [MEDIUM] CVA dependency check relies on executor judgment, not automated verification

**Plan element:** `components/sf/sf-container.tsx` (Task 1, Step 2)
**Category:** boundary_condition

The action says "Check each component source file to confirm whether it imports CVA — only list class-variance-authority in dependencies if the component actually uses it." This check is manual judgment during execution; no automated verify step confirms the dependency list is accurate for each layout primitive. If sf-section or sf-text are incorrectly given `class-variance-authority` as a dependency, consumers install an unused package.

### 3. [LOW] sf-theme.json manual creation path not verified for cssVars completeness

**Plan element:** `public/r/sf-theme.json` (Task 2, Step 8)
**Category:** empty_state

The fallback path (if shadcn build does not generate sf-theme.json) is to manually create it by copying cssVars from registry.json. The verify command checks `t.cssVars` exists but does not validate the cssVars object has all required token sub-keys (theme/light/dark). A manually created file missing the `dark` section would pass verification.
