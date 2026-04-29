---
status: partial
phase: 59-critical-path-restructure
source: [59-VERIFICATION.md — human_verification section]
started: 2026-04-26
updated: 2026-04-26
---

## Current Test

[awaiting per-plan PR ship in CRT-05 bisect order]

## Tests

### 1. LHCI median-of-5 ≥97 on Plan A PR (CRT-01)

expected: PR for canvas-sync inline (commits 235d0f0 → ef7169f) shows the GitHub Actions "Lighthouse" workflow with median-of-5 mobile + desktop ≥97 perf, CLS=0, LCP≤1000ms.
how to verify: Open PR for the CRT-01 cohort. Wait for Vercel preview deploy → LHCI workflow auto-fires (requires Phase 58 HUMAN-UAT item 1 = Vercel app `deployments:write`). Inspect Lighthouse summary on the PR.
result: [pending]

### 2. LHCI median-of-5 ≥97 on Plan B PR (CRT-02 + CRT-03)

expected: PR for Anton subset+swap (commits 5fc28b6 → 47fe585) shows median-of-5 ≥97 mobile + desktop. Slow-3G CLS=0 already verified locally; LHCI confirms cold-start variance discipline holds in CI.
how to verify: Open PR after Plan A merges. AES-02 cohort review already complete (audit log at 59-AES02-EXCEPTION.md §Cohort Acceptance — 2026-04-26:L49). Inspect LHCI summary.
result: [pending]

### 3. LHCI median-of-5 ≥97 on Plan C PR (CRT-04)

expected: PR for Lenis rIC defer (commits 654cf9e → fc3827c) shows median-of-5 ≥97 mobile + desktop. Plan C is invisible by construction; primary signal is no-regression.
how to verify: Open PR after Plan B merges. Inspect LHCI summary.
result: [pending]

### 4. Three atomic merge commits on main in CRT-05 bisect order

expected: `git log --oneline main` shows three distinct merge (or squash) commits in order: 59-01 → 59-02 → 59-03. Any future LCP/CLS regression bisects to a single intervention surface.
how to verify: After all three PRs land in sequence, run `git log --oneline main | head -10` and confirm bisect order. Phase 58 HUMAN-UAT item 2 (branch-protection `audit` required check) must be active for CRT-05 protection to be enforced — bypass was acknowledged during Plan B execution; gate carries over here.
result: [pending]

## Summary

total: 4
passed: 0
issues: 0
pending: 4
skipped: 0
blocked: 0

## Gaps

(none yet — all four items are deferred-pending PR-ship action, not failed)

## Carry-over from Phase 58

| Phase 58 HUMAN-UAT Item | State | Impact on Phase 59 ship |
|--------------------------|-------|--------------------------|
| 1. Vercel `deployments:write` (OQ-01) | pending | Required for items 1-3 (LHCI workflow trigger on PRs) |
| 2. Branch-protection `audit` check (OQ-03) | pending | Required for item 4 (CRT-05 bisect protection enforcement) |

User invoked `bypass-uat-gate: acknowledged` during Plan B execution to allow code work to land on `chore/v1.7-ratification`. The gates remain due before any of the three PRs can be opened with full CRT-05 protection.
