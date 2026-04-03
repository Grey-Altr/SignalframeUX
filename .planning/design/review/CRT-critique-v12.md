---
Generated: "2026-04-02"
Skill: /pde:critique (CRT)
Version: v12
Status: final
Mode: "full"
Groups Evaluated: "Visual Hierarchy, UX & Interaction, Accessibility, Consistency, Engineering, Performance"
Enhanced By: "Full codebase read (73 components, 901 lines globals.css), ARIA grid spec validation, token-tabs keyboard audit, error boundary a11y audit, z-index compliance scan, reduced-motion coverage map"
---

# Critique Report: SignalframeUX Implementation v12

---

## Summary Scorecard

| Group | Score | Weight | Weighted |
|-------|-------|--------|----------|
| Visual Hierarchy & Composition | 93/100 | 1.5x | 139.5 |
| UX & Interaction | 90/100 | 1.5x | 135 |
| Accessibility | 93/100 | 2.0x | 186 |
| Consistency | 96/100 | 1.0x | 96 |
| Engineering Quality | 94/100 | 1.0x | 94 |
| Performance | 93/100 | 1.0x | 93 |
| **Composite** | | | **93/100** |

**Overall:** A- | 93/100 | All 7 v11 findings fully resolved. ARIA grid hierarchy fixed (`role="gridcell"` + `role="rowheader"`), external link sr-only text added, api-explorer widths tokenized, component-grid uses SFTable, marquee `focus-within` pause added. New deep-dive surfaced 1 medium (grid ArrowUp/Down navigation), 2 low, 1 nit.

---

## Delta from v11

| Group | v11 | v12 | Delta | Notes |
|-------|-----|------|-------|-------|
| Visual Hierarchy | 93 | 93 | 0 | Stable, no new regressions |
| UX & Interaction | 88 | 90 | +2 | Marquee focus-within pause resolved, all UX findings cleared |
| Accessibility | 92 | 93 | +1 | ARIA grid + external links fixed; new grid keyboard + error boundary findings |
| Consistency | 95 | 96 | +1 | api-explorer widths tokenized, component-grid SFTable adopted |
| Engineering | 93 | 94 | +1 | All eng findings resolved, clean architecture throughout |
| Performance | 93 | 93 | 0 | Stable, production-grade across all dimensions |

---

## Resolved Findings from v11 (All 7)

| # | Finding | Resolution | Verified |
|---|---------|------------|----------|
| M-1 | ARIA grid hierarchy: `role="img"` on swatches | Changed to `role="gridcell"`, label column now `role="rowheader"` (token-tabs.tsx:280,293) | yes |
| M-2 | External links missing sr-only text | Both GitHub and Storybook buttons now have `<span className="sr-only">(opens in new tab)</span>` (start/page.tsx:373,379) | yes |
| L-3 | hero-mesh runtime reduced-motion listener | `mql.addEventListener("change", motionHandler)` with RAF cancellation (hero-mesh.tsx:54-61) | yes |
| L-4 | marquee-band non-hover pause | Added `group-focus-within:[animation-play-state:paused]` (marquee-band.tsx:12) | yes |
| L-5 | api-explorer hardcoded scroll bar widths | Now uses `var(--api-sidebar-w)` and `var(--api-preview-w)` CSS custom properties (api-explorer.tsx:556,558) | yes |
| L-6 | component-grid table preview raw divs | Replaced with SFTable/SFTableHeader/SFTableBody/SFTableRow/SFTableCell (component-grid.tsx:68-79) | yes |
| L-7 | footer copy interaction a11y | CopyButton already has `aria-live="polite"` with "Copied to clipboard" announcement | yes (pre-resolved) |

---

## Remaining Findings

### Medium (1)

| # | Group | Location | Issue | Suggestion |
|---|-------|----------|-------|------------|
| 1 | A11Y | token-tabs.tsx:262-278 | **Color grid missing ArrowUp/ArrowDown keyboard navigation.** The ARIA grid's `onKeyDown` handler implements ArrowRight, ArrowLeft, Home, and End — but not ArrowUp or ArrowDown. WAI-ARIA 1.2 § grid role requires 2D navigation: ArrowUp should move to the same column in the previous row, ArrowDown to the same column in the next row. Screen reader users using grid navigation (Ctrl+Alt+Arrow on VoiceOver, Arrow on JAWS/NVDA) cannot traverse between color scale rows. | Add `case "ArrowUp"` and `case "ArrowDown"` handlers that find the same `stepIdx` in the adjacent row. Query the parent grid's rows via `e.currentTarget.parentElement`, get sibling row, focus `[data-swatch]` at the matching index. |

### Low (2)

| # | Group | Location | Issue | Suggestion |
|---|-------|----------|-------|------------|
| 2 | A11Y | app/error.tsx:13 | **Error boundary missing `role="alert"`.** The error page renders without `role="alert"` or `aria-live="assertive"`. When an error occurs, screen readers won't automatically announce the error state. The decorative "ERROR" text is correctly `aria-hidden`, but the containing `<main>` needs assertive announcement for the error message. | Add `role="alert" aria-live="assertive"` to the `<div>` at line 14, or wrap the text content in a `<div role="alert">`. |
| 3 | CON | footer.tsx:44 | **External link "(opens in new tab)" uses visible text instead of sr-only.** The footer GitHub link displays `(opens in new tab)` as visible text using `text-[var(--text-2xs)] text-muted-foreground`. hero.tsx (line 108) and start/page.tsx (lines 373, 379) both use `<span className="sr-only">` for the same purpose. Inconsistent pattern across the three external link locations. | Change to `<span className="sr-only">(opens in new tab)</span>` matching the hero and start page pattern, or adopt the visible pattern everywhere and make it a design system convention. |

### Nit (1)

| # | Group | Location | Issue | Suggestion |
|---|-------|----------|-------|------------|
| 4 | CON | code-section.tsx:3 | **Section element without aria-label creates non-navigable landmark.** The `<section>` wrapping the API_INIT code block has no `aria-label` or `aria-labelledby`, so it doesn't register as a navigable region in screen reader landmark lists. The companion `shared-code-block.tsx` correctly uses `role="region" aria-label={...}`. | Add `aria-label="API initialization example"` to the `<section>` element, matching the pattern in shared-code-block.tsx. |

---

## Detailed Findings by Perspective Group

### Visual Hierarchy & Composition

**Score:** 93/100
**Rationale:** No change from v11. Type scale adoption remains excellent across all 73 components. The industrial minor-third ratio (1.2) creates appropriate density. OKLCH color system with 588 tokens provides perceptual uniformity. Layout rhythm is consistent with grid-based sections using proper spacing tokens. Halftone decorative elements, grain textures, and debossed elevation model reinforce the DU/TDR brutalist-flat aesthetic. The component-grid table preview now uses SFTable components, strengthening visual consistency in the preview cells.

No new findings.

---

### UX & Interaction

**Score:** 90/100 (+2 from v11)
**Rationale:** Marquee band now pauses on keyboard focus via `group-focus-within`, closing the last hover-only interaction gap. All 28 API nav items render full documentation. Keyboard navigation is comprehensive: arrow keys in API sidebar, component grid (with Home/End), and color swatch grid (with Home/End). Search debouncing in components explorer prevents layout thrash. The grid keyboard navigation gap (no vertical arrow keys) is the primary remaining concern — it's functional but incomplete against the ARIA grid contract.

No new findings beyond M-1 (grid vertical navigation).

---

### Accessibility

**Score:** 93/100 (+1 from v11)
**Rationale:** Major improvement from resolving the ARIA grid hierarchy violation and external link announcements. The grid now uses correct `role="gridcell"` and `role="rowheader"` structure. All three external link locations now have screen reader announcements (hero, start page with sr-only; footer with visible text). hero-mesh runtime reduced-motion listener confirmed working. Skip-to-content link, CSP nonce injection, proper `lang`/`dir` attributes, sr-only patterns, `aria-current` on nav, `aria-live` result counters, and comprehensive `prefers-reduced-motion` handling at both CSS and JS levels are all solid. New findings are at a deeper level: grid vertical navigation and error boundary announcement.

**Finding 1: Color grid missing ArrowUp/ArrowDown**
- **Location:** token-tabs.tsx:262-278
- **Severity:** medium | **Effort:** moderate
- **Issue:** The ARIA grid keyboard handler supports horizontal navigation (ArrowRight/ArrowLeft) and range navigation (Home/End) but not vertical navigation (ArrowUp/ArrowDown). WAI-ARIA 1.2 § grid requires that ArrowUp moves focus to the cell in the same column of the previous row, and ArrowDown moves to the next row. Currently, users must Tab to move between rows, breaking the grid navigation contract.
- **Suggestion:** Add `case "ArrowUp"` and `case "ArrowDown"` to the switch statement. ArrowDown: get the next sibling row via `e.currentTarget.nextElementSibling`, query `[data-swatch]` at the current `focusedSwatch.step` index, focus it. ArrowUp: get the previous sibling row via `e.currentTarget.previousElementSibling`, same pattern. Update `setFocusedSwatch` with the new row's scaleIdx.
- **Reference:** WAI-ARIA 1.2 § grid role — keyboard interaction model

**Finding 2: Error boundary missing assertive announcement**
- **Location:** app/error.tsx:13
- **Severity:** low | **Effort:** quick-fix
- **Issue:** The error page `<main>` element renders without `role="alert"` or `aria-live="assertive"`. When a route error occurs, the page content changes but screen readers receive no automatic announcement. The `<h1 className="sr-only">Error</h1>` provides semantic heading but doesn't trigger an assertive announcement.
- **Suggestion:** Add `role="alert"` to the `<div className="text-center max-w-md">` container at line 14. This triggers an assertive announcement when the error boundary catches an error and renders this component.
- **Reference:** WAI-ARIA 1.2 § alert role; WCAG 4.1.3 Status Messages (Level AA)

---

### Consistency

**Score:** 96/100 (+1 from v11)
**Rationale:** Excellent improvement. API Explorer scroll progress bar now uses CSS custom properties (`--api-sidebar-w`, `--api-preview-w`) for positioning — zero magic numbers. Component grid table preview now uses SFTable primitives, closing the last "eat your own dogfood" gap. Z-index is fully tokenized in all first-party code — the only bare `z-*` values are in `components/ui/` (shadcn primitives using standard `z-50` for overlays) and `hero.tsx` line 10 (`z-0` stacking context reset, not a positioned layer). Border widths consistently use `--border-element`, `--border-divider`, and `--border-section`. The footer external link text pattern is the sole remaining inconsistency.

**Finding 3: Footer external link text pattern inconsistency**
- **Location:** footer.tsx:44
- **Severity:** low | **Effort:** quick-fix
- **Issue:** The footer GitHub link displays `(opens in new tab)` as visible styled text using `text-[var(--text-2xs)] text-muted-foreground`. All other external links in the codebase (hero.tsx:108, start/page.tsx:373,379) use `<span className="sr-only">(opens in new tab)</span>` — an invisible screen-reader-only pattern. This creates an inconsistent convention.
- **Suggestion:** Either change the footer to `<span className="sr-only">(opens in new tab)</span>` matching the majority pattern, or adopt the visible text approach everywhere if the design intent is to show the hint. The sr-only approach is cleaner visually and matches the existing majority convention.
- **Reference:** Consistent convention across codebase

**Finding 4: Code section landmark non-navigable**
- **Location:** code-section.tsx:3
- **Severity:** nit | **Effort:** quick-fix
- **Issue:** The `<section>` element has no `aria-label` or `aria-labelledby`. Per HTML spec, a `<section>` without an accessible name does not appear in the screen reader's landmark list. The inner `<pre>` has `aria-label="API initialization code example"` (line 26), but the section wrapper is invisible as a landmark. shared-code-block.tsx uses `role="region" aria-label={...}` for the same purpose.
- **Suggestion:** Add `aria-label="API initialization example"` to the `<section>` at line 3.
- **Reference:** HTML 5.2 § section element — landmark semantics

---

### Engineering Quality

**Score:** 94/100 (+1 from v11)
**Rationale:** All v11 engineering findings resolved. The 5-tier GSAP bundle system provides excellent tree-shaking. Scramble coordinator runs a single RAF loop for all instances via `globalThis`. All useEffect hooks have proper cleanup — `clearInterval`, `removeEventListener`, `cancelAnimationFrame`, `ctx.revert()`. Cancellation flags prevent async state updates on unmounted components. TypeScript typing is thorough. `registerSFEasings()` provides canonical custom easings across bundles. The component-grid now uses SFTable for its table preview (self-consumption). CSP with per-request nonces is robust. Lazy-loaded GSAP bundles with `document.querySelector("[data-anim]")` guard prevents loading on non-homepage routes.

No new findings.

---

### Performance

**Score:** 93/100
**Rationale:** No change from v11. Performance is production-grade across all metrics:
- **Lazy GSAP:** 5-tier bundle system avoids 75KB on non-homepage routes; conditional import gated by DOM target detection
- **RAF consolidation:** Single shared loop for nav scramble animations via `globalThis`; RAF cancellation guards on all scroll handlers
- **IntersectionObserver:** hero-mesh canvas pauses rendering + removes mousemove listener when offscreen
- **CSS-driven animations:** marquee, skeleton sweep, logo glitch all use CSS `@keyframes` — no JS overhead
- **Passive listeners:** All scroll event listeners use `{ passive: true }`
- **Visibility handling:** LiveClock and HudTelemetry cancel RAF/intervals when tab hidden
- **Memoization:** `memo()` on NavLink, LiveClock, DarkModeToggle, LogoMark, HudTelemetry; `useMemo` for filtered component lists and static style objects
- **Font loading:** `display: "swap"` on all three fonts prevents render blocking
- **Theme script:** Inline blocking script with nonce prevents FOUC

No new findings.

---

## Action List for /pde:iterate

All findings resolved in-session.

- [x] **M-1** token-tabs ArrowUp/ArrowDown grid navigation: added vertical arrow key handlers — a11y/moderate
- [x] **L-2** error.tsx `role="alert"`: added assertive announcement to error boundary — a11y/quick-fix
- [x] **L-3** footer.tsx external link text: changed to sr-only pattern — con/quick-fix
- [x] **N-4** code-section.tsx section landmark: added `aria-label` to section element — con/quick-fix

---

## Cumulative Resolved Findings (v3 → v12)

| Era | Resolved | Key Items |
|-----|----------|-----------|
| v3 → v4 | 30 | 6 critical (hydration, styled-jsx, raw oklch), 12 high (z-index, token gaps) |
| v4 → v5 | 10 | styled-jsx elimination complete, token coverage expanded |
| v5 → v6 | 4 | API placeholder states, border consistency |
| v6 → v7 | 8 | 23 API docs completed, GSAP 5-tier bundle, scroll perf |
| v7 → v11 | 9 | CONTEXT™ rename, swatch contrast tokens, z-index full tokenization |
| v11 → v12 | 7 | ARIA grid hierarchy, external link sr-only, api-explorer tokens, SFTable adoption, marquee focus-within, hero-mesh motion listener |
| **Total** | **68** | From 53 findings at v3 to 4 remaining at v12 |

---

## v3 → v12 Trajectory

| Metric | v3 | v4 | v5 | v6 | v7 | v11 | v12 | Trend |
|--------|----|----|----|----|-----|------|------|-------|
| Composite Score | 66 | 81 | 88 | 88 | 89 | 92 | 93 | +27 total |
| Grade | C+ | B | B+ | B+ | B+ | A- | A- | Approaching A |
| Critical Findings | 6 | 0 | 0 | 0 | 0 | 0 | 0 | Resolved |
| High Findings | 12 | 5 | 0 | 0 | 0 | 0 | 0 | Resolved |
| Medium Findings | 20 | 12 | 6 | 8 | 3 | 2 | 1 | -95% |
| Low Findings | 15 | 6 | 7 | 9 | 6 | 5 | 2 | -87% |
| Nit Findings | — | — | — | — | — | — | 1 | New tier |
| Total Findings | 53 | 23 | 13 | 17 | 9 | 7 | 4 | -92% |
| styled-jsx | 5 | 3 | 0 | 0 | 0 | 0 | 0 | Eliminated |
| Hardcoded oklch (styling) | 20+ | 1 | 0 | 0 | 0 | 0 | 0 | Eliminated |
| API placeholder pages | 23 | 23 | 23 | 23 | 0 | 0 | 0 | Eliminated |
| GSAP bundle tiers | 1 | 2 | 2 | 3 | 5 | 5 | 5 | Stable |
| Z-index token adoption | 0% | 30% | 60% | 80% | 90% | 100% | 100% | **Complete** |
| ARIA grid compliance | — | — | — | — | — | partial | partial | Horizontal ✓, vertical pending |

---

## Reduced-Motion Coverage Map

| Component | CSS Level | JS Level | Runtime Toggle | Status |
|-----------|-----------|----------|----------------|--------|
| globals.css global rule | `animation-duration: 0.01ms !important` | — | — | ✓ |
| hero-mesh.tsx | — | matchMedia check | `mql.addEventListener("change")` | ✓ |
| scramble-text.tsx | — | matchMedia guard | — | ✓ |
| scroll-reveal.tsx | — | matchMedia guard | — | ✓ |
| split-headline.tsx | — | matchMedia guard | — | ✓ |
| manifesto-band.tsx | — | matchMedia check | Immediate reveal | ✓ |
| components-explorer.tsx | — | matchMedia check | Flip skip | ✓ |
| lenis-provider.tsx | — | matchMedia check | Runtime destroy | ✓ |
| global-effects.tsx | — | Instant scroll fallback | — | ✓ |
| page-animations.tsx | — | Conditional loading | — | ✓ |
| nav.tsx (scramble) | — | matchMedia guard | Mobile skip | ✓ |
| nav.tsx (LogoMark) | — | matchMedia guard | Show final state | ✓ |
| marquee-band.tsx | Via global CSS rule | — | — | ✓ |
| sf-cursor | `display: none !important` | — | — | ✓ |
| vhs-overlay | `display: none` | — | — | ✓ |

**Coverage:** 15/15 animated surfaces — **100%**

---

*Generated by PDE-OS /pde:critique (CRT) | 2026-04-02 | Mode: full*
*Previous: CRT-critique-v11.md (92/100 A-) | v11 fixes applied (uncommitted)*
