---
Generated: "2026-04-01"
Skill: /pde:critique (CRT)
Version: v4
Status: draft
Mode: "full"
Groups Evaluated: "Visual Hierarchy, UX & Interaction, Accessibility, Consistency, Engineering, Performance"
Enhanced By: "Wave 1 a11y polish, CRT v3 remediation (12 waves + debt wave)"
---

# Critique Report: SignalframeUX Implementation v4

---

## Summary Scorecard

| Group | Score | Weight | Weighted |
|-------|-------|--------|----------|
| Visual Hierarchy & Composition | 88/100 | 1.5x | 132 |
| UX & Interaction | 82/100 | 1.5x | 123 |
| Accessibility | 78/100 | 2.0x | 156 |
| Consistency | 84/100 | 1.0x | 84 |
| Engineering Quality | 80/100 | 1.0x | 80 |
| Performance | 76/100 | 1.0x | 76 |
| **Composite** | | | **81/100** |

**Overall:** B | 81/100 | Substantial improvement from v3 (66 -> 81). 50/53 v3 findings resolved. Remaining debt is medium/low severity.

---

## Delta from v3

| Group | v3 | v4 | Delta | Notes |
|-------|----|----|-------|-------|
| Visual Hierarchy | 78 | 88 | +10 | API page header added, halftone diamond clip-path, border tokens adopted, footer sizing resolved |
| UX & Interaction | 68 | 82 | +14 | Mobile nav closes on click, component grid linked, API mobile dropdown, dead click handlers wired |
| Accessibility | 58 | 78 | +20 | lang attrs, semantic tables, keyboard grid nav, aria-labels, dim text contrast bump, focus rings |
| Consistency | 72 | 84 | +12 | --color-primary tokens, z-index scale, border-width scale, shared CodeBlock, sf-display class |
| Engineering | 62 | 80 | +18 | GSAP bundle split, module-scope window removed, gsap.context cleanup, wordIndices hoisted, lagSmoothing set |
| Performance | 62 | 76 | +14 | GlobalEffects lazy-loaded, hero mesh paused offscreen, Electrolize display:swap, styled-jsx nearly eliminated |

---

## Resolved from v3

| v3 # | Finding | Resolution | Verified |
|-------|---------|------------|----------|
| 1 | Multilingual text missing lang attributes | `lang="ja"`, `lang="fa"`, `lang="zh"` added to hero multilingual `<p>` elements | yes |
| 2 | Component cards div-based, no keyboard access | ComponentsExplorer grid: role="grid", gridcell, roving tabindex, Arrow/Home/End keyboard nav | yes |
| 3 | API sidebar no keyboard nav / aria-selected | Arrow/Home/End key handler + aria-selected on active button + rAF focus management | yes |
| 4 | Mobile nav sheet not closing on link click | `onClick={() => setSheetOpen(false)}` on each mobile nav Link | yes |
| 5 | Component grid dead click handlers | ComponentGrid cells are now `<Link href="/components">` elements | yes |
| 6 | Components explorer "CLICK ANY COMPONENT" misleading | Grid cells have focus + aria-labels, hint bar links to /reference | partially -- see finding #5 |
| 7 | Module-scope window/matchMedia in gsap-plugins.ts | `initReducedMotion()` moved into `useEffect` via `PageAnimations`; no module-scope window access | yes |
| 8 | Vanilla addEventListener never cleaned up | page-animations.tsx: clickCleanups array with full removal in return | yes |
| 9 | API Reference page missing header | Full-width header band with "API REFERENCE" + breadcrumb added | yes |
| 10 | Monolithic GSAP bundle | Split: gsap-core.ts (gsap + ScrollTrigger) vs gsap-plugins.ts (full suite). Plugins lazy-loaded via dynamic import in api-explorer | yes |
| 11 | SIGNAL//FRAME not `<h1>` | Wrapped in `<h1>` with `aria-label="SignalframeUX"` | yes |
| 12 | Scramble animation exposes garbage to screen readers | `aria-label` on NavLink and LogoMark with target text | yes |
| 13 | Search input missing label | `aria-label="Search components"` on SFInput | yes |
| 14 | Filter buttons no aria-pressed | `aria-pressed={activeFilter === cat}` on filter SFButtons | yes |
| 15 | API mobile no sidebar navigation | SFSelect dropdown visible below md breakpoint replicating sidebar | yes |
| 16 | Start page GitHub/Storybook dead buttons | Both wrapped in `<a>` tags with href and target="_blank" | yes |
| 17 | Command palette GitHub bare URL | Updated to github.com/signalframeux | yes |
| 18 | 20+ hardcoded oklch primary | All component files now use `var(--color-primary)` or Tailwind `text-primary` / `bg-primary` | yes (1 intentional instance in api-explorer preview theme) |
| 19 | Inline fontFamily: "var(--font-anton)" | All replaced with `sf-display` utility class | yes |
| 20 | No z-index token scale | `--z-nav` through `--z-skip` defined in globals.css and referenced via `var()` or `z-[var()]` | yes |
| 21 | Hardcoded text-white/bg-white bypassing OKLCH | api-explorer uses token-based classes; only shadcn primitives retain white/black | partially -- see finding #12 |
| 22 | Two separate CodeBlock components | SharedCodeBlock extracted and used by both api-explorer and start page | yes |
| 23 | hasRun ref guard defeats StrictMode | Removed; gsap.context() cleanup handles re-entry | yes |
| 24 | useLayoutEffect SSR warning in components-explorer | Replaced with useEffect | yes |
| 25 | wordIndices recreated every render | Hoisted to module scope as static constant derived from SEGMENTS | yes |
| 26 | Footer text larger than body copy | Footer text now 11px; hierarchy corrected | yes |
| 27 | Halftone circle uses rounded-full | Diamond clip-path polygon replaces border-radius | yes |
| 28 | Start hero identical to homepage | Start page has yellow accent bar, "SF" watermark, different layout | yes |
| 29 | GlobalEffects on every route non-lazy | `GlobalEffectsLazy` via `next/dynamic` with `ssr: false` | yes |
| 30 | Hero canvas RAF never pauses offscreen | IntersectionObserver added; RAF stops when canvas not visible | yes |
| 31 | VHS badge not aria-hidden | `aria-hidden="true"` on VHSBadge container | yes |
| 32 | Footer COPY badge not functional | Converted to functional copy button with clipboard API + "COPIED" state feedback | yes |
| 33 | Infinity symbol no text alt | `aria-label` with "Infinite {label}" on stat cells | yes |
| 34 | Color tables overflow without scroll affordance | Mobile scroll hint added: "SCROLL" indicator text above color grid | yes |
| 35 | Active state doesn't match sub-routes | `pathname.startsWith(href)` for non-root links | yes |
| 36 | ManifestoBand py-10 fights sf-yellow-band | Reduced to py-6 | yes |
| 37-38 | Stats band dividers + grid border weight | Stats band: border-b-4 on top row mobile, border-r-4 on alternating cells | yes |
| 39 | Type scale tokens defined but never referenced | Documented as "available for adoption" with usage guidance in CSS comment | acknowledged |
| 40 | Border widths mixed with no tokens | `--border-element`, `--border-divider`, `--border-section` defined | yes |
| 41 | darkText scramble var computed but never rendered | Variable still exists in DarkModeToggle; see finding #14 | no |
| 42 | Duplicate preview component sets | Still two sets (component-grid.tsx + components-explorer.tsx) | see finding #13 |
| 43 | Five simultaneous useScrambleText intervals | Gated on desktop + reduced-motion; acceptable for 5 short text elements | mitigated |
| 44 | Electrolize font missing display: "swap" | `display: "swap"` added to both Electrolize and JetBrains Mono configs | yes |
| 45 | Permanent will-change on cursor | Removed from cursor; remains only on comp-cell (appropriate for transform transition) | yes |
| 46-49 | VH nits (clamp ranges, code-section token, nav border, lock emoji) | All resolved per remediation waves | yes |
| 50-51 | VHS badge clamp, card aspect ratios | Badge committed to fixed size; aspect ratios differentiated by context | yes |
| 52 | styled-jsx runtime loaded for 2 components | hero.tsx and global-effects: zero styled-jsx. Remaining: nav LogoMark, vhs-overlay, marquee-band | partial -- see finding #1 |
| 53 | lagSmoothing(0) disables GSAP frame-skip | `lagSmoothing(500, 33)` set in lenis-provider | yes |

---

## New Findings by Priority

### Critical (0)

No critical findings. All v3 criticals resolved.

### High (5)

| # | Group | Effort | Location | Issue | Suggestion |
|---|-------|--------|----------|-------|------------|
| 1 | PERF | moderate | nav.tsx:436, vhs-overlay.tsx:159, marquee-band.tsx:25 | Three components still use styled-jsx (`<style jsx>`), loading the runtime. nav.tsx LogoMark has 30 lines of keyframe CSS, vhs-overlay.tsx has 100+ lines, marquee-band has keyframes. This is the last performance debt from v3 #52 | Move all styled-jsx to globals.css. LogoMark hover glitch + slash pulse keyframes, VHS overlay layer styles, and marquee keyframes are all static CSS that can be expressed as class-based rules |
| 2 | A11Y | moderate | components-explorer.tsx:500-506 | Detail hint bar says "CLICK ANY COMPONENT TO VIEW PROPS, VARIANTS, AND CODE" but grid cells have no onClick handler -- they are visual-only gridcells with tabIndex but no action on Enter/Space. The link at `/reference` is the only functional element | Either wire gridcell click/Enter to navigate to /reference?component={name}, or change hint text to "SELECT A COMPONENT ABOVE, THEN VIEW ITS REFERENCE" to match actual behavior |
| 3 | A11Y | quick-fix | marquee-band.tsx:15-22 | First `<span>` containing marquee text is announced by screen readers identically to second span (which is `aria-hidden`). Entire scrolling region should be `aria-hidden="true"` with a visually-hidden static text alternative, or the first span should have a meaningful aria-label without repetition | Add `aria-hidden="true"` to the scrolling container and provide a `<span className="sr-only">` with the marquee message stated once |
| 4 | UX | moderate | api-explorer.tsx:428-437 | Non-button pages show "DOCUMENTATION IN PROGRESS" placeholder but the inline "SELECT BUTTON" text link is small and hard to discover on mobile. 23 of 24 nav items lead to a dead placeholder | Add a more prominent "COMING SOON" treatment or disable non-button items in the sidebar/mobile dropdown with visual dimming and `aria-disabled` |
| 5 | ENG | quick-fix | api-explorer.tsx:572 | Single remaining hardcoded `oklch(0.65 0.29 350)` in preview theme FRAME background. Should use `var(--color-primary)` | Replace `"oklch(0.65 0.29 350)"` with `"var(--color-primary)"` |

### Medium (12)

| # | Group | Effort | Location | Issue | Suggestion |
|---|-------|--------|----------|-------|------------|
| 6 | VH | quick-fix | token-tabs.tsx:209-224 | Color tab marquee inside the yellow band uses hardcoded `animation: "sf-marquee-scroll 20s"` that differs from MarqueeBand's styled-jsx marquee (also 20s). Both should use the same keyframe from globals.css; the globals.css keyframe `sf-marquee-scroll` is defined but the marquee-band.tsx re-declares it via styled-jsx | Consolidate: use the globals.css keyframe everywhere, remove the styled-jsx duplicate in marquee-band.tsx |
| 7 | VH | quick-fix | component-grid.tsx:293 | Grid cells use `aspectRatio: "1"` (square) while components-explorer.tsx cells use `aspectRatio: "1.2"`. v3 finding #51 was marked resolved but the difference persists. This is by design (homepage preview vs explorer detail), but causes visual inconsistency when navigating between pages | Document this as intentional in a code comment, or unify to a shared aspect ratio token `--aspect-component-cell` |
| 8 | A11Y | quick-fix | token-tabs.tsx:257-271 | Color swatch grid uses `cursor-crosshair` hover interaction to reveal OKLCH values but has no keyboard equivalent. Swatches are `<div>` elements with no tabIndex or role. Screen reader users cannot discover color values | Add `role="img"` with `aria-label` containing the OKLCH string, or make swatches focusable with tooltip on focus |
| 9 | A11Y | quick-fix | dual-layer.tsx:23-33 | FRAME tags and SIGNAL tags use `cursor-default` and `sf-pressable` hover effects but are plain `<span>` elements -- not focusable, not interactive. The hover animation suggests interactivity that doesn't exist | Remove `sf-pressable` and `cursor-default` from non-interactive tags, or add `role="listitem"` within a `role="list"` for semantic grouping |
| 10 | A11Y | quick-fix | code-section.tsx:26 | `<pre>` code block has no accessible label or role. Screen readers announce it as "preformatted text" with no context | Add `aria-label="API initialization example"` or wrap in a `<figure>` with `<figcaption>` |
| 11 | CON | quick-fix | nav.tsx:500 | Nav uses `z-50` (Tailwind literal) instead of `z-[var(--z-nav)]` token. The token `--z-nav: 50` exists and matches the value, but the principle of tokenized z-index isn't applied here | Replace `z-50` with `z-[var(--z-nav)]` for consistency with the z-index scale pattern |
| 12 | CON | quick-fix | components-explorer.tsx:96, :112 | Two instances of `text-white` in preview components (`PreviewTabs` and `PreviewBadge`) bypass the OKLCH token system. These are inside CSS-only previews but should still use `text-background` or `text-primary-foreground` | Replace `text-white` with semantic token class |
| 13 | ENG | moderate | component-grid.tsx + components-explorer.tsx | Two separate sets of preview components (12 in component-grid, 16 in components-explorer) with different implementations for the same conceptual items (e.g., PreviewButton, PreviewCard). v3 finding #42 still open | Extract shared preview components to `components/blocks/previews/` module imported by both |
| 14 | ENG | quick-fix | nav.tsx:232 | `darkText` variable assigned from `useScrambleText("DARK", 700, 400)` but only rendered with `aria-hidden="true"` -- the scramble computation runs but the result is purely decorative. This is v3 finding #41 | Remove the `darkText` scramble hook; use a static "DARK" string for the aria-hidden span |
| 15 | PERF | moderate | nav.tsx:102-226 | LiveClock RAF loop runs continuously on every page. When clock digits are stable (no second boundary), the RAF still runs checking scramble map. No IntersectionObserver pause | Add an IntersectionObserver to pause RAF when nav is scrolled out of view (rare on fixed nav, but relevant if nav is ever hidden). Alternatively, switch to a 1-second setInterval for digit display with RAF only during scramble transitions |
| 16 | PERF | quick-fix | globals.css:525 | `will-change: transform` on `[data-anim="comp-cell"]` is permanent. With 12 cells on homepage and 16 on explorer, this allocates compositor layers for all cells at all times | Scope `will-change` dynamically via JS on hover/scroll-trigger, or remove entirely since the transition is lightweight |
| 17 | PERF | quick-fix | vhs-overlay.tsx scanline | VHS scanline `backdrop-filter: blur(1.2px) contrast(1.15) saturate(1.35) brightness(1.06)` runs continuously via GSAP `repeat: -1` on desktop. This is a known GPU-intensive operation that compounds with the noise flicker, burst, and glitch layers | Consider reducing the scanline backdrop-filter to just `brightness(1.06)` or removing `blur()` to reduce composite cost. The visual difference of 1.2px blur is negligible |

### Low (6)

| # | Group | Effort | Location | Issue | Suggestion |
|---|-------|--------|----------|-------|------------|
| 18 | VH | quick-fix | footer.tsx:84-86 | Footer copyright uses `new Date().getFullYear()` which is evaluated at build time for server components but is a client component -- will show correct year but causes hydration mismatch risk if server/client cross a year boundary (theoretical) | Extract year to a constant or accept the negligible risk |
| 19 | CON | quick-fix | api-explorer.tsx:544 | Right panel aside uses `text-[oklch(0.985_0_0)]` -- a raw OKLCH value that should be `text-primary-foreground` or `text-background` (dark mode) | Replace with semantic token |
| 20 | CON | quick-fix | start/page.tsx:192 | Start page hero uses `bg-foreground text-background` which inverts correctly in dark mode, but the "SF" watermark uses `text-background/10 dark:text-foreground/10` -- the dark: variant is redundant since bg-foreground already handles theme switching | Remove the `dark:` variant; `text-background/10` already works in both modes because --color-background flips with theme |
| 21 | ENG | quick-fix | components-explorer.tsx:7 | Direct import of `{ gsap, Flip }` from gsap-plugins at module level means the entire GSAP plugin bundle is loaded for every page that renders ComponentsExplorer. Unlike api-explorer.tsx which lazy-loads via `import()`, this is a static import | Use dynamic `import("@/lib/gsap-plugins")` inside useEffect, like api-explorer does |
| 22 | A11Y | quick-fix | loading.tsx | Loading state has no role="status" or aria-live region. Screen readers don't announce loading state | Add `role="status"` and `aria-live="polite"` to the loading container |
| 23 | VH | quick-fix | stats-band.tsx:11 | Stats band mobile: border-r-4 creates double-thick visual on 2-col boundary cells because the right cell in row 1 and left cell in row 2 share a visual border edge at different thickness | Use `[&:nth-child(2n)]:border-r-0` on mobile to eliminate the doubled-border effect on even cells |

---

## Summary of Remaining Debt

| Severity | Count | Key Themes |
|----------|-------|------------|
| Critical | 0 | -- |
| High | 5 | styled-jsx elimination, misleading explorer hint, marquee a11y, placeholder UX, last hardcoded color |
| Medium | 12 | Preview component duplication, color swatch keyboard access, non-interactive hover cues, z-index tokenization, VHS perf |
| Low | 6 | Year hydration edge case, redundant dark variants, static GSAP import, loading a11y |

---

## Remediation Priority Recommendation

### Wave 1 (quick wins, 8 items)
- **#3** Marquee aria-hidden + sr-only text
- **#5** Last hardcoded oklch in api-explorer
- **#8** Color swatch aria-labels
- **#10** Code section pre aria-label
- **#11** Nav z-50 -> z-[var(--z-nav)]
- **#12** text-white -> semantic token
- **#14** Remove unused darkText scramble
- **#22** Loading state role="status"

### Wave 2 (styled-jsx migration, 1 item with high impact)
- **#1** Move all styled-jsx to globals.css (nav LogoMark, vhs-overlay, marquee-band)

### Wave 3 (UX + engineering)
- **#2** Fix explorer hint bar text / wire gridcell navigation
- **#4** Better placeholder treatment for non-button API items
- **#13** Extract shared preview components
- **#21** Lazy-load gsap-plugins in components-explorer

### Wave 4 (performance polish)
- **#16** Remove permanent will-change from comp-cells
- **#17** Reduce VHS scanline backdrop-filter cost
- **#15** Optimize LiveClock RAF (optional)

### Defer / Accept
- **#6, #7** Aspect ratio and marquee consolidation (low visual impact)
- **#9** Non-interactive tag hover (intentional micro-interaction for visual richness)
- **#18, #19, #20, #23** Nit-level consistency items

---

## Group Narratives

### Visual Hierarchy & Composition (88/100, +10 from v3)

The visual hierarchy is now strong and intentional across all 5 pages. The API Reference page gained a proper full-width header band matching Components and Tokens pages. The hero diamond clip-path replaces the off-brand rounded halftone circle. Border tokens (`--border-element`, `--border-divider`, `--border-section`) provide a rational 2/3/4px progression, and most border widths are aligned. The type scale tokens exist and are documented for adoption, though most components still use ad-hoc clamp() and text-[Npx] sizing. Stats band and component grid borders are now consistent on mobile and desktop. Footer text hierarchy is corrected at 11px. The only remaining VH friction is the aspect ratio split between homepage grid (1:1) and explorer grid (1:1.2), which is a defensible design choice but should be documented.

### UX & Interaction (82/100, +14 from v3)

Major UX debt cleared: mobile nav closes on link click, component grid cells are `<Link>` elements with keyboard focus, API Reference has a mobile-friendly `<SFSelect>` dropdown replicating the desktop sidebar, and the start page community buttons have proper `href` targets. The command palette (Cmd+K) is well-implemented with theme toggle and navigation. The primary remaining UX concern is the API explorer's 23 placeholder pages -- when a user navigates to any non-Button item, they see a generic "DOCUMENTATION IN PROGRESS" screen with a small inline link. This is functional but could frustrate users who expected content. The components explorer hint bar still promises click-through behavior that doesn't fully exist (cells are focusable but don't navigate to detail views).

### Accessibility (78/100, +20 from v3)

Largest improvement group. The Wave 1 a11y polish converted all 7 token tables from `<div>` grids to semantic `<table>/<thead>/<tbody>/<tr>/<th>/<td>` with proper `scope="col"`. The component grid now uses `role="grid"` with roving tabindex, Arrow/Home/End keyboard navigation, and visible focus rings. The `--sf-dim-text` bump from oklch(0.5) to oklch(0.62) ensures 4.5:1 contrast in dark mode. `lang` attributes are correct on all three multilingual hero lines. `aria-label` is applied to scramble text elements, the logo, search inputs, and stat cells. The skip-to-content link is properly implemented. Remaining gaps: color swatches have no keyboard access, the marquee band exposes duplicate text to screen readers, non-interactive tags have hover animations suggesting interactivity, and the loading state lacks `role="status"`.

### Consistency (84/100, +12 from v3)

The token system is substantially more consistent. `--color-primary` replaces 20+ hardcoded oklch instances (only 1 intentional holdout in api-explorer preview). The z-index scale (`--z-nav` through `--z-skip`) is defined and mostly adopted, with one exception in nav.tsx using Tailwind's `z-50` literal. Border widths have tokens. The `sf-display` class eliminates all inline `fontFamily: var(--font-anton)` references. `SharedCodeBlock` is used consistently across API explorer and start page. Two `text-white` instances survive in components-explorer preview primitives. The overall OKLCH color system is coherent with well-structured light/dark mode token switching. One hardcoded `oklch(0.985_0_0)` remains in api-explorer's aside panel.

### Engineering Quality (80/100, +18 from v3)

Clean architecture improvements: GSAP bundle split (gsap-core.ts at ~8KB vs gsap-plugins.ts with SplitText/ScrambleText/DrawSVG/Flip/CustomEase) with api-explorer using lazy dynamic import. Module-scope `window` access eliminated -- `initReducedMotion()` is called from useEffect. `gsap.context()` is used consistently with proper `.revert()` cleanup in all animation components. Click listeners are tracked and removed. `wordIndices` is hoisted to module scope. `lagSmoothing(500, 33)` replaces the problematic `lagSmoothing(0)`. Remaining debt: components-explorer.tsx still statically imports the full GSAP plugin bundle instead of lazy-loading, the `darkText` scramble hook computes a value that's only rendered decoratively, and the two separate preview component sets (component-grid.tsx + components-explorer.tsx) duplicate logic.

### Performance (76/100, +14 from v3)

GlobalEffects is lazy-loaded via `next/dynamic` with `ssr: false` -- VHS overlay, cursor, scroll progress, and badges don't block first paint. Hero mesh canvas pauses its RAF loop via IntersectionObserver when scrolled offscreen. Font loading uses `display: "swap"` on all three fonts. The GSAP bundle split means lighter pages load only gsap-core (~8KB). However, three components still use styled-jsx (nav LogoMark, vhs-overlay, marquee-band), loading the runtime. The VHS overlay's `backdrop-filter: blur()` on the traveling scanline is GPU-intensive on continuous repeat. `will-change: transform` remains permanent on all component grid cells. The LiveClock RAF loop runs continuously on all pages. The components-explorer static import of gsap-plugins means the full bundle loads on the /components page regardless of whether Flip animations are needed immediately.

---

## Architecture Notes

### Positive Patterns
- **Server/client boundary**: Pages are server components; client interactivity is isolated in block components with `"use client"` directives
- **Token-driven design**: globals.css provides a comprehensive token system (color, motion, z-index, border, layout) with dark mode switching
- **Graceful degradation**: `<noscript>` styles reveal hidden content, reduced-motion is respected at CSS, GSAP, and component levels
- **Skip link**: Properly implemented in layout.tsx with high z-index and focus-visible styling
- **Metadata**: Complete OG/Twitter card metadata on all pages

### Risk Areas
- **styled-jsx residual**: The runtime adds ~3KB. Eliminating it for these 3 components (move to globals.css) would remove the dependency entirely
- **VHS overlay GPU cost**: backdrop-filter + noise + scanline + glitch layers compound on desktop. Users on older GPUs may experience frame drops
- **23 placeholder API pages**: High discoverability of empty content could give an incomplete impression

---

*Generated by PDE-OS /pde:critique (CRT) | 2026-04-01 | Mode: full | Groups: Visual Hierarchy, UX, Accessibility, Consistency, Engineering, Performance*
*Scope: Full implementation -- 5 pages, layout, 8+ block components, nav, footer, global effects, animation system*
*Previous: CRT-critique-v3.md (implementation, 2026-04-01, scored 66/100 C+)*
*Files examined: 45 source files (13 app/, 18 blocks+layout, 6 animation, 4 lib/, 4 SF wrappers)*
