/**
 * Phase 34 — Visual Language + Subpage Redesign
 * Plan 34-01: InstrumentHUD + useNavReveal + GhostLabel deployment + magenta audit + Breadcrumb restyle.
 *
 * Pattern: fs.readFileSync source-level assertions mixed with browser-level DOM tests.
 * Requires dev server on http://localhost:3000 for browser tests.
 *
 * RED STATE: All tests should FAIL until Wave 1 tasks land the implementation.
 */
import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");

test.describe("Phase 34 — Visual Language + Subpage Redesign", () => {
  // ── VL-06 (InstrumentHUD — cdSB brief §VL-06 LOCKED Option C) ──────
  // The HUD is a Wipeout-cockpit instrument readout: 5 fields desktop, 3 mobile,
  // fixed top-right, non-interactive, mounted site-wide from app/layout.tsx.
  // NOT a relabeled dot rail. Source of truth: wiki/analyses/v1.5-phase34-brief §VL-06.

  test("VL-06: source — instrument-hud.tsx exists and exports InstrumentHUD", () => {
    const src = fs.readFileSync(path.resolve(ROOT, "components/layout/instrument-hud.tsx"), "utf-8");
    expect(src).toMatch(/export\s+function\s+InstrumentHUD/);
  });

  test("VL-06: source — old section-indicator.tsx is DELETED", () => {
    const p = path.resolve(ROOT, "components/layout/section-indicator.tsx");
    expect(fs.existsSync(p)).toBe(false);
  });

  test("VL-06: source — app/layout.tsx mounts <InstrumentHUD />", () => {
    const src = fs.readFileSync(path.resolve(ROOT, "app/layout.tsx"), "utf-8");
    expect(src).toMatch(/import\s*\{\s*InstrumentHUD\s*\}\s*from\s*["']@\/components\/layout\/instrument-hud["']/);
    expect(src).toMatch(/<InstrumentHUD\s*\/>/);
  });

  test("VL-06: source — app/page.tsx no longer imports or renders SectionIndicator", () => {
    const src = fs.readFileSync(path.resolve(ROOT, "app/page.tsx"), "utf-8");
    expect(src).not.toMatch(/SectionIndicator/);
  });

  test("VL-06: source — HUD uses rAF, not React state for per-frame fields", () => {
    const src = fs.readFileSync(path.resolve(ROOT, "components/layout/instrument-hud.tsx"), "utf-8");
    expect(src).toContain("requestAnimationFrame");
    expect(src).toMatch(/scrollRef\s*=\s*useRef/);
    expect(src).toMatch(/sigRef\s*=\s*useRef/);
  });

  test("VL-06: source — HUD is non-interactive (no buttons, no aria-current, no nav role)", () => {
    const src = fs.readFileSync(path.resolve(ROOT, "components/layout/instrument-hud.tsx"), "utf-8");
    expect(src).not.toMatch(/<button/);
    expect(src).not.toMatch(/aria-current/);
    expect(src).not.toMatch(/role=["']navigation["']/);
  });

  test("VL-06: source — HUD has NO chrome classes (no bg/rounded/shadow/backdrop/ring)", () => {
    const src = fs.readFileSync(path.resolve(ROOT, "components/layout/instrument-hud.tsx"), "utf-8");
    expect(src).not.toMatch(/\brounded-/);
    expect(src).not.toMatch(/\bbackdrop-/);
    expect(src).not.toMatch(/\bshadow-/);
    expect(src).not.toMatch(/\bring-/);
    expect(src).not.toMatch(/\bbg-(background|card|popover|muted|accent|primary|secondary)\b/);
  });

  test("VL-06: source — HUD does NOT use `hidden md:flex` (mobile must render, truncated)", () => {
    const src = fs.readFileSync(path.resolve(ROOT, "components/layout/instrument-hud.tsx"), "utf-8");
    expect(src).not.toMatch(/hidden\s+md:flex/);
  });

  test("VL-06: DOM — HUD renders on homepage with 5 fields at desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const hud = page.locator("[data-instrument-hud]");
    await expect(hud).toHaveCount(1);
    await expect(hud.locator("[data-hud-field]")).toHaveCount(5);
    await expect(hud.locator('[data-hud-field="section"]')).toBeVisible();
    await expect(hud.locator('[data-hud-field="scroll"]')).toBeVisible();
    await expect(hud.locator('[data-hud-field="sig"]')).toBeVisible();
    await expect(hud.locator('[data-hud-field="viewport"]')).toBeVisible();
    await expect(hud.locator('[data-hud-field="time"]')).toBeVisible();
  });

  test("VL-06: DOM — HUD is fixed top-right with 24px padding from edges", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const box = await page.locator("[data-instrument-hud]").boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.y).toBeLessThanOrEqual(40);
      expect(1440 - (box.x + box.width)).toBeLessThanOrEqual(40);
    }
  });

  test("VL-06: DOM — section field matches [NN//LABEL] format", async ({ page }) => {
    await page.goto("/");
    const sectionText = await page.locator('[data-hud-field="section"]').textContent();
    expect(sectionText).toMatch(/^\[\d{2}\/\/[A-Z]+\]$/);
  });

  test("VL-06: DOM — scroll field matches NN% format", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(200);
    const scrollText = await page.locator('[data-hud-field="scroll"]').textContent();
    expect(scrollText).toMatch(/^\d{1,3}%$/);
  });

  test("VL-06: DOM — sig field matches SIG:N.N format", async ({ page }) => {
    await page.goto("/");
    const sigText = await page.locator('[data-hud-field="sig"]').textContent();
    expect(sigText).toMatch(/^SIG:\d\.\d$/);
  });

  test("VL-06: DOM — viewport field matches WWWW×HHHH format", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const vpText = await page.locator('[data-hud-field="viewport"]').textContent();
    expect(vpText).toMatch(/^\d{3,4}×\d{3,4}$/);
  });

  test("VL-06: DOM — time field matches HH:MM format", async ({ page }) => {
    await page.goto("/");
    const timeText = await page.locator('[data-hud-field="time"]').textContent();
    expect(timeText).toMatch(/^\d{2}:\d{2}$/);
  });

  test("VL-06: DOM — HUD is non-interactive (no <button>, no aria-current)", async ({ page }) => {
    await page.goto("/");
    const hud = page.locator("[data-instrument-hud]");
    await expect(hud.locator("button")).toHaveCount(0);
    await expect(hud.locator("[aria-current]")).toHaveCount(0);
  });

  test("VL-06: DOM — mobile viewport 375px renders 3 fields (section, sig, time)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    const hud = page.locator("[data-instrument-hud]");
    await expect(hud).toBeVisible();
    await expect(hud.locator("[data-hud-field]")).toHaveCount(3);
    await expect(hud.locator('[data-hud-field="section"]')).toBeVisible();
    await expect(hud.locator('[data-hud-field="sig"]')).toBeVisible();
    await expect(hud.locator('[data-hud-field="time"]')).toBeVisible();
    await expect(hud.locator('[data-hud-field="scroll"]')).toHaveCount(0);
    await expect(hud.locator('[data-hud-field="viewport"]')).toHaveCount(0);
  });

  test("VL-06: DOM — HUD renders on every subpage (site-wide layout mount)", async ({ page }) => {
    for (const route of ["/", "/system", "/init", "/reference", "/inventory"]) {
      await page.goto(route);
      await expect(page.locator("[data-instrument-hud]")).toHaveCount(1, { timeout: 3000 });
    }
  });

  test("VL-06: DOM — reduced motion shows static scroll readout '—%'", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForTimeout(200);
    const scrollText = await page.locator('[data-hud-field="scroll"]').textContent();
    expect(scrollText).toMatch(/—/);
  });

  // ── VL-01 (GhostLabel deployment — 2 brief-locked locations) ──────

  test("VL-01: source — GhostLabel caller count is ≥ 2 in the brief-locked pair", () => {
    const targets = ["app/page.tsx", "app/system/page.tsx"];
    const total = targets
      .map((p) => (fs.readFileSync(path.resolve(ROOT, p), "utf-8").match(/<GhostLabel\b/g) || []).length)
      .reduce((a, b) => a + b, 0);
    expect(total).toBeGreaterThanOrEqual(2);
  });

  test("VL-01: source — GhostLabel NOT deployed on /init, /reference, /inventory (brief lock)", () => {
    for (const p of ["app/init/page.tsx", "app/reference/page.tsx", "app/inventory/page.tsx"]) {
      const src = fs.readFileSync(path.resolve(ROOT, p), "utf-8");
      expect(src).not.toMatch(/<GhostLabel\b/);
    }
  });

  test("VL-01: source — ghost-label.tsx renders data-ghost-label attribute", () => {
    const src = fs.readFileSync(path.resolve(ROOT, "components/animation/ghost-label.tsx"), "utf-8");
    expect(src).toContain('data-ghost-label="true"');
  });

  test("VL-01: DOM — homepage shows ≥ 1 ghost label (THESIS backdrop)", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('[data-ghost-label="true"]').first()).toBeVisible({ timeout: 5000 });
  });

  test("VL-01: DOM — /system shows ≥ 1 ghost label (subpage hero)", async ({ page }) => {
    await page.goto("/system");
    await expect(page.locator('[data-ghost-label="true"]').first()).toBeVisible({ timeout: 5000 });
  });

  // ── VL-02 (display type ≥120px) ────────────────────────────────────

  test("VL-02: source — /system /init /reference /inventory h1 clamp ≥ 80px min / ≥ 160px max", () => {
    const targets = ["app/system/page.tsx", "app/init/page.tsx", "app/reference/page.tsx", "app/inventory/page.tsx"];
    for (const p of targets) {
      const src = fs.readFileSync(path.resolve(ROOT, p), "utf-8");
      expect(src).toMatch(/clamp\(80px,\s*12vw,\s*160px\)/);
    }
  });

  test("VL-02: DOM — /system h1 computed fontSize ≥ 80px", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/system");
    const h1 = page.locator("h1").first();
    const fs = await h1.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(fs).toBeGreaterThanOrEqual(80);
  });

  test("VL-02: DOM — /inventory h1 text is INVENTORY and stat is 54", async ({ page }) => {
    await page.goto("/inventory");
    const h1 = await page.locator("h1").first().textContent();
    expect(h1).toContain("INVE");
    expect(h1).toContain("NTORY");
    await expect(page.locator("text=54").first()).toBeVisible();
    await expect(page.locator("text=340")).toHaveCount(0);
  });

  // ── VL-05 (magenta audit) ──────────────────────────────────────────

  test("VL-05: source — token-tabs ≤ 5 magenta uses", () => {
    const src = fs.readFileSync(path.resolve(ROOT, "components/blocks/token-tabs.tsx"), "utf-8");
    const matches = src.match(/text-primary|bg-primary|border-primary|var\(--color-primary\)/g) || [];
    expect(matches.length).toBeLessThanOrEqual(5);
  });

  test("VL-05: source — api-explorer ≤ 5 magenta uses", () => {
    const src = fs.readFileSync(path.resolve(ROOT, "components/blocks/api-explorer.tsx"), "utf-8");
    const matches = src.match(/text-primary|bg-primary|border-primary|var\(--color-primary\)/g) || [];
    expect(matches.length).toBeLessThanOrEqual(5);
  });

  test("VL-05: source — app/init/page.tsx ≤ 5 magenta uses", () => {
    const src = fs.readFileSync(path.resolve(ROOT, "app/init/page.tsx"), "utf-8");
    const matches = src.match(/text-primary|bg-primary|border-primary|var\(--color-primary\)/g) || [];
    expect(matches.length).toBeLessThanOrEqual(5);
  });

  test("VL-05: source — code-section ≤ 5 magenta uses", () => {
    const src = fs.readFileSync(path.resolve(ROOT, "components/blocks/code-section.tsx"), "utf-8");
    const matches = src.match(/text-primary|bg-primary|border-primary|var\(--color-primary\)/g) || [];
    expect(matches.length).toBeLessThanOrEqual(5);
  });

  test("VL-05: source — components-explorer ≤ 5 magenta uses", () => {
    const src = fs.readFileSync(path.resolve(ROOT, "components/blocks/components-explorer.tsx"), "utf-8");
    const matches = src.match(/text-primary|bg-primary|border-primary|var\(--color-primary\)/g) || [];
    expect(matches.length).toBeLessThanOrEqual(5);
  });

  // ── SP-05 (useNavReveal hook + subpage triggers) ──────────────────

  test("SP-05: source — hooks/use-nav-reveal.ts exports useNavReveal(triggerRef) single arg", () => {
    const src = fs.readFileSync(path.resolve(ROOT, "hooks/use-nav-reveal.ts"), "utf-8");
    expect(src).toMatch(/export\s+function\s+useNavReveal\s*\(\s*triggerRef[^,)]*\)/);
    expect(src).toMatch(/data-?[Nn]av-?[Vv]isible|navVisible/);
  });

  test("SP-05: source — Nav does NOT contain inline ScrollTrigger.create AND does NOT call useNavReveal directly", () => {
    const src = fs.readFileSync(path.resolve(ROOT, "components/layout/nav.tsx"), "utf-8");
    expect(src).not.toMatch(/ScrollTrigger\.create\(/);
    expect(src).not.toMatch(/useNavReveal\(/);
    expect(src).not.toMatch(/import\s*\{[^}]*ScrollTrigger[^}]*\}\s*from\s*["']@\/lib\/gsap-core/);
  });

  test("SP-05: source — components/layout/nav-reveal-mount.tsx exists exporting NavRevealMount", () => {
    const src = fs.readFileSync(path.resolve(ROOT, "components/layout/nav-reveal-mount.tsx"), "utf-8");
    expect(src).toMatch(/^"use client"/m);
    expect(src).toMatch(/export\s+function\s+NavRevealMount/);
    expect(src).toMatch(/useNavReveal\(/);
  });

  test("SP-05: source — globals.css has body[data-nav-visible] CSS rule", () => {
    const src = fs.readFileSync(path.resolve(ROOT, "app/globals.css"), "utf-8");
    expect(src).toMatch(/body\[data-nav-visible="true"\]\s+\.sf-nav-hidden/);
  });

  test("SP-05: DOM — homepage nav starts hidden, appears after scroll past ENTRY", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toHaveAttribute("data-nav-visible", "false", { timeout: 2000 });
    await page.evaluate(() => window.scrollTo(0, window.innerHeight + 100));
    await expect(page.locator("body")).toHaveAttribute("data-nav-visible", "true", { timeout: 3000 });
  });

  test("SP-05: DOM — /system nav hidden initially, becomes visible after scrolling past header", async ({ page }) => {
    await page.goto("/system");
    await expect(page.locator("body")).toHaveAttribute("data-nav-visible", "false", { timeout: 2000 });
    await page.evaluate(() => window.scrollTo(0, 600));
    await expect(page.locator("body")).toHaveAttribute("data-nav-visible", "true", { timeout: 3000 });
  });

  test("SP-05: DOM — /init nav hidden initially, becomes visible after scrolling past header", async ({ page }) => {
    await page.goto("/init");
    await expect(page.locator("body")).toHaveAttribute("data-nav-visible", "false", { timeout: 2000 });
    await page.evaluate(() => window.scrollTo(0, 600));
    await expect(page.locator("body")).toHaveAttribute("data-nav-visible", "true", { timeout: 3000 });
  });

  test("SP-05: DOM — /reference nav hidden initially, becomes visible after scrolling past header", async ({ page }) => {
    await page.goto("/reference");
    await expect(page.locator("body")).toHaveAttribute("data-nav-visible", "false", { timeout: 2000 });
    await page.evaluate(() => window.scrollTo(0, 600));
    await expect(page.locator("body")).toHaveAttribute("data-nav-visible", "true", { timeout: 3000 });
  });

  test("SP-05: DOM — reduced motion shows nav visible immediately on /init (no scroll needed)", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/init");
    await expect(page.locator("body")).toHaveAttribute("data-nav-visible", "true");
  });

  test("SP-05: DOM — reduced motion shows nav visible immediately on homepage (no scroll needed)", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("body")).toHaveAttribute("data-nav-visible", "true");
  });

  // ── SP-03 (/init boot-sequence reframe — Plan 34-03) ──────────────

  test("SP-03: DOM — /init preserves 5 STEPS", async ({ page }) => {
    await page.goto("/init");
    await expect(page.locator("[data-init-step]")).toHaveCount(5);
  });

  test("SP-03: DOM — /init removes NEXT_CARDS/SETUP_CHECKLIST/COMMUNITY blocks", async ({ page }) => {
    await page.goto("/init");
    await expect(page.getByText("SETUP_CHECKLIST", { exact: false })).toHaveCount(0);
    await expect(page.getByText("NEXT STEPS", { exact: true })).toHaveCount(0);
    await expect(page.getByText("JOIN THE SIGNAL", { exact: false })).toHaveCount(0);
    await expect(page.getByText("ESTIMATED TIME", { exact: false })).toHaveCount(0);
  });

  test("SP-03: source — /init does not contain removed block identifiers", () => {
    const src = fs.readFileSync(path.resolve(ROOT, "app/init/page.tsx"), "utf-8");
    expect(src).not.toContain("const CHECKLIST");
    expect(src).not.toContain("const NEXT_CARDS");
    expect(src).not.toContain("SETUP_CHECKLIST");
    expect(src).not.toContain("JOIN THE SIGNAL");
    expect(src).not.toContain("ESTIMATED TIME");
  });

  test("SP-03: DOM — /init terminal footer '[OK] SYSTEM READY'", async ({ page }) => {
    await page.goto("/init");
    await expect(page.getByText("[OK] SYSTEM READY", { exact: true })).toBeVisible();
  });

  test("SP-03: DOM — /init each step has [NN//CODE] coded indicator", async ({ page }) => {
    await page.goto("/init");
    const steps = page.locator("[data-init-step]");
    const count = await steps.count();
    expect(count).toBe(5);
    const expected = [
      /\[01\/\/INIT\]/,
      /\[02\/\/HANDSHAKE\]/,
      /\[03\/\/LINK\]/,
      /\[04\/\/TRANSMIT\]/,
      /\[05\/\/DEPLOY\]/,
    ];
    for (let i = 0; i < 5; i++) {
      const stepText = await steps.nth(i).textContent();
      expect(stepText).toMatch(expected[i]);
    }
  });

  test("SP-03: DOM — /init hero has [00//BOOT] and INITIALIZE display", async ({ page }) => {
    await page.goto("/init");
    await expect(page.getByText("[00//BOOT]", { exact: true })).toBeVisible();
    const h1 = page.locator("h1").first();
    const text = await h1.textContent();
    expect(text).toMatch(/INITIA/);
    expect(text).toMatch(/LIZE/);
  });

  test("SP-03: DOM — /init step number rendered at >= 80px", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/init");
    const firstStep = page.locator("[data-init-step]").first();
    const numberEl = firstStep.locator("div").first();
    const fontSize = await numberEl.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(fontSize).toBeGreaterThanOrEqual(80);
  });

  test("SP-03: source — /init magenta count <= 5", () => {
    const src = fs.readFileSync(path.resolve(ROOT, "app/init/page.tsx"), "utf-8");
    const matches = src.match(/text-primary|bg-primary|border-primary|var\(--color-primary\)/g) || [];
    expect(matches.length).toBeLessThanOrEqual(5);
  });

  test("SP-03: source — /init renders NavRevealMount + has header[data-nav-reveal-trigger]", () => {
    const src = fs.readFileSync(path.resolve(ROOT, "app/init/page.tsx"), "utf-8");
    expect(src).toContain("NavRevealMount");
    expect(src).toContain("data-nav-reveal-trigger");
    // Anti-pattern check: must NOT rely on the safety fallback
    expect(src).not.toMatch(/trigger\s*===\s*null/);
  });

  test("SP-03: source — /init preserves STEPS array + CodeBlock helper + COLOR_MAP.kw", () => {
    const src = fs.readFileSync(path.resolve(ROOT, "app/init/page.tsx"), "utf-8");
    expect(src).toContain("const STEPS");
    expect(src).toContain("function CodeBlock");
    expect(src).toContain('kw: "text-primary"');
    // STEPS array must still contain 5 entries (grep proxy: number: "0...)
    const stepCount = (src.match(/number: "0/g) || []).length;
    expect(stepCount).toBe(5);
  });

  // ── AC-9 (Breadcrumb restyle — brief §SP-05 bonus) ─────────────────

  test("AC-9: source — Breadcrumb uses font-mono and no chevrons", () => {
    const src = fs.readFileSync(path.resolve(ROOT, "components/layout/breadcrumb.tsx"), "utf-8");
    expect(src).toMatch(/font-mono/);
    expect(src).not.toMatch(/ChevronRight|ChevronLeft/);
    expect(src).not.toMatch(/<svg/);
    expect(src).not.toMatch(/\brounded-/);
    expect(src).not.toMatch(/text-primary|bg-primary|border-primary/);
    expect(src).toMatch(/aria-current/);
  });
});
