# Phase 23: Remaining SF Components — Research

**Researched:** 2026-04-06
**Domain:** shadcn/Radix SF-wrapping, vaul drawer, input-otp, Radix HoverCard
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CMP-01 | SFDrawer (vaul-based, lazy, meta.heavy: true) with registry + explorer entry | vaul API confirmed; Pattern B lazy loader pattern documented; registry entry structure from sf-calendar.json |
| CMP-02 | SFHoverCard (FRAME-only, Pattern A) with registry + explorer entry | @radix-ui/react-hover-card already in pnpm-lock.yaml transitively; shadcn `hover-card` base must be added; wrapping follows sf-popover/sf-tooltip pattern |
| CMP-03 | SFInputOTP (input-otp, Pattern A) with registry + explorer entry | shadcn `input-otp` base must be added; `ui/input-otp.tsx` does not yet exist; sub-component structure documented |
| CMP-04 | SFInputGroup wrapper closes last unwrapped ui/ component gap | `ui/input-group.tsx` already exists; no shadcn install needed; wrap all 6 exports |
</phase_requirements>

---

## Summary

Phase 23 adds four SF-wrapped components to close the v1.4 component gap. Three of the four require new `ui/` base components installed via `pnpm dlx shadcn@latest add` before wrapping begins. One (SFInputGroup) wraps a `ui/` base that already exists.

The vaul library (CMP-01) is NOT present in the project — neither directly nor transitively via Sonner 2.0 (which dropped vaul as a dependency). It must be installed as a new dependency. vaul is maintained (v1.1.2 shipped December 2024) despite a maintenance note on the GitHub README; shadcn continues to ship it as the official Drawer primitive.

SFDrawer follows the established Pattern B: a real implementation file (`sf-drawer.tsx`) plus a lazy loader (`sf-drawer-lazy.tsx`) that uses `next/dynamic` with `ssr: false`. It is NOT exported from `sf/index.ts`. SFHoverCard and SFInputOTP follow Pattern A (standard barrel export, no lazy loading). SFInputGroup follows Pattern A.

The same-commit rule applies to all four: component file + barrel entry (for A components) + registry.json entry + `/r/` artifact in one commit per component.

**Primary recommendation:** Install dependencies first (`pnpm dlx shadcn@latest add hover-card input-otp drawer`), then implement in order: SFInputGroup (simplest, no new deps), SFHoverCard, SFInputOTP, SFDrawer (most complex, lazy).

---

## Dependency Audit

### What Already Exists

| Dependency | Status | Notes |
|------------|--------|-------|
| `@radix-ui/react-hover-card` | In pnpm-lock.yaml (transitive) | `ui/hover-card.tsx` does NOT exist — shadcn add still required |
| `ui/input-group.tsx` | EXISTS in `components/ui/` | No shadcn install needed for CMP-04 |
| `vaul` | NOT in project (not in package.json, not in pnpm-lock.yaml) | Sonner 2.0 dropped vaul dependency |
| `input-otp` | NOT in project | shadcn add required |
| `ui/hover-card.tsx` | NOT in project | shadcn add required |
| `ui/drawer.tsx` | NOT in project | shadcn add required |

### Installation Commands

```bash
# Run in order — each installs the ui/ base and adds to package.json
pnpm dlx shadcn@latest add hover-card
pnpm dlx shadcn@latest add input-otp
pnpm dlx shadcn@latest add drawer
```

The `drawer` shadcn add command installs `vaul` as a direct dependency and creates `ui/drawer.tsx`.

**CRITICAL:** Check pnpm-lock.yaml after `pnpm dlx shadcn@latest add drawer` to confirm `vaul` version. Expected: `^1.1.2` or later.

---

## Standard Stack

### Core Components and Bases

| Component | ui/ Base | External Dep | Pattern | Barrel Export |
|-----------|----------|-------------|---------|---------------|
| SFDrawer | `ui/drawer.tsx` | `vaul` | B (lazy) | NO — direct import only |
| SFHoverCard | `ui/hover-card.tsx` | `@radix-ui/react-hover-card` (transitive) | A | YES |
| SFInputOTP | `ui/input-otp.tsx` | `input-otp` | A | YES |
| SFInputGroup | `ui/input-group.tsx` (exists) | none | A | YES |

### Supporting Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| `vaul` | ~1.1.2 | Drawer/bottom-sheet primitive for SFDrawer |
| `input-otp` | latest shadcn-compatible | OTP input primitive for SFInputOTP |
| `class-variance-authority` | ^0.7.1 (existing) | CVA for any variants needed |
| `cn()` from `lib/utils.ts` | existing | Class merging on all SF wrappers |

---

## Architecture Patterns

### Confirmed Project File Structure

```
components/
  ui/
    hover-card.tsx       ← install via shadcn add hover-card
    input-otp.tsx        ← install via shadcn add input-otp
    drawer.tsx           ← install via shadcn add drawer
    input-group.tsx      ← ALREADY EXISTS
  sf/
    sf-hover-card.tsx    ← new (Pattern A)
    sf-input-otp.tsx     ← new (Pattern A)
    sf-drawer.tsx        ← new (real impl, Pattern B)
    sf-drawer-lazy.tsx   ← new (lazy loader, Pattern B)
    sf-input-group.tsx   ← new (Pattern A)
    index.ts             ← add HoverCard + InputOTP + InputGroup exports; NOT Drawer
public/r/
    sf-hover-card.json
    sf-input-otp.json
    sf-drawer.json
    sf-input-group.json
registry.json            ← add 4 new entries
```

### Pattern A: Standard SF Wrapper (HoverCard, InputOTP, InputGroup)

```typescript
// 'use client' at top if the base component requires it
// otherwise omit (prefer Server Component when possible)

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

function SFHoverCard(props: React.ComponentProps<typeof HoverCard>) {
  return <HoverCard {...props} />;
}

function SFHoverCardTrigger(props: React.ComponentProps<typeof HoverCardTrigger>) {
  return <HoverCardTrigger {...props} />;
}

function SFHoverCardContent({
  className,
  ...props
}: React.ComponentProps<typeof HoverCardContent>) {
  return (
    <HoverCardContent
      className={cn(
        "rounded-none border-2 border-foreground bg-background shadow-none",
        className
      )}
      {...props}
    />
  );
}

export { SFHoverCard, SFHoverCardTrigger, SFHoverCardContent };
```

Barrel entry in `sf/index.ts`:
```typescript
export { SFHoverCard, SFHoverCardTrigger, SFHoverCardContent } from "./sf-hover-card";
```

### Pattern B: Lazy Loader (Drawer only)

Two files required: the real implementation (`sf-drawer.tsx`) and the lazy loader (`sf-drawer-lazy.tsx`).

```typescript
// sf-drawer-lazy.tsx — this is the consumer-facing import
"use client";

import dynamic from "next/dynamic";
import { SFSkeleton } from "@/components/sf";

const SFDrawerDynamic = dynamic(
  () =>
    import("@/components/sf/sf-drawer").then((m) => ({
      default: m.SFDrawer,
    })),
  {
    ssr: false,
    loading: () => <SFSkeleton className="h-16 w-full" />,
  }
);

export function SFDrawerLazy(
  props: React.ComponentProps<typeof SFDrawerDynamic>
) {
  return <SFDrawerDynamic {...props} />;
}
```

**SFDrawer is NOT exported from `sf/index.ts`.** Consumers import directly from `sf-drawer-lazy.tsx`. This matches the Calendar and Menubar pattern exactly.

### SFDrawer Real Implementation Notes

vaul's `Drawer.Root` defaults to `direction="bottom"` (bottom-sheet). This is the only required direction for v1.4.

The shadcn `ui/drawer.tsx` wraps vaul. The SF layer wraps `ui/drawer.tsx`. Sub-components to wrap:

- `Drawer` → `SFDrawer` (root, passthrough)
- `DrawerTrigger` → `SFDrawerTrigger` (passthrough)
- `DrawerClose` → `SFDrawerClose` (passthrough)
- `DrawerContent` → `SFDrawerContent` (apply SF styles)
- `DrawerHeader` → `SFDrawerHeader` (apply SF styles)
- `DrawerFooter` → `SFDrawerFooter` (apply SF styles)
- `DrawerTitle` → `SFDrawerTitle` (apply SF styles)
- `DrawerDescription` → `SFDrawerDescription` (apply SF styles)

The lazy loader exposes `SFDrawerLazy` which wraps `SFDrawer` root. Composable sub-components (`SFDrawerContent`, etc.) are exported directly from `sf-drawer.tsx` for use alongside the lazy root.

**SSR constraint:** vaul uses `window` and DOM APIs — `ssr: false` is mandatory. The Drawer will not render during SSR.

### SFInputOTP Sub-Component Structure

shadcn's `input-otp` provides: `InputOTP`, `InputOTPGroup`, `InputOTPSlot`, `InputOTPSeparator`

SF wraps all four:
- `SFInputOTP` — root wrapper, inherits shadcn's mono styling, enforce `rounded-none`
- `SFInputOTPGroup` — passthrough group container
- `SFInputOTPSlot` — individual slot, enforce `rounded-none border-2 border-foreground` on active/focus states
- `SFInputOTPSeparator` — visual divider between groups

**Important:** `InputOTPSlot` renders `data-active` and `data-state="active"` attributes. Use CSS targeting these attributes for SIGNAL-layer focus caret (blinking cursor in active slot) rather than JS.

**WCAG AA color contrast:** Each slot must meet 4.5:1 contrast ratio. With `bg-background` and `text-foreground` (OKLCH L~0.98 dark mode), existing token values satisfy this. Verify the active-slot indicator (the caret/border) also meets contrast — use `border-foreground` on active slot.

### SFInputGroup Sub-Component Structure

`ui/input-group.tsx` exports 6 functions that all need SF wrappers:

```
InputGroup        → SFInputGroup
InputGroupAddon   → SFInputGroupAddon
InputGroupButton  → SFInputGroupButton
InputGroupText    → SFInputGroupText
InputGroupInput   → SFInputGroupInput
InputGroupTextarea → SFInputGroupTextarea
```

**Critical issue in base component:** `ui/input-group.tsx` uses `rounded-lg`, `rounded-[calc(var(--radius)-5px)]`, and `rounded-[calc(var(--radius)-3px)]` in CVA class strings for `inputGroupAddonVariants` and `inputGroupButtonVariants`. The SF wrapper must override these with `rounded-none` on every sub-element.

The `InputGroupButton` uses `variant="ghost"` from shadcn Button — which is fine (base `ui/button` passes through). The SF override should use `SFButton` instead where possible, or apply explicit `rounded-none` to remove the base button's radius.

**Note:** `ui/input-group.tsx` is `"use client"` — `sf-input-group.tsx` will also be `"use client"`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Bottom-sheet overlay with swipe dismiss | Custom portal + gesture handler | `vaul` via `ui/drawer.tsx` | vaul handles snap points, velocity-based dismiss, backdrop, a11y |
| OTP input with copy-paste | Multiple `<input>` elements | `input-otp` via `ui/input-otp.tsx` | Single hidden input pattern; handles iOS paste, SMS autofill, screen reader correctly |
| Hover card open/close with delay | `onMouseEnter`/`onMouseLeave` + `setTimeout` | `@radix-ui/react-hover-card` | Radix handles pointer leave detection, delay, keyboard focus, screen readers |
| Rounded corner removal per sub-element | Hunting Radix class names | Explicit `rounded-none` on every SF content/slot | Radix uses `data-state` for animations but doesn't override SF `rounded-none` class |

---

## Common Pitfalls

### Pitfall 1: Radix Radius Survival
**What goes wrong:** `@radix-ui/react-hover-card` content renders with `rounded-md` from shadcn's base. The global `--radius: 0px` token does NOT override it because shadcn uses `rounded-[var(--radius)]` which compiles to `rounded-[0px]` but Radix adds inline CSS or class-level overrides on some elements.
**Why it happens:** Same issue documented in STATE.md from v1.3 — `rounded-full` and `rounded-md` in shadcn class strings survive the global token.
**How to avoid:** Apply `rounded-none` explicitly in `SFHoverCardContent`, `SFDrawerContent`, and on every `SFInputOTPSlot`.
**Warning signs:** Visible corner rounding in browser DevTools on content panels.

### Pitfall 2: vaul SSR Crash
**What goes wrong:** Importing `sf-drawer.tsx` (which imports vaul) in a Server Component or during SSR causes a runtime crash because vaul references `window`.
**Why it happens:** vaul is a client-only library.
**How to avoid:** `SFDrawer` file must have `"use client"` at top. The lazy loader uses `ssr: false`. Never export `SFDrawer` from `sf/index.ts` barrel (barrel runs at module load — could be SSR context).
**Warning signs:** `ReferenceError: window is not defined` in Next.js build or server logs.

### Pitfall 3: Drawer Not in Barrel — But Sub-Components Must Be Accessible
**What goes wrong:** Consumers need `SFDrawerContent`, `SFDrawerHeader`, etc. alongside `SFDrawerLazy`, but the barrel doesn't export them.
**Why it happens:** Pattern B excludes the lazy file from barrel, but sub-components are also in `sf-drawer.tsx`.
**How to avoid:** Sub-components (`SFDrawerContent`, `SFDrawerHeader`, etc.) CAN be exported directly from `sf-drawer.tsx` for direct import. Consumers do: `import { SFDrawerLazy } from "@/components/sf/sf-drawer-lazy"` and `import { SFDrawerContent, ... } from "@/components/sf/sf-drawer"`. The barrel stays clean.

### Pitfall 4: InputGroup Base Has Hardcoded Radius in CVA
**What goes wrong:** `inputGroupAddonVariants` and `inputGroupButtonVariants` in `ui/input-group.tsx` contain `rounded-[calc(var(--radius)-5px)]` and similar. Passing `className="rounded-none"` to the wrapper doesn't remove inner element rounding.
**Why it happens:** CVA applies classes at the sub-element level — the outer `rounded-none` doesn't cascade inward to CVA-managed children.
**How to avoid:** `SFInputGroupButton` must override the CVA classes by applying `rounded-none` explicitly. Use `cn("rounded-none", ...)` pattern to beat specificity via Tailwind Merge.

### Pitfall 5: Missing `/r/` Artifact After shadcn Build
**What goes wrong:** `registry.json` entry exists but `public/r/sf-drawer.json` is stale or missing — shadcn CLI (`shadcn build`) was not re-run.
**Why it happens:** `/r/` artifacts are build outputs from `pnpm run registry:build` (which runs `shadcn build`).
**How to avoid:** Run `pnpm run registry:build` after every new registry.json entry. Verify the JSON file exists in `public/r/` before committing.

### Pitfall 6: ComponentsExplorer Index Collision
**What goes wrong:** New entries use an already-taken `index` string (e.g., "028" if there's already a "028").
**Why it happens:** The COMPONENTS array is manually maintained.
**How to avoid:** Audit the current max index before adding entries. Current max from component-explorer.tsx: `"027"` (MENUBAR). New entries start at `"028"`.

---

## Code Examples

### SFHoverCard Pattern (verified from sf-popover.tsx and sf-tooltip.tsx patterns)

```typescript
// sf-hover-card.tsx
"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

function SFHoverCard(props: React.ComponentProps<typeof HoverCard>) {
  return <HoverCard {...props} />;
}

function SFHoverCardTrigger(props: React.ComponentProps<typeof HoverCardTrigger>) {
  return <HoverCardTrigger {...props} />;
}

function SFHoverCardContent({
  className,
  ...props
}: React.ComponentProps<typeof HoverCardContent>) {
  return (
    <HoverCardContent
      className={cn(
        "rounded-none border-2 border-foreground bg-background shadow-none",
        className
      )}
      {...props}
    />
  );
}

export { SFHoverCard, SFHoverCardTrigger, SFHoverCardContent };
```

### registry.json Entry for Pattern A Component

```json
{
  "name": "sf-hover-card",
  "type": "registry:ui",
  "title": "SF HoverCard",
  "description": "FRAME-only hover/focus preview panel. Sharp 2px border, no radius, no shadow. Keyboard accessible via Radix.",
  "registryDependencies": ["hover-card"],
  "files": [
    {
      "path": "components/sf/sf-hover-card.tsx",
      "type": "registry:ui"
    }
  ],
  "meta": {
    "layer": "frame",
    "pattern": "A"
  }
}
```

### registry.json Entry for Pattern B Component (Drawer)

```json
{
  "name": "sf-drawer",
  "type": "registry:ui",
  "title": "SF Drawer",
  "description": "Bottom-sheet overlay via vaul. Lazy-loaded via next/dynamic (ssr: false). Import sf-drawer-lazy.tsx — NOT from sf/index.ts barrel.",
  "dependencies": ["vaul"],
  "registryDependencies": ["drawer"],
  "files": [
    {
      "path": "components/sf/sf-drawer.tsx",
      "type": "registry:ui"
    },
    {
      "path": "components/sf/sf-drawer-lazy.tsx",
      "type": "registry:ui"
    }
  ],
  "meta": {
    "layer": "frame",
    "pattern": "B",
    "heavy": true
  }
}
```

### ComponentsExplorer Entries for 4 New Components

Preview functions (CSS-only sketches, no live SF components):

```tsx
function PreviewHoverCard() {
  return (
    <div className="relative">
      <span className="underline text-xs font-mono">HOVER ME</span>
      <div className="absolute -top-10 left-0 border-2 border-current w-24 h-8 bg-background" />
    </div>
  );
}

function PreviewInputOTP() {
  return (
    <div className="flex gap-1">
      {[...Array(4)].map((_, i) => (
        <span key={i} className="w-5 h-6 border-2 border-current flex items-center justify-center text-xs font-mono">
          {i === 0 ? "·" : ""}
        </span>
      ))}
    </div>
  );
}

function PreviewInputGroup() {
  return (
    <div className="flex border border-current h-6 w-[80%]">
      <span className="px-1.5 text-[8px] font-mono border-r border-current flex items-center">@</span>
      <span className="flex-1" />
    </div>
  );
}
```

COMPONENTS array entries (continue from index "027"):

```typescript
{ index: "028", name: "HOVER_CARD", category: "LAYOUT", subcategory: "FRAME", version: "v1.4.0", variant: "default", filterTag: "LAYOUT", preview: <PreviewHoverCard /> },
{ index: "029", name: "INPUT_OTP", category: "FORMS", subcategory: "FRAME", version: "v1.4.0", variant: "black", filterTag: "FORMS", preview: <PreviewInputOTP /> },
{ index: "030", name: "INPUT_GROUP", category: "FORMS", subcategory: "FRAME", version: "v1.4.0", variant: "default", filterTag: "FORMS", preview: <PreviewInputGroup /> },
```

Note: DRAWER already exists in the COMPONENTS array at index "012". No new entry needed. Verify the existing entry's `version` is updated to reflect v1.4.0 shipping.

---

## Component Count After Phase 23

| Before | After | Delta |
|--------|-------|-------|
| 49 registry items | 53 registry items | +4 |
| 45 SF components | 49 SF components | +4 |
| 27 COMPONENTS[] entries | 30 COMPONENTS[] entries | +3 (Drawer exists at 012) |

---

## Implementation Order (Recommended)

1. **Install bases** — `pnpm dlx shadcn@latest add hover-card input-otp drawer` (one command or sequential)
2. **SFInputGroup** (CMP-04) — zero new deps, wraps existing `ui/input-group.tsx`, Pattern A. Simplest.
3. **SFHoverCard** (CMP-02) — Pattern A, Radix-based, FRAME-only. Follows sf-popover.tsx exactly.
4. **SFInputOTP** (CMP-03) — Pattern A, 4 sub-components, slot styling requires care for radius + contrast.
5. **SFDrawer** (CMP-01) — Pattern B, two files, most moving parts. Do last.
6. **Update ComponentsExplorer** — add 3 preview functions + 3 COMPONENTS[] entries; verify Drawer at "012" exists.
7. **Run registry build** — `pnpm run registry:build` to generate `/r/` artifacts.
8. **Bundle check** — `ANALYZE=true pnpm build` — Drawer and all heavy components must appear in async chunks, not initial shared bundle.

---

## Validation Architecture

Config key `workflow.nyquist_validation` is absent from `.planning/config.json` — treat as enabled.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | No automated test framework detected (no jest.config, vitest.config, pytest.ini, __tests__/ in repo) |
| Config file | none |
| Quick run command | `pnpm build` (TypeScript check + Next.js compile) |
| Full suite command | `ANALYZE=true pnpm build` + manual browser verification |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | Notes |
|--------|----------|-----------|-------------------|-------|
| CMP-01 | SFDrawer NOT in initial bundle | bundle audit | `ANALYZE=true pnpm build` | Verify vaul chunk is async |
| CMP-01 | SFDrawer opens as bottom-sheet | manual | dev server + click trigger | visual QA |
| CMP-01 | ssr: false correct | build smoke | `pnpm build` (no window errors) | SSR crash would fail build |
| CMP-02 | SFHoverCard opens on hover/focus | manual | dev server + hover trigger | keyboard tab + Enter |
| CMP-02 | SFHoverCard zero border-radius | visual QA | dev server DevTools | check computed border-radius |
| CMP-03 | SFInputOTP keyboard navigable | manual | dev server + keyboard | tab into, type digits, backspace |
| CMP-03 | SFInputOTP WCAG AA contrast | automated | browser contrast checker | active slot border vs bg |
| CMP-04 | SFInputGroup closes last ui/ gap | code audit | compare `ui/` vs `sf/` lists | all 6 exports wrapped |
| ALL | TypeScript compiles | static | `pnpm build` | no tsc errors |
| ALL | Registry entries present | file check | `ls public/r/sf-draw*.json public/r/sf-hover*.json public/r/sf-input-otp.json public/r/sf-input-group.json` | must all exist |
| ALL | Barrel exports correct (no Drawer in index.ts) | code audit | grep `sf/index.ts` | Drawer absent, others present |

### Sampling Rate
- **Per component commit:** `pnpm build` (TypeScript + SSR validation)
- **After all 4 components:** `ANALYZE=true pnpm build` (bundle gate check)
- **Phase gate:** All components visible in ComponentsExplorer + bundle under 150KB gate

### Wave 0 Gaps
- None — no test framework in project; validation is build-time TypeScript + manual browser QA per established project pattern.

---

## Open Questions

1. **Drawer ComponentsExplorer entry at "012" — version field**
   - What we know: Entry exists with `version: "v2.0.0"` as a placeholder (Drawer was pre-planned)
   - What's unclear: Whether the entry's `preview`, `name`, and `variant` are final or need updating
   - Recommendation: Verify the "012" DRAWER entry in components-explorer.tsx and update `version` to `"v1.4.0"` to reflect actual ship milestone.

2. **vaul version compatibility with React 19**
   - What we know: vaul v1.1.2 shipped December 2024; React 19.1 is in use
   - What's unclear: Whether vaul 1.1.x peer-declares React 18 only
   - Recommendation: Run `pnpm dlx shadcn@latest add drawer` and check for peer dependency warnings. shadcn's vetting of drawer implies compatibility.

3. **SFDrawerLazy skeleton dimensions**
   - What we know: Calendar uses `h-[350px] w-[280px]`, Menubar uses `h-10 w-full`
   - What's unclear: Best skeleton shape for a bottom-sheet that slides up from bottom
   - Recommendation: Use `h-[200px] w-full` — represents a collapsed bottom panel height during load.

---

## Sources

### Primary (HIGH confidence)
- Direct file inspection: `components/ui/input-group.tsx`, `components/sf/sf-calendar-lazy.tsx`, `components/sf/sf-menubar-lazy.tsx`, `components/sf/sf-popover.tsx`, `components/sf/sf-sheet.tsx`, `components/sf/sf-tooltip.tsx`
- `components/sf/index.ts` — barrel structure confirmed
- `registry.json` — pattern B entries confirmed (sf-calendar, sf-menubar)
- `public/r/sf-calendar.json` — `/r/` artifact structure confirmed
- `components/blocks/components-explorer.tsx` — COMPONENTS array inspected; existing indexes confirmed; "012" DRAWER pre-exists
- `pnpm-lock.yaml` — vaul absence confirmed; `@radix-ui/react-hover-card` transitive presence confirmed; sonner 2.0 has no vaul dependency
- `.planning/STATE.md` — rounded-none rule, bundle gate 150KB, barrel directive rule, Pattern B docs, same-commit rule

### Secondary (MEDIUM confidence)
- shadcn docs (WebFetch): `ui.shadcn.com/docs/components/drawer` — confirmed Drawer sub-components and vaul foundation
- shadcn docs (WebFetch): `ui.shadcn.com/docs/components/hover-card` — confirmed HoverCard sub-components and Radix foundation
- shadcn docs (WebFetch): `ui.shadcn.com/docs/components/input-otp` — confirmed InputOTP sub-components and `input-otp` library
- vaul docs (WebFetch): `vaul.emilkowal.ski/getting-started` — confirmed bottom-sheet direction and basic API
- input-otp GitHub (WebFetch): `github.com/guilhermerodz/input-otp` — confirmed single-input accessibility pattern

### Tertiary (LOW confidence)
- None — all key claims are verified against project source or official shadcn docs.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all bases confirmed via pnpm-lock.yaml and shadcn docs
- Architecture: HIGH — Pattern A/B templates confirmed from existing sf-calendar-lazy.tsx and sf-menubar-lazy.tsx
- Pitfalls: HIGH — rounded-none survival and barrel directive rule are documented in STATE.md from v1.3 production experience
- Component count: HIGH — COMPONENTS array read directly from source

**Research date:** 2026-04-06
**Valid until:** 2026-05-06 (stable libraries; vaul/input-otp are not fast-moving)
