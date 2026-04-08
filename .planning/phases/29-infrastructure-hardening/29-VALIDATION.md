---
phase: 29
slug: infrastructure-hardening
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-07
updated: 2026-04-08
---

# Phase 29 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.59+ |
| **Config file** | `playwright.config.ts` (root) |
| **Quick run command** | `pnpm exec playwright test tests/phase-29-infra.spec.ts` |
| **Full suite command** | `pnpm exec playwright test` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm exec playwright test tests/phase-29-infra.spec.ts`
- **After every plan wave:** Run `pnpm exec playwright test`
- **Before `/pde:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 29-01-01 | 01 | 1 | PF-04 | smoke/grep | `pnpm exec playwright test tests/phase-29-infra.spec.ts` | ✅ | ✅ green |
| 29-01-02 | 01 | 1 | PF-04 | smoke/grep | `pnpm exec playwright test tests/phase-29-infra.spec.ts` | ✅ | ✅ green |
| 29-01-03 | 01 | 1 | PF-05 | smoke/grep | `pnpm exec playwright test tests/phase-29-infra.spec.ts` | ✅ | ✅ green |
| 29-01-04 | 01 | 1 | PF-04 | smoke | `pnpm exec playwright test tests/phase-29-infra.spec.ts` | ✅ | ✅ green |
| 29-02-01 | 02 | 1 | PF-06 | smoke | `pnpm exec playwright test tests/phase-29-infra.spec.ts` | ✅ | ✅ green |
| 29-02-02 | 02 | 1 | PF-06 | grep/audit | `pnpm exec playwright test tests/phase-29-infra.spec.ts` | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `tests/phase-29-infra.spec.ts` — 10 tests covering PF-04 (overscroll CSS + fonts.ready + Lenis autoResize + browser smoke), PF-05 (Observer registration × 2 entry points), PF-06 (PinnedSection guard + token-viz coverage + initReducedMotion + component audit)

*Existing infrastructure covers framework — Playwright is already in devDependencies.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| iOS Safari rubber-band suppressed on pinned sections | PF-04 | Requires physical iOS device (simulator insufficient) | Load site on iPhone Safari → overscroll at top/bottom → confirm no white gap flicker on pinned sections |
| Lenis `autoResize: false` prevents address bar jump | PF-04 | Requires physical iOS device with address bar interaction | Scroll slowly on iPhone → address bar hides → confirm scroll position does not jump |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-04-08

---

## Validation Audit 2026-04-08

| Metric | Count |
|--------|-------|
| Gaps found | 0 |
| Resolved | 0 |
| Escalated | 0 |

### Requirement Coverage

| Requirement | Tests | Test Lines | Status |
|-------------|-------|------------|--------|
| PF-04 | overscroll-behavior grep, fonts.ready grep, Lenis autoResize grep, browser smoke | 18-74 | COVERED |
| PF-05 | Observer registration ×2 (gsap-plugins + gsap-core) | 34-51 | COVERED |
| PF-06 | PinnedSection guard order, token-viz annotation, initReducedMotion, component audit | 78-148 | COVERED |

All 3 requirements have automated verification across 10 Playwright tests. No gaps. Phase 29 is Nyquist-compliant.
