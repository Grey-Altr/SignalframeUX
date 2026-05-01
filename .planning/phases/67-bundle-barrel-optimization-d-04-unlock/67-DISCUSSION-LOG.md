# Phase 67: Bundle Barrel-Optimization (D-04 Unlock) — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in 67-CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-30
**Phase:** 67-bundle-barrel-optimization-d-04-unlock
**Mode:** `--auto` (single-pass, recommended-default selection)
**Areas discussed:** Reshape strategy, Re-lock baseline mechanism, path_k retire-vs-replace, Plan structure, AES-04 cadence, Stale-chunk guard cadence, Phase 66 sequencing

---

## Reshape strategy / attack-surface priority

| Option | Description | Selected |
|--------|-------------|----------|
| A. Single-vector: `@/components/sf` to `optimizePackageImports` only | Cheapest, biggest-named-payoff (Phase 63.1 explicitly identified this as blocked-only-by-D-04). Lowest risk surface. | |
| B. Three-vector tiered (recommended) | (1) `@/components/sf` to `optimizePackageImports` → (2) GSAP ScrollSmoother dynamic-import → (3) TooltipProvider re-tree. All three named in `_path_k_decision` review_gate (a)/(b)/(c). | ✓ |
| C. All-of-above + framework chunk reshape | Adds framework-floor reshape (chunks 2979/React/Next runtime). High risk; out of v1.9 scope unless escalated. | |

**Selected:** B — three-vector tiered, audit-first per vector with 2 KB gzip reduction floor.
**Rationale (auto):** The `_path_k_decision` review_gate clauses literally name these three vectors as the unlock targets. Single-vector (A) leaves measurable headroom on the table; framework reshape (C) is explicitly deferred to a future phase per `project_phase70_closed.md` VRF-08 path_b decision.

---

## Re-lock baseline mechanism

| Option | Description | Selected |
|--------|-------------|----------|
| A. Markdown freeze in `v1.9-bundle-reshape.md` (recommended) | Successor doc to `v1.8-lcp-diagnosis.md`; chunk-ID table + delta column + method note. Matches BND-05/07 spec language. | ✓ |
| B. Markdown freeze + automated chunk-ID equality test | Adds programmatic guard. Over-couples to webpack benign reshuffles; rejected per D-05. | |
| C. Manual snapshot only (no doc) | Loses audit trail; violates BND-05 doc-trail requirement. | |

**Selected:** A — markdown freeze pattern from v1.7→v1.8 precedent.
**Rationale (auto):** B's downside (false-trip on benign reshuffle) outweighs its protection value at this phase scope.

---

## path_k retirement vs replacement

| Option | Description | Selected |
|--------|-------------|----------|
| A. Retire only at strict ≤200 KB | Binary; if 201 KB land, full path_k stays. Wastes near-misses. | |
| B. Outcome ladder (recommended) | ≤200 KB → retire; 201–220 → replace with new tighter band as `_path_q_decision`; >220 → escalate, do not loosen. | ✓ |
| C. Retire regardless | Removes safety; could ship a regression if bundle inflates between Plan 01 and Plan 02. | |

**Selected:** B — outcome ladder.
**Rationale (auto):** Matches BND-07 spec ("retired or replaced") + preserves CLAUDE.md hard 200 KB target as the ratchet ceiling. Hard escalate at >220 KB prevents path_k drift.

---

## Plan structure

| Option | Description | Selected |
|--------|-------------|----------|
| A. 1 plan combined | Reshape + re-lock + gate in one plan. Risks atomicity mid-reshape. | |
| B. 2 plans (recommended) | Plan 01 = audit + reshape + v1.9-bundle-reshape.md; Plan 02 = re-lock + gate update + AES-04. Matches ROADMAP estimate. | ✓ |
| C. 3 plans | Audit / reshape / re-lock+gate. Audit and reshape are too coupled to split. | |

**Selected:** B — 2 plans.
**Rationale (auto):** ROADMAP "expect 2 plans (reshape / re-lock+gate)" is the explicit estimate; precedent from Phase 61 (3 plans, blocked) suggests over-splitting is the failure mode.

---

## AES-04 verification cadence

| Option | Description | Selected |
|--------|-------------|----------|
| A. Phase-end only | Cheap; loses early signal. Bundle reshape can break visual order silently. | |
| B. Per-commit + phase-end (recommended) | Per-major-reshape-commit AES-04 (eager) + final phase-end gate. | ✓ |
| C. Per-build (every webpack run) | Excessive; AES is expensive. | |

**Selected:** B — per-major-reshape-commit + phase-end.
**Rationale (auto):** CSS load order shifts from chunk reshuffles are the documented #1 visual-regression risk for bundle phases. Eager-feedback prevents compound regressions.

---

## Stale-chunk guard cadence

| Option | Description | Selected |
|--------|-------------|----------|
| A. Standing rule: every gating measurement (recommended) | `rm -rf .next/cache .next` before every audit + gate build. BND-04 standing rule. | ✓ |
| B. Phase-start only | Phase 61 burned by stale chunks at final-gate. Documented failure mode; do not repeat. | |

**Selected:** A — standing rule, no exceptions.
**Rationale (auto):** Phase 61 final-gate stale-chunk burn is the canonical reason BND-04 was promoted to a standing rule. Skipping is non-negotiable.

---

## Phase 66 sequencing

| Option | Description | Selected |
|--------|-------------|----------|
| A. Phase 67 first (recommended) | 66 hasn't started; 67 ships first per ROADMAP §v1.9 rule 2 active path. | ✓ |
| B. Phase 66 first, then 67 | Would require pausing 67. 66 not yet started, so this just delays 67. | |
| C. Parallel | Explicitly forbidden by ROADMAP rule 2. | |

**Selected:** A — Phase 67 first.
**Rationale (auto):** ROADMAP rule 2 names this exact sequencing. 66 inherits stable post-reshape chunk graph for cleaner a11y attribution.

---

## Claude's Discretion

The following are explicitly delegated to Plan-time / execute-time judgement, not locked here:

1. **Specific dynamic-import boundary mechanism for GSAP ScrollSmoother** (`next/dynamic` with `ssr: false` vs custom lazy hook vs route-level split). Pick whichever measures best in Plan 01.
2. **Exact post-re-tree position for TooltipProvider** (per-page vs sub-tree near consumers). Measure-driven.
3. **Whether to extract `dependencies-snapshot.json`** machine-readable audit companion. Nice-to-have only.

## Deferred Ideas

- Framework-chunk reshape (chunks 2979/React/Next runtime, ~120 KB floor) — only if Phase 67 escalates per D-06 outcome ladder >220 KB band.
- Automated chunk-ID equality assertion test — possibly v2.0 if drift recurs.
- Phase 66 (ScaleCanvas Track-B) — sequenced AFTER Phase 67 per D-11.
