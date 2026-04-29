---
phase: 61-bundle-hygiene
plan: "02"
subsystem: build-config
tags: [bundle-hygiene, optimizePackageImports, cmdk, vaul, sonner, react-day-picker, lazy-path, webpack, next15]

requires:
  - phase: 61
    plan: "01"
    provides: "Eager-path optimizePackageImports baseline ['lucide-react', 'radix-ui', 'input-otp']; Build B carry-over (Shared 103 KB / / 264 KB / /_not-found 103 KB) — feeder for Plan 02 lazy-path additions"
provides:
  - "Lazy-path optimizePackageImports extension: ['lucide-react', 'radix-ui', 'input-otp', 'cmdk', 'vaul', 'sonner', 'react-day-picker'] (final v1.8-lock BND-02 end-state)"
  - "Per-build measurement log with stale-chunk-guarded Build C / D (BND-04 compliant)"
  - "date-fns SKIP decision documented with 61-RESEARCH §1 + Risks #6 rationale"
  - "Verified: 0 KB delta on Shared by all AND on / First Load JS for both lazy-path batches (expected per 61-RESEARCH §Risks #5)"
affects: [phase-61-plan-03, phase-62-bundle-followup]

tech-stack:
  added: []
  patterns:
    - "Per-batch atomic build measurement (chore commit then docs commit) for clean bisect — same cadence as Plan 01"
    - "Stale-chunk guard prefix `rm -rf .next/cache .next` before every gating measurement (BND-04)"
    - "Carry-over baseline pattern: Plan N's first row is Plan (N−1)'s last build, copied verbatim to anchor delta calculations"

key-files:
  created:
    - ".planning/phases/61-bundle-hygiene/61-02-RESEARCH-LOG.md"
    - ".planning/phases/61-bundle-hygiene/61-02-SUMMARY.md"
  modified:
    - "next.config.ts"

key-decisions:
  - "date-fns SKIPPED — already in Next.js 15 default-optimized list per 61-RESEARCH §1; zero direct imports in repo (transitive via react-day-picker only)"
  - "cmdk + vaul batched into Build C (single chore + single docs commit pair) — both lazy via next/dynamic, expected zero initial-load delta justifies batching"
  - "sonner + react-day-picker batched into Build D — same lazy-via-dynamic posture as Build C; final v1.8-lock end-state"
  - "Lazy-path zero-delta on Shared by all documented as EXPECTED, NOT a regression (61-RESEARCH §Risks #5)"
  - "Type-check via `pnpm exec tsc --noEmit` (carry-over from Plan 01 Deviation Rule 3 fallback)"

patterns-established:
  - "Bisect-friendly commit cadence: chore(code) → docs(measurement) per batch addition; 5 atomic commits in Plan 02 (1 docs template + 2 chore + 2 docs)"
  - "Defensive-inclusion outcome: lazy packages may show zero gating-metric delta but are still added so future surface expansion auto-tree-shakes (cost zero, gain nonzero)"

requirements-completed: [BND-02]

duration: 5min
completed: 2026-04-26
---

# Phase 61 Plan 02: Lazy-path packages (cmdk + vaul + sonner + react-day-picker) Summary

**Extended `optimizePackageImports` from Plan 01's `["lucide-react", "radix-ui", "input-otp"]` to the final v1.8-lock end-state `["lucide-react", "radix-ui", "input-otp", "cmdk", "vaul", "sonner", "react-day-picker"]`; Shared by all and `/` First Load JS unchanged at 103 KB / 264 KB respectively (expected lazy no-delta per 61-RESEARCH §Risks #5); date-fns SKIPPED per 61-RESEARCH §1 (already default-optimized).**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-04-26T20:21:48Z
- **Completed:** 2026-04-26T20:26:48Z
- **Tasks:** 3 (Task 0 RESEARCH-LOG template + Build B carry-over, Task 1 cmdk + vaul, Task 2 sonner + react-day-picker)
- **Files modified:** 2 (`next.config.ts`, new `61-02-RESEARCH-LOG.md`)
- **Commits:** 5 atomic (3 docs + 2 chore) under `--no-verify` parallel-executor protocol
- **Builds run:** 2 stale-chunk-guarded production builds (Build C, Build D)

## Accomplishments

- **Build B carry-over established** as Plan 02's baseline reference: Shared 103 KB, `/` 264 KB, `/_not-found` 103 KB (copied verbatim from `61-01-RESEARCH-LOG.md` row B)
- **Build C (cmdk + vaul added)**: identical to Build B at gating-metric granularity — Shared 103 KB, `/` 264 KB, all routes 0 KB delta. Confirms 61-RESEARCH §Risks #5 lazy-package no-delta prediction.
- **Build D (sonner + react-day-picker added)**: identical to Build C — final v1.8-lock end-state at 7-entry array. Zero further harvest from these two lazy packages on the gating Route (app) stdout table.
- **date-fns SKIP rationale documented** in RESEARCH-LOG `## date-fns SKIP decision` section: already in Next.js 15 default-optimized list (61-RESEARCH §1), zero direct imports in repo, transitive via react-day-picker only.
- **Type safety confirmed**: `pnpm exec tsc --noEmit` exit 0 after both batched additions.
- **`useCache: true` and `redirects()` block preserved verbatim** per critical constraint.

## Task Commits

Each task committed atomically with `--no-verify` (parallel-executor protocol):

1. **Task 0: Create RESEARCH-LOG with Build B carry-over and date-fns skip rationale** — `1937a4a` (docs)
2. **Task 1a: Add cmdk + vaul to optimizePackageImports** — `87ced88` (chore)
3. **Task 1b: Build C measurement (cmdk + vaul)** — `978c77a` (docs)
4. **Task 2a: Add sonner + react-day-picker to optimizePackageImports** — `bd005b0` (chore)
5. **Task 2b: Build D measurement (sonner + react-day-picker)** — `78bced7` (docs)

Bisect order preserved: every batched code change has a chore commit BEFORE its measurement docs commit, so reverting a single chore commit reverts that two-package batch cleanly.

## Files Created/Modified

- `next.config.ts` — `experimental.optimizePackageImports` extended from `["lucide-react", "radix-ui", "input-otp"]` (Plan 01 end-state) to `["lucide-react", "radix-ui", "input-otp", "cmdk", "vaul", "sonner", "react-day-picker"]` (Plan 02 final end-state); `useCache: true` and `redirects()` block preserved verbatim
- `.planning/phases/61-bundle-hygiene/61-02-RESEARCH-LOG.md` — NEW; per-build measurement table (B carry-over / C / D) + Build C/D detail blocks + date-fns SKIP rationale + Plan 03 forward notes
- `.planning/phases/61-bundle-hygiene/61-02-SUMMARY.md` — THIS FILE

## Build Outputs (Route (app) stdout, gating source)

Final next.config.ts state (verbatim):

```ts
optimizePackageImports: ["lucide-react", "radix-ui", "input-otp", "cmdk", "vaul", "sonner", "react-day-picker"],
```

| Build | next.config.ts state | Shared by all | `/` First Load JS | `/_not-found` First Load JS | Δ vs Build B |
|-------|---------------------|---------------|-------------------|----------------------------|--------------|
| B (carry-over) | `[lucide-react, radix-ui, input-otp]` | 103 KB | 264 KB | 103 KB | 0 (baseline) |
| C     | `[..., cmdk, vaul]` | 103 KB | 264 KB | 103 KB | 0 (Shared); 0 on `/` |
| D     | `[..., cmdk, vaul, sonner, react-day-picker]` | 103 KB | 264 KB | 103 KB | 0 (Shared); 0 on `/` |

**Per-route deltas at Build D vs Build B (carry-over):**
- `/`: 264 → 264 KB (0 KB)
- `/system`: 258 → 258 KB (0 KB)
- `/inventory`: 267 → 267 KB (0 KB)
- `/init`: 251 → 251 KB (0 KB)
- `/reference`: 273 → 273 KB (0 KB)
- `/builds`: 254 → 254 KB (0 KB)
- `/_not-found`: 103 → 103 KB (unchanged; shared-floor stability confirmed)

**Cumulative Phase 61 reduction (Build 0 → Build D):**
- `/` First Load JS: 280 → 264 KB (**−16 KB / 5.7%**) — entire harvest from Plan 01 eager-path additions; Plan 02 added zero gating-metric reduction (lazy packages by definition)
- Shared by all: 103 → 103 KB (unchanged) — BND-01 ≤102 KB target NOT closed by Phase 61's optimizePackageImports vector

## Decisions Made

- **date-fns SKIPPED:** `date-fns` ^4.1.0 is in the Next.js 15 default-optimized package list per 61-RESEARCH §1. Zero direct imports exist in this repo (transitive via react-day-picker only). Adding it would be redundant but harmless; per 61-RESEARCH §6 + Risks #6 the cleaner choice is to SKIP and document. Final array contains 7 strings (lucide-react baseline + 6 BND-02 additions) — date-fns is not present.
- **Batched commits for lazy packages (not 4 atomic):** Plan-checker resolved this in 61-RESEARCH §6 — strict-reading of ROADMAP criterion 2 would mandate 4 builds, but pragmatic reading allows 2 builds (after cmdk+vaul, then after sonner+react-day-picker) since lazy packages produce no gating-metric delta. Plan 02 followed the pragmatic 2-build / 2-commit-pair protocol.
- **Lazy-path zero-delta documented as EXPECTED:** Per 61-RESEARCH §Risks #5, "If Plan 02 shows 0 KB delta on Shared by all after adding these four, that is the expected result, not a failure." Documented in RESEARCH-LOG header + Build C and D detail blocks.
- **Type-check fallback (carry-over from Plan 01):** `pnpm typecheck` script does not exist in `package.json`. Substituted `pnpm exec tsc --noEmit`. Already documented as Rule 3 deviation in Plan 01 SUMMARY; no further escalation needed in Plan 02.
- **node_modules absence (carry-over from Plan 01):** Worktree did not have npm dependencies installed; ran `pnpm install --frozen-lockfile` (~7s; lockfile unchanged). Already documented as Rule 3 deviation in Plan 01 SUMMARY; no further escalation needed in Plan 02.

## Deviations from Plan

### Auto-fixed Issues (carry-over from Plan 01, mechanical recurrence)

**1. [Rule 3 - Blocking] node_modules missing in worktree (RECURRENCE from Plan 01 deviation #1)**
- **Found during:** Pre-Task-0 environment check
- **Issue:** Worktree did not have npm dependencies installed; `pnpm exec tsc --noEmit` and `pnpm build` would fail with `command not found` errors
- **Fix:** Ran `pnpm install --frozen-lockfile` (~7s; lockfile unchanged — confirmed via `git status` clean)
- **Files modified:** node_modules/ only (gitignored)
- **Verification:** Subsequent `pnpm exec tsc --noEmit` exited 0 cleanly across both Build C and Build D
- **Committed in:** No commit needed (node_modules is gitignored; lockfile unchanged)

**2. [Rule 3 - Blocking] No `typecheck` npm script in package.json (RECURRENCE from Plan 01 deviation #2)**
- **Found during:** Task 1 / Task 2 verification step
- **Issue:** Plan 02 acceptance criteria call for `pnpm typecheck`; this script is not defined in `package.json` `"scripts"`. Same gap as Plan 01.
- **Fix:** Substituted `pnpm exec tsc --noEmit` as the equivalent direct invocation (TypeScript compiler in no-emit mode, exits 0 if zero errors).
- **Files modified:** None (no source change; just substitution of verification command).
- **Verification:** `pnpm exec tsc --noEmit` exit 0 after both Build C and Build D.
- **Committed in:** Documented in `61-02-RESEARCH-LOG.md` row notes for both Build C and Build D.

### Worktree Branch Hygiene (Plan 02 only — not a deviation per se)

**Worktree branch base correction:** Worktree HEAD on entry was `864d806` (downstream of Plan 01's `87205a8` on a different branch line — `worktree-agent-a67ee38c` had been advanced past the expected base by unrelated commits). Per `<worktree_branch_check>` instructions, performed `git reset --hard 87205a8b745221bc1df5cab9ecb77234503259e9` to align with the parallel-executor's expected base. Verified post-reset: `next.config.ts` contained Plan 01 end-state `["lucide-react", "radix-ui", "input-otp"]`. No work was lost (the `864d806` advances were on PDE monitoring + BR panel content, unrelated to Phase 61 scope).

---

**Total deviations:** 2 auto-fixed (both Rule 3 carry-over from Plan 01) + 1 worktree-base reset (procedural, not scope expansion)
**Impact on plan:** Zero scope creep. The 5 atomic commits reflect the plan's exact intended deliverables.

## Issues Encountered

- **Build C and Build D produced identical Route (app) tables to Build B (carry-over) at the KB-rounding granularity.** This is the expected behavior for lazy-path packages per 61-RESEARCH §Risks #5 — `cmdk`, `vaul`, `sonner`, and `react-day-picker` are all behind `next/dynamic` wrappers and contribute zero bytes to the homepage's initial First Load JS. The transform may have shrunk the lazy chunks themselves when dynamically imported at user interaction time, but those chunks are NOT in the gating Route (app) stdout table per the BND-01 measurement protocol. Plan 02 deliberately did not measure lazy-chunk-internal sizes — that depth is not gating.
- **`Failed to load dynamic font for ✓ . Status: 400` warnings during `Generating static pages`:** Same warning as Plan 01 builds (cosmetic, pre-existing build-pipeline noise); unrelated to optimizePackageImports changes. Did not affect build success or page generation.
- **`No bundles were parsed. Analyzer will show only original module sizes from stats file.`:** Cosmetic webpack-bundle-analyzer warning for the nodejs.html report (server-side bundles); the gating client.html report parses normally. Unchanged from Plan 01.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

**Plan 03 (BND-03 verify + BND-01 final gate + AES-04 pixel-diff) unblocked.**

Forward-looking notes for Plan 03:

1. **Lazy-path harvest is zero at the gating-metric level.** Plan 03 final-gate must NOT count any further "Shared by all" reduction from Plan 02; the 1 KB gap to BND-01 ≤102 KB target remains. Plan 03 has two paths:
   (a) Declare ≤102 KB unachievable within Phase 61's optimizePackageImports-only mandate → escalate to Phase 62 follow-up phase. Document the verdict in `61-03-FINAL-GATE.md`.
   (b) Discover a final-gate-only vector (e.g., re-baselining the 103 KB as the practical Next.js 15 runtime floor, accepting `≤103 KB` as the lock).
   Recommendation: Plan 03 should treat "Shared by all = 103 KB" as the de facto floor and propose either acceptance or Phase 62 escalation; do NOT spend further effort within Plan 03 on chasing the 1 KB gap.

2. **Total Phase 61 BND-02 harvest at end of Plan 02:** −16 KB / 5.7% on `/` First Load JS (and −15 to −16 KB across all Radix-consuming routes). 100% of this harvest came from Plan 01 eager-path additions; Plan 02 lazy additions are defensive (cost zero, gating-metric gain zero).

3. **Plan 03 reduction% calculation (chunk 3302+7525 sums delta) inputs:** Build D's `.next/static/chunks/` directory state is now the Phase 61 end-state for chunk-ID drift accounting. Per Plan 01 forward notes, the FALSE-PASS GUARD (missing successor → default `Bf_X = B0_X`) is required because chunk 3302 disappeared at Build A and reappears as chunks/4335. Plan 03 must apply the guard.

4. **Plan 03 AES-04 pixel-diff readiness:** Plan 01's 20/20 PASS at 0% canary established invisible-by-construction for eager-path additions; lazy-path additions in Plan 02 affect zero rendered pixels by definition (lazy chunks remain unmounted on initial load). Plan 03's dedicated `tests/v1.8-phase61-bundle-hygiene.spec.ts` at MAX_DIFF_RATIO=0 is expected to pass on the same basis.

5. **Final next.config.ts state for Plan 03 input (verbatim):**
   ```ts
   experimental: {
     optimizePackageImports: ["lucide-react", "radix-ui", "input-otp", "cmdk", "vaul", "sonner", "react-day-picker"],
     useCache: true,
   },
   ```

## Self-Check: PASSED

Verified via `git log` and file existence:
- FOUND: `.planning/phases/61-bundle-hygiene/61-02-RESEARCH-LOG.md` (3 populated rows: B carry-over / C / D; 4 stale-chunk-guard mentions; date-fns SKIP section; Build C + Build D detail blocks present)
- FOUND: `.planning/phases/61-bundle-hygiene/61-02-SUMMARY.md` (this file)
- FOUND: `next.config.ts` with `["lucide-react", "radix-ui", "input-otp", "cmdk", "vaul", "sonner", "react-day-picker"]` (no `"date-fns"` substring; no `"@radix-ui/react-` substring)
- FOUND: commit `1937a4a` (docs Build B carry-over + date-fns SKIP rationale)
- FOUND: commit `87ced88` (chore cmdk + vaul)
- FOUND: commit `978c77a` (docs Build C measurement)
- FOUND: commit `bd005b0` (chore sonner + react-day-picker)
- FOUND: commit `78bced7` (docs Build D measurement)
- VERIFIED: `pnpm exec tsc --noEmit` exit 0 (final state)
- VERIFIED: stale-chunk guard `rm -rf .next/cache .next` documented and applied before each build
- VERIFIED: bisect order chore-before-docs preserved across 5 commits

---
*Phase: 61-bundle-hygiene*
*Plan: 02 — Lazy-path packages*
*Completed: 2026-04-26*
