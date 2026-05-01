# Phase 72: SFCombobox — Research

**Domain:** Pure SF composition (cmdk + Radix Popover) with multi-select + axe-core WCAG AA
**Researched:** 2026-05-01
**Confidence:** HIGH

---

## Summary

SFCombobox is a Pattern C composition — zero new deps, barrel-exported, and the confidence-builder
phase before Phase 73's Tiptap complexity. The building blocks are already fully present and audited:
`sf-command.tsx` (cmdk wrapper, direct-import only), `sf-popover.tsx` (Radix Popover), `sf-badge.tsx`
(chip rendering for multi-select), `sf-button.tsx` (trigger and clear affordance). The primary
architectural risk is not implementation complexity but ARIA correctness: the cmdk `CommandInput`
injects its own `role="combobox"` + `aria-expanded` + `aria-controls` + `aria-activedescendant`,
while Radix `PopoverTrigger` injects `aria-expanded` + `aria-haspopup` + `aria-controls` on
whatever element it wraps. Merging these on a single element produces duplicate/conflicting ARIA
attributes — the axe-core gate will fail. The ROADMAP constraint to use a plain `<button>` as
`PopoverTrigger` is the correct fix: the trigger button shows the current selection (or chip stack),
Radix manages its open/close ARIA on that button, and `CommandInput` lives wholly inside
`SFPopoverContent` owning its own combobox ARIA chain.

**Primary recommendation:** `SFCombobox` = `SFPopover` + wrapper `<button>` trigger + `SFPopoverContent`
containing `SFCommand` → `SFCommandInput` → `SFCommandList` → `SFCommandEmpty` + `SFCommandGroup`
(optional) + `SFCommandItem` per option. Multi-select adds `SFBadge` chips inside the trigger button's
content and keeps the popover open by intercepting `SFCommandItem.onSelect` to toggle the set rather
than close. The clear affordance is a separate `<button>` element inside the trigger's visual wrapper —
keyboard-reachable independently.

---

## Standard Architecture

### Existing Dependency Map

```
sf-command.tsx          → wraps cmdk (already in bundle via D-04 optimizePackageImports list)
sf-popover.tsx          → wraps @radix-ui/react-popover (already in bundle)
sf-badge.tsx            → pure CSS, zero external dep
sf-button.tsx           → wraps @radix-ui/react-slot / shadcn Button
sf/index.ts             → SFCommand* intentionally NOT exported (barrel comment line 70-73)
                       → SFPopover* exported (line 76-83)
                       → SFBadge exported (line 19)
                       → SFButton exported (line 9)
```

cmdk is already in the `optimizePackageImports` list in `next.config.ts` (D-04 lock entry). Using it
inside `SFCombobox` does not add to the First Load JS — cmdk is already pre-resolved. The D-04 list
is FROZEN; no modification is needed or permitted for this phase.

### Why `SFCommand*` is Imported Directly (Not Via Barrel)

The barrel comment at `sf/index.ts:70-73` documents this precisely: cmdk (~12 KB gz) plus nested
radix-dialog/primitives appear when CommandDialog is pulled in. Only CommandPalette in the codebase
uses these directly today. SFCombobox must follow the same rule: `import { SFCommand, SFCommandInput,
SFCommandList, SFCommandEmpty, SFCommandGroup, SFCommandItem } from "@/components/sf/sf-command"`.
SFCombobox ITSELF is exported from the barrel — it is the consumer of sf-command, not a re-exporter.

---

## cmdk ARIA Contract (from source audit of `node_modules/cmdk/dist/index.js`)

This is the most important section for axe-core gate compliance. Verified against shipped cmdk source:

### `CommandInput` (`De` in minified source)
Renders `<input>` with:
- `role="combobox"`
- `aria-expanded={true}` — **always true**, regardless of popover state
- `aria-controls={listId}` — references the `CommandList`'s DOM id
- `aria-labelledby={labelId}` — references the sr-only `<label>` cmdk auto-generates
- `aria-activedescendant={selectedItemId}` — tracks the currently highlighted item id

### `CommandList` (`Ie` in minified source)
Renders `<div>` with:
- `role="listbox"`
- `aria-activedescendant={selectedItemId}` — also tracks highlighted item (dual tracking)
- `aria-label="Suggestions"` (overridable via `label` prop)
- `id={listId}` — the `aria-controls` target

### `CommandItem` (`Pe` in minified source)
Renders `<div>` with:
- `role="option"`
- `aria-disabled={!!disabled}`
- `aria-selected={!!isSelected}` — tracks keyboard-highlighted state (NOT selection state)
- `data-selected` / `data-disabled` — CSS hooks

### Critical: `CommandItem.onSelect` Callback
Fires via a synthetic `cmdk-item-select` CustomEvent dispatched on the item DOM node.
`onSelect` receives the item's **value string** (from `value` prop or inferred from text content).
The combobox consumer must wire `onSelect` to update both the selected-value state AND close/maintain
the popover — cmdk does NOT close the popover; it manages only its own `value` (highlighted item) state.

### `Command` Root (`ie`)
Renders `<div>` with `cmdk-root` attribute, `tabIndex=-1`.
- `value` prop: controlled currently-highlighted item value (distinct from the combobox selection value)
- `onValueChange`: fires when keyboard/pointer moves highlight
- `label` prop: accessible label for the sr-only `<label>` element (important for axe `listbox-label` rule)
- `shouldFilter={false}`: pass when implementing controlled async search (not needed for Phase 72)
- `loop={true}`: recommended — ArrowDown from last item wraps to first

---

## ARIA Conflict Analysis: Why `SFInput as PopoverTrigger asChild` Fails

`PopoverTrigger` (Radix `PopoverPrimitive.Trigger`) injects onto whatever it wraps:
- `aria-expanded={open}`
- `aria-haspopup="dialog"` (Radix Popover uses dialog under the hood)
- `data-state="open|closed"`

`CommandInput` (cmdk) injects:
- `role="combobox"`
- `aria-expanded={true}` (hardcoded always-true)
- `aria-controls={listId}`
- `aria-activedescendant={...}`

If `SFInput` is used as `PopoverTrigger asChild`, Radix merges its trigger props onto the `<input>`.
Then placing `CommandInput` elsewhere in the tree is structurally impossible because it must be inside
`Command` to access the cmdk context. The only way to co-locate them would be to use `asChild` on
`PopoverTrigger` with an element that also IS `CommandInput` — which produces double `aria-expanded`
(one from Radix at runtime, one from cmdk hardcoded to `true`), double `aria-controls` (different
targets), and `role="combobox"` on the trigger where Radix expects a button role. axe reports
`aria-allowed-attr` violation: `aria-haspopup` is not allowed on `role="combobox"`.

**Correct pattern:**
```
<SFPopover open={open} onOpenChange={setOpen}>
  <SFPopoverTrigger asChild>
    <button type="button" ...> ← plain button; Radix injects aria-expanded/aria-haspopup here
      {/* display current selection or chip stack */}
    </button>
  </SFPopoverTrigger>
  <SFPopoverContent>
    <SFCommand label="Search options" loop>   ← cmdk root; sr-only label auto-generated
      <SFCommandInput placeholder="Search..." />  ← role="combobox" here, isolated from trigger
      <SFCommandList aria-label="Options">        ← role="listbox" here
        <SFCommandEmpty>No results.</SFCommandEmpty>
        {/* SFCommandGroup + SFCommandItem */}
      </SFCommandList>
    </SFCommand>
  </SFPopoverContent>
</SFPopover>
```

---

## Recommended Approach

### File Layout

```
components/sf/sf-combobox.tsx       — SFCombobox component ('use client')
components/sf/index.ts              — ADD: export { SFCombobox } from "./sf-combobox"
app/dev-playground/sf-combobox/page.tsx   — playground fixture (mirrors sf-data-table pattern)
tests/v1.10-phase72-sf-combobox.spec.ts   — Playwright: controlled API + keyboard nav
tests/v1.10-phase72-sf-combobox-axe.spec.ts — axe-core: listbox role, open state
```

No new files in `components/ui/` — all compositions are SF-layer.

### Component API Shape

```typescript
type SFComboboxOption = {
  value: string;        // unique key — used by cmdk for filtering + item identity
  label: string;        // display text
  group?: string;       // optional group heading key
};

// Single-select
interface SFComboboxSingleProps {
  options: SFComboboxOption[];
  value?: string;                    // controlled
  defaultValue?: string;             // uncontrolled
  onChange?: (value: string | undefined) => void;
  multiple?: false;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

// Multi-select (discriminated union via `multiple` prop)
interface SFComboboxMultiProps {
  options: SFComboboxOption[];
  value?: string[];                   // controlled
  defaultValue?: string[];            // uncontrolled
  onChange?: (value: string[]) => void;
  multiple: true;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

type SFComboboxProps = SFComboboxSingleProps | SFComboboxMultiProps;
```

CVA is used for the trigger button's visual state variants (idle / open / selected) using
`intent`-vocabulary if variants are needed, but the trigger itself does not need CVA — it
is a bespoke composed element. CVA on a `sfComboboxTriggerVariants` if needed for size.

### Single-Select State

```typescript
// Internal state (when uncontrolled):
const [open, setOpen] = useState(false);
const [internalValue, setInternalValue] = useState(defaultValue ?? "");

// Controlled bridge:
const selectedValue = value !== undefined ? value : internalValue;

// On SFCommandItem select:
function handleSelect(itemValue: string) {
  const newValue = itemValue === selectedValue ? "" : itemValue; // toggle-off on re-select
  if (value === undefined) setInternalValue(newValue);           // uncontrolled
  onChange?.(newValue || undefined);
  setOpen(false);  // close on single-select
}
```

### Multi-Select State

```typescript
const [open, setOpen] = useState(false);
const [internalValues, setInternalValues] = useState<string[]>(defaultValue ?? []);
const selectedValues = value !== undefined ? value : internalValues;

function handleSelect(itemValue: string) {
  const next = selectedValues.includes(itemValue)
    ? selectedValues.filter((v) => v !== itemValue)
    : [...selectedValues, itemValue];
  if (value === undefined) setInternalValues(next);
  onChange?.(next);
  // DO NOT call setOpen(false) — popover stays open in multi-select mode
  // cmdk will update its internal highlight; the list stays visible
}
```

Critical: cmdk's `CommandItem` fires `onSelect` and then internally moves the highlight — the
popover stays open because the consumer does NOT call `setOpen(false)`. This is the standard
multi-select combobox pattern.

### Multi-Select: Popover Stay-Open Mechanism

cmdk's `CommandItem.onSelect` does not close anything — it only fires the `onSelect` callback.
The consumer owns the `open` state of `SFPopover`. For multi-select, the consumer simply does not
call `setOpen(false)` in `handleSelect`. The popover remains open, the list re-renders with updated
chip badges in the trigger, and the user continues selecting. Closing happens via:
- Escape key (Radix Popover closes on Escape automatically)
- Click outside (Radix `onInteractOutside` default behavior)
- A "Done" affordance (optional — not in CB-01..04 scope, defer to CB-05+)

### Chip Rendering (Multi-Select)

Chips render INSIDE the trigger button. Each chip is `SFBadge intent="outline"` with a remove `×`
button. The remove button must be `type="button"` and stop propagation to prevent the trigger button
from toggling the popover:

```tsx
<button type="button" ...>  {/* PopoverTrigger wrapper */}
  <div className="flex flex-wrap gap-[var(--sfx-space-1)]">
    {selectedValues.map((v) => {
      const opt = options.find((o) => o.value === v);
      return (
        <SFBadge key={v} intent="outline" className="gap-[var(--sfx-space-1)] pr-[var(--sfx-space-1)]">
          {opt?.label ?? v}
          <button
            type="button"
            aria-label={`Remove ${opt?.label ?? v}`}
            onClick={(e) => {
              e.stopPropagation();
              handleRemove(v);
            }}
          >
            ×
          </button>
        </SFBadge>
      );
    })}
    {selectedValues.length === 0 && (
      <span className="text-muted-foreground">{placeholder ?? "Select..."}</span>
    )}
  </div>
</button>
```

### Clear Affordance (CB-02)

A separate `<button type="button">` rendered to the right of the trigger display area. Only visible
when a selection exists. Must stop propagation. Keyboard-reachable independently of the trigger.

```tsx
<div className="flex items-center border-2 border-foreground">
  <SFPopoverTrigger asChild>
    <button type="button" className="flex-1 ...">
      {/* selection display */}
    </button>
  </SFPopoverTrigger>
  {hasSelection && (
    <button
      type="button"
      aria-label="Clear selection"
      onClick={() => {
        onChange?.(multiple ? [] : undefined);
        if (!isControlled) setInternalValue(multiple ? [] : "");
      }}
      className="px-[var(--sfx-space-2)] border-l-2 border-foreground ..."
    >
      ×
    </button>
  )}
</div>
```

The outer `<div>` acts as the visual container — styled with the `border-2 border-foreground` SF
contract. The trigger `<button>` and the clear `<button>` are siblings inside it. This avoids
nesting interactive elements (which is invalid HTML), since the clear button is a sibling, not a
descendant, of the trigger button.

### Loading State (CB-01)

cmdk provides a `CommandLoading` component (renders `role="progressbar"`). When `loading={true}`,
render `<CommandLoading>` inside `CommandList` instead of items:

```tsx
<SFCommandList>
  {loading ? (
    <CommandLoading>Loading...</CommandLoading>
  ) : (
    <>
      <SFCommandEmpty>{emptyText ?? "No results."}</SFCommandEmpty>
      {/* grouped or flat items */}
    </>
  )}
</SFCommandList>
```

`CommandLoading` is available via `import { CommandLoading } from "@/components/ui/command"` — it is
NOT wrapped in sf-command.tsx currently. The planner must decide: add `SFCommandLoading` to
sf-command.tsx in the same commit, OR import `CommandLoading` directly from `@/components/ui/command`
inside sf-combobox.tsx. Recommended: wrap it in sf-command.tsx for consistency (one-line wrapper, no
aesthetic difference needed) and export from sf-command.tsx directly (NOT from sf/index.ts barrel).

### Grouping (CB-02)

Options with a `group` key are grouped under a `SFCommandGroup`. Options without a `group` render
flat. The grouping is computed from the `options` array:

```typescript
const grouped = useMemo(() => {
  const groups = new Map<string, SFComboboxOption[]>();
  const ungrouped: SFComboboxOption[] = [];
  for (const opt of options) {
    if (opt.group) {
      const g = groups.get(opt.group) ?? [];
      g.push(opt);
      groups.set(opt.group, g);
    } else {
      ungrouped.push(opt);
    }
  }
  return { groups, ungrouped };
}, [options]);
```

### cmdk Filter Behavior

cmdk uses `command-score` internally (a Levenshtein-inspired weighted scorer). This is acceptable
for Phase 72 — consumer can pass a custom `filter` prop to `SFCommand` if needed. `CommandEmpty`
auto-renders when `filtered.count === 0`. No custom filter logic is needed for CB-01..04 scope.

---

## Integration Points

### Files That Must Be Modified

| File | Change | Reason |
|------|--------|--------|
| `components/sf/index.ts` | Add `export { SFCombobox } from "./sf-combobox"` | CB-04: barrel export required (Pattern C) |
| `components/sf/sf-command.tsx` | Add `SFCommandLoading` wrapper + export | Loading state needed without direct ui/ import in combobox |
| `public/r/registry.json` | Add SFCombobox registry entry | REG-01 (fires at Phase 76, but entry lands same-commit as component per same-commit rule) |
| `SCAFFOLDING.md` | Update component count | REG-01 (Phase 76 final gate — but component landing updates stale count) |

### Files That Must Be Read But Not Modified

| File | Why |
|------|-----|
| `components/sf/sf-command.tsx` | Import source for SFCommand* — use directly, never via barrel |
| `components/sf/sf-popover.tsx` | Import source for SFPopover* |
| `components/sf/sf-badge.tsx` | Import source for SFBadge chips |
| `app/globals.css` | Verify no rounded-corner overrides needed; cmdk items get `rounded-none` via SFCommandItem |
| `next.config.ts` | Verify D-04 list; confirm cmdk is already in optimizePackageImports (it is) |

### Files Created in This Phase

| File | Purpose |
|------|---------|
| `components/sf/sf-combobox.tsx` | Main component (`'use client'`) |
| `app/dev-playground/sf-combobox/page.tsx` | Playwright + axe fixture |
| `tests/v1.10-phase72-sf-combobox.spec.ts` | Playwright acceptance |
| `tests/v1.10-phase72-sf-combobox-axe.spec.ts` | axe-core WCAG AA |

---

## Anti-Patterns

### Anti-Pattern 1: `SFInput` as `PopoverTrigger asChild`

Rejected. ARIA collision: `aria-expanded` injected twice (once by Radix at runtime, once by cmdk
hardcoded to `true`), `aria-haspopup` not allowed on `role="combobox"`. Focus trap misfires because
Radix Popover manages focus return to the trigger, but cmdk expects focus in `CommandInput` — the
two have conflicting focus expectations on the same element. axe `aria-allowed-attr` rule fails.

### Anti-Pattern 2: Exporting SFCombobox from `sf/index.ts` Before SFCommand

SFCommand* must NEVER appear in the barrel chain. SFCombobox imports SFCommand* internally (direct
path), then SFCombobox itself is exported from the barrel. The barrel re-exports SFCombobox, not
anything from sf-command.tsx. Tree-shaking at the barrel level will correctly exclude cmdk-internal
symbols since sf-combobox.tsx does not re-export them.

### Anti-Pattern 3: Using `shouldFilter={false}` Without Custom Search

`shouldFilter={false}` is for async/server-side search where the consumer filters the option list
externally. For Phase 72 (static options), the default cmdk filtering (command-score) is correct.
Passing `shouldFilter={false}` with static options means typing produces no filtering — the list
stays full. Do not use unless CB-05+ async search is implemented.

### Anti-Pattern 4: Closing Popover in Multi-Select `onSelect`

If `setOpen(false)` is called inside `handleSelect` for multi-select, every chip addition closes
the popover and the user must re-open to add more. The correct behavior is: popover stays open in
multi-select; Escape or click-outside closes it.

### Anti-Pattern 5: Nesting the Clear Button Inside the Trigger Button

```tsx
// WRONG — nested interactive elements (invalid HTML + focus trap)
<SFPopoverTrigger asChild>
  <button type="button">
    <button type="button" onClick={clear}>×</button>  {/* nested button — invalid */}
  </button>
</SFPopoverTrigger>
```

Use sibling layout: trigger button and clear button are siblings inside a flex container. The
container gets the border styling; neither button has a border of its own.

### Anti-Pattern 6: Hardcoded `rounded-md` from cmdk defaults

The `ui/command.tsx` base has `rounded-sm` on `CommandItem` and `rounded-lg` on `Command`. The
SFCommand wrappers override these with `rounded-none`. Verify all sub-components maintain
`rounded-none` — particularly `SFCommandItem` which is confirmed to have `rounded-none` at line 143
of `sf-command.tsx`.

### Anti-Pattern 7: `aria-expanded` on `CommandInput` Always True

This is expected cmdk behavior — cmdk's `CommandInput` hardcodes `aria-expanded={true}` because
from the cmdk perspective the list is always "open" while the input is mounted. This is not an axe
violation when the structure is correct (input lives inside the popover content, not outside it).
axe only complains about `aria-expanded` when it conflicts with another element's `aria-expanded`
at the same DOM level.

---

## A11y Mechanics for axe Gate

### Rules to Target in axe-core Tests

| axe Rule | Component Location | Expected State |
|----------|-------------------|----------------|
| `aria-required-children` | `[role="listbox"]` must have `[role="option"]` children | Pass: cmdk List has Items with role="option" |
| `aria-allowed-attr` | `[role="combobox"]` — only cmdk input, isolated from Radix trigger | Pass: ComboboxInput not mixed with popover-trigger |
| `aria-valid-attr-value` | `aria-activedescendant` on input points to valid DOM id | Pass: cmdk manages this internally |
| `listbox` | `[role="listbox"]` has accessible name | Pass IF `SFCommand label="..."` is set, OR `SFCommandList aria-label="..."` is passed |
| `aria-label` | sr-only label on `SFCommand` | Needs explicit `label` prop on SFCommand |
| `color-contrast` | Trigger button text, list items, badges | Verify `--sfx-*` tokens meet WCAG AA |
| `button-name` | Trigger button, clear button, chip remove buttons | Each needs accessible name |

Critical: `SFCommand` accepts a `label` prop that generates a sr-only `<label>` element. This label
is the accessible name for the combobox input via `aria-labelledby`. **Always pass `label` to
SFCommand** — without it, axe's `listbox` rule may flag missing accessible name on the listbox.
Recommended: derive from a visible `<SFLabel>` for the whole combobox, or pass a descriptive string.

For `aria-multiselectable`: when `multiple={true}`, the `[role="listbox"]` should carry
`aria-multiselectable="true"`. cmdk's `CommandList` does NOT set this automatically. The Planner
must decide: add `aria-multiselectable="true"` via a custom className or direct prop on
`SFCommandList`. Recommend passing it as a prop: `<SFCommandList aria-multiselectable={multiple}>`.
axe's `aria-allowed-attr` allows `aria-multiselectable` on `role="listbox"`.

---

## Multi-Plan Structure Recommendation

Phase 72 is simpler than Phase 71 (no dep ratification, no P3 lazy). Two plans is the natural split:

**Plan 01:** Single-select implementation + playground fixture + barrel export
- CB-01 (single-select + keyboard + controlled/uncontrolled API)
- CB-02 (clear affordance + grouping)
- CB-04 (barrel export + registry entry + same-commit rule)

**Plan 02:** Multi-select + tests
- CB-03 (multiple prop + SFBadge chips + value: string[] API)
- TST-03 (Playwright + axe-core test files, both green before close)

This mirrors the Phase 71 wave structure. Three plans is acceptable if Plan 01 is split into
single-select-impl and grouping/clear, but two plans is cleaner given the lighter scope.

---

## Validation Architecture

### Test Infrastructure

| Property | Value |
|----------|-------|
| Framework | Playwright + axe-core (E2E) — no vitest unit tests needed (pure composition, no pure logic to unit-test) |
| Config | `playwright.config.ts` (existing) |
| Quick run | `pnpm exec playwright test tests/v1.10-phase72-sf-combobox*.spec.ts --reporter=line` |
| Fixture URL | `http://localhost:3000/dev-playground/sf-combobox` |

### Fixture Design (`app/dev-playground/sf-combobox/page.tsx`)

The fixture must expose ALL test scenarios in a single page (mirrors `sf-data-table` precedent):

```
Section 1: Uncontrolled single-select (5 flat options)
Section 2: Controlled single-select (10 options; 3 groups; initial value set)
Section 3: Uncontrolled multi-select (5 options)
Section 4: Loading state (loading={true}, no options rendered)
Section 5: Empty state (options=[], no loading)
Section 6: Grouped options fixture (3 groups × 3 options = 9 total)
```

Each section has a `data-testid` for isolation. Controlled sections display the current value in a
`data-testid="controlled-value-display"` element so Playwright can assert state without internal
DOM traversal.

### Sample Fixtures

| Fixture | Options Count | Purpose |
|---------|---------------|---------|
| Flat options (small) | 5 | Basic single/multi select, empty state, clear |
| Flat options (large) | 50 | Filter performance, scroll in list |
| Grouped options | 3 groups × 3 options | CB-02 grouping + SFCommandGroup rendering |
| Mixed language | 3 options with Unicode labels | cmdk command-score Unicode handling |
| Controlled out-of-range value | 1 option; initial value = "nonexistent" | Graceful handling — show placeholder, not crash |
| Duplicate values | 2 options with same value string | cmdk deduplication behavior |

### Edge Cases to Assert

| Edge Case | Expected Behavior |
|-----------|-------------------|
| Empty options array | `SFCommandEmpty` renders; listbox still has accessible name |
| All options filtered out by search | `SFCommandEmpty` renders when `filtered.count === 0` |
| Controlled value not in options list | Trigger shows placeholder (label lookup yields undefined → fallback to value string) |
| Multi-select: select all, then clear | `value: []` after clear; chips gone |
| Keyboard: ArrowDown past last item | Wraps to first (requires `loop` prop on SFCommand) |
| Keyboard: Escape while open | Popover closes; focus returns to trigger button (Radix default) |
| Keyboard: Enter on highlighted item | Item selected; single-select closes; multi-select stays open |
| Chip remove click | Removes only that item from selection; popover stays closed if closed |

### Per-Task Verification Map (Draft for VALIDATION.md)

| Task | Plan | Requirement | Threat | Behavior | Type | Command |
|------|------|-------------|--------|----------|------|---------|
| Open popover on trigger click | 01 | CB-01 | — | Popover visible | playwright | `--grep "CB-01.*open"` |
| Type-ahead filters list | 01 | CB-01 | — | Visible items reduced | playwright | `--grep "CB-01.*filter"` |
| ArrowDown/Up navigate list | 01 | CB-01 | — | `aria-selected` moves | playwright | `--grep "CB-01.*keyboard"` |
| Enter selects focused item | 01 | CB-01 | — | Selection updated, popover closes | playwright | `--grep "CB-01.*Enter"` |
| Escape closes without selecting | 01 | CB-01 | — | Popover closes, value unchanged | playwright | `--grep "CB-01.*Escape"` |
| Controlled value prop updates trigger display | 01 | CB-01 | — | Trigger reflects external state | playwright | `--grep "CB-01.*controlled"` |
| Clear button resets selection | 01 | CB-02 | — | `onChange(undefined)` fired | playwright | `--grep "CB-02.*clear"` |
| CommandGroup renders with heading | 01 | CB-02 | — | Group heading visible in list | playwright | `--grep "CB-02.*group"` |
| `SFCombobox` in `sf/index.ts` | 01 | CB-04 | — | Export present | grep | `grep -c "SFCombobox" components/sf/index.ts` |
| Registry entry present | 01 | CB-04 | — | Entry in registry.json | grep | `grep -c "sf-combobox" public/r/registry.json` |
| Multi-select: popover stays open | 02 | CB-03 | — | After select, popover visible | playwright | `--grep "CB-03.*stays-open"` |
| Multi-select: SFBadge chips render | 02 | CB-03 | — | Chip count matches selection | playwright | `--grep "CB-03.*chips"` |
| Chip remove affordance works | 02 | CB-03 | — | Item deselected on × click | playwright | `--grep "CB-03.*remove"` |
| `value: string[]` controlled API | 02 | CB-03 | — | Display reflects external array | playwright | `--grep "CB-03.*controlled"` |
| axe: listbox role + label (open state) | 02 | TST-03 | — | Zero violations | axe | `phase72-sf-combobox-axe.spec.ts` |
| axe: aria-allowed-attr (no conflict) | 02 | TST-03 | — | Zero violations | axe | `phase72-sf-combobox-axe.spec.ts` |
| axe: color-contrast all text | 02 | TST-03 | — | Zero violations | axe | `phase72-sf-combobox-axe.spec.ts` |
| axe: button-name (trigger + clear + chips) | 02 | TST-03 | — | Zero violations | axe | `phase72-sf-combobox-axe.spec.ts` |
| axe: multi-select aria-multiselectable | 02 | TST-03 | — | Zero violations on open multiselect | axe | `phase72-sf-combobox-axe.spec.ts` |

### axe-core Test File Structure

Following Phase 71 precedent (two-file split: Playwright acceptance + axe isolation):

```
tests/v1.10-phase72-sf-combobox.spec.ts        — keyboard nav, controlled API, multi-select
tests/v1.10-phase72-sf-combobox-axe.spec.ts    — axe rules: listbox, aria-allowed-attr, button-name,
                                                  color-contrast, aria-multiselectable
```

axe scans MUST be run with popover OPEN — axe cannot scan inside a hidden Radix portal. The fixture
page must either open popover by default OR the test uses `trigger.click()` before `analyze()`.

Vacuous-green guard: before `analyze()`, assert `page.locator('[role="listbox"]').isVisible()`.
This ensures a 404 or closed state cannot yield a false green.

### axe Rules to Target

```typescript
const SINGLE_SELECT_RULES = [
  "aria-allowed-attr",       // no aria-haspopup on role=combobox
  "aria-valid-attr-value",   // aria-activedescendant references valid id
  "aria-required-children",  // listbox > option children
  "listbox",                 // listbox has accessible name
  "button-name",             // trigger button + clear button have names
  "color-contrast",          // all text meets WCAG AA
];

const MULTI_SELECT_RULES = [
  ...SINGLE_SELECT_RULES,
  "aria-allowed-attr",       // aria-multiselectable allowed on listbox
];
```

### Bundle Impact Check

SFCombobox imports from `sf-command.tsx` which already imports from `@/components/ui/command` which
imports cmdk. cmdk is in the `optimizePackageImports` D-04 list. SFCombobox is barrel-exported,
meaning it appears in the `@/components/sf` barrel chunk. However, because `sf-command.tsx` is
NOT re-exported from the barrel, the barrel importing `sf-combobox.tsx` which imports
`sf-command.tsx` creates a NEW import path for cmdk into the barrel chunk.

**This is the key bundle risk for Phase 72.** If `SFCombobox` is used on any page that also imports
from the `@/components/sf` barrel, cmdk will be included in that page's chunk — not the First Load
homepage chunk, because homepage doesn't render `SFCombobox`.

Mitigation: cmdk is already in `optimizePackageImports`, which means Next.js can tree-shake it
per-page regardless. The homepage `/` page does not render `SFCombobox`. Verify post-build that
cmdk strings are absent from the homepage First Load chunk manifest (same pattern as Phase 71
TanStack Table check). If cmdk appears in homepage First Load, a `_path_X_decision` is needed OR
`SFCombobox` must be P3 lazy (contra CB-04). The existing usage context (cdOS tool, not homepage)
makes this risk LOW — but the planner must run the bundle check.

---

## Sources

| File | Lines Read | Role |
|------|-----------|------|
| `.planning/REQUIREMENTS.md` | All | CB-01..04, TST-03 definitions |
| `.planning/ROADMAP.md` | Phase 72 section | Phase constraints, success criteria |
| `.planning/STATE.md` | v1.10 map | Phase position, standing rules |
| `components/sf/sf-command.tsx` | All | SFCommand* API, class audit, export list |
| `components/sf/sf-popover.tsx` | All | SFPopover* API, asChild patterns |
| `components/sf/sf-badge.tsx` | All | SFBadge intent variants |
| `components/sf/sf-button.tsx` | All | CVA pattern, intent vocabulary |
| `components/sf/sf-input.tsx` | All | Why NOT used as PopoverTrigger asChild |
| `components/sf/index.ts` | All | Current exports, SFCommand* exclusion comment |
| `components/ui/command.tsx` | All | CommandInput/List/Item slot attributes |
| `components/ui/popover.tsx` | All | Radix PopoverTrigger attribute injection |
| `node_modules/cmdk/dist/index.d.ts` | All | CommandInput/List/Item type signatures |
| `node_modules/cmdk/dist/index.js` | Minified source | ARIA attribute injection verified: `De` (CommandInput), `Ie` (CommandList), `Pe` (CommandItem) |
| `.planning/phases/71-sfdatatable/71-VALIDATION.md` | All | VALIDATION.md structure template |
| `.planning/phases/71-sfdatatable/71-RESEARCH.md` | Lines 1-82 | Research doc format, constraint block format |
| `app/dev-playground/sf-data-table/page.tsx` | All | Fixture page pattern |
| `tests/v1.10-phase71-sf-data-table-axe.spec.ts` | All | axe test file pattern (vacuous-green guard) |
| `tests/v1.10-phase71-sf-data-table.spec.ts` | Lines 1-57 | Playwright spec pattern |

**Confidence: HIGH** — cmdk ARIA contract verified directly from minified source, not from docs.
All building blocks confirmed present on disk. No speculative dependencies.
