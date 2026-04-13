/**
 * Phase 25 — Interactive Detail Views & Site Integration
 * Behavioral tests for gaps DV-04 through DV-10, SI-01 through SI-03
 *
 * Assumes dev server is running on http://localhost:3000
 */
import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Click the first component card on /inventory and wait for the detail panel
 * to appear. Returns the panel locator.
 */
async function openFirstDetailOnComponentsPage(page: Page) {
  await page.goto("/inventory");
  // Wait for the explorer grid to be visible
  await page.waitForSelector('[role="listbox"]', { timeout: 10000 });
  // Click the first card (index 001 — BUTTON)
  const firstCard = page.locator('[role="option"]').first();
  await firstCard.click();
  // Panel is a region with aria-label containing "component details"
  const panel = page.locator('[role="region"][aria-label*="component details"]');
  await panel.waitFor({ state: "visible", timeout: 8000 });
  return panel;
}

// ── DV-04: Detail panel opens with 3 tabs ────────────────────────────────────

test("DV-04: ComponentDetail panel opens with VARIANTS, PROPS, CODE tabs", async ({ page }) => {
  const panel = await openFirstDetailOnComponentsPage(page);

  // All three tab triggers must be present with exact uppercase labels
  await expect(panel.getByRole("tab", { name: "VARIANTS" })).toBeVisible();
  await expect(panel.getByRole("tab", { name: "PROPS" })).toBeVisible();
  await expect(panel.getByRole("tab", { name: "CODE" })).toBeVisible();
});

// ── DV-05: VARIANTS tab renders live SF component instances ──────────────────

test("DV-05: VARIANTS tab renders live component instances for the opened entry", async ({ page }) => {
  const panel = await openFirstDetailOnComponentsPage(page);

  // VARIANTS is the default active tab — its content should already be visible
  const variantsTab = panel.getByRole("tab", { name: "VARIANTS" });
  await variantsTab.click();

  // The variants grid should contain at least one cell with a variant label
  const variantCells = panel.locator(".grid .flex.flex-col");
  await expect(variantCells.first()).toBeVisible();

  // Each cell has a label (uppercase monospace span below the preview)
  const labels = panel.locator(".grid .flex.flex-col span");
  const count = await labels.count();
  expect(count).toBeGreaterThan(0);
});

// ── DV-06: PROPS tab renders table with required columns ─────────────────────

test("DV-06: PROPS tab renders table with NAME, TYPE, DEFAULT, REQ, DESCRIPTION columns", async ({ page }) => {
  const panel = await openFirstDetailOnComponentsPage(page);

  await panel.getByRole("tab", { name: "PROPS" }).click();

  // Table must exist
  const table = panel.locator("table");
  await expect(table).toBeVisible();

  // All five column headers must be present
  const headerRow = table.locator("thead tr");
  await expect(headerRow.getByText("NAME")).toBeVisible();
  await expect(headerRow.getByText("TYPE")).toBeVisible();
  await expect(headerRow.getByText("DEFAULT")).toBeVisible();
  await expect(headerRow.getByText("REQ")).toBeVisible();
  await expect(headerRow.getByText("DESCRIPTION")).toBeVisible();

  // At least one data row should be present (BUTTON has props)
  const rows = table.locator("tbody tr");
  const rowCount = await rows.count();
  expect(rowCount).toBeGreaterThan(0);
});

// ── DV-07: CODE tab shows usage snippet and CLI install with copy buttons ─────

test("DV-07: CODE tab shows usage snippet and CLI install with copy-to-clipboard buttons", async ({ page }) => {
  // Track clipboard calls — headless-shell needs a mock for navigator.clipboard
  await page.addInitScript(() => {
    (window as any).__clipboardCallCount = 0;
    (window as any).__clipboardLastText = "";
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: (text: string) => {
          (window as any).__clipboardCallCount++;
          (window as any).__clipboardLastText = text;
          return Promise.resolve();
        },
        readText: () => Promise.resolve(""),
      },
      configurable: true,
    });
  });

  const panel = await openFirstDetailOnComponentsPage(page);

  await panel.getByRole("tab", { name: "CODE" }).click();

  // The USAGE label and a COPY button must be present
  await expect(panel.getByText("USAGE")).toBeVisible();
  // CLI INSTALL section
  await expect(panel.getByText("INSTALL")).toBeVisible();

  // There should be at least two COPY buttons (one for snippet, one for CLI)
  const copyButtons = panel.locator('button').filter({ hasText: /^COPY/ });
  const copyCount = await copyButtons.count();
  expect(copyCount).toBeGreaterThanOrEqual(2);

  // Click the first COPY button and verify navigator.clipboard.writeText was invoked
  await copyButtons.first().click();
  await page.waitForTimeout(300);

  const callCount = await page.evaluate(() => (window as any).__clipboardCallCount ?? 0);
  expect(callCount).toBeGreaterThanOrEqual(1);

  // Verify clipboard received non-empty text (the code snippet)
  const clipboardText = await page.evaluate(() => (window as any).__clipboardLastText ?? "");
  expect(clipboardText.length).toBeGreaterThan(0);
});

// ── DV-08: FRAME/SIGNAL badge and pattern tier visible in header ──────────────

test("DV-08: Detail header shows layer badge (FRAME/SIGNAL) and pattern tier (A/B/C)", async ({ page }) => {
  const panel = await openFirstDetailOnComponentsPage(page);

  // Layer badge — BUTTON is "frame" layer so badge text is FRAME
  const layerBadge = panel.locator('[class*="badge"], [class*="Badge"]').first();
  const badgeText = await layerBadge.textContent();
  expect(["FRAME", "SIGNAL"]).toContain(badgeText?.trim().toUpperCase());

  // Pattern tier — BUTTON is pattern A
  await expect(panel.getByText(/PATTERN [ABC]/)).toBeVisible();
});

// ── DV-09: Animation token callout for SIGNAL layer components ────────────────

test("DV-09: Animation token callout is shown for SIGNAL-layer components", async ({ page }) => {
  await page.goto("/inventory");
  await page.waitForSelector('[role="listbox"]', { timeout: 10000 });

  // Find a SIGNAL layer card — index 101 (NOISE_BG) is SIGNAL/GENERATIVE
  const signalCard = page.locator('[data-flip-id="101"]');

  // If the card is present (filter might hide it), click it; otherwise use filter
  const isVisible = await signalCard.isVisible().catch(() => false);
  if (!isVisible) {
    // Apply GENERATIVE filter to surface signal components
    await page.getByRole("button", { name: "GENERATIVE" }).click();
    await page.locator('[data-flip-id="101"]').waitFor({ state: "visible", timeout: 5000 });
  }
  await page.locator('[data-flip-id="101"]').click();

  const panel = page.locator('[role="region"][aria-label*="component details"]');
  await panel.waitFor({ state: "visible", timeout: 8000 });

  // Animation token callout — shown for signal layer only
  await expect(panel.getByText(/--duration|--ease/i)).toBeVisible();
});

// ── DV-10: Keyboard accessible — Escape closes panel, focus returns ───────────

test("DV-10: Pressing Escape closes the detail panel and returns focus to trigger card", async ({ page }) => {
  await page.goto("/inventory");
  await page.waitForSelector('[role="listbox"]', { timeout: 10000 });

  const firstCard = page.locator('[role="option"]').first();
  await firstCard.click();

  const panel = page.locator('[role="region"][aria-label*="component details"]');
  await panel.waitFor({ state: "visible", timeout: 8000 });

  // Press Escape
  await page.keyboard.press("Escape");

  // Panel should be gone (removed from DOM or hidden after GSAP close)
  await expect(panel).not.toBeVisible({ timeout: 3000 });

  // Focus should be back on the trigger card
  const focusedElement = await page.evaluate(() => document.activeElement?.getAttribute("aria-label"));
  // The first card has aria-label containing the component name
  expect(focusedElement).toBeTruthy();
});

// ── SI-01: ComponentsExplorer session state persists across navigation ─────────

test("SI-01: Detail panel open state persists via sessionStorage across navigation", async ({ page }) => {
  const panel = await openFirstDetailOnComponentsPage(page);
  await expect(panel).toBeVisible();

  // Navigate away
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // Navigate back
  await page.goto("/inventory");
  await page.waitForSelector('[role="listbox"]', { timeout: 10000 });

  // SessionStorage should restore the previously opened component
  const restoredPanel = page.locator('[role="region"][aria-label*="component details"]');
  await expect(restoredPanel).toBeVisible({ timeout: 8000 });
});

// ── SI-02: Homepage grid cards are clickable with same detail expansion ────────

test("SI-02: Homepage grid cards expand ComponentDetail panel with 3 tabs", async ({ page }) => {
  await page.goto("/");
  // Wait for the component grid section to render
  await page.waitForSelector('[data-section="inventory"]', { timeout: 10000 });

  // Click the first homepage component card (role="button" with aria-label)
  const firstCard = page.locator('[data-section="inventory"] [role="row"][tabindex="0"]').first();
  await expect(firstCard).toBeVisible({ timeout: 8000 });
  await firstCard.click();

  // Detail panel should appear
  const panel = page.locator('[role="region"][aria-label*="component details"]');
  await panel.waitFor({ state: "visible", timeout: 8000 });

  // Verify 3 tabs are present — same as /components behavior
  await expect(panel.getByRole("tab", { name: "VARIANTS" })).toBeVisible();
  await expect(panel.getByRole("tab", { name: "PROPS" })).toBeVisible();
  await expect(panel.getByRole("tab", { name: "CODE" })).toBeVisible();
});

// ── SI-03: DU/TDR aesthetic — sharp edges, uppercase labels, accent on active tab

test("SI-03: Panel uses DU/TDR aesthetic — uppercase labels, accent color on active tab, zero border-radius", async ({ page }) => {
  const panel = await openFirstDetailOnComponentsPage(page);

  // Active tab should have data-[state=active] and background change
  const activeTab = panel.locator('[role="tab"][data-state="active"]');
  await expect(activeTab).toBeVisible();

  // Active tab background should be the primary color (accent)
  const activeBg = await activeTab.evaluate((el) => getComputedStyle(el).backgroundColor);
  // Primary is set in globals — it should not be transparent
  expect(activeBg).not.toBe("rgba(0, 0, 0, 0)");
  expect(activeBg).not.toBe("transparent");

  // All tab labels should be uppercase
  const tabTexts = await panel.locator('[role="tab"]').allTextContents();
  for (const text of tabTexts) {
    expect(text.trim()).toBe(text.trim().toUpperCase());
  }

  // Panel should have zero border-radius (Sharp edges: DU/TDR rule)
  const panelRadius = await panel.evaluate((el) => getComputedStyle(el).borderRadius);
  expect(panelRadius).toBe("0px");
});
