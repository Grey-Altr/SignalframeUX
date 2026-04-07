# Phase 19: P2 Components - Research

**Researched:** 2026-04-06
**Domain:** SF-wrapped component authoring (NavigationMenu, Pagination, Stepper, ToggleGroup)
**Confidence:** HIGH

## Summary

Phase 19 delivers four P2 components that complete the design system's coverage: SFNavigationMenu (most complex, Radix-wrapped with mobile SFSheet collapse), SFPagination (Server Component, no Radix dependency), SFStepper (pure-SF consuming SFProgress), and SFToggleGroup (Radix-wrapped with CVA intent). All four follow the established SCAFFOLDING.md 9-point checklist and existing SF wrapper patterns from Phases 17-18.

The critical path is: SFToggleGroup and SFPagination are independent and straightforward. SFStepper depends on SFProgress (already shipped in Phase 18). SFNavigationMenu is the most complex due to Radix's data-state CSS interactions, viewport management, and mobile breakpoint collapse to SFSheet -- it must be implemented last per project decision.

**Primary recommendation:** Build in order of increasing complexity: SFToggleGroup, SFPagination, SFStepper, SFNavigationMenu (last). Each component lands as one same-commit unit (file + barrel + registry).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- SFNavigationMenu: horizontal top-level items + vertical flyout panels on desktop; collapses to SFSheet slide-out on mobile (<768px)
- SFPagination: minimal numbered page links with previous/next, no dots or ellipsis -- Server Component
- SFStepper: vertical layout with SFProgress connectors between steps, per-step error state via `status` prop
- SFToggleGroup: CVA `intent` prop with primary/ghost variants, supports exclusive (single) and multi-select modes
- SFNavigationMenu: Pattern A (Radix-wrapped), `'use client'`, meta.layer: "frame"
- SFPagination: Pattern A (Radix-free, shadcn breadcrumb-style), Server Component, meta.layer: "frame"
- SFStepper: Pattern C (pure-SF, consumes SFProgress), `'use client'`, meta.layer: "signal"
- SFToggleGroup: Pattern A (Radix-wrapped), `'use client'`, meta.layer: "frame"

### Claude's Discretion
- NavigationMenu flyout animation (CSS or GSAP)
- Stepper step numbering and icon patterns
- Pagination active page indicator styling
- ToggleGroup pressed state visual treatment

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| NAV-04 | User navigates site via SFNavigationMenu with flyout panels and defined mobile behavior | Radix NavigationMenu wrapping pattern, SFSheet mobile collapse, rounded-none audit on viewport/content/trigger, CSS animation for flyout |
| NAV-05 | User navigates paginated content via SFPagination | shadcn pagination base (install via CLI), Server Component pattern matching SFBreadcrumb, no ellipsis per decision |
| MS-01 | User completes multi-step flows via SFStepper with per-step error state | Pure-SF Pattern C, consumes SFProgress as connector, `status` prop per step, vertical layout |
| MS-03 | User selects from exclusive/multi toggle options via SFToggleGroup | Radix ToggleGroup base already installed, CVA `intent` with primary/ghost, `type="single"` vs `type="multiple"` |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| radix-ui | 1.4.3 | NavigationMenu + ToggleGroup primitives | Already installed, project standard |
| class-variance-authority | (installed) | CVA `intent` variants for ToggleGroup | Project convention for all visual variants |
| lucide-react | (installed) | ChevronDown, ChevronLeft, ChevronRight icons | Project icon library |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| shadcn pagination base | 4.1.2 | Pagination utility components | Install via `pnpm dlx shadcn@4.1.2 add pagination` |
| SFSheet (existing) | - | Mobile collapse for NavigationMenu | NavigationMenu mobile breakpoint (<768px) |
| SFProgress (existing) | - | Step connector in SFStepper | Renders between steps as visual connector |
| gsap (via @/lib/gsap-core) | 3.12 | SFProgress SIGNAL tween in Stepper context | Inherited -- SFProgress handles its own animation |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS animation for flyout | GSAP for flyout | CSS is simpler, lower bundle cost; GSAP only needed if complex stagger or timeline required. **Recommend CSS** -- flyout is a simple show/hide with optional fade/slide |
| Radix NavigationMenu viewport | viewport={false} inline | Viewport provides automatic width/height animation. Use viewport for desktop flyout panels |

**Installation:**
```bash
pnpm dlx shadcn@4.1.2 add pagination
```
No other installations needed -- navigation-menu and toggle-group bases already exist in `components/ui/`.

## Architecture Patterns

### Recommended Build Order
```
1. SFToggleGroup     (simplest -- thin Radix wrap + CVA intent)
2. SFPagination      (Server Component, no state)
3. SFStepper         (pure-SF, consumes SFProgress)
4. SFNavigationMenu  (most complex -- last per project decision)
```

### File Structure
```
components/
├── sf/
│   ├── sf-toggle-group.tsx    # 'use client', Pattern A
│   ├── sf-pagination.tsx      # NO 'use client', Pattern A (Radix-free)
│   ├── sf-stepper.tsx         # 'use client', Pattern C
│   └── sf-navigation-menu.tsx # 'use client', Pattern A
├── ui/
│   ├── toggle-group.tsx       # Already exists
│   ├── pagination.tsx         # Installed via shadcn CLI
│   └── navigation-menu.tsx    # Already exists
```

### Pattern 1: SFToggleGroup (Radix Wrap + CVA Intent)
**What:** Thin wrapper over `ui/toggle-group.tsx` replacing shadcn's `variant` prop with CVA `intent`.
**When to use:** Standard Pattern A wrapping.

The base `ui/toggle-group.tsx` uses a Context to pass `variant` and `size` down to items. The SF wrapper must:
1. Define its own CVA with `intent: { primary, ghost }` (replacing base `variant`)
2. Override the ToggleGroupContext to pass `intent` semantics
3. Support `type="single"` and `type="multiple"` (Radix native prop, pass through)
4. Apply `rounded-none` on root and items (base has `rounded-lg`)

**Key detail:** The base imports `toggleVariants` from `ui/toggle.tsx`. The SF wrapper should define its own `sfToggleGroupVariants` with `intent` key, matching the SFToggle pattern but adapted for group items.

```typescript
// Pattern: CVA intent for toggle group
const sfToggleGroupItemVariants = cva(
  "sf-pressable sf-focusable rounded-none border-2 border-foreground font-mono uppercase tracking-wider text-xs transition-colors duration-[var(--duration-fast)]",
  {
    variants: {
      intent: {
        primary: "... data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
        ghost: "... data-[state=on]:bg-foreground data-[state=on]:text-background",
      },
      size: { sm: "...", md: "...", lg: "..." },
    },
    defaultVariants: { intent: "ghost", size: "md" },
  }
);
```

### Pattern 2: SFPagination (Server Component, Radix-Free)
**What:** Wraps shadcn pagination utility components. No Radix, no hooks, no `'use client'`.
**When to use:** Same pattern as SFBreadcrumb -- thin passthrough with SF styling.

The shadcn pagination base uses `<a>` tags with `Button` (asChild). Key SF overrides:
- Remove all `rounded-*` classes, apply `rounded-none`
- Font-mono, uppercase, tracking-wider on page numbers
- Active page: `bg-foreground text-background` (inverted, DU/TDR style)
- No ellipsis (per locked decision) -- omit PaginationEllipsis from SF wrapper exports
- `<nav aria-label="pagination">` preserved for a11y

```typescript
// Server Component pattern (no 'use client')
import { Pagination, PaginationContent, ... } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

function SFPagination({ className, ...props }: React.ComponentProps<typeof Pagination>) {
  return <Pagination className={cn("font-mono", className)} {...props} />;
}
```

### Pattern 3: SFStepper (Pure-SF, Consumes SFProgress)
**What:** No Radix base. Semantic HTML + SFProgress as connector between steps.
**When to use:** Pattern C construction.

Design:
- Vertical layout with steps rendered as a list
- SFProgress instances between steps serve as visual connectors
- Each step has a `status` prop: `"pending" | "active" | "complete" | "error"`
- Error state shows destructive color on the step indicator
- `'use client'` because SFProgress uses hooks internally

```typescript
// SFStepper API shape
interface SFStepperProps {
  activeStep: number;
  children: React.ReactNode;
  className?: string;
}

interface SFStepProps {
  status?: "pending" | "active" | "complete" | "error";
  children: React.ReactNode;
  className?: string;
}

// Connector is SFProgress with value derived from step status
// complete step above → value=100, active → value=50, pending → value=0
```

### Pattern 4: SFNavigationMenu (Radix Wrap + Mobile Sheet)
**What:** Most complex component. Desktop: Radix NavigationMenu with viewport flyout. Mobile (<768px): SFSheet slide-out.
**When to use:** Site-level navigation.

Key implementation details:
- Desktop: Uses Radix NavigationMenu with `viewport={true}` for flyout panels
- Mobile: Conditionally renders SFSheet with hamburger trigger
- Uses `useMediaQuery` or CSS-only approach for breakpoint
- Must NOT break Radix focus management with class overrides

```typescript
// Desktop renders NavigationMenu with viewport
// Mobile renders SFSheet with navigation links
// Breakpoint at 768px (Tailwind md:)
```

### Anti-Patterns to Avoid
- **DO NOT re-implement SFProgress in SFStepper:** Import and use `SFProgress` directly. The tween animation comes for free.
- **DO NOT add `'use client'` to SFPagination:** It has zero client-side state. Server Component is a locked decision.
- **DO NOT use `variant` prop in SFToggleGroup:** Must be `intent` per project convention. The base uses `variant` -- the SF layer remaps it.
- **DO NOT import SFSheet inside SFNavigationMenu at top level on desktop:** Use conditional rendering or CSS display to avoid loading Sheet JS on desktop viewports.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Toggle group state | Custom selection state | Radix ToggleGroup `type="single"/"multiple"` | Handles exclusivity, keyboard nav, ARIA automatically |
| NavigationMenu flyout | Custom dropdown/popover | Radix NavigationMenu viewport | Handles animation, focus trap, dismiss on outside click |
| Mobile nav collapse | Custom responsive nav | SFSheet (already exists) | Keyboard + focus management built in |
| Step progress connectors | Custom progress bars | SFProgress (already exists) | GSAP tween, reduced-motion guard, rounded-none already handled |
| Pagination a11y | Manual ARIA on page links | shadcn Pagination base | `role="navigation"`, `aria-label`, `aria-current="page"` built in |

**Key insight:** Every complex behavior in this phase (focus management, keyboard navigation, ARIA states, animation) is already solved by existing Radix primitives or shipped SF components. The work is wrapping and styling, not behavior implementation.

## Common Pitfalls

### Pitfall 1: Radix NavigationMenu rounded classes survive --radius: 0px
**What goes wrong:** The viewport, content, trigger, link, and indicator all have `rounded-lg`, `rounded-md`, `rounded-tl-sm` classes. The global `--radius: 0px` token does NOT override these literal classes.
**Why it happens:** Tailwind literal rounded classes (`rounded-lg`) are not derived from the `--radius` CSS variable.
**How to avoid:** Apply `rounded-none` explicitly on every NavigationMenu sub-element in the SF wrapper. Audit with DevTools computed styles.
**Warning signs:** Any visible border-radius in the flyout panel or trigger.

### Pitfall 2: ToggleGroup inherits base toggleVariants with `variant` key
**What goes wrong:** The base `ui/toggle-group.tsx` imports `toggleVariants` from `ui/toggle.tsx` which uses `variant:` not `intent:`. If the SF wrapper just passes through, the prop name is wrong.
**Why it happens:** shadcn convention uses `variant`, SF convention uses `intent`.
**How to avoid:** Define custom `sfToggleGroupItemVariants` with `intent:` key in the SF wrapper. Do not pass through the base `variant` prop -- remap it.
**Warning signs:** TypeScript error if `intent` prop is exposed but base expects `variant`.

### Pitfall 3: NavigationMenu viewport width/height animation conflicts
**What goes wrong:** Radix uses `--radix-navigation-menu-viewport-height` and `--radix-navigation-menu-viewport-width` CSS variables for smooth resizing. SF overrides that break these will cause janky flyout sizing.
**Why it happens:** Aggressive class overrides on the viewport element can strip the animation classes.
**How to avoid:** Preserve the base viewport animation classes. Only add `rounded-none`, `bg-background`, `border-2 border-foreground` on top.
**Warning signs:** Flyout content area doesn't smoothly resize when switching between menu items.

### Pitfall 4: SFStepper must be `'use client'` even though it's Pattern C
**What goes wrong:** SFStepper is pure-SF (no Radix), but it renders SFProgress which is a Client Component with `useRef`/`useEffect`.
**Why it happens:** A Server Component cannot render a Client Component inline -- it needs to be a Client Component itself or accept the client component as children.
**How to avoid:** Mark SFStepper as `'use client'`. This is already noted in CONTEXT.md.
**Warning signs:** Runtime error about hooks being called in a Server Component context.

### Pitfall 5: Pagination base needs installation first
**What goes wrong:** `components/ui/pagination.tsx` does not exist yet. Attempting to build SFPagination without installing the base will fail.
**Why it happens:** Unlike navigation-menu and toggle-group, pagination was not installed in Phase 16.
**How to avoid:** Run `pnpm dlx shadcn@4.1.2 add pagination` before creating the SF wrapper.
**Warning signs:** Import error on `@/components/ui/pagination`.

### Pitfall 6: NavigationMenu mobile/desktop rendering strategy
**What goes wrong:** Rendering both desktop NavigationMenu and mobile SFSheet at all viewports wastes bundle and creates duplicate DOM.
**Why it happens:** Naive responsive approach renders both and hides one with CSS.
**How to avoid:** Use CSS `hidden md:flex` / `md:hidden` to toggle visibility. Both components still mount but only one is visible. For this phase, CSS visibility is acceptable -- the bundle cost of SFSheet is already paid (it's in the barrel). If bundle delta exceeds 5KB, investigate `next/dynamic` for the desktop nav menu.
**Warning signs:** Bundle gate exceeding 150KB after NavigationMenu.

## Code Examples

### SFToggleGroup -- CVA Intent Pattern
```typescript
// Source: Derived from existing SFToggle pattern (sf-toggle.tsx)
"use client";

import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import * as React from "react";

const sfToggleGroupItemVariants = cva(
  "sf-pressable sf-focusable rounded-none border-2 border-foreground font-mono uppercase tracking-wider text-xs transition-colors duration-[var(--duration-fast)]",
  {
    variants: {
      intent: {
        ghost: "bg-transparent text-foreground hover:bg-foreground hover:text-background data-[state=on]:bg-foreground data-[state=on]:text-background",
        primary: "bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
      },
      size: {
        sm: "h-8 min-w-8 px-3",
        md: "h-10 min-w-10 px-4",
        lg: "h-12 min-w-12 px-6",
      },
    },
    defaultVariants: { intent: "ghost", size: "md" },
  }
);
```

### SFPagination -- Server Component Pattern
```typescript
// Source: Derived from SFBreadcrumb pattern (sf-breadcrumb.tsx)
// NO 'use client' directive

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

function SFPagination({ className, ...props }: React.ComponentProps<typeof Pagination>) {
  return <Pagination className={cn("font-mono", className)} {...props} />;
}

function SFPaginationLink({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      className={cn(
        "rounded-none border-2 border-foreground uppercase tracking-wider text-xs",
        "data-[active=true]:bg-foreground data-[active=true]:text-background",
        className
      )}
      {...props}
    />
  );
}
```

### SFStepper -- Consuming SFProgress
```typescript
// Source: Pattern C (pure-SF), consumes SFProgress
"use client";

import { SFProgress } from "./sf-progress";
import { cn } from "@/lib/utils";

type StepStatus = "pending" | "active" | "complete" | "error";

function stepToProgressValue(status: StepStatus): number {
  switch (status) {
    case "complete": return 100;
    case "active": return 50;
    case "error": return 100; // full bar in destructive color
    default: return 0;
  }
}

// Connector between steps:
// <SFProgress value={stepToProgressValue(status)} className="h-6 w-1 rotate-90 ..." />
// Note: vertical progress requires rotation or custom orientation
```

### SFNavigationMenu -- Desktop + Mobile Pattern
```typescript
// Source: Radix NavigationMenu base (ui/navigation-menu.tsx) + SFSheet
"use client";

// Desktop: Radix NavigationMenu with viewport flyout
// Mobile: SFSheet with hamburger trigger
// Breakpoint strategy: CSS hidden/flex at md: (768px)

// Desktop flyout overrides:
// - Viewport: rounded-none, border-2 border-foreground, bg-background
// - Trigger: rounded-none, font-mono uppercase tracking-wider
// - Content: rounded-none
// - Link: rounded-none
// - Indicator: hidden (DU/TDR aesthetic -- no arrow indicator)
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@radix-ui/react-navigation-menu` separate pkg | `radix-ui` unified import | Radix 1.x | Import from `radix-ui` not individual packages |
| shadcn `variant` prop convention | SF `intent` prop convention | v1.0 project decision | All SF wrappers remap variant to intent |
| `data-[state=open]` for Radix states | `data-open` / `data-closed` shorthand | Radix 1.3+ | Both work; base uses mix of both |
| NavigationMenu `data-[state=open]` | `data-popup-open` + `data-open` | shadcn 4.x update | Base navigation-menu.tsx uses `data-popup-open` for trigger |

## Open Questions

1. **SFStepper vertical progress connector orientation**
   - What we know: SFProgress is horizontal by default (width-based translateX)
   - What's unclear: Vertical connectors between steps need either CSS rotation or a custom orientation prop
   - Recommendation: Use a thin vertical `<div>` with height-based fill rather than rotating SFProgress. SFProgress's GSAP tween uses xPercent which is horizontal. For vertical, either: (a) render SFProgress with `className="[writing-mode:vertical-lr]"` and test, or (b) use a simple styled div with `bg-primary` height transition and skip GSAP for the connector. Option (b) is simpler but loses the SIGNAL layer tween. **Recommend option (a) first, fall back to (b) if writing-mode breaks the tween.**

2. **NavigationMenu flyout animation: CSS vs GSAP**
   - What we know: Radix provides built-in CSS animation via data-motion attributes. The base already has slide-in/slide-out/fade-in/fade-out animations.
   - What's unclear: Whether GSAP adds meaningful value over the existing CSS animations
   - Recommendation: **Use CSS (keep Radix default animations).** The flyout animation is a simple entrance/exit -- GSAP adds bundle cost and complexity for no visual improvement. meta.layer: "frame" confirms this is not a SIGNAL component.

3. **NavigationMenu mobile: useMediaQuery hook vs CSS-only**
   - What we know: CSS `hidden md:flex` / `md:hidden` handles visibility. Both components mount.
   - What's unclear: Whether mounting both adds meaningful JS cost
   - Recommendation: **CSS-only.** SFSheet is already in the barrel and loaded. NavigationMenu primitives are lightweight. No need for a media query hook.

## Sources

### Primary (HIGH confidence)
- `components/ui/navigation-menu.tsx` -- Radix NavigationMenu base, already installed, inspected for class patterns and data attributes
- `components/ui/toggle-group.tsx` -- Radix ToggleGroup base, already installed, uses Context pattern for variant/size propagation
- `components/sf/sf-toggle.tsx` -- Existing SFToggle pattern with CVA intent, reference for SFToggleGroup
- `components/sf/sf-breadcrumb.tsx` -- Server Component wrapper pattern, reference for SFPagination
- `components/sf/sf-progress.tsx` -- GSAP tween pattern, consumed by SFStepper
- `components/sf/sf-sheet.tsx` -- Mobile collapse target for NavigationMenu
- `SCAFFOLDING.md` -- 9-point checklist, all components must pass
- `shadcn@4.1.2 pagination --dry-run --view` -- Pagination base source (130 lines, utility components, no Radix)
- radix-ui@1.4.3 -- Confirmed installed version

### Secondary (MEDIUM confidence)
- Radix NavigationMenu keyboard behavior (arrow keys between triggers, Enter/Space to open) -- from Radix docs, standard behavior

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries already installed and inspected in project
- Architecture: HIGH -- patterns directly derived from existing SF components in this project
- Pitfalls: HIGH -- based on actual code inspection of base components and known project constraints (rounded-none, intent prop, barrel rule)

**Research date:** 2026-04-06
**Valid until:** 2026-05-06 (stable -- no moving parts, all deps locked)
