import { test } from "@playwright/test";

/**
 * Phase 35 PF-04 CLS gate — Wave 0 stub.
 *
 * Locked assertion: parameterized over all 5 routes (/, /system, /init,
 * /reference, /inventory). For each route, subscribe PerformanceObserver
 * to "layout-shift" with buffered: true, scroll to bottom then back, sum
 * entry values (skipping hadRecentInput), expect total < 0.001.
 *
 * The < 0.001 tolerance accounts for floating-point noise in the layout-shift
 * API's value computation. True zero is brittle; 0.001 is effectively zero with headroom.
 *
 * Wave 1 (plan 35-02 Task owned by Agent 2) fleshes this out.
 */

test.describe("@phase35 PF-04 CLS all routes", () => {
  test.skip("PF-04: CLS ~ 0 on all 5 routes (Wave 1 fills)", async () => {
    // Wave 0 stub — locked assertion body lands in plan 35-02
  });
});
