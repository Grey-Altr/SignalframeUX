# cdb-v3-dossier Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild six routes (`/`, `/system`, `/reference`, `/inventory`, `/builds`, `/init`) into a cohesive six-plate reference dossier, each route quoting one cdB reference pack, all sharing a four-corner chrome + catalog nav and a new 8-font slate.

**Architecture:** Per-page `<DossierChrome route="..." substrate="...">` wraps each `page.tsx`. Shared primitives live in `components/dossier/`. Each plate is its own atomic commit with a Playwright smoke test written before implementation. No changes to `components/sf/*`, `components/blocks/*`, `components/animation/*`. Layout stays gutted per `cdb-v2-broadcast` thesis.

**Tech Stack:** Next.js 15.3 App Router · TypeScript 5.8 strict · Tailwind v4 · `next/font/google` · existing `components/vault/*` + `components/cdb/*` primitives · Playwright for e2e smoke · Vitest for unit · pnpm.

**Spec:** `docs/superpowers/specs/2026-04-18-cdb-v3-dossier-design.md` — read this before starting any task.

---

## File structure

**Create:**
- `components/dossier/dossier-chrome.tsx` — four-corner wrapper, takes `route` + `substrate` props.
- `components/dossier/catalog-nav.tsx` — six-entry nav, active-entry highlight.
- `components/dossier/corner-label.tsx` — generic corner slot block.
- `components/dossier/y2k-mark-grid.tsx` — SVG Y2K mark grid (Plate 03).
- `components/dossier/hud-octagon-frame.tsx` — Cyber2k octagon-clip HUD frame (Plate 02).
- `components/dossier/build-schematic.tsx` — Diagrams2 circuit-diagram renderer (Plate 05).
- `components/dossier/terminal-session.tsx` — CLI-session simulation (Plate 06).
- `components/dossier/halftone-corrugated.tsx` — only if `vault-flag.tsx` insufficient for Plate 04 (decide in Task 4).
- `components/dossier/pointcloud-ring.tsx` — only if `vault-pointcloud.tsx` fails to paint on `/` (decide in Task 2).
- `components/dossier/index.ts` — barrel export.
- `tests/cdb-dossier-chrome.spec.ts` — chrome + catalog-nav smoke.
- `tests/cdb-dossier-kloroform.spec.ts` — `/` plate smoke.
- `tests/cdb-dossier-cyber2k.spec.ts` — `/system` plate smoke.
- `tests/cdb-dossier-blackflag.spec.ts` — `/inventory` plate smoke.
- `tests/cdb-dossier-diagrams2.spec.ts` — `/builds` plate smoke + `/builds/[slug]`.
- `tests/cdb-dossier-brando.spec.ts` — `/reference` plate smoke.
- `tests/cdb-dossier-helghanese.spec.ts` — `/init` plate smoke.

**Modify:**
- `app/layout.tsx` — swap font slate (Bungee + Archivo Narrow → Space Grotesk + JetBrains Mono as globals).
- `app/page.tsx` — rewrite as Plate 01 KLOROFORM.
- `app/system/page.tsx` — rewrite as Plate 02 Cyber2k (replaces `TokenTabs` + `TokenVizLoader`).
- `app/reference/page.tsx` — rewrite as Plate 03 Brando (replaces `APIExplorer`).
- `app/inventory/page.tsx` — rewrite as Plate 04 Black Flag (replaces `ComponentsExplorer`).
- `app/builds/page.tsx` — rewrite as Plate 05 Diagrams2 (replaces card-grid).
- `app/builds/[slug]/page.tsx` — rewrite to Diagrams2 language (sub-plate).
- `app/init/page.tsx` — rewrite as Plate 06 Helghanese.
- `app/globals.css` — add dossier-specific tokens if needed (see Task 1).

**Untouched (explicitly):** `components/sf/*`, `components/blocks/*`, `components/animation/*`, `components/ui/*`, `components/layout/*`, `app/builds/builds-data.ts`, `lib/component-registry.ts`.

---

## Task 1: Foundation — font slate + chrome primitives

**Files:**
- Modify: `app/layout.tsx`
- Create: `components/dossier/corner-label.tsx`
- Create: `components/dossier/catalog-nav.tsx`
- Create: `components/dossier/dossier-chrome.tsx`
- Create: `components/dossier/index.ts`

- [ ] **Step 1.1: Swap font slate in `app/layout.tsx`**

Replace the existing font imports (`JetBrains_Mono, Bungee, Archivo_Narrow`) with the new globals (`Space_Grotesk, JetBrains_Mono`). Retire Bungee and Archivo Narrow entirely from the layout.

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://signalframe.culturedivision.com"),
  title: "SIGNALFRAME//UX — cdB dossier",
  description:
    "Culture Division design system — six-plate reference dossier.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased overflow-x-hidden bg-[var(--cdb-black)] text-[var(--cdb-paper)] font-[var(--font-space-grotesk)]">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 1.2: Verify build still compiles**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm build`
Expected: build succeeds. Existing pages may render broken (that's fine — they get rewritten in Tasks 2–7).

- [ ] **Step 1.3: Create `components/dossier/corner-label.tsx`**

```tsx
// components/dossier/corner-label.tsx
import type { ReactNode } from "react";

type CornerSlot = "tl" | "tr" | "bl" | "br";

const slotClass: Record<CornerSlot, string> = {
  tl: "top-0 left-0",
  tr: "top-0 right-0 text-right",
  bl: "bottom-0 left-0",
  br: "bottom-0 right-0 text-right",
};

export function CornerLabel({
  slot,
  children,
  className = "",
}: {
  slot: CornerSlot;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-corner={slot}
      className={`fixed z-50 p-6 md:p-8 font-[var(--font-jetbrains)] text-[10px] md:text-[11px] uppercase tracking-[0.15em] leading-[1.4] ${slotClass[slot]} ${className}`}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 1.4: Create `components/dossier/catalog-nav.tsx`**

```tsx
// components/dossier/catalog-nav.tsx
import Link from "next/link";

export type DossierRoute =
  | "kloroform"
  | "cyber2k"
  | "brando"
  | "blackflag"
  | "diagrams2"
  | "helghanese";

type Entry = {
  route: DossierRoute;
  code: string;
  href: string;
};

const ENTRIES: Entry[] = [
  { route: "kloroform", code: "SF//KLO-00", href: "/" },
  { route: "cyber2k", code: "SF//HUD-00", href: "/system" },
  { route: "brando", code: "SF//MRK-00", href: "/reference" },
  { route: "blackflag", code: "SF//E00-00", href: "/inventory" },
  { route: "diagrams2", code: "SF//DGM-00", href: "/builds" },
  { route: "helghanese", code: "SF//HLG-00", href: "/init" },
];

export function CatalogNav({ active }: { active: DossierRoute }) {
  const activeColor =
    active === "helghanese"
      ? "oklch(0.8 0.2 135)" // lime-green parallel-world break
      : "oklch(0.65 0.3 350)"; // magenta default

  return (
    <nav aria-label="Dossier catalog" className="flex flex-wrap gap-x-3 gap-y-1">
      {ENTRIES.map((e, i) => {
        const isActive = e.route === active;
        return (
          <span key={e.route} className="flex items-center gap-x-3">
            <Link
              href={e.href}
              aria-current={isActive ? "page" : undefined}
              className="no-underline transition-colors"
              style={{
                color: isActive ? activeColor : "oklch(0.55 0 0)",
                textDecoration: isActive ? "underline" : "none",
                textUnderlineOffset: "3px",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = "oklch(0.95 0 0)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = "oklch(0.55 0 0)";
              }}
            >
              {e.code}
            </Link>
            {i < ENTRIES.length - 1 ? (
              <span aria-hidden="true" style={{ color: "oklch(0.35 0 0)" }}>
                ·
              </span>
            ) : null}
          </span>
        );
      })}
    </nav>
  );
}
```

Note: inline style for `color` because Tailwind v4's `oklch()` arbitrary values work, but the active-color swap between magenta/lime is simpler as inline style given the one-off parallel-world rule.

- [ ] **Step 1.5: Create `components/dossier/dossier-chrome.tsx`**

```tsx
// components/dossier/dossier-chrome.tsx
import type { ReactNode } from "react";
import { CornerLabel } from "./corner-label";
import { CatalogNav, type DossierRoute } from "./catalog-nav";

type Substrate = "black" | "paper-cream" | "paper-warm";

const substrateStyle: Record<Substrate, { background: string; color: string }> = {
  black: { background: "#000", color: "oklch(0.95 0 0)" },
  "paper-cream": { background: "oklch(0.92 0.01 85)", color: "oklch(0.15 0 0)" },
  "paper-warm": { background: "oklch(0.9 0.02 70)", color: "oklch(0.2 0.08 28)" },
};

// Build-time ISO date — stable across SSR/CSR.
const BUILD_DATE = new Date().toISOString().slice(0, 10);

const ROUTE_CODE: Record<DossierRoute, string> = {
  kloroform: "SF//KLO-00",
  cyber2k: "SF//HUD-00",
  brando: "SF//MRK-00",
  blackflag: "SF//E00-00",
  diagrams2: "SF//DGM-00",
  helghanese: "SF//HLG-00",
};

export function DossierChrome({
  route,
  substrate = "black",
  children,
}: {
  route: DossierRoute;
  substrate?: Substrate;
  children: ReactNode;
}) {
  const s = substrateStyle[substrate];
  return (
    <div
      data-dossier-route={route}
      data-substrate={substrate}
      className="relative min-h-screen"
      style={{ background: s.background, color: s.color }}
    >
      <CornerLabel slot="tl">
        <div>SF//UX</div>
        <div style={{ opacity: 0.6 }}>{ROUTE_CODE[route]}</div>
      </CornerLabel>

      <CornerLabel slot="tr">
        <div>LAX 34°03&apos;N 118°15&apos;W</div>
        <div style={{ opacity: 0.6 }}>{BUILD_DATE}</div>
      </CornerLabel>

      <CornerLabel slot="bl">
        <CatalogNav active={route} />
      </CornerLabel>

      <CornerLabel slot="br">
        <div>signalframe.culturedivision.com</div>
        <div style={{ opacity: 0.6 }}>v0.1 / CDB-V3</div>
      </CornerLabel>

      {children}
    </div>
  );
}
```

- [ ] **Step 1.6: Create `components/dossier/index.ts`**

```ts
// components/dossier/index.ts
export { DossierChrome } from "./dossier-chrome";
export { CatalogNav, type DossierRoute } from "./catalog-nav";
export { CornerLabel } from "./corner-label";
```

- [ ] **Step 1.7: Verify typecheck and build still pass**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm build`
Expected: build succeeds.

- [ ] **Step 1.8: Commit**

```bash
git add app/layout.tsx components/dossier/
git commit -m "Feat: D1 dossier chrome + font slate

Retire Bungee + Archivo Narrow from layout.tsx. Install Space Grotesk +
JetBrains Mono as globals. Add components/dossier/ with DossierChrome
wrapper (four-corner chrome + substrate toggle), CatalogNav (six-entry
nav with active-entry highlight, lime-green override for helghanese),
and CornerLabel primitive.

No route pages changed yet — plates ship in D2-D7.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Plate 01 — `/` KLOROFORM pointcloud

**Files:**
- Modify: `app/page.tsx` (full rewrite from V5)
- Possibly create: `components/dossier/pointcloud-ring.tsx` (fallback)
- Create: `tests/cdb-dossier-kloroform.spec.ts`

- [ ] **Step 2.1: Write the failing smoke test**

Create `tests/cdb-dossier-kloroform.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test.describe("@dossier / KLOROFORM", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
  });

  test("chrome: four corner labels render", async ({ page }) => {
    await expect(page.locator("[data-corner='tl']")).toBeVisible();
    await expect(page.locator("[data-corner='tr']")).toBeVisible();
    await expect(page.locator("[data-corner='bl']")).toBeVisible();
    await expect(page.locator("[data-corner='br']")).toBeVisible();
  });

  test("chrome: catalog-nav has six entries and /  is active", async ({ page }) => {
    const nav = page.locator("nav[aria-label='Dossier catalog']");
    await expect(nav.locator("a")).toHaveCount(6);
    const active = nav.locator("a[aria-current='page']");
    await expect(active).toHaveCount(1);
    await expect(active).toHaveText("SF//KLO-00");
  });

  test("substrate: route is black-field", async ({ page }) => {
    const root = page.locator("[data-dossier-route='kloroform']");
    await expect(root).toHaveAttribute("data-substrate", "black");
  });

  test("plate: Syne display font is loaded", async ({ page }) => {
    const hero = page.locator("[data-plate='kloroform-hero']");
    await expect(hero).toBeVisible();
    const family = await hero.evaluate((el) =>
      getComputedStyle(el).fontFamily
    );
    expect(family).toMatch(/Syne/i);
  });

  test("plate: pointcloud canvas renders", async ({ page }) => {
    const canvas = page.locator("[data-plate='kloroform-pointcloud']");
    await expect(canvas).toBeVisible();
  });

  test("plate: six route-preview tiles present", async ({ page }) => {
    const tiles = page.locator("[data-plate='kloroform-tile']");
    await expect(tiles).toHaveCount(6);
  });

  test("no console errors on load", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
  });
});
```

- [ ] **Step 2.2: Run test to verify it fails**

Start dev server in a background shell: `pnpm dev`

Run: `pnpm exec playwright test tests/cdb-dossier-kloroform.spec.ts`
Expected: FAIL on `data-corner` / `data-dossier-route` / `data-plate` locators (current V5 page has none of these).

- [ ] **Step 2.3: Verify `components/vault/vault-pointcloud.tsx` renders against the bare layout**

This is a de-risk step. V5's commit message says Three.js pointcloud mounts but fails to paint on certain page layouts. Before writing the full plate, mount it in a minimal harness and check.

Temporary check: edit `app/page.tsx` to render just:

```tsx
import { VaultPointcloud } from "@/components/vault/vault-pointcloud";

export default function Page() {
  return (
    <div className="min-h-screen bg-black">
      <div style={{ width: "100vw", height: "100vh" }}>
        <VaultPointcloud morphology="ring" />
      </div>
    </div>
  );
}
```

Visually inspect via `open http://localhost:3000` or via chrome-devtools MCP navigate.

**Decision gate:**
- If the WebGL canvas paints → use `VaultPointcloud` in the plate.
- If blank/black → create `components/dossier/pointcloud-ring.tsx` as canvas 2D fallback using V5's `ParticleField` approach. See next step.

- [ ] **Step 2.4 (conditional): Create canvas-2D pointcloud fallback**

Only if Step 2.3 shows VaultPointcloud not painting. Create `components/dossier/pointcloud-ring.tsx`:

```tsx
"use client";
import { useEffect, useRef } from "react";

export function PointcloudRing({
  count = 2400,
  radius = 0.38,
  className = "",
}: {
  count?: number;
  radius?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    // Ring distribution + slow rotation + breathing radius
    const pts = Array.from({ length: count }, () => {
      const theta = Math.random() * Math.PI * 2;
      const rJitter = (Math.random() - 0.5) * 0.04;
      return { theta, rJitter };
    });

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let start = performance.now();
    const draw = (now: number) => {
      const t = (now - start) / 1000;
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;
      const breath = 1 + Math.sin(t * 0.3) * 0.04;
      const rot = reduced ? 0 : t * 0.12;
      const r = Math.min(W, H) * radius * breath;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "rgba(245, 245, 240, 0.75)";
      for (const p of pts) {
        const x = cx + Math.cos(p.theta + rot) * (r + p.rJitter * r);
        const y = cy + Math.sin(p.theta + rot) * (r + p.rJitter * r);
        ctx.fillRect(x, y, 1.2 * dpr, 1.2 * dpr);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count, radius]);

  return (
    <canvas
      ref={ref}
      data-plate="kloroform-pointcloud"
      role="img"
      aria-label="KLOROFORM-style dissolving ring pointcloud"
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
```

Add to `components/dossier/index.ts` barrel.

- [ ] **Step 2.5: Implement the full KLOROFORM plate in `app/page.tsx`**

```tsx
// app/page.tsx
import type { Metadata } from "next";
import { Syne } from "next/font/google";
import Link from "next/link";
import { DossierChrome } from "@/components/dossier";
// Pick ONE of the next two imports based on Step 2.3 decision:
// import { VaultPointcloud } from "@/components/vault/vault-pointcloud";
import { PointcloudRing } from "@/components/dossier/pointcloud-ring";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SF//KLO-00 — KLOROFORM plate",
  description: "Dossier plate 01. Generative pointcloud morphology.",
};

const TILES = [
  { code: "SF//HUD-00", label: "CYBER2K", href: "/system", glyph: "⬡" },
  { code: "SF//MRK-00", label: "BRANDO",  href: "/reference", glyph: "◉" },
  { code: "SF//E00-00", label: "BLACK-F", href: "/inventory", glyph: "≋" },
  { code: "SF//DGM-00", label: "DIAGRAM", href: "/builds", glyph: "⊹" },
  { code: "SF//HLG-00", label: "HELGHAN", href: "/init", glyph: "▮" },
  { code: "SF//KLO-00", label: "KLOROFRM", href: "/", glyph: "○" },
] as const;

export default function Page() {
  return (
    <DossierChrome route="kloroform" substrate="black">
      <div className={syne.variable}>
        <main className="relative min-h-screen overflow-hidden">
          {/* Pointcloud layer — full bleed, centered */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[min(90vw,90vh)] aspect-square">
              <PointcloudRing count={2400} radius={0.42} />
            </div>
          </div>

          {/* Content layer — centered column */}
          <div className="relative z-10 flex min-h-screen items-center justify-center px-6 md:px-12">
            <div className="max-w-[1200px] w-full text-center">
              <h1
                data-plate="kloroform-hero"
                className="uppercase leading-[0.85] tracking-[-0.04em] italic"
                style={{
                  fontFamily: "var(--font-syne), sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(48px, 12vw, 200px)",
                }}
              >
                SIGNALFRAME<span style={{ opacity: 0.5 }}>//</span>UX
              </h1>

              <p
                className="mx-auto max-w-[60ch] mt-8 text-[13px] md:text-[14px] leading-[1.6] opacity-70"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                Six plates from one reference dossier. Every plate quotes a
                specific pack from the cdB corpus — KLOROFORM, Cyber2k, Brando
                Corp 250, Black Flag E0000, Diagrams2, Helghanese. One accent,
                one substrate, one grammar per plate.
              </p>

              <nav
                aria-label="Plate previews"
                className="mt-16 grid grid-cols-3 md:grid-cols-6 gap-3"
              >
                {TILES.map((t) => (
                  <Link
                    key={t.code}
                    href={t.href}
                    data-plate="kloroform-tile"
                    className="group border border-white/20 hover:border-white/60 p-4 no-underline transition-colors"
                    style={{ fontFamily: "var(--font-jetbrains), monospace" }}
                  >
                    <div className="text-[20px] leading-none mb-3 opacity-80">
                      {t.glyph}
                    </div>
                    <div className="text-[9px] uppercase tracking-[0.15em] opacity-60">
                      {t.code}
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.1em] mt-1">
                      {t.label}
                    </div>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </main>
      </div>
    </DossierChrome>
  );
}
```

If Step 2.3 decision was VaultPointcloud, swap the `PointcloudRing` usage for `<VaultPointcloud morphology="ring" />` (check actual props) and drop the `components/dossier/pointcloud-ring.tsx` creation.

- [ ] **Step 2.6: Run the test to verify it passes**

Run: `pnpm exec playwright test tests/cdb-dossier-kloroform.spec.ts`
Expected: all 7 tests PASS.

- [ ] **Step 2.7: Visual verification via chrome-devtools MCP**

Open `/` in a browser (chrome-devtools MCP navigate). Scroll-test. Check:
- Pointcloud ring is visible and rotating (unless reduced-motion).
- Hero wordmark `SIGNALFRAME//UX` reads in Syne italic.
- Four corner labels render in JetBrains Mono at 10–11px.
- Catalog-nav shows 6 codes with `SF//KLO-00` magenta + underlined.
- Six tiles at bottom, all clickable.
- No layout jump / CLS.

Per user memory ("Green Playwright tests on DOM shape ≠ working animation"): visual confirmation is the gate. If the ring doesn't visibly rotate, fix before commit.

- [ ] **Step 2.8: Commit**

```bash
git add app/page.tsx components/dossier/ tests/cdb-dossier-kloroform.spec.ts
git commit -m "Feat: D2 / KLOROFORM plate — pointcloud ring + Syne hero

Plate 01 of the cdb-v3-dossier series. Full-bleed black field with a
dissolving ring pointcloud at center, SIGNALFRAME//UX wordmark in Syne
italic, six plate-preview tiles linking into the rest of the dossier.

Chrome: SF//KLO-00 active catalog entry (magenta).
Font: Syne display + Space Grotesk body + JetBrains Mono chrome.
Motion: pointcloud rotates + breathes; respects prefers-reduced-motion.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Plate 02 — `/system` Cyber2k HUD

**Files:**
- Create: `components/dossier/hud-octagon-frame.tsx`
- Modify: `app/system/page.tsx`
- Create: `tests/cdb-dossier-cyber2k.spec.ts`

- [ ] **Step 3.1: Write the failing smoke test**

```ts
// tests/cdb-dossier-cyber2k.spec.ts
import { test, expect } from "@playwright/test";

test.describe("@dossier /system Cyber2k", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/system", { waitUntil: "domcontentloaded" });
  });

  test("chrome: SF//HUD-00 active", async ({ page }) => {
    const active = page.locator(
      "nav[aria-label='Dossier catalog'] a[aria-current='page']"
    );
    await expect(active).toHaveText("SF//HUD-00");
  });

  test("plate: Chakra Petch font loaded", async ({ page }) => {
    const hero = page.locator("[data-plate='cyber2k-hero']");
    const family = await hero.evaluate((el) => getComputedStyle(el).fontFamily);
    expect(family).toMatch(/Chakra Petch/i);
  });

  test("plate: octagon HUD frame renders", async ({ page }) => {
    await expect(page.locator("[data-plate='cyber2k-octagon']")).toBeVisible();
  });

  test("plate: token category legend present", async ({ page }) => {
    const legend = page.locator("[data-plate='cyber2k-legend'] li");
    await expect(legend).toHaveCount(3);
  });

  test("plate: diagnostic readout present", async ({ page }) => {
    await expect(page.locator("[data-plate='cyber2k-readout']")).toBeVisible();
  });

  test("no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
  });
});
```

Run: `pnpm exec playwright test tests/cdb-dossier-cyber2k.spec.ts`
Expected: FAIL — no `data-plate='cyber2k-*'` nodes yet.

- [ ] **Step 3.2: Create `components/dossier/hud-octagon-frame.tsx`**

```tsx
// components/dossier/hud-octagon-frame.tsx
import type { ReactNode } from "react";

// 8-sided clip-path polygon — chamfered rectangle.
// Corner cuts sized as a percentage of the smaller axis.
export function HudOctagonFrame({
  children,
  corner = 24,
  className = "",
}: {
  children: ReactNode;
  corner?: number; // px
  className?: string;
}) {
  const c = `${corner}px`;
  return (
    <div
      data-plate="cyber2k-octagon"
      className={`relative ${className}`}
      style={{
        clipPath: `polygon(
          ${c} 0,
          calc(100% - ${c}) 0,
          100% ${c},
          100% calc(100% - ${c}),
          calc(100% - ${c}) 100%,
          ${c} 100%,
          0 calc(100% - ${c}),
          0 ${c}
        )`,
        border: "1px solid oklch(0.95 0 0 / 0.5)",
        background: "transparent",
      }}
    >
      {/* Corner ticks */}
      <span aria-hidden="true" className="absolute top-2 left-2 w-3 h-px bg-white/50" />
      <span aria-hidden="true" className="absolute top-2 left-2 h-3 w-px bg-white/50" />
      <span aria-hidden="true" className="absolute top-2 right-2 w-3 h-px bg-white/50" />
      <span aria-hidden="true" className="absolute top-2 right-2 h-3 w-px bg-white/50" />
      <span aria-hidden="true" className="absolute bottom-2 left-2 w-3 h-px bg-white/50" />
      <span aria-hidden="true" className="absolute bottom-2 left-2 h-3 w-px bg-white/50" />
      <span aria-hidden="true" className="absolute bottom-2 right-2 w-3 h-px bg-white/50" />
      <span aria-hidden="true" className="absolute bottom-2 right-2 h-3 w-px bg-white/50" />
      {children}
    </div>
  );
}
```

Add to `components/dossier/index.ts` barrel.

- [ ] **Step 3.3: Rewrite `app/system/page.tsx`**

```tsx
// app/system/page.tsx
import type { Metadata } from "next";
import { Chakra_Petch } from "next/font/google";
import { DossierChrome, HudOctagonFrame } from "@/components/dossier";

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-chakra-petch",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SF//HUD-00 — Cyber2k system plate",
  description: "Dossier plate 02. Token system rendered as Cyber2k HUD.",
};

const LEGEND = [
  { label: "COLOR",   count: "49 SCALES" },
  { label: "SPACING", count: "9 STOPS" },
  { label: "MOTION",  count: "12 EASES" },
];

const READOUT_ROWS = [
  { id: "∞", name: "SIG_INT",  val: "0.00–1.00" },
  { id: "ℓ", name: "LCP_TGT",  val: "<1.0s" },
  { id: "φ", name: "CLS_TGT",  val: "0.00" },
  { id: "ψ", name: "CONTRAST", val: "≥ AA" },
];

export default function SystemPage() {
  return (
    <DossierChrome route="cyber2k" substrate="black">
      <div className={chakraPetch.variable}>
        <main className="min-h-screen px-6 md:px-16 py-24 md:py-32">
          <h1
            data-plate="cyber2k-hero"
            className="uppercase tracking-[0.02em] leading-none mb-12 md:mb-16"
            style={{
              fontFamily: "var(--font-chakra-petch), sans-serif",
              fontWeight: 700,
              fontSize: "clamp(40px, 8vw, 112px)",
            }}
          >
            TOKEN<br/>INSTRUMENT
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr_280px] gap-6 md:gap-8 items-start">

            {/* Left: legend */}
            <ul
              data-plate="cyber2k-legend"
              className="space-y-3"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            >
              {LEGEND.map((l) => (
                <li
                  key={l.label}
                  className="border border-white/20 p-3 text-[11px] uppercase tracking-[0.15em]"
                >
                  <div className="opacity-60">{l.label}</div>
                  <div className="text-[16px] mt-1">{l.count}</div>
                </li>
              ))}
            </ul>

            {/* Center: octagon with reticle */}
            <HudOctagonFrame className="aspect-square w-full max-w-[520px] mx-auto">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* brackets + waveform */}
                <div
                  className="relative w-[72%] aspect-square flex items-center justify-center"
                  style={{ fontFamily: "var(--font-chakra-petch), sans-serif" }}
                >
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[48px] leading-none opacity-60">[</span>
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[48px] leading-none opacity-60">]</span>
                  <div className="w-full text-center">
                    <div className="text-[11px] uppercase tracking-[0.2em] opacity-60" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
                      SYSTEM READOUT
                    </div>
                    <div className="text-[64px] leading-none mt-2 font-bold">SF//UX</div>
                    <div className="text-[11px] uppercase tracking-[0.2em] opacity-60 mt-3" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
                      v0.1 · LOCKED
                    </div>
                  </div>
                </div>
              </div>
            </HudOctagonFrame>

            {/* Right: diagnostic readout */}
            <div
              data-plate="cyber2k-readout"
              className="space-y-2"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            >
              {READOUT_ROWS.map((r) => (
                <div key={r.id} className="border border-white/20 px-3 py-2 flex items-baseline justify-between text-[11px] uppercase tracking-[0.12em]">
                  <span className="opacity-60">{r.id} · {r.name}</span>
                  <span style={{ color: "oklch(0.65 0.3 350)" }}>{r.val}</span>
                </div>
              ))}
              {/* pulsing bar */}
              <div className="h-px bg-white/20 relative overflow-hidden mt-6">
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1/3"
                  style={{
                    background: "oklch(0.65 0.3 350)",
                    animation: "hudPulse 3s ease-in-out infinite",
                  }}
                />
              </div>
              <style>{`
                @keyframes hudPulse {
                  0%, 100% { transform: translateX(0); opacity: 0.3; }
                  50%     { transform: translateX(200%); opacity: 1; }
                }
                @media (prefers-reduced-motion: reduce) {
                  [data-plate='cyber2k-readout'] span[aria-hidden='true'] {
                    animation: none !important;
                  }
                }
              `}</style>
            </div>
          </div>
        </main>
      </div>
    </DossierChrome>
  );
}
```

- [ ] **Step 3.4: Run the test to verify it passes**

Run: `pnpm exec playwright test tests/cdb-dossier-cyber2k.spec.ts`
Expected: all tests PASS.

- [ ] **Step 3.5: Visual verification**

Chrome-devtools MCP navigate to `/system`. Check:
- Octagon-clipped frame renders with correct chamfered corners + corner ticks.
- Chakra Petch on `TOKEN / INSTRUMENT` header.
- Legend + readout columns balanced.
- Pulsing bar animates (unless reduced-motion).
- Catalog-nav shows `SF//HUD-00` magenta active.

- [ ] **Step 3.6: Commit**

```bash
git add app/system/page.tsx components/dossier/ tests/cdb-dossier-cyber2k.spec.ts
git commit -m "Feat: D3 /system Cyber2k HUD plate

Plate 02. Replaces TokenTabs + TokenVizLoader on cdb-v3-dossier. Full-
screen HUD composition: octagon-clipped reticle center, token-category
legend left, diagnostic readout right with CSS-animated pulse bar.

Chrome: SF//HUD-00 active catalog entry.
Font: Chakra Petch display + JetBrains Mono chrome.
New primitive: HudOctagonFrame (components/dossier/hud-octagon-frame.tsx).

TokenExplorer remains available on main. This branch ships the aesthetic
plate; interactive tool lives on other branches per D0 spec tradeoff.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Plate 04 — `/inventory` Black Flag E0000

**Files:**
- Possibly create: `components/dossier/halftone-corrugated.tsx`
- Modify: `app/inventory/page.tsx`
- Create: `tests/cdb-dossier-blackflag.spec.ts`

- [ ] **Step 4.1: Write the failing smoke test**

```ts
// tests/cdb-dossier-blackflag.spec.ts
import { test, expect } from "@playwright/test";

test.describe("@dossier /inventory Black Flag", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/inventory", { waitUntil: "domcontentloaded" });
  });

  test("chrome: SF//E00-00 active", async ({ page }) => {
    const active = page.locator(
      "nav[aria-label='Dossier catalog'] a[aria-current='page']"
    );
    await expect(active).toHaveText("SF//E00-00");
  });

  test("plate: Anton font loaded on hero", async ({ page }) => {
    const hero = page.locator("[data-plate='blackflag-hero']");
    const family = await hero.evaluate((el) => getComputedStyle(el).fontFamily);
    expect(family).toMatch(/Anton/i);
  });

  test("plate: halftone wave present", async ({ page }) => {
    await expect(page.locator("[data-plate='blackflag-halftone']")).toBeVisible();
  });

  test("plate: serialized catalog has expected entries", async ({ page }) => {
    // COMPONENT_REGISTRY length — assert at least 40, allow growth.
    const entries = page.locator("[data-plate='blackflag-entry']");
    const count = await entries.count();
    expect(count).toBeGreaterThanOrEqual(40);
    expect(count).toBeLessThan(200);
  });

  test("plate: first entry has SF//E00-001 code", async ({ page }) => {
    await expect(
      page.locator("[data-plate='blackflag-entry']").first().locator("[data-plate='blackflag-code']")
    ).toHaveText("SF//E00-001");
  });

  test("no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
  });
});
```

- [ ] **Step 4.2: Decide halftone primitive**

Read `components/vault/vault-flag.tsx`. If it exposes a "halftone wave / moire" render that fits full-bleed use, reuse it directly. Otherwise create `components/dossier/halftone-corrugated.tsx`.

If creating:

```tsx
// components/dossier/halftone-corrugated.tsx
"use client";
import { useEffect, useRef } from "react";

export function HalftoneCorrugated({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    const start = performance.now();
    const draw = (now: number) => {
      const t = reduced ? 0 : (now - start) / 1000;
      const W = canvas.width;
      const H = canvas.height;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);

      const cols = 80;
      const rows = 32;
      const cw = W / cols;
      const rh = H / rows;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const wave = Math.sin((c / cols) * Math.PI * 4 + t * 1.1 + r * 0.2);
          const tilt = Math.sin((r / rows) * Math.PI * 2 - t * 0.4);
          const v = (wave + tilt) * 0.5; // -1..1
          const lightness = 0.5 + v * 0.5;
          const size = Math.max(0.2, Math.min(1, lightness)) * Math.min(cw, rh) * 0.9;
          ctx.fillStyle = `oklch(${0.85 * lightness} 0 0)`;
          ctx.fillRect(c * cw + (cw - size) / 2, r * rh + (rh - size) / 2, size, size);
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      data-plate="blackflag-halftone"
      role="img"
      aria-label="Black Flag E0000 corrugated halftone wave"
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
```

Add to barrel.

- [ ] **Step 4.3: Rewrite `app/inventory/page.tsx`**

```tsx
// app/inventory/page.tsx
import type { Metadata } from "next";
import { Anton } from "next/font/google";
import { DossierChrome, HalftoneCorrugated } from "@/components/dossier";
import { COMPONENT_REGISTRY } from "@/lib/component-registry";

const anton = Anton({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-anton",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SF//E00-00 — Black Flag inventory plate",
  description: "Dossier plate 04. Serialized component catalog as E0000 sheet.",
};

function pad(n: number) {
  return String(n).padStart(3, "0");
}

export default function InventoryPage() {
  const entries = Object.entries(COMPONENT_REGISTRY).map(([key, value], i) => ({
    idx: i + 1,
    key,
    value,
  }));

  return (
    <DossierChrome route="blackflag" substrate="black">
      <div className={anton.variable}>
        <main className="min-h-screen">
          {/* Top: halftone wave */}
          <section className="relative h-[50vh] md:h-[60vh] overflow-hidden border-b border-white/20">
            <HalftoneCorrugated className="absolute inset-0" />
            <div className="absolute inset-0 flex items-end p-6 md:p-12">
              <h1
                data-plate="blackflag-hero"
                className="uppercase leading-[0.85] tracking-[-0.02em]"
                style={{
                  fontFamily: "var(--font-anton), sans-serif",
                  fontSize: "clamp(56px, 14vw, 220px)",
                }}
              >
                INVE<br/>NTORY
              </h1>
            </div>
          </section>

          {/* Bottom: serialized catalog grid */}
          <section className="p-6 md:p-12">
            <div
              className="mb-8 text-[11px] uppercase tracking-[0.2em] opacity-60"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            >
              {entries.length} SERIALIZED COMPONENTS · E0000 SHEET
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 border-t border-l border-white/20">
              {entries.map((e) => (
                <li
                  key={e.key}
                  data-plate="blackflag-entry"
                  className="border-r border-b border-white/20 p-4 md:p-5"
                >
                  <div
                    data-plate="blackflag-code"
                    className="text-[10px] uppercase tracking-[0.18em] opacity-50"
                    style={{ fontFamily: "var(--font-jetbrains), monospace" }}
                  >
                    SF//E00-{pad(e.idx)}
                  </div>
                  <div
                    className="uppercase leading-[0.95] mt-2"
                    style={{
                      fontFamily: "var(--font-anton), sans-serif",
                      fontSize: "clamp(20px, 3vw, 36px)",
                    }}
                  >
                    {e.value?.name ?? e.key}
                  </div>
                  <div
                    className="text-[11px] mt-2 opacity-60 leading-[1.5]"
                    style={{ fontFamily: "var(--font-jetbrains), monospace" }}
                  >
                    {e.value?.description ?? "—"}
                  </div>
                  <div
                    className="text-[9px] uppercase tracking-[0.15em] opacity-40 mt-3"
                    style={{ fontFamily: "var(--font-jetbrains), monospace" }}
                  >
                    {e.value?.category ?? "—"}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </DossierChrome>
  );
}
```

Note: `COMPONENT_REGISTRY` entry shape may differ — read `lib/component-registry.ts` and adjust field access (`.name`, `.description`, `.category`) to match actual keys. This is the one place in the plan where the engineer needs to inspect existing data shape.

- [ ] **Step 4.4: Run the test to verify it passes**

Run: `pnpm exec playwright test tests/cdb-dossier-blackflag.spec.ts`
Expected: all tests PASS.

- [ ] **Step 4.5: Visual verification**

Chrome-devtools MCP `/inventory`. Check:
- Top half: halftone wave undulates (unless reduced-motion).
- `INVE/NTORY` in Anton extreme-condensed, hero-scale.
- Bottom grid dense but legible.
- No CLS from halftone canvas mount.

- [ ] **Step 4.6: Commit**

```bash
git add app/inventory/page.tsx components/dossier/ tests/cdb-dossier-blackflag.spec.ts
git commit -m "Feat: D4 /inventory Black Flag E0000 plate

Plate 04. Retires ComponentsExplorer on cdb-v3-dossier. Top-half
corrugated-halftone wave, bottom-half serialized catalog grid — one
entry per COMPONENT_REGISTRY item, coded SF//E00-NNN.

Chrome: SF//E00-00 active catalog entry.
Font: Anton display + JetBrains Mono catalog labels.
New primitive: HalftoneCorrugated (if not reusing vault-flag.tsx).

Live-preview component explorer remains on main; this plate is a
poster-as-inventory sheet.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Plate 05 — `/builds` + `/builds/[slug]` Diagrams2

**Files:**
- Create: `components/dossier/build-schematic.tsx`
- Modify: `app/builds/page.tsx`
- Modify: `app/builds/[slug]/page.tsx`
- Create: `tests/cdb-dossier-diagrams2.spec.ts`

- [ ] **Step 5.1: Write the failing smoke test**

```ts
// tests/cdb-dossier-diagrams2.spec.ts
import { test, expect } from "@playwright/test";

test.describe("@dossier /builds Diagrams2", () => {
  test("index: paper substrate applied", async ({ page }) => {
    await page.goto("/builds", { waitUntil: "domcontentloaded" });
    const root = page.locator("[data-dossier-route='diagrams2']");
    await expect(root).toHaveAttribute("data-substrate", "paper-warm");
  });

  test("index: IBM Plex Sans Condensed on title", async ({ page }) => {
    await page.goto("/builds", { waitUntil: "domcontentloaded" });
    const title = page.locator("[data-plate='diagrams2-title']");
    const family = await title.evaluate((el) => getComputedStyle(el).fontFamily);
    expect(family).toMatch(/Plex/i);
  });

  test("index: schematic has 6 build nodes", async ({ page }) => {
    await page.goto("/builds", { waitUntil: "domcontentloaded" });
    const nodes = page.locator("[data-plate='diagrams2-node']");
    await expect(nodes).toHaveCount(6);
  });

  test("index: nodes link to /builds/[slug]", async ({ page }) => {
    await page.goto("/builds", { waitUntil: "domcontentloaded" });
    const firstNode = page.locator("[data-plate='diagrams2-node']").first();
    const href = await firstNode.locator("a").getAttribute("href");
    expect(href).toMatch(/^\/builds\/.+$/);
  });

  test("detail: renders with same substrate", async ({ page }) => {
    // Load /builds first to get a valid slug
    await page.goto("/builds", { waitUntil: "domcontentloaded" });
    const href = await page
      .locator("[data-plate='diagrams2-node'] a")
      .first()
      .getAttribute("href");
    await page.goto(href!, { waitUntil: "domcontentloaded" });
    const root = page.locator("[data-dossier-route='diagrams2']");
    await expect(root).toHaveAttribute("data-substrate", "paper-warm");
  });
});
```

- [ ] **Step 5.2: Create `components/dossier/build-schematic.tsx`**

```tsx
// components/dossier/build-schematic.tsx
import Link from "next/link";
import type { ReactNode } from "react";

export type SchematicNode = {
  slug: string;
  code: string;
  label: string;
  subject: string;
  kind: "transformer" | "relay" | "cathode" | "plate";
};

const NODE_GLYPH: Record<SchematicNode["kind"], ReactNode> = {
  transformer: (
    <svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
      <circle cx="20" cy="30" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="40" cy="30" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <line x1="0"  y1="30" x2="10" y2="30" stroke="currentColor" strokeWidth="1.5" />
      <line x1="50" y1="30" x2="60" y2="30" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  relay: (
    <svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
      <rect x="10" y="20" width="40" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <line x1="0"  y1="30" x2="10" y2="30" stroke="currentColor" strokeWidth="1.5" />
      <line x1="50" y1="30" x2="60" y2="30" stroke="currentColor" strokeWidth="1.5" />
      <line x1="30" y1="20" x2="30" y2="10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  cathode: (
    <svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
      <line x1="0"  y1="30" x2="25" y2="30" stroke="currentColor" strokeWidth="1.5" />
      <line x1="25" y1="20" x2="25" y2="40" stroke="currentColor" strokeWidth="2" />
      <polygon points="35,20 35,40 25,30" fill="currentColor" />
      <line x1="35" y1="30" x2="60" y2="30" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  plate: (
    <svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
      <rect x="15" y="15" width="30" height="30" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="1.5" />
      <line x1="0"  y1="30" x2="15" y2="30" stroke="currentColor" strokeWidth="1.5" />
      <line x1="45" y1="30" x2="60" y2="30" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
};

export function BuildSchematic({ nodes }: { nodes: SchematicNode[] }) {
  // Lay nodes out as two rows of 3, connected by polyline.
  // Paper-warm + red-ink aesthetic.
  return (
    <div
      className="relative w-full"
      style={{
        fontFamily: "var(--font-ibm-plex-mono), monospace",
        color: "oklch(0.35 0.18 28)",
      }}
    >
      <svg
        viewBox="0 0 1200 520"
        className="w-full h-auto"
        role="img"
        aria-label="Build schematic — six conceptual SFUX builds wired as a circuit diagram"
      >
        {/* Wires — horizontal connectors between rows */}
        <g stroke="currentColor" strokeWidth="1" fill="none">
          <polyline points="40,120 1160,120" />
          <polyline points="40,400 1160,400" />
          <line x1="40"   y1="120" x2="40"   y2="400" />
          <line x1="1160" y1="120" x2="1160" y2="400" />
        </g>
      </svg>
      <ul className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-4 p-8 list-none">
        {nodes.map((n, i) => (
          <li
            key={n.slug}
            data-plate="diagrams2-node"
            className="flex items-center justify-center"
          >
            <Link
              href={`/builds/${n.slug}`}
              className="no-underline text-center group"
              style={{ color: "currentColor" }}
            >
              <div className="flex justify-center group-hover:scale-110 transition-transform">
                {NODE_GLYPH[n.kind]}
              </div>
              <div
                className="text-[10px] uppercase tracking-[0.18em] mt-2 opacity-60"
              >
                {n.code}
              </div>
              <div
                className="text-[14px] uppercase tracking-[0.02em] mt-1"
                style={{ fontFamily: "var(--font-ibm-plex-sans-condensed), sans-serif", fontWeight: 600 }}
              >
                {n.label}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

Add to barrel.

- [ ] **Step 5.3: Rewrite `app/builds/page.tsx`**

```tsx
// app/builds/page.tsx
import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans_Condensed } from "next/font/google";
import { DossierChrome, BuildSchematic, type SchematicNode } from "@/components/dossier";
import { BUILDS } from "@/app/builds/builds-data";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const ibmPlexSansCondensed = IBM_Plex_Sans_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-sans-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SF//DGM-00 — Diagrams2 build schematic",
  description: "Dossier plate 05. Conceptual SFUX builds rendered as a circuit diagram.",
};

const KINDS: SchematicNode["kind"][] = [
  "transformer", "relay", "cathode", "plate", "transformer", "relay",
];

export default function BuildsPage() {
  const nodes: SchematicNode[] = BUILDS.map((b, i) => ({
    slug: b.slug,
    code: b.code,
    label: b.title,
    subject: b.subject,
    kind: KINDS[i % KINDS.length],
  }));

  return (
    <DossierChrome route="diagrams2" substrate="paper-warm">
      <div className={`${ibmPlexMono.variable} ${ibmPlexSansCondensed.variable}`}>
        <main className="min-h-screen px-6 md:px-16 py-24 md:py-32">
          <h1
            data-plate="diagrams2-title"
            className="uppercase tracking-[0.01em] leading-[0.95] mb-12"
            style={{
              fontFamily: "var(--font-ibm-plex-sans-condensed), sans-serif",
              fontWeight: 600,
              fontSize: "clamp(36px, 7vw, 96px)",
              color: "oklch(0.25 0.18 28)",
            }}
          >
            SIGNALFRAME//UX<br/>BUILD SCHEMATIC
          </h1>

          <div className="text-[11px] uppercase tracking-[0.2em] mb-10 opacity-70" style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}>
            {BUILDS.length} conceptual builds · frame + signal in practice
          </div>

          <BuildSchematic nodes={nodes} />
        </main>
      </div>
    </DossierChrome>
  );
}
```

- [ ] **Step 5.4: Rewrite `app/builds/[slug]/page.tsx`**

Read the current file first to confirm params/data shape. Then:

```tsx
// app/builds/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IBM_Plex_Mono, IBM_Plex_Sans_Condensed } from "next/font/google";
import { DossierChrome } from "@/components/dossier";
import { BUILDS } from "@/app/builds/builds-data";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});
const ibmPlexSansCondensed = IBM_Plex_Sans_Condensed({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-ibm-plex-sans-condensed",
  display: "swap",
});

export async function generateStaticParams() {
  return BUILDS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const build = BUILDS.find((b) => b.slug === slug);
  return {
    title: `${build?.code ?? "SF//DGM"} — ${build?.title ?? "build"}`,
  };
}

export default async function BuildDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const build = BUILDS.find((b) => b.slug === slug);
  if (!build) notFound();

  return (
    <DossierChrome route="diagrams2" substrate="paper-warm">
      <div className={`${ibmPlexMono.variable} ${ibmPlexSansCondensed.variable}`}>
        <main className="min-h-screen px-6 md:px-16 py-24 md:py-32" style={{ color: "oklch(0.25 0.18 28)" }}>
          <div className="text-[11px] uppercase tracking-[0.2em] opacity-70 mb-4"
               style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}>
            {build.code}
          </div>
          <h1
            className="uppercase tracking-[0.01em] leading-[0.95] max-w-[24ch]"
            style={{
              fontFamily: "var(--font-ibm-plex-sans-condensed), sans-serif",
              fontWeight: 600,
              fontSize: "clamp(36px, 6vw, 80px)",
            }}
          >
            {build.title}
          </h1>
          <div className="mt-6 text-[12px] uppercase tracking-[0.15em] opacity-70"
               style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}>
            {build.subject} · status: {build.status}
          </div>

          <div className="mt-16 max-w-[60ch] space-y-6 text-[15px] leading-[1.7]"
               style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            <p>{build.concept}</p>
            <p><strong>FRAME:</strong> {build.frameUse}</p>
            <p><strong>SIGNAL:</strong> {build.signalUse}</p>
          </div>

          <div className="mt-16 text-[11px] uppercase tracking-[0.2em] opacity-60"
               style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}>
            <a href="/builds" style={{ color: "currentColor" }}>← back to schematic</a>
          </div>
        </main>
      </div>
    </DossierChrome>
  );
}
```

Note: confirm `BUILDS` data shape (`slug`, `code`, `title`, `subject`, `status`, `concept`, `frameUse`, `signalUse`) matches what's read earlier. If not, adjust field access.

- [ ] **Step 5.5: Run the test to verify it passes**

Run: `pnpm exec playwright test tests/cdb-dossier-diagrams2.spec.ts`
Expected: all tests PASS.

- [ ] **Step 5.6: Visual verification**

Chrome-devtools MCP `/builds`. Check:
- Paper-warm substrate applied (off-white, not black).
- Red ink rendering across all nodes + title.
- 6 schematic nodes laid out in two rows, connected by wire polylines.
- Clicking a node navigates to `/builds/[slug]`, same substrate, different content.

- [ ] **Step 5.7: Commit**

```bash
git add app/builds/ components/dossier/ tests/cdb-dossier-diagrams2.spec.ts
git commit -m "Feat: D5 /builds Diagrams2 schematic plate + sub-route

Plate 05 + /builds/[slug]. Paper-warm substrate with red-ink circuit
diagram — six conceptual SFUX builds rendered as transformer/relay/
cathode/plate nodes wired together. Each node links to a detail page
in the same schematic language.

Chrome: SF//DGM-00 active catalog entry.
Font: IBM Plex Sans Condensed display + IBM Plex Mono chrome.
New primitive: BuildSchematic (components/dossier/build-schematic.tsx).

Retires BuildSigilDiagram + card-grid on cdb-v3-dossier.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Plate 03 — `/reference` Brando Corp 250 Y2K

**Files:**
- Create: `components/dossier/y2k-mark-grid.tsx`
- Modify: `app/reference/page.tsx`
- Create: `tests/cdb-dossier-brando.spec.ts`

- [ ] **Step 6.1: Write the failing smoke test**

```ts
// tests/cdb-dossier-brando.spec.ts
import { test, expect } from "@playwright/test";

test.describe("@dossier /reference Brando Y2K", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/reference", { waitUntil: "domcontentloaded" });
  });

  test("chrome: SF//MRK-00 active", async ({ page }) => {
    const active = page.locator(
      "nav[aria-label='Dossier catalog'] a[aria-current='page']"
    );
    await expect(active).toHaveText("SF//MRK-00");
  });

  test("substrate: paper-cream applied", async ({ page }) => {
    const root = page.locator("[data-dossier-route='brando']");
    await expect(root).toHaveAttribute("data-substrate", "paper-cream");
  });

  test("plate: Archivo Black on hero", async ({ page }) => {
    const hero = page.locator("[data-plate='brando-hero']");
    const family = await hero.evaluate((el) => getComputedStyle(el).fontFamily);
    expect(family).toMatch(/Archivo/i);
  });

  test("plate: 60 mark tiles render", async ({ page }) => {
    const marks = page.locator("[data-plate='brando-mark']");
    await expect(marks).toHaveCount(60);
  });

  test("plate: exactly one mark is magenta-lit", async ({ page }) => {
    const lit = page.locator("[data-plate='brando-mark'][data-lit='true']");
    await expect(lit).toHaveCount(1);
  });
});
```

- [ ] **Step 6.2: Create `components/dossier/y2k-mark-grid.tsx`**

Ten SVG shape generators, seeded by index so output is deterministic.

```tsx
// components/dossier/y2k-mark-grid.tsx
import type { ReactNode } from "react";

type MarkProps = { size?: number; color?: string };

function Hexagon({ size = 60, color = "currentColor" }: MarkProps) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} aria-hidden="true">
      <polygon points="30,4 54,18 54,42 30,56 6,42 6,18" fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}
function Recycle({ size = 60, color = "currentColor" }: MarkProps) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="2">
        <path d="M15 35 L22 22 L29 35 Z" />
        <path d="M45 35 L38 22 L31 35 Z" />
        <path d="M30 50 L23 42 L37 42 Z" />
      </g>
    </svg>
  );
}
function Asterisk({ size = 60, color = "currentColor" }: MarkProps) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} aria-hidden="true">
      <g stroke={color} strokeWidth="3" strokeLinecap="square">
        <line x1="30" y1="10" x2="30" y2="50" />
        <line x1="10" y1="30" x2="50" y2="30" />
        <line x1="16" y1="16" x2="44" y2="44" />
        <line x1="44" y1="16" x2="16" y2="44" />
      </g>
    </svg>
  );
}
function NestedCubes({ size = 60, color = "currentColor" }: MarkProps) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} aria-hidden="true">
      <rect x="10" y="10" width="40" height="40" fill="none" stroke={color} strokeWidth="2" />
      <rect x="20" y="20" width="20" height="20" fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}
function Peace({ size = 60, color = "currentColor" }: MarkProps) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} aria-hidden="true">
      <circle cx="30" cy="30" r="24" fill="none" stroke={color} strokeWidth="2" />
      <line x1="30" y1="6" x2="30" y2="54" stroke={color} strokeWidth="2" />
      <line x1="30" y1="30" x2="12" y2="48" stroke={color} strokeWidth="2" />
      <line x1="30" y1="30" x2="48" y2="48" stroke={color} strokeWidth="2" />
    </svg>
  );
}
function Target({ size = 60, color = "currentColor" }: MarkProps) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} aria-hidden="true">
      <circle cx="30" cy="30" r="24" fill="none" stroke={color} strokeWidth="2" />
      <circle cx="30" cy="30" r="14" fill="none" stroke={color} strokeWidth="2" />
      <circle cx="30" cy="30" r="5" fill={color} />
    </svg>
  );
}
function Triad({ size = 60, color = "currentColor" }: MarkProps) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} aria-hidden="true">
      <polygon points="30,8 52,50 8,50" fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}
function Orbit({ size = 60, color = "currentColor" }: MarkProps) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} aria-hidden="true">
      <circle cx="30" cy="30" r="6" fill={color} />
      <ellipse cx="30" cy="30" rx="22" ry="10" fill="none" stroke={color} strokeWidth="2" />
      <ellipse cx="30" cy="30" rx="10" ry="22" fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}
function Spiral({ size = 60, color = "currentColor" }: MarkProps) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} aria-hidden="true">
      <path d="M30 30 m 0,-4 a 4,4 0 1,1 -0.1,0 m 8,4 a 12,12 0 1,1 -0.1,0 m -12,-14 a 22,22 0 1,1 0.2,0" fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}
function Arrows(): ReactNode {
  return (
    <svg viewBox="0 0 60 60" width={60} height={60} aria-hidden="true">
      <g stroke="currentColor" strokeWidth="2" fill="none">
        <path d="M10 30 L50 30" />
        <path d="M44 24 L50 30 L44 36" />
        <path d="M30 10 L30 50" />
        <path d="M24 44 L30 50 L36 44" />
      </g>
    </svg>
  );
}

const SHAPES = [Hexagon, Recycle, Asterisk, NestedCubes, Peace, Target, Triad, Orbit, Spiral, () => <Arrows />];

function pad(n: number) { return String(n).padStart(3, "0"); }

export function Y2KMarkGrid({ count = 60, litIndex = 42 }: { count?: number; litIndex?: number }) {
  return (
    <ul className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-0 border-t border-l" style={{ borderColor: "oklch(0.15 0 0 / 0.4)" }}>
      {Array.from({ length: count }, (_, i) => {
        const Shape = SHAPES[i % SHAPES.length];
        const isLit = i + 1 === litIndex;
        return (
          <li
            key={i}
            data-plate="brando-mark"
            data-lit={isLit ? "true" : "false"}
            className="border-r border-b p-3 flex flex-col items-center justify-center aspect-square"
            style={{
              borderColor: "oklch(0.15 0 0 / 0.4)",
              color: isLit ? "oklch(0.65 0.3 350)" : "oklch(0.15 0 0)",
            }}
          >
            <Shape size={40} />
            <div
              className="text-[9px] uppercase tracking-[0.15em] mt-2"
              style={{ fontFamily: "var(--font-jetbrains), monospace", opacity: isLit ? 1 : 0.6 }}
            >
              SF//MRK-{pad(i + 1)}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
```

Add to barrel.

- [ ] **Step 6.3: Rewrite `app/reference/page.tsx`**

```tsx
// app/reference/page.tsx
import type { Metadata } from "next";
import { Archivo, Archivo_Black } from "next/font/google";
import Link from "next/link";
import { DossierChrome, Y2KMarkGrid } from "@/components/dossier";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-archivo",
  display: "swap",
});
const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-archivo-black",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SF//MRK-00 — Brando Y2K reference plate",
  description: "Dossier plate 03. Catalog of SFUX reference marks.",
};

export default function ReferencePage() {
  return (
    <DossierChrome route="brando" substrate="paper-cream">
      <div className={`${archivo.variable} ${archivoBlack.variable}`}>
        <main className="min-h-screen px-6 md:px-12 py-24 md:py-28">

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_42ch] gap-10 md:gap-16 items-start">
            <h1
              data-plate="brando-hero"
              className="uppercase tracking-[-0.02em] leading-[0.88]"
              style={{
                fontFamily: "var(--font-archivo-black), sans-serif",
                fontSize: "clamp(48px, 11vw, 180px)",
                color: "oklch(0.15 0 0)",
              }}
            >
              API<br/>REFERENCE
            </h1>
            <div
              className="text-[13px] leading-[1.7] max-w-[44ch]"
              style={{ fontFamily: "var(--font-archivo), sans-serif", color: "oklch(0.2 0 0)" }}
            >
              <p>
                SignalframeUX exposes a programmable surface — 54 components, 49 color scales, 9 spacing stops, 12 easings. The marks below catalog the system's reference vocabulary, Brando-style.
              </p>
              <p className="mt-4">
                Every mark is serialized. Look for <strong>SF//MRK-042</strong> — it is the one you are meant to notice.
              </p>
              <p className="mt-6 text-[11px] uppercase tracking-[0.15em] opacity-70">
                → <Link href="/inventory" style={{ color: "inherit" }}>see component inventory for props and live previews</Link>
              </p>
            </div>
          </div>

          <div className="mt-16 md:mt-20">
            <Y2KMarkGrid count={60} litIndex={42} />
          </div>
        </main>
      </div>
    </DossierChrome>
  );
}
```

- [ ] **Step 6.4: Run the test to verify it passes**

Run: `pnpm exec playwright test tests/cdb-dossier-brando.spec.ts`
Expected: all tests PASS.

- [ ] **Step 6.5: Visual verification**

Chrome-devtools MCP `/reference`. Check:
- Paper-cream substrate applied, text becomes black-ink.
- Catalog nav corners + chrome read in black (not white) — verify `CornerLabel` text color inherits from chrome's `color` style.
- `API / REFERENCE` in Archivo Black.
- 60 marks in grid, `SF//MRK-042` magenta-lit.

*Potential chrome-readability fix:* If corner labels are invisible on paper-cream (white-on-white), fix by making `CornerLabel` inherit `color` from its parent rather than hardcode — the chrome already sets `color` on the substrate wrapper. If `CornerLabel` is `position: fixed` (it is), it escapes the substrate wrapper. Add a color-mode prop to `DossierChrome` OR have `DossierChrome` set a CSS variable `--dossier-ink` on the root that `CornerLabel` reads:

```tsx
// Inside DossierChrome's style prop:
style={{ background: s.background, color: s.color, ["--dossier-ink" as any]: s.color }}
// Inside CornerLabel:
className="... text-[var(--dossier-ink,oklch(0.95_0_0))]"
```

If this fix is needed, apply it in Task 1 retroactively before committing Task 6. Add "substrate ink inheritance" to the commit message if so.

- [ ] **Step 6.6: Commit**

```bash
git add app/reference/page.tsx components/dossier/ tests/cdb-dossier-brando.spec.ts
git commit -m "Feat: D6 /reference Brando Y2K plate

Plate 03. Paper-cream substrate break — first non-black-field plate.
60 Y2K-style trademark marks in a 10-column SVG grid, each labeled
SF//MRK-NNN. Mark 042 is lit magenta as the 'one you are meant to
notice'. Retires APIExplorer on cdb-v3-dossier.

Chrome: SF//MRK-00 active catalog entry. Corner labels inherit
substrate ink via --dossier-ink variable (black on paper, white on
black).
Font: Archivo Black display + Archivo regular + JetBrains Mono chrome.
New primitive: Y2KMarkGrid (10 SVG shape generators).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Plate 06 — `/init` Helghanese + NCL terminal

**Files:**
- Create: `components/dossier/terminal-session.tsx`
- Modify: `app/init/page.tsx`
- Create: `tests/cdb-dossier-helghanese.spec.ts`

- [ ] **Step 7.1: Write the failing smoke test**

```ts
// tests/cdb-dossier-helghanese.spec.ts
import { test, expect } from "@playwright/test";

test.describe("@dossier /init Helghanese", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/init", { waitUntil: "domcontentloaded" });
  });

  test("chrome: SF//HLG-00 active with lime-green", async ({ page }) => {
    const active = page.locator(
      "nav[aria-label='Dossier catalog'] a[aria-current='page']"
    );
    await expect(active).toHaveText("SF//HLG-00");
    const color = await active.evaluate((el) => getComputedStyle(el).color);
    // lime-green oklch(0.8 0.2 135) → sRGB approx rgb(148, 230, 0)
    expect(color).toMatch(/rgb\(\s*1[0-9]{2},\s*2[0-9]{2},\s*\d+\s*\)/);
  });

  test("plate: Zen Dots header loaded", async ({ page }) => {
    const header = page.locator("[data-plate='helghanese-header']");
    const family = await header.evaluate((el) => getComputedStyle(el).fontFamily);
    expect(family).toMatch(/Zen Dots/i);
  });

  test("plate: terminal session has at least 8 output lines", async ({ page }) => {
    const lines = page.locator("[data-plate='helghanese-line']");
    const count = await lines.count();
    expect(count).toBeGreaterThanOrEqual(8);
  });

  test("plate: blinking cursor present", async ({ page }) => {
    await expect(page.locator("[data-plate='helghanese-cursor']")).toBeVisible();
  });
});
```

- [ ] **Step 7.2: Create `components/dossier/terminal-session.tsx`**

```tsx
// components/dossier/terminal-session.tsx
type Line = { prompt?: boolean; text: string; intent?: "normal" | "ok" | "warn" };

export function TerminalSession({ lines }: { lines: Line[] }) {
  return (
    <pre
      className="whitespace-pre-wrap leading-[1.7] text-[12px] md:text-[13px]"
      style={{ fontFamily: "var(--font-share-tech-mono), monospace" }}
    >
      {lines.map((l, i) => (
        <div
          key={i}
          data-plate="helghanese-line"
          style={{
            color:
              l.intent === "ok" ? "oklch(0.8 0.2 135)" :
              l.intent === "warn" ? "oklch(0.75 0.2 85)" :
              "oklch(0.85 0 0)",
            opacity: l.intent ? 1 : 0.85,
          }}
        >
          {l.prompt ? "$ " : ""}
          {l.text}
        </div>
      ))}
      <span
        data-plate="helghanese-cursor"
        aria-hidden="true"
        style={{
          display: "inline-block",
          width: "0.6em",
          height: "1em",
          background: "oklch(0.8 0.2 135)",
          verticalAlign: "text-bottom",
          animation: "helghBlink 1.1s steps(1) infinite",
        }}
      />
      <style>{`
        @keyframes helghBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-plate='helghanese-cursor'] { animation: none !important; opacity: 1 !important; }
        }
      `}</style>
    </pre>
  );
}
```

Add to barrel.

- [ ] **Step 7.3: Rewrite `app/init/page.tsx`**

```tsx
// app/init/page.tsx
import type { Metadata } from "next";
import { Zen_Dots, Share_Tech_Mono } from "next/font/google";
import { DossierChrome, TerminalSession } from "@/components/dossier";

const zenDots = Zen_Dots({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-zen-dots",
  display: "swap",
});
const shareTech = Share_Tech_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-share-tech-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SF//HLG-00 — Helghanese init plate",
  description: "Dossier plate 06. Parallel-world terminal session.",
};

const SESSION = [
  { prompt: true,  text: "npx signalframeux init" },
  { text: "» reading dossier...              [ok]", intent: "ok" as const },
  { text: "» resolving reference packs (6)...[ok]", intent: "ok" as const },
  { text: "» downloading signal shaders...   [ok]", intent: "ok" as const },
  { text: "» compiling frame primitives...   [ok]", intent: "ok" as const },
  { text: "» calibrating lime-green accent.. [ok]", intent: "ok" as const },
  { text: "» projecting parallel timeline... [ok]", intent: "ok" as const },
  { text: "» handshake: CULTURE DIVISION     [ok]", intent: "ok" as const },
  { text: "" },
  { text: "installed. you are now in the parallel timeline." },
  { text: "" },
  { text: "» exit 0" },
];

export default function InitPage() {
  return (
    <DossierChrome route="helghanese" substrate="black">
      <div className={`${zenDots.variable} ${shareTech.variable}`}>
        <main className="min-h-screen grid grid-rows-[auto_1fr_auto] px-6 md:px-16 py-24 md:py-32">

          <h1
            data-plate="helghanese-header"
            className="uppercase tracking-[0.02em] leading-none"
            style={{
              fontFamily: "var(--font-zen-dots), monospace",
              fontSize: "clamp(22px, 4vw, 56px)",
              color: "oklch(0.8 0.2 135)",
            }}
          >
            SF//UX INIT v0.1
          </h1>

          <div className="grid grid-cols-[auto_1fr_auto] gap-10 md:gap-16 items-start mt-16">

            {/* Left margin: repeating glyph column (Helghanese-like) */}
            <div
              aria-hidden="true"
              className="text-[22px] leading-[1.4] opacity-40 flex flex-col gap-1"
              style={{ fontFamily: "var(--font-zen-dots), monospace" }}
            >
              {"◆◈◆◉◇◈◆◉◇◈◆".split("").map((g, i) => (
                <span key={i}>{g}</span>
              ))}
            </div>

            {/* Center: terminal session */}
            <div>
              <TerminalSession lines={SESSION} />
            </div>

            {/* Right margin: vertical repeated wordmark */}
            <div
              aria-hidden="true"
              className="uppercase opacity-40 text-[11px] tracking-[0.3em] [writing-mode:vertical-rl] rotate-180"
              style={{ fontFamily: "var(--font-share-tech-mono), monospace" }}
            >
              PARALLEL WORLDS · PARALLEL WORLDS · PARALLEL WORLDS
            </div>
          </div>

          <p
            className="mt-16 max-w-[60ch] text-[13px] opacity-70 leading-[1.7]"
            style={{ fontFamily: "var(--font-share-tech-mono), monospace" }}
          >
            To adopt SignalframeUX, run the install sequence above. The system
            resolves against its dossier — six reference plates, one coherent
            grammar. This page is the only plate in the system that breaks the
            one-accent rule; everything else uses magenta.
          </p>
        </main>
      </div>
    </DossierChrome>
  );
}
```

- [ ] **Step 7.4: Run the test to verify it passes**

Run: `pnpm exec playwright test tests/cdb-dossier-helghanese.spec.ts`
Expected: all tests PASS.

Note: the lime-green RGB assertion in the test uses an approximate range; if it fails on your system, widen the regex or compute expected RGB from the oklch value.

- [ ] **Step 7.5: Visual verification**

Chrome-devtools MCP `/init`. Check:
- Catalog-nav active entry renders LIME-GREEN (not magenta).
- Zen Dots on `SF//UX INIT v0.1` header.
- Terminal session reads as a real CLI session.
- Cursor blinks at the bottom (unless reduced-motion).
- Left glyph column + right repeated wordmark frame the terminal.

- [ ] **Step 7.6: Commit**

```bash
git add app/init/page.tsx components/dossier/ tests/cdb-dossier-helghanese.spec.ts
git commit -m "Feat: D7 /init Helghanese parallel-world plate

Plate 06. Breaks the one-accent rule on purpose: magenta replaced by
lime-green (oklch 0.8 0.2 135) everywhere on this plate including the
catalog-nav active state. Full-viewport terminal-session metaphor —
simulated npx signalframeux init run flanked by a Helghanese-glyph
column and a vertical 'PARALLEL WORLDS' wordmark.

Chrome: SF//HLG-00 active catalog entry, lime-green per D0 spec C3.
Font: Zen Dots display + Share Tech Mono terminal body.
New primitive: TerminalSession (components/dossier/terminal-session.tsx).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Verification and branch close

**Files:**
- None created; verification task.

- [ ] **Step 8.1: Run the full dossier suite**

Run: `pnpm exec playwright test tests/cdb-dossier-*.spec.ts`
Expected: every dossier spec passes.

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm build`
Expected: successful production build.

- [ ] **Step 8.2: Cross-route navigation smoke**

Start dev server. In chrome-devtools MCP, navigate through all six catalog entries starting from `/`. On each:
- Catalog nav highlight matches current route.
- On `/init`, highlight is lime-green; on every other plate, magenta.
- Back/forward browser nav works (no client-side errors).

- [ ] **Step 8.3: Lighthouse spot-check**

Via chrome-devtools MCP `lighthouse_audit` on `/` and `/system` (black-field plates) and `/reference` (paper plate).
Target: ≥ 95 Performance / ≥ 100 Accessibility / ≥ 95 Best Practices / ≥ 100 SEO.

If any plate fails Accessibility < 100, open the failures and fix before close. Most likely issues: contrast on muted foreground, aria labels on canvas elements.

- [ ] **Step 8.4: Page-weight check**

Via `pnpm build` output: initial bundle per route. Target < 200KB excluding fonts per CLAUDE.md.

If over: the most likely culprit is eager canvas primitives on `/` (KLOROFORM) and `/inventory` (halftone). Add `"use client"` dynamic imports via `next/dynamic` with `ssr: false` if needed.

- [ ] **Step 8.5: Branch summary commit**

```bash
# Only needed if any Task 8 fixes were applied — otherwise skip.
git add -u
git commit -m "Chore: D8 cdb-v3-dossier verification pass

Full dossier Playwright suite green. Typecheck + production build
clean. Lighthouse ≥ 95/100/95/100 on /, /system, /reference. Bundle
under 200KB initial per route.

Branch ready for review. No plans to merge to main — this is a
parallel aesthetic branch per cdb-v2-broadcast thesis.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 8.6: Final diff audit**

Run: `git diff main...cdb-v3-dossier --stat`
Confirm: only `app/*/page.tsx`, `app/layout.tsx`, `components/dossier/**`, `tests/cdb-dossier-*.spec.ts`, and `docs/superpowers/**` touched. Nothing in `components/sf/*`, `components/blocks/*`, `components/animation/*`, `components/ui/*`, `components/layout/*`, or `lib/*`.

If anything outside scope changed, audit and revert — this branch is supposed to be a clean parallel-aesthetic swap.

---

## Self-review checklist (author ran this before shipping the plan)

- **Spec coverage:** Every plate in spec §Per-route plates has a task. Chrome + font slate covered by Task 1. Catalog nav lime-green break covered in Task 1 + verified in Task 7. `/builds/[slug]` covered in Task 5. Substrate breaks (paper-cream for Brando, paper-warm for Diagrams2) covered in Task 1 `substrateStyle` + Tasks 5/6.
- **Placeholder scan:** No "TBD" / "implement later" / "handle edge cases" phrases. Each step has concrete code or exact commands. Two pragmatic decision gates (Step 2.3 pointcloud rendering + Step 4.2 halftone reuse) are framed as inspect-then-decide with both branches fully coded.
- **Type consistency:** `DossierRoute` union used consistently. `SchematicNode` defined in `build-schematic.tsx`, imported in `app/builds/page.tsx`. `Substrate` values (`black`/`paper-cream`/`paper-warm`) used uniformly.
- **Known ambiguities flagged:** `COMPONENT_REGISTRY` entry shape (Task 4) and `BUILDS` data shape (Task 5) both call out: "confirm field access matches actual data." Engineer must read the data file before writing the access — marked explicitly.
