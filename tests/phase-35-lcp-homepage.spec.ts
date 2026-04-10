import { test } from "@playwright/test";

/**
 * Phase 35 PF-03 LCP gate — Wave 0 stub.
 *
 * Locked assertion: navigate to / and measure LCP via PerformanceObserver
 * subscribing to `largest-contentful-paint` with `buffered: true`. Assert
 * lastEntry.startTime < 1000.
 *
 * STATE.md D-08: LCP element must use opacity: 0.01 (not 0) as fade-in start
 * state, else Lighthouse and PerformanceObserver cannot measure it. The
 * homepage <h1>SIGNALFRAME//UX</h1> is the LCP element; any animation
 * applied to it must start at 0.01 or use clip-path, never 0.
 *
 * Brief §PF-03 requires running against `pnpm build && pnpm start`, NOT `pnpm dev`.
 * React dev-mode double-renders inflate LCP by ~2x.
 *
 * Wave 1 (plan 35-02 Task owned by Agent 1) fleshes this out.
 */

test.describe("@phase35 PF-03 LCP homepage", () => {
  test.skip("PF-03: LCP < 1.0s on homepage (Wave 1 fills)", async () => {
    // Wave 0 stub — locked assertion body lands in plan 35-02
  });
});
