import { test, expect } from "@playwright/test";
import path from "node:path";
import { promises as fs } from "node:fs";
import { existsSync } from "node:fs";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

/**
 * Phase 66 Plan 03 Wave 1 — AES-04 pixel-diff harness with strict + cohort
 * partition.
 *
 * Splits the 5 routes × 4 viewports matrix into two `test.describe()` blocks
 * that `--grep` filters on:
 *
 *   --grep strict  → desktop-1440x900 + ipad-834x1194 vs
 *                    .planning/visual-baselines/v1.8-start/ (HARD-FAIL ≤0.5%
 *                    per AESTHETIC-OF-RECORD §AES-04). 10 tests.
 *
 *   --grep cohort  → mobile-360x800 + iphone13-390x844 vs
 *                    .planning/visual-baselines/v1.9-pre/ (capture-only;
 *                    diff written to 66-cohort-results.md for AES-03 cohort
 *                    review per ROADMAP v1.9 build-order constraint #4 and
 *                    66-RESEARCH.md §9c). NO hard-fail — Plan 02 deliberately
 *                    flips mobile to pillarbox mode so the diff vs v1.8-start
 *                    would be ~100% by design; the cohort baseline is
 *                    mid-phase pre-mutation state at v1.9-pre/.
 *
 * Reduce-motion + warm-Anton + nextjs-portal hard gate are copied verbatim
 * from tests/v1.8-phase60-aes04-diff.spec.ts (canonical pattern). MUST run
 * against `pnpm build && pnpm start` (production), NOT dev.
 *
 * Cohort describe-block uses test.skip() if .planning/visual-baselines/v1.9-pre/
 * does not exist, so the spec is committable alongside Plan 01 Task 3 (this
 * file) BEFORE Plan 01 Task 4 captures the baseline. Once Task 4 lands the
 * cohort tests stop skipping.
 *
 * Run:
 *   pnpm exec playwright test tests/v1.9-phase66-aes04-diff.spec.ts --grep strict --project=chromium
 *   pnpm exec playwright test tests/v1.9-phase66-aes04-diff.spec.ts --grep cohort --project=chromium
 *   pnpm exec playwright test tests/v1.9-phase66-aes04-diff.spec.ts --list   --project=chromium  # enumerate (20 total)
 */

const ROUTES = [
  { path: "/", slug: "home" },
  { path: "/system", slug: "system" },
  { path: "/init", slug: "init" },
  { path: "/inventory", slug: "inventory" },
  { path: "/reference", slug: "reference" },
] as const;

const VIEWPORTS_STRICT = [
  { name: "desktop-1440x900", width: 1440, height: 900 },
  { name: "ipad-834x1194", width: 834, height: 1194 },
] as const;

const VIEWPORTS_COHORT = [
  { name: "iphone13-390x844", width: 390, height: 844 },
  { name: "mobile-360x800", width: 360, height: 800 },
] as const;

const STRICT_BASELINE_DIR = path.resolve(
  process.cwd(),
  ".planning/visual-baselines/v1.8-start"
);
const COHORT_BASELINE_DIR = path.resolve(
  process.cwd(),
  ".planning/visual-baselines/v1.9-pre"
);
const POST_DIR = path.resolve(
  process.cwd(),
  ".planning/phases/66-scalecanvas-track-b-architectural-decision/66-aes04-postcapture"
);
const COHORT_RESULTS = path.resolve(
  process.cwd(),
  ".planning/phases/66-scalecanvas-track-b-architectural-decision/66-cohort-results.md"
);

type Row = {
  slug: string;
  viewport: string;
  diffPct: number;
  passed: boolean;
};

const cohortRows: Row[] = [];

type RouteSpec = (typeof ROUTES)[number];
type ViewportSpec = { name: string; width: number; height: number };

/**
 * Capture a route+viewport screenshot to POST_DIR and pixel-diff it against
 * baselineDir. Returns diffPct (0..100). Throws on dimension drift in strict
 * mode; cohort caller wraps + tolerates.
 */
async function captureAndDiff(
  page: import("@playwright/test").Page,
  route: RouteSpec,
  vp: ViewportSpec,
  baselineDir: string,
  { tolerateDimensionDrift }: { tolerateDimensionDrift: boolean }
): Promise<{ diffPct: number; dimensionDrift: boolean }> {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(route.path, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.load('700 100px "Anton"'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(100);
  await expect(page.locator("nextjs-portal")).toHaveCount(0);

  await fs.mkdir(POST_DIR, { recursive: true });
  const postPath = path.join(POST_DIR, `${route.slug}-${vp.name}.png`);
  await page.screenshot({
    path: postPath,
    fullPage: true,
    caret: "hide",
    animations: "disabled",
  });

  const basePath = path.join(baselineDir, `${route.slug}-${vp.name}.png`);
  const baseRaw = await fs.readFile(basePath);
  const postRaw = await fs.readFile(postPath);
  const baseImg = PNG.sync.read(baseRaw);
  const postImg = PNG.sync.read(postRaw);

  if (
    baseImg.width !== postImg.width ||
    baseImg.height !== postImg.height
  ) {
    if (tolerateDimensionDrift) {
      // Cohort mode: dimension drift is expected by-design when pillarbox
      // ships (mobile flips from scaled to native). Record 100% and move on.
      return { diffPct: 100, dimensionDrift: true };
    }
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
  return { diffPct, dimensionDrift: false };
}

test.describe("@v1.9-phase66-aes04 strict desktop+tablet", () => {
  for (const route of ROUTES) {
    for (const vp of VIEWPORTS_STRICT) {
      test(`${route.slug} @ ${vp.name}`, async ({ page }) => {
        const { diffPct } = await captureAndDiff(page, route, vp, STRICT_BASELINE_DIR, {
          tolerateDimensionDrift: false,
        });
        // Threshold from AESTHETIC-OF-RECORD.md §AES-04: ≤0.5%.
        expect(
          diffPct,
          `${route.slug}@${vp.name} pixel-diff ${diffPct.toFixed(3)}% > 0.5%`
        ).toBeLessThanOrEqual(0.5);
      });
    }
  }
});

test.describe("@v1.9-phase66-aes04 cohort mobile+iphone13", () => {
  test.skip(
    !existsSync(COHORT_BASELINE_DIR),
    "v1.9-pre/ baseline not yet captured (run Plan 01 Task 4 first)"
  );

  for (const route of ROUTES) {
    for (const vp of VIEWPORTS_COHORT) {
      test(`${route.slug} @ ${vp.name}`, async ({ page }) => {
        const { diffPct, dimensionDrift } = await captureAndDiff(
          page,
          route,
          vp,
          COHORT_BASELINE_DIR,
          { tolerateDimensionDrift: true }
        );
        // Capture-only: record but do NOT fail. AES-03 cohort review is
        // qualitative — the spec exists to drive a deterministic capture
        // surface, not to gate on a numeric threshold (would be no-information
        // since pillarbox by-design produces ~100% diff on mobile).
        cohortRows.push({
          slug: route.slug,
          viewport: vp.name,
          diffPct,
          passed: !dimensionDrift && diffPct < 0.5,
        });
        // Soft sanity assertion — run produced *some* number, not NaN.
        expect(Number.isFinite(diffPct)).toBe(true);
      });
    }
  }

  test.afterAll(async () => {
    if (cohortRows.length === 0) return;
    const lines: string[] = [
      "# Phase 66 Plan 03 — AES-03 Cohort Diff Results",
      "",
      "> Capture-only — diffPct is informational. Pillarbox below sm flips mobile",
      "> from scaled-canvas mode to native pixel mode by design; diff vs v1.9-pre",
      "> baseline reflects the design tradeoff. AES-03 cohort review (manual,",
      "> recorded in 66-COHORT-REVIEW.md) is the gating verdict — NOT this file.",
      "",
      "| Route | Viewport | Diff % | < 0.5% |",
      "|-------|----------|--------|--------|",
      ...cohortRows.map(
        (r) =>
          `| ${r.slug} | ${r.viewport} | ${r.diffPct.toFixed(3)}% | ${
            r.passed ? "yes" : "no"
          } |`
      ),
      "",
      `Total: ${cohortRows.length}. Sub-0.5%: ${
        cohortRows.filter((r) => r.passed).length
      }.`,
      "",
      "Baseline: `.planning/visual-baselines/v1.9-pre/` (Plan 01 Task 4).",
      "Postcapture: `.planning/phases/66-scalecanvas-track-b-architectural-decision/66-aes04-postcapture/`.",
    ];
    await fs.writeFile(COHORT_RESULTS, lines.join("\n") + "\n");
  });
});
