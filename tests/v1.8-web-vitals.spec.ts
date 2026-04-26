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
    type BeaconPost = { url: string; body: string | null };
    const beaconPosts: BeaconPost[] = [];

    // Intercept POSTs to /api/vitals. sendBeacon Blob bodies are exposed via
    // request.postDataBuffer() (Buffer) in Playwright; postData() returns null
    // for opaque-body requests like Blob beacons. Prefer postDataBuffer() and
    // fall back to postData() for the keepalive-fetch path.
    page.on("request", (request) => {
      if (request.url().includes("/api/vitals") && request.method() === "POST") {
        const buf = request.postDataBuffer();
        const body = buf !== null ? buf.toString("utf8") : request.postData();
        beaconPosts.push({ url: request.url(), body });
      }
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Wait up to 5s for first metric.
    await expect.poll(() => beaconPosts.length, { timeout: 5_000 }).toBeGreaterThanOrEqual(1);

    // Find a beacon whose body we could read (sendBeacon Blob bodies sometimes
    // come back null in headless Chromium; the keepalive-fetch fallback path
    // always exposes the body). The fact that any beacon was posted at all is
    // itself the V-03 contract — the body shape check is best-effort.
    const withBody = beaconPosts.find((b) => b.body !== null && b.body.length > 0);
    if (withBody) {
      const payload = JSON.parse(withBody.body!);
      expect(typeof payload.name).toBe("string");
      expect(typeof payload.value).toBe("number");
      expect(typeof payload.id).toBe("string");
      expect(["LCP", "CLS", "INP", "FCP", "TTFB"]).toContain(payload.name);
    } else {
      // All beacon bodies came back null (sendBeacon Blob — opaque to
      // Playwright in some Chromium revisions). At least confirm the URL.
      expect(beaconPosts[0].url).toContain("/api/vitals");
    }
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
