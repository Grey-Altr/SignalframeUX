---
phase: 70
slug: v1-8-verification-closure-vrf-01-04-05
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-30
---

# Phase 70 — Validation Strategy

> Per-phase validation contract. Hydrated from `70-RESEARCH.md` § Validation Architecture (lines 499-538).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright `^1.59.1` (e2e/integration seed-runner) + Vitest `^4.1.4` (unit, aggregator) |
| **Config files** | `playwright.config.ts` + `vitest.config.ts` |
| **Quick run command** | `pnpm vitest run scripts/v1.9-rum-aggregate.spec.ts` |
| **Full suite command** | `pnpm vitest run && pnpm playwright test --grep '@v19-phase70'` |
| **Phase-gate command** | `pnpm tsx scripts/v1.9-rum-aggregate.ts --verify` (verification mode that asserts both VRF-06 and VRF-07 verdicts PASS) |
| **Estimated runtime** | ~5s unit / ~60s wave / ~25-65min phase-gate (depends on seed cycle if Hobby tier) |

---

## Sampling Rate

- **After every task commit:** `pnpm vitest run scripts/v1.9-rum-aggregate.spec.ts` (~5s)
- **After every plan wave:** `pnpm vitest run && pnpm playwright test --grep '@v19-phase70'` (~60s)
- **Phase gate:** Full suite green AND `.planning/perf-baselines/v1.9/rum-p75-lcp.json` exists with VRF-06+VRF-07 PASS verdicts AND `vrf-08-path-b-decision.json` exists with valid schema.
- **Max feedback latency:** ~5s for aggregator unit tests; ~60s for full Phase 70 suite

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 70-01-schema | 01 | 1 | VRF-06 | T-RUM-01 (DoS via log flooding — Phase 58 mitigated; aggregator-side schema discipline) | Aggregator output JSON validates against schema (p75/p90/p99/count/window_start/window_end/cohorts/by_metric/vrf_06_overall_verdict/vrf_07_ios_cohort) | unit (Vitest) | `pnpm vitest run scripts/v1.9-rum-aggregate.spec.ts -t schema` | ❌ W0 | ⬜ pending |
| 70-01-no-branch | 01 | 1 | VRF-06 | T-RUM-03 (branch-scope coupling per memory feedback_vercel_logs_branch_scope) | Aggregator passes `--no-branch --deployment <prod-url>` to `vercel logs` invocation; never relies on current-branch implicit scope | unit (Vitest, argv assertion) | `pnpm vitest run scripts/v1.9-rum-aggregate.spec.ts -t no-branch` | ❌ W0 | ⬜ pending |
| 70-01-ua-parser | 01 | 1 | VRF-07 | — | Defensive `uaString()` parser handles both array (Drains) and string (CLI) UA shapes | unit (Vitest) | `pnpm vitest run scripts/v1.9-rum-aggregate.spec.ts -t uaString` | ❌ W0 | ⬜ pending |
| 70-01-ios-regex | 01 | 1 | VRF-07 | — | iOS cohort detection (UA contains `iPhone OS` + Mobile/15E family) returns true for iPhone 14 Pro UAs, false for desktop/Android | unit (Vitest, fixture-driven) | `pnpm vitest run scripts/v1.9-rum-aggregate.spec.ts -t isIosCohort` | ❌ W0 | ⬜ pending |
| 70-02-sessions | 02 | 2 | VRF-06 | — | ≥100 LCP samples captured in window (gate before computing p75) | integration (jq + JSON) | `jq -e '.sample_count_lcp >= 100' .planning/perf-baselines/v1.9/rum-p75-lcp.json` | ✅ tools | ⬜ pending |
| 70-02-p75 | 02 | 2 | VRF-06 | — | p75 LCP < 1000ms in aggregated output | integration | `jq -e '.by_metric.LCP.p75 < 1000' .planning/perf-baselines/v1.9/rum-p75-lcp.json` | ✅ tools | ⬜ pending |
| 70-02-ios-cohort | 02 | 2 | VRF-07 | — | iOS sub-cohort: ≥10 samples + median <2000ms strict 4G LTE Throttled | integration | `jq -e '.vrf_07_ios_cohort.verdict == "PASS"' .planning/perf-baselines/v1.9/rum-p75-lcp.json` | ✅ tools | ⬜ pending |
| 70-03-pathb-schema | 03 | 2 | VRF-08 | T-PATH-01 (decision-block tampering) | `_path_b_decision` block has all 7 fields: decided/audit/original/new/rationale/evidence/review_gate | unit (one-line node check) | `node -e "const d=require('./.planning/perf-baselines/v1.9/vrf-08-path-b-decision.json'); ['decided','audit','original','new','rationale','evidence','review_gate'].forEach(k => { if (!d[k]) throw new Error('missing: '+k); });"` | ❌ W0 | ⬜ pending |
| 70-03-phase67-xref | 03 | 2 | VRF-08 | — | review_gate references Phase 67 cross-link (BND-05 chunk reshape will revisit 3G Fast tier) | unit (jq) | `jq -e '.review_gate \| test("Phase 67")' .planning/perf-baselines/v1.9/vrf-08-path-b-decision.json` | ✅ tools | ⬜ pending |
| 70-04-validated | 04 | 3 | VRF-06,VRF-07,VRF-08 | — | REQUIREMENTS.md marks VRF-06/07/08 Validated; v1.8 VRF-01/04/05 carry-forward closure recorded | structural (grep) | `grep -E '\| VRF-0[678] \|.*Validated' .planning/REQUIREMENTS.md \| wc -l` ≥ 3 | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `scripts/v1.9-rum-aggregate.ts` — extends v1.8 aggregator with `--no-branch`, `--deployment <url>`, defensive `uaString()` parser, iOS cohort partition, output to `.planning/perf-baselines/v1.9/rum-p75-lcp.json`
- [ ] `scripts/v1.9-rum-aggregate.spec.ts` — Vitest unit tests covering schema, --no-branch, uaString, isIosCohort
- [ ] `tests/fixtures/v1.9-rum-log-line.jsonl` — sample log lines (iPhone/Android/desktop UAs) for unit tests
- [ ] `.planning/perf-baselines/v1.9/` directory created on first Plan 02 write
- [x] **No new framework install** — Vitest + Playwright + tsx already in devDeps; native `fetch` (Node 24) avoids node-fetch dep
- [x] **Vercel CLI 50.43.0 already installed** (verified Phase 58 + Phase 60 + Phase 64 use it); `vercel login` is a precondition documented in Plan 02 task

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| User-discretion check on Vercel tier (Hobby 1h vs Pro 1d retention) for VRF-06 sampling-window strategy | VRF-06 | Tier upgrade is a $20/mo financial decision out of autonomous scope | Plan 02 task asks: stay on Hobby (seed-and-aggregate within 1h) OR upgrade to Pro (real 24h+ natural sampling). Default: Hobby seed cycle if user doesn't override. |
| Sample-source verdict labeling (synthetic-seeded vs mixed vs natural) | VRF-06 | Cycle outcome depends on real prod traffic during 1h window — can't predict at plan time | Plan 02 task records `sample_source: "synthetic-seeded"` if no natural traffic in window, `"mixed"` if some natural, `"natural"` if ≥100 sessions are organic. User reviews verdict label and confirms acceptable for v1.8 VRF-05 closure. |
| iPhone 14 Pro real-traffic n verdict (PASS/INSUFFICIENT_SAMPLES) for VRF-07 | VRF-07 | Portfolio-tier audience may not produce ≥10 iOS sessions in 1h window | Plan 02 reports actual iOS cohort count; `INSUFFICIENT_SAMPLES` is a valid verdict that defers VRF-07 to next-deploy RUM accumulation rather than blocking phase close. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (4 new files: aggregator script + spec + fixture + perf-baselines/v1.9/ dir)
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
