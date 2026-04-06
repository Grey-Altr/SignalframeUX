---
phase: 2
slug: frame-primitives
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-05
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | TypeScript compiler + grep audits (no test runner for component phase) |
| **Config file** | tsconfig.json |
| **Quick run command** | `npx tsc --noEmit --pretty 2>&1 | head -20` |
| **Full suite command** | `npx tsc --noEmit && grep -rn "SFContainer\|SFSection\|SFStack\|SFGrid\|SFText" components/sf/index.ts` |
| **Estimated runtime** | ~8 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit` for type safety
- **After every plan wave:** Run full suite (tsc + barrel export check)
- **Before `/pde:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01 | 01 | 1 | PRM-01 | grep+tsc | `grep "SFContainer" components/sf/index.ts && npx tsc --noEmit` | N/A | ⬜ pending |
| 02-02 | 01 | 1 | PRM-02 | grep+tsc | `grep "SFSection" components/sf/index.ts && grep "data-section" components/sf/sf-section.tsx` | N/A | ⬜ pending |
| 02-03 | 01 | 1 | PRM-03 | grep+tsc | `grep "SFStack" components/sf/index.ts` | N/A | ⬜ pending |
| 02-04 | 01 | 1 | PRM-04 | grep+tsc | `grep "SFGrid" components/sf/index.ts` | N/A | ⬜ pending |
| 02-05 | 01 | 1 | PRM-05 | grep+tsc | `grep "SFText" components/sf/index.ts && grep "heading-1\|heading-2\|heading-3\|body\|small" components/sf/sf-text.tsx` | N/A | ⬜ pending |
| 02-06 | 02 | 1 | PRM-06 | grep | `grep "press-scale\|hover-y" components/sf/sf-button.tsx` | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| SFContainer responsive behavior | PRM-01 | Requires browser resize to verify breakpoints | Render SFContainer in dev, resize from 320px to 1440px, verify gutters and max-width adapt |
| SFGrid column responsiveness | PRM-04 | Requires visual check at breakpoints | Render SFGrid with children, verify 1→2→3 column progression |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
