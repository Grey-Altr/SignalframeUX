---
phase: 1
slug: frame-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-05
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | grep/ripgrep audits (no test runner — CSS token phase) |
| **Config file** | none — grep-based verification |
| **Quick run command** | `grep -rn "arbitrary pattern" components/ app/` |
| **Full suite command** | `bash .planning/phases/01-frame-foundation/audit.sh` |
| **Estimated runtime** | ~2 seconds |

---

## Sampling Rate

- **After every task commit:** Run relevant grep audit for the modified requirement
- **After every plan wave:** Run full audit script
- **Before `/pde:verify-work`:** Full audit must show zero violations
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01 | 01 | 1 | FRM-01 | grep | `grep -rn 'p-[57]\|m-[57]\|gap-[57]\|space-[xy]-[57]' components/ app/ --include='*.tsx'` | N/A | ⬜ pending |
| 01-02 | 01 | 1 | FRM-02 | grep | `grep -rn 'text-heading-1\|text-heading-2\|text-heading-3\|text-body\|text-small' app/globals.css` | N/A | ⬜ pending |
| 01-03 | 01 | 1 | FRM-03 | grep | `grep -rn 'max-w-content\|max-w-wide\|--gutter' app/globals.css` | N/A | ⬜ pending |
| 01-04 | 01 | 1 | FRM-04 | grep | `grep -c 'var(--' app/globals.css` vs fallback count | N/A | ⬜ pending |
| 01-05 | 01 | 1 | FRM-05 | grep | `grep -n 'Core 5\|Extended' app/globals.css` | N/A | ⬜ pending |
| 01-06 | 01 | 1 | FRM-06 | grep | `grep -rn 'vhs-' app/globals.css components/ --include='*.tsx' --include='*.css'` (should only find sf-vhs-) | N/A | ⬜ pending |
| 01-07 | 01 | 1 | FRM-07 | grep | `grep -rn 'intent' components/sf/ --include='*.tsx'` | N/A | ⬜ pending |
| 01-08 | 01 | 1 | FRM-08 | grep | `grep -n '@media print' app/globals.css` | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Create `audit.sh` script that runs all grep verifications in sequence

*Existing grep infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Fallback visual render | FRM-04 | Requires browser to confirm fallback values render correctly | Remove a CSS var definition, reload page, verify no invisible elements |
| Print stylesheet output | FRM-08 | Requires print preview | Open browser print preview, verify dark backgrounds invert, Signal layer suppressed |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
