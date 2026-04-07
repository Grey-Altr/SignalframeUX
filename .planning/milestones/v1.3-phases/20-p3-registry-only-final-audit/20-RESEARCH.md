# Phase 20: P3 Registry-Only + Final Audit - Research

**Researched:** 2026-04-06
**Domain:** Lazy-loaded component registration, bundle auditing, registry completeness
**Confidence:** HIGH

## Summary

Phase 20 is the final phase of v1.3. It has two distinct concerns: (1) creating two P3 "heavy-dep" SF wrappers (SFCalendar and SFMenubar) that are lazy-loaded via `next/dynamic` and never enter the main barrel export, and (2) performing a final audit of the entire v1.3 output -- registry.json completeness, SCAFFOLDING.md accuracy, public/r/ generation, and bundle/Lighthouse verification.

The Calendar component introduces two new npm dependencies: `react-day-picker` and `date-fns`. These are significant bundle additions (~40-60KB combined) which is precisely why Calendar is P3/lazy. The Menubar component uses Radix UI menubar primitives (already available via the `radix-ui` package) and adds no new npm dependencies.

**Primary recommendation:** Install shadcn base components first, create SF wrappers with `next/dynamic` + `ssr: false` loader files, add registry.json entries with `meta.heavy: true`, then run full audit: `pnpm registry:build`, `ANALYZE=true pnpm build`, and Lighthouse in browser DevTools against deployed Vercel URL.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
All implementation choices are at Claude's discretion -- pure infrastructure/audit phase. Key decisions pre-determined by success criteria:
- SFCalendar: lazy-loaded via `next/dynamic` with `ssr: false` and SFSkeleton fallback
- SFCalendar registry: `meta.heavy: true` with bundle cost annotation
- SFMenubar: registry-only, NOT exported from `sf/index.ts`
- Bundle gate: under 150KB initial (200KB hard limit)
- Lighthouse: 100/100 all categories
- SCAFFOLDING.md and registry.json audit for completeness

### Claude's Discretion
All implementation choices are at Claude's discretion.

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| REG-01 | Consumer installs SFCalendar via shadcn CLI -- lazy-loaded, bundle cost annotated, `meta.heavy: true` | shadcn dry-run confirms: `react-day-picker@latest` + `date-fns` as deps, generates `components/ui/calendar.tsx`. SF wrapper uses Pattern B (lazy). Established `next/dynamic` pattern in codebase. |
| REG-02 | Consumer installs SFMenubar via shadcn CLI -- lazy-loaded, registry-only | shadcn dry-run confirms: generates `components/ui/menubar.tsx`, no new npm deps (uses existing Radix). SF wrapper uses Pattern B (lazy). |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-day-picker | latest (v9+) | Calendar date picker engine | shadcn's calendar is built on it; no alternative |
| date-fns | latest | Date utility library for react-day-picker | Required peer dependency of react-day-picker |
| next/dynamic | 15.3 (bundled) | Lazy loading with `ssr: false` | Already used in 5 places in codebase; proven pattern |
| shadcn | 4.1.2 (pinned) | Base component generation | SCAFFOLDING.md requirement: `pnpm dlx shadcn@4.1.2 add` |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @next/bundle-analyzer | 16.2.2 | Bundle size verification | `ANALYZE=true pnpm build` for gate check |

### Alternatives Considered
None -- all choices are pre-determined by CONTEXT.md and SCAFFOLDING.md.

**Installation:**
```bash
# Step 1: Install shadcn bases (pinned version)
pnpm dlx shadcn@4.1.2 add calendar
pnpm dlx shadcn@4.1.2 add menubar

# Step 2: Verify new deps landed
# calendar adds: react-day-picker, date-fns
# menubar adds: no new deps (Radix already present)
```

## Architecture Patterns

### Recommended Project Structure
```
components/
├── ui/
│   ├── calendar.tsx        # shadcn base (generated)
│   └── menubar.tsx         # shadcn base (generated)
├── sf/
│   ├── sf-calendar.tsx     # SF wrapper (Pattern B, NOT in index.ts)
│   ├── sf-calendar-lazy.tsx # next/dynamic loader with SFSkeleton fallback
│   ├── sf-menubar.tsx      # SF wrapper (Pattern B, NOT in index.ts)
│   ├── sf-menubar-lazy.tsx # next/dynamic loader
│   └── index.ts            # UNCHANGED - no new exports for P3
```

### Pattern B: Lazy Registry-Only
**What:** Component wrapped in `next/dynamic` with `ssr: false`, loaded only when needed. Never exported from barrel.
**When to use:** Heavy-dep components that would blow the bundle budget if included in shared JS.
**Example:**
```typescript
// Source: components/animation/signal-overlay-lazy.tsx (existing pattern)
"use client";

import dynamic from "next/dynamic";
import { SFSkeleton } from "@/components/sf";

const SFCalendarDynamic = dynamic(
  () =>
    import("@/components/sf/sf-calendar").then((m) => ({
      default: m.SFCalendar,
    })),
  {
    ssr: false,
    loading: () => <SFSkeleton className="h-[350px] w-[280px]" />,
  }
);

export function SFCalendarLazy(props: React.ComponentProps<typeof SFCalendarDynamic>) {
  return <SFCalendarDynamic {...props} />;
}
```

### Registry Entry for Heavy Components
**What:** Registry entry with `meta.heavy: true` and `meta.pattern: "B"` to signal bundle cost.
**Example:**
```json
{
  "name": "sf-calendar",
  "type": "registry:ui",
  "title": "SF Calendar",
  "description": "Lazy-loaded date calendar with react-day-picker. Import via next/dynamic only.",
  "dependencies": ["react-day-picker", "date-fns"],
  "registryDependencies": ["calendar", "button"],
  "files": [
    {
      "path": "components/sf/sf-calendar.tsx",
      "type": "registry:ui"
    },
    {
      "path": "components/sf/sf-calendar-lazy.tsx",
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

### Anti-Patterns to Avoid
- **Adding P3 components to sf/index.ts:** This pulls react-day-picker and date-fns into the shared bundle, blowing the 150KB gate.
- **Using `import()` without `ssr: false`:** Calendar uses `useState` and browser APIs; SSR will fail or cause hydration mismatch.
- **Forgetting the `-lazy.tsx` loader file:** Consumers must import the lazy version, not the raw SF wrapper, for bundle isolation.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Date picker | Custom date grid | react-day-picker via shadcn calendar | Locale, a11y, range selection, keyboard nav |
| Desktop menubar | Custom menu system | Radix Menubar via shadcn menubar | WAI-ARIA menubar pattern, focus management, submenus |
| Bundle analysis | Manual chunk inspection | `ANALYZE=true pnpm build` | @next/bundle-analyzer already configured |
| Registry JSON generation | Manual public/r/ files | `pnpm registry:build` (shadcn build) | Generates correct schema from registry.json |

## Common Pitfalls

### Pitfall 1: Calendar rounded-* classes
**What goes wrong:** react-day-picker and shadcn calendar.tsx use `rounded-md`, `rounded-lg` throughout.
**Why it happens:** Calendar has many sub-elements (day cells, nav buttons, month grid) each with their own rounded classes.
**How to avoid:** Inspect generated `ui/calendar.tsx` for every `rounded-*` class. Override each with `rounded-none` in the SF wrapper. Verify with DevTools computed styles.
**Warning signs:** Any visible border-radius in the rendered calendar.

### Pitfall 2: Menubar rounded-* classes
**What goes wrong:** Radix Menubar trigger and content have `rounded-md` / `rounded-lg`.
**Why it happens:** Same Radix styling pattern as NavigationMenu.
**How to avoid:** Apply `rounded-none` on every sub-element: trigger, content, item, sub-trigger, sub-content, separator.
**Warning signs:** Rounded corners on any menubar element.

### Pitfall 3: public/r/ out of sync with registry.json
**What goes wrong:** 9 registry entries currently missing from `public/r/` (sf-accordion, sf-alert, sf-alert-dialog, sf-avatar, sf-breadcrumb, sf-collapsible, sf-empty-state, sf-progress, sf-status-dot, sf-toast).
**Why it happens:** `pnpm registry:build` wasn't run after Phase 17-19 component additions.
**How to avoid:** Run `pnpm registry:build` as part of the final audit. Verify all registry.json entries produce corresponding public/r/ JSON files.
**Warning signs:** Diff between registry.json entry count and public/r/ file count.

### Pitfall 4: meta.pattern inconsistency in existing entries
**What goes wrong:** SCAFFOLDING.md pitfall #3 documents that existing entries use `"B"` incorrectly for what should be `"C"` (pure-SF) or `"A"` (Radix-wrapped) entries. Example: sf-button has `"pattern": "B"` but is actually Pattern A.
**Why it happens:** Pattern B was redefined during v1.3 to mean "lazy registry-only" but pre-v1.3 entries weren't updated.
**How to avoid:** Phase 20 audit must correct all `meta.pattern` values across registry.json.
**Warning signs:** `"pattern": "B"` on any non-lazy component.

### Pitfall 5: Bundle gate regression
**What goes wrong:** Shared JS exceeds 150KB after adding components.
**Why it happens:** Accidentally importing calendar/menubar in a non-lazy path, or barrel leak.
**How to avoid:** After all changes, run `ANALYZE=true pnpm build` and verify shared JS remains at ~103KB. Calendar and menubar deps should appear ONLY in async chunks.
**Warning signs:** Shared JS increase > 2KB from current 103KB baseline.

### Pitfall 6: next/dynamic loader must be 'use client'
**What goes wrong:** `next/dynamic` with `ssr: false` fails in Server Components in Next.js 15.
**Why it happens:** Next.js 15 restricts `ssr: false` to Client Components only.
**How to avoid:** Every `-lazy.tsx` file must have `'use client'` at line 1. This is already documented in the codebase (see `token-viz-loader.tsx` comment).
**Warning signs:** Build error or runtime crash when rendering the lazy component.

## Code Examples

### SF Calendar Wrapper (Pattern B)
```typescript
// components/sf/sf-calendar.tsx
"use client";

import { Calendar, type CalendarProps } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

/**
 * SF Calendar -- date picker with DU/TDR industrial styling.
 * P3 lazy component: import via sf-calendar-lazy.tsx, NOT from sf/index.ts.
 *
 * @param props - CalendarProps from react-day-picker via shadcn
 * @example
 * ```tsx
 * import { SFCalendarLazy } from "@/components/sf/sf-calendar-lazy";
 * <SFCalendarLazy mode="single" selected={date} onSelect={setDate} />
 * ```
 * FRAME layer
 */
export function SFCalendar({ className, ...props }: CalendarProps) {
  return (
    <Calendar
      className={cn("rounded-none border-2 border-border p-3", className)}
      classNames={{
        // Override all rounded-* classes from shadcn calendar
        // Specific class names depend on generated ui/calendar.tsx
      }}
      {...props}
    />
  );
}
```

### SF Menubar Wrapper (Pattern B)
```typescript
// components/sf/sf-menubar.tsx
"use client";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
  // ... other sub-components
} from "@/components/ui/menubar";
import { cn } from "@/lib/utils";

// Re-export all sub-components with SF prefix and rounded-none overrides
// Pattern mirrors sf-dropdown-menu.tsx approach
```

### Lazy Loader with SFSkeleton Fallback
```typescript
// components/sf/sf-calendar-lazy.tsx
"use client";

import dynamic from "next/dynamic";
import { SFSkeleton } from "@/components/sf";

const SFCalendarDynamic = dynamic(
  () =>
    import("@/components/sf/sf-calendar").then((m) => ({
      default: m.SFCalendar,
    })),
  {
    ssr: false,
    loading: () => <SFSkeleton className="h-[350px] w-[280px]" />,
  }
);

export { SFCalendarDynamic as SFCalendarLazy };
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| react-day-picker v8 | react-day-picker v9 | 2024/2025 | New API, better React 19 compat, different classNames prop structure |
| `@radix-ui/react-menubar` separate pkg | `radix-ui` unified package | 2025 | Already using unified `radix-ui@1.4.3` -- no migration needed |
| shadcn `--diff` for preview | shadcn `--dry-run` for preview | shadcn 4.x | Use `pnpm dlx shadcn@4.1.2 add [name] --dry-run` to inspect before install |

## Open Questions

1. **react-day-picker v9 classNames API**
   - What we know: shadcn calendar is built on react-day-picker. The classNames prop structure may differ from v8 docs.
   - What's unclear: Exact prop names for overriding rounded classes on individual sub-elements (day cells, nav buttons, etc.)
   - Recommendation: Install the base first (`pnpm dlx shadcn@4.1.2 add calendar`), then inspect generated `ui/calendar.tsx` to identify every `rounded-*` class before writing the SF wrapper.

2. **Existing meta.pattern audit scope**
   - What we know: SCAFFOLDING.md pitfall #3 says "Do not fix existing entries until Phase 20 final audit." sf-button has `"pattern": "B"` which should be `"A"` (Radix-wrapped).
   - What's unclear: Exact count of entries needing correction.
   - Recommendation: Audit all 48 entries in registry.json. Correct `meta.pattern` to match actual pattern (A = Radix-wrapped, B = lazy/P3, C = pure-SF). Rebuild public/r/.

3. **Lighthouse measurement methodology**
   - What we know: BASELINE.md explicitly states CLI headless Lighthouse is NOT representative due to WebGL. Browser DevTools against deployed Vercel URL is the gate-relevant measurement.
   - What's unclear: Whether the current Vercel deploy includes all Phase 17-19 components.
   - Recommendation: Deploy to Vercel preview first, then run Lighthouse in browser DevTools. Document scores but acknowledge headless CLI limitation.

## Final Audit Checklist (for planner)

This audit scope is unique to Phase 20 and covers all v1.3 work:

### Registry Completeness
- [ ] All 42 SF component files have corresponding registry.json entries
- [ ] All registry.json entries produce public/r/ JSON files after `pnpm registry:build`
- [ ] `meta.pattern` values corrected across all entries (A/B/C)
- [ ] `meta.heavy: true` on SFCalendar and SFMenubar entries only
- [ ] SFCalendar and SFMenubar NOT in sf/index.ts barrel

### SCAFFOLDING.md Accuracy
- [ ] Component count updated to reflect v1.3 total
- [ ] P3 lazy component rules still accurate
- [ ] Known pitfalls section current (pitfall #3 about meta.pattern resolved)
- [ ] Checklist items still accurate post-v1.3

### Bundle Gate
- [ ] `ANALYZE=true pnpm build` passes
- [ ] Shared JS remains under 150KB gate (baseline: 103KB)
- [ ] Calendar and Menubar deps appear only in async chunks
- [ ] No calendar/menubar imports in sf/index.ts or non-lazy paths

### Lighthouse
- [ ] Run in browser DevTools against deployed Vercel URL
- [ ] All 4 categories: 100/100 (or documented reason for variance)
- [ ] LCP, CLS, TTI within CLAUDE.md targets

## Sources

### Primary (HIGH confidence)
- `SCAFFOLDING.md` -- Pattern B definition, P3 rules, checklist, known pitfalls
- `registry.json` -- Current 48 entries, existing meta.layer/meta.pattern structure
- `BASELINE.md` -- 103KB shared JS baseline, Lighthouse methodology notes
- `components/animation/signal-overlay-lazy.tsx` -- Established `next/dynamic` + `ssr: false` pattern
- `sf/index.ts` -- Current barrel with 42 component files, no P3 exports
- `pnpm dlx shadcn@4.1.2 add calendar --dry-run` -- Confirmed: react-day-picker + date-fns deps, generates calendar.tsx
- `pnpm dlx shadcn@4.1.2 add menubar --dry-run` -- Confirmed: no new deps, generates menubar.tsx

### Secondary (MEDIUM confidence)
- [shadcn Calendar docs](https://ui.shadcn.com/docs/components/radix/calendar) -- Built on react-day-picker
- [shadcn Menubar docs](https://ui.shadcn.com/docs/components/radix/menubar) -- Built on Radix Menubar

### Tertiary (LOW confidence)
- react-day-picker v9 classNames API -- needs verification against generated code after install

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- dry-run confirmed exact deps, established patterns in codebase
- Architecture: HIGH -- Pattern B is documented in SCAFFOLDING.md with 5 existing `next/dynamic` examples
- Pitfalls: HIGH -- Known pitfalls from SCAFFOLDING.md + diff between registry.json and public/r/

**Research date:** 2026-04-06
**Valid until:** 2026-05-06 (stable -- shadcn pinned at 4.1.2, no moving targets)
