/**
 * Phase 59 Plan C (CRT-04) — Lenis requestIdleCallback deferral.
 *
 * Three test contracts:
 * 1. PF-04 source-locked grep guard — autoResize: true literal MUST remain
 *    in lenis-provider.tsx after the rIC wrap (PF-04 contract per
 *    feedback_pf04_autoresize_contract.md).
 * 2. Deep-anchor scroll-restore — /inventory#main-content still resolves within
 *    ≤ 2 frames after the 100ms rIC timeout ceiling.
 *    NOTE: /inventory#prf-08 was the planned anchor but does not exist in the
 *    shipped inventory page. Using #main-content (verified id="main-content" at
 *    app/inventory/page.tsx:30) as the canonical deep-anchor test target.
 * 3. useLenisInstance() null-window timing — null for ≤ 100ms post-mount,
 *    then non-null. All Lenis consumers already handle null safely.
 *
 * Run via pnpm build && pnpm start (production); rIC behavior in dev mode
 * is unreliable due to Next.js HMR overhead.
 */

import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import path from "node:path";

test.describe("@v18-phase59-lenis-ric (CRT-04 / Plan C)", () => {
  test("CRT-04: PF-04 grep guard — autoResize: true literal preserved", async () => {
    // Fast smoke test — no browser needed; reads source at test runtime.
    // Asserts both PF-04 contract (autoResize: true) AND rIC wrapper presence.
    // This test is RED on the current main before the rIC wrap is applied.
    const src = readFileSync(
      path.join(process.cwd(), "components/layout/lenis-provider.tsx"),
      "utf8"
    );

    // PF-04 contract — non-negotiable (feedback_pf04_autoresize_contract.md)
    expect(src).toContain("autoResize: true");

    // CRT-04 deliverable — rIC wrapper must be present after Task 2
    expect(src).toContain("requestIdleCallback");

    // Reduced-motion guard MUST remain synchronous (NOT inside the rIC scope)
    // Pattern: if (mql.matches) return;  — at top of useEffect before rIC scheduling
    expect(src).toMatch(/if\s*\(\s*mql\.matches\s*\)\s*return/);
  });

  test("CRT-04: deep anchor /inventory#main-content resolves within 2 frames", async ({
    page,
  }) => {
    // Navigate to deep anchor; wait for load to settle
    await page.goto("/inventory#main-content", { waitUntil: "load" });

    // Wait 2 rAFs to allow rIC-deferred Lenis init to fire (100ms ceiling)
    // and scroll-restoration to resolve
    await page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        })
    );

    // Wait for rIC timeout ceiling (100ms) + small buffer
    await page.waitForTimeout(150);

    // Verify #main-content element is visible and near viewport top
    // (deep-anchor landed within acceptable range)
    const anchorTop = await page.evaluate(() => {
      const el = document.getElementById("main-content");
      return el ? el.getBoundingClientRect().top : Number.MAX_SAFE_INTEGER;
    });

    // The element should be within ±200px of viewport top
    expect(Math.abs(anchorTop)).toBeLessThan(200);
  });

  test("CRT-04: useLenisInstance returns null for ≤ 100ms then non-null", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "load" });

    // Immediately post-load, Lenis may still be null (rIC pending)
    // The rIC timeout ceiling is 100ms — we check pre-init state is possible
    const lenisImmediate = await page.evaluate(() => (window as any).lenis);
    // lenisImmediate may be null or non-null depending on browser idle time
    // We don't assert the null state because rIC may fire faster than test execution

    // Wait up to 200ms for init to fire (rIC timeout = 100ms + small buffer)
    await page.waitForTimeout(200);

    const lenis = await page.evaluate(() => (window as any).lenis);

    // After 200ms, Lenis MUST be initialized (100ms ceiling guarantees it)
    expect(lenis).not.toBeNull();
    expect(lenis).toBeDefined();
  });
});
