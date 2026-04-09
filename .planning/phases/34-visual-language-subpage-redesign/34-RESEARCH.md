# Phase 34: Visual Language + Subpage Redesign — Research

**Researched:** 2026-04-08
**Domain:** Visual language finishing pass + three subpage redesigns (no new deps, existing stack)
**Confidence:** HIGH

## Summary

Phase 34 is a **restyle + redeploy phase**, not a new-capability phase. Zero new dependencies. Zero new runtime libraries. The stack (Next.js 15.3 App Router, Tailwind v4, GSAP 3.14.2 + ScrollTrigger, Lenis, shadcn/Radix via SF wrappers, Anton/JetBrains Mono) is unchanged. All Phase 34 work is:

1. One file replacement in place — `components/layout/section-indicator.tsx` (dot rail → HUD coded readout) preserving its filename and the DOM contract `[data-section]` / `[data-section-label]` that already drives it.
2. One new hook file — `hooks/use-nav-reveal.ts` — extracted verbatim from the Phase 30 logic in `components/layout/nav.tsx` (lines 73–108), generalized to accept a trigger element instead of hardcoding `[data-entry-section]`.
3. Deployment of an already-built component — `GhostLabel` exists at `components/animation/ghost-label.tsx`, zero callers, ready to drop in.
4. Render-body surgery inside two large client components — `TokenTabs` (630 LOC, preserve data layer) and `APIExplorer` (807 LOC, preserve data/search/highlight wiring, replace the 3-panel render with a dense schematic index).
5. JSX reframing of `app/init/page.tsx` preserving the existing `STEPS` array.
6. A magenta-accent audit across 12 files (74 occurrences in `components/blocks/` + 29 in `app/`) to lock ≤5 sanctioned moments per page.

**Primary recommendation:** Ship Plan 34-01 first (HUD indicator + `useNavReveal` + ghost label deployment + magenta audit + h1 bumps) — every other plan consumes at least one of its outputs. Then run 34-02, 34-03, 34-04 in parallel or any order. All four plans share a Playwright-driven verification harness matching the existing `tests/phase-NN-*.spec.ts` pattern (source-level `fs.readFileSync` grep + browser DOM assertions, no visual regression infra).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**VL-06 — Section Indicator: REPLACE, not patch.**
- File: `components/layout/section-indicator.tsx` — replace contents, keep filename so all imports work
- Format: `[01//ENTRY]`, `[02//THESIS]`, `[03//PROOF]`, `[04//INVENTORY]`, `[05//SIGNAL]`, `[06//ACQUISITION]`
- Position: vertical right edge, preserve current viewport anchor
- Active state: background fill `foreground/10–15` (NOT magenta — magenta budget reserved)
- Inactive: muted-foreground at `var(--text-2xs)` (9px) monospace
- Hover: full foreground, no scale animation (DU hard-cut register)
- Discovery: same `[data-section]` / `[data-section-label]` IntersectionObserver pattern
- Hidden on mobile (preserve `hidden md:flex`)
- ARIA: keep `role="navigation"`, `aria-current`, `aria-label`
- Numbering: 0-indexed DOM order → 01-padded display; labels from `data-section-label`, not hardcoded

**VL-01 — Ghost label deployment.**
- `GhostLabel` already exists at `components/animation/ghost-label.tsx` — Phase 34 DEPLOYS, does NOT recreate
- Minimum 5 deployment locations: `/system` header, `/init` header, `/reference` header, homepage THESIS background, homepage INVENTORY background
- Must be **structural** (negative-margin column-edge positioning, bleeding off viewport edge), NOT centered wallpaper
- Opacity 3–5% max, form still readable
- Test: "Could you remove this and lose layout structure?" Must be yes.
- Already ships with `pointer-events: none`, `aria-hidden`, `select-none`

**VL-02 — Display type audit (≥3 locations at 120px+).**
- Sanctioned 120px+ moments (target ≥5, requirement ≥3): Homepage ENTRY (verify), Homepage THESIS (bump 1+ statement), `/system` h1 bump to `clamp(80px, 12vw, 160px)`, `/init` h1 `clamp(80px, 12vw, 160px)`, `/reference` h1 NEW at `clamp(80px, 12vw, 160px)`, `/inventory` h1 (verify already meets)
- `/inventory` h1 string update: `COMPONENTS` → `INVENTORY` (split `INVE`/`NTORY` to preserve line-break aesthetic), `340` → `54`. String-only, not a Phase 33 redo.

**VL-04 — Negative space (≥40% void in THESIS + SIGNAL).**
- Verification pass only — 1440×900 screenshot, 10% grid overlay, count empty cells
- Rework only if measurement fails
- Do not redo Phase 31/32 on aesthetic instinct

**VL-05 — Magenta ≤5 moments per page.**
- Audit: grep `text-primary|bg-primary|border-primary|var(--color-primary)` per page
- Identify 5 "sanctioned" load-bearing moments per page
- Replace lower-impact uses with `secondary`, `muted-foreground`, `foreground/60`
- Document the 5 in 34-01-PLAN.md
- DO NOT modify `--color-primary` token value
- DO NOT introduce new accent colors
- DO NOT add new components, tokens, or animation effects

**SP-05 — Shared nav-reveal hook.**
- New file: `hooks/use-nav-reveal.ts` (the ONLY sanctioned new hook)
- Accepts trigger element ref, flips `sf-nav-visible` / `sf-nav-hidden` body/nav class via GSAP ScrollTrigger
- Homepage uses it with `[data-entry-section]` as trigger
- Subpages use it with their page `<header>` as trigger
- Reduced-motion path: visible immediately, no ScrollTrigger
- Nav component stays dumb — centralizes behavior in hook so 34-02/03/04 don't each reimplement

**SP-01/02 — /system: differentiated specimen-per-token.**
- Preserve `components/blocks/token-tabs.tsx` (630 LOC) data layer, copy-to-clipboard wiring, tab structure
- Replace each tab's render body with new specimen sub-component
- New files: `components/blocks/token-specimens/{spacing,type,color,motion}-specimen.tsx`
- Treatments: Spacing = ruler/grid; Typography = specimen sheet (Brody/Fuse); Color = OKLCH swatch matrix with L/C/H axes; Motion = SVG curve plots
- NO card layout. NO tables for spacing/type/color. The specimens ARE the design.
- Specimens are Server Components if no interactive state needed
- TokenTabs stays client (session state, tab switching) — a thin orchestrator

**SP-03 — /init: boot-sequence walkthrough.**
- Preserve `STEPS` data structure in `app/init/page.tsx` (5 steps: INSTALL → INITIALIZE → USE_COMPONENTS → ACTIVATE_FRAME → DEPLOY)
- Add coded indicators: `[01//INIT]`, `[02//HANDSHAKE]`, `[03//LINK]`, `[04//TRANSMIT]`, `[05//DEPLOY]`
- Single column dense monospaced sequence — NO cards, NO rounded surfaces, NO "Get Started" button at bottom
- Vertical rule between steps (1px foreground/15)
- Step number at display size 80px+ left of each step
- Description in monospaced uppercase, tracking-tight
- Shared-code-block component retained
- Bottom terminal line: `[OK] SYSTEM READY` or `[EXIT 0]` — NOT a "next steps" CTA
- Test: "Bringup sequence or onboarding flow?" Must be bringup sequence.

**SP-04 — /reference: schematic API index.**
- Preserve `components/blocks/api-explorer.tsx` (807 LOC) data structures, `API_DOCS` from `lib/api-docs.ts`, pre-computed syntax highlighting, keyboard navigation, ARIA
- Add page header with h1 `API REFERENCE` at `clamp(80px, 12vw, 160px)` and right-aligned stat callout
- Restyle as grouped index: **COMPONENTS** / **HOOKS** / **TOKENS** sections
- Entry row: monospaced type signature (`SFButton(props: SFButtonProps): ReactNode`)
- Click to expand body as column-aligned monospace data sheet, NOT cards
- Search/filter input at top stays
- Zero rounded surfaces
- Foreground + muted-foreground only; magenta reserved for active row/expanded state

**Plan structure — 4 plans, 34-01 ships first.**

| Plan | Scope | Requirements |
|------|-------|--------------|
| 34-01 | Visual language pass: HUD indicator, GhostLabel deployment, display type bumps, magenta audit, `useNavReveal` hook, negative-space verification, `/inventory` h1 string fix | VL-01, VL-02, VL-04, VL-05, VL-06 |
| 34-02 | `/system` 4 specimen sub-components replacing TokenTabs render bodies; consume `useNavReveal` | SP-01, SP-02, SP-05 (partial) |
| 34-03 | `/init` boot-sequence reframe preserving STEPS; consume `useNavReveal` | SP-03, SP-05 (partial) |
| 34-04 | `/reference` schematic APIExplorer restyle + new page header; consume `useNavReveal` | SP-04, SP-05 (partial) |

### Claude's Discretion

- Specimen sub-component internal rendering details (as long as they match the Brody/Fuse, Ikeda, architectural specimen register)
- Specific `[NN//CODE]` choices for `/init` steps beyond the locked mapping
- Whether specimens are Server or Client Components (prefer Server when possible)
- Exact pixel values within the locked clamp ranges
- Per-page sanctioned magenta moments — Claude selects the load-bearing 5 per page

### Deferred Ideas (OUT OF SCOPE)

- JFM multilingual flourishes (Katakana/Farsi/Mandarin) — confirm with grey before adding
- `useNavReveal` reduced-motion edge cases with Lenis scroll restoration — investigate during 34-01, may spawn follow-up
- `/inventory` deeper redesign — only h1 string change is sanctioned
- Custom font loading audit on subpage h1 bumps (CLS risk) — Phase 35
- Specimen interactivity (hover-to-copy, click-to-see-usage) — v1.6+
- APIExplorer search improvements (fuzzy ranking) — future work
- Section indicator mobile condensed variant — not Phase 34
- Light mode subpage audit — Phase 35
- Adding new components, tokens, or animation effects (CLAUDE.md hard constraint)
- Modifying `--color-primary` token value
- Redesigning homepage sections beyond the visual language overlay
- Lighthouse / bundle measurements (Phase 35)

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| VL-01 | Ghost labels scaled to 200px+, architectural elements not background decoration | `GhostLabel` ships at `clamp(200px, 25vw, 400px)` already (`components/animation/ghost-label.tsx:18`). Zero callers found. Research confirms component is deploy-ready; architectural placement requires negative-margin grid positioning, not `inset-0` centering. See "Ghost Label Deployment Pattern" below. |
| VL-02 | Display type moments at 120px+ in ≥3 locations | Current display usages in codebase audited. `/system` h1 currently `clamp(60px, 9vw, 100px)` (line 27 of `app/system/page.tsx`), `/reference` h1 currently `clamp(60px, 9vw, 100px)` (line 472 of `api-explorer.tsx`), `/init` h1 currently `clamp(48px, 11vw, 120px)`. Research confirms all three need the bump; new clamp target `clamp(80px, 12vw, 160px)` is safe since Anton is already preloaded via `var(--font-display)`. |
| VL-04 | ≥40% intentional void in THESIS + SIGNAL | Verification-only work. Research confirms Phase 31/32 code was designed to meet this; visual measurement method documented in "Validation Architecture" below. No code-level research gap. |
| VL-05 | Magenta ≤5 moments per page | Measured baseline: homepage-level `app/page.tsx` has 0 direct uses (inherits from blocks); `app/init/page.tsx` has 13 direct uses; `components/blocks/api-explorer.tsx` has 15 uses; `components/blocks/token-tabs.tsx` has 11 uses. Research produced a per-file occurrence map (see "Magenta Usage Baseline" below) so the audit is grounded, not estimated. |
| VL-06 | Section indicator redesigned as HUD readout | Current file at `components/layout/section-indicator.tsx` (139 LOC) uses `[data-section]` + `[data-section-label]` discovery via IntersectionObserver, `role="navigation"`, `aria-current`, `hidden md:flex`. **All of these contracts survive the replacement** because the new HUD reads the same attributes. Single consumer: `app/page.tsx` line 91. See "Section Indicator Replacement" below. |
| SP-01 | `/system` token groups as specimen-style visual diagrams | `TokenTabs` data structures catalogued (COLOR_SCALES, SPACING, TYPE_SCALE, MOTION_TOKENS, ELEVATION_TOKENS, RADIUS_TOKENS, BREAKPOINT_TOKENS). SFTabs wiring is client-state only — the data arrays can be handed to Server Component specimens. See "TokenTabs Current Shape" below. |
| SP-02 | Spacing, type, color, motion each get designed visual sections | Research identified the 4 existing tab render bodies at approximate line ranges (COLOR: ~200–365, SPACING: ~367–399, TYPOGRAPHY: ~401–448, MOTION: ~450–487). Replacement surgery is scoped per tab — each specimen sub-component replaces one `<SFTabsContent>` body. |
| SP-03 | `/init` reframed as system initialization sequence | `STEPS` array at `app/init/page.tsx:15–124` has 5 entries with `{number, title, description, code, note, highlight}` shape. `CodeBlock` local component consumes `CodeLine` union type. Data preserved verbatim; only the surrounding JSX reframes register. Bottom "NEXT STEPS" + "COMMUNITY BAND" blocks (`NEXT_CARDS`, `CHECKLIST` arrays) are the CTA energy that must go. |
| SP-04 | `/reference` styled as technical schematics | `APIExplorer` 807 LOC client component with `NAV_SECTIONS` (5 groups), `BUTTON_PROPS`, `DataDrivenDoc` sub-component reading from `API_DOCS` (`lib/api-docs.ts`, `ComponentDoc` type), scroll progress bar, HUD telemetry, magnetic cursor, scramble-text, split-text, typewriter — **all the GSAP effects must be evaluated** before replacement; some (scramble on hover, magnetic, HUD telemetry) are decorative and can stay, others (3-column grid layout, sidebar/preview panels) are the schematic restyle target. |
| SP-05 | Subpages share nav-reveal pattern | Existing implementation at `components/layout/nav.tsx:73–108` is a 35-line `useEffect` hook with reduced-motion branch, `[data-entry-section]` detector, ScrollTrigger create/kill. Cleanly extractable. See "Nav Reveal Extraction" below. |

</phase_requirements>

## Standard Stack

### Core (already in project, no installs)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15.3 (App Router) | Framework | Existing — pages are RSC by default |
| React | 19 | Rendering | Existing — Server Components for static specimens |
| TypeScript | 5.8 | Type safety | Existing — all Phase 34 files must type-check |
| Tailwind CSS | v4 | Styling | Existing — `@theme` in `globals.css` is token source of truth |
| GSAP + ScrollTrigger | 3.14.2 | Scroll-linked reveal | Existing — already imported via `@/lib/gsap-core` |
| Lenis | 1.3.x | Smooth scroll | Existing — `useNavReveal` must not fight Lenis |
| Radix via shadcn | — | Accessibility primitives | Existing — SFTabs is a Radix wrapper |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Playwright | 1.x | Verification | Existing — all phase tests use `tests/phase-NN-*.spec.ts` pattern |
| CVA | — | Variant composition | Existing — not needed for Phase 34, no new SF wrappers |

### Alternatives Considered
| Instead of | Could Use | Why not |
|------------|-----------|---------|
| Extract hook to `hooks/use-nav-reveal.ts` | Pass prop to `<Nav trigger={...}>` | **Rejected by CONTEXT.md** — keeps Nav dumb, avoids coupling to trigger selection logic, centralizes reduced-motion branch |
| New `<SFHUDIndicator>` wrapper | Replace `SectionIndicator` in place | **Rejected by CONTEXT.md** — preserves filename/imports; Phase 34 is "restyle + redeploy", not "add new components" |
| Separate `<TokenSpecimenTabs>` wrapper | Modify TokenTabs render bodies in place | Kept TokenTabs orchestrator because it owns `useSessionState(SESSION_KEYS.TOKENS_TAB)` — moving this would split state management across two files |

**Installation:** None. Zero new npm packages.

## Architecture Patterns

### Recommended File Structure (Phase 34 deltas only)

```
components/
├── layout/
│   └── section-indicator.tsx          # REPLACE contents, keep filename
├── animation/
│   └── ghost-label.tsx                # EXISTING, deploy to 5 locations (no changes)
└── blocks/
    ├── token-tabs.tsx                 # MODIFY: keep data, replace render bodies
    ├── api-explorer.tsx               # MODIFY: restyle render layer
    └── token-specimens/               # NEW directory
        ├── spacing-specimen.tsx       # NEW (Server Component)
        ├── type-specimen.tsx          # NEW (Server Component)
        ├── color-specimen.tsx         # NEW (Server Component)
        └── motion-specimen.tsx        # NEW (Server Component with SVG curves)
hooks/
└── use-nav-reveal.ts                  # NEW — the only sanctioned new hook
app/
├── page.tsx                           # MODIFY: add GhostLabel to THESIS/INVENTORY sections
├── system/page.tsx                    # MODIFY: bump h1, add GhostLabel, consume useNavReveal
├── init/page.tsx                      # MODIFY: reframe JSX around STEPS (preserve data)
├── reference/page.tsx                 # MODIFY: add page header above APIExplorer
└── inventory/page.tsx                 # MODIFY: h1 string "COMPONENTS"→"INVENTORY", 340→54
```

### Pattern 1: Nav Reveal Extraction (SP-05)

**What:** Extract the homepage-only ScrollTrigger nav-reveal from `components/layout/nav.tsx:73–108` into `hooks/use-nav-reveal.ts`, generalized to accept a trigger element ref.

**Existing code (verified, lines 73–108 of `components/layout/nav.tsx`):**
```typescript
useEffect(() => {
  const nav = navRef.current;
  if (!nav) return;

  // Reduced-motion: nav visible from page load, no ScrollTrigger
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    nav.classList.remove("sf-nav-hidden");
    nav.classList.add("sf-nav-visible");
    return;
  }

  // Check if ENTRY section exists (homepage only)
  const entrySection = document.querySelector("[data-entry-section]");
  if (!entrySection) {
    // Not on homepage — nav visible immediately
    nav.classList.remove("sf-nav-hidden");
    nav.classList.add("sf-nav-visible");
    return;
  }

  // Homepage: nav starts hidden, ScrollTrigger reveals at ENTRY boundary
  const trigger = ScrollTrigger.create({
    trigger: entrySection,
    start: "bottom top",
    onEnter: () => {
      nav.classList.remove("sf-nav-hidden");
      nav.classList.add("sf-nav-visible");
    },
    onLeaveBack: () => {
      nav.classList.remove("sf-nav-visible");
      nav.classList.add("sf-nav-hidden");
    },
  });

  return () => trigger.kill();
}, []);
```

**CSS classes already defined (`app/globals.css:468–475`):**
```css
.sf-nav-hidden { visibility: hidden; opacity: 0; }
.sf-nav-visible { visibility: visible; opacity: 1; }
```

**Extraction shape:**
```typescript
// hooks/use-nav-reveal.ts (NEW)
import { useEffect, type RefObject } from "react";
import { ScrollTrigger } from "@/lib/gsap-core";

/**
 * Reveals the nav when a trigger element scrolls past the viewport top.
 * On the homepage, pass `[data-entry-section]`. On subpages, pass the page <header>.
 * Reduced-motion: nav visible immediately.
 *
 * The nav DOM element must carry `sf-nav-hidden` as its initial class and
 * rely on the `.sf-nav-visible` toggle for the hard-cut reveal.
 */
export function useNavReveal(
  navRef: RefObject<HTMLElement>,
  triggerRef: RefObject<HTMLElement>,
) {
  useEffect(() => {
    const nav = navRef.current;
    const trigger = triggerRef.current;
    if (!nav) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nav.classList.remove("sf-nav-hidden");
      nav.classList.add("sf-nav-visible");
      return;
    }

    if (!trigger) {
      // No trigger → visible immediately (pre-mount or sub-page without header)
      nav.classList.remove("sf-nav-hidden");
      nav.classList.add("sf-nav-visible");
      return;
    }

    const st = ScrollTrigger.create({
      trigger,
      start: "bottom top",
      onEnter: () => {
        nav.classList.remove("sf-nav-hidden");
        nav.classList.add("sf-nav-visible");
      },
      onLeaveBack: () => {
        nav.classList.remove("sf-nav-visible");
        nav.classList.add("sf-nav-hidden");
      },
    });

    return () => st.kill();
  }, [navRef, triggerRef]);
}
```

**Critical refactor note:** `Nav` currently does DOM-query (`document.querySelector("[data-entry-section]")`) at effect time to detect "am I on the homepage?". After the hook refactor, this lookup moves OUT of Nav and INTO the page-level callers. Nav becomes:
```tsx
// Nav component exposes its own ref via useImperativeHandle OR
// accepts a forwarded ref. Current Nav has an internal navRef — refactor it
// to forwardRef so the page can pass a shared ref to useNavReveal.
```

**Alternative (cleaner):** Keep `navRef` inside Nav, but export a `NavReveal` context or use `document.querySelector("nav[aria-label='Main navigation']")` in the hook. The cleaner path is `forwardRef`, matching React 19 conventions.

**When to use:** Every page that renders `<Nav />` and wants scroll-tied reveal. Homepage: trigger = `[data-entry-section]`. Subpages: trigger = the page header element.

### Pattern 2: Section Indicator Replacement (VL-06)

**What:** Replace the dot-rail render body in `components/layout/section-indicator.tsx` with a HUD coded readout, preserving:
- Filename (single import in `app/page.tsx:5`)
- DOM discovery via `document.querySelectorAll("[data-section]")`
- Label read from `data-section-label` attribute
- IntersectionObserver active-state tracking
- `role="navigation"`, `aria-current`, `aria-label`
- `hidden md:flex` mobile hiding

**Existing structure that must be preserved:**
```typescript
// Discovery (line 22–29) — KEEP
const els = document.querySelectorAll<HTMLElement>(selector);
const items = Array.from(els).map((el) => ({
  id: el.getAttribute("data-section") || el.id || "",
  label: el.getAttribute("data-section-label") || el.getAttribute("data-section") || "",
}));
setSections(items);

// Observer (line 32–64) — KEEP logic, threshold: [0.1, 0.3, 0.5, 0.7]
// scrollTo (line 66–72) — KEEP, uses scrollIntoView with smooth behavior
```

**New render (replaces lines 76–138):**
```tsx
<nav
  className={`hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 z-[var(--z-content)] flex-col items-end font-mono ${className ?? ""}`}
  aria-label="Section navigation"
  role="navigation"
>
  {sections.map((s, i) => {
    const code = `[${String(i + 1).padStart(2, "0")}//${s.label.toUpperCase()}]`;
    const isActive = i === activeIndex;
    return (
      <button
        key={s.id}
        onClick={() => scrollTo(i)}
        aria-label={`Jump to ${s.label}`}
        aria-current={isActive ? "true" : undefined}
        className={cn(
          "block px-2 py-1 text-[var(--text-2xs)] uppercase tracking-[0.1em] transition-colors",
          isActive
            ? "bg-foreground/12 text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {code}
      </button>
    );
  })}
</nav>
```

**Test that will break if DOM contract regresses:** None currently — a new test must be added for VL-06.

### Pattern 3: TokenTabs Specimen Pattern (SP-01/SP-02)

**What:** Keep `TokenTabs` as the orchestrator that owns `useSessionState(SESSION_KEYS.TOKENS_TAB)` and `SFTabs`. Replace the 7 `<SFTabsContent>` bodies (COLOR, SPACING, TYPOGRAPHY, MOTION, ELEVATION, RADIUS, BREAKPOINTS — the last 3 are pre-existing legacy tabs, only 4 are in SP-02 scope) with specimen imports. Data arrays `COLOR_SCALES`, `SPACING`, `TYPE_SCALE`, `MOTION_TOKENS` stay at the top of `token-tabs.tsx` and get passed as props.

**Pattern:**
```tsx
// token-tabs.tsx (after refactor, sketch)
<SFTabsContent value="COLOR" className="mt-0">
  <ColorSpecimen scales={COLOR_SCALES} />
</SFTabsContent>
<SFTabsContent value="SPACING" className="mt-0">
  <SpacingSpecimen tokens={SPACING} />
</SFTabsContent>
// ...etc
```

**Why keep the data in `token-tabs.tsx`:** The client component already imports `useSessionState` and `useState` for `showAll` color-scale toggle. Moving data to a separate file would require a second client boundary. Simpler to keep arrays local and pass as props.

**Specimens can be Server Components if they have no interactive state.** `ColorSpecimen` may need client state if it includes hover-to-copy; `SpacingSpecimen`, `TypeSpecimen`, `MotionSpecimen` should be Server Components.

### Pattern 4: APIExplorer Schematic Restyle (SP-04)

**What:** Preserve the data layer of `APIExplorer` (807 LOC):
- `NAV_SECTIONS` (5 groups: CORE, COMPONENTS, SIGNAL LAYER, TOKENS, HOOKS)
- `BUTTON_PROPS` hardcoded array
- `DataDrivenDoc` render function (reads `API_DOCS` from `lib/api-docs.ts`)
- `activeNav` / `activeItem` state
- `handleNavClick` + keyboard handler `handleSidebarKeyDown`
- `contentRef` scroll progress RAF handler
- `HudTelemetry` sub-component (visibility-aware interval)

**Replace:** The 3-panel grid layout (`grid grid-cols-1 md:grid-cols-[var(--api-sidebar-w)_1fr_var(--api-preview-w)]` at line 504) with a single-column grouped index that reads the same data.

**Decorative GSAP effects at lines 275–420** — re-evaluate per CONTEXT.md "zero new components/effects":
- Split-text H1 reveal → **KEEP** (existing, not new)
- Typewriter on import code → **KEEP or SIMPLIFY** (already scoped per-entry, expanded state)
- HUD line stagger → **KEEP**
- Button scramble on hover → **KEEP**
- Click pop on preview buttons → may go away if the preview panel is removed
- Magnetic cursor on nav items → may go away if sidebar is restructured

**Architecture preservation is load-bearing.** The schematic restyle must NOT:
- Introduce a new dependency
- Change `API_DOCS` data shape
- Break the `contentRef.current?.scrollTo({ top: 0, behavior: "smooth" })` reset on nav click
- Lose the `aria-current="location"` pattern on active nav button
- Lose the `Escape`/keyboard navigation in the sidebar

### Anti-Patterns to Avoid

- **Anti-pattern: Adding a new SF-wrapped component for the HUD indicator.** The file replaces `section-indicator.tsx` in place. Adding `<SFSectionHUD>` as a new sibling doubles maintenance surface and violates the CONTEXT.md lock.
- **Anti-pattern: Moving `TokenTabs` data arrays to a new `lib/tokens.ts` file.** The data is tightly coupled to the render; extracting it creates an API surface that must now be versioned. Keep data local.
- **Anti-pattern: Replacing `APIExplorer`'s 3-panel layout with a new single-column component.** The 807 LOC must be restyled in place; replacement with a new file loses search wiring, scroll progress, keyboard nav, and HudTelemetry.
- **Anti-pattern: Hardcoding `[NN//CODE]` labels in the section indicator.** Labels must come from `data-section-label` attribute (`entry` → `ENTRY`), numbering from DOM order.
- **Anti-pattern: `inset-0 flex items-center justify-center` for GhostLabel placement.** This is wallpaper. Correct pattern is negative-margin column-edge bleed (e.g. `absolute -left-[5vw] top-1/2 -translate-y-1/2`).
- **Anti-pattern: Modifying `--color-primary` token value to "fix" the magenta audit.** The audit is about FREQUENCY, not the token value. Reduce uses, don't desaturate the token.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll-tied reveal | `window.scroll` + rAF loop | `ScrollTrigger.create({ start: "bottom top" })` | Existing GSAP install, handles reduced-motion hook cleanup correctly |
| Active section detection | Custom scroll listeners | `IntersectionObserver` (already in SectionIndicator) | Native, passive, no layout thrash |
| Specimen curve plots | Canvas animation loops | Static SVG `<path>` with `cubic-bezier` control points | Motion tokens are static data — no animation loop needed, ships as Server Component |
| Copy-to-clipboard (if added to specimens) | Manual event listeners | Existing `useSessionState` + browser `navigator.clipboard.writeText` pattern from `TokenTabs` | Consistent with rest of codebase |
| Syntax highlighting in `/reference` | Add shiki/prism | Pre-existing `highlight()` from `lib/code-highlight` + `SharedCodeBlock` | Already server-side; NEVER add `shiki/bundle/web` (695KB) per v1.4 rule |

**Key insight:** Phase 34 is explicitly a "restyle + redeploy" phase. The `CLAUDE.md` hard constraint "DO NOT add features, components, or tokens beyond stabilization scope" means every new file must justify itself against the CONTEXT.md locked decisions. The only sanctioned new files are: `hooks/use-nav-reveal.ts`, `components/blocks/token-specimens/{4 files}`. Everything else is in-place modification.

## Common Pitfalls

### Pitfall 1: Nav-reveal breaks when hook callers forget to clear `sf-nav-hidden`
**What goes wrong:** The refactored hook needs both `navRef` AND the Nav's initial `sf-nav-hidden` className. If Nav is rendered on a subpage where the hook hasn't attached yet, the nav stays invisible forever.
**Why it happens:** The current Nav renders `<nav ... className="... sf-nav-hidden">` on every mount. The hook is the only thing that removes this class. On subpages without a trigger ref (or with `triggerRef.current === null` at effect time), the hook never runs the branch that removes `sf-nav-hidden`.
**How to avoid:** The hook MUST handle the `trigger === null` case by immediately flipping to visible (matches current behavior). The hook MUST also handle the `navRef === null` case by returning early without leaving nav stuck hidden.
**Warning signs:** Subpage loads, nav is invisible. User can still see main content but loses navigation. Playwright test `await expect(page.locator('nav[aria-label="Main navigation"]')).toBeVisible()` would catch this.

### Pitfall 2: IntersectionObserver `activeIndex` dependency loop
**What goes wrong:** The existing SectionIndicator's Observer useEffect lists `activeIndex` in its dependency array (`components/layout/section-indicator.tsx:64`). Every active-index change disconnects and re-observes, which can miss fast scroll transitions.
**Why it happens:** Closure capture of `activeIndex` inside the observer callback requires it in the deps, but re-observing is expensive.
**How to avoid:** Use a `useRef` for the "best known index" and read it via ref inside the callback. When replacing the file, fix this (don't copy the bug).
**Warning signs:** Active HUD item lags behind scroll position; quick scrolls from ENTRY to ACQUISITION skip intermediate highlights.

### Pitfall 3: Ghost label placement causes CLS
**What goes wrong:** `GhostLabel` is `position: absolute` so should not shift layout, BUT at `clamp(200px, 25vw, 400px)` with Anton, if it's NOT inside a parent with `overflow: hidden`, horizontal scroll can leak on mobile viewports (240px label on a 375px screen bleeding across the page edge shifts grid columns).
**Why it happens:** Viewport-relative sizing + absolute positioning outside a clipping context.
**How to avoid:** Every GhostLabel parent must have `overflow: hidden` or `overflow-x: clip`. The SFSection wrapper already does this for homepage sections — verify on `/system`, `/init`, `/reference` headers.
**Warning signs:** CLS > 0 on subpages after Phase 34 ships; horizontal scrollbar appears at 375px viewport.

### Pitfall 4: Magenta audit misses CSS-level usage
**What goes wrong:** Grepping `text-primary|bg-primary|border-primary` catches Tailwind classes but misses the 3 raw `var(--color-primary)` uses in `globals.css:1352, 1374, 1377` (progress bar + signal accent patterns). Audit says "X moments" but actual rendered magenta count is X+3.
**Why it happens:** `primary` is a Tailwind theme token AND a raw CSS variable. Two reference styles.
**How to avoid:** Audit must grep both `primary\b` (Tailwind) and `var\(--color-primary\)` (raw CSS). Use:
```bash
rg -n "primary\b|var\(--color-primary\)|color-primary|bg-primary|text-primary|border-primary" app/ components/ app/globals.css
```
**Warning signs:** Visual inspection shows more than 5 magenta moments despite grep count showing 5.

### Pitfall 5: Replacing APIExplorer render breaks keyboard navigation
**What goes wrong:** `handleSidebarKeyDown` at `components/blocks/api-explorer.tsx:427–461` uses `ALL_NAV_IDS` flat list and `aria-current="location"` selector to focus the next button. If the restyled single-column layout removes the dedicated `<nav>` sidebar, the keyboard handler breaks silently.
**Why it happens:** Query selector `sidebarRef.current?.querySelector<HTMLButtonElement>('button[aria-current="location"]')` is tied to the sidebar ref and the specific aria-current pattern.
**How to avoid:** When restyling, preserve `sidebarRef` OR migrate to a role-based query (`[role="list"] [aria-current="location"]`). Add a Playwright test for arrow-key navigation through API entries.
**Warning signs:** Tab/arrow navigation stops working in the restyled index.

### Pitfall 6: HUD section indicator active-state magenta drift
**What goes wrong:** Copy-pasting the dot-rail's active-state magenta (`bg-primary` at existing line 117) into the HUD. CONTEXT.md explicitly says "background fill, NOT a color change to magenta — VL-05 magenta budget is reserved."
**Why it happens:** The existing file has `bg-primary` on active dots; a careless replacement keeps it.
**How to avoid:** Active state MUST be `bg-foreground/12` (or /10-/15). No `primary` color on the HUD entries.
**Warning signs:** VL-05 magenta count per page exceeds 5 after Phase 34 ships.

### Pitfall 7: `/init` bottom block removal breaks tests
**What goes wrong:** `app/init/page.tsx` has `CHECKLIST` and `NEXT_CARDS` + `SetupChecklist` + `Community Band` sections below STEPS. CONTEXT.md says the bottom should be a terminal line like `[OK] SYSTEM READY`, not a "next steps" CTA. Removing these blocks may break existing tests if any assert on them.
**Why it happens:** Phase 34 is the first phase to touch `/init` substantively.
**How to avoid:** Search `tests/` for any selector referencing `#setup-checklist`, `NEXT STEPS`, `JOIN THE SIGNAL`, or `NEXT_CARDS`. Adjust or delete tests when the blocks are removed.
**Warning signs:** Playwright failures on `/init` after 34-03 ships.

## Code Examples

### Ghost Label Architectural Placement (VL-01)
```tsx
// ✓ GOOD — architectural, column-edge bleed
<section className="relative overflow-hidden">
  <GhostLabel
    text="SYSTEM"
    className="-left-[2vw] top-1/2 -translate-y-1/2 text-foreground/[0.04]"
  />
  <h1 className="sf-display relative z-10">TOKEN EXPLORER</h1>
  {/* content */}
</section>

// ✗ BAD — wallpaper, centered decoration
<section className="relative overflow-hidden">
  <GhostLabel text="SYSTEM" className="inset-0 text-foreground/5" />
  <h1>TOKEN EXPLORER</h1>
</section>
```

### HUD Section Indicator Active State (VL-06)
```tsx
// ✓ GOOD — neutral fill, preserves magenta budget
className={cn(
  "block px-2 py-1 text-[var(--text-2xs)] uppercase tracking-[0.1em]",
  isActive
    ? "bg-foreground/12 text-foreground"
    : "text-muted-foreground hover:text-foreground"
)}

// ✗ BAD — burns a magenta moment per page
className={cn(
  "...",
  isActive ? "text-primary" : "text-muted-foreground"
)}
```

### /init Step Pattern (SP-03)
```tsx
// ✓ GOOD — bringup sequence register, preserves STEPS data
{STEPS.map((step, i) => {
  const codes = ["INIT", "HANDSHAKE", "LINK", "TRANSMIT", "DEPLOY"];
  const code = `[${step.number}//${codes[i]}]`;
  return (
    <div key={step.number} className="grid grid-cols-[auto_1fr] gap-8 border-b border-foreground/15 py-12">
      <div className="sf-display text-[clamp(80px,10vw,160px)] leading-none">
        {step.number}
      </div>
      <div>
        <div className="font-mono text-[var(--text-xs)] text-muted-foreground tracking-[0.2em] mb-2">
          {code}
        </div>
        <h2 className="sf-display text-[var(--text-3xl)] uppercase mb-4">{step.title}</h2>
        <p className="font-mono uppercase text-sm leading-relaxed tracking-tight text-muted-foreground max-w-prose mb-6">
          {step.description}
        </p>
        <SharedCodeBlock label="TERMINAL">{/* render step.code */}</SharedCodeBlock>
      </div>
    </div>
  );
})}

{/* Terminal footer — replaces NEXT_CARDS + CHECKLIST + COMMUNITY BAND */}
<div className="py-16 px-[clamp(20px,4vw,48px)] font-mono text-muted-foreground">
  [OK] SYSTEM READY
</div>
```

## TokenTabs Current Shape (SP-01 research)

**File:** `components/blocks/token-tabs.tsx` (630 LOC, `'use client'`)

**State:**
- `useSessionState<string>(SESSION_KEYS.TOKENS_TAB, "COLOR")` — persists active tab across sessions
- `useState<boolean>(false)` — `showAll` for color scales (6 core vs 49 full)
- `useState<{scale, step}>({0, 0})` — focused swatch for keyboard grid navigation

**Data arrays (keep in place, pass as props to specimens):**
| Array | Shape | Used By |
|-------|-------|---------|
| `COLOR_SCALES` | 49 `{name, hue, swatches: [{step, l, c, h}]}` objects (derived from `SCALE_DEFS` via `generateScale()`) | COLOR tab → `ColorSpecimen` |
| `SPACING` | 9 `{name, rem, px}` objects (blessed stops 4/8/12/16/24/32/48/64/96) | SPACING tab → `SpacingSpecimen` |
| `TYPE_SCALE` | 7 `{name, sample, font, size, weight, meta, uppercase?, code?}` | TYPOGRAPHY tab → `TypeSpecimen` |
| `MOTION_TOKENS` | 5 `{name, easing, duration, css}` | MOTION tab → `MotionSpecimen` |
| `ELEVATION_TOKENS` | 6 items | ELEVATION tab (legacy, not in SP-02 scope) |
| `RADIUS_TOKENS` | 7 items | RADIUS tab (legacy) |
| `BREAKPOINT_TOKENS` | 5 items | BREAKPOINTS tab (legacy) |

**Tab structure:**
```tsx
<SFTabs value={activeTab} onValueChange={setActiveTab}>
  <SFTabsList>...COLOR, SPACING, TYPOGRAPHY, MOTION, ELEVATION, RADIUS, BREAKPOINTS...</SFTabsList>
  <SFTabsContent value="COLOR">...</SFTabsContent>
  <SFTabsContent value="SPACING">...</SFTabsContent>
  {/* ...etc */}
</SFTabs>
```

**Current render bodies (approximate line ranges):**
- COLOR tab: ~204–365 (complex — 49 scales, 12 steps each, keyboard grid navigation, `showAll` toggle, marquee strip)
- SPACING tab: ~367–399 (simple `SFTable` with name/rem/visual bar/px columns)
- TYPOGRAPHY tab: ~401–448 (simple `SFTable` with name/sample/meta columns, uses inline style for each type sample)
- MOTION tab: ~450–487 (simple `SFTable` with motion preview animation via CSS)
- ELEVATION tab: ~490–534 (legacy — SP-02 scope does NOT require replacement)
- RADIUS tab: ~536–588 (legacy)
- BREAKPOINTS tab: ~591–627 (legacy)

**Critical preservation (SP-01/02):**
- `useSessionState` wiring survives — it lives in TokenTabs, not specimens
- `onKeyDown` grid navigation for COLOR (~260 LOC of arrow-key handling, lines ~262–310) — if ColorSpecimen becomes a Server Component, this keyboard nav MUST remain in TokenTabs OR be re-implemented as a client island inside ColorSpecimen
- `showAll` toggle is client state — stays in TokenTabs

**Preservation risk:** The color-scale keyboard grid navigation is load-bearing for accessibility. If `ColorSpecimen` becomes a Server Component and TokenTabs just passes data, the keyboard handlers (which are inline on the `role="row"` div) must move into ColorSpecimen which means ColorSpecimen becomes a Client Component. **Recommendation: ColorSpecimen = Client, the other 3 specimens = Server.**

## APIExplorer Current Shape (SP-04 research)

**File:** `components/blocks/api-explorer.tsx` (807 LOC, `'use client'`)

**Data structures:**
| Constant | Shape | Scope |
|----------|-------|-------|
| `NAV_SECTIONS` | 5 groups: CORE (4), COMPONENTS (10 with `{label, id, badge?}`), SIGNAL LAYER (5), TOKENS (5), HOOKS (4) | Sidebar navigation |
| `BUTTON_PROPS` | 6 `{name, type, default, desc, required?}` | Legacy hardcoded button docs (non-data-driven fallback) |
| `API_DOCS` | External, from `lib/api-docs.ts` — `Record<string, ComponentDoc>` | Data-driven render path via `DataDrivenDoc` |
| `ALL_NAV_IDS` | Flat string[] | Keyboard navigation index |
| `SF_SCRAMBLE_CHARS` | Constant string | Scramble text effect |

**State:**
- `activeNav` (default `"button"`) — currently selected entry
- `previewTheme` (`"LIGHT" | "DARK" | "FRAME"`) — right panel preview theme
- `scrollProgress` (0–1) — scroll progress bar on center panel
- `contentRef`, `sidebarRef` refs for scroll and query

**GSAP effects registered in a single `useEffect` at lines 266–420:**
1. Nav items stagger fade-in (`gsap.from` on all `<button>` in sidebar)
2. H1 split-text reveal (`SplitText.create` on `[data-anim='api-h1']`)
3. Typewriter on import code block (clip-path based on char progress)
4. HUD line stagger (`gsap.from` on `[data-anim='hud-line']`)
5. Button scramble on hover (`scrambleText` plugin)
6. Click pop on preview buttons (scale 1→1.08→1)
7. Magnetic cursor on nav items (delegated `mousemove` listener)

**All 7 effects use `reduced-motion` guard at line 268:** `if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;`

**Cleanup pattern:** `ctx?.revert()`, array of cleanup functions for magnetic and scramble handlers.

**Layout grid (line 504 — the restyle target):**
```tsx
grid grid-cols-1 md:grid-cols-[var(--api-sidebar-w)_1fr_var(--api-preview-w)]
// --api-sidebar-w: 240px, --api-preview-w: 380px
```

**Three panels:**
- LEFT: `<nav ref={sidebarRef}>` sidebar with `NAV_SECTIONS` grouped links (lines 506–547)
- CENTER: `<div ref={contentRef}>` documentation content (lines 549–692) — uses `DataDrivenDoc` for most entries, falls back to hardcoded "BUTTON" section at lines 590–690
- RIGHT: `<aside>` context-aware preview (lines 694–803) — theme toggle, HUD telemetry, button previews, code snippet

**Schematic restyle implication:** The 3-panel grid becomes a single grouped index. The right preview panel goes away OR becomes an inline expanded-state body per entry. Critical: `DataDrivenDoc` and `API_DOCS` stay untouched — only the surrounding layout changes.

**Preserve for SP-04:**
- `handleSidebarKeyDown` arrow navigation (lines 427–461)
- `aria-current="location"` pattern on active entries
- `HudTelemetry` visibility-aware interval (lines 35–68) — worth keeping for SIGNAL-layer atmosphere
- `contentRef.current?.scrollTo({ top: 0, behavior: "smooth" })` on nav click

## Init STEPS Current Shape (SP-03 research)

**File:** `app/init/page.tsx` (391 LOC, Server Component with `<CodeBlock>` helper)

**STEPS array shape:**
```typescript
const STEPS: Array<{
  number: string;       // "01" through "05"
  title: string;        // "INSTALL" / "INITIALIZE" / "USE_COMPONENTS" / "ACTIVATE_FRAME" / "DEPLOY"
  description: string;  // All-caps prose sentence
  code: CodeLine[];     // Array of { type: "comment"|"blank"|"line", ... }
  note: string | null;  // Optional footnote below code block
  highlight: boolean;   // Step 03 is `true` (yellow band), others `false`
}>
```

**CodeLine union type:**
```typescript
type CodePart = { text: string; cls?: string };
type CodeLine =
  | { type: "comment"; text: string }
  | { type: "blank" }
  | { type: "line"; parts: CodePart[] };

const COLOR_MAP: Record<string, string> = {
  kw: "text-primary",             // keywords
  str: "text-[var(--sf-yellow)]", // strings
  fn: "text-[var(--sf-code-text)]",
  cn: "text-[var(--sf-code-keyword)]",
};
```

**Render (current):**
Each STEP renders as an `<SFSection>` with `grid-cols-[60px_1fr] md:grid-cols-[80px_1fr]` — small step-number column + content column with step title, description, `<CodeBlock>`, optional note. Step 03 (`USE_COMPONENTS`) has `highlight: true` and renders on yellow band.

**Blocks to REMOVE in SP-03 (the "onboarding flow" energy):**
- `CHECKLIST` array + "SETUP_CHECKLIST" SFSection (lines 126–133, 268–302)
- `NEXT_CARDS` array + "NEXT STEPS" SFSection (lines 135–139, 305–335)
- "COMMUNITY BAND" SFSection with marquee + "JOIN THE SIGNAL" + GitHub/Storybook buttons (lines 338–386)
- Hero section "ESTIMATED TIME: 5 MIN" line (line 210–212) — marketing register

**Blocks to PRESERVE:**
- `STEPS` array verbatim (data layer)
- `CodeBlock` helper component (lines 154–182) and `COLOR_MAP`
- `SharedCodeBlock` import wiring
- `Nav`, `Breadcrumb`, `Footer` chrome
- `metadata` export

**Blocks to REFRAME:**
- Hero section: `GET`/`STARTED` h1 split → single `INITIALIZE` at `clamp(80px, 12vw, 160px)` with `[00//BOOT]` coded label above
- Each STEP JSX: preserve `step.number`, `step.title`, `step.description`, `step.code`, `step.note`; rewrap in "bringup sequence" register with `[NN//CODE]` indicator; drop `highlight: true` yellow band treatment on step 03 (inconsistent register)
- Bottom: new terminal line `[OK] SYSTEM READY` or `[EXIT 0]`

## Section Indicator Consumers

**Total consumers:** 1 file (`app/page.tsx:5, 91`)

```typescript
// app/page.tsx:5
import { SectionIndicator } from "@/components/layout/section-indicator";

// app/page.tsx:91
<SectionIndicator />
```

**No subpage uses it.** This means the HUD replacement does NOT need to ship to `/system`, `/init`, `/reference` — they don't render a section indicator at all (they have Breadcrumb + single-section pages). This is consistent with CONTEXT.md: the HUD replaces the dot rail on the homepage only.

**Prop surface:** `{ selector?: string; className?: string }` — default selector `[data-section]`, default className undefined. New HUD must accept the same prop shape.

## Magenta Usage Baseline

**Measured via `rg -c 'text-primary|bg-primary|border-primary|var\(--color-primary\)'` per file:**

| File | Count | Notes |
|------|-------|-------|
| `app/page.tsx` | 0 | Homepage — inherits from child blocks only |
| `app/init/page.tsx` | 13 | Includes `COLOR_MAP` `kw: "text-primary"` (syntax highlight, load-bearing) + `GET STARTED` hero accent + checklist checkboxes + NEXT_CARDS border animations + community link |
| `app/system/page.tsx` | 1 | `linear-gradient(..., var(--color-primary), ...)` separator at line 47 |
| `app/inventory/page.tsx` | 1 | One use (needs individual audit) |
| `app/layout.tsx` | 1 | Layout-level (metadata theme color likely) |
| `app/loading.tsx` | 1 | Loading spinner |
| `app/not-found.tsx` | 1 | 404 page accent |
| `app/globals.css` | 11 | 3 with `var(--color-primary)` (scanlines + progress patterns), 8 others via `--color-primary` references |
| `components/blocks/token-tabs.tsx` | 11 | Tab body text-primary on token names (text-primary on SPACING/TYPE/MOTION/ELEVATION/RADIUS/BREAKPOINT header cells) + SHOW ALL button + OKLCH/0px emphasis |
| `components/blocks/api-explorer.tsx` | 15 | `import`/`from` keyword coloring + `text-primary` on active nav entry + breadcrumb path + scroll progress bar color + VHS badge pulse + active nav border-l + H1 span |
| `components/blocks/component-detail.tsx` | 3 | Detail panel accents |
| `components/blocks/component-grid.tsx` | 7 | Grid item highlights |
| `components/blocks/inventory-section.tsx` | 2 | Row focus state |
| `components/blocks/dual-layer.tsx` | 1 | |
| `components/blocks/code-section.tsx` | 11 | Syntax highlight (load-bearing) |
| `components/blocks/hero.tsx` | 3 | Hero accents |
| `components/blocks/entry-section.tsx` | 2 | ENTRY-section specific |
| `components/blocks/components-explorer.tsx` | 15 | Explorer states |
| `components/blocks/stats-band.tsx` | 1 | Stat accent |
| `components/blocks/manifesto-band.tsx` | 1 | Manifesto accent |

**Total direct-match occurrences:** 29 in `app/` + 74 in `components/blocks/` = **103 occurrences across 19 files**.

**Per-page sanctioned moment budget (max 5 each):**
- Homepage `/` — consumes from: `entry-section`, `thesis-section`, `proof-section`, `inventory-section`, `signal-section`, `acquisition-section`, `hero` (legacy?), `dual-layer`, `stats-band`, `manifesto-band`
- `/system` — consumes from: `token-tabs` + the page-level gradient separator
- `/init` — consumes from: `app/init/page.tsx` directly (13 instances, at least 5 need to go)
- `/reference` — consumes from: `api-explorer` (15 instances, at least 10 need to go or be recategorized)
- `/inventory` — consumes from: `inventory-section`, `component-grid`, `component-detail`, `components-explorer`, plus page-level

**Audit pattern (VL-05 grounded):**
```bash
# Per page, identify actual rendered magenta moments
rg -n 'text-primary|bg-primary|border-primary|var\(--color-primary\)' app/system/page.tsx components/blocks/token-tabs.tsx
rg -n 'text-primary|bg-primary|border-primary|var\(--color-primary\)' app/init/page.tsx
rg -n 'text-primary|bg-primary|border-primary|var\(--color-primary\)' app/reference/page.tsx components/blocks/api-explorer.tsx
rg -n 'text-primary|bg-primary|border-primary|var\(--color-primary\)' app/inventory/page.tsx components/blocks/{inventory-section,component-grid,component-detail}.tsx
```

**Load-bearing uses (candidates for preservation):**
- Syntax highlighting `text-primary` on `import`/`from`/keyword tokens — these ARE the design of code blocks; removing them breaks legibility
- Focus rings (`focus:outline-primary`) — accessibility
- Active-state indicators (filter chips, active tab)

**Non-load-bearing uses (audit candidates for removal):**
- Border accents that duplicate foreground contrast
- Hover states (can use foreground instead)
- Stat callouts (muted-foreground works)
- Decorative link underlines

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Dot-rail section indicator | HUD coded `[NN//LABEL]` readout | Phase 34 | Reads as instrument panel, not nav widget |
| `/components` h1 = "COMPONENTS" + fake 340 count | `/inventory` h1 = "INVENTORY" + real 54 count | Phase 34 | Matches route rename + registry truth |
| `/system` TokenTabs with 4 render bodies | 4 specimen sub-components | Phase 34 | Each specimen is the designed presentation of its data |
| `/init` onboarding flow with NEXT_CARDS + CHECKLIST + marquee band | Boot-sequence walkthrough with terminal footer | Phase 34 | Technical register, not marketing tutorial |
| `/reference` APIExplorer 3-panel (sidebar/content/preview) | Grouped schematic index | Phase 34 | Engineer doc, not marketing features page |
| Homepage nav-reveal hardcoded in Nav component | `useNavReveal` shared hook | Phase 34 | Centralizes reduced-motion handling, enables subpage reuse |
| Ghost label component exists but unused | Deployed to 5+ architectural positions | Phase 34 | Structural wayfinding, not decoration |

**Deprecated/outdated:**
- `highlight: true` flag on STEP 03 `USE_COMPONENTS` (yellow band treatment) — inconsistent with bringup sequence register
- `NEXT_CARDS` array in `/init` — marketing "continue your journey" energy
- `CHECKLIST` array in `/init` — tutorial register
- "COMMUNITY BAND" in `/init` — Phase 30 removed marquees from homepage, `/init` still has one

## Open Questions

1. **Should Nav be refactored to `React.forwardRef`?**
   - What we know: The existing Nav has an internal `navRef = useRef<HTMLElement>(null)` and runs its own effect. The hook extraction needs a way for the page to pass a nav ref AND a trigger ref.
   - What's unclear: Cleanest React 19 pattern — `forwardRef` + `useImperativeHandle` vs. global selector (`document.querySelector('nav[aria-label="Main navigation"]')`) vs. context.
   - Recommendation: `forwardRef`. It's the idiomatic React pattern, doesn't require `'use client'` promotion, and avoids DOM-query fragility.

2. **ColorSpecimen: Server Component or Client Component?**
   - What we know: 49 scales × 12 steps = 588 swatches with inline-style OKLCH backgrounds. Keyboard grid navigation is load-bearing. `showAll` toggle is client state.
   - What's unclear: Whether the `showAll` state can live in TokenTabs (parent) and pass down, or needs to be in the specimen.
   - Recommendation: ColorSpecimen = Client (owns keyboard nav + receives `showAll`/`onToggleShowAll` from parent). Other 3 specimens = Server.

3. **APIExplorer right preview panel: keep, simplify, or remove?**
   - What we know: CONTEXT.md says "schematic, dense, no decorative spacing — fills the viewport with information density" and "preview panel" isn't mentioned. Current right panel has theme toggle + HUD telemetry + rendered button preview + code snippet.
   - What's unclear: Is the preview panel part of "schematic" or part of "marketing features"?
   - Recommendation: **Remove the right preview panel** for schematic restyle. The rendered button preview is marketing-adjacent. Inline expanded state body per entry (data sheet + usage example + accessibility notes) is the schematic approach. HUD telemetry component can move to the new page header as an atmospheric detail. Confirm with grey if ambiguous.

4. **Ghost label placement on THESIS: does it interact with the pinned scroll?**
   - What we know: Phase 31 THESIS is a 200–300vh pinned scroll section with GSAP ScrollTrigger pin. Ghost label needs to be "anchored behind manifesto phrases" per CONTEXT.md.
   - What's unclear: If the ghost label is inside the pinned container, it pins with the content. If outside, it scrolls past. Neither may be the "architectural element" intent.
   - Recommendation: Place inside the pinned container so it stays visible for the duration of the pin, acting as a persistent backdrop.

5. **Should `/init` drop the `metadata` description line "From zero to Signal//Frame in 5 minutes"?**
   - What we know: This is the `<meta name="description">` used for SEO. "5 minutes" is marketing register.
   - What's unclear: Whether SEO preservation trumps register purity.
   - Recommendation: Keep metadata (SEO), strip from visible page body. Two different audiences.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright 1.x (from `devDependencies`, `@playwright/test`) |
| Config file | `playwright.config.ts` (testDir `./tests`, chromium only, headless, SwiftShader WebGL, clipboard permissions) |
| Quick run command | `npx playwright test tests/phase-34-visual-language-subpage.spec.ts` |
| Full suite command | `npx playwright test` |
| Dev server | Must be running on `http://localhost:3000` (not auto-started by Playwright — `webServer: undefined`) |

**Existing test pattern (inherit from `tests/phase-33-inventory-acquisition.spec.ts`):**
- `fs.readFileSync` source-level assertions for "did the file get rewritten to match spec" (fast, deterministic, no browser)
- `page.goto("/")` + `page.locator("[data-section]")` DOM assertions for runtime behavior
- `test.describe("Phase 34 — Visual Language + Subpage")` wrapper
- `const ROOT = path.resolve(__dirname, "..")` pattern for repo paths

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| VL-01 | GhostLabel deployed to 5+ architectural locations | DOM (homepage + 3 subpages) | `npx playwright test tests/phase-34-visual-language-subpage.spec.ts -g "VL-01"` | Wave 0 |
| VL-01 | Each ghost label placement has `pointer-events-none` and `aria-hidden` | source grep | same | Wave 0 |
| VL-01 | GhostLabel caller count ≥ 5 across codebase | source fs.readFileSync on all 5 files | same | Wave 0 |
| VL-02 | ≥3 display type moments at ≥120px computed font-size | DOM (measure `getComputedStyle(el).fontSize`) | same | Wave 0 |
| VL-02 | `/system`, `/init`, `/reference` h1 computed font-size ≥ 80px at 1440 viewport | DOM | same | Wave 0 |
| VL-02 | `/inventory` h1 text content = `INVENTORY` (not `COMPONENTS`) and stat = `54` (not `340`) | DOM text content | same | Wave 0 |
| VL-04 | THESIS + SIGNAL negative-space ≥ 40% (Wave 0 manual visual) | MANUAL — screenshot with 10% grid overlay, document count | `npm run dev` + screenshot script | Manual only |
| VL-05 | Per page magenta occurrence count ≤ 5 | source grep per page file + direct block imports | same (scripted in test via `fs.readFileSync` + regex) | Wave 0 |
| VL-05 | `app/init/page.tsx` magenta count ≤ 5 | source grep | same | Wave 0 |
| VL-05 | `components/blocks/api-explorer.tsx` magenta count ≤ 5 (after restyle) | source grep | same | Wave 0 |
| VL-05 | `components/blocks/token-tabs.tsx` magenta count ≤ 5 (after restyle) | source grep | same | Wave 0 |
| VL-06 | `components/layout/section-indicator.tsx` renders `[NN//LABEL]` format | DOM — match regex `/^\[\d{2}\/\/[A-Z]+\]$/` on each button textContent | same | Wave 0 |
| VL-06 | HUD indicator active-state uses `bg-foreground/` NOT `bg-primary` | source grep NOT + DOM computed-style `background-color` NOT matching primary | same | Wave 0 |
| VL-06 | HUD indicator has `role="navigation"`, `aria-current` on active, 6 entries on homepage | DOM | same | Wave 0 |
| VL-06 | HUD indicator `hidden md:flex` — not visible at viewport 375px | DOM `toBeHidden` at small viewport | same | Wave 0 |
| SP-01 | `components/blocks/token-specimens/` directory exists with 4 files | source fs.existsSync | same | Wave 0 |
| SP-01 | `TokenTabs` imports from `./token-specimens/*-specimen` | source grep | same | Wave 0 |
| SP-02 | `/system` spacing specimen renders ruler bars for all 9 blessed stops | DOM — count `[data-spacing-token]` = 9 | same | Wave 0 |
| SP-02 | `/system` type specimen renders sample text for each scale entry | DOM — count `[data-type-sample]` ≥ 7 | same | Wave 0 |
| SP-02 | `/system` color specimen renders OKLCH swatch matrix with L/C/H labels | DOM — find `[data-oklch-swatch]` with aria-label containing `oklch(` | same | Wave 0 |
| SP-02 | `/system` motion specimen renders SVG curve paths | DOM — count `svg path` inside motion specimen | same | Wave 0 |
| SP-03 | `/init` preserves 5 STEPS entries | DOM — count `[data-init-step]` = 5 | same | Wave 0 |
| SP-03 | `/init` does NOT render NEXT_CARDS or SETUP_CHECKLIST or COMMUNITY BAND | DOM — `toHaveCount(0)` for these selectors | same | Wave 0 |
| SP-03 | `/init` bottom contains `[OK] SYSTEM READY` or `[EXIT 0]` terminal line | DOM text content | same | Wave 0 |
| SP-03 | `/init` each step has `[NN//CODE]` coded indicator | DOM text regex | same | Wave 0 |
| SP-04 | `/reference` page has h1 `API REFERENCE` at computed font-size ≥ 80px | DOM | same | Wave 0 |
| SP-04 | `/reference` renders grouped index by surface type (COMPONENTS/HOOKS/TOKENS) | DOM — 3 section headings | same | Wave 0 |
| SP-04 | `/reference` preserves `API_DOCS` data — clicking an entry shows props table | DOM click + wait for props table | same | Wave 0 |
| SP-04 | `/reference` keyboard navigation still works (ArrowDown from first entry focuses second) | DOM keyboard events | same | Wave 0 |
| SP-04 | `/reference` search/filter input still present and functional | DOM input + count change | same | Wave 0 |
| SP-05 | `hooks/use-nav-reveal.ts` exists and exports `useNavReveal` | source fs.readFileSync + grep | same | Wave 0 |
| SP-05 | `Nav` calls `useNavReveal` (does NOT contain inline ScrollTrigger.create) | source grep | same | Wave 0 |
| SP-05 | Subpages (`/system`, `/init`, `/reference`) render nav visible after scrolling past header | DOM scroll + wait for `sf-nav-visible` class | same | Wave 0 |
| SP-05 | Reduced-motion: nav is visible immediately on page load (no scroll needed) | DOM — `page.emulateMedia({ reducedMotion: 'reduce' })` + initial visibility check | same | Wave 0 |

**Test type distribution:**
- Source-level grep (fs.readFileSync + regex): ~12 assertions — sub-second, deterministic
- DOM-level Playwright browser: ~20 assertions — 5–30s each, requires dev server
- Manual (VL-04 negative space): 1 measurement, documented in PLAN.md as checkpoint:human-verify gate

### Sampling Rate
- **Per task commit:** `npx playwright test tests/phase-34-visual-language-subpage.spec.ts -g "VL-06"` (or whichever req the task addresses) — 10–60 seconds
- **Per wave merge:** `npx playwright test tests/phase-34-visual-language-subpage.spec.ts` — 2–5 minutes for full Phase 34 spec
- **Phase gate:** `npx playwright test` full suite green + manual VL-04 screenshot verification before `/pde:verify-work`

### Wave 0 Gaps
- [ ] `tests/phase-34-visual-language-subpage.spec.ts` — entire test file does not exist yet; Wave 0 must create it with RED state (all tests fail before implementation)
- [ ] No visual regression infrastructure — `@percy/playwright` or similar NOT installed; Phase 34 relies on Playwright DOM assertions + manual screenshot review for VL-04
- [ ] No existing test imports `GhostLabel` selector — Wave 0 must decide a data attribute (`[data-ghost-label]`?) and add it to `components/animation/ghost-label.tsx` OR rely on `.sf-display` + `aria-hidden` + text content match

**Framework install:** None — Playwright 1.x already in devDependencies, config already exists.

## Sources

### Primary (HIGH confidence)
- `components/animation/ghost-label.tsx` — 22 lines, verified ghost label component exists with `clamp(200px, 25vw, 400px)` sizing, `pointer-events-none select-none`, `aria-hidden`, no callers
- `components/layout/section-indicator.tsx` — 139 lines, verified IntersectionObserver pattern, `role="navigation"`, `aria-current`, discovery via `[data-section]` + `[data-section-label]`
- `components/layout/nav.tsx` — 168 lines, verified ScrollTrigger nav-reveal at lines 73–108, existing reduced-motion branch, existing homepage detection via `[data-entry-section]`
- `components/blocks/token-tabs.tsx` — 630 lines, verified 7 tabs (4 in SP-02 scope), `useSessionState` state, COLOR/SPACING/TYPE/MOTION data arrays
- `components/blocks/api-explorer.tsx` — 807 lines, verified 3-panel grid, data-driven `API_DOCS` via `DataDrivenDoc`, `HudTelemetry` sub-component, 7 GSAP effects in one useEffect, keyboard navigation via `ALL_NAV_IDS`
- `app/init/page.tsx` — 391 lines, verified `STEPS` array shape, `CodeBlock` helper, `NEXT_CARDS`/`CHECKLIST`/`COMMUNITY BAND` blocks to be removed
- `app/system/page.tsx` — 53 lines, verified page chrome and current h1 `clamp(60px, 9vw, 100px)` at line 27
- `app/reference/page.tsx` — 26 lines, verified thin wrapper around `APIExplorer`
- `app/page.tsx` — verified `SectionIndicator` import + single consumer at line 91
- `app/globals.css:468–475` — verified `.sf-nav-hidden` / `.sf-nav-visible` CSS classes exist
- `app/globals.css:1352, 1374, 1377` — verified 3 raw `var(--color-primary)` uses in scanline/progress patterns
- `playwright.config.ts` — verified Playwright setup, chromium-only, no webServer auto-start
- `tests/phase-30-homepage.spec.ts` and `tests/phase-33-inventory-acquisition.spec.ts` — verified test pattern: `fs.readFileSync` + `page.goto` + `page.locator`
- `.planning/phases/34-visual-language-subpage-redesign/34-CONTEXT.md` — full user decisions loaded verbatim
- `.planning/REQUIREMENTS.md` — VL-01..06, SP-01..05 descriptions loaded
- `.planning/STATE.md` — v1.5 progress + phase map loaded
- `CLAUDE.md` — design rules, hard constraints, stabilization scope loaded

### Secondary (MEDIUM confidence)
- Magenta occurrence counts per file — ripgrep aggregate, individual line numbers spot-checked not file-by-file

### Tertiary (LOW confidence)
- None — Phase 34 is entirely in-project research, no external library docs needed, no WebSearch conducted

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — zero new deps, all files inspected
- Architecture patterns: HIGH — extraction target code read verbatim from `components/layout/nav.tsx:73–108`
- Pitfalls: HIGH — derived from direct code inspection (IntersectionObserver deps loop at line 64, keyboard nav at 427–461, CSS class contract at 468–475)
- TokenTabs shape: HIGH — file read up to line 630
- APIExplorer shape: HIGH — file read up to line 807, all 7 GSAP effects identified
- Init STEPS shape: HIGH — entire 391-line file read
- Magenta baseline: HIGH — ripgrep counts verified per file
- Section indicator consumers: HIGH — grep returns single consumer in `app/page.tsx`
- Validation architecture: HIGH — inherits existing Playwright infrastructure, no new tools

**Research date:** 2026-04-08
**Valid until:** 2026-05-08 (30 days — stable, in-project only, no external deps to drift)
