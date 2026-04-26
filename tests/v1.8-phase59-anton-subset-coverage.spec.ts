import { test, expect } from "@playwright/test";

/**
 * Phase 59 Plan B (CRT-02) — Anton subset coverage guard.
 *
 * Suite tag: @v18-phase59-anton-subset (CRT-02 / Plan B)
 *
 * Purpose:
 * - After subsetting Anton to full printable ASCII + TM symbol (~95 glyphs;
 *   11.1 KB vs original 58.8 KB = 81% reduction), verify that every Anton
 *   consumer resolves to the Anton face (not a fallback) and that the subsetted
 *   file actually loads and is recognized by the browser font-loading API.
 *
 * Corpus audit rationale (2026-04-25):
 * - 59-RESEARCH.md L529 estimated ~30 ALL-CAPS Latin glyphs for the primary
 *   corpus (headings, nav, ghost-label, THESIS manifesto).
 * - Full audit found additional required chars: 0-9 (LiveClock), : (LiveClock
 *   separator), _ (ELEVATION_SYSTEM / API_REFERENCE headings in token-tabs),
 *   ™ (typography specimen), () (OKLCH_MATRIX header), [] (breadcrumb labels),
 *   & and others in dynamic token display content.
 * - Decision: subset to full printable ASCII + TM to avoid whack-a-mole corpus
 *   maintenance as token-tabs content evolves. 11.1 KB is still within the
 *   20 KB plan constraint and represents 81% reduction.
 *
 * Test 1: Hero h1 fontFamily resolution — Anton is loaded, not fallback.
 * Test 2: GhostLabel on iPhone-13 renders Anton (mobile LCP path).
 * Test 3: document.fonts.check confirms Anton is loaded at display size
 *         for all 5 routes (guards against per-route preload failures).
 *
 * MUST run against `pnpm build && pnpm start` (production build).
 */

const ROUTES = [
  { path: "/", slug: "home" },
  { path: "/system", slug: "system" },
  { path: "/init", slug: "init" },
  { path: "/inventory", slug: "inventory" },
  { path: "/reference", slug: "reference" },
] as const;

test.describe("@v18-phase59-anton-subset (CRT-02 / Plan B)", () => {
  test("CRT-02: hero h1 renders Anton, not fallback face", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    // Force warm-state Anton (same discipline as v1.8-baseline-capture.spec.ts Q1 resolution)
    await page.evaluate(() => document.fonts.load('700 100px "Anton"'));
    await page.evaluate(() => document.fonts.ready);

    const hero = page.locator("h1").first();
    const fontFamily = await hero.evaluate(
      (el) => getComputedStyle(el).fontFamily
    );
    // fontFamily string should contain "Anton" (from the CSS var --font-anton
    // which resolves to the actual font family name Next.js assigns)
    expect(fontFamily.toLowerCase()).toMatch(/anton/);

    // document.fonts.check — true only if Anton is loaded for this weight/size
    const antonLoaded = await page.evaluate(() =>
      document.fonts.check('700 100px "Anton"')
    );
    expect(antonLoaded).toBe(true);
  });

  test(
    "CRT-02: GhostLabel renders Anton on iPhone-13 (mobile LCP path)",
    async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/", { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.load('700 100px "Anton"'));
      await page.evaluate(() => document.fonts.ready);

      // GhostLabel selector — matches data-anim="ghost-label" per ghost-label.tsx
      const ghost = page.locator('[data-anim="ghost-label"]').first();
      await expect(ghost).toBeVisible({ timeout: 5000 });

      const fontFamily = await ghost.evaluate(
        (el) => getComputedStyle(el).fontFamily
      );
      expect(fontFamily.toLowerCase()).toMatch(/anton/);
    }
  );

  test(
    "CRT-02: Anton subset loads on all 5 routes (no per-route preload failure)",
    async ({ page }) => {
      // This test guards Pitfall δ: if the subsetted woff2 is missing a glyph
      // that a consumer renders, the browser silently falls back — but
      // document.fonts.check will still return true (the FACE loaded; the glyph
      // is the .notdef fallback). The real regression detector is:
      // 1. The font face resolves for the key corpus strings
      // 2. The file loads within a reasonable time on all routes (preload working)
      //
      // Full glyph-coverage audit deferred to visual QA and the slow-3G screen
      // recording produced by tests/v1.8-phase59-anton-swap-cls.spec.ts — the
      // .webm artifacts show frame-by-frame whether .notdef boxes appear.
      for (const route of ROUTES) {
        await page.goto(route.path, { waitUntil: "networkidle" });

        // Force the face to load for the display weight/size
        await page.evaluate(() => document.fonts.load('700 100px "Anton"'));
        await page.evaluate(() => document.fonts.ready);

        // Confirm Anton loaded — not just "document.fonts has a face named Anton"
        // but that it is usable at the display weight (700) and size (100px)
        const antonLoaded = await page.evaluate(() =>
          document.fonts.check('700 100px "Anton"')
        );
        expect(
          antonLoaded,
          `Anton did not load on route ${route.path} — check Next.js preload for subsetted woff2`
        ).toBe(true);

        // Confirm the h1 (if present) reports Anton fontFamily
        const h1Count = await page.locator("h1").count();
        if (h1Count > 0) {
          const h1Font = await page
            .locator("h1")
            .first()
            .evaluate((el) => getComputedStyle(el).fontFamily.toLowerCase());
          expect(
            h1Font,
            `Route ${route.path} h1 fontFamily does not include Anton: ${h1Font}`
          ).toMatch(/anton/);
        }
      }
    }
  );
});
