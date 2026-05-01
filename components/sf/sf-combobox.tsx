"use client";

/**
 * Selection input with type-ahead filter — FRAME layer composition primitive.
 *
 * Pattern C: pure SF composition over cmdk + Radix Popover. Zero new
 * runtime deps — cmdk is already in next.config.ts optimizePackageImports
 * (D-04 lock; do NOT add packages). SFCommand* is imported DIRECTLY from
 * @/components/sf/sf-command (NEVER via the @/components/sf barrel) per
 * the cmdk barrel-exclusion contract documented at sf/index.ts:70-73.
 *
 * Single-select API in v0.1 (CB-01 + CB-02). Multi-select via `multiple`
 * prop ships in Plan 02 (CB-03).
 *
 * ANTI-PATTERN: SFInput as PopoverTrigger asChild — produces conflicting
 * aria-expanded + role="combobox" + aria-haspopup. Use a plain <button>
 * as trigger; CommandInput lives inside PopoverContent. See
 * 72-RESEARCH.md §ARIA Conflict Analysis.
 *
 * ANTI-PATTERN: raw-HTML option rendering — option labels render via
 * React text-node escaping; pass plain strings, do not bypass.
 *
 * @example
 * <SFCombobox
 *   options={[{ value: "a", label: "Apple" }, { value: "b", label: "Banana" }]}
 *   defaultValue="a"
 *   onChange={(v) => console.log("selected", v)}
 *   placeholder="Pick fruit"
 * />
 */
import { useMemo, useState } from "react";
import {
  SFPopover,
  SFPopoverTrigger,
  SFPopoverContent,
} from "@/components/sf";
// SFCommand* are NOT in the @/components/sf barrel (cmdk barrel-exclusion,
// see components/sf/index.ts:70-73). Import directly.
import {
  SFCommand,
  SFCommandInput,
  SFCommandList,
  SFCommandEmpty,
  SFCommandGroup,
  SFCommandItem,
  SFCommandLoading,
} from "@/components/sf/sf-command";
import { cn } from "@/lib/utils";

export type SFComboboxOption = {
  value: string;        // unique key — used by cmdk for filtering + item identity
  label: string;        // display text rendered inside SFCommandItem
  group?: string;       // optional group heading key (CB-02)
  disabled?: boolean;   // mark option as non-selectable
};

export interface SFComboboxBaseProps {
  options: SFComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  /** Accessible label for the listbox; passed to SFCommand `label` prop. */
  ariaLabel?: string;
}

export interface SFComboboxSingleProps extends SFComboboxBaseProps {
  multiple?: false;
  value?: string;                              // controlled
  defaultValue?: string;                       // uncontrolled
  onChange?: (value: string | undefined) => void;
}

// Multi-select declared here for Plan 02 wiring; the implementation in
// Plan 02 narrows on `multiple === true`. The discriminated union shape
// is committed now so consumers can adopt the API even though the
// multi branch warns at runtime in Plan 01.
export interface SFComboboxMultiProps extends SFComboboxBaseProps {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
}

export type SFComboboxProps = SFComboboxSingleProps | SFComboboxMultiProps;

export function SFCombobox(props: SFComboboxProps) {
  const {
    options,
    placeholder,
    searchPlaceholder,
    emptyText,
    disabled,
    loading,
    className,
    ariaLabel,
  } = props;

  // Single-select state (Plan 01 scope). Multi branch falls back here with a warning.
  const isMulti = props.multiple === true;
  const isControlled =
    !isMulti && (props as SFComboboxSingleProps).value !== undefined;
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | undefined>(
    !isMulti ? (props as SFComboboxSingleProps).defaultValue : undefined
  );

  const selectedValue: string | undefined = isControlled
    ? (props as SFComboboxSingleProps).value
    : internalValue;

  // Plan 01 multi-select fallback (Plan 02 replaces this entire branch).
  if (isMulti && process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.warn(
      "SFCombobox: multi-select (multiple=true) is a Plan 02 extension; " +
        "Plan 01 falls back to single-select. See 72-RESEARCH.md."
    );
  }

  const handleSelect = (itemValue: string) => {
    const next = itemValue === selectedValue ? undefined : itemValue;
    if (!isControlled) setInternalValue(next);
    (props as SFComboboxSingleProps).onChange?.(next);
    setOpen(false); // single-select closes on select
  };

  const handleClear = () => {
    if (!isControlled) setInternalValue(undefined);
    (props as SFComboboxSingleProps).onChange?.(undefined);
  };

  // Group options for CB-02 grouping support.
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

  const selectedLabel = selectedValue
    ? options.find((o) => o.value === selectedValue)?.label ?? selectedValue
    : undefined;

  const hasSelection = selectedValue !== undefined;

  return (
    <SFPopover open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          "flex items-center border-2 border-foreground bg-background",
          disabled && "opacity-50 pointer-events-none",
          className
        )}
      >
        <SFPopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            aria-label={ariaLabel ?? placeholder ?? "Select option"}
            className={cn(
              "sf-focusable sf-pressable",
              "flex-1 flex items-center justify-between",
              "px-[var(--sfx-space-3)] py-[var(--sfx-space-2)]",
              "font-mono uppercase tracking-wider text-xs",
              "bg-transparent text-foreground",
              "cursor-pointer",
              "data-[state=open]:bg-foreground data-[state=open]:text-background"
            )}
          >
            <span
              className={cn(
                "truncate",
                !hasSelection && "text-muted-foreground"
              )}
            >
              {selectedLabel ?? placeholder ?? "Select..."}
            </span>
            <span
              aria-hidden="true"
              className="ml-[var(--sfx-space-2)] font-mono text-xs"
            >
              {open ? "\u25B4" : "\u25BE"}
            </span>
          </button>
        </SFPopoverTrigger>
        {hasSelection && !disabled && (
          <button
            type="button"
            aria-label="Clear selection"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className={cn(
              "sf-focusable",
              "px-[var(--sfx-space-3)] py-[var(--sfx-space-2)]",
              "border-l-2 border-foreground",
              "font-mono uppercase tracking-wider text-xs",
              "text-foreground hover:bg-foreground hover:text-background",
              "cursor-pointer"
            )}
          >
            {"\u00D7"}
          </button>
        )}
      </div>
      <SFPopoverContent className="p-0 w-[var(--radix-popover-trigger-width)] min-w-[240px]">
        <SFCommand label={ariaLabel ?? "Search options"} loop>
          <SFCommandInput placeholder={searchPlaceholder ?? "Search..."} />
          <SFCommandList>
            {loading ? (
              <SFCommandLoading>Loading...</SFCommandLoading>
            ) : (
              <>
                <SFCommandEmpty>{emptyText ?? "No results."}</SFCommandEmpty>
                {Array.from(grouped.groups.entries()).map(
                  ([groupKey, items]) => (
                    <SFCommandGroup key={groupKey} heading={groupKey}>
                      {items.map((opt) => (
                        <SFCommandItem
                          key={opt.value}
                          value={opt.value}
                          disabled={opt.disabled}
                          onSelect={handleSelect}
                          aria-selected={opt.value === selectedValue}
                        >
                          {opt.label}
                        </SFCommandItem>
                      ))}
                    </SFCommandGroup>
                  )
                )}
                {grouped.ungrouped.length > 0 && (
                  <SFCommandGroup>
                    {grouped.ungrouped.map((opt) => (
                      <SFCommandItem
                        key={opt.value}
                        value={opt.value}
                        disabled={opt.disabled}
                        onSelect={handleSelect}
                        aria-selected={opt.value === selectedValue}
                      >
                        {opt.label}
                      </SFCommandItem>
                    ))}
                  </SFCommandGroup>
                )}
              </>
            )}
          </SFCommandList>
        </SFCommand>
      </SFPopoverContent>
    </SFPopover>
  );
}

// -----------------------------------------------------------------------
// Pattern C contract reminder (CB-04):
//   - SFCombobox IS exported from components/sf/index.ts barrel
//   - SFCommand* (SFCommand, SFCommandInput, SFCommandList, SFCommandEmpty,
//     SFCommandGroup, SFCommandItem, SFCommandLoading) MUST NEVER be added
//     to components/sf/index.ts (cmdk barrel-exclusion; see index.ts:70-73)
//   - Zero new runtime npm deps; cmdk + @radix-ui/react-popover already in
//     bundle via next.config.ts optimizePackageImports (D-04 lock)
//   - Active-state styling routes through `--sfx-primary-foreground` /
//     `--sfx-primary-on-dark` pair-slot tokens (Cluster-C policy);
//     SFCommandItem default `data-selected:bg-foreground
//     data-selected:text-background` satisfies this — DO NOT hardcode magenta
// -----------------------------------------------------------------------
