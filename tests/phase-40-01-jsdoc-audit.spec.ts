/**
 * Phase 40-01: JSDoc coverage audit for all exported symbols
 *
 * These checks verify that every non-type-only export from all 3 entry points
 * has a JSDoc block with an @example tag in its source file.
 *
 * Tests will fail RED until implementation plan 40-01 runs.
 */

import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");

// Type-only exports excluded from JSDoc requirements
const TYPE_ONLY_EXPORTS = new Set([
  "TextVariant",
  "SignalframeUXConfig",
  "UseSignalframeReturn",
  "SFStatusDotStatus",
]);

// Third-party re-exports — GSAP and @gsap/react symbols are external library
// symbols re-exported as convenience bundles. We do not own their JSDoc.
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

/**
 * Extract named exports from an entry file.
 * Handles both `export { Name }` and `export { Name, type TypeName }` patterns.
 * For `export * from` lines, resolves the source file and extracts its exports.
 */
function extractNamedExports(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf8");
  const exports: string[] = [];

  // Match `export { Name1, Name2 } from "..."` lines
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

  // Match `export * from "./module"` and resolve their exports
  const starExportRegex = /^export\s+\*\s+from\s+['"]([^'"]+)['"]/gm;
  while ((match = starExportRegex.exec(content)) !== null) {
    const modulePath = match[1];
    const resolved = resolveModulePath(path.dirname(filePath), modulePath);
    if (resolved && fs.existsSync(resolved)) {
      const starExports = extractDirectExports(resolved);
      exports.push(...starExports);
    }
  }

  return [...new Set(exports)];
}

/**
 * Extract direct named exports from a module file (for `export *` resolution).
 */
function extractDirectExports(filePath: string): string[] {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, "utf8");
  const exports: string[] = [];

  // export const/function/class Name
  const directExportRegex =
    /^export\s+(?:const|function|class|let|var)\s+(\w+)/gm;
  let match: RegExpExecArray | null;
  while ((match = directExportRegex.exec(content)) !== null) {
    exports.push(match[1]);
  }

  // export { Name1, Name2 }
  const namedExportRegex = /^export\s+\{([^}]+)\}/gm;
  while ((match = namedExportRegex.exec(content)) !== null) {
    const names = match[1]
      .split(",")
      .map((s) => s.trim())
      .filter((s) => !s.startsWith("type "))
      .map((s) => s.trim())
      .filter(Boolean);
    exports.push(...names);
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

/**
 * Convert a PascalCase or camelCase name to kebab-case.
 * Handles SF-prefix components: SFButton → sf-button (not s-f-button).
 */
function toKebab(name: string): string {
  // Strip leading SF prefix for SF-prefixed components (SFButton → Button)
  const stripped = /^SF[A-Z]/.test(name) ? name.slice(2) : name;
  return stripped
    .replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`)
    .replace(/^-/, "");
}

/**
 * Find the source file for a component by searching components/ and lib/ directories.
 * Handles SF-prefixed components (SFButton → sf-button.tsx),
 * hooks (useScrambleText → use-scramble-text.ts),
 * and lib utilities (cn → utils.ts, toggleTheme → theme.ts).
 */
function findComponentFile(baseDir: string, exportName: string): string | null {
  const kebab = toKebab(exportName);

  // Special lib file mappings for utilities not following kebab naming
  const libMappings: Record<string, string> = {
    cn: "utils",
    toggleTheme: "theme",
    GRAIN_SVG: "grain",
    createSignalframeUX: "signalframe-provider",
    useSignalframe: "signalframe-provider",
    SignalCanvas: "signal-canvas",
    resolveColorToken: "color-resolve",
    resolveColorAsThreeColor: "color-resolve",
    SESSION_KEYS: "use-session-state",
    registerSFEasings: "gsap-easings",
    initReducedMotion: "gsap-plugins",
  };

  // Component-to-parent-file mappings for sub-components whose filename
  // cannot be derived by simple kebab stripping (e.g. SFScrollBar → sf-scroll-area).
  const componentFileMappings: Record<string, string> = {
    SFScrollBar: "sf-scroll-area",
    SFToaster: "sf-toast",
    SFStep: "sf-stepper",
  };

  if (componentFileMappings[exportName]) {
    const sfFile = componentFileMappings[exportName];
    const sfDir = path.join(baseDir, "components/sf");
    for (const ext of [".ts", ".tsx"]) {
      const candidate = path.join(sfDir, sfFile + ext);
      if (fs.existsSync(candidate)) return candidate;
    }
  }

  if (libMappings[exportName]) {
    const libBase = libMappings[exportName];
    const libDir = path.join(baseDir, "lib");
    const hooksDir = path.join(baseDir, "hooks");
    for (const dir of [libDir, hooksDir]) {
      for (const ext of [".ts", ".tsx"]) {
        const candidate = path.join(dir, libBase + ext);
        if (fs.existsSync(candidate)) return candidate;
      }
    }
  }

  const searchDirs = [
    path.join(baseDir, "components/sf"),
    path.join(baseDir, "components/animation"),
    path.join(baseDir, "lib"),
    path.join(baseDir, "hooks"),
  ];

  for (const dir of searchDirs) {
    if (!fs.existsSync(dir)) continue;
    const candidates = [
      // SF-prefixed: SFButton → sf-button.tsx
      path.join(dir, `sf-${kebab}.ts`),
      path.join(dir, `sf-${kebab}.tsx`),
      // Direct kebab: use-scramble-text.ts, gsap-core.ts, etc.
      path.join(dir, `${kebab}.ts`),
      path.join(dir, `${kebab}.tsx`),
    ];
    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) return candidate;
    }
  }

  // Fallback: sub-components like SFCardHeader live in the parent file (sf-card.tsx).
  // Progressively strip the last kebab segment to find the parent file.
  // e.g. SFCardHeader → card-header → strip "-header" → card → sf-card.tsx
  if (/^SF[A-Z]/.test(exportName)) {
    const segments = kebab.split("-");
    for (let len = segments.length - 1; len >= 1; len--) {
      const parentKebab = segments.slice(0, len).join("-");
      for (const dir of [path.join(baseDir, "components/sf"), path.join(baseDir, "components/animation")]) {
        if (!fs.existsSync(dir)) continue;
        for (const ext of [".ts", ".tsx"]) {
          const candidate = path.join(dir, `sf-${parentKebab}${ext}`);
          if (fs.existsSync(candidate)) return candidate;
        }
      }
    }
  }

  return null;
}

/**
 * Check if a named export has a JSDoc block in its source file.
 */
function hasJsDocBlock(sourceDir: string, exportName: string): boolean {
  const componentFile = findComponentFile(sourceDir, exportName);
  if (!componentFile) return false;
  const content = fs.readFileSync(componentFile, "utf8");
  return /\/\*\*[\s\S]*?\*\//.test(content);
}

/**
 * Check if a named export's JSDoc includes an @example tag.
 */
function hasJsDocExample(sourceDir: string, exportName: string): boolean {
  const componentFile = findComponentFile(sourceDir, exportName);
  if (!componentFile) return false;
  const content = fs.readFileSync(componentFile, "utf8");
  return /\/\*\*[\s\S]*?@example[\s\S]*?\*\//.test(content);
}

// ── Core Entry Exports ────────────────────────────────────────────────────────

test("phase-40-01: entry-core.ts exports all have JSDoc blocks", () => {
  const entryPath = path.join(ROOT, "lib/entry-core.ts");
  const exports = extractNamedExports(entryPath).filter(
    (name) => !TYPE_ONLY_EXPORTS.has(name) && !THIRD_PARTY_EXPORTS.has(name)
  );

  expect(exports.length).toBeGreaterThan(0);

  const missing: string[] = [];
  for (const name of exports) {
    if (!hasJsDocBlock(ROOT, name)) {
      missing.push(name);
    }
  }

  expect(
    missing,
    `Missing JSDoc blocks for core exports: ${missing.join(", ")}`
  ).toHaveLength(0);
});

test("phase-40-01: entry-core.ts exports all have @example in JSDoc", () => {
  const entryPath = path.join(ROOT, "lib/entry-core.ts");
  const exports = extractNamedExports(entryPath).filter(
    (name) => !TYPE_ONLY_EXPORTS.has(name) && !THIRD_PARTY_EXPORTS.has(name)
  );

  const missingExamples: string[] = [];
  for (const name of exports) {
    if (!hasJsDocExample(ROOT, name)) {
      missingExamples.push(name);
    }
  }

  expect(
    missingExamples,
    `Missing @example in JSDoc for core exports: ${missingExamples.join(", ")}`
  ).toHaveLength(0);
});

// ── Animation Entry Exports ───────────────────────────────────────────────────

test("phase-40-01: entry-animation.ts exports all have JSDoc blocks", () => {
  const entryPath = path.join(ROOT, "lib/entry-animation.ts");
  const exports = extractNamedExports(entryPath).filter(
    (name) => !TYPE_ONLY_EXPORTS.has(name) && !THIRD_PARTY_EXPORTS.has(name)
  );

  expect(exports.length).toBeGreaterThan(0);

  const missing: string[] = [];
  for (const name of exports) {
    if (!hasJsDocBlock(ROOT, name)) {
      missing.push(name);
    }
  }

  expect(
    missing,
    `Missing JSDoc blocks for animation exports: ${missing.join(", ")}`
  ).toHaveLength(0);
});

test("phase-40-01: entry-animation.ts exports all have @example in JSDoc", () => {
  const entryPath = path.join(ROOT, "lib/entry-animation.ts");
  const exports = extractNamedExports(entryPath).filter(
    (name) => !TYPE_ONLY_EXPORTS.has(name) && !THIRD_PARTY_EXPORTS.has(name)
  );

  const missingExamples: string[] = [];
  for (const name of exports) {
    if (!hasJsDocExample(ROOT, name)) {
      missingExamples.push(name);
    }
  }

  expect(
    missingExamples,
    `Missing @example in JSDoc for animation exports: ${missingExamples.join(", ")}`
  ).toHaveLength(0);
});

// ── WebGL Entry Exports ───────────────────────────────────────────────────────

test("phase-40-01: entry-webgl.ts exports all have JSDoc blocks", () => {
  const entryPath = path.join(ROOT, "lib/entry-webgl.ts");
  const exports = extractNamedExports(entryPath).filter(
    (name) => !TYPE_ONLY_EXPORTS.has(name) && !THIRD_PARTY_EXPORTS.has(name)
  );

  expect(exports.length).toBeGreaterThan(0);

  const missing: string[] = [];
  for (const name of exports) {
    if (!hasJsDocBlock(ROOT, name)) {
      missing.push(name);
    }
  }

  expect(
    missing,
    `Missing JSDoc blocks for webgl exports: ${missing.join(", ")}`
  ).toHaveLength(0);
});

test("phase-40-01: entry-webgl.ts exports all have @example in JSDoc", () => {
  const entryPath = path.join(ROOT, "lib/entry-webgl.ts");
  const exports = extractNamedExports(entryPath).filter(
    (name) => !TYPE_ONLY_EXPORTS.has(name) && !THIRD_PARTY_EXPORTS.has(name)
  );

  const missingExamples: string[] = [];
  for (const name of exports) {
    if (!hasJsDocExample(ROOT, name)) {
      missingExamples.push(name);
    }
  }

  expect(
    missingExamples,
    `Missing @example in JSDoc for webgl exports: ${missingExamples.join(", ")}`
  ).toHaveLength(0);
});

// ── Sanity checks ─────────────────────────────────────────────────────────────

test("phase-40-01: type-only exports are excluded from JSDoc checks", () => {
  const coreContent = fs.readFileSync(
    path.join(ROOT, "lib/entry-core.ts"),
    "utf8"
  );
  const animContent = fs.readFileSync(
    path.join(ROOT, "lib/entry-animation.ts"),
    "utf8"
  );

  // TextVariant and SignalframeUXConfig are type exports from core
  expect(coreContent).toMatch(/type TextVariant/);
  expect(coreContent).toMatch(/SignalframeUXConfig/);

  // SFStatusDotStatus is a type export from animation
  expect(animContent).toMatch(/type SFStatusDotStatus/);
});
