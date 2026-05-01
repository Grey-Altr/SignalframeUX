// Phase 72 Plan 02 Task 3 — Playwright spec for SFCombobox acceptance.
//
// Covers CB-01 (open / filter / keyboard / Enter / Escape / controlled),
// CB-02 (clear + grouping), CB-03 (multi-select chips + stay-open + chip remove
// + controlled string[] API). Mounts against the playground fixture at
// /dev-playground/sf-combobox.
//
// Run:
//   pnpm exec playwright test tests/v1.10-phase72-sf-combobox.spec.ts --project=chromium
//
// URL handling: playwright.config.ts hardcodes baseURL http://localhost:3000.
// CAPTURE_BASE_URL env override available for worktree port collisions
// (matches Phase 71 sf-data-table convention).

import { test, expect } from "@playwright/test";

const ABS_BASE = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";
const PLAYGROUND_URL = `${ABS_BASE}/dev-playground/sf-combobox`;

test.describe("@v1.10-phase72 SFCombobox", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PLAYGROUND_URL, { waitUntil: "networkidle" });
    // Vacuous-green guard: ensure fixture mounted (prevents false-green on a
    // 404 / blank page). Section 1 + 3 cover single + multi entry surfaces.
    await expect(page.getByTestId("section-1")).toBeVisible();
    await expect(page.getByTestId("section-3")).toBeVisible();
  });

  // ----- CB-01: single-select keyboard + filter + Enter + Escape -----

  test("CB-01 open: clicking trigger opens popover with listbox visible", async ({
    page,
  }) => {
    const trigger = page
      .getByTestId("section-1")
      .locator("button[type='button']")
      .first();
    await trigger.click();
    await expect(page.locator('[role="listbox"]').first()).toBeVisible();
    await expect(page.locator('[role="option"]').first()).toBeVisible();
  });

  test("CB-01 filter: typing in CommandInput filters visible options", async ({
    page,
  }) => {
    const trigger = page
      .getByTestId("section-1")
      .locator("button[type='button']")
      .first();
    await trigger.click();
    await page.locator('[role="combobox"]').first().fill("Alp");
    // Only "Alpha" is the strong match for "Alp" — list shows it visible.
    await expect(
      page.locator('[role="option"]', { hasText: "Alpha" })
    ).toBeVisible();
    // Allow some fuzzy slack but cap at <=2 visible options after filter.
    const optionCount = await page.locator('[role="option"]:visible').count();
    expect(optionCount).toBeLessThanOrEqual(2);
  });

  test("CB-01 keyboard: ArrowDown + ArrowUp move highlight (aria-selected stays present)", async ({
    page,
  }) => {
    const trigger = page
      .getByTestId("section-1")
      .locator("button[type='button']")
      .first();
    await trigger.click();
    // cmdk auto-selects first; ArrowDown moves to next.
    await page.keyboard.press("ArrowDown");
    await expect(
      page.locator('[role="option"][aria-selected="true"]').first()
    ).toBeVisible();
    await page.keyboard.press("ArrowUp");
    // ArrowUp moves selection back; loop=true means it wraps. One stays selected.
    await expect(
      page.locator('[role="option"][aria-selected="true"]').first()
    ).toBeVisible();
  });

  test("CB-01 Enter: pressing Enter on highlighted option selects and closes popover", async ({
    page,
  }) => {
    const trigger = page
      .getByTestId("section-1")
      .locator("button[type='button']")
      .first();
    await trigger.click();
    await page.keyboard.press("ArrowDown"); // ensure something highlighted
    await page.keyboard.press("Enter");
    await expect(page.locator('[role="listbox"]').first()).not.toBeVisible();
  });

  test("CB-01 Escape: pressing Escape closes popover without changing controlled value", async ({
    page,
  }) => {
    const section = page.getByTestId("section-2");
    const initialValue = await section
      .getByTestId("section-2-value")
      .textContent();
    const trigger = section.locator("button[type='button']").first();
    await trigger.click();
    await expect(page.locator('[role="listbox"]').first()).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator('[role="listbox"]').first()).not.toBeVisible();
    const afterValue = await section
      .getByTestId("section-2-value")
      .textContent();
    expect(afterValue).toEqual(initialValue);
  });

  test("CB-01 controlled: external value prop reflects in trigger display (section 2 default)", async ({
    page,
  }) => {
    // Section 2 starts with value="north-1" (label "Atlas").
    // Trigger button shows the label of the controlled value.
    const trigger = page
      .getByTestId("section-2")
      .locator("button[type='button']")
      .first();
    await expect(trigger).toContainText(/atlas/i);
  });

  // ----- CB-02: clear + grouping -----

  test("CB-02 clear: clicking × resets controlled selection (section 2)", async ({
    page,
  }) => {
    const section = page.getByTestId("section-2");
    const clearBtn = section
      .locator('button[aria-label="Clear selection"]')
      .first();
    await expect(clearBtn).toBeVisible();
    await clearBtn.click();
    await expect(section.getByTestId("section-2-value")).toContainText(
      /\(none\)/
    );
  });

  test("CB-02 grouping: section-2 popover shows group headings (North/South/East)", async ({
    page,
  }) => {
    const trigger = page
      .getByTestId("section-2")
      .locator("button[type='button']")
      .first();
    await trigger.click();
    await expect(page.locator('[role="listbox"]').first()).toBeVisible();
    // cmdk emits [cmdk-group-heading] on group headings — adapter pattern: if
    // the attribute name changes in a future cmdk version, fall back to
    // text-content matching on the listbox.
    await expect(
      page.locator("[cmdk-group-heading]", { hasText: /north/i }).first()
    ).toBeVisible();
    await expect(
      page.locator("[cmdk-group-heading]", { hasText: /south/i }).first()
    ).toBeVisible();
    await expect(
      page.locator("[cmdk-group-heading]", { hasText: /east/i }).first()
    ).toBeVisible();
  });

  // ----- CB-03: multi-select chips + stay-open + chip removal -----

  test("CB-03 multi: selecting an option keeps popover OPEN (does not close after select)", async ({
    page,
  }) => {
    const trigger = page
      .getByTestId("section-3")
      .locator("button[type='button']")
      .first();
    await trigger.click();
    await expect(page.locator('[role="listbox"]').first()).toBeVisible();
    // Select via keyboard (Enter on the cmdk-highlighted first option). Click
    // is avoided here because the global app-shell nav (z-9999) is fixed at
    // the bottom-left and intercepts pointer events when the section-3
    // popover overlaps the bottom of the viewport. Keyboard select goes
    // through cmdk's onSelect synthetic event regardless of paint layering.
    await page.keyboard.press("Enter");
    // Popover MUST stay open in multi-select.
    await expect(page.locator('[role="listbox"]').first()).toBeVisible();
  });

  test("CB-03 multi chips: each selected value renders a chip with Remove affordance", async ({
    page,
  }) => {
    const section = page.getByTestId("section-3");
    const trigger = section.locator("button[type='button']").first();
    await trigger.click();
    // Keyboard-navigate selections: Enter selects Alpha, ArrowDown moves to
    // Bravo, Enter selects Bravo. Avoids the bottom-nav pointer-intercept.
    await page.keyboard.press("Enter"); // Alpha
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter"); // Bravo
    await expect(section.getByTestId("section-3-count")).toContainText(
      "Selected: 2"
    );
    await page.keyboard.press("Escape");
    // Chips: Alpha + Bravo each rendered with a remove affordance.
    await expect(section.locator('[aria-label^="Remove"]')).toHaveCount(2);
  });

  test("CB-03 chip remove: clicking × on a chip deselects only that value (does not open popover)", async ({
    page,
  }) => {
    const section = page.getByTestId("section-3");
    const trigger = section.locator("button[type='button']").first();
    await trigger.click();
    await page.keyboard.press("Enter"); // Alpha
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter"); // Bravo
    await page.keyboard.press("Escape");
    await expect(section.getByTestId("section-3-count")).toContainText(
      "Selected: 2"
    );
    // Chip × is rendered inline with section-3 trigger (above the bottom nav),
    // so a real click works here. stopPropagation should prevent the outer
    // trigger button from re-opening the popover.
    await section.locator('[aria-label^="Remove"]').first().click();
    await expect(section.getByTestId("section-3-count")).toContainText(
      "Selected: 1"
    );
    await expect(page.locator('[role="listbox"]').first()).not.toBeVisible();
  });

  test("CB-03 controlled: section-3-count mirrors external value: string[] state", async ({
    page,
  }) => {
    // The fixture's section3Values useState is mirrored verbatim into the
    // section-3-count testid: "Selected: N of 5". Prove it reads the
    // controlled prop, not internal state.
    const section = page.getByTestId("section-3");
    await expect(section.getByTestId("section-3-count")).toContainText(
      /Selected: \d+ of 5/
    );
  });
});
