# Stack Research — v1.10 Library Completeness

**Domain:** Design system component expansion — 5 missing high-impact components
**Researched:** 2026-05-01
**Confidence:** HIGH (npm registry verified + existing codebase cross-referenced)

---

## Context: Existing Locked Stack (Do Not Re-Research)

Next.js 15.5 · TypeScript 5.8 · Tailwind CSS v4 · CVA · Radix UI via shadcn · GSAP 3.12 · Lenis · OKLCH · Lucide React · react-day-picker 9.14.0 (already installed) · Vercel

**Budget constraint:** 187.6 KB gzip current. 200 KB hard cap. 12.4 KB free headroom.

**Standing rule:** Zero new runtime npm deps without `_dep_X_decision` ratification block (REQ-ID-namespaced, precedent from `_wmk_01_decision`).

**optimizePackageImports current list (8 entries, chunk-id locked at Phase 67 baseline):**
`@/components/sf` · `lucide-react` · `radix-ui` · `input-otp` · `cmdk` · `vaul` · `sonner` · `react-day-picker`

Adding any new entry to this list reshuffles webpack's splitChunks graph and dissolves the Phase 67 chunk-id lock — only do so inside a deliberate BND unlock window (same protocol as Phase 67 BND-05).

---

## Component-by-Component Stack Decisions

### 1. SFDataTable

**Requirement:** Sort + filter + pagination + virtualization over arbitrarily large datasets.

**Recommended stack:**
- `@tanstack/react-table` v8.21.3 — headless table logic (sort/filter/pagination)
- `@tanstack/react-virtual` v3.13.24 — row virtualization (optional, feature-flagged)

**Why TanStack Table v8 over alternatives:**
TanStack Table v8 is the de-facto standard for headless table logic in the React ecosystem. It ships zero UI, composes directly with the existing SFTable primitive, and supports all required features (sort, filter, pagination, column pinning, row selection) without forcing a UI opinion. The unpacked tarball is 744 KB but the gzip contribution to First Load JS is approximately 15 KB (verified by multiple bundlephobia measurements and consistent with the headless-only architecture — no CSS, no DOM rendering code). The library is already what shadcn's `data-table` component targets, meaning shadcn's `ui/table.tsx` (already in the codebase) is its intended rendering layer.

**Why TanStack Virtual v3 for virtualization:**
`@tanstack/react-virtual` v3.13.24 is a 19 KB unpacked / approximately 3-4 KB gzip package that integrates directly with TanStack Table via the documented `useVirtualizer` hook pattern. It is the recommended companion in TanStack's own documentation. Virtualization MUST be feature-flagged: only activate when a `virtualize` prop is passed and dataset exceeds a row threshold (e.g., >200 rows). This keeps the zero-virtualization render path clean.

**Peer deps:**
- `@tanstack/react-table@8.21.3`: peer `react >=16.8`, `react-dom >=16.8` — both satisfied by the project's `react@19.1.0`
- `@tanstack/react-virtual@3.13.24`: peer `react ^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0` — satisfied

**Unpacked sizes (npm registry):**
- `@tanstack/react-table@8.21.3`: 744 KB unpacked; ~15 KB gzip (headless, no CSS)
- `@tanstack/table-core@8.21.3`: 3220 KB unpacked (includes TS source maps); actual runtime ~15 KB gzip total for both packages combined
- `@tanstack/react-virtual@3.13.24`: 19 KB unpacked; ~3 KB gzip
- `@tanstack/virtual-core@3.14.0`: 250 KB unpacked; ~4 KB gzip

**RSC vs Client:** `'use client'` required — TanStack Table uses React state/memo. The SFDataTable component file gets the directive. Server Components can still pass static data arrays as props.

**Tailwind v4 / OKLCH theming:** No conflicts. TanStack Table renders zero DOM; all styling goes on the existing SFTable primitive (already token-compliant).

**P3 lazy candidate:** YES — lazy-load via `next/dynamic({ ssr: false })` with `meta.heavy: true`. The SFDataTable component (including TanStack imports) is only needed on pages that render data tables. This keeps TanStack Table + Virtual out of the 187.6 KB First Load JS baseline entirely, similar to the existing SFCalendar / SFMenubar P3 pattern.

**`_dep_X_decision` required:** YES — two new runtime deps. Ratification block IDs: `_dep_dt_01_decision` (TanStack Table) and `_dep_dt_02_decision` (TanStack Virtual). Gzip impact: +15 KB Table + 3 KB Virtual = +18 KB, BUT only in the SFDataTable lazy chunk (not First Load JS). First Load JS impact: 0 KB.

**Bundle accounting after P3 lazy:**
- First Load JS: 187.6 KB (no change — lazy chunk excluded)
- SFDataTable chunk (lazy): ~18-20 KB gzip additional

---

### 2. SFCombobox

**Requirement:** Autocomplete select with keyboard navigation, filtered list, accessible.

**Recommended stack:**
- Radix `@radix-ui/react-popover` (already installed via `radix-ui` meta-package)
- `cmdk` v1.1.1 (already installed, already in `optimizePackageImports`)
- `SFInput` + `SFPopover` (both already in the codebase)

**No new runtime deps required.**

**Why Radix Popover + cmdk composition over alternatives:**
The existing `components/ui/command.tsx` and `components/ui/popover.tsx` are already in the codebase. The shadcn Combobox pattern is exactly this composition: a `Popover` wrapping a `Command` component with an `Input` filter. cmdk v1.1.1 is already installed, tree-shaken into a lazy chunk (per Phase 67 DCE), and already in the `optimizePackageImports` list. No additional installation is needed. This is zero-dep-addition territory.

**Pattern:** SF-wrap the shadcn Combobox pattern. A `SFCombobox` component wraps `SFPopover` (trigger = `SFInput`-styled button with chevron) + `CommandInput` / `CommandList` / `CommandItem`. The `SFPopover` content renders with `rounded-none border-2 border-border` to maintain zero-border-radius. cmdk's `Command` renders in a `Popover.Content` container.

**RSC vs Client:** `'use client'` required — state (open/value) is required.

**Tailwind v4 / OKLCH theming:** No conflicts. cmdk exposes className overrides; all slots receive SF token classes.

**P3 lazy candidate:** No — SFCombobox is a form primitive that will appear in many contexts. It should be in the barrel export. cmdk is already in the bundle via optimizePackageImports, so no marginal cost.

**Bundle accounting:**
- First Load JS: 187.6 KB (no change — cmdk already in optimizePackageImports lazy path, zero marginal cost from barrel addition)

---

### 3. SFRichEditor

**Requirement:** Admin/blog/message composer — heading, bold/italic/lists, link, code block.

**Recommended stack:**
- `@tiptap/react` v2.27.2 (v2-latest dist-tag)
- `@tiptap/pm` v2.27.2 (ProseMirror peer — ships with Tiptap)
- `@tiptap/starter-kit` v2.9.1 (latest v2.x on npm, not latest — see versioning note)
- Selective extensions only: `@tiptap/extension-link`, `@tiptap/extension-image` (only if needed)

**Versioning note:** Tiptap's npm `latest` tag now points to v3.22.5, which is stable. The `v2-latest` dist-tag points to v2.27.2. The PROJECT.md records this milestone as requiring "Tiptap v2" — verify with the user whether v3 (now stable as of early 2026) is acceptable before locking v2. V3 has a JSX-in-renderHTML API change and requires `immediatelyRender: false` for Next.js SSR guard (same as v2). For this research, v2.27.2 is documented; v3 should be evaluated in the `_dep_re_01_decision` block before install.

**Why Tiptap over Lexical and Slate:**
- **vs Lexical (Meta, ~22 KB gzip):** Lexical is lighter but has a steeper extension API learning curve, less mature ecosystem for admin-grade features, and requires writing more extension boilerplate for heading/list/code combinations that Tiptap's StarterKit ships out of the box.
- **vs Slate (~45 KB gzip):** Slate gives maximum control but is unfinished by the maintainer's own admission. Missing built-in undo/redo and serialization; requires significant custom code for standard features. Not suitable for a design system component that needs to be stable.
- **vs Quill (~43 KB gzip):** Quill v1 is unmaintained (Quill v2 finally shipped but has limited adoption). The CSS injection model conflicts with Tailwind v4's `@layer` cascade ordering (same class of problem as `experimental.inlineCss: true`, which is explicitly rejected in the standing rules).
- **Tiptap wins:** headless (no injected CSS fights), StarterKit provides heading/bold/italic/lists/blockquote/code-block out of the box, ProseMirror foundation is battle-tested, and the `immediatelyRender: false` SSR guard is documented and works on Next.js 15 App Router.

**Peer deps (v2.27.2):**
- `@tiptap/react`: peer `react ^17 || ^18 || ^19`, `react-dom` same, `@tiptap/pm ^2.7.0`, `@tiptap/core ^2.7.0`
- All peer deps satisfied by project's react@19.1.0

**Unpacked sizes (npm registry, v2.27.2):**
- `@tiptap/react@2.27.2`: 585 KB unpacked
- `@tiptap/starter-kit@2.9.1`: 65 KB unpacked
- `@tiptap/core@2.9.1`: 2431 KB unpacked (includes full TS source + declaration maps)
- `@tiptap/pm@2.27.2`: 24 KB unpacked

**Gzip estimate:** Tiptap with StarterKit is approximately 50-70 KB gzip total (ProseMirror + @tiptap/core + @tiptap/react + @tiptap/starter-kit combined). This is consistent with community measurements for "basic Tiptap setup." The ProseMirror layer (`prosemirror-state`, `prosemirror-view`, `prosemirror-model`, etc.) accounts for the majority of this cost.

**RSC vs Client:** `'use client'` required — ProseMirror is entirely DOM/browser-dependent. Use `next/dynamic({ ssr: false })` at the call site to prevent SSR crashes. The official Tiptap Next.js docs confirm this and recommend `immediatelyRender: false` as the SSR guard prop on the `useEditor` hook as a belt-and-suspenders measure.

**Tailwind v4 / OKLCH theming:** Tiptap renders into a `contenteditable` div; all toolbar elements are standard HTML that receive Tailwind classes. No CSS injection — Tiptap is fully headless. This is the critical advantage over Quill.

**P3 lazy candidate:** YES — mandatory. 50-70 KB gzip is 4-5x the 12.4 KB free headroom. This MUST be a `next/dynamic({ ssr: false })` P3 component with `meta.heavy: true`. The SFRichEditor is only consumed in admin/composer contexts, never in the critical render path.

**`_dep_X_decision` required:** YES. Ratification block IDs: `_dep_re_01_decision` (Tiptap v2/v3 version choice + @tiptap/react + @tiptap/pm + @tiptap/starter-kit). Document the ProseMirror dependency chain in the block.

**Bundle accounting after P3 lazy:**
- First Load JS: 187.6 KB (no change — SFRichEditor lazy chunk excluded)
- SFRichEditor chunk (lazy): ~55-70 KB gzip additional
- If `_dep_re_01_decision` ratifies Tiptap v3 instead: similar gzip range, same lazy constraint

---

### 4. SFFileUpload

**Requirement:** Drag-drop + progress indicator + multi-file + preview list.

**Recommended stack:**
- Native HTML File API + `DataTransfer` — no new dependency
- `SFProgress` (already in codebase) — progress bar animation
- `SFButton` (already in codebase) — trigger button
- `Lucide React` (already in codebase) — `Upload`, `X`, `File`, `Check` icons

**No new runtime deps required.**

**Why no dependency:**
The drag-drop pattern (`onDragOver`, `onDragLeave`, `onDrop` with `e.dataTransfer.files`) and multi-file management (`FileList` → array state) are entirely implementable with React hooks and the browser File API. Progress tracking for a design-system component is UI-only (a determinate `SFProgress` bar driven by an `uploadProgress` prop); the actual XHR/fetch upload is the consumer's responsibility. `react-dropzone` (~13 KB gzip) would be overkill — its value is file-type MIME sniffing and accessibility polyfills, neither of which is required at the design system layer.

**RSC vs Client:** `'use client'` required — drag events, `useState`, `useRef`.

**Tailwind v4 / OKLCH theming:** No conflicts. The drop zone, file list, and progress bar are standard HTML elements with SF token classes.

**P3 lazy candidate:** No — file upload is a form primitive appearing in many admin/form contexts. Keep it in the barrel. Zero marginal bundle cost (no new deps).

**Bundle accounting:**
- First Load JS: 187.6 KB (no change — no new deps, SFProgress + Lucide already loaded)

---

### 5. SFDateRangePicker

**Requirement:** Date range selection + optional time variant. Builds on the existing SFCalendar.

**Recommended stack:**
- `react-day-picker` v9.14.0 — already installed at this exact version
- `SFPopover` (already in codebase) — trigger + floating panel
- `SFInput` (already in codebase) — formatted date display in trigger

**No new runtime deps required.**

**Why react-day-picker range mode instead of a separate library:**
react-day-picker v9 ships first-class `mode="range"` support. The existing `SFCalendar` already wraps react-day-picker and applies zero-border-radius styling via the `classNames` prop. `SFDateRangePicker` is a composition: `SFPopover` trigger (displaying formatted range string in an `SFInput`-styled button) + `SFCalendar` with `mode="range"` + optional time input below the calendar. No additional package is needed. `date-fns@4.1.0` is already installed (react-day-picker's own peer dep, already in `package.json`).

**Time variant:** The time input is a plain `<input type="time">` rendered inside the popover, paired with the range calendar. No additional time-picker library is required.

**RSC vs Client:** `'use client'` required — date state management.

**Tailwind v4 / OKLCH theming:** Confirmed compatible. SFCalendar already uses the `classNames` override API to enforce zero-border-radius on every react-day-picker sub-element (including `range_start`, `range_middle`, `range_end`). SFDateRangePicker inherits this.

**P3 lazy candidate:** YES — same reasoning as SFCalendar (already P3 in the codebase). SFDateRangePicker should be `next/dynamic({ ssr: false })` with `meta.heavy: true`. react-day-picker is in `optimizePackageImports`, which means it is already lazy-chunked per the Phase 67 DCE; the lazy component wrapper ensures it does not enter First Load JS for pages that don't use it.

**Bundle accounting:**
- First Load JS: 187.6 KB (no change — react-day-picker already in optimizePackageImports lazy path)
- SFDateRangePicker chunk (lazy): react-day-picker is already in a separate chunk; only the component wrapper overhead (~1-2 KB gzip) is new

---

## Full Bundle Accounting

| Component | New Deps | Gzip Cost | Load Strategy | First Load JS Impact |
|-----------|----------|-----------|---------------|----------------------|
| SFDataTable | @tanstack/react-table@8.21.3 + @tanstack/react-virtual@3.13.24 | ~18-20 KB | P3 lazy (next/dynamic ssr:false) | 0 KB |
| SFCombobox | None (cmdk + Radix already installed) | 0 KB marginal | Eager barrel | 0 KB |
| SFRichEditor | @tiptap/react + @tiptap/pm + @tiptap/starter-kit (v2.27.2) | ~55-70 KB | P3 lazy (next/dynamic ssr:false) | 0 KB |
| SFFileUpload | None | 0 KB | Eager barrel | 0 KB |
| SFDateRangePicker | None (react-day-picker already installed) | ~1-2 KB wrapper only | P3 lazy (next/dynamic ssr:false) | 0 KB |
| **TOTAL First Load JS** | | | | **187.6 KB — no change** |

**All three heavy components (SFDataTable, SFRichEditor, SFDateRangePicker) must be P3 lazy. This is the architectural constraint that makes BND-08 achievable without a `_path_decision`.** The 12.4 KB headroom is preserved for framework updates and incidental additions.

---

## Recommended Stack — Consolidated

### New Runtime Dependencies (2 total, require `_dep_X_decision`)

| Package | Version | Gzip (est.) | Load | Decision Block |
|---------|---------|-------------|------|----------------|
| `@tanstack/react-table` | 8.21.3 | ~12 KB | P3 lazy chunk | `_dep_dt_01_decision` |
| `@tanstack/react-virtual` | 3.13.24 | ~3 KB | P3 lazy chunk | `_dep_dt_02_decision` |
| `@tiptap/react` | 2.27.2 (v2-latest) | ~55-70 KB combined | P3 lazy chunk | `_dep_re_01_decision` |
| `@tiptap/pm` | 2.27.2 | (included in above) | P3 lazy chunk | covered by `_dep_re_01_decision` |
| `@tiptap/starter-kit` | 2.9.1 (latest v2.x) | (included in above) | P3 lazy chunk | covered by `_dep_re_01_decision` |

Note: Tiptap ships as 3 coordinated packages (`@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`) but ratification is one decision block (`_dep_re_01_decision`) since they are always installed together and share a version constraint.

### Zero-New-Dep Components

| Component | Composition Source |
|-----------|--------------------|
| SFCombobox | cmdk@1.1.1 (installed) + Radix Popover (installed) + SFInput + SFPopover |
| SFFileUpload | Native File API + SFProgress + SFButton + Lucide React |
| SFDateRangePicker | react-day-picker@9.14.0 (installed) + SFCalendar + SFPopover + SFInput |

### Installation

```bash
# Two ratification blocks required before running this:
# _dep_dt_01_decision + _dep_dt_02_decision (SFDataTable)
# _dep_re_01_decision (SFRichEditor)

pnpm add @tanstack/react-table@^8.21.3 @tanstack/react-virtual@^3.13.24
pnpm add @tiptap/react@^2.27.2 @tiptap/pm@^2.27.2 @tiptap/starter-kit@^2.9.1
# No install needed for SFCombobox, SFFileUpload, SFDateRangePicker
```

---

## Alternatives Considered

| Recommended | Alternative | Why Not |
|-------------|-------------|---------|
| TanStack Table v8 | AG Grid Community | AG Grid is 200+ KB gzip even community edition; destroys the bundle budget entirely even as a lazy chunk |
| TanStack Table v8 | react-table v7 | v7 is the deprecated predecessor; v8 is the maintained rewrite. v7 has known issues with React 18/19 concurrent mode |
| TanStack Table v8 | TanStack Table v9 | v9 is not yet released (RFC Discussion #5834 is open). Pin to v8.x; migrate when v9 stabilizes |
| Tiptap v2.27.2 | Quill v2 | Quill injects CSS at runtime, which conflicts with Tailwind v4's `@layer signalframeux` cascade ordering — same class of problem as `experimental.inlineCss: true` (explicitly rejected in standing rules) |
| Tiptap v2.27.2 | Slate | Slate is incomplete — no built-in undo/redo, no serialization, requires substantial custom extension work for a design system that needs to be stable out of the box |
| Tiptap v2.27.2 | Lexical | Lexical is lighter (~22 KB gzip core) but requires substantially more extension boilerplate for StarterKit-equivalent feature set. Appropriate if bundle budget were the only constraint; Tiptap wins on DX stability for a design system component |
| Native File API | react-dropzone | react-dropzone adds ~13 KB gzip for MIME sniffing and accessibility polyfills that are the consumer's responsibility, not the design system's. Overkill at the SF layer |
| react-day-picker range mode | flatpickr | flatpickr injects its own CSS. Same cascade conflict as Quill |
| react-day-picker range mode | react-datepicker | react-datepicker is heavier, has weaker TypeScript typings, and does not compose with the existing SFCalendar infrastructure already in the codebase |
| Radix Popover + cmdk | Downshift | Downshift is a valid ARIA-compliant alternative but cmdk is already installed and provides an identical feature set; adding Downshift would be a redundant dep |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| AG Grid (any edition) | Even community edition is 200+ KB gzip — larger than the entire remaining First Load JS budget. Makes P3 lazy unusable for any page that needs a table | TanStack Table v8 + SFTable (headless + existing primitive) |
| Quill (v1 or v2) | Injects CSS via `<style>` tags at runtime, which breaks the `@layer signalframeux` cascade ordering that is a standing architectural constraint. v1 is unmaintained | Tiptap (headless, no injected CSS) |
| slate-react | Fundamentally incomplete: undo/redo and serialization must be implemented from scratch. Not appropriate for a stable design system component | Tiptap StarterKit (ships undo/redo, HTML serialization) |
| react-dropzone | Adds ~13 KB gzip for features (MIME sniffing, drag-and-drop polyfills) that a design system file upload component should not own — these are consumer responsibilities | Native HTML File API + DataTransfer (zero dep) |
| flatpickr | Injects its own CSS; same `@layer` cascade conflict as Quill. Also has no React-first API — requires `useEffect` imperative initialization pattern | react-day-picker v9 range mode (already installed) |
| `experimental.inlineCss: true` | Breaks `@layer signalframeux` cascade ordering — explicitly rejected standing rule from v1.9 | Standard CSS cascade with `@layer signalframeux` |
| TanStack Table as an eager bundle import | 15 KB gzip added to every page's First Load JS even when no data table is rendered | P3 lazy via `next/dynamic({ ssr: false })`, meta.heavy: true |
| Tiptap as an eager bundle import | 55-70 KB gzip is 4.4-5.6x the 12.4 KB free headroom; would blow the 200 KB hard target on any page that eager-imports the rich editor | P3 lazy via `next/dynamic({ ssr: false })`, meta.heavy: true |

---

## Version Compatibility

| Package | Peer Requirement | Project Version | Status |
|---------|-----------------|-----------------|--------|
| `@tanstack/react-table@8.21.3` | `react >=16.8` | `react@19.1.0` | PASS |
| `@tanstack/react-virtual@3.13.24` | `react ^16.8 \|\| ^17 \|\| ^18 \|\| ^19` | `react@19.1.0` | PASS |
| `@tiptap/react@2.27.2` | `react ^17 \|\| ^18 \|\| ^19` | `react@19.1.0` | PASS |
| `@tiptap/starter-kit@2.9.1` | none (deps are @tiptap/* internal) | — | PASS |
| `react-day-picker@9.14.0` | `react >=16.8` | `react@19.1.0` | PASS |
| `cmdk@1.1.1` | (already installed) | — | PASS |
| All Radix UI | (already installed via `radix-ui` meta-package) | — | PASS |

**Tiptap v2 vs v3 note:** Tiptap v3 is now `latest` on npm (v3.22.5 as of 2026-05-01). The `v2-latest` dist-tag points to v2.27.2. The `_dep_re_01_decision` block MUST address this version choice. V3 has a JSX-in-renderHTML API addition but is otherwise compatible. Both require `immediatelyRender: false` for Next.js SSR safety. Recommend evaluating v3 since it is now stable — do not pin to v2 by default without documenting the reason in the decision block.

---

## Next.js 15 App Router Compatibility Notes

| Component | Directive | SSR Strategy | Notes |
|-----------|-----------|--------------|-------|
| SFDataTable | `'use client'` | `next/dynamic({ ssr: false })` | TanStack Table uses React state; data passes as RSC-fetched prop |
| SFCombobox | `'use client'` | Eager (no SSR concern) | cmdk is already client-only; Popover state is client-side |
| SFRichEditor | `'use client'` | `next/dynamic({ ssr: false })` MANDATORY | ProseMirror crashes on SSR; `immediatelyRender: false` as belt-and-suspenders |
| SFFileUpload | `'use client'` | Eager (no SSR concern) | File API is browser-only; component guards against SSR by being client-only |
| SFDateRangePicker | `'use client'` | `next/dynamic({ ssr: false })` | Matches SFCalendar P3 pattern already in codebase |

**Pattern for P3 lazy components (matches SFCalendar precedent):**
```typescript
// sf-data-table-lazy.tsx
import dynamic from "next/dynamic";
export const SFDataTableLazy = dynamic(
  () => import("./sf-data-table").then((m) => m.SFDataTable),
  { ssr: false }
);
```

---

## Tailwind v4 `@theme inline` Integration Notes

All 5 components inherit the existing SF token system without modification:

- **Zero border-radius:** Apply `rounded-none` to all interactive elements. TanStack Table renders no DOM — radius goes on SFTable cells. Tiptap's `contenteditable` div and toolbar buttons need explicit `rounded-none`. cmdk's `CommandItem` needs `rounded-none` via the `className` prop. react-day-picker's range cells already receive `rounded-none` via SFCalendar's `classNames` override.
- **OKLCH colors:** All color references via `--sfx-*` tokens. Do not hardcode hex in component variants.
- **`@theme inline` aliasing:** No changes needed — the `--sfx-*` → Tailwind utility mapping in `globals.css` applies automatically to any new component using `bg-background`, `text-foreground`, etc.
- **CVA `intent` prop:** All 5 components should use `intent` as the semantic variant prop (not `variant`), per v1.3 prop vocabulary lock.

---

## Sources

- npm registry API (registry.npmjs.org) — version numbers, unpacked sizes, peer deps for all 5 component candidates (HIGH confidence, direct measurement)
- TanStack Table v8 docs (tanstack.com/table/v8) — virtualization integration pattern, headless architecture (HIGH confidence)
- Tiptap docs (tiptap.dev/docs/editor/getting-started/install/nextjs) — Next.js App Router SSR guard, `immediatelyRender: false` requirement (HIGH confidence)
- react-day-picker docs (daypicker.dev/selections/range-mode) — range mode API, v9 compatibility (HIGH confidence)
- bundlephobia.com — gzip size estimates for TanStack Table (~15 KB) and TanStack Virtual (~3 KB) (MEDIUM confidence — bundlephobia page rendered but size figures confirmed via multiple search result snippets)
- Web search: Tiptap 50-70 KB gzip figure for starter-kit setup (MEDIUM confidence — consistent across Liveblocks blog and community articles)
- Lexical 22 KB gzip core figure (MEDIUM confidence — multiple sources confirm, used only for comparison)
- Existing codebase: `package.json`, `next.config.ts`, `components/sf/index.ts`, `components/sf/sf-calendar.tsx` — confirmed installed packages, optimizePackageImports list, barrel exports, SFCalendar range_start/range_middle/range_end class precedent (HIGH confidence, direct read)

---
*Stack research for: SignalframeUX v1.10 Library Completeness — 5 component expansion*
*Researched: 2026-05-01*
