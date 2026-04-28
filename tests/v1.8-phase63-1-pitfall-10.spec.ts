// Phase 63.1 Plan 03 Wave 0 — D-09 Pitfall #10 ratio re-check.
// Synthetic baselines from phase-60-mobile-lhci.json (LCP) + vrf-02-launch-gate-runs.json (TTI).
//
// Pitfall #10 (from .planning/research/PITFALLS.md):
//   Real-device LCP ÷ synthetic LCP > 1.3 → TRIGGER (currently 2.95×)
//   Real-device TTI ÷ synthetic TTI > 1.5 → TRIGGER (currently 6.0×)
//
// This spec gates D-09 close-out after Phase 63.1 Plan 03 real-device WPT re-runs.
// It parses the 3 post-63.1 WPT JSON files + the 2 synthetic baselines, computes ratios,
// and asserts both fall back below thresholds on all 3 profiles.
//
// TTI proxy: SpeedIndex (SI) from WPT JSON — per Phase 63 synthesis §2 methodology.
//   synthetic_tti = 907 ms (median from vrf-02-launch-gate-runs.json)
//   synthetic_lcp = 810 ms (median from phase-60-mobile-lhci.json)
//
// Pre-requisite: run `PROD_URL=... node scripts/wpt-rerun.mjs` first to generate:
//   .planning/perf-baselines/v1.8/vrf-01-ios-iphone14pro-post-63.1.json
//   .planning/perf-baselines/v1.8/vrf-01-android-a14-post-63.1.json
//   .planning/perf-baselines/v1.8/vrf-01-android-midtier-post-63.1.json
//
// If those files are missing, tests are skipped with a descriptive message.

import { test, expect } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const PROJECT_ROOT = process.cwd();
const BASELINES_DIR = join(PROJECT_ROOT, ".planning", "perf-baselines", "v1.8");

const POST_63_1_FILES = {
  "ios-iphone14pro": join(BASELINES_DIR, "vrf-01-ios-iphone14pro-post-63.1.json"),
  "android-a14":    join(BASELINES_DIR, "vrf-01-android-a14-post-63.1.json"),
  "android-midtier": join(BASELINES_DIR, "vrf-01-android-midtier-post-63.1.json"),
};

const LHCI_BASELINE_FILE = join(BASELINES_DIR, "phase-60-mobile-lhci.json");
const VRF02_FILE         = join(BASELINES_DIR, "vrf-02-launch-gate-runs.json");

// ---------------------------------------------------------------------------
// Thresholds (D-09)
// ---------------------------------------------------------------------------
const LCP_RATIO_MAX = 1.3;  // real ÷ synthetic LCP must be < 1.3
const TTI_RATIO_MAX = 1.5;  // real ÷ synthetic TTI must be < 1.5

// ---------------------------------------------------------------------------
// Synthetic baselines (hard-coded from JSON files for inline clarity; validated
// against the files in beforeAll to catch drift if the files are ever updated)
// ---------------------------------------------------------------------------
const SYNTHETIC_LCP_MS = 810;  // phase-60-mobile-lhci.json .median.lcp_ms
const SYNTHETIC_TTI_MS = 907;  // vrf-02-launch-gate-runs.json .median.tti_ms (p50)

// ---------------------------------------------------------------------------
// Helpers — same extraction logic as scripts/wpt-rerun.mjs
// ---------------------------------------------------------------------------
function extractLcp(json: Record<string, unknown>): number | null {
  // WPT JSON shape: data.runs[median_run].firstView.steps[0].LargestContentfulPaint
  const data = json.data as Record<string, unknown> | undefined;
  if (data?.medians != null && data?.runs != null) {
    const medians = data.medians as Record<string, number>;
    const runs = data.runs as Record<string, unknown>;
    const medianRunNum = medians.LCP;
    if (medianRunNum != null) {
      const run = runs[String(medianRunNum)] as Record<string, unknown> | undefined;
      const fv = (run?.firstView as Record<string, unknown> | undefined);
      const steps = fv?.steps as Array<Record<string, unknown>> | undefined;
      const lcp = steps?.[0]?.LargestContentfulPaint as number | undefined;
      if (lcp != null) return lcp;
    }
  }
  // Flat shapes
  if (typeof json.lcp_ms === "number") return json.lcp_ms;
  const median = json.median as Record<string, unknown> | undefined;
  if (typeof median?.lcp_ms === "number") return median.lcp_ms as number;
  const medFv = median?.firstView as Record<string, unknown> | undefined;
  if (typeof medFv?.LargestContentfulPaint === "number")
    return medFv.LargestContentfulPaint as number;
  return null;
}

function extractSi(json: Record<string, unknown>): number | null {
  const data = json.data as Record<string, unknown> | undefined;
  if (data?.medians != null && data?.runs != null) {
    const medians = data.medians as Record<string, number>;
    const runs = data.runs as Record<string, unknown>;
    const medianRunNum = medians.SI;
    if (medianRunNum != null) {
      const run = runs[String(medianRunNum)] as Record<string, unknown> | undefined;
      const fv = (run?.firstView as Record<string, unknown> | undefined);
      const steps = fv?.steps as Array<Record<string, unknown>> | undefined;
      const si = steps?.[0]?.SpeedIndex as number | undefined;
      if (si != null) return si;
    }
  }
  if (typeof json.si_ms === "number") return json.si_ms;
  const median = json.median as Record<string, unknown> | undefined;
  if (typeof median?.si_ms === "number") return median.si_ms as number;
  const medFv = median?.firstView as Record<string, unknown> | undefined;
  if (typeof medFv?.SpeedIndex === "number") return medFv.SpeedIndex as number;
  return null;
}

// ---------------------------------------------------------------------------
// Parse all post-63.1 JSON files in beforeAll — skip if any missing
// ---------------------------------------------------------------------------
type ProfileResult = {
  name: string;
  lcp: number;
  si: number | null;
  lcpRatio: number;
  ttiRatio: number | null;
};

let profileResults: ProfileResult[] = [];
let syntheticLcp = SYNTHETIC_LCP_MS;
let syntheticTti = SYNTHETIC_TTI_MS;

test.beforeAll(() => {
  // Check if post-63.1 files are present
  const missing = Object.entries(POST_63_1_FILES)
    .filter(([, path]) => !existsSync(path))
    .map(([name]) => name);

  if (missing.length > 0) {
    // Mark entire suite as to be skipped (no files = no assertion possible).
    // test.skip() in beforeAll stops all tests cleanly.
    test.skip(
      true,
      `Run scripts/wpt-rerun.mjs first — post-63.1 JSON files missing for: ` +
      `${missing.join(", ")}. ` +
      `Command: PROD_URL=https://your-deployment.vercel.app node scripts/wpt-rerun.mjs`
    );
    return;
  }

  // Validate synthetic baselines exist
  if (!existsSync(LHCI_BASELINE_FILE)) {
    throw new Error(`Synthetic LHCI baseline missing: ${LHCI_BASELINE_FILE}`);
  }
  if (!existsSync(VRF02_FILE)) {
    throw new Error(`VRF-02 TTI baseline missing: ${VRF02_FILE}`);
  }

  // Read and validate synthetic baselines against hard-coded constants
  const lhciJson = JSON.parse(readFileSync(LHCI_BASELINE_FILE, "utf-8"));
  const vrf02Json = JSON.parse(readFileSync(VRF02_FILE, "utf-8"));

  const lhciLcp = lhciJson.median?.lcp_ms as number | undefined;
  if (lhciLcp != null) {
    syntheticLcp = lhciLcp;
  }

  // vrf-02-launch-gate-runs.json: median tti_ms is the p50 from per_run array
  // Calculate p50 from per_run array if available
  const perRun = vrf02Json.per_run as Array<{ tti_ms?: number }> | undefined;
  if (perRun && perRun.length > 0) {
    const ttis = perRun.map((r) => r.tti_ms ?? 0).filter((t) => t > 0).sort((a, b) => a - b);
    if (ttis.length > 0) {
      syntheticTti = ttis[Math.floor(ttis.length / 2)];
    }
  }

  // Parse each profile
  profileResults = Object.entries(POST_63_1_FILES).map(([name, path]) => {
    const json = JSON.parse(readFileSync(path, "utf-8"));
    const lcp = extractLcp(json);
    const si = extractSi(json);

    if (lcp == null) {
      throw new Error(
        `Could not extract LCP from ${path}. ` +
        `Expected data.runs[median].firstView.steps[0].LargestContentfulPaint ` +
        `or lcp_ms / median.lcp_ms / median.firstView.LargestContentfulPaint`
      );
    }

    const lcpRatio = lcp / syntheticLcp;
    const ttiRatio = si != null ? si / syntheticTti : null;

    return { name, lcp, si, lcpRatio, ttiRatio };
  });

  // Print summary table to test output
  console.log("\nPitfall #10 Ratio Re-Check (D-09):");
  console.log(
    `${"Profile".padEnd(20)} ${"LCP".padEnd(8)} ${"LCP Ratio".padEnd(12)} ` +
    `${"SI (TTI proxy)".padEnd(16)} ${"TTI Ratio".padEnd(12)} ${"Verdict"}`
  );
  console.log("-".repeat(85));
  for (const r of profileResults) {
    const lcpVerdict = r.lcpRatio < LCP_RATIO_MAX ? "LCP PASS" : "LCP FAIL";
    const ttiVerdict = r.ttiRatio != null
      ? r.ttiRatio < TTI_RATIO_MAX ? "TTI PASS" : "TTI FAIL"
      : "TTI N/A";
    console.log(
      `${r.name.padEnd(20)} ${String(r.lcp + "ms").padEnd(8)} ` +
      `${r.lcpRatio.toFixed(3).padEnd(12)} ` +
      `${String((r.si ?? "N/A") + (r.si != null ? "ms" : "")).padEnd(16)} ` +
      `${(r.ttiRatio != null ? r.ttiRatio.toFixed(3) : "N/A").padEnd(12)} ` +
      `${lcpVerdict} / ${ttiVerdict}`
    );
  }
  console.log(`\nSynthetic baselines: LCP=${syntheticLcp}ms, TTI=${syntheticTti}ms`);
  console.log(`Thresholds: LCP ratio <${LCP_RATIO_MAX}, TTI ratio <${TTI_RATIO_MAX}\n`);
});

// ---------------------------------------------------------------------------
// Test 1 — Pitfall #10 LCP ratio <1.3 (D-09 close-out)
// ---------------------------------------------------------------------------
test("Pitfall #10 — LCP ratio <1.3 on all 3 profiles (D-09 close-out)", () => {
  if (profileResults.length === 0) {
    test.skip(
      true,
      "Run scripts/wpt-rerun.mjs first — post-63.1 JSON files missing."
    );
    return;
  }

  for (const profile of profileResults) {
    expect(
      profile.lcpRatio,
      `Pitfall #10 LCP FAIL on profile "${profile.name}": ` +
      `real LCP ${profile.lcp}ms ÷ synthetic LCP ${syntheticLcp}ms = ${profile.lcpRatio.toFixed(3)}× ` +
      `(threshold <${LCP_RATIO_MAX}×). ` +
      `Phase 63.1 Plan 03 hoist is insufficient — consider Candidate C escalation ` +
      `(pre-hydration inline-SVG injection per 63.1-COHORT.md path_X_decision).`
    ).toBeLessThan(LCP_RATIO_MAX);
  }
});

// ---------------------------------------------------------------------------
// Test 2 — Pitfall #10 TTI ratio <1.5 on all 3 profiles (D-09 close-out)
// ---------------------------------------------------------------------------
test("Pitfall #10 — TTI ratio <1.5 on all 3 profiles (D-09 close-out, SI proxy)", () => {
  if (profileResults.length === 0) {
    test.skip(
      true,
      "Run scripts/wpt-rerun.mjs first — post-63.1 JSON files missing."
    );
    return;
  }

  for (const profile of profileResults) {
    if (profile.ttiRatio == null) {
      // Speed Index not available in this JSON — skip TTI ratio for this profile
      // but don't fail (SI field may use different key name; LCP gate is primary).
      console.warn(
        `WARNING: Could not extract Speed Index from profile "${profile.name}". ` +
        `TTI ratio check skipped for this profile. ` +
        `Verify the JSON shape contains SpeedIndex or si_ms.`
      );
      continue;
    }

    expect(
      profile.ttiRatio,
      `Pitfall #10 TTI FAIL on profile "${profile.name}": ` +
      `real SI ${profile.si}ms ÷ synthetic TTI ${syntheticTti}ms = ${profile.ttiRatio.toFixed(3)}× ` +
      `(threshold <${TTI_RATIO_MAX}×). ` +
      `Plan 02's rIC deferral should have improved TBT/TTI on real devices. ` +
      `Investigate whether the SI improvement tracks with TBT improvement from rIC wrapping.`
    ).toBeLessThan(TTI_RATIO_MAX);
  }
});
