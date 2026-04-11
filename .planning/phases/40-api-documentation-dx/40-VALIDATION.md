---
phase: 40
slug: api-documentation-dx
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-10
---

# Phase 40 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (unit) + playwright (e2e) |
| **Config file** | `vitest.config.ts`, `playwright.config.ts` |
| **Quick run command** | `pnpm vitest run --reporter=verbose` |
| **Full suite command** | `pnpm vitest run && pnpm playwright test` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm vitest run --reporter=verbose`
- **After every plan wave:** Run `pnpm vitest run && pnpm playwright test`
- **Before `/pde:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 40-01-01 | 01 | 1 | DOC-01 | grep | `grep -r "@param" components/sf/*.tsx \| wc -l` | ✅ | ⬜ pending |
| 40-01-02 | 01 | 1 | DOC-08 | script | `pnpm generate:api-docs && git diff --stat lib/api-docs.ts` | ❌ W0 | ⬜ pending |
| 40-02-01 | 02 | 1 | DOC-02 | file | `test -f README.md && grep -c "## " README.md` | ❌ W0 | ⬜ pending |
| 40-02-02 | 02 | 1 | DOC-04 | file | `test -f MIGRATION.md && wc -l MIGRATION.md` | ❌ W0 | ⬜ pending |
| 40-03-01 | 03 | 2 | DOC-03 | script | `pnpm storybook --ci --smoke-test` | ❌ W0 | ⬜ pending |
| 40-03-02 | 03 | 2 | DOC-03 | file | `ls stories/*.stories.tsx \| wc -l` | ❌ W0 | ⬜ pending |
| 40-04-01 | 04 | 2 | DOC-09 | e2e | `pnpm playwright test app/reference` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Auto-generation script infrastructure (generate:api-docs npm script)
- [ ] Storybook installation and configuration (.storybook/ directory)
- [ ] README.md and MIGRATION.md file creation

*Existing infrastructure covers vitest and playwright.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Storybook visual theme matches DU/TDR aesthetic | DOC-03 | Visual judgment — branded theme with OKLCH colors, zero rounded corners | Open Storybook in browser, verify dark theme, monospaced labels, sharp corners |
| README tone matches "technical specimen" style | DOC-02 | Subjective tone assessment | Read README, verify terse/monospaced/data-dense, not warm/friendly |
| /reference page displays all exports correctly | DOC-09 | Layout/rendering verification | Navigate to /reference, verify all entry-core + animation + webgl exports visible |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
