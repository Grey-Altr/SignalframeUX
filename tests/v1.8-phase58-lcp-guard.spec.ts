import { test, expect, type Locator, type Page } from "@playwright/test";

/**
 * Phase 58 — LCP element identity guard (CIB-05 perturbation check).
 *
 * STRUCTURAL TEST (post-Phase-66 architectural refactor).
 *
 * Phase 57 baselines (.planning/codebase/v1.8-lcp-diagnosis.md §1):
 *   mobile-360x800   -> components/animation/ghost-label.tsx (sf-display + 4% opacity GhostLabel)
 *   desktop-1440x900 -> components/blocks/entry-section.tsx:208 (VL-05 magenta // overlay)
 *
 * Phase 66 footnote (.planning/phases/66-scalecanvas-track-b-architectural-decision/66-lcp-postcapture.md):
 *   The mobile LCP candidate identity shifted after Phase 60 LCP-02 path-b applied
 *   `content-visibility: auto` to the GhostLabel leaf. The post-capture LCP candidate
 *   on the LHCI mobile preset (375x667) is the visible hero per-character span
 *   `span.sf-hero-deferred.inline-block` (the first painted character of "SIGNALFRAME//UX"
 *   in components/blocks/entry-section.tsx:120-141). The desktop LCP target remains
 *   the VL-05 magenta `//` overlay span at entry-section.tsx:208.
 *
 * --- WHY STRUCTURAL ---
 *
 * Phase 64 PR #4 (commit b70fbd6) ratified that Chrome's `largest-contentful-paint`
 * paint-timing API consistently reports a null element reference for
 * `content-visibility:auto`-wrapped LCP candidates, making the previous
 * live-paint-observer assertion architecturally unreliable on the post-Phase-60
 * surface. Both CI (linux) and local (darwin) reproduced the failure
 * deterministically (CI runs 25129208601 / 25130306536 / 25135979219).
 *
 * Phase 66 (v1.9 architectural lock) replaces the paint-observer assertion
 * with structural DOM queries:
 *   - The DOM is the source of truth for "what LCP candidate identity exists in this build".
 *   - We query the LCP-candidate elements DIRECTLY by their structural class signature
 *     and assert (a) they are visible, (b) their bounding rect is non-empty,
 *     (c) their top edge is above the fold (top < viewport.innerHeight).
 *   - This catches the same regressions the previous spec was designed to catch
 *     (LCP candidate element renamed/moved/removed) without depending on Chrome's
 *     flaky paint-entry element reference exposure.
 *
 * Selector composition note: Tailwind arbitrary-value class tokens contain
 * literal `[`, `]`, `/`, `.`, `:` characters. Use CSS attribute-token selectors
 * (`[class~="..."]`) to match by whitespace-separated class tokens without
 * needing to manually CSS-escape the brackets/slashes.
 *
 * If the LCP candidate identity has shifted (element renamed, moved, removed),
 * one of these locators returns 0 visible matches and this test fails — Phase 58
 * ships no further until investigated.
 *
 * MUST run against `pnpm build && pnpm start` (production server).
 */

const MOBILE_VIEWPORT = { width: 375, height: 667 } as const;
const DESKTOP_VIEWPORT = { width: 1440, height: 900 } as const;

/**
 * Settle paint state in a font/motion-stable posture before measuring DOM
 * geometry. Mirrors the warm-Anton + reduced-motion ritual used in
 * tests/v1.8-lcp-candidates.spec.ts and Phase 57 DGN-01 capture so the
 * structural query runs against the same paint state the LCP candidate was
 * captured under in `.planning/codebase/v1.8-lcp-diagnosis.md`.
 */
async function settlePaintState(page: Page): Promise<void> {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.load('700 100px "Anton"'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
}

/**
 * Assert the locator points at a single visible element with non-zero geometry
 * whose top edge sits above the bottom of the viewport. This is the structural
 * stand-in for "this element was a paintable LCP candidate at first paint".
 */
async function assertAboveFoldVisible(
  locator: Locator,
  viewportHeight: number,
  label: string
): Promise<void> {
  await expect(locator, `${label}: locator must resolve to a visible element`).toBeVisible();
  const box = await locator.boundingBox();
  expect(box, `${label}: boundingBox must be non-null`).not.toBeNull();
  expect(box!.width, `${label}: width must be > 0`).toBeGreaterThan(0);
  expect(box!.height, `${label}: height must be > 0`).toBeGreaterThan(0);
  expect(
    box!.y,
    `${label}: top edge (${box!.y}) must be above viewport bottom (${viewportHeight})`
  ).toBeLessThan(viewportHeight);
}

// Honor PLAYWRIGHT_BASE_URL env var so the spec can target a worktree-local
// production server on a non-default port (e.g. when port 3000 is occupied
// by another worktree's dev server). Falls through to the playwright.config.ts
// default (`http://localhost:3000`) when unset.
if (process.env.PLAYWRIGHT_BASE_URL) {
  test.use({ baseURL: process.env.PLAYWRIGHT_BASE_URL });
}

test.describe("@v18-phase58-lcp-guard (CIB-05 perturbation check, structural)", () => {
  test("mobile LCP-candidate hero per-character span exists and is above-fold", async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    await settlePaintState(page);

    // Phase 66 post-capture mobile LCP candidate: the first painted hero
    // per-character span (`<span class="sf-hero-deferred inline-block">S</span>`,
    // first child span of the inline-block overflow-hidden wrapper sequence in
    // components/blocks/entry-section.tsx:132). Use `[class~="..."]` token
    // selectors to avoid CSS-escaping the class names.
    //
    // .first() picks the first per-character span ("S"), which is the leftmost
    // glyph and the earliest painted character of the SIGNALFRAME//UX hero
    // wordmark. If the hero per-character architecture is renamed, removed, or
    // its class chain drifts, this query returns 0 matches and the toBeVisible
    // assertion fails — exactly the regression Phase 58 CIB-05 is meant to
    // catch.
    const heroChar = page
      .locator('span[class~="sf-hero-deferred"][class~="inline-block"]')
      .first();

    await assertAboveFoldVisible(heroChar, MOBILE_VIEWPORT.height, "mobile hero-char");
  });

  test("desktop LCP-candidate VL-05 magenta `//` overlay span exists and is above-fold", async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
    await settlePaintState(page);

    // Phase 57 desktop LCP target: the visible VL-05 magenta `//` overlay span
    // at components/blocks/entry-section.tsx:208 (parent
    // `<div data-anim="hero-slash-moment">`). Class chain is
    // `relative top-[0.08em] pr-[0.28em] tracking-[-0.12em] text-[1.28em]`.
    //
    // CRITICAL DISAMBIGUATION: an *identical* class chain is also rendered
    // inside the SVG mask <foreignObject> at line 170 (the luminance-mask
    // companion). The mask span lives inside <defs> and is NEVER painted
    // (Playwright reports it as not visible). Using `.last()` picks the
    // visible overlay span (which appears after the mask in DOM order) and
    // toBeVisible() defends against the case where DOM order ever flips.
    const slashOverlay = page
      .locator(
        'span[class~="relative"][class~="top-[0.08em]"][class~="pr-[0.28em]"][class~="tracking-[-0.12em]"][class~="text-[1.28em]"]'
      )
      .last();

    await assertAboveFoldVisible(slashOverlay, DESKTOP_VIEWPORT.height, "desktop VL-05 overlay");
  });
});
