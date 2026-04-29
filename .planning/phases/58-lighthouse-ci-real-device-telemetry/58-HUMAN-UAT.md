---
status: partial
phase: 58-lighthouse-ci-real-device-telemetry
source: [58-02-PLAN.md Task 7 — checkpoint:human-action gate=blocking]
started: 2026-04-26
updated: 2026-04-26
---

## Current Test

[awaiting user repo-settings action — code-side gate is fully wired, Playwright-verified locally 25/25]

## Tests

### 1. Vercel GitHub App holds `deployments:write` (OQ-01)

expected: https://github.com/settings/installations → Vercel app → repository permissions → **Deployments: Read & write** is granted on the SignalframeUX repo.
how to verify: open a trivial-change PR; within ~3 min of Vercel's preview success, the **Lighthouse** workflow should appear in the Actions tab. If it does NOT appear, fall back to the OQ-01 alternative trigger (`pull_request` + `vercel/wait-for-vercel-deployment`) documented in `58-02-PLAN.md` notes.
result: [pending]

### 2. Branch protection on `main` requires the `audit` check (OQ-03)

expected: Settings → Branches → branch protection rule for `main` → "Require status checks to pass before merging" → check named **`audit`** (job name in `.github/workflows/lighthouse.yml`) is required.
how to verify: open a PR with an artificially regressed perf score (e.g., import a 200KB unused dep). The Merge button should be **blocked** by the failing Lighthouse check. The `audit` check only appears in the rule-search list AFTER one workflow run has completed — do test 1 first.
result: [pending]

## Summary

total: 2
passed: 0
issues: 0
pending: 2
skipped: 0
blocked: 0

## Gaps

(none yet — both items are deferred-pending, not failed)
