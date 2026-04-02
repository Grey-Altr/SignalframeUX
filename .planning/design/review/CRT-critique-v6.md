---
Generated: "2026-04-01"
Skill: /pde:critique (CRT)
Version: v6
Status: draft
Mode: "full"
Groups Evaluated: "Visual Hierarchy, UX & Interaction, Accessibility, Consistency, Engineering, Performance"
Enhanced By: "styled-jsx fully eliminated, token-tabs rework, nav cleanup, VHS overlay CSS migration, @source exclusion fix"
---

# Critique Report: SignalframeUX Implementation v6

---

## Summary Scorecard

| Group | Score | Weight | Weighted |
|-------|-------|--------|----------|
| Visual Hierarchy & Composition | 91/100 | 1.5x | 136.5 |
| UX & Interaction | 88/100 | 1.5x | 132 |
| Accessibility | 86/100 | 2.0x | 172 |
| Consistency | 93/100 | 1.0x | 93 |
| Engineering Quality | 87/100 | 1.0x | 87 |
| Performance | 82/100 | 1.0x | 82 |
| **Composite** | | | **88/100** |

**Overall:** B+ | 88/100 | Steady from v5 (88 → 88). Styled-jsx fully eliminated (+CON, +PERF). VHS overlay migrated to globals.css. Token-tabs heavily reworked. Consistency gains offset by newly surfaced PageAnimations bundle concern. Zero critical/high findings. Remaining debt is medium/low — polish and optimization.

---

## Delta from v5

| Group | v5 | v6 | Delta | Notes |
|-------|----|----|-------|-------|
| Visual Hierarchy | 92 | 91 | -1 | Border tokens still not adopted as utilities; type scale tokens still unused. No regression, but no progress |
| UX & Interaction | 89 | 88 | -1 | 23 API placeholders unchanged; component grid cells still link to /components (no detail view) |
| Accessibility | 87 | 86 | -1 | aria-expanded still missing on token show/hide toggle; dim-text contrast unverified on light backgrounds |
| Consistency | 91 | 93 | +2 | styled-jsx fully eliminated from VHS overlay, marquee, nav logo. All styles in globals.css or Tailwind |
| Engineering | 88 | 87 | -1 | PageAnimations still statically imports gsap-plugins; newly identified dead variable in api-explorer sidebar |
| Performance | 84 | 82 | -2 | VHS slow scanline retains blur(0.6px); PageAnimations bundle loads on all pages; VHS timelines lack Page Visibility pause |

---

## Resolved from v5

| v5 # | Finding | Resolution | Verified |
|-------|---------|------------|----------|
| 1 | Preview component duplication (component-grid vs components-explorer) | NOT RESOLVED — still two separate sets | no |
| 2 | sf-pressable on non-interactive dual-layer tags | NOT RESOLVED — acknowledged as intentional design | deferred |
| 3 | token-tabs show/hide toggle missing aria-expanded | NOT RESOLVED | no |
| 4 | Mobile API dropdown lacks section grouping | NOT RESOLVED | no |
| 5 | Marquee speed inconsistency (12s vs 20s on start page) | RESOLVED — start page community band now uses animate-marquee class (20s) | yes |
| 6 | PageAnimations static import of gsap-plugins | NOT RESOLVED | no |
| 7-13 | Low-severity nits | Mixed — some addressed in token-tabs rework | partial |

**New in v6:**
- styled-jsx fully eliminated from all 3 remaining components (nav LogoMark, VHS overlay, marquee-band)
- VHS overlay styles migrated to globals.css (~160 lines)
- Marquee keyframe consolidated to globals.css `animate-marquee` class
- Logo hover glitch/slash pulse keyframes in globals.css
- Token-tabs component heavily reworked (+214/-188 lines)
- Nav component slimmed (-59 lines from styled-jsx removal)
- `--sf-dim-text` bumped from oklch(0.5) to oklch(0.62) for better contrast
- `@source not "../.planning"` added to prevent Tailwind scanning markdown for phantom classes

---

## New Findings by Priority

### Critical (0)

No critical findings.

### High (0)

No high findings.

### Medium (8)

| # | Group | Effort | Location | Issue | Suggestion |
|---|-------|--------|----------|-------|------------|
| 1 | ENG | moderate | component-grid.tsx + components-explorer.tsx | Two separate sets of preview components (12 in grid, 16 in explorer) with different implementations. Persistent since v3 #42, v4 #13, v5 #1. component-grid uses live SF primitives; components-explorer uses CSS-only approximations. Maintenance risk if previews change | Extract shared preview components to `components/blocks/previews/` with `mode: "full" | "compact"` prop |
| 2 | PERF | moderate | page-animations.tsx:4 | Static import of gsap-plugins (SplitText, ScrambleText, DrawSVG, Flip, CustomEase ~75KB) at module scope. Loads on EVERY page. Only homepage and /reference need these plugins. /tokens, /start, /components don't need them | Dynamic import in useEffect: check for animation targets before importing. Or split PageAnimations into route-specific modules |
| 3 | A11Y | quick-fix | token-tabs.tsx:233 | "SHOW ALL" / "SHOW CORE" toggle button lacks `aria-expanded` attribute. Screen readers cannot determine expanded state. Persistent since v4 #3, v5 #3 | Add `aria-expanded={showAll}` and `aria-controls="color-scale-grid"` |
| 4 | UX | quick-fix | api-explorer.tsx:352-368 | Mobile SFSelect lists all 24 items flat with section prefixes ("CORE / createSignalframeUX"). Desktop sidebar has clear section grouping. Mobile users can't scan section structure at a glance. Persistent since v5 #4 | Use SFSelectGroup with SFSelectLabel for each section in the mobile dropdown |
| 5 | PERF | quick-fix | vhs-overlay.tsx:31-126 | 3-4 GSAP timelines run perpetually on every page (scanline 14s, slow scanline 84s, noise flicker 0.5s, burst/glitch schedulers). No Page Visibility API pause — animations continue running when tab is backgrounded, wasting CPU/GPU | Add `document.addEventListener("visibilitychange", ...)` to pause/resume GSAP timelines when tab is hidden |
| 6 | A11Y | quick-fix | dual-layer.tsx:28 | FRAME tags use `sf-pressable` class (active:scale transform) on plain `<span>` elements. Behavioral signals suggest interactivity that doesn't exist. Keyboard/screen reader users cannot perceive or activate the effect | Remove `sf-pressable` from non-interactive tags; keep `hover:border-2` for visual texture without implying clickability |
| 7 | VH | quick-fix | globals.css:138-140 + multiple components | Border tokens defined (`--border-element: 2px`, `--border-divider: 3px`, `--border-section: 4px`) but components still use hardcoded `border-2`, `border-[3px]`, `border-b-4`. Tokens exist but aren't consumed | Create `.sf-border-element`, `.sf-border-divider`, `.sf-border-section` utility classes, or migrate to `border-[var(--border-section)]` |
| 8 | A11Y | quick-fix | api-explorer.tsx:414-416 | Scroll progress bar in center panel uses fixed pixel offsets and lacks ARIA semantics. Either needs `role="progressbar"` with `aria-valuenow` or `aria-hidden="true"` for decorative treatment | Add `aria-hidden="true"` since it's decorative, or add `role="progressbar"` with value attributes |

### Low (9)

| # | Group | Effort | Location | Issue | Suggestion |
|---|-------|--------|----------|-------|------------|
| 9 | VH | quick-fix | component-grid.tsx:293 vs components-explorer.tsx:461 | Aspect ratio split (1:1 vs 1.2) between homepage and explorer grids. Intentional design choice but undocumented | Add code comment documenting the intent, or define `--aspect-component-cell` token |
| 10 | VH | quick-fix | hero.tsx:20,41 + component-grid.tsx:205,221 | Decorative oklch values inline in SVG strokes and text shadows. Won't respond to theme changes | Migrate to CSS custom properties (e.g., `--sf-waveform-bg`, `--sf-text-shadow-light`) |
| 11 | CON | quick-fix | token-tabs.tsx:337 | Inline `fontFamily: 'JetBrains Mono', monospace` string instead of `var(--font-code)` token | Define `--font-code` in globals.css and reference via var() |
| 12 | CON | quick-fix | api-explorer.tsx:579 | Preview light theme background uses inline `oklch(0.97 0 0)` instead of a token | Add `--sf-preview-light-bg` token |
| 13 | ENG | quick-fix | api-explorer.tsx:320-328 | Dead variable `btn` in sidebar keyboard handler. Also uses rAF to query `aria-selected` which may not reflect new state in same tick | Remove dead variable; use ref callback or useEffect keyed on activeNav for focus management |
| 14 | ENG | quick-fix | nav.tsx:22-23 | `useScrambleText` accesses `window.matchMedia` and `window.innerWidth` in useEffect without SSR guard. Safe under `"use client"` but fragile if hook is extracted | Add `typeof window !== "undefined"` guard for future-proofing |
| 15 | PERF | moderate | api-explorer.tsx:151 + components-explorer.tsx:283 | Both lazy-import full gsap-plugins but only need subsets (api: SplitText+Flip, explorer: Flip only). Loads ~75KB when ~20KB would suffice | Create lightweight `gsap-flip.ts` and `gsap-api.ts` bundles with only needed plugins |
| 16 | VH | quick-fix | footer.tsx:22-80 | Footer grid uses `md:grid-cols-4 gap-8` with `mx-auto` centering on middle columns. At extreme widths (>1536px) column spacing becomes visually unbalanced | Use `grid-cols-[1fr_auto_auto_1fr]` or explicit `justify-self` for predictable layout |
| 17 | VH | quick-fix | globals.css:72-80 | Type scale tokens (`--text-xs` through `--text-4xl`) defined but never referenced by components. Headlines use ad-hoc `clamp()` and `text-[Npx]` | Gradually migrate headlines to reference type scale tokens |

---

## Summary of Remaining Debt

| Severity | Count | Key Themes |
|----------|-------|------------|
| Critical | 0 | -- |
| High | 0 | -- |
| Medium | 8 | Preview duplication (persistent), PageAnimations bundle, aria-expanded, mobile select grouping, VHS tab visibility, sf-pressable on non-interactive, border token adoption, scroll progress ARIA |
| Low | 9 | Aspect ratio docs, decorative oklch, font token, preview bg token, dead variable, SSR guard, plugin bundle splitting, footer layout, type scale adoption |

**Total: 17 findings** (up from 13 in v5 — new findings surfaced from deeper audit of VHS tab visibility, border token adoption, and type scale usage)

---

## Remediation Priority Recommendation

### Wave 1 (quick wins, 7 items)
- **#3** aria-expanded on token show/hide toggle
- **#4** SFSelectGroup in mobile API dropdown
- **#5** Page Visibility API for VHS overlay timelines
- **#6** Remove sf-pressable from non-interactive dual-layer tags
- **#8** Scroll progress bar aria-hidden
- **#13** Dead variable removal in api-explorer
- **#14** SSR guard in useScrambleText

### Wave 2 (moderate, 3 items)
- **#1** Shared preview component extraction
- **#2** PageAnimations conditional/split import
- **#15** Lightweight plugin bundles (gsap-flip.ts, gsap-api.ts)

### Wave 3 (token adoption, 2 items)
- **#7** Border token utility classes
- **#17** Type scale token adoption in headlines

### Defer / Accept (5 items)
- **#9** Aspect ratio documentation (intentional design)
- **#10** Decorative oklch tokenization (purely cosmetic)
- **#11** JetBrains Mono font token (minor)
- **#12** Preview light bg token (minor)
- **#16** Footer extreme-width alignment (edge case)

---

## Group Narratives

### Visual Hierarchy & Composition (91/100, -1 from v5)

The visual hierarchy remains strong across all 5 pages. The DU/TDR brutalist-flat aesthetic is fully realized — zero border-radius, industrial edges, halftone diamond clip-path, grain textures on yellow bands. Circuit dividers provide excellent visual rhythm. Type hierarchy is clear: Anton display for headlines, Electrolize for body/UI, JetBrains Mono for code. The token-tabs rework improved the color explorer UX substantially. However, two systemic gaps persist: border width tokens are defined but not consumed (components still use hardcoded Tailwind border classes), and the type scale tokens (`--text-xs` through `--text-4xl`) exist in globals.css but zero components reference them — all headlines use ad-hoc `clamp()`. These aren't regressions but represent unrealized design system potential. Footer column alignment at extreme widths and the undocumented aspect ratio split remain minor concerns.

### UX & Interaction (88/100, -1 from v5)

No UX regressions, but no progress on the two persistent gaps: 23/24 API reference items are "COMING SOON" placeholders (high discoverability of incomplete content), and component grid cells all link to /components rather than individual detail views. The "BROWSE COMPONENTS ABOVE · VIEW FULL API REFERENCE →" hint bar is accurate but doesn't enable direct component exploration. The mobile API dropdown still lacks section grouping (flat list vs desktop's sectioned sidebar). Command palette, mobile nav sheet close, and filter bar interactions all remain solid. The start page community marquee speed was corrected to match homepage (20s).

### Accessibility (86/100, -1 from v5)

Core a11y infrastructure is excellent: skip-to-content link, roving tabindex on component grid, full keyboard nav on API sidebar, `aria-current="page"`, `aria-hidden` on decorative elements, `role="status"` on loading state, `sr-only` alternative for marquee band, `lang` attributes on multilingual text, and comprehensive reduced-motion support. The `--sf-dim-text` bump to oklch(0.62) improves contrast. However, three persistent gaps remain: the token show/hide toggle still lacks `aria-expanded` (v4 #3), the `sf-pressable` class on non-interactive dual-layer tags still implies interactivity, and the scroll progress bar lacks explicit ARIA treatment. The dim-text contrast on light backgrounds has not been formally WCAG-tested.

### Consistency (93/100, +2 from v5)

Best improvement area this cycle. styled-jsx is now **fully eliminated** — zero `<style jsx>` tags in the codebase. All VHS overlay styles (160+ lines), marquee keyframes, and logo hover effects now live in globals.css. The MarqueeBand component is a server component (no `"use client"` needed). All text colors use semantic tokens (zero `text-white`/`text-black` instances). z-index is fully tokenized. `--color-primary` is used everywhere (zero hardcoded oklch in component logic). The GSAP import split (core vs plugins) is respected. The only consistency gaps are minor: a few decorative oklch values in SVG strokes and text shadows, inline fontFamily in token scale display, and the border token definitions that aren't consumed as utilities.

### Engineering Quality (87/100, -1 from v5)

Architecture remains clean: `gsap.context()` with `.revert()` cleanup in all animation components, proper listener cleanup arrays, no `hasRun` guard patterns, correct `"use client"` boundaries, `GlobalEffectsLazy` via `next/dynamic` with `ssr: false`. The gsap-plugins lazy-load pattern in both api-explorer and components-explorer is well-implemented. Server components are used for pages. However, PageAnimations still statically imports the full gsap-plugins bundle at module scope — this is the largest remaining engineering debt, affecting every page's initial bundle. A dead variable in the api-explorer sidebar keyboard handler and the fragile (but currently safe) window access pattern in useScrambleText are minor concerns. The two separate preview component sets remain the longest-standing duplication issue (since v3).

### Performance (82/100, -2 from v5)

styled-jsx runtime elimination (~3KB) and will-change removal are complete wins. Font loading uses `display: "swap"` on all three fonts. GlobalEffects is lazy-loaded. Hero mesh canvas pauses via IntersectionObserver. However, two concerns are newly emphasized: (1) the VHS overlay runs 3-4 GSAP timelines perpetually on every page with no Page Visibility API integration — when a user backgrounds the tab, these animations continue burning CPU/GPU cycles; (2) PageAnimations imports the full gsap-plugins bundle (~75KB) statically, loading SplitText, ScrambleText, DrawSVG, Flip, and CustomEase on every page regardless of whether that page uses any of them. The slow VHS scanline retains `blur(0.6px)` in its backdrop-filter, though this is lightweight. Both api-explorer and components-explorer lazy-import the full plugin suite when they only need subsets (Flip only, or Flip+SplitText).

---

## Architecture Notes

### Positive Patterns
- **Zero styled-jsx** — all component styles are Tailwind classes or globals.css custom properties. No runtime CSS injection
- **Server/client boundary discipline** — pages are server components; MarqueeBand converted to server component during migration
- **Token-driven design** — comprehensive token system (color, motion, z-index, border, layout) with dark mode switching
- **GSAP cleanup discipline** — every animation component uses gsap.context() with ctx.revert(), listener arrays with cleanup functions
- **Bundle awareness** — GSAP split (core vs plugins), dynamic imports for heavy modules, GlobalEffects lazy-loaded
- **Graceful degradation** — noscript styles, reduced-motion at CSS/GSAP/component levels, touch device detection
- **@source exclusion** — `.planning/` excluded from Tailwind scan to prevent phantom utility class generation

### Risk Areas
- **PageAnimations bundle** — static import loads ~75KB of GSAP plugins on every page. Largest remaining performance gap
- **VHS overlay battery drain** — 3-4 perpetual timelines with no tab visibility gating
- **Preview component duplication** — two separate sets since v3. Maintenance cost if previews change
- **23 placeholder API pages** — "COMING SOON" treatment is functional but represents incomplete content
- **Border/type tokens unused** — tokens defined but not consumed, creating a false sense of design system completeness

---

## v3 → v4 → v5 → v6 Trajectory

| Metric | v3 | v4 | v5 | v6 | Trend |
|--------|----|----|----|----|-------|
| Composite Score | 66 | 81 | 88 | 88 | Plateau (polish phase) |
| Critical Findings | 6 | 0 | 0 | 0 | Resolved |
| High Findings | 12 | 5 | 0 | 0 | Resolved |
| Medium Findings | 20 | 12 | 6 | 8 | +2 (deeper audit) |
| Low Findings | 15 | 6 | 7 | 9 | +2 (deeper audit) |
| Total Findings | 53 | 23 | 13 | 17 | +4 (new areas surfaced) |
| styled-jsx | 5 components | 3 components | 0 | 0 | Eliminated |
| Hardcoded oklch (code) | 20+ | 1 | 0 | 0 | Eliminated |
| Bundle /components | ~211KB | ~211KB | ~143KB | ~143KB | Stable |
| a11y: Semantic tables | 0/7 | 7/7 | 7/7 | 7/7 | Complete |
| a11y: Keyboard nav | 1/3 grids | 3/3 grids | 3/3 grids | 3/3 grids | Complete |
| Consistency: styled-jsx | 5 files | 3 files | 0 files | 0 files | Complete |
| Consistency: z-index tokens | 0% | 80% | 100% | 100% | Complete |

---

## Score Justification

### Visual Hierarchy (91): -9 for
- (-3) Border tokens defined but not consumed as utilities
- (-2) Type scale tokens defined but unused by components
- (-2) Footer column alignment drift at extreme widths
- (-1) Aspect ratio split undocumented
- (-1) Decorative oklch in SVG strokes not theme-aware

### UX & Interaction (88): -12 for
- (-4) 23/24 API items are placeholders
- (-3) Mobile API dropdown lacks section grouping
- (-2) Component grid cells don't navigate to individual detail pages
- (-2) sf-pressable on non-interactive tags suggests clickability
- (-1) HUD telemetry not labeled as simulated

### Accessibility (86): -14 for
- (-3) Show/hide toggle missing aria-expanded (persistent)
- (-3) Scroll progress bar lacks ARIA treatment
- (-2) sf-pressable on non-interactive elements misleading
- (-2) --sf-dim-text contrast unverified on light backgrounds
- (-2) Color swatches have role="img" but no keyboard access (can't tab to swatches)
- (-1) Footer copy button feedback only visual — no aria-live announcement
- (-1) Motion token preview cells have aria-label on td rather than discoverable pattern

### Consistency (93): -7 for
- (-2) Two separate preview component implementations
- (-2) Decorative oklch values in SVG strokes and text shadows
- (-1) Inline fontFamily in token scale display
- (-1) border-foreground/20 vs --sf-subtle-border
- (-1) Preview light bg inline oklch

### Engineering (87): -13 for
- (-4) Preview component duplication (long-standing)
- (-3) PageAnimations statically imports full gsap-plugins
- (-2) Dead variable in api-explorer sidebar keyboard handler
- (-2) useScrambleText lacks SSR guard (safe but fragile)
- (-1) Both lazy importers load full plugin suite when subsets would suffice
- (-1) Inconsistent import granularity (some components import specific exports, others import entire modules)

### Performance (82): -18 for
- (-6) PageAnimations loads full gsap-plugins on every route
- (-4) VHS overlay runs 3-4 timelines perpetually with no Page Visibility pause
- (-3) Both lazy importers load full suite when subsets suffice (~55KB waste per page)
- (-2) VHS slow scanline retains blur(0.6px) in backdrop-filter
- (-2) Hero mesh document.mousemove listener runs on every mouse move even when canvas is offscreen (RAF stops but listener fires)
- (-1) Manifesto band scroll handler on window (lightweight but always attached)

---

*Generated by PDE-OS /pde:critique (CRT) | 2026-04-01 | Mode: full | Groups: Visual Hierarchy, UX, Accessibility, Consistency, Engineering, Performance*
*Scope: Full implementation — 5 pages, layout, 8+ block components, nav, footer, global effects, animation system*
*Previous: CRT-critique-v5.md (implementation, 2026-04-01, scored 88/100 B+)*
*Files examined: 50+ source files (13 app/, 18 blocks+layout, 6 animation, 4 lib/, 7 SF wrappers + misc)*
