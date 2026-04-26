---
phase: 61-bundle-hygiene
plan: "01"
subsystem: build-config
tags: [bundle-hygiene, optimizePackageImports, radix-ui, input-otp, webpack, next15]

requires:
  - phase: 57
    provides: "DGN-02 LCP diagnosis with chunk 3302 + 7525 attribution (Radix 148.1 KB + 53.3 KB; input-otp 9.1 KB) — feeder for Phase 61 candidate list"
  - phase: 60
    provides: "Path A LCP-01 baseline (810ms); Wave-3 measurement discipline reused here"
provides:
  - "Eager-path optimizePackageImports extension: ['lucide-react', 'radix-ui', 'input-otp']"
  - "Per-build measurement log with stale-chunk-guarded Build 0 / A / B (BND-04 compliant)"
  - "Verified: −16 KB on / First Load JS (route-specific) + 0 KB on Shared by all (floor unchanged)"
  - "AES-04 invisible-by-construction confirmed (Phase 59 canary 20/20 PASS at 0%)"
affects: [phase-61-plan-02, phase-61-plan-03, phase-62-bundle-followup]

tech-stack:
  added: []
  patterns:
    - "Per-package atomic build measurement (chore commit then docs commit) for clean bisect"
    - "Stale-chunk guard prefix `rm -rf .next/cache .next` before every gating measurement"
    - "Phase 59 pixel-diff spec as in-plan AES-04 canary (CI=true autoStart pattern)"

key-files:
  created:
    - ".planning/phases/61-bundle-hygiene/61-01-RESEARCH-LOG.md"
    - ".planning/phases/61-bundle-hygiene/61-01-SUMMARY.md"
  modified:
    - "next.config.ts"

key-decisions:
  - "Use radix-ui meta-package form (^1.4.3), NOT scoped @radix-ui/react-* — matches all 27 import sites"
  - "Treat input-otp as defensive inclusion per RESEARCH §7 — sub-KB delta accepted (cost zero, gain nonzero)"
  - "Type-check via `pnpm exec tsc --noEmit` (no `typecheck` npm script in package.json — Deviation Rule 3 fallback)"
  - "Build 0 baseline = 103 KB Shared by all / 280 KB / First Load — captured before any 61-01 changes for clean delta attribution"

patterns-established:
  - "Bisect-friendly commit cadence: chore(code) → docs(measurement) per package addition"
  - "Chunk-ID drift handling: barrel transforms split aggregate chunks (e.g., 3302 → multiple smaller chunks); reduction% guards must default to baseline size on missing successor chunks (FALSE-PASS GUARD)"

requirements-completed: [BND-02]

duration: 8min
completed: 2026-04-26
---

# Phase 61 Plan 01: Eager-path packages (radix-ui + input-otp) Summary

**Extended `optimizePackageImports` to `["lucide-react", "radix-ui", "input-otp"]`; route-specific `/` First Load JS reduced 280 → 264 KB (−16 KB / 5.7%); shared floor unchanged at 103 KB (BND-01 target ≤102 KB still requires +1 KB lever in Plan 02/03).**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-04-26T20:08:57Z
- **Completed:** 2026-04-26T20:16:54Z
- **Tasks:** 3 (Task 0 baseline, Task 1 radix-ui, Task 2 input-otp)
- **Files modified:** 2 (`next.config.ts`, new `61-01-RESEARCH-LOG.md`)
- **Commits:** 5 atomic (3 docs + 2 chore)
- **Builds run:** 3 stale-chunk-guarded production builds (Build 0, A, B)

## Accomplishments

- **Build 0 baseline captured** before any change: Shared 103 KB, `/` 280 KB, `/_not-found` 103 KB, chunk 2979 (Next runtime) 45.8 KB, chunk 5791061e (react-dom) 54.2 KB, chunks/3302 (Radix aggregate) 163,174 B, chunks/7525 (Radix popper) 76,893 B
- **Build A (radix-ui added)**: `/` First Load 264 KB (−16 KB), all Radix-consuming routes drop −15 to −16 KB, chunk 3302 split out by barrel transform, chunk 7525 −0.5 KB
- **Build B (input-otp added)**: identical First Load JS to Build A at KB granularity (sub-KB marginal contribution per RESEARCH §7 defensive inclusion)
- **AES-04 canary green**: 20/20 Phase 59 pixel-diff tests PASS at 0% across 5 routes × 4 viewports
- **Type safety confirmed**: `pnpm exec tsc --noEmit` exit 0 after both additions

## Task Commits

Each task committed atomically with `--no-verify` (parallel-executor protocol):

1. **Task 0: Build 0 baseline + RESEARCH-LOG creation** — `742b2fd` (docs)
2. **Task 1a: Add radix-ui to optimizePackageImports** — `0538432` (chore)
3. **Task 1b: Build A measurement (radix-ui delta)** — `3227fb7` (docs)
4. **Task 2a: Add input-otp to optimizePackageImports** — `09a5e59` (chore)
5. **Task 2b: Build B measurement (input-otp + canary)** — `3091b24` (docs)

Bisect order preserved: every code change has a chore commit BEFORE its measurement docs commit, so reverting a single chore commit reverts that package addition cleanly.

## Files Created/Modified

- `next.config.ts` — `experimental.optimizePackageImports` extended from `["lucide-react"]` to `["lucide-react", "radix-ui", "input-otp"]`; `useCache: true` and `redirects()` block preserved verbatim
- `.planning/phases/61-bundle-hygiene/61-01-RESEARCH-LOG.md` — NEW; per-build measurement table + Build 0/A/B detail blocks + Plan 02 forward notes
- `.planning/phases/61-bundle-hygiene/61-01-SUMMARY.md` — THIS FILE

## Build Outputs (Route (app) stdout, gating source)

| Build | next.config.ts state | Shared by all | `/` First Load JS | `/_not-found` First Load JS | Δ vs Build 0 |
|-------|---------------------|---------------|-------------------|----------------------------|--------------|
| 0     | `["lucide-react"]` | 103 KB | 280 KB | 103 KB | 0 |
| A     | `["lucide-react", "radix-ui"]` | 103 KB | 264 KB | 103 KB | 0 (Shared); −16 KB on `/` |
| B     | `["lucide-react", "radix-ui", "input-otp"]` | 103 KB | 264 KB | 103 KB | 0 (Shared); −16 KB on `/` cumulative |

**Per-route deltas at Build B vs Build 0:**
- `/`: 280 → 264 KB (−16 KB)
- `/system`: 274 → 258 KB (−16 KB)
- `/inventory`: 282 → 267 KB (−15 KB)
- `/init`: 266 → 251 KB (−15 KB)
- `/reference`: 288 → 273 KB (−15 KB)
- `/builds`: 269 → 254 KB (−15 KB)
- `/_not-found`: 103 → 103 KB (unchanged; confirms shared-floor stability)

## Decisions Made

- **Meta-package vs scoped Radix:** Used `"radix-ui"` (the meta-package) per 61-RESEARCH §1 — confirmed all 27 import sites use the meta-package; zero `@radix-ui/react-*` direct imports exist. Adding the scoped form would have been redundant and pollution.
- **Input-otp inclusion despite sub-KB return:** Accepted defensive-inclusion outcome per RESEARCH §7 — package is now part of the build-time barrel-rewrite set so future surface expansion is auto-tree-shaken. Cost zero, gain nonzero.
- **Phase 59 spec as canary:** Per Plan 01 Task 2 — used the existing 4-viewport × 5-route Phase 59 pixel-diff spec rather than spinning up a new spec. The Phase 61 dedicated spec (`tests/v1.8-phase61-bundle-hygiene.spec.ts` at MAX_DIFF_RATIO = 0) is Plan 03's Wave 0 deliverable and was deliberately not pre-empted here.
- **Type-check fallback:** `pnpm typecheck` script not in package.json (project uses `next build`'s embedded type check + standalone `pnpm exec tsc --noEmit`). Logged as Deviation Rule 3 in SUMMARY + RESEARCH-LOG.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] node_modules missing in worktree**
- **Found during:** Task 0 (first build invocation `next: command not found`)
- **Issue:** Worktree did not have npm dependencies installed; `pnpm build` failed with `sh: next: command not found`
- **Fix:** Ran `pnpm install` (8.3s; 30+ packages including next, three, gsap, vitest, lighthouse, etc.)
- **Files modified:** node_modules/ only (pnpm-lock.yaml unchanged — confirmed by `git status` clean)
- **Verification:** Build 0 then proceeded to compile successfully in 10.8s
- **Committed in:** No commit needed (node_modules is gitignored; lockfile unchanged)

**2. [Rule 3 - Blocking] No `typecheck` npm script in package.json**
- **Found during:** Task 1 verification step
- **Issue:** Plan 01 acceptance criteria call for `pnpm typecheck`; this script is not defined in `package.json` `"scripts"` (project uses `next build`'s embedded type check). Running `pnpm typecheck` errors with `Command "typecheck" not found`.
- **Fix:** Substituted `pnpm exec tsc --noEmit` as the equivalent direct invocation (TypeScript compiler in no-emit mode, exits 0 if zero errors).
- **Files modified:** None (no source change; just substitution of verification command).
- **Verification:** `pnpm exec tsc --noEmit` exit 0 after both Build A and Build B; Build A and B's `next build` also confirmed `Linting and checking validity of types ...` passed embedded.
- **Committed in:** Documented in `61-01-RESEARCH-LOG.md` row notes for both Build A and Build B (no separate commit; the substitution applies only to the verification step, not the artifacts).

---

**Total deviations:** 2 auto-fixed (both Rule 3 — blocking environment/tooling gaps; both resolved without scope expansion)
**Impact on plan:** Zero scope creep. Both deviations were unblock-only fixes; the 5 atomic commits reflect the plan's exact intended deliverables.

## Issues Encountered

- **Build 0 chunk 3302 + 7525 not in "Shared by all":** Per RESEARCH §3 + Risks #4, the Radix-bearing chunks live in route-specific First Load JS, not the shared floor. Logged in RESEARCH-LOG header so Plan 03's reduction% calculation reads them from `.next/static/chunks/` directly rather than expecting them in stdout. Confirmed: chunk 3302 = 163,174 B raw, chunk 7525 = 76,893 B raw at Build 0.
- **Chunk 3302 fragmentation by Build A:** Expected behavior — the `optimizePackageImports: ["radix-ui"]` transform splits the aggregate chunk into per-sub-package chunks (chunks/4335 emerged at 112,290 B as the new aggregate). Plan 03 reduction% guard (FALSE-PASS GUARD: missing successor chunks default `Bf_X = B0_X`) is the right tool for handling this drift.
- **Pixel-diff spec autoStart**: The Phase 59 spec only auto-starts the prod server with `CI=true`; without that flag the spec hits `ECONNREFUSED`. Pre-pended `CI=true` to the canary invocation per Plan 01 Task 2 instructions; spec passed 20/20.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

**Plan 02 (lazy packages cmdk + vaul + sonner + react-day-picker) unblocked.**

Forward-looking notes for Plan 02:
1. Eager-path harvest is complete at −16 KB on `/`. Lazy packages are expected to show ~0 KB delta on Shared by all AND on `/` First Load JS per RESEARCH §6 + Risks #5. This is **not a failure mode** — it confirms the lazy-loading discipline is working as intended.
2. **BND-01 ≤102 KB target is NOT closed by Plan 01.** Shared floor remains 103 KB. The 1 KB gap must come from either: (a) Plan 02 lazy-package transforms shifting marginal modules off the shared floor, OR (b) a separate vector outside Phase 61's scope (Plan 03 final-gate must record the verdict and may escalate to Phase 62).
3. **Plan 03 reduction% calculation must use chunk-ID drift guards.** Build A's chunk 3302 disappearance is by design (barrel rewrite → per-sub-package chunks). The plan-checker's FALSE-PASS GUARD (missing successor → default to baseline size) handles this correctly; Plan 03 should reuse that pattern.
4. **No regression risk to forward plans:** AES-04 canary 20/20 PASS at 0% confirms the eager-path additions are visually invisible. Plan 03's dedicated phase-61 spec (Wave 0 deliverable) at MAX_DIFF_RATIO = 0 is expected to pass on the same basis.

## Self-Check: PASSED

Verified via `git log` and file existence:
- FOUND: `.planning/phases/61-bundle-hygiene/61-01-RESEARCH-LOG.md` (3 populated rows, 4 stale-chunk-guard mentions, Build A + Build B detail blocks present)
- FOUND: `.planning/phases/61-bundle-hygiene/61-01-SUMMARY.md` (this file)
- FOUND: `next.config.ts` with `["lucide-react", "radix-ui", "input-otp"]` (no scoped @radix-ui/react-* substring)
- FOUND: commit `742b2fd` (docs Build 0)
- FOUND: commit `0538432` (chore radix-ui)
- FOUND: commit `3227fb7` (docs Build A)
- FOUND: commit `09a5e59` (chore input-otp)
- FOUND: commit `3091b24` (docs Build B)
- VERIFIED: `pnpm exec tsc --noEmit` exit 0 (final state)
- VERIFIED: AES-04 Phase 59 canary 20/20 PASS at 0% diff

---
*Phase: 61-bundle-hygiene*
*Plan: 01 — Eager-path packages*
*Completed: 2026-04-26*
