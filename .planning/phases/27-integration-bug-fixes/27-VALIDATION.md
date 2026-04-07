---
phase: 27
slug: integration-bug-fixes
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-07
---

# Phase 27 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.59.1 |
| **Config file** | `playwright.config.ts` |
| **Quick run command** | `pnpm exec playwright test tests/phase-27-integration-bugs.spec.ts` |
| **Full suite command** | `pnpm exec playwright test` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm exec playwright test tests/phase-27-integration-bugs.spec.ts`
- **After every plan wave:** Run `pnpm exec playwright test`
- **Before `/pde:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 27-01-01 | 01 | 0 | IBF-01, IBF-02, IBF-03 | e2e | `pnpm exec playwright test tests/phase-27-integration-bugs.spec.ts` | ❌ W0 | ⬜ pending |
| 27-01-02 | 01 | 1 | IBF-01 | e2e | `pnpm exec playwright test tests/phase-27-integration-bugs.spec.ts --grep "IBF-01"` | ❌ W0 | ⬜ pending |
| 27-01-03 | 01 | 1 | IBF-02 | e2e | `pnpm exec playwright test tests/phase-27-integration-bugs.spec.ts --grep "IBF-02"` | ❌ W0 | ⬜ pending |
| 27-01-04 | 01 | 1 | IBF-03 | e2e | `pnpm exec playwright test tests/phase-27-integration-bugs.spec.ts --grep "IBF-03"` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/phase-27-integration-bugs.spec.ts` — stubs for IBF-01, IBF-02, IBF-03

*Existing `tests/phase-25-detail-view.spec.ts` covers baseline behavior Phase 27 must not regress.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual opacity of suppressed SignalOverlay | IBF-02 | Opacity aesthetic judgment | Open detail panel → verify SignalOverlay toggle appears dimmed (opacity 0.4) |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
