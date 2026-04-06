# Stack Research

**Domain:** Design system component library + interactive showcase (Next.js 15 / React 19)
**Researched:** 2026-04-06
**Scope:** NEW capabilities only — v1.4 Feature Complete (remaining SF wrappers, interactive detail views, token finalization, showcase coherence)
**Confidence:** HIGH (all critical claims verified against official docs or npm registry)

---

## Context: What This Covers

This is a subsequent-milestone stack addition document. The existing stack (Next.js 15.3, TypeScript 5.8, Tailwind CSS v4, CVA, Radix UI via shadcn, GSAP 3.12, Lenis, Three.js, sonner, OKLCH) is validated and NOT re-researched here.

This document covers ONLY the new capabilities required for v1.4:

1. Remaining shadcn/Radix component dependencies not yet installed
2. Syntax highlighting for interactive component detail views
3. Interactive detail view architecture (no new deps — GSAP + existing patterns)
4. Token system finalization (no new deps — CSS-only work)

---

## Recommended Stack

### New Component Dependencies

These packages are required by shadcn CLI when adding remaining unwrapped components. None are currently in `package.json`.

| Package | Version | Required By | Why Needed |
|---------|---------|-------------|------------|
| `vaul` | `^1.1.2` | SFDrawer | shadcn Drawer is built on vaul by Emil Kowalski. React 19 support added in v1.1.1. Peer dep confirmed. |
| `embla-carousel-react` | `^8.6.0` | SFCarousel | shadcn Carousel is built on Embla Carousel. v8 supports React 19. shadcn CLI adds this automatically. |
| `input-otp` | `^1.x` | SFInputOTP | shadcn Input OTP is built on guilherme_rodz's input-otp package. shadcn CLI adds this automatically. |
| `react-resizable-panels` | `^4.x` | SFResizable | shadcn Resizable uses react-resizable-panels v4 (confirmed in shadcn changelog). |
| `recharts` | `^3.x` | SFChart | shadcn Chart wraps Recharts v3. Chart tokens use `var(--chart-1)` format — OKLCH-compatible with existing `@theme`. DEFER: only add if SFChart is explicitly in milestone scope. |

**Components NOT needing new deps:**
- Context Menu, Hover Card, Aspect Ratio — pure Radix UI, already covered by existing `radix-ui@^1.4.3` unified package
- Kbd, Spinner, ButtonGroup, Field, Item, Empty — October 2025 shadcn additions, no external peer deps; copy-paste only

### Syntax Highlighting

| Package | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| `shiki` | `^1.x` | Code block syntax highlighting in detail views | Server Component native — zero client JS shipped. Lazy-loads languages as async chunks (Next.js handles automatically). Fine-grained bundle via `shiki/core` keeps footprint to ~50-80 KB async. Renders at build/request time; no runtime client overhead. |

**Bundle strategy:** Use `shiki/core` with only the languages actually needed (TypeScript, TSX, Bash). Provide a custom theme object using the project's existing `--sf-code-bg` / `--sf-code-text` OKLCH values rather than importing a bundled theme. This avoids the full 695 KB gzip web bundle cost — only ~50-80 KB async (not in initial bundle).

**Pattern (RSC — server-only module):**
```typescript
// lib/code-highlight.ts — server-only, never imported in client components
import { createHighlighter } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

// Call once at module level; Next.js caches the module
const highlighter = await createHighlighter({
  themes: [/* inline custom theme object using sf OKLCH tokens */],
  langs: ['typescript', 'tsx', 'bash'],
  engine: createJavaScriptRegexEngine(),
})

export async function highlightCode(code: string, lang: string): Promise<string> {
  return highlighter.codeToHtml(code, { lang, theme: 'sf-dark' })
}
```

The returned HTML string is rendered server-side in the RSC component. Shiki's output is build-time-generated HTML with inline styles — it does not add any client JavaScript.

**Important constraint:** Shiki uses lazy imports. The Shiki docs explicitly warn against Edge Runtime — use the default Next.js Serverless Runtime (already the project default). No config change needed.

**Do NOT use:** `rehype-pretty-code` or `@next/mdx` — MDX pipeline overhead is unnecessary since component documentation is structured TypeScript data, not markdown files. Direct `shiki` API is simpler and gives more control over output HTML structure.

### Interactive Detail Views

**No new packages required.** The existing codebase already has every primitive needed:

| Capability | Implementation | Source |
|------------|---------------|--------|
| Expand/collapse animation | GSAP `gsap.to(el, { height: el.scrollHeight })` with `onComplete: () => gsap.set(el, { height: 'auto' })` | Pattern proven in SFAccordion (`components/sf/sf-accordion.tsx`) |
| Prop tables | Extend existing `ComponentDoc` + `PropDef` types in `lib/api-docs.ts` | Already structured for this exact purpose with `name`, `type`, `default`, `desc`, `required` fields |
| Variant demo rendering | Inline preview components (same pattern as `PreviewButton`, `PreviewCard` etc.) | `components/blocks/components-explorer.tsx` |
| Tab UI for prop / demo / code panels | `SFTabs` + `SFTabsList` + `SFTabsTrigger` + `SFTabsContent` | Already used in `components/blocks/api-explorer.tsx` |
| GSAP FLIP for grid layout reflow on expand | `lib/gsap-flip.ts` (lazy-loaded) | Already in `components-explorer.tsx` |
| Code display | `SharedCodeBlock` component | `components/blocks/shared-code-block.tsx` |

**Detail panel expand pattern:**
```typescript
// Measure first, then tween — avoids the GSAP "height: auto" duration issue
const targetHeight = panel.scrollHeight
gsap.fromTo(
  panel,
  { height: 0, opacity: 0 },
  {
    height: targetHeight,
    opacity: 1,
    duration: 0.2,  // aligns with --duration-normal token
    ease: 'power2.out',  // aligns with --ease-default token
    onComplete: () => gsap.set(panel, { height: 'auto' })
  }
)
```
Measuring `scrollHeight` before the tween avoids the known GSAP `height: auto` animation issue (where `auto` only applies at tween end, not during). The `onComplete` restore to `height: auto` allows the panel to reflow if content changes.

### Token System Finalization

**No new packages required.** All gaps are CSS-only work in `app/globals.css`:

| Gap | Status | Action |
|-----|--------|--------|
| `--color-success` / `--color-warning` | Exist as `--sf-green` / `--sf-yellow` in `:root` but NOT in `@theme` as named semantic tokens | Wire into `@theme` block alongside destructive |
| `--max-w-content`, `--max-w-wide`, `--max-w-full` | Referenced in CLAUDE.md as required tokens — audit globals.css to confirm actual presence | Audit + add if missing |
| Animation token cross-component normalization | `--duration-*` and `--ease-*` tokens exist but usage in components needs audit for consistency | Audit pass only, no new tokens |

---

## Alternatives Considered

| Recommended | Alternative | Why Not |
|-------------|-------------|---------|
| `shiki` (RSC, server-only) | `prism-react-renderer` | Client-side only; adds to JS bundle; older ecosystem. Shiki is the current standard for Next.js RSC syntax highlighting. |
| `shiki` (RSC, server-only) | `rehype-pretty-code` | Adds MDX pipeline complexity with no benefit. This project uses structured TypeScript data, not markdown files. Direct shiki API is cleaner. |
| `shiki/core` fine-grained | `shiki/bundle/web` (695 KB gzip) | Web bundle is 695 KB gzip — unacceptable when only TypeScript and TSX are needed. Fine-grained approach: ~50-80 KB async. |
| GSAP height animation (existing) | Framer Motion / Motion | Adding a 40+ KB client animation library when GSAP 3.12 is already the animation layer would conflict with `gsap.globalTimeline.timeScale(0)` reduced-motion kill switch. Two animation systems = complexity and maintenance debt. Explicitly out of scope per CLAUDE.md. |
| Hand-authored `api-docs.ts` prop data | `react-docgen-typescript` | CVA variant types confuse the parser; generates flattened props that lose `intent`/`size` variant structure; requires webpack plugin; increases build time. Hand-authored is the established project pattern and produces higher-quality documentation. |
| shadcn CLI (`pnpm dlx shadcn@latest add`) | Manual component copy-paste | CLI handles peer dep installation and ensures version alignment with installed shadcn version (4.1.2). |
| P3 lazy pattern for heavy new components | Direct import | SFDrawer, SFCarousel, SFResizable are not in the critical rendering path. Same P3 pattern used for SFCalendar/SFMenubar — validated and bundle-safe in v1.3. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `framer-motion` / `motion` | Dual animation system conflicts with GSAP `globalTimeline.timeScale(0)` reduced-motion kill switch. Project explicitly chose GSAP as the single animation driver. | GSAP (existing) |
| `react-docgen-typescript` | CVA variant types confuse the parser; flattens prop hierarchy; adds webpack plugin; increases build time | Hand-authored `lib/api-docs.ts` extension (existing) |
| `@storybook/*` | 200+ MB infrastructure that duplicates what the in-site showcase does natively. Not aligned with the "reduce friction" mandate in CLAUDE.md. | In-site component explorer (existing) |
| `recharts` (unless SFChart is in scope) | 300+ KB dependency; include only if Chart is a named deliverable | Defer until explicitly scoped |
| `shiki/bundle/full` or `shiki/bundle/web` | Full: 6.4 MB minified / 1.2 MB gzip; web: 695 KB gzip — both exceed the 200 KB initial page budget for a single feature | `shiki/core` with fine-grained language/theme imports |
| MDX pipeline (`@next/mdx`, `next-mdx-remote`) | Compilation overhead with no benefit; component documentation is structured data, not prose | TypeScript objects in `lib/api-docs.ts` |
| `react-syntax-highlighter` | 250+ KB bundle; client-side; outdated relative to Shiki | `shiki` (server-side) |

---

## Stack Patterns by Variant

**For component detail views with syntax-highlighted code:**
- Use a Server Component that calls `highlightCode()` from `lib/code-highlight.ts`
- Render the resulting HTML using React's `__html` prop (server-rendered, no client eval)
- Theme object uses existing `--sf-code-bg` / `--sf-code-text` / `--sf-code-keyword` OKLCH values from globals.css
- Zero client JavaScript added

**For detail panel expand/collapse:**
- `useRef` on the panel element, measure `panel.current.scrollHeight` before tween
- GSAP `fromTo` with `onComplete: () => gsap.set(panel, { height: 'auto' })` to allow reflow post-animation
- Duration: `--duration-normal` (200ms), easing: `--ease-default`

**For prop table data additions:**
- Extend `ComponentDoc` entries in `lib/api-docs.ts`
- `PropDef` interface already has `name`, `type`, `default`, `desc`, `required` — sufficient for all new components
- No schema validation library needed at this scale

**For remaining SF wrapper components (classification by pattern):**
- P1 direct import: Context Menu, Hover Card, Aspect Ratio, Kbd, Spinner, InputOTP, Input Group, Field
- P3 lazy (`next/dynamic`, `ssr: false`, `meta.heavy: true`): Drawer, Carousel, Resizable
- DEFER to v1.5: Chart (recharts dep), Sidebar (complex dep tree)

---

## Installation

```bash
# Add remaining shadcn base components (CLI handles peer dep installation)
pnpm dlx shadcn@latest add drawer
pnpm dlx shadcn@latest add carousel
pnpm dlx shadcn@latest add input-otp
pnpm dlx shadcn@latest add resizable
pnpm dlx shadcn@latest add context-menu
pnpm dlx shadcn@latest add hover-card
pnpm dlx shadcn@latest add aspect-ratio

# Add syntax highlighting for detail views (server-only, zero client impact)
pnpm add shiki

# Optional — only if SFChart is explicitly in milestone scope
# pnpm add recharts
```

**Verify after shadcn CLI:** check that `package.json` picked up `vaul`, `embla-carousel-react`, `input-otp`, `react-resizable-panels` as direct dependencies. If the CLI did not add them, add manually:

```bash
pnpm add vaul embla-carousel-react input-otp react-resizable-panels
```

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| `vaul@^1.1.2` | React 19, Next.js 15 | React 19 added to peer deps in v1.1.1. Confirmed on npm. |
| `embla-carousel-react@^8.6.0` | React 19, Next.js 15 | v8 resolved the React 19 peer dep issue present in v7. |
| `shiki@^1.x` | Next.js 15 App Router, RSC | Serverless Runtime only — not Edge Runtime (shiki uses lazy imports Edge doesn't support). Project already uses Serverless Runtime default; no config change needed. |
| `react-resizable-panels@^4.x` | React 19, Next.js 15 | shadcn changelog explicitly confirms v4 as current supported version. |
| `input-otp@^1.x` | React 19, Next.js 15 | No reported React 19 issues. Standard form input primitive. |
| `recharts@^3.x` (deferred) | React 19, Tailwind v4 | Chart tokens: use `var(--chart-1)` not `hsl(var(--chart-1))`. OKLCH values in `@theme` already use the correct format — no token migration needed if added later. |

---

## Bundle Impact Assessment

Current baseline: 102 KB shared JS (v1.3 confirmed). Target: stay under 150 KB gate.

| Addition | Initial Bundle Impact | Strategy |
|----------|----------------------|----------|
| `shiki` | 0 KB added to initial | Server-only RSC module; languages/themes load as async chunks on demand |
| `vaul` (SFDrawer) | ~0 KB with P3 pattern | `next/dynamic({ ssr: false })` — same as SFCalendar/SFMenubar (proven in v1.3) |
| `embla-carousel-react` (SFCarousel) | ~0 KB with P3 pattern | `next/dynamic({ ssr: false })` |
| `react-resizable-panels` (SFResizable) | ~0 KB with P3 pattern | `next/dynamic({ ssr: false })` |
| `input-otp` (SFInputOTP) | ~5 KB | Small library; P1 direct import acceptable |
| Context Menu, Hover Card, Aspect Ratio | 0 KB | Covered by existing `radix-ui@^1.4.3` unified package |
| Kbd, Spinner, ButtonGroup, Field, Item, Empty | ~1-2 KB total | Copy-paste components, no external deps |

**Projected bundle after v1.4:** ~107-110 KB — comfortably under 150 KB gate.

---

## Sources

- `https://shiki.style/packages/next` — Shiki Next.js integration, RSC pattern, Serverless Runtime recommendation (HIGH confidence — official docs)
- `https://shiki.style/guide/bundles` — Bundle sizes: full 6.4 MB / 1.2 MB gzip, web 695 KB gzip, core fine-grained approach (HIGH confidence — official docs)
- `https://ui.shadcn.com/docs/components/radix/drawer` — Vaul dependency confirmation (HIGH confidence — official shadcn docs)
- `https://ui.shadcn.com/docs/components/radix/carousel` — Embla Carousel dependency confirmation (HIGH confidence — official shadcn docs)
- `https://ui.shadcn.com/docs/components/radix/resizable` — react-resizable-panels v4 confirmation (HIGH confidence — official shadcn docs)
- `https://ui.shadcn.com/docs/changelog/2025-10-new-components` — October 2025 additions: Spinner, Kbd, ButtonGroup, InputGroup, Field, Item, Empty — no external peer deps (HIGH confidence — official shadcn changelog)
- `https://www.npmjs.com/package/vaul` — vaul v1.1.2, React 19 in peerDependencies (HIGH confidence — npm registry)
- `https://www.npmjs.com/package/embla-carousel-react` — v8.6.0, React 19 support resolved in v8 (HIGH confidence — npm registry)
- `https://gsap.com/community/forums/` — GSAP `scrollHeight` expand pattern, `height: auto` via `onComplete` (MEDIUM confidence — community forums, consistent with observed SFAccordion implementation)
- Codebase analysis — `lib/api-docs.ts`, `components/blocks/api-explorer.tsx`, `components/sf/sf-accordion.tsx`, `package.json` (HIGH confidence — direct inspection)

---

*Stack research for: SignalframeUX v1.4 Feature Complete milestone*
*Researched: 2026-04-06*
