# SCAFFOLDING — SF Component Authoring Guide

> Canonical reference for v1.3 component expansion.
> Every new SF wrapper must pass all 9 checklist items before merge.
> **v1.3 final state:** 42 SF component files (35 Pattern A, 2 Pattern B lazy, 5 Pattern C pure-SF) + 4 animation/generative entries + sf-theme = 49 registry items total.

## SF Wrapper Creation Checklist

### 1. rounded-none Audit

- [ ] Inspect the generated `ui/[name].tsx` for any `rounded-*` class that is NOT `rounded-none`
- [ ] Add `rounded-none` to every sub-element's `cn()` call that inherits a Radix rounded class
- [ ] Verify in browser DevTools: every element shows `border-radius: 0px` in computed styles
- [ ] High-risk elements: Avatar (image + fallback have `rounded-full`), Progress (track + fill have `rounded-full`), AlertDialog (content has `rounded-xl`)

### 2. intent Prop Rule

- [ ] CVA config uses `intent:` as the variants key for the primary visual state
- [ ] Never name the visual variant prop `variant`, `type`, `status`, `color`, or `mode`
- [ ] Exception: structural props (`width`, `size`, `direction`, `gap`, `cols`) are NOT visual variants and may use their own names
- [ ] Reference: SFButton uses `intent: { primary, ghost, signal }`, SFBadge uses `intent: { default, primary, outline, signal }`

### 3. Barrel Rule

- [ ] Export added to `sf/index.ts` under the correct category comment
- [ ] `sf/index.ts` has NO `'use client'` directive — verify before committing
- [ ] Category comments in barrel: `// Layout`, `// Forms`, `// Feedback`, `// Navigation`, `// Data Display`, `// Generative`
- [ ] Exception: P3 lazy components (SFCalendar, SFMenubar) are NEVER added to `sf/index.ts`

### 4. Registry Same-Commit Rule

- [ ] `registry.json` entry appended with correct `name`, `type`, `title`, `description`, `registryDependencies`, `files`, `meta`
- [ ] `meta.layer`: `"frame"` for FRAME-only components, `"signal"` for animated components
- [ ] `meta.pattern`: `"A"` for Radix-wrapped, `"C"` for pure-SF, `"B"` only for lazy P3 registry-only
- [ ] Run `pnpm registry:build` to regenerate `public/r/` files
- [ ] Component file + barrel export + registry entry land in the SAME commit

### 5. A11y Smoke Test

- [ ] Tab into the component — focus ring is visible
- [ ] Activate with Enter or Space — expected behavior fires
- [ ] Navigate within (if multi-element) with arrow keys
- [ ] Dismiss or close with Escape (if applicable)
- [ ] Tab out to the next focusable element — focus moves forward correctly
- [ ] No WCAG AA violations: contrast ratio >= 4.5:1, focus indicator visible, ARIA roles/states correct

### 6. Prefers-Reduced-Motion Rule

- [ ] Every GSAP animation is guarded: `if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return`
- [ ] Guard runs BEFORE creating the tween, not after
- [ ] With reduced motion active: component renders and functions correctly — animation is enhancement, not behavior
- [ ] FRAME-only components (no GSAP): this rule does not apply

### 7. JSDoc Block

- [ ] `@param` for each public prop with type and description
- [ ] `@example` with minimal working usage (1-3 lines)
- [ ] Layer note: `FRAME layer` or `FRAME + SIGNAL layer`
- [ ] Reference: existing JSDoc blocks on SFButton, SFCard, SFSection

### 8. 'use client' Determination

- [ ] Check the generated `ui/[name].tsx` — does it have `'use client'` at line 1?
- [ ] If yes: the SF wrapper file MUST also have `'use client'` at line 1
- [ ] If no: does the SF wrapper use any React hooks (useState, useEffect, useRef, etc.)?
  - If yes: add `'use client'`
  - If no: component is a Server Component — do NOT add `'use client'`
- [ ] Layout primitives (SFContainer, SFSection, SFStack, SFGrid, SFText) must NEVER have `'use client'`

### 9. Bundle Gate

- [ ] Run `ANALYZE=true pnpm build` after integrating the component
- [ ] Check First Load JS for `/` route against BASELINE.md numbers
- [ ] FRAME-only component: delta should be < 5KB
- [ ] If total exceeds 150KB gate: stop and investigate before continuing
- [ ] Verify layout primitives are absent from client chunks in the analyzer output

## Prop Vocabulary

| Prop | Rule | Typical Values | Used By |
|------|------|----------------|---------|
| `intent` | Primary CVA semantic variant on all SF components with visual states. REQUIRED key name. | Component-specific: `primary`, `ghost`, `signal` (buttons); `default`, `primary`, `outline` (badges); `info`, `warning`, `destructive`, `success` (alerts) | SFButton, SFBadge, SFToggle, and ALL new v1.3 components with visual variants |
| `size` | Scale variant controlling height and padding | `sm`, `md`, `lg`, `xl` (component-specific subset) | SFButton, SFToggle, and new components requiring scale variants |
| `asChild` | Radix composition pattern. Renders trigger as child element. Flows through `...props` — NOT defined in SF wrapper signatures. | `boolean` | All SF trigger sub-components (SFDialogTrigger, SFSheetTrigger, etc.) |
| `width` / `cols` / `gap` / `direction` / `align` | Structural layout props — NOT visual variants. These names are correct for layout primitives. | Component-specific | SFContainer (`width`), SFGrid (`cols`, `gap`), SFStack (`direction`, `gap`, `align`) |
| `variant` | **EXCEPTION: SFText only.** Names a typographic semantic alias, not a visual intent. Pre-dates the `intent` convention. | `heading-1`, `heading-2`, `heading-3`, `body`, `small` | SFText only |

> **Compliance status (v1.2 audit):** All 29 existing SF components comply with this vocabulary. Zero violations found. The only deviation is `SFText.variant` which is a documented exception — it names typographic aliases, not semantic visual states.

> **For v1.3 authors:** If you believe a new component needs a prop name outside this vocabulary, document the rationale in the component's JSDoc. Structural props (controlling layout, not appearance) are always acceptable with descriptive names.

## Wrapper Patterns

**Pattern A — Radix Wrap:** Thin passthrough over a shadcn/Radix base. Reference: `sf-dialog.tsx`, `sf-button.tsx`. The SF wrapper imports from `ui/[name]`, applies `cn()` class overrides with `rounded-none`, and re-exports with SF prefix.

**Pattern B — Lazy Registry-Only:** Component loaded via `next/dynamic` with `ssr: false`. NOT exported from `sf/index.ts`. Used only for P3 heavy-dep components (Calendar, Menubar).

**Pattern C — Pure SF Construction:** No Radix base. Semantic HTML + Tailwind tokens + optional CVA. Server Component by default. Reference: `sf-text.tsx`, `sf-container.tsx`, `sf-stack.tsx`.

## Registry Entry Template

```json
{
  "name": "sf-[name]",
  "type": "registry:ui",
  "title": "SF [Name]",
  "description": "[One-line description]",
  "registryDependencies": ["[shadcn-base-name]"],
  "dependencies": ["class-variance-authority"],
  "files": [
    {
      "path": "components/sf/sf-[name].tsx",
      "type": "registry:ui"
    }
  ],
  "meta": {
    "layer": "frame | signal",
    "pattern": "A | B | C"
  }
}
```

Note: Omit `"dependencies": ["class-variance-authority"]` if the component does not use CVA.

## Known Pitfalls

1. **`rounded-full` survives `--radius: 0px`**: The global CSS custom property `--radius: 0px` does NOT affect literal Tailwind classes like `rounded-full` or `rounded-xl`. Every SF wrapper must explicitly apply `rounded-none` on each sub-element.
2. **`'use client'` in barrel kills Server Components**: Adding `'use client'` to `sf/index.ts` turns ALL 5 layout primitives into Client Components, silently inflating the bundle. Each interactive wrapper declares `'use client'` in its own file only.
3. **`meta.pattern` values in existing registry**: **RESOLVED** — Fixed in Phase 20 final audit. All 49 registry entries now use correct A/B/C pattern values: 35 Pattern A (Radix-wrapped), 2 Pattern B (lazy/P3: sf-calendar, sf-menubar), 12 Pattern C (pure-SF + animation + non-SF entries).
4. **shadcn version pinning**: Use `pnpm dlx shadcn@4.1.2 add` to stay on the pinned version. `@latest` may generate different class patterns.

## Elevation Policy

The SignalframeUX token system has **no box-shadow elevation scale** and **no z-elevation variables**. This is a deliberate DU/TDR aesthetic decision — depth is expressed through spacing, hierarchy, layout, contrast, and motion only.

**DO NOT** add a shadow elevation scale to this system.

Three `--sf-*` shadow tokens exist in `:root` for micro-feedback press effects. They are NOT an elevation scale:

| Token | Purpose |
|-------|---------|
| `--sf-inset-shadow` | `inset 0 1px 2px oklch(0 0 0 / 0.08)` — subtle press-in feedback |
| `--sf-deboss-light` | `0 1px 0 oklch(1 0 0 / 0.1)` — light deboss highlight |
| `--sf-deboss-shadow` | `0 -1px 0 oklch(0 0 0 / 0.15)` — dark deboss shadow |

## Deferred Token Groups

The following token groups are declared in `@theme` for shadcn CLI compatibility but have **no SF consumer components** in v1.4. Do not build against these tokens until their respective milestones.

### Sidebar Tokens

Eight tokens: `--color-sidebar`, `--color-sidebar-foreground`, `--color-sidebar-primary`, `--color-sidebar-primary-foreground`, `--color-sidebar-accent`, `--color-sidebar-accent-foreground`, `--color-sidebar-border`, `--color-sidebar-ring`. Dark overrides exist in `.dark {}`.

**Status:** SFSidebar is deferred to the cdOS milestone. These tokens exist solely so `pnpm dlx shadcn add sidebar` resolves without errors. Do not reference sidebar tokens in v1.4 components.

### Chart Tokens

Five tokens: `--color-chart-1` through `--color-chart-5`. No dark overrides (by design — chart colors are consistent across themes).

**Status:** SFChart is out of scope for v1.4 (recharts ~50KB dependency, no current consumer). These tokens exist solely for shadcn CLI compatibility. Do not reference chart tokens in v1.4 components.

### Recommendation

Avoid consuming sidebar or chart tokens in any SF component until the consuming SF wrapper (SFSidebar, SFChart) is authored in its respective milestone. Using these tokens creates undocumented component contracts that may break when the consuming component is eventually built.
