# Phase 31: THESIS Section - Context

**Gathered:** 2026-04-08
**Status:** Ready for planning (with Manifesto Copy blocker — see B-01)
**Mode:** `--auto` (recommended defaults selected — review before plan-phase)

<domain>
## Phase Boundary

Build the THESIS section as a 200-300vh pinned scroll manifesto inside the homepage architecture established by Phase 30. The section places individual typographic statements across the viewport as the user scrolls, communicating the SIGNAL/FRAME thesis, the Enhanced Flat Design position, and the cybernetic biophilia concept — as declarative statements, not running prose. This is the primary signature interaction for the Awwwards SOTD argument.

Phase 31 delivers ONE section (THESIS) plus the manifesto content that drives it. It does not touch ENTRY (Phase 30, complete), PROOF (Phase 32), or any other section. The PinnedSection primitive from Phase 29 is consumed as-is.

**Out of scope:** New animation primitives, new GSAP plugins, new components beyond the THESIS implementation files, multi-language manifesto, generative scenes inside the manifesto.

</domain>

<decisions>
## Implementation Decisions

> All decisions below were auto-selected as recommended defaults under `--auto` mode. Each decision is the lowest-friction path that satisfies the requirements and respects prior phase constraints. Review and override before plan-phase if any choice is wrong.

### Manifesto Copy (the blocker)
- **D-01:** Claude drafts the manifesto text during plan-phase (not discuss-phase) by reading cdSB wiki sources — `wiki/analyses/culture-division-operating-principles.md` and `wiki/analyses/frame-signal-intellectual-lineage.md` — and producing 7-9 declarative phrases. User reviews and revises before any TH-01 engineering begins.
- **D-02:** Statement count: 7-9 phrases. Each phrase is 5-15 words. Three of the phrases are "anchor statements" rendered at 80px+ (TH-03 floor); the rest are connectors.
- **D-03:** Tone register: aphoristic, declarative, no hedging. Statements assert the position; they do not explain it. Drawn from the DU/TDR/Brody/Ikeda lineage register, not marketing copy.
- **D-04:** Content coverage requirement: at minimum one anchor statement for each of (a) SIGNAL/FRAME thesis, (b) Enhanced Flat Design, (c) cybernetic biophilia. Connector phrases bridge transitions.
- **D-05:** Manifesto text lives as a typed array constant (e.g., `lib/thesis-manifesto.ts`) — not MDX, not JSON. Co-located with the THESIS component for ease of revision.

### Layout Choreography
- **D-06:** Asymmetric anchor positioning. Each statement has its own viewport anchor (e.g., top-left, center-baseline, bottom-right, far-left mid). No centered stack. DU/TDR off-grid placement is the visual signature.
- **D-07:** Per-statement scroll budget: ~30vh of scroll distance per phrase, with ≥30vh of intentional void between key statements (TH-04 floor). Total math: 8 statements × 30vh = 240vh, fits inside the 200-300vh window with breathing room.
- **D-08:** Statements are absolutely positioned within a 100vh stage div (the inner content of PinnedSection). Position is set via `top`/`left`/`right`/`bottom` percentages or vw/vh — not flex/grid containers.

### Reveal Mechanics
- **D-09:** GSAP `SplitText` with `mask: "chars"` per statement, slide-up reveal driven by ScrollTrigger scrub. Pattern matches existing `components/animation/split-headline.tsx`.
- **D-10:** `scrub: 1` (1-second smoothing lag) — matches the PinnedSection internal config. Avoids jerky character motion at fast scroll speeds.
- **D-11:** Each statement has its own enter/hold/exit window inside the master timeline. Enter via char slide-up (y: 100% → 0%). Hold for the statement's claim window. Exit via opacity fade or char slide-out — keep mechanics consistent across statements.
- **D-12:** SplitText `autoSplit: true` is mandatory — required for `pin: true + scrub` combos per `.planning/research/STACK.md`.
- **D-13:** Animate the inner content children only — never animate the PinnedSection root or its immediate child stage div. Animating the pinned element breaks GSAP's pin measurements (STACK.md key constraint).

### Type Scale & Hierarchy
- **D-14:** Anchor statements use Anton at 80-160px desktop (`clamp(56px, 12vw, 160px)` mobile). Three minimum, satisfying TH-03.
- **D-15:** Connector statements use Inter at heading-1 (`text-3xl` ~40px) or heading-2 (`text-2xl` ~32px). They visually subordinate to anchors.
- **D-16:** Color: foreground token only. No per-phrase color shifts, no accent overlays. Motion and position carry the design — color stays restrained per Enhanced Flat Design rules.
- **D-17:** Letter-spacing: tight on Anton (matches existing display headline pattern); default on Inter.
- **D-18:** Use the existing `--text-*` token scale where it fits the size; for anchor statements above `--text-4xl` (80px), use direct `clamp()` because the token scale stops at 80px. This is acceptable per TH-03 ("80px or larger").

### Pinned Composition
- **D-19:** Single `PinnedSection` instance wrapping the THESIS section. `scrollDistance={2.5}` (= 250vh of scroll distance). Inside the bounds of TH-01 (200-300vh).
- **D-20:** Inner structure: PinnedSection → 100vh stage div → array of absolutely-positioned statement elements. Stage div is the GSAP animation target via `useGSAP({ scope: stageRef })`.
- **D-21:** A single GSAP master timeline drives all statement enter/hold/exit tweens. Timeline is linked to ScrollTrigger via `animation: tl` — but since PinnedSection already creates the ScrollTrigger internally, the THESIS component creates its own scrubbed timeline scoped to the inner stage. Plan-phase decides whether to extend PinnedSection's API to accept a timeline or whether to compose two ScrollTriggers (parent pin + child scrub).
- **D-22:** Component file: `components/blocks/thesis-section.tsx` (block, not animation primitive — it composes existing primitives). Marked `'use client'`.
- **D-23:** Statement renderer is a small subcomponent (e.g., `<ManifestoStatement>`) that takes `{ text, anchor, size }` props and handles its own SplitText init. Keeps the parent component declarative.

### Section Transition
- **D-24:** Hard-cut exit. After the final statement's hold window, the pin releases and PROOF (or its Phase 30 stub) follows immediately at full opacity. No fade, no slide. Matches Phase 30 D-09/D-13 hard-cut decision.
- **D-25:** Last statement holds for ~20vh after its enter completes, then exits during the final pin release. The void gap to PROOF is part of the THESIS scroll budget, not a margin.
- **D-26:** No `data-anim` attribute on the THESIS section root — it manages its own animation lifecycle. This avoids double-trigger from `PageAnimations`.

### Reduced-Motion Fallback (PF-06 + TH-06)
- **D-27:** When `prefers-reduced-motion: reduce` is active, render manifesto statements in normal document flow as a stacked vertical specimen — every statement visible, full content readable without scrolling, no pin, no scrub, no SplitText.
- **D-28:** PinnedSection already short-circuits on reduced motion (verified in `components/animation/pinned-section.tsx` line 46). The THESIS component must also gate its SplitText/timeline init on the same media query.
- **D-29:** Reduced-motion layout uses normal SFSection flow with stacked statements at the same Anton/Inter scale, but in document order. Reading the section is the equivalent experience.
- **D-30:** Both modes (motion + reduced-motion) must produce a Lighthouse-clean experience. No layout shift introduced by switching modes.

### Mobile Behavior
- **D-31:** Mobile scroll distance: 200vh (lower TH-01 bound). Desktop: 250vh (D-19). Use a `useMatchMedia` or window.innerWidth check at component mount to set `scrollDistance`.
- **D-32:** Anchor statement type: `clamp(56px, 12vw, 160px)` — preserves the 80px+ floor on viewports ≥667px (where 12vw = 80px). Below that, the floor drops to 56px which still reads as a dominant statement.
- **D-33:** Statement positioning on mobile: anchors collapse toward center-with-offset rather than far-left/far-right (which would clip on 375px viewports). The asymmetry is preserved but constrained.
- **D-34:** Physical iPhone Safari testing is mandatory before this phase ships, per the v1.5 critical constraint in STATE.md. Simulator does not replicate address bar behavior.
- **D-35:** PinnedSection already requires `autoResize: false` on Lenis (set in Phase 29) to handle iOS address bar resize. No additional config needed.

### Claude's Discretion
- Plan count and plan boundaries (manifesto authoring + engineering as separate plans, or combined)
- Exact ScrollTrigger config beyond what PinnedSection provides (e.g., whether to add `pinnedContainer` for nested triggers)
- Whether to extend PinnedSection API or compose a second ScrollTrigger inside THESIS
- Test structure (unit vs Playwright vs visual snapshot for the pinned scroll sequence)
- Whether to add a `data-section-progress` attribute for the section indicator to read
- Specific easing curves (default to existing `--ease-default` / `sf-snap` token where reasonable)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & Architecture
- `.planning/REQUIREMENTS.md` §THESIS Section — TH-01 through TH-06 (the requirements this phase satisfies)
- `.planning/ROADMAP.md` lines 393-403 — Phase 31 goal, success criteria
- `.planning/STATE.md` lines 110-124 — v1.5 critical constraints (manifesto copy blocker, fonts-ready, iOS testing)

### Infrastructure (Phase 29 — confirmed working)
- `components/animation/pinned-section.tsx` — PinnedSection primitive (consumed by THESIS, do NOT modify the public API without coordinating with Phase 32 SIGNAL section which also depends on it)
- `components/layout/lenis-provider.tsx` — Lenis with `autoResize: false` (already set)
- `lib/gsap-plugins.ts` — Central GSAP plugin registration (SplitText, ScrollTrigger, Observer all registered)
- `lib/gsap-core.ts` — GSAP + ScrollTrigger re-exports
- `lib/gsap-split.ts` — SplitText + useGSAP re-export (existing pattern from split-headline.tsx)

### Architecture (Phase 30 — confirmed)
- `app/page.tsx` — 6-section homepage architecture (THESIS slot is currently a 200vh stub from Phase 30 D-17)
- `.planning/phases/30-homepage-architecture-entry-section/30-CONTEXT.md` — D-17 establishes 200vh THESIS stub with `id="thesis"` landmark; Phase 31 replaces stub content while preserving the SFSection landmark wrapper

### Existing Patterns to Follow
- `components/animation/split-headline.tsx` — Reference SplitText `mask: "chars"` pattern (D-09 follows this)
- `components/layout/page-animations.tsx` — Existing SplitText usage in the codebase (do not double-trigger from this for THESIS — see D-26)
- `components/blocks/api-explorer.tsx` — Another SplitText consumer (pattern reference only)

### Research
- `.planning/research/STACK.md` lines 75-112 — Pin + SplitText pattern, key constraint about not animating pinned elements, autoSplit requirement
- `.planning/research/PITFALLS.md` — Pitfall 1 (iOS address bar + pin), Pitfall 2 (font-load + ScrollTrigger refresh), Pitfall 3 (WebGL context limits — relevant because Phase 32 adds 3rd context after THESIS)
- `.planning/research/FEATURES.md` lines 70, 100-110, 145, 159, 188, 213, 225-233 — Manifesto section feature spec, "structure and content first" principle
- `.planning/research/SUMMARY.md` lines 12, 30, 64, 72 — Signature interaction framing, manifesto blocker callout

### Design Intelligence (cdSB wiki — required for D-01 manifesto authoring)
- `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/second-brain/wiki/analyses/culture-division-operating-principles.md` — Operating principles, FRAME/SIGNAL philosophy
- `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/second-brain/wiki/analyses/frame-signal-intellectual-lineage.md` — Six converging traditions: Shannon, Goffman, Wiener, architecture, music production, design grid/gesture

### Prior Phase Context
- `.planning/phases/29-infrastructure-hardening/29-CONTEXT.md` — PinnedSection API design, reduced-motion gate, Lenis hardening
- `.planning/phases/30-homepage-architecture-entry-section/30-CONTEXT.md` — Homepage architecture, hard-cut transitions, nav reveal, THESIS stub at 200vh

### Project Constraints
- `.planning/PROJECT.md` — Quality bar (Lighthouse 100/100, LCP <1.0s, CLS=0), zero new npm packages rule
- `CLAUDE.md` — Stabilization scope, dual-layer model rules, do-not-expand list

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **PinnedSection** (`components/animation/pinned-section.tsx`): Phase 29 primitive — exactly the wrapper THESIS needs. Takes `scrollDistance` in vh units, internally creates pinned ScrollTrigger with `scrub: 1, anticipatePin: 1, invalidateOnRefresh: true`, short-circuits on reduced motion. Use as-is.
- **SplitText pattern** (`components/animation/split-headline.tsx`): Existing reference for `SplitText.create` with `mask: "chars"`, `autoSplit: true`, useGSAP scoping. THESIS statement subcomponents follow the same pattern.
- **gsap-split.ts** (`lib/gsap-split.ts`): Re-exports gsap, SplitText, useGSAP from a single import. THESIS components import from here.
- **SFSection** (`components/sf/SFSection.tsx`): Layout primitive — THESIS replaces the Phase 30 stub content but preserves the SFSection wrapper (with `data-section`, `data-bg-shift`, `id="thesis"`, `label="THESIS"`).
- **Anton font**: Already loaded in root layout, used for `heading-1` semantic alias. Available via `font-anton` Tailwind utility.
- **`--ease-default` / `sf-snap` tokens**: Existing easing values registered in CSS. Use these — do not introduce new easings (CLAUDE.md "DO NOT add new GSAP effects" rule).

### Established Patterns
- Animation components in `components/animation/` are all `'use client'` and use `useGSAP({ scope: ref })` for cleanup
- Block components in `components/blocks/` compose existing primitives — THESIS belongs here, not in `animation/`
- SplitText with `mask: "chars"` is the canonical char-reveal pattern in this codebase
- Reduced-motion is gated at component mount via `window.matchMedia("(prefers-reduced-motion: reduce)").matches` check (PinnedSection line 46 is the reference)
- GSAP context cleanup via `gsap.context().revert()` in useEffect cleanup (PinnedSection line 60)

### Integration Points
- `app/page.tsx`: Phase 30 leaves THESIS as a stub SFSection with `id="thesis"` and minimum height 200vh. Phase 31 replaces the stub child content with `<ThesisSection />` while preserving the section landmark.
- `components/layout/section-indicator.tsx`: Reads `data-section-label` — already wired for THESIS via Phase 30 stub.
- `components/layout/page-animations.tsx`: Currently selects `[data-anim]` elements site-wide. THESIS section root should NOT carry `data-anim` (D-26) — it manages its own lifecycle.
- `lib/gsap-plugins.ts`: All required plugins (ScrollTrigger, SplitText) are already registered. No additions needed.

### Constraints from Existing Architecture
- **Singleton WebGL context**: Phase 32 SIGNAL section adds a 3rd concurrent WebGL scene after THESIS. THESIS must NOT introduce its own canvas — text only.
- **Bundle gate**: 150KB shared limit. THESIS must add minimal weight — SplitText is already in the bundle (split-headline + page-animations + api-explorer all use it).
- **Zero new npm packages** (v1.5 rule from STATE.md): All animation via existing GSAP + Lenis. No exceptions for THESIS.
- **rounded-none everywhere**: Statement containers must explicitly apply `rounded-none` if they use any class that would default to a radius (CLAUDE.md rule).

</code_context>

<specifics>
## Specific Ideas

- **Asymmetric anchor positions** are the THESIS visual signature. Sample anchor coordinates for 8 statements: top-left 8vw / center-baseline / bottom-right 12vw / far-left mid / right-third upper / center upper-third / left-quarter lower / center final. Plan-phase to refine.
- **Anton 160px** anchor statements are intentionally close to the viewport's vertical limit — they should feel like they're pressing against the frame. Not a contained typographic moment; a confrontational one.
- **Connector statements at Inter 32-40px** create the visual interval between anchors. They are not "small" — they are the rhythm between the heavy beats.
- **Void is the design material, not a gap to fill** — TH-04 success criterion. The 30vh+ gaps between key statements are visible by design. Do not be tempted to fill them with decorative elements.
- **`scrub: 1`** is the default smoothing lag. Faster (e.g., `scrub: true` for instant) makes char motion jerky. Slower (`scrub: 2+`) feels detached. 1s is the proven middle from PinnedSection.
- **The pin is the statement.** The act of scroll being arrested IS the design — the user feels the system halt the page so they cannot avoid the manifesto. This is the SOTD signature.
- **Manifesto authoring is creative work, not implementation.** The plan-phase researcher should treat D-01 (Claude drafts text) as a research deliverable producing a draft `lib/thesis-manifesto.ts` for user review BEFORE engineering plans are written.

</specifics>

<deferred>
## Deferred Ideas

- **Multilingual manifesto** (JFM katakana/farsi/mandarin variants) — Out of scope. Belongs in Phase 34 visual language pass or v2 localization work, consistent with Phase 30 D-06 deferral.
- **Audio-reactive manifesto** (statement enters trigger Web Audio cues) — Belongs in v2 multi-sensory expansion. SFAudioFeedback already exists from v1.1 but adding it to THESIS breaks the "void is the design" restraint.
- **Generative SIGNAL inside THESIS** (a shader behind the manifesto) — Out of scope. THESIS is text + void only. SIGNAL section in Phase 32 owns the generative layer.
- **Snap-scroll between statements** (GSAP `snap: { snapTo: "labels" }`) — Tempting but introduces a rigid feel that contradicts the scrub-driven flow. Defer to post-launch tuning if user feedback warrants.
- **Page-wide horizontal scroll segment for THESIS** — A common Awwwards pattern but not aligned with this site's vertical scroll architecture. Defer indefinitely.
- **`pinnedContainer` for nested ScrollTriggers** — Only needed if THESIS introduces a second nested ScrollTrigger inside the PinnedSection. Plan-phase decides.

</deferred>

<blockers>
## Blockers

- **B-01: Manifesto Copy** (carried from STATE.md) — The 7-9 declarative statements covering SIGNAL/FRAME thesis, Enhanced Flat Design, and cybernetic biophilia are not yet authored. **Resolution path (D-01):** Claude drafts initial text during plan-phase by reading the cdSB wiki sources, user reviews and revises before TH-01 engineering begins. This blocker is not a STOP — it is a sequence requirement. Plan-phase produces the draft as its first deliverable.

</blockers>

---

*Phase: 31-thesis-section*
*Context gathered: 2026-04-08 (auto mode — review recommended defaults before plan-phase)*
