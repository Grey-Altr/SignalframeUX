---
phase: 22-token-finalization
generated: "2026-04-06T22:30:00Z"
finding_count: 3
high_count: 1
has_bdd_candidates: true
---

# Phase 22: Edge Cases

**Generated:** 2026-04-06T22:30:00Z
**Findings:** 3 (cap: 8)
**HIGH severity:** 1
**BDD candidates:** yes

## Findings

### 1. [HIGH] Duplicate token declarations if :root removal is missed

**Plan element:** `app/globals.css`
**Category:** error_path

When tokens are added to @theme but the :root removals are skipped or partially applied, both declarations coexist. In Tailwind v4 the :root value wins at runtime via CSS specificity cascade, making the @theme declaration effectively dead. The build succeeds with zero errors but utilities silently render wrong values. The task action is explicit about removing :root entries, but there is no automated assertion that the :root block does NOT contain these tokens after the edit.

**BDD Acceptance Criteria Candidate:**
```
Given app/globals.css has been edited to add tokens to @theme
When the executor runs the verify command
Then grep must confirm --color-success and --color-warning are ABSENT from the :root block (not just present in @theme)
```

### 2. [MEDIUM] canvas-cursor.tsx as undocumented resolveColor caller

**Plan element:** `lib/color-resolve.ts`
**Category:** boundary_condition

The acceptance criteria for Task 2 of plan 22-01 explicitly names canvas-cursor.tsx as an expected caller in the grep output ("returns only signal-mesh.tsx, glsl-hero.tsx, token-viz.tsx, color-resolve.ts itself, and canvas-cursor.tsx — no new callers"). However, the plan action does not include reading canvas-cursor.tsx to verify which token it resolves. If canvas-cursor.tsx resolves a token other than the core 5 (e.g., --color-accent or a custom token), the audit would be incomplete despite passing the stated check.

### 3. [LOW] SCAFFOLDING.md append ordering ambiguity

**Plan element:** `SCAFFOLDING.md`
**Category:** boundary_condition

Plan 22-02 Task 2 instructs appending Deferred Token Groups AFTER the Elevation Policy section added by Task 1. If Task 1 and Task 2 are executed in the same edit session, the ordering is preserved. But the acceptance criteria do not verify relative ordering of the two sections (Elevation Policy must precede Deferred Token Groups). If an executor reverses the append order, both greps pass but the document reads illogically.
