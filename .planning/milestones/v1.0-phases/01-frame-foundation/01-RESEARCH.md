# Phase 1: FRAME Foundation - Research

**Researched:** 2026-04-05
**Domain:** CSS design token systems, Tailwind CSS v4 `@theme`, CVA variant patterns, print CSS
**Confidence:** HIGH

## Summary

Phase 1 is a token hardening exercise, not a build. The codebase is already on Tailwind v4.1 with `@theme` as the single source of truth in `app/globals.css`. All color tokens are OKLCH. The CVA variant naming is already partially standardized — `sf-button.tsx` and `sf-badge.tsx` both use `intent` with `defaultVariants`. Three components with CVA (`sf-button`, `sf-badge`, `sf-toggle`) are already compliant. The main work is: (1) sweep non-blessed spacing values across blocks, (2) add semantic typography aliases as Tailwind `@utility` definitions, (3) formalize layout tokens and gutter CSS custom properties, (4) add CSS fallbacks to custom properties, (5) tier and freeze the color palette, (6) rename `--vhs-*` tokens to `--sf-vhs-*`, and (7) add a print stylesheet.

The biggest scope item by file count is spacing: non-blessed values (`-5`, `-7`, `-10`) appear heavily in `components/blocks/` and the animation/layout directories. The `components/ui/` shadcn base is exempted from modification per project rules — spacing violations there stay.

**Primary recommendation:** Work in eight atomic commits that map 1:1 to FRM-01 through FRM-08. Every task edits `app/globals.css` and/or `components/sf/*.tsx` or `components/blocks/*.tsx`. Nothing else.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Spacing Enforcement Strategy**
- Batch audit + replace all 43 arbitrary spacing values with nearest blessed stop in one sweep
- Enforcement via Tailwind safelist approach — document blessed stops, manually enforce during review
- Define `--space-*` CSS custom properties in globals.css AND map to Tailwind utilities (both)
- Exempt structural measurements (nav-height: 83px, border-width, etc.) — only content spacing uses blessed stops

**Typography Token Architecture**
- Semantic aliases named `--text-heading-1` through `--text-body`, `--text-small` as CSS custom properties
- Composite tokens that bundle font-family + size + weight (e.g., text-heading-1 = Anton/3xl/bold)
- Keep existing clamp() for hero/display type — semantic aliases cover everything else
- Implement as Tailwind `@utility` definitions referencing CSS custom properties

**Layout & Color Token Formalization**
- Layout max-widths: `--max-w-content: 42rem` (672px), `--max-w-wide: 80rem` (1280px), `--max-w-full: 100%`
- Gutter tokens: `--gutter: 1.5rem` (24px), `--gutter-sm: 1rem` (16px mobile)
- Color tier enforcement via documentation + code review — tier definitions in globals.css comment block
- VHS → sf-vhs namespace migration as single atomic search-replace commit

**Fallback, CVA & Print Strategy**
- CSS fallbacks on critical visual properties only (colors, fonts, spacing) — skip z-index, motion, decorative
- CVA `intent` standard values: `default`, `primary`, `secondary`, `destructive`, `ghost`, `outline`
- Minimal print stylesheet: invert dark backgrounds to white, suppress Signal layer, keep layout structure
- Retrofit `defaultVariants` with `intent: "default"` on every existing CVA call

### Claude's Discretion
- Exact blessed-stop mapping for each arbitrary value (nearest-stop judgment calls)
- CSS fallback value selection (reasonable defaults per property)
- Print stylesheet implementation details
- Order of operations within each requirement

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FRM-01 | All spacing uses blessed stops only (4/8/12/16/24/32/48/64/96) — zero arbitrary values in codebase | Spacing audit complete: non-blessed Tailwind units are `-5` (20px), `-7` (28px), `-10` (40px); all appear in `components/blocks/` and `components/layout/`; `components/ui/` is exempt (shadcn base) |
| FRM-02 | Semantic typography aliases implemented (`text-heading-1` through `text-body`, `text-small`) | Existing `--text-*` scale is in `@theme`; aliases must be added as `@utility` rules in `@layer utilities` since composite font/size/weight cannot be expressed in `@theme` alone |
| FRM-03 | Layout tokens defined and enforced (`--max-w-content`, `--max-w-wide`, `--max-w-full`, standard gutters) | Currently only `--nav-height: 83px` exists as a layout token; the four max-width and two gutter tokens are entirely new additions to the `:root` block |
| FRM-04 | Every CSS custom property has a declared fallback value | Fallback syntax is `var(--token, fallback)` at call sites OR a matching `@layer base` default; VHS CRT/noise already have fallbacks; colors, fonts, and motion tokens in component code do not |
| FRM-05 | Color palette tiered and frozen — core 5 required, extended locked, expansion prohibited | Core 5: background, foreground, primary, secondary, accent; Extended: muted, card, popover, destructive, success, warning; Implementation is documentation in globals.css comment block + no new tokens added |
| FRM-06 | `--vhs-*` tokens namespaced to `--sf-vhs-*` | Currently `--vhs-crt-opacity` and `--vhs-noise-opacity` in `:root`, referenced in `app/globals.css` (lines 1429, 1494); CSS classes `.vhs-*` are structural classNames in `vhs-overlay.tsx` — rename token vars only, keep classNames |
| FRM-07 | CVA variant prop standardized to `intent` across all SF components with `defaultVariants` on every CVA call | Three SF components use CVA: `sf-button`, `sf-badge`, `sf-toggle` — all three already use `intent` with `defaultVariants`; zero components need fixing on this metric; confirm no fourth CVA-using component was missed |
| FRM-08 | Print media styles — dark backgrounds invert, Signal layer suppressed, readable on paper | No `@media print` block exists anywhere; VHS overlay, scanlines, noise, cursor, animation components must be hidden; background-color flipped to white, foreground to black |
</phase_requirements>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | 4.1.4 | Utility classes + `@theme` token system | Already in use; `@theme` is the canonical token contract |
| `class-variance-authority` | (via package.json) | CVA for component variants | Already in use across sf/ layer |
| PostCSS + `@tailwindcss/postcss` | 4.1.4 | CSS build pipeline | Required for Tailwind v4 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `cn()` from `lib/utils.ts` | — | Class merging with `tailwind-merge` | Every component className composition |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@utility` in `@layer utilities` | CSS Modules | `@layer utilities` already established; CSS Modules would require file proliferation |
| Comment-block tier enforcement | Runtime token guard | Runtime guards would require JS overhead; comment block + review is sufficient per CONTEXT.md decision |

**Installation:** None — all dependencies are already installed.

---

## Architecture Patterns

### Recommended Project Structure
No structural changes. All token work goes into:
```
app/
└── globals.css          — single token source of truth
components/
├── sf/*.tsx             — CVA audit target
└── blocks/*.tsx         — spacing sweep target
```

### Pattern 1: Tailwind v4 `@theme` for primitive tokens
**What:** CSS custom properties declared inside `@theme {}` are automatically exposed as Tailwind utilities.
**When to use:** Scale values (colors, type sizes, radii) that need both CSS var AND Tailwind class access.
**Example:**
```css
/* In @theme block — already exists for --text-* sizes */
@theme {
  --text-base: 0.813rem;
}
/* Tailwind generates text-base class automatically */
```

### Pattern 2: `@layer utilities` for composite semantic aliases
**What:** Semantic typography aliases bundle multiple properties (font-family, font-size, font-weight, line-height) that cannot be expressed as single `@theme` values.
**When to use:** When a "semantic alias" needs to set more than one CSS property. The `@utility` directive (Tailwind v4) or `@layer utilities` (current codebase pattern) both work.
**Example:**
```css
/* Add to @layer utilities block in globals.css */
@layer utilities {
  .text-heading-1 {
    font-family: var(--font-display);
    font-size: var(--text-3xl);      /* 48px */
    font-weight: 700;
    line-height: 0.9;
    text-transform: uppercase;
  }
  .text-heading-2 {
    font-family: var(--font-sans);
    font-size: var(--text-2xl);      /* 32px */
    font-weight: 700;
    line-height: 1.1;
  }
  .text-heading-3 {
    font-family: var(--font-sans);
    font-size: var(--text-xl);       /* 24px */
    font-weight: 600;
    line-height: 1.2;
  }
  .text-body {
    font-family: var(--font-sans);
    font-size: var(--text-base);     /* 13px */
    font-weight: 400;
    line-height: 1.5;
  }
  .text-small {
    font-family: var(--font-sans);
    font-size: var(--text-sm);       /* 11px */
    font-weight: 400;
    line-height: 1.4;
  }
}
```

### Pattern 3: Layout tokens in `:root` block
**What:** Max-width and gutter values as CSS custom properties, NOT in `@theme` (they don't need Tailwind utility generation; they're used via `var()` in component styles).
**When to use:** Structural layout measurements that components reference directly.
**Example:**
```css
/* Add to :root block (after existing tokens) */
:root {
  /* Layout tokens */
  --max-w-content: 42rem;     /* 672px — prose/readable width */
  --max-w-wide: 80rem;        /* 1280px — section width */
  --max-w-full: 100%;         /* full-bleed */
  --gutter: 1.5rem;           /* 24px — standard horizontal padding */
  --gutter-sm: 1rem;          /* 16px — mobile horizontal padding */
}
```

### Pattern 4: CSS fallback values at call sites
**What:** Every `var(--token)` usage in globals.css gets a comma-fallback: `var(--token, fallback-value)`.
**When to use:** Critical visual properties — colors, fonts, spacing that would cause invisible/broken elements if the var is undefined.
**Example:**
```css
/* Before */
opacity: var(--vhs-crt-opacity);

/* After */
opacity: var(--vhs-crt-opacity, 0.2);  /* already done — this is the model */

/* Apply same pattern to motion tokens in component CSS */
transition-duration: var(--duration-normal, 200ms);
```

### Pattern 5: VHS token namespace migration
**What:** Rename `--vhs-crt-opacity` → `--sf-vhs-crt-opacity` and `--vhs-noise-opacity` → `--sf-vhs-noise-opacity`. CSS classNames (`.vhs-overlay`, `.vhs-crt`, etc.) are NOT renamed — they are structural, not tokens.
**When to use:** Single atomic commit: find+replace in globals.css only.
**Example:**
```css
/* :root block */
--sf-vhs-crt-opacity: 0.2;    /* was --vhs-crt-opacity */
--sf-vhs-noise-opacity: 0.015; /* was --vhs-noise-opacity */

/* Usage site */
opacity: var(--sf-vhs-crt-opacity, 0.2);
```

### Pattern 6: Print stylesheet
**What:** `@media print` block at the bottom of globals.css. Hides SIGNAL layer, inverts backgrounds to white.
**When to use:** Single block at end of file; targets known Signal layer class names.
**Example:**
```css
@media print {
  /* Suppress Signal layer completely */
  .vhs-overlay,
  [data-anim],
  .sf-cursor,
  .sf-grain::after,
  .sf-idle-overlay {
    display: none !important;
  }

  /* Invert dark surfaces to white */
  body, .dark body {
    background: white !important;
    color: black !important;
  }

  /* Keep layout structure — max-width, borders, type */
  .sf-border { border-color: black; }
}
```

### Pattern 7: Blessed-stop spacing mapping
**What:** Non-blessed Tailwind spacing units mapped to nearest blessed stop.

Tailwind's spacing scale: each unit = 4px. Blessed stops in units: `1(4px) 2(8px) 3(12px) 4(16px) 6(24px) 8(32px) 12(48px) 16(64px) 24(96px)`.

**Non-blessed values found in codebase (by Tailwind unit number):**
| Non-Blessed | px value | Maps to | Tailwind unit |
|-------------|----------|---------|---------------|
| `-5` | 20px | nearest = 24px | `-6` |
| `-7` | 28px | nearest = 32px | `-8` |
| `-10` | 40px | nearest = 48px | `-12` |

**Important note:** The CONTEXT.md exempts structural measurements. `py-10` in section headers (40px) maps to `py-12` (48px). Individual judgment is required per CONTEXT.md — this table gives the decision framework, not automatic replacement.

### Anti-Patterns to Avoid
- **Adding `--space-*` tokens to `@theme`:** Will generate hundreds of Tailwind classes unnecessarily. Add to `:root` only.
- **Renaming VHS classNames (`.vhs-overlay`):** These are structural, not tokens. Only rename the CSS custom property vars.
- **Modifying `components/ui/*.tsx`:** Shadcn base files are exempt — never touch them for this phase.
- **Creating a CVA `intent: "signal"` value:** Not in the locked set (`default`, `primary`, `secondary`, `destructive`, `ghost`, `outline`). Check existing components — `sf-button` has a `signal` intent that predates this standard; the decision is whether to keep or migrate it.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Spacing enforcement at build time | Custom ESLint/stylelint rule | Manual audit + `grep` script for verification | Rule would require plugin infrastructure; grep is sufficient for 43 values |
| Token existence validation | Runtime JS check | CSS fallback `var(--token, fallback)` | CSS fallbacks are zero-overhead and spec-compliant |
| Typography composite tokens | New CSS library | `@layer utilities` block in globals.css | Already the established pattern in the codebase |

**Key insight:** This phase is about editing files, not building systems. The right tool for each task is a text editor and grep.

---

## Common Pitfalls

### Pitfall 1: Confusing Tailwind units with pixel values
**What goes wrong:** Developer sees `p-5` and thinks "5px" — it's actually 20px (5 × 4px). Then maps it to `p-4` (16px) instead of `p-6` (24px).
**Why it happens:** The Tailwind unit-to-pixel relationship requires conscious translation.
**How to avoid:** Always verify: `p-5` = 5 × 4 = 20px → nearest blessed = 24px → `p-6`.
**Warning signs:** Components that gain/lose visible density after the spacing sweep.

### Pitfall 2: The `signal` intent value on SFButton
**What goes wrong:** The locked CVA intent set is `default`, `primary`, `secondary`, `destructive`, `ghost`, `outline`. But `sf-button.tsx` currently has `intent: "signal"` as a value. Blindly adding `defaultVariants: { intent: "default" }` without resolving `signal` creates an undocumented extension.
**Why it happens:** The system evolved before the standard was locked.
**How to avoid:** Decide explicitly: keep `signal` as a documented extension of the blessed set OR migrate usages to an existing intent. Document whichever choice in a comment.
**Warning signs:** Build warnings from CVA about unknown intent values.

### Pitfall 3: VHS className vs CSS custom property confusion
**What goes wrong:** Renaming `.vhs-overlay` class in CSS AND in the TSX component, breaking the class reference.
**Why it happens:** FRM-06 says "namespace VHS tokens" and the word "tokens" can be read to include classNames.
**How to avoid:** FRM-06 scope is limited to `--vhs-crt-opacity` and `--vhs-noise-opacity` CSS custom properties only. CSS classNames like `.vhs-overlay` are not tokens — leave them alone.
**Warning signs:** VHS overlay stops rendering after the rename commit.

### Pitfall 4: Semantic alias utility not overriding Tailwind defaults
**What goes wrong:** `.text-heading-1` utility gets defined in `@layer utilities` but Tailwind's own `text-*` utilities (e.g., `text-3xl`) at the same specificity level interfere.
**Why it happens:** Tailwind v4 generates its utilities in the same `utilities` layer.
**How to avoid:** Define semantic aliases in `@layer utilities` using the exact class names (`text-heading-1`, `text-heading-2`, etc.) that don't conflict with any existing Tailwind utility. The names chosen — `heading-1`, `heading-2`, `heading-3`, `body`, `small` — have no Tailwind collision.
**Warning signs:** Component that uses both `text-heading-1` and `text-3xl` gets unexpected font sizes.

### Pitfall 5: CSS fallback placement
**What goes wrong:** Adding `@layer base` variable declarations as fallbacks, which creates a second declaration point, making the token system harder to audit.
**Why it happens:** Confusion between "fallback" and "default value."
**How to avoid:** Use inline fallback syntax exclusively: `var(--token, value)` at every call site. Do NOT add a second `:root` block with fallback values. The fallback is the second argument to `var()`.
**Warning signs:** Duplicate token definitions in the file.

---

## Code Examples

Verified patterns from existing codebase:

### Existing CVA pattern (compliant — reference model)
```typescript
// Source: components/sf/sf-badge.tsx
const sfBadgeVariants = cva(
  "font-mono uppercase tracking-wider text-xs",
  {
    variants: {
      intent: {
        default: "border-2 border-foreground bg-foreground text-background",
        primary: "border-2 border-primary bg-primary text-primary-foreground",
        outline: "bg-transparent text-foreground border-2 border-foreground",
        signal: "border-2 border-foreground bg-[var(--sf-yellow)] text-foreground",
      },
    },
    defaultVariants: {
      intent: "default",
    },
  }
);
```
This is the reference implementation. Any other SF component that adds CVA must match this shape.

### Tailwind v4 `@layer utilities` pattern (existing, extend this)
```css
/* Source: app/globals.css line 425 */
@layer utilities {
  .sf-border {
    border-width: 2px;
    border-color: var(--color-foreground);
  }
  /* ... add .text-heading-1 through .text-small here ... */
}
```

### Existing CSS fallback pattern (already done for VHS — replicate)
```css
/* Source: app/globals.css line 1429 */
opacity: var(--vhs-crt-opacity, 0.6);

/* Source: app/globals.css line 1494 */
opacity: var(--vhs-noise-opacity, 0.03);
```
These two lines demonstrate the exact pattern to apply to all other token usages in globals.css.

### Color tier documentation pattern (what to add to globals.css)
```css
/* ── COLOR TIERS ──────────────────────────────────────────────
   CORE (required — every new component MUST work with these 5):
     background, foreground, primary, secondary, accent

   EXTENDED (component-specific use only — do not add to this list):
     muted, card, popover, destructive, success, warning

   EXPANSION POLICY:
     New tokens require explicit architectural review.
     Adding a color = a deliberate, documented system change.
   ─────────────────────────────────────────────────────────── */
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind v3 `theme()` and `@layer` only | Tailwind v4 `@theme {}` block with CSS custom properties | Tailwind v4 release (2024) | `@theme` replaces `tailwind.config.js`; tokens are now native CSS vars |
| `tailwind.config.js` for color/typography | `@theme` in CSS file | v4 upgrade (already done) | No config file needed; everything in globals.css |
| `@apply` for utility composition | `@layer utilities` with plain CSS | v4 best practice | `@apply` still works but direct CSS is preferred |

**Deprecated/outdated:**
- `tailwind.config.js` for design tokens: replaced by `@theme` in globals.css (already migrated)
- `@apply` for complex compositions: use direct CSS properties in `@layer utilities` (already the pattern)

---

## Open Questions

1. **`signal` intent on SFButton**
   - What we know: `sf-button.tsx` has `intent: "signal"` (not in locked standard set)
   - What's unclear: Is this intentionally kept, or an oversight from pre-standard implementation?
   - Recommendation: Planner should create a task that explicitly decides: (a) keep `signal` as documented extension, or (b) migrate to `ghost`/`outline` intent + rename one usage site. Either is fine — it must be a conscious decision, not an accident.

2. **Spacing in `components/layout/global-effects.tsx`**
   - What we know: `bottom-20` appears in global-effects (scroll-top button positioning)
   - What's unclear: `bottom-20` = 80px = structural layout vs content spacing — is this exempt per the structural measurements exemption?
   - Recommendation: Treat fixed-position button placement as structural — exempt from blessed-stop enforcement. The decision log in STATE.md says "Exempt structural measurements (nav-height: 83px, border-width, etc.)."

3. **`--space-*` CSS custom property definitions**
   - What we know: CONTEXT.md says "Define `--space-*` CSS custom properties in globals.css AND map to Tailwind utilities (both)"
   - What's unclear: No `--space-*` properties currently exist. The `@theme` block would generate utility classes for these. Do they shadow existing Tailwind `space-*` utilities or coexist?
   - Recommendation: Add `--space-1` through `--space-24` in `@theme` mirroring blessed stops. In Tailwind v4, `@theme` vars prefixed `--space-` automatically generate `space-*` and spacing utilities — verify this doesn't clobber existing `p-`, `m-` utilities. LOW confidence on exact Tailwind v4 behavior for this specific case.

---

## Validation Architecture

No `config.json` found in `.planning/` — treating `nyquist_validation` as enabled (absent = enabled).

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected — no jest.config, vitest.config, or pytest.ini found |
| Config file | None (Wave 0 gap) |
| Quick run command | `grep -rE "(p\|px\|py\|m\|mx\|my\|gap\|pt\|pb\|pl\|pr\|mt\|mb\|ml\|mr)-(5\|7\|10\|11)[^0-9]" components/ --include="*.tsx"` (returns nothing = pass) |
| Full suite command | `next build` (type-check + build verification) |

**Note:** This phase is CSS/token work with no JavaScript logic to unit-test. Validation is grep-based inspection and visual QA in browser. No automated test framework is appropriate or available.

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FRM-01 | Zero non-blessed spacing values | grep-audit | `grep -rEn " (p\|px\|py\|m\|gap\|pt\|pb\|pl\|pr\|mt\|mb\|ml\|mr)-(5\|7\|10)[^0-9]" components/sf/ components/blocks/ components/layout/ --include="*.tsx"` | ❌ Wave 0 |
| FRM-02 | `.text-heading-1` through `.text-small` usable | visual-qa | `next build` (no type errors) | N/A |
| FRM-03 | Layout tokens in `:root` | grep-audit | `grep -n "max-w-content\|max-w-wide\|max-w-full\|gutter" app/globals.css` | N/A |
| FRM-04 | CSS fallbacks present | grep-audit | `grep -n "var(--color" app/globals.css \| grep -v ", "` (returns nothing = all have fallbacks) | N/A |
| FRM-05 | Color tier comment in globals.css | grep-audit | `grep -n "CORE\|EXTENDED\|EXPANSION POLICY" app/globals.css` | N/A |
| FRM-06 | No `--vhs-` without `sf-` prefix | grep-audit | `grep -n "\-\-vhs-" app/globals.css` (returns nothing after migration) | N/A |
| FRM-07 | All CVA calls have `intent` + `defaultVariants` | grep-audit | `grep -n "cva\|defaultVariants\|intent" components/sf/*.tsx` | N/A |
| FRM-08 | Print media block present | grep-audit | `grep -n "@media print" app/globals.css` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** Run the corresponding grep audit command above
- **Per wave merge:** `next build` — confirms no TypeScript errors or CSS compilation failures
- **Phase gate:** All grep audits return expected results + `next build` green before `/pde:verify-work`

### Wave 0 Gaps
- [ ] No automated test framework exists — this is by design for a CSS token phase; grep commands serve as the verification layer
- [ ] `@media print` block — does not exist yet (FRM-08)

---

## Sources

### Primary (HIGH confidence)
- Direct code inspection: `app/globals.css` (all 1500+ lines read) — current token state confirmed
- Direct code inspection: `components/sf/*.tsx` — CVA compliance status confirmed
- Direct code inspection: `components/blocks/*.tsx` — non-blessed spacing values catalogued
- Tailwind v4 architecture: `@theme` block behavior confirmed by examining existing working implementation

### Secondary (MEDIUM confidence)
- Tailwind v4 `@layer utilities` pattern: confirmed by existing codebase usage (lines 425+)
- CVA `intent` + `defaultVariants` pattern: confirmed by `sf-badge.tsx`, `sf-button.tsx`, `sf-toggle.tsx`

### Tertiary (LOW confidence)
- `--space-*` in `@theme` generating spacing utilities: plausible based on Tailwind v4 naming conventions, but not directly verified; the CONTEXT.md decision to define these may need verification during implementation

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — confirmed from package.json and existing code
- Architecture patterns: HIGH — all patterns derived from existing working code in the codebase
- Pitfalls: HIGH — derived from direct code inspection, not theoretical
- Spacing audit: HIGH — grep confirmed actual values; mapping judgment calls are LOW per individual replacement
- CVA compliance: HIGH — only 3 SF components use CVA, all already compliant

**Research date:** 2026-04-05
**Valid until:** 2026-05-05 (stable domain — CSS tokens do not change rapidly)
