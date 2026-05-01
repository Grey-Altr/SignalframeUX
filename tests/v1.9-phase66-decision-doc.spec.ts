// Phase 66 Plan 01 Wave 0 — ARC-01 decision-doc schema gate.
//
// Asserts the existence + content shape of `.planning/codebase/scale-canvas-track-b-decision.md`
// — the architectural decision artifact that locks the ScaleCanvas Track B
// mechanism choice (Pillarbox per RESEARCH §3d) before Plan 02 implements
// against it. Threat T-66-01: a future tamperer who edits the doc to claim
// a different mechanism trips this test on the next PR. Branch protection
// (Phase 64) requires PR review; commit signing in effect.
//
// Pattern source: tests/v1.8-phase63-1-bundle-budget.spec.ts (light fs-based
// schema test, runs in the existing chromium project alongside Playwright
// pixel-diff specs). NOT Vitest — phase 66 spec set is unified Playwright per
// 66-VALIDATION.md.
//
// Test surface:
//   1. file presence + non-empty (>1024 bytes)
//   2. mechanism heading literal — "## Mechanism Selected: Pillarbox"
//   3. CRT critique convention heading — "## 6-Pillar Visual Audit"
//   4. file:line evidence — "components/layout/scale-canvas.tsx:42-83"
//   5. file:line evidence — "app/globals.css:2770-2774"
//   6. file:line evidence — "app/layout.tsx:117"
//   7. alternative-rejection sections — Counter-scale + Portal both
//      under headings matching `## Counter-scale ... Rejected` etc.
//
// Run: pnpm exec playwright test tests/v1.9-phase66-decision-doc.spec.ts --project=chromium

import { test, expect } from "@playwright/test";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const DOC_PATH = join(
  process.cwd(),
  ".planning/codebase/scale-canvas-track-b-decision.md"
);

test.describe("@v1.9-phase66 ARC-01 decision-doc schema gate", () => {
  test("decision-doc exists at .planning/codebase/", () => {
    expect(existsSync(DOC_PATH), `expected file at ${DOC_PATH}`).toBe(true);
    expect(statSync(DOC_PATH).size).toBeGreaterThan(1024);
  });

  test("decision-doc declares mechanism = Pillarbox", () => {
    const contents = readFileSync(DOC_PATH, "utf-8");
    expect(contents).toContain("## Mechanism Selected: Pillarbox");
  });

  test("decision-doc contains 6-Pillar Visual Audit section", () => {
    const contents = readFileSync(DOC_PATH, "utf-8");
    expect(contents).toContain("## 6-Pillar Visual Audit");
  });

  test("decision-doc cites scale-canvas.tsx applyScale file:line", () => {
    const contents = readFileSync(DOC_PATH, "utf-8");
    expect(contents).toContain("components/layout/scale-canvas.tsx:42-83");
  });

  test("decision-doc cites globals.css transform rule file:line", () => {
    const contents = readFileSync(DOC_PATH, "utf-8");
    expect(contents).toContain("app/globals.css:2770-2774");
  });

  test("decision-doc cites layout.tsx scaleScript file:line", () => {
    const contents = readFileSync(DOC_PATH, "utf-8");
    expect(contents).toContain("app/layout.tsx:117");
  });

  test("decision-doc rejects counter-scale + portal alternatives", () => {
    const contents = readFileSync(DOC_PATH, "utf-8");
    expect(contents).toMatch(/##\s+Counter-scale.*Rejected/i);
    expect(contents).toMatch(/##\s+Portal.*Rejected/i);
  });
});
