# Phase 10: Foundation Fixes - Research

**Researched:** 2026-04-06
**Domain:** CSS custom properties, TypeScript type narrowing, Next.js App Router layout
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
None — all implementation choices are at Claude's discretion.

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase.

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FND-01 | `--signal-intensity`, `--signal-speed`, and `--signal-accent` CSS custom properties have sensible defaults declared in globals.css | CSS var anatomy confirmed; exact default values derived from SignalOverlay DEFAULTS constant and handleReset() |
| FND-02 | SFSection `bgShift` prop type changed from `boolean` to `"white" \| "black"` with all call sites updated | Type change confirmed safe — zero active call sites use `bgShift=` prop; all usage passes `data-bg-shift` as spread |
| INT-01 | Reference page has correct `mt-[var(--nav-height)]` spacing and NEXT_CARDS grid is wrapped in SFSection | Exact files and lines identified; reference page is `app/reference/page.tsx`, NEXT_CARDS is in `app/start/page.tsx` |
</phase_requirements>

---

## Summary

Phase 10 is a pure infrastructure cleanup with three mechanical fixes. All three are fully mapped to specific lines in existing files — no exploratory work required. The fixes are independent of each other and carry zero risk of behavioral regression when applied correctly.

**FND-01** adds three missing CSS custom property defaults to `globals.css`. Without them, `color-resolve.ts` reads uninitialized CSS vars, which return empty strings that OKLCH parsing falls back to magenta (`oklch(0.65 0.3 350)` or the color-resolve fallback). The correct defaults are derived directly from SignalOverlay's DEFAULTS constant and `handleReset()`: `--signal-intensity: 0.5`, `--signal-speed: 1`, `--signal-accent: 0`.

**FND-02** changes `bgShift?: boolean` to `bgShift?: "white" | "black"` in `sf-section.tsx` and updates the `data-bg-shift` attribute render from a presence-only boolean to a value-pass-through. Crucially, a full grep confirms zero current call sites use the `bgShift=` prop — all existing usage passes `data-bg-shift` as a spread HTML attribute. The fix is a type-only change with one behavioral update: the rendered attribute changes from `data-bg-shift=""` (empty) to `data-bg-shift="white"` or `data-bg-shift="black"` (explicit values). The GSAP scroll animation in `page-animations.tsx` already reads the attribute value via `getAttribute("data-bg-shift")` — this is the fix that makes the typed prop actually work with GSAP.

**INT-01** has two sub-tasks: (1) `app/reference/page.tsx` `<main>` is missing `mt-[var(--nav-height)]` (confirmed by code reading — line 17 has no margin class), and (2) the NEXT_CARDS grid in `app/start/page.tsx` (line 305) is a raw `<div>` that should be wrapped in SFSection for semantic consistency.

**Primary recommendation:** Execute all three fixes sequentially in one commit per fix, running `pnpm tsc --noEmit` between each to catch regressions. No new libraries, no API changes, no behavioral changes beyond the nav-height margin and the bgShift attribute value passthrough.

---

## Standard Stack

### Core (already installed — no new installs required)
| Tool | Version | Purpose | Note |
|------|---------|---------|------|
| TypeScript | 5.8 | Type checking | `pnpm tsc --noEmit` is the primary validation command |
| Next.js | 15.3 | App Router pages | `app/reference/page.tsx`, `app/start/page.tsx` |
| Tailwind CSS v4 | 4.x | Utility classes | `mt-[var(--nav-height)]` already works via CSS var syntax |

**Installation:** No new packages required. This is a zero-dependency phase.

---

## Architecture Patterns

### Pattern 1: CSS Custom Property Defaults in globals.css

**What:** Add defaults to the existing `:root` block that already contains all other system tokens. The `--signal-*` vars belong alongside `--sf-grain-opacity`, `--sf-vhs-crt-opacity`, and other SIGNAL-layer runtime tokens in the "SignalframeUX Extension Variables" `:root` block (lines 103–195 of globals.css).

**Where to insert:** After the `--sf-vhs-noise-opacity` block (line 150), before the spacing tokens section, as a new SIGNAL runtime defaults group.

```css
/* ── SIGNAL Runtime Defaults ── */
/* Read by color-resolve.ts and WebGL uniforms. SignalOverlay overrides these
   at runtime via document.documentElement.style.setProperty(). */
--signal-intensity: 0.5;   /* 0.0–1.0 — maps to SignalOverlay default (50/100) */
--signal-speed: 1;         /* 0.0–2.0 — maps to SignalOverlay default (50/50) */
--signal-accent: 0;        /* 0–360 hue degrees — maps to SignalOverlay default */
```

**Why these values:** SignalOverlay's `DEFAULTS` constant (lines 34–38 of signal-overlay.tsx) and `handleReset()` (lines 152–159) both set these exact values: intensity=0.5 (50/100), speed=1 (50/50), accent=0.

**Confidence:** HIGH — values read directly from source code.

### Pattern 2: SFSection bgShift Type Narrowing

**What:** Change the TypeScript interface and the JSX attribute render in `sf-section.tsx`.

**Current state (sf-section.tsx lines 6 and 38):**
```typescript
// Interface:
bgShift?: boolean;

// Render:
data-bg-shift={bgShift ? "" : undefined}
```

**Target state:**
```typescript
// Interface:
bgShift?: "white" | "black";

// Render:
data-bg-shift={bgShift}
```

**Why this is safe:** `applyBgShift()` in `page-animations.tsx` (lines 386–403) already reads `getAttribute("data-bg-shift")` as a string and uses it as a palette key: `palette[target]`. Passing `"white"` or `"black"` directly is exactly what the function expects. The old boolean produced `""` (empty string) which hits the `|| palette.white` fallback — a different (and incorrect) code path.

**Call site audit result:** Zero call sites use `bgShift=` prop. All `data-bg-shift` usage across all 5 pages passes it as a raw spread HTML attribute. No call sites need updating. The type change will not produce any TypeScript errors in consumer files.

**JSDoc update required:** The existing JSDoc example on line 24 shows `bgShift` as a boolean presence prop. Update to show `bgShift="white"`.

### Pattern 3: Next.js App Router Nav Clearance

**What:** `<main>` in Server Components needs `mt-[var(--nav-height)]` or `className` containing it to clear the fixed nav bar. `--nav-height: 83px` is already declared in globals.css (line 171).

**Affected file:** `app/reference/page.tsx` line 17.

```tsx
// Before:
<main id="main-content" data-cursor>

// After:
<main id="main-content" data-cursor className="mt-[var(--nav-height)]">
```

**Comparison:** `app/start/page.tsx` already has this correctly on line 188: `className="mt-[var(--nav-height)]"`. The reference page missed it.

### Pattern 4: NEXT_CARDS Wrapped in SFSection

**What:** `app/start/page.tsx` line 305 has the NEXT_CARDS grid as a bare `<div>`. Wrap it in `SFSection` to maintain semantic consistency (all major content sections use SFSection).

**Current:**
```tsx
<div data-anim="stagger" className="grid grid-cols-1 sm:grid-cols-3 border-b-[3px] border-foreground">
```

**Target:**
```tsx
<SFSection label="NEXT STEPS" className="py-0">
  <div data-anim="stagger" className="grid grid-cols-1 sm:grid-cols-3 border-b-[3px] border-foreground">
    {/* ... cards ... */}
  </div>
</SFSection>
```

**Important:** SFSection renders a `<section>` with `py-16` default padding. Override with `className="py-0"` to preserve the existing visual spacing (the inner cards have their own `py-10`). The border-b on the inner div remains unchanged.

### Anti-Patterns to Avoid

- **Don't add signal vars to `@theme` block:** `@theme` is for Tailwind color/radius/font tokens. Runtime-settable CSS vars that JavaScript writes via `setProperty` belong in the `:root {}` block. If added to `@theme`, Tailwind may process them differently.
- **Don't add `bgShift?: boolean | "white" | "black"` union:** The boolean mode is dead — it produced an empty string that GSAP couldn't use. Use the string union only.
- **Don't add `mt-[var(--nav-height)]` to SFSection's spacing prop:** The nav clearance is page-level, not section-level. It belongs on `<main>`, not on the first SFSection.
- **Don't use `@ts-ignore` for the bgShift fix:** The type change must be clean. If TypeScript errors appear, fix them. Do not suppress.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Signal var validation | Custom CSS var validator | Just add defaults to `:root` | CSS cascade handles fallback automatically |
| Nav height measurement | Dynamic JS measurement | `--nav-height: 83px` CSS var already declared | Value is stable, declared in globals.css line 171 |
| bgShift type guard | Runtime type checking | TypeScript compile-time union | This is a type bug, not a runtime bug |

---

## Common Pitfalls

### Pitfall 1: Mistaking "no call sites with bgShift=" for "no work needed"
**What goes wrong:** The grep shows zero `bgShift=` prop usage, so it might seem like the type fix has no effect. It does have an effect: it changes the rendered `data-bg-shift` attribute from `""` (empty, which GSAP reads as a null-like key) to `"white"` or `"black"` (which GSAP resolves to actual palette colors). The real point of the fix is to make the prop usable so future callers get type safety AND correct runtime behavior.
**How to avoid:** Fix the type AND the render expression together. Do not fix one without the other.

### Pitfall 2: bgShift attribute on SFSection renders empty string currently
**What goes wrong:** `data-bg-shift={bgShift ? "" : undefined}` — when someone passes `bgShift` as a boolean true, the attribute value is `""`. `applyBgShift("")` runs `palette[""] || palette.white` which resolves to white. Background shift "works" visually but is fragile. Passing `bgShift="white"` after the fix will correctly set `data-bg-shift="white"` and resolve the intended color.
**Warning sign:** Any GSAP bg-shift section using the typed prop before this fix renders as "white" regardless of the value passed.

### Pitfall 3: Signal defaults accidentally in @theme block
**What goes wrong:** Adding `--signal-intensity` inside `@theme {}` makes it a Tailwind design token. Tailwind v4's `@theme` processes values and may not forward them as plain CSS vars accessible to JavaScript's `getComputedStyle`.
**How to avoid:** Add to the `:root {}` block in the "SignalframeUX Extension Variables" section, not inside `@theme`.

### Pitfall 4: SFSection default spacing on NEXT_CARDS wrapper
**What goes wrong:** Wrapping NEXT_CARDS in `<SFSection>` without `className="py-0"` adds `py-16` (64px top + 64px bottom) to the section because that's SFSection's default spacing. The inner cards have their own `py-10`.
**How to avoid:** Always use `className="py-0"` on SFSection instances that rely on their children for spacing.

### Pitfall 5: reference/page.tsx vs start/page.tsx confusion
**What goes wrong:** INT-01 mentions "the reference page" — this is `app/reference/page.tsx` (the API Reference page), not `app/start/page.tsx` (the Get Started page). The NEXT_CARDS issue is in `app/start/page.tsx`. Both files need changes for INT-01 but for different reasons.
**How to avoid:** Fix both files. `app/reference/page.tsx` needs `mt-[var(--nav-height)]` on `<main>`. `app/start/page.tsx` needs NEXT_CARDS wrapped in SFSection.

---

## Code Examples

### FND-01: Signal CSS Defaults (globals.css addition)
```css
/* Source: derived from signal-overlay.tsx DEFAULTS constant + handleReset() */

/* ── SIGNAL Runtime Defaults ── */
--signal-intensity: 0.5;   /* 0.0–1.0  — default: 0.5 (slider at 50/100) */
--signal-speed: 1;         /* 0.0–2.0  — default: 1.0 (slider at 50/50) */
--signal-accent: 0;        /* 0–360deg — default: 0 hue shift (no rotation) */
```

### FND-02: SFSection Type Fix (sf-section.tsx)
```typescript
// Source: components/sf/sf-section.tsx

// Change interface:
interface SFSectionProps extends React.ComponentProps<"section"> {
  label?: string;
  bgShift?: "white" | "black";   // was: boolean
  spacing?: "8" | "12" | "16" | "24";
}

// Change render expression:
data-bg-shift={bgShift}   // was: bgShift ? "" : undefined

// Update JSDoc @param and @example:
// @param bgShift - Background shift value for GSAP scroll targeting. "white" or "black".
// @example
// <SFSection label="Work" spacing="24" bgShift="black">
```

### INT-01a: Reference page nav clearance (app/reference/page.tsx)
```tsx
// Source: app/start/page.tsx line 188 (correct pattern to copy)

// Before (app/reference/page.tsx line 17):
<main id="main-content" data-cursor>

// After:
<main id="main-content" data-cursor className="mt-[var(--nav-height)]">
```

### INT-01b: NEXT_CARDS wrapped in SFSection (app/start/page.tsx)
```tsx
// Source: pattern from all other sections in the same file

// Before (line 305):
<div data-anim="stagger" className="grid grid-cols-1 sm:grid-cols-3 border-b-[3px] border-foreground">

// After:
<SFSection label="NEXT STEPS" className="py-0">
  <div data-anim="stagger" className="grid grid-cols-1 sm:grid-cols-3 border-b-[3px] border-foreground">
    {/* existing card content unchanged */}
  </div>
</SFSection>
```

---

## State of the Art

| Old Pattern | Current Pattern | Impact |
|-------------|-----------------|--------|
| `bgShift?: boolean` presence toggle | `bgShift?: "white" \| "black"` typed value | GSAP receives explicit palette key instead of empty string |
| No `--signal-*` CSS defaults | Defaults in `:root` | Eliminates magenta flash on first frame before SignalOverlay mounts |
| Raw `<div>` for NEXT_CARDS | `<SFSection>` wrapper | Semantic consistency; enables GSAP and data-section targeting |

**Already correct and unchanged:**
- `app/page.tsx`: All SFSection usage passes `data-bg-shift` as spread — no changes needed.
- `app/components/page.tsx`, `app/tokens/page.tsx`: No bgShift usage — no changes needed.
- `--nav-height: 83px`: Already declared in globals.css line 171 — no changes needed.
- `applyBgShift()` logic: Already handles `"white"` and `"black"` string keys correctly.

---

## Open Questions

None. All three requirements are fully mapped to specific files and lines. No ambiguity remains.

---

## Validation Architecture

### Test Framework

No project-level test framework is installed. Validation is TypeScript-compiler-based.

| Property | Value |
|----------|-------|
| Framework | TypeScript compiler (tsc) |
| Config file | `tsconfig.json` (project root) |
| Quick run command | `pnpm tsc --noEmit` |
| Full suite command | `pnpm tsc --noEmit` (same — no test runner) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FND-01 | `--signal-*` vars have defaults in globals.css | manual | `grep "signal-intensity\|signal-speed\|signal-accent" app/globals.css` | ✅ (checking existing file) |
| FND-02 | `bgShift` prop is typed `"white" \| "black"`, `tsc --noEmit` clean | compile | `pnpm tsc --noEmit` | ✅ |
| INT-01 | reference/page.tsx has nav clearance; NEXT_CARDS in SFSection | manual | Visual inspection + `grep "mt-\[var(--nav-height)\]" app/reference/page.tsx` | ✅ |

### Sampling Rate

- **Per task commit:** `pnpm tsc --noEmit`
- **Per wave merge:** `pnpm tsc --noEmit` + `pnpm build` (full build to catch any module errors)
- **Phase gate:** `pnpm build` green + visual render check on `/reference` and `/start` pages

### Wave 0 Gaps

None — existing TypeScript infrastructure covers all phase requirements. No test files need to be created.

---

## Sources

### Primary (HIGH confidence)
- `components/sf/sf-section.tsx` — confirmed `bgShift?: boolean` at line 6, `data-bg-shift={bgShift ? "" : undefined}` at line 38
- `components/animation/signal-overlay.tsx` — confirmed DEFAULTS constant (lines 34–38), handleReset() values (lines 156–159)
- `app/globals.css` — confirmed no `--signal-*` vars exist anywhere in the file; `:root` block spans lines 98–195
- `components/layout/page-animations.tsx` — confirmed `getAttribute("data-bg-shift")` at line 343, `applyBgShift(target)` reads string value from DOM
- `app/reference/page.tsx` — confirmed `<main>` at line 17 has no `mt-[var(--nav-height)]`
- `app/start/page.tsx` — confirmed NEXT_CARDS grid is a bare `<div>` at line 305, not wrapped in SFSection
- `app/page.tsx` + grep — confirmed zero `bgShift=` prop usage across all 5 app pages; all use `data-bg-shift` spread

### Secondary (MEDIUM confidence)
- `.planning/STATE.md` — bgShift fix rule "fix all consumer call sites in same commit, never @ts-ignore, run tsc --noEmit before and after"
- `.planning/research/ARCHITECTURE.md` — confirmed fix approach: change type + render expression together

### Tertiary (LOW confidence)
None.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies, all tools are pre-installed
- Architecture: HIGH — all changes derived from direct code reading, zero inference required
- Pitfalls: HIGH — all pitfalls derived from reading existing source and planning docs, not speculation

**Research date:** 2026-04-06
**Valid until:** Indefinite — this codebase is stable; these are mechanical point fixes

---

## File Map (Executor Reference)

All files that need changes in this phase:

| File | Change | Requirement |
|------|--------|-------------|
| `app/globals.css` | Add `--signal-intensity: 0.5`, `--signal-speed: 1`, `--signal-accent: 0` to `:root` block | FND-01 |
| `components/sf/sf-section.tsx` | Change `bgShift?: boolean` → `bgShift?: "white" \| "black"`, change render expression, update JSDoc | FND-02 |
| `app/reference/page.tsx` | Add `className="mt-[var(--nav-height)]"` to `<main>` | INT-01 |
| `app/start/page.tsx` | Wrap NEXT_CARDS `<div>` in `<SFSection label="NEXT STEPS" className="py-0">` | INT-01 |

No other files require changes.
