---
phase: 35-performance-launch-gate
generated: "2026-04-09T00:00:00Z"
finding_count: 5
high_count: 2
has_bdd_candidates: true
---

# Phase 35: Edge Cases

**Generated:** 2026-04-09
**Findings:** 5 (cap: 8)
**HIGH severity:** 2
**BDD candidates:** yes

## Findings

### 1. [HIGH] Bundle-gate test may silently PASS when `.next/build-manifest.json` is missing

**Plan element:** `tests/phase-35-bundle-gate.spec.ts` (35-02-PLAN.md Task 1)
**Category:** error_path

The Task 1 action in plan 35-02 says "Read .next/build-manifest.json (fall back to .next/app-build-manifest.json if App Router manifest path differs)". If both files are missing because `pnpm build` was not run before the test, the current action does not specify whether the test should HARD FAIL (explicit error, preferred) or skip. A silent-skip path is a false-negative in a CI-blocking gate.

**BDD Acceptance Criteria Candidate:**
```
Given .next/build-manifest.json AND .next/app-build-manifest.json are both absent
When tests/phase-35-bundle-gate.spec.ts runs
Then the test MUST throw a clear "run `pnpm build` first" error and exit non-zero
```

### 2. [HIGH] Lighthouse advisory flake escalation path unclear when cap already at 5

**Plan element:** `scripts/launch-gate.ts` invocation in 35-05-PLAN.md Task 3
**Category:** boundary_condition

If the final production Lighthouse run produces a <100 score AND the 5-fix cap from plan 35-04 is already fully consumed, the task currently lists three options (within cap, cap overflow escalation, accept-as-risk) but does not specify what happens if Grey is unreachable at close time. Close commit cannot land with an unresolved Lighthouse category failure, but the plan does not specify a default deferral path for that blocking scenario.

**BDD Acceptance Criteria Candidate:**
```
Given launch-gate.ts reports a category <100 on production AND 5-fix cap is exhausted AND Grey is unreachable
When the plan 35-05 Task 3 verify step runs
Then the close commit MUST NOT land; the phase BLOCKS with an explicit "waiting on Grey escalation" marker in STATE.md
```

### 3. [MEDIUM] Font fallback path ambiguity in OG image (Option A vs Option B)

**Plan element:** `app/opengraph-image.tsx` (35-03-PLAN.md Task 1 Step 1)
**Category:** error_path

Task 1 of plan 35-03 lists Option A (substitute JetBrains Mono ttf) and Option B (system monospace fallback). Both options produce different OG image visuals. The plan does not specify which option is preferred when BOTH are available or which fallback the execute-phase agent should take if Option A's ttf sourcing fails mid-run. A silent decision here produces an inconsistent shipped OG image vs the brief's "locked composition" intent.

### 4. [MEDIUM] `production-console-sweep.md` warning-count triage loop is unbounded

**Plan element:** `.planning/phases/35-performance-launch-gate/production-console-sweep.md` (35-05-PLAN.md Task 2)
**Category:** boundary_condition

The plan says "if any route has non-zero errors or warnings, fix within cap, redeploy, re-run this task." There is no explicit iteration cap. If a persistent third-party warning (e.g., CDN CSP notice) cannot be silenced within the 5-fix cap, the task can loop indefinitely. Brief §LR-03 is explicit that warnings are launch-gate failures equivalent to errors, so silent acceptance is not an option.

### 5. [LOW] `task-count` warning: plans 03/04/05 each have 4+ auto tasks

**Plan element:** 35-03-PLAN.md, 35-04-PLAN.md, 35-05-PLAN.md task lists
**Category:** boundary_condition

Scope sanity thresholds (2-3 target, 4 warning, 5+ blocker). Task-type breakdown:
- 35-03: 4 auto + 1 checkpoint (warning)
- 35-04: 4 auto + 3 checkpoints (warning; context cost offset by task-sharding into 35-04-tasks/)
- 35-05: 4 auto + 1 checkpoint (warning)

The sharded `35-04-tasks/` and `35-05-tasks/` directories indicate the planner recognized scope pressure. Not blocker-severity, but a context-budget risk at execute-phase time.
