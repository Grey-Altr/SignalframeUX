---
phase: 67-bundle-barrel-optimization-d-04-unlock
plan: 02
captured: 2026-04-30
d06_branch: A_RETIRE
homepage_gzip_kb: 187.6
budget_kb: 200
status: PASS
---

# 67-02 Final Gate — BND-05, BND-06, BND-07 + AES-04

**Plan:** 67-02
**Phase:** 67 — Bundle Barrel-Optimization (D-04 Unlock)
**Captured:** 2026-04-30
**Source plans:** 67-01 (reshape — BND-05 + BND-07 doc gate), 67-02 (re-lock + spec gate — BND-06 + BND-07 spec/LHCI half)
**D-06 outcome ladder branch:** **A_RETIRE** (homepage 187.6 KB ≤ 200 KB)
**Final next.config.ts state:** `optimizePackageImports: ["lucide-react", "radix-ui", "input-otp", "cmdk", "vaul", "sonner", "react-day-picker", "@/components/sf"]` (8 entries; v1.8 set + Phase 67 Vector 1)
**Build invocation contract:** `rm -rf .next/cache .next && pnpm build` (BND-04 stale-chunk guard mandatory; D-10 standing rule)
**Gating source:** `tests/v1.8-phase63-1-bundle-budget.spec.ts` reads `.next/app-build-manifest.json` `pages["/page"]`, gzip-compresses each chunk in memory, sums bytes (canonical BND-06 measurement methodology)

---

## §1 — 4-Way Scorecard

| Requirement | Verdict | Evidence |
| ----------- | ------- | -------- |
| **BND-05** (D-04 lock break + re-lock; new chunk-ID baseline locked in successor doc) | **PASS** | `.planning/codebase/v1.9-bundle-reshape.md` §2a authored (5 v1.8 chunks PRESERVED + 6 DISSOLVED + 6 NEW chunks documented); `next.config.ts` D-04 lock comment rewritten to cite Phase 67 unlock + new lock state (Plan 01 commit `9f3e3bf`). `optimizePackageImports` array updated to 8 entries. |
| **BND-06** (homepage `/` First-Load JS gzip ≤200 KB OR documented outcome-ladder ratification) | **PASS** | Task 0 `/tmp/67-budget-final-plan02.log` measurement: **187.6 KB gzip** (12.4 KB UNDER 200 KB target). D-06 outcome ladder Branch A applied: `_path_k_decision` retired entirely; `tests/v1.8-phase63-1-bundle-budget.spec.ts:22` `BUDGET_BYTES = 200 * 1024` (CLAUDE.md hard constraint restored). Spec test green at 187.6 KB < 200 KB. Plan 02 Task 1 commit `634984a`. |
| **BND-07** (new chunk-ID baseline + LHCI/spec re-tighten) | **PASS** | Doc half: Plan 01 `9f3e3bf` (`.planning/codebase/v1.9-bundle-reshape.md` §2a 5-PRESERVED + §2b 6-NEW chunk inventory). Spec half: Plan 02 `634984a` (`tests/v1.8-phase63-1-bundle-budget.spec.ts` BUDGET_BYTES restored to 200 KB; `_path_k_decision` block deleted entirely). LHCI half: §3 below records `unchanged` verdict (RESEARCH §LHCI Threshold Analysis: no bundle-size-specific gate; discretionary tightening declined). |
| **AES-04** (≤0.5% per page across 5 routes × 4 viewports) | **PASS** | `tests/v1.9-phase67-aes04.spec.ts` final phase-end run against fresh Plan-02 build: **20/20 PASS** (10 strict desktop+ipad ≤0.5% vs `.planning/visual-baselines/v1.8-start/`; 10 cohort mobile+iphone vs `.planning/visual-baselines/v1.9-pre/` with dimensional drift tolerated per Phase 66 ARC-02 pillarbox precedent). Zero DIFF artifacts emitted. Log: `/tmp/67-aes04-final.log`; summary: `/tmp/67-aes04-final-summary.txt`. |

**Phase 67 verdict: ALL 4 GATES PASS.** Plan 02 closes BND-06 + BND-07. BND-05 closed in Plan 01.

---

## §2 — Per-vector outcome ledger

(From `.planning/codebase/v1.9-bundle-reshape.md` §1 + `/tmp/67-vector-deltas.txt`.)

| Vector | Action | Pre KB gz | Post KB gz | Delta KB gz | D-02 floor (≥2 KB) | AES-04 | Status |
| ------ | ------ | --------- | ---------- | ----------- | ------------------ | ------ | ------ |
| **V1** | `@/components/sf` to `optimizePackageImports` + DCE `SFScrollArea`/`SFNavigationMenu` barrel exports | 258.9 | 187.6 | -71.3 | PASS | PASS 20/20 | **COMMITTED** (`c35544e`) |
| **V2** | PageAnimations `next/dynamic({ ssr: false })` wrap | 187.6 | 187.6 | 0.0 | FAIL | N/A — no mutation | SKIPPED at D-02 floor (revert) |
| **V3** | TooltipProviderLazy hydration-gated wrapper | 187.6 | 187.6 | 0.0 | FAIL | N/A — no mutation | SKIPPED at D-02 floor (V1 already dissolved chunk 7525) |
| **TOTAL** | — | 258.9 | 187.6 | **-71.3** | — | PASS 20/20 (V1) + 20/20 (final) | **27.5% homepage gzip reduction** |

**Final homepage `/` First-Load JS:** 187.6 KB gzip (12.4 KB UNDER CLAUDE.md 200 KB hard target).

V2/V3 SKIP rationale recorded in detail at `.planning/codebase/v1.9-bundle-reshape.md` §1 (PF-04 contract surface for V2; V1-already-dissolved-chunk-7525 for V3). Both vectors reverted cleanly per D-02 cost/risk floor; no orphan files in working tree.

---

## §3 — LHCI threshold review

**Decision:** **unchanged**

**Rationale:**

Per `.planning/phases/67-bundle-barrel-optimization-d-04-unlock/67-RESEARCH.md` §"LHCI Threshold Analysis" (line 286-287):

> "No LHCI threshold directly measures First Load JS gzip size. Plan 02 does NOT need to modify LHCI thresholds for BND-06 compliance — the bundle-budget spec is the gate. However, if the bundle reshape significantly reduces TBT (by removing heavy eager chunks), the `_path_e_decision` 700ms TBT threshold could be tightened as a bonus. This is **discretionary**."

The current `.lighthouseci/lighthouserc.json` thresholds (current state inspected at Plan 02 close):

| Audit | Threshold | Origin |
| --- | --- | --- |
| `categories:performance` minScore | 0.85 | `_path_e_decision` (preview-LHCI mobile only; absorbs Vercel preview CPU-class artifact) |
| `categories:accessibility` minScore | 0.97 | Standing |
| `categories:best-practices` minScore | 0.95 | `_path_b_decision` |
| `largest-contentful-paint` maxNumericValue | 1500ms | `_path_f_decision` (preview-LHCI variance) |
| `cumulative-layout-shift` maxNumericValue | 0.005 | `_path_a_decision` (Phase 60 Anton swap residual) |
| `total-blocking-time` maxNumericValue | 700ms | `_path_e_decision` |

**Why no tightening this phase:**

1. **`_path_e_decision` is preview-environment-specific.** Per the decision block rationale: "different CPU class than prod fleet, different region routing, different cache warmth." A 71.3 KB JS reduction will reduce real-device TBT, but the 700ms preview-LHCI gate accommodates Vercel preview infrastructure variance — not the actual app workload. Tightening preview gates without preview LHCI re-runs would risk false-fail on infrastructure noise. Per `feedback_lhci_preview_artifacts.md`, preview LHCI gates are "inherently artifact-prone for perf/TBT."
2. **No bundle-size-specific gate exists.** LHCI does not directly assert First Load JS gzip; the `tests/v1.8-phase63-1-bundle-budget.spec.ts` spec is the BND-06 gate, and it has been mutated this plan. Re-tightening LHCI redundant.
3. **`_path_e_decision` `review_gate` references a milestone-close prod gate** (`scripts/launch-gate-runner.mjs`), not Phase 67. Tightening preview thresholds without a corresponding prod-baseline run would couple Phase 67 to a future milestone-close gate that is out of scope here.
4. **Discretionary per RESEARCH.** No LHCI mutation is mandatory for BND-06 closure; the bundle-budget spec handles BND-06 directly (now PASS at 200 KB).

**No mutation to `.lighthouseci/lighthouserc.json` in this plan.** File parses as valid JSON (`python3 -c "import json; json.load(open('.lighthouseci/lighthouserc.json'))"` exits 0). LHCI re-tightening deferred to a future phase that runs prod LHCI vs preview LHCI baseline comparison (likely v1.9 close-out or v2.0 milestone-launch gate).

**Carry-forward:** If a future phase runs prod LHCI against `https://signalframe.ux` and finds TBT consistently <500ms post-Phase-67 (vs the 578ms preview baseline that drove `_path_e_decision`), that phase MAY tighten `total-blocking-time.maxNumericValue` from 700ms → 500ms with a `_path_X_decision` block citing Phase 67 71.3 KB reshape evidence.

---

## §4 — FALSE-PASS GUARD

(Per Phase 61 precedent; mandatory honest-readout of measurement integrity.)

| Guard | Status | Evidence |
| ----- | ------ | -------- |
| **D-10 BND-04 stale-chunk discipline applied to every gating build** | **PASS** | Plan 02 Task 0: `rm -rf .next/cache .next && pnpm build` → `/tmp/67-build-final-plan02.log` (1 `Compiled successfully` match). Plan 02 Task 2: same prefix → `/tmp/67-build-aes04-final.log` (1 `Compiled successfully` match). Plan 01 already documented 5 stale-chunk-guarded builds in `v1.9-bundle-reshape.md` §5. |
| **Production webpack build (NOT Turbopack dev)** | **PASS** | `pnpm build` invokes Next 15.5.14 production webpack (Turbopack dev is `pnpm dev`). Build output table at `/tmp/67-build-final-plan02.log` shows production "Route (app)" table with First-Load JS column; this is webpack-only output. The `.next/app-build-manifest.json` consumed by the bundle-budget spec is a webpack production artifact (Turbopack dev does not emit it). |
| **AES-04 ran against `pnpm build && pnpm start` (NOT `pnpm dev`)** | **PASS** | Task 2 protocol: `rm -rf .next/cache .next && pnpm build` (production build) → `pnpm start --port 3457` (production server, port-isolated from worktree-collision on :3000) → AES-04 spec execution with `CAPTURE_BASE_URL=http://localhost:3457` env override (mirrors Plan 01 Rule-3 fix at commit `3b1c646`). |
| **Spec mutation persisted to disk** | **PASS** | `git log --oneline -1 tests/v1.8-phase63-1-bundle-budget.spec.ts` returns commit `634984a`. `grep -c "BUDGET_BYTES = 200 \* 1024" tests/v1.8-phase63-1-bundle-budget.spec.ts` = 1. `grep -c "_path_k_decision" tests/v1.8-phase63-1-bundle-budget.spec.ts` = 0. `grep -c "_path_q_decision" tests/v1.8-phase63-1-bundle-budget.spec.ts` = 0. |
| **No regressions in adjacent invariants** | **PASS** | `grep -c "autoResize: true" components/layout/lenis-provider.tsx` = 1 (PF-04 contract intact). `grep -rn "ScrollSmoother" --include="*.ts" --include="*.tsx" lib/ components/ app/` = 0 matches (correct absence preserved). `grep -c "@/components/sf" next.config.ts` = 1 (Plan 01 Vector 1 commit not reverted). |
| **AES-04 final-gate diff artifacts** | **PASS — none emitted** | `ls .playwright-artifacts/phase67-bundle-reshape/` returns "No such file or directory" (the spec only writes DIFF PNGs when ratio > MAX_DIFF_RATIO; 20/20 PASS means zero artifacts, which is the desired outcome). |

**No false-pass conditions detected.** All measurements taken against production webpack output with stale-chunk guard applied; spec mutation committed and verified on disk; AES-04 ran against prod-mode server with production build artifacts.

---

## §5 — Carry-forwards / next-phase hand-offs

### Branch A outcome implications

- **CLAUDE.md 200 KB hard target restored.** Future phases can reference `200 KB` as the BND budget; no `_path_q_decision` ratification block exists in this milestone. `_path_k_decision` has been retired entirely (commit `634984a`).
- **No escalation path opened.** Branch C (>220 KB) was the framework-chunk-reshape escalation trigger; Branch A means framework-chunk reshape (Three.js code-split / lib/api-docs DCE / Next.js version reshape) remains a **deferred-not-required** future phase, NOT a v1.9 close-out blocker.

### Phase sequencing (per project memory)

- **Phase 66** already shipped to main (per project memory `project_phase66_closed.md` 2026-04-30). Phase 67 ran AFTER Phase 66 (D-11 sequencing was prescient — Plan 01 Wave 0 spec partition pattern accommodates Phase 66 ARC-02 pillarbox cohort drift). No further Phase 66 ↔ Phase 67 coordination needed.
- **Phase 70** already shipped to main (per project memory `project_phase70_closed.md` 2026-04-30, VRF-06/07/08 closure). Phase 67 ran AFTER Phase 70 in calendar time.

### v1.9 milestone close-out flags

- **VRF-08 `_path_b_decision` review_gate fires** post-Phase-67 close (per project memory `project_phase70_closed.md`). Future v1.9 milestone-close work can re-test 3G Fast tier (Moto G Power) against the 187.6 KB First-Load baseline now that Phase 67 reduction landed.
- **LHCI tightening hand-off** (§3 above): if a future phase runs prod LHCI against the live domain, the 71.3 KB reshape evidence here can support a `total-blocking-time` 700ms → 500ms tightening via `_path_X_decision` block. Not blocking v1.9 close.
- **`_path_a_decision` (CLS 0 → 0.005)** review_gate: orthogonal to bundle reshape. Continues to track Phase 59 Anton swap descriptor measurement work. Phase 67 did not affect Anton font-load timing (no font-config changes).

### Documentation hand-offs

- `.planning/codebase/v1.9-bundle-reshape.md` is the v1.9 chunk-ID lock document. Future bundle-affecting phases (e.g., framework-chunk reshape) should author a successor doc citing this as the prior baseline, mirroring this doc's Phase 67 → v1.8-lcp-diagnosis.md citation pattern.
- `tests/v1.9-phase67-aes04.spec.ts` per-vector AES-04 harness can be reused by future bundle-reshape phases (5 routes × 4 viewports = 20 captures with strict/cohort partition). Only the baseline directories would need re-pointing for a future milestone (`v2.0-pre/` etc.).

### No blockers carried forward

Phase 67 closes cleanly with all 4 gates PASS. No human-action required. No deferred items reopened. v1.9 milestone progresses unblocked.

---

## §6 — Phase 67 final verdict

**Single-line summary:** BND-05 **PASS** (Plan 01 doc + next.config.ts comment), BND-06 **PASS** (Plan 02 spec mutation; 187.6 KB ≤ 200 KB), BND-07 **PASS** (Plan 01 chunk-ID lock doc + Plan 02 spec gate; LHCI half deliberately unchanged per RESEARCH §LHCI), AES-04 **PASS** (20/20 final phase-end gate).

**Phase 67 CLOSES.**

**Net achievement:** Homepage `/` First-Load JS gzip reduced from 258.9 KB → 187.6 KB (-71.3 KB / 27.5% reduction); CLAUDE.md 200 KB hard constraint restored after one milestone of `_path_k_decision` ratification; D-04 chunk-id stability lock deliberately broken for one phase and re-locked at new stable IDs documented in `.planning/codebase/v1.9-bundle-reshape.md`; zero visual regressions (AES-04 PASS 20/20 across 5 routes × 4 viewports both Plan 01 V1 commit and Plan 02 final-gate cycle); zero invariant regressions (PF-04 autoResize, single-ticker rule, ScrollSmoother absence, no new runtime deps all preserved).
