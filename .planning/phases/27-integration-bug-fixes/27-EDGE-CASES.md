---
phase: 27-integration-bug-fixes
generated: "2026-04-07T00:00:00Z"
finding_count: 4
high_count: 1
has_bdd_candidates: true
---

# Phase 27: Edge Cases

**Generated:** 2026-04-07
**Findings:** 4 (cap: 8)
**HIGH severity:** 1
**BDD candidates:** yes

## Findings

### 1. [HIGH] PreviewBadge render: SFBadge import not verified in component-grid.tsx

**Plan element:** `components/blocks/component-grid.tsx`
**Category:** error_path

Task 1 introduces a new PreviewBadge function that uses SFBadge. The action notes "SFBadge is already imported at line 12" but does not include a verify step confirming the import still exists after PreviewDropdown is deleted. If the import was conditional or bundled with the PreviewDropdown import statement, deleting PreviewDropdown could silently remove the SFBadge import, causing a TypeScript error only caught by `tsc --noEmit`.

**BDD Acceptance Criteria Candidate:**
```
Given component-grid.tsx has PreviewDropdown removed
When PreviewBadge is added using SFBadge component
Then tsc --noEmit exits with 0 errors and SFBadge remains importable at the top of the file
```

### 2. [MEDIUM] homepageIds length mismatch: if COMPONENTS has 12 entries but homepageIds has fewer or more

**Plan element:** `app/page.tsx`
**Category:** boundary_condition

Task 1 updates `homepageIds` to the new 12-ID list. The pre-computation loop in `app/page.tsx` runs `highlightedCodeMap` for each ID. If any ID in `homepageIds` has no `COMPONENT_REGISTRY` entry (e.g. a typo like `"106"` instead of `"104"`), `getHighlightedCode` returns an empty string — the CODE tab shows blank. The verify step checks grep for `'101'` but does not confirm all 12 IDs have non-empty registry entries.

### 3. [MEDIUM] CSS opacity 0.4 on SignalOverlay panel may render dark on dark backgrounds

**Plan element:** `app/globals.css`
**Category:** boundary_condition

The `opacity: 0.4` rule applied to `#signal-overlay-panel` under `[data-modal-open]` will partially show the overlay panel contents at low opacity against the page background. If the detail panel is open and the overlay panel was previously open (a race condition: user opens overlay, then clicks a grid card), the panel will be visible-but-dimmed rather than hidden. The requirement only says "not clickable" (pointer-events: none), but opacity 0.4 may create visual confusion. The plan correctly notes this is the intended behavior, but no edge state is handled for the panel-open + modal-open simultaneous state.

### 4. [LOW] PREVIEW_MAP keys updated but PreviewDropdown function deletion may leave dead import

**Plan element:** `components/blocks/component-grid.tsx`
**Category:** error_path

If the original file imports a component exclusively for use in PreviewDropdown (e.g., a SFSelect or SFDropdown import), deleting the PreviewDropdown function leaves an unused import. TypeScript may warn or produce an error depending on `tsconfig.json` `noUnusedLocals` setting. The verify step checks `tsc --noEmit` which would catch this, but the action does not explicitly call this out.

