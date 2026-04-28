// Phase 63.1 Plan 01 Wave 0 — guards D-04 chunk-ID lock per CONTEXT.md
// Asserts the 4 v1.7 named chunk IDs (3302, e9a6067a, 74c6194b, 7525) are
// still emitted in .next/static/chunks/ after any bundle-touching change.
// Exit 0 = all present; Exit 1 = one or more missing (D-04 BLOCKER).

import { readdirSync } from "node:fs";
import { join } from "node:path";

const CHUNKS_DIR = join(process.cwd(), ".next", "static", "chunks");

// Patterns per DGN-02 §2a — filename format varies by chunk split strategy.
const EXPECTED = {
  "3302":     /^3302-[a-f0-9]+\.js$/,
  "e9a6067a": /^e9a6067a\.[a-f0-9]+\.js$/,
  "74c6194b": /^74c6194b\.[a-f0-9]+\.js$/,
  "7525":     /^7525-[a-f0-9]+\.js$/,
};

let files;
try {
  files = readdirSync(CHUNKS_DIR);
} catch (err) {
  console.error(`ERROR: Cannot read ${CHUNKS_DIR} — run 'pnpm build' first.`);
  process.exit(1);
}

const found = {};
let missing = false;

for (const [id, pattern] of Object.entries(EXPECTED)) {
  const match = files.find((f) => pattern.test(f));
  if (match) {
    found[id] = match;
  } else {
    console.error(`Missing chunk: ${id} (pattern: ${pattern})`);
    missing = true;
  }
}

console.log(JSON.stringify(found, null, 2));

if (missing) {
  console.error(
    "\nD-04 VIOLATION: One or more v1.7 named chunk IDs are missing.\n" +
    "This is a D-04 blocker — do NOT ship. Investigate which dynamic-import\n" +
    "boundary changed the chunk graph. See CONTEXT.md §D-04."
  );
  process.exit(1);
}

console.log("\nAll 4 v1.7 named chunk IDs verified present.");
process.exit(0);
