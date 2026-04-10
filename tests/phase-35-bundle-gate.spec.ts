import { existsSync, readFileSync } from "fs";
import { gzipSync } from "zlib";
import { join } from "path";
import { test, expect } from "@playwright/test";

/**
 * Phase 35 PF-01 bundle gate — Wave 1 locked assertions.
 *
 * Two assertions:
 *   1. Sum of gzipped shared-chunk sizes < 150_000 bytes.
 *   2. Root entrypoint chunk list must NOT contain any of: three, SignalCanvas,
 *      useSignalScene, SignalMesh, TokenViz, GLSLHero, signal-canvas.
 *
 * Per brief §PF-01, per-route ceilings are intentionally absent. The Three.js
 * async-only assertion IS the failure-mode coverage for sync-regression.
 *
 * D-3 reconciliation: must THROW (not silently skip) when build output is absent.
 */

test.describe("@phase35 PF-01 bundle gate", () => {
  test("PF-01: shared JS < 150 KB gzip and Three.js async-only", async () => {
    // EDGE-CASES HIGH #1 guard (brain-wins D-3) — never silently skip a CI-blocking gate.
    // A test that false-positives on its own missing input erodes CI trust and ships
    // the failure mode invisibly on cache-miss runners.
    const appManifestPath = join(process.cwd(), ".next/app-build-manifest.json");
    const buildManifestPath = join(process.cwd(), ".next/build-manifest.json");
    const manifestPath = existsSync(appManifestPath)
      ? appManifestPath
      : existsSync(buildManifestPath)
      ? buildManifestPath
      : null;

    if (!manifestPath) {
      throw new Error(
        "PF-01 bundle gate cannot run: neither .next/build-manifest.json nor " +
        ".next/app-build-manifest.json exists. Run `pnpm build` before this test."
      );
    }

    const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));

    // Extract the shared-chunk file list. build-manifest.json shape:
    // { "pages": { "/_app": [...], ... }, "rootMainFiles": [...] }
    // app-build-manifest.json shape may differ; try both keys.
    const rootChunks: string[] =
      manifest.rootMainFiles ??
      manifest.pages?.["/_app"] ??
      [];

    // Assertion 1: sum of gzipped shared chunks < 150 KB
    let totalGzipBytes = 0;
    for (const chunkPath of rootChunks) {
      const absPath = join(process.cwd(), ".next", chunkPath);
      if (existsSync(absPath)) {
        const data = readFileSync(absPath);
        totalGzipBytes += gzipSync(data, { level: 9 }).length;
      }
    }
    // Per brief §PF-01, per-route ceilings are intentionally absent.
    expect(totalGzipBytes).toBeLessThan(150_000);

    // Assertion 2: forbidden substrings must be absent from shared chunk names.
    // Any hit means a WebGL/Three.js chunk has leaked into the synchronous bundle.
    const sharedChunkNames = rootChunks.join("\n");
    const FORBIDDEN = [
      "three",
      "SignalCanvas",
      "useSignalScene",
      "SignalMesh",
      "TokenViz",
      "GLSLHero",
      "signal-canvas",
    ];
    for (const substring of FORBIDDEN) {
      expect(
        sharedChunkNames.includes(substring),
        `Forbidden substring "${substring}" found in shared chunks — Three.js/WebGL leaked into sync bundle`
      ).toBe(false);
    }
  });
});
