// Phase 67 Plan 02 BND-06 close — bundle budget gate restored to CLAUDE.md hard
// constraint after the Phase 67 reshape. Asserts homepage / First Load JS chunk
// sum < BUDGET_BYTES (gzip) after pnpm build.
// Uses .next/app-build-manifest.json pages["/page"] for App Router builds (Next 15).
// Falls back to build-manifest.json pages["/"] for Pages Router format.
// Skips gracefully if build artifacts are not present.
//
// Measurement methodology: reads each chunk file, gzip-compresses in memory, sums bytes.
// This matches the "First Load JS" column in Next.js Route (app) build output — which
// reports the compressed transfer size that users actually download.
//
// History: Phase 63.1 ratified 260 KB (path_k); Phase 67 reshape (BND-05/06/07) restored
// the 200 KB target via @/components/sf optimizePackageImports + DCE of zero-consumer
// barrel exports + TooltipProviderLazy hydration-gate. The prior path_k threshold ratification retired
// 2026-04-30; rationale + chunk-ID lock at .planning/codebase/v1.9-bundle-reshape.md.

import { test, expect } from "@playwright/test";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const BUDGET_BYTES = 200 * 1024; // 200 KB gzip — CLAUDE.md hard constraint, restored Phase 67 (BND-06)

test("Phase 67 Plan 02 — homepage First Load JS < 200 KB (BND-06 / CLAUDE.md hard constraint)", () => {
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
  console.log(`Total: ${totalKB} KB (budget: 200 KB, post-Phase-67 BND-06)`);

  expect(totalGzipBytes, `Homepage First Load JS is ${totalKB} KB — budget is 200 KB ` +
    `(CLAUDE.md hard constraint, restored at Phase 67 BND-06 close per ` +
    `.planning/codebase/v1.9-bundle-reshape.md). If this fails after a recent commit, ` +
    `the commit bloated the bundle past the post-Phase-67 baseline — investigate ` +
    `the new commit's imports rather than bumping the threshold. Run ANALYZE=true ` +
    `pnpm build and inspect .next/analyze/client.html to identify which chunks grew.`
  ).toBeLessThan(BUDGET_BYTES);
});
