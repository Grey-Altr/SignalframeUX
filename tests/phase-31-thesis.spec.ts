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
    // Portal-pin strategy (4866bdb): GSAP native pin was removed because
    // ScaleCanvas's transform: scale() hijacks position: fixed (containing-
    // block rule). PinnedSection now renders into a body-level portal whose
    // opacity is scrubbed by a ScrollTrigger. The essential contract is:
    //   1. A ScrollTrigger is created (drives the pin window)
    //   2. invalidateOnRefresh re-measures end on resize
    //   3. Content is portalled out via createPortal
    //   4. The portal wrapper is position:fixed (the actual viewport anchor)
    expect(src).toContain("createPortal");
    expect(src).toContain("ScrollTrigger.create");
    expect(src).toContain("invalidateOnRefresh: true");
    expect(src).toMatch(/position:\s*"fixed"/);
  });

  // ── TH-01: scroll distance 200-300vh (browser) ──────────────────────────────

  test("TH-01: THESIS occupies 200-300vh of active scroll distance", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const thesis = page.locator("#thesis");
    await expect(thesis).toBeVisible({ timeout: 5000 });
    await page.waitForLoadState("networkidle");

    // TH-01 requires 200-300vh of *active scroll distance* (what the user
    // scrolls through while the pin is engaged). GSAP ScrollTrigger's pin
    // creates a pin-spacer that inflates the DOM bounding box by the pinned
    // element's own 100vh PLUS the scrollDistance. So:
    //   bbox.height = (1.0 + scrollDistance) * viewportHeight
    // For scrollDistance in [2.0, 3.0], bbox.height / viewportHeight falls
    // in [3.0, 4.0]. We assert that range and the comment documents why.
    const box = await thesis.boundingBox();
    expect(box).not.toBeNull();
    const viewportHeight = page.viewportSize()!.height;
    const bboxMultiple = box!.height / viewportHeight;
    expect(bboxMultiple, "bbox = 1.0 (pin) + scrollDistance").toBeGreaterThanOrEqual(3.0);
    expect(bboxMultiple, "bbox = 1.0 (pin) + scrollDistance").toBeLessThanOrEqual(4.0);

    // Derived active scroll distance (what TH-01 actually constrains)
    const activeScrollMultiple = bboxMultiple - 1.0;
    expect(activeScrollMultiple, "active scroll distance").toBeGreaterThanOrEqual(2.0);
    expect(activeScrollMultiple, "active scroll distance").toBeLessThanOrEqual(3.0);
  });

  // ── TH-02: statements positioned individually via pin ───────────────────────

  test("TH-02: exactly 6 statements rendered absolutely-positioned inside pinned stage", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.locator("#thesis").scrollIntoViewIfNeeded();
    await page.waitForLoadState("networkidle");

    // PinnedSection portals its content to document.body (outside the
    // ScaleCanvas transform subtree), so the stage and statements are NOT
    // DOM descendants of #thesis — they live under
    // [data-pinned-portal='thesis-pin']. See components/animation/
    // pinned-section.tsx and commit 4866bdb for the rationale.
    const portal = page.locator("[data-pinned-portal='thesis-pin']");
    await expect(portal).toHaveCount(1);

    const stage = portal.locator("[data-stage]");
    await expect(stage).toHaveCount(1);

    const statements = portal.locator("[data-statement]");
    await expect(statements).toHaveCount(6);

    // Every statement's direct parent must be absolutely positioned
    const count = await statements.count();
    for (let i = 0; i < count; i++) {
      const parentPosition = await statements.nth(i).evaluate((el) => {
        const parent = el.parentElement;
        if (!parent) return null;
        return getComputedStyle(parent).position;
      });
      expect(parentPosition, `statement ${i} parent position`).toBe("absolute");
    }
  });

  // ── TH-03: every statement renders at >= 80px (all 6 are anchors) ───────────

  test("TH-03: all 6 anchor statements render at 80px or larger on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.locator("#thesis").scrollIntoViewIfNeeded();
    await page.waitForLoadState("networkidle");

    // Statements live under the body-level portal (see TH-02 comment).
    const anchors = page.locator(
      "[data-pinned-portal='thesis-pin'] [data-statement-size='anchor']",
    );
    await expect(anchors).toHaveCount(6);

    const count = await anchors.count();
    for (let i = 0; i < count; i++) {
      const fontSize = await anchors.nth(i).evaluate((el) =>
        parseFloat(getComputedStyle(el).fontSize),
      );
      expect(fontSize, `anchor ${i} font-size`).toBeGreaterThanOrEqual(80);
    }
  });

  // ── TH-04: weighted-arc 30vh void at structural bookends ────────────────────

  test("TH-04: at least 2 statements have data-void-before >= 30", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.locator("#thesis").scrollIntoViewIfNeeded();
    await page.waitForLoadState("networkidle");

    // Statements live under the body-level portal (see TH-02 comment).
    const statements = await page
      .locator("[data-pinned-portal='thesis-pin'] [data-statement-size='anchor']")
      .all();
    expect(statements.length).toBe(6);

    let voidCount = 0;
    for (const s of statements) {
      // data-void-before is on the absolutely-positioned parent div, not the span.
      // Walk up one level to read it.
      const voidBefore = await s.evaluate(
        (el) => el.parentElement?.getAttribute("data-void-before") ?? null,
      );
      if (voidBefore !== null && parseInt(voidBefore, 10) >= 30) {
        voidCount++;
      }
    }
    // Weighted arc guarantees S1 (index 0) and S6 (index 5) hit the 40vh bookend
    expect(voidCount, "statements with >=30vh void before").toBeGreaterThanOrEqual(2);
  });

  // ── TH-06: reduced-motion fallback ──────────────────────────────────────────

  test("TH-06: reduced-motion renders stacked specimen with no pin", async ({ browser }) => {
    const ctx = await browser.newContext({
      reducedMotion: "reduce",
      viewport: { width: 1440, height: 900 },
    });
    const rmPage = await ctx.newPage();
    const rmJsErrors: string[] = [];
    rmPage.on("console", (msg) => {
      if (msg.type() === "error") rmJsErrors.push(msg.text());
    });
    rmPage.on("pageerror", (err) => rmJsErrors.push(err.message));

    await rmPage.goto("/");
    const thesis = rmPage.locator("#thesis");
    await expect(thesis).toBeVisible({ timeout: 5000 });
    await rmPage.waitForLoadState("networkidle");

    // RM branch bypasses PinnedSection entirely and renders inline under
    // #thesis — so statements live in the SFSection subtree, not in the
    // body-level portal used by the motion branch.
    const statements = rmPage.locator("#thesis [data-statement]");
    await expect(statements).toHaveCount(6);

    // Semantic "no pin" contract: reduced-motion skips PinnedSection, so
    // the portal is never mounted. This is a stronger signal than a bbox
    // threshold (which drifts as stacked-specimen content changes) and
    // directly maps to the architectural decision.
    const portal = rmPage.locator("[data-pinned-portal='thesis-pin']");
    await expect(portal).toHaveCount(0);

    // Stacked specimen marker should be present
    const reducedMotionMarker = rmPage.locator(
      "#thesis [data-thesis-reduced-motion]",
    );
    await expect(reducedMotionMarker).toHaveCount(1);

    // No console errors
    expect(rmJsErrors, "reduced-motion homepage console errors").toHaveLength(0);

    await ctx.close();
  });

  // ── Regression: zero console errors on default load ─────────────────────────

  test("Phase 31 regression: homepage loads without console errors", async ({ page }) => {
    const jsErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") jsErrors.push(msg.text());
    });
    page.on("pageerror", (err) => jsErrors.push(err.message));
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // Scroll into THESIS to engage the pin and exercise the GSAP code path
    await page.locator("#thesis").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    expect(jsErrors).toHaveLength(0);
  });
});
