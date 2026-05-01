# Project Research Summary

**Project:** SignalframeUX v1.10 Library Completeness
**Domain:** Design system component expansion — 5 complex interactive components
**Researched:** 2026-05-01
**Confidence:** HIGH

## Executive Summary

v1.10 ships five highest-impact missing SF components — SFDataTable, SFCombobox, SFRichEditor, SFFileUpload, SFDateRangePicker — into a system with strict locked constraints: 200 KB First Load JS hard cap (currently 187.6 KB, 12.4 KB headroom), D-04 chunk-ID stability lock, zero border-radius everywhere, OKLCH-only colors, and the `@layer signalframeux` cascade architecture. The research consensus is clear: all three heavy components (SFDataTable, SFRichEditor, SFDateRangePicker) must be P3 lazy via `next/dynamic({ ssr: false })`, and the two lightweight components (SFCombobox, SFFileUpload) require zero new runtime deps. This is the architectural move that makes the entire v1.10 scope achievable without touching the 200 KB gate.

Two new runtime deps are required and must ship under `_dep_X_decision` ratification blocks: `@tanstack/react-table@8.21.3` + `@tanstack/react-virtual@3.13.24` (SFDataTable, P3 lazy chunk, ~18-20 KB gzip contained) and `@tiptap/react` + `@tiptap/pm` + `@tiptap/starter-kit` (SFRichEditor, P3 lazy chunk, ~55-70 KB gzip contained). Because both dep sets land in lazy chunks, First Load JS impact is 0 KB for both. Projected First Load JS after all five components ship: approximately 195-198 KB — within the hard target.

The dominant risk is bundle discipline: Tiptap's StarterKit is an 80-120 KB threat if it escapes the lazy boundary via barrel export or developer shortcut. The second risk is aesthetic correctness under new third-party ownership — react-day-picker's default stylesheet, Tiptap's ProseMirror.css injection, and library border-radius defaults all silently violate locked standing rules. The D-04 chunk-ID lock is safe in v1.10 — no `optimizePackageImports` additions are needed because P3 lazy already defers the new deps without touching the 8-entry list.

---

## Open Decisions (Must Resolve Before or During Phase Plans)

Three decisions flagged across research files require explicit resolution at plan time.

### Decision 1: Tiptap Version — `_dep_re_01_decision` (Phase 73)

**Status:** UNRESOLVED — must be decided at Phase 73 plan time.

**Context:** npm's `latest` tag now points to Tiptap v3.22.5 (stable since early 2026). The `v2-latest` dist-tag points to v2.27.2. PROJECT.md was drafted with a "Tiptap v2" placeholder written before v3 achieved stable status.

**Recommendation: Default to v3.22.5.** v3 is the maintained track. v2 will receive fewer security patches over time. The primary API difference in v3 is a JSX-in-`renderHTML` addition and the already-required `immediatelyRender: false` SSR guard (identical to v2). Gzip range is similar. Using v2 today means a forced breaking migration in a future milestone.

**Decision block required:** `_dep_re_01_decision` at Phase 73 plan time. Record the version chosen, rationale, and ProseMirror chain. If v3 is chosen, StarterKit version is `@tiptap/starter-kit@3.x` (verify on npm at plan time).

**Additional Phase 73 plan-time decision required:** `injectCSS: false` must be set at editor initialization — prevents ProseMirror.css from injecting unlayered styles that override `@layer signalframeux`. Scoped `.sf-rich-editor-content *` rules in `app/globals.css` under `@layer signalframeux` are the replacement. This is a Phase 73 authoring constraint, not a v1.10-level research gap.

**Tiptap link extension scope:** `@tiptap/extension-link` may be a separate dep from starter-kit in v3 (was bundled in StarterKit v2). If link support is required in Phase 73 scope, an additional dep entry is needed in `_dep_re_01_decision`. Decide at Phase 73 plan time.

---

### Decision 2: SFDataTable Virtualization — Out of Scope for v1.10 (DT requirements re-number)

**Status:** RESOLVED by research consensus — PROJECT.md must be updated.

**Context:** PROJECT.md currently lists `DT-01..05` with "virtualization" in scope. Both FEATURES.md and ARCHITECTURE.md independently concluded that virtualization must be deferred to v1.11 as a separate `SFDataTableVirtual` component.

**Recommendation: Re-number as DT-01..04. Virtualization explicitly out of v1.10 scope.**

- DT-01: Column sort (single, ascending/descending/none cycle) + sort indicator
- DT-02: Text column filter (per-column input, debounced) + global filter
- DT-03: Page-number pagination composing SFPagination
- DT-04: Checkbox row selection (single + multi + indeterminate header state)
- Density modes, loading skeleton, empty state, keyboard nav grid role ship within DT-01..04 delivery

**Virtualization posture:** The `SFDataTable` component API must accept a future `virtualize` prop without breaking changes. Document the extension point in JSDoc at Phase 71. `SFDataTableVirtual` (TanStack Virtual dep via `_dep_dt_02_decision`) is v1.11+ scope.

**`@tanstack/react-virtual` dep status:** `_dep_dt_02_decision` is therefore a v1.11 item. Only `_dep_dt_01_decision` (TanStack Table) is a v1.10 ratification item.

---

### Decision 3: D-04 Chunk-ID Lock Holds in v1.10

**Status:** RESOLVED by research consensus.

**Decision: D-04 lock holds unchanged through all of v1.10. No `optimizePackageImports` changes. No unlock ceremony needed.**

The 8-entry list (`@/components/sf`, `lucide-react`, `radix-ui`, `input-otp`, `cmdk`, `vaul`, `sonner`, `react-day-picker`) is frozen. New heavy deps land in P3 lazy chunks by route — this is the correct mechanism. The stable chunk-ID baseline at `.planning/codebase/v1.9-bundle-reshape.md` remains the measurement surface for BND-08.

The only bundle measurement required is BND-08 final gate at Phase 76: `rm -rf .next/cache .next && ANALYZE=true pnpm build`, asserting First Load JS ≤ 200 KB.

---

## Key Findings

### Recommended Stack

Three of five components require zero new runtime deps — they are pure compositions of existing primitives. SFCombobox composes `cmdk@1.1.1` (installed) + Radix Popover + SFInput + SFCommand. SFFileUpload uses the native HTML File API + DataTransfer + SFProgress + SFButton. SFDateRangePicker builds on `react-day-picker@9.14.0` (installed, in `optimizePackageImports`) + SFCalendarLazy + SFPopover + SFInput.

**New runtime deps (require `_dep_X_decision`):**

| Package | Version | Gzip (lazy chunk) | Load | Decision Block |
|---------|---------|-------------------|------|----------------|
| `@tanstack/react-table` | 8.21.3 | ~12 KB | P3 lazy | `_dep_dt_01_decision` |
| `@tiptap/react` + `@tiptap/pm` + `@tiptap/starter-kit` | v3.x (recommended) or v2.27.2 | ~55-70 KB | P3 lazy | `_dep_re_01_decision` |

**Zero-dep components:**

| Component | Composition Source |
|-----------|--------------------|
| SFCombobox | cmdk@1.1.1 (installed) + Radix Popover + SFInput + SFCommand |
| SFFileUpload | Native File API + SFProgress + SFButton + Lucide React |
| SFDateRangePicker | react-day-picker@9.14.0 (installed) + SFCalendarLazy + SFPopover + SFInput |

All five components require `'use client'`. SFDataTable, SFRichEditor require `next/dynamic({ ssr: false })` (SFDateRangePicker defers laziness through SFCalendarLazy which is already P3 lazy).

### Expected Features

**Must have (table stakes):**
- SFDataTable: sort + filter + pagination + row selection + loading skeleton + empty state + density CVA + keyboard nav grid role
- SFCombobox: single-select, type-ahead filter, keyboard nav, empty/loading state, clear/reset, grouping, controlled + uncontrolled API
- SFRichEditor: bold/italic/underline/strike, H1/H2/H3, lists, blockquote, code block + inline code, link, toolbar with active state, placeholder, character count, controlled API, read-only mode
- SFFileUpload: drag-drop zone, click-to-browse, file list, remove file, type + size validation, multi-file, progress via SFProgress, per-file error state, disabled state, controlled API
- SFDateRangePicker: date range + single date + keyboard input + popover trigger + range highlight + min/max + disabled dates + clear/reset + controlled API + presets panel

**Should have (ship in phase if time allows):**
- SFDataTable: server-side data mode, expandable rows, multi-column sort, global filter
- SFCombobox: multi-select, async search callback, creatable items
- SFRichEditor: image paste (consumer `onImageUpload` callback), paste-from-Word cleanup
- SFFileUpload: image preview (URL.createObjectURL), paste from clipboard, retry on failure
- SFDateRangePicker: datetime mode

**Defer to v1.11:**
- SFDataTable virtualization (`SFDataTableVirtual`, `_dep_dt_02_decision`)
- SFRichEditor slash commands and @-mentions (HIGH complexity, Tiptap Suggestion API)
- SFDateRangePicker comparison range, time-only mode
- SFDateRangePicker locale support: accept `locale?: Locale` as pass-through prop, import `Locale` as type-only from date-fns — never import date-fns runtime code (avoids transitive dep hitting BND-08)

**date-fns transitive dep risk:** Accept `locale?: Locale` (type-only import). Consumers who need locale support provide the object from their own date-fns installation. No date-fns runtime import inside the component.

### Architecture Approach

Pattern B (P3 lazy, never in barrel) applies to SFDataTable and SFRichEditor. Pattern C (pure-SF composition, in barrel) applies to SFCombobox, SFFileUpload, SFDateRangePicker. `sf/index.ts` never gets `'use client'` (SCAFFOLDING.md rule #3 invariant).

**New files created (7 total):**

| File | Pattern | Barrel |
|------|---------|--------|
| `components/sf/sf-data-table.tsx` | B impl | NO |
| `components/sf/sf-data-table-lazy.tsx` | B lazy wrapper | NO |
| `components/sf/sf-combobox.tsx` | C | YES |
| `components/sf/sf-rich-editor.tsx` | B impl | NO |
| `components/sf/sf-rich-editor-lazy.tsx` | B lazy wrapper | NO |
| `components/sf/sf-file-upload.tsx` | C | YES |
| `components/sf/sf-date-range-picker.tsx` | C | YES |

**Integration points:**
- `sf/index.ts` — adds SFCombobox, SFFileUpload, SFDateRangePicker; SFDataTable and SFRichEditor stay out
- `app/globals.css` — adds `.ProseMirror` scoped rules under `@layer signalframeux`
- `public/r/registry.json` — 5 new entries (REG-01), same-commit as component files
- `next.config.ts` — NO changes (D-04 lock holds)

**Direct imports (not via barrel) inside new components:**
- `SFCommand*` — SFCombobox imports from `@/components/sf/sf-command` directly
- `SFScrollArea` — SFDataTable imports from `@/components/sf/sf-scroll-area` directly

### Critical Pitfalls

1. **Tiptap StarterKit bundle escape** — Any barrel export of SFRichEditor or module-level Tiptap import in a barrel-reachable file pulls 80-120 KB into First Load JS. Prevention: P3 lazy mandatory, never in barrel. Warning sign: homepage First Load JS climbs above 200 KB after Phase 73. Verify with `ANALYZE=true pnpm build` before phase sign-off.

2. **D-04 `optimizePackageImports` violation** — Adding `@tanstack/react-table` or `@tiptap/react` to `next.config.ts` reshuffles the post-Phase-67 chunk graph without an authorized unlock window. Prevention: do not add any entry to `optimizePackageImports` in v1.10.

3. **Tiptap ProseMirror.css cascade override** — ProseMirror injects an unlayered `<style>` tag at editor mount that wins over `@layer signalframeux`. Prevention: `injectCSS: false` on every `useEditor()` call + scoped `.sf-rich-editor-content *` rules in `globals.css`.

4. **react-day-picker default stylesheet OKLCH violation** — `import 'react-day-picker/dist/style.css'` overrides `--sfx-*` tokens with hardcoded HSL/RGB. Prevention: never import the stylesheet; all styling via `classNames` prop using `--sfx-*` token classes only. Selected-day = `bg-primary text-primary-foreground`.

5. **SFFileUpload Playwright `dataTransfer.files` permanent gap** — Playwright cannot set `dataTransfer.files` via `dispatchEvent` in Chromium. Split test strategy required: `locator.setInputFiles()` against hidden `<input type="file">` for acceptance logic; Chromatic story with `play()` for drag visual state. Document gap explicitly in phase close.

6. **Rounded corners from library defaults** — react-day-picker selected day is `rounded-full` by default; cmdk's `CommandItem` has `rounded-md`. Prevention: `rounded-none` on every element in every new component; Chromatic diff vs v1.10-start baseline as the catch gate.

7. **Worktree file leakage** — 13 stale `.claude/worktrees/agent-*` directories are gitignored but leakage mechanism is active. Prevention: `git status` before every commit; any untracked file in `components/sf/` not intentionally authored in that phase is a leakage artifact.

---

## Implications for Roadmap

The 6-phase structure in PROJECT.md (Phases 71-76) is confirmed correct. One adjustment required: DT-01..05 must be updated to DT-01..04 (virtualization out of v1.10 scope).

### Phase 71: SFDataTable

**Rationale:** Largest new dep introduction; sets `_dep_dt_01_decision` precedent. First phase because dep ratification is the highest-stakes decision and should be resolved before subsequent phases assume it settled.

**Delivers:** SFDataTable (DT-01..04: sort, filter, pagination, row selection + density modes, skeleton, empty state, keyboard nav) + `_dep_dt_01_decision` ratified.

**Must avoid:**
- TanStack Table devtools path in any production chunk
- `@tanstack/react-table` added to `optimizePackageImports` (D-04 violation)
- SFDataTable exported from `sf/index.ts` barrel
- Sort headers using `<div onClick>` instead of `<button type="button">` (WCAG 2.1.1)

**Research flag:** Standard patterns. Axe-core Playwright test for sort header keyboard nav is a Phase 71 acceptance criterion.

---

### Phase 72: SFCombobox

**Rationale:** Zero new deps, Pattern C template — lower risk; good confidence builder before the heavier Phase 73.

**Delivers:** SFCombobox (CB-01..03: single-select, type-ahead filter, keyboard nav, empty/loading state, clear, grouping, controlled + uncontrolled API) exported from barrel.

**Must avoid:**
- `SFInput` as `PopoverTrigger` with `asChild` — ARIA double-attribute, focus trap misfires. Use wrapper `<button>` as trigger; `CommandInput` lives inside popover content.
- `cmdk` appearing in `sf/index.ts` import chain (import `SFCommand*` from direct path only).

**Research flag:** Standard patterns. Axe-core test in open combobox state is a Phase 72 acceptance criterion.

---

### Phase 73: SFRichEditor

**Rationale:** Largest overall dep (55-70 KB gzip), most complex SSR concerns, globals.css mutation. Placed after two successful phases to establish P3 lazy pattern confidence.

**Delivers:** SFRichEditor (RE-01..04: core toolbar, code, link, character count, controlled API, read-only mode) + `_dep_re_01_decision` ratified + globals.css `.ProseMirror` scoped rules.

**Plan-time decisions required:**
- `_dep_re_01_decision`: Tiptap v3.22.5 (recommended) vs v2.27.2
- `injectCSS: false` + scoped globals.css block (not optional)
- `@tiptap/extension-link` dep scope: verify v3 starter-kit bundling at plan time
- `parameters.chromatic.delay = 500` on every story (ProseMirror DOM population is async)

**Must avoid:**
- StarterKit import at any barrel-reachable level
- `ssr: false` omitted from `next/dynamic` (ProseMirror SSR crash)
- Any Tiptap CSS import
- H4/H5/H6, font picker, color picker, text alignment in toolbar (anti-features)

**Research flag:** Needs plan-time decision for v2/v3 version choice. Otherwise well-documented.

---

### Phase 74: SFFileUpload

**Rationale:** Zero new deps, pure-SF construction — lowest risk phase. Breathing room before the complex composition of Phase 75.

**Delivers:** SFFileUpload (FU-01..03: drag-drop, click-to-browse, file list, validation, multi-file, progress, error state, disabled, controlled API) exported from barrel. Image preview and clipboard paste ship in this phase if time allows (LOW complexity).

**Test strategy (must be documented in plan):**
- `locator.setInputFiles()` for file acceptance logic (type validation, size validation, multi-file, error state)
- Chromatic story with `play()` for drag visual state
- Document in Phase 74 close: drag-drop file events not covered by CI Playwright suite — permanent gap, not a TODO

**Must avoid:**
- Pure div-based drop zone with no keyboard fallback
- Built-in HTTP upload inside component (consumer owns the fetch)
- `FileReader.readAsDataURL` for large files (use `URL.createObjectURL` instead)

**Research flag:** Standard patterns. Split test strategy is fully specified above.

---

### Phase 75: SFDateRangePicker

**Rationale:** Most complex composition — depends on SFCalendarLazy stability, introduces inline `SFTimeInput` sub-component, has the `new Date()` hydration trap. Placed last in component sequence.

**Delivers:** SFDateRangePicker (DR-01..03: date range + single date + keyboard input + popover + range highlight + min/max + disabled dates + clear/reset + controlled API + **presets panel**) exported from barrel. Presets panel ships in this phase — LOW complexity, HIGH value.

**Locale prop:** Accept `locale?: Locale` pass-through prop; import `Locale` as type-only from date-fns. Never import date-fns runtime code. Consumers provide locale objects from their own installation.

**Must avoid:**
- `new Date()` at module level or outside a hook (SSR hydration mismatch)
- `import 'react-day-picker/dist/style.css'` (OKLCH violation)
- Extracting `SFTimePicker` as a shared primitive (one v1.10 consumer; use `<SFInput type="time">` inline)

**Research flag:** Standard patterns. Playwright hydration test (zero console warnings on picker route) is a Phase 75 acceptance criterion.

---

### Phase 76: Final Gate

**Rationale:** Bundle audit, Chromatic story coverage, registry completeness, docs — no new component code.

**Delivers:** BND-08 PASS (≤200 KB clean build), Chromatic baseline approval for all 5 components, 5 registry entries verified, DEP-01..02 `_dep_X_decision` blocks committed.

**Bundle audit protocol:** `rm -rf .next/cache .next && ANALYZE=true pnpm build`. Assert `BUDGET_BYTES = 200 * 1024`. Verify TanStack Table and Tiptap absent from homepage First Load manifest.

**Chromatic audit:** Zero rounded corners, no blue (react-day-picker), no system font (Tiptap content), spacing at blessed stops, OKLCH-only colors.

**Research flag:** Standard protocols from Phase 67 (BND-05) and Phase 62 (AES-04).

### Phase Ordering Rationale

- Dep-first: SFDataTable first sets the `_dep_X_decision` precedent; Tiptap third after two phases of P3 lazy confidence
- Risk-sequenced: complex SSR concerns (SFRichEditor) in middle, complex composition (SFDateRangePicker) last
- No hard build-order dependencies: all building blocks exist; ordering is risk-sequencing only
- D-04 stays locked throughout: no `optimizePackageImports` changes means chunk IDs remain stable for BND-08 measurement

### Research Flags

**Needs plan-time decision:**
- Phase 73: Tiptap v2.27.2 vs v3.22.5 — must choose before `pnpm add`; `_dep_re_01_decision` block required; also decide `@tiptap/extension-link` scope

**Standard patterns (no additional research):**
- Phase 71: TanStack Table v8 — best-documented headless table library
- Phase 72: Radix Popover + cmdk — existing shadcn pattern, zero new deps
- Phase 74: Native File API — MDN-documented, no library research needed
- Phase 75: react-day-picker range mode — already in stack, SFCalendar precedent
- Phase 76: Bundle audit + Chromatic — established protocols from prior milestones

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | npm registry verified; peer deps confirmed against react@19.1.0; gzip estimates from bundlephobia + community benchmarks; existing codebase cross-referenced |
| Features | HIGH | Official docs for TanStack Table v8, Tiptap, react-day-picker, cmdk, Radix UI; existing SF codebase patterns; CLAUDE.md anti-feature constraints well-defined |
| Architecture | HIGH | Sourced exclusively from shipped codebase files — no external speculation; P3 lazy from sf-calendar-lazy.tsx; D-04 lock from next.config.ts comments |
| Pitfalls | HIGH | 9-milestone project pitfall history; all 13 pitfalls traced to real project events or direct codebase inspection |

**Overall confidence: HIGH**

### Gaps to Address

- **Tiptap v3 StarterKit exact gzip (measured):** The 55-70 KB estimate is MEDIUM-confidence. `_dep_re_01_decision` block MUST include a post-`pnpm add` `ANALYZE=true pnpm build` measurement of the actual lazy-chunk size before ratification is complete. Do not close the decision block with an estimate.

- **Tiptap v3 `@tiptap/extension-link` dep structure:** In Tiptap v2, Link was bundled in StarterKit. Verify v3 bundling behavior at Phase 73 plan time against the v3 npm manifest.

- **SFScrollArea direct import path:** `sf-scroll-area.tsx` was DCE'd from the barrel in Phase 67 but the file remains on disk. Verify `@/components/sf/sf-scroll-area` resolves correctly before Phase 71 begins. 2-minute grep check.

- **react-day-picker v9 `range_middle` classNames key:** Existing SFCalendar has `range_start`/`range_end` precedents. Verify `range_middle` is a valid v9.14.0 classNames key at Phase 75 plan time.

---

## Sources

### Primary (HIGH confidence)
- npm registry API — version numbers, unpacked sizes, peer deps for all 5 component candidates
- TanStack Table v8 docs (tanstack.com/table/v8) — headless architecture, virtualization integration
- Tiptap docs (tiptap.dev) — Next.js App Router SSR guard, `immediatelyRender: false`
- react-day-picker v9 docs (daypicker.dev) — range mode API, classNames prop
- Radix UI Popover docs — Popover/asChild composition
- cmdk docs (cmdk.paco.me) — keyboard model, CommandInput filtering
- `components/sf/index.ts` — barrel exports, non-barrel rationale comments
- `components/sf/sf-calendar-lazy.tsx` — P3 lazy canonical pattern
- `components/sf/sf-calendar.tsx` — react-day-picker range prop passthrough precedent
- `next.config.ts` — D-04 chunk-ID lock rationale, optimizePackageImports list
- `.planning/codebase/v1.9-bundle-reshape.md` — bundle baseline, stable chunk IDs
- `SCAFFOLDING.md` — 9-point checklist, Pattern A/B/C definitions, registry template
- `.planning/PROJECT.md` — v1.10 requirements, standing rules, Key Decisions table

### Secondary (MEDIUM confidence)
- bundlephobia.com — TanStack Table ~15 KB gzip, TanStack Virtual ~3 KB gzip estimates
- Liveblocks blog + community articles — Tiptap starter-kit 50-70 KB gzip range
- Community measurements — Lexical ~22 KB gzip core (comparison only)

---
*Research completed: 2026-05-01*
*Ready for roadmap: yes*
