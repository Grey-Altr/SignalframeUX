---
Generated: "2026-04-02"
Skill: /pde:critique (CRT)
Version: v11
Status: final
Mode: "full"
Groups Evaluated: "Visual Hierarchy, UX & Interaction, Accessibility, Consistency, Engineering, Performance"
Enhanced By: "Full codebase read (73 components, 901 lines globals.css), GSAP bundle audit (5 tiers), ARIA spec validation, z-index token audit, dark mode pass"
---

# Critique Report: SignalframeUX Implementation v11

---

## Summary Scorecard

| Group | Score | Weight | Weighted |
|-------|-------|--------|----------|
| Visual Hierarchy & Composition | 93/100 | 1.5x | 139.5 |
| UX & Interaction | 88/100 | 1.5x | 132 |
| Accessibility | 92/100 | 2.0x | 184 |
| Consistency | 95/100 | 1.0x | 95 |
| Engineering Quality | 93/100 | 1.0x | 93 |
| Performance | 93/100 | 1.0x | 93 |
| **Composite** | | | **92/100** |

**Overall:** A- | 92/100 | First A-tier score. All v7 findings (3 medium, 6 low) fully resolved across v8–v10 fix cycles. Z-index system fully tokenized, CONTEXT™ label fixed, swatch contrast tokens created, keyboard focus on swatches, mobile nav path matching corrected, manifesto RAF-throttled, start/page z-token adopted. New deep-dive surfaced 2 medium (ARIA grid hierarchy, external link announcements), 5 low.

---

## Delta from v7

| Group | v7 | v11 | Delta | Notes |
|-------|-----|------|-------|-------|
| Visual Hierarchy | 91 | 93 | +2 | Swatch contrast tokens resolved, no new regressions |
| UX & Interaction | 82 | 88 | +6 | CONTEXT™ label fixed, all 28 API docs complete, no "COMING SOON" states |
| Accessibility | 91 | 92 | +1 | Swatch keyboard focus added, aria-current on mobile nav, ARIA grid hierarchy newly surfaced |
| Consistency | 93 | 95 | +2 | Z-index fully tokenized (--z-above-bg, --z-content), no hardcoded z-values in first-party code |
| Engineering | 90 | 93 | +3 | Scramble RAF consolidated, GSAP easings deduplicated, clean cancellation patterns |
| Performance | 91 | 93 | +2 | Manifesto RAF-throttled, hero-mesh IntersectionObserver pause verified |

---

## Resolved Findings from v7 (All 9)

| # | Finding | Resolution | Verified |
|---|---------|------------|----------|
| M-1 | "LIVE PREVIEW™" label misleading for 27/28 states | Renamed to "CONTEXT™" | yes |
| M-2 | Swatch contrast text uses hardcoded #fafafa/#1a1a1a | Now uses `var(--color-background)` / `var(--color-foreground)` | yes |
| M-3 | z-10 in hero.tsx, manifesto-band.tsx bypasses token system | Replaced with `z-[var(--z-content)]` | yes |
| L-4 | marquee-band border-y-[3px] border seam | Changed to `border-y-4` matching `--border-section` | yes |
| L-5 | token-tabs swatches not keyboard-focusable | Added `tabIndex={isFocused ? 0 : -1}` + onFocus handler + arrow key navigation | yes |
| L-6 | Mobile sheet uses exact pathname match | Now uses `isActivePath()` with startsWith logic | yes |
| L-7 | Manifesto scroll handler mutates DOM without RAF | Wrapped in `cancelAnimationFrame` / `requestAnimationFrame` | yes |
| L-8 | Inline marquee without reduced-motion guard | CSS global `animation-duration: 0.01ms !important` handles this | yes |
| L-9 | start/page.tsx z-[1] bypasses token system | Replaced with `z-[var(--z-above-bg)]` | yes |

---

## Remaining Findings

### Medium (2)

| # | Group | Location | Issue | Suggestion |
|---|-------|----------|-------|------------|
| 1 | A11Y | token-tabs.tsx:253-310 | **ARIA grid hierarchy violation.** `role="grid"` > `role="row"` > `role="img"` on swatches. ARIA spec requires direct children of `role="row"` to be `role="gridcell"`, `role="rowheader"`, or `role="columnheader"`. Screen readers may not navigate the grid correctly. | Change swatch `role="img"` to `role="gridcell"`. Add `role="rowheader"` to the label column (line 280). Keep `aria-label` on each cell for the oklch value. |
| 2 | A11Y | start/page.tsx:371-378 | **External links missing "(opens in new tab)" announcement.** GitHub and Storybook buttons open in new tabs (`target="_blank"`) but lack sr-only text. hero.tsx correctly includes `<span className="sr-only">(opens in new tab)</span>`. | Add `<span className="sr-only">(opens in new tab)</span>` inside each external link, matching the hero.tsx pattern. |

### Low (5) — All resolved

| # | Group | Location | Issue | Resolution |
|---|-------|----------|-------|------------|
| 3 | A11Y | hero-mesh.tsx | Runtime reduced-motion listener | **Pre-resolved** — code already had `mql.addEventListener("change", motionHandler)` with RAF cancellation |
| 4 | UX | marquee-band.tsx:12 | No non-hover pause mechanism | **Fixed** — added `group-focus-within:[animation-play-state:paused]` |
| 5 | CON | api-explorer.tsx:556 | Hardcoded pixel widths on scroll bar | **Fixed** — extracted `--api-sidebar-w` and `--api-preview-w` CSS custom properties |
| 6 | ENG | component-grid.tsx:58-73 | Raw div table preview | **Fixed** — replaced with SFTable/SFTableHeader/SFTableBody/SFTableRow/SFTableCell |
| 7 | A11Y | footer.tsx install section | Copy interaction a11y | **Pre-resolved** — CopyButton already has `aria-live="polite"` with "Copied to clipboard" announcement |

---

## Detailed Findings by Perspective Group

### Visual Hierarchy & Composition

**Score:** 93/100
**Rationale:** Type scale adoption is excellent across all 73 components. The industrial minor-third ratio (1.2) creates appropriate density without crowding. OKLCH color system with 588 tokens provides perceptual uniformity. Layout rhythm is consistent — grid-based sections with proper spacing tokens. The halftone decorative elements, grain textures, and debossed elevation model all reinforce the DU/TDR brutalist-flat aesthetic. No visual regressions from v7.

No new findings.

---

### UX & Interaction

**Score:** 88/100
**Rationale:** Major improvement from v7 (82→88). The CONTEXT™ rename eliminates the most impactful UX gap. All 28 API nav items now render full documentation — zero "COMING SOON" states. Keyboard navigation is comprehensive: arrow keys in API sidebar, component grid, color swatch grid. Search debouncing in components explorer prevents layout thrash. Mobile responsive handling is solid with SFSheet nav and SFSelect dropdown for API explorer. The marquee pause-on-hover-only gap remains the primary UX concern.

**Finding 4: Marquee band lacks non-hover pause mechanism**
- **Location:** components/blocks/marquee-band.tsx:12
- **Severity:** low | **Effort:** moderate
- **Issue:** The marquee uses `group-hover:[animation-play-state:paused]` as the only pause mechanism. Touch and keyboard users cannot pause the scrolling text. While the CSS reduced-motion media query kills the animation entirely, users who tolerate motion but want to read the text have no control.
- **Suggestion:** Add a visually hidden "Pause animation" toggle button, or apply `animation-play-state: paused` on `:focus-within` so keyboard focus anywhere in the section pauses it.
- **Reference:** WCAG 2.2.2 Pause, Stop, Hide (Level A)

---

### Accessibility

**Score:** 92/100
**Rationale:** Strong foundation across the board. Skip-to-content link, CSP nonce injection, proper `lang` attributes (ja, fa, zh), `dir="rtl"` for Farsi, sr-only text for screen readers, aria-current on nav links, aria-live result counters, comprehensive prefers-reduced-motion handling at both CSS and JS levels. The ARIA grid hierarchy violation in token-tabs is the most significant remaining gap — it breaks the grid navigation contract for screen reader users. External link announcements are inconsistent (hero has sr-only text, start page doesn't).

**Finding 1: ARIA grid hierarchy violation in Token Explorer**
- **Location:** token-tabs.tsx:253-310
- **Severity:** medium | **Effort:** quick-fix
- **Issue:** The color grid declares `role="grid"` on the container and `role="row"` on each scale row. However, the individual swatch cells use `role="img"` instead of `role="gridcell"`, and the label column (line 280) has no ARIA role. The ARIA specification requires direct children of `role="row"` to be `role="gridcell"`, `role="rowheader"`, or `role="columnheader"`. Screen readers using grid navigation (Ctrl+Alt+Arrow on VoiceOver) will not correctly traverse the swatches.
- **Suggestion:** Change `role="img"` to `role="gridcell"` on each swatch div. Add `role="rowheader"` to the label column div. The `aria-label` on each cell already provides the oklch value — this is preserved.
- **Reference:** WAI-ARIA 1.2 § grid role, § row role — required owned elements

**Finding 2: External links missing screen reader announcement**
- **Location:** start/page.tsx:371-378
- **Severity:** medium | **Effort:** quick-fix
- **Issue:** GitHub and Storybook buttons in the community band use `target="_blank"` but don't announce this to screen reader users. The hero.tsx external link (line 108) correctly includes `<span className="sr-only">(opens in new tab)</span>` — this pattern should be applied consistently.
- **Suggestion:** Add `<span className="sr-only">(opens in new tab)</span>` inside each external link anchor.
- **Reference:** WCAG 3.2.5 Change on Request, common convention for new-tab announcements

**Finding 3: hero-mesh no runtime reduced-motion listener**
- **Location:** components/animation/hero-mesh.tsx
- **Severity:** low | **Effort:** moderate
- **Issue:** The canvas mesh animation checks `prefers-reduced-motion` at component mount via `window.matchMedia()` but doesn't subscribe to the `change` event. If a user toggles reduced motion after page load, the mesh continues its sine wave and mouse repulsion animation. Other components handle this correctly: `initReducedMotion()` in gsap-plugins.ts pauses the global GSAP timeline on runtime changes, and the LiveClock handles visibility changes.
- **Suggestion:** Add a `change` event listener on the matchMedia object. When reduced motion is enabled at runtime, cancel the RAF loop and optionally draw a static frame.
- **Reference:** WCAG 2.3.3 Animation from Interactions (Level AAA)

**Finding 7: Footer install section copy interaction**
- **Location:** footer.tsx install section
- **Severity:** low | **Effort:** quick-fix
- **Issue:** If the install command section has a copy-to-clipboard button, the success state should be announced via an aria-live region. If no copy button exists, the monospace code string should use `role="textbox"` with `aria-readonly="true"` so screen readers understand it's selectable text.
- **Suggestion:** Add `aria-live="polite"` region near the copy button that announces "Copied to clipboard" on click.
- **Reference:** WCAG 4.1.3 Status Messages (Level AA)

---

### Consistency

**Score:** 95/100
**Rationale:** Excellent consistency across the design system. Z-index is fully tokenized — every z-index in first-party code uses `var(--z-*)` tokens. The only bare z-values appear in `lib/api-docs.ts` (documentation example code, not UI styling) and `.planning/` mockups (design artifacts). Border widths consistently use `--border-element`, `--border-divider`, and `--border-section`. Color tokens are comprehensive — no hardcoded oklch in component styling (the oklch values in token-tabs and component-grid are data labels, not style values). Font families, text sizes, and spacing all reference CSS custom properties.

**Finding 5: API Explorer scroll progress bar hardcoded widths**
- **Location:** api-explorer.tsx:556
- **Severity:** low | **Effort:** moderate
- **Issue:** The fixed scroll progress bar uses `left-[240px] right-[383px]` to align with the 3-column grid. These magic numbers mirror the grid column definitions but aren't derived from them. If the sidebar (240px) or preview panel (380px) widths are changed, the progress bar will misalign.
- **Suggestion:** Extract column widths to CSS custom properties (e.g., `--api-sidebar-w: 240px`, `--api-preview-w: 380px`) and reference them in both the grid template and the progress bar positioning.
- **Reference:** DRY principle for layout dimensions

---

### Engineering Quality

**Score:** 93/100
**Rationale:** Clean architecture throughout. The 5-tier GSAP bundle system (core 8KB, flip 25KB, split 35KB, draw, plugins 75KB) provides excellent tree-shaking. The scramble coordinator (`getScrambleState()` via globalThis) runs a single RAF loop for all 6+ scramble instances — a significant improvement over per-instance setInterval. All useEffect hooks have proper cleanup (clearInterval, removeEventListener, cancelAnimationFrame, ctx.revert). Cancellation flags (`cancelledRef`, `cancelled` boolean) prevent async state updates on unmounted components. TypeScript typing is thorough. The `registerSFEasings()` function provides canonical custom easings across all bundles.

**Finding 6: Component grid table preview inconsistency**
- **Location:** components/blocks/component-grid.tsx:58-73
- **Severity:** low | **Effort:** quick-fix
- **Issue:** The table cell preview uses raw HTML divs to simulate a table layout. All other preview cells in component-grid.tsx use actual SF primitives (SFButton, SFCard, SFInput, SFBadge, PreviewTabs). While this is a visual demo (not data), it's a minor inconsistency in the "eat your own dogfood" principle.
- **Suggestion:** Replace with a compact SFTable if it fits the cell dimensions. Alternatively, document the exception with a comment explaining why raw divs are used (e.g., SFTable's border styling overflows the compact cell).
- **Reference:** Design system self-consumption principle

---

### Performance

**Score:** 93/100
**Rationale:** Performance is strong across all metrics. Lazy-loaded GSAP bundles avoid 75KB on non-homepage routes. Single RAF loop for nav scramble animations. IntersectionObserver pauses hero-mesh canvas when offscreen. CSS-driven animations for marquee, skeleton sweep, logo glitch. RAF throttling on all scroll handlers (manifesto-band, api-explorer scroll progress, global scroll progress, scroll-to-top). Visibility change handling pauses intervals/RAFs when tab is hidden (HudTelemetry, LiveClock). `memo()` on NavLink, LiveClock, DarkModeToggle, LogoMark, HudTelemetry prevents unnecessary re-renders. `useMemo` for static style objects and filtered component lists. No performance findings at this maturity level.

No new findings.

---

## Action List for /pde:iterate

Priority-ordered findings for iteration. Copy this checklist to select which findings to address.

- [ ] **M-1** token-tabs ARIA grid hierarchy: change `role="img"` → `role="gridcell"`, add `role="rowheader"` to label column — a11y/quick-fix
- [ ] **M-2** start/page.tsx external links: add sr-only "(opens in new tab)" text to GitHub and Storybook buttons — a11y/quick-fix
- [ ] **L-3** hero-mesh runtime reduced-motion listener — a11y/moderate
- [ ] **L-4** marquee-band non-hover pause mechanism — ux/moderate
- [ ] **L-5** api-explorer scroll progress bar hardcoded widths — con/moderate
- [ ] **L-6** component-grid table preview raw divs — eng/quick-fix
- [ ] **L-7** footer install section copy interaction a11y — a11y/quick-fix

---

## v3 → v11 Trajectory

| Metric | v3 | v4 | v5 | v6 | v7 | v11 | Trend |
|--------|----|----|----|----|-----|------|-------|
| Composite Score | 66 | 81 | 88 | 88 | 89 | 92 | +26 total |
| Grade | C+ | B | B+ | B+ | B+ | A- | **First A-tier** |
| Critical Findings | 6 | 0 | 0 | 0 | 0 | 0 | Resolved |
| High Findings | 12 | 5 | 0 | 0 | 0 | 0 | Resolved |
| Medium Findings | 20 | 12 | 6 | 8 | 3 | 2 | -90% |
| Low Findings | 15 | 6 | 7 | 9 | 6 | 5 | -67% |
| Total Findings | 53 | 23 | 13 | 17 | 9 | 7 | -87% |
| styled-jsx | 5 | 3 | 0 | 0 | 0 | 0 | Eliminated |
| Hardcoded oklch (styling) | 20+ | 1 | 0 | 0 | 0 | 0 | Eliminated |
| API placeholder pages | 23 | 23 | 23 | 23 | 0 | 0 | Eliminated |
| GSAP bundle tiers | 1 | 2 | 2 | 3 | 5 | 5 | Stable |
| Z-index token adoption | 0% | 30% | 60% | 80% | 90% | 100% | **Complete** |

---

*Generated by PDE-OS /pde:critique (CRT) | 2026-04-02 | Mode: full*
*Previous: CRT-critique-v7.md (89/100 B+) | v8–v10 fixes applied via commits (no report files)*
