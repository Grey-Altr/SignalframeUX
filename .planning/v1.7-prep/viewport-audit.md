# Viewport Audit — SF//UX v1.7 Prep

Tasks 1-4 from the v1.7 dispatch. All findings against 1440x900 (13" MacBook default) and 1280x800 (minimum).

---

## Task 1: Viewport Stress Test

### Breakpoints

**Zero viewport-width breakpoints in `globals.css`.** All `@media` queries are capability-based (`prefers-reduced-motion`, `pointer: coarse`, `prefers-contrast: more`, `print`).

No `tailwind.config.*` exists — Tailwind v4 via `@tailwindcss/postcss`. Default breakpoints only: `sm:640`, `md:768`, `lg:1024`, `xl:1280`, `2xl:1536`.

Tailwind responsive prefixes in use:
- `md:grid-cols-2`, `lg:grid-cols-3`, `lg:grid-cols-4` — `sf-grid.tsx:9-11`
- `grid-cols-2 lg:grid-cols-4` — `components-explorer.tsx:808`
- `md:grid-cols-2` — `code-section.tsx:51`, `dual-layer.tsx:6`, `hero.tsx:7`
- `md:px-12` — used heavily across pages

**Risk: No breakpoints target the 1280-1440px range.** The jump is `lg:1024` → `xl:1280` (rarely used). At 1440px, `lg:` is active but `xl:` is not.

### Fixed Widths

| Element | Value | File:Line | Risk at 1440px |
|---------|-------|-----------|----------------|
| Main container | `--max-w-wide: 80rem` (1280px) | `globals.css:188` | 160px total gutter (80px/side). Safe but tight. |
| Inventory grid | `grid-cols-[14ch_20ch_12ch_4ch_2ch]` | `inventory-section.tsx:57` | ~437px total. Safe. |
| Color specimen | `min-w-[700px]` | `color-specimen.tsx:157` | `overflow-x-auto` parent (line 148). Intentional horizontal scroll. |
| API explorer grid | `grid-cols-[minmax(120px,auto)_minmax(140px,1.4fr)_minmax(90px,auto)_minmax(200px,2fr)]` | `api-explorer.tsx:315` | Min total 550px + gaps. Safe inside 1280px container. |
| Token tabs | `w-[200px]`, `w-[280px]` | `token-tabs.tsx:250,269` | Inside scrollable container. Safe. |
| Component detail panel | `width: clamp(320px, 40vw, 600px)` | `inventory-section.tsx:205` | At 1440px: 576px. At 1280px: 512px (40% of viewport). |

### Overflow Safety Net

**`overflow-x-hidden` on `<body>`** — `layout.tsx:97`. This silently clips horizontal overflow rather than showing scrollbars. Content overflow bugs will be invisible.

All other `overflow: hidden` instances are on decorative elements (skeleton, effects) — defensive, not masking problems. `overflow-x-auto` on color specimen and code blocks is intentional scroll.

### `vw` Units — All Properly Clamped

- Display type: `clamp(80px, 12vw, 160px)` — multiple pages. At 1440px: 173px → clamped to 160px.
- Hero title: `clamp(7.5rem, 12vw, 10rem)` — `entry-section.tsx:17`.
- Nav spacing: `clamp(8px,1.2vw,16px)` and `clamp(12px,2vw,28px)` — `nav.tsx:78,42`.
- Ghost labels: `-left-[3vw]`, `-left-[2vw]` — decorative, 4% opacity.

### Absolute Positioning

All safe. Signal overlay/VHS/idle/cursor use full-viewport `inset: 0` or `position: fixed`. Hero elements use `absolute inset-0` within `relative` parents. Instrument HUD: `fixed top-[24px] right-[24px]` — safe. Hover preview: `absolute right-0 w-[280px]` — `hidden md:block`, safe at 1440px.

### Verdict

**No hard overflow failures at 1440x900 or 1280x800.** The `overflow-x-hidden` on body is a silent safety net that should be reviewed. Main density concern is the component detail panel consuming 40% of viewport at 1280px.

---

## Task 2: Typography Scale at 13"

### Token Definitions (`globals.css:102-111`)

| Token | rem | px | Usage Category |
|-------|-----|-----|----------------|
| `--text-2xs` | 0.563 | 9 | Micro labels, copy buttons |
| `--text-xs` | 0.625 | 10 | Tag pills, stat labels |
| `--text-sm` | 0.688 | 11 | Nav, footer, grid metadata |
| `--text-base` | 0.813 | 13 | Body copy, descriptions |
| `--text-md` | 1.000 | 16 | Hero body, prominent copy |
| `--text-lg` | 1.125 | 18 | Section intros |
| `--text-xl` | 1.500 | 24 | Subheadings |
| `--text-2xl` | 2.000 | 32 | Section titles |
| `--text-3xl` | 3.000 | 48 | Page headers |
| `--text-4xl` | 5.000 | 80 | Display type |

### `--text-2xs` (9px) — 20+ Instances

**Decorative (acceptable at 9px):**
- `.sf-rotated-label` — `globals.css:864` — rotated sidebar watermark at 30% opacity
- Instrument HUD readout — `instrument-hud.tsx:171` — `pointer-events: none`
- Component skeleton labels — `component-skeleton.tsx:50`
- Signal overlay labels — `signal-overlay.tsx:70,74,174,227,230,263`

**Functional (problematic at 9px on 13"):**
- **Breadcrumb navigation** — `breadcrumb.tsx:29` — users need to read this
- **Copy button** — `copy-button.tsx:40` — interactive button label
- **Badge label** — `component-detail.tsx:183` — layer badge
- **Color specimen metadata** — `color-specimen.tsx:119,135,150,162,196,209` — OKLCH values, scale names
- **Spacing specimen** — `spacing-specimen.tsx:24,44`
- **Motion specimen** — `motion-specimen.tsx:161`
- **Token comparison labels** — `token-tabs.tsx:309,318`

### `--text-xs` (10px) — 40+ Instances

Heavily used for UI chrome:
- API explorer prop tables — `api-explorer.tsx` (15+ instances: types, defaults, descriptions)
- Component detail tabs/props — `component-detail.tsx` (12+ instances)
- Component grid card labels — `component-grid.tsx:61,70,71,73,74,108,109`
- Nav overlay footer — `nav-overlay.tsx:132`
- Filter bar labels — `components-explorer.tsx:730,743,749,759,769,789`
- Init page labels — `init/page.tsx:187,200,228,250`

### Hardcoded Font-Size Bypasses

| Value | Files | Context |
|-------|-------|---------|
| `text-[11px]` | `system/page.tsx:45`, `reference/page.tsx:34`, `inventory/page.tsx:59`, `signal-overlay.tsx:200,206` | Equivalent to `--text-sm` but bypasses token |
| `text-[9px]` | `component-skeleton.tsx:50`, `proof-section.tsx:315,325`, `signal-overlay.tsx:70,74,174,227,230,263`, `global-effects.tsx:172` | Equivalent to `--text-2xs` but bypasses token |
| `text-[10px]` | `global-effects.tsx:173`, `components-explorer.tsx:223` | Equivalent to `--text-xs` but bypasses token |
| `text-[5px]`-`text-[8px]` | `components-explorer.tsx` (20+ instances) | Miniature component wireframe previews — purely decorative |

### Verdict

The 9px functional uses (breadcrumbs, copy buttons, color specimen metadata) will be **very difficult to read** at 13" native resolution. The 10px API explorer prop tables are at the legibility floor — monospace helps but it's tight. Recommend bumping functional `--text-2xs` uses to `--text-xs` and `--text-xs` uses to `--text-sm` for readable content.

### Suggested Fix

```css
/* Before — tokens.css:102-103 */
--text-2xs: 0.563rem;   /* 9px */
--text-xs: 0.625rem;    /* 10px */

/* After — shift floor up for 13" */
--text-2xs: 0.625rem;   /* 10px — was 9px */
--text-xs: 0.688rem;    /* 11px — was 10px */
```

This raises the floor without changing the scale's relative proportions. Decorative uses survive fine at 10px. Functional content becomes readable on 13".

---

## Task 3: Component Density Check

### Homepage INVENTORY Section (`inventory-section.tsx`)

- **12 items** shown (line 24: `HOMEPAGE_INVENTORY_INDICES`)
- 5-column monospace grid: `grid-cols-[14ch_20ch_12ch_4ch_2ch]` (line 57)
- Columns: SF// code, NAME, LAYER, TIER, arrow
- Rows at `text-sm` (11px) monospace with `py-1.5` padding

### Detail Panel — Click-Triggered Fixed Overlay

- Portal to `document.body` (line 190)
- **Backdrop:** `fixed inset-0 bg-background/60` (line 194)
- **Panel:** `fixed right-0 top-0 bottom-0` with `width: clamp(320px, 40vw, 600px)` (lines 202-206)
- At 1440px: panel = 576px, leaving 864px behind backdrop
- At 1280px: panel = 512px, leaving 768px behind backdrop
- Panel has `overflow-y-auto` and `border-l-4 border-foreground`
- GSAP height animation on open/close

Content behind the panel is obscured by the backdrop, so the 40% consumption at 1280px is acceptable — the panel IS the focus.

### Grid Column Responsiveness (`/inventory` page)

`components-explorer.tsx:808` — `grid-cols-2 lg:grid-cols-4`
- At 1440px: 4 columns (lg: active)
- At 1280px: 4 columns
- Below 1024px: 2 columns
- **No 3-column intermediate.** The jump from 2-col (1023px) to 4-col (1024px) is abrupt.

### Suggested Fix

```tsx
// Before — components-explorer.tsx:808
className="grid-cols-2 lg:grid-cols-4"

// After — add md intermediate
className="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
```

---

## Task 4: Storybook at 13"

### Config

- `.storybook/main.ts` — `@storybook/nextjs-vite`, addons: `essentials` + `themes`. No layout settings.
- `.storybook/preview.ts` — Dark theme default, imports `globals.css`. No decorators with width constraints.
- `.storybook/manager.ts` — Custom SF theme (`appBorderRadius: 0`, dark colors). **No sidebar width override** — uses Storybook default (~230px).

### At 1440px

Default sidebar (~230px) leaves ~1210px for canvas. At 1280px: ~1050px. No custom constraints that would cause issues.

### Missing: Viewport Addon

**`@storybook/addon-viewport` is not configured.** The `essentials` addon includes viewport, but no custom viewport presets are set. No way to test components at 1440x900 or 1280x800 within Storybook.

### Suggested Fix

```ts
// .storybook/preview.ts — add viewport presets
export const parameters = {
  viewport: {
    viewports: {
      macbook13: { name: 'MacBook 13"', styles: { width: '1440px', height: '900px' } },
      macbook13min: { name: 'MacBook 13" min', styles: { width: '1280px', height: '800px' } },
    },
  },
};
```

---

## Risk Summary

| Severity | Finding | Location |
|----------|---------|----------|
| **High** | `--text-2xs` (9px) used for functional UI (breadcrumbs, copy buttons, specimen metadata) — illegible on 13" | `breadcrumb.tsx:29`, `copy-button.tsx:40`, `color-specimen.tsx:119+` |
| **High** | `overflow-x-hidden` on body silently clips overflow | `layout.tsx:97` |
| **Medium** | No viewport breakpoints in 1280-1440px range | Systemic — relies on Tailwind `md:`/`lg:` only |
| **Medium** | Component detail panel at 1280px = 512px (40% viewport) | `inventory-section.tsx:205` |
| **Medium** | Grid jump 2-col → 4-col with no 3-col intermediate | `components-explorer.tsx:808` |
| **Medium** | 20+ hardcoded font-size values bypass token system | Mostly `components-explorer.tsx` (decorative) but also `system/page.tsx:45`, `reference/page.tsx:34`, `inventory/page.tsx:59` |
| **Low** | Storybook missing viewport presets for 13" testing | `.storybook/preview.ts` |
