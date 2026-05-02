// Phase 75 Plan 02 Task 2 — axe-core WCAG AA spec for SFDateRangePicker (TST-03).
//
// Scans the showcase fixture in 3 distinct states and asserts zero violations
// across: closed-trigger state, open-popover-with-presets state, and
// open-popover-with-withtime state. Rule set:
// [button-name, label, dialog-name, color-contrast, region, aria-valid-attr-value]
//
// VACUOUS-GREEN GUARD (MANDATORY):
// Each test asserts that the trigger or popover content is visible BEFORE
// calling analyze(). A 404 or un-hydrated fixture would fail this assertion
// rather than passing trivially against an empty DOM.
//
// Run:
//   pnpm exec playwright test tests/e2e/sf-date-range-picker-axe.spec.ts --project=chromium

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ABS_BASE = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";
const FIXTURE = `${ABS_BASE}/showcase/date-range-picker`;

const AXE_RULES = [
  "button-name",
  "label",
  "dialog-name",
  "color-contrast",
  "region",
  "aria-valid-attr-value",
];

test.describe("SFDateRangePicker — TST-03 axe-core WCAG AA", () => {
  test("axe — closed trigger state", async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: "networkidle" });
    // VACUOUS-GREEN GUARD: trigger must be visible BEFORE analyze()
    await expect(
      page.getByTestId("sf-date-range-picker-trigger").first()
    ).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withRules(AXE_RULES)
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test("axe — open popover with presets state", async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: "networkidle" });
    const trigger = page
      .locator(
        '[data-testid="fixture-controlled-presets"] [data-testid="sf-date-range-picker-trigger"]'
      )
      .first();
    await trigger.click();
    // VACUOUS-GREEN GUARD: popover content + presets rail must be visible BEFORE analyze()
    await expect(
      page
        .locator(
          '[data-testid="fixture-controlled-presets"] [data-testid="sf-date-range-picker-content"]'
        )
        .first()
    ).toBeVisible({ timeout: 5000 });
    await expect(
      page
        .locator(
          '[data-testid="fixture-controlled-presets"] [data-testid="sf-date-range-picker-presets"]'
        )
        .first()
    ).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withRules(AXE_RULES)
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test("axe — open popover with withTime state", async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: "networkidle" });
    const trigger = page
      .locator('[data-testid="fixture-withtime"] [data-testid="sf-date-range-picker-trigger"]')
      .first();
    await trigger.click();
    // VACUOUS-GREEN GUARD: popover content + time row must be visible BEFORE analyze()
    await expect(
      page
        .locator(
          '[data-testid="fixture-withtime"] [data-testid="sf-date-range-picker-content"]'
        )
        .first()
    ).toBeVisible({ timeout: 5000 });
    await expect(
      page
        .locator(
          '[data-testid="fixture-withtime"] [data-testid="sf-date-range-picker-time-row"]'
        )
        .first()
    ).toBeVisible();
    // Confirm exactly 2 time inputs are in DOM (axe label rule covers them)
    await expect(
      page
        .locator(
          '[data-testid="fixture-withtime"] [data-testid="sf-date-range-picker-time-row"] input[type="time"]'
        )
    ).toHaveCount(2);
    const results = await new AxeBuilder({ page })
      .withRules(AXE_RULES)
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
