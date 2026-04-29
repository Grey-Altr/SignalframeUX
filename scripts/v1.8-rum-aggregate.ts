#!/usr/bin/env tsx
/**
 * scripts/v1.8-rum-aggregate.ts — Phase 62 VRF-05 RUM aggregator.
 *
 * Reads vercel logs --json, filters /api/vitals POST entries, computes
 * per-metric percentiles, writes vrf-05-rum-p75-lcp.json. Zero new
 * runtime dep; devDep tooling only.
 *
 * Command-spawn discipline: uses execFileSync with argv-array form
 * (no shell parsing), per repo policy and matching scripts/consumer-test.ts +
 * scripts/measure-anton-descriptors.mjs precedent. SINCE / WINDOW_START envs
 * are validated against strict regex before being passed as argv elements.
 *
 * PII discipline: raw log envelopes (clientIp, userAgent, requestId,
 * path query strings) are READ but NEVER persisted to the output JSON.
 * Output contains only aggregated counts and percentiles.
 *
 * Usage:
 *   pnpm tsx scripts/v1.8-rum-aggregate.ts
 *   SINCE=24h pnpm tsx scripts/v1.8-rum-aggregate.ts
 *   WINDOW_START="2026-04-28T15:00:00Z" pnpm tsx scripts/v1.8-rum-aggregate.ts
 */

import { writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

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

const OUT_PATH = ".planning/perf-baselines/v1.8/vrf-05-rum-p75-lcp.json";

// Validate env-var inputs against strict regex.
const SINCE =
  process.env.SINCE && /^[0-9]+(s|m|h|d)$/.test(process.env.SINCE)
    ? process.env.SINCE
    : "24h";
const WINDOW_START =
  process.env.WINDOW_START && /^[0-9TZ:.\-]+$/.test(process.env.WINDOW_START)
    ? process.env.WINDOW_START
    : null;

// 1. Pull — execFileSync with argv array; each flag is a discrete element.
const raw = execFileSync(
  "vercel",
  [
    "logs",
    "--json",
    "--since",
    SINCE,
    "--environment",
    "production",
    "--query",
    "rum",
    "--limit",
    "0",
    "--no-follow",
  ],
  { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 },
);

// 2. Parse JSON Lines
const envelopes: VercelLogLine[] = raw
  .trim()
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line));

// 3. Inner-payload filter — note: ONLY pull what we need; do NOT retain raw envelope
type SampleWithViewport = RumPayload & { _viewport: "mobile" | "desktop" };
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
      const ua = e.proxy?.userAgent ?? "";
      const isMobile = /Mobile|iPhone|Android.*Mobile/i.test(ua);
      return {
        ...(inner as RumPayload),
        _viewport: isMobile ? ("mobile" as const) : ("desktop" as const),
      };
    } catch {
      return null;
    }
  })
  .filter((p): p is SampleWithViewport => p !== null);

// 4. Apply window_start filter if set (Pitfall — 24h anchor at deploy completion)
const filtered: SampleWithViewport[] = WINDOW_START
  ? samples.filter((s) => new Date(s.timestamp) >= new Date(WINDOW_START))
  : samples;

// 5. Per-metric percentile compute
function percentile(arr: number[], p: number): number | null {
  if (arr.length === 0) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
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

const lcpAll = filtered.filter((s) => s.name === "LCP").map((s) => s.value);
const mobile = filtered.filter((s) => s._viewport === "mobile");
const desktop = filtered.filter((s) => s._viewport === "desktop");

// 6. Sample source — Pitfall — natural/synthetic-seeded/mixed
const sampleSource: "natural" | "synthetic-seeded" | "mixed" = "natural";

// 7. Build output — raw envelopes INTENTIONALLY OMITTED (PII protection)
const out = {
  capturedAt: new Date().toISOString(),
  window_start:
    WINDOW_START ??
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
  thresholds: { p75_lcp_ms_max: 1000, sample_count_min: 100 },
  sample_source: sampleSource,
  verdict:
    lcpAll.length >= 100 && (percentile(lcpAll, 75) ?? Infinity) < 1000
      ? "PASS"
      : "FAIL_OR_INSUFFICIENT",
};

writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
console.log(
  `Sample count: ${out.sample_count} (LCP: ${out.sample_count_lcp}); verdict: ${out.verdict}`,
);
process.exit(out.verdict === "PASS" ? 0 : 1);
