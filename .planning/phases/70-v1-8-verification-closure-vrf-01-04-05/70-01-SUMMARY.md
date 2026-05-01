---
phase: 70-v1-8-verification-closure-vrf-01-04-05
plan: 01
subsystem: rum-aggregator
tags: [vrf-06, vrf-07, rum, vercel-logs, ios-cohort, wave-0]
status: complete
completed: 2026-04-30
duration: 5m 35s
requirements: [VRF-06, VRF-07]
nyquist_compliant: true

dependency_graph:
  requires:
    - scripts/v1.8-rum-aggregate.ts (predecessor pattern)
    - app/api/vitals/route.ts (Phase 58 sink — log line schema)
    - .planning/perf-baselines/v1.8/vrf-05-rum-p75-lcp.json (deferral blueprint)
  provides:
    - scripts/v1.9-rum-aggregate.ts (4 exports + script-mode entry)
    - tests/fixtures/v1.9-rum-log-line.jsonl (Plan 02 + 03 unit-test fixture)
    - .planning/perf-baselines/v1.9/ (parent dir for Plan 02/03 outputs)
  affects:
    - vitest.config.ts (include glob extended for scripts/*.spec.ts)
    - .planning/perf-baselines/v1.9/rum-p75-lcp.json (created by Plan 02)
    - .planning/perf-baselines/v1.9/vrf-08-path-b-decision.json (created by Plan 03)

tech-stack:
  added: []
  patterns:
    - "buildVercelLogsArgv() — argv-array flag-pair adjacency contract"
    - "uaString() — polymorphic Drains/CLI shape parser"
    - "isIosCohort() — two-regex AND-conjunction cohort filter"
    - "buildOutput() — pure function; spec-testable; module-mode-safe"
    - "isScriptMain() — argv[1] basename check; protects export hygiene"

key-files:
  created:
    - tests/fixtures/v1.9-rum-log-line.jsonl (4 lines, NDJSON)
    - scripts/v1.9-rum-aggregate.spec.ts (214 lines, 22 it cases / 4 describe)
    - scripts/v1.9-rum-aggregate.ts (439 lines, 7 exports)
    - .planning/perf-baselines/v1.9/.gitkeep (empty placeholder)
  modified:
    - vitest.config.ts (Rule 3 deviation — see below)

decisions:
  - "Vitest config include glob extended (Rule 3 — Blocking): without 'scripts/**/*.spec.ts' the positional filter intersects with 'lib/**/*.test.ts' include and yields 'No test files found'. Test-config-only edit; no source impact."
  - "isScriptMain() uses argv[1].endsWith('v1.9-rum-aggregate.ts') heuristic (not import.meta.url file:// pattern). Spec import is side-effect-free regardless; tsx + node both execute the script branch under direct invocation."
  - "buildOutput() built as pure exported function (not inline) to enable direct spec testing of all schema fields without execFileSync mocking ceremony."
  - "vrf_07_ios_cohort.threshold_median_ms locked to literal 2000 (TS literal type, not const). Documents the VRF-07 spec-of-record threshold inline in the type system."

metrics:
  tasks_completed: 4
  tests_authored: 22
  tests_passing: 22
  files_created: 4
  files_modified: 1
  lines_added: 657
  duration_seconds: 335
---

# Phase 70 Plan 01: v1.9 RUM Aggregator + Spec + Fixture Summary

Wave 0 dependency for Phase 70 RUM verification closure: authored a v1.9
successor RUM aggregator extending the v1.8 pipeline with `--no-branch` +
`--deployment <url>` flags (T-RUM-03 mitigation), a polymorphic `uaString()`
parser (T-PARSE-01 mitigation), and a `vrf_07_ios_cohort` partition (VRF-07
verdict surface). Vitest unit suite (22/22 GREEN) + 4-line NDJSON fixture +
`.planning/perf-baselines/v1.9/` directory placeholder shipped atomically.
Plans 02 (RUM capture cycle) and 03 (VRF-08 `_path_b_decision`) now unblocked.

## Wave 0 Status

**COMPLETE.** All four artifacts referenced by Plan 02 + Plan 03 exist on
disk and are committed:

| Artifact | Path | Lines | Purpose |
|----------|------|-------|---------|
| Aggregator | `scripts/v1.9-rum-aggregate.ts` | 439 | 7 exports + script-mode entry |
| Spec | `scripts/v1.9-rum-aggregate.spec.ts` | 214 | 22 it cases / 4 describe |
| Fixture | `tests/fixtures/v1.9-rum-log-line.jsonl` | 4 | UA cohort fixture |
| Dir placeholder | `.planning/perf-baselines/v1.9/.gitkeep` | 0 | Plan 02/03 output anchor |

## Tasks

### Task 1 — Author fixture log lines

**Commit:** `93f0bf0` — `test(70-01): add v1.9 RUM aggregator unit-test fixture (4 UA cohorts)`

Authored `tests/fixtures/v1.9-rum-log-line.jsonl` with exactly 4 NDJSON
lines covering the four UA cohorts spec-tested by Task 2:

| Line | UA Cohort | LCP (ms) | isIosCohort |
|------|-----------|----------|-------------|
| 1 | iPhone 14 Pro (iOS 17, Mobile/15E148) | 1850 | true |
| 2 | Pixel 7 (Android 13, Mobile Safari Chrome 120) | 920 | false |
| 3 | Desktop Chrome 120 (macOS 10.15.7) | 480 | false |
| 4 | Moto G Power (Android 11, Mobile Safari Chrome 120) | 3605 | false |

Each line is a complete Vercel runtime log envelope (timestamp / path /
proxy.userAgent / proxy.region / message), with `message` itself a
JSON-stringified `RumPayload` matching the Phase 58 `app/api/vitals/route.ts`
console.log pattern. NDJSON-standard (trailing newline preserved).

Verified:
- `wc -l` returns 4
- All 4 lines parse as JSON; all `path === "/api/vitals"`; all inner `type === "rum"`
- Line 1 UA matches `/iPhone OS 1[5-9]_/` AND `/Mobile\/1[5-9][A-Z]\d+/`
- Lines 2/3/4 do NOT match both regexes simultaneously

### Task 2 — Author Vitest spec (RED state)

**Commit:** `80fe213` — `test(70-01): add v1.9 RUM aggregator Vitest unit suite (RED)`

Authored `scripts/v1.9-rum-aggregate.spec.ts` (214 lines) with 22 `it()`
cases across 4 `describe` blocks asserting the four contracts that Task 3's
aggregator must satisfy:

| Describe block | it cases | Coverage |
|----------------|----------|----------|
| `uaString` | 6 | Array (Drains), string (CLI), undefined, null, empty array, non-string element |
| `isIosCohort` | 4 | Each fixture UA (iPhone 14 Pro / Pixel 7 / desktop / Moto G) |
| `buildVercelLogsArgv (no-branch + deployment)` | 5 | `--no-branch` presence, `--deployment <url>` adjacency, `--since` adjacency, `--environment` adjacency, `logs` subcommand |
| `buildOutput (schema)` | 7 | All 21 top-level keys, INSUFFICIENT_SAMPLES default, threshold literal locks, FAIL_OR_INSUFFICIENT default, sample_source passthrough |

**RED state confirmed before Task 3 commit:** vitest exited non-zero with
`Failed to resolve import "./v1.9-rum-aggregate"` (correct precondition for
TDD GREEN cycle).

**[Rule 3 — Blocking deviation] Vitest config include glob extended.**
`vitest.config.ts` was edited to add `'scripts/**/*.spec.ts'` to the
`include` array. Without this, the positional CLI filter
(`vitest run scripts/v1.9-rum-aggregate.spec.ts`) intersects with the
existing `'lib/**/*.test.ts'` glob and yields "No test files found, exiting
with code 0" — i.e., the plan's verify command silently passes without
running anything. Test-config-only edit; no source/app/component impact.
The `tests/**` exclude pattern is preserved.

### Task 3 — Author v1.9 aggregator (GREEN state)

**Commit:** `1ce07aa` — `feat(70-01): add v1.9 RUM aggregator (GREEN — turns spec from RED)`

Authored `scripts/v1.9-rum-aggregate.ts` (439 lines) implementing all 7
exports the spec contract requires:

| Export | Type | Purpose |
|--------|------|---------|
| `IOS_15_PLUS_RE` | `RegExp` | iOS 15+ UA matcher (forward-compat to iOS 19) |
| `IOS_14PRO_BUILD_RE` | `RegExp` | Mobile/15E* build family (iPhone 14 Pro) |
| `isIosCohort` | `(ua: string) => boolean` | Two-regex AND-conjunction cohort filter |
| `uaString` | `(rawUa: unknown) => string` | Polymorphic Drains/CLI parser |
| `buildVercelLogsArgv` | `(opts) => string[]` | Argv array with --no-branch + --deployment |
| `percentile` | `(arr, p) => number \| null` | Ceiling-index percentile (verbatim from v1.8) |
| `buildOutput` | `(filtered, opts) => RumAggregateOutput` | Pure assembly fn — spec-testable |

**Three structural deltas from v1.8:**

1. **`buildVercelLogsArgv()` extracts argv construction.** Adjacent
   flag-value pairs are preserved as discrete elements (`["--deployment",
   url, "--since", duration, ...]`). `--no-branch` is now first after
   `--json`. Closes T-RUM-03 (the documented v1.8 VRF-05 deferral cause —
   memory `feedback_vercel_logs_branch_scope`).

2. **`uaString()` defensive parser.** Handles array (Vercel Drains schema
   `proxy.userAgent: string[]`) and string (CLI flatten) shapes. Returns
   `""` for `undefined`, `null`, `[]`, and `[42]` (non-string element).
   Closes T-PARSE-01 (UA shape ambiguity that would have produced silent
   `mobile: 0, desktop: <all>` with bare `?? ""`).

3. **`vrf_07_ios_cohort` block in output schema.** New top-level key with
   `count`, `count_lcp`, `median_lcp_ms`, `p75_lcp_ms`,
   `threshold_median_ms: 2000` (literal type), and `verdict` enum
   (`PASS | FAIL | INSUFFICIENT_SAMPLES`). VRF-07 verdict logic:
   `count_lcp < 10 → INSUFFICIENT_SAMPLES; median < 2000ms → PASS;
   otherwise → FAIL`.

**Output path migrated** from `.planning/perf-baselines/v1.8/vrf-05-rum-p75-lcp.json`
to `.planning/perf-baselines/v1.9/rum-p75-lcp.json`.

**Module-mode hygiene:** `isScriptMain()` guards all `execFileSync` /
`writeFileSync` / `process.exit` side effects. Spec imports are
side-effect-free.

**`--help` flag** added; lists env vars, argv flags, and output path.

**Acceptance:**
- vitest run scripts/v1.9-rum-aggregate.spec.ts → **22 passed (22)**, 680ms
- tsx scripts/v1.9-rum-aggregate.ts --help → exit 0; lists `--no-branch` + `--deployment`
- tsc --noEmit → exit 0 (zero new type errors)
- All 10 grep acceptance criteria met (no-branch / deployment literals; 4 export functions; vrf_07_ios_cohort 6× references; v1.9 path 2× references)

### Task 4 — Create v1.9 perf-baselines directory placeholder

**Commit:** `dd66983` — `chore(70-01): add .planning/perf-baselines/v1.9/.gitkeep`

Created `.planning/perf-baselines/v1.9/.gitkeep` (empty file) so Plan 02's
`rum-p75-lcp.json` write and Plan 03's `vrf-08-path-b-decision.json` write
have a tracked parent directory without `mkdir -p` ceremony.

Verified:
- `test -d .planning/perf-baselines/v1.9/` → exists
- `test -f .planning/perf-baselines/v1.9/.gitkeep` → exists
- `git check-ignore` → exit 1 (NOT ignored; tracked correctly)

## Vitest Output Summary

```
 Test Files  1 passed (1)
      Tests  22 passed (22)
   Duration  680ms (transform 37ms, setup 0ms, import 51ms, tests 6ms, environment 526ms)
```

## Argv Assertion Details

`buildVercelLogsArgv({ since: "70m", deployment: "https://signalframeux.vercel.app", environment: "production" })` returns:

```js
[
  "logs",
  "--json",
  "--no-branch",                           // T-RUM-03 mitigation
  "--deployment", "https://signalframeux.vercel.app",  // adjacent pair
  "--since", "70m",                        // adjacent pair
  "--environment", "production",           // adjacent pair
  "--query", "rum",
  "--limit", "0",
  "--no-follow",
]
```

5 adjacent-pair assertions all pass (`--deployment` / `--since` /
`--environment` `argv[idx+1]` checks); `--no-branch` boolean presence
asserted via `argv.includes("--no-branch")`; `argv[0] === "logs"` confirmed.

## iOS Cohort Regex Coverage

4 fixture UAs tested against `isIosCohort()`:

| Fixture line | UA snippet | Expected | Actual |
|--------------|------------|----------|--------|
| 1 | `iPhone OS 17_0 ... Mobile/15E148` | `true` | `true` ✓ |
| 2 | `Linux; Android 13; Pixel 7 ... Mobile Safari/537.36` | `false` | `false` ✓ |
| 3 | `Macintosh; Intel Mac OS X 10_15_7 ... Safari/537.36` | `false` | `false` ✓ |
| 4 | `Linux; Android 11; moto g power (2022) ... Mobile Safari/537.36` | `false` | `false` ✓ |

Anti-pattern proven excluded: Android Chrome UAs contain `Mobile` token but
NOT `iPhone OS`, so `IOS_15_PLUS_RE.test()` short-circuits the AND
conjunction to false.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocking] Vitest config include pattern extended for `scripts/**/*.spec.ts`**

- **Found during:** Task 2 (after writing spec, attempted to run vitest in RED state)
- **Issue:** `vitest.config.ts` `include: ['lib/**/*.test.ts']` filters out `scripts/v1.9-rum-aggregate.spec.ts` even when passed as positional CLI filter; vitest output: `No test files found, exiting with code 0`. The plan's verify command (`pnpm vitest run scripts/v1.9-rum-aggregate.spec.ts`) silently passes without running tests.
- **Fix:** Added `'scripts/**/*.spec.ts'` to `include` array. `'tests/**'` exclude preserved unchanged.
- **Files modified:** `vitest.config.ts` (1 line)
- **Commit:** `80fe213` (folded into Task 2 since the spec is non-functional without this)
- **Scope check:** test-config-only edit; no `app/` / `components/` / `lib/` impact; Phase 67 chunk-graph contract intact.

**2. [Rule 3 — Blocking] Worktree alignment to expected base via `git checkout HEAD -- .`**

- **Found during:** Pre-Task-1 worktree state inspection
- **Issue:** Worktree branch tip (2a825cf) was 1 commit behind expected base (66da733); `git reset --soft` left 76 staged files (deletions of phase 65-70 dirs that exist at HEAD but not in working tree), polluting per-task commit isolation.
- **Fix:** `git checkout HEAD -- .` aligned working tree with HEAD; one stray `A .planning/v1.8-MILESTONE-AUDIT.md` (untracked) preserved out-of-commit.
- **Files modified:** none directly; tree state alignment only
- **Commit:** none (housekeeping)

### Architectural Changes

None.

### Authentication Gates

None.

## Self-Check: PASSED

**Files verified on disk:**
- `tests/fixtures/v1.9-rum-log-line.jsonl` ✓
- `scripts/v1.9-rum-aggregate.spec.ts` ✓
- `scripts/v1.9-rum-aggregate.ts` ✓
- `.planning/perf-baselines/v1.9/.gitkeep` ✓
- `.planning/phases/70-v1-8-verification-closure-vrf-01-04-05/70-01-SUMMARY.md` ✓
- `vitest.config.ts` ✓ (Rule 3 deviation target)

**Commits verified in git log:**
- `93f0bf0` ✓ (Task 1)
- `80fe213` ✓ (Task 2)
- `1ce07aa` ✓ (Task 3)
- `dd66983` ✓ (Task 4)

**Final test pass:**
- `vitest run scripts/v1.9-rum-aggregate.spec.ts` → 22 passed (22), 680ms
- `tsx scripts/v1.9-rum-aggregate.ts --help` → exit 0
- `tsc --noEmit -p tsconfig.json` → exit 0

## Continuation Notes for Plans 02 + 03

**Plan 02 (RUM capture cycle):**
- Aggregator path: `pnpm tsx scripts/v1.9-rum-aggregate.ts` from repo root
- Required envs: `SINCE=70m`, `WINDOW_START=$(date -u +%Y-%m-%dT%H:%M:%SZ)`, `DEPLOYMENT_URL=https://signalframeux.vercel.app`, `SAMPLE_SOURCE=synthetic-seeded` (or `mixed` if natural traffic lands)
- Output: `.planning/perf-baselines/v1.9/rum-p75-lcp.json`
- Verdicts surfaced: top-level `verdict` (VRF-06) + `vrf_07_ios_cohort.verdict` (VRF-07)

**Plan 03 (VRF-08 `_path_b_decision`):**
- Output dir ready: `.planning/perf-baselines/v1.9/`
- File to create: `.planning/perf-baselines/v1.9/vrf-08-path-b-decision.json`
- Schema fields per `feedback_path_b_pattern`: `decided / audit / original / new / rationale / evidence / review_gate`
- `review_gate` MUST cross-reference `Phase 67 BND-05/06/07`

## Commit Trail

| Task | Commit | Type | Files | Lines |
|------|--------|------|-------|-------|
| 1 | `93f0bf0` | test | `tests/fixtures/v1.9-rum-log-line.jsonl` | +4 |
| 2 | `80fe213` | test | `scripts/v1.9-rum-aggregate.spec.ts`, `vitest.config.ts` | +215, -1 |
| 3 | `1ce07aa` | feat | `scripts/v1.9-rum-aggregate.ts` | +439 |
| 4 | `dd66983` | chore | `.planning/perf-baselines/v1.9/.gitkeep` | +0 |
| Total | — | — | 4 created, 1 modified | +658, -1 |
