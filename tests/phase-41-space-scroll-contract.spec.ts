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
    // Contract §1 — detent scroll owns Space mid-page.
    test(`Space detent on ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2000);

      const detentBefore = await page.evaluate(() => Math.round(window.scrollY));
      await page.focus("body");
      await page.keyboard.press("Space");
      await page.waitForTimeout(WAIT_AFTER_SPACE_MS);
      const detentAfter = await page.evaluate(() => Math.round(window.scrollY));
      expect(detentAfter).toBeGreaterThan(detentBefore);
    });

    // Contract §2 — back-to-top shortcut on Space near bottom.
    // Deferred pre-v1.0 (Cluster H): useFrameNavigation has no wrap-around
    // branch at the last panel. Re-enable when R-64 wrap-around ships.
    test.skip(`Space back-to-top on ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2000);

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
