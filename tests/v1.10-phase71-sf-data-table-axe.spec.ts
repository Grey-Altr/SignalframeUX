// Phase 71 Plan 03 Task 5 — Direct @axe-core/playwright per-rule gates for
// SFDataTable (TST-03 axe scope).
//
// Mirrors the per-rule sharp-scan precedent at tests/v1.9-phase66-arc-axe.spec.ts.
// Runs three rule clusters against the playground fixture:
//   - DT-01 button-name + aria-allowed-attr + aria-valid-attr-value (sort headers)
//   - DT-04 label + aria-checked (selection checkboxes)
//   - DT-05 color-contrast (all rendered text)
//
// Vacuous-green guard: each test asserts table-visible before scanning, so a
// 404 / blank fixture cannot pass with zero violations.
//
// Run:
//   pnpm exec playwright test tests/v1.10-phase71-sf-data-table-axe.spec.ts --project=chromium

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ABS_BASE = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";
const PLAYGROUND_URL = `${ABS_BASE}/dev-playground/sf-data-table`;

test.describe("@v1.10-phase71 SFDataTable axe-core", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PLAYGROUND_URL, { waitUntil: "networkidle" });
    // Vacuous-green guard
    await expect(page.locator("table")).toBeVisible();
    await expect(page.locator("tbody tr")).toHaveCount(10);
  });

  test("DT-01 button-name + aria-allowed-attr: sort headers are accessible buttons", async ({
    page,
  }) => {
    const results = await new AxeBuilder({ page })
      .withRules([
        "button-name",
        "aria-allowed-attr",
        "aria-valid-attr-value",
      ])
      .analyze();
    const violations = results.violations.filter((v) =>
      ["button-name", "aria-allowed-attr", "aria-valid-attr-value"].includes(
        v.id
      )
    );
    expect(
      violations,
      `axe violations on sort headers (DT-01):\n` +
        violations
          .map(
            (v) =>
              `  ${v.id}: ${v.description}\n` +
              v.nodes
                .slice(0, 3)
                .map((n) => `    ${n.html}`)
                .join("\n")
          )
          .join("\n")
    ).toHaveLength(0);
  });

  test("DT-04 label + aria-required-attr: selection checkboxes have accessible names", async ({
    page,
  }) => {
    // Note: `aria-checked` is not an axe rule (it's a state attribute).
    // The relevant rules for Radix checkbox a11y are `label` (accessible name)
    // and `aria-required-attr` (role=checkbox requires aria-checked).
    const results = await new AxeBuilder({ page })
      .withRules(["label", "aria-required-attr"])
      .analyze();
    const violations = results.violations.filter((v) =>
      ["label", "aria-required-attr"].includes(v.id)
    );
    expect(
      violations,
      `axe violations on selection checkboxes (DT-04):\n` +
        violations
          .map(
            (v) =>
              `  ${v.id}: ${v.description}\n` +
              v.nodes
                .slice(0, 3)
                .map((n) => `    ${n.html}`)
                .join("\n")
          )
          .join("\n")
    ).toHaveLength(0);
  });

  test("DT-05 color-contrast: all rendered text meets WCAG AA (light scheme)", async ({
    page,
  }) => {
    const results = await new AxeBuilder({ page })
      .withRules(["color-contrast"])
      .analyze();
    const violations = results.violations.filter(
      (v) => v.id === "color-contrast"
    );
    expect(
      violations,
      `color-contrast violations (DT-05):\n` +
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
});
