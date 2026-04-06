---
phase: 1
slug: frame-foundation
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-05
audited: 2026-04-05
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
| 01-01 | 01 | 1 | FRM-01 | grep | `grep -rEn " (p\|px\|py\|m\|mx\|my\|gap\|pt\|pb\|pl\|pr\|mt\|mb\|ml\|mr)-(5\|7\|10)[^0-9]" components/sf/ components/blocks/ components/layout/ --include="*.tsx"` | N/A | ✅ green |
| 01-02 | 01 | 1 | FRM-02 | grep | `grep -n "text-heading-1\|text-heading-2\|text-heading-3\|text-body\|text-small" app/globals.css` | N/A | ✅ green |
| 01-03 | 01 | 1 | FRM-03 | grep | `grep -qF -- "--max-w-content" app/globals.css && grep -qF -- "--gutter:" app/globals.css` | N/A | ✅ green |
| 01-04 | 01 | 1 | FRM-04 | grep | `grep -n "var(--color-[^,)]*)" app/globals.css \| grep -v "@theme" \| grep -v ", "` (returns 0 lines) | N/A | ✅ green |
| 01-05 | 01 | 1 | FRM-05 | grep | `grep -n "CORE\|EXTENDED\|EXPANSION POLICY" app/globals.css` | N/A | ✅ green |
| 01-06 | 01 | 1 | FRM-06 | grep | `grep -c '\-\-vhs-[^s]' app/globals.css` (returns 0) | N/A | ✅ green |
| 01-07 | 01 | 1 | FRM-07 | grep | `grep -A2 "defaultVariants" components/sf/sf-button.tsx components/sf/sf-badge.tsx components/sf/sf-toggle.tsx` | N/A | ✅ green |
| 01-08 | 01 | 1 | FRM-08 | grep | `grep -c "@media print" app/globals.css` (returns 1) | N/A | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] Create `audit.sh` script that runs all grep verifications in sequence

*Existing grep infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Fallback visual render | FRM-04 | Requires browser to confirm fallback values render correctly | Remove a CSS var definition, reload page, verify no invisible elements |
| Print stylesheet output | FRM-08 | Requires print preview | Open browser print preview, verify dark backgrounds invert, Signal layer suppressed |

---

## Audit Results (2026-04-05)

Full suite command: `bash .planning/phases/01-frame-foundation/audit.sh`

25 checks / 25 passed / 0 failed

| Check | Result |
|-------|--------|
| FRM-01: Zero non-blessed spacing values in sf/, blocks/, layout/ | PASS |
| FRM-02: .text-heading-1 defined | PASS |
| FRM-02: .text-heading-2 defined | PASS |
| FRM-02: .text-heading-3 defined | PASS |
| FRM-02: .text-body defined | PASS |
| FRM-02: .text-small defined | PASS |
| FRM-03: --max-w-content present | PASS |
| FRM-03: --max-w-wide present | PASS |
| FRM-03: --max-w-full present | PASS |
| FRM-03: --gutter: present | PASS |
| FRM-03: --gutter-sm present | PASS |
| FRM-04: No bare color var() consumers without fallback | PASS |
| FRM-04: No bare font var() consumers without fallback | PASS |
| FRM-05: 'CORE' keyword present | PASS |
| FRM-05: 'EXTENDED' keyword present | PASS |
| FRM-05: 'EXPANSION POLICY' keyword present | PASS |
| FRM-06: Zero bare --vhs- tokens | PASS |
| FRM-06: 4 --sf-vhs- occurrences | PASS |
| FRM-07: sf-button.tsx has defaultVariants | PASS |
| FRM-07: sf-badge.tsx has defaultVariants | PASS |
| FRM-07: sf-toggle.tsx has defaultVariants | PASS |
| FRM-07: signal intent pre-standard extension documented | PASS |
| FRM-08: Exactly 1 @media print block | PASS |
| FRM-08: .vhs-overlay suppressed in print | PASS |
| FRM-08: background: white !important in print | PASS |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 5s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** audited 2026-04-05 — all 25 checks green
