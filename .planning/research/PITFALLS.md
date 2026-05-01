# Pitfalls Research — v1.10 Library Completeness

**Domain:** Design system component expansion — 5 new SF components into locked aesthetic + strict constraints
**Researched:** 2026-04-30
**Confidence:** HIGH (derived from 9 milestones of project-specific pitfall history + codebase inspection)

> This document is integration-specific. Every pitfall below describes a failure mode that arises from adding SFDataTable / SFCombobox / SFRichEditor / SFFileUpload / SFDateRangePicker to THIS system, not from building those components in isolation. Generic component-build advice is explicitly out of scope.

---

## Critical Pitfalls

### Pitfall 1: Tiptap StarterKit Pulls the Entire Extension Ecosystem into the Initial Bundle

**What goes wrong:**
`import { StarterKit } from '@tiptap/starter-kit'` is a barrel that transitively imports 20+ Tiptap extensions (Bold, Italic, Strike, Code, CodeBlock, Blockquote, HardBreak, Heading, HorizontalRule, ListItem, OrderedList, BulletList, Dropcursor, Gapcursor, History, Paragraph, Text, Document, and more). Gzipped weight is approximately 80–120 KB depending on version. Importing StarterKit at the module level — even inside `sf-rich-editor.tsx` — will pull it into the `/` homepage First Load JS if `sf-rich-editor.tsx` is reachable from the `@/components/sf` barrel.

**Why it happens:**
The Phase 67 BND-05 `optimizePackageImports: ["@/components/sf"]` barrel optimization means Next.js tree-shakes the SF barrel at build time. However, any component exported from `components/sf/index.ts` that statically imports Tiptap will defeat DCE because Tiptap is not a pure-functions library — it has side effects at module evaluation (ProseMirror plugin registration).

**How to avoid:**
- SFRichEditor MUST be P3 lazy (never exported from `sf/index.ts`)
- Import SFRichEditor via `sf-rich-editor-lazy.tsx` using the `next/dynamic({ ssr: false })` pattern (same as `sf-calendar-lazy.tsx`)
- Import ONLY the exact Tiptap extensions needed (not StarterKit), e.g. `@tiptap/extension-bold` individually — each is roughly 1–3 KB gzip
- The `_dep_X_decision` ratification block for Tiptap (DEP-01/DEP-02) MUST measure the actual lazy-chunk size post-DCE before ratification, not a guessed figure

**Warning signs:**
- `ANALYZE=true pnpm build` shows any Tiptap package in the `/page` manifest (not a lazy chunk)
- Homepage First Load JS climbs above 200 KB after adding SFRichEditor to the SF barrel
- `components/sf/index.ts` contains any line referencing `sf-rich-editor`

**Phase to address:** Phase 73 (SFRichEditor). Measure before commit with BND-04 stale-chunk guard (`rm -rf .next/cache .next`).

---

### Pitfall 2: TanStack Table v8 Devtools Pulled into Production Bundle

**What goes wrong:**
`@tanstack/react-table-devtools` (or the devtools sub-export from `@tanstack/react-table`) is sometimes imported during development to display the query/row model state. If the import is not guarded by `process.env.NODE_ENV !== 'production'` or removed entirely, it ships to production.

**Why it happens:**
TanStack Table v8 core is `@tanstack/react-table` (~45 KB parsed, ~13 KB gzip) — acceptable as a lazy P3 chunk. The devtools are NOT a separate npm package in v8 (unlike TanStack Query); they live in a `devtools` sub-path that is only conditionally tree-shaken. A naive `import { useReactTable } from '@tanstack/react-table'` is fine; a naive `import { ReactTableDevtools } from '@tanstack/react-table/build/lib/devtools'` is not.

**How to avoid:**
- Never import the devtools path in any SF component
- SFDataTable MUST be P3 lazy (never exported from `sf/index.ts`)
- Add `@tanstack/react-table` to `optimizePackageImports` in `next.config.ts` — but ONLY inside an authorized D-04 chunk-id unlock window (Phase 71 should declare the unlock window explicitly per the Phase 67 precedent)
- Measure the lazy-chunk size post-build before phase sign-off

**Warning signs:**
- Bundle analyzer shows `@tanstack/react-table` in the homepage First Load manifest
- "devtools" appears anywhere in `components/sf/sf-data-table.tsx` imports

**Phase to address:** Phase 71 (SFDataTable). The `_dep_X_decision` block must include measured gzip weight of the TanStack lazy chunk.

---

### Pitfall 3: Adding New `optimizePackageImports` Entries Reshuffles the Post-Phase-67 Chunk Graph (D-04 Violation)

**What goes wrong:**
The `next.config.ts` `optimizePackageImports` list now has 8 entries locked post-Phase-67. The comment block explicitly states: "further additions to this list are REJECTED until a future phase explicitly authorizes another break of the chunk-id lock." Adding `@tanstack/react-table`, `@tiptap/core`, or any other entry non-additively will dissolve the stable chunk IDs (`8964`, `584bde89`, `2979`, `5791061e`, `3228`, `289`, `9067`, `6309`, `5837`) and reshuffle webpack's splitChunks boundaries. This breaks the D-04 stability lock without a corresponding Phase 67-style unlock window + re-lock ceremony.

**Why it happens:**
`optimizePackageImports` changes the webpack module graph before splitChunks runs. Even adding a single new entry can cause previously-split shared chunks to merge or dissolve because the module graph now has different entry points. The Phase 67 post-reshape baseline was measured only after V1+V2+V3 decisions completed — it is not stable under incremental additions.

**How to avoid:**
- Phase 71 (SFDataTable) MUST declare an explicit D-04 unlock window in its plan, analogous to Phase 67's BND-05 unlock
- New `optimizePackageImports` entries for v1.10 deps (TanStack Table, Tiptap) should be batched into a SINGLE config change with a fresh `rm -rf .next/cache .next && ANALYZE=true pnpm build` measurement
- Re-lock new chunk-ID baseline in `.planning/codebase/v1.10-bundle-reshape.md` before Phase 76 final gate
- Never add entries mid-phase for the "quick win" — it corrupts the measurement surface for BND-08

**Warning signs:**
- `next.config.ts` `optimizePackageImports` array grows without a corresponding `.planning/codebase/vX.Y-bundle-reshape.md` re-lock
- Chunk IDs from v1.9 baseline no longer appear in the new build's manifest

**Phase to address:** Phase 71 (open D-04 unlock) and Phase 76 (verify and re-lock new baseline).

---

### Pitfall 4: SFRichEditor / SFDataTable Tiptap or ProseMirror SSR Initialization Crash

**What goes wrong:**
Tiptap uses ProseMirror under the hood. ProseMirror accesses `document` and `window` at module evaluation time via its schema and DOM model. If `sf-rich-editor.tsx` renders on the server (even in an RSC tree), you get a `ReferenceError: document is not defined` crash that is silent in dev (because Next.js catches it) but causes blank content or hydration errors in production.

**Why it happens:**
Next.js App Router defaults all components to Server Components. `'use client'` must be explicitly declared. A developer adds SFRichEditor to a Server Component tree without wrapping it in the lazy loader, or adds `'use client'` to the component itself but not the lazy wrapper, causing Next.js to attempt SSR of the `useEditor` hook.

**How to avoid:**
- `sf-rich-editor.tsx` MUST have `'use client'` at the top
- `sf-rich-editor-lazy.tsx` MUST use `next/dynamic({ ssr: false })` — `ssr: false` is non-negotiable (not just performance, but correctness)
- TanStack Table core (`useReactTable`) is pure JS and SSR-safe — `SFDataTable` can use `'use client'` without `ssr: false`, but state management (sorting/filtering/pagination state via `useState`) requires `'use client'`
- Add a smoke test: render `<SFRichEditorLazy />` inside a Server Component page in tests to catch the crash at CI rather than in production

**Warning signs:**
- `useEditor` appears outside a `'use client'` boundary
- Build output shows `sf-rich-editor` in a server chunk
- Dev server console shows `document is not defined` on any route

**Phase to address:** Phase 73 (SFRichEditor) — `ssr: false` discipline enforced at component authoring, not discovered in Phase 76.

---

### Pitfall 5: react-day-picker Internal ClassNames Do Not Inherit `--sfx-*` Token Defaults

**What goes wrong:**
react-day-picker v8/v9 renders a DOM structure with its own internal class names (`rdp`, `rdp-day`, `rdp-nav`, etc.). Tailwind v4's `source(none)` + explicit `@source` allowlist means react-day-picker's internal class names are never scanned, so Tailwind does not generate utilities for them. The component's built-in color assumptions (typically blue-based for selected state, grey for hover) survive unless explicitly overridden via the `classNames` prop or global CSS targeting the `rdp-*` selector namespace.

**Why it happens:**
The Phase 67 Tailwind v4 allowlist inversion (`source(none)` + explicit `@source` for `app/`, `components/`, `lib/`, `hooks/`, `stories/`) correctly excludes `node_modules/` from scan. react-day-picker's internal classes are in node_modules and will never generate Tailwind utilities. The component's default stylesheet (if imported via `import 'react-day-picker/dist/style.css'`) will override `--sfx-*` tokens with hard-coded HSL/RGB values.

**How to avoid:**
- Do NOT import react-day-picker's default stylesheet — it hardcodes colors outside the OKLCH token system
- Provide ALL styling via the `classNames` prop on the `DayPicker` component, using Tailwind utilities that reference `--sfx-*` tokens
- Selected-day state uses `bg-primary text-primary-foreground` (not react-day-picker's default blue)
- Navigation arrows must be replaced with `<SFButton>` or raw `<button>` styled to the SF register — react-day-picker's default chevron SVGs violate T2 (glyph grammar) and T3 (cube-tile geometry)
- react-day-picker is already in `optimizePackageImports` (Phase 61 BND-02) — no new `next.config.ts` change needed, but this must be verified against the D-04 lock: adding SFDateRangePicker consumers to the homepage would change which routes pull the chunk, potentially affecting chunk-id stability

**Warning signs:**
- Blue selection state visible in the calendar component
- Any `import 'react-day-picker/dist/style.css'` line anywhere in the codebase
- Calendar focus ring uses browser default outline instead of `sf-border-draw-focus` pattern

**Phase to address:** Phase 75 (SFDateRangePicker). Verify via Chromatic diff that no blue or generic grey appears in any story.

---

### Pitfall 6: Tiptap Toolbar Content Styles Fall Outside `@layer signalframeux` Cascade

**What goes wrong:**
Tiptap injects inline styles and a ProseMirror stylesheet (`ProseMirror.css`) into the document when the editor mounts. This stylesheet includes default `p`, `ul`, `ol`, `h1`–`h6`, `code`, `pre`, and `blockquote` styles that use hard-coded values (typically 1rem line-height, system font stacks, default margin). These override the `--sfx-*` typography tokens because ProseMirror's stylesheet is injected after the `@layer signalframeux` cascade has been established — unlayered styles win over layered styles.

**Why it happens:**
ProseMirror adds its stylesheet via a `<style>` tag at editor initialization time. This is not a Tailwind-processable file and bypasses the `@layer` cascade system that `--sfx-*` relies on. The v1.7 `@layer signalframeux` architecture (which correctly beats consumers' unlayered CSS) does NOT protect against dynamically injected stylesheets from third-party libraries.

**How to avoid:**
- Do NOT rely on `@layer signalframeux` to handle Tiptap content styles
- In the Tiptap editor's wrapper element, add a CSS scope with explicit `:is(.sf-rich-editor-content) p`, `:is(.sf-rich-editor-content) h1`, etc. that reference `--sfx-*` tokens using `!important` ONLY on properties where ProseMirror's default is overriding the token value
- Alternatively, configure Tiptap with `injectCSS: false` and provide all ProseMirror styles via a scoped CSS block in `globals.css`
- NEVER use `experimental.inlineCss: true` (standing rule — breaks `@layer signalframeux` cascade ordering, explicitly rejected in PROJECT.md)

**Warning signs:**
- Tiptap editor content renders in system font (not Inter/JetBrains Mono)
- `pnpm build` output contains any reference to `experimental.inlineCss`
- Rich editor text has browser-default margins/padding instead of blessed spacing stops

**Phase to address:** Phase 73 (SFRichEditor). Use `injectCSS: false` + scoped globals.css block as the prevention pattern.

---

### Pitfall 7: SFCombobox Focus Management Breaks Radix Popover `asChild` Composition

**What goes wrong:**
SFCombobox composes Radix Popover + SFInput + a listbox. If the trigger is wrapped with `asChild` (to use `SFInput` as the popover trigger), Radix's `FocusTrap` and `PopoverTrigger` slot both try to attach `aria-*` attributes to the same element. The result is a duplicated `aria-expanded` state, incorrect `aria-controls` association, and a focus trap that fires on the input rather than the listbox when the popover opens.

**Why it happens:**
`asChild` passes Radix's trigger props (including `aria-expanded`, `aria-haspopup`, `onClick`) down to the child. If the child is `SFInput`, it already has its own ref and event handlers. The prop merge is additive, which can cause double-firing of `onChange` + `onClick` and an incorrect DOM structure where both the `PopoverTrigger` and the inner `<input>` element claim the combobox role.

**How to avoid:**
- Follow the existing `SFCommand` component pattern (Radix `cmdk`) as the composition reference — it already handles the combobox ARIA role via cmdk's own `CommandInput`
- SFCombobox's trigger should be a `<div>` or `<button>` that visually renders the selected value, NOT the raw `<input>` element as `asChild`; the `<input>` sits inside the popover content for search
- Verify with axe-core: the combobox composite MUST have `role="combobox"`, `aria-expanded`, `aria-controls` pointing to the listbox ID, and `aria-activedescendant` on the active option — run in both closed and open states
- WCAG 1.3.1 (info and relationships): the label must be associated via `<label for="">` or `aria-labelledby`, not just visually adjacent

**Warning signs:**
- axe-core reports `aria-required-children` or `aria-required-parent` violations on the combobox composite
- Keyboard: Down arrow on the trigger opens the popover but focus does not move to the first option
- VoiceOver announces "button" instead of "combobox" on the trigger

**Phase to address:** Phase 72 (SFCombobox). Write an axe-core Playwright test that opens the combobox and scans the open state — the open state is where most ARIA violations hide.

---

### Pitfall 8: SFDataTable Sort Header Keyboard Navigation Fails WCAG 2.1 Success Criterion 2.1.1

**What goes wrong:**
TanStack Table renders column headers as `<th>` elements. Sort controls are typically added as `<button>` elements inside the `<th>`. If the sort button is the only content of `<th>`, screen readers will announce the column header text correctly. However, if sort direction icons (ascending/descending arrows) are added as visually rendered elements without an accessible name, axe-core will report `button-name` violations, and keyboard navigation between sort-able columns will be non-sequential (Tab skips between sort buttons rather than navigating the grid row semantics).

**Why it happens:**
TanStack Table v8 is headless — it provides no DOM. The implementer writes the full markup. Generic implementations add `onClick` to `<th>` or the entire header cell, which is not keyboard activatable (only `<button>` or `<a>` can receive `Enter` activation). Adding `onClick` to a `<div>` or `<th>` without `tabindex="0"` and `onKeyDown` for Enter/Space means keyboard-only users cannot sort.

**How to avoid:**
- Every sort-able column header MUST use a `<button type="button">` as the sort trigger
- Sort direction icons MUST have `aria-label` or be paired with visually hidden text (e.g. `<span className="sr-only">Sort ascending</span>`)
- The `<th>` element itself should have `aria-sort="ascending" | "descending" | "none"` set dynamically via TanStack's `column.getIsSorted()` return value
- Add explicit Playwright keyboard test: Tab to first sort header, press Enter, verify `aria-sort` attribute updates and data re-orders

**Warning signs:**
- axe-core reports `button-name` or `th-has-data-cells` violations on the table
- Manual keyboard test: Tab from above the table reaches the first sort button, but pressing Enter or Space does not trigger sort
- `<div onClick>` anywhere in the table header markup

**Phase to address:** Phase 71 (SFDataTable). Axe-core table test is a Phase 71 acceptance criterion, not deferred to Phase 76.

---

### Pitfall 9: SFFileUpload Drag-Drop File Events Are Invisible to Playwright and axe-core

**What goes wrong:**
Playwright's `page.dispatchEvent` and `locator.dispatchEvent` for `dragover` / `drop` events do not correctly populate the `dataTransfer.files` property in JSDOM-emulated contexts. Playwright tests that simulate file drop will find the drop zone visually activates (border glow, label change) but the `files` array will be empty, making it impossible to test the full upload flow (file type validation, progress state, multi-file rejection) via Playwright alone.

axe-core similarly cannot test drag-drop target semantics (whether `dropzone` attribute is present, whether instructions for non-drag users are available) unless the element is statically rendered with the correct ARIA role.

**Why it happens:**
This is a known Playwright limitation: `DataTransfer.files` is read-only and cannot be set via `dispatchEvent` in Chromium's main-world JavaScript context. The Playwright `setInputFiles` approach works for `<input type="file">` elements but not for custom drop-zone targets.

**How to avoid:**
- Always provide a visible `<input type="file">` as a non-drag fallback — this is both the a11y-correct approach (WCAG 2.1.1: keyboard accessible upload) and the Playwright-testable path
- Use Playwright's `locator.setInputFiles()` against the hidden `<input type="file">` to test the file-acceptance logic, independently of the drag UI
- For drag-drop visual state testing, use Chromatic (screenshot the `isDragOver=true` Storybook story variant with `play()` function) rather than Playwright
- Document the known gap explicitly: drag-drop file events are not covered by CI Playwright suite — Chromatic story + manual QA is the verification gate for drag behavior

**Warning signs:**
- Playwright test for file upload passes but only tests the drop zone's visual activation state, not whether files were actually accepted
- No `<input type="file">` element exists inside the `SFFileUpload` component (pure div-based drop zone with no keyboard fallback)
- axe-core reports `interactive-supports-focus` on a `<div onDrop>` drop zone without a corresponding focusable element

**Phase to address:** Phase 74 (SFFileUpload). Write the test strategy before writing the component: `setInputFiles` path tested by Playwright, drag visual state tested by Chromatic story with `play()`.

---

### Pitfall 10: Tiptap `useEditor` Content State Is Not Captured by Chromatic Snapshot

**What goes wrong:**
Chromatic takes visual snapshots of Storybook stories. Tiptap's editor content is managed by ProseMirror's internal state, not by React props or visible DOM text nodes that Chromatic's snapshot tool can reliably capture across renders. A story that sets initial content via `editor.commands.setContent('<p>Hello</p>')` in a `useEffect` will appear blank in Chromatic's first-paint snapshot because the effect runs after the snapshot is taken.

**Why it happens:**
Chromatic renders stories in a headless browser and takes snapshots at paint time (or after a configured delay). Tiptap's `content` prop sets initial content synchronously via ProseMirror, but the DOM update (ProseMirror's EditorView creates `contenteditable` and populates it) occurs asynchronously relative to the React render cycle. Chromatic's `delay` parameter in story parameters can compensate, but a missing delay means blank content in 100% of snapshots.

**How to avoid:**
- Set `parameters.chromatic.delay = 500` in every SFRichEditor Storybook story
- Do not rely on Chromatic to verify runtime content changes (toolbar bold/italic state) — use Playwright with `page.keyboard.type()` + `waitForFunction` to verify ProseMirror DOM updates
- The primary Chromatic verification for SFRichEditor is visual aesthetic (toolbar appearance, container border, focus ring) not content accuracy

**Warning signs:**
- SFRichEditor Chromatic baseline shows an empty white box with toolbar
- `parameters.chromatic` is absent from the story definition
- Chromatic approval passes but the editor's content area is blank in the baseline

**Phase to address:** Phase 73 (SFRichEditor). Set `chromatic.delay` at story authoring time.

---

### Pitfall 11: SFDateRangePicker `month` State Causes Hydration Mismatch

**What goes wrong:**
react-day-picker's `defaultMonth` prop, if set to `new Date()`, produces a different value on the server than on the client (different render time). This causes a React hydration mismatch where the server-rendered calendar shows one month and the client-side hydration attempts to reconcile against a slightly different month, resulting in a `Warning: Text content did not match` error or, in production, a blank/flashing calendar.

**Why it happens:**
`new Date()` is not a stable value across server and client renders. This is the canonical SSR hydration trap for any date-dependent component. SFDateRangePicker as a `'use client'` component avoids SSR of the calendar itself, but if any server component renders the default month as a prop, it will carry through to the client as a mismatched string.

**How to avoid:**
- SFDateRangePicker MUST be `'use client'` and initialized inside a `useEffect` if `defaultMonth` needs to reference `new Date()`
- If a static default month is acceptable, pass a fixed date (e.g. `new Date(2024, 0, 1)`) — but document that this is a display default, not a "today"
- Consider accepting `defaultMonth` as an optional prop (undefined = react-day-picker handles it internally) rather than computing it in the component

**Warning signs:**
- Console shows `Warning: Text content did not match` on routes that include the date range picker
- Calendar shows January 1970 (epoch default) rather than current month on first render
- Any `new Date()` call at the module level (outside of hooks or event handlers) in `sf-date-range-picker.tsx`

**Phase to address:** Phase 75 (SFDateRangePicker). Add a Playwright hydration test: render the page, check for no console warnings on the picker route.

---

### Pitfall 12: Rounded Corners Inherited from Library Defaults (Zero `border-radius` Standing Rule Violation)

**What goes wrong:**
All five new components have library defaults that apply `border-radius`. TanStack Table renders plain `<table>` / `<th>` / `<td>` (safe by default), but shadcn-derived sub-components (like using a shadcn `Badge` for cell values or shadcn `Button` for sort controls) will carry `rounded-md` or `rounded-full` from the `ui/` base layer. react-day-picker's selected-day cell has `rounded-full` by default. Tiptap's toolbar buttons from any UI kit will have radius. SFCombobox if it reuses `SFBadge` for multi-select chips will inherit radius.

**Why it happens:**
`border-radius: 0` is a non-default. It is enforced on existing SF components because they were all hand-audited. New components pulling in sub-components from `ui/` or library sources will get radius back unless every affected element is explicitly overridden.

**How to avoid:**
- Add `rounded-none` to every `className` prop passed to any shadcn `ui/` sub-component used inside the 5 new components
- For react-day-picker: pass `classNames={{ day_selected: "rounded-none ...", day: "rounded-none ..." }}` on the `DayPicker` component
- For Tiptap toolbar buttons: ensure they use `SFButton` (which already enforces `rounded-none`) — never raw `<button>` without the SF wrapper
- After Storybook stories are authored, run a visual pass specifically looking for any soft corner — Chromatic story comparison against a v1.10-start baseline makes radius drift detectable

**Warning signs:**
- Any component renders with a soft pill shape, circular chip, or card with rounded corners
- `rounded-md`, `rounded-lg`, `rounded-full`, or `rounded-sm` appear in any new SF component file
- react-day-picker's selected day renders as a circle (default behavior)

**Phase to address:** Each component's phase (71–75) — enforce at authoring, not in Phase 76 cleanup.

---

### Pitfall 13: Worktree Leakage from Agent-Authored Component Files to Main Tree

**What goes wrong:**
When sub-agents author new component files (e.g. `components/sf/sf-data-table.tsx`) inside a worktree, the writes can leak to the main tree under specific conditions (observed v1.8 and v1.9: Phase 67 + 70 both had `.claude/worktrees/agent-*/` untracked writes appearing in the main working tree). If a leaked file is accidentally committed before review, it may contain draft code that violates standing rules (border-radius, non-OKLCH colors, missing `'use client'`, wrong spacing values).

**Why it happens:**
The worktree isolation is "inconsistently leaking" per `feedback_agent_worktree_leakage.md`. The mechanism is not fully characterized, but the pattern is: agent writes a file inside `agent-{N}/`, the file path resolves to the main working tree via a symlink or relative path collision, and `git status` on main shows the file as untracked.

**How to avoid:**
- Run `git status` (never `git status -uall`) before ANY commit during v1.10 phases — the 13 gitignored stale worktree directories from v1.9 are still in `.claude/worktrees/` and the pattern is active
- The defensive merge pattern: `git checkout --ours` on any untracked worktree file + `git stash drop` before staging
- Phase 76 final gate MUST include a clean `git status` check — any untracked file in `components/sf/` that was not explicitly authored in that phase is a leakage artifact

**Warning signs:**
- `git status` shows `components/sf/sf-data-table.tsx` as untracked before the phase authoring that file was supposed to start
- Two versions of the same component file exist (one in `.claude/worktrees/agent-*/` and one in `components/sf/`)
- `git diff` shows files with different line endings or encoding than the project standard

**Phase to address:** Every phase 71–76. Pre-commit `git status` check is a standing gate in every plan's close checklist.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Import StarterKit instead of individual Tiptap extensions | Faster authoring of rich editor | 80–120 KB added to Tiptap lazy chunk; P3 chunk is larger than necessary | Never — the lazy pattern still has a cost per route that loads the editor |
| Skip `_dep_X_decision` block for TanStack/Tiptap | Save 20 min of ratification | No documented precedent for the dep; future milestone reviewers cannot trace why it exists | Never for runtime deps — devDeps may skip if measurement-time-only |
| Add `optimizePackageImports` for new lib without D-04 unlock ceremony | Slightly smaller route chunks | Reshuffles post-Phase-67 chunk IDs, invalidates BND-08 measurement, breaks D-04 lock silently | Never |
| Use react-day-picker default stylesheet | Faster styling | Imports non-OKLCH colors; overrides `--sfx-*` tokens; violates standing color rule | Never |
| Use `rounded-md` on toolbar buttons "just for this component" | Looks like default UI kit | First visible radius break in the system; aesthetic regression flagged by Chromatic | Never — zero border-radius is absolute |
| Export SFRichEditor from `sf/index.ts` barrel | Simpler import path for consumers | Tiptap pulled into homepage bundle; 200 KB target breached | Never — P3 components are barrel-excluded by design |
| Ship SFDataTable without virtualization for initial release | Ships faster | Tables with 500+ rows will freeze the main thread; difficult to retrofit virtualization without API breaking changes | Acceptable as MVP IF the component API is designed to accept a virtualization adapter (explicit deferred scope, not silent omission) |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| TanStack Table + `@/components/sf` barrel | Add `sf-data-table` to `sf/index.ts` | Never export from barrel; P3 lazy only via `sf-data-table-lazy.tsx` |
| Tiptap + `@layer signalframeux` | Rely on cascade to override ProseMirror.css | `injectCSS: false` + scoped globals.css block targeting `.sf-rich-editor-content *` |
| react-day-picker + Tailwind v4 allowlist | Expect rdp-* classes to be scanned | All styling via `classNames` prop; no import of react-day-picker stylesheet |
| SFCombobox + Radix Popover `asChild` | Use `SFInput` as the `PopoverTrigger` with `asChild` | Use a wrapper `<button>` as trigger; `SFInput` lives inside popover content for search |
| SFFileUpload + Playwright | `dispatchEvent('drop')` to test file acceptance | `locator.setInputFiles()` on hidden `<input type="file">`; Chromatic for drag visual state |
| SFRichEditor + Chromatic | Expect content to appear in snapshot | `parameters.chromatic.delay = 500` on every story; verify toolbar only in Chromatic |
| New deps + `optimizePackageImports` | Add new packages immediately when dep is added | Batch into authorized D-04 unlock window in Phase 71 plan; single build measurement |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| TanStack Table with no virtualization on large datasets | Tab frame rate drops below 30fps on tables >200 rows; main thread blocked on sort/filter | Use TanStack Virtual (`@tanstack/react-virtual`) for row virtualization when `rows.length > 100` | At >100 rows on mobile, >500 rows on desktop |
| Tiptap with all extensions enabled simultaneously | Editor mount adds 150ms+ to TTI on mobile; battery drain on idle | Load only the minimum extension set; use `injectCSS: false`; measure editor mount time with Performance API before shipping | First render on mobile, always |
| SFFileUpload reading large files with `FileReader.readAsDataURL` | Main thread blocked; UI freezes; no progress feedback | Use `URL.createObjectURL` for preview (synchronous, no read needed); stream uploads via `fetch` with `ReadableStream` | Files above ~5 MB on mobile |
| react-day-picker re-rendering on every hover event | Calendar becomes janky on mobile when `onDayMouseEnter` handler triggers parent state update | Memoize `onDayMouseEnter` with `useCallback`; do NOT store hover state in parent; use CSS `:hover` for visual feedback | Mobile devices — touch events fire without hover but the handler still fires |
| SFDataTable with client-side filtering on 1000+ rows | Every keystroke triggers a full array scan; input lag above 100ms | Debounce filter input (150–200ms); consider server-side filtering for datasets above 500 rows | Datasets above 500 rows on low-end mobile |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Rich editor toolbar uses icon-only buttons without accessible names | Screen reader users cannot activate Bold, Italic, Link buttons | Every toolbar button MUST have `aria-label` or visually hidden text; icons follow T2 glyph grammar (SVG rectangles + simple paths, not Lucide icons) |
| Date range picker does not indicate which date is start vs end while selecting | User selects wrong range; second click unexpectedly clears first | Show "Start: —" / "End: —" text labels outside the calendar; update in real time as user selects |
| DataTable pagination shows page numbers without total count | User cannot gauge progress through a large dataset | Always show "Page X of Y (N results)" format — never page number alone |
| Combobox closes on blur from input but before user clicks an option | User cannot scroll the listbox with keyboard after clicking the scrollbar | Use `onPointerDown` (not `onClick`) on listbox options to prevent blur from firing before selection |
| File upload shows spinner but no progress for large files | User cannot tell if upload is stuck or in progress | Show determinate progress (SFProgress component) when the total file size is known; show indeterminate spinner only when size is unknown |
| Rich editor does not preserve content on route navigation | User loses drafted content on back-navigation | Warn before navigation if editor has unsaved content (`beforeunload` event + Next.js router event) |

---

## "Looks Done But Isn't" Checklist

- [ ] **SFDataTable:** Sort headers — verify `aria-sort` attribute updates on every sort toggle, not just on mount
- [ ] **SFDataTable:** Pagination — verify keyboard access to previous/next/page-N controls without mouse
- [ ] **SFDataTable:** Filter input — verify the filter result is announced by screen reader (live region with count of filtered rows)
- [ ] **SFCombobox:** Open state — verify `role="listbox"` on the dropdown, `role="option"` on each item, and `aria-activedescendant` on the combobox input pointing to the active option
- [ ] **SFCombobox:** Multi-select variant (if scoped) — verify each selected value chip has a remove button with `aria-label="Remove [value]"`
- [ ] **SFRichEditor:** Editor content area — verify `contenteditable="true"` has an accessible label (not just a visual placeholder)
- [ ] **SFRichEditor:** Toolbar — verify Tab does NOT trap focus inside the editor; Escape exits the toolbar and returns focus to the editor content area
- [ ] **SFFileUpload:** Drop zone — verify non-drag users can activate upload via `<input type="file">` that is keyboard-reachable
- [ ] **SFFileUpload:** Multi-file — verify the component renders a list of accepted files with individual remove buttons, each labeled with the filename
- [ ] **SFDateRangePicker:** Range selection — verify that pressing Escape during range selection clears the in-progress range without closing the popover entirely
- [ ] **All 5 components:** Focus ring — verify `sf-border-draw-focus` pattern (not browser default outline) on all interactive elements
- [ ] **All 5 components:** Zero border-radius — visual pass in Chromatic against v1.10-start baseline
- [ ] **All 5 components:** OKLCH-only — `grep -rn "rgb\|hsl\|#[0-9a-fA-F]" components/sf/sf-data-table.tsx` (and each component file) returns zero hits
- [ ] **All 5 components:** Spacing — `grep -rn "\[.*px\]\|p-\d\|m-\d" components/sf/sf-*.tsx` to catch arbitrary spacing (only blessed stops allowed)
- [ ] **BND-08:** First Load JS after ALL 5 components ship — measure with `rm -rf .next/cache .next && pnpm build`; assert ≤200 KB

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| StarterKit imported → bundle blown past 200 KB | MEDIUM | Rewrite extension imports individually; re-measure; update `_dep_X_decision` block with new measured size |
| D-04 chunk-id lock broken without unlock ceremony | MEDIUM | Treat as an implicit unlock; run full rebuild measurement; document new chunk-ID baseline in `v1.10-bundle-reshape.md`; create `_path_X_decision` if any threshold was exceeded |
| Tiptap CLS regression from ProseMirror.css injection | MEDIUM | Add `injectCSS: false` to editor config; move affected styles to scoped globals.css block; re-run LHCI mobile CLS measurement |
| Rounded corners shipped in a component | LOW | Add `rounded-none` to affected element; submit fix commit; re-baseline Chromatic story |
| axe-core violations discovered in Phase 76 final gate | HIGH | Block phase close; triage by component; each violation is a regression of an existing standing rule (WCAG AA); may require component API change if ARIA structure is wrong |
| Worktree file leaked to main tree and committed | HIGH | `git revert` the commit; clean the file; re-author under correct attribution; note in Phase close that worktree leakage occurred |
| react-day-picker default stylesheet imported → OKLCH override | LOW | Delete the import; verify tokens apply; re-run Chromatic diff |
| `new Date()` hydration mismatch in SFDateRangePicker | LOW | Move to `useEffect` initialization; add Playwright hydration test; fix is a one-line change but must be caught before Phase 76 |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Tiptap StarterKit bundle explosion | Phase 73 | `ANALYZE=true pnpm build`: `@tiptap/starter-kit` absent from homepage manifest |
| TanStack Table devtools in production | Phase 71 | Bundle analyzer: no devtools path in any non-dev chunk |
| `optimizePackageImports` D-04 violation | Phase 71 (unlock) + Phase 76 (re-lock) | `v1.10-bundle-reshape.md` committed before Phase 76 sign-off |
| Tiptap SSR crash (`document is not defined`) | Phase 73 | `ssr: false` in lazy loader; smoke test: render on a server route |
| react-day-picker classNames / stylesheet override | Phase 75 | Chromatic: no blue selection state; `grep` for stylesheet import returns zero |
| Tiptap content styles bypass `@layer signalframeux` | Phase 73 | Visual review: editor content uses Inter / JetBrains Mono; no system font |
| SFCombobox ARIA composition failure | Phase 72 | axe-core scan in open state; VoiceOver manual test |
| SFDataTable sort header keyboard nav | Phase 71 | Playwright keyboard test: Tab → Enter → verify `aria-sort` changes |
| SFFileUpload drag-drop invisible to Playwright | Phase 74 | `setInputFiles()` test for file acceptance; Chromatic for drag visual; gap documented |
| Tiptap content blank in Chromatic | Phase 73 | `parameters.chromatic.delay = 500` on all stories; verify baseline shows toolbar |
| SFDateRangePicker hydration mismatch | Phase 75 | Playwright: load page, assert zero console warnings on picker route |
| Rounded corners from library defaults | Phases 71–75 (each) | Chromatic diff vs v1.10-start baseline; `grep rounded-` returns zero hits |
| Worktree leakage | Phases 71–76 (each) | Pre-commit `git status`; `git diff --cached` before every commit |
| BND-08: 200 KB budget breach | Phase 76 | Clean build measurement; assert `BUDGET_BYTES = 200 * 1024` |

---

## Sources

- Project history: `.planning/PROJECT.md` Key Decisions table (v1.0–v1.9) — all pitfalls above traced to real project events
- Phase 67 BND-05 + D-04 unlock precedent: `.planning/codebase/v1.9-bundle-reshape.md`
- `experimental.inlineCss: true` rejection: `.planning/PROJECT.md` standing rules section
- worktree leakage pattern: `memory/feedback_agent_worktree_leakage.md`
- `@layer signalframeux` cascade architecture: `.planning/PROJECT.md` v1.7 Key Decisions row
- Tailwind v4 source allowlist: `memory/feedback_tailwind_v4_source_allowlist.md` + Phase 70 in-session fix
- react-day-picker already in `optimizePackageImports` (Phase 61 BND-02): `next.config.ts` verified
- `sf-calendar-lazy.tsx` as the P3 lazy pattern reference: inspected at authoring time
- `sf-select.tsx` as the SF wrapping contract reference: inspected at authoring time
- `LOCKDOWN.md` R-60 (borderless-first), R-40 (saturation asymmetry), T1–T4 (trademarks), R-64 (keyboard model): `.planning/LOCKDOWN.md`
- Anton font descriptor measurement methodology (anti-guess): `memory/feedback_measure_descriptors_from_woff2.md`
- Lenis `autoResize: true` PF-04 contract: `.planning/PROJECT.md` standing rules
- T3 cube-fill AA failure on small text: `memory/feedback_t3_text_contrast_floor.md`
- AES-01..04 standing rules: `.planning/codebase/AESTHETIC-OF-RECORD.md`

---
*Pitfalls research for: v1.10 Library Completeness — 5-component SF expansion*
*Researched: 2026-04-30*
