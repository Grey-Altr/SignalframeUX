---
phase: 12
slug: signal-wiring
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-06
---

# Phase 12 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | TypeScript compiler + visual browser check |
| **Config file** | `tsconfig.json` |
| **Quick run command** | `pnpm tsc --noEmit` |
| **Full suite command** | `pnpm tsc --noEmit && pnpm build` |
| **Estimated runtime** | ~20 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm tsc --noEmit`
- **After every plan wave:** Run `pnpm tsc --noEmit && pnpm build`
- **Before `/pde:verify-work`:** Full suite + visual verification
- **Max feedback latency:** 20 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 12-01-01 | 01 | 1 | INT-04 | compile + grep | `pnpm tsc --noEmit && grep -c "getComputedStyle" components/animation/glsl-hero.tsx` | ✅ | ⬜ pending |
| 12-01-02 | 01 | 1 | INT-04 | compile + grep | `pnpm tsc --noEmit && grep -c "getComputedStyle" components/animation/signal-mesh.tsx` | ✅ | ⬜ pending |
| 12-02-01 | 02 | 1 | INT-03 | compile + grep | `pnpm tsc --noEmit && grep -c "SignalMotion" app/page.tsx` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No test files need to be created.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Intensity slider changes noise amplitude | INT-04 | Visual WebGL effect | Open site, Shift+S, move intensity slider, observe GLSLHero/SignalMesh change |
| Speed slider changes animation speed | INT-04 | Visual WebGL timing | Move speed slider, observe animation rate change |
| No getComputedStyle in ticker | INT-04 | Code pattern check | grep -rn "getComputedStyle" in ticker callbacks |
| SignalMotion on 3+ sections | INT-03 | Visual scroll check | Scroll homepage, observe entrance animations on MANIFESTO, SIGNAL/FRAME, API, COMPONENTS |
| Reduced motion disables animations | INT-03 | OS-level toggle | Enable reduced motion in OS, verify no animations, no console errors |

---

## Phase Gate

- [ ] `pnpm tsc --noEmit` — zero errors
- [ ] `pnpm build` — clean build
- [ ] SignalOverlay sliders visibly affect WebGL scenes
- [ ] No `getComputedStyle` in GSAP ticker callbacks
- [ ] 3+ homepage sections have scroll-driven SignalMotion
- [ ] Reduced motion respected without errors
