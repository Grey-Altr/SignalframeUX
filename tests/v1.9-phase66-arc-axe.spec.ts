import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Phase 66 Plan 03 Task 1 — Direct @axe-core/playwright per-rule gates for
 * ARC-03 (target-size mobile) + ARC-04 (color-contrast desktop).
 *
 * Unlike `tests/phase-38-a11y.spec.ts` (which uses `withTags(["wcag2a","wcag2aa"])`
 * + an AXE_EXCLUDE list that includes `[data-ghost-label]`), this spec runs
 * axe-core SHARP — directly on the rules that path_h/path_i loosened the LHCI
 * gate against, with NO selector exclusions for GhostLabel.
 *
 * The whole point of ARC-04 (Plan 02 pseudo-element refactor) is that axe-core
 * 4.x cannot measure pseudo-element content for the color-contrast rule. If the
 * GhostLabel pseudo-element ships correctly, color-contrast passes WITHOUT the
 * project-internal `[data-ghost-label]` exclusion.
 *
 * Likewise, ARC-03 (Plan 02 pillarbox: `transform: none` below sm/640px) means
 * axe-core's `target-size` rule reads native getBoundingClientRect() at LHCI
 * mobile (375x667 viewport, < 640) — footer links render at 24px+ native, not
 * the post-transform ~6.7px that v1.8 produced.
 *
 * Running both `withRules([...])` and `withTags(["wcag22aa"])` paths gives
 * belt-and-suspenders coverage: rule-level path catches the rule directly;
 * tag-level path catches it via the tag-→rule expansion that LHCI uses
 * internally.
 *
 * Run:
 *   pnpm exec playwright test tests/v1.9-phase66-arc-axe.spec.ts --project=chromium
 *
 * MUST run against `pnpm build && pnpm start` (production), to match the LHCI
 * measurement target and to avoid dev-mode injected text-overlays / probes.
 *
 * URL handling: per Plan 01/02 SUMMARY worktree-leakage discipline (Deviation 1),
 * playwright.config.ts hardcodes `baseURL: "http://localhost:3000"` and stale
 * servers from other worktrees often occupy that port. Use `CAPTURE_BASE_URL`
 * env override (default `http://localhost:3001`) and absolute `goto` calls so
 * the spec works regardless of port collisions. Pattern matches
 * tests/v1.9-phase66-pillarbox-transform.spec.ts + lcp-stability.spec.ts.
 */

const ABS_BASE = process.env.CAPTURE_BASE_URL ?? "http://localhost:3001";

test.describe("@v1.9-phase66 ARC direct axe rules", () => {
  test.use({ colorScheme: "light" });

  test("ARC-03 target-size at mobile 375x667 (LHCI mobile profile)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${ABS_BASE}/`, { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page })
      .withRules(["target-size"])
      .analyze();
    const violations = results.violations.filter((v) => v.id === "target-size");
    expect(
      violations,
      `target-size violations at 375x667 (post-pillarbox should be 0):\n` +
        violations
          .map(
            (v) =>
              `  ${v.id}: ${v.description}\n` +
              v.nodes
                .slice(0, 3)
                .map((n) => `    HTML: ${n.html}`)
                .join("\n")
          )
          .join("\n")
    ).toHaveLength(0);
  });

  test("ARC-04 color-contrast at desktop 1440x900 (NO data-ghost-label exclusion)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${ABS_BASE}/`, { waitUntil: "networkidle" });
    // CRITICAL: do NOT call .exclude("[data-ghost-label]") — that would defeat
    // the purpose of ARC-04. Plan 02 ships pseudo-element rendering for the
    // GhostLabel; axe-core 4.x cannot measure pseudo-element content for the
    // color-contrast rule. The pseudo-element IS the suppression mechanism.
    const results = await new AxeBuilder({ page })
      .withRules(["color-contrast"])
      .analyze();
    const violations = results.violations.filter(
      (v) => v.id === "color-contrast"
    );
    expect(
      violations,
      `color-contrast violations at 1440x900 (post-pseudo-element should be 0):\n` +
        violations
          .map(
            (v) =>
              `  ${v.id}: ${v.description}\n` +
              v.nodes
                .slice(0, 3)
                .map((n) => `    HTML: ${n.html}`)
                .join("\n")
          )
          .join("\n")
    ).toHaveLength(0);
  });

  test("ARC-03 target-size via wcag22aa tag at mobile 375x667", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${ABS_BASE}/`, { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag22aa"])
      .analyze();
    const violations = results.violations.filter((v) => v.id === "target-size");
    expect(
      violations,
      `target-size (wcag22aa tag path) violations:\n` +
        violations
          .map((v) => `  ${v.id}: ${v.nodes.length} nodes`)
          .join("\n")
    ).toHaveLength(0);
  });

  test("ARC-04 color-contrast via wcag2aa tag at desktop 1440x900", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${ABS_BASE}/`, { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2aa"])
      .analyze();
    const violations = results.violations.filter(
      (v) => v.id === "color-contrast"
    );
    expect(
      violations,
      `color-contrast (wcag2aa tag path) violations:\n` +
        violations
          .map(
            (v) =>
              `  ${v.id}: ${v.nodes.length} nodes — first: ${v.nodes[0]?.html ?? "n/a"}`
          )
          .join("\n")
    ).toHaveLength(0);
  });
});
