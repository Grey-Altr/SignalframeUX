# CRT-A11Y-CRITIQUE-V1 -- Accessibility Audit (WCAG 2.1 AA)

**Target:** SignalframeUX Next.js 15 app
**Date:** 2026-04-01
**Scope:** Keyboard navigation, screen reader support, ARIA, focus management, color contrast, reduced-motion, semantic HTML, landmarks, skip links, form labels, touch targets
**Score: 58 / 100**

---

## Summary

The codebase has a solid foundation: `lang="en"` on `<html>`, a skip-to-content link, `prefers-reduced-motion` CSS blanket, `aria-hidden="true"` on decorative overlays, and `aria-label` on the dark mode toggle. However, significant gaps remain in keyboard operability, screen reader announcements, semantic structure, ARIA roles on interactive widgets, and contrast verification for the custom OKLCH palette. The heaviest issues cluster around the API Explorer sidebar (no keyboard navigation or ARIA roles), the component grid (div-based "cards" with no keyboard access), and missing `lang` attributes on multilingual content.

---

## Findings

| # | Severity | Effort | Location | Issue | Suggestion | Weight |
|---|----------|--------|----------|-------|------------|--------|
| 1 | critical | moderate | `components/blocks/api-explorer.tsx:126-158` | API sidebar navigation uses plain `<button>` elements inside a scrollable `<aside>` with no `role="navigation"`, no `aria-label`, and no keyboard arrow-key support. Users cannot navigate items with Up/Down arrow keys as expected for a sidebar nav. | Wrap the sidebar list in a `<nav aria-label="API sections">`. Add `role="listbox"` or use `<ul>/<li>` markup. Implement `onKeyDown` handler for arrow keys, Home, End. Track `aria-selected` or `aria-current` on the active item. | 12 |
| 2 | critical | moderate | `components/blocks/components-explorer.tsx:348-405` | Component grid cells are `<div>` elements with `cursor-pointer` styling but no keyboard interactivity. They cannot be focused or activated via keyboard. Screen readers see no interactive semantics. | Convert each cell to a `<button>` or `<a>` (if it navigates). Add `tabindex="0"`, `role="link"` or `role="button"`, and an `onKeyDown` handler for Enter/Space. Add an accessible name via `aria-label` (e.g., "Button component, v2.1.0"). | 12 |
| 3 | critical | significant | `components/blocks/hero.tsx:53-67` | Multilingual text (Japanese katakana, Farsi, Mandarin) lacks `lang` attributes. Screen readers will attempt to pronounce these scripts with English phonetic rules, producing unintelligible output. The Farsi text has `dir="rtl"` (good) but no `lang="fa"`. | Add `lang="ja"` to the katakana `<p>`, `lang="fa"` to the Farsi `<p>`, and `lang="zh"` to the Mandarin `<p>`. This is a WCAG 3.1.2 Level AA requirement (Language of Parts). | 10 |
| 4 | major | moderate | `components/blocks/components-explorer.tsx:332-338` | The search `<SFInput>` has `placeholder="SEARCH COMPONENTS..."` but no associated `<label>` element or `aria-label`. Placeholder text alone does not satisfy WCAG 1.3.1 (Info and Relationships) -- it disappears when the user types and is not exposed as a label by all screen readers. | Add `aria-label="Search components"` to the `<SFInput>`, or add a visually hidden `<label htmlFor="...">` paired with an `id` on the input. | 8 |
| 5 | major | moderate | `components/blocks/components-explorer.tsx:319-331` | Filter buttons (ALL, FRAME, SIGNAL, etc.) behave as a single-select toggle group but have no grouping ARIA semantics. Screen readers cannot convey which filter is active or that these form a set. | Wrap the filter buttons in a container with `role="radiogroup"` and `aria-label="Filter by category"`. Add `role="radio"` and `aria-checked` to each button, or use `aria-pressed` with `role="toolbar"`. | 8 |
| 6 | major | moderate | `components/blocks/hero.tsx:8` | The hero `<section>` has no `aria-label` or heading association. It is the primary landmark on the homepage but screen readers announce it as just "section" with no context. | Add `aria-labelledby` pointing to the hero title element, or add `aria-label="SignalframeUX hero"`. | 5 |
| 7 | major | quick-fix | `components/blocks/hero.tsx:42-48` | Heading hierarchy: the hero title is a `<div>` styled as a massive heading but uses no heading element (`<h1>`). The first actual heading on the homepage may be an `<h2>` inside a later section, breaking the document outline. | Wrap the "SIGNAL//FRAME" title content in an `<h1>` element. Add `aria-label="SignalframeUX"` if the visual split across spans makes the text content unclear to screen readers. | 7 |
| 8 | major | moderate | `components/layout/global-effects.tsx:206-213` | The VHS badge is a fixed-position decorative element with text "SF//UX" that is not marked `aria-hidden="true"`. Screen readers will announce this on every page, adding noise. | Add `aria-hidden="true"` to the VHS badge container, or wrap it in a `role="presentation"` element. It serves no informational purpose. | 4 |
| 9 | major | moderate | `components/layout/global-effects.tsx:157-163` | The scroll progress bar has no screen reader announcement. While visually it shows scroll progress, it has no ARIA role. If it should be perceivable, it needs `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`. If purely decorative, it should get `aria-hidden="true"`. | Add `aria-hidden="true"` since it duplicates the browser's native scrollbar information and is decorative. | 3 |
| 10 | major | quick-fix | `components/layout/footer.tsx:53-60` | The "COPY" badge on the install code block looks like a button but is a static `<span>`. Users expect to click it to copy. If it is not functional, it misleads sighted users. If it is intended to be a button, it needs `<button>` semantics, a click handler, and an accessible name. | Either make it a functional `<button aria-label="Copy install command">` with a clipboard API handler, or remove the interactive appearance. | 5 |
| 11 | major | moderate | `components/blocks/stats-band.tsx:10-38` | Stat values (340, 48, 12, infinity) are animated via GSAP count-up. During animation, screen readers may read intermediate values. The infinity symbol has no text alternative -- screen readers may announce it as "infinity" or skip it. | Add `aria-label` to each stat container (e.g., `aria-label="340 components"`). Use `aria-live="off"` or ensure final values are set before screen reader traversal. For the infinity stat, add `aria-label="Infinite frame states"`. | 5 |
| 12 | major | quick-fix | `components/layout/nav.tsx:61-75` | NavLink scramble animation shows random characters during load. Screen readers will read the scrambled text (e.g., "X#$@!W" instead of "COMPONENTS"). The `text` state starts scrambled and settles after animation. | Add `aria-label={label}` to the `<Link>` element so the accessible name is always the final label regardless of visual scramble state. The visible scrambled text is decorative from an a11y perspective. | 7 |
| 13 | major | quick-fix | `components/layout/nav.tsx:384-487` | LogoMark scramble animation: same issue as NavLink. The logo shows ASCII garbage during mount animation. Screen readers will read the scrambled characters. | Add `aria-label="SignalframeUX home"` to the logo `<Link>` element. This also clarifies the link purpose better than "S F // U X". | 5 |
| 14 | minor | quick-fix | `components/layout/nav.tsx:263-265` | The "LIGHT" label next to the dark mode toggle uses `useScrambleText` and shows scrambled text during load. Screen readers will read scrambled characters. Same issue as NavLink. | Either add `aria-hidden="true"` to the LIGHT/DARK text spans (the button already has its own `aria-label`), or use a visually-hidden real label. | 3 |
| 15 | minor | moderate | `components/blocks/manifesto-band.tsx:149-199` | Words start at `opacity: 0.15` and reveal on scroll. For users who cannot scroll (switch devices, some assistive tech), the text remains nearly invisible at 15% opacity. This is a WCAG 1.4.3 contrast issue -- 15% opacity text on the yellow band likely fails 4.5:1. | Ensure all manifesto text has a minimum opacity of 1.0 in the initial DOM, and let the scroll-driven effect be a progressive enhancement. Or set `opacity: 1` as the no-JS / reduced-motion default. | 5 |
| 16 | minor | moderate | `app/globals.css:383-396` | `.sf-anim-hidden` uses `opacity: 0 !important` and `transform: translateY(24px) !important`. If GSAP fails to load or JS is disabled, these elements remain invisible. The `noscript` block in layout only addresses `.sf-hero-deferred`, not `.sf-anim-hidden`. | Add `.sf-anim-hidden` to the `<noscript>` style override in `app/layout.tsx`, or use a JS-added class pattern so elements are visible by default and hidden only after JS confirms. | 4 |
| 17 | minor | quick-fix | `components/layout/footer.tsx:6` | The `<footer>` element has no `aria-label`. While the semantic element is good, an `aria-label="Site footer"` helps users distinguish it from any other footer elements. | Add `aria-label="Site footer"` to the `<footer>` element. | 1 |
| 18 | minor | quick-fix | `components/blocks/stats-band.tsx:10` | The stats `<section>` has no `aria-label` or `aria-labelledby`. It is a landmark but screen readers cannot distinguish it from other sections. | Add `aria-label="Key statistics"` to the `<section>`. | 1 |
| 19 | minor | quick-fix | `components/blocks/manifesto-band.tsx:149-155` | The manifesto `<section>` has no `aria-label`. | Add `aria-label="Manifesto"` to the `<section>`. | 1 |
| 20 | minor | moderate | `components/blocks/token-tabs.tsx:198-214` | Color swatch cells are purely visual with step numbers. No accessible names describe the color values. Screen readers will just hear "50", "100", etc. with no color context. | Add `aria-label` to each swatch (e.g., `aria-label="Neutral 50, oklch(0.99, 0, 0)"`), or add a visually hidden description. Alternatively, mark the entire swatch grid as `role="img"` with an `aria-label` summarizing the scale. | 3 |
| 21 | minor | moderate | `components/blocks/token-tabs.tsx:339-363` | Motion token animation demos run continuously. Users with vestibular disorders who have `prefers-reduced-motion` set get the CSS-level blanket from globals.css (which sets `animation-duration: 0.01ms`), but these use inline `style={{ animation: ... }}` which may override the CSS blanket depending on specificity. | Verify that the CSS `@media (prefers-reduced-motion)` override with `!important` on `animation-duration` actually defeats the inline `style` attribute. If not, add a JS check or conditional rendering. | 3 |
| 22 | minor | quick-fix | `components/layout/global-effects.tsx:190` | `ScrollToTop` button uses `behavior: "smooth"` unconditionally. Users with `prefers-reduced-motion` should get instant scroll. | Check `prefers-reduced-motion` and use `behavior: "auto"` when reduced motion is preferred. | 2 |
| 23 | minor | quick-fix | `components/layout/nav.tsx:555` | The Cmd+K shortcut label reads "K" visually but there is no indication that Ctrl+K works on non-Mac platforms. The button shows the Mac-specific glyph. | Add a platform check and show "Ctrl" on non-Mac, or include both in the `aria-label`: "Open command palette (Cmd+K or Ctrl+K)". | 1 |
| 24 | nit | quick-fix | `app/layout.tsx:74` | `<body>` has no explicit `role` attribute. While `<body>` has an implicit `document` role, some older screen readers benefit from explicit landmarks. The content between skip link and `<main>` (nav, hero) could benefit from clearer landmark structure at the layout level. | No action required -- modern screen readers handle this. Noting for completeness. | 0 |
| 25 | nit | quick-fix | `components/layout/nav.tsx:268` | The dark mode toggle button uses `aria-pressed` which is good. However, the visual state (LIGHT text vs DARK text) is redundant with `aria-pressed`. Minor inconsistency: the button label says "Switch to light/dark mode" while `aria-pressed` suggests a binary toggle. Consider using only one pattern. | Pick either `aria-pressed` (toggle button pattern) with a static label like "Dark mode", or use a dynamic `aria-label` without `aria-pressed`. Both work; mixing can be slightly confusing. | 0 |
| 26 | nit | quick-fix | `components/layout/footer.tsx:44` | External GitHub link has `target="_blank"` and `rel="noopener noreferrer"` (good), but no visual or textual indicator that it opens in a new window. WCAG G200 suggests informing users. | Add `aria-label="GitHub (opens in new tab)"` or append a visually hidden "(opens in new tab)" span. | 1 |
| 27 | nit | quick-fix | `components/layout/nav.tsx:82` | The GitHub nav link points to an external URL but behaves identically to internal links with no external indicator. | Add an external link icon or visually hidden text "(external link)" for the GitHub entry. | 1 |

---

## Scoring Breakdown

| Category | Max | Score | Notes |
|----------|-----|-------|-------|
| Keyboard Navigation | 20 | 8 | API sidebar, component grid, and grid cells all keyboard-inaccessible |
| Screen Reader Support | 20 | 10 | Scrambled text exposed, missing labels, no live regions |
| ARIA & Semantics | 15 | 8 | Skip link present, landmarks partial, missing roles on widgets |
| Color Contrast | 10 | 7 | OKLCH palette appears high-contrast but manifesto opacity issue; needs tool verification |
| Reduced Motion | 15 | 12 | CSS blanket is comprehensive; JS checks present; inline animation specificity risk |
| Focus Management | 10 | 6 | Skip link works; focus-visible utility exists; custom cursor hides system cursor for mouse only (good); no focus trap verification on sheet/dialog |
| Touch Targets | 10 | 7 | Most buttons meet 44x44px; filter bar buttons are borderline at `py-3.5` + `px-5` (approx 40px tall) |
| **Total** | **100** | **58** | |

---

## Priority Remediation Order

1. **P0 (ship-blockers):** #1, #2, #3, #7, #12, #13 -- keyboard access and screen reader fundamentals
2. **P1 (next sprint):** #4, #5, #6, #8, #10, #11, #15 -- form labels, ARIA roles, decorative cleanup
3. **P2 (polish):** #9, #14, #16, #17-19, #20-23 -- progressively improve
4. **P3 (nits):** #24-27 -- nice-to-haves

---

## What Works Well

- `lang="en"` on `<html>` element
- Skip-to-content link with proper sr-only + focus-visible pattern
- `prefers-reduced-motion` CSS blanket that covers all animations and transitions
- `aria-hidden="true"` on VHS overlay, decorative halftone circle, accent lines
- Dark mode toggle has `aria-label` and `aria-pressed`
- Custom cursor respects `(pointer: coarse)` and `prefers-reduced-motion`, only hides system cursor after mouse detected
- VHS overlay hidden entirely for reduced-motion and touch devices
- Nav links use `aria-current="page"` for active state
- Mobile nav uses Sheet component with proper header/title
- `<noscript>` fallback for hero deferred elements
- `id="main-content"` present on all page `<main>` elements
- `<nav aria-label="Main navigation">` on the primary nav
