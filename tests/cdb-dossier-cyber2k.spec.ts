import { test, expect } from "@playwright/test";

test.describe("@dossier /system Cyber2k", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/system", { waitUntil: "domcontentloaded" });
  });

  test("chrome: SF//HUD-00 active", async ({ page }) => {
    const active = page.locator(
      "nav[aria-label='Dossier catalog'] a[aria-current='page']"
    );
    await expect(active).toHaveText("SF//HUD-00");
  });

  test("plate: Chakra Petch font loaded", async ({ page }) => {
    const hero = page.locator("[data-plate='cyber2k-hero']");
    const family = await hero.evaluate((el) => getComputedStyle(el).fontFamily);
    expect(family).toMatch(/Chakra Petch/i);
  });

  test("plate: octagon HUD frame renders", async ({ page }) => {
    await expect(page.locator("[data-plate='cyber2k-octagon']")).toBeVisible();
  });

  test("plate: token category legend present", async ({ page }) => {
    const legend = page.locator("[data-plate='cyber2k-legend'] li");
    await expect(legend).toHaveCount(3);
  });

  test("plate: diagnostic readout present", async ({ page }) => {
    await expect(page.locator("[data-plate='cyber2k-readout']")).toBeVisible();
  });

  test("no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
  });
});
