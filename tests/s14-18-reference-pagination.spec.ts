import { test, expect, type Page } from "@playwright/test";

const BASE = "http://localhost:3000";

/**
 * /reference is client-heavy: APIExplorerPaginated hydrates on the client,
 * CommandPalette is a dynamic import with ssr:false (keydown listener only
 * installs after the chunk loads), and useFrameNavigation rebuilds its panel
 * offset registry via RO+MO after hydration. Tests that interact with any of
 * these must wait for client readiness, not just DOM attach.
 */
async function gotoReferenceReady(page: Page, path: string = "/reference") {
  await page.goto(`${BASE}${path}`);
  await page.waitForLoadState("networkidle");
  // Explicit client-mount gate: APIExplorerPaginated is what publishes the
  // fit-mode panels and wires context state for hash/query.
  await page.locator('[data-panel-mode="fit"]').first().waitFor();
}

test.describe("§14.18 — /reference pagination retrofit", () => {
  test("Desktop panel count: hero + 3 components + aux = 5", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoReferenceReady(page);
    await expect(page.locator('[data-section="reference-hero"]')).toBeVisible();
    await expect(page.locator('[data-section="aux-surfaces"]')).toBeAttached();
    await expect(page.locator('[data-panel-mode="fit"]')).toHaveCount(5);
  });

  test("Mobile panel count: hero + 6 components + aux = 8", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoReferenceReady(page);
    await expect(page.locator('[data-section="components-6"]')).toBeAttached();
    await expect(page.locator('[data-section="aux-surfaces"]')).toBeAttached();
    await expect(page.locator('[data-panel-mode="fit"]')).toHaveCount(8);
  });

  test("R-64-c: Space advances from hero to first COMPONENTS panel", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoReferenceReady(page);
    await expect(page.locator('[data-section="reference-hero"]')).toBeInViewport();
    await page.keyboard.press("Space");
    await expect(page.locator('[data-section="components-1"]')).toBeInViewport({ ratio: 0.5 });
  });

  test("R-64-d: Space inside palette input enters char, does not advance", async ({ page }) => {
    // Palette keybind handler checks `e.key === "k"` (lowercase). Playwright
    // `Meta+K` uppercase produces e.key === "K" and misses — use lowercase
    // to match the existing r64j-overlay-focus-return convention.
    await gotoReferenceReady(page);
    await expect(page.locator('[data-section="reference-hero"]')).toBeInViewport();
    await page.keyboard.press("Meta+k");
    const input = page.locator("[cmdk-input]").first();
    await input.waitFor();
    await input.type("a b");
    await expect(input).toHaveValue("a b");
    await page.keyboard.press("Escape");
    await expect(page.locator('[data-section="reference-hero"]')).toBeInViewport();
  });

  test("R-64-j: focus returns to row after Esc closes detail", async ({ page }) => {
    // R-64-j invariant: user-triggered grid→detail swap restores focus to
    // the triggering row on swap-back. Must originate from the grid (rows
    // unmount in detail mode per api-index-panel.tsx:129), so deep-linking
    // to #SFButton cannot exercise this path — trigger the swap instead.
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoReferenceReady(page);
    const row = page.locator('[data-api-entry="SFButton"]').first();
    await row.scrollIntoViewIfNeeded();
    await row.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("[data-api-props-table]")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(row).toBeFocused();
  });

  test("Deep-link /reference#SFButton lands with detail visible", async ({ page }) => {
    await gotoReferenceReady(page, "/reference#SFButton");
    await expect(page.locator("[data-api-props-table]")).toBeVisible();
    await expect(page).toHaveURL(/#SFButton$/);
  });

  test("Filter ?q=button drops panel count below default", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoReferenceReady(page, "/reference?q=button");
    await expect(page.locator('[data-panel-mode="fit"]').first()).toBeVisible();
    const n = await page.locator('[data-panel-mode="fit"]').count();
    expect(n).toBeLessThan(5);
  });

  test("Zero-match ?q=zzzzzz shows NO MATCH panel, no AUX", async ({ page }) => {
    // Zero-match renders a no-match panel instead of APIExplorer panels,
    // so skip the fit-panel gate — just wait for networkidle.
    await page.goto(`${BASE}/reference?q=zzzzzz`);
    await page.waitForLoadState("networkidle");
    await expect(page.locator('[data-section="no-match"]')).toBeVisible();
    await expect(page.locator('[data-section="aux-surfaces"]')).toHaveCount(0);
  });

  test("Palette API-search → select navigates + opens detail", async ({ page }) => {
    await gotoReferenceReady(page);
    await expect(page.locator('[data-section="reference-hero"]')).toBeInViewport();
    await page.keyboard.press("Meta+k");
    const input = page.locator("[cmdk-input]").first();
    await input.waitFor();
    await input.fill("SFButton");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#SFButton$/);
    await expect(page.locator("[data-api-props-table]")).toBeVisible();
  });
});
