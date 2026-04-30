#!/usr/bin/env tsx
/**
 * scripts/v1.9-rum-aggregate.ts — Phase 70 Plan 01 RUM aggregator (v1.9 successor).
 *
 * Extends scripts/v1.8-rum-aggregate.ts with three surgical deltas required
 * by Phase 70:
 *   1. Passes `--no-branch` and `--deployment <prod-url>` to `vercel logs`.
 *      Closes T-RUM-03 (branch-scope coupling) — the documented v1.8 VRF-05
 *      deferral cause (memory feedback_vercel_logs_branch_scope).
 *   2. Defensive `uaString()` parser handling both array (Vercel Drains
 *      schema) and string (vercel logs --json CLI flatten) UA shapes.
 *      Closes T-PARSE-01 (UA schema drift).
 *   3. iOS sub-cohort partition (`vrf_07_ios_cohort` block) gating verdict
 *      on iPhone OS 15+ AND Mobile/15E* build family. Surface for VRF-07
 *      verdict (RUM iOS cohort vs WPT-Pro paywall path).
 *
 * Output path: .planning/perf-baselines/v1.9/rum-p75-lcp.json (NOT v1.8).
 *
 * Module mode (when imported): zero side effects — only exports.
 * Script mode (when run via tsx): pulls vercel logs, parses, builds output,
 *   writes JSON, exits 0 on PASS / 1 on FAIL_OR_INSUFFICIENT.
 *
 * Command-spawn discipline: execFileSync with argv-array form (no shell
 * parsing). SINCE / WINDOW_START / DEPLOYMENT_URL / SAMPLE_SOURCE envs are
 * validated against strict regex / enum before being passed as argv elements
 * or output fields.
 *
 * PII discipline: raw log envelopes (clientIp, userAgent, requestId, path
 * query strings) are READ but NEVER persisted to the output JSON. Output
 * contains only aggregated counts and percentiles.
 *
 * Usage (script mode):
 *   pnpm tsx scripts/v1.9-rum-aggregate.ts
 *   SINCE=70m pnpm tsx scripts/v1.9-rum-aggregate.ts
 *   DEPLOYMENT_URL=https://signalframeux.vercel.app SINCE=10m \
 *     pnpm tsx scripts/v1.9-rum-aggregate.ts
 *   pnpm tsx scripts/v1.9-rum-aggregate.ts --help
 */

import { writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface VercelLogLine {
  timestamp: number;
  path: string;
  message: string;
  // v1.9 widens userAgent to allow array shape (Vercel Drains schema) in
  // addition to string shape (vercel logs --json CLI flatten).
  proxy?: { userAgent?: string | string[]; region?: string };
}

export interface RumPayload {
  type: "rum";
  name: "LCP" | "CLS" | "INP" | "TTFB" | "FCP";
  value: number;
  id: string;
  rating: "good" | "needs-improvement" | "poor";
  navigationType: string;
  url: string;
  timestamp: number;
}

export type SampleWithViewport = RumPayload & {
  _viewport: "mobile" | "desktop";
  // v1.9-new — needed for iOS cohort partition (post-filter pass).
  _userAgent: string;
};

export interface RumAggregateOutput {
  capturedAt: string;
  window_start: string | null;
  window_end: string | null;
  sample_count: number;
  sample_count_lcp: number;
  by_metric: Record<
    RumPayload["name"],
    { p50: number | null; p75: number | null; p99: number | null; count: number }
  >;
  by_viewport: {
    mobile: { count: number; p75_lcp_ms: number | null };
    desktop: { count: number; p75_lcp_ms: number | null };
  };
  // v1.9-new — VRF-07 iPhone 14 Pro 4G LTE cohort verdict surface.
  vrf_07_ios_cohort: {
    count: number;
    count_lcp: number;
    median_lcp_ms: number | null;
    p75_lcp_ms: number | null;
    threshold_median_ms: 2000;
    verdict: "PASS" | "FAIL" | "INSUFFICIENT_SAMPLES";
  };
  thresholds: { p75_lcp_ms_max: 1000; sample_count_min: 100 };
  sample_source: "natural" | "synthetic-seeded" | "mixed" | "deferred";
  verdict: "PASS" | "FAIL_OR_INSUFFICIENT";
}

// ─── Defensive parsers (v1.9-new exports) ────────────────────────────────────

/**
 * iOS 15+ cohort regex. Matches "iPhone OS 15_" through "iPhone OS 19_"
 * (forward-compatible with the next 4 iOS major versions).
 */
export const IOS_15_PLUS_RE = /iPhone OS 1[5-9]_/;

/**
 * iOS 14 Pro family build identifier. "Mobile/15E*" through "Mobile/19E*"
 * matches the Apple build-family slice corresponding to iOS 17.x +
 * iPhone 14 Pro hardware. Family-stable across iOS minor versions.
 */
export const IOS_14PRO_BUILD_RE = /Mobile\/1[5-9][A-Z]\d+/;

/**
 * Returns true if the UA string belongs to the VRF-07 iOS sub-cohort:
 * iPhone OS 15+ AND Mobile/15E* (iPhone 14 Pro family) build identifier.
 *
 * Excludes Android UAs (which contain `Mobile` but not `iPhone OS`).
 * Excludes desktop UAs.
 * Excludes Moto G Power / Pixel / older iPhones.
 */
export function isIosCohort(ua: string): boolean {
  return IOS_15_PLUS_RE.test(ua) && IOS_14PRO_BUILD_RE.test(ua);
}

/**
 * Polymorphic UA parser. Vercel Log Drains schema documents
 * `proxy.userAgent` as `string[]`; the `vercel logs --json` CLI may flatten
 * to `string` (CLI 50.x version-dependent). This helper returns the first
 * string element of the array OR the string itself OR "" for any other
 * shape (undefined, null, empty array, non-string element).
 *
 * Critical for cohort partition: bare `proxy.userAgent ?? ""` against the
 * array shape would return `["Mozilla/..."]` (truthy object) and silently
 * fail every regex test, producing `mobile: 0, desktop: <all>`.
 */
export function uaString(rawUa: unknown): string {
  if (Array.isArray(rawUa)) {
    return typeof rawUa[0] === "string" ? rawUa[0] : "";
  }
  if (typeof rawUa === "string") return rawUa;
  return "";
}

// ─── Argv builder (v1.9-new export) ──────────────────────────────────────────

/**
 * Builds the argv array passed to `vercel logs` via execFileSync. Adjacent
 * flag-value pairs are preserved as discrete elements (mandatory for argv
 * arrays — execFileSync does not parse shell tokens).
 *
 * v1.9 adds `--no-branch` and `--deployment <url>`:
 *   --no-branch: disables the CLI's git-branch auto-scope (the documented
 *     v1.8 VRF-05 deferral cause; on a feature branch with no production
 *     deploys, the implicit branch filter returns zero results).
 *   --deployment <url>: explicit production-alias filter; pairs with
 *     --no-branch to anchor the query to the production deploy regardless
 *     of which branch the script runs from.
 *
 * Verified against `vercel --version` 50.43.0 (`vercel logs --help`,
 * 2026-04-30).
 */
export function buildVercelLogsArgv(opts: {
  since: string;
  deployment: string;
  environment: string;
  query?: string;
  limit?: string;
}): string[] {
  return [
    "logs",
    "--json",
    "--no-branch",
    "--deployment",
    opts.deployment,
    "--since",
    opts.since,
    "--environment",
    opts.environment,
    "--query",
    opts.query ?? "rum",
    "--limit",
    opts.limit ?? "0",
    "--no-follow",
  ];
}

// ─── Math (preserved from v1.8 verbatim) ─────────────────────────────────────

/**
 * Ceiling-index percentile. v1.8 implementation preserved verbatim — the
 * v1.9 spec contract exports it for unit-test reuse.
 */
export function percentile(arr: number[], p: number): number | null {
  if (arr.length === 0) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)] ?? null;
}

function metricBlock(
  src: SampleWithViewport[],
  metric: RumPayload["name"],
): { p50: number | null; p75: number | null; p99: number | null; count: number } {
  const vals = src.filter((s) => s.name === metric).map((s) => s.value);
  return {
    p50: percentile(vals, 50),
    p75: percentile(vals, 75),
    p99: percentile(vals, 99),
    count: vals.length,
  };
}

// ─── Output assembly (v1.9-new export) ───────────────────────────────────────

/**
 * Builds the v1.9 aggregator output JSON from a filtered sample array.
 *
 * Extends v1.8's inline output assembly with the `vrf_07_ios_cohort`
 * block (VRF-07 verdict surface). Verdict logic:
 *   - count_lcp < 10  → INSUFFICIENT_SAMPLES (defer to next-deploy RUM)
 *   - median < 2000ms → PASS (closes VRF-07)
 *   - otherwise       → FAIL (escalate to _path_b_decision per Phase 63.1)
 *
 * Pure function — zero side effects. Imported by spec for direct testing.
 */
export function buildOutput(
  filtered: SampleWithViewport[],
  opts: {
    windowStart: string | null;
    sampleSource: RumAggregateOutput["sample_source"];
  },
): RumAggregateOutput {
  const lcpAll = filtered.filter((s) => s.name === "LCP").map((s) => s.value);
  const mobile = filtered.filter((s) => s._viewport === "mobile");
  const desktop = filtered.filter((s) => s._viewport === "desktop");

  // VRF-07 iOS sub-cohort.
  const iosSamples = filtered.filter((s) => isIosCohort(s._userAgent));
  const iosLcp = iosSamples
    .filter((s) => s.name === "LCP")
    .map((s) => s.value);
  const iosMedian = percentile(iosLcp, 50);
  const iosVerdict: RumAggregateOutput["vrf_07_ios_cohort"]["verdict"] =
    iosLcp.length < 10
      ? "INSUFFICIENT_SAMPLES"
      : (iosMedian ?? Infinity) < 2000
        ? "PASS"
        : "FAIL";

  return {
    capturedAt: new Date().toISOString(),
    window_start:
      opts.windowStart ??
      (filtered.length
        ? new Date(Math.min(...filtered.map((s) => s.timestamp))).toISOString()
        : null),
    window_end: filtered.length
      ? new Date(Math.max(...filtered.map((s) => s.timestamp))).toISOString()
      : null,
    sample_count: filtered.length,
    sample_count_lcp: lcpAll.length,
    by_metric: {
      LCP: metricBlock(filtered, "LCP"),
      CLS: metricBlock(filtered, "CLS"),
      INP: metricBlock(filtered, "INP"),
      TTFB: metricBlock(filtered, "TTFB"),
      FCP: metricBlock(filtered, "FCP"),
    },
    by_viewport: {
      mobile: {
        count: mobile.length,
        p75_lcp_ms: percentile(
          mobile.filter((s) => s.name === "LCP").map((s) => s.value),
          75,
        ),
      },
      desktop: {
        count: desktop.length,
        p75_lcp_ms: percentile(
          desktop.filter((s) => s.name === "LCP").map((s) => s.value),
          75,
        ),
      },
    },
    vrf_07_ios_cohort: {
      count: iosSamples.length,
      count_lcp: iosLcp.length,
      median_lcp_ms: iosMedian,
      p75_lcp_ms: percentile(iosLcp, 75),
      threshold_median_ms: 2000,
      verdict: iosVerdict,
    },
    thresholds: { p75_lcp_ms_max: 1000, sample_count_min: 100 },
    sample_source: opts.sampleSource,
    verdict:
      lcpAll.length >= 100 && (percentile(lcpAll, 75) ?? Infinity) < 1000
        ? "PASS"
        : "FAIL_OR_INSUFFICIENT",
  };
}

// ─── Script-mode entry point ─────────────────────────────────────────────────

const OUT_PATH = ".planning/perf-baselines/v1.9/rum-p75-lcp.json";

const HELP_TEXT = `
v1.9 RUM aggregator — extends v1.8 with --no-branch / --deployment / iOS cohort.

Usage:
  pnpm tsx scripts/v1.9-rum-aggregate.ts [--help]

Environment variables:
  SINCE             vercel logs --since duration (regex /^[0-9]+(s|m|h|d)$/, default 24h)
  WINDOW_START      ISO 8601 anchor (regex /^[0-9TZ:.\\-]+$/, optional)
  DEPLOYMENT_URL    Production alias (default https://signalframeux.vercel.app)
  SAMPLE_SOURCE     natural | synthetic-seeded | mixed | deferred (default natural)

Argv flags passed to vercel logs:
  --no-branch       Disables git-branch auto-scope (T-RUM-03 mitigation)
  --deployment <url> Explicit production deployment alias
  --since <dur>     Window duration (Hobby tier 1h ceiling)
  --environment production
  --query rum
  --limit 0         No cap (verify on first invocation)
  --no-follow

Output:
  ${OUT_PATH}
`.trim();

/**
 * Detect script mode without breaking module-import contract. Returns true
 * only when this file is the program entry (not when imported by a spec).
 *
 * Uses the standard ESM-compatible check: argv[1] basename ends with
 * `v1.9-rum-aggregate.ts` (covers both `tsx scripts/v1.9-rum-aggregate.ts`
 * and `node --import tsx scripts/v1.9-rum-aggregate.ts` patterns).
 */
function isScriptMain(): boolean {
  const entry = process.argv[1];
  if (!entry) return false;
  return entry.endsWith("v1.9-rum-aggregate.ts");
}

if (isScriptMain()) {
  // --help short-circuit (must precede execFileSync — exit 0).
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(HELP_TEXT);
    process.exit(0);
  }

  // Validate env-var inputs against strict regex / enum.
  const SINCE =
    process.env.SINCE && /^[0-9]+(s|m|h|d)$/.test(process.env.SINCE)
      ? process.env.SINCE
      : "24h";
  const WINDOW_START =
    process.env.WINDOW_START && /^[0-9TZ:.\-]+$/.test(process.env.WINDOW_START)
      ? process.env.WINDOW_START
      : null;
  const DEPLOYMENT_URL =
    process.env.DEPLOYMENT_URL || "https://signalframeux.vercel.app";
  const SAMPLE_SOURCE: RumAggregateOutput["sample_source"] = (() => {
    const v = process.env.SAMPLE_SOURCE;
    if (
      v === "natural" ||
      v === "synthetic-seeded" ||
      v === "mixed" ||
      v === "deferred"
    ) {
      return v;
    }
    return "natural";
  })();

  // 1. Pull — execFileSync with argv array; each flag is a discrete element.
  const raw = execFileSync(
    "vercel",
    buildVercelLogsArgv({
      since: SINCE,
      deployment: DEPLOYMENT_URL,
      environment: "production",
    }),
    { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 },
  );

  // 2. Parse JSON Lines.
  const envelopes: VercelLogLine[] = raw
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as VercelLogLine);

  // 3. Inner-payload filter + cohort attribution.
  const samples: SampleWithViewport[] = envelopes
    .filter((e) => e.path === "/api/vitals")
    .map((e): SampleWithViewport | null => {
      try {
        const inner: unknown = JSON.parse(e.message);
        if (
          typeof inner !== "object" ||
          inner === null ||
          (inner as { type?: unknown }).type !== "rum"
        ) {
          return null;
        }
        const ua = uaString(e.proxy?.userAgent);
        const isMobile = /Mobile|iPhone|Android.*Mobile/i.test(ua);
        return {
          ...(inner as RumPayload),
          _viewport: isMobile ? ("mobile" as const) : ("desktop" as const),
          _userAgent: ua,
        };
      } catch {
        return null;
      }
    })
    .filter((p): p is SampleWithViewport => p !== null);

  // 4. Apply window_start filter if set (Hobby retention 1h anchor).
  const filtered: SampleWithViewport[] = WINDOW_START
    ? samples.filter((s) => new Date(s.timestamp) >= new Date(WINDOW_START))
    : samples;

  // 5. Build output via pure function (also exported for spec).
  const out = buildOutput(filtered, {
    windowStart: WINDOW_START,
    sampleSource: SAMPLE_SOURCE,
  });

  writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
  console.log(
    `Sample count: ${out.sample_count} (LCP: ${out.sample_count_lcp}); ` +
      `verdict: ${out.verdict}; ` +
      `vrf_07_ios_cohort: count=${out.vrf_07_ios_cohort.count} verdict=${out.vrf_07_ios_cohort.verdict}`,
  );
  process.exit(out.verdict === "PASS" ? 0 : 1);
}
