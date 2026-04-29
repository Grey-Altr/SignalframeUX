#!/usr/bin/env node
/**
 * Phase 63.1 Plan 03 Path A — vectorize CdCornerPanel wordmark.
 *
 * Converts `<text>CULTURE DIVISION <tspan fill="transparent">による</tspan></text>`
 * to a static `<path d="..."/>` so the wordmark paints at FCP without
 * waiting for JetBrains Mono swap (LCP candidate-shift fix on iPhone 14 Pro 4G).
 *
 * Uses Python+fontTools (project precedent — see scripts/measure-anton-descriptors.mjs).
 * opentype.js 1.3.4 lacks woff2 support.
 */

import { execFileSync } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";

const JBM_WOFF2 = ".next/static/media/bb3ef058b751a6ad-s.p.woff2";
// Original transparent <tspan>による</tspan> contributed x-advance for layout.
// Visible English right edge sits at (ANCHOR_X - kana_run_width). Measured
// empirically against the live `<text>` element (chrome-devtools MCP getBBox
// on a temp SVG injected into the page DOM): tspan left edge = 153.71875 px,
// so kana offset = 192 - 153.71875 = 38.28125. Includes 3 kana advances + the
// inter-element letter-spacing between the text node and the tspan.
const KANA_SPACING_OFFSET = 38.28125;

if (!existsSync(JBM_WOFF2)) {
  console.error(
    `ERROR: JBM woff2 not found at ${JBM_WOFF2}. Run \`pnpm build\` to populate .next/static/media first.`
  );
  process.exit(1);
}

const pyScript = `
import json
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

font_path = "${JBM_WOFF2}"
text = "CULTURE DIVISION "
font_size = 11
letter_spacing = 1.76
weight = 700
anchor_x = 192
anchor_y = 33
kana_offset = ${KANA_SPACING_OFFSET}

font = TTFont(font_path)
instance = instantiateVariableFont(font, {"wght": weight})
upm = instance["head"].unitsPerEm
scale = font_size / upm
glyph_set = instance.getGlyphSet()
cmap = instance.getBestCmap()
hmtx = instance["hmtx"]

# First pass: compute total run width with letter-spacing applied AFTER
# every character (SVG <text letter-spacing> applies after each glyph
# including the last — verified empirically via getBBox on a temp <text>
# matching the original layout, total width matched advances + N letter-spacings,
# not advances + (N-1)*letter-spacings).
glyph_seq = []
x_cursor = 0
for char in text:
    cp = ord(char)
    if cp not in cmap:
        x_cursor += font_size * 0.6 + letter_spacing
        continue
    glyph_name = cmap[cp]
    advance, _lsb = hmtx[glyph_name]
    advance_px = advance * scale
    glyph_seq.append({"char": char, "name": glyph_name, "x_offset": x_cursor, "advance_px": advance_px})
    x_cursor += advance_px + letter_spacing
total_width = x_cursor
right_edge = anchor_x - kana_offset
left_edge = right_edge - total_width

# Second pass: emit each glyph through TransformPen → SVGPathPen.
# Affine matrix: [a, b, c, d, e, f] = [scale, 0, 0, -scale, tx, ty]
# (Y flip because font Y goes up, SVG Y goes down; baseline at anchor_y.)
final_parts = []
for g in glyph_seq:
    tx = left_edge + g["x_offset"]
    ty = anchor_y
    svg_pen = SVGPathPen(glyph_set)
    xform = (scale, 0, 0, -scale, tx, ty)
    xform_pen = TransformPen(svg_pen, xform)
    glyph_set[g["name"]].draw(xform_pen)
    final_parts.append(svg_pen.getCommands())

final_d = "".join(final_parts)

print(json.dumps({
    "path_d": final_d,
    "total_width_px": total_width,
    "left_edge": left_edge,
    "right_edge": right_edge,
    "scale": scale,
    "upm": upm,
    "glyph_count": len(glyph_seq),
}))
`;

const tmpFile = "/tmp/_vectorize-wordmark.py";
writeFileSync(tmpFile, pyScript);

let out;
try {
  out = execFileSync("python3", [tmpFile], { encoding: "utf-8", maxBuffer: 4 * 1024 * 1024 });
} catch (e) {
  console.error("FAILED running fontTools script:");
  console.error(e.stderr?.toString() || e.message);
  process.exit(1);
}

const result = JSON.parse(out);
console.log(JSON.stringify({
  glyph_count: result.glyph_count,
  total_width_px: result.total_width_px.toFixed(2),
  left_edge: result.left_edge.toFixed(2),
  right_edge: result.right_edge.toFixed(2),
  upm: result.upm,
  scale: result.scale.toFixed(6),
  path_d_length: result.path_d.length,
}, null, 2));
console.log("\n=== path d ===\n");
console.log(result.path_d);
