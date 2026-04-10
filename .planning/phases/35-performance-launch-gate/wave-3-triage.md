# Wave 3 Triage — 5-Fix Cap Applied

**Date:** 2026-04-10
**Executor:** Phase 35 Plan 04 Task 4
**Source:** wave-2-cdt-findings.md (CDT + Lighthouse pass, commit 70fcf44)
**Cap status:** Cap honored: 5-fix limit applied.

---

## Fix Allocation (5 of 5 slots used)

Items are ranked by severity (BLOCK before FLAG) then by implementation risk (code fix before test fix).

| Slot | ID | Issue | Severity | Fix type | Decision |
|------|----|-------|----------|----------|----------|
| 1 | T-01/T-02 | CLS > 0.001 — /system (0.485), /inventory (0.045), /init + /reference (0.014 each), / (0.006) | BLOCK | Code fix | **YES — fix in Wave 3** |
| 2 | LH-01 | Lighthouse Performance 52 — driven by /system CLS 0.485 | BLOCK | Covered by slot 1 (same root cause) | **YES — resolved by slot 1** |
| 3 | T-03 | nav-reveal: body[data-nav-visible] not flipping after Playwright scroll | BLOCK | Test fix (Lenis/window.scrollBy incompatibility) | **YES — fix in Wave 3** |
| 4 | T-04 | InstrumentHUD index-branch fires on subpages — id segment lost (/system, /init, /reference) | FLAG | Code fix | **YES — fix in Wave 3** |
| 5 | T-05 | Specimen ladder test reads app/system/page.tsx instead of components/blocks/token-tabs.tsx | FLAG | Test fix | **YES — fix in Wave 3** |

**Note on slot 2:** LH-01 (Performance 52) shares root cause with T-01/T-02 (CLS 0.485 on /system). Fixing CLS is expected to restore Performance to the v1.4 baseline of 100. This does not consume an additional slot.

**Slot 5 fills cap.** Item T-06 (font-mono test path) is deferred to v1.6-carry-overs.md. All Lighthouse advisory items (LH-02 Accessibility, LH-03 Best Practices, LH-04 SEO) are also deferred — their specific audit failures require JSON artifact inspection that exceeds the Phase 35 scope.

---

## Approved Fix Details

### Fix 1 (slots 1+2): CLS reduction — all 5 routes

**Finding:** T-01 + T-02 from wave-2-cdt-findings.md §BLOCK-2
**Spec:** `tests/phase-35-cls-all-routes.spec.ts:35`
**CLS values:** /system = 0.485 (catastrophic), /inventory = 0.045, /init = 0.014, /reference = 0.014, / = 0.006
**Root cause hypothesis:** Font loading causing layout shift on TokenTabs/specimen render, or specimen columns reflowing on hydration. /system is worst — investigate `components/blocks/token-tabs.tsx` first.
**Success criterion:** All 5 routes CLS < 0.001 in `tests/phase-35-cls-all-routes.spec.ts`
**Commit protocol:** One atomic commit — test update + implementation change together (per brief §Wave 3 protocol)

### Fix 2 (slot 3): nav-reveal Playwright scroll driver

**Finding:** T-03 from wave-2-cdt-findings.md §BLOCK-1
**Spec:** `tests/phase-35-homepage.spec.ts:31`
**Root cause:** `window.scrollBy` does not drive Lenis. Lenis intercepts native scroll. Options: (a) emit a synthetic scroll event that Lenis picks up, (b) use `page.evaluate` to call `lenis.scrollTo()` directly in test, (c) add `data-nav-visible="true"` test helper that bypasses scroll when `?testMode=1`.
**Preferred approach:** Option (b) if lenis instance is window-accessible; Option (c) if not — test-mode escape hatch keeps the hook unchanged and avoids touching production scroll behavior.
**Success criterion:** `tests/phase-35-homepage.spec.ts` nav-reveal assertions pass
**Commit protocol:** Atomic — test change + any impl change together

### Fix 3 (slot 4): InstrumentHUD id-based label on subpages

**Finding:** FLAG-1 from wave-2-cdt-findings.md §FLAG findings
**Spec:** `tests/phase-35-init.spec.ts:71`, `tests/phase-35-reference.spec.ts:57`, `tests/phase-35-system.spec.ts:59`
**Root cause:** `instrument-hud.tsx` lines 148–152 — id-based format only fires when `sections.length === 1`. Subpages have multiple `[data-section]` elements (nav chrome, layout wrappers), so index-branch activates and the route id (`SYS`, `INIT`, `REF`) is dropped.
**Fix approach:** Read `instrument-hud.tsx` before implementing. Target the primary content section using a `[data-section][data-primary]` attribute or filter sections by excluding nav-chrome elements. Preserve homepage behavior (index-format on /; id-format on subpages).
**Success criterion:** HUD shows `[SYS//TOK]`, `[INIT//SYS]`, `[REF//API]` on their respective routes
**Commit protocol:** Atomic — test change + impl change together

### Fix 4 (slot 5): Specimen ladder test file path

**Finding:** FLAG-2 from wave-2-cdt-findings.md §FLAG findings
**Spec:** `tests/phase-35-system.spec.ts:70` (approximate)
**Root cause:** Test reads `app/system/page.tsx` for SpacingSpecimen/TypeSpecimen/ColorSpecimen; they live in `components/blocks/token-tabs.tsx`
**Fix approach:** Update test to read `components/blocks/token-tabs.tsx` instead. Confirm the specimen class/component names in that file before updating assertion.
**Success criterion:** `tests/phase-35-system.spec.ts` specimen ladder assertions pass (or pass + skip if the current assertion is source-read not DOM-runtime)
**Commit protocol:** Atomic — test-only change (no impl change needed)

---

## Deferred Items (cap overflow → v1.6-carry-overs.md)

See `v1.6-carry-overs.md` for items beyond the 5-fix cap:
- T-06: Schematic register font-mono test reads wrong file
- LH-02: Lighthouse Accessibility 95 (specific audit failures in JSON artifact)
- LH-03: Lighthouse Best Practices 96
- LH-04: Lighthouse SEO 91

---

## Wave 3 Fix Results (Task 5 commit SHAs)

| Slot | Fix | Commit | Files changed |
|------|-----|--------|---------------|
| 1+2 | CLS reduction — Anton display:optional | `5b894b4` | app/layout.tsx, tests/phase-35-cls-all-routes.spec.ts |
| 3 | nav-reveal — page.mouse.wheel for Lenis compat | `4eddbd9` | tests/phase-35-homepage.spec.ts, tests/phase-35-system.spec.ts, tests/phase-35-init.spec.ts, tests/phase-35-reference.spec.ts |
| 4 | InstrumentHUD subpage id-branch via data-primary | `309c009` | components/layout/instrument-hud.tsx, app/system/page.tsx, app/init/page.tsx, app/reference/page.tsx, app/inventory/page.tsx |
| 5 | Specimen ladder test path → token-tabs.tsx | `556695b` | tests/phase-35-system.spec.ts |

All 4 fixes landed within the 5-fix cap. VL-05 entry-section.tsx: diff empty across all 4 commits (lock intact).

---

## VL-05 Regression Check (AC-9)

**Status: PASS — no action required.**

Confirmed in wave-2-cdt-findings.md §VL-05 Regression Check:
- `data-anim="hero-slash-moment"` present at `components/blocks/entry-section.tsx:44`
- `mixBlendMode: "screen"` at line 52
- `opacity: 0.25` at line 51
- All 3 viewport variants PASS

No Wave 3 fix touches `entry-section.tsx`. VL-05 lock intact.
