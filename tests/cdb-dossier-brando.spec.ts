import { test, expect } from "@playwright/test";

test.describe("@dossier /reference Brando Y2K", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/reference", { waitUntil: "domcontentloaded" });
  });

  test("chrome: SF//MRK-00 active", async ({ page }) => {
    const active = page.locator(
      "nav[aria-label='Dossier catalog'] a[aria-current='page']"
    );
    await expect(active).toHaveText("SF//MRK-00");
  });

  test("substrate: paper-cream applied", async ({ page }) => {
    const root = page.locator("[data-dossier-route='brando']");
    await expect(root).toHaveAttribute("data-substrate", "paper-cream");
  });

  test("plate: Archivo Black on hero", async ({ page }) => {
    const hero = page.locator("[data-plate='brando-hero']");
    const family = await hero.evaluate((el) => getComputedStyle(el).fontFamily);
    expect(family).toMatch(/Archivo/i);
  });

  test("plate: 60 mark tiles render", async ({ page }) => {
    const marks = page.locator("[data-plate='brando-mark']");
    await expect(marks).toHaveCount(60);
  });

  test("plate: exactly one mark is magenta-lit", async ({ page }) => {
    const lit = page.locator("[data-plate='brando-mark'][data-lit='true']");
    await expect(lit).toHaveCount(1);
  });
});
