import { test, expect } from "@playwright/test";

/**
 * Phase 35 PF-03 LCP gate — Wave 1 locked assertion.
 *
 * Brief §PF-03 requires running against `pnpm build && pnpm start`, NOT `pnpm dev`.
 * React dev-mode double-renders inflate LCP by ~2x.
 */

test.describe("@phase35 PF-03 LCP homepage", () => {
  // STATE.md D-08: LCP element must use opacity: 0.01 (not 0) as fade-in start
  // state, else Lighthouse and PerformanceObserver cannot measure it. The
  // homepage <h1>SIGNALFRAME//UX</h1> is the LCP element; any animation
  // applied to it must start at 0.01 or use clip-path, never 0.
  test("PF-03: LCP < 1.0s on homepage", async ({ page }) => {
    await page.goto("/");
    const lcp = await page.evaluate(() => new Promise<number>((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        resolve(last.startTime);
      }).observe({ type: "largest-contentful-paint", buffered: true });
    }));
    expect(lcp).toBeLessThan(1000);
  });
});
