---
phase: 22
slug: token-finalization
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-06
---

# Phase 22 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — no unit test framework; TypeScript + visual smoke |
| **Config file** | tsconfig.json |
| **Quick run command** | `pnpm tsc --noEmit` |
| **Full suite command** | `pnpm build && pnpm start` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm tsc --noEmit`
- **After every plan wave:** Run `pnpm build` + visual smoke of affected components
- **Before `/pde:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 22-01-01 | 01 | 1 | TK-01 | grep + tsc | `grep '@theme' app/globals.css \| grep success` | ✅ | ⬜ pending |
| 22-01-02 | 01 | 1 | TK-01 | visual smoke | `pnpm dev` → check SFAlert, SFStatusDot, SFToast, ComponentsExplorer | ✅ | ⬜ pending |
| 22-01-03 | 01 | 1 | TK-04 | visual smoke | `pnpm dev` → check SignalMesh + GLSLHero | ✅ | ⬜ pending |
| 22-02-01 | 02 | 1 | TK-02 | grep | `grep -n "ELEVATION POLICY" app/globals.css` | ✅ | ⬜ pending |
| 22-02-02 | 02 | 1 | TK-03 | grep | `grep -n "Deferred Token" SCAFFOLDING.md` | ✅ | ⬜ pending |
| 22-02-03 | 02 | 1 | TK-02 | grep | `grep -n "Elevation" SCAFFOLDING.md` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| `bg-success` renders green in SFAlert | TK-01 | CSS utility presence is visual | Dev server → /components → SFAlert success variant |
| `border-warning` renders yellow in SFToast | TK-01 | CSS utility presence is visual | Dev server → trigger warning toast |
| SignalMesh/GLSLHero render after token change | TK-04 | WebGL visual correctness | Dev server → homepage → verify canvas renders |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
