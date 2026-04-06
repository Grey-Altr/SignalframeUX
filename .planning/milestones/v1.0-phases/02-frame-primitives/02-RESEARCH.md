# Phase 2: FRAME Primitives — Research

**Researched:** 2026-04-05
**Domain:** React Server Components + CVA + Tailwind v4 — layout primitive authoring
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Component API Design**
- All new primitives accept `className` for escape hatches — matches existing SFButton pattern
- All primitives use `forwardRef` to forward ref to underlying DOM element for GSAP/animation compatibility
- SFText uses polymorphic `as` prop to render as `p`, `h1`-`h6`, `span`, `label` depending on context
- Server Components by default — no `'use client'` unless interactive props needed (SFButton already needs client)

**Token Enforcement & Defaults**
- SFText enforces via TypeScript union type: `variant: "heading-1" | "heading-2" | "heading-3" | "body" | "small"` — rejects invalid values at compile time
- SFContainer defaults to `wide` (80rem) max-width; `width="content"` (42rem) for prose contexts
- SFSection defaults to `py-16` (64px) vertical spacing — blessed stop, override via `spacing` prop with blessed values only
- SFGrid defaults responsive: 1 col mobile, 2 col md, 3 col lg — override via `cols` prop

**Composition & SFButton Refinement**
- Nesting order: `SFSection > SFContainer > content` — section handles vertical spacing + data attributes, container handles max-width + gutters
- SFStack defaults to `direction="vertical"`, with `"horizontal"` available
- SFButton refinement: wire interaction feedback tokens only (`--press-scale`, `--hover-y` to CSS transitions) — no API changes
- New primitives grouped at top of `sf/index.ts` with `// Layout Primitives` comment before existing component exports

### Claude's Discretion
- Exact prop interface details beyond the locked decisions above
- Internal implementation of responsive behavior
- CSS class composition strategy within primitives
- Test/storybook examples if time permits

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PRM-01 | SFContainer primitive enforces layout tokens (max-width, gutters, responsive behavior) | `--max-w-wide`, `--max-w-content`, `--gutter`, `--gutter-sm` all exist in globals.css:root; container maps these to Tailwind utility pattern |
| PRM-02 | SFSection primitive with `data-section`, `data-section-label`, consistent vertical spacing | HTML5 section element + data attribute injection; spacing from blessed stops (`--space-16` = py-16 default) |
| PRM-03 | SFStack primitive enforcing blessed spacing stops for vertical rhythm | `gap-*` Tailwind classes mapped to blessed stops only; CVA gap variant union type enforces at compile time |
| PRM-04 | SFGrid primitive with column system and responsive breakpoints | Tailwind grid-cols with responsive modifiers; CVA cols variant + responsive prop strategy |
| PRM-05 | SFText primitive enforcing semantic typography aliases | `.text-heading-1` through `.text-small` @layer utilities already defined in globals.css; SFText applies via variant |
| PRM-06 | SFButton refinement — consistent with `intent` standard, interaction feedback tokens wired | `.sf-pressable` and `.sf-hoverable` CSS already authored; SFButton already uses `intent` CVA — refinement wires `--press-scale`, `--hover-y` to explicit transitions |
</phase_requirements>

---

## Summary

Phase 2 creates six layout primitives that enforce the Phase 1 token system by construction. Every primitive is authored in pure TypeScript + Tailwind v4 utility classes — no new CSS, no new tokens, no new dependencies. The existing codebase provides everything needed: tokens in globals.css, the CVA + cn() pattern in every existing SF component, and semantic typography utilities already in @layer utilities.

The key design principle is "easy to use correctly, hard to use wrong." SFText accepts only `"heading-1" | "heading-2" | "heading-3" | "body" | "small"` — TypeScript rejects anything else at compile time. SFContainer applies the correct max-width and gutter tokens automatically — no props needed for the default 80rem wide layout. SFSection injects `data-section` and `data-section-label` automatically so block authors don't need to remember them.

The existing blocks directory (hero.tsx, dual-layer.tsx, etc.) reveals the friction this phase resolves: sections use `clamp()` for padding, arbitrary `max-w-[440px]` values, and inline `var(--text-base)` references instead of semantic tokens. The six primitives eliminate all of that at the call site.

**Primary recommendation:** All six primitives are thin, stateless React Server Components. Zero new dependencies. CVA for type-safe variant enforcement. forwardRef on every primitive for GSAP compatibility. Write, test in the browser, done.

---

## Standard Stack

### Core (already installed — no additions needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| class-variance-authority | installed | Variant type-safety and class generation | Already used in every SF component |
| `cn()` from `lib/utils.ts` | installed | Class merging with clsx + tailwind-merge | Established pattern across all 24 SF components |
| React | 19 | forwardRef, type inference | Next.js 15.3 peer |
| TypeScript | 5.8 | Union types enforce token constraints | Already configured |

### No New Dependencies

This phase adds zero npm packages. Everything needed exists:
- CVA: already installed
- Tailwind v4 responsive utilities: already configured
- Phase 1 tokens in globals.css: the source of truth
- `cn()` in lib/utils.ts: already present

**Installation:** none required

---

## Architecture Patterns

### Component File Structure

Each primitive follows this structure, mirroring sf-button.tsx:

```
components/sf/
├── sf-container.tsx     # SFContainer — max-width + gutters
├── sf-section.tsx       # SFSection — vertical spacing + data attributes
├── sf-stack.tsx         # SFStack — flex column/row with gap
├── sf-grid.tsx          # SFGrid — CSS grid with column variants
├── sf-text.tsx          # SFText — semantic typography with polymorphic as
└── sf-button.tsx        # SFButton — REFINEMENT ONLY (already exists)
```

Barrel update in `sf/index.ts`:
```typescript
// Layout Primitives
export { SFContainer } from "./sf-container";
export { SFSection } from "./sf-section";
export { SFStack } from "./sf-stack";
export { SFGrid } from "./sf-grid";
export { SFText } from "./sf-text";
// ... existing exports below
```

### Pattern 1: CVA + forwardRef (canonical primitive shape)

Every new primitive follows this exact shape — derived from sf-button.tsx and sf-card.tsx:

```typescript
// Source: existing sf-button.tsx pattern
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import * as React from "react";

const sfContainerVariants = cva(
  // base: always-on classes applying gutter tokens
  "w-full mx-auto px-[var(--gutter-sm)] md:px-[var(--gutter)]",
  {
    variants: {
      width: {
        wide:    "max-w-[var(--max-w-wide)]",
        content: "max-w-[var(--max-w-content)]",
        full:    "max-w-[var(--max-w-full)]",
      },
    },
    defaultVariants: {
      width: "wide",
    },
  }
);

interface SFContainerProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof sfContainerVariants> {}

export const SFContainer = React.forwardRef<HTMLDivElement, SFContainerProps>(
  function SFContainer({ width, className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(sfContainerVariants({ width }), className)}
        {...props}
      />
    );
  }
);
SFContainer.displayName = "SFContainer";
```

**Why forwardRef:** GSAP targets DOM nodes via refs. If a block author wraps SFSection in a GSAP animation, `ref.current` must resolve to the underlying `<section>`. Without forwardRef, `ref` is swallowed.

**Why Server Component compatible:** No `'use client'` directive. forwardRef works in RSC context when the parent is a Client Component — the ref is passed through. Primitives themselves don't need state or effects.

### Pattern 2: Polymorphic `as` prop for SFText

SFText renders as different HTML elements depending on semantic context. The `as` prop pattern (also called "element prop" pattern) is idiomatic React for this:

```typescript
// Source: React polymorphic component pattern
type TextVariant = "heading-1" | "heading-2" | "heading-3" | "body" | "small";
type TextElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "label";

const variantClassMap: Record<TextVariant, string> = {
  "heading-1": "text-heading-1",
  "heading-2": "text-heading-2",
  "heading-3": "text-heading-3",
  "body":      "text-body",
  "small":     "text-small",
};

interface SFTextProps extends React.HTMLAttributes<HTMLElement> {
  variant: TextVariant;          // REQUIRED — no default, forces explicit choice
  as?: TextElement;              // defaults to semantic mapping below
  className?: string;
}

export const SFText = React.forwardRef<HTMLElement, SFTextProps>(
  function SFText({ variant, as, className, ...props }, ref) {
    const defaultElement: Record<TextVariant, TextElement> = {
      "heading-1": "h1",
      "heading-2": "h2",
      "heading-3": "h3",
      "body":      "p",
      "small":     "span",
    };
    const Tag = as ?? defaultElement[variant];
    return (
      <Tag
        ref={ref as React.Ref<HTMLHeadingElement>}
        className={cn(variantClassMap[variant], className)}
        {...props}
      />
    );
  }
);
```

**Critical insight:** `variant` is REQUIRED (no `defaultVariants` in CVA for SFText since the Tailwind utility classes are applied via a plain map, not CVA). TypeScript rejects `<SFText>` without a variant — which is the enforcement goal.

### Pattern 3: SFSection data attribute injection

```typescript
interface SFSectionProps extends React.ComponentProps<"section"> {
  label?: string;          // populates data-section-label
  bgShift?: boolean;       // adds data-bg-shift for GSAP ScrollTrigger color transitions
  spacing?: "8" | "12" | "16" | "24";  // blessed stop overrides — py-8/12/16/24
}

export const SFSection = React.forwardRef<HTMLElement, SFSectionProps>(
  function SFSection({ label, bgShift, spacing = "16", className, children, ...props }, ref) {
    return (
      <section
        ref={ref}
        data-section
        data-section-label={label}
        data-bg-shift={bgShift ? "" : undefined}
        className={cn(
          `py-${spacing}`,  // py-16 default = 64px blessed stop
          className
        )}
        {...props}
      >
        {children}
      </section>
    );
  }
);
```

**Note on `data-section` presence:** The attribute exists as a boolean presence marker for CSS selectors and GSAP `[data-section]` queries. Set it without a value.

### Pattern 4: SFStack blessed gap enforcement

```typescript
type BlessedGap = "1" | "2" | "3" | "4" | "6" | "8" | "12" | "16" | "24";

const sfStackVariants = cva("flex", {
  variants: {
    direction: {
      vertical:   "flex-col",
      horizontal: "flex-row flex-wrap",
    },
    gap: {
      "1":  "gap-1",   // 4px
      "2":  "gap-2",   // 8px
      "3":  "gap-3",   // 12px
      "4":  "gap-4",   // 16px
      "6":  "gap-6",   // 24px
      "8":  "gap-8",   // 32px
      "12": "gap-12",  // 48px
      "16": "gap-16",  // 64px
      "24": "gap-24",  // 96px
    },
  },
  defaultVariants: {
    direction: "vertical",
    gap: "4",
  },
});
```

**Why string keys:** Tailwind v4 gap utilities use numeric suffixes. CVA variant keys must be strings. `gap="4"` → `gap-4` (16px). The union type `"1" | "2" | "3" | "4" | "6" | "8" | "12" | "16" | "24"` is the TypeScript enforcement of blessed stops.

### Pattern 5: SFGrid responsive columns

```typescript
const sfGridVariants = cva("grid", {
  variants: {
    cols: {
      "1":    "grid-cols-1",
      "2":    "grid-cols-1 md:grid-cols-2",
      "3":    "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      "4":    "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      "auto": "grid-cols-[repeat(auto-fill,minmax(280px,1fr))]",
    },
    gap: {
      "4":  "gap-4",
      "6":  "gap-6",
      "8":  "gap-8",
    },
  },
  defaultVariants: {
    cols: "3",
    gap: "6",
  },
});
```

**Default rationale:** `cols="3"` default matches CONTEXT.md locked decision (1/md:2/lg:3 responsive). `gap="6"` (24px) is the standard grid gap from the blessed stops.

### Anti-Patterns to Avoid

- **CVA without `defaultVariants`:** Every CVA call MUST have `defaultVariants` (FRM-07 from Phase 1). Exception: SFText where `variant` is intentionally required with no default.
- **`'use client'` on layout primitives:** None of the five new primitives need client — they are purely structural. Only SFButton (pre-existing) has client behavior.
- **Arbitrary Tailwind values:** No `max-w-[440px]`, no `px-[clamp(...)]`. Use token-mapped CVA variants only. Escape hatch is `className` prop — the consumer's responsibility.
- **Inline style for token values:** Use Tailwind utility classes, not `style={{ padding: 'var(--space-4)' }}`. Tailwind v4 supports CSS custom properties in arbitrary values only as escape — primitives should not need this.
- **Omitting forwardRef:** All primitives MUST use forwardRef. GSAP requires DOM node access.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Class merging with conditional variants | Custom ternary string builder | `cn()` from lib/utils | Handles Tailwind conflict resolution via tailwind-merge |
| Variant type safety | Manual TypeScript union + if/else | CVA `cva()` + `VariantProps<>` | Generates types automatically, defaultVariants handled |
| Polymorphic element rendering | React.createElement string gymnastics | `as` prop pattern with typed element union | Clean, typed, works with forwardRef |
| Responsive grid breakpoints | Media query hooks (useMediaQuery) | Tailwind responsive prefixes in CVA variants | Zero JS, purely CSS — RSC compatible |
| Layout token application | Hardcoding px values | CSS custom properties via Tailwind arbitrary value syntax or @layer utilities | Single source of truth in globals.css |

**Key insight:** The Phase 1 token system exists precisely so primitives don't need to know pixel values. `--max-w-wide`, `--gutter`, `--gutter-sm` — apply these tokens in CVA base classes and variants. The primitive is a thin token applicator, not a layout engine.

---

## Common Pitfalls

### Pitfall 1: forwardRef TypeScript inference breaks with polymorphic `as`

**What goes wrong:** When combining forwardRef with a polymorphic `as` prop, TypeScript struggles to infer the ref type correctly. `React.forwardRef<HTMLElement, Props>` with `as="h1"` produces type mismatches on the ref cast.

**Why it happens:** forwardRef's generic binds the ref type at definition time. Polymorphic components want the ref type to change with `as`.

**How to avoid:** Cast the ref — `ref={ref as React.Ref<HTMLHeadingElement>}`. This is an accepted pattern for simple polymorphic components. Full generic polymorphism (using type parameters on forwardRef) is overkill for this use case and adds complexity. The CONTEXT.md decision is clear: `as` accepts a defined union of elements, not an open generic.

**Warning signs:** TypeScript errors on the Tag invocation referencing `ref`. Fix with explicit cast.

### Pitfall 2: Tailwind v4 purge misses dynamic CVA class strings

**What goes wrong:** CVA variants with dynamic keys like `gap: { "4": "gap-4" }` — Tailwind v4 scans source for class strings. If the class `gap-4` never appears as a static string, it may be purged.

**Why it happens:** Tailwind v4 uses static analysis. Template literals and object values are scanned but complex patterns can be missed depending on configuration.

**How to avoid:** In this project, classes like `gap-4`, `gap-6`, `py-16` are almost certainly present in existing components (the blocks already use them). The CVA variant object values are string literals — Tailwind v4 WILL scan them. Verified: the project already uses `@source not "../.planning"` in globals.css (line 5), meaning source scanning is active. No safelist needed.

**Warning signs:** Visual gaps or missing spacing in production build but correct in dev. Check by running `npx next build`.

### Pitfall 3: `data-section-label` with undefined value renders attribute

**What goes wrong:** `data-section-label={label}` when `label` is undefined renders `data-section-label=""` in the DOM — an empty attribute rather than absent attribute.

**Why it happens:** React renders `data-*={undefined}` as absent, but `data-*={null}` or `data-*=""` renders the attribute. Careful: `label` prop not passed = `undefined` = attribute absent. This is correct behavior.

**How to avoid:** `data-section-label={label ?? undefined}` — explicit undefined ensures React omits the attribute when label is not provided. The pattern `data-bg-shift={bgShift ? "" : undefined}` (presence-only boolean) is correct.

**Warning signs:** GSAP selectors `[data-section-label]` matching sections they shouldn't.

### Pitfall 4: SFButton refinement breaks existing consumers

**What goes wrong:** SFButton already has `intent: "primary" | "ghost" | "signal"` with `defaultVariants`. Wiring `--press-scale` and `--hover-y` to explicit CSS transitions changes visual behavior of existing buttons.

**Why it happens:** `.sf-pressable` class already handles this via globals.css (lines 563-577). SFButton already applies `sf-pressable` in its base class string. The "refinement" per CONTEXT.md is only to wire interaction feedback tokens — which is ALREADY DONE.

**How to avoid:** Read sf-button.tsx carefully (line 6): `"sf-pressable sf-focusable ..."` — `.sf-pressable` applies `--press-scale` and `--hover-y` via the CSS already in globals.css. PRM-06 "refinement" may be a verification task, not an implementation task. Planner should scope this as: verify `.sf-pressable` tokens are wired, confirm `intent` uses blessed values, confirm `defaultVariants` exists. No code change may be needed.

**Warning signs:** Over-engineering PRM-06. Check the actual implementation before writing code.

### Pitfall 5: Server Component with forwardRef — misunderstanding RSC rules

**What goes wrong:** Assuming forwardRef requires `'use client'`. It does not. React Server Components can export components defined with forwardRef — the constraint is that hooks (useState, useEffect, useContext) require client. forwardRef is not a hook.

**Why it happens:** Confusion between "client features" and "client directive." forwardRef is a React API available in both environments.

**How to avoid:** No `'use client'` on any new primitive. When a Client Component parent passes a `ref` prop to SFSection (a Server Component), React handles ref forwarding correctly.

---

## Code Examples

Verified patterns from existing codebase:

### Canonical SF component shape (from sf-button.tsx)
```typescript
// Source: components/sf/sf-button.tsx (lines 1-49)
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sfButtonVariants = cva(
  "sf-pressable sf-focusable font-mono uppercase ...",
  {
    variants: { intent: { primary: "...", ghost: "..." } },
    defaultVariants: { intent: "primary", size: "md" },
  }
);

interface SFButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "size">,
    VariantProps<typeof sfButtonVariants> {}

export function SFButton({ intent, size, className, ...props }: SFButtonProps) {
  return <Button className={cn(sfButtonVariants({ intent, size }), className)} {...props} />;
}
```

### Token values confirmed in globals.css (lines 165-170)
```css
/* Source: app/globals.css Phase 1 tokens */
--max-w-content: 42rem;   /* 672px */
--max-w-wide: 80rem;      /* 1280px */
--max-w-full: 100%;
--gutter: 1.5rem;         /* 24px */
--gutter-sm: 1rem;        /* 16px mobile */
```

### Semantic typography utilities confirmed (lines 502-532)
```css
/* Source: app/globals.css @layer utilities */
.text-heading-1 { font-family: var(--font-display); font-size: var(--text-3xl); font-weight: 700; line-height: 0.9; text-transform: uppercase; }
.text-heading-2 { font-family: var(--font-sans); font-size: var(--text-2xl); font-weight: 700; line-height: 1.1; }
.text-heading-3 { font-family: var(--font-sans); font-size: var(--text-xl); font-weight: 600; line-height: 1.2; }
.text-body      { font-family: var(--font-sans); font-size: var(--text-base); font-weight: 400; line-height: 1.5; }
.text-small     { font-family: var(--font-sans); font-size: var(--text-sm); font-weight: 400; line-height: 1.4; }
```

### Press feedback tokens confirmed (lines 189-193)
```css
/* Source: app/globals.css Press Feedback Tokens */
--press-scale: 0.97;
--press-y: 1px;
--hover-y: -2px;
```

### .sf-pressable already wires these (lines 563-577)
```css
/* Source: app/globals.css @layer utilities */
.sf-pressable:hover { transform: translateY(var(--hover-y)); }
.sf-pressable:active { transform: translateY(var(--press-y)) scale(var(--press-scale)); }
```

### Existing block friction to resolve (from dual-layer.tsx)
```typescript
// BEFORE (arbitrary values, no token enforcement):
<div className="px-[clamp(24px,5vw,48px)] py-[clamp(24px,5vw,60px)]">
<p className="text-[var(--text-base)] leading-[1.8] max-w-[440px]">

// AFTER (with primitives):
<SFSection label="dual-layer" spacing="16">
  <SFContainer>
    <SFText variant="body">...</SFText>
  </SFContainer>
</SFSection>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `React.FC<Props>` | `function Component(props: Props)` | React 18 (removed children from FC) | Use named function declarations |
| Class components for forwardRef | `React.forwardRef()` with function component | React 16.3 | Standard pattern since 2018 |
| `styled-components` / CSS-in-JS | Tailwind v4 utility classes + CSS custom properties | Project decision, pre-existing | Zero styled-jsx in this codebase (confirmed in STATE.md) |
| Open generic polymorphic `as` | Union-constrained `as?: TextElement` | Design decision | Simpler, sufficient for this use case |

**Deprecated/outdated for this project:**
- `React.FC` type annotation: use explicit function declaration + typed props interface
- Arbitrary Tailwind values for layout: replaced by token-backed CVA variants in Phase 2

---

## PRM-06 Specific Investigation

**Finding (HIGH confidence):** SFButton already satisfies most of PRM-06.

Evidence from sf-button.tsx line 6:
```
"sf-pressable sf-focusable font-mono uppercase tracking-wider border-2 border-foreground ..."
```

`.sf-pressable` in globals.css lines 563-577 already wires `--press-scale`, `--hover-y`, `--press-y` to CSS transforms. `.sf-hoverable` is separate (for cards). SFButton uses the correct class.

`intent` is already the CVA prop name (line 9). `defaultVariants` already set (line 26-29).

**Remaining work for PRM-06:** Verify the `transition-colors` class on SFButton is not overriding or conflicting with the transform transitions from `.sf-pressable`. Current base class has `transition-colors duration-[var(--duration-normal)]` — this applies to color properties only, which does not conflict with transform-based press feedback. No conflict exists.

**Planner should scope PRM-06 as:** Audit + verification task, with one potential micro-fix: ensure transition shorthand on SFButton does not suppress the transform transition from `.sf-pressable`. The fix, if needed, is replacing `transition-colors` with explicit transition property list.

---

## Open Questions

1. **SFButton `signal` intent — keep or remove?**
   - What we know: sf-button.tsx line 14-17 documents `signal` as "pre-standard extension — kept for SignalframeUX brand accent usage" with a comment
   - What's unclear: PRM-06 says "consistent with new `intent` standard" — does this mean removing `signal`? The comment explicitly documents it as an intentional extension.
   - Recommendation: Keep `signal` intent as-is. The existing comment is the documentation. Removing it would break existing consumers. PRM-06 "consistent with intent standard" means ensuring `defaultVariants` exists (it does) and the prop is named `intent` (it is).

2. **SFContainer: should it render `<div>` or `<main>`?**
   - What we know: Locked as a width/gutter primitive, nesting under SFSection
   - What's unclear: HTML semantics — `<main>` can only appear once per page; `<div>` is the safe default
   - Recommendation: Render `<div>` by default. Add an optional `as` prop if needed (Claude's discretion). The `<section>` semantic belongs to SFSection, not SFContainer.

3. **SFGrid gap: should it accept the full blessed stop set?**
   - What we know: CONTEXT.md says Claude's discretion on "exact prop interface details"
   - What's unclear: Whether gap-1, gap-2, gap-3 make sense for grids
   - Recommendation: Limit SFGrid gap to `"4" | "6" | "8"` — these are the practical grid gaps. SFStack handles tight spacing with the full blessed set. Grid gaps below 16px create unusably cramped multi-column layouts for this aesthetic.

---

## Validation Architecture

> `nyquist_validation` key is absent from `.planning/config.json` — treating as enabled.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — no jest.config, vitest.config, or test directories found |
| Config file | Wave 0 gap — must be created |
| Quick run command | TBD — see Wave 0 Gaps |
| Full suite command | TBD — see Wave 0 Gaps |

**Assessment:** This project has no automated test infrastructure. Phase 2 primitives are pure rendering components with no async behavior or side effects, making them excellent candidates for snapshot or render tests. However, given CLAUDE.md's "DO NOT introduce complexity" constraint and the project's aesthetic focus, the validation strategy should be minimal: TypeScript compilation as primary enforcement (the variant union types ARE the tests), plus visual browser QA as specified in CLAUDE.md ("Render examples → evaluate alignment/spacing/hierarchy/clarity → fix → re-test").

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PRM-01 | SFContainer renders at correct max-width with gutters | TypeScript compile + visual QA | `npx tsc --noEmit` | ❌ Wave 0 |
| PRM-02 | SFSection injects data-section, data-section-label | TypeScript compile + visual QA | `npx tsc --noEmit` | ❌ Wave 0 |
| PRM-03 | SFStack enforces blessed gap values via TypeScript | TypeScript compile | `npx tsc --noEmit` | ❌ Wave 0 |
| PRM-04 | SFGrid responsive columns render correctly | Visual QA at mobile/md/lg viewports | manual | N/A |
| PRM-05 | SFText rejects invalid variant at compile time | TypeScript compile | `npx tsc --noEmit` | ❌ Wave 0 |
| PRM-06 | SFButton press/hover feedback tokens wired | Visual QA — press and hover in browser | manual | N/A |

### Sampling Rate
- **Per task commit:** `npx tsc --noEmit` (TypeScript check — catches variant misuse)
- **Per wave merge:** `npx tsc --noEmit && npx next build` (full build verification)
- **Phase gate:** Full TypeScript clean + Next.js build passes + visual QA in browser at 3 breakpoints

### Wave 0 Gaps
- [ ] No test framework — TypeScript compilation via `npx tsc --noEmit` is the primary automated enforcement
- [ ] Next.js build check via `npx next build` catches Tailwind class purging and RSC boundary issues
- [ ] No unit test files needed — the CVA union types enforce correctness at authoring time, not runtime

*(Note: Given CLAUDE.md's "DO NOT introduce complexity" constraint, adding a full test framework like Vitest is explicitly out of scope. TypeScript is the test layer for constraint enforcement. Visual QA is the test layer for layout correctness.)*

---

## Sources

### Primary (HIGH confidence)
- `/Users/greyaltaer/code/projects/SignalframeUX/app/globals.css` — Phase 1 tokens verified: spacing, layout, typography utilities, press feedback tokens, all confirmed present
- `/Users/greyaltaer/code/projects/SignalframeUX/components/sf/sf-button.tsx` — Canonical CVA + cn() + className + barrel pattern confirmed
- `/Users/greyaltaer/code/projects/SignalframeUX/components/sf/sf-card.tsx` — forwardRef-adjacent pattern, conditional class composition confirmed
- `/Users/greyaltaer/code/projects/SignalframeUX/components/sf/index.ts` — Barrel export structure confirmed, 24 existing exports
- `/Users/greyaltaer/code/projects/SignalframeUX/.planning/phases/02-frame-primitives/02-CONTEXT.md` — All locked decisions read directly

### Secondary (MEDIUM confidence)
- `/Users/greyaltaer/code/projects/SignalframeUX/components/blocks/dual-layer.tsx` — Confirmed the layout friction (clamp() padding, arbitrary max-widths) that primitives must solve
- `/Users/greyaltaer/code/projects/SignalframeUX/components/blocks/hero.tsx` — Confirmed existing patterns and data-anim attribute usage
- `/Users/greyaltaer/code/projects/SignalframeUX/.planning/STATE.md` — Confirmed zero styled-jsx, GSAP bundle split, CVA intent standard decisions

### Tertiary (LOW confidence)
- None — all findings verified against actual codebase files

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified from package.json-equivalent evidence in existing component imports; CVA and cn() confirmed in use
- Architecture patterns: HIGH — derived directly from sf-button.tsx (canonical) and sf-card.tsx (secondary pattern); both read directly
- Token values: HIGH — read directly from globals.css :root block
- Pitfalls: HIGH — derived from direct code inspection of existing blocks showing friction patterns + TypeScript/React known behaviors
- PRM-06 status: HIGH — sf-button.tsx and .sf-pressable class both read directly; finding that most of PRM-06 is already implemented is verified

**Research date:** 2026-04-05
**Valid until:** Stable — no external dependencies introduced; valid until globals.css tokens change
