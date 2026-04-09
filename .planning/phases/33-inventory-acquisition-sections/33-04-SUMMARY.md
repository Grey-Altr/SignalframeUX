---
phase: 33-inventory-acquisition-sections
plan: "04"
subsystem: homepage-sections
tags: [acquisition-section, system-stats, proof-section, page-wiring]
dependency_graph:
  requires: [33-01, 33-02, 33-03]
  provides: [AcquisitionSection, ProofSection-SYSTEM_STATS-refactor]
  affects: [app/page.tsx, components/blocks/proof-section.tsx]
tech_stack:
  added: []
  patterns: [server-component-with-client-child, single-source-of-truth-stats]
key_files:
  created:
    - components/blocks/acquisition-section.tsx
    - components/blocks/acquisition-copy-button.tsx
  modified:
    - components/blocks/proof-section.tsx
    - app/page.tsx
decisions:
  - "AcquisitionCopyButton isolated as client child so AcquisitionSection stays Server Component"
  - "Comment text must not contain test-forbidden strings (SFButton, rounded) — source-level assertions check raw file content"
  - "bgShift changed from white to black for ACQUISITION (terminal instrument aesthetic per CONTEXT.md AQ-05)"
metrics:
  duration: "167s"
  completed: "2026-04-09T04:49:12Z"
  tasks_completed: 2
  tasks_total: 2
  files_created: 2
  files_modified: 2
---

# Phase 33 Plan 04: AcquisitionSection + ProofSection Refactor Summary

AcquisitionSection terminal instrument panel built (≤50vh, npx signalframeux init hero, clipboard copy trigger, SYSTEM_STATS data points, text anchors), ProofSection stats refactored to SYSTEM_STATS, both wired into page.tsx with ACQUISITION on black background.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Build AcquisitionSection + refactor ProofSection stats | 1624fa5 | acquisition-section.tsx (new), acquisition-copy-button.tsx (new), proof-section.tsx (SYSTEM_STATS) |
| 2 | Wire AcquisitionSection into app/page.tsx | deee01c | app/page.tsx (bgShift black, stub replaced) |

## Verification

- `pnpm tsc --noEmit` — clean (only pre-existing test file errors in phase-29-infra.spec.ts)
- `pnpm playwright test tests/phase-33-inventory-acquisition.spec.ts` — 13/13 green (plan spec said 11, scaffold created 13)
- `grep 'SYSTEM_STATS' components/blocks/proof-section.tsx` — confirmed
- `grep -n 'rounded\|SFButton' components/blocks/acquisition-section.tsx` — zero matches in code (only safe comment text)

## Decisions Made

1. **Client child isolation**: `AcquisitionCopyButton` is a dedicated `'use client'` file. `AcquisitionSection` itself has no directive — it renders as Server Component. This pattern is consistent with the hybrid block pattern used in Phase 33 Plan 02 (InventorySection + ComponentDetail).

2. **Source-level test constraints**: The Playwright test AQ-05 does `fs.readFileSync` on the raw source file and calls `.not.toContain("rounded")` and `.not.toContain("SFButton")`. These strings must not appear anywhere in the file — including JSDoc comments. Removed from comments during Task 2 fix iteration.

3. **bgShift="black"**: ACQUISITION section uses black background per CONTEXT.md AQ-05 terminal instrument aesthetic. Changed from `bgShift="white"` stub.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Forbidden strings in JSDoc comments failed AQ-05 source test**
- **Found during:** Task 2 Playwright test run
- **Issue:** The words "rounded" and "SFButton" appeared in JSDoc comment constraints list in `acquisition-section.tsx`. The AQ-05 test uses `src.not.toContain()` against the raw file — no exclusion for comments.
- **Fix:** Replaced "Zero rounded corners, zero SFButton" comment text with "Zero border-radius, no styled buttons" phrasing
- **Files modified:** components/blocks/acquisition-section.tsx
- **Commit:** deee01c (bundled with Task 2 wiring commit)

## Checkpoint Pending

**Task 3 (checkpoint:human-verify)** is blocking — human visual verification required.

See checkpoint message for verification steps.

## Self-Check

Files exist:
- [x] components/blocks/acquisition-section.tsx — FOUND
- [x] components/blocks/acquisition-copy-button.tsx — FOUND
- [x] components/blocks/proof-section.tsx (modified) — FOUND
- [x] app/page.tsx (modified) — FOUND

Commits exist:
- [x] 1624fa5 — feat(33-04): AcquisitionSection terminal panel + ProofSection SYSTEM_STATS refactor
- [x] deee01c — feat(33-04): wire AcquisitionSection into page.tsx, bgShift black, 13/13 tests green

## Self-Check: PASSED
