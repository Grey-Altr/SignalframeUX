---
phase: 32
slug: signal-proof-sections
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-08
---

# Phase 32 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.59.x |
| **Config file** | `playwright.config.ts` |
| **Quick run command** | `pnpm exec playwright test tests/phase-32-signal-proof.spec.ts --reporter=list` |
| **Full suite command** | `pnpm exec playwright test --reporter=list` |
| **Estimated runtime** | ~20 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm exec playwright test tests/phase-32-signal-proof.spec.ts --reporter=list`
- **After every plan wave:** Run `pnpm exec playwright test --reporter=list`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 20 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 32-01-01 | 01 | 1 | PR-01 | — | N/A | e2e | `pnpm exec playwright test -g "PROOF section exists"` | ❌ W0 | ⬜ pending |
| 32-01-02 | 01 | 1 | PR-02 | — | N/A | e2e | `pnpm exec playwright test -g "PROOF pointer interaction"` | ❌ W0 | ⬜ pending |
| 32-01-03 | 01 | 1 | PR-03 | — | N/A | e2e | `pnpm exec playwright test -g "PROOF layer separation visible"` | ❌ W0 | ⬜ pending |
| 32-01-04 | 01 | 1 | PR-04 | — | N/A | e2e | `pnpm exec playwright test -g "PROOF stats data points"` | ❌ W0 | ⬜ pending |
| 32-01-05 | 01 | 1 | PR-05 | — | N/A | manual | Chrome DevTools MCP — touch drag on 375px viewport | — | ⬜ pending |
| 32-01-06 | 01 | 1 | PR-06 | — | N/A | e2e | `pnpm exec playwright test -g "PROOF reduced-motion static split"` | ❌ W0 | ⬜ pending |
| 32-02-01 | 02 | 2 | SG-01 | — | N/A | e2e | `pnpm exec playwright test -g "SIGNAL section full-viewport"` | ❌ W0 | ⬜ pending |
| 32-02-02 | 02 | 2 | SG-02 | — | N/A | manual | Chrome DevTools MCP — scroll SIGNAL, observe parallax | — | ⬜ pending |
| 32-02-03 | 02 | 2 | SG-03 | — | N/A | e2e | `pnpm exec playwright test -g "SIGNAL reduced-motion static"` | ❌ W0 | ⬜ pending |
| 32-02-04 | 02 | 2 | SG-04 | — | N/A | e2e | `pnpm exec playwright test -g "SIGNAL section scroll distance"` | ❌ W0 | ⬜ pending |
| 32-02-05 | 02 | 2 | SG-05 | — | N/A | manual | Chrome DevTools MCP — verify no text competing with shader | — | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/phase-32-signal-proof.spec.ts` — stubs for PR-01, PR-02, PR-03, PR-04, PR-06, SG-01, SG-03, SG-04
- [ ] Existing Playwright infrastructure covers framework — no new install needed

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| SIGNAL parallax canvas movement | SG-02 | Shader canvas transform cannot be reliably verified headless | 1. Open localhost:3000 2. Scroll into SIGNAL 3. Confirm canvas translateY changes with scroll 4. Confirm atmospheric feel |
| PROOF touch drag on mobile | PR-05 | Pointer event → --signal-intensity requires real touch | 1. Chrome DevTools MCP emulate 375px 2. Drag across PROOF 3. Confirm layers visibly separate in real time |
| SIGNAL no competing text | SG-05 | Visual judgment call | 1. Open SIGNAL section 2. Confirm zero text elements visible (or ≤1 monospaced data point) |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 20s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
