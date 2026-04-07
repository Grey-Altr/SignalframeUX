# SignalframeUX — Experience Redesign Spec

**Date:** 2026-04-07
**Goal:** Redesign SignalframeUX from a functional design system showcase into a desire-driven portfolio piece + API product that gets Grey hired at $200K+ AND makes developers want to use it.
**Audience:** Design engineering leads (Vercel, Linear, Figma, Stripe, Apple, Google) AND developers evaluating a design system.

---

## Core Design Principle

> "Why doesn't every design system work this way?"

The site IS the design system performing. Every page is simultaneously:
1. A visceral experience (gets you hired)
2. A functional reference (developers use it)
3. A proof of craft (the components build the page you're reading)

## Design Values

- **Clarity over cleverness** — the smartest move looks obvious
- **Clear cleverness** — the cleverness is there but reads as clarity
- **Desire over explanation** — the user should feel like they HAVE to use it
- **API-first** — every token, every component, every value is copy-ready code
- **The site IS the proof** — no "about" section, the work demonstrates itself
- **SIGNAL leads** — SIGNAL//FRAME, not FRAME//SIGNAL. The generative layer is the differentiator.

## Visual Language (All Pages)

- **Dark dominant.** Near-black backgrounds. White/light foreground text. Magenta as the only accent.
- **Zero border-radius.** Everything sharp. No rounded corners anywhere.
- **4px borders.** Heavy structural lines between sections. The grid is visible.
- **SIGNAL layer present but controlled.** Grain, OKLCH color shifts, generative textures — but they serve clarity, never fight it.
- **Typography-led.** Anton for display. Inter for body. JetBrains Mono for code. Electrolize for system labels.
- **Density over whitespace.** tDR poster density — every element earns its space.
- **No yellow.** The current yellow (manifesto band, component previews) is removed. Magenta is the only non-B&W color. The palette is: black, white, magenta, grays.

## Reference Points

- **Detroit Underground** — coded opacity, catalog density, slightly tense
- **The Designers Republic** — maximum-minimalism, controlled violence, every pixel earns its space
- **David Rudnick** — type specimens that feel alive, anti-decoration
- **Teenage Engineering** — you don't need it but 30 seconds on the page and you want it

---

## Page 1: Homepage — The Controlled Detonation

**Route:** `/`
**Job:** In 3 seconds, the visitor decides you're serious. In 30 seconds, they want to use the system.

### Section 1: Hero — Full Viewport, GLSL Shader Dominant

- No split panel. Full-width, full-height, dark.
- GLSL shader runs at full intensity — not a background, THE foreground.
- SIGNAL//FRAME typography at maximum scale (Anton, 15vw+). The letterforms interact with the generative layer — clipped, alive, not static.
- One line beneath: **"The design system with a nervous system."**
- Below that, the install command in small tracked monospace: `pnpm dlx shadcn@latest add "signalframeux.com/r/base.json"` — desire → action, zero friction.
- Multilingual text stays (katakana, farsi, mandarin) — the Rudnick move.
- No CTA buttons in the hero. The scroll IS the CTA.

### Section 2: The Flip — FRAME vs SIGNAL

- A single, real UI composition built from SF components — a mini dashboard with cards, buttons, inputs, badges, and a toast. Something a developer recognizes as "I build things like this."
- It loads in FRAME mode: clean, crisp, professional, looks like any good design system.
- Then SIGNAL activates — grain appears, colors shift through OKLCH space, hover states feel alive, transitions have weight.
- Interactive toggle that the user plays with. Playing = wanting.
- Text: **"Every design system gives you this. Only one gives you this."**

### Section 3: Components — Interactive Vignettes

- 6-8 hero components, each in a live interactive moment — not a preview card, a designed moment.
- SFButton with SIGNAL-active hover response.
- SFToast with grain texture and hard-cut animation (34ms).
- SFDialog with VHS scanline wipe.
- Each has a one-click copy of the install command.
- Message: every component you already know, but it FEELS like something.

### Section 4: The System — Token Architecture at a Glance

- Dense visual map of the token system, not a link to another page.
- OKLCH color scales rendered as living gradients.
- Spacing scale shown physically (not as numbers).
- Typography scale shown as actual text at each size.
- The system is visible, not described.

### Section 5: The Proof — Numbers as Typography

- Dense typographic band at DU/tDR density:
- **45** SF components · **516** OKLCH tokens · **100KB** shared bundle · **100/100** Lighthouse · **0** border-radius
- Each number links to its proof page.

### Section 6: The Close — Install + Signature

- "Deterministic interface. Generative expression."
- Install command again. Big. Copyable.
- Culture Division · Portland · 2026

---

## Page 2: Components — The Playground

**Route:** `/components`
**Job:** Every component is live, interactive, and makes you want to use it. The page itself is built from the components.

### Header
- "COMPONENTS" at massive scale.
- "45 SF Components · SIGNAL + FRAME" in small tracked caps.
- WebGL mesh fills the header background, not a separate band.

### Filter Bar as SIGNAL Demo
- Filter tabs themselves demonstrate SIGNAL: 34ms hard-cut selection state, grain on hover, magenta snap indicator.
- Search has scanline focus state.
- The filter UI IS a component showcase.

### Dark Stages, Not White Cards
- Each component displayed on a dark stage — not a white card with colored background.
- Component is centered, interactive, live.
- Hover the stage → SIGNAL activates (subtle grain, color shift).
- Click → stage expands to full detail view: live preview, code (OKLCH shiki theme), props, variants.
- Detail view built from SF components (SFSheet/SFDrawer pattern).

### Sections, Not Filters
- Scroll through curated sections: SIGNAL components (generative/animated), then FRAME components (structural).
- tDR-density typographic headers per section.
- Filter bar becomes a jump-nav.

### Bottom
- Install command. Link to /start. No fluff.

---

## Page 3: Tokens — Clear System, API-Ready

**Route:** `/tokens`
**Job:** The system made visible. Every value has a reason. Every reason has a variable. SEE IT → UNDERSTAND IT → USE IT.

### Header
- "TOKENS" at massive scale.
- "516 · OKLCH · API-FIRST"
- One line: "Every value has a reason. Every reason has a variable."

### Pattern for Every Section
Each token category follows the same structure:
- Visual demonstration (see the value in action)
- Token name + CSS variable + Tailwind class
- Copy-click on any value → copies to clipboard
- Import/usage code block at the bottom

### Color
- Grid layout stays (currently strongest element).
- Hover any swatch → token name visible.
- Click → copies CSS variable.
- One sentence OKLCH explanation: "Perceptually uniform. Consistent lightness across hues."
- Import code: `@import "signalframeux/tokens/color"`

### Spacing
- 9 blessed stops rendered physically — nested boxes or stacked bars showing actual space.
- Two columns: visual (the space) | API (token name, Tailwind class, px value).
- Copy-click on any value.

### Typography
- Each semantic alias rendered as live text at real size.
- `heading-1` → "SIGNALFRAME" in Anton at 3xl
- `heading-2` → "Deterministic Interface" in Inter bold at 2xl
- `body` → real paragraph at base
- Two columns: what it looks like | how to use it (token, CSS, Tailwind).
- Font stack: Inter, JetBrains Mono, Electrolize, Anton.

### Motion
- Live animation for each duration and easing.
- Element moves at `--duration-instant` (34ms) vs `--duration-glacial` (600ms).
- Token names alongside each animation.
- "34ms hard-cut. 600ms glacial. Nothing in between without a reason."

### Layout
- Content / wide / full-bleed widths shown as nested frames.
- Breakpoint table with token names.

---

## Page 4: API Reference — The Contract

**Route:** `/reference`
**Job:** A senior engineer scans this in 60 seconds and knows the system is real. No prose.

### Header
- "API REFERENCE" at massive scale.
- Component count, prop count — the scope of the API surface.

### Component API Table
- Every SF component: name, typed props, defaults, variants (CVA `intent`), import path.
- Each entry expandable: live preview + code example + full prop table.
- Instant search/filter.

### Token API
- Every CSS variable, grouped by category.
- Copy-click on everything.
- Shows Tailwind utility AND raw CSS variable.

### Code Examples
- Real usage patterns, not toy examples.
- Shiki-highlighted with OKLCH theme.
- Copy-ready, runnable.

### Principle
No prose. Tables, code, types. If it takes more than one sentence to explain, the API is wrong.

---

## Page 5: Get Started — Speed Is the Design

**Route:** `/start`
**Job:** Zero to installed in under 3 minutes. The page itself is beautifully crafted.

### Header
- "GET STARTED" at massive scale.
- "Install. Configure. Ship."

### Steps (5 steps, existing structure)
- Each step: number + title + code block + one sentence of context.
- Code blocks are the star — large, shiki-highlighted, copy-button prominent.
- No decorative dividers between steps. Typography and spacing do the work.

### Bottom
- "Setup complete." with links to /components and /reference.
- Install command one final time.

### Principle
Speed is the design. Every word that doesn't help the developer get started is removed.

---

## Navigation

- The nav is a designed artifact, not a utility bar.
- Shows the SIGNAL layer subtly (time display with generative texture).
- Rock-solid FRAME: clear labels, fast, accessible, keyboard-navigable.
- Links: COMPONENTS · API · TOKENS · START · GITHUB
- SF//UX logo top-left. Time display top-right.
- Light/dark toggle stays.

---

## Technical Constraints

- Existing codebase: Next.js 15.3, TypeScript, Tailwind v4, GSAP, Lenis, shadcn/Radix base.
- No new dependencies unless absolutely necessary.
- Bundle gate: 150KB shared (currently 100KB — budget for new work).
- Lighthouse: 100/100 all categories.
- WCAG AA minimum, keyboard-navigable.
- Zero border-radius everywhere.
- Commit before every change for clean rollback.

## What Gets Removed

- Yellow manifesto band background color → dark
- Word-by-word scroll reveal animation → dense static manifesto
- 50/50 hero split → full-width takeover
- White card component previews → dark stages
- "340" inflated component count display → honest "45 SF Components"
- Decorative circuit dividers between sections (keep only if they serve navigation)
- "a system you can feel" as standalone tagline → replaced by "The design system with a nervous system."

## What Gets Added

- SIGNAL//FRAME flip demonstration (interactive FRAME→SIGNAL toggle on real UI)
- Component vignettes (live interactive moments, not grid previews)
- Copy-click on every token value, every install command
- Dense stats band with linked proof
- Token sections with SEE IT → UNDERSTAND IT → USE IT pattern
- Dark stages for component display
- Install command visible on homepage hero

## Success Criteria

A design engineering lead at Vercel/Linear/Stripe/Figma:
1. Opens the link
2. In 3 seconds: "this is serious"
3. In 30 seconds: "I want to use this" or "I want to hire whoever built this"
4. Clicks through to components or tokens
5. Finds real, copy-ready, API-first content
6. Leaves thinking: "why doesn't every design system work this way?"
