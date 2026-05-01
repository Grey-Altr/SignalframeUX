---
phase: 68
plan: 01
title: lcp-guard structural refactor
subsystem: testing/perf
milestone: v1.9
tags: [v1.9, architectural-lock, lcp, phase-58-ratification, test-refactor]
dependency_graph:
  requires:
    - Phase 57 DGN-01 (LCP element identity baselines) — .planning/codebase/v1.8-lcp-diagnosis.md §1
    - Phase 60 LCP-02 path-b (content-visibility:auto on GhostLabel) — components/animation/ghost-label.tsx:25
    - Phase 64 PR #4 obsolete-fixme record — commit b70fbd6
  provides:
    - Phase 58 CIB-05 LCP element identity guard (structural variant) — tests/v1.8-phase58-lcp-guard.spec.ts
  affects:
    - CI lcp-guard surface (no longer skipped via test.fixme)
tech_stack:
  added: []
  patterns:
    - structural DOM query (Playwright Locator.boundingBox + toBeVisible)
    - tailwind arbitrary-value class-token selector via [class~="..."]
    - opt-in env-var baseURL override (PLAYWRIGHT_BASE_URL) inside spec file
key_files:
  created:
    - .planning/phases/68-lcp-guard-structural-refactor/68-01-SUMMARY.md
  modified:
    - tests/v1.8-phase58-lcp-guard.spec.ts (-132 / +125)
decisions:
  - "Replace paint-timing observer assertion with structural DOM query — same regression coverage, immune to the entry.element=null Chrome behavior on content-visibility:auto surfaces."
  - "Mobile post-capture LCP candidate is the first painted hero per-character span (sf-hero-deferred + inline-block) — query .first() of that class chain."
  - "Desktop LCP candidate disambiguation via .last() + toBeVisible — picks the visible VL-05 overlay span over the identically-classed mask span inside SVG <foreignObject>."
  - "Self-contained baseURL override via PLAYWRIGHT_BASE_URL env var in the spec — avoids playwright.config.ts mutation (out-of-scope for plan 68-01)."
metrics:
  duration_minutes: 14
  completed_date: 2026-04-29
  tasks: 2
  files_modified: 1
  files_created: 1
---

# Phase 68 Plan 01: lcp-guard Structural Refactor Summary

**One-liner:** Rewrites `tests/v1.8-phase58-lcp-guard.spec.ts` from a `largest-contentful-paint` paint-timing observer assertion into a structural DOM-query test (Playwright `boundingBox` + `toBeVisible`), restoring the Phase 58 CIB-05 perturbation guard from skipped to actively-running on the post-Phase-60 `content-visibility:auto` surface.

---

## Why

Phase 64 PR #4 (commit `b70fbd6`) had ratified the previous spec's two test-cases as `test.fixme` because the live paint-timing observer assertion was architecturally unreliable: Chrome's `largest-contentful-paint` paint-timing API consistently reports a null element reference for `content-visibility:auto`-wrapped LCP candidates. That ratification was a holding pattern; this plan ships the actual fix — a structural DOM query that catches the same class of regressions (LCP candidate element renamed/moved/removed) without depending on Chrome's flaky paint-entry element reference exposure.

The structural variant queries the LCP-candidate elements DIRECTLY by their structural class signature (using CSS `[class~="..."]` token selectors so Tailwind's arbitrary-value brackets/slashes don't need escaping) and asserts: (a) visible, (b) non-zero bounding rect, (c) top edge above viewport bottom.

---

## Tasks Executed

### Task 1 — Rewrite `tests/v1.8-phase58-lcp-guard.spec.ts` as structural test

**Commit:** `83a10cc`
**Files:** `tests/v1.8-phase58-lcp-guard.spec.ts` (-132 / +125)

**Mobile spec (375×667):**
- Locator: `span[class~="sf-hero-deferred"][class~="inline-block"]` → `.first()`
- Target element: first painted hero per-character span (the leftmost glyph "S" of `SIGNALFRAME//UX`) in `components/blocks/entry-section.tsx:132`.
- Phase 66 footnote: this is the post-`content-visibility:auto`-defer LCP candidate identity (per `.planning/phases/66-scalecanvas-track-b-architectural-decision/66-lcp-postcapture.md`).

**Desktop spec (1440×900):**
- Locator: `span[class~="relative"][class~="top-[0.08em]"][class~="pr-[0.28em]"][class~="tracking-[-0.12em]"][class~="text-[1.28em]"]` → `.last()`
- Target element: visible VL-05 magenta `//` overlay span at `components/blocks/entry-section.tsx:208`.
- Disambiguation: `.last()` + `.toBeVisible()` skips the identically-classed mask span inside `<svg><defs><mask><foreignObject>` at `entry-section.tsx:170` (mask-only, never painted).

**Shared helper:** `assertAboveFoldVisible(locator, viewportHeight, label)` — asserts visible + boundingBox non-null + width>0 + height>0 + y < viewport.innerHeight.

**Paint-state ritual:** preserved from prior spec — `emulateMedia({ reducedMotion: "reduce" })` + `goto("/", { waitUntil: "networkidle" })` + `document.fonts.load('700 100px "Anton"')` + `document.fonts.ready` + 500 ms settle. Same warm-Anton + reduced-motion posture used by `tests/v1.8-lcp-candidates.spec.ts` and Phase 57 DGN-01 capture.

**Removed:**
- `attachLcpObserver(page)` init-script helper.
- `readLcp(page)` reader.
- `window.__lcpEntries` window-attached array.
- `largest-contentful-paint` `PerformanceObserver` setup and tear-down.
- `test.fixme(true, "_path_l_decision: ...")` annotation block (the 38-line `_path_l_decision` rationale comment is also removed; rationale preserved in commit message + this SUMMARY).

**Added (deviation, in-spec only — no source mutations):**
- Opt-in `PLAYWRIGHT_BASE_URL` env-var baseURL override via `test.use({ baseURL: ... })` so the spec can target a worktree-local production server on a non-default port (e.g. `:3100`) when port 3000 is occupied by another worktree's dev server. Falls through to playwright.config.ts default when the env var is unset. **No `playwright.config.ts` change.**

**Local verification:**
```
pnpm install --prefer-offline   # worktree had no node_modules
pnpm build                       # production build OK
PORT=3100 pnpm start &           # worktree-local server on :3100 (port 3000 owned by main-tree dev server)
PLAYWRIGHT_BASE_URL=http://localhost:3100 \
  pnpm exec playwright test tests/v1.8-phase58-lcp-guard.spec.ts --project=chromium
```
Result: **2 passed (3.5s)** — both mobile + desktop structural assertions green.

### Task 2 — Regression check on `tests/v1.9-phase66-lcp-stability.spec.ts`

**Status:** **N/A — file does not yet exist on disk.**

The plan referenced `tests/v1.9-phase66-lcp-stability.spec.ts` as a layered-coverage regression target. A `find tests -name "v1.9-phase66*"` returned no matches; the v1.9 milestone (Phases 66–70) has not yet shipped any test artefact under that name on the `main` line this worktree is based on (`f7b0c0d`). The regression run was therefore skipped — there is nothing to regress against.

**Logged to deferred-items.md** (within phase 68 dir): "Re-run `pnpm exec playwright test tests/v1.9-phase66-lcp-stability.spec.ts --project=chromium` once Phase 66's stability spec lands. Layered coverage check pairs the structural guard (this plan) with paint-stability monitoring (Phase 66) — both must remain green for the v1.9 architectural-lock LCP surface to be considered protected."

---

## Acceptance Gates (Plan 68-01)

| Gate                                             | Required | Actual                          | Verdict |
| ------------------------------------------------ | -------- | ------------------------------- | ------- |
| `grep -c 'PerformanceObserver' <spec>`           | `0`      | `0`                             | PASS    |
| `grep -c 'test.fixme' <spec>`                    | `0`      | `0`                             | PASS    |
| `grep -c '_path_l_decision' <spec>`              | `0`      | `0`                             | PASS    |
| `grep -c 'window.__lcpEntries' <spec>`           | `0`      | `0`                             | PASS    |
| `playwright test … phase58-lcp-guard.spec.ts`    | exit 0   | exit 0 — 2 passed (3.5s)        | PASS    |
| `playwright test … v1.9-phase66-lcp-stability`   | exit 0   | N/A — file does not exist       | DEFER   |
| `git diff --name-only` only mutates target spec  | yes      | yes — only `tests/v1.8-phase58-lcp-guard.spec.ts` | PASS    |

**Verdict:** **PASS-with-deferral** — every gate that has a checkable artefact is green; the one DEFER row covers a regression target that does not exist on this branch (Task 2 N/A).

---

## Deviations from Plan

### Auto-fixed (Rule 3 — blocking issue)

**1. [Rule 3 — Blocking issue] Worktree had no `node_modules`; production build impossible without install.**
- **Found during:** Task 1 verification (first `pnpm build` invocation).
- **Issue:** `sh: next: command not found` — fresh worktree at `.claude/worktrees/agent-a769fbf4` had never had `pnpm install` run.
- **Fix:** `pnpm install --prefer-offline` (12.6s, build-scripts ignored as per pnpm v10 default).
- **Files modified:** none (workspace state only).
- **Commit:** none (transient state).

**2. [Rule 3 — Blocking issue] Port 3000 occupied by main-tree broken dev server, blocking the default playwright baseURL.**
- **Found during:** Task 1 verification (server lifecycle setup).
- **Issue:** `lsof :3000` showed the user's main-tree `pnpm dev` (`next-server v15.5.14`, PID 94866, 18 hr uptime) returning HTTP 500 on every request because of a CSS parse error in main-tree `app/globals.css:677` (a different file from this worktree's globals.css). Killing it would interrupt the user's active dev session.
- **Fix:** Built worktree on port `3100` instead; added a 6-line opt-in `PLAYWRIGHT_BASE_URL` env-var override in the spec file itself (`if (process.env.PLAYWRIGHT_BASE_URL) test.use({ baseURL: process.env.PLAYWRIGHT_BASE_URL });`). This avoids mutating `playwright.config.ts` (which is out-of-scope per plan 68-01). Falls through to the playwright.config.ts default when the env var is unset, so CI behaviour is unchanged.
- **Files modified:** `tests/v1.8-phase58-lcp-guard.spec.ts` (in-spec only, within plan scope).
- **Commit:** rolled into Task 1 commit `83a10cc`.

### Deferred-out-of-scope

**3. [Out of scope] `tests/v1.9-phase66-lcp-stability.spec.ts` does not exist on this branch.**
- **Found during:** Task 2 setup.
- **Issue:** Plan 68-01 Task 2 calls for a regression check against a Phase 66 stability spec; no such file exists in the worktree (or in `main` at the worktree's base commit `f7b0c0d`).
- **Decision:** Logged to `deferred-items.md` for re-run once Phase 66 ships its stability spec. Not auto-created (would be an architectural decision = Rule 4 = out-of-scope for the current plan executor).
- **Commit:** none.

---

## Self-Check: PASSED

**Files claimed created/modified — all present:**
- `tests/v1.8-phase58-lcp-guard.spec.ts` — FOUND (149 lines, modified in commit `83a10cc`).
- `.planning/phases/68-lcp-guard-structural-refactor/68-01-SUMMARY.md` — FOUND (this file).
- `.planning/phases/68-lcp-guard-structural-refactor/deferred-items.md` — FOUND (created alongside SUMMARY).

**Commit hashes claimed — all present in git history:**
- `83a10cc` — `test(68-01): rewrite v1.8-phase58-lcp-guard spec as structural DOM test` — FOUND on `worktree-agent-a769fbf4`.

**Grep gates — all four equal 0:**
- `PerformanceObserver` = 0 — VERIFIED.
- `test.fixme` = 0 — VERIFIED.
- `_path_l_decision` = 0 — VERIFIED.
- `window.__lcpEntries` = 0 — VERIFIED.

**Playwright spec — exit 0:**
- `tests/v1.8-phase58-lcp-guard.spec.ts` — 2 passed (3.5s) — VERIFIED.

**Scope discipline — only target file in `git diff --name-only`:**
- VERIFIED — `tests/v1.8-phase58-lcp-guard.spec.ts` is the only mutated source file in the Task 1 commit. The two new artefacts under `.planning/phases/68-lcp-guard-structural-refactor/` are uncommitted plan artefacts (per executor instructions: "Do NOT update STATE.md or ROADMAP.md").
