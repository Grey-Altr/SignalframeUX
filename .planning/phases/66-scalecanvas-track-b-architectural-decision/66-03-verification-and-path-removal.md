---
phase: 66-scalecanvas-track-b-architectural-decision
plan: 03
type: execute
wave: 3
depends_on:
  - "01"
  - "02"
files_modified:
  - tests/v1.9-phase66-arc-axe.spec.ts
  - tests/v1.9-phase66-lhci-config.spec.ts
  - .lighthouseci/lighthouserc.json
  - .lighthouseci/lighthouserc.desktop.json
  - .planning/codebase/scale-canvas-track-b-decision.md
  - .planning/phases/66-scalecanvas-track-b-architectural-decision/66-COHORT-REVIEW.md
autonomous: false
requirements:
  - ARC-02
  - ARC-03
  - ARC-04
must_haves:
  truths:
    - "axe-core direct target-size violations = 0 on `/` mobile (375x667)."
    - "axe-core direct color-contrast violations = 0 on `/` desktop (1440x900) with NO selector exclusion for GhostLabel."
    - "Pixel-diff vs `.planning/visual-baselines/v1.8-start/` <=0.5% on desktop-1440x900 + ipad-834x1194 for all 5 routes (AES-04 strict gate)."
    - "Mobile + iphone13 cohort capture vs `.planning/visual-baselines/v1.9-pre/` recorded; AES-03 cohort review sign-off in 66-COHORT-REVIEW.md."
    - "`_path_h_decision` block absent from `.lighthouseci/lighthouserc.json`; categories.accessibility.minScore=0.97 (was 0.96)."
    - "`_path_i_decision` block absent from `.lighthouseci/lighthouserc.desktop.json`; categories.accessibility.minScore=0.97 (was 0.96)."
    - "Lighthouse mobile a11y category >=0.97 on prod homepage (https://signalframe.culturedivision.com)."
    - "Lighthouse desktop a11y category >=0.97 on prod homepage."
  artifacts:
    - path: "tests/v1.9-phase66-arc-axe.spec.ts"
      provides: "Direct @axe-core/playwright assertions: target-size on mobile, color-contrast on desktop. NO GhostLabel selector exclusion."
    - path: "tests/v1.9-phase66-lhci-config.spec.ts"
      provides: "Schema gate for path_h + path_i removal — reads both lighthouserc files, asserts blocks absent + minScore=0.97."
    - path: ".lighthouseci/lighthouserc.json"
      provides: "Mobile LHCI config — _path_h_decision block REMOVED; categories:accessibility minScore tightened to 0.97."
    - path: ".lighthouseci/lighthouserc.desktop.json"
      provides: "Desktop LHCI config — _path_i_decision block REMOVED; categories:accessibility minScore tightened to 0.97."
    - path: ".planning/codebase/scale-canvas-track-b-decision.md"
      provides: "Updated with Verification Verdicts section — post-implementation evidence + cohort sign-off + LHCI verdicts."
    - path: ".planning/phases/66-scalecanvas-track-b-architectural-decision/66-COHORT-REVIEW.md"
      provides: "AES-03 mobile cohort review record — side-by-side check of v1.9-pre/ vs current mobile + iphone13 captures; user sign-off."
  key_links:
    - from: "tests/v1.9-phase66-arc-axe.spec.ts"
      to: "components/animation/ghost-label.tsx (post-Plan-02)"
      via: "axe-core color-contrast rule on / desktop with NO data-ghost-label exclusion"
      pattern: "color-contrast.*ARC-04"
    - from: "tests/v1.9-phase66-lhci-config.spec.ts"
      to: ".lighthouseci/lighthouserc.json + .desktop.json"
      via: "fs.readFile + JSON.parse + key absence assertion"
      pattern: "_path_h_decision|_path_i_decision"
---

<threat_model>
ASVS L1 default — block on `high`.

- T-66-04 (MEDIUM): axe-core rule regression — future component change re-introduces target-size or color-contrast violations.
  Mitigation: `tests/v1.9-phase66-arc-axe.spec.ts` runs on every PR via existing chromium project. Direct axe-core calls (NOT Lighthouse-bundled) provide deterministic per-rule gating. The color-contrast test explicitly does NOT exclude `[data-ghost-label]` — if a future change resurfaces text to axe (e.g., reverts ARC-04 mechanism), the test fails immediately.

- T-66-05 (LOW): LHCI config rollback — adversary or accidental commit re-introduces `_path_h_decision` or `_path_i_decision` block, silently re-loosening the a11y gate.
  Mitigation: `tests/v1.9-phase66-lhci-config.spec.ts` asserts both blocks absent + minScore=0.97 on every PR. Branch protection (Phase 64) requires PR review.
</threat_model>

<objective>
Verify the Plan 02 implementation, then retire `_path_h_decision` (mobile) and `_path_i_decision` (desktop) ratification blocks from the LHCI configs and tighten a11y minScore from 0.96 to 0.97. This closes Phase 66's success criteria #3 + #4 (ARC-03 + ARC-04 LHCI re-baseline) and #5 (mobile cohort review).

Purpose: Convert pillarbox + pseudo-element from "shipped" to "ratified" — the path_h/path_i loosenings were promises to fix at architectural root; this plan shows the loosenings can be retired AND the prod LHCI runs prove the underlying a11y categories are real >=0.97 not buffered >=0.96.

Output:
- `tests/v1.9-phase66-arc-axe.spec.ts` — direct axe gate (target-size + color-contrast)
- `tests/v1.9-phase66-lhci-config.spec.ts` — config schema gate (path blocks absent + minScore=0.97)
- `.lighthouseci/lighthouserc.json` — `_path_h_decision` removed; minScore 0.96 to 0.97
- `.lighthouseci/lighthouserc.desktop.json` — `_path_i_decision` removed; minScore 0.96 to 0.97
- AES-04 strict pixel-diff verdict (desktop+tablet <=0.5% vs v1.8-start)
- AES-03 mobile cohort review sign-off in `66-COHORT-REVIEW.md`
- LHCI prod verdicts (mobile + desktop a11y >=0.97)
- Updated decision-doc with Verification Verdicts section

Risk: MEDIUM — LHCI threshold tightening may surface unanticipated audit failures (a different rule that was masked by the path loosening). Mitigated by separate failure of axe-core direct (per-rule) from LHCI category (composite) tests — failure mode is identifiable.

Autonomous: false — Task 8 is the AES-03 mobile cohort review, which per AESTHETIC-OF-RECORD §AES-03 is qualitative cohort judgment by the user; Claude cannot self-approve.
</objective>

<execution_context>
@/Users/greyaltaer/.claude/pde-os/engines/gsd/workflows/execute-plan.md
@/Users/greyaltaer/.claude/pde-os/engines/gsd/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/phases/66-scalecanvas-track-b-architectural-decision/66-RESEARCH.md
@.planning/phases/66-scalecanvas-track-b-architectural-decision/66-VALIDATION.md
@.planning/phases/66-scalecanvas-track-b-architectural-decision/66-01-SUMMARY.md
@.planning/phases/66-scalecanvas-track-b-architectural-decision/66-02-SUMMARY.md
@.planning/codebase/scale-canvas-track-b-decision.md
@.planning/codebase/AESTHETIC-OF-RECORD.md
@.lighthouseci/lighthouserc.json
@.lighthouseci/lighthouserc.desktop.json
@tests/phase-38-a11y.spec.ts
@tests/v1.9-phase66-aes04-diff.spec.ts
@components/animation/ghost-label.tsx
@components/layout/scale-canvas.tsx
@app/globals.css

<interfaces>
LHCI config schema (read-only here; the diffs in Tasks 4+5 modify these).

From `.lighthouseci/lighthouserc.json` (current — to be modified in Task 4):
- Top-level keys: `_path_h_decision` (REMOVE), `_path_a_decision` (KEEP — different concern), `_seo_omission_note` (KEEP), `_path_e_decision` (KEEP), `_path_f_decision` (KEEP), `_path_b_decision` (KEEP), `ci` (KEEP, modify minScore inside).
- `ci.assert.assertions["categories:accessibility"][1].minScore`: currently `0.96`; tighten to `0.97`.
- All other assertions UNCHANGED (Phase 66 scope is a11y only).

From `.lighthouseci/lighthouserc.desktop.json` (current — to be modified in Task 5):
- Top-level keys: `_path_i_decision` (REMOVE), `_path_a_decision` (KEEP), `_path_b_decision_note` (KEEP), `_seo_omission_note` (KEEP), `_perf_tbt_omission_note` (KEEP), `_path_g_decision` (KEEP), `ci` (KEEP, modify minScore inside).
- `ci.assert.assertions["categories:accessibility"][1].minScore`: currently `0.96`; tighten to `0.97`.

From `tests/phase-38-a11y.spec.ts:60` — existing AXE_EXCLUDE list contains `[data-ghost-label]`. Plan 03's NEW arc-axe spec must NOT replicate this exclusion — that's the entire point of ARC-04 (suppression at the rendering layer, not the test allowlist layer).

Prod URL: `https://signalframe.culturedivision.com` (per LHCI workflow + per `_path_h_decision.review_gate` mention of "live ... production URL").
</interfaces>
</context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Author tests/v1.9-phase66-arc-axe.spec.ts (direct axe gates for target-size + color-contrast)</name>
  <files>tests/v1.9-phase66-arc-axe.spec.ts</files>
  <read_first>
    - tests/phase-38-a11y.spec.ts (full file — existing AxeBuilder pattern; lines 60-83 — AXE_EXCLUDE pattern; Plan 03 spec must NOT exclude [data-ghost-label])
    - .planning/phases/66-scalecanvas-track-b-architectural-decision/66-RESEARCH.md (§9b Direct axe-core test lines 425-454 — exact test code; §3 mechanism efficacy notes)
    - .planning/phases/66-scalecanvas-track-b-architectural-decision/66-VALIDATION.md (rows `66-03-axe-target` + `66-03-axe-color`)
  </read_first>
  <behavior>
    - Test 1 (target-size mobile): At viewport 375x667 (LHCI mobile profile), navigate to `/`, run AxeBuilder.withRules(["target-size"]).analyze(). Assert results.violations filtered to id="target-size" length = 0. Do NOT exclude any selectors — the test verifies pillarbox restored native sizes.
    - Test 2 (color-contrast desktop): At viewport 1440x900, navigate to `/`, run AxeBuilder.withRules(["color-contrast"]).analyze(). Assert results.violations filtered to id="color-contrast" length = 0. CRITICAL: do NOT add .exclude("[data-ghost-label]") — the test verifies ARC-04 pseudo-element suppression at the axe level, not allowlist circumvention.
    - Test 3 (target-size full WCAG mobile): At viewport 375x667, run AxeBuilder.withTags(["wcag22aa"]). Filter violations to id=target-size. Assert length=0. (Belt-and-suspenders: run via tag-based rule path, not just withRules.)
    - Test 4 (color-contrast full WCAG desktop): At viewport 1440x900, run AxeBuilder.withTags(["wcag2aa"]). Filter to id=color-contrast. Assert length=0.
  </behavior>
  <action>
    Create `tests/v1.9-phase66-arc-axe.spec.ts` based on the RESEARCH §9b code example. Use `@axe-core/playwright@4.11.1` (already in devDependencies per package.json — verified by RESEARCH §9b note).

    Use `test.use({ colorScheme: "light" })` to match phase-38-a11y.spec.ts:70 pattern.

    Use this skeleton structure (with imports):

    - `import AxeBuilder from "@axe-core/playwright"`
    - `test.describe("@v1.9-phase66 ARC direct axe rules", () => { ... })`
    - In each test: `await page.setViewportSize(...)`, `await page.goto("/", { waitUntil: "networkidle" })`, `const results = await new AxeBuilder({ page }).withRules([RULE]).analyze()`, `const violations = results.violations.filter(v => v.id === RULE)`, `expect(violations).toHaveLength(0)`.

    For better error messaging, include `violations.map(v => v.nodes.slice(0, 3).map(n => n.html).join("\n")).join("\n")` in the expect message string.

    NOTE on RED: this spec depends on Plan 02 having shipped. Before Plan 02, target-size at 375x667 fails (post-transform getBoundingClientRect ~10px). Per the dependency chain (Plan 03 depends_on: ["01", "02"]), Plan 02 ships first; this spec is RED only if executed pre-Plan-02.

    Run against `pnpm build && pnpm start` (production build) — direct axe still catches all rule semantics regardless of build mode, but production matches the LHCI measurement target.
  </action>
  <verify>
    <automated>pnpm exec playwright test tests/v1.9-phase66-arc-axe.spec.ts --project=chromium</automated>
  </verify>
  <acceptance_criteria>
    - File `tests/v1.9-phase66-arc-axe.spec.ts` exists.
    - File contains literal `@v1.9-phase66 ARC direct axe rules` describe-block name.
    - File contains literal `withRules(["target-size"])`.
    - File contains literal `withRules(["color-contrast"])`.
    - File does NOT contain `exclude("[data-ghost-label]")` (the entire point of ARC-04 verification).
    - 4 tests under the describe block.
    - All 4 tests PASS green when run against `pnpm build && pnpm start` (post-Plan-02 build).
    - tsc --noEmit passes.
  </acceptance_criteria>
  <done>Direct axe gate green; pillarbox + ARC-04 mechanisms validated at the rule level.</done>
</task>

<task type="auto" tdd="true">
  <name>Task 2: Author tests/v1.9-phase66-lhci-config.spec.ts (RED — assert path blocks absent + minScore=0.97)</name>
  <files>tests/v1.9-phase66-lhci-config.spec.ts</files>
  <read_first>
    - .lighthouseci/lighthouserc.json (full file — current state with `_path_h_decision` at top + `categories:accessibility minScore: 0.96` at line 109)
    - .lighthouseci/lighthouserc.desktop.json (full file — current state with `_path_i_decision` at top + `categories:accessibility minScore: 0.96` at line 92)
    - tests/v1.8-phase63-1-bundle-budget.spec.ts (lines 54-80 — pattern for fs-based config-file schema test)
    - .planning/phases/66-scalecanvas-track-b-architectural-decision/66-VALIDATION.md (rows `66-03-path-h` + `66-03-path-i`)
  </read_first>
  <behavior>
    - Test 1 (path_h removed): Read `.lighthouseci/lighthouserc.json`, parse JSON, assert top-level key `_path_h_decision` does NOT exist (use `!("_path_h_decision" in config)`).
    - Test 2 (mobile minScore=0.97): Read same file, assert `config.ci.assert.assertions["categories:accessibility"][1].minScore === 0.97`.
    - Test 3 (path_i removed): Read `.lighthouseci/lighthouserc.desktop.json`, parse JSON, assert top-level key `_path_i_decision` does NOT exist.
    - Test 4 (desktop minScore=0.97): Read same file, assert `config.ci.assert.assertions["categories:accessibility"][1].minScore === 0.97`.
    - Test 5 (other path blocks UNCHANGED): Both files retain `_path_a_decision`, `_seo_omission_note`, etc. — Phase 66 scope is a11y only, do NOT touch unrelated ratifications. Assert `_path_a_decision` key exists in both files; `_path_e_decision` + `_path_f_decision` exist in mobile config.
  </behavior>
  <action>
    Create `tests/v1.9-phase66-lhci-config.spec.ts` mirroring `tests/v1.8-phase63-1-bundle-budget.spec.ts` fs-read pattern.

    Imports: `import { test, expect } from "@playwright/test"; import { readFileSync } from "node:fs"; import { join } from "node:path";`

    Helpers:
    - `const MOBILE_RC = join(process.cwd(), ".lighthouseci/lighthouserc.json");`
    - `const DESKTOP_RC = join(process.cwd(), ".lighthouseci/lighthouserc.desktop.json");`
    - `function loadConfig(path: string): Record&lt;string, unknown&gt; { return JSON.parse(readFileSync(path, "utf-8")); }`

    Tests in describe block `@v1.9-phase66 LHCI config path_h + path_i removal`:
    1. `path_h_decision absent from lighthouserc.json` — `expect("_path_h_decision" in config).toBe(false)`.
    2. `mobile categories:accessibility minScore = 0.97` — extract `config.ci.assert.assertions["categories:accessibility"]`, verify `[1].minScore === 0.97`.
    3. `path_i_decision absent from lighthouserc.desktop.json` — same pattern, desktop file.
    4. `desktop categories:accessibility minScore = 0.97` — same pattern, desktop file.
    5. `unrelated path_decision blocks preserved` — assert `"_path_a_decision" in mobile` AND `"_path_a_decision" in desktop` AND `"_path_e_decision" in mobile` AND `"_path_f_decision" in mobile` AND `"_path_g_decision" in desktop` all true.

    Run BEFORE Tasks 4+5 to confirm RED-fails (current state: path_h + path_i still present, minScore still 0.96). Commit failing tests before Task 4.
  </action>
  <verify>
    <automated>pnpm exec playwright test tests/v1.9-phase66-lhci-config.spec.ts --project=chromium</automated>
  </verify>
  <acceptance_criteria>
    - File `tests/v1.9-phase66-lhci-config.spec.ts` exists.
    - File contains literal `@v1.9-phase66 LHCI config path_h + path_i removal` describe-block name.
    - File contains literals `_path_h_decision`, `_path_i_decision`, `0.97`.
    - 5 tests under the describe block.
    - Before Tasks 4+5 ship, first run reports 4 FAIL + 1 PASS (path_a preservation passes; the 4 modification asserts fail).
    - tsc --noEmit passes.
  </acceptance_criteria>
  <done>RED test committed; Tasks 4+5 will GREEN it.</done>
</task>

<task type="auto">
  <name>Task 3: Run AES-04 strict pixel-diff (desktop+tablet vs v1.8-start) + capture mobile cohort vs v1.9-pre [BLOCKING]</name>
  <files>.planning/phases/66-scalecanvas-track-b-architectural-decision/66-aes04-postcapture/, .planning/phases/66-scalecanvas-track-b-architectural-decision/66-cohort-results.md</files>
  <read_first>
    - tests/v1.9-phase66-aes04-diff.spec.ts (Plan 01 deliverable — strict + cohort harness)
    - .planning/phases/66-scalecanvas-track-b-architectural-decision/66-RESEARCH.md (§9c AES-04 pixel-diff strategy lines 456-476)
    - .planning/codebase/AESTHETIC-OF-RECORD.md (§AES-04 — 0.5% threshold; §AES-03 — cohort review trigger)
    - .planning/visual-baselines/v1.8-start/ (verify exists; 20 PNGs)
    - .planning/visual-baselines/v1.9-pre/ (verify exists; 20 PNGs from Plan 01 Task 4)
  </read_first>
  <action>
    Run the Plan 01 AES-04 harness against the post-Plan-02 build.

    Step A — Build prod (BND-04 stale-chunk guard per v1.8 standing rule):
    - `rm -rf .next/cache .next`
    - `pnpm build`
    - Start `pnpm start` in background; capture PID; sleep 5 to let server boot.

    Step B — Run strict (desktop+tablet vs v1.8-start, hard gate <=0.5%):
    - `pnpm exec playwright test tests/v1.9-phase66-aes04-diff.spec.ts --grep "strict" --project=chromium --workers=1`
    - EXPECTED: 10 tests (5 routes x 2 viewports = desktop-1440x900 + ipad-834x1194), all PASS with diffPct <=0.5.
    - If any FAIL: HARD STOP — Plan 02 broke desktop or tablet aesthetic; investigate before proceeding.

    Step C — Run cohort (mobile+iphone13 vs v1.9-pre, capture-only):
    - `pnpm exec playwright test tests/v1.9-phase66-aes04-diff.spec.ts --grep "cohort" --project=chromium --workers=1`
    - EXPECTED: 10 tests (5 routes x 2 viewports = mobile-360x800 + iphone13-390x844). All "pass" (capture-only — no fail-on-diffPct), but `66-cohort-results.md` is written with the diffPct table for each route x viewport.

    Step D — Cleanup: kill background server PID.

    Step E — Inspect cohort results: read `.planning/phases/66-scalecanvas-track-b-architectural-decision/66-cohort-results.md`. The diffPct values WILL be high (mobile rendered at scale=1 vs v1.9-pre at scale=0.28 — very different captures). That's BY DESIGN — pillarbox is a layout-mode flip on mobile, not a no-change. Cohort review (Task 8) is the qualitative gate, not the diffPct.

    BLOCKING: if Step B (strict) FAILS, STOP this plan. Investigation order:
    1. Check `--sf-vw` was not modified (RESEARCH Pitfall 5).
    2. Check `app/globals.css` height-remap rules at lines 2784-2809 unchanged.
    3. Check `--radius: 0px` and other `--sfx-*` tokens unchanged.
    4. Check that desktop+tablet viewports (1440 + 834) are correctly above sm=640 and pillarbox branch is NOT firing for them.

    Strict failure means Plan 02 needs revision; do NOT remove the path_h/path_i blocks until strict is green.
  </action>
  <verify>
    <automated>pnpm exec playwright test tests/v1.9-phase66-aes04-diff.spec.ts --grep "strict" --project=chromium --workers=1</automated>
  </verify>
  <acceptance_criteria>
    - Strict block (5 routes x 2 viewports = 10 tests) all PASS — every diffPct <=0.5%.
    - Cohort block (5 routes x 2 viewports = 10 tests) all execute (skip flag from Plan 01 Task 3 cleared because v1.9-pre/ exists).
    - File `.planning/phases/66-scalecanvas-track-b-architectural-decision/66-cohort-results.md` exists with the 10-row diffPct table for cohort viewports.
    - File `.planning/phases/66-scalecanvas-track-b-architectural-decision/66-aes04-postcapture/` directory exists with 20 PNGs (transient capture).
  </acceptance_criteria>
  <done>BLOCKING gate cleared on strict desktop+tablet; cohort table ready for Task 8 human review.</done>
</task>

<task type="auto">
  <name>Task 4: Remove _path_h_decision block from .lighthouseci/lighthouserc.json + tighten minScore 0.96 to 0.97 [BLOCKING]</name>
  <files>.lighthouseci/lighthouserc.json</files>
  <read_first>
    - .lighthouseci/lighthouserc.json (full file — currently 134 lines; lines 2-16 are the `_path_h_decision` block to remove; line 109 is `minScore: 0.96` to tighten)
    - .planning/phases/66-scalecanvas-track-b-architectural-decision/66-RESEARCH.md (§9a Lighthouse re-baseline strategy lines 412-422 — exact edit instructions)
  </read_first>
  <action>
    Edit `.lighthouseci/lighthouserc.json` with two surgical changes:

    Change 1 — Delete the entire `_path_h_decision` block.
    Remove lines 2-16 inclusive (the block opens with `"_path_h_decision": {` and closes with `},` after `"ratified_to_main_via": "PR #4 ..."`). The file should retain lines 1 (`{`), 17+ (next sibling key `"_path_a_decision":`).

    Change 2 — Tighten mobile a11y minScore from 0.96 to 0.97.
    Locate the `"categories:accessibility"` assertion at lines 108-111:
    ```
    "categories:accessibility": [
      "error",
      { "minScore": 0.96, "aggregationMethod": "median-run" }
    ],
    ```
    Replace `0.96` with `0.97`:
    ```
    "categories:accessibility": [
      "error",
      { "minScore": 0.97, "aggregationMethod": "median-run" }
    ],
    ```

    Do NOT touch any other path_decision blocks (`_path_a_decision`, `_path_e_decision`, `_path_f_decision`, `_path_b_decision`, `_seo_omission_note` — all preserved per Phase 66 scope = a11y only).
    Do NOT touch any other minScore values (perf, best-practices) or maxNumericValue (LCP, CLS, TBT) — Phase 66 scope is a11y only.

    Validate JSON parses with `node -e "JSON.parse(require('fs').readFileSync('.lighthouseci/lighthouserc.json'))"` after edit.
  </action>
  <verify>
    <automated>node -e "const c = require('./.lighthouseci/lighthouserc.json'); if ('_path_h_decision' in c) process.exit(1); if (c.ci.assert.assertions['categories:accessibility'][1].minScore !== 0.97) process.exit(2); process.exit(0)"</automated>
  </verify>
  <acceptance_criteria>
    - `.lighthouseci/lighthouserc.json` is valid JSON (parses without error).
    - File does NOT contain literal `_path_h_decision`.
    - File contains `"minScore": 0.97` under `categories:accessibility` (verified by node JSON.parse path).
    - File RETAINS `_path_a_decision`, `_path_e_decision`, `_path_f_decision`, `_path_b_decision`, `_seo_omission_note` keys (Phase 66 scope = a11y only, NOT a sweep).
    - Test 1 + Test 2 + Test 5 in `tests/v1.9-phase66-lhci-config.spec.ts` PASS.
  </acceptance_criteria>
  <done>Mobile path_h retired; minScore tightened.</done>
</task>

<task type="auto">
  <name>Task 5: Remove _path_i_decision block from .lighthouseci/lighthouserc.desktop.json + tighten minScore 0.96 to 0.97 [BLOCKING]</name>
  <files>.lighthouseci/lighthouserc.desktop.json</files>
  <read_first>
    - .lighthouseci/lighthouserc.desktop.json (full file — currently 113 lines; lines 2-17 are the `_path_i_decision` block to remove; line 92 is `minScore: 0.96`)
    - .planning/phases/66-scalecanvas-track-b-architectural-decision/66-RESEARCH.md (§9a + Pitfall 7 lines 665-667 — confirm desktop config location)
  </read_first>
  <action>
    Edit `.lighthouseci/lighthouserc.desktop.json` with two surgical changes:

    Change 1 — Delete the entire `_path_i_decision` block.
    Remove lines 2-17 inclusive (block opens with `"_path_i_decision": {` and closes with `},` after `"ratified_to_main_via": "PR #4 ..."`). File retains lines 1 (`{`) and 18+ (next sibling `"_path_a_decision":`).

    Change 2 — Tighten desktop a11y minScore from 0.96 to 0.97.
    Locate `"categories:accessibility"` assertion at lines 90-93. Replace `0.96` with `0.97`.

    Do NOT touch any other path blocks (`_path_a_decision`, `_path_b_decision_note`, `_seo_omission_note`, `_perf_tbt_omission_note`, `_path_g_decision` — all preserved).
    Do NOT touch other minScore values or maxNumericValue (LCP, CLS).

    Validate JSON parses.
  </action>
  <verify>
    <automated>node -e "const c = require('./.lighthouseci/lighthouserc.desktop.json'); if ('_path_i_decision' in c) process.exit(1); if (c.ci.assert.assertions['categories:accessibility'][1].minScore !== 0.97) process.exit(2); process.exit(0)"</automated>
  </verify>
  <acceptance_criteria>
    - `.lighthouseci/lighthouserc.desktop.json` is valid JSON.
    - File does NOT contain literal `_path_i_decision`.
    - File contains `"minScore": 0.97` under `categories:accessibility`.
    - File RETAINS `_path_a_decision`, `_path_b_decision_note`, `_seo_omission_note`, `_perf_tbt_omission_note`, `_path_g_decision` keys.
    - Test 3 + Test 4 + Test 5 in `tests/v1.9-phase66-lhci-config.spec.ts` PASS.
  </acceptance_criteria>
  <done>Desktop path_i retired; minScore tightened; full lhci-config schema gate green.</done>
</task>

<task type="auto">
  <name>Task 6: Run prod LHCI mobile + desktop on https://signalframe.culturedivision.com — verify a11y >=0.97 on both [BLOCKING]</name>
  <files>.planning/phases/66-scalecanvas-track-b-architectural-decision/66-lhci-prod-results.md</files>
  <read_first>
    - .lighthouseci/lighthouserc.json (post-Task-4 — confirms 0.97 threshold)
    - .lighthouseci/lighthouserc.desktop.json (post-Task-5 — confirms 0.97 threshold)
    - .planning/phases/66-scalecanvas-track-b-architectural-decision/66-RESEARCH.md (§9a + Pitfall 8 lines 669-671)
  </read_first>
  <action>
    Pre-condition: Plan 02's pillarbox + ARC-04 changes must be live on `https://signalframe.culturedivision.com` for prod LHCI to measure the new behavior. Per ROADMAP §v1.9 build-order constraints, Phase 66's PRs must be merged + deployed BEFORE this task runs. If main isn't deployed yet, the prod URL still reflects v1.8 behavior; LHCI will fail at 0.97 threshold (because the path_h/path_i blocks are gone but the a11y issue isn't fixed yet on the live URL).

    Coordination: ship Plan 02 + Tasks 1-5 to a PR; merge to main; await Vercel auto-deploy; then run this task.

    Step A — Run mobile LHCI:
    - `pnpm exec lhci autorun --collect.url=https://signalframe.culturedivision.com`
    - EXPECTED: 5-run median categories:accessibility >=0.97 (the new tightened threshold). LHCI exits 0 if all assertions pass, non-zero on assertion fail.

    Step B — Run desktop LHCI:
    - `pnpm exec lhci autorun --config=.lighthouseci/lighthouserc.desktop.json --collect.url=https://signalframe.culturedivision.com`
    - EXPECTED: 5-run median categories:accessibility >=0.97.

    Step C — Capture results in markdown.
    Write `.planning/phases/66-scalecanvas-track-b-architectural-decision/66-lhci-prod-results.md` with sections:
    - Captured timestamp, URL, build SHA.
    - Mobile (lighthouserc.json): per-run a11y scores [r1..r5], median, gate >=0.97, Verdict: PASS|FAIL.
    - Desktop (lighthouserc.desktop.json): same.
    - Evidence: LHR JSON storage URLs from LHCI output.

    BLOCKING: if either run fails (median <0.97), STOP. Per RESEARCH Pitfall 8 — direct axe (Plan 03 Task 1) is not LHCI-bundled axe; if LHCI catches a rule the direct axe missed, investigate WHICH rule and either fix at root or escalate (do NOT re-introduce path_h/path_i unless explicitly re-ratified). The path_decisions are retired, not paused.

    Reference for failure mode: per Phase 60 + 64 history, prod LHCI runs are deterministic across 5 runs (preview LHCI is the variance source — see `feedback_lhci_preview_artifacts.md`). Failure here would be a real semantic issue, not measurement noise.
  </action>
  <verify>
    <automated>test -f .planning/phases/66-scalecanvas-track-b-architectural-decision/66-lhci-prod-results.md</automated>
  </verify>
  <acceptance_criteria>
    - Mobile LHCI run completes; median categories:accessibility >=0.97.
    - Desktop LHCI run completes; median categories:accessibility >=0.97.
    - File `66-lhci-prod-results.md` exists with both sections + per-run scores + medians + Verdict: PASS for each.
    - LHR JSON URLs captured in evidence section.
  </acceptance_criteria>
  <done>BLOCKING prod gate cleared; ARC-03 + ARC-04 ratified on the live URL.</done>
</task>

<task type="auto">
  <name>Task 7: Update .planning/codebase/scale-canvas-track-b-decision.md with Verification Verdicts section</name>
  <files>.planning/codebase/scale-canvas-track-b-decision.md</files>
  <read_first>
    - .planning/codebase/scale-canvas-track-b-decision.md (post-Plan-01 state — the "Verification Verdicts" section currently reads "Pending Plan 03 execution")
    - .planning/phases/66-scalecanvas-track-b-architectural-decision/66-02-SUMMARY.md (Plan 02 close-out evidence)
    - .planning/phases/66-scalecanvas-track-b-architectural-decision/66-cohort-results.md (Task 3 output)
    - .planning/phases/66-scalecanvas-track-b-architectural-decision/66-lcp-postcapture.md (Plan 02 Task 6 output)
    - .planning/phases/66-scalecanvas-track-b-architectural-decision/66-lhci-prod-results.md (Task 6 output)
  </read_first>
  <action>
    Replace the "## Verification Verdicts (Updated by Plan 03)" section in `.planning/codebase/scale-canvas-track-b-decision.md` with concrete results.

    The new section heading must read: `## Verification Verdicts (Plan 03 Closure)` and include sub-headings for each ARC requirement plus an LCP Stability sub-section, a Deviations sub-section, and a Phase 66 Closure sub-section.

    Required sub-headings (literal):
    - `### ARC-02 (architectural)` — pillarbox-transform spec results 5/5; identity matrix at 360x667; non-identity at 1440x900; cross-resize settle time.
    - `### ARC-02 (AES-04 strict desktop+tablet)` — 10/10 strict tests PASS; max diffPct from Task 3 results.
    - `### ARC-02 (AES-03 mobile cohort)` — sign-off from 66-COHORT-REVIEW.md (Task 8); APPROVED|ESCALATED verdict.
    - `### ARC-03 (target-size)` — arc-axe target-size mobile PASS; LHCI prod mobile a11y verdict; `_path_h_decision` REMOVED.
    - `### ARC-04 (color-contrast)` — arc-axe color-contrast desktop PASS (no exclusion); mobile LCP candidate post-suppression details from 66-lcp-postcapture.md; LHCI prod desktop a11y verdict; `_path_i_decision` REMOVED.
    - `### LCP Stability (RESEARCH Pitfall 2)` — lcp-stability spec results 5/5; mobile LCP candidate selector; desktop LCP unchanged from v1.8.
    - `### Deviations` — list any deviations from RESEARCH HIGH-confidence pillarbox path; expected: none.
    - `### Phase 66 Closure` — all 4 ARC reqs SATISFIED; 6 spec files committed; 1 baseline directory committed; 2 LHCI configs simplified.

    Replace placeholder values (e.g., `{fill from Task 3 results}`) with actual numbers from Task 3 + Task 6 outputs. The cohort review row references 66-COHORT-REVIEW.md from Task 8.
  </action>
  <verify>
    <automated>grep -q "Verification Verdicts (Plan 03 Closure)" .planning/codebase/scale-canvas-track-b-decision.md</automated>
  </verify>
  <acceptance_criteria>
    - File contains literal `## Verification Verdicts (Plan 03 Closure)`.
    - File contains literal `### ARC-02 (architectural)`.
    - File contains literal `### ARC-03 (target-size)`.
    - File contains literal `### ARC-04 (color-contrast)`.
    - File contains literal `### LCP Stability`.
    - File contains literal `### Phase 66 Closure`.
    - All numeric placeholders replaced with concrete values from Task 3 + Task 6.
    - Cohort row references 66-COHORT-REVIEW.md.
  </acceptance_criteria>
  <done>Decision-doc finalized with verification evidence.</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 8: AES-03 mobile cohort review — user sign-off in 66-COHORT-REVIEW.md</name>
  <files>.planning/phases/66-scalecanvas-track-b-architectural-decision/66-COHORT-REVIEW.md</files>
  <read_first>
    - .planning/codebase/AESTHETIC-OF-RECORD.md (§AES-03 standing rule — "feels different without specific code-change cause" is the failure signal)
    - .planning/phases/66-scalecanvas-track-b-architectural-decision/66-cohort-results.md (Task 3 output — diffPct numbers; informational only, NOT the gate)
    - .planning/visual-baselines/v1.9-pre/ (pre-mutation captures from Plan 01 Task 4)
    - .planning/phases/66-scalecanvas-track-b-architectural-decision/66-aes04-postcapture/ (post-mutation captures from Task 3)
  </read_first>
  <what-built>
    Plan 02's pillarbox + ARC-04 mechanism is shipped. Mobile (360x800) and iPhone 13 (390x844) viewports now render at native pixel sizes (transform=none) instead of `transform: scale(0.28)`. This is a deliberate layout-mode flip — the cohort review accepts the new mode as a valid mobile expression. Per AES-03, the failure signal is "feels different without specific code-change cause" — the change has a clear code-change cause (Phase 66 ARC-02 pillarbox), so the question is qualitative aesthetic acceptance: do the new mobile captures honor SignalframeUX's Detroit Underground / The Designers Republic register?
  </what-built>
  <how-to-verify>
    1. Open `.planning/visual-baselines/v1.9-pre/home-mobile-360x800.png` (pre-mutation, scale=0.28).
    2. Open `.planning/phases/66-scalecanvas-track-b-architectural-decision/66-aes04-postcapture/home-mobile-360x800.png` (post-mutation, scale=1).
    3. Side-by-side review using image viewer of choice. Repeat for `home-iphone13-390x844.png`, `system-mobile-360x800.png`, `system-iphone13-390x844.png`, `inventory-mobile-*.png`, `init-mobile-*.png`, `reference-mobile-*.png` — all 10 cohort viewports.
    4. For each route x viewport, ask: "Does this feel like SignalframeUX? Does it honor DU/TDR register? Are trademarks T1/T2/T3 still legible?"
    5. Spot-check on real iPhone via chrome-devtools MCP if needed (per `feedback_visual_verification.md` — green Playwright tests on DOM shape != working visual).

    Specific checks:
    - Hero "SIGNALFRAME//UX" wordmark — does it dominate the mobile viewport (expected: yes, native size now ~70-90px)?
    - GhostLabel "THESIS" / "SYSTEM" — does it sit behind section content as wayfinding (expected: yes, native 200-400px clamp floor; pseudo-element rendering preserves opacity)?
    - Trademark T2 nav glyph — readable + functional?
    - Trademark T3 cube-tile box — preserved?
    - Footer link target sizes — clearly tappable (now native 24px+ instead of post-transform 6.7px)?
    - Color, spacing, typography scale — register matches DU/TDR?

    Authoring `66-COHORT-REVIEW.md`:
    Create the file with required sections:
    - Header: review date, reviewer (user), routes reviewed, viewports reviewed.
    - Per-route table: route, viewport, verdict (APPROVED|ESCALATE), notes.
    - Trademark check: T1/T2/T3 preserved Y/N per route.
    - Final verdict: APPROVED (mobile cohort review passes, Phase 66 may close) OR ESCALATE (provide specific issues; trigger fallback to portal mechanism per RESEARCH §3c if pillarbox cohort fails).
    - Sign-off: user types "approved" OR "escalated: <reason>".
  </how-to-verify>
  <resume-signal>
    Type "approved" if cohort review passes; "escalated: &lt;reason&gt;" if cohort fails and pillarbox needs reconsideration. On "escalated", Plan 02 must revisit mechanism choice per RESEARCH §3c portal fallback OR re-think breakpoint per RESEARCH §5a (md=768 instead of sm=640) — file content recorded in 66-COHORT-REVIEW.md captures the escalation rationale.
  </resume-signal>
  <acceptance_criteria>
    - File `.planning/phases/66-scalecanvas-track-b-architectural-decision/66-COHORT-REVIEW.md` exists.
    - File contains literal review date + reviewer + per-route verdict table.
    - File contains literal final verdict line: either "APPROVED" or "ESCALATED".
    - If APPROVED: Phase 66 may close.
    - If ESCALATED: Phase 66 returns to Plan 02 mechanism reconsideration; do NOT close.
  </acceptance_criteria>
  <done>AES-03 cohort review recorded; Phase 66 close gate cleared (or escalated).</done>
</task>

</tasks>

<verification>
Plan 03 phase-level checks:

1. `pnpm exec playwright test tests/v1.9-phase66-arc-axe.spec.ts --project=chromium` — 4/4 PASS.
2. `pnpm exec playwright test tests/v1.9-phase66-lhci-config.spec.ts --project=chromium` — 5/5 PASS.
3. `pnpm exec playwright test tests/v1.9-phase66-aes04-diff.spec.ts --grep strict --project=chromium` — 10/10 PASS.
4. `node -e "const c = require('./.lighthouseci/lighthouserc.json'); console.log('_path_h_decision' in c, c.ci.assert.assertions['categories:accessibility'][1].minScore)"` — outputs `false 0.97`.
5. `node -e "const c = require('./.lighthouseci/lighthouserc.desktop.json'); console.log('_path_i_decision' in c, c.ci.assert.assertions['categories:accessibility'][1].minScore)"` — outputs `false 0.97`.
6. Prod LHCI mobile + desktop both report median categories:accessibility >=0.97 (recorded in `66-lhci-prod-results.md`).
7. `66-COHORT-REVIEW.md` exists with APPROVED verdict (or ESCALATED with documented reason).
8. `.planning/codebase/scale-canvas-track-b-decision.md` contains `## Verification Verdicts (Plan 03 Closure)`.
</verification>

<success_criteria>
- ARC-02 verified: pillarbox-transform spec 5/5; AES-04 strict 10/10; AES-03 cohort sign-off recorded.
- ARC-03 verified: arc-axe target-size mobile 0 violations; LHCI prod mobile a11y >=0.97; path_h removed.
- ARC-04 verified: arc-axe color-contrast desktop 0 violations (no exclusion); LHCI prod desktop a11y >=0.97; path_i removed; mobile LCP candidate stable.
- All 4 v1.9 ARC requirements SATISFIED.
- Phase 66 closes — all 5 ROADMAP success criteria met.
</success_criteria>

<output>
After completion, create `.planning/phases/66-scalecanvas-track-b-architectural-decision/66-03-SUMMARY.md` documenting:
- Spec test outcomes (arc-axe 4/4, lhci-config 5/5, aes04-diff strict 10/10, aes04-diff cohort 10/10)
- LHCI prod results (mobile + desktop a11y medians)
- AES-03 cohort review verdict + any escalation rationale
- Files modified summary (LHCI configs + decision-doc + 4 new specs + cohort review markdown)
- Phase 66 closure status: SATISFIED | ESCALATED
- Pointer to next phase: Phase 67 (BND) is NOT parallel-safe with Phase 66; Phase 68 (TST) is parallel-safe; Phase 69 (WMK) is parallel-safe; Phase 70 (VRF) starts day-1 anyway.
</output>
