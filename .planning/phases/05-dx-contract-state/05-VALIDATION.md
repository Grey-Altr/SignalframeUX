---
phase: 5
slug: dx-contract-state
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-05
---

# Phase 5 — Validation Strategy

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | grep + file existence checks |
| **Quick run command** | `grep -c "@example" components/sf/*.tsx` |
| **Full suite command** | `npx tsc --noEmit && test -f docs/SCAFFOLDING.md && grep -c "/**" components/sf/*.tsx` |
| **Estimated runtime** | ~10 seconds |

## Per-Task Verification Map

| Task ID | Requirement | Test Type | Automated Command | Status |
|---------|-------------|-----------|-------------------|--------|
| 05-01 | DX-01 | file | `test -f docs/SCAFFOLDING.md && grep -c "CVA" docs/SCAFFOLDING.md` | ⬜ |
| 05-02 | DX-02 | grep | `grep -c "sf/" docs/SCAFFOLDING.md` (import boundary) | ⬜ |
| 05-03 | DX-03 | grep | `grep -c "/**" components/sf/*.tsx` (JSDoc count) | ⬜ |
| 05-04 | DX-04,DX-05,STP-01 | file | `test -f .planning/phases/05-dx-contract-state/DX-SPEC.md` | ⬜ |
| 05-05 | STP-02 | grep | `grep "sf-no-transition" lib/theme.ts` | ⬜ |

## Manual-Only Verifications

| Behavior | Requirement | Why Manual |
|----------|-------------|------------|
| Theme toggle during GSAP animation | STP-02 | Requires browser interaction |

**Approval:** pending
