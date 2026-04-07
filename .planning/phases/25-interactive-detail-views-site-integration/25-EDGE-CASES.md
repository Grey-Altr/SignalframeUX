---
phase: 25-interactive-detail-views-site-integration
generated: "2026-04-07T00:00:00Z"
finding_count: 6
high_count: 2
has_bdd_candidates: true
---

# Phase 25: Edge Cases

**Generated:** 2026-04-07
**Findings:** 6 (cap: 8)
**HIGH severity:** 2
**BDD candidates:** yes

## Findings

### 1. [HIGH] GSAP double-close race: closingRef guard missing from Escape handler path

**Plan element:** `components/blocks/component-detail.tsx` — `closingRef` ref
**Category:** error_path

The plan defines a `closingRef = useRef(false)` to guard against double-close, but the Escape key handler calls `onClose()` directly (RESEARCH.md code example line 463-473) and then `triggerRef.current?.focus()` — it does not check or set `closingRef`. If Escape is pressed mid-animation (during the close tween), GSAP's `onComplete: onClose` fires after focus has already been reset, potentially triggering a second state update on an unmounted panel.

**BDD Acceptance Criteria Candidate:**
```
Given a detail panel close animation is in progress (GSAP tween running)
When the user presses Escape a second time
Then the panel does not trigger a second onClose call or React state update
```

### 2. [HIGH] Pattern B/C variant fallback: `code` field used as fallback but the action never wires it

**Plan element:** `components/blocks/component-detail.tsx` — `VariantPreview` function
**Category:** error_path

The VARIANTS tab sub-component shows `{componentName} -- NOT IN BARREL (PATTERN B/C)` for components absent from sf/index.ts. The action does not specify displaying the code snippet fallback for Pattern B/C entries (RESEARCH.md open question 2 recommends "LAZY COMPONENT — see CODE tab" placeholder). The plan's action text for the fallback div shows the bare "NOT IN BARREL" string, but the PROPS tab and CODE tab will still render (from API_DOCS and highlightedCode respectively). This is a visible degradation for SFDrawer, SFCalendar, SFMenubar entries — not an error, but the user experience of the fallback is unspecified.

**BDD Acceptance Criteria Candidate:**
```
Given a component card for SFDrawer (Pattern B — not in sf/index.ts barrel) is clicked
When the VARIANTS tab is visible
Then each variant cell shows a legible placeholder message (not a blank or JS error) indicating the component is lazy-loaded and directing users to the CODE tab
```

### 3. [MEDIUM] Empty props table state: no handling when `doc` is undefined for known components

**Plan element:** `components/blocks/component-detail.tsx` — props table `(doc?.props ?? [])`
**Category:** empty_state

When `doc` is `undefined` (because `API_DOCS[entry.docId]` returns undefined — already confirmed for indices 006 and 103 per Phase 24 VERIFICATION.md), the props table renders the "NO PROP DOCUMENTATION AVAILABLE" message. This is planned. However the plan does not specify what the VARIANTS and CODE tabs show when `doc` is undefined — only the PROPS tab empty state is described. `highlightedCode` is still passed (from `COMPONENT_REGISTRY[index].code`), so the CODE tab renders correctly. But no guard is shown for a `doc`-dependent conditional in the header (the layer badge and pattern come from `entry`, not `doc`, so this is likely safe — but worth noting).

### 4. [MEDIUM] componentGrid triggerRef type mismatch: `HTMLElement | null` vs `HTMLDivElement | null`

**Plan element:** `components/blocks/component-grid.tsx` — `triggerRefs` ref object
**Category:** boundary_condition

Plan 02 Task 1 action defines `triggerRefs` as `useRef<Record<string, HTMLElement | null>>({})` while Plan 01 defines `ComponentDetailProps.triggerRef` as `React.RefObject<HTMLElement | null>`. However Plan 01 Task 1 defines `triggerRefs` in `components-explorer.tsx` as `useRef<Record<string, HTMLDivElement | null>>({})`. The two caller sites use different element types (`HTMLDivElement` in explorer, `HTMLElement` in grid). TypeScript accepts this (HTMLDivElement extends HTMLElement), but the inconsistency could produce a type error depending on the ComponentDetail props interface definition.

### 5. [MEDIUM] Session state key collision risk: homepage uses `useState` but explorer uses `useSessionState(DETAIL_OPEN)`

**Plan element:** `components/blocks/component-grid.tsx` — `useState` for `openIndex`
**Category:** boundary_condition

Plan 02 correctly notes "Homepage does NOT use useSessionState for DETAIL_OPEN — session persistence is for /components only per SI-01." However if a user opens a detail panel on the homepage and then navigates to /components, the `useSessionState(DETAIL_OPEN, null)` in ComponentsExplorer will find `null` in sessionStorage (homepage used plain `useState`, not sessionStorage). This is the expected behavior — but means the session persistence spec (SI-01 "remember last-opened component across navigation") only applies within /components navigations, not from homepage to /components. The plan documents this correctly, but the requirement wording is slightly ambiguous.

### 6. [LOW] `window.scrollTo` audit: plan does not include grep step for new files

**Plan element:** `components/blocks/component-detail.tsx` — entire file
**Category:** boundary_condition

Plan 02 Task 2 bundles a `grep -r "window.scrollTo"` check on three files but not on `app/components/page.tsx` which is also modified. The omission is minor since page.tsx is a Server Component with no scroll logic, but the verification step could be more complete.
