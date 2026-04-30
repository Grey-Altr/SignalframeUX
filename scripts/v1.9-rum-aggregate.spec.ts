/**
 * scripts/v1.9-rum-aggregate.spec.ts — Phase 70 Plan 01 unit suite.
 *
 * Asserts the four contracts that Plan 70-01 imposes on the v1.9 RUM
 * aggregator:
 *   1. uaString(): polymorphic parser handling array (Drains schema) and
 *      string (CLI flatten) UA shapes; returns "" on undefined / null /
 *      empty array. Mitigates Pitfall #3 (UA schema drift).
 *   2. isIosCohort(): regex partition that matches iPhone OS 15+ AND
 *      Mobile/15E* build family. Returns true for fixture line 1
 *      (iPhone 14 Pro UA), false for lines 2/3/4 (Pixel 7, desktop, Moto G).
 *   3. buildVercelLogsArgv(): emits an argv array containing literal
 *      '--no-branch' AND '--deployment <url>' as adjacent pair. Mitigates
 *      T-RUM-03 (branch-scope coupling per memory feedback_vercel_logs_branch_scope).
 *   4. buildOutput(): produces output JSON with all required schema keys
 *      including the v1.9-new vrf_07_ios_cohort.verdict surface.
 *
 * Fixture: tests/fixtures/v1.9-rum-log-line.jsonl (4 lines covering the
 * iPhone / Android / desktop / Moto G UAs).
 *
 * Note: this spec imports from `./v1.9-rum-aggregate` which Plan 70-01
 * Task 3 creates. Running this spec BEFORE Task 3 lands intentionally
 * yields module-resolution failure (RED state — the precondition for
 * the TDD GREEN cycle in Task 3).
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  uaString,
  isIosCohort,
  buildVercelLogsArgv,
  buildOutput,
} from "./v1.9-rum-aggregate";

const FIXTURE_PATH = resolve(
  __dirname,
  "..",
  "tests",
  "fixtures",
  "v1.9-rum-log-line.jsonl",
);
const fixtureLines: Array<{
  timestamp: number;
  path: string;
  message: string;
  proxy: { userAgent: string; region: string };
}> = readFileSync(FIXTURE_PATH, "utf8")
  .trim()
  .split("\n")
  .map((l) => JSON.parse(l));

describe("uaString", () => {
  it("returns first element of array shape (Vercel Drains)", () => {
    expect(uaString(["Mozilla/foo"])).toBe("Mozilla/foo");
  });
  it("returns string passthrough (vercel logs --json CLI flatten)", () => {
    expect(uaString("Mozilla/bar")).toBe("Mozilla/bar");
  });
  it("returns empty string for undefined", () => {
    expect(uaString(undefined)).toBe("");
  });
  it("returns empty string for null", () => {
    expect(uaString(null)).toBe("");
  });
  it("returns empty string for empty array", () => {
    expect(uaString([])).toBe("");
  });
  it("returns empty string for non-string array element", () => {
    expect(uaString([42])).toBe("");
  });
});

describe("isIosCohort", () => {
  it("matches iPhone 14 Pro UA from fixture line 1 (iPhone OS 17 + Mobile/15E148)", () => {
    const ua = fixtureLines[0].proxy.userAgent;
    expect(isIosCohort(ua)).toBe(true);
  });
  it("rejects Pixel 7 Android Chrome UA from fixture line 2", () => {
    const ua = fixtureLines[1].proxy.userAgent;
    expect(isIosCohort(ua)).toBe(false);
  });
  it("rejects desktop macOS Chrome UA from fixture line 3", () => {
    const ua = fixtureLines[2].proxy.userAgent;
    expect(isIosCohort(ua)).toBe(false);
  });
  it("rejects Moto G Power Android Chrome UA from fixture line 4", () => {
    const ua = fixtureLines[3].proxy.userAgent;
    expect(isIosCohort(ua)).toBe(false);
  });
});

describe("buildVercelLogsArgv (no-branch + deployment)", () => {
  it("includes --no-branch in argv (T-RUM-03 mitigation)", () => {
    const argv = buildVercelLogsArgv({
      since: "70m",
      deployment: "https://signalframeux.vercel.app",
      environment: "production",
    });
    expect(argv).toContain("--no-branch");
  });
  it("includes --deployment <url> as adjacent pair", () => {
    const argv = buildVercelLogsArgv({
      since: "70m",
      deployment: "https://signalframeux.vercel.app",
      environment: "production",
    });
    const idx = argv.indexOf("--deployment");
    expect(idx).toBeGreaterThan(-1);
    expect(argv[idx + 1]).toBe("https://signalframeux.vercel.app");
  });
  it("includes --since <duration> as adjacent pair", () => {
    const argv = buildVercelLogsArgv({
      since: "70m",
      deployment: "https://signalframeux.vercel.app",
      environment: "production",
    });
    const idx = argv.indexOf("--since");
    expect(idx).toBeGreaterThan(-1);
    expect(argv[idx + 1]).toBe("70m");
  });
  it("includes --environment production as adjacent pair", () => {
    const argv = buildVercelLogsArgv({
      since: "70m",
      deployment: "https://signalframeux.vercel.app",
      environment: "production",
    });
    const idx = argv.indexOf("--environment");
    expect(idx).toBeGreaterThan(-1);
    expect(argv[idx + 1]).toBe("production");
  });
  it("first element is the 'logs' subcommand", () => {
    const argv = buildVercelLogsArgv({
      since: "70m",
      deployment: "https://signalframeux.vercel.app",
      environment: "production",
    });
    expect(argv[0]).toBe("logs");
  });
});

describe("buildOutput (schema)", () => {
  it("emits all required top-level keys (zero samples → empty windows)", () => {
    const out = buildOutput([], {
      windowStart: "2026-04-30T00:00:00Z",
      sampleSource: "synthetic-seeded",
    });
    expect(out).toHaveProperty("capturedAt");
    expect(out).toHaveProperty("window_start");
    expect(out).toHaveProperty("window_end");
    expect(out).toHaveProperty("sample_count");
    expect(out).toHaveProperty("sample_count_lcp");
    expect(out).toHaveProperty("by_metric.LCP");
    expect(out).toHaveProperty("by_metric.CLS");
    expect(out).toHaveProperty("by_metric.INP");
    expect(out).toHaveProperty("by_metric.TTFB");
    expect(out).toHaveProperty("by_metric.FCP");
    expect(out).toHaveProperty("by_viewport.mobile");
    expect(out).toHaveProperty("by_viewport.desktop");
    expect(out).toHaveProperty("vrf_07_ios_cohort.count");
    expect(out).toHaveProperty("vrf_07_ios_cohort.count_lcp");
    expect(out).toHaveProperty("vrf_07_ios_cohort.median_lcp_ms");
    expect(out).toHaveProperty("vrf_07_ios_cohort.p75_lcp_ms");
    expect(out).toHaveProperty("vrf_07_ios_cohort.threshold_median_ms");
    expect(out).toHaveProperty("vrf_07_ios_cohort.verdict");
    expect(out).toHaveProperty("thresholds.p75_lcp_ms_max");
    expect(out).toHaveProperty("thresholds.sample_count_min");
    expect(out).toHaveProperty("sample_source");
    expect(out).toHaveProperty("verdict");
  });
  it("vrf_07_ios_cohort.verdict is INSUFFICIENT_SAMPLES when count<10", () => {
    const out = buildOutput([], {
      windowStart: null,
      sampleSource: "synthetic-seeded",
    });
    expect(out.vrf_07_ios_cohort.verdict).toBe("INSUFFICIENT_SAMPLES");
  });
  it("vrf_07_ios_cohort.threshold_median_ms is locked to 2000", () => {
    const out = buildOutput([], {
      windowStart: null,
      sampleSource: "synthetic-seeded",
    });
    expect(out.vrf_07_ios_cohort.threshold_median_ms).toBe(2000);
  });
  it("thresholds.p75_lcp_ms_max is 1000 (VRF-06 contract)", () => {
    const out = buildOutput([], {
      windowStart: null,
      sampleSource: "natural",
    });
    expect(out.thresholds.p75_lcp_ms_max).toBe(1000);
  });
  it("thresholds.sample_count_min is 100 (VRF-06 contract)", () => {
    const out = buildOutput([], {
      windowStart: null,
      sampleSource: "natural",
    });
    expect(out.thresholds.sample_count_min).toBe(100);
  });
  it("verdict is FAIL_OR_INSUFFICIENT when sample_count_lcp < 100", () => {
    const out = buildOutput([], {
      windowStart: null,
      sampleSource: "natural",
    });
    expect(out.verdict).toBe("FAIL_OR_INSUFFICIENT");
  });
  it("sample_source is passed through verbatim", () => {
    const out = buildOutput([], {
      windowStart: null,
      sampleSource: "mixed",
    });
    expect(out.sample_source).toBe("mixed");
  });
});
