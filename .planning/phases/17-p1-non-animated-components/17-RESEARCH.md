# Phase 17: P1 Non-Animated Components - Research

**Researched:** 2026-04-06
**Domain:** SF-wrapped component authoring (Radix UI + shadcn + CVA + Tailwind v4)
**Confidence:** HIGH

## Summary

Phase 17 delivers seven FRAME-layer components: SFAvatar, SFBreadcrumb, SFEmptyState, SFAlertDialog, SFAlert, SFCollapsible, and SFStatusDot. Five follow Pattern A (Radix-wrapped via shadcn base) and two follow Pattern C (pure-SF construction). All patterns are well-established in the codebase with 29 existing SF wrappers as reference.

The primary risk is mechanical: each component must pass the 9-point SCAFFOLDING.md checklist, and two shadcn bases (alert, breadcrumb) are not yet installed and must be added before wrapping. The `rounded-none` audit is critical for Avatar (5 elements with `rounded-full`) and AlertDialog (content + footer with `rounded-xl`/`rounded-b-xl`). SFStatusDot has a minimal GSAP pulse that must respect `prefers-reduced-motion`. SFEmptyState is the most design-intensive component, requiring Bayer dither texture and optional ScrambleText integration.

**Primary recommendation:** Batch installation of missing shadcn bases first, then implement components in dependency order: simpler passthrough wrappers (Collapsible, Breadcrumb, Avatar) before design-intensive ones (Alert, AlertDialog, EmptyState, StatusDot).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- SFEmptyState gets full glitch/noise texture treatment -- Bayer dither pattern background, monospace text, high visual tension matching hero SIGNAL aesthetic
- SFAlert color mapping uses existing tokens: info=primary, warning=accent, destructive=destructive, success=success -- no new tokens
- SFStatusDot is 8px square (matches 4px grid), solid fill, no border
- SFAvatar fallback icon is Lucide User at 60% container size, foreground color
- SFAlertDialog loading state via `loading` boolean prop on confirm trigger -- disables button + shows spinner
- SFEmptyState uses `action` slot + `title` prop with optional `scramble` boolean for ScrambleText treatment
- SFBreadcrumb separator is forward slash `/` in monospace -- DU/TDR minimalism
- SFCollapsible uses `asChild` on trigger (Radix default) -- user provides their own button
- New components added to ComponentsExplorer under their category groups -- no separate demo pages
- SFStatusDot GSAP pulse uses `--duration-normal` (200ms) with `--ease-default` -- subtle, not distracting
- Registry meta.pattern: Pattern A (Radix-wrapped) for Avatar, Breadcrumb, AlertDialog, Alert, Collapsible; Pattern C (pure-SF) for EmptyState and StatusDot

### Claude's Discretion
- Internal implementation details for each wrapper (cn() class composition, prop forwarding)
- JSDoc content beyond required fields
- ComponentsExplorer entry descriptions and ordering within categories

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| NAV-01 | SFAvatar -- square, Radix fallback chain (image -> initials -> icon) | Pattern A wrap over `ui/avatar.tsx`. Base already installed. 5 sub-elements need `rounded-none` override (documented in BASELINE.md). Lucide `User` icon at 60% size for fallback. `'use client'` required (base has it). |
| NAV-02 | SFBreadcrumb -- Server Component | shadcn `breadcrumb` base NOT yet installed -- must `pnpm dlx shadcn@4.1.2 add breadcrumb` first. Separator override to monospace `/`. Check base for `'use client'` -- if absent, wrapper can be Server Component. |
| NAV-03 | SFEmptyState -- optional ScrambleText SIGNAL treatment | Pattern C (pure-SF). No Radix base. Semantic HTML div with `title` prop, `action` ReactNode slot, optional `scramble` boolean. When `scramble=true`, wrap title in `<ScrambleText>` from `components/animation/scramble-text.tsx`. Bayer dither background via CSS. Needs `'use client'` only if `scramble` is used -- consider conditional rendering or always client. |
| FD-04 | SFAlertDialog -- loading state support | Pattern A wrap over `ui/alert-dialog.tsx`. Base already installed. `rounded-xl` on content and `rounded-b-xl` on footer need override. Add `loading` boolean to SFAlertDialogAction -- disables button, shows inline spinner. `'use client'` required. |
| FD-05 | SFAlert -- intent variants (info, warning, destructive, success) | shadcn `alert` base NOT yet installed -- must `pnpm dlx shadcn@4.1.2 add alert` first. CVA with `intent` key mapping to existing color tokens: info=primary, warning=accent, destructive=destructive, success=success. Check base for rounded classes. |
| FD-06 | SFCollapsible | Pattern A wrap over `ui/collapsible.tsx`. Base already installed. Per BASELINE.md: no rounded overrides needed. Thin passthrough -- `asChild` flows through props. `'use client'` required (base has it). Simplest component in this phase. |
| MS-02 | SFStatusDot -- GSAP pulse on active state | Pattern C (pure-SF). 8px square div, solid fill, no border. When `active` prop is true, GSAP pulse animation using `--duration-normal` (200ms) and `--ease-default`. Must guard with `prefers-reduced-motion` check before creating tween. `'use client'` required for GSAP. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| radix-ui | latest (monorepo) | Accessible primitives for Avatar, AlertDialog, Collapsible | Already installed, all bases use `from "radix-ui"` import |
| shadcn | 4.1.2 (pinned) | Base component generation | Pinned version per SCAFFOLDING.md to avoid class pattern drift |
| class-variance-authority | installed | CVA variants with `intent` key | Project standard for all visual variant props |
| tailwindcss | v4 | Utility classes, `@theme` tokens | Token source of truth in `app/globals.css` |
| lucide-react | installed | Icons (User for Avatar fallback, alert icons) | Project standard icon library |
| gsap | 3.12 | StatusDot pulse animation only | Already installed, used by ScrambleText and other SIGNAL components |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @/lib/utils (cn) | project | Class merging | Every SF wrapper's className composition |
| @/components/animation/scramble-text | project | Text scramble effect | SFEmptyState when `scramble` prop is true |

### Alternatives Considered
None -- all libraries are locked project decisions.

**Installation (missing shadcn bases):**
```bash
pnpm dlx shadcn@4.1.2 add alert breadcrumb
```

## Architecture Patterns

### Component File Structure
```
components/
├── ui/
│   ├── alert.tsx          # NEW - shadcn base (to install)
│   ├── alert-dialog.tsx   # EXISTS - shadcn base
│   ├── avatar.tsx         # EXISTS - shadcn base
│   ├── breadcrumb.tsx     # NEW - shadcn base (to install)
│   └── collapsible.tsx    # EXISTS - shadcn base
├── sf/
│   ├── sf-alert.tsx       # NEW - Pattern A
│   ├── sf-alert-dialog.tsx # NEW - Pattern A
│   ├── sf-avatar.tsx      # NEW - Pattern A
│   ├── sf-breadcrumb.tsx  # NEW - Pattern A
│   ├── sf-collapsible.tsx # NEW - Pattern A
│   ├── sf-empty-state.tsx # NEW - Pattern C
│   ├── sf-status-dot.tsx  # NEW - Pattern C
│   └── index.ts           # UPDATE - add exports under category comments
├── animation/
│   └── scramble-text.tsx  # EXISTS - used by SFEmptyState
```

### Pattern A: Radix Wrap (5 components)
**What:** Thin passthrough over shadcn/Radix base with `cn()` class overrides.
**When to use:** Avatar, Breadcrumb, AlertDialog, Alert, Collapsible.
**Reference implementation:** `sf-dialog.tsx` (compound component), `sf-button.tsx` (single component with CVA).

```typescript
// Pattern A -- compound component (AlertDialog, Avatar, Breadcrumb, Collapsible)
"use client";

import { ComponentBase, ComponentBaseSub } from "@/components/ui/component-base";
import { cn } from "@/lib/utils";

function SFComponentBase({ className, ...props }: React.ComponentProps<typeof ComponentBase>) {
  return (
    <ComponentBase
      className={cn("rounded-none [sf-specific-classes]", className)}
      {...props}
    />
  );
}

// Pattern A -- single component with CVA (Alert)
import { cva, type VariantProps } from "class-variance-authority";

const sfAlertVariants = cva("[base-classes]", {
  variants: {
    intent: {
      info: "[primary-based-classes]",
      warning: "[accent-based-classes]",
      destructive: "[destructive-based-classes]",
      success: "[success-based-classes]",
    },
  },
  defaultVariants: { intent: "info" },
});
```

### Pattern C: Pure SF Construction (2 components)
**What:** No Radix base. Semantic HTML + Tailwind tokens + optional CVA.
**When to use:** SFEmptyState, SFStatusDot.
**Reference implementation:** `sf-text.tsx`, `sf-container.tsx`.

```typescript
// Pattern C -- SFStatusDot (client component with GSAP)
"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SFStatusDotProps {
  active?: boolean;
  className?: string;
}

export function SFStatusDot({ active = false, className }: SFStatusDotProps) {
  const ref = useRef<HTMLDivElement>(null);
  // GSAP pulse when active -- guarded by prefers-reduced-motion
  // ...
  return <div ref={ref} className={cn("size-2 bg-foreground", className)} />;
}
```

### Anti-Patterns to Avoid
- **Adding `'use client'` to `sf/index.ts`:** Barrel must remain directive-free. Each wrapper declares its own directive.
- **Using `variant` instead of `intent`:** CVA visual variant key is always `intent` per prop vocabulary.
- **Forgetting `rounded-none` on Radix sub-elements:** `--radius: 0px` does NOT override literal `rounded-full`/`rounded-xl` classes. Must be explicit.
- **Creating separate demo pages:** All showcase entries go into ComponentsExplorer COMPONENTS array.
- **Partial commits:** Component file + barrel export + registry entry must land in the SAME commit.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Avatar fallback chain | Custom image-load detection | Radix Avatar primitives (Image + Fallback) | Handles loading states, error fallback, delayed rendering automatically |
| AlertDialog focus trap | Manual focus management | Radix AlertDialog (built-in focus trap + return) | Edge cases with nested portals, screen readers, iOS Safari |
| Collapsible animation | CSS height transition or manual GSAP | Radix Collapsible (handles `data-state` + CSS transition) | Height animation on auto-height content is notoriously fragile |
| Text scramble effect | Custom character-swap implementation | Existing `ScrambleText` component | Already built, tested, and uses GSAP ScrambleTextPlugin |
| Accessible alert role | Manual `role="alert"` + `aria-live` | shadcn Alert base (uses semantic `<div role="alert">`) | Correct ARIA implementation with proper live region behavior |

**Key insight:** Every Pattern A component inherits Radix's accessibility primitives (focus management, ARIA roles, keyboard handling) for free. The SF wrapper's only job is visual styling.

## Common Pitfalls

### Pitfall 1: Avatar rounded-full Survival
**What goes wrong:** Avatar renders with circular shape despite `--radius: 0px` global token.
**Why it happens:** `ui/avatar.tsx` has `rounded-full` on Root (x2 including `after:` pseudo), Image, Fallback, Badge, and GroupCount -- 5 elements total.
**How to avoid:** Apply `rounded-none` AND `after:rounded-none` on Root. Apply `rounded-none` on Image, Fallback, Badge, GroupCount individually in the SF wrapper.
**Warning signs:** Any circular element in DevTools computed styles showing `border-radius: 50%`.

### Pitfall 2: AlertDialog Content rounded-xl
**What goes wrong:** AlertDialog modal has visible rounded corners.
**Why it happens:** `ui/alert-dialog.tsx` has `rounded-xl` on Content and `rounded-b-xl` on Footer.
**How to avoid:** Override both in SFAlertDialogContent and SFAlertDialogFooter with `rounded-none`.
**Warning signs:** Modal corners visually different from SFDialog (which already has this fix).

### Pitfall 3: Alert Base Not Installed
**What goes wrong:** Import from `@/components/ui/alert` fails at build time.
**Why it happens:** Phase 16 installed 7 bases (accordion, alert-dialog, avatar, navigation-menu, progress, collapsible, toggle-group) but NOT `alert` or `breadcrumb`.
**How to avoid:** Run `pnpm dlx shadcn@4.1.2 add alert breadcrumb` before writing any SF wrapper for these.
**Warning signs:** TypeScript module resolution error on `@/components/ui/alert`.

### Pitfall 4: SFEmptyState Client Boundary
**What goes wrong:** SFEmptyState forces client-side rendering even when `scramble` is false.
**Why it happens:** If the component imports ScrambleText at the top level, it pulls in GSAP and becomes a Client Component.
**How to avoid:** The component must be `'use client'` because the `scramble` prop conditionally renders ScrambleText (which is itself a client component). Accept the client boundary -- it is an interactive component when scramble is active.
**Warning signs:** Unexpectedly large bundle contribution from EmptyState.

### Pitfall 5: SFAlertDialog Loading Prop on Wrong Sub-Component
**What goes wrong:** Loading state applied to the wrong element, or spinner not visible.
**Why it happens:** AlertDialog has Action and Cancel sub-components. Loading should only apply to Action (the confirm/destructive action).
**How to avoid:** Add `loading` prop only to `SFAlertDialogAction`. When `loading=true`: set `disabled`, show an inline spinner (CSS animation or Lucide Loader2 with `animate-spin`), optionally hide button text.
**Warning signs:** Cancel button also disabled, or loading state on wrong button.

### Pitfall 6: StatusDot GSAP Tween Without Cleanup
**What goes wrong:** GSAP tween leaks when component unmounts or `active` changes.
**Why it happens:** `useEffect` creates a tween but doesn't kill it on cleanup.
**How to avoid:** Store tween reference and call `.kill()` in useEffect cleanup. Or use `useGSAP` from `@/lib/gsap-split` which handles context cleanup automatically.
**Warning signs:** Console warnings about tweening unmounted elements, or pulse continuing after `active` goes false.

### Pitfall 7: Breadcrumb Server Component Assumption
**What goes wrong:** Breadcrumb wrapper has `'use client'` when it shouldn't.
**Why it happens:** Developer assumes all Radix components need client directive.
**How to avoid:** Check the installed `ui/breadcrumb.tsx` for `'use client'` at line 1. shadcn Breadcrumb may be Server Component-compatible (it uses semantic HTML, not Radix state). Verify after installation.
**Warning signs:** Breadcrumb appearing in client chunks in bundle analyzer output.

## Code Examples

### SFAlert with CVA Intent Variants
```typescript
// Source: Project pattern from sf-badge.tsx + CONTEXT.md color mapping
"use client";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sfAlertVariants = cva(
  "rounded-none border-2 font-mono text-sm",
  {
    variants: {
      intent: {
        info: "border-primary bg-primary/10 text-foreground [&>svg]:text-primary",
        warning: "border-accent bg-accent/10 text-foreground [&>svg]:text-accent-foreground",
        destructive: "border-destructive bg-destructive/10 text-foreground [&>svg]:text-destructive",
        success: "border-success bg-success/10 text-foreground [&>svg]:text-success",
      },
    },
    defaultVariants: { intent: "info" },
  }
);
```

### SFAvatar with rounded-none Enforcement
```typescript
// Source: BASELINE.md rounded-* audit + sf-dialog.tsx pattern
"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

function SFAvatar({ className, ...props }: React.ComponentProps<typeof Avatar>) {
  return (
    <Avatar
      className={cn("rounded-none after:rounded-none", className)}
      {...props}
    />
  );
}

function SFAvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarImage>) {
  return <AvatarImage className={cn("rounded-none", className)} {...props} />;
}

function SFAvatarFallback({ className, children, ...props }: React.ComponentProps<typeof AvatarFallback>) {
  return (
    <AvatarFallback className={cn("rounded-none", className)} {...props}>
      {children ?? <User className="size-[60%] text-foreground" />}
    </AvatarFallback>
  );
}
```

### SFStatusDot with GSAP Pulse
```typescript
// Source: ScrambleText pattern for GSAP + prefers-reduced-motion guard
"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";

interface SFStatusDotProps {
  active?: boolean;
  className?: string;
}

export function SFStatusDot({ active = false, className }: SFStatusDotProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tween = gsap.to(ref.current, {
      opacity: 0.4,
      duration: 0.2, // --duration-normal
      ease: "var(--ease-default)",
      repeat: -1,
      yoyo: true,
    });

    return () => { tween.kill(); };
  }, [active]);

  return (
    <div
      ref={ref}
      role="status"
      aria-label={active ? "Active" : "Inactive"}
      className={cn("size-2 bg-foreground", className)}
    />
  );
}
```

### SFEmptyState with Bayer Dither Background
```typescript
// Source: CONTEXT.md design direction + ScrambleText integration
"use client";

import { cn } from "@/lib/utils";
import { ScrambleText } from "@/components/animation/scramble-text";

interface SFEmptyStateProps {
  title: string;
  scramble?: boolean;
  action?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function SFEmptyState({ title, scramble, action, className, children }: SFEmptyStateProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center py-16 px-8 text-center",
        "font-mono uppercase tracking-wider",
        className
      )}
    >
      {/* Bayer dither background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/png;base64,...")`, // Bayer 8x8 ordered dither
          backgroundSize: "8px 8px",
          imageRendering: "pixelated",
        }}
      />
      <div className="relative z-10">
        {scramble ? (
          <ScrambleText text={title} className="text-lg mb-4" trigger="load" />
        ) : (
          <h3 className="text-lg mb-4">{title}</h3>
        )}
        {children && <div className="text-sm text-muted-foreground mb-6">{children}</div>}
        {action}
      </div>
    </div>
  );
}
```

### ComponentsExplorer Entry Pattern
```typescript
// Source: components/blocks/components-explorer.tsx COMPONENTS array
// New entries follow this exact shape:
{ index: "013", name: "AVATAR",     category: "NAVIGATION", subcategory: "FRAME", version: "v1.3.0", variant: "default", filterTag: "NAVIGATION", preview: <PreviewAvatar /> },
{ index: "014", name: "BREADCRUMB", category: "NAVIGATION", subcategory: "FRAME", version: "v1.3.0", variant: "default", filterTag: "NAVIGATION", preview: <PreviewBreadcrumb /> },
{ index: "015", name: "ALERT",      category: "FEEDBACK",   subcategory: "FRAME", version: "v1.3.0", variant: "default", filterTag: "FEEDBACK",   preview: <PreviewAlert /> },
{ index: "016", name: "DIALOG_CFM", category: "FEEDBACK",   subcategory: "FRAME", version: "v1.3.0", variant: "yellow",  filterTag: "FEEDBACK",   preview: <PreviewAlertDialog /> },
{ index: "017", name: "COLLAPSE",   category: "FEEDBACK",   subcategory: "FRAME", version: "v1.3.0", variant: "default", filterTag: "FEEDBACK",   preview: <PreviewCollapsible /> },
{ index: "018", name: "EMPTY",      category: "FEEDBACK",   subcategory: "FRAME", version: "v1.3.0", variant: "black",   filterTag: "FEEDBACK",   preview: <PreviewEmptyState /> },
{ index: "019", name: "STATUS_DOT", category: "DATA_DISPLAY", subcategory: "FRAME", version: "v1.3.0", variant: "default", filterTag: "DATA_DISPLAY", preview: <PreviewStatusDot /> },
```

### Registry Entry Pattern
```json
{
  "name": "sf-alert",
  "type": "registry:ui",
  "title": "SF Alert",
  "description": "Inline feedback banner with info/warning/destructive/success intents",
  "dependencies": ["class-variance-authority"],
  "registryDependencies": ["alert"],
  "files": [{ "path": "components/sf/sf-alert.tsx", "type": "registry:ui" }],
  "meta": { "layer": "frame", "pattern": "A" }
}
```

### Barrel Export Additions
```typescript
// In sf/index.ts -- add under appropriate category comments:

// Feedback
export { SFAlert, SFAlertTitle, SFAlertDescription } from "./sf-alert";
export {
  SFAlertDialog,
  SFAlertDialogTrigger,
  SFAlertDialogContent,
  SFAlertDialogHeader,
  SFAlertDialogFooter,
  SFAlertDialogTitle,
  SFAlertDialogDescription,
  SFAlertDialogAction,
  SFAlertDialogCancel,
} from "./sf-alert-dialog";
export { SFCollapsible, SFCollapsibleTrigger, SFCollapsibleContent } from "./sf-collapsible";
export { SFEmptyState } from "./sf-empty-state";

// Navigation
export { SFAvatar, SFAvatarImage, SFAvatarFallback } from "./sf-avatar";
export {
  SFBreadcrumb,
  SFBreadcrumbList,
  SFBreadcrumbItem,
  SFBreadcrumbLink,
  SFBreadcrumbPage,
  SFBreadcrumbSeparator,
} from "./sf-breadcrumb";

// Data Display
export { SFStatusDot } from "./sf-status-dot";
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `from "@radix-ui/react-avatar"` | `from "radix-ui"` | radix-ui monorepo | shadcn 4.x bases use monorepo import -- do not change |
| `variant` as CVA key | `intent` as CVA key | v1.0 convention | All new components use `intent` -- never `variant` for visual states |
| Per-component shadcn install | Batch install in Phase 16 | v1.3 | 5 of 7 bases already present; alert + breadcrumb still needed |
| `rounded-*` via global `--radius` | Explicit `rounded-none` per element | v1.0 discovery | Global token doesn't override literal Tailwind classes |

## Open Questions

1. **Breadcrumb `'use client'` status**
   - What we know: shadcn Breadcrumb typically uses only semantic HTML (`<nav>`, `<ol>`, `<li>`) without Radix state primitives
   - What's unclear: Exact content of the generated `ui/breadcrumb.tsx` until it's installed
   - Recommendation: Install first, inspect for `'use client'`. If absent, SFBreadcrumb is a Server Component (matching NAV-02 requirement). HIGH confidence this will be the case.

2. **SFEmptyState Bayer dither asset**
   - What we know: CONTEXT.md specifies Bayer dither pattern matching hero SIGNAL aesthetic. GLSLHero uses ordered Bayer dither in GLSL.
   - What's unclear: Whether to use an inline SVG data URI, a tiny PNG, or CSS-only pattern
   - Recommendation: Use an 8x8 ordered dither pattern as a base64 PNG data URI with `image-rendering: pixelated`. Tiny payload (~100 bytes), no network request, matches the pixel-grid aesthetic.

3. **Alert base rounded classes**
   - What we know: Not installed yet, so can't inspect
   - What's unclear: Which elements have rounded classes needing override
   - Recommendation: After `shadcn add alert`, inspect for any `rounded-*` classes and add to the override list. Typically Alert has `rounded-lg` on the root element.

4. **GSAP import path for StatusDot**
   - What we know: ScrambleText uses `import { gsap, useGSAP } from "@/lib/gsap-split"`. Other animation components may use different import paths.
   - What's unclear: Whether a simple `gsap.to()` needs the full split-text bundle import
   - Recommendation: Check if there's a lighter GSAP import path (e.g., `@/lib/gsap-core` or direct `import gsap from "gsap"`). StatusDot only needs `gsap.to()`, not ScrambleText or SplitText plugins.

## Sources

### Primary (HIGH confidence)
- `components/sf/sf-dialog.tsx` -- Pattern A compound component reference
- `components/sf/sf-button.tsx` -- Pattern A single component with CVA reference
- `components/sf/sf-badge.tsx` -- CVA `intent` variant reference
- `components/ui/avatar.tsx` -- Radix Avatar base with 5 rounded-full elements
- `components/ui/alert-dialog.tsx` -- Radix AlertDialog base with rounded-xl
- `components/ui/collapsible.tsx` -- Radix Collapsible base (no rounded overrides)
- `SCAFFOLDING.md` -- 9-point checklist, prop vocabulary, wrapper patterns
- `.planning/phases/16-infrastructure-baseline/BASELINE.md` -- rounded-* audit, bundle baseline
- `components/animation/scramble-text.tsx` -- ScrambleText API for EmptyState integration
- `components/blocks/components-explorer.tsx` -- COMPONENTS array structure for showcase entries
- `registry.json` -- Registry entry format for all existing components
- `components/sf/index.ts` -- Barrel export structure with category comments

### Secondary (MEDIUM confidence)
- shadcn Alert and Breadcrumb component structure (based on shadcn 4.x patterns, verified against installed components)

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries already in use, versions locked
- Architecture: HIGH -- 29 existing SF wrappers establish clear pattern
- Pitfalls: HIGH -- rounded-none audit documented in BASELINE.md, barrel rule well-understood
- ComponentsExplorer integration: HIGH -- existing COMPONENTS array format is clear
- SFEmptyState design: MEDIUM -- Bayer dither implementation details are discretionary
- SFStatusDot GSAP: MEDIUM -- import path and exact tween parameters need verification at implementation time

**Research date:** 2026-04-06
**Valid until:** 2026-05-06 (stable -- project conventions are locked for v1.3)
