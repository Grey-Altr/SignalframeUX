# Phase 11: Registry Completion - Research

**Researched:** 2026-04-06
**Domain:** shadcn CLI registry — JSON schema, build tooling, cssVars, meta fields
**Confidence:** HIGH

## Summary

Phase 11 is a pure data-authoring and tooling task. The shadcn registry system is well-documented and the schema is stable. All required schema fields (`cssVars`, `meta`, `type`) are confirmed valid via the live registry-item.json schema at `https://ui.shadcn.com/schema/registry-item.json`. No new dependencies or architectural decisions are required — this phase is a gap-closure exercise: populate what is missing.

The current state has 27 items in `registry.json` (all interactive + animation + form SF components, but missing the 5 layout primitives). Only 19 `public/r/` JSON files exist — 10 items added in later rounds (sf-label, sf-select, sf-checkbox, sf-radio-group, sf-switch, sf-textarea, circuit-divider, vhs-overlay, hero-mesh, scramble-text) have no corresponding `public/r/*.json` file. The layout primitives (sf-container, sf-section, sf-grid, sf-stack, sf-text) and sf-theme are absent from both `registry.json` and `public/r/`. `meta.layer` and `meta.pattern` fields are absent from all 27 existing registry items.

**Primary recommendation:** Author all missing `public/r/*.json` files manually (embedded source), add the 7 missing `registry.json` items (5 layout primitives + sf-theme), backfill `meta` fields on all 34 items, and add the `registry:build` script to package.json for future maintenance.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DX-04 | registry.json includes all 29 interactive + 5 layout SF components plus sf-theme (cssVars, token-only); public/r/ is built and up to date | Full schema confirmed. Gap inventory complete. Build command identified. cssVars and meta field structure documented. |
</phase_requirements>

## Standard Stack

### Core
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| shadcn CLI | latest (pnpm dlx shadcn) | Generates `public/r/*.json` via `shadcn build` | The only supported build tool for shadcn-compatible registries |
| registry-item.json schema | ui.shadcn.com/schema/registry-item.json | Schema for each `public/r/*.json` item | Required for `pnpm shadcn add` resolution |
| registry.json | ui.shadcn.com/schema/registry.json | Root registry listing all items | Read by shadcn CLI to discover available items |

**Build command:**
```bash
pnpm dlx shadcn build
```

Add to `package.json` scripts:
```json
"registry:build": "shadcn build"
```

## Architecture Patterns

### Registry Item Types Used in This Project

| Type | Used For | Example |
|------|----------|---------|
| `registry:ui` | All SF interactive + layout primitive components | sf-button, sf-container |
| `registry:style` | Token-only theme entry (sf-theme) | sf-theme |

### cssVars Structure (for sf-theme)

The `cssVars` object in a registry item uses three sections: `theme` (inside `@theme` / Tailwind), `light` (`:root` or light mode), and `dark` (`.dark`). For sf-theme, the relevant structure maps directly to globals.css:

```json
{
  "cssVars": {
    "theme": {
      "color-background": "oklch(1 0 0)",
      "color-foreground": "oklch(0.145 0 0)",
      "radius": "0px"
    },
    "light": {
      "signal-intensity": "0.5",
      "signal-speed": "1",
      "signal-accent": "0"
    },
    "dark": {
      "color-background": "oklch(0.145 0 0)",
      "color-foreground": "oklch(0.985 0 0)"
    }
  }
}
```

**Important:** The shadcn `cssVars` install flow injects values into the target project's globals.css. This means `sf-theme` provides a bootstrap of the token system for fresh consumers — it does NOT need to replicate the full globals.css verbatim. Only the core color tokens, radius zero-out, and the SIGNAL runtime vars matter here.

### meta Field Pattern

`meta` is a freeform object. Add two fields to every registry item:

```json
{
  "meta": {
    "layer": "frame",
    "pattern": "A"
  }
}
```

**layer values:** `"frame"` (layout primitives + form components) or `"signal"` (animation components)

**pattern values:**
- `"A"` — Thin SF wrap of a shadcn/Radix base (most interactive components)
- `"B"` — CVA-driven variant component with no Radix base (sf-container, sf-grid, sf-stack, sf-badge, sf-button, sf-toggle)
- `"C"` — Animation or standalone component with no shadcn/Radix dependency (circuit-divider, vhs-overlay, hero-mesh, scramble-text)

### Recommended Project Structure (no changes needed)
```
public/r/
├── registry.json         # Root listing (served at /r/registry.json)
├── base.json             # Token-layer entry (existing)
├── sf-theme.json         # NEW — cssVars-only token installer
├── sf-button.json        # Existing
├── [all components].json # 34 total after completion
```

## Gap Inventory (Complete)

### Items in registry.json but MISSING public/r/*.json (10 files to create)
| Component | Radix Base | CVA | 'use client' |
|-----------|-----------|-----|--------------|
| sf-label | label | No | Yes |
| sf-select | select | No | Yes |
| sf-checkbox | checkbox | No | Yes |
| sf-radio-group | radio-group | No | Yes |
| sf-switch | switch | No | Yes |
| sf-textarea | textarea | No | No |
| circuit-divider | (none) | No | Implied (GSAP) |
| vhs-overlay | (none) | No | Implied (GSAP) |
| hero-mesh | (none) | No | No |
| scramble-text | (none) | No | No |

### Items MISSING from both registry.json AND public/r/ (7 items to add)
| Component | Layer | Pattern | Radix Base | CVA | Notes |
|-----------|-------|---------|-----------|-----|-------|
| sf-container | frame | B | (none) | Yes | max-w tokens |
| sf-section | frame | B | (none) | No | bgShift now typed string union |
| sf-grid | frame | B | (none) | Yes | responsive cols |
| sf-stack | frame | B | (none) | Yes | flex gaps |
| sf-text | frame | B | (none) | No | semantic typography |
| sf-theme | frame | — | (none) | No | cssVars only, no files |

Note: sf-theme is special — `type: "registry:style"`, no `files` array, only `cssVars` and `meta`.

### meta fields MISSING from all 27 existing registry.json items
Every existing item needs `meta.layer` and `meta.pattern` backfilled.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Embedding component source into public/r JSON | Custom script | `shadcn build` | CLI reads files array, embeds source, resolves deps automatically |
| Validating registry JSON structure | Manual inspection | `$schema` field + CLI validation | Schema URI triggers IDE validation; CLI rejects invalid items at build time |

**Key insight:** The `shadcn build` command reads `registry.json`, resolves each item's `files` array by reading the actual source files, embeds their content into the output JSON, and writes to `public/r/`. Manually hand-authoring `public/r/` files is error-prone because source drift is invisible — once `registry:build` is in scripts, a single command re-syncs everything.

**However:** For this phase, the 10 items already in `registry.json` but missing `public/r/` files can be generated by running `shadcn build` after the meta backfill. The 7 missing items need registry.json entries first. So the correct order is: (1) add missing registry.json entries, (2) add meta to all entries, (3) run `shadcn build` to regenerate all of `public/r/`.

## Common Pitfalls

### Pitfall 1: sf-theme cssVars vs files conflict
**What goes wrong:** Adding a `files` array to sf-theme alongside `cssVars` causes the CLI to attempt to copy a CSS file into the target project, which may fail or collide with the target's globals.css.
**Why it happens:** shadcn treats `cssVars` and `files` as complementary but `registry:style` type items typically use `cssVars` only — no files.
**How to avoid:** Set `type: "registry:style"` on sf-theme and include only `cssVars` and `meta` — zero `files` array.
**Warning signs:** CLI error during `pnpm shadcn add sf-theme` referencing a missing file path.

### Pitfall 2: Layout primitives using wrong type
**What goes wrong:** Setting layout primitives to `type: "registry:component"` instead of `type: "registry:ui"` causes them to appear differently in the CLI UI and may skip `registryDependencies` resolution.
**Why it happens:** Confusion between `registry:component` (block-level, page sections) and `registry:ui` (primitives).
**How to avoid:** All SF components use `type: "registry:ui"` — layout primitives are no exception.

### Pitfall 3: sf-section bgShift type in registry content
**What goes wrong:** If the embedded source in `public/r/sf-section.json` contains the old `boolean` type for bgShift, consumers get a type error on install.
**Why it happens:** Phase 10 fixed the source file; the registry JSON must reflect the updated source.
**How to avoid:** Run `shadcn build` AFTER Phase 10 changes are committed — the build reads the current source file, not a stale copy.

### Pitfall 4: circuit-divider missing gsap dependency
**What goes wrong:** `pnpm shadcn add circuit-divider` installs the component but GSAP is not declared, so the consumer's project fails with a module-not-found error.
**Why it happens:** The registry item for circuit-divider must list `gsap` in its `dependencies` array — this is already in `registry.json` but must survive the build into `public/r/circuit-divider.json`.
**How to avoid:** Verify the built JSON retains the `dependencies` field after `shadcn build`.

### Pitfall 5: shadcn build output overwrites base.json
**What goes wrong:** `shadcn build` regenerates all files in `public/r/` including `base.json` if it's listed in registry.json — but `base.json` uses `registry:style` type and an unusual file path (`styles/sf-tokens.css`).
**Why it happens:** `base.json` is hand-authored and may differ from what `shadcn build` would generate.
**How to avoid:** Check if `base.json` is listed in `registry.json` — it is NOT currently (confirmed by inspection). Keep it separate. Only generate entries listed in `registry.json`.

### Pitfall 6: Counting 29 interactive components
**What goes wrong:** Miscounting the target. The 29 interactive SF components are the 27 currently in `registry.json` plus the 5 layout primitives = actually 34 components + sf-theme = 35 registry items total (not 29+5+1=35 as stated in requirements — the requirements clarify: 29 interactive + 5 layout = 34 components + sf-theme = 35 items).
**Why it happens:** The original "29 interactive" count in the requirements includes all 27 in `registry.json` already plus sf-label, sf-select, sf-checkbox, sf-radio-group, sf-switch, sf-textarea — making the count 27 already registered + 5 layout primitives + sf-theme = 33 items total, not 35. Verify exact count from the sf/ directory.
**How to avoid:** Ground truth is the `components/sf/` directory: 28 .tsx files = 28 SF components. 5 are layout primitives. 23 are interactive. Plus 4 animation components in `components/animation/` that are in the registry = 27 interactive/animation + 5 layout = 32 components + sf-theme = 33 total items.

**Authoritative count (verified):**
- `components/sf/`: 28 .tsx files (23 interactive form/UI + 5 layout)
- `components/animation/` in registry: 4 (circuit-divider, vhs-overlay, hero-mesh, scramble-text)
- **Total components:** 32
- **Plus sf-theme:** 33 registry items total

Requirements say "29 interactive SF components" — this likely counts the 23 sf/ interactive + 4 animation + 2 additional = verify against sf/index.ts barrel exports.

## Code Examples

### registry.json entry for a layout primitive (sf-container)
```json
{
  "name": "sf-container",
  "type": "registry:ui",
  "title": "SF Container",
  "description": "Responsive page container enforcing max-width tokens and responsive gutters. FRAME layer.",
  "dependencies": ["class-variance-authority"],
  "files": [
    {
      "path": "components/sf/sf-container.tsx",
      "type": "registry:ui"
    }
  ],
  "meta": {
    "layer": "frame",
    "pattern": "B"
  }
}
```

### registry.json entry for sf-theme (cssVars, no files)
```json
{
  "name": "sf-theme",
  "type": "registry:style",
  "title": "SF Theme",
  "description": "SignalframeUX token system — OKLCH color palette, zero-radius, motion tokens, SIGNAL runtime vars. Token-only installation, no component files.",
  "dependencies": [],
  "cssVars": {
    "theme": {
      "color-background": "oklch(1 0 0)",
      "color-foreground": "oklch(0.145 0 0)",
      "color-card": "oklch(1 0 0)",
      "color-card-foreground": "oklch(0.145 0 0)",
      "color-primary": "oklch(0.65 0.3 350)",
      "color-primary-foreground": "oklch(0.985 0 0)",
      "color-secondary": "oklch(0.970 0.005 298)",
      "color-secondary-foreground": "oklch(0.205 0 0)",
      "color-muted": "oklch(0.930 0.005 298)",
      "color-muted-foreground": "oklch(0.460 0.010 298)",
      "color-accent": "oklch(0.930 0.005 298)",
      "color-accent-foreground": "oklch(0.205 0 0)",
      "color-destructive": "oklch(0.550 0.180 25)",
      "color-border": "oklch(0.205 0 0)",
      "color-input": "oklch(0.205 0 0)",
      "color-ring": "oklch(0.65 0.3 350)",
      "radius": "0px"
    },
    "light": {
      "signal-intensity": "0.5",
      "signal-speed": "1",
      "signal-accent": "0"
    },
    "dark": {
      "color-background": "oklch(0.145 0 0)",
      "color-foreground": "oklch(0.985 0 0)",
      "color-card": "oklch(0.205 0 0)",
      "color-card-foreground": "oklch(0.985 0 0)",
      "color-border": "oklch(0.400 0 0)",
      "color-input": "oklch(0.400 0 0)"
    }
  },
  "meta": {
    "layer": "frame",
    "pattern": "A"
  }
}
```

### meta backfill pattern (example for existing sf-button entry)
```json
{
  "name": "sf-button",
  "type": "registry:ui",
  "title": "SF Button",
  "description": "...",
  "dependencies": ["class-variance-authority"],
  "registryDependencies": ["button"],
  "files": [...],
  "meta": {
    "layer": "frame",
    "pattern": "B"
  }
}
```

### package.json registry:build script
```json
{
  "scripts": {
    "registry:build": "shadcn build"
  }
}
```

## meta.layer and meta.pattern Classification

### All 32 components + sf-theme

| Name | layer | pattern | Notes |
|------|-------|---------|-------|
| sf-button | frame | B | CVA, Radix Button base |
| sf-card | frame | A | Thin wrap, Radix Card |
| sf-input | frame | A | Thin wrap, Radix Input |
| sf-badge | frame | B | CVA, Radix Badge |
| sf-tabs | frame | A | Thin wrap, Radix Tabs |
| sf-table | frame | A | Thin wrap, Radix Table |
| sf-separator | frame | A | Thin wrap, Radix Separator |
| sf-tooltip | frame | A | Thin wrap, Radix Tooltip |
| sf-dialog | frame | A | Thin wrap, Radix Dialog |
| sf-sheet | frame | A | Thin wrap, Radix Sheet |
| sf-dropdown-menu | frame | A | Thin wrap, Radix DropdownMenu |
| sf-toggle | frame | B | CVA, Radix Toggle |
| sf-slider | frame | A | Thin wrap, Radix Slider |
| sf-command | frame | A | Thin wrap, Radix Command |
| sf-skeleton | frame | A | Thin wrap, Radix Skeleton |
| sf-popover | frame | A | Thin wrap, Radix Popover |
| sf-scroll-area | frame | A | Thin wrap, Radix ScrollArea |
| sf-label | frame | A | Thin wrap, Radix Label |
| sf-select | frame | A | Thin wrap, Radix Select |
| sf-checkbox | frame | A | Thin wrap, Radix Checkbox |
| sf-radio-group | frame | A | Thin wrap, Radix RadioGroup |
| sf-switch | frame | A | Thin wrap, Radix Switch |
| sf-textarea | frame | A | Thin wrap, Radix Textarea |
| circuit-divider | signal | C | GSAP DrawSVG, no Radix |
| vhs-overlay | signal | C | GSAP animation, no Radix |
| hero-mesh | signal | C | Canvas animation, no Radix |
| scramble-text | signal | C | Text animation, no Radix |
| sf-container | frame | B | CVA, no Radix |
| sf-section | frame | B | No CVA, no Radix, data-attrs |
| sf-grid | frame | B | CVA, no Radix |
| sf-stack | frame | B | CVA, no Radix |
| sf-text | frame | B | No CVA, polymorphic element |
| sf-theme | frame | A | cssVars only, no files |

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual `public/r/*.json` authoring | `shadcn build` auto-generates from source | shadcn v2 registry | Future-proof: source is source of truth, no drift |
| No `meta` field on registry items | Freeform `meta` object per registry-item spec | Current schema | Enables layer/pattern metadata for consumers |
| `tailwind.config` cssVars | `cssVars` in registry item + `shadcn add` installs them | shadcn registry system | Token-only installers now possible (sf-theme) |

## Execution Order

The planner should structure tasks in this sequence to avoid rework:

1. **Backfill meta on all 27 existing registry.json items** — no new items, no build needed yet
2. **Add 5 layout primitive entries to registry.json** — files exist, just need registry entries + meta
3. **Add sf-theme entry to registry.json** — cssVars only, no files
4. **Add `registry:build` script to package.json**
5. **Run `pnpm registry:build`** — generates all 33 `public/r/*.json` files from source
6. **Verify `public/r/` has 33+ files** — spot-check sf-section for bgShift string union type, check circuit-divider for gsap dependency

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected (no jest, vitest, pytest config) |
| Config file | none — no Wave 0 gaps for test infra (registry is JSON data, not behavioral logic) |
| Quick run command | `pnpm registry:build` (non-zero exit = failure) |
| Full suite command | `pnpm registry:build && node -e "require('./public/r/sf-theme.json')"` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DX-04a | `public/r/` has 33 JSON files after build | smoke | `ls public/r/ \| wc -l` → expect ≥33 | ❌ Wave 0: add to verification step |
| DX-04b | sf-theme.json is valid JSON with cssVars | smoke | `node -e "const t=require('./public/r/sf-theme.json'); if(!t.cssVars) process.exit(1)"` | ❌ Wave 0 |
| DX-04c | All items have meta.layer field | smoke | `node -e "const r=require('./registry.json'); r.items.forEach(i=>{if(!i.meta?.layer) {console.error(i.name); process.exit(1)}})"` | ❌ Wave 0 |
| DX-04d | shadcn add resolves sf-container | manual | `pnpm dlx shadcn add http://localhost:3000/r/sf-container.json` | manual-only — requires running server |

### Sampling Rate
- **Per task commit:** `pnpm registry:build` (exit code check)
- **Per wave merge:** Full smoke suite above
- **Phase gate:** All smoke tests green + manual spot-check of one `pnpm shadcn add` before `/pde:verify-work`

### Wave 0 Gaps
- [ ] No test framework needed — validation is JSON schema conformance + CLI smoke
- Registry:build script must be added to package.json as part of task execution (not Wave 0)

## Open Questions

1. **Does `shadcn build` overwrite `public/r/base.json`?**
   - What we know: `base.json` is NOT in `registry.json`, so the CLI should not touch it
   - What's unclear: Whether `shadcn build` wipes the entire `public/r/` directory or only writes listed items
   - Recommendation: Back up `base.json` before first `registry:build` run; check CLI behavior; if it wipes, list base.json in registry.json too

2. **Exact "29 interactive" count**
   - What we know: sf/ has 28 .tsx components (23 interactive + 5 layout). 4 animation components are in registry.
   - What's unclear: The phase success criterion says "29 interactive SF components" — this is likely 23 sf/ interactive + 4 animation + sf-label/sf-select/sf-checkbox/sf-radio-group/sf-switch/sf-textarea (6 form already counted in the 23) = the wording may simply mean all non-layout sf/ + animation = 28 - 5 + 4 = 27, or it counts differently
   - Recommendation: Use actual file inventory as ground truth (32 components + sf-theme = 33 items); don't try to match the "29" count literally

3. **sf-theme cssVars scope**
   - What we know: shadcn's cssVars.theme maps to @theme block, cssVars.light maps to :root, cssVars.dark maps to .dark
   - What's unclear: Whether Tailwind v4's `@theme` block syntax is compatible with how shadcn CLI writes cssVars.theme — shadcn generates standard CSS custom properties, but Tailwind v4 @theme uses a different syntax
   - Recommendation: sf-theme cssVars should only include the core color tokens (which work as standard CSS custom props regardless) and not attempt to replicate @theme-specific syntax. The installed CSS will use `:root` syntax even for "theme" section vars. This is fine for a token bootstrap.

## Sources

### Primary (HIGH confidence)
- `https://ui.shadcn.com/schema/registry-item.json` — live schema confirming cssVars, meta, valid types
- `https://ui.shadcn.com/docs/registry/registry-item-json` — cssVars structure (theme/light/dark), meta as freeform object
- `https://ui.shadcn.com/docs/registry/getting-started` — `shadcn build` command, auto-generation of public/r/ files
- Direct inspection of `registry.json`, `public/r/`, `components/sf/` — gap inventory

### Secondary (MEDIUM confidence)
- Existing `public/r/sf-button.json` — confirmed per-item JSON structure with embedded content field
- Existing `public/r/base.json` — confirmed registry:style type pattern

### Tertiary (LOW confidence)
- Tailwind v4 + shadcn cssVars.theme compatibility — not explicitly verified; flagged as Open Question 3

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — schema verified from live source; CLI command confirmed
- Gap inventory: HIGH — verified from direct file system inspection
- Architecture: HIGH — confirmed from existing working registry items
- cssVars structure: HIGH — confirmed from official docs
- meta field: HIGH — confirmed from official schema
- Tailwind v4 @theme compat with cssVars.theme: LOW — flagged as open question

**Research date:** 2026-04-06
**Valid until:** 2026-05-06 (shadcn registry schema is stable; watch for v2 spec changes)
