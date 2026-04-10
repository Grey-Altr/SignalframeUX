#!/usr/bin/env tsx
/**
 * scripts/launch-gate.ts — Phase 35 LR-02 / PF-02 advisory Lighthouse runner.
 *
 * Per brief §PF-02 "Hybrid D mechanism", this is the ADVISORY path for the
 * Lighthouse 100/100 requirement. It is NOT wired into CI — the bundle gate,
 * LCP, and CLS tests are CI-blocking; Lighthouse is manual.
 *
 * Usage:
 *   pnpm tsx scripts/launch-gate.ts --url https://signalframeux.vercel.app
 *   # or:
 *   VERCEL_PREVIEW_URL=https://... pnpm tsx scripts/launch-gate.ts
 *
 * Runs Lighthouse 3 times, takes the worst score per category (mitigates flake),
 * prints per-category results, exits non-zero if any category < 100.
 */

// chrome-launcher is a transitive dep of lighthouse — not in package.json directly.
// pnpm doesn't hoist transitive deps, so TypeScript can't resolve the module path.
// We use a typed require() shim with a local interface to satisfy the type checker.
interface ChromeLaunchOptions { chromeFlags?: string[] }
interface LaunchedChrome { port: number; kill: () => Promise<void> }
// eslint-disable-next-line @typescript-eslint/no-require-imports
const chromeLauncher = require("chrome-launcher") as {
  launch: (opts: ChromeLaunchOptions) => Promise<LaunchedChrome>;
};
import lighthouse from "lighthouse";
import { writeFileSync } from "fs";
import { join } from "path";

const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"] as const;
const RUNS = 3;
const TARGET_SCORE = 100;

function parseUrlArg(): string {
  const idx = process.argv.indexOf("--url");
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  if (process.env.VERCEL_PREVIEW_URL) return process.env.VERCEL_PREVIEW_URL;
  throw new Error("launch-gate: provide --url <url> or set VERCEL_PREVIEW_URL");
}

async function runOnce(url: string) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
  try {
    const result = await lighthouse(url, {
      port: chrome.port,
      output: "json",
      onlyCategories: [...CATEGORIES],
    });
    if (!result) throw new Error("lighthouse returned undefined");
    return result.lhr;
  } finally {
    await chrome.kill();
  }
}

async function main() {
  const url = parseUrlArg();
  console.log(`launch-gate: auditing ${url} (${RUNS} runs, taking worst score per category)`);

  const runs: Array<Record<string, number>> = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lastLhr: any[] = [];

  for (let i = 0; i < RUNS; i++) {
    console.log(`  run ${i + 1}/${RUNS}...`);
    const lhr = await runOnce(url);
    lastLhr.push(lhr);
    const scores: Record<string, number> = {};
    for (const cat of CATEGORIES) {
      const score = lhr.categories[cat]?.score;
      scores[cat] = score !== null && score !== undefined ? Math.round(score * 100) : 0;
    }
    runs.push(scores);
  }

  // Worst score per category across runs
  const worst: Record<string, number> = {};
  for (const cat of CATEGORIES) {
    worst[cat] = Math.min(...runs.map((r) => r[cat]));
  }

  console.log("\nResults (worst of 3 runs):");
  let anyFail = false;
  for (const cat of CATEGORIES) {
    const score = worst[cat];
    const status = score >= TARGET_SCORE ? "PASS" : "FAIL";
    console.log(`  ${cat.padEnd(16)} ${score.toString().padStart(3)} / ${TARGET_SCORE}  ${status}`);
    if (score < TARGET_SCORE) anyFail = true;
  }

  // Write audit trail
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outPath = join(
    process.cwd(),
    ".planning/phases/35-performance-launch-gate",
    `launch-gate-${timestamp}.json`
  );
  writeFileSync(outPath, JSON.stringify({ url, runs, worst, fullLhr: lastLhr }, null, 2));
  console.log(`\nFull audit written to: ${outPath}`);

  if (anyFail) {
    console.error("\nlaunch-gate: FAIL — at least one category < 100");
    process.exit(1);
  }
  console.log("\nlaunch-gate: PASS — all categories 100/100");
}

main().catch((err) => {
  console.error("launch-gate: ERROR", err);
  process.exit(2);
});
