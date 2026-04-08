/**
 * Phase 29 — Infrastructure Hardening
 * Smoke tests verifying PF-04 and PF-05 edits at source level + browser level.
 *
 * Source-level tests: read actual source files and assert required strings are present.
 * Browser test: navigate to http://localhost:3000 and assert zero JS console errors.
 *
 * Assumes dev server is running on http://localhost:3000
 */
import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");

test.describe("Phase 29: Infrastructure Hardening", () => {
  // ── PF-04: overscroll-behavior CSS ──────────────────────────────────────────
  test("PF-04: globals.css contains overscroll-behavior: none on html", () => {
    const src = fs.readFileSync(path.resolve(ROOT, "app/globals.css"), "utf-8");
    expect(src).toContain("overscroll-behavior: none");
  });

  // ── PF-04: fonts-ready hook in page-animations.tsx ──────────────────────────
  test("PF-04: page-animations.tsx has document.fonts.ready.then with cancelledRef guard", () => {
    const src = fs.readFileSync(
      path.resolve(ROOT, "components/layout/page-animations.tsx"),
      "utf-8"
    );
    expect(src).toContain("document.fonts.ready.then");
    expect(src).toContain("cancelledRef.current");
  });

  // ── PF-05: Observer registered in gsap-plugins.ts ───────────────────────────
  test("PF-05: gsap-plugins.ts imports, registers, and exports Observer", () => {
    const src = fs.readFileSync(path.resolve(ROOT, "lib/gsap-plugins.ts"), "utf-8");
    expect(src).toContain('import { Observer } from "gsap/Observer"');
    // Verify Observer appears inside gsap.registerPlugin(...) block
    const registerMatch = src.match(/gsap\.registerPlugin\([\s\S]*?\)/);
    expect(registerMatch).not.toBeNull();
    expect(registerMatch![0]).toContain("Observer");
    // Verify Observer is in the export line
    expect(src).toMatch(/export\s*\{[^}]*Observer[^}]*\}/);
  });

  // ── PF-05: Observer re-exported from gsap-core.ts ───────────────────────────
  test("PF-05: gsap-core.ts imports, registers, and exports Observer", () => {
    const src = fs.readFileSync(path.resolve(ROOT, "lib/gsap-core.ts"), "utf-8");
    expect(src).toContain('import { Observer } from "gsap/Observer"');
    expect(src).toContain("Observer");
    expect(src).toMatch(/export\s*\{[^}]*Observer[^}]*\}/);
  });

  // ── PF-04: Lenis autoResize: false (suppresses iOS address bar resize) ───────
  test("PF-04: lenis-provider.tsx has autoResize: false in Lenis constructor", () => {
    const src = fs.readFileSync(
      path.resolve(ROOT, "components/layout/lenis-provider.tsx"),
      "utf-8"
    );
    expect(src).toContain("autoResize: false");
  });

  // ── PF-04: homepage loads without JS errors ──────────────────────────────────
  test("PF-04: homepage loads without console errors", async ({ page }) => {
    const jsErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") jsErrors.push(msg.text());
    });
    page.on("pageerror", (err) => {
      jsErrors.push(err.message);
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(jsErrors).toHaveLength(0);
  });
});
