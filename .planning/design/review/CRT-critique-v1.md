---
Generated: "2026-03-31"
Skill: /pde:critique (CRT)
Version: v1
Status: draft
Group: design
Scope: "5 lofi wireframes"
Enhanced By: "none"
---

# Design Critique: SignalframeUX Lofi Wireframes

## 1. Executive Summary

**Overall Quality Score: B+**

These lofi wireframes demonstrate strong structural thinking and above-average accessibility awareness for this stage of design. The narrative arc strategy is well-translated into layout structure, and the token-driven CSS approach validates the design system's architecture. The wireframes are ready to advance to midfi with targeted corrections.

### Key Strengths

- **Accessibility foundation is excellent.** Skip links, `aria-labelledby`, `aria-label`, `role` attributes, `aria-current`, focus-visible styles, and semantic landmarks are present across all 5 screens. This is uncommon at lofi stage and sets a strong precedent.
- **Token usage is consistent and deep.** All screens reference design tokens for spacing, typography, color, border, and motion rather than raw values. This proves the token system has real coverage.
- **Narrative arc is structurally clear on the homepage.** The scroll sequence (Hero > Problem > Exploration > Evidence > Professional > CTA) maps directly to the brief's narrative strategy and Journey 1 flow.
- **Progressive enhancement is planned.** Case study includes `<noscript>` fallbacks for interactive demos, and the design system page uses `aria-hidden`/`aria-expanded` for code toggle disclosure patterns.
- **Responsive breakpoints are addressed.** All screens include mobile-first media queries with considered layout adjustments.

### Critical Issues

- **Navigation structure is inconsistent across screens** (different link labels, ordering, and elements per page). This will confuse users navigating between sections.
- **Header/footer component implementations diverge significantly** across wireframes, using different class names, structures, and styling approaches.
- **The About page has an incorrect tokens.css path** (`../../../assets/tokens.css` vs `../../assets/tokens.css` on other pages), indicating it may be in a different directory depth or has a path error.
- **Mobile navigation has no hamburger/menu toggle** on screens where the nav collapses. Homepage hides `.nav-list` at <640px with no alternative.

---

## 2. Per-Perspective Findings

### 2.1 Visual Hierarchy & Composition

#### Critical

**VH-01: Homepage hero section lacks a clear visual weight anchor**
- Severity: critical | Effort: low
- Screen(s): Homepage
- The hero section is 80vh of centered text with no visual element to anchor the eye. The brief emphasizes a "3-second hook" (Journey 1, step J1_3), but the wireframe provides only a title, subtitle, and two generic buttons. At midfi, this must include a distinguishing visual element (illustration, animated motif, or typographic treatment) to differentiate from template portfolios.
- **Recommendation:** Add a placeholder for a hero visual element -- a signature graphic, animated component demo, or typographic motif -- that signals "design engineer" identity within the first viewport.

#### Major

**VH-02: Case study page lacks clear visual progression between phases**
- Severity: major | Effort: medium
- Screen(s): Case Study
- The five case study sections (Prologue, Exploration, Demo, Engineering, Outcomes) use identical heading treatment (`section-label` + `section-heading` + `section-body`). There is no visual escalation or narrative rhythm. The "chapter" metaphor from the brief suggests progressive intensity.
- **Recommendation:** Introduce differentiated section treatments -- a progress indicator, varying placeholder sizes, or alternating layout patterns -- to create visual rhythm across the scroll.

**VH-03: About page identity section portrait is too small relative to content**
- Severity: major | Effort: low
- Screen(s): About
- The 200x200 portrait beside multi-element identity content creates an asymmetric grid where the left column is narrow and static while the right column expands. On mobile it stacks correctly, but on desktop the portrait feels undersized for a personal identity section.
- **Recommendation:** Increase portrait placeholder to at least 280x280, or consider a full-width identity banner layout at this level.

**VH-04: Design system page sidebar competes with main content at narrow desktop widths**
- Severity: major | Effort: medium
- Screen(s): Design System
- The fixed 240px sidebar leaves limited space for token grids and component cards at 768-1024px. The `max-width: 960px` on `.ds-main` further constrains the content area, leaving token cards cramped.
- **Recommendation:** Increase the sidebar breakpoint to 1024px (collapse to horizontal tabs at 768px), or make `.ds-main` max-width fluid.

#### Minor

**VH-05: Homepage professional grid lacks visual hierarchy between blocks**
- Severity: minor | Effort: low
- Screen(s): Homepage
- Skills, Tools, and Availability blocks are visually identical. The Availability block with its status indicator and resume placeholder is functionally different and deserves visual distinction.
- **Recommendation:** Give the Availability block an accent border or subtle background differentiation.

**VH-06: Contact page lacks visual rhythm between methods**
- Severity: minor | Effort: low
- Screen(s): Contact
- Four identical contact method cards create a monotonous list. The email (primary action per Journey 4) should be visually emphasized.
- **Recommendation:** Make the email contact method visually distinct -- larger, accent-bordered, or positioned as a hero element above the grid.

---

### 2.2 UX & Interaction

#### Critical

**UX-01: Mobile navigation has no accessible menu toggle**
- Severity: critical | Effort: medium
- Screen(s): Homepage, About (others may be affected)
- Homepage hides `.nav-list` at <640px with `display: none` and provides no hamburger button or alternative navigation mechanism. Users on mobile have zero navigation on the homepage. Other screens (Case Study, Design System, Contact) show nav links wrapping, but the homepage completely removes them.
- **Recommendation:** Add a mobile menu toggle button (hamburger) that reveals the navigation in a drawer, dropdown, or sheet pattern. This is a blocking issue for all user journeys.

#### Major

**UX-02: Case study chapter navigation links point to `#` placeholder**
- Severity: major | Effort: low
- Screen(s): Case Study
- The "Previous Chapter" and "Next Chapter" navigation links both use `href="#"`. While this is understandable at lofi, the pattern should link to other case study instances to validate Journey 2's "Continue to next chapter?" flow (J2_9 > J2_10).
- **Recommendation:** Link to `case-study.html?chapter=prev` and `case-study.html?chapter=next` (or equivalent) to indicate the multi-chapter pattern.

**UX-03: Command palette trigger is not discoverable**
- Severity: major | Effort: medium
- Screen(s): Homepage (only screen with it)
- The command palette button appears only on the homepage header. Journey 5 describes Cmd+K as a global navigation enhancement available on all pages. The trigger button must be present on every screen for consistency.
- **Recommendation:** Add the command palette trigger button to all screen headers. It should be a shared header component element.

**UX-04: No scroll-to-top or back-to-nav mechanism on long pages**
- Severity: major | Effort: low
- Screen(s): Homepage, Case Study, Design System, About
- The homepage, case study, and about pages are long-scroll layouts. There is no sticky navigation indicator, scroll progress bar, or back-to-top affordance. The brief specifically emphasizes scroll-driven storytelling, but there is no mechanism to recover from deep scroll positions.
- **Recommendation:** Add a scroll-to-top button or a mini scroll progress indicator in the sticky header to support long-scroll navigation.

#### Minor

**UX-05: Design system sidebar does not indicate scroll position**
- Severity: minor | Effort: medium
- Screen(s): Design System
- The sidebar links use `aria-current="true"` on "Overview" statically. In implementation, this should update as the user scrolls through sections (scrollspy). The wireframe should annotate this behavior.
- **Recommendation:** Add a wireframe annotation noting that sidebar active state tracks scroll position via IntersectionObserver.

**UX-06: Homepage "All Screens" nav link is wireframe scaffolding, not a real destination**
- Severity: minor | Effort: low
- Screen(s): Homepage
- The nav and footer include "All Screens" linking to `index.html`. This is wireframe infrastructure and should be excluded from the final site navigation.
- **Recommendation:** Remove or annotate "All Screens" as wireframe-only. Final nav should match the brief scope: Home, Case Studies, Design System, About, Contact.

#### Suggestion

**UX-07: Contact page could benefit from a response-time expectation**
- Severity: suggestion | Effort: low
- Screen(s): Contact
- The CTA section already states "I respond within 24 hours" -- this is good. Consider also surfacing timezone or preferred hours for collaborators in different regions.

---

### 2.3 Accessibility

#### Critical

**A11Y-01: Homepage hero `<section>` contains a decorative `.label` span visible to screen readers**
- Severity: critical | Effort: low
- Screen(s): Homepage
- All homepage sections include `<span class="label">Hero Section</span>`, `<span class="label">Narrative Arc -- Problem</span>`, etc. These are wireframe annotations but are not hidden from assistive technology. Screen reader users will hear "Hero Section" announced before every section heading, creating confusing redundancy with the `aria-labelledby` already present.
- **Recommendation:** Add `aria-hidden="true"` to all `.label` annotation spans, or remove them from the DOM and use CSS `::before` pseudo-elements for wireframe annotations.

#### Major

**A11Y-02: Deprecated `role="main"` used alongside semantic `<main>` element**
- Severity: major | Effort: low
- Screen(s): All 5 screens
- All screens use `<main id="..." role="main">`. The `role="main"` attribute is redundant on a `<main>` element and is technically a WCAG best practice violation when doubled. Similarly, `role="banner"` on `<header>` and `role="contentinfo"` on `<footer>` are redundant for direct children of `<body>`.
- **Recommendation:** Remove redundant role attributes from semantic elements: `<main>`, `<header>` (direct child of body), and `<footer>` (direct child of body). These are implicit.

**A11Y-03: Design system sidebar has `<div>` dividers inside `<ul>` list**
- Severity: major | Effort: low
- Screen(s): Design System
- The sidebar navigation list contains `<div class="ds-sidebar__divider" role="separator">` as direct children of `<ul>`. This is invalid HTML -- only `<li>` elements are permitted as direct children of `<ul>`. Screen readers may skip or miscount list items.
- **Recommendation:** Move dividers outside the `<ul>`, or wrap them in `<li role="separator">` elements with `aria-hidden="true"`.

**A11Y-04: About page skills matrix uses CSS grid with `role="table"` but lacks `role="row"`**
- Severity: major | Effort: medium
- Screen(s): About
- The skills matrix uses `role="table"` on the container and `role="columnheader"`, `role="rowheader"`, `role="cell"` on individual divs, but there are no `role="row"` wrapper elements. ARIA table semantics require explicit row grouping for screen readers to announce row/column position correctly.
- **Recommendation:** Wrap each row of cells in a `<div role="row">` element, or refactor to use a native `<table>` element.

**A11Y-05: Design system skip link does not have focus-visible outline**
- Severity: major | Effort: low
- Screen(s): Design System
- The design system skip link `.skip-link:focus` only sets `top: var(--spacing-2)` but does not include a focus outline, unlike the other 4 screens which include `outline: 2px solid var(--color-focus-ring)`.
- **Recommendation:** Add `outline: 2px solid var(--color-focus-ring); outline-offset: 2px;` to `.skip-link:focus` on the design system page.

#### Minor

**A11Y-06: Theme toggle `aria-pressed` state is inconsistent**
- Severity: minor | Effort: low
- Screen(s): Homepage, Design System
- Homepage theme toggle uses `aria-pressed="true"` (initial state). Design system uses `aria-pressed="true"` with a data attribute toggle. Case study and contact use no `aria-pressed`. The toggle semantics should be identical across all screens.
- **Recommendation:** Standardize theme toggle to use `aria-pressed` with dynamic state management on all screens.

**A11Y-07: Case study code block placeholders use `role="img"` without descriptive alt**
- Severity: minor | Effort: low
- Screen(s): Case Study
- Two code block placeholders use `role="img" aria-label="Code block placeholder"`. A code block is not an image -- it should use `role="region"` or be a `<pre><code>` element in implementation.
- **Recommendation:** Change `role="img"` to `role="region"` on code block placeholders, or use `<figure>` with `<figcaption>`.

**A11Y-08: Contact page `.sr-only` class is referenced but not defined**
- Severity: minor | Effort: low
- Screen(s): Contact
- The heading `<h2 id="contact-methods-heading" class="sr-only">Contact Methods</h2>` uses a `.sr-only` class that is not defined in the page's `<style>` block. The heading will be visually visible rather than screen-reader-only.
- **Recommendation:** Add the standard `.sr-only` visually-hidden CSS class to the contact page stylesheet.

#### Suggestion

**A11Y-09: Consider adding `aria-label` to the theme toggle button with current state**
- Severity: suggestion | Effort: low
- Screen(s): All
- Theme toggle buttons use static labels ("Toggle theme", "Toggle color theme"). A dynamic label like "Switch to light theme" / "Switch to dark theme" would better communicate the expected action.

---

### 2.4 Consistency

#### Critical

**CON-01: Navigation link labels differ across screens**
- Severity: critical | Effort: low
- Screen(s): All 5 screens
- Navigation links use different labels for the same destinations:
  - Homepage: "Home", "Case Studies", "Design System", "About", "Contact", "All Screens"
  - Case Study: "Work", "System", "About", "Contact"
  - Design System: "Home", "Case Studies", "Design System", "About", "Contact"
  - About: "Work", "About", "Case Studies", "System", "Contact"
  - Contact: "Work", "Case Studies", "System", "About", "Contact"

  The inconsistencies: "Home" vs "Work", "Design System" vs "System", "Case Studies" present on some but not others, link order varies.
- **Recommendation:** Establish a canonical navigation set and order. Suggested: Work | System | About | Contact (4 items, matching the brief's information architecture). Apply identically to all screens.

#### Major

**CON-02: Header component structure varies across all 5 screens**
- Severity: major | Effort: medium
- Screen(s): All 5 screens
- Each screen implements the header differently:
  - Homepage: `.site-header > .page-container.header-inner` with `<nav>` containing `<ul class="nav-list">`
  - Case Study: `.page-header` (flat flex) with `<ul class="primary-nav">` (no wrapper nav? Actually has `<nav>`)
  - Design System: `.site-header` with `.site-nav` containing flat `<a>` links (no `<ul>`)
  - About: `.wf-header` with `.wf-nav` containing flat `<a>` links (no `<ul>`)
  - Contact: `.site-header` with `.site-nav` containing flat `<a>` links and inline `<button>` (no `<ul>`)
- **Recommendation:** Define a single header component specification with one class naming convention, one HTML structure, and one navigation pattern. Reuse it verbatim across all screens.

**CON-03: Footer component structure varies across all 5 screens**
- Severity: major | Effort: medium
- Screen(s): All 5 screens
- Similar to the header, footer implementations differ in class names (`.site-footer`, `.page-footer`, `.wf-footer`), structure (with/without `<nav>`, `<ul>` vs inline links), and content (some have footer links, some have copyright, some have both).
- **Recommendation:** Define a single footer component specification and replicate across all screens.

**CON-04: Logo text and class names vary across screens**
- Severity: major | Effort: low
- Screen(s): All 5 screens
- The logo uses different text and classes:
  - Homepage: `class="site-logo"`, text: "SignalframeUX"
  - Case Study: `class="logo"`, text: "SignalframeUX"
  - Design System: `class="site-logo"`, text: "SignalframeUX"
  - About: `class="wf-logo"`, text: "SfUX"
  - Contact: `class="site-logo"`, text: "SfUX"
- **Recommendation:** Use a single class name (`.site-logo`) and single text ("SignalframeUX") across all screens. Abbreviation "SfUX" can be a mobile-only treatment if needed.

**CON-05: CSS class naming conventions are inconsistent across screens**
- Severity: major | Effort: high
- Screen(s): All 5 screens
- Four different naming conventions are in use:
  - Homepage: flat class names (`.site-header`, `.hero-title`, `.case-card`)
  - Case Study: BEM-like (`.chapter-nav__link`, `.metric-card__value`, `.before-after__label`)
  - Design System: BEM-like with `ds-` prefix (`.ds-section__heading`, `.ds-token-card__meta`)
  - About: BEM-like with `wf-` prefix (`.wf-timeline-item`, `.wf-skills-matrix`)
  - Contact: mixed (`.contact-method-info`, `.cta-button`)
- **Recommendation:** Establish a single naming convention. Suggested: BEM with a consistent prefix or no prefix, applied uniformly. The `ds-` prefix makes sense for design system page-specific components, but shared components (header, footer, buttons) should use the same class names everywhere.

#### Minor

**CON-06: Theme toggle implementation differs across screens**
- Severity: minor | Effort: low
- Screen(s): All 5 screens
- Theme toggle uses different approaches:
  - Homepage: inline `onclick` handler
  - Case Study: inline `onclick` handler
  - Design System: `data-theme-toggle` attribute with external script
  - About: inline `onclick` handler
  - Contact: external script with querySelector
- **Recommendation:** Use a single theme toggle implementation (the external script with `data-theme-toggle` attribute is cleanest).

**CON-07: About page tokens.css path suggests incorrect directory depth**
- Severity: minor | Effort: low
- Screen(s): About
- The About page links to `../../../assets/tokens.css` (3 levels up) while all other pages link to `../../assets/tokens.css` (2 levels up). Either the About page is nested one directory deeper than siblings, or the path is wrong.
- **Recommendation:** Verify directory structure. If all wireframes are siblings in `lofi/`, the About page path should be `../../assets/tokens.css`.

---

## 3. Cross-Screen Consistency Audit

| Element | Homepage | Case Study | Design System | About | Contact | Consistent? |
|---------|----------|------------|---------------|-------|---------|-------------|
| Skip link | Yes | Yes | Yes (no outline) | Yes | Yes | Partial |
| `lang="en"` | Yes | Yes | Yes | Yes | Yes | Yes |
| `data-theme="dark"` | Yes | Yes | Yes | Yes | Yes | Yes |
| Body class `.pde-layout--lofi` | Yes | Yes | Yes | Yes | Yes | Yes |
| tokens.css linked | Yes | Yes | Yes | Yes (wrong path) | Yes | Partial |
| Header landmark | `<header role="banner">` | `<header role="banner">` | `<header role="banner">` | `<header role="banner">` | `<header role="banner">` | Yes |
| Header class | `.site-header` | `.page-header` | `.site-header` | `.wf-header` | `.site-header` | No |
| Logo text | SignalframeUX | SignalframeUX | SignalframeUX | SfUX | SfUX | No |
| Nav label | "Main navigation" | "Primary navigation" | "Primary navigation" | "Primary navigation" | "Primary navigation" | Partial |
| Nav link count | 6 | 4 | 5 | 5 | 5 | No |
| Nav link order | Home, CS, DS, About, Contact, All | Work, System, About, Contact | Home, CS, DS, About, Contact | Work, About, CS, System, Contact | Work, CS, System, About, Contact | No |
| Theme toggle | Button with K + T | Button "Theme" | Button with data attr | Inline onclick | External script | No |
| Command palette | Yes | No | No | No | No | No |
| Footer class | `.site-footer` | `.page-footer` | `.site-footer` | `.wf-footer` | `.site-footer` | No |
| Footer links | 6 links (ul) | 4 links (ul) | 5 inline links | 4 inline links | None (text only) | No |
| `@layer wireframe` | Yes | Yes | Yes | Yes | Yes | Yes |
| CSS reset included | Yes | Yes | Yes | Yes | Yes | Yes |
| Focus ring style | 2px solid focus-ring | 2px solid focus-ring | varies (border-width-medium) | 2px solid focus-ring | 2px solid focus-ring | Partial |

**Summary:** While foundational attributes (lang, theme, tokens, layer, body class) are consistent, all user-facing shared components (header, nav, footer, theme toggle) diverge in implementation. This is the highest-priority consistency issue.

---

## 4. Prioritized Action Items

### Critical (Fix before midfi)

| # | Finding | Effort | Action |
|---|---------|--------|--------|
| 1 | CON-01 | low | Standardize navigation labels and order across all 5 screens |
| 2 | UX-01 | medium | Add mobile navigation toggle/hamburger pattern to all screens |
| 3 | A11Y-01 | low | Add `aria-hidden="true"` to all wireframe annotation `.label` spans on homepage |
| 4 | VH-01 | low | Add hero visual element placeholder to homepage |

### Major (Fix during midfi transition)

| # | Finding | Effort | Action |
|---|---------|--------|--------|
| 5 | CON-02 | medium | Create shared header component spec; apply to all screens |
| 6 | CON-03 | medium | Create shared footer component spec; apply to all screens |
| 7 | CON-04 | low | Standardize logo class and text across all screens |
| 8 | CON-05 | high | Establish single CSS naming convention; refactor all screens |
| 9 | A11Y-02 | low | Remove redundant ARIA roles from semantic elements |
| 10 | A11Y-03 | low | Fix `<div>` dividers inside `<ul>` on design system sidebar |
| 11 | A11Y-04 | medium | Add `role="row"` wrappers to About page skills matrix |
| 12 | A11Y-05 | low | Add focus outline to design system skip link |
| 13 | UX-02 | low | Update chapter nav links to indicate multi-chapter pattern |
| 14 | UX-03 | medium | Add command palette trigger to all screen headers |
| 15 | UX-04 | low | Add scroll-to-top or progress indicator for long pages |
| 16 | VH-02 | medium | Differentiate case study section visual treatments |
| 17 | VH-03 | low | Increase About page portrait size |
| 18 | VH-04 | medium | Adjust design system sidebar breakpoint |

### Minor (Address at midfi or hifi)

| # | Finding | Effort | Action |
|---|---------|--------|--------|
| 19 | A11Y-06 | low | Standardize theme toggle `aria-pressed` across screens |
| 20 | A11Y-07 | low | Fix code block `role="img"` to `role="region"` |
| 21 | A11Y-08 | low | Add `.sr-only` class definition to contact page |
| 22 | CON-06 | low | Standardize theme toggle script across screens |
| 23 | CON-07 | low | Fix About page tokens.css path |
| 24 | VH-05 | low | Visually differentiate homepage Availability block |
| 25 | VH-06 | low | Emphasize primary contact method (email) on contact page |
| 26 | UX-05 | medium | Annotate scrollspy behavior for design system sidebar |
| 27 | UX-06 | low | Remove "All Screens" from final navigation |

### Suggestions (Consider for polish)

| # | Finding | Effort | Action |
|---|---------|--------|--------|
| 28 | A11Y-09 | low | Use dynamic `aria-label` on theme toggle buttons |
| 29 | UX-07 | low | Add timezone/hours to contact page |

---

## 5. Score Summary Table

| Perspective | Score (A-F) | Strengths | Weaknesses |
|-------------|-------------|-----------|------------|
| Visual Hierarchy & Composition | B | Clear section structure, good use of typographic scale, narrative arc well-mapped | Hero needs visual anchor, case study lacks section rhythm, some size/proportion issues |
| UX & Interaction | B- | Strong flow support, progressive enhancement planned, responsive considered | Missing mobile nav toggle, no scroll recovery, command palette only on 1 screen |
| Accessibility | B+ | Skip links everywhere, ARIA labels thorough, focus styles present, semantic HTML strong | Redundant roles, invalid list children, missing sr-only class, annotation spans exposed |
| Consistency | C | Tokens used consistently, base attributes match, responsive approach similar | Headers, footers, nav, logos, class names, and scripts all diverge between screens |
| **Overall** | **B+** | **Accessibility-first approach is a genuine differentiator at lofi stage** | **Component consistency is the primary gap; must be resolved before midfi** |

---

*Generated by PDE-OS /pde:critique (CRT) | 2026-03-31*
*Scope: 5 lofi wireframes (homepage, case-study, design-system, about, contact)*
*Source brief: .planning/design/strategy/BRF-brief-v1.md*
*Source flows: .planning/design/ux/FLW-user-flows-v1.md*
