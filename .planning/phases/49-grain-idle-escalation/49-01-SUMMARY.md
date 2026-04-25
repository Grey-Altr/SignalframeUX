---
phase: 49-grain-idle-escalation
plan: 01
status: complete
completed: "2026-04-25"
commit: "c2294c1"
---

# Summary — Phase 49 Plan 01: Grain ratification + idle escalation closure

## What was done

Five Phase 49 requirements (GRN-01..04 + VRG-02) audited against shipped code. Verdict split 1-Ratified / 4-Obsolete. GRN-01 ratifies trivially against the same `components/layout/global-effects.tsx:36` line that already ratified SIG-03 — at i=0 the curve `0.03 + 0.05 * Math.log10(1 + i * 9)` evaluates to 0.03, within the 0.03–0.05 spec floor. GRN-02 and GRN-03 are OBSOLETE because the consumer (`IdleOverlay` with 8s/20s/45s thresholds + relative scanline boost) shipped in commit `40e2f0d` was deliberately deleted in commit `a260238` ("fix(cleanup): remove heavy SIGNAL effects from GlobalEffects render for performance gate") to clear the PRF-02 Lighthouse Performance launch gate. The `useIdleEscalation` hook itself persists at `hooks/use-idle-escalation.ts:28` as library-only / dead code with zero consumers across the source tree. GRN-04 and VRG-02 are OBSOLETE because they're temporal gates ("baselines captured BEFORE grain changes") that cannot be satisfied retroactively for grain code that has already shipped. Forward-looking baseline capture remains available via VRG-01's ratified Chromatic infrastructure. Zero source-code mutations — pure documentation reconciliation per `feedback_ratify_reality_bias.md` and `project_overdue_lockin_mode.md`.

## Changes made

**GRN-01 — Ratified** (single REQUIREMENTS.md commit `efe6aad`):

| Req | Citation | What's there |
|-----|----------|--------------|
| GRN-01 | `components/layout/global-effects.tsx:36` | `const grainOpacity = 0.03 + 0.05 * Math.log10(1 + i * 9);` — same line that ratified SIG-03; baseline at i=0 = 0.03 (within 0.03–0.05 spec); curve provides "dynamic escalation via SIG-03 curve" |

**GRN-02..04 + VRG-02 — Obsolete** (same `efe6aad` commit):

| Req | Verdict | Supersedence chain |
|-----|---------|-------------------|
| GRN-02 | OBSOLETE | Hook shipped: `hooks/use-idle-escalation.ts:28` (commit `40e2f0d feat(49): useIdleEscalation hook + 3-phase idle system`). Consumer (`IdleOverlay`) shipped in same commit but DELETED by commit `a260238 fix(cleanup): remove heavy SIGNAL effects from GlobalEffects render for performance gate`. Performance launch gate (PRF-02) supersedes idle-escalation animation. |
| GRN-03 | OBSOLETE | Relative-offset pattern (`+0.03` scanline delta) was implemented in the deleted `IdleOverlay` consumer. Pattern persists in `40e2f0d`'s diff as encoded intent for future re-wiring; same supersedence as GRN-02. |
| GRN-04 | OBSOLETE | Temporal gate: grain code (`global-effects.tsx:36`) predates Chromatic wiring (commits `54db119` + `abe0cfd`). Forward-looking baseline capture covered by VRG-01's ratified Chromatic infrastructure. |
| VRG-02 | OBSOLETE | Same temporal-gate impossibility as GRN-04, scoped at the visual-regression family. |

REQUIREMENTS.md body status lines (268-271, 321) updated to `[x]` with literal `RATIFIED 2026-04-25` (GRN-01) or `OBSOLETE 2026-04-25` (GRN-02..04, VRG-02) annotations + file:line + commit-hash citations. Traceability matrix rows 357-360 + 392 updated.

**Bookkeeping** (single ROADMAP.md commit `c2294c1`):
- Line 730 corrected: `- [ ] 44-01-PLAN.md — Fix all copy across 6 source files` → `- [x] 49-01-PLAN.md — Grain ratification + idle escalation closure`. Checkbox ticked because the plan IS complete by the time it commits — the ratification IS the work.
- Phases 50, 52, 53, 54, 55, 56 still carry the same stale `44-01-PLAN.md` reference (8 remaining occurrences). Deliberately preserved — each future ratification commit fixes its own line.

## Verification

| Check | Outcome |
|-------|---------|
| `grep -c "^- \[x\] \*\*GRN-0[1-4]\*\*" .planning/REQUIREMENTS.md` returns 4 | PASS |
| `grep -c "^- \[x\] \*\*VRG-02\*\*" .planning/REQUIREMENTS.md` returns 1 | PASS |
| GRN-01 body line contains `RATIFIED 2026-04-25` + cites `global-effects.tsx:36` | PASS |
| GRN-02..04 + VRG-02 body lines contain `OBSOLETE 2026-04-25` (count = 5 in file) | PASS |
| GRN-02 cites `hooks/use-idle-escalation.ts:28` + commit `a260238` | PASS |
| GRN-03 cites commits `40e2f0d` + `a260238` | PASS |
| Matrix row `\| GRN-01 \| Phase 49 \| Ratified \|` exists | PASS |
| Matrix rows `\| GRN-0[2-4] \| Phase 49 \| Obsolete \|` exist (3 rows) | PASS |
| Matrix row `\| VRG-02 \| Phase 49 \| Obsolete \|` exists | PASS |
| Zero matrix rows match `^\| (GRN-0[1-4]\|VRG-02) \| Phase 49 \| Pending \|` | PASS |
| ROADMAP.md Phase 49 plan ref reads `49-01-PLAN.md — Grain ratification + idle escalation closure` | PASS |
| ROADMAP.md Phase 49 plan checkbox is `[x]` | PASS |
| Phase 50 entry STILL contains `44-01-PLAN.md` (out of scope, must remain) | PASS |
| `49-01-PLAN.md` occurrence count in ROADMAP.md = 1 | PASS |
| `44-01-PLAN.md` occurrence count decremented from 9 → 8 | PASS |
| Zero source code (`app/`, `components/`, `lib/`, `hooks/`, `package.json`) changes | PASS |

All 2 task acceptance criteria met. No regression in adjacent matrix rows (SIG-* still Ratified Phase 48, VHS-/HLF-/CIR-/MSH-/PTL-/GLT-/SYM-/VRG-03/PRF- untouched).

## Notes

**The `40e2f0d` → `a260238` arc as canonical "feature lost to launch gate" precedent.** Phase 49's idle escalation is the cleanest example in v1.7 of a feature shipping intentionally and then being cut six commits later for a higher-priority gate. The ratify-reality response is OBSOLETE-with-rationale, not Pending — the team's actual decision (PRF-02 over GRN-02/03) is encoded in commit history and should be reflected in spec. Future v1.7 ratifications that find similar arcs should follow this template: hook/library code can stay Ratified if it's still useful surface area, but consumer-removal cuts the requirement off at OBSOLETE with the cleanup commit hash as the citation.

**`useIdleEscalation` is library-only / dead code right now.** `grep -rn "useIdleEscalation" components/ app/ stories/` returns ONLY the hook definition. If a future phase wants to re-introduce idle escalation, the wiring blueprint is preserved at `40e2f0d`'s diff (8s grain drift, 20s scanline emphasis with `+0.03` relative offset, 45s glitch burst with auto-reset, all suppressed under prefers-reduced-motion). The hook signature `useIdleEscalation(thresholds: IdleThreshold[]): number` is the right level of abstraction; the consumer was the part that exceeded the perf budget.

**Stale doc-comment residue at `global-effects.tsx:165-186, 201`.** The JSDoc block describing "Idle standby overlay — 3-phase escalation via useIdleEscalation hook" survives the `a260238` cleanup as comment-only debris (no live code beneath it). The reference to "via IdleOverlay's resetIdle" at line 201 is similarly stranded. Out of scope for this phase's ratification (no source-code changes); flag for Phase 50 (VHS) audit or a future doc-comment cleanup pass.

**Pattern precedent confirmed.** Phase 47 split 1-Complete / 2-Ratified / 1-Obsolete; Phase 49 splits 1-Ratified / 4-Obsolete. Phase 48 (6/6 Ratified) was the atypical clean case. Mixed-verdict ratification IS the v1.7 audit norm — the campaign exists because reality drifted from spec, and Obsolete-with-rationale is how that drift gets honestly closed without re-implementing what was deliberately cut.

**Carry-forward intel for Phase 50 (VHS) audit.** The next phase's ratification should grep `components/animation/vhs-overlay.tsx` for the VHS-01..06 requirements (chromatic aberration, jitter, dropout bands, vignette, Safari backdrop-filter literal values). Recent commits `93fa031 feat(50): VHS enhancement` + `f836830 Fix(vhs): reduce VHS layer opacity by 50%` + `05f22ab Fix(vhs): reduce VHS layer opacity by another 50%` + `752075e Fix: halve chromatic aberration opacity at viewport top/bottom edges` indicate VHS code is alive and tuned. Bonus surfaces in `global-effects.tsx:39-57` already derive `--sfx-vhs-scanline-opacity` and `--sfx-vhs-noise-opacity` (ratified in Phase 48 as SIG-02), so VHS-01's "scaled by derived intensity property" requirement is pre-satisfied at the consumer wiring level.

**Third ratification in the v1.7 audit campaign.** Phase 47 (4 reqs, 1 Complete + 2 Ratified + 1 Obsolete, commits `709e8e9` / `e1dcf8f` / `fa7e70f` / `0ff2e38`) → Phase 48 (6 reqs, 6/6 Ratified, commits `b0d7a51` / `99e83d6` / `40895ad`) → Phase 49 (5 reqs, 1 Ratified + 4 Obsolete, commits `efe6aad` / `c2294c1` / this commit). Pattern locked. Phases 50, 50.1, 51, 52, 53, 54, 55, 56 remain. Phase 50.1 (Datamosh) is already 4/4 Complete in the matrix per ROADMAP — likely just needs the plan-ref fix and a one-line audit for completeness.
