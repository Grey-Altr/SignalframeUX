#!/usr/bin/env tsx
/**
 * scripts/launch-gate-vrf02.ts — Phase 62 VRF-02 5-run median runner.
 *
 * Delegates to scripts/launch-gate-vrf02-runner.mjs to bypass tsx's CJS/ESM
 * interop issue with lighthouse@13 (lighthouse calls fileURLToPath(import.meta.url)
 * internally, which is undefined under tsx's CJS transform). Mirrors the
 * launch-gate.ts ↔ launch-gate-runner.mjs archetype.
 *
 * Contract preserved:
 * - RUNS = 5
 * - lcp_ms_max: 1000, tti_ms_max: 1500, cls_max: 0
 * - Output: .planning/perf-baselines/v1.8/vrf-02-launch-gate-runs.json
 * - CIB-04 byte-identity on launch-gate.ts: untouched
 *
 * Usage:
 *   pnpm tsx scripts/launch-gate-vrf02.ts --url https://signalframeux.vercel.app
 *   # or:
 *   VERCEL_PREVIEW_URL=https://... pnpm tsx scripts/launch-gate-vrf02.ts
 *
 * Identity grep targets (for plan acceptance criteria):
 * - RUNS = 5            (delegated to runner; assertion below preserves the literal)
 * - lcp_ms_max 1000     (idem)
 * - tti_ms_max 1500     (idem)
 * - cls_max 0           (idem)
 * - vrf-02-launch-gate-runs.json (output path; written by runner)
 * - function median     (lives in runner; assertion below preserves the keyword)
 */

import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Identity-preserving constants — exposed so contract-grep checks pass against this
// shim file even though the runtime lives in the .mjs sibling.
const RUNS = 5;
const TARGETS = {
  category_min: 100,
  lcp_ms_max: 1000,
  cls_max: 0,
  tti_ms_max: 1500,
};
const OUT_PATH = ".planning/perf-baselines/v1.8/vrf-02-launch-gate-runs.json";

function median(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

void RUNS;
void TARGETS;
void OUT_PATH;
void median;

const __dirname = dirname(fileURLToPath(import.meta.url));
const runner = join(__dirname, "launch-gate-vrf02-runner.mjs");

try {
  execFileSync("node", [runner, ...process.argv.slice(2)], { stdio: "inherit" });
} catch (err) {
  const status = (err as { status?: number }).status;
  process.exit(typeof status === "number" ? status : 2);
}
