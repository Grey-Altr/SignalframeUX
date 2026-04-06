---
phase: 04-above-the-fold-lock
verified: 2026-04-05T00:00:00Z
status: human_needed
score: 9/10 must-haves verified
gaps:
human_verification:
  - test: "Hero at 1440x900 — cold browser load performance trace"
    expected: "Hero-mesh opacity transition begins within 500ms of navigation start, measurable in DevTools Performance panel"
    why_human: "Cannot run a browser Performance trace programmatically. The animation is wired correctly (delay:0, duration:0.3) but actual sub-500ms delivery depends on hydration timing and network conditions that require a live browser test to confirm."
---

# Phase 4: Above-the-Fold Lock — Verification Report

**Phase Goal:** The hero at 1440x900 is a standalone SOTD jury moment requiring no scroll, error and empty states are crafted design moments, and the reduced-motion experience is a first-class alternative

**Verified:** 2026-04-05
**Status:** human_needed
**Re-verification:** No — initial verification
**No RECONCILIATION.md found** — proceeding from PLANs directly.

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Hero-mesh first motion fires at delay:0 with opacity 0→0.45 over 300ms | VERIFIED | `page-animations.tsx` line 80–84: `gsap.fromTo("[data-anim='hero-mesh']", { opacity: 0 }, { opacity: 0.45, duration: 0.3, ease: "power2.out", delay: 0 })` |
| 2 | Hero heading chars visible within 1s (delay:0.4, not 2.3) | VERIFIED | `page-animations.tsx` line 105: `delay: 0.4` on `hero-char` SplitText reveal |
| 3 | Hero at 1440x900 reads as complete SOTD composition without scroll | VERIFIED (human gate) | Layout is correct: two-panel full-viewport, all regions populated, verified by SIGNAL-SPEC QA checklist |
| 4 | Component count is honest — "28 SF COMPONENTS AND GROWING" everywhere | VERIFIED | `hero.tsx` line 93, `stats-band.tsx` line 2 (`value: "28"`), `app/page.tsx` metadata: "28 SF components and growing" |
| 5 | Zero CLS from hero animations — only opacity, transform, filter animated | VERIFIED | Inspected all `gsap.fromTo/gsap.to` calls in `initHeroAnimations`: opacity, y, x, scale, filter, CSS properties only — no width/height/padding/margin |
| 6 | Error page is a crafted FRAME+SIGNAL moment | VERIFIED | `app/error.tsx`: SFContainer + SFText structure, `data-anim="error-code"` for ScrambleText, `sf-glitch` CSS class, reduced-motion guard before async GSAP import |
| 7 | Not-found page is a crafted FRAME+SIGNAL moment | VERIFIED | `app/not-found.tsx`: SFContainer + SFText structure, `data-anim="page-heading"` (wired to existing `initPageHeadingScramble`), primary accent on "0" in "404" |
| 8 | ComponentsExplorer has a designed empty state for zero-result filters | VERIFIED | `components-explorer.tsx` line 465: `filtered.length === 0` branch renders "0 MATCHES" with reset CTA |
| 9 | API explorer and token explorer have crafted placeholder states | VERIFIED | `api-explorer.tsx` line 577–582: COMING SOON + "THE SIGNAL WILL BE TRANSMITTED WHEN READY."; `token-tabs.tsx` lines 350–361: EXTENDED SCALES placeholder with SHOW ALL CTA |
| 10 | Reduced-motion is a first-class alternative with documented per-effect behaviors | VERIFIED | SIGNAL-SPEC.md Section 7 documents 16 effects; QA checklist at end of doc; `globals.css` has `[data-anim="hero-mesh"]` and `[data-anim="error-code"]` in reduced-motion reset block |

**Score:** 9/10 truths programmatically verified (truth #3 requires human visual confirmation at 1440x900)

---

### Required Artifacts

#### Plan 04-01 Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `components/layout/page-animations.tsx` | Hero animation fast-path with sub-500ms first motion | VERIFIED | `hero-mesh` targeted at `delay:0`, `hero-char` at `delay:0.4` |
| `components/blocks/hero.tsx` | Hero layout with blessed token spacing and component count | VERIFIED | Contains "28 SF COMPONENTS AND GROWING", `data-anim="hero-mesh"` wrapper with `opacity-0` initial state |
| `components/blocks/stats-band.tsx` | Accurate 28 component count (not inflated 340) | VERIFIED | `value: "28", label: "SF COMPONENTS"` — no "340" in file |
| `app/page.tsx` | Updated metadata with accurate component count | VERIFIED | `"28 SF components and growing"` in description |

#### Plan 04-02 Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `app/error.tsx` | FRAME+SIGNAL error boundary with ScrambleText and VHS glitch | VERIFIED | SFContainer, SFText (variant="body"/"small"), `data-anim="error-code"`, `sf-glitch`, reduced-motion guard |
| `app/not-found.tsx` | FRAME+SIGNAL 404 page with ScrambleText | VERIFIED | SFContainer, SFText (variant="body"), `data-anim="page-heading"`, primary accent on "0" |
| `components/blocks/components-explorer.tsx` | Designed empty state for zero-result filter | VERIFIED | `filtered.length === 0` branch at line 465, "0 MATCHES" with "RESET FILTERS" CTA |
| `components/blocks/api-explorer.tsx` | Polished COMING SOON placeholder | VERIFIED | "COMING SOON" + "THE SIGNAL WILL BE TRANSMITTED WHEN READY." DU/TDR voice |
| `components/blocks/token-tabs.tsx` | Structural placeholder in COLOR tab | VERIFIED | "EXTENDED SCALES AVAILABLE", "SELECT A SCALE TO INSPECT.", SHOW ALL CTA when `!showAll` |
| `app/globals.css` | `error-code` in reduced-motion reset list | VERIFIED | Lines 995 and 1042: `[data-anim="error-code"]` in reduced-motion reset and initial state |

#### Plan 04-03 Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `.planning/phases/03-signal-expression/SIGNAL-SPEC.md` | Section 7 Reduced-Motion Behavior with per-effect documentation | VERIFIED | Section 7 exists with 16-entry table, architecture doc, QA checklist — all marked Verified |
| `app/globals.css` | CSS coverage for all data-anim values with initial states | VERIFIED | `[data-anim="hero-mesh"]` and `[data-anim="error-code"]` both in reduced-motion block; catch-all `[data-anim] { opacity: 1 }` covers remaining values |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `page-animations.tsx` | `hero.tsx` | `data-anim="hero-mesh"` drives GSAP fade-in at delay:0 | VERIFIED | `hero.tsx` line 11: `<div data-anim="hero-mesh" className="...opacity-0">`, `page-animations.tsx` line 81: targets `[data-anim='hero-mesh']` |
| `stats-band.tsx` | `hero.tsx` | Both display 28 component count | VERIFIED | `stats-band.tsx`: `value: "28"`, `hero.tsx`: "28 SF COMPONENTS AND GROWING" |
| `app/error.tsx` | `lib/gsap-plugins` | Lazy import in useEffect, guarded by reduced-motion check | VERIFIED | Line 17: `matchMedia` guard; line 22: `import("@/lib/gsap-plugins")` |
| `app/globals.css` | `app/error.tsx` | `error-code` in initial state and reduced-motion reset | VERIFIED | `globals.css` lines 995 (reduced-motion) and 1042 (initial state `opacity: 0`) |
| `app/not-found.tsx` | `page-animations.tsx` | `data-anim="page-heading"` picked up by `initPageHeadingScramble` | VERIFIED | `not-found.tsx` line 17: `data-anim="page-heading"`; `page-animations.tsx` lines 218–231: queries all `[data-anim='page-heading']` elements |
| `SIGNAL-SPEC.md` | `app/globals.css` | SIGNAL-SPEC documents reduced-motion CSS rules as authoritative reference | VERIFIED | Section 7 Architecture block includes CSS code from globals.css; `[data-anim="hero-mesh"]` and `[data-anim="error-code"]` documented |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| ATF-01 | 04-01 | Hero at 1440x900 is a standalone SOTD jury moment — no scroll required | SATISFIED (human gate) | Full-viewport two-panel layout, all regions populated, "28 SF COMPONENTS AND GROWING" visible |
| ATF-02 | 04-01 | Hero motion fires within 500ms of load | SATISFIED (human gate) | `hero-mesh` at `delay:0`, `duration:0.3` — code is correct; browser performance trace is the human gate |
| ATF-03 | 04-01 | Component count claim resolved honestly with "growing" label | SATISFIED | "28" in stats-band, hero, and page metadata everywhere — no "340" references remain |
| ATF-04 | 04-02 | Error page is a crafted FRAME+SIGNAL moment | SATISFIED | SFContainer/SFText/SFButton structure, `sf-glitch`, ScrambleText wired and reduced-motion guarded |
| ATF-05 | 04-02 | Empty states for component browser, token explorer, API explorer designed | SATISFIED | All three designed: "0 MATCHES" in ComponentsExplorer, COMING SOON in API explorer, EXTENDED SCALES in token-tabs |
| ATF-06 | 04-03 | Reduced-motion QA'd as standalone intentional design | SATISFIED | SIGNAL-SPEC.md Section 7 with 16-effect table, QA checklist, architecture doc; CSS coverage complete |

---

### SFText API Note

The PLAN specified `intent="body"` and `intent="small"` for SFText, but the actual `sf-text.tsx` API uses `variant` (not `intent`) as the prop name. The implementation in `error.tsx` and `not-found.tsx` correctly uses `variant="body"` and `variant="small"` — this matches the real SFText API. The PLAN had an incorrect prop name, but the implementation is correct.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `components/layout/page-animations.tsx` | 78 | Comment mentions `[data-anim="hero-mesh"]` initial state is "set in CSS" — this is accurate, but CSS sets `opacity:0` specifically (the `[data-anim="hero-mesh"] { opacity: 0; }` rule comes BEFORE the catch-all `[data-anim] { opacity: 1 }` at line 1047 in globals.css). Correct behavior, worth noting for future debuggers. | Info | None — works correctly |

No blocker or warning-level anti-patterns found in phase 4 files. No TODO/FIXME/placeholder comments. No empty implementations. No hardcoded inflated counts remaining.

---

### data-anim CSS Coverage Audit

All `data-anim` values that have GSAP-controlled initial states (`opacity:0` set in globals.css) are explicitly covered in the reduced-motion reset:

| data-anim value | Has CSS initial-state rule | In reduced-motion reset | Coverage |
|-----------------|---------------------------|------------------------|----------|
| `section-reveal` | Yes (opacity:0, translateY) | Yes (explicit) | COVERED |
| `tag` | Yes (scale/opacity) | Yes (explicit) | COVERED |
| `comp-cell` | Yes (opacity:0) | Yes (explicit) | COVERED |
| `cta-btn` | Yes (opacity:0, translateY) | Yes (explicit) | COVERED |
| `hero-mesh` | Yes (opacity:0) | Yes (explicit — added Phase 4) | COVERED |
| `error-code` | Yes (opacity:0) | Yes (explicit — added Phase 4) | COVERED |
| `stagger > *` | Yes (opacity:0, translateY) | Yes (explicit) | COVERED |
| All others (hero-char, hero-title, hero-copy, etc.) | No — start visible via catch-all; GSAP sets opacity:0 at runtime | Yes (catch-all `[data-anim]`) | COVERED |

The catch-all `[data-anim] { opacity: 1 }` at globals.css line 1047 is the safety net for values without specific initial-state rules. Values like `hero-copy`, `hero-feel`, `hero-copy-dot`, etc. start visible — GSAP sets them to `opacity: 0` with `gsap.set()` or inline style before animating. In reduced-motion, GSAP never runs, so they remain visible. Architecture is sound.

---

### Human Verification Required

#### 1. Hero Performance Trace — ATF-02

**Test:** In Chrome DevTools, record a Performance trace from navigation start while loading `http://localhost:3000` at 1440x900. Identify the frame where the hero-mesh canvas element transitions from opacity:0 to a visible state.

**Expected:** The first visible opacity change on `[data-anim="hero-mesh"]` begins within 500ms of the navigation start timestamp. Given `delay:0` and the sub-100ms hydration of a Next.js App Router page on a local dev server, this should pass easily. On a cold 4G connection, the hydration latency is the variable — the GSAP fires at delay:0 relative to when the GSAP context initializes, not relative to navigation start.

**Why human:** Cannot run a browser Performance trace programmatically. The code is correctly structured for sub-500ms first motion (delay:0, duration:0.3, no upstream blocking calls), but only a DevTools trace confirms actual delivery timing.

#### 2. Reduced-Motion Hero Composition — ATF-01 / ATF-06

**Test:** In Chrome DevTools Rendering panel, enable "Emulate CSS media feature prefers-reduced-motion: reduce". Navigate to `http://localhost:3000` at 1440x900 viewport. Observe the hero.

**Expected:** SIGNAL//FRAME heading is fully visible immediately (no delay). Hero-mesh canvas is static and visible. "a system you can feel." text is visible. CTAs are visible. "28 SF COMPONENTS AND GROWING" is visible. The composition reads as a deliberate design, not a stripped-animation page.

**Why human:** Programmatic verification can confirm CSS coverage (done above) but cannot evaluate whether the static composition "reads as designed" — that's an aesthetic judgment requiring visual inspection.

---

### Gaps Summary

No blocking gaps found. All required artifacts exist, are substantive, and are correctly wired. The two human verification items are standard visual/performance checks that cannot be automated — they are gating on delivery timing and visual composition quality, not on implementation completeness.

The single notable finding is the SFText prop name discrepancy between PLAN (`intent`) and implementation (`variant`) — the implementation is correct; the PLAN had a documentation error.

---

*Verified: 2026-04-05*
*Verifier: Claude (gsd-verifier)*
