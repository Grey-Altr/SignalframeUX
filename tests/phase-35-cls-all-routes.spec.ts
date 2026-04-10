import { test, expect } from "@playwright/test";

/**
 * Phase 35 PF-04 CLS gate — Wave 1 locked assertion.
 *
 * Parameterized over all 5 routes. Subscribes PerformanceObserver to
 * "layout-shift" with buffered: true, scrolls to bottom then back with
 * 500ms settles, sums entry values (skipping hadRecentInput).
 *
 * The < 0.001 tolerance accounts for floating-point noise in the layout-shift
 * API's value computation. True zero is brittle; 0.001 is effectively zero.
 *
 * Must run against `pnpm build && pnpm start` — dev-mode layout shift is noisy.
 */

test.describe("@phase35 PF-04 CLS all routes", () => {
  for (const route of ["/", "/system", "/init", "/reference", "/inventory"]) {
    test(`PF-04: CLS ~ 0 on ${route}`, async ({ page }) => {
      await page.goto(route);
      const cls = await page.evaluate(() => new Promise<number>((resolve) => {
        let total = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              total += (entry as any).value;
            }
          }
        }).observe({ type: "layout-shift", buffered: true });
        window.scrollTo(0, document.documentElement.scrollHeight);
        setTimeout(() => {
          window.scrollTo(0, 0);
          setTimeout(() => resolve(total), 500);
        }, 500);
      }));
      expect(cls).toBeLessThan(0.001);
    });
  }
});
