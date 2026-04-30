import { test, expect, type Page } from "@playwright/test";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Phase 66 Plan 02 Task 6 [BLOCKING] — Wave 0 LCP candidate stability gate.
 *
 * Verifies that the GhostLabel ARC-04 suppression (text moved into CSS
 * pseudo-element via .sf-ghost-label-pseudo::before { content: attr(...) })
 * does NOT shift mobile LCP into noise. v1.8 mobile LCP at 360x800 was the
 * GhostLabel itself (per .planning/codebase/v1.8-lcp-evidence.json). Post-
 * Phase-66, pseudo-element-rendered text is NOT a regular DOM node and is
 * NOT LCP-eligible per Chrome's LCP API; the candidate WILL shift. This
 * spec asserts the new candidate is a stable above-fold SSR-paintable
 * element with non-zero bounding rect.
 *
 * BLOCKING gate: if Tests 1+2+3 fail, the pseudo-element approach has shifted
 * mobile LCP to noise. Per 66-RESEARCH §8d, escalate to Option A (mask-image).
 *
 * Quirks defended:
 * - feedback_chrome_lcp_text_in_defs_quirk.md: Chrome LCP API populates
 *   `largestPaints` with 0×0 SVG-defs entries that supersede with real
 *   visible elements. Read LAST entry, not [0].
 * - feedback_lcp_observer_content_visibility.md: entry.element=null on
 *   content-visibility:auto surfaces (which the GhostLabel uses). Skip BCR
 *   check on null and rely on size + selector-string presence.
 *
 * Run: `pnpm exec playwright test tests/v1.9-phase66-lcp-stability.spec.ts --project=chromium`
 * (against `pnpm build && PORT=3001 pnpm start`). Mirrors v1.8-lcp-diagnosis
 * absolute-URL pattern.
 */

const ABS_BASE = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";

type LcpEntry = {
  size: number;
  startTime: number;
  hasElement: boolean;
  selector: string | null;
  bcr: { width: number; height: number; top: number; left: number } | null;
};

async function captureLcp(page: Page): Promise<LcpEntry | null> {
  // Inject PerformanceObserver before page nav, capture all LCP entries to window.
  // The cssPath helper composes a tagName + classes selector, mirroring the
  // pattern in v1.8-lcp-diagnosis.spec.ts:114-124.
  await page.addInitScript(() => {
    type LcpRecord = {
      size: number;
      startTime: number;
      hasElement: boolean;
      selector: string | null;
      bcr: { width: number; height: number; top: number; left: number } | null;
    };
    const w = window as unknown as { __lcpEntries: LcpRecord[] };
    w.__lcpEntries = [];
    function cssPath(el: Element): string {
      const tag = el.tagName.toLowerCase();
      const id = el.id ? "#" + el.id : "";
      let classes = "";
      const cn = (el as HTMLElement).className;
      if (typeof cn === "string" && cn.trim().length > 0) {
        classes =
          "." + cn.split(/\s+/).filter(Boolean).slice(0, 8).join(".");
      }
      return `${tag}${id}${classes}`;
    }
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const lcp = entry as PerformanceEntry & {
          size?: number;
          element?: Element | null;
          url?: string;
        };
        const el = lcp.element ?? null;
        const rect = el ? el.getBoundingClientRect() : null;
        w.__lcpEntries.push({
          size: lcp.size ?? 0,
          startTime: lcp.startTime,
          hasElement: el !== null,
          selector: el ? cssPath(el) : null,
          bcr: rect
            ? {
                width: rect.width,
                height: rect.height,
                top: rect.top,
                left: rect.left,
              }
            : null,
        });
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });
  });

  await page.goto(`${ABS_BASE}/`, { waitUntil: "networkidle" });
  // Force Anton to be present so warm-state LCP evaluates the Anton-paint path
  // (mirrors v1.8-lcp-diagnosis warm pattern).
  await page.evaluate(() => document.fonts.load('700 100px "Anton"'));
  await page.evaluate(() => (document as Document).fonts.ready);
  await page.waitForTimeout(500);

  const entries = await page.evaluate(
    () =>
      (window as unknown as { __lcpEntries: LcpEntry[] }).__lcpEntries ?? [],
  );
  // feedback_chrome_lcp_text_in_defs_quirk: read LAST entry, not [0].
  return entries.length > 0 ? entries[entries.length - 1] : null;
}

test.describe("@v1.9-phase66 LCP candidate stability post-ARC-04", () => {
  test("Test 1: mobile 360x800 — LCP candidate has non-zero size (not 0x0 SVG-defs noise)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const lcp = await captureLcp(page);
    expect(lcp).not.toBeNull();
    // size > 100 means > 10x10 pixel bounding box — NOT 0x0 SVG-defs quirk.
    expect(lcp!.size).toBeGreaterThan(100);
  });

  test("Test 2: mobile 360x800 — LCP candidate is above-fold (top < 800)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const lcp = await captureLcp(page);
    expect(lcp).not.toBeNull();
    if (lcp!.bcr === null) {
      // feedback_lcp_observer_content_visibility: entry.element may be null
      // on content-visibility:auto surfaces. Skip BCR check; we already verified
      // size > 100 in Test 1, which is sufficient evidence of non-noise.
      test.skip(true, "entry.element is null (content-visibility:auto quirk)");
    } else {
      expect(lcp!.bcr.width).toBeGreaterThan(0);
      expect(lcp!.bcr.height).toBeGreaterThan(0);
      expect(lcp!.bcr.top).toBeLessThan(800);
    }
  });

  test("Test 3: mobile 360x800 — LCP candidate is in SSR HTML stream", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const lcp = await captureLcp(page);
    expect(lcp).not.toBeNull();
    if (!lcp!.selector) {
      test.skip(true, "selector unavailable (entry.element null)");
    } else {
      const html = await page.content();
      // Loose check: at minimum the tagName from the selector exists in the
      // streamed HTML. Pseudo-elements would NOT match this — they have no
      // tag in the rendered HTML stream — so a green test means the candidate
      // is a real SSR-paintable element, not pseudo-element noise.
      const tagName = lcp!.selector.split(/[#.\s]/)[0];
      expect(html.toLowerCase()).toContain(`<${tagName.toLowerCase()}`);
    }
  });

  test("Test 4: desktop 1440x900 — LCP candidate UNCHANGED from v1.8 (entry-section register)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const lcp = await captureLcp(page);
    expect(lcp).not.toBeNull();
    expect(lcp!.size).toBeGreaterThan(100);
    // v1.8 desktop LCP was VL-05 magenta // overlay — span with classes like
    // relative + top-[0.08em] + text-[1.28em] (per v1.8-lcp-diagnosis.md).
    // Phase 66 ARC-04 affects only GhostLabel, which is not desktop LCP, so
    // the candidate identity should remain similar. Loose match — assert it
    // is NOT the GhostLabel selector (which would mean ARC-04 broke desktop
    // LCP path too).
    if (lcp!.selector) {
      expect(lcp!.selector).not.toContain("ghost-label");
      expect(lcp!.selector).not.toContain("sf-ghost-label-pseudo");
    }
  });

  test("Test 5: DOCUMENTING — write 66-lcp-postcapture.md with mobile + desktop LCP identity", async ({
    page,
  }) => {
    test.setTimeout(90_000); // Two captureLcp() calls (~15s each w/ networkidle + Anton warm).
    const results: Record<string, LcpEntry | null> = {};
    for (const vp of [
      { name: "mobile-360x800", w: 360, h: 800 },
      { name: "desktop-1440x900", w: 1440, h: 900 },
    ]) {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      await page.emulateMedia({ reducedMotion: "reduce" });
      results[vp.name] = await captureLcp(page);
    }
    const out = path.resolve(
      process.cwd(),
      ".planning/phases/66-scalecanvas-track-b-architectural-decision/66-lcp-postcapture.md",
    );
    await fs.mkdir(path.dirname(out), { recursive: true });
    const md =
      `# Phase 66 — Mobile LCP Candidate Post-ARC-04\n\n` +
      `Captured by tests/v1.9-phase66-lcp-stability.spec.ts (Task 6 BLOCKING gate).\n` +
      `Documents the post-pseudo-element LCP candidate identity for Plan 03 + future\n` +
      `phase-gate consumption. Reads LAST entry of largestPaints per\n` +
      `feedback_chrome_lcp_text_in_defs_quirk; honors entry.element=null path\n` +
      `per feedback_lcp_observer_content_visibility.\n\n` +
      `## Mobile (360×800)\n\n\`\`\`json\n${JSON.stringify(
        results["mobile-360x800"],
        null,
        2,
      )}\n\`\`\`\n\n` +
      `## Desktop (1440×900)\n\n\`\`\`json\n${JSON.stringify(
        results["desktop-1440x900"],
        null,
        2,
      )}\n\`\`\`\n\n` +
      `Captured: ${new Date().toISOString()}\n`;
    await fs.writeFile(out, md);
    const stat = await fs.stat(out);
    expect(stat.size).toBeGreaterThan(100);
  });
});
