#!/usr/bin/env node
// Phase 63.1 Plan 03 Wave 0 — D-07 vrf-01-* re-run gate.
// Path B (GUI manual) per _path_a_decision (Phase 63 Catchpoint Starter tier).
//
// Purpose: re-runs the 3 canonical Catchpoint/WPT profiles for Phase 63.1 close-out.
// All 3 must report LCP <1000 ms (D-07 success criterion).
//
// Usage:
//   PROD_URL=https://your-deployment.vercel.app node scripts/wpt-rerun.mjs
//
// Catchpoint Starter Path B (GUI manual) — per Phase 63 _path_a_decision:
//   For each profile, the script prints step-by-step Catchpoint GUI instructions
//   and waits for the user to drop the downloaded JSON file at the expected path.
//   After all 3 files are present, the script validates LCP <1000 ms for each.
//
// Output files (post-run):
//   .planning/perf-baselines/v1.8/vrf-01-ios-iphone14pro-post-63.1.json
//   .planning/perf-baselines/v1.8/vrf-01-android-a14-post-63.1.json
//   .planning/perf-baselines/v1.8/vrf-01-android-midtier-post-63.1.json

import { existsSync, readFileSync, createReadStream } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";
import { stdin as input, stdout as output, exit } from "node:process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, "..");
const BASELINES_DIR = join(PROJECT_ROOT, ".planning", "perf-baselines", "v1.8");

// ---------------------------------------------------------------------------
// Profile definitions (3 canonical profiles — Phase 63 §2 device matrix)
// ---------------------------------------------------------------------------
const PROFILES = [
  {
    name: "ios-iphone14pro",
    device: "iPhone 14 Pro",
    network: "4G",
    catchpoint_label: "iPhone 14 Pro — 4G LTE (Throttled)",
    outputFile: "vrf-01-ios-iphone14pro-post-63.1.json",
    baselineFile: "vrf-01-ios-iphone14pro.json",
    baselineLcp: 1711,
  },
  {
    name: "android-a14",
    device: "Motorola G Power (Galaxy A14 substitute)",
    network: "3G Fast",
    catchpoint_label: "Motorola Moto G Power — 3G Fast (Throttled)",
    outputFile: "vrf-01-android-a14-post-63.1.json",
    baselineFile: "vrf-01-android-a14.json",
    baselineLcp: 3618,
  },
  {
    name: "android-midtier",
    device: "Moto G Stylus 4G (mid-tier substitute)",
    network: "4G",
    catchpoint_label: "Motorola Moto G Stylus — 4G LTE (Throttled)",
    outputFile: "vrf-01-android-midtier-post-63.1.json",
    baselineFile: "vrf-01-android-midtier.json",
    baselineLcp: 1851,
  },
];

const LCP_THRESHOLD_MS = 1000;

// ---------------------------------------------------------------------------
// LCP field extraction — matches Phase 63 WPT JSON schema
// (data.runs[median_run].firstView.steps[0].LargestContentfulPaint)
// ---------------------------------------------------------------------------
function extractLcp(json) {
  // Catchpoint WPT JSON schema (Phase 63 baseline shape):
  // { data: { medians: { LCP: <run_num> }, runs: { "<run_num>": { firstView: { steps: [{ LargestContentfulPaint: <ms> }] } } } } }
  if (json.data?.medians?.LCP != null && json.data?.runs != null) {
    const medianRunNum = json.data.medians.LCP;
    const run = json.data.runs[String(medianRunNum)];
    if (run?.firstView?.steps?.[0]?.LargestContentfulPaint != null) {
      return run.firstView.steps[0].LargestContentfulPaint;
    }
  }
  // Alternative flat shape (lcp_ms directly on root or median)
  if (json.lcp_ms != null) return json.lcp_ms;
  if (json.median?.lcp_ms != null) return json.median.lcp_ms;
  // Alternative: median.firstView.LargestContentfulPaint
  if (json.median?.firstView?.LargestContentfulPaint != null)
    return json.median.firstView.LargestContentfulPaint;
  return null;
}

// ---------------------------------------------------------------------------
// Speed Index extraction (TTI proxy per Phase 63 synthesis §2)
// ---------------------------------------------------------------------------
function extractSi(json) {
  if (json.data?.medians?.SI != null && json.data?.runs != null) {
    const medianRunNum = json.data.medians.SI;
    const run = json.data.runs[String(medianRunNum)];
    if (run?.firstView?.steps?.[0]?.SpeedIndex != null) {
      return run.firstView.steps[0].SpeedIndex;
    }
  }
  if (json.si_ms != null) return json.si_ms;
  if (json.median?.si_ms != null) return json.median.si_ms;
  if (json.median?.firstView?.SpeedIndex != null) return json.median.firstView.SpeedIndex;
  return null;
}

// ---------------------------------------------------------------------------
// Prompt helper — readline-based, waits for user to press Enter
// ---------------------------------------------------------------------------
async function pressEnterToContinue(message) {
  const rl = createInterface({ input, output });
  return new Promise((resolve) => {
    rl.question(message, () => {
      rl.close();
      resolve();
    });
  });
}

// ---------------------------------------------------------------------------
// Path B (GUI manual) instructions per profile
// ---------------------------------------------------------------------------
function printProfileInstructions(profile, outputPath, prodUrl) {
  console.log("\n" + "=".repeat(72));
  console.log(`RE-RUN PROFILE: ${profile.name}`);
  console.log("=".repeat(72));
  console.log(`Device:          ${profile.device}`);
  console.log(`Network:         ${profile.network}`);
  console.log(`Catchpoint label: ${profile.catchpoint_label}`);
  console.log(`URL:             ${prodUrl}`);
  console.log(`Runs:            3  (Catchpoint Starter cap; n=3 median)`);
  console.log(`Pre-63.1 LCP:    ${profile.baselineLcp} ms  (FAIL — target <${LCP_THRESHOLD_MS} ms)`);
  console.log(`Output JSON:     ${outputPath}`);
  console.log("");
  console.log("CATCHPOINT GUI STEPS (Path B — Starter tier):");
  console.log("  1. Open https://app.catchpoint.com → Tests → WebPageTest");
  console.log(`  2. Configure test:`);
  console.log(`       URL: ${prodUrl}`);
  console.log(`       Device: ${profile.catchpoint_label}`);
  console.log(`       Connection: ${profile.network}`);
  console.log(`       Runs: 3`);
  console.log(`       Script: (none — single-page test)`);
  console.log("  3. Click Run Test. Wait for completion (~3–5 min).");
  console.log("  4. On results page: Download → JSON (WPT format).");
  console.log(`  5. Save the downloaded JSON to:`);
  console.log(`       ${outputPath}`);
  console.log("=".repeat(72));
}

// ---------------------------------------------------------------------------
// PASS/FAIL summary table
// ---------------------------------------------------------------------------
function printSummaryTable(results) {
  console.log("\n" + "=".repeat(80));
  console.log("PHASE 63.1 WPT RE-RUN SUMMARY (D-07 gate)");
  console.log("=".repeat(80));
  console.log(
    `${"Profile".padEnd(22)} ${"Pre-63.1 LCP".padEnd(14)} ${"Post-63.1 LCP".padEnd(15)} ${"Delta".padEnd(10)} Verdict`
  );
  console.log("-".repeat(80));

  let allPass = true;
  for (const r of results) {
    const verdict = r.lcp < LCP_THRESHOLD_MS ? "PASS" : "FAIL";
    if (verdict !== "PASS") allPass = false;
    const delta = r.lcp - r.baselineLcp;
    const deltaStr = delta < 0 ? `${delta} ms` : `+${delta} ms`;
    console.log(
      `${r.name.padEnd(22)} ${String(r.baselineLcp + " ms").padEnd(14)} ${String(r.lcp + " ms").padEnd(15)} ${deltaStr.padEnd(10)} ${verdict}`
    );
  }

  console.log("=".repeat(80));
  if (allPass) {
    console.log("ALL 3 PROFILES PASS — D-07 gate CLOSED. Phase 63.1 LCP fast-path verified.");
    console.log('Next: run `pnpm playwright test tests/v1.8-phase63-1-pitfall-10.spec.ts`');
  } else {
    console.log("ONE OR MORE PROFILES FAIL — D-07 gate OPEN.");
    console.log("Consider Candidate C escalation (pre-hydration inline-SVG injection).");
    console.log("See 63.1-PLAN-03 fallback section and 63.1-COHORT.md path_X_decision.");
  }
  console.log("=".repeat(80));
  return allPass;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const prodUrl = process.env.PROD_URL;
  if (!prodUrl) {
    console.error(
      "ERROR: PROD_URL environment variable is required.\n" +
      "Usage: PROD_URL=https://your-deployment.vercel.app node scripts/wpt-rerun.mjs"
    );
    exit(1);
  }

  console.log("\nPhase 63.1 Plan 03 — D-07 WPT Real-Device Re-Run Gate");
  console.log(`Target URL: ${prodUrl}`);
  console.log(`LCP threshold: <${LCP_THRESHOLD_MS} ms on all 3 profiles`);
  console.log(`Output dir: ${BASELINES_DIR}`);

  const results = [];

  for (const profile of PROFILES) {
    const outputPath = join(BASELINES_DIR, profile.outputFile);

    if (existsSync(outputPath)) {
      console.log(`\n[SKIP] ${profile.name} — JSON already present at:\n  ${outputPath}`);
      console.log("  (Delete the file to re-run this profile.)");
    } else {
      printProfileInstructions(profile, outputPath, prodUrl);
      await pressEnterToContinue(
        `\nPress Enter after dropping the JSON at ${outputPath} ...`
      );

      if (!existsSync(outputPath)) {
        console.error(`ERROR: File still not found after Enter: ${outputPath}`);
        console.error("Please save the JSON file at the above path and re-run.");
        exit(1);
      }
    }

    // Parse and validate
    let json;
    try {
      json = JSON.parse(readFileSync(outputPath, "utf-8"));
    } catch (err) {
      console.error(`ERROR: Failed to parse JSON at ${outputPath}: ${err.message}`);
      exit(1);
    }

    const lcp = extractLcp(json);
    const si = extractSi(json);

    if (lcp == null) {
      console.error(
        `ERROR: Could not extract LCP from ${outputPath}.\n` +
        `Expected shape: data.runs[medianRun].firstView.steps[0].LargestContentfulPaint\n` +
        `or: lcp_ms / median.lcp_ms / median.firstView.LargestContentfulPaint`
      );
      exit(1);
    }

    console.log(
      `\n[READ] ${profile.name}: LCP=${lcp} ms, SI=${si ?? "N/A"} ms` +
      ` (pre-63.1 baseline: ${profile.baselineLcp} ms)`
    );

    results.push({
      name: profile.name,
      lcp,
      si,
      baselineLcp: profile.baselineLcp,
    });
  }

  const allPass = printSummaryTable(results);
  exit(allPass ? 0 : 1);
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  exit(1);
});
