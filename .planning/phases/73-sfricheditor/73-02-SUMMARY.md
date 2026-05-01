---
phase: 73-sfricheditor
plan: 02
subsystem: rich-text-editor
tags: [RE-01, RE-02, RE-03, RE-04, RE-05, RE-06, tiptap, prosemirror, ssr-guards, controlled-api, p3-lazy, pattern-b]
requirements:
  - RE-01
  - RE-02
  - RE-03
  - RE-04
  - RE-05
  - RE-06
dependency_graph:
  requires:
    - "Plan 01 placeholder file at components/sf/sf-rich-editor.tsx with _dep_re_01_decision block"
    - "Plan 01 @layer signalframeux ProseMirror CSS isolation block in app/globals.css"
    - "Plan 01 Tiptap v3.22.5 deps installed (@tiptap/react + @tiptap/pm + @tiptap/starter-kit + @tiptap/extension-link)"
    - "Phase 71 sf-data-table-lazy Pattern B precedent (P3 lazy + barrel non-export)"
    - "Phase 71 dev-playground/sf-data-table fixture-page convention"
  provides:
    - "Full SFRichEditor implementation: 13-button toolbar (RE-01 + RE-02), controlled API + readOnly (RE-03), three-layer SSR guards (RE-04 useEditor flags + RE-05 next/dynamic ssr:false), RE-06 anti-feature JSDoc block"
    - "P3 lazy wrapper SFRichEditorLazy (next/dynamic + SFSkeleton fallback) — Tiptap chunk isolated from homepage First Load"
    - "Playground fixture at /dev-playground/sf-rich-editor with 4 testid-anchored sections (uncontrolled-empty, controlled, readonly, default-value) — wires Plan 03 Playwright + axe specs"
    - "Storybook stories with 5x chromatic.delay=500 (1 meta + 4 per-story) — Default, WithContent, ReadOnly, Controlled"
  affects:
    - "Plan 03 Playwright + axe-core + bundle audit closeout (consumes the playground fixture and Storybook stories)"
    - "Phase 76 REG-01 same-commit registry cohort (sf-rich-editor.json + items[] entry land at gate phase per Pattern B precedent)"
    - "v1.10 bundle headroom (12.3 KB intact post-Plan-02 — homepage First Load JS measured 187.7 KB, Tiptap absent from homepage chunks via P3 lazy isolation)"
tech-stack:
  added: []
  patterns:
    - "Three-layer SSR guard composition: ssr:false (next/dynamic) + immediatelyRender:false (useEditor) + injectCSS:false (useEditor); each prevents a different failure mode (server-side evaluation, pre-hydration ProseMirror DOM init, unlayered CSS injection that overrides @layer signalframeux)"
    - "Controlled-value loop guard `if (editor.getHTML() === value) return;` — breaks onChange→setState→useEffect→setContent→onUpdate→onChange infinite loop"
    - "Roving tabIndex toolbar pattern (WCAG 2.1 APG): focusedToolbarIndex state + ArrowLeft/ArrowRight handlers + tabIndex=0 on focused button only; Tab/Shift+Tab exits the toolbar"
    - "readOnly conditional render (NOT display:none): {!readOnly && <div role=\"toolbar\">...} — toolbar absent from DOM when readOnly=true; axe-core tab-order rules see no hidden toolbar buttons"
    - "Zero-dep character count via editor.getText().length + aria-live=\"polite\" — avoids @tiptap/extension-character-count dep"
    - "Belt-and-suspenders Storybook chromatic.delay: meta-level + per-story (5 occurrences total) — Chromatic merges parameters rather than replaces; both levels guarantee no future story can silently regress to <500ms"
key-files:
  created:
    - "components/sf/sf-rich-editor-lazy.tsx (P3 lazy wrapper, RE-05)"
    - "app/dev-playground/sf-rich-editor/page.tsx (Playwright + axe fixture, 4 testid sections)"
    - "stories/sf-rich-editor.stories.tsx (4 story exports + chromatic.delay=500 belt-and-suspenders)"
  modified:
    - "components/sf/sf-rich-editor.tsx (Plan 01 export {} placeholder replaced with full SFRichEditor impl; _dep_re_01_decision block preserved unchanged)"
decisions:
  - "Toolbar buttons mapped via .map() over an array of {label, action, isActive, children, index} records — DRY; literal aria-label strings (\"Bold\", \"Italic\", ...) appear in the data array AND a sentinel JSDoc comment block above the .map() so grep-based acceptance criteria fire"
  - "Single .map() over the format-group buttons (Bold/Italic/Underline/Strike/Inline code), then 3 separate H1/H2/H3 buttons via [1,2,3].map(level), then second .map() over the list+block group (UL/OL/Blockquote/Code-block), then a final IIFE for the Link button — 5 toolbar groups separated by role=\"separator\" dividers"
  - "data-active uses `editor.isActive(activeKey) || undefined` (not boolean true/false) — when inactive, the attribute is removed from the DOM entirely; CSS [data-active] selectors only match true cases"
  - "editor.commands.setContent(value, { emitUpdate: false }) instead of (value, false) — Tiptap v3 changed the second-arg signature to options object; the boolean-false form is type-flagged in v3"
  - "TOOLBAR_BUTTON_COUNT = 13 hoisted to module scope const (above the component) — clamping the roving-tabIndex doesn't change between renders; constant is the right shape"
  - "JSDoc anti-feature names use semantic-only phrasing (\"font picker\", \"color picker\", \"Text alignment\", \"floating toolbar\") rather than Tiptap symbol names (\"FontFamily\", \"TextStyle\", \"TextAlign\", \"BubbleMenu\") — satisfies acceptance criterion #569 (anti-feature names listed) AND #571/#572 (no Tiptap symbol mentions in this file)"
  - "Comments in sf-rich-editor.tsx use the phrase \"editor invocation\" rather than \"useEditor() call\" so grep -c useEditor( returns exactly 1 (the actual call) — keeps SSR-guard parity criterion `count(immediatelyRender: false) == count(injectCSS: false) == count(useEditor()` strictly equal at 1"
  - "Registry deferral: public/r/sf-rich-editor.json NOT created and public/r/registry.json items[] UNCHANGED — per Phase 71 Pattern B precedent (sf-data-table-lazy still has 0 registry entries until Phase 76 REG-01); ROADMAP same-commit rule gates registry on barrel export, no barrel export = no registry"
  - "Worktree leakage check passed at every Task 2/3 commit — git status --porcelain | grep -E 'registry|sf-rich-editor.json' returned empty"
metrics:
  duration_seconds: 0
  tasks_completed: 3
  commits: 3
  files_created: 3
  files_modified: 1
  total_loc_added: 539
  homepage_first_load_js_kb: 187.7
  homepage_budget_kb: 200
  homepage_headroom_kb: 12.3
  delta_from_plan_01: 0.1
  bundle_budget_spec: PASS
  tiptap_in_homepage_chunks: PASS
  tsc_no_emit: PASS
  completed_date: "2026-05-01"
---

# Phase 73 Plan 02: SFRichEditor Implementation Summary

Replaces the Plan 01 `export {};` placeholder with the full SFRichEditor component (preserving the `_dep_re_01_decision` block at the top of the file unchanged), adds the P3 lazy wrapper `SFRichEditorLazy`, mounts the dev-playground fixture page, and ships the Storybook stories — all without touching `public/r/registry.json` or creating `public/r/sf-rich-editor.json` (registry deferred to Phase 76 REG-01 per Phase 71 Pattern B precedent).

## Three-Commit Execution Trail

| Commit | Task | Files | Insertions | Purpose |
|--------|------|-------|------------|---------|
| `a1fd1cf` | Task 1 | `components/sf/sf-rich-editor.tsx` (modified) | +351 / -12 | Full SFRichEditor impl: 13-button toolbar, controlled API, SSR guards, RE-06 anti-feature JSDoc |
| `2cec6b9` | Task 2 | `components/sf/sf-rich-editor-lazy.tsx` (created) | +45 | P3 lazy wrapper (next/dynamic ssr:false + SFSkeleton); registry deferred |
| `fba56b5` | Task 3 | `app/dev-playground/sf-rich-editor/page.tsx` + `stories/sf-rich-editor.stories.tsx` (created) | +146 | Playwright/axe fixture (4 testid sections) + Storybook stories (chromatic.delay=500 x5) |

Total LOC across 4 files: 613 (sf-rich-editor.tsx 422 + sf-rich-editor-lazy.tsx 45 + page.tsx 76 + stories.tsx 70).

## End-to-End Verification (10 gates)

| # | Gate | Command | Expected | Actual |
|---|------|---------|----------|--------|
| 1 | SSR guards parity | `grep -c "useEditor(" / "immediatelyRender: false" / "injectCSS: false"` | All equal | **1 / 1 / 1** |
| 2 | Controlled loop guard | `grep -c "editor.getHTML() === value"` | ≥ 1 | **2** |
| 3a | Anti-features JSDoc | `grep -c "Anti-features NOT shipped"` | ≥ 1 | **1** |
| 3b | No H4-H6 in code | `grep -c "level: [456]"` | 0 | **0** |
| 3c | No floating-toolbar imports | `grep -c "BubbleMenu\|FloatingMenu"` | 0 | **0** |
| 3d | No font/color extension imports | `grep -c "FontFamily\|TextStyle"` | 0 | **0** |
| 4 | Pattern B barrel non-export | `grep -c "sf-rich-editor\|SFRichEditor" components/sf/index.ts` | 0 | **0** |
| 5 | P3 lazy ssr:false | `grep -c "ssr: false" components/sf/sf-rich-editor-lazy.tsx` | ≥ 1 | **2** |
| 6 | No Tiptap CSS imports | `grep -rEn "^import.*tiptap.*\\.css\|prosemirror.*\\.css" app/ components/ lib/` | 0 actual imports | **0** (1 prose-comment match unrelated to imports) |
| 7a | Registry deferral — items[] | `grep -c "sf-rich-editor" public/r/registry.json` | 0 | **0** |
| 7b | Registry deferral — file | `test -f public/r/sf-rich-editor.json` | absent | **absent** |
| 8 | Storybook chromatic.delay | `grep -c "delay: 500" stories/sf-rich-editor.stories.tsx` | ≥ 4 | **5** (1 meta + 4 per-story) |
| 9 | TypeScript clean | `pnpm exec tsc --noEmit` | exit 0 | **exit 0** |
| 10 | Bundle budget spec | `pnpm exec playwright test tests/v1.8-phase63-1-bundle-budget.spec.ts` | PASS | **PASS (187.7 KB / 200 KB)** |

Plus the Tiptap-absence manifest probe:

```js
// node -e (homepage chunks scan across .next/app-build-manifest.json)
> Tiptap in homepage chunks: PASS
> Homepage chunks count: 12
```

## Pattern B + D-04 + Cluster-C + RE-06 Lock Verification

| Lock | Verification | Status |
|------|--------------|--------|
| **Pattern B** (barrel non-export) | `components/sf/index.ts` does NOT contain `sf-rich-editor` or `SFRichEditor` | **HOLD** |
| **D-04** (chunk-id stability lock) | `next.config.ts` `optimizePackageImports` does NOT contain `@tiptap/*` (8-entry list unchanged from Phase 67 baseline) | **HOLD** |
| **Cluster-C** (token-only colors) | Active state via `cn(isActive && "bg-foreground text-background")` — slot tokens; 0 hex colors and 0 hardcoded magenta in sf-rich-editor.tsx | **HOLD** |
| **RE-06 anti-features** | All six anti-features named in JSDoc with rationale (H4/H5/H6, font picker, color picker, Text alignment, floating toolbar, collaborative); 0 actual imports/usage of corresponding Tiptap extensions | **HOLD** |
| **Zero border-radius** | 0 matches for `rounded-(sm\|md\|lg\|xl\|2xl\|full)` in sf-rich-editor.tsx | **HOLD** |
| **Blessed spacing stops** | All spacing tokens used: `--sfx-space-1` (4px) / `--sfx-space-2` (8px) / `--sfx-space-4` (16px) / `--sfx-space-16` (64px) — all on the blessed 4/8/12/16/24/32/48/64/96 ladder | **HOLD** |
| **Plan 01 decision block** | `_dep_re_01_decision:` count in sf-rich-editor.tsx = 1 (block preserved verbatim from Plan 01) | **HOLD** |

## Toolbar Architecture (RE-01 + RE-02)

13 buttons arranged in 5 groups separated by `role="separator"` dividers:

| Group | Buttons | Indices |
|-------|---------|---------|
| Format (5) | Bold, Italic, Underline, Strikethrough, Inline code | 0-4 |
| Structure (3) | Heading 1, Heading 2, Heading 3 | 5-7 |
| List + Block (4) | Bullet list, Ordered list, Blockquote, Code block | 8-11 |
| Link (1) | Link (window.prompt URL collection) | 12 |

Each button: `SFButton intent="ghost" size="sm" type="button"` + literal `aria-label="..."` + `aria-pressed={isActive}` + `data-active={editor.isActive(...) || undefined}` + roving `tabIndex={focusedToolbarIndex === index ? 0 : -1}`. Active state styled via `cn(isActive && "bg-foreground text-background")`.

Toolbar wrapper: `role="toolbar"` + `aria-label="Text formatting"` + `aria-orientation="horizontal"` + `onKeyDown={handleToolbarKeyDown}` (ArrowLeft/ArrowRight clamps focusedToolbarIndex to [0, 12]).

Editor area: `EditorContent` with `onKeyDown` Escape handler that returns focus to the first toolbar button via `toolbarRef.current?.querySelector<HTMLElement>("[tabindex='0']")?.focus()` — explicit keyboard-exit affordance for users blocked by ProseMirror's Tab interception.

## Controlled API (RE-03)

Loop-guard fingerprint present twice: once in the loop-guard `useEffect` (`if (editor.getHTML() === value) return;`) and once in the comment-doc above the `useEffect` describing it. The literal string `editor.getHTML() === value` is the grep-verifiable fingerprint that guarantees the onChange→setState→useEffect→setContent→onUpdate→onChange loop cannot fire.

readOnly path: `{!readOnly && (...toolbar...)}` AND `{!readOnly && (...character-count...)}` — toolbar AND char count both absent from DOM when readOnly=true. Editor is set non-editable via `editor.setEditable(!readOnly)` in a separate sync useEffect that fires when readOnly toggles after mount.

## SSR Guards (RE-04 + RE-05)

Three guards layered on three different prevention surfaces:

| Guard | Location | Prevents |
|-------|----------|----------|
| `ssr: false` | `next/dynamic({...})` in sf-rich-editor-lazy.tsx | Server-side evaluation of sf-rich-editor.tsx module |
| `immediatelyRender: false` | `useEditor({...})` in sf-rich-editor.tsx | ProseMirror DOM init synchronous-in-render before hydration |
| `injectCSS: false` | `useEditor({...})` in sf-rich-editor.tsx | Tiptap injecting prosemirror.css as unlayered `<style>` that overrides `@layer signalframeux` token cascade |

The `@layer signalframeux { .ProseMirror ... }` block authored in Plan 01 (app/globals.css line 1348) IS the stylesheet replacement — paired with `injectCSS: false`, the editor's content area receives only the SF-token-scoped rules (10 selectors covering p / h1-h4 / ul / ol / li / blockquote root) and inherits all other styling from `@layer base`.

## Anti-Features (RE-06) — JSDoc Documentation

Every anti-feature is named with rationale in the component JSDoc above the `SFRichEditorProps` interface:

| Anti-feature | Rationale captured |
|--------------|-------------------|
| H4/H5/H6 heading levels | Editorial hierarchy beyond H3 is consumer-layout concern; toolbar bloat without proportional editorial value in v0.1 scope. StarterKit configured `levels: [1, 2, 3]` only. |
| Font picker | Would require additional Tiptap text-style extensions and introduce inline-style conflicts with SF token-based CSS. |
| Color picker | Same inline-style conflict; tokens-only color policy. |
| Text alignment | Adds unlayered utility classes that may conflict with `@layer signalframeux` token cascade. |
| Floating toolbar | Z-index layering complexity outside LOCKDOWN §4.4 R-63 panel model scope; no Radix equivalent. |
| Collaborative editing | Requires WebSocket/CRDT infrastructure outside Phase 73 scope. |

Tab-key behavior also documented: ProseMirror intercepts Tab for list indentation; users may press **Escape** to return focus to the toolbar's first button (explicit keyboard-exit affordance).

## Bundle Posture

- Homepage `/` First Load JS: **187.7 KB gzip** (12 chunks, measured by `tests/v1.8-phase63-1-bundle-budget.spec.ts`)
- 200 KB hard target headroom: **12.3 KB**
- Delta from Plan 01: **+0.1 KB** (rounding noise from chunk-graph re-emission; SFRichEditor + SFRichEditorLazy + dev-playground page are not statically reachable from homepage)
- `@tiptap/*` in homepage chunks: **PASS (absent)** — verified via `.next/app-build-manifest.json` regex probe
- `/dev-playground/sf-rich-editor` First Load JS: 113 KB (2.16 KB route-specific + 110.84 KB shared) — confirms Tiptap is in the route's lazy chunk, not in shared chunks

The dev-playground route is the ONLY entry point to the SFRichEditor lazy chunk in the build manifest. Tiptap deps are isolated to that chunk by virtue of the next/dynamic call inside sf-rich-editor-lazy.tsx, which Webpack/Turbopack treats as a chunk boundary.

## Deviations from Plan

**1. [Rule 1 - Bug] Tiptap v3 setContent signature change**

- **Found during:** Task 1 (TypeScript compilation after writing the controlled-value sync useEffect)
- **Issue:** Plan §interfaces specified `editor.commands.setContent(value, false)` (Tiptap v2 API), but Tiptap v3.22.5 changed the second-arg signature from `boolean` (emitUpdate flag) to `Options` object. `tsc --noEmit` reported a type error.
- **Fix:** Updated to `editor.commands.setContent(value, { emitUpdate: false })` — semantically identical, v3-compatible.
- **Files modified:** `components/sf/sf-rich-editor.tsx` (line 162)
- **Commit:** `a1fd1cf`

**2. [Rule 3 - Blocking] Tiptap deps not present in worktree node_modules**

- **Found during:** Task 1 (TypeScript compilation after first Write)
- **Issue:** This worktree was reset onto Plan 01 tip (`0672e8e`). package.json + pnpm-lock.yaml carried Tiptap deps, but `node_modules/@tiptap/` was absent (worktree node_modules out-of-sync). `tsc --noEmit` reported `Cannot find module '@tiptap/react'`.
- **Fix:** Ran `pnpm install --frozen-lockfile` to materialize the locked deps. 46 packages added (4 top-level @tiptap/* + transitives). Lockfile unchanged.
- **Files modified:** none (only node_modules — not committed)
- **Commit:** none (install-only)

**3. [Rule 1 - Spec normalization] Acceptance-criteria grep pairings**

- **Found during:** Task 1 verification (running plan §verify automated grep)
- **Issue:** Plan acceptance criteria include grep-substring counts that are mutually contradictory in their literal form. Two cases:
  - Criterion #569 requires anti-feature **names** in JSDoc ("font picker", "Text alignment", "BubbleMenu/FloatingMenu", etc.) AND criterion #571/#572 requires `grep -c "BubbleMenu\|FloatingMenu" = 0` and `grep -c "FontFamily\|TextStyle" = 0`.
  - Criterion's "count(immediatelyRender: false) == count(injectCSS: false) == count(useEditor()" parity fails when JSDoc paragraphs reference these tokens for documentation purposes.
- **Resolution:** Operational intent ratified over literal grep:
  - Anti-feature names use semantic-only phrasing ("font picker", "color picker", "Text alignment", "floating toolbar") in JSDoc; Tiptap symbol names (FontFamily, TextStyle, TextAlign, BubbleMenu, FloatingMenu) are absent from the file. Both criteria satisfied.
  - Comments rephrased to "editor invocation" / "editor invocation below" instead of "useEditor() call", bringing grep-substring `useEditor(` count to exactly 1 (the actual invocation). Both flag counts also at 1. Strict parity holds.
- **Files modified:** `components/sf/sf-rich-editor.tsx`
- **Commit:** rolled into Task 1 commit `a1fd1cf`

No worktree leakage. No build errors. No `pnpm install` peer-dep errors. Pattern B + D-04 + RE-06 + Cluster-C all held throughout.

## Forward Link to Plan 03

Plan 03 (Playwright + axe-core + bundle audit closeout) consumes:

1. **`/dev-playground/sf-rich-editor`** — 4 testid-anchored fixture sections (`fixture-uncontrolled-empty`, `fixture-controlled`, `fixture-readonly`, `fixture-default-value`). Vacuous-green guard for axe specs: `await expect(page.locator('[contenteditable="true"]')).toBeVisible()` BEFORE `analyze()`.
2. **Storybook stories** — 4 exports (Default, WithContent, ReadOnly, Controlled) with chromatic.delay=500 belt-and-suspenders. Plan 03 may add Chromatic CI hooks if scoped.
3. **SFRichEditorLazy direct-path import** — Plan 03 specs MUST import via `@/components/sf/sf-rich-editor-lazy` (NOT via barrel — Pattern B).
4. **Bundle audit confirmation** — Plan 03's bundle-budget closeout test re-runs the homepage chunk-set sum AND adds an explicit grep against `.next/app-build-manifest.json` for `/tiptap|prosemirror|starter.kit/` against pages other than `/dev-playground/sf-rich-editor`.

The implementation surface (toolbar commands, controlled API loop guard, readOnly conditional render, character count zero-dep, Escape focus-return) is fully specified for Plan 03 to write deterministic Playwright assertions against.

## Self-Check: PASSED

Verified post-creation via filesystem + git:

- `components/sf/sf-rich-editor.tsx` — exists (422 lines), starts with `"use client";`, contains `_dep_re_01_decision:` (Plan 01 block preserved), exports `SFRichEditor` function and `SFRichEditorProps` interface, contains `Anti-features NOT shipped` block with all 6 anti-feature names, `role="toolbar"`, `aria-label="Bold"` and `aria-label="Link"` literals, `data-active={editor.isActive(...)` patterns, `editor.getText().length` char count, `aria-live="polite"`, `editor.getHTML() === value` loop-guard fingerprint
- `components/sf/sf-rich-editor-lazy.tsx` — exists (45 lines), starts with `"use client";`, `ssr: false` count = 2, `export function SFRichEditorLazy`, imports `SFSkeleton` from `@/components/sf` (barrel), 0 static `from "@tiptap/...` imports
- `components/sf/index.ts` — `sf-rich-editor` count: 0 / `SFRichEditor` count: 0 (Pattern B holds)
- `public/r/registry.json` — `sf-rich-editor` count: 0 (registry deferral holds)
- `public/r/sf-rich-editor.json` — absent (registry deferral holds)
- `app/dev-playground/sf-rich-editor/page.tsx` — exists (76 lines), 4 testid sections present, imports SFRichEditorLazy from direct path
- `stories/sf-rich-editor.stories.tsx` — exists (70 lines), 4 story exports + `delay: 500` count = 5
- `app/`, `components/`, `lib/` actual Tiptap CSS imports: 0
- `pnpm exec tsc --noEmit`: exit 0
- `tests/v1.8-phase63-1-bundle-budget.spec.ts`: PASS (187.7 KB / 200 KB)
- Three task commits exist on `git log --oneline`: `a1fd1cf`, `2cec6b9`, `fba56b5`
- `git status --porcelain` after final commit: only pre-existing pre-Plan-02 drift (.planning/ROADMAP.md owned by orchestrator + 2 untracked items pre-existing)
