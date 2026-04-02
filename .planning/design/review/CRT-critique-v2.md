---
Generated: "2026-04-01"
Skill: /pde:critique (CRT)
Version: v2
Status: draft
Mode: "full"
Groups Evaluated: "Visual Hierarchy, UX & Interaction, Accessibility, Consistency, Engineering, Performance"
Enhanced By: "none"
---

# Critique Report: SignalframeUX Implementation v2

---

## Summary Scorecard

| Group | Score | Weight | Weighted |
|-------|-------|--------|----------|
| Visual Hierarchy & Composition | 88/100 | 1.5x | 132 |
| UX & Interaction | 72/100 | 1.5x | 108 |
| Accessibility | 65/100 | 2.0x | 130 |
| Consistency | 82/100 | 1.0x | 82 |
| Engineering Quality | 78/100 | 1.0x | 78 |
| Performance | 70/100 | 1.0x | 70 |
| **Composite** | | | **75/100** |

**Overall:** B | 75/100 | Implementation-ready with critical a11y gaps

---

## Findings by Priority

| # | Severity | Effort | Location | Issue | Suggestion | Perspective | Weight |
|---|----------|--------|----------|-------|------------|-------------|--------|
| 1 | critical | quick-fix | global-effects.tsx:67 | cursor: none !important hides system cursor globally, breaks keyboard-only users' orientation, violates WCAG 2.1.1 | Only hide on body:hover so keyboard users retain default cursor; add escape hatch class | Accessibility | 2.0x |
| 2 | critical | moderate | nav.tsx:482-558 | Nav has no aria-label; mobile sheet opens nested nav inside nav creating ambiguous landmark structure | Add aria-label="Main navigation" to outer nav; remove nested nav inside sheet | Accessibility | 2.0x |
| 3 | critical | quick-fix | hero.tsx:8, layout.tsx:22 | Hero uses mt-[60px] but subpages use mt-[83px]; nav height is dynamic with clamp() so neither magic number is reliable | Create --nav-height CSS variable; use mt-[var(--nav-height)] consistently | Consistency | 1.0x |
| 4 | critical | moderate | components/page.tsx, tokens/page.tsx, reference/page.tsx | Three pages are "use client" at top level but contain large static data arrays; entire page trees are client-rendered | Extract static data/layout to Server Components; push "use client" to interactive islands only | Performance | 1.0x |
| 5 | major | moderate | layout.tsx:54-58 | Inline script in head for dark mode with no CSP nonce, blocks FCP | Use Next.js beforeInteractive script strategy or move to separate script file with nonce support | Engineering | 1.0x |
| 6 | major | quick-fix | manifesto-band.tsx:9 | Hardcoded hex colors (#E91E63, #333) instead of design tokens; entire site uses OKLCH tokens everywhere else | Replace with var(--color-primary) and var(--color-foreground) | Consistency | 1.0x |
| 7 | major | quick-fix | code-section.tsx:21 | Hardcoded #111 and inline rgba() shadows instead of design tokens | Replace with var(--sf-code-bg) and var(--sf-inset-shadow) | Consistency | 1.0x |
| 8 | major | quick-fix | code-section.tsx:112 | Const component uses hardcoded #FF6B6B, the only raw hex in syntax highlighting | Create --sf-code-const token or use existing warm tone token | Consistency | 1.0x |
| 9 | major | moderate | hero.tsx:92-102 | CTA buttons use Link wrapping a span styled as button; complex nested DOM for simple navigation | Use Link directly with button styling, or use SFButton asChild pattern | UX | 1.5x |
| 10 | major | moderate | global-effects.tsx:66-131 | Custom cursor CSS uses 130+ lines; mix-blend-mode exclusion makes it invisible on mid-gray surfaces | Reduce cursor complexity; add solid outline fallback; test on varied backgrounds | UX | 1.5x |
| 11 | major | quick-fix | hero.tsx:53-67 | Multilingual text starts at opacity: 0 relying on GSAP to reveal; if JS fails users see blank space | Default to opacity: 1 in CSS, set opacity: 0 via GSAP .set() before animating (progressive enhancement) | Accessibility | 2.0x |
| 12 | major | moderate | tokens/page.tsx:402-407 | Global style jsx keyframe sf-motion-slide defined inside component; every other sf- keyframe lives in globals.css | Move keyframe to globals.css for consistency | Engineering | 1.0x |
| 13 | major | quick-fix | hero.tsx:61 | Farsi text has dir="rtl" but style textAlign: "left" contradicts the RTL direction attribute | Remove textAlign: "left" override, or use textAlign: "start" which respects directionality | Accessibility | 2.0x |
| 14 | major | moderate | components/page.tsx:431-461 | useLayoutEffect with GSAP Flip.from runs synchronously before paint on every filter/search change | Debounce search input by 150-200ms, or use useEffect instead | Performance | 1.0x |
| 15 | major | quick-fix | footer.tsx:22 | "By Grey Alt+R" appears to be a rendering artifact of the author name | Verify intended display name and correct | Consistency | 1.0x |
| 16 | major | moderate | reference/page.tsx:136-446 | API Reference sidebar is static; clicking items only updates local state, doesn't navigate | Implement hash-based routing or dynamic segments for deep-linkable API docs | UX | 1.5x |
| 17 | minor | quick-fix | nav.tsx:82 | GitHub link points to https://github.com, a placeholder URL | Update to actual repo URL or add TODO comment | UX | 1.5x |
| 18 | minor | quick-fix | start/page.tsx:248-249 | Conditional class with identical branches: step.highlight ? "text-foreground" : "text-foreground" | Remove the ternary; use "text-foreground" directly | Engineering | 1.0x |
| 19 | minor | quick-fix | stats-band.tsx:14 | border-b-[4px] on each stat cell AND border-b-4 on section creates double bottom borders | Remove inner border-b-[4px] from stat cells | Visual | 1.5x |
| 20 | minor | moderate | global-effects.tsx:180-206 | VHS badge and ScrollToTop button at same right edge with only 56px gap; can overlap on small viewports | Increase vertical separation or stack with flex column | UX | 1.5x |
| 21 | minor | quick-fix | component-grid.tsx:293 | Dead ternary: isBlack ? "var(--color-foreground)" : "var(--color-foreground)" | Remove the ternary | Engineering | 1.0x |
| 22 | minor | quick-fix | nav.tsx:215-283 | DarkModeToggle reads document in useState initializer; SSR mismatch risk | Consider null initial state with hydration guard | Engineering | 1.0x |
| 23 | minor | moderate | tokens/page.tsx:382-390 | 3 token tabs show "COMING SOON" with no visual differentiation from empty state | Disable tabs or add distinct empty-state treatment (dimmed trigger, lock icon) | UX | 1.5x |
| 24 | minor | quick-fix | footer.tsx:57 | Install command references signalframeux.com/r/base.json; domain likely doesn't exist yet | Add comment noting future URL, or point to local /r/base.json | UX | 1.5x |
| 25 | minor | moderate | All pages | No Open Graph image or social meta beyond basic title/description | Add OG image, Twitter card meta, and structured data | Engineering | 1.0x |
| 26 | nit | quick-fix | hero.tsx:43-46 | 11 separate spans for hero char animation; excessive DOM nodes | Consider GSAP SplitText or CSS letter-spacing animation | Performance | 1.0x |
| 27 | nit | quick-fix | nav.tsx:285-290 | Multiple magic numbers for scramble timings scattered across file | Group into single LOGO_ANIMATION_CONFIG object | Engineering | 1.0x |

---

## Detailed Findings by Perspective Group

### Visual Hierarchy & Composition

**Score:** 88/100
**Rationale:** The DU/TDR brutalist-flat aesthetic is executed with conviction. The dual-panel hero, circuit dividers, yellow manifesto band, and component grid create a distinctive scroll rhythm. Typography hierarchy using Anton (display) + Electrolize (body) + JetBrains Mono (code) is well-stratified. The homepage tells a clear story: identity > manifesto > concept > evidence > code > components.

**Finding VH-01: Stats band double-borders**
- **Location:** stats-band.tsx:14
- **Severity:** minor | **Effort:** quick-fix
- **Issue:** Each stat cell has border-b-[4px] AND the wrapping section has border-b-4 border-foreground, creating a double-thick bottom border.
- **Suggestion:** Remove border-b-[4px] from individual cells; the section border handles the bottom edge.

**Finding VH-02: Component grid hover lacks visual weight on dark cells**
- **Location:** component-grid.tsx:284-317
- **Severity:** minor | **Effort:** moderate
- **Issue:** Black-background cells (SIGNAL layer) show borderColor primary on hover, but the visual change is subtle since the cell background is already near-black. White cells have a more dramatic invert.
- **Suggestion:** Add a subtle box-shadow or background lighten on SIGNAL cells to increase hover contrast.

---

### UX & Interaction

**Score:** 72/100
**Rationale:** Scroll interactions (manifesto word reveal, circuit dividers, stat counters) are well-crafted. Command palette (Cmd+K) is globally available. Mobile nav uses Sheet pattern. However, several placeholder links, non-functional navigation on the API page, and overlapping fixed elements reduce usability.

**Finding UX-01: Hero CTAs use semantic links wrapped in spans**
- **Location:** hero.tsx:91-102
- **Severity:** major | **Effort:** moderate
- **Issue:** Link wraps a span styled as button. The DOM becomes a > span.hero-cta-btn > span.bd-span > 4 border spans. This creates 6 nested spans for border-draw animation inside a link.
- **Suggestion:** Apply border-draw CSS directly to the Link element, or use SFButton asChild Link pattern.

**Finding UX-02: API Reference sidebar is static**
- **Location:** reference/page.tsx:148-188
- **Severity:** major | **Effort:** moderate
- **Issue:** Sidebar items update activeNav state but don't scroll to sections or navigate; the page always shows "BUTTON" documentation regardless of which item is clicked.
- **Suggestion:** Implement anchor scroll with scrollIntoView, or route to /reference/[component] for deep-linkable docs.

**Finding UX-03: Placeholder links throughout**
- **Location:** nav.tsx:82 (GitHub), footer.tsx:44 (GitHub), footer.tsx:57 (signalframeux.com)
- **Severity:** minor | **Effort:** quick-fix
- **Issue:** Multiple links point to placeholder URLs rather than real destinations.
- **Suggestion:** Replace with actual URLs or clearly mark with a tooltip "Coming soon".

**Finding UX-04: VHS badge overlaps scroll-to-top button**
- **Location:** global-effects.tsx:180-206
- **Severity:** minor | **Effort:** moderate
- **Issue:** VHSBadge fixed at bottom-6 right-6, ScrollToTop at bottom-20 right-6. Only 56px gap, which can overlap on smaller viewports.
- **Suggestion:** Stack them vertically or offset VHS badge to the left.

---

### Accessibility

**Score:** 65/100
**Rationale:** Good foundations: skip link present, lang="en" set, dark mode toggle has aria-label and aria-pressed, reduced-motion media query covers CSS animations. However, several critical gaps: cursor override breaks keyboard users, nav landmark structure is invalid, multilingual content invisible without JS.

**Finding A11Y-01: Global cursor override breaks accessibility**
- **Location:** global-effects.tsx:67-68
- **Severity:** critical | **Effort:** quick-fix
- **Issue:** body, body * cursor: none !important removes the system cursor everywhere. Keyboard-only users lose visual feedback. Screen magnifier users lose the cursor. Violates WCAG 2.1.1 and 2.4.7.
- **Suggestion:** Only apply cursor: none on body:hover to preserve cursor for keyboard navigation. Add .sf-cursor-active body { cursor: none; } toggled by JS mousemove detection.
- **Reference:** WCAG 2.1 SC 2.1.1, SC 2.4.7

**Finding A11Y-02: Nested nav landmarks**
- **Location:** nav.tsx:487, 520
- **Severity:** critical | **Effort:** moderate
- **Issue:** The outer nav contains the mobile sheet which has its own nav. Two nested nav elements without distinguishing aria-label create ambiguous landmark structure for screen readers.
- **Suggestion:** Add aria-label="Main" to outer nav. Replace inner nav with div since it's inside a sheet dialog.

**Finding A11Y-03: Multilingual hero text invisible without JS**
- **Location:** hero.tsx:53-67
- **Severity:** major | **Effort:** quick-fix
- **Issue:** Katakana, Farsi, and Mandarin text elements have opacity-0 class with reveal depending on GSAP. If animations fail or JS is blocked, three lines of content are permanently invisible.
- **Suggestion:** Default to opacity: 1 in CSS, then set opacity: 0 via GSAP .set() before animating. Progressive enhancement.

**Finding A11Y-04: Farsi text direction conflict**
- **Location:** hero.tsx:61
- **Severity:** major | **Effort:** quick-fix
- **Issue:** dir="rtl" with style textAlign: "left" contradicts the RTL direction, potentially confusing screen readers about text flow.
- **Suggestion:** Remove textAlign: "left" or use textAlign: "start".

**Finding A11Y-05: Skip link z-index competition**
- **Location:** layout.tsx:61-64
- **Severity:** minor | **Effort:** quick-fix
- **Issue:** Skip link uses z-[9999] but VHSOverlay uses z-[9998]. When focused, VHS overlay scanlines could create visual noise over the skip link.
- **Suggestion:** Ensure skip link background is fully opaque (it is with bg-primary - confirmed good).

---

### Consistency

**Score:** 82/100
**Rationale:** Massive improvement from v1 critique. Shared Nav and Footer components used across all pages. Token system is comprehensive. Naming convention is consistent. Remaining issues are hardcoded hex values and inconsistent nav height offset.

**Finding CON-01: Nav height offset inconsistency**
- **Location:** hero.tsx:8 (mt-[60px]), components/page.tsx:467 (mt-[83px]), tokens/page.tsx:164 (mt-[83px]), start/page.tsx:196 (mt-[83px]), reference/page.tsx:144 (mt-[83px])
- **Severity:** critical | **Effort:** quick-fix
- **Issue:** Homepage hero uses mt-[60px], all other pages use mt-[83px]. Nav height is dynamic with clamp(), so neither magic number is reliable across all viewports.
- **Suggestion:** Create --nav-height in globals.css and use mt-[var(--nav-height)] everywhere. Or use a layout component that handles the offset.

**Finding CON-02: Hardcoded colors outside token system**
- **Location:** manifesto-band.tsx:9, code-section.tsx:21, code-section.tsx:112, global-effects.tsx:99
- **Severity:** major | **Effort:** quick-fix
- **Issue:** Five instances of raw hex colors in components while the rest of the codebase uses OKLCH tokens or CSS variables consistently.
- **Suggestion:** Map each to nearest token: the pinks to var(--color-primary), #333 to var(--color-foreground), #111 to var(--sf-code-bg), #FF6B6B to a new --sf-code-const token.

**Finding CON-03: Author name display**
- **Location:** footer.tsx:22
- **Severity:** major | **Effort:** quick-fix
- **Issue:** "By Grey Alt+R" appears to be a rendering artifact rather than the intended author name.
- **Suggestion:** Verify intended display name and correct.

---

### Engineering Quality

**Score:** 78/100
**Rationale:** Clean TypeScript throughout. GSAP plugin registration is centralized. Component composition uses SF wrapper pattern well. shadcn integration is proper. Some patterns need attention: dead conditionals, client component over-use, inline styles that should be tokens.

**Finding ENG-01: Dead ternaries**
- **Location:** start/page.tsx:248-249, component-grid.tsx:293
- **Severity:** minor | **Effort:** quick-fix
- **Issue:** Two identical-branch ternaries where both conditions return the same value.
- **Suggestion:** Remove the ternaries; use the value directly.

**Finding ENG-02: Motion keyframe in component instead of globals**
- **Location:** tokens/page.tsx:402-407
- **Severity:** major | **Effort:** moderate
- **Issue:** @keyframes sf-motion-slide defined inside style jsx global in TokensPage. Every other sf- keyframe lives in globals.css.
- **Suggestion:** Move to globals.css for consistency.

---

### Performance

**Score:** 70/100
**Rationale:** Build is clean at 102kB shared JS. Pages are reasonably sized. However, three full pages are unnecessarily client-rendered, and useLayoutEffect with Flip could cause paint delays.

**Finding PERF-01: Full-page client components**
- **Location:** components/page.tsx, tokens/page.tsx, reference/page.tsx
- **Severity:** critical | **Effort:** moderate
- **Issue:** Three pages marked "use client" at top level, meaning entire page (including large static data arrays) is shipped as client JS. Only interactive parts (filter bar, tabs, sidebar state) need client rendering.
- **Suggestion:** Extract static data and layout into Server Components. Create small client islands for interactive parts.

**Finding PERF-02: useLayoutEffect Flip animation on every keystroke**
- **Location:** components/page.tsx:437-462
- **Severity:** major | **Effort:** moderate
- **Issue:** Every character typed in the search input triggers captureFlipState > setSearchQuery > useLayoutEffect > Flip.from(). This runs synchronously before paint.
- **Suggestion:** Debounce the search input by 150-200ms before triggering the Flip animation.

---

## Action List for /pde:iterate

Priority-ordered findings for iteration.

### Critical (fix now)
- [ ] A11Y-01: Remove global cursor: none !important; apply only on hover-detected devices -- critical/quick-fix
- [ ] A11Y-02: Fix nested nav landmarks; add aria-label, remove inner nav -- critical/moderate
- [ ] CON-01: Unify nav height offset across all pages with CSS variable -- critical/quick-fix
- [ ] PERF-01: Split full-page client components into server layout + client islands -- critical/moderate

### Major (fix in this cycle)
- [ ] A11Y-03: Make multilingual hero text visible by default (progressive enhancement) -- major/quick-fix
- [ ] A11Y-04: Fix Farsi text direction conflict -- major/quick-fix
- [ ] CON-02: Replace 5 hardcoded hex colors with design tokens -- major/quick-fix
- [ ] CON-03: Fix author name display in footer -- major/quick-fix
- [ ] UX-01: Simplify hero CTA button DOM structure -- major/moderate
- [ ] UX-02: Make API Reference sidebar functional -- major/moderate
- [ ] ENG-02: Move sf-motion-slide keyframe to globals.css -- major/quick-fix
- [ ] ENG-05: Address inline dark mode script CSP concerns -- major/moderate
- [ ] PERF-02: Debounce search in components page -- major/moderate

### Minor (fix when convenient)
- [ ] UX-03: Replace placeholder GitHub/registry URLs -- minor/quick-fix
- [ ] UX-04: Fix VHS badge / scroll-to-top overlap -- minor/moderate
- [ ] UX-05: Differentiate empty token tabs from populated ones -- minor/moderate
- [ ] ENG-01: Remove 2 dead ternaries -- minor/quick-fix
- [ ] ENG-03: Fix SSR hydration flash on DarkModeToggle -- minor/quick-fix
- [ ] ENG-04: Add OG image and social meta -- minor/moderate
- [ ] VH-01: Fix stats band double-borders -- minor/quick-fix

### Nit (polish)
- [ ] PERF-03: Reduce hero char span count -- nit/quick-fix
- [ ] ENG-06: Consolidate logo animation timing constants -- nit/quick-fix

---

## Resolved Findings (Cumulative)

Findings from v1 critique (lofi wireframes) resolved in implementation:

| # | Finding | Resolved In | Verified |
|---|---------|-------------|----------|
| CON-01 (v1) | Navigation link labels differ across screens | v2 (implementation) | yes |
| CON-02 (v1) | Header structure varies across screens | v2 (implementation) | yes |
| CON-03 (v1) | Footer structure varies across screens | v2 (implementation) | yes |
| CON-04 (v1) | Logo text and class names vary | v2 (implementation) | yes |
| CON-05 (v1) | CSS naming conventions inconsistent | v2 (implementation) | yes |
| UX-01 (v1) | Mobile navigation has no toggle | v2 (implementation) | yes |
| UX-03 (v1) | Command palette only on homepage | v2 (implementation) | yes |
| UX-04 (v1) | No scroll-to-top mechanism | v2 (implementation) | yes |
| VH-01 (v1) | Hero lacks visual weight anchor | v2 (implementation) | yes |
| A11Y-01 (v1) | Wireframe annotation spans exposed | v2 (implementation) | yes |
| A11Y-02 (v1) | Redundant ARIA roles on semantic elements | v2 (implementation) | yes |

---

*Generated by PDE-OS /pde:critique (CRT) | 2026-04-01 | Mode: full | Groups: Visual Hierarchy, UX, Accessibility, Consistency, Engineering, Performance*
*Scope: Full implementation -- 5 pages, layout, 8 block components, nav, footer, global effects*
*Previous: CRT-critique-v1.md (lofi wireframes, 2026-03-31)*
