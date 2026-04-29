---
phase: 60
slug: lcp-element-repositioning
status: approved
nyquist_compliant: true
wave_0_complete: false
created: 2026-04-26
approved: 2026-04-26
---

# Phase 60 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Authoritative source: `.planning/phases/60-lcp-element-repositioning/60-RESEARCH.md` §Validation Architecture.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.59.x (existing — no install) |
| **Config file** | `playwright.config.ts` |
| **Quick run command** | `npx playwright test tests/v1.8-lcp-candidates.spec.ts --reporter=line` |
| **Full suite command** | `pnpm test:e2e` (Playwright full) + `pnpm exec lhci autorun --config=.lighthouseci/lighthouserc.json` (LHCI median-of-5; no `lhci:autorun` script defined in `package.json`) |
| **Estimated runtime** | ~30s quick · ~6 min full (LHCI dominates) |

---

## Sampling Rate

- **After every task commit:** Run `npx playwright test {affected spec} --reporter=line`
- **After every plan wave:** Run `pnpm test:e2e` (full Playwright suite)
- **Before `/pde:verify-work`:** Full suite + LHCI median-of-5 must be green; pixel-diff <0.5%
- **Max feedback latency:** 60s for spec-level checks; 6 min for LHCI gate

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 60-01-01 | 01 | 1 | LCP-03 | — | N/A (perf measurement, no auth/data surface) | e2e | `npx playwright test tests/v1.8-lcp-candidates.spec.ts` | ❌ W0 | ⬜ pending |
| 60-01-02 | 01 | 1 | LCP-03 | — | N/A | unit | `node -e "JSON.parse(require('fs').readFileSync('.planning/codebase/v1.8-lcp-candidates.json'))"` | ❌ W0 | ⬜ pending |
| 60-01-03 | 01 | 1 | LCP-03 | — | N/A | grep | `grep -q '"viewport":' .planning/codebase/v1.8-lcp-candidates.json && grep -q '"candidates":' .planning/codebase/v1.8-lcp-candidates.json` | ❌ W0 | ⬜ pending |
| 60-02-01 | 02 | 0 | LCP-02, LCP-03 | — | N/A | grep | `grep -q "containIntrinsicSize" components/animation/ghost-label.tsx` | ✅ | ⬜ pending |
| 60-02-02 | 02 | 1 | LCP-01, LCP-02 | — | N/A | grep | `grep -qE "content-visibility:\s*auto" components/animation/ghost-label.tsx` | ✅ | ⬜ pending |
| 60-02-03 | 02 | 1 | AES-01, AES-04 | — | N/A | e2e | `npx playwright test tests/v1.8-baseline-capture.spec.ts` (no `--update-snapshots`) | ✅ | ⬜ pending |
| 60-02-04 | 02 | 2 | LCP-01 | — | N/A | LHCI | `pnpm exec lhci autorun --config=.lighthouseci/lighthouserc.json` (assert median LCP <1.0s mobile per rc.json `numberOfRuns:5` + `largest-contentful-paint <=1000ms`) | ✅ | ⬜ pending |
| 60-02-05 | 02 | 2 | LCP-01, AES-04 | — | N/A | grep | `grep -q "lcp_ms" .planning/perf-baselines/v1.8/phase-60-mobile-lhci.json` | ❌ W0 | ⬜ pending |
| 60-02-06 | 02 | 3 | VRF-04 | — | N/A | manual | WebPageTest iPhone 13 Safari LTE median-of-5; result file `.planning/perf-baselines/v1.8/phase-60-realdevice-checkpoint.md` | ❌ W0 | ⬜ pending |
| 60-02-07 | 02 | 3 | AES-01, AES-03 | — | N/A | manual | chrome-devtools MCP scroll-test all 4 viewports × 5 pages; sign-off in `.planning/phases/60-lcp-element-repositioning/60-AES03-COHORT.md` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

**Sampling continuity check:** longest gap between automated checks = 1 task (60-02-06 manual is bookended by 60-02-05 grep and 60-02-07 manual; 60-02-04 automated LHCI gates the wave).

---

## Wave 0 Requirements

- [ ] `tests/v1.8-lcp-candidates.spec.ts` — Plan 01 LCP candidate enumeration spec (extends `tests/v1.8-lcp-diagnosis.spec.ts` PerformanceObserver pattern)
- [ ] `.planning/codebase/v1.8-lcp-candidates.json` — Plan 01 emitted artifact (JSON shape mirrors `v1.8-lcp-evidence.json`)
- [ ] `.planning/perf-baselines/v1.8/phase-60-mobile-lhci.json` — Plan 02 wave-2 LHCI median snapshot
- [ ] `.planning/perf-baselines/v1.8/phase-60-realdevice-checkpoint.md` — Plan 02 D-07 WebPageTest result note
- [ ] `.planning/phases/60-lcp-element-repositioning/60-AES03-COHORT.md` — D-08 cohort review sign-off note

*Existing infrastructure (Playwright, LHCI, axe-core, bundle-analyzer) covers framework requirements. No installs required.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Real-device LCP <1.5s on iPhone 13 Safari LTE | VRF-04, LCP-01 | WebPageTest free tier requires browser-driven submission; SwiftShader headless WebGL caveat (`playwright.config.ts:22-27`) means LHCI alone cannot certify real-device behavior | Open `https://www.webpagetest.org/`; configure iPhone 13 + Verizon LTE; submit prod homepage URL; run 5x; record median LCP in `phase-60-realdevice-checkpoint.md` |
| AES-03 cohort review fresh-eyes pass | AES-01, AES-03 | Per D-08 + `feedback_visual_verification.md` — chrome-devtools MCP scroll-test is the visual gate, not Playwright pixel-diff alone | Next-morning fresh-eyes pass: chrome-devtools MCP scroll-test prod URL × 4 viewports × 5 pages, side-by-side with `.planning/visual-baselines/v1.8-start/` baselines; sign-off note in `60-AES03-COHORT.md` |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies (manual-only items justified above)
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references (5 artifacts to be created)
- [x] No watch-mode flags
- [x] Feedback latency <60s for spec checks, <6 min for LHCI gate
- [x] `nyquist_compliant: true` set in frontmatter (planner emitted task IDs `60-01-01..03` and `60-02-01..07` matching this map verbatim; pde-plan-checker confirmed PASS on Nyquist Dimension 8)

**Approval:** approved 2026-04-26 — pde-plan-checker found 0 BLOCKERS, 4 WARNINGS (all surgical, fixed in-place via PF-04 grep addition + P02-06 positive-path proof + LHCI command corrections), 3 INFO. Plans cleared for `/pde:execute-phase 60`.
