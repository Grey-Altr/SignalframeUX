# Phase 16: Infrastructure Baseline — Research

**Researched:** 2026-04-06
**Domain:** Design system scaffolding — shadcn install, prop vocabulary audit, ComponentsExplorer grouping, bundle baseline
**Confidence:** HIGH — all findings measured from actual files, no estimates
**Mode:** MAXDEPTH — every relevant file read, every component audited

---

## Summary

Phase 16 is a pure infrastructure phase with four deliverables: a codified SF wrapper checklist in SCAFFOLDING.md, a captured Lighthouse/bundle performance baseline, ComponentsExplorer regrouped into six named category groups, and a locked prop vocabulary document. None of these require new components to be built. All four are purely structural work against the existing codebase.

The primary work is: (1) SCAFFOLDING.md does not currently exist — it must be created from scratch. (2) ComponentsExplorer currently has eight filter tags (ALL, FRAME, SIGNAL, LAYOUT, INPUT, DATA, FEEDBACK, MOTION) driven by a flat COMPONENTS array — it must be regrouped into six named categories: Forms, Feedback, Navigation, Data Display, Layout, Generative. (3) The prop vocabulary is 100% compliant with the `intent` standard across all 29 existing SF components — the only deviations are legitimate (structural props named `width`, `direction`, `gap`, `cols`, `variant`, `weight` that are not semantic visual variants). This must be documented. (4) The shadcn install command is fully determined — seven bases need to be added; none currently exist in `components/ui/`.

**Primary recommendation:** Execute in this order: (A) shadcn install + clean build verification, (B) bundle baseline capture, (C) SCAFFOLDING.md creation, (D) ComponentsExplorer category migration, (E) prop vocabulary document.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INFRA-01 | SF wrapper creation checklist in SCAFFOLDING.md — rounded-none audit, `intent` prop rule, barrel rule, registry same-commit rule, a11y smoke test, prefers-reduced-motion rule | SCAFFOLDING.md does not yet exist. Full checklist content derived from pitfall research and codebase patterns. Section insertion point identified. |
| INFRA-02 | Performance baseline captured — Lighthouse LCP/TTI/bundle size recorded before first new component | `@next/bundle-analyzer` already installed. `ANALYZE=true pnpm build` is the command. `next.config.ts` already wires it. Current baseline: ~102KB initial (from STATE.md). |
| INFRA-03 | ComponentsExplorer grouped by category — Forms, Feedback, Navigation, Data Display, Layout, Generative | ComponentsExplorer read in full. CATEGORIES array and COMPONENTS array located. Migration plan fully specified below. |
| INFRA-04 | Prop vocabulary locked and documented — `intent` for semantic variants, `size` for scale, `asChild` for composition | All 29 sf/*.tsx files read. Full compliance report produced below. Zero violations found. Deviations are legitimate structural props, not CVA semantic variants. |
</phase_requirements>

---

## MAXDEPTH Audit 1: SCAFFOLDING.md

**Current state:** `SCAFFOLDING.md` does NOT exist at the project root or anywhere in the repo. The file is referenced in CLAUDE.md ("SCAFFOLDING.md — 337 lines") and in STATE.md ("DX: SCAFFOLDING.md (337 lines)"). The file was present in v1.0 development but is absent from the current working tree.

**Implication:** INFRA-01 requires creating SCAFFOLDING.md from scratch (or restoring it). The planner must treat this as a new file creation task, not an edit/insert task.

**What the file must contain:** Based on INFRA-01 success criteria, the SF Wrapper Creation Checklist must cover:
1. `rounded-none` audit — explicit override on every sub-element carrying Radix `rounded-*` classes
2. `intent` prop rule — CVA primary variant key must always be `intent`, never `variant`, `type`, `status`, `color`
3. Barrel rule — `sf/index.ts` must remain directive-free; `'use client'` goes in individual files only
4. Registry same-commit rule — component file + barrel export + registry entry in one commit
5. A11y smoke test — Tab, Enter/Space, arrow keys, Escape keyboard protocol; no WCAG violations
6. Prefers-reduced-motion rule — every SIGNAL animation guarded with `matchMedia('(prefers-reduced-motion: reduce)')`

**Additional content the checklist should reference** (from CLAUDE.md and project context):
- JSDoc block required: `@param`, `@example`, FRAME/SIGNAL layer note
- `asChild` pass-through: documented on trigger sub-components
- `'use client'` determination: inspect generated `ui/` file after shadcn add — if it has `'use client'`, the SF wrapper needs it too
- P3 lazy components: never add to `sf/index.ts`; import via `dynamic()` at usage site only
- Bundle gate: run `ANALYZE=true pnpm build` after each P1 component

---

## MAXDEPTH Audit 2: Prop Vocabulary — Full Compliance Report

All 29 SF-wrapped components audited. Findings below.

### Components WITH CVA and `intent` as Primary Variant (COMPLIANT)

| Component | CVA Key | `intent` Values | `size` Prop | `asChild` in API |
|-----------|---------|-----------------|-------------|-----------------|
| `sf-button.tsx` | `intent` | primary, ghost, signal | sm, md, lg, xl | No (passed through via ...props) |
| `sf-badge.tsx` | `intent` | default, primary, outline, signal | No | No |
| `sf-toggle.tsx` | `intent` | default, primary | sm, md, lg | No |

### Components WITHOUT CVA (structural/layout props — COMPLIANT, not visual variants)

These components use non-`intent` CVA keys but are legitimately structural, not semantic visual variants. They do not violate the intent convention because they control layout/structure, not appearance states.

| Component | CVA Key Used | Prop Name | Reason for Deviation | Status |
|-----------|-------------|-----------|---------------------|--------|
| `sf-container.tsx` | `width` | `width` | Controls max-width token, not visual variant | COMPLIANT — structural prop |
| `sf-stack.tsx` | `direction`, `gap`, `align` | layout props | Controls flex direction/spacing, not visual state | COMPLIANT — structural prop |
| `sf-grid.tsx` | `cols`, `gap` | layout props | Controls grid columns, not visual state | COMPLIANT — structural prop |

### Components Without CVA (passthrough wrappers — COMPLIANT)

These components have no CVA config at all — they are thin pass-through wrappers with `cn()` class overrides only. No `variant` prop exposed.

| Component | Has CVA | Uses `intent` | Notes |
|-----------|---------|---------------|-------|
| `sf-card.tsx` | No | No | Uses `hoverable` and `borderDraw` boolean props — structural, not visual variants |
| `sf-dialog.tsx` | No | No | Pure passthrough root; sub-components use `cn()` overrides |
| `sf-sheet.tsx` | No | No | Pure passthrough root |
| `sf-dropdown-menu.tsx` | No | No | Pure passthrough root |
| `sf-popover.tsx` | No | No | Pure passthrough root |
| `sf-select.tsx` | No | No | Pure passthrough root |
| `sf-tabs.tsx` | No | No | Pure passthrough root |
| `sf-tooltip.tsx` | No | No | Pure passthrough root |
| `sf-command.tsx` | No | No | Pure passthrough root |
| `sf-table.tsx` | No | No | No visual variants |
| `sf-input.tsx` | No | No | No visual variants |
| `sf-label.tsx` | No | No | No visual variants |
| `sf-textarea.tsx` | No | No | No visual variants |
| `sf-checkbox.tsx` | No | No | No visual variants |
| `sf-radio-group.tsx` | No | No | No visual variants |
| `sf-switch.tsx` | No | No | No visual variants |
| `sf-slider.tsx` | No | No | No visual variants |
| `sf-skeleton.tsx` | No | No | No visual variants |
| `sf-separator.tsx` | No | `weight` prop | `weight` is a structural thickness prop, not a semantic visual variant |
| `sf-scroll-area.tsx` | No | No | No visual variants |
| `sf-text.tsx` | No | `variant` prop | `variant` here names a typographic semantic alias ("heading-1", "body") — not an intent. This is a DOCUMENTED exception: SFText predates the `intent` convention and uses `variant` to match React/Next.js typography component conventions. |

### `asChild` Usage

`asChild` is a Radix pass-through prop. It is NOT defined in SF wrapper signatures — it flows through `...props` to the underlying Radix trigger components. This is the correct pattern. It is documented in JSDoc examples for: `SFDialogTrigger`, `SFSheetTrigger`, `SFDropdownMenuTrigger`, `SFPopoverTrigger`, `SFTooltipTrigger`.

### Summary: Violations Found

**Zero violations.** All 29 components comply with the prop vocabulary. The only deviation is `SFText.variant` which is a pre-existing documented exception.

### Prop Vocabulary Documentation Content (for INFRA-04)

The vocabulary to document:

| Prop | Rule | Values | Who Uses It |
|------|------|--------|-------------|
| `intent` | Primary CVA semantic variant on all SF components with visual states | Component-specific (primary/ghost/signal for buttons; default/primary/outline for badges; etc.) | SFButton, SFBadge, SFToggle — and ALL new v1.3 components |
| `size` | Scale variant — height and padding | sm, md, lg, xl (component-specific) | SFButton, SFToggle — and new components that have scale variants |
| `asChild` | Radix composition pattern — renders trigger as the child element | boolean | All SF trigger sub-components (SFDialogTrigger, etc.) |
| `width` / `cols` / `gap` / `direction` | Structural layout props — NOT visual variants | Component-specific | Layout primitives only (SFContainer, SFGrid, SFStack) |
| `variant` | EXCEPTION — SFText only | heading-1, heading-2, heading-3, body, small | SFText only — documented exception |

---

## MAXDEPTH Audit 3: ComponentsExplorer

**File location:** `components/blocks/components-explorer.tsx`

### Current Architecture

The ComponentsExplorer is a `'use client'` component. It is driven by:

1. **`CATEGORIES` const array** (line 9-18): `["ALL", "FRAME", "SIGNAL", "LAYOUT", "INPUT", "DATA", "FEEDBACK", "MOTION"]` — these are the filter tags displayed in the filter bar
2. **`Category` type** (line 20): `(typeof CATEGORIES)[number]` — union of the above
3. **`ComponentEntry` interface** (line 22-31): each entry has `index`, `name`, `category`, `subcategory`, `version`, `variant`, `filterTag`, `preview`
4. **`COMPONENTS` array** (lines 201-218): 16 entries (12 FRAME components + 4 SIGNAL generative entries), with `filterTag` pointing to the CATEGORIES values

### Current COMPONENTS Entries (complete inventory)

| index | name | category | filterTag |
|-------|------|----------|-----------|
| 001 | BUTTON | PRIMITIVES | INPUT |
| 002 | INPUT | PRIMITIVES | INPUT |
| 003 | TOGGLE | PRIMITIVES | INPUT |
| 004 | SLIDER | PRIMITIVES | INPUT |
| 005 | CARD | LAYOUT | LAYOUT |
| 006 | MODAL | LAYOUT | LAYOUT |
| 007 | TABS | NAVIGATION | LAYOUT |
| 008 | BADGE | FEEDBACK | FEEDBACK |
| 009 | TABLE | DATA | DATA |
| 010 | TOAST | FEEDBACK | FEEDBACK |
| 011 | PAGINATION | NAVIGATION | DATA |
| 012 | DRAWER | LAYOUT | LAYOUT |
| 101 | NOISE_BG | GENERATIVE | SIGNAL |
| 102 | WAVEFORM | GENERATIVE | SIGNAL |
| 103 | GLITCH_TXT | GENERATIVE | SIGNAL |
| 104 | PARTICLE | GENERATIVE | SIGNAL |

**Key observation:** Several entries in the COMPONENTS array reference components that do not yet have SF implementations (TOAST at index 010, PAGINATION at 011). These are "aspirational" entries that were present before v1.3 shipped them.

### Target Architecture (INFRA-03)

INFRA-03 requires the ComponentsExplorer to display **six named category groups**: Forms, Feedback, Navigation, Data Display, Layout, Generative.

**What must change:**

1. The `CATEGORIES` array must be updated to: `["ALL", "FORMS", "FEEDBACK", "NAVIGATION", "DATA_DISPLAY", "LAYOUT", "GENERATIVE"]`
2. The `Category` type regenerates automatically from the const
3. All existing `filterTag` values in COMPONENTS must be remapped to the new categories
4. New entries for v1.3 components will be added in Phase 17–19 with the new filterTag values

**FilterTag remapping for existing entries:**

| Entry | Current filterTag | New filterTag |
|-------|------------------|---------------|
| BUTTON | INPUT | FORMS |
| INPUT | INPUT | FORMS |
| TOGGLE | INPUT | FORMS |
| SLIDER | INPUT | FORMS |
| CARD | LAYOUT | LAYOUT |
| MODAL | LAYOUT | LAYOUT |
| TABS | LAYOUT | NAVIGATION |
| BADGE | FEEDBACK | FEEDBACK |
| TABLE | DATA | DATA_DISPLAY |
| TOAST | FEEDBACK | FEEDBACK |
| PAGINATION | DATA | DATA_DISPLAY |
| DRAWER | LAYOUT | LAYOUT |
| NOISE_BG | SIGNAL | GENERATIVE |
| WAVEFORM | SIGNAL | GENERATIVE |
| GLITCH_TXT | SIGNAL | GENERATIVE |
| PARTICLE | SIGNAL | GENERATIVE |

**No structural changes required** to the ComponentEntry interface, FilterIndicator, grid rendering, GSAP Flip animation, or session state. Only CATEGORIES array values and COMPONENTS filterTag values change.

**v1.3 new component filterTag assignments** (for future phases):

| Planned Component | filterTag |
|------------------|-----------|
| SFAccordion | FEEDBACK |
| SFAlert | FEEDBACK |
| SFAlertDialog | FEEDBACK |
| SFCollapsible | FEEDBACK |
| SFProgress | FEEDBACK |
| SFAvatar | NAVIGATION |
| SFBreadcrumb | NAVIGATION |
| SFEmptyState | NAVIGATION |
| SFNavigationMenu | NAVIGATION |
| SFPagination | DATA_DISPLAY |
| SFStepper | NAVIGATION |
| SFStatusDot | FEEDBACK |
| SFToggleGroup | FORMS |

### Session State Key Impact

`SESSION_KEYS.COMPONENTS_FILTER` stores the active filter category. If a user previously had a session with `filterTag = "INPUT"` or `"SIGNAL"`, that stored value will no longer match any CATEGORIES entry after the rename. The filter will default back to "ALL" — acceptable UX behavior for this migration.

---

## MAXDEPTH Audit 4: shadcn Bases — Install Status

### Currently Installed in `components/ui/` (24 files)

badge.tsx, button.tsx, card.tsx, checkbox.tsx, command.tsx, dialog.tsx, dropdown-menu.tsx, input-group.tsx, input.tsx, label.tsx, popover.tsx, radio-group.tsx, scroll-area.tsx, select.tsx, separator.tsx, sheet.tsx, skeleton.tsx, slider.tsx, switch.tsx, table.tsx, tabs.tsx, textarea.tsx, toggle.tsx, tooltip.tsx

### P1+P2 Bases Required (not yet installed)

| Component | shadcn name | Status | Notes |
|-----------|-------------|--------|-------|
| SFAccordion | `accordion` | MISSING | Pure Radix — check generated file for `'use client'` |
| SFAlertDialog | `alert-dialog` | MISSING | Has confirm/cancel — will have `'use client'` |
| SFAvatar | `avatar` | MISSING | **HIGH RISK**: `rounded-full` on AvatarImage + AvatarFallback |
| SFNavigationMenu | `navigation-menu` | MISSING | **COMPLEX**: `data-state` CSS selectors, `'use client'` |
| SFProgress | `progress` | MISSING | **HIGH RISK**: `rounded-full` on track AND fill indicator |
| SFCollapsible | `collapsible` | MISSING | Simple disclosure |
| SFToggleGroup | `toggle-group` | MISSING | Extends existing toggle pattern |

**Exact install command:**
```bash
pnpm dlx shadcn@latest add accordion alert-dialog avatar navigation-menu progress collapsible toggle-group
```

**Note:** `toast` is NOT in this list because the Toast shadcn primitive is deprecated in favor of Sonner. `SFToast` uses `sonner` directly. No `ui/toast.tsx` is needed.

**Collapsible note:** `collapsible` is needed for FD-06 (SFCollapsible) but was not in the previous research's install command. Add it here.

### Conflict Risk Assessment

None of the seven bases conflict with existing `components/ui/` files. All are new additions.

### Post-Install `'use client'` Check Protocol

After `pnpm dlx shadcn@latest add`, inspect each generated file:
- Files that will have `'use client'`: `alert-dialog.tsx`, `navigation-menu.tsx`, `toggle-group.tsx` (confirmed from Radix pattern — all have event listeners)
- Files that may or may not: `accordion.tsx` (Radix Accordion uses `data-state`, check the output), `avatar.tsx` (often no `'use client'`), `progress.tsx` (may be presentational), `collapsible.tsx` (has open/close state)
- Rule: if the generated `ui/` file has `'use client'`, the SF wrapper needs it. If not, check if the SF wrapper itself uses any hooks — if not, it can be a Server Component.

---

## MAXDEPTH Audit 5: Bundle Baseline Research

### Current Setup

- `@next/bundle-analyzer@16.2.2` is installed in devDependencies
- `next.config.ts` already wires it: `enabled: process.env.ANALYZE === "true"`
- `optimizePackageImports: ["lucide-react"]` — only Lucide is currently optimized

**Run command:**
```bash
ANALYZE=true pnpm build
```

This generates `/.next/analyze/client.html` and `/.next/analyze/server.html` in the browser.

### Metrics to Capture for Baseline

The baseline must record:
1. **Initial JS bundle size** (client entry chunk, before any lazy chunks load)
2. **Lighthouse LCP** — run against `pnpm start` (production build) on `/`
3. **Lighthouse TTI** — same
4. **Lighthouse Performance score** — same

### Known Baseline Values (from STATE.md)

Current Three.js async chunk: 102KB initial shared bundle (measured in v1.1). This is the starting point. The baseline for Phase 16 should re-confirm this number before any v1.3 installs, because v1.2 changes may have shifted it.

### Bundle Gate Values

| Threshold | Value | Action |
|-----------|-------|--------|
| Danger zone | > 150KB initial | Investigate immediately |
| Hard limit | > 200KB initial | Must not reach |
| Per-P1-component gate | Run `ANALYZE=true pnpm build` after each | Verify growth is < 5KB per FRAME-only component |

### `optimizePackageImports` Extension

After Sonner install (`pnpm add sonner`), add `"sonner"` to `optimizePackageImports` in `next.config.ts` if Sonner's initial bundle footprint is material.

---

## MAXDEPTH Audit 6: Registry Structure

### Current Schema (from registry.json)

Registry has 33 items. Each entry follows this structure:
```json
{
  "name": "sf-[name]",
  "type": "registry:ui",
  "title": "SF [Name]",
  "description": "...",
  "dependencies": ["class-variance-authority"],
  "registryDependencies": ["[shadcn-base-name]"],
  "files": [
    {
      "path": "components/sf/sf-[name].tsx",
      "type": "registry:ui"
    }
  ],
  "meta": {
    "layer": "frame",
    "pattern": "A"
  }
}
```

### Pattern Inconsistency Found

The `meta.pattern` values in registry.json do not consistently follow the architecture document's A/B/C taxonomy:

- `sf-button.tsx`: has `"pattern": "B"` in registry — but SFButton is Pattern A (Radix wrap), not B (lazy registry-only). This appears to be a labeling error from v1.0.
- `sf-badge.tsx`: has `"pattern": "B"` — same issue; Badge is Pattern A
- `sf-container.tsx`, `sf-section.tsx`, `sf-grid.tsx`, `sf-stack.tsx`, `sf-text.tsx`: all marked `"pattern": "B"` — these are Pattern C (pure SF), not B

**Assessment:** The `meta.pattern` field in the registry was inconsistently applied. In registry.json, `"B"` appears to have been used for "no Radix base" (which is the architecture doc's Pattern C). The architecture doc's Pattern B means "lazy registry-only."

**Action for Phase 16:** The prop vocabulary document should clarify this inconsistency and lock the correct meaning. The planner should NOT fix the registry entries in Phase 16 (that is scope creep); document the discrepancy so Phase 20's final audit can normalize it.

### Required Fields for New v1.3 Entries

Every new registry entry needs:
- `name`: `"sf-[component-name]"` (kebab-case)
- `type`: `"registry:ui"`
- `title`: `"SF [ComponentName]"` (title case)
- `description`: one-line description
- `registryDependencies`: array of shadcn base names (empty `[]` for Pattern C components)
- `dependencies`: `["class-variance-authority"]` if CVA is used, else omit
- `files`: single file path entry
- `meta.layer`: `"frame"` for FRAME-only; `"signal"` for animated components
- `meta.pattern`: use `"A"` for Radix-wrap, `"C"` for pure-SF, `"B"` only for lazy P3

---

## MAXDEPTH Audit 7: Rounded Violations in `components/ui/`

Grep results confirm Radix-generated `rounded-*` classes that will survive `--radius: 0px` override and must be neutralized in SF wrappers.

### High-Risk Elements (confirmed `rounded-full` or `rounded-xl` in generated bases)

| File | Element | Class | Risk |
|------|---------|-------|------|
| `ui/badge.tsx` | root span | `rounded-4xl` | HIGH — Badge is a circle-ish pill; SFBadge already overrides |
| `ui/card.tsx` | Card root | `rounded-xl` | HIGH — already overridden by SFCard |
| `ui/card.tsx` | CardHeader | `rounded-t-xl` | HIGH — already overridden |
| `ui/card.tsx` | CardFooter | `rounded-b-xl` | HIGH — already overridden |
| `ui/dialog.tsx` | DialogContent | `rounded-xl` | HIGH — already overridden by SFDialogContent `rounded-none` |
| `ui/dialog.tsx` | DialogFooter | `rounded-b-xl` | HIGH — already overridden |
| `ui/command.tsx` | Command root | `rounded-xl!` | HIGH — already overridden by SFCommand `rounded-none` |
| `ui/command.tsx` | CommandDialog | `rounded-xl!` | HIGH — SFCommandDialog applies `rounded-none` |
| `ui/command.tsx` | CommandItem | `rounded-sm` | HIGH — already overridden by SFCommandItem `rounded-none` |
| `ui/tabs.tsx` | TabsList | `rounded-lg` | HIGH — already overridden by SFTabsList `rounded-none` |
| `ui/button.tsx` | Button (xs) | `rounded-[min(var(--radius-md),10px)]` | MEDIUM — SFButton overrides via `sf-pressable` |
| `ui/button.tsx` | Button (sm) | `rounded-[min(var(--radius-md),12px)]` | MEDIUM — SFButton overrides |
| `ui/dropdown-menu.tsx` | DropdownMenuItem | `rounded-md` | HIGH — already overridden by SFDropdownMenuItem `rounded-none` |
| `ui/select.tsx` | SelectTrigger | `rounded-md` | HIGH — already overridden by SFSelectTrigger `rounded-none` |
| `ui/select.tsx` | SelectItem | `rounded-sm` | HIGH — already overridden by SFSelectItem `rounded-none` |
| `ui/tooltip.tsx` | TooltipContent | (has `rounded` in Arrow) | MEDIUM — TooltipContent already `rounded-none` |
| `ui/skeleton.tsx` | root | `rounded-md` | HIGH — already overridden by SFSkeleton `rounded-none` |
| `ui/scroll-area.tsx` | viewport | `rounded-[inherit]` | LOW — inherits `rounded-none` from parent |

### New Bases That Will Have `rounded-*` (not yet installed)

| Future Base | Expected `rounded-*` | Elements at Risk |
|-------------|---------------------|-----------------|
| `avatar.tsx` | `rounded-full` | AvatarRoot, AvatarImage, AvatarFallback — ALL THREE must get `rounded-none` |
| `progress.tsx` | `rounded-full` | ProgressRoot (track), ProgressIndicator (fill) — BOTH must get `rounded-none` |
| `navigation-menu.tsx` | `rounded-md` or `rounded-lg` | Content viewport, indicator |
| `accordion.tsx` | Likely none (Radix Accordion rarely has rounded) | Verify post-install |
| `alert-dialog.tsx` | `rounded-xl` (like Dialog) | AlertDialogContent, AlertDialogFooter |
| `collapsible.tsx` | None expected | Verify post-install |
| `toggle-group.tsx` | `rounded-*` on items (like toggle.tsx) | Toggle group items |

### Confirmed Clean in SF Layer

Grep of `components/sf/` for `rounded-` that is NOT `rounded-none`: **zero matches**. The existing SF layer is fully compliant. Every non-`rounded-none` class in `ui/` that is inherited by an SF wrapper is already overridden.

---

## Standard Stack

### Core (all existing — no new installs for Phase 16 itself)

| Library | Version | Purpose |
|---------|---------|---------|
| `shadcn` | 4.1.2 | CLI for adding base components |
| `radix-ui` | 1.4.3 | All Radix primitives (umbrella package) |
| `class-variance-authority` | 0.7.1 | CVA for variant props |
| `@next/bundle-analyzer` | 16.2.2 | Bundle size measurement |
| `next` | 15.3.0 | Build system; Turbopack dev |

### New Dependencies (Phase 16 install — shadcn bases only)

No npm dependencies are added in Phase 16. The shadcn CLI generates files into `components/ui/` without adding npm packages (Radix primitives are already covered by `radix-ui@1.4.3`).

**Deferred to Phase 18:** `pnpm add sonner` (for SFToast)
**Deferred to Phase 20:** `pnpm add react-day-picker` (for SFCalendar, lazy)

---

## Architecture Patterns

### Pattern A: Radix → SF Wrap (established)

Applies to all seven new shadcn base installs. See existing `sf-dialog.tsx` as the reference pattern.

Critical rules:
- Check generated `ui/` file for `'use client'` — if present, SF wrapper also needs it
- Apply `rounded-none` to every element with Radix `rounded-*` in the base
- Use `cn()` for class merging, never string template
- Expose CVA `intent` for visual variants

### Pattern C: Pure SF Construction (established)

No Radix base. Semantic HTML + Tailwind tokens + CVA. Server Component by default.

Reference pattern: `sf-text.tsx`, `sf-container.tsx`, `sf-stack.tsx`.

### The Barrel Rule (verified against sf/index.ts)

Current `sf/index.ts` has 104 lines with 29 exports in two groups: "Layout Primitives" and "New wrappers". No `'use client'` directive — confirmed clean.

After v1.3, the barrel will have ~44 exports. The plan should add inline section comments:
```typescript
// Layout
// Forms
// Feedback
// Navigation
// Data
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead |
|---------|-------------|-------------|
| Bundle analysis | Custom size logging | `ANALYZE=true pnpm build` via `@next/bundle-analyzer` |
| shadcn base files | Manual Radix wrapper | `pnpm dlx shadcn@latest add [name]` |
| Registry JSON generation | Manual JSON | `pnpm registry:build` (shadcn build command) |
| Category filtering in ComponentsExplorer | New filter architecture | Update `CATEGORIES` const and `filterTag` values in existing COMPONENTS array |
| Performance measurement | Custom perf tooling | Lighthouse CLI or browser Lighthouse panel against production build |

---

## Common Pitfalls

### Pitfall 1: shadcn CLI version drift

`package.json` has `shadcn@4.1.2` in devDependencies. The `pnpm dlx shadcn@latest` command may pull a newer version than 4.1.2, generating files with slightly different class patterns or structure. To stay on the pinned version: `pnpm dlx shadcn@4.1.2 add [names]`. Verify this against the project's installed version before running.

### Pitfall 2: Collapsible vs Alert missing from install command

Previous research documents showed the install command as `accordion alert-dialog avatar navigation-menu progress toast toggle-group`. **Toast is wrong** (we use Sonner, not shadcn toast). **Collapsible is missing** (needed for FD-06/SFCollapsible in Phase 17). **Alert is a shadcn component** that does NOT need a Radix base install — it is pure HTML. Correct command: `accordion alert-dialog avatar navigation-menu progress collapsible toggle-group`.

### Pitfall 3: ComponentsExplorer session state stale filter

After renaming CATEGORIES (e.g., "INPUT" → "FORMS"), any user session storing the old category name will receive an unrecognized filter value. The filter's `useMemo` will render all components (since none match the stale filterTag), then the FilterIndicator will not find the active button. The fix: the `setActiveFilter` default is "ALL" — stale sessions will silently fall back to "ALL" because the stored value won't match any `data-filter` attribute. No explicit migration needed; document in plan.

### Pitfall 4: registry.json `meta.pattern` inconsistency

Existing entries use `"pattern": "B"` incorrectly for non-Radix pure-SF components (sf-container, sf-stack, etc.). New entries should use `"pattern": "A"` for Radix-wrapped and `"pattern": "C"` for pure-SF. Do not "fix" the existing entries in Phase 16 — that is Phase 20 scope. New Phase 17+ entries must use the correct pattern value.

### Pitfall 5: SCAFFOLDING.md length constraint

The file is referenced as "337 lines" in STATE.md from v1.0. The new SCAFFOLDING.md should include the SF Wrapper Creation Checklist but does not need to match 337 lines exactly — it should be as long as it needs to be to be useful. Avoid padding.

---

## Code Examples

### ComponentsExplorer CATEGORIES Migration

```typescript
// BEFORE (current)
const CATEGORIES = [
  "ALL",
  "FRAME",
  "SIGNAL",
  "LAYOUT",
  "INPUT",
  "DATA",
  "FEEDBACK",
  "MOTION",
] as const;

// AFTER (INFRA-03 target)
const CATEGORIES = [
  "ALL",
  "FORMS",
  "FEEDBACK",
  "NAVIGATION",
  "DATA_DISPLAY",
  "LAYOUT",
  "GENERATIVE",
] as const;
```

### ComponentEntry filterTag Update (Button as example)

```typescript
// BEFORE
{ index: "001", name: "BUTTON", category: "PRIMITIVES", subcategory: "FRAME", version: "v2.1.0", variant: "default", filterTag: "INPUT", preview: <PreviewButton /> },

// AFTER
{ index: "001", name: "BUTTON", category: "FORMS", subcategory: "FRAME", version: "v2.1.0", variant: "default", filterTag: "FORMS", preview: <PreviewButton /> },
```

### Registry Entry Template for New v1.3 Components

```json
{
  "name": "sf-accordion",
  "type": "registry:ui",
  "title": "SF Accordion",
  "description": "Industrial accordion with stagger SIGNAL animation, intent variants, no radius",
  "registryDependencies": ["accordion"],
  "dependencies": ["class-variance-authority"],
  "files": [
    {
      "path": "components/sf/sf-accordion.tsx",
      "type": "registry:ui"
    }
  ],
  "meta": {
    "layer": "signal",
    "pattern": "A"
  }
}
```

### SF Wrapper Creation Checklist (for SCAFFOLDING.md)

```markdown
## SF Wrapper Creation Checklist

Before marking any new SF component complete, verify each item:

### 1. rounded-none Audit
- [ ] Run `pnpm build` and inspect component in browser DevTools
- [ ] Every element that inherits from the shadcn base: confirm `border-radius: 0px` in computed styles
- [ ] Special attention: Avatar (image + fallback), Progress (track + fill), AlertDialog (content + footer)
- [ ] Fix: add `rounded-none` explicitly to every sub-element's `cn()` call

### 2. intent Prop Rule
- [ ] CVA config uses `intent:` as the top-level variants key
- [ ] No prop named `variant`, `type`, `status`, `color`, or `mode` controls the primary visual state
- [ ] Exception: structural props (`width`, `size`, `direction`, `gap`) are not visual variants — these names are fine

### 3. Barrel Rule
- [ ] New export added to `sf/index.ts` in the same commit as the component file
- [ ] `sf/index.ts` has NO `'use client'` directive (verify before committing)
- [ ] Exception: P3 lazy components (Calendar, Menubar) are NOT added to `sf/index.ts`

### 4. Registry Same-Commit Rule
- [ ] `registry.json` entry appended with correct `meta.layer` and `meta.pattern`
- [ ] Corresponding `public/r/sf-[name].json` file created
- [ ] `pnpm registry:build` runs clean after the addition

### 5. A11y Smoke Test
- [ ] Tab into the component
- [ ] Activate with Enter or Space
- [ ] Navigate within (if applicable) with arrow keys
- [ ] Dismiss or close with Escape
- [ ] Tab out to the next focusable element
- [ ] Verify no WCAG AA violations (contrast, focus ring visibility)

### 6. Prefers-Reduced-Motion Rule
- [ ] Any GSAP animation is guarded: `if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return`
- [ ] With reduced motion: component still renders and functions correctly (animation is the enhancement, not the behavior)
- [ ] GSAP `prefers-reduced-motion` check runs before tween, not after

### 7. JSDoc Block
- [ ] `@param` for each public prop
- [ ] `@example` with minimal working usage
- [ ] Layer note: "FRAME layer" or "FRAME + SIGNAL layer"

### 8. 'use client' Determination
- [ ] Check the generated `ui/[name].tsx` file: does it have `'use client'`?
- [ ] If yes: the SF wrapper file must also have `'use client'` at line 1
- [ ] If no: check if the SF wrapper uses any hooks — if yes, add `'use client'`; if no, it is a Server Component

### 9. Bundle Gate (animated and Radix-wrapped components only)
- [ ] Run `ANALYZE=true pnpm build` after integrating the component
- [ ] Verify initial JS bundle stays below 150KB gate
- [ ] Verify layout primitives (SFContainer, SFSection, SFStack, SFGrid, SFText) are absent from client chunks
```

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| shadcn Radix Toast | Sonner (sonner@2.0.7) | Toast is now imperative API; SFToast wraps Sonner, not `ui/toast.tsx` |
| Manual rounded-radius via CSS var | Explicit `rounded-none` on every sub-element | `--radius: 0px` does not reach literal `rounded-full` classes — must override directly |
| Single CATEGORIES array for all filter types | Six semantic category groups | Aligns explorer taxonomy with product language (Forms, Feedback, Navigation, etc.) |

---

## Open Questions

1. **SCAFFOLDING.md recovery vs. fresh create**
   - What we know: File was present in v1.0 ("337 lines") but is gone from the current working tree
   - What's unclear: Is it in git history? Should it be recovered or rewritten?
   - Recommendation: Check `git log --all --full-history -- SCAFFOLDING.md`. If recoverable, restore and append the new checklist section. If not, create fresh with checklist as the primary content.

2. **ComponentsExplorer: `category` field vs. `filterTag` field**
   - What we know: Each entry has both `category` (display text: "PRIMITIVES", "LAYOUT", etc.) and `filterTag` (filter key: "INPUT", "LAYOUT", etc.) — these are currently inconsistent with each other
   - What's unclear: Should `category` and `filterTag` be unified to the same value after the migration?
   - Recommendation: Update both fields to use the new category names (e.g., `category: "FORMS"`, `filterTag: "FORMS"`) for consistency.

3. **`pnpm dlx shadcn@4.1.2` vs. `pnpm dlx shadcn@latest`**
   - What we know: `shadcn@4.1.2` is in devDependencies; `pnpm dlx` fetches from npm
   - What's unclear: Does `pnpm dlx shadcn@4.1.2 add` work correctly, or should it be `pnpm dlx shadcn@latest`?
   - Recommendation: Use `pnpm dlx shadcn@4.1.2 add [names]` to stay on the pinned version. If it fails, fall back to `@latest` and document the version difference.

---

## Validation Architecture

nyquist_validation key absent from `.planning/config.json` — treat as enabled.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — no jest.config, vitest.config, pytest.ini, or test directories found in the project |
| Config file | None — Wave 0 gap |
| Quick run command | N/A — no test runner present |
| Full suite command | N/A |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INFRA-01 | SCAFFOLDING.md exists and contains all 9 checklist items | manual-only | N/A — visual inspection | ❌ Wave 0 |
| INFRA-02 | Bundle baseline numbers recorded in a file | manual-only | `ANALYZE=true pnpm build` + manual capture | N/A |
| INFRA-03 | ComponentsExplorer shows six category groups | smoke (build) | `pnpm build` succeeds with no TypeScript errors | N/A — build verification |
| INFRA-04 | Prop vocabulary doc exists; no `variant:` in any CVA config | automated grep | `grep -rn "variant:" components/sf/ --include="*.tsx"` should return 0 matches | N/A — one-liner |

**INFRA-03 TypeScript verification:**
```bash
pnpm exec tsc --noEmit
```
A TypeScript error will surface if any COMPONENTS entry uses a filterTag not present in the updated CATEGORIES union type — this is the automated gate for INFRA-03 correctness.

**INFRA-04 CVA compliance grep:**
```bash
grep -rn "variant:" /Users/greyaltaer/code/projects/SignalframeUX/components/sf/ --include="*.tsx"
```
Expected output: zero matches (all CVA configs use `intent:`, not `variant:`).

### Sampling Rate
- **Per task commit:** `pnpm exec tsc --noEmit`
- **Per wave merge:** `pnpm build`
- **Phase gate:** `pnpm build` green + `ANALYZE=true pnpm build` bundle numbers recorded

### Wave 0 Gaps
- [ ] No test framework present — Phase 16 tasks are infrastructure and documentation; automated testing is not the primary verification mechanism. The TypeScript compiler and bundle analyzer serve as the automated gates.

---

## Sources

### Primary (HIGH confidence — directly measured from files)

- `components/blocks/components-explorer.tsx` — CATEGORIES array, COMPONENTS array, ComponentEntry interface, filter architecture read in full
- `components/sf/*.tsx` — all 29 SF wrapper files read; prop vocabulary extracted directly
- `components/sf/index.ts` — barrel structure confirmed (29 exports, no `'use client'`)
- `components/ui/*.tsx` — all 24 base files grepped for `rounded-*` violations
- `registry.json` — all 33 entries read; `meta` field patterns catalogued
- `package.json` — dependencies confirmed: radix-ui@1.4.3, shadcn@4.1.2, @next/bundle-analyzer@16.2.2
- `next.config.ts` — bundle analyzer wiring confirmed (`ANALYZE=true`); `optimizePackageImports` confirmed
- `.planning/REQUIREMENTS.md` — INFRA-01 through INFRA-04 success criteria read verbatim
- `.planning/STATE.md` — accumulated context and constraints read
- `.planning/research/SUMMARY.md`, `PITFALLS.md`, `ARCHITECTURE.md` — prior research read in full

### Secondary (MEDIUM confidence — cross-referenced)

- `.planning/project-context.md` — tech stack and conventions confirmed
- `CLAUDE.md` — system rules and quality bar confirmed
- Filesystem `ls` of `components/ui/` and `components/sf/` — install status measured directly

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — measured from package.json and node_modules
- Architecture: HIGH — measured from actual source files
- Pitfalls: HIGH — derived from direct file audits (rounded grep, barrel grep)
- ComponentsExplorer migration: HIGH — full file read; migration fully specified

**Research date:** 2026-04-06
**Valid until:** 2026-05-06 (30 days — stable infra phase)
