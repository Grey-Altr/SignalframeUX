# Phase 57: Diagnosis Pass + Aesthetic-of-Record Lock-in - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-25
**Phase:** 57 — diagnosis-pass-aesthetic-of-record-lock-in
**Areas discussed:** AESTHETIC-OF-RECORD scope, Diagnosis output posture, Baseline screenshot tooling, Per-chunk attribution method

---

## AESTHETIC-OF-RECORD scope

| Option | Description | Selected |
|--------|-------------|----------|
| Standing rules + token refs (Recommended) | The 4 standing rules (AES-01..04) + canonical references to LOCKDOWN.md, token files, trademark primitive locations. ~150 lines. Doc stays single-purpose; existing locked artifacts remain authoritative. | ✓ |
| Full self-contained extraction | Standing rules + verbatim extraction of motion contracts, primary-slot policy, trademark primitives, FRAME/SIGNAL invariants, register clauses. ~500+ lines. One-stop reference but duplicates LOCKDOWN.md content (drift risk). | |
| Standing rules + curated extracts | Standing rules + selectively extracted invariants that perf work could plausibly violate (motion budget, font-display contract, CLS guards, trademark primitives). ~250 lines. Middle path. | |

**User's choice:** Standing rules + token refs (Recommended)
**Notes:** Avoids drift risk between LOCKDOWN.md and AESTHETIC-OF-RECORD.md — LOCKDOWN remains authoritative for invariants; AESTHETIC-OF-RECORD is the perf-phase entry point.

---

## Diagnosis output posture

| Option | Description | Selected |
|--------|-------------|----------|
| Strictly diagnostic (Recommended) | Findings only: LCP element identity per viewport, file:line evidence, trace + PerformanceObserver measurements, chunk owner table. Ranking deferred to Phase 60 plan-phase RESEARCH.md where intervention tradeoffs are properly contextualized. | ✓ |
| Diagnostic + ranked recommendation | Same findings PLUS ranked candidate (a/b/c) with rationale. Speeds up Phase 60 planning but couples diagnosis to intervention thinking, which the strictly-diagnostic split exists to prevent. | |
| Diagnostic + risk-flagged options | Findings + each candidate annotated with risk markers (CLS-touch / aesthetic-touch / motion-touch) but no ranking. Informs Phase 60 without pre-deciding. | |

**User's choice:** Strictly diagnostic (Recommended)
**Notes:** Phase 60 plan-phase reads diagnosis cold and ranks against then-current evidence (LHCI median, Phase 59 ship state, real-device divergence). Phase 57 ranking would freeze a stale recommendation.

---

## Baseline screenshot tooling

| Option | Description | Selected |
|--------|-------------|----------|
| Playwright (Recommended) | Already in repo (test infra). Scriptable, deterministic, 4 viewports × 5 pages auto via test loop. Reproducible by anyone running `pnpm test:visual:baseline`. CI-runnable for AES-04 per-phase pixel diff. | ✓ |
| chrome-devtools MCP | Aligns with `feedback_visual_verification.md` (MCP is the visual gate). Manual capture per-shot. No scripting overhead but 20 manual ops + non-reproducible by anyone without MCP. | |
| Both — Playwright for capture, MCP for cohort review | Playwright captures the 20 baselines (reproducible, AES-04 diffable). chrome-devtools MCP used for AES-03 cohort review and ad-hoc visual verification. Each tool does what it's good at. | |

**User's choice:** Playwright (Recommended)
**Notes:** Implicit "both" outcome — Playwright handles the 20-image baseline capture and per-phase AES-04 diffs; chrome-devtools MCP retained for AES-03 cohort review per `feedback_visual_verification.md`. The selected option is the tool of record for baseline capture specifically.

---

## Per-chunk attribution method

| Option | Description | Selected |
|--------|-------------|----------|
| @next/bundle-analyzer + table in diagnosis (Recommended) | Run `ANALYZE=true pnpm build`, inspect emitted HTML, write attribution table directly into v1.8-lcp-diagnosis.md. Snapshot at v1.8 start. Phase 61 re-runs analyzer to verify reductions. | ✓ |
| source-map-explorer scripted JSON | Add `pnpm analyze:chunks` script emitting `.planning/codebase/v1.8-chunk-map.json`. Reproducible, diffable across phases. New tool dependency to maintain. | |
| Both — analyzer for human-readable, source-map-explorer for diffable | HTML for cohort review, JSON for Phase 61 BND-01 measurement. Doubles the artifact count for marginal gain at v1.8 start. | |

**User's choice:** @next/bundle-analyzer + table in diagnosis (Recommended)
**Notes:** No new deps. Snapshot lives next to the LCP findings where Phase 61 plan-phase will read both together.

---

## Claude's Discretion

- AESTHETIC-OF-RECORD.md exact section ordering and prose voice — Claude follows LOCKDOWN.md style precedent.
- Playwright baseline spec naming and viewport descriptor exact key names — Claude picks consistent with existing `tests/phase-*-*.spec.ts` naming.
- Whether the Phase 57 commit is split (one for AES doc, one for diagnosis, one for baselines) or single — Claude picks based on what reviews cleanly.
- Trademark primitive file-path enumeration in AESTHETIC-OF-RECORD.md — Claude derives from grep against shipped code (verified during this discussion).

## Deferred Ideas

- AES-04 pixel-diff threshold automation (CI gate vs human review-only) — Phase 58 or 62 ownership.
- Cohort review external-eye recruitment process — operational, not Phase 57 deliverable.
- `source-map-explorer` adoption — revisitable if Phase 61 needs finer-grained tracing.
- LCP-02 candidate ranking — explicitly deferred to Phase 60 plan-phase RESEARCH.md.
