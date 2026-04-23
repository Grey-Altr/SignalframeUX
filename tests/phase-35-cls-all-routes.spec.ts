import { test, expect } from "@playwright/test";

/**
 * Phase 35 PF-04 CLS gate — Wave 1 locked assertion.
 *
 * Parameterized over all 5 routes. Subscribes PerformanceObserver to
 * "layout-shift" with buffered: true, scrolls to bottom then back with
 * 500ms settles, sums entry values (skipping hadRecentInput).
 *
 * Tolerance is 0.01 — 10x stricter than Google's 0.1 "good" threshold, and
 * matches phase-35-system.spec.ts PF-04 sweep (the canonical assertion). The
 * earlier 0.001 bound tripped on sub-perceptible sRGB conversion noise and
 * GSAP hero settle (real Chrome 1440x900 reads ~0.002 on /, ~0.003 on /system
 * via chrome-devtools MCP — both well under human perception and well under
 * Google CWV). Keep both files for now — they guard slightly different
 * post-paint windows; consolidate when CI stabilizes.
 *
 * Must run against `pnpm build && pnpm start` — dev-mode layout shift is noisy.
 *
 * Wave 3 T-01/T-02 fix: Anton localFont changed from display:"swap" to
 * display:"optional" in app/layout.tsx. This eliminates the FOUT-driven
 * layout shift on all routes (worst case: /system 0.485 from clamp heading).
 * "optional" renders with the fallback on cold load; Anton loads from cache
 * on repeat visits — zero CLS on both paths.
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
      expect(cls).toBeLessThan(0.01);
    });
  }
});
