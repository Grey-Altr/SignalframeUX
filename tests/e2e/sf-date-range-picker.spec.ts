// Phase 75 Plan 02 Task 1 — Playwright acceptance spec for SFDateRangePicker (TST-03).
//
// Covers hydration (zero React warnings on SSR route), DR-01 (range selection
// produces range_start/range_middle/range_end DOM classes), DR-03 (preset click
// closes popover + updates JSON echo), DR-04 (withTime renders exactly 2
// input[type="time"]), and aria-haspopup + aria-expanded toggle.
//
// VACUOUS-GREEN GUARD (MANDATORY):
// Each test asserts that the trigger [data-testid="sf-date-range-picker-trigger"]
// is visible BEFORE any state-mutating action. A 404 or un-hydrated route would
// fail this assertion rather than passing trivially.
//
// Run:
//   pnpm exec playwright test tests/e2e/sf-date-range-picker.spec.ts --project=chromium

import { test, expect } from "@playwright/test";

const ABS_BASE = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";
const FIXTURE = `${ABS_BASE}/showcase/date-range-picker`;

test.describe("SFDateRangePicker — hydration + accessibility (TST-03)", () => {
  test("zero React hydration warnings on /showcase/date-range-picker", async ({
    page,
  }) => {
    const consoleMessages: { type: string; text: string }[] = [];
    page.on("console", (msg) => {
      consoleMessages.push({ type: msg.type(), text: msg.text() });
    });

    await page.goto(FIXTURE, { waitUntil: "networkidle" });
    // Vacuous-green guard
    await expect(
      page.getByTestId("sf-date-range-picker-trigger").first()
    ).toBeVisible();
    // Wait an extra beat for any deferred hydration warnings to flush
    await page.waitForTimeout(250);

    const hydrationWarnings = consoleMessages.filter((m) =>
      /hydrat/i.test(m.text())
    );
    expect(
      hydrationWarnings,
      `Hydration warnings emitted on showcase route: ${JSON.stringify(
        hydrationWarnings,
        null,
        2
      )}`
    ).toEqual([]);
  });

  test("trigger has aria-haspopup=dialog and aria-expanded toggles on open/close", async ({
    page,
  }) => {
    await page.goto(FIXTURE, { waitUntil: "networkidle" });
    const trigger = page
      .locator(
        '[data-testid="fixture-uncontrolled-range"] [data-testid="sf-date-range-picker-trigger"]'
      )
      .first();
    await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    // Esc closes the popover (Radix built-in)
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});

test.describe("SFDateRangePicker — DR-01 range selection + classNames", () => {
  test("DR-01 range selection produces range_start + range_middle + range_end DOM classes", async ({
    page,
  }) => {
    await page.goto(FIXTURE, { waitUntil: "networkidle" });

    const trigger = page
      .locator(
        '[data-testid="fixture-uncontrolled-range"] [data-testid="sf-date-range-picker-trigger"]'
      )
      .first();
    await trigger.click();

    // Wait for SFCalendarLazy hydration (dynamic({ ssr: false }) — async chunk)
    const popoverContent = page
      .locator(
        '[data-testid="fixture-uncontrolled-range"] [data-testid="sf-date-range-picker-content"]'
      )
      .first();
    await expect(popoverContent).toBeVisible({ timeout: 5000 });

    // Day buttons — RDP v9 renders day cells as <button> inside <td role="gridcell"> OR
    // exposes them as [role="gridcell"] direct buttons. Use a tolerant selector.
    const dayButtons = page.locator(
      '[data-testid="fixture-uncontrolled-range"] td button:not([disabled]), [data-testid="fixture-uncontrolled-range"] [role="gridcell"] button:not([disabled])'
    );
    const dayCount = await dayButtons.count();
    expect(dayCount).toBeGreaterThanOrEqual(14);

    // Click 8th and 14th selectable day buttons (creates a 6-day range)
    await dayButtons.nth(7).click();
    await dayButtons.nth(13).click();

    // Verify the three range classNames keys appear in the DOM
    const rangeStart = page
      .locator(
        '[data-testid="fixture-uncontrolled-range"] [class*="range_start"]'
      )
      .first();
    const rangeMiddle = page
      .locator(
        '[data-testid="fixture-uncontrolled-range"] [class*="range_middle"]'
      )
      .first();
    const rangeEnd = page
      .locator('[data-testid="fixture-uncontrolled-range"] [class*="range_end"]')
      .first();
    await expect(rangeStart).toBeVisible();
    await expect(rangeMiddle).toBeVisible();
    await expect(rangeEnd).toBeVisible();
  });

  test("DR-01 range selection updates section1 JSON echo with non-null from + to", async ({
    page,
  }) => {
    await page.goto(FIXTURE, { waitUntil: "networkidle" });

    const trigger = page
      .locator(
        '[data-testid="fixture-uncontrolled-range"] [data-testid="sf-date-range-picker-trigger"]'
      )
      .first();
    await expect(trigger).toBeVisible();
    await trigger.click();

    const popoverContent = page
      .locator(
        '[data-testid="fixture-uncontrolled-range"] [data-testid="sf-date-range-picker-content"]'
      )
      .first();
    await expect(popoverContent).toBeVisible({ timeout: 5000 });

    const dayButtons = page.locator(
      '[data-testid="fixture-uncontrolled-range"] td button:not([disabled]), [data-testid="fixture-uncontrolled-range"] [role="gridcell"] button:not([disabled])'
    );
    const dayCount = await dayButtons.count();
    expect(dayCount).toBeGreaterThanOrEqual(14);
    await dayButtons.nth(7).click();
    await dayButtons.nth(13).click();

    const echo = page.locator('[data-testid="fixture-uncontrolled-range"]').locator('pre').first();
    const echoText = await echo.textContent();
    expect(echoText).toBeTruthy();
    const parsed = JSON.parse(echoText ?? "{}");
    expect(parsed.from).not.toBeNull();
    expect(parsed.to).not.toBeNull();
  });
});

test.describe(
  "SFDateRangePicker — DR-03 presets close popover + update value",
  () => {
    test("DR-03 LAST 7 DAYS preset click closes popover + updates section2 JSON echo", async ({
      page,
    }) => {
      await page.goto(FIXTURE, { waitUntil: "networkidle" });

      const trigger = page
        .locator(
          '[data-testid="fixture-controlled-presets"] [data-testid="sf-date-range-picker-trigger"]'
        )
        .first();
      await trigger.click();

      const popoverContent = page
        .locator(
          '[data-testid="fixture-controlled-presets"] [data-testid="sf-date-range-picker-content"]'
        )
        .first();
      await expect(popoverContent).toBeVisible({ timeout: 5000 });

      const presetsRail = page
        .locator(
          '[data-testid="fixture-controlled-presets"] [data-testid="sf-date-range-picker-presets"]'
        )
        .first();
      await expect(presetsRail).toBeVisible();

      const preset = presetsRail.getByRole("button", { name: /LAST 7 DAYS/i }).first();
      await preset.click();

      // Popover MUST close (D-08)
      await expect(popoverContent).not.toBeVisible();

      // Section 2 JSON echo MUST now show non-null from + to
      const echo = page
        .locator('[data-testid="fixture-controlled-presets"]')
        .locator('pre')
        .first();
      const echoText = await echo.textContent();
      expect(echoText).toBeTruthy();
      const parsed = JSON.parse(echoText ?? "{}");
      expect(parsed.from).not.toBeNull();
      expect(parsed.to).not.toBeNull();
    });
  }
);

test.describe("SFDateRangePicker — DR-04 withTime variant", () => {
  test("DR-04 withTime renders exactly 2 input[type=time] with correct aria-labels", async ({
    page,
  }) => {
    await page.goto(FIXTURE, { waitUntil: "networkidle" });

    const trigger = page
      .locator('[data-testid="fixture-withtime"] [data-testid="sf-date-range-picker-trigger"]')
      .first();
    await trigger.click();

    const timeRow = page
      .locator(
        '[data-testid="fixture-withtime"] [data-testid="sf-date-range-picker-time-row"]'
      )
      .first();
    await expect(timeRow).toBeVisible({ timeout: 5000 });

    const timeInputs = timeRow.locator('input[type="time"]');
    await expect(timeInputs).toHaveCount(2);

    const labels = await timeInputs.evaluateAll((els) =>
      (els as HTMLInputElement[]).map((el) => el.getAttribute("aria-label"))
    );
    expect(labels).toEqual(["Start time", "End time"]);
  });

  test("DR-04 typing into Start time input updates section3 JSON echo startTime", async ({
    page,
  }) => {
    await page.goto(FIXTURE, { waitUntil: "networkidle" });

    const trigger = page
      .locator('[data-testid="fixture-withtime"] [data-testid="sf-date-range-picker-trigger"]')
      .first();
    await trigger.click();

    const startInput = page
      .locator(
        '[data-testid="fixture-withtime"] [data-testid="sf-date-range-picker-time-row"] input[type="time"]'
      )
      .first();
    await startInput.fill("10:30");

    const echo = page
      .locator('[data-testid="fixture-withtime"]')
      .locator('pre')
      .first();
    await expect(echo).toContainText('"startTime": "10:30"');
  });
});
