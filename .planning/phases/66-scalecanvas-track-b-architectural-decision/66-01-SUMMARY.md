---
phase: 66-scalecanvas-track-b-architectural-decision
plan: 01
subsystem: ScaleCanvas Track B — architectural decision capture
tags: [arc-01, arc-02, decision-doc, baseline-capture, aes-04, aes-03, pillarbox, schema-gate]
status: complete
completed: 2026-04-29
duration: ~50min
requirements:
  - ARC-01
  - ARC-02 (cohort baseline only — strict+cohort enforcement is Plan 03)
dependency-graph:
  requires:
    - .planning/visual-baselines/v1.8-start/ (existing, 20 PNGs — strict reference)
    - .planning/phases/66-scalecanvas-track-b-architectural-decision/66-RESEARCH.md
    - .planning/phases/66-scalecanvas-track-b-architectural-decision/66-VALIDATION.md
    - .planning/codebase/AESTHETIC-OF-RECORD.md
    - .planning/codebase/v1.8-lcp-diagnosis.md (precedent shape)
    - tests/v1.8-baseline-capture.spec.ts (capture pattern)
    - tests/v1.8-phase60-aes04-diff.spec.ts (pixel-diff pattern)
    - tests/v1.8-phase63-1-bundle-budget.spec.ts (schema-test pattern)
  provides:
    - .planning/codebase/scale-canvas-track-b-decision.md (ARC-01 deliverable; locks mechanism = Pillarbox + ARC-04 pseudo-element)
    - .planning/visual-baselines/v1.9-pre/ (AES-03 mid-phase mobile cohort reference)
    - tests/v1.9-phase66-decision-doc.spec.ts (T-66-01 schema gate, 7 tests)
    - tests/v1.9-phase66-aes04-diff.spec.ts (Plan 03 pixel-diff harness, 20 tests across strict+cohort blocks)
  affects:
    - Plan 02 (66-02-PLAN.md) — unblocked; mechanism contract is fixed
    - Plan 03 (66-03-PLAN.md) — unblocked; harness + cohort baseline ready
tech-stack:
  added: []
  patterns:
    - Playwright fs-based schema test (Vitest-free; runs in chromium project alongside pixel-diff specs)
    - Two-block describe partition with --grep filter (strict ⊥ cohort)
    - existsSync-guarded test.skip for cross-plan baseline dependency
    - Absolute-URL goto override (CAPTURE_BASE_URL env) — bypasses hardcoded baseURL when port 3000 is occupied
key-files:
  created:
    - .planning/codebase/scale-canvas-track-b-decision.md (215 lines)
    - tests/v1.9-phase66-decision-doc.spec.ts
    - tests/v1.9-phase66-aes04-diff.spec.ts
    - .planning/visual-baselines/v1.9-pre/{home,system,init,inventory,reference}-{desktop-1440x900,iphone13-390x844,ipad-834x1194,mobile-360x800}.png (20 PNGs)
  modified: []
decisions:
  - "Mechanism = Pillarbox (transform: none below sm/640px) + ARC-04 CSS pseudo-element. Counter-scale rejected (tablet AES-04 fails by construction; doesn't address path_i; brittle to nested transforms). Portal rejected (mobile LCP candidate hydration concern + sync overhead; doesn't fully address path_i). Decision discharges _path_h_decision.review_gate option (a) verbatim."
  - "Cohort harness uses test.skip guard so spec is committable in Task 3 BEFORE Task 4 captures the baseline. After Task 4 the cohort describe-block enumerates and runs."
  - "Cohort tests are capture-only (no hard-fail). Pillarbox by-design produces ~100% pixel-diff on mobile vs v1.8-start; gating numerically would be no-information. AES-03 manual cohort review (66-COHORT-REVIEW.md, post-Plan-02) is the gating verdict."
metrics:
  tasks_completed: 4
  commits: 4
  pngs_captured: 20
  schema_tests: 7
  aes04_harness_tests: 20
  decision_doc_lines: 215
  duration_min: ~50
---

# Phase 66 Plan 01: ScaleCanvas Track B Decision + Baseline Capture — Summary

ARC-01 decision-doc authored locking mechanism = Pillarbox (sm-breakpoint exception in ScaleCanvas) + ARC-04 CSS pseudo-element suppression for GhostLabel; T-66-01 tampering gate green; AES-04 pixel-diff harness committed with strict (desktop+tablet vs v1.8-start, hard-fail ≤0.5%) and cohort (mobile+iphone13 vs v1.9-pre, capture-only) partition; v1.9-pre baseline (20 PNGs) captured against prod build BEFORE any source mutation.

## What this plan accomplished

This is the **architectural lock plan** for Phase 66. It captures the decision artifact + verification surfaces + cohort reference baseline so Plan 02 (pillarbox implementation + ARC-04 pseudo-element) and Plan 03 (LHCI gate tightening + AES-04 strict gate + cohort-results writeback) execute against fixed contracts rather than re-deriving them.

Concretely:

1. **ARC-01 decision-doc** (`.planning/codebase/scale-canvas-track-b-decision.md`, 215 lines): mirrors `v1.8-lcp-diagnosis.md` shape. Encodes mechanism = Pillarbox with file:line evidence (`scale-canvas.tsx:42-83` + `globals.css:2770-2774` + `layout.tsx:117` + `:128`), the 6-pillar visual audit table (PASS strict / cohort review for mobile), counter-scale + portal rejection sections with binding constraints, ARC-04 pseudo-element suppression rationale, AES-04 risk-assessment table, 9-spec verification surface, 5 resolved open questions including the canvasSyncScript identity-branch flag for Plan 02 Task 2.
2. **T-66-01 schema gate** (`tests/v1.9-phase66-decision-doc.spec.ts`, 7 tests): asserts file presence + size + the literal headings `## Mechanism Selected: Pillarbox` and `## 6-Pillar Visual Audit` + the file:line citations + the alternative-rejection sections. Any future tamperer editing the doc to claim a different mechanism trips this on the next PR.
3. **AES-04 harness** (`tests/v1.9-phase66-aes04-diff.spec.ts`, 20 tests = 10 strict + 10 cohort): Plan 03's pixel-diff surface. `--grep strict` partition runs against `.planning/visual-baselines/v1.8-start/` with hard-fail ≤0.5%; `--grep cohort` partition runs against `.planning/visual-baselines/v1.9-pre/` with capture-only diff written to `66-cohort-results.md`. Cohort describe-block uses `test.skip(!existsSync(COHORT_BASELINE_DIR))` so Task 3 was committable before Task 4 landed the baseline.
4. **v1.9-pre baseline** (`.planning/visual-baselines/v1.9-pre/`, 20 PNGs): 5 routes × 4 viewports captured against `pnpm build && PORT=3001 pnpm start` with reduce-motion + warm-Anton + nextjs-portal hard gate. Mirrors `v1.8-start/` route × viewport set exactly.

## Task verdicts

| Task | Name | Verdict | Commit | Key artifact |
|------|------|---------|--------|--------------|
| 1 | Author RED schema gate `tests/v1.9-phase66-decision-doc.spec.ts` | PASS — RED 7/7 confirmed before authoring doc | `17b04ad` | spec file (72 LOC) |
| 2 | Author `.planning/codebase/scale-canvas-track-b-decision.md` | PASS — schema gate GREEN 7/7 after authoring | `3e3f35d` | doc (215 lines, ≥200 acceptance) |
| 3 | Author `tests/v1.9-phase66-aes04-diff.spec.ts` (strict+cohort partition) | PASS — `--list` enumerates 20 (10+10); tsc clean | `5398fb8` | spec file (230 LOC) |
| 4 | Capture `.planning/visual-baselines/v1.9-pre/` (20 PNGs) | PASS — 20/20 captured against prod build | `aa0bc32` | 20 PNGs (mobile baseline ranges 55-65 KB) |

## Phase-level verification (post-Task 4)

All five `<verification>` checks from `66-01-PLAN.md` pass:

1. `pnpm exec playwright test tests/v1.9-phase66-decision-doc.spec.ts --project=chromium` → 7 PASS.
2. `pnpm exec playwright test tests/v1.9-phase66-aes04-diff.spec.ts --list --project=chromium` → 20 enumerated (cohort describe-block no longer skipping after Task 4).
3. `ls -1 .planning/visual-baselines/v1.9-pre/ | wc -l` → 20.
4. `git diff --name-only HEAD~4 HEAD components app lib public` → empty (capture-only invariant preserved).
5. `wc -l .planning/codebase/scale-canvas-track-b-decision.md` → 215 (≥200).

## Deviations from Plan

### Auto-fixed issues

**1. [Rule 3 — Blocking] Port 3000 occupied by another worktree's stale prod server**
- **Found during:** Task 4, immediately after `pnpm build`.
- **Issue:** `lsof -i :3000` showed `next-server (v15.5.14)` PID 94866 (another worktree, ELAPSED 04:07:14, returning 500 on `/`). `pnpm start` failed with `EADDRINUSE`. Killing another worktree's server is out of scope.
- **Fix:** Launched our prod server on `PORT=3001`. Discovered playwright.config.ts hardcodes `baseURL: "http://localhost:3000"` and does NOT honor `PLAYWRIGHT_TEST_BASE_URL` env var — confirmed via a one-shot inline-spec probe (`baseURL` fixture returned `http://localhost:3000` despite env override). Updated the temp capture spec to use absolute URLs (`page.goto(`${ABS_BASE}${route.path}`)`) gated by `CAPTURE_BASE_URL` env var (default `http://localhost:3001`). Did NOT modify `playwright.config.ts` — leaves the canonical CI baseURL contract intact and keeps `files_modified` honest.
- **Files modified:** Only `tests/v1.9-pre-baseline-capture.spec.ts` (the temp file, since deleted) — no permanent code touched.
- **Commit:** Folded into `aa0bc32` (Task 4 commit body documents the env-override path + reasoning).

**2. [Rule 3 — Blocking] Playwright glob doesn't match `.tmp` extension**
- **Found during:** Task 4, first capture-spec run attempt.
- **Issue:** Plan suggested `tests/v1.9-pre-baseline-capture.spec.ts.tmp` extension to keep Playwright's default test glob from picking it up. Running `playwright test tests/v1.9-pre-baseline-capture.spec.ts.tmp --project=chromium` returned "No tests found" — Playwright's `testMatch` filter applies even when an explicit file path is provided.
- **Fix:** Renamed to `.spec.ts` for the capture run (Playwright matched), then deleted the file post-capture per the plan's "one-shot ops action; not a recurring CI gate" requirement. Acceptance criterion `! test -f tests/v1.9-pre-baseline-capture.spec.ts.tmp` adapted to `! test -f tests/v1.9-pre-baseline-capture.spec.ts` (verified PASS).
- **Files modified:** None permanent — temp file created + run + deleted.
- **Commit:** Folded into `aa0bc32`.

### No mechanism deviation

The recommended **Pillarbox + CSS pseudo-element** mechanism per `66-RESEARCH.md` §3d (HIGH confidence) was selected without override. Counter-scale and Portal alternatives were documented as Rejected with binding constraints in the decision-doc.

### No source-file mutation

Per the BLOCKING gate in Task 4 — verified via `git status --short` after capture: only `.planning/visual-baselines/v1.9-pre/` appeared as new. `git diff --name-only HEAD~4 HEAD components app lib public` is empty.

## Auth gates

None occurred.

## Self-Check: PASSED

- `[ -f .planning/codebase/scale-canvas-track-b-decision.md ]` → FOUND (215 lines)
- `[ -f tests/v1.9-phase66-decision-doc.spec.ts ]` → FOUND
- `[ -f tests/v1.9-phase66-aes04-diff.spec.ts ]` → FOUND
- `[ -d .planning/visual-baselines/v1.9-pre ]` → FOUND (20 PNGs)
- `[ ! -f tests/v1.9-pre-baseline-capture.spec.ts ]` → CONFIRMED gone (temp spec deleted)
- `git log --oneline | grep 17b04ad` → FOUND (Task 1 commit)
- `git log --oneline | grep 3e3f35d` → FOUND (Task 2 commit)
- `git log --oneline | grep 5398fb8` → FOUND (Task 3 commit)
- `git log --oneline | grep aa0bc32` → FOUND (Task 4 commit)
- `pnpm exec playwright test tests/v1.9-phase66-decision-doc.spec.ts --project=chromium` → 7/7 PASS
- `pnpm exec playwright test tests/v1.9-phase66-aes04-diff.spec.ts --list --project=chromium` → 20 enumerated
- `git diff --name-only HEAD~4 HEAD components app lib public` → empty (no source mutation)

## Plan 02 unblock surface

Plan 02 starts here:

- **Mechanism contract:** `scale-canvas-track-b-decision.md` §"Mechanism Selected: Pillarbox" + §"AES-04 Risk Assessment".
- **Pre-flagged Plan 02 work:** §"Open Questions (Resolved Pre-Plan-02)" #1 — `canvasSyncScript` identity branch at `app/layout.tsx:128` MUST add `s = vw < 640 ? 1 : (vw / 1280)` (currently writes incorrect height when pillarbox engages).
- **Verification harness ready:** `tests/v1.9-phase66-aes04-diff.spec.ts --grep strict` for desktop+tablet hard-fail; `--grep cohort` for capture-only mobile + iPhone 13 against `v1.9-pre/`.
- **ARC-04 mechanism:** §"ARC-04 Suppression Mechanism: CSS Pseudo-Element" — convert GhostLabel `<span>` text to `::before { content: attr(data-ghost-text); }`.
