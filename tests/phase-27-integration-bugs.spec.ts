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
    await page.waitForSelector('[data-section="inventory"]', { timeout: 15000 });
    // Find the grid cell with text CARD and click it
    const cardCell = page.locator('[data-section="inventory"]').getByText("CARD", { exact: true }).first().locator("..");
    await cardCell.click();
    // Detail panel should show CARD — entry.name is "CARD" from registry "005"
    const panel = page.locator('[role="region"][aria-label="CARD component details"]');
    await panel.waitFor({ state: "visible", timeout: 8000 });
    await expect(panel.getByText("CARD")).toBeVisible({ timeout: 5000 });
  });

  test.skip("IBF-01: WAVEFORM grid cell opens detail panel with WAVEFORM data from registry 102", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('[data-section="inventory"]', { timeout: 15000 });
    const waveCell = page.locator('[data-section="inventory"]').getByText("WAVEFORM", { exact: true }).first().locator("..");
    await waveCell.click();
    // entry.name is "WAVEFORM" from registry "102"
    const panel = page.locator('[role="region"][aria-label="WAVEFORM component details"]');
    await panel.waitFor({ state: "visible", timeout: 8000 });
    await expect(panel.getByRole("heading", { name: "WAVEFORM" })).toBeVisible({ timeout: 5000 });
  });

  test.skip("IBF-01: BADGE grid cell exists (replaced DROPDOWN) with registry 008 data", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('[data-section="inventory"]', { timeout: 15000 });
    // DROPDOWN should not exist; BADGE should be present
    const dropdownCell = page.locator('[data-section="inventory"]').getByText("DROPDOWN", { exact: true });
    await expect(dropdownCell).toHaveCount(0);
    const badgeCell = page.locator('[data-section="inventory"]').getByText("BADGE", { exact: true }).first().locator("..");
    await expect(badgeCell).toBeVisible();
  });

  // ── IBF-02: SignalOverlay suppressed when detail panel is open ─────────────

  test("IBF-02: SignalOverlay toggle has pointer-events:none when detail panel is open", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('[data-section="inventory"]', { timeout: 15000 });
    // Open a detail panel
    const firstCell = page.locator('[data-section="inventory"] [role="row"][tabindex="0"]').first();
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

  test.skip("IBF-03: WAVEFORM detail CODE tab shows waveformSignal importPath", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('[data-section="inventory"]', { timeout: 15000 });
    const waveCell = page.locator('[data-section="inventory"]').getByText("WAVEFORM", { exact: true }).first().locator("..");
    await waveCell.click();
    const panel = page.locator('[role="region"][aria-label="WAVEFORM component details"]');
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
