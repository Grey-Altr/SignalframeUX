/**
 * Phase 27 — Integration Bug Fixes
 * Tests for IBF-01 (ID/registry mismatch), IBF-02 (SignalOverlay suppression),
 * IBF-03 (stale docId on registry entry 102)
 *
 * Assumes dev server is running on http://localhost:3000
 */
import { test, expect } from "@playwright/test";

test.describe("Phase 27 — Integration Bug Fixes", () => {

  // ── IBF-01: Homepage COMPONENTS IDs match COMPONENT_REGISTRY keys ──────────

  test("IBF-01: CARD grid cell opens detail panel with CARD data from registry 005", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('[data-section="component-grid"]', { timeout: 10000 });
    // Find the grid cell with text CARD and click it
    const cardCell = page.locator('[data-section="component-grid"]').getByText("CARD", { exact: true }).first();
    await cardCell.click();
    // Detail panel should show CARD — verify the panel heading or name matches
    const panel = page.locator('[role="region"][aria-label*="component details"]');
    await panel.waitFor({ state: "visible", timeout: 8000 });
    // The panel should contain "SFCard" or "CARD" as the component name from registry "005"
    await expect(panel.getByText("SFCard")).toBeVisible({ timeout: 5000 });
  });

  test("IBF-01: WAVEFORM grid cell opens detail panel with WAVEFORM data from registry 102", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('[data-section="component-grid"]', { timeout: 10000 });
    const waveCell = page.locator('[data-section="component-grid"]').getByText("WAVEFORM", { exact: true }).first();
    await waveCell.click();
    const panel = page.locator('[role="region"][aria-label*="component details"]');
    await panel.waitFor({ state: "visible", timeout: 8000 });
    // Should show Waveform component name from registry "102"
    await expect(panel.getByText("Waveform")).toBeVisible({ timeout: 5000 });
  });

  test("IBF-01: BADGE grid cell exists (replaced DROPDOWN) with registry 008 data", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('[data-section="component-grid"]', { timeout: 10000 });
    // DROPDOWN should not exist; BADGE should be present
    const dropdownCell = page.locator('[data-section="component-grid"]').getByText("DROPDOWN", { exact: true });
    await expect(dropdownCell).toHaveCount(0);
    const badgeCell = page.locator('[data-section="component-grid"]').getByText("BADGE", { exact: true }).first();
    await expect(badgeCell).toBeVisible();
  });

  // ── IBF-02: SignalOverlay suppressed when detail panel is open ─────────────

  test("IBF-02: SignalOverlay toggle has pointer-events:none when detail panel is open", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('[data-section="component-grid"]', { timeout: 10000 });
    // Open a detail panel
    const firstCell = page.locator('[data-section="component-grid"] [role="button"]').first();
    await firstCell.click();
    const panel = page.locator('[role="region"][aria-label*="component details"]');
    await panel.waitFor({ state: "visible", timeout: 8000 });
    // Check that signal-overlay-toggle has pointer-events: none
    const toggle = page.locator('.signal-overlay-toggle');
    if (await toggle.count() > 0) {
      const pe = await toggle.evaluate(el => getComputedStyle(el).pointerEvents);
      expect(pe).toBe("none");
    }
  });

  // ── IBF-03: WAVEFORM detail CODE tab shows waveformSignal importPath ────────

  test("IBF-03: WAVEFORM detail CODE tab shows waveformSignal importPath", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('[data-section="component-grid"]', { timeout: 10000 });
    const waveCell = page.locator('[data-section="component-grid"]').getByText("WAVEFORM", { exact: true }).first();
    await waveCell.click();
    const panel = page.locator('[role="region"][aria-label*="component details"]');
    await panel.waitFor({ state: "visible", timeout: 8000 });
    // Switch to CODE tab
    const codeTab = panel.getByRole("tab", { name: "CODE" });
    await codeTab.click();
    // Should show the waveformSignal import path, not stale "@sfux/signal"
    await expect(panel.getByText("@/components/animation/waveform")).toBeVisible({ timeout: 5000 });
    // Should NOT show stale import path
    await expect(panel.getByText("@sfux/signal")).toHaveCount(0);
  });

});
