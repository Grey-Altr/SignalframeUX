---
phase: 53-mesh-gradient
plan: 01
status: complete
completed: "2026-04-25"
commit: "ecfe305"
---

# Summary — Phase 53 Plan 01: Mesh gradient clean ratification

## What was done

Three Phase 53 requirements (MSH-01..03) audited against shipped code. Verdict: 3-Ratified / 0-Obsolete — third clean all-ratified phase on this branch after Phase 48 (6/6) and Phase 52 (3/3). The `.sf-mesh-gradient` rule ships at `app/globals.css:2280-2292` with `position: fixed`, `inset: 0`, `z-index: -1` (line 2283), `pointer-events: none`, and a layered `background:` declaration of three `radial-gradient(ellipse ...)` calls at lines 2286-2288 — each using `oklch(...)` color values driven by `--sfx-theme-hue`. Single global consumer at `app/layout.tsx:119` via `<div className="sf-mesh-gradient" aria-hidden="true" />`. MSH-02's "grain composited on top" requirement is satisfied by structural z-index ordering: mesh fixed at `z-index: -1` sits below all default-stacking content, and `.sf-grain::after` at `globals.css:980-987` uses `position: absolute` with no explicit z-index (stacks at z≥0 by default), so any `.sf-grain` consumer (e.g. `manifesto-band.tsx:176`) automatically composites above the mesh layer — confirmed by author intent at the JSDoc comment `globals.css:2276` ("grain composites on top"). MSH-03's "60s+ cycle" requirement is satisfied verbatim by the literal `60s` duration on the `sf-mesh-drift` animation declaration at `globals.css:2290`, with `alternate` direction giving 120s round-trip. The MSH-* requirement set contains no process-gate clauses, so the post-Phase-52 clean-ratification streak holds. Notably, Phase 53 is the **first non-SIG-02-chain clean ratification** on this branch — mesh consumes `--sfx-theme-hue` directly (a FRAME-layer brand-hue slot), not any intensity-derived property, marking a divergence from the VHS-01 / HLF-02 / CIR-02 carry-forward pattern. Zero source-code mutations — pure documentation reconciliation per `feedback_ratify_reality_bias.md` and `project_overdue_lockin_mode.md`.

## Changes made

**MSH-01 / MSH-02 / MSH-03 — Ratified** (single REQUIREMENTS.md commit `77b4d73`):

| Req | Citation | What's there |
|-----|----------|--------------|
| MSH-01 | `app/globals.css:2280-2292` + `app/layout.tsx:119` | `.sf-mesh-gradient` ships with `position: fixed`, `inset: 0`, `z-index: -1` (line 2283), `pointer-events: none`. Background is three layered `radial-gradient(ellipse at 20% 30% / 80% 70% / 50% 50%, ...)` calls at lines 2286-2288, each using `oklch(...)` color values: ellipse 1 = `oklch(0.20 0.04 calc(var(--sfx-theme-hue) - 50))`, ellipse 2 = `oklch(0.18 0.03 var(--sfx-theme-hue))`, ellipse 3 = `oklch(0.15 0.02 calc(var(--sfx-theme-hue) - 70))`. Hue values fan around `--sfx-theme-hue` so the mesh adapts to the active brand-hue slot. Single global consumer at `app/layout.tsx:119` via `<div className="sf-mesh-gradient" aria-hidden="true" />`. Light-mode override at `globals.css:2294` (`opacity: 0.3`) keeps the layer subtle. Outcome and technique both clean — no technique-divergence annotation needed. |
| MSH-02 | `app/globals.css:2283` (mesh z-index) + `app/globals.css:980-987` (.sf-grain::after) + `app/globals.css:2276` (author intent comment) | Structural ratification via z-index ordering. Mesh sits at `z-index: -1`; `.sf-grain::after` uses `position: absolute` with no explicit z-index, establishing a stacking context at z≥0 within its parent. Therefore any `.sf-grain` consumer automatically composites above mesh by structure. Author intent confirmed by the JSDoc comment at `globals.css:2276`: "Fixed behind all content at z:-1; grain composites on top." Shipped reality applies grain per-section (`manifesto-band.tsx:176` only — confirmed by `grep -rn "sf-grain\b" app/ components/`), not as a global ambient overlay. This is a deliberate scoped-SIGNAL-surface choice consistent with the FRAME/SIGNAL dual-layer model: grain is a localized SIGNAL effect, not a blanket atmospheric layer. The MSH-02 spec wording is satisfied at the structural level — where grain exists, it composites correctly above mesh. |
| MSH-03 | `app/globals.css:2290` + `app/globals.css:2298-2310` | `animation: sf-mesh-drift 60s var(--sfx-ease-default) infinite alternate`. Literal `60s` matches spec "60-second or longer" verbatim; `alternate` direction = 120s round-trip per cycle, exceeding the spec lower bound. `@keyframes sf-mesh-drift` defines four position waypoints (0% / 33% / 66% / 100%) producing slow background-position drift across all three radial-gradient ellipses. Reduced-motion override at `globals.css:2314` (`animation: none`) for accessibility; print override at `globals.css:2320` (`display: none !important`) for performance. |

REQUIREMENTS.md body status lines (293-295) updated to `[x]` with literal `RATIFIED 2026-04-25` annotations + file:line citations. Traceability matrix rows 378-380 updated.

**Bookkeeping** (single ROADMAP.md commit `ecfe305`):
- Line 798 corrected: `- [ ] 44-01-PLAN.md — Fix all copy across 6 source files...` → `- [x] 53-01-PLAN.md — Mesh gradient clean ratification (3/3)`. Checkbox ticked because the plan IS complete by the time it commits.
- Phases 54, 55, 56 still carry the same stale `44-01-PLAN.md` reference (4 remaining occurrences). Deliberately preserved.

## Verification

| Check | Outcome |
|-------|---------|
| `grep -c "^- \[x\] \*\*MSH-0[1-3]\*\*" .planning/REQUIREMENTS.md` returns 3 | PASS |
| MSH-01 body line contains `RATIFIED 2026-04-25` + cites `globals.css:2280-2292` + `layout.tsx:119` consumer | PASS |
| MSH-02 body line contains `RATIFIED 2026-04-25` + cites mesh z-index + grain stacking + author-intent comment | PASS |
| MSH-03 body line contains `RATIFIED 2026-04-25` + cites `globals.css:2290` + `2298-2310` keyframes | PASS |
| Matrix rows `\| MSH-0[1,2,3] \| Phase 53 \| Ratified \|` exist (3 rows) | PASS |
| Zero matrix rows match `^\| MSH-0[1-3] \| Phase 53 \| Pending \|` | PASS |
| `RATIFIED 2026-04-25` count in REQUIREMENTS.md = 22 (was 19 after Phase 52; +3 MSH) | PASS |
| `OBSOLETE 2026-04-25` count in REQUIREMENTS.md = 8 (unchanged — clean phase) | PASS |
| ROADMAP.md Phase 53 plan ref reads `53-01-PLAN.md — Mesh gradient clean ratification (3/3)` | PASS |
| ROADMAP.md Phase 53 plan checkbox is `[x]` | PASS |
| Phase 54 entry STILL contains `44-01-PLAN.md` (out of scope, must remain) | PASS |
| `53-01-PLAN.md` occurrence count in ROADMAP.md = 1 | PASS |
| `44-01-PLAN.md` occurrence count decremented from 5 → 4 | PASS |
| Zero source code (`app/`, `components/`, `lib/`, `hooks/`, `package.json`) changes | PASS |

All 2 task acceptance criteria met. No regression in adjacent matrix rows (SIG-* / GRN-* / VHS-* / DTM-* / HLF-* / CIR-* still Ratified/Obsolete/Complete from Phases 48-52; PTL-/GLT-/SYM-/VRG-03/PRF- untouched).

## Notes

**Third clean all-ratified phase on this branch.** Phase 47 had 1 Complete + 2 Ratified + 1 Obsolete; Phase 48 had 6/6 Ratified (the first clean case); Phase 49 had 1 Ratified + 4 Obsolete; Phase 50 had 4 Ratified + 2 Obsolete; Phase 51 had 3 Ratified + 1 Obsolete; Phase 52 had 3/3 Ratified (the second clean case). Phase 53 joins Phase 48 + 52 as the third fully-Ratified phase. The post-Phase-52 clean-ratification streak holds because the MSH-* requirement set contains no process-gate clauses — no "human visual review" / "before grain changes" / "combined-view" wording. Predictability tightens further: requirement sets without process gates ratify cleanly when shipped reality matches spec; requirement sets with process gates produce predictable Obsolete annotations.

**First non-SIG-02-chain clean ratification.** Phases 48 / 50 / 51 / 52 all leveraged the `global-effects.tsx:39-57` derived-property carry-forward (VHS-01 / HLF-02 / CIR-02 each pre-satisfied at the wiring level by SIG-02). Phase 53 ratifies entirely outside that chain — the mesh gradient consumes `--sfx-theme-hue` (the brand-hue slot) directly, not any intensity-derived property. This is a clean architectural confirmation of the FRAME/SIGNAL split: mesh is a FRAME-layer atmospheric backdrop driven by theme-hue (deterministic, structural, brand-aligned), not a SIGNAL-layer expressive effect driven by intensity (generative, parametric, mood-modulated). The mesh is FRAME visualizing the brand hue; the grain on top is SIGNAL expressing surface texture. The spec wording "grain composited on top of mesh gradient" maps directly onto this dual-layer ordering.

**MSH-02's structural ratification pattern.** Phases 48-52 all ratified via direct CSS rule + JSX consumer pairs; MSH-02 introduces a new ratification mode: structural z-index ordering. Mesh `z-index: -1` + `.sf-grain::after` `position: absolute` (no z-index, default z≥0) is a CSS-stacking-context guarantee — grain is structurally above mesh wherever it appears, regardless of where it's applied. This pattern is likely to recur: PTL-* particle-field requirements may need structural ratification against `useSignalScene()` singleton management, and SYM-* symbol-system requirements may need structural ratification against the `cd-symbol` / `cd-corner-panel` z-index hierarchy. Documenting it explicitly here for future audits.

**Mesh applies grain per-section, not globally.** A potential ratification concern: shipped reality only applies `.sf-grain` to `manifesto-band.tsx:176`, not as a blanket atmospheric overlay. The MSH-02 spec wording ("Grain composited on top of mesh gradient") is ambiguous — strict reading demands a global grain layer; loose reading accepts structural z-index ordering. We ratified on the loose reading because: (1) the FRAME/SIGNAL dual-layer model treats grain as a scoped SIGNAL surface, not a blanket effect; (2) the author intent comment at `globals.css:2276` explicitly states the grain-above-mesh ordering as a structural design rule, not a global-overlay implementation requirement; (3) `feedback_signal_frame_order.md` confirms SIGNAL effects should be locally targeted, not globally ambient; (4) Phase 49's GRN-02/GRN-03 (idle escalation activator for grain) was OBSOLETED by `a260238` for PRF-02 launch gate compliance, removing the global grain-overlay path entirely. The strict reading would be incompatible with the shipped FRAME/SIGNAL architecture and with Phase 49's already-ratified obsolescence chain.

**Seventh ratification in the v1.7 audit campaign.** Phase 47 (commits `709e8e9` / `e1dcf8f` / `fa7e70f` / `0ff2e38`) → Phase 48 (`b0d7a51` / `99e83d6` / `40895ad`) → Phase 49 (`efe6aad` / `c2294c1` / `a3e1eee`) → Phase 50 (`5b2e0e5` / `cff3923` / `b856405`) → Phase 51 (`9f36b66` / `9fd9f85` / `a8e5a52`) → Phase 52 (`f289e91` / `16d3759` / `844e5c3`) → Phase 53 (`77b4d73` / `ecfe305` / this commit). Pattern locked: REQUIREMENTS first, ROADMAP second, PLAN+SUMMARY third.

**Carry-forward intel for Phase 54 (Particle Field) audit.** Per the v1.7 handoff Phase 54 priming: `particle-field.tsx` + `particle-field-hq.tsx` exist, with `--sfx-fx-particle-opacity` derived in `global-effects.tsx:57` (fourth SIG-02 carry-forward beneficiary candidate after VHS-01 / HLF-02 / CIR-02). PTL-01 expects the existing `useSignalScene()` singleton — likely structurally ratifiable like MSH-02. PTL-02's stepped particle count (0 / 2000 / 5000) needs grep against `getQualityTier()` consumption per `feedback_consume_quality_tier.md`. PTL-03 has a "physical iOS Safari device test passes (no context loss, no black canvas)" process gate — predicted partial-obsolete (cannot satisfy retroactively unless test artifacts exist in the repo). PTL-04 needs inspection. Predicted verdict: 2-3 Ratified + 1 Obsolete (PTL-03), reverting to mixed-verdict pattern.

**Stale doc-comment cleanup carry-forward (still deferred).** Phase 49 flagged `global-effects.tsx:165-186, 201` as `IdleOverlay` JSDoc residue from `a260238`. Phases 50, 51, 52, 53 audits did not touch those lines (MSH-* grep targets hit `globals.css:2274-2322` + `:980-987` + `app/layout.tsx:119`, all outside the JSDoc residue block). Carry forward to Phase 54 — particle-field audit will likely grep `global-effects.tsx:57` for `--sfx-fx-particle-opacity`, which is in the derivation block (lines 39-57) but still well above the JSDoc residue (lines 165-186, 201). The cleanup may need its own dedicated commit at the end of the v1.7 audit campaign.
