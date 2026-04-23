/**
 * §14.18 · Authoring invariant: every API_DOCS entry's EntryDataSheet
 * must fit one port (~650px at default fluid type). This script estimates
 * sheet height deterministically and fails if any entry overflows.
 *
 * Run: pnpm audit:detail-size
 */
import { API_DOCS } from "../lib/api-docs";

const LIMIT_PX = 650;
const CHAR_PER_LINE = 72;

const DESC_LINE_PX = 28;
const IMPORT_BLOCK_PX = 72;
const PROPS_HEADER_PX = 36;
const PROPS_ROW_PX = 28;
const USAGE_HEADER_PX = 36;
const USAGE_BLOCK_PX = 120;
const A11Y_HEADER_PX = 36;
const A11Y_ROW_PX = 24;
const SECTION_GAP_PX = 32;

function estimate(docId: string): { px: number; breakdown: Record<string, number> } {
  const doc = API_DOCS[docId];
  const descLines = Math.max(1, Math.ceil(doc.description.length / CHAR_PER_LINE));
  const descPx = descLines * DESC_LINE_PX;
  const propsPx = doc.props.length > 0 ? PROPS_HEADER_PX + doc.props.length * PROPS_ROW_PX : 0;
  const usagePx = doc.usage.length > 0 ? USAGE_HEADER_PX + doc.usage.length * USAGE_BLOCK_PX : 0;
  const a11yPx = doc.a11y.length > 0 ? A11Y_HEADER_PX + doc.a11y.length * A11Y_ROW_PX : 0;
  const sections = [descPx, IMPORT_BLOCK_PX, propsPx, usagePx, a11yPx].filter((p) => p > 0);
  const gaps = Math.max(0, sections.length - 1) * SECTION_GAP_PX;
  const px = sections.reduce((a, b) => a + b, 0) + gaps;
  return { px, breakdown: { descPx, IMPORT_BLOCK_PX, propsPx, usagePx, a11yPx, gaps } };
}

let violations = 0;
for (const id of Object.keys(API_DOCS)) {
  const { px, breakdown } = estimate(id);
  if (px > LIMIT_PX) {
    violations += 1;
    console.error(`[§14.18 overflow] ${id}: ${px}px > ${LIMIT_PX}px limit`, breakdown);
  }
}

if (violations > 0) {
  console.error(`\n${violations} entries exceed the one-port detail budget.`);
  process.exit(1);
}

console.log(`✓ §14.18 — all ${Object.keys(API_DOCS).length} entries fit one port (≤ ${LIMIT_PX}px).`);
