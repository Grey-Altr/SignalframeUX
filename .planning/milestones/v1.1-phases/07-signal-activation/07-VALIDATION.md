---
phase: 7
slug: signal-activation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-05
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — interaction-driven behaviors require manual browser verification |
| **Config file** | none |
| **Quick run command** | `pnpm dev` (manual visual validation) |
| **Full suite command** | `pnpm build && pnpm start` (Lighthouse + manual) |
| **Estimated runtime** | ~30 seconds (build) + manual walkthrough |

---

## Sampling Rate

- **After every task commit:** Run `pnpm dev` + manual visual check in browser
- **After every plan wave:** `pnpm build` (no type errors) + manual walkthrough all pages
- **Before `/pde:verify-work`:** All manual checks pass + Lighthouse CLS = 0
- **Max feedback latency:** 30 seconds (build time)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 07-01-01 | 01 | 1 | SIG-09 | manual | Mouse into showcase section, verify crosshair | ❌ manual | ⬜ pending |
| 07-02-01 | 02 | 1 | SIG-08 | manual | Wait 8s idle, verify grain + color pulse | ❌ manual | ⬜ pending |
| 07-02-02 | 02 | 1 | SIG-08 | automated | `pnpm build` — CLS check via Lighthouse | ✅ via build | ⬜ pending |
| 07-03-01 | 03 | 2 | SIG-06 | manual | Hover button, verify oscillator tone | ❌ manual | ⬜ pending |
| 07-03-02 | 03 | 2 | SIG-07 | manual | Click button, verify haptic pulse (Android) | ❌ manual | ⬜ pending |
| 07-03-03 | 03 | 2 | SIG-06, SIG-08 | manual | Enable reduced-motion, verify silent + static | ❌ manual | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Lighthouse CLS validation: `pnpm build && npx lighthouse http://localhost:3000 --output json --only-categories=performance`

*No unit test framework needed — all requirements are interaction-driven.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Crosshair on showcase sections | SIG-09 | Requires mouse movement in browser | Move cursor into each showcase section, verify crosshair + trail |
| Idle grain + color pulse | SIG-08 | Requires 8s inactivity | Wait 8s without input, verify grain drift + lightness oscillation |
| Audio oscillator tones | SIG-06 | Requires browser with audio enabled | Hover interactive elements, verify square wave tones play |
| Haptic micro-vibration | SIG-07 | Requires Android device | Click elements on Android Chrome, verify vibration |
| Safari/iOS silent fallback | SIG-07 | Requires iOS device | Click elements on Safari, verify no errors in console |
| Reduced-motion suppression | SIG-06, SIG-08 | Requires OS setting toggle | Enable reduced-motion, verify audio suppressed + idle static |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
