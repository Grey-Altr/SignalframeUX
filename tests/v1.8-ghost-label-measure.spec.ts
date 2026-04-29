import { test, expect } from "@playwright/test";
import path from "node:path";
import { promises as fs } from "node:fs";

/**
 * Phase 60 Plan 02 Wave 0 — GhostLabel getBoundingClientRect() measurement.
 *
 * Derives the canonical containIntrinsicSize value for the LCP intervention
 * applied in Task 60-02-02. MUST run against `pnpm build && pnpm start`,
 * NOT `pnpm dev` (RESEARCH §Anti-Pattern 4: dev-mode React double-render
 * inflates layout timing).
 *
 * RESEARCH §Q1 baseline: at 360 px viewport, font-size clamps to 200px;
 * at 390 px, clamps to 200px; at 834 px, ~208.5px (above clamp floor);
 * at 1440 px, 360px. Rendered height ≈ font-size × leading-none (line-height: 1).
 * Single recommended starting estimate: `containIntrinsicSize: "auto 200px"`
 * for mobile/tablet; verify here that this is correct (or override).
 *
 * Also captures the SFSection ancestor's computed `contain` + `overflow` per
 * RESEARCH §Q2 caveat — if the section has a containment context that puts
 * the GhostLabel permanently in-viewport, content-visibility:auto deferral
 * will be a no-op and D-04 reactive escalation handles it.
 */

const VIEWPORTS = [
  { name: "mobile-360x800", width: 360, height: 800 },
  { name: "iphone13-390x844", width: 390, height: 844 },
  { name: "ipad-834x1194", width: 834, height: 1194 },
  { name: "desktop-1440x900", width: 1440, height: 900 },
] as const;

const OUTPUT_PATH = path.resolve(
  process.cwd(),
  ".planning/phases/60-lcp-element-repositioning/60-02-wave0-measurements.json"
);

type Measurement = {
  viewport: string;
  width: number;
  height: number;
  sectionContain: string | null;
  sectionOverflow: string | null;
};

const results: Measurement[] = [];

test.describe("@v1.8-phase60-wave0 GhostLabel rect measurement", () => {
  for (const vp of VIEWPORTS) {
    test(`GhostLabel rect @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/", { waitUntil: "load" });

      // Force warm-state Anton (matches baseline-capture.spec.ts:60-61).
      await page.evaluate(() => document.fonts.load('700 100px "Anton"'));
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(100);

      // Measure the GhostLabel via its data-ghost-label attribute.
      const measurement = await page.evaluate(() => {
        const el = document.querySelector('[data-ghost-label="true"]');
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        // Walk up to the nearest [data-section] ancestor — the SFSection wrapper —
        // and read its computed `contain` + `overflow` so RESEARCH §Q2 caveat
        // (containment context defeating leaf deferral) can be confirmed.
        let section: Element | null = el.parentElement;
        while (section && !(section as HTMLElement).hasAttribute("data-section")) {
          section = section.parentElement;
        }
        const cs = section ? getComputedStyle(section) : null;
        return {
          width: rect.width,
          height: rect.height,
          sectionContain: cs ? cs.contain : null,
          sectionOverflow: cs ? cs.overflow : null,
        };
      });

      expect(measurement).not.toBeNull();
      results.push({ viewport: vp.name, ...measurement! });
    });
  }

  test.afterAll(async () => {
    await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
    await fs.writeFile(OUTPUT_PATH, JSON.stringify(results, null, 2) + "\n");
  });
});
