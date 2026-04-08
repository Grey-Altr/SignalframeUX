---
phase: 30
slug: homepage-architecture-entry-section
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-07
---

# Phase 30 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.59.x |
| **Config file** | `playwright.config.ts` |
| **Quick run command** | `pnpm exec playwright test tests/phase-30-homepage.spec.ts --reporter=list` |
| **Full suite command** | `pnpm exec playwright test --reporter=list` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm exec playwright test tests/phase-30-homepage.spec.ts --reporter=list`
- **After every plan wave:** Run `pnpm exec playwright test --reporter=list`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 30-01-01 | 01 | 1 | RA-05 | — | N/A | e2e | `pnpm exec playwright test -g "six section landmarks"` | ❌ W0 | ⬜ pending |
| 30-01-02 | 01 | 1 | VL-03 | — | N/A | e2e | `pnpm exec playwright test -g "CircuitDivider removed"` | ❌ W0 | ⬜ pending |
| 30-01-03 | 01 | 1 | VL-07 | — | N/A | e2e | `pnpm exec playwright test -g "MarqueeBand removed"` | ❌ W0 | ⬜ pending |
| 30-02-01 | 02 | 2 | EN-01 | — | N/A | e2e | `pnpm exec playwright test -g "ENTRY fills 100vh"` | ❌ W0 | ⬜ pending |
| 30-02-02 | 02 | 2 | EN-02 | — | N/A | e2e | `pnpm exec playwright test -g "SIGNALFRAME title"` | ❌ W0 | ⬜ pending |
| 30-02-03 | 02 | 2 | EN-03 | — | N/A | e2e | `pnpm exec playwright test -g "subtitle only"` | ❌ W0 | ⬜ pending |
| 30-02-04 | 02 | 2 | EN-04 | — | N/A | e2e | `pnpm exec playwright test -g "nav invisible on load"` | ❌ W0 | ⬜ pending |
| 30-02-05 | 02 | 2 | EN-05 | — | N/A | manual | See manual verifications | — | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/phase-30-homepage.spec.ts` — stubs for RA-05, EN-01, EN-02, EN-03, EN-04, VL-03, VL-07
- [ ] Existing Playwright infrastructure covers framework — no new install needed

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Mouse-responsive shader variation on ENTRY | EN-05 | Pointer interaction cannot be reliably verified in headless Playwright — shader output is visual | 1. Open localhost:3000 in browser 2. Move mouse across ENTRY section 3. Confirm subtle shader variation 4. Confirm variation is not overwhelming/distracting |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
