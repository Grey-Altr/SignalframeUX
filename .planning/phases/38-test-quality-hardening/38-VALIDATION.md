---
phase: 38
slug: test-quality-hardening
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-10
---

# Phase 38 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.x (unit) + Playwright 1.59 (E2E/a11y/reduced-motion) |
| **Config file** | `vitest.config.ts` (Wave 0 installs) + `playwright.config.ts` (existing) |
| **Quick run command** | `pnpm test` |
| **Full suite command** | `pnpm test && pnpm exec playwright test` |
| **Estimated runtime** | ~30 seconds (unit) + ~60 seconds (E2E) |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test`
- **After every plan wave:** Run `pnpm test && pnpm exec playwright test`
- **Before `/pde:verify-work`:** Full suite must be green
- **Max feedback latency:** 90 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 38-01-01 | 01 | 1 | QA-01 | unit | `pnpm test` | ❌ W0 | ⬜ pending |
| 38-01-02 | 01 | 1 | QA-01 | unit | `pnpm test` | ❌ W0 | ⬜ pending |
| 38-02-01 | 02 | 1 | QA-02 | E2E | `pnpm exec playwright test tests/phase-38-a11y.spec.ts` | ❌ W0 | ⬜ pending |
| 38-02-02 | 02 | 1 | QA-02 | E2E | `pnpm exec playwright test tests/phase-38-reduced-motion.spec.ts` | ❌ W0 | ⬜ pending |
| 38-03-01 | 03 | 2 | QA-03 | manual | Verify blocked commit fails visibly | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` — Vitest configuration with jsdom, v8 coverage, path aliases
- [ ] `tsconfig.test.json` — Extends base tsconfig, adds vitest/globals types
- [ ] `pnpm add -D vitest @vitest/coverage-v8 jsdom @axe-core/playwright husky lint-staged` — Install all dependencies

*Wave 0 creates the test infrastructure that subsequent tasks depend on.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Pre-commit hook blocks bad commits | QA-03 | Requires interactive git commit attempt | 1. Introduce a lint error 2. `git add . && git commit -m "test"` 3. Verify commit is blocked with visible error |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 90s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
