---
phase: 33
slug: inventory-acquisition-sections
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-09
---

# Phase 33 — Validation Strategy

> Per-phase validation contract reconstructed from completed artifacts.
> All 11 requirements covered by 13 automated tests. Zero gaps.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.x (Chromium) |
| **Config file** | `playwright.config.ts` |
| **Quick run command** | `pnpm playwright test tests/phase-33-inventory-acquisition.spec.ts --grep "IV-01"` |
| **Full suite command** | `pnpm playwright test tests/phase-33-inventory-acquisition.spec.ts` |
| **Estimated runtime** | ~9 seconds (13 tests, all green) |

---

## Sampling Rate

- **After every task commit:** Run the relevant requirement grep (e.g., `--grep "IV-04"`)
- **After every plan wave:** Run full Phase 33 suite
- **Before `/pde:verify-work`:** Full suite must be green (confirmed green 2026-04-09)
- **Max feedback latency:** ~9 seconds

---

## Per-Task Verification Map

| Req ID | Plan | Wave | Description | Test Type | Automated Command | Status |
|--------|------|------|-------------|-----------|-------------------|--------|
| IV-01 | 33-02 | 2 | Catalog uses SF//[CAT]-NNN nomenclature | source + DOM | `pnpm playwright test ... --grep "IV-01"` | ✅ green |
| IV-02 | 33-02 | 2 | Each entry shows layer + pattern + name | DOM | `pnpm playwright test ... --grep "IV-02"` | ✅ green |
| IV-03 | 33-02 | 2 | Monospaced type, not card-based | source | `pnpm playwright test ... --grep "IV-03"` | ✅ green |
| IV-04 | 33-02 | 2 | Click opens ComponentDetail overlay | DOM | `pnpm playwright test ... --grep "IV-04"` | ✅ green |
| IV-05 | 33-02 + 33-03 | 2 | Homepage 12 rows; /inventory ≥34 items | DOM | `pnpm playwright test ... --grep "IV-05"` | ✅ green (2 tests) |
| IV-06 | 33-03 | 2 | Layer/pattern/category filters on /inventory | DOM | `pnpm playwright test ... --grep "IV-06"` | ✅ green |
| AQ-01 | 33-04 | 3 | `npx signalframeux init` prominent + copy | DOM | `pnpm playwright test ... --grep "AQ-01"` | ✅ green |
| AQ-02 | 33-04 | 3 | System stats as monospaced data points | DOM | `pnpm playwright test ... --grep "AQ-02"` | ✅ green |
| AQ-03 | 33-04 | 3 | Links to /init and /inventory | DOM | `pnpm playwright test ... --grep "AQ-03"` | ✅ green |
| AQ-04 | 33-04 | 3 | Section height ≤50vh | DOM | `pnpm playwright test ... --grep "AQ-04"` | ✅ green |
| AQ-05 | 33-04 | 3 | No CTA button energy | source | `pnpm playwright test ... --grep "AQ-05"` | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. Playwright + Chromium was already in the stack from prior phases. The 13-test scaffold was created in Plan 33-01 (Task 2, commit `604dfc7`) as part of the RED→GREEN TDD flow.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Density/specification-sheet feel of INVENTORY | IV-02, IV-03 | Aesthetic/visual register judgment | Scroll to INVENTORY — does it read like a spec sheet, not a storefront? |
| Terminal instrument register of ACQUISITION | AQ-05 | Aesthetic/visual register judgment | Liquid Glass test — "Could this exist in an Apple consumer product?" — must be NO |
| Physical iOS Safari verification | All | Simulator limits | Test on physical iPhone, deferred to v1.5 launch gate (Phase 35) |

*Manual checks were completed during the 33-04 checkpoint:human-verify — user approved visual quality 2026-04-09.*

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify blocks
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references (none were missing — all tests scaffolded in 33-01)
- [x] No watch-mode flags (Playwright runs one-shot)
- [x] Feedback latency < 15s (~9s actual)
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-04-09 (reconstructed from State B artifacts, all tests running green)
