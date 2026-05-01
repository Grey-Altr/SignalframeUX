# Phase 68 — Deferred Items

> Out-of-scope discoveries logged during plan execution. Each entry is a follow-up
> ticket — NOT auto-fixed by the current plan.

## DEFERRED-68-01-A — Phase 66 LCP-stability regression run

**Origin:** Plan 68-01, Task 2 (regression check).
**Discovered:** 2026-04-29 during plan 68-01 execution.

**Plan asked for:**

```bash
pnpm exec playwright test tests/v1.9-phase66-lcp-stability.spec.ts --project=chromium
```

…to confirm Phase 66's paint-stability spec stays green alongside the new
structural guard, providing layered coverage of the v1.9 architectural-lock
LCP surface.

**Reality on disk (worktree base `f7b0c0d`, branch `worktree-agent-a769fbf4`):**

```
$ ls tests/ | grep -iE "v1\.9|phase66"
(no matches)
```

The v1.9 milestone (Phases 66–70) has not yet shipped any test artefact under
that name. There is nothing to regress against from this plan's vantage point.

**Action:** Re-run the regression command once Phase 66 lands its stability
spec on `main`. Expected layered behaviour:
- Plan 68-01 spec catches LCP candidate identity drift (element renamed/moved/removed).
- Phase 66 spec catches LCP timing/paint-state drift (LCP shifts off-candidate
  due to defer-paint mistuning, font-swap regression, etc.).
- Both must remain green for the v1.9 LCP surface to be considered protected.

**Routing:** Whoever closes Phase 66's stability spec should add this regression
run to the Phase 66 SUMMARY's verification block, then mark this deferred item
SATISFIED.
