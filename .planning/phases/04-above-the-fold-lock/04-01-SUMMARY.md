---
phase: 04-above-the-fold-lock
plan: "01"
subsystem: hero-animation
tags: [gsap, hero, animation-timeline, component-count, above-the-fold]
dependency_graph:
  requires: []
  provides: [fast-path-hero-animation, accurate-component-count]
  affects: [components/layout/page-animations.tsx, components/blocks/hero.tsx, components/blocks/stats-band.tsx, app/page.tsx, app/globals.css]
tech_stack:
  added: []
  patterns: [gsap-fromTo-delay-0, data-anim-wrapper-div, css-initial-state-opacity-0]
key_files:
  created: []
  modified:
    - components/layout/page-animations.tsx
    - components/blocks/hero.tsx
    - components/blocks/stats-band.tsx
    - app/page.tsx
    - app/globals.css
decisions:
  - "hero-mesh wrapped in div (not prop) — HeroMesh canvas uses className for inline styles; data-anim on a parent div gives GSAP a clean DOM target without mutating the canvas component internals"
  - "gsap.fromTo at delay:0 (not gsap.to) — fromTo pins the start state, preventing GSAP from reading a potentially already-animated opacity from a prior context revert"
  - "multilingual timeline delay reduced from 2.2s to 0.3s — fires at ~1.3s post-load vs ~5.3s; contextually after hero-char chars finish cascading"
  - "SF COMPONENTS label (not COMPONENTS) — precision: only SF-layer wrapped components are counted; base shadcn/ui and animation components excluded"
metrics:
  duration: "~15 minutes"
  completed: "2026-04-05"
  tasks_completed: 2
  files_modified: 5
requirements_completed: [ATF-01, ATF-02, ATF-03]
---

# Phase 4 Plan 01: Above-the-Fold Lock — Hero Fast-Path Summary

Hero animation first motion accelerated from 2.3s to sub-300ms via hero-mesh fade at GSAP delay:0, full sequence compressed from ~6s to ~3s, and component count claim corrected to honest "28 SF components and growing" across all three surfaces.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Restructure hero animation timeline for sub-500ms first motion | c78fe95 | page-animations.tsx, hero.tsx, globals.css |
| 2 | Fix component count claim and polish hero spacing | 2160414 | stats-band.tsx, page.tsx, hero.tsx |

## What Was Built

### Task 1 — Animation Timeline Restructure

Rewrote `initHeroAnimations` in `page-animations.tsx` to front-load visible motion:

**Old sequence** (first visible motion at 2.3s, total ~6s+):
- delay:0.5 — heroFeel blur bloom
- delay:1.0 — slashes slide
- delay:2.0 — heroCopy fade
- delay:2.3 — hero-char reveal (FIRST visible motion)
- delay:4.0 — CTAs
- delay:4.4 — accent color cycle

**New sequence** (first visible motion at delay:0, total ~3s):
- delay:0 — hero-mesh fade-in `opacity:0 → 0.45` over 300ms (FIRST visible motion)
- delay:0.3 — slashes slide
- delay:0.4 — hero-char SplitText reveal (visible within 1s)
- delay:0.5 — heroFeel blur bloom
- delay:1.0 — heroCopy fade
- delay:1.5 — CTA buttons
- delay:2.0 — accent color cycle
- delay:3.0 — hero-copy-dot

In `hero.tsx`, wrapped `<HeroMesh>` in `<div data-anim="hero-mesh" className="absolute inset-0 z-0 opacity-0">` — GSAP targets the wrapper div's opacity rather than the canvas component directly.

In `globals.css`, added:
- `[data-anim="hero-mesh"] { opacity: 0; }` — CSS initial state matches GSAP fromTo start
- `[data-anim="hero-mesh"]` in reduced-motion reset block — mesh shows at full opacity when motion is off (canvas draws statically)

All animated properties are opacity, transform, and filter only — zero CLS risk.

### Task 2 — Component Count Correction

- `stats-band.tsx`: `"340"` → `"28"`, label `"COMPONENTS"` → `"SF COMPONENTS"` (data-target="28" flows through existing count-up animation cleanly)
- `app/page.tsx` metadata: `"340+ components"` → `"28 SF components and growing"`
- `hero.tsx` right panel: added `<p>` element with `"28 SF COMPONENTS AND GROWING"` between manifesto copy and CTA buttons, using `mt-4` (blessed 16px stop), `clamp(9px,0.8vw,12px)`, `uppercase tracking-[0.2em] text-muted-foreground font-bold` — matches CTA label scale, DU/TDR typographic voice

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed pre-existing TypeScript error in color-cycle-frame.tsx**
- **Found during:** Task 1 build verification
- **Issue:** `useRef<ReturnType<typeof setTimeout>>()` — TypeScript 5.8 strict mode requires initial argument
- **Fix:** `useRef<ReturnType<typeof setTimeout> | undefined>(undefined)`
- **Files modified:** components/animation/color-cycle-frame.tsx
- **Commit:** c78fe95

**2. [Rule 1 - Bug] Fixed pre-existing TypeScript error in dark-mode-toggle.tsx**
- **Found during:** Task 1 build verification (second error after color-cycle-frame fixed)
- **Issue:** `element.style.webkitBackdropFilter` — not in `CSSStyleDeclaration` type
- **Fix:** Cast style object as `CSSStyleDeclaration & { webkitBackdropFilter: string }`
- **Files modified:** components/layout/dark-mode-toggle.tsx
- **Commit:** c78fe95

Both errors were pre-existing (documented in STATE.md blockers). Fixed inline since they blocked build verification of Task 1's AC.

## Verification Results

| Check | Result |
|-------|--------|
| `npm run build` passes | PASS |
| No "340" in stats-band or page.tsx | PASS |
| hero-mesh targeted in page-animations.tsx | PASS |
| hero-char delay is 0.4 | PASS |
| "AND GROWING" in hero.tsx | PASS |

## Self-Check: PASSED

All modified files confirmed present on disk. Both task commits (c78fe95, 2160414) confirmed in git log.
