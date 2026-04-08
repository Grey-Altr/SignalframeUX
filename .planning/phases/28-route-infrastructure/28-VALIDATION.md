---
phase: 28
slug: route-infrastructure
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-07
---

# Phase 28 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright (already installed) |
| **Config file** | playwright.config.ts |
| **Quick run command** | `pnpm exec playwright test tests/phase-28` |
| **Full suite command** | `pnpm exec playwright test` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm exec playwright test tests/phase-28`
- **After every plan wave:** Run `pnpm exec playwright test`
- **Before `/pde:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 28-01-01 | 01 | 1 | RA-01, RA-02, RA-03 | integration | `curl -I localhost:3000/components` | ❌ W0 | ⬜ pending |
| 28-01-02 | 01 | 1 | RA-04 | integration | `grep -r '"/components"' --include='*.tsx'` | ✅ | ⬜ pending |
| 28-01-03 | 01 | 1 | RA-01–04 | e2e | `pnpm exec playwright test tests/phase-28` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/phase-28-route-infra.spec.ts` — route redirect smoke tests + link update verification
- [ ] Existing Playwright infrastructure covers execution

*Existing infrastructure covers all phase requirements after Wave 0 test file is created.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Page content intact after rename | RA-01–03 | Visual verification of layout/content | Navigate to /inventory, /system, /init — verify components, tokens, getting-started render correctly |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
