import { test, expect } from "@playwright/test";

test.describe("@dossier /init Helghanese", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/init", { waitUntil: "domcontentloaded" });
  });

  test("chrome: SF//HLG-00 active with lime-green", async ({ page }) => {
    const active = page.locator(
      "nav[aria-label='Dossier catalog'] a[aria-current='page']"
    );
    await expect(active).toHaveText("SF//HLG-00");
    const color = await active.evaluate((el) => getComputedStyle(el).color);
    // lime-green oklch(0.8 0.2 135). Chromium normalizes wide-gamut oklch to
    // either rgb(148, 230, 0)-ish or lab(78.93 -45.7 61.25)-ish depending on
    // build; both are green-dominant. Accept either and verify green dominance.
    const rgbMatch = /rgb\(\s*1[0-9]{2},\s*2[0-9]{2},\s*\d+\s*\)/.test(color);
    const labMatch = /lab\(\s*[5-9][0-9](?:\.\d+)?\s+-[3-9][0-9](?:\.\d+)?\s+[2-9][0-9](?:\.\d+)?/.test(color);
    expect(rgbMatch || labMatch).toBe(true);
  });

  test("plate: Zen Dots header loaded", async ({ page }) => {
    const header = page.locator("[data-plate='helghanese-header']");
    const family = await header.evaluate((el) => getComputedStyle(el).fontFamily);
    expect(family).toMatch(/Zen Dots/i);
  });

  test("plate: terminal session has at least 8 output lines", async ({ page }) => {
    const lines = page.locator("[data-plate='helghanese-line']");
    const count = await lines.count();
    expect(count).toBeGreaterThanOrEqual(8);
  });

  test("plate: blinking cursor present", async ({ page }) => {
    await expect(page.locator("[data-plate='helghanese-cursor']")).toBeVisible();
  });
});
