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
 *   # or:
 *   VERCEL_PREVIEW_URL=https://... pnpm tsx scripts/launch-gate-vrf02.ts
 */

// chrome-launcher is a transitive dep of lighthouse — not in package.json directly.
// Mirror launch-gate.ts:23-26 typed require() shim (pnpm doesn't hoist transitives).
interface ChromeLaunchOptions {
  chromeFlags?: string[];
}
interface LaunchedChrome {
  port: number;
  kill: () => Promise<void>;
}
const chromeLauncher = require("chrome-launcher") as {
  launch: (opts: ChromeLaunchOptions) => Promise<LaunchedChrome>;
};
import lighthouse from "lighthouse";
import { writeFileSync } from "fs";

const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"] as const;
const RUNS = 5;
const TARGETS = {
  category_min: 100,
  lcp_ms_max: 1000,
  cls_max: 0,
  tti_ms_max: 1500,
};
const OUT_PATH = ".planning/perf-baselines/v1.8/vrf-02-launch-gate-runs.json";

interface RunResult {
  performance: number;
  accessibility: number;
  "best-practices": number;
  seo: number;
  lcp_ms: number;
  cls: number;
  tti_ms: number;
}

function parseUrlArg(): string {
  const idx = process.argv.indexOf("--url");
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  const eqArg = process.argv.find((a) => a.startsWith("--url="));
  if (eqArg) return eqArg.slice("--url=".length);
  if (process.env.VERCEL_PREVIEW_URL) return process.env.VERCEL_PREVIEW_URL;
  return "https://signalframeux.vercel.app/";
}

function median(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

async function runOnce(url: string): Promise<RunResult> {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ["--headless", "--no-sandbox"],
  });
  try {
    const result = await lighthouse(url, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      onlyCategories: [...CATEGORIES],
    });
    if (!result) throw new Error("lighthouse returned undefined");
    const lhr = result.lhr;
    const score = (cat: string): number => {
      const raw = lhr.categories[cat]?.score;
      return raw !== null && raw !== undefined ? Math.round(raw * 100) : 0;
    };
    return {
      performance: score("performance"),
      accessibility: score("accessibility"),
      "best-practices": score("best-practices"),
      seo: score("seo"),
      lcp_ms: Math.round(
        lhr.audits["largest-contentful-paint"]?.numericValue ?? 0,
      ),
      cls: lhr.audits["cumulative-layout-shift"]?.numericValue ?? 0,
      tti_ms: Math.round(lhr.audits["interactive"]?.numericValue ?? 0),
    };
  } finally {
    await chrome.kill();
  }
}

async function main() {
  const url = parseUrlArg();
  console.error(
    `launch-gate-vrf02: auditing ${url} (${RUNS} runs, median per category)`,
  );

  const perRun: RunResult[] = [];
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
