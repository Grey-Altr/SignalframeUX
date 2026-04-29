---
phase: 63
slug: wpt-real-device-verification
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-27
---

# Phase 63 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> This is a measurement + doc-render phase: no test runner, no app code under test.
> Validation is **observability-based** — every WPT JSON and every synthesis line is
> verified deterministically via `jq` / `grep` / `diff` before commit.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `jq` 1.7+ (shell) + `bash` exit codes — no test runner needed |
| **Config file** | none |
| **Quick run command** | `jq -e '.median.firstView.LCP < 1000 and .median.firstView.CLS <= 0.005 and (.per_run_lcp \| length) == 5' .planning/perf-baselines/v1.8/vrf-01-{profile}.json` |
| **Full suite command** | `for p in ios-iphone13 android-a14 android-midtier; do jq -e '.median.firstView.LCP < 1000 and .median.firstView.CLS <= 0.005 and (.per_run_lcp \| length) == 5' .planning/perf-baselines/v1.8/vrf-01-${p}.json \|\| exit 1; done && grep -E '\*\*PASS\*\*' .planning/perf-baselines/v1.8/MID-MILESTONE-CHECKPOINT.md` |
| **Estimated runtime** | <5 seconds (post-harvest); WPT harvest itself: 15–45 min queue-bounded |

---

## Sampling Rate

- **After every task commit:** Run the matching quick `jq -e` assertion for that wave's JSON output.
- **After every plan wave:** Run the full suite command above.
- **Before `/pde:verify-work`:** Full suite + sign-off grep must be green.
- **Max feedback latency:** 5 seconds (jq), excluding WPT external queue time.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 63-01-W0a | 01 | 0 | VRF-01 | T-63-01 | API key never committed | secret-scan | `git ls-files \| grep -iE 'wpt.*key\|api.*key' \| wc -l` returns `0` | ✅ | ⬜ pending |
| 63-01-W0a | 01 | 0 | VRF-01 | — | Prod URL reachable, baseline LCP within ±20% of 657ms | smoke | `curl -fsSL -o /dev/null -w '%{http_code}' "$PROD_URL"` returns `200` | ✅ | ⬜ pending |
| 63-01-W1a | 01 | 1 | VRF-01 | — | iPhone 13 JSON: 5 runs, fvonly=0, LCP <1000ms, CLS ≤0.005 | jq-assert | `jq -e '(.per_run_lcp \| length) == 5 and .median.firstView.LCP < 1000 and .median.firstView.CLS <= 0.005 and .median.repeatView.LCP' .planning/perf-baselines/v1.8/vrf-01-ios-iphone13.json` | ❌ W1 | ⬜ pending |
| 63-01-W1a | 01 | 1 | VRF-01 | — | testId non-empty (real WPT run) | jq-assert | `jq -e '.testId \| length > 0' vrf-01-ios-iphone13.json` | ❌ W1 | ⬜ pending |
| 63-01-W1a | 01 | 1 | VRF-01 | — | Location slug recorded | jq-assert | `jq -e '.location \| length > 0' vrf-01-ios-iphone13.json` | ❌ W1 | ⬜ pending |
| 63-01-W1a | 01 | 1 | VRF-01 | — | JSON pruned <50 KB | size-check | `test $(wc -c < vrf-01-ios-iphone13.json) -lt 51200` | ❌ W1 | ⬜ pending |
| 63-01-W1b | 01 | 1 | VRF-01 | — | Galaxy A14 JSON: same shape contract as W1a | jq-assert | same as W1a substituting `vrf-01-android-a14.json` | ❌ W1 | ⬜ pending |
| 63-01-W1c | 01 | 1 | VRF-01 | — | Mid-tier Android JSON: same shape contract | jq-assert | same as W1a substituting `vrf-01-android-midtier.json` | ❌ W1 | ⬜ pending |
| 63-01-W2a | 01 | 2 | VRF-04 | — | Synthesis doc exists at canonical path | file-check | `test -f .planning/perf-baselines/v1.8/MID-MILESTONE-CHECKPOINT.md` | ❌ W2 | ⬜ pending |
| 63-01-W2a | 01 | 2 | VRF-04 | — | Phase mirror byte-identical | diff | `diff .planning/perf-baselines/v1.8/MID-MILESTONE-CHECKPOINT.md .planning/phases/63-wpt-real-device-verification/63-MID-MILESTONE-CHECKPOINT.md` returns empty | ❌ W2 | ⬜ pending |
| 63-01-W2a | 01 | 2 | VRF-04 | — | PASS verdict written | grep | `grep -E '\*\*PASS\*\*' .planning/perf-baselines/v1.8/MID-MILESTONE-CHECKPOINT.md` | ❌ W2 | ⬜ pending |
| 63-01-W2a | 01 | 2 | VRF-04 | — | Pitfall #10 thresholds verbatim | grep | `grep -E 'real ÷ synthetic > 1\.3' MID-MILESTONE-CHECKPOINT.md` | ❌ W2 | ⬜ pending |
| 63-01-W2a | 01 | 2 | VRF-04 | — | All 3 device JSON paths cited | grep-count | `grep -cE 'vrf-01-ios-iphone13\|vrf-01-android-a14\|vrf-01-android-midtier' MID-MILESTONE-CHECKPOINT.md` ≥3 | ❌ W2 | ⬜ pending |
| 63-01-W2a | 01 | 2 | VRF-04 | — | Phase 60 synthetic baseline cited | grep | `grep -E 'phase-60-mobile-lhci\.json' MID-MILESTONE-CHECKPOINT.md` | ❌ W2 | ⬜ pending |
| 63-01-W2a | 01 | 2 | VRF-04 | — | YAML frontmatter status field | grep | `grep -E '^status: (PASS\|FAIL)$' MID-MILESTONE-CHECKPOINT.md` | ❌ W2 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `~/.wpt-api-key` exists with mode `600` (operator-side, not in repo)
- [ ] Prod URL responds 200 + LCP within ±20% of Phase 60 baseline (657ms desktop / mobile equivalent)
- [ ] `.planning/perf-baselines/v1.8/` writable
- [ ] No new test infrastructure needed — Wave 0 is environment-only, not test-stub creation.

*Existing infrastructure covers all phase requirements. Phase 63 introduces no test runners, no fixtures, no specs.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| WPT free-tier device-emulator slug accuracy | VRF-01 | WPT slugs may route to emulated CPU rather than hardware; the actual `device_profile` is runtime-discovered | Read `.median.firstView.userAgent` + WPT UI device label; if emulated, document in §1 Notes column of synthesis doc |
| Synthesis doc narrative quality | VRF-04 | "Real-vs-synthetic divergence story" is human prose, not assertable | Operator reviews §2 narrative for: (a) every Pitfall #10 threshold mapped to actual ratio, (b) escalation path called out where ratio breached |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or are listed as Manual-Only above
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify (confirmed — every task has a `jq` / `grep` / `diff` / `test -f` command)
- [ ] Wave 0 covers all MISSING references (none — Wave 0 is environment-only)
- [ ] No watch-mode flags (confirmed — all assertions are one-shot)
- [ ] Feedback latency < 5s (confirmed for `jq`/`grep`; WPT external queue is bounded by manual gate)
- [ ] `nyquist_compliant: true` set in frontmatter once plans pass plan-checker

**Approval:** pending
