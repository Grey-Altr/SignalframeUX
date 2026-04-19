import { test, expect } from "@playwright/test";

test.describe("@dossier / KLOROFORM", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
  });

  test("chrome: four corner labels render", async ({ page }) => {
    await expect(page.locator("[data-corner='tl']")).toBeVisible();
    await expect(page.locator("[data-corner='tr']")).toBeVisible();
    await expect(page.locator("[data-corner='bl']")).toBeVisible();
    await expect(page.locator("[data-corner='br']")).toBeVisible();
  });

  test("chrome: catalog-nav has six entries and /  is active", async ({ page }) => {
    const nav = page.locator("nav[aria-label='Dossier catalog']");
    await expect(nav.locator("a")).toHaveCount(6);
    const active = nav.locator("a[aria-current='page']");
    await expect(active).toHaveCount(1);
    await expect(active).toHaveText("SF//KLO-00");
  });

  test("substrate: route is black-field", async ({ page }) => {
    const root = page.locator("[data-dossier-route='kloroform']");
    await expect(root).toHaveAttribute("data-substrate", "black");
  });

  test("plate: Syne display font is loaded", async ({ page }) => {
    const hero = page.locator("[data-plate='kloroform-hero']");
    await expect(hero).toBeVisible();
    const family = await hero.evaluate((el) =>
      getComputedStyle(el).fontFamily
    );
    expect(family).toMatch(/Syne/i);
  });

  test("plate: pointcloud canvas renders", async ({ page }) => {
    const canvas = page.locator("[data-plate='kloroform-pointcloud']");
    await expect(canvas).toBeVisible();
  });

  test("plate: six route-preview tiles present", async ({ page }) => {
    const tiles = page.locator("[data-plate='kloroform-tile']");
    await expect(tiles).toHaveCount(6);
  });

  test("no console errors on load", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
  });
});
