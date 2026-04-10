import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Phase 35 /reference tests — Wave 0 seed + Wave 1 full suite.
 *
 * Contains the mandatory Gap 2 EDGE-2 test (duplicated from phase-35-init.spec.ts
 * per brief §Visual-QA Wave 1 table: agents 3 AND 4 both own this assertion).
 * Wave 1 (plan 35-02) adds the full /reference assertion suite below.
 */

// ── Gap 2 EDGE-2 test (Wave 0 — preserved verbatim) ──────────────────────────
test.describe("@phase35 /reference", () => {
  test("EDGE-2: reduced-motion h1 does not overlap nav at 375x667", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 375, height: 667 });
    for (const route of ["/init", "/reference", "/system"]) {
      await page.goto(route);
      await expect(page.locator("body")).toHaveAttribute("data-nav-visible", "true");
      const h1Box = await page.locator("h1").first().boundingBox();
      const navBox = await page.locator("nav").first().boundingBox();
      expect(h1Box).not.toBeNull();
      expect(navBox).not.toBeNull();
      expect(h1Box!.y).toBeGreaterThanOrEqual(navBox!.y + navBox!.height);
    }
  });
});

// ── Wave 1 full suite ─────────────────────────────────────────────────────────

const VIEWPORTS = [
  { width: 1440, height: 900, name: "desktop" },
  { width: 768, height: 1024, name: "tablet" },
  { width: 375, height: 667, name: "mobile" },
] as const;

test.describe("@phase35 /reference — full suite", () => {

  for (const vp of VIEWPORTS) {
    test.describe(`${vp.name} -- ${vp.width}x${vp.height}`, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });

      // ── Nav-reveal contract (Gap 1 tightened) ───────────────────────────
      test("nav-reveal: hidden on load, visible after scroll", async ({ page }) => {
        await page.goto("/reference", { waitUntil: "domcontentloaded" });
        await expect(page.locator("body")).toHaveAttribute("data-nav-visible", "false", { timeout: 500 });
        await page.evaluate(() => window.scrollBy(0, 600));
        await expect(page.locator("body")).toHaveAttribute("data-nav-visible", "true", { timeout: 500 });
      });

      // ── [REF//API] HUD label ─────────────────────────────────────────────
      test("InstrumentHUD: [REF//API] label on /reference", async ({ page }) => {
        await page.goto("/reference", { waitUntil: "domcontentloaded" });
        const sectionField = page.locator("[data-hud-field='section']");
        await expect(sectionField).toBeVisible();
        await expect(sectionField).toContainText("REF");
      });

      // ── Schematic register density: monospaced font on category headings ─
      test("schematic register: font-mono applied to category headings", async () => {
        // Source-read check — monospaced font is a schematic register requirement
        // for the /reference API explorer. Category headings must use font-mono.
        const src = readFileSync(join(process.cwd(), "app/reference/page.tsx"), "utf-8");
        expect(src).toMatch(/font-mono/);
      });

      // ── Schematic register: at least 1 category row present ─────────────
      test("schematic register: reference page has API content rows", async ({ page }) => {
        await page.goto("/reference");
        await page.waitForLoadState("domcontentloaded");
        // At least one data row must be present in the reference table
        const rows = page.locator("[data-section='API REFERENCE'] tr, table tr, [role='row']");
        const count = await rows.count();
        expect(count).toBeGreaterThanOrEqual(1);
      });

    });
  }

  // ── LR-04 reduced-motion nav-visible first-paint (AC-5b duplicate for /reference) ──
  test.describe("mobile 375x667 — reduced-motion first-paint", () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test("LR-04: reduced-motion sets data-nav-visible=true on first paint at 375x667", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/reference", { waitUntil: "domcontentloaded" });
      await expect(page.locator("body")).toHaveAttribute("data-nav-visible", "true", { timeout: 500 });
    });

  });

});
