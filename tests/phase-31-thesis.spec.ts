/**
 * Phase 31 — THESIS Section
 * Plan 01 adds TH-05 content-coverage tests that read the manifesto source file.
 * Plan 02 extends this file with TH-01, TH-02, TH-03, TH-04, TH-06 browser-level tests.
 *
 * Source-level tests use fs.readFileSync matching the Phase 29 pattern.
 * Browser tests require the dev server on http://localhost:3000 (Phase 30 homepage must be rendered).
 */
import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const MANIFESTO_PATH = path.resolve(ROOT, "lib/thesis-manifesto.ts");

const HEDGE_PATTERN = /\b(might|could|perhaps|probably|maybe|tends|somewhat)\b/i;

test.describe("Phase 31: THESIS Section", () => {
  // ── TH-05: Manifesto content coverage (source-file grep) ──────────────────

  test("TH-05: manifesto file exists and exports typed interfaces", () => {
    const src = fs.readFileSync(MANIFESTO_PATH, "utf-8");
    expect(src).toContain("export type ManifestoSize");
    expect(src).toContain("export type ManifestoPillar");
    expect(src).toContain("export interface ManifestoAnchor");
    expect(src).toContain("export interface ManifestoStatementData");
    expect(src).toContain("export const THESIS_MANIFESTO");
  });

  test("TH-05: manifesto contains exactly 6 statements", () => {
    const src = fs.readFileSync(MANIFESTO_PATH, "utf-8");
    // Slice to the array literal so comment/type uses of `text:` do not leak in
    const arrayStart = src.indexOf("THESIS_MANIFESTO");
    expect(arrayStart).toBeGreaterThan(-1);
    const arraySlice = src.slice(arrayStart);
    const textMatches = arraySlice.match(/\btext:\s*"/g) ?? [];
    expect(textMatches.length).toBe(6);
  });

  test("TH-05: every statement is an anchor (all 6)", () => {
    const src = fs.readFileSync(MANIFESTO_PATH, "utf-8");
    const anchorMatches = src.match(/size:\s*"anchor"/g) ?? [];
    expect(anchorMatches.length).toBe(6);
  });

  test("TH-05: manifesto covers all three TH-05 required pillars", () => {
    const src = fs.readFileSync(MANIFESTO_PATH, "utf-8");
    // TH-05 requires (a) SIGNAL/FRAME thesis, (b) Enhanced Flat Design, (c) cybernetic biophilia
    expect(src).toMatch(/pillar:\s*"signal-frame"/);
    expect(src).toMatch(/pillar:\s*"enhanced-flat"/);
    expect(src).toMatch(/pillar:\s*"biophilia"/);
  });

  test("TH-05: manifesto text contains no hedge words", () => {
    const src = fs.readFileSync(MANIFESTO_PATH, "utf-8");
    const textLiterals = Array.from(
      src.matchAll(/\btext:\s*"([^"]+)"/g),
      (m) => m[1],
    );
    expect(textLiterals.length).toBe(6);
    for (const literal of textLiterals) {
      expect(
        literal,
        `Statement "${literal}" contains a hedge word`,
      ).not.toMatch(HEDGE_PATTERN);
    }
  });

  test("TH-05: every statement is 2-8 words", () => {
    const src = fs.readFileSync(MANIFESTO_PATH, "utf-8");
    const textLiterals = Array.from(
      src.matchAll(/\btext:\s*"([^"]+)"/g),
      (m) => m[1],
    );
    for (const literal of textLiterals) {
      const wordCount = literal.trim().split(/\s+/).length;
      expect(
        wordCount,
        `Statement "${literal}" has ${wordCount} words`,
      ).toBeGreaterThanOrEqual(2);
      expect(
        wordCount,
        `Statement "${literal}" has ${wordCount} words`,
      ).toBeLessThanOrEqual(8);
    }
  });

  test("TH-05: SIGNAL/FRAME ordering — no FRAME-first slash usage", () => {
    const src = fs.readFileSync(MANIFESTO_PATH, "utf-8");
    // Forbidden slash/joiner patterns (paired-clause sentences like
    // "THE FRAME HOLDS. THE SIGNAL MOVES." are wiki-locked exceptions)
    expect(src).not.toMatch(/FRAME\/SIGNAL/);
    expect(src).not.toMatch(/FRAME and SIGNAL/);
    expect(src).not.toMatch(/FRAME then SIGNAL/);
  });

  test("TH-05: every statement text is ALL CAPS", () => {
    const src = fs.readFileSync(MANIFESTO_PATH, "utf-8");
    const textLiterals = Array.from(
      src.matchAll(/\btext:\s*"([^"]+)"/g),
      (m) => m[1],
    );
    for (const literal of textLiterals) {
      // ALL CAPS = no lowercase letters anywhere (punctuation + spaces allowed)
      expect(
        literal,
        `Statement "${literal}" contains lowercase letters`,
      ).toBe(literal.toUpperCase());
    }
  });

  // ── Task 0 (Plan 02): PinnedSection forwardRef upgrade (source-level) ───────

  test("Plan 02 Task 0: PinnedSection is wrapped in React.forwardRef", () => {
    const src = fs.readFileSync(
      path.resolve(ROOT, "components/animation/pinned-section.tsx"),
      "utf-8",
    );
    // Must import forwardRef and useImperativeHandle from React
    expect(src).toMatch(/import\s*\{[^}]*forwardRef[^}]*\}\s*from\s*"react"/);
    expect(src).toMatch(/import\s*\{[^}]*useImperativeHandle[^}]*\}\s*from\s*"react"/);
    // Must use forwardRef with the correct generic signature
    expect(src).toMatch(/forwardRef<HTMLDivElement,\s*PinnedSectionProps>/);
    // Must set displayName for React DevTools
    expect(src).toMatch(/PinnedSection\.displayName\s*=\s*"PinnedSection"/);
    // The reduced-motion early return must still be present (phase-29 PF-06 contract)
    expect(src).toContain("prefers-reduced-motion: reduce");
    // The ScrollTrigger config must be preserved
    expect(src).toContain("pin: true");
    expect(src).toContain("scrub: 1");
    expect(src).toContain("anticipatePin: 1");
    expect(src).toContain("invalidateOnRefresh: true");
  });

  // Plan 02 Task 3 will append TH-01, TH-02, TH-03, TH-04, TH-06 browser-level tests below this line.
});
