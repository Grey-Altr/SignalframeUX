---
phase: 34
slug: visual-language-subpage-redesign
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-08
---

# Phase 34 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Source: `.planning/phases/34-visual-language-subpage-redesign/34-RESEARCH.md` §Validation Architecture

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.x (`@playwright/test` from `devDependencies`) |
| **Config file** | `playwright.config.ts` (testDir `./tests`, chromium, headless, SwiftShader WebGL, clipboard permissions) |
| **Quick run command** | `npx playwright test tests/phase-34-visual-language-subpage.spec.ts` |
| **Full suite command** | `npx playwright test` |
| **Estimated runtime** | ~120 seconds (Phase 34 spec); ~5 minutes (full suite) |
| **Dev server** | Must be running on `http://localhost:3000` (Playwright `webServer: undefined`) |

---

## Sampling Rate

- **After every task commit:** Run `npx playwright test tests/phase-34-visual-language-subpage.spec.ts -g "{REQ-ID}"` — 10–60 seconds
- **After every plan wave:** Run `npx playwright test tests/phase-34-visual-language-subpage.spec.ts` — 2–5 minutes
- **Before `/pde:verify-work`:** `npx playwright test` full suite green + manual VL-04 screenshot verification
- **Max feedback latency:** 60 seconds per task

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 34-01-W0 | 01 | 0 | (Wave 0 setup) | infrastructure | `npx playwright test tests/phase-34-visual-language-subpage.spec.ts` | ❌ W0 | ⬜ pending |
| 34-01-VL06a | 01 | 1 | VL-06 | DOM | `npx playwright test -g "VL-06.*HUD format"` | ❌ W0 | ⬜ pending |
| 34-01-VL06b | 01 | 1 | VL-06 | DOM | `npx playwright test -g "VL-06.*active state"` | ❌ W0 | ⬜ pending |
| 34-01-VL06c | 01 | 1 | VL-06 | DOM | `npx playwright test -g "VL-06.*ARIA"` | ❌ W0 | ⬜ pending |
| 34-01-VL01a | 01 | 1 | VL-01 | source grep | `npx playwright test -g "VL-01.*caller count"` | ❌ W0 | ⬜ pending |
| 34-01-VL01b | 01 | 1 | VL-01 | DOM | `npx playwright test -g "VL-01.*deployment"` | ❌ W0 | ⬜ pending |
| 34-01-VL02 | 01 | 1 | VL-02 | DOM measure | `npx playwright test -g "VL-02"` | ❌ W0 | ⬜ pending |
| 34-01-VL05 | 01 | 1 | VL-05 | source grep | `npx playwright test -g "VL-05"` | ❌ W0 | ⬜ pending |
| 34-01-SP05a | 01 | 1 | SP-05 | source grep | `npx playwright test -g "SP-05.*hook"` | ❌ W0 | ⬜ pending |
| 34-01-SP05b | 01 | 1 | SP-05 | DOM | `npx playwright test -g "SP-05.*reveal"` | ❌ W0 | ⬜ pending |
| 34-01-VL04 | 01 | 1 | VL-04 | MANUAL | screenshot + 10% grid overlay | n/a | ⬜ pending |
| 34-02-SP01 | 02 | 2 | SP-01 | source fs | `npx playwright test -g "SP-01"` | ❌ W0 | ⬜ pending |
| 34-02-SP02a | 02 | 2 | SP-02 | DOM count | `npx playwright test -g "SP-02.*spacing"` | ❌ W0 | ⬜ pending |
| 34-02-SP02b | 02 | 2 | SP-02 | DOM count | `npx playwright test -g "SP-02.*type"` | ❌ W0 | ⬜ pending |
| 34-02-SP02c | 02 | 2 | SP-02 | DOM | `npx playwright test -g "SP-02.*color"` | ❌ W0 | ⬜ pending |
| 34-02-SP02d | 02 | 2 | SP-02 | DOM | `npx playwright test -g "SP-02.*motion"` | ❌ W0 | ⬜ pending |
| 34-03-SP03a | 03 | 2 | SP-03 | DOM | `npx playwright test -g "SP-03.*5 STEPS"` | ❌ W0 | ⬜ pending |
| 34-03-SP03b | 03 | 2 | SP-03 | DOM count | `npx playwright test -g "SP-03.*onboarding removed"` | ❌ W0 | ⬜ pending |
| 34-03-SP03c | 03 | 2 | SP-03 | DOM text | `npx playwright test -g "SP-03.*terminal line"` | ❌ W0 | ⬜ pending |
| 34-03-SP03d | 03 | 2 | SP-03 | DOM regex | `npx playwright test -g "SP-03.*coded indicator"` | ❌ W0 | ⬜ pending |
| 34-04-SP04a | 04 | 2 | SP-04 | DOM | `npx playwright test -g "SP-04.*page header"` | ❌ W0 | ⬜ pending |
| 34-04-SP04b | 04 | 2 | SP-04 | DOM | `npx playwright test -g "SP-04.*grouped index"` | ❌ W0 | ⬜ pending |
| 34-04-SP04c | 04 | 2 | SP-04 | DOM click | `npx playwright test -g "SP-04.*props table"` | ❌ W0 | ⬜ pending |
| 34-04-SP04d | 04 | 2 | SP-04 | DOM keyboard | `npx playwright test -g "SP-04.*keyboard"` | ❌ W0 | ⬜ pending |
| 34-04-SP04e | 04 | 2 | SP-04 | DOM input | `npx playwright test -g "SP-04.*search"` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/phase-34-visual-language-subpage.spec.ts` — create with RED state (all tests fail before implementation)
- [ ] Add `[data-ghost-label]`, `[data-init-step]`, `[data-spacing-token]`, `[data-type-sample]`, `[data-oklch-swatch]` data attributes to relevant components — selector contracts for the test file
- [ ] Confirm dev server can be started on `http://localhost:3000` for the test run
- [ ] No new framework install needed — Playwright 1.x already in devDependencies
- [ ] No visual regression infrastructure (Percy, Playwright snapshot, etc.) — VL-04 stays manual

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| THESIS section ≥ 40% intentional void | VL-04 | No visual regression infra; "intentional void" is a measurement of empty grid cells, not pixel-diff comparable | 1. `pnpm dev`. 2. Open `http://localhost:3000` at 1440×900. 3. Scroll to THESIS section, screenshot. 4. Overlay a 10% grid (10×10 cells = 100 cells). 5. Count cells with no glyph/element. 6. Pass if ≥40 empty cells. 7. Document count + screenshot in `34-VERIFICATION.md`. |
| SIGNAL section ≥ 40% intentional void | VL-04 | Same as above | Same procedure as THESIS. |
| Liquid Glass test (subjective register check) | VL-01..06, SP-01..04 | Subjective aesthetic judgment | At end of each plan, ask: "Could this section/subpage exist in an Apple-adjacent consumer product?" Must be **no**. Document verdict in `34-VERIFICATION.md`. |
| Density test | SP-01, SP-04 | Subjective layout judgment | Ask: "Could you add 20% more rows/items without the layout feeling overcrowded?" Must be **yes**. Document verdict in `34-VERIFICATION.md`. |
| Ghost label test | VL-01 | Subjective architectural judgment | For each ghost label placement, ask: "Could you remove this and lose part of the layout's structure?" Must be **yes**. Document each placement in `34-VERIFICATION.md`. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s per task
- [ ] `nyquist_compliant: true` set in frontmatter (after Wave 0 ships)

**Approval:** pending
