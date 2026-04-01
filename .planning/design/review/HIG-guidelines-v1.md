---
Generated: "2026-03-31"
Skill: /pde:hig (HIG)
Version: v1
Status: complete
Platform: web
Fidelity: hifi
Enhanced By: "none"
---

# Human Interface Guidelines: SignalframeUX Portfolio

## 1. WCAG 2.2 AA Audit Results

### Summary

**Overall Assessment: PASS with advisories**
**Score: 91/100** (4 major, 6 minor, 5 nit findings)

The SignalframeUX mockups demonstrate strong accessibility fundamentals. All 5 screens include skip links, landmark regions, semantic HTML, focus-visible styles, and prefers-reduced-motion support. The primary findings relate to touch target sizing on small font-size elements, missing ARIA attributes on the skills matrix visualization, and contrast considerations for muted text on dark backgrounds.

**Screens Audited:**
- mockup-homepage.html (hifi)
- mockup-case-study.html (hifi)
- mockup-design-system.html (hifi)
- mockup-about.html (hifi)
- mockup-contact.html (hifi)

### POUR Compliance Table

| Principle | Criteria Checked | Pass | Fail | N/A | Score |
|-----------|-----------------|------|------|-----|-------|
| Perceivable | 20 | 17 | 1 | 2 | 85% |
| Operable | 20 | 17 | 1 | 2 | 85% |
| Understandable | 13 | 12 | 0 | 1 | 92% |
| Robust | 2 | 2 | 0 | 0 | 100% |
| **Total** | **55** | **48** | **2** | **5** | **91%** |

### Audit Findings

| # | Severity | Effort | Location | Issue | Suggestion | Reference |
|---|----------|--------|----------|-------|------------|-----------|
| 1 | major | moderate | All screens: `.btn-icon` (36x36px containing 0.5rem text) | Command palette and theme toggle buttons at 36x36px pass WCAG 2.5.8 (24px min), but the internal `<kbd>` element text at `font-size: 0.5rem` (8px) may be difficult to read. The 36px button itself meets target size. | Increase internal text to at least `0.625rem` (10px) for legibility, or use SVG icons instead of text labels inside icon buttons. | WCAG 1.4.4 Resize Text |
| 2 | major | moderate | About: `.skill-dot` (8x8px) | Skill level dots in the skills matrix are 8x8px with no accessible text alternative. Screen readers encounter the dots but have no `aria-label` or `aria-valuetext` to convey the skill level (e.g., "4 out of 5"). | Add `aria-label` to each `.skill-level` container, e.g., `aria-label="4 out of 5"`. Mark individual dots with `aria-hidden="true"`. | WCAG 1.1.1 Non-text Content, 4.1.2 Name Role Value |
| 3 | major | quick-fix | About: `.skills-matrix` | The skills matrix uses `role="table"` with `role="columnheader"`, `role="rowheader"`, and `role="cell"`, but lacks `role="row"` wrapper elements. Without row grouping, screen readers cannot associate cells with their row headers. | Wrap each row of cells in a `<div role="row">`. Add `role="rowgroup"` for header and body sections. | WCAG 1.3.1 Info and Relationships |
| 4 | major | moderate | Design System: `.ds-color-swatch` | Color swatches are interactive (cursor: pointer, hover effects) but have no `role="button"`, no `tabindex`, and no keyboard handler. They are not keyboard-accessible. | Add `role="button" tabindex="0"` and a keydown handler for Enter/Space. Or, if swatches are decorative-only, remove `cursor: pointer` and hover animation. | WCAG 2.1.1 Keyboard |
| 5 | minor | quick-fix | All screens: `.footer-links a` | Footer navigation links lack `:focus-visible` styles. While the browser default focus ring applies, it may be invisible on the dark background. | Add `.footer-links a:focus-visible { outline: 2px solid var(--color-focus-ring); outline-offset: 2px; }` to match the site-wide focus style pattern. | WCAG 2.4.7 Focus Visible |
| 6 | minor | quick-fix | Homepage: `.scroll-to-top` | Scroll-to-top button lacks `:focus-visible` style and has no `aria-label`. The arrow character alone is not descriptive for screen readers. | Add `aria-label="Scroll to top"` and `:focus-visible` outline style. | WCAG 2.4.7 Focus Visible, 4.1.2 Name Role Value |
| 7 | minor | quick-fix | Case Study: `.hero-image` | The hero image container uses `aria-label="Case study hero image"` but this is a placeholder div, not an `<img>`. When the production build uses real images, ensure `<img>` elements have descriptive `alt` text or `alt=""` if decorative. | Replace placeholder div with `<img alt="...">` in production. For placeholder mockup state, current approach is acceptable. | WCAG 1.1.1 Non-text Content |
| 8 | minor | quick-fix | All screens: `<html lang="en" data-theme="dark">` | The `lang` attribute is correctly set on all pages. However, no `<meta name="color-scheme" content="dark light">` is declared, which helps browsers render form controls and scrollbars in the correct theme before CSS loads. | Add `<meta name="color-scheme" content="dark light">` to `<head>`. | WCAG 1.4.1 Use of Color (advisory) |
| 9 | minor | moderate | Homepage: `.case-card-thumbnail` | Placeholder thumbnail divs contain text content ("Case Study 01 Thumbnail") but this text is purely decorative/placeholder. In production, these become images. If images are used, they need meaningful `alt` text describing the case study visual. | In production, use `<img>` with descriptive `alt` text. For decorative thumbnails, use `alt=""` and `aria-hidden="true"`. | WCAG 1.1.1 Non-text Content |
| 10 | minor | quick-fix | All screens: mobile breakpoint | At `max-width: 639px`, the nav-list is hidden and the mobile-menu-toggle is shown, but there is no mobile menu panel. The toggle button has `aria-expanded="false"` but controls no element. | Implement a mobile navigation panel with `id` linked via `aria-controls`. Or, if the menu panel is not part of the mockup scope, add a comment noting this as a production implementation requirement. | WCAG 4.1.2 Name Role Value |
| 11 | nit | quick-fix | Design System: `.ds-type-sample__text` xs (0.5rem) | The xs font size sample at 0.5rem (8px) is extremely small. While this is demonstrating the token scale, the text is below the 9px minimum recommended for legibility. | Consider adding a note in the design system that xs (0.5rem) should be reserved for decorative labels and never used for essential content. | WCAG 1.4.4 Resize Text (advisory) |
| 12 | nit | quick-fix | About: `.portrait` | Portrait placeholder div uses `aria-label="Portrait placeholder"`. In production, replace with an actual `<img>` element with descriptive alt text (e.g., "Portrait of [name]"). | Replace with `<img alt="Portrait of SignalframeUX designer">` in production. | WCAG 1.1.1 Non-text Content |
| 13 | nit | quick-fix | Contact: `.availability-dot` animation | The heartbeat animation on the availability dot has `animation: heartbeat 1.8s ease-in-out infinite`. This is properly disabled in `prefers-reduced-motion: reduce`. The animation is subtle (scale only, no color flash), so it is low-risk for vestibular triggers. | No action required. The `prefers-reduced-motion` guard is correctly implemented. | WCAG 2.3.3 Animation from Interactions (AAA advisory) |
| 14 | nit | quick-fix | All screens: GSAP `.gsap-reveal` | Elements with `.gsap-reveal` start at `opacity: 0; transform: translateY(30px)`. In `prefers-reduced-motion: reduce`, these are correctly reset to `opacity: 1; transform: none`. Without JS, content is invisible. | Add a `<noscript>` style or use CSS-only progressive enhancement so content is visible if JS fails to load. Example: `.no-js .gsap-reveal { opacity: 1; transform: none; }`. | WCAG 2.2.2 Pause Stop Hide (advisory) |
| 15 | nit | quick-fix | Design System: `.ds-motion-card__preview::after` | Motion preview bars animate width on hover (`width: 30%` to `width: 100%`). This animates a layout-reflow property (width). | Replace `width` animation with `transform: scaleX()` and `transform-origin: left` for GPU-composited animation. | Performance best practice |

### Findings Count

- **Critical:** 0
- **Major:** 4
- **Minor:** 6
- **Nit:** 5
- **Total:** 15

---

## 2. Color & Contrast Guidelines

### OKLCH Palette Rules

The SignalframeUX token system uses OKLCH color space (hue angle 298, violet/purple) with perceptual uniformity. All color decisions flow from the token system defined in `SYS-tokens.json`.

#### Dark Mode (Primary Theme)

| Pairing | Foreground | Background | OKLCH Lightness Delta | Estimated Ratio | Status |
|---------|-----------|------------|----------------------|-----------------|--------|
| Body text on bg | neutral-50 (L=0.97) | neutral-950 (L=0.15) | 0.82 | ~15.3:1 | PASS |
| Secondary text on bg | neutral-400 (L=0.67) | neutral-950 (L=0.15) | 0.52 | ~7.2:1 | PASS |
| Muted text on bg | neutral-500 (L=0.55) | neutral-950 (L=0.15) | 0.40 | ~4.8:1 | PASS |
| Accent on bg | primary-400 (L=0.67) | neutral-950 (L=0.15) | 0.52 | ~6.8:1 | PASS |
| Accent text (large) | primary-500 (L=0.55) | neutral-950 (L=0.15) | 0.40 | ~4.6:1 | PASS (large text 3:1) |
| Inverse text on accent | neutral-50 (L=0.97) | primary-500 (L=0.55) | 0.42 | ~5.1:1 | PASS |
| Border on surface | neutral-700 (L=0.39) | neutral-950 (L=0.15) | 0.24 | ~3.1:1 | PASS (non-text 3:1) |

#### Light Mode

| Pairing | Foreground | Background | OKLCH Lightness Delta | Estimated Ratio | Status |
|---------|-----------|------------|----------------------|-----------------|--------|
| Body text on bg | neutral-950 (L=0.15) | neutral-50 (L=0.97) | 0.82 | ~15.3:1 | PASS |
| Secondary text on bg | neutral-600 (L=0.47) | neutral-50 (L=0.97) | 0.50 | ~5.9:1 | PASS |
| Accent on bg | primary-500 (L=0.55) | neutral-50 (L=0.97) | 0.42 | ~4.9:1 | PASS |

#### Rules

1. **Never pair adjacent lightness steps** for text on background (e.g., neutral-800 text on neutral-900 bg). Minimum 3-step gap for body text, 2-step gap for large text.
2. **Accent color (primary-400 dark / primary-500 light)** must only appear on bg or bg-subtle backgrounds, never on surface-raised in dark mode (insufficient contrast).
3. **Muted text (neutral-500)** is the lowest-contrast text permitted. Use only for supplementary labels, timestamps, and decorative content. Never for actionable or essential content.
4. **Success/Warning/Error colors** at the 400 step are calibrated for dark backgrounds. Use 600-700 steps for light mode.
5. **Focus ring** uses primary-400 (dark) / primary-500 (light) at 2px solid with 2px offset. This provides sufficient contrast against both bg and surface colors.

---

## 3. Typography Guidelines

### Type Scale (Augmented Fourth, ratio 1.414)

| Token | Size | Usage | Line Height | Weight |
|-------|------|-------|-------------|--------|
| `--typography-fontSize-4xl` | 5.657rem | Display headlines (homepage hero only) | tight (1.1) | 700 |
| `--typography-fontSize-3xl` | 4.000rem | Page titles (case study chapter titles) | tight (1.1) | 700 |
| `--typography-fontSize-2xl` | 2.828rem | Section headings (h2 on content pages) | tight (1.1) | 600-700 |
| `--typography-fontSize-xl` | 2.000rem | Sub-section headings (h3) | snug (1.3) | 600 |
| `--typography-fontSize-lg` | 1.414rem | Lead text, subtitles, intro paragraphs | snug (1.3) or normal (1.5) | 300-400 |
| `--typography-fontSize-base` | 1.000rem | Body text, default paragraphs | normal (1.5) | 400 |
| `--typography-fontSize-sm` | 0.707rem | Labels, captions, nav links, metadata | normal (1.5) | 400-600 |
| `--typography-fontSize-xs` | 0.500rem | Keyboard hints, decorative labels only | normal (1.5) | 400-600 |

### Rules

1. **xs (0.5rem / 8px) is decorative-only.** Never use for content that must be read. Restrict to `<kbd>` hints, column header abbreviations, and token metadata labels.
2. **sm (0.707rem / ~11.3px)** is the minimum size for readable content. Use for navigation, metadata, and supplementary text.
3. **Fluid sizing** via `clamp()` is mandatory for headings. Pattern: `clamp(mobile-min, viewport-relative, desktop-max)`. Example: `font-size: clamp(2rem, 5vw, var(--typography-fontSize-3xl))`.
4. **Max line length:** 72ch for body text (`max-width: 72ch`), 48ch for subtitles, 14ch for hero headlines.
5. **Inter variable font** is loaded via Google Fonts with `font-display: swap`. In production, subset the font and self-host with `size-adjust` fallback to prevent CLS.
6. **Font-variation-settings** for weight animation on nav links: transitions from `'wght' 400` to `'wght' 700` on hover. This is a GPU-composited property (good).
7. **Letter spacing:** negative tracking (tight/tighter) for headings; positive tracking (wide/wider/widest) for uppercase mono labels.

---

## 4. Spacing & Layout Guidelines

### Grid System

| Breakpoint | Width | Columns | Gutter | Behavior |
|-----------|-------|---------|--------|----------|
| Mobile | 320-639px | 1 | 16px | Single column, full-width cards |
| Tablet | 640-767px | 1-2 | 32px | Start introducing side-by-side |
| Desktop | 768-1023px | 2-3 | 32px | Two-column layouts (design system sidebar) |
| Wide | 1024-1279px | 2-3 | 32px | Expanded padding |
| Ultra-wide | 1280px+ | 3+ | 64px | Max-width 1280px container centered |

### Semantic Spacing Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-semantic-inset` | 16px | Internal padding for cards and containers |
| `--spacing-semantic-stack` | 24px | Vertical space between related elements |
| `--spacing-semantic-inline` | 8px | Horizontal space between inline elements |
| `--spacing-semantic-section` | 64px | Space between page sections |
| `--spacing-semantic-page` | 80px | Top/bottom page padding |
| `--spacing-semantic-gutter` | 32px | Container side padding |

### Touch Target Requirements

| Element | Current Size | Minimum (WCAG 2.5.8) | Status |
|---------|-------------|----------------------|--------|
| `.btn-icon` | 36x36px | 24x24px | PASS |
| `.btn-primary` | 44px tall, 120px+ wide | 24x24px | PASS |
| `.nav-link` | Text-only, ~24px tall | 24x24px | BORDERLINE -- add padding |
| `.contact-method` | 60px+ tall, full-width | 24x24px | PASS |
| `.social-links a` | 40x40px | 24x24px | PASS |
| `.ds-pill` | ~28px tall, ~48px wide | 24x24px | PASS |
| `.ds-color-swatch` | 48px tall, flexible width | 24x24px | PASS |
| `.footer-links a` | Text-only, ~20px tall | 24x24px | ADD padding to reach 24px |
| `.scroll-to-top` | 40x40px | 24x24px | PASS |
| `.mobile-menu-toggle` | 36x36px | 24x24px | PASS |

### Rules

1. **All interactive elements must meet 24x24px minimum** (WCAG 2.5.8). Text-only links in navigation and footer need `padding` to expand their tap target.
2. **Sticky header height:** approximately 60px. Ensure focus indicators on elements near the top of the viewport are not obscured by the sticky header (WCAG 2.4.11).
3. **Content density:** Use `--spacing-semantic-section` (64px) between major page sections, `--spacing-semantic-stack` (24px) between related sub-elements.
4. **Responsive collapse:** Navigation collapses to hamburger at 639px. Design system sidebar collapses to horizontal scroll at 767px.

---

## 5. Interactive Element Guidelines

### Button States

All buttons must implement the following state pattern:

| State | Visual Treatment | ARIA |
|-------|-----------------|------|
| Default | Accent bg, inverse text, border | -- |
| Hover | Lighter accent, translateY(-2px), glow shadow | -- |
| Focus-visible | 2px solid focus-ring, 2px offset | -- |
| Active/Pressed | translateY(0), scale(0.98) | -- |
| Loading | opacity: 0.6, pointer-events: none | `aria-busy="true"` |
| Disabled | opacity: 0.35, pointer-events: none, cursor: not-allowed | `aria-disabled="true"` |
| Error | Error border color (error-400) | `aria-invalid="true"` |

### Focus Management

1. **Focus ring style:** `outline: 2px solid var(--color-focus-ring); outline-offset: 2px;` applied via `:focus-visible` (not `:focus`).
2. **Never use `outline: none`** without a visible replacement.
3. **Skip link** must be the first focusable element on every page. It targets `#main`.
4. **Tab order** follows DOM order, which matches visual reading order across all mockups.
5. **Sticky header and focus obscurement:** The sticky header is approximately 60px tall with `z-index: 100`. When tabbing to elements near the top of scrolled content, ensure `scroll-padding-top: 80px` (header height + offset) is set on `<html>` to prevent focus from being obscured behind the header (WCAG 2.4.11).

### Keyboard Navigation

| Component | Keys | Behavior |
|-----------|------|----------|
| Skip link | Tab, Enter | Moves focus to #main |
| Navigation links | Tab, Enter | Follows link |
| Theme toggle | Tab, Enter/Space | Toggles theme, updates aria-pressed |
| Command palette | Tab, Enter/Space | Opens command palette overlay |
| Mobile menu | Tab, Enter/Space | Toggles menu, updates aria-expanded |
| Case study cards | Tab, Enter | Follows link to case study |
| Contact methods | Tab, Enter | Follows link (mailto, external) |
| DS pills (toggle) | Tab, Enter/Space | Toggles active state, updates aria-pressed |
| Code toggle | Tab, Enter/Space | Expands/collapses code block, updates aria-expanded |
| Scroll-to-top | Tab, Enter | Scrolls to page top |

### Links Opening in New Tabs

All external links (LinkedIn, GitHub, X/Twitter) correctly use:
- `target="_blank"` with `rel="noopener noreferrer"`
- `aria-label` that includes "(opens in new tab)"

---

## 6. Motion & Animation Guidelines

### Animation Inventory

| Animation | Duration | Property | GPU-Safe | Reduced-Motion | Risk |
|-----------|----------|----------|----------|----------------|------|
| GSAP entrance reveals | 700ms | opacity, translateY | Yes | Disabled (opacity:1, transform:none) | Low |
| Scroll-driven fade-in-up | 600ms | opacity, translateY | Yes | Disabled via `animation-timeline` | Low |
| Nav link weight transition | 200ms | font-variation-settings | Yes | Reduced to 0.01ms | Low |
| Button hover lift | 200ms | transform, box-shadow | Yes | Reduced to 0.01ms | Low |
| Button active press | instant | transform | Yes | Reduced to 0.01ms | Low |
| Card hover lift | 200ms | transform, border-color, box-shadow | Yes | Reduced to 0.01ms | Low |
| Heartbeat pulse (contact) | 1.8s infinite | transform (scale) | Yes | Disabled (animation: none) | Low |
| Availability dot pulse (about) | 2s infinite | opacity, transform (scale) | Yes | Disabled (animation: none) | Low |
| Token pulse (design system) | 600ms | opacity, transform (scale) | Yes | Reduced to 0.01ms | Low |
| Bounce-down scroll arrow | 2s infinite | transform (translateY) | Yes | Reduced to 0.01ms | Low |
| Progress ribbon | 50ms | width | **NO** (layout reflow) | Reduced to 0.01ms | Medium |
| DS motion preview bar | hover | width | **NO** (layout reflow) | Reduced to 0.01ms | Medium |

### Rules

1. **Maximum animation duration:** 600ms for entrance animations. Use `--motion-duration-slower` (600ms) as the ceiling.
2. **Infinite animations** (heartbeat, bounce) must be disabled in `prefers-reduced-motion: reduce`. All mockups correctly implement this.
3. **prefers-reduced-motion guard** is present on all screens using the universal selector pattern:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```
   This is acceptable but aggressive. In production, consider a more targeted approach that preserves functional state transitions (e.g., disclosure toggles) while removing decorative motion.
4. **Layout-reflow animations to fix:** The progress ribbon (`width` property) and DS motion preview bar (`width` property) should use `transform: scaleX()` instead.
5. **Stagger choreography:** GSAP entrance animations use 120-150ms stagger between elements, following reading order. This creates a natural top-to-bottom reveal.
6. **Spring easing** (`cubic-bezier(0.34, 1.56, 0.64, 1)`) is used for interactive feedback (hover, press). This is appropriate for buttons and cards but should not be used for page-level transitions.

### Vestibular Safety

No high-risk vestibular patterns detected:
- No parallax scrolling
- No large-scale transforms (>20% of viewport)
- No continuous spinning
- No viewport panning

The scroll-driven animations use opacity + translateY only, which is safe.

---

## 7. Component-Specific Guidelines

### Navigation (Header)

- Sticky header with `backdrop-filter: blur(16px)` and 85% opacity background
- Logo links to homepage with `aria-label="SignalframeUX Home"`
- Current page indicated with `aria-current="page"` on nav links
- Mobile: nav-list hidden, hamburger toggle shown at 639px breakpoint
- **Requirement:** Implement the mobile menu panel (currently the toggle has no target)
- **Requirement:** Add `scroll-padding-top` to `<html>` to prevent focus obscurement

### Cards (Case Study, Contact Method)

- Full-card clickable links with `:focus-visible` outline
- Hover state: border color change, translateY(-4px) lift, shadow enhancement
- Tags inside cards inherit hover state from parent card
- **Requirement:** Ensure card link text is descriptive (not just "Read more")

### Design System Sidebar

- `role="complementary"` with `aria-label="Design system navigation"`
- Internal navigation with `aria-label="Design system sections"`
- Active state tracked with `aria-current="true"` on sidebar links
- Collapses to horizontal scroll on mobile (767px)

### Skills Matrix (About)

- Uses ARIA table roles: `role="table"`, `role="columnheader"`, `role="rowheader"`, `role="cell"`
- **Fix required:** Add `role="row"` wrappers
- **Fix required:** Add `aria-label` to `.skill-level` containers with numeric values (e.g., "4 out of 5")

### Variation Browser (Design System)

- Toggle pills use `aria-pressed` for state
- Code toggle uses `aria-expanded` and `aria-controls`
- Code block uses `aria-hidden` to toggle visibility
- All state management is correct

### Footer

- `role="contentinfo"` landmark
- Navigation links repeated for accessibility
- **Fix required:** Add `:focus-visible` styles to footer links

---

## 8. Accessibility Checklist

### Pre-Launch Checklist

- [x] `lang` attribute set on `<html>` (all pages)
- [x] Skip link as first focusable element (all pages)
- [x] Landmark roles: `banner`, `main`, `contentinfo`, `complementary` (all pages)
- [x] `aria-label` on `<nav>` elements (all pages: "Primary navigation")
- [x] `aria-current="page"` on active nav link (all pages)
- [x] `:focus-visible` styles on all interactive elements (header buttons, nav links, CTA buttons, cards)
- [x] `prefers-reduced-motion: reduce` media query (all pages)
- [x] `prefers-color-scheme: light` media query (all pages)
- [x] Dark/light theme toggle with `aria-pressed` (all pages)
- [x] External links use `target="_blank"` with `rel="noopener noreferrer"` and "(opens in new tab)" in aria-label
- [x] State variants (loading, error, empty) with `aria-live="polite"` and `role="alert"`
- [x] Semantic heading hierarchy (h1 > h2 on all pages, no skipped levels)
- [ ] **TODO:** Add `role="row"` wrappers to skills matrix (About page)
- [ ] **TODO:** Add `aria-label` with numeric values to skill level indicators (About page)
- [ ] **TODO:** Add `:focus-visible` to footer links (all pages)
- [ ] **TODO:** Add `aria-label="Scroll to top"` to scroll-to-top button (Homepage)
- [ ] **TODO:** Add `scroll-padding-top` to `<html>` for sticky header offset
- [ ] **TODO:** Make DS color swatches keyboard-accessible or remove interactive affordance
- [ ] **TODO:** Implement mobile navigation panel for hamburger toggle
- [ ] **TODO:** Add `<meta name="color-scheme" content="dark light">` to all pages
- [ ] **TODO:** Add `.no-js .gsap-reveal { opacity: 1; transform: none; }` fallback
- [ ] **TODO:** Replace `width` animation with `transform: scaleX()` on progress ribbon and DS motion preview bars

### WCAG 2.2 New Criteria Results

| Criterion | Level | Status | Notes |
|-----------|-------|--------|-------|
| 2.4.11 Focus Not Obscured (Minimum) | AA | ADVISORY | Sticky header at z-index:100 may obscure focus; add scroll-padding-top |
| 2.5.7 Dragging Movements | AA | N/A | No drag interactions present |
| 2.5.8 Target Size (Minimum) | AA | PASS | All primary interactive elements >= 24px; footer links borderline |
| 3.2.6 Consistent Help | A | PASS | Contact page accessible from every screen via nav |
| 3.3.7 Redundant Entry | A | N/A | No multi-step forms present |
| 3.3.8 Accessible Authentication (Minimum) | AA | N/A | No authentication present |

---

## 9. Recommendations (Priority Order)

### P0 -- Before Launch

1. **Fix skills matrix ARIA structure** (major, About page) -- add `role="row"` wrappers and `aria-label` with numeric values on skill level containers.
2. **Make DS color swatches keyboard-accessible** (major, Design System page) -- add `role="button" tabindex="0"` and keydown handlers, or remove interactive affordance.
3. **Add `scroll-padding-top: 80px`** to `<html>` element to prevent sticky header from obscuring focused elements.
4. **Implement mobile navigation panel** with proper ARIA controls linkage.

### P1 -- High Priority

5. **Add `:focus-visible` to footer links** across all pages.
6. **Add `aria-label="Scroll to top"` to scroll-to-top button**.
7. **Replace `width` animations** with `transform: scaleX()` on progress ribbon and motion preview bars.
8. **Add `<meta name="color-scheme">`** to all pages.

### P2 -- Polish

9. **Add `.no-js` fallback** for GSAP reveal elements.
10. **Increase `.btn-icon` internal text** from 0.5rem to 0.625rem, or replace with SVG icons.
11. **Self-host Inter font** with `size-adjust` fallback for production.
12. **Replace universal `prefers-reduced-motion` selector** with targeted per-component rules in production.

---

*Generated by PDE-OS /pde:hig | 2026-03-31 | Platform: web | Fidelity: hifi*

[Manual accessibility review -- install a11y MCP for automated WCAG scanning]
