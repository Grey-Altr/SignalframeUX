# Phase 62: Real-Device Verification + Final Gate — Research

**Researched:** 2026-04-27
**Domain:** Multi-device performance verification + RUM aggregation + final-gate ratification
**Confidence:** HIGH (verification mechanisms all exist in repo or are documented; all 12 CONTEXT.md decisions stand on shipped code)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions (verbatim)

- **D-01 — Plan/PR shape:** **3 plans, 3 PRs** sequenced by VRF-05's mandatory ≥24h sampling window.
  - **Plan 01:** VRF-01 + VRF-04 — multi-device WebPageTest matrix + `MID-MILESTONE-CHECKPOINT.md` sign-off.
  - **Plan 02:** VRF-02 + VRF-03 — synthetic launch-gate 5× median run + `chrome-devtools` MCP scroll-test motion verification.
  - **Plan 03:** VRF-05 + final-gate ratification — RUM 24h window confirmation + AES-04 read-only pixel-diff + Phase 60 SUMMARY ratification + `FINAL-GATE.md` + `VERIFICATION.md` + milestone-summary handoff.

- **D-02 — VRF-01 device profile matrix:** Roadmap-verbatim 3 profiles — iPhone 13/14 Safari, Galaxy A14 Chrome, mid-tier Android (e.g., Moto G Power 2024 or equivalent on WPT). JSON committed to `.planning/perf-baselines/v1.8/vrf-01-{ios-iphone13}.json`, `…{android-a14}.json`, `…{android-midtier}.json`.

- **D-03 — VRF-01 source:** WebPageTest free tier as primary source. BrowserStack used only as fallback if a profile is unavailable on WPT free tier on the day of measurement.

- **D-04 — VRF-01 run discipline:** 5 runs median per profile, LTE network profile (Verizon 4G or equivalent), warm cache. Capture both first-view and repeat-view JSON.

- **D-05 — VRF-02 synthetic gate:** `pnpm tsx scripts/launch-gate.ts` 5 sequential runs against prod URL. Median computed across all 5 runs; pass requires median 100/100 across all 4 categories AND median LCP <1.0s AND median CLS=0 AND median TTI <1.5s. Output captured at `.planning/perf-baselines/v1.8/vrf-02-launch-gate-runs.json`.

- **D-06 — VRF-03 motion contract:** `chrome-devtools` MCP scroll-test executed against prod URL (not localhost) for end-to-end real-deploy verification. Recorded as MD note at `.planning/perf-baselines/v1.8/vrf-03-motion-contract.md` with single-GSAP-ticker assertion + per-SIGNAL-effect render confirmation + `prefers-reduced-motion: reduce` collapse verification.

- **D-07 — VRF-04 mid-milestone checkpoint:** `MID-MILESTONE-CHECKPOINT.md` is a synthesis doc, not raw measurement. Reads VRF-01 JSON files + Phase 60 D-07 mini-check + LHCI medians from Phase 58/60/61 history.

- **D-08 — VRF-05 RUM aggregation:** `vercel logs <project> --output json` over the post-deploy ≥24h window, filtered to `/api/vitals` POST entries, computed locally via `scripts/v1.8-rum-aggregate.ts` (devDep tooling). Output: `.planning/perf-baselines/v1.8/vrf-05-rum-p75-lcp.json` with `{ window_start, window_end, sample_count, p75_lcp_ms, p50_lcp_ms, p99_lcp_ms, by_viewport: { mobile, desktop } }`. Pass: p75 LCP <1.0s. Sample-count floor: ≥100.

- **D-09 — Carry-over absorption (Phase 60 SUMMARY):** Phase 60 SUMMARY ratification absorbed into Plan 03. Plan 03 verifies `60-01-SUMMARY.md` + `60-02-SUMMARY.md` accurately reflect shipped state, ratifies, and updates STATE.md Phase 60 row from "Path A closed (ratification deferred)" to "complete".

- **D-10 — Carry-over absorption (Phase 58 HUMAN-UAT):** Plan 03 reads `58-HUMAN-UAT.md`, surfaces the 2 GitHub repo-settings items in the FINAL-GATE.md "deferred to user" section. Phase 62 does NOT block on these.

- **D-11 — AES-04 standing pixel-diff:** Read-only AES-04 pixel-diff at phase end — 20 surfaces (4 viewports × 5 pages) against `.planning/visual-baselines/v1.8-start/`, MAX_DIFF_RATIO 0.005. Output: `.planning/perf-baselines/v1.8/vrf-aes04-final.json`. Pass: all 20 surfaces ≤0.5%.

- **D-12 — Final-gate close-out artifact set:** `62-MID-MILESTONE-CHECKPOINT.md`, `62-FINAL-GATE.md`, `62-VERIFICATION.md`, `MILESTONE-SUMMARY.md` (in `.planning/milestones/v1.8/`).

### Claude's Discretion

- Exact `scripts/v1.8-rum-aggregate.ts` JSON shape (which percentiles to compute beyond p75; whether to break down by viewport / by device / by page) — Claude picks based on what `vercel logs` surfaces.
- Plan 01 commit-split granularity (one commit per device JSON vs one commit for the whole matrix + checkpoint synthesis).
- VRF-03 chrome-devtools MCP step sequence (which scroll positions to capture, how many; whether to record a video artifact or stills).
- Plan 03 sequencing of AES-04 pixel-diff vs RUM window wait (parallel-safe).

### Deferred Ideas (OUT OF SCOPE)

- **Sentry Performance / Vercel Analytics integration for ongoing RUM** — runtime dep; revisit in v1.9.
- **Programmatic VRF-03 motion contract spec** (`tests/v1.8-vrf-motion-contract.spec.ts`) — D-06 chose chrome-devtools MCP only.
- **5+ device profile matrix** (iPhone SE low-end, Pixel 7 high-end) — D-02 chose verbatim 3 profiles.
- **BrowserStack subscription** — D-03 chose WPT-only.
- **Auto-running launch-gate.ts in CI on prod deploy** — v1.9 nice-to-have.
- **Phase 58 GitHub repo-settings (branch protection + LHCI required check)** — surfaces but does not absorb (D-10).
- **AES-04 pixel-diff CI gate automation** — owned by future hardening.
- **Cross-milestone perf trend dashboard** — milestone-summary seeds with v1.8 numbers; full dashboard is v1.9+.
- **New code interventions for performance regressions** — any regressor → Phase 60.1 / 61.1 / 62.x decimal phase.
- **Re-running Phase 57 LCP diagnosis.**
- **Chromatic re-baseline** (AES-02 standing rule).
- **Phase 58 GitHub repo-settings** (user-only action).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID     | Description                                                                                                                                                                          | Research Support                                                                                                                                          |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| VRF-01 | WebPageTest free tier (or BrowserStack supplement) JSON for ≥3 device profiles (iPhone 13/14 Safari, Galaxy A14 Chrome, mid-tier Android) committed to `.planning/perf-baselines/v1.8/`. | §1 (WPT API recipe + location IDs + JSON pruning + rate-limit strategy + submission/retrieval scripts).                                                  |
| VRF-02 | `pnpm tsx scripts/launch-gate.ts` run 5× against prod URL — median 100/100, LCP <1.0s, CLS=0, TTI <1.5s.                                                                              | §2 (existing launch-gate.ts hardcodes `RUNS = 3` + worst-of, NOT median-of-5 — wrapper required; output JSON shape + run-aggregation algorithm).         |
| VRF-03 | `chrome-devtools` MCP scroll-test confirms motion contract intact (single GSAP ticker, all SIGNAL effects render, reduced-motion still kills timeline).                              | §3 (full MCP tool sequence + single-ticker assertion mechanism + 6 SIGNAL surface render checklist + `cssMediaFeatures` emulation + evidence MD format). |
| VRF-04 | Mid-milestone real-device checkpoint after Phase 60 (not deferred to end). Catches mobile-emulation-pass / real-device-fail divergence early (Pitfall #10).                          | §4 (synthesis doc skeleton + real-vs-synthetic divergence threshold + escalation path).                                                                  |
| VRF-05 | Field RUM 75th-percentile LCP <1.0s post-deploy (~24h sampling window via CIB-05 telemetry endpoint).                                                                                | §5 (`vercel logs --json` invocation + Vercel log envelope shape + aggregator architecture + synthetic-seeding fallback + 24h window trigger).            |
</phase_requirements>

## Summary

Phase 62 is **read-only verification + ratification only**. Five VRFs map to five artifact files in `.planning/perf-baselines/v1.8/`, plus four close-out docs (`62-MID-MILESTONE-CHECKPOINT.md`, `62-FINAL-GATE.md`, `62-VERIFICATION.md`, `MILESTONE-SUMMARY.md`). No production source touched. The 24h RUM window in VRF-05 is the milestone-closing critical path — Plan 03 has built-in idle time that Phase 60 SUMMARY ratification + AES-04 read-only pixel-diff fill productively.

The execution surface is **non-trivial** in three places:

1. **launch-gate.ts is hardcoded to `RUNS = 3` worst-of**, not the `RUNS = 5` median-of CONTEXT D-05 requires. Plan 02 must wrap the script in a 5-iteration runner OR fork it; either is a measurement-tooling change in `scripts/`, not production source.
2. **WebPageTest free-tier API requires `X-WPT-API-KEY` header** (since 2023; anonymous browser-based submission still works at https://www.webpagetest.org/ but the programmatic `runtest.php` endpoint requires a key — free-tier "Starter" account = 300 monthly tests).
3. **`vercel logs --json` time window has practical limits** — Vercel's CLI streams JSON Lines from runtime logs, but the documented retention is 1h on the free tier and 3 days on Pro; the 24h window is fetchable on Pro plans, while free-tier may need stitching multiple shorter pulls. Plan 03 must verify project's Vercel plan tier before declaring the RUM aggregation feasible.

**Primary recommendation:** Plan 02 ships a thin `scripts/launch-gate-vrf02.ts` wrapper (5 iterations, median-of-5, JSON output to `.planning/perf-baselines/v1.8/vrf-02-launch-gate-runs.json`) — does NOT modify `scripts/launch-gate.ts` (CIB-04 contract: byte-identical to merge-base per Phase 58, see PROJECT.md line 93). Plan 01 batches all 3 WPT submissions in one sitting with API key set. Plan 03 builds the RUM aggregator on `vercel logs --json --since 24h --query "rum"`.

## Standard Stack

### Core (already in repo — zero new deps)

| Library / tool                | Version (lockfile)                                                | Purpose                                                                                                | Why Standard                                                                                  |
| ----------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `lighthouse`                  | as resolved by `scripts/launch-gate.ts:26`                        | Synthetic perf measurement against prod URL                                                            | Existing CIB-04 mechanism (Phase 35 → Phase 58 lock); proven 5-run median pattern in v1.7 PRF |
| `chrome-launcher`             | transitive of `lighthouse`                                        | Headless Chromium boot for lighthouse                                                                  | Already wired through `scripts/launch-gate.ts`                                                |
| `@playwright/test`            | (devDep)                                                          | Pixel-diff harness re-run for AES-04                                                                   | `tests/v1.8-phase58-pixel-diff.spec.ts` already at `MAX_DIFF_RATIO = 0.005` (verified line 34)|
| `pixelmatch` + `pngjs`        | (devDep — see `tests/v1.8-phase58-pixel-diff.spec.ts:5,4`)        | Comparison-mode pixel-diff vs `.planning/visual-baselines/v1.8-start/`                                 | D-11 reuses without `--update-snapshots`                                                      |
| `vercel` CLI                  | 50.43.0 (verified `vercel --version` 2026-04-27)                  | RUM log retrieval                                                                                      | Zero-new-runtime-dep mandate; native Vercel log surface                                       |
| `chrome-devtools` MCP plugin  | (Claude Code MCP server)                                          | VRF-03 motion contract verification + reduced-motion emulation                                         | `feedback_visual_verification.md`; D-06 mechanism                                             |
| `tsx`                         | (devDep, used by `pnpm tsx`)                                      | Run TypeScript scripts directly                                                                        | Already wired through `pnpm tsx scripts/*` pattern                                            |

### Supporting (existing scripts — read-only references)

| Asset                                                                | Purpose                                                                                          | When to Use                                                                  |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| `scripts/launch-gate.ts`                                             | Lighthouse `RUNS = 3` worst-of runner (verified at line 31)                                      | VRF-02 — wrap, do NOT modify (CIB-04 byte-identity)                          |
| `scripts/launch-gate-runner.mjs`                                     | ESM-runner sibling for tsx ESM/CJS interop bypass                                                | If `tsx scripts/launch-gate.ts` fails, the wrapper can call `.mjs` instead   |
| `app/_components/web-vitals.tsx`                                     | `useReportWebVitals` → `sendBeacon` to `/api/vitals` (Phase 58 CIB-05 SHIPPED)                   | VRF-05 — telemetry SOURCE; do NOT modify                                     |
| `app/api/vitals/route.ts`                                            | `console.log(JSON.stringify({ type: "rum", name, value, id, ... }))` (verified line 81)          | VRF-05 — every RUM line is `{ "type": "rum", ... }`; grep filter uses this   |
| `tests/v1.8-baseline-capture.spec.ts`                                | Phase 57 baseline harness (warm-Anton + reducedMotion)                                           | Reference only; D-11 uses `tests/v1.8-phase58-pixel-diff.spec.ts`            |
| `tests/v1.8-phase58-pixel-diff.spec.ts`                              | AES-04 pixel-diff at 0.005; emits diff PNGs to `.playwright-artifacts/phase58-pixel-diff/`        | D-11 — re-run as-is, capture results, do NOT pass `--update-snapshots`       |
| `playwright.config.ts`                                               | SwiftShader caveat at lines 22-27                                                                | Reference for VRF-04 escalation reasoning                                    |
| `.lighthouseci/lighthouserc.json`                                    | Phase 58 LHCI median-of-5, mobile-only, throttle Slow 4G + 4× CPU                                | VRF-04 reads as synthetic-vs-real comparison source                          |
| `.planning/perf-baselines/v1.8/phase-60-mobile-lhci.json`            | Phase 60 LHCI median snapshot (LCP=810ms, CLS=0.002505)                                          | VRF-04 baseline for synthetic comparison                                     |
| `.planning/perf-baselines/v1.8/phase-60-realdevice-checkpoint.md`    | Phase 60 D-07 single-device WPT mini-check (iPhone 13 / 5 runs / Verizon LTE)                    | VRF-04 reads to confirm Plan 01 multi-device matches D-07 methodology        |
| `.planning/codebase/v1.8-lcp-diagnosis.md`                           | Phase 57 cross-viewport LCP element identity (mobile=GhostLabel; desktop=VL-05 //)               | VRF-04 cross-checks: real-device LCP element should match per-viewport       |
| `.planning/codebase/v1.8-lcp-candidates.json`                        | Plan 01 standing measurement spec output (mobile-360 + iphone13-390 → GhostLabel)                | VRF-04 — confirm same elements survive on real devices                       |
| `.planning/codebase/AESTHETIC-OF-RECORD.md`                          | AES-01..04 standing rules                                                                        | D-11 reads MAX_DIFF_RATIO source-of-truth (0.005)                            |

### Alternatives Considered

| Instead of                                            | Could Use                                          | Tradeoff                                                                                                                                |
| ----------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| WebPageTest free tier                                 | BrowserStack                                       | D-03 — fallback only; subscription cost, no JSON download as easy as WPT                                                                |
| WebPageTest free tier                                 | LambdaTest / Sauce Labs                            | Out of scope (D-03); same paid-subscription objection; not in v1.7-PRF precedent                                                        |
| `vercel logs --json`                                  | Vercel Analytics SDK (`@vercel/speed-insights`)    | OUT OF SCOPE — runtime npm dep, contradicts zero-new-dep rule (REQUIREMENTS.md §Out of Scope)                                           |
| `vercel logs --json`                                  | Custom log forwarder (Logtail / Better Stack / Axiom) | OUT OF SCOPE — runtime infrastructure addition                                                                                          |
| Wrap `launch-gate.ts` (don't modify)                  | Modify `launch-gate.ts` to add `--runs 5 --median` | **REJECTED** — Phase 58 CIB-04 contract: `scripts/launch-gate.ts` byte-identical to merge-base, enforced by Playwright SHA-identity guard |
| chrome-devtools MCP scroll-test                       | Programmatic Playwright spec (`tests/v1.8-vrf-motion-contract.spec.ts`) | D-06 chose MCP only; programmatic version listed as Deferred (CONTEXT line 222)                                                         |
| Synthetic-seeded RUM via Playwright loop              | Wait for natural traffic                           | If natural traffic <100 over 24h, synthetic-seed via chrome-devtools MCP from 3 WPT device profiles (CONTEXT line 213)                 |

**Installation:** No new packages. `vercel` CLI must be globally available (`vercel --version` returns 50.43.0 — verified).

## Architecture Patterns

### Recommended File Layout

```
.planning/perf-baselines/v1.8/
├── phase-60-mobile-lhci.json                      # ALREADY EXISTS — Phase 60 LHCI median (synthetic-vs-real comparison source)
├── phase-60-realdevice-checkpoint.md              # ALREADY EXISTS — Phase 60 D-07 single-device WPT (iPhone 13)
├── vrf-01-ios-iphone13.json                       # NEW — Plan 01 (5-run median, first-view + repeat-view)
├── vrf-01-android-a14.json                        # NEW — Plan 01
├── vrf-01-android-midtier.json                    # NEW — Plan 01 (Moto G Power 2024 or equivalent)
├── vrf-02-launch-gate-runs.json                   # NEW — Plan 02 (5-run median launch-gate-vrf02 output)
├── vrf-03-motion-contract.md                      # NEW — Plan 02 (chrome-devtools MCP scroll-test evidence)
├── MID-MILESTONE-CHECKPOINT.md                    # NEW — Plan 01 (synthesis: 3 device JSONs + Phase 60 D-07 + LHCI medians)
├── vrf-aes04-final.json                           # NEW — Plan 03 (read-only AES-04 pixel-diff, 20 surfaces × 0.005 threshold)
└── vrf-05-rum-p75-lcp.json                        # NEW — Plan 03 (vercel logs aggregation, ≥24h, ≥100 samples)

.planning/phases/62-real-device-verification-final-gate/
├── 62-CONTEXT.md                                  # ALREADY EXISTS
├── 62-DISCUSSION-LOG.md                           # ALREADY EXISTS
├── 62-RESEARCH.md                                 # THIS FILE
├── 62-MID-MILESTONE-CHECKPOINT.md                 # Plan 01 phase-level mirror of perf-baselines synthesis (D-12)
├── 62-FINAL-GATE.md                               # Plan 03 (D-12 close-out)
├── 62-VERIFICATION.md                             # Plan 03 (pde-verifier output, D-12)
├── 62-01-PLAN.md / SUMMARY.md                     # Plan 01 artifacts
├── 62-02-PLAN.md / SUMMARY.md                     # Plan 02 artifacts
└── 62-03-PLAN.md / SUMMARY.md                     # Plan 03 artifacts

.planning/milestones/v1.8/                          # NEW DIRECTORY (does not exist; verified 2026-04-27)
└── MILESTONE-SUMMARY.md                            # Plan 03 (D-12 milestone-archive seed for /pde:complete-milestone v1.8)

scripts/
├── launch-gate.ts                                 # ALREADY EXISTS — DO NOT MODIFY (CIB-04 byte-identity)
├── launch-gate-runner.mjs                         # ALREADY EXISTS — DO NOT MODIFY
├── launch-gate-vrf02.ts                           # NEW — Plan 02 5-run median wrapper (devDep tooling)
├── v1.8-rum-aggregate.ts                          # NEW — Plan 03 vercel-logs RUM aggregator (devDep tooling)
└── v1.8-wpt-submit.ts                             # NEW (optional — Plan 01) batch-submit 3 WPT profiles + retrieve JSON
```

### Pattern 1: VRF-01 — WPT submission + retrieval split

**What:** Submit all 3 device profiles in one batch; capture run IDs; retrieve JSON later (queue depth on free tier is 5–15 min per run).
**When to use:** Plan 01 wave 0 — avoid hitting WPT rate limit by repeated single-test polling.

**Submission (programmatic, free tier with API key):**

```bash
# Source: WebPageTest API Reference — verified 2026-04-27
# Each test = 1 quota unit even with multiple runs (verified WPT docs §runs param)
WPT_API_KEY="$(cat ~/.wpt-api-key)"  # User stores key locally; never commit

# Submit (POST runtest.php with f=json + runs=5 + fvonly=0 to capture both first-view + repeat-view)
curl -X POST "https://www.webpagetest.org/runtest.php" \
  -H "X-WPT-API-KEY: ${WPT_API_KEY}" \
  --data-urlencode "url=https://signalframeux.vercel.app/" \
  --data-urlencode "location=Dulles_iPhone:iPhone-13-Safari.4G" \
  -d "runs=5" \
  -d "fvonly=0" \
  -d "f=json" \
  -d "label=v1.8-vrf-01-ios-iphone13"
# Returns: { statusCode, statusText, data: { testId, jsonUrl, userUrl, ... } }
```

**Retrieval (after queue completes, typically 5–15 min later):**

```bash
curl "https://www.webpagetest.org/jsonResult.php?test=${TEST_ID}" \
  | jq '.data | {id, url, location, connectivity, completed, testRuns, fvonly, successfulFVRuns, median, average, standardDeviation, runs}' \
  > .planning/perf-baselines/v1.8/vrf-01-ios-iphone13.json
```

**JSON pruning recipe (keep <50KB per profile):**

The raw `jsonResult.php` payload is multi-MB (full waterfall + every request). Prune to summary fields only via this jq filter:

```jq
{
  capturedAt: (now | todateiso8601),
  testId: .data.id,
  url: .data.url,
  location: .data.location,
  connectivity: .data.connectivity,
  device_profile: .data.location,
  runs: .data.testRuns,
  fvonly: .data.fvonly,
  successfulFVRuns: .data.successfulFVRuns,
  successfulRVRuns: .data.successfulRVRuns,
  median: {
    firstView: {
      LCP: .data.median.firstView.LargestContentfulPaint,
      CLS: .data.median.firstView["chromeUserTiming.CumulativeLayoutShift"],
      FCP: .data.median.firstView.firstContentfulPaint,
      TTI: .data.median.firstView.TimeToInteractive,
      TBT: .data.median.firstView.TotalBlockingTime,
      SpeedIndex: .data.median.firstView.SpeedIndex
    },
    repeatView: {
      LCP: .data.median.repeatView.LargestContentfulPaint,
      CLS: .data.median.repeatView["chromeUserTiming.CumulativeLayoutShift"],
      FCP: .data.median.repeatView.firstContentfulPaint
    }
  },
  per_run_lcp: [.data.runs[]?.firstView?.LargestContentfulPaint]
}
```

This gets each device JSON to <5KB. Commit ALL three as one Plan 01 wave-1 commit (single-cohort pattern from Phase 57 evidence-file lockstep).

### Pattern 2: VRF-02 — launch-gate wrapper (NOT modification)

**What:** Plan 02 ships `scripts/launch-gate-vrf02.ts` that uses lighthouse directly, runs 5×, computes median-per-category (NOT worst-of), writes `vrf-02-launch-gate-runs.json`.

**Why not modify `scripts/launch-gate.ts`:** Phase 58 CIB-04 contract — see PROJECT.md line 93: "CIB-04 lock enforced: `scripts/launch-gate.ts` byte-identical to merge-base; Playwright SHA-identity guard". A modification would trip the Phase 58 guard.

**Wrapper architecture (`scripts/launch-gate-vrf02.ts`):**

```typescript
#!/usr/bin/env tsx
/**
 * scripts/launch-gate-vrf02.ts — Phase 62 VRF-02 5-run median runner.
 *
 * Wraps lighthouse directly (NOT spawning launch-gate.ts) — shipping a wrapper
 * keeps CIB-04 byte-identity intact while satisfying VRF-02 D-05 contract:
 * 5 runs median, full-category 100/100, LCP <1.0s, CLS=0, TTI <1.5s, written
 * to .planning/perf-baselines/v1.8/vrf-02-launch-gate-runs.json.
 *
 * Usage:
 *   pnpm tsx scripts/launch-gate-vrf02.ts --url https://signalframeux.vercel.app
 */
const RUNS = 5;
const TARGETS = {
  performance: 100, accessibility: 100, "best-practices": 100, seo: 100,
  lcp_ms_max: 1000, cls_max: 0, tti_ms_max: 1500
};
// ... (same chrome-launcher / lighthouse boot pattern as launch-gate.ts:41-54)
// ... (run 5 times sequentially; collect per-run scores + audits.lcp / cls / tti)
// ... (compute median per category across 5 runs; median LCP/CLS/TTI from lhr.audits)
// Output JSON shape (see Pattern 5 below).
```

### Pattern 3: VRF-03 — chrome-devtools MCP scroll-test sequence

**What:** Programmatic-but-MCP-mediated scroll-test against prod URL covering 6 surfaces × motion-state.
**When to use:** Plan 02 wave 2 (after VRF-02 passes — gate-order: synthetic-then-motion).

**MCP tool sequence (per viewport):**

```
1. mcp__plugin_chrome-devtools-mcp__chrome-devtools__new_page
2. mcp__plugin_chrome-devtools-mcp__chrome-devtools__navigate_page → https://signalframeux.vercel.app/
3. mcp__plugin_chrome-devtools-mcp__chrome-devtools__resize_page → 360×800 (mobile) / 1440×900 (desktop)
4. mcp__plugin_chrome-devtools-mcp__chrome-devtools__performance_start_trace
5. mcp__plugin_chrome-devtools-mcp__chrome-devtools__evaluate_script → SINGLE-TICKER ASSERTION (see below)
6. mcp__plugin_chrome-devtools-mcp__chrome-devtools__scroll → progressive scroll top→bottom (6 stops)
7. mcp__plugin_chrome-devtools-mcp__chrome-devtools__take_snapshot at each stop
8. mcp__plugin_chrome-devtools-mcp__chrome-devtools__performance_stop_trace
9. mcp__plugin_chrome-devtools-mcp__chrome-devtools__list_console_messages → grep zero "error" entries
10. mcp__plugin_chrome-devtools-mcp__chrome-devtools__emulate → cssMediaFeatures: [{name:"prefers-reduced-motion",value:"reduce"}]
11. Re-scroll → assert SIGNAL-derived motion COLLAPSED (use take_snapshot diff or evaluate_script reading transform values)
```

**Single-GSAP-ticker assertion (`evaluate_script` payload):**

```javascript
// Returns assertion data for vrf-03-motion-contract.md evidence
(() => {
  const gsap = window.gsap;
  // The performance trace from performance_stop_trace is the AUTHORITATIVE evidence
  // for single-ticker (Animation Frames lane). This in-page probe is supplemental.
  const signalIntensity = getComputedStyle(document.documentElement)
    .getPropertyValue('--sfx-signal-intensity');
  return {
    gsap_present: typeof gsap === 'object',
    gsap_globalTimeline_active: gsap?.globalTimeline?.isActive?.() ?? null,
    signal_intensity_var: signalIntensity?.trim() || null,
    quality_tier: window.__sfQualityTier ?? null
  };
})();
```

**Note:** The single-ticker rule cannot be perfectly proven from in-page JS alone (rogue rAFs hide in module closures). The performance trace from `performance_stop_trace` is the authoritative evidence — analyze the "Animation Frames" lane for non-GSAP requestAnimationFrame call sites. Document the trace artifact path in `vrf-03-motion-contract.md`.

**SIGNAL surface render checklist (per viewport):**

| Surface              | File                                               | Scroll position           | What must render                                                                |
| -------------------- | -------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------- |
| ENTRY (hero)         | `components/blocks/entry-section.tsx`              | 0vh                       | T1 pixel-sort signal (header), T4 // separator (VL-05 magenta on desktop), nav glyph |
| THESIS               | `components/blocks/thesis-section.tsx` + GhostLabel | ~100vh                    | T2 nav glyph (sticky), GhostLabel "//" wayfinding glyph (4% opacity Anton)      |
| SIGNAL               | `components/blocks/signal-section.tsx`             | ~200vh                    | Generative SignalMesh / GLSLHero canvas (T1 pixel-sort lineage)                 |
| PROOF                | `components/blocks/proof-section.tsx`              | ~300vh                    | Scroll-driven FRAME content + T2 nav glyph                                      |
| INVENTORY            | `components/blocks/inventory-section.tsx`          | ~400vh                    | T3 cube-tile box (`--sfx-cube-hue` slot)                                        |
| ACQUISITION          | `components/blocks/acquisition-section.tsx`        | ~500vh                    | FRAME content + T4 // separator                                                 |

**`prefers-reduced-motion: reduce` verification:**

After step 10 (`emulate` with `cssMediaFeatures: [{name:"prefers-reduced-motion",value:"reduce"}]`), re-execute steps 4–8 and assert:

- GSAP `globalTimeline.isActive()` returns `false` for ScrollTrigger-derived motion (verify via `evaluate_script`).
- Pixel-sort, idle grain, mesh gradient, particle field, glitch transition all visually collapsed.
- Static-state captures (snapshot stills) for each surface.

**Evidence artifact format:** `vrf-03-motion-contract.md` — leanest verifiable form is structured MD checklist + grep-evidence. Do NOT commit screenshot stills to git (gitignored `.png` per project rule). Optionally record the performance trace JSON; if so, gitignore it and reference path in `vrf-03-motion-contract.md`. Bullet pattern from `60-AES03-COHORT.md` is the proven template.

### Pattern 4: VRF-04 — synthesis-doc skeleton

**What:** `MID-MILESTONE-CHECKPOINT.md` is a synthesis layer. Reads JSON from VRF-01 (3 profiles) + Phase 60 D-07 (`phase-60-realdevice-checkpoint.md`) + LHCI medians from Phase 58/60/61. Renders a per-device row × LCP/CLS/TTI/FCP medians table; flags real-vs-synthetic divergence.

**Skeleton:**

```markdown
---
phase: 62-real-device-verification-final-gate
plan: 01
gate: VRF-04 (Pitfall #10 anchor)
captured: YYYY-MM-DD
status: [PASS|FAIL|HUMAN-NEEDED]
---

# v1.8 Mid-Milestone Real-Device Checkpoint

> Synthesis of VRF-01 multi-device WPT JSON + Phase 60 D-07 mini-check
> + Phase 58/60/61 synthetic LHCI history. Catches the
> mobile-emulation-pass / real-device-fail divergence early per Pitfall #10.

## §1 Real-Device Median (VRF-01 source)

| Profile             | First-View LCP | First-View CLS | First-View TTI | First-View FCP | Repeat-View LCP | Source JSON                          |
|---------------------|----------------|----------------|----------------|----------------|-----------------|--------------------------------------|
| iPhone 13/14 Safari |     ms         |                |     ms         |     ms         |     ms          | `vrf-01-ios-iphone13.json`           |
| Galaxy A14 Chrome   |     ms         |                |     ms         |     ms         |     ms          | `vrf-01-android-a14.json`            |
| Mid-tier Android    |     ms         |                |     ms         |     ms         |     ms          | `vrf-01-android-midtier.json`        |
| iPhone 13 D-07 ref  |     ms         |                |     ms         |     ms         |     ms          | `phase-60-realdevice-checkpoint.md`  |

**Threshold:** All 3 profiles MUST show median first-view LCP <1.0s AND CLS ≤0.005 (Path A floor per Phase 60).

## §2 Synthetic-vs-Real Divergence

| Metric | Synthetic (Phase 60 LHCI median) | Real (VRF-01 median across 3 profiles) | Real ÷ Synthetic | Pitfall #10 trigger? |
|--------|----------------------------------|----------------------------------------|------------------|-----------------------|
| LCP    | 810ms (`phase-60-mobile-lhci.json`) |      ms                              |      ×           | TRIGGER if real ÷ synthetic > 1.3 |
| CLS    | 0.002505                         |                                        |                  | TRIGGER if real CLS > 0.01        |
| TTI    | (Phase 58 LHCI)                  |      ms                              |      ×           | TRIGGER if real ÷ synthetic > 1.5 |

## §3 Cross-Viewport LCP Element Identity

Confirms Phase 57 cross-viewport LCP element divergence (mobile=GhostLabel; desktop=VL-05 //) survives on real devices. Pulls each profile's `largestContentfulPaint.element` selector from the WPT JSON `runs` array.

## §4 Sign-off

- [ ] **PASS** — all 3 profiles meet thresholds; no Pitfall #10 trigger; Plan 02 (VRF-02 + VRF-03) unblocked.
- [ ] **FAIL** — escalate as Phase 62.1 OR Phase 60.1 (regressor-localized). Document divergence below.

**Signed-off-by:** _(Claude / human)_
**Date:** YYYY-MM-DD
```

**Real-vs-synthetic divergence threshold (auto-resolution per `--auto`):**

- LCP: real ÷ synthetic > 1.3 → trigger Pitfall #10 escalation (real LCP >1050ms when synthetic =810ms means a real-device blocker that synthetic missed).
- CLS: real CLS >0.01 → trigger (Path A floor is 0.005; 2× = trigger).
- TTI: real ÷ synthetic > 1.5 → trigger (TTI is highly mobile-CPU-sensitive; 1.5× tolerance).

These thresholds align with `feedback_audit_before_planning.md` (proportional, not absolute) and Phase 60 Path A's 0.005 CLS floor.

### Pattern 5: VRF-02 output JSON shape

```json
{
  "capturedAt": "2026-04-XXTHH:MM:SSZ",
  "tool": "scripts/launch-gate-vrf02.ts",
  "url": "https://signalframeux.vercel.app/",
  "runs": 5,
  "per_run": [
    {"performance":100,"accessibility":100,"best-practices":100,"seo":100,"lcp_ms":823,"cls":0,"tti_ms":1404},
    {"performance":100,"accessibility":100,"best-practices":100,"seo":100,"lcp_ms":807,"cls":0,"tti_ms":1389},
    {"performance":100,"accessibility":100,"best-practices":100,"seo":100,"lcp_ms":815,"cls":0,"tti_ms":1396},
    {"performance":100,"accessibility":100,"best-practices":100,"seo":100,"lcp_ms":810,"cls":0,"tti_ms":1392},
    {"performance":100,"accessibility":100,"best-practices":100,"seo":100,"lcp_ms":818,"cls":0,"tti_ms":1400}
  ],
  "median": {
    "performance":100,"accessibility":100,"best-practices":100,"seo":100,
    "lcp_ms":815,"cls":0,"tti_ms":1396
  },
  "thresholds": {
    "category_min": 100,
    "lcp_ms_max": 1000,
    "cls_max": 0,
    "tti_ms_max": 1500
  },
  "verdict": "PASS"
}
```

### Pattern 6: VRF-05 RUM aggregator architecture

**Pipeline:** `vercel logs` → JSON Lines → filter `type:"rum"` → group by metric name (`LCP`, `CLS`, `INP`, `TTFB`) → percentile compute → write JSON.

**Invocation (shell wrapper, called BY `scripts/v1.8-rum-aggregate.ts` via `execFile` not `exec`):**

```bash
# Vercel CLI 50.43.0 verified flags:
#   --json (JSON Lines output)
#   --since 24h (relative format supported)
#   --environment production (filter to prod deploys only)
#   --query "rum"          (filter by message content; "rum" matches the type:"rum" stamp emitted by app/api/vitals/route.ts:81)
#   --limit N             (default 100; --limit 0 for unlimited per docs)
#   --no-follow           (don't stream live; one-shot pull)
#   --project signalframeux (defaults to linked project — already linked per repo state)
vercel logs --json --since 24h --environment production --query "rum" --limit 0 --no-follow > /tmp/rum-24h.jsonl
```

**Vercel log envelope shape (per logalert.app docs + verified at runtime):**

```jsonc
{
  "id": "log-id",
  "timestamp": 1745779200000,           // ms epoch
  "source": "lambda",                   // "build" | "static" | "external" | "lambda"
  "deploymentId": "dpl_xxx",
  "projectId": "prj_xxx",
  "requestId": "req_xxx",
  "statusCode": 200,
  "host": "signalframeux.vercel.app",
  "path": "/api/vitals",
  "message": "{\"type\":\"rum\",\"name\":\"LCP\",\"value\":850,\"id\":\"v3-...\",\"rating\":\"good\",\"navigationType\":\"navigate\",\"url\":\"https://signalframeux.vercel.app/\",\"timestamp\":1745779200000}",
  "proxy": {
    "method":"POST",
    "scheme":"https",
    "host":"signalframeux.vercel.app",
    "path":"/api/vitals",
    "userAgent":"Mozilla/5.0 (iPhone; ...)",
    "statusCode":200,
    "clientIp":"a.b.c.d",
    "region":"iad1",
    "cacheId":"-"
  }
}
```

The web-vitals payload is JSON-stringified inside `message`. The aggregator must `JSON.parse(envelope.message)` for each line, then filter `inner.type === "rum"`.

**Aggregator (`scripts/v1.8-rum-aggregate.ts`) architecture — read-only sketch (final code uses `execFile`, NOT `exec`/`execSync`, for command safety):**

```typescript
#!/usr/bin/env tsx
/**
 * scripts/v1.8-rum-aggregate.ts — Phase 62 VRF-05 RUM aggregator.
 *
 * Reads vercel logs --json, filters /api/vitals POST entries, computes
 * per-metric percentiles, writes vrf-05-rum-p75-lcp.json. Zero new
 * runtime dep; devDep tooling only.
 *
 * Command-spawn discipline: uses node:child_process.execFile (NOT exec)
 * to avoid shell-injection risk on env-var inputs. SINCE / PROJECT envs
 * are validated against /^[a-z0-9-]+$/ before being passed as argv elements.
 */
import { writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";  // execFile, NOT exec

interface VercelLogLine {
  timestamp: number;
  path: string;
  message: string;
  proxy?: { userAgent?: string; region?: string };
}
interface RumPayload {
  type: "rum";
  name: "LCP" | "CLS" | "INP" | "TTFB" | "FCP";
  value: number;
  id: string;
  rating: "good" | "needs-improvement" | "poor";
  navigationType: string;
  url: string;
  timestamp: number;
}

// Validate inputs to defeat shell-injection even though execFile sidesteps shell parsing.
const SINCE = process.env.SINCE && /^[0-9]+(s|m|h|d)$/.test(process.env.SINCE) ? process.env.SINCE : "24h";

// 1. Pull — execFile (no shell), each flag passed as a discrete argv element.
const raw = execFileSync(
  "vercel",
  ["logs", "--json", "--since", SINCE, "--environment", "production",
   "--query", "rum", "--limit", "0", "--no-follow"],
  { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 }
);

// 2. Parse JSON Lines
const envelopes: VercelLogLine[] = raw.trim().split("\n").filter(Boolean).map(line => JSON.parse(line));

// 3. Inner-payload filter
const samples: RumPayload[] = envelopes
  .filter(e => e.path === "/api/vitals")
  .map(e => { try { return JSON.parse(e.message); } catch { return null; } })
  .filter((p): p is RumPayload => p?.type === "rum");

// 4. Per-metric percentile compute
function percentile(arr: number[], p: number): number | null {
  if (arr.length === 0) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

// 5. Viewport bucketing (UA heuristic via proxy.userAgent — not perfect, documented limitation)
//    Mobile = userAgent contains "Mobile" / "iPhone" / "Android.*Mobile"
//    Desktop = otherwise

const lcp = samples.filter(s => s.name === "LCP").map(s => s.value);

// 6. Write
const out = {
  capturedAt: new Date().toISOString(),
  window_start: samples.length ? new Date(Math.min(...samples.map(s => s.timestamp))).toISOString() : null,
  window_end: samples.length ? new Date(Math.max(...samples.map(s => s.timestamp))).toISOString() : null,
  sample_count: samples.length,
  sample_count_lcp: lcp.length,
  by_metric: {
    LCP: { p50: percentile(lcp, 50), p75: percentile(lcp, 75), p99: percentile(lcp, 99), count: lcp.length }
    // CLS, INP, TTFB, FCP same shape
  },
  by_viewport: {
    mobile: { /* same shape, samples filtered by UA */ },
    desktop: { /* same shape */ }
  },
  thresholds: {
    p75_lcp_ms_max: 1000,
    sample_count_min: 100
  },
  sample_source: samples.length >= 100 ? "natural" : "synthetic-seeded",
  verdict: lcp.length >= 100 && (percentile(lcp, 75) ?? Infinity) < 1000 ? "PASS" : "FAIL_OR_INSUFFICIENT"
};
writeFileSync(".planning/perf-baselines/v1.8/vrf-05-rum-p75-lcp.json", JSON.stringify(out, null, 2));
```

**Estimated runtime:** ~30s for 24h log volume on Pro plan; under 5s on free tier (capped retention). `vercel logs --limit 0` may stream large outputs; the 256MB `maxBuffer` accommodates 24h on a moderately-trafficked deploy.

**Synthetic-seeding fallback (if `sample_count < 100`):**

```typescript
// Plan 03 fallback when natural traffic is sparse:
// Run chrome-devtools MCP from 3 device profiles × 5 routes × 7 navigations = 105 RUM beacons.
// Document in vrf-05-rum-p75-lcp.json: "sample_source": "synthetic-seeded".
// Acceptable per CONTEXT.md line 213; the threshold language is preserved (p75 LCP <1.0s)
// but the sampling source is explicit.
```

### Pattern 7: AES-04 read-only re-run (D-11)

**What:** `tests/v1.8-phase58-pixel-diff.spec.ts` (verified MAX_DIFF_RATIO=0.005 at line 34) re-run against current prod build, no `--update-snapshots`. Output collected into `vrf-aes04-final.json`.

**Invocation:**

```bash
rm -rf .next/cache .next                                 # BND-04 stale-chunk guard (mandatory)
pnpm build && pnpm start &                                # Production build, NOT pnpm dev
SERVER_PID=$!
# Wait for port 3000 ready
until curl -sf http://localhost:3000/ > /dev/null; do sleep 1; done

CI=true pnpm exec playwright test \
  tests/v1.8-phase58-pixel-diff.spec.ts \
  --project=chromium \
  --reporter=json 2>&1 | tee /tmp/vrf-aes04-final.json

kill $SERVER_PID
```

**Output JSON shape (Playwright `--reporter=json` standard, post-processed):**

```json
{
  "capturedAt": "2026-04-XXTHH:MM:SSZ",
  "spec": "tests/v1.8-phase58-pixel-diff.spec.ts",
  "baseline_dir": ".planning/visual-baselines/v1.8-start/",
  "max_diff_ratio": 0.005,
  "total_surfaces": 20,
  "passed": 20,
  "failed": 0,
  "per_surface": [
    {"route":"/","viewport":"desktop-1440x900","diff_ratio":0.00343,"verdict":"PASS"},
    {"route":"/","viewport":"iphone13-390x844","diff_ratio":0.00031,"verdict":"PASS"}
  ],
  "verdict": "PASS"
}
```

### Anti-Patterns to Avoid

- **Running launch-gate.ts directly and computing median externally** — Phase 58 CIB-04 Playwright SHA-identity guard catches modifications. Plan 02 must ship a wrapper, not modify.
- **Submitting WPT tests sequentially with intermediate analysis** — burns rate-limit; batch all 3 profile submissions, capture testIds, retrieve later.
- **Committing the full `jsonResult.php` payload** — multi-MB; will inflate `.planning/`. Always prune with the jq recipe (Pattern 1).
- **Running AES-04 against `pnpm dev`** — Pitfall B: dev-mode HMR overlay + React double-render inflate captured PNGs. Spec already gates `nextjs-portal` count === 0 (verified line 67 of pixel-diff spec) but the build-then-serve discipline is mandatory.
- **Using `child_process.exec` / `execSync` with shell strings in any new script** — repo policy mandates `execFile` / `execFileSync` (no shell parsing) for command spawning. SAFE: argv array. UNSAFE: shell-string interpolation.
- **Treating real-device LCP element drift as a regressor** — if mobile real-device LCP becomes a different element than `v1.8-lcp-candidates.json` predicts (GhostLabel for mobile-360+iphone13), document but don't escalate immediately; cross-check Pitfall #9 (ScaleCanvas transform-scaled LCP misdetection on mobile).
- **Assuming the 24h RUM window starts at Plan 03 START** — it starts at Plan 02's last commit's prod deploy timestamp (the "post-deploy" anchor). Plan 03 may need to wait if Plan 02 ships <24h before Plan 03 wants to aggregate.
- **Modifying STATE.md or ROADMAP.md mid-plan** — orchestrator-only operation per `feedback_pde_milestone_complete_help_arg.md`; Plan 03 surfaces Phase 60 ratification text in `60-SUMMARY.md` updates, not state files.

## Don't Hand-Roll

| Problem                                              | Don't Build                                       | Use Instead                                                                                    | Why                                                                                                                                       |
| ---------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Real-device perf measurement                         | Custom Selenium farm                              | WebPageTest free tier (D-03)                                                                   | Free tier provides reliable real-device LTE testing; in v1.7-PRF precedent and project memory                                             |
| Lighthouse 100/100 verification at prod              | Custom puppeteer + lighthouse loop               | `scripts/launch-gate.ts` (existing) + thin wrapper for 5-run median                            | Already proven; CIB-04 byte-identity contract; wrapper is minimal                                                                         |
| Field RUM aggregation                                | Custom log forwarder + datastore                  | `vercel logs --json --since 24h --query rum`                                                   | Native Vercel surface; zero new dep; Phase 58 pipeline already shipping rum to console.log (verified app/api/vitals/route.ts:81)         |
| Pixel-diff harness                                   | Re-write Playwright + pixelmatch                  | `tests/v1.8-phase58-pixel-diff.spec.ts` (existing, verified MAX_DIFF_RATIO=0.005)              | Already at AES-04 standing rule; D-11 reuses                                                                                              |
| Motion-contract verification                         | Custom Playwright `page.evaluate(rAF count)`     | chrome-devtools MCP `performance_start_trace` + Animation Frames lane analysis                | MCP gives access to real Chrome DevTools profiling; rAF detection from in-page JS misses module-closure rAF call sites                    |
| Synthetic-vs-real divergence detection               | Heuristic ML or "feels different" subjective gate | Numeric ratio thresholds (LCP 1.3×, CLS 2×, TTI 1.5×) per Pattern 4                            | Pitfall #10 prevention discipline: catch divergence quantitatively before it becomes a milestone-end refactor crisis                      |

**Key insight:** Phase 62 has near-zero novel implementation surface. Every mechanism (lighthouse, vercel logs, playwright pixel-diff, chrome-devtools MCP, WPT free tier) is already proven in prior phases. Plan complexity is in the **synthesis** layer — VRF-04 cross-references 4 data sources, VRF-05 aggregates and percentile-buckets, FINAL-GATE.md cross-references all 5 VRFs.

## Common Pitfalls

### Pitfall 1: launch-gate.ts is RUNS=3 worst-of, not RUNS=5 median (D-05 mismatch)

**What goes wrong:** Plan 02 author reads CONTEXT D-05 "5 sequential runs… median computed across all 5", then runs `pnpm tsx scripts/launch-gate.ts` directly, getting 3 runs worst-of and a `.planning/phases/35-performance-launch-gate/launch-gate-{ts}.json` output (verified scripts/launch-gate.ts:31, 95).
**Why it happens:** launch-gate.ts header documents itself as the "Phase 35 LR-02 / PF-02 advisory" runner; the v1.7 PRF reused it; the 5-run / median contract is only in CONTEXT D-05 and the LHCI config, not the script itself.
**How to avoid:**
1. Plan 02 wave 0 acceptance criterion includes "diff scripts/launch-gate.ts == merge-base byte-identity" — Phase 58 CIB-04 contract.
2. Plan 02 ships `scripts/launch-gate-vrf02.ts` (wrapper, NOT modification).
3. Wrapper writes to `.planning/perf-baselines/v1.8/vrf-02-launch-gate-runs.json` (NOT `.planning/phases/35-performance-launch-gate/`).

**Warning signs:** Output JSON in `phases/35-*` directory; `RUNS = 3` in code; "worst" language anywhere in script.

### Pitfall 2: WPT free tier API key conflation with anonymous web

**What goes wrong:** Author tries to submit programmatically without `X-WPT-API-KEY`, hits 401 or rate-limit-exceeded; author then tries the anonymous browser-based form at https://www.webpagetest.org/, which works for ad-hoc tests but doesn't return JSON for programmatic capture.
**Why it happens:** WPT changed in 2023 — anonymous tests at the website still work, but the `runtest.php` POST endpoint requires `X-WPT-API-KEY`; free tier ("Starter") = 300 monthly tests with key.
**How to avoid:** Plan 01 wave 0 includes "User has WPT free Starter API key stored at `~/.wpt-api-key` (gitignored)". If user has no key, fall back to manual web-form submission + manual JSON download from each test's "API" tab.
**Warning signs:** `401 Unauthorized` from `runtest.php`; "API key required" in WPT response.

### Pitfall 3: Vercel free-tier log retention is too short for 24h window

**What goes wrong:** `vercel logs --since 24h` returns sparse data because Vercel free-tier retains runtime logs for 1h only; 24h window forces stitching multiple shorter pulls or upgrading plan.
**Why it happens:** Vercel free-tier ("Hobby") = 1h log retention; Pro = 3 days; Enterprise = unlimited. Phase 58 didn't surface this because telemetry was new.
**How to avoid:** Plan 03 wave 0 verifies project plan tier via `vercel inspect` or `vercel teams ls`. If free-tier, document the limitation in `vrf-05-rum-p75-lcp.json` notes field; either upgrade to Pro for the 24h window OR run multiple shorter pulls every ~50 min during the 24h period (cron-style stitching).
**Warning signs:** `vercel logs --since 24h` returns <100 lines; CLI output mentions retention truncation.

### Pitfall 4: SwiftShader headless ≠ real Metal/ANGLE

**What goes wrong:** Plan 02 motion-contract verification at headless localhost shows pass; real iOS Safari (Metal) or Android Chrome (ANGLE) renders SIGNAL surfaces differently — shader compile times, GPU memory caps, pillarbox behavior all diverge.
**Why it happens:** `playwright.config.ts:22-27` documents SwiftShader for headless WebGL; that's fine for AES-04 (intentional captured-state) but fails the VRF-03 motion contract real-device parity assumption.
**How to avoid:** D-06 explicitly chose chrome-devtools MCP against PROD URL (not localhost). Plan 02 wave 2 prod-URL discipline is non-negotiable; localhost MCP runs are sanity-only, not the gating evidence.
**Warning signs:** `vrf-03-motion-contract.md` references `localhost:3000` in any evidence path; missing `https://signalframeux.vercel.app` in MCP `navigate_page` calls.

### Pitfall 5: GhostLabel `content-visibility:auto` Anton swap residual CLS shows on real devices

**What goes wrong:** Phase 60 Path A accepted CLS=0.002505 on synthetic LHCI (loosened 0→0.005); on real iPhone 13 Safari at 200px clamp band, the Anton swap glyph-metric shift may be larger than synthetic emulation predicted. VRF-04 catches this via the synthetic-vs-real CLS divergence threshold.
**Why it happens:** Anton swap descriptors were measured at THESIS heading band (larger), not GhostLabel band (200px clamp floor); see `feedback_anton_swap_size_band.md`.
**How to avoid:** VRF-04 cross-references `phase-60-mobile-lhci.json` CLS=0.002505 vs each VRF-01 profile's median CLS. If real CLS >0.005 (above Path A floor) on any profile, escalate as Phase 62.1 (or surface to user as decision point).
**Warning signs:** Real-device CLS >0.005; mobile-tier Anton "feels different" in chrome-devtools MCP scroll-test.

### Pitfall 6: 24h window ambiguity — "post-deploy" anchor not specified

**What goes wrong:** Plan 03 starts aggregating immediately after Plan 02 SUMMARY.md commits, but the deploy hasn't propagated to prod (Vercel takes 1–5 min to propagate); the first ~5 min of "24h" data is from the previous deploy.
**Why it happens:** "post-deploy" in CONTEXT D-08 is ambiguous between "Plan 02's last commit" and "Vercel's deploy completion timestamp".
**How to avoid:** Plan 03 wave 0 defines `WINDOW_START` as "last successful Vercel deploy timestamp" (queryable via `vercel deployments list --json | jq '.[0].createdAt'`), not "git commit timestamp". Aggregator filters samples to `timestamp >= WINDOW_START`.
**Warning signs:** `vrf-05-rum-p75-lcp.json` window_start before the prod-deploy completion timestamp.

### Pitfall 7: Phase 60 SUMMARY ratification scope creep

**What goes wrong:** Plan 03 D-09 ratification grows from "verify SUMMARY.md reflects shipped state" into "re-validate every Phase 60 claim against shipped code" — burns hours.
**Why it happens:** `feedback_ratify_reality_bias.md` discipline (ratify reality, don't reflexively revert); applied too aggressively, becomes a re-audit.
**How to avoid:** Plan 03 D-09 ratification = read 60-01-SUMMARY.md + 60-02-SUMMARY.md, spot-check 3 specific claims (LCP=810ms median, MAX_DIFF_RATIO=0.005, autoResize:true preserved), update STATE.md Phase 60 row to "complete" — no deeper review.
**Warning signs:** Plan 03 ratification commit count >2; touches files outside `.planning/`.

### Pitfall 8: MILESTONE-SUMMARY.md vs `/pde:complete-milestone` workflow expectations mismatch

**What goes wrong:** Plan 03 writes `MILESTONE-SUMMARY.md` in `.planning/milestones/v1.8/`; `/pde:complete-milestone v1.8` workflow expects different filename or location and either fails or overwrites.
**Why it happens:** `feedback_milestone_workflow_keep_originals.md` documents "internal contradiction in complete-milestone workflow on ROADMAP/REQUIREMENTS deletion"; workflow archives are inconsistent across milestones.
**How to avoid:** Plan 03 wave-final inspects `~/.claude/pde-os/engines/gsd/.upstream-base/workflows/complete-milestone.md` for current expected file naming; v1.7 milestone archive shows pattern `.planning/milestones/v1.7-MILESTONE-AUDIT.md` (audit at root, not in subdirectory). v1.8 may follow either pattern; D-12's "MILESTONE-SUMMARY.md (or equivalent handoff doc) — drop into `.planning/milestones/v1.8/`" gives the planner discretion. Verify `.planning/milestones/v1.8/` is created before writing.
**Warning signs:** `complete-milestone` workflow output mentions "expected file not found" or overwrites Plan 03's MILESTONE-SUMMARY.md.

### Pitfall 9: HUMAN-UAT items leak into "blocked-on-user" — contradicts D-10 "does NOT block"

**What goes wrong:** Plan 03 surfaces Phase 58 HUMAN-UAT items as blockers; user rejects close-out because 2 GitHub repo-settings actions remain.
**Why it happens:** D-10 says "surface but do NOT block"; if the FINAL-GATE.md "deferred to user" section is structured as a checkbox gate, it reads as blocking.
**How to avoid:** FINAL-GATE.md structures HUMAN-UAT items as "## Deferred to User (Informational)" — not "## Blockers". Phase 58 HUMAN-UAT carries forward to v1.9 milestone discussion, not v1.8 close.
**Warning signs:** FINAL-GATE.md has unchecked checkbox gates referring to user-only actions; pde-verifier marks "human_needed" status.

### Pitfall 10: Plan 03 RUM aggregator runs with insufficient samples and reports synthetic-seeded as natural

**What goes wrong:** Plan 03 aggregator runs at hour 24, gets 47 natural samples (below 100 floor), runs synthetic seeding to top up to 105, but writes `sample_source: "natural"` instead of `"mixed"` — misleading.
**Why it happens:** CONTEXT line 213 specifies `"natural" | "synthetic-seeded" | "mixed"` but aggregator code may default to "natural" if any natural samples exist.
**How to avoid:** Aggregator's `sample_source` calculation: `"natural"` IFF `synthetic_count == 0`; `"synthetic-seeded"` IFF `natural_count == 0`; `"mixed"` otherwise. Document in `vrf-05-rum-p75-lcp.json` notes field which subset of samples were synthetic-seeded (timestamps + count).
**Warning signs:** Synthetic-seed run executed but `sample_source: "natural"` in JSON; sample_count_lcp jumps suspiciously near hour 23–24.

## Code Examples

### WPT API submission (Plan 01 — VRF-01)

```bash
# Source: WebPageTest API Reference (https://docs.webpagetest.org/api/reference/) verified 2026-04-27
WPT_API_KEY="$(cat ~/.wpt-api-key)"
PROD_URL="https://signalframeux.vercel.app/"
LABEL_PREFIX="v1.8-vrf-01"

# 3 profiles (D-02 verbatim) — verify exact slugs at https://www.webpagetest.org/getLocations.php?f=json
declare -A LOCATIONS=(
  ["ios-iphone13"]="Dulles_iPhone:iPhone-13-Safari.4G"
  ["android-a14"]="Dulles_MotoG:Galaxy-A14-Chrome.4G"
  ["android-midtier"]="Dulles_MotoG4:MotoG4-Chrome.4G"
)

for profile in "${!LOCATIONS[@]}"; do
  RESPONSE=$(curl -s -X POST "https://www.webpagetest.org/runtest.php" \
    -H "X-WPT-API-KEY: ${WPT_API_KEY}" \
    --data-urlencode "url=${PROD_URL}" \
    --data-urlencode "location=${LOCATIONS[$profile]}" \
    -d "runs=5" \
    -d "fvonly=0" \
    -d "f=json" \
    -d "label=${LABEL_PREFIX}-${profile}")
  TEST_ID=$(echo "$RESPONSE" | jq -r '.data.testId')
  echo "$profile: $TEST_ID" >> /tmp/wpt-test-ids.txt
done
# Wait 15 min for all 3 to complete, then retrieve
```

### chrome-devtools MCP scroll-test scaffold (Plan 02 — VRF-03)

```text
# Source: chrome-devtools MCP plugin tool reference (used in Phase 35 + Phase 60 prior art)
# Per-viewport sequence — Plan 02 wave 2

# 1. Boot fresh page + emulate viewport
mcp__plugin_chrome-devtools-mcp__chrome-devtools__new_page
mcp__plugin_chrome-devtools-mcp__chrome-devtools__navigate_page → https://signalframeux.vercel.app/
mcp__plugin_chrome-devtools-mcp__chrome-devtools__resize_page → mobile-360 / desktop-1440

# 2. Begin trace
mcp__plugin_chrome-devtools-mcp__chrome-devtools__performance_start_trace

# 3. Probe ticker + signal-intensity at 0vh
mcp__plugin_chrome-devtools-mcp__chrome-devtools__evaluate_script →
  (() => ({
    gsap_present: typeof window.gsap === 'object',
    gsap_globalTimeline_active: window.gsap?.globalTimeline?.isActive?.() ?? null,
    signal_intensity_var: getComputedStyle(document.documentElement).getPropertyValue('--sfx-signal-intensity').trim(),
    quality_tier: window.__sfQualityTier ?? null
  }))()

# 4. Scroll progressively + take_snapshot at each surface stop
mcp__plugin_chrome-devtools-mcp__chrome-devtools__scroll → y=window.innerHeight*1   # THESIS
mcp__plugin_chrome-devtools-mcp__chrome-devtools__take_snapshot
mcp__plugin_chrome-devtools-mcp__chrome-devtools__scroll → y=window.innerHeight*2   # SIGNAL
mcp__plugin_chrome-devtools-mcp__chrome-devtools__take_snapshot
# … PROOF, INVENTORY, ACQUISITION

# 5. Console
mcp__plugin_chrome-devtools-mcp__chrome-devtools__list_console_messages → assert no "error" level

# 6. Stop trace + analyze rAF lane
mcp__plugin_chrome-devtools-mcp__chrome-devtools__performance_stop_trace
mcp__plugin_chrome-devtools-mcp__chrome-devtools__performance_analyze_insight → "Animation Frames"
# → expect: GSAP ticker as the sole rAF source; flag any other rAF call site

# 7. Reduced-motion path
mcp__plugin_chrome-devtools-mcp__chrome-devtools__emulate →
  cssMediaFeatures: [{ name: "prefers-reduced-motion", value: "reduce" }]
mcp__plugin_chrome-devtools-mcp__chrome-devtools__navigate_page → https://signalframeux.vercel.app/  # reload
# Repeat steps 4 + 6
# Assert SIGNAL surfaces visually static; GSAP globalTimeline collapsed
```

## State of the Art

| Old Approach (v1.7-PRF era)                                                            | Current Approach (v1.8 Phase 62)                                                                       | When Changed | Impact                                                                 |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------ | ---------------------------------------------------------------------- |
| Single-device manual WPT (PRF-01 era)                                                  | 3-device matrix automated batch via WPT API (D-02)                                                     | v1.8         | Pitfall #10 prevention discipline                                      |
| `scripts/launch-gate.ts` 3-run worst-of                                                | Plan 02 wrapper `scripts/launch-gate-vrf02.ts` 5-run median (CIB-04 byte-identity preserved)           | v1.8 Phase 62| 5-run median is statistically meaningful; worst-of is over-strict      |
| No field RUM (synthetic-only verification)                                             | `useReportWebVitals` → `/api/vitals` → `console.log` → `vercel logs --json` (Phase 58 → Phase 62)      | v1.8 Phase 58| Field truth replaces synthetic guesswork; zero new runtime dep         |
| Pixel-diff at strict 0% (Phase 61 attempt)                                             | AES-04 standing 0.5% (`MAX_DIFF_RATIO = 0.005`)                                                        | v1.8 Phase 61| Renderer non-determinism makes strict 0% non-falsifiable; 0.5% is human-perception threshold |
| Manual milestone close (v1.0–v1.7)                                                    | `/pde:complete-milestone v1.8` via Plan 03 D-12 artifact set                                           | v1.8 Phase 62| Workflow-driven archive; reproducible across milestones                 |

**Deprecated / outdated:**

- `worst-of-3` Lighthouse aggregation — replaced by median-of-5 across LHCI + launch-gate-vrf02 wrapper.
- Single-device PRF-04 launch gate (v1.7) — replaced by 3-device VRF-01 + synthetic VRF-02 + RUM VRF-05 stack.
- Strict-0% pixel-diff — replaced by AES-04 standing 0.5% (calibration confirmed Phase 61).

## Open Questions

1. **Is `signalframeux.vercel.app` the correct prod URL?**
   - What we know: `scripts/launch-gate.ts:10` documents this as the example; `.lighthouseci/links.json` shows `localhost:3000` for the most recent LHCI run (dev artifact); `app/api/vitals/route.ts:80` references "Vercel runtime log" but doesn't hardcode hostname.
   - What's unclear: `cultedivision.com` or another custom domain may front the Vercel deploy; project-level `.vercel/project.json` may have the linked project name.
   - Recommendation: Plan 01 wave 0 verifies `vercel inspect` output; if deploy URL differs from `signalframeux.vercel.app`, all 5 VRF artifacts use the verified URL. Default assumption: `signalframeux.vercel.app` per script header; user override accepted.

2. **WPT free-tier exact location slug for "Galaxy A14"?**
   - What we know: WPT supports MotoG4 (real device, "Dulles_MotoG4"), iPhones (various, "Dulles_iPhone:iPhone-XX-Safari"), and emulated Android.
   - What's unclear: Whether Galaxy A14 specifically is on the free-tier real-device location list; if not, "mid-tier Android Chrome with 4× CPU + Slow 4G throttle" emulation is the closest free-tier proxy.
   - Recommendation: Plan 01 wave 0 hits `https://www.webpagetest.org/getLocations.php?f=json` to enumerate current real-device locations; if Galaxy A14 unavailable, document fallback to "Dulles_MotoG4:MotoG4-Chrome.4G" with a footnote in `vrf-01-android-a14.json`. D-03 (BrowserStack fallback) covers the alternative path.

3. **Vercel project plan tier (Hobby vs Pro) for 24h log retention?**
   - What we know: Vercel free tier ("Hobby") = 1h log retention; Pro = 3 days; project repo doesn't disclose the tier.
   - What's unclear: Whether SignalframeUX is on Hobby or Pro; if Hobby, the 24h RUM window requires log stitching every ~50 min OR upgrade.
   - Recommendation: Plan 03 wave 0 verifies via `vercel teams ls` + `vercel inspect`; if Hobby, document in `vrf-05-rum-p75-lcp.json` `notes` field that the 24h window was reconstructed from N stitched <1h pulls; if Pro, single pull.

4. **Synthetic RUM seeding — is fallback acceptable per --auto?**
   - What we know: CONTEXT line 213 explicitly authorizes synthetic-seeded as an acceptable `sample_source` if natural traffic <100.
   - What's unclear: Whether Plan 03 should run synthetic seeding pre-emptively (wave 1) or wait until wave 3 to discover natural traffic insufficient.
   - Recommendation: Wave 1 runs natural-only aggregation; if `sample_count_lcp < 100`, wave 2 fires synthetic seeding (chrome-devtools MCP × 3 device profiles × 5 routes × 7 navigations = 105 beacons); wave 3 re-aggregates with `sample_source: "mixed"`. Auto-resolved per `--auto`.

5. **HUMAN-UAT items in FINAL-GATE.md — block or surface?**
   - What we know: D-10 says "surface but does NOT block".
   - What's unclear: Whether `pde-verifier` interprets "## Deferred to User" sections as blockers.
   - Recommendation: Test `pde-verifier` against Phase 61 close-out (which surfaced 3 HUMAN-UAT items and CLOSED); if Phase 61 set the precedent for non-blocking surfacing, follow that pattern. Mirrored from `61-HUMAN-UAT.md` discipline.

## Validation Architecture

> Phase 62 is read-only verification — most "tasks" produce JSON/MD artifacts, not code. The validation surface for the planner is per-VRF: existence check + JSON schema check + numeric threshold check.
> `workflow.nyquist_validation` is not explicitly false in `.planning/config.json` (verified 2026-04-27); validation architecture included.

### Test Framework

| Property                  | Value                                                                                  |
| ------------------------- | -------------------------------------------------------------------------------------- |
| Framework (pixel-diff)    | Playwright @playwright/test (devDep, existing) — `tests/v1.8-phase58-pixel-diff.spec.ts` |
| Framework (gates)         | jq + grep + node JSON schema check (no new framework)                                  |
| Config file               | `playwright.config.ts` (existing); spec at `MAX_DIFF_RATIO = 0.005` (verified line 34) |
| Quick-run command (D-11)  | `CI=true pnpm exec playwright test tests/v1.8-phase58-pixel-diff.spec.ts --project=chromium --reporter=json` |
| Full suite command        | (Phase 62 doesn't run "full suite" — each VRF has its own gate; FINAL-GATE.md aggregates) |
| Phase gate                | `62-FINAL-GATE.md` — synthesis of 5 VRFs + AES-04 + Phase 60 SUMMARY ratification + 58 HUMAN-UAT cross-check |

### Phase Requirements → Validation Map

| Req ID | Behavior                                          | Validation Type    | Automated Command                                                                                                                                                                | File Exists?    |
| ------ | ------------------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| VRF-01 | 3 device JSON artifacts ≤50KB each, LCP <1.0s     | grep + jq schema   | `for p in ios-iphone13 android-a14 android-midtier; do jq '.median.firstView.LCP < 1000 and .median.firstView.CLS <= 0.005' .planning/perf-baselines/v1.8/vrf-01-${p}.json; done` | ❌ Plan 01      |
| VRF-02 | 5-run median 100/100 + LCP/CLS/TTI thresholds     | jq schema + script | `pnpm tsx scripts/launch-gate-vrf02.ts --url $PROD_URL && jq '.verdict == "PASS"' .planning/perf-baselines/v1.8/vrf-02-launch-gate-runs.json`                                  | ❌ Plan 02 wrapper script |
| VRF-03 | Motion contract MD checklist all green            | grep evidence      | `grep -E "PASS|✓" .planning/perf-baselines/v1.8/vrf-03-motion-contract.md \| wc -l` ≥ 6 (per SIGNAL surface)                                                                  | ❌ Plan 02      |
| VRF-04 | Synthesis MD with sign-off line + threshold table | grep evidence      | `grep "**PASS**" .planning/perf-baselines/v1.8/MID-MILESTONE-CHECKPOINT.md` AND `jq` cross-check vs VRF-01 medians                                                              | ❌ Plan 01      |
| VRF-05 | RUM JSON p75 <1.0s + sample_count ≥100            | jq schema          | `jq '.verdict == "PASS" and .sample_count >= 100 and .by_metric.LCP.p75 < 1000' .planning/perf-baselines/v1.8/vrf-05-rum-p75-lcp.json`                                          | ❌ Plan 03      |
| AES-04 | 20 surfaces ≤0.5% pixel-diff (read-only)          | Playwright spec    | `CI=true pnpm exec playwright test tests/v1.8-phase58-pixel-diff.spec.ts` (exit 0 = pass)                                                                                       | ✅ Spec exists  |

### Sampling Rate

- **Per task commit:** Run the task's specific gate command (e.g., Plan 01 task 1 commit → `jq` validate just-written `vrf-01-ios-iphone13.json`).
- **Per wave merge:** Run all task gates for the wave + grep `WARN/FAIL` in any artifact.
- **Phase gate:** Full FINAL-GATE.md synthesis must show all 5 VRFs PASS + AES-04 PASS + Phase 60 SUMMARY ratified + Phase 58 HUMAN-UAT surfaced (not blocking) before `/pde:verify-work`.

### Wave 0 Gaps (per plan)

#### Plan 01 (VRF-01 + VRF-04)

- [ ] `~/.wpt-api-key` exists (user-side check; no automated step — Plan 01 wave 0 prompts user if missing).
- [ ] `https://www.webpagetest.org/getLocations.php?f=json` enumerates location slugs available on free-tier (Plan 01 wave 0 captures + commits to `vrf-01-locations-snapshot.json` for audit).
- [ ] `scripts/v1.8-wpt-submit.ts` (optional batch-submit script) — Claude's discretion; bash one-liner with curl is sufficient.

#### Plan 02 (VRF-02 + VRF-03)

- [ ] `scripts/launch-gate-vrf02.ts` does NOT exist; Plan 02 wave 0 creates it as a 5-run median wrapper.
- [ ] CIB-04 byte-identity check: `git diff --name-only HEAD scripts/launch-gate.ts` returns empty (Plan 02 must NOT modify).
- [ ] Verified prod URL (`vercel inspect` or `vercel deployments list --json`).

#### Plan 03 (VRF-05 + AES-04 + ratification + close-out)

- [ ] `scripts/v1.8-rum-aggregate.ts` does NOT exist; Plan 03 wave 0 creates it.
- [ ] Vercel plan tier verified (`vercel teams ls` + `vercel inspect`).
- [ ] `.planning/milestones/v1.8/` directory does NOT exist (verified 2026-04-27); Plan 03 final commit creates it for `MILESTONE-SUMMARY.md`.
- [ ] AES-04 baseline dir exists at `.planning/visual-baselines/v1.8-start/` (verified 2026-04-27, 20 PNGs present).

## Sources

### Primary (HIGH confidence)

- `.planning/phases/62-real-device-verification-final-gate/62-CONTEXT.md` — 12 locked decisions D-01..D-12.
- `.planning/REQUIREMENTS.md` lines 46–50 — VRF-01..05 verbatim text.
- `.planning/STATE.md` — v1.8 milestone constraints + Phase 60/61 close state.
- `.planning/ROADMAP.md` lines 951–961 — Phase 62 success criteria 1–5 verbatim.
- `.planning/codebase/AESTHETIC-OF-RECORD.md` — AES-04 standing rule (MAX_DIFF_RATIO 0.005).
- `.planning/codebase/v1.8-lcp-diagnosis.md` — Phase 57 cross-viewport LCP element identity.
- `.planning/research/PITFALLS.md` Pitfall #10 (mid-milestone real-device discipline), Pitfall #5 (single-ticker), Pitfall #15 (aesthetic drift).
- `.planning/perf-baselines/v1.8/phase-60-realdevice-checkpoint.md` — Phase 60 D-07 single-device WPT methodology.
- `.planning/perf-baselines/v1.8/phase-60-mobile-lhci.json` — Phase 60 LHCI median (LCP=810ms, CLS=0.002505).
- `scripts/launch-gate.ts` line 31, 95 — `RUNS = 3`, output path hardcoded.
- `app/_components/web-vitals.tsx` lines 27–66 — useReportWebVitals → sendBeacon.
- `app/api/vitals/route.ts` line 81 — `console.log(JSON.stringify({type:"rum",...}))` — VRF-05 source.
- `tests/v1.8-phase58-pixel-diff.spec.ts` line 34 — `MAX_DIFF_RATIO = 0.005` — D-11 reuse.
- `playwright.config.ts:22-27` — SwiftShader caveat.
- `.lighthouseci/lighthouserc.json` — Phase 58 LHCI median-of-5 reference config.
- `.planning/phases/61-bundle-hygiene/61-03-FINAL-GATE.md` — D-12 final-gate template + AES-04 calibration history.
- `.planning/phases/60-lcp-element-repositioning/60-AES03-COHORT.md` — chrome-devtools MCP scroll-test sign-off pattern (D-08 prior art).
- `.planning/PROJECT.md` line 93 — CIB-04 byte-identity contract.

### Secondary (MEDIUM confidence)

- WebPageTest API Reference (https://docs.webpagetest.org/api/reference/) — runtest.php + jsonResult.php endpoints, JSON shape, location format.
- WebPageTest free-tier limits: 300 monthly tests (verified via TrustRadius pricing 2026); requires `X-WPT-API-KEY`.
- Vercel CLI 50.43.0 `vercel logs --help` (verified 2026-04-27 from local install).
- logalert.app Vercel log envelope schema docs — id, timestamp, source, deploymentId, projectId, requestId, statusCode, host, path, message, proxy{}.

### Tertiary (LOW confidence — flagged for validation)

- WPT location slug `Dulles_iPhone:iPhone-13-Safari.4G` — exact slug must be verified via `https://www.webpagetest.org/getLocations.php?f=json` on measurement day; iPhone 13 specifically may not be a real-device free-tier location (forum thread 11049 mentions iPhone 5c/6 in older context).
- Galaxy A14 free-tier availability — likely emulated only on free tier; real-device fallback is Moto G4.
- Vercel project plan tier — undocumented in repo; must be verified at Plan 03 wave 0.
- `chrome-devtools` MCP exact tool names — derived from prior phase usage (Phase 35, Phase 60); current tool surface should be verified by Plan 02 wave 0 calling the actual tools.

## Metadata

**Confidence breakdown:**

- **Standard stack:** HIGH — every tool exists in repo or globally installed; `vercel` CLI version verified.
- **Architecture (file layout):** HIGH — follows `.planning/perf-baselines/v1.8/` pattern from Phase 60.
- **WPT execution detail (location slugs):** MEDIUM — exact slugs verified via `getLocations.php` at execution time; fallbacks documented.
- **launch-gate wrapper architecture:** HIGH — pattern verified; CIB-04 byte-identity respected.
- **chrome-devtools MCP sequence:** MEDIUM — MCP tool surface inferred from prior-phase usage; tool names may have shifted in recent MCP plugin versions; Plan 02 wave 0 verifies.
- **Vercel logs aggregation:** HIGH for envelope shape (verified via logalert.app + native Vercel CLI); MEDIUM for plan-tier-dependent retention behavior.
- **Pitfalls:** HIGH — every pitfall sourced from project memory or shipped artifact.

**Research date:** 2026-04-27
**Valid until:** 2026-05-27 (30 days; stable verification phase, no fast-moving libraries; re-validate WPT free-tier limits if execution slips past this date).
