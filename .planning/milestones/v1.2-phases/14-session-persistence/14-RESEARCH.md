# Phase 14: Session Persistence - Research

**Researched:** 2026-04-06
**Domain:** Browser sessionStorage + React SSR hydration safety + Next.js 15 App Router scroll restoration
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
None — all implementation choices are at Claude's discretion. Pure infrastructure phase.

### Claude's Discretion
All implementation choices:
- Hook API design (`useSessionState`)
- Key naming convention for sessionStorage entries
- Scroll restoration strategy (built-in vs custom hook)
- Where the hook is consumed in each component

### Deferred Ideas (OUT OF SCOPE)
None.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| STP-01 | User's active filter selection, tab state, and scroll position persist across page navigations within a session using sessionStorage (hydration-safe via useEffect pattern) | useEffect lazy-read pattern prevents hydration mismatch; three integration points identified (ComponentsExplorer filter, TokenTabs tab, /components scroll position) |
</phase_requirements>

---

## Summary

Phase 14 adds three specific session-persistence behaviors: filter state on `/components`, tab state on `/tokens`, and scroll position restoration on `/components` back-navigation. All three share the same root constraint: sessionStorage is browser-only and must never be read during server render or the initial synchronous client render pass. Violating this produces React hydration mismatches.

The canonical SSR-safe pattern — confirmed by Next.js official docs — is to initialize state with the SSR-safe default value and then read sessionStorage only inside `useEffect`. This project already uses exactly this pattern in Phase 13's `signalframe-provider.tsx` (see `useState(true)` default for `isDark`, then `useEffect` to sync from the DOM). Phase 14 follows the same discipline for a new generic hook.

Scroll restoration is the most nuanced of the three. Next.js 15 App Router manages scroll behavior on `Link`-driven navigations but does NOT automatically restore scroll position on browser back/forward (popstate). A thin custom hook that saves `scrollY` to sessionStorage on `beforeunload`/route-change events and restores it on mount after a popstate signal is the right approach — no external library needed at this scope.

**Primary recommendation:** Implement one generic `hooks/use-session-state.ts` hook (useState + useEffect pattern), consume it in `ComponentsExplorer` for filter state and `TokenTabs` for tab state, and implement a separate `hooks/use-scroll-restoration.ts` for the scroll case. Total scope: 3 files created/modified, ~100 lines.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React `useState` + `useEffect` | 19.1 (in-project) | SSR-safe state initialization | Official Next.js pattern; already used throughout project |
| Browser `sessionStorage` | Web API | Key/value storage that clears on tab close / hard reload | Exact semantics required by STP-01 |
| Next.js App Router `usePathname` | 15.3 (in-project) | Detect navigation for scroll position saves | Built-in; no extra dependency |
| Next.js App Router `useRouter` | 15.3 (in-project) | Soft-navigation detection if needed | Built-in |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `JSON.stringify` / `JSON.parse` | Web API | Serialize non-string state values | When storing Category enum or structured data |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Raw sessionStorage | `next-restore-scroll` library (npm) | Library adds ~3 kB for a 15-line hook; overkill at this scope |
| sessionStorage | `localStorage` | localStorage persists across sessions — violates STP-01 success criterion 4 (hard reload must clear state) |
| sessionStorage | URL search params | URL params would surface filter state in the address bar; undesirable UX and changes link semantics |
| sessionStorage | React Context | Context is cleared on navigation in App Router; defeats the persistence goal |

**Installation:** No new packages needed. All primitives are already in-project.

---

## Architecture Patterns

### Recommended Project Structure

```
hooks/
├── use-scramble-text.ts        # existing
├── use-signal-scene.ts         # existing
├── use-session-state.ts        # NEW — generic SSR-safe sessionStorage hook
└── use-scroll-restoration.ts   # NEW — scroll position save/restore
```

### Pattern 1: SSR-Safe sessionStorage Hook (`use-session-state.ts`)

**What:** Generic hook that mirrors `useState` but reads/writes a sessionStorage key. Server render and initial client render use the provided default value. sessionStorage is read in `useEffect` after mount — the same pattern used in `signalframe-provider.tsx`.

**When to use:** Any stateful UI value that should survive SPA navigation but clear on hard reload.

**Critical detail:** The state must be initialized with the SSR-safe default (not `undefined`), and the sessionStorage read must be inside `useEffect`. This ensures the server-rendered HTML and the initial client render agree, eliminating the hydration mismatch.

```typescript
// Source: Next.js official docs (https://nextjs.org/docs/messages/react-hydration-error)
// Pattern: Solution 1 — useEffect to run on client only

'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * SSR-safe sessionStorage hook. Mirrors useState API.
 * - Server render: always returns defaultValue
 * - After mount: reads from sessionStorage, falls back to defaultValue
 * - On change: writes to sessionStorage
 * - Hard reload: sessionStorage is cleared by the browser, so defaultValue is used again
 *
 * @param key - sessionStorage key (use a namespaced constant, e.g. 'sfux.components.filter')
 * @param defaultValue - Value used on server and on first client render
 */
export function useSessionState<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  const [state, setState] = useState<T>(defaultValue);

  // Read from sessionStorage after mount — never during server render
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(key);
      if (stored !== null) {
        setState(JSON.parse(stored) as T);
      }
    } catch {
      // sessionStorage unavailable (private browsing edge case) — silently use default
    }
  }, [key]);

  const set = useCallback(
    (value: T) => {
      setState(value);
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Quota exceeded or unavailable — state still updates in memory
      }
    },
    [key]
  );

  return [state, set];
}
```

### Pattern 2: Scroll Position Restoration (`use-scroll-restoration.ts`)

**What:** Saves `window.scrollY` to sessionStorage on route change (via `usePathname` change detection) and restores it after mount when navigating back.

**When to use:** Pages where back-navigation UX benefits from position restoration. Currently: `/components`.

**Next.js 15 behavior confirmed:** App Router does NOT automatically restore scroll on popstate for custom scroll containers or programmatic navigation sequences. A custom hook is required for this use case.

**Implementation approach:** Save `scrollY` keyed by pathname on `useEffect` cleanup (when pathname changes). Restore on mount by checking if the navigation was a popstate event — detectable via `window.history.state` or by storing a navigation type flag.

**Simpler viable approach:** Save scroll position on every scroll event (debounced) and always restore on mount if a stored position exists for the current key. Since sessionStorage clears on hard reload, stale positions are not a concern.

```typescript
// Source: Pattern derived from https://github.com/javascripter/next-scroll-restoration
// and Next.js scroll restoration discussion #26872

'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const SCROLL_KEY_PREFIX = 'sfux.scroll';

/**
 * Saves and restores scroll position for the current page using sessionStorage.
 * Call once per page that requires scroll restoration (currently: /components).
 */
export function useScrollRestoration() {
  const pathname = usePathname();
  const key = `${SCROLL_KEY_PREFIX}.${pathname}`;

  // Save scroll position when the page is about to be navigated away from
  useEffect(() => {
    const saveScroll = () => {
      try {
        sessionStorage.setItem(key, String(window.scrollY));
      } catch {
        // Ignore
      }
    };
    window.addEventListener('beforeunload', saveScroll);
    return () => {
      // Also save on SPA navigation away
      saveScroll();
      window.removeEventListener('beforeunload', saveScroll);
    };
  }, [key]);

  // Restore scroll position after mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(key);
      if (stored !== null) {
        const y = parseInt(stored, 10);
        if (!isNaN(y)) {
          // rAF ensures DOM has painted before scroll
          requestAnimationFrame(() => window.scrollTo(0, y));
        }
      }
    } catch {
      // Ignore
    }
  }, [key]);
}
```

### Pattern 3: Integration into ComponentsExplorer

**What:** Replace `useState<Category>("ALL")` with `useSessionState<Category>('sfux.components.filter', 'ALL')`.

**Current state:** `ComponentsExplorer` already uses `'use client'` and `useState`. The filter state is `activeFilter` initialized to `"ALL"`.

**Change scope:** 2 lines changed — import added, `useState` call replaced with `useSessionState`. The `handleFilter` callback already calls `setActiveFilter` — that becomes `setActiveFilter` from the new hook with identical API.

**GSAP Flip interaction:** The Flip animation captures state before filter changes via `captureFlipState()`. The sessionStorage restore happens in `useEffect` after mount (not a user click), so it will NOT trigger GSAP Flip — no flip animation will play on restore. This is correct UX: restoring a filter silently on page load should not animate.

### Pattern 4: Integration into TokenTabs

**What:** Convert `SFTabs` from `defaultValue="COLOR"` to a controlled `value` prop driven by `useSessionState`.

**Current state:** `TokenTabs` uses `<SFTabs defaultValue="COLOR">` — uncontrolled. The active tab is managed internally by Radix UI's Tabs primitive.

**Required change:** Switch to controlled mode — add `value` and `onValueChange` props. `useSessionState<string>('sfux.tokens.tab', 'COLOR')` provides the value and setter.

```typescript
// Before (uncontrolled):
<SFTabs defaultValue="COLOR">

// After (controlled with session persistence):
const [activeTab, setActiveTab] = useSessionState<string>('sfux.tokens.tab', 'COLOR');
// ...
<SFTabs value={activeTab} onValueChange={setActiveTab}>
```

**Radix Tabs controlled mode:** Radix UI `Tabs` supports both controlled (`value` + `onValueChange`) and uncontrolled (`defaultValue`) modes. Switching to controlled is standard and well-supported.

### Anti-Patterns to Avoid

- **Reading sessionStorage during render (outside useEffect):** Causes hydration mismatch. The check `typeof window !== 'undefined'` is also listed by Next.js as a hydration error cause — do not use it as a guard in render logic.
- **Using localStorage instead of sessionStorage:** Violates success criterion 4 — hard reload must clear state.
- **Storing React nodes or non-serializable values:** `JSON.stringify` will throw or produce `{}`. Only store primitive or plain-object state.
- **Separate read/write effects without stable key:** If `key` is not stable across renders, effects will re-run unnecessarily. Use module-level string constants for keys.
- **Restoring scroll synchronously:** `window.scrollTo` called synchronously in `useEffect` before paint can produce visual jank. Always wrap in `requestAnimationFrame`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Serialization | Custom serializer | `JSON.stringify` / `JSON.parse` | Sufficient for string/number/enum state; no edge cases at this scope |
| Scroll detection | IntersectionObserver-based scroll tracking | `window.scrollY` snapshot on cleanup | Simple Y-offset is all that's needed; IO tracks visibility, not position |
| Tab state management | Custom tab registry | Radix UI Tabs controlled mode | Already in-project via SFTabs; controlled mode is first-class Radix feature |

**Key insight:** The entire STP-01 requirement is addressable with two ~30-line hooks and three small integration changes. No state management library, no router-level interception, no service worker.

---

## Common Pitfalls

### Pitfall 1: Hydration Mismatch from Eager sessionStorage Read

**What goes wrong:** If sessionStorage is read before `useEffect` (e.g., as `useState` initializer argument `useState(() => sessionStorage.getItem(key))`), the server-rendered HTML shows the default and the client immediately shows the stored value. React detects the mismatch and throws.

**Why it happens:** `useState` lazy initializer runs synchronously during the component's first render — before hydration completes — so browser APIs ARE available but the server render already produced different HTML.

**How to avoid:** ALWAYS initialize with the SSR default value. Read sessionStorage only in `useEffect`.

**Warning signs:** "Hydration failed because the initial UI does not match" console error on pages that use the hook.

### Pitfall 2: GSAP Flip Triggering on Session Restore

**What goes wrong:** If the `activeFilter` restore (from sessionStorage) happens via a state update that the `useEffect` watching `[activeFilter, searchQuery]` observes, GSAP Flip may attempt to animate from the initial "ALL" layout to the restored layout.

**Why it happens:** The Flip effect in `ComponentsExplorer` triggers on `activeFilter` changes. The sessionStorage restore in `useEffect` does update `activeFilter`, which would trigger Flip.

**How to avoid:** The timing works in our favor: `useSessionState` reads sessionStorage in a `useEffect` that runs after mount. The Flip `useEffect` also runs after mount on `[activeFilter, searchQuery]` changes, but `flipStateRef.current` will be `null` at mount time (no `captureFlipState()` was called before the restore). The Flip effect guard `if (!flipStateRef.current ...) return` prevents animation. Verify this guard is in place — it is (line 385 of `components-explorer.tsx`).

### Pitfall 3: Scroll Restoration Race with Lenis

**What goes wrong:** The project uses Lenis for smooth scrolling. If Lenis initializes after `useScrollRestoration` calls `window.scrollTo`, Lenis may override the position or fight with the restoration.

**Why it happens:** Lenis intercepts scroll events and manages its own scroll position. A `window.scrollTo` call may be overridden by Lenis on its next tick.

**How to avoid:** Use `requestAnimationFrame` for the scroll restore (already in the pattern above). If Lenis is still racing, the restoration can call `lenis.scrollTo(y, { immediate: true })` via the existing Lenis instance. Check if Lenis is accessible at the restoration call site before using `window.scrollTo`.

**Warning signs:** Scroll position briefly appears correct then snaps back to 0 on page load.

### Pitfall 4: sessionStorage Key Collisions

**What goes wrong:** Two unrelated pieces of state share the same key string, overwriting each other.

**How to avoid:** Use a namespaced constant pattern. Collect all keys in one place:

```typescript
// Centralize in use-session-state.ts or a constants file
export const SESSION_KEYS = {
  COMPONENTS_FILTER: 'sfux.components.filter',
  TOKENS_TAB: 'sfux.tokens.tab',
  COMPONENTS_SCROLL: 'sfux.scroll./components',
} as const;
```

### Pitfall 5: TokenTabs `showAll` State on Color Section

**What goes wrong:** `TokenTabs` has a `showAll` boolean for the color scales section (`useState(false)`). This is separate from the tab state and does NOT need to be persisted — the user may want it to reset each visit. Do not persist this.

**How to avoid:** Only apply `useSessionState` to the active tab value (`activeTab`). Leave `showAll` as plain `useState`.

---

## Code Examples

Verified patterns from official sources:

### Full `use-session-state.ts`

```typescript
// Source: Next.js hydration docs — https://nextjs.org/docs/messages/react-hydration-error
// Pattern: useEffect-deferred browser API access (Solution 1)
'use client';

import { useState, useEffect, useCallback } from 'react';

export const SESSION_KEYS = {
  COMPONENTS_FILTER: 'sfux.components.filter',
  TOKENS_TAB:        'sfux.tokens.tab',
} as const;

export function useSessionState<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  const [state, setState] = useState<T>(defaultValue);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(key);
      if (stored !== null) {
        setState(JSON.parse(stored) as T);
      }
    } catch {
      // Private browsing or quota — use default silently
    }
  }, [key]);

  const set = useCallback(
    (value: T) => {
      setState(value);
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Quota exceeded — in-memory state still updated
      }
    },
    [key]
  );

  return [state, set];
}
```

### `ComponentsExplorer` integration (diff)

```typescript
// Add import
import { useSessionState, SESSION_KEYS } from '@/hooks/use-session-state';

// Replace inside ComponentsExplorer():
// Before:
const [activeFilter, setActiveFilter] = useState<Category>("ALL");
// After:
const [activeFilter, setActiveFilter] = useSessionState<Category>(
  SESSION_KEYS.COMPONENTS_FILTER,
  "ALL"
);
```

### `TokenTabs` integration (diff)

```typescript
// Add import
import { useSessionState, SESSION_KEYS } from '@/hooks/use-session-state';

// Add inside TokenTabs():
const [activeTab, setActiveTab] = useSessionState<string>(
  SESSION_KEYS.TOKENS_TAB,
  'COLOR'
);

// Change SFTabs:
// Before:  <SFTabs defaultValue="COLOR">
// After:   <SFTabs value={activeTab} onValueChange={setActiveTab}>
```

### `use-scroll-restoration.ts` (consume in ComponentsPage or ComponentsExplorer)

```typescript
'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const PREFIX = 'sfux.scroll';

export function useScrollRestoration() {
  const pathname = usePathname();
  const key = `${PREFIX}.${pathname}`;

  useEffect(() => {
    const save = () => {
      try { sessionStorage.setItem(key, String(window.scrollY)); } catch { /* ignore */ }
    };
    window.addEventListener('beforeunload', save);
    return () => {
      save(); // save on SPA navigation away
      window.removeEventListener('beforeunload', save);
    };
  }, [key]);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(key);
      if (stored !== null) {
        const y = parseInt(stored, 10);
        if (!isNaN(y)) requestAnimationFrame(() => window.scrollTo(0, y));
      }
    } catch { /* ignore */ }
  }, [key]);
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `next/router` scroll restoration flag | App Router manages scroll natively on Link navigations; custom hook for popstate | Next.js 13 (App Router GA) | Built-in scroll-to-top on navigation; popstate requires custom solution |
| `typeof window !== 'undefined'` guard | `useEffect` deferral | React 18+ hydration strictness | The `typeof window` check was flagged as a hydration error cause by Next.js docs |
| Uncontrolled Radix Tabs (`defaultValue`) | Controlled Tabs (`value` + `onValueChange`) | Already supported in all Radix versions | No API change needed; Radix first-class controlled mode |

**Deprecated/outdated:**
- `experimental.scrollRestoration: true` in `next.config`: This Pages Router flag does not exist in App Router. Do not add it. The project uses App Router.

---

## Open Questions

1. **Lenis vs `window.scrollTo` race**
   - What we know: Lenis intercepts scroll; project uses Lenis globally
   - What's unclear: Whether Lenis is initialized before or after `useScrollRestoration`'s restore effect fires; whether it overrides the `scrollTo` call
   - Recommendation: Implement with `window.scrollTo` + `rAF` first, test manually. If Lenis overrides, switch to `lenis.scrollTo(y, { immediate: true })` by accessing the Lenis instance from wherever it's initialized.

2. **`ComponentsExplorer` scroll target**
   - What we know: The `ComponentsExplorer` is rendered inside `ComponentsPage` which has a Lenis-managed scroll container
   - What's unclear: Whether `window.scrollY` or a custom scroll element's `scrollTop` should be captured
   - Recommendation: Start with `window.scrollY` (document scroll). If Lenis uses a custom container, check `document.querySelector('[data-lenis-scroll]')?.scrollTop`.

---

## Validation Architecture

`nyquist_validation` is not explicitly set to `false` in `.planning/config.json`, so this section is included.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — no jest.config, vitest.config, or test directories found |
| Config file | None — Wave 0 gap |
| Quick run command | N/A until framework installed |
| Full suite command | N/A |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| STP-01 (filter) | Filter state restored from sessionStorage after navigation | unit | N/A — Wave 0 gap | ❌ Wave 0 |
| STP-01 (tab) | Tab state restored from sessionStorage after navigation | unit | N/A — Wave 0 gap | ❌ Wave 0 |
| STP-01 (scroll) | Scroll position restored on back-navigation | manual-only | Manual browser test | ❌ |
| STP-01 (hard reload) | All persisted state cleared on hard reload | manual-only | Manual browser test | ❌ |
| STP-01 (no hydration) | No hydration warnings in console on any session-state page | manual-only | `pnpm dev` + browser console check | N/A |

**Manual-only justification for scroll and reload tests:** These behaviors require real browser navigation events (back button, Ctrl+R) that cannot be reliably automated without a full E2E setup (Playwright/Cypress), which is out of scope for this phase.

### Sampling Rate

- **Per task commit:** Manual browser console check for hydration warnings
- **Per wave merge:** Manual smoke test of all three persistence behaviors
- **Phase gate:** All five success criteria verified manually before `/pde:verify-work`

### Wave 0 Gaps

- [ ] `hooks/use-session-state.ts` — the hook itself (created in Wave 1, not a test gap)
- [ ] No test framework installed — STP-01 unit tests for `useSessionState` hook would require Jest + React Testing Library; deferred to a future DX phase
- [ ] Manual test checklist in VERIFY.md is sufficient for this phase given the scope

*(If a test framework becomes available, the `useSessionState` hook is straightforwardly unit-testable: mock `sessionStorage`, render with `renderHook`, assert state reads/writes.)*

---

## Sources

### Primary (HIGH confidence)
- [Next.js official docs — hydration error causes and fixes](https://nextjs.org/docs/messages/react-hydration-error) — Solution 1 (useEffect deferral) confirmed as the canonical pattern
- `lib/signalframe-provider.tsx` (in-project) — Phase 13 established identical SSR-safe pattern: `useState(true)` default + `useEffect` DOM read
- `components/blocks/components-explorer.tsx` (in-project) — filter state location, GSAP Flip guard at line 385, `useState<Category>("ALL")`
- `components/blocks/token-tabs.tsx` (in-project) — tab state uses `defaultValue="COLOR"` (uncontrolled); `showAll` state identified as not needing persistence

### Secondary (MEDIUM confidence)
- [Next.js scroll restoration discussion #26872](https://github.com/vercel/next.js/discussions/26872) — confirms App Router does not auto-restore scroll on popstate; custom solution required
- [next-scroll-restoration library README](https://github.com/javascripter/next-scroll-restoration) — confirms sessionStorage + rAF is the standard approach; pattern adapted without taking the dependency

### Tertiary (LOW confidence — for awareness only)
- Multiple blog posts (2025–2026) on Next.js hydration errors — consistent with official docs; no contradictions found

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies; all primitives in-project and well-understood
- Architecture: HIGH — useEffect deferral pattern is confirmed by Next.js official docs; integration points fully read from source
- Pitfalls: HIGH — GSAP Flip guard verified by direct source reading (line 385); Lenis race is a MEDIUM-confidence risk that requires manual verification at implementation time

**Research date:** 2026-04-06
**Valid until:** 2026-07-06 (sessionStorage Web API is stable; Next.js App Router scroll behavior would only change with a major version)
