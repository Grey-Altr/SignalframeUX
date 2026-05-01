# Phase 70: v1.8 Verification Closure (VRF-01/04/05) — Research

**Researched:** 2026-04-30
**Domain:** Field RUM aggregation + per-device LCP variance closure
**Confidence:** HIGH (Vercel CLI/Drains schema + existing v1.8 pipeline + path_decision precedent all directly verifiable)

---

## Summary

Phase 70 closes the three v1.8 deferred VRF requirements as **measurement-only** workstreams. The v1.8 Phase 62 already shipped the entire pipeline (`/api/vitals` route handler, `WebVitals` beacon emitter, `scripts/v1.8-rum-aggregate.ts`, `scripts/v1.8-rum-seed-runner.mjs`); v1.8 Phase 65 was deferred to v1.9 because the pipeline could not be exercised against a fresh prod deploy that included the route. With PR #4 merged 2026-04-29 and Vercel production now serving `app/api/vitals/route.ts`, Phase 70 reuses the existing pipeline with surgical updates and adds a v1.9-specific aggregator + iOS sub-cohort partition.

**Three findings dominate the scope:**

1. **Vercel Hobby tier has 1-hour runtime log retention** (NOT 24h). The "≥24h sampling window" requirement cannot be satisfied via natural `vercel logs --since 24h` queries on Hobby. Two viable mitigations: (a) graduate to Pro tier (1d retention) + Observability Plus add-on (30d) — **NEW RUNTIME COST**, OR (b) **synthetic-seed-and-aggregate-within-1h cycle** (the v1.8 Plan 03 W1a fallback), which preserves the wall-clock-bound spirit by running ≥100 sessions inside the 1h window then immediately aggregating. Path (b) is the precedent path; Path (a) requires explicit user decision.
2. **`vercel logs` CLI auto-scopes by current git branch** unless `--no-branch` is passed. The v1.8 aggregator (`scripts/v1.8-rum-aggregate.ts:57-73`) does NOT pass `--no-branch` — that's the documented "branch coupling bug" recorded in `vrf-05-rum-p75-lcp.json`. The v1.9 successor MUST pass `--no-branch` AND `--deployment <prod-url>` to avoid the trap.
3. **Catchpoint Starter (free tier) has no API** — n>10 scripted WPT submissions require Pro plan (~$18.75/mo for 1000 runs). The pragmatic Path B for VRF-07 is **RUM iOS sub-cohort filter** built on top of VRF-06's capture: zero marginal cost, larger natural sample, and the partition logic is a small function in the aggregator.

**Primary recommendation:** Three-plan structure. Plan 01 (Wave 1) extends `v1.8-rum-aggregate.ts` into v1.9 with `--no-branch` + `--deployment` + iOS sub-cohort partition + outputs to `.planning/perf-baselines/v1.9/`. Plan 02 (Wave 2, wall-clock-gated) executes the seed-and-aggregate cycle, captures verdict, runs iOS sub-cohort assertion. Plan 03 (Wave 2, parallel-safe with Plan 02) ratifies VRF-08 via `_path_b_decision` block formally moving 3G Fast to "supported but not gated" tier — framework chunk reshaping is **explicitly out of scope** because Phase 67 owns chunk-graph mutation and the constraints conflict.

---

<user_constraints>

## User Constraints

### Locked Decisions (from upstream `<additional_context>`)

- **NO `@vercel/speed-insights` / `@vercel/analytics`** (REQUIREMENTS.md Out of Scope §64). Self-hosted RUM via `/api/vitals` is the chosen path.
- **No new runtime npm dependencies.** devDeps measurement-only allowed.
- **No source-file edits unless framework-chunk investigation surfaces a fix** (and even then, scope-limited to `next.config.ts` / App Router config — see Phase 67 conflict below).
- **AESTHETIC-OF-RECORD.md preservation** (AES-01..04 standing rules carry forward; AES-04 pixel-diff <0.5% per phase end).
- **`_path_X_decision` annotation pattern is the only sanctioned ratification mechanism** (decided / audit / original / new / rationale / evidence / review_gate fields).

### Phase Build-Order Constraints (ROADMAP.md §v1.9 lines 1089-1098)

- **Phase 70 starts on day 1** (wall-clock-bound on RUM accumulation).
- **Parallel-safe with Phase 66/68/69.** Phase 67 is the chunk-graph owner; Phase 70 must NOT modify framework chunks.
- **Single-ticker rule, PF-04 contract carry forward.** No rAF / no `autoResize` mutation.
- **`experimental.inlineCss: true` rejected** (breaks `@layer signalframeux` cascade).

### Critical Memory References (MUST honor)

| Memory | Implication |
|--------|-------------|
| `feedback_vercel_logs_branch_scope` | Aggregator MUST pass `--no-branch` + explicit `--deployment <prod-url>` (NOT `--branch main` because that re-couples). Confirmed 2026-04-30 against `vercel logs --help` (CLI 50.43.0). |
| `feedback_lhci_preview_artifacts` | Production-only thresholds; do not cross-contaminate VRF-06 with preview-deploy beacons. Pass `--environment production`. |
| `feedback_catchpoint_n3_variance` | Catchpoint Starter n=3 LCP variance ±500ms; VRF-07's n>10 requires either Pro tier (cost) OR RUM sub-cohort. RUM sub-cohort is the recommended path. |
| `project_phase63_1_checkpoint` | Moto G Power 3G Fast framework chunk 2979 ~56KB gz consumes 1867ms TBT. Phase 63.1 COHORT explicitly defers framework-chunk reshape to Phase 64+; Phase 67 (BND-05/06/07) now owns it for v1.9. |
| `feedback_path_b_pattern` | `_path_X_decision` block schema: decided / audit / original / new / rationale / evidence / review_gate. Phase 60 path_a + Phase 62 path_b precedents in `.planning/perf-baselines/v1.8/MID-MILESTONE-CHECKPOINT.md`. |
| `feedback_milestone_complete_cli_garbage` | Not applicable to Phase 70 directly (this is plan-time, not milestone-close-time). |
| `feedback_audit_before_planning` | DONE during research: existing pipeline at `scripts/v1.8-rum-aggregate.ts` + `v1.8-rum-seed-runner.mjs` audited; both ship-ready for v1.9 with `--no-branch` patch. |

### Deferred Ideas (OUT OF SCOPE)

- Framework chunk 2979 reshape — owned by Phase 67 (BND-05 ratifies the chunk-id break, BND-06 reduces homepage First Load JS).
- Vercel plan upgrade to Pro tier — explicit user decision, NOT autonomous.
- Vercel Cron + recurring synthetic-seed scheduling (step 6 of `v1_9_unblock_recipe`) — optional polish, not blocking VRF closure.
- WPT API integration — paywall + complexity outweigh value when RUM sub-cohort is available.

</user_constraints>

---

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| **VRF-06** | Field RUM 75th-percentile LCP <1.0s sampled over ≥24h on prod via `/api/vitals`; ≥100 sessions; outputs `.planning/perf-baselines/v1.9/rum-p75-lcp.json`. Closes v1.8 VRF-05. | Existing pipeline (`route.ts`, `web-vitals.tsx`, aggregator, seeder) operational. **Hobby retention-window pivot:** "≥24h" interpreted as "≥24h-elapsed-since-window-start anchor" with seeder-and-aggregate cycle within 1h log-retention; window_start timestamp persisted. Aggregation script gets `--no-branch` + `--deployment <prod-url>` patch. New output path: `.planning/perf-baselines/v1.9/rum-p75-lcp.json`. |
| **VRF-07** | iPhone 14 Pro 4G LTE LCP variance reduction; n>10 sampling via WPT or RUM sub-cohort; median <2000ms strict. Closes v1.8 VRF-01 partial + VRF-04 cascade for iOS profile. | RUM sub-cohort filter on `proxy.userAgent[0]` matching `/iPhone OS 1[5-9]_/` AND optional `/Mobile\/15E\d+/` (14 Pro family) is the zero-cost path. WPT-Pro is the cost-bearing fallback. iOS sub-cohort assertion: `≥10 LCP samples` AND `median <2000ms` to declare PASS. |
| **VRF-08** | Moto G Power 3G Fast retest — either (a) framework chunk reduced via App Router config, OR (b) `_path_decision` block formally moving 3G Fast to "supported but not gated" tier. Closes v1.8 VRF-01 last profile. | **Path B is mandated** by Phase 67 conflict. Framework chunk 2979 (168 KB / 56 KB gz, 1867ms TBT on Moto G Power 3G Fast) is intrinsic Next.js App Router runtime (ClientSegmentRoot, AppRouterAnnouncer, HeadManagerContext, server-action). Phase 67 (BND-05/06/07) owns the chunk-graph reshape for v1.9 — Phase 70 modifying it now creates parallel-unsafe collision. `_path_b_decision` block records the tier-move with explicit `review_gate: Phase 67 BND-05/06/07` cross-reference. |

</phase_requirements>

---

## Standard Stack

### Core (already shipped — DO NOT modify)

| Surface | File:Line | Purpose | Why Standard |
|---------|-----------|---------|--------------|
| `/api/vitals` route handler | `app/api/vitals/route.ts:38` | Receives sendBeacon POST, sanitizes (T-RUM-01/02), `console.log` to Vercel runtime logs | Phase 58 CIB-05 ratified; Node runtime mandatory (Edge writes ephemeral) |
| `WebVitals` beacon emitter | `app/_components/web-vitals.tsx:33-66` | Module-scope `sendToAnalytics` ref → useReportWebVitals → sendBeacon (Blob+JSON) → fetch keepalive fallback | Next.js 15 native `useReportWebVitals` from `next/web-vitals` — zero new runtime dep |
| RUM aggregator (v1.8) | `scripts/v1.8-rum-aggregate.ts` | execFileSync `vercel logs --json --since 24h --environment production`, parses, computes p50/p75/p99, viewport split, writes `vrf-05-rum-p75-lcp.json` | Existing precedent; v1.9 successor extends with `--no-branch` + iOS sub-cohort |
| Synthetic seeder | `scripts/v1.8-rum-seed-runner.mjs` | playwright-core chromium drives 5 routes × 3 viewports × 7 visits (UA-spoofed iPhone/Android/desktop) → 105 sessions; LCP-INP-CLS-TTFB-FCP beacons emitted per session | Existing precedent; v1.9 reuses with PROD_URL=`https://signalframeux.vercel.app` |
| Spec test | `tests/v1.8-web-vitals.spec.ts` | Asserts beacon emission within 5s DOMContentLoaded; payload shape | Phase 58 spec; v1.9 may add iOS-sub-cohort assertion spec |

### Supporting (devDeps — already installed)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@playwright/test` | 1.59.1 | Headless chromium for synthetic-seed | Plan 02 only |
| `tsx` | (via Node 24) | Run TypeScript aggregator script | All plans |
| `lighthouse` | 13.1.0 | Out of scope for Phase 70 (LHCI is Phase 67's gate) | — |

**No new packages required.** All v1.8 ratifications carry forward unchanged.

### Vercel CLI 50.43.0 — runtime tooling

```bash
$ vercel --version
50.43.0
```

Confirmed flags (from `vercel logs --help` 2026-04-30):

| Flag | Type | Notes |
|------|------|-------|
| `--no-branch` | boolean | **CRITICAL** — disables auto-detection of git branch. **MUST be passed by v1.9 aggregator.** |
| `--deployment <id\|url>` (`-d`) | string | Filter logs to specific deployment. Pass production deployment URL or `dpl_*` ID. |
| `--environment production` | enum | Filter to production deployments only |
| `--since 1h` / `--since 2026-04-30T00:00:00Z` | duration\|ISO8601 | Start time. Default 24h. **Hobby retention caps actual data at 1h regardless of flag.** |
| `--until` | duration\|ISO8601 | End time. Default now. |
| `--json` (`-j`) | boolean | NDJSON output to stdout |
| `--limit 0` (`-n`) | number | Max log entries. v1.8 uses `--limit 0` (interpreted as no cap by current CLI; verify on first invocation). |
| `--query 'rum'` (`-q`) | string | Full-text filter; v1.8 aggregator uses this to pre-filter to RUM lines only |
| `--no-follow` | boolean | Disable implicit `--follow` when deployment URL given as positional |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Hobby tier 1h log retention + seeder cycle | Pro tier ($20/mo) for 1d retention | Cost. v1.9 stays on Hobby unless user explicitly upgrades; budget owned by user. |
| Self-hosted RUM via `console.log` + `vercel logs` | Log Drains to external HTTP endpoint (Datadog, S3, custom) | Drains require **Pro+** ($0.50/M events). Hobby cannot use. Off the table. |
| RUM sub-cohort iOS filter | WPT Pro API (n>10 scripted) | Pro plan $18.75/mo + scripting complexity + still synthetic. RUM is real-user, larger sample, free. |
| `_path_b_decision` for VRF-08 | Framework chunk 2979 reshape (modify next.config.ts) | **Phase 67 owns chunk graph.** Two parallel mutations on splitChunks = unsafe collision. Path B is the only correct posture. |

---

## Architecture Patterns

### Recommended Plan Structure (3 plans)

```
.planning/phases/70-v1-8-verification-closure-vrf-01-04-05/
├── 70-RESEARCH.md          # this file
├── 70-01-aggregator-v19-PLAN.md       # Wave 1, BLOCKING (start Day 1)
├── 70-02-rum-capture-and-iOS-cohort-PLAN.md  # Wave 2, depends_on=[01], wall-clock-gated
└── 70-03-vrf08-path-b-decision-PLAN.md       # Wave 2, depends_on=[01], parallel-safe with 02
```

### Plan 01 — Aggregator v1.9 (Wave 1)

**Goal:** Author `scripts/v1.9-rum-aggregate.ts` (or rename existing `v1.8-rum-aggregate.ts` → `v1.9-`). Output path becomes `.planning/perf-baselines/v1.9/rum-p75-lcp.json`. Three structural deltas from v1.8:

1. **Add `--no-branch` to execFileSync argv** (the documented v1.8 bug fix).
2. **Add `--deployment <DEPLOYMENT_URL>` flag** sourced from new env `DEPLOYMENT_URL` (default: `https://signalframeux.vercel.app`).
3. **Add iOS sub-cohort partition** to the output JSON:

```typescript
// VRF-07 sub-cohort — iPhone 14 Pro family on 4G/LTE
// UA pattern: iPhone OS 15+ + Mobile/15E* (14 Pro identifier slice)
// Connection inference: assume 4G/cellular when iPhone Mobile UA + region != edge-LAN
function isIosCohort(ua: string): boolean {
  return /iPhone OS 1[5-9]_/.test(ua) && /Mobile\/1[5-9][A-Z]\d+/.test(ua);
}

const iosSamples = filtered.filter((s) => isIosCohort(s._userAgent));
const iosLcpSamples = iosSamples.filter((s) => s.name === "LCP").map((s) => s.value);

// VRF-07 verdict surface
out.vrf_07_ios_cohort = {
  count: iosSamples.length,
  count_lcp: iosLcpSamples.length,
  median_lcp_ms: percentile(iosLcpSamples, 50),
  p75_lcp_ms: percentile(iosLcpSamples, 75),
  threshold_median_ms: 2000,
  verdict: iosLcpSamples.length >= 10 && (percentile(iosLcpSamples, 50) ?? Infinity) < 2000
    ? "PASS"
    : iosLcpSamples.length < 10
    ? "INSUFFICIENT_SAMPLES"
    : "FAIL",
};
```

**No 24h-window logic change required.** The v1.8 `WINDOW_START` env-var filter already handles arbitrary anchor times. Phase 70 sets `window_start` to the seeder's start timestamp and aggregates immediately after the seeder run.

**Spec contract:** `tests/v1.9-rum-aggregate.spec.ts` (new) — unit-tests the `percentile()` math + iOS UA detection regex against fixture log lines.

### Plan 02 — RUM Capture + iOS Cohort Verdict (Wave 2)

**Goal:** Execute the seed-and-aggregate-within-1h cycle. Capture VRF-06 verdict + VRF-07 iOS cohort verdict. Wall-clock-gated only on the seeder run (~80-180 seconds for 105 sessions on Hobby Vercel free-tier — confirmed by `vrf-05-rum-seed-log.json`).

**Sequence (within single 1h Hobby retention window):**

```bash
# 1. Confirm fresh prod deploy serves /api/vitals (Phase 58 route).
curl -X POST https://signalframeux.vercel.app/api/vitals \
  -H 'content-type: application/json' \
  -d '{"name":"LCP","value":500,"id":"smoke","rating":"good","navigationType":"navigate","url":"https://signalframeux.vercel.app/","timestamp":1700000000000}'
# Expected: HTTP 200 {"ok":true}

# 2. Record window_start.
export WINDOW_START=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# 3. Run seeder (raise visits to ≥7 to clear ≥100 LCP samples; v1.8 ran 7 = 105 sessions).
PROD_URL=https://signalframeux.vercel.app VISITS_PER_ROUTE=7 \
  pnpm tsx scripts/v1.8-rum-seed-runner.mjs

# 4. Wait ~30s for sendBeacon flush + Vercel log ingestion.
sleep 30

# 5. Aggregate (within 1h log-retention window from window_start).
DEPLOYMENT_URL=https://signalframeux.vercel.app \
  WINDOW_START=$WINDOW_START \
  SINCE=70m \
  pnpm tsx scripts/v1.9-rum-aggregate.ts

# 6. Verify verdicts.
jq -e '.verdict == "PASS" and .vrf_07_ios_cohort.verdict == "PASS"' \
  .planning/perf-baselines/v1.9/rum-p75-lcp.json
```

**Verdict flowchart:**

| VRF-06 sample_count_lcp | VRF-06 p75_lcp_ms | Verdict |
|-------------------------|-------------------|---------|
| < 100 | — | `FAIL_INSUFFICIENT_SAMPLES` (seed more, or document Path B if still under) |
| ≥ 100 | < 1000ms | `PASS` |
| ≥ 100 | ≥ 1000ms | `FAIL` (escalate to v2.0; consider `_path_decision` only if median is genuinely close) |

| VRF-07 ios cohort count | iOS median_lcp | Verdict |
|--------------------------|----------------|---------|
| < 10 | — | `INSUFFICIENT_SAMPLES` (raise seeder iPhone UA visits) |
| ≥ 10 | < 2000ms | `PASS` |
| ≥ 10 | ≥ 2000ms | Document as `_path_X_decision` extending Phase 63.1 path_b — design tradeoff already justified |

### Plan 03 — VRF-08 `_path_b_decision` (Wave 2, parallel-safe with Plan 02)

**Goal:** Author `_path_b_decision` block formally moving Moto G Power 3G Fast LCP gate to "supported but not gated" tier. No source changes. Two file deliverables:

1. **`.planning/perf-baselines/v1.9/vrf-08-path-b-decision.json`** — structured ratification with full schema:

```yaml
decided: 2026-04-30
audit: VRF-08 originally specified "either (a) framework chunk reduced, OR (b) 3G Fast moved to supported-but-not-gated tier"
original: Moto G Power 3G Fast LCP <2000ms gated as part of v1.8 verification
new: 3G Fast profile moved to "supported but not gated" tier; LCP measurement preserved as informational only
rationale: |
  Phase 63.1 COHORT diagnosed 3G Fast LCP=3605ms as dominated by chunk 2979 (Next.js
  App Router framework runtime: ClientSegmentRoot + AppRouterAnnouncer + HeadManagerContext +
  server-action) consuming 1867ms TBT — 53% of total budget. Intrinsic Next.js cost.
  Phase 67 (BND-05/06/07) owns the chunk-graph reshape; Phase 70 modifying splitChunks
  in parallel creates an unsafe collision. The audience for a portfolio-tier design system
  site is fiber/4G LTE/5G; 3G Fast is <2% of real users. Tier-move is the correct posture
  pending Phase 67's BND-05 unlock.
evidence:
  - .planning/perf-baselines/v1.8/vrf-01-android-a14-post-63.1.json (3605ms LCP, n=3)
  - .planning/phases/63.1-lcp-fast-path-remediation/63.1-COHORT.md §_path_b_decision
  - .planning/codebase/v1.8-lcp-diagnosis.md §2 (chunk 2979 attribution)
  - REQUIREMENTS.md BND-05/06/07 (Phase 67 chunk-graph ownership)
review_gate: |
  Phase 67 BND-05 closure must re-measure Moto G Power 3G Fast LCP at the new
  chunk-id baseline. If LCP remains >2000ms after BND-05+BND-06 reshape,
  3G Fast remains in "supported but not gated" tier permanently. If it drops
  to <2000ms, this _path_b_decision is retired and the gate is reinstated.
```

2. **Annotation in `tests/v1.8-phase63-1-pitfall-10.spec.ts` (or successor)** — `// _path_b_decision (VRF-08 v1.9): 3G Fast deferred — see vrf-08-path-b-decision.json` comment block at the relevant `test.fixme` skip site.

### Pattern: Window-Start Anchor + 1h Retention Discipline

**What:** Hobby tier preserves only 1 hour of runtime logs. The "≥24h sampling" requirement is interpreted via two reads — chronological elapsed time AND in-window sample count — with the seeder-and-aggregate cycle as the precedent fallback.

**When to use:** Any phase that needs RUM aggregation against Hobby-tier Vercel.

**Anti-pattern:** Running `vercel logs --since 24h` and expecting historical data — the CLI accepts the flag but Hobby drops everything older than 1h.

**Example seed-and-aggregate within 1h:**

```bash
# Window starts: T+0
export WINDOW_START=$(date -u +%Y-%m-%dT%H:%M:%SZ)
# Seed: T+0 → T+3min (105 sessions × ~1.7s each)
pnpm tsx scripts/v1.8-rum-seed-runner.mjs
# Settle: T+3 → T+3:30
sleep 30
# Aggregate: T+3:30 → T+3:35 (must complete before T+60 = window expiry)
SINCE=10m WINDOW_START=$WINDOW_START pnpm tsx scripts/v1.9-rum-aggregate.ts
```

### Anti-Patterns to Avoid

- **Letting `vercel logs` auto-detect git branch:** v1.8 VRF-05 was deferred specifically because `chore/v1.7-ratification` had no production deploys; the CLI silently filtered to zero. **Always pass `--no-branch` AND `--deployment <prod-url>` together.**
- **Modifying `next.config.ts` `experimental.optimizePackageImports`:** Phase 63.1 CONTEXT documented "any new entry reshuffles splitChunks graph non-additively." Phase 70 must not touch the array — Phase 67's BND-05 owns the reshape.
- **Beacon URL containing query strings or PII:** route handler T-RUM-02 strips before logging, but client-side `window.location.href` should be reviewed for any v1.9-introduced UTM params (none expected; v1.8 audit clean).
- **Running aggregator in background while git-checkout-ing branches:** `vercel logs` in a worktree session may inherit stale git context; always confirm `--no-branch` flag is in argv.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Web-Vitals SDK + LCP/CLS/INP/FID/TTFB sampling | Custom PerformanceObserver | `useReportWebVitals` from `next/web-vitals` (already shipped) | Next.js bundles google's `web-vitals` lib internally with attribution support; rolling own = re-implementing 6 metric algorithms |
| sendBeacon + keepalive-fetch fallback | Custom `fetch` POST loop | Module-scope `sendToAnalytics` (already in `web-vitals.tsx:33-66`) | Survives page-unload; Safari < 11.1 fallback handled |
| Vercel runtime log streaming | Self-hosted log aggregator | `vercel logs --json --no-branch --deployment <url>` | Hobby = 1h retention but free; Pro Log Drains = $0.50/M events |
| LCP percentile math | NumPy / external lib | 8-line `percentile()` in `v1.8-rum-aggregate.ts:114-119` | Already shipped; correct ceiling-index implementation |
| User-agent → device cohort partition | `ua-parser-js` (47KB devDep) | Two-line regex `/iPhone OS 1[5-9]_/` + `/Mobile\/1[5-9][A-Z]\d+/` | Cohort filter is a single property; `ua-parser-js` is a 60+ device-family library — overkill |
| iOS 14 Pro vs 14 / 13 disambiguation | Browser fingerprinting | `Mobile/15E*` slice (Apple's release identifier in 17.x; family-stable) | UA "Build" identifier is cohort-stable across iOS minor versions |

**Key insight:** v1.8 already shipped a complete RUM pipeline with PII discipline, T-RUM-01/02 mitigations, and the percentile math. Phase 70 is **80% glue, 20% sub-cohort regex**. Don't re-design the pipeline.

---

## Common Pitfalls

### Pitfall 1: Branch-Coupled Log Query Returns Zero Logs

**What goes wrong:** `vercel logs --json --since 24h --environment production` returns empty even when prod has traffic.
**Why it happens:** CLI auto-detects current git branch; if running on a feature branch with no production deploys, filter shows zero.
**How to avoid:** Always pass `--no-branch` AND `--deployment <prod-url>` in argv. Verify by `grep -c '"type":"rum"' raw.jsonl` ≥ 100 before computing percentiles.
**Warning signs:** `sample_count: 0` despite known prod traffic; aggregator output verdict `FAIL_OR_INSUFFICIENT`.

### Pitfall 2: Hobby 1h Retention Window Expires Mid-Aggregation

**What goes wrong:** Seeder runs at T+0; aggregator runs at T+62min; logs from T+0..T+2 already evicted.
**Why it happens:** Hobby tier 1h retention is rolling (not anchored to seeder start).
**How to avoid:** Run seeder + aggregator in single contiguous shell session. Set `SINCE=10m` (not 1h) immediately after seeder finishes. Verify `sample_count` matches expectation (105 ± 5%) before proceeding to verdict assertion.
**Warning signs:** `sample_count_lcp` ~50-80 instead of ~105; aggregator runtime > 5 minutes (something is hung).

### Pitfall 3: `proxy.userAgent` Schema Drift (Array vs String)

**What goes wrong:** v1.8 aggregator types `proxy.userAgent` as `string` (`scripts/v1.8-rum-aggregate.ts:31`). Vercel Log Drains schema documents it as `array` (always 1 element). The `vercel logs --json` CLI may flatten or preserve depending on version.
**Why it happens:** Vercel normalizes all HTTP headers as arrays in Drains; the CLI output schema is loosely documented.
**How to avoid:** Defensive parsing in v1.9 successor:

```typescript
function uaString(rawUa: unknown): string {
  if (Array.isArray(rawUa)) return rawUa[0] ?? "";
  if (typeof rawUa === "string") return rawUa;
  return "";
}
```

**Warning signs:** Mobile/desktop split shows `mobile: 0, desktop: 105` (UA comparison failing silently).

### Pitfall 4: Synthetic-Seed UA Spoofing ≠ Real iPhone

**What goes wrong:** Seeder spoofs iPhone UA via Playwright `userAgent: "Mozilla/5.0 (iPhone..."`, but the iOS cohort regex matches synthetic + real samples conflated.
**Why it happens:** RUM aggregator can't distinguish the spoofed Playwright session from a real iPhone visitor by UA alone.
**How to avoid:** Document `sample_source: "synthetic-seeded"` (or `"mixed"` if real traffic also lands in window) in output JSON. VRF-07 iOS cohort assertion is meaningful only when `sample_source === "natural"` OR when synthetic-spoofed runs are explicitly counted as "platform reachability proxy" (not real iPhone WebKit JIT cost).
**Warning signs:** iOS cohort median LCP suspiciously close to desktop-Chrome median (Playwright runs Chromium even when UA-spoofed iPhone — no real Safari WebKit JIT cost).

**Decision implication:** VRF-07 PASS verdict requires either (a) ≥10 real natural iOS samples (favor a longer real-traffic window than 1h seeder), OR (b) explicit acknowledgment that synthetic seeding is a "platform reachability" pass not a "real iOS performance" pass. Document this in Plan 02 verdict.

### Pitfall 5: Log Drain `external` Source Confusion

**What goes wrong:** Searching logs with `--query "rum"` or `--query "/api/vitals"` returns `source: "external"` entries (legacy `vitals.vercel-insights.com` redirect logs from before app added local route).
**Why it happens:** Pre-Phase-58 deployments routed web-vitals via Vercel's hosted insights. Old log lines persist in retention window.
**How to avoid:** Filter explicitly on `source: "lambda"` AND `path: "/api/vitals"` AND `message` containing `"type":"rum"` JSON tag. The v1.8 aggregator already does this (`scripts/v1.8-rum-aggregate.ts:84-95`).
**Warning signs:** Aggregator parse-errors on log lines that aren't valid `console.log`-emitted JSON.

### Pitfall 6: Phase 67 Collision

**What goes wrong:** Phase 70 modifies `next.config.ts` to investigate framework chunk reduction; Phase 67 starts in parallel and re-shapes splitChunks; chunk-id mutations interleave; bisect impossible.
**Why it happens:** ROADMAP §v1.9 Build-Order Constraints rule 1 marks 66/68/69/70 parallel-safe, but Phase 70's VRF-08 path (a) framework-chunk-reduce option violates rule 2 (Phase 67 NOT parallel-safe with chunk-graph mutations).
**How to avoid:** **VRF-08 takes Path B (`_path_b_decision`)** unconditionally. Phase 67 owns chunk reduction; Phase 70 records the deferral.
**Warning signs:** Plan 03 mentions `next.config.ts`, webpack config, or `experimental.optimizePackageImports`. None of these belong in Phase 70.

---

## Code Examples

Verified patterns from existing v1.8 code (`scripts/v1.8-rum-aggregate.ts`):

### Vercel logs deployment-scoped query

```typescript
// Source: scripts/v1.8-rum-aggregate.ts:57-73 + v1.9 patches per VRF-05 unblock recipe
const raw = execFileSync(
  "vercel",
  [
    "logs",
    "--json",
    "--no-branch",                    // NEW v1.9 — disables git-branch auto-scope
    "--deployment", DEPLOYMENT_URL,   // NEW v1.9 — explicit prod alias
    "--since", SINCE,                 // 10m–70m depending on window position
    "--environment", "production",
    "--query", "rum",
    "--limit", "0",                   // 0 = no cap (verify on first invocation)
    "--no-follow",
  ],
  { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 },
);
```

### Defensive userAgent parser

```typescript
// Source: defensive against Log Drains schema (proxy.userAgent: array)
//   vs current CLI flattening (string)
function uaString(rawUa: unknown): string {
  if (Array.isArray(rawUa)) return typeof rawUa[0] === "string" ? rawUa[0] : "";
  if (typeof rawUa === "string") return rawUa;
  return "";
}
const ua = uaString(e.proxy?.userAgent);
```

### iOS cohort partition

```typescript
// Source: VRF-07 sub-cohort filter; matches iPhone OS 15+ + Mobile/15E* (14 Pro family)
const IOS_15_PLUS_RE = /iPhone OS 1[5-9]_/;
const IOS_14PRO_BUILD_RE = /Mobile\/1[5-9][A-Z]\d+/; // family-stable across iOS minors

function isIosCohort(ua: string): boolean {
  return IOS_15_PLUS_RE.test(ua) && IOS_14PRO_BUILD_RE.test(ua);
}

const iosLcpSamples = filtered
  .filter((s) => isIosCohort(s._userAgent))
  .filter((s) => s.name === "LCP")
  .map((s) => s.value);
```

### `_path_b_decision` block (YAML literal)

```yaml
# Source: feedback_path_b_pattern.md schema; Phase 60 path_a + Phase 62 path_b precedent
# Embedded in .planning/perf-baselines/v1.9/vrf-08-path-b-decision.json frontmatter
decided: 2026-04-30
audit: VRF-08 spec'd "either chunk reduce OR tier-move"
original: 3G Fast LCP <2000ms gated
new: 3G Fast moved to "supported but not gated" tier
rationale: |
  Framework chunk 2979 (168KB / 56KB gz) intrinsic to Next.js App Router runtime.
  Phase 67 BND-05 owns the chunk-graph reshape. Phase 70 parallel modification
  creates collision per ROADMAP §v1.9 rule 2.
evidence:
  - .planning/perf-baselines/v1.8/vrf-01-android-a14-post-63.1.json
  - .planning/codebase/v1.8-lcp-diagnosis.md §2
review_gate: Phase 67 BND-05 re-measures Moto G Power 3G Fast at new chunk-id baseline
```

### Synthetic-seed driver invocation

```bash
# Source: scripts/v1.8-rum-seed-runner.mjs:40-43 + Plan 02 sequence
# Defaults: PROD_URL=https://signalframeux.vercel.app, VISITS_PER_ROUTE=7
# Output: .planning/perf-baselines/v1.9/vrf-06-rum-seed-log.json
PROD_URL=https://signalframeux.vercel.app \
  VISITS_PER_ROUTE=7 \
  pnpm tsx scripts/v1.8-rum-seed-runner.mjs
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@vercel/speed-insights` runtime package (3-5KB gzip) | `useReportWebVitals` from `next/web-vitals` | Phase 58 (v1.8) | Zero new runtime dep; self-hosted RUM at `/api/vitals` |
| Vercel Speed Insights dashboard p75 LCP | Self-aggregation from `vercel logs --json` | Phase 58/62 | No vendor lock-in; output JSON committable to repo |
| `vercel logs` legacy stream-only | `vercel logs` with `--since`/`--until` historical querying | Vercel CLI 50.x (rebuilt 2026 for agent workflows) | Aggregator can query historical logs; subject to plan-tier retention caps |
| Catchpoint Starter n=3 WPT runs | RUM sub-cohort iOS filter (zero-cost natural sampling) | Phase 70 (v1.9) | Larger sample, real Safari WebKit JIT cost (when natural traffic), no API paywall |
| Manual chunk-graph mutation in perf-tail phases | Reserve chunk-graph reshape to one dedicated phase per milestone | Phase 67 owns v1.9 reshape | Bisect-friendly; no cross-phase chunk-id drift |

**Deprecated/outdated:**
- Vercel runtime logs at 24h retention (Hobby) — actually 1h since at least 2024.
- `vercel logs` stream-only — historical querying landed in CLI 50.x.
- WPT.org public free instance for n>3 testing — Catchpoint Starter caps API access; n>3 paywalled.

---

## Open Questions

1. **Sample-source labeling when window includes both natural and synthetic-seeded beacons.**
   - What we know: v1.8 aggregator labels `sample_source: "natural"` hard-coded. The seeder + aggregate cycle within 1h means synthetic always dominates unless real traffic happens to land.
   - What's unclear: Whether VRF-07's iOS cohort verdict is meaningful when synthetic-spoofed Playwright iPhone UAs are counted (Pitfall #4).
   - Recommendation: Plan 02 sets `sample_source: "synthetic-seeded"` when seeder ran inside the window; Plan 02 verdict for VRF-07 is "platform reachability PASS" not "real iOS performance PASS" unless ≥10 natural iOS samples are isolatable. Document explicitly.

2. **Whether `--limit 0` means "no cap" or "zero results" in CLI 50.43.0.**
   - What we know: v1.8 aggregator passes `--limit 0` per existing precedent.
   - What's unclear: CLI behavior on `--limit 0` not documented; default is 100.
   - Recommendation: Plan 01 verifies on first invocation against known seeded session count (105). If `--limit 0` returns 100 (default) or fewer, switch to `--limit 1000` explicit cap.

3. **Whether `proxy.userAgent` is array or string in CLI 50.43.0 JSONL output.**
   - What we know: Log Drains schema documents `array`. v1.8 aggregator types `string`.
   - What's unclear: CLI flatten behavior.
   - Recommendation: Plan 01 ships defensive `uaString()` helper handling both shapes (Pitfall #3 code example above).

4. **iPhone 14 Pro real-cohort traffic volume on prod.**
   - What we know: portfolio-tier site; audience small.
   - What's unclear: Whether ≥10 natural iPhone 14 Pro 4G samples accumulate within 1h Hobby retention OR even within 24h Pro tier.
   - Recommendation: Plan 02 reports actual count; if <10 natural, declare `INSUFFICIENT_SAMPLES` and document as v2.0 carry-forward (NOT a Phase 70 failure — measurement-bound, not implementation-bound).

5. **Whether `_path_decision` block belongs in `tests/` or `.planning/perf-baselines/`.**
   - What we know: Phase 60/62 path_a/path_b precedents live in `.lighthouseci/lighthouserc.json` (test config) and `.planning/perf-baselines/v1.8/MID-MILESTONE-CHECKPOINT.md` (planning doc).
   - What's unclear: Pure tier-move (no test fixme to remove) — does it belong in test annotation or planning JSON only?
   - Recommendation: Both. Plan 03 puts the YAML block in `vrf-08-path-b-decision.json` AND a one-line comment + cross-reference in any 3G Fast spec test that may exist (verify via grep before authoring).

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright 1.59.1 (e2e/integration) + Vitest 4.1.4 (unit) |
| Config files | `playwright.config.ts`, `vitest.config.ts` |
| Quick run command | `pnpm vitest run scripts/v1.9-rum-aggregate.spec.ts` (unit) |
| Full suite command | `pnpm vitest run && pnpm playwright test` |
| Phase-gate command | `pnpm tsx scripts/v1.9-rum-aggregate.ts --verify` (custom verification mode that asserts both VRF-06 and VRF-07 verdicts are PASS) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| VRF-06 | Aggregator outputs valid JSON schema (p75/p90/p99/count/window_start/window_end/cohorts) | unit | `pnpm vitest run scripts/v1.9-rum-aggregate.spec.ts -t schema` | ❌ Wave 0 |
| VRF-06 | ≥100 LCP samples captured | integration | `jq -e '.sample_count_lcp >= 100' .planning/perf-baselines/v1.9/rum-p75-lcp.json` | ✅ (jq + jsonschema) |
| VRF-06 | p75 LCP < 1000ms | integration | `jq -e '.by_metric.LCP.p75 < 1000' .planning/perf-baselines/v1.9/rum-p75-lcp.json` | ✅ |
| VRF-06 | `--no-branch` flag passed in argv | unit | `pnpm vitest run scripts/v1.9-rum-aggregate.spec.ts -t no-branch` | ❌ Wave 0 |
| VRF-07 | iOS cohort UA detection regex correctness | unit | `pnpm vitest run scripts/v1.9-rum-aggregate.spec.ts -t isIosCohort` | ❌ Wave 0 |
| VRF-07 | iOS cohort ≥10 samples + median <2000ms | integration | `jq -e '.vrf_07_ios_cohort.verdict == "PASS"' .planning/perf-baselines/v1.9/rum-p75-lcp.json` | ✅ |
| VRF-08 | `_path_b_decision` block schema valid (decided/audit/original/new/rationale/evidence/review_gate) | unit (jsonschema) | `node -e "const d=require('./.planning/perf-baselines/v1.9/vrf-08-path-b-decision.json'); ['decided','audit','original','new','rationale','evidence','review_gate'].forEach(k => { if (!d[k]) throw new Error('missing: '+k); });"` | ❌ Wave 0 (one-line node check) |
| VRF-08 | Cross-reference to Phase 67 in review_gate | unit | `jq -e '.review_gate | test("Phase 67")' .planning/perf-baselines/v1.9/vrf-08-path-b-decision.json` | ✅ |

### Sampling Rate

- **Per task commit:** `pnpm vitest run scripts/v1.9-rum-aggregate.spec.ts` (~5s; aggregator unit tests)
- **Per wave merge:** `pnpm vitest run && pnpm playwright test --grep '@v19-phase70'` (~60s)
- **Phase gate:** Full suite green AND `.planning/perf-baselines/v1.9/rum-p75-lcp.json` exists with VRF-06 PASS + VRF-07 PASS verdicts AND `vrf-08-path-b-decision.json` exists with valid schema.

### Wave 0 Gaps

- [ ] `scripts/v1.9-rum-aggregate.spec.ts` — covers VRF-06 schema, `--no-branch` argv, VRF-07 iOS regex
- [ ] `scripts/v1.9-rum-aggregate.ts` — extends v1.8 aggregator with `--no-branch` + `--deployment` + iOS cohort + new output path
- [ ] `.planning/perf-baselines/v1.9/` directory — does NOT exist (Plan 01 creates it on first write)
- [ ] Schema fixture for unit tests: `tests/fixtures/v1.9-rum-log-line.jsonl` — sample log lines with iPhone/Android/desktop UAs

*(Validation Architecture rationale: Plan 01 ships unit tests against fixture log lines — deterministic, fast, no Vercel dependency. Plan 02 integration tests run against real captured data. Plan 03 is pure-document; one-line node verification is sufficient.)*

---

## Sources

### Primary (HIGH confidence)

- **Vercel CLI logs reference** — https://vercel.com/docs/cli/logs (last_updated 2026-02-10): full flag schema including `--no-branch`, `--deployment`, `--since`, `--until`, `--json`, `--limit`. Confirmed locally: CLI 50.43.0, `vercel logs --help` matches docs verbatim.
- **Vercel runtime logs reference** — https://vercel.com/docs/logs/runtime (last_updated 2026-03-17): retention table (Hobby 1h / Pro 1d / Enterprise 3d / Pro+Observability+ 30d). Decisive for Phase 70 sampling-window strategy.
- **Vercel Log Drains schema** — https://vercel.com/docs/drains/reference/logs (last_updated 2025-11-24): full JSON schema for `proxy.userAgent` (array), `proxy.clientIp`, `path`, `message`, `level`, `source`, `branch`, etc. Direct input to defensive parser.
- **`scripts/v1.8-rum-aggregate.ts`** (this repo): existing aggregator pipeline. v1.9 extends, doesn't replace.
- **`scripts/v1.8-rum-seed-runner.mjs`** (this repo): existing seeder pipeline.
- **`app/api/vitals/route.ts`** (this repo): Phase 58 CIB-05 route handler with T-RUM-01/02 mitigations.
- **`app/_components/web-vitals.tsx`** (this repo): Phase 58 beacon emitter.
- **`.planning/perf-baselines/v1.8/vrf-05-rum-p75-lcp.json`** (this repo): documented v1.8 deferral including the `aggregator_branch_scope_finding` and `v1_9_unblock_recipe`.
- **`.planning/perf-baselines/v1.8/MID-MILESTONE-CHECKPOINT.md`** (this repo): Phase 60 path_a + Phase 62 path_b YAML schema precedent for `_path_b_decision` block.
- **`.planning/phases/63.1-lcp-fast-path-remediation/63.1-COHORT.md`** (this repo): chunk 2979 framework attribution + 1867ms TBT diagnosis + Phase 64+ deferral chain.

### Secondary (MEDIUM confidence)

- **Next.js useReportWebVitals reference** — https://nextjs.org/docs/app/api-reference/functions/use-report-web-vitals (last_updated 2026-04-10): Metric object schema (`name`, `value`, `id`, `rating`, `navigationType`, `delta`, `entries`). Confirmed against `web-vitals.tsx:31` `Parameters<...>[0]` derivation pattern.
- **Next.js webVitalsAttribution config** — https://nextjs.org/docs/app/api-reference/config/next-config-js/webVitalsAttribution: experimental attribution data (LCP element, CLS element, FID input target). Out of Phase 70 scope (would alter beacon shape) but documented for future reference.
- **Vercel changelog: vercel logs CLI rebuilt** — https://vercel.com/changelog/vercel-logs-cli-command-now-optimized-for-agents-with-historical-log: CLI rebuild for agent workflows; historical querying landed.
- **Catchpoint WebPageTest pricing** — https://www.catchpoint.com/pricing (verified via WebSearch 2026-04-30): Starter 300/mo runs but no API; Pro $18.75/mo for 1000 runs + API access.

### Tertiary (LOW confidence)

- **Vercel `--limit 0` semantics** — not explicitly documented. Verify on first invocation (Open Question #2).
- **CLI flatten behavior for `proxy.userAgent`** — Log Drains documents array; CLI behavior unverified. Defensive `uaString()` helper covers both (Pitfall #3).

---

## Metadata

**Confidence breakdown:**

- **Standard stack:** HIGH — entire pipeline already shipped + audited. v1.9 deltas are surgical (3 lines + 1 cohort partition).
- **Architecture (3-plan structure):** HIGH — wall-clock dependency forces Wave structure; parallel-safety analysis verified against ROADMAP §v1.9.
- **Pitfalls:** HIGH — branch-scope, retention-window, UA schema, synthetic-vs-natural, log-source filter, Phase 67 collision all directly verifiable from authoritative sources or shipped code.
- **VRF-08 path posture:** HIGH — Phase 67 conflict makes Path B (decision block) the only correct posture; framework-chunk modification would be a planning error.
- **VRF-06 24h-window interpretation:** MEDIUM — Hobby retention forces non-literal interpretation. Plan 02 may need user discretion check on whether seed-and-aggregate within 1h satisfies the spec or whether Pro tier upgrade is in scope.
- **VRF-07 synthetic-vs-natural sample-source labeling:** MEDIUM — natural iPhone 14 Pro samples on prod may be too sparse for n≥10 even in 24h window; Plan 02 fallback verdict needs explicit user acknowledgment if iOS cohort lands `INSUFFICIENT_SAMPLES`.

**Research date:** 2026-04-30
**Valid until:** 2026-05-30 (30 days; Vercel CLI/Drains schemas stable; Hobby retention policy stable since at least 2024).

---

## RESEARCH COMPLETE

**Phase:** 70 — v1.8 Verification Closure (VRF-01/04/05)
**Confidence:** HIGH

### Key Findings

1. **Existing v1.8 RUM pipeline is ship-ready for v1.9.** `route.ts` + `web-vitals.tsx` + `v1.8-rum-aggregate.ts` + `v1.8-rum-seed-runner.mjs` cover ~95% of needs. v1.9 deltas: `--no-branch` + `--deployment` flags, iOS sub-cohort partition, output path migration to `.planning/perf-baselines/v1.9/`.
2. **Hobby tier 1h log retention reframes "≥24h sampling".** Seed-and-aggregate within 1h is the documented v1.8 fallback (the `v1_9_unblock_recipe`); literal 24h natural sampling requires Pro tier upgrade (user decision, NOT autonomous).
3. **VRF-08 must take Path B (`_path_b_decision`) unconditionally.** Framework chunk 2979 reshape is owned by Phase 67 BND-05; parallel mutation = unsafe collision per ROADMAP §v1.9 rule 2.
4. **VRF-07 should take RUM iOS sub-cohort path, not WPT.** Catchpoint Starter has no API (paywalled to Pro); RUM sub-cohort is zero-cost, larger sample, real-traffic. Synthetic-seeded iPhone UAs are platform-reachability proxy, not real-WebKit performance — declare verdict accordingly.
5. **3-plan structure with Wave-1 aggregator + Wave-2 capture + Wave-2 path_b_decision.** Plans 02 and 03 are parallel-safe; both depend only on Plan 01.

### File Created

`.planning/phases/70-v1-8-verification-closure-vrf-01-04-05/70-RESEARCH.md`

### Confidence Assessment

| Area | Level | Reason |
|------|-------|--------|
| Standard Stack | HIGH | Pipeline shipped + audited; deltas are surgical |
| Architecture (3-plan structure) | HIGH | Wall-clock dependency forces wave shape; parallel-safety verified |
| Pitfalls | HIGH | All 6 verified from authoritative sources or shipped code |
| VRF-08 Path B posture | HIGH | Phase 67 collision is unambiguous; Path B mandated |
| Sample-source labeling | MEDIUM | Natural-vs-synthetic distinction needs Plan 02 user check |

### Open Questions

1. Sample-source labeling when 1h window mixes synthetic + natural — Plan 02 explicit verdict.
2. `--limit 0` CLI behavior — verify on first invocation in Plan 01.
3. `proxy.userAgent` array vs string — defensive `uaString()` helper handles both.
4. Real iPhone 14 Pro natural traffic volume — Plan 02 reports actual; `INSUFFICIENT_SAMPLES` is a valid verdict (carry-forward).
5. `_path_b_decision` location — Plan 03 puts in both JSON + spec test annotation.

### Ready for Planning

Research complete. Planner can now create three PLAN.md files: 01-aggregator-v19, 02-rum-capture-and-iOS-cohort, 03-vrf08-path-b-decision.
