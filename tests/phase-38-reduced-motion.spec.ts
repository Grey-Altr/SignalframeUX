import { test, expect } from "@playwright/test";

/**
 * Phase 38 — QA-02 prefers-reduced-motion content visibility spec.
 *
 * Emulates `prefers-reduced-motion: reduce` BEFORE navigation so the media
 * query is active during React hydration (critical per RESEARCH Pitfall 3).
 *
 * SignalframeProvider reads `window.matchMedia('(prefers-reduced-motion: reduce)')`
 * in a useEffect and calls `gsap.globalTimeline.timeScale(0)` — this kills all GSAP
 * animations globally. GSAP is NOT exposed on window.gsap (bundled as module), so
 * we verify indirectly via DOM state: content must be visible and positioned within
 * viewport bounds (no stuck animation start states).
 */

const ROUTES = ["/", "/inventory", "/system", "/init", "/reference"];

test.describe("@phase38 prefers-reduced-motion", () => {
  for (const route of ROUTES) {
    test(`reduced-motion content visible: ${route}`, async ({ page }) => {
      // Set BEFORE navigation — media query must be active during hydration
      // (SignalframeProvider reads mql.matches on mount in useEffect)
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(route, { waitUntil: "networkidle" });

      // Main content area must be present and visible
      const main = page.locator("main").first();
      await expect(main).toBeVisible();

      // data-section elements must exist and be visible (GSAP start states should not persist)
      const sections = page.locator("[data-section]");
      const sectionCount = await sections.count();
      if (sectionCount > 0) {
        // At least the first visible section should have a reasonable bounding box
        const firstSection = sections.first();
        await expect(firstSection).toBeVisible();
        const box = await firstSection.boundingBox();
        expect(box).not.toBeNull();
        // Section must not be pushed off-screen to the left (animation start state guard)
        expect(box!.x).toBeGreaterThan(-500);
        // Section y should be within reasonable document flow (not 1000+px offscreen)
        expect(box!.y).toBeGreaterThan(-100);
      }

      // Homepage-specific: h1 heading must be visible and on-screen
      // (not stuck at opacity 0.01 animation start state per Phase 30 LCP safety rule)
      if (route === "/") {
        const heading = page.locator("h1").first();
        await expect(heading).toBeVisible();
        const box = await heading.boundingBox();
        expect(box).not.toBeNull();
        // Heading must be positioned on-screen (x >= 0 per plan requirement)
        expect(box!.x).toBeGreaterThanOrEqual(0);
        // y must be within reasonable document bounds (not offscreen due to GSAP start state)
        expect(box!.y).toBeGreaterThanOrEqual(0);
      }
    });
  }
});
