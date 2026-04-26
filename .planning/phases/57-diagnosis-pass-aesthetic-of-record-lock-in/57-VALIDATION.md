---
phase: 57
slug: diagnosis-pass-aesthetic-of-record-lock-in
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-25
---

# Phase 57 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Source: `57-RESEARCH.md` §Validation Architecture (lines 449-483).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright `^1.59.1` |
| **Config file** | `playwright.config.ts` (already exists, no edits needed) |
| **Quick run command** | `pnpm exec playwright test tests/v1.8-baseline-capture.spec.ts --project=chromium` |
| **Full suite command** | `pnpm exec playwright test` |
| **Build target** | `pnpm build && pnpm start` (production) — NOT `pnpm dev` |
| **Estimated runtime** | ~30 seconds for the v1.8 baseline-capture spec; ~10 seconds for the LCP-diagnosis spec |

---

## Sampling Rate

- **After every task commit:** No automated sampling — Phase 57 is documentation-heavy, not runtime-changing. Run the new specs once to seed artifacts, then commit.
- **After every plan wave:** Run the wave's specs once and visually inspect outputs.
  - Baseline capture wave: `pnpm exec playwright test tests/v1.8-baseline-capture.spec.ts --project=chromium --update-snapshots` must succeed; verify `.planning/visual-baselines/v1.8-start/` contains 20 PNGs.
  - LCP diagnosis wave: `pnpm exec playwright test tests/v1.8-lcp-diagnosis.spec.ts --project=chromium` must succeed; verify JSON evidence is captured.
  - Bundle analyzer wave: `rm -rf .next && ANALYZE=true pnpm build` must succeed; verify `.next/analyze/client.html` exists.
- **Before `/pde:verify-work`:** All 20 baseline PNGs present; both diagnosis docs committed (`v1.8-lcp-diagnosis.md` + `AESTHETIC-OF-RECORD.md`).
- **Max feedback latency:** ~60 seconds (single Playwright spec run).

---

## Per-Task Verification Map

| Req ID | Behavior | Test Type | Automated Command | File Exists | Status |
|--------|----------|-----------|-------------------|-------------|--------|
| DGN-01 | LCP element identity captured for `/` at 360 mobile + 1440 desktop with `PerformanceObserver` evidence | integration | `pnpm exec playwright test tests/v1.8-lcp-diagnosis.spec.ts --project=chromium` | ❌ Wave 0 | ⬜ pending |
| DGN-02 | Per-chunk attribution table for `3302`, `e9a6067a`, `74c6194b`, `7525` (or current equivalents) | manual-only | `rm -rf .next && ANALYZE=true pnpm build` then human reads `.next/analyze/client.html` | n/a | ⬜ pending |
| DGN-03 | 20 baseline PNGs at `.planning/visual-baselines/v1.8-start/` (5 routes × 4 viewports) | integration | `pnpm exec playwright test tests/v1.8-baseline-capture.spec.ts --project=chromium --update-snapshots` | ❌ Wave 0 | ⬜ pending |
| AES-01 | `.planning/codebase/AESTHETIC-OF-RECORD.md` exists, ~150 lines, cites LOCKDOWN.md + token paths + trademark primitives | smoke | `test -f .planning/codebase/AESTHETIC-OF-RECORD.md && grep -cE "LOCKDOWN.md\|app/globals.css\|trademark" .planning/codebase/AESTHETIC-OF-RECORD.md` (expect ≥3) | n/a | ⬜ pending |
| AES-02 | Standing rule documented: no Chromatic re-baseline for perf changes (Anton optional-swap exception) | smoke | `grep -i "no.*re-baseline\\|optional.*swap" .planning/codebase/AESTHETIC-OF-RECORD.md` (expect ≥1 match) | n/a | ⬜ pending |
| AES-03 | Standing rule documented: cohort review post-Phase-60 against v1.8-start baselines | smoke | `grep -i "cohort review\\|external eye" .planning/codebase/AESTHETIC-OF-RECORD.md` (expect ≥1 match) | n/a | ⬜ pending |
| AES-04 | Standing rule documented: per-phase pixel-diff <=0.5% vs v1.8-start; reusable Playwright harness seeded | smoke + harness | `grep -i "0\\.5%\\|pixel-diff" .planning/codebase/AESTHETIC-OF-RECORD.md` AND `tests/v1.8-baseline-capture.spec.ts` exists | partial Wave 0 | ⬜ pending |

*Status legend: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/v1.8-baseline-capture.spec.ts` — implements DGN-03 (5 routes × 4 viewports = 20 screenshots). Reuses `tests/phase-35-homepage.spec.ts` viewport+reducedMotion patterns. Must include `await page.evaluate(() => document.fonts.ready)` and explicit `document.fonts.load('700 100px Anton')` to force warm-state font load before screenshot (mitigates Anton `display: optional` non-determinism per RESEARCH §Q1).
- [ ] `tests/v1.8-lcp-diagnosis.spec.ts` — implements DGN-01 LCP identity capture per viewport. Reuses `tests/phase-35-lcp-homepage.spec.ts` PerformanceObserver pattern. Captures LCP element selector + dimensions for both **cold** (no font preload) and **warm** (after `document.fonts.load`) states. Output: JSON written to `.planning/codebase/v1.8-lcp-evidence.json` (or piped inline into `v1.8-lcp-diagnosis.md` — planner picks integration shape).
- [ ] `.planning/visual-baselines/v1.8-start/` directory — Playwright spec creates on first `--update-snapshots` run.
- [ ] No framework install needed; no `conftest.py` equivalent (Playwright doesn't require shared fixtures for this scope).
- [ ] No new dependencies (per CONTEXT D-04).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Per-chunk attribution table accuracy | DGN-02 | `@next/bundle-analyzer` emits HTML — human reads the visualization to extract chunk → package mapping. No JSON artifact per CONTEXT D-04. | 1) `rm -rf .next && ANALYZE=true pnpm build`. 2) Open `.next/analyze/client.html`. 3) Hover/click each of `3302`, `e9a6067a`, `74c6194b`, `7525` (or note "no match found" — chunk IDs may have shifted from v1.7 per RESEARCH finding). 4) For each, list top 3 packages by size + total chunk size. 5) Write table inline in `v1.8-lcp-diagnosis.md`. |
| AESTHETIC-OF-RECORD.md citation integrity | AES-01 | Verifying every aesthetic claim cites LOCKDOWN.md or `app/globals.css` is a semantic check, not a syntactic one. | Read `.planning/codebase/AESTHETIC-OF-RECORD.md` end-to-end. For each rule statement, confirm an inline citation pointing to LOCKDOWN.md §X.X or `app/globals.css` line/token name or a trademark primitive file path. Flag any uncited claim. |
| Cold-vs-warm Anton baseline state | DGN-03 + AES-04 | RESEARCH §Q1 + Q3: Anton `display: optional` may not paint on cold visit. Determining which state the captured baseline represents requires inspecting the captured PNG. | After first baseline-capture run, open `.planning/visual-baselines/v1.8-start/[route]-mobile-360.png` for `/` and verify the hero `<h1>` shows Anton-styled text (not fallback Inter). If fallback shows, the spec needs an explicit `document.fonts.load('700 100px Anton')` before screenshot. Document the captured state in AESTHETIC-OF-RECORD.md. |
| LCP element identity verification | DGN-01 | The LCP candidate element on a real device may differ from headless SwiftShader. Phase 57 captures the SwiftShader baseline as the canonical CI reference; real-device verification is Phase 62. | Run the diagnosis spec, inspect the captured selector + dimensions JSON, confirm it matches a known DOM node by reading the source file:line cited in the JSON. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies (Playwright spec creation)
- [ ] Sampling continuity: Phase 57 has only 7 reqs; manual-only verifications for DGN-02 and AES-01 are intentional per CONTEXT D-04 + nature of doc deliverables
- [ ] Wave 0 covers all MISSING references (the two new specs)
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter once Wave 0 specs exist and pass once

**Approval:** pending

---

## Open Questions for Plan-Phase

These are flagged in `57-RESEARCH.md` §Open Questions and should be resolved during planning, not deferred to execution:

1. **Q1 (Anton cold/warm state):** Planner picks one of:
   - (a) Force warm-state via `document.fonts.load(...)` for ALL baseline images (recommended — deterministic);
   - (b) Capture cold-state separately for diagnosis only;
   - (c) Capture both per route (40 PNGs, not 20 — out of CONTEXT D-03 spec).
   - Recommendation: (a). Document the choice in AESTHETIC-OF-RECORD.md.
2. **Q2 (SwiftShader vs real-GPU):** Already resolved — accept SwiftShader as canonical CI baseline; real-GPU = AES-03 cohort review.
3. **Q3 (`document.fonts.ready` vs hero opacity-0.01):** Planner verifies via one-shot probe of captured PNG. If hero chars are at 0.01 opacity in the baseline, document this in AESTHETIC-OF-RECORD.md as the "captured state" definition. The reduced-motion path (`page.emulateMedia({ reducedMotion: "reduce" })`) likely short-circuits the GSAP reveal — this is desirable for baseline determinism but defines the captured state as "reduced-motion variant."

---

*Phase: 57-diagnosis-pass-aesthetic-of-record-lock-in*
*Validation strategy created: 2026-04-25*
