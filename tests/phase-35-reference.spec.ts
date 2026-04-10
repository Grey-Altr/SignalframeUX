import { test, expect } from "@playwright/test";

/**
 * Phase 35 /reference tests — Wave 0 seed.
 *
 * Contains the mandatory Gap 2 EDGE-2 test (duplicated from phase-35-init.spec.ts
 * per brief §Visual-QA Wave 1 table: agents 3 AND 4 both own this assertion).
 * Wave 1 (plan 35-02) will add the full /reference assertion suite here.
 */

test.describe("@phase35 /reference", () => {
  test("EDGE-2: reduced-motion h1 does not overlap nav at 375x667", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 375, height: 667 });
    for (const route of ["/init", "/reference", "/system"]) {
      await page.goto(route);
      await expect(page.locator("body")).toHaveAttribute("data-nav-visible", "true");
      const h1Box = await page.locator("h1").first().boundingBox();
      const navBox = await page.locator("nav").first().boundingBox();
      expect(h1Box).not.toBeNull();
      expect(navBox).not.toBeNull();
      expect(h1Box!.y).toBeGreaterThanOrEqual(navBox!.y + navBox!.height);
    }
  });
});
