// Phase 63.1 Plan 01 Wave 0 — cross-plan static pitfall guard gates.
// These tests use static file inspection (no browser required) to enforce the
// four active pitfall guardrails that Phase 63.1 must not regress.
// Guards are SHARED — Plans 02 and 03 will re-run this same spec.
//
// Pitfall #2/#8 — canvasSyncScript inline IIFE (never defer/async/strategy=...)
// Pitfall #5    — single-ticker rule (no new requestAnimationFrame call sites)
// Pitfall #7    — no experimental.inlineCss (never true)
// Pitfall #7c   — @layer signalframeux cascade preserved in dist/signalframeux.css
//
// Static literal IIFE posture is XSS-safe by construction — same posture as
// themeScript and scaleScript in app/layout.tsx; see header comment at line 102.
// This spec enforces that no future migration violates Pitfalls #2/#8.

import { test, expect } from "@playwright/test";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

// ---------------------------------------------------------------------------
// Pitfall #2/#8 — canvasSyncScript inline IIFE pattern preserved
// ---------------------------------------------------------------------------
test("Pitfall #2/#8 — canvas-sync inline pattern preserved", () => {
  // Static literal IIFE, XSS-safe by construction — see app/layout.tsx:119-128
  // header comment. This gate ensures no future migration to defer/async/strategy=
  // violates Pitfalls #2 (CLS regression) and #8 (next/script order drift).
  const layoutPath = join(process.cwd(), "app", "layout.tsx");
  const content = readFileSync(layoutPath, "utf-8");

  // (a) canvasSyncScript must appear in the layout file.
  expect(content, "canvasSyncScript should be defined as an inline IIFE string")
    .toContain("canvasSyncScript");

  // Verify the script is mounted as an inline script (not via src= attribute).
  // We look for the script variable reference near __html (inline pattern).
  const inlineMount = content.match(/__html:\s*canvasSyncScript/);
  expect(
    inlineMount,
    "canvasSyncScript must be mounted as inline __html (not <script src=...>)"
  ).not.toBeNull();

  // (b) No defer/async/strategy= attributes on any script tag.
  // These attributes on canvasSyncScript would migrate it from sync to
  // post-first-paint execution, reintroducing the CLS Pitfall #2 describes.
  const scriptTagsWithBannedAttrs = content.match(/<script[^>]*\b(defer|async|strategy=)[^>]*>/g);
  expect(
    scriptTagsWithBannedAttrs,
    `Found script tag(s) with defer/async/strategy= attributes: ` +
    `${JSON.stringify(scriptTagsWithBannedAttrs)}. ` +
    `canvasSyncScript MUST remain an inline synchronous script — ` +
    `never next/script strategy="beforeInteractive" (Pitfall #8) or defer/async (Pitfall #2).`
  ).toBeNull();
});

// ---------------------------------------------------------------------------
// Pitfall #5 — single-ticker rule: no new requestAnimationFrame call sites
// ---------------------------------------------------------------------------
test("Pitfall #5 — single-ticker rule: no new rAF call sites vs baseline", () => {
  // The pre-existing rAF call-site baseline established at Phase 63.1 Plan 01
  // Wave 0. Any file NOT in this list that gains a requestAnimationFrame call
  // is a Pitfall #5 violation (new ticker introduced outside GSAP/Lenis).
  //
  // Rationale: this codebase has many pre-existing rAF sites that predate
  // the single-ticker policy (they are not GSAP-routed). The policy does not
  // require eliminating them retroactively; it requires that Plan 01/02/03
  // do NOT ADD NEW ones. The allowlist is the Phase 63.1 Wave 0 snapshot.
  const KNOWN_RAF_FILES = new Set([
    "components/animation/audio-reactive-modulator.tsx",
    "components/animation/build-sigil-diagram.tsx",
    "components/animation/canvas-cursor.tsx",
    "components/animation/hero-mesh.tsx",
    "components/animation/logo-draw.tsx",
    "components/animation/magnetic.tsx",
    "components/animation/particle-field-hq.tsx",
    "components/animation/particle-field.tsx",
    "components/animation/token-viz.tsx",
    "components/animation/xray-reveal.tsx",
    "components/blocks/api-aux-panel.tsx",
    "components/blocks/api-index-panel.tsx",
    "components/blocks/components-explorer.tsx",
    "components/blocks/manifesto-band.tsx",
    "components/blocks/proof-section.tsx",
    "components/dossier/iris-cloud-worker.ts",
    "components/dossier/pointcloud-ring-worker.ts",
    "components/layout/dark-mode-toggle.tsx",
    "components/layout/global-effects.tsx",
    "components/layout/instrument-hud.tsx",
    "components/layout/live-clock.tsx",
    "components/layout/logo-mark.tsx",
    "components/layout/nav.tsx",
    "components/layout/panel-height-assertion.tsx",
    "components/layout/scale-canvas.tsx",
    "lib/signal-canvas.tsx",
  ]);

  // Directories to scan for new rAF call sites.
  const SCAN_DIRS = ["components", "lib", "app"];
  const RAF_PATTERN = /\brequestAnimationFrame\b/;

  const violations: string[] = [];

  function scanDir(dir: string) {
    const { readdirSync, statSync } = require("node:fs");
    let entries: string[];
    try {
      entries = readdirSync(dir);
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      let stat;
      try {
        stat = statSync(fullPath);
      } catch {
        continue;
      }
      if (stat.isDirectory()) {
        // Skip node_modules and .next
        if (entry === "node_modules" || entry === ".next" || entry === ".git") continue;
        scanDir(fullPath);
      } else if (entry.match(/\.(ts|tsx|js|jsx|mjs)$/)) {
        const relPath = fullPath.replace(process.cwd() + "/", "");
        try {
          const content = readFileSync(fullPath, "utf-8");
          if (RAF_PATTERN.test(content) && !KNOWN_RAF_FILES.has(relPath)) {
            violations.push(relPath);
          }
        } catch {
          // skip unreadable files
        }
      }
    }
  }

  for (const d of SCAN_DIRS) {
    scanDir(join(process.cwd(), d));
  }

  expect(
    violations,
    `Pitfall #5 violation: New requestAnimationFrame call sites introduced outside the ` +
    `Phase 63.1 Wave 0 baseline. All deferred work must route through gsap.ticker.add() ` +
    `or gsap.delayedCall() to preserve the single-ticker rule. New violations:\n` +
    violations.join("\n")
  ).toHaveLength(0);
});

// ---------------------------------------------------------------------------
// Pitfall #7 — no experimental.inlineCss: true
// ---------------------------------------------------------------------------
test("Pitfall #7 — no inlineCss flag in next.config.ts", () => {
  const configPath = join(process.cwd(), "next.config.ts");
  const content = readFileSync(configPath, "utf-8");

  // inlineCss: true breaks @layer signalframeux cascade ordering.
  // vercel/next.js#47585 — open issue; Next team says not production-ready.
  const match = content.match(/inlineCss\s*:\s*true/);
  expect(
    match,
    `Pitfall #7 violation: experimental.inlineCss: true detected in next.config.ts. ` +
    `This breaks the @layer signalframeux cascade — consumer CSS overrides lose precedence ` +
    `(magenta flash, shifted --sfx-* tokens). NEVER enable this flag. See PITFALLS.md §7.`
  ).toBeNull();
});

// ---------------------------------------------------------------------------
// Pitfall #7 corollary — @layer signalframeux cascade preserved
// ---------------------------------------------------------------------------
test("Pitfall #7 corollary — @layer signalframeux preserved in dist/signalframeux.css", () => {
  // The @layer signalframeux declaration lives in dist/signalframeux.css
  // (the distributable artifact), not app/globals.css. This gate confirms
  // the layer is still present after any build-touching changes.
  //
  // Secondary check: also scan app/globals.css for any signalframeux layer
  // reference (consumers may import from both paths).
  const distCssPath = join(process.cwd(), "dist", "signalframeux.css");
  const globalsCssPath = join(process.cwd(), "app", "globals.css");

  const layerPattern = /@layer\s+signalframeux/;

  let found = false;

  if (existsSync(distCssPath)) {
    const distContent = readFileSync(distCssPath, "utf-8");
    if (layerPattern.test(distContent)) found = true;
  }

  if (!found && existsSync(globalsCssPath)) {
    const globalsContent = readFileSync(globalsCssPath, "utf-8");
    if (layerPattern.test(globalsContent)) found = true;
  }

  expect(
    found,
    `Pitfall #7 corollary violation: @layer signalframeux not found in ` +
    `dist/signalframeux.css or app/globals.css. ` +
    `The cascade layer declaration must be present for consumer overrides to work correctly. ` +
    `Check if the dist build was run (pnpm build:lib or similar) and the layer is not stripped.`
  ).toBe(true);
});
