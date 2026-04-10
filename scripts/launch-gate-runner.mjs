#!/usr/bin/env node
/**
 * ESM runner for launch-gate logic — bypasses tsx CJS/ESM interop issue with lighthouse@13.
 * Used when `tsx scripts/launch-gate.ts` fails due to lighthouse's internal fileURLToPath(import.meta.url).
 */
import lighthouse from "lighthouse";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

const require = createRequire(import.meta.url);
// chrome-launcher is a transitive dep — resolve from lighthouse's location
const chromeLauncherPath = new URL(
  "../node_modules/.pnpm/chrome-launcher@1.2.1/node_modules/chrome-launcher/dist/index.js",
  import.meta.url
).pathname;
const chromeLauncher = require(chromeLauncherPath);

const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];
const RUNS = 3;
const TARGET_SCORE = 100;

function parseUrlArg() {
  const idx = process.argv.indexOf("--url");
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  if (process.env.VERCEL_PREVIEW_URL) return process.env.VERCEL_PREVIEW_URL;
  throw new Error("provide --url <url> or set VERCEL_PREVIEW_URL");
}

async function runOnce(url) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
  try {
    const result = await lighthouse(url, {
      port: chrome.port,
      output: "json",
      onlyCategories: CATEGORIES,
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

  const runs = [];
  const lastLhr = [];

  for (let i = 0; i < RUNS; i++) {
    console.log(`  run ${i + 1}/${RUNS}...`);
    const lhr = await runOnce(url);
    lastLhr.push(lhr);
    const scores = {};
    for (const cat of CATEGORIES) {
      const score = lhr.categories[cat]?.score;
      scores[cat] = score !== null && score !== undefined ? Math.round(score * 100) : 0;
    }
    runs.push(scores);
    console.log(`    run ${i+1} scores:`, scores);
  }

  const worst = {};
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

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outPath = join(
    projectRoot,
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
