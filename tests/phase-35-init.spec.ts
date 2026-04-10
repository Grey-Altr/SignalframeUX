import { test, expect } from "@playwright/test";

/**
 * Phase 35 /init tests — Wave 0 seed.
 *
 * Contains the mandatory Gap 2 EDGE-2 test carried over from Phase 34 shipped
 * compile-back. Per pre-brief at wiki/analyses/v1.5-phase35-brief.md §Test
 * Carry-Overs §Gap 2, this test MUST land Day 1 of Wave 0 before any other
 * Phase 35 layout work. The three-condition stack (375x667 + reducedMotion +
 * boundingBox overlap) is non-negotiable.
 *
 * Wave 1 (plan 35-02) will add the full /init assertion suite to this file.
 */

test.describe("@phase35 /init", () => {
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
