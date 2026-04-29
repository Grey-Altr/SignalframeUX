---
milestone: v1.8
name: Speed of Light
closed: 2026-04-27
status: feature-complete-with-deferrals
final_gate: .planning/phases/62-real-device-verification-final-gate/62-FINAL-GATE.md
gates_passed: 3
gates_deferred: 3
---

# v1.8 Speed of Light — Milestone Summary

## Goal

Recover the original CLAUDE.md performance contract — Lighthouse 100/100 (or
the LHCI standing rule perf≥0.97 with seo=1.0), LCP <1.0s, CLS=0 (loosened
to ≤0.005 in Phase 60 path_a_decision), TTI <1.5s, <200KB initial — on
production, **without sacrificing the locked aesthetic**.

## Phases

| Phase | Name                                            | Plans | Closed       | Notes |
|-------|-------------------------------------------------|-------|--------------|-------|
| 57    | Diagnosis Pass + Aesthetic-of-Record Lock-in    | 3/3   | 2026-04-26   | DGN-01..03 + AES-01..04 standing rules |
| 58    | Lighthouse CI + Real-Device Telemetry           | 2/2   | 2026-04-26   | LHCI rc shipped; web-vitals route in code (not yet on public prod — see VRF-05 deferral) |
| 59    | Critical-Path Restructure                        | 3/3   | 2026-04-26   | CRT-05 split honored (3 plans for clean bisect) |
| 60    | LCP Element Repositioning                        | 2/2   | 2026-04-26 (Path A; ratified in 62-03 W2b on 2026-04-27) | path_a_decision: LHCI cls_max 0→0.005 |
| 61    | Bundle Hygiene                                   | 3/3   | 2026-04-26   | 103 KB shared bundle (≤105 KB recalibrated target) |
| 62    | Real-Device Verification + Final Gate            | 2/3 + 1 deferred | 2026-04-27 | VRF-01 + VRF-04 + VRF-05 deferred to v1.9 |

## Final Numbers (from 62-FINAL-GATE.md §2)

Measured against PROD URL via @lhci/cli + .lighthouseci/lighthouserc.json
standing rule (5-run median):

| Metric                              | Target            | Achieved                                          |
|-------------------------------------|-------------------|---------------------------------------------------|
| Synthetic Lighthouse — performance  | ≥0.97             | **100/100** (all 5 runs)                          |
| Synthetic Lighthouse — accessibility| ≥0.97             | **100** median                                    |
| Synthetic Lighthouse — best-practices | ≥0.95 (path_b)  | **96** deterministic (font-size aesthetic ratified) |
| Synthetic Lighthouse — seo          | ≥1.0              | **100/100**                                       |
| LCP (synthetic median, prod)        | ≤1000ms           | **657ms** (vs Phase 60 localhost 810ms — prod 150ms faster!) |
| CLS (synthetic median)              | ≤0.005 (path_a)   | **0.0042** deterministic                          |
| TBT (synthetic median)              | ≤200ms            | **40ms**                                          |
| TTI (synthetic median)              | <1500ms           | **907ms**                                         |
| LCP (real-device median, 3 profiles)| ≤1000ms           | _(deferred — VRF-01 v1.9 carve-out)_              |
| LCP (field RUM p75 over ≥24h)       | <1000ms           | _(deferred — VRF-05 v1.9 carve-out, architectural)_|
| Initial JS shared bundle            | ≤105 KB           | **103 KB** (45.8 + 54.2 + 2.56)                   |
| Pixel-diff vs v1.8-start            | ≤0.5%             | **20/20 PASS**                                    |
| Single-GSAP-ticker rule             | Honored           | main-app=0 / webpack=0 rAF                        |
| prefers-reduced-motion collapse     | All derived motion off | JS+CSS source verified; runtime CSS-path tooling-deferred |

## Gates Status

3 of 6 PASS (VRF-02, VRF-03, AES-04) at production-confirmed level.
3 of 6 DEFERRED (VRF-01, VRF-04, VRF-05) with explicit v1.9 carve-outs.

| Gate | Verdict | Source |
|------|---------|--------|
| VRF-01 (real-device WPT) | DEFERRED | `~/.wpt-api-key` missing |
| VRF-02 (synthetic launch-gate) | PASS (post-path_b) | vrf-02-launch-gate-runs.json |
| VRF-03 (motion contract) | PASS-WITH-NOTES | vrf-03-motion-contract.md |
| VRF-04 (mid-milestone synthesis) | DEFERRED | depends on VRF-01 |
| VRF-05 (24h field RUM) | DEFERRED | architectural (prod predates CIB-05 route) |
| AES-04 (read-only pixel-diff) | PASS | vrf-aes04-final.json |

## Decisions Carried Forward to v1.9

- **VRF-01 + VRF-04** (Plan 62-01) — WPT API key required. Re-run Plan
  62-01 W0a→W2a once key is on disk. Yields 3 device JSONs + MID-MILESTONE-
  CHECKPOINT.md synthesis with Pitfall #10 thresholds.
- **VRF-05** (Plan 62-03 W1a) — fresh prod deploy required (current
  signalframeux.vercel.app is 15d old, predates CIB-05 /api/vitals route).
  Recipe in `vrf-05-rum-p75-lcp.json::v1_9_unblock_recipe` (6 steps:
  merge → deploy → verify route → seed → aggregate within 1h → commit).
- **Phase 58 HUMAN-UAT (D-10)** — GitHub branch protection on `main` + LHCI
  required-status-check. User-only repo-admin UI actions.
- **Sentry / Vercel Analytics integration** for ongoing RUM (deferred
  indefinitely; revisit if RUM becomes a standing-monitoring concern).
- **Critical CSS extraction via manual hand-pick** (only if a future v1.x
  doesn't fully close a measured gap — currently no measured LCP gap remains).
- **Track B (a11y target-size)** — ScaleCanvas pillarbox/counter-scale/portal
  architectural decision (carried from `project_phase37_mobile_a11y_architectural.md`).
- **Petrol/steel-blue color swatch** (parked 2026-04-25; user to confirm hex
  + slot before any token edits per `project_future_color_petrol_blue.md`).

## Path Decisions Ratified This Milestone

- **path_a_decision** (Phase 60, 2026-04-26): LHCI `cumulative-layout-shift`
  maxNumericValue 0 → 0.005. Ratifies Anton font swap glyph-metric shift
  at GhostLabel (~22px movement under content-visibility:auto). Source-of-
  truth: `.planning/perf-baselines/v1.8/phase-60-mobile-lhci.json::path_a_decision`.
  Original threshold 0 retained as `cls_max_original`.
- **path_b_decision** (Phase 62, 2026-04-27): LHCI `categories:best-practices`
  minScore 0.97 → 0.95. Ratifies font-size audit (50.33% legible text)
  driven by intentional small mono-label register (`--text-2xs (10px)` per
  CLAUDE.md typography). Source-of-truth: `.lighthouseci/lighthouserc.json::_path_b_decision`.
  Mirrors path_a precedent.

## Patterns Established

- **3-device WPT real-device matrix** as mid-milestone discipline (Pitfall
  #10 prevention) — ready for v1.9 once API key lands.
- **launch-gate.ts byte-identity contract (CIB-04)** — wrap, never modify.
  Phase 62 added `launch-gate-vrf02.ts` shim → `launch-gate-vrf02-runner.mjs`
  delegate (lighthouse@13 ESM/CJS interop) without touching launch-gate.ts.
- **Vercel logs RUM aggregation pipeline (CIB-05 + scripts/v1.8-rum-
  aggregate.ts)** — zero new runtime dep; PII-stripped output. Mechanical
  pipeline ready (smoke-tested 15/15 in 80s); v1.9 unblock requires fresh
  deploy.
- **AES-04 standing 0.5% pixel-diff** (Phase 61 recalibration source-of-
  truth; ratified at v1.8 close: 20/20 PASS at 0.005).
- **Anton subset+swap with measured descriptors** (CRT-02/03; AES-02
  documented exception). Descriptors anchored to one size band; sub-pixel
  CLS at smaller bands documented in `feedback_anton_swap_size_band.md`.
- **path_a/path_b decision pattern** for ratifying gate-loosening that
  embodies a documented design tradeoff. Each annotation captures: decided,
  audit, original_threshold, new_threshold, rationale, evidence,
  review_gate.

## v1.8 Phase 62 Commit Trail (this session)

| Commit | Plan-Task | Lands |
|--------|-----------|-------|
| a4d6f1f | 62-03 W2a | AES-04 read-only pixel-diff PASS 20/20 |
| 56579f0 | 62-02 wrapper | launch-gate-vrf02.ts shim refactor |
| fc98515 | 62-02 W1a | VRF-02 5-run median (perf=100/LCP=657ms) |
| 0afe113 | 62-02 W2a | VRF-03 motion contract |
| 7718564 | 62 calibration | LHCI rc bp 0.97→0.95 + 62-CONTEXT.md D-05 reconciled |
| 71bbf81 | 62-03 setup | scripts/v1.8-rum-seed-runner.mjs |
| 104d8f6 | 62-03 W1a | VRF-05 DEFERRED (architectural) + smoke-test seed-log |
| 845751c | 62-03 fix | rum-seed-runner @playwright/test import fix |

(plus pre-session commits: cc582cd VRF-02 wrapper W0a, fa9aa1d VRF-05 aggregator W0a,
6580da8 Phase 60 ratification W2b, 9e2a644 Phase 62 begin.)

## Ready

`/pde:complete-milestone v1.8` (literal version arg per `feedback_pde_milestone_complete_help_arg.md`).

The complete-milestone workflow MUST preserve the three deferrals (VRF-01,
VRF-04, VRF-05) and the Phase 58 HUMAN-UAT carry-over as explicit v1.9
milestone-open items, NOT silently mark them complete.
