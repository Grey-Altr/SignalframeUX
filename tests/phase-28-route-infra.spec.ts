/**
 * Phase 28 — Route Infrastructure
 * Smoke tests for new routes (200) and old route redirect chains (308)
 *
 * Assumes dev server is running on http://localhost:3000
 */
import { test, expect } from "@playwright/test";

test.describe("Phase 28 — Route Infrastructure", () => {
  test.describe("New routes return 200", () => {
    test("/inventory renders", async ({ page }) => {
      const response = await page.goto("/inventory");
      expect(response?.status()).toBe(200);
    });

    test("/system renders", async ({ page }) => {
      const response = await page.goto("/system");
      expect(response?.status()).toBe(200);
    });

    test("/init renders", async ({ page }) => {
      const response = await page.goto("/init");
      expect(response?.status()).toBe(200);
    });
  });

  test.describe("Old routes redirect with 308", () => {
    test("/components redirects to /inventory", async ({ request }) => {
      const response = await request.get("/components", {
        maxRedirects: 0,
      });
      expect(response.status()).toBe(308);
      expect(response.headers()["location"]).toBe("/inventory");
    });

    test("/tokens redirects to /system", async ({ request }) => {
      const response = await request.get("/tokens", {
        maxRedirects: 0,
      });
      expect(response.status()).toBe(308);
      expect(response.headers()["location"]).toBe("/system");
    });

    test("/start redirects to /init", async ({ request }) => {
      const response = await request.get("/start", {
        maxRedirects: 0,
      });
      expect(response.status()).toBe(308);
      expect(response.headers()["location"]).toBe("/init");
    });
  });
});
