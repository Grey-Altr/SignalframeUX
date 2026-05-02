---
phase: 73-sfricheditor
reviewed: 2026-05-01T00:00:00Z
depth: standard
files_reviewed: 7
files_reviewed_list:
  - components/sf/sf-rich-editor.tsx
  - components/sf/sf-rich-editor-lazy.tsx
  - app/dev-playground/sf-rich-editor/page.tsx
  - stories/sf-rich-editor.stories.tsx
  - app/globals.css
  - tests/v1.10-phase73-sf-rich-editor.spec.ts
  - tests/v1.10-phase73-sf-rich-editor-axe.spec.ts
findings:
  critical: 0
  warning: 4
  info: 5
  total: 9
status: issues_found
---

# Phase 73: Code Review Report

**Reviewed:** 2026-05-01
**Depth:** standard
**Files Reviewed:** 7
**Status:** issues_found

## Summary

Phase 73 ships a Pattern B + P3-lazy ProseMirror rich-text editor that is fundamentally sound: the SSR boundary is honored on three independent axes (`ssr:false` in the lazy wrapper, `immediatelyRender:false` and `injectCSS:false` on `useEditor`), the `editor.getHTML() === value` controlled-loop guard is in place, the barrel non-export is intact, registry deferral matches Phase 71 precedent, and the `@layer signalframeux` ProseMirror block uses blessed spacing tokens with no hex colors, no border-radius, and no hardcoded magenta. SSR/cascade/Pattern-B/D-04/Cluster-C invariants all hold under static review.

The issues that surfaced are correctness gaps in the WCAG toolbar pattern (roving tabIndex updates state but never moves DOM focus, Home/End missing, Escape focus-return is brittle if the user has arrow-navigated), a redundant Tiptap dependency (StarterKit v3 already bundles `extension-link` and `extension-underline`, so the explicit `@tiptap/extension-link` top-level dep + duplicate `Link.configure(...)` registration is wasteful), some dead/silent fallback logic on `data-active`, and a couple of arbitrary pixel values that are not on blessed spacing stops. None blocks ship; all are worth addressing before v1.10 wraps.

## Warnings

### WR-01: Roving tabIndex never moves DOM focus on ArrowLeft/ArrowRight

**File:** `components/sf/sf-rich-editor.tsx:178-189`
**Issue:** `handleToolbarKeyDown` updates `focusedToolbarIndex` state, which re-renders the toolbar so a different button has `tabIndex={0}`, but DOM focus is never explicitly moved to that button. The user's keyboard focus stays on the previously-focused button, which now has `tabIndex={-1}`. Visually + screen-reader-wise this means: pressing ArrowRight changes which button "owns" the tab stop on next Tab cycle, but the user's current focus does not visibly travel along the toolbar — breaking the WCAG 2.1 APG Toolbar pattern (https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/). The Playwright spec does not catch this because it only verifies the Bold-active assertion path; it never presses ArrowRight and asserts that focus moved.
**Fix:** Move DOM focus alongside the state update, e.g. via a `useEffect` keyed on `focusedToolbarIndex` that focuses the corresponding button, or by querying the toolbar after state commit:
```tsx
const handleToolbarKeyDown = useCallback(
  (e: React.KeyboardEvent<HTMLDivElement>) => {
    let next = focusedToolbarIndex;
    if (e.key === "ArrowRight") next = Math.min(focusedToolbarIndex + 1, TOOLBAR_BUTTON_COUNT - 1);
    else if (e.key === "ArrowLeft") next = Math.max(focusedToolbarIndex - 1, 0);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TOOLBAR_BUTTON_COUNT - 1;
    else return;
    e.preventDefault();
    setFocusedToolbarIndex(next);
  },
  [focusedToolbarIndex]
);

useEffect(() => {
  // After re-render, focus the new tabIndex=0 button.
  toolbarRef.current
    ?.querySelector<HTMLElement>(`[data-toolbar-index="${focusedToolbarIndex}"]`)
    ?.focus();
}, [focusedToolbarIndex]);
```
Add `data-toolbar-index={index}` to each `SFButton` so the lookup is deterministic. Add a Playwright test that presses ArrowRight three times from the focused Bold button and asserts `document.activeElement` is now Strikethrough.

### WR-02: Home/End keys missing from toolbar keyboard model (WCAG APG gap)

**File:** `components/sf/sf-rich-editor.tsx:178-189`
**Issue:** The WCAG 2.1 APG Toolbar pattern requires Home (jump to first button) and End (jump to last button) on a roving-tabIndex toolbar. Only ArrowLeft/ArrowRight are implemented. axe-core does not flag missing keyboard handlers structurally, so the axe spec is silent on this; a manual NVDA/VO test would surface it.
**Fix:** Add Home/End handling alongside the arrow handlers (see WR-01 patch).

### WR-03: Escape focus-return targets `[tabindex='0']`, but that index can be anywhere after arrow-nav

**File:** `components/sf/sf-rich-editor.tsx:401-407`
**Issue:** The Escape handler queries `toolbarRef.current?.querySelector<HTMLElement>("[tabindex='0']")` and focuses whichever button currently has `tabIndex=0`. If the user has arrow-navigated to (say) "Code block" in the toolbar before clicking back into the editor and pressing Escape, focus returns to "Code block" — not to a stable, predictable landmark like the first button. The acceptance test passes only because it never advances `focusedToolbarIndex` before pressing Escape, so the spec doesn't exercise the regressing path. The component JSDoc says "Escape returns focus to the toolbar's first focusable button" (line 99), which is inconsistent with the implementation.
**Fix:** Decide on the contract and align code + JSDoc + test. Two options:
1. Always return focus to the first toolbar button (matches JSDoc): use `toolbarRef.current?.querySelector<HTMLElement>("button[aria-label]")` (first match) or reset `setFocusedToolbarIndex(0)` and let the WR-01 effect focus index 0.
2. Return focus to the most-recently-focused toolbar button (less surprising for keyboard power users): keep current code but update JSDoc + add a test that asserts focus returns to the post-arrow-nav button. Then explicitly persist `focusedToolbarIndex` across editor focus cycles.

### WR-04: Redundant Link extension registration (StarterKit v3 already includes Link)

**File:** `components/sf/sf-rich-editor.tsx:78, 142-145`
**Issue:** Tiptap v3 `StarterKit` already bundles `@tiptap/extension-link` (and `@tiptap/extension-underline`) — verified in `node_modules/@tiptap/starter-kit/package.json` and `dist/index.d.ts`, where `LinkOptions` and `UnderlineOptions` are imported and registered by default. The component imports `Link` separately and passes it into `extensions: [...]`, which causes the extension to be registered twice. Tiptap's extension manager warns about duplicate extension names at runtime ("Duplicate extension names found: ['link']"), and the second registration overrides the StarterKit defaults — which is in fact what gives `openOnClick: false`, so the runtime behavior happens to work. But the dependency declaration in `package.json` is unnecessary: `@tiptap/extension-link@3.22.5` will be hoisted as a transitive of starter-kit and is not needed as a top-level entry. The comment in the `_dep_re_01_decision` block at line 44 ("`@tiptap/extension-link` is separate from StarterKit in v3") is incorrect for v3 — true for v2 only.
**Fix:** Two options, pick one:
1. **Configure Link via StarterKit** — drop the explicit import and the explicit dep:
   ```tsx
   import StarterKit from "@tiptap/starter-kit";
   // ...
   extensions: [
     StarterKit.configure({
       heading: { levels: [1, 2, 3] },
       link: { openOnClick: false },
     }),
   ],
   ```
   Remove `@tiptap/extension-link` from `package.json`. Update `dep_added` in `_dep_re_01_decision` and re-run the bundle audit. This is the cleanest path.
2. **Disable Link in StarterKit and keep the explicit registration** — pass `link: false` to StarterKit so only one Link extension lives in the schema:
   ```tsx
   StarterKit.configure({ heading: { levels: [1, 2, 3] }, link: false }),
   Link.configure({ openOnClick: false }),
   ```
   Keep `@tiptap/extension-link` as an explicit dep for clarity. Either way, fix the comment at line 44.

## Info

### IN-01: Dead branch in `data-active` for Strikethrough and Inline code buttons

**File:** `components/sf/sf-rich-editor.tsx:259`
**Issue:** The first toolbar group computes `data-active={editor.isActive(label.toLowerCase()) || isActive || undefined}`. For `label = "Strikethrough"` this calls `editor.isActive("strikethrough")` (the correct mark name is `"strike"` — see line 240 where `isActive` is correctly computed via `editor.isActive("strike")`); for `label = "Inline code"` this calls `editor.isActive("inline code")` (a name with a space is never a registered mark). Both calls always return `false`, so the value silently falls through to the pre-computed `isActive`. This is dead code that masks a logic mismatch — readers must scan twice to confirm correctness, and a future refactor could easily delete `|| isActive` (which IS the load-bearing read).
**Fix:** Drop the `editor.isActive(label.toLowerCase())` branch entirely; the pre-computed `isActive` field already carries the correct truthiness:
```tsx
data-active={isActive || undefined}
```
Apply the same simplification at lines 286, 353, 381 for consistency (those already use the pre-computed pattern but have a redundant duplicate `editor.isActive(...)` call that re-runs the same predicate the row already computed — wasteful when `shouldRerenderOnTransaction:true` re-renders on every transaction).

### IN-02: `_dep_re_01_decision` rationale claim is incorrect for Tiptap v3

**File:** `components/sf/sf-rich-editor.tsx:44`
**Issue:** Comment reads `@tiptap/extension-link is separate from StarterKit in v3 (verified post-install via pnpm list)`. Verification against `node_modules/@tiptap/starter-kit/package.json` shows `extension-link` is a direct dep of starter-kit and is registered by the default StarterKit extension list (`dist/index.d.ts` imports `LinkOptions` and the source registers `Link` unconditionally unless `link: false` is passed). The "separate" claim was true in v2 but is false in v3 — see WR-04.
**Fix:** Update the rationale prose alongside the WR-04 fix, or replace with a corrected note: `In Tiptap v3, StarterKit auto-registers Link and Underline; we [drop / explicitly disable + re-register] to set openOnClick:false.`

### IN-03: Arbitrary pixel value `h-[200px]` in lazy skeleton

**File:** `components/sf/sf-rich-editor-lazy.tsx:37`
**Issue:** `<SFSkeleton className="h-[200px] w-full" />` uses 200px which is not on the SignalframeUX blessed spacing stops (4/8/12/16/24/32/48/64/96 → corresponding `--sfx-space-N` tokens). Per CLAUDE.md "DO NOT use arbitrary spacing values."
**Fix:** Either:
- Use `min-h-[var(--sfx-space-16)]` (matches the editor's own min-height floor at line 410), or
- Add a comment justifying the deviation if the visual mass of the skeleton needs to closely match the typical mounted-editor height (in which case 192px = `--sfx-space-24` × stop is closer to the blessed system).

### IN-04: Arbitrary pixel value `max-h-[120px]` in playground fixture

**File:** `app/dev-playground/sf-rich-editor/page.tsx:50`
**Issue:** `max-h-[120px]` on the controlled-output `<pre>` is not a blessed stop. This is fixture-only code (not production), so severity is low, but the convention should still hold.
**Fix:** Use `max-h-[var(--sfx-space-24)]` (96px) or a 96/128 stop, whichever reads better.

### IN-05: Storybook per-story `chromatic.delay` duplicates meta-level inheritance verbatim 4 times

**File:** `stories/sf-rich-editor.stories.tsx:24-29, 37-42, 50-55, 64-69`
**Issue:** Every story redeclares the same `parameters: { chromatic: { delay: 500 } }` block with an identical 4-line comment. The defensive duplication is intentional per the comment ("future story addition can't silently regress"), but at 4 stories the comment-to-code ratio is high and the next contributor will copy-paste a fifth identical block. Consider extracting a `STORY_PARAMS` constant.
**Fix:**
```tsx
const STORY_PARAMS = {
  // Per-story chromatic.delay duplicates meta-level inheritance — kept explicit
  // so any future story addition can't silently regress to <500ms.
  chromatic: { delay: 500 },
} as const;

export const Default: Story = { args: { placeholder: "Start typing..." }, parameters: STORY_PARAMS };
// etc.
```
Single source of truth, same defensive guarantee.

---

_Reviewed: 2026-05-01_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
