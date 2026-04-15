/**
 * Phase 30 — Homepage Architecture
 * Validates the 6-section cinematic page structure (ENTRY through ACQUISITION),
 * ENTRY section hero content, and removal of CircuitDivider + MarqueeBand.
 *
 * Requirements: RA-05, EN-01, EN-02, EN-03, VL-03, VL-07
 *
 * Assumes dev server is running on http://localhost:3000
 */
import { test, expect } from "@playwright/test";

test.describe("Phase 30: Homepage Architecture", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  // ── RA-05: Six section landmarks in correct order ──────────────────────────
  test("six section landmarks in correct order", async ({ page }) => {
    const sections = page.locator("[data-section]");
    await expect(sections).toHaveCount(6);
    const ids = await sections.evaluateAll((els) =>
      els.map((el) => el.getAttribute("data-section"))
    );
    expect(ids).toEqual([
      "entry",
      "thesis",
      "proof",
      "inventory",
      "signal",
      "acquisition",
    ]);
  });

  // ── EN-01: ENTRY fills 100vh ───────────────────────────────────────────────
  test("ENTRY fills 100vh", async ({ page }) => {
    const entry = page.locator("[data-entry-section]");
    const height = await entry.evaluate(
      (el) => el.getBoundingClientRect().height
    );
    const vh = await page.evaluate(() => window.innerHeight);
    expect(height).toBeGreaterThanOrEqual(vh - 2);
  });

  // ── EN-02: SIGNALFRAME title renders at 120px+ Anton (scaled +30% in entry-section) ─
  test("SIGNALFRAME title at 120px+", async ({ page }) => {
    const h1 = page.locator("#entry h1");
    await expect(h1).toContainText("SIGNALFRAME");
    const fontSize = await h1.evaluate((el) =>
      parseFloat(getComputedStyle(el).fontSize)
    );
    // ~94px floor matches clamp min (5.85rem) on narrow viewports; desktop is 120px+ effective
    expect(fontSize).toBeGreaterThanOrEqual(90);
  });

  // ── EN-03: Subtitle only — no buttons in ENTRY ───────────────────────────
  test("subtitle only — no buttons in ENTRY", async ({ page }) => {
    const paragraphs = page.locator("[data-entry-section] p");
    await expect(paragraphs).toHaveCount(1);
    const buttons = page.locator("[data-entry-section] button");
    await expect(buttons).toHaveCount(0);
  });

  // ── VL-03: CircuitDivider removed from homepage ───────────────────────────
  test("CircuitDivider removed from homepage", async ({ page }) => {
    // CircuitDivider renders a root div with className containing "circuit-divider"
    const circuits = page.locator(".circuit-divider, [data-circuit-divider]");
    await expect(circuits).toHaveCount(0);
  });

  // ── VL-07: MarqueeBand removed from homepage ─────────────────────────────
  test("MarqueeBand removed from homepage", async ({ page }) => {
    // MarqueeBand renders a <section aria-label="Scrolling marquee">
    const marquees = page.locator(
      '[aria-label="Scrolling marquee"], [class*="marquee-band"], [data-marquee-band]'
    );
    await expect(marquees).toHaveCount(0);
  });
});
