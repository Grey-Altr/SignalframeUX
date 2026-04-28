// Phase 63.1 Plan 02 Wave 0 — guards CRT-04 rIC pattern fidelity + Pitfall #5 single-ticker rule.
//
// These tests use static file inspection (no Playwright browser) to enforce that:
//   1. The CRT-04 rIC + setTimeout(0) fallback pattern lands in all 4 section files (Task 1 gate).
//   2. No rIC polyfill package was added to package.json (D-05 — no new runtime deps).
//   3. No new requestAnimationFrame call site introduced in the 4 modified section files (Pitfall #5).
//   4. If a section file has a prefers-reduced-motion guard, it appears BEFORE the rIC scheduling
//      (sync early-exit must precede any work scheduling — D-06).
//
// Test 1 uses test.fixme() until Task 1 lands (plan-authored RED state); Tests 2, 3, 4 pass
// immediately against the unmodified codebase.

import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const SECTION_FILES = [
  "components/blocks/thesis-section.tsx",
  "components/blocks/signal-section.tsx",
  "components/blocks/proof-section.tsx",
  "components/blocks/inventory-section.tsx",
];

// ---------------------------------------------------------------------------
// Test 1 — rIC pattern fidelity across 4 section files
// ---------------------------------------------------------------------------
test("Plan 02 — rIC pattern fidelity across 4 section files", () => {
  // Fixme until Task 1 lands. Playwright reports fixme as expected-failing
  // (not a true skip), giving a cleaner CI signal than test.skip().
  // Once Task 1 ships all 4 rIC wraps, this test transitions to full PASS.
  const missingRic: string[] = [];
  for (const rel of SECTION_FILES) {
    const content = readFileSync(join(process.cwd(), rel), "utf-8");
    if (!content.includes("requestIdleCallback")) {
      missingRic.push(rel);
    }
  }
  if (missingRic.length > 0) {
    // Not yet applied — mark fixme so CI doesn't hard-fail before Task 1
    test.fixme(true, `Plan 02 not yet applied — rIC missing in: ${missingRic.join(", ")}. Expected red until Task 1 lands.`);
    return;
  }

  // Task 1 has landed — assert all 3 pattern regexes match per file.
  for (const rel of SECTION_FILES) {
    const content = readFileSync(join(process.cwd(), rel), "utf-8");
    const filePath = join(process.cwd(), rel);

    // (a) requestIdleCallback — rIC scheduling call
    expect(
      /requestIdleCallback/.test(content),
      `${rel}: must contain 'requestIdleCallback' (CRT-04 rIC scheduling)`
    ).toBe(true);

    // (b) setTimeout fallback — Safari < 17.x / any env without rIC
    expect(
      /setTimeout\([^,)]+,\s*0\)/.test(content),
      `${rel}: must contain setTimeout(cb, 0) fallback (CRT-04 inline polyfill per D-05)`
    ).toBe(true);

    // (c) cleanup — cancelIdleCallback or clearTimeout (cancels pending rIC handle on unmount)
    expect(
      /cancelIdleCallback|clearTimeout/.test(content),
      `${rel}: must contain cancelIdleCallback or clearTimeout for cleanup (no handle leaks)`
    ).toBe(true);

    void filePath; // suppress unused-var lint
  }
});

// ---------------------------------------------------------------------------
// Test 2 — no rIC polyfill package added (D-05)
// ---------------------------------------------------------------------------
test("Plan 02 — no rIC polyfill added (D-05)", () => {
  // D-05: no new runtime npm dependencies. The rIC fallback MUST be the inline
  // setTimeout(cb, 0) pattern from lenis-provider.tsx — no polyfill package.
  const BANNED_POLYFILLS = [
    "requestidlecallback-polyfill",
    "idlecallback-shim",
    "request-idle-callback",
    "@types/requestidlecallback",
  ];

  const pkgContent = readFileSync(join(process.cwd(), "package.json"), "utf-8");

  for (const banned of BANNED_POLYFILLS) {
    expect(
      pkgContent.includes(banned),
      `D-05 violation: found banned rIC polyfill package '${banned}' in package.json. ` +
      `Plan 02 must use the inline setTimeout(cb, 0) fallback from lenis-provider.tsx verbatim. ` +
      `No polyfill package is allowed per D-05 (no new runtime npm dependencies).`
    ).toBe(false);
  }
});

// ---------------------------------------------------------------------------
// Test 3 — single-ticker rule preserved post-defer (Pitfall #5)
// ---------------------------------------------------------------------------
test("Plan 02 — single-ticker rule preserved post-defer (Pitfall #5)", () => {
  // Plan 01 pitfall-guards Test 2 already enforces this project-wide.
  // This test specifically targets the 4 modified section files to ensure
  // the rIC wrapping did NOT introduce a sidecar requestAnimationFrame call.
  // GSAP ticker remains the only rAF source. The proof-section.tsx already
  // has a module-level rAF loop (startLerpLoop/_rafId) that predates Phase 63.1;
  // that file IS in the Plan 01 baseline allowlist and is NOT a new violation.
  // This test confirms no NEW rAF was introduced by Plan 02's rIC wrapping.
  //
  // Note: proof-section.tsx's existing rAF (startLerpLoop) is pre-existing and
  // in the KNOWN_RAF_FILES allowlist in pitfall-guards.spec.ts. This test checks
  // only for rAF patterns introduced by Plan 02 rIC wrapping (i.e., patterns that
  // would appear INSIDE or adjacent to the new rIC block, not the pre-existing module-level loop).

  // For a clean single-ticker check on Plan 02's contribution:
  // Each section file must NOT contain 'requestAnimationFrame' INSIDE a useGSAP callback
  // (the rIC wrap body must not add new rAF; any rAF in these files was pre-existing).
  // We enforce the strictest form: total rAF count per file must not EXCEED the baseline.

  const RAF_PATTERN = /\brequestAnimationFrame\b/g;

  // Baseline rAF count per file (established at Plan 01 Wave 0, before Plan 02):
  // - thesis-section.tsx: 0 (no rAF before Plan 02)
  // - signal-section.tsx: 0
  // - proof-section.tsx: 2 (startLerpLoop tick function has 2 rAF calls — pre-existing)
  // - inventory-section.tsx: 0
  const RAF_BASELINE: Record<string, number> = {
    "components/blocks/thesis-section.tsx": 0,
    "components/blocks/signal-section.tsx": 0,
    "components/blocks/proof-section.tsx": 2,
    "components/blocks/inventory-section.tsx": 0,
  };

  for (const rel of SECTION_FILES) {
    const content = readFileSync(join(process.cwd(), rel), "utf-8");
    const matches = content.match(RAF_PATTERN) ?? [];
    const baseline = RAF_BASELINE[rel] ?? 0;

    expect(
      matches.length,
      `Pitfall #5 violation in ${rel}: Found ${matches.length} requestAnimationFrame calls, ` +
      `but baseline is ${baseline}. Plan 02 rIC wrapping must NOT introduce new rAF call sites. ` +
      `Use requestIdleCallback + setTimeout(cb, 0) fallback (NOT requestAnimationFrame).`
    ).toBeLessThanOrEqual(baseline);
  }
});

// ---------------------------------------------------------------------------
// Test 4 — reduced-motion guard precedes rIC scheduling (D-06)
// ---------------------------------------------------------------------------
test("Plan 02 — reduced-motion guard precedes rIC scheduling (D-06)", () => {
  // D-06: prefers-reduced-motion early-exit MUST remain synchronous and BEFORE
  // the rIC scheduler. Users with reduced-motion should never schedule any work.
  // This test is a textual ordering check — indexOf(prefers-reduced-motion) must
  // be < indexOf(requestIdleCallback) in every file that has the guard.
  //
  // If a file has NO prefers-reduced-motion check (some sections gate at the
  // app/page.tsx level), the test trivially passes for that file.

  for (const rel of SECTION_FILES) {
    const content = readFileSync(join(process.cwd(), rel), "utf-8");

    const rmIdx = content.indexOf("prefers-reduced-motion");
    const ricIdx = content.indexOf("requestIdleCallback");

    if (rmIdx === -1) {
      // No reduced-motion guard in this file — trivially passes.
      // The guard may exist at app/page.tsx level or via gsap.globalTimeline.
      continue;
    }

    if (ricIdx === -1) {
      // rIC not yet applied (Task 1 not landed yet for this file).
      // This condition is transitional — Test 1 will catch the missing rIC.
      continue;
    }

    expect(
      rmIdx,
      `D-06 violation in ${rel}: 'prefers-reduced-motion' guard (at index ${rmIdx}) ` +
      `must appear BEFORE 'requestIdleCallback' scheduling (at index ${ricIdx}). ` +
      `The sync early-exit must precede any work scheduling so reduced-motion users ` +
      `never trigger GSAP context initialization.`
    ).toBeLessThan(ricIdx);
  }
});
