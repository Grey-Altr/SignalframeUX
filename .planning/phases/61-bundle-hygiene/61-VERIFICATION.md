---
phase: 61-bundle-hygiene
verified: 2026-04-26T21:05:00Z
status: human_needed
score: 3/4 BND requirements satisfied (BND-02, BND-03, BND-04 PASS; BND-01 FAIL); AES-04 strict 0% gate FAIL
must_have_results:
  plan_61_01:
    - id: "next.config.ts contains radix-ui + input-otp"
      status: PASS
      evidence: "grep confirms both literals present in optimizePackageImports array (line 10)"
    - id: "61-01-RESEARCH-LOG.md exists with 3 populated rows (Build 0/A/B)"
      status: PASS
      evidence: "Rows 0, A, B all populated with KB values; no TBDs in numeric columns"
    - id: "Each row records Shared by all + / + /_not-found First Load JS"
      status: PASS
      evidence: "All 3 rows have 3 KB values each (103/280/103, 103/264/103, 103/264/103)"
    - id: "pnpm typecheck (or tsc --noEmit) exits 0 after each addition"
      status: PASS
      evidence: "Substituted pnpm exec tsc --noEmit (Rule 3 deviation; npm script absent); exit 0 documented in row notes for Build A and Build B"
    - id: "Stale-chunk guard documented in 61-01-RESEARCH-LOG.md header (BND-04)"
      status: PASS
      evidence: "4 grep matches for `rm -rf .next/cache .next` in 61-01-RESEARCH-LOG.md (header + per-build invocations)"
  plan_61_02:
    - id: "next.config.ts contains all 4 lazy packages: cmdk, vaul, sonner, react-day-picker"
      status: PASS
      evidence: "grep confirms all 4 literals present in optimizePackageImports array"
    - id: "61-02-RESEARCH-LOG.md exists with 3 populated rows (B carry-over, C, D)"
      status: PASS
      evidence: "Rows B/C/D all populated with KB values; identical 103/264/103 reflecting expected lazy zero-delta"
    - id: "date-fns SKIP decision documented with rationale"
      status: PASS
      evidence: "## date-fns SKIP decision section present; references 61-RESEARCH §1 (Next.js 15 default-optimized list); zero direct imports in repo (transitive via react-day-picker only)"
    - id: "pnpm typecheck exits 0 after each addition"
      status: PASS
      evidence: "tsc --noEmit exit 0 documented in row notes for Build C and Build D (same Rule 3 substitution as Plan 01)"
    - id: "Lazy-path zero-delta on Shared by all documented as expected NOT regression"
      status: PASS
      evidence: "Build C and Build D detail blocks both contain literal 'expected lazy-package no-delta confirmed' tied to 61-RESEARCH §Risks #5"
  plan_61_03:
    - id: "tests/v1.8-phase61-bundle-hygiene.spec.ts exists with MAX_DIFF_RATIO = 0"
      status: PASS
      evidence: "Line 39: `const MAX_DIFF_RATIO = 0; // STRICT — Phase 61 is invisible by construction`"
    - id: "Final pnpm build Shared by all <= 102 KB (BND-01 primary)"
      status: FAIL
      evidence: "Final gating build Shared by all = 103 KB (1 KB over target). BLOCKER per ROADMAP success criterion 1. optimizePackageImports lever exhausted; framework runtime + react-dom = 100 KB + 2.56 KB other shared = practical floor."
    - id: "components/sf/index.ts contains zero `use client` directive matches (BND-03)"
      status: PASS
      evidence: "grep -c 'use client' components/sf/index.ts → 0 matches; barrel directive-free; v1.3 discipline preserved"
    - id: "BND-04 stale-chunk guard documented in 61-RESEARCH.md + both RESEARCH-LOG headers"
      status: PASS
      evidence: "61-RESEARCH.md: 9 matches; 61-01-RESEARCH-LOG.md: 4 matches; 61-02-RESEARCH-LOG.md: 4 matches (all >= 1 required)"
    - id: "61-03-FINAL-GATE.md contains 119 KiB unused-JS reduction% asserting >=80% (BND-01 secondary)"
      status: FAIL
      evidence: "Both reduction% scenarios FAIL: Scenario A (FALSE-PASS GUARD strict, missing chunk 3302 → Bf := B0) = 0.41%; Scenario B (chunk 4335 attribution as Radix-aggregate successor) = 42.10%. Both below 80% target. Recorded honestly in §3 BND-01 Final Gate."
    - id: "Pixel-diff vs visual-baselines/v1.8-start at MAX_DIFF_RATIO=0 (AES-04)"
      status: FAIL
      evidence: "20/20 FAIL strict 0% gate. Max ratio 0.343% (home@desktop), min 0.001% (inventory@iphone13). All 20 ratios under AES-04 standing 0.5% rule but exceed strict 0% gate. Recorded honestly in §4. Bisect deferred to Phase 62 calibration (root cause attribution between bundle-induced regression vs renderer non-determinism not closeable without fresh baseline capture)."

requirements_coverage:
  - id: BND-01
    status: BLOCKED
    plan: 61-03
    reason: "Primary gate (Shared by all 103 KB > 102 KB target) and secondary gate (reduction% 0.41-42.10% < 80% target) both FAIL. optimizePackageImports lever exhausted. Closure path requires Phase 62: splitChunks retuning OR ROADMAP target recalibration OR acceptance of 103 KB as practical floor."
  - id: BND-02
    status: SATISFIED
    plan: 61-01 + 61-02
    reason: "All 7 packages added (lucide-react baseline + 6 BND-02 candidates: radix-ui, input-otp, cmdk, vaul, sonner, react-day-picker). date-fns SKIP justified per 61-RESEARCH §1 (already in Next.js 15 default-optimized list; zero direct imports). Per-package builds documented with stale-chunk guard. Realized harvest: −16 KB / 5.7% on / First Load JS; Shared by all unchanged at 103 KB (lazy packages contribute zero to gating metric, as predicted by 61-RESEARCH §Risks #5)."
  - id: BND-03
    status: SATISFIED
    plan: 61-03
    reason: "components/sf/index.ts contains 0 `use client` matches at v1.8-lock end-state. v1.3 barrel discipline preserved through Plan 01 + Plan 02 (those plans modified only next.config.ts)."
  - id: BND-04
    status: SATISFIED
    plan: 61-03
    reason: "Stale-chunk guard `rm -rf .next/cache .next` documented in 61-RESEARCH.md (9 matches), 61-01-RESEARCH-LOG.md (4 matches), 61-02-RESEARCH-LOG.md (4 matches). Every gating measurement in Phase 61 honored the guard per per-build invocation lines."

human_verification:
  - test: "User decision on Phase 62 escalation path for BND-01 closure"
    expected: "Choose one of three closure paths (1) splitChunks retuning to pull 1 KB module off shared floor; (2) ROADMAP target recalibration via fresh Lighthouse audit (119 KiB budget may have included three.js-route-specific bytes optimizePackageImports cannot reduce); (3) acceptance of 103 KB as practical floor (Next.js 15 framework runtime 45.8 + react-dom 54.2 + other shared 2.56 = 103 KB, ROADMAP edit required)"
    why_human: "Strategic ROADMAP-amendment decision. Plan 03 explicitly defers to user — orchestrator-owned STATE.md/ROADMAP.md updates; no autonomous closure permitted."
  - test: "User decision on AES-04 calibration path"
    expected: "Choose one of two calibration paths: (1) re-capture baselines from pre-Phase-61 commit using tests/v1.8-baseline-capture.spec.ts and re-run; if 20/20 still FAIL strict 0%, harness non-determinism confirmed → relax to AES-04 standing 0.5% rule (which would 20/20 PASS per current data); (2) if 20/20 PASS strict 0% against fresh baselines, diffs ARE bundle-induced and bisect is justified (sonner+react-day-picker → cmdk+vaul → input-otp → radix-ui)."
    why_human: "Calibration question requires baseline re-capture from a different commit, plus root-cause attribution between bundle regression vs renderer/font-load timing non-determinism. Plan 03 honestly reports the strict 0% FAIL but cannot resolve attribution within Phase 61 scope."
  - test: "Phase 59 spec MAX_DIFF_RATIO discrepancy ratification"
    expected: "Acknowledge the discovery: Phase 59 row B claimed '20/20 PASS at 0%' but spec source uses MAX_DIFF_RATIO = 0.005. Strict 0% gate has never been validated in this harness on any prior plan. Decide whether this is a documentation error (claim should have been '20/20 PASS at 0.5%') or whether the strict 0% claim was a separate verification that was never recorded."
    why_human: "Historical truth-claim audit. Cannot be resolved programmatically without re-running prior plans' spec under strict-0% gate which is itself the calibration question."
---

# Phase 61 — Bundle Hygiene Verification Report

**Phase Goal:** Recover bundle floor toward CLAUDE.md original gate by extending `optimizePackageImports` to cover all v1.8-confirmed BND-02 candidates, validate sf/index.ts barrel discipline (BND-03), document stale-chunk guard (BND-04), and prove bundle changes are visually invisible (AES-04).

**Verified:** 2026-04-26T21:05:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| #   | Truth                                                                                                | Status      | Evidence                                                                                                                                                                                                                  |
| --- | ---------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | optimizePackageImports extended to cover all v1.8-confirmed BND-02 candidates (BND-02 main work)      | ✓ VERIFIED  | next.config.ts line 10 contains all 6 non-skip BND-02 packages plus lucide-react baseline. date-fns SKIP justified (Next.js 15 default-optimized; 0 direct imports).                                                      |
| 2   | sf/index.ts barrel discipline preserved (BND-03)                                                      | ✓ VERIFIED  | grep -c "use client" components/sf/index.ts = 0; v1.3 barrel discipline maintained.                                                                                                                                       |
| 3   | Stale-chunk guard documented in research artifacts (BND-04)                                           | ✓ VERIFIED  | `rm -rf .next/cache .next` documented in 61-RESEARCH.md (9 matches) + 61-01-RESEARCH-LOG.md (4) + 61-02-RESEARCH-LOG.md (4); every per-build invocation honored the guard.                                                |
| 4   | Bundle floor recovered to ≤102 KB Shared by all (BND-01 primary)                                      | ✗ FAILED    | Final stale-chunk-guarded build: Shared by all = 103 KB (1 KB over). 61-03-FINAL-GATE.md §3 records FAIL honestly. optimizePackageImports lever exhausted.                                                                |
| 5   | 119 KiB unused-JS reduced ≥80% (BND-01 secondary)                                                     | ✗ FAILED    | Scenario A (guard-strict): 0.41%; Scenario B (chunk 4335 attribution): 42.10%. Both below 80% threshold. Documented honestly in 61-03-FINAL-GATE.md §3.                                                                   |
| 6   | Bundle changes visually invisible vs v1.8-start at MAX_DIFF_RATIO=0 (AES-04 strict)                   | ✗ FAILED    | 20/20 FAIL strict 0% gate. Max ratio 0.343% (home@desktop), min 0.001%. ALL 20 ratios are under AES-04 standing 0.5% rule but exceed strict 0% gate. Honest report; gate not loosened.                                    |

**Score:** 3/6 truths verified (BND-02 main work + BND-03 + BND-04 PASS; BND-01 primary + BND-01 secondary + AES-04 strict FAIL)

**Requirement-level score (per task prompt):** 3/4 BND requirements fully closed within Phase 61 scope (BND-02, BND-03, BND-04 PASS; BND-01 FAIL).

---

### Required Artifacts

| Artifact                                                            | Expected                                              | Status      | Details                                                                                                                                                |
| ------------------------------------------------------------------- | ----------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `next.config.ts`                                                    | Contains all 7 packages in optimizePackageImports    | ✓ VERIFIED  | Line 10: `["lucide-react", "radix-ui", "input-otp", "cmdk", "vaul", "sonner", "react-day-picker"]`. No date-fns, no @radix-ui/react-* scoped entries.   |
| `components/sf/index.ts`                                            | Zero `use client` directives                          | ✓ VERIFIED  | grep -c returns 0.                                                                                                                                     |
| `tests/v1.8-phase61-bundle-hygiene.spec.ts`                         | Exists with MAX_DIFF_RATIO = 0                        | ✓ VERIFIED  | Line 39 strict gate; describe label `@v18-phase61-bundle-hygiene (BND-01 / AES-04)`; baseline points at v1.8-start; 5 routes × 4 viewports preserved. |
| `61-01-RESEARCH-LOG.md`                                             | 3 populated rows + stale-chunk guard header           | ✓ VERIFIED  | Rows 0/A/B all populated; 4 stale-chunk-guard mentions; Build A/B detail blocks present.                                                              |
| `61-02-RESEARCH-LOG.md`                                             | 3 populated rows + date-fns SKIP + stale-chunk guard  | ✓ VERIFIED  | Rows B/C/D populated; date-fns SKIP section present; 4 stale-chunk-guard mentions.                                                                    |
| `61-03-FINAL-GATE.md`                                               | All 4 gates with honest pass/fail verdicts            | ✓ VERIFIED  | §1 BND-03 PASS; §2 BND-04 PASS; §3 BND-01 FAIL (both sub-gates); §4 AES-04 FAIL strict 0%; §5 final verdict honest.                                   |
| `61-01-SUMMARY.md`, `61-02-SUMMARY.md`, `61-03-SUMMARY.md`          | Summarize each plan with commit hashes                | ✓ VERIFIED  | All 3 SUMMARYs present with commit hashes, deviations documented (Rule 3 typecheck/node_modules), self-checks PASSED.                                  |

---

### Key Link Verification

| From                                              | To                                              | Via                                          | Status      | Details                                                                                                                                                                                |
| ------------------------------------------------- | ----------------------------------------------- | -------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| next.config.ts experimental.optimizePackageImports | webpack barrel-rewrite transform                | Next.js 15 build pipeline                    | ✓ WIRED     | Build A −16 KB on / First Load JS confirms transform is active; chunk 3302 fragmentation by sub-package observed in .next/static/chunks/.                                              |
| 61-01-RESEARCH-LOG.md / 61-02-RESEARCH-LOG.md     | Route (app) stdout table                        | manual paste of Shared/route/_not-found rows | ✓ WIRED     | Each per-build detail block contains verbatim "First Load JS shared by all" + "/" + "/_not-found" lines.                                                                                |
| tests/v1.8-phase61-bundle-hygiene.spec.ts         | .planning/visual-baselines/v1.8-start/          | pixelmatch at MAX_DIFF_RATIO = 0             | ✓ WIRED     | Spec executes (20/20 tests run) and produces ratio measurements; strict gate fails because diff ratios are non-zero. The wiring is correct; the gate verdict is FAIL honestly.            |
| 61-03-FINAL-GATE.md                               | 61-01-RESEARCH-LOG.md Build 0 chunk sizes       | manual chunk 3302/7525 sums delta            | ✓ WIRED     | §3 explicitly references B0_3302 = 159.35 KB (chunks/3302-8fecac2542f70b11.js) and B0_7525 = 75.09 KB sourced from 61-01-RESEARCH-LOG.md.                                              |

---

### Requirements Coverage

| Requirement | Source Plan(s) | Description                                                                                                  | Status     | Evidence                                                                                                                                                                                                                |
| ----------- | -------------- | ------------------------------------------------------------------------------------------------------------ | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BND-01      | 61-03          | Initial shared JS ≤102 KB on prod; 119 KiB unused JS reduced by ≥80%                                          | ✗ BLOCKED  | Primary FAIL (103>102, 1 KB over). Secondary FAIL (0.41% Scenario A / 42.10% Scenario B; both <80%). Closure requires Phase 62 (splitChunks OR ROADMAP recalibration OR floor acceptance).                              |
| BND-02      | 61-01, 61-02   | optimizePackageImports expanded to cover DGN-02 packages with per-package ANALYZE=true pnpm build re-runs    | ✓ SATISFIED | All 6 candidates added across 4 builds (A radix-ui, B input-otp, C cmdk+vaul, D sonner+react-day-picker). date-fns SKIP justified. −16 KB on / First Load JS realized. requirements-completed:[BND-02] in both SUMMARYs. |
| BND-03      | 61-03          | components/sf/index.ts barrel directive-free                                                                  | ✓ SATISFIED | grep -c "use client" = 0. v1.3 discipline preserved. requirements-completed:[BND-03] in 61-03-SUMMARY.                                                                                                                  |
| BND-04      | 61-03          | Stale-chunk guard documented in plan-phase RESEARCH.md                                                        | ✓ SATISFIED | Documented in 61-RESEARCH.md (9 matches) + 61-01/02-RESEARCH-LOG.md headers (4 matches each). Every gating build prefixed with the guard. requirements-completed:[BND-04] in 61-03-SUMMARY.                            |

**No orphaned requirements.** All 4 BND requirement IDs from the phase task scope appear in at least one plan's frontmatter `requirements:` field.

---

### Anti-Patterns Found

| File                                          | Line | Pattern                                          | Severity        | Impact                                                                                                                       |
| --------------------------------------------- | ---- | ------------------------------------------------ | --------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| (none)                                        | —    | —                                                | —               | No TODO/FIXME/PLACEHOLDER strings introduced; no empty implementations; no unwired stubs in any modified file.               |

The 4 changed files (next.config.ts, 3 research-logs, 1 spec, 1 final-gate doc) are all production-grade with full content. Phase 61's actual deliverable surface is small (one config line + research artifacts + one spec) so there's minimal anti-pattern surface to scan.

---

### Human Verification Required

#### 1. Phase 62 BND-01 closure path decision

**Test:** Decide which of three Phase 62 closure paths to pursue for the 1 KB Shared-by-all gap:
1. Webpack `splitChunks` retuning — pull a single ~1 KB module off the shared floor (e.g., a small util eagerly imported by app-shell layout that doesn't truly need to be shared).
2. Re-evaluate the 119 KiB ROADMAP target — fresh Lighthouse audit against post-Phase-60 + post-Phase-61 build to give Phase 62 a calibrated target. The original 119 KiB budget may have included three.js-route-specific bytes that `optimizePackageImports` was never going to reduce.
3. Acceptance of 103 KB as practical floor — Next.js 15 framework runtime (45.8 KB) + react-dom (54.2 KB) + other shared (2.56 KB) = 103 KB. Declare irreducible; edit ROADMAP success criterion 1 to ≤103 KB. Lowest-effort path; requires explicit ROADMAP amendment.

**Expected:** User selects path; Phase 62 plan is scaffolded against that decision.

**Why human:** Strategic ROADMAP-amendment decision. Phase 61's Plan 03 explicitly defers — STATE.md/ROADMAP.md owned by orchestrator after worktree merges; no autonomous closure permitted.

#### 2. AES-04 calibration path decision

**Test:** Decide whether to:
1. Re-capture baselines from pre-Phase-61 commit (`73b56ae5ad68a779ccf25e3ab498344c0b9cd2e2`'s parent) using `tests/v1.8-baseline-capture.spec.ts` and re-run `tests/v1.8-phase61-bundle-hygiene.spec.ts` against fresh baselines. If 20/20 still FAIL strict 0% → harness non-determinism confirmed → relax to AES-04 standing 0.5% rule (which would 20/20 PASS per Phase 61 data: max 0.343% < 0.5%).
2. If 20/20 PASS strict 0% against fresh baselines → diffs ARE bundle-induced; bisect is justified (revert sonner+react-day-picker → cmdk+vaul → input-otp → radix-ui until 0% restored).

**Expected:** User authorizes baseline re-capture and bisect plan, OR accepts AES-04 0.5% standing rule as final verdict.

**Why human:** Calibration question requires baseline re-capture from different commit + root-cause attribution between bundle-induced regression vs. renderer/font-load timing non-determinism. Plan 03 honestly reports strict 0% FAIL but cannot resolve attribution within Phase 61 scope. Note: under the AES-04 0.5% standing rule from Phase 57's AESTHETIC-OF-RECORD.md, 20/20 would PASS at max 0.343% diff — suggesting the strict 0% gate may have been over-tight in the first place.

#### 3. Phase 59 spec MAX_DIFF_RATIO discrepancy ratification

**Test:** Acknowledge the discovery documented in 61-03-SUMMARY.md key-decisions: Phase 59 row B's claimed "20/20 PASS at 0%" is misleading — `tests/v1.8-phase59-pixel-diff.spec.ts` source has `MAX_DIFF_RATIO = 0.005`, not 0. The strict 0% gate has never been validated in this harness on any prior plan. Decide whether to file a documentation correction note in Phase 59's records or treat as "ratify reality" (per `feedback_ratify_reality_bias`) given the spec is the code-of-record.

**Expected:** User confirms ratify-reality posture (spec source is truth; Phase 59 SUMMARY documentation should be corrected as a non-blocking note in v1.8 STATE.md drift-sweep).

**Why human:** Historical truth-claim audit. Phase 59 was already closed with status `human_needed` for unrelated reasons; this discovery is a Phase 61-found drift between Phase 59 documentation and Phase 59 spec source.

---

### Gaps Summary

Phase 61 successfully closed **3 of 4 BND requirements** (BND-02, BND-03, BND-04 PASS) and delivered the bulk of its mandated work — `optimizePackageImports` is fully populated with all 7 packages, sf/index.ts barrel discipline is preserved, and stale-chunk-guard documentation is comprehensive. The realized BND-02 harvest is **−16 KB / 5.7% on `/` First Load JS** plus −15-16 KB on every Radix-consuming route — meaningful at the route level.

**Two gaps block Phase 61 from a clean close:**

1. **BND-01 primary + secondary FAIL.** Shared by all = 103 KB (1 KB over the ≤102 KB target). Reduction% of 119 KiB unused-JS budget is 0.41% (FALSE-PASS-GUARD strict) or 42.10% (chunk-4335 Radix-aggregate attribution); both fall well below the 80% threshold. The `optimizePackageImports` lever is exhausted at the v1.8-lock end-state — Plan 02's lazy-package additions delivered 0 KB delta as predicted by 61-RESEARCH §Risks #5. The 1 KB primary gap and the reduction% deficit must come from a different vector (splitChunks, useCache investigation, ROADMAP recalibration, or floor acceptance) — escalation to Phase 62 documented in 61-03-FINAL-GATE.md §5.

2. **AES-04 strict 0% gate FAIL.** 20/20 tests FAIL at MAX_DIFF_RATIO = 0; max ratio 0.343% (home@desktop), min 0.001%. **All 20 ratios are below the AES-04 standing 0.5% rule** (per Phase 57's AESTHETIC-OF-RECORD.md), but the Phase 61 plan asserts strict 0% with no documented re-baseline exception. Plan 03 honestly reports the strict 0% FAIL and does NOT swap thresholds to claim PASS. Root-cause attribution between bundle-induced regression vs. renderer non-determinism is not closeable within Phase 61 scope — Plan 03 also discovered that Phase 59 row B's claimed "20/20 PASS at 0%" was actually run at `MAX_DIFF_RATIO = 0.005`, so the strict 0% gate has no historical validation in this harness. Calibration deferred to Phase 62.

**Honesty note:** Plan 03 explicitly declined to round 103 → 102, swap reduction-percentage interpretations, or relax the strict 0% gate to 0.5% to claim PASS. The verification report adheres to the same honesty contract — verdicts above match what the artifacts actually say, not what would be politically convenient.

**Phase 61 status: human_needed** (BND-01 + AES-04 blocked pending user decision on Phase 62 escalation paths). BND-02, BND-03, BND-04 may be marked complete in the requirements table; BND-01 must remain Pending until Phase 62 closes it (or the ROADMAP target is amended).

---

_Verified: 2026-04-26T21:05:00Z_
_Verifier: Claude (gsd-verifier)_
