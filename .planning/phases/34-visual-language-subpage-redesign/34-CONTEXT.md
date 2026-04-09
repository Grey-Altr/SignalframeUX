# Phase 34: Visual Language + Subpage Redesign — Context

**Gathered:** 2026-04-08
**Status:** Ready for planning
**Mode:** Auto (recommended defaults selected for all gray areas)

<domain>
## Phase Boundary

Phase 34 is the **visual finishing pass** that completes the v1.5 transformation from "well-structured site" into "designed artifact". Two parallel tracks of work, both anchored to the visual language defined by the DU/TDR/Brody/Owens lineage:

1. **Visual Language pass (site-wide)** — Deploy ghost labels as architectural elements, replace the dot-based section indicator with a coded HUD readout, audit display type moments and magenta accent usage, and extract a shared nav-reveal pattern.

2. **Subpage redesign (3 pages)** — `/system` becomes specimen-style visual diagrams. `/init` becomes a boot-sequence walkthrough. `/reference` becomes a schematic API index. All three share the redesigned nav-reveal pattern from Phase 30.

**What this phase does NOT do:**
- Does not rebuild homepage sections (Phases 30–33 are locked)
- Does not redesign `/inventory` (Phase 33 already shipped its specimen-style table)
- Does not perform Lighthouse / bundle audits (Phase 35)
- Does not add new components or expand the token system (CLAUDE.md hard constraint)

**Phase order within Phase 34:** Visual language pass first (34-01) — it produces the shared HUD indicator, nav-reveal hook, and ghost-label deployment pattern that all three subpage redesigns consume. Subpage redesigns (34-02/03/04) follow in any order.

</domain>

<decisions>
## Implementation Decisions

### VL — Section Indicator: replace, not patch (VL-06)

**LOCKED.** The current `components/layout/section-indicator.tsx` is a vertical dot rail with `+`-shaped endpoints. VL-06 explicitly rejects "decorative or generic nav dot styling". Replacing with a HUD readout component is required, not optional.

**Replacement spec:**
- File: `components/layout/section-indicator.tsx` (replace contents — keep filename so all imports work)
- Format: monospaced coded labels matching INVENTORY nomenclature register — `[01//ENTRY]`, `[02//THESIS]`, `[03//PROOF]`, `[04//INVENTORY]`, `[05//SIGNAL]`, `[06//ACQUISITION]`
- Position: vertical right edge (preserve current viewport anchor — zero layout disruption)
- Active state: background fill (foreground at 10–15% opacity) under the active row, NOT a color change to magenta — VL-05 magenta budget is reserved for higher-impact moments
- Inactive: muted-foreground at small text scale (`var(--text-2xs)` 9px monospace)
- Hover: full foreground, no scale animation (DU hard-cut register)
- Discovery pattern preserved: same `[data-section]` / `[data-section-label]` attribute reading via IntersectionObserver
- Hidden on mobile (preserve `hidden md:flex` behavior)
- ARIA: keep current `role="navigation"`, `aria-current`, `aria-label` semantics

**Numbering source:** Read the index of each section in DOM order (0-indexed → 01-padded display). Do not hardcode names — labels still come from `data-section-label`.

### VL — Ghost label deployment (VL-01)

**LOCKED.** `GhostLabel` component already exists at `components/animation/ghost-label.tsx` and renders at `clamp(200px, 25vw, 400px)`. Phase 34 deploys it.

**Deployment locations (at least 5 — VL-01 minimum is 2):**

| Location | Text | Notes |
|----------|------|-------|
| `/system` page header background | `TOKENS` or `SYSTEM` | Behind h1, low contrast |
| `/init` page header background | `INIT` or `BOOT` | Behind h1, low contrast |
| `/reference` page header background | `API` or `REF` | Behind h1, low contrast |
| Homepage THESIS section background | `THESIS` or `MANIFESTO` | Anchored behind manifesto phrases (works with Phase 31 pinned scroll) |
| Homepage INVENTORY section background | `INVENTORY` or `CATALOG` | Anchored behind the monospaced row table |

**Critical:** Ghost labels are *structural elements positioned with intent*, not background decoration. They must be:
- Placed in the layout grid (e.g. negative-margin offset to a column edge), not centered as wallpaper
- Slightly bleeding off the viewport edge — the eye should read them as the room's architecture
- 3–5% opacity max — but the form should still be readable, not vanishing
- `pointer-events: none`, `aria-hidden`, `select-none` (already in component)

**Ghost label test (from VL-01):** "Could you remove this ghost label and lose part of the layout's structure?" Must be **yes**. If the layout works without it, the placement is wallpaper, not architecture — reposition.

### VL — Display type audit (VL-02)

**LOCKED.** VL-02 requires display type moments at 120px+ in **at least 3 locations**. Phase 34 verifies coverage and bumps subpage headers to comply.

**Sanctioned 120px+ moments (target ≥5, requirement ≥3):**

| Location | Element | Current size | Target |
|----------|---------|--------------|--------|
| Homepage ENTRY | `SIGNALFRAME//UX` | 120px+ ✓ | (verify) |
| Homepage THESIS | Phrase moments (Phase 31 work) | 80px+ TH-03 | Bump to 120px+ on ≥1 statement |
| `/system` h1 | `TOKEN EXPLORER` | clamp(60px, 9vw, 100px) | clamp(80px, 12vw, 160px) |
| `/init` h1 | `INITIALIZE` (boot sequence header) | (varies) | clamp(80px, 12vw, 160px) |
| `/reference` h1 | `API REFERENCE` | (no h1 currently) | NEW: clamp(80px, 12vw, 160px) |
| `/inventory` h1 | `COMPONENTS` | clamp(60px, 9vw, 120px) | (already meets — verify) |

**Note:** `/inventory` h1 says "COMPONENTS" but Phase 33 renamed the route from `/components`. Audit copy: should it say `INVENTORY` instead? Resolve in 34-01 implementation. *(Confirmed acceptable to update copy as part of visual language pass — out-of-scope creep guard: only the h1 string, not page restructure.)*

### VL — Magenta accent audit (VL-05)

**LOCKED.** VL-05 caps magenta usage at ≤5 distinct moments per page. Currently `--color-primary` (oklch(0.65 0.3 350)) is used in 20+ CSS rules in `globals.css`.

**Audit method:**
1. For each page (`/`, `/system`, `/init`, `/reference`, `/inventory`), grep for `text-primary`, `bg-primary`, `border-primary`, `--color-primary`, and visual usage
2. Identify 5 "sanctioned" magenta moments per page — the highest-impact uses
3. Replace lower-impact uses with `secondary`, `muted-foreground`, or `foreground/60`
4. Document the sanctioned 5 in 34-01-PLAN.md so future work doesn't drift

**Sanctioned moment criteria:** Must be load-bearing — replacing it with neutral would break the visual hierarchy or remove a deliberate punctuation moment. Examples: ENTRY title accent stroke, focus rings, active section highlight in HUD indicator, active filter chip on /inventory, copy-success feedback.

**Out of scope:** Do not modify the OKLCH primary token value itself. Do not introduce new accent colors. Reduce frequency only.

### VL — Negative space verification (VL-04)

**LOCKED.** VL-04 requires ≥40% intentional void in THESIS and SIGNAL sections. Phase 31 (THESIS) and Phase 32 (SIGNAL) were designed to meet this.

**Phase 34 work:** verification pass only.
- Visual measurement during 34-01 review (eyeball + screenshot grid overlay)
- Rework only if measurement fails
- If THESIS/SIGNAL don't meet 40%, file as a Phase 34 task; if they do meet, mark VL-04 complete and move on

Do not redo Phase 31/32 work on aesthetic instinct — only on measured evidence.

### VL — Nav reveal pattern: extract as shared hook (SP-05)

**LOCKED.** Phase 30 implemented nav-hide-until-scroll for the homepage (ENTRY → THESIS boundary triggers reveal). SP-05 requires the same pattern on subpages (hidden on initial viewport, sticky on scroll past header).

**Implementation:**
- Extract the homepage nav reveal logic into a reusable hook: `hooks/use-nav-reveal.ts` — accepts a trigger element ref and configures GSAP ScrollTrigger to flip `--nav-visible` (or equivalent body data attribute)
- Homepage uses it with the ENTRY section as trigger
- Subpages use it with their h1/header element as trigger — nav appears once the page header scrolls out of view
- Nav itself stays in `components/layout/nav.tsx` — only the reveal trigger varies
- Reduced-motion path: nav is visible immediately (no scroll-tied animation)

**Why a hook, not a prop on Nav:** keeps Nav itself dumb (Server/Client boundary stays clean), centralizes the behavior so subpage rewrites in 34-02/03/04 don't each reimplement it.

### SP-01/02 — /system: differentiated specimen-per-token

**LOCKED.** Each token category gets a visual treatment that matches what it represents — not a single grid layout for all of them. Honors tDR maximum-minimalism and Ikeda data-as-material register.

**Treatments:**
- **Spacing scale** — physical ruler/grid specimen. Each spacing stop (4/8/12/16/24/32/48/64/96) shown as a horizontal bar with labeled measurement. Side-by-side proportional comparison. Inspired by architectural drawings.
- **Type scale** — type specimen sheet. Each scale step shown as a sample word/character at full size with metadata callouts (px/rem/usage). Inspired by Brody/Fuse type specimen pages.
- **Color palette** — OKLCH swatch matrix. Each token shown as a swatch with its OKLCH values displayed in monospace, axis labels (L/C/H) on the side. Visualizes the perceptual structure of the palette.
- **Motion tokens** — timing curve diagram. Each duration/easing token rendered as a small SVG curve plot with the timing value labeled. Shows the *shape* of the motion, not just the number.

**Architecture:**
- Keep `components/blocks/token-tabs.tsx` (630 LOC) as the data layer — it has the token data, copy-to-clipboard wiring, and tab structure
- Replace each tab's render body with a new specimen sub-component
- New components: `components/blocks/token-specimens/spacing-specimen.tsx`, `type-specimen.tsx`, `color-specimen.tsx`, `motion-specimen.tsx`
- TokenTabs becomes a thin orchestrator that switches between the 4 specimens
- Old table-style render is REPLACED, not preserved alongside

**No card layout. No tables for spacing/type/color.** The specimens ARE the design.

### SP-03 — /init: boot-sequence walkthrough

**LOCKED.** `/init` already has a 5-step `STEPS` data structure (`app/init/page.tsx`). Phase 34 reframes the visual presentation as a system bringup sequence — keeps the data, swaps the register.

**Reframing:**
- Step labels stay numbered: `01 INSTALL` → `02 INITIALIZE` → `03 USE_COMPONENTS` → `04 ACTIVATE_FRAME` → `05 DEPLOY`
- Each step gets a coded indicator: `[01//INIT]`, `[02//HANDSHAKE]`, `[03//LINK]`, `[04//TRANSMIT]`, `[05//DEPLOY]` *(decode: install→init, initialize→handshake, use→link, activate→transmit, deploy→deploy)*
- Single column dense monospaced sequence — no cards, no rounded surfaces, no "Get Started" button at the bottom
- Vertical rule between steps (1px foreground/15)
- Step number at large display size (sf-display, 80px+) on the left of each step
- Description in monospaced uppercase, tracking-tight
- Code block per step retains shared-code-block component
- Bottom of page: terminal-style coded line (e.g. `[OK] SYSTEM READY` or `[EXIT 0]`) — not a "next steps" CTA

**Test:** "Would someone reading this feel they're following an onboarding flow or running a bringup sequence?" Must be **bringup sequence**. If it reads like a marketing tutorial, the register is wrong.

### SP-04 — /reference: schematic API index

**LOCKED.** `/reference/page.tsx` is currently a 26-line wrapper around `APIExplorer` (807 LOC). Most work happens in `components/blocks/api-explorer.tsx`.

**Schematic spec:**
- Page header added: h1 `API REFERENCE` at clamp(80px, 12vw, 160px), stat callout right-aligned (count of API surfaces — components / hooks / tokens)
- APIExplorer redesigned as a grouped index:
  - Grouped by surface type: **COMPONENTS** / **HOOKS** / **TOKENS** (3 sections)
  - Each entry row: monospaced type signature inline (e.g. `SFButton(props: SFButtonProps): ReactNode`)
  - Click entry to expand body — props table as a data sheet (column-aligned monospace), not a cards layout
  - Search/filter input at top stays
- Visual register: schematic, dense, no decorative spacing — fills the viewport with information density
- Color: foreground + muted-foreground only, magenta reserved for active row/expanded state highlight
- Zero rounded surfaces

**Architecture preservation:**
- APIExplorer's data structure stays — restyle the render layer
- Pre-computed syntax highlighting from `lib/code-highlight` stays
- Preserve any keyboard navigation and ARIA semantics already in APIExplorer
- Do not introduce new search/filter dependencies

### Plan structure — 4 plans

**LOCKED.** Phase 34 splits into 4 plans:

| Plan | Scope | Requirements |
|------|-------|--------------|
| **34-01** | Visual language pass: replace SectionIndicator with HUD, deploy GhostLabel to 5 locations, audit display type (bump subpage h1s), audit magenta usage, extract `useNavReveal` shared hook, verify negative space | VL-01, VL-02, VL-04, VL-05, VL-06 |
| **34-02** | `/system` specimen redesign: 4 specimen sub-components replacing TokenTabs render bodies; consume `useNavReveal` | SP-01, SP-02, SP-05 (partial) |
| **34-03** | `/init` boot-sequence redesign: visual reframing of existing STEPS data structure; consume `useNavReveal` | SP-03, SP-05 (partial) |
| **34-04** | `/reference` schematic redesign: page header + APIExplorer schematic restyle; consume `useNavReveal` | SP-04, SP-05 (partial) |

**Order:** 34-01 must ship first (provides the shared hook and HUD component all subpages consume). 34-02/03/04 can ship in any order or in parallel.

### Out of scope / scope creep guards

**The following are NOT Phase 34 work and must be redirected:**
- Adding new components, tokens, or animation effects (CLAUDE.md hard constraint)
- Redesigning `/inventory` (Phase 33 shipped — its h1 string is the only allowed change)
- Modifying homepage sections beyond the visual language overlay (HUD indicator, ghost label background, magenta audit)
- Modifying `--color-primary` token value (palette is frozen in v1.0)
- Adding new pages or routes (v1.5 milestone scope is fixed)
- Lighthouse / bundle measurements (Phase 35)
- Mobile responsive rework beyond what subpage redesigns naturally require

**When these come up during implementation:** add to deferred section, do not act on.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Spec
- `.planning/ROADMAP.md` §Phase 34 (lines 445–462) — Goal, dependencies, success criteria 1–9
- `.planning/REQUIREMENTS.md` §Visual Language (VL-01..06) and §Subpage Redesign (SP-01..05) — full requirement statements

### Project Constraints
- `CLAUDE.md` — Tech stack, design philosophy (Enhanced Flat Design, DU/TDR), token system (tiered colors, blessed spacing), hard constraints (zero border-radius, no new components/tokens, commit before changes)
- `.planning/PROJECT.md` — v1.5 milestone goals, locked decisions, current shipped state

### Prior Phase Context (decisions that flow into Phase 34)
- `.planning/phases/30-homepage-architecture-entry-section/30-CONTEXT.md` — Nav reveal ScrollTrigger pattern (D-12..D-15), hard-cut transitions, section landmark architecture, `data-bg-shift` system, GhostLabel exists but unused at this point
- `.planning/phases/31-thesis-section/31-CONTEXT.md` — THESIS pinned scroll architecture (200vh), display type moments, negative space design intent (VL-04 input)
- `.planning/phases/32-signal-proof-sections/32-CONTEXT.md` — SIGNAL section atmospheric design, scrub/parallax timing (VL-04 input)
- `.planning/phases/33-inventory-acquisition-sections/33-CONTEXT.md` — Coded nomenclature register (SF//FRM-001 format, foundation for HUD `[01//ENTRY]` format), monospaced row table aesthetic, ACQUISITION instrument-panel discipline

### Codebase Anchors (existing files Phase 34 modifies/replaces)

**Visual language assets:**
- `components/animation/ghost-label.tsx` — EXISTING component, currently has zero callers; Phase 34 deploys it to 5 locations
- `components/layout/section-indicator.tsx` — REPLACE contents (keep filename); currently dot-based, Phase 34 makes it HUD-coded
- `components/layout/nav.tsx` — Nav component; nav-reveal logic gets extracted to shared hook
- `app/globals.css` — Token source of truth; magenta audit may touch CSS rules but NOT token values
  - Line 47: `--color-primary: oklch(0.65 0.3 350)` (DO NOT MODIFY)
  - Lines 110, 140, 186-188: typography, layout token references
  - 20+ rules use `var(--color-primary)` — audit candidates for VL-05

**Subpage targets:**
- `app/system/page.tsx` (53 LOC) — page chrome, hosts TokenTabs
- `components/blocks/token-tabs.tsx` (630 LOC) — token data + tab logic; KEEP data layer, REPLACE render bodies
- `app/init/page.tsx` (391 LOC) — has STEPS data structure to preserve, visual register to reframe
- `app/reference/page.tsx` (26 LOC) — thin wrapper, gets new page header
- `components/blocks/api-explorer.tsx` (807 LOC) — schematic redesign target
- `app/inventory/page.tsx` — Phase 33 territory; only h1 string update allowed in 34-01

**Layout primitives (consumed, not modified):**
- `components/sf/index.ts` — SFSection, SFContainer, SFStack, etc.
- `components/layout/breadcrumb.tsx` — used by all subpages
- `components/layout/footer.tsx` — used by all subpages
- `lib/gsap-core.ts`, `lib/gsap-plugins.ts` — GSAP ScrollTrigger imports for the nav-reveal hook

### Design Intelligence (cdSB wiki — register and lineage)

**MANDATORY for "could this exist in a 2026 consumer app?" calibration:**
- `wiki/analyses/culture-division-operating-principles.md` — Operating principles
- `wiki/analyses/frame-signal-intellectual-lineage.md` — FRAME/SIGNAL theory (Shannon, Goffman, Wiener, etc.)
- `wiki/sources/brando-corp-symbols.md` — Imaginary corporation typographic register; informs HUD coded labels
- `wiki/concepts/liquid-glass.md` + `wiki/sources/liquid-glass-resource.md` — The 2026 consumer counter-aesthetic; every Phase 34 visual decision is a formal opposition
- `wiki/sources/studio-kloroform-space1.md` — Particle-field astronomical forms; reference for ghost label "structural element" treatment
- DU (Detroit Underground) lineage — VHS channel-switch hard cuts, idle grain, "slightly tense" register
- tDR (The Designers Republic) lineage — maximum-minimalism, total design, coded naming
- Ikeda lineage — data-as-material, perception thresholds, scientific instrument register
- Brody/Fuse lineage — type specimen sheets (input for SP-01/02 type specimen)
- Owens lineage — brutalist romanticism, truth to materials, exposed construction (input for /reference schematic register)

### Quality Tests (apply during 34-01 review and per-subpage review)

- **HUD test:** "Does the section indicator look like a system readout (instrument panel) or like a website nav widget?" — Must read as instrument panel.
- **Ghost label test:** "Could you remove this ghost label and lose part of the layout's structure?" — Must be **yes**. If layout works without it, the placement is wallpaper.
- **Liquid Glass test:** "Could `/system`, `/init`, or `/reference` exist in an Apple-adjacent consumer product?" — Must be **no**. Magenta, monospace density, and zero-radius edges should make it impossible.
- **/init test:** "Does this read like an onboarding flow or like a system bringup sequence?" — Must be bringup sequence. "Get Started" energy = wrong.
- **/reference test:** "Does this read like API documentation for engineers, or like a marketing 'features page'?" — Must be engineer doc.
- **/system test:** "Would a typographer or color scientist look at the specimens and recognize them as proper specimens?" — Must be yes.
- **Density test:** "Could you add 20% more rows/items without the layout feeling overcrowded?" — Must be yes. The pages should feel like they have room for infinity.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`GhostLabel`** (`components/animation/ghost-label.tsx`) — Already exists, zero callers. Renders Anton display at clamp(200px, 25vw, 400px), opacity-controlled via parent CSS, pointer-events-none, aria-hidden. Phase 34 deploys it.
- **`SFSection`** + section landmark system — `data-section`, `data-section-label`, `data-bg-shift` attributes already wire all sections; HUD indicator reads from these without DOM contract changes.
- **`useSessionState`** + GSAP/ScrollTrigger infrastructure (Phase 29 hardened) — No new dependencies needed for nav-reveal hook.
- **`SFSection` `bgShift` prop** typed `"white" | "black"` (v1.2) — Available for subpage backgrounds if needed.
- **`shared-code-block.tsx`** — Pre-highlighted server-side code block; consumed by /init and may be needed in /reference body.
- **`COMPONENT_REGISTRY`** (`lib/component-registry.ts`) — 54 entries with `sfCode`, `category`, `layer`, `pattern`; useful for /reference grouping.
- **`highlight()`** from `lib/code-highlight` — Server-side syntax highlighting; preserved across all redesigns.
- **`Breadcrumb`** component — Already used by all subpages; visual register may need a small update to match new page headers but no API change.

### Established Patterns
- Server Components default for `page.tsx`; `'use client'` only on interactive children (preserve)
- `next/dynamic` with `ssr: false` for WebGL components (no Phase 34 implications — no new WebGL)
- GSAP ScrollTrigger as the only motion library (PF-05 hard rule)
- `data-cursor` attribute on `<main>` for canvas cursor activation (preserve on all subpages)
- `mt-[var(--nav-height)]` on `<main>` to clear fixed nav (preserve, but verify behavior with new nav-reveal pattern — nav-height var must still be set even when nav is hidden)
- IntersectionObserver pattern (already used in current SectionIndicator) for active-state tracking — reuse in new HUD component
- Coded nomenclature `SF//[CAT]-NNN` from Phase 33 — extends to HUD `[NN//SECTION]` format

### Integration Points
- `app/page.tsx` — homepage; new HUD indicator drops in via existing import path; ghost labels added to THESIS and INVENTORY section markup
- `app/system/page.tsx` — replace TokenTabs render bodies (file size will grow modestly), add ghost label to header, bump h1 size, consume nav-reveal hook
- `app/init/page.tsx` — restructure JSX around existing STEPS data, add coded indicators per step, ghost label to header, consume nav-reveal hook
- `app/reference/page.tsx` — add page header, ghost label, consume nav-reveal hook; APIExplorer block does the heavy lift
- `components/blocks/api-explorer.tsx` — schematic redesign of internal layout
- `components/blocks/token-tabs.tsx` — render bodies replaced, data layer preserved
- `hooks/use-nav-reveal.ts` — NEW file (the only new file outside specimen sub-components)
- `components/blocks/token-specimens/` — NEW directory with 4 specimen sub-components

### Bundle Awareness
- Phase 35 enforces ≤150 KB shared JS gzip
- Phase 34 should not introduce new client-side dependencies
- `useNavReveal` adds negligible weight (small hook around existing GSAP)
- Token specimen sub-components are static — may be Server Components if no interactive state needed
- API explorer redesign restyles existing client component — bundle delta should be near zero

</code_context>

<specifics>
## Specific Implementation Notes

### HUD section indicator — implementation sketch

```tsx
// New shape (preserve filename: components/layout/section-indicator.tsx)
// Replaces vertical dot rail with coded readout list

<nav className="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 ... font-mono">
  {sections.map((s, i) => {
    const code = `[${String(i + 1).padStart(2, "0")}//${s.label.toUpperCase()}]`
    const isActive = i === activeIndex
    return (
      <button
        key={s.id}
        onClick={() => scrollTo(i)}
        className={cn(
          "block px-2 py-1 text-[var(--text-2xs)] uppercase tracking-[0.1em]",
          isActive
            ? "bg-foreground/12 text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
        aria-current={isActive ? "true" : undefined}
      >
        {code}
      </button>
    )
  })}
</nav>
```

Active state uses background fill (foreground/12), NOT a magenta color change — magenta budget is reserved.

### Nav reveal hook — interface sketch

```ts
// hooks/use-nav-reveal.ts (NEW)
export function useNavReveal(triggerRef: RefObject<HTMLElement>) {
  // GSAP ScrollTrigger: when triggerRef bottom passes viewport top,
  // flip body[data-nav-visible] from "false" to "true".
  // Reduced-motion: set "true" immediately, no scroll observer.
  // Cleanup ScrollTrigger on unmount.
}
```

Nav itself reads `body[data-nav-visible]` via CSS to flip `visibility`/`opacity` (hard-cut, no fade).

### Specimen sub-components — file structure

```
components/blocks/token-specimens/
  spacing-specimen.tsx     # Ruler/grid bars, blessed stops 4..96
  type-specimen.tsx        # Type sample sheet, 2xs..4xl
  color-specimen.tsx       # OKLCH swatch matrix with L/C/H labels
  motion-specimen.tsx      # SVG curve plots for durations + easings
```

Each specimen is a Server Component if it has no interactive state. TokenTabs (client) imports them and renders the active one.

### Magenta audit checklist (per page)

1. `grep -n "text-primary\|bg-primary\|border-primary" app/[page]/page.tsx` and child blocks
2. Identify the visual moment for each match
3. Score each: load-bearing (keep) vs decorative (replace)
4. Replace decorative uses with `text-foreground`, `text-muted-foreground`, `border-foreground/30`
5. Verify count ≤ 5 sanctioned moments
6. List the 5 sanctioned moments in PLAN.md so future drift is detectable

### THESIS / SIGNAL negative space verification

Visual measurement only — do not refactor unless evidence demands it.
1. Screenshot each section at 1440×900
2. Overlay a 10% grid
3. Count cells with no glyph/element vs total
4. Pass: ≥40% empty cells
5. Fail: file as Phase 34 work item, do not silently extend phase

### `/inventory` h1 string update

Phase 33 left `<h1>COMPONENTS</h1>` and `<strong>340</strong>` while the route is `/inventory` and the registry has 54 items. Update during 34-01:
- h1: `INVENTORY` (split as `INVE`/`NTORY` to match the existing line-break aesthetic)
- Stat: `54` not `340`
- Subtitle copy: revisit if it still says "FRAME + SIGNAL PRIMITIVES // FOR EVERY SURFACE" — likely keep, possibly update count language

This is a string change only, NOT a Phase 33 redo.

</specifics>

<deferred>
## Deferred Ideas

- **JFM multilingual flourishes** — Katakana/Farsi/Mandarin display moments. Originally part of homepage Hero (Phase 30 deferred to 34). Could become SIGNAL-layer detail in v2 localization milestone, but adding it now risks Phase 34 scope creep. **Confirm with grey before adding** — currently NOT in Phase 34 scope.
- **`useNavReveal` reduced-motion edge cases** — Lenis interaction with first-load nav state when user has scroll-restored mid-page. Investigate during 34-01 implementation; may produce a small follow-up.
- **`/inventory` page deeper redesign** — Phase 33 row table is the design; only the h1 string update is sanctioned in Phase 34. Any deeper rework belongs in a v2 catalog phase.
- **Custom font loading audit on subpages** — If subpage h1 bumps reveal Anton/Inter font swap CLS, file as Phase 35 (Performance + Launch Gate) — not Phase 34.
- **Specimen interactivity** — Token specimens could be made interactive (hover to copy value, click to see usage examples). Phase 34 ships static specimens; interactivity is a v1.6+ enhancement.
- **APIExplorer search improvements** — Schematic restyle preserves existing search, doesn't enhance it. Search ranking / fuzzy matching = future work.
- **Section indicator on mobile** — Currently `hidden md:flex`. New HUD readout could be condensed for mobile (e.g. bottom horizontal bar) but not in Phase 34.
- **Light mode subpage audit** — Subpage redesigns target dark mode primary. Light mode parity verification = Phase 35.

</deferred>

---

*Phase: 34-visual-language-subpage-redesign*
*Context gathered: 2026-04-08 (auto mode — recommended defaults selected for all gray areas)*
*All gray areas resolved. Ready for `/pde:plan-phase 34`.*
