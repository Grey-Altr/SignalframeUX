---
phase: 64
slug: bisect-protection-3pr-ship
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-28
---

# Phase 64 — Validation Strategy

> Per-phase validation contract. Phase 64 is a CI orchestration + human-gate phase; "validation" means proving infrastructure gates are LIVE (not merely configured) and that shipped commits don't regress those gates.

> Source for surfaces V1–V7: `64-RESEARCH.md` § Validation Architecture.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright @1.x (already installed) + GitHub CLI (`gh`) for API probes |
| **Config file** | `playwright.config.ts` + workflow files in `.github/workflows/` |
| **Quick run command** | `pnpm exec playwright test tests/v1.8-phase63-1-pitfall-10.spec.ts tests/v1.8-phase63-1-wordmark-hoist.spec.ts` |
| **Full suite command** | `pnpm exec playwright test` |
| **Estimated runtime** | quick: ~30s; full: ~3 min |

---

## Sampling Rate

- **After every task commit:** Run quick command (Pitfall #10 + wordmark fidelity specs).
- **After every plan wave:** Run full Playwright suite locally + open the corresponding PR to trigger LHCI.
- **Before `/pde:verify-work`:** Full Playwright suite must be green AND LHCI `audit` check must be green on the most recent PR.
- **Max feedback latency:** ~30s for spec verification; ~12 min for LHCI feedback (waiting on Vercel preview deploy + LHCI run).

---

## Per-Task Verification Map

| Surface | Plan | Wave | Requirement | Type | Automated Command | Status |
|---------|------|------|-------------|------|-------------------|--------|
| V1 — Vercel `deployments:write` live | 01 | 1 | Phase 58 D-10 #1 | manual+probe | `gh run list --workflow=lighthouse.yml --limit=3` | ⬜ pending |
| V2 — `audit` required check on `main` | 01 | 1 | Phase 58 D-10 #2 | probe | `gh api repos/{owner}/{repo}/branches/main/protection --jq '.required_status_checks.contexts[]'` (expect `audit`) | ⬜ pending |
| V3 — LHCI fail-blocks regressed PR (e2e proof) | 01 | 1 | CRT-05 | manual+observation | open noop regression PR, observe `audit` FAIL + merge button blocked, close PR | ⬜ pending |
| V4 — Pitfall #10 spec PASSes after recalibration | 02 | 1 | 63.1-COHORT §7 #1 / Pitfall #10 / D-09 successor | unit | `pnpm exec playwright test tests/v1.8-phase63-1-pitfall-10.spec.ts` | ⬜ pending |
| V5 — D-12 wordmark fidelity holds through ship | 03 | 1 | (carry from 63.1) | unit | `pnpm exec playwright test tests/v1.8-phase63-1-wordmark-hoist.spec.ts` (5/5 PASS) | ⬜ pending |
| V6 — three distinct merge commits on main in bisect order | 03 | 3 | CRT-05 | shell | `git log --oneline main \| head -10` shows 59-01, 59-02, 59-03 not squashed | ⬜ pending |
| V7 — full CI spec suite green on main after final merge | 03 | 3 | CRT-05 | unit | `pnpm exec playwright test` (or `gh run list --workflow=ci.yml --limit=3`) | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

> Note: V1, V2, V3 require GitHub UI / API actions that depend on org-level GitHub App permission grants. These are user-action checkpoints inside Plan 01.

---

## Wave 0 Requirements

- [ ] No new test files needed — all surfaces use existing specs or `gh` CLI probes.
- [ ] `gh` CLI is already installed in the dev environment (verify: `gh --version`).
- [ ] Vercel GitHub App must be installed on the repo before Plan 01 can begin.

*Existing infrastructure covers all Phase 64 verification surfaces; no new framework / fixture / harness is required.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Vercel GitHub App `deployments:write` permission | Phase 58 D-10 #1 | GitHub UI flow; no scriptable API | `Settings → Integrations → GitHub Apps → Vercel → Configure → Repository permissions → Deployments: Read & write → Save` |
| Branch protection `audit` required check | Phase 58 D-10 #2 | GitHub UI flow; required-check name only surfaces in UI dropdown after first LHCI run | `Settings → Branches → branch protection rule on main → Require status checks → search "audit" → enable` |
| LHCI gate proven to BLOCK a regression | CRT-05 | Requires opening a deliberate regression PR, observing GitHub UI block state, closing PR | Open a PR adding `import _ from 'lodash'` to a page; observe `audit` check FAIL + merge button greyed; close PR without merging |
| Three sequential PR merges in bisect order | CRT-05 | Requires merge button click in GitHub UI per PR, with 10–15 min LHCI wait between each | Open `ship/59-01` → wait LHCI green → merge → repeat for `ship/59-02` → repeat for `ship/59-03` |

*All other Phase 64 behaviors have automated verification (V4 + V5 + V6 + V7).*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or are explicitly listed under Manual-Only Verifications above.
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify (manual-gate sequences are bounded by automated probes V1/V2 around them).
- [ ] Wave 0 covers all MISSING references (none — all infrastructure already exists).
- [ ] No watch-mode flags.
- [ ] Feedback latency < 30s for spec verifications (LHCI surface latency is platform-bound and documented in Sampling Rate).
- [ ] `nyquist_compliant: true` set in frontmatter (deferred until planner finalizes per-task mapping).

**Approval:** pending — planner to finalize per-task mapping in Plans 01–03 frontmatter `verification_map` blocks before flipping `nyquist_compliant: true`.
