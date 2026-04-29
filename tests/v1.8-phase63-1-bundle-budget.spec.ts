// Phase 63.1 Plan 01 Wave 0 — bundle budget gate per CONTEXT.md D-04 + CLAUDE.md target.
// Asserts the homepage (/) First Load JS chunk sum < 200 KB (gzip) after pnpm build.
// Uses .next/app-build-manifest.json pages["/page"] for App Router builds (Next 15).
// Falls back to build-manifest.json pages["/"] for Pages Router format.
// Skips gracefully if build artifacts are not present.
//
// Measurement methodology: reads each chunk file, gzip-compresses in memory, sums bytes.
// This matches the "First Load JS" column in Next.js Route (app) build output — which
// reports the compressed transfer size that users actually download.

import { test, expect } from "@playwright/test";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const BUDGET_BYTES = 200 * 1024; // 200 KB gzip — CLAUDE.md Hard Constraint

test("Phase 63.1 Plan 01 — homepage First Load JS < 200 KB", () => {
  const nextDir = join(process.cwd(), ".next");
  const appManifestPath = join(nextDir, "app-build-manifest.json");
  const pagesManifestPath = join(nextDir, "build-manifest.json");

  if (!existsSync(appManifestPath) && !existsSync(pagesManifestPath)) {
    test.skip(true, "Build artifacts not present — run pnpm build first");
    return;
  }

  let pageChunks: string[] = [];

  // App Router (Next 15): .next/app-build-manifest.json, key "/page"
  if (existsSync(appManifestPath)) {
    const appManifest = JSON.parse(readFileSync(appManifestPath, "utf-8"));
    const appPages = appManifest.pages ?? {};
    // "/page" is the homepage in App Router manifest; fall back to "/"
    pageChunks = appPages["/page"] ?? appPages["/"] ?? [];
  }

  // Fallback: Pages Router — build-manifest.json pages["/"]
  if (pageChunks.length === 0 && existsSync(pagesManifestPath)) {
    const manifest = JSON.parse(readFileSync(pagesManifestPath, "utf-8"));
    pageChunks = manifest.pages?.["/"] ?? [];
  }

  if (pageChunks.length === 0) {
    test.skip(
      true,
      'Homepage chunk list not found in app-build-manifest.json ("/page") or ' +
      'build-manifest.json ("/".) — check Next.js manifest structure for this build.'
    );
    return;
  }

  let totalGzipBytes = 0;
  const breakdown: Array<{ file: string; gzipKB: string }> = [];

  for (const relPath of pageChunks) {
    // Paths are relative to .next/ directory.
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
    `oversized chunks. Plan 02 (JS deferral) and Plan 03 (LCP fast-path) provide ` +
    `additional reduction headroom beyond Plan 01.`
  ).toBeLessThan(BUDGET_BYTES);
});
