# AESTHETIC-OF-RECORD — v1.8 Speed of Light

> Perf-phase entry point. Codifies the four AES standing rules + points
> downstream phases at the canonical aesthetic invariant sources.
> AUTHORITATIVE source for invariants: LOCKDOWN.md.
> This document CITES — does NOT duplicate.

**Created:** 2026-04-25 (Phase 57, AES-01)
**Owner:** v1.8 milestone — read by Phases 58-62
**Sibling:** .planning/LOCKDOWN.md (v1.0 LOCKED 2026-04-23, R-01..R-64 + DECIDEs D-01..D-11)

---

## 1 · PURPOSE

- Phases 58-62 read AES-01..04 from here, not LOCKDOWN.md, so the standing-rule surface is one entry point.
- LOCKDOWN.md remains the AUTHORITATIVE invariant set. AESTHETIC-OF-RECORD.md is the citation map.
- Lock-in mode (`feedback_lockin_before_execute.md`): no re-derivation. Every claim cites shipped code.

---

## 2 · STANDING RULES

### AES-01 — Extract from shipped code; never re-derive.

**Statement:** ".planning/codebase/AESTHETIC-OF-RECORD.md created at v1.8 start, extracted from shipped code (lock-in mode per `feedback_lockin_before_execute.md`). Every phase reads from it; no re-derivation per-phase."

**Authoritative sources** (cite, do NOT duplicate):

- LOCKDOWN.md §1 "TRADEMARK PRIMITIVES" (line 27) — T1 PIXEL-SORT, T2 GLYPH LANGUAGE, T3 CUBE-TILE BOX, T4 `//` SEPARATOR.
- LOCKDOWN.md §2 "COLOR SYSTEM" (line 83) — slot-typed two-hue model, R-40 saturation asymmetry, OKLCH matrix.
- LOCKDOWN.md §3 "TYPOGRAPHY" (line 131) — four-voice system, scale, display-lockup rules.
- LOCKDOWN.md §4.1 "Blessed 9 stops" (line 165) — spacing tokens.
- LOCKDOWN.md §4.4 "Panel model — R-63" (line 178).
- LOCKDOWN.md §5 "MOTION + ANIMATION" (line 208) — duration tokens, easing tokens, signal-leads-frame staging, reduced-motion mandatory.
- LOCKDOWN.md §6 "SIGNAL LAYER — HIG" (line 239).
- LOCKDOWN.md §9.7 "Keyboard model — R-64" (line 388).
- `app/globals.css:121-386` — `:root` token block (`--sf-*` sizing/canvas/nav-state + `--sfx-*` color/theme/duration/spacing). Includes `--sfx-cube-hue`, `--sfx-primary-foreground`, motion easing tokens.

**Trademark primitive component paths** (must remain visible after any aesthetic-affecting change per `feedback_trademark_primitives.md`):

- **T1 Pixel-sort signal:** `components/blocks/entry-section.tsx`, `components/dossier/pointcloud-ring.tsx`, `components/dossier/pointcloud-ring-worker.ts`, `components/dossier/iris-cloud.tsx`, `components/dossier/iris-cloud-worker.ts`.
- **T2 Navbar glyph style:** `components/layout/nav.tsx`, `components/layout/nav-overlay.tsx`, `components/layout/nav-reveal-mount.tsx`, `components/layout/frame-navigation.tsx`.
- **T3 Cube-tile box:** `components/blocks/inventory-section.tsx` (semantic), `components/layout/instrument-hud.tsx` + `components/layout/cd-corner-panel.tsx` (cube-fill consumers), `app/globals.css` (`--sfx-cube-hue` slot).

**Enforcement:** Every Phase 58-62 plan MUST read this section before authoring any change.

### AES-02 — No Chromatic re-baseline for perf changes.

**Statement:** "No Chromatic re-baseline for perf changes. Only documented exception: Anton `optional` → `swap` migration in CRT-03." (REQUIREMENTS.md line 55)

**Documented exception:** CRT-03 (Phase 59) ratifies Anton `font-display: optional → swap` migration with tuned `size-adjust` + `ascent-override` + `descent-override` + `line-gap-override` against `Impact, Helvetica Neue Condensed, Arial Black` fallback. The visible/invisible-by-design exception per `feedback_ratify_reality_bias.md`.

**Anti-pattern:** "Just approve the new Chromatic baseline" emerging as a phase pattern (PITFALLS Pitfall #15). Re-baselining is reserved for deliberate aesthetic decisions, never for perf side-effects.

**Enforcement:** Phases 58, 59 (except CRT-03), 60, 61, 62 — Chromatic diff is read-only verification.

### AES-03 — Mid-milestone cohort review by external eye.

**Statement:** "Mid-milestone cohort review by external eye after Phase 60 against `.planning/visual-baselines/v1.8-start/`. 'Feels different' without specific code-change cause escalates." (REQUIREMENTS.md line 56)

**Mechanism:** chrome-devtools MCP scroll-test (per `feedback_visual_verification.md`) + side-by-side review of v1.8-start baselines vs. current state.

**Trigger:** After Phase 60 (LCP intervention) ships and before Phase 61 begins. Real-device cohort review per Pitfall #10 (mobile emulation pass != real-device pass).

**Enforcement:** Phase 60 close-out checklist; STATE.md notes when AES-03 fires.

### AES-04 — Per-phase pixel-diff <=0.5%.

**Statement:** "Pixel-diff vs v1.8-start snapshot at every phase end; >0.5% diff flagged for human review." (REQUIREMENTS.md line 57)

**Mechanism:** Same Playwright harness as DGN-03 baseline capture (Plan 02). Run WITHOUT `--update-snapshots` to compare against committed `.planning/visual-baselines/v1.8-start/`.

**Threshold:** 0.5% pixel-diff ratio. Greater diff blocks phase sign-off pending human review.

**Threshold-automation deferred:** CI gate vs human-review-only is Phase 58 (CIB) or Phase 62 (final-gate) decision per CONTEXT deferred-ideas.

**Enforcement:** Every Phase 58-62 close-out gate.

---

## 3 · AUTHORITATIVE SOURCE MAP

| Concern              | Source                                                                | Line/Section | Notes                                                                  |
| -------------------- | --------------------------------------------------------------------- | ------------ | ---------------------------------------------------------------------- |
| Trademark primitives | LOCKDOWN.md §1 "TRADEMARK PRIMITIVES"                                 | line 27      | T1-T4; never modify without explicit milestone scope                   |
| Color system         | LOCKDOWN.md §2 "COLOR SYSTEM"                                         | line 83      | OKLCH; slot-typed; R-40 saturation asymmetry                           |
| Typography           | LOCKDOWN.md §3 "TYPOGRAPHY"                                           | line 131     | Four-voice; minor-third scale; UPPERCASE mono                          |
| Spacing              | LOCKDOWN.md §4.1 "Blessed 9 stops"                                    | line 165     | Blessed 9 stops — no arbitrary values                                  |
| Panel model          | LOCKDOWN.md §4.4 "Panel model — R-63"                                 | line 178     | R-63                                                                   |
| Motion               | LOCKDOWN.md §5 "MOTION + ANIMATION"                                   | line 208     | Duration + easing tokens; signal-leads-frame; reduced-motion mandatory |
| SIGNAL HIG           | LOCKDOWN.md §6 "SIGNAL LAYER — HIG"                                   | line 239     | Three-layer composition; intensity hierarchy; rAF discipline; quality-tier |
| FRAME chrome         | LOCKDOWN.md §7 "FRAME CHROME — HIG"                                   | line 291     | Telemetry, route-ID grammar, breadcrumbs                               |
| Content grammar      | LOCKDOWN.md §8 "CONTENT GRAMMAR"                                      | line 323     | Coded naming; component category codes                                 |
| Interaction          | LOCKDOWN.md §9 "INTERACTION — HIG"                                    | line 362     | Hover/active register; focus rings; touch targets; keyboard model R-64 |
| Tokens               | app/globals.css                                                       | lines 121-386 | `:root` block; `--sf-*` + `--sfx-*` split                             |
| Trademark T1 path    | components/blocks/entry-section.tsx + 4 dossier files                 | n/a          | Pixel-sort signal                                                      |
| Trademark T2 path    | components/layout/nav*.tsx (4 files)                                  | n/a          | Navbar glyph                                                           |
| Trademark T3 path    | components/blocks/inventory-section.tsx + 2 layout files + globals.css | n/a          | Cube-tile box; `--sfx-cube-hue` slot                                  |

---

## 4 · CAPTURED-STATE NOTE

## Captured-state definition (per DGN-03 baseline)

The 20 v1.8-start baseline images at `.planning/visual-baselines/v1.8-start/`
represent the WARM-state Anton outcome (per Q1 resolution: planner forces
warm-state via `document.fonts.load('700 100px Anton')` in
`tests/v1.8-baseline-capture.spec.ts`). The reduced-motion path
(`page.emulateMedia({ reducedMotion: 'reduce' })`) is enabled to short-circuit
GSAP scroll-triggered reveals, so the captured state is the
"reduced-motion + warm-Anton" variant.

Rendering backend: SwiftShader (headless Chromium software WebGL), per
`playwright.config.ts:24-26`. Real-GPU visual review is the AES-03 cohort
review job, NOT the AES-04 pixel-diff gate.

**Hero `<h1>` opacity at capture: viewport-dependent (mixed Variant A/B).**
Inspection of two reference PNGs (per Plan 02 Task 3) confirms:

- **Desktop 1440×900 (`home-desktop-1440x900.png`):** Hero `<h1>` "SIGNALFRAME//UX" is **fully revealed** in Anton (Variant A — live first paint). The GSAP `sf-hero-deferred` reveal completes despite `reducedMotion: "reduce"` on this viewport — likely because the desktop reveal timeline is gated on viewport-size or pointer-coarse media-query branches that bypass the reduced-motion fork.
- **Mobile 360×800 (`home-mobile-360x800.png`):** Hero `<h1>` is **invisible** at the captured frame (Variant B — reduced-motion frozen pre-reveal at `opacity: 0.01`, per STATE.md D-08 / `app/globals.css:1701, 1715`). Header chrome, top-right route-ID badge, and below-hero body Anton render correctly; only the ghost-label `<h1>` sits at start-state opacity.
- **Tablet/iphone13 viewports:** not visually inspected at this checkpoint; assume mirror of mobile (Variant B) until Plan 03 LCP diagnosis confirms otherwise.

**Phases 58-62 reading these baselines must understand:** AES-04 pixel-diff
treats desktop captures as live first paint and mobile/sub-tablet captures as
the reduced-motion frozen pre-reveal state. A pixel-diff that fails on mobile
because the hero `<h1>` newly appears (or vice-versa) is a reveal-timing
regression, NOT an aesthetic regression — investigate the GSAP timeline
gate before re-baselining.

**Both states are canonical for v1.8-start.** Body Anton, layout chrome, color
slots, trademark primitives (T1 grain field on desktop, T2 nav glyph, T3
cube-tile box) all render correctly across both. The mixed-variant capture
is the AES-04 comparison surface for Phases 58-62.

(Finalized by Plan 02 Task 3 after human PNG inspection on 2026-04-26.)

---

## 5 · ENFORCEMENT MATRIX

| Phase                 | Reads                                       | Enforcement Trigger                                                          |
| --------------------- | ------------------------------------------- | ---------------------------------------------------------------------------- |
| 58 (LHCI + RUM)       | AES-01, AES-02, AES-04                      | Pixel-diff vs v1.8-start at phase end (AES-04)                               |
| 59 (Critical-path)    | AES-01, AES-02 (+ documented Anton exception), AES-04 | Per-PR pixel-diff; CRT-03 is the AES-02 exception ratification         |
| 60 (LCP intervention) | AES-01, AES-03, AES-04                      | Mid-milestone cohort review (AES-03) fires after Phase 60                    |
| 61 (Bundle hygiene)   | AES-01, AES-02, AES-04                      | Pixel-diff at phase end                                                      |
| 62 (Verification)     | AES-01..04 (all)                            | Final-gate audit; cumulative drift check                                     |

---

## Change Log

| Date       | Change                                                                  | By                  |
| ---------- | ----------------------------------------------------------------------- | ------------------- |
| 2026-04-25 | AES-01 deliverable — standing rules + canonical refs codified at v1.8 start | Phase 57, Plan 01 |
| 2026-04-26 | Captured-state §4 finalized — Variant A/B mixed (desktop revealed, mobile frozen pre-reveal) per DGN-03 baseline inspection | Phase 57, Plan 02 |
| 2026-04-26 | **AES-02 documented exception ratified.** Anton `font-display: optional → swap` migration with MEASURED descriptors (size-adjust 92.14%, ascent-override 127.66%, descent-override 35.72%, line-gap-override 0%) against `Impact, Helvetica Neue Condensed, Arial Black` fallback chain. 20 v1.8-start baselines re-captured; originals preserved at `.planning/visual-baselines/v1.8-pre-anton-swap/`. Slow-3G screen recordings are local-only forensic artifacts (gitignored; Playwright spec + 4/4 passing tests are the committed record). Commit: `2503f9a`. Cohort acceptance audit row: `.planning/phases/59-critical-path-restructure/59-AES02-EXCEPTION.md` §Cohort Acceptance — 2026-04-26:L49 | Phase 59, Plan 02 |
