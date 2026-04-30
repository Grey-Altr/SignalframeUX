---
phase: 69-wordmark-cross-platform-pixel-diff-alignment
plan: 01
subsystem: testing
tags: [playwright, visual-regression, path-decision, trademark, wordmark, ci]

# Dependency graph
requires:
  - phase: 63.1-lcp-fast-path-remediation
    provides: D-12 wordmark vectorization (visible English `<text>` → static `<path>`); 0% pre/post-hoist pixel diff baseline; 4 chromium-darwin baseline PNGs at commit 34d8d4c
  - phase: 64-bisect-protection-3pr-ship
    provides: Path N bootstrap pattern (Playwright snapshot artifact upload via `actions/upload-artifact@v4 if: always()`); 4 chromium-linux baseline PNGs at commit 68131f6
provides:
  - Structured 7-field `_wmk_01_decision` annotation block at top of `tests/v1.8-phase63-1-wordmark-hoist.spec.ts` (decided/audit/original_threshold/new_threshold/rationale/evidence/review_gate + scope + ratified_to_main_via)
  - Path A ratification: `maxDiffPixelRatio: 0.001` retained as the per-platform trademark-fidelity gate (10× stricter than AES-04's 0.5%)
  - Documented review gate: loosen to 0.005 ONLY if observed CI variance exceeds 0.001 on n>=3 same-code re-runs; revisit during BND-05/06/07 barrel reshape
affects: [phase-67-bundle-barrel-optimization, phase-70+ wordmark-touching work, future-consumer-integration]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "_wmk_01_decision: requirement-keyed path_decision variant (vs alphabetical _path_X_decision); first project use, sets precedent for v1.9 requirement-namespaced decisions"
    - "Per-platform snapshot routing reframe: documented that Playwright's default `{name}-{projectName}-{platform}.png` template means there is NO cross-platform pixel comparison; the WMK-01 phrase '5× tolerance widening' is reframed as 'retain per-platform 0.1%'"

key-files:
  created:
    - ".planning/phases/69-wordmark-cross-platform-pixel-diff-alignment/69-01-SUMMARY.md (this file)"
  modified:
    - "tests/v1.8-phase63-1-wordmark-hoist.spec.ts (+38 lines: JSDoc-style _wmk_01_decision block at top; runtime behavior unchanged)"

key-decisions:
  - "Path A retain: maxDiffPixelRatio=0.001 unchanged. Trademark primitive (T1-T3 register) justifies 10×-stricter-than-AES-04 gate against silent drift. Reality (per-platform baselines on disk) ratified, not loosened."
  - "_wmk_01_decision naming: requirement-keyed (matches v1.9 REQUIREMENTS.md grouping) over alphabetical _path_n_decision (which is reserved for the LHCI gate namespace)."
  - "Block placed at very top of spec (above existing line-1 header), not as separate sidecar JSON. JSDoc-style comment chosen for spec proximity (matches Phase 60/62 precedent of decision rationale at change site) without breaking TypeScript compile."

patterns-established:
  - "Requirement-keyed path_decision blocks (`_<reqid>_decision`) for v1.9+ work: better semantic discoverability than alphabetical letters, decouples from LHCI alphabetical namespace"
  - "Worktree-leakage defensive-merge: when Edit tool writes hit main tree instead of worktree (per feedback_agent_worktree_leakage.md), apply edit to worktree path explicitly + revert main tree leak before commit"

requirements-completed: [WMK-01, WMK-02]

# Metrics
duration: 17min
completed: 2026-04-30
---

# Phase 69 Plan 01: Wordmark Cross-Platform Pixel-Diff Alignment Summary

**`_wmk_01_decision` Path A ratification — `maxDiffPixelRatio: 0.001` retained at top of wordmark-hoist spec with 7-field schema; CI green on ubuntu-linux against committed chromium-linux baselines; AES-04 source files untouched.**

## Performance

- **Duration:** 17 min
- **Started:** 2026-04-30T19:11:02Z
- **Completed:** 2026-04-30T19:28:20Z
- **Tasks:** 5/5 (Tasks 1+2+3 folded into single atomic commit; Tasks 4+5 verification-only)
- **Files modified:** 1 (`tests/v1.8-phase63-1-wordmark-hoist.spec.ts`, +38/-0)

## Accomplishments

- `_wmk_01_decision` 7-field schema block (decided / audit / original_threshold / new_threshold / rationale / evidence / review_gate) authored at top of `tests/v1.8-phase63-1-wordmark-hoist.spec.ts` with optional `scope` + `ratified_to_main_via` fields per Phase 60/62 precedent
- Path A retained: line 109 `maxDiffPixelRatio: 0.001` unchanged (semantic agreement with `new_threshold: 0.001` in decision block)
- Local Playwright self-pass on darwin: **5/5 in 3.3s** against `chromium-darwin` baselines under the strict 0.1% threshold
- CI green on `ubuntu-latest` against `chromium-linux` baselines: **run 25184610878 = success**
- AES-04 immutability verified: `tests/v1.8-phase59-pixel-diff.spec.ts:38` and `tests/v1.8-phase61-bundle-hygiene.spec.ts:39` both retain `MAX_DIFF_RATIO = 0.005` verbatim and are NOT in the Phase 69 commit range

## Task Commits

Tasks 1+2+3 were folded into a single atomic commit (Path A no-edit on Task 2 + Task 3 verification-only on the same source state). Tasks 4+5 are read-only verification with results captured in this summary.

1. **Task 1 (author decision block) + Task 2 (confirm Path A line 109 = 0.001) + Task 3 (local darwin self-pass + commit)** - `c2f9d73` (chore)

**No metadata commit:** worktree executor pattern — orchestrator handles STATE.md / ROADMAP.md / SUMMARY.md commit at wave merge.

## Files Created/Modified

- `tests/v1.8-phase63-1-wordmark-hoist.spec.ts` (+38 / -0) — JSDoc-style `_wmk_01_decision` block inserted at file top, above existing line-1 header. All 7 schema fields present + optional `scope: "wordmark-hoist:maxDiffPixelRatio per-platform"` + `ratified_to_main_via: "Phase 69 (this commit)"`. Line-comments only — TypeScript compile clean (0 errors), no source code modified.
- `.planning/phases/69-wordmark-cross-platform-pixel-diff-alignment/69-01-SUMMARY.md` (this file) — created by executor at end of run; orchestrator handles staging.

## CI Verification

| Field | Value |
|-------|-------|
| **Run ID** | `25184610878` |
| **URL** | https://github.com/Grey-Altr/SignalframeUX/actions/runs/25184610878 |
| **PR** | https://github.com/Grey-Altr/SignalframeUX/pull/6 |
| **Commit SHA** | `c2f9d7329be88e7f51671b7ec2b0bed9526074c1` |
| **Branch** | `worktree-agent-a6123af2` |
| **Conclusion** | `success` |
| **Event** | `pull_request` |
| **Wordmark spec exercised** | yes (5 log mentions across 4 viewport tests + 1 structural test) |
| **Wordmark test failures** | 0 |

CI workflow `.github/workflows/ci.yml` triggers on `pull_request` (and `push` to main only). Worktree branch push alone does not trigger CI; PR #6 was opened against `main` to fire the workflow against the Phase 69 commit.

## Decisions Made

- **Path A (retain D-12 0.1%) vs Path B (loosen to 0.5%):** Chose Path A per researcher recommendation. Trademark primitive register (T1 pixel-sort, T2 nav glyph, T3 cube-tile box per `feedback_trademark_primitives.md`) justifies the 10×-stricter-than-AES-04 gate. Per-platform snapshot routing reality means there is no actual cross-platform pixel comparison happening — each test compares only against its own-platform baseline; loosening would weaken the trademark guard 5× without measurable variance to justify.
- **`_wmk_01_decision` naming over `_path_n_decision`:** Requirement-keyed naming chosen for semantic discoverability and to keep the alphabetical path-letter namespace reserved for LHCI gates. Sets v1.9 precedent.
- **Block placement at very top of spec (above existing header):** Matches Phase 60/62 precedent (decision rationale at change site). JSDoc-style line-comment format chosen so TypeScript compile is unaffected (line comments cannot break parse).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Worktree node_modules missing**
- **Found during:** Task 3 (local Playwright self-pass)
- **Issue:** `pnpm dev` failed with `sh: next: command not found` because the worktree at `.claude/worktrees/agent-a6123af2/` had no `node_modules/` directory; only the parent project tree did.
- **Fix:** Ran `pnpm install --prefer-offline --frozen-lockfile` in the worktree (used the pnpm store cache; completed in 11.7s).
- **Files modified:** `node_modules/` (untracked, created)
- **Verification:** `pnpm exec playwright test ...` then ran successfully.
- **Committed in:** N/A (tooling, not source — `node_modules/` is gitignored)

**2. [Rule 3 - Blocking] Pre-existing dev server on port 3000 returned HTTP 500**
- **Found during:** Task 3 (local Playwright self-pass)
- **Issue:** A long-running `next-server` (PID 94866) rooted at the parent project tree was holding port 3000 with a Turbopack CSS parse error in `app/globals.css:677` (`z-index: var();` empty `var()` call). This is a pre-existing main-tree issue completely unrelated to Phase 69 (Phase 69 only touches a comment block in a test file).
- **Fix:** Discovered a separate dev server on port 3001 (PID 74111, also healthy) was already serving valid responses. Directed Playwright at port 3001 via `PLAYWRIGHT_BASE_URL=http://localhost:3001`. Did NOT attempt to fix the unrelated main-tree CSS error per `<scope_boundary>` (out of scope, logged here for visibility).
- **Files modified:** None (used environment override, not config edit).
- **Verification:** `PLAYWRIGHT_BASE_URL=http://localhost:3001 pnpm exec playwright test tests/v1.8-phase63-1-wordmark-hoist.spec.ts` → 5/5 passed in 3.3s.
- **Committed in:** N/A (env override only).

**3. [Rule 3 - Blocking] Worktree edit-leakage to main tree**
- **Found during:** Task 3 (post-Playwright `git status` showed worktree clean, main tree had the edit)
- **Issue:** The first Edit tool call wrote the `_wmk_01_decision` block to `/Users/greyaltaer/code/projects/SignalframeUX/tests/v1.8-phase63-1-wordmark-hoist.spec.ts` (main tree) instead of the worktree's path at `.claude/worktrees/agent-a6123af2/tests/...`. Documented behavior per `feedback_agent_worktree_leakage.md`.
- **Fix:** Applied the same edit to the worktree's absolute path explicitly. Reverted the main-tree leak via `git checkout -- tests/v1.8-phase63-1-wordmark-hoist.spec.ts` from the main tree's working directory.
- **Files modified:** `tests/v1.8-phase63-1-wordmark-hoist.spec.ts` (worktree, +38 lines); main-tree leak reverted to baseline.
- **Verification:** `head -5 tests/v1.8-phase63-1-wordmark-hoist.spec.ts` from worktree shows the new decision block; same command from main tree shows the original `// Phase 63.1 Plan 03 Wave 0` header (unchanged).
- **Committed in:** Worktree commit `c2f9d73` (after fix).

---

**Total deviations:** 3 auto-fixed (3 blocking — all environmental, none touched the spec source content)
**Impact on plan:** All auto-fixes were tooling/environment fixes that did not change Phase 69's planned scope (still 1 file, 38 insertions, 0 deletions, exactly Path A as researcher-recommended). No scope creep. The original Path A → Path B contingency in Task 4 did NOT fire — first CI run succeeded against committed chromium-linux baselines under the strict 0.001 threshold.

## Issues Encountered

- **Two parallel dev servers occupying ports 3000+3001 from concurrent worktrees:** Resolved by using port 3001 (healthy) without disturbing the broken-but-isolated port 3000 server.
- **The pre-existing `app/globals.css:677` `z-index: var();` parse error in the main tree** is logged here for cleanup visibility but is explicitly OUT OF SCOPE for Phase 69. Recommend follow-up phase or hotfix to remove the empty `var()` call (likely a Tailwind v4 arbitrary-value typo from a prior session).

## User Setup Required

None — no external service configuration. CI gate already configured via existing `.github/workflows/ci.yml`. PR #6 (https://github.com/Grey-Altr/SignalframeUX/pull/6) is awaiting human review to merge to main; orchestrator owns the merge decision per parallel-executor wave protocol.

## Next Phase Readiness

- WMK-01 + WMK-02 discharged; v1.9 carry-over backlog item "Wordmark Linux/darwin pixel-diff" closed at root.
- `_wmk_01_decision` block sets the v1.9 requirement-keyed decision-naming precedent for future phases (v1.9 Phase 67/68/70+ may follow this pattern).
- Review gate documented: revisit during BND-05/06/07 (Phase 67) barrel reshape if wordmark rendering path changes.
- Path B contingency NOT exercised (chromium-linux baselines self-pass against fresh-rendered output at 0.001 strict threshold on first CI run); contingency remains documented in PLAN.md Task 4 for future re-runs if variance emerges.

## Self-Check: PASSED

All 5 acceptance criteria verified:

1. **Decision block 7-field schema** — `grep -E "decided:|audit:|original_threshold:|new_threshold:|rationale:|evidence:|review_gate:" tests/v1.8-phase63-1-wordmark-hoist.spec.ts | wc -l` → `7` ✅
2. **Threshold semantic agreement (Path A)** — `grep -cE "new_threshold:[[:space:]]*0\.001" tests/v1.8-phase63-1-wordmark-hoist.spec.ts` → `1` AND `grep -cE "^[[:space:]]*maxDiffPixelRatio:[[:space:]]*0\.001," tests/v1.8-phase63-1-wordmark-hoist.spec.ts` → `1` ✅
3. **Local Playwright self-pass on darwin** — `5 passed (3.3s)` against `chromium-darwin` baselines under `maxDiffPixelRatio: 0.001` ✅
4. **CI green on ubuntu-linux** — `gh run list --workflow=ci.yml --commit=c2f9d73 --json conclusion --jq '.[0].conclusion'` → `"success"` (run 25184610878, headSha matches Phase 69 commit, wordmark spec exercised in 5 log lines, 0 wordmark failures) ✅
5. **AES-04 immutability** — `git diff --name-only c2f9d73^..HEAD | sort -u` → exactly `tests/v1.8-phase63-1-wordmark-hoist.spec.ts` (single file); `grep "MAX_DIFF_RATIO\s*=\s*0\.005"` returns 1 each in `tests/v1.8-phase59-pixel-diff.spec.ts` and `tests/v1.8-phase61-bundle-hygiene.spec.ts` ✅

**Commit verification:**
- `c2f9d73` exists: `git log --oneline -1 c2f9d73` → `c2f9d73 Chore(69-01): _wmk_01_decision block — Path A retain D-12 0.1% wordmark threshold` ✅
- File touched in commit: `git show --name-only --pretty=format: c2f9d73` → `tests/v1.8-phase63-1-wordmark-hoist.spec.ts` (1 file) ✅

---
*Phase: 69-wordmark-cross-platform-pixel-diff-alignment*
*Plan: 01*
*Completed: 2026-04-30*
