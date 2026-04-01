---
Generated: "2026-03-31"
Skill: /pde:iterate (ITR)
Version: v1
Critique Source: CRT-critique-v1.md
Status: complete
Screens Modified: 5
Findings Applied: 21
Findings Deferred: 5
---

# Iteration Changelog v1

## Applied Changes

| Finding ID | Severity | Screen | Change Made | Effort | Source Finding |
|------------|----------|--------|-------------|--------|----------------|
| F01 | critical | all 5 screens | CON-01: Standardized nav to 4 canonical items (Work, System, About, Contact) with consistent order; removed "All Screens" link | low | CRT-critique-v1.md |
| F02 | critical | all 5 screens | UX-01: Added mobile hamburger toggle button (.mobile-menu-toggle) to all headers with CSS for <640px visibility | medium | CRT-critique-v1.md |
| F03 | critical | homepage.html | A11Y-01: Added aria-hidden="true" to all 6 .label annotation spans (Hero, Problem, Exploration, Evidence, Professional, CTA) | low | CRT-critique-v1.md |
| F04 | critical | homepage.html | VH-01: Added hero visual placeholder (480x120px) between subtitle and CTA row for "3-second hook" visual anchor | low | CRT-critique-v1.md |
| F05 | major | all 5 screens | CON-02: Standardized header to canonical .site-header > .page-container.header-inner structure with <ul class="nav-list"> | medium | CRT-critique-v1.md |
| F06 | major | all 5 screens | CON-03: Standardized footer to canonical .site-footer > .page-container.footer-inner structure with <ul class="footer-links"> | medium | CRT-critique-v1.md |
| F07 | major | all 5 screens | CON-04: Standardized logo to .site-logo class with "SignalframeUX" text across all screens | low | CRT-critique-v1.md |
| F08 | major | all 5 screens | A11Y-02: Removed redundant role="main" from <main> elements across all screens | low | CRT-critique-v1.md |
| F09 | major | design-system.html | A11Y-03: Changed sidebar <div> dividers inside <ul> to <li role="separator" aria-hidden="true"> | low | CRT-critique-v1.md |
| F10 | major | design-system.html | A11Y-05: Added outline: 2px solid var(--color-focus-ring) and outline-offset: 2px to .skip-link:focus | low | CRT-critique-v1.md |
| F11 | major | case-study.html | UX-02: Updated chapter nav links from href="#" to href="case-study.html?chapter=prev/next" | low | CRT-critique-v1.md |
| F12 | major | all 5 screens | UX-03: Added command palette trigger button (Cmd+K) to all screen headers via canonical header structure | medium | CRT-critique-v1.md |
| F13 | major | homepage, case-study, design-system, about | UX-04: Added scroll-to-top button (fixed position, bottom-right) with focus-visible styles | low | CRT-critique-v1.md |
| F14 | major | about.html | VH-03: Increased portrait placeholder from 200x200 to 280x280 (responsive: 200x200 at <640px) | low | CRT-critique-v1.md |
| F15 | minor | case-study.html | A11Y-07: Changed role="img" to role="region" on both code block placeholders | low | CRT-critique-v1.md |
| F16 | minor | contact.html | A11Y-08: Added .sr-only visually-hidden CSS class definition for screen-reader-only headings | low | CRT-critique-v1.md |
| F17 | minor | about.html | CON-07: Fixed tokens.css path from ../../../assets/tokens.css to ../../assets/tokens.css | low | CRT-critique-v1.md |
| F18 | minor | homepage.html | VH-05: Added .pro-block--availability class with accent border to differentiate Availability block | low | CRT-critique-v1.md |
| F19 | minor | contact.html | VH-06: Added .contact-method--primary class with accent border to emphasize email contact method | low | CRT-critique-v1.md |
| F20 | minor | all 5 screens | UX-06: Removed "All Screens" wireframe scaffolding link from navigation (handled by CON-01 canonical nav) | low | CRT-critique-v1.md |
| F21 | minor | all 5 screens | CON-06: Standardized theme toggle to data-theme-toggle attribute with unified script pattern | low | CRT-critique-v1.md |

## Deferred Findings

| Finding ID | Severity | Screen | Reason Deferred | Source Finding |
|------------|----------|--------|-----------------|----------------|
| F22 | major | all 5 screens | CON-05: requires structural redesign beyond iteration scope (full CSS naming convention refactor across all screens) | CRT-critique-v1.md |
| F23 | major | about.html | A11Y-04: requires structural redesign beyond iteration scope (add role="row" wrappers to skills matrix grid requires restructuring all matrix rows) | CRT-critique-v1.md |
| F24 | major | case-study.html | VH-02: requires structural redesign beyond iteration scope (differentiate case study section visual treatments requires layout pattern redesign) | CRT-critique-v1.md |
| F25 | major | design-system.html | VH-04: requires structural redesign beyond iteration scope (adjust sidebar breakpoint to 1024px requires layout restructure) | CRT-critique-v1.md |
| F26 | minor | design-system.html | UX-05: requires structural redesign beyond iteration scope (scrollspy behavior annotation requires IntersectionObserver implementation) | CRT-critique-v1.md |

## What Works (Preserved)

Items from the critique's "What Works" table that were intentionally NOT changed:

| Element | Preserved | Note |
|---------|-----------|------|
| (none) | N/A | No What Works constraints applied — critique report did not include a What Works section |
