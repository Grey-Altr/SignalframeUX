---
phase: 48-intensity-bridge
plan: 01
status: complete
completed: "2026-04-25"
commit: "99e83d6"
---

# Summary — Phase 48 Plan 01: Intensity bridge + Chromatic ratification

## What was done

All six Phase 48 requirements (SIG-01..05 + VRG-01) ratified against shipped code with zero source-code changes. The intensity bridge — the architectural prerequisite for every effect phase 49–55 — was already shipped in `components/layout/global-effects.tsx` with full body deriving 12 CSS custom properties from `--sfx-signal-intensity`. The CSS attribute selectors for per-section intensity overrides were already shipped in `app/globals.css`. Chromatic was already installed and `pnpm build-storybook` passes clean. This plan converts implicit code state into explicit, traceable spec compliance per `feedback_ratify_reality_bias.md` and the v1.7 ratification campaign defined in `.handoffs/v1.7-ratification.md`.

## Changes made

**SIG-01..05 + VRG-01 — Ratified** (single REQUIREMENTS.md commit):

| Req | Citation | What's there |
|-----|----------|--------------|
| SIG-01 | `components/layout/global-effects.tsx:23` | `export function updateSignalDerivedProps(intensity: number)` with full body |
| SIG-02 | `global-effects.tsx:29` + `:32` | Scanline `0.005 + i * 0.015` (linear) and noise `0.0025 + i * 0.0075` (linear) — both intensity-derived, no longer hardcoded at 0.2 / 0.015 |
| SIG-03 | `global-effects.tsx:36` | Grain opacity `0.03 + 0.05 * Math.log10(1 + i * 9)` — logarithmic perceptual curve |
| SIG-04 | `app/globals.css:2269-2271` | `[data-signal-intensity="low\|med\|high"]` attribute selectors set `--sfx-signal-intensity` to 0.2 / 0.5 / 0.8 |
| SIG-05 | `global-effects.tsx:24-25` | `const i = prefersReduced ? 0 : intensity` — collapses all derived values to 0 when `prefers-reduced-motion: reduce` |
| VRG-01 | `package.json:73, 125, 142` | `chromatic ^16.2.0`, `@chromatic-com/storybook ^5.1.1`, `chromatic --exit-zero-on-changes` script. `pnpm build-storybook` exits clean (verified pre-plan). |

REQUIREMENTS.md body status lines updated to `[x]` with literal `RATIFIED 2026-04-25` annotation; traceability matrix rows 352-356 + 391 updated from `Pending` to `Ratified`.

**Bookkeeping** (single ROADMAP.md commit):
- Line 716 corrected: `- [ ] 44-01-PLAN.md — Fix all copy across 6 source files` → `- [x] 48-01-PLAN.md — Intensity bridge + Chromatic ratification`. Checkbox ticked because the plan IS complete by the time it commits — the ratification IS the work.
- Phases 49, 50, 52, 53, 54, 55, 56 still carry the same stale `44-01-PLAN.md` reference (8 remaining occurrences). Deliberately preserved — each future ratification commit fixes its own line.

## Verification

| Check | Outcome |
|-------|---------|
| `grep -c "^- \[x\] \*\*SIG-0[1-5]\*\*" .planning/REQUIREMENTS.md` returns 5 | PASS |
| `grep -c "^- \[x\] \*\*VRG-01\*\*" .planning/REQUIREMENTS.md` returns 1 | PASS |
| 6 ratified body lines all contain literal `RATIFIED 2026-04-25` | PASS |
| Matrix rows `\| SIG-0[1-5] \| Phase 48 \| Ratified \|` exist (5 rows) | PASS |
| Matrix row `\| VRG-01 \| Phase 48 \| Ratified \|` exists | PASS |
| Zero matrix rows match `^\| (SIG-0[1-5]\|VRG-01) \| Phase 48 \| Pending \|` | PASS |
| ROADMAP.md Phase 48 plan ref reads `48-01-PLAN.md — Intensity bridge + Chromatic ratification` | PASS |
| ROADMAP.md Phase 48 plan checkbox is `[x]` | PASS |
| Phase 49 entry STILL contains `44-01-PLAN.md` (out of scope, must remain) | PASS |
| `48-01-PLAN.md` occurrence count in ROADMAP.md = 1 | PASS |
| `44-01-PLAN.md` occurrence count decremented from 10 → 9 | PASS |
| `pnpm build-storybook` exits clean (VRG-01 gate) | PASS (pre-plan) |
| Zero source code (`app/`, `components/`, `lib/`, `package.json`) changes | PASS |

All 2 task acceptance criteria met. No regression in adjacent matrix rows (GRN-*, VHS-*, HLF-*, CIR-*, MSH-*, PTL-*, GLT-*, SYM-*, VRG-02, VRG-03, PRF-* untouched).

## Notes

**Pre-plan Storybook verification.** VRG-01 was the one requirement the handoff explicitly flagged as needing live proof beyond a `package.json` grep — *"Verify pnpm storybook builds clean before final ratification."* Run before plan was written; build completed in ~3.3s with the expected chunk-size warning on `iframe-P5NLyvdB.js` (vendor bundle, not actionable for this phase). Ratification gated on this passing — had it failed, VRG-01 would have stayed `Pending` and become a real follow-up gap.

**Bonus surfaces in `global-effects.tsx:39-57`.** The `updateSignalDerivedProps` body derives more than the 5 properties Phase 48 strictly required. It also writes:
- `--sfx-halftone-opacity` — gated zero below 0.4 intensity, ramps 0→0.15 (pre-satisfies HLF-* parts)
- `--sfx-circuit-opacity` — INVERSE of intensity, `0.05 * (1 - i)` (pre-satisfies CIR-* parts)
- `--sfx-fx-feedback-decay`, `--sfx-fx-displace-gain`, `--sfx-fx-bloom-intensity`, `--sfx-fx-glitch-rate`, `--sfx-fx-particle-opacity` — all tier-scaled via `getQualityTier()` per `feedback_consume_quality_tier.md`

These bonus surfaces likely pre-satisfy parts of Phases 51 (halftone), 52 (circuit), 54 (particles), and 55 (glitch). Ratification of those phases will need to grep against `global-effects.tsx:39-57` in addition to each phase's own consumer files.

**Second ratification in the v1.7 audit campaign.** Phase 47 was the first (commits `709e8e9` / `e1dcf8f` / `fa7e70f` / `0ff2e38`, completed 2026-04-25 earlier today). Phase 48 follows the same lean pattern — single PLAN.md, single SUMMARY.md, atomic commits per artifact, no Playwright/test additions. Phases 49–56 remain to be audited in this same `chore/v1.7-ratification` branch.

**Note on ROADMAP.md line 505.** The milestone-level summary line `- [x] **Phase 48: ... (completed 2026-04-11, 1/1 plans)` already showed Phase 48 as complete with a date that pre-dates this plan file's existence. That marker reflects when the *code* shipped — not when the *traceability* shipped. The plan-list checkbox at line 716 (now `[x] 48-01-PLAN.md`) is what closes the documentation loop.
