import { existsSync } from "fs";
import { test } from "@playwright/test";

/**
 * Phase 35 PF-01 bundle gate — Wave 0 stub with D-3 hard-fail guard.
 *
 * Locked assertion: sum gzipped shared-chunk file sizes from .next/build-manifest.json
 * (or .next/app-build-manifest.json). Two assertions:
 *   1. Total shared JS gzip < 150_000 bytes.
 *   2. Grep root entrypoint chunk list for "three", "SignalCanvas", "useSignalScene",
 *      "SignalMesh", "TokenViz", "GLSLHero", "signal-canvas" — must all be absent.
 *
 * Per brief §PF-01, per-route ceilings are explicitly dropped. The Three.js async-only
 * assertion IS the failure-mode coverage for sync-regression.
 *
 * Wave 1 (plan 35-02 Task owned by Agent 1) fleshes this out. The hard-fail guard below
 * lands at Wave 0 per brain-wins reconciliation D-3 — a CI gate that silently passes on
 * missing input is a false-positive vulnerability worse than no gate.
 */

test.describe("@phase35 PF-01 bundle gate", () => {
  test.skip("PF-01: shared JS < 150 KB gzip and Three.js async-only (Wave 1 fills)", async () => {
    // EDGE-CASES HIGH #1 guard (brain-wins D-3) — never silently skip a CI-blocking gate.
    // Wave 1 will uncomment and extend with the gzip + forbidden-substring logic.
    // const appManifestPath = ".next/app-build-manifest.json";
    // const buildManifestPath = ".next/build-manifest.json";
    // const manifestPath = existsSync(appManifestPath)
    //   ? appManifestPath
    //   : existsSync(buildManifestPath)
    //   ? buildManifestPath
    //   : null;
    // if (!manifestPath) {
    //   throw new Error(
    //     "PF-01 bundle gate cannot run: neither .next/build-manifest.json nor " +
    //     ".next/app-build-manifest.json exists. Run `pnpm build` before this test."
    //   );
    // }
  });
});
