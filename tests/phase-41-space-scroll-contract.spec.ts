import { test, expect } from "@playwright/test";

/**
 * Phase 41 — keyboard scroll ownership contract.
 *
 * Contract:
 * 1) Space detents by one viewport in normal scroll zones.
 * 2) Space near page bottom triggers the back-to-top accessibility shortcut.
 */

const ROUTES = ["/", "/inventory", "/system", "/init", "/reference"] as const;
const WAIT_AFTER_SPACE_MS = 1400;

test.describe("@phase41 keyboard space-scroll contract", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  for (const route of ROUTES) {
    test(`Space contract holds on ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2000);

      // Mid-page behavior: detent scroll owns Space.
      const detentBefore = await page.evaluate(() => Math.round(window.scrollY));
      await page.focus("body");
      await page.keyboard.press("Space");
      await page.waitForTimeout(WAIT_AFTER_SPACE_MS);
      const detentAfter = await page.evaluate(() => Math.round(window.scrollY));
      expect(detentAfter).toBeGreaterThan(detentBefore);

      // Near-bottom behavior: back-to-top shortcut owns Space.
      const backToTopBefore = await page.evaluate(() => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const target = Math.max(0, maxScroll - 120);
        window.scrollTo(0, target);
        return Math.round(window.scrollY);
      });
      await page.waitForTimeout(250);
      await page.focus("body");
      await page.keyboard.press("Space");
      await page.waitForTimeout(WAIT_AFTER_SPACE_MS);
      const backToTopAfter = await page.evaluate(() => Math.round(window.scrollY));
      expect(backToTopBefore).toBeGreaterThan(0);
      expect(backToTopAfter).toBeLessThanOrEqual(5);
    });
  }
});
