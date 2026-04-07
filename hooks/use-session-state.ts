"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Namespaced sessionStorage keys for SignalframeUX.
 * Centralised here to prevent key collisions across the codebase.
 *
 * All keys use the `sfux.` namespace prefix.
 */
export const SESSION_KEYS = {
  COMPONENTS_FILTER: "sfux.components.filter",
  TOKENS_TAB: "sfux.tokens.tab",
  DETAIL_OPEN: "sfux.detail.open",
} as const;

/**
 * SSR-safe sessionStorage hook. Mirrors the `useState` API.
 *
 * SSR contract:
 * - Server render: always returns `defaultValue` (no browser APIs accessed).
 * - Initial client render: also returns `defaultValue` — matches server HTML, no hydration mismatch.
 * - After mount: reads from sessionStorage and updates state if a stored value exists.
 * - On state change: writes the new value to sessionStorage.
 * - Hard reload: sessionStorage is cleared by the browser automatically, so `defaultValue` is used again.
 *
 * sessionStorage failures (private browsing, quota exceeded) are caught silently —
 * state still updates in memory so the UI remains functional.
 *
 * @param key - sessionStorage key (use a constant from SESSION_KEYS)
 * @param defaultValue - Value used on server and on first client render
 *
 * @example
 * const [activeFilter, setActiveFilter] = useSessionState<Category>(
 *   SESSION_KEYS.COMPONENTS_FILTER,
 *   "ALL"
 * );
 */
export function useSessionState<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  // Initialize with defaultValue — SSR-safe: no sessionStorage read here
  const [state, setState] = useState<T>(defaultValue);

  // Read from sessionStorage after mount — never during server render or initial hydration pass
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(key);
      if (stored !== null) {
        setState(JSON.parse(stored) as T);
      }
    } catch {
      // sessionStorage unavailable (private browsing) or JSON.parse failed — silently use default
    }
  }, [key]);

  const set = useCallback(
    (value: T) => {
      setState(value);
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Quota exceeded or unavailable — in-memory state still updated
      }
    },
    [key]
  );

  return [state, set];
}
