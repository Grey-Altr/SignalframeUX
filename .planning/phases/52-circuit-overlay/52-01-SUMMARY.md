---
phase: 52-circuit-overlay
plan: 01
status: complete
completed: "2026-04-25"
commit: "16d3759"
---

# Summary — Phase 52 Plan 01: Circuit overlay clean ratification

## What was done

Three Phase 52 requirements (CIR-01..03) audited against shipped code. Verdict: 3-Ratified / 0-Obsolete — second clean all-ratified phase on this branch after Phase 48 (6/6). The `.sf-circuit::after` overlay layer ships at `app/globals.css:1268-1283` with the intensity-gated derivation living at `components/layout/global-effects.tsx:43-46` and three live consumer panels wired in `app/page.tsx`. CIR-02's "circuit fades as grain intensifies" requirement is satisfied by the literal `0.05 * (1 - i)` monotonic-inverse curve — at intensity=1 the circuit collapses to zero while grain saturates at the logarithmic ceiling (~0.08), making the two effects mutually exclusive at high intensity exactly as the spec demands. CIR-03's "real-time updates" guarantee is satisfied by the `SignalIntensityBridge` `MutationObserver` mechanism at `global-effects.tsx:264-298`, which observes `<html>` `style` attribute mutations and re-runs `updateSignalDerivedProps()` on every change — the same observer that real-time-updated VHS-01 + HLF-02. The CIR-* requirement set contains no process-gate clauses (no "human visual review", no "before grain changes" temporal gates), so the mixed-verdict streak from Phases 47 / 49 / 50 / 51 is broken — Phase 52 joins Phase 48 as the second clean all-ratified phase. Zero source-code mutations — pure documentation reconciliation per `feedback_ratify_reality_bias.md` and `project_overdue_lockin_mode.md`.

## Changes made

**CIR-01 / CIR-02 / CIR-03 — Ratified** (single REQUIREMENTS.md commit `f289e91`):

| Req | Citation | What's there |
|-----|----------|--------------|
| CIR-01 | `app/globals.css:1268-1283` + `app/page.tsx:69, :81, :113` | `.sf-circuit::after` ships an embedded SVG (horizontal/vertical traces, right-angle bends, pads/vias) at `background-size: 120px 120px` + `background-repeat: repeat`, gated by `opacity: var(--sfx-circuit-opacity, 0.03)` (the SIG-02 ratified derived property; fallback hits the 0.02-0.05 spec range exactly). Compositing uses `mix-blend-mode: soft-light` for low-contrast section background insertion. Three live consumers wired: PROOF (`app/page.tsx:69`), INVENTORY (`app/page.tsx:81`), ACQUISITION (`app/page.tsx:113`) — all via `className="sf-circuit relative"` on `SFPanel`. Outcome and technique both clean — second clean-spec ratification on this branch (no technique-divergence annotation needed, unlike HLF-01). |
| CIR-02 | `components/layout/global-effects.tsx:43-46` | Derives `--sfx-circuit-opacity` via the literal `0.05 * (1 - i)` monotonic-inverse curve. Comment line 43 reads explicitly: `"Circuit: INVERSE of intensity — visible at low, fades at high (mutually exclusive with grain)"`. At `i=0`: circuit=0.05, grain=0.03; at `i=1`: circuit=0, grain≈0.08. Mutually exclusive at high intensity per spec wording. Third SIG-02 carry-forward beneficiary after VHS-01 + HLF-02 — predicted by Phase 51's carry-forward intel. |
| CIR-03 | `components/layout/global-effects.tsx:46` (writer) + `app/globals.css:1281` (reader) + `global-effects.tsx:264-298` (`SignalIntensityBridge` `MutationObserver`) | Real-time updates verified end-to-end. Writer: `updateSignalDerivedProps()` writes `--sfx-circuit-opacity` from intensity-derived value. Reader: CSS reads `var(--sfx-circuit-opacity, 0.03)`. Observer: `SignalIntensityBridge` `MutationObserver` re-runs `syncDerivedProps()` on every `<html>` `style` mutation (set by `signal-overlay.tsx` slider + per-section writers like `proof-section.tsx:68/130/140` + `signal-section.tsx:51`). Same observer mechanism that satisfied VHS-01 + HLF-02 in real-time. |

REQUIREMENTS.md body status lines (287-290) updated to `[x]` with literal `RATIFIED 2026-04-25` annotations + file:line citations. Traceability matrix rows 375-377 updated.

**Bookkeeping** (single ROADMAP.md commit `16d3759`):
- Line 786 corrected: `- [ ] 44-01-PLAN.md — Fix all copy across 6 source files...` → `- [x] 52-01-PLAN.md — Circuit overlay clean ratification (3/3)`. Checkbox ticked because the plan IS complete by the time it commits.
- Phases 53, 54, 55, 56 still carry the same stale `44-01-PLAN.md` reference (5 remaining occurrences). Deliberately preserved.

## Verification

| Check | Outcome |
|-------|---------|
| `grep -c "^- \[x\] \*\*CIR-0[1-3]\*\*" .planning/REQUIREMENTS.md` returns 3 | PASS |
| CIR-01 body line contains `RATIFIED 2026-04-25` + cites `globals.css:1268-1283` + 3 consumer file:lines | PASS |
| CIR-02 body line contains `RATIFIED 2026-04-25` + cites `global-effects.tsx:43-46` + monotonic-inverse curve rationale | PASS |
| CIR-03 body line contains `RATIFIED 2026-04-25` + cites writer + reader + observer chain | PASS |
| Matrix rows `\| CIR-0[1,2,3] \| Phase 52 \| Ratified \|` exist (3 rows) | PASS |
| Zero matrix rows match `^\| CIR-0[1-3] \| Phase 52 \| Pending \|` | PASS |
| `RATIFIED 2026-04-25` count in REQUIREMENTS.md = 19 (was 16 after Phase 51; +3 CIR) | PASS |
| `OBSOLETE 2026-04-25` count in REQUIREMENTS.md = 8 (unchanged — clean phase) | PASS |
| ROADMAP.md Phase 52 plan ref reads `52-01-PLAN.md — Circuit overlay clean ratification (3/3)` | PASS |
| ROADMAP.md Phase 52 plan checkbox is `[x]` | PASS |
| Phase 53 entry STILL contains `44-01-PLAN.md` (out of scope, must remain) | PASS |
| `52-01-PLAN.md` occurrence count in ROADMAP.md = 1 | PASS |
| `44-01-PLAN.md` occurrence count decremented from 6 → 5 | PASS |
| Zero source code (`app/`, `components/`, `lib/`, `hooks/`, `package.json`) changes | PASS |

All 2 task acceptance criteria met. No regression in adjacent matrix rows (SIG-* / GRN-* / VHS-* / DTM-* / HLF-* still Ratified/Obsolete/Complete from Phases 48-51; MSH-/PTL-/GLT-/SYM-/VRG-03/PRF- untouched).

## Notes

**Second clean all-ratified phase on this branch.** Phase 47 had 1 Complete + 2 Ratified + 1 Obsolete; Phase 48 had 6/6 Ratified (the first clean case); Phase 49 had 1 Ratified + 4 Obsolete; Phase 50 had 4 Ratified + 2 Obsolete; Phase 51 had 3 Ratified + 1 Obsolete. Phase 52 joins Phase 48 as the only fully-Ratified phases. The mixed-verdict streak (47 → 49 → 50 → 51) ends here because the CIR-* requirement set contains no process-gate clauses — no "human visual review" / "before grain changes" / "combined-view" wording. Predictability tightens: requirement sets without process gates ratify cleanly when shipped reality matches spec; requirement sets with process gates produce predictable Obsolete annotations. Future phases: MSH-* (Phase 53) — needs check; PTL-* (Phase 54) — needs check; GLT-* (Phase 55) — needs check; SYM-* (Phase 56) — needs check.

**CIR-02 as third SIG-02 carry-forward beneficiary.** Phase 48's `global-effects.tsx:39-57` derivation block ratified the entire intensity-bridge mechanism. VHS-01 was the first beneficiary; HLF-02 was the second; CIR-02 is the third. The carry-forward intel was correct: CIR-02 was effectively pre-ratified the moment SIG-02 ratified. The remaining derived properties in the block (`--sfx-fx-particle-opacity` line 57, `--sfx-fx-glitch-rate` line 56) will likely pre-satisfy parts of PTL-* and GLT-* in Phases 54 + 55.

**CIR-02 curve direction confirmed inverse.** Phase 51's handoff predicted CIR-02 might need a "curve direction" annotation if the curve grew monotonically (like halftone). Reality: the curve is `0.05 * (1 - i)` — explicit inverse with a comment that calls out "INVERSE of intensity" and "mutually exclusive with grain". At intensity 0 circuit reads 0.05 (visible) while grain reads 0.03 baseline (subtle); at intensity 1 circuit reads 0 (invisible) while grain reads ~0.08 (logarithmic ceiling). The two effects are anti-correlated by construction. Clean ratify, no annotation needed.

**No technique-divergence annotation needed.** Phase 51's HLF-01 introduced the "outcome met, technique simplified" ratification rationale. Phase 52 does not need it: `mix-blend-mode: soft-light` on a low-contrast SVG circuit pattern is the natural choice for section-background insertion, and the spec doesn't dictate a specific compositing mode for circuit. Outcome and technique both match.

**Sixth ratification in the v1.7 audit campaign.** Phase 47 (commits `709e8e9` / `e1dcf8f` / `fa7e70f` / `0ff2e38`) → Phase 48 (`b0d7a51` / `99e83d6` / `40895ad`) → Phase 49 (`efe6aad` / `c2294c1` / `a3e1eee`) → Phase 50 (`5b2e0e5` / `cff3923` / `b856405`) → Phase 51 (`9f36b66` / `9fd9f85` / `a8e5a52`) → Phase 52 (`f289e91` / `16d3759` / this commit). Pattern locked: REQUIREMENTS first, ROADMAP second, PLAN+SUMMARY third.

**Carry-forward intel for Phase 53 (Mesh Gradient) audit.** The next phase's ratification should grep for `signal-mesh`, `proof-shader`, and `mesh` in `components/animation/` + `app/globals.css`. MSH-01's "layered radial-gradient() with OKLCH colors at z:-1" wording suggests CSS-only or canvas-rendered mesh; check both paths. MSH-02's "grain composited on top" is verifiable by z-index inspection. MSH-03's "60s+ cycle drift animation" needs an animation duration check. The Mesh Gradient set has no process-gate language either, so Phase 53 has a high probability of being the third clean all-ratified phase. Per Phase 51's carry-forward intel, `signal-mesh.tsx:72` already references `--sfx-signal-intensity` raw — likely the MSH-* equivalent of the SIG-02 chain.

**Stale doc-comment cleanup carry-forward (still deferred).** Phase 49 flagged `global-effects.tsx:165-186, 201` as `IdleOverlay` JSDoc residue from `a260238`. Phases 50, 51, 52 audits did not touch those lines (CIR-02/03's grep targets hit `global-effects.tsx:43-46` and `:264-298`, both well outside the JSDoc residue block). Carry forward to whichever future phase happens to touch the lower portion of `global-effects.tsx`.
