# Stack Research

**Domain:** Design system component library expansion (React/Next.js)
**Researched:** 2026-04-06
**Scope:** NEW capabilities only — v1.3 Component Expansion (Accordion, Toast, Progress, AlertDialog, Avatar, Breadcrumb, EmptyState, NavigationMenu, Pagination, Stepper, StatusDot, ToggleGroup, Calendar, Menubar)
**Confidence:** HIGH

---

## Context: What Is NOT Re-Researched

The following stack is locked from v1.0–v1.2 and NOT covered here:

- Next.js 15.3 (App Router, Turbopack) + TypeScript 5.8
- GSAP 3.12.7 + ScrollTrigger, @gsap/react 2.1.2, Lenis 1.1.20
- Tailwind CSS v4, CVA 0.7.1, `radix-ui` 1.4.3 umbrella, `shadcn` 4.1.2 devDep
- Three.js 0.183.2 (async chunk), SignalCanvas singleton, OKLCH color space
- `cmdk` 1.1.1 (already installed — powers SFCommand)
- Session persistence, registry.json, createSignalframeUX factory (all v1.2)

Existing architecture constraints for this milestone:
- `radix-ui@1.4.3` umbrella package already installed — all needed Radix primitives are bundled and tree-shakeable; zero new Radix installs needed
- `'use client'` only when required — Server Components default
- Page weight budget < 200KB initial (excluding images) — heavy components must use `next/dynamic`
- No border-radius anywhere (DU/TDR aesthetic)
- GSAP is the only animation driver — no independent animation libraries

---

## Critical Finding: All Radix Primitives Already Available

The installed `radix-ui@1.4.3` umbrella exports ALL primitives needed for v1.3 with zero additional installs:

| Target Component | Radix Primitive | Import Path |
|-----------------|-----------------|-------------|
| SFAccordion | `Accordion` | `import * as Accordion from 'radix-ui/react-accordion'` |
| SFAlertDialog | `AlertDialog` | `import * as AlertDialog from 'radix-ui/react-alert-dialog'` |
| SFAvatar | `Avatar` | `import * as Avatar from 'radix-ui/react-avatar'` |
| SFNavigationMenu | `NavigationMenu` | `import * as NavigationMenu from 'radix-ui/react-navigation-menu'` |
| SFProgress | `Progress` | `import * as Progress from 'radix-ui/react-progress'` |
| SFToggleGroup | `ToggleGroup` | `import * as ToggleGroup from 'radix-ui/react-toggle-group'` |
| SFMenubar (P3) | `Menubar` | `import * as Menubar from 'radix-ui/react-menubar'` |
| SFBreadcrumb | — | Pure composition (no Radix primitive needed) |
| SFPagination | — | Pure composition (no Radix primitive needed) |
| SFStepper | — | Pure composition (no Radix primitive needed) |
| SFStatusDot | — | Pure CSS/CVA (no Radix primitive needed) |
| SFEmptyState | — | Pure composition (no Radix primitive needed) |

The umbrella package is tree-shakeable by namespace import — only primitives explicitly imported are bundled. No version conflicts or duplicate dependencies. Namespace import (`import * as Accordion from 'radix-ui/react-accordion'`) is tree-shaking equivalent to named imports per Radix documentation.

**Confidence:** HIGH — verified by reading `node_modules/radix-ui/src/index.ts` directly.

---

## Decision 1: Toast — Sonner, Not Radix Toast

### Recommendation: `sonner@2.0.7` — new dependency

| Aspect | Sonner | Radix Toast |
|--------|--------|-------------|
| Status in shadcn/ui | **Official recommendation — Radix Toast deprecated** | Deprecated (shadcn replaced it) |
| API surface | Imperative `toast()` call from anywhere | Component + `useToast()` hook wiring |
| Stacking behavior | Built-in stacked/swipeable UI | Manual implementation required |
| Bundle size | ~7-10 kB gzipped (LOW confidence — bundlephobia JS not parseable) | Already in radix-ui umbrella |
| Animation | Built-in slide/stack animations | Manual |
| Promise API | `toast.promise(fn)` — zero-config async feedback | Not available |
| `'use client'` required | Yes | Yes |
| Styling control | CSS variables + Tailwind overrides | Full unstyled control |

**Why Sonner over Radix Toast:**
1. shadcn/ui has officially deprecated Radix Toast in favor of Sonner — this is the ecosystem direction
2. Sonner's imperative API (`toast('Message')` from anywhere) is strictly better DX than wiring a `useToast()` hook through component trees
3. `toast.promise()` is essential for async interaction patterns (form submissions, data loading)
4. Sonner's stacking/swipe behavior is production-ready with zero configuration
5. The design system can fully override Sonner's default styling via CSS variables to enforce DU/TDR aesthetic (no rounded corners, OKLCH colors)

**Why not Radix Toast:** Deprecated in shadcn. The primitive is already in the `radix-ui` umbrella so there would be zero install cost — but the API is more complex for identical results, and it is the ecosystem's past, not future.

**Sonner styling override pattern for zero-radius DU/TDR aesthetic:**
```tsx
// In root layout (Server Component passthrough wrapping Toaster):
<Toaster
  toastOptions={{
    classNames: {
      toast: 'border-0 rounded-none font-mono',
      title: 'text-sm tracking-wide uppercase',
    }
  }}
/>
```

**Install:** `pnpm add sonner`

---

## Decision 2: Calendar (P3) — react-day-picker v9, Lazy-Loaded

### Recommendation: `react-day-picker@9.14.0` via `next/dynamic` — new dependency, P3 only

| Aspect | Value |
|--------|-------|
| Version | `9.14.0` (latest as of April 2026) |
| date-fns | Bundled as regular dep in v9 (was peer dep in v8) — no separate install |
| shadcn integration | Official — shadcn Calendar upgraded to react-day-picker v9 (confirmed June 2025 shadcn changelog) |
| Bundle cost | Significant (includes date-fns) — MUST be lazy-loaded |
| `next/dynamic` required | Yes — P3 designation; heavy dep annotated in registry |

**Why react-day-picker:**
- Only calendar library with official shadcn/ui integration and maintained upgrade path
- v9 brings first-class timezone support (`timeZone` prop) — correct for a production design system
- Accessibility: WCAG 2.1 compliant keyboard and screen reader navigation
- date-fns bundled as regular dep in v9 — no consumer peer dependency management needed

**Why it is P3 (not P1/P2):**
- react-day-picker + date-fns adds significant weight to the initial bundle
- Calendar components are session-specific (date pickers, booking flows) — not needed on initial load
- `next/dynamic` wrapping isolates this from the 200KB initial budget

**Lazy load pattern (required for SFCalendar):**
```tsx
// components/sf/sf-calendar.tsx
import dynamic from 'next/dynamic';

const CalendarInner = dynamic(() => import('./sf-calendar-inner'), {
  loading: () => <SFSkeleton className="h-[300px] w-[280px]" />,
  ssr: false,  // date-fns timezone operations are client-side
});
```

**Install:** `pnpm add react-day-picker` — P3 phase only, NOT in P1/P2 sprint

---

## Decision 3: cmdk — Already Installed, No Changes

`cmdk@1.1.1` is already a production dependency powering `SFCommand`. v1.3 adds no new command palette components, so no version bump or changes are needed.

**Confidence:** HIGH — verified from `package.json`.

---

## Decision 4: Tree-Shaking with radix-ui Umbrella — No Risk

Adding many SF-wrapped Radix components does NOT meaningfully impact the initial bundle because:

1. `radix-ui@1.4.3` uses namespace exports — Turbopack/webpack tree-shakes at the `@radix-ui/react-*` sub-package level
2. Each primitive is a separate internal sub-package — only explicitly imported primitives are included in the bundle
3. The Radix sub-packages are already present in `node_modules` from the umbrella install — adding SF wrappers adds only the thin wrapper code
4. P1/P2 components are Radix-based or pure composition — no new heavy dependencies in either phase

**Practical impact:** Adding all P1/P2 SF wrappers (SFAccordion through SFToggleGroup) adds approximately 2-5 kB gzipped total from wrapper code. The Radix primitives themselves were already downloaded with the umbrella install.

**Confidence:** MEDIUM — tree-shaking verified via Radix documentation; per-primitive wrapper sizes are estimated.

---

## Decision 5: No Version Bumps Required for P1/P2

All P1/P2 components are fully covered by the current package.json:

| Package | Current Version | P1/P2 Need | Action |
|---------|----------------|------------|--------|
| `radix-ui` | `1.4.3` | Accordion, AlertDialog, Avatar, Progress, NavigationMenu, ToggleGroup | None — all included |
| `class-variance-authority` | `0.7.1` | CVA variants on all new components | None |
| `lucide-react` | `0.488.0` | Icons for Breadcrumb, Pagination, Avatar fallback | None |
| `gsap` | `3.12.7` | SIGNAL integration on Progress, Accordion | None |
| `tailwind-merge` | `3.0.2` | `cn()` throughout | None |

No version bumps needed for P1/P2. All required primitives are present and verified.

---

## Decision 6: StatusDot, Stepper, Pagination, Breadcrumb — Pure Composition

These four components require no new primitives:

| Component | Implementation | Client Directive |
|-----------|---------------|-----------------|
| SFStatusDot | CVA + Tailwind classes only | Server Component ✓ |
| SFStepper | Pure React composition + Tailwind | `'use client'` (active step state) |
| SFPagination | Pure React + Lucide `ChevronLeft`/`ChevronRight` | `'use client'` (page state) |
| SFBreadcrumb | Pure React + Lucide `ChevronRight` + Next.js `Link` | Server Component ✓ |

---

## Recommended Stack for v1.3

### New Runtime Dependencies

| Package | Version | Purpose | Phase | Install Command |
|---------|---------|---------|-------|----------------|
| `sonner` | `^2.0.7` | Toast notifications — imperative API, stacking, promise | P1 | `pnpm add sonner` |
| `react-day-picker` | `^9.14.0` | Calendar — date-fns bundled, WCAG 2.1 | P3 only | `pnpm add react-day-picker` |

### Zero New Dependencies (P1 + P2 — covered by existing installs)

| Components | Source | Install |
|-----------|--------|---------|
| SFAccordion, SFAlertDialog, SFAvatar, SFProgress | `radix-ui@1.4.3` (existing) | None |
| SFNavigationMenu, SFToggleGroup | `radix-ui@1.4.3` (existing) | None |
| SFBreadcrumb, SFPagination, SFStepper, SFStatusDot, SFEmptyState | Pure composition | None |

### What NOT to Add

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `@radix-ui/react-accordion` (standalone) | Duplicate of what `radix-ui` umbrella already provides | Import via `radix-ui/react-accordion` |
| `react-toastify` | Legacy; not shadcn-aligned; large bundle | `sonner` |
| `react-hot-toast` | Lacks stacking/promise API; not shadcn-aligned | `sonner` |
| `@radix-ui/react-toast` (standalone) | Deprecated by shadcn/ui | `sonner` |
| `date-fns` (standalone) | Bundled inside `react-day-picker@9` — duplicate | Already included |
| `react-datepicker` | No shadcn integration, no WCAG compliance by default | `react-day-picker@9` |
| Any new animation library | CLAUDE.md constraint: do not expand animation system | GSAP (existing) |
| `framer-motion` | Independent rAF loop conflicts with GSAP `globalTimeline.timeScale(0)` | GSAP (existing) |

---

## SIGNAL Layer Integration Notes

Three P1 components are animation-eligible per v1.3 milestone spec — all use existing GSAP patterns:

| Component | SIGNAL Pattern | Implementation Note |
|-----------|---------------|---------------------|
| SFProgress | Fill animation on value change | `gsap.to(barRef, { width: value+'%', duration: 0.4, ease: 'power2.out' })` |
| SFToast (Sonner) | Slide-in entrance | Override Sonner's default CSS animation with GSAP in `onAutoClose`/`onDismiss` callbacks if needed; Sonner's built-in CSS animation may be sufficient |
| SFAccordion | Content stagger on open | `gsap.from(contentRef, { opacity: 0, y: -8, duration: 0.2 })` on `onValueChange` |

No new GSAP plugins needed. ScrollTrigger is NOT needed (these are interaction-triggered, not scroll-triggered).

---

## Installation Summary

### P1 Sprint

```bash
pnpm add sonner
```

### P3 Sprint (calendar only — defer until P3)

```bash
pnpm add react-day-picker
```

### P1/P2 — No install needed. Verify with:

```bash
node -e "const r = require('./node_modules/radix-ui/src/index.ts'); console.log('ok')" 2>/dev/null
# Or simply: ls node_modules/radix-ui/src/index.ts
```

---

## Version Compatibility

| Package | Version | Peer Requirements | Status |
|---------|---------|-------------------|--------|
| `sonner` | `^2.0.7` | React 18+, zero runtime deps | Compatible with React 19.1.0 ✓ |
| `react-day-picker` | `^9.14.0` | React 16.8+ (hooks) | Compatible with React 19.1.0 ✓; date-fns bundled |
| `radix-ui` | `1.4.3` (existing) | React 18+ | All v1.3 primitives verified present ✓ |

---

## Sources

- `node_modules/radix-ui/src/index.ts` — direct inspection confirming all v1.3 Radix primitives available — HIGH confidence
- `node_modules/radix-ui/package.json` — sub-package dependency versions (Accordion 1.2.12, AlertDialog 1.1.15, Avatar 1.1.10) — HIGH confidence
- Radix Primitives documentation (radix-ui.com/primitives/docs/overview/introduction) — tree-shaking via umbrella namespace imports — HIGH confidence
- shadcn/ui docs (ui.shadcn.com/docs/components/radix/sonner) — Sonner as official replacement for deprecated Radix Toast — HIGH confidence
- shadcn/ui changelog 2025-06-calendar (ui.shadcn.com/docs/changelog/2025-06-calendar) — Calendar upgraded to react-day-picker v9 confirmed — HIGH confidence
- WebSearch: sonner v2.0.7 latest version, zero runtime deps — MEDIUM confidence (npm page, not Context7)
- WebSearch: react-day-picker v9.14.0, date-fns bundled as regular dep, WCAG 2.1 — HIGH confidence (daypicker.dev official changelog)
- Next.js docs (nextjs.org/docs/app/guides/lazy-loading) — `next/dynamic` pattern with `ssr: false` for heavy components — HIGH confidence
- `package.json` — all current installed versions verified — HIGH confidence

---

*Stack research for: SignalframeUX v1.3 Component Expansion — NEW capabilities only*
*Researched: 2026-04-06*
