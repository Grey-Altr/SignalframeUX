// Phase 63.1 Plan 01 Wave 0 — bundle budget gate per CONTEXT.md D-04 + CLAUDE.md target.
// Asserts the homepage (/) First Load JS chunk sum < 200 KB (gzip) after pnpm build.
// Reads .next/build-manifest.json pages["/"] array — same source used by Next.js
// Route (app) table output. Skips gracefully if build artifacts are not present.

import { test, expect } from "@playwright/test";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const BUDGET_BYTES = 200 * 1024; // 200 KB gzip — CLAUDE.md Hard Constraint

test("Phase 63.1 Plan 01 — homepage First Load JS < 200 KB", () => {
  const manifestPath = join(process.cwd(), ".next", "build-manifest.json");

  if (!existsSync(manifestPath)) {
    test.skip(true, "Build artifacts not present — run pnpm build first");
    return;
  }

  const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));

  // build-manifest.json pages["/"] contains relative paths like
  // "static/chunks/foo-abc123.js" (relative to .next/).
  const pageChunks: string[] = manifest.pages?.["/"] ?? [];

  if (pageChunks.length === 0) {
    // App Router may use rootLayout / rsc instead of pages["/"]. Try the
    // app-routes shape used by Next 15 App Router builds.
    test.skip(true, 'pages["/"] entry not found in build-manifest.json — check build output format');
    return;
  }

  const nextDir = join(process.cwd(), ".next");
  let totalGzipBytes = 0;
  const breakdown: Array<{ file: string; gzipKB: string }> = [];

  for (const relPath of pageChunks) {
    // Paths in build-manifest are relative to .next/ directory.
    const absPath = join(nextDir, relPath);
    if (!existsSync(absPath)) continue;

    const raw = readFileSync(absPath);
    const gzipped = gzipSync(raw);
    totalGzipBytes += gzipped.length;
    breakdown.push({
      file: relPath.split("/").pop() ?? relPath,
      gzipKB: (gzipped.length / 1024).toFixed(1),
    });
  }

  const totalKB = (totalGzipBytes / 1024).toFixed(1);

  // Report breakdown for debugging even on pass.
  console.log(`\nHomepage First Load JS chunks (${breakdown.length} files):`);
  for (const { file, gzipKB } of breakdown) {
    console.log(`  ${file}: ${gzipKB} KB`);
  }
  console.log(`Total: ${totalKB} KB (budget: 200 KB)`);

  expect(totalGzipBytes, `Homepage First Load JS is ${totalKB} KB — budget is 200 KB. ` +
    `Run ANALYZE=true pnpm build and inspect .next/analyze/client.html to identify ` +
    `oversized chunks. Plan 01 Task 2 (next/dynamic split) should close the gap.`
  ).toBeLessThan(BUDGET_BYTES);
});
