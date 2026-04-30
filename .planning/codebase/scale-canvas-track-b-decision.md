# ScaleCanvas Track B — Architectural Decision

> Phase 66 ARC-01 deliverable. Closes path_h (mobile a11y target-size) + path_i (GhostLabel color-contrast) at architectural root.
> NOT a re-derivation. Every claim cites shipped code.
> Mirrors `.planning/codebase/v1.8-lcp-diagnosis.md` shape: header block + numbered sections + file:line evidence + table-driven findings.

**Decided:** 2026-04-29
**Phase:** 66
**Plan:** 01 (Wave 0)
**Risk:** HIGH — load-bearing primitive change touching SSR + pre-hydration script + the universal `[data-sf-canvas]` transform rule
**Verification surface:** `tests/v1.9-phase66-{decision-doc,arc-axe,aes04-diff,pillarbox-transform,lcp-stability,lhci-config}.spec.ts` + LHCI prod (mobile + desktop) + AES-03 mobile cohort review
**Authoritative sources:** `.planning/phases/66-scalecanvas-track-b-architectural-decision/66-RESEARCH.md` (mechanism comparison + file:line evidence + verification architecture); `.planning/codebase/AESTHETIC-OF-RECORD.md` §2 standing rules; `.planning/LOCKDOWN.md` (R-01..R-64).

---

## Mechanism Selected: Pillarbox

**Definition:** Below the Tailwind `sm` breakpoint (640px), `ScaleCanvas` applies `transform: none` (or equivalently `--sf-content-scale = 1`); `[data-sf-canvas]` renders at native pixel sizes instead of `transform: matrix(0.39, 0, 0, 0.39, 0, 0)` (the v1.8 default at 360–428px viewports). Above `sm`, behavior is unchanged from v1.8 — the transform path is identical and AES-04 strict ≤0.5% is preserved by construction.

**Decision criterion (per `_path_h_decision.review_gate` at `.lighthouseci/lighthouserc.json:14`):**
The v1.8 ratification block explicitly names this as the canonical close path:
> "Tighten back to 0.97 when (a) ScaleCanvas adds a mobile breakpoint exception (e.g., < sm: native layout, no transform), OR (b) interactive elements gain a mobile target-size compensation media-query, OR (c) a per-environment LHCI config split is introduced..."

Pillarbox is option (a) verbatim. Selecting it discharges the v1.8 `_path_h_decision.review_gate` directly. Options (b) and (c) are rejected below — see "Counter-scale (Rejected)" + "Portal (Rejected)" + "Why not the LHCI config split (option c) alone".

**Confidence:** HIGH per `66-RESEARCH.md` §3d. Every load-bearing claim below cites file:line evidence. Only LOW-confidence item (Safari iOS sub-pixel rendering on counter-scaled text) is flagged in the counter-scale rejection section.

---

## Current ScaleCanvas Behavior — File:Line Evidence

### Where transform is applied

- **`components/layout/scale-canvas.tsx:42-83`** — `applyScale()` body. The complete primitive that computes scale + writes 7 CSS custom properties to `document.documentElement.style`. Specifically:
  - Line 47: `const contentScale = vw / DESIGN_WIDTH;` (DESIGN_WIDTH=1280 at line 6).
  - Line 52: `const heightScale = Math.min(1, vh / SHRINK_VH);` (SHRINK_VH=435 at line 15).
  - Line 53: `const chromeScale = Math.min(contentScale, heightScale);`.
  - Lines 75–81: writes `--sf-canvas-scale`, `--sf-content-scale`, `--sf-nav-scale`, `--sf-nav-morph`, `--sf-hero-shift`, `--sf-frame-offset-x`, `--sf-frame-bottom-gap` to `document.documentElement.style`.
  - Line 82: `ScrollTrigger.refresh()` after every applyScale (PF-04 boundary; do not remove per `feedback_pf04_autoresize_contract.md`).
- **`app/globals.css:2770-2774`** — the rule that consumes `--sf-content-scale`:
  ```css
  [data-sf-canvas] {
    transform: scale(var(--sf-content-scale, 1));
    transform-origin: top left;
    will-change: transform;
  }
  ```
- **`app/layout.tsx:117`** — the pre-hydration `scaleScript` IIFE, mounted in `<head>` at HTML parse time. Mirrors `applyScale()` synchronously so the first painted frame is already scaled (CLS=0 contract per Phase 59 CRT-01). Same input math: `var s=vw/DW,hs=Math.min(1,vh/SHRINK),cs=Math.min(s,hs),ns=hs;` (DW=1280, SHRINK=435, IDLE=800).
- **`app/layout.tsx:128`** — the body-tail `canvasSyncScript` IIFE (CRT-01 Phase 59). Reads `[data-sf-canvas]` `offsetHeight`, multiplies by `vw/1280`, writes the result to the outer parent `style.height`. This is the THIRD scale writer; Plan 02 must address it (see "Open Questions" #1).

These three sites — `scale-canvas.tsx:42-83`, `app/layout.tsx:117`, `app/layout.tsx:128` — are the ONLY scale writers in the codebase per `66-RESEARCH.md` §4b. Plan 02 mirrors the breakpoint logic across them.

### Why axe-core fails post-transform

- Mobile 360px viewport → `--sf-content-scale = 360 / 1280 = 0.28125` (computed value verified via chrome-devtools MCP in `_path_h_decision.evidence` at `.lighthouseci/lighthouserc.json:9`).
- axe-core's `target-size` rule (Lighthouse-bundled axe 4.x) reads `getBoundingClientRect()` POST-transform. A 24px native footer link renders as `24 × 0.28125 ≈ 6.75px` to axe — fails the 24px AA threshold. Footer source: `components/layout/footer.tsx` (7 `<a class="sf-link-draw">` items per `_path_h_decision.rationale`).
- axe-core's `color-contrast` rule (Lighthouse-bundled axe 4.x) flattens `text-foreground/[0.04]` (4% opacity) over white background → 1.09 contrast ratio (`_path_i_decision.rationale` at `.lighthouseci/lighthouserc.desktop.json:8`). Required: 3:1 for large text. axe-core does NOT honor `aria-hidden="true"` for color-contrast (contrast is a sighted-user concern). The project-internal exclusion `[data-ghost-label]` at `tests/phase-38-a11y.spec.ts:60` is NOT readable by Lighthouse's bundled axe.

### How `--sf-content-scale` propagates

Three writers (verified by `66-RESEARCH.md` §4b):

1. `app/layout.tsx:117` — pre-hydration `scaleScript` IIFE.
2. `components/layout/scale-canvas.tsx:75-77` — `applyScale()` in `useEffect`.
3. `app/layout.tsx:128` — body-tail `canvasSyncScript` IIFE.

Consumers reading the var via `getComputedStyle`:

- `components/layout/instrument-hud.tsx:218` — HUD positioning.
- `components/layout/instrument-hud.tsx:267` — HUD self-transform: `transform: scale(var(--sf-canvas-scale, 1))`.
- `components/animation/pinned-section.tsx:108-160` — uses `var(--sf-canvas-h, calc(100*var(--sf-vh)))` for spacer/portal heights.
- `app/globals.css:2784-2809` — height-remap rules `[data-sf-canvas] .h-screen { height: calc(100vh / var(--sf-content-scale, 1)) }` etc. When scale=1 these collapse to `100vh` — NO rule change required for pillarbox per `66-RESEARCH.md` §3a.

---

## 6-Pillar Visual Audit

Per CRT-style critique convention (`feedback_aesthetic_direction`). Verdict: **PASS** for desktop+tablet (above breakpoint, identical-by-construction); mobile cohort REVIEW required (deliberate native-mode flip is "feels different" by design — `66-RESEARCH.md` §3a, AES-03 standing rule).

| Pillar       | Above sm (desktop+tablet)                                                                                                  | Below sm (mobile cohort)                                                                                                                 | Verdict           |
| ------------ | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| Structure    | Section composition unchanged. `transform: scale(var(--sf-content-scale))` identical to v1.8.                              | Sections fill native viewport. `[data-sf-canvas] .h-screen { height: calc(100vh / var(--sf-content-scale, 1)) }` (`globals.css:2784-2809`) collapses to `100vh` when scale=1. | PASS / cohort     |
| Hierarchy    | Heading + GhostLabel weight unchanged.                                                                                      | GhostLabel renders at native `clamp(200px, calc(25*var(--sf-vw)), 400px) = clamp(200px, 320px, 400px) = 320px` (`ghost-label.tsx:19`). Dominates mobile by design (cohort accepts as deliberate). | PASS / cohort     |
| Contrast     | OKLCH slot semantics unchanged. R-40 saturation asymmetry preserved.                                                        | Identical — no color slot changes. Whatever the GhostLabel renders post-pillarbox is still 4% opacity (ARC-04 separately suppresses it via pseudo-element).                | PASS              |
| Spacing      | Blessed 9 stops resolve via `--sf-vw=12.8px` constant (`globals.css:324`).                                                 | Identical — `--sf-vw` is a CSS CONSTANT (NOT viewport-derived). Per `66-RESEARCH.md` §5c, all `clamp()` floors with mobile-friendly minima stay legible.                  | PASS              |
| Alignment    | Section grid intact.                                                                                                        | Native-mode grid; cohort review of `clamp()` floor saturation. `instrument-hud` reads `--sf-canvas-scale=1` post-pillarbox → renders at native size (`instrument-hud.tsx:218,267`). Cohort confirms in 66-COHORT-REVIEW.md. | PASS / cohort     |
| Motion       | GSAP timelines + Lenis `autoResize:true` untouched (`feedback_pf04_autoresize_contract.md`). `ScrollTrigger.refresh()` still called (`scale-canvas.tsx:82`). | Identical. PF-04 contract preserved — `lenis-provider.tsx` is OFF LIMITS for Phase 66.                                                  | PASS              |

**Aggregate verdict:** PASS strict (desktop+tablet) + COHORT REVIEW (mobile+iphone13). Pixel-diff strict gate (`tests/v1.9-phase66-aes04-diff.spec.ts --grep strict`) enforces the strict line; AES-03 cohort review with `.planning/visual-baselines/v1.9-pre/` reference enforces the cohort line.

---

## Counter-scale (Rejected)

**Mechanism:** New CSS rule `[data-a11y-target] { transform: scale(calc(1 / var(--sf-content-scale, 1))); }` + per-consumer marker attribute on every a11y-relevant element (footer 7 sites + buttons + GhostLabel).

**Rejection — multiple binding constraints:**

1. **AES-04 desktop+tablet fails by construction (`66-RESEARCH.md` §3b).** Tablet 834px → `contentScale ≈ 0.65` → counter-scale `1/0.65 ≈ 1.54`. a11y-marked descendants render 54% LARGER than siblings. Visible design-integrity break in `ipad-834x1194` viewport. AES-04 strict ≤0.5% pixel-diff fails on every tablet route. NON-VIABLE.
2. **Mobile aesthetic catastrophe.** Mobile 360px → counter-scale `1/0.28125 ≈ 3.55`. Footer links balloon to 3.55× native size. GhostLabel becomes `200 × 3.55 = 710px` → full-bleed. Defeats the wayfinding contract (`components/animation/ghost-label.tsx:6-9` — "structural wayfinding, not decoration").
3. **Doesn't address path_i (ARC-04).** Counter-scale preserves opacity. The 4% opacity GhostLabel still flattens to 1.09 contrast against white. ARC-04 still requires a suppression mechanism on top.
4. **Composition brittleness.** Every nested transform (GSAP scroll-triggered transforms, hover scales, focus rings) compounds multiplicatively with the counter-scale. CVA recipe required on every interactive component declaring its target-size posture. HIGH maintenance burden vs. pillarbox's LOW.
5. **Performance regression.** Each counter-scaled element introduces a new composite layer. 7 footer + N buttons across the site = 50+ new GPU layers, especially on mobile where the site is already a 0.28× scale composite.
6. **(LOW confidence) Safari iOS text rendering.** Sub-pixel positioning on counter-scaled elements with text rendering can produce blurry rendering on Safari iOS (well-documented behavior with `transform: scale(1.5)` on small text). Not verified on a real device but adds risk surface.

---

## Portal (Rejected)

**Mechanism:** Extend `#pin-portal` precedent (`components/animation/pinned-section.tsx:119-149`) to a generic `#a11y-portal` mounted as a direct `<body>` child. New `usePortalSync()` hook (ResizeObserver + MutationObserver) syncs in-canvas anchor position to the portal element. Each a11y-relevant element renders as `<a11y-anchor data-portal-target="..."><PortalElement /></a11y-anchor>`.

**Rejection — critical hydration concern + sync overhead:**

1. **Hydration concern is CRITICAL for mobile LCP candidate (`66-RESEARCH.md` §3c).** `React.createPortal` is client-only in React 19 (still no SSR portals). Mobile LCP currently = `GhostLabel` per `.planning/codebase/v1.8-lcp-diagnosis.md` row "mobile-360x800 / warm: GhostLabel @ 68ms". Portaling the GhostLabel removes it from the SSR HTML stream → mobile LCP candidate shifts to a delayed/different element OR goes through a full re-emergence cycle post-hydration. Re-introduces CLS risk. Phase 60 LCP-01 fight (810ms median, 88% improvement) would partially regress.
2. **Sync layer overhead.** 7 footer + 1 GhostLabel = 8 observer chains (ResizeObserver + MutationObserver per element). Lenis scroll updates may need to invalidate sync — risks PF-04 contract caveat (`feedback_pf04_autoresize_contract.md`).
3. **Doesn't fully address path_i.** Portal renders the GhostLabel at full opacity to axe (the issue is `text-foreground/[0.04]` is preserved through the portal). ARC-04 suppression mechanism still required on top.
4. **Maintenance burden MEDIUM vs pillarbox LOW.** Counter-pressure: pillarbox is 1 breakpoint check in 3 places (component + scaleScript + canvasSyncScript). Portal adds a per-element sync layer + new observer pattern across the codebase.

**VIABLE BUT OPERATIONALLY HEAVIER than pillarbox.** Reserved as fallback only if pillarbox cohort review fails (`66-RESEARCH.md` §10 escalation path).

---

## Why not the LHCI config split (option c) alone

`_path_h_decision.review_gate` option (c) — "per-environment LHCI config split (preview-rc loose + prod-rc strict at 0.97)" — would silence the LHCI gate without addressing the architectural root. axe-core is still measuring 6.75px footer links on prod; the score loosening would just hide the violation from preview CI. v1.9 milestone goal is **architectural lock** (per project memory `project_v18_archived.md` "v1.9 Architectural Lock"); option (c) delays the same conversation to v1.10. Pillarbox is the only mechanism that lets us TIGHTEN the gate (≥0.97 mobile + desktop) on real prod measurements. ARC-03 + ARC-04 success criteria explicitly require ≥0.97 on prod homepage — option (c) cannot deliver that without pillarbox or counter-scale or portal underneath it.

---

## ARC-04 Suppression Mechanism: CSS Pseudo-Element

Pillarbox alone does NOT close ARC-04 — even at native sizes, axe-core color-contrast still measures the 4% opacity GhostLabel as visible text. ARC-04 requires a SEPARATE suppression mechanism, applied in Plan 02.

Per `66-RESEARCH.md` §8 + `_path_i_decision.review_gate` option (a) at `.lighthouseci/lighthouserc.desktop.json:15`:

> "(a) GhostLabel adds an explicit axe-core suppression mechanism (e.g., color: transparent + custom paint via mask-image, OR moves to a CSS pseudo-element which axe currently does not measure)"

**Mechanism:** Convert `<span data-ghost-label>` text content rendering to `::before { content: attr(data-ghost-text); }`. axe-core 4.x explicitly excludes pseudo-element content from the color-contrast rule per Deque docs (pseudo-content is "not in the accessibility tree"). Visual rendering identical to v1.8; opacity preserved (4% per component contract `components/animation/ghost-label.tsx:6-9`). Plan 02 Wave 0 verifies mobile LCP candidate post-suppression remains a stable above-fold SSR-paintable element — guard against `feedback_lcp_observer_content_visibility.md` and `feedback_chrome_lcp_text_in_defs_quirk.md` quirks.

**Why not opacity raise:** 70%+ opacity required for 3:1 contrast → converts GhostLabel from ambient-decorative to dominant-headline → aesthetic redesign, not a11y fix. EXPLICITLY out of scope per `_path_i_decision.rationale` at `.lighthouseci/lighthouserc.desktop.json:8` ("Bumping opacity to 70%+ would convert the GhostLabel from ambient-decorative to dominant-headline — that is an aesthetic redesign, not an a11y fix.").

**Why not aria-hidden:** Already on `ghost-label.tsx:14`. axe color-contrast does NOT honor aria-hidden (sighted-user concern). Confirmed by `_path_i_decision.rationale`: "aria-hidden=\"true\" excludes it from the accessibility tree (correct), but axe-core's color-contrast rule applies to ALL visible text regardless of aria-hidden."

---

## AES-04 Risk Assessment

| Surface           | Pre-mutation (v1.8)                                           | Post-mutation (v1.9 expected)                                    | Gate                                       |
| ----------------- | ------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------ |
| Desktop 1440×900  | `--sf-content-scale ≈ 1.125` (1440/1280); transform applied    | `--sf-content-scale ≈ 1.125`; transform applied (vw≥640 path)    | AES-04 strict ≤0.5% vs `v1.8-start/`        |
| iPad 834×1194     | `--sf-content-scale ≈ 0.652` (834/1280); transform applied     | `--sf-content-scale ≈ 0.652`; transform applied (vw≥640 path)    | AES-04 strict ≤0.5% vs `v1.8-start/`        |
| iPhone 13 390×844 | `--sf-content-scale ≈ 0.305` (390/1280); transform applied     | `--sf-content-scale = 1`; `transform: none` (vw<640 pillarbox)   | AES-03 cohort vs `v1.9-pre/` (capture-only) |
| Mobile 360×800    | `--sf-content-scale ≈ 0.281` (360/1280); transform applied     | `--sf-content-scale = 1`; `transform: none` (vw<640 pillarbox)   | AES-03 cohort vs `v1.9-pre/` (capture-only) |

**Why iPad portrait stays scaled:** 834px ≥ Tailwind v4 `sm` (640px). Pillarbox engages STRICTLY below 640. iPad portrait remains in the v1.8 scaled mode → tablet AES-04 ≤0.5% preserved by construction.

**Why iPhone 13 (390×844) flips to pillarbox:** 390 < 640. Even though `iphone13-` is in the AES-04 baseline set, it falls below the breakpoint and joins the AES-03 cohort review track. Plan 03's `tests/v1.9-phase66-aes04-diff.spec.ts --grep strict` specifically EXCLUDES `iphone13-390x844` and `mobile-360x800` from the hard-fail diff gate; those viewports are captured to `.planning/visual-baselines/v1.9-pre/` (Plan 01 Task 4) and reviewed via the cohort track.

---

## Verification Surface

| # | Spec / surface | Asserts | Trigger |
|---|---|---|---|
| 1 | `tests/v1.9-phase66-pillarbox-transform.spec.ts` | At `vw < 640`, `[data-sf-canvas]` computed `transform = matrix(1, 0, 0, 1, 0, 0)` (identity). | Plan 02 Wave 0. |
| 2 | `tests/v1.9-phase66-arc-axe.spec.ts` | Direct axe-core `target-size` (mobile 375×667) + `color-contrast` (desktop 1440×900) violations[]=0. GhostLabel NOT in any project-internal selector exclude list (sanity gate). | Plan 03. |
| 3 | `tests/v1.9-phase66-aes04-diff.spec.ts --grep strict` | Desktop 1440×900 + iPad 834×1194 pixel-diff vs `.planning/visual-baselines/v1.8-start/` ≤0.5% per route (5 routes × 2 viewports = 10 hard-fail gates). | Plan 03. |
| 4 | `tests/v1.9-phase66-aes04-diff.spec.ts --grep cohort` | Mobile 360×800 + iPhone13 390×844 capture vs `.planning/visual-baselines/v1.9-pre/`. NO hard-fail; result written to `66-cohort-results.md` for AES-03 cohort review. | Plan 03 + manual review. |
| 5 | `tests/v1.9-phase66-decision-doc.spec.ts` | THIS DOC's schema: file presence + mechanism heading + 6-pillar heading + file:line citations + alternative-rejection sections. | Every PR (T-66-01 mitigation). |
| 6 | `tests/v1.9-phase66-lhci-config.spec.ts` | `_path_h_decision` block ABSENT from `.lighthouseci/lighthouserc.json`; `categories:accessibility.minScore = 0.97`. `_path_i_decision` block ABSENT from `.lighthouseci/lighthouserc.desktop.json`; desktop `categories:accessibility.minScore = 0.97`. | Plan 03. |
| 7 | `tests/v1.9-phase66-lcp-stability.spec.ts` | Mobile LCP candidate post-ARC-04 suppression is a stable SSR-paintable above-fold element (NOT 0×0 bounding rect element per `feedback_chrome_lcp_text_in_defs_quirk.md`; NOT null entry.element per `feedback_lcp_observer_content_visibility.md`). | Plan 02 Wave 0. |
| 8 | LHCI prod mobile (`pnpm exec lhci autorun --collect.url=https://signalframe.culturedivision.com`) | `categories:accessibility ≥0.97` median-run on prod homepage. | Phase-gate (post-deploy). |
| 9 | LHCI prod desktop (`pnpm exec lhci autorun --config=.lighthouseci/lighthouserc.desktop.json --collect.url=https://signalframe.culturedivision.com`) | `categories:accessibility ≥0.97` median-run on prod homepage. | Phase-gate (post-deploy). |

---

## Open Questions (Resolved Pre-Plan-02)

1. **`canvasSyncScript` identity branch (`app/layout.tsx:128`).** When pillarbox engages (scale=1 at vw<640), the script writes `outer.style.height = inner.offsetHeight * (window.innerWidth / 1280)` — which evaluates to `inner.offsetHeight × (vw/1280) < inner.offsetHeight`. **This is incorrect post-pillarbox: the outer parent height should equal `inner.offsetHeight` directly when no transform is applied.** Plan 02 Task 2 MUST add a branch in `canvasSyncScript` to use `s = vw < 640 ? 1 : (vw / 1280)`. Per `66-RESEARCH.md` §4b "These three are the ONLY scale writers" + Open Question 3.

2. **LHCI desktop config location.** Confirmed at `.lighthouseci/lighthouserc.desktop.json` (verified by file presence in `.lighthouseci/` directory listing — see `read_first` evidence in `66-01-PLAN.md`). `_path_i_decision` block lives at lines 2–17 of that file. Plan 03 removes the block + raises `categories:accessibility.minScore` from 0.96 to 0.97.

3. **Mobile LCP candidate post-ARC-04.** Plan 02 Wave 0 task captures the new candidate identity. v1.8 mobile LCP = GhostLabel (warm 68ms, `v1.8-lcp-diagnosis.md` row mobile-360x800/warm). Post-ARC-04 (pseudo-element render), the candidate may shift. If it shifts to a stable above-fold SSR-paintable element (e.g., `<h1>SIGNALFRAME//UX`), pass. If it shifts to noise (0×0 rect, content-visibility:auto null entry.element), escalate to ARC-04 Option B (`color: transparent` + mask-image custom paint per `_path_i_decision.review_gate` (a) clause).

4. **`instrument-hud.tsx` post-pillarbox.** HUD reads `--sf-canvas-scale` for self-positioning (`instrument-hud.tsx:218`) and self-transform (`instrument-hud.tsx:267`). Below sm with pillarbox, `--sf-canvas-scale = 1` → HUD renders at native (un-scaled) size. Visual-cohort review item (manual entry in `66-VALIDATION.md` §Manual-Only Verifications); not blocking for ARC-02 strict.

5. **GhostLabel size band ratifications.** `ghost-label.tsx:19` clamp `clamp(200px, calc(25*var(--sf-vw)), 400px)` evaluates to 320px below sm (since `--sf-vw=12.8px` is constant per `globals.css:324`, NOT viewport-derived per `66-RESEARCH.md` §5c). Cohort review confirms 320px native GhostLabel on mobile is acceptable. Per `feedback_anton_swap_size_band.md`, sub-pixel CLS may surface at smaller bands; Plan 02 Wave 0 LCP-stability spec captures the residual.

---

## Verification Verdicts (Updated by Plan 03)

*Pending Plan 03 execution — this section is updated post-implementation with evidence + any deviations.*

| Spec | Result | Evidence path | Notes |
|------|--------|---------------|-------|
| pillarbox-transform | (pending) | (pending) | Plan 02 Wave 0 |
| arc-axe target-size | (pending) | (pending) | Plan 03 |
| arc-axe color-contrast | (pending) | (pending) | Plan 03 |
| aes04-diff strict | (pending) | (pending) | Plan 03 |
| aes04-diff cohort | (pending) | `66-cohort-results.md` | Plan 03 + manual cohort review |
| decision-doc schema | (Plan 01 GREEN) | `tests/v1.9-phase66-decision-doc.spec.ts` 7/7 PASS | This plan |
| lhci-config path_h removed | (pending) | (pending) | Plan 03 |
| lhci-config path_i removed | (pending) | (pending) | Plan 03 |
| lcp-stability mobile | (pending) | (pending) | Plan 02 Wave 0 |
| LHCI prod mobile a11y ≥0.97 | (pending) | (pending) | Phase-gate post-deploy |
| LHCI prod desktop a11y ≥0.97 | (pending) | (pending) | Phase-gate post-deploy |

---

## Sign-Off Trail

- **2026-04-29 (Plan 01):** Decision authored, mechanism = Pillarbox + ARC-04 pseudo-element. Schema gate `tests/v1.9-phase66-decision-doc.spec.ts` GREEN.
- **(pending Plan 02):** Pillarbox shipped + ARC-04 pseudo-element conversion + cohort baseline comparison.
- **(pending Plan 03):** path_h + path_i blocks removed; LHCI prod mobile + desktop a11y ≥0.97; AES-04 strict 10/10 PASS.
- **(pending phase-gate):** AES-03 mobile cohort review verdict in `66-COHORT-REVIEW.md`.
