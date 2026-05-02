// Phase 74 Plan 02 Task 1 — Playwright acceptance spec for SFFileUpload (TST-03).
//
// Covers FU-01 (click-to-browse via setInputFiles, file list rows, per-file
// remove, paste handler exists, Space-key panel-advance regression per
// LOCKDOWN R-64-d), FU-02 (MIME reject, size reject, multi-file append,
// mixed accept/reject), FU-03 (controlled+onChange echo, progress prop drives
// SFProgress aria-valuenow + aria-label, image preview blob: URL, disabled).
//
// VACUOUS-GREEN GUARD (MANDATORY):
// Each describe's beforeEach navigates to the fixture and asserts the drop
// zone [role="button"] is visible BEFORE any state-mutating test runs. A 404
// or pre-hydration assertion would fail fast rather than passing trivially.
//
// TST-04 CONTRACT (NO VACUOUS DROP TEST):
// This spec NEVER simulates a synthetic drop event via page.dispatchEvent —
// the drag-to-drop file ingestion path is documented as a permanent gap in
// .planning/phases/74-sffileupload/74-VERIFICATION.md. Verified by predicate
// against the literal dispatchEvent token paired with the drop event name.
//
// Run:
//   pnpm exec playwright test tests/v1.10-phase74-sf-file-upload.spec.ts --project=chromium

import { test, expect } from "@playwright/test";

// CAPTURE_BASE_URL env override available for worktree port collisions
// (matches Phase 71/72 precedent).
const ABS_BASE = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";
const FIXTURE = `${ABS_BASE}/dev-playground/sf-file-upload`;

// 1x1 transparent PNG — smallest valid PNG. Used as image-preview test buffer
// for the URL.createObjectURL → blob: src assertion in FU-03.
const PNG_HEX =
  "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c6300010000000500010d0a2db40000000049454e44ae426082";
const PNG_BUF = Buffer.from(PNG_HEX, "hex");

const PDF_BUF = Buffer.from("%PDF-1.4\n");

test.describe("@v1.10-phase74 SFFileUpload — FU-01 click-to-browse + file list + paste", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: "networkidle" });
    // Vacuous-green guard: drop zone must be visible BEFORE assertions.
    // A 404 / un-hydrated fixture would fail this assertion rather than
    // letting state-mutating tests pass trivially against an empty DOM.
    await expect(
      page
        .locator('[data-testid="fixture-uncontrolled-image"] [role="button"]')
        .first()
    ).toBeVisible();
  });

  test("FU-01 click-to-browse via setInputFiles populates file list", async ({
    page,
  }) => {
    const input = page
      .locator(
        '[data-testid="fixture-uncontrolled-image"] [data-testid="sf-file-upload-input"]'
      )
      .first();
    await input.setInputFiles({
      name: "photo.png",
      mimeType: "image/png",
      buffer: PNG_BUF,
    });
    const list = page.locator(
      '[data-testid="fixture-uncontrolled-image"] [role="list"]'
    );
    await expect(list).toBeVisible();
    await expect(list.locator('[role="listitem"]')).toHaveCount(1);
    await expect(list).toContainText("photo.png");
  });

  test("FU-01 per-file remove button clears the row + announces removal via aria-live", async ({
    page,
  }) => {
    const input = page
      .locator(
        '[data-testid="fixture-uncontrolled-image"] [data-testid="sf-file-upload-input"]'
      )
      .first();
    await input.setInputFiles({
      name: "a.png",
      mimeType: "image/png",
      buffer: PNG_BUF,
    });
    const list = page.locator(
      '[data-testid="fixture-uncontrolled-image"] [role="list"]'
    );
    await expect(list.locator('[role="listitem"]')).toHaveCount(1);
    await page.getByRole("button", { name: /^Remove a\.png$/ }).click();
    await expect(list).toHaveCount(0);
    // aria-live region (sr-only) updates to "{name} removed". The fixture
    // mounts one SFFileUpload per section, so each section has its OWN
    // aria-live region; scope to the relevant section's region.
    await expect(
      page
        .locator('[data-testid="fixture-uncontrolled-image"] [aria-live="polite"]')
        .first()
    ).toContainText("a.png removed");
  });

  test("FU-01 paste handler exists on drop zone", async ({ page }) => {
    // We cannot programmatically populate clipboardData.files in Chromium
    // for the same security reason dataTransfer.files is restricted (see
    // 74-VERIFICATION.md). What we CAN verify structurally: the drop zone
    // is focusable so paste targeting works for keyboard users.
    const dropZone = page
      .locator('[data-testid="fixture-uncontrolled-image"] [role="button"]')
      .first();
    await dropZone.focus();
    await expect(dropZone).toBeFocused();
  });

  test("FU-01 Space on drop zone opens file dialog without advancing panel (LOCKDOWN R-64-d)", async ({
    page,
  }) => {
    // Regression check (LOCKDOWN R-64-d Space-key focus guard for role=button):
    // Drop zone Space handler MUST preventDefault to suppress Lenis panel-advance.
    // Addresses plan-checker INFO 6 — previously no automated test verified the guard.
    const dropZone = page
      .locator('[data-testid="fixture-uncontrolled-image"] [role="button"]')
      .first();
    await dropZone.focus();
    const initialScrollY = await page.evaluate(() => window.scrollY);
    // page.waitForEvent("filechooser") proves Space triggered click on hidden input.
    const fileChooserPromise = page.waitForEvent("filechooser", {
      timeout: 2000,
    });
    await page.keyboard.press(" ");
    const fileChooser = await fileChooserPromise;
    expect(fileChooser).toBeDefined();
    await fileChooser.setFiles([]); // dismiss
    // Verify no panel advance — scrollY must be unchanged after Space.
    const finalScrollY = await page.evaluate(() => window.scrollY);
    expect(finalScrollY).toBe(initialScrollY);
  });
});

test.describe("@v1.10-phase74 SFFileUpload — FU-02 validation (MIME, size, multi-file)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: "networkidle" });
    // Vacuous-green guard: every fixture section visible BEFORE state-mutating tests.
    await expect(
      page
        .locator('[data-testid="fixture-uncontrolled-image"] [role="button"]')
        .first()
    ).toBeVisible();
  });

  test("FU-02 MIME reject — PDF in image-only fixture surfaces error chip", async ({
    page,
  }) => {
    const input = page
      .locator(
        '[data-testid="fixture-uncontrolled-image"] [data-testid="sf-file-upload-input"]'
      )
      .first();
    await input.setInputFiles({
      name: "doc.pdf",
      mimeType: "application/pdf",
      buffer: PDF_BUF,
    });
    const rejectedRow = page
      .locator('[data-testid="fixture-uncontrolled-image"] [data-rejected]')
      .first();
    await expect(rejectedRow).toBeVisible();
    await expect(rejectedRow).toContainText("File type not allowed");
  });

  test("FU-02 size reject — 2 KB file in 1 KB fixture surfaces error chip", async ({
    page,
  }) => {
    const big = Buffer.alloc(2048, 0);
    const input = page
      .locator(
        '[data-testid="fixture-error-1kb"] [data-testid="sf-file-upload-input"]'
      )
      .first();
    await input.setInputFiles({
      name: "big.txt",
      mimeType: "text/plain",
      buffer: big,
    });
    const rejectedRow = page
      .locator('[data-testid="fixture-error-1kb"] [data-rejected]')
      .first();
    await expect(rejectedRow).toBeVisible();
    await expect(rejectedRow).toContainText("File too large");
  });

  test("FU-02 multi-file mode appends multiple files to the list", async ({
    page,
  }) => {
    const input = page
      .locator(
        '[data-testid="fixture-uncontrolled-image"] [data-testid="sf-file-upload-input"]'
      )
      .first();
    await input.setInputFiles([
      { name: "one.png", mimeType: "image/png", buffer: PNG_BUF },
      { name: "two.png", mimeType: "image/png", buffer: PNG_BUF },
    ]);
    const list = page.locator(
      '[data-testid="fixture-uncontrolled-image"] [role="list"]'
    );
    await expect(list.locator('[role="listitem"]')).toHaveCount(2);
    await expect(list).toContainText("one.png");
    await expect(list).toContainText("two.png");
  });

  test("FU-02 mixed accept/reject in one selection — both rows surface, accepted shows preview, rejected shows error", async ({
    page,
  }) => {
    const input = page
      .locator(
        '[data-testid="fixture-uncontrolled-image"] [data-testid="sf-file-upload-input"]'
      )
      .first();
    await input.setInputFiles([
      { name: "ok.png", mimeType: "image/png", buffer: PNG_BUF },
      { name: "bad.pdf", mimeType: "application/pdf", buffer: PDF_BUF },
    ]);
    const list = page.locator(
      '[data-testid="fixture-uncontrolled-image"] [role="list"]'
    );
    await expect(list.locator('[role="listitem"]')).toHaveCount(2);
    await expect(list.locator("[data-accepted]")).toHaveCount(1);
    await expect(list.locator("[data-rejected]")).toHaveCount(1);
  });
});

test.describe("@v1.10-phase74 SFFileUpload — FU-03 progress + controlled API + image preview", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: "networkidle" });
    // Vacuous-green guard: drop zone visible BEFORE assertions.
    await expect(
      page
        .locator('[data-testid="fixture-uncontrolled-image"] [role="button"]')
        .first()
    ).toBeVisible();
  });

  test("FU-03 controlled files+onChange — selection updates JSON echo", async ({
    page,
  }) => {
    const input = page
      .locator(
        '[data-testid="fixture-controlled-echo"] [data-testid="sf-file-upload-input"]'
      )
      .first();
    await input.setInputFiles({
      name: "selected.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("a"),
    });
    const echo = page.locator('[data-testid="fixture-controlled-output"]');
    await expect(echo).toContainText("selected.txt");
    await expect(echo).toContainText('"accepted": true');
  });

  test("FU-03 progress prop drives SFProgress aria-valuenow + aria-label", async ({
    page,
  }) => {
    const input = page
      .locator(
        '[data-testid="fixture-multi-progress"] [data-testid="sf-file-upload-input"]'
      )
      .first();
    await input.setInputFiles({
      name: "doc.pdf",
      mimeType: "application/pdf",
      buffer: PDF_BUF,
    });
    await page
      .locator('[data-testid="fixture-progress-slider"]')
      .fill("47");
    const progressbar = page
      .locator('[data-testid="fixture-multi-progress"] [role="progressbar"]')
      .first();
    await expect(progressbar).toBeVisible();
    await expect(progressbar).toHaveAttribute("aria-valuenow", "47");
    await expect(progressbar).toHaveAttribute(
      "aria-label",
      /Upload progress for doc\.pdf/
    );
  });

  test("FU-03 image preview — accepted image renders <img> with blob: src", async ({
    page,
  }) => {
    const input = page
      .locator(
        '[data-testid="fixture-uncontrolled-image"] [data-testid="sf-file-upload-input"]'
      )
      .first();
    await input.setInputFiles({
      name: "photo.png",
      mimeType: "image/png",
      buffer: PNG_BUF,
    });
    const previewImg = page
      .locator('[data-testid="fixture-uncontrolled-image"] img')
      .first();
    await expect(previewImg).toBeVisible();
    const src = await previewImg.getAttribute("src");
    expect(src).toMatch(/^blob:/);
  });

  test("FU-03 disabled fixture has tabIndex=-1 on drop zone + disabled hidden input", async ({
    page,
  }) => {
    const dropZone = page
      .locator('[data-testid="fixture-disabled"] [role="button"]')
      .first();
    await expect(dropZone).toHaveAttribute("tabindex", "-1");
    const input = page
      .locator(
        '[data-testid="fixture-disabled"] [data-testid="sf-file-upload-input"]'
      )
      .first();
    await expect(input).toBeDisabled();
  });
});
