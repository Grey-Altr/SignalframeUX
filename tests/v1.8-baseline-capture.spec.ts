import { test, expect } from "@playwright/test";
import path from "node:path";

/**
 * Phase 57 DGN-03 — v1.8 baseline visual-of-record capture.
 *
 * MUST run against `pnpm build && pnpm start` (production build), NOT `pnpm dev`.
 * Pitfall B from RESEARCH §Common Pitfalls: dev-mode HMR overlay + React double-render
 * inflate captured PNGs and AES-04 pixel-diff false-positives downstream. The
 * spec asserts `nextjs-portal` (Next.js dev-overlay custom element) has count 0
 * BEFORE screenshot — a hard gate against accidental dev-mode capture.
 *
 * Q1 resolution: this spec FORCES warm-state Anton via document.fonts.load before
 * capture, so all 20 PNGs represent the warm-state rendering. Cold-state LCP
 * identity is captured separately by tests/v1.8-lcp-diagnosis.spec.ts (Plan 03).
 *
 * Output: .planning/visual-baselines/v1.8-start/{route-slug}-{viewport-name}.png
 * Re-run command: pnpm exec playwright test tests/v1.8-baseline-capture.spec.ts --project=chromium
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

test.describe("@v1.8-baseline visual-of-record capture (DGN-03)", () => {
  for (const route of ROUTES) {
    for (const vp of VIEWPORTS) {
      test(`${route.slug} @ ${vp.name}`, async ({ page }) => {
        // 1. Pin the viewport.
        await page.setViewportSize({ width: vp.width, height: vp.height });

        // 2. Reduced-motion variant — short-circuits GSAP scroll-triggered
        //    reveals so the captured state is deterministic across runs
        //    (per RESEARCH §Q3; AES-04 reproducibility).
        await page.emulateMedia({ reducedMotion: "reduce" });

        // 3. Navigate and let initial network settle.
        await page.goto(route.path, { waitUntil: "networkidle" });

        // 4. FORCE warm-state Anton (Q1 resolution): document.fonts.load
        //    against Anton's full weight + size so display: optional
        //    cannot skip the face. Then await fonts.ready for the
        //    full font-loading-API resolution.
        await page.evaluate(() => document.fonts.load('700 100px "Anton"'));
        await page.evaluate(() => document.fonts.ready);

        // 5. One rAF tick of slack so any font-driven layout settles.
        await page.waitForTimeout(100);

        // 6. Hard gate against accidental dev-mode capture (Pitfall B).
        //    Next.js dev mode injects a <nextjs-portal> custom element as the
        //    parent of the error tab + HMR indicators. Production builds do
        //    not. Asserting count === 0 before screenshot turns
        //    "no dev overlay markers in PNG" from a post-hoc human eye-check
        //    into a spec-side gate.
        await expect(page.locator("nextjs-portal")).toHaveCount(0);

        // 7. Capture full-page PNG directly to the baseline dir.
        //    Plan 02 SEEDS the baselines; AES-04 per-phase diff is a
        //    separate Phase 58+ harness that compares against these PNGs.
        const outPath = path.join(
          BASELINE_DIR,
          `${route.slug}-${vp.name}.png`
        );
        await page.screenshot({
          path: outPath,
          fullPage: true,
          caret: "hide",
          animations: "disabled",
        });

        // 8. Sanity assertion — file exists and is non-empty.
        const fs = await import("node:fs/promises");
        const stat = await fs.stat(outPath);
        expect(stat.size).toBeGreaterThan(1024); // > 1KB; empty PNGs would be ~50 bytes
      });
    }
  }
});
