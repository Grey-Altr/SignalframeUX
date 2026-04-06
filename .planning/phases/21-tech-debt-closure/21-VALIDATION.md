---
phase: 21
slug: tech-debt-closure
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-06
---

# Phase 21 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Code review + grep verification (no test framework for this phase) |
| **Config file** | none — validation is code-review and grep-based |
| **Quick run command** | `pnpm tsc --noEmit` |
| **Full suite command** | `pnpm tsc --noEmit && pnpm build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm tsc --noEmit`
- **After every plan wave:** Run `pnpm tsc --noEmit && pnpm build`
- **Before `/pde:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 21-01-01 | 01 | 1 | TD-01 | code review + grep | `grep -n "disconnect" components/animation/signal-mesh.tsx components/animation/glsl-hero.tsx` | ✅ | ⬜ pending |
| 21-01-02 | 01 | 1 | TD-02 | code review + grep | `grep -n "isNaN" components/animation/signal-mesh.tsx components/animation/glsl-hero.tsx` | ✅ | ⬜ pending |
| 21-01-03 | 01 | 1 | TD-03 | grep negative | `grep -r "window.scrollTo" --include="*.ts" --include="*.tsx" components/ hooks/ app/` | ✅ | ⬜ pending |
| 21-01-04 | 01 | 1 | TD-04 | visual + grep | `grep -n "TOAST" components/blocks/components-explorer.tsx` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No new test framework needed — all validations are grep-based and build-based.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| MutationObserver disconnect prevents memory leaks | TD-01 | No automated memory leak detection | Navigate between pages, check DevTools Memory for leaked observers |
| Lenis scroll feels smooth on all consumers | TD-03 | UX smoothness is subjective | Click all nav items, back-to-top, command palette scroll — verify smooth animation |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
