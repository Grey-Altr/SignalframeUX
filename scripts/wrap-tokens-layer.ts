/**
 * wrap-tokens-layer.ts
 *
 * Reads lib/tokens.css and outputs dist/signalframeux.css with:
 * - @theme inline blocks preserved OUTSIDE @layer (Tailwind compile-time directive)
 * - @custom-variant blocks preserved OUTSIDE @layer
 * - :root and .dark blocks wrapped INSIDE @layer signalframeux { }
 *
 * This enables consumer CSS cascade override:
 *   Load signalframeux.css (layered) first, then your overrides (unlayered).
 *   Unlayered CSS always beats @layer declarations — no !important needed.
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";

const LAYER_NAME = "signalframeux";
const INPUT_PATH = "lib/tokens.css";
const OUTPUT_PATH = "dist/signalframeux.css";

function wrapTokensInLayer(css: string, layerName: string): string {
  const lines = css.split("\n");
  const outsideLayer: string[] = []; // @theme, @custom-variant, comments, imports
  const insideLayer: string[] = [];  // :root and .dark blocks

  let i = 0;

  // Header comment block (lines before first @theme or :root)
  // We'll collect everything in pass order

  type BlockType = "theme" | "custom-variant" | "root" | "dark" | "other";

  interface Block {
    type: BlockType;
    lines: string[];
  }

  const blocks: Block[] = [];
  let currentBlock: Block | null = null;
  let braceDepth = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Count braces to track depth
    // Only count when we're inside a block
    if (currentBlock) {
      // Add line to current block
      currentBlock.lines.push(line);

      // Update brace depth
      for (const ch of line) {
        if (ch === "{") braceDepth++;
        else if (ch === "}") braceDepth--;
      }

      // If brace depth returns to 0, block is complete
      if (braceDepth === 0) {
        blocks.push(currentBlock);
        currentBlock = null;
      }

      i++;
      continue;
    }

    // Not inside a block — detect block start or pass-through lines
    if (trimmed.startsWith("@theme")) {
      currentBlock = { type: "theme", lines: [line] };
      braceDepth = 0;
      for (const ch of line) {
        if (ch === "{") braceDepth++;
        else if (ch === "}") braceDepth--;
      }
      // If braceDepth is already 0 after first line (shouldn't happen for @theme but be safe)
      if (braceDepth === 0 && line.includes("{")) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      i++;
      continue;
    }

    if (trimmed.startsWith("@custom-variant")) {
      currentBlock = { type: "custom-variant", lines: [line] };
      braceDepth = 0;
      for (const ch of line) {
        if (ch === "{") braceDepth++;
        else if (ch === "}") braceDepth--;
      }
      if (braceDepth === 0) {
        // Single-line or no-brace variant (e.g. @custom-variant dark (&:is(.dark *));)
        blocks.push(currentBlock);
        currentBlock = null;
      }
      i++;
      continue;
    }

    if (trimmed.startsWith(":root")) {
      currentBlock = { type: "root", lines: [line] };
      braceDepth = 0;
      for (const ch of line) {
        if (ch === "{") braceDepth++;
        else if (ch === "}") braceDepth--;
      }
      if (braceDepth === 0 && line.includes("{")) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      i++;
      continue;
    }

    if (trimmed.startsWith(".dark")) {
      currentBlock = { type: "dark", lines: [line] };
      braceDepth = 0;
      for (const ch of line) {
        if (ch === "{") braceDepth++;
        else if (ch === "}") braceDepth--;
      }
      if (braceDepth === 0 && line.includes("{")) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      i++;
      continue;
    }

    // Pass-through line (comments, blank lines, @import, etc.)
    blocks.push({ type: "other", lines: [line] });
    i++;
  }

  // Collect :root and .dark blocks to wrap in @layer
  const layerBlocks: string[][] = [];
  const outputParts: string[] = [];

  for (const block of blocks) {
    if (block.type === "root" || block.type === "dark") {
      layerBlocks.push(block.lines);
    } else {
      // Flush any pending layer blocks before emitting outside-layer content
      // (but only if we have them and are about to emit something non-layer)
      // Actually: collect all root/dark together, emit @layer at the end
      outputParts.push({ ...block, isOutside: true } as unknown as string);
    }
  }

  // Build output string
  let output = "";
  const layerBlocksEmitted = new Set<number>();
  let layerEmitted = false;

  // Two-pass: first collect outside blocks, then decide where to insert @layer
  const outsideBlocks: Block[] = [];
  const layerBlocksList: Block[] = [];

  for (const block of blocks) {
    if (block.type === "root" || block.type === "dark") {
      layerBlocksList.push(block);
    } else {
      outsideBlocks.push(block);
    }
  }

  // Emit all outside-layer content first
  for (const block of outsideBlocks) {
    output += block.lines.join("\n") + (block.lines.length > 0 ? "\n" : "");
  }

  // Then emit @layer wrapper with all :root and .dark blocks
  if (layerBlocksList.length > 0) {
    output += `\n@layer ${layerName} {\n`;
    for (const block of layerBlocksList) {
      // Indent each line by 2 spaces for readability
      for (const line of block.lines) {
        if (line.trim() === "") {
          output += "\n";
        } else {
          output += "  " + line + "\n";
        }
      }
    }
    output += "}\n";
  }

  return output;
}

// Ensure dist/ directory exists
mkdirSync(dirname(OUTPUT_PATH), { recursive: true });

const src = readFileSync(INPUT_PATH, "utf-8");
const output = wrapTokensInLayer(src, LAYER_NAME);
writeFileSync(OUTPUT_PATH, output, "utf-8");

console.log(`✓ dist/signalframeux.css written with @layer ${LAYER_NAME} wrapping :root and .dark blocks`);
