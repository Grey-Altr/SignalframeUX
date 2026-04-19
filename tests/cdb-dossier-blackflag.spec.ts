import { test, expect } from "@playwright/test";

test.describe("@dossier /inventory Black Flag", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/inventory", { waitUntil: "domcontentloaded" });
  });

  test("chrome: SF//E00-00 active", async ({ page }) => {
    const active = page.locator(
      "nav[aria-label='Dossier catalog'] a[aria-current='page']"
    );
    await expect(active).toHaveText("SF//E00-00");
  });

  test("plate: Anton font loaded on hero", async ({ page }) => {
    const hero = page.locator("[data-plate='blackflag-hero']");
    const family = await hero.evaluate((el) => getComputedStyle(el).fontFamily);
    expect(family).toMatch(/Anton/i);
  });

  test("plate: halftone wave present", async ({ page }) => {
    await expect(page.locator("[data-plate='blackflag-halftone']")).toBeVisible();
  });

  test("plate: serialized catalog has expected entries", async ({ page }) => {
    const entries = page.locator("[data-plate='blackflag-entry']");
    const count = await entries.count();
    expect(count).toBeGreaterThanOrEqual(40);
    expect(count).toBeLessThan(200);
  });

  test("plate: first entry has SF//E00-001 code", async ({ page }) => {
    await expect(
      page.locator("[data-plate='blackflag-entry']").first().locator("[data-plate='blackflag-code']")
    ).toHaveText("SF//E00-001");
  });

  test("no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
  });
});
