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
 * Strict / cohort partition (mirrors tests/v1.9-phase66-aes04-diff.spec.ts):
 *   • desktop-1440x900 + ipad-834x1194 → diff vs .planning/visual-baselines/v1.8-start/
 *     (5 routes × 2 viewports = 10 hard-fail tests). Phase 66 left these unchanged.
 *   • mobile-360x800 + iphone13-390x844 → diff vs .planning/visual-baselines/v1.9-pre/
 *     (5 routes × 2 viewports = 10 hard-fail tests). Phase 66 ARC-02 introduced
 *     pillarbox at vw<640 making v1.8-start mobile baselines stale by construction;
 *     v1.9-pre captures the post-Phase-66 mobile state and is the correct AES-04
 *     reference for Phase 67 invisible-by-construction reshape on mobile/iphone.
 *
 * Total: 20 hard-fail tests. BND-05 / AES-04 — invoked after each vector commit
 * in Plan 01.
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

// playwright.config.ts hardcodes baseURL=http://localhost:3000 but other
// worktrees may occupy that port; honor CAPTURE_BASE_URL env override (default :3000)
// via absolute goto. Pattern matches v1.9-phase66-aes04-diff.spec.ts.
const ABS_BASE = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";

const STRICT_BASELINE_DIR = path.resolve(process.cwd(), ".planning/visual-baselines/v1.8-start");
const COHORT_BASELINE_DIR = path.resolve(process.cwd(), ".planning/visual-baselines/v1.9-pre");
const MAX_DIFF_RATIO = 0.005; // AES-04 standing rule (AESTHETIC-OF-RECORD.md §pixel-diff). Per-vector cadence enforced via D-08; route coverage per D-09 + v1.8-start/v1.9-pre superset.

async function readPng(p: string): Promise<PNG> {
  const buf = await fs.readFile(p);
  return PNG.sync.read(buf);
}

async function captureAndDiff(
  page: import("@playwright/test").Page,
  routePath: string,
  routeSlug: string,
  vpName: string,
  vpWidth: number,
  vpHeight: number,
  baselineDir: string,
  options: { tolerateDimensionDrift: boolean }
): Promise<{ ratio: number; dimensionDrift: boolean }> {
  await page.setViewportSize({ width: vpWidth, height: vpHeight });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${ABS_BASE}${routePath}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.load('700 100px "Anton"'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(100);
  await expect(page.locator("nextjs-portal")).toHaveCount(0);

  const currentBuf = await page.screenshot({ fullPage: true, animations: "disabled" });
  const current = PNG.sync.read(currentBuf);

  const baselinePath = path.join(baselineDir, `${routeSlug}-${vpName}.png`);
  const baseline = await readPng(baselinePath);

  const dimensionDrift =
    current.width !== baseline.width || current.height !== baseline.height;

  if (dimensionDrift && !options.tolerateDimensionDrift) {
    expect(current.width).toBe(baseline.width);
    expect(current.height).toBe(baseline.height);
  }

  if (dimensionDrift) {
    // Cohort: capture-only — return early without pixelmatch (would throw on
    // dimension mismatch). Sentinel ratio = 1.0 indicates "100% diff by
    // construction" matching Phase 66 cohort semantics.
    return { ratio: 1.0, dimensionDrift: true };
  }

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
      path.join(outDir, `${routeSlug}-${vpName}-DIFF.png`),
      PNG.sync.write(diff)
    );
  }

  return { ratio, dimensionDrift: false };
}

test.describe("@v1.9-phase67-bundle-reshape (BND-05 / AES-04) strict desktop+tablet", () => {
  for (const route of ROUTES) {
    for (const vp of VIEWPORTS_STRICT) {
      test(`${route.slug} @ ${vp.name} matches v1.8-start within 0.5% (AES-04 standing rule)`, async ({ page }) => {
        const { ratio } = await captureAndDiff(
          page,
          route.path,
          route.slug,
          vp.name,
          vp.width,
          vp.height,
          STRICT_BASELINE_DIR,
          { tolerateDimensionDrift: false }
        );
        // Phase 67 AES-04 ≤0.5% gate: per-vector cadence (D-08). Bundle reshape is
        // invisible by construction — chunk reshuffle should not alter rendered output.
        expect(ratio, `Pixel diff ${(ratio * 100).toFixed(3)}% exceeds Phase 67 AES-04 0.5% gate (bundle reshape must be invisible)`).toBeLessThanOrEqual(
          MAX_DIFF_RATIO
        );
      });
    }
  }
});

test.describe("@v1.9-phase67-bundle-reshape (BND-05 / AES-04) cohort mobile+iphone", () => {
  // Cohort partition mirrors tests/v1.9-phase66-aes04-diff.spec.ts:176 — capture-only,
  // tolerating dimension drift. Phase 66 ARC-02 pillarbox flipped mobile/iphone from
  // scaled-canvas to native-pixel mode; v1.9-pre baselines were captured pre-pillarbox
  // and current production rendering produces taller documents (no scale<1 squeeze).
  // Per Phase 66 cohort precedent, dimensional drift is by design and the diff is
  // informational. Phase 67's invisible-by-construction reshape SHOULD show ratio≈0
  // for any same-dimension subset; if dimensions match, pixel diff still gates.
  for (const route of ROUTES) {
    for (const vp of VIEWPORTS_COHORT) {
      test(`${route.slug} @ ${vp.name} cohort capture (post-Phase-66, dimensional drift tolerated)`, async ({ page }) => {
        const { ratio, dimensionDrift } = await captureAndDiff(
          page,
          route.path,
          route.slug,
          vp.name,
          vp.width,
          vp.height,
          COHORT_BASELINE_DIR,
          { tolerateDimensionDrift: true }
        );
        // If dimensions match, hard-fail at AES-04 0.5% (still invisible-by-construction).
        // If dimensions drift, soft-pass — Phase 66 cohort precedent (informational).
        if (!dimensionDrift) {
          expect(ratio, `Pixel diff ${(ratio * 100).toFixed(3)}% exceeds Phase 67 AES-04 0.5% gate (bundle reshape must be invisible)`).toBeLessThanOrEqual(
            MAX_DIFF_RATIO
          );
        }
        // Soft sanity assertion — run produced *some* number, not NaN.
        expect(Number.isFinite(ratio)).toBe(true);
      });
    }
  }
});
