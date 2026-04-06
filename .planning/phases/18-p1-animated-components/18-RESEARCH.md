# Phase 18: P1 Animated Components - Research

**Researched:** 2026-04-06
**Domain:** GSAP-animated SF components (Accordion, Toast, Progress) with Radix/Sonner bases
**Confidence:** HIGH

## Summary

Phase 18 ships three SIGNAL-eligible components: SFAccordion (Radix Accordion + GSAP stagger), SFToast/SFToaster (Sonner + GSAP slide entrance), and SFProgress (Radix Progress + GSAP fill tween). All three follow Pattern A (wrapping an existing base) and require `'use client'` for GSAP. The critical new dependency is `sonner@2.0.7` -- the only npm install needed for this phase. GSAP 3.12.7 and all Radix primitives are already installed.

The primary risk is bundle budget: the current shared JS baseline is 103 KB (gate at 150 KB). Sonner adds approximately 7-10 KB gzipped. Each component's GSAP usage imports from the existing `lib/gsap-core.ts` (already in the client bundle), so incremental GSAP cost is near-zero. All three components must gate at 150 KB shared after integration.

**Primary recommendation:** Ship all three components using the established `useRef` + `useEffect` + `gsap.to()` pattern from SFStatusDot, with `prefers-reduced-motion` guard before tween creation. Use Sonner's `unstyled: true` mode for SFToaster to fully control DU/TDR aesthetic without fighting default styles.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- Accordion stagger: 50ms delay per child element, reverse stagger on close
- Progress fill: `--duration-normal` (200ms) tween with `--ease-default`
- Toast slide: GSAP-driven slide (not CSS transition) for consistency with system animation tokens
- All animations guarded by `prefers-reduced-motion` check BEFORE creating tween
- Toast minimal bar aesthetic: sharp-edged, 2px border, monospace text, foreground/background tokens
- Icon left, dismiss X right, no shadow, zero border-radius
- Positioned bottom-left with `--z-toast: 100` to avoid SignalOverlay at bottom-right
- Uses Sonner as the toast engine
- SFAccordion: Pattern A (Radix-wrapped), `'use client'` for GSAP
- SFToast/SFToaster: Pattern A (Sonner-wrapped), `'use client'` for GSAP slide
- SFProgress: Pattern A (Radix-wrapped), `'use client'` for GSAP tween
- Toast should feel like a system notification, not a friendly popup -- monospace, terse, sharp
- Accordion stagger should feel mechanical/precise, not bouncy -- use ease-default, not spring
- Progress fill should feel like a data visualization, not a loading bar

### Claude's Discretion
- GSAP import strategy (tree-shaking approach)
- Sonner theme customization implementation details
- Accordion content stagger target selector

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FD-01 | User can expand/collapse content sections via SFAccordion with stagger SIGNAL animation | Radix Accordion base installed (`ui/accordion.tsx`), GSAP stagger API documented, `data-open`/`data-closed` attributes available for state detection |
| FD-02 | User receives async notifications via SFToast (Sonner) with GSAP slide entrance, positioned bottom-left | Sonner v2.0.7 API documented, `unstyled: true` + `toast.custom()` pattern identified for full styling control, `position: "bottom-left"` confirmed as valid prop |
| FD-03 | User sees task/upload progress via SFProgress with SIGNAL fill intensity tween | Radix Progress base installed (`ui/progress.tsx`), GSAP `gsap.to()` tween on indicator transform, `useRef` targeting the indicator element |

</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| gsap | 3.12.7 | All animation (stagger, tween, slide) | Already installed, sole animation driver per CLAUDE.md |
| @gsap/react | 2.1.2 | `useGSAP` hook (optional -- project also uses raw `useEffect`) | Already installed, registered in `lib/gsap-core.ts` |
| sonner | 2.0.7 | Toast engine (imperative API) | NEW install required -- shadcn-recommended replacement for Radix Toast |
| radix-ui | 1.4.3 | Accordion + Progress primitives | Already installed, tree-shakeable umbrella |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| class-variance-authority | 0.7.1 | CVA for `intent` variants on SFAccordion/SFProgress | Already installed, standard for all SF visual variants |
| lucide-react | (installed) | Icons for toast (X dismiss, type icons) | Already installed, optimized in `next.config.ts` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Sonner | Radix Toast | Deprecated in shadcn, worse DX (hook-based vs imperative), no promise API |
| GSAP toast slide | Sonner built-in animation | Breaks token consistency -- all SIGNAL animations must use system duration/easing tokens |
| `useEffect` + `gsap.to()` | `useGSAP` hook | Either works; SFStatusDot precedent uses `useEffect` -- stay consistent within SF layer |

**Installation:**
```bash
pnpm add sonner
```

**Post-install:** Consider adding `"sonner"` to `optimizePackageImports` in `next.config.ts` if bundle analysis shows material impact.

## Architecture Patterns

### Component File Structure
```
components/
  ui/
    accordion.tsx          # shadcn base (already installed, DO NOT modify)
    progress.tsx           # shadcn base (already installed, DO NOT modify)
  sf/
    sf-accordion.tsx       # NEW -- Pattern A, 'use client', GSAP stagger
    sf-toast.tsx           # NEW -- Pattern A (Sonner-wrapped), 'use client', GSAP slide
    sf-progress.tsx        # NEW -- Pattern A, 'use client', GSAP tween
    index.ts               # Updated -- add exports under // Feedback
```

### Pattern: GSAP Animation in SF Components (from SFStatusDot precedent)

**What:** `useRef` + `useEffect` with reduced-motion guard, tween cleanup on unmount.
**When to use:** Every SIGNAL-layer SF component.
**Example:**
```typescript
// Source: components/sf/sf-status-dot.tsx (existing project pattern)
"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap-core";

function SFAnimatedComponent({ value }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tween = gsap.to(ref.current, {
      // animation properties
      duration: 0.2, // use token-equivalent values
      ease: "power2.out",
    });

    return () => { tween.kill(); };
  }, [value]); // re-run on value change

  return <div ref={ref}>...</div>;
}
```

### Pattern: SFAccordion GSAP Stagger

**What:** On accordion item open, stagger-animate child elements within the content panel.
**When to use:** SFAccordion expand/collapse.
**Implementation approach:**
```typescript
// Accordion content children stagger on expand
useEffect(() => {
  if (!contentRef.current) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Query direct children of the content wrapper
  const children = contentRef.current.children;
  if (!children.length) return;

  const tween = gsap.fromTo(
    children,
    { opacity: 0, y: 8 },
    {
      opacity: 1,
      y: 0,
      duration: 0.2,       // --duration-normal equivalent
      stagger: 0.05,       // 50ms per child (locked decision)
      ease: "power2.out",  // --ease-default equivalent in GSAP
    }
  );

  return () => { tween.kill(); };
}, [isOpen]);
```

**Stagger target selector (Claude's Discretion recommendation):** Target `contentRef.current.children` (direct children of the content wrapper div). This is the most predictable selector -- avoids deep nesting issues and works regardless of content structure. The existing accordion base has a wrapper `<div>` inside `AccordionContent` that contains user content.

### Pattern: Sonner Toast with GSAP Slide

**What:** Use Sonner's `toast.custom()` with `unstyled: true` to render a fully-controlled toast element. Attach GSAP slide-in animation via ref + useEffect inside the custom toast component.
**When to use:** SFToast wrapper.
**Implementation approach:**
```typescript
// SFToaster component -- placed in root layout
import { Toaster } from "sonner";

function SFToaster() {
  return (
    <Toaster
      position="bottom-left"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "border-2 border-foreground bg-background text-foreground font-mono rounded-none p-4 shadow-none",
          title: "text-sm tracking-wider uppercase",
          description: "text-xs text-muted-foreground",
          closeButton: "text-foreground",
        },
      }}
      closeButton
      gap={8}
      offset={16}
    />
  );
}
```

**GSAP slide approach:** Since Sonner manages DOM lifecycle, the GSAP slide should be applied via a custom toast component rendered through `toast.custom()`, or by using Sonner's CSS variable overrides to set initial transform state and letting GSAP animate on mount. The recommended approach is a thin `SFToastContent` component that receives a ref and animates on mount:

```typescript
// Custom toast content with GSAP slide
function SFToastContent({ title, description, icon, onDismiss }: SFToastContentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.fromTo(ref.current,
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.2, ease: "power2.out" }
    );
  }, []);

  return (
    <div ref={ref} className="border-2 border-foreground bg-background ...">
      {icon && <span className="mr-3">{icon}</span>}
      <div className="flex-1">
        <p className="text-sm font-mono uppercase tracking-wider">{title}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <button onClick={onDismiss} aria-label="Dismiss" className="ml-3">
        <X className="size-4" />
      </button>
    </div>
  );
}
```

Then expose imperative API wrappers:
```typescript
// sf-toast.tsx exports
export const sfToast = {
  default: (title: string, opts?: SFToastOptions) =>
    toast.custom((id) => <SFToastContent title={title} onDismiss={() => toast.dismiss(id)} {...opts} />),
  success: (title: string, opts?: SFToastOptions) =>
    toast.custom((id) => <SFToastContent title={title} icon={<Check />} intent="success" onDismiss={() => toast.dismiss(id)} {...opts} />),
  error: (title: string, opts?: SFToastOptions) =>
    toast.custom((id) => <SFToastContent title={title} icon={<AlertTriangle />} intent="destructive" onDismiss={() => toast.dismiss(id)} {...opts} />),
};
```

### Pattern: SFProgress GSAP Fill Tween

**What:** Instead of CSS transition on the Radix Progress indicator, use GSAP to tween the `translateX` transform when `value` changes.
**When to use:** SFProgress value updates.
**Implementation approach:**
```typescript
// GSAP tweens the indicator transform on value change
useEffect(() => {
  if (!indicatorRef.current) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // Instant update for reduced motion
    gsap.set(indicatorRef.current, { x: `${-(100 - (value || 0))}%` });
    return;
  }

  const tween = gsap.to(indicatorRef.current, {
    x: `${-(100 - (value || 0))}%`,
    duration: 0.2,       // --duration-normal
    ease: "power2.out",  // --ease-default equivalent
  });

  return () => { tween.kill(); };
}, [value]);
```

**Important:** Remove the inline `style={{ transform: ... }}` from the base Progress indicator in the SF wrapper, since GSAP controls the transform. The SF wrapper re-renders the Radix structure with a ref on the indicator.

### Anti-Patterns to Avoid
- **Animating with CSS transitions AND GSAP on the same property:** Conflicts cause jank. SFProgress must remove the base `transition-all` class from the indicator when using GSAP tween.
- **Creating GSAP tweens after reduced-motion check:** Guard must run BEFORE `gsap.to()` -- never create-then-kill.
- **Using `gsap.context()` for simple single-element tweens:** Context is for scoped cleanup of multiple tweens. Single tweens use `tween.kill()` directly (SFStatusDot precedent).
- **Importing from `lib/gsap-split`:** Only `lib/gsap-core` -- these components need core tween only, not SplitText/ScrambleText plugins.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Toast notification system | Custom portal + animation + stacking | Sonner | Stacking, swipe-to-dismiss, pause-on-hover, focus management, ARIA live regions |
| Accordion expand/collapse behavior | Custom height animation + state management | Radix Accordion | Keyboard navigation, ARIA expanded/controls, single/multiple mode, data attributes |
| Progress bar semantics | Custom div with width percentage | Radix Progress | ARIA progressbar role, value/min/max attributes, screen reader announcements |
| Reduced-motion detection | Custom media query listener | `window.matchMedia('(prefers-reduced-motion: reduce)').matches` | One-line check, no state needed for guard-before-tween pattern |

**Key insight:** The animation layer (GSAP) is purely enhancement. The structural behavior (expand/collapse, toast lifecycle, progress semantics) comes entirely from Radix/Sonner. Never conflate the two.

## Common Pitfalls

### Pitfall 1: Accordion CSS animation conflicting with GSAP stagger
**What goes wrong:** The base `ui/accordion.tsx` has `data-open:animate-accordion-down data-closed:animate-accordion-up` CSS animations on `AccordionContent`. If these run alongside GSAP stagger on children, the parent animates height while children stagger opacity/y -- causing visual jank.
**Why it happens:** Radix Accordion Content uses CSS `@keyframes` for height animation by default.
**How to avoid:** In `SFAccordionContent`, remove the `animate-accordion-down`/`animate-accordion-up` classes. Let Radix handle the content show/hide via `data-state` (which controls `display`/`overflow`), and only stagger the children with GSAP. Alternatively, keep the CSS height animation (it is on the parent container) and only GSAP-stagger the children -- they are independent concerns if the parent animation is fast enough.
**Warning signs:** Content appears to "jump" then children fade in sequentially.

### Pitfall 2: Sonner default styles fighting DU/TDR aesthetic
**What goes wrong:** Sonner ships with rounded corners, soft shadows, and gentle colors. Using `classNames` requires `!important` overrides.
**Why it happens:** Sonner's default stylesheet has inline styles and utility classes.
**How to avoid:** Use `unstyled: true` in `toastOptions` to strip all default styling. Then apply full SF styling via `classNames`. This eliminates any need for `!important`.
**Warning signs:** Seeing rounded corners, box shadows, or off-brand colors in toast output.

### Pitfall 3: Progress indicator `transition-all` class conflicting with GSAP
**What goes wrong:** The base `ui/progress.tsx` has `transition-all` on the indicator. When GSAP tweens `transform`, CSS transition fights it, causing doubled/janky animation.
**Why it happens:** Both CSS transitions and GSAP try to animate the same property.
**How to avoid:** In `SFProgress`, override the indicator class to remove `transition-all`. Replace with no transition class -- GSAP is the sole animation driver.
**Warning signs:** Progress bar appears to animate twice or has inconsistent timing.

### Pitfall 4: Toast z-index collision with SignalOverlay
**What goes wrong:** Default Sonner position is `bottom-right`. SignalOverlay occupies `bottom-right` at approximately z-index 210.
**Why it happens:** Both elements compete for the same screen corner.
**How to avoid:** Set `position="bottom-left"` on `<Toaster>` and ensure toast z-index is 100 (below SignalOverlay's ~210). This is a locked decision.
**Warning signs:** Toast appears behind or overlapping the signal controls.

### Pitfall 5: rounded-none audit on Accordion and Progress
**What goes wrong:** Base accordion has `rounded-lg` on AccordionItem and AccordionTrigger. Base progress has `rounded-full` on both Root and Indicator.
**Why it happens:** shadcn/Radix defaults include border-radius.
**How to avoid:** Per SCAFFOLDING.md checklist item 1, override every `rounded-*` class with `rounded-none` in the SF wrapper.
**Warning signs:** DevTools computed styles show non-zero `border-radius`.

### Pitfall 6: Barrel export directive contamination
**What goes wrong:** Adding `'use client'` to `sf/index.ts` turns all layout primitives into Client Components.
**Why it happens:** Barrel re-exports inherit the directive.
**How to avoid:** Each `sf-accordion.tsx`, `sf-toast.tsx`, `sf-progress.tsx` declares `'use client'` in its own file. `sf/index.ts` remains directive-free. Verify after every barrel update.
**Warning signs:** Layout primitives appearing in client chunks in bundle analyzer.

## Code Examples

### SFAccordion Sub-Component Structure
```typescript
// Source: follows ui/accordion.tsx structure + sf-alert-dialog.tsx pattern
// Exports: SFAccordion, SFAccordionItem, SFAccordionTrigger, SFAccordionContent
// Each sub-component wraps the base with cn() overrides for rounded-none + SF styling

function SFAccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionItem>) {
  return (
    <AccordionItem
      className={cn("rounded-none border-b border-foreground/20", className)}
      {...props}
    />
  );
}
```

### SFProgress with GSAP Tween
```typescript
// Source: follows ui/progress.tsx structure + sf-status-dot.tsx GSAP pattern
"use client";

import { useRef, useEffect } from "react";
import { Progress as ProgressPrimitive } from "radix-ui";
import { gsap } from "@/lib/gsap-core";
import { cn } from "@/lib/utils";

function SFProgress({ className, value, ...props }: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!indicatorRef.current) return;
    const target = -(100 - (value || 0));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(indicatorRef.current, { xPercent: target });
      return;
    }

    const tween = gsap.to(indicatorRef.current, {
      xPercent: target,
      duration: 0.2,
      ease: "power2.out",
    });

    return () => { tween.kill(); };
  }, [value]);

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn("relative flex h-1 w-full items-center overflow-x-hidden rounded-none bg-muted", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        ref={indicatorRef}
        data-slot="progress-indicator"
        className="size-full flex-1 rounded-none bg-primary"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
```

### Registry Entry Pattern (SIGNAL layer)
```json
{
  "name": "sf-accordion",
  "type": "registry:ui",
  "title": "SF Accordion",
  "description": "Industrial accordion with GSAP stagger on expand/collapse",
  "dependencies": ["gsap"],
  "registryDependencies": ["accordion"],
  "files": [
    { "path": "components/sf/sf-accordion.tsx", "type": "registry:ui" }
  ],
  "meta": {
    "layer": "signal",
    "pattern": "A"
  }
}
```

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| shadcn Radix Toast | Sonner v2.0.7 | Imperative API, no hook wiring, built-in stacking |
| CSS transitions on Progress indicator | GSAP tween via `gsap.to()` | Consistent with system animation tokens, composable with SIGNAL layer |
| CSS keyframes for accordion height | Radix CSS animation kept for height + GSAP stagger for children | Separation of structural (height) and expressive (content stagger) animation |

## GSAP Import Strategy (Claude's Discretion Resolution)

**Recommendation:** Import from `lib/gsap-core.ts` for all three components.

Rationale:
- `lib/gsap-core.ts` exports `gsap`, `ScrollTrigger`, and `useGSAP` -- all three components only need `gsap`
- GSAP core is already in the client bundle (used by SFStatusDot, animation components, page-animations)
- No additional GSAP plugins needed -- stagger, fromTo, and to are all core features
- Tree-shaking: importing `{ gsap }` from `lib/gsap-core` does not pull ScrollTrigger into component chunks -- Next.js tree-shakes unused named exports from the re-export file
- Do NOT import from `lib/gsap-split.ts` (that pulls SplitText/ScrambleText plugins)

## Sonner Theme Customization (Claude's Discretion Resolution)

**Recommendation:** Use `unstyled: true` mode with full `classNames` override.

Rationale:
- Sonner's default theme includes rounded corners, shadows, and colors that violate DU/TDR aesthetic
- Using `classNames` WITHOUT `unstyled: true` requires `!important` on every override
- With `unstyled: true`, all default styles are stripped -- clean slate for SF classes
- Set `theme="dark"` on Toaster to match the dark-mode-primary constraint
- Custom GSAP slide via `toast.custom()` with a `SFToastContent` component gives full animation control

## Open Questions

1. **Accordion height animation coexistence with GSAP stagger**
   - What we know: Radix uses CSS `@keyframes` for content height (`animate-accordion-down`/`animate-accordion-up`). GSAP staggers target children inside the content.
   - What's unclear: Whether the CSS height animation creates visual conflict with child stagger (height expanding while children fade in might look deliberate or might look broken).
   - Recommendation: Keep both initially -- CSS height on container, GSAP stagger on children. If visual QA reveals jank, replace CSS height with a GSAP timeline that sequences height-then-stagger.

2. **Sonner version pinning**
   - What we know: Project research recommends `sonner@2.0.7`. Current npm latest may differ.
   - What's unclear: Whether v2.0.7 is still latest or if breaking changes have landed.
   - Recommendation: Install with `pnpm add sonner` (latest) and verify API compatibility. The `unstyled` + `toast.custom()` APIs are stable across v2.x.

3. **ComponentsExplorer preview components for animated entries**
   - What we know: Existing explorer entries use static preview components (e.g., `PreviewAlert`, `PreviewCollapsible`).
   - What's unclear: Whether animated previews (accordion expanding, progress filling, toast appearing) belong in the explorer or if static previews suffice.
   - Recommendation: Use static previews that show the component in its expanded/filled state. Animation is enhancement, not the preview's purpose.

## Sources

### Primary (HIGH confidence)
- `components/sf/sf-status-dot.tsx` -- GSAP animation pattern precedent (useRef + useEffect + tween.kill())
- `components/ui/accordion.tsx` -- Radix Accordion base, data-open/data-closed attributes
- `components/ui/progress.tsx` -- Radix Progress base, translateX indicator pattern
- `lib/gsap-core.ts` -- GSAP import module (gsap + ScrollTrigger + useGSAP)
- `.planning/phases/16-infrastructure-baseline/BASELINE.md` -- Bundle baseline (103 KB shared)
- `SCAFFOLDING.md` -- 9-item checklist for SF wrapper creation
- `.planning/research/STACK.md` -- Sonner v2.0.7 recommendation with rationale

### Secondary (MEDIUM confidence)
- [Sonner styling docs](https://sonner.emilkowal.ski/styling) -- `unstyled`, `classNames`, `toastOptions` API
- [Sonner toast docs](https://sonner.emilkowal.ski/toast) -- `toast.custom()`, `onDismiss`, `onAutoClose` callbacks
- [Sonner toaster docs](https://sonner.emilkowal.ski/toaster) -- `position`, `theme`, `gap`, `offset` props

### Tertiary (LOW confidence)
- Sonner bundle size estimate (7-10 KB gzipped) -- from project research, not independently verified

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries already installed except Sonner (well-documented)
- Architecture: HIGH -- patterns directly derived from existing SFStatusDot and SFAlertDialog implementations
- Pitfalls: HIGH -- accordion rounded classes verified in BASELINE.md audit, toast position conflict documented in project decisions
- Sonner integration: MEDIUM -- `unstyled: true` + `toast.custom()` approach is documented but not yet validated in this project

**Research date:** 2026-04-06
**Valid until:** 2026-05-06 (stable -- all libraries are established, no fast-moving APIs)
