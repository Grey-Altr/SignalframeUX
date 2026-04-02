---
Generated: "2026-04-01"
Skill: /pde:critique (CRT)
Version: v3
Status: draft
Mode: "full"
Groups Evaluated: "Visual Hierarchy, UX & Interaction, Accessibility, Consistency, Engineering, Performance"
Enhanced By: "none"
---

# Critique Report: SignalframeUX Implementation v3

---

## Summary Scorecard

| Group | Score | Weight | Weighted |
|-------|-------|--------|----------|
| Visual Hierarchy & Composition | 78/100 | 1.5x | 117 |
| UX & Interaction | 68/100 | 1.5x | 102 |
| Accessibility | 58/100 | 2.0x | 116 |
| Consistency | 72/100 | 1.0x | 72 |
| Engineering Quality | 62/100 | 1.0x | 62 |
| Performance | 62/100 | 1.0x | 62 |
| **Composite** | | | **66/100** |

**Overall:** C+ | 66/100 | V2 fixes resolved surface issues; v3 exposes deeper structural, a11y, and perf debt

---

## Delta from v2

| Group | v2 | v3 | Delta | Notes |
|-------|----|----|-------|-------|
| Visual Hierarchy | 88 | 78 | -10 | Deeper scrutiny: type scale unused, API page missing header, border weight inconsistency |
| UX & Interaction | 72 | 68 | -4 | Mobile nav sheet, dead click handlers, non-functional buttons surfaced |
| Accessibility | 65 | 58 | -7 | lang attributes, keyboard navigation, screen reader scramble text newly identified |
| Consistency | 82 | 72 | -10 | Hardcoded oklch primary color (20+ instances), z-index chaos, duplicate CodeBlock |
| Engineering | 78 | 62 | -16 | Memory leaks, SSR risks, hasRun guard, wordIndices re-creation per render |
| Performance | 70 | 62 | -8 | Monolithic GSAP bundle, perpetual RAF loops, GlobalEffects on every route |

---

## Findings by Priority

### Critical (10)

| # | Group | Effort | Location | Issue | Suggestion |
|---|-------|--------|----------|-------|------------|
| 1 | A11Y | moderate | hero.tsx:53-66 | Multilingual text missing `lang="ja"`, `lang="fa"`, `lang="zh"` — screen readers mangle all three scripts with English phonetics (WCAG 3.1.2 AA) | Add `lang` attribute to each multilingual `<p>` element |
| 2 | A11Y | moderate | components-explorer.tsx grid | Div-based component cards have `cursor-pointer` but zero keyboard access — cannot tab, focus, or activate any of the 36 cards | Make cards focusable `<button>` or `<a>` elements, or add `tabIndex={0}` + `onKeyDown` |
| 3 | A11Y | moderate | api-explorer.tsx sidebar | No keyboard arrow-key navigation, no `aria-selected` on active item | Add focus management and `aria-selected` to sidebar buttons |
| 4 | UX | quick-fix | nav.tsx:529-542 | Mobile nav sheet does not close on link click — sheet stays open obscuring the new page | Add `onOpenChange` handler or wrap links with sheet close trigger |
| 5 | UX | quick-fix | component-grid.tsx:289 | 12 component cells have `cursor-pointer` + hover styles but zero click handlers — dead interactions | Either add `onClick` navigation to `/components` or remove `cursor-pointer` |
| 6 | UX | quick-fix | components-explorer.tsx | Cards promise interaction ("CLICK ANY COMPONENT...") that doesn't exist | Wire up click to navigate to detail, or remove the label |
| 7 | ENG | moderate | lib/gsap-plugins.ts:30-40 | Module-scope `window` and `matchMedia` access — leaks a listener and risks SSR breakage | Move to a `useEffect` in a dedicated init component |
| 8 | ENG | quick-fix | page-animations.tsx:214-222 | Vanilla `addEventListener("click")` inside `gsap.context()` never cleaned up — accumulates on HMR | Return cleanup function that removes click listeners |
| 9 | VH | moderate | app/reference/page.tsx:15 | API Reference page has no page header — only page without a title band, breaks consistent pattern | Add full-width header band matching other pages |
| 10 | PERF | significant | lib/gsap-plugins.ts | Monolithic GSAP bundle — all 6 plugins loaded on every route | Split into per-feature entry points, lazy-load per route |

### Major (20)

| # | Group | Effort | Location | Issue | Suggestion |
|---|-------|--------|----------|-------|------------|
| 11 | A11Y | quick-fix | hero.tsx:34-48 | "SIGNAL//FRAME" is a `<div>` — no `<h1>` in homepage document outline | Wrap in `<h1>` element |
| 12 | A11Y | quick-fix | nav.tsx LogoMark + NavLink | Scramble animation exposes garbage text ("!@#$%") to screen readers | Add `aria-label` to Link elements with target text |
| 13 | A11Y | quick-fix | components-explorer.tsx search | No `<label>` or `aria-label` on search input | Add `aria-label="Search components"` |
| 14 | A11Y | quick-fix | components-explorer.tsx filter | Toggle group has no `aria-pressed` semantics | Add `aria-pressed={active}` to each filter button |
| 15 | UX | moderate | api-explorer.tsx | Mobile has no sidebar navigation — `hidden md:block` with no alternative | Add mobile dropdown or tab bar replicating sidebar |
| 16 | UX | quick-fix | start/page.tsx:375-379 | "GITHUB" and "STORYBOOK" buttons in community band have no `onClick` or `href` | Wrap in `<Link>` or add href |
| 17 | UX | quick-fix | command-palette.tsx | GitHub link points to bare `github.com` | Update to `github.com/signalframeux` |
| 18 | CON | moderate | global-effects, nav, hero, component-grid | 20+ hardcoded `oklch(0.65 0.29 350)` instead of `var(--color-primary)` | Replace with CSS variable |
| 19 | CON | quick-fix | ~15 places across 10 files | Inline `fontFamily: "var(--font-anton)"` when `sf-display` class exists | Replace inline styles with class |
| 20 | CON | moderate | 5 files | No z-index token scale — values 50 to 10000 undocumented | Define `--z-nav`, `--z-overlay`, `--z-cursor`, `--z-modal` tokens |
| 21 | CON | quick-fix | api-explorer.tsx:282-286 | Hardcoded `text-white`, `text-black`, `bg-white` bypass OKLCH system | Use `text-background`, `text-foreground`, `bg-background` |
| 22 | CON | moderate | api-explorer.tsx + start/page.tsx | Two separate `CodeBlock` components with different shadows | Extract shared component |
| 23 | ENG | moderate | page-animations.tsx:11-15 | `hasRun` ref guard defeats StrictMode — kills animations in dev | Use gsap.context() cleanup instead |
| 24 | ENG | quick-fix | components-explorer.tsx:288 | `useLayoutEffect` emits SSR warning | Replace with `useEffect` |
| 25 | ENG | moderate | manifesto-band.tsx:86-131 | `wordIndices` recreated every render → scroll listeners re-subscribe | Memoize with `useMemo` or move outside component |
| 26 | VH | moderate | footer.tsx:18-23 | Footer text at 15-16px larger than body copy 13px — inverts hierarchy | Reduce to 11-12px |
| 27 | VH | quick-fix | hero.tsx:16 | Halftone circle uses `rounded-full` — violates zero border-radius | Replace with square pattern or diamond clip-path |
| 28 | VH | moderate | start/page.tsx:198-213 | Start hero identical to homepage hero — reduces page identity | Differentiate with yellow band or distinct treatment |
| 29 | PERF | moderate | app/layout.tsx:86 | GlobalEffects on every route — VHS overlay + cursor always mounted | Lazy-load with `next/dynamic` or scope per-route |
| 30 | PERF | moderate | hero-mesh.tsx | Hero canvas RAF never pauses offscreen — redraws ~500 nodes/frame | Add IntersectionObserver pause |

### Minor (15)

| # | Group | Effort | Location | Issue | Suggestion |
|---|-------|--------|----------|-------|------------|
| 31 | A11Y | quick-fix | global-effects.tsx VHS badge | Not `aria-hidden` — announced on every page | Add `aria-hidden="true"` |
| 32 | A11Y | quick-fix | footer.tsx COPY badge | Looks like button but is `<span>` | Make functional copy button or add `role="presentation"` |
| 33 | A11Y | quick-fix | stats-band.tsx | Infinity `∞` has no text alt | Add `aria-label="Infinite"` |
| 34 | UX | quick-fix | token-tabs.tsx mobile | Color tables overflow without scroll affordance | Add visible scroll indicators |
| 35 | UX | quick-fix | nav.tsx | Active state doesn't match sub-routes | Use `pathname.startsWith(href)` |
| 36 | VH | quick-fix | manifesto-band.tsx:154 | `py-10` fights `sf-yellow-band` padding | Tighten to `py-6` |
| 37 | VH | moderate | stats-band.tsx mobile | No vertical divider between 2-col cells | Add border-r to odd cells |
| 38 | VH | moderate | component-grid.tsx:278 | Grid `border-2` vs site `border-4` — mixed weight | Unify to 3px or 4px |
| 39 | VH | quick-fix | globals.css:68-69 | Type scale tokens defined but never referenced | Audit and adopt or add matching steps |
| 40 | CON | quick-fix | border widths | 2/3/4px mixed with no tokens | Define border-width scale |
| 41 | ENG | quick-fix | nav.tsx:278 | `darkText` scramble var computed but never rendered | Remove dead variable |
| 42 | ENG | moderate | component-grid + components-explorer | Duplicate preview component sets | Extract to shared module |
| 43 | PERF | quick-fix | nav.tsx | Five simultaneous `useScrambleText` intervals | Consolidate to single GSAP timeline |
| 44 | PERF | quick-fix | layout.tsx | Electrolize font missing `display: "swap"` | Add to font config |
| 45 | PERF | quick-fix | global-effects.tsx | Permanent `will-change` on cursor | Remove or scope dynamically |

### Nit (8)

| # | Group | Effort | Location | Issue | Suggestion |
|---|-------|--------|----------|-------|------------|
| 46 | VH | quick-fix | hero.tsx:44 | Three independent clamp ranges produce unpredictable relative sizing | Pin ratio with calc multiplier |
| 47 | VH | quick-fix | code-section.tsx:12 | `text-foreground/60` bypasses semantic token | Use `var(--sf-dim-text)` |
| 48 | VH | quick-fix | nav.tsx:496 | Nav `border-b-[3px]` thinner than content `border-b-4` | Match to `border-b-4` |
| 49 | VH | quick-fix | token-tabs.tsx:369 | Lock emoji breaks DU/TDR aesthetic | Replace with `[LOCKED]` or `//PENDING` |
| 50 | CON | quick-fix | global-effects.tsx:208 | VHS badge clamp has 1px range | Commit to fixed `text-[11px]` |
| 51 | CON | quick-fix | components-explorer vs component-grid | Different card aspect ratios (1.2 vs 1) | Standardize |
| 52 | PERF | quick-fix | hero.tsx, nav.tsx LogoMark | styled-jsx runtime loaded for 2 components | Migrate to globals.css |
| 53 | ENG | quick-fix | lenis-provider.tsx | `lagSmoothing(0)` disables GSAP frame-skip globally | Set reasonable threshold |

---

## Resolved from v2 (Cumulative)

| # | v2 Finding | Resolution | Verified |
|---|-----------|------------|----------|
| A11Y-01 (v2) | Global cursor:none breaks keyboard users | .sf-has-mouse pattern | yes |
| A11Y-02 (v2) | Nested nav landmarks | aria-label added, inner nav removed | yes |
| A11Y-04 (v2) | Farsi textAlign conflict | textAlign: "start" | yes |
| CON-01 (v2) | Nav height offset inconsistency | --nav-height CSS variable | yes |
| CON-02 (v2) | Hardcoded hex colors in code-section | Token vars | yes |
| CON-03 (v2) | Author name display | "Grey Altaer" correct | yes |
| ENG-01 (v2) | Dead ternaries | Removed | yes |
| ENG-02 (v2) | Keyframe in component | Moved to globals.css | yes |
| ENG-03 (v2) | DarkModeToggle SSR hydration | useState(false) | yes |
| ENG-04 (v2) | No OG/social meta | OG + Twitter cards added | yes |
| PERF-01 (v2) | Full-page client components | Server components + client islands | yes |
| PERF-02 (v2) | Search debounce missing | 150ms debounce | yes |
| UX-01 (v2) | Hero CTA DOM complexity | Pseudo-elements replace 4 spans | yes |
| UX-02 (v2) | API sidebar non-functional | Content reacts to activeNav | yes |
| UX-03 (v2) | Placeholder GitHub URLs | github.com/signalframeux | yes |
| UX-04 (v2) | VHS badge overlaps scroll-to-top | Badge moved to left-6 | yes |
| UX-05 (v2) | Empty token tabs no distinction | Lock icon + dimmed badge | yes |
| VH-01 (v2) | Stats band double borders | Only top row gets border on mobile | yes |

---

*Generated by PDE-OS /pde:critique (CRT) | 2026-04-01 | Mode: full | Groups: Visual Hierarchy, UX, Accessibility, Consistency, Engineering, Performance*
*Scope: Full implementation — 5 pages, layout, 8+ block components, nav, footer, global effects, animation system*
*Previous: CRT-critique-v2.md (implementation, 2026-04-01)*
