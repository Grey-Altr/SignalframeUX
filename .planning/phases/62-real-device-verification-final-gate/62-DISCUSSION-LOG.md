# Phase 62: Real-Device Verification + Final Gate - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-27
**Phase:** 62-real-device-verification-final-gate
**Mode:** `--auto` — all gray areas auto-resolved with recommended defaults; no AskUserQuestion calls.
**Areas discussed:** Plan/PR shape, VRF-01 device matrix, VRF-01 source, VRF-02 synthetic gate, VRF-03 motion contract, VRF-04 mid-milestone checkpoint, VRF-05 RUM aggregation, Carry-over absorption, AES-04 standing pixel-diff, Final-gate ratification artifacts.

---

## Plan/PR shape

| Option | Description | Selected |
|--------|-------------|----------|
| Single plan (everything bundled) | One PR covering all 5 VRF requirements + final-gate ratification | |
| 2 plans (real-device + synthetic-and-RUM) | Plan 01: VRF-01/04. Plan 02: VRF-02/03/05 + final-gate. RUM window blocks Plan 02 close. | |
| **3 plans (recommended)** | Plan 01: VRF-01 + VRF-04. Plan 02: VRF-02 + VRF-03. Plan 03: VRF-05 + AES-04 + Phase 60 SUMMARY ratification + final-gate. RUM 24h window forces this sequence. | ✓ |
| 5 plans (one per VRF) | Maximum granularity; over-fragmented for verification work | |

**Selection:** 3 plans (recommended).
**Notes:** VRF-05's mandatory ≥24h sampling window is the structural driver — it cannot be parallelized with launch-gate.ts runs because both want stable post-deploy state. Plan 03 must wait the window before declaring complete; this idle time absorbs Phase 60 SUMMARY ratification + AES-04 read-only pixel-diff naturally.

---

## VRF-01 device profile matrix

| Option | Description | Selected |
|--------|-------------|----------|
| **Roadmap-verbatim 3 profiles (recommended)** | iPhone 13/14 Safari + Galaxy A14 Chrome + mid-tier Android (e.g., Moto G Power 2024) | ✓ |
| Add iPhone SE + Pixel 7 (5 profiles) | Adds low-end Apple + high-end Android coverage | |
| Single-device representative (iPhone 13 only) | Already covered by Phase 60 D-07 mini-check; would not satisfy VRF-01 | |

**Selection:** Roadmap-verbatim 3 profiles.
**Notes:** ROADMAP success criterion 1 lists exactly these three profiles. No scope creep; matches REQUIREMENTS.md verbatim.

---

## VRF-01 source

| Option | Description | Selected |
|--------|-------------|----------|
| **WebPageTest free tier primary, BrowserStack fallback (recommended)** | Reads ROADMAP "WebPageTest JSON (or BrowserStack supplement)" wording as WPT-primary | ✓ |
| BrowserStack subscription required | Requires paid sub; overkill | |
| Hybrid 50/50 | Mixed source complicates JSON shape consistency | |

**Selection:** WPT free tier primary; BrowserStack only if a profile is unavailable on WPT free tier on measurement day.
**Notes:** WPT has all three target profiles in its public location matrix; zero paid-subscription cost; matches `feedback_lockin_before_execute.md` (use existing toolchain).

---

## VRF-02 synthetic gate

| Option | Description | Selected |
|--------|-------------|----------|
| **`launch-gate.ts` 5× median (recommended)** | Existing v1.7 PRF mechanism; 5 sequential runs; median across all 5 must hit 100/100 + LCP <1.0s + CLS=0 + TTI <1.5s | ✓ |
| 10× median (more variance discipline) | Diminishing returns past 5 runs; matches LHCI default of 5 | |
| Single run | Insufficient variance discipline; cold-start variance can falsely pass/fail | |

**Selection:** 5× median.
**Notes:** ROADMAP success criterion 2 verbatim. `scripts/launch-gate.ts` already exists and is the proven v1.7 PRF gate; output captured at `vrf-02-launch-gate-runs.json` (5-run array + computed median).

---

## VRF-03 motion contract

| Option | Description | Selected |
|--------|-------------|----------|
| **chrome-devtools MCP scroll-test against prod URL (recommended)** | End-to-end real-deploy verification; captures single-ticker, all SIGNAL effects render, reduced-motion collapses derived motion | ✓ |
| Programmatic Playwright spec only | Misses real DevTools Performance trace evidence; spec-DOM-shape pass ≠ working animation per `feedback_visual_verification.md` | |
| Manual visual review only | Insufficient evidence; no audit trail | |

**Selection:** chrome-devtools MCP scroll-test against prod URL.
**Notes:** Matches `feedback_visual_verification.md` (chrome-devtools MCP is the visual gate). Localhost has SwiftShader headless WebGL caveat (`playwright.config.ts:22-27`); prod-URL run reflects user reality.

---

## VRF-04 mid-milestone checkpoint

| Option | Description | Selected |
|--------|-------------|----------|
| **Synthesis MD doc reading VRF-01 JSON + Phase 60 D-07 (recommended)** | Single sign-off doc; per-device LCP/CLS/TTI medians vs gate; real-vs-synthetic divergence summary | ✓ |
| Re-run Phase 57 LCP diagnosis on real devices | Expensive; no payoff if VRF-01 JSON already shows pass | |
| Skip — Phase 60 D-07 mini-check is sufficient | Violates Pitfall #10 + ROADMAP success criterion 4 | |

**Selection:** Synthesis MD doc.
**Notes:** `feedback_lockin_before_execute.md` — extract from shipped data, no fresh discovery; this is a synthesis layer, not a re-measurement. Output at `.planning/perf-baselines/v1.8/MID-MILESTONE-CHECKPOINT.md`.

---

## VRF-05 RUM aggregation

| Option | Description | Selected |
|--------|-------------|----------|
| **`vercel logs` CLI + local aggregator script (recommended)** | Zero new runtime dep; reads Phase 58 `console.log` output from `/api/vitals` | ✓ |
| Add Vercel Analytics SaaS dep | Violates milestone "no new runtime npm dependencies" rule | |
| Add Sentry Performance SDK | Same — runtime-dep violation | |
| Bake an in-app aggregator into `/api/vitals/route.ts` (Vercel KV/Blob) | Storage choice adds runtime dep + ongoing cost | |

**Selection:** `vercel logs` CLI + local aggregator (`scripts/v1.8-rum-aggregate.ts` as devDep tooling).
**Notes:** Phase 58 CIB-05 already ships web-vitals to `/api/vitals` → `console.log` → Vercel logs. Aggregation script computes p75 LCP locally; output JSON at `.planning/perf-baselines/v1.8/vrf-05-rum-p75-lcp.json`. Sample-count floor ≥100 for statistical validity.

---

## Carry-over absorption

| Option | Description | Selected |
|--------|-------------|----------|
| Absorb everything (incl. Phase 58 GitHub repo-settings) | Violates user-action boundary; cannot auto-attempt repo-settings | |
| **Absorb Phase 60 SUMMARY ratification; surface Phase 58 HUMAN-UAT (read-only) (recommended)** | Closes the deferred SUMMARY ratification cleanly; surfaces user-only items in FINAL-GATE.md without blocking | ✓ |
| Leave all carry-overs separate (zero absorption) | Forces a free-floating Phase 60.1 just for SUMMARY ratification; messy milestone close | |

**Selection:** Absorb Phase 60 SUMMARY ratification; surface Phase 58 HUMAN-UAT cross-check (read-only).
**Notes:** STATE.md `last_activity` notes Phase 60 SUMMARY ratification still deferred. Plan 03 closes this. Phase 58 GitHub repo-settings (branch protection + LHCI required check) remain user-only actions per `feedback_pde_milestone_complete_help_arg.md` discipline.

---

## AES-04 standing pixel-diff

| Option | Description | Selected |
|--------|-------------|----------|
| **Read-only AES-04 pixel-diff at phase end (20 surfaces, MAX_DIFF_RATIO 0.005) (recommended)** | Reuses Phase 61 calibration; 4 viewports × 5 pages = 20 surfaces; baselines at `.planning/visual-baselines/v1.8-start/` | ✓ |
| Skip AES-04 (no code shipping) | Violates AES-04 standing rule (every phase, every close-out) | |
| Re-baseline AES-04 at Phase 62 | Violates AES-02 (no Chromatic re-baseline for perf changes) | |

**Selection:** Read-only AES-04 pixel-diff.
**Notes:** AES-04 is a standing rule per AESTHETIC-OF-RECORD.md. Final close-out should re-confirm zero aesthetic drift across cumulative v1.8 work. Output at `vrf-aes04-final.json`.

---

## Final-gate ratification artifacts

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal (FINAL-GATE.md only) | Insufficient for milestone close — `complete-milestone` workflow expects a milestone-summary handoff | |
| **Full set: MID-MILESTONE-CHECKPOINT.md + FINAL-GATE.md + 62-VERIFICATION.md + milestone-summary handoff (recommended)** | Matches v1.7 Phase 56 close pattern; ensures `/pde:complete-milestone v1.8` runs cleanly | ✓ |
| Full set + cross-milestone trend dashboard | Trend dashboard is v1.9 scope; not Phase 62's job | |

**Selection:** Full set matching Phase 56 close pattern.
**Notes:** Phase 56 v1.7 final-gate is the proven template. `MILESTONE-SUMMARY.md` lands in `.planning/milestones/v1.8/` so the v1.8 archive is ready for `/pde:complete-milestone v1.8` (literal version per `feedback_pde_milestone_complete_help_arg.md`).

---

## Claude's Discretion

- Exact `scripts/v1.8-rum-aggregate.ts` JSON shape (extra percentiles beyond p75; per-viewport / per-device / per-page breakdowns).
- Plan 01 commit-split granularity (per-device vs single-matrix-commit).
- VRF-03 chrome-devtools MCP step sequence (scroll positions, video vs stills).
- Plan 03 sequencing of AES-04 pixel-diff vs RUM window wait (parallel-safe; either order acceptable).

## Deferred Ideas

- Sentry Performance / Vercel Analytics SaaS RUM (post-v1.8).
- Programmatic VRF-03 motion contract spec.
- 5+ device profile matrix (iPhone SE, Pixel 7).
- BrowserStack subscription.
- Auto-running launch-gate.ts in CI on prod deploy.
- Phase 58 GitHub repo-settings (remain user-only).
- AES-04 pixel-diff CI gate automation.
- Cross-milestone perf trend dashboard (v1.9+).

---

*End of discussion log.*
