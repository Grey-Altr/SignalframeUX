---
phase: 01-frame-foundation
verified: 2026-04-06T00:00:00Z
status: passed
score: 5/5 must-haves verified
re_verification: false
---

# Phase 01: FRAME Foundation Verification Report

**Phase Goal:** The token system is locked, enforced, and conflict-free — every spacing, typography, layout, color, and variant decision has exactly one valid answer
**Verified:** 2026-04-06
**Status:** passed
**Re-verification:** No — initial verification

---

## Reconciliation Summary

RECONCILIATION.md was found and read. The reconciliation agent documented overall status as COMPLETE with all 8 FRM requirements addressed and no unresolved deviations.

**Key verifier handoff items actioned:**

1. **AC-7 vacuous satisfaction (high priority):** Verified — `grep -n "var(--max-w-\|var(--gutter\|var(--nav-height" app/globals.css | grep -v ":root"` returned zero matches (exit code 1). No layout var consumers exist in globals.css outside :root. Correct behavior confirmed.

2. **Spacing sweep completeness (high priority):** Full sweep of components/sf/, components/blocks/, and components/layout/ using the reconciliation-specified pattern returns exit code 1 (zero matches). The sweep is complete including the layout/ directory which was not explicitly listed in Plan 01-02's file manifest.

3. **Color tier comment block (medium priority):** Confirmed at globals.css lines 14–25, immediately before `@theme` at line 26. CORE, EXTENDED, and EXPANSION POLICY keywords all present.

4. **VHS namespace completeness (medium priority):** `--vhs-[^s]` count = 0. `--sf-vhs-` count = 4 (2 declarations + 2 usages). Migration complete.

5. **Print stylesheet integrity (medium priority):** `@media print` count = 1. No duplicates.

6. **CVA compliance (medium priority):** sf-badge.tsx and sf-toggle.tsx untouched after Plan 01-02. Both confirmed compliant on re-read.

**Deviations noted in reconciliation — verifier position:**
- Pre-existing TypeScript error in `color-cycle-frame.tsx`: confirmed pre-existing, not introduced by Phase 1. Deferred correctly. Not a Phase 1 failure.
- shared-code-block.tsx p-5 pr-6 → p-6: valid auto-adjustment, net result identical to spec intent.
- AC-7 vacuous satisfaction: confirmed correct behavior per verification above.

**No RECONCILIATION.md disagreements found.**

---

## Goal Achievement

### Observable Truths (from ROADMAP.md Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | A developer can grep the codebase for Tailwind spacing utilities and find zero values outside the blessed set | VERIFIED | `grep -rEn " (p\|px\|py\|m\|...) -(5\|7\|10)[^0-9]"` across sf/, blocks/, layout/ returns exit code 1, zero matches |
| 2 | A developer can apply text-heading-1 through text-small semantic aliases without consulting a spec document | VERIFIED | Five utility classes (.text-heading-1 through .text-small) defined in @layer utilities at globals.css lines 502–532, each with font-family, font-size, font-weight, line-height fully specified |
| 3 | Any SF component with a missing CSS custom property renders with a declared fallback — no silent blank or invisible elements | VERIFIED | All font-family var() calls in utility rules have comma-fallbacks (e.g., `var(--font-display, "Anton", "Impact", sans-serif)`). 36 color fallbacks added. Motion tokens intentionally exempt with documented rationale. |
| 4 | The color palette has a defined tier boundary: core 5 tokens, extended tokens, no mechanism to add without deliberate system change | VERIFIED | Color tier comment block at globals.css lines 14–25 immediately before @theme. CORE (5 tokens), EXTENDED (6 tokens), EXPANSION POLICY documented. |
| 5 | Every CVA call in sf/ uses intent as the variant prop name and has defaultVariants declared | VERIFIED | sf-button.tsx: `intent` with `defaultVariants: { intent: "primary" }`. sf-badge.tsx: `intent` with `defaultVariants: { intent: "default" }`. sf-toggle.tsx: `intent` with `defaultVariants: { intent: "default" }`. Exactly 3 CVA-using components found — no undiscovered components. |

**Score:** 5/5 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `app/globals.css` | Semantic typography aliases, layout tokens, spacing tokens, color tier documentation, VHS namespace migration, CSS fallbacks, print stylesheet | VERIFIED | All 7 concerns confirmed at specific line numbers |
| `components/sf/sf-button.tsx` | CVA-compliant with intent + defaultVariants + signal intent documented | VERIFIED | Lines 9–27: intent CVA, defaultVariants: { intent: "primary" }, signal comment at line 14 |
| `components/blocks/components-explorer.tsx` | Spacing-corrected, p-6 present | VERIFIED | Non-blessed spacing grep returns zero matches |
| `components/blocks/token-tabs.tsx` | Spacing-corrected, p-6 present | VERIFIED | Non-blessed spacing grep returns zero matches |
| `components/sf/sf-badge.tsx` | CVA intent + defaultVariants | VERIFIED | defaultVariants: { intent: "default" } confirmed |
| `components/sf/sf-toggle.tsx` | CVA intent + defaultVariants | VERIFIED | defaultVariants: { intent: "default", size: "md" } confirmed |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `app/globals.css @layer utilities` | Any component using text-heading-1 | Tailwind utility class containing all typographic properties | WIRED | Class defined at line 502 with font-family, font-size, font-weight, line-height, text-transform |
| `app/globals.css :root` | Future SFContainer/SFSection primitives | var(--max-w-content) at line 166 | WIRED (token ready) | Layout tokens exist in :root; no Phase 1 consumers expected — Phase 2 will wire these |
| `app/globals.css :root` | Spacing enforcement across components | var(--space-*) at lines 155–163 | WIRED (token ready) | 9 spacing tokens defined; component consumption is Phase 2 scope |
| `app/globals.css @media print` | VHS overlay, Signal layer elements | display: none !important | WIRED | .vhs-overlay, .vhs-crt, .vhs-noise, .vhs-scanlines, [data-anim], .sf-cursor, .sf-grain::after, .sf-idle-overlay, GSAP markers all suppressed |
| `components/sf/sf-button.tsx CVA` | intent standard | cva() call with intent + defaultVariants | WIRED | `intent` is the variant key; defaultVariants declared; signal intent explicitly documented |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| FRM-01 | 01-02 | All spacing uses blessed stops only — zero arbitrary values | SATISFIED | Full grep across sf/, blocks/, layout/ returns zero non-blessed values |
| FRM-02 | 01-01 | Semantic typography aliases implemented | SATISFIED | 5 utility classes (.text-heading-1 through .text-small) + 20 :root custom properties in globals.css |
| FRM-03 | 01-01 | Layout tokens defined and enforced | SATISFIED | --max-w-content: 42rem, --max-w-wide: 80rem, --max-w-full: 100%, --gutter: 1.5rem, --gutter-sm: 1rem in :root |
| FRM-04 | 01-03 | Every CSS custom property has a declared fallback | SATISFIED | 36 color fallbacks + 8 font fallbacks added. Motion/z-index tokens intentionally exempt with documented rationale. |
| FRM-05 | 01-01 | Color palette tiered and frozen | SATISFIED | CORE/EXTENDED/EXPANSION POLICY comment block immediately before @theme |
| FRM-06 | 01-01 | --vhs-* tokens namespaced to --sf-vhs-* | SATISFIED | --vhs-[^s] count = 0; --sf-vhs- count = 4 (2 declarations, 2 usages) |
| FRM-07 | 01-02 | CVA variant prop standardized to intent with defaultVariants | SATISFIED | All 3 CVA-using sf/ components compliant |
| FRM-08 | 01-03 | Print media styles — dark inverts, Signal suppressed, readable | SATISFIED | @media print block at end of globals.css; body background: white, color: black; full Signal layer suppression list |

**All 8 FRM requirements: SATISFIED.**

No orphaned requirements — all 8 FRM IDs are mapped to Phase 1 in REQUIREMENTS.md and all are accounted for by the three plans.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `components/animation/color-cycle-frame.tsx` | 79 | Pre-existing TypeScript error: `useRef<ReturnType<typeof setTimeout>>()` missing required argument | Warning | Blocks `npx next build` TypeScript check only. CSS compilation unaffected. Confirmed pre-existing before Phase 1. Deferred to Phase 2. |

No placeholder components, no stub implementations, no empty handlers found in Phase 1 modified files.

---

### Human Verification Required

None required for this phase. All acceptance criteria are mechanically verifiable via static analysis of globals.css and component files.

The following items are informational — not blockers:

**1. Semantic typography custom properties not yet consumed**

The 20 `:root` custom properties (`--text-heading-1-family`, etc.) were added proactively for JS/inline style access. No Phase 1 or Phase 2 component currently consumes them via `var(--text-heading-*-family)` — the utility classes (`text-heading-1`) are consumed instead. These properties are correct and available, but their Phase 2 uptake should be verified during Phase 2 verification.

**2. Spacing tokens --space-* not consumed in globals.css**

The 9 `--space-*` tokens are defined in `:root` but globals.css itself uses Tailwind utility classes. Phase 2 SFContainer/SFSection primitives are the intended consumers. If Phase 2 primitives use Tailwind classes instead of `var(--space-*)`, these tokens may remain permanently unconsumed. Verifier should flag this during Phase 2 verification.

---

### Gaps Summary

No gaps. All 5 observable truths verified. All 8 FRM requirements satisfied. All artifacts exist, are substantive, and are wired correctly. No blocker anti-patterns introduced by Phase 1 work.

The one deferred item (pre-existing TypeScript error in color-cycle-frame.tsx) does not constitute a Phase 1 gap — it is pre-existing, isolated, and does not affect CSS or runtime behavior. It is tracked in deferred-items.md and should be resolved in Phase 2.

---

_Verified: 2026-04-06_
_Verifier: Claude (gsd-verifier)_
