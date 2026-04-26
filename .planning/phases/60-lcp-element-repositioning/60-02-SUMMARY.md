---
phase: 60-lcp-element-repositioning
plan: 02
subsystem: performance
tags: [lcp, content-visibility, containIntrinsicSize, ghost-label, lhci, aes-04, v1.8, anti-pattern-5, d-04-escalation]
one-liner: "PARTIAL — Mobile LCP intervention shipped (content-visibility:auto + containIntrinsicSize:80px on GhostLabel LEAF), AES-04 pixel-diff PASS (max 0.361%), LHCI median LCP=812ms PASS but CLS=0.002505 FAIL and P02-06 positive-proof FAIL — D-04 escalation pending venue decision"

# Dependency graph
requires:
  - phase: 60-01
    provides: ".planning/codebase/v1.8-lcp-candidates.json (Plan 01 baseline candidate snapshot — confirms mobile LCP=GhostLabel pre-intervention)"
  - phase: 57-diagnosis-pass-aesthetic-of-record-lock-in
    provides: "AESTHETIC-OF-RECORD.md AES-04 pixel-diff threshold; v1.8-baseline-capture.spec.ts harness; v1.8-start visual baselines (20 PNGs)"
  - phase: 58-lighthouse-ci-real-device-telemetry
    provides: ".lighthouseci/lighthouserc.json mobile assertions config (numberOfRuns:5, LCP <=1000ms, CLS <=0)"
  - phase: 59-critical-path-restructure
    provides: "Anton font-display:swap + tuned descriptors (CRT-03); Lenis rIC deferral (CRT-04); preserved PF-04 autoResize:true contract"
provides:
  - "components/animation/ghost-label.tsx with contentVisibility:auto + containIntrinsicSize:'auto 80px' on the LEAF span (Anti-Pattern #5 leaf-only discipline; PITFALLS.md Pitfall 9 cited in commit body)"
  - "tests/v1.8-ghost-label-measure.spec.ts — Wave 0 measurement spec (re-runnable for future containIntrinsicSize tuning)"
  - "tests/v1.8-phase60-aes04-diff.spec.ts — comparison-mode pixel-diff harness (re-runnable for any future Plan 02-style intervention)"
  - ".planning/phases/60-lcp-element-repositioning/60-02-wave0-measurements.json — getBoundingClientRect() data at 4 viewports (mobile=81px, iphone13=88px, ipad=188px, desktop=324px)"
  - ".planning/phases/60-lcp-element-repositioning/60-02-aes04-results.md — 20-row pass/fail diff table (all PASS, max diff 0.361%)"
  - ".planning/perf-baselines/v1.8/phase-60-mobile-lhci.json — median-of-5 LHCI mobile snapshot with full pass-status breakdown + diagnostic notes"
  - "Documented D-04 escalation context in commit ab95241 body — captures the LCP-timing-win / CLS+P02-06-fail asymmetry and the (a)/(c) verbatim-set mismatch that requires escalation venue decision"
affects:
  - 60-03 OR 60.1 (decimal phase) — Plan 03/escalation venue depends on user/orchestrator choice
  - 61-bundle-hygiene — BLOCKED until Phase 60 closes APPROVED
  - 62-real-device-verification-final-gate — D-07 + AES-03 manual gates remain pending; Phase 62 VRF-04 cleanup is one of the escalation venues

# Tech tracking
tech-stack:
  added: []  # zero new dependencies
  patterns:
    - "content-visibility:auto + containIntrinsicSize on a leaf <span> with single-value hint (the chosen approach — RESEARCH §Q1 step 6 measured-not-guessed; the resulting CLS regression demonstrates the limitation of single-value hints on variably-sized elements across breakpoints)"
    - "AES-04 comparison-mode pixel-diff via pixelmatch + pngjs against committed baselines (NEVER --update-snapshots) — re-usable harness for future aesthetic-preservation gates"
    - "P02-06 positive-proof methodology: re-run candidates spec post-intervention to assert isLcp:true selector NO LONGER matches data-ghost-label/sf-display (this run FAILED — captures the candidates-spec settling-window vs LHCI-timing divergence)"

key-files:
  created:
    - tests/v1.8-ghost-label-measure.spec.ts
    - tests/v1.8-phase60-aes04-diff.spec.ts
    - .planning/phases/60-lcp-element-repositioning/60-02-wave0-measurements.json
    - .planning/phases/60-lcp-element-repositioning/60-02-aes04-results.md
    - .planning/perf-baselines/v1.8/phase-60-mobile-lhci.json
  modified:
    - components/animation/ghost-label.tsx (the LCP intervention itself — 14 insertions, 1 deletion)
    - .planning/codebase/v1.8-lcp-candidates.json (P02-06 re-run output; mobile-360 + iphone13-390 LCP STILL = GhostLabel)
    - tests/v1.8-phase58-lcp-guard.spec.ts (Rule 3 lint blocker fix — pre-existing @typescript-eslint/consistent-type-imports error)
    - tests/v1.8-phase59-anton-swap-cls.spec.ts (Rule 3 lint blocker fix)

key-decisions:
  - "containIntrinsicSize value 'auto 80px' chosen via Wave 0 getBoundingClientRect() measurement (P02-16 measure-not-guess); mobile-360 height=81px rounded down to nearest 10px. This intentionally under-estimates iphone13-390 (87.75px), ipad-834 (187.65px), and desktop-1440 (324px) — single-value hints cannot match all breakpoints, and this design choice ties directly to the CLS regression observed in Wave 2."
  - "Rule 3 (Blocking) auto-fix: pre-existing @typescript-eslint/consistent-type-imports errors in tests/v1.8-phase58-lcp-guard.spec.ts and tests/v1.8-phase59-anton-swap-cls.spec.ts. Surgical fix (top-level type import vs inline import() annotation). Committed separately from the intervention to keep the LCP-02 commit atomic + bisectable."
  - "Plan execution STOPPED at Wave 2 LHCI gate per critical_constraint #3 + plan §60-02-04 step 6 D-04 reactive posture. LCP timing PASSED (812ms vs <1000ms threshold) but CLS regressed by exactly 0.002505 (caused by content-visibility transition on GhostLabel — 0.002356 attributed by layout-shifts audit) and P02-06 positive-proof FAILED (mobile LCP STILL = GhostLabel post-intervention). Escalation venue NOT chosen autonomously — returned as orchestrator/user decision per critical_constraint #3."

patterns-established:
  - "Pre-execution Wave 0 measurement spec authoring: derive runtime values (containIntrinsicSize) from actual rendered geometry via Playwright + getBoundingClientRect(), commit measurements alongside the spec for re-runnable provenance."
  - "AES-04 pixel-diff comparison-mode harness — pixelmatch + pngjs against committed baselines, full-page captures to gitignored postcapture dir, threshold-gated assertion at 0.5%, results table emitted to phase dir."
  - "Layered LCP gate verification: (1) LHCI median-of-5 timing assertions, (2) post-intervention candidates-spec re-run as POSITIVE PROOF the diagnosed element was actually removed from the LCP critical path. Both must pass; either failing triggers D-04 escalation."

requirements-completed: []  # NONE — LCP-01 CLS gate failed; LCP-02 P02-06 proof failed; LCP-03 partially demonstrated (AES-04 PASS, but AES-03 cohort review not yet executed)

# Metrics
duration: 14min
completed: 2026-04-26
status: blocked-on-human-action
---

# Phase 60 Plan 02: Mobile LCP Intervention — PARTIAL EXECUTION (Status: blocked-on-human-action)

**Mobile LCP intervention shipped to GhostLabel LEAF (`content-visibility: auto` + `containIntrinsicSize: "auto 80px"`); AES-04 pixel-diff PASSED (all 20 combos < 0.5%, max 0.361%); LHCI median LCP=812ms PASSED (<1000ms target — 7.7x improvement over Phase 57 baseline 6.5s); but CLS=0.002505 FAILED (≤0 target) and P02-06 positive-proof FAILED (mobile LCP STILL = GhostLabel post-intervention) — D-04 reactive escalation pending orchestrator/user venue decision.**

## Status: BLOCKED-ON-HUMAN-ACTION

Per Plan 02 critical_constraint #3 and plan §60-02-04 step 6, execution STOPPED at the Wave 2 LHCI gate. The remaining tasks (60-02-05 LHCI snapshot recording, 60-02-06 D-07 WebPageTest, 60-02-07 D-08 chrome-devtools MCP cohort review) were NOT executed because the gate failed. Wave 3 manual gates explicitly require Wave 2 PASS as their precondition (see plan critical_constraint #4 + §60-02-04 step 6).

**The orchestrator/user must choose an escalation venue** before Phase 60 can close OR before any further Plan 02-style work proceeds. See "D-04 Escalation — Venue Decision Required" section below.

## Performance

- **Duration:** 14 min
- **Started:** 2026-04-26T18:29:07Z
- **Completed:** 2026-04-26T18:43:39Z (Wave 2 gate trip-point)
- **Tasks executed:** 4 of 7 (60-02-01, 60-02-02, 60-02-03, 60-02-04 partial — snapshot only)
- **Tasks NOT executed:** 60-02-05 (LHCI cross-reference), 60-02-06 (Wave 3 D-07 WebPageTest), 60-02-07 (Wave 3 D-08 cohort review)
- **Files modified:** 3 (1 production source + 2 lint-blocker fixes)
- **Files created:** 5

## Accomplishments

- Wave 0 GhostLabel rect measurement at all 4 viewports (mobile-360 = 81px height; iphone13-390 = 87.75px; ipad-834 = 187.65px; desktop-1440 = 324px). SFSection ancestor `contain: none`, `overflow: hidden auto` — no containment context defeating the leaf deferral.
- Wave 1 GhostLabel intervention applied: `contentVisibility: "auto"` + `containIntrinsicSize: "auto 80px"` on the LEAF `<span>` only; `components/animation/ghost-label.tsx` is the only production source touched. Anti-Pattern #5 grep gates ALL PASS — section wrappers, block components, app-level CSS, and globals.css all clean of `content-visibility`.
- Wave 1 AES-04 pixel-diff: all 20 page×viewport combos PASS, max diff 0.361% on `/ @ desktop-1440x900` (well under 0.5% threshold). The intervention is aesthetic-neutral as captured against `.planning/visual-baselines/v1.8-start/`.
- Wave 2 LHCI median-of-5 mobile run completed; **median LCP = 812.84ms** (range 810.31..815.44ms across 5 runs). This is a substantial win versus the Phase 57 baseline of 6.5s on production mobile — the LCP-01 timing gate passes by ~190ms margin.
- PF-04 contract preserved: `grep -q "autoResize: true" components/layout/lenis-provider.tsx` exits 0.
- Zero new dependencies in `package.json`.

## Task Commits

1. **Task 60-02-01: Wave 0 GhostLabel rect measurement** — `73a3aeb` (chore)
2. **[Rule 3 Blocking auto-fix] Pre-existing lint errors in v1.8 spec files** — `d8f58b8` (fix)
3. **Task 60-02-02: Wave 1 — content-visibility + containIntrinsicSize on GhostLabel LEAF (Anti-Pattern #5)** — `25bc3c8` (feat)
4. **Task 60-02-03: Wave 1 AES-04 pixel-diff vs v1.8-start baselines (all 20 PASS)** — `fe91895` (test)
5. **Task 60-02-04 partial: Wave 2 LHCI median-of-5 mobile snapshot — LCP-timing PASS / CLS+P02-06 FAIL** — `ab95241` (chore)

**Plan metadata:** TBD (this SUMMARY commit will be the final commit IF the orchestrator instructs the executor to close out the plan blocked-on-human-action; otherwise the orchestrator owns subsequent commit shape).

## Files Created/Modified

### Created
- `tests/v1.8-ghost-label-measure.spec.ts` — Wave 0 Playwright measurement spec (84 LOC). Captures `getBoundingClientRect()` per viewport plus the SFSection ancestor's computed `contain` + `overflow` for the RESEARCH §Q2 caveat check.
- `tests/v1.8-phase60-aes04-diff.spec.ts` — Wave 1 AES-04 comparison-mode pixel-diff spec (116 LOC). Uses pixelmatch + pngjs (existing devDeps); writes post-capture PNGs to `.planning/phases/60-lcp-element-repositioning/60-02-aes04-postcapture/` (gitignored via global `*.png` rule); emits results md table for audit trail.
- `.planning/phases/60-lcp-element-repositioning/60-02-wave0-measurements.json` — 4-viewport rect measurements + section computed-style snapshot.
- `.planning/phases/60-lcp-element-repositioning/60-02-aes04-results.md` — 20-row pass/fail diff table; all PASS.
- `.planning/perf-baselines/v1.8/phase-60-mobile-lhci.json` — full LHCI snapshot with median, all-runs arrays, thresholds, pass_status table per category, and diagnostic notes capturing the LCP-timing-win / CLS+P02-06-fail asymmetry.

### Modified
- `components/animation/ghost-label.tsx` — added `contentVisibility: "auto"` + `containIntrinsicSize: "auto 80px"` to the LEAF span style block. Inline doc comments cite Anti-Pattern #5 + PITFALLS.md Pitfall 9 + RESEARCH §Q1. Commit `25bc3c8` (sole production source modification for this plan).
- `.planning/codebase/v1.8-lcp-candidates.json` — overwritten by Wave 2 P02-06 re-run; now reflects the post-intervention LCP candidate identity at all 4 viewports. Mobile-360 + iphone13-390 STILL show GhostLabel as `isLcp: true`.
- `tests/v1.8-phase58-lcp-guard.spec.ts` — Rule 3 lint fix (4 char change: `import("@playwright/test").Page` → `Page` with top-level `import type Page from "@playwright/test"`).
- `tests/v1.8-phase59-anton-swap-cls.spec.ts` — same lint fix.

## Decisions Made

- **`containIntrinsicSize: "auto 80px"`** — derived from Wave 0 measurement (`60-02-wave0-measurements.json`: mobile-360 height=81px) rounded to nearest 10px per the plan's measure-not-guess decision rule (P02-16). The 200px font-size-based estimate in RESEARCH §Q1 was an over-upper-bound; `getBoundingClientRect()` is the authoritative source. **In retrospect this single-value hint cannot match all 4 viewports (81/88/188/324px), and that mismatch is the root cause of the Wave 2 CLS regression.** A breakpoint-specific containIntrinsicSize (or dropping the hint entirely on `position: absolute` decorative elements) would have been required to avoid the shift.
- **Rule 3 lint blocker fix committed separately** — to keep the Task 60-02-02 LCP-02 intervention commit atomic + bisectable. The lint errors were pre-existing (in commits 7ee6770 / e2bd273 from Phase 58/59) and are out-of-scope per SCOPE BOUNDARY, but per Rule 3 they blocked the Task 60-02-02 verify gate (`pnpm lint` exit 0). Surgical 4-character fix in 2 unrelated test files.
- **Plan execution STOPPED at Wave 2** per critical_constraint #3 — escalation venue choice belongs to orchestrator/user, not executor.

## Wave 2 LHCI Median Results (post-intervention, mobile emulation, 5 runs)

| Metric          | Median   | All 5 runs                        | Threshold | Status |
|-----------------|----------|-----------------------------------|-----------|--------|
| LCP             | 812.84ms | [810.31, 811.89, 812.84, 812.93, 815.44] | <1000ms | **PASS** |
| Performance     | 0.99     | [0.99, 0.99, 0.99, 0.99, 0.99]    | >=0.97    | **PASS** |
| TBT             | 103.5ms  | [97.5, 99.0, 103.5, 104.5, 112.5] | <=200ms   | **PASS** |
| SEO             | 1.00     | [1.0 × 5]                         | >=1.0     | **PASS** |
| **CLS**         | **0.002505** | [0.002505 × 5]                | <=0       | **FAIL** |
| Accessibility   | 0.96     | [0.96 × 5]                        | >=0.97    | **FAIL (pre-existing)** |
| Best-Practices  | 0.96     | [0.96 × 5]                        | >=0.97    | **FAIL (pre-existing)** |

LHCI exit code: 1 (assertion failures). Median report URL recorded.

## CLS Regression — Root Cause Analysis (from Lighthouse `layout-shifts` audit)

| Element                                                                          | Score    | Cause                                                                                              |
|----------------------------------------------------------------------------------|----------|----------------------------------------------------------------------------------------------------|
| `main#main-content > div#bg-shift-wrapper > section#thesis > span.sf-display`    | 0.002356 | GhostLabel content-visibility transition: placeholder 80px → actual rendered 84px (4px delta in 375x667 mobile emulation viewport) |
| `body.antialiased > aside.fixed`                                                 | 0.000149 | InstrumentHUD pre-existing sub-threshold shift (NOT caused by Plan 02)                              |

**Mechanism:** Even though GhostLabel is `position: absolute` (does not contribute to flow), `content-visibility: auto` creates a containment box whose size delta between `containIntrinsicSize` placeholder and actual rendered content registers as a layout-shift event. A single-value `containIntrinsicSize` cannot match all 4 viewport rendered heights (81 / 88 / 188 / 324 px) — the LHCI mobile emulation viewport (375x667) renders the GhostLabel at 84px, 4px taller than the 80px hint, producing the CLS event.

## P02-06 Positive-Proof — FAILED

Re-running `tests/v1.8-lcp-candidates.spec.ts` post-intervention:

| Viewport         | Pre-intervention LCP                | Post-intervention LCP                | Change            |
|------------------|-------------------------------------|--------------------------------------|-------------------|
| mobile-360x800   | GhostLabel @ 26100 px², 176ms       | **GhostLabel @ 26100 px², 172ms**    | **STILL GhostLabel — P02-06 FAIL** |
| iphone13-390x844 | GhostLabel @ 30632 px², 64ms        | **GhostLabel @ 30632 px², 64ms**     | **STILL GhostLabel — P02-06 FAIL** |
| ipad-834x1194    | VL-05 // overlay @ 18747 px², 80ms  | VL-05 // overlay @ 18747 px², 76ms   | unchanged (D-05 monitor-only)      |
| desktop-1440x900 | VL-05 // overlay @ 55890 px², 84ms  | VL-05 // overlay @ 55890 px², 84ms   | unchanged (D-05 monitor-only)      |

**The intervention did NOT remove GhostLabel from the mobile LCP critical-path candidate pool**, contradicting Plan 02's primary hypothesis that `content-visibility: auto` would defer the GhostLabel out of the LCP candidate set. The headless Playwright environment paints aggressively during the 1500ms candidates-spec settling window, and the browser's content-visibility intersection-observer pre-renders content near the viewport edge to avoid jank — defeating the deferral on the candidates spec.

The LHCI 812ms median LCP timing win was likely driven by Phase 59's Anton font-display:swap migration (CRT-03), NOT Plan 02's intervention. Plan 02 may have shipped pure CLS regression with marginal-to-zero LCP benefit beyond what Phase 59 already delivered.

## Out-of-Scope Findings (NOT caused by Plan 02)

Lighthouse Accessibility 0.96 / Best-Practices 0.96 are caused by pre-existing audit failures NOT introduced by Plan 02:
- `target-size`: footer `.sf-link-draw` links to `/init`, `/inventory`, `/system`, `/builds`, `/reference` are too small for touch targets (already tracked by `project_phase37_mobile_a11y_architectural.md`, deferred).
- `font-size`: `.text-sm`, `.text-[9px]`, 11px JetBrains Mono SVG text below readable threshold — pre-existing CSS.
- `mainthread-work-breakdown`, `unused-javascript`, `legacy-javascript`, `forced-reflow-insight`, `network-dependency-tree-insight` — pre-existing perf audits surfaced by Lighthouse 12 (the LHCI categorization for v1.8 was set against the existing baseline).

These predate Plan 02 and are out of scope per SCOPE BOUNDARY in execute-plan deviation rules. They are not blockers for Plan 02 specifically — they are open Phase 62 / future-milestone tracking items.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Pre-existing @typescript-eslint/consistent-type-imports errors in 2 test files**
- **Found during:** Task 60-02-02 (running `pnpm lint` in the verify chain)
- **Issue:** `tests/v1.8-phase58-lcp-guard.spec.ts` and `tests/v1.8-phase59-anton-swap-cls.spec.ts` use inline `import("@playwright/test").Page` type annotations rather than top-level type imports. Pre-existing — last touched in commits 7ee6770 (Phase 58) and e2bd273 (Phase 59). Plan 01 did not run `pnpm lint`, so the errors were not surfaced earlier; Plan 02 Task 60-02-02 verify chain DOES run `pnpm lint` and exits 1 without the fix.
- **Fix:** 4-character change in each file: replace `import("@playwright/test").Page` with `Page`, and add `type Page` to the existing top-level `import { test, expect } from "@playwright/test"` statement. Runtime behavior identical — type-only change.
- **Files modified:** `tests/v1.8-phase58-lcp-guard.spec.ts`, `tests/v1.8-phase59-anton-swap-cls.spec.ts`
- **Verification:** `pnpm lint` exits 0 post-fix; `pnpm tsc --noEmit` exits 0.
- **Committed in:** `d8f58b8` (separate from the LCP-02 intervention commit `25bc3c8` to keep the intervention atomic + bisectable)

---

**Total deviations:** 1 auto-fixed (1 Blocking)
**Impact on plan:** Surgical, atomic, separate from the intervention commit. No scope creep; preserves bisectability of Plan 02's primary commit.

## Issues Encountered

### Issue 1 — LCP-01 CLS gate failed (caused by Plan 02 intervention)

**Cause:** `content-visibility: auto` on a `position: absolute` element creates a containment box; the size delta between `containIntrinsicSize` placeholder (80px) and actual rendered size (~84px in LHCI 375x667 mobile emulation) registers as a layout-shift event of 0.002356 score. A single-value `containIntrinsicSize` cannot match all 4 viewport rendered heights (81/88/188/324 px).

**Resolution:** STOPPED execution per critical_constraint #3 D-04 reactive escalation; venue choice escalated to orchestrator/user. See "D-04 Escalation — Venue Decision Required" section below for the three available paths.

### Issue 2 — P02-06 positive-proof failed (intervention did not remove GhostLabel from mobile LCP candidate pool)

**Cause:** Headless Playwright environment with 1500ms candidates-spec settling window paints the GhostLabel during the wait — the browser's content-visibility intersection observer pre-renders near the viewport edge, defeating the deferral on the candidates spec. The LHCI 812ms median LCP win was likely from Phase 59 Anton-swap arrival improvements, not Plan 02's intervention.

**Resolution:** Same — STOPPED execution + escalation venue choice.

### Issue 3 — Lighthouse a11y/BP 0.96 below 0.97 threshold (NOT caused by Plan 02)

**Cause:** Pre-existing footer link target-size + small-font-size audit failures already tracked in `project_phase37_mobile_a11y_architectural.md`; surfaced fresh by post-Phase-59 LHCI run.

**Resolution:** Out-of-scope per SCOPE BOUNDARY; deferred to Phase 62 / future-milestone cleanup. Not a Plan 02 blocker.

## D-04 Escalation — Venue Decision Required

Per Plan 02 critical_constraint #3 + plan §60-02-04 step 6: **executor returns escalation as a checkpoint to the orchestrator; does NOT autonomously open a new plan.**

**Reactive analysis:**

| LCP-02 verbatim option | Status                                        | Applies here?                                     |
|------------------------|-----------------------------------------------|---------------------------------------------------|
| (a) THESIS Anton manifesto reveal `opacity → clip-path` | Not yet shipped | Marginal — THESIS is already opacity-zero pre-reveal; not directly an initial-paint LCP candidate |
| (b) GhostLabel `content-visibility` | **Already shipped** (this plan) — cannot re-ship | The CLS regression + P02-06 failure indicate (b) is fundamentally limited |
| (c) Hero h1 `clip-path` char-reveal in `page-animations.tsx` | Not yet shipped | Wrong viewport target — affects ENTRY hero h1 (desktop), NOT GhostLabel (mobile) |

**The post-intervention candidate spec confirms mobile LCP is STILL the GhostLabel at all 4 viewports — no other LCP-02 verbatim candidate covers this case.** Escalating requires either:

1. **Phase 60 Plan 03 — adjust the (b) intervention shape:**
   - Replace `containIntrinsicSize: "auto 80px"` with breakpoint-specific values via inline media-queried CSS (override at media queries 391+, 769+, 1281+).
   - OR replace `content-visibility: auto` with `content-visibility: hidden` + a client-side IntersectionObserver to manually toggle visibility when scrolled-near (would suppress initial paint entirely).
   - OR drop the `containIntrinsicSize` hint and accept the small CLS, with a documented AES-02 exception.
   - This reshapes (b), still within the LCP-02 verbatim set.

2. **Phase 60.1 decimal phase — ROADMAP/REQUIREMENTS amendment:**
   - Add a new candidate (d) — e.g., `display: none` on the GhostLabel until first scroll, replaced by a client-side reveal.
   - Requires expanding LCP-02's verbatim {(a),(b),(c)} set, which is a documented amendment.

3. **Phase 62 VRF-04 cleanup — defer the CLS regression to milestone end:**
   - Accept the 0.002505 CLS regression as a known trade-off; the LCP timing win (812ms vs 6.5s baseline) is the dominant gain.
   - Roll the CLS fix into Phase 62's final-gate audit alongside other deferred items (a11y target-size, font-size, BP regressions).
   - Real-device gate (D-07) + cohort review (D-08) still need to run; Phase 62 owns those if Phase 60 is closed status human_needed without Wave 3.

**The choice belongs to the orchestrator/user, not the executor.** Each path has different impact on Phase 61 unblock timing and Phase 62 scope.

## Authentication Gates

None encountered.

## User Setup Required

None — no external service configuration required for Plan 02's executed tasks. WebPageTest manual gate (Task 60-02-06) and chrome-devtools MCP cohort review (Task 60-02-07) remain pending and are user-driven by their nature; they are NOT part of "User Setup" but rather tasks gated by the venue decision.

## Pending Tasks (NOT Executed)

- **Task 60-02-05** — record LHCI snapshot path + median row in STATE.md notes. **Status: not started.** Rationale: this task is post-LCP-01-PASS; LCP-01 failed the CLS sub-gate, so progressing forward without venue decision would be premature. The snapshot itself IS captured at `.planning/perf-baselines/v1.8/phase-60-mobile-lhci.json` and committed in `ab95241`; only the cross-reference STATE notes are pending.
- **Task 60-02-06** — Wave 3 D-07 WebPageTest iPhone 13 Safari LTE median-of-5 manual run. **Status: not started.** Gated on Wave 2 PASS per plan critical_constraint #4. Will fire only after escalation venue decision lands AND the chosen intervention reaches Wave 2 PASS.
- **Task 60-02-07** — Wave 3 D-08 chrome-devtools MCP cohort review fresh-eyes pass. **Status: not started.** Same gating as Task 60-02-06.

## Cross-Phase Handoff to Phase 61

**Phase 61 stays BLOCKED.** Phase 60 has not closed APPROVED. Phase 61 reads STATE.md to confirm Phase 60 closure before starting; the orchestrator should NOT advance auto-chain to Phase 61 until the D-04 venue decision is made and the chosen path lands.

## Self-Check: PASSED (partial-completion scope)

All files claimed CREATED / MODIFIED exist on disk. All commits claimed COMMITTED are present in git log. Anti-Pattern #5 grep gates all PASS. PF-04 contract preserved.

| File / commit                                                                              | Status    |
|--------------------------------------------------------------------------------------------|-----------|
| `tests/v1.8-ghost-label-measure.spec.ts`                                                   | FOUND     |
| `.planning/phases/60-lcp-element-repositioning/60-02-wave0-measurements.json`              | FOUND     |
| `tests/v1.8-phase60-aes04-diff.spec.ts`                                                    | FOUND     |
| `.planning/phases/60-lcp-element-repositioning/60-02-aes04-results.md`                     | FOUND     |
| `.planning/perf-baselines/v1.8/phase-60-mobile-lhci.json`                                  | FOUND     |
| `60-02-SUMMARY.md` (this file)                                                             | FOUND     |
| `components/animation/ghost-label.tsx` carries `contentVisibility`                         | PASS      |
| `components/animation/ghost-label.tsx` carries `containIntrinsicSize`                      | PASS      |
| Anti-Pattern #5: components/sf/ + components/blocks/ + app/ clean of content-visibility   | PASS      |
| Anti-Pattern #5: app/globals.css clean of content-visibility                               | PASS      |
| PF-04: `autoResize: true` in components/layout/lenis-provider.tsx                          | PASS      |
| `73a3aeb` (Wave 0 measurement)                                                             | COMMITTED |
| `d8f58b8` (Rule 3 lint fix)                                                                | COMMITTED |
| `25bc3c8` (Wave 1 intervention)                                                            | COMMITTED |
| `fe91895` (Wave 1 AES-04 results)                                                          | COMMITTED |
| `ab95241` (Wave 2 LHCI snapshot + D-04 escalation context)                                 | COMMITTED |
| Plan 02 added zero new dependencies (`git diff 8eb81d1..HEAD package.json` empty)          | PASS      |

NOTE: this `## Self-Check: PASSED` is scoped to what WAS executed (4 of 7 tasks). The plan as a whole is `Status: blocked-on-human-action` — Tasks 60-02-05/06/07 remain pending until the D-04 venue decision lands.

---

*Phase: 60-lcp-element-repositioning*
*Plan: 02*
*Status: blocked-on-human-action (Wave 2 LHCI gate failed; D-04 escalation venue decision pending)*
*Partial completion: 4 of 7 tasks executed; 3 tasks gated on venue decision*
*Recorded: 2026-04-26*
