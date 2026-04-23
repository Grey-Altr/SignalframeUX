import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Phase 35 /inventory — Agent 5 — Wave 1 full suite.
 *
 * Closes the Phase 34 coverage gap: phase-34-visual-language-subpage.spec.ts
 * lines 287-313 explicitly excluded /inventory nav-reveal. This file closes that
 * gap and adds 12-row breadth integrity + ComponentDetail expand-in-place check.
 */

const VIEWPORTS = [
  { width: 1440, height: 900, name: "desktop" },
  { width: 768, height: 1024, name: "tablet" },
  { width: 375, height: 667, name: "mobile" },
] as const;

test.describe("@phase35 /inventory — Agent 5", () => {

  for (const vp of VIEWPORTS) {
    test.describe(`${vp.name} -- ${vp.width}x${vp.height}`, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });

      // ── SP-05 nav-reveal contract (Phase 34 coverage gap — tightened Gap 1) ──
      test("SP-05: nav-reveal hidden on load, visible after scroll on /inventory", async ({ page }) => {
        // Phase 35 tightened pattern (Gap 1) — closes Phase 34 coverage gap for /inventory.
        // phase-34-visual-language-subpage.spec.ts explicitly excluded this route.
        await page.goto("/inventory", { waitUntil: "domcontentloaded" });
        await expect(page.locator("body")).toHaveAttribute("data-nav-visible", "false", { timeout: 500 });
        await page.evaluate(() => window.scrollBy(0, 600));
        await expect(page.locator("body")).toHaveAttribute("data-nav-visible", "true", { timeout: 500 });
      });

      // ── 12-row breadth integrity: ≥1 entry per category, ≥2 GEN entries ──
      test("12-row breadth: component grid has entries across all 6 categories", async () => {
        // Source check: registry must have entries in all 6 categories.
        // Categories: FORMS, LAYOUT, NAVIGATION, FEEDBACK, DATA_DISPLAY, GENERATIVE.
        // lib/component-registry.ts is a barrel now — per-category files live in
        // lib/registry/*.ts. Each entry still declares `category: "..."`.
        const categoryFiles: Record<string, string> = {
          FORMS: "lib/registry/forms.ts",
          LAYOUT: "lib/registry/layout.ts",
          NAVIGATION: "lib/registry/navigation.ts",
          FEEDBACK: "lib/registry/feedback.ts",
          DATA_DISPLAY: "lib/registry/data-display.ts",
          GENERATIVE: "lib/registry/generative.ts",
        };
        for (const [category, file] of Object.entries(categoryFiles)) {
          const src = readFileSync(join(process.cwd(), file), "utf-8");
          expect(src, `${file} should declare category: "${category}"`).toContain(
            `category: "${category}"`,
          );
        }
        // GEN ≥2 entries at the tail of the registry
        const genSrc = readFileSync(join(process.cwd(), "lib/registry/generative.ts"), "utf-8");
        const genMatches = genSrc.match(/category: "GENERATIVE"/g) || [];
        expect(genMatches.length).toBeGreaterThanOrEqual(2);
      });

      // ── ComponentDetail expand-in-place on /inventory ────────────────────
      test("ComponentDetail: expand-in-place (not fixed-overlay) on /inventory", async ({ page }) => {
        // STATE.md v1.4 carry-forward: ComponentDetail is DOM sibling (expand-in-place)
        // on /inventory. Fixed-overlay is homepage behavior only.
        // Assert: clicking a component row does NOT add data-modal-open to body
        // (data-modal-open is the fixed-overlay / homepage pattern per SI-04 z-index contract).
        // Prev implementation used [aria-expanded] which first-matched the CdCornerPanel
        // SIGNAL overlay button (invisible) — scope to ComponentsExplorer grid rows.
        await page.goto("/inventory");
        await page.waitForLoadState("networkidle");
        const firstRow = page.locator("[data-component-index]").first();
        await firstRow.waitFor();
        await firstRow.scrollIntoViewIfNeeded();
        await firstRow.click();
        // After expanding, body should NOT have data-modal-open (that's the fixed-overlay path)
        const modalOpen = await page.locator("body").getAttribute("data-modal-open");
        expect(modalOpen).toBeNull();
      });

      // ── Magenta budget upper-bound ───────────────────────────────────────
      test("magenta budget: <= 5 hits on /inventory source", async () => {
        // Magenta budget upper-bound — CSS-rule proxy per Phase 34 reconciliation.
        // Canonical measurement is per-page visual moments (brief rule); this grep is
        // a tactical guard for regression scans. See wiki/analyses/v1.5-phase34-reconciliation.md §VL-05.
        const src = readFileSync(join(process.cwd(), "app/inventory/page.tsx"), "utf-8");
        const magentaCount = (src.match(/text-primary|var\(--color-primary\)/g) || []).length;
        expect(magentaCount).toBeLessThanOrEqual(5);
      });

    });
  }

  // ── LR-04 reduced-motion nav-visible first-paint (AC-5b for /inventory) ──
  test.describe("mobile 375x667 — reduced-motion first-paint", () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test("LR-04: reduced-motion sets data-nav-visible=true on first paint at 375x667", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/inventory", { waitUntil: "domcontentloaded" });
      await expect(page.locator("body")).toHaveAttribute("data-nav-visible", "true", { timeout: 500 });
    });

  });

});
