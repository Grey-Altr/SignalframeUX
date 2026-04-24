/**
 * R-64-j · Overlay focus-return audit
 *
 * Verifies that every overlay returns focus to its trigger (or to a safe
 * location) on dismiss, per LOCKDOWN.md §9.7. Two layers:
 *
 * 1. Source-level: SF overlay wrappers must NOT pass preventDefault on
 *    onCloseAutoFocus / onOpenAutoFocus — doing so overrides Radix's
 *    default focus-return behavior and is an R-64-j violation.
 *
 * 2. Browser-level: spot-check the cheatsheet (SFDialog) and CommandPalette
 *    (SFCommandDialog) — open and dismiss, assert focus returns to a
 *    sensible element rather than being lost.
 *
 * Assumes dev server is running on http://localhost:3000 (playwright.config baseURL).
 */
import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");

function listSFOverlayFiles(): string[] {
  const dir = path.resolve(ROOT, "components/sf");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".tsx") && f.startsWith("sf-"))
    .map((f) => path.join("components/sf", f));
}

test.describe("R-64-j: overlay focus-return", () => {
  test("source: no SF overlay preventDefaults onCloseAutoFocus / onOpenAutoFocus", () => {
    const files = listSFOverlayFiles();
    const violations: Array<{ file: string; line: number; text: string }> = [];

    for (const rel of files) {
      const src = fs.readFileSync(path.resolve(ROOT, rel), "utf-8");
      const lines = src.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const text = lines[i];
        if (
          /(onCloseAutoFocus|onOpenAutoFocus)[^}]*preventDefault/.test(text)
        ) {
          violations.push({ file: rel, line: i + 1, text: text.trim() });
        }
      }
    }

    if (violations.length > 0) {
      const msg = violations
        .map((v) => `  ${v.file}:${v.line} — ${v.text}`)
        .join("\n");
      throw new Error(
        `R-64-j violations: SF overlay preventDefaults focus-return:\n${msg}`,
      );
    }
    expect(violations).toEqual([]);
  });

  test("browser: ? cheatsheet dismisses and focus returns to body", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Press ? to open
    await page.keyboard.press("Shift+Slash");
    await expect(page.getByRole("dialog")).toBeVisible();

    // Esc to dismiss
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();

    // Focus should be on body (no trigger element, so Radix lands on body
    // which is R-64-j compliant — focus is not lost).
    const activeTag = await page.evaluate(() =>
      document.activeElement?.tagName.toLowerCase(),
    );
    expect(["body", "html"]).toContain(activeTag);
  });

  test("browser: ⌘K palette dismisses and focus does not get lost", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const isMac = process.platform === "darwin";
    const mod = isMac ? "Meta" : "Control";
    await page.keyboard.press(`${mod}+k`);
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();

    const activeTag = await page.evaluate(() =>
      document.activeElement?.tagName.toLowerCase(),
    );
    expect(activeTag).toBeTruthy();
    expect(["body", "html", "button", "a", "input"]).toContain(activeTag);
  });
});
