---
phase: 04-above-the-fold-lock
generated: "2026-04-05T00:00:00Z"
finding_count: 5
high_count: 2
has_bdd_candidates: true
---

# Phase 4: Edge Cases

**Generated:** 2026-04-05
**Findings:** 5 (cap: 8)
**HIGH severity:** 2
**BDD candidates:** yes

## Findings

### 1. [HIGH] ScrambleText import race: error.tsx useEffect fires before gsap-plugins resolves

**Plan element:** `app/error.tsx` (useEffect async import)
**Category:** error_path

The lazy `import("@/lib/gsap-plugins")` is async. If the component unmounts before the promise resolves (e.g., user navigates away immediately), the `gsap.to()` call fires on a detached element. No cleanup/cancellation is planned for the import promise.

**BDD Acceptance Criteria Candidate:**
```
Given the error page mounts and unmounts within 100ms of each other
When the dynamic import of gsap-plugins resolves after unmount
Then no GSAP animation is applied to a detached DOM element (no console error, no memory leak)
```

---

### 2. [HIGH] ComponentsExplorer empty state: setQuery/setActiveFilter scope not verified

**Plan element:** `components/blocks/components-explorer.tsx` (`setQuery` / `setActiveFilter` in empty state CTA)
**Category:** error_path

Plan 02 Task 2 Part A instructs: "Verify that `setQuery` and `setActiveFilter` (or equivalent state setters) are accessible in the render scope." This is a deferred verification, not a planned assertion. If the state setters are named differently (common in complex explorers), the RESET FILTERS button will be a no-op or throw at runtime.

**BDD Acceptance Criteria Candidate:**
```
Given the ComponentsExplorer has an active filter returning zero results
When the user clicks the RESET FILTERS button in the empty state
Then the query clears and the filter resets to ALL, causing the full component grid to rerender
```

---

### 3. [MEDIUM] hero-mesh reduced-motion: opacity 1 vs 0.45 discrepancy

**Plan element:** `components/blocks/hero.tsx` (HeroMesh wrapper opacity)
**Category:** boundary_condition

Plan 01 Task 1 Part C states: "hero-mesh gets `opacity: 1 !important`... when reduced-motion is active. This ensures the mesh is visible (at full opacity, not 0.45 — acceptable since it's a subtle canvas background)." However, Plan 03 Task 1 explicitly checks that `[data-anim="hero-mesh"]` is covered in the reduced-motion reset block. At `opacity: 1` the mesh may be visually heavier than the designed 0.45, potentially overriding the composition intent in reduced-motion. No task verifies the visual balance at full opacity.

---

### 4. [MEDIUM] Plan 03 reads SUMMARY files from Plans 01 and 02 as context — these don't exist pre-execution

**Plan element:** `.planning/phases/04-above-the-fold-lock/04-01-SUMMARY.md` / `04-02-SUMMARY.md`
**Category:** empty_state

Plan 03's context block references `@.planning/phases/04-above-the-fold-lock/04-01-SUMMARY.md` and `04-02-SUMMARY.md`. These files are outputs of Plans 01 and 02 execution — they do not exist at plan-check time and won't exist when Plan 03 loads context if execution is sequential within the same executor session. If SUMMARY files are absent, the executing agent has no post-execution context for QA. Plan 03 Task 2 (human checkpoint) depends on this context being present.

---

### 5. [LOW] Token-tabs placeholder: CORE_SCALE_COUNT and COLOR_SCALES constants assumed but not verified

**Plan element:** `components/blocks/token-tabs.tsx` (`COLOR_SCALES.length - CORE_SCALE_COUNT`)
**Category:** boundary_condition

Plan 02 Task 2 Part C uses `COLOR_SCALES.length - CORE_SCALE_COUNT` in the placeholder text. If these constants don't exist at the expected scope, the expression produces a build error. The plan instructs the executor to "Look for where the existing toggle button is rendered" but does not pre-verify constant names.
