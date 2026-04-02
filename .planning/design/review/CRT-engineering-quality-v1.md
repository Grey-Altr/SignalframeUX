# CRT: Engineering Quality Critique -- SignalframeUX

**Date:** 2026-04-01
**Scope:** 16 files across app routes, layout components, block components, and SF barrel exports
**Stack:** Next.js 15 App Router, React 19, TypeScript (strict), Tailwind v4, GSAP, Lenis
**Score: 62 / 100**

---

## Summary

The codebase demonstrates strong visual engineering and creative GSAP usage, but has meaningful structural issues around SSR safety, memory leak vectors, component boundaries, and code duplication. The most impactful problems are: (1) a GSAP plugin module that executes browser APIs at module scope, risking SSR crashes; (2) PageAnimations attaching click listeners inside a gsap.context without cleanup; (3) the `useLayoutEffect` usage in ComponentsExplorer which will warn during SSR; (4) several instances of `useCallback` with unstable dependency arrays; and (5) duplicated preview components across two different files.

---

## Findings

| # | Severity | Effort | Location | Issue | Suggestion | Weight |
|---|----------|--------|----------|-------|------------|--------|
| 1 | critical | quick-fix | `lib/gsap-plugins.ts:30-40` | **Module-scope `window` access in a `"use client"` file.** The `if (typeof window !== "undefined")` guard at module scope runs during SSR prerender in Next.js 15. While the guard prevents a crash today, GSAP plugin registration at line 12-20 also happens at import time; any future GSAP plugin that touches DOM at registration will break SSR. More importantly, the `matchMedia` listener at line 37 is never cleaned up -- it leaks for the lifetime of the process in SSR or survives HMR in dev. | Move all side effects into a `useEffect` inside a dedicated `<GSAPInit>` client component rendered once in layout. Or use a lazy-init pattern with `gsap.registerPlugin` called from a `useEffect`. |  8 |
| 2 | critical | moderate | `components/layout/page-animations.tsx:214-222` | **Click event listeners attached in `gsap.context()` are never removed.** Lines 214-222 use `el.addEventListener("click", ...)` inside the GSAP context callback. `gsap.context.revert()` only reverts GSAP tweens/ScrollTriggers, it does NOT remove vanilla DOM event listeners. These click handlers accumulate on each HMR cycle in dev and leak in production if the component ever remounts. | Store references to the click handlers and remove them in the cleanup function, or use event delegation on a parent ref. | 8 |
| 3 | major | moderate | `components/layout/page-animations.tsx:11-15` | **`hasRun` ref guard prevents re-animation but also prevents cleanup-and-reinit.** If React strict mode double-fires the effect, the second invocation is silently skipped but the first invocation's cleanup (`ctx.revert()`) already ran, leaving no animations active. In production this is fine, but in dev with StrictMode it causes all animations to be killed with no recovery. | Remove the `hasRun` guard and let `gsap.context.revert()` handle idempotent cleanup naturally. GSAP contexts are designed for this pattern. | 6 |
| 4 | major | quick-fix | `components/blocks/components-explorer.tsx:288` | **`useLayoutEffect` in a client component rendered from a server page.** `useLayoutEffect` fires a React warning during SSR ("useLayoutEffect does nothing on the server"). While Next.js App Router client components are only hydrated client-side, the warning still appears in console during SSR rendering of the component tree. | Replace with `useEffect` (the Flip animation does not need synchronous layout measurement since it reads from a captured FlipState) or use a `useIsomorphicLayoutEffect` wrapper. | 5 |
| 5 | major | moderate | `components/blocks/manifesto-band.tsx:86-91,131` | **`wordIndices` array is recomputed every render and used as a `useCallback` dependency, causing the callback to be recreated on every render.** `wordIndices` is a plain array created in the render body (line 86-91). It is used in the dependency array of `useCallback` at line 131. Since arrays are compared by reference, `handleScroll` is recreated every render, which then causes the `useEffect` at line 133 to re-subscribe scroll/resize listeners every render. | Move `wordIndices` to module scope (it depends only on the static `SEGMENTS` constant) or wrap it in `useMemo`. | 6 |
| 6 | major | moderate | `components/layout/page-animations.tsx:19-223` | **Entire page animation system uses `document.querySelector` to find elements.** This bypasses React's rendering model entirely. If any animated element is conditionally rendered or lazy-loaded, the querySelector will miss it. More critically, there is no guarantee these elements exist when the effect runs, since client components hydrate asynchronously. | For homepage-specific animations this works pragmatically, but consider using a shared animation context or `IntersectionObserver`-based approach so animations are resilient to component render timing. | 4 |
| 7 | major | quick-fix | `components/layout/nav.tsx:285` | **`DarkModeToggle` displays hardcoded "DARK" text instead of the scrambled `darkText` variable.** Line 228 computes `const darkText = useScrambleText("DARK", 700, 400)` but line 285 renders the literal string `DARK` instead of `{darkText}`. The scramble effect only applies to the "LIGHT" label. | Replace `DARK` at line 285 with `{darkText}`. | 3 |
| 8 | major | significant | `components/blocks/component-grid.tsx` + `components/blocks/components-explorer.tsx` | **Duplicated preview components across two files.** Both files define their own `PreviewButton`, `PreviewInput`, `PreviewCard`, `PreviewModal`, `PreviewTable`, `PreviewTabs` etc. These are not identical implementations but serve the same conceptual purpose. This is a maintenance burden -- any visual change must be made in two places. | Extract shared preview primitives into a `components/blocks/previews/` directory and import from both grid and explorer. | 5 |
| 9 | minor | quick-fix | `app/components/page.tsx` | **Missing `metadata` export.** Unlike `app/start/page.tsx`, `app/tokens/page.tsx`, and `app/reference/page.tsx`, the components page has no `Metadata` export for SEO. | Add `export const metadata: Metadata = { title: "Components -- SIGNALFRAME//UX", ... }`. | 3 |
| 10 | minor | quick-fix | `components/layout/nav.tsx:432-485` | **`styled-jsx` used inside a component that already uses Tailwind.** The `LogoMark` component uses `<style jsx>` for keyframe animations. styled-jsx adds runtime overhead and is a separate CSS-in-JS layer from Tailwind. This is the only file mixing both approaches. | Move the keyframes to `globals.css` or use Tailwind's `@keyframes` directive. This eliminates the styled-jsx runtime dependency for this component. | 3 |
| 11 | minor | quick-fix | `components/layout/global-effects.tsx:73-135` | **styled-jsx `global` used for cursor styles.** Same concern as #10 -- mixing styled-jsx with Tailwind. The global cursor styles could live in `globals.css`. | Move `.sf-cursor` styles and the `@media` queries to `globals.css`. | 2 |
| 12 | minor | quick-fix | `components/layout/nav.tsx:97-98` | **`LiveClock` initializes `display` as an empty array.** On the very first render frame before `useEffect` fires, the clock renders nothing (empty array `.map` produces no output). This causes a brief flash of no content in the clock area. | Initialize `display` with a placeholder like `["--", ":", "--", ":", "--"]` or use the current time string directly (accepting the hydration mismatch, which is already suppressed). | 2 |
| 13 | minor | moderate | `components/layout/lenis-provider.tsx:25-27` | **GSAP ticker callback is never removed on cleanup.** `gsap.ticker.add(fn)` at line 25 adds a persistent callback, but `lenis.destroy()` at line 31 does not remove the ticker callback. After HMR or remount, orphaned ticker callbacks accumulate. | Store the callback reference and call `gsap.ticker.remove(fn)` in the cleanup. | 4 |
| 14 | minor | quick-fix | `components/blocks/api-explorer.tsx:114` | **`contentRef` used for `scrollTo` but the div may not be scrollable on mobile.** The center panel has `overflow-y-auto` only at `md:` breakpoint (`h-auto md:h-[calc(...)]`). On mobile, `scrollTo` on a non-overflowing div is a no-op, which is harmless but indicates the mobile layout may not behave as expected when switching nav items. | Verify mobile scroll behavior. Consider using `window.scrollTo` as fallback on small screens. | 1 |
| 15 | minor | quick-fix | `components/blocks/token-tabs.tsx:369` | **Emoji used in JSX output.** Line 369 uses a lock emoji (`&#x1F512;`) for placeholder tabs. This renders inconsistently across platforms and screen readers will announce "locked" or similar. | Use an SVG icon or a text label like `[LOCKED]` for consistent cross-platform rendering. | 1 |
| 16 | minor | quick-fix | `components/sf/index.ts` | **Barrel export file re-exports everything.** While functional, this means any consumer importing a single component from `@/components/sf` will cause the bundler to evaluate all SF wrapper modules. Next.js tree-shaking handles this in production, but in dev mode with Turbopack, barrel files can slow HMR. | This is acceptable for now. If HMR slows down, consider using `optimizePackageImports` in `next.config.js` or switching to direct imports. | 1 |
| 17 | nit | quick-fix | `app/layout.tsx:62` | **`suppressHydrationWarning` on `<html>` is appropriate** for the dark mode script, but the attribute only suppresses one level deep. If child elements also have mismatches (e.g., from the theme class propagating to computed styles), they will still warn. | This is fine for the current pattern. Just noting for awareness. | 0 |
| 18 | nit | quick-fix | `components/blocks/hero.tsx:94,104` | **`suppressHydrationWarning` on CTA links is unnecessary.** These `<Link>` elements have static content and no dynamic attributes that could mismatch between server and client. | Remove the unnecessary `suppressHydrationWarning` props. | 0 |
| 19 | nit | quick-fix | `components/blocks/code-section.tsx` | **No `"use client"` directive but also no server-only APIs.** This file is a pure presentational component with no hooks or browser APIs. It correctly works as a server component. However, it is imported by `app/page.tsx` which may or may not be a client component -- verify the boundary is intentional. | Confirm this is intentionally a server component. If so, this is good practice. | 0 |
| 20 | nit | quick-fix | `app/start/page.tsx:261` | **Type assertion `as CodeLine[]` on step.code.** The `STEPS` array has code typed as a plain array of objects. The `as CodeLine[]` cast at line 261 bypasses type checking. | Type the `STEPS` constant with an explicit type annotation including `code: CodeLine[]` to get compile-time safety. | 1 |

---

## Score Breakdown

| Category | Max | Score | Notes |
|----------|-----|-------|-------|
| SSR / Hydration Safety | 20 | 12 | Module-scope window access, useLayoutEffect warning, suppressHydrationWarning overuse |
| Memory & Cleanup | 20 | 10 | Click listeners not cleaned, GSAP ticker leak, matchMedia listener leak |
| Component Architecture | 20 | 14 | Good server/client split overall; duplicated previews and querySelector coupling |
| TypeScript Correctness | 15 | 12 | Strict mode enabled, one type cast, generally well-typed |
| Hook Correctness | 15 | 9 | Unstable useCallback deps in manifesto-band, hasRun guard anti-pattern |
| Code Organization | 10 | 5 | styled-jsx mixed with Tailwind, duplicated components, missing metadata |
| **Total** | **100** | **62** | |

---

## Priority Remediation Order

1. **Fix click listener leak in PageAnimations** (#2) -- actual memory leak in production
2. **Fix GSAP ticker leak in LenisProvider** (#13) -- accumulates on HMR
3. **Stabilize manifesto-band useCallback deps** (#5) -- perf regression, re-subscribes listeners every frame
4. **Move GSAP init side effects out of module scope** (#1) -- SSR safety
5. **Replace useLayoutEffect in ComponentsExplorer** (#4) -- eliminates SSR warning
6. **Use `darkText` variable in DarkModeToggle** (#7) -- bug fix, quick win
7. **Extract shared preview components** (#8) -- reduces maintenance surface
8. **Add missing metadata to components page** (#9) -- SEO gap
