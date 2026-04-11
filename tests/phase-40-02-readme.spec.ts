/**
 * Phase 40-02: README section and MIGRATION.md verification
 *
 * Verifies that README.md exists with required sections, contains proper
 * import examples, links to MIGRATION.md, and that MIGRATION.md exists
 * with correct import mappings for all 3 entry points.
 *
 * Tests will fail RED until implementation plan 40-02 runs.
 */

import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");

// ── README.md ─────────────────────────────────────────────────────────────────

test("phase-40-02: README.md exists", () => {
  const readmePath = path.join(ROOT, "README.md");
  expect(fs.existsSync(readmePath), "README.md must exist").toBe(true);
});

test("phase-40-02: README.md contains SIGNAL/FRAME brand name heading", () => {
  const content = fs.readFileSync(path.join(ROOT, "README.md"), "utf8");
  // Matches both SIGNALFRAMEUX, SIGNAL//FRAME//UX, FRAME/SIGNAL, etc.
  expect(content).toMatch(/SIGNAL.*FRAME|FRAME.*SIGNAL/i);
});

test("phase-40-02: README.md contains Installation section", () => {
  const content = fs.readFileSync(path.join(ROOT, "README.md"), "utf8");
  expect(content).toMatch(/#+\s*(Installation|Install|Getting Started)/i);
});

test("phase-40-02: README.md contains Quick Start section", () => {
  const content = fs.readFileSync(path.join(ROOT, "README.md"), "utf8");
  expect(content).toMatch(/#+\s*(Quick Start|Quickstart|Usage)/i);
});

test("phase-40-02: README.md contains Entry Points section", () => {
  const content = fs.readFileSync(path.join(ROOT, "README.md"), "utf8");
  expect(content).toMatch(/#+\s*(Entry Points?|Package Exports?|Exports?)/i);
});

test("phase-40-02: README.md Quick Start references signalframeux import", () => {
  const content = fs.readFileSync(path.join(ROOT, "README.md"), "utf8");
  expect(content).toContain('from "signalframeux"');
});

test("phase-40-02: README.md links to MIGRATION.md", () => {
  const content = fs.readFileSync(path.join(ROOT, "README.md"), "utf8");
  expect(content).toMatch(/\[.*\]\(.*MIGRATION\.md.*\)|MIGRATION\.md/i);
});

test("phase-40-02: README.md contains no @sfux/ import paths (excluding historical table references)", () => {
  const content = fs.readFileSync(path.join(ROOT, "README.md"), "utf8");
  // Strip table rows that contain "old" column context (historical migration data)
  // by removing lines that contain both @sfux/ and "old" within the same line
  const lines = content.split("\n");
  const nonHistoricalLines = lines.filter((line) => {
    const hasOldMarker =
      /old|before|previous|legacy|v0\.\d+/i.test(line) ||
      line.includes("~~") ||
      (line.includes("|") && line.toLowerCase().includes("old"));
    return !(hasOldMarker && line.includes("@sfux/"));
  });
  const cleaned = nonHistoricalLines.join("\n");
  expect(cleaned).not.toMatch(/@sfux\//);
});

// ── MIGRATION.md ──────────────────────────────────────────────────────────────

test("phase-40-02: MIGRATION.md exists", () => {
  const migrationPath = path.join(ROOT, "MIGRATION.md");
  expect(fs.existsSync(migrationPath), "MIGRATION.md must exist").toBe(true);
});

test("phase-40-02: MIGRATION.md is under 200 lines", () => {
  const content = fs.readFileSync(path.join(ROOT, "MIGRATION.md"), "utf8");
  const lineCount = content.split("\n").length;
  expect(
    lineCount,
    `MIGRATION.md has ${lineCount} lines, must be under 200`
  ).toBeLessThan(200);
});

test("phase-40-02: MIGRATION.md contains import mapping for signalframeux core", () => {
  const content = fs.readFileSync(path.join(ROOT, "MIGRATION.md"), "utf8");
  expect(content).toContain("signalframeux");
});

test("phase-40-02: MIGRATION.md contains import mapping for signalframeux/animation", () => {
  const content = fs.readFileSync(path.join(ROOT, "MIGRATION.md"), "utf8");
  expect(content).toContain("signalframeux/animation");
});

test("phase-40-02: MIGRATION.md contains import mapping for signalframeux/webgl", () => {
  const content = fs.readFileSync(path.join(ROOT, "MIGRATION.md"), "utf8");
  expect(content).toContain("signalframeux/webgl");
});

test("phase-40-02: MIGRATION.md contains no @sfux/ import paths (excluding historical table references)", () => {
  const content = fs.readFileSync(path.join(ROOT, "MIGRATION.md"), "utf8");
  // Strip lines that are clearly in an "old → new" migration table (the "old" column)
  const lines = content.split("\n");
  const nonHistoricalLines = lines.filter((line) => {
    const hasOldMarker =
      /old|before|previous|legacy|v0\.\d+/i.test(line) ||
      line.includes("~~") ||
      (line.includes("|") && line.toLowerCase().includes("old"));
    return !(hasOldMarker && line.includes("@sfux/"));
  });
  const cleaned = nonHistoricalLines.join("\n");
  expect(cleaned).not.toMatch(/@sfux\//);
});
