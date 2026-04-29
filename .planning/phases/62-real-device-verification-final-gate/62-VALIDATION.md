---
phase: 62
slug: real-device-verification-final-gate
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-27
---

# Phase 62 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Source-of-truth: `.planning/phases/62-real-device-verification-final-gate/62-RESEARCH.md` §Validation Architecture (lines 840–893).
> Phase 62 is **read-only verification + ratification**. Most "tasks" produce JSON/MD artifacts, not code; validation is per-VRF artifact existence + JSON schema/threshold checks + AES-04 pixel-diff re-run.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework (pixel-diff)** | Playwright `@playwright/test` (devDep, existing) — `tests/v1.8-phase58-pixel-diff.spec.ts` |
| **Framework (gates)** | `jq` + `grep` + `node` JSON schema check (no new framework) |
| **Config file** | `playwright.config.ts` (existing); pixel-diff spec `MAX_DIFF_RATIO = 0.005` (verified line 34) |
| **Quick run command** | `CI=true pnpm exec playwright test tests/v1.8-phase58-pixel-diff.spec.ts --project=chromium --reporter=json` |
| **Full suite command** | (Phase 62 has no monolithic suite — each VRF has its own gate; `62-FINAL-GATE.md` aggregates) |
| **Estimated runtime** | Pixel-diff ~120s; per-VRF jq checks <2s; aggregate phase gate <5min |

---

## Sampling Rate

- **After every task commit:** Run the task's specific gate command (e.g., Plan 01 task 1 commit → `jq` validate just-written `vrf-01-ios-iphone13.json`).
- **After every plan wave:** Run all task gates for the wave + grep `WARN/FAIL` in any artifact.
- **Before `/pde:verify-work`:** `62-FINAL-GATE.md` synthesis must show all 5 VRFs PASS + AES-04 PASS + Phase 60 SUMMARY ratified + Phase 58 HUMAN-UAT cross-check surfaced (not blocking).
- **Max feedback latency:** ~120s (Playwright pixel-diff); jq/grep checks are sub-second.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 62-01-W0a | 01 | 0 | VRF-01 | — | WPT API key + location slug snapshot present | unit (file existence) | `test -f .planning/perf-baselines/v1.8/vrf-01-locations-snapshot.json` | ❌ Plan 01 W0 | ⬜ pending |
| 62-01-W1a | 01 | 1 | VRF-01 | — | iPhone 13 JSON committed, LCP <1000ms, CLS ≤0.005, 5-run median present | unit (jq schema + threshold) | `jq -e '.median.firstView.LCP < 1000 and .median.firstView.CLS <= 0.005' .planning/perf-baselines/v1.8/vrf-01-ios-iphone13.json` | ❌ Plan 01 | ⬜ pending |
| 62-01-W1b | 01 | 1 | VRF-01 | — | Galaxy A14 JSON committed, LCP <1000ms, CLS ≤0.005 | unit (jq schema + threshold) | `jq -e '.median.firstView.LCP < 1000 and .median.firstView.CLS <= 0.005' .planning/perf-baselines/v1.8/vrf-01-android-a14.json` | ❌ Plan 01 | ⬜ pending |
| 62-01-W1c | 01 | 1 | VRF-01 | — | Mid-tier Android JSON committed, LCP <1000ms, CLS ≤0.005 | unit (jq schema + threshold) | `jq -e '.median.firstView.LCP < 1000 and .median.firstView.CLS <= 0.005' .planning/perf-baselines/v1.8/vrf-01-android-midtier.json` | ❌ Plan 01 | ⬜ pending |
| 62-01-W2a | 01 | 2 | VRF-04 | — | MID-MILESTONE-CHECKPOINT.md exists, contains PASS sign-off, divergence threshold table | grep evidence | `grep -E '\\*\\*PASS\\*\\*' .planning/perf-baselines/v1.8/MID-MILESTONE-CHECKPOINT.md && grep -c 'divergence' .planning/perf-baselines/v1.8/MID-MILESTONE-CHECKPOINT.md \| awk '{exit ($1 < 1)}'` | ❌ Plan 01 | ⬜ pending |
| 62-02-W0a | 02 | 0 | VRF-02 | — | `scripts/launch-gate-vrf02.ts` wrapper exists; `scripts/launch-gate.ts` byte-identical to merge-base | unit (file + git diff) | `test -f scripts/launch-gate-vrf02.ts && [ -z "$(git diff --name-only HEAD scripts/launch-gate.ts)" ]` | ❌ Plan 02 W0 | ⬜ pending |
| 62-02-W1a | 02 | 1 | VRF-02 | — | 5-run median JSON committed, verdict=PASS, LCP <1000ms, CLS=0, TTI <1500ms, all 4 categories=100 | unit (jq schema + threshold) | `jq -e '.verdict == "PASS" and .median.LCP < 1000 and .median.CLS == 0 and .median.TTI < 1500 and (.median.scores \| to_entries \| map(.value) \| min) == 100' .planning/perf-baselines/v1.8/vrf-02-launch-gate-runs.json` | ❌ Plan 02 | ⬜ pending |
| 62-02-W2a | 02 | 2 | VRF-03 | — | Motion contract MD checklist exists, ≥6 PASS lines (per SIGNAL surface), single-ticker assertion green, reduced-motion collapse confirmed | grep evidence | `grep -cE 'PASS\|✓' .planning/perf-baselines/v1.8/vrf-03-motion-contract.md \| awk '{exit ($1 < 6)}' && grep -q 'single-GSAP-ticker.*PASS' .planning/perf-baselines/v1.8/vrf-03-motion-contract.md && grep -q 'prefers-reduced-motion.*PASS' .planning/perf-baselines/v1.8/vrf-03-motion-contract.md` | ❌ Plan 02 | ⬜ pending |
| 62-03-W0a | 03 | 0 | VRF-05 | — | `scripts/v1.8-rum-aggregate.ts` exists; Vercel plan tier verified; `.planning/milestones/v1.8/` ready to create | unit (file + CLI) | `test -f scripts/v1.8-rum-aggregate.ts && vercel inspect 2>&1 \| grep -E 'Plan' \| head -1` | ❌ Plan 03 W0 | ⬜ pending |
| 62-03-W1a | 03 | 1 | VRF-05 | — | RUM JSON committed, verdict=PASS, sample_count ≥100, p75 LCP <1000ms | unit (jq schema + threshold) | `jq -e '.verdict == "PASS" and .sample_count >= 100 and .by_metric.LCP.p75 < 1000' .planning/perf-baselines/v1.8/vrf-05-rum-p75-lcp.json` | ❌ Plan 03 | ⬜ pending |
| 62-03-W2a | 03 | 2 | AES-04 | — | Pixel-diff 20 surfaces ≤0.5%, exit code 0 | e2e (Playwright spec) | `CI=true pnpm exec playwright test tests/v1.8-phase58-pixel-diff.spec.ts --project=chromium --reporter=json > .planning/perf-baselines/v1.8/vrf-aes04-final.json && jq -e '.suites[].specs[] \| select(.tests[].results[].status == "passed")' .planning/perf-baselines/v1.8/vrf-aes04-final.json` | ✅ Spec exists | ⬜ pending |
| 62-03-W2b | 03 | 2 | (D-09) | — | Phase 60 SUMMARY ratification: 60-01-SUMMARY.md and 60-02-SUMMARY.md spot-checked; STATE.md Phase 60 row updated | grep evidence | `grep -E 'Phase 60.*\\bcomplete\\b' .planning/STATE.md && test -f .planning/phases/60-lcp-element-repositioning/60-01-SUMMARY.md` | ✅ exists | ⬜ pending |
| 62-03-W2c | 03 | 2 | (D-10) | — | Phase 58 HUMAN-UAT items surfaced read-only in 62-FINAL-GATE.md "deferred to user" block | grep evidence | `grep -A 20 'deferred to user\|Phase 58 HUMAN-UAT' .planning/phases/62-real-device-verification-final-gate/62-FINAL-GATE.md \| grep -cE 'branch protection\|LHCI' \| awk '{exit ($1 < 2)}'` | ❌ Plan 03 | ⬜ pending |
| 62-03-W3a | 03 | 3 | (D-12) | — | Final-gate artifact set complete: 62-FINAL-GATE.md + 62-VERIFICATION.md + .planning/milestones/v1.8/MILESTONE-SUMMARY.md | unit (file existence) | `test -f .planning/phases/62-real-device-verification-final-gate/62-FINAL-GATE.md && test -f .planning/phases/62-real-device-verification-final-gate/62-VERIFICATION.md && test -f .planning/milestones/v1.8/MILESTONE-SUMMARY.md` | ❌ Plan 03 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

### Plan 01 (VRF-01 + VRF-04)

- [ ] `~/.wpt-api-key` exists OR user provides API key (Plan 01 wave 0 prompts user; manual web-form fallback documented in RESEARCH.md §1).
- [ ] `vrf-01-locations-snapshot.json` captured from `https://www.webpagetest.org/getLocations.php?f=json` (free-tier slugs available on measurement day).
- [ ] Prod URL confirmed via `vercel inspect` (default per `scripts/launch-gate.ts:10` is `signalframeux.vercel.app`).

### Plan 02 (VRF-02 + VRF-03)

- [ ] `scripts/launch-gate-vrf02.ts` wrapper created (Plan 02 wave 0 — 5-run median runner).
- [ ] CIB-04 byte-identity guard: `git diff --name-only HEAD scripts/launch-gate.ts` returns empty (Plan 02 must NOT modify `launch-gate.ts`).
- [ ] chrome-devtools MCP tool surface verified by calling actual tools in wave 0 (tool names may have shifted in recent MCP plugin versions per RESEARCH.md §3).

### Plan 03 (VRF-05 + AES-04 + ratification + close-out)

- [ ] `scripts/v1.8-rum-aggregate.ts` created (Plan 03 wave 0 — devDep tooling, no new runtime dep).
- [ ] Vercel plan tier verified (`vercel teams ls` + `vercel inspect`); Hobby tier requires log-stitching every ~50 min.
- [ ] `.planning/milestones/v1.8/` directory created (does not exist as of 2026-04-27 — plan 03 final commit creates).
- [ ] AES-04 baseline dir confirmed at `.planning/visual-baselines/v1.8-start/` (verified 2026-04-27; 20 PNGs present).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| WPT submission may require user API key entry | VRF-01 | Free-tier programmatic API requires `X-WPT-API-KEY` header (RESEARCH.md §1 Open Question 1) — no auto-provision path | Plan 01 wave 0 prompts user; user pastes key at `~/.wpt-api-key` or env var; manual web-form fallback otherwise |
| chrome-devtools MCP scroll-test execution | VRF-03 | MCP tool calls are interactive; cannot be fully automated via shell | Plan 02 wave 2 invokes MCP tools (navigate_page → take_snapshot → emulate → performance_start_trace → scroll → stop_trace → list_console_messages); evidence captured in `vrf-03-motion-contract.md` |
| Phase 58 GitHub repo-settings (branch protection + LHCI required check) | (carry-over D-10) | User-only repo-admin action per `feedback_pde_milestone_complete_help_arg.md` discipline | Plan 03 surfaces these in 62-FINAL-GATE.md "deferred to user" block; does NOT auto-attempt |
| 24h RUM sampling window | VRF-05 | Real-time wait — cannot be skipped | Plan 03 wave 1 starts after Plan 02 prod deploy; aggregator runs after window expires; user manually restarts plan 03 wave 1 if interrupted |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (WPT API key, vercel plan tier, milestone dir, chrome-devtools MCP tool surface)
- [ ] No watch-mode flags (`CI=true` set on all Playwright runs)
- [ ] Feedback latency <120s for any single task gate
- [ ] `nyquist_compliant: true` set in frontmatter after Wave 0 completion

**Approval:** pending
