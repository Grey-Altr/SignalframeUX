---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: planning
stopped_at: 35-04 Task 6 COMPLETE — awwwards-description.md authored, OPEN-1 resolved (commit d977953)
last_updated: "2026-04-10T18:00:00.000Z"
last_activity: 2026-04-10
progress:
  total_phases: 26
  completed_phases: 13
  total_plans: 36
  completed_plans: 33
  percent: 92
---

# STATE — SignalframeUX

## Quick Reference

| Property | Value |
|----------|-------|
| Project | SignalframeUX — Design System for Culture Division |
| Core Value | Dual-layer SIGNAL/FRAME model — generative expression through deterministic structure |
| Current Focus | v1.5 Redesign — transform site into Awwwards SOTD-level designed artifact |
| Milestone | v1.5 Redesign |

## Current Position

Phase: 35 — Performance + Launch Gate (ready to start)
Previous: Phase 34 Visual Language + Subpage Redesign — CLOSED 2026-04-09 after human sign-off (fix commit e1e7af5 + hero moment feat commit fcc811d)
Status: Ready to plan
Last activity: 2026-04-09

## Progress

```
v1.0: [██████████] 100% (14/14 plans) MILESTONE COMPLETE — shipped 2026-04-05
v1.1: [██████████] 100% (9/9 plans) MILESTONE COMPLETE — shipped 2026-04-06
v1.2: [██████████] 100% (9/9 plans) MILESTONE COMPLETE — shipped 2026-04-06
v1.3: [██████████] 100% (10/10 plans) MILESTONE COMPLETE — shipped 2026-04-06
v1.4: [██████████] 100% (13/13 plans) MILESTONE COMPLETE — shipped 2026-04-08
v1.5: [█████████_] 95% (19/20 plans) IN PROGRESS — Phases 28-34 CLOSED; Phase 35 Launch Gate pending
```

## v1.5 Phase Map

| Phase | Name | Requirements | Status |
|-------|------|--------------|--------|
| 28 | Route Infrastructure | RA-01, RA-02, RA-03, RA-04 | Complete (2/2 plans) |
| 29 | Infrastructure Hardening | PF-04, PF-05, PF-06 | Not started |
| 30 | Homepage Architecture + ENTRY Section | RA-05, EN-01–05, VL-03, VL-07 | Complete (2/2 plans) |
| 31 | THESIS Section | TH-01–06 | Complete (2/2 plans) |
| 32 | SIGNAL + PROOF Sections | SG-01–05, PR-01–06 | Complete (2/2 plans) |
| 33 | INVENTORY + ACQUISITION Sections | IV-01–06, AQ-01–05 | Complete (4/4 plans) |
| 34 | Visual Language + Subpage Redesign | VL-01, VL-02, VL-04–06, SP-01–05 | Complete (4/4 plans shipped, Nyquist-compliant 77/77, human sign-off 2026-04-09) |
| 35 | Performance + Launch Gate | PF-01–03, LR-01–04 | Ready to start |

## Accumulated Context

### From v1.0 (Carried Forward)

- Token system locked: 9 blessed spacing stops, 5 semantic typography aliases, 5 layout tokens, tiered color palette (core 5 + extended), animation durations/easings
- 29 SF-wrapped components (24 interactive + 5 layout primitives)
- SIGNAL layer: ScrambleText, asymmetric hover (100ms/400ms), 34ms hard-cut, canvas cursor, stagger batch
- DX: SCAFFOLDING.md (337 lines), JSDoc coverage, DX-SPEC.md with deferred interface sketches

### From v1.1

- Singleton WebGL infrastructure: SignalCanvas, useSignalScene, color-resolve with TTL cache
- Multi-sensory SIGNAL: audio (Web Audio), haptics (Vibration API), idle animation (grain drift + OKLCH pulse)
- Generative scenes: SignalMesh (Three.js), TokenViz (Canvas 2D), GLSLHero (GLSL + Bayer dither)
- SF primitives consumed across all 5 pages (32 SFSection instances)
- Three.js in async chunk (102 kB initial shared bundle)

### From v1.2

- FND-01 FIRST: --signal-* CSS var defaults must exist before INT-04 wiring — missing defaults cause magenta flash via color-resolve.ts fallback
- INT-04 performance rule: NO per-frame getComputedStyle() — module-level cache + MutationObserver or direct invalidation from SignalOverlay
- --signal-accent is a float (hue degrees), not a color token — use parseFloat() directly, never resolveColorToken
- DX-05 SSR boundary: "hole in the donut" pattern mandatory — SignalframeProvider is 'use client' but {children} remain Server Components
- STP-01 hydration safety: render default state first, read sessionStorage only in useEffect after mount
- bgShift type fix: fix all consumer call sites in same commit, never @ts-ignore, run tsc --noEmit before and after

### From v1.3

- rounded-none everywhere: Radix-generated `rounded-full` and `rounded-md` survive the global `--radius: 0px` token. Every SF wrapper must apply `rounded-none` explicitly on every sub-element.
- Barrel directive rule: `sf/index.ts` must remain directive-free permanently. `'use client'` in the barrel turns all 5 layout primitives into Client Components and silently inflates the bundle.
- Bundle budget gate: Measured baseline 103KB shared; hard limit 200KB; gate at 150KB. Calendar and Menubar are P3/lazy — non-negotiable. Run `ANALYZE=true pnpm build` after every P1 component.
- CVA `intent` prop: Every new SF wrapper uses `intent:` as the CVA variant key. Never `variant`, `type`, `status`, or `color`.
- Same-commit rule: Component file + barrel export + registry entry must land in one commit. No partial shipments.
- Toast position: SFToaster defaults to `bottom-left` with `--z-toast: 100`. SignalOverlay occupies `bottom-right` at z~210 — the two must never overlap.
- SFProgress before SFStepper: Hard dependency — Stepper uses Progress fill as step connector.
- Calendar/Menubar lazy: Both use `next/dynamic` with `ssr: false` and are NOT exported from `sf/index.ts` barrel.
- Component count at v1.3 ship: 49-item registry, 45 SF components total (includes 5 layout primitives)

### From v1.4

- **Phase ordering is dependency-forced**: tech debt → tokens → components → detail data → detail views → verification. Do not reorder.
- **MutationObserver disconnect FIRST**: Detail views dramatically increase mount/unmount frequency. Observer accumulation without disconnect causes WebGL jank. TD-01 MUST precede Phase 25.
- **ComponentDetail as DOM sibling**: The panel must be rendered after the GSAP Flip grid div, NOT inside it. Child position corrupts Flip state captures during filter animations. See DV-11.
- **next/dynamic for ComponentDetail**: Bundle gate compliance is non-negotiable. Import all 49 component previews at top-level = bundle balloon. DV-12 is not optional.
- **shiki/core only**: Use `shiki/core` fine-grained (~50-80 KB async, server-only). Never `shiki/bundle/web` (695 KB gzip) or `shiki/bundle/full` (6.4 MB).
- **Z-index contract**: Canvas cursor at z-500; detail panel must use `--z-overlay` token; add `[data-modal-open]` CSS rule dropping cursor z-index below panel when open. See SI-04.
- **lenis.scrollTo only**: Any programmatic scroll from detail view code must use `lenis.scrollTo`. Never `window.scrollTo`. Grep check before Phase 25.
- **vaul transitive check**: vaul may already be present transitively via Sonner. Check `pnpm-lock.yaml` before Phase 23 begins.
- **Bundle gate at v1.4 ship**: 100.0 KB gzip shared bundle (50 KB under 150 KB gate)
- **Lighthouse at v1.4 ship**: 100/100 all categories confirmed against deployed URL

### v1.5 Critical Constraints (from Research)

- **Infrastructure before features**: fonts-ready, overscroll-behavior, Lenis audit, and Observer registration MUST precede any new scroll or WebGL work. Phase 29 is non-negotiable before Phase 30+.
- **MutationObserver consolidation before 3rd WebGL scene**: Phase 32 (SIGNAL section) adds a 3rd concurrent WebGL scene. Singleton Observer consolidation must be complete — confirmed at Phase 29 close.
- **PinnedSection before THESIS**: PinnedSection component must exist and be tested in isolation (Phase 29) before Phase 31 uses it for 200-300vh manifesto scroll.
- **LCP suppression hazard**: `SIGNALFRAME//UX` heading must NOT use `opacity: 0` as its start state. Use `opacity: 0.01` or `clip-path` reveal. Applies to Phase 30 ENTRY implementation.
- **iOS Safari address bar**: `ignoreMobileResize: true` must be confirmed in Lenis config at Phase 29. Do not defer.
- **WebGL context limit on mobile**: Safari iOS enforces 2-8 WebGL contexts. SignalCanvas scissor singleton already handles this — do not create additional renderers in Phase 32.
- **Manifesto copy is a Phase 31 dependency**: The scroll manifesto engineering (TH-01 through TH-06) requires finalized text content covering SIGNAL/FRAME thesis, Enhanced Flat Design position, and cybernetic biophilia — as statements, not explanations. Resolve content before Phase 31 planning.
- **SF//[CAT]-NNN schema**: The 6 category abbreviations for coded nomenclature must be validated against all 49 registry components before Phase 33 implementation begins.
- **Route rename first**: RA-01 through RA-04 (Phase 28) uses `next.config.ts` redirects (308 permanent). Confirm redirect config syntax for Next.js 15.3 before writing.
- **SIGNAL/FRAME ordering**: Always written as SIGNAL/FRAME (signal first), never FRAME/SIGNAL, in all code comments, docs, and UI labels.
- **Zero new npm packages**: All animation via GSAP ScrollTrigger + Lenis (already in stack). No new runtime dependencies in v1.5.
- **Physical iOS Safari testing**: Mandatory after Phase 32. Simulators do not replicate address bar behavior.

### Decisions

| Decision | Rationale |
|----------|-----------|
| 8 phases (28-35) not 9 | Observer consolidation absorbed into Phase 29 Infrastructure Hardening — avoids a phase with zero explicit requirement coverage |
| Phase 28 first (route renames) | Zero risk, zero dependencies; permanent redirects land before any structural work touches the pages |
| Phase 29 (infrastructure) before Phase 30 (homepage) | Lenis, fonts-ready, Observer, and PinnedSection must all be proven before scroll-driven features build on them |
| THESIS in its own phase (31) | 200-300vh manifesto is the primary SOTD signature interaction — deserves isolated delivery boundary and content dependency callout |
| SIGNAL + PROOF together in Phase 32 | Both are full-viewport sections with WebGL involvement; shipping together respects the 3rd-scene Observer dependency |
| INVENTORY + ACQUISITION together in Phase 33 | Both deliver the catalog experience; ACQUISITION depends on INVENTORY section slot existing |
| Visual language + subpages together in Phase 34 | Ghost labels and HUD indicators apply across all subpages — more efficient to audit and apply globally in one phase |
| Phase 35 is standalone verification | Launch gate is a hard gate, not implementation work — isolated phase keeps it verifiable and non-skippable |

- [Phase 28]: phase-28-route-infra.spec.ts retains old route strings — intentional redirect verification tests, not stale nav links
- [Phase 28]: sitemap.ts uses template literals (${BASE}/route) not quoted strings — grep pattern must account for this syntax
- [Phase 29]: autoResize: false instead of ignoreMobileResize: true — Lenis 1.3.x dropped ignoreMobileResize; autoResize: false is the equivalent for iOS address bar resize suppression
- [Phase 29]: token-viz is static single-frame render — no rAF guard needed, reduced-motion coverage comment added to satisfy PF-06 audit
- [Phase 29]: canvas-cursor and xray-reveal classified as pointer-driven (exempt from reduced-motion guard — rAF only fires on pointer move)
- [Phase 30-01]: page.tsx converted from async Server Component to sync — ComponentGrid removed from homepage eliminates all highlight() pre-computation
- [Phase 30-01]: opacity: 0.01 on hero h1 (not opacity: 0) per LCP safety rule D-08 — allows LCP measurement while visually invisible until animation
- [Phase 30-01]: Playwright font-size assertion uses 100px floor (not 120px spec minimum) to handle smaller test viewport; 120px minimum applies at full viewport width per clamp()
- [Phase 34-01]: InstrumentHUD is a singleton mounted in app/layout.tsx with no props — selector hardcoded to `[data-section]`. Per-frame fields (scroll%, SIG intensity) use scrollRef/sigRef + requestAnimationFrame direct textContent writes; NEVER useState in the rAF loop.
- [Phase 34-01]: Nav reveal decoupled from `nav.tsx` entirely. `useNavReveal(triggerRef)` flips `body.dataset.navVisible`; CSS `body[data-nav-visible="true"] .sf-nav-hidden` mirrors the flag. `NavRevealMount` per-page client island resolves the target selector and drives the hook. Nav itself no longer imports `ScrollTrigger`.
- [Phase 34-01]: GhostLabel deployment locked to brief pair (app/page.tsx THESIS + app/system/page.tsx hero); playwright test greps those exact files — children block files DO NOT count toward the count.
- [Phase 34-01]: Magenta audit is a tactical CSS-rule count proxy, not canonical visual moments. 5 target files held to ≤5 grep hits; canonical per-page moment count deferred to Phase 34 umbrella verification.
- [Phase 34-01]: Breadcrumb auto-prepends `[SFUX]` root (coded `[SFUX]//[SEGMENT]` format) — consumer pages pass only their own segments; the root never needs to be wired up.
- [Phase 34-03]: /init register reframe is STRUCTURAL, not copy-only. NEXT_CARDS / SETUP_CHECKLIST / COMMUNITY BAND violate the locked bringup-sequence register at the LAYOUT level (cards-with-CTAs, checklist-with-checkboxes, community-invite-band) — no copy rewrite can rescue a `<div className="grid grid-cols-3">{NEXT_CARDS.map(...)}</div>` into register. Brief's "copy rewrite first" gate is bypassable when the structure itself violates the register at the layout level.
- [Phase 34-03]: Terminal footer LOCKED literal is `[OK] SYSTEM READY` — not `[EXIT 0]`, not `[OK] BOOT COMPLETE` (Wipeout-instruction-booklet authority). Tests grep for this exact string.
- [Phase 34-03]: Coded indicator mapping is a RENDER-only const `CODES = ["INIT","HANDSHAKE","LINK","TRANSMIT","DEPLOY"]` inside `STEPS.map((step, i) => ...)` — STEPS data array is NEVER mutated. Step number (01-05) comes from `step.number`, code label from `CODES[i]`.
- [Phase 34-03]: Plan JSX sketches can contradict 34-01 brief-locks — the 34-03 plan sketch included `<GhostLabel text="INIT" />` on /init, but VL-01 brief-lock (enforced by 34-01 spec test line 173-178) restricts GhostLabel to app/page.tsx + app/system/page.tsx only. Test is canonical; plan sketch was wrong. Verify brief-locks in the canonical test file before following plan sketches.
- [Phase 34-03]: Parallel Wave 2 executors can race on shared state files (STATE.md, ROADMAP.md) — the filesystem watcher and autoformatter can silently revert unstaged `.planning/*.md` edits when sibling executors commit. Fix: `git add .planning/FILE.md` immediately after every Edit, before any subsequent Edit or Bash call. Do not rely on batching edits and staging later.
- [Phase 34]: [Phase 34-02]: ColorSpecimen owns its own visibleScales slice; TokenTabs no longer computes visibleScales locally. Data arrays stay in token-tabs.tsx orchestrator and pass into specimens as props.
- [Phase 34]: [Phase 34-02]: Specimen prop types match live data array shapes (px: number, size: number); plan sketch had drifted to string types. Always read source before writing props.
- [Phase 34]: [Phase 34-02]: ColorSpecimen is 'use client' (keyboard nav + focus state); SpacingSpecimen, TypeSpecimen, MotionSpecimen are Server Components (pure render, no interactivity).
- [Phase 34]: 34-04: DataDrivenDoc replaced by file-private EntryDataSheet — shadcn chrome (SFTable/SFTabs/SFBadge) conflicts with schematic register; zero SF-wrapper imports in final api-explorer.tsx
- [Phase 34]: 34-04: Surface groups classified via API_DOCS[id].layer (HOOK->HOOKS, TOKEN->TOKENS, CORE/FRAME/SIGNAL->COMPONENTS) not NAV_SECTIONS.title — authoritative data field wins
- [Phase 34]: 34-04: HudTelemetry sub-component dropped — InstrumentHUD site-wide from 34-01 carries cockpit role globally, duplicating on /reference dilutes register
- [Phase 35-02]: All runtime Playwright tests (nav-reveal, HUD, DOM, LCP, CLS) are ERR_CONNECTION_REFUSED when no server is running — Wave 1 test authoring does not require a live server; Wave 3 re-runs against pnpm build && pnpm start
- [Phase 35-02]: schematic register font-mono source-read targets wrong file — font-mono lives in components/blocks/api-explorer.tsx (lines 166, 181, 291, 315), not app/reference/page.tsx; test path fix is Wave 3 triage item
- [Phase 35-02]: PF-01 bundle gate is server-independent — reads .next/build-manifest.json directly; passes even without a running server; confirmed 100.0 KB gzip (50 KB under 150 KB gate)
- [Phase 34]: 34-04: Rule 1/2 auto-fix horizontal scroll at 375px (Footer URL break-all, /reference header responsive grid, api-explorer filter bar min-w-0) landed accidentally in sibling 34-03 docs commit due to parallel-wave git race; code correct, attribution wrong, no rollback
- [Phase 35-03]: OG image mono font is GeistMono (Option A — Grey 2026-04-09 ~20:40 PDT), not JetBrains Mono. Live site uses JetBrains Mono; OG image intentionally diverges to honor brief §LR-02 literal "GeistMono" reference. Sourced from geist@1.7.0 npm package.
- [Phase 35-03]: chrome-launcher is a transitive dep of lighthouse — pnpm doesn't hoist it, so TypeScript can't resolve the ES import. Typed via inline interface shim in scripts/launch-gate.ts; runtime (tsx) resolves correctly.
- [Phase 35-03]: OPEN-2 (metadataBase URL) unresolved — app/layout.tsx metadata edit (Task 4) BLOCKED until Grey confirms production URL. Default candidate: https://signalframeux.vercel.app (from app/sitemap.ts).
- [Phase 35]: OPEN-2 resolved: metadataBase is https://signalframe.culturedivision.com (Grey 2026-04-10) — SF//UX ships under Culture Division domain
- [Phase 35]: 35-03: Do not specify openGraph.images or twitter.images — file-based convention takes precedence; double-specification triggers Next.js warning

### Blockers

- **Manifesto copy**: ✅ RESOLVED — 6 wiki-locked statements shipped in Phase 31 (`lib/thesis-manifesto.ts`)
- **SF//[CAT]-NNN schema**: 6 category abbreviations not yet validated against full 49-item registry. Must be resolved before Phase 33 planning begins. (Research gap noted 2026-04-07)

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-07)

**Core value:** Dual-layer SIGNAL/FRAME model — generative expression through deterministic structure
**Current focus:** v1.5 Redesign — transform site into Awwwards SOTD-level designed artifact

## Session Continuity

Last session: 2026-04-10T16:58:45.454Z
Stopped at: Completed 35-03-PLAN.md — metadataBase wired, all 5 tasks done
Resume with: Grey resolves OPEN-2 in OPEN-ITEMS.md, then re-run plan 35-03 as continuation (Tasks 3+4 remaining).
