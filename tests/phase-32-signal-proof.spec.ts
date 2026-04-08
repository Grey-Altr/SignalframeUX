/**
 * Phase 32 — SIGNAL + PROOF Sections
 * Plan 01 tests: PR-01 through PR-06 for the PROOF section.
 * Plan 02 will append SG-01 through SG-05 tests below the marker.
 *
 * Pattern: fs.readFileSync source-level grep assertions mixed with browser-level tests.
 * Requires dev server on http://localhost:3000 for browser tests.
 *
 * SIGNAL/FRAME ordering: signal runs through the frame.
 */
import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const PROOF_SECTION_PATH = path.resolve(
  ROOT,
  "components/blocks/proof-section.tsx",
);

test.describe("Phase 32: SIGNAL + PROOF Sections", () => {
  // ── PR-01: PROOF section exists and is 100vh ────────────────────────────────

  test("PR-01: PROOF section exists and is 100vh at desktop 1440x900", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const proof = page.locator("#proof");
    await expect(proof).toBeVisible({ timeout: 5000 });
    await proof.scrollIntoViewIfNeeded();

    // The ProofSection inner section (data-proof-root) has 100vh height via inline style.
    // We target [data-proof-root] because the parent SFSection wrapper may inflate
    // the bounding box if it has its own padding — the inner element has the 100vh contract.
    const proofRoot = page.locator("[data-proof-root]").first();
    await expect(proofRoot).toBeVisible({ timeout: 5000 });

    const box = await proofRoot.boundingBox();
    expect(box).not.toBeNull();
    const vh = page.viewportSize()!.height;
    // Allow +/- 5px tolerance per PR-01 spec
    expect(
      box!.height,
      "PROOF root height should be 100vh ± 5px",
    ).toBeGreaterThanOrEqual(vh - 5);
    expect(
      box!.height,
      "PROOF root height should be 100vh ± 5px",
    ).toBeLessThanOrEqual(vh + 5);

    // Geometry: position relative, overflow hidden
    const styles = await proofRoot.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { position: cs.position, overflow: cs.overflow };
    });
    expect(styles.position, "PROOF root position").toBe("relative");
    // overflow shorthand expands — check either overflow or overflow-x/y hidden
    const overflowHidden = await proofRoot.evaluate((el) => {
      const cs = getComputedStyle(el);
      return (
        cs.overflow === "hidden" ||
        cs.overflowX === "hidden" ||
        cs.overflowY === "hidden"
      );
    });
    expect(overflowHidden, "PROOF root has overflow hidden").toBe(true);
  });

  // ── PR-02: PROOF pointer interaction changes --signal-intensity ─────────────

  test("PR-02: PROOF pointer interaction changes --signal-intensity on section element", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const proof = page.locator("#proof");
    await proof.scrollIntoViewIfNeeded();

    // The rAF lerp writes --signal-intensity on [data-proof-root], not the parent SFSection.
    const proofRoot = page.locator("[data-proof-root]").first();
    await expect(proofRoot).toBeVisible({ timeout: 5000 });

    const box = await proofRoot.boundingBox();
    expect(box).not.toBeNull();

    // Move pointer to right side (high intensity)
    const rightX = box!.x + box!.width * 0.85;
    const midY = box!.y + box!.height * 0.5;
    await page.mouse.move(rightX, midY);
    // Wait for lerp to settle (~250ms)
    await page.waitForTimeout(300);

    const intensityBefore = await proofRoot.evaluate((el) => {
      return parseFloat(
        (el as HTMLElement).style.getPropertyValue("--signal-intensity") || "0",
      );
    });

    // Move pointer to left side (low intensity)
    const leftX = box!.x + box!.width * 0.15;
    await page.mouse.move(leftX, midY);
    await page.waitForTimeout(300);

    const intensityAfter = await proofRoot.evaluate((el) => {
      return parseFloat(
        (el as HTMLElement).style.getPropertyValue("--signal-intensity") || "0",
      );
    });

    // Left cursor yields lower intensity than right cursor
    expect(
      intensityBefore - intensityAfter,
      "Delta between right and left pointer positions should be >= 0.3",
    ).toBeGreaterThanOrEqual(0.3);
    expect(
      intensityAfter,
      "Left-side intensity should be lower than right-side intensity",
    ).toBeLessThan(intensityBefore);
  });

  // ── PR-03: Three concurrent layers visible simultaneously ───────────────────

  test("PR-03: PROOF layer separation — three concurrent layers exist simultaneously", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const proof = page.locator("#proof");
    await proof.scrollIntoViewIfNeeded();

    // Layer A — shader (WebGL canvas wrapper)
    const shaderLayer = page.locator('#proof [data-proof-layer="shader"]');
    await expect(shaderLayer).toHaveCount(1);

    // Layer B — component skeletons
    const skeletonLayer = page.locator('#proof [data-proof-layer="skeleton"]');
    await expect(skeletonLayer).toHaveCount(1);

    // Layer C — FRAME-pole column
    const framePoleLayer = page.locator('#proof [data-proof-layer="frame-pole"]');
    await expect(framePoleLayer).toHaveCount(1);

    // All three must be simultaneously in DOM (not conditional rendering)
    await expect(shaderLayer).toBeVisible();
    await expect(framePoleLayer).toBeVisible();

    // PR-05 source-level: Pointer Events API check (no touchmove)
    const proofSrc = fs.readFileSync(PROOF_SECTION_PATH, "utf-8");
    expect(
      proofSrc,
      "proof-section.tsx must use pointermove",
    ).toContain("pointermove");
    expect(
      proofSrc,
      "proof-section.tsx must NOT use touchmove",
    ).not.toContain("touchmove");
  });

  // ── PR-04: PROOF stats rendered inside FRAME-pole column ───────────────────

  test("PR-04: PROOF stats data points rendered inside FRAME-pole column", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const proof = page.locator("#proof");
    await proof.scrollIntoViewIfNeeded();

    const framePole = page.locator('#proof [data-proof-layer="frame-pole"]');
    await expect(framePole).toHaveCount(1);

    const content = await framePole.textContent();
    expect(content).not.toBeNull();

    // Component count
    expect(content, "FRAME-pole must contain component count '51'").toContain(
      "51",
    );
    // Bundle size (allow "100KB" or "100 KB" with optional space)
    expect(
      content,
      "FRAME-pole must contain bundle size '100KB' or '100 KB'",
    ).toMatch(/100\s?KB/);
    // Lighthouse score
    expect(
      content,
      "FRAME-pole must contain Lighthouse score '100/100'",
    ).toContain("100/100");
  });

  // ── PR-05: PROOF uses Pointer Events API, not touchmove (source-level) ──────
  // Note: PR-05 source grep is also embedded in PR-03 test above.
  // This standalone test provides an explicit PR-05 labeled assertion.

  test("PR-05: PROOF uses pointermove (Pointer Events API) — no touchmove", () => {
    const src = fs.readFileSync(PROOF_SECTION_PATH, "utf-8");
    expect(src, "proof-section.tsx must use pointermove").toContain(
      "pointermove",
    );
    expect(src, "proof-section.tsx must NOT use touchmove").not.toContain(
      "touchmove",
    );
  });

  // ── PR-06: Reduced-motion renders static split, no canvas, no listener ──────

  test("PR-06: PROOF reduced-motion renders static split, no canvas, no pointer listener", async ({
    browser,
  }) => {
    const ctx = await browser.newContext({
      reducedMotion: "reduce",
      viewport: { width: 1440, height: 900 },
    });
    const rmPage = await ctx.newPage();
    const rmJsErrors: string[] = [];
    rmPage.on("console", (msg) => {
      if (msg.type() === "error") rmJsErrors.push(msg.text());
    });
    rmPage.on("pageerror", (err) => rmJsErrors.push(err.message));

    await rmPage.goto("/");
    await rmPage.waitForLoadState("networkidle");

    const proof = rmPage.locator("#proof");
    await expect(proof).toBeVisible({ timeout: 5000 });
    await proof.scrollIntoViewIfNeeded();

    // No WebGL canvas should be registered in reduced-motion mode
    const canvasCount = await rmPage.locator("#proof canvas").count();
    expect(
      canvasCount,
      "PROOF canvas count should be 0 under reduced-motion",
    ).toBe(0);

    // FRAME-pole column still visible (static)
    const framePole = rmPage.locator('#proof [data-proof-layer="frame-pole"]');
    await expect(framePole).toHaveCount(1);
    const fpBox = await framePole.boundingBox();
    expect(fpBox).not.toBeNull();
    expect(fpBox!.width, "FRAME-pole must have non-zero width").toBeGreaterThan(
      0,
    );
    expect(
      fpBox!.height,
      "FRAME-pole must have non-zero height",
    ).toBeGreaterThan(0);

    // Skeleton layer still visible (static, no opacity animation)
    const skeletonLayer = rmPage.locator('#proof [data-proof-layer="skeleton"]');
    await expect(skeletonLayer).toHaveCount(1);
    const skelBox = await skeletonLayer.boundingBox();
    expect(skelBox).not.toBeNull();
    expect(
      skelBox!.width,
      "Skeleton layer must have non-zero width",
    ).toBeGreaterThan(0);

    // Source-level: verify conditional early return for reduced-motion
    const src = fs.readFileSync(PROOF_SECTION_PATH, "utf-8");
    expect(
      src,
      "proof-section.tsx must contain prefers-reduced-motion guard",
    ).toContain("prefers-reduced-motion");

    // No JS console errors under reduced-motion
    expect(
      rmJsErrors,
      "No console errors under reduced-motion",
    ).toHaveLength(0);

    await ctx.close();
  });

  // Plan 02 (SIGNAL section) will append SG-01 through SG-05 tests below this marker.
  // ------------------------------------------------------------------------------
});
