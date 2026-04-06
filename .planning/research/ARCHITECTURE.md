# Architecture Patterns — v1.3 Component Expansion

**Domain:** SignalframeUX design system — comprehensive component library integration
**Researched:** 2026-04-06
**Confidence:** HIGH — all findings verified against actual codebase files

---

## Context: What v1.3 Is and Is Not

v1.3 adds 15+ new SF-wrapped components to a system that already has 29. The architecture is not new — it is proven. The challenge is integration at scale: barrel exports, Server/Client boundaries, composite patterns, SIGNAL layer integration points, and registry automation across a larger surface area.

Every new component follows the existing pattern or explicitly documents why it deviates.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONSUMERS                                     │
│  app/(pages)   components/blocks   components/layout            │
│       ↓               ↓                   ↓                     │
├─────────────────────────────────────────────────────────────────┤
│                  SF LAYER  (components/sf/)                      │
│                                                                  │
│  FRAME primitives (Server Components, CVA variants, cn())        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │SFAccordion│ │SFToast   │ │SFProgress│ │SFAvatar  │  ...     │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘           │
│       │            │            │            │                  │
│  Barrel: components/sf/index.ts (shared SC + CC entry)          │
│                                                                  │
│  COMPOSITE patterns (DataTable, SearchableSelect)                │
│  ┌──────────────────────────────────────────────────┐           │
│  │  SFTable + SFSelect + SFInput + pagination logic  │           │
│  └──────────────────────────────────────────────────┘           │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                  UI LAYER  (components/ui/)                      │
│       shadcn base — read-only, never modified                    │
│  accordion  toast  progress  alert-dialog  avatar  ...          │
├─────────────────────────────────────────────────────────────────┤
│              RADIX UI PRIMITIVES (@radix-ui/react-*)             │
│  All target components available in radix-ui@1.4.3              │
│  (accordion, toast, progress, alert-dialog, avatar,              │
│   navigation-menu, menubar, toggle-group, collapsible)           │
├─────────────────────────────────────────────────────────────────┤
│                  SIGNAL LAYER  (components/animation/)           │
│                                                                  │
│  GSAP-driven: SignalMotion (scroll-scrub), ScrollReveal          │
│  (one-shot), ScrambleText, CircuitDivider, VHSOverlay            │
│  All require 'use client'. Never import from sf/index.ts.        │
│                                                                  │
│  SIGNAL integration points for new components:                   │
│  Progress fill → gsap.to() width tween                          │
│  Toast slide → gsap.fromTo() translateX entrance/exit           │
│  Accordion stagger → gsap.fromTo() on open content panel        │
├─────────────────────────────────────────────────────────────────┤
│              FOUNDATION  (lib/, hooks/, app/globals.css)         │
│  Tokens: spacing, type, color, motion, layout                    │
│  Providers: SignalframeProvider (SSR-safe, hole-in-donut)        │
│  Registry: registry.json → public/r/ (shadcn CLI compatible)    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Responsibilities

| Component | Responsibility | Integration Type |
|-----------|---------------|------------------|
| `SFAccordion` | Collapsible content panels | Pattern A (Radix base) |
| `SFToast` / `SFToaster` | Ephemeral notification system | Pattern A + Toaster provider |
| `SFProgress` | Deterministic fill bar | Pattern A + optional SIGNAL hook |
| `SFAlertDialog` | Destructive action confirmation | Pattern A (Radix base) |
| `SFAvatar` | User identity graphic with fallback | Pattern A (Radix base) |
| `SFBreadcrumb` | Path navigation indicator | Pattern C (no Radix, nav element) |
| `SFEmptyState` | Zero-state placeholder | Pattern C (no Radix, pure SF) |
| `SFNavigationMenu` | Horizontal nav with flyout panels | Pattern A (Radix base, 'use client') |
| `SFPagination` | Page navigation control set | Pattern C (no Radix, pure SF) |
| `SFStepper` | Multi-step process indicator | Pattern C (no Radix, pure SF) |
| `SFStatusDot` | Inline status indicator | Pattern C (no Radix, pure SF) |
| `SFToggleGroup` | Exclusive/multi-select toggle set | Pattern A (Radix base) |
| `SFCalendar` | Date picker (lazy, heavy dep) | Pattern B (registry-only) |
| `SFMenubar` | Horizontal menubar with submenus | Pattern B (registry-only, lazy) |

**Patterns:**
- **A** — shadcn base in `ui/` → SF-wrapped in `sf/`, listed in `sf/index.ts`
- **B** — Registry-only, lazy-loaded via `dynamic()`, NOT in `sf/index.ts`
- **C** — No Radix base, pure SF construction, listed in `sf/index.ts`

---

## Recommended Project Structure After v1.3

```
components/
├── ui/                         # shadcn base — read-only
│   ├── accordion.tsx           # ADD (pnpm dlx shadcn add accordion)
│   ├── alert-dialog.tsx        # ADD
│   ├── avatar.tsx              # ADD
│   ├── navigation-menu.tsx     # ADD
│   ├── progress.tsx            # ADD
│   ├── toast.tsx               # ADD
│   ├── toggle-group.tsx        # ADD
│   ├── calendar.tsx            # ADD (P3 — heavy)
│   ├── menubar.tsx             # ADD (P3 — lazy)
│   └── [existing 24 files]
│
├── sf/                         # SF-wrapped + barrel
│   ├── index.ts                # MODIFY — append new exports
│   ├── sf-accordion.tsx        # ADD (P1)
│   ├── sf-alert-dialog.tsx     # ADD (P1)
│   ├── sf-avatar.tsx           # ADD (P1)
│   ├── sf-breadcrumb.tsx       # ADD (P1, no Radix base)
│   ├── sf-empty-state.tsx      # ADD (P1, no Radix base)
│   ├── sf-progress.tsx         # ADD (P1)
│   ├── sf-toast.tsx            # ADD (P1)
│   ├── sf-navigation-menu.tsx  # ADD (P2)
│   ├── sf-pagination.tsx       # ADD (P2, no Radix base)
│   ├── sf-status-dot.tsx       # ADD (P2, no Radix base)
│   ├── sf-stepper.tsx          # ADD (P2, no Radix base)
│   ├── sf-toggle-group.tsx     # ADD (P2)
│   └── [existing 28 files]
│
├── animation/                  # GSAP layer — no new files for v1.3
│   └── [existing files]
│
├── blocks/                     # MODIFY — update ComponentsExplorer entries
│   ├── components-explorer.tsx # MODIFY — add new entries to COMPONENTS array
│   └── [existing files]
│
└── layout/                     # No changes for v1.3
    └── [existing files]

lib/
└── [no changes — existing gsap-core, signalframe-provider sufficient]

registry.json                   # MODIFY — append 13 new items
public/r/                       # ADD — 13 new JSON files
```

---

## Architectural Patterns

### Pattern A: Standard SF Wrap (Existing, Verified)

**What:** Thin wrapper over shadcn `ui/` base. CVA variants via `intent` prop. `cn()` merging. Pure layout SF components are Server Components by default; any component wrapping a Radix interactive (Select, Dialog, Toast, NavigationMenu) needs `'use client'` because Radix uses event handlers internally.

**When to use:** Any component where a shadcn base exists in `ui/`.

**Trade-offs:** Minimal — thin wrapper means shadcn upgrades flow through automatically, but Radix API changes can surface as TypeScript errors.

**Example (SFProgress):**
```typescript
// No 'use client' if SFProgress is purely presentational (controlled externally)
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function SFProgress({
  className,
  ...props
}: React.ComponentProps<typeof Progress>) {
  return (
    <Progress
      className={cn(
        "h-1 rounded-none bg-foreground/10 [&>div]:bg-primary [&>div]:rounded-none",
        className
      )}
      {...props}
    />
  );
}
```

**Determining 'use client' need:** If the shadcn component file itself has `'use client'`, the SF wrapper needs it too. Check the generated `ui/` file after `pnpm dlx shadcn add [name]`.

---

### Pattern B: Registry-Only Lazy Component (New for P3)

**What:** Components too heavy for the main bundle (Calendar ~40KB, Menubar has deep Radix menu tree) are registered in `registry.json` but are NOT exported from `sf/index.ts`. Consumers install them via the shadcn CLI registry. Within the app itself, they use `dynamic()` with a `SFSkeleton` fallback.

**When to use:** Any component where the initial bundle cost is material (>10KB) and usage is infrequent or page-scoped.

**Trade-offs:** Eliminates bundle cost but adds a loading boundary. ComponentsExplorer must note the lazy status. Prevents accidental eager import.

**Example (Calendar lazy loader):**
```typescript
// components/sf/sf-calendar-lazy.tsx
import dynamic from "next/dynamic";
import { SFSkeleton } from "@/components/sf";

export const SFCalendar = dynamic(
  () => import("./sf-calendar").then((m) => ({ default: m.SFCalendar })),
  {
    loading: () => <SFSkeleton className="h-64 w-72" />,
    ssr: false,  // Date picker has no SSR value; avoids hydration delta
  }
);
```

**Critical:** The lazy wrapper file (`sf-calendar-lazy.tsx`) exports under the same name as the non-lazy implementation (`SFCalendar`). Consumers import from the lazy file directly, not from `sf/index.ts`.

---

### Pattern C: Pure SF Construction (Extends Existing)

**What:** Components with no applicable Radix primitive (Breadcrumb, EmptyState, Pagination, Stepper, StatusDot). Built entirely with semantic HTML + Tailwind tokens + CVA. These are typically Server Components.

**When to use:** When no Radix primitive models the interaction correctly, or when the component is purely presentational.

**Trade-offs:** Full control over HTML semantics and accessibility, but no Radix behavior inheritance. Keyboard handling must be implemented manually where needed (e.g., Stepper).

**Example (SFStatusDot):**
```typescript
// Server Component — no 'use client'
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sfStatusDotVariants = cva(
  "inline-block w-2 h-2 border",
  {
    variants: {
      status: {
        active: "bg-[var(--sf-green)] border-[var(--sf-green)]",
        idle: "bg-muted border-muted-foreground",
        error: "bg-destructive border-destructive",
        pending: "bg-warning border-warning animate-pulse",
      },
    },
    defaultVariants: { status: "idle" },
  }
);

interface SFStatusDotProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof sfStatusDotVariants> {
  label?: string;
}

export function SFStatusDot({ status, label, className, ...props }: SFStatusDotProps) {
  return (
    <span
      role="status"
      aria-label={label ?? status ?? "status"}
      className={cn(sfStatusDotVariants({ status }), className)}
      {...props}
    />
  );
}
```

---

### Pattern D: Composite Component (New for v1.3)

**What:** A component composed from multiple SF primitives that coordinates state internally. DataTable (SFTable + SFSelect + SFInput + pagination) is the canonical example. The composite lives in `components/blocks/` rather than `components/sf/` because it is not a primitive — it is an opinionated composition.

**When to use:** When 3+ SF primitives must coordinate state that no single primitive owns. Never put composites in `components/sf/`.

**Trade-offs:** Convenient for consumers but harder to decompose. Composites accumulate state. Keep them thin — push logic to a `useDataTable` hook in `hooks/`.

**Location rule:**
```
components/blocks/data-table.tsx       <- composite lives here
hooks/use-data-table.ts                <- pagination/sort/filter state
components/sf/sf-table.tsx             <- unchanged primitive
components/sf/sf-select.tsx            <- unchanged primitive
components/sf/sf-input.tsx             <- unchanged primitive
```

---

## Barrel Export Scaling: Server/Client Boundary

This is the most operationally important architectural question for v1.3. The `sf/index.ts` barrel is imported by both Server Components and Client Components. This works because Next.js 15 applies RSC tree shaking — unused client exports do not contaminate server render paths.

**The risk:** Exporting a `'use client'` component from `sf/index.ts` is safe as long as server-component consumers do NOT render it. If a Server Component renders `SFToast` (a client component), Next.js will error at build time.

**The rule that prevents problems:**
1. **Layout primitives** (`SFContainer`, `SFSection`, `SFStack`, `SFGrid`, `SFText`) — no `'use client'`. Safe anywhere.
2. **Interactive SF components** (`SFSelect`, `SFDialog`, `SFToast`, etc.) — have `'use client'`. Can be in `sf/index.ts` but must only render inside client component trees.
3. **P3 lazy components** (`SFCalendar`, `SFMenubar`) — NOT in `sf/index.ts`. Import directly from their lazy file.

**Barrel size at 44+ exports:** Not a performance concern in Next.js 15 + Turbopack. Tree shaking operates at the module level. Add inline section comments to `sf/index.ts` to group exports (`// Layout`, `// Input`, `// Feedback`, `// Data`, `// Navigation`).

**Operational rule for v1.3:** After each P1 batch, run `pnpm build` to confirm no Server/Client boundary violations before continuing.

---

## SIGNAL Layer Integration Points

New components eligible for SIGNAL layer animation. Do not add new animation primitives — wire existing GSAP patterns.

| Component | SIGNAL Integration | Implementation |
|-----------|-------------------|----------------|
| `SFProgress` | Fill width tween on value change | `useEffect` + `gsap.to(ref, { width: value + '%' })` with `--duration-normal` + `--ease-default` |
| `SFToast` | Slide entrance/exit | `gsap.fromTo()` on mount: `x: 40 → 0`, opacity 0 → 1, `--duration-normal`. Exit via Radix `data-state="closed"` |
| `SFAccordion` | Content panel stagger on open | `useGSAP` scoped to content ref: `gsap.from(contentRef, { height: 0, opacity: 0 })` when open state changes |
| `SFStepper` | Step indicator transition | GSAP `fromTo` on active indicator position between steps |
| `SFNavigationMenu` | Flyout entrance | `gsap.fromTo` on viewport panel: `y: -8 → 0`, `--duration-fast` |

**Non-eligible (FRAME-only):** Avatar, Breadcrumb, StatusDot, Pagination, ToggleGroup, AlertDialog. No meaningful motion integration that doesn't conflict with Radix accessibility transitions.

**Integration approach:** SIGNAL animation is progressive enhancement. Components render correctly without it. The GSAP call lives inside `useEffect`/`useGSAP` with a `prefers-reduced-motion` guard — matches the existing `SignalMotion` pattern exactly.

**SFToast note:** Radix Toast has its own CSS animation slots (`data-state="open"` / `data-state="closed"`). The SIGNAL integration zeros the Radix CSS transition and handles enter/exit in `useGSAP`. Precedent: `sf-dialog.tsx` overrides Radix animation styles with `rounded-none shadow-none` — same approach applies to motion.

---

## Registry Automation

The registry has 33 items in v1.2. v1.3 adds 13 more (10 active + 3 P3). Manual maintenance of `registry.json` + `public/r/[name].json` is the current approach.

**Current structure per registry entry:**
```json
{
  "name": "sf-accordion",
  "type": "registry:ui",
  "title": "SF Accordion",
  "description": "...",
  "registryDependencies": ["accordion"],
  "files": [{ "path": "components/sf/sf-accordion.tsx", "type": "registry:ui" }],
  "meta": { "layer": "frame", "pattern": "A" }
}
```

**v1.3 approach:** Continue manual maintenance. Each new SF file gets:
1. An entry appended to `registry.json`
2. A corresponding `public/r/sf-[name].json` (matches existing file format — copy an existing one as template)
3. A JSDoc block on the component (SCAFFOLDING.md API contract)

**meta.layer values:** `"frame"` for Pattern A/C, `"signal"` for animation-carrying components.
**meta.pattern values:** `"A"` (Radix wrap), `"B"` (lazy registry-only), `"C"` (pure SF).

---

## Data Flow

### New Component → Consumer Flow

```
pnpm dlx shadcn add [name]
    ↓ writes to components/ui/[name].tsx (read-only after)

SF wrap: components/sf/sf-[name].tsx
    ↓ imports from ui/, applies CVA variants + cn()

Barrel: components/sf/index.ts
    ↓ appends export

Consumer: any page / block / layout
    ↓ imports from "@/components/sf"

Registry: registry.json + public/r/sf-[name].json
    ↓ enables shadcn CLI install by downstream consumers
```

### SIGNAL Integration Flow (animated components)

```
Component mounts ('use client')
    ↓
useGSAP / useEffect fires after paint
    ↓
Check prefers-reduced-motion (matchMedia)
    ↓ if reduced: gsap.set(ref, finalState) immediately
    ↓ if full:    gsap.fromTo() using --duration-* + --ease-* tokens
    ↓
SignalframeProvider.motion.prefersReduced
    suspends all tweens via gsap.globalTimeline.timeScale(0)
```

### ComponentsExplorer Update Flow

```
COMPONENTS array in components-explorer.tsx
    ↓ append new ComponentEntry
      { index, name, category, filterTag, preview: <PreviewXxx /> }
    ↓ filterTag maps to existing CATEGORIES
      ("FEEDBACK", "DATA", "INPUT", "LAYOUT", "MOTION", "SIGNAL")

PreviewXxx component (CSS-only thumbnail, no live SF primitives)
    ↓ defined inline above COMPONENTS array
    ↓ compact sketch — not interactive, no GSAP
```

---

## Build Order

Order determined by three constraints: shadcn dependency (install `ui/` base before wrapping), SIGNAL eligibility (non-animated first to isolate blast radius), composite dependency (primitives before composites).

### Phase 0 — Infrastructure Baseline (before any new component)
1. Install all P1+P2 shadcn bases in one pass:
   `pnpm dlx shadcn add accordion alert-dialog avatar navigation-menu progress toast toggle-group`
2. Verify `components/ui/` contains all new files with no TypeScript errors
3. Run `pnpm build` — clean baseline before changes

### Phase 1 — P1 Non-Animated (simplest, highest value, no SIGNAL)

| # | Component | Pattern | 'use client' | Rationale |
|---|-----------|---------|--------------|-----------|
| 1 | `SFStatusDot` | C | No | Smallest possible — pure CVA span, tests Pattern C setup |
| 2 | `SFAvatar` | A | No (verify after shadcn add) | Radix Avatar is presentational |
| 3 | `SFBreadcrumb` | C | No | nav + ol/li semantic HTML |
| 4 | `SFEmptyState` | C | No | Composition of SFText + optional slot |
| 5 | `SFAlertDialog` | A | Yes | Same pattern as SFDialog — proven template |

### Phase 2 — P1 Animated (SIGNAL integration)

| # | Component | SIGNAL Integration | Complexity |
|---|-----------|-------------------|------------|
| 6 | `SFProgress` | GSAP fill tween | Low — single value → width |
| 7 | `SFToast` / `SFToaster` | Slide entrance/exit | Medium — override Radix CSS transitions |
| 8 | `SFAccordion` | Panel stagger on open | Medium — wire to Radix open state change |

### Phase 3 — P2 Components

| # | Component | Pattern | Notes |
|---|-----------|---------|-------|
| 9 | `SFToggleGroup` | A | Extends SFToggle pattern, mutually exclusive state |
| 10 | `SFPagination` | C | Pure SF — button row with current/total state props |
| 11 | `SFStepper` | C | Step state machine — active/complete/pending per step |
| 12 | `SFNavigationMenu` | A | Radix base, 'use client', flyout animation optional |

### Phase 4 — P3 Registry-Only (lazy-loaded)

| # | Component | Pattern | Bundle strategy |
|---|-----------|---------|-----------------|
| 13 | `SFCalendar` | B | `dynamic()` with `ssr: false`, SFSkeleton fallback |
| 14 | `SFMenubar` | B | `dynamic()` in page context, SFSkeleton fallback |

### Phase 5 — Composite Pattern

| # | Component | Lives In | Deps (must precede) |
|---|-----------|----------|---------------------|
| 15 | `DataTable` | `components/blocks/` | SFTable (existing) + SFPagination (Phase 3) + SFSelect (existing) + SFInput (existing) |

### Phase 6 — Wiring and Documentation
- Update `COMPONENTS` array in `components-explorer.tsx` for all new entries
- Append to `registry.json` and generate `public/r/` files for each
- Update `SCAFFOLDING.md` with new component API contracts + JSDoc
- Run `pnpm build` + Lighthouse audit to confirm performance budget maintained

---

## Scaling Considerations

| Component Count | Architecture Concern | Mitigation |
|----------------|---------------------|------------|
| Current: 29 SF | Barrel readable but unorganized | Acceptable — no change needed |
| After v1.3: ~44 SF | Barrel starts to feel long | Add section comments: `// Layout`, `// Input`, `// Feedback`, `// Navigation`, `// Data` |
| Hypothetical: 80+ SF | Single barrel hard to scan | Split into domain sub-barrels re-exported from `sf/index.ts` |
| P3 lazy components | Heavy deps must not enter main bundle | Pattern B enforced: not in `sf/index.ts`, `dynamic()` at usage site only |

**Current concern (v1.3):** None structural. Add inline comments to `sf/index.ts` when appending new exports.

---

## Anti-Patterns

### Anti-Pattern 1: Rendering a Client Component in a Server Component

**What people do:** Import `SFToast` (client component) at the top of a Server Component page and render it directly.
**Why it's wrong:** Next.js throws a build-time error — non-serializable props across the Server/Client boundary.
**Do this instead:** Create a `ToastRegion.tsx` client component that renders `SFToaster`. Mount it in the layout client boundary alongside `LenisProvider` and `PageAnimations` — not inside page Server Components.

---

### Anti-Pattern 2: Importing GSAP in a Server Component

**What people do:** Import from `@/lib/gsap-core` in an SF file without `'use client'`.
**Why it's wrong:** GSAP uses `window`, `document`, and `requestAnimationFrame`. Build fails or produces a runtime error on SSR. Note: `gsap-core.ts` itself has `'use client'` but that only guards the lib module — the consumer still needs its own directive if it uses browser APIs.
**Do this instead:** If a component needs GSAP, add `'use client'` to that component file. Never import gsap in a Server Component.

---

### Anti-Pattern 3: Composite Components in components/sf/

**What people do:** Build a `DataTable` that manages sort/pagination state and export it from `sf/index.ts`.
**Why it's wrong:** `components/sf/` is for primitives with single responsibility. A stateful composite inflates the barrel and violates the thin-wrapper API contract expected by SCAFFOLDING.md and the registry.
**Do this instead:** Put composites in `components/blocks/`. Extract state to `hooks/use-[name].ts`. Primitive dependencies stay in `sf/`.

---

### Anti-Pattern 4: Bypassing CVA for One-Off Variants

**What people do:** Add inline conditionals (`className={active ? 'bg-foreground' : ''}`) inside a new component instead of defining a CVA variant.
**Why it's wrong:** Diverges from the `intent` prop contract. Makes the component impossible to document accurately in SCAFFOLDING.md and the registry.
**Do this instead:** Define all visual states as CVA variants with an `intent` key — even if there is currently only one state. Structural consistency enables future extensibility without API breakage.

---

### Anti-Pattern 5: Importing Directly from components/ui/ in Pages or Blocks

**What people do:** `import { Accordion } from "@/components/ui/accordion"` in a page component.
**Why it's wrong:** Bypasses the SF contract entirely — SF classes (font-mono, rounded-none, 2px borders, inverted hover) are not applied. Produces aesthetically inconsistent output and breaks the DU/TDR visual language.
**Do this instead:** Always import from `@/components/sf`. The `ui/` layer is an implementation detail, not a public API.

---

### Anti-Pattern 6: Putting P3 Lazy Components in sf/index.ts

**What people do:** Add `export { SFCalendar } from "./sf-calendar"` to `sf/index.ts` because all other SF components are there.
**Why it's wrong:** Eager import of the lazy file pulls the full ~40KB Calendar bundle into the main chunk, defeating the entire purpose of the lazy pattern.
**Do this instead:** Import from the specific file: `import { SFCalendar } from "@/components/sf/sf-calendar-lazy"`. Never add P3 components to `sf/index.ts`.

---

## Integration Points

### sf/index.ts → Consumer Boundary

| Direction | Communication | Constraint |
|-----------|---------------|------------|
| Server Component → sf/index.ts | Direct import, static resolution | Only render non-client exports |
| Client Component → sf/index.ts | Direct import, client bundle | Any export valid |
| blocks/ → sf/index.ts | Direct import | Composites import primitives, not vice versa |
| animation/ → sf/index.ts | Must NOT import from sf/ (circular risk) | Animation components are standalone |
| P3 lazy → sf/index.ts | NOT listed — import directly from lazy file | `dynamic(() => import('./sf-calendar'))` |

### registry.json → CLI Consumer Boundary

| Boundary | Communication | Notes |
|----------|---------------|-------|
| registry.json → public/r/[name].json | Manual sync (current approach) | registry.json is source of truth |
| public/r/ → downstream consumer | `pnpm dlx shadcn add [url]` | Each JSON file is self-contained with deps |
| meta.layer/meta.pattern → ComponentsExplorer | Not yet wired — manual sync | Future: derive filterTag from meta.layer |

### SIGNAL Layer → SF Component Boundary

| Component | How SIGNAL wires | Guard |
|-----------|-----------------|-------|
| SFProgress | `useEffect` reads `value` prop, calls `gsap.to(ref, { width })` | `prefers-reduced-motion` check before tween |
| SFToast | `useGSAP` on open state from Radix `data-state` | Radix CSS transition zeroed, GSAP takes over |
| SFAccordion | `useGSAP` scoped to content ref, fires on `data-state="open"` | Only fires when open state changes |

---

## Sources

- Verified: `components/sf/` — 28 existing SF files, all reviewed
- Verified: `components/sf/index.ts` — current barrel export structure (29 components, 104 lines)
- Verified: `registry.json` — 33 items, meta.layer + meta.pattern schema confirmed
- Verified: `lib/signalframe-provider.tsx` — SSR-safe hole-in-donut pattern
- Verified: `node_modules/radix-ui/package.json` — v1.4.3, all target Radix primitives confirmed present (accordion, alert-dialog, avatar, navigation-menu, progress, toast, toggle-group, menubar, collapsible)
- Verified: `components/animation/signal-motion.tsx` — GSAP integration precedent (useGSAP + prefers-reduced-motion guard)
- Verified: `components/blocks/components-explorer.tsx` — COMPONENTS array + filterTag taxonomy (FRAME/SIGNAL/LAYOUT/INPUT/DATA/FEEDBACK/MOTION)
- Verified: `app/globals.css` — motion tokens (--duration-instant through --duration-glacial, --ease-default/hover/spring)
- Verified: `package.json` — React 19.1, Next.js 15.3, GSAP 3.12, Turbopack, radix-ui@1.4.3

---

*Architecture research for: SignalframeUX v1.3 Component Expansion*
*Researched: 2026-04-06*
