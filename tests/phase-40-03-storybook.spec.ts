/**
 * Phase 40-03: Storybook config and build verification
 *
 * Verifies that Storybook config files exist with correct branding,
 * that the build succeeds, and that story count meets the minimum threshold.
 *
 * Tests will fail RED until implementation plan 40-03 runs.
 */

import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { execFileSync } from "child_process";

const ROOT = path.resolve(__dirname, "..");

// ── Config File Existence ─────────────────────────────────────────────────────

test("phase-40-03: .storybook/main.ts exists", () => {
  const mainPath = path.join(ROOT, ".storybook/main.ts");
  expect(fs.existsSync(mainPath), ".storybook/main.ts must exist").toBe(true);
});

test("phase-40-03: .storybook/preview.ts exists", () => {
  const previewPath = path.join(ROOT, ".storybook/preview.ts");
  const previewTsxPath = path.join(ROOT, ".storybook/preview.tsx");
  const exists = fs.existsSync(previewPath) || fs.existsSync(previewTsxPath);
  expect(exists, ".storybook/preview.ts or preview.tsx must exist").toBe(true);
});

test("phase-40-03: .storybook/manager.ts exists", () => {
  const managerPath = path.join(ROOT, ".storybook/manager.ts");
  expect(fs.existsSync(managerPath), ".storybook/manager.ts must exist").toBe(
    true
  );
});

// ── Manager Branding ──────────────────────────────────────────────────────────

test('phase-40-03: manager.ts contains brandTitle: "SIGNALFRAME//UX"', () => {
  const managerPath = path.join(ROOT, ".storybook/manager.ts");
  const content = fs.readFileSync(managerPath, "utf8");
  expect(content).toContain('brandTitle: "SIGNALFRAME//UX"');
});

test("phase-40-03: manager.ts contains appBorderRadius: 0", () => {
  const managerPath = path.join(ROOT, ".storybook/manager.ts");
  const content = fs.readFileSync(managerPath, "utf8");
  expect(content).toMatch(/appBorderRadius:\s*0/);
});

// ── Build Verification ────────────────────────────────────────────────────────

test("phase-40-03: pnpm build-storybook succeeds and produces index.html", () => {
  // Run build-storybook and verify output
  execFileSync("pnpm", ["build-storybook"], {
    cwd: ROOT,
    stdio: "pipe",
    timeout: 120_000,
  });

  const indexPath = path.join(ROOT, "storybook-static/index.html");
  expect(
    fs.existsSync(indexPath),
    "storybook-static/index.html must exist after build"
  ).toBe(true);
});

// ── Story Count ───────────────────────────────────────────────────────────────

test("phase-40-03: stories/ directory has at least 40 story files total", () => {
  function countStoryFiles(dir: string): number {
    if (!fs.existsSync(dir)) return 0;
    let count = 0;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        count += countStoryFiles(path.join(dir, entry.name));
      } else if (
        entry.isFile() &&
        (entry.name.endsWith(".stories.ts") ||
          entry.name.endsWith(".stories.tsx") ||
          entry.name.endsWith(".stories.mdx"))
      ) {
        count++;
      }
    }
    return count;
  }

  const storiesDir = path.join(ROOT, "stories");
  const flagshipDir = path.join(ROOT, "stories/flagship");
  const total = countStoryFiles(storiesDir) + countStoryFiles(flagshipDir);

  expect(
    total,
    `Expected >= 40 story files, found ${total} in stories/ and stories/flagship/`
  ).toBeGreaterThanOrEqual(40);
});
