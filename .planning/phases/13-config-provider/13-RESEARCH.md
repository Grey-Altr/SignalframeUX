# Phase 13: Config Provider - Research

**Researched:** 2026-04-06
**Domain:** React Context factory pattern, SSR-safe provider, GSAP global motion control, Next.js App Router Server/Client boundaries
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
None — all implementation choices are at Claude's discretion. This is a pure infrastructure phase.

### Claude's Discretion
All implementation choices. Phase boundary is fixed:
- Create `createSignalframeUX(config)` factory returning `{ SignalframeProvider, useSignalframe }`
- SSR-safe, type-checked config
- Global motion control via `motion.pause()` / `motion.resume()`
- Layout primitives MUST remain Server Components

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DX-05 | `createSignalframeUX(config)` factory returns `{SignalframeProvider, useSignalframe}` using hole-in-the-donut SSR pattern; config accepts theme, animation, and signal parameters | Architecture pattern documented in full below; all open questions from DX-SPEC.md resolved with codebase evidence |
</phase_requirements>

---

## Summary

Phase 13 implements the DX-05 config provider — the programmatic API surface for SignalframeUX. The core deliverable is `createSignalframeUX(config)` in a new `lib/signalframe-provider.tsx` that returns `{ SignalframeProvider, useSignalframe }`. This is a thin React context wrapper over existing infrastructure: it wraps `lib/theme.ts` (toggleTheme singleton), reads `gsap.globalTimeline` for motion control, and syncs `prefers-reduced-motion` from the window `matchMedia`. None of the existing providers or layout primitives change.

The central architecture constraint is the Next.js App Router "hole in the donut" pattern. The provider is a `'use client'` file. Layout.tsx (a Server Component) imports and renders the provider with `{children}` — and because `children` are passed as props rather than imported into the client module, they remain Server Components. Layout primitives (`SFSection`, `SFContainer`, etc.) must never call `useSignalframe()` because doing so would force them to become Client Components.

All five open questions from DX-SPEC.md have concrete resolutions based on the existing codebase: (1) provider wraps the singleton, does not replace it; (2) no OKLCH token resolution in the hook — that stays in `resolveColorToken` as a separate util; (3) motion scope is global GSAP timeline only; (4) theme init reads DOM classList (not localStorage directly) to match the inline blocking script behavior; (5) the DX-SPEC.md `tokens` field on `UseSignalframeReturn` is dropped for v1.2 — it requires client-only canvas probes and would cause hydration mismatches.

**Primary recommendation:** Create `lib/signalframe-provider.tsx` as a single file containing the context, factory, provider component, and hook. Mount the returned `SignalframeProvider` in `app/layout.tsx` alongside the existing `LenisProvider`/`TooltipProvider`. Keep the file under 100 lines — this is thin infrastructure, not a framework.

---

## Standard Stack

### Core (already in project)

| Library | Version | Purpose | Role in Phase 13 |
|---------|---------|---------|-----------------|
| React | 19.1 | `createContext`, `useContext`, `useState`, `useEffect` | Context factory implementation |
| GSAP | 3.12 | `gsap.globalTimeline.pause()` / `.resume()` | Motion controller implementation |
| TypeScript | 5.8 | Config type, hook return type, strict null checks | Type-safe config interface |
| Next.js | 15.3 | App Router SSR boundary rules | Constrains where provider can mount |

### No New Dependencies

This phase installs nothing. All required APIs are already present in the project.

**Installation:**
```bash
# Nothing to install — uses existing React, GSAP, TypeScript, Next.js
```

---

## Architecture Patterns

### Recommended File Structure

```
lib/
└── signalframe-provider.tsx    # NEW — factory, context, provider, hook (single file)

app/
└── layout.tsx                  # MODIFIED — mount SignalframeProvider alongside LenisProvider
```

No other files change for this phase.

### Pattern 1: Hole in the Donut (MANDATORY for App Router)

**What:** A `'use client'` Provider component that accepts `children: React.ReactNode`. Server Component layouts can pass their server-rendered children into it. The children do NOT become Client Components because they are passed as props, not imported into the client module.

**When to use:** Any React context provider that must live at the app root in Next.js App Router.

**Example:**
```tsx
// lib/signalframe-provider.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import gsap from 'gsap';
import { toggleTheme } from '@/lib/theme';

// --- Types ---

export interface SignalframeUXConfig {
  defaultTheme?: 'light' | 'dark' | 'system';
  motionPreference?: 'full' | 'reduced' | 'system';
}

interface SignalframeMotionController {
  pause: () => void;
  resume: () => void;
  prefersReduced: boolean;
}

interface UseSignalframeReturn {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  motion: SignalframeMotionController;
}

// --- Context ---

const SignalframeContext = createContext<UseSignalframeReturn | null>(null);

// --- Factory ---

export function createSignalframeUX(config: SignalframeUXConfig = {}) {
  function SignalframeProvider({ children }: { children: React.ReactNode }) {
    // Theme: read DOM classList as source of truth — matches inline blocking script
    const [isDark, setIsDark] = useState(() => {
      if (typeof window === 'undefined') return true; // SSR default: dark
      return document.documentElement.classList.contains('dark');
    });

    // Motion: track prefers-reduced-motion
    const [prefersReduced, setPrefersReduced] = useState(() => {
      if (typeof window === 'undefined') return false;
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    });

    useEffect(() => {
      // Respect config.motionPreference override
      if (config.motionPreference === 'reduced') {
        gsap.globalTimeline.timeScale(0);
        setPrefersReduced(true);
        return;
      }
      if (config.motionPreference === 'full') {
        gsap.globalTimeline.timeScale(1);
        setPrefersReduced(false);
        return;
      }
      // Default: system preference (mirrors initReducedMotion in gsap-plugins.ts)
      const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
      const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    }, []);

    const setTheme = (next: 'light' | 'dark') => {
      const currentDark = document.documentElement.classList.contains('dark');
      const wantDark = next === 'dark';
      if (currentDark !== wantDark) {
        const result = toggleTheme(currentDark);
        setIsDark(result);
      }
    };

    const motion: SignalframeMotionController = {
      pause: () => gsap.globalTimeline.pause(),
      resume: () => gsap.globalTimeline.resume(),
      prefersReduced,
    };

    const value: UseSignalframeReturn = {
      theme: isDark ? 'dark' : 'light',
      setTheme,
      motion,
    };

    return (
      <SignalframeContext.Provider value={value}>
        {children}
      </SignalframeContext.Provider>
    );
  }

  function useSignalframe(): UseSignalframeReturn {
    const ctx = useContext(SignalframeContext);
    if (ctx === null) {
      throw new Error(
        '[SignalframeUX] useSignalframe() must be called inside a <SignalframeProvider>. ' +
        'Wrap your app root with createSignalframeUX(config).'
      );
    }
    return ctx;
  }

  return { SignalframeProvider, useSignalframe };
}
```

**Usage in `app/layout.tsx` (Server Component):**
```tsx
// app/layout.tsx — Server Component (no 'use client')
import { createSignalframeUX } from '@/lib/signalframe-provider';

const { SignalframeProvider } = createSignalframeUX({ defaultTheme: 'dark' });

export default async function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <TooltipProvider>
          <LenisProvider>
            <SignalframeProvider>
              {children}  {/* children remain Server Components */}
            </SignalframeProvider>
          </LenisProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
```

### Pattern 2: DOM classList as Theme Source of Truth

**What:** The existing inline blocking `<script>` in `layout.tsx` reads `localStorage('sf-theme')` and sets `document.documentElement.classList`. It fires before React hydrates. The provider must read the DOM class (not localStorage) to get the settled theme state.

**Why:** Reading localStorage in `useState` initializer during SSR returns nothing (window undefined), so the server renders `isDark: true` (dark default). On the client, the inline script has already set the correct class before React mounts. Reading the DOM class in the lazy `useState` initializer fires only on the client where the class is already correct — zero hydration mismatch.

**Example:**
```tsx
// Correct: reads DOM (already set by inline script)
const [isDark, setIsDark] = useState(() => {
  if (typeof window === 'undefined') return true;
  return document.documentElement.classList.contains('dark');
});

// Wrong: reads localStorage directly (same value, but triggers hydration mismatch in strict mode)
const [isDark, setIsDark] = useState(() => {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem('sf-theme') === 'dark';
});
```

### Pattern 3: GSAP Global Timeline Motion Control

**What:** `gsap.globalTimeline.pause()` / `.resume()` halt/restart every active GSAP tween globally. This is already used by `initReducedMotion()` in `gsap-plugins.ts` via `timeScale(0)`. The motion controller uses `pause()` / `resume()` directly (binary stop/start) rather than `timeScale` (rate-based).

**Note:** `motion.pause()` and `motion.resume()` in `useSignalframe()` must NOT conflict with the `initReducedMotion` `timeScale(0)` behavior. Calling `motion.resume()` when `prefers-reduced-motion` is active would incorrectly un-mute animation. The implementation should guard against this:

```tsx
resume: () => {
  // Only resume if reduced-motion is not active
  if (!prefersReduced) {
    gsap.globalTimeline.resume();
  }
},
```

### Anti-Patterns to Avoid

- **Context infection:** Importing `useSignalframe()` in `SFSection`, `SFContainer`, or any layout primitive. These are Server Components. Any call to `useContext` forces the file to become a Client Component and adds it to the bundle. Layout primitives get their tokens from CSS custom properties, not React context.
- **Replacing `lib/theme.ts`:** The factory should wrap `toggleTheme` from `lib/theme.ts`, not duplicate its logic. `DarkModeToggle` and `CommandPalette` both import `toggleTheme` directly — those callers must not break.
- **Token resolution in hook:** `useSignalframe()` must NOT return resolved OKLCH token values (no `tokens.colorPrimary`). Color resolution requires a client-only canvas probe via `resolveColorToken` in `lib/color-resolve.ts`. Consumers call that utility directly when needed.
- **Exporting a pre-configured singleton:** `createSignalframeUX` returns fresh instances per call. Exporting a pre-built `{ SignalframeProvider, useSignalframe }` at module level would be a footgun for multi-instance setups (e.g., Storybook). The factory pattern is intentional.
- **Non-serializable config values:** The `config` object passed to `createSignalframeUX` must contain only serializable values (strings, booleans, numbers). No callback functions — these cross the server boundary when layout.tsx (Server Component) invokes the factory during render.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Theme toggle | Custom classList toggler | `toggleTheme` from `lib/theme.ts` | Already handles FOUC suppression (sf-no-transition), localStorage write, rAF double-frame, classList toggle |
| Reduced motion detection | Custom MQL setup | Pattern from `initReducedMotion` in `lib/gsap-plugins.ts` | Same matchMedia key, already established in codebase |
| Global animation pause | Custom loop counter / tween registry | `gsap.globalTimeline.pause()` / `.resume()` | GSAP's globalTimeline is the single source of truth for all tweens |
| SSR theme default | Server-side cookie read | `suppressHydrationWarning` on `<html>` + inline blocking script | Already in layout.tsx; don't add a second mechanism |

---

## Common Pitfalls

### Pitfall 1: Provider Placement Causes Context Infection

**What goes wrong:** Wrapping `{children}` in a `'use client'` provider at the layout level can contaminate the Server Component tree if done incorrectly — specifically, if the provider file imports any Server-only modules or if layout primitives import from the provider file.

**Why it happens:** App Router's rule: any file with `'use client'` at the top becomes a Client Component boundary. Imports WITHIN that file become client imports. But `children` passed as props from outside remain server-rendered.

**How to avoid:** The provider file (`lib/signalframe-provider.tsx`) must only import client-compatible modules. The layout.tsx calls `createSignalframeUX()` and uses the returned `SignalframeProvider` — that is fine because the factory call happens at module scope (outside JSX), not inside a Server Component render function.

**Warning signs:** Bundle analyzer shows `sf-section`, `sf-container` in the client JS chunk after provider is mounted.

### Pitfall 2: `motion.resume()` Overrides Reduced-Motion System Setting

**What goes wrong:** A consumer calls `motion.resume()` programmatically. If `prefers-reduced-motion` is active, `initReducedMotion` has set `gsap.globalTimeline.timeScale(0)`. `resume()` on a paused timeline does not restore timeScale — but the intent of a programmatic resume could conflict with accessibility guarantees.

**How to avoid:** Guard `resume()` with `prefersReduced` state check. If `prefersReduced` is true, `resume()` is a no-op. Document this behavior in JSDoc on the returned `motion` object.

### Pitfall 3: Double Theme Init (Provider + Inline Script)

**What goes wrong:** The provider's `useState` initializer runs on the client AFTER the inline blocking script has already set the correct theme class. If the initializer reads something that produces a different value (e.g., reads `localStorage` and gets `null` on first visit), it would set `isDark: false` (light), overriding the script's correct `isDark: true` (dark default).

**How to avoid:** Read `document.documentElement.classList.contains('dark')` — not localStorage. The class IS the truth after the blocking script fires. The `defaultTheme` config option affects only the inline script logic (which is static in layout.tsx), not the provider's runtime behavior.

### Pitfall 4: Factory Called at Module Scope in layout.tsx Creates Stale Closure

**What goes wrong:** If `createSignalframeUX(config)` is called at module scope in `layout.tsx` (e.g., `const { SignalframeProvider } = createSignalframeUX(...)` at the top of the file), the closure captures `config` permanently. This is correct and intentional — config is static at app initialization. However, if any config value were derived from request-time data (e.g., headers), calling the factory at module scope would share state across requests (server singleton problem).

**How to avoid:** Config values must be static constants — never derived from `headers()`, `cookies()`, or other request-time APIs. `layout.tsx` already uses `async function RootLayout` and `await headers()` for the CSP nonce — do not pass any of that data through `createSignalframeUX`. The factory is for static app-level config only.

---

## Code Examples

### Complete `lib/signalframe-provider.tsx`

```tsx
// Source: DX-SPEC.md interface sketch + codebase evidence (lib/theme.ts, lib/gsap-plugins.ts)
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import gsap from 'gsap';
import { toggleTheme } from '@/lib/theme';

export interface SignalframeUXConfig {
  /** Default theme for first visit (before localStorage is set). Default: 'dark' */
  defaultTheme?: 'light' | 'dark' | 'system';
  /** Override system motion preference. Default: 'system' */
  motionPreference?: 'full' | 'reduced' | 'system';
}

interface SignalframeMotionController {
  /** Pause all active GSAP timelines globally */
  pause: () => void;
  /** Resume all active GSAP timelines globally (no-op if prefers-reduced-motion is active) */
  resume: () => void;
  /** Whether the OS prefers reduced motion */
  prefersReduced: boolean;
}

export interface UseSignalframeReturn {
  /** Current resolved theme */
  theme: 'light' | 'dark';
  /** Set theme imperatively — hard-cut switch (DU-style, no transition) */
  setTheme: (theme: 'light' | 'dark') => void;
  /** Global GSAP motion controller */
  motion: SignalframeMotionController;
}

const SignalframeContext = createContext<UseSignalframeReturn | null>(null);

export function createSignalframeUX(config: SignalframeUXConfig = {}) {
  function SignalframeProvider({ children }: { children: React.ReactNode }) {
    const [isDark, setIsDark] = useState<boolean>(() => {
      if (typeof window === 'undefined') return true;
      return document.documentElement.classList.contains('dark');
    });

    const [prefersReduced, setPrefersReduced] = useState<boolean>(() => {
      if (typeof window === 'undefined') return false;
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    });

    useEffect(() => {
      if (config.motionPreference === 'reduced') {
        gsap.globalTimeline.timeScale(0);
        setPrefersReduced(true);
        return;
      }
      if (config.motionPreference === 'full') {
        gsap.globalTimeline.timeScale(1);
        setPrefersReduced(false);
        return;
      }
      const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
      const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    }, []);

    const setTheme = (next: 'light' | 'dark') => {
      const currentDark = document.documentElement.classList.contains('dark');
      const wantDark = next === 'dark';
      if (currentDark !== wantDark) {
        setIsDark(toggleTheme(currentDark));
      }
    };

    const value: UseSignalframeReturn = {
      theme: isDark ? 'dark' : 'light',
      setTheme,
      motion: {
        pause: () => gsap.globalTimeline.pause(),
        resume: () => {
          if (!prefersReduced) gsap.globalTimeline.resume();
        },
        prefersReduced,
      },
    };

    return (
      <SignalframeContext.Provider value={value}>
        {children}
      </SignalframeContext.Provider>
    );
  }

  function useSignalframe(): UseSignalframeReturn {
    const ctx = useContext(SignalframeContext);
    if (ctx === null) {
      throw new Error(
        '[SignalframeUX] useSignalframe() must be called inside a <SignalframeProvider>. ' +
          'Wrap your app root with createSignalframeUX(config) and mount the returned SignalframeProvider.'
      );
    }
    return ctx;
  }

  return { SignalframeProvider, useSignalframe };
}
```

### Mounting in `app/layout.tsx`

```tsx
// app/layout.tsx additions — Server Component, no 'use client'
import { createSignalframeUX } from '@/lib/signalframe-provider';

const { SignalframeProvider } = createSignalframeUX({ defaultTheme: 'dark' });

// Inside RootLayout JSX:
<TooltipProvider>
  <LenisProvider>
    <SignalframeProvider>
      {children}
    </SignalframeProvider>
  </LenisProvider>
</TooltipProvider>
```

### Consumer Usage (Client Component only)

```tsx
'use client';
import { useSignalframe } from '@/lib/signalframe-provider';
// OR if consuming the returned hook from a specific instance:
// const { useSignalframe } = createSignalframeUX(...);

export function ThemeToggle() {
  const { theme, setTheme, motion } = useSignalframe();

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme}
    </button>
  );
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Global singleton `toggleTheme` only | Factory-pattern context wrapping the singleton | Phase 13 (now) | External consumers get typed API; internal callers unchanged |
| No motion control API | `motion.pause()` / `motion.resume()` via `gsap.globalTimeline` | Phase 13 (now) | Programmatic global animation control |
| No `prefers-reduced-motion` in React state | `prefersReduced` in context | Phase 13 (now) | Consumers can conditionally render based on motion pref |

**No breaking changes:** `lib/theme.ts` is unchanged. All existing `toggleTheme` callers (`DarkModeToggle`, `CommandPalette`) continue to work as-is.

---

## Open Questions

1. **`useSignalframe` export strategy**
   - What we know: The factory returns `useSignalframe`. Consumer components would need to either import the pre-built instance from the app's layout, or call `createSignalframeUX` themselves (getting a different context).
   - What's unclear: The cleanest pattern for a design system is to also export a standalone `useSignalframe` tied to a default context instance — so consumers don't need to thread the hook through their app.
   - Recommendation: Export a default `useSignalframe` that reads from a shared `SignalframeContext` directly. The factory pattern still creates the provider; the exported `useSignalframe` reads the same context. This is the pattern used by Radix Themes and shadcn/ui — one context, one hook, one provider.

2. **`defaultTheme: 'system'` handling**
   - What we know: The inline blocking script already handles `'system'` (reads `prefers-color-scheme`). The provider's `useState` reads the DOM class after the script runs — so `'system'` resolves correctly.
   - What's unclear: Whether the `defaultTheme` config option needs to do anything at runtime, or just serves as documentation of intent.
   - Recommendation: `defaultTheme` in the config is effectively metadata in v1.2. The inline script in `layout.tsx` is the actual defaultTheme implementer. Document this in JSDoc.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected in project |
| Config file | None — Wave 0 gap |
| Quick run command | `pnpm tsc --noEmit` (type check only) |
| Full suite command | `pnpm build` (full Next.js build + type check) |

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DX-05-1 | `createSignalframeUX(config)` returns `{ SignalframeProvider, useSignalframe }` importable in layout | Type check | `pnpm tsc --noEmit` | Wave 0 |
| DX-05-2 | `useSignalframe()` outside provider throws descriptive error | Manual / unit | Browser console test | Wave 0 |
| DX-05-3 | SSR produces stable HTML — no hydration mismatch in browser console | Manual smoke | `pnpm dev` + browser console check | Wave 0 |
| DX-05-4 | Layout primitives remain Server Components after provider mounts | Build artifact | `pnpm build` + bundle analyzer | Wave 0 |
| DX-05-5 | `motion.pause()` and `motion.resume()` halt/restart GSAP animations globally | Manual smoke | `pnpm dev` + browser console call | Wave 0 |

### Sampling Rate

- **Per task commit:** `pnpm tsc --noEmit`
- **Per wave merge:** `pnpm build`
- **Phase gate:** `pnpm build` clean + manual smoke of all 5 success criteria before `/pde:verify-work`

### Wave 0 Gaps

- [ ] No automated test framework configured — all DX-05 verification is manual smoke + TypeScript
- [ ] `pnpm build` is the primary gate — catches bundle boundary violations and type errors
- [ ] Manual checklist required for hydration mismatch verification (browser console during `pnpm dev`)

---

## Sources

### Primary (HIGH confidence)

- `lib/theme.ts` — `toggleTheme` signature and localStorage key confirmed (`sf-theme`)
- `lib/gsap-plugins.ts` — `initReducedMotion` pattern confirmed; `gsap.globalTimeline.timeScale(0)` is the reduced-motion implementation
- `app/layout.tsx` — inline blocking script confirmed, `suppressHydrationWarning` on `<html>` confirmed, existing provider mounting pattern (LenisProvider, TooltipProvider) confirmed
- `components/layout/lenis-provider.tsx` — `{children}: { children: React.ReactNode }` hole-in-the-donut pattern confirmed as established project convention
- `.planning/DX-SPEC.md` — interface sketch for DX-05 with all open questions documented
- `.planning/research/ARCHITECTURE.md` — resolved open questions for DX-05 (provider wraps singleton, no token resolution, global GSAP scope)
- `.planning/research/PITFALLS.md` — Pitfall 3 (context infection), Pitfall 9 (missing error message) documented with prevention patterns

### Secondary (MEDIUM confidence)

- Next.js App Router Server/Client boundary documentation — "hole in the donut" pattern (children as props stay server-rendered) is established App Router canon, consistent with existing `LenisProvider` usage in this project

### Tertiary (LOW confidence)

- None — all critical claims verified against actual codebase files

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies; all libraries already in project
- Architecture: HIGH — hole-in-the-donut pattern verified from existing `LenisProvider`; GSAP globalTimeline control verified from `gsap-plugins.ts`; theme init pattern verified from `layout.tsx` inline script + `lib/theme.ts`
- Pitfalls: HIGH — all pitfalls derived from reading actual codebase files, not hypothetical

**Research date:** 2026-04-06
**Valid until:** 2026-05-06 (stable stack — Next.js, GSAP, React versions locked)
