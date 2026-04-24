import { test, expect } from "@playwright/test";

/**
 * Effects Subsystem — reduced motion, quality-tier fallback, and
 * integration verification.
 *
 * Tests the TouchDesigner-level effects system added to builds pages
 * and core homepage sections. Verifies:
 *   1. No extra WebGL canvases — all effects use the shared SignalCanvas
 *   2. Reduced-motion suppresses all effect composer output
 *   3. Effect CSS variables are written to :root at runtime
 *   4. Build pages render without layout breakage
 *   5. No new layout shift on builds and homepage routes
 */

const BUILDS_ROUTES = [
  "/builds",
  "/builds/sonic-pressure-map",
  "/builds/ritual-poster-engine",
  "/builds/operator-wardrobe-skin",
  "/builds/caption-interceptor",
  "/builds/archive-heatwave",
  "/builds/night-shift-wayfinder",
];

const CORE_ROUTES = ["/"];

test.describe("@effects reduced-motion suppression", () => {
  for (const route of [...BUILDS_ROUTES.slice(0, 2), ...CORE_ROUTES]) {
    test(`reduced-motion hides composer on ${route}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(route, { waitUntil: "networkidle" });

      const composers = page.locator("[data-signal-composer]");
      const count = await composers.count();
      expect(count).toBe(0);
    });
  }
});

test.describe("@effects runtime CSS variables", () => {
  test("effect tokens are written to :root on homepage", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    await page.waitForTimeout(1000);

    const tier = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--sfx-fx-tier").trim()
    );
    expect(["ultra", "high", "medium", "fallback"]).toContain(tier);

    const multiplier = await page.evaluate(() =>
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--sfx-fx-multiplier").trim()
      )
    );
    expect(multiplier).toBeGreaterThanOrEqual(0);
    expect(multiplier).toBeLessThanOrEqual(1);
  });
});

test.describe("@effects WebGL canvas count", () => {
  test("≤ 3 WebGL canvases on homepage (KLOROFORM iris + pointcloud + GLSL hero)", async ({ page }) => {
    // Accretion history:
    //   1 canvas — pre-VL-05 (GLSL hero only)
    //   2 canvases — Phase 34 VL-05 hero magenta slash moment shipped
    //   3 canvases — KLOROFORM T1/T2 port to main: iris-cloud +
    //                pointcloud-ring (both offscreen-transferred to workers)
    //                joined the Three.js GLSL hero canvas as the current
    //                production hero composition (see commits 4f97a8a →
    //                c500ff1 for the staged entrance).
    // Guard kept at ≤3 so any 4th canvas (accidental duplicate, wrong-route
    // mount, stray SignalMesh) still trips. Detection also handles canvases
    // whose control was transferred to OffscreenCanvas — getContext throws
    // InvalidStateError on those, which is itself a positive WebGL signal.
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const canvasCount = await page.evaluate(() => {
      // Count WebGL canvases incl. those transferred to OffscreenCanvas.
      // `getContext` throws InvalidStateError on a transferred canvas — that
      // error IS a positive WebGL signal (the worker holds the live context).
      const canvases = document.querySelectorAll("canvas");
      let webglCount = 0;
      canvases.forEach((c) => {
        try {
          const ctx = c.getContext("webgl2") || c.getContext("webgl");
          if (ctx) webglCount++;
        } catch (err) {
          if (err instanceof DOMException && err.name === "InvalidStateError") {
            webglCount++;
          } else {
            throw err;
          }
        }
      });
      return webglCount;
    });

    expect(canvasCount).toBeLessThanOrEqual(3);
  });

  test("only one WebGL canvas on builds detail", async ({ page }) => {
    await page.goto("/builds/sonic-pressure-map", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const canvasCount = await page.evaluate(() => {
      const canvases = document.querySelectorAll("canvas");
      let webglCount = 0;
      canvases.forEach((c) => {
        try {
          const ctx = c.getContext("webgl2") || c.getContext("webgl");
          if (ctx) webglCount++;
        } catch (err) {
          if (err instanceof DOMException && err.name === "InvalidStateError") {
            webglCount++;
          } else {
            throw err;
          }
        }
      });
      return webglCount;
    });

    expect(canvasCount).toBeLessThanOrEqual(1);
  });
});

test.describe("@effects builds page integrity", () => {
  test("builds index renders main content", async ({ page }) => {
    await page.goto("/builds", { waitUntil: "networkidle" });
    const main = page.locator("main").first();
    await expect(main).toBeVisible();

    const heading = page.locator("h1").first();
    await expect(heading).toBeVisible();
  });

  for (const route of BUILDS_ROUTES.slice(1)) {
    test(`build detail page loads: ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: "networkidle" });
      const main = page.locator("main").first();
      await expect(main).toBeVisible();

      const heading = page.locator("h1").first();
      await expect(heading).toBeVisible();
    });
  }
});

test.describe("@effects CLS check", () => {
  for (const route of ["/builds", "/"]) {
    test(`CLS < 0.1 on ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: "networkidle" });
      await page.waitForTimeout(2000);

      const cls = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let clsValue = 0;
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!(entry as PerformanceEntry & { hadRecentInput?: boolean }).hadRecentInput) {
                clsValue += (entry as PerformanceEntry & { value: number }).value;
              }
            }
          });
          observer.observe({ type: "layout-shift", buffered: true });
          setTimeout(() => {
            observer.disconnect();
            resolve(clsValue);
          }, 1000);
        });
      });

      expect(cls).toBeLessThan(0.1);
    });
  }
});
