import { test, expect } from "@playwright/test";
import path from "node:path";
import { promises as fs } from "node:fs";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

/**
 * Phase 60 Plan 02 Wave 1 — AES-04 pixel-diff comparison gate.
 *
 * Read-only comparison: capture post-intervention PNGs to a transient directory
 * and pixel-diff against the committed v1.8-start baselines. Does NOT use
 * --update-snapshots; does NOT regenerate baselines. Threshold: <0.5% per
 * AESTHETIC-OF-RECORD.md §AES-04.
 *
 * The post-intervention frame state must match the captured-frame state
 * (warm-Anton + reduced-motion frozen pre-reveal at opacity 0.01) per
 * AESTHETIC-OF-RECORD §4. Hard gate against dev-mode capture (nextjs-portal
 * count === 0) matches baseline-capture.spec.ts:72.
 *
 * MUST run against `pnpm build && pnpm start` (production), NOT dev.
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

const BASELINE_DIR = path.resolve(
  process.cwd(),
  ".planning/visual-baselines/v1.8-start"
);
const POST_DIR = path.resolve(
  process.cwd(),
  ".planning/phases/60-lcp-element-repositioning/60-02-aes04-postcapture"
);
const RESULTS_PATH = path.resolve(
  process.cwd(),
  ".planning/phases/60-lcp-element-repositioning/60-02-aes04-results.md"
);

type Row = { slug: string; viewport: string; diffPct: number; passed: boolean };
const rows: Row[] = [];

test.describe("@v1.8-phase60-aes04 pixel-diff vs v1.8-start", () => {
  for (const route of ROUTES) {
    for (const vp of VIEWPORTS) {
      test(`${route.slug} @ ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(route.path, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.load('700 100px "Anton"'));
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(100);
        // Hard gate against dev-mode capture (matches baseline-capture spec line 72).
        await expect(page.locator("nextjs-portal")).toHaveCount(0);

        await fs.mkdir(POST_DIR, { recursive: true });
        const postPath = path.join(POST_DIR, `${route.slug}-${vp.name}.png`);
        await page.screenshot({
          path: postPath,
          fullPage: true,
          caret: "hide",
          animations: "disabled",
        });

        const basePath = path.join(BASELINE_DIR, `${route.slug}-${vp.name}.png`);
        const baseRaw = await fs.readFile(basePath);
        const postRaw = await fs.readFile(postPath);
        const baseImg = PNG.sync.read(baseRaw);
        const postImg = PNG.sync.read(postRaw);

        // Defensive: if dimensions differ (Next.js layout shift), short-circuit
        // with a high diffPct so the row flags for human review.
        if (baseImg.width !== postImg.width || baseImg.height !== postImg.height) {
          rows.push({ slug: route.slug, viewport: vp.name, diffPct: 100, passed: false });
          throw new Error(
            `${route.slug}@${vp.name} dimension drift base=${baseImg.width}x${baseImg.height} post=${postImg.width}x${postImg.height}`
          );
        }

        const diffImg = new PNG({ width: baseImg.width, height: baseImg.height });
        const diffPx = pixelmatch(
          baseImg.data,
          postImg.data,
          diffImg.data,
          baseImg.width,
          baseImg.height,
          { threshold: 0.1 }
        );
        const totalPx = baseImg.width * baseImg.height;
        const diffPct = (diffPx / totalPx) * 100;
        const passed = diffPct < 0.5;
        rows.push({ slug: route.slug, viewport: vp.name, diffPct, passed });

        // Threshold from AESTHETIC-OF-RECORD.md §AES-04: <0.5%.
        expect(diffPct).toBeLessThan(0.5);
      });
    }
  }

  test.afterAll(async () => {
    const lines: string[] = [
      "# Phase 60 Plan 02 — AES-04 Pixel-Diff Results",
      "",
      "| Route | Viewport | Diff % | Pass |",
      "|-------|----------|--------|------|",
      ...rows.map(
        (r) =>
          `| ${r.slug} | ${r.viewport} | ${r.diffPct.toFixed(3)}% | ${
            r.passed ? "✅" : "❌"
          } |`
      ),
      "",
      `Threshold: <0.5% per AES-04. Total runs: ${rows.length}. Failed: ${
        rows.filter((r) => !r.passed).length
      }.`,
    ];
    await fs.writeFile(RESULTS_PATH, lines.join("\n") + "\n");
  });
});
