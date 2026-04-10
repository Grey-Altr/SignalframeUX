---
phase: 36
slug: housekeeping-carry-overs
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-10
---

# Phase 36 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.59.1 (E2E) + Lighthouse 13.1.0 (audit) |
| **Config file** | `playwright.config.ts` / `scripts/launch-gate.ts` |
| **Quick run command** | `pnpm exec playwright test tests/phase-35-reference.spec.ts` |
| **Full suite command** | `pnpm exec playwright test` |
| **Estimated runtime** | ~120 seconds |

---

## Sampling Rate

- **After every task commit:** Run relevant test file
- **After every plan wave:** Run `pnpm exec playwright test`
- **Before `/pde:verify-work`:** Full suite must be green + `pnpm lint` clean
- **Max feedback latency:** 120 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 36-01-01 | 01 | 1 | CO-01 | lighthouse | `npx tsx scripts/launch-gate.ts` | ✅ | ⬜ pending |
| 36-01-02 | 01 | 1 | CO-01 | lighthouse | `npx tsx scripts/launch-gate.ts` | ✅ | ⬜ pending |
| 36-02-01 | 02 | 1 | CO-02 | e2e | `pnpm exec playwright test tests/phase-35-reference.spec.ts` | ✅ | ⬜ pending |
| 36-02-02 | 02 | 1 | CO-02 | tsc | `pnpm exec tsc --noEmit` | ✅ | ⬜ pending |
| 36-03-01 | 03 | 1 | CO-03 | lint | `pnpm lint` | ❌ W0 | ⬜ pending |
| 36-03-02 | 03 | 1 | CO-03 | lint | `pnpm lint` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `eslint.config.js` — ESLint flat config file (does not exist yet)
- [ ] `package.json` lint script — `"lint": "eslint ."` (does not exist yet)

*Existing infrastructure covers Lighthouse and Playwright requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| ROADMAP.md stale entries | CO-04 | Visual diff review | `git diff .planning/ROADMAP.md` — verify Phase 31/35 checkboxes corrected |
| Vercel CLI version | CO-04 | Already resolved | `vercel --version` confirms 50.43.0 |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 120s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
