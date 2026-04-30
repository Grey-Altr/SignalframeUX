# Phase 67: Bundle Barrel-Optimization (D-04 Unlock) — Context

**Gathered:** 2026-04-30 (auto mode)
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliberately break the D-04 chunk-id stability lock for ONE phase, reshape the barrel/import graph + dead-code-eliminate shipped-but-unconsumed surfaces, then re-lock at new chunk IDs. Closes path_k (homepage gzip First Load JS 258.9 KB → ≤200 KB CLAUDE.md target). Visually invisible (AES-04 ≤0.5%).

**In-scope:**
- `next.config.ts` `optimizePackageImports` audit + expansion (D-04 unlock window)
- `components/sf/index.ts` barrel reshape (re-export pattern)
- Dead-code elimination on shipped-but-unconsumed SF surfaces
- Heavy-chunk dynamic-import candidates (GSAP ScrollSmoother is the named candidate per `_path_k_decision` review_gate (c))
- TooltipProvider tree restructure (`react-remove-scroll` 26 KB pull, named in `_path_k_decision` review_gate (b))
- New chunk-ID baseline capture + freeze in `v1.9-bundle-reshape.md` (successor to `v1.8-lcp-diagnosis.md`)
- LHCI + spec gate re-tightening; `_path_k_decision` retire-or-replace

**Out-of-scope (deferred or other phases):**
- Phase 66 (ScaleCanvas Track-B mobile a11y) — explicitly NOT parallel-safe per ROADMAP §v1.9 rule 2
- Runtime npm dependency swaps (devDeps allowed for measurement only, per ROADMAP §v1.9 rule 5)
- New aesthetic surfaces or feature work

</domain>

<decisions>
## Implementation Decisions

### Reshape strategy / attack-surface priority

- **D-01:** Three-vector reshape, executed in this order during Plan 01:
  1. **`@/components/sf` to `optimizePackageImports`** — Phase 63.1 Plan 01 next.config.ts:14-22 explicitly flagged this as rejected ONLY because of D-04. With D-04 deliberately unlocked, this is the cheapest first-pass lever (highest expected payoff per the path_k investigation).
  2. **GSAP ScrollSmoother → dynamic import** — chunk 8964 (24.9 KB gzip), named candidate in `_path_k_decision` review_gate (c). Defer-load below the fold; ScrollTrigger keeps eager-load.
  3. **TooltipProvider re-tree** — chunk 7525 (`react-remove-scroll` 26 KB) via TooltipProvider in app/layout.tsx:191. Named in `_path_k_decision` review_gate (b). Move below LenisProvider/SignalframeProvider so the provider tree compresses or move to per-page where used.
- **D-02:** Audit-first: capture per-vector predicted-payoff (kb gzip) via `ANALYZE=true pnpm build` BEFORE applying each vector. Reject any vector whose actual reduction is <2 KB gzip (cost/risk floor).
- **D-03:** No runtime npm dependency additions or swaps. Build-time + tree-shape only (per ROADMAP §v1.9 rule 5).

### Re-lock baseline mechanism

- **D-04:** Author `.planning/codebase/v1.9-bundle-reshape.md` (successor to `v1.8-lcp-diagnosis.md`) at end of Plan 01, capturing:
  - New stable chunk-ID table (filename + top packages + parsed/gzip totals) — matches v1.8-lcp-diagnosis §2a format
  - Method note: `rm -rf .next/cache .next && ANALYZE=true pnpm build` per BND-04 standing rule
  - Pre-reshape (v1.8 frozen) vs post-reshape (v1.9 new lock) delta column
- **D-05:** No new automated chunk-ID assertion test in Plan 02. Documentation freeze + the existing bundle-budget spec is sufficient surface area; an additional chunk-ID equality test would over-couple and break on benign webpack reshuffles.

### path_k retirement vs replacement

- **D-06:** Outcome ladder (decided up-front, applied in Plan 02 based on measured result):
  - Homepage gzip ≤ 200 KB → **retire** `_path_k_decision` entirely; restore `BUDGET_BYTES = 200 * 1024` per CLAUDE.md hard constraint.
  - Homepage gzip 201–220 KB → **replace** with a new tighter threshold (e.g., `BUDGET_BYTES = (measured + 1KB margin) * 1024`); document the partial win in a NEW `_path_q_decision` block (NOT a path_k extension).
  - Homepage gzip > 220 KB → STOP, escalate. Likely indicates architectural reshape (App Router config / GSAP-not-dynamic-importable / framework chunk reshape) is required and Phase 67 is not the right vehicle.

### Plan structure

- **D-07:** **2 plans** (matches ROADMAP estimate):
  - **Plan 01 — Reshape:** Audit + apply 3 reshape vectors (D-01) + capture v1.9-pre baseline + AES-04 per major reshape commit + author `v1.9-bundle-reshape.md`.
  - **Plan 02 — Re-lock + Gate:** Update `tests/v1.8-phase63-1-bundle-budget.spec.ts` per D-06 outcome ladder + LHCI threshold update + final AES-04 gate vs `.planning/visual-baselines/v1.8-start/` ≤0.5% per page + commit new chunk-ID lock.

### AES-04 verification cadence

- **D-08:** Per-major-reshape-commit AES-04 (eager-feedback) + final phase-end full-route AES-04 vs `.planning/visual-baselines/v1.8-start/`. Use existing `.planning/visual-baselines/v1.9-pre/` baseline for sanity checks. Per ROADMAP §v1.9 rule 4 + AES-04 standing rule (≤0.5% per page).
- **D-09:** Routes covered: `/`, `/init`, `/inventory`, `/system` (all redirect/canonical landing pages). Mobile + tablet + desktop viewports per AES-04 precedent.

### Stale-chunk guard cadence

- **D-10:** `rm -rf .next/cache .next` before EVERY gating measurement, both during reshape (per-vector audit) and before final lock. BND-04 standing rule, no exceptions. Phase 61 final-gate burned by stale chunks; do not repeat.

### Sequencing relative to Phase 66

- **D-11:** **Phase 67 runs FIRST.** Phase 66 has not started. Per ROADMAP §v1.9 rule 2: "67 ships first and 66 starts after 67 settles" is the active path. After Phase 67 closes, Phase 66 inherits a stable post-reshape chunk graph for its own a11y attribution.

### Claude's Discretion

- Specific dynamic-import boundary mechanism for GSAP ScrollSmoother (`next/dynamic` vs lazy hook vs route-level split — Plan 01 task can pick whichever measures best).
- Exact location of TooltipProvider after re-tree (per-page vs sub-tree near consuming components — measure-driven).
- Whether to extract a `dependencies-snapshot.json` companion to `v1.9-bundle-reshape.md` for machine-readable audit (nice-to-have, not required).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase 67 spec + requirements
- `.planning/ROADMAP.md` §1040–1051 — Phase 67 goal, success criteria, dependencies
- `.planning/ROADMAP.md` §1091–1101 — v1.9 build-order constraints (rules 1, 2, 4, 5, 6, 7, 8 all apply)
- `.planning/REQUIREMENTS.md:27-29` — BND-05, BND-06, BND-07 acceptance criteria
- `.planning/REQUIREMENTS.md:79-81` — phase-to-requirement mapping confirmation

### Phase 67 inputs (read for current state)
- `next.config.ts:9-30` — current `optimizePackageImports` 7-entry list + Phase 63.1 D-04 rejection comment (the comment is the spec for what this phase is unlocking)
- `tests/v1.8-phase63-1-bundle-budget.spec.ts:11-52` — `_path_k_decision` block; review_gate clauses (a)/(b)/(c) name the three reshape vectors this phase MUST attack
- `tests/v1.8-phase63-1-bundle-budget.spec.ts:59` — current `BUDGET_BYTES = 260 * 1024` (Plan 02 mutation surface per D-06)
- `app/layout.tsx:16,168,191,205,209` — TooltipProvider import + tree position + Phase 63.1 Plan 03 history comment (constrains D-01 vector 3)
- `components/sf/index.ts` — full barrel re-export surface (D-01 vector 1 target; 194 lines)

### Chunk-graph + LCP context
- `.planning/codebase/v1.8-lcp-diagnosis.md` §2a — v1.7-named chunk inventory + Phase 61 reshape outcome; format template for `v1.9-bundle-reshape.md` (D-04)
- `.planning/codebase/v1.8-lcp-evidence.json` — companion machine-readable data
- `.planning/codebase/v1.8-lcp-candidates.json` — LCP candidate inventory

### Aesthetic-of-record (hard standing rule)
- `.planning/codebase/AESTHETIC-OF-RECORD.md` §AES-04 (line 68) — per-phase pixel-diff ≤0.5% rule
- `.planning/visual-baselines/v1.8-start/` — AES-04 comparison surface (D-08)
- `.planning/visual-baselines/v1.9-pre/` — already-captured v1.9 entry baseline for sanity checks

### Phase 61 precedent (read for what NOT to repeat)
- `.planning/phases/61-bundle-hygiene/61-03-SUMMARY.md` — final verdict + Phase 61 BLOCKED rationale; stale-chunk discipline + honest-gate-reporting patterns to mirror
- `.planning/phases/61-bundle-hygiene/61-03-FINAL-GATE.md` — gate scorecard format

### LHCI + ratification standing rules
- `.lighthouseci/lighthouserc.json` — current bundle-related thresholds; Plan 02 may tighten
- `CLAUDE.md` Quality Bar §Page weight — "<200KB initial" is the BND-06 hard target this phase restores

### Project-wide standing rules
- `CLAUDE.md` §Hard Constraints — "DO NOT introduce complexity" (sets the audit-first / 2 KB-floor discipline of D-02)
- `CLAUDE.md` §Tech Stack — confirms GSAP 3.12 + ScrollTrigger + Lenis as load-bearing (D-01 vector 2 must NOT remove ScrollSmoother, only defer it)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable assets
- **`@next/bundle-analyzer`**: already wired via `next.config.ts:2,4-6,29` with `ANALYZE=true` env gate. Reuse verbatim for per-vector audit (D-02).
- **`tests/v1.8-phase63-1-bundle-budget.spec.ts`** measurement methodology: reads `.next/app-build-manifest.json` pages["/page"], gzip-compresses each chunk in memory, sums bytes. This is the canonical measurement surface for BND-06; Plan 02 mutates the threshold but keeps the methodology.
- **Phase 61 4-way scorecard pattern** (61-03-FINAL-GATE.md): "honest gate reporting under FALSE-PASS GUARD" — Plan 02 final-gate doc should mirror this format.
- **`v1.8-lcp-diagnosis.md` §2a chunk-ID table format** — copy the column layout for `v1.9-bundle-reshape.md` (D-04).

### Established patterns
- **Stale-chunk guard discipline (BND-04)**: `rm -rf .next/cache .next` before every gating build. Standing rule since Phase 61.
- **Per-phase pixel-diff** (AES-04): mobile + tablet + desktop, ≤0.5% per page. Baselines live at `.planning/visual-baselines/{vN-start, vN-pre}/`.
- **`_path_X_decision` annotation block** (decided / audit / scope / original / new / rationale / evidence / review_gate / ratified_to_main_via): the only sanctioned way to ratify gate-loosenings. D-06 follows this if outcome ladder lands in 201–220 KB band.
- **D-04 chunk-id stability lock comment** (next.config.ts:14-22): the "do not touch" guardrail. Phase 67's deliberate unlock means this comment must be REWRITTEN at Plan 01 close to reflect the new Phase 67 → v1.9 lock state.

### Integration points
- **`next.config.ts` `optimizePackageImports`** — single mutation surface for vector 1.
- **`app/layout.tsx` provider tree** (lines 191–209) — single mutation surface for vector 3.
- **Wherever ScrollSmoother is currently imported eagerly** (search `import.*ScrollSmoother` and `gsap.registerPlugin(ScrollSmoother`) — vector 2 mutation surfaces. Likely `lenis-provider.tsx` adjacent or in a top-level animation provider.
- **`tests/v1.8-phase63-1-bundle-budget.spec.ts:59` + header `_path_k_decision`** — Plan 02 mutation surface for D-06 outcome ladder.
- **`.lighthouseci/lighthouserc.json`** bundle thresholds — Plan 02 ratification surface.

### Creative options enabled / constrained by current architecture
- **Enabled by D-04 unlock**: barrel reshape via `optimizePackageImports`, deeper webpack split-chunks reshuffles, multiple new chunk IDs.
- **Constrained**: NO new runtime deps (rule 5); ScrollSmoother is core (CLAUDE.md tech stack) so dynamic-import is the ceiling, NOT removal; PF-04 contract preserved (Lenis `autoResize: true`); single-ticker rule (no new rAF call sites, rule 7).

</code_context>

<specifics>
## Specific Ideas

### From `_path_k_decision` review_gate (the spec for THIS phase)
- review_gate (a) = THIS phase: "v1.9 introduces a phase that is allowed to break the D-04 chunk-id lock (e.g., a deliberate barrel-optimization phase that re-locks new chunk IDs)" — Phase 67 is the named realization of clause (a).
- review_gate (b) = vector 3: "structural refactor moves the TooltipProvider out of the root layout boundary" — explicit named vector.
- review_gate (c) = vector 2: "a heavy library currently in initial-bundle (GSAP ScrollSmoother is the candidate) becomes a dynamic import" — explicit named vector.

### From Phase 63.1 chunk fingerprint inspection (path_k evidence)
- Chunk 4335 = Radix ScrollArea (31.1 KB) — already in `optimizePackageImports` via `radix-ui`; revisit if vector 1 dissolves it.
- Chunk 7525 = react-remove-scroll (26.0 KB, pulled in by TooltipProvider) — vector 3 target.
- Chunk 8964 = GSAP ScrollSmoother + ScrollTrigger (24.9 KB, core to project per CLAUDE.md) — vector 2 target. Note: keep ScrollTrigger eager (it's core animation surface), defer-load only ScrollSmoother below the fold.

### Aesthetic preservation
- Bundle changes MUST be visually invisible per ROADMAP §v1.9 rule 4. CSS load order shifts caused by chunk reshuffle are the #1 risk; AES-04 per-commit (D-08) catches them.

### No external specs beyond the canonical_refs list
- All requirements fully captured in `.planning/REQUIREMENTS.md` BND-05/06/07 + ROADMAP §1040-1051.

</specifics>

<deferred>
## Deferred Ideas

- **Framework-chunk reshape (chunks 2979 / Next runtime 44.9 KB / React 53.1 KB / webpack 21.9 KB)** — the ~120 KB framework floor. Out of scope for Phase 67 (would require App Router config / Next.js version / React-server-component boundary work). VRF-08 path_b explicitly defers Moto G Power 3G Fast retest with framework-chunk reshape until AFTER Phase 67 ships per `feedback_path_b_pattern`. If Phase 67 D-06 lands in the >220 KB band (escalate clause), framework-chunk reshape becomes the next phase.
- **Automated chunk-ID equality assertion test** — D-05 explicitly skipped; rationale captured. Could be revisited in v2.0 if drift becomes a recurring problem.
- **`dependencies-snapshot.json` machine-readable audit companion** to `v1.9-bundle-reshape.md` — nice-to-have, Plan 01 may add if cheap; not required.
- **Phase 66 (ScaleCanvas Track-B)** — sequenced AFTER Phase 67 per D-11.

</deferred>

---

*Phase: 67-bundle-barrel-optimization-d-04-unlock*
*Context gathered: 2026-04-30 (auto mode, single-pass)*
