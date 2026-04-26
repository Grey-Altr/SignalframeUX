import { test, expect } from "@playwright/test";

/**
 * Phase 59 Plan B (CRT-03) — Slow-3G hard-reload CLS gate + swap-event guard.
 *
 * Suite tag: @v18-phase59-anton-swap (CRT-03 / Plan B)
 *
 * WHY slow-3G is the verification gate:
 * On fast networks, Anton may arrive before first paint — no swap event fires,
 * no CLS accumulates, and the test is vacuous. Slow-3G (400 Kbps / 400ms RTT)
 * forces a cold-cache scenario where the browser renders with the fallback face
 * first and then swaps Anton in. The descriptor overrides must make that swap
 * geometrically invisible (CLS <= 0.001).
 *
 * WHY video recording is required:
 * The `test-results/phase59-anton-swap/*.webm` artifacts are the FORENSIC RECORD
 * per 59-VALIDATION.md Manual-Only Verifications row 1 (slow-3G screen recording
 * for AES-02 exception evidence). Review the .webm files at 0.25× speed through
 * the swap moment to confirm no visible layout jump occurs. If a jump is visible
 * even though CLS numerically passes (possible at high-DPR), escalate for human
 * review.
 *
 * RUNS AGAINST: `pnpm build && pnpm start` (production, NOT dev).
 *
 * RED state note:
 * On pre-Task-5 main (display: 'optional'):
 * - Tests 1-3 (CLS assertions) PASS vacuously — display:optional suppresses the
 *   swap event entirely, so no layout shift ever accumulates. The CLS gate is
 *   not being exercised.
 * - Test 4 (swap-event-exercised guard) FAILS — document.fonts.ready resolves
 *   immediately on display:optional (< 50ms), violating toBeGreaterThan(50).
 *   This is the intended RED state: the spec is live, not vacuous.
 * After Task 5 (display: 'swap' + descriptors):
 * - Tests 1-3 PASS only if descriptor calibration is correct (CLS <= 0.001).
 * - Test 4 PASSES because fonts.ready resolves AFTER fallback swap (> 50ms on slow-3G).
 */

const VIDEO_DIR = "test-results/phase59-anton-swap";

// CDP slow-3G throttling constants (400 Kbps / 400ms latency)
const SLOW_3G = {
  offline: false,
  downloadThroughput: (400 * 1024) / 8, // 400 Kbps → bytes/sec
  uploadThroughput: (400 * 1024) / 8,
  latency: 400, // ms RTT
} as const;

async function measureCLS(page: import("@playwright/test").Page): Promise<number> {
  return page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        let total = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as PerformanceEntry[] &
            Array<{ value?: number; hadRecentInput?: boolean }>) {
            if (!(entry as { hadRecentInput?: boolean }).hadRecentInput) {
              total += (entry as { value?: number }).value ?? 0;
            }
          }
        }).observe({ type: "layout-shift", buffered: true });
        // 5 seconds — slow-3G needs extra time to complete the swap
        setTimeout(() => resolve(total), 5000);
      })
  );
}

test.describe("@v18-phase59-anton-swap (CRT-03 / Plan B)", () => {
  test(
    "CRT-03: slow-3G hard-reload CLS=0 on / (iPhone-13 390×844)",
    async ({ browser }) => {
      const ctx = await browser.newContext({
        viewport: { width: 390, height: 844 },
        recordVideo: { dir: VIDEO_DIR },
      });
      const page = await ctx.newPage();
      try {
        const cdp = await ctx.newCDPSession(page);
        await cdp.send("Network.emulateNetworkConditions", SLOW_3G);
        await page.goto("/", { waitUntil: "networkidle" });
        const cls = await measureCLS(page);
        expect(
          cls,
          `Slow-3G CLS on / iPhone-13: ${cls.toFixed(4)} (must be <= 0.001)`
        ).toBeLessThanOrEqual(0.001);
      } finally {
        await ctx.close(); // flush video to disk
      }
    }
  );

  test(
    "CRT-03: slow-3G hard-reload CLS=0 on /system (iPhone-13 390×844) — Wave 3 regression route",
    async ({ browser }) => {
      // NOTE: /system is the route where Wave 3's untuned display:'swap'
      // produced 0.485 CLS (clamp(80px, 12vw, 160px) heading shift).
      // This test must PASS with measured descriptors.
      const ctx = await browser.newContext({
        viewport: { width: 390, height: 844 },
        recordVideo: { dir: VIDEO_DIR },
      });
      const page = await ctx.newPage();
      try {
        const cdp = await ctx.newCDPSession(page);
        await cdp.send("Network.emulateNetworkConditions", SLOW_3G);
        await page.goto("/system", { waitUntil: "networkidle" });
        const cls = await measureCLS(page);
        expect(
          cls,
          `Slow-3G CLS on /system iPhone-13: ${cls.toFixed(4)} (must be <= 0.001; Wave 3 produced 0.485)`
        ).toBeLessThanOrEqual(0.001);
      } finally {
        await ctx.close();
      }
    }
  );

  test(
    "CRT-03: slow-3G hard-reload CLS=0 on / (mobile-360 360×800) — GhostLabel is mobile LCP",
    async ({ browser }) => {
      const ctx = await browser.newContext({
        viewport: { width: 360, height: 800 },
        recordVideo: { dir: VIDEO_DIR },
      });
      const page = await ctx.newPage();
      try {
        const cdp = await ctx.newCDPSession(page);
        await cdp.send("Network.emulateNetworkConditions", SLOW_3G);
        await page.goto("/", { waitUntil: "networkidle" });
        const cls = await measureCLS(page);
        expect(
          cls,
          `Slow-3G CLS on / mobile-360: ${cls.toFixed(4)} (GhostLabel LCP path; must be <= 0.001)`
        ).toBeLessThanOrEqual(0.001);
      } finally {
        await ctx.close();
      }
    }
  );

  // Assertion 4 (anti-vacuous-pass guard):
  // PROVE the swap event was actually exercised.
  //
  // On display:optional, document.fonts.ready resolves at first paint (~0-50ms)
  // because no swap event is ever scheduled. On display:swap with descriptors,
  // fonts.ready resolves AFTER fallback render completes and the swap fires
  // (typically > 150ms on slow-3G 400 Kbps). This test FAILS on
  // display:optional (resolves < 50ms) and PASSES only on display:swap
  // that has actually been exercised through the font-swap pipeline.
  //
  // Current RED state: this test FAILS on pre-Task-5 main (display:'optional')
  // because fonts.ready resolves immediately. It flips GREEN after Task 5
  // replaces the Anton block with display:'swap' + measured descriptors.
  test(
    "Anton swap event was exercised (not skipped by display:optional)",
    async ({ browser }) => {
      const ctx = await browser.newContext({
        viewport: { width: 390, height: 844 },
        recordVideo: { dir: VIDEO_DIR },
      });
      const page = await ctx.newPage();
      try {
        const cdp = await ctx.newCDPSession(page);
        await cdp.send("Network.emulateNetworkConditions", SLOW_3G);
        await page.goto("/", { waitUntil: "domcontentloaded" });

        // Measure how long it takes for fonts.ready to resolve after navigation.
        // On display:optional this is near-instant (< 50ms).
        // On display:swap over slow-3G, the browser must:
        //   1. Render fallback face
        //   2. Download subsetted Anton (~12-15 KB at 400 Kbps = ~300ms)
        //   3. Swap face + resolve fonts.ready
        // Net result: fonts.ready resolves >> 50ms after navigation on slow-3G.
        const fontsReadyMs = await page.evaluate(async () => {
          const t0 = performance.now();
          await document.fonts.ready;
          return performance.now() - t0;
        });

        // Assert > 50ms: proves display:swap is active and the swap pipeline fired.
        // On display:optional, fonts.ready resolves in 0-10ms (no swap scheduled),
        // so this assertion will FAIL, which is the intended behavior on pre-Task-5 main.
        expect(
          fontsReadyMs,
          `fonts.ready resolved in ${fontsReadyMs.toFixed(0)}ms — expected > 50ms (display:swap + slow-3G). If < 50ms, display:optional may still be active.`
        ).toBeGreaterThan(50);
      } finally {
        await ctx.close();
      }
    }
  );
});
