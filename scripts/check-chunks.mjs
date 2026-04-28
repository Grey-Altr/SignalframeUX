// Phase 63.1 Plan 01 Wave 0 — guards D-04 chunk-ID lock per CONTEXT.md
// Asserts the post-Phase-61 stable chunk IDs are still emitted in
// .next/static/chunks/ after any bundle-touching change.
// Exit 0 = all present; Exit 1 = one or more missing (D-04 BLOCKER).
//
// RATIFICATION NOTE (2026-04-28, feedback_ratify_reality_bias.md):
// The original D-04 spec cited 4 v1.7 chunk IDs: 3302, e9a6067a, 74c6194b, 7525.
// Phase 61 Plan 01 Build A (2026-04-26T20:11Z) documented that chunk 3302
// DISAPPEARED when "radix-ui" was added to optimizePackageImports — the Radix
// barrel rewrite split it into smaller per-sub-package chunks (primary successor:
// 4335). This was Phase 61's intended outcome (BND-02 − 16 KB on /).
// The D-04 spec was written at Phase 57 DGN-02 capture time and was never updated
// to reflect the Phase 61 post-ship state. Per feedback_ratify_reality_bias.md
// (three-question test: is the older value still actionable? no. is reality
// working? yes, 264 KB on / confirmed. is there regression evidence? no) —
// ratify reality.
//
// Stable IDs at Phase 63.1 Plan 01 start (post-Phase-61, post-Phase-62):
//   3302     → GONE (dissolved by radix-ui optimizer, replaced by 4335 cluster)
//   4335     → successor to 3302 (Radix sub-package aggregate post-optimizer)
//   e9a6067a → three.js chunk #1 (async via signal-canvas-lazy)
//   74c6194b → three.js chunk #2 (async via signal-canvas-lazy)
//   7525     → @radix-ui/react-popper cluster (hash changes but prefix stable)

import { readdirSync } from "node:fs";
import { join } from "node:path";

const CHUNKS_DIR = join(process.cwd(), ".next", "static", "chunks");

// Phase 63.1 Plan 01 stable chunk ID set — ratified from Phase 61 post-ship state.
// Patterns match the stable prefix portion of each filename; content-hash suffix varies.
const EXPECTED = {
  "4335":     /^4335-[a-f0-9]+\.js$/,  // Radix sub-package aggregate (successor to 3302)
  "e9a6067a": /^e9a6067a\.[a-f0-9]+\.js$/,  // three.js chunk #1
  "74c6194b": /^74c6194b\.[a-f0-9]+\.js$/,  // three.js chunk #2
  "7525":     /^7525-[a-f0-9]+\.js$/,        // @radix-ui/react-popper cluster
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
    "\nD-04 VIOLATION: One or more Phase 63.1 stable chunk IDs are missing.\n" +
    "This means next/dynamic or optimizePackageImports changes have re-split\n" +
    "the chunk graph. Investigate before shipping. See CONTEXT.md §D-04 and\n" +
    "61-01-RESEARCH-LOG.md §Build A for the ratification history."
  );
  process.exit(1);
}

console.log("\nAll Phase 63.1 stable chunk IDs verified present.");
process.exit(0);
