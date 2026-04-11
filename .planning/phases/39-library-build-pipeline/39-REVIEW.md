---
phase: 39-library-build-pipeline
reviewed: 2026-04-10T00:00:00Z
depth: standard
files_reviewed: 9
files_reviewed_list:
  - lib/entry-animation.ts
  - lib/entry-core.ts
  - lib/entry-webgl.ts
  - lib/signalframe-provider.tsx
  - lib/tokens.css
  - package.json
  - scripts/verify-tree-shake.ts
  - tsconfig.build.json
  - tsup.config.ts
findings:
  critical: 2
  warning: 4
  info: 4
  total: 10
status: issues_found
---

# Phase 39: Code Review Report

**Reviewed:** 2026-04-10T00:00:00Z
**Depth:** standard
**Files Reviewed:** 9
**Status:** issues_found

## Summary

This phase establishes the library build pipeline: three entry points (core, animation, webgl), a tsup config, a build tsconfig, a tree-shake verification script, the design token CSS, and the provider factory. The architecture is sound — the three-entry split correctly isolates optional peer dependencies. The critical issues are a dependency-declaration mismatch that will cause builds to fail in consumer projects, and a race condition / stale-closure bug in the provider's motion controller. Four warnings cover a missing `setTheme` no-op guard, an unhandled floating Promise in `setTheme`, a verification script path-resolution fragility, and a `splitting: false` constraint that partially undermines the declared `treeshake: true` intent. Info items call out `next` in `peerDependencies`, unused `@types/three` placement, a missing CSS export alias in `exports`, and a redundant standalone export of `useSignalframe`.

---

## Critical Issues

### CR-01: `gsap` and `three` are in `dependencies`, not `peerDependencies` — they will be bundled into consumers

**File:** `package.json:79-80`
**Issue:** `gsap: "^3.12.7"` and `three: "^0.183.2"` appear in `dependencies` alongside the correct entries in `peerDependencies` (lines 58, 62). npm/pnpm treat `dependencies` as install-time resolved packages. When a consumer installs `signalframeux`, their package manager will install these packages unconditionally into their own `node_modules`, regardless of whether they use the animation or webgl entry points. This directly contradicts the declared intent (D-07 in comments: "GSAP is an optional peer dependency of the animation entry point only") and inflates the install footprint for every consumer regardless of which entries they import. `@gsap/react` (line 76) has the same problem. The presence of these in `dependencies` also means tsup's `external: ["gsap", "three"]` will still exclude them from the bundle at build time, but the consumer project ends up with duplicate copies if they also declare them directly — a known peer-dep version conflict risk.

**Fix:** Move `gsap`, `@gsap/react`, and `three` out of `dependencies` and into `devDependencies` only. The `peerDependencies` + `peerDependenciesMeta.optional: true` entries already correctly describe the consumer contract. Keep them in `devDependencies` so the local Next.js dev app and test builds can resolve them.

```json
"devDependencies": {
  "@gsap/react": "^2.1.2",
  "gsap": "^3.12.7",
  "three": "^0.183.2",
  "@types/three": "^0.183.1",
  ...
},
"peerDependencies": {
  "gsap": ">=3.12.0",
  "@gsap/react": ">=2.0.0",
  "three": ">=0.183.0"
},
"peerDependenciesMeta": {
  "gsap": { "optional": true },
  "@gsap/react": { "optional": true },
  "three": { "optional": true }
}
```

---

### CR-02: Stale closure on `prefersReduced` inside `motion.resume()` — reduced-motion guard does not track live state

**File:** `lib/signalframe-provider.tsx:123-125`
**Issue:** The `motion` object is constructed on every render (lines 118–127) and captured in the context value. The `resume()` method closes over the `prefersReduced` state from the current render cycle. However, `motion` itself is not memoized with `useMemo`, meaning every render creates a new `motion` object — but more importantly, because the context value is also recreated on each render, any component that calls `motion.resume()` asynchronously (e.g., inside a `setTimeout` or after an awaited operation) may operate on the `prefersReduced` value from the render in which the ref was captured, not the current one.

The deeper bug: `getGsap()` returns a Promise. The `pause()` and `resume()` methods on `motion` call `getGsap().then(...)` but the `prefersReduced` guard on `resume()` (line 124) runs synchronously *before* the async gsap call resolves. If `prefersReduced` transitions from `true` to `false` between when `resume()` is called and when the `.then()` callback fires, the animation will correctly resume. But if it transitions from `false` to `true` after `resume()` is called but before `.then()` fires, the guard is bypassed and GSAP will be incorrectly resumed despite the user having triggered reduced-motion preference mid-flight. This is a real edge case on systems where the OS media query can fire during user interaction (e.g., enabling accessibility shortcuts).

**Fix:** Capture the guard state inside the async callback, not in the synchronous outer check. Use a `useRef` for `prefersReduced` to give async callbacks access to the latest value:

```tsx
const prefersReducedRef = useRef(prefersReduced);
useEffect(() => {
  prefersReducedRef.current = prefersReduced;
}, [prefersReduced]);

const motion: SignalframeMotionController = useMemo(() => ({
  pause: () => { getGsap().then(gsap => gsap?.globalTimeline.pause()); },
  resume: () => {
    getGsap().then(gsap => {
      // Check latest value at callback time, not at call time
      if (!prefersReducedRef.current) gsap?.globalTimeline.resume();
    });
  },
  prefersReduced,
}), [prefersReduced]);
```

---

## Warnings

### WR-01: `setTheme` silently no-ops when `theme` argument already matches current state, but the logic is inverted for `wantDark !== currentDark` detection — `toggleTheme` call is fragile

**File:** `lib/signalframe-provider.tsx:109-116`
**Issue:** `setTheme` calls `toggleTheme(currentDark)` only when `currentDark !== wantDark`. `toggleTheme` from `lib/theme` takes the current dark state and toggles it, returning the new state. This is correct in isolation. However, `setTheme` reads `document.documentElement.classList.contains('dark')` directly on every call instead of reading from React state (`isDark`). This means if multiple rapid calls are made to `setTheme('dark')` before the DOM has been updated by the blocking script, `currentDark` may be stale relative to what `isDark` reflects in state. The React state `isDark` and the DOM `classList` can momentarily diverge because the `isDark` `useEffect` on line 71-73 only runs once on mount and does not set up a `MutationObserver` — so `toggleTheme` updates the DOM but `setTheme` re-reads DOM state on the *next* call without waiting for React to re-render.

Additionally, `setTheme` does not call `setIsDark` to track the new state when it updates — it only updates via the return value of `toggleTheme` being passed to `setIsDark` (line 114). But `setIsDark(nextDark)` IS called, so this part is actually correct. The real fragility is calling `document.documentElement.classList.contains('dark')` directly instead of reading `isDark` from state.

**Fix:** Read from React state rather than the DOM to avoid race conditions with rapid calls:

```tsx
const setTheme = (theme: 'light' | 'dark') => {
  const wantDark = theme === 'dark';
  if (isDark !== wantDark) {
    const nextDark = toggleTheme(isDark);
    setIsDark(nextDark);
  }
};
```

---

### WR-02: Unhandled floating Promises in `setTheme` and `motion` methods

**File:** `lib/signalframe-provider.tsx:79-100, 119-125`
**Issue:** Multiple calls to `getGsap().then(...)` are fire-and-forget without any rejection handling. `getGsap()` itself wraps the dynamic import in a `try/catch` (line 45-50) and returns `null` on failure, so the Promise itself will not reject in normal operation. However, the `.then()` callbacks on lines 81, 89, 97-99, 120, 124 could throw synchronously inside the callback body if `gsap.globalTimeline` is undefined or if the gsap module does not conform to the expected shape (e.g., a version mismatch). An unhandled Promise rejection in a `useEffect` or event handler will cause an unhandled rejection warning in modern Node.js and may crash the process in strict environments.

**Fix:** Add `.catch()` handlers or use `async/await` with `try/catch` in the motion methods and `useEffect` callbacks:

```tsx
getGsap().then(gsap => {
  if (!gsap) return;
  gsap.globalTimeline.timeScale(0);
}).catch(() => {
  // gsap loaded but globalTimeline unavailable — ignore silently
});
```

---

### WR-03: `verify-tree-shake.ts` uses relative paths from CWD — will fail if run from any directory other than the project root

**File:** `scripts/verify-tree-shake.ts:15-18`
**Issue:** The constants `CORE_ESM`, `CORE_CJS`, `ANIM_ESM`, and `WEBGL_ESM` are bare relative paths (`"dist/index.mjs"`, etc.). `readFileSync` and `existsSync` resolve relative paths against `process.cwd()`, not against the script file's location. The `prepublishOnly` script calls this as `npx tsx scripts/verify-tree-shake.ts`, which works when `pnpm build:lib` is run from the project root (as pnpm does by default). However, if a developer runs `npx tsx scripts/verify-tree-shake.ts` from the `scripts/` directory, all four `existsSync` checks will fail with misleading "does not exist" errors pointing to the wrong paths.

**Fix:** Use `path.resolve` relative to `import.meta.url` (or `__dirname` for CJS) to make paths script-location-relative:

```ts
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CORE_ESM = resolve(ROOT, "dist/index.mjs");
const CORE_CJS = resolve(ROOT, "dist/index.cjs");
const ANIM_ESM = resolve(ROOT, "dist/animation.mjs");
const WEBGL_ESM = resolve(ROOT, "dist/webgl.mjs");
```

---

### WR-04: `splitting: false` in `tsup.config.ts` prevents code splitting across entries, which means shared modules are duplicated in all three bundles

**File:** `tsup.config.ts:13`
**Issue:** With `splitting: false`, tsup will emit each entry point as a self-contained bundle. Any module imported by more than one entry (e.g., shared utility functions, `cn()`, any re-exported types) will be inlined into all bundles that reference it. This contradicts `treeshake: true` on line 14 — tsup's treeshake removes dead code within each bundle but cannot de-duplicate shared code across bundles when `splitting` is off. Given the three-entry architecture with distinct dependency trees (core/animation/webgl), a consumer importing from `signalframeux` and `signalframeux/animation` may load shared modules twice. This is not a correctness bug but it will manifest as bloated bundle sizes in consumer projects that use multiple entries.

**Note:** Enabling `splitting: true` for ESM only (CJS does not support code splitting) would require `outExtension` adjustment and verifying that dynamic chunk filenames do not collide with the named entry outputs. The tradeoff should be deliberately evaluated.

**Fix (if shared code is significant):** Enable splitting for ESM format and evaluate the output:

```ts
export default defineConfig({
  splitting: true,  // Enables chunk splitting for ESM; ignored for CJS
  ...
});
```

If shared code is minimal (just `cn()` from `clsx` + `tailwind-merge`, which are externalized anyway), `splitting: false` is a reasonable pragmatic choice — but the `treeshake: true` entry in that case is providing less benefit than it appears.

---

## Info

### IN-01: `next` appears in `peerDependencies` but `next` is in `dependencies` — Next.js should not be a peer dependency of a UI library

**File:** `package.json:63, 85`
**Issue:** `next` is listed in `peerDependencies` (line 63, marked optional) AND in `dependencies` (line 85). A UI component library should not declare `next` as a peer dependency. It ties the library to the Next.js ecosystem, preventing use in non-Next projects (Remix, Vite, etc.). The `'use client'` directive and `useEffect`/`useState` usage in `signalframe-provider.tsx` are framework-agnostic React — they do not require Next.js at runtime. The only Next-specific usage in the build scope is `next/navigation` in `tsup.config.ts`'s external array. Having `next` as a peer dep also means consumers running pnpm will receive a "missing peer dependency" warning even in pure Next.js apps where it's already installed.

**Fix:** Remove `next` from `peerDependencies` and `peerDependenciesMeta`. Keep it in `devDependencies` for the local dev/demo app. Add `next/navigation` to `tsup.config.ts` external as a bare string (already present) but do not surface it as a consumer peer requirement.

---

### IN-02: `@types/three` is in `dependencies`, not `devDependencies`

**File:** `package.json:74`
**Issue:** `@types/three: "^0.183.1"` is in `dependencies`. Type-only packages should always be in `devDependencies` — they are not needed at runtime and should not be installed by consumers of the published package (the dist contains `.d.ts` declarations, not raw TS source). Publishing with `@types/three` in `dependencies` forces consumers to install it even if they use the core or animation entry points only and never touch WebGL.

**Fix:** Move to `devDependencies`:
```json
"devDependencies": {
  "@types/three": "^0.183.1",
  ...
}
```

---

### IN-03: `./signalframeux.css` export in `package.json` does not match the import path suggested in `tokens.css` comment

**File:** `package.json:39` vs `lib/tokens.css:3`
**Issue:** The comment at the top of `tokens.css` says `include 'signalframeux/signalframeux.css'` but the `exports` map in `package.json` declares the path as `"./signalframeux.css"` (line 39), which consumers would import as `signalframeux/signalframeux.css`. These match. However, there is no `"."` sub-path `types` export for the CSS file, and no documentation entry for how TypeScript consumers should declare the CSS module (many projects use `declare module "*.css"` globally but library authors often provide a `/// <reference types="..." />` hint). This is minor but could cause confusion in strict TypeScript setups.

**Fix:** Add a note in the exported `tokens.css` comment clarifying the exact import path, or add a `.d.ts` declaration file for the CSS export in `dist/`:
```ts
// dist/signalframeux.d.ts (minimal CSS module declaration)
declare module 'signalframeux/signalframeux.css' {}
```

---

### IN-04: `useSignalframe` is exported from both the factory return value and as a standalone module-level export — the two implementations are functionally identical but the dual export creates an API surface inconsistency

**File:** `lib/signalframe-provider.tsx:136-145, 154-163`
**Issue:** `createSignalframeUX` returns `{ SignalframeProvider, useSignalframe }` (line 147), and there is also a standalone `export function useSignalframe()` at module level (line 154). Both implementations read from `SignalframeContext` and throw the same error message. The standalone export allows consumers to call `useSignalframe()` without going through the factory, which is useful. However, since both read from the same module-level `SignalframeContext` singleton, a consumer could mix: mount `createSignalframeUX(configA).SignalframeProvider` but call the standalone `useSignalframe()` — this would work, but calling `createSignalframeUX(configB).useSignalframe()` from a different factory call would also work (same context). The factory creates the illusion that the hook is instance-scoped when it is actually context-singleton-scoped. This is not a bug but it is a misleading API contract documented in the JSDoc at line 151.

**Fix:** Either remove the factory's `useSignalframe` from the return value (always use the standalone export) or explicitly document in the factory JSDoc that the returned `useSignalframe` is identical to the standalone export and only exists for destructured convenience:

```ts
/**
 * Note: The returned useSignalframe is the same as the standalone
 * export — both read from the shared SignalframeContext singleton.
 * Multiple createSignalframeUX() calls share the same context.
 */
```

---

_Reviewed: 2026-04-10T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
