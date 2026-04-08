---
Generated: "2026-04-07T12:00:00Z"
Skill: /pde:hig (HIG)
Version: v1
Status: draft
Platform: web
Fidelity: hifi
Enhanced By: "none"
---

# HIG Audit: SignalframeUX

## Executive Summary

**Overall compliance: Partial — 23 findings across 9 mockup pages.**

The mockups demonstrate strong foundational structure (semantic HTML, `lang` attributes, descriptive `<title>` tags) but have systemic accessibility gaps in three areas: **image alt text** (data-alt instead of alt), **color contrast** (opacity-based text colors consistently fail WCAG AA), and **navigation landmarks** (missing skip links and landmark regions). These are structural patterns that affect every page and must be addressed before launch.

| Rating | Count | Action |
|--------|-------|--------|
| Critical | 3 | Must fix before any deployment |
| Major | 9 | Must fix for WCAG AA compliance |
| Minor | 8 | Should fix for robust accessibility |
| Nit | 3 | Polish items |

**Priority actions:**
1. Replace all `data-alt` with standard `alt` attributes on images
2. Add skip navigation link to all pages
3. Audit and fix all `text-white/20` and `text-white/40` opacity classes for contrast
4. Add `<main>` landmark and `aria-label` to nav elements
5. Implement visible `:focus-visible` styles

---

## POUR Compliance Table

| Principle | Criteria Checked | Pass | Fail | N/A | Score |
|-----------|-----------------|------|------|-----|-------|
| Perceivable (19) | 19 | 10 | 7 | 2 | 53% |
| Operable (22) | 22 | 12 | 7 | 3 | 55% |
| Understandable (13) | 13 | 10 | 2 | 1 | 77% |
| Robust (2) | 2 | 1 | 1 | 0 | 50% |
| **Total (56)** | **56** | **33** | **17** | **6** | **59%** |

---

## Findings by Severity

### Critical (3)

| Severity | Effort | Location | Issue | Suggestion | Reference |
|----------|--------|----------|-------|------------|-----------|
| critical | moderate | mockup-homepage.html: hero images, field layer image | Images use `data-alt` instead of standard `alt` attribute — screen readers cannot access image descriptions. Affects 2+ images per page across homepage, components, tokens mockups. | Replace all `data-alt="..."` with `alt="..."`. Decorative images should use `alt=""`. | WCAG 1.1.1 Non-text Content (A) |
| critical | quick-fix | All 9 mockups | No skip navigation link — keyboard users must Tab through entire nav on every page load. No bypass mechanism exists. | Add `<a href="#main" class="sr-only focus:not-sr-only">Skip to main content</a>` as first focusable element. Add `id="main"` to `<main>`. | WCAG 2.4.1 Bypass Blocks (A) |
| critical | moderate | mockup-homepage.html, mockup-tokens.html | `text-white/20` (rgba 255,255,255,0.2) on `#0A0A1A` background produces ~1.9:1 contrast ratio. Used for informational text ("Current Release", "GitHub Growth", "BUILT WITH SIGNALFRAME_UX CORE V2.4", spacing labels). Far below 4.5:1 minimum. | Replace `text-white/20` with `text-white/50` minimum (~5.7:1) for any text conveying information. Reserve `text-white/20` only for purely decorative text. | WCAG 1.4.3 Contrast Minimum (AA) |

### Major (9)

| Severity | Effort | Location | Issue | Suggestion | Reference |
|----------|--------|----------|-------|------------|-----------|
| major | moderate | All mockups | `text-white/40` (~4.0:1) used for body-level text in footers, nav items, metadata labels, stats. Fails 4.5:1 for normal text. At `text-[10px]` size, this is NOT large text and cannot use the 3:1 exception. | Replace `text-white/40` with `text-white/60` minimum (~6.5:1) for any readable text. | WCAG 1.4.3 Contrast Minimum (AA) |
| major | quick-fix | mockup-homepage.html | Heading hierarchy skips: `<h1>` (hero) → `<h3>` (SIGNAL LAYER, FIELD LAYER) → `<h2>` (API_COMMAND_CENTER). Levels skipped and out of order. | Use `<h2>` for section titles, `<h3>` for subsection titles. Ensure sequential nesting. | WCAG 1.3.1 Info and Relationships (A) |
| major | quick-fix | mockup-components.html | Heading hierarchy: `<h1>` → `<h2>` → `<h4>` (Signal vs Field Layer) — skips `<h3>`. | Change `<h4>` to `<h3>` for subsection headings within the detail panel. | WCAG 1.3.1 Info and Relationships (A) |
| major | moderate | All mockups | No visible `:focus-visible` styles defined. Default browser focus outlines may be suppressed or invisible on dark backgrounds. Keyboard users cannot track focus position. | Define explicit `:focus-visible` styles: `outline: 2px solid oklch(0.85 0.15 190); outline-offset: 2px;` on all interactive elements. | WCAG 2.4.7 Focus Visible (AA) |
| major | quick-fix | mockup-homepage.html, mockup-components.html | No `<main>` landmark element on homepage or components page. Screen reader users cannot jump to main content area. | Wrap primary content in `<main>` element. Components page already has `<main>` on inner content but homepage lacks it entirely. | WCAG 1.3.1 Info and Relationships (A) |
| major | moderate | mockup-tokens.html | Color swatch hover labels (`opacity-0 group-hover:opacity-100`) — OKLCH scale step numbers only visible on mouse hover. Not accessible via keyboard or screen reader. 11 color scales × 11 steps = 121 labels invisible to assistive tech. | Add `aria-label` with color value to each swatch div, or make labels permanently visible. Use `focus-within:opacity-100` alongside `group-hover:opacity-100`. | WCAG 2.1.1 Keyboard (A) |
| major | quick-fix | mockup-tokens.html | Fixed footer (`fixed z-50 bottom-0`) can obscure focused elements at page bottom. As user Tabs through bottom content, focused elements may be hidden behind the footer. | Add `scroll-padding-bottom` matching footer height. Or make footer `sticky` instead of `fixed` so it doesn't overlap content. | WCAG 2.4.11 Focus Not Obscured (AA) |
| major | moderate | mockup-tokens.html | Tab interface (Color/Typography/Spacing/Border/Shadow/Motion/Semantic) has no ARIA tab pattern. Buttons have no `role="tab"`, no `role="tablist"` wrapper, no `aria-selected` state, no keyboard arrow-key navigation. | Wrap in `<div role="tablist">`. Each tab: `role="tab"`, `aria-selected="true/false"`, `aria-controls`. Panels: `role="tabpanel"`, `aria-labelledby`. Arrow keys move between tabs. | WCAG 4.1.2 Name Role Value (A) |
| major | moderate | mockup-homepage.html | Continuous `animate-spin` animation (20s cycle) on hero geometric element with no pause control. Runs indefinitely. Also `animate-pulse` on status dot runs continuously. | Add `@media (prefers-reduced-motion: reduce) { .animate-spin, .animate-pulse { animation: none; } }`. For non-reduced-motion, add visible pause control if duration > 5 seconds. | WCAG 2.2.2 Pause Stop Hide (A) |

### Minor (8)

| Severity | Effort | Location | Issue | Suggestion | Reference |
|----------|--------|----------|-------|------------|-----------|
| minor | quick-fix | All mockups | Multiple `<nav>` elements lack `aria-label` — homepage has top nav and footer links; components has side nav and top nav. Screen readers announce "navigation" multiple times with no distinction. | Add `aria-label="Main navigation"`, `aria-label="Component categories"`, `aria-label="Footer links"` to differentiate. | WCAG 1.3.1 Info and Relationships (A) |
| minor | quick-fix | mockup-homepage.html | `<footer>` element not used as semantic landmark — footer content wrapped in `<footer>` but no `role="contentinfo"` explicit assignment (though HTML5 `<footer>` is implicit contentinfo when direct child of body). Verify nesting. | Ensure `<footer>` is direct child of `<body>` for automatic landmark role. If nested, add `role="contentinfo"` explicitly. | WCAG 1.3.1 Info and Relationships (A) |
| minor | quick-fix | All mockups | Text at `text-[8px]` and `text-[9px]` — 8-9px text is below practical readability threshold. While WCAG doesn't set a minimum font size, text this small creates usability issues at 200% zoom (still only 16-18px). | Minimum `text-[10px]` for any readable content; prefer `text-xs` (12px) for metadata. Reserve sub-10px only for truly decorative labels. | WCAG 1.4.4 Resize Text (AA) |
| minor | quick-fix | mockup-homepage.html | Material Symbols icon buttons (`menu`, `arrow_forward`, `auto_awesome`) rely on font ligature text as accessible name. While screen readers will read "menu", the icon font may fail to load, rendering gibberish. | Add explicit `aria-label` to icon-only buttons: `aria-label="Open menu"`, `aria-label="View signal layer"`. | WCAG 2.5.3 Label in Name (A) |
| minor | quick-fix | mockup-components.html | Disabled button has `disabled` attribute but loading button with spinner has no `aria-busy="true"` or loading announcement. Screen reader users don't know the button is in a loading state. | Add `aria-busy="true"` and `aria-label="Loading"` to loading button state. | WCAG 4.1.3 Status Messages (AA) |
| minor | moderate | All mockups | No `prefers-reduced-motion` media query declared in any mockup. All animations (pulse, spin, transitions, hover effects) run unconditionally. | Add `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }` or targeted per-animation rules. | WCAG 2.3.3 (AAA — advisory) |
| minor | quick-fix | mockup-homepage.html, mockup-components.html | `text-slate-500` on dark backgrounds (#0A0A1A–#121222) — slate-500 is #64748B which gives approximately 3.8:1 on #0A0A1A. Fails for normal text. Used in tokens page for metadata and labels. | Use `text-slate-400` (#94A3B8, ~5.8:1) minimum for readable text on dark backgrounds. | WCAG 1.4.3 Contrast Minimum (AA) |
| minor | quick-fix | mockup-getting-started.html | "What's Next" section links are full block elements (`<a>`) containing headings and paragraphs — the accessible name would be the entire text content. Long accessible names reduce usability for screen readers. | Add `aria-label` with concise purpose: `aria-label="Explore Components"` on the link element. | WCAG 2.4.4 Link Purpose (A) |

### Nit (3)

| Severity | Effort | Location | Issue | Suggestion | Reference |
|----------|--------|----------|-------|------------|-----------|
| nit | quick-fix | All mockups | Duplicate Google Fonts stylesheet imports — each page loads Material Symbols Outlined twice. No a11y impact but increases load time. | Remove duplicate `<link>` for Material Symbols. | Performance (not WCAG) |
| nit | quick-fix | mockup-tokens.html | `cursor-crosshair` used site-wide on footer and color swatches. Unconventional cursor may confuse users expecting standard pointer behavior. | Use `cursor-pointer` for interactive elements, default cursor for non-interactive. Reserve `cursor-crosshair` for precision selection tools. | Usability |
| nit | quick-fix | mockup-components.html | `rounded-sm`, `rounded` classes used on several elements — while this is the mockup (not production code), it conflicts with the zero border-radius design constraint. | Ensure production implementation enforces `rounded-none` per CLAUDE.md constraint. | Design constraint |

---

## Findings by Component

### Navigation (5 findings)

| ID | Severity | Issue | Pages Affected |
|----|----------|-------|----------------|
| NAV-01 | critical | No skip navigation link | All 9 pages |
| NAV-02 | major | No `<main>` landmark | Homepage, Components |
| NAV-03 | minor | Multiple `<nav>` without `aria-label` | All pages |
| NAV-04 | minor | Footer landmark nesting | Homepage |
| NAV-05 | major | Fixed footer obscures focus | Tokens |

### Images & Media (1 finding)

| ID | Severity | Issue | Pages Affected |
|----|----------|-------|----------------|
| IMG-01 | critical | `data-alt` instead of `alt` | Homepage (2+ images) |

### Color & Contrast (4 findings)

| ID | Severity | Issue | Pages Affected |
|----|----------|-------|----------------|
| CLR-01 | critical | `text-white/20` at ~1.9:1 | Homepage, Tokens, Components |
| CLR-02 | major | `text-white/40` at ~4.0:1 | All pages |
| CLR-03 | minor | `text-slate-500` at ~3.8:1 | Tokens, Components, Getting Started |
| CLR-04 | minor | Sub-10px text readability | All pages |

### Interactive Controls (4 findings)

| ID | Severity | Issue | Pages Affected |
|----|----------|-------|----------------|
| INT-01 | major | No visible focus styles | All pages |
| INT-02 | major | Token swatches hover-only labels | Tokens |
| INT-03 | major | Tab interface missing ARIA | Tokens |
| INT-04 | minor | Icon buttons rely on font ligatures | Homepage, Components |

### Motion & Animation (2 findings)

| ID | Severity | Issue | Pages Affected |
|----|----------|-------|----------------|
| MOT-01 | major | Continuous animation, no pause | Homepage |
| MOT-02 | minor | No prefers-reduced-motion query | All pages |

### Headings & Structure (2 findings)

| ID | Severity | Issue | Pages Affected |
|----|----------|-------|----------------|
| HDG-01 | major | Heading hierarchy skip (h1→h3) | Homepage |
| HDG-02 | major | Heading hierarchy skip (h2→h4) | Components |

### Forms & Status (1 finding)

| ID | Severity | Issue | Pages Affected |
|----|----------|-------|----------------|
| FRM-01 | minor | Loading button no aria-busy | Components |

### Links (1 finding)

| ID | Severity | Issue | Pages Affected |
|----|----------|-------|----------------|
| LNK-01 | minor | Block links with long accessible names | Getting Started |

---

## Platform-Specific Notes (Web)

### Landmark Regions

| Landmark | Status | Notes |
|----------|--------|-------|
| `<banner>` (header) | Partial | Nav exists but not wrapped in `<header>` on all pages |
| `<main>` | Missing | Absent on homepage; present on components inner content and getting-started |
| `<nav>` | Present | Multiple navs without distinguishing `aria-label` |
| `<contentinfo>` (footer) | Present | `<footer>` element present on all pages |
| Skip navigation | Missing | No skip link on any page |

### ARIA Patterns

| Pattern | Status | Notes |
|---------|--------|-------|
| Tabs (Tier 2) | Missing | Token page tab interface lacks ARIA tab pattern |
| Button (Tier 1) | Partial | Some icon buttons lack explicit `aria-label` |
| Dialog (Tier 2) | N/A | No modals in current mockups |
| Status/Alert | Missing | Loading states lack `aria-busy`; no `role="status"` regions |

### Focus Ring Visibility (Dark Mode)

The mockups use an extremely dark background (`#0A0A1A`). Default browser focus outlines (typically blue) may have insufficient contrast against this background. Custom focus styles are mandatory:

**Recommended:** `outline: 2px solid oklch(0.82 0.16 190); outline-offset: 2px;` (cyan at ~8:1 against #0A0A1A)

---

## WCAG 2.2 New Criteria Results

| Criterion | Level | Result | Notes |
|-----------|-------|--------|-------|
| 2.4.11 Focus Not Obscured (Minimum) | AA | **FAIL** | Fixed footer on tokens page can obscure focused elements |
| 2.5.7 Dragging Movements | AA | **PASS** | No drag interactions detected in mockups |
| 2.5.8 Target Size (Minimum) | AA | **PASS** | Interactive elements meet 24x24px minimum (buttons 32px+, nav links adequately sized) |
| 3.2.6 Consistent Help | A | **N/A** | No help mechanism present in mockups |
| 3.3.7 Redundant Entry | A | **N/A** | No multi-step forms in mockups |
| 3.3.8 Accessible Authentication (Minimum) | AA | **N/A** | No authentication flows in mockups |

---

## Recommendations

**Priority 1 — Critical (fix immediately):**

1. **Replace `data-alt` with `alt`** on all `<img>` elements. Audit all 9 mockups. Decorative images get `alt=""`. Informative images get descriptive alt text.
2. **Add skip navigation** as first focusable element on every page: `<a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-secondary focus:text-background">Skip to main content</a>`
3. **Fix `text-white/20` contrast** — replace with `text-white/50` minimum for any information-bearing text. If decorative, verify it's truly non-essential.

**Priority 2 — Major (fix before WCAG AA claim):**

4. **Fix `text-white/40` contrast** — replace with `text-white/60` for readable text. Affects all pages.
5. **Add visible focus styles** — define `:focus-visible` with cyan outline (matches design language) across all interactive elements.
6. **Fix heading hierarchy** — ensure sequential nesting on all pages.
7. **Add `<main>` landmark** to homepage and any page missing it.
8. **Add ARIA tab pattern** to token page tab interface.
9. **Fix token swatch labels** — make accessible without hover.
10. **Fix fixed footer overlap** — add `scroll-padding-bottom` or switch to sticky.
11. **Address continuous animations** — add `prefers-reduced-motion` and pause controls.

**Priority 3 — Minor/Nit (polish):**

12. Add `aria-label` to all `<nav>` elements.
13. Add explicit `aria-label` to icon-only buttons.
14. Add `aria-busy` to loading states.
15. Increase minimum text size to 10px.
16. Remove duplicate stylesheet imports.

---

*Generated by PDE-OS /pde:hig | 2026-04-07 | Platform: web | Fidelity: hifi*

[Manual accessibility review — install a11y MCP for automated WCAG scanning]
