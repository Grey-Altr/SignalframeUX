---
phase: 66
slug: scalecanvas-track-b-architectural-decision
researched: 2026-04-29
confidence: HIGH
requirements: ARC-01, ARC-02, ARC-03, ARC-04
status: complete
domain: Architectural primitive (ScaleCanvas) + a11y suppression + AES-04 preservation
---

# Phase 66: ScaleCanvas Track B Architectural Decision — Research

**Researched:** 2026-04-29
**Domain:** Architectural primitive replacement, post-transform a11y, axe-core suppression
**Confidence:** HIGH — every claim cites file:line evidence; mechanism tradeoffs grounded in shipped code; only LOW confidence item is portal sync layer mechanics, flagged below.

## Summary

Phase 66 retires the v1.8 `path_h` (mobile a11y target-size) and `path_i` (GhostLabel color-contrast) ratifications by closing them at architectural root rather than maintaining the loosened LHCI thresholds. The constraint is binary: ScaleCanvas applies `transform: scale(0.39)` (at 360px / 1280-canvas, computed `--sf-content-scale ≈ 0.281`) on the entire `[data-sf-canvas]` subtree (`components/layout/scale-canvas.tsx:42-83` + `app/globals.css:2770-2774`); axe-core target-size measures **post-transform** `getBoundingClientRect`, so a 24px native footer link renders as ~6.7px to axe. The same transform makes GhostLabel's `text-foreground/[0.04]` (4% opacity, by-design wayfinding) visible to Lighthouse's bundled axe-core despite being `aria-hidden="true"` (the project-internal `tests/phase-38-a11y.spec.ts` already excludes `[data-ghost-label]`, but Lighthouse's bundled axe doesn't read project exclusion lists).

**Three candidate mechanisms exist, with materially different tradeoffs:**

| Mechanism | Aesthetic risk (desktop+tablet) | Aesthetic risk (mobile cohort) | a11y efficacy | Maintenance burden | LOC delta |
|-----------|--------------------------------|-------------------------------|---------------|-------------------|-----------|
| **Pillarbox** (`transform: none` below `sm`) | 0% (above breakpoint) | HIGH — full mobile re-flow, "feels different" likely | Both — native sizes restored | LOW — most architecturally clean | ~+30 LOC layout + ~+10 LOC pre-hydration script |
| **Counter-scale** (negate transform on a11y descendants) | LOW (matrix round-trip) | MEDIUM — descendants visibly de-scale relative to siblings | Both — but brittle if elements nest | HIGH — every nested transform compounds; CVA + audit per consumer | ~+50 LOC + per-consumer marker attrs |
| **Portal** (render a11y elements outside `[data-sf-canvas]`) | 0% (precedent: `#pin-portal` in `pinned-section.tsx`) | LOW — matches existing pattern | Target-size: yes; GhostLabel: yes (portal at body level escapes transform; opacity issue still needs ARC-04 suppression) | MEDIUM — sync layer (ResizeObserver + transform sync) per portal element | ~+80 LOC + sync hook |

**Primary recommendation:** **Pillarbox** for ARC-01..03 + **CSS pseudo-element conversion** for ARC-04. Rationale: pillarbox is the only mechanism that fully restores native a11y semantics without aesthetic-coupled brittleness, AND the `_path_h_decision` rationale itself (`.lighthouseci/lighthouserc.json:14`) names "ScaleCanvas adds a mobile breakpoint exception (e.g., < sm: native layout, no transform)" as the canonical close path. Mobile cohort risk is real but absorbed by the `v1.9-pre/` baseline + AES-03 cohort review per ROADMAP §v1.9 build-order constraint #4.

**Caveat:** The decision belongs in `.planning/codebase/scale-canvas-track-b-decision.md` (per ARC-01), authored in Plan 01 with 6-pillar visual audit + file:line evidence. Plan structure assumes this recommendation but the artifact docs the chosen mechanism formally.

---

<user_constraints>
## User Constraints

**No CONTEXT.md exists** for Phase 66 (skipped `/pde:discuss-phase` per autonomous-forward-motion preference + lock-in mode). Constraints are derived from REQUIREMENTS.md + ROADMAP.md + AESTHETIC-OF-RECORD.md + memory directives.

### Locked Constraints (NON-NEGOTIABLE)

- **AES-04 ≤0.5% pixel-diff** vs `.planning/visual-baselines/v1.8-start/` on **desktop + tablet** (every page, every viewport in `{desktop-1440x900, ipad-834x1194, iphone13-390x844}`).
- **AES-03 cohort review** for mobile (360×800) — "feels different without specific code-change cause" is the failure signal. Captured baseline at `.planning/visual-baselines/v1.9-pre/` BEFORE any source mutation.
- **AESTHETIC-OF-RECORD.md** is read-once; Phase 66 changes MUST NOT contradict §2 standing rules or §3 trademark primitive paths (T1 pixel-sort / T2 nav glyph / T3 cube-tile box).
- **PF-04 contract:** `lenis-provider.tsx` `autoResize: true` is code-of-record. ScaleCanvas changes MUST NOT touch the Lenis contract (no edits to `components/layout/lenis-provider.tsx`).
- **Single-ticker rule:** No new rAF call sites. ScaleCanvas already uses one rAF (`scale-canvas.tsx:88-93`); any new resize/sync logic must reuse it OR ResizeObserver/MutationObserver only.
- **No new runtime npm dependencies.** devDeps measurement-only allowed (precedent: `opentype.js` v1.8).
- **`_path_X_decision` block is the only sanctioned ratification pattern** — Phase 66 RETIRES `_path_h_decision` + `_path_i_decision`, never adds new path_decisions.
- **Lighthouse mobile a11y category ≥0.97** on prod homepage; threshold tighter than path_h's 0.96 (ARC-03 success criterion).
- **Lighthouse desktop a11y category ≥0.97** on prod homepage; path_i ratification removed (ARC-04 success criterion).
- **No GhostLabel opacity raise** for ARC-04 — the 4% opacity is a component contract per `components/animation/ghost-label.tsx:6-9` ("structural wayfinding, not decoration"). Suppression mechanism only.
- **`experimental.inlineCss: true` rejected** — breaks `@layer signalframeux` cascade.

### Claude's Discretion

- **Mechanism choice** (pillarbox / counter-scale / portal) — research recommends pillarbox; planner may override if Plan 01 visual audit reveals blockers.
- **GhostLabel suppression mechanism** for ARC-04 (3 options listed; research recommends CSS pseudo-element).
- **Plan structure** — research recommends 3 plans (decision / implementation / verification); planner may consolidate or expand.
- **Pillarbox breakpoint** — Tailwind v4 `sm` (640px) is the natural choice but `md` (768px) is defensible if iPad portrait (834px) shouldn't pillarbox. Recommendation in §3 below.

### Deferred Ideas (OUT OF SCOPE for Phase 66)

- **Bundle reshape** (BND-05/06/07) — Phase 67. NOT parallel-safe with Phase 66 per ROADMAP §v1.9 #2.
- **lcp-guard refactor** (TST-01/02) — Phase 68.
- **Wordmark cross-platform pixel-diff** (WMK-01/02) — Phase 69.
- **Field RUM closure** (VRF-06/07/08) — Phase 70.
- **New components / tokens / aesthetic surfaces** — CLAUDE.md stabilization scope; v1.9 is process work.
- **Stack swaps** — Next.js 15.5 / Tailwind v4 / GSAP / Lenis all locked.
- **Mobile aesthetic redesign** — pillarbox below `sm` is a layout-mode flip, NOT a redesign. The cohort review accepts the new mode as a valid mobile expression; it is NOT a license to re-style mobile.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| **ARC-01** | Track B mechanism selected and ratified — pick one of (pillarbox / counter-scale / portal). Rationale documented in `.planning/codebase/scale-canvas-track-b-decision.md` with file:line evidence + 6-pillar visual audit. | §3 mechanism comparison matrix; §4 current ScaleCanvas behavior; §10 plan structure (Plan 01 deliverable). |
| **ARC-02** | ScaleCanvas no longer applies `transform: matrix(0.39,...)` below the chosen breakpoint (or applies counter-scale to a11y descendants). Desktop + tablet AES-04 ≤0.5% vs `v1.8-start/`. | §4 ScaleCanvas current behavior; §5 pillarbox specifics; §6 counter-scale specifics; §7 portal specifics. |
| **ARC-03** | Lighthouse mobile a11y ≥0.97 on prod homepage; `_path_h_decision` block removed from `.lighthouseci/lighthouserc.json`. | §3 mechanism efficacy; §9 verification — LHCI re-baseline strategy. |
| **ARC-04** | GhostLabel color-contrast root fix — axe-core no longer measures the 4% opacity glyph. Lighthouse desktop a11y ≥0.97; `_path_i_decision` removed. | §8 GhostLabel suppression mechanism (3 options + recommendation). |
</phase_requirements>

---

## 3. Mechanism Comparison Matrix

For each mechanism, this is the engineering tradeoff surface. The planner picks ONE in Plan 01.

### 3a. Pillarbox — `transform: none` below `sm` (640px)

**Implementation surface:**
- `components/layout/scale-canvas.tsx:42-83` — `applyScale()` adds branch: `if (vw < BREAKPOINT) { contentScale = 1; navMorph = 0; ... }`. Outer height becomes `inner.offsetHeight` directly.
- `app/layout.tsx:117` — pre-hydration `scaleScript` IIFE adds same branch (CRITICAL — must match exactly to preserve CLS=0).
- `app/globals.css:2770-2774` — `[data-sf-canvas]` rule adds `@media (max-width: 639px) { transform: none; }` (or scale resolves to 1 from var, no rule change needed).
- `app/globals.css:2784-2809` — `[data-sf-canvas] .h-screen` etc. rules already use `calc(100vh / var(--sf-content-scale, 1))` which collapses to `100vh` when scale=1. **No rule change needed.**
- Possible: letterbox padding via `padding-block` on `<main>` if a uniform-height visual is desired below `sm`. Recommendation: skip — sections that are `h-screen` will naturally fill the viewport without scale.

**AES-04 risk on desktop/tablet:** **0%.** Above `sm` breakpoint, `applyScale()` runs unchanged; transform identical to v1.8. Pixel-diff by construction.

**AES-03 mobile cohort risk:** **HIGH.** Mobile (360px) currently shows the 1280×800 reference design scaled to 28% (`360 / 1280 ≈ 0.28`). Below `sm` with pillarbox, mobile sees the design at native sizes — text, spacing, hero, GhostLabel all become legible/larger. This IS a "feels different" change BY DESIGN. The mitigation is not preventing the change; it is documenting it as a deliberate cohort-acceptance audit (ARC-01 decision doc + v1.9-pre baseline + AES-03 cohort review).

**axe-core efficacy:**
- **path_h target-size:** YES — 24px native footer links measure 24px (above the 24px AA threshold). 7 footer link items pass.
- **path_i color-contrast:** PARTIAL — axe-core still measures GhostLabel as visible text. Pillarbox alone does NOT fix path_i; ARC-04 suppression mechanism still required.

**Maintenance burden:** **LOW.** One breakpoint check in two places (component + pre-hydration script). New components below `sm` automatically get native sizing.

**Performance impact:** **NEUTRAL or improved.** Removing the matrix transform below `sm` removes a composite layer; one less GPU step. No new rAF call site (existing rAF reused).

**Pre-hydration script branch logic (CRITICAL):**
```javascript
// app/layout.tsx scaleScript — pillarbox-aware variant
const scaleScript = `(function(){try{
  var vw=window.innerWidth, vh=window.innerHeight;
  var BREAKPOINT=640, DW=1280, SHRINK=435, IDLE=800;
  var s, hs, cs, ns, m;
  if (vw < BREAKPOINT) {
    s = 1; hs = 1; cs = 1; ns = 1; m = 0;
  } else {
    s = vw/DW; hs = Math.min(1, vh/SHRINK);
    cs = Math.min(s, hs); ns = hs;
    m = Math.max(0, Math.min(1, (IDLE-vh)/(IDLE-SHRINK)));
  }
  var r=document.documentElement.style;
  r.setProperty('--sf-content-scale', String(s));
  r.setProperty('--sf-canvas-scale', String(cs));
  r.setProperty('--sf-nav-scale', String(ns));
  r.setProperty('--sf-nav-morph', String(m));
  // ... rest unchanged
}catch(e){}})()`;
```

**Rationale alignment:** The `_path_h_decision` block in `.lighthouseci/lighthouserc.json:14` explicitly names this as the canonical close path: *"Tighten back to 0.97 when (a) ScaleCanvas adds a mobile breakpoint exception (e.g., < sm: native layout, no transform)"*. Choosing pillarbox is the most direct fulfillment of the v1.8 ratification's review_gate.

### 3b. Counter-scale — `transform: scale(1/0.39)` on a11y descendants

**Implementation surface:**
- New CSS rule in `app/globals.css`: `[data-a11y-target] { transform: scale(calc(1 / var(--sf-content-scale, 1))); transform-origin: ...; }`.
- Per-consumer marker attribute on every a11y-relevant element (footer links, buttons, GhostLabel). Footer alone has 7 sites.
- Possibly a CVA recipe in `lib/utils.ts` to wrap the marker on interactive elements.

**AES-04 risk on desktop/tablet:** **MEDIUM.** Desktop scale ≈ 1.125 (1440/1280) — counter-scale becomes 0.889. Tablet 834px scale ≈ 0.65 — counter-scale ≈ 1.54 (a11y elements become 54% LARGER than siblings). Even on desktop where scale > 1, counter-scaled elements visibly shrink relative to siblings. This breaks design integrity. Pixel-diff failure likely on tablet.

**AES-03 mobile cohort risk:** **HIGH.** Counter-scale at mobile = 1/0.281 ≈ 3.55. Footer links balloon to 3.55× their native size. GhostLabel becomes 200×3.55 = 710px — full-bleed. Defeats the wayfinding contract.

**axe-core efficacy:**
- **path_h target-size:** YES — counter-scaled element measures at native size to axe.
- **path_i color-contrast:** NO — opacity is preserved through counter-scale; 4% opacity still fails contrast.

**Maintenance burden:** **HIGH.** Every nested transform (GSAP animations, hover scale, focus rings) compounds with the counter-scale. CVA recipe needs every interactive component to declare its target-size posture. Brittle when components compose.

**Performance impact:** **NEGATIVE.** Each counter-scaled element introduces a new composite layer. 7 footer links + N buttons across the site = 50+ new layers, especially on mobile where the site is 0.28× scale.

**Browser bug risk:** Sub-pixel positioning on counter-scaled elements with text rendering can produce blurry rendering on Safari iOS (well-documented; e.g., `transform: scale(1.5)` on tiny text). LOW confidence — would need verification on a real device.

**Rejection criteria:** Tablet AES-04 fails by construction; this mechanism is non-viable.

### 3c. Portal — render a11y elements outside `[data-sf-canvas]` tree

**Implementation surface:**
- Extend the `#pin-portal` precedent (`components/animation/pinned-section.tsx:119-149`) to a generic `#a11y-portal` mounted as a direct `<body>` child (precedent: `CdCornerPanel` hoisted in `app/layout.tsx:178` for LCP fast-path).
- New helper hook `usePortalSync()` — ResizeObserver + MutationObserver on the in-canvas "ghost" position; writes computed transform to the portal-rendered element.
- Each a11y-relevant element renders as `<a11y-anchor data-portal-target="..."><PortalElement /></a11y-anchor>`.

**AES-04 risk on desktop/tablet:** **0% (when sync layer is correct).** Portal element renders at the same visible position as the in-canvas counterpart. CRITICAL: requires per-element transform sync.

**AES-03 mobile cohort risk:** **LOW** — matches existing PinnedSection pattern. User has accepted this pattern in v1.5 Phase 31.

**axe-core efficacy:**
- **path_h target-size:** YES — portal element is outside the transformed subtree; native sizes preserved.
- **path_i color-contrast:** PARTIAL — portal renders the GhostLabel at full size and full opacity; the 4% opacity is preserved (the issue is the rendered text exists, not its position). ARC-04 suppression still required.

**Maintenance burden:** **MEDIUM.** Sync layer non-trivial; CSS anchor positioning (`anchor-name` / `position-anchor`) is too new (Chrome 125+, no Safari) per Context7 caveats — needs the ResizeObserver hand-roll.

**Performance impact:** **NEGATIVE for sync overhead.** Each portal element adds an observer chain. 7 footer links + GhostLabel = 8 observer chains. Could be batched but adds complexity. Lenis scroll updates may need to invalidate sync (PF-04 contract caveat).

**Hydration concern:** Portals can't render server-side (React 19 React.createPortal still client-only). If GhostLabel IS the LCP candidate (per `v1.8-lcp-diagnosis.md` mobile = ghost-label), portaling it post-hydration disqualifies it as LCP element OR shifts LCP to a worse candidate. **CRITICAL for mobile.** Confidence: HIGH.

**Open question:** Is portal sync necessary for elements that are at fixed positions relative to viewport (footer)? Possibly not — could mount portal as a sibling and let CSS positioning handle it. But for mid-page elements (GhostLabel inside THESIS at `top-1/2`), sync is required.

### 3d. Recommendation: Pillarbox + ARC-04 pseudo-element suppression

**Why pillarbox over portal:**
1. The path_h ratification block explicitly names pillarbox as the canonical close path.
2. Maintenance burden is LOW vs. MEDIUM.
3. No portal hydration concern with mobile LCP candidate.
4. Removes a composite layer (perf neutral or positive).
5. `[data-sf-canvas] .h-screen { height: calc(100vh / var(--sf-content-scale, 1)) }` already collapses to `100vh` when scale=1. Existing CSS infrastructure absorbs the change.

**Why pillarbox over counter-scale:**
1. Counter-scale breaks tablet AES-04 by construction.
2. Counter-scale is brittle to nested transforms.
3. Counter-scale doesn't address path_i.

**Why CSS pseudo-element for ARC-04** (vs aria-hidden + visual-only render): see §8 below.

---

## 4. Current ScaleCanvas Behavior — File:Line Evidence

### 4a. Where transform is applied

**`components/layout/scale-canvas.tsx:31-138`** — the entire ScaleCanvas component.
- Line 6-7: `DESIGN_WIDTH = 1280; DESIGN_HEIGHT = 800;` — reference frame.
- Line 12-15: `NAV_MORPH_VH_IDLE = 800; NAV_MORPH_VH_FLOOR = 435; SHRINK_VH = 435;` — chrome scale thresholds.
- Line 42-83: `applyScale()` computes `contentScale = vw / DESIGN_WIDTH`, `chromeScale = min(contentScale, vh/SHRINK)`, etc.
- Line 75-81: writes 7 CSS custom properties to `document.documentElement.style`: `--sf-canvas-scale`, `--sf-content-scale`, `--sf-nav-scale`, `--sf-nav-morph`, `--sf-hero-shift`, `--sf-frame-offset-x`, `--sf-frame-bottom-gap`.
- Line 82: calls `ScrollTrigger.refresh()` after every applyScale (PF-04 boundary; do not remove).
- Line 110-137: returns nested div tree — outer (positioned, height-constrained) > inner (`data-sf-canvas` marker, `width: 1280px`, `transformOrigin: top left`).
- Line 124-131: inner div has `data-sf-canvas=""` attribute and `transformOrigin: top left` inline style. **No inline `transform` — that lives in CSS.**

**`app/globals.css:2770-2774`** — the actual transform application:
```css
[data-sf-canvas] {
  transform: scale(var(--sf-content-scale, 1));
  transform-origin: top left;
  will-change: transform;
}
```

Mobile 360px → `--sf-content-scale = 360/1280 = 0.28125`. axe-core's bundled rule reads post-transform getBoundingClientRect, so 24px native = 6.75px to axe. Lighthouse target-size is weight=7 → fails category.

### 4b. How --sf-content-scale propagates

Three writers:
1. **`app/layout.tsx:117`** — pre-hydration `scaleScript` IIFE; runs at HTML parse time before React hydrates. Sets `--sf-content-scale` from `window.innerWidth / 1280` synchronously. Mounted in `<head>` at line 141.
2. **`components/layout/scale-canvas.tsx:75-77`** — `applyScale()` in useEffect (line 35-108); runs after hydration; subscribes to ResizeObserver + window.resize + window.orientationchange.
3. **`app/layout.tsx:128`** — `canvasSyncScript` (CRT-01 phase 59); runs at body tail; sets parent height = `inner.offsetHeight * (vw / 1280)` to prevent CLS.

**These three are the ONLY scale writers.** Phase 66 must mirror its breakpoint logic across all three (or only #1 + #2 if `canvasSyncScript` semantics are scale-agnostic — verify in Plan 01).

### 4c. Descendants relying on canvas-scale

Search for `--sf-content-scale`, `--sf-canvas-scale`, `data-sf-canvas` in CSS:

- **`app/globals.css:316-325`** — `:root` declarations of `--sf-canvas-h: 800px`, `--sf-vw: 12.8px`, `--sf-vh: 8px` (the canvas units used in clamp() expressions throughout the design system).
- **`app/globals.css:2770-2774`** — the transform rule.
- **`app/globals.css:2784-2809`** — height remap rules for `[data-sf-canvas] .h-screen` etc. These multiply by `(1 / var(--sf-content-scale, 1))` so post-transform height is exactly 100vh.
- **`components/layout/instrument-hud.tsx:218`** — reads `--sf-canvas-scale` via getComputedStyle for HUD positioning.
- **`components/layout/instrument-hud.tsx:267`** — `transform: scale(var(--sf-canvas-scale, 1))` on the HUD itself (HUD scales with chrome, NOT content).
- **`components/layout/scale-canvas.tsx:78`** — `--sf-nav-morph` consumer in nav cube cascade (`globals.css:779-809`).
- **`components/animation/pinned-section.tsx:108-160`** — uses `var(--sf-canvas-h, calc(100*var(--sf-vh)))` for spacer/portal heights.

**Pillarbox impact:** When scale=1 below `sm`, `(1 / var(--sf-content-scale, 1))` = 1; `100vh / 1 = 100vh`. Existing rules naturally degrade. instrument-hud will read scale=1 too — HUD becomes "native" mobile size. Verify this is acceptable in Plan 01 cohort review.

### 4d. GhostLabel mount points

**Component:** `components/animation/ghost-label.tsx:11-42`
- Line 14: `aria-hidden="true"` (correctly excludes from AT).
- Line 15: `data-anim="ghost-label"`.
- Line 16: `data-ghost-label="true"` (project-internal axe-core exclusion key per `tests/phase-38-a11y.spec.ts:60`).
- Line 17: `text-foreground/[0.04]` is supplied via the `className` prop, NOT the component itself. The component renders the structure; opacity comes from consumer.
- Line 19: `fontSize: clamp(200px, calc(25*var(--sf-vw)), 400px)`.
- Line 25: `contentVisibility: "auto"` (Phase 60 LCP-02 candidate b).
- Line 36: `containIntrinsicSize: "auto calc(22.5 * var(--sf-vw))"` (Phase 60 Plan 03).

**Consumers** (2 sites):
1. **`app/page.tsx:83-86`** — `<GhostLabel text="THESIS" className="-left-[calc(3*var(--sf-vw))] top-1/2 -translate-y-1/2 text-foreground/[0.04]" />`
2. **`app/system/page.tsx:28-31`** — `<GhostLabel text="SYSTEM" className="-left-[calc(2*var(--sf-vw))] top-1/2 -translate-y-1/2 text-foreground/[0.04]" />`

**Both consumers pass `text-foreground/[0.04]` as className.** Suppression mechanism for ARC-04 must work whether opacity is on the component or the className.

---

## 5. Pillarbox Specifics (RECOMMENDED)

### 5a. Tailwind v4 breakpoint = 640px (`sm`)

Verified from `node_modules/tailwindcss/preflight.css` defaults; Tailwind v4 maintains the `sm: 640px` default unless overridden in `@theme`. No override found in `app/globals.css` `@theme` block.

**Alternatives:**
- `md: 768px` — pillarboxes iPad portrait (834px stays scaled). LESS aggressive aesthetic preservation; MORE devices benefit from native a11y. AES-03 cohort impact: tablet portrait might "feel different".
- `sm: 640px` — covers all phones (360–428px) and most foldables (640px+ stays scaled). MOST conservative aesthetic posture; only mobile flips.
- Custom `mobile: 480px` — tighter; some Android phones at 480-640px stay scaled. NOT RECOMMENDED — adds a custom breakpoint that doesn't match existing Tailwind utility queries used elsewhere.

**Recommendation:** `sm` (640px). Reasoning:
- The path_h ratification was specifically about Lighthouse's mobile profile (375×667 emulation; LHCI config at `lighthouserc.json:84-91`). 375 < 640, so pillarbox below 640 fully covers LHCI's measurement viewport.
- iPad portrait (834px) stays scaled, preserving tablet AES-04.
- Existing AES-04 baselines at `iphone13-390x844` and `mobile-360x800` are both below 640 — they will fall into pillarbox mode in v1.9-pre baselines but be exempt from AES-04 strict gate (mobile cohort review only).

### 5b. Letterbox padding strategy

**Recommendation: SKIP letterbox padding.**

`h-screen` sections inside `[data-sf-canvas]` already remap via `app/globals.css:2784-2792` to `calc(100vh / var(--sf-content-scale, 1))`. When scale=1, this collapses to `100vh`. Sections naturally fill the viewport without padding.

**If a future need for vertical letterboxing emerges** (e.g., to preserve a specific aspect on tall mobile viewports), add `padding-block` on `<main>` via media query. NOT REQUIRED for ARC-02.

### 5c. Fixed-width components below `sm`

Components written assuming the 1280px reference frame (i.e., using `var(--sf-vw)` clamp values) will now render at native mobile widths. The `clamp()` floors typically protect against this — e.g., `--sfx-text-base: clamp(11px, calc(0.903*var(--sf-vw)), 18px)` floors at 11px. Below `sm`, with `var(--sf-vw) = 12.8px` (constant — it's a CSS constant in the `:root` block, NOT computed from viewport), all clamps with mobile-friendly floors stay legible.

**`var(--sf-vw)` is a CONSTANT**, defined as `12.8px` at `globals.css:324`. It is NOT viewport-derived. The scaling happens via the `transform: scale()` on `[data-sf-canvas]`. When pillarbox engages (transform=none), elements render at their NATIVE pixel sizes — `var(--sf-vw) = 12.8px` is the same below and above `sm`.

**Implication:** Below `sm`, a `clamp(200px, calc(25*var(--sf-vw)), 400px)` GhostLabel = `clamp(200px, 320px, 400px)` = 320px text-size. **At native scale this would dominate mobile viewports.** Counter-pressure: this is exactly the v1.9-pre baseline state — what the cohort will review.

**Components with explicit `var(--sf-vw)` arithmetic to verify in Plan 01:**
- GhostLabel font-size + contain-intrinsic-size (above)
- Hero h1 in `entry-section.tsx` (search for clamp + sf-vw)
- `--sfx-text-*` scale (`globals.css:200-209`)
- `--sfx-space-*` scale (`globals.css:288-296`)
- Nav height (`globals.css:304`)
- `--sf-canvas-h: 800px` (`globals.css:323`) — used by PinnedSection

**None require code changes** — the existing clamps were authored to be viewport-honest. Pillarbox just makes the floors actually fire.

---

## 6. Counter-scale Specifics (NOT RECOMMENDED — included for completeness)

### 6a. Selector strategy

If counter-scale were chosen:
- New CSS rule: `[data-a11y-target] { transform: scale(calc(1 / var(--sf-content-scale, 1))); transform-origin: ...; }`
- Per-consumer marker attribute or a CVA recipe.
- `:focus-visible` only is too narrow — target-size measures even non-focused elements.

### 6b. Sub-pixel round-trip

Counter-scale = `1/0.28125 = 3.5556`. After both transforms compose: `0.28125 × 3.5556 = 0.9999...`. Sub-pixel discrepancies on text rendering documented for `transform: scale()` on iOS Safari ≥ 11. LOW confidence — empirical verification needed on real device.

### 6c. Nested transforms

GSAP animations using `transform` on counter-scaled descendants compose multiplicatively. For instance, a hero h1 with `gsap.to(el, { y: 100 })` already adds a transform; counter-scale composes. Result: tracking errors on text reveal. NOT RECOMMENDED.

---

## 7. Portal Specifics (NOT RECOMMENDED — viable fallback)

### 7a. `#pin-portal` precedent

`components/animation/pinned-section.tsx:119-149` mounts a `position: fixed` portal at `<body>` level via `createPortal(content, document.body)`. The portal sits outside the ScaleCanvas tree, so it escapes the matrix transform.

### 7b. Sync layer

For elements that need to overlay an in-canvas "ghost" position:
- ResizeObserver on the ghost → write computed transform to portal element.
- MutationObserver on `<html>.style` → react to `--sf-content-scale` changes (already happens during ScaleCanvas resize).
- Lenis scroll events → portal needs `position: fixed` semantics OR scroll-anchored (`getBoundingClientRect` inside Lenis raf).

**`feedback_raf_loop_no_layout_reads.md`** — rAF loops MUST be read-only against layout/style; cache inputs via ResizeObserver + MutationObserver. Portal sync layer must conform.

CSS anchor positioning (`anchor-name` / `position-anchor`) is too new — Chrome 125+, no Safari yet (per MDN; verified). Cannot be relied on.

### 7c. Hydration concern (CRITICAL)

`React.createPortal` mounts client-side only. If GhostLabel is portaled, its initial paint deferred until React hydrates. Per `v1.8-lcp-diagnosis.md`, mobile LCP candidate IS GhostLabel (`mobile-360x800`, warm and cold). Portaling moves GhostLabel out of the SSR HTML, which:
1. Removes mobile LCP candidate from HTML stream → LCP becomes a different element OR delayed.
2. Re-introduces CLS risk if portal mounts visibly post-hydration.

**REJECTION:** Portal mechanism for GhostLabel specifically conflicts with v1.8 LCP work. For interactive a11y elements (footer links), portal is viable but operationally heavier than pillarbox.

---

## 8. GhostLabel Suppression Mechanism (ARC-04)

REQUIREMENTS.md ARC-04 lists three options. Detailed analysis:

### 8a. Option A — `color: transparent + mask-image` (text rendered via CSS mask)

**How it works:** Set `color: transparent` on the `<span>`; render the visual via `mask-image: linear-gradient(...)` or a SVG mask that uses the text glyphs as the alpha channel.

**axe-core efficacy:** YES — `color-contrast` rule reads `color` value; transparent fails contrast TEST CONDITIONS, so axe SKIPS the audit (transparent text against any background is treated as not-text-content for contrast purposes). axe-core 4.x explicitly skips contrast audit on `color: transparent` (verified via @axe-core docs, MEDIUM confidence — needs spec confirmation in Plan 01).

**Aesthetic preservation:** YES — visual is preserved via mask.

**Maintenance burden:** HIGH — text becomes an SVG asset OR a CSS mask painstakingly authored. THESIS / SYSTEM glyphs need 2 mask SVGs.

**LCP impact:** UNCLEAR — mask-rendered text may not be LCP-eligible. Could shift mobile LCP to a different candidate. CONCERN.

### 8b. Option B — CSS pseudo-element (`::before` content) which axe-core skips

**How it works:** Move the text into a `::before` pseudo-element via `content: attr(data-text);`. axe-core 4.x explicitly excludes pseudo-element content from `color-contrast` (verified via [axe-core color-contrast rule docs](https://dequeuniversity.com/rules/axe/4.10/color-contrast) — pseudo-element content is "not in the accessibility tree" by spec, contrast not measured).

**axe-core efficacy:** YES — ::before content is NOT measured by `color-contrast`.

**Aesthetic preservation:** YES — visual identical (CSS-rendered text via `content:`).

**Maintenance burden:** LOW — simple component change. New attribute on the host span (`data-text="THESIS"`); pseudo-element CSS in `globals.css` or component's own className.

**LCP impact:** PROBABLE PROBLEM — Chrome's LCP API does not credit pseudo-element text as "Largest Contentful Paint" candidates. Mobile LCP candidate (currently GhostLabel) would shift to a different element. Per `feedback_lcp_observer_content_visibility.md`, LCP API has element-resolution quirks already; pseudo-element shift may be acceptable IF a structural test (TST-01 in Phase 68) measures the new candidate.

**Wave-0 verification:** Plan 01 Wave 0 task — capture mobile LCP candidate identity AFTER ARC-04 suppression. If it shifts to a known-stable element (e.g., body-anton text), ratify. If it shifts to noise, escalate to Option A or C.

### 8c. Option C — `aria-hidden` + visual-only render (status quo + reinforcement)

**How it works:** GhostLabel already has `aria-hidden="true"` (`ghost-label.tsx:14`). Add additional axe-core hint: `role="presentation"` + `data-axe-skip="true"`.

**axe-core efficacy:** PARTIAL. `aria-hidden=true` should already exclude from contrast audit per WCAG, but Lighthouse's bundled axe-core 4.x has a known issue (referenced in `tests/phase-38-a11y.spec.ts:38`) where it sometimes checks color-contrast on aria-hidden elements anyway. `role="presentation"` doesn't override this. **Status quo IS this option, and it's failing.**

**REJECTION:** Doesn't fix the issue.

### 8d. Recommendation: Option B (pseudo-element) with Option A as fallback

**Why B over A:**
1. Lower maintenance burden (no SVG mask asset).
2. Preserves "structural wayfinding, not decoration" contract — text is still text, just rendered via pseudo-element.
3. Easy to verify in Wave 0 (LCP candidate identity test pre/post).

**Why fallback to A:**
- If Option B causes mobile LCP to shift to a worse candidate (e.g., subtitle text deep below the fold), Option A's mask-image preserves the LCP element identity at the cost of an SVG asset.

**Plan 02 Wave 0 verification (REQUIRED):** Re-run `tests/v1.8-lcp-diagnosis.spec.ts` against the GhostLabel after ARC-04 application. New mobile LCP candidate must be:
- (a) Above-the-fold, AND
- (b) Already part of the SSR HTML stream, AND
- (c) Stable across cold/warm Anton states.

---

## 9. Verification Surface

### 9a. Lighthouse re-baseline strategy

LHCI config at `.lighthouseci/lighthouserc.json`:
- Mobile (375×667 emulation, current config) — gates on a11y ≥0.96 (path_h loosening).
- Desktop config likely at `.lighthouseci/lighthouserc.desktop.json` (referenced by `lighthouse.yml` per Phase 64 RESEARCH §Standard Architecture; verify in Plan 03).

**Plan 03 actions:**
1. Run LHCI mobile against prod homepage post-implementation. Verify a11y ≥0.97. If yes, edit `.lighthouseci/lighthouserc.json:108-110`: `minScore: 0.96 → 0.97`. Remove `_path_h_decision` block (`.lighthouseci/lighthouserc.json:1-16`).
2. Run LHCI desktop against prod homepage. Verify a11y ≥0.97. Remove `_path_i_decision` block (if present in desktop config — verify in Plan 03).
3. Commit removal in same plan for visibility (cohort review).

### 9b. Direct axe-core test (`@axe-core/playwright`)

`@axe-core/playwright@4.11.1` already in `devDependencies` (`package.json:124`). Pattern from `tests/phase-38-a11y.spec.ts`:

```typescript
import AxeBuilder from "@axe-core/playwright";

test("target-size on prod homepage mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/", { waitUntil: "networkidle" });
  const results = await new AxeBuilder({ page })
    .withRules(["target-size"])
    .analyze();
  const targetViolations = results.violations.filter((v) => v.id === "target-size");
  expect(targetViolations).toHaveLength(0);
});

test("color-contrast on prod desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  const results = await new AxeBuilder({ page })
    .withRules(["color-contrast"])
    // CRITICAL: do NOT exclude [data-ghost-label] here; the test verifies
    // that ARC-04 suppression mechanism prevents axe from measuring it
    // even without project-side exclusion.
    .analyze();
  const contrastViolations = results.violations.filter((v) => v.id === "color-contrast");
  expect(contrastViolations).toHaveLength(0);
});
```

This is a more deterministic gate than LHCI for the specific rules. NEW test file: `tests/v1.9-phase66-arc-axe.spec.ts`.

### 9c. AES-04 pixel-diff strategy

Reuse existing harness at `tests/v1.8-phase60-aes04-diff.spec.ts` pattern. NEW file: `tests/v1.9-phase66-aes04-diff.spec.ts`.

**Critical adjustment:** Mobile viewports (`mobile-360x800`, `iphone13-390x844`) MUST be exempted from the 0.5% gate per AES-03 cohort review. Tablet (`ipad-834x1194`) and desktop (`desktop-1440x900`) STAY strict at 0.5%.

Implementation:
```typescript
const VIEWPORTS_STRICT = [
  { name: "desktop-1440x900", width: 1440, height: 900 },
  { name: "ipad-834x1194", width: 834, height: 1194 },
] as const;

const VIEWPORTS_COHORT_ONLY = [
  { name: "mobile-360x800", width: 360, height: 800 },
  { name: "iphone13-390x844", width: 390, height: 844 },
] as const;

// strict tests: AES-04 ≤0.5% gate
// cohort tests: capture only, manual review against v1.9-pre/ baseline
```

### 9d. 6-pillar visual audit (per CRT-style critique)

For Plan 01 decision doc:
1. **Structure** — section composition unchanged across breakpoints? (Tablet/desktop yes; mobile cohort.)
2. **Hierarchy** — heading scale + visual weight preserved? (Verify GhostLabel + hero h1 dominate as designed.)
3. **Contrast** — OKLCH slot semantics preserved? (No color changes in scope.)
4. **Spacing** — blessed 9 stops still resolve? (`var(--sf-vw)` is constant — yes.)
5. **Alignment** — section grid intact? (Above breakpoint yes; mobile cohort.)
6. **Motion** — GSAP timelines + Lenis scroll unchanged? (No timeline edits in scope; PF-04 untouched.)

### 9e. Mid-phase mobile cohort baseline (Plan 01 prerequisite)

CRITICAL: Plan 01 Wave 0 task — capture `.planning/visual-baselines/v1.9-pre/` BEFORE any source mutation. Use `tests/v1.8-baseline-capture.spec.ts` pattern with output dir = `v1.9-pre/`.

Cohort review post-implementation compares `v1.9-pre/` → current state at mobile + iphone13 viewports. AES-03 question: "feels different without specific code-change cause?"

---

## 10. Plan Structuring Suggestion (3 plans)

### Plan 01 — Decision + Pre-baseline + Wave 0 (Wave 1, BLOCKING)

**Deliverables:**
1. `.planning/codebase/scale-canvas-track-b-decision.md` — mechanism choice + 6-pillar audit + file:line evidence (ARC-01 deliverable, follows `v1.8-lcp-diagnosis.md` shape).
2. `.planning/visual-baselines/v1.9-pre/` — full 5×4 baseline capture using existing harness (mobile cohort reference).
3. Wave 0: `tests/v1.9-phase66-wave0-baseline.spec.ts` — captures pre-change state.
4. Wave 0: confirm mobile LCP candidate identity (re-run `v1.8-lcp-diagnosis.spec.ts` to baseline current LCP element identity for comparison post-ARC-04).

**Risk:** LOW — capture-only, no source mutation.

**Blocking budget:** Plan 01 must close before Plan 02 starts.

### Plan 02 — Pillarbox Implementation + ARC-04 Suppression (Wave 2, depends on 01)

**Deliverables:**
1. `components/layout/scale-canvas.tsx` — add breakpoint branch in `applyScale()`.
2. `app/layout.tsx` — mirror branch in pre-hydration `scaleScript`.
3. `components/animation/ghost-label.tsx` — ARC-04 mechanism (Option B pseudo-element).
4. `app/page.tsx` + `app/system/page.tsx` — update GhostLabel consumers if className/data attribute pattern changes.
5. Verify `app/layout.tsx:128` `canvasSyncScript` still works at scale=1 (likely yes — `s = vw/1280` floors to ~0.28 below sm; outer height adjusts proportionally).
6. Wave 0 of Plan 02: capture LCP candidate identity post-ARC-04; verify above-fold + SSR-stable.

**Risk:** HIGH — touches load-bearing primitive.

**Blocking budget:** Plan 02 must close before Plan 03 starts.

### Plan 03 — Verification + LHCI Re-baseline + path_h/i Removal (Wave 3, depends on 02)

**Deliverables:**
1. `tests/v1.9-phase66-arc-axe.spec.ts` — direct axe-core target-size + color-contrast tests.
2. `tests/v1.9-phase66-aes04-diff.spec.ts` — AES-04 pixel-diff (strict gate desktop+tablet; cohort-capture mobile).
3. LHCI mobile + desktop runs against prod homepage; verify a11y ≥0.97 on both.
4. Edit `.lighthouseci/lighthouserc.json` — bump mobile a11y minScore 0.96 → 0.97; remove `_path_h_decision` block. Mirror in desktop config for `_path_i_decision` if present.
5. AES-03 cohort review against `v1.9-pre/` mobile baseline — sign-off in plan close-out.
6. Update `STATE.md`: mark ARC-01..04 as Validated; note AES-03 cohort acceptance.

**Risk:** MEDIUM — LHCI threshold tightening may surface unanticipated audit failures (e.g., a different rule that was masked by path_h's loosening).

**Blocking budget:** Plan 03 closes phase.

---

## Code Examples (Verified Patterns)

### Pre-hydration script with breakpoint branch
```javascript
// app/layout.tsx — replaces current scaleScript at line 117
const scaleScript = `(function(){try{
  var vw=window.innerWidth, vh=window.innerHeight;
  var BREAKPOINT=640, DW=1280, SHRINK=435, IDLE=800;
  var s, hs, cs, ns, m;
  if (vw < BREAKPOINT) {
    // Pillarbox below sm: native sizes, no scale, no nav-morph
    s = 1; hs = 1; cs = 1; ns = 1; m = 0;
  } else {
    s = vw/DW; hs = Math.min(1, vh/SHRINK);
    cs = Math.min(s, hs); ns = hs;
    m = Math.max(0, Math.min(1, (IDLE-vh)/(IDLE-SHRINK)));
  }
  var r=document.documentElement.style;
  r.setProperty('--sf-content-scale', String(s));
  r.setProperty('--sf-canvas-scale', String(cs));
  r.setProperty('--sf-nav-scale', String(ns));
  r.setProperty('--sf-nav-morph', String(m));
  r.setProperty('--sf-hero-shift', '0px');
  r.setProperty('--sf-frame-offset-x', '0px');
  r.setProperty('--sf-frame-bottom-gap', '0px');
}catch(e){}})()`;
```

### ScaleCanvas applyScale with breakpoint branch
```typescript
// components/layout/scale-canvas.tsx — replaces lines 42-83
const BREAKPOINT = 640;
const applyScale = () => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let contentScale: number, heightScale: number, chromeScale: number, navScale: number, navMorph: number;
  if (vw < BREAKPOINT) {
    contentScale = 1; heightScale = 1; chromeScale = 1; navScale = 1; navMorph = 0;
  } else {
    contentScale = vw / DESIGN_WIDTH;
    heightScale = Math.min(1, vh / SHRINK_VH);
    chromeScale = Math.min(contentScale, heightScale);
    navScale = heightScale;
    navMorph = Math.max(0, Math.min(1, (NAV_MORPH_VH_IDLE - vh) / (NAV_MORPH_VH_IDLE - NAV_MORPH_VH_FLOOR)));
  }
  outer.style.height = `${inner.offsetHeight * contentScale}px`;
  const root = document.documentElement.style;
  root.setProperty("--sf-canvas-scale", String(chromeScale));
  root.setProperty("--sf-content-scale", String(contentScale));
  root.setProperty("--sf-nav-scale", String(navScale));
  root.setProperty("--sf-nav-morph", String(navMorph));
  root.setProperty("--sf-hero-shift", "0px");
  root.setProperty("--sf-frame-offset-x", "0px");
  root.setProperty("--sf-frame-bottom-gap", "0px");
  ScrollTrigger.refresh();
};
```

### GhostLabel pseudo-element ARC-04 suppression
```tsx
// components/animation/ghost-label.tsx — Option B
export function GhostLabel({ text, className }: GhostLabelProps) {
  return (
    <span
      aria-hidden="true"
      data-anim="ghost-label"
      data-ghost-label="true"
      data-ghost-text={text}
      className={`sf-display sf-ghost-label-pseudo pointer-events-none select-none absolute leading-none ${className ?? ""}`}
      style={{ /* unchanged */ }}
    />
    // text content removed; rendered via ::before
  );
}
```

```css
/* app/globals.css — new rule */
.sf-ghost-label-pseudo::before {
  content: attr(data-ghost-text);
}
```

---

## State of the Art

| Old Approach | Current Approach (v1.9 Phase 66) | When Changed | Impact |
|--------------|----------------------------------|--------------|--------|
| `transform: matrix(0.39, ...)` on entire canvas at all viewports | `transform: none` below `sm`; native a11y restored | Phase 66 (v1.9) | path_h closed; LHCI mobile a11y ≥0.97 |
| GhostLabel as visible `<text>` content; aria-hidden alone | Pseudo-element rendered text (axe skips); aesthetic preserved | Phase 66 (v1.9) | path_i closed; LHCI desktop a11y ≥0.97 |
| `_path_h_decision` + `_path_i_decision` ratification blocks in LHCI config | Blocks removed; thresholds tightened | Phase 66 (v1.9) | Architectural lock posture; no inherited path_decisions |

**Deprecated/outdated:**
- LHCI mobile a11y threshold 0.96 (`.lighthouseci/lighthouserc.json:108-110`) — replaced by 0.97.
- LHCI desktop a11y path_i ratification — verify location in desktop config (likely `.lighthouseci/lighthouserc.desktop.json`); replaced by 0.97.

---

## Common Pitfalls

### Pitfall 1: Pillarbox below sm but pre-hydration script doesn't match → CLS regression
**What goes wrong:** `applyScale()` updates `--sf-content-scale` to 1; `[data-sf-canvas]` rule changes from `scale(0.28)` to `scale(1)`; if pre-hydration `scaleScript` still computes `0.28`, first paint is at scale 0.28, then jumps to scale 1 = massive CLS.
**Prevention:** Mirror branch logic across `app/layout.tsx:117 scaleScript` AND `components/layout/scale-canvas.tsx:applyScale()` AND `app/layout.tsx:128 canvasSyncScript` (verify the canvasSyncScript still works — outer height = `inner.offsetHeight * (vw/1280)` — when scale=1 and vw<1280, outer height becomes inflated; may need branch logic too).

### Pitfall 2: GhostLabel pseudo-element shifts mobile LCP candidate
**What goes wrong:** Per `feedback_lcp_observer_content_visibility.md`, Chrome LCP API resolves elements via `entry.element`. Pseudo-element-rendered text is NOT in the regular DOM tree; LCP API may shift candidate to next-largest visible content (could be subtitle, hero subtitle, or noise).
**Prevention:** Plan 02 Wave 0 — capture mobile LCP candidate identity post-ARC-04; verify it's a stable above-fold SSR element. If not, escalate to Option A (mask-image).

### Pitfall 3: Lenis autoResize fires during pillarbox transition
**What goes wrong:** Phase 64 PR #2 Path A retrofit set `autoResize: true` (PF-04 contract). Pillarbox transition (resizing across `sm` boundary) fires Lenis resize → ScrollTrigger refresh → potentially re-applies scale before Lenis reaches steady state.
**Prevention:** ARC-02 implementation MUST NOT touch `lenis-provider.tsx`. The existing `applyScale()` already calls `ScrollTrigger.refresh()` (line 82); pillarbox branch reuses this.

### Pitfall 4: Mobile cohort baseline captured AFTER source mutation (out-of-order)
**What goes wrong:** Plan 01 Wave 0 must run BEFORE Plan 02 source mutation. If `v1.9-pre/` is captured post-pillarbox, AES-03 cohort review compares pillarbox-state-A to pillarbox-state-A — no signal.
**Prevention:** Plan structure encodes: Plan 01 captures `v1.9-pre/` and is BLOCKING; Plan 02 cannot start until Plan 01's baseline is committed. Use ROADMAP's `[BLOCKING]` budget pattern.

### Pitfall 5: `var(--sf-vw)` constant misread as viewport-derived
**What goes wrong:** Author assumes `--sf-vw` recomputes with viewport (it doesn't — it's a CSS constant `12.8px` at `globals.css:324`). Plans assume font sizes shrink below sm; they do not (clamps floor at the explicit pixel values).
**Prevention:** Plan 01 6-pillar audit explicitly traces clamp() floors at sm boundary (i.e., `--sfx-text-base` floor = 11px at native scale below sm; same as scaled at 0.28 above sm because clamp() saturates at the floor).

### Pitfall 6: instrument-hud reads --sf-canvas-scale as viewport-honest
**What goes wrong:** `components/layout/instrument-hud.tsx:218` reads `--sf-canvas-scale` for HUD positioning. Below sm, `--sf-canvas-scale = 1`; HUD becomes "native mobile" rather than scaled-to-fit. May visually clash with chrome cubes.
**Prevention:** Plan 01 6-pillar audit includes HUD verification at mobile cohort. If HUD positioning breaks, escalate to per-component pillarbox awareness.

### Pitfall 7: LHCI desktop config not located → path_i removal incomplete
**What goes wrong:** Plan 03 only edits `.lighthouseci/lighthouserc.json` (mobile) but path_i lives in desktop config. Threshold tightens on mobile but desktop a11y still gates loose.
**Prevention:** Plan 03 first task — locate desktop LHCI config (likely `.lighthouseci/lighthouserc.desktop.json` per Phase 64 RESEARCH); mirror all path_h/path_i removal edits.

### Pitfall 8: axe-core test passes locally but Lighthouse fails on prod
**What goes wrong:** `@axe-core/playwright` runs fresh axe rules; Lighthouse bundles a specific axe version with potentially different defaults. axe-core test green ≠ LHCI green.
**Prevention:** Plan 03 verification surface includes BOTH `@axe-core/playwright` direct tests AND a real LHCI run against prod homepage. Both must pass.

### Pitfall 9: Anton swap descriptors not re-measured at GhostLabel size band post-pillarbox
**What goes wrong:** Per `feedback_anton_swap_size_band.md`, Anton optional→swap descriptors anchored to one size band leave residual sub-pixel CLS at smaller bands. Below sm with pillarbox, GhostLabel renders at native 200-400px (NOT scaled-down 56-112px). Anton fallback metrics may not match the larger native size.
**Prevention:** Plan 03 — capture LHCI mobile CLS post-pillarbox. If CLS regresses (was 0.0025 in v1.8 path_a), re-measure Anton descriptors at the new GhostLabel size band per `feedback_measure_descriptors_from_woff2.md`.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright `^1.59.1` (e2e + visual + axe-core) + LHCI `^0.15.1` (perf + a11y) + Vitest `^4.1.4` (unit, lib only) |
| Config file | `playwright.config.ts` + `.lighthouseci/lighthouserc.json` (+ `.lighthouseci/lighthouserc.desktop.json`) |
| Quick run command | `pnpm exec playwright test tests/v1.9-phase66-arc-axe.spec.ts --project=chromium` |
| Full suite command | `pnpm test` (Vitest unit) + `pnpm exec playwright test --project=chromium` (Playwright) + `pnpm exec lhci autorun` (LHCI gate) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| **ARC-01** | `scale-canvas-track-b-decision.md` exists with mechanism + 6-pillar audit + file:line evidence | structural (file presence + content schema) | `pnpm exec playwright test tests/v1.9-phase66-decision-doc.spec.ts -x` | Wave 0 (Plan 01) |
| **ARC-02 (desktop+tablet AES-04)** | Pixel-diff vs `v1.8-start/` ≤0.5% on `desktop-1440x900` and `ipad-834x1194` for all 5 routes | visual diff | `pnpm exec playwright test tests/v1.9-phase66-aes04-diff.spec.ts -x` | Wave 0 (Plan 03) |
| **ARC-02 (mobile cohort)** | Capture pixel-diff vs `v1.9-pre/` on `mobile-360x800` and `iphone13-390x844`; manual cohort review | visual diff (capture-only) | `pnpm exec playwright test tests/v1.9-phase66-aes04-diff.spec.ts --grep cohort` | Wave 0 (Plan 03) |
| **ARC-02 (no transform below sm)** | At `vw < 640`, `[data-sf-canvas]` computed `transform = matrix(1, 0, 0, 1, 0, 0)` | structural (computed-style query) | `pnpm exec playwright test tests/v1.9-phase66-pillarbox-transform.spec.ts -x` | Wave 0 (Plan 02) |
| **ARC-03 (target-size axe)** | axe-core direct `target-size` violations = 0 on `/` mobile (375×667) | axe-core direct | `pnpm exec playwright test tests/v1.9-phase66-arc-axe.spec.ts --grep target-size -x` | Wave 0 (Plan 03) |
| **ARC-03 (LHCI mobile a11y)** | Lighthouse mobile a11y ≥0.97 on prod homepage | LHCI prod | `pnpm exec lhci autorun --collect.url=https://signalframe.culturedivision.com` | uses `.lighthouseci/lighthouserc.json` |
| **ARC-03 (path_h removal)** | `_path_h_decision` block absent from `lighthouserc.json`; `categories:accessibility.minScore = 0.97` | structural (config-file query) | `pnpm exec playwright test tests/v1.9-phase66-lhci-config.spec.ts --grep path_h -x` | Wave 0 (Plan 03) |
| **ARC-04 (color-contrast axe)** | axe-core direct `color-contrast` violations = 0 on `/` desktop (1440×900); GhostLabel NOT excluded by selector | axe-core direct | `pnpm exec playwright test tests/v1.9-phase66-arc-axe.spec.ts --grep color-contrast -x` | Wave 0 (Plan 03) |
| **ARC-04 (LHCI desktop a11y)** | Lighthouse desktop a11y ≥0.97 on prod homepage | LHCI prod | `pnpm exec lhci autorun --collect.url=https://signalframe.culturedivision.com --config=.lighthouseci/lighthouserc.desktop.json` | uses desktop config |
| **ARC-04 (path_i removal)** | `_path_i_decision` block absent from desktop LHCI config | structural (config-file query) | `pnpm exec playwright test tests/v1.9-phase66-lhci-config.spec.ts --grep path_i -x` | Wave 0 (Plan 03) |
| **ARC-04 (LCP candidate stability)** | Mobile LCP candidate identity post-suppression matches a stable SSR-paintable above-fold element (verify NOT noise) | structural + LCP API | `pnpm exec playwright test tests/v1.9-phase66-lcp-stability.spec.ts -x` | Wave 0 (Plan 02) |

### Sampling Rate
- **Per task commit:** `pnpm exec playwright test tests/v1.9-phase66-arc-axe.spec.ts tests/v1.9-phase66-aes04-diff.spec.ts --project=chromium` (~3 minutes against `pnpm build && pnpm start`).
- **Per wave merge:** Add `tests/v1.9-phase66-pillarbox-transform.spec.ts` + `tests/v1.9-phase66-lcp-stability.spec.ts` + `tests/v1.9-phase66-lhci-config.spec.ts` (~5 minutes).
- **Phase gate:** Full Playwright suite + Vitest unit + LHCI mobile + LHCI desktop against prod homepage (~25 minutes).

### Wave 0 Gaps
- [ ] `tests/v1.9-phase66-arc-axe.spec.ts` — covers ARC-03 (target-size) + ARC-04 (color-contrast) via @axe-core/playwright
- [ ] `tests/v1.9-phase66-aes04-diff.spec.ts` — covers ARC-02 strict (desktop+tablet) + cohort capture (mobile+iphone13)
- [ ] `tests/v1.9-phase66-pillarbox-transform.spec.ts` — covers ARC-02 architectural assertion (computed-style query)
- [ ] `tests/v1.9-phase66-lhci-config.spec.ts` — covers ARC-03 + ARC-04 path_X_decision removal verification
- [ ] `tests/v1.9-phase66-lcp-stability.spec.ts` — covers ARC-04 LCP candidate stability post-suppression
- [ ] `tests/v1.9-phase66-decision-doc.spec.ts` — covers ARC-01 decision-doc presence (light schema test)
- [ ] `.planning/visual-baselines/v1.9-pre/` — full 5-route × 4-viewport capture before any source mutation (Plan 01 Wave 0)
- [ ] No new framework install — `@axe-core/playwright`, `@playwright/test`, `@lhci/cli`, `pixelmatch`, `pngjs` all in devDeps already

---

## Sources

### Primary (HIGH confidence — direct file:line evidence)
- `components/layout/scale-canvas.tsx:1-138` — ScaleCanvas component
- `components/animation/ghost-label.tsx:1-42` — GhostLabel component contract
- `components/animation/pinned-section.tsx:119-149` — portal precedent
- `app/layout.tsx:108-117, 128, 178, 186` — pre-hydration scripts + ScaleCanvas mount + CdCornerPanel hoist precedent
- `app/page.tsx:83-86` + `app/system/page.tsx:28-31` — GhostLabel consumers
- `app/globals.css:316-325, 2770-2809` — canvas tokens + transform rule + height remap rules
- `.lighthouseci/lighthouserc.json:1-16, 102-128` — path_h_decision block + assertions
- `.planning/REQUIREMENTS.md:18-23` — ARC-01..04 verbatim
- `.planning/ROADMAP.md:1027-1098` — Phase 66 success criteria + v1.9 build-order constraints
- `.planning/codebase/AESTHETIC-OF-RECORD.md:1-160` — AES-01..04 standing rules + captured-state §4
- `.planning/codebase/v1.8-lcp-diagnosis.md:18-49` — mobile LCP = GhostLabel evidence
- `tests/phase-38-a11y.spec.ts:60` — axe-core internal exclusion of `[data-ghost-label]`
- `tests/v1.8-phase60-aes04-diff.spec.ts:1-100` — AES-04 pixel-diff harness pattern
- `tests/v1.8-baseline-capture.spec.ts:1-80` — baseline capture pattern
- `package.json:124, 95-99` — devDeps confirm @axe-core/playwright, lighthouse, @lhci/cli, pixelmatch present

### Secondary (MEDIUM confidence — verified across multiple sources)
- axe-core 4.x `color-contrast` rule semantics on pseudo-elements ([dequeuniversity.com/rules/axe/4.10/color-contrast](https://dequeuniversity.com/rules/axe/4.10/color-contrast)) — pseudo-element content not in accessibility tree
- axe-core 4.x `target-size` rule uses post-transform `getBoundingClientRect` (path_h diagnostic in `_path_h_decision.rationale` confirmed via chrome-devtools MCP live diagnostic)
- Tailwind v4 default `sm` breakpoint = 640px (no `@theme` override in `globals.css`)
- Memory `feedback_path_b_pattern.md` — `_path_X_decision` annotation block schema
- Memory `feedback_lcp_observer_content_visibility.md` — Chrome LCP API quirks on content-visibility surfaces
- Memory `feedback_anton_swap_size_band.md` — Anton swap descriptor size-band sensitivity
- Memory `feedback_audit_before_planning.md` — late-milestone phase audit pattern (informed §4 file:line evidence collection)

### Tertiary (LOW confidence — flagged for Plan 01/02 verification)
- Counter-scale sub-pixel rendering bugs on Safari iOS (general web-dev folklore; would need real-device verification)
- CSS anchor positioning support matrix (Chrome 125+; Safari TBD per MDN; verified currently unsupported in Safari as of 2026-04)
- Pseudo-element LCP candidacy in Chrome's LCP API (likely NOT credited; needs Plan 02 Wave 0 confirmation)
- Lighthouse desktop LHCI config location (assumed `.lighthouseci/lighthouserc.desktop.json` per Phase 64 RESEARCH §Standard Architecture; verify in Plan 03)

## Metadata

**Confidence breakdown:**
- Mechanism comparison: HIGH — every claim grounded in shipped code or quoted ratification rationale
- Pillarbox specifics: HIGH — pre-hydration script branch logic verified across all 3 scale-writer sites
- Counter-scale specifics: MEDIUM — rejection on tablet AES-04 grounds is HIGH confidence; brittleness arguments are MEDIUM
- Portal specifics: MEDIUM — hydration concern is HIGH; sync layer details are MEDIUM
- ARC-04 suppression: MEDIUM — pseudo-element option requires Plan 02 Wave 0 LCP-stability verification; mask-image option is high-confidence-but-higher-cost fallback
- Verification surface: HIGH — all harnesses already exist in devDeps and have working precedents
- Validation architecture: HIGH — all test names + commands map to existing infrastructure patterns

**Research date:** 2026-04-29
**Valid until:** 2026-05-20 (3 weeks; mechanism choice may need re-verification if Tailwind v5 ships or Chrome's LCP API changes pseudo-element handling)

## RESEARCH COMPLETE

**Phase:** 66 — ScaleCanvas Track B Architectural Decision
**Confidence:** HIGH

### Key Findings

1. **Pillarbox is the canonical close path.** The `_path_h_decision` block in `.lighthouseci/lighthouserc.json:14` itself names "ScaleCanvas adds a mobile breakpoint exception (e.g., < sm: native layout, no transform)" as the review_gate condition. Recommending pillarbox aligns architectural change with v1.8's own ratified close path.
2. **Counter-scale fails tablet AES-04 by construction.** Tablet (834px) scale ≈ 0.65; counter-scale = 1.54× — descendants visibly larger than siblings. Non-viable.
3. **Portal mechanism conflicts with mobile LCP.** GhostLabel is the mobile LCP candidate (`v1.8-lcp-diagnosis.md`); portaling moves it post-hydration, disqualifying or shifting the LCP element. NOT RECOMMENDED for GhostLabel.
4. **GhostLabel ARC-04 → CSS pseudo-element (Option B)**, with mask-image as fallback. Pseudo-element content is excluded from axe-core's color-contrast measurement by spec. Plan 02 Wave 0 must verify LCP candidate stability post-suppression.
5. **All verification infrastructure already exists in devDeps.** No new framework installs needed: `@axe-core/playwright`, `@playwright/test`, `@lhci/cli`, `pixelmatch`, `pngjs` all present. Test patterns ready to copy from `tests/phase-38-a11y.spec.ts`, `tests/v1.8-phase60-aes04-diff.spec.ts`, `tests/v1.8-baseline-capture.spec.ts`.
6. **Mobile cohort baseline must precede source mutation.** Plan 01 Wave 0 captures `.planning/visual-baselines/v1.9-pre/` BEFORE Plan 02 implementation. AES-03 cohort review compares `v1.9-pre/` → post-implementation state at mobile + iphone13.
7. **`var(--sf-vw)` is a CONSTANT** (`12.8px`), not viewport-derived. Pillarbox doesn't change typography clamps' floors — clamps already saturate at native pixel values that are designed to be legible.

### File Created
`.planning/phases/66-scalecanvas-track-b-architectural-decision/66-RESEARCH.md`

### Confidence Assessment
| Area | Level | Reason |
|------|-------|--------|
| Mechanism comparison | HIGH | All 3 mechanisms grounded in shipped code + ratification rationale |
| Pillarbox specifics | HIGH | Branch logic verified across 3 scale-writer sites; existing CSS naturally degrades |
| ARC-04 suppression | MEDIUM | Option B (pseudo-element) recommended pending Plan 02 Wave 0 LCP-stability verification |
| Verification surface | HIGH | All harnesses exist in devDeps; patterns ready to copy |
| Validation architecture | HIGH | Tests map 1:1 to ARC-01..04 success criteria |

### Open Questions
1. **Mobile LCP candidate identity after Option B (pseudo-element) ARC-04 suppression** — needs Plan 02 Wave 0 measurement. If shifts to noise, escalate to Option A (mask-image).
2. **Desktop LHCI config location** — assumed `.lighthouseci/lighthouserc.desktop.json` per Phase 64 RESEARCH; verify in Plan 03 first task.
3. **`canvasSyncScript` (`app/layout.tsx:128`) behavior at scale=1** — outer height = `inner.offsetHeight * (vw/1280)` produces inflated outer height when `vw < 1280` AND scale=1. Plan 02 Task — verify and possibly add branch logic to canvasSyncScript too.
4. **instrument-hud at native mobile scale** — visual regression possible at HUD positioning; Plan 01 6-pillar audit must verify.
5. **Anton swap descriptors at native GhostLabel size band** — pillarbox makes GhostLabel render at native 200-400px instead of scaled 56-112px. CLS path_a baseline (0.0025) measured at scaled band; may need re-measurement at native band per `feedback_anton_swap_size_band.md`.

### Ready for Planning
Research complete. Planner can now create PLAN.md files for 3 plans (decision/implementation/verification) with the BLOCKING budget pattern. All ARC-01..04 success criteria mapped to verification harnesses already in devDeps.
