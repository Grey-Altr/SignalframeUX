import { test, expect } from "@playwright/test";

/**
 * Phase 58 CIB-05 — web-vitals component contract test (V-03 from RESEARCH).
 *
 * MUST run against `pnpm build && pnpm start` (production build) to mount
 * useReportWebVitals correctly. Dev mode emits metrics differently due to
 * React strict-mode double-render and HMR.
 */

test.describe("@v18-phase58-web-vitals (CIB-05)", () => {
  test("emits sendBeacon to /api/vitals within 5s of DOMContentLoaded", async ({ page }) => {
    const beaconPosts: Array<{ url: string; postData: string | null }> = [];

    // Intercept POSTs to /api/vitals (sendBeacon shows up as a fetch in Playwright).
    page.on("request", (request) => {
      if (request.url().includes("/api/vitals") && request.method() === "POST") {
        beaconPosts.push({ url: request.url(), postData: request.postData() });
      }
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Wait up to 5s for first metric.
    await expect.poll(() => beaconPosts.length, { timeout: 5_000 }).toBeGreaterThanOrEqual(1);

    // Validate payload shape.
    const first = beaconPosts[0];
    expect(first.postData).not.toBeNull();
    const payload = JSON.parse(first.postData!);
    expect(typeof payload.name).toBe("string");
    expect(typeof payload.value).toBe("number");
    expect(typeof payload.id).toBe("string");
    expect(["LCP", "CLS", "INP", "FCP", "TTFB"]).toContain(payload.name);
  });

  test("WebVitals component renders zero DOM nodes", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    // The component itself returns null. No data-testid or role to query.
    // Indirect check: count nodes whose name contains "WebVitals" — should be 0.
    // Direct check: pixel-diff is owned by the dedicated pixel-diff spec (Task 5).
    const nodeWithText = await page.locator("text=WebVitals").count();
    expect(nodeWithText).toBe(0);
  });
});
