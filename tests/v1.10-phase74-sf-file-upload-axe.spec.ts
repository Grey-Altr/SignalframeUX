// Phase 74 Plan 02 Task 2 — axe-core WCAG AA spec for SFFileUpload (TST-03).
//
// Mirrors the per-rule sharp-scan precedent at
// tests/v1.10-phase71-sf-data-table-axe.spec.ts and
// tests/v1.10-phase72-sf-combobox-axe.spec.ts and
// tests/v1.10-phase73-sf-rich-editor-axe.spec.ts. Six tests cover:
//   - empty state: drop zone + hidden input mounted, no files
//   - with-files: multi-file fixture seeded, accepted state with image preview
//   - with-progress: progress slider at 50%, SFProgress visible
//   - with-error: 1 KB fixture seeded with 2 KB file, error chip surfaces
//   - disabled: drop zone tabindex=-1, hidden input disabled
//   - structural: aria-live region present in every fixture section
//
// VACUOUS-GREEN GUARD (MANDATORY):
// Each test that calls axe.analyze() FIRST asserts
// [role="button"][aria-label] is visible (the drop zone wrapper). This
// prevents axe from running against a 404 / un-hydrated DOM and reporting
// zero violations trivially. With the guard, axe scans the real drop zone +
// file list + progress bar + error state.
//
// Run:
//   pnpm exec playwright test tests/v1.10-phase74-sf-file-upload-axe.spec.ts --project=chromium

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ABS_BASE = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";
const FIXTURE = `${ABS_BASE}/dev-playground/sf-file-upload`;

// 1x1 transparent PNG — smallest valid PNG.
const PNG_BUF = Buffer.from(
  "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c6300010000000500010d0a2db40000000049454e44ae426082",
  "hex"
);

// axe-core rule set targeted by Phase 74:
//   - button-name: drop zone role=button + per-file × remove buttons MUST have accessible names
//   - aria-progressbar-name: SFProgress per-file MUST have aria-label "Upload progress for {file.name}"
//     (canonical axe-core rule ID — `progressbar` was the plan's prose shorthand and is NOT a real
//      axe rule; corrected at execute-time per axe-core 4.11.2 rule registry)
//   - aria-valid-attr-value: aria-valuenow / aria-valuemin / aria-valuemax / aria-disabled / aria-live values MUST be valid
//   - color-contrast: drop zone foreground/background, file list text, error text, progress bar fill MUST meet WCAG AA 4.5:1
//   - region: scoped to playground <main> landmark — sf-file-upload is content within
const AXE_RULES = [
  "button-name",
  "aria-progressbar-name",
  "aria-valid-attr-value",
  "color-contrast",
  "region",
];

test.describe("@v1.10-phase74 SFFileUpload — TST-03 axe-core WCAG AA", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: "networkidle" });
    // VACUOUS-GREEN GUARD: drop zone must be present + labeled BEFORE analyze().
    // Without this, a 404 / un-hydrated fixture page would yield zero violations
    // trivially because no SFFileUpload DOM exists to scan.
    const dropZone = page.locator('[role="button"][aria-label]').first();
    await expect(dropZone).toBeVisible();
  });

  test("axe — empty state (drop zone + hidden input, no files selected)", async ({
    page,
  }) => {
    const results = await new AxeBuilder({ page })
      // Scope axe scan to the playground <main> landmark — excludes the global
      // SIGNAL <canvas> page chrome which sits at body[z-index:-1] outside any
      // landmark and would trip the `region` rule. The canvas is documented as
      // a system-wide pre-existing finding (decorative, role=img, aria-label
      // present); not in Plan 74 scope.
      .include('main[data-testid="sf-file-upload-playground"]')
      .withRules(AXE_RULES)
      .analyze();
    expect(
      results.violations,
      `axe violations on empty state:\n` +
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
    ).toEqual([]);
  });

  test("axe — with files (multi-file fixture seeded, accepted state with image preview)", async ({
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
    // Confirm seeded state mounted before scan.
    await expect(
      page.locator('[data-testid="fixture-uncontrolled-image"] [role="list"]')
    ).toBeVisible();
    const results = await new AxeBuilder({ page })
      // Scope axe scan to the playground <main> landmark — excludes the global
      // SIGNAL <canvas> page chrome which sits at body[z-index:-1] outside any
      // landmark and would trip the `region` rule. The canvas is documented as
      // a system-wide pre-existing finding (decorative, role=img, aria-label
      // present); not in Plan 74 scope.
      .include('main[data-testid="sf-file-upload-playground"]')
      .withRules(AXE_RULES)
      .analyze();
    expect(
      results.violations,
      `axe violations on with-files state:\n` +
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
    ).toEqual([]);
  });

  test("axe — with progress (slider at 50%, SFProgress visible per-file)", async ({
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
      buffer: Buffer.from("%PDF-1.4\n"),
    });
    await page.locator('[data-testid="fixture-progress-slider"]').fill("50");
    const progressbar = page
      .locator('[data-testid="fixture-multi-progress"] [role="progressbar"]')
      .first();
    await expect(progressbar).toBeVisible();
    const results = await new AxeBuilder({ page })
      // Scope axe scan to the playground <main> landmark — excludes the global
      // SIGNAL <canvas> page chrome which sits at body[z-index:-1] outside any
      // landmark and would trip the `region` rule. The canvas is documented as
      // a system-wide pre-existing finding (decorative, role=img, aria-label
      // present); not in Plan 74 scope.
      .include('main[data-testid="sf-file-upload-playground"]')
      .withRules(AXE_RULES)
      .analyze();
    expect(
      results.violations,
      `axe violations on with-progress state:\n` +
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
    ).toEqual([]);
  });

  test("axe — with error (oversized file in 1 KB fixture, error chip surfaced)", async ({
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
    await expect(
      page.locator('[data-testid="fixture-error-1kb"] [data-rejected]').first()
    ).toBeVisible();
    const results = await new AxeBuilder({ page })
      // Scope axe scan to the playground <main> landmark — excludes the global
      // SIGNAL <canvas> page chrome which sits at body[z-index:-1] outside any
      // landmark and would trip the `region` rule. The canvas is documented as
      // a system-wide pre-existing finding (decorative, role=img, aria-label
      // present); not in Plan 74 scope.
      .include('main[data-testid="sf-file-upload-playground"]')
      .withRules(AXE_RULES)
      .analyze();
    expect(
      results.violations,
      `axe violations on with-error state:\n` +
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
    ).toEqual([]);
  });

  test("axe — disabled state (drop zone tabindex=-1, hidden input disabled)", async ({
    page,
  }) => {
    const results = await new AxeBuilder({ page })
      .include('[data-testid="fixture-disabled"]')
      .withRules(AXE_RULES)
      .analyze();
    expect(
      results.violations,
      `axe violations on disabled state:\n` +
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
    ).toEqual([]);
  });

  test("aria-live region present in every fixture section (structural)", async ({
    page,
  }) => {
    // Structural assertion (not axe): each SFFileUpload mounts its own
    // aria-live="polite" region for selection/removal/error announcements.
    // Count is derived from actual fixture-section count and SCOPED to those
    // sections (NOT page-level — the layout/Lenis chrome may inject other
    // aria-live regions outside the fixtures; we only care that each
    // SFFileUpload has its own announcer). Addresses plan-checker WARNING 2
    // (brittle if the playground gains/loses sections).
    const sectionCount = await page
      .locator('section[data-testid^="fixture-"]')
      .count();
    expect(sectionCount).toBeGreaterThan(0); // sanity: fixtures exist
    const liveRegionsInsideFixtures = page.locator(
      'section[data-testid^="fixture-"] [aria-live="polite"]'
    );
    await expect(liveRegionsInsideFixtures).toHaveCount(sectionCount);
  });
});
