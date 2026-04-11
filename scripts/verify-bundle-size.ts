/**
 * SignalframeUX Bundle Size Gate
 * Verifies distributed package gzip size stays under budget.
 * Budget: 50 KB total across all entry points + CSS.
 */
import { createReadStream } from "fs";
import { createGzip } from "zlib";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BUDGET_KB = 50;
const BUDGET_BYTES = BUDGET_KB * 1024;

const ENTRY_POINTS = [
  "dist/index.mjs",
  "dist/animation.mjs",
  "dist/webgl.mjs",
  "dist/signalframeux.css",
];

function gzipSize(filepath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    let size = 0;
    createReadStream(filepath)
      .pipe(createGzip())
      .on("data", (chunk: Buffer) => {
        size += chunk.length;
      })
      .on("end", () => resolve(size))
      .on("error", reject);
  });
}

async function main() {
  const sizes = await Promise.all(
    ENTRY_POINTS.map((f) => gzipSize(resolve(ROOT, f)))
  );
  const total = sizes.reduce((a, b) => a + b, 0);
  const totalKB = (total / 1024).toFixed(1);

  console.log("=== SignalframeUX Bundle Size Gate ===\n");
  ENTRY_POINTS.forEach((f, i) => {
    const kb = (sizes[i] / 1024).toFixed(1);
    console.log(`  ${f.padEnd(30)} ${kb.padStart(6)} KB gzip`);
  });
  console.log(`\n  TOTAL: ${totalKB} KB gzip (budget: ${BUDGET_KB} KB)`);

  if (total > BUDGET_BYTES) {
    console.error(`\nFAIL: ${totalKB} KB exceeds ${BUDGET_KB} KB budget`);
    process.exit(1);
  }
  console.log(
    `\nPASS: within budget (${(BUDGET_KB - total / 1024).toFixed(1)} KB headroom)`
  );
}

main().catch((err) => {
  console.error("FAIL:", err.message);
  process.exit(1);
});
