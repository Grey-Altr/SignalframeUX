---
phase: 72-sfcombobox
reviewed: 2026-05-01T00:00:00Z
depth: standard
files_reviewed: 9
files_reviewed_list:
  - components/sf/sf-combobox.tsx
  - components/sf/sf-command.tsx
  - components/ui/command.tsx
  - components/sf/index.ts
  - public/r/sf-combobox.json
  - public/r/registry.json
  - app/dev-playground/sf-combobox/page.tsx
  - tests/v1.10-phase72-sf-combobox.spec.ts
  - tests/v1.10-phase72-sf-combobox-axe.spec.ts
findings:
  critical: 0
  warning: 4
  info: 6
  total: 10
status: issues_found
---

# Phase 72: Code Review Report

**Reviewed:** 2026-05-01
**Depth:** standard
**Files Reviewed:** 9
**Status:** issues_found

## Summary

Phase 72 ships SFCombobox<T> via Pattern C composition over cmdk + Radix Popover with zero new runtime deps. The discriminated-union API (single vs. multi via `multiple` prop) is well-modelled, the same-commit registry contract (REG-01) is honored (sf-combobox.json + items[] entry shipped together), the cmdk barrel-exclusion is preserved at sf/index.ts:70-79, and bundle audit data shows cmdk stays out of the homepage First Load chunk. Tests exercise the actual API surface (controlled value mirrors, multi-select Selected: N counter, chip remove counter delta) rather than DOM smoke-testing — no vacuous-green pattern.

Four **Warning**-level issues should be addressed before declaring Phase 72 closed:

1. **W-01** — `aria-selected` is silently overridden by cmdk in multi-select mode (real ARIA contract bug; current axe sweep does not catch it because cmdk always emits *some* `aria-selected`).
2. **W-02** — cmdk shadcn base uses `rounded-xl!` / `rounded-lg!` / `rounded-sm` with the Tailwind `!important` modifier on Command, CommandDialog, and the embedded InputGroup; SFCommand's `rounded-none` neutralizer in `cn()` cannot defeat `!important`. Hard violation of CLAUDE.md "zero border-radius everywhere" hard constraint, scoped to the popover content interior.
3. **W-03** — Type-narrowing via repeated `(props as SFComboboxSingleProps)` / `(props as SFComboboxMultiProps)` casts — six call-sites bypass TS's discriminator narrowing and would silently break if a third branch is added later.
4. **W-04** — Chip remove × `onClick`/`onKeyDown` use `stopPropagation` only on the React synthetic event; Radix Popover's outside-click detection runs on `pointerDown`/`mousedown`. Empirically passes the spec, but is a load-bearing race that would regress invisibly if Radix changes its dismiss-strategy timing.

Six **Info**-level items cover documentation, type-narrowing hygiene, and one minor redundancy.

## Warnings

### W-01: `aria-selected` is hijacked by cmdk in multi-select; users cannot distinguish "highlighted" from "selected"

**File:** `components/sf/sf-combobox.tsx:334`, `components/sf/sf-combobox.tsx:350`
**Issue:** `SFCommandItem` is passed `aria-selected={isOptionSelected(opt.value)}` to surface the user's logical multi-selection on each option. But cmdk's `CommandItem` (verified in `node_modules/cmdk/dist/index.mjs`, `he` forwardRef) builds its DOM as:

```js
t.createElement(D.div, {
  ref: G(u, o),
  ...q,                    // user props spread first
  id: n,
  "cmdk-item": "",
  role: "option",
  "aria-disabled": !!A,
  "aria-selected": !!R,    // cmdk overrides — R = current cmdk-highlight, NOT user selection
  "data-disabled": !!A,
  "data-selected": !!R,
  onPointerMove: ...,
  onClick: ...
})
```

Because cmdk's hardcoded `aria-selected: !!R` (where `R` is the cmdk-internal "currently keyboard-highlighted" value via `useCommandState`) is spread *after* `...q`, the user's `aria-selected` prop is silently overridden. In single-select this is acceptable (cmdk-highlight ≈ user-selection at close-time). In **multi-select**, this means screen readers cannot announce which chips are already selected when the popover is open — every option except the cmdk-cursor-position reports `aria-selected="false"`. This breaks the WAI-ARIA combobox-with-multiselect contract.

The Plan 02 axe spec at `tests/v1.10-phase72-sf-combobox-axe.spec.ts:174-198` does not catch this because axe's `aria-allowed-attr` only validates attribute *presence*, not semantic correctness against multi-selection state.

**Fix:** Use `data-selected-user` (or similar non-ARIA data attribute) for visual styling and rely on the `aria-checked` pattern, which IS allowed on `role="option"` for multi-selectable listboxes per ARIA 1.2:

```tsx
// In SFCombobox, instead of aria-selected:
<SFCommandItem
  key={opt.value}
  value={opt.value}
  disabled={opt.disabled}
  onSelect={handleSelect}
  aria-checked={isMulti ? isOptionSelected(opt.value) : undefined}
  role={isMulti ? "option" : undefined}
>
  {opt.label}
</SFCommandItem>
```

And add a Playwright assertion that opens section-3 (multi), selects two options, and verifies `[role="option"][aria-checked="true"]` count === 2 with the popover open. Current spec only verifies chip count *after* close, which doesn't exercise the in-popover ARIA state.

---

### W-02: cmdk shadcn base bakes `rounded-xl!` / `rounded-lg!` / `rounded-sm` into the popover interior — SFCommand's `rounded-none` cannot override `!important`

**File:** `components/ui/command.tsx:28`, `components/ui/command.tsx:57`, `components/ui/command.tsx:74`, `components/ui/command.tsx:158`
**Issue:** The shadcn cmdk base applies Tailwind `!`-modifier (compiles to CSS `!important`) on multiple surfaces:

- Line 28: `Command` → `rounded-xl!`
- Line 57: `CommandDialog` → `rounded-xl!`
- Line 74: inner `InputGroup` wrapping `CommandInput` → `rounded-lg!`
- Line 158: `CommandItem` → `rounded-sm` (no `!`, but `in-data-[slot=dialog-content]:rounded-lg!` *is* present)

`SFCommand` at `components/sf/sf-command.tsx:43` attempts neutralization with `cn("rounded-none border-2 border-foreground bg-background", ...)`. `cn()` (twMerge) cannot beat `!important` — twMerge dedupes Tailwind utilities at *build* time but does not synthesize `!important` to win against an existing one in the same rule. The compiled CSS will keep `border-radius: var(--radius-xl) !important` on the cmdk root inside SFCombobox's popover.

This violates the CLAUDE.md hard constraint: "DO NOT use rounded corners (zero border-radius everywhere)." Users will see a sharp 2px outer popover (from SFPopoverContent) wrapped around a rounded-xl inner Command surface, plus a rounded-lg search input.

The CommandInput visual artifact is the most user-visible: the cmdk SearchIcon wrapper InputGroup will render with `border-radius: var(--radius-lg) !important` regardless of any wrapper override.

**Fix:** Either:

1. **Edit the shadcn base** at `components/ui/command.tsx` (project precedent: shadcn base is owned, not vendored). Strip `rounded-xl!` / `rounded-lg!` / `rounded-sm` and the `in-data-[slot=dialog-content]:rounded-lg!` modifier from lines 28, 57, 74, 158. This is the canonical fix and aligns with how SFPopover/SFDialog already neutralize their bases.

2. **Override with global CSS** in `app/globals.css`:

```css
[cmdk-root], [cmdk-dialog], [data-slot="command-input-wrapper"] [data-slot="input-group"] {
  border-radius: 0 !important;
}
[cmdk-item] {
  border-radius: 0 !important;
}
```

Option 1 is preferred — the shadcn base in this project is a token surface and other SF wrappers already edit it freely.

After fix, add a visual regression in `tests/v1.10-phase72-sf-combobox.spec.ts` that opens section-1 popover and asserts `getComputedStyle([cmdk-root]).borderRadius === "0px"`.

---

### W-03: Type-narrowing via cast spam — six `(props as SFComboboxXxxProps)` casts bypass TS discriminator narrowing

**File:** `components/sf/sf-combobox.tsx:125, 128, 130, 135, 137, 140, 160, 168, 175, 179, 186`
**Issue:** The discriminated-union types are well-defined (lines 87-105), but the implementation hand-rolls narrowing with type assertions instead of using flow analysis. Example:

```tsx
const isMulti = props.multiple === true;
// ...
const isControlledSingle =
  !isMulti && (props as SFComboboxSingleProps).value !== undefined;  // cast
```

The `isMulti` boolean alias loses TS's narrowing. Compare to a properly-narrowed variant:

```tsx
if (props.multiple === true) {
  // props is SFComboboxMultiProps here — no cast needed
}
```

Why this matters: if a future engineer adds `SFComboboxBufferedProps extends SFComboboxBaseProps { multiple: "buffered" }` to support a 3rd selection mode, the boolean-flag pattern silently breaks (`isMulti = props.multiple === true` returns false for the new branch, falling through to the single-select cast which is wrong type).

**Fix:** Refactor to early returns + sub-components, or inline narrowing:

```tsx
export function SFCombobox(props: SFComboboxProps) {
  if (props.multiple === true) {
    return <SFComboboxMulti {...props} />;
  }
  return <SFComboboxSingle {...props} />;
}

function SFComboboxSingle(props: SFComboboxSingleProps) {
  // No casts — props is fully narrowed here
  const isControlled = props.value !== undefined;
  // ...
}

function SFComboboxMulti(props: SFComboboxMultiProps) {
  const isControlled = props.value !== undefined;
  // ...
}
```

This also removes the runtime branch overhead from `useState` initializers (lines 126-138), which currently allocate state for *both* branches on every render path.

---

### W-04: Chip remove `stopPropagation` runs on synthetic `click`/`keydown`, but Radix Popover dismiss listens on `pointerDown` — race-prone

**File:** `components/sf/sf-combobox.tsx:257-267`
**Issue:** The chip remove span+role=button uses:

```tsx
onClick={(e) => {
  e.stopPropagation();
  handleRemoveChip(v);
}}
onKeyDown={(e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    e.stopPropagation();
    handleRemoveChip(v);
  }
}}
```

The intent (per the docstring at line 17) is to prevent the parent button from re-opening the popover. But Radix Popover's `onPointerDownOutside` / `dismissable-layer` dismissal logic runs on `pointerdown`/`mousedown`, which fires *before* `click`. The chip is rendered *inside* the trigger button's wrapper, so `pointerDown` on the chip propagates to the trigger button before the synthetic React `click` handler ever fires.

Empirically the spec at `tests/v1.10-phase72-sf-combobox.spec.ts:202-224` passes (chip remove does not re-open popover), likely because:
- The chip is rendered in the *trigger* (closed-state element), so there's no popover to dismiss; the click bubbles to the trigger button which opens the popover, but the test uses `Escape` first and then asserts the listbox is hidden. Actually, looking more carefully, the trigger button click would re-open. The reason it doesn't trip is that the wrapping div is a `<div>`, not a `<button>` — only the `<button>` *next to* the chips is the trigger, and the chip is rendered *inside* it. `e.stopPropagation()` on the synthetic click DOES stop bubbling to the parent `<button>`'s React handlers, but the `<button>`'s NATIVE click activation (which fires PopoverTrigger) happens regardless of synthetic propagation in some browsers.

This is currently working but fragile. If Radix tightens its pointer-event handling or React's synthetic-event timing changes, the chip-click would silently re-open the popover.

**Fix:** Add `onPointerDown`/`onMouseDown` stopPropagation as well, AND restructure the DOM so the chip is *not* a descendant of the trigger button. Render chips in a sibling div:

```tsx
<div className="flex items-center border-2 border-foreground bg-background">
  {isMulti && selectedMultiValues.length > 0 && (
    <div className="flex flex-wrap gap-... px-... py-...">
      {selectedMultiValues.map(v => /* chips here */)}
    </div>
  )}
  <SFPopoverTrigger asChild>
    <button type="button" ...>
      {isMulti
        ? <span className="text-muted-foreground">{placeholder ?? "Add..."}</span>
        : <span>...</span>
      }
      <span aria-hidden>{open ? "▴" : "▾"}</span>
    </button>
  </SFPopoverTrigger>
  {hasSelection && <button ...>×</button>}
</div>
```

This eliminates the propagation race entirely (chips are no longer descendants of the trigger). It also fixes a subtle a11y concern: nesting `role="button"` chip-removers inside a `<button>` trigger is valid HTML5 (because the chip is `<span role="button">`, not a real `<button>`), but axe's `nested-interactive` heuristic could regress on a future axe-core update. The current spec confirms it passes today, but the structural fix removes the dependency on axe's specific implementation.

---

## Info

### IN-01: `multiple` prop is treated as a constant — switching at runtime silently retains stale state

**File:** `components/sf/sf-combobox.tsx:121, 126-138`
**Issue:** `useState` initializers run only on mount. The conditional initializers `useState<string | undefined>(!isMulti ? defaultValue : undefined)` and `useState<string[]>(isMulti ? defaultValue ?? [] : [])` lock to the mount-time value of `isMulti`. If a parent flips `multiple={true}` ↔ `multiple={false}` after mount, the orphaned state branch retains stale data.

**Fix:** Either (a) add `if (props.multiple !== mountedMode) throw new Error(...)` runtime guard, (b) document `multiple` as immutable in JSDoc, or (c) split into two components per W-03 fix (best — render-key change forces remount).

### IN-02: Uncontrolled→controlled transition has no warning

**File:** `components/sf/sf-combobox.tsx:124-141`
**Issue:** If a parent transitions `value` from `undefined` → defined, the component silently switches modes and may lose internal state. React itself emits a console warning for native `<input>`, but custom components must implement this manually.

**Fix:** Add a development-only effect:

```tsx
const wasControlledRef = useRef(isControlledSingle);
useEffect(() => {
  if (process.env.NODE_ENV !== "production" && wasControlledRef.current !== isControlledSingle) {
    console.warn("SFCombobox: switching between controlled and uncontrolled is not supported");
  }
  wasControlledRef.current = isControlledSingle;
}, [isControlledSingle]);
```

### IN-03: Trigger and listbox have inconsistent fallback labels

**File:** `components/sf/sf-combobox.tsx:224, 317`
**Issue:** Trigger button: `aria-label={ariaLabel ?? placeholder ?? "Select option"}`. Listbox: `label={ariaLabel ?? "Search options"}`. Both fall back to `ariaLabel` first, but to different defaults. With no `ariaLabel` and no `placeholder`, screen reader announces "Select option" → "Search options" — minor inconsistency.

**Fix:** Unify the fallback chain or compute once at the top of the function and pass to both.

### IN-04: `loading` and `options=[]` together emit no `<SFCommandEmpty>` after loading completes

**File:** `components/sf/sf-combobox.tsx:320-358`
**Issue:** When `loading={true}`, the `<>...</>` branch with `<SFCommandEmpty>` is skipped entirely. If a consumer transitions `loading: true → false` with `options: []`, there's a brief render where neither the loading indicator nor the empty state is visible (one frame). Section 4 of the playground hardcodes `loading={true}` so this state is not exercised in tests.

**Fix:** Always render `<SFCommandEmpty>`, only conditionally render the loading on top:

```tsx
<SFCommandList aria-multiselectable={isMulti ? true : undefined}>
  <SFCommandEmpty>{emptyText ?? "No results."}</SFCommandEmpty>
  {loading && <SFCommandLoading>Loading...</SFCommandLoading>}
  {!loading && (
    <>
      {/* groups + ungrouped */}
    </>
  )}
</SFCommandList>
```

### IN-05: `selectedSingleLabel` recomputes via `.find()` on every render even when value unchanged

**File:** `components/sf/sf-combobox.tsx:205-209`
**Issue:** `options.find((o) => o.value === selectedSingleValue)` runs every render, including renders triggered by unrelated state (e.g., `open` toggle). Same applies to `selectedMultiValues.map((v) => options.find(...))` at line 244. For typical option counts (< 50) this is fine, but consumers passing 1000+ options will see noticeable per-frame work on every popover toggle.

**Fix:** Wrap in `useMemo` keyed on `[options, selectedSingleValue]` / `[options, selectedMultiValues]`. Per CLAUDE.md the v1 review scope excludes performance — flagging as info for future hardening.

### IN-06: Test file uses `[role="combobox"]` to find CommandInput — will break if cmdk changes role assignment

**File:** `tests/v1.10-phase72-sf-combobox.spec.ts:51`
**Issue:** `await page.locator('[role="combobox"]').first().fill("Alp");` relies on cmdk's hardcoded `role="combobox"` on its Input. Already noted in the spec for the `[cmdk-group-heading]` adapter pattern (lines 149-151). This locator is fragile to cmdk version bumps — cmdk could move to `role="searchbox"` to align with WAI-ARIA 1.2 combobox-pattern updates.

**Fix:** Add a stable `data-testid` to `SFCommandInput` and target that:

```tsx
<SFCommandInput data-testid="sf-combobox-search" placeholder={...} />
```

Then in the spec: `page.getByTestId('sf-combobox-search').first().fill("Alp")`. This insulates from cmdk role changes.

---

_Reviewed: 2026-05-01_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
