# SignalframeUX Experience Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign SignalframeUX from a functional design system showcase into a desire-driven portfolio piece + API product that gets Grey hired and makes developers want to use it.

**Architecture:** 5 pages redesigned in dependency order. Shared visual language changes land first (globals.css, nav, footer), then pages from highest impact to lowest (homepage → components → tokens → reference → start). Each task produces a committable, visually verifiable change.

**Tech Stack:** Next.js 15.3, TypeScript 5.8, Tailwind v4, GSAP 3.12, Lenis, shiki, OKLCH, Anton/Inter/JetBrains Mono/Electrolize

**Spec:** `docs/superpowers/specs/2026-04-07-signalframeux-redesign.md`

---

## Task 1: Visual Language — Globals & Dark Dominant Default

**Files:**
- Modify: `app/globals.css`

This task removes the yellow/light-first aesthetic and establishes the dark-dominant, magenta-accent-only visual language across the entire site.

- [ ] **Step 1: Commit current state as rollback point**

```bash
cd ~/code/projects/SignalframeUX
git add -A && git commit -m "Chore: pre-redesign snapshot"
```

- [ ] **Step 2: Update light theme colors in globals.css**

In `app/globals.css`, update the `@theme` block. The light theme shifts darker — background stays white but all accent/yellow surfaces are removed. The yellow band color (`--sf-yellow-band`) and related yellow tokens must be neutralized.

Find all `--sf-yellow` references in globals.css and set them to use the existing foreground/background tokens instead. The manifesto band will use `bg-foreground text-background` (black band, white text) instead of yellow.

```css
/* Replace any --sf-yellow-band or yellow surface tokens with: */
--sf-yellow-band: oklch(0.145 0 0); /* foreground black */
```

- [ ] **Step 3: Verify no yellow remains**

```bash
cd ~/code/projects/SignalframeUX
grep -rn "yellow\|#FFD\|ffd\|oklch.*98\|sf-yellow" app/globals.css components/ --include="*.tsx" --include="*.css" | grep -v node_modules | grep -v ".planning"
```

Review output. Any yellow references in component files will be addressed in their respective page tasks.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "Feat: remove yellow from visual language — dark dominant, magenta only"
```

---

## Task 2: Footer — Culture Division Signature

**Files:**
- Modify: `components/layout/footer.tsx`

Replace "By Grey Altaer" with Culture Division branding. Tighten the footer to a maker's mark, not a sitemap.

- [ ] **Step 1: Update footer.tsx**

In `components/layout/footer.tsx`, change:
- "By Grey Altaer" → "Culture Division"
- "Universal design system" → "Design system for digital surfaces"
- Keep the install command block — it's good
- Keep the docs/resources links — they serve the API-first goal
- Update copyright: "© 2026 SIGNALFRAMEUX" → "© 2026 CULTURE DIVISION"
- "SIGNAL // FRAME" bottom right stays

- [ ] **Step 2: Visual check**

```bash
cd ~/code/projects/SignalframeUX && pnpm dev
```

Open http://localhost:3000, scroll to footer. Verify: no "Grey Altaer" text, Culture Division branding, install command intact.

- [ ] **Step 3: Commit**

```bash
git add components/layout/footer.tsx
git commit -m "Feat: footer — Culture Division signature, remove personal name"
```

---

## Task 3: Homepage Hero — Full Viewport Takeover

**Files:**
- Modify: `components/blocks/hero.tsx`
- Modify: `app/page.tsx`

The hero is the single most important change. Kill the 50/50 split. Full-width, full-height, dark, GLSL shader dominant.

- [ ] **Step 1: Rewrite hero.tsx**

Replace the current two-panel hero with a single full-viewport dark section:

```tsx
import { ColorCycleFrame } from "@/components/animation/color-cycle-frame";
import { CopyButton } from "@/components/layout/copy-button";

const INSTALL_CMD = 'pnpm dlx shadcn@latest add "signalframeux.com/r/base.json"';

export function Hero() {
  return (
    <section className="mt-[var(--nav-height)] h-[calc(100vh-var(--nav-height))] h-[calc(100dvh-var(--nav-height))] bg-foreground dark:bg-[var(--sf-darker-surface)] text-background dark:text-foreground relative overflow-hidden flex flex-col justify-end border-b-4 border-foreground">
      {/* GLSL shader fills this — GLSLHeroLazy is placed over this in page.tsx */}

      {/* Title: SIGNAL//FRAME at maximum scale */}
      <div className="relative z-[var(--z-content)] px-[clamp(16px,4vw,48px)] pb-[clamp(24px,4vh,64px)]">
        <h1
          data-anim="hero-title"
          aria-label="SignalframeUX"
          suppressHydrationWarning
          className="sf-display leading-[0.75] tracking-[-0.03em] uppercase"
          style={{ fontSize: "clamp(72px,15vw,280px)" }}
        >
          <ColorCycleFrame className="inline-block text-primary">
            <span data-anim="hero-char">S</span><span data-anim="hero-char">I</span><span data-anim="hero-char">G</span><span data-anim="hero-char">N</span><span data-anim="hero-char">A</span><span data-anim="hero-char">L</span>
          </ColorCycleFrame>
          <span className="block text-background dark:text-foreground" style={{ fontSize: "0.85em" }}>
            <span data-anim="hero-slashes" className="inline-block text-[var(--sf-dim-text)]" style={{ fontSize: "0.65em" }}>//</span>
            <span data-anim="hero-char">F</span><span data-anim="hero-char">R</span><span data-anim="hero-char">A</span><span data-anim="hero-char">M</span><span data-anim="hero-char">E</span>
          </span>
        </h1>

        {/* Multilingual */}
        <div className="mt-4 sf-jfm-flicker">
          <p lang="ja" data-anim="hero-katakana" data-text="シグナルフレーム™" className="sf-hero-deferred text-[var(--sf-yellow)] tracking-[0.3em] text-[clamp(7px,0.9vw,12px)] font-bold">
            シグナルフレーム™
          </p>
          <p lang="fa" data-anim="hero-farsi" data-text="سیگنال‌فریم™" className="sf-hero-deferred text-[var(--sf-yellow)] tracking-[0.3em] text-[clamp(11px,1.3vw,16px)] font-black" dir="rtl" style={{ textAlign: "left" }}>
            سیگنال‌فریم™
          </p>
          <p lang="zh" data-anim="hero-mandarin" data-text="信号框架™" className="sf-hero-deferred text-[var(--sf-yellow)] tracking-[0.3em] text-[clamp(6px,0.7vw,10px)] font-black mt-1">
            信号框架™
          </p>
        </div>

        {/* Tagline */}
        <p data-anim="hero-subtitle" className="sf-hero-deferred mt-6 text-muted-foreground uppercase tracking-[0.2em] text-[clamp(9px,1vw,13px)] max-w-[500px]">
          The design system with a nervous system.
        </p>

        {/* Install command */}
        <div data-anim="hero-subtitle" className="sf-hero-deferred mt-4 font-mono text-[clamp(8px,0.9vw,12px)] text-muted-foreground tracking-wider flex items-center gap-2">
          <code className="select-all">{INSTALL_CMD}</code>
        </div>
      </div>
    </section>
  );
}
```

Note: The multilingual text color references `--sf-yellow` — this should be changed to `text-primary` (magenta) in a follow-up step after verifying the yellow removal in Task 1. If Task 1 already neutralized it, update here.

- [ ] **Step 2: Update page.tsx — simplify hero section**

In `app/page.tsx`, the hero SFSection wrapping stays but ensure the GLSLHeroLazy is positioned as an absolute overlay inside the hero, not after it:

```tsx
<SFSection label="HERO" data-bg-shift="black" data-section="hero" data-cursor className="py-0 relative">
  <Hero />
  <div className="absolute inset-0 z-[1]">
    <GLSLHeroLazy />
  </div>
</SFSection>
```

The shader must be visually dominant — z-index above the dark background but below the text content. Adjust `--z-content` usage in hero.tsx to ensure text sits above the shader.

- [ ] **Step 3: Visual check**

Open http://localhost:3000. The hero should be:
- Full-width, full-height, dark
- SIGNAL//FRAME typography at massive scale, bottom-left aligned
- GLSL shader visible and active behind/through the text
- Tagline: "The design system with a nervous system."
- Install command visible
- No split panels, no "a system you can feel", no CTA buttons

- [ ] **Step 4: Commit**

```bash
git add components/blocks/hero.tsx app/page.tsx
git commit -m "Feat: hero — full viewport takeover, shader dominant, install command"
```

---

## Task 4: Homepage Manifesto — Dense, Not Scrolled

**Files:**
- Modify: `components/blocks/manifesto-band.tsx`

Kill the word-by-word scroll reveal. Replace with a dense, typographically commanding manifesto on a dark background.

- [ ] **Step 1: Rewrite manifesto-band.tsx**

Replace the entire component. Remove all scroll animation logic. The manifesto is static, dense, and fully visible:

```tsx
import Link from "next/link";

const LINK_CLASS =
  "text-primary no-underline relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-[-1px] after:w-full after:h-[2px] after:bg-primary after:scale-x-0 after:origin-left after:transition-transform after:duration-200 hover:after:scale-x-100";

export function ManifestoBand() {
  return (
    <section
      data-anim="section-reveal"
      className="bg-foreground dark:bg-[var(--sf-darker-surface)] border-b-4 border-foreground py-[clamp(32px,6vh,80px)] px-[clamp(24px,4vw,48px)] relative overflow-hidden"
    >
      <p className="text-[clamp(16px,2.2vw,28px)] leading-[1.6] font-bold text-background dark:text-foreground max-w-[900px] relative z-[var(--z-content)]">
        SignalframeUX<sup className="text-[0.6em]">™</sup> is not a component library. It is a{" "}
        <Link href="/start" className={LINK_CLASS}>programmable surface</Link>. Every component carries two layers: the{" "}
        <span className="text-muted-foreground">FRAME</span> you read and the{" "}
        <span className="text-primary">SIGNAL</span> you feel.{" "}
        <Link href="/components" className={LINK_CLASS}>45 SF components</Link> ·{" "}
        <Link href="/tokens" className={LINK_CLASS}>OKLCH tokens</Link> ·{" "}
        <Link href="/reference" className={LINK_CLASS}>API-first</Link> ·{" "}
        <Link href="/start" className={LINK_CLASS}>React + TypeScript</Link>.
      </p>
    </section>
  );
}
```

- [ ] **Step 2: Visual check**

The manifesto band should be: dark background, white text, magenta links, dense paragraph, no scroll animation, no yellow. Reads in 5 seconds.

- [ ] **Step 3: Commit**

```bash
git add components/blocks/manifesto-band.tsx
git commit -m "Feat: manifesto — dense static text, dark band, no scroll reveal"
```

---

## Task 5: Homepage — SIGNAL//FRAME Flip Demonstration

**Files:**
- Create: `components/blocks/signal-flip.tsx`
- Modify: `app/page.tsx`

The core "desire" moment. A real UI composition shown in FRAME mode, then SIGNAL activates. Interactive toggle.

- [ ] **Step 1: Create signal-flip.tsx**

Build a client component that renders a mini UI composition (a card with a heading, a badge, a button, a progress bar — all SF components) and provides a toggle between FRAME and SIGNAL modes:

```tsx
"use client";

import { useState } from "react";
import { SFButton, SFCard, SFBadge, SFProgress, SFSeparator } from "@/components/sf";

export function SignalFlip() {
  const [signalActive, setSignalActive] = useState(false);

  return (
    <section data-anim="section-reveal" className="border-b-4 border-foreground">
      {/* Header */}
      <div className="flex items-center justify-between px-[clamp(24px,4vw,48px)] py-6 border-b border-foreground/20">
        <p className="text-[clamp(10px,1vw,14px)] uppercase tracking-[0.2em] font-bold text-muted-foreground">
          {signalActive ? "SIGNAL + FRAME" : "FRAME ONLY"}
        </p>
        <button
          onClick={() => setSignalActive(!signalActive)}
          className={`px-4 py-2 text-[clamp(9px,0.8vw,12px)] font-bold uppercase tracking-[0.15em] border-2 transition-all duration-[34ms] ${
            signalActive
              ? "bg-primary border-primary text-background"
              : "bg-transparent border-foreground text-foreground"
          }`}
        >
          {signalActive ? "SIGNAL: ON" : "SIGNAL: OFF"}
        </button>
      </div>

      {/* Demo composition */}
      <div className={`px-[clamp(24px,4vw,48px)] py-[clamp(32px,6vh,80px)] transition-all duration-500 ${
        signalActive ? "sf-grain bg-foreground dark:bg-[var(--sf-darker-surface)]" : "bg-background"
      }`}>
        <div className="max-w-[600px] mx-auto">
          <SFCard className={`p-6 transition-all duration-500 ${signalActive ? "border-primary/30" : ""}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold uppercase tracking-wider ${signalActive ? "text-background dark:text-foreground" : "text-foreground"}`}>
                System Status
              </h3>
              <SFBadge intent={signalActive ? "signal" : "default"}>
                {signalActive ? "LIVE" : "STATIC"}
              </SFBadge>
            </div>
            <SFSeparator className="mb-4" />
            <div className="space-y-3">
              <div>
                <p className={`text-[var(--text-xs)] uppercase tracking-wider mb-1 ${signalActive ? "text-muted-foreground" : "text-muted-foreground"}`}>
                  Signal Integrity
                </p>
                <SFProgress value={signalActive ? 87 : 87} className="h-2" />
              </div>
              <div className="flex gap-3 mt-4">
                <SFButton intent={signalActive ? "primary" : "default"} size="sm">
                  Deploy
                </SFButton>
                <SFButton intent="outline" size="sm">
                  Configure
                </SFButton>
              </div>
            </div>
          </SFCard>
        </div>

        {/* Caption */}
        <p className={`text-center mt-8 text-[clamp(14px,1.8vw,22px)] font-bold uppercase tracking-wider ${
          signalActive ? "text-background dark:text-foreground" : "text-foreground"
        }`}>
          {signalActive
            ? "Only one gives you this."
            : "Every design system gives you this."
          }
        </p>
      </div>
    </section>
  );
}
```

This is a starting point — the SIGNAL mode needs to activate actual SIGNAL layer features (grain texture, OKLCH color shifting, generative hover states). The component should use CSS classes that trigger SIGNAL-layer behaviors already built into the system (`sf-grain`, signal overlay, etc.).

- [ ] **Step 2: Add SignalFlip to page.tsx**

In `app/page.tsx`, import and add after the manifesto:

```tsx
import { SignalFlip } from "@/components/blocks/signal-flip";
```

Place it where the DualLayer currently sits:

```tsx
<SFSection label="SIGNAL FLIP" data-bg-shift="white" data-section="signal" data-cursor className="py-0">
  <SignalFlip />
</SFSection>
```

Remove the old `DualLayer` import and usage.

- [ ] **Step 3: Visual check**

The flip section should show a clean UI card in FRAME mode. Click the toggle — the background darkens, grain appears, the badge switches to SIGNAL intent, the caption changes. The transition should feel like the system "waking up."

- [ ] **Step 4: Commit**

```bash
git add components/blocks/signal-flip.tsx app/page.tsx
git commit -m "Feat: SIGNAL flip — interactive FRAME vs SIGNAL demonstration"
```

---

## Task 6: Homepage — Stats Band Update

**Files:**
- Modify: `components/blocks/stats-band.tsx`

Update stats to real numbers with linked proofs.

- [ ] **Step 1: Update stats-band.tsx**

Replace the current stats with the real proof numbers:

```tsx
import Link from "next/link";

const STATS = [
  { value: "45", label: "SF COMPONENTS", href: "/components" },
  { value: "516", label: "OKLCH TOKENS", href: "/tokens" },
  { value: "100KB", label: "SHARED BUNDLE", href: null },
  { value: "100", label: "LIGHTHOUSE", href: null },
  { value: "0", label: "BORDER RADIUS", href: null },
];

export function StatsBand() {
  return (
    <section aria-label="System proof" data-anim="section-reveal" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 border-b-4 border-foreground bg-foreground dark:bg-[var(--sf-darker-surface)]">
      {STATS.map((stat, i) => {
        const inner = (
          <>
            <div
              aria-hidden="true"
              className="sf-display text-[clamp(32px,4vw,56px)] leading-none text-primary"
              data-anim="stat-number"
              data-target={stat.value}
            >
              {stat.value}
            </div>
            <span className="sr-only">{stat.value} {stat.label.toLowerCase()}</span>
            <div aria-hidden="true" className="mt-2 text-[var(--text-2xs)] uppercase tracking-[0.2em] font-bold text-muted-foreground">
              {stat.label}
            </div>
          </>
        );

        const className = `px-4 py-8 text-center border-r border-foreground/20 last:border-r-0 ${
          stat.href ? "hover:bg-primary/5 transition-colors" : ""
        }`;

        return stat.href ? (
          <Link key={stat.label} href={stat.href} className={className}>
            {inner}
          </Link>
        ) : (
          <div key={stat.label} className={className}>
            {inner}
          </div>
        );
      })}
    </section>
  );
}
```

- [ ] **Step 2: Visual check**

Dark band with 5 stats in magenta. Components and Tokens are clickable. Numbers are real, not inflated.

- [ ] **Step 3: Commit**

```bash
git add components/blocks/stats-band.tsx
git commit -m "Feat: stats band — real proof numbers, dark bg, linked to pages"
```

---

## Task 7: Homepage — Component Vignettes

**Files:**
- Modify: `components/blocks/component-grid.tsx`
- Modify: `app/page.tsx`

Replace the grid of white preview cards with interactive component vignettes on dark stages.

- [ ] **Step 1: Update component-grid.tsx**

The grid cells need dark backgrounds instead of yellow. Each cell should be interactive — hovering activates a subtle SIGNAL effect (grain, color shift). The component preview should be centered and live.

Key changes:
- Background: `bg-foreground dark:bg-[var(--sf-darker-surface)]` instead of yellow
- Text: `text-background dark:text-foreground` and `text-muted-foreground`
- Remove any yellow background classes
- Add `sf-grain` on hover via a CSS class or inline state
- Ensure component labels use tracked uppercase monospace

This is a CSS/class change, not a structural rewrite. The grid layout and component-detail click behavior stay.

- [ ] **Step 2: Visual check**

The component grid should show dark cells with live component previews. Hover should feel alive (SIGNAL). Click should still open the detail view.

- [ ] **Step 3: Commit**

```bash
git add components/blocks/component-grid.tsx
git commit -m "Feat: component grid — dark stages, SIGNAL hover, no yellow"
```

---

## Task 8: Homepage — Page Assembly & Cleanup

**Files:**
- Modify: `app/page.tsx`

Remove decorative elements that don't serve clarity. Assemble the final homepage flow.

- [ ] **Step 1: Update page.tsx section order**

The final homepage flow:
1. Hero (full viewport + GLSL shader)
2. Manifesto (dense dark band)
3. Signal Flip (interactive FRAME vs SIGNAL)
4. Stats Band (proof numbers)
5. Component Vignettes (dark grid)
6. Footer

Remove:
- `CircuitDivider` instances (unless one is kept between major sections for structural clarity)
- `MarqueeBand` (the scrolling marquee is decoration, not information)
- `GhostLabel` instances (decorative floating labels)
- `CodeSection` (the API code example — this content moves to /reference and /start where it serves the developer better)

Keep:
- `SectionIndicator` (navigation utility)
- `SignalMotion` wrappers where scroll-triggered reveal adds clarity (not decoration)

- [ ] **Step 2: Visual check**

Scroll the homepage top to bottom. Each section should feel intentional. No section should exist for decoration. The flow: hit → explain → demonstrate → prove → show → sign off.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "Feat: homepage — final assembly, remove decorative elements"
```

---

## Task 9: Components Page — Dark Stages

**Files:**
- Modify: `app/components/page.tsx`
- Modify: `components/blocks/components-explorer.tsx`

- [ ] **Step 1: Update components page header**

In `app/components/page.tsx`:
- Change "340" to "45" (honest count)
- Change "FRAME + SIGNAL PRIMITIVES FOR EVERY SURFACE" to "SIGNAL + FRAME"
- Remove the separate SignalMesh section — merge the WebGL mesh into the header background
- Dark background on the header

- [ ] **Step 2: Update components-explorer.tsx**

In `components/blocks/components-explorer.tsx`:
- Component cells: dark backgrounds (`bg-foreground` or near-black), not white/yellow
- Filter tabs: add hard-cut transition (34ms) on selection, magenta active indicator
- Category sections scroll vertically with tDR-density headers
- SIGNAL components section first, FRAME components second

- [ ] **Step 3: Visual check**

Components page should feel like a showroom. Dark stages, live components, SIGNAL-active hovers. Filter interaction itself demonstrates the design system.

- [ ] **Step 4: Commit**

```bash
git add app/components/page.tsx components/blocks/components-explorer.tsx
git commit -m "Feat: components page — dark stages, honest count, SIGNAL-first sections"
```

---

## Task 10: Tokens Page — SEE IT → UNDERSTAND IT → USE IT

**Files:**
- Modify: `app/tokens/page.tsx`
- Modify: `components/blocks/token-tabs.tsx`

- [ ] **Step 1: Update tokens page header**

In `app/tokens/page.tsx`:
- Subline: "516 · OKLCH · API-FIRST"
- One line beneath: "Every value has a reason. Every reason has a variable."
- Remove marquee text if present

- [ ] **Step 2: Update token-tabs.tsx — add copy-click**

For each token section (color, spacing, typography, motion, layout):
- Every token value is clickable → copies CSS variable to clipboard
- Show: visual demo | token name | CSS variable | Tailwind class
- Use the existing `CopyButton` component pattern

Color section:
- Keep the grid (it's strong)
- Add hover state showing token name
- Click copies `--color-signal-500` etc.

Spacing section:
- Render 9 stops as physical bars/boxes
- Two columns: visual | API reference

Typography section:
- Live rendered text at each semantic alias size
- Two columns: rendered text | usage code

Motion section:
- Live animated elements for each duration/easing
- Token names alongside

- [ ] **Step 3: Visual check**

Every token section follows SEE IT → UNDERSTAND IT → USE IT. Click any value and verify clipboard copy works.

- [ ] **Step 4: Commit**

```bash
git add app/tokens/page.tsx components/blocks/token-tabs.tsx
git commit -m "Feat: tokens page — copy-click, SEE/UNDERSTAND/USE pattern, API-first"
```

---

## Task 11: Reference Page — No Prose, Tables + Code + Types

**Files:**
- Modify: `app/reference/page.tsx`
- Modify: `components/blocks/api-explorer.tsx`

- [ ] **Step 1: Update reference page header**

- "API REFERENCE" at massive scale
- Component count and prop count as subline

- [ ] **Step 2: Update api-explorer.tsx**

- Every SF component listed: name, typed props, defaults, variants, import path
- Each entry expandable: live preview + code example + full prop table
- Add search/filter input at top
- Remove any prose descriptions — tables, code, types only
- Code examples use shiki OKLCH theme
- All code is copy-ready

- [ ] **Step 3: Visual check**

A senior engineer should be able to scan this page in 60 seconds and know the system is real. No paragraphs of text. Dense, precise, copy-ready.

- [ ] **Step 4: Commit**

```bash
git add app/reference/page.tsx components/blocks/api-explorer.tsx
git commit -m "Feat: reference page — no prose, tables + code + types, search"
```

---

## Task 12: Start Page — Speed Is the Design

**Files:**
- Modify: `app/start/page.tsx`

- [ ] **Step 1: Update start page**

- "GET STARTED" header stays massive
- Subline: "Install. Configure. Ship."
- 5 steps: number + title + code block + one sentence
- Code blocks are the star — large, shiki-highlighted, copy-button prominent
- Remove any decorative elements between steps
- Bottom: "Setup complete." + links to /components and /reference + install command

- [ ] **Step 2: Read current start page to identify what to keep vs cut**

```bash
cd ~/code/projects/SignalframeUX && wc -l app/start/page.tsx
```

Read the file and identify: decorative elements to remove, content to keep, code blocks to enlarge.

- [ ] **Step 3: Visual check**

Someone should go from zero to installed in under 3 minutes following this page. Every word that doesn't help the developer get started is removed.

- [ ] **Step 4: Commit**

```bash
git add app/start/page.tsx
git commit -m "Feat: start page — speed is the design, code blocks prominent"
```

---

## Task 13: Navigation — Designed Artifact

**Files:**
- Modify: `components/layout/nav.tsx`

- [ ] **Step 1: Update nav.tsx**

Minor refinements to match the redesign:
- Nav background should work on dark-dominant pages (the hero is dark, nav sits on top)
- Ensure the SIGNAL layer elements (scramble text on links, magnetic hover, live clock) are visible and performing
- Verify the nav doesn't fight the hero — it should feel like part of the same surface
- Consider transparent background on hero section, solid on scroll

- [ ] **Step 2: Visual check**

Nav should feel like a designed artifact. Time display, scramble text, magnetic hover — all working. Not fighting the hero.

- [ ] **Step 3: Commit**

```bash
git add components/layout/nav.tsx
git commit -m "Feat: nav — transparent on hero, solid on scroll, SIGNAL active"
```

---

## Task 14: Final Integration & QA

**Files:**
- All modified files

- [ ] **Step 1: Full page-by-page visual QA**

Open each page and verify:
- `/` — Hero hits, manifesto reads, flip works, stats are real, grid is dark, footer is clean
- `/components` — Dark stages, honest count, filter demonstrates SIGNAL
- `/tokens` — Copy-click works, every section follows SEE/UNDERSTAND/USE
- `/reference` — No prose, tables + code + types, search works
- `/start` — Speed, code blocks prominent, zero to installed in 3 min

- [ ] **Step 2: Check for remaining yellow**

```bash
cd ~/code/projects/SignalframeUX
grep -rn "yellow\|#FFD\|ffd" app/ components/ --include="*.tsx" --include="*.css" | grep -v node_modules | grep -v ".planning" | grep -v ".superpowers"
```

Any remaining yellow references must be removed or converted to magenta/foreground.

- [ ] **Step 3: Lighthouse check**

```bash
cd ~/code/projects/SignalframeUX && pnpm build
```

Verify build succeeds. Check bundle size hasn't exceeded 150KB gate.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Feat: redesign QA — final integration pass"
```

---

## Task 15: Bundle Gate & Lighthouse Verification

**Files:**
- None (verification only)

- [ ] **Step 1: Bundle size check**

```bash
cd ~/code/projects/SignalframeUX
ANALYZE=true pnpm build
python3 -c "
import gzip, json, pathlib
manifest = json.loads(pathlib.Path('.next/build-manifest.json').read_text())
root = manifest.get('rootMainFiles', [])
total = sum(len(gzip.compress(pathlib.Path('.next/' + f).read_bytes(), compresslevel=9)) for f in root if pathlib.Path('.next/' + f).exists())
print(f'Shared bundle: {total / 1024:.1f} KB gzip (gate: 150 KB)')
assert total / 1024 < 150, f'OVER BUDGET: {total / 1024:.1f} KB'
"
```

- [ ] **Step 2: Lighthouse**

Deploy to Vercel preview and run Lighthouse against the deployed URL. All categories must score 100/100 or identify what regressed.

- [ ] **Step 3: Final commit**

```bash
git commit --allow-empty -m "Chore: redesign complete — bundle gate passed, Lighthouse verified"
```
