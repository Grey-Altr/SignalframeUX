import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Phase 35 homepage / — Agent 1 — Wave 1 full suite.
 *
 * Covers: PF-01 bundle gate (in bundle-gate.spec.ts), PF-03 LCP (in lcp-homepage.spec.ts),
 * nav-reveal contract, InstrumentHUD shape, GhostLabel THESIS lock, magenta budget,
 * reduced-motion smoke, LR-02 OG snapshot, and LR-04 mobile triad.
 */

const VIEWPORTS = [
  { width: 1440, height: 900, name: "desktop" },
  { width: 768, height: 1024, name: "tablet" },
  { width: 375, height: 667, name: "mobile" },
] as const;

test.describe("@phase35 homepage / — Agent 1", () => {

  for (const vp of VIEWPORTS) {
    test.describe(`${vp.name} -- ${vp.width}x${vp.height}`, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });

      // ── Nav-reveal contract ──────────────────────────────────────────────
      test("nav-reveal: hidden on load, visible after scroll", async ({ page }) => {
        // Phase 35 tightened pattern (Gap 1) — waitUntil domcontentloaded + timeout 500ms
        // Wave 3 T-03 fix: window.scrollBy does not drive Lenis (Lenis intercepts native scroll
        // but wheel events trigger its internal pipeline). Use page.mouse.wheel instead — Playwright
        // wheel events are real WheelEvent dispatches that Lenis picks up via its event listeners.
        await page.goto("/", { waitUntil: "domcontentloaded" });
        await expect(page.locator("body")).toHaveAttribute("data-nav-visible", "false", { timeout: 500 });
        // Scroll via wheel event — drives Lenis, which updates ScrollTrigger, which flips data-nav-visible
        await page.mouse.wheel(0, 800);
        await expect(page.locator("body")).toHaveAttribute("data-nav-visible", "true", { timeout: 2000 });
      });

      // ── InstrumentHUD shape + [01//ENTRY] label ──────────────────────────
      test("InstrumentHUD: [01//ENTRY] readable on first paint", async ({ page }) => {
        await page.goto("/", { waitUntil: "domcontentloaded" });
        const hud = page.locator("[data-instrument-hud]");
        await expect(hud).toBeVisible();
        // Section field should read [01//ENTRY] — first section is ENTRY
        const sectionField = page.locator("[data-hud-field='section']");
        await expect(sectionField).toBeVisible();
        await expect(sectionField).toContainText("ENTRY");
      });

      // ── GhostLabel THESIS location lock ─────────────────────────────────
      test("GhostLabel: locked to app/page.tsx (Phase 34 brief lock)", async () => {
        // Phase 34 locks GhostLabel deployment to app/page.tsx + app/system/page.tsx only.
        // This is a source-read assertion — no modification.
        const homeSrc = readFileSync(join(process.cwd(), "app/page.tsx"), "utf-8");
        expect(homeSrc).toContain("GhostLabel");
        // Must appear in the THESIS section context
        expect(homeSrc).toContain("THESIS");
        // Confirm the pair: system/page.tsx also uses GhostLabel (pair lock)
        const systemSrc = readFileSync(join(process.cwd(), "app/system/page.tsx"), "utf-8");
        expect(systemSrc).toContain("GhostLabel");
      });

      // ── Magenta budget upper-bound (CSS-rule proxy) ──────────────────────
      test("magenta budget: <= 5 text-primary hits on homepage source", async () => {
        // Magenta budget upper-bound — CSS-rule proxy per Phase 34 reconciliation.
        // Canonical measurement is per-page visual moments (brief rule); this grep is
        // a tactical guard for regression scans. See wiki/analyses/v1.5-phase34-reconciliation.md §VL-05.
        const src = readFileSync(join(process.cwd(), "app/page.tsx"), "utf-8");
        const magentaCount = (src.match(/text-primary|var\(--color-primary\)/g) || []).length;
        expect(magentaCount).toBeLessThanOrEqual(5);
      });

      // ── VL-05 hero slash sibling status-quo lock ─────────────────────────
      test("VL-05: hero-slash-moment element intact in entry-section.tsx (READ-ONLY)", async () => {
        // VL-05 status-quo lock — do not modify entry-section.tsx lines 43-58
        const src = readFileSync(join(process.cwd(), "components/blocks/entry-section.tsx"), "utf-8");
        expect(src).toContain('data-anim="hero-slash-moment"');
        expect(src).toContain('mixBlendMode: "screen"');
        expect(src).toContain("opacity: 0.25");
      });

      // ── Reduced-motion smoke ─────────────────────────────────────────────
      test("reduced-motion: page renders without layout break", async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto("/");
        await page.waitForLoadState("domcontentloaded");
        // Page must still have a visible h1
        await expect(page.locator("h1").first()).toBeVisible();
      });

      // ── LR-02 OG image endpoint ──────────────────────────────────────────
      test("LR-02: /opengraph-image responds 200 (RED until 35-03 lands)", async ({ page }) => {
        // This assertion is expected RED until plan 35-03 authors the OG image.
        // Wave 3 will re-verify after 35-03 ships.
        const response = await page.goto("/opengraph-image");
        expect(response?.status()).toBe(200);
      });

    });
  }

  // ── LR-04 mobile triad — must run at 375x667 ────────────────────────────
  // These three assertions are scoped to the 375x667 viewport per brain-wins D-1.
  test.describe("mobile 375x667 — LR-04 triad", () => {
    test.use({ viewport: { width: 375, height: 667 } });

    // W0-A: HUD 3-field truncation at mobile (AC-5a)
    test("LR-04: InstrumentHUD truncates to 3 fields at 375x667 (section / sig / time)", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("domcontentloaded");
      const hudFields = page.locator("[data-instrument-hud] [data-hud-field]");
      await expect(hudFields).toHaveCount(3);
      await expect(page.locator('[data-hud-field="section"]')).toBeVisible();
      await expect(page.locator('[data-hud-field="sig"]')).toBeVisible();
      await expect(page.locator('[data-hud-field="time"]')).toBeVisible();
      await expect(page.locator('[data-hud-field="scroll"]')).toHaveCount(0);
      await expect(page.locator('[data-hud-field="viewport"]')).toHaveCount(0);
    });

    // W0-A: HUD 5-field at desktop (contrast check — set viewport inline)
    test("LR-04: InstrumentHUD shows 5 fields at 1440x900", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto("/");
      await page.waitForLoadState("domcontentloaded");
      const hudFields = page.locator("[data-instrument-hud] [data-hud-field]");
      await expect(hudFields).toHaveCount(5);
    });

    // W0-B: reduced-motion nav-visible first-paint (AC-5b)
    test("LR-04: reduced-motion sets data-nav-visible=true on first paint at 375x667", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      // The useNavReveal reduced-motion branch sets body[data-nav-visible="true"]
      // immediately on mount — within 500ms of DOMContentLoaded per Gap 1 anchor
      await expect(page.locator("body")).toHaveAttribute("data-nav-visible", "true", { timeout: 500 });
    });

    // W0-C: GhostLabel parent overflow-x guard (AC-5c)
    test("LR-04: GhostLabel parents have overflow-x hidden/clip at 375x667", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");
      await page.waitForLoadState("domcontentloaded");
      // GhostLabel renders inside clamp(200px, 25vw, 400px) and uses negative-margin
      // architectural offset — its parent MUST have overflow-x: hidden or clip to
      // prevent horizontal scroll bleed on mobile (34-RESEARCH.md Pitfall 3).
      const ghostLabels = page.locator("[data-ghost-label]");
      const count = await ghostLabels.count();
      expect(count).toBeGreaterThanOrEqual(1);
      for (let i = 0; i < count; i++) {
        const ghost = ghostLabels.nth(i);
        const parentOverflowX = await ghost.evaluate((el) => {
          const parent = el.parentElement;
          return parent ? getComputedStyle(parent).overflowX : null;
        });
        expect(["hidden", "clip"]).toContain(parentOverflowX);
      }
    });

  });

});
