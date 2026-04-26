import { test, expect, type Page } from "@playwright/test";

/**
 * Phase 58 — LCP element identity guard.
 *
 * Phase 57 baselines (.planning/codebase/v1.8-lcp-diagnosis.md §1):
 *   mobile-360x800 -> components/animation/ghost-label.tsx (sf-display + 4% opacity GhostLabel)
 *   desktop-1440x900 -> components/blocks/entry-section.tsx:208 (VL-05 magenta // overlay)
 *
 * Selector composition note: `el.className` (DOMTokenList stringified) returns
 * the raw class attribute value with literal `/`, `[`, `]`, `.`, `-` characters.
 * We then dot-join the whitespace-split tokens, so the resulting test string
 * looks like: `span.sf-display.pointer-events-none.top-1/2.text-[1.28em]...`.
 * The Tailwind arbitrary-value brackets and slashes are NOT escaped — use
 * plain substring matches via toContain(), NOT CSS-selector-escaped strings.
 *
 * If <WebVitals /> mount perturbed React reconciliation enough to shift the
 * LCP candidate to a different element, this test fails and Phase 58 ships
 * no further until investigated.
 *
 * MUST run against `pnpm build && pnpm start`.
 */

type LcpInfo = { selector: string; size: number; startTime: number };

async function captureLcp(page: Page): Promise<LcpInfo> {
  // Reuse Phase 57 spec's PerformanceObserver pattern.
  return await page.evaluate(() => {
    return new Promise<LcpInfo>((resolve) => {
      let last: LcpInfo | null = null;
      const obs = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const lcp = entry as PerformanceEntry & { element?: Element; size?: number };
          if (lcp.element) {
            const el = lcp.element as Element;
            last = {
              selector: `${el.tagName.toLowerCase()}${el.className ? "." + el.className.trim().split(/\s+/).join(".") : ""}`,
              size: lcp.size ?? 0,
              startTime: lcp.startTime,
            };
          }
        }
      });
      obs.observe({ type: "largest-contentful-paint", buffered: true });
      // Resolve on idle — LCP candidate stabilizes by load+1s.
      setTimeout(() => {
        obs.disconnect();
        if (last) resolve(last);
        else resolve({ selector: "(no-lcp-captured)", size: 0, startTime: 0 });
      }, 1500);
    });
  });
}

test.describe("@v18-phase58-lcp-guard (CIB-05 perturbation check)", () => {
  test("mobile LCP element matches Phase 57 GhostLabel baseline", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.load('700 100px "Anton"'));
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);

    const lcp = await captureLcp(page);
    // Guard against vacuous pass: PerformanceObserver-timeout fallback.
    expect(lcp.selector, "LCP capture timed out (no entries observed in 1500ms)").not.toBe("(no-lcp-captured)");
    // Phase 57 baseline classes: assert presence of structural classes that
    // uniquely identify the GhostLabel — sf-display + pointer-events-none + top-1/2.
    // Selector string is the dot-joined raw className — Tailwind arbitrary
    // brackets/slashes appear LITERALLY (not CSS-escaped).
    expect(lcp.selector, `Mobile LCP regressed: got ${lcp.selector}`).toContain("sf-display");
    expect(lcp.selector).toContain("pointer-events-none");
    expect(lcp.selector).toContain("top-1/2");
  });

  test("desktop LCP element matches Phase 57 VL-05 magenta `//` overlay baseline", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.load('700 100px "Anton"'));
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);

    const lcp = await captureLcp(page);
    // Guard against vacuous pass: PerformanceObserver-timeout fallback.
    expect(lcp.selector, "LCP capture timed out (no entries observed in 1500ms)").not.toBe("(no-lcp-captured)");
    // Phase 57 baseline classes for VL-05 overlay span. Plain substring matches —
    // Tailwind arbitrary brackets ([0.08em], [-0.12em]) appear LITERALLY in the
    // dot-joined className string.
    expect(lcp.selector, `Desktop LCP regressed: got ${lcp.selector}`).toContain("top-[0.08em]");
    expect(lcp.selector).toContain("pr-[0.28em]");
    expect(lcp.selector).toContain("tracking-[-0.12em]");
  });
});
