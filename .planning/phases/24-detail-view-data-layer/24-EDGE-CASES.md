---
phase: 24-detail-view-data-layer
generated: "2026-04-06T00:00:00Z"
finding_count: 5
high_count: 2
has_bdd_candidates: true
---

# Phase 24: Edge Cases

**Generated:** 2026-04-06
**Findings:** 5 (cap: 8)
**HIGH severity:** 2
**BDD candidates:** yes

## Findings

### 1. [HIGH] Shiki singleton highlighter not reset on error — Promise cached in rejected state

**Plan element:** `lib/code-highlight.ts` — `highlighterPromise` module-level variable
**Category:** error_path

When `createHighlighter()` rejects (e.g., malformed theme object, missing tsx grammar), the module-level `highlighterPromise` caches the rejected Promise. All subsequent calls to `highlight()` immediately re-throw the same error with no recovery path.

**BDD Acceptance Criteria Candidate:**
```
Given highlighterPromise is set to a rejected Promise (createHighlighter throws)
When highlight() is called a second time
Then it should retry initialization rather than propagating the cached rejection
```

### 2. [HIGH] COMPONENT_REGISTRY docId keys must exactly match API_DOCS keys at consume time

**Plan element:** `lib/component-registry.ts` — `docId` field in ComponentRegistryEntry
**Category:** boundary_condition

Plan 01 specifies docId convention as camelCase SF component names (e.g., `sfButton`). Plan 02 specifies the same new keys in api-docs.ts. However, neither plan has an explicit cross-check step: if the executor authors `docId: "sfToastFrame"` in registry.ts and the api-docs key ends up as `sfToast`, Phase 25 will silently render empty props tables. There is no TypeScript type safety enforcing this link (it is a string lookup).

**BDD Acceptance Criteria Candidate:**
```
Given component-registry.ts has docId: "sfButton"
When api-docs.ts is inspected for a matching top-level key
Then API_DOCS["sfButton"] must exist and have a non-empty props array
```

### 3. [MEDIUM] highlight() called with empty string or whitespace-only code

**Plan element:** `lib/code-highlight.ts` — `highlight(code: string): Promise<string>`
**Category:** empty_state

The `highlight()` function signature accepts any string. If called with `""` or `"  "` (which can happen if a registry entry has an empty `code` field), shiki will return minimal markup. The plan has no guard for empty input, and the returned HTML may break Phase 25 rendering assumptions.

### 4. [MEDIUM] Pattern B component index entries in component-registry.ts use direct import paths that Phase 25 cannot statically import at the module level

**Plan element:** `lib/component-registry.ts` — `importPath` field for indices "012", "026", "027"
**Category:** boundary_condition

The plan correctly sets direct importPath for Pattern B components. However, Phase 25 will need to dynamically import these components. The registry field documents the intent but Phase 25 must not attempt a static `import { SFDrawer } from "@/components/sf/sf-drawer-lazy"` at module level (defeats lazy loading). This is a documentation gap that the plan does not call out explicitly — the registry data is correct but consumer behavior is unconstrained.

### 5. [LOW] api-docs.ts entries for non-grid utility components (14 items in Plan 02 action) have no dedicated acceptance criterion

**Plan element:** `lib/api-docs.ts` — NON-GRID UTILITY COMPONENTS block in Plan 02 Task 1 action
**Category:** empty_state

Plan 02 lists ~14 non-grid utility component entries (sfSeparator, sfTooltip, sfSheet, etc.) in the action text but the acceptance criteria only gate on total count >= 49 and spot-checks of sfButton/sfAccordion/sfContainer. If the executor omits the 14 non-grid entries, the AC count (27 + 22 grid = 49) is still satisfied without them. DV-02 full coverage would be silently underdelivered.
