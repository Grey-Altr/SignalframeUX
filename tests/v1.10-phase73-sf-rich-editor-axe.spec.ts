// Phase 73 Plan 03 Task 2 — Direct @axe-core/playwright per-fixture-state gates
// for SFRichEditor (TST-03 axe scope).
//
// Mirrors the per-rule sharp-scan precedent at
// tests/v1.10-phase71-sf-data-table-axe.spec.ts and
// tests/v1.10-phase72-sf-combobox-axe.spec.ts. Five tests cover:
//   - empty editor: zero axe violations on toolbar + contenteditable surface
//   - editor with rich content + bold active: zero axe violations on isActive button states
//   - read-only editor: zero axe violations (toolbar absent — no missing button-name)
//   - structural ARIA: role=toolbar with >=13 aria-labelled buttons
//   - structural region landmark: section[aria-label="Rich text editor"]
//
// VACUOUS-GREEN GUARD (MANDATORY):
// Each test that calls axe.analyze() FIRST asserts
// [contenteditable="true"] (or, for read-only, [contenteditable])
// is visible with timeout: 10000. This prevents the axe scan from running
// against the SFSkeleton loading state — without the guard, axe sees no
// toolbar (skeleton has none) and reports zero violations trivially. With
// the guard, axe scans the real ProseMirror surface + 13-button toolbar.
//
// Run:
//   pnpm exec playwright test tests/v1.10-phase73-sf-rich-editor-axe.spec.ts --project=chromium

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const FIXTURE = "/dev-playground/sf-rich-editor";

test.describe("@v1.10-phase73 SFRichEditor — axe WCAG AA (TST-03)", () => {
  test("empty editor: zero axe violations (toolbar + contenteditable mounted)", async ({
    page,
  }) => {
    await page.goto(FIXTURE);

    // Vacuous-green guard — MANDATORY before axe.analyze().
    await expect(
      page.locator('[data-testid="fixture-uncontrolled-empty"] [contenteditable="true"]')
    ).toBeVisible({ timeout: 10000 });

    // Scan only the empty-editor fixture section to isolate from other sections.
    const results = await new AxeBuilder({ page })
      .include('[data-testid="fixture-uncontrolled-empty"]')
      .analyze();

    expect(
      results.violations,
      `axe violations on empty editor:\n` +
        results.violations
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

  test("editor with rich content: zero axe violations (isActive button states)", async ({
    page,
  }) => {
    await page.goto(FIXTURE);

    // Vacuous-green guard.
    await expect(
      page.locator('[data-testid="fixture-controlled"] [contenteditable="true"]')
    ).toBeVisible({ timeout: 10000 });

    // Click Bold in the controlled fixture to trigger the isActive button state
    // (data-active + aria-pressed=true). axe must scan these states without
    // tripping aria-allowed-attr / aria-valid-attr-value rules.
    await page
      .locator('[data-testid="fixture-controlled"] [contenteditable="true"]')
      .click();
    await page.keyboard.press("Control+a");
    await page
      .locator('[data-testid="fixture-controlled"] [role="toolbar"]')
      .getByRole("button", { name: "Bold" })
      .click();

    // Scope axe to the controlled section so chip/popover noise from other
    // sections doesn't leak into this scan.
    const results = await new AxeBuilder({ page })
      .include('[data-testid="fixture-controlled"]')
      .analyze();

    expect(
      results.violations,
      `axe violations on rich-content editor (bold active):\n` +
        results.violations
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

  test("read-only editor: zero axe violations (toolbar absent — no missing button-name)", async ({
    page,
  }) => {
    await page.goto(FIXTURE);

    // Vacuous-green guard: read-only section uses contenteditable="false"
    // but the element must still be present + visible in DOM.
    await expect(
      page.locator('[data-testid="fixture-readonly"] [contenteditable]')
    ).toBeVisible({ timeout: 10000 });

    const results = await new AxeBuilder({ page })
      .include('[data-testid="fixture-readonly"]')
      .analyze();

    expect(
      results.violations,
      `axe violations on read-only editor:\n` +
        results.violations
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

  // Structural assertion: role=toolbar present with >=13 aria-labelled buttons
  // (belt-and-suspenders — axe button-name rule covers this, but the count
  // assertion verifies the toolbar is fully populated, not silently missing
  // a button due to a future regression).
  test("toolbar role and aria-label coverage in editable editor", async ({ page }) => {
    await page.goto(FIXTURE);
    await expect(
      page.locator('[data-testid="fixture-uncontrolled-empty"] [contenteditable="true"]')
    ).toBeVisible({ timeout: 10000 });

    await expect(
      page.locator('[data-testid="fixture-uncontrolled-empty"] [role="toolbar"]')
    ).toBeVisible();

    const buttonCount = await page
      .locator('[data-testid="fixture-uncontrolled-empty"] [role="toolbar"] button[aria-label]')
      .count();
    expect(buttonCount).toBeGreaterThanOrEqual(13);
  });

  // Structural assertion: editor wraps in <section aria-label="Rich text editor">
  // — landmark region required for axe `region` rule to pass on the
  // contenteditable surface (per RESEARCH §axe-core Focus Management 685).
  test("editor content area is inside a region landmark (section with aria-label)", async ({
    page,
  }) => {
    await page.goto(FIXTURE);
    await expect(
      page.locator('[data-testid="fixture-uncontrolled-empty"] [contenteditable="true"]')
    ).toBeVisible({ timeout: 10000 });

    await expect(
      page.locator(
        '[data-testid="fixture-uncontrolled-empty"] section[aria-label="Rich text editor"]'
      )
    ).toBeVisible();
  });
});
