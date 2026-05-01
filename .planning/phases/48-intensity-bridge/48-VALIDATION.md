---
phase: 48
slug: intensity-bridge
status: ratified
nyquist_compliant: false
nyquist_classification: ratification-only — central-derivation architectural prerequisite
wave_0_complete: n/a
created: 2026-04-29
ratified_via: v1.7-MILESTONE-AUDIT.md
---

# Phase 48 — Validation Strategy (retroactive skeleton)

> Phase 48 (Intensity Bridge + Chromatic Setup) shipped 2026-04-25 (commit `99e83d6`). Retroactive skeleton authored 2026-04-29 to close the file-presence gap. **Architectural-prerequisite phase — `updateSignalDerivedProps(intensity)` central derivation is consumed by every effect phase 49-55 (see v1.7 retrospective "carry-forward derived properties"). Nyquist automated-test coverage is N/A by design — verified via grep against shipped code in v1.7-MILESTONE-AUDIT.md.**

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | grep audit + Chromatic devDep install verification |
| **Quick run command** | `grep "updateSignalDerivedProps" components/layout/global-effects.tsx` |
| **Full suite command** | `pnpm build-storybook` (must complete clean) |

---

## Per-Task Verification Map (retroactive)

| REQ-ID | Verification | Status | Evidence |
|--------|--------------|--------|----------|
| SIG-01 | `updateSignalDerivedProps(intensity)` exists | ✅ green | `components/layout/global-effects.tsx` |
| SIG-02 | 12 derived CSS custom properties from `--sfx-signal-intensity` | ✅ green | grep curve invocations |
| SIG-03 | `[data-signal-intensity="low\|med\|high"]` attribute selectors | ✅ green | `components/layout/global-effects.tsx` |
| SIG-04 | MutationObserver real-time bridge in SignalIntensityBridge | ✅ green | grep MutationObserver usage |
| SIG-05 | Reduced-motion collapses derived values to 0 | ✅ green | grep prefers-reduced-motion |
| VRG-01 | `@chromatic-com/storybook` + `chromatic` CLI installed | ✅ green | `package.json` devDeps |

---

## Manual-Only Verifications

| Behavior | Why Manual | Status |
|----------|------------|--------|
| Visual coherence of 12 derived effect properties | Subjective — needs eye-of-record | ✅ ratified at v1.7 close |

---

## Validation Sign-Off

- [x] Architectural prerequisite for phases 49-55 (single derivation point)
- [x] No automated-test gap by design — grep evidence covers central-derivation contract

**Approval:** retroactive skeleton 2026-04-29.
