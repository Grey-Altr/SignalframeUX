---
phase: 01-frame-foundation
generated: "2026-04-05T00:00:00Z"
finding_count: 5
high_count: 2
has_bdd_candidates: true
---

# Phase 1: Edge Cases

**Generated:** 2026-04-05
**Findings:** 5 (cap: 8)
**HIGH severity:** 2
**BDD candidates:** yes

## Findings

### 1. [HIGH] VHS namespace migration: partial rename leaves mismatched var declaration/usage

**Plan element:** `app/globals.css` (01-01, Task 2, action step 2 — line-number targeted replacements)
**Category:** error_path

The action targets 4 specific line numbers (137, 138, 1429, 1494) for find-replace. If globals.css line counts have shifted since research (the file is 1500+ lines with active development), one of the four replacements could miss, creating a state where `--sf-vhs-crt-opacity` is declared but `var(--vhs-crt-opacity)` is still called. The verify command counts occurrences of each form but does not confirm the two declarations and two usages are internally consistent as pairs.

**BDD Acceptance Criteria Candidate:**
```
Given the executor replaces the two :root declarations to --sf-vhs-* but misses one var() call site
When the browser renders the VHS overlay
Then the overlay opacity silently falls back to the hardcoded value (0.6 or 0.03) with no build error or visible warning
```

---

### 2. [HIGH] CSS fallback verify command misses spacing/layout var() calls

**Plan element:** Task 1 verify grep in Plan 01-03 — `grep -n "var(--color-[^,)]*)"` and `grep -n "var(--font-[^,)]*)"`
**Category:** boundary_condition

The automated verify only checks `--color-` and `--font-` prefixed var() calls for missing fallbacks. Spacing/layout var() calls (`var(--max-w-content)`, `var(--gutter)`, `var(--gutter-sm)`, `var(--nav-height)`) are not included in the verify pattern. The acceptance criterion AC-1/AC-2 covers colors and fonts but the stated requirement FRM-04 says "Every CSS custom property has a declared fallback" — spacing vars could pass the automated check without fallbacks.

**BDD Acceptance Criteria Candidate:**
```
Given Plan 01-03 Task 1 completes and both grep verify commands return 0 lines
When globals.css contains var(--max-w-content) at a usage site without a comma-fallback
Then the automated verify passes silently, and the missing fallback is only discovered during manual browser QA
```

---

### 3. [MEDIUM] top-5/left-5 replacement in api-explorer.tsx may be a structural positioning value

**Plan element:** `components/blocks/api-explorer.tsx` line 730 `top-5 left-5` → `top-6 left-6` (01-02, Task 1)
**Category:** boundary_condition

The CONTEXT.md exempts structural measurements from blessed-stop enforcement ("Exempt structural measurements: nav-height 83px, border-width, fixed-position offsets"). `top-5 left-5` on an absolute-positioned element in api-explorer is likely an overlay positioning value — it may qualify as a structural measurement exemption (like `bottom-20` in global-effects.tsx). The plan treats it as non-exempt without documenting rationale. A 4px positional shift per axis may not be visually significant but violates the exemption logic if misclassified.

---

### 4. [MEDIUM] Plan 01-01 Task 1 action shows --nav-height in the additive CSS block, suggesting possible duplicate declaration

**Plan element:** `app/globals.css` `:root` block (01-01, Task 1, action step 1)
**Category:** error_path

The CSS block in action step 1 includes `--nav-height: 83px;` in the code sample, but --nav-height already exists in globals.css. If the executor copies the full block verbatim as an insertion rather than reading existing content and inserting only new tokens after --nav-height, a duplicate custom property declaration will be created. CSS handles duplicates by using the last declaration, so this may not break anything visually, but it creates a confusing duplicate in the single source of truth file.

---

### 5. [LOW] @media print `position: static !important` on `*` may disrupt sticky/relative layout elements

**Plan element:** `app/globals.css` @media print block `* { position: static !important }` (01-03, Task 2)
**Category:** error_path

Applying `position: static !important` universally resets all sticky, relative, and absolute elements. While `nav` is already hidden by a separate rule, other components using `position: relative` for z-index stacking context or `position: sticky` for in-page anchors will flatten to static flow. The stated goal is "preserve layout structure" — this rule partially contradicts it. The visible impact in print preview would be collapsed stacking contexts and repositioned absolutely-placed decorative elements (likely acceptable, but unspecified).
