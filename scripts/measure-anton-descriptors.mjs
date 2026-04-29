#!/usr/bin/env node
/**
 * CRT-03 (Phase 59 Plan B): Measure Anton descriptors against the
 * Impact-class fallback chain. Reads the SUBSETTED Anton-Regular.woff2
 * (NOT the original) — descriptors must reflect the actual font face
 * shipped in production. Output is pasted into app/layout.tsx
 * declarations literal.
 *
 * Usage: node scripts/measure-anton-descriptors.mjs
 *
 * Formulas from 59-RESEARCH.md L306-313:
 *   size-adjust       = (anton_xAvgCharWidth / impact_xAvgCharWidth) x 100%
 *                       (normalized for UPM difference)
 *   ascent-override   = (anton_sTypoAscender / anton_unitsPerEm) x 100% x (100 / size-adjust)
 *   descent-override  = (|anton_sTypoDescender| / anton_unitsPerEm) x 100% x (100 / size-adjust)
 *   line-gap-override = 0%  (display fonts ship line-gap=0; preserve)
 *
 * Cross-verify computed descriptors against:
 * https://www.industrialempathy.com/perfect-ish-font-fallback/
 * Upload the subsetted woff2, set fallback to "Impact", compare output.
 *
 * NOTE: opentype.js 1.3.4 does not support woff2 format natively.
 * Font metrics are extracted via fonttools (Python) as a child process.
 * The fonttools Python package must be installed (pip3 install fonttools brotli).
 *
 * If you need to re-measure after re-subsetting, run directly:
 *   python3 -c "
 *   from fontTools.ttLib import TTFont
 *   font = TTFont('app/fonts/Anton-Regular.woff2')
 *   print('UPM:', font['head'].unitsPerEm)
 *   print('sTypoAscender:', font['OS/2'].sTypoAscender)
 *   print('sTypoDescender:', font['OS/2'].sTypoDescender)
 *   print('sTypoLineGap:', font['OS/2'].sTypoLineGap)
 *   print('xAvgCharWidth:', font['OS/2'].xAvgCharWidth)
 *   "
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const fontPath = resolve(__dirname, "../app/fonts/Anton-Regular.woff2");

// Extract font metrics via fonttools.
// execFileSync (not execSync/exec) — no shell interpolation; fontPath is
// a repo-controlled static string, not user input.
let metrics;
try {
  const pythonScript = [
    "from fontTools.ttLib import TTFont",
    `font = TTFont('${fontPath.replace(/'/g, "\\'")}')`,
    "print(font['head'].unitsPerEm)",
    "print(font['OS/2'].sTypoAscender)",
    "print(font['OS/2'].sTypoDescender)",
    "print(font['OS/2'].sTypoLineGap)",
    "print(font['OS/2'].xAvgCharWidth)",
  ].join("; ");

  const output = execFileSync("python3", ["-c", pythonScript], {
    encoding: "utf8",
  })
    .trim()
    .split("\n")
    .map(Number);

  const [unitsPerEm, sTypoAscender, sTypoDescender, sTypoLineGap, xAvgCharWidth] =
    output;
  metrics = {
    unitsPerEm,
    sTypoAscender,
    sTypoDescender,
    sTypoLineGap,
    xAvgCharWidth,
  };
} catch (err) {
  // Fallback: use values measured from the subsetted woff2 on 2026-04-25
  // via pyftsubset (U+0020-U+007E + U+2122; 11140 bytes).
  // These values are IDENTICAL to the original full Anton face because
  // pyftsubset preserves all OS/2 table metrics; only the cmap + glyph
  // data is reduced.
  process.stderr.write(
    `[WARN] fonttools not available; using pre-measured values: ${err.message}\n`
  );
  metrics = {
    unitsPerEm: 2048,
    sTypoAscender: 2409,
    sTypoDescender: -674,
    sTypoLineGap: 0,
    xAvgCharWidth: 938,
  };
}

const {
  unitsPerEm,
  sTypoAscender,
  sTypoDescender,
  sTypoLineGap,
  xAvgCharWidth,
} = metrics;

// Reference Impact metrics.
// Source: Impact TrueType standard metrics (Windows system font).
// UPM = 2048; xAvgCharWidth = 1018 measured from Windows Impact.ttf OS/2 table.
// Cross-verified against Brian Louis Ramirez Fallback Font Generator:
// https://www.industrialempathy.com/perfect-ish-font-fallback/
const IMPACT_xAvgCharWidth = 1018;
const IMPACT_unitsPerEm = 2048;

// Formulas from 59-RESEARCH.md L306-313:
// size-adjust normalizes for both xAvgCharWidth ratio AND UPM scale factor.
// When both fonts share the same UPM (2048 for Anton and Impact), the UPM
// ratio is 1.0 and the formula simplifies to the pure xAvg ratio.
const sizeAdjust =
  (xAvgCharWidth / IMPACT_xAvgCharWidth) *
  (IMPACT_unitsPerEm / unitsPerEm) *
  100;

const ascentOverride =
  (sTypoAscender / unitsPerEm) * 100 * (100 / sizeAdjust);
const descentOverride =
  (Math.abs(sTypoDescender) / unitsPerEm) * 100 * (100 / sizeAdjust);

// 2-decimal precision matches browser parsing tolerance.
const round = (n) => `${n.toFixed(2)}%`;

const result = {
  input: {
    unitsPerEm,
    sTypoAscender,
    sTypoDescender,
    sTypoLineGap,
    xAvgCharWidth,
    IMPACT_xAvgCharWidth,
    IMPACT_unitsPerEm,
  },
  descriptors: {
    "size-adjust": round(sizeAdjust),
    "ascent-override": round(ascentOverride),
    "descent-override": round(descentOverride),
    "line-gap-override": "0%",
  },
};

process.stdout.write(JSON.stringify(result, null, 2) + "\n");
process.stdout.write("\n## Plan body paste (markdown):\n\n");
process.stdout.write("| Metric | Value |\n");
process.stdout.write("|--------|-------|\n");
for (const [k, v] of Object.entries(result.input)) {
  process.stdout.write(`| ${k} | ${v} |\n`);
}
for (const [k, v] of Object.entries(result.descriptors)) {
  process.stdout.write(`| **${k}** | **${v}** |\n`);
}
process.stdout.write("\n## app/layout.tsx declarations paste:\n\n");
process.stdout.write(
  [
    `      declarations: [`,
    `        { prop: "size-adjust",       value: "${result.descriptors["size-adjust"]}" },   // MEASURED`,
    `        { prop: "ascent-override",   value: "${result.descriptors["ascent-override"]}" },  // MEASURED`,
    `        { prop: "descent-override",  value: "${result.descriptors["descent-override"]}" },  // MEASURED`,
    `        { prop: "line-gap-override", value: "0%" },    // display fonts ship line-gap=0`,
    `      ],`,
  ].join("\n") + "\n"
);
