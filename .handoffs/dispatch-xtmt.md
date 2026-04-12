# Dispatch to xtmt — from xtpr (cc-d7f0419b) — 2026-04-10

## Status: Phase 36 Complete, v1.6 Active

SignalframeUX v1.6 "API-Ready" milestone is live. Phase 36 (Housekeeping & Carry-Overs) executed and verified.

## What happened this session

1. **Received stale xtop handoff** (cc-d7f0419b from April 9) — Phase 35 blockers (OPEN-1, OPEN-2, path choice) were already resolved and Phase 35 was fully shipped before this session started.

2. **Scoped v1.6 milestone** — 6 phases (36-41) covering:
   - Phase 36: Housekeeping & carry-overs (DONE)
   - Phase 37: Next.js 16 migration
   - Phase 38: Test & quality hardening
   - Phase 39: Library build pipeline
   - Phase 40: API documentation & DX
   - Phase 41: Distribution & launch gate

3. **Executed Phase 36** via `/pde:plan-phase 36 --auto`:
   - Lighthouse 100/100/100/100 (BP, SEO, A11y, Perf gate not required)
   - ESLint 9 flat config with strict TypeScript + style rules, zero violations
   - T-06 test path fixed, TypeScript strict errors resolved
   - REQUIREMENTS.md extended with v1.6 section (21 requirement IDs)
   - ROADMAP.md stale entries corrected
   - 7 commits on main: `85e20ce` → `76b649a`

4. **Key technical findings:**
   - CSP nonce in middleware was silently blocking all Next.js static chunks (CSP3 spec: nonce presence nullifies `unsafe-inline`)
   - `headers()` in layout.tsx was forcing dynamic rendering, breaking SEO meta-description
   - lighthouse@13 is pure ESM — tsx CJS interop breaks; created native ESM runner `scripts/launch-gate-runner.mjs`
   - pnpm strict hoisting requires direct devDep installs for @typescript-eslint packages

## Current state

- **v1.5**: Shipped 2026-04-10 (Phases 28-35 complete)
- **v1.6**: Active, 1/6 phases complete
- **Next action**: `/pde:discuss-phase 37 --auto` (Next.js 16 migration)
- **Open decision for Phase 39**: Token distribution strategy (CSS-in-package vs token-agnostic) — not blocking until Phase 38 completes

## Git state

Branch: main
Latest: `76b649a` docs(phase-36): complete phase execution
No uncommitted changes relevant to dispatch.
