---
phase: 31
slug: thesis-section
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-08
---

# Phase 31 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.59.x (existing — no install needed) |
| **Config file** | `playwright.config.ts` |
| **Quick run command** | `pnpm exec playwright test tests/phase-31-thesis.spec.ts --reporter=list` |
| **Full suite command** | `pnpm exec playwright test --reporter=list` |
| **Estimated runtime** | ~20 seconds (scroll sequences are slower than static checks) |

---

## Sampling Rate

- **After every task commit:** Run `pnpm exec playwright test tests/phase-31-thesis.spec.ts --reporter=list`
- **After every plan wave:** Run `pnpm exec playwright test --reporter=list`
- **Before `/pde:verify-work`:** Full suite must be green AND physical iPhone Safari verification gate cleared (D-34)
- **Max feedback latency:** 25 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 31-01-01 | 01 | 1 | TH-05 | content draft | n/a (creative review) | ❌ W0 | ⬜ pending |
| 31-01-02 | 01 | 1 | TH-05 | content commit | `test -f lib/thesis-manifesto.ts` | ❌ W0 | ⬜ pending |
| 31-01-03 | 01 | 1 | TH-05 | unit/grep | `pnpm exec playwright test -g "TH-05"` | ❌ W0 | ⬜ pending |
| 31-02-01 | 02 | 2 | TH-01, TH-02 | impl | `pnpm exec playwright test -g "TH-01"` | ❌ W0 | ⬜ pending |
| 31-02-02 | 02 | 2 | TH-02, TH-03 | impl | `pnpm exec playwright test -g "TH-02"` | ❌ W0 | ⬜ pending |
| 31-02-03 | 02 | 2 | TH-03, TH-04 | impl | `pnpm exec playwright test -g "TH-03"` | ❌ W0 | ⬜ pending |
| 31-02-04 | 02 | 2 | TH-04 | impl | `pnpm exec playwright test -g "TH-04"` | ❌ W0 | ⬜ pending |
| 31-02-05 | 02 | 2 | TH-06 | impl | `pnpm exec playwright test -g "TH-06"` | ❌ W0 | ⬜ pending |
| 31-02-06 | 02 | 2 | TH-01..06 | integration | `pnpm exec playwright test tests/phase-31-thesis.spec.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

*Task IDs above are placeholders; planner will reconcile with final task numbering.*

---

## Wave 0 Requirements

- [ ] `tests/phase-31-thesis.spec.ts` — 6 automated test cases (TH-01 through TH-06)
- [ ] `lib/thesis-manifesto.ts` — typed array constant of manifesto statements (data dependency for all tests)
- [ ] No framework install — Playwright 1.59.x already configured in `playwright.config.ts`

*Existing infrastructure covers all phase requirements with the addition of one spec file and one data file.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| iOS Safari address bar does not cause pin offset jump | TH-01, TH-02 | iOS chrome physics not replicable in Playwright/simulators (per STATE.md v1.5 critical constraint and PITFALLS.md Pitfall 1) | On a physical iPhone (14/15) in portrait Safari: navigate to homepage, scroll into THESIS, scroll through full pin window twice, confirm no scroll-position snap or pin-spacer mis-measurement |
| Manifesto copy reads as declarative statements (TH-05 register) | TH-05 | Tone/register is creative judgment | User reviews `lib/thesis-manifesto.ts` draft from Plan 01 before approving Wave 2 engineering |
| Anchor statement asymmetric positioning reads as DU/TDR off-grid (CONTEXT D-06) | TH-02 | Visual aesthetic judgment | User reviews running THESIS section in browser at 1440px and 375px viewports |
| Reduced-motion fallback reads as a coherent specimen (D-29) | TH-06 | Layout aesthetic judgment | OS-level reduced-motion enabled → page reload → THESIS readable as a stacked specimen with all statements visible without scroll-driven animation |

---

## Validation Sign-Off

- [ ] All tasks have automated verification or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (`tests/phase-31-thesis.spec.ts`, `lib/thesis-manifesto.ts`)
- [ ] No watch-mode flags in commands
- [ ] Feedback latency <25s
- [ ] Physical iOS Safari gate cleared before `/pde:verify-work` (D-34)
- [ ] `nyquist_compliant: true` set in frontmatter after planner finalizes task IDs

**Approval:** pending
