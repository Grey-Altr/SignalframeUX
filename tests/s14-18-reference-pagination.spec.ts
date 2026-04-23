import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

test.describe("§14.18 — /reference pagination retrofit", () => {
  test("Desktop panel count: hero + 3 components + aux = 5", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${BASE}/reference`);
    await expect(page.locator('[data-section="reference-hero"]')).toBeVisible();
    await expect(page.locator('[data-section="aux-surfaces"]')).toBeAttached();
    await expect(page.locator('[data-panel-mode="fit"]')).toHaveCount(5);
  });

  test("Mobile panel count: hero + 6 components + aux = 8", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE}/reference`);
    await expect(page.locator('[data-section="components-6"]')).toBeAttached();
    await expect(page.locator('[data-section="aux-surfaces"]')).toBeAttached();
    await expect(page.locator('[data-panel-mode="fit"]')).toHaveCount(8);
  });

  test("R-64-c: Space advances from hero to first COMPONENTS panel", async ({ page }) => {
    await page.goto(`${BASE}/reference`);
    await expect(page.locator('[data-section="reference-hero"]')).toBeInViewport();
    await page.keyboard.press("Space");
    await expect(page.locator('[data-section="components-1"]')).toBeInViewport({ ratio: 0.5 });
  });

  test("R-64-d: Space inside palette input enters char, does not advance", async ({ page }) => {
    await page.goto(`${BASE}/reference`);
    await expect(page.locator('[data-section="reference-hero"]')).toBeInViewport();
    await page.keyboard.press("Meta+K");
    const input = page.locator("[cmdk-input]").first();
    await input.focus();
    await input.type("a b");
    await expect(input).toHaveValue("a b");
    await page.keyboard.press("Escape");
    await expect(page.locator('[data-section="reference-hero"]')).toBeInViewport();
  });

  test("R-64-j: focus returns to row after Esc closes detail", async ({ page }) => {
    await page.goto(`${BASE}/reference#SFButton`);
    await expect(page.locator("[data-api-props-table]")).toBeVisible();
    const row = page.locator('[data-api-entry="SFButton"]').first();
    await row.focus();
    await page.keyboard.press("Escape");
    await expect(row).toBeFocused();
  });

  test("Deep-link /reference#SFButton lands with detail visible", async ({ page }) => {
    await page.goto(`${BASE}/reference#SFButton`);
    await expect(page.locator("[data-api-props-table]")).toBeVisible();
    await expect(page).toHaveURL(/#SFButton$/);
  });

  test("Filter ?q=button drops panel count below default", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${BASE}/reference?q=button`);
    await expect(page.locator('[data-panel-mode="fit"]').first()).toBeVisible();
    const n = await page.locator('[data-panel-mode="fit"]').count();
    expect(n).toBeLessThan(5);
  });

  test("Zero-match ?q=zzzzzz shows NO MATCH panel, no AUX", async ({ page }) => {
    await page.goto(`${BASE}/reference?q=zzzzzz`);
    await expect(page.locator('[data-section="no-match"]')).toBeVisible();
    await expect(page.locator('[data-section="aux-surfaces"]')).toHaveCount(0);
  });

  test("Palette API-search → select navigates + opens detail", async ({ page }) => {
    await page.goto(`${BASE}/reference`);
    await expect(page.locator('[data-section="reference-hero"]')).toBeInViewport();
    await page.keyboard.press("Meta+K");
    const input = page.locator("[cmdk-input]").first();
    await input.fill("SFButton");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#SFButton$/);
    await expect(page.locator("[data-api-props-table]")).toBeVisible();
  });
});
