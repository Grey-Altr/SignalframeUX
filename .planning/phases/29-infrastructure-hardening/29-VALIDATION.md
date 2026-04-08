---
phase: 29
slug: infrastructure-hardening
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-07
---

# Phase 29 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.59+ |
| **Config file** | `playwright.config.ts` (root) |
| **Quick run command** | `pnpm exec playwright test tests/phase-29-infra.spec.ts` |
| **Full suite command** | `pnpm exec playwright test` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm exec playwright test tests/phase-29-infra.spec.ts`
- **After every plan wave:** Run `pnpm exec playwright test`
- **Before `/pde:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 29-01-01 | 01 | 1 | PF-04 | smoke/grep | `pnpm exec playwright test tests/phase-29-infra.spec.ts` | ❌ W0 | ⬜ pending |
| 29-01-02 | 01 | 1 | PF-04 | smoke/grep | `pnpm exec playwright test tests/phase-29-infra.spec.ts` | ❌ W0 | ⬜ pending |
| 29-01-03 | 01 | 1 | PF-05 | smoke/grep | `pnpm exec playwright test tests/phase-29-infra.spec.ts` | ❌ W0 | ⬜ pending |
| 29-01-04 | 01 | 1 | PF-04 | smoke | `pnpm exec playwright test tests/phase-29-infra.spec.ts` | ❌ W0 | ⬜ pending |
| 29-02-01 | 02 | 1 | PF-06 | smoke | `pnpm exec playwright test tests/phase-29-infra.spec.ts` | ❌ W0 | ⬜ pending |
| 29-02-02 | 02 | 1 | PF-06 | grep/audit | `pnpm exec playwright test tests/phase-29-infra.spec.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/phase-29-infra.spec.ts` — stubs for PF-04 (overscroll CSS + fonts.ready grep), PF-05 (Observer registration grep), PF-06 (PinnedSection reduced-motion + audit coverage)

*Existing infrastructure covers framework — Playwright is already in devDependencies.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| iOS Safari rubber-band suppressed on pinned sections | PF-04 | Requires physical iOS device (simulator insufficient) | Load site on iPhone Safari → overscroll at top/bottom → confirm no white gap flicker on pinned sections |
| Lenis `ignoreMobileResize` prevents address bar jump | PF-04 | Requires physical iOS device with address bar interaction | Scroll slowly on iPhone → address bar hides → confirm scroll position does not jump |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
