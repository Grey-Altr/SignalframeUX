# Proposal: Elevation Ladder

**Status:** PROPOSED · v0.2+ scope (NOT v0.1 stabilization)
**Origin:** Claude Design v0 probe, 2026-04-18
**Source:** `.planning/claude-design-probes/v0/colors_and_type.css` lines 65-82

---

## Concept

Five-step surface ladder with **luminance-only differentiation** — zero shadow, zero radius, zero gradient. Surfaces separate by L-step alone.

| Step | Dark mode | Light mode | Purpose |
|---|---|---|---|
| `--surface-sink` | `oklch(0.080 0 0)` | `oklch(0.93 0.002 298)` | Content below the base (code blocks, inset regions) |
| `--surface-base` | `oklch(0.145 0 0)` | `oklch(1 0 0)` | Page background (body default) |
| `--surface-raise` | `oklch(0.180 0 0)` | `oklch(0.98 0.002 298)` | Primary panels, cards, spec containers |
| `--surface-lift` | `oklch(0.205 0 0)` | `oklch(0.96 0.002 298)` | Controls, inline chrome, row stripes |
| `--surface-peak` | `oklch(0.269 0 0)` | `oklch(0.92 0.002 298)` | Floating: popovers, selected rows, top-of-stack |

Companion foreground tokens: `--surface-fg`, `--surface-fg-muted`, `--surface-fg-dim`.

---

## Why interesting

- **Respects every SF hard constraint.** No shadow, no radius, no gradient. Depth emerges purely from luminance relationships — perfectly aligned with Enhanced Flat Design philosophy.
- **Formalizes what's already implicit.** SF's existing dark-mode color tokens (`--color-background`, `--color-card`, `--color-popover`, `--color-muted`) already sit at roughly these luminance stops. The ladder makes the relationship systematic.
- **Gives AI tools and humans a principled answer** to "how do I differentiate two adjacent surfaces in a flat-depth system?" Currently the answer is improvised per-component, which risks inconsistency as the system scales to cdOS and portfolio work.
- **Closed set discipline.** Five steps only. "If it isn't here, it's wrong."

---

## Why deferred

- Outside v0.1 stabilization scope — CLAUDE.md forbids new subsystems in stabilization.
- Would require audit of all existing SF components to map current surface usage to ladder steps.
- Overlaps with existing `--color-card`, `--color-popover`, `--color-muted` — migration path requires careful design.
- Double-standard period during migration (new uses ladder, old uses `--color-*`) must be planned and time-boxed.

---

## If pursued in v0.2

### Pre-work
1. Audit all SF component surface usage. Produce migration map: current token → ladder step.
2. Decide overlap strategy: **replace** `--color-card` with `--surface-raise`, **deprecate** with alias, or **parallel-track** (both coexist).
3. Validate luminance steps against existing visual design — may need tuning.

### Integration sequence
1. Add ladder tokens to `app/globals.css` alongside existing `--color-*`.
2. Add to `design.md` §4 Tokens.
3. Refactor components one category at a time (Surfaces → Data Display → Forms), not big-bang.
4. Update `/tokens` explorer with elevation section.

### Risks
- **Duplication.** If migration doesn't complete, system carries two overlapping surface vocabularies.
- **Semantic blur.** `--surface-raise` vs. `--color-card` — designers must know which to reach for. Needs doc discipline.

---

## Reject criteria

If v0.1 stabilization audit shows existing `--color-background / -card / -popover / -muted` tokens already express the ladder semantics adequately, reject this proposal and instead **document elevation semantics against the existing tokens.** No new tokens, just clearer rules about when to use which.

---

## Provenance

See `colors_and_type.css` lines 65-82 and `foundations/elevation.html` in the v0 probe bundle for Claude Design's full rationale. Naming and logic are preserved here verbatim.
