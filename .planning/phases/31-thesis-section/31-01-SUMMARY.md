---
phase: 31-thesis-section
plan: 01
subsystem: content
tags: [content, manifesto, wiki-locked, types, playwright, tdd, b-01]

requires:
  - phase: 30
    provides: THESIS SFSection landmark + stub PinnedSection awaiting real content
  - phase: 22
    provides: GSAP core + Playwright test scaffolding pattern (Phase 29 fs.readFileSync style)

provides:
  - lib/thesis-manifesto.ts — typed THESIS_MANIFESTO constant with 6 Grey-approved wiki-locked statements
  - ManifestoStatementData / ManifestoSize / ManifestoPillar / ManifestoAnchor type exports
  - tests/phase-31-thesis.spec.ts — TH-05 content-coverage Playwright file (8 tests)
  - B-01 (manifesto copy blocker) RESOLVED with the locked wiki source

affects: [phase-31-02, phase-32-signal-proof, phase-34-visual-language]

tech-stack:
  added: []
  patterns:
    - "Wiki-as-source-of-truth — content authored in wiki/analyses/v1.5-thesis-copy-draft.md, transcribed verbatim into typed TS constant (no rewrite at the code boundary)"
    - "Source-level Playwright content tests — fs.readFileSync + toContain assertions on lib/thesis-manifesto.ts, matching the Phase 29 infra-test style"
    - "Readonly const as const arrays for content-as-data — typed at compile time, immutable at runtime, zero runtime cost"

key-files:
  created:
    - lib/thesis-manifesto.ts
    - tests/phase-31-thesis.spec.ts
  modified:
    - .planning/phases/31-thesis-section/31-CONTEXT.md
    - .planning/phases/31-thesis-section/31-01-PLAN.md

key-decisions:
  - "Locked wiki copy supersedes researcher draft — wiki/analyses/v1.5-thesis-copy-draft.md (Grey-approved 2026-04-07) is canonical; researcher's 8-statement 3-anchor/5-connector draft preserved in git history only"
  - "All 6 statements size='anchor', no connector tier — D-14 override; void rhythm carried by data-void-before in Plan 02, not by a size taxonomy"
  - "5 pillars in ManifestoPillar union — 3 TH-05 required (signal-frame, enhanced-flat, biophilia) + 2 wiki extensions (culture-infrastructure, memetic-engineering)"
  - "D-16 magenta dropped (foreground-only color) per 2026-04-08 decision — manifesto carries no inline color metadata"
  - "TDD RED before manifesto write — tests verified failing on empty manifesto, then GREEN after transcription, eliminating the 'tests written to match implementation' anti-pattern"
  - "Plan 02 docs sync (commit 684f0f2) committed under same plan boundary — Plan 02 was written against the stale researcher draft and required reconciliation before execution"

patterns-established:
  - "Content-blocker resolution via wiki lock — when a content dependency blocks engineering, lock the prose in wiki first, then transcribe verbatim into a typed constant. Avoids re-litigating copy at the code boundary."
  - "Source-file Playwright tests — for content-as-data assertions, read the source file with fs and grep-assert; faster and more reliable than rendering the component just to check copy."

requirements-completed: [TH-05]

duration: ~30 min (transcription + 8 TDD tests + Plan 02 docs sync)
completed: 2026-04-07
---

# Phase 31 Plan 01: Manifesto Content + TH-05 Tests Summary

**Resolves B-01 by transcribing the 6 Grey-approved wiki-locked manifesto statements into a typed TypeScript constant, and scaffolds the Phase 31 Playwright file with 8 TH-05 content-coverage tests. Unblocks Plan 02 engineering.**

## Performance

- **Completed:** 2026-04-07
- **Tasks:** 3 (CONTEXT override + manifesto transcription + TH-05 test scaffold)
- **Files created:** 2 · **Files modified:** 2
- **Tests:** 8/8 TH-05 content tests passing (397ms)

## Accomplishments

- **B-01 RESOLVED:** The manifesto content blocker is closed by adopting `wiki/analyses/v1.5-thesis-copy-draft.md` (Grey-approved 2026-04-07) as the canonical source. CONTEXT decisions D-02 (count 6), D-04 (5 pillars), D-14 (all anchor) overridden inline; D-15 (size taxonomy split) removed; D-17 (Anton-only typography) confirmed; D-16 (magenta on "SIGNAL") dropped per the 2026-04-08 foreground-only decision.

- **`lib/thesis-manifesto.ts` (new):** `THESIS_MANIFESTO` typed `readonly` `as const` array of 6 statements transcribed verbatim from the wiki. Every entry carries `size: "anchor"`, a required `pillar` (5-value union), an optional `mobileAnchor` override slot (D-33), and a `wikiSource` trace string. Five exports satisfy the contract Plan 02 consumes.

  | Statement | Pillar | Text |
  |-----------|--------|------|
  | S1 | signal-frame | DETERMINISTIC STRUCTURE. GENERATIVE EXPRESSION. |
  | S2 | enhanced-flat | ZERO RADIUS. ZERO COMPROMISE. |
  | S3 | culture-infrastructure | CULTURE AS INFRASTRUCTURE. |
  | S4 | biophilia | STRUCTURE THAT BREATHES. |
  | S5 | memetic-engineering | FORMAT IS STRATEGY. |
  | S6 | signal-frame | THE FRAME HOLDS. THE SIGNAL MOVES. |

- **`tests/phase-31-thesis.spec.ts` (new, scaffold):** 8 TH-05 content-coverage tests using `fs.readFileSync` source-file assertions in the Phase 29 style — typed exports present, count = 6, every entry `size: "anchor"`, 3 required pillars covered, no hedge words (`might`, `could`, `perhaps`, `probably`, `maybe`, `tends`, `somewhat`), every text 2-8 words, no `FRAME/SIGNAL` slash-ordering (S6 paired-clause exception documented in AC-8), ALL CAPS register. TDD RED verified on empty manifesto before transcription; all 8 GREEN after.

- **Plan 02 docs sync (commit `684f0f2`):** Plan 02 was authored against the researcher's stale 8-statement 3-anchor/5-connector draft. Reconciled the `<interfaces>` block (5-pillar union, required `pillar`, `wikiSource` field, length-6 readonly), `must_haves.truths` (exact 6, all-anchor, weighted-arc void-before), and `<objective>` (8 → 6, weighted-arc strategy) before Plan 02 execution.

## Task Commits

1. **Task 1 + 2 + 3 (CONTEXT override + manifesto + TH-05 tests)** — `851e976` (Feat)
2. **Plan 02 docs sync (post-Plan-01 reconciliation)** — `684f0f2` (Docs)

## Files Created/Modified

- **`lib/thesis-manifesto.ts`** — new. Five exports: `ManifestoSize`, `ManifestoPillar`, `ManifestoAnchor`, `ManifestoStatementData`, `THESIS_MANIFESTO`. 6-element `readonly` array, `as const`-asserted, foreground-only (no inline color metadata). Source comment traces each statement back to its wiki line.
- **`tests/phase-31-thesis.spec.ts`** — new scaffold. 8 TH-05 source-file assertions. Plan 02 extends this same file with TH-01..04 + TH-06 browser tests.
- **`.planning/phases/31-thesis-section/31-CONTEXT.md`** — D-02/D-04/D-14 overridden inline; D-15 removed; D-16 marked dropped; B-01 marked RESOLVED; `canonical_refs` repointed to the wiki copy.
- **`.planning/phases/31-thesis-section/31-01-PLAN.md`** — `must_haves` rewritten for the 6-anchor reality, `ManifestoPillar` expanded to 5 values, AC-3/4/5/8 revised, Task 1 checkpoint marked pre-cleared, trailing stray XML tags stripped.

## Verification

- **Playwright 8/8 TH-05:** `pnpm exec playwright test tests/phase-31-thesis.spec.ts -g "TH-05"` — all green (397ms)
- **TypeScript:** `pnpm exec tsc --noEmit` clean for `lib/thesis-manifesto.ts` (zero `any` types, contract matches Plan 02 `<interfaces>` block exactly)

## Pre-existing Issues (NOT introduced here)

- `tests/phase-29-infra.spec.ts` — 2 implicit-any tsc warnings on `nonGsapRafComponents`, unrelated to Phase 31
- `tests/phase-25-detail-view.spec.ts` + `tests/phase-27-integration-bugs.spec.ts` — 6 tests look for `[data-section="grid"]` selector that Phase 30 removed when restructuring the homepage. Requires separate fix.

## Requirements Closed

TH-05 — manifesto content + 3 required pillars + ALL CAPS register all asserted at the source-file level.

**Plan 01 complete. Plan 02 unblocked.**
