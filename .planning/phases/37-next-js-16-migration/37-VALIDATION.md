---
phase: 37
slug: next-js-16-migration
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-10
---

# Phase 37 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.59.1 |
| **Config file** | `playwright.config.ts` |
| **Quick run command** | `pnpm build && pnpm exec playwright test tests/phase-35-bundle-gate.spec.ts -x` |
| **Full suite command** | `pnpm build && pnpm exec playwright test` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm build && pnpm exec playwright test tests/phase-35-bundle-gate.spec.ts -x`
- **After every plan wave:** Run `pnpm build && pnpm exec playwright test`
- **Before `/pde:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 37-01-01 | 01 | 1 | MG-01 | smoke | `pnpm build` exits 0 | ✅ | ⬜ pending |
| 37-01-02 | 01 | 1 | MG-01 | smoke | `pnpm exec playwright test tests/phase-35-homepage.spec.ts -x` | ✅ | ⬜ pending |
| 37-01-03 | 01 | 1 | MG-02 | e2e | `pnpm exec playwright test` | ✅ | ⬜ pending |
| 37-01-04 | 01 | 1 | MG-03 | automated | `pnpm exec playwright test tests/phase-35-bundle-gate.spec.ts` | ✅ | ⬜ pending |
| 37-01-05 | 01 | 1 | MG-03 | manual/script | `pnpm tsx scripts/launch-gate.mjs` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No new test files needed for this migration phase — regression verification uses the existing 18-test Playwright suite plus the launch-gate Lighthouse script.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Lighthouse 100/100 all categories | MG-03 | Lighthouse requires browser + live server | Run `pnpm tsx scripts/launch-gate.mjs` against `pnpm start` |
| Turbopack dev mode functional | MG-01 | Dev mode requires interactive server | Run `pnpm dev`, verify pages render without errors |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
