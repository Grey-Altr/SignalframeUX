import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Phase 35 /init tests — Wave 0 seed + Wave 1 full suite.
 *
 * Contains the mandatory Gap 2 EDGE-2 test carried over from Phase 34 shipped
 * compile-back. Per pre-brief at wiki/analyses/v1.5-phase35-brief.md §Test
 * Carry-Overs §Gap 2, this test MUST land Day 1 of Wave 0 before any other
 * Phase 35 layout work. The three-condition stack (375x667 + reducedMotion +
 * boundingBox overlap) is non-negotiable.
 *
 * Wave 1 (plan 35-02) adds the full /init assertion suite below.
 */

// ── Gap 2 EDGE-2 test (Wave 0 — preserved verbatim) ──────────────────────────
test.describe("@phase35 /init", () => {
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

test.describe("@phase35 /init — full suite", () => {

  for (const vp of VIEWPORTS) {
    test.describe(`${vp.name} -- ${vp.width}x${vp.height}`, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });

      // ── Nav-reveal contract (Gap 1 tightened) ───────────────────────────
      test("nav-reveal: hidden on load, visible after scroll", async ({ page }) => {
        await page.goto("/init", { waitUntil: "domcontentloaded" });
        await expect(page.locator("body")).toHaveAttribute("data-nav-visible", "false", { timeout: 500 });
        await page.evaluate(() => window.scrollBy(0, 600));
        await expect(page.locator("body")).toHaveAttribute("data-nav-visible", "true", { timeout: 500 });
      });

      // ── [OK] SYSTEM READY terminal footer ───────────────────────────────
      test("[OK] SYSTEM READY terminal footer is present on /init", async ({ page }) => {
        // STATE.md Phase 34-03: Terminal footer LOCKED literal is `[OK] SYSTEM READY`
        await page.goto("/init");
        await page.waitForLoadState("domcontentloaded");
        // Scroll to bottom to ensure terminal section is rendered
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await expect(page.locator("text=[OK] SYSTEM READY")).toBeVisible();
      });

      // ── [INIT//SYS] HUD label ────────────────────────────────────────────
      test("InstrumentHUD: [INIT//SYS] label on /init", async ({ page }) => {
        await page.goto("/init", { waitUntil: "domcontentloaded" });
        const sectionField = page.locator("[data-hud-field='section']");
        await expect(sectionField).toBeVisible();
        await expect(sectionField).toContainText("INIT");
      });

      // ── Bringup-sequence code labels ─────────────────────────────────────
      test("bringup-sequence: INIT/HANDSHAKE/LINK/TRANSMIT/DEPLOY code labels present", async ({ page }) => {
        // STATE.md Phase 34-03: coded indicator mapping is RENDER-only const
        // CODES = ["INIT","HANDSHAKE","LINK","TRANSMIT","DEPLOY"] inside STEPS.map()
        await page.goto("/init");
        await page.waitForLoadState("domcontentloaded");
        // Each code label must be visible in the bringup sequence
        for (const code of ["INIT", "HANDSHAKE", "LINK", "TRANSMIT", "DEPLOY"]) {
          await expect(page.locator(`text=${code}`).first()).toBeVisible();
        }
      });

    });
  }

  // ── LR-04 reduced-motion nav-visible first-paint (AC-5b duplicate for /init) ──
  test.describe("mobile 375x667 — reduced-motion first-paint", () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test("LR-04: reduced-motion sets data-nav-visible=true on first paint at 375x667", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/init", { waitUntil: "domcontentloaded" });
      await expect(page.locator("body")).toHaveAttribute("data-nav-visible", "true", { timeout: 500 });
    });

  });

});
