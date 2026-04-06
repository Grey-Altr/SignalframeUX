# Phase 5: DX Contract & State — Research

**Researched:** 2026-04-05
**Domain:** Developer experience documentation, JSDoc authoring, GSAP/theme toggle guard
**Confidence:** HIGH (codebase is fully readable; no external library research required for core tasks)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- Scaffolding spec as `docs/SCAFFOLDING.md` — file structure, CVA shape, barrel export pattern, required props, data attributes
- JSDoc on all SF-wrapped components — one JSDoc block per exported function with usage example
- Import boundary documented in SCAFFOLDING.md: `sf/` = FRAME, `animation/` = SIGNAL, data attributes bridge them. No runtime enforcement.
- DX-04 (registry.json): defer to post-v1.0
- DX-05 (API foundation — createSignalframeUX/useSignalframe): defer to post-v1.0
- STP-01 (session state persistence): defer to post-v1.0
- All deferred items documented in DX-SPEC.md with interface sketches for future implementation
- Transition buffer: `sf-no-transition` class applied during toggle, removed after 2 rAF ticks (existing pattern in lib/theme.ts) — NO change to the mechanism, only audit/fix OKLCH/inline color conflicts
- Audit and fix OKLCH/inline color conflicts between GSAP inline styles and theme CSS variable changes

### Claude's Discretion

- JSDoc copy and usage example specifics
- SCAFFOLDING.md structure and section organization
- DX-SPEC.md interface sketch detail level
- Specific GSAP properties that need theme toggle guards

### Deferred Ideas (OUT OF SCOPE)

- DX-04: registry.json distribution surface — post-v1.0
- DX-05: createSignalframeUX(config) + useSignalframe() hook — post-v1.0
- STP-01: Session state persistence (filters, scroll, tabs) — post-v1.0
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DX-01 | SF component scaffolding spec documented — file structure, CVA shape, barrel export pattern, required props, data attributes | Canonical pattern extracted from sf-button + sf-container + sf-text; barrel from index.ts |
| DX-02 | FRAME/SIGNAL import boundary explicit — `sf/` = FRAME, `animation/` = SIGNAL, data attributes bridge them | Layer separation fully visible in codebase; `[data-anim]` bridge pattern confirmed |
| DX-03 | Per-component JSDoc with usage example on all SF-wrapped components | Zero existing JSDoc on exported functions (only one inline comment in sf-card.tsx); 28 components need blocks |
| DX-04 | `registry.json` distribution surface — DEFERRED | Document interface sketch in DX-SPEC.md only |
| DX-05 | API architecture foundation — DEFERRED | Document interface sketch in DX-SPEC.md only |
| STP-01 | Session state persistence — DEFERRED | Document interface sketch in DX-SPEC.md only |
| STP-02 | Theme toggle GSAP guard — audit OKLCH/inline color conflicts | `sf-no-transition` mechanism confirmed correct; color-cycle-frame.tsx uses `style.setProperty` on `--color-primary`; hero-mesh uses hardcoded rgba on canvas — both are conflict surfaces |
</phase_requirements>

---

## Summary

Phase 5 is a documentation and guard phase — no new components, no new tokens. The work divides into three tracks: (1) write `docs/SCAFFOLDING.md` covering the canonical SF pattern and import boundary (DX-01, DX-02), (2) add JSDoc blocks to all 28 exported SF component functions (DX-03), and (3) audit + fix the theme toggle / GSAP color conflict surface (STP-02). Three requirements (DX-04, DX-05, STP-01) are deferred and land as interface sketches in `.planning/DX-SPEC.md`.

The codebase has a single canonical SF pattern (CVA + `cn()` + `forwardRef` + barrel export) that is consistent across all 28 components. JSDoc coverage is currently zero — only one inline comment exists in `sf-card.tsx`. The `docs/` directory does not yet exist and must be created.

The theme toggle guard (`sf-no-transition`) is already correctly implemented in `lib/theme.ts`. The only real conflict surface is `color-cycle-frame.tsx`, which mutates `--color-primary` directly via `document.documentElement.style.setProperty`. The `hero-mesh` canvas uses hardcoded `rgba(255,255,255,...)` which is theme-neutral (canvas does not respond to CSS variables) and requires no guard. GSAP opacity mutations in `vhs-overlay.tsx` are not color-bearing and do not conflict with OKLCH theme tokens.

**Primary recommendation:** Ship Phase 5 in two waves — Wave 1: docs creation (SCAFFOLDING.md + DX-SPEC.md stubs), Wave 2: JSDoc sweep (28 components) + STP-02 guard audit.

---

## Standard Stack

### Core (already in project — no new installs)

| Tool | Version | Purpose | Role in Phase 5 |
|------|---------|---------|-----------------|
| TypeScript JSDoc | — | Inline API documentation | DX-03: one block per exported function |
| CVA (`class-variance-authority`) | in use | Variant props | Reference in SCAFFOLDING.md canonical pattern |
| `cn()` from `lib/utils.ts` | in use | Class merging | Reference in SCAFFOLDING.md |
| `React.forwardRef` | in use | Ref forwarding | Required in scaffolding spec |
| `lib/theme.ts` `toggleTheme` | in use | Hard-cut theme switch | STP-02 audit target |

### No new dependencies required.

---

## Architecture Patterns

### Canonical SF Component Pattern (DX-01 reference)

This is the authoritative shape extracted from the codebase. SCAFFOLDING.md documents exactly this.

**Three sub-patterns exist:**

**Pattern A — Radix-based wrapper** (majority: SFButton, SFCard, SFInput, etc.)
```typescript
// sf-button.tsx
import { Button } from "@/components/ui/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sfXVariants = cva("...base classes...", {
  variants: {
    intent: { primary: "...", ghost: "...", signal: "..." },
    size: { sm: "...", md: "...", lg: "..." },
  },
  defaultVariants: { intent: "primary", size: "md" },
});

interface SFXProps
  extends Omit<React.ComponentProps<typeof BaseComponent>, "size">,
    VariantProps<typeof sfXVariants> {}

export function SFX({ intent, size, className, ...props }: SFXProps) {
  return (
    <BaseComponent
      className={cn(sfXVariants({ intent, size }), className)}
      {...props}
    />
  );
}
```

**Pattern B — Native element with forwardRef** (layout primitives: SFContainer, SFSection, SFStack, SFGrid)
```typescript
// sf-container.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import React from "react";

const sfContainerVariants = cva("w-full mx-auto px-[var(--gutter-sm)] md:px-[var(--gutter)]", {
  variants: {
    width: {
      wide: "max-w-[var(--max-w-wide)]",
      content: "max-w-[var(--max-w-content)]",
      full: "max-w-[var(--max-w-full)]",
    },
  },
  defaultVariants: { width: "wide" },
});

interface SFContainerProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof sfContainerVariants> {}

const SFContainer = React.forwardRef<HTMLDivElement, SFContainerProps>(
  function SFContainer({ width, className, ...props }, ref) {
    return (
      <div ref={ref} className={cn(sfContainerVariants({ width }), className)} {...props} />
    );
  }
);

SFContainer.displayName = "SFContainer";
export { SFContainer };
```

**Pattern C — Polymorphic forwardRef** (SFText only — `as` prop, `React.Ref<any>` cast)
```typescript
// sf-text.tsx — note the accepted any cast (documented in STATE.md Plan 02-02)
const SFText = React.forwardRef<HTMLElement, SFTextProps>(
  function SFText({ variant, as, className, ...props }, ref) {
    const Tag = as ?? defaultElementMap[variant];
    return (
      <Tag
        ref={ref as React.Ref<any>}
        className={cn(variantClassMap[variant], className)}
        {...(props as React.HTMLAttributes<HTMLElement>)}
      />
    );
  }
);
SFText.displayName = "SFText";
```

### Import Boundary Pattern (DX-02)

```
components/
├── ui/          # shadcn base — DO NOT import directly in consumer code
├── sf/          # FRAME layer — deterministic, stable API, JSDoc'd
│   └── index.ts # Single import point: import { SFButton } from "@/components/sf"
├── animation/   # SIGNAL layer — generative, GSAP-driven, no Radix base
├── blocks/      # Page sections — consume sf/ and animation/
└── layout/      # Nav, footer, chrome

Bridge: [data-anim] attribute — applied in sf/ components, read by animation/ components
```

**Rule:** Consumer code imports from `@/components/sf` (barrel) only. Never from `@/components/ui` directly. Animation components are consumed directly by blocks/pages, not re-exported through sf/.

### JSDoc Block Pattern (DX-03)

One block per exported function/component. Required fields: description, `@param` for variant props, `@example` showing minimal usage.

```typescript
/**
 * Primary action button — FRAME layer interactive primitive.
 *
 * Enforces SF button contract: monospace font, uppercase, 2px border,
 * asymmetric hover timing (100ms in / 400ms out), press transform.
 *
 * @param intent - Visual variant. "primary" | "ghost" | "signal"
 * @param size - Height and padding scale. "sm" | "md" | "lg" | "xl"
 * @param className - Merged via cn() — appended, never replaces base classes
 *
 * @example
 * <SFButton intent="primary" size="md">Launch</SFButton>
 * <SFButton intent="ghost" size="sm" onClick={handleCancel}>Cancel</SFButton>
 */
export function SFButton({ intent, size, className, ...props }: SFButtonProps) {
```

### Theme Toggle Guard Pattern (STP-02)

The guard mechanism in `lib/theme.ts` is correct and does not need to change:

```typescript
// lib/theme.ts — existing, do not modify mechanism
root.classList.add("sf-no-transition");
root.classList.toggle("dark", next);
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    root.classList.remove("sf-no-transition");
  });
});
```

The CSS rule that backs this:
```css
/* globals.css line 800 */
.sf-no-transition,
.sf-no-transition *,
.sf-no-transition *::before,
.sf-no-transition *::after {
  transition: none !important;
  animation-duration: 0.01ms !important;
}
```

**The conflict surface (STP-02 audit target):** `color-cycle-frame.tsx` calls `document.documentElement.style.setProperty("--color-primary", ...)`. This is a CSS variable mutation — it does not conflict with `sf-no-transition` (which suppresses transition animations, not variable reads). This is actually safe as-is: the variable change is instant regardless of transition suppression. The guard is not needed for `setProperty` calls.

**Canvas components (hero-mesh.tsx):** Uses `rgba(255,255,255,...)` hardcoded on a `<canvas>` context. Canvas paint calls do not respond to CSS variable changes or theme class toggles — they render at paint time. No guard needed.

**Conclusion for STP-02:** The existing `sf-no-transition` mechanism fully covers the OKLCH/transition conflict. The audit should confirm no GSAP `gsap.to(el, { color: "oklch(...)" })` calls exist that would hard-code color values competing with CSS variables mid-animation. Grep result confirms: GSAP only mutates `opacity` and `x/skewX` on overlay elements — no color properties. STP-02 audit is a verification task that will likely find no changes required; document the finding.

### SCAFFOLDING.md Structure (DX-01 + DX-02)

```
docs/SCAFFOLDING.md
├── 1. File Structure    — where files live, naming conventions
├── 2. Canonical Pattern — the three sub-patterns with annotated example
├── 3. CVA Shape         — variants object, defaultVariants requirement, intent standard
├── 4. Required Props    — className, cn() merge rule, forwardRef requirement
├── 5. Data Attributes   — data-section, data-section-label, data-bg-shift, data-anim
├── 6. Import Boundary   — sf/ = FRAME, animation/ = SIGNAL, bridge via [data-anim]
└── 7. Barrel Export     — index.ts pattern, named exports only
```

### DX-SPEC.md Structure (deferred items)

```
.planning/DX-SPEC.md
├── DX-04: registry.json — interface sketch, file shape, rationale
├── DX-05: createSignalframeUX + useSignalframe — interface sketch
└── STP-01: Session state persistence — interface sketch, key design
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| JSDoc generation | Custom doc site | Inline TSDoc blocks | Phase 5 scope is authoring only — consumption is a post-v1.0 problem |
| Import enforcement | ESLint custom rule | Documentation only | CONTEXT.md explicitly says "no runtime enforcement" |
| Theme conflict detection | Runtime watcher | Grep audit + documentation | One-time audit, not a recurring problem |

---

## Common Pitfalls

### Pitfall 1: JSDoc on forwardRef components
**What goes wrong:** Placing JSDoc above `const SFContainer = React.forwardRef(...)` works syntactically, but TypeScript language server may not surface it on hover as well as JSDoc above a named function.
**How to avoid:** For Pattern B and C components (forwardRef), place JSDoc above the `const` declaration. Verify IDE hover shows the block. This is cosmetic — the documentation is still correct.
**Evidence:** SFButton (Pattern A, named function) — JSDoc naturally attaches. SFContainer (Pattern B, forwardRef const) — also fine, TypeScript displays it.

### Pitfall 2: JSDoc scope creep
**What goes wrong:** Writing deeply technical JSDoc for every sub-export (e.g., SFCardHeader, SFTabsTrigger) creates noise without value.
**How to avoid:** Full JSDoc block on the primary export (SFCard, SFTabs). One-liner `/** Sub-component of SFCard — renders the card header region. */` on sub-exports. 28 components, but many are compound — count blocks, not files.

### Pitfall 3: SCAFFOLDING.md becoming a style guide
**What goes wrong:** Documentation grows into guidelines ("always do X, never do Y") and loses its function as a scaffolding reference.
**How to avoid:** Keep SCAFFOLDING.md tightly scoped to "how to create a new SF component." Every section answers a concrete construction question. Remove guidance that does not apply to the act of scaffolding.

### Pitfall 4: DX-SPEC.md interface sketches over-specified
**What goes wrong:** Deferred items get spec'd at implementation detail level, locking in decisions that should be made during actual implementation.
**How to avoid:** Interface sketches show the shape (TypeScript interface, not implementation). No function bodies, no internal state. Annotated with open questions rather than closed answers.

### Pitfall 5: Missing `docs/` directory creation step
**What goes wrong:** Planner tasks assume `docs/` exists; first task fails because the directory is absent.
**How to avoid:** Wave 0 or first task explicitly creates `docs/` directory before writing SCAFFOLDING.md.

---

## Component Inventory (DX-03 scope)

29 files in `components/sf/` (including `index.ts`). 28 exported component functions/constants need JSDoc.

**Layout Primitives (5 — Pattern B/C):**
- SFContainer, SFSection, SFStack, SFGrid, SFText

**Interactive (Pattern A — Radix-based):**
- SFButton, SFCard (+5 sub-exports), SFInput, SFBadge, SFTabs (+3 sub-exports), SFSeparator
- SFTable (+5 sub-exports), SFTooltip (+2 sub-exports), SFDialog (+7 sub-exports)
- SFSheet (+7 sub-exports), SFDropdownMenu (+7 sub-exports), SFToggle, SFSlider
- SFCommand (+9 sub-exports), SFSkeleton, SFPopover (+5 sub-exports)
- SFScrollArea (+SFScrollBar), SFLabel, SFSelect (+6 sub-exports), SFCheckbox
- SFRadioGroup (+SFRadioGroupItem), SFSwitch, SFTextarea

**Existing JSDoc coverage:** Zero blocks on exported functions (one inline comment in sf-card.tsx, not JSDoc).

---

## Code Examples

### JSDoc — Layout Primitive (Pattern B)
```typescript
/**
 * Responsive page container — FRAME layer layout primitive.
 *
 * Enforces max-width tokens and responsive gutters. Default width is "wide"
 * for most page sections. Use "content" for prose/readable text columns.
 *
 * @param width - Max-width variant. "wide" | "content" | "full"
 * @param className - Merged via cn() after variant classes
 *
 * @example
 * <SFContainer width="content">
 *   <SFText variant="body">Readable prose column</SFText>
 * </SFContainer>
 */
const SFContainer = React.forwardRef<HTMLDivElement, SFContainerProps>(
```

### JSDoc — Polymorphic Component (Pattern C)
```typescript
/**
 * Semantic text primitive — FRAME layer typography enforcer.
 *
 * Maps semantic variants to typography alias classes (text-heading-1 etc.)
 * defined in globals.css. Defaults to the appropriate HTML element for each
 * variant (h1 for heading-1, p for body, span for small) but accepts `as`
 * for override.
 *
 * @param variant - Semantic text style. "heading-1" | "heading-2" | "heading-3" | "body" | "small"
 * @param as - Override element tag. Defaults: h1/h2/h3/p/span per variant
 * @param className - Merged via cn() after variant class
 *
 * @example
 * <SFText variant="heading-1">Signal Frame</SFText>
 * <SFText variant="body" as="span">Inline body text</SFText>
 */
const SFText = React.forwardRef<HTMLElement, SFTextProps>(
```

### SCAFFOLDING.md — Data Attributes Section
```markdown
## 5. Data Attributes

SF components may carry these attributes for SIGNAL layer targeting:

| Attribute | Type | Applied by | Read by |
|-----------|------|------------|---------|
| `data-section` | presence | SFSection | CSS, layout |
| `data-section-label` | string | SFSection | CSS ::before pseudo |
| `data-bg-shift` | presence (`value=""`) | SFSection | scroll GSAP |
| `data-anim` | string value | blocks/pages | animation/ components |

Bridge rule: `[data-anim]` is the FRAME→SIGNAL handoff point.
The value string identifies which SIGNAL behavior to attach.
```

---

## State of the Art

| Old Approach | Current Approach | Notes |
|--------------|------------------|-------|
| Inline comments | TSDoc / JSDoc blocks | TSDoc is the TypeScript standard; `/** */` syntax is correct |
| Manual transition suppression during theme toggle | Double-rAF `sf-no-transition` class | Already implemented correctly in lib/theme.ts |
| No import boundary documentation | Explicit FRAME/SIGNAL layer doc | New in Phase 5 |

---

## Open Questions

1. **JSDoc on compound components (sub-exports)**
   - What we know: 28 components, many have 3-9 sub-exports (SFCommand has 9)
   - What's unclear: Whether sub-exports need full JSDoc or one-liners
   - Recommendation: Primary export gets full block. Sub-exports get one-liner describing their role in the compound. Planner should specify per component.

2. **DX-SPEC.md location**
   - What we know: CONTEXT.md says `.planning/DX-SPEC.md`
   - What's unclear: Whether it should live in `.planning/` (internal) or `docs/` (consumer-facing)
   - Recommendation: `.planning/DX-SPEC.md` per CONTEXT.md — this is planning/implementation spec, not user docs.

3. **STP-02 expected outcome**
   - What we know: Audit is required. Mechanism is already correct. Color conflicts appear non-existent.
   - What's unclear: Whether there are GSAP color mutations on non-canvas elements the audit will find
   - Recommendation: Grep for `gsap.*color|gsap.*background|gsap.*fill` across all animation/ files as the audit step. Document findings either way. High probability this is a verification task with no code changes.

---

## Validation Architecture

`workflow.nyquist_validation` is not set in `.planning/config.json` (key absent) — treat as enabled.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — no test config files, no test directories, no package.json test scripts |
| Config file | None — Wave 0 gap |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Notes |
|--------|----------|-----------|-------|
| DX-01 | SCAFFOLDING.md exists with required sections | manual | File existence + section audit; no automated test applicable |
| DX-02 | Import boundary documented in SCAFFOLDING.md | manual | Documentation review |
| DX-03 | JSDoc block present on all 28 SF component exports | manual | Grep verification: `grep -rn "/\*\*" components/sf/` |
| DX-04 | DEFERRED — DX-SPEC.md interface sketch present | manual | File existence only |
| DX-05 | DEFERRED — DX-SPEC.md interface sketch present | manual | File existence only |
| STP-01 | DEFERRED — DX-SPEC.md interface sketch present | manual | File existence only |
| STP-02 | No GSAP color mutations conflict with theme toggle | manual | Grep audit + visual verify during theme toggle with animations active |

All Phase 5 requirements are documentation/audit deliverables. Automated testing does not apply. Verification is grep-based spot checks and manual review.

### Wave 0 Gaps

- [ ] No test infrastructure exists — no action needed for Phase 5 (all verification is manual/grep)

---

## Sources

### Primary (HIGH confidence)
- Direct codebase read: `lib/theme.ts` — `sf-no-transition` mechanism confirmed
- Direct codebase read: `components/sf/` (28 files) — JSDoc coverage confirmed zero
- Direct codebase read: `components/sf/index.ts` — barrel export pattern confirmed
- Direct codebase read: `components/sf/sf-button.tsx`, `sf-container.tsx`, `sf-text.tsx` — three canonical sub-patterns documented
- Direct codebase read: `components/animation/color-cycle-frame.tsx`, `hero-mesh.tsx`, `vhs-overlay.tsx` — GSAP/color conflict surface confirmed
- Direct codebase read: `app/globals.css` lines 799-806 — CSS backing rule for `sf-no-transition` confirmed
- Direct codebase read: `.planning/phases/05-dx-contract-state/05-CONTEXT.md` — locked decisions
- Direct codebase read: `.planning/STATE.md` — accumulated project decisions

### Secondary (MEDIUM confidence)
- TypeScript TSDoc standard: JSDoc `/** */` syntax is the correct authoring format for TypeScript hover documentation — industry standard, no library version dependency

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new libraries; all tools already in project
- Architecture: HIGH — all patterns extracted directly from codebase source
- JSDoc patterns: HIGH — TypeScript JSDoc is stable, format verified against existing code
- STP-02 conflict surface: HIGH — grepped all animation files for GSAP color mutations; none found
- Pitfalls: HIGH — derived from direct codebase reading and known TypeScript forwardRef behavior

**Research date:** 2026-04-05
**Valid until:** Stable — no external dependencies; research is codebase-derived
