---
phase: 73-sfricheditor
plan: 03
subsystem: rich-text-editor
tags: [TST-03, RE-05, playwright, axe-core, vacuous-green-guard, bundle-audit, nyquist-compliant, phase-closeout]
requirements:
  - TST-03
  - RE-05
dependency_graph:
  requires:
    - "Plan 02 SFRichEditor + SFRichEditorLazy + dev-playground fixture (commits a1fd1cf, 2cec6b9, fba56b5)"
    - "Plan 02 gap-closure: shouldRerenderOnTransaction:true on useEditor at sf-rich-editor.tsx:141 (commit 65a2002, Tiptap v3 default flip mitigation)"
    - "Phase 71/72 axe spec precedent at tests/v1.10-phase71-sf-data-table-axe.spec.ts and tests/v1.10-phase72-sf-combobox-axe.spec.ts (vacuous-green guard pattern + per-rule sharp scans)"
    - "@axe-core/playwright + @playwright/test already installed (Phase 71 cohort)"
  provides:
    - "tests/v1.10-phase73-sf-rich-editor.spec.ts — 10 acceptance tests covering RE-01/02/03 (toolbar role + 13 buttons + Bold reactivity, Link prompt dialog, controlled API + onChange + readOnly + defaultValue, Escape focus-return)"
    - "tests/v1.10-phase73-sf-rich-editor-axe.spec.ts — 5 axe tests across 3 fixture states (empty / with-content / read-only) + 2 structural assertions (toolbar role + 13 aria-labelled buttons; section[aria-label='Rich text editor'] region landmark) under MANDATORY vacuous-green guard"
    - "73-VALIDATION.md sign-off with nyquist_compliant=true + 18 populated per-task verification rows + all 6 Sign-Off boxes checked + Wave 0 fully complete"
    - "Bundle audit closeout evidence: homepage / First Load JS 187.7 KB gzip / 200 KB budget (12.3 KB headroom UNCHANGED from Plan 02 baseline); @tiptap/* + prosemirror-* + starter.kit ABSENT from /page manifest (PASS)"
  affects:
    - "Phase 73 phase-level closeout — all 8 requirements (RE-01..06, DEP-02, TST-03) validated; Phase 74 (SFFileUpload) unblocked per ROADMAP"
    - "v1.10 milestone progression: 3 of 5 components shipped (SFDataTable, SFCombobox, SFRichEditor); 2 remaining (SFFileUpload Phase 74, SFDateRangePicker Phase 75); REG-01 same-commit registry cohort lands at Phase 76"
    - "Plan 02 retroactive validation — the gap-closure (commit 65a2002) is now under regression-test coverage via the Bold data-active acceptance test in tests/v1.10-phase73-sf-rich-editor.spec.ts:117"
tech-stack:
  added: []
  patterns:
    - "Vacuous-green guard MANDATORY: every axe.analyze() call preceded by toBeVisible({timeout:10000}) on [contenteditable=\"true\"] (or [contenteditable] for read-only) — without this gate, axe scans the SFSkeleton loading state and reports zero violations trivially. Phase 71/72 precedent extended to ProseMirror surfaces."
    - "Dialog-handler ordering for window.prompt: page.once(\"dialog\", handler) attached BEFORE the click that triggers the modal prompt, capturing dialog.type() inside the handler closure for post-click assertion. waitForEvent('dialog')/await pattern hangs because window.prompt blocks the click promise until dismissed."
    - "Per-rule sharp scans via AxeBuilder().include(testid-section): isolates fixture-state regressions from sibling-section noise. Mirrors Phase 71 SFDataTable + Phase 72 SFCombobox _path_p_decision pattern."
    - "Bundle audit closeout: clean ANALYZE=true pnpm build (rm -rf .next/cache .next first) + node manifest probe + bundle-budget spec — three independent gates that triangulate the same RE-05 invariant (Tiptap stays in lazy chunk, homepage stays under 200 KB)."
key-files:
  created:
    - "tests/v1.10-phase73-sf-rich-editor.spec.ts (177 lines, 10 tests)"
    - "tests/v1.10-phase73-sf-rich-editor-axe.spec.ts (173 lines, 5 tests)"
    - ".planning/phases/73-sfricheditor/73-03-SUMMARY.md (this file)"
  modified:
    - ".planning/phases/73-sfricheditor/73-VALIDATION.md (scaffold replaced with 18 populated per-task rows, all 5 Wave 0 boxes checked, all 6 Sign-Off boxes checked, nyquist_compliant=true, status=closed)"
decisions:
  - "Used page.once(\"dialog\", handler) BEFORE the Link button click to capture window.prompt — the waitForEvent('dialog') pattern hung the click because the modal prompt blocks until dismissed, and the dismissal happens AFTER the await on the dialog promise. page.once attaches the handler synchronously before the click, capturing dialog.type() inside the handler closure."
  - "Five test cases in axe spec (3 fixture-state scans + 2 structural assertions) instead of one wide-rule scan: belt-and-suspenders verification of toolbar coverage (>=13 aria-labelled buttons) AND section[aria-label='Rich text editor'] landmark catches future regressions even if axe loosens its rule set."
  - "Bundle audit performed via three independent gates: (1) clean ANALYZE build + manifest regex probe; (2) tests/v1.8-phase63-1-bundle-budget.spec.ts gzip-summed chunk count; (3) Next.js CLI Route table First Load column. Triangulation reduces single-point-of-failure risk; the 187.7 KB gzip-summed measurement is what governs the BND-06 200 KB hard constraint."
  - "VALIDATION.md per-task rows include 73-02-07 documenting the Plan 02 gap-closure (shouldRerenderOnTransaction:true) — this is the regression-test anchor for the Tiptap v3 default-flip class of bug. Future Tiptap upgrades that break the toolbar reactivity will fire the Bold data-active acceptance test."
  - "Did NOT modify the component during Plan 03. The gap-closure was already landed at commit 65a2002 before Plan 03 began. Per the previous_attempt_context, the prior executor's checkpoint was discharged inline by the orchestrator, leaving Plan 03 with a fully working impl + a green test target."
metrics:
  duration_seconds: 456
  tasks_completed: 3
  commits: 3
  files_created: 3
  files_modified: 1
  total_loc_added: 387
  homepage_first_load_js_kb: 187.7
  homepage_budget_kb: 200
  homepage_headroom_kb: 12.3
  delta_from_plan_02: 0
  bundle_budget_spec: PASS
  tiptap_in_homepage_chunks: PASS
  tests_acceptance: "10/10"
  tests_axe: "5/5"
  tests_bundle_budget: "1/1"
  tests_total: "15/15 + 1/1 = 16/16"
  completed_date: "2026-05-02"
---

# Phase 73 Plan 03: Evidence Wave + Phase Closeout Summary

The evidence wave for SFRichEditor: 10 Playwright acceptance tests + 5 axe-core WCAG AA tests + bundle audit closeout + VALIDATION.md sign-off. Plan 02 was already shipped (3 commits) plus the gap-closure (1 commit at `65a2002`); Plan 03 proves it satisfies every spec predicate from `73-RESEARCH.md` Validation Architecture and freezes Phase 73 as ship-ready.

## Three-Commit Execution Trail

| Commit | Task | Files | Insertions | Purpose |
|--------|------|-------|------------|---------|
| `48ca818` | Task 1 | `tests/v1.10-phase73-sf-rich-editor.spec.ts` (created) | +177 | 10 acceptance tests: vacuous-green beforeEach, controlled API + onChange, readOnly toolbar absent + contenteditable=false, defaultValue, toolbar role + 13 buttons, Bold data-active reactivity (gap-closure regression coverage), Link prompt dialog, Escape focus-return |
| `87f336c` | Task 2 | `tests/v1.10-phase73-sf-rich-editor-axe.spec.ts` (created) | +173 | 5 axe tests: 3 scoped fixture-state scans (empty / with-content+bold-active / read-only) + 2 structural assertions (toolbar coverage + region landmark). MANDATORY vacuous-green guard before every analyze() |
| `9b88c7d` | Task 3 | `.planning/phases/73-sfricheditor/73-VALIDATION.md` (modified) | +37 / -18 | Per-task verification map populated (18 rows, all green); Wave 0 + Sign-Off all checked; `nyquist_compliant: true` + `status: closed` in frontmatter |

Total LOC across 3 task files: 387.

## End-to-End Verification (12 gates)

| # | Gate | Command | Expected | Actual |
|---|------|---------|----------|--------|
| 1 | Acceptance spec | `pnpm exec playwright test tests/v1.10-phase73-sf-rich-editor.spec.ts --project=chromium` | 10/10 PASS | **10/10 PASS** |
| 2 | Axe spec | `pnpm exec playwright test tests/v1.10-phase73-sf-rich-editor-axe.spec.ts --project=chromium` | 5/5 PASS, 0 violations | **5/5 PASS, 0 violations** |
| 3 | Bundle budget | `pnpm exec playwright test tests/v1.8-phase63-1-bundle-budget.spec.ts --project=chromium` | PASS ≤ 200 KB | **PASS at 187.7 KB / 200 KB** |
| 4 | Tiptap manifest probe | `node -e "..." regex /tiptap\|prosemirror\|starter.kit/` against `/page` chunks | exit 0 (PASS) | **PASS, exit 0** |
| 5 | Pattern B barrel | `grep -c "sf-rich-editor\|SFRichEditor" components/sf/index.ts` | 0 | **0** |
| 6 | D-04 lock | `grep -c "@tiptap" next.config.ts` | 0 | **0** |
| 7 | Registry deferral (json) | `grep -c "sf-rich-editor" public/r/registry.json` | 0 | **0** |
| 8 | Registry deferral (file) | `test -f public/r/sf-rich-editor.json` | absent | **absent** |
| 9 | RE-06 H4-H6 absence | `grep -c "level: [456]" components/sf/sf-rich-editor.tsx` | 0 | **0** |
| 10 | RE-06 floating-toolbar absence | `grep -c "BubbleMenu\|FloatingMenu" components/sf/sf-rich-editor.tsx` | 0 | **0** |
| 11 | RE-06 font/color absence | `grep -c "FontFamily\|TextStyle" components/sf/sf-rich-editor.tsx` | 0 | **0** |
| 12 | VALIDATION.md sign-off | `grep -q "nyquist_compliant: true"` + 6 boxes + ≥10 green rows | all true | **20 green rows, 6 boxes, nyquist=true** |

## Phase 73 Requirement Coverage (8/8)

| Requirement | Validation Source | Status |
|-------------|-------------------|--------|
| **RE-01** Toolbar buttons + active state | acceptance spec: toolbar role + 13 button labels + Bold `data-active` post-click; gap-closure regression test | ✅ |
| **RE-02** Link / inline-code / code-block | acceptance spec: Link button opens window.prompt dialog (page.once handler); 13 toolbar labels include "Inline code" + "Code block" | ✅ |
| **RE-03** Controlled API + readOnly + defaultValue | acceptance spec: 5 tests on controlled value/onChange + readOnly toolbar absent + contenteditable=false + defaultValue init + Escape focus-return | ✅ |
| **RE-04** CSS isolation (`@layer signalframeux`) | Plan 01 (commit `b1ef026`); Plan 02 grep parity (immediatelyRender:false / injectCSS:false / 1× useEditor) | ✅ |
| **RE-05** P3 lazy + barrel non-export + bundle isolation | Plan 02 (commits `2cec6b9`, `fba56b5`); Plan 03 manifest probe + bundle-budget spec PASS | ✅ |
| **RE-06** Anti-features documented + absent | Plan 02 JSDoc (`Anti-features NOT shipped` block); Plan 03 grep checks (H4-H6 / BubbleMenu / FontFamily / TextStyle all 0) | ✅ |
| **DEP-02** `_dep_re_01_decision` block + bundle evidence | Plan 01 (commits `9afa1fe`, `b3be861`, `b1ef026`); 7 fields + measured KB + PASS literal preserved post-impl | ✅ |
| **TST-03** Playwright + axe-core acceptance | Plan 03 (commits `48ca818`, `87f336c`); 15/15 tests green; vacuous-green guard mandatory | ✅ |

## Bundle Audit Evidence

Clean ANALYZE=true pnpm build executed at 2026-05-02 (after `rm -rf .next/cache .next`):

```
Route (app)                                 Size  First Load JS  Revalidate  Expire
┌ ○ /                                     9.7 kB         192 kB
├ ○ /dev-playground/sf-rich-editor       2.16 kB         113 kB
└ ... (other routes unchanged)
+ First Load JS shared by all             103 kB
```

Bundle-budget spec (gzip-summed, 12 chunks):

```
Homepage First Load JS chunks (12 files):
  webpack-d420e10e60d9dd96.js: 2.5 KB
  5791061e-b51f32ecb5a3272a.js: 53.1 KB
  2979-7e3b1be684627f10.js: 44.9 KB
  main-app-abe385e5fb3b5909.js: 0.2 KB
  584bde89-478e5bcc7be5ae42.js: 19.4 KB
  7850-c757c929f626d5bc.js: 8.1 KB
  8964-02d5beb63a80f3f5.js: 24.9 KB
  9067-c4993fc134c463a8.js: 3.3 KB
  6309-24caf6df6a168f65.js: 5.9 KB
  3228-0c5979f2a433adaf.js: 9.8 KB
  5837-a116bffc877132b7.js: 6.1 KB
  page-0f69f78feabe79f6.js: 9.5 KB
Total: 187.7 KB (budget: 200 KB, post-Phase-67 BND-06)
```

Tiptap manifest probe:

```
Tiptap in homepage First Load: PASS
EXIT=0
```

The `/dev-playground/sf-rich-editor` route remains the only entry point that hydrates the SFRichEditor lazy chunk; its 113 KB First Load number is the post-hydration cost (route-specific 2.16 KB + 110.84 KB shared) — confirming Tiptap lives in the lazy chunk only, not in any chunk reachable from `/`.

## Pattern B + D-04 + RE-06 + Registry-Deferral Lock Verification

| Lock | Verification | Status |
|------|--------------|--------|
| **Pattern B** (barrel non-export) | `components/sf/index.ts` does NOT contain `sf-rich-editor` or `SFRichEditor` | **HOLD** |
| **D-04** (chunk-id stability) | `next.config.ts` `optimizePackageImports` does NOT contain `@tiptap/*` (8-entry list unchanged from Phase 67 baseline) | **HOLD** |
| **Cluster-C** (token-only colors) | Active state via `cn(isActive && "bg-foreground text-background")` — slot tokens; 0 hex colors and 0 hardcoded magenta | **HOLD** |
| **RE-06 anti-features** | All six anti-features named in JSDoc with rationale; 0 actual imports/usage | **HOLD** |
| **Registry deferral** | `public/r/sf-rich-editor.json` absent; `public/r/registry.json` `sf-rich-editor` count = 0 (Phase 76 REG-01 same-commit cohort owns these) | **HOLD** |
| **Plan 02 gap-closure** | `shouldRerenderOnTransaction: true` on `useEditor` (sf-rich-editor.tsx:141, commit `65a2002`) | **HOLD + regression-tested** |

## Deviations from Plan

### 1. [Rule 1 — Plan 02 Regression / Gap-Closure] `shouldRerenderOnTransaction: true` (already landed before Plan 03 began)

- **Symptom:** Tiptap v3's `useEditor` defaults `shouldRerenderOnTransaction: false` (perf-driven flip from v2's implicit true). With this default, `editor.isActive("bold")` reads in the toolbar JSX evaluated against stale editor state — the toolbar's `data-active` and `aria-pressed` attributes never updated after a toolbar click, even though the editor's internal mark/node state DID change. RE-01 active-state contract violated.
- **Discovery vehicle:** A previous Plan 03 executor's Bold-data-active acceptance test (`tests/v1.10-phase73-sf-rich-editor.spec.ts:117`) — the test asserted `data-active` attribute presence on the Bold button after click; the assertion timed out because the attribute never appeared.
- **Root cause:** Tiptap v3 API change (default flag flip), not Plan 02 implementation defect.
- **Fix:** 1-line addition at `components/sf/sf-rich-editor.tsx:141` between `injectCSS: false` and the `extensions: [...]` array:
  ```ts
  shouldRerenderOnTransaction: true,
  ```
- **Commit:** `65a2002` (`Fix(73-02-gap):` prefix; merged to main before Plan 03 began)
- **Verified by:** This plan's Bold-data-active acceptance test (`48ca818`), which previously failed and now passes — converting the inline gap-closure into a permanent regression-test anchor.
- **Plan 03 inheritance:** The fix was already in the worktree HEAD (`65a2002`) when Plan 03 started. No additional component changes required during Plan 03 execution. The previous executor's uncommitted test work was lost when its worktree was abandoned; this plan re-authors both test files from scratch per the spec.

### 2. [Rule 3 — Blocking] Worktree node_modules out-of-sync (recurring v1.10 trap)

- **Found during:** Pre-task setup
- **Issue:** This worktree was reset onto `65a2002` from the prior `79835a3` baseline. `package.json` + `pnpm-lock.yaml` carried the Tiptap deps (locked by Plan 01's `b3be861`), but `node_modules/@tiptap/` and `node_modules/@axe-core/playwright/` were absent. Worktree-leakage feedback memory documents this pattern; same trap hit Plan 02 executor.
- **Fix:** Ran `pnpm install --frozen-lockfile` (9.4s, lockfile unchanged, ~46 packages materialized).
- **Files modified:** none (only node_modules, not committed)
- **Commit:** none (install-only)

### 3. [Rule 1 — Bug] `Write` tool wrote Task 1 spec to main tree, not worktree

- **Found during:** Task 1 first run — `pnpm exec playwright test tests/v1.10-phase73-sf-rich-editor.spec.ts` returned "No tests found" despite the Write succeeding.
- **Issue:** The `Write` tool's path was an absolute path under `/Users/greyaltaer/code/projects/SignalframeUX/tests/...` (main tree), not `/Users/greyaltaer/code/projects/SignalframeUX/.claude/worktrees/agent-a127600e/tests/...` (worktree). The `feedback_agent_worktree_leakage` memory documents this exact pattern.
- **Fix:** Defensive `mv` from main tree → worktree. Verified absent from main tree post-move; subsequent Write calls used absolute worktree paths and landed correctly.
- **Files modified:** `tests/v1.10-phase73-sf-rich-editor.spec.ts` (moved into worktree)
- **Commit:** rolled into Task 1 commit `48ca818` (the file was committed from the worktree)

### 4. [Rule 1 — Spec drift] Link-prompt dialog handler ordering

- **Found during:** Task 1 first run — 9/10 tests passed; the Link-prompt dialog test timed out at the click action.
- **Issue:** Plan §interfaces specified `const dialogPromise = page.waitForEvent("dialog")` BEFORE the click + `await dialogPromise` AFTER. This pattern hung the click because `window.prompt` is modal — `.click()` doesn't resolve until the dialog is dismissed, but the dismissal in the spec sat AFTER `await dialogPromise`. Race: handler attached, click awaited, dialog fires, click hangs waiting on dismissal that never comes (because the test is awaiting click).
- **Fix:** Switched to `page.once("dialog", handler)` BEFORE the click, capturing `dialog.type()` inside the handler closure for post-click assertion. Handler synchronously dismisses the prompt, freeing `.click()` to resolve.
- **Files modified:** `tests/v1.10-phase73-sf-rich-editor.spec.ts:138-152` (Edit)
- **Commit:** rolled into Task 1 commit `48ca818`

## Forward Link to Phase 74 (SFFileUpload)

Phase 73 is fully closed:

- All 8 requirements (RE-01..06, DEP-02, TST-03) validated by automated predicate.
- 4 commits land on the SFRichEditor implementation surface (`a1fd1cf` impl + `2cec6b9` lazy + `fba56b5` fixture + `65a2002` gap-closure) plus 3 commits on the evidence surface (`48ca818` acceptance + `87f336c` axe + `9b88c7d` VALIDATION sign-off) — 7 total task commits across 3 plans + 1 inline gap-closure.
- Bundle posture intact: 187.7 KB / 200 KB homepage; 12.3 KB headroom; Tiptap isolated to lazy chunk.
- Pattern B + D-04 + Cluster-C + RE-06 + registry-deferral all hold.

Phase 74 SFFileUpload (drag-and-drop file picker) is unblocked per `.planning/ROADMAP.md`. Ratifications carried forward into Phase 74:

1. **Pattern B for P3 lazy components** with bundle-heavy deps (file-upload zones, JSON imports, etc.) — same lazy wrapper + barrel non-export + dev-playground fixture + dual-spec evidence wave structure.
2. **Vacuous-green guard discipline** for axe scans on async-hydrated surfaces — applies anywhere a SFSkeleton might race the real component.
3. **`page.once("dialog", handler)` pattern** for `window.prompt`/`window.confirm`/file-picker dialogs.
4. **`_dep_FF_01_decision` schema** for any new runtime dep ratification (file-upload may need one if drag-and-drop polyfill is required).
5. **Three-plan wave structure** (decision+install / impl / evidence) for any phase that adds runtime deps.

The next step is `/pde:complete-plan 73-03` (orchestrator owns STATE.md / ROADMAP.md / REQUIREMENTS.md updates per worktree contract), then `/pde:plan-phase 74`.

## Self-Check: PASSED

Verified post-creation via filesystem + git:

- `tests/v1.10-phase73-sf-rich-editor.spec.ts` — exists in worktree (177 lines, 10 tests), absent from main tree, committed at `48ca818`
- `tests/v1.10-phase73-sf-rich-editor-axe.spec.ts` — exists in worktree (173 lines, 5 tests), committed at `87f336c`
- `.planning/phases/73-sfricheditor/73-VALIDATION.md` — `nyquist_compliant: true`, 20 green rows, 6 sign-off boxes checked, 5 Wave 0 boxes checked, status: closed, committed at `9b88c7d`
- `components/sf/index.ts` — `sf-rich-editor` count: 0 / `SFRichEditor` count: 0 (Pattern B holds)
- `next.config.ts` — `@tiptap` count: 0 (D-04 lock holds)
- `public/r/registry.json` — `sf-rich-editor` count: 0 (registry-deferral holds)
- `public/r/sf-rich-editor.json` — absent (registry-deferral holds)
- `components/sf/sf-rich-editor.tsx` — `level: [456]` count: 0; `BubbleMenu|FloatingMenu` count: 0; `FontFamily|TextStyle` count: 0 (RE-06 holds); `shouldRerenderOnTransaction: true` present at line 141 (gap-closure preserved)
- 15/15 Phase 73 Playwright + axe tests green: `pnpm exec playwright test tests/v1.10-phase73-sf-rich-editor*.spec.ts --project=chromium`
- 1/1 bundle-budget spec green: `pnpm exec playwright test tests/v1.8-phase63-1-bundle-budget.spec.ts --project=chromium` (187.7 KB / 200 KB)
- Three task commits exist on `git log --oneline 65a2002..HEAD`: `48ca818`, `87f336c`, `9b88c7d`
- `git status --porcelain` after final commit: clean (0 entries)
