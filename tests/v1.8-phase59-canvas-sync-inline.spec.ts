import { test, expect } from "@playwright/test";

/**
 * Phase 59 Plan A (CRT-01) — Canvas-sync inline integration spec.
 *
 * IMPORTANT: These tests MUST run against `pnpm build && pnpm start`
 * (production build), NOT `pnpm dev`. Next.js dev mode injects HMR
 * script ordering that masks inline-script timing. The webServer config
 * in playwright.config.ts runs `pnpm build && pnpm start` in CI;
 * for local runs, ensure a production server is already running on :3000.
 *
 * Covers:
 *   Test 1 — CRT-01: no /sf-canvas-sync.js network request fires (production HTML
 *             must serve the IIFE inline, not as an external file).
 *   Test 2 — CRT-01: iPhone-13 hard-reload CLS=0 across all 5 routes (home,
 *             /system, /init, /inventory, /reference). Validates the body-tail
 *             inline script preserves CLS=0 identical to the legacy external file.
 *   Test 3 — CRT-01: production HTML contains the canvasSyncScript IIFE inline
 *             (byte-pattern match on the canonical IIFE shape).
 *
 * Tag: @v18-phase59-canvas-sync
 */

const ROUTES = [
  { path: "/", slug: "home" },
  { path: "/system", slug: "system" },
  { path: "/init", slug: "init" },
  { path: "/inventory", slug: "inventory" },
  { path: "/reference", slug: "reference" },
] as const;

test.describe("@v18-phase59-canvas-sync (CRT-01)", () => {
  test("CRT-01: no /sf-canvas-sync.js network request", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone-13
    let sawSyncScriptRequest = false;
    page.on("request", (req) => {
      if (req.url().endsWith("/sf-canvas-sync.js")) sawSyncScriptRequest = true;
    });
    await page.goto("/", { waitUntil: "networkidle" });
    expect(sawSyncScriptRequest).toBe(false);
  });

  test("CRT-01: iPhone-13 hard-reload CLS=0 across all 5 routes", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone-13
    await page.emulateMedia({ reducedMotion: "reduce" });

    for (const route of ROUTES) {
      await page.goto(route.path, { waitUntil: "networkidle" });

      const cls = await page.evaluate(() =>
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
          setTimeout(() => resolve(total), 3000);
        })
      );

      expect(cls, `CLS regression on ${route.path}: expected 0, got ${cls}`).toBe(0);
    }
  });

  test("CRT-01: production HTML contains canvasSyncScript IIFE inline", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const html = await page.content();
    // Match the canonical IIFE shape: queries [data-sf-canvas] and computes innerWidth/1280
    expect(html).toMatch(/document\.querySelector\(['"]\[data-sf-canvas\]['"]\)/);
    expect(html).toMatch(/innerWidth\s*\/\s*1280/);
  });
});
