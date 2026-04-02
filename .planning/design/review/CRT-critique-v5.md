---
Generated: "2026-04-01"
Skill: /pde:critique (CRT)
Version: v5
Status: draft
Mode: "full"
Groups Evaluated: "Visual Hierarchy, UX & Interaction, Accessibility, Consistency, Engineering, Performance"
Enhanced By: "4-wave iterate cycle (18/23 v4 findings resolved), Wave 1 a11y polish, styled-jsx elimination"
---

# Critique Report: SignalframeUX Implementation v5

---

## Summary Scorecard

| Group | Score | Weight | Weighted |
|-------|-------|--------|----------|
| Visual Hierarchy & Composition | 92/100 | 1.5x | 138 |
| UX & Interaction | 89/100 | 1.5x | 133.5 |
| Accessibility | 87/100 | 2.0x | 174 |
| Consistency | 91/100 | 1.0x | 91 |
| Engineering Quality | 88/100 | 1.0x | 88 |
| Performance | 84/100 | 1.0x | 84 |
| **Composite** | | | **88/100** |

**Overall:** B+ | 88/100 | Strong improvement from v4 (81 -> 88). 18/23 v4 findings resolved across 4 iterate waves. Zero critical findings. Zero high findings. Remaining debt is medium/low severity — mostly polish-level items and deferred-by-design choices.

---

## Delta from v4

| Group | v4 | v5 | Delta | Notes |
|-------|----|----|-------|-------|
| Visual Hierarchy | 88 | 92 | +4 | will-change removal cleans up compositor, no new VH debt introduced |
| UX & Interaction | 82 | 89 | +7 | Explorer hint bar rewritten, API placeholder upgraded with COMING SOON badge + prominent CTA |
| Accessibility | 78 | 87 | +9 | Marquee sr-only + aria-hidden, color swatches role="img" + aria-label, code pre aria-label, loading role="status" |
| Consistency | 84 | 91 | +7 | Last hardcoded oklch removed, z-50 tokenized, text-white replaced, darkText hook removed, styled-jsx fully eliminated |
| Engineering | 80 | 88 | +8 | styled-jsx runtime eliminated (~3KB), gsap-plugins lazy-loaded in components-explorer, darkText dead code removed |
| Performance | 76 | 84 | +8 | styled-jsx runtime gone, will-change removed from comp-cells, VHS backdrop-filter blur removed, /components bundle -32% |

---

## Resolved from v4

| v4 # | Finding | Resolution | Verified |
|-------|---------|------------|----------|
| 1 | Three components use styled-jsx runtime (~3KB) | ALL styled-jsx removed from nav LogoMark, vhs-overlay, marquee-band. CSS moved to globals.css. MarqueeBand is now a server component | yes |
| 2 | Explorer hint bar says "CLICK ANY COMPONENT" but cells don't navigate | Text changed to "BROWSE COMPONENTS ABOVE . VIEW FULL API REFERENCE ->" with link to /reference | yes |
| 3 | Marquee band exposes duplicate text to screen readers | `aria-hidden="true"` on scrolling container, `<span className="sr-only">` with single-read alternative | yes |
| 4 | Non-button API pages show weak placeholder | "COMING SOON" SFBadge + prominent "VIEW BUTTON REFERENCE ->" SFButton CTA | yes |
| 5 | Last hardcoded oklch(0.65 0.29 350) in api-explorer | Preview theme FRAME background now uses `var(--color-primary)` | yes |
| 8 | Color swatches have no keyboard access / screen reader info | `role="img"` with `aria-label` containing scale name, step, and OKLCH string on each swatch | yes |
| 10 | Code section pre has no accessible label | `aria-label="API initialization code example"` on `<pre>` element | yes |
| 11 | Nav uses z-50 instead of z-[var(--z-nav)] | Changed to `z-[var(--z-nav)]` matching the token system | yes |
| 12 | Two text-white instances in components-explorer preview | PreviewTabs active tab uses `text-background`, PreviewBadge uses `text-primary-foreground` | yes |
| 14 | darkText scramble hook computes unused value | Hook removed, static "DARK" string used in aria-hidden span | yes |
| 16 | Permanent will-change: transform on comp-cells | Removed entirely; CSS transition handles the lightweight transform | yes |
| 17 | VHS scanline backdrop-filter includes blur(1.2px) | `blur()` removed, keeping only `contrast(1.15) saturate(1.35) brightness(1.06)` | yes |
| 19 | Raw oklch(0.985_0_0) in api-explorer aside | Aside uses `text-primary-foreground` semantic token | yes |
| 20 | Redundant dark:text-foreground/10 on start page SF watermark | `dark:` variant removed; `text-background/10` works in both modes | yes |
| 21 | Static import of gsap-plugins in components-explorer | Changed to `import("@/lib/gsap-plugins")` dynamic import inside useEffect | yes |
| 22 | Loading state has no role="status" or aria-live | `role="status"` and `aria-live="polite"` added to loading container | yes |

**V4 findings intentionally NOT addressed (5 items):**

| v4 # | Finding | Disposition |
|-------|---------|-------------|
| 6 | Marquee keyframe in token-tabs vs globals.css | Both use `sf-marquee-scroll` from globals.css now; token-tabs references it inline via style attribute. Low impact, accepted |
| 7 | Component grid aspect ratio split (1:1 vs 1.2) | Intentional design choice: homepage uses 1:1 (square thumbnails for compact grid), explorer uses 1.2 (taller cells for more preview detail) |
| 9 | Non-interactive tag hover in dual-layer | Intentional micro-interaction. FRAME tags have `sf-pressable` + `hover:border-2` for tactile feel. SIGNAL tags are static. Design choice |
| 15 | LiveClock RAF optimization | RAF only runs during digit transitions (1s interval starts scramble, RAF runs ~28 frames then stops). Nav is fixed and always visible. Accepted risk |
| 18 | Year hydration edge case (footer) | Footer is a client component using `new Date().getFullYear()`. Theoretical risk at year boundary. Accepted |
| 23 | Stats band mobile border doubling | Low visual impact at 2-col boundary. Accepted |

---

## New Findings by Priority

### Critical (0)

No critical findings. All v3 and v4 criticals resolved.

### High (0)

No high findings. All v4 highs resolved.

### Medium (6)

| # | Group | Effort | Location | Issue | Suggestion |
|---|-------|--------|----------|-------|------------|
| 1 | ENG | moderate | component-grid.tsx + components-explorer.tsx | Two separate sets of preview components (12 in component-grid, 16 in components-explorer) with different implementations for identical conceptual items. This was v3 #42 and v4 #13, still open. component-grid uses live SF primitives (SFButton, SFCard, etc.) while components-explorer uses CSS-only span/div approximations. The divergence creates maintenance risk — updating a preview in one requires remembering to update the other | Extract shared preview components to `components/blocks/previews/` module. Each preview can accept a `mode: "full" | "compact"` prop to handle the two contexts |
| 2 | A11Y | quick-fix | dual-layer.tsx:23-28 | FRAME tags use `sf-pressable` class which adds hover transform and active scale — behavioral signals that suggest interactivity. Tags are plain `<span>` elements with `cursor-default`. This creates a discoverability problem for keyboard and screen reader users who cannot perceive the hover effect and may expect interaction. This is v4 #9, acknowledged as intentional, but the sf-pressable class specifically triggers active:scale which is misleading | Remove `sf-pressable` from the FRAME tags (keep `cursor-default` and `hover:border-2` for visual texture). The hover border expansion alone communicates surface response without implying clickability |
| 3 | A11Y | quick-fix | token-tabs.tsx:232-237 | "SHOW ALL 49" / "SHOW CORE" toggle button is a raw `<button>` with `sf-pressable` class but no `aria-expanded` or `aria-controls` attribute. Screen readers cannot determine the button's expanded state or which content it controls | Add `aria-expanded={showAll}` and `aria-controls="color-scale-grid"` to the button, and `id="color-scale-grid"` to the scale container |
| 4 | UX | quick-fix | api-explorer.tsx:352-367 | Mobile SFSelect dropdown lists all 24 items flat (e.g., "CORE / createSignalframeUX", "COMPONENTS / Button") but does not visually group them by section. The desktop sidebar has clear section headings. On mobile, the flat list makes it harder to scan and locate items | Use `SFSelectGroup` with `SFSelectLabel` for each section title within the mobile dropdown to mirror the desktop sidebar structure |
| 5 | VH | quick-fix | start/page.tsx:350 | Start page community band marquee uses inline `style={{ animation: "sf-marquee-scroll 12s linear infinite" }}` while the MarqueeBand component on homepage uses the `.animate-marquee` class (20s duration). The 12s speed on start page feels rushed compared to the 20s homepage marquee, creating inconsistent motion pacing | Either use the `.animate-marquee` class for both (20s), or define a second speed token `--marquee-speed-fast: 12s` for intentional variation |
| 6 | PERF | moderate | page-animations.tsx:4 | PageAnimations statically imports `gsap-plugins.ts` (full suite: SplitText, ScrambleText, DrawSVG, Flip, CustomEase) at module scope. This means the full plugin bundle loads on EVERY page regardless of whether that page uses SplitText or DrawSVG. Only the homepage and /reference page use these plugins. /tokens, /components (which lazy-loads its own copy), and /start don't need them at all | Conditionally import gsap-plugins in PageAnimations: check if homepage-specific animation targets exist (e.g., `[data-anim='hero-title']`) before importing. Or split PageAnimations into route-specific modules loaded via Next.js dynamic imports |

### Low (7)

| # | Group | Effort | Location | Issue | Suggestion |
|---|-------|--------|----------|-------|------------|
| 7 | A11Y | quick-fix | hero.tsx:41 | `textShadow` on h1 uses inline oklch values: `oklch(1 0 0 / 0.05)` and `oklch(0 0 0 / 0.3)`. These are decorative and don't affect readability, but should use token references for consistency (e.g., `oklch(var(--color-background) / 0.05)` or define `--sf-text-shadow-light` / `--sf-text-shadow-dark`) | Minor — define shadow tokens or leave as-is since textShadow is purely decorative |
| 8 | CON | quick-fix | component-grid.tsx:206 | Waveform preview SVG uses hardcoded `stroke="oklch(0.25 0.05 350)"` and `stroke="oklch(0.45 0.15 350)"` for background wave and harmonic overlay. These don't use CSS custom properties and won't respond to theme changes | Replace with `stroke="var(--color-primary)"` at reduced opacity, or define `--sf-wave-bg` and `--sf-wave-harmonic` tokens |
| 9 | CON | quick-fix | component-grid.tsx:490 | `border-foreground/20` on preview cell borders uses Tailwind opacity modifier on the foreground token. While functional, other border opacity patterns in the codebase use `var(--sf-subtle-border)`. Minor inconsistency | Replace with `border-[var(--sf-subtle-border)]` for consistency |
| 10 | ENG | quick-fix | nav.tsx:22-23 | `useScrambleText` accesses `window.matchMedia` and `window.innerWidth` directly in useEffect without a guard for SSR. The `"use client"` directive makes this safe in Next.js App Router, but it's a fragile pattern — if the hook were ever extracted to a shared utility, it would break in SSR contexts | Wrap the window checks in a `typeof window !== "undefined"` guard for future-proofing |
| 11 | A11Y | quick-fix | api-explorer.tsx:414-416 | Scroll progress bar in the center panel uses `fixed` positioning with hardcoded pixel offsets (`left: 240px, right: 383px`). On zoom or text scaling, these values may not align with the actual panel boundaries. The bar also lacks `role="progressbar"` and `aria-valuenow` | Add `role="progressbar"` with `aria-valuenow={Math.round(scrollProgress * 100)}` and `aria-label="Reading progress"`, or keep it decorative with `aria-hidden="true"` |
| 12 | VH | quick-fix | footer.tsx:40, 52 | Footer link columns use `mx-auto` for centering, which works but creates inconsistent alignment when the viewport is wide. The DOCS and RESOURCES columns float toward center while INSTALL stays right-aligned. On very wide screens (>1536px) the gap becomes visually unbalanced | Consider `md:grid-cols-[1fr_auto_auto_1fr]` or explicit `justify-self` for more predictable footer layout |
| 13 | ENG | quick-fix | api-explorer.tsx:320-328 | Sidebar keyboard navigation uses `requestAnimationFrame` to focus the newly active button after state update, but queries `button[aria-selected="true"]` which may not yet reflect the new state in the same rAF tick. There is also a dead variable `btn` (line 321) that is assigned but never used | Remove the dead `btn` variable. Consider using a ref callback or `useEffect` keyed on `activeNav` for more reliable focus management |

---

## Summary of Remaining Debt

| Severity | Count | Key Themes |
|----------|-------|------------|
| Critical | 0 | -- |
| High | 0 | -- |
| Medium | 6 | Shared preview extraction (long-standing), sf-pressable on non-interactive tags, ARIA expansion state, mobile select grouping, marquee speed inconsistency, PageAnimations bundle |
| Low | 7 | Decorative oklch in textShadow/SVG, border token consistency, SSR guard, scroll progress a11y, footer layout, dead variable |

**Total: 13 findings** (down from 23 in v4, 53 in v3)

---

## Remediation Priority Recommendation

### Wave 1 (quick wins, 6 items)
- **#3** aria-expanded on token show/hide toggle
- **#4** SFSelectGroup in mobile API dropdown
- **#5** Marquee speed consistency on start page
- **#11** Scroll progress bar aria-hidden or role="progressbar"
- **#13** Dead variable removal + focus management cleanup
- **#8** Hardcoded oklch in waveform SVG

### Wave 2 (moderate, 2 items)
- **#1** Shared preview component extraction
- **#6** PageAnimations conditional/split import

### Defer / Accept (5 items)
- **#2** sf-pressable on dual-layer tags (intentional design choice, low a11y impact)
- **#7** textShadow oklch tokens (purely decorative)
- **#9** border-foreground/20 consistency (functional, minor)
- **#10** SSR guard in useScrambleText (safe in current architecture)
- **#12** Footer column alignment (acceptable at current viewport range)

---

## Group Narratives

### Visual Hierarchy & Composition (92/100, +4 from v4)

The visual hierarchy is strong and deliberate across all 5 pages. The removal of permanent `will-change: transform` on component grid cells eliminates compositor layer pollution without affecting the hover transition quality. Page headers are consistent: all use the two-column grid pattern with `sf-display` headline left and metadata right, unified by `border-b-4`. The DU/TDR brutalist-flat aesthetic is fully realized — zero border-radius, industrial edges, halftone diamond clip-path, grain textures on yellow bands. The circuit dividers (3 variants: default, complex, minimal) provide excellent visual rhythm between homepage sections. Type hierarchy is clear: Anton display for headlines, Electrolize for body/UI, JetBrains Mono for code. The only remaining VH concerns are minor: start page marquee speed mismatch (12s vs 20s), and footer column spacing at extreme widths.

### UX & Interaction (89/100, +7 from v4)

The iterate cycle resolved the two most impactful UX issues. The components explorer hint bar now accurately describes behavior ("BROWSE COMPONENTS ABOVE . VIEW FULL API REFERENCE ->") with a direct link to /reference. The API explorer placeholder pages now feature a prominent "COMING SOON" badge and a "VIEW BUTTON REFERENCE ->" CTA button, making the one complete documentation page discoverable. The command palette (Cmd+K) remains well-implemented with navigation, theme toggle, and scroll-to-top. Component grid cells on the homepage are `<Link>` elements to /components with hover and focus states. The filter bar with sliding indicator and debounced search on /components is smooth. The mobile nav sheet closes on link click. The mobile API dropdown works but would benefit from section grouping (finding #4). Overall, the interaction model is coherent: browse components -> explore in grid -> read API reference.

### Accessibility (87/100, +9 from v4)

Significant a11y gains from Wave 1 quick fixes. The marquee band now has proper `aria-hidden="true"` on the scrolling container with a `<span className="sr-only">` providing the text once for screen readers. Color swatches gained `role="img"` with `aria-label` containing the full OKLCH string (e.g., "SIGNAL 500: oklch(0.60 0.28 350)"). The code section `<pre>` has `aria-label="API initialization code example"`. The loading state has `role="status"` and `aria-live="polite"`. All token tables remain semantic `<table>` elements with `<thead>/<th scope="col">`. The component grid uses `role="grid"` with roving tabindex and arrow key navigation. `lang` attributes are correct on multilingual hero text. Focus management is solid: skip-to-content link, visible focus rings on grid cells, `aria-current="page"` on active nav links. Remaining a11y gaps are low severity: the show/hide toggle lacks `aria-expanded`, the scroll progress bar could use `aria-hidden`, and the `sf-pressable` class on non-interactive tags is misleading but not a blocker.

### Consistency (91/100, +7 from v4)

The token system is now highly consistent. The last hardcoded `oklch(0.65 0.29 350)` was replaced with `var(--color-primary)`. The nav z-index uses `z-[var(--z-nav)]` instead of Tailwind's `z-50`. The two `text-white` instances in components-explorer previews were replaced with semantic `text-background` and `text-primary-foreground`. The `darkText` scramble hook (dead code) was removed, replaced with a static "DARK" string. With styled-jsx fully eliminated, all component styles flow through either Tailwind classes or globals.css custom properties — no more runtime CSS injection. The border width scale (`--border-element: 2px`, `--border-divider: 3px`, `--border-section: 4px`) is used throughout. The `sf-display` utility class is universal for display type. `SharedCodeBlock` is used consistently. Remaining inconsistencies are minor: a few hardcoded oklch values in decorative SVG strokes (waveform preview), and one `border-foreground/20` where `--sf-subtle-border` would be more consistent.

### Engineering Quality (88/100, +8 from v4)

The styled-jsx runtime (~3KB) is fully eliminated. All three components that used it (nav LogoMark hover effects, VHS overlay layers, marquee-band keyframes) now have their CSS in globals.css. The MarqueeBand component is a server component — no `"use client"` directive needed. The gsap-plugins bundle is lazy-loaded in both components-explorer and api-explorer via dynamic `import()`. GSAP cleanup is consistent: `gsap.context()` with `.revert()` in all animation components, click listeners tracked and removed, timeouts and intervals cleared. The Lenis provider correctly syncs with GSAP ScrollTrigger and uses `lagSmoothing(500, 33)`. The module-scope `initReducedMotion()` is guarded with `motionInitialized` flag. Server/client boundaries are clean: pages are server components, interactive blocks use `"use client"`. Remaining debt: two separate preview component sets (persistent since v3), PageAnimations imports full gsap-plugins statically (should be conditional), and one dead variable in sidebar keyboard navigation.

### Performance (84/100, +8 from v4)

The 4-wave iterate cycle delivered measurable improvements. The styled-jsx runtime elimination removes ~3KB from the bundle. The /components page dropped from 211KB to 143KB (-32%) via lazy-loaded gsap-plugins. The permanent `will-change: transform` on 12+ component grid cells is gone, freeing compositor layers. The VHS scanline `backdrop-filter` no longer includes `blur()`, reducing GPU composite cost. GlobalEffects remains lazy-loaded via `next/dynamic` with `ssr: false`. Hero mesh canvas pauses via IntersectionObserver when offscreen. All three fonts use `display: "swap"`. The GSAP bundle split (gsap-core.ts ~8KB vs gsap-plugins.ts full suite) ensures lighter pages load only core. The LiveClock RAF loop only runs during scramble transitions (~28 frames per second change), then stops. Remaining performance concern: PageAnimations imports the full gsap-plugins bundle statically for all pages, even those that don't use SplitText/ScrambleText/DrawSVG. Splitting this by route would further reduce first-load JS on /tokens and /start.

---

## Architecture Notes

### Positive Patterns
- **Server/client boundary discipline**: Pages are server components; `"use client"` is isolated to block components and providers. MarqueeBand was converted to a server component during styled-jsx elimination
- **Token-driven design**: globals.css provides comprehensive token system (color, motion, z-index, border, layout) with dark mode switching via `.dark` class
- **Graceful degradation**: `<noscript>` styles reveal hidden content, reduced-motion is respected at CSS, GSAP, and component levels. VHS overlay and custom cursor hidden on touch devices and reduced-motion
- **GSAP cleanup discipline**: Every animation component uses `gsap.context()` with `ctx.revert()`, listener arrays with cleanup functions
- **Bundle awareness**: GSAP split (core vs plugins), dynamic imports for heavy modules, GlobalEffects lazy-loaded
- **Skip link + keyboard nav**: Skip-to-content with z-[var(--z-skip)], roving tabindex on component grid, arrow/home/end on API sidebar
- **Metadata completeness**: OG/Twitter card metadata on all pages, route-level layouts with per-page metadata

### Risk Areas
- **PageAnimations bundle**: Static import of gsap-plugins means the full suite loads on every page. This is the largest remaining performance gap
- **Preview component duplication**: Two separate sets (component-grid.tsx + components-explorer.tsx) — maintenance cost if previews change
- **23 placeholder API pages**: "COMING SOON" treatment is improved but still represents incomplete content. Users exploring the API reference will encounter 23 placeholder pages vs 1 complete page
- **VHS overlay GPU cost**: Even with blur removed, backdrop-filter + noise + scanline + glitch layers compound on desktop. Users on older/integrated GPUs may experience frame drops during glitch bursts

---

## v3 -> v4 -> v5 Trajectory

| Metric | v3 | v4 | v5 | Trend |
|--------|----|----|----| |
| Composite Score | 66 | 81 | 88 | +22 total |
| Critical Findings | 6 | 0 | 0 | Resolved |
| High Findings | 12 | 5 | 0 | Resolved |
| Medium Findings | 20 | 12 | 6 | -70% |
| Low Findings | 15 | 6 | 7 | Stable |
| Total Findings | 53 | 23 | 13 | -75% |
| styled-jsx | 5 components | 3 components | 0 | Eliminated |
| Hardcoded oklch | 20+ | 1 | 0 (code) | Eliminated |
| Bundle /components | ~211KB | ~211KB | ~143KB | -32% |
| a11y: Semantic tables | 0/7 | 7/7 | 7/7 | Complete |
| a11y: Keyboard nav | 1/3 grids | 3/3 grids | 3/3 grids | Complete |

---

## Score Justification

### Visual Hierarchy (92): -8 for
- (-3) Marquee speed inconsistency between homepage and start page
- (-2) Footer column alignment drift at extreme widths
- (-2) Start page step numbers have large clamp range (24px-48px) that could overwhelm content at mid-widths
- (-1) Component grid aspect ratio split not documented in code comments

### UX & Interaction (89): -11 for
- (-4) 23/24 API items are placeholders — high discoverability of empty content
- (-3) Mobile API dropdown lacks section grouping
- (-2) Component grid cells don't navigate to individual component detail pages (they all link to /components)
- (-2) sf-pressable on non-interactive tags suggests clickability

### Accessibility (87): -13 for
- (-3) Show/hide toggle missing aria-expanded
- (-3) Scroll progress bar lacks proper ARIA role
- (-2) sf-pressable hover animation on non-interactive elements
- (-2) Color swatches have role="img" with aria-label but no keyboard access (can't tab to individual swatches)
- (-2) Motion token animation preview cells have aria-label on td rather than a more discoverable pattern
- (-1) Footer "COPY" button feedback ("COPIED") is only visual — no aria-live announcement

### Consistency (91): -9 for
- (-3) Two separate preview component implementations
- (-2) Hardcoded oklch values in waveform SVG strokes
- (-2) Marquee animation speed inconsistency (12s vs 20s)
- (-1) border-foreground/20 vs --sf-subtle-border
- (-1) textShadow inline oklch values

### Engineering (88): -12 for
- (-4) Preview component duplication (long-standing, moderate maintenance risk)
- (-3) PageAnimations statically imports full gsap-plugins for all routes
- (-2) Dead variable in api-explorer sidebar keyboard handler
- (-2) useScrambleText lacks SSR guard (safe but fragile)
- (-1) Inconsistent import paths: some components import from gsap-core, others from gsap-plugins

### Performance (84): -16 for
- (-6) PageAnimations loads full gsap-plugins on every route
- (-4) VHS overlay runs 5+ GSAP timelines continuously on desktop (scanline travel, noise flicker, burst scheduler, glitch scheduler)
- (-3) LiveClock component runs on all pages (even /tokens, /start) where it's hidden below sm breakpoint but still executing
- (-2) Hero mesh canvas listener on `document` mousemove (runs on every mouse move even when canvas is offscreen, though RAF stops)
- (-1) Manifesto band scroll handler attached to `window` scroll (runs on all scrolls, though it's lightweight)

---

*Generated by PDE-OS /pde:critique (CRT) | 2026-04-01 | Mode: full | Groups: Visual Hierarchy, UX, Accessibility, Consistency, Engineering, Performance*
*Scope: Full implementation -- 5 pages, layout, 8+ block components, nav, footer, global effects, animation system*
*Previous: CRT-critique-v4.md (implementation, 2026-04-01, scored 81/100 B)*
*Files examined: 48 source files (13 app/, 18 blocks+layout, 6 animation, 4 lib/, 7 SF wrappers + misc)*
