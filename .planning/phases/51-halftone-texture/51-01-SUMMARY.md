---
phase: 51-halftone-texture
plan: 01
status: complete
completed: "2026-04-25"
commit: "9fd9f85"
---

# Summary — Phase 51 Plan 01: Halftone ratification + moiré-review obsolescence closure

## What was done

Four Phase 51 requirements (HLF-01..04) audited against shipped code. Verdict split 3-Ratified / 1-Obsolete. The `.sf-halftone` overlay layer ships at `app/globals.css:1252-1266` with the intensity-gated derivation living at `components/layout/global-effects.tsx:40-41` and four token-specimen consumers wired in `components/blocks/token-specimens/`. HLF-01 introduces the first technique-divergence ratification on this branch: shipped code uses `mix-blend-mode: multiply` instead of the spec's `background-blend-mode` + `filter: contrast()` — both substituted techniques are functionally redundant on a single 1px-circle dot layer, and the simpler form skips a GPU `filter` pass. HLF-02 ratifies cleanly because the literal `i < 0.4 ? 0 : (i - 0.4) / 0.6 * 0.15` curve at `global-effects.tsx:40-41` exactly matches the spec wording — pre-satisfied at the wiring level by Phase 48's SIG-02 carry-forward. HLF-03 ratifies via grep-confirmed scoping: only 4 token-specimen blocks consume the `.sf-halftone` ambient class, and `hero.tsx:21`'s use of the dot token is an inline non-ambient counter-example, not a leak. HLF-04's combined-view human visual review process gate is OBSOLETE for the same retroactive-temporal-impossibility reason as VHS-06 / GRN-04 / VRG-02. Zero source-code mutations — pure documentation reconciliation per `feedback_ratify_reality_bias.md` and `project_overdue_lockin_mode.md`.

## Changes made

**HLF-01 / HLF-02 / HLF-03 — Ratified** (single REQUIREMENTS.md commit `9f36b66`):

| Req | Citation | What's there |
|-----|----------|--------------|
| HLF-01 | `app/globals.css:1252-1266` | `.sf-halftone::before` ships CSS-only halftone via `radial-gradient(circle, var(--sfx-halftone-dot) 1px, transparent 1px)` at a 4×4px tile, gated by `opacity: var(--sfx-halftone-opacity, 0)` (the SIG-02 ratified derived property). Compositing uses `mix-blend-mode: multiply` (single-layer overlay) instead of the spec's `background-blend-mode` + `filter: contrast()`. Both alternative techniques would be redundant given the single dot layer and already-crisp 1px circle edges; simpler form avoids a GPU filter pass. Outcome (CSS-only halftone dot pattern with intensity-gated opacity) met; technique simplified. Original feat commit `913fcb1`. |
| HLF-02 | `components/layout/global-effects.tsx:40-41` | Derives `--sfx-halftone-opacity` via literal `i < 0.4 ? 0 : (i - 0.4) / 0.6 * 0.15` curve, snapping to zero below the 0.4 threshold and ramping linearly across 0.4–1.0 to a 0.15 ceiling. Exact match to spec wording. Pre-satisfied at consumer wiring level by Phase 48's SIG-02. |
| HLF-03 | `components/blocks/token-specimens/{spacing,motion,color,type}-specimen.tsx` (4 consumers) | The `.sf-halftone` ambient-overlay class is consumed only by 4 token-specimen blocks: `spacing-specimen.tsx:18`, `motion-specimen.tsx:49`, `color-specimen.tsx:112`, `type-specimen.tsx:27` — each tagged with `data-halftone`. `hero.tsx:21` uses `--sfx-halftone-dot` token in an inline radial-gradient but does NOT apply the ambient class. Zero global / ambient overlay leakage. Confirmed by `grep -rn "sf-halftone" components/ app/` returning only the 4 specimens + the CSS rule definitions + a single print-suppression entry at `app/globals.css:2339`. |

**HLF-04 — Obsolete** (same `9f36b66` commit):

| Req | Verdict | Supersedence chain |
|-----|---------|-------------------|
| HLF-04 | OBSOLETE | Combined-view human visual review process gate cannot be satisfied retroactively. `git log --all --grep "halftone.*review\|coherence.*halftone\|moir" -i` returns zero process-gate matches against shipping history (the 4 hits are unrelated cdB / primitives / feat-51 commits, not coherence reviews). Same retroactive-temporal-impossibility precedent as VHS-06 / GRN-04 / VRG-02. Forward-looking visual baseline capture remains available via VRG-01's ratified Chromatic infrastructure. |

REQUIREMENTS.md body status lines (282-285) updated to `[x]` with literal `RATIFIED 2026-04-25` (HLF-01/02/03) or `OBSOLETE 2026-04-25` (HLF-04) annotations + file:line + commit-hash citations. Traceability matrix rows 371-374 updated.

**Bookkeeping** (single ROADMAP.md commit `9fd9f85`):
- Line 774 corrected: `- [ ] 44-01-PLAN.md — Fix all copy across 6 source files` → `- [x] 51-01-PLAN.md — Halftone ratification + moiré-review obsolescence closure`. Checkbox ticked because the plan IS complete by the time it commits.
- Phases 52, 53, 54, 55, 56 still carry the same stale `44-01-PLAN.md` reference (6 remaining occurrences). Deliberately preserved.

## Verification

| Check | Outcome |
|-------|---------|
| `grep -c "^- \[x\] \*\*HLF-0[1-4]\*\*" .planning/REQUIREMENTS.md` returns 4 | PASS |
| HLF-01 body line contains `RATIFIED 2026-04-25` + cites `globals.css:1252-1266` + technique-divergence annotation | PASS |
| HLF-02 body line contains `RATIFIED 2026-04-25` + cites `global-effects.tsx:40-41` | PASS |
| HLF-03 body line contains `RATIFIED 2026-04-25` + cites all 4 specimen consumers | PASS |
| HLF-04 body line contains `OBSOLETE 2026-04-25` + retroactive-temporal-impossibility rationale | PASS |
| Matrix rows `\| HLF-0[1,2,3] \| Phase 51 \| Ratified \|` exist (3 rows) | PASS |
| Matrix row `\| HLF-04 \| Phase 51 \| Obsolete \|` exists | PASS |
| Zero matrix rows match `^\| HLF-0[1-4] \| Phase 51 \| Pending \|` | PASS |
| `RATIFIED 2026-04-25` count in REQUIREMENTS.md = 16 (was 13 after Phase 50; +3 HLF) | PASS |
| `OBSOLETE 2026-04-25` count in REQUIREMENTS.md = 8 (was 7 after Phase 50; +1 HLF) | PASS |
| ROADMAP.md Phase 51 plan ref reads `51-01-PLAN.md — Halftone ratification + moiré-review obsolescence closure` | PASS |
| ROADMAP.md Phase 51 plan checkbox is `[x]` | PASS |
| Phase 52 entry STILL contains `44-01-PLAN.md` (out of scope, must remain) | PASS |
| `51-01-PLAN.md` occurrence count in ROADMAP.md = 1 | PASS |
| `44-01-PLAN.md` occurrence count decremented from 7 → 6 | PASS |
| Zero source code (`app/`, `components/`, `lib/`, `hooks/`, `package.json`) changes | PASS |

All 2 task acceptance criteria met. No regression in adjacent matrix rows (SIG-* / GRN-* / VHS-* / DTM-* still Ratified/Obsolete/Complete from Phases 48-50.1; CIR-/MSH-/PTL-/GLT-/SYM-/VRG-03/PRF- untouched).

## Notes

**First technique-divergence ratification on this branch.** Phase 47 had 1 Complete + 2 Ratified + 1 Obsolete (rounding fixes); Phase 48 had 6/6 Ratified (clean spec match); Phase 49 had 1 Ratified + 4 Obsolete (cut consumer); Phase 50 had 4 Ratified + 2 Obsolete (mix of clean ratify + cut activator + process gate). Phase 51 is the first to invoke "outcome met, technique simplified" as the ratification rationale (HLF-01). The shipped `mix-blend-mode: multiply` is genuinely simpler and more performant than the spec's `background-blend-mode` + `filter: contrast()` for a single dot layer, and the dots are crisp without a contrast filter. Future audits should expect more of these as the v1.7 surface area expands — particularly for CIR-*, MSH-*, and PTL-*, where shipped reality may have collapsed multiple spec'd techniques into single-pass equivalents.

**HLF-02 as second SIG-02 carry-forward beneficiary.** Phase 48's `global-effects.tsx:39-57` derivation block ratified the entire intensity-bridge mechanism. VHS-01 was the first beneficiary (`--sfx-vhs-chromatic-opacity` derived in Phase 50 from `--sfx-vhs-scanline-opacity`); HLF-02 is the second (`--sfx-halftone-opacity` lives in the same block, line 40-41). The carry-forward intel was correct: HLF-02 was effectively pre-ratified the moment SIG-02 ratified. Same prediction stands for `--sfx-circuit-opacity` (lines 45-46) ratifying CIR-03 in Phase 52, `--sfx-fx-particle-opacity` ratifying part of PTL-* in Phase 54, and `--sfx-fx-glitch-rate` ratifying part of GLT-* in Phase 55.

**HLF-03's hero.tsx counter-example as scoping discipline anchor.** `components/blocks/hero.tsx:21` is the cleanest evidence that the `.sf-halftone` *class* and the `--sfx-halftone-dot` *token* are independently consumable — the hero uses the token without the class, which is exactly what HLF-03's "no ambient overlay" guarantee permits. This reinforces the project's `--sf-*` / `--sfx-*` prefix-split discipline (per `project_token_prefix_split.md`): tokens are reusable across surfaces; ambient classes are scoped to specific surfaces.

**Mixed-verdict pattern continues.** Phase 47 (4 reqs, 1 Complete + 2 Ratified + 1 Obsolete) → Phase 48 (6 reqs, 6/6 Ratified) → Phase 49 (5 reqs, 1 Ratified + 4 Obsolete) → Phase 50 (6 reqs, 4 Ratified + 2 Obsolete) → Phase 51 (4 reqs, 3 Ratified + 1 Obsolete). Phase 48 remains the atypical clean case. Phases 50.1, 52, 53, 54, 55, 56 remain. Phase 50.1 (Datamosh) is already 4/4 Complete in the matrix per ROADMAP — likely needs only the plan-ref fix and a one-line audit for completeness.

**Carry-forward intel for Phase 52 (Circuit Overlay) audit.** The next phase's ratification should grep for `--sfx-circuit-opacity` (already derived in `global-effects.tsx:45-46` per Phase 48's SIG-02 carry-forward intel) and search `app/globals.css` for circuit-related rules. The SVG circuit pattern ships at `app/globals.css:1268-1283` (visible in this session's grep output, immediately following the halftone block), and `mix-blend-mode: soft-light` is the compositing technique — same shipped-vs-spec divergence pattern as HLF-01 may apply to CIR-01. Predicted verdict: CIR-01/02/03 RATIFY; no obvious process gate in the requirement set, so possibly a clean 3/3 like Phase 48.

**Stale doc-comment cleanup carry-forward (still deferred).** Phase 49 flagged `global-effects.tsx:165-186, 201` as `IdleOverlay` JSDoc residue from `a260238`. Phase 50's audit did not touch those lines; Phase 51 also did not need to (HLF-02's grep target hit `global-effects.tsx:40-41`, well above the JSDoc residue block). Carry forward to whichever future phase happens to touch the lower portion of `global-effects.tsx`.

**Fifth ratification in the v1.7 audit campaign.** Phase 47 (commits `709e8e9` / `e1dcf8f` / `fa7e70f` / `0ff2e38`) → Phase 48 (`b0d7a51` / `99e83d6` / `40895ad`) → Phase 49 (`efe6aad` / `c2294c1` / `a3e1eee`) → Phase 50 (`5b2e0e5` / `cff3923` / `b856405`) → Phase 51 (`9f36b66` / `9fd9f85` / this commit). Pattern locked.
