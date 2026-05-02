// Phase 73 Plan 03 Task 1 — Playwright acceptance spec for SFRichEditor (TST-03).
//
// Covers RE-01 (toolbar buttons + active state), RE-02 (link prompt + code),
// RE-03 (controlled API + readOnly + defaultValue), and keyboard nav (Escape
// focus-return) against the dev-playground fixture at /dev-playground/sf-rich-editor.
//
// Vacuous-green guard: every test waits on [contenteditable="true"] becoming
// visible BEFORE asserting toolbar/editor state — without this, ProseMirror's
// hydration race could let a test pass against the SFSkeleton loading state.
//
// Run:
//   pnpm exec playwright test tests/v1.10-phase73-sf-rich-editor.spec.ts --project=chromium

import { test, expect } from "@playwright/test";

const FIXTURE = "/dev-playground/sf-rich-editor";

test.describe("@v1.10-phase73 SFRichEditor — acceptance (RE-01/02/03)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(FIXTURE);
    // Vacuous-green guard: wait for ProseMirror hydration before any assertion.
    // SFRichEditorLazy renders an SFSkeleton until next/dynamic resolves the
    // chunk + Tiptap mounts the contenteditable surface; without this gate, a
    // toolbar/editor assertion could trivially "pass" against the skeleton.
    await page.waitForSelector('[contenteditable="true"]', {
      state: "visible",
      timeout: 10000,
    });
  });

  // RE-03: controlled value initializes editor content
  test("controlled fixture renders initial HTML content", async ({ page }) => {
    const content = await page
      .locator('[data-testid="fixture-controlled"] [contenteditable="true"]')
      .innerText();
    expect(content).toContain("Hello");
    expect(content).toContain("world");
  });

  // RE-03: onChange fires and updates controlled output pre
  test("controlled onChange updates output pre on edit", async ({ page }) => {
    const editor = page.locator(
      '[data-testid="fixture-controlled"] [contenteditable="true"]'
    );
    await editor.click();
    await page.keyboard.press("Control+a");
    await page.keyboard.type("Changed content via keyboard");
    await expect(
      page.locator('[data-testid="fixture-controlled-output"]')
    ).toContainText("Changed content via keyboard");
  });

  // RE-03: readOnly — toolbar absent from DOM (not just hidden)
  test("readOnly removes toolbar from DOM", async ({ page }) => {
    const toolbarCount = await page
      .locator('[data-testid="fixture-readonly"] [role="toolbar"]')
      .count();
    expect(toolbarCount).toBe(0);
  });

  // RE-03: readOnly — contenteditable is false
  test("readOnly sets contenteditable=false", async ({ page }) => {
    await expect(
      page.locator('[data-testid="fixture-readonly"] [contenteditable]')
    ).toHaveAttribute("contenteditable", "false");
  });

  // RE-03: defaultValue initializes content in uncontrolled mode
  test("defaultValue fixture shows initial content", async ({ page }) => {
    const content = await page
      .locator(
        '[data-testid="fixture-default-value"] [contenteditable="true"]'
      )
      .innerText();
    expect(content).toContain("Initial content");
  });

  // RE-01: toolbar role and aria-label present in non-readOnly editor
  test("toolbar has role=toolbar and aria-label", async ({ page }) => {
    await expect(
      page.locator('[data-testid="fixture-uncontrolled-empty"] [role="toolbar"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="fixture-uncontrolled-empty"] [role="toolbar"]')
    ).toHaveAttribute("aria-label", "Text formatting");
  });

  // RE-01 + RE-02: all 13 toolbar buttons present and accessible
  test("all RE-01 and RE-02 toolbar buttons are present and accessible", async ({
    page,
  }) => {
    const expectedLabels = [
      "Bold",
      "Italic",
      "Underline",
      "Strikethrough",
      "Inline code",
      "Heading 1",
      "Heading 2",
      "Heading 3",
      "Bullet list",
      "Ordered list",
      "Blockquote",
      "Code block",
      "Link",
    ];
    for (const label of expectedLabels) {
      await expect(
        page.getByRole("button", { name: label }).first()
      ).toBeVisible();
    }
  });

  // RE-01: Bold button sets data-active when bold is active
  // (This was the test that exposed the Tiptap v3 shouldRerenderOnTransaction
  // default flip — Plan 02 gap-closure at commit 65a2002 fixed it.)
  test("Bold button sets data-active when bold is active", async ({ page }) => {
    const editor = page.locator(
      '[data-testid="fixture-uncontrolled-empty"] [contenteditable="true"]'
    );
    await editor.click();
    await page.keyboard.type("bold test");
    await page.keyboard.press("Control+a");
    const boldButton = page
      .locator('[data-testid="fixture-uncontrolled-empty"] [role="toolbar"]')
      .getByRole("button", { name: "Bold" });
    await boldButton.click();
    // data-active attribute MUST be present after click — set by editor.isActive("bold")
    // truthiness gating in sf-rich-editor.tsx. Stale isActive reads (Tiptap v3
    // shouldRerenderOnTransaction default false) would prevent this assertion
    // from firing. shouldRerenderOnTransaction:true at sf-rich-editor.tsx:141 fixes it.
    await expect(boldButton).toHaveAttribute("data-active");
  });

  // RE-02: Link button opens native window.prompt dialog
  test("Link button opens window.prompt dialog", async ({ page }) => {
    const editor = page.locator(
      '[data-testid="fixture-uncontrolled-empty"] [contenteditable="true"]'
    );
    await editor.click();
    await page.keyboard.type("link text");
    await page.keyboard.press("Control+a");

    // Attach the dialog handler BEFORE the click — window.prompt is modal and
    // blocks the click promise until the dialog is dismissed. page.once
    // synchronously captures the dialog type for post-click assertion and
    // dismisses the prompt so .click() can resolve.
    let capturedDialogType: string | null = null;
    page.once("dialog", (dialog) => {
      capturedDialogType = dialog.type();
      void dialog.dismiss();
    });

    await page
      .locator('[data-testid="fixture-uncontrolled-empty"] [role="toolbar"]')
      .getByRole("button", { name: "Link" })
      .click();

    expect(capturedDialogType).toBe("prompt");
  });

  // RE-03: Escape from contenteditable returns focus to first toolbar button
  test("Escape from contenteditable returns focus to first toolbar button", async ({
    page,
  }) => {
    const editor = page.locator(
      '[data-testid="fixture-uncontrolled-empty"] [contenteditable="true"]'
    );
    await editor.click();
    await page.keyboard.press("Escape");
    // After Escape, the focused element should have aria-label "Bold" (first toolbar button)
    const focusedLabel = await page.evaluate(() =>
      document.activeElement?.getAttribute("aria-label")
    );
    expect(focusedLabel).toBe("Bold");
  });
});
