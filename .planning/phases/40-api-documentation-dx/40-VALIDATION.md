---
phase: 40
slug: api-documentation-dx
status: validated
nyquist_compliant: true
wave_0_complete: true
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
| 40-00-01 | 00 | 0 | DOC-01,02,03,04 | scaffold | `ls tests/phase-40-*.spec.ts \| wc -l` | ✅ | ✅ green |
| 40-01-01 | 01 | 1 | DOC-01 | grep | `for f in components/sf/sf-*.tsx; do grep -c '/\*\*' $f; done` | ✅ (W0) | ✅ green |
| 40-01-02 | 01 | 1 | DOC-01 | grep | same as above (second batch) | ✅ (W0) | ✅ green |
| 40-01-03 | 01 | 1 | DOC-04 | script | `pnpm docs:generate && pnpm build` | ✅ (W0) | ✅ green |
| 40-02-01 | 02 | 1 | DOC-02 | file | `grep -ciE 'INSTALL\|QUICK START\|FRAME.*SIGNAL\|SIGNAL.*FRAME\|TOKEN' README.md` | ✅ (W0) | ✅ green |
| 40-02-02 | 02 | 1 | DOC-04 | file | `wc -l MIGRATION.md && npx playwright test tests/phase-40-02-readme.spec.ts` | ✅ (W0) | ✅ green |
| 40-03-01 | 03 | 2 | DOC-03 | script | `pnpm build-storybook && test -f storybook-static/index.html` | ✅ (W0) | ✅ green |
| 40-03-02 | 03 | 2 | DOC-03 | file | `ls stories/flagship/*.stories.tsx \| wc -l` (>= 10) | ✅ (W0) | ✅ green |
| 40-04-01 | 04 | 3 | DOC-03 | file | `test -f vercel-storybook.json` | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] Plan 40-00 creates all 4 test spec files before implementation plans run
  - `tests/phase-40-01-jsdoc-audit.spec.ts` — covers DOC-01
  - `tests/phase-40-02-readme.spec.ts` — covers DOC-02
  - `tests/phase-40-03-storybook.spec.ts` — covers DOC-03
  - `tests/phase-40-04-api-docs.spec.ts` — covers DOC-04

*Existing infrastructure covers vitest and playwright.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Storybook visual theme matches DU/TDR aesthetic | DOC-03 | Visual judgment — branded theme with OKLCH colors, zero rounded corners | Open Storybook in browser, verify dark theme, monospaced labels, sharp corners |
| README tone matches "technical specimen" style | DOC-02 | Subjective tone assessment | Read README, verify terse/monospaced/data-dense, not warm/friendly |
| /reference page displays all exports correctly | DOC-04 | Layout/rendering verification | Navigate to /reference, verify all entry-core + animation + webgl exports visible |
| Storybook Vercel deployment accessible | DOC-03 | Requires Vercel project creation | User creates Vercel project per Plan 40-04 checkpoint |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved

---

## Validation Audit 2026-04-11

| Metric | Count |
|--------|-------|
| Gaps found | 5 |
| Resolved | 5 |
| Escalated | 0 |

**Details:** 5 failures in `phase-40-04-api-docs.spec.ts` — multiline export parsing bug in auto-gen script (missed sub-components), plus string-matching format mismatch in tests. Fixed by Nyquist auditor in commit `0dada72`. Third-party GSAP re-exports correctly excluded from both generator and tests. All 31 tests now green.
