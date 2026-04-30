import { test, expect } from "@playwright/test";
import path from "node:path";
import fs from "node:fs/promises";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

/**
 * Phase 67 Bundle Barrel-Optimization (D-04 Unlock) — Per-vector AES-04 pixel-diff.
 *
 * Phase 67 deliberately breaks the D-04 chunk-id stability lock (BND-05) to apply
 * three reshape vectors:
 *   V1 — `@/components/sf` to optimizePackageImports + DCE zero-consumer barrel exports
 *   V2 — GSAP dynamic-import of eager pull-in sites (conditional on Task 0 finding)
 *   V3 — TooltipProvider hydration-gated lazy mount
 *
 * Every reshape vector reshuffles webpack's splitChunks graph, which in principle could
 * shift CSS load order or change render output (D-08 in 67-CONTEXT.md mandates per-vector
 * AES-04 cadence; D-09 fixes route coverage at /, /init, /inventory, /system; the
 * v1.8-start baseline directory ALSO contains /reference at the same cost — the spec
 * therefore covers 5 routes × 4 viewports = 20 captures matching baseline coverage).
 *
 * Threshold = 0.5% (AES-04 standing rule per AESTHETIC-OF-RECORD.md §pixel-diff,
 * recalibrated 2026-04-26 from strict 0 — see Phase 61 Plan 03 history). Phase 61's
 * original strict-zero choice was over-tight; 0.5% is the canonical AES-04 floor.
 *
 * MUST run against `pnpm build && pnpm start` (production), NOT `pnpm dev`.
 * Reuses Phase 57 warmup discipline from tests/v1.8-baseline-capture.spec.ts.
 *
 * Baseline source: .planning/visual-baselines/v1.8-start/ (20 PNGs at 4 viewports x 5 routes).
 *
 * BND-05 / AES-04 — invoked after each vector commit in Plan 01.
 */

const ROUTES = [
  { path: "/", slug: "home" },
  { path: "/system", slug: "system" },
  { path: "/init", slug: "init" },
  { path: "/inventory", slug: "inventory" },
  { path: "/reference", slug: "reference" },
] as const;

const VIEWPORTS = [
  { name: "desktop-1440x900", width: 1440, height: 900 },
  { name: "iphone13-390x844", width: 390, height: 844 },
  { name: "ipad-834x1194", width: 834, height: 1194 },
  { name: "mobile-360x800", width: 360, height: 800 },
] as const;

const BASELINE_DIR = path.resolve(process.cwd(), ".planning/visual-baselines/v1.8-start");
const MAX_DIFF_RATIO = 0.005; // AES-04 standing rule (AESTHETIC-OF-RECORD.md §pixel-diff). Per-vector cadence enforced via D-08; route coverage per D-09 + v1.8-start superset.

async function readPng(p: string): Promise<PNG> {
  const buf = await fs.readFile(p);
  return PNG.sync.read(buf);
}

test.describe("@v1.9-phase67-bundle-reshape (BND-05 / AES-04)", () => {
  for (const route of ROUTES) {
    for (const vp of VIEWPORTS) {
      test(`${route.slug} @ ${vp.name} matches v1.8-start within 0.5% (AES-04 standing rule)`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(route.path, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.load('700 100px "Anton"'));
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(100);
        await expect(page.locator("nextjs-portal")).toHaveCount(0);

        const currentBuf = await page.screenshot({ fullPage: true, animations: "disabled" });
        const current = PNG.sync.read(currentBuf);

        const baselinePath = path.join(BASELINE_DIR, `${route.slug}-${vp.name}.png`);
        const baseline = await readPng(baselinePath);

        // Resize-mismatch is itself a regression — assert dimensions match.
        expect(current.width).toBe(baseline.width);
        expect(current.height).toBe(baseline.height);

        const diff = new PNG({ width: current.width, height: current.height });
        const diffPx = pixelmatch(
          current.data,
          baseline.data,
          diff.data,
          current.width,
          current.height,
          { threshold: 0.1 }
        );
        const total = current.width * current.height;
        const ratio = diffPx / total;

        // Persist diff PNG for human review on failure
        if (ratio > MAX_DIFF_RATIO) {
          const outDir = path.resolve(process.cwd(), ".playwright-artifacts/phase67-bundle-reshape");
          await fs.mkdir(outDir, { recursive: true });
          await fs.writeFile(
            path.join(outDir, `${route.slug}-${vp.name}-DIFF.png`),
            PNG.sync.write(diff)
          );
        }

        // Phase 67 AES-04 ≤0.5% gate: per-vector cadence (D-08). Bundle reshape is
        // invisible by construction — chunk reshuffle should not alter rendered output.
        expect(ratio, `Pixel diff ${(ratio * 100).toFixed(3)}% exceeds Phase 67 AES-04 0.5% gate (bundle reshape must be invisible)`).toBeLessThanOrEqual(
          MAX_DIFF_RATIO
        );
      });
    }
  }
});
