---
phase: 13
slug: config-provider
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-06
---

# Phase 13 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | TypeScript compiler + Next.js build |
| **Config file** | `tsconfig.json` |
| **Quick run command** | `pnpm tsc --noEmit` |
| **Full suite command** | `pnpm tsc --noEmit && pnpm build` |
| **Estimated runtime** | ~20 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm tsc --noEmit`
- **After every plan wave:** Run `pnpm tsc --noEmit && pnpm build`
- **Before `/pde:verify-work`:** Full suite + browser hydration check
- **Max feedback latency:** 20 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 13-01-01 | 01 | 1 | DX-05 | compile | `pnpm tsc --noEmit` | ✅ | ⬜ pending |
| 13-01-02 | 01 | 1 | DX-05 | compile + grep | `pnpm tsc --noEmit && grep "createSignalframeUX" lib/signalframe-provider.tsx` | ✅ | ⬜ pending |
| 13-01-03 | 01 | 1 | DX-05 | build | `pnpm build` | ✅ | ⬜ pending |

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No test files need to be created.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| useSignalframe() outside provider throws | DX-05 | Runtime error check | Remove provider wrapping, call hook, verify descriptive error |
| No hydration mismatch warnings | DX-05 | Browser console check | Load page, check console for hydration warnings |
| Layout primitives stay Server Components | DX-05 | Bundle analysis | Check client chunk for SFContainer/SFSection imports |
| motion.pause()/resume() works | DX-05 | Visual GSAP check | Call motion.pause() in console, verify animations stop |

---

## Phase Gate

- [ ] `pnpm tsc --noEmit` — zero errors
- [ ] `pnpm build` — clean build
- [ ] `createSignalframeUX` factory exists and returns provider + hook
- [ ] `useSignalframe()` throws descriptive error outside provider
- [ ] No hydration mismatch warnings
- [ ] Layout primitives remain Server Components
- [ ] `motion.pause()`/`motion.resume()` control GSAP globally
