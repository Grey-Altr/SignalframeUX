import { test, expect } from "@playwright/test";

/**
 * Phase 59 Plan B (CRT-02) — Anton subset coverage guard.
 *
 * Suite tag: @v18-phase59-anton-subset (CRT-02 / Plan B)
 *
 * Purpose:
 * - After subsetting Anton to ALL-CAPS Latin (~30 glyphs), verify that
 *   every Anton consumer in production HTML resolves to the Anton face
 *   (not a fallback) and that no glyph outside the locked subset corpus
 *   appears on any Anton-styled element.
 *
 * Test 1: Hero h1 fontFamily resolution — Anton is loaded, not fallback.
 * Test 2: GhostLabel on iPhone-13 renders Anton (mobile LCP path).
 * Test 3: Per-route codepoint guard — every rendered Anton glyph is in the
 *          locked subset; any character outside it fails the spec, catching
 *          Pitfall δ (copy edit introducing apostrophe / non-Latin char).
 *
 * MUST run against `pnpm build && pnpm start` (production build).
 * On pre-subset main (current): Tests 1+2 may pass (Anton.woff2 is present,
 * fontFamily resolves, display:optional loads on warm state).
 * Test 3 passes vacuously on the full-glyph woff2 because the full set
 * is a superset of the subset — after subsetting, Test 3 becomes the
 * regression detector (any new glyph outside the subset causes a CI fail).
 */

const ROUTES = [
  { path: "/", slug: "home" },
  { path: "/system", slug: "system" },
  { path: "/init", slug: "init" },
  { path: "/inventory", slug: "inventory" },
  { path: "/reference", slug: "reference" },
] as const;

/**
 * Locked subset corpus per 59-RESEARCH.md L529.
 * ALL-CAPS Latin uppercase + structural punctuation only.
 * Any Anton text using characters outside this set indicates a glyph leak
 * that would cause a blank-glyph fallback rendering in browsers.
 *
 * Note: "J" is intentionally absent from the corpus — not present in any
 * verified Anton consumer text at time of subsetting. Retain in SUBSET_GLYPHS
 * only if a consumer is added that uses it.
 */
const SUBSET_GLYPHS = new Set([
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "K", "L", "M",
  "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
  "/", " ", ".", ",",
]);

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
    "CRT-02: all rendered Anton glyphs are in the locked subset",
    async ({ page }) => {
      for (const route of ROUTES) {
        await page.goto(route.path, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.load('700 100px "Anton"'));
        await page.evaluate(() => document.fonts.ready);

        const renderedGlyphs = await page.evaluate(() => {
          // Collect all elements whose resolved fontFamily includes "Anton"
          // (case-insensitive; covers both the CSS var name and the resolved
          // family name that Next.js assigns to the subsetted face)
          const elements = Array.from(document.querySelectorAll("*")).filter(
            (el) => {
              const ff = getComputedStyle(el).fontFamily.toLowerCase();
              return ff.includes("anton");
            }
          );
          const text = elements
            .map((el) => (el as HTMLElement).textContent ?? "")
            .join("");
          return Array.from(new Set(text.split(""))).filter(
            (c) => c.length > 0
          );
        });

        // Filter to only non-whitespace glyphs outside the allowed set
        // (whitespace is a special case — included in SUBSET_GLYPHS as " ")
        const leaked = renderedGlyphs.filter((g) => !SUBSET_GLYPHS.has(g));
        expect(
          leaked,
          `Route ${route.path} renders Anton glyphs outside subset: ${JSON.stringify(leaked)}`
        ).toEqual([]);
      }
    }
  );
});
