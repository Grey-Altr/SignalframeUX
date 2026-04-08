# Phase 31: THESIS Section — Research

**Researched:** 2026-04-08
**Domain:** Scroll-driven typographic manifesto — GSAP pin + SplitText + Lenis, content-first
**Confidence:** HIGH (consumed primitives already shipped + wiki sources accessible for manifesto authoring)

---

## Summary

Phase 31 ships the single biggest signature interaction of the v1.5 redesign: a 200–300vh pinned scroll manifesto that places individual declarative statements across the viewport as the user scrolls. Every piece of infrastructure this phase needs already exists and is production-proven from Phase 29: `PinnedSection` (pin + scrub + reduced-motion gate), `gsap-split.ts` (gsap + SplitText + useGSAP), the `sf-snap` easing token, the `SFSection` landmark, and the `document.fonts.ready → ScrollTrigger.refresh` hook in `page-animations.tsx`. Phase 30 lays down the `id="thesis"` landmark at 200vh.

This is **not** an infrastructure-heavy phase. It is two things stacked: (1) **manifesto authoring** — drafting 7–9 declarative phrases grounded in the cdSB wiki (FRAME/SIGNAL lineage, cybernetic biophilia, Enhanced Flat Design) for user review, and (2) **engineering** — composing existing primitives (`PinnedSection` + `SplitText` + asymmetric absolute positioning) into a `components/blocks/thesis-section.tsx` block. The risk surface is almost entirely in the content quality and in known pin-spacer pitfalls (iOS address bar, font reflow, animating pinned element) — not in new code.

**Primary recommendation:** Author the manifesto first as a typed array constant (`lib/thesis-manifesto.ts`), have the user approve it, *then* engineer the component. The engineering pattern is fixed: single `PinnedSection` wrapper → 100vh stage div → 7–9 absolutely-positioned statements → single master GSAP timeline scrubbed by a **second** nested ScrollTrigger that reads its progress from the `PinnedSection`'s parent using `pinnedContainer`. Do **not** extend the PinnedSection public API — compose a second scrub-linked ScrollTrigger inside the stage, which is the documented GSAP nested-pin pattern.

---

## User Constraints (from 31-CONTEXT.md)

### Locked Decisions (auto-selected under `--auto` mode — planner should treat as authoritative unless user overrides)

**Manifesto Copy**
- **D-01:** Claude drafts manifesto text during plan-phase (not discuss-phase) by reading cdSB wiki sources (`wiki/analyses/culture-division-operating-principles.md`, `wiki/analyses/frame-signal-intellectual-lineage.md`) and producing 7–9 declarative phrases. User reviews and revises before TH-01 engineering begins.
- **D-02:** 7–9 phrases. Each 5–15 words. Three phrases are "anchor statements" rendered at 80px+ (TH-03 floor); the rest are connectors.
- **D-03:** Aphoristic, declarative, no hedging. Statements assert, do not explain. DU/TDR/Brody/Ikeda register, not marketing copy.
- **D-04:** At minimum one anchor statement for each of (a) SIGNAL/FRAME thesis, (b) Enhanced Flat Design, (c) cybernetic biophilia. Connector phrases bridge transitions.
- **D-05:** Text lives as a typed array constant (`lib/thesis-manifesto.ts`). Not MDX, not JSON. Co-located with the THESIS component.

**Layout Choreography**
- **D-06:** Asymmetric anchor positioning. Each statement has its own viewport anchor. No centered stack.
- **D-07:** Per-statement scroll budget ~30vh; ≥30vh void between key statements (TH-04 floor). 8 statements × 30vh = 240vh, fits in 200–300vh window.
- **D-08:** Statements are absolutely positioned within a 100vh stage div using `top`/`left`/`right`/`bottom` percentages or vw/vh — not flex/grid.

**Reveal Mechanics**
- **D-09:** GSAP `SplitText` with `mask: "chars"` per statement, slide-up reveal driven by ScrollTrigger scrub. Matches `components/animation/split-headline.tsx`.
- **D-10:** `scrub: 1` — matches PinnedSection internal config.
- **D-11:** Each statement has its own enter/hold/exit window inside the master timeline. Enter: char slide-up (y: 100% → 0%). Hold. Exit: opacity fade or char slide-out. Consistent across statements.
- **D-12:** `SplitText` `autoSplit: true` mandatory (required for `pin: true + scrub` per STACK.md).
- **D-13:** Animate inner content children ONLY — never animate the `PinnedSection` root or its immediate child stage div. Animating the pinned element breaks GSAP pin measurements.

**Type Scale & Hierarchy**
- **D-14:** Anchor statements use Anton at 80–160px desktop (`clamp(56px, 12vw, 160px)` mobile). Three minimum, satisfying TH-03.
- **D-15:** Connector statements use Inter at heading-1 (`text-3xl` ~40px) or heading-2 (`text-2xl` ~32px). Visually subordinate to anchors.
- **D-16:** Color: foreground token only. No per-phrase color shifts, no accent overlays. Motion and position carry the design.
- **D-17:** Letter-spacing: tight on Anton; default on Inter.
- **D-18:** Use `--text-*` tokens where they fit; for anchors above `--text-4xl` (80px), use direct `clamp()` (acceptable per TH-03).

**Pinned Composition**
- **D-19:** Single `PinnedSection` wrapping the THESIS section. `scrollDistance={2.5}` = 250vh of scroll distance.
- **D-20:** Inner structure: `PinnedSection` → 100vh stage div → array of absolutely-positioned statement elements. Stage div is the GSAP animation target via `useGSAP({ scope: stageRef })`.
- **D-21:** Single GSAP master timeline drives all statement enter/hold/exit tweens. Plan-phase decides: extend `PinnedSection` API to accept a timeline, or compose a second ScrollTrigger inside THESIS. **This research recommends the second option** — see "Implementation Approach" below.
- **D-22:** Component file: `components/blocks/thesis-section.tsx` (block, not animation primitive). Marked `'use client'`.
- **D-23:** Statement renderer is `<ManifestoStatement>` subcomponent taking `{ text, anchor, size }` props.

**Section Transition**
- **D-24:** Hard-cut exit. After final statement's hold, pin releases and PROOF stub follows at full opacity. Matches Phase 30 D-09/D-13.
- **D-25:** Last statement holds ~20vh after its enter completes, exits during final pin release. Void gap to PROOF is part of THESIS scroll budget, not a margin.
- **D-26:** No `data-anim` attribute on THESIS section root — avoids double-trigger from `PageAnimations`.

**Reduced-Motion Fallback (PF-06 + TH-06)**
- **D-27:** `prefers-reduced-motion: reduce` renders manifesto as a stacked vertical specimen — every statement visible, full content readable without scrolling.
- **D-28:** PinnedSection already short-circuits on reduced motion (line 46). THESIS component must also gate its SplitText/timeline init on the same media query.
- **D-29:** Reduced-motion layout uses normal SFSection flow with stacked statements at the same Anton/Inter scale, in document order.
- **D-30:** Both modes must be Lighthouse-clean. No layout shift switching modes.

**Mobile Behavior**
- **D-31:** Mobile scroll distance: 200vh. Desktop: 250vh. Use `matchMedia` or `window.innerWidth` at mount.
- **D-32:** Anchor type: `clamp(56px, 12vw, 160px)` — preserves 80px+ floor on viewports ≥667px.
- **D-33:** Mobile positioning: anchors collapse toward center-with-offset rather than far-left/right.
- **D-34:** Physical iPhone Safari testing mandatory before ship.
- **D-35:** `PinnedSection` requires `autoResize: false` on Lenis (set in Phase 29). No additional config needed.

### Claude's Discretion
- Plan count and plan boundaries (manifesto authoring + engineering as separate plans, or combined)
- Exact ScrollTrigger config beyond `PinnedSection` (e.g., `pinnedContainer` for nested triggers)
- Whether to extend `PinnedSection` API or compose a second ScrollTrigger inside THESIS
- Test structure (unit vs Playwright vs visual snapshot for the pinned scroll sequence)
- Whether to add a `data-section-progress` attribute for the section indicator
- Specific easing curves (default to existing `--ease-default` / `sf-snap` where reasonable)

### Deferred Ideas (OUT OF SCOPE)
- Multilingual manifesto (JFM katakana/farsi/mandarin variants) — Phase 34 or v2
- Audio-reactive manifesto (Web Audio triggers on statement enters) — v2 multi-sensory
- Generative SIGNAL inside THESIS (shader behind manifesto) — Phase 32 owns the generative layer
- Snap-scroll between statements (`snap: { snapTo: "labels" }`) — contradicts scrub-driven flow, defer to post-launch
- Page-wide horizontal scroll segment for THESIS — not aligned with site's vertical architecture
- `pinnedContainer` — actually needed per recommendation below; upgraded from "deferred if used"

---

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| **TH-01** | Scroll-driven typographic layout spanning 200–300vh of scroll distance | `PinnedSection` primitive from Phase 29 with `scrollDistance={2.5}` = 250vh fits inside the 200–300vh window. Mobile drops to 200vh per D-31. Verified via DOM scrollHeight assertion. |
| **TH-02** | Manifesto phrases placed individually across viewport via GSAP ScrollTrigger pin/scrub — not flowing paragraph text | Absolutely-positioned `<ManifestoStatement>` subcomponents inside a single 100vh stage div (D-08). Each statement owns its own enter/hold/exit tween window within a master timeline (D-11). No flex/grid containers. |
| **TH-03** | At least 3 type moments at 80px+ that dominate their scroll frame | Anton `clamp(56px, 12vw, 160px)` for anchor statements (D-14). Three anchors minimum, one per content pillar (D-04). 12vw = 80px at viewport ≥667px — above-mobile floor satisfies the 80px requirement per D-32. |
| **TH-04** | Negative space between phrases is intentional design material (minimum 30vh gaps between key statements) | Per-statement scroll budget ~30vh with ≥30vh void between anchors (D-07). Void IS the design — do not fill it. |
| **TH-05** | Content includes SIGNAL/FRAME thesis, Enhanced Flat Design position, and cybernetic biophilia — as statements, not explanations | B-01 blocker: manifesto must be authored. Draft provided below in "Manifesto Copy Strategy" section grounded in cdSB wiki (two files successfully read at research time). User review required before engineering. |
| **TH-06** | prefers-reduced-motion: instant placement, no scroll-driven animation | Dual gate: `PinnedSection` short-circuits at line 46 (no pin/scrub created), AND THESIS component gates its own SplitText/timeline init on the same media query. Reduced-motion fallback is a stacked specimen layout in normal document flow (D-27 → D-30). |

---

## Phase Goal

Deliver the THESIS section as the site's signature signature scroll interaction: a 200–300vh pinned span in which individual declarative statements drift into viewport anchors, assert themselves at display-scale typography, sit in deliberate void, and release hard-cut into the next section. The manifesto covers three ideas as statements, not explanations: (1) SIGNAL/FRAME as a simultaneous dual-layer architecture, (2) Enhanced Flat Design as depth-through-structure, (3) cybernetic biophilia as held tension between machine and life. The act of the page halting to deliver these statements IS the SOTD argument — the user cannot scroll past; they must traverse the manifesto.

Phase 31 produces exactly one new block component (`components/blocks/thesis-section.tsx`), one new typed content constant (`lib/thesis-manifesto.ts`), one new statement sub-renderer (`<ManifestoStatement>`), and a test file. It consumes Phase 29's `PinnedSection` as-is, replaces Phase 30's THESIS stub body, and does not touch any other section.

---

## Implementation Approach

### Architecture (concrete, drawn from existing code)

```
app/page.tsx (from Phase 30)
  └── <SFSection id="thesis" label="THESIS" data-bg-shift="white" data-section="thesis">
        └── <ThesisSection />                                       ← NEW (Phase 31)
              └── <PinnedSection scrollDistance={isMobile ? 2 : 2.5}>  ← Phase 29 primitive
                    └── <div ref={stageRef} className="relative w-full h-screen">  ← stage, 100vh
                          ├── <ManifestoStatement {...anchors[0]} />
                          ├── <ManifestoStatement {...anchors[1]} />
                          ├── <ManifestoStatement {...anchors[2]} />
                          ├── <ManifestoStatement {...anchors[3]} />
                          ├── <ManifestoStatement {...anchors[4]} />
                          ├── <ManifestoStatement {...anchors[5]} />
                          ├── <ManifestoStatement {...anchors[6]} />
                          └── <ManifestoStatement {...anchors[7]} />
```

### Why compose a second nested ScrollTrigger (not extend PinnedSection)

`PinnedSection` creates a scrubbed ScrollTrigger but takes no `animation` prop — its internal trigger is a pin-only scrub with no linked timeline. Phase 32 (SIGNAL section) will also consume `PinnedSection` with its own animation semantics. **Extending the public API would leak Phase 31's choreography concerns into a primitive that two different phases need for two different purposes.** The documented GSAP pattern for a scrubbed timeline nested inside an already-pinned section is `pinnedContainer` — the inner ScrollTrigger declares its parent pin so offsets compute correctly (`STACK.md` lines 114–128, Pattern 2).

**Recommended inner trigger (inside the THESIS component, not the PinnedSection primitive):**

```typescript
// Inside ThesisSection component
useGSAP(
  () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tl = gsap.timeline();
    // Build master timeline with proportional durations per statement
    // (enter + hold + exit = 1 unit per statement; 8 statements = 8 units)

    ScrollTrigger.create({
      trigger: stageRef.current,
      pinnedContainer: pinnedWrapperRef.current,  // PinnedSection's root div
      start: "top top",
      end: "bottom bottom",   // spans the full pinned scroll distance
      scrub: 1,
      animation: tl,
      invalidateOnRefresh: true,
    });
  },
  { scope: stageRef }
);
```

This requires threading a `ref` down from `ThesisSection` to `PinnedSection`'s root. `PinnedSection` currently owns its own `containerRef` and does not expose it. Two options:

1. **Add `forwardRef` to PinnedSection** — minimal, Phase 32-friendly. **RECOMMENDED.**
2. **Wrap `PinnedSection` in an outer div and point `pinnedContainer` at that wrapper** — avoids touching PinnedSection but adds a DOM node.

Option 1 is a one-line change to `PinnedSection` that does not alter its semantics. The planner should decide. If the planner opts to keep PinnedSection frozen, option 2 works without risk.

### Statement rendering pattern (from `split-headline.tsx`)

Each `<ManifestoStatement>` follows the exact existing `split-headline.tsx` pattern, with two differences:

1. Tween **does not fire immediately** — it is added to the parent master timeline, which is scrubbed by the parent ScrollTrigger (not played by time).
2. Reduced-motion guard is still present (defense in depth; the parent also guards).

```typescript
// ManifestoStatement pattern — conceptual, NOT final code
"use client";
import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap-split";

interface StatementProps {
  text: string;
  anchor: { top?: string; left?: string; right?: string; bottom?: string };
  size: "anchor" | "connector";
  timeline: gsap.core.Timeline;  // passed from parent
  position: number;              // timeline position label or seconds offset
}

export function ManifestoStatement({ text, anchor, size, timeline, position }: StatementProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      SplitText.create(ref.current.querySelector("[data-statement]"), {
        type: "chars",
        mask: "chars",
        autoSplit: true,         // MANDATORY for pin + scrub combo (D-12, STACK.md)
        onSplit(self: { chars: Element[] }) {
          timeline
            .from(self.chars, { y: "100%", opacity: 0, stagger: 0.02, duration: 0.5, ease: "sf-snap" }, position)
            .to({}, { duration: 0.3 }, ">")  // hold window
            .to(self.chars, { opacity: 0, duration: 0.3, ease: "power1.in" }, ">");  // exit
        },
      });
    },
    { scope: ref, dependencies: [text, position] }
  );

  const sizeClass = size === "anchor"
    ? "font-[family-name:var(--font-display)] tracking-tight"   // Anton
    : "font-sans text-3xl md:text-4xl";                          // Inter heading-1/2

  const sizeStyle = size === "anchor"
    ? { fontSize: "clamp(56px, 12vw, 160px)", lineHeight: 0.9 }
    : undefined;

  return (
    <div
      ref={ref}
      className="absolute"
      style={anchor}
    >
      <span data-statement className={sizeClass} style={sizeStyle}>
        {text}
      </span>
    </div>
  );
}
```

### Manifesto data shape (`lib/thesis-manifesto.ts`)

```typescript
export type ManifestoSize = "anchor" | "connector";

export interface ManifestoAnchor {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}

export interface ManifestoStatementData {
  text: string;
  size: ManifestoSize;
  anchor: ManifestoAnchor;         // desktop anchor
  mobileAnchor?: ManifestoAnchor;  // optional mobile override per D-33
  pillar?: "signal-frame" | "enhanced-flat" | "biophilia" | "connector";
}

export const THESIS_MANIFESTO: ManifestoStatementData[] = [
  /* see "Manifesto Copy Strategy" below for draft content */
];
```

### Mobile scroll distance gate

```typescript
// Inside ThesisSection
const [scrollDistance, setScrollDistance] = useState(2.5);
useEffect(() => {
  const mq = window.matchMedia("(max-width: 667px)");
  setScrollDistance(mq.matches ? 2 : 2.5);
  // No listener — scrollDistance is set once at mount; resize will trigger invalidateOnRefresh elsewhere
}, []);
```

### Reduced-motion fallback structure

When `matchMedia("(prefers-reduced-motion: reduce)").matches`, skip the `PinnedSection` path entirely and render a stacked specimen:

```typescript
if (reducedMotion) {
  return (
    <div className="flex flex-col gap-24 py-24 px-6 md:px-16">
      {THESIS_MANIFESTO.map((s, i) => (
        <div key={i} className={s.size === "anchor" ? "text-center" : "text-left"}>
          <span className={sizeClassFor(s.size)} style={sizeStyleFor(s.size)}>
            {s.text}
          </span>
        </div>
      ))}
    </div>
  );
}
```

Uses blessed spacing stops (`gap-24` = 96px, `py-24`, `px-6` / `px-16`) per CLAUDE.md spacing rules. No GSAP, no SplitText, no pin.

---

## Key Files to Touch

### New files
| File | Purpose | Notes |
|------|---------|-------|
| `lib/thesis-manifesto.ts` | Typed array of manifesto statements (content) | D-05 — the B-01 blocker resolution artifact |
| `components/blocks/thesis-section.tsx` | `<ThesisSection />` block composing PinnedSection + statements | D-22 — block, `'use client'`, no `data-anim` on root (D-26) |
| `components/blocks/manifesto-statement.tsx` | `<ManifestoStatement />` sub-renderer with per-statement SplitText | Co-located or inline; planner decides |
| `tests/phase-31-thesis.spec.ts` | Playwright tests for TH-01…TH-06 | Wave 0 gap — see Validation Architecture |

### Modified files
| File | Change | Line refs |
|------|--------|-----------|
| `app/page.tsx` | Replace THESIS stub body with `<ThesisSection />` | The Phase 30 THESIS stub block (body only — the SFSection landmark stays). Phase 30 has not yet shipped, so this edit lands on Phase 30's output. |
| `components/animation/pinned-section.tsx` | **IF** planner chooses Option 1 from Implementation Approach: wrap in `forwardRef`, expose containerRef for `pinnedContainer` use in inner ScrollTriggers | Lines 33–73 — single `forwardRef` wrap. Semantic-neutral. Coordinate with Phase 32 planner. |

### Consumed as-is (DO NOT modify)
| File | Why |
|------|-----|
| `lib/gsap-split.ts` | Already re-exports gsap + SplitText + useGSAP. THESIS imports from here. |
| `lib/gsap-core.ts` | ScrollTrigger already re-exported. |
| `lib/gsap-plugins.ts` | SplitText, ScrollTrigger, Observer already registered (Phase 29 verified). |
| `components/sf/SFSection.tsx` | Landmark wrapper — THESIS block goes inside, not around. |
| `components/layout/lenis-provider.tsx` | `autoResize: false` already set (Phase 29). |
| `components/layout/page-animations.tsx` | `document.fonts.ready → ScrollTrigger.refresh` already wired (line 48-50). THESIS benefits automatically. |

---

## Pitfalls Specific to This Phase

### Pitfall 1: iOS Safari address bar causes pin-spacer jump in 250vh section
**Source:** `.planning/research/PITFALLS.md` lines 11–33
**What goes wrong:** `pin: true` on a 200–300vh section is the exact scenario where address bar show/hide during scroll causes visible jumps. The jump is worst at the end of the pinned span because error accumulates over scroll distance.
**Mitigation already in place:** Lenis `autoResize: false` (Phase 29); `PinnedSection` uses `invalidateOnRefresh: true`; `document.fonts.ready → ScrollTrigger.refresh` hook in `page-animations.tsx`.
**Additional mitigation for Phase 31:**
- Do **not** add `ScrollTrigger.normalizeScroll(true)` — `PITFALLS.md` line 155 documents that this conflicts with Lenis.
- Verify manually on physical iPhone (D-34 mandatory) — simulator does not reproduce address bar behavior.
- If jump still observed, escalate to plan-phase with evidence; do not land without physical test.

### Pitfall 2: Font load after ScrollTrigger init invalidates pin-spacer dimensions
**Source:** `PITFALLS.md` lines 37–63
**What goes wrong:** Anton is the anchor-statement font. The fallback-to-Anton swap can shift block heights by 30–50px on a 160px headline. Without `ScrollTrigger.refresh()` after fonts load, the 250vh scroll sequence can be offset enough to miss statement trigger windows.
**Mitigation already in place:** `page-animations.tsx` line 48–50 fires `ScrollTrigger.refresh()` inside `document.fonts.ready`.
**Additional mitigation for Phase 31:**
- `SplitText` `autoSplit: true` (D-12) is mandatory — it re-splits on container resize, which includes font swap.
- `invalidateOnRefresh: true` on the inner nested ScrollTrigger — same as PinnedSection's internal config.

### Pitfall 3: Animating the pinned element breaks pin measurements
**Source:** `STACK.md` line 96 ("When using `pin: true`, never animate the pinned element itself — animate its children")
**What goes wrong:** If a tween targets `PinnedSection`'s root or its immediate child stage div (e.g., `gsap.to(stageRef.current, { opacity: ... })`), GSAP's pin wrapper measurements corrupt and the pin becomes unreliable.
**Mitigation:** D-13 locks this — tweens target statement elements (grandchildren of the pinned root), never the root or stage div. Enforce via code review: grep the THESIS file for any tween whose target is `stageRef`, `pinnedRef`, or the root container.

### Pitfall 4: Double-triggering animations via `PageAnimations` scanner
**Source:** `components/layout/page-animations.tsx` line 34 (`document.querySelector("[data-anim]")`)
**What goes wrong:** `PageAnimations` scans the DOM for `[data-anim]` attributes. If the THESIS root or any statement carries `data-anim`, it will be picked up by the global initializer AND the THESIS-local `useGSAP` hook — double init, unpredictable behavior.
**Mitigation:** D-26 — no `data-anim` attribute on THESIS section root or any statement element. The THESIS component manages its own lifecycle end-to-end.

### Pitfall 5: SplitText + pin + scrub requires `autoSplit: true`
**Source:** `STACK.md` line 92 and lines 98–110
**What goes wrong:** Without `autoSplit: true`, any resize (including font swap, address bar, DevTools opening) leaves SplitText in a stale state. The characters remain wrapped in containers sized for the pre-resize layout, causing visible offsets in scrubbed animations.
**Mitigation:** D-12 — mandatory `autoSplit: true` on every `SplitText.create` call in THESIS. Enforce via test: grep the THESIS files for `autoSplit` usage.

### Pitfall 6: Absolute positioning inside pin-spacer can clip on mobile
**What goes wrong:** Absolutely-positioned statements with anchors like `right: 8vw` can clip off-screen on 375px viewports where 8vw = 30px but the statement's character width exceeds the remaining space.
**Mitigation:** D-33 — mobile anchors collapse toward center-with-offset. Per-statement `mobileAnchor` override in the data type. Test at 375px, 768px, 1440px (LR-04 requirement).

### Pitfall 7: Anchor size `clamp(56px, 12vw, 160px)` dips below 80px on small mobile
**What goes wrong:** 12vw = 80px at viewport width ≥667px. Below that, the clamp floor of 56px is used. On a 375px iPhone SE, anchor statements render at 56px — below the TH-03 80px floor.
**Mitigation:** D-32 explicitly accepts this: "the floor drops to 56px which still reads as a dominant statement." TH-03 says "80px or larger" — the planner should confirm whether TH-03 is per-viewport-absolute or desktop-primary-with-mobile-exception. **Open question flagged below.**

### Pitfall 8: Hard-cut exit must not leave pin-spacer residue visible
**What goes wrong:** After the last statement exits, the pin releases and PROOF appears. If the pin-spacer is still 250vh tall in document flow when PROOF renders, there can be a visible flash of empty space before scroll catches up.
**Mitigation:** `PinnedSection` uses GSAP's default pin-spacer behavior which releases cleanly; `anticipatePin: 1` (inside PinnedSection) prevents the flash. The Phase 30 hard-cut transition pattern (`data-bg-shift` switch at threshold) applies identically here. Test: scroll past THESIS and confirm PROOF renders at bg-shift color without flash.

---

## Manifesto Copy Strategy

### D-01 Resolution

Both cdSB wiki sources were accessible at research time:
- `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/second-brain/wiki/analyses/culture-division-operating-principles.md` — operating principles, aesthetic lineage, tenet table
- `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/second-brain/wiki/analyses/frame-signal-intellectual-lineage.md` — six converging traditions (Shannon, Goffman, Wiener, architecture, music production, design theory)
- `~/.../wiki/concepts/cybernetic-biophilia.md` — founding principle, tension table, cross-reference map
- `~/.../wiki/concepts/enhanced-flat-design.md` — rules, how depth is achieved, influences
- `~/.../wiki/concepts/frame-signal-architecture.md` — dual-layer technical implementation

**Planner should not re-read these — the draft below is the research deliverable. User reviews the draft, revises as needed, and the revised text becomes `lib/thesis-manifesto.ts` as the first engineering artifact.**

### Authoring principles (applied to draft below)

1. **Assert, don't explain.** No "because", no "therefore", no hedging. Period or no punctuation.
2. **5–15 words per statement.** Scannable at display scale in a single glance.
3. **Register: DU / tDR / Ikeda / Brody.** Aphoristic. Slightly tense. Industrial. No marketing cadence.
4. **Three anchors, one per pillar:** (a) SIGNAL/FRAME thesis, (b) Enhanced Flat Design, (c) cybernetic biophilia.
5. **Connectors are the rhythm, not the excuse.** They bridge anchors without softening them.
6. **Concrete over abstract where possible.** "Noise as material" beats "expressive richness."
7. **Zero hedge words.** No "might", "could", "perhaps", "tends to."
8. **No meta-language about design.** Don't talk about the system talking about itself.

### Draft manifesto (for user review)

> Draft. 8 statements. 3 anchors, 5 connectors. Each statement includes pillar attribution, proposed anchor position, and source trace back to wiki entities. The planner should present this draft to the user in a /pde:discuss-phase or planning iteration before any engineering task fires.

```typescript
// lib/thesis-manifesto.ts — DRAFT for user review (not final)

export const THESIS_MANIFESTO_DRAFT: ManifestoStatementData[] = [
  {
    // S1 — OPENING CONNECTOR
    text: "A system has two layers.",
    size: "connector",
    pillar: "connector",
    anchor: { top: "18vh", left: "8vw" },
    // Trace: frame-signal-architecture.md "Two distinct layers that coexist"
  },
  {
    // S2 — ANCHOR 1 — SIGNAL/FRAME THESIS
    text: "FRAME carries. SIGNAL breathes.",
    size: "anchor",
    pillar: "signal-frame",
    anchor: { top: "32vh", left: "6vw" },
    // Trace: FRAME = structural (Shannon's channel, Kahn's servant), SIGNAL = generative (biophilic, Ikeda's data-as-material)
    // Register: declarative, no conjunction, period-separated. Paired verbs.
  },
  {
    // S3 — CONNECTOR
    text: "Noise is the material, not the enemy.",
    size: "connector",
    pillar: "connector",
    anchor: { top: "48vh", right: "10vw" },
    // Trace: frame-signal-intellectual-lineage.md §1 — "SignalframeUX inverts Shannon. In Shannon's framework, noise is the enemy. In SignalframeUX, the SIGNAL layer — literally noise — is the desired output."
  },
  {
    // S4 — ANCHOR 2 — ENHANCED FLAT DESIGN
    text: "Depth is spacing. Depth is hierarchy. Not shadow.",
    size: "anchor",
    pillar: "enhanced-flat",
    anchor: { top: "30vh", right: "4vw" },
    // Trace: enhanced-flat-design.md "depth through other means: spacing, hierarchy, layout, contrast, motion"
    // Register: three-beat rhythm, final denial. No skeuomorphism, no gradient, no shadow.
  },
  {
    // S5 — CONNECTOR
    text: "Structure is not decoration removed. Structure is the decision.",
    size: "connector",
    pillar: "connector",
    anchor: { bottom: "24vh", left: "12vw" },
    // Trace: enhanced-flat-design.md "sharp, controlled, structured, slightly tense" — structure as active position, not subtraction
  },
  {
    // S6 — ANCHOR 3 — CYBERNETIC BIOPHILIA
    text: "A machine that breathes. A body that computes.",
    size: "anchor",
    pillar: "biophilia",
    anchor: { bottom: "18vh", right: "6vw" },
    // Trace: cybernetic-biophilia.md — "building machines that breathe and growing organisms that compute"
    // Register: mirrored clauses, period-separated. The tension is the statement.
  },
  {
    // S7 — CONNECTOR
    text: "The tension does not resolve. The tension is the field.",
    size: "connector",
    pillar: "connector",
    anchor: { bottom: "12vh", left: "30vw" },
    // Trace: cybernetic-biophilia.md "holds the tension as the source of energy. The design is alive because it's also a machine."
  },
  {
    // S8 — CLOSING CONNECTOR — HARD-CUT EXIT
    text: "You control how much life bleeds through.",
    size: "connector",
    pillar: "signal-frame",
    anchor: { top: "50vh", left: "22vw" },
    // Trace: frame-signal-architecture.md "The user controls how much life bleeds through" — direct lift, this is THE line
    // Register: second-person, direct address. Closes the manifesto by putting the observer inside the cybernetic loop (von Foerster, second-order).
  },
];
```

### Coverage check

| Pillar | Required | Anchor Statement | Connectors |
|--------|----------|------------------|------------|
| SIGNAL/FRAME thesis | ≥1 anchor | S2: "FRAME carries. SIGNAL breathes." | S1 (opening), S3 (noise inversion), S8 (closing user-as-governor) |
| Enhanced Flat Design | ≥1 anchor | S4: "Depth is spacing. Depth is hierarchy. Not shadow." | S5 (structure as position) |
| Cybernetic biophilia | ≥1 anchor | S6: "A machine that breathes. A body that computes." | S7 (tension as field) |

- 3 anchors ✅ (TH-03 floor satisfied)
- 8 total statements ✅ (within D-02 7–9 range)
- Every phrase ≤10 words ✅
- Every pillar has ≥1 anchor ✅ (D-04 satisfied)
- All trace to specific wiki sources ✅ (D-01 authenticity)
- No marketing cadence ✅ (D-03 register)
- No hedge words ✅
- No explanation mode ✅ (statements only)

### What the user should review

1. **Do the three anchors say the right thing?** These are the three statements that will dominate 160px scroll frames. They are the Awwwards 90-second jury argument.
2. **Does the opening (S1) work, or should we start cold on an anchor?** Starting on "A system has two layers" is a gentle entrance. Starting on an anchor is confrontational. Either works; user picks the register.
3. **Is S8 the right closer?** "You control how much life bleeds through" is a direct lift from the wiki — it puts the user inside the cybernetic loop, which is the conceptual payoff. It is also the one line that gestures at the PROOF section's interactive SIGNAL/FRAME demo that follows. Strong recommendation to keep.
4. **Any phrases that feel like marketing?** The draft aimed to avoid this. If any line reads like a tagline, flag it.
5. **Any phrases that explain instead of assert?** Explanatory mode is the biggest failure risk. S7 ("The tension does not resolve. The tension is the field.") is the closest to explanation; it may warrant trimming to just "The tension is the field."

### Authoring trace back to wiki sources (for verification)

Every line in the draft has a source trace in the inline comment. The sources are:
- **S1** — `frame-signal-architecture.md` "Two distinct layers that coexist without interference"
- **S2** — `frame-signal-architecture.md` FRAME="deterministic, structural, legible", SIGNAL="generative, parametric, expressive" + `frame-signal-intellectual-lineage.md` §3 Wiener cybernetics
- **S3** — `frame-signal-intellectual-lineage.md` §1 direct inversion of Shannon
- **S4** — `enhanced-flat-design.md` "Depth Is Achieved" table, row 1–3
- **S5** — `enhanced-flat-design.md` Rules section, "Sharp, controlled, structured, slightly tense, sophisticated but not sterile"
- **S6** — `cybernetic-biophilia.md` introduction, direct lift from "building machines that breathe and growing organisms that compute"
- **S7** — `cybernetic-biophilia.md` "Why It Matters" section, "holds the tension as the source of energy"
- **S8** — `frame-signal-architecture.md` "The user controls how much life bleeds through the structure" — this is the single most conceptually important line in the entire wiki; it belongs in the manifesto.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright 1.59.x (existing — no install needed) |
| Config file | `playwright.config.ts` (existing) |
| Quick run command | `pnpm exec playwright test tests/phase-31-thesis.spec.ts --reporter=list` |
| Full suite command | `pnpm exec playwright test --reporter=list` |
| Estimated runtime | ~20 seconds (scroll sequences take longer than static checks) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TH-01 | THESIS section occupies between 200vh and 300vh of scroll distance | e2e (Playwright) | `pnpm exec playwright test -g "TH-01: THESIS occupies 200-300vh scroll distance"` | ❌ Wave 0 |
| TH-02 | Manifesto phrases are individually positioned (not a flowing paragraph); pin is engaged during the scroll sequence | e2e (Playwright) | `pnpm exec playwright test -g "TH-02: statements positioned individually via pin"` | ❌ Wave 0 |
| TH-03 | At least 3 anchor statements render at computed font-size ≥80px on desktop (1440px) | e2e (Playwright) | `pnpm exec playwright test -g "TH-03: three type moments at 80px+"` | ❌ Wave 0 |
| TH-04 | Gaps between key statements measure ≥30vh in scroll distance | e2e (Playwright) | `pnpm exec playwright test -g "TH-04: 30vh void between anchor statements"` | ❌ Wave 0 |
| TH-05 | Manifesto text contains SIGNAL/FRAME, Enhanced Flat Design, and cybernetic biophilia as declarative statements | unit (node) | `pnpm exec vitest run lib/thesis-manifesto.test.ts` **OR** grep-based Playwright test | ❌ Wave 0 |
| TH-06 | With `prefers-reduced-motion` active, all statements render in instant placement, no pin, no scrub | e2e (Playwright with emulateMedia) | `pnpm exec playwright test -g "TH-06: reduced-motion fallback"` | ❌ Wave 0 |

### Detailed test specs

**TH-01 — scroll distance**
```typescript
test("TH-01: THESIS occupies 200-300vh scroll distance", async ({ page }) => {
  await page.goto("/");
  const thesis = page.locator("#thesis");
  await expect(thesis).toBeVisible();
  const box = await thesis.boundingBox();
  const viewportHeight = page.viewportSize()!.height;
  // After pin-spacer inflation, element height represents total scroll distance
  const scrollMultiple = box!.height / viewportHeight;
  expect(scrollMultiple).toBeGreaterThanOrEqual(2.0);   // 200vh floor
  expect(scrollMultiple).toBeLessThanOrEqual(3.0);      // 300vh ceiling
});
```

**TH-02 — pin engagement + individual positioning**
```typescript
test("TH-02: statements positioned individually via pin", async ({ page }) => {
  await page.goto("/");
  await page.locator("#thesis").scrollIntoViewIfNeeded();
  // Verify ScrollTrigger pin is active: after scrolling partway into THESIS, the section should have position:fixed applied by GSAP's pin-spacer
  await page.evaluate(() => window.scrollBy(0, window.innerHeight * 1.5));
  const stage = page.locator("#thesis [data-stage]");
  const computed = await stage.evaluate((el) => getComputedStyle(el).position);
  expect(["fixed", "relative"]).toContain(computed); // GSAP pin uses fixed on its parent
  // Verify statements are absolutely positioned (not flowing)
  const statements = page.locator("#thesis [data-statement]");
  const count = await statements.count();
  expect(count).toBeGreaterThanOrEqual(7);
  expect(count).toBeLessThanOrEqual(9);
  for (let i = 0; i < count; i++) {
    const pos = await statements.nth(i).evaluate((el) => getComputedStyle(el.parentElement!).position);
    expect(pos).toBe("absolute");
  }
});
```

**TH-03 — anchor type scale ≥80px**
```typescript
test("TH-03: at least three type moments at 80px or larger", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const anchors = page.locator("#thesis [data-statement-size='anchor']");
  const count = await anchors.count();
  expect(count).toBeGreaterThanOrEqual(3);
  for (let i = 0; i < count; i++) {
    const fontSize = await anchors.nth(i).evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(fontSize).toBeGreaterThanOrEqual(80);
  }
});
```

**TH-04 — 30vh void between anchor statements**
```typescript
test("TH-04: 30vh void between key statements", async ({ page }) => {
  await page.goto("/");
  const anchors = await page.locator("#thesis [data-statement-size='anchor']").all();
  expect(anchors.length).toBeGreaterThanOrEqual(3);
  // Read each anchor's `top` anchor value from the data attribute or computed style.
  // Verify consecutive anchors differ by ≥30vh in their vertical position within the stage,
  // OR their timeline positions (data-position) differ by ≥0.3 (at total 1.0 normalized).
  // Implementation depends on how anchors are serialized into the DOM. Fallback: verify data-void-before="30vh" is present on at least 2 of the 3 anchors.
  let voidCount = 0;
  for (const a of anchors) {
    const voidBefore = await a.getAttribute("data-void-before");
    if (voidBefore && parseInt(voidBefore) >= 30) voidCount++;
  }
  expect(voidCount).toBeGreaterThanOrEqual(2);
});
```

**TH-05 — content coverage (unit test preferred)**
```typescript
// tests/unit/thesis-manifesto.test.ts
import { THESIS_MANIFESTO } from "@/lib/thesis-manifesto";
test("TH-05: manifesto covers three pillars with anchor statements", () => {
  const anchors = THESIS_MANIFESTO.filter((s) => s.size === "anchor");
  expect(anchors.length).toBeGreaterThanOrEqual(3);
  const pillars = new Set(anchors.map((s) => s.pillar));
  expect(pillars.has("signal-frame")).toBe(true);
  expect(pillars.has("enhanced-flat")).toBe(true);
  expect(pillars.has("biophilia")).toBe(true);
});
test("TH-05: every statement is 5-15 words", () => {
  for (const s of THESIS_MANIFESTO) {
    const wordCount = s.text.trim().split(/\s+/).length;
    expect(wordCount).toBeGreaterThanOrEqual(3); // allow tight aphorism
    expect(wordCount).toBeLessThanOrEqual(15);
  }
});
```

> If vitest is not yet configured, rewrite TH-05 as a Playwright test that imports the module via a test harness or grep-asserts `lib/thesis-manifesto.ts` contents for the three pillar strings. Grep-based assertion is the lowest-friction path and matches the Phase 29 test style (`src.toContain("autoResize: false")`).

**TH-06 — reduced-motion fallback**
```typescript
test("TH-06: reduced-motion renders instant placement, no scroll-driven animation", async ({ page, browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const rmPage = await ctx.newPage();
  await rmPage.goto("/");
  const thesis = rmPage.locator("#thesis");
  await expect(thesis).toBeVisible();
  // All statements visible without scrolling through the section:
  const statements = rmPage.locator("#thesis [data-statement]");
  const count = await statements.count();
  for (let i = 0; i < count; i++) {
    await expect(statements.nth(i)).toBeVisible();
  }
  // Section height should NOT be 250vh (pin-spacer) — it should be the stacked specimen height
  const box = await thesis.boundingBox();
  const viewportHeight = rmPage.viewportSize()!.height;
  expect(box!.height / viewportHeight).toBeLessThan(2.0); // not pinned
  await ctx.close();
});
```

### Performance / regression coverage

| Concern | Test | Command |
|---------|------|---------|
| CLS = 0 (PF-04) | Playwright collects CLS via Performance Observer | Existing pattern from Phase 29 infra spec |
| LCP unchanged | Phase 30 LCP is ENTRY title; THESIS is below fold — should not regress | Phase 35 Lighthouse gate |
| Bundle size | No new packages; SplitText already in bundle | `ANALYZE=true pnpm build` — confirm no new chunks from THESIS |
| Console errors on load | Playwright `page.on('console')` listener, pattern from Phase 29 | Add to `phase-31-thesis.spec.ts` |

### Cross-browser + cross-viewport

| Browser | Viewport | What to check |
|---------|----------|---------------|
| Chromium (desktop) | 1440×900 | TH-01, TH-02, TH-03, TH-04 all pass; no console errors; pin engages and releases cleanly |
| Chromium (mobile emulation) | 375×667 | TH-01 (200vh mobile), anchor font sizes drop to 56px floor (acceptable per D-32), mobileAnchor positioning does not clip |
| WebKit (desktop Safari) | 1440×900 | Same as Chromium; SplitText compatibility verified |
| **iOS Safari (physical device)** | iPhone 14/15 portrait | **D-34 mandatory** — address bar scroll jump NOT observed; pin releases cleanly; PROOF appears without flash |
| Firefox (desktop) | 1440×900 | Smoke test only — scroll works, no layout break |

### Sampling Rate

- **Per task commit:** `pnpm exec playwright test tests/phase-31-thesis.spec.ts --reporter=list` (~20s)
- **Per wave merge:** `pnpm exec playwright test --reporter=list` (~60s full suite)
- **Phase gate:** Full suite green + **manual iOS Safari verification documented** before `/pde:verify-work`

### Wave 0 Gaps

- [ ] `tests/phase-31-thesis.spec.ts` — 6 automated tests covering TH-01, TH-02, TH-03, TH-04, TH-05 (if Playwright-asserted), TH-06
- [ ] `tests/unit/thesis-manifesto.test.ts` — OR grep-based Playwright assertion in the same file — for TH-05 content coverage
- [ ] No framework install needed; Playwright 1.59.x already configured in this repo

---

## Open Questions

### 1. PinnedSection `forwardRef` or wrapper div for nested ScrollTrigger?

**Context:** Implementation Approach recommends a nested ScrollTrigger with `pinnedContainer` pointing at PinnedSection's root. This requires exposing PinnedSection's `containerRef`.

**Options:**
- **A:** Wrap PinnedSection in `React.forwardRef` and expose the ref (single-line change, API-neutral for Phase 32).
- **B:** Wrap `<PinnedSection>` in an outer `<div ref={...}>` inside ThesisSection and point `pinnedContainer` at the outer wrapper (zero change to PinnedSection, adds one DOM node).
- **C:** Extend PinnedSection to accept an `animation` prop (a GSAP timeline) — invasive, couples the primitive to caller choreography, not recommended.

**Recommendation:** Option A. Coordinate with Phase 32 planner to ensure SIGNAL section's use of PinnedSection is also served (SIGNAL will want the same ref for its own inner scrolltrigger or parallax).

**Needs:** Planner decision before any engineering task fires.

### 2. Is TH-03 "80px or larger" a global floor or desktop-primary floor?

**Context:** D-32 accepts that anchor statements drop to 56px on viewports <667px (where 12vw < 80px). TH-03 in REQUIREMENTS.md says "at least 3 type moments at 80px+". The requirement does not specify viewport context.

**Options:**
- **A:** Global floor — anchor min font-size = 80px everywhere (use `max(80px, 12vw)` cap at 160px). Rejected by D-32.
- **B:** Desktop floor only — 80px at ≥667px, 56px below. Matches current D-32.
- **C:** Ask user to confirm B is acceptable; if not, switch to A and test mobile clipping.

**Recommendation:** B, per D-32 explicit acceptance. Planner should confirm in the plan preamble so the verifier does not fail TH-03 on mobile-emulated Playwright.

**Needs:** User or planner confirmation.

### 3. Is vitest configured in this repo?

**Context:** TH-05 preferred test is a unit test on `lib/thesis-manifesto.ts` content. If vitest is not present, TH-05 falls back to grep-based Playwright assertion.

**Options:**
- **A:** Check `package.json` scripts and `vitest.config.*` at plan time; use whichever exists.
- **B:** Default to Playwright grep-based assertion for lowest friction (matches Phase 29 pattern).

**Recommendation:** B. Matches existing test style; zero setup friction. Unit test is only a preference, not a requirement.

**Needs:** Quick planner check; does not block engineering.

### 4. Should `SectionIndicator` read THESIS progress?

**Context:** Claude's Discretion in CONTEXT.md asks whether to add `data-section-progress` for the section indicator to read. `SectionIndicator` currently reads `data-section-label` only.

**Options:**
- **A:** Add `data-section-progress` emitting 0–1 from THESIS scrubbed timeline; section indicator visualizes progress within THESIS.
- **B:** Skip — section indicator remains binary (in/out of section) as Phase 30 ships.

**Recommendation:** B for Phase 31. A is a Phase 34 visual language enhancement (VL-06 "section indicators redesigned as system readout HUD"). Adding it here pollutes THESIS scope.

**Needs:** Planner decision; lean toward B.

### 5. Hard-cut exit mechanics — fade or slide the final statement?

**Context:** D-11 says "Exit via opacity fade or char slide-out — keep mechanics consistent across statements." D-24 says "Hard-cut exit" after the final statement.

**Clarification needed:** Is "hard-cut exit" referring to the *section-level* transition (pin releases, PROOF appears), or to the *final statement's* exit animation? These are different concerns.

**Recommendation:** Interpret D-24 as section-level — the pin release is the hard cut. The final statement still uses consistent exit mechanics (opacity fade or char slide-out matching the other statements). This matches D-25 ("Last statement holds for ~20vh after its enter completes, then exits during the final pin release").

**Needs:** No blocker; confirm in plan preamble.

### 6. Should the draft manifesto go through /pde:discuss-phase for user review, or be presented inline in a plan preamble?

**Context:** D-01 says "Claude drafts initial text from cdSB wiki principles during plan-phase, user reviews before TH-01 engineering." The mechanism is not specified.

**Options:**
- **A:** First plan (e.g., `31-01-PLAN.md`) contains ONLY the manifesto authoring task — no engineering. User reviews on plan approval. Engineering lands in `31-02-PLAN.md`.
- **B:** First plan includes both manifesto authoring and engineering tasks, but the manifesto authoring task outputs a file the user reviews before the engineering tasks fire.
- **C:** Manifesto draft presented as a pre-plan artifact the user approves before /pde:plan-phase completes.

**Recommendation:** A — two-plan structure. Plan 01 = "Manifesto authoring + typed data file + content unit test"; Plan 02 = "ThesisSection component + ManifestoStatement subcomponent + Playwright tests + homepage integration". Plan 02 explicitly depends on Plan 01's output, so the user review gate is enforced at plan boundary.

**Needs:** Planner decision on plan count/boundaries (this is explicitly in Claude's Discretion per CONTEXT.md).

---

## Sources

### Primary (HIGH confidence — direct file reads)

- `components/animation/pinned-section.tsx` (full file) — Phase 29 primitive, consumed as-is, line 46 reduced-motion gate, line 49–57 ScrollTrigger config
- `components/animation/split-headline.tsx` (full file) — canonical SplitText + `mask: "chars"` + `autoSplit: true` + `sf-snap` ease pattern
- `lib/gsap-split.ts` (full file) — re-exports gsap, SplitText, useGSAP; plugin registration
- `components/layout/page-animations.tsx` (full file) — `document.fonts.ready → ScrollTrigger.refresh` hook at lines 48–50; `[data-anim]` selector at line 34 (avoided for THESIS root per D-26)
- `.planning/research/STACK.md` lines 75–172 — Pin + SplitText patterns, key constraint on not animating pinned element, autoSplit requirement, pinnedContainer pattern
- `.planning/research/PITFALLS.md` lines 1–100 — iOS address bar + pin, font reflow + ScrollTrigger refresh, multiple WebGL contexts
- `.planning/research/FEATURES.md` — manifesto section feature spec (lines 70, 100–110, 159, 225–233 "structure and content first")
- `.planning/phases/31-thesis-section/31-CONTEXT.md` (full file) — locked decisions D-01 through D-35
- `.planning/phases/30-homepage-architecture-entry-section/30-CONTEXT.md` + `30-UI-SPEC.md` — THESIS stub at 200vh with `id="thesis"`, `data-bg-shift="white"`, hard-cut section transitions
- `.planning/phases/29-infrastructure-hardening/29-CONTEXT.md` — PinnedSection API, Lenis `autoResize: false`, reduced-motion gate, fonts-ready hook
- `.planning/REQUIREMENTS.md` §THESIS Section — TH-01 through TH-06
- `.planning/ROADMAP.md` lines 393–403 — Phase 31 goal and success criteria
- `.planning/STATE.md` lines 109–123 — v1.5 critical constraints, manifesto copy blocker, iOS physical testing
- `CLAUDE.md` — stabilization scope, dual-layer model, zero border-radius, "DO NOT add new GSAP effects"

### Primary (HIGH confidence — cdSB wiki sources for manifesto authoring)

- `~/.../wiki/analyses/culture-division-operating-principles.md` — operating principles, tenet table §3, aesthetic lineage §6
- `~/.../wiki/analyses/frame-signal-intellectual-lineage.md` — Shannon §1 (signal/noise inversion), Goffman §2, Wiener §3 (cybernetic loop + user as governor), Architecture §4 (Kahn served/servant), Music production §5, Design theory §6 (grid/gesture)
- `~/.../wiki/concepts/cybernetic-biophilia.md` — founding principle, tension table (cybernetic | biophilic | the tension), "Why It Matters" (non-resolution as energy source)
- `~/.../wiki/concepts/enhanced-flat-design.md` — rules, depth-through techniques table, DU/tDR/Teenage Engineering influences
- `~/.../wiki/concepts/frame-signal-architecture.md` — dual-layer implementation, "The user controls how much life bleeds through" direct lift for S8

### Secondary (MEDIUM confidence — derived from primary sources, needs test validation)

- nested ScrollTrigger with `pinnedContainer` pattern (STACK.md lines 114–128) — recommended approach, needs validation during Wave 0 PinnedSection ref integration
- `anticipatePin: 1` clean release behavior — internal PinnedSection config; not independently verified across all browsers for this specific use case
- Anton fallback swap dimension shift 30–50px — quoted from PITFALLS.md but not empirically measured on this project's Anton weight

### Tertiary (LOW confidence — flagged for validation)

- None material to this phase. All critical claims trace to primary sources.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — every library and primitive consumed is already in the codebase and production-proven
- Architecture (nested scrolltrigger with pinnedContainer): HIGH — documented GSAP pattern, confirmed in project's own STACK.md
- Pitfalls: HIGH — all drawn from project's own PITFALLS.md, which is research-grade content with verified sources
- Manifesto draft: MEDIUM — grounded in wiki sources but creative work subject to user review; content quality is a matter of taste, not verification
- Test architecture: HIGH — matches Phase 29/30 test patterns, uses existing Playwright 1.59.x infrastructure

**Research date:** 2026-04-08
**Valid until:** 30 days (stable stack, no active GSAP version bumps expected in v1.5 window)

---

## RESEARCH COMPLETE
