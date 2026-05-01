# Feature Research — v1.10 Library Completeness

**Domain:** Design system component expansion (5 complex interactive components)
**Researched:** 2026-04-30
**Confidence:** HIGH — these are well-established UI pattern territories with clear industry consensus

---

## SFDataTable

### What It Is

A headless-logic-first data table built on TanStack Table v8 (already ratified via `_dep_X_decision` in v1.10 scope). The existing `SFTable` is a pure layout primitive — rows, cells, headers, semantic markup. `SFDataTable` is the behavioral layer: it plugs TanStack Table's column model into the SFTable markup and adds sorting, filtering, pagination, and selection state management.

### Table Stakes

Features a product engineer will block adoption if missing.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Column sort (single, ascending/descending/none cycle) | Every data table in every app needs sortable columns | LOW | TanStack Table `getSortedRowModel()` + `column.getToggleSortingHandler()`; header click toggles; visual sort indicator (chevron or SF-style directional mark) |
| Column sort indicator visible state | Sort state must be legible without color alone | LOW | Use a 2-char symbol from `CDSymbol`/Lucide or a raw `↑ ↓` glyph; must respect reduced-motion |
| Pagination (page-number style) | Standard for any table with >20 rows | LOW | Compose existing `SFPagination`; TanStack `getPaginationRowModel()` with `pageIndex` / `pageSize` state |
| Column header with filter (text match per-column) | Expected in any admin or data interface | MEDIUM | TanStack `getFilteredRowModel()` + `column.setFilterValue()`; input debounced; composes `SFInput` |
| Row selection (checkbox, single + multi) | Expected for batch actions (delete, export, tag) | MEDIUM | TanStack `useRowSelection`; header checkbox = select-all; indeterminate state on partial selection; composes `SFCheckbox` |
| Empty state | Every table can be empty | LOW | Compose `SFEmptyState`; should accept custom message prop |
| Loading state (skeleton rows) | Async data fetch is universal | LOW | Compose `SFSkeleton` for N rows × M columns; controlled by `isLoading` prop |
| Keyboard navigation within table | WCAG AA, grid role | MEDIUM | `role="grid"`, `aria-rowcount`, `aria-colcount`, roving tabindex on cells; arrow keys move focus; Enter/Space activate row or cell action |
| Density modes (compact / default / relaxed) | Needed for admin vs display contexts | LOW | CVA `density` variant on row/cell; maps to blessed spacing stops (py-4 / py-8 / py-12) |
| Column width (fixed or stretch) | Column layout control is expected | LOW | CSS `table-layout: fixed` with explicit `width` on col defs; no resize drag handle in table stakes |

### Differentiators

Features worth shipping if time allows; competitive advantage for SF adoption.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Multi-column sort | Advanced filtering workflows (sort by status, then date) | MEDIUM | TanStack Table supports it natively via `sortingState` array; UI needs compound sort indicator; LOW risk since TanStack does the work |
| Global filter (search across all columns) | Single search input that filters all column text | LOW | TanStack `setGlobalFilter()`; requires a separate `SFInput` outside the table; DU aesthetic: a raw input above the table with UPPERCASE label |
| Server-side data mode | Enables real pagination on large datasets | MEDIUM | Disable client-side models (`manualPagination: true`, `manualSorting: true`, `manualFiltering: true`); expose `onPaginationChange`, `onSortingChange`, `onFilteringChange` callbacks; consumer owns the fetch |
| Expandable rows | Show detail pane inline under a row | MEDIUM | TanStack `getExpandedRowModel()` + `row.getCanExpand()`; toggle renders a full-width sub-row; works within DU aesthetic as a hard-edge panel reveal |
| Sticky first column | Lock an ID or name column during horizontal scroll | MEDIUM | CSS `position: sticky; left: 0` on first `td`/`th`; requires `overflow-x: scroll` on table wrapper; z-index management within the frame |

### Anti-Features

Things that seem logical for a data table but violate SF constraints.

| Feature | Why Requested | Why SF Must Reject | Alternative |
|---------|---------------|-------------------|-------------|
| Column drag-to-reorder | "Power user" feature, common in spreadsheet UIs | Requires drag-and-drop event handling, visual column ghost — breaks the static, controlled DU grid feel; also high complexity for marginal adoption gain | Expose `columnOrder` as a controlled prop; let consumers reorder programmatically |
| Column resize handles (drag) | Users want to widen columns | Drag resize is skeuomorphic (fake material handles); adds pointer cursor overrides; creates rogue arbitrary width values that violate the token system | Ship fixed-width columns via `size` on col defs; consumers set them explicitly |
| Virtualization (windowed rows) | Required claim for "big data" | TanStack Virtual adds significant complexity; row heights must be known or estimated; keyboard nav interacts badly with virtual DOM; 99% of SF use cases have <500 rows | P3 lazy defer: if virtualization is required in a future phase, it ships as a separate `SFDataTableVirtual` wrapper, not baked in |
| Inline cell editing | "Spreadsheet feel" for admin UIs | Converts a display primitive into a form engine; state management complexity doubles; violates FRAME/SIGNAL discipline (display layer doing form layer work) | Expandable row with an edit form in the sub-row is the correct SF pattern |
| Sticky header row | "Always know what column I'm in" | Scrolling tables in SF contexts almost always have bounded height; sticky header adds `position: sticky; top: 0` + z-index fights with popover layers | Set a max-height on the table wrapper and let the scroll handle itself; document the pattern |
| Column filter with dropdown/facets | Faceted search filters per column | Compound UI in a table header is hard to read at small text sizes; collides with the DU "spare, structured" register | Ship global filter (a single search input) as the differentiator; column filters stay as simple text match inputs |

### Dependency Map

```
SFDataTable
    ├──composes──> SFTable (existing layout primitive)
    ├──composes──> SFPagination (existing navigation primitive)
    ├──composes──> SFCheckbox (existing form primitive)
    ├──composes──> SFInput (existing form primitive, for column filter)
    ├──composes──> SFSkeleton (existing feedback primitive, for loading state)
    ├──composes──> SFEmptyState (existing feedback primitive)
    └──requires──> TanStack Table v8 (ratified _dep_X_decision)

Server-side mode ──requires──> consumer-owned fetch + pagination state (no new dep)
Expandable rows ──requires──> row height stability (CLS concern if content loads async)
Multi-column sort ──enhances──> single-column sort (additive, same state model)
```

### Phase 71 Ship List

**Must ship (v1.10):** Single-column sort + sort indicator, text filter per column, page-number pagination composing SFPagination, checkbox row selection (single + multi + indeterminate), loading skeleton, empty state, density CVA variant, keyboard nav grid role.

**Defer:** Multi-column sort (MEDIUM complexity, can ship within Phase 71 if easy), server-side mode (MEDIUM, may ship as extended API if time allows), expandable rows (MEDIUM, likely Phase 71 stretch), virtualization (P3 lazy, separate component, v1.11+).

---

## SFCombobox

### What It Is

An autocomplete/searchable select. It composes `SFPopover` (already in the barrel) and `SFCommand` (already implemented, excluded from barrel by tree-shaking discipline). The shadcn combobox pattern is `SFCommand` inside a `SFPopover` — this is the right architecture for SF. No new dependency.

### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Single-select with search | The core use case; replaces SFSelect when options are many (>10) | LOW | SFCommand `CommandInput` for search; `CommandItem` on select closes popover and sets value |
| Keyboard navigation (arrow up/down, Enter to select, Escape to close) | Combobox ARIA pattern requires it | LOW | Inherited from cmdk's keyboard model; needs verification that Radix Popover + cmdk key handlers don't conflict |
| Type-ahead filtering (filters items as user types) | Users expect to narrow by typing | LOW | cmdk's default `CommandInput` filtering; case-insensitive substring match |
| Display selected value in trigger | Trigger shows current value or placeholder | LOW | Controlled `value` prop → find matching label in items array |
| Empty state (no matches found) | Required when search yields nothing | LOW | cmdk `CommandEmpty` component, compose `SFEmptyState` text style |
| Loading state (async options) | Needed when options come from API | LOW | A `isLoading` prop renders a skeleton or spinner inside the popover; cmdk `CommandLoading` component |
| Clear/reset selection | Users need to deselect | LOW | An `×` button inside the trigger when value is set; `onValueChange(undefined)` |
| Grouping (labeled sections) | Options from multiple categories | LOW | cmdk `CommandGroup` with label; standard pattern |
| Controlled + uncontrolled modes | Design system must support both | LOW | `value`/`onValueChange` for controlled; internal state for uncontrolled |

### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Multi-select mode | Tag/chip selection in a single combobox | MEDIUM | Internal `value` becomes `string[]`; selected items render as badge-style tokens inside the trigger; Escape removes last token; requires SFBadge composition |
| Creatable items ("Add X") | Let users add a new option mid-flow | MEDIUM | When no match: show `CommandItem` "Add '[query]'"  at list bottom; calls `onCreateItem(query)` callback; consumer owns persistence |
| Async search with debounce | Search triggers API fetch on keystroke | MEDIUM | `onSearch` callback prop + debounce in hook; component shows `CommandLoading` while waiting; consumer-owned fetch |

### Anti-Features

| Feature | Why Requested | Why SF Must Reject | Alternative |
|---------|---------------|-------------------|-------------|
| Virtualized option list | "What if there are 10,000 items?" | SFCombobox is a UI primitive, not a data-fetch orchestrator; 10k items means the API should filter server-side, not the browser | Async search mode (differentiator) handles this correctly: server filters, browser renders only matching results |
| Custom option renderer (arbitrary JSX per item) | Power users want icons/avatars in options | Allows arbitrary decoration that breaks DU typographic discipline in the list | Expose a `renderItem` prop scoped to `{ value, label, icon?: LucideIcon }` shape — controlled surface, not arbitrary JSX slot |
| Inline tag-pill color coding | Color-code each selected tag | Palette expansion risk; arbitrary colors violate OKLCH-only, core-5 rule | Multi-select badges use `intent` CVA variant on SFBadge; hue is system-controlled |

### Dependency Map

```
SFCombobox
    ├──composes──> SFPopover (existing, in barrel)
    ├──composes──> SFCommand / CommandInput / CommandList / CommandItem / CommandEmpty
    │              (existing implementation; NOT in barrel — import directly)
    ├──composes──> SFInput (trigger input appearance)
    ├──composes (optional)──> SFBadge (multi-select token chips)
    └──no new runtime deps

Multi-select ──requires──> SFBadge (existing)
Async search ──requires──> consumer-provided debounce or internal useDebounce hook (no new dep; tiny inline impl)
Creatable ──requires──> async search OR type-ahead to detect "no match" state
```

### Phase 72 Ship List

**Must ship:** Single-select, type-ahead filter, keyboard nav, empty state, loading state, clear/reset, grouping, controlled + uncontrolled API.

**Defer:** Multi-select (MEDIUM — ship if Phase 72 has room), creatable items (MEDIUM), async search (MEDIUM — expose `onSearch` callback at minimum even if no debounce hook is included).

---

## SFRichEditor

### What It Is

A WYSIWYG prose editor built on Tiptap v2 (ratified via `_dep_X_decision`). Tiptap wraps ProseMirror. It is P3 lazy (`next/dynamic + ssr:false`) because ProseMirror + Tiptap extensions are ~40–70KB gzip depending on extension set. The SF wrapper provides a controlled toolbar with only the extensions that match the DU/TDR aesthetic — no kitchen-sink, no formatting excess.

### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Bold / Italic / Underline | Core text formatting; WCAG requires semantic markup | LOW | Tiptap `Bold`, `Italic`, `Underline` extensions; keyboard shortcuts `Mod+B`, `Mod+I`, `Mod+U` built-in |
| Strikethrough | Expected in task/review contexts | LOW | Tiptap `Strike` extension |
| Headings (H1, H2, H3) | Structural document formatting | LOW | Tiptap `Heading` extension with levels `[1, 2, 3]` only; H4–H6 are anti-features |
| Unordered and ordered lists | Universal formatting expectation | LOW | Tiptap `BulletList` + `OrderedList` + `ListItem` extensions |
| Blockquote | Block-level structural element; DU aesthetic suits it well | LOW | Tiptap `Blockquote` extension; left-border treatment in SF style |
| Code block (fenced) | Technical writing and documentation use cases | LOW | Tiptap `CodeBlock` extension; monospace, JetBrains Mono; zero border-radius |
| Inline code | Expected alongside code block | LOW | Tiptap `Code` extension; monospace treatment |
| Link (add/edit/remove) | Expected in any document editor | MEDIUM | Tiptap `Link` extension; click or `Mod+K` shortcut; a small popover to input URL; SF-styled using SFPopover |
| Toolbar with active-state indicators | User must know what formatting is active at cursor | LOW | CVA-styled toolbar buttons; `isActive()` drives active state; NOT toggles — just SFButton `intent="secondary"` active state |
| Character count display | Common UX affordance for message composers | LOW | Tiptap `CharacterCount` extension; render count in a status bar below the editor; optional prop |
| Markdown shortcuts (typing `**` → bold, `#` → heading) | Power user expectation; DX quality signal | LOW | Tiptap `Typography` extension handles most; `InputRules` for heading shortcuts built in |
| Placeholder text | Empty editor state | LOW | Tiptap `Placeholder` extension; styled via CSS `.is-empty::before` |
| Controlled content via `content` + `onUpdate` props | Design system requires controlled API | LOW | Tiptap `useEditor` with `content` initial + `onUpdate({ editor }) => onUpdate(editor.getHTML())` pattern |
| Read-only mode (`editable: false`) | Display contexts need it | LOW | Tiptap `editor.setEditable(false)` |

### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Paste-from-Word / HTML cleanup | Removes inline styles, foreign fonts, garbage spans on paste | MEDIUM | Tiptap `PasteRules` + `transformPastedHTML` hook; strip all inline `style` attributes + non-semantic tags; keeps structure only |
| Image (paste from clipboard) | Paste a copied image directly into the editor | MEDIUM | Tiptap custom extension or community `@tiptap/extension-image`; reads `DataTransfer.files` on paste; triggers `onImageUpload(file): Promise<string>` callback on consumer — consumer owns the upload; component just renders the resulting URL |
| Slash commands | Type `/` → command palette for formatting | HIGH | Requires a custom Tiptap extension using Suggestion API; renders a dropdown of available commands; this is the TDR "coded nomenclature" aesthetic moment — slash command list uses monospace labels |
| Mentions (@-mentions) | Tag people in message composers | HIGH | Tiptap Suggestion API; similar architecture to slash commands; requires async lookup |
| Word count | Complements character count | LOW | Same `CharacterCount` extension; `extension.storage.words()` |

### Anti-Features

| Feature | Why Requested | Why SF Must Reject | Alternative |
|---------|---------------|-------------------|-------------|
| H4/H5/H6 headings in toolbar | "Complete heading support" | SF typography scale has 3 semantic heading levels by design; H4+ produces ambiguous hierarchy; the FRAME layer must enforce hierarchy discipline, not offer infinite levels | Use H1/H2/H3 only; document the constraint in SCAFFOLDING.md |
| Font family picker | "Match any brand font" | SF has 4 locked typefaces (Inter, JetBrains Mono, Electrolize, Anton); allowing arbitrary font selection inside an editor creates context-collapse between document content and the system's typographic identity | Monospace for code, Inter for body — period |
| Font size picker (arbitrary) | "Make this bigger" | Arbitrary pixel sizes violate the minor-third type scale; inline `font-size` styles break token-based typography | Map to semantic heading levels which already carry size; expose no size picker |
| Color picker for text | Highlight or color-code text | Arbitrary color values violate the OKLCH core-5 palette; highlighted text in DU/TDR register is achieved through contrast + spacing, not color coding | No color picker; consumers who need semantic callouts use blockquote or inline code styling |
| Text alignment (left/center/right/justify) | "Full word processor features" | Justified text creates inconsistent glyph spacing in variable-width containers; center/right alignment within prose is decorative drift away from the structured grid register | SF prose is always left-aligned; structural alignment via heading hierarchy |
| Table insertion within rich editor | Nested data in prose | A table inside a prose editor is a ProseMirror node with complex keyboard interaction; this nests a data primitive inside a text primitive — the wrong layer boundary | If tabular data is needed in content, the author should use a separate SFDataTable below the prose block |
| Image caption / gallery | "Rich media support" | Each additional media type is a new extension, new upload flow, new rendering concern; scope explosion | Ship image paste (differentiator) with no caption; caption is just a paragraph below |
| Floating toolbar (shows on text selection) | "Modern editor UX like Notion" | Floating UI requires position calculation relative to selection, z-index management, and animation that conflicts with GSAP ticker's single-loop rule | Static toolbar above the editor; no floating anything |
| Collaborative/multiplayer editing | "Real-time doc co-editing" | Y.js + Tiptap Collab add significant bundle weight and WebSocket infrastructure dependency | Out of scope for SF v1.10; document as a future `SFRichEditorCollab` extension point |

### Dependency Map

```
SFRichEditor
    ├──requires──> Tiptap v2 (@tiptap/react, @tiptap/starter-kit) — ratified dep
    ├──composes──> SFPopover (for link input popover)
    ├──composes──> SFButton (toolbar buttons)
    ├──composes──> SFSeparator (toolbar section separators)
    └──P3 lazy (next/dynamic + ssr:false — same pattern as SFCalendar)

Image upload ──requires──> consumer-provided onImageUpload callback (no dep)
Slash commands ──requires──> Tiptap Suggestion API (bundled in @tiptap/core, no extra dep)
Mentions ──requires──> Tiptap Suggestion API + consumer-provided lookup function
Paste cleanup ──requires──> Tiptap transformPastedHTML (built-in, no extra dep)
```

### Phase 73 Ship List

**Must ship:** Bold/italic/underline/strike, H1/H2/H3, bullet + ordered lists, blockquote, code block + inline code, link, toolbar with active state, placeholder, character count, markdown shortcuts, controlled API, read-only mode.

**Defer:** Image paste (MEDIUM, ship if time allows), paste-from-Word cleanup (MEDIUM, ship if time allows), slash commands (HIGH, defer to v1.11), mentions (HIGH, defer to v1.11), word count (LOW, easy add if time allows).

---

## SFFileUpload

### What It Is

A drag-and-drop file input with visual feedback, file list management, and progress reporting. No new runtime dependency — built on native HTML5 File API, `DataTransfer`, and `<input type="file">`. SFProgress is available for upload progress. The component manages its own file list state.

### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Drag-and-drop zone | Primary expected interaction for file upload | LOW | `onDragOver`, `onDrop` events on the zone element; `DataTransfer.items` / `.files` extraction |
| Click-to-browse (hidden `<input type="file">`) | Keyboard and pointer fallback | LOW | Programmatically click a visually hidden `<input>` via `ref.current.click()` |
| File list with file name, size, and type icon | User must see what they've added | LOW | Render each `File` object's `name` + `size`; use a Lucide icon per file type category |
| Remove file from list | User must be able to un-add a file | LOW | Per-file remove button (`×`) in the file list row; controlled via internal state |
| File type validation (accept prop) | Prevent wrong file types | LOW | Pass `accept` string to `<input type="file">`; also validate in `onDrop` against `File.type`; surface error per-file |
| File size validation (maxSize prop) | Prevent oversized files | LOW | Compare `File.size` against `maxSize` bytes; per-file error state |
| Multi-file mode (`multiple` prop) | Many UIs need batch upload | LOW | `<input type="file" multiple>`; accumulate into file list; single-file mode rejects additional drops |
| Upload progress per file | Users must see progress | MEDIUM | Consumer controls progress via `files` prop array with `progress: number` (0–100); component renders SFProgress per file |
| Error state per file | Individual file errors must surface | LOW | `error: string` field in file item; rendered below the file row |
| Disabled state | Form-level disable | LOW | Zone and input non-interactive; visual muted treatment |
| Controlled API (files prop + onFilesChange) | Design system requires controlled components | LOW | Consumer manages the file list; component is a controlled display + interaction layer |

### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Image preview (thumbnail) | Reduces cognitive load for image uploads | LOW | `URL.createObjectURL(file)` for `image/*` MIME types; render a small thumbnail in the file list row; revoke object URL on unmount |
| Paste from clipboard | Power user convenience (paste screenshot) | LOW | `document.addEventListener('paste')` when the zone is focused; read `ClipboardEvent.clipboardData.files` |
| Drop-anywhere mode | Advanced: accept drops on any part of the page | MEDIUM | Hoist drag listeners to `document`; visually highlight the zone on any drag-enter; `data-drop-active` attribute for GSAP or CSS transitions |
| Retry on failure | Re-attempt a failed upload | LOW | `status: 'error' | 'retrying'` in the file item model; a retry button per failed file; triggers `onRetry(file)` callback |

### Anti-Features

| Feature | Why Requested | Why SF Must Reject | Alternative |
|---------|---------------|-------------------|-------------|
| Built-in HTTP upload (fetch/XHR inside the component) | "Just upload it" | Component would own auth tokens, endpoint URLs, error handling logic — a data concern inside a UI primitive; violates separation of concerns | Expose `onFilesChange` + `onUpload(files): void`; consumer owns the fetch; component owns the UI state |
| Progress bar animation (component-driven) | "Nice animated progress" | SFProgress already exists; component should not create a second animation loop; use the GSAP fill tween in SFProgress | Consumer updates `progress` in the file model; SFProgress responds; single animation primitive |
| S3 presigned URL generation | "Auto-upload to S3" | Backend concern entirely | Document the integration pattern: consumer calls their API to get presigned URL, then uploads using that; SFFileUpload stays frontend-only |
| Folder upload | Directory-level upload | `webkitdirectory` attribute is non-standard; produces unpredictable file trees; rarely needed in design system targets | Not supported; users zip folders before upload |
| Cropping / image editing | Inline image manipulation before upload | A separate UI concern (crop tool is a complex sub-component); adds canvas drawing surface | Consumer integrates a separate crop tool (e.g. react-image-crop) before passing to SFFileUpload |

### Dependency Map

```
SFFileUpload
    ├──composes──> SFProgress (existing, for per-file upload progress)
    ├──composes──> SFBadge or SFStatusDot (file status indicators)
    ├──composes──> SFButton (remove button, retry button)
    ├──uses──> Lucide React icons (file type icons — already in stack)
    └──no new runtime deps

Image preview ──requires──> URL.createObjectURL (native browser API)
Paste from clipboard ──requires──> ClipboardEvent API (native, no dep)
Drop-anywhere mode ──requires──> document-level event listeners + GSAP-safe cleanup on unmount
```

### Phase 74 Ship List

**Must ship:** Drag-drop zone, click-to-browse, file list (name/size/type icon), remove file, file type + size validation, multi-file mode, progress per file (via SFProgress), per-file error state, disabled state, controlled API.

**Defer:** Image preview (LOW complexity — ship in Phase 74 if room is available), paste from clipboard (LOW — ship in Phase 74), drop-anywhere mode (MEDIUM), retry button (LOW — ship in Phase 74 if time allows).

---

## SFDateRangePicker

### What It Is

A date range selector built on `react-day-picker` (already in the stack via `SFCalendar`; already in `optimizePackageImports`). `SFCalendar` wraps `DayPicker` for single-date selection. `SFDateRangePicker` extends the pattern to support date ranges, datetime, and time-only, plus a preset system and a parsed keyboard input. Composes `SFPopover` for the calendar flyout and `SFInput` for the text field.

### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Date range (start + end) with dual calendar | Core use case — analytics, booking, scheduling | MEDIUM | `react-day-picker` `mode="range"` with `from`/`to` DateRange; two-month calendar view (side-by-side) for range clarity |
| Single date mode | Reuse of the same component API for simpler contexts | LOW | `mode="single"`; same visual chrome as range; `SFCalendar` can remain the canonical single-date instance but SFDateRangePicker should also support it |
| Keyboard input with parse | Users must type dates, not only click | MEDIUM | Text input field shows `YYYY-MM-DD` or locale-aware format; parse on blur via native `Date.parse` or a tiny format helper; invalid input shows error |
| Calendar popover (trigger → flyout) | Standard date picker interaction | LOW | Compose `SFPopover`; trigger = `SFInput` or an `SFButton` with the date label |
| Range highlight in calendar | Visual range fill between selected dates | LOW | `react-day-picker` `range` modifier applies CSS classes; SF styling: hard-edge highlight with no rounded corners |
| Min/max date bounds | Prevent selecting past/future out-of-range dates | LOW | `react-day-picker` `disabled` prop with `{ before: minDate, after: maxDate }` |
| Disabled specific dates | Exclude holidays or unavailable dates | LOW | `react-day-picker` `disabled` prop accepts `Date[]` or a matcher function |
| Clear/reset selection | Remove current selection | LOW | A clear button in the trigger or the popover footer; sets value to `undefined` |
| Controlled API (value + onValueChange) | Design system standard | LOW | `value: DateRange | Date | undefined`; `onValueChange(value)` callback |

### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Presets panel ("Last 7 days", "Last 30 days", "This month", "This quarter", "This year") | Common in analytics dashboards; reduces clicks to near-zero | LOW | A column of preset buttons beside the calendar; clicking a preset sets the DateRange value immediately; presets are configurable via prop |
| Datetime mode (date + time) | Scheduling and event UIs | MEDIUM | After date selection, render a time input (HH:MM); compose with a small time picker below the calendar; time stored as part of the `Date` object |
| Time-only mode | Shift scheduling, meeting times | MEDIUM | Skip the calendar; show only HH:MM inputs with up/down steppers; expose as a separate `mode="time"` variant |
| Locale support | Internationalization | MEDIUM | `react-day-picker` has `locale` prop from `date-fns/locale`; pass through as a prop; note: `date-fns` is NOT currently in the stack — this adds a transitive dep unless locale objects are passed by the consumer |
| Comparison range (secondary ghost range) | "Compare period" in analytics | HIGH | Render a second DateRange with a different visual treatment (muted/secondary fill) in the same calendar; complex interaction state |

### Anti-Features

| Feature | Why Requested | Why SF Must Reject | Alternative |
|---------|---------------|-------------------|-------------|
| Relative date input ("next week", "tomorrow") | Natural language parsing | Requires a NLP parser (chrono-node or similar) — another runtime dep; locale-sensitive; the DU aesthetic is precise and coded, not fuzzy | Presets panel handles common relative ranges; power users type ISO dates in the keyboard input |
| Inline calendar (no popover) | "Always-visible calendar" | Makes sense in only narrow booking UIs; the popover pattern is correct for forms; inline calendar bloats page layout with a 300px+ element | Expose `inline` prop as a future differentiator if a booking UI case emerges in v1.11 |
| Multiple separate date ranges | Compare multiple ranges simultaneously | Compound state machine; very narrow use case; the "comparison range" differentiator already covers the analytics use case | Build the comparison range differentiator instead |
| Custom day cell renderer | "Show availability counts in each day cell" | Arbitrary JSX in a calendar cell collides with the tightly controlled DU typographic grid; produces inconsistent cell heights | Expose `dayModifiers` (a set of modifier class names per date) — consumer adds semantic color classes via the `--sfx-*` token system, not arbitrary JSX |
| Week picker | Select a whole ISO week | Niche scheduling use case; produces confusing UX when months straddle week boundaries | Date range with 7-day interval preset covers 90% of this use case |

### Dependency Map

```
SFDateRangePicker
    ├──composes──> SFPopover (existing, in barrel)
    ├──composes──> SFCalendar (existing P3 lazy implementation as reference)
    ├──composes──> SFInput (keyboard input field)
    ├──composes──> SFButton (preset buttons, clear button)
    ├──requires──> react-day-picker (already in stack + optimizePackageImports)
    └──no new runtime deps

Locale support ──WARNING──> date-fns locale objects are NOT currently in the stack;
                             avoid importing date-fns directly; accept locale objects
                             from consumer (who may already have date-fns) to avoid
                             adding a transitive dep that hits BND-08
Datetime mode ──requires──> time input UI (can be composed from SFInput + small stepper buttons)
Presets ──requires──> DateRange calculation helpers (tiny inline utils, no dep)
Comparison range ──requires──> secondary DateRange state + distinct visual modifiers
```

### Phase 75 Ship List

**Must ship:** Date range mode with dual-month calendar, single date mode, keyboard input with parse, popover trigger, range highlight, min/max bounds, disabled dates, clear/reset, controlled API.

**Defer:** Presets panel (LOW — ship in Phase 75, high value/low cost), datetime mode (MEDIUM — ship if time allows), time-only mode (MEDIUM — defer to v1.11 if needed), locale support (MEDIUM — expose prop, avoid date-fns transitive dep), comparison range (HIGH — v1.11+).

---

## Cross-Component Feature Dependencies

```
SFDataTable
    ├──composes──> SFTable, SFPagination, SFCheckbox, SFInput, SFSkeleton, SFEmptyState
    └──requires──> TanStack Table v8 (_dep_X_decision ratified)

SFCombobox
    ├──composes──> SFPopover, SFCommand (direct import), SFInput
    └──no new deps

SFRichEditor
    ├──composes──> SFPopover, SFButton, SFSeparator
    └──requires──> Tiptap v2 (_dep_X_decision ratified), P3 lazy

SFFileUpload
    ├──composes──> SFProgress, SFButton, SFBadge/SFStatusDot
    └──no new deps

SFDateRangePicker
    ├──composes──> SFPopover, SFCalendar (reference), SFInput, SFButton
    └──uses──> react-day-picker (already in stack)

Phase ordering implication:
  Phase 71 (SFDataTable) — requires SFTable, SFPagination, SFCheckbox, SFInput, SFSkeleton,
                            SFEmptyState. ALL exist. No blocking dep.
  Phase 72 (SFCombobox) — requires SFPopover, SFCommand. BOTH exist. No blocking dep.
  Phase 73 (SFRichEditor) — requires SFPopover, SFButton, SFSeparator. ALL exist. No blocking dep.
  Phase 74 (SFFileUpload) — requires SFProgress, SFButton. BOTH exist. No blocking dep.
  Phase 75 (SFDateRangePicker) — requires SFPopover, SFCalendar, SFInput, SFButton.
                                   ALL exist. No blocking dep.

All 5 components are unblocked from Phase 71 onward.
No phase has a hard dependency on a PRIOR v1.10 phase's output.
```

---

## Feature Prioritization Matrix (v1.10 Ship Scope)

| Component | Feature | User Value | Implementation Cost | Phase Priority |
|-----------|---------|------------|---------------------|----------------|
| SFDataTable | Sort + filter + pagination | HIGH | LOW | P1 — must ship |
| SFDataTable | Row selection | HIGH | MEDIUM | P1 — must ship |
| SFDataTable | Density modes | MEDIUM | LOW | P1 — must ship |
| SFDataTable | Server-side mode | HIGH | MEDIUM | P2 — ship if time |
| SFDataTable | Expandable rows | MEDIUM | MEDIUM | P2 — ship if time |
| SFDataTable | Virtualization | LOW (for <500 rows) | HIGH | P3 — v1.11 |
| SFCombobox | Single-select autocomplete | HIGH | LOW | P1 — must ship |
| SFCombobox | Multi-select | HIGH | MEDIUM | P2 — ship if time |
| SFCombobox | Async search callback | MEDIUM | MEDIUM | P2 — ship if time |
| SFCombobox | Creatable items | MEDIUM | MEDIUM | P2 — ship if time |
| SFRichEditor | Core toolbar (bold/italic/heading/list/link) | HIGH | LOW | P1 — must ship |
| SFRichEditor | Code block + inline code | HIGH | LOW | P1 — must ship |
| SFRichEditor | Paste cleanup | MEDIUM | MEDIUM | P2 — ship if time |
| SFRichEditor | Image paste | MEDIUM | MEDIUM | P2 — ship if time |
| SFRichEditor | Slash commands | LOW (v1.10 targets) | HIGH | P3 — v1.11 |
| SFFileUpload | Drag-drop + click-to-browse | HIGH | LOW | P1 — must ship |
| SFFileUpload | File list + validation + progress | HIGH | LOW | P1 — must ship |
| SFFileUpload | Image preview + paste + retry | MEDIUM | LOW | P2 — ship in phase |
| SFFileUpload | Drop-anywhere mode | LOW | MEDIUM | P3 — v1.11 |
| SFDateRangePicker | Date range + single date + keyboard input | HIGH | MEDIUM | P1 — must ship |
| SFDateRangePicker | Presets panel | HIGH | LOW | P1 — ship in phase |
| SFDateRangePicker | Datetime mode | MEDIUM | MEDIUM | P2 — ship if time |
| SFDateRangePicker | Comparison range | LOW (v1.10 targets) | HIGH | P3 — v1.11 |

---

## SF Aesthetic Constraints Applied Per Component

These are not preferences — they are hard constraints that apply to all 5 components:

- **Zero border-radius everywhere** — no `rounded-*` classes; no `border-radius` CSS; calendar cells, file list rows, editor toolbar, table headers, combobox popover: all sharp-edged
- **OKLCH only** — all colors via `--sfx-*` token system; no hex, no raw rgb(); range highlight in SFDateRangePicker uses `--sfx-primary` fill, NOT a decorative gradient
- **Spacing: blessed stops only** — `p-4 / p-8 / p-12 / p-16 / p-24 / p-32 / p-48 / p-64 / p-96`; no `p-5`, no `p-3`, no arbitrary values
- **Typography: semantic aliases** — toolbar labels use `small` (sm+Inter); table headers use `small`; date labels use `small`; no ad-hoc font-size declarations
- **Depth from contrast alone** — no box-shadow on popovers (this means SFPopover already handles it); table sort indicators use glyph contrast not shadow; no fake elevation
- **Motion from GSAP tokens** — if any of these components animate (e.g. popover open, file upload row entry), use `--sfx-duration-*` tokens; do NOT add new GSAP effects; CSS transitions only where GSAP would be overkill (popover already handled by Radix)
- **DU "slightly tense" register** — file upload drop zones: 1px dashed border using `--sfx-primary` on drag-over (not a glowing animated border); editor toolbar: monospaced button labels where possible; table sort indicators: directional glyphs, not animated arrows

---

## Sources

- TanStack Table v8 documentation: https://tanstack.com/table/v8/docs (HIGH confidence — official docs)
- Tiptap v2 documentation: https://tiptap.dev/docs (HIGH confidence — official docs)
- react-day-picker documentation: https://react-day-picker.js.org (HIGH confidence — official docs; already in stack)
- shadcn combobox pattern: https://ui.shadcn.com/docs/components/combobox (HIGH confidence — direct architecture reference for SFCommand + SFPopover composition)
- HTML5 File API / DataTransfer: MDN Web Docs (HIGH confidence — native browser API)
- Radix UI Popover: https://www.radix-ui.com/primitives/docs/components/popover (HIGH confidence — already in use)
- cmdk documentation: https://cmdk.paco.me (HIGH confidence — already in stack via SFCommand)
- Existing SF codebase analysis: `components/sf/index.ts`, `components/sf/sf-command.tsx`, `components/sf/sf-popover.tsx`, `components/sf/sf-calendar.tsx` (HIGH confidence — ground truth)
- CLAUDE.md aesthetic mandate (HIGH confidence — locked system rules)
- PROJECT.md v1.10 requirements (HIGH confidence — validated requirements)

---

*Feature research for: SignalframeUX v1.10 Library Completeness — 5 new components*
*Researched: 2026-04-30*
