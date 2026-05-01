import { useEffect, useState } from "react";

/**
 * Returns a debounced copy of `value`, updated `delay` ms after the last change.
 * Used by SFDataTable filter inputs to avoid setColumnFilters on every keystroke.
 *
 * Built in-house to avoid a runtime dep on third-party debounce libraries —
 * a 10-LOC primitive does not justify a second `_dep_X_decision` ratification.
 *
 * @param value - The value to debounce
 * @param delay - Debounce window in ms (default 300, per DT-02 lock)
 *
 * @example
 * const [raw, setRaw] = useState("");
 * const debounced = useDebouncedValue(raw, 300);
 * useEffect(() => {
 *   table.setColumnFilters([{ id: "name", value: debounced }]);
 * }, [debounced]);
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
