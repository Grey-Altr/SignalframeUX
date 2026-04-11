/**
 * generate-api-docs.ts
 *
 * Auto-generates lib/api-docs.ts from the three SignalframeUX entry files:
 *   - lib/entry-core.ts       → importPath: "signalframeux"
 *   - lib/entry-animation.ts  → importPath: "signalframeux/animation"
 *   - lib/entry-webgl.ts      → importPath: "signalframeux/webgl"
 *
 * For each named export, reads the source file and extracts:
 *   - JSDoc description (first paragraph of /** ... *\/)
 *   - @example tags → UsageExample[]
 *   - @param tags → PropDef[]
 *
 * Only exports WITH a JSDoc /** block are included (filters GSAP internals
 * re-exported without docs via `export *`).
 *
 * Layer mapping:
 *   - entry-core.ts interactive components → "FRAME"
 *   - entry-core.ts hooks (use* prefix)    → "HOOK"
 *   - entry-core.ts utilities (cn, toggleTheme, GRAIN_SVG, SESSION_KEYS) → "CORE"
 *   - entry-animation.ts                   → "SIGNAL"
 *   - entry-webgl.ts                       → "SIGNAL"
 *
 * Run: pnpm docs:generate
 */

import * as fs from "fs";
import * as path from "path";

// ─── Types matching lib/api-docs.ts interfaces ───────────────────────────────

interface PropDef {
  name: string;
  type: string;
  default: string;
  desc: string;
  required?: boolean;
}

interface UsageExample {
  label: string;
  code: string;
}

interface ComponentDoc {
  id: string;
  name: string;
  layer: "FRAME" | "SIGNAL" | "CORE" | "TOKEN" | "HOOK";
  version: string;
  status: "STABLE" | "BETA" | "EXPERIMENTAL";
  description: string;
  importPath: string;
  importName: string;
  props: PropDef[];
  usage: UsageExample[];
  a11y: string[];
  preview?: undefined;
}

// ─── Config ──────────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, "..");
const VERSION = "v1.6.0";
const STATUS = "STABLE" as const;

// Type-only exports to skip (they produce no runtime value)
const TYPE_ONLY_EXPORTS = new Set([
  "TextVariant",
  "SignalframeUXConfig",
  "UseSignalframeReturn",
  "SFStatusDotStatus",
  "StepStatus",
  "SFStepperProps",
  "SFStepProps",
  "ScrambleEntry",
  "RGB",
  "ResolveColorOptions",
]);

// Core utility exports (not components or hooks)
const CORE_UTILITIES = new Set([
  "cn",
  "toggleTheme",
  "GRAIN_SVG",
  "SESSION_KEYS",
]);

// ─── Entry file definitions ───────────────────────────────────────────────────

interface EntryDef {
  file: string;
  importPath: string;
  defaultLayer: "FRAME" | "SIGNAL" | "CORE" | "HOOK";
}

const ENTRIES: EntryDef[] = [
  {
    file: "lib/entry-core.ts",
    importPath: "signalframeux",
    defaultLayer: "FRAME",
  },
  {
    file: "lib/entry-animation.ts",
    importPath: "signalframeux/animation",
    defaultLayer: "SIGNAL",
  },
  {
    file: "lib/entry-webgl.ts",
    importPath: "signalframeux/webgl",
    defaultLayer: "SIGNAL",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Resolve a path alias like @/ or ../ relative to the project root.
 */
function resolveSourcePath(
  fromFile: string,
  importSpecifier: string
): string | null {
  const fromDir = path.dirname(path.resolve(ROOT, fromFile));

  if (importSpecifier.startsWith("@/")) {
    const rel = importSpecifier.slice(2); // strip "@/"
    // Try with common extensions
    for (const ext of [".tsx", ".ts", ".tsx"]) {
      const candidate = path.resolve(ROOT, rel + ext);
      if (fs.existsSync(candidate)) return candidate;
    }
    // Try index file
    const candidate = path.resolve(ROOT, rel, "index.ts");
    if (fs.existsSync(candidate)) return candidate;
    return null;
  }

  if (importSpecifier.startsWith("../") || importSpecifier.startsWith("./")) {
    for (const ext of [".tsx", ".ts"]) {
      const candidate = path.resolve(fromDir, importSpecifier + ext);
      if (fs.existsSync(candidate)) return candidate;
    }
    const candidate = path.resolve(fromDir, importSpecifier, "index.ts");
    if (fs.existsSync(candidate)) return candidate;
    return null;
  }

  return null;
}

/**
 * Parse named exports from an entry file.
 * Returns map of: exportName → resolvedSourceFilePath
 *
 * Handles:
 *   export { Foo, Bar } from "../components/sf/sf-foo"
 *   export { Foo, type Bar } from "../lib/foo"    (skips type exports)
 *   export type { Foo } from "..."               (skipped entirely)
 *   export * from "./gsap-core"                  (expanded recursively)
 */
function parseEntryExports(
  entryFile: string
): Map<string, string> {
  const result = new Map<string, string>();
  const content = fs.readFileSync(path.resolve(ROOT, entryFile), "utf8");
  const lines = content.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip type-only export blocks: export type { ... } from "..."
    if (/^export\s+type\s*\{/.test(trimmed)) continue;

    // Named export: export { A, B, type C } from "..."
    const namedMatch = trimmed.match(/^export\s*\{([^}]+)\}\s*from\s*["']([^"']+)["']/);
    if (namedMatch) {
      const names = namedMatch[1]
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s && !s.startsWith("type ")); // skip inline type exports

      const specifier = namedMatch[2];
      const resolved = resolveSourcePath(entryFile, specifier);

      for (const rawName of names) {
        const name = rawName.replace(/^type\s+/, "").trim();
        if (!name) continue;
        if (TYPE_ONLY_EXPORTS.has(name)) continue;
        if (resolved) {
          result.set(name, resolved);
        }
      }
      continue;
    }

    // Star export: export * from "./gsap-core"
    const starMatch = trimmed.match(/^export\s*\*\s*from\s*["']([^"']+)["']/);
    if (starMatch) {
      const specifier = starMatch[1];
      const resolved = resolveSourcePath(entryFile, specifier);
      if (resolved && fs.existsSync(resolved)) {
        // Recursively parse the star-exported file's named exports
        const subExports = parseStarFile(resolved);
        for (const [name, src] of subExports) {
          if (!TYPE_ONLY_EXPORTS.has(name)) {
            result.set(name, src);
          }
        }
      }
    }
  }

  return result;
}

/**
 * Parse named exports from a re-exported module (for export * from "...").
 */
function parseStarFile(filePath: string): Map<string, string> {
  const result = new Map<string, string>();
  if (!fs.existsSync(filePath)) return result;

  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^export\s+type\s*\{/.test(trimmed)) continue;

    // export { Foo } or export { Foo, Bar }
    const namedMatch = trimmed.match(/^export\s*\{([^}]+)\}/);
    if (namedMatch) {
      const names = namedMatch[1]
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s && !s.startsWith("type "));
      for (const name of names) {
        const clean = name.replace(/^type\s+/, "").trim();
        if (clean) result.set(clean, filePath);
      }
    }

    // export function/const/class NAME
    const declMatch = trimmed.match(/^export\s+(?:function|const|class|async\s+function)\s+(\w+)/);
    if (declMatch) {
      result.set(declMatch[1], filePath);
    }
  }

  return result;
}

// ─── JSDoc extraction ─────────────────────────────────────────────────────────

interface ExtractedDoc {
  description: string;
  params: PropDef[];
  examples: UsageExample[];
}

/**
 * Extract JSDoc for a named export from a source file.
 * Finds the /** block immediately preceding the function/const/class/interface declaration.
 */
function extractJSDoc(sourceFile: string, exportName: string): ExtractedDoc | null {
  if (!fs.existsSync(sourceFile)) return null;
  const content = fs.readFileSync(sourceFile, "utf8");

  // Find the position of the export declaration
  // Look for: function ExportName, const ExportName, class ExportName, interface ExportName
  // Also: export { ExportName } at bottom (re-export pattern — JSDoc precedes the function def)
  const declarationPatterns = [
    new RegExp(`(?:export\\s+)?(?:async\\s+)?function\\s+${exportName}\\b`),
    new RegExp(`(?:export\\s+)?const\\s+${exportName}\\b`),
    new RegExp(`(?:export\\s+)?class\\s+${exportName}\\b`),
    new RegExp(`(?:export\\s+)?interface\\s+${exportName}\\b`),
  ];

  let declIndex = -1;
  for (const pattern of declarationPatterns) {
    const match = content.search(pattern);
    if (match !== -1) {
      if (declIndex === -1 || match < declIndex) {
        declIndex = match;
      }
    }
  }

  if (declIndex === -1) return null;

  // Strategy: find all /** blocks in the file before the declaration.
  // Pick the one that either:
  //   (a) is immediately before the declaration (only whitespace/simple declarations between), OR
  //   (b) mentions the export name in its content
  // If multiple candidates, prefer the one closest to the declaration.

  const contentBefore = content.slice(0, declIndex);

  // Collect all JSDoc block positions
  const jsdocMatches: Array<{ start: number; end: number; content: string }> = [];
  let searchPos = 0;
  while (true) {
    const start = contentBefore.indexOf("/**", searchPos);
    if (start === -1) break;
    const end = content.indexOf("*/", start);
    if (end === -1) break;
    jsdocMatches.push({
      start,
      end: end + 2,
      content: content.slice(start, end + 2),
    });
    searchPos = start + 1;
  }

  if (jsdocMatches.length === 0) return null;

  // Find best candidate — prefer the one closest to declIndex that mentions the name
  // or is immediately preceding the declaration
  let bestMatch: { start: number; end: number; content: string } | null = null;

  for (const jsdoc of jsdocMatches) {
    const between = content.slice(jsdoc.end, declIndex).trim();
    const betweenClean = between
      .replace(/\/\*[\s\S]*?\*\//g, "") // strip nested comments
      .replace(/\/\/[^\n]*/g, "")        // strip line comments
      .replace(/const\s+\w+\s*=[\s\S]*?;/g, "") // strip const declarations
      .replace(/type\s+\w+[\s\S]*?;/g, "")      // strip type aliases
      .replace(/interface\s+\w+\s*\{[\s\S]*?\}/g, "") // strip interfaces
      .replace(/const\s+\w+[^;]*/g, "")  // strip partial consts
      .trim();

    const mentionsName = jsdoc.content.includes(exportName);
    const isClose = betweenClean.length < 200;

    if (mentionsName || isClose) {
      // Prefer the closest (latest position) matching candidate
      if (!bestMatch || jsdoc.start > bestMatch.start) {
        bestMatch = jsdoc;
      }
    }
  }

  if (!bestMatch) return null;

  const jsdocContent = bestMatch.content;
  return parseJSDocBlock(jsdocContent);
}

/**
 * Parse a /** ... *\/ block into description, params, examples.
 */
function parseJSDocBlock(block: string): ExtractedDoc {
  // Strip /** and */ and leading * from each line
  const lines = block
    .replace(/^\/\*\*/, "")
    .replace(/\*\/$/, "")
    .split("\n")
    .map((l) => l.replace(/^\s*\*\s?/, "").trimEnd());

  const description: string[] = [];
  const params: PropDef[] = [];
  const examples: UsageExample[] = [];

  let currentTag: string | null = null;
  let currentTagLines: string[] = [];
  let currentExampleLines: string[] = [];
  let inExample = false;

  function flushTag() {
    if (!currentTag) return;

    if (currentTag === "param" && currentTagLines.length > 0) {
      // @param name - description or @param {type} name description
      const raw = currentTagLines.join(" ").trim();
      const withBraces = raw.match(/^\{([^}]+)\}\s+(\w+)\s*-?\s*(.*)/);
      const withoutBraces = raw.match(/^(\w+)\s*-\s*(.*)/);
      if (withBraces) {
        params.push({
          name: withBraces[2],
          type: withBraces[1],
          default: "",
          desc: withBraces[3].trim(),
        });
      } else if (withoutBraces) {
        params.push({
          name: withoutBraces[1],
          type: "any",
          default: "",
          desc: withoutBraces[2].trim(),
        });
      }
    }

    if (currentTag === "example" && currentExampleLines.length > 0) {
      const code = currentExampleLines.join("\n").trim();
      if (code) {
        examples.push({
          label: `EXAMPLE ${examples.length + 1}`,
          code: code.replace(/^```(?:tsx?)?\n?/, "").replace(/\n?```$/, ""),
        });
      }
    }

    currentTag = null;
    currentTagLines = [];
    currentExampleLines = [];
    inExample = false;
  }

  for (const line of lines) {
    const tagMatch = line.match(/^@(\w+)\s*(.*)/);
    if (tagMatch) {
      flushTag();
      currentTag = tagMatch[1];
      const rest = tagMatch[2];

      if (currentTag === "example") {
        inExample = true;
        if (rest.trim()) currentExampleLines.push(rest);
      } else {
        currentTagLines = rest ? [rest] : [];
      }
    } else if (inExample) {
      currentExampleLines.push(line);
    } else if (currentTag) {
      currentTagLines.push(line);
    } else {
      description.push(line);
    }
  }
  flushTag();

  const descText = description
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

  return {
    description: descText || "NO DESCRIPTION",
    params,
    examples,
  };
}

// ─── Layer resolution ─────────────────────────────────────────────────────────

function resolveLayer(
  name: string,
  entryDef: EntryDef
): "FRAME" | "SIGNAL" | "CORE" | "TOKEN" | "HOOK" {
  // Hooks always get HOOK layer
  if (name.startsWith("use") && /^use[A-Z]/.test(name)) return "HOOK";

  // Core utilities
  if (CORE_UTILITIES.has(name)) return "CORE";

  // Provider-related utilities from entry-core
  if (
    entryDef.importPath === "signalframeux" &&
    (name === "createSignalframeUX" || name === "SESSION_KEYS")
  ) {
    return "CORE";
  }

  return entryDef.defaultLayer;
}

// ─── A11y hints per layer ─────────────────────────────────────────────────────

function getA11yHints(layer: string, name: string): string[] {
  if (layer === "HOOK") {
    return ["RESPECTS PREFERS-REDUCED-MOTION WHERE APPLICABLE"];
  }
  if (layer === "CORE") {
    return ["NO DIRECT RENDERING — UTILITY FUNCTION"];
  }
  if (name.toLowerCase().includes("dialog") || name.toLowerCase().includes("alert")) {
    return [
      "FOCUS TRAPPED WITHIN DIALOG WHEN OPEN",
      "ESC KEY CLOSES THE DIALOG",
      "ARIA ROLE=DIALOG APPLIED BY RADIX",
    ];
  }
  if (name.toLowerCase().includes("tooltip")) {
    return [
      "KEYBOARD ACCESSIBLE VIA FOCUS",
      "ARIA ROLE=TOOLTIP APPLIED BY RADIX",
    ];
  }
  if (layer === "FRAME") {
    return ["KEYBOARD NAVIGABLE", "ARIA ATTRIBUTES MANAGED BY RADIX UI"];
  }
  if (layer === "SIGNAL") {
    return [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE",
    ];
  }
  return ["KEYBOARD NAVIGABLE"];
}

// ─── Main generation ──────────────────────────────────────────────────────────

function generateApiDocs(): void {
  const allDocs: Record<string, ComponentDoc> = {};
  let totalExports = 0;
  let includedExports = 0;

  for (const entryDef of ENTRIES) {
    console.log(`\nProcessing: ${entryDef.file} → ${entryDef.importPath}`);
    const exports = parseEntryExports(entryDef.file);
    console.log(`  Found ${exports.size} named exports`);

    for (const [name, sourceFile] of exports) {
      totalExports++;

      // Extract JSDoc from source file
      const jsdoc = extractJSDoc(sourceFile, name);

      if (!jsdoc) {
        console.log(`  SKIP (no JSDoc): ${name}`);
        continue;
      }

      includedExports++;
      const layer = resolveLayer(name, entryDef);

      const doc: ComponentDoc = {
        id: name,
        name,
        layer,
        version: VERSION,
        status: STATUS,
        description: jsdoc.description,
        importPath: entryDef.importPath,
        importName: name,
        props: jsdoc.params.length > 0 ? jsdoc.params : [],
        usage:
          jsdoc.examples.length > 0
            ? jsdoc.examples
            : [
                {
                  label: "BASIC USAGE",
                  code: `import { ${name} } from '${entryDef.importPath}'`,
                },
              ],
        a11y: getA11yHints(layer, name),
      };

      allDocs[name] = doc;
      console.log(`  OK: ${name} [${layer}]`);
    }
  }

  console.log(
    `\nTotal: ${includedExports}/${totalExports} exports included (${totalExports - includedExports} skipped — no JSDoc)`
  );

  // ─── Write output ────────────────────────────────────────────────────────

  const outputPath = path.resolve(ROOT, "lib/api-docs.ts");

  const serialized = JSON.stringify(allDocs, null, 2)
    // Convert JSON string escapes back to TS-friendly template literals
    .replace(/"([^"]+)":/g, "  $1:")
    .replace(/"/g, '"');

  const output = `/**
 * API documentation data for all SignalframeUX components and utilities.
 * Each entry maps to a nav item in the API Explorer sidebar.
 *
 * AUTO-GENERATED — do not edit by hand.
 * Run: pnpm docs:generate
 * Source: scripts/generate-api-docs.ts
 * Generated: ${new Date().toISOString()}
 */

export interface PropDef {
  name: string;
  type: string;
  default: string;
  desc: string;
  required?: boolean;
}

export interface UsageExample {
  label: string;
  code: string;
}

export interface PreviewHud {
  lines: string[];
  code: string;
}

export interface ComponentDoc {
  id: string;
  name: string;
  layer: "FRAME" | "SIGNAL" | "CORE" | "TOKEN" | "HOOK";
  version: string;
  status: "STABLE" | "BETA" | "EXPERIMENTAL";
  description: string;
  importPath: string;
  importName: string;
  props: PropDef[];
  usage: UsageExample[];
  a11y: string[];
  preview?: PreviewHud;
}

export const API_DOCS: Record<string, ComponentDoc> = ${JSON.stringify(allDocs, null, 2)};
`;

  fs.writeFileSync(outputPath, output, "utf8");
  console.log(`\nWrote ${outputPath}`);

  // ─── Verification ────────────────────────────────────────────────────────
  const written = fs.readFileSync(outputPath, "utf8");

  if (written.includes("@sfux/")) {
    console.error("ERROR: Output contains @sfux/ import paths!");
    process.exit(1);
  }

  const importPaths = new Set(
    [...written.matchAll(/"importPath":\s*"([^"]+)"/g)].map((m) => m[1])
  );
  const validPaths = new Set([
    "signalframeux",
    "signalframeux/animation",
    "signalframeux/webgl",
  ]);
  for (const p of importPaths) {
    if (!validPaths.has(p)) {
      console.error(`ERROR: Invalid importPath found: ${p}`);
      process.exit(1);
    }
  }

  console.log(`Verification passed:`);
  console.log(`  - Zero @sfux/ strings`);
  console.log(`  - Import paths: ${[...importPaths].join(", ")}`);
  console.log(`  - ${Object.keys(allDocs).length} entries in API_DOCS`);
}

generateApiDocs();
