---
phase: 01-frame-foundation
phase-number: "01"
type: reconciliation
first-commit: f1fd5a8
completed-date: "2026-04-06"
plans: [01-01, 01-02, 01-03]
requirements-addressed: [FRM-01, FRM-02, FRM-03, FRM-04, FRM-05, FRM-06, FRM-07, FRM-08]
overall-status: COMPLETE
---

# Phase 01 — FRAME Foundation: Reconciliation

**Phase objective:** Lock the token system in `app/globals.css` and enforce blessed spacing across component files, establishing the single contract all Phase 2 primitives will build on.

**Execution window:** 2026-04-05 to 2026-04-06
**Plans executed:** 3 of 3
**First commit:** f1fd5a8
**Overall status:** COMPLETE — all 8 FRM requirements addressed, no unresolved deviations

---

## Plan-level Acceptance Criteria Map

### Plan 01-01 — Token Foundation (globals.css)

Requirements: FRM-02, FRM-03, FRM-05, FRM-06
Commits: f1fd5a8 (Task 1), b8f09bf (Task 2)

| AC | Statement | Delivered | Evidence |
|----|-----------|-----------|----------|
| AC-1 | `text-heading-1` renders Anton / var(--text-3xl) / 700 / line-height 0.9 / uppercase | PASS | Added in @layer utilities at line 502 of globals.css |
| AC-2 | `text-body` renders Inter / var(--text-base) / 400 / line-height 1.5 | PASS | Added in same utility block |
| AC-3 | `text-small` renders Inter / var(--text-sm) / 400 / line-height 1.4 | PASS | Added in same utility block |
| AC-4 | --max-w-content=42rem, --max-w-wide=80rem, --max-w-full=100%, --gutter=1.5rem, --gutter-sm=1rem exist in :root | PASS | 5 layout tokens added to :root after --nav-height |
| AC-5 | Color tier comment block found with keywords CORE, EXTENDED, EXPANSION POLICY | PASS | Block added immediately before @theme |
| AC-6 | Zero `--vhs-` occurrences without sf- prefix remain | PASS | 2 declarations + 2 usages migrated; confirmed 0 unnamespaced matches |
| AC-7 | --space-1 through --space-24 exist covering all 9 blessed stops (4/8/12/16/24/32/48/64/96px) | PASS | 9 tokens added to :root; self-check confirmed all present |

**Plan 01-01 deviation:** Pre-existing TypeScript error in `components/animation/color-cycle-frame.tsx` (useRef missing argument) prevented `npx next build` from completing clean. Confirmed pre-existing before any changes. CSS compilation itself passes. Logged to blockers in STATE.md and deferred-items.md. Not introduced by Plan 01-01 changes.

---

### Plan 01-02 — Spacing Sweep and CVA Compliance

Requirements: FRM-01, FRM-07
Commits: (within 01-02 execution window — see git log)

| AC | Statement | Delivered | Evidence |
|----|-----------|-----------|----------|
| AC-1 | Zero non-blessed spacing values (p/m/gap/pt/pb/pl/pr/mt/mb/ml/mr -5, -7, -10) in sf/, blocks/, layout/ | PASS | grep exits code 1 (zero matches); 6 files swept |
| AC-2 | sf-button.tsx CVA call uses `intent` as variant prop and `defaultVariants` contains `intent` | PASS | defaultVariants: { intent: "primary", size: "md" } confirmed |
| AC-3 | sf-badge.tsx and sf-toggle.tsx CVA calls use `intent` with `defaultVariants` declared | PASS | All three components confirmed compliant; sf-toggle defaultVariants: { intent: "default", size: "md" } |
| AC-4 | sf-button.tsx `signal` intent value documented as pre-standard extension | PASS | Comment added: "signal: pre-standard extension — kept for SignalframeUX brand accent usage" |

**Plan 01-02 deviation (minor, auto-resolved):** `shared-code-block.tsx` had `p-5 pr-6` rather than plain `p-5`. Since `p-6` already provides `pr-6` (24px right), the redundant axis override was dropped. Net result identical to spec intent — cleaner class composition.

---

### Plan 01-03 — CSS Fallbacks and Print Stylesheet

Requirements: FRM-04, FRM-08
Commits: 7f94179 (Task 1), 01118d9 (Task 2)

| AC | Statement | Delivered | Evidence |
|----|-----------|-----------|----------|
| AC-1 | Zero active color var() calls without comma-fallback outside @theme | PASS | 36 color fallbacks added; 0 unfallbacked color vars confirmed |
| AC-2 | Zero font var() calls without comma-fallback in non-@theme utility contexts | PASS | 8 font fallbacks added (--font-sans and --font-display) |
| AC-3 | Motion/decorative var() calls (--duration-*, --ease-*) intentionally exempt | PASS | Exemption documented; no fallbacks added for motion tokens |
| AC-4 | Exactly one `@media print` match in globals.css | PASS | Confirmed count = 1 |
| AC-5 | `.vhs-overlay` has `display: none !important` in print block | PASS | Full Signal layer suppression list present |
| AC-6 | `body` in print block has `background: white` and `color: black` | PASS | `background: white !important; color: black !important` on body, .dark body, .dark |
| AC-7 | No active var(--max-w-*), var(--gutter*), var(--nav-height) consumers found in globals.css outside :root | PASS | Layout tokens only declared in :root — no active consumers exist in globals.css to add fallbacks to |

**Plan 01-03 deviations:** None. Plan executed exactly as written.

**AC-7 note for verifier:** The PLAN intended that layout/spacing var() consumers in globals.css would have fallbacks added. In practice, those tokens are declared in :root and consumed in component TSX files (not in globals.css itself). Since globals.css has no active consumers of --max-w-*, --gutter, or --nav-height (outside of their :root declarations), there was nothing to add fallbacks to. This is correct behavior — the criterion is satisfied vacuously.

---

## Requirements Coverage Summary

| Requirement | Plan | Status | Notes |
|-------------|------|--------|-------|
| FRM-01 — Blessed spacing enforced across component files | 01-02 | COMPLETE | 6 files swept, zero remaining non-blessed values |
| FRM-02 — Spacing tokens defined (9 blessed stops) | 01-01 | COMPLETE | --space-1 through --space-24 in :root |
| FRM-03 — Layout tokens defined (max-width, gutter) | 01-01 | COMPLETE | 5 layout custom properties in :root |
| FRM-04 — CSS custom property fallbacks on critical var() calls | 01-03 | COMPLETE | 44 fallbacks added (36 color + 8 font) |
| FRM-05 — Semantic typography aliases | 01-01 | COMPLETE | 5 utility classes + 20 :root custom properties |
| FRM-06 — Color tier documentation and VHS namespace migration | 01-01 | COMPLETE | Comment block + --vhs- → --sf-vhs- |
| FRM-07 — CVA intent + defaultVariants standard across SF components | 01-02 | COMPLETE | 3 components audited and confirmed compliant |
| FRM-08 — Print stylesheet exists, inverts dark, suppresses Signal | 01-03 | COMPLETE | @media print block appended to globals.css |

**All 8 FRM requirements: COMPLETE.**

---

## Deviations Register

| # | Plan | Type | Description | Resolution |
|---|------|------|-------------|------------|
| 1 | 01-01 | Pre-existing blocker | TypeScript error in color-cycle-frame.tsx blocked `npx next build` | Confirmed pre-existing; deferred to later plan; CSS compilation itself passes |
| 2 | 01-02 | Minor auto-adjustment | shared-code-block.tsx had `p-5 pr-6`, not plain `p-5` | Collapsed to `p-6`; pr-6 redundant since p-6 covers it; visual result identical |
| 3 | 01-03 | Vacuous AC | No layout/spacing var() consumers exist in globals.css to add fallbacks to | Correct behavior; tokens only consumed in TSX components (addressed in Phase 2) |

---

## Deferred Items

| Item | Logged By | File | Notes |
|------|-----------|------|-------|
| Pre-existing TypeScript error — `useRef<ReturnType<typeof setTimeout>>()` missing argument | Plan 01-01 Task 1 | components/animation/color-cycle-frame.tsx line 79 | Blocks clean `next build` TypeScript check; CSS compilation unaffected |

---

## Key Architectural Decisions (Phase 01)

These decisions are load-bearing for Phase 2 work:

1. **Spacing tokens in :root, not @theme** — Placing custom properties in :root avoids Tailwind utility class generation for spacing tokens. Phase 2 primitives must use `var(--space-*)` via inline styles or CSS, not Tailwind class generation.

2. **Semantic typography as both utilities AND custom properties** — `.text-heading-1` is available as a Tailwind utility class, and `--text-heading-1-family/size/weight/leading` are available as :root custom properties for JS/inline style access.

3. **VHS class names unchanged; only custom properties renamed** — `.vhs-overlay`, `.vhs-crt` class names remain intact. Only the CSS custom properties were namespaced to `--sf-vhs-*`. Phase 3 SIGNAL work should use `--sf-vhs-crt-opacity` and `--sf-vhs-noise-opacity`.

4. **Motion tokens exempt from fallbacks** — `--duration-*` and `--ease-*` intentionally have no fallback values. If these tokens are undefined, animation silently degrades. This is an explicit, documented choice.

5. **signal intent in sf-button.tsx is a brand extension, not a mistake** — Documented via comment. Phase 2 and beyond should not remove it.

---

## Verifier Handoff

**What verifiers should check:**

### High-priority checks

1. **AC-7 (Plan 01-03) — vacuous satisfaction.** The layout token fallback criterion was technically met because globals.css has no active consumers of `--max-w-*`, `--gutter`, or `--nav-height` in CSS rules (only :root declarations). Verify this is still the case: `grep -n "var(--max-w-\|var(--gutter\|var(--nav-height" app/globals.css | grep -v ":root"` should return zero matches. If any component-embedded CSS has been added since execution, fallbacks may be needed.

2. **Pre-existing TypeScript error (blocker).** `components/animation/color-cycle-frame.tsx` line 79: `useRef<ReturnType<typeof setTimeout>>()` requires 1 argument. This blocks `npx next build` TypeScript check. Phase 2 should fix this before build verification matters. Run `npx tsc --noEmit` to confirm the error is still present and still isolated to this file.

3. **Spacing sweep completeness.** The sweep only targeted the 6 files listed in Plan 01-02. Verify no other files in `components/sf/`, `components/blocks/`, or `components/layout/` contain non-blessed spacing:
   ```
   grep -rEn " (p|px|py|m|mx|my|gap|pt|pb|pl|pr|mt|mb|ml|mr)-(5|7|10)[^0-9]" components/sf/ components/blocks/ components/layout/ --include="*.tsx"
   ```
   Expected: exit code 1, zero matches.

### Medium-priority checks

4. **Color tier comment block.** Verify the CORE/EXTENDED/EXPANSION POLICY block is immediately before `@theme` and has not been displaced by other edits: `grep -n "EXPANSION POLICY" app/globals.css` should return 1 match.

5. **VHS namespace completeness.** Confirm no `--vhs-` without `sf-` prefix remains: `grep -c "\-\-vhs-[^s]" app/globals.css` should return 0.

6. **Print stylesheet integrity.** Verify `@media print` count is exactly 1 (`grep -c "@media print" app/globals.css`). Multiple print blocks would indicate a duplicate was accidentally added.

7. **CVA compliance on sf-badge.tsx and sf-toggle.tsx.** These were audit-confirmed compliant but not modified. If either file was touched after Plan 01-02, re-verify that `intent` and `defaultVariants` are still present.

### Low-priority / informational

8. **Semantic typography custom properties.** The 20 :root custom properties (`--text-heading-1-family`, etc.) exist for JS/inline style access. Phase 2 primitives may not use them if they rely on utility classes instead. Verifier should note whether any Phase 2 component actually consumes these — they were added proactively per plan but may not be referenced yet.

9. **Spacing tokens not consumed in globals.css.** The 9 `--space-*` tokens are defined in :root but globals.css itself uses Tailwind utility classes for spacing, not these custom properties. Phase 2 SFContainer/SFSection primitives are the intended consumers. Verifier should track whether Phase 2 actually uses `var(--space-*)` inline or relies on Tailwind classes instead.
