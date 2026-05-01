import { test, expect, type Page } from "@playwright/test";

/**
 * Phase 66 ARC-02 — Pillarbox transform breakpoint computed-style gate.
 *
 * Asserts the architectural contract from
 * `.planning/codebase/scale-canvas-track-b-decision.md` (§"Mechanism Selected: Pillarbox"):
 *
 *   - At vw < 640 (Tailwind sm), [data-sf-canvas] computed transform === identity
 *     (matrix(1, 0, 0, 1, 0, 0) OR "none" — browser may report either).
 *   - At vw < 640, --sf-content-scale === "1".
 *   - At vw >= 640, transform is non-identity AND --sf-content-scale tracks vw/1280.
 *   - Cross-resize: live applyScale() ResizeObserver path follows the same branch.
 *
 * Spec runs against the absolute URL via CAPTURE_BASE_URL (default
 * http://localhost:3000 — matches playwright.config.ts baseURL + CI's webServer
 * port). Worktree users with port collisions can override via
 * CAPTURE_BASE_URL=http://localhost:3001.
 *
 * Production build only (`pnpm build && pnpm start`); see Plan 02 §verify.
 */

const ABS_BASE = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";

const IDENTITY_MATRIX = "matrix(1, 0, 0, 1, 0, 0)";

async function getCanvasTransform(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    const el = document.querySelector("[data-sf-canvas]") as HTMLElement | null;
    return el ? getComputedStyle(el).transform : null;
  });
}

async function getContentScale(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    const v = getComputedStyle(document.documentElement).getPropertyValue(
      "--sf-content-scale",
    );
    return v ? v.trim() : null;
  });
}

test.describe("@v1.9-phase66 pillarbox transform breakpoint", () => {
  test("Test 1: mobile 360x667 — [data-sf-canvas] transform is identity", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 667 });
    await page.goto(`${ABS_BASE}/`, { waitUntil: "networkidle" });
    const transform = await getCanvasTransform(page);
    expect(transform).not.toBeNull();
    expect(transform === IDENTITY_MATRIX || transform === "none").toBe(true);
  });

  test("Test 2: mobile 360x667 — --sf-content-scale === '1'", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 667 });
    await page.goto(`${ABS_BASE}/`, { waitUntil: "networkidle" });
    const scale = await getContentScale(page);
    expect(scale).toBe("1");
  });

  test("Test 3: desktop 1440x900 — [data-sf-canvas] transform is NON-identity", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${ABS_BASE}/`, { waitUntil: "networkidle" });
    const transform = await getCanvasTransform(page);
    expect(transform).not.toBeNull();
    expect(transform).not.toBe(IDENTITY_MATRIX);
    expect(transform).not.toBe("none");
    // Sanity: should be a matrix(...) form
    expect(transform!).toMatch(/^matrix\(/);
  });

  test("Test 4: desktop 1440x900 — --sf-content-scale ≈ 1.125 (1440/1280)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${ABS_BASE}/`, { waitUntil: "networkidle" });
    const scale = await getContentScale(page);
    expect(scale).not.toBeNull();
    const parsed = parseFloat(scale!);
    expect(parsed).toBeGreaterThan(1.1);
    expect(parsed).toBeLessThan(1.15);
  });

  test("Test 5: cross-breakpoint resize — desktop -> mobile collapses to identity", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${ABS_BASE}/`, { waitUntil: "networkidle" });

    const before = await getCanvasTransform(page);
    expect(before).not.toBe(IDENTITY_MATRIX);
    expect(before).not.toBe("none");

    // Cross the breakpoint live
    await page.setViewportSize({ width: 360, height: 667 });
    // ResizeObserver + rAF schedule + ScrollTrigger.refresh — give it a frame
    await page.waitForTimeout(150);

    const after = await getCanvasTransform(page);
    expect(after).not.toBeNull();
    expect(after === IDENTITY_MATRIX || after === "none").toBe(true);
  });
});
