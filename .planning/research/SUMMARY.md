# Research Summary — SignalframeUX v1.2 Tech Debt Sweep

**Synthesized:** 2026-04-06
**Sources:** STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md
**Scope:** Registry distribution (DX-04), config provider API (DX-05), session persistence (STP-01), CSS→WebGL bridge (INT-04), SignalMotion wiring (INT-03), bgShift type fix

---

## Executive Summary

v1.2 is a wiring and completion milestone, not a feature expansion. Every work item is either completing something scaffolded but not finished (registry.json, SignalMotion placement), wiring an existing component that is fully implemented but disconnected (SignalOverlay→WebGL bridge), fixing a confirmed type mismatch (bgShift boolean vs. string), or implementing interface sketches that were deferred from v1.1 with open design questions that can now be resolved (createSignalframeUX, session persistence). The research confirms this framing — no new libraries are required except `nuqs` (6 kB, zero runtime deps) for URL-encoded filter/tab state, and all architectural decisions reduce to using existing patterns already proven in this codebase.

The primary risk area is performance: the CSS→WebGL bridge (INT-04) must use module-level cached values rather than per-frame `getComputedStyle` calls to protect the Lighthouse 100/100 Performance score. The `--signal-*` vars change only on user interaction with SignalOverlay, making per-frame DOM reads wasteful and harmful. Every other risk is a standard Next.js App Router hydration concern (context providers, session storage) with well-documented mitigations. The research resolves all open questions from DX-SPEC.md with high confidence.

The recommended build order runs from zero-risk to higher-risk: globals.css defaults first (unblocks INT-04, prevents magenta flash), bgShift type fix second (independent, TypeScript-only), registry.json completion third (additive, zero behavioral change), INT-04 bridge fourth (most impactful Signal feature), INT-03 SignalMotion fifth (placement only), DX-05 provider sixth (most complex, SSR boundary work), STP-01 session persistence last (self-contained, page-local). Each step is independently committable with a clean rollback point.

---

## Key Findings

### From STACK.md

| Technology | Decision | Rationale |
|------------|----------|-----------|
| `nuqs ^2.8.9` | Add (only new runtime dep) | URL state for filter/tab; NuqsAdapter for App Router; 6 kB gzipped, zero dependencies |
| `shadcn build` | Use existing (already in devDeps) | Generates per-component `/r/[name].json` files; no new install required |
| Native React context | Use existing | Factory pattern for `createSignalframeUX` — ~30 lines, no library needed |
| `sessionStorage` (native) | Use existing | Scroll position persistence; tab-scoped, correct semantics |
| `getComputedStyle` in GSAP ticker | Use existing (with cache) | CSS var→WebGL bridge; pattern already proven in `color-resolve.ts` and `canvas-cursor.tsx` |

**Version constraints:** nuqs requires Next.js 14.2+ and React 18+ (both met). No other version concerns.

**What was rejected:**
- `@bramus/style-observer` — GSAP ticker solves CSS var reading without it
- `zustand` / `jotai` — overkill for read-only config context
- `use-local-storage` — native sessionStorage API is sufficient

### From FEATURES.md

**DX-04: registry.json**

Table stakes:
- Per-component JSON at `/r/[name].json` — CLI fetches individual JSON, not the root manifest. Currently absent; `shadcn build` generates these.
- `registryDependencies` populated on all SF-wrapped components
- All 29 SF components + 5 layout primitives present (layout primitives currently missing from registry)
- `cssVars` block on a `sf-theme` registry item — delivers the token layer as an installable unit

Differentiators:
- `meta: { layer: "frame" | "signal" }` — mirrors the core SF dual-layer model
- `meta: { pattern: "A" | "B" | "C" }` — mirrors integration pattern classification from SCAFFOLDING.md
- `categories` array populated for registry browser filtering
- `sf-theme` token-only item — highest-leverage addition; consumers get just the token system

Defer to post-v1.2:
- `shadcn build` as automated CI step (manual build + commit is acceptable for v1.2)

**DX-05: createSignalframeUX + useSignalframe**

Table stakes:
- `SignalframeUXProvider` — wraps app root, reads `data-theme` from DOM on mount, delegates to existing `toggleTheme()` in `lib/theme.ts`
- `useSignalframe()` — returns `{ theme, setTheme, motion }`. Throws descriptive error if called outside Provider.
- `motion.prefersReduced` boolean + `motion.pause()` / `motion.resume()` (thin wrappers over `gsap.globalTimeline`)
- SSR-safe: stable `theme: "dark"` default on server; hydrate from `localStorage` + classList in `useEffect`

Defer to post-v1.2:
- `tokens.colorPrimary` / resolved OKLCH values — requires DOM Canvas 2D probe, SSR mismatch risk; `resolveColorToken` utility already covers this use case separately

**STP-01: Session Persistence**

Table stakes:
- `useSessionState<T>(key, default)` generic hook — ~25 lines, `useState` + `useEffect` read pattern
- Component browser: `activeFilter` + `searchQuery` persisted in `sessionStorage`
- Token explorer: `activeTab` persisted in `sessionStorage`
- Scroll restoration on `/components` page

Differentiators:
- `lastUpdated` timestamp for staleness detection
- Versioned storage keys (`sf-filters-v1`) to handle filter schema changes without stale state

Avoid:
- URL search params as primary persistence (breaks bookmarks, adds URL noise)
- localStorage (too persistent, cross-session contamination)
- Global React context for session state (page-local state does not warrant it)

### From ARCHITECTURE.md

**Existing architecture baseline (locked from v1.0/v1.1):**
- GSAP ticker is the only render driver for WebGL — no independent rAF loops
- Three.js in async chunk — 102 kB initial bundle maintained
- Server Components default; `'use client'` only when required
- Document-level event listener pattern proven (audio/haptics/global effects)

**Component boundary changes for v1.2:**

| Item | Type | Location |
|------|------|----------|
| SignalMotion placement | Modified (pages) | `app/page.tsx` + showcase pages |
| INT-04 WebGL bridge | Modified (WebGL scenes) | `glsl-hero.tsx`, `signal-mesh.tsx` |
| globals.css signal defaults | Modified | `app/globals.css` |
| SFSection bgShift type | Fixed | `components/sf/sf-section.tsx` |
| registry.json | Extended | `registry.json` |
| SignalframeUXProvider | New | `lib/signalframe-provider.tsx` |
| `createSignalframeUX` factory | New | `lib/signalframe-provider.tsx` (same file) |
| Session persistence | Modified (block) | `components/blocks/components-explorer.tsx` |

**Key data flow addition — INT-04:**
```
SignalOverlay slider
  → :root CSS var
  → GSAP ticker (next frame, ~16ms)
  → module-level cache read
  → WebGL uniform mutation
  → Three.js render
```

**Resolved DX-SPEC.md open questions:**
- Provider vs singleton: Provider (thin), wraps existing `toggleTheme` singleton, does not replace it
- Token resolution in hook: out of scope for v1.2; `useSignalframe` covers theme + motion only
- Motion scope: global GSAP timeline only — `motion.pause()` = `gsap.globalTimeline.pause()`
- Session storage backend: `sessionStorage` (tab-local); no URL params, no global context
- Session hydration timing: `useEffect` (client-only); default empty state on SSR, restore on mount

### From PITFALLS.md

**Critical pitfalls (will break the system if missed):**

**1. Per-frame `getComputedStyle` kills Lighthouse Performance (INT-04)**
- `getComputedStyle` forces synchronous layout on every GSAP tick (60fps)
- `--signal-*` vars change only on user interaction — per-frame DOM reads are wasteful
- Prevention: module-level cache variables; update via MutationObserver on `:root` style attribute; ticker reads the cached value, never the DOM
- Detection: Chrome DevTools flame chart shows `Recalculate Style` on every frame

**2. Missing `--signal-*` CSS var defaults cause magenta flash (INT-04)**
- `color-resolve.ts` fallback returns magenta for empty CSS var values
- Prevention: declare `--signal-intensity: 0.5; --signal-speed: 1; --signal-accent: 0` in globals.css BEFORE writing any WebGL uniform reads
- This is the first action in INT-04, no exceptions

**3. Config provider context infection of Server Components (DX-05)**
- React context requires `'use client'`; incorrect placement forces Server Component subtrees into client bundle
- Prevention: "hole in the donut" pattern — `SignalframeProvider` is `'use client'`, but `{children}` passed to it remain Server Components
- Detection: `next build` errors or bundle analyzer shows layout primitives in client chunk

**4. Session persistence causes hydration mismatch (STP-01)**
- Reading `sessionStorage`/`localStorage` during render produces server/client HTML mismatch
- Prevention: render default state first; read storage only in `useEffect` after mount
- Tab state is most dangerous (different children rendered) — consider cookies if CLS is a concern

**Moderate pitfalls:**

**5. `--signal-accent` passed through color canvas probe receives black (INT-04)**
- `--signal-accent` is a plain float (hue degrees), not a color token
- Prevention: `parseFloat(getPropertyValue('--signal-accent'))` directly — never `resolveColorToken`

**6. Registry nested file paths fail shadcn CLI (DX-04)**
- Prevention: flat registry structure with `files[].target` set explicitly per file entry

**7. bgShift type fix propagates TypeScript errors to consumer call sites**
- Prevention: `tsc --noEmit` before and after; fix all consumer errors in the same commit; never `@ts-ignore`

**8. Stale filter slugs after component rename (STP-01)**
- Prevention: version storage keys (`sf-filters-v1`); use canonical enum keys, not display labels

---

## Implications for Roadmap

### Recommended Phase Structure

**Phase 1: Foundation — globals.css defaults + bgShift type fix**
- Rationale: Zero-dependency changes. Must precede INT-04 (CSS var defaults) and any SFSection work. Run `tsc --noEmit` baseline before the type fix; commit each change independently.
- Delivers: Correct initial CSS var defaults (prevents magenta flash); TypeScript-clean bgShift prop
- Pitfalls to avoid: Fix all consumer call sites in the same commit; never `@ts-ignore`
- Research flag: Not needed

**Phase 2: Registry Completion (DX-04)**
- Rationale: Purely additive. Source `registry.json` already exists and is correctly structured. Adding layout primitives + running `shadcn build` is low-risk, high distribution value. Run `pnpm shadcn build` early to confirm Turbopack/Next.js 15 compatibility.
- Delivers: Full 29-component + 5-primitive registry; `sf-theme` cssVars item; `/r/[name].json` auto-generated for all components; CLI-installable
- Pitfalls to avoid: Flat structure with explicit `target` paths; `registryDependencies` on all SF-wrapped components; validate against shadcn schema before publishing
- Research flag: Not needed — shadcn registry docs are authoritative and HIGH confidence

**Phase 3: CSS→WebGL Bridge (INT-04) + SignalMotion (INT-03)**
- Rationale: INT-04 depends on Phase 1 (globals.css defaults must exist). INT-03 is independent but belongs here as the other wiring work. Together they complete the SIGNAL layer — the most visible user-facing improvement in v1.2.
- Delivers: SignalOverlay sliders visually affect GLSL hero and signal mesh shaders; scroll-scrub motion on 4 homepage sections (MANIFESTO, SIGNAL/FRAME, API, COMPONENTS)
- Pitfalls to avoid: Module-level cache from day one; `--signal-accent` as `parseFloat` never `resolveColorToken`; verify reduced-motion path for SignalMotion
- Research flag: Not needed — bridge pattern confirmed from existing codebase

**Phase 4: Config Provider (DX-05)**
- Rationale: Most architecturally complex item. Benefits from Phases 1–3 being stable. SSR boundary must be designed before code is written — the provider architecture is a commit-once decision.
- Delivers: `createSignalframeUX(config)` factory; `SignalframeUXProvider` in root layout; `useSignalframe()` hook with theme, setTheme, motion.pause/resume, motion.prefersReduced
- Pitfalls to avoid: "Hole in the donut" pattern mandatory; `children` must stay Server Components; provider reads `localStorage("sf-theme")` same key as inline blocking script; no token resolution in v1.2 hook
- Research flag: Not needed — all open questions from DX-SPEC.md resolved

**Phase 5: Session Persistence (STP-01)**
- Rationale: Self-contained page-level work. Runs last because ComponentsExplorer is also the demo surface for the registry — having DX-04 complete first means the explorer is fully populated when session state is added.
- Delivers: Filter/search state persists on `/components`; tab state persists on `/tokens`; scroll restoration on `/components`
- Pitfalls to avoid: Read in `useEffect` only; version the storage key before implementation; no hydration warnings; Lighthouse CLS unchanged
- Research flag: Not needed

**Phase 6: Documentation Cleanup**
- Rationale: SCAFFOLDING.md needs `useSignalframe()` API contract; SFSection JSDoc needs bgShift update; tech debt items in PROJECT.md need resolution marks.
- Delivers: System documentation reflects v1.2 state
- Research flag: Not needed

### Build Order Summary

```
Phase 1: globals.css defaults + bgShift type fix     60 min   zero deps
Phase 2: registry.json completion + shadcn build     90 min   additive
Phase 3: INT-04 WebGL bridge + INT-03 SignalMotion   3-5 hr   Phase 1 required
Phase 4: createSignalframeUX + useSignalframe         3-4 hr   Phases 1-3 stable
Phase 5: session persistence                          2-3 hr   Phase 2 helpful
Phase 6: docs cleanup                                30-60 min all phases done
```

Total estimated: 10–14 hours of implementation.

---

## Research Flags

| Phase | Research Needed | Reason |
|-------|-----------------|--------|
| Phase 1 | No | Mechanical changes; no design decisions |
| Phase 2 | No | shadcn registry spec is authoritative and HIGH confidence |
| Phase 3 | No | Bridge pattern proven in existing codebase; no unknowns |
| Phase 4 | No | DX-SPEC.md open questions fully resolved; App Router patterns well-documented |
| Phase 5 | No | sessionStorage + useEffect is standard; no new patterns |
| Phase 6 | No | Documentation only |

No phases require `/pde:research-phase`. All critical unknowns are resolved by this research pass.

---

## Confidence Assessment

| Area | Confidence | Basis |
|------|------------|-------|
| Stack (new deps) | HIGH | Official shadcn docs; nuqs official docs; native React APIs |
| Features (DX-04) | HIGH | Official shadcn registry spec verified; current registry.json audited against live codebase |
| Features (DX-05) | HIGH | DX-SPEC.md open questions resolved against actual codebase; MUI/Radix/Ant Design patterns confirmed |
| Features (STP-01) | HIGH | sessionStorage native; hydration pattern from official Next.js docs |
| Architecture (INT-04) | HIGH | Pattern verified from `canvas-cursor.tsx` line 41, `color-resolve.ts` lines 104–120 |
| Architecture (INT-03) | HIGH | `signal-motion.tsx` confirmed complete; placement is mechanical |
| Architecture (bgShift) | HIGH | Type mismatch confirmed by reading `sf-section.tsx` and `app/page.tsx` side-by-side |
| Pitfalls (performance) | HIGH | `getComputedStyle` forced layout documented (Paul Irish, MDN); Lighthouse TBT mechanism confirmed |
| Pitfalls (hydration) | HIGH | Official Next.js hydration error docs; FluentReact useEffect pattern |

**Overall confidence: HIGH**

### Gaps (Non-Blocking)

- **`shadcn build` in Turbopack/Next.js 15 context:** Expected to work (shadcn 4.1.2 already in devDeps). Run `pnpm shadcn build` early in Phase 2 to confirm before building out the full registry.
- **`--signal-accent` shader math:** Bridge pattern is confirmed. Specific GLSL hue rotation math for `uAccent` is an implementation-time decision, not a research gap.
- **Cache invalidation mechanism for INT-04:** MutationObserver on `:root` style attribute vs. direct `invalidateSignalCache()` call from SignalOverlay — either works. Implementation choice.

---

## Sources (Aggregated)

**HIGH confidence:**
- shadcn/ui registry documentation (ui.shadcn.com/docs/registry)
- shadcn/ui registry-item.json spec (ui.shadcn.com/docs/registry/registry-item-json)
- nuqs GitHub + homepage (github.com/47ng/nuqs, nuqs.dev)
- Next.js Server and Client Components docs (nextjs.org/docs/app/getting-started/server-and-client-components)
- Next.js hydration error docs (nextjs.org/docs/messages/react-hydration-error)
- MDN — Window.getComputedStyle (forced layout documentation)
- What forces layout/reflow — Paul Irish (gist.github.com/paulirish/5d52fb081b3570c81e3a)
- Codebase: `glsl-hero.tsx`, `signal-canvas.tsx`, `canvas-cursor.tsx`, `color-resolve.ts`, `signal-overlay.tsx`, `signal-motion.tsx`, `sf-section.tsx`, `app/page.tsx`, `app/globals.css`, `lib/theme.ts`
- Codebase: `.planning/DX-SPEC.md`, `registry.json`, `public/r/registry.json`

**MEDIUM confidence:**
- InfoQ nuqs 2.5 article (industry adoption data)
- SSR-Safe React Hooks — ReactUse blog 2025
- Next.js scroll position persistence discussion (github.com/vercel/next.js/discussions/60146)
- Ant Design ConfigProvider docs
- Nicolas Mattia — CSS+WebGL color resolution (2025-01-29)

---

*Synthesized by: gsd-research-synthesizer*
*For: gsd-roadmapper (v1.2 roadmap phase structuring)*
*Date: 2026-04-06*
