---
phase: 45
slug: token-bridge
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-11
---

# Phase 45 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (unit), pnpm tsc --noEmit (type check) |
| **Config file** | `vitest.config.ts`, `tsconfig.json` |
| **Quick run command** | `pnpm tsc --noEmit` |
| **Full suite command** | `pnpm tsc --noEmit && pnpm build` |
| **Estimated runtime** | ~15 seconds (tsc), ~60 seconds (full build) |

---

## Sampling Rate

- **After every task commit:** Run `pnpm tsc --noEmit`
- **After every plan wave:** Run `pnpm tsc --noEmit && pnpm build`
- **Before `/pde:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 45-01-01 | 01 | 1 | TBR-01, TBR-02 | grep+build | `grep "sfx-" app/globals.css && pnpm tsc --noEmit` | ✅ | ⬜ pending |
| 45-01-02 | 01 | 1 | TBR-01 | grep+build | `grep "@layer signalframeux" dist/signalframeux.css` | ✅ | ⬜ pending |
| 45-01-03 | 01 | 1 | TBR-03 | grep | `grep "sfx-" MIGRATION.md` | ✅ | ⬜ pending |
| 45-01-04 | 01 | 1 | TBR-04 | grep | `grep "cd-tokens" dist/` or example file check | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements. cd-tokens.css is a new file created during execution.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| No visual regression on SF//UX site after rename | TBR-01 | Visual inspection needed | Run dev server, compare all 5 pages against current state |
| @layer cascade: consumer CSS wins | TBR-02 | Requires browser inspection | Create test HTML importing signalframeux.css + cd-tokens.css, verify override in DevTools |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-04-11 — Token rename is mechanical; type-check + build verifies correctness
