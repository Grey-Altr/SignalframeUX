#!/usr/bin/env node
/**
 * ESM runner for launch-gate-vrf02 logic — bypasses tsx CJS/ESM interop issue
 * with lighthouse@13's internal fileURLToPath(import.meta.url).
 *
 * Mirrors scripts/launch-gate-runner.mjs (Phase 35 archetype) but implements
 * VRF-02 D-05 contract: RUNS=5, median per category, full thresholds, output
 * to .planning/perf-baselines/v1.8/vrf-02-launch-gate-runs.json (Pattern 5
 * shape). Invoked directly by scripts/launch-gate-vrf02.ts.
 */
import lighthouse from "lighthouse";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

const require = createRequire(import.meta.url);
const lighthouseDir = dirname(require.resolve("lighthouse/package.json"));
const chromeLauncher = require(require.resolve("chrome-launcher", { paths: [lighthouseDir] }));

const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];
const RUNS = 5;
const TARGETS = {
  category_min: 100,
  lcp_ms_max: 1000,
  cls_max: 0,
  tti_ms_max: 1500,
};
const OUT_PATH = join(projectRoot, ".planning/perf-baselines/v1.8/vrf-02-launch-gate-runs.json");

function parseUrlArg() {
  const idx = process.argv.indexOf("--url");
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  const eq = process.argv.find((a) => a.startsWith("--url="));
  if (eq) return eq.slice("--url=".length);
  if (process.env.VERCEL_PREVIEW_URL) return process.env.VERCEL_PREVIEW_URL;
  return "https://signalframeux.vercel.app/";
}

function median(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

async function runOnce(url) {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ["--headless", "--no-sandbox"],
  });
  try {
    const result = await lighthouse(url, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      onlyCategories: CATEGORIES,
    });
    if (!result) throw new Error("lighthouse returned undefined");
    const lhr = result.lhr;
    const score = (cat) => {
      const raw = lhr.categories[cat]?.score;
      return raw !== null && raw !== undefined ? Math.round(raw * 100) : 0;
    };
    return {
      performance: score("performance"),
      accessibility: score("accessibility"),
      "best-practices": score("best-practices"),
      seo: score("seo"),
      lcp_ms: Math.round(lhr.audits["largest-contentful-paint"]?.numericValue ?? 0),
      cls: lhr.audits["cumulative-layout-shift"]?.numericValue ?? 0,
      tti_ms: Math.round(lhr.audits["interactive"]?.numericValue ?? 0),
    };
  } finally {
    await chrome.kill();
  }
}

async function main() {
  const url = parseUrlArg();
  console.error(`launch-gate-vrf02: auditing ${url} (${RUNS} runs, median per category)`);

  const perRun = [];
  for (let i = 0; i < RUNS; i++) {
    console.error(`  run ${i + 1}/${RUNS}…`);
    perRun.push(await runOnce(url));
  }

  const med = {
    performance: median(perRun.map((r) => r.performance)),
    accessibility: median(perRun.map((r) => r.accessibility)),
    "best-practices": median(perRun.map((r) => r["best-practices"])),
    seo: median(perRun.map((r) => r.seo)),
    lcp_ms: median(perRun.map((r) => r.lcp_ms)),
    cls: median(perRun.map((r) => r.cls)),
    tti_ms: median(perRun.map((r) => r.tti_ms)),
  };

  const verdict =
    med.performance === TARGETS.category_min &&
    med.accessibility === TARGETS.category_min &&
    med["best-practices"] === TARGETS.category_min &&
    med.seo === TARGETS.category_min &&
    med.lcp_ms < TARGETS.lcp_ms_max &&
    med.cls === TARGETS.cls_max &&
    med.tti_ms < TARGETS.tti_ms_max
      ? "PASS"
      : "FAIL";

  const out = {
    capturedAt: new Date().toISOString(),
    tool: "scripts/launch-gate-vrf02.ts",
    url,
    runs: RUNS,
    per_run: perRun,
    median: med,
    thresholds: TARGETS,
    verdict,
  };

  writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out.median, null, 2));
  console.error(`launch-gate-vrf02: ${verdict} → ${OUT_PATH}`);
  process.exit(verdict === "PASS" ? 0 : 1);
}

main().catch((err) => {
  console.error("launch-gate-vrf02: ERROR", err);
  process.exit(2);
});
