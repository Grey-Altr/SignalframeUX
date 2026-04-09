/**
 * Phase 33 — INVENTORY + ACQUISITION Sections
 * All 11 tests covering IV-01 through IV-06 and AQ-01 through AQ-05.
 *
 * Pattern: fs.readFileSync source-level assertions mixed with browser-level DOM tests.
 * Requires dev server on http://localhost:3000 for browser tests.
 *
 * RED STATE: All tests should FAIL until Plans 33-02 through 33-04 implement the UI.
 * Source-level tests fail because the block files do not exist yet.
 * DOM tests fail because the sections are stub placeholders.
 *
 * SIGNAL/FRAME ordering: signal runs through the frame.
 */
import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");

test.describe("Phase 33 — INVENTORY + ACQUISITION", () => {
  // ── IV-01: Coded nomenclature in inventory rows ───────────────────────────

  test("IV-01: source — inventory-section uses sfCode and SF// pattern", () => {
    const src = fs.readFileSync(
      path.resolve(ROOT, "components/blocks/inventory-section.tsx"),
      "utf-8"
    );
    expect(src).toContain("sfCode");
    expect(src).toContain("SF//");
    expect(src).not.toContain("border-radius");
  });

  test("IV-01: DOM — each homepage inventory row has data-sf-code with SF// prefix", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForSelector("[data-inventory-row]");
    const codes = page.locator("[data-inventory-row] [data-sf-code]");
    const count = await codes.count();
    expect(count).toBe(12);
    const firstCode = await codes.first().textContent();
    expect(firstCode).toMatch(/^SF\/\/[A-Z]{3}-\d{3}$/);
  });

  // ── IV-02: Layer tag, pattern tier, name all visible ─────────────────────

  test("IV-02: DOM — each row shows [FRAME] or [//SIGNAL] tag and pattern tier", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForSelector("[data-inventory-row]");
    const firstRow = page.locator("[data-inventory-row]").first();
    // Layer tag must be visible
    const layerTag = firstRow.locator("[data-layer-tag]");
    await expect(layerTag).toBeVisible();
    const tagText = await layerTag.textContent();
    expect(tagText).toMatch(/^\[FRAME\]$|^\[\/\/SIGNAL\]$/);
    // Pattern tier must be visible
    const patternTier = firstRow.locator("[data-pattern-tier]");
    await expect(patternTier).toBeVisible();
    const tierText = await patternTier.textContent();
    expect(tierText).toMatch(/^[ABC]$/);
  });

  // ── IV-03: Monospaced type, no card layout ────────────────────────────────

  test("IV-03: source — inventory-section uses font-mono, no flip-card", () => {
    const src = fs.readFileSync(
      path.resolve(ROOT, "components/blocks/inventory-section.tsx"),
      "utf-8"
    );
    expect(src).toContain("font-mono");
    expect(src).not.toContain("flip-card");
    expect(src).not.toContain("rounded");
  });

  // ── IV-04: Click row opens ComponentDetail panel ──────────────────────────

  test("IV-04: DOM — clicking an inventory row opens ComponentDetail overlay", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForSelector("[data-inventory-row]");
    await page.locator("[data-inventory-row]").first().click();
    // Panel should appear
    await page.waitForSelector("[data-component-detail]", { timeout: 3000 });
    const panel = page.locator("[data-component-detail]");
    await expect(panel).toBeVisible();
    // Pressing Escape should close
    await page.keyboard.press("Escape");
    await expect(panel).not.toBeVisible({ timeout: 2000 });
  });

  // ── IV-05: Homepage shows 12 rows; /inventory shows full count ────────────

  test("IV-05: DOM — homepage INVENTORY section has exactly 12 rows", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForSelector("[data-inventory-row]");
    const rows = page.locator("[data-inventory-row]");
    await expect(rows).toHaveCount(12);
  });

  test("IV-05: DOM — /inventory page shows full registry count (>=34 items)", async ({
    page,
  }) => {
    await page.goto("/inventory");
    // Wait for grid to load
    await page.waitForSelector("[data-component-index]", { timeout: 5000 });
    const items = page.locator("[data-component-index]");
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(34);
  });

  // ── IV-06: Layer + pattern filters on /inventory ──────────────────────────

  test("IV-06: DOM — SIGNAL layer filter on /inventory reduces visible items", async ({
    page,
  }) => {
    await page.goto("/inventory");
    await page.waitForSelector("[data-component-index]");
    const allCount = await page.locator("[data-component-index]").count();
    // Click SIGNAL filter
    await page.click('[data-layer-filter="SIGNAL"]');
    await page.waitForTimeout(300); // filter animation
    const signalCount = await page.locator("[data-component-index]").count();
    expect(signalCount).toBeLessThan(allCount);
    expect(signalCount).toBeGreaterThan(0);
  });

  // ── AQ-01: CLI command visible with copy trigger ──────────────────────────

  test("AQ-01: DOM — ACQUISITION section contains npx signalframeux init", async ({
    page,
  }) => {
    await page.goto("/");
    const acquisition = page.locator('[data-section="acquisition"]');
    await expect(acquisition).toBeVisible();
    await expect(acquisition).toContainText("npx signalframeux init");
    // Copy trigger must exist (but need not be a <button>)
    const copyTrigger = acquisition.locator("[data-copy-trigger]");
    await expect(copyTrigger).toBeVisible();
  });

  // ── AQ-02: Stats as monospaced data points ────────────────────────────────

  test("AQ-02: DOM — ACQUISITION stats block shows COMPONENTS, BUNDLE, LIGHTHOUSE", async ({
    page,
  }) => {
    await page.goto("/");
    const acquisition = page.locator('[data-section="acquisition"]');
    await expect(acquisition).toContainText("COMPONENTS");
    await expect(acquisition).toContainText("BUNDLE");
    await expect(acquisition).toContainText("LIGHTHOUSE");
  });

  // ── AQ-03: Links to /init and /inventory ─────────────────────────────────

  test("AQ-03: DOM — ACQUISITION has text anchors to /init and /inventory", async ({
    page,
  }) => {
    await page.goto("/");
    const acquisition = page.locator('[data-section="acquisition"]');
    const initLink = acquisition.locator('a[href="/init"]');
    const inventoryLink = acquisition.locator('a[href="/inventory"]');
    await expect(initLink).toBeVisible();
    await expect(inventoryLink).toBeVisible();
  });

  // ── AQ-04: Section height ≤ 50vh ─────────────────────────────────────────

  test("AQ-04: DOM — ACQUISITION section height is <=50vh", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForSelector("[data-acquisition-root]");
    const box = await page.locator("[data-acquisition-root]").boundingBox();
    const vh = page.viewportSize()!.height;
    expect(box!.height).toBeLessThanOrEqual(vh * 0.5 + 8); // 8px tolerance
  });

  // ── AQ-05: No button CTA energy ──────────────────────────────────────────

  test("AQ-05: source — acquisition-section has no styled CTA buttons", () => {
    const src = fs.readFileSync(
      path.resolve(ROOT, "components/blocks/acquisition-section.tsx"),
      "utf-8"
    );
    // No SFButton, no "Get Started" — terminal register only
    expect(src).not.toContain("SFButton");
    expect(src).not.toContain("Get Started");
    expect(src).not.toContain("rounded");
    // Must contain the terminal aesthetic marker
    expect(src).toContain("npx signalframeux init");
  });
});
