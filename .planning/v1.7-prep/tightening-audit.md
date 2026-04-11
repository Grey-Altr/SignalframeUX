# Tightening Audit — SF//UX v1.7 Prep

Tasks 5-9 from the v1.7 dispatch. Whitespace, borders, animation, color discipline, contrast.

---

## Task 5: Whitespace Audit

### Blessed Spacing Stops

Defined in `lib/tokens.css:155-166`:
```
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px
```

The `.planning/design/assets/tokens.css` has a richer set (includes 20, 28, 36, 40, 56, 80px plus semantic tokens) but the production `lib/tokens.css` deliberately omits those intermediate stops.

### SFSection Spacing Prop — Dead API Surface

`sf-section.tsx:7` accepts `spacing?: "8" | "12" | "16" | "24"` mapping to `py-{n}`. Default is `"16"` (64px).

**Every page overrides this with `className="py-0"`:**
- `app/page.tsx` — all SFSection instances use `py-0`
- `app/reference/page.tsx:20`, `app/system/page.tsx:26`, `app/inventory/page.tsx:38,69` — `py-0`
- `app/init/page.tsx:181,207` — `py-0` (except line 262: `py-16 px-6 md:px-12`)

**Finding: The `spacing` prop is effectively unused.** Pages bypass it universally, making vertical rhythm ad hoc per page.

### Off-Blessed Spacing Values

| Value | px | Files | Severity |
|-------|-----|-------|----------|
| `pt-10` | 40px | `init/page.tsx:186`, `inventory/page.tsx:45`, `system/page.tsx:38`, `reference/page.tsx:27` | **Medium** — 4 page headers use a non-blessed stop |
| `py-3.5` | 14px | `components-explorer.tsx:914` | Low |
| `px-2.5` | 10px | `input-group.tsx:35,37` | Low — shadcn base layer |
| `py-0.5` | 2px | `nav.tsx:42` | Low |
| `p-2.5` | 10px | `hover-card.tsx:35` | Low — shadcn base layer |
| `gap-1.5` | 6px | Multiple `components/ui/*.tsx` | Low — shadcn base layer |

### Suggested Fix

```css
/* Replace pt-10 (40px) with pt-12 (48px) on all 4 page headers */
/* init/page.tsx:186, inventory/page.tsx:45, system/page.tsx:38, reference/page.tsx:27 */
/* pt-10 → pt-12 aligns to blessed stop */
```

---

## Task 6: Border/Edge Consistency

### Border Width Hierarchy — Intentional 4-Tier System

| Width | Token | Usage | Verdict |
|-------|-------|-------|---------|
| **1px** | (no token) | Subtle interior dividers at reduced opacity (`/20`, `/15`, `/10`). Accordion rows, table rows, hover preview borders. | **Intentional** — delineation, not structure |
| **2px** | `--border-element` | All SF interactive components: button, checkbox, switch, toggle, input, textarea, select, dialog, popover, sheet, drawer, dropdown, menubar, nav-menu, hover-card, badge, radio, slider | **Correct and consistent** |
| **3px** | `--border-divider` | Nav bottom border (`nav.tsx:77`), footer top border (`footer.tsx:8`), tab list borders (`token-tabs.tsx:183`), filter bar borders (`components-explorer.tsx:721,914`), active item indicators (`api-explorer.tsx:232`) | **Consistent** |
| **4px** | `--border-section` | Page header bottom borders, section dividers, hero/dual-layer/code-section borders, token specimen borders | **Consistent** |

### 1px Border Inventory (Not Violations)

- `sf-accordion.tsx:74` — `border-b border-foreground/20`
- `sf-table.tsx:88` — `border-b border-foreground/20`
- `component-skeleton.tsx` — ~15 instances, intentionally thin as skeletal silhouettes
- `hover-preview.tsx:52` — `border-b border-foreground/20`
- `api-explorer.tsx:169,203,260,297,308,343,352,364` — `border-b border-foreground/15` and `border-foreground/10`
- `component-detail.tsx:261` — `border-b border-foreground/10`

**Assessment:** 1px borders are a coherent second tier for subtle dividers at reduced opacity. The 2px rule applies to structural/interactive element borders. No violations.

### Focus Ring System — Unified

- Token: `--focus-ring-width: 2px`, `--focus-ring-offset: 2px` (`tokens.css:196-197`)
- `.sf-focusable:focus-visible` — `globals.css:661-664`: `outline: var(--focus-ring-width) solid var(--color-ring)` + offset + expansion animation
- Mouse click: `.sf-focusable:focus:not(:focus-visible)` hides outline (line 666-667)
- All SF components use `sf-focusable` + suppress default Radix ring with `focus-visible:ring-0`
- **Exception:** `components/ui/*.tsx` (shadcn base) uses Radix-default `focus-visible:ring-3 focus-visible:ring-ring/50` — these are primitives, not SF-layer components

### Verdict

**Clean.** The 4-tier border hierarchy is consistent and intentional. Focus rings are unified across all SF components.

---

## Task 7: Animation Timing Audit

### Motion Token System (`tokens.css:136-143`)

| Token | Value | Purpose |
|-------|-------|---------|
| `--duration-instant` | 34ms | Active/press feedback |
| `--duration-fast` | 100ms | Hover-in |
| `--duration-normal` | 200ms | Standard transitions |
| `--duration-slow` | 400ms | Hover-out (return to rest) |
| `--duration-glacial` | 600ms | Environmental effects |
| `--ease-default` | `cubic-bezier(0.2, 0, 0, 1)` | Standard easing |
| `--ease-hover` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Overshoot for hover |
| `--ease-spring` | `linear(...)` | Spring physics |

### Hover Asymmetry Pattern (100ms in / 400ms out)

Canonical implementation in `globals.css`:
- `.sf-pressable` (lines 635-650): 400ms rest → 100ms hover → 34ms active
- `.sf-hoverable` (lines 652-658): Same pattern
- `.sf-invert-hover` (lines 670-678): Same pattern
- `.sf-link-draw` (lines 681-698): Same pattern

SF component layer — mostly consistent:
- `sf-navigation-menu.tsx:113`, `sf-tabs.tsx:63`, `sf-table.tsx:88`, `sf-card.tsx:41`, `sf-toggle.tsx:8`, `sf-toggle-group.tsx:35` — all use `duration-[var(--duration-fast)]`
- **Exception: `sf-button.tsx:6`** uses `--duration-normal` (200ms) while other SF components use `--duration-fast` (100ms)

### Hardcoded Duration Violations — 15 Instances

| File:Line | Value | Should Be |
|-----------|-------|-----------|
| `token-tabs.tsx:357` | `duration-300` | `duration-[var(--duration-normal)]` or `--duration-slow` |
| `components-explorer.tsx:532` | `duration-200` | `duration-[var(--duration-normal)]` |
| `components-explorer.tsx:852` | `duration-100` | `duration-[var(--duration-fast)]` |
| `components-explorer.tsx:875,881` | `duration-150` | No token match — pick fast or normal |
| `component-grid.tsx:308` | `duration-150` | No token match |
| `component-grid.tsx:316` | `duration-200` | `duration-[var(--duration-normal)]` |
| `manifesto-band.tsx:8` | `duration-200` | `duration-[var(--duration-normal)]` |
| `copy-button.tsx:40` | `duration-150` | No token match |
| `dark-mode-toggle.tsx:90` | `duration-300` | `duration-[var(--duration-slow)]` |
| `nav.tsx:42` | `duration-300` | `duration-[var(--duration-slow)]` |
| `nav.tsx:119` | `duration-200` | `duration-[var(--duration-normal)]` |
| `global-effects.tsx:154` | `duration-200` | `duration-[var(--duration-normal)]` |
| `back-to-top.tsx:41` | `duration-200` | `duration-[var(--duration-normal)]` |
| `color-specimen.tsx:135` | `duration-100` | `duration-[var(--duration-fast)]` |
| `sf-toast.tsx:75` | `duration-100` | `duration-[var(--duration-fast)]` |

### `transition: all` Check

**Zero instances.** Clean.

### GSAP Usage

56 files reference GSAP. Architecture:
- Modular lazy-loading wrappers: `lib/gsap-core.ts`, `lib/gsap-plugins.ts`, `lib/gsap-split.ts`, etc.
- Global lifecycle in `lib/signalframe-provider.tsx` with pause/resume and reduced-motion awareness
- ScrollTrigger synced with Lenis via `lenis-provider.tsx`
- **GSAP is lazy-loaded** via dynamic imports

### Lenis Smooth Scroll

`lenis-provider.tsx`: duration 1.2, exponential easing, `touchMultiplier: 2`. Syncs with GSAP ScrollTrigger. **Skips entirely if `prefers-reduced-motion` is active.**

### `prefers-reduced-motion` Coverage — Excellent

- 11 `@media (prefers-reduced-motion: reduce)` blocks in `globals.css`
- Global kill-switch at `globals.css:1013-1021`: `animation-duration: 0.01ms !important`, `transition-duration: 0.01ms !important` on all elements
- Individual guards in every GSAP animation component
- `signalframe-provider.tsx` — global GSAP timeline freeze
- `lenis-provider.tsx` — skip smooth scroll
- Hooks: `use-scramble-text.ts`, `use-nav-reveal.ts`
- Audio: `lib/audio-feedback.ts` — suppresses
- **Tests enforce it:** `phase-29-infra.spec.ts`, `phase-38-reduced-motion.spec.ts`

### Verdict

SF component layer is mostly clean (one `sf-button` inconsistency). Block/layout layer has 15 hardcoded durations that should use tokens. Zero `transition: all`. Excellent reduced-motion coverage.

---

## Task 8: Color Discipline Check

### Token Definition Files

- **Primary:** `lib/tokens.css` (lines 22-94 `@theme` + lines 101-220 `:root` + lines 222-257 `.dark`)
- **Mirrored:** `app/globals.css` (lines 39-94 `@theme` + lines 119-238 `:root` + lines 254-288 `.dark`)
- All tokens use OKLCH color space.

### Hardcoded Color Violations

**Justified (can't use CSS vars):**
- `global-error.tsx:12,29-31` — `#000`, `#fff` — fallback error page, no CSS access
- `icon.tsx:18,38,47,57` — hex values — OG favicon generator (`ImageResponse` constraint)
- `opengraph-image.tsx:34,35,50,60,71,82` — hex values — OG image generator (same constraint)
- `.storybook/manager.ts:10-20` — Storybook theme config, can't use CSS vars
- `hero-mesh.tsx:153,176` — `rgba()` — Canvas 2D context
- `canvas-cursor.tsx:102,108` — `rgba()/rgb()` — Canvas context
- `token-viz.tsx:67-68` — `rgb()/rgba()` — Canvas context

**Should fix:**

| File:Line | Value | Replacement |
|-----------|-------|-------------|
| `shared-code-block.tsx:23` | `style={{ color: "#999999" }}` | `var(--sf-dim-text)` or `text-muted-foreground` |
| `copy-button.tsx:41` | `style={{ color: "#000000" }}` | `text-foreground` or `text-background` |
| `init/page.tsx:147` | `style={{ color: "#999999" }}` | `var(--sf-dim-text)` |
| `component-detail.tsx:302` | `bg-[oklch(0.12_0_0)]` | `var(--sf-code-bg)` (which IS `oklch(0.12 0 0)`) |
| `globals.css:521` | `background-color: #fff` in `#bg-shift-wrapper` | `var(--color-background)` |
| `globals.css:1805` | `color: #666 !important` | Token-based color |
| `glsl-signal.tsx:171` | inline `oklch(0.145 0 0 / 0.06)` | `var(--color-foreground)` reference |

**Intentional palette definitions (not violations):**
- `color-cycle-frame.tsx:52-58` — hardcoded OKLCH values for color rotation effect
- `page-animations.tsx:185-191` — same pattern
- `dark-mode-toggle.tsx:35,45` — `rgba()` bloom effect, decorative

### Verdict

7 fixable violations in component/page code. Canvas contexts and OG image generators are unavoidable. Color-cycle arrays are intentional palette definitions.

---

## Task 9: Dark Mode Contrast

### `--muted-foreground` Values

| Mode | Value | Approx Hex |
|------|-------|-----------|
| Light | `oklch(0.460 0.010 298)` | `#58575d` |
| Dark | `oklch(0.730 0 0)` | `#b3b3b3` |
| Dark section (bgShift) | `oklch(0.65 0 0)` | `#999` — 6.5:1 on `#0a0a0a` per comment at `globals.css:537` |

Additional: `--sf-dim-text: oklch(0.52 0 0)` light / `oklch(0.65 0 0)` dark

### Contrast Analysis

| Combination | Ratio | WCAG AA |
|-------------|-------|---------|
| `--muted-foreground` on white (light mode) | ~5.5:1 | Pass |
| `--muted-foreground` on `oklch(0.145)` (dark mode) | ~8:1 | Pass |
| `--sf-dim-text` on white (light mode) | ~3.5:1 | **Fail for body, pass for large text** |
| **`text-muted-foreground` on `bg-muted`** (light mode) | ~3.2:1 | **FAIL** |
| `text-muted-foreground` on `bg-muted` (dark mode) | ~4.7:1 | Pass |

### Additional Low-Contrast Patterns

- `opacity-60` combined with `text-muted-foreground` — `component-grid.tsx:109` — further reduces contrast
- `text-foreground/40` and `text-foreground/20` — `signal-overlay.tsx:263` — very low contrast, decorative
- `text-foreground/[0.04]` — `page.tsx:48`, `system/page.tsx:30` — decorative watermark

### axe-core Configuration

`@axe-core/playwright` installed. Tests at `tests/phase-38-a11y.spec.ts`:
- Runs against all 5 routes after full hydration (`networkidle`)
- Exclusions narrowly scoped to animation transients (hero h1 opacity start state, GSAP mid-animation opacity)
- No contrast checks excluded wholesale

### Verdict

One confirmed WCAG AA failure: `text-muted-foreground` on `bg-muted` in light mode (~3.2:1). The `--sf-dim-text` in light mode is marginal (~3.5:1). Dark mode passes comfortably.

### Suggested Fix

```css
/* Before — light mode muted-foreground */
--muted-foreground: oklch(0.460 0.010 298);

/* After — bump lightness down for better contrast on bg-muted */
--muted-foreground: oklch(0.400 0.010 298);  /* ~4.8:1 on bg-muted */
```

---

## Combined Risk Summary

| Severity | Count | Category |
|----------|-------|----------|
| High | 1 | Light mode contrast failure on muted-foreground/bg-muted |
| Medium | 15 | Hardcoded animation durations bypassing token system |
| Medium | 7 | Hardcoded color values that should use tokens |
| Medium | 4 | Page headers using non-blessed spacing stop (pt-10 = 40px) |
| Medium | 1 | `sf-button` hover duration inconsistent with other SF components |
| Low | 1 | SFSection spacing prop is dead API surface |
| Low | 1 | `--sf-dim-text` marginal in light mode |
