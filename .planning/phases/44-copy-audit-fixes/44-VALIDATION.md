---
phase: 44
slug: copy-audit-fixes
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-11
---

# Phase 44 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright (e2e), Vitest (unit) |
| **Config file** | `playwright.config.ts`, `vitest.config.ts` |
| **Quick run command** | `npx playwright test tests/phase-35-metadata.spec.ts` |
| **Full suite command** | `npx playwright test tests/phase-35-metadata.spec.ts` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx playwright test tests/phase-35-metadata.spec.ts`
- **After every plan wave:** Run `npx playwright test tests/phase-35-metadata.spec.ts`
- **Before `/pde:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 44-01-01 | 01 | 1 | COP-01 | e2e | `grep "48" components/blocks/stats-band.tsx` | ✅ | ⬜ pending |
| 44-01-02 | 01 | 1 | COP-02 | e2e | `grep "v1.7" app/opengraph-image.tsx` | ✅ | ⬜ pending |
| 44-01-03 | 01 | 1 | COP-03 | e2e | `grep -v "FRAMEWORK-AGNOSTIC" app/init/page.tsx` | ✅ | ⬜ pending |
| 44-01-04 | 01 | 1 | COP-04 | e2e | `grep -v "SHIP FASTER" components/blocks/marquee-band.tsx` | ✅ | ⬜ pending |
| 44-01-05 | 01 | 1 | COP-05 | e2e | `grep -v "and growing" app/page.tsx` | ✅ | ⬜ pending |
| 44-01-06 | 01 | 1 | COP-06 | e2e | `npx playwright test tests/phase-35-metadata.spec.ts` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| OG image visual correctness | COP-02 | OG image rendering requires visual inspection | Build, check /opengraph-image route visually |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
