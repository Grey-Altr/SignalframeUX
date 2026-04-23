/**
 * Phase 40-04: API docs accuracy verification
 *
 * Verifies that lib/api-docs.ts contains zero @sfux/ import paths,
 * all importPath values match the correct entry point package names,
 * and all named exports from the 3 entry points appear as keys in API_DOCS.
 *
 * Tests will fail RED until implementation plan 40-04 runs.
 */

import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");

// lib/api-docs.ts is now a barrel: entries live in lib/api-docs/{frame,signal,core,hook}.ts
// and types in lib/api-docs/types.ts. Reading just the barrel misses the content
// these tests care about — concatenate barrel + sub-files for source-level assertions.
function readAllApiDocsSource(): string {
  const files = [
    "lib/api-docs.ts",
    "lib/api-docs/types.ts",
    "lib/api-docs/frame.ts",
    "lib/api-docs/signal.ts",
    "lib/api-docs/core.ts",
    "lib/api-docs/hook.ts",
  ];
  return files
    .filter((f) => fs.existsSync(path.join(ROOT, f)))
    .map((f) => fs.readFileSync(path.join(ROOT, f), "utf8"))
    .join("\n");
}

// Type-only exports excluded from API_DOCS coverage requirements
const TYPE_ONLY_EXPORTS = new Set([
  "TextVariant",
  "SignalframeUXConfig",
  "UseSignalframeReturn",
  "SFStatusDotStatus",
]);

// Third-party GSAP re-exports — pass-through symbols, not SFUX-owned components
const THIRD_PARTY_EXPORTS = new Set([
  "gsap",
  "ScrollTrigger",
  "Observer",
  "useGSAP",
  "SplitText",
  "ScrambleTextPlugin",
  "Flip",
  "CustomEase",
  "DrawSVGPlugin",
]);

// Valid importPath values for signalframeux package
const VALID_IMPORT_PATHS = [
  "signalframeux",
  "signalframeux/animation",
  "signalframeux/webgl",
];

/**
 * Extract named exports from an entry file.
 * Handles `export { Name }` patterns, skips type-only exports.
 */
function extractNamedExports(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf8");
  const exports: string[] = [];

  const namedExportRegex = /^export\s+\{([^}]+)\}\s+from\s+/gm;
  let match: RegExpExecArray | null;

  while ((match = namedExportRegex.exec(content)) !== null) {
    const names = match[1]
      .split(",")
      .map((s) => s.trim())
      .filter((s) => !s.startsWith("type "))
      .map((s) => s.replace(/^type\s+/, "").trim())
      .filter(Boolean);
    exports.push(...names);
  }

  // Handle `export * from` by resolving and extracting
  const starExportRegex = /^export\s+\*\s+from\s+['"]([^'"]+)['"]/gm;
  while ((match = starExportRegex.exec(content)) !== null) {
    const modulePath = match[1];
    const resolved = resolveModulePath(path.dirname(filePath), modulePath);
    if (resolved && fs.existsSync(resolved)) {
      const starContent = fs.readFileSync(resolved, "utf8");
      const directRegex =
        /^export\s+(?:const|function|class|let|var)\s+(\w+)/gm;
      let m: RegExpExecArray | null;
      while ((m = directRegex.exec(starContent)) !== null) {
        exports.push(m[1]);
      }
      const namedRegex = /^export\s+\{([^}]+)\}/gm;
      while ((m = namedRegex.exec(starContent)) !== null) {
        const names = m[1]
          .split(",")
          .map((s) => s.trim())
          .filter((s) => !s.startsWith("type "))
          .map((s) => s.trim())
          .filter(Boolean);
        exports.push(...names);
      }
    }
  }

  return [...new Set(exports)];
}

/**
 * Resolve a module path to an absolute file path (TypeScript-aware).
 */
function resolveModulePath(
  fromDir: string,
  modulePath: string
): string | null {
  const extensions = [".ts", ".tsx", "/index.ts", "/index.tsx"];
  const base = path.resolve(fromDir, modulePath);
  for (const ext of extensions) {
    const candidate = base + ext;
    if (fs.existsSync(candidate)) return candidate;
  }
  if (fs.existsSync(base)) return base;
  return null;
}

// ── No @sfux/ paths ───────────────────────────────────────────────────────────

test("phase-40-04: api-docs.ts contains zero @sfux/ import paths", () => {
  const content = readAllApiDocsSource();
  const matches = content.match(/@sfux\//g) || [];
  expect(
    matches.length,
    `Found ${matches.length} occurrences of @sfux/ in api-docs.ts — must be zero`
  ).toBe(0);
});

// ── All importPath values are valid ───────────────────────────────────────────

test("phase-40-04: all importPath values in api-docs.ts match valid entry points", () => {
  const content = readAllApiDocsSource();

  // Extract all importPath string values
  const importPathRegex = /importPath:\s*['"]([^'"]+)['"]/g;
  let match: RegExpExecArray | null;
  const invalidPaths: string[] = [];

  while ((match = importPathRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (!VALID_IMPORT_PATHS.includes(importPath)) {
      invalidPaths.push(importPath);
    }
  }

  expect(
    invalidPaths,
    `Invalid importPath values found: ${invalidPaths.join(", ")}. Must be one of: ${VALID_IMPORT_PATHS.join(", ")}`
  ).toHaveLength(0);
});

test("phase-40-04: api-docs.ts has at least one entry with importPath signalframeux", () => {
  const content = readAllApiDocsSource();
  // Match both TS object literal (importPath: "...") and JSON format ("importPath": "...")
  expect(content).toMatch(/["']?importPath["']?\s*:\s*["']signalframeux["']/);
});

test("phase-40-04: api-docs.ts has at least one entry with importPath signalframeux/animation", () => {
  const content = readAllApiDocsSource();
  expect(content).toMatch(/["']?importPath["']?\s*:\s*["']signalframeux\/animation["']/);
});

test("phase-40-04: api-docs.ts has at least one entry with importPath signalframeux/webgl", () => {
  const content = readAllApiDocsSource();
  expect(content).toMatch(/["']?importPath["']?\s*:\s*["']signalframeux\/webgl["']/);
});

// ── All entry exports appear as API_DOCS keys ─────────────────────────────────

test("phase-40-04: all entry-core.ts exports appear as keys in API_DOCS", () => {
  const apiContent = fs.readFileSync(
    path.join(ROOT, "lib/api-docs.ts"),
    "utf8"
  );
  const exports = extractNamedExports(
    path.join(ROOT, "lib/entry-core.ts")
  ).filter((name) => !TYPE_ONLY_EXPORTS.has(name));

  const missingFromDocs: string[] = [];
  for (const name of exports) {
    // Check if the export name appears as a key in API_DOCS
    // Keys are string literals: `"SFButton": {` or `'SFButton': {`
    const keyPattern = new RegExp(`['"]${name}['"]\\s*:`);
    if (!keyPattern.test(apiContent)) {
      missingFromDocs.push(name);
    }
  }

  expect(
    missingFromDocs,
    `Core exports missing from API_DOCS: ${missingFromDocs.join(", ")}`
  ).toHaveLength(0);
});

test("phase-40-04: all entry-animation.ts exports appear as keys in API_DOCS", () => {
  const apiContent = fs.readFileSync(
    path.join(ROOT, "lib/api-docs.ts"),
    "utf8"
  );
  const exports = extractNamedExports(
    path.join(ROOT, "lib/entry-animation.ts")
  ).filter(
    (name) => !TYPE_ONLY_EXPORTS.has(name) && !THIRD_PARTY_EXPORTS.has(name)
  );

  const missingFromDocs: string[] = [];
  for (const name of exports) {
    const keyPattern = new RegExp(`['"]${name}['"]\\s*:`);
    if (!keyPattern.test(apiContent)) {
      missingFromDocs.push(name);
    }
  }

  expect(
    missingFromDocs,
    `Animation exports missing from API_DOCS: ${missingFromDocs.join(", ")}`
  ).toHaveLength(0);
});

test("phase-40-04: all entry-webgl.ts exports appear as keys in API_DOCS", () => {
  const apiContent = fs.readFileSync(
    path.join(ROOT, "lib/api-docs.ts"),
    "utf8"
  );
  const exports = extractNamedExports(
    path.join(ROOT, "lib/entry-webgl.ts")
  ).filter((name) => !TYPE_ONLY_EXPORTS.has(name));

  const missingFromDocs: string[] = [];
  for (const name of exports) {
    const keyPattern = new RegExp(`['"]${name}['"]\\s*:`);
    if (!keyPattern.test(apiContent)) {
      missingFromDocs.push(name);
    }
  }

  expect(
    missingFromDocs,
    `WebGL exports missing from API_DOCS: ${missingFromDocs.join(", ")}`
  ).toHaveLength(0);
});

// ── Structural integrity ───────────────────────────────────────────────────────

test("phase-40-04: API_DOCS export exists in api-docs.ts", () => {
  const content = readAllApiDocsSource();
  expect(content).toContain("export const API_DOCS");
});

test("phase-40-04: ComponentDoc interface defines required fields", () => {
  const content = readAllApiDocsSource();
  expect(content).toContain("importPath");
  expect(content).toContain("importName");
  expect(content).toContain("layer:");
  expect(content).toContain("status:");
});
