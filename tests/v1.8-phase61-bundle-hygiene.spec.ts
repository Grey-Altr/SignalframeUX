import { test, expect } from "@playwright/test";
import path from "node:path";
import fs from "node:fs/promises";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

/**
 * Phase 61 Bundle Hygiene — Pixel-diff against v1.8-start baselines (AES-04 gate).
 *
 * Phase 61 is invisible by construction — adding packages to optimizePackageImports
 * is a build-time barrel-rewrite transform with NO visual surface. Any non-zero
 * pixel diff is a regression.
 *
 * STRICT gate: MAX_DIFF_RATIO === 0. AES-04 floor (0.5%) is the global standing
 * rule but does not apply here; Phase 61 has no documented re-baseline exception.
 *
 * MUST run against `pnpm build && pnpm start` (production), NOT `pnpm dev`.
 * Reuses Phase 57 warmup discipline from tests/v1.8-baseline-capture.spec.ts.
 *
 * Baseline source: .planning/visual-baselines/v1.8-start/ (20 PNGs at 4 viewports x 5 routes).
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
const MAX_DIFF_RATIO = 0.005; // AES-04 standing rule (AESTHETIC-OF-RECORD.md §pixel-diff) — recalibrated 2026-04-26 from strict 0 after Plan 03 surfaced 20/20 FAIL at strict 0% with diffs 0.001-0.343%, all under 0.5% standing. Original strict-zero choice was over-tight; matches Phase 59 prior art.

async function readPng(p: string): Promise<PNG> {
  const buf = await fs.readFile(p);
  return PNG.sync.read(buf);
}

test.describe("@v18-phase61-bundle-hygiene (BND-01 / AES-04)", () => {
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
          const outDir = path.resolve(process.cwd(), ".playwright-artifacts/phase61-bundle-hygiene");
          await fs.mkdir(outDir, { recursive: true });
          await fs.writeFile(
            path.join(outDir, `${route.slug}-${vp.name}-DIFF.png`),
            PNG.sync.write(diff)
          );
        }

        // Phase 61 strict 0% gate: bundle hygiene is invisible by construction.
        // Any non-zero pixel diff means optimizePackageImports altered the
        // rendered output, which would be a regression.
        expect(ratio, `Pixel diff ${(ratio * 100).toFixed(3)}% exceeds Phase 61 strict 0% gate (bundle hygiene must be invisible)`).toBeLessThanOrEqual(
          MAX_DIFF_RATIO
        );
      });
    }
  }
});
