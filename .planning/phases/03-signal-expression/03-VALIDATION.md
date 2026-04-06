---
phase: 3
slug: signal-expression
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-05
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | grep audits + browser visual verification |
| **Config file** | none |
| **Quick run command** | `grep -rn "data-anim\|duration-fast\|duration-slow\|duration-instant" app/globals.css components/` |
| **Full suite command** | `npx tsc --noEmit && grep -c "data-anim" components/blocks/*.tsx` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run relevant grep for modified signal behavior
- **After every plan wave:** Run full tsc + grep suite
- **Before `/pde:verify-work`:** Full suite + manual browser checks
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| 03-01 | 01 | 1 | SIG-01 | grep | `grep "ScrollTrigger\|onEnter" components/layout/page-animations.tsx` | ⬜ pending |
| 03-02 | 01 | 1 | SIG-02 | grep | `grep "duration-fast\|duration-slow" app/globals.css \| grep -c hover` | ⬜ pending |
| 03-03 | 01 | 1 | SIG-03 | grep | `grep "duration-instant" components/layout/page-animations.tsx` | ⬜ pending |
| 03-04 | 01 | 1 | SIG-04 | grep | `grep "stagger\|ScrollTrigger.batch" components/layout/page-animations.tsx` | ⬜ pending |
| 03-05 | 01 | 1 | SIG-05 | grep | `grep "data-anim.*opacity" app/globals.css` | ⬜ pending |
| 03-06 | 02 | 1 | SIG-09 | grep | `grep "data-cursor\|canvas" components/animation/` | ⬜ pending |
| 03-07 | 02 | 1 | SIG-10 | file | `test -f docs/SIGNAL-SPEC.md \|\| test -f .planning/SIGNAL-SPEC.md` | ⬜ pending |

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| ScrambleText visual on route entry | SIG-01 | Requires browser navigation | Navigate between routes, verify heading scramble plays |
| Asymmetric hover timing feel | SIG-02 | Requires hover interaction | Hover interactive elements, verify snap-in / slow-out feel |
| Hard-cut section transitions | SIG-03 | Requires scroll observation | Scroll through sections, verify instant cut vs fade |
| Canvas cursor crosshair + trail | SIG-09 | Requires mouse movement in browser | Move mouse over [data-cursor] section, verify crosshair and particle trail |
| Mobile signal collapse | SIG-10 | Requires mobile viewport | Resize to mobile, verify cursor hidden, VHS reduced |

---

## Validation Sign-Off

- [ ] All tasks have automated verify
- [ ] Sampling continuity maintained
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
