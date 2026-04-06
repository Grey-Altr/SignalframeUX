# Performance Baseline — v1.3 Pre-Expansion

Captured: 2026-04-06
Commit: 3be0f55
After: 7 shadcn bases installed (accordion, alert-dialog, avatar, navigation-menu, progress, collapsible, toggle-group)
Before: Any v1.3 SF wrapper implementation

## Performance Baseline

| Metric | Value | Gate | Hard Limit |
|--------|-------|------|------------|
| Initial JS bundle (shared by all) | 103 KB | 150 KB | 200 KB |
| First Load JS `/` (homepage) | 264 KB | — | — |
| First Load JS `/_not-found` (minimal) | 103 KB | — | — |
| Lighthouse Performance (headless CLI) | 88/100 | 100 | 90 |
| Lighthouse LCP (headless CLI) | 3.8s | 1.0s | 1.5s |
| Lighthouse TTI (headless CLI) | 4.6s | 1.5s | 2.0s |
| Lighthouse CLS | 0.002 | 0 | 0.1 |
| Lighthouse FCP | 1.2s | — | — |
| Lighthouse TBT | 60ms | — | — |

> **Note on Lighthouse CLI numbers:** LCP and TTI measured via `npx lighthouse --chrome-flags="--headless"` against `pnpm start` on localhost. Headless Chrome Lighthouse on localhost is NOT representative of production Vercel performance — Three.js, GSAP, WebGL, and canvas rendering inflate these numbers significantly in headless mode. The gate-relevant metric for v1.3 is **Initial JS bundle size** (103 KB shared), which is measured deterministically from `pnpm build` output. For accurate Lighthouse scores, measure manually via browser DevTools Lighthouse panel against the deployed Vercel URL.

## Bundle Composition

```
Route (app)                                 Size  First Load JS
┌ f /                                    10.8 kB         264 kB
├ f /_not-found                            123 B         103 kB
├ f /components                          5.87 kB         214 kB
├ f /reference                           16.8 kB         225 kB
├ f /start                                 465 B         209 kB
└ f /tokens                              7.19 kB         216 kB
+ First Load JS shared by all             103 kB
  ├ chunks/38cfe05e-73900e5b7a436eaa.js  54.2 kB
  ├ chunks/603-db0b3e0fbe241c7d.js       45.9 kB
  └ other shared chunks (total)          2.33 kB

f Middleware                               34 kB
```

## shadcn Install Audit

### 'use client' Status

| Base Component | 'use client' | Notes |
|----------------|--------------|-------|
| accordion.tsx | Yes | Radix Accordion uses client-side state |
| alert-dialog.tsx | Yes | Radix AlertDialog uses client-side state |
| avatar.tsx | Yes | Radix Avatar uses client-side fallback logic |
| navigation-menu.tsx | No | Server Component — no Radix state primitives used directly |
| progress.tsx | Yes | Radix Progress uses client-side indicator |
| collapsible.tsx | Yes | Radix Collapsible uses client-side state |
| toggle-group.tsx | Yes | Radix ToggleGroup uses client-side state |

### rounded-* Classes Requiring SF Override

| Base Component | Element | Class | SF Override |
|----------------|---------|-------|-------------|
| avatar.tsx | AvatarRoot | `rounded-full` (x2, incl. after pseudo) | `rounded-none after:rounded-none` |
| avatar.tsx | AvatarImage | `rounded-full` | `rounded-none` |
| avatar.tsx | AvatarFallback | `rounded-full` | `rounded-none` |
| avatar.tsx | AvatarBadge | `rounded-full` | `rounded-none` |
| avatar.tsx | AvatarGroupCount | `rounded-full` | `rounded-none` |
| progress.tsx | ProgressRoot | `rounded-full` | `rounded-none` |
| alert-dialog.tsx | AlertDialogContent | `rounded-xl` | `rounded-none` |
| alert-dialog.tsx | AlertDialogFooter | `rounded-b-xl` | `rounded-none` |
| alert-dialog.tsx | AlertDialogIcon | `rounded-md` | `rounded-none` |
| navigation-menu.tsx | NavigationMenuTrigger | `rounded-lg` | `rounded-none` |
| navigation-menu.tsx | NavigationMenuContent | `rounded-lg` | `rounded-none` |
| navigation-menu.tsx | NavigationMenuViewport | `rounded-lg` | `rounded-none` |
| navigation-menu.tsx | NavigationMenuLink | `rounded-lg`, `rounded-md` (in data context) | `rounded-none` |
| navigation-menu.tsx | Indicator arrow div | `rounded-tl-sm` | `rounded-none` |
| toggle-group.tsx | ToggleGroupRoot | `rounded-lg`, `rounded-[min(...)]` | `rounded-none` |
| toggle-group.tsx | ToggleGroupItem | `rounded-md` | `rounded-none` |
| accordion.tsx | AccordionItem | `rounded-lg` | `rounded-none` |
| collapsible.tsx | (none) | — | No overrides needed |

## Regression Protocol

After each P1 component (Phase 17-18):
1. Run `ANALYZE=true pnpm build`
2. Compare First Load JS against this baseline (103 KB shared)
3. If delta > 5KB for a FRAME-only component, investigate
4. If total exceeds 150KB gate, stop and optimize before continuing
5. For accurate Lighthouse, use browser DevTools against deployed Vercel URL
