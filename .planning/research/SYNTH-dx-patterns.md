# SYNTH: DX Patterns for AI-Fluent Design Systems
## v1.0 Fluency Pillar / 2026-04-05 (v2)

---

## 1. shadcn DX Model

Token cascade: one root value propagates through all components with zero per-component intervention. SF already has: `ui/` → `sf/` ownership, CVA, `cn()`, OKLCH `@theme inline`, `data-slot`, `sf/index.ts` barrel. Missing: `registry.json` distribution, per-component doc pages, consistent `defaultVariants`.

---

## 2. AI-Fluent Design Systems

An agent generates correct UI when it answers four questions without reading source:

1. **What exists?** The barrel (`sf/index.ts`). `SF` prefix is guessable. Every component exported, nothing more.
2. **What props?** `intent: "primary" | "ghost" | "signal"` — semantic, not visual. Composes in unseen contexts.
3. **What tokens?** Core 5 (background, foreground, primary, secondary, accent) for 90% of use. Extended is component-specific only. A bounded set cannot be hallucinated.
4. **What constraints?** Zero border-radius, spacing stops (4/8/12/16/24/32/48/64/96). Cascade-enforced constraints cannot be accidentally violated.

**Predictability:** `--[category]-[property]` at every level. `--sf-*` signals expressive/optional — agents know `--sf-grain-opacity` is decoration. `--vhs-*` is ambiguous and must migrate to `--sf-vhs-*`.

**Scaffolding:** `SFSection > SFContainer > SFGrid > SFStack` constrains layout to the token grid before content is added. Correct scaffold = correct output by default.

---

## 3. Gap Analysis: CLAUDE.md vs Agent Needs

**Root gap:** CLAUDE.md documents constraints, not affordances. An agent knows what to avoid but not how to construct something novel within the system.

Specific missing items and their failure modes:
- No usage example per token → agent reaches for wrong token
- Blessed stops listed but not enforced as only utilities → agent uses arbitrary values
- Semantic aliases defined but not as `@utility` classes → agent writes raw scale values
- Dual-layer described but no import-level signal → agent mixes FRAME and SIGNAL incorrectly
- `intent` listed but `variant` inconsistency exists across components → agent uses wrong axis name
- Data attributes listed but no load-bearing contract → agent renames them and silently breaks SIGNAL

---

## 4. Composition and Token Patterns

**Flat compound:** `SFSection > SFGrid > SFCard` is generatable from description. Deep shared-state trees are not.

**Intent-named variants + defaultVariants:** semantic names compose in unseen contexts. The 80% default case means bare `<SFButton>` is always correct without specifying variants.

**Server-first:** `'use client'` only on animation/interactive components — agents default correctly.

**Token naming fix needed:** `--vhs-*` tokens sit outside the `--sf-*` expressive namespace. This is the only naming violation. Migrate to `--sf-vhs-*`.

---

## 5. FRAME+SIGNAL DX Contract

**Decision boundary:** FRAME is the default. SIGNAL layers on a complete FRAME structure — it never replaces FRAME.

**FRAME only when:** building layout/structural primitives, server-rendered content, or any component where animation is not explicitly specified.

**Add SIGNAL when:** component carries `data-anim` in a client context, section carries `data-bg-shift`, or the context is explicitly hero/manifesto/showcase.

**Rules:**
- `sf/` = FRAME imports. `components/animation/` = SIGNAL overlays. Do not cross directions.
- FRAME must look complete with zero SIGNAL. If a component requires animation to be readable, the contract is violated.
- SIGNAL attaches via data attributes. Absent attribute = silent no-op. Graceful degradation by design.
- `--sf-*` tokens = SIGNAL boundary. All others = FRAME infrastructure.

**Load-bearing data attributes — never rename:**
- `data-section` — required on every block; GSAP scopes animation here
- `data-anim` — opt-in; marks entrance animation targets
- `data-bg-shift` — opt-in; activates scroll-driven background transition
- `data-section-label` — informational; drives nav indicator only, not animation

---

## 6. Scaffolding Spec: New SF Component Contract

**Files:** `components/sf/sf-[name].tsx` + named export in `components/sf/index.ts`. No other files created.

**Component shape:**
- Server Component by default. Add `'use client'` only for hooks, browser APIs, or event handlers.
- One CVA `[name]Variants`. Primary axis: `intent`. `defaultVariants` required — zero-prop render must be correct.
- Props extend base HTML element or Radix component. Always spread `...props` to root.
- `data-slot="[name]"` on root element. `cn()` for all class merging.

**Required props:** `className?: string` · `intent?` with default · `children?: React.ReactNode` for containers

**Forbidden:** inline styles · arbitrary Tailwind values · `rounded-*` utilities · hardcoded colors · new animation logic (belongs in `components/animation/`)

**Barrel entry:** `export { SFName } from './sf-name'` — named exports only, no defaults

---

## 7. Action Items

1. Rename `--vhs-*` → `--sf-vhs-*` in `globals.css`
2. Add `defaultVariants` to all CVA definitions missing them
3. Standardize `intent` as primary variant axis; audit and fix `variant` inconsistency
4. Add `@utility text-heading-1` etc. to `globals.css` when semantic aliases land
5. Add `registry.json` enabling `shadcn add signalframeux:[name]` — the zero-friction agent install surface
6. Add per-component JSDoc with one usage example — the affordance surface CLAUDE.md currently lacks
