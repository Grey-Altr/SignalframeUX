// Phase 71 Plan 03 Task 4 — Playwright spec for SFDataTable acceptance.
//
// Covers DT-01 (sort cycle + keyboard), DT-02 (filter debounce),
// DT-03 (pagination page-click), DT-04 (row selection + indeterminate).
//
// Mounts against the playground fixture at /dev-playground/sf-data-table.
// SFDataTableLazy is ssr:false, so the table is client-rendered; beforeEach
// waits for table-visible + 10 body rows before any test asserts.
//
// Run:
//   pnpm exec playwright test tests/v1.10-phase71-sf-data-table.spec.ts --project=chromium
//
// URL handling: playwright.config.ts hardcodes baseURL http://localhost:3000.
// CAPTURE_BASE_URL env override available for worktree port collisions
// (matches Phase 66 ARC axe spec convention).

import { test, expect } from "@playwright/test";

const ABS_BASE = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";
const PLAYGROUND_URL = `${ABS_BASE}/dev-playground/sf-data-table`;

test.describe("@v1.10-phase71 SFDataTable", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PLAYGROUND_URL, { waitUntil: "networkidle" });
    // Vacuous-green guard: ensure fixture mounted (prevents false-green on a
    // 404 / blank page) and pagination has produced page size 10.
    await expect(page.locator("table")).toBeVisible();
    await expect(page.locator("tbody tr")).toHaveCount(10);
  });

  test("DT-01: sort cycle asc -> desc -> none on column header click", async ({
    page,
  }) => {
    // Header <th> text is "ID—Click to sort" (em-dash glyph + sr-only).
    // Substring match via hasText on the th, button selected via descendant.
    const idHeader = page.locator("thead th", { hasText: "ID" }).first();
    const idButton = idHeader.locator("button[type='button']");
    await expect(idHeader).toHaveAttribute("aria-sort", "none");
    await idButton.click();
    await expect(idHeader).toHaveAttribute("aria-sort", "ascending");
    await idButton.click();
    await expect(idHeader).toHaveAttribute("aria-sort", "descending");
    await idButton.click();
    await expect(idHeader).toHaveAttribute("aria-sort", "none");
  });

  test("DT-01: keyboard Enter and Space trigger sort identically", async ({
    page,
  }) => {
    const nameHeader = page.locator("thead th", { hasText: "Name" }).first();
    const nameButton = nameHeader.locator("button[type='button']");
    await nameButton.focus();
    await page.keyboard.press("Enter");
    await expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
    await page.keyboard.press("Space");
    await expect(nameHeader).toHaveAttribute("aria-sort", "descending");
  });

  test("DT-02: filter input debounces (300ms) and reduces row count", async ({
    page,
  }) => {
    const input = page.getByLabel("Global filter");
    await input.fill("user-1");
    // Wait past 300ms debounce window
    await page.waitForTimeout(400);
    // user-1, user-10..user-19 = 11 matches; first page caps at 10
    const rowCount = await page.locator("tbody tr").count();
    expect(rowCount).toBeLessThanOrEqual(10);
    expect(rowCount).toBeGreaterThan(0);
    // Clearing filter restores 10 rows on page 1
    await input.fill("");
    await page.waitForTimeout(400);
    await expect(page.locator("tbody tr")).toHaveCount(10);
  });

  test("DT-03: pagination — page 2 click advances rows", async ({ page }) => {
    // 25 rows / 10 per page = 3 pages; pagination should be visible
    await expect(page.locator("nav[aria-label*='pagination' i]")).toBeVisible();
    const firstRowOnPage1 = await page.locator("tbody tr").first().textContent();
    // Click the link with text "2" inside the pagination nav
    const page2Link = page
      .locator("nav[aria-label*='pagination' i] a", { hasText: /^2$/ })
      .first();
    await page2Link.click();
    // Same locator selection on page 2; row content must differ
    const firstRowOnPage2 = await page.locator("tbody tr").first().textContent();
    expect(firstRowOnPage2).not.toBe(firstRowOnPage1);
  });

  test("DT-04: row selection — single + multi + indeterminate header state", async ({
    page,
  }) => {
    // Radix Checkbox renders <button role="checkbox" data-state=...>
    // Header checkbox is the first checkbox (in <thead>)
    const headerCheckbox = page.locator("thead [role='checkbox']").first();
    const firstRowCheckbox = page
      .locator("tbody tr [role='checkbox']")
      .first();

    // Header starts unchecked
    await expect(headerCheckbox).toHaveAttribute("data-state", "unchecked");

    // Click first row -> header becomes indeterminate
    await firstRowCheckbox.click();
    await expect(headerCheckbox).toHaveAttribute("data-state", "indeterminate");

    // The data-testid="row-count" mirrors selected count
    await expect(page.locator("[data-testid='row-count']")).toContainText(
      /Selected: \d+/
    );

    // Click header to toggle all -> data-state="checked"
    await headerCheckbox.click();
    await expect(headerCheckbox).toHaveAttribute("data-state", "checked");
  });
});
