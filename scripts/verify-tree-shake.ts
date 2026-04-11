/**
 * Tree-shaking verification for SignalframeUX library build.
 * Confirms that the core entry point (dist/index.*) does NOT contain
 * static import/require references to gsap or three — these belong only
 * in animation/webgl entries.
 *
 * Dynamic imports (e.g. import('gsap') in signalframe-provider) are excluded
 * from the check — they are the safe optional-peer pattern.
 *
 * Run: npx tsx scripts/verify-tree-shake.ts
 * Or:  pnpm build:lib && npx tsx scripts/verify-tree-shake.ts
 */
import { readFileSync, existsSync } from "fs";

const CORE_ESM = "dist/index.mjs";
const CORE_CJS = "dist/index.cjs";
const ANIM_ESM = "dist/animation.mjs";
const WEBGL_ESM = "dist/webgl.mjs";

let failed = false;

function check(file: string, forbidden: string[], expected: string[]) {
  if (!existsSync(file)) {
    console.error(`FAIL: ${file} does not exist — run pnpm build:lib first`);
    failed = true;
    return;
  }
  const content = readFileSync(file, "utf8");

  for (const term of forbidden) {
    // Match static ESM: from 'gsap' or from 'gsap/ScrollTrigger'
    // Match static CJS: require('gsap') or require('gsap/...')
    // Excludes dynamic import('gsap') — that's the safe optional-peer pattern
    const staticImportPattern = new RegExp(
      `(from\\s+['"]${term}['"]|from\\s+['"]${term}/|require\\(\\s*['"]${term}['"]|require\\(\\s*['"]${term}/)`,
      "g"
    );
    if (staticImportPattern.test(content)) {
      console.error(`FAIL: ${file} contains static import of "${term}"`);
      failed = true;
    } else {
      console.log(`PASS: ${file} does not statically import "${term}"`);
    }
  }

  for (const term of expected) {
    const staticImportPattern = new RegExp(
      `(from\\s+['"]${term}['"]|from\\s+['"]${term}/|require\\(\\s*['"]${term}['"]|require\\(\\s*['"]${term}/)`,
      "g"
    );
    if (staticImportPattern.test(content)) {
      console.log(`PASS: ${file} correctly imports "${term}"`);
    } else {
      console.error(`FAIL: ${file} missing expected import of "${term}"`);
      failed = true;
    }
  }
}

console.log("=== SignalframeUX Tree-Shaking Verification ===\n");

// Core must NOT statically import gsap or three
check(CORE_ESM, ["gsap", "three"], []);
check(CORE_CJS, ["gsap", "three"], []);

// Animation MUST statically import gsap
check(ANIM_ESM, [], ["gsap"]);

// WebGL MUST statically import three
check(WEBGL_ESM, [], ["three"]);

console.log("");

if (failed) {
  console.error("RESULT: FAIL — tree-shaking verification failed");
  process.exit(1);
} else {
  console.log("RESULT: PASS — all entry points correctly isolated");
  process.exit(0);
}
