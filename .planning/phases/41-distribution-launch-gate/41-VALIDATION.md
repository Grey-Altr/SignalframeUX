---
phase: 41
slug: distribution-launch-gate
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-10
---

# Phase 41 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest + Playwright |
| **Config file** | vitest.config.ts, playwright.config.ts |
| **Quick run command** | `pnpm test` |
| **Full suite command** | `pnpm test && npx playwright test` |
| **Estimated runtime** | ~45 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test`
- **After every plan wave:** Run `pnpm test && npx playwright test`
- **Before `/pde:verify-work`:** Full suite must be green
- **Max feedback latency:** 45 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 41-01-01 | 01 | 1 | DIST-01 | script | `npm pack --dry-run 2>&1` | ❌ W0 | ⬜ pending |
| 41-01-02 | 01 | 1 | DIST-03 | file | `test -f CHANGELOG.md` | ❌ W0 | ⬜ pending |
| 41-01-03 | 01 | 1 | DIST-01 | file | `test -f LICENSE` | ❌ W0 | ⬜ pending |
| 41-02-01 | 02 | 2 | DIST-02 | script | `tsx scripts/consumer-test.ts` | ❌ W0 | ⬜ pending |
| 41-02-02 | 02 | 2 | DIST-01 | script | `tsx scripts/verify-bundle-size.ts` | ❌ W0 | ⬜ pending |
| 41-02-03 | 02 | 2 | DIST-04 | script | `node scripts/launch-gate.mjs` | ✅ | ⬜ pending |
| 41-02-04 | 02 | 2 | DIST-04 | suite | `pnpm test && npx playwright test` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `.npmignore` — exclude source maps and test files from tarball
- [ ] `LICENSE` — MIT license file
- [ ] `CHANGELOG.md` — Keep a Changelog format, 0.1.0 initial release
- [ ] `scripts/consumer-test.ts` — automated consumer integration test
- [ ] `scripts/verify-bundle-size.ts` — bundle size gate script

*Existing test infrastructure (vitest, Playwright, launch-gate.ts) covers DIST-04.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Lighthouse 100/100 on deployed site | DIST-04 | Requires live deployment + Chrome | Run `node scripts/launch-gate.mjs` against production URL |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 45s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
