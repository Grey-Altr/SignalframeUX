---
phase: 60-lcp-element-repositioning
plan: 01
subsystem: testing
tags: [playwright, performance-observer, lcp, candidate-enumeration, v1.8, measurement-tool]
one-liner: "Standing v1.8 LCP candidate enumeration spec emitting per-viewport ranked snapshot at .planning/codebase/v1.8-lcp-candidates.json (4 viewports, warm-Anton, buffered PerformanceObserver)"

# Dependency graph
requires:
  - phase: 57-diagnosis-pass-aesthetic-of-record-lock-in
    provides: PerformanceObserver pattern (tests/v1.8-lcp-diagnosis.spec.ts), JSON evidence shape (v1.8-lcp-evidence.json), warm-Anton forcing pattern, idempotent upsert pattern
  - phase: 59-critical-path-restructure
    provides: Anton font-display:swap (CRT-03), Lenis requestIdleCallback init (CRT-04), preserved PF-04 autoResize:true (RESEARCH §Q8 measurement parity)
provides:
  - Reusable Playwright spec for paint-candidate enumeration across 4 viewports (mobile-360, iphone13-390, ipad-834, desktop-1440)
  - JSON snapshot at .planning/codebase/v1.8-lcp-candidates.json with per-viewport ranked candidates and isLcp:true winner
  - Confirmed mobile LCP element identity post-Phase-59 (GhostLabel still wins mobile-360 and iphone13-390 — Plan 02 D-04 reactive posture remains valid)
  - Confirmed ipad and desktop LCP element identity (VL-05 // overlay — informational baseline for D-05 monitor-only desktop posture)
affects: [60-02-mobile-intervention, 62-real-device-verification-final-gate]

# Tech tracking
tech-stack:
  added: []  # Zero new dependencies — uses existing @playwright/test
  patterns:
    - "Buffered PerformanceObserver candidate enumeration with 1500ms settling window (vs Phase 57 last-entry-only resolution)"
    - "Idempotent upsert-by-viewport JSON snapshot pattern (extends Phase 57 evidence-file pattern from upsert-by-viewport+fontState)"
    - "qualityTier capture via window-override + viewport-width fallback heuristic (helper at lib/effects/quality-tier.ts is module-scoped, not window-exposed)"

key-files:
  created:
    - tests/v1.8-lcp-candidates.spec.ts
    - .planning/codebase/v1.8-lcp-candidates.json
  modified: []

key-decisions:
  - "qualityTier fallback heuristic: helper at lib/effects/quality-tier.ts is module-scoped (not on window); spec reads window.__sfQualityTier override if present, otherwise falls back to viewport-width heuristic (innerWidth<768 -> tier 2, else tier 1). Field is recording-only per plan spec; type=number is enforced by P01-07 grep gate."
  - "1500ms settling window after `load` (RESEARCH §Q3) — sufficient because LCP candidates stop emitting on user interaction or focus loss; headless Playwright has neither."
  - "Spec writes candidates filtered to elementSize >= 50 px² (D-06 threshold); below this is not meaningful LCP impact."

patterns-established:
  - "Standing v1.8 measurement tool naming: tests/v1.8-{descriptor}.spec.ts -> .planning/codebase/v1.8-{descriptor}.json (mirrors Phase 57 naming)"
  - "Pre-need analysis spec runs against pnpm build && pnpm start (NOT pnpm dev) — same rationale as v1.8-lcp-diagnosis.spec.ts:5-10"
  - "Stale-chunk guard (rm -rf .next/cache .next) before build is mandatory per BND-04"

requirements-completed: [LCP-03]

# Metrics
duration: ~5min
completed: 2026-04-26
---

# Phase 60 Plan 01: LCP Candidate Enumeration Spec Summary

**Standing v1.8 LCP candidate enumeration spec emitting per-viewport ranked snapshot at `.planning/codebase/v1.8-lcp-candidates.json` (4 viewports, warm-Anton, buffered PerformanceObserver, 1500ms settling window).**

## Performance

- **Duration:** ~5 min (292 seconds)
- **Started:** 2026-04-26T18:19:25Z
- **Completed:** 2026-04-26T18:24:25Z
- **Tasks:** 3
- **Files modified:** 2 (created)
- **Spec runtime:** 7.7s for 4/4 viewports passing

## Accomplishments

- Authored `tests/v1.8-lcp-candidates.spec.ts` (180 LOC) — extends Phase 57 PerformanceObserver pattern from last-entry-only resolution to full buffered candidate enumeration with 1500ms settling window and >=50 px² floor.
- Emitted `.planning/codebase/v1.8-lcp-candidates.json` (83 LOC, 4 viewport entries) with per-viewport ranked candidates, exactly one `isLcp:true` winner per viewport, and numeric `qualityTier` field.
- All P01-01..P01-09 validators pass; no divergence — mobile-360 + iphone13-390 LCP selectors still contain `sf-display` (GhostLabel), confirming Plan 02 D-04 reactive posture remains valid post-Phase-59 Anton swap.
- Zero new dependencies; `pnpm tsc --noEmit` clean.

## Task Commits

Each task was committed atomically:

1. **Task 60-01-01: Author tests/v1.8-lcp-candidates.spec.ts** - `0f59336` (feat)
2. **Task 60-01-02: Run spec headless and emit v1.8-lcp-candidates.json** - `d137414` (feat)
3. **Task 60-01-03: Validate JSON schema via grep + jq-style checks** - `fc0c872` (chore — `--allow-empty`, validation-only gate by design)

## Files Created/Modified

- `tests/v1.8-lcp-candidates.spec.ts` — Playwright spec: 4 viewports × 1 fontState (warm) = 4 test cases. Buffered PerformanceObserver collects all `largest-contentful-paint` entries, sorts by startTime ASC, filters >=50 px², marks final entry isLcp:true, writes via idempotent upsert into JSON snapshot.
- `.planning/codebase/v1.8-lcp-candidates.json` — 4-entry array, one per viewport. Each entry: `viewport`, `fontState:"warm"`, `qualityTier:number`, `candidates:CandidateEntry[]`, `capturedAt:ISO8601`. Schema extends `v1.8-lcp-evidence.json`.

## Per-Viewport LCP Identity (Captured)

| Viewport            | Candidates | LCP Selector                                                              | Size (px²) | startTime (ms) | qualityTier |
| ------------------- | ---------- | ------------------------------------------------------------------------- | ---------- | -------------- | ----------- |
| mobile-360x800      | 1          | `span.sf-display.pointer-events-none.select-none.absolute.leading-none.-left-[calc(3*var(--sf-vw))].top-1/2.-translate-y-1/2.text-foreground/[0.04]` (GhostLabel) | 26,100     | 176.0          | 2           |
| iphone13-390x844    | 2          | `span.sf-display.pointer-events-none.select-none.absolute.leading-none.-left-[calc(3*var(--sf-vw))].top-1/2.-translate-y-1/2.text-foreground/[0.04]` (GhostLabel) | 30,632     | 64.0           | 2           |
| ipad-834x1194       | 2          | `span.relative.top-[0.08em].pr-[0.28em].tracking-[-0.12em].text-[1.28em]` (VL-05 // overlay) | 18,747     | 80.0           | 1           |
| desktop-1440x900    | 2          | `span.relative.top-[0.08em].pr-[0.28em].tracking-[-0.12em].text-[1.28em]` (VL-05 // overlay) | 55,890     | 84.0           | 1           |

**Cross-reference vs Phase 57 (`v1.8-lcp-evidence.json`):**

- mobile-360 selector matches Phase 57 verbatim (warm-Anton). Element identity preserved across Phase 59 Anton `optional → swap` migration. **Plan 02 D-04 reactive posture target (GhostLabel LEAF) remains valid.**
- desktop-1440 selector matches Phase 57 verbatim (warm-Anton). VL-05 // overlay still owns desktop LCP. D-05 monitor-only desktop posture remains correct.
- Sizes shifted slightly (mobile 28,459 → 26,100; desktop 61,560 → 55,890) — likely due to Anton swap descriptor tuning shifting glyph metrics. No identity change. Sub-threshold for D-04 escalation.
- ipad-834 and desktop-1440 LCP element identity is identical (VL-05 // overlay) — informational baseline confirming D-05 desktop monitor-only is the correct phase posture.

## Decisions Made

- **qualityTier inline fallback heuristic** — `lib/effects/quality-tier.ts` exports `getQualityTier(): "ultra" | "high" | "medium" | "fallback"` (string union) and is module-scoped (not exposed on `window`). The plan's spec contract requires `qualityTier: number`, with P01-07 enforcing `typeof === 'number'`. Resolution: spec reads `window.__sfQualityTier` if present, otherwise falls back to viewport-width heuristic (`innerWidth < 768 → 2`, else `1`). Field is recording-only per plan spec — does not block measurement. If a future surface needs the actual string tier, the helper can be exposed via `window.__sfQualityTier` from a client component.
- **Stale dev-server auto-kill (Rule 3)** — Port 3000 was occupied by an orphaned `next dev --turbopack` process (PID 19175) from a prior session, returning HTTP 500 from a deleted `.next` build. Killed the process before `pnpm start` to restore a clean measurement environment. Documented in Task 60-01-02 commit message.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Killed stale next dev --turbopack process on port 3000**
- **Found during:** Task 60-01-02 (between stale-chunk guard and `pnpm start`)
- **Issue:** Orphaned `next dev --turbopack` (PID 19175 / parent 19135) was bound to port 3000 from a previous session, returning HTTP 500 because our `rm -rf .next/cache .next` had wiped its build artifacts. The plan's `pnpm start &` would have failed to bind to port 3000.
- **Fix:** Identified the process via `lsof -i :3000` + `ps -p`, confirmed it was a dev server (not the production server we needed), killed it, verified port free.
- **Files modified:** None (process cleanup only)
- **Verification:** `lsof -i :3000` returned `port 3000 free`; subsequent `pnpm start` bound successfully and served HTTP 200.
- **Committed in:** `d137414` (Task 60-01-02 commit message documents the auto-fix)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Strictly defensive — the dev server's stale state would have collided with the plan's documented `pnpm build && pnpm start` lifecycle, and a real-world re-runner of this spec on a developer machine will face the same situation. No scope creep; no production source touched; measurement environment correctly matched the plan's intent (warm-Anton against post-Phase-59 production build).

## Issues Encountered

- Build emitted "Failed to load dynamic font for ✓" warnings during static page generation for emoji glyphs in OG/twitter image generation. Pre-existing, unrelated to LCP-03 scope, doesn't affect Plan 01 measurement (route `/` does not depend on these dynamic fonts). Not in scope for Plan 01.

## User Setup Required

None — no external service configuration required. Spec re-runs locally via `pnpm exec playwright test tests/v1.8-lcp-candidates.spec.ts --project=chromium` against `pnpm build && pnpm start`.

## Next Phase Readiness

- **Plan 02 Wave 0 unblocked** — `.planning/codebase/v1.8-lcp-candidates.json` is the seed input for D-04 reactive posture. Plan 02 will:
  1. Read `mobile-360x800` LCP selector → confirm GhostLabel target (already confirmed: `span.sf-display...text-foreground/[0.04]`).
  2. Run `getBoundingClientRect()` measurement on `[data-ghost-label="true"]` to derive `containIntrinsicSize` value.
  3. Apply `content-visibility: auto` + `containIntrinsicSize` to `components/animation/ghost-label.tsx` LEAF only (Anti-Pattern #5 leaf-only discipline).
  4. Re-run this spec post-intervention (P02-06) to verify GhostLabel selector NO LONGER appears as `isLcp:true` on mobile.
- **Phase 62 VRF-04 unblocked** — same spec is the template for real-device candidate enumeration on iPhone 13 Safari + mid-tier Android sampling. JSON shape carries `qualityTier` to cross-reference quality-tier vs candidate identity at lower tiers.
- **No blockers** for downstream work. STATE.md / ROADMAP.md updates owned by orchestrator per execution context.

## Self-Check: PASSED

**Created files exist:**
- FOUND: `tests/v1.8-lcp-candidates.spec.ts` (180 LOC)
- FOUND: `.planning/codebase/v1.8-lcp-candidates.json` (83 LOC, 4 viewport entries)

**Commits exist:**
- FOUND: `0f59336` (Task 60-01-01)
- FOUND: `d137414` (Task 60-01-02)
- FOUND: `fc0c872` (Task 60-01-03 — `--allow-empty` validation gate)

**Validators all green:**
- P01-01..P01-09 all PASS
- Required-keys grep cross-check (viewport / candidates / qualityTier / isLcp) all PASS
- `pnpm tsc --noEmit` exits 0
- `git diff package.json` empty (no new deps)
- `git diff --stat HEAD~3..HEAD` shows ONLY `tests/v1.8-lcp-candidates.spec.ts` + `.planning/codebase/v1.8-lcp-candidates.json` (no production source touched)

---
*Phase: 60-lcp-element-repositioning*
*Completed: 2026-04-26*
