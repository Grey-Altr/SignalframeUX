---
phase: 14
slug: session-persistence
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-06
---

# Phase 14 — Validation Strategy

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | TypeScript compiler + Next.js build |
| **Quick run command** | `pnpm tsc --noEmit` |
| **Full suite command** | `pnpm tsc --noEmit && pnpm build` |
| **Estimated runtime** | ~20 seconds |

## Sampling Rate

- **After every task commit:** `pnpm tsc --noEmit`
- **After every plan wave:** `pnpm tsc --noEmit && pnpm build`
- **Max feedback latency:** 20 seconds

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Filter persistence on /components | STP-01 | Browser navigation state | Select filter, navigate away, return — verify same filter |
| Tab persistence on /tokens | STP-01 | Browser navigation state | Switch tab, navigate away, return — verify same tab |
| Scroll restoration on /components | STP-01 | Scroll position | Scroll down, navigate away, press back — verify position |
| Hard reload clears state | STP-01 | sessionStorage semantics | Hard reload — verify default state |
| No hydration mismatch warnings | STP-01 | Browser console | Load pages, check console |

## Phase Gate

- [ ] `pnpm tsc --noEmit` — zero errors
- [ ] `pnpm build` — clean build
- [ ] Filter persistence works on /components
- [ ] Tab persistence works on /tokens
- [ ] Scroll restoration on back-navigation
- [ ] Hard reload clears all persisted state
- [ ] No hydration mismatch warnings
