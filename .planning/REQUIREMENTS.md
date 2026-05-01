# Requirements — v1.10 Library Completeness

**Goal:** Ship 5 highest-impact missing SF components — SFDataTable, SFCombobox, SFRichEditor, SFFileUpload, SFDateRangePicker — to make SignalframeUX adoptable for real product work, without breaking the locked aesthetic, the 200 KB First Load JS hard target, or any standing rule ratified through v1.9.

**Constraint:** Aesthetic preservation is the milestone-wide standing rule (AES-01..04 from v1.8 carry forward via `.planning/codebase/AESTHETIC-OF-RECORD.md`). Two ratified runtime npm dep exceptions (TanStack Table v8, Tiptap v3 recommended) under new `_dep_X_decision` REQ-ID-namespaced ratification block precedent (extends v1.9 Phase 69 `_wmk_01_decision`). All 3 heavy components (SFDataTable, SFRichEditor, SFDateRangePicker) MUST be P3 lazy via `next/dynamic({ ssr: false })`. No `optimizePackageImports` changes — D-04 chunk-id stability lock holds throughout.

**Standing rules carried forward from v1.9:**

- Aesthetic preservation — `.planning/codebase/AESTHETIC-OF-RECORD.md` is the read-once standing-rules surface
- `_path_X_decision` annotation pattern (alphabetic) for any ratified loosening
- `_dep_X_decision` annotation pattern (REQ-ID-namespaced) for any new runtime npm dep — extends `_wmk_01_decision` precedent from v1.9 Phase 69
- Single-ticker rule — any new rAF call site is a violation
- PF-04 contract — Lenis `autoResize: true` is code-of-record
- `experimental.inlineCss: true` rejected — breaks `@layer signalframeux` cascade
- 200 KB First Load JS hard target — regression requires `_dep_X_decision` ratification
- D-04 chunk-id stability lock RE-LOCKED at v1.9-bundle-reshape baseline (post-Vector-1 DCE); same unlock-window protocol applies to future chunk-graph attacks
- Zero new runtime npm dependencies WITHOUT explicit per-component ratification block
- Zero border-radius everywhere · OKLCH only · CVA `intent` · `cn()` from lib/utils.ts
- shadcn base in components/ui/ → SF-wrapped in components/sf/ · barrel from sf/index.ts
- Component file + barrel export + registry entry land in same commit
- Chromatic story · JSDoc · SCAFFOLDING entry · Playwright + axe-core tests · light + dark mode parity · `getQualityTier()` consumption for any animation surface

---

## SFDataTable (DT) — Phase 71

- [x] **DT-01**: Column sort — single-column cycle (asc → desc → none) + sort indicator glyph + accessible header `<button>` (NOT `<div onClick>` per WCAG 2.1.1) + keyboard nav (Enter/Space toggles); composes `@tanstack/react-table@8.21.3` `getSortedRowModel`
- [x] **DT-02**: Filter — per-column debounced text input (300ms) + global filter via `getFilteredRowModel`; controlled and uncontrolled API
- [x] **DT-03**: Pagination — page-number pagination composing existing `SFPagination`; `getPaginationRowModel`; controlled `pageIndex` / `pageSize` API
- [x] **DT-04**: Row selection — checkbox column with single + multi + indeterminate header state; composes existing `SFCheckbox`; `getRowModel().rows.filter(r => r.getIsSelected())` accessor exposed
- [x] **DT-05**: Density modes (compact / default / comfortable) via CVA `density` variant + loading skeleton + empty state + keyboard nav grid role + JSDoc extension point for future `virtualize` prop
- [x] **DT-06**: P3 lazy — `components/sf/sf-data-table-lazy.tsx` via `next/dynamic({ ssr: false })`; component NOT exported from `sf/index.ts` barrel; consumers import via `@/components/sf/sf-data-table-lazy`

## SFCombobox (CB) — Phase 72

- [ ] **CB-01**: Single-select with type-ahead filter, keyboard nav (arrow + type-ahead + Enter to select + Esc to close), empty state, loading state, controlled + uncontrolled API; composes existing `SFCommand` (direct import, NOT via barrel) + `SFPopover` + `SFInput`
- [ ] **CB-02**: Clear/reset action + grouping support (CommandGroup) + active-state styling via `--sfx-*` token classes
- [ ] **CB-03**: Multi-select variant via `multiple` prop — selected items render as badge chips composing existing `SFBadge` with remove affordance; controlled `value: string[]` API
- [ ] **CB-04**: Component exported from `sf/index.ts` barrel (Pattern C — pure SF composition); zero new runtime deps

## SFRichEditor (RE) — Phase 73

- [ ] **RE-01**: Core toolbar — bold/italic/underline/strike, H1/H2/H3, bulleted+ordered lists, blockquote; toolbar buttons composed from existing `SFButton` with active-state via `data-active`; placeholder text + character count display
- [ ] **RE-02**: Code block + inline code + link extension (Tiptap `@tiptap/extension-link` if separate from starter-kit in chosen version — decided in `_dep_re_01_decision`)
- [ ] **RE-03**: Controlled API (`value` HTML string + `onChange`) + uncontrolled API (`defaultValue`) + read-only mode (`readOnly` prop) + `immediatelyRender: false` SSR guard on every `useEditor()` call
- [ ] **RE-04**: `injectCSS: false` set on every `useEditor()` call; `.ProseMirror` and `.ProseMirror *` scoped rules added to `app/globals.css` under `@layer signalframeux` — only 4 element rules needed (p, h1-h4, ul/ol/li, blockquote); NO Tiptap CSS imports anywhere
- [ ] **RE-05**: P3 lazy — `components/sf/sf-rich-editor-lazy.tsx` via `next/dynamic({ ssr: false })`; component NOT exported from `sf/index.ts` barrel
- [ ] **RE-06**: Anti-features explicitly NOT shipped — H4/H5/H6, font picker, color picker, text alignment, floating toolbar, collaborative editing (each documented in JSDoc with rationale)

## SFFileUpload (FU) — Phase 74

- [ ] **FU-01**: Drag-drop zone (`onDrop` + `onDragOver` + `onDragLeave`) + click-to-browse via hidden `<input type="file">` + file list with per-file remove affordance + paste-from-clipboard handler
- [ ] **FU-02**: File-type validation (`accept` prop, MIME or extension), size validation (`maxSize` prop in bytes), multi-file support (`multiple` prop), per-file error state with intent variant
- [ ] **FU-03**: Per-file progress reporting via existing `SFProgress` (controlled by consumer-supplied `progress: Record<fileName, number>` prop), controlled API (`files`, `onChange`), disabled state, image preview via `URL.createObjectURL` (NOT `FileReader.readAsDataURL` for large files)
- [ ] **FU-04**: Component exported from `sf/index.ts` barrel (Pattern C); zero new runtime deps; consumer owns the HTTP upload (component owns UI state only — no built-in fetch)
- [ ] **FU-05**: Test-strategy split documented in phase close — `locator.setInputFiles()` for acceptance logic (type/size validation, multi-file, error state); Chromatic story with `play()` for drag visual state; permanent gap on drag-drop file events in CI Playwright (Chromium `dataTransfer.files` limitation)

## SFDateRangePicker (DR) — Phase 75

- [ ] **DR-01**: Date range mode + single date mode via `mode: "range" | "single"` prop + popover trigger composing `SFPopover` + `SFInput` (read-only, displays formatted range) + range highlight visualization with `range_start` / `range_middle` / `range_end` `classNames` keys
- [ ] **DR-02**: Keyboard input parsing + min/max bounds (`fromDate` / `toDate`) + disabled dates (`disabled` prop) + clear/reset action; `new Date()` only inside `useEffect` or `useMemo` (NEVER at module level — SSR hydration trap)
- [ ] **DR-03**: Presets panel (e.g., "Last 7 days", "Last 30 days", "This month", "This quarter") rendered as left-rail buttons composing `SFButton` + Locale type-only pass-through (`locale?: Locale` accepting `Locale` from `date-fns/locale` as type-only import — NEVER import date-fns runtime code) + controlled API (`value`, `onChange`)
- [ ] **DR-04**: Inline `<SFInput type="time">` for time-of-day specification when `withTime` prop is true (no shared `SFTimePicker` extraction — single v1.10 consumer)
- [ ] **DR-05**: Component exported from `sf/index.ts` barrel (Pattern C); zero new runtime deps (react-day-picker already in stack); composes existing `SFCalendarLazy` (already P3 lazy) + `SFPopover` + `SFInput`
- [ ] **DR-06**: react-day-picker default stylesheet NEVER imported — all styling via `classNames` prop using `--sfx-*` token classes only (`bg-primary text-primary-foreground` for selected day; `rounded-none` everywhere)

## Dependency Ratification (DEP)

- [x] **DEP-01**: `_dep_dt_01_decision` block ratified at Phase 71 plan time — 7 fields (decided / audit / dep_added / version / rationale / bundle_evidence / review_gate); covers `@tanstack/react-table@8.21.3`; bundle evidence from post-`pnpm add` `ANALYZE=true pnpm build` measurement (NOT estimate); review_gate fires on TanStack Table v9 stable release
- [ ] **DEP-02**: `_dep_re_01_decision` block ratified at Phase 73 plan time — 7 fields covering `@tiptap/react` + `@tiptap/pm` + `@tiptap/starter-kit` + (optional) `@tiptap/extension-link`; version chosen between v3.22.5 (recommended default — actively maintained) and v2.27.2 (legacy); bundle evidence from post-`pnpm add` `ANALYZE=true pnpm build` measurement (NOT estimate); review_gate fires on Tiptap v4 stable release

## Registry Expansion (REG)

- [ ] **REG-01**: 5 new registry entries land in `public/r/registry.json` same-commit as their respective component files — all `meta.layer: "frame"`; `meta.pattern: "C"` for SFCombobox / SFFileUpload / SFDateRangePicker; `meta.pattern: "B"` + `meta.heavy: true` for SFDataTable / SFRichEditor; SCAFFOLDING.md component count header updated to current accurate value (currently stale at "49"; v1.9 Phase 67 left registry at 53; v1.10 brings to 58)

## Bundle Discipline (BND)

- [ ] **BND-08**: `/` First Load JS ≤ 200 KB hard target maintained at v1.10 close — clean build measurement: `rm -rf .next/cache .next && ANALYZE=true pnpm build`; assert `BUDGET_BYTES = 200 * 1024` in `tests/v1.8-phase63-1-bundle-budget.spec.ts`; verify TanStack Table and Tiptap absent from homepage First Load chunk manifest (both must remain in route-bound lazy chunks)

## Aesthetic Preservation (AES)

- [ ] **AES-05**: Chromatic baseline approval at Phase 76 — zero rounded corners across all 5 new components (override library defaults: react-day-picker `rounded-full` selected day, cmdk `CommandItem` `rounded-md`, Tiptap content rules); no library default colors leaking through (no react-day-picker blue, no Tiptap system fonts in editor content); spacing on blessed stops (4/8/12/16/24/32/48/64/96); OKLCH-only colors verified

## Test Coverage (TST)

- [x] **TST-03**: Per-component Playwright + axe-core test files land same-phase as component — Playwright covers controlled API + keyboard nav + open/close states; axe-core covers WCAG AA (sort header keyboard, combobox listbox role, RichEditor focus management, FileUpload drop zone keyboard fallback, DateRangePicker label association); all tests green before phase close
- [ ] **TST-04**: SFFileUpload split-test strategy documented in `74-VERIFICATION.md` per FU-05 — explicit acknowledgement of `dataTransfer.files` Chromium gap, NOT papered over with vacuously-passing test

---

## Future Requirements (deferred)

| REQ-ID | Capability | Reason for deferral |
|--------|-----------|----------------------|
| **DT-07..** | Virtualization (`SFDataTableVirtual` separate component) | Requires `@tanstack/react-virtual@3.13.24` (`_dep_dt_02_decision`); knowable row height pre-condition; v1.11 scope |
| **DT-08..** | Server-side data mode, expandable rows, multi-column sort, global filter | "Should-have" features; v1.11 if user demand surfaces |
| **DT-09..** | Column resize / reorder, sticky columns | Aesthetic-risk features; deferred until usage validates need |
| **CB-05..** | Async search callback, creatable items | "Should-have"; v1.11 |
| **RE-07..** | Slash commands, @-mentions (Tiptap Suggestion API) | HIGH complexity; separate Tiptap extension surface; v1.11 |
| **RE-08..** | Image paste (consumer `onImageUpload` callback), paste-from-Word cleanup | "Should-have"; ships in v1.10 if Phase 73 has time |
| **FU-06..** | Retry on failure, drop-anywhere mode | "Should-have"; v1.11 if pattern emerges |
| **DR-07..** | Datetime mode, comparison range, time-only mode | Triple-feature scope explosion; v1.11+ if demand |

## Out of Scope (v1.10)

- **React Three Fiber** — excluded; R3F's independent rAF loop conflicts with GSAP `globalTimeline.timeScale(0)`
- **Lottie** — JSON-replayed animation, not generative/procedural; incompatible with DU/TDR aesthetic
- **Backend / API surface** — design system is frontend-only
- **CMS integration** — MDX + JSON for content
- **Localization (i18n)** — parked for v1.11+ (Direction A milestone)
- **AG Grid / Handsontable / similar enterprise grids** — overkill bundle, anti-aesthetic; SFDataTable composes headless TanStack Table only
- **Quill / Slate** — Quill auto-injects unlayered CSS (violates `@layer signalframeux`); Slate has no first-class extension model in modern stack
- **Date library swap** (e.g., date-fns runtime, dayjs, luxon) — SFDateRangePicker accepts pass-through `Locale` type-only; consumers bring their own date library

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| DT-01 | 71 | Complete |
| DT-02 | 71 | Complete |
| DT-03 | 71 | Complete |
| DT-04 | 71 | Complete |
| DT-05 | 71 | Complete |
| DT-06 | 71 | Complete |
| DEP-01 | 71 | Complete |
| TST-03 (SFDataTable) | 71 | Pending |
| CB-01 | 72 | Pending |
| CB-02 | 72 | Pending |
| CB-03 | 72 | Pending |
| CB-04 | 72 | Pending |
| TST-03 (SFCombobox) | 72 | Pending |
| RE-01 | 73 | Pending |
| RE-02 | 73 | Pending |
| RE-03 | 73 | Pending |
| RE-04 | 73 | Pending |
| RE-05 | 73 | Pending |
| RE-06 | 73 | Pending |
| DEP-02 | 73 | Pending |
| TST-03 (SFRichEditor) | 73 | Pending |
| FU-01 | 74 | Pending |
| FU-02 | 74 | Pending |
| FU-03 | 74 | Pending |
| FU-04 | 74 | Pending |
| FU-05 | 74 | Pending |
| TST-03 (SFFileUpload) | 74 | Pending |
| TST-04 | 74 | Pending |
| DR-01 | 75 | Pending |
| DR-02 | 75 | Pending |
| DR-03 | 75 | Pending |
| DR-04 | 75 | Pending |
| DR-05 | 75 | Pending |
| DR-06 | 75 | Pending |
| TST-03 (SFDateRangePicker) | 75 | Pending |
| REG-01 | 76 | Pending |
| BND-08 | 76 | Pending |
| AES-05 | 76 | Pending |
