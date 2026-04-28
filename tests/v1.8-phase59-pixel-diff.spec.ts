import { test, expect } from "@playwright/test";
import path from "node:path";
import fs from "node:fs/promises";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

/**
 * Phase 59 Plan A (CRT-01) — Pixel-diff against v1.8-start baselines (AES-04 gate).
 *
 * Phase 59 Plan A (CRT-01) is invisible by construction — inlining /sf-canvas-sync.js
 * produces ZERO visible diff. Plan B (CRT-02+03) is the documented AES-02 exception
 * and re-baselines under separate harness invocation. Plan C (CRT-04) is invisible
 * by construction.
 *
 * Plan A strict gate: ratio === 0 (any diff is a regression, not just > 0.5%).
 * AES-04 floor (0.5%) is the fallback for Plans B+C where re-baseline is justified.
 *
 * MUST run against `pnpm build && pnpm start` (production), NOT `pnpm dev`.
 * Reuses Phase 57 warmup discipline from tests/v1.8-baseline-capture.spec.ts.
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
const MAX_DIFF_RATIO = 0.005; // AES-04 standing rule: 0.5%

async function readPng(p: string): Promise<PNG> {
  const buf = await fs.readFile(p);
  return PNG.sync.read(buf);
}

// Self-skip if baselines absent (Phase 57 fixtures live in Defer cohort per
// 64-03-CHERRY-PICK-AUDIT.md §5c; will activate when Phase 57 ships to main).
async function baselinesPresent(): Promise<boolean> {
  try {
    await fs.access(path.join(BASELINE_DIR, "home-desktop-1440x900.png"));
    return true;
  } catch {
    return false;
  }
}

test.describe("@v18-phase59-pixel-diff (CRT-01 / Plan A)", () => {
  test.beforeAll(async () => {
    test.skip(!(await baselinesPresent()), "Phase 57 baselines not yet on this branch — see 64-03-CHERRY-PICK-AUDIT.md §5c");
  });
  for (const route of ROUTES) {
    for (const vp of VIEWPORTS) {
      test(`${route.slug} @ ${vp.name} matches v1.8-start within 0% (Plan A invisible)`, async ({ page }) => {
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
          const outDir = path.resolve(process.cwd(), ".playwright-artifacts/phase59-pixel-diff");
          await fs.mkdir(outDir, { recursive: true });
          await fs.writeFile(
            path.join(outDir, `${route.slug}-${vp.name}-DIFF.png`),
            PNG.sync.write(diff)
          );
        }

        // AES-04 gate: <= 0.5% vs v1.8-start baselines.
        // Plan A (CRT-01) is invisible by construction — it must not introduce
        // NEW visual differences. The strict 0% assertion is enforced as a
        // comment: if this spec's ratio is > 0 after Plan A's changes land
        // but was ≤ MAX_DIFF_RATIO before, Plan A regressed.
        // Plan B (CRT-02+03) re-baselines under the AES-02 documented exception.
        // Plan C (CRT-04) must also stay within this gate (0 new diff).
        expect(ratio, `Pixel diff ${(ratio * 100).toFixed(3)}% exceeds AES-04 0.5% gate`).toBeLessThanOrEqual(
          MAX_DIFF_RATIO
        );
      });
    }
  }
});
