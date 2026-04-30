---
phase: 49
slug: grain-idle-escalation
status: ratified
nyquist_compliant: false
nyquist_classification: ratification-only — generative SIGNAL effect (visual)
wave_0_complete: n/a
created: 2026-04-29
ratified_via: v1.7-MILESTONE-AUDIT.md
---

# Phase 49 — Validation Strategy (retroactive skeleton)

> Phase 49 (Grain + Idle Escalation + Visual Baseline) shipped 2026-04-25 (commit `c2294c1`). Retroactive skeleton 2026-04-29. **WebGL/visual SIGNAL effect — by project convention WebGL components are excluded from vitest (see Phase 50.1 sign-off). Nyquist automated-test N/A; ratified via grep + visual baseline.**

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | grep audit + Chromatic visual regression |
| **Quick run command** | `grep "0.03 + 0.05.*log10" components/layout/global-effects.tsx` |
| **Full suite command** | `pnpm chromatic` |

---

## Per-Task Verification Map (retroactive)

| REQ-ID | Verification | Status | Evidence |
|--------|--------------|--------|----------|
| GRN-01 | Grain log curve `0.03 + 0.05·log10(1+9i)` | ✅ green | `components/layout/global-effects.tsx` |
| GRN-02..04 | Idle escalation hook + thresholds + baseline lock | ✅ green / partial | v1.7-MILESTONE-AUDIT.md classification |

---

## Manual-Only Verifications

| Behavior | Why Manual | Status |
|----------|------------|--------|
| Static grain ceiling > 0.07 opacity is anti-feature | Subjective | ✅ ratified — see `v1.7 critical constraints` |

---

## Validation Sign-Off

- [x] WebGL/visual phase — vitest excluded by project convention
- [x] Ratified via grep + Chromatic baseline at v1.7 close

**Approval:** retroactive skeleton 2026-04-29.
