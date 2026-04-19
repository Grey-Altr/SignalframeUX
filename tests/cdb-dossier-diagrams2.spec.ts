import { test, expect } from "@playwright/test";

test.describe("@dossier /builds Diagrams2", () => {
  test("index: paper substrate applied", async ({ page }) => {
    await page.goto("/builds", { waitUntil: "domcontentloaded" });
    const root = page.locator("[data-dossier-route='diagrams2']");
    await expect(root).toHaveAttribute("data-substrate", "paper-warm");
  });

  test("index: IBM Plex Sans Condensed on title", async ({ page }) => {
    await page.goto("/builds", { waitUntil: "domcontentloaded" });
    const title = page.locator("[data-plate='diagrams2-title']");
    const family = await title.evaluate((el) => getComputedStyle(el).fontFamily);
    expect(family).toMatch(/Plex.*Condensed/i);
  });

  test("index: schematic has 6 build nodes", async ({ page }) => {
    await page.goto("/builds", { waitUntil: "domcontentloaded" });
    const nodes = page.locator("[data-plate='diagrams2-node']");
    await expect(nodes).toHaveCount(6);
  });

  test("index: nodes link to /builds/[slug]", async ({ page }) => {
    await page.goto("/builds", { waitUntil: "domcontentloaded" });
    const firstNode = page.locator("[data-plate='diagrams2-node']").first();
    const href = await firstNode.locator("a").getAttribute("href");
    expect(href).toMatch(/^\/builds\/.+$/);
  });

  test("detail: renders with same substrate", async ({ page }) => {
    await page.goto("/builds", { waitUntil: "domcontentloaded" });
    const href = await page
      .locator("[data-plate='diagrams2-node'] a")
      .first()
      .getAttribute("href");
    await page.goto(href!, { waitUntil: "domcontentloaded" });
    const root = page.locator("[data-dossier-route='diagrams2']");
    await expect(root).toHaveAttribute("data-substrate", "paper-warm");
  });
});
