# LOCKDOWN AUDIT · COMPONENT VERDICTS

**Status:** complete — all 6 sections walked; §6 rules (R-61, R-62) redlined into LOCKDOWN.md v0.1.1 (task #7 ✓).
**Date begun:** 2026-04-21 (session 1)
**Last worked:** 2026-04-22 (session 4 — redline close)
**Source:** INDEX.md walk — one-by-one verdict per component.

---

## Legend

- **KEEP** — ships in v0.1 as-is
- **KEEP — reference template** — file retained as design reference for future layout generation (dead code, intentional)
- **REFINE** — shipped refactor applied; see linked commit
- **FIX** — bug shipped; see linked commit
- **DEFER** — post-v0.1 tracking task created
- **KILL** — remove from v0.1 (none yet)

---

## Section 1 · Live routes (7) — complete

| # | Route | Verdict | Notes |
|---|---|---|---|
| 1.1 | Homepage `/` (6-block sequence) | KEEP sequence | 4 blocks flagged, resolved in Section 2 |
| 1.2 | `/system` | KEEP | Distinct from /reference (visual vs textual token lanes) |
| 1.3 | `/inventory` | KEEP | Overlay-on-click pattern locked |
| 1.4 | `/reference` | KEEP | Engineer lane — earns its route vs /system |
| 1.5 | `/init` | KEEP | First-class onboarding surface |
| 1.6 | `/builds` | KEEP | Dossier landing (cdb-v3 branch active) |
| 1.7 | `/builds/[slug]` | KEEP | Plate detail route for dossier |

---

## Section 2 · Homepage blocks (6) — complete

| # | Block | Verdict | Commit / Notes |
|---|---|---|---|
| 2.1 | ENTRY | KEEP | Pixel-sort + VL-05 magenta moment intact |
| 2.2 | THESIS | FIX | `4866bdb` — portal PinnedSection out of ScaleCanvas transform |
| 2.3 | PROOF | FIX | `35aa254` — HUD IntersectionObserver fix + SignalCanvas rAF loop. Light-mode shader contrast deferred (task #10) |
| 2.4 | INVENTORY | REFINE | `61eb02d` — flex-fill viewport + stagger-reveal animation |
| 2.5 | SIGNAL | REFINE | `8cdb24c` — FRAME overlay (headline + data row) for dual-layer legibility |
| 2.6 | ACQUISITION | KEEP | CTA + terminal command + stats block working |

### Section 2 deferred (post-v0.1)
- Task #10 — PROOF shader light-mode contrast tuning
- Task #11 — SIGNAL section 150vh parallax restoration
- Task #12 — MotionSpecimen data array is incomplete vs CLAUDE.md spec (missing `--duration-instant` / `--duration-glacial` / `--ease-spring` entries) — audit the source-of-truth motion token data file and reconcile.

### Engineering insights surfaced
- **ScaleCanvas + viewport pinning incompatibility.** `transform: scale()` on a global wrapper hijacks `position: fixed`, `position: sticky`, and `pinType:"transform"` containing-block resolution. Only escape: DOM reparenting via portal. Any future pinned section must be portal-aware from day one. (PinnedSection now encodes this.)
- **gsap.ticker registration unreliable for SignalCanvas.** Callback registered via `gsap.ticker.add()` never fired in prod even though Lenis's registration on the same ticker did. Switched SignalCanvas to plain `requestAnimationFrame` loop. Module-duplication or plugin-registration side-effect suspected; not worth chasing further.
- **HUD IntersectionObserver ratio-compare bug (Phase 30 latent).** Callback only compared ratios from `entries` (sections whose threshold crossed this tick), not all observed. Fix: each callback recomputes all sections from `getBoundingClientRect`.
- **Borderless-mode `!important` vs inline styles.** `[data-borderless="true"] :where([class*="border"], ...) { background-color: var(--color-muted) !important }` used `!important` to beat Tailwind class specificity, but it also beat *inline* styles — silently repainting any inline-background element that happened to use a border-* utility. Going forward: in borderless mode, use normal specificity (class selectors already win over `:where()` without `!important`). Inline-styled visualizations (swatches, signal canvases) must stay authoritative.

---

## Section 3 · Block-level components (19) — complete

| # | Component | Verdict | Notes |
|---|---|---|---|
| 3.1 | Hero (orphan) | KEEP — reference template | Legacy two-panel hero (`HeroMesh` bg + SIGNAL//FRAME headline). Retained as layout-generation reference. |
| 3.2 | APIExplorer | REFINE | `52fafbd` — row density py-3 → py-1, flex → grid with tabular columns. 10 → 18 rows visible per viewport. |
| 3.3 | CodeSection | KEEP — reference template | Dead code, no imports. |
| 3.4 | ComponentDetail | KEEP | Live — /inventory overlay panel. |
| 3.5 | ComponentGrid | KEEP — reference template | Dead code, no imports. Presumably pre-InventorySection. |
| 3.6 | ComponentsExplorer | KEEP | Live — /inventory full route. Minor: HUD reads `[INV//INV]` duplicate (non-critical). |
| 3.7 | DualLayer | KEEP — reference template | Dead code. Superseded by ProofSection. |
| 3.8 | ManifestoBand | KEEP — reference template | Dead code, no imports. |
| 3.9 | ManifestoStatement | KEEP | Live — ThesisSection renders one per manifesto entry. |
| 3.10 | MarqueeBand | KEEP — reference template | Dead code, no imports. |
| 3.11 | PreviewTabs | KEEP — reference template | Dead code — components-explorer.tsx defines its own local version. |
| 3.12 | SharedCodeBlock | KEEP | Live on /init with `TERMINAL™` label. |
| 3.13 | StatsBand | KEEP — reference template | Dead code, no imports. |
| 3.14 | TokenTabs | KEEP | Live on /system. |
| 3.15 | AcquisitionCopyButton | KEEP | Live — `[COPY]` CTA on ACQUISITION. |
| 3.16 | ColorSpecimen | FIX | `a5db013` — root cause: borderless-mode `:where([class*="border"], ...)` with `!important` overrode every swatch's inline OKLCH background with `--color-muted`. Swatch divs carry `border-r border-foreground/10`, so the rule matched. Removed `!important`; inline styles and Tailwind `bg-*` utilities now win correctly, and elements with only border-* classes still receive the muted surface cue. All 72 swatches verified unique + matching inline OKLCH post-fix. |
| 3.17 | SpacingSpecimen | KEEP | `/system` SPACING tab. Renders the 9 blessed stops (4/8/12/16/24/32/48/64/96 px) with proportional ruler bars + 4px major/minor tick marks. Token/ruler/px three-column grid reads cleanly. Minor cosmetic inconsistency: `.25rem` / `.5rem` drop leading zero vs `1rem` / `1.5rem` — not worth a change. |
| 3.18 | TypeSpecimen | KEEP | `/system` TYPOGRAPHY tab. 7 named aliases (DISPLAY / H1 / H2 / H3 / BODY / CAPTION / CODE) render at full token size, fonts applied correctly (Anton for display/headers, Electrolize for H3/body/caption, JetBrains Mono for code). Metadata panel shows name / PX / REM / font+size+weight. Layout: sample flush-left, metadata flush-right, minor-third 1.2 header. |
| 3.19 | MotionSpecimen | KEEP | `/system` MOTION tab. Renders 5 tokens (EASE-DEFAULT, EASE-HOVER, DURATION-FAST/NORMAL/SLOW) as SVG cubic-bezier plots — axis frame, control-point tangents, endpoint circles, curve path. EASE-HOVER's overshoot bezier (0.34, 1.56, 0.64, 1) correctly breaks the frame — truth-to-materials. Latent gap (not a specimen fix): CLAUDE.md spec mentions `--duration-instant` (34ms) and `--duration-glacial` (600ms) tokens that aren't in the specimen data array — defer to task #12. |

### Section 3 observations
- **Dead-code policy:** user retains unused legacy block files as reference templates for future layout generation rather than deleting. This is a deliberate stance — not accidental orphans.

---

## Section 4 · Layout / chrome (19) — complete

> **Index counts 21 but lists 19** — INDEX.md header drift, no missing components. Counted: Nav, NavOverlay, NavRevealMount, InstrumentHUD, LiveClock, Breadcrumb, LogoMark, DarkModeToggle, BorderlessToggle, BackToTop, CopyButton, CommandPalette, Footer, ScaleCanvas, LenisProvider, PageAnimations, GlobalEffects, SignalCanvas, SignalframeConfig.

| # | Component | Verdict | Notes |
|---|---|---|---|
| 4.1 | Nav | KEEP | TRADEMARK cube-tile nav (memory: trademark_primitives). Mounted in app/layout.tsx. Verified across light/dark + borderless/bordered toggles + 7 routes. Yellow palette stable, signal-glyph + cubes render correctly, scramble-on-hover working. |
| 4.2 | NavOverlay | KEEP — reference template | Full-screen DU/TDR overlay nav (clip-path reveal, focus trap, Anton 48–72px). Zero JSX usage anywhere — orphan. Per dead-code policy (§3 obs), retain as layout reference. |
| 4.3 | NavRevealMount | KEEP — reference template | `<NavRevealMount />` is never mounted. Hook exists, `data-nav-reveal-trigger` still on subpages, but Nav no longer carries `sf-nav-hidden` initial class — entire reveal pipeline is dormant. Nav is always visible (current shipped behavior). **Latent issue:** comment in nav.tsx:614–616 misrepresents state ("Nav reveal is owned by per-page islands") — defer copy fix to task #13. |
| 4.4 | InstrumentHUD | KEEP | Top-right HUD, mounted once in app/layout.tsx. 5 fields desktop / 3 mobile. rAF direct-writes for scroll % + SIG (avoids React 60fps re-renders, brief VL-06). Phase 30 IntersectionObserver fix shipped earlier this audit (`35aa254`). |
| 4.5 | LiveClock | KEEP — reference template | Big-display scrambled clock (sf-display 52–88px). Zero JSX usage anywhere — InstrumentHUD has its own simpler `time` field. Retain as reference for any future "hero clock" surface. |
| 4.6 | Breadcrumb | KEEP | Subpage chrome. Verified `[SFUX]//[TOKENS]` on /system. Trademark `//` separator preserved. Imported on all 6 subpages. |
| 4.7 | LogoMark | KEEP — reference template | Hero-scale animated SF//UX wordmark (clamp 48–80px, ASCII cycle → scramble → tube-light flicker). Zero JSX usage anywhere — Nav has its own inline SF/UX badge. Retain as reference for hero/init-screen surface. |
| 4.8 | DarkModeToggle | KEEP | Lives in Nav chrome cluster. Verified toggle flips `<html>.dark` class; aria-pressed state correct; persists via `localStorage['sf-theme']`. |
| 4.9 | BorderlessToggle | KEEP | Lives in Nav chrome cluster. Verified flips `[data-borderless]` on `<html>`; persists via `localStorage['sf-borderless']`. Borderless-mode bug (§3.16) fully resolved — swatches now keep inline OKLCH. |
| 4.10 | BackToTop | KEEP | Wide footer-end button (`▲ BACK TO TOP`). Spacebar shortcut when within 200px of bottom. Uses Lenis when available, falls back to native smooth scroll. **INDEX drift:** index says glyph is `↑`; actual is `▲`. The `↑` glyph belongs to a SECOND scroll-to-top affordance — `ScrollToTop` inside GlobalEffects (floating bottom-right after 1vh scroll). Two distinct components serving distinct roles: persistent vs end-of-page. |
| 4.11 | CopyButton | KEEP | Footer install-block CTA. Hardcoded `INSTALL_CMD` via `navigator.clipboard.writeText`, 2s "COPIED" state, VHS flash class on success. Note: ComponentDetail defines its own *local* `CopyButton({ text })` — different signature, different component (lives in components/blocks). Both intentional. |
| 4.12 | CommandPalette | KEEP | Cmd+K palette (cmdk-based, lazy-loaded). Verified: (a) Cmd+K opens cleanly, (b) chrome button click opens after lazy chunk loads. Renders NAVIGATION (HOME / INVENTORY / API REFERENCE / SYSTEM / BUILDS / GET STARTED), EXTERNAL (GITHUB), ACTIONS (TOGGLE THEME, SCROLL TO TOP). |
| 4.13 | Footer | KEEP | Imported on every page (not in layout). 4-column grid (BRAND / DOCS / RESOURCES / INSTALL) + bottom row (copyright + signal/frame symbols) + BackToTop. Renders cleanly across dark/light/borderless. |
| 4.14 | ScaleCanvas | KEEP | Width-only content scaling (vw/1280) → no pillarbox. Publishes `--sf-content-scale`, `--sf-canvas-scale` (chrome, min-axis), `--sf-nav-scale`, `--sf-nav-morph` (0..1 vh-driven cube peel cascade). `--sf-frame-offset-x`/`--sf-frame-bottom-gap` pinned to 0 — contract preserved per project_canvas_frame_vars.md. CLS-fix blocking script in layout.tsx mirrors initial applyScale before paint. |
| 4.15 | LenisProvider | KEEP | Smooth scroll + viewport-detent keyboard nav (Arrow/PageUp/Down/Space). RAF integration with GSAP ticker; reduced-motion gating (destroys instance if user enables at runtime). Exposes `useLenisInstance()` context. **Latent:** keydown handler accesses `target.getAttribute('role')` without first checking it's an Element — synthetic events targeting Window throw `target.getAttribute is not a function`. Real key presses always target elements; not a user-facing bug. Defer to task #14. |
| 4.16 | PageAnimations | KEEP | Single page-level GSAP coordinator. Lazy-splits hero plugins (~75KB) from core (~8KB). Stops cleanly via cancelledRef + ctx.revert(). Includes guards for retired Phase-30 anims (hero-mesh, cta-btn) — defensive. Magenta accent-color cycle ends with stutter (VL-05). |
| 4.17 | GlobalEffects | KEEP | Composite of: VHSOverlay, CanvasCursor, ScrollProgress (top bar), **ScrollToTop (floating ↑)**, InteractionFeedback (audio+haptic), SignalOverlayLazy, SignalIntensityBridge (MutationObserver→derived `--sfx-fx-*` tokens). Lazy-mounted in layout. |
| 4.18 | SignalCanvas | KEEP | Thin `dynamic({ ssr: false })` wrapper around `lib/signal-canvas`. Mounted via SignalCanvasLazy in layout. SignalCanvas render-loop fix shipped earlier (`35aa254`). |
| 4.19 | SignalframeConfig | KEEP | Re-exports `SignalframeProvider` from `lib/signalframe-provider` factory. Naming oddity: file is `signalframe-config.tsx` and import binding is `BorderlessProvider` from `theme-provider` — cosmetic, not a bug. |

### Section 4 deferred (post-v0.1)
- Task #13 — `nav.tsx:614–616` comment lies about reveal mechanism — either delete reveal scaffolding (NavRevealMount, useNavReveal hook, `sf-nav-hidden` CSS, `data-nav-reveal-trigger` attrs on 5 subpages) or rewire it. v0.1 keeps current "always visible" behavior; doc the reality.
- Task #14 — LenisProvider keydown handler — wrap `target.getAttribute` accesses in `target instanceof Element` guard so synthetic events don't throw.
- Task #15 — INDEX.md description for BackToTop confuses two components (`↑` floating vs `▲` end-of-footer). Update INDEX.md to disambiguate.

### Section 4 observations
- **Two scroll-to-top components, by design.** `BackToTop` (footer-wide `▲`, requires reaching footer) and `GlobalEffects.ScrollToTop` (floating `↑` bottom-right, appears after 1vh). Persistent vs end-of-page roles. INDEX.md needs to reflect this.
- **Reveal pipeline dormant.** Four pieces of nav-reveal infrastructure (`NavRevealMount`, `useNavReveal`, `sf-nav-hidden` CSS, `data-nav-reveal-trigger` attrs) survive but Nav root no longer carries the initial-hidden class. Nav is always visible. Either ship the system or strip the dangling parts post-v0.1.
- **3 of 19 chrome components are reference-template orphans** (NavOverlay, LiveClock, LogoMark). Each is a fully-realized alternative to a shipped component (Nav, HUD time field, Nav inline badge). Pattern matches §3 dead-code policy — retain as layout-generation seed material.
- **Provider chain is layered correctly:** TooltipProvider > LenisProvider > SignalframeProvider > BorderlessProvider > ScaleCanvas > Nav. Each layer's effects fire after parents resolve. Pre-hydration `themeScript` + `scaleScript` blocking scripts prevent FOUC + CLS.
- **No console errors during normal navigation.** Three errors observed during my audit came from dispatched synthetic events targeting Window — not reachable from real user input.

---

## Section 5 · SF component library (49 unique / 53 files) — complete

> **Count reconciliation.** INDEX header says "53 surfaces, from barrel" — that maps to the **file count** in `components/sf/`, not unique components. Reality: **49 unique component bundles** across 53 files (some bundles ship base + lazy wrapper). The INDEX categorical list enumerates 48 entries — it omits SFCalendar, SFDrawer, SFMenubar (which exist in the registry + on-screen at /inventory but aren't in the barrel). Drift queued as task #16.

### Verification approach
- /inventory grid renders 36 demo cards from `lib/registry/{forms,layout,feedback,data-display,navigation,generative}.ts` (live snapshot verified — 36 RESULTS in HUD, 36 `[data-flip-id]` cells in DOM).
- /reference exposes API_DOCS — ~142 doc entries (top-level + sub-component compounds across `lib/api-docs/{frame,signal,core,hook}.ts`).
- ComponentDetail overlay verified with BUTTON (001 → opens inline panel below grid, three tabs VARIANTS / PROPS / CODE, three variants render: PRIMARY/GHOST/SIGNAL, `body[data-modal-open]` set, GSAP open animation fires).
- Source files exist for all 49 unique bundles + barrel exports correct (see `components/sf/index.ts` walk).

### Verdict matrix (by INDEX category)

| # | Category | Components | Verdict | Notes |
|---|---|---|---|---|
| 5.1 | Layout primitives (5) | SFContainer, SFSection, SFStack, SFGrid, SFText | KEEP | Created in stabilization scope item #4; mediates blessed spacing/max-width tokens; all consumed across pages. Documented in api-docs. |
| 5.2 | Forms (11 + 3 non-barrel) | SFButton, SFInput, SFCheckbox, SFRadioGroup, SFSwitch, SFSelect, SFTextarea, SFSlider, SFToggle, SFInputGroup, SFInputOTP, **+ SFCalendar (lazy, non-barrel)** | KEEP | Button verified in detail panel (3 variants: PRIMARY/GHOST/SIGNAL). All 11 in barrel; SFCalendar lazy-only (heavy date-fns/dayPicker — same pattern as SFCommand/SFSignalComposer). |
| 5.3 | Overlays (5 + 1 non-barrel) | SFDialog, SFSheet, SFPopover, SFDropdownMenu, SFHoverCard, **+ SFDrawer (lazy, non-barrel)** | KEEP | Radix-wrapped. SFDrawer lazy-only. CommandPalette (§4.12) consumes SFCommand which is also non-barrel — pattern consistent. |
| 5.4 | Feedback (7) | SFAlert, SFAlertDialog, SFProgress, SFSkeleton, SFEmptyState, sfToast (api), SFToaster (mount) | KEEP | sfToast/SFToaster intentionally non-barrel (sonner ~33 KB gz). Mount via SFToasterLazy in app/layout.tsx. |
| 5.5 | Navigation (6 + 1 non-barrel) | SFTabs, SFBreadcrumb, SFPagination, SFNavigationMenu, SFAccordion, SFCollapsible, **+ SFMenubar (lazy, non-barrel)** | KEEP | SFTabs consumed by /system token tabs (§3.14) and ComponentDetail. SFMenubar lazy-only. |
| 5.6 | Data display (7) | SFTable, SFCard, SFBadge, SFAvatar, SFStatusDot, SFTooltip, SFScrollArea | KEEP | All in barrel. SFCard family is the largest compound (Header/Title/Description/Content/Footer). |
| 5.7 | Multi-step / selection (4) | SFStepper, SFToggleGroup, SFSeparator, SFLabel | KEEP | Smaller cluster — SFLabel is a CVA wrapper around Radix Label; SFSeparator used in Footer. |
| 5.8 | Symbol (1) | CDSymbol | KEEP | Used in Footer (`hex` + `signal-wave` glyphs). Single source of truth for divider/circuit-node glyphs — namespaced `CD` not `SF` because it predates the SF naming convention. |
| 5.9 | Command (non-barrel, 1) | SFCommand | KEEP | cmdk wrapper. Consumed only by CommandPalette (§4.12). Verified working via Cmd+K + chrome-button click in §4. |
| 5.10 | Effects (non-barrel, 1) | SFSignalComposer | KEEP | three.js post-processing composer (~130 KB gz). Lazy-only — must import `SFSignalComposerLazy` from `components/animation/`. Excluded from barrel for First-Load JS budget. Live consumers in §6 (signal-canvas family). |

### Section 5 deferred (post-v0.1)
- Task #16 — INDEX.md Section 5 omits SFCalendar, SFDrawer, SFMenubar from the listing. Add them under Forms / Overlays / Navigation respectively (as non-barrel entries, mirroring SFCommand/SFSignalComposer notation). Also: header "53 surfaces, from barrel" should read "49 unique components / 53 files (44 barrel + 9 non-barrel)".

### Section 5 observations
- **Heavy-bundle exclusion is consistent and intentional.** Six components are kept out of the barrel for First-Load JS budget: SFCommand (cmdk ~12 KB), SFCalendar (~25 KB), SFDrawer (vaul ~10 KB), SFMenubar (radix-menubar), sfToast/SFToaster (sonner ~33 KB), SFSignalComposer (three.js ~130 KB). Each has a `*-lazy.tsx` companion. The barrel comments explicitly document why. This is a robust pattern.
- **Inventory ≠ barrel ≠ api-docs.** Three different surface counts serve three roles: 36 demo cards (inventory highlight reel), 49 unique components (barrel + non-barrel), 142 doc entries (api-docs incl. compound sub-components). All three are valid lenses; INDEX.md needs to disambiguate which it documents.
- **Detail-panel render path is solid.** Click → toggle openIndex via `useSessionState('sfux.detail.open')` → ComponentDetailLazy mounts inline below grid → height-from-0 GSAP open → body[data-modal-open]="true" → close+focus restoration via panelRef + triggerRef. Works on first click; toggle on second click (intentional).
- **Accent-color cycling observed mid-audit.** Primary shifted magenta → green → cyan during a single session — this is ColorCycleFrame or IdleOverlay firing on synthetic wheel events. Per `feedback_primary_slot_not_color.md` the system is correctly hue-agnostic; this is intended behavior, not drift.
- **Detail panel inserts inline below grid, not as fixed overlay.** Decision matches the FRAME/SIGNAL register — a "modal" that doesn't break flow (the FRAME stays legible). Side effect: at scroll positions where grid extends below viewport, the panel opens off-screen. User must scroll. Trade-off worth flagging but not regressing — the visual seamlessness is the design intent.

---

## Section 6 · Animation / signal primitives (44) — complete

> **Count reconciliation.** INDEX header says "44 — grouped by role". Counting with lazy wrappers split: 45 files across 38 conceptual "slots." Role-group totals used below: Signal canvases (7) · Staging/reveal (8) · Micro-interaction (6) · Overlays/atmosphere (8) · Particle/field (6) · Token viz / signal-motion (4) = 39. Residual delta from lazy wrappers (each adds 1 file). Close enough; INDEX drift queued in task #17.

### Verification approach
- Live/orphan classification: grep `^import { X }` + `<X>` across `{app,components,lib}/**/*.{tsx,ts}` (stories and docs excluded — Storybook is dev-only, not part of `next build`).
- **Shared-singleton canvases** (GLSLHero / GLSLSignal / ProofShader / SignalMesh): probe `window.__sf_signal_canvas.scenes` size + `rafId` increment across scroll — these components share one WebGL context via scissor/viewport split (brief VL-06 enforcement).
- **Worker canvases** (PointcloudRing / IrisCloud): cannot introspect via `getContext` (throws after `transferControlToOffscreen`) — verified by DOM presence + non-zero bounding rect + `aria-label` match.
- **Non-canvas primitives**: DOM presence + scroll-test via chrome-devtools MCP per `feedback_visual_verification.md` where relevant; for pure utility components (ScrollReveal, HorizontalScroll, etc.) without JSX callers, grep is authoritative.

### 6.a · Signal-layer canvases (7)

| # | Component | Verdict | Notes |
|---|---|---|---|
| 6.1 | GLSLHero (+ lazy) | KEEP | LIVE — entry-section.tsx via GLSLHeroLazy. Scene registered in `__sf_signal_canvas` singleton. Verified: singleton.scenes.size grew to 3 on `/`, rafId incremented 15053→17119 across 6-section scroll sweep. |
| 6.2 | GLSLSignal (+ lazy) | KEEP | LIVE — signal-section.tsx via GLSLSignalLazy. Same singleton registration path. |
| 6.3 | ProofShader (+ lazy) | KEEP | LIVE — proof-section.tsx via ProofShaderLazy. Light-mode contrast tuning still queued (task #10, PRE-EXISTING). |
| 6.4 | PointcloudRing | KEEP | LIVE — entry-section.tsx. `transferControlToOffscreen()` → Web Worker (`pointcloud-ring-worker.ts`). Main-thread getContext throws InvalidStateError (expected). DOM rect present, `aria-label="KLOROFORM-style dissolving ring pointcloud"`. Trademark pixel-sort primitive per `project_cube_hue_slot.md`. |
| 6.5 | IrisCloud | KEEP | LIVE — entry-section.tsx. Same OffscreenCanvas/Worker pattern as PointcloudRing (`iris-cloud-worker.ts`). `aria-label="KLOROFORM-style iris pointcloud drifting toward the pupil"`. |
| 6.6 | HeroMesh | KEEP — reference template | ORPHAN. Only consumer is `components/blocks/hero.tsx`, itself classified KEEP-reference-template in §3.1. |
| 6.7 | SignalMesh (+ lazy) | KEEP | LIVE — /inventory WebGL showcase via SignalMeshLazy. Singleton has 1 scene on /inventory, rafId=53602 active at probe time. |

### 6.b · Staging / reveal (8)

| # | Component | Verdict | Notes |
|---|---|---|---|
| 6.8 | PinnedSection | KEEP | LIVE — thesis-section.tsx:175. Portal escape from ScaleCanvas transform locked in §2.2 fix (`4866bdb`). |
| 6.9 | ScrollReveal | KEEP — reference template | ORPHAN. No JSX callers anywhere outside stories (Storybook is dev-only). |
| 6.10 | SplitHeadline | KEEP — reference template | ORPHAN. No callers. Note: `page-animations.tsx` references GSAP's SplitText plugin, distinct from this component. |
| 6.11 | ScrambleText | KEEP | LIVE — sf-empty-state.tsx:62 (SFEmptyState). *Caveat:* `PreviewScrambleText` in components-explorer is a MOCK that renders `S!GN#L >> TX` as static text; the real component is not consumed by the inventory demo card. |
| 6.12 | CodeTypewriter | KEEP — reference template | LIVE-via-dead-consumer. Only caller is code-section.tsx (CodeSection = orphan per §3.3). Effectively orphan. |
| 6.13 | PageTransition | KEEP | LIVE — mounted once in app/layout.tsx:135, runs on every page. |
| 6.14 | XrayReveal | KEEP — reference template | Same as CodeTypewriter — only consumed by orphan CodeSection. |
| 6.15 | HorizontalScroll | KEEP — reference template | ORPHAN. No callers. |

### 6.c · Micro-interaction (6)

| # | Component | Verdict | Notes |
|---|---|---|---|
| 6.16 | Magnetic | KEEP — reference template | ORPHAN. No callers. |
| 6.17 | HoverPreview | KEEP — reference template | ORPHAN. No callers. |
| 6.18 | BorderDraw | KEEP | LIVE — sf-card.tsx:49. Gates on `card.animation === "draw"` variant. |
| 6.19 | LogoDraw | KEEP | LIVE — app/loading.tsx:7 (route-suspense fallback UI). |
| 6.20 | CanvasCursor | KEEP | LIVE — global-effects.tsx:361. Canvas #2 z=9999 2D, confirmed on every page. |
| 6.21 | ColorCycleFrame | KEEP | LIVE — nav.tsx:667 (SF/UX wordmark badge). Also imported by hero.tsx (orphan consumer). Accent-color shift observed mid-audit (magenta → green → cyan) — expected, system is hue-agnostic per `feedback_primary_slot_not_color.md`. |

### 6.d · Overlays / atmosphere (8)

| # | Component | Verdict | Notes |
|---|---|---|---|
| 6.22 | DatamoshOverlay (+ lazy) | KEEP — reference template | ORPHAN. Neither base nor lazy wrapper consumed anywhere. |
| 6.23 | SignalOverlay (+ lazy) | KEEP | LIVE — global-effects.tsx:365 via SignalOverlayLazy. Site-wide. |
| 6.24 | VHSOverlay | KEEP | LIVE — global-effects.tsx:360. Site-wide. Core DU aesthetic marker. |
| 6.25 | GhostLabel | KEEP | LIVE — app/page.tsx:43 (homepage heading) + app/system/page.tsx:23 (subpage heading). |
| 6.26 | GlitchPass | KEEP | LIVE transitively — sf-signal-composer.tsx:138. SFSignalComposer consumed on /builds + /builds/[slug]. |
| 6.27 | BloomPass | KEEP | LIVE transitively — sf-signal-composer.tsx:130. Same route consumers. |
| 6.28 | DisplaceField | KEEP | LIVE transitively — sf-signal-composer.tsx:122. Same. |
| 6.29 | FeedbackField | KEEP | LIVE transitively — sf-signal-composer.tsx:105. Same. |

### 6.e · Particle / field (6)

| # | Component | Verdict | Notes |
|---|---|---|---|
| 6.30 | ParticleField | KEEP — reference template | ORPHAN. Base `particle-field.tsx` has no callers. |
| 6.31 | ParticleFieldLazy | KEEP — reference template | ORPHAN. Lazy wrapper has no callers. |
| 6.32 | ParticleFieldHQ | KEEP | LIVE transitively — sf-signal-composer.tsx:113 → /builds routes. |
| 6.33 | ComponentSkeleton / SkeletonGrid | KEEP | LIVE — proof-section.tsx:298. SkeletonGrid internally renders ComponentSkeleton. Drives PROOF's Layer B skeleton grid (dual-layer demo). |
| 6.34 | CircuitDivider | KEEP — reference template | ORPHAN. Only reference is the registry code-sample string and a mock preview (`PreviewCircuitDivider` renders static divs, not the real component). |
| 6.35 | BuildSigilDiagram | KEEP | LIVE — app/builds/page.tsx + app/builds/[slug]/page.tsx (3 instances). Dossier-branch feature. |

### 6.f · Token viz / signal-motion (4)

| # | Component | Verdict | Notes |
|---|---|---|---|
| 6.36 | TokenViz | KEEP | LIVE transitively — dynamic-imported by TokenVizLoader. |
| 6.37 | TokenVizLoader | KEEP | LIVE — app/system/page.tsx:51. Canvas 2D viz of the design system's own tokens. |
| 6.38 | SignalMotion | KEEP — reference template | ORPHAN. No callers. Docstring contrasts with ScrollReveal but neither is live. |
| 6.39 | AudioReactiveModulator | KEEP — reference template | ORPHAN. No callers. CHOP-like Web Audio analyser — forward-looking primitive for `project_cdb_v3_dossier.md` audio-reactive surfaces. |

### Section 6 observations
- **Shared-singleton rendering is the correct DU-register fit.** Four of seven signal-layer canvases (GLSLHero, GLSLSignal, ProofShader, SignalMesh) render into one WebGL context via scissor split. This is why the DOM only shows one three.js canvas on `/` despite three active scenes. Probing `window.__sf_signal_canvas.scenes.size` is the canonical "are they alive" test — not `querySelectorAll('canvas')`.
- **OffscreenCanvas worker rendering for the trademark pixel-sort pair.** PointcloudRing and IrisCloud run in Web Workers — verification via main-thread getContext throws `InvalidStateError` (by design). These are the two canvases called out in `feedback_trademark_primitives.md` as pixel-sort trademarks.
- **22 of 39 slots are live; 17 are orphan or orphan-via-dead-consumer.** Orphan ratio is ~44%. Pattern matches §3 dead-code policy — retain as layout-generation reference material rather than purge. Risks (bundle weight, drift-over-time) noted but accepted.
- **Preview components != live consumers.** Three of the orphan classifications hinge on recognizing that `components-explorer.tsx` uses mock preview functions for demo cards — `PreviewScrambleText`, `PreviewCircuitDivider`, etc. render static HTML that only *visually resembles* the component, without importing it. ScrambleText still lives (SFEmptyState); CircuitDivider does not.
- **Site-wide overlays ship cleanly from GlobalEffects.** SignalOverlayLazy + VHSOverlay are the two atmosphere layers that render on every page. CanvasCursor joins them from the same file. All three are z-layered correctly (cursor z=9999, overlays z below chrome).
- **/builds is the only route where `SFSignalComposer` mounts.** Five components go live only on that route (GlitchPass, BloomPass, DisplaceField, FeedbackField, ParticleFieldHQ). The cdb-v3 dossier branch drives their activation.

### Section 6 deferred (post-v0.1)
- Task #17 — INDEX.md Section 6 header "44 — grouped by role" doesn't match my file-count (45) or slot-count (39). Resolve by stating both figures: "44 primitives across 39 conceptual slots / 45 files (9 lazy wrappers)."
- Task #18 — High orphan ratio (17/39 ≈ 44%) in Section 6 warrants a v0.2 decision: either promote orphans into live demos (inventory cards that actually consume the component, not mock previews) or formally archive them under `components/animation/_reference/` to signal dead-code status to tooling. Current policy keeps them in-place per §3 dead-code stance — flag for review, not action.
- Task #19 — `CircuitDivider` registry entry (`lib/registry/generative.ts:100-107`) ships a code sample that tells the user to `import CircuitDivider` but the preview card renders a mock. If the inventory is meant as the canonical demo surface, either wire the real component into `PreviewCircuitDivider` or remove the registry entry. Same pattern applies to `ScrambleText` (index 105).

---

---

## Shipped commits (this audit)

**During audit (sessions 1–3, seal = `a5db013`):**
- `4866bdb` — Fix: THESIS empty — portal PinnedSection out of ScaleCanvas transform
- `35aa254` — Fix: HUD section detector + SignalCanvas render loop
- `61eb02d` — Feat: INVENTORY section fills viewport + stagger-reveal animation
- `8cdb24c` — Feat: SIGNAL section FRAME overlay — headline + data row
- `52fafbd` — Refine: APIExplorer density + tabular column alignment
- `a5db013` — Fix: borderless mode overriding inline swatch backgrounds

**Post-seal signal-layer shipped (session 4, new seal = `158ef6f`):**
- `b437812` — Fix: Borderless-first — zero ring/outline + codify R-60
- `c5b2630` — Fix: InstrumentHUD rAF loop — eliminate per-frame forced reflows → new rule R-61 in LOCKDOWN §6.5
- `b25b2dc` — Perf: Tier-gate DPR + mobile floor + tab-hidden pause (SignalCanvas) → R-62 in LOCKDOWN §6.6
- `430195e` — Perf: Pause pointcloud/iris workers on tab-hidden (battery saver) → R-62-d/e in LOCKDOWN §6.6
- `158ef6f` — Perf: Tier-gate FBM octaves in GLSLHero + ProofShader → R-62-c in LOCKDOWN §6.6

## Post-v0.1 queue

- Task #10 — PROOF shader light-mode contrast tuning
- Task #11 — SIGNAL section 150vh parallax restoration
- Task #12 — MotionSpecimen token data reconciliation vs CLAUDE.md
- Task #13 — `nav.tsx:614–616` reveal-mechanism comment lies; either delete dormant scaffolding (NavRevealMount + useNavReveal + `sf-nav-hidden` CSS + 5 `data-nav-reveal-trigger` attrs) or rewire
- Task #14 — LenisProvider keydown handler `target.getAttribute` access — guard with `target instanceof Element`
- Task #15 — INDEX.md `BackToTop` row confuses footer `▲` button with floating `↑` button (GlobalEffects.ScrollToTop)
- Task #16 — INDEX.md Section 5 missing SFCalendar / SFDrawer / SFMenubar entries; header count "53 surfaces, from barrel" should read "49 unique / 53 files (44 barrel + 9 non-barrel)"
- Task #17 — INDEX.md Section 6 header "44 — grouped by role" doesn't match file count (45) or slot count (39). Resolve by stating both figures.
- Task #18 — Section 6 orphan ratio 17/39 ≈ 44%. v0.2 decision: promote orphans into live inventory demos (replace mock previews with real components) or archive them under `components/animation/_reference/`. Current v0.1 policy keeps them in-place.
- Task #19 — `PreviewCircuitDivider` and `PreviewScrambleText` in `components-explorer.tsx` render mock static HTML while their registry entries ship import-the-real-component code samples. Either wire the real component into the preview or remove the registry entry.

---

## Resume protocol

**AUDIT COMPLETE as of 2026-04-22 session 4.** No resume needed. Next work is post-v0.1 queue items (#10–#19 above); each is independently actionable.

Archive notes for reference:
1. Open INDEX.md alongside this file if revisiting.
2. Dev server running on :3200 pre-session — relaunch if hot-reload state is stale (`kill <PID> && pnpm dev`).
3. Verification-engineering notes for re-doing Section 6 if needed:
   - Shared-singleton canvases: probe `window.__sf_signal_canvas.scenes.size` + `rafId` increment across scroll. Cannot be detected via `document.querySelectorAll('canvas')` alone (scissor-split multiplexing).
   - OffscreenCanvas worker canvases: main-thread `getContext` throws `InvalidStateError` after `transferControlToOffscreen`. Guard probes with try/catch and treat the throw as the positive signal.
   - Preview-card mock functions in `components-explorer.tsx` can fake a "live consumer" without importing the real component. Verify by reading the preview function body, not just grepping for the component name in that file.
   - Hero animation subsystem map at `.planning/codebase/HERO-ANIMATION.md` per `reference_hero_animation_inventory.md`.
