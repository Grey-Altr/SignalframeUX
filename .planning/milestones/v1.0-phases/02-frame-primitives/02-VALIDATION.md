---
phase: 2
slug: frame-primitives
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-05
audited: 2026-04-05
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
| **Full suite command** | `npx tsc --noEmit && grep -n "SFContainer\|SFSection\|SFStack\|SFGrid\|SFText" components/sf/index.ts` |
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
| 02-01 | 01 | 1 | PRM-01 | grep+tsc | `grep "SFContainer" components/sf/index.ts && npx tsc --noEmit` | N/A | ✅ green |
| 02-02 | 01 | 1 | PRM-02 | grep+tsc | `grep "SFSection" components/sf/index.ts && grep "data-section" components/sf/sf-section.tsx` | N/A | ✅ green |
| 02-03 | 01 | 1 | PRM-03 | grep+tsc | `grep "SFStack" components/sf/index.ts` | N/A | ✅ green |
| 02-04 | 01 | 1 | PRM-04 | grep+tsc | `grep "SFGrid" components/sf/index.ts` | N/A | ✅ green |
| 02-05 | 01 | 1 | PRM-05 | grep+tsc | `grep "SFText" components/sf/index.ts && grep "heading-1\|heading-2\|heading-3\|body\|small" components/sf/sf-text.tsx` | N/A | ✅ green |
| 02-06 | 02 | 1 | PRM-06 | grep | `grep "sf-pressable" components/sf/sf-button.tsx && grep "transition-colors" components/sf/sf-button.tsx` | N/A | ✅ green |

> **02-06 command corrected during audit:** Original command `grep "press-scale\|hover-y" components/sf/sf-button.tsx` exits 1 because `--press-scale` and `--hover-y` tokens are consumed by `.sf-pressable` in `globals.css`, not referenced directly in `sf-button.tsx`. The correct observables for PRM-06 compliance are `sf-pressable` (press feedback class wired) and `transition-colors` (no transform conflict) — both present in `sf-button.tsx`. Command updated accordingly.

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*No Wave 0 infrastructure was required. All phase verification relies on `tsc --noEmit` (project-standard) and `grep` audits, both available in the base environment. No new test infrastructure was needed.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| SFContainer responsive behavior | PRM-01 | Requires browser resize to verify breakpoints | Render SFContainer in dev, resize from 320px to 1440px, verify gutters and max-width adapt |
| SFGrid column responsiveness | PRM-04 | Requires visual check at breakpoints | Render SFGrid with children, verify 1→2→3 column progression |
| SFButton press feedback | PRM-06 | CSS transform animation quality requires visual + tactile confirmation | Click SFButton, verify translateY(-2px) on hover and translateY(1px)+scale(0.97) on press, no transition conflict |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 10s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** verified 2026-04-05 — 02-VERIFICATION.md confirms 9/9 observable truths, 6/6 PRM-* requirements satisfied. One command correction applied (02-06). All other commands pass against live codebase.
