# ROADMAP — v1.10 Library Completeness

**Milestone:** v1.10 Library Completeness
**Phases:** 71–76 (continuing from v1.9; no phase number reset)
**Granularity:** Standard (6 phases, research-derived)
**Coverage:** 34 v1.10 REQ-IDs → 6 phases (100%)
**Created:** 2026-05-01

---

## Standing Rules (Active Across All Phases)

These rules carry forward from v1.9 and are enforced at every phase close — no exceptions without an explicit `_path_X_decision` or `_dep_X_decision` ratification block.

- **200 KB First Load JS hard target** — currently 187.6 KB (12.4 KB headroom); regression requires `_dep_X_decision` ratification
- **D-04 chunk-ID stability lock holds** — no `optimizePackageImports` changes in v1.10; the 8-entry list (`@/components/sf`, `lucide-react`, `radix-ui`, `input-otp`, `cmdk`, `vaul`, `sonner`, `react-day-picker`) is frozen
- **AES-01..04 per-phase** — enforced from `.planning/codebase/AESTHETIC-OF-RECORD.md`; no Chromatic re-baseline for architectural changes; AES-04 pixel-diff ≤0.5% per page per phase
- **Single-ticker rule** — any new rAF call site is a violation; GSAP ticker or PerformanceObserver only
- **PF-04 contract** — Lenis `autoResize: true` is code-of-record; do not revert
- **Zero border-radius everywhere** — override all library defaults (`rounded-none` on every sub-element)
- **OKLCH only** — no HSL, RGB, or hardcoded hex values; no library default color values leaking through
- **`_dep_X_decision` blocks at plan-time** — for any new runtime npm dep; never post-hoc; format mirrors `_wmk_01_decision` (7 fields: decided/audit/dep_added/version/rationale/bundle_evidence/review_gate); bundle_evidence MUST be post-`pnpm add` measurement, not an estimate
- **`_path_X_decision` blocks for gate loosenings** — (decided/audit/original/new/rationale/evidence/review_gate)
- **`experimental.inlineCss: true` rejected** — breaks `@layer signalframeux` cascade ordering
- **Zero new runtime npm deps WITHOUT explicit ratification** — devDeps allowed when measurement-time only
- **Same-commit rule** — component file + barrel export (if Pattern C) + registry entry land in one commit
- **Stale-chunk guard** — `rm -rf .next/cache .next && ANALYZE=true pnpm build` before any gating measurement

---

## Phases

- [x] **Phase 71: SFDataTable** — TanStack Table v8 integration; sort, filter, pagination, row selection; P3 lazy; `_dep_dt_01_decision` ratified at plan time (completed 2026-05-01)
- [x] **Phase 72: SFCombobox** — Pure SF composition (cmdk + Radix Popover + SFInput); zero new deps; barrel-exported; confidence-builder phase (completed 2026-05-01)
- [x] **Phase 73: SFRichEditor** — Tiptap integration; core toolbar + code + link; P3 lazy; `_dep_re_01_decision` ratified at plan time; globals.css ProseMirror scoped rules (completed 2026-05-02)
- [ ] **Phase 74: SFFileUpload** — Native File API; drag-drop + validation + progress via SFProgress; zero new deps; barrel-exported; split test strategy documented
- [ ] **Phase 75: SFDateRangePicker** — react-day-picker range mode + presets + time variant; zero new deps; barrel-exported; SSR hydration guard mandatory
- [ ] **Phase 76: Final Gate** — BND-08 clean build measurement, AES-05 Chromatic baseline approval, REG-01 registry verification, DEP-01..02 block commit, SCAFFOLDING.md count update to 58

---

## Phase Details

### Phase 71: SFDataTable

**Goal:** SFDataTable is shipped as a P3 lazy component with sort, filter, pagination, and row selection — the `_dep_dt_01_decision` ratification sets the precedent for runtime dep exceptions in this milestone.

**Depends on:** Nothing (all building blocks exist; ordering is risk-sequencing — highest-stakes dep introduction first)

**Requirements:** DT-01, DT-02, DT-03, DT-04, DT-05, DT-06, DEP-01, TST-03

**Phase-specific constraints:**

- `_dep_dt_01_decision` block MUST be authored and committed before `pnpm add @tanstack/react-table`; bundle evidence field populated post-install via `ANALYZE=true pnpm build`
- `@tanstack/react-table` NOT added to `optimizePackageImports` (D-04 lock holds — P3 lazy is the correct mechanism)
- `SFDataTable` and `sf-data-table-lazy.tsx` NOT exported from `sf/index.ts` barrel; consumers import via `@/components/sf/sf-data-table-lazy`
- Sort headers MUST use `<button type="button">` (NOT `<div onClick>`) per WCAG 2.1.1; axe-core keyboard nav test is a phase acceptance criterion
- JSDoc documents `virtualize` prop as a future extension point (v1.11 `SFDataTableVirtual`, `_dep_dt_02_decision`)
- Verify `@/components/sf/sf-scroll-area` resolves correctly (file remains on disk post-Phase-67 DCE) before any SFScrollArea import
- TanStack Table devtools path MUST NOT appear in any production chunk

**Success Criteria** (what must be TRUE when this phase completes):

1. A consumer can render `SFDataTableLazy` with sort — clicking a column header cycles asc/desc/none with a visible glyph indicator, and keyboard Enter/Space on the header button toggles the same cycle
2. A consumer can render `SFDataTableLazy` with a text filter input that debounces at 300ms and reduces displayed rows on each keystroke
3. A consumer can navigate pages via the existing `SFPagination` composition inside the table, passing controlled `pageIndex` and `pageSize` props
4. A consumer can enable checkbox row selection with single + multi + indeterminate header state; selected rows are accessible via `getRowModel().rows.filter(r => r.getIsSelected())`
5. Homepage First Load JS remains under 200 KB after `pnpm add @tanstack/react-table` and clean build; `_dep_dt_01_decision` block is committed with measured (not estimated) bundle evidence

**Plans:** 4/3 plans complete

- [x] 71-01-PLAN.md — _dep_dt_01_decision ratification block + pnpm add @tanstack/react-table@^8.21.3 + post-install bundle measurement (DEP-01)
- [x] 71-02-PLAN.md — SFDataTable<TData> impl (sort + filter + selection + density CVA) + useDebouncedValue hook + SFCheckbox indeterminate visual (DT-01, DT-02, DT-04, DT-05)
- [x] 71-03-PLAN.md — DT-03 pagination composition + SFDataTableLazy P3 wrapper + playground fixture + Playwright/axe specs + production chunk audit (DT-03, DT-06, TST-03, DEP-01 closeout)

---

### Phase 72: SFCombobox

**Goal:** SFCombobox is shipped as a barrel-exported Pattern C component — a clean SF composition of existing primitives, zero new deps, demonstrating the composition model before the heavier Phase 73.

**Depends on:** Phase 71 (risk-sequencing only; no hard build-order dependency)

**Requirements:** CB-01, CB-02, CB-03, CB-04, TST-03

**Phase-specific constraints:**

- `SFCommand*` imported from `@/components/sf/sf-command` directly — NEVER via `sf/index.ts` barrel (cmdk must not appear in the barrel import chain)
- `SFInput` MUST NOT be used as `PopoverTrigger` with `asChild` — ARIA double-attribute conflict causes focus trap misfires; use a wrapper `<button>` as trigger; `CommandInput` lives inside popover content
- `SFCombobox` IS exported from `sf/index.ts` barrel (Pattern C)
- Zero new runtime npm deps
- axe-core test in open combobox state (listbox role, keyboard nav) is a phase acceptance criterion

**Success Criteria** (what must be TRUE when this phase completes):

1. A consumer can render `SFCombobox` in single-select mode: typing filters options in real time, arrow keys navigate the list, Enter selects the focused option, and Escape closes the popover without selecting
2. A consumer can reset the selection via a visible clear affordance, and can render grouped options via `CommandGroup` with correct group label rendering
3. A consumer can enable multi-select via the `multiple` prop — selected items render as `SFBadge` chips with a remove affordance, and the controlled `value: string[]` API reflects all selections
4. axe-core reports zero violations on the open combobox in both controlled and uncontrolled modes (listbox role, activedescendant, keyboard nav pattern)

**Plans:** 2/2 plans complete

---

### Phase 73: SFRichEditor

**Goal:** SFRichEditor is shipped as a P3 lazy component with a minimal but complete editorial toolbar — the `_dep_re_01_decision` ratification chooses Tiptap version and establishes the ProseMirror CSS isolation pattern in globals.css.

**Depends on:** Phase 72 (risk-sequencing only; P3 lazy pattern confidence established by Phase 71)

**Requirements:** RE-01, RE-02, RE-03, RE-04, RE-05, RE-06, DEP-02, TST-03

**Phase-specific constraints:**

- `_dep_re_01_decision` block MUST be authored and committed before `pnpm add`; must record Tiptap version chosen (v3.22.5 recommended; v2.27.2 if rejected), ProseMirror chain, and whether `@tiptap/extension-link` requires a separate dep entry in v3; bundle evidence from post-`pnpm add` `ANALYZE=true pnpm build` (NOT an estimate)
- `injectCSS: false` MUST be set on every `useEditor()` call — prevents ProseMirror.css from injecting unlayered styles that override `@layer signalframeux`
- `.ProseMirror` and `.ProseMirror *` scoped rules added to `app/globals.css` under `@layer signalframeux`; only 4 element rules needed (p, h1–h4, ul/ol/li, blockquote); no Tiptap CSS imports anywhere
- `immediatelyRender: false` SSR guard on every `useEditor()` call — non-negotiable
- `ssr: false` on `next/dynamic` wrapper — ProseMirror crashes on SSR
- `SFRichEditor` and `sf-rich-editor-lazy.tsx` NOT exported from `sf/index.ts` barrel
- `parameters.chromatic.delay = 500` on every Storybook story (ProseMirror DOM population is async)
- Anti-features NOT shipped: H4/H5/H6, font picker, color picker, text alignment, floating toolbar, collaborative editing — each documented in JSDoc with rationale (RE-06)
- StarterKit MUST NOT appear at any barrel-reachable level (bundle escape = First Load JS spike above 200 KB)

**Success Criteria** (what must be TRUE when this phase completes):

1. A consumer renders `SFRichEditorLazy` and can apply bold, italic, underline, strike, H1/H2/H3, bulleted list, ordered list, and blockquote — each toolbar button reflects active state via `data-active` on the `SFButton` composition
2. A consumer can render `SFRichEditorLazy` in read-only mode (`readOnly` prop), and can control editor content via the `value` HTML string + `onChange` controlled API
3. The editor renders with zero system-font leakage (content area uses `--sfx-*` token stack) and zero rounded corners; `.ProseMirror *` rules are scoped under `@layer signalframeux` and do not override any `--sfx-*` tokens
4. Homepage First Load JS remains under 200 KB after Tiptap deps are added; `_dep_re_01_decision` block is committed with measured bundle evidence; `@tiptap/*` chunks are absent from the homepage First Load chunk manifest

**Plans:** 3/3 plans complete

---

### Phase 74: SFFileUpload

**Goal:** SFFileUpload is shipped as a barrel-exported Pattern C component using only native browser APIs — the split test strategy acknowledging the Playwright `dataTransfer.files` permanent gap is documented as a first-class phase deliverable, not a gap to paper over.

**Depends on:** Phase 73 (risk-sequencing only; no hard build-order dependency)

**Requirements:** FU-01, FU-02, FU-03, FU-04, FU-05, TST-03, TST-04

**Phase-specific constraints:**

- Zero new runtime npm deps; consumer owns the HTTP upload (component owns UI state only)
- Image preview via `URL.createObjectURL` — NEVER `FileReader.readAsDataURL` for large files
- Drop zone MUST have keyboard fallback (hidden `<input type="file">` click-to-browse path IS the keyboard fallback; focus-visible on drop zone wrapper required)
- Built-in HTTP fetch/XHR MUST NOT live inside the component — consumer supplies `progress: Record<fileName, number>`
- Split test strategy MUST be documented in the plan before implementation begins: `locator.setInputFiles()` against hidden input for acceptance logic; Chromatic story with `play()` for drag visual state; permanent gap on `dataTransfer.files` in Chromium CI documented explicitly in `74-VERIFICATION.md` (FU-05 + TST-04)
- `SFFileUpload` IS exported from `sf/index.ts` barrel (Pattern C)

**Success Criteria** (what must be TRUE when this phase completes):

1. A consumer renders `SFFileUpload` and can select files via click-to-browse; selected files appear in a list with per-file remove affordance and correct MIME/size validation error state when constraints are violated
2. A consumer renders `SFFileUpload` in multi-file mode — multiple files can be selected, each with an independent error or accepted state; the controlled `files` + `onChange` API reflects the current file list
3. A consumer supplies a `progress: Record<fileName, number>` prop and the existing `SFProgress` component renders per-file progress bars tracking the provided values; image files display a preview via `URL.createObjectURL`
4. `74-VERIFICATION.md` explicitly documents the `dataTransfer.files` Playwright/Chromium permanent gap — the drag-drop acceptance path is verified via Chromatic story, not via a vacuously-passing Playwright test

**Plans:** TBD

---

### Phase 75: SFDateRangePicker

**Goal:** SFDateRangePicker is shipped as a barrel-exported Pattern C component with range mode, single-date mode, presets panel, and optional time variant — the SSR hydration guard on `new Date()` and the react-day-picker CSS isolation pattern are non-negotiable authoring constraints.

**Depends on:** Phase 74 (risk-sequencing only; most complex composition, placed last in component sequence)

**Requirements:** DR-01, DR-02, DR-03, DR-04, DR-05, DR-06, TST-03

**Phase-specific constraints:**

- `new Date()` ONLY inside `useEffect` or `useMemo` — NEVER at module level or outside a hook (SSR hydration mismatch)
- `import 'react-day-picker/dist/style.css'` MUST NEVER appear anywhere — all styling via `classNames` prop using `--sfx-*` token classes only; selected day = `bg-primary text-primary-foreground`; `rounded-none` on every element (overrides react-day-picker `rounded-full` selected day default)
- Locale type-only pass-through: `locale?: Locale` accepting `Locale` from `date-fns/locale` as type-only import (`import type { Locale } from 'date-fns/locale'`); NEVER import date-fns runtime code; consumers provide locale objects from their own installation
- `SFTimePicker` MUST NOT be extracted as a shared primitive — single v1.10 consumer; use `<SFInput type="time">` inline
- `SFDateRangePicker` composes `SFCalendarLazy` (already P3 lazy) + `SFPopover` + `SFInput`
- `SFDateRangePicker` IS exported from `sf/index.ts` barrel (Pattern C)
- Verify `range_middle` is a valid react-day-picker v9.14.0 `classNames` key at plan time
- Playwright hydration test (zero console hydration warnings on picker route) is a phase acceptance criterion

**Success Criteria** (what must be TRUE when this phase completes):

1. A consumer renders `SFDateRangePicker` in range mode — clicking a start date and end date highlights the range with `range_start`, `range_middle`, `range_end` visual states; the read-only `SFInput` trigger displays a formatted date range string
2. A consumer can configure presets (e.g., "Last 7 days", "Last 30 days") as left-rail buttons; selecting a preset sets the controlled `value` and closes the popover
3. A consumer enables the `withTime` prop — an inline `<SFInput type="time">` renders inside the popover for time-of-day specification; no external `SFTimePicker` primitive is introduced
4. The picker mounts with zero console hydration warnings; `new Date()` is only called inside `useEffect` or `useMemo`; no react-day-picker default styles leak through; all day cells render with `rounded-none`

**Plans:** TBD

---

### Phase 76: Final Gate

**Goal:** All 5 components are verified to satisfy the 200 KB hard target, aesthetic preservation rules, and registry completeness — the milestone closes only after a clean build measurement, Chromatic baseline approval, and documentation is updated.

**Depends on:** Phases 71, 72, 73, 74, 75 (HARD dependency — gate fires only after all 5 components ship)

**Requirements:** REG-01, BND-08, AES-05

**Phase-specific constraints:**

- BND-08 clean build protocol: `rm -rf .next/cache .next && ANALYZE=true pnpm build`; assert `BUDGET_BYTES = 200 * 1024` in `tests/v1.8-phase63-1-bundle-budget.spec.ts`; verify `@tanstack/react-table` and `@tiptap/*` absent from homepage First Load chunk manifest
- AES-05 Chromatic audit checklist: zero rounded corners on all 5 components; no react-day-picker blue; no Tiptap system fonts in editor content; spacing on blessed stops (4/8/12/16/24/32/48/64/96); OKLCH-only colors verified
- REG-01: 5 new registry entries in `public/r/registry.json` — `meta.layer: "frame"`; `meta.pattern: "C"` for SFCombobox / SFFileUpload / SFDateRangePicker; `meta.pattern: "B"` + `meta.heavy: true` for SFDataTable / SFRichEditor; SCAFFOLDING.md component count header updated to 58
- DEP-01 (`_dep_dt_01_decision`) and DEP-02 (`_dep_re_01_decision`) blocks verified committed to main before gate closes
- D-04 chunk-ID baseline verified unchanged (no `optimizePackageImports` drift)
- Worktree leakage check: `git status` before every commit; any untracked file in `components/sf/` not intentionally authored in v1.10 is a leakage artifact

**Success Criteria** (what must be TRUE when this phase completes):

1. `rm -rf .next/cache .next && ANALYZE=true pnpm build` reports homepage `/` First Load JS ≤ 200 KB; the bundle spec test asserts `BUDGET_BYTES = 200 * 1024` and passes green
2. `@tanstack/react-table` and `@tiptap/*` packages are absent from the homepage First Load chunk manifest — both are present only in route-bound lazy chunk output
3. Chromatic shows zero rounded corners, zero library-default colors (no react-day-picker blue, no Tiptap system-font content), and spacing at blessed stops across all 5 new component stories
4. `public/r/registry.json` contains 5 new entries with correct `meta.layer`, `meta.pattern`, and `meta.heavy` fields; SCAFFOLDING.md component count reads 58

**Plans:** TBD

---

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 71 — SFDataTable | 4/3 | Complete    | 2026-05-01 |
| 72 — SFCombobox | 2/2 | Complete    | 2026-05-01 |
| 73 — SFRichEditor | 3/3 | Complete    | 2026-05-02 |
| 74 — SFFileUpload | 0/TBD | Not started | — |
| 75 — SFDateRangePicker | 0/TBD | Not started | — |
| 76 — Final Gate | 0/TBD | Not started | — |

---

## Coverage

| REQ-ID | Phase | Notes |
|--------|-------|-------|
| DT-01 | 71 | Column sort |
| DT-02 | 71 | Per-column + global filter |
| DT-03 | 71 | Pagination via SFPagination |
| DT-04 | 71 | Row selection |
| DT-05 | 71 | Density/skeleton/empty/keyboard nav (ships within DT-01..04 delivery) |
| DT-06 | 71 | P3 lazy wrapper |
| DEP-01 | 71 | `_dep_dt_01_decision` block |
| TST-03 | 71 | Per-component Playwright + axe-core (instance 1 of 5) |
| CB-01 | 72 | Single-select + keyboard nav |
| CB-02 | 72 | Clear + grouping |
| CB-03 | 72 | Multi-select variant |
| CB-04 | 72 | Barrel export (Pattern C) |
| TST-03 | 72 | Per-component Playwright + axe-core (instance 2 of 5) |
| RE-01 | 73 | Core toolbar |
| RE-02 | 73 | Code block + link extension |
| RE-03 | 73 | Controlled + uncontrolled API + read-only |
| RE-04 | 73 | `injectCSS: false` + globals.css ProseMirror scoped rules |
| RE-05 | 73 | P3 lazy wrapper |
| RE-06 | 73 | Anti-features documented in JSDoc |
| DEP-02 | 73 | `_dep_re_01_decision` block |
| TST-03 | 73 | Per-component Playwright + axe-core (instance 3 of 5) |
| FU-01 | 74 | Drag-drop zone + click-to-browse |
| FU-02 | 74 | Validation + multi-file |
| FU-03 | 74 | Progress + controlled API + image preview |
| FU-04 | 74 | Barrel export (Pattern C) |
| FU-05 | 74 | Split test strategy documented |
| TST-03 | 74 | Per-component Playwright + axe-core (instance 4 of 5) |
| TST-04 | 74 | FileUpload split-test strategy in `74-VERIFICATION.md` |
| DR-01 | 75 | Date range mode + popover trigger + range highlight |
| DR-02 | 75 | Keyboard input + min/max + disabled dates + clear |
| DR-03 | 75 | Presets panel + locale type-only pass-through + controlled API |
| DR-04 | 75 | Inline time variant (`withTime` prop) |
| DR-05 | 75 | Barrel export (Pattern C) |
| DR-06 | 75 | react-day-picker CSS isolation (`classNames` only) |
| TST-03 | 75 | Per-component Playwright + axe-core (instance 5 of 5) |
| REG-01 | 76 | 5 registry entries + SCAFFOLDING.md count to 58 |
| BND-08 | 76 | ≤200 KB clean build measurement |
| AES-05 | 76 | Chromatic baseline approval |

**Total v1.10 REQ-IDs mapped: 34 across 6 phases (100%)**

*TST-03 is a per-phase recurring requirement (5 instances, one per component phase). Each instance is a distinct deliverable — different test files, different component surfaces.*

---

## Dependency Graph

```
Phase 71 (SFDataTable)          ← risk-sequencing start: dep-first
  └─► Phase 72 (SFCombobox)     ← confidence-builder: zero-dep Pattern C
        └─► Phase 73 (SFRichEditor) ← largest dep: SSR complexity
              └─► Phase 74 (SFFileUpload)    ← zero-dep: breathing room
                    └─► Phase 75 (SFDateRangePicker) ← most complex composition
                          └─► Phase 76 (Final Gate)  ← HARD dep on 71-75 all
```

No phase among 71–75 has a hard build-order dependency on any other — all building blocks exist. Ordering is risk-sequencing only. Phase 76 is the only hard dependency: it fires only after all 5 components ship.
