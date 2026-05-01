---
phase: 67
slug: bundle-barrel-optimization-d-04-unlock
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-30
---

# Phase 67 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright (project canonical e2e + bundle-gate harness) |
| **Config file** | `playwright.config.ts` |
| **Quick run command** | `pnpm exec playwright test ./tests/v1.8-phase63-1-bundle-budget.spec.ts --reporter=list` |
| **Full suite command** | `rm -rf .next/cache .next && ANALYZE=true pnpm build && pnpm exec playwright test ./tests/v1.8-phase63-1-bundle-budget.spec.ts ./tests/v1.9-phase67-bundle-reshape.spec.ts ./tests/v1.9-phase67-aes04.spec.ts --reporter=list` |
| **Estimated runtime** | Quick: ~5s (manifest read only) · Full: ~3 min (build 60-90s + AES-04 24 captures × 1.5s + bundle-budget assertion) |

Build measurement protocol per BND-04 standing rule (D-10): every gating measurement is prefixed with `rm -rf .next/cache .next && ANALYZE=true pnpm build`. NO measurements against Turbopack dev build (`pnpm dev`) — webpack production only.

---

## Sampling Rate

- **After every task commit:** Run `pnpm exec playwright test ./tests/v1.8-phase63-1-bundle-budget.spec.ts` (no rebuild required if task did not touch source — manifest stays valid; rebuild required after any next.config.ts / app/layout.tsx / components/sf/** change)
- **After every reshape vector commit (D-08):** `rm -rf .next/cache .next && ANALYZE=true pnpm build && pnpm exec playwright test ./tests/v1.9-phase67-aes04.spec.ts` (per-major-reshape-commit AES-04)
- **After every plan wave:** Full suite command above
- **Before `/pde:verify-work`:** Full suite must be green
- **Max feedback latency:** ~3 min (full suite); ~5s (quick gate)

---

## Per-Task Verification Map

_Populated by planner. Each task in PLAN.md must reference a row here. Status updated by executor._

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| {populated by planner} | {01/02} | {wave} | BND-05/06/07/AES-04 | T-67-01 (low) | N/A — bundle reshape, no auth/data/network surface | bundle-budget / pixel-diff / doc | `{command}` | ✅ existing / ❌ W0 | ⬜ pending |

---

## Wave 0 Requirements

- [ ] `tests/v1.9-phase67-bundle-reshape.spec.ts` — chunk inventory snapshot capture (Plan 01 close artifact; non-asserting, evidence-only OR retired in favor of `v1.9-bundle-reshape.md` doc per D-05)
- [ ] `tests/v1.9-phase67-aes04.spec.ts` — pixel-diff harness mirroring `tests/v1.8-phase61-bundle-hygiene.spec.ts` template; covers D-09 routes (`/`, `/init`, `/inventory`, `/system`) × mobile + tablet + desktop = 12 page captures × 2 (baseline + actual) = 24 image operations
- [ ] No new framework install — Playwright already present per `playwright.config.ts`

Spec files above are NEW Wave 0 artifacts. The existing `tests/v1.8-phase63-1-bundle-budget.spec.ts` is MUTATED in Plan 02 (not Wave 0).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| `v1.9-bundle-reshape.md` chunk-ID table accurately reflects post-reshape `.next/analyze/client.html` | BND-05, BND-07 | Doc-gate (D-04, D-05); accuracy of chunk-id documentation cannot be programmatically verified without re-introducing the `chunk-id-equality` test that D-05 explicitly forbids | After Plan 01 commit: open `.next/analyze/client.html` in browser, hover top 5 chunks; cross-check filenames + top-package attribution against `v1.9-bundle-reshape.md` §2a table |
| `next.config.ts` D-04 lock comment rewritten to reflect Phase 67 unlock + new lock state | BND-05 | Comment content is prose, not assertable | Read `next.config.ts:14-22` after Plan 01: comment must reference Phase 67 unlock + name new stable chunk IDs from reshape |
| `_path_k_decision` block retired or replaced per D-06 outcome ladder | BND-07 | Decision block content is prose; outcome depends on measured bundle size | Read `tests/v1.8-phase63-1-bundle-budget.spec.ts` header after Plan 02: if ≤200 KB → no `_path_k`/`_path_q` block; if 201-220 KB → `_path_q_decision` block present with new threshold; if >220 KB → STOP, escalate (Plan 02 should not have shipped) |

---

## Threat Model Summary

Bundle reshape phase has no auth, data, network, input-handling, or trust-boundary changes. ASVS L1 minimum threat model:

- **T-67-01** (LOW) — Stale-chunk false-pass: a `.next/cache` carryover from a previous build could surface old chunks in measurement, producing a false-pass on BND-06 while the actual production build would fail. **Mitigation:** D-10 standing rule (`rm -rf .next/cache .next` before every gating measurement). Already encoded in Sampling Rate above.

No new attack surface, no new authentication paths, no new external IO, no new user-supplied input parsing. Threat model formally OUT OF SCOPE beyond T-67-01 measurement-integrity threat.

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (`tests/v1.9-phase67-aes04.spec.ts` and chunk-snapshot if planner elects)
- [ ] No watch-mode flags (Playwright run is single-shot CI mode)
- [ ] Feedback latency < 200s (full suite ~3 min upper bound — within tolerance)
- [ ] `nyquist_compliant: true` set in frontmatter (after planner populates Per-Task Verification Map)

**Approval:** pending (planner to update after Plan 01 + Plan 02 task IDs assigned)
