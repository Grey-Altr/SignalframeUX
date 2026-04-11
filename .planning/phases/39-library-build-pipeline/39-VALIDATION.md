---
phase: 39
slug: library-build-pipeline
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-10
---

# Phase 39 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 4.x |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `pnpm test` |
| **Full suite command** | `pnpm test:coverage` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test`
- **After every plan wave:** Run `pnpm test:coverage`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 39-01-01 | 01 | 1 | LIB-01 | — | N/A | unit | `pnpm build:lib && ls dist/` | ❌ W0 | ⬜ pending |
| 39-01-02 | 01 | 1 | LIB-02 | — | N/A | unit | `pnpm build:lib && file dist/index.mjs dist/index.cjs` | ❌ W0 | ⬜ pending |
| 39-02-01 | 02 | 2 | LIB-03 | — | No GSAP/Three in core bundle | integration | `node -e "require('./dist/tree-shake-test.cjs')"` | ❌ W0 | ⬜ pending |
| 39-02-02 | 02 | 2 | LIB-01 | — | N/A | unit | `npm pack --dry-run 2>&1 | grep -v node_modules` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- Existing infrastructure covers all phase requirements (vitest already installed, build validation via CLI commands)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Consumer import works in fresh Next.js app | LIB-01 | Requires external project | Create temp Next.js app, install packed tarball, import SF components |
| Token CSS renders correct custom properties | LIB-01 | Visual check | Import `signalframeux.css` in consumer, verify OKLCH vars in DevTools |

---

## Validation Architecture Notes

See 39-RESEARCH.md § Validation Architecture for detailed approach.
