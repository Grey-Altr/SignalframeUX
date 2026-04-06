# SF Component Scaffolding

> Reference for creating new SF-wrapped components.
> Every section answers a concrete construction question.
> Do not expand this into a style guide — keep it a scaffolding spec.

---

## 1. File Structure

SF components live in `components/sf/`. One component per file. Compound sub-components are co-located in the same file.

```
components/sf/
├── sf-{name}.tsx        # Component file — kebab-case filename
├── index.ts             # Barrel export — single import point for consumers
└── ...
```

**Naming rules:**
- Filename: `sf-{name}.tsx` (kebab-case, sf- prefix)
- Export name: `SF{Name}` (PascalCase, SF prefix)
- Examples: `sf-button.tsx` → `SFButton`, `sf-scroll-area.tsx` → `SFScrollArea`

Compound components (e.g. Card with header/content/footer) are co-located in the same file as the primary export. They follow the same naming convention: `SFCardHeader`, `SFCardContent`, etc.

---

## 2. Canonical Pattern

Three sub-patterns exist in the codebase. Choose based on whether a Radix UI base component applies.

### Pattern A — Radix-based wrapper

**Use when:** A Radix UI/shadcn `ui/` base component exists for the element (buttons, inputs, dialogs, tabs, etc.).

**Default pattern for new interactive components.**

```tsx
// sf-button.tsx — annotated Pattern A

import { Button } from "@/components/ui/button";            // ← Import from ui/, never in consumer code
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// CVA call: base classes first, then variants object, then defaultVariants
const sfButtonVariants = cva(
  "sf-pressable sf-focusable font-mono uppercase tracking-wider border-2 border-foreground",
  {
    variants: {
      intent: {                                               // ← "intent" is the standard variant prop name
        primary: "bg-primary text-primary-foreground hover:bg-foreground hover:text-background",
        ghost:   "bg-transparent text-foreground hover:bg-foreground hover:text-background",
        signal:  "bg-foreground text-background border-primary hover:bg-primary",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-6 text-sm",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-12 text-lg",
      },
    },
    defaultVariants: {                                        // ← Required on every CVA call
      intent: "primary",
      size: "md",
    },
  }
);

// Interface: Omit conflicting base props, add VariantProps
interface SFButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "size">,
    VariantProps<typeof sfButtonVariants> {}

// Named function export (not arrow function) — TypeScript surfaces JSDoc correctly
export function SFButton({ intent, size, className, ...props }: SFButtonProps) {
  return (
    <Button
      className={cn(sfButtonVariants({ intent, size }), className)}  // ← className appended, never replaces
      {...props}                                                       // ← ...props spread last
    />
  );
}
```

### Pattern B — Native element with forwardRef

**Use when:** No Radix UI base applies. Primarily layout primitives (SFContainer, SFSection, SFStack, SFGrid).

**Default pattern for new layout primitives.**

```tsx
// sf-container.tsx — annotated Pattern B

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import React from "react";

const sfContainerVariants = cva(
  "w-full mx-auto px-[var(--gutter-sm)] md:px-[var(--gutter)]",
  {
    variants: {
      width: {
        wide:    "max-w-[var(--max-w-wide)]",
        content: "max-w-[var(--max-w-content)]",
        full:    "max-w-[var(--max-w-full)]",
      },
    },
    defaultVariants: { width: "wide" },                       // ← Required on every CVA call
  }
);

interface SFContainerProps
  extends React.ComponentProps<"div">,                        // ← Extend native element props
    VariantProps<typeof sfContainerVariants> {}

// forwardRef with named inner function — required for GSAP targeting compatibility
const SFContainer = React.forwardRef<HTMLDivElement, SFContainerProps>(
  function SFContainer({ width, className, ...props }, ref) {  // ← Named function (not arrow)
    return (
      <div
        ref={ref}
        className={cn(sfContainerVariants({ width }), className)}
        {...props}                                              // ← ...props spread last
      />
    );
  }
);

SFContainer.displayName = "SFContainer";                      // ← Required on Pattern B/C

export { SFContainer };                                        // ← Named export (not default)
```

### Pattern C — Polymorphic forwardRef

**Use when:** The component renders different element tags based on a prop (`as` prop). Currently SFText only.

```tsx
// sf-text.tsx — annotated Pattern C

import { cn } from "@/lib/utils";
import React from "react";

// Plain Record maps (not CVA) when a single dimension maps string → string
const variantClassMap: Record<TextVariant, string> = {
  "heading-1": "text-heading-1",
  "heading-2": "text-heading-2",
  "heading-3": "text-heading-3",
  body:        "text-body",
  small:       "text-small",
};

const defaultElementMap: Record<TextVariant, TextElement> = {
  "heading-1": "h1",
  "heading-2": "h2",
  "heading-3": "h3",
  body:        "p",
  small:       "span",
};

interface SFTextProps extends React.HTMLAttributes<HTMLElement> {
  variant: TextVariant;
  as?: TextElement;                                            // ← Optional element override
  className?: string;
}

const SFText = React.forwardRef<HTMLElement, SFTextProps>(
  function SFText({ variant, as, className, ...props }, ref) {
    const Tag = as ?? defaultElementMap[variant];
    return (
      <Tag
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as React.Ref<any>}                           // ← Accepted TypeScript limitation (see note)
        className={cn(variantClassMap[variant], className)}
        {...(props as React.HTMLAttributes<HTMLElement>)}
      />
    );
  }
);

SFText.displayName = "SFText";

export { SFText };
```

**TypeScript note on Pattern C:** `React.Ref<any>` is an accepted limitation. TypeScript cannot narrow `React.Ref<HTMLElement>` down to the union of all possible element ref types. This is a structural TypeScript limitation, not a design error. Do not attempt to fix it — the cast is documented intentionally.

---

## 3. CVA Shape

Standard CVA shape for all SF components:

```tsx
const sfXVariants = cva(
  "...base classes...",        // Space-separated Tailwind classes, no variants here
  {
    variants: {
      intent: {                // "intent" is the standard primary variant prop name
        primary: "...",
        ghost:   "...",
        // Add values as needed — do not add "signal" unless it's a brand-specific accent
      },
      size: {                  // Optional — only if the component has meaningful size variation
        sm: "...",
        md: "...",
        lg: "...",
      },
    },
    defaultVariants: {         // Required — every CVA call must have defaultVariants
      intent: "primary",
      size: "md",
    },
  }
);
```

**Rules:**
- `intent` is the standard variant prop name for primary visual differentiation
- `defaultVariants` is required on every CVA call — never omit it
- Use `VariantProps<typeof sfXVariants>` in the interface to type variant props
- CVA is for multi-class responsive variants. For a single-dimension string → class map, use a plain `Record` (see Pattern C)
- Numeric string keys for column/count variants: `"1"`, `"2"`, `"3"` — allows multi-class values without ambiguity

---

## 4. Required Props

Every SF component MUST accept these:

| Prop | Rule |
|------|------|
| `className` | Always accepted. Merged via `cn()` — appended after variant classes, never replaces base classes |
| `...props` | Spread last in the JSX return, after all explicit props |
| `ref` | Required on Pattern B and C via `React.forwardRef`. Pattern A inherits ref forwarding from Radix base |

**Class merge rule:** `cn(sfXVariants({ intent, size }), className)` — variant classes come first, `className` appended. This allows consumers to override individual properties without losing the variant contract.

**forwardRef rule:** Pattern B and C require `React.forwardRef` with a named inner function (not an arrow function). The named inner function is required for GSAP targeting compatibility and React DevTools display.

---

## 5. Data Attributes

SF components may carry these attributes for layout and SIGNAL layer targeting:

| Attribute | Type | Applied by | Read by | Notes |
|-----------|------|------------|---------|-------|
| `data-section` | presence (no value) | SFSection | CSS, layout rules | Always present on SFSection render |
| `data-section-label` | string | SFSection `label` prop | CSS `::before` pseudo | Omitted when `label` is undefined |
| `data-bg-shift` | presence (`value=""`) | SFSection `bgShift` prop | ScrollTrigger GSAP | Use `value=""` pattern for boolean presence; omit via `undefined` |
| `data-anim` | string value | blocks/pages (not SF layer) | `components/animation/` | The FRAME→SIGNAL handoff point |

**Bridge rule:** `[data-anim]` is the handoff from the FRAME layer to the SIGNAL layer. The value string identifies which SIGNAL behavior to attach (e.g. `data-anim="section-reveal"`, `data-anim="page-heading"`). SF components do not set `[data-anim]` — it is applied by blocks and pages.

**Boolean presence pattern:** For `data-bg-shift`, use `data-bg-shift={bgShift ? "" : undefined}`. When the value is `undefined`, React omits the attribute entirely from the DOM. Do not use `data-bg-shift={false}` — React renders the attribute as the string `"false"`.

---

## 6. Import Boundary

The codebase has three component layers with strict import rules:

```
components/
├── ui/          # shadcn base — DO NOT import directly in consumer code
├── sf/          # FRAME layer — deterministic, stable API, JSDoc'd
│   └── index.ts # Single import point for all consumers
├── animation/   # SIGNAL layer — generative, GSAP-driven, no Radix base
├── blocks/      # Page sections — consume sf/ and animation/
└── layout/      # Nav, footer, chrome
```

**Layer definitions:**

| Layer | Directory | Characteristics |
|-------|-----------|-----------------|
| FRAME | `components/sf/` | Deterministic output. Stable API. Semantic HTML. Enforces token system. |
| SIGNAL | `components/animation/` | Generative and parametric. GSAP-driven. Data-driven color and motion. |
| shadcn base | `components/ui/` | Radix primitives. Never imported by consumer code directly. |

**Import rules:**
- Consumer code (blocks, pages, layout) imports from `@/components/sf` barrel only
- `components/ui/` is imported only by `components/sf/` files — never by consumers
- `components/animation/` is consumed directly by blocks and pages, not re-exported through sf/
- No runtime enforcement — these rules are enforced by convention and documentation

**Bridge:** `[data-anim]` attribute is the bridge between FRAME and SIGNAL. SF components render the DOM structure; animation components select and animate elements via `[data-anim]` selectors. The SIGNAL layer reads the attribute; the FRAME layer does not know about the SIGNAL layer.

```tsx
// CORRECT — consumer imports from barrel
import { SFButton, SFContainer } from "@/components/sf";

// WRONG — do not import ui/ directly in consumer code
import { Button } from "@/components/ui/button";

// CORRECT — animation components imported directly (not through sf/)
import { ColorCycleFrame } from "@/components/animation/color-cycle-frame";
```

---

## 7. Barrel Export

All SF components are re-exported from `components/sf/index.ts`. This is the single import surface for the entire FRAME layer.

**Rules:**
- Named exports only — no default exports
- Layout Primitives section at the top, separated by a comment
- Alphabetical within each section
- New layout primitives go under `// Layout Primitives`
- New interactive components go after the layout section, alphabetically

**Current barrel structure:**

```ts
// index.ts

// Layout Primitives
export { SFContainer } from "./sf-container";
export { SFSection }   from "./sf-section";
export { SFStack }     from "./sf-stack";
export { SFGrid }      from "./sf-grid";
export { SFText, type TextVariant } from "./sf-text";

// Interactive components (alphabetical)
export { SFButton }    from "./sf-button";
export { SFCard, SFCardHeader, SFCardTitle, ... } from "./sf-card";
// ...
```

**When adding a new component:**
1. Create `components/sf/sf-{name}.tsx`
2. Add the export to `components/sf/index.ts` in the correct section, alphabetically
3. Verify the import works from `@/components/sf` before committing
