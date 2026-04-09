# Phase 34 — Deferred Items

> Out-of-scope issues discovered during execution that were NOT fixed.
> Per scope boundary rule: only auto-fix issues DIRECTLY caused by the current task.

## Pre-existing TypeScript errors in tests/phase-29-infra.spec.ts

**Discovered during:** 34-03 Task 1 verification (`npx tsc --noEmit`)
**Errors:**
- `tests/phase-29-infra.spec.ts(117,11): error TS7034: Variable 'nonGsapRafComponents' implicitly has type 'any[]'`
- `tests/phase-29-infra.spec.ts(147,10): error TS7005: Variable 'nonGsapRafComponents' implicitly has an 'any[]' type`

**Verification:** Errors reproduced against HEAD with `git stash` — they are NOT caused by Phase 34 changes.

**Disposition:** Deferred. Not in scope of any Phase 34 plan.

## VL-01 pre-existing flake: homepage ghost label DOM visibility

**Discovered during:** 34-02 Task 3 regression check (running `-g "VL-01"`)
**Test:** `VL-01: DOM — homepage shows ≥ 1 ghost label (THESIS backdrop)` (tests/phase-34-visual-language-subpage.spec.ts:185)
**Behavior:** Playwright resolves `[data-ghost-label="true"]` to an element with
`class="sf-display ... absolute leading-none -left-[3vw] top-1/2 -translate-y-1/2 text-foreground/[0.04]"`
but `toBeVisible()` fails with `unexpected value "hidden"`. The element exists with
the correct attribute, but its extreme off-canvas positioning (-left-[3vw]) combined
with 4% foreground opacity appears to trip Playwright's visibility heuristic.

**Verification:** Reproduced against HEAD with `git stash` — failure persists without
any 34-02 changes. NOT caused by plan 34-02 edits (which only touch token-specimens/,
token-tabs.tsx, app/system/page.tsx, and the phase-34 spec file).

**Disposition:** Deferred. Belongs to whoever owns the ghost-label DOM assertion
(originally shipped in 34-01 Wave 0). Possible fixes: switch to `.toHaveCount(>=1)`
or assert on `data-ghost-label` attribute presence only, since the "≥ 1 ghost label"
intent does not require full Playwright visibility semantics. The equivalent
`VL-01: DOM — /system shows ≥ 1 ghost label (subpage hero)` test passes.
