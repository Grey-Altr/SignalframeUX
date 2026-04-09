---
phase: 33-inventory-acquisition-sections
plan: "04"
subsystem: ui
tags: [acquisition-section, system-stats, proof-section, page-wiring, terminal-panel]
dependency_graph:
  requires: [33-01, 33-02, 33-03]
  provides: [AcquisitionSection, AcquisitionCopyButton, ProofSection-SYSTEM_STATS-refactor]
  affects: [app/page.tsx, components/blocks/proof-section.tsx]
tech_stack:
  added: []
  patterns: [server-component-with-client-child, single-source-of-truth-stats, clipboard-copy-trigger]
key_files:
  created:
    - components/blocks/acquisition-section.tsx
    - components/blocks/acquisition-copy-button.tsx
  modified:
    - components/blocks/proof-section.tsx
    - app/page.tsx
decisions:
  - "AcquisitionCopyButton isolated as client child so AcquisitionSection stays a Server Component (hybrid pattern matching Plan 02 InventorySection)"
  - "Source-level Playwright assertions (fs.readFileSync + not.toContain) mean forbidden strings must be absent even from JSDoc comments — 'rounded' and 'SFButton' removed from comment text"
  - "bgShift changed from white to black for ACQUISITION section (terminal instrument aesthetic per CONTEXT.md AQ-05)"
  - "SYSTEM_STATS is the single source of truth for component count / bundle / Lighthouse across both ProofSection and AcquisitionSection"
requirements_completed: [AQ-01, AQ-02, AQ-03, AQ-04, AQ-05, IV-06]
metrics:
  duration: "167s"
  completed: "2026-04-09T04:49:12Z"
  tasks_completed: 3
  tasks_total: 3
  files_created: 2
  files_modified: 2
---

# Phase 33 Plan 04: AcquisitionSection terminal panel with npx init copy-button and SYSTEM_STATS-driven stats refactor

AcquisitionSection built as a Server Component terminal instrument panel (hard-capped at 50vh, `npx signalframeux init` hero, `[COPY]` clipboard trigger as a client child, SYSTEM_STATS-driven data points, monospaced `→ /init` and `→ /inventory` text anchors) and wired into `app/page.tsx` with `bgShift="black"`. ProofSection stats refactored to import from SYSTEM_STATS so both sections share a single source of truth. All 13 Phase 33 Playwright tests green; human visual verification approved.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Build AcquisitionSection + refactor ProofSection stats | 1624fa5 | acquisition-section.tsx (new), acquisition-copy-button.tsx (new), proof-section.tsx (SYSTEM_STATS) |
| 2 | Wire AcquisitionSection into app/page.tsx | deee01c | app/page.tsx (bgShift black, stub replaced), acquisition-section.tsx (comment fix) |
| 3 | checkpoint:human-verify | n/a | User responded "approved" — full homepage scroll sequence validated (ENTRY → THESIS → PROOF → INVENTORY → SIGNAL → ACQUISITION), ACQUISITION reads as terminal instrument, INVENTORY as spec sheet, copy button functional, filter composition on /inventory working |

Note: Task 3 is a `checkpoint:human-verify` gate — the user performed visual verification at localhost:3000 and responded "approved", authorizing plan finalization. No automated commit corresponds to Task 3; the verification prompt is satisfied by the checkpoint return signal.

## Accomplishments

- **AcquisitionSection built** — Server Component, ≤50vh (hard cap via `maxHeight: '50vh'` + `overflow-hidden`), `data-acquisition-root`, CLI hero at `text-xl md:text-2xl lg:text-3xl`, stats column (COMPONENTS / BUNDLE / LIGHTHOUSE aligned via fixed-width monospace), two Next.js `<Link>` text anchors
- **AcquisitionCopyButton built** — `'use client'` client child, `navigator.clipboard.writeText`, `[COPY]` → `[COPIED]` visual feedback (1500ms), keyboard accessible (Enter/Space), `data-copy-trigger` for test hook
- **ProofSection stats refactored** — import `SYSTEM_STATS` from `@/lib/system-stats`, hardcoded "51" removed, stats now pull from live registry count
- **page.tsx wired** — AcquisitionSection imported and mounted, ACQUISITION `SFSection` switched from `bgShift="white"` to `bgShift="black"`, `min-h-screen` placeholder class removed (section owns its own height cap)
- **AQ-01..05 + IV-06 closed** — all 6 remaining Phase 33 requirements completed
- **Phase 33 test suite** — 13/13 green (plan spec said 11, but the scaffold created in Plan 01 included 2 additional assertions for AC-6 and AC-7)
- **TypeScript clean** — `pnpm tsc --noEmit` passes (only pre-existing test file errors in phase-29-infra.spec.ts, unrelated)

## Files Created

- `components/blocks/acquisition-section.tsx` (71 lines) — Server Component, terminal instrument panel layout
- `components/blocks/acquisition-copy-button.tsx` (50 lines) — `'use client'` copy trigger with 1500ms feedback state

## Files Modified

- `components/blocks/proof-section.tsx` — SYSTEM_STATS import, 3 hardcoded stat strings replaced
- `app/page.tsx` — import + mount AcquisitionSection, bgShift="black", className cleanup

## Decisions Made

1. **Server Component + client child split** — AcquisitionSection itself is a Server Component (no directive). Only the copy trigger is `'use client'` via a dedicated file `acquisition-copy-button.tsx`. This is the same hybrid pattern used in Plan 02 (InventorySection renders the 12-row table as RSC and delegates the panel to a client-mounted portal). Keeps the RSC hydration surface minimal — the entire terminal panel layout renders as static HTML.
2. **Source-level Playwright assertions require clean comments** — The AQ-05 test does `fs.readFileSync(path, 'utf-8').not.toContain("rounded")` and `.not.toContain("SFButton")`. There is no exclusion for comments. Initial JSDoc ("Zero rounded corners, zero SFButton") failed the test. Fix: replace forbidden substrings in comments with safe phrasing ("Zero border-radius, no styled buttons"). Recorded as Deviation 1 below.
3. **bgShift="black" for ACQUISITION** — CONTEXT.md AQ-05 specifies terminal instrument aesthetic. The stub in page.tsx had `bgShift="white"`. Changed to "black" during wiring; the foreground/background contrast inverts automatically via `--bg-black`/`--fg-black` CSS variables.
4. **50vh enforced via inline style + overflow-hidden** — Using `style={{ maxHeight: '50vh' }}` (inline, not Tailwind class) combined with `overflow-hidden`. If content exceeds 50vh on smaller viewports, it clips rather than grows. Padding kept deliberately compact (`py-8 md:py-10`) so content stays within the cap on mobile.
5. **SYSTEM_STATS as single source of truth** — Both AcquisitionSection and ProofSection now import from `@/lib/system-stats`. Adding a component to the registry automatically updates both sections' stat displays. No drift possible.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Forbidden strings in JSDoc comments failed AQ-05 source test**
- **Found during:** Task 2 Playwright test run
- **Issue:** The words "rounded" and "SFButton" appeared in a JSDoc comment constraints list in `acquisition-section.tsx`. AQ-05 uses `src.not.toContain()` against the raw file content — no AST exclusion for comments.
- **Fix:** Replaced "Zero rounded corners, zero SFButton" comment text with "Zero border-radius, no styled buttons" phrasing.
- **Files modified:** components/blocks/acquisition-section.tsx
- **Commit:** deee01c (bundled with Task 2 wiring commit since both changes were needed for tests to go green in the same run)

## Issues

None remaining. Phase 33 automated work is complete.

## Checkpoint Resolution

**Task 3 (checkpoint:human-verify)** — User responded "approved" after verifying:

- INVENTORY section (12 monospaced rows, 5-column datasheet layout, sfCode accent color, [//SIGNAL] tags on GEN rows, fixed portal detail panel, Escape + backdrop close behaviors, spec-sheet register)
- ACQUISITION section (≤50vh visual, `npx signalframeux init` dominant, [COPY] trigger functional and pastes into terminal, stats row present, text anchors navigate correctly, no button energy)
- /inventory page (≥34 items, SIGNAL/FRAME layer filters work, pattern filters work, layer + pattern composition filters, session storage persistence)
- Full homepage scroll sequence (ENTRY → THESIS → PROOF → INVENTORY → SIGNAL → ACQUISITION reads as a designed artifact)

Approval authorizes plan finalization and phase reconciliation.

## Next Phase Readiness

**Phase 33 automated work:** complete. All 4 plans shipped (01, 02, 03, 04).

**Remaining Phase 33 verification** (out of scope for this plan executor, handled by orchestrator):
- Orchestrator phase reconciliation checks
- Final Phase 33 SUMMARY roll-up if phase-level summary is required
- Phase 33 → Phase 34 transition gate

**Phase 34 (Visual Language + Subpage Redesign)** dependencies now satisfied — Phase 33 requirement is "homepage complete; all sections established before visual language audit runs across them". All 6 homepage sections are now implemented (ENTRY, THESIS, PROOF, INVENTORY, SIGNAL, ACQUISITION).

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
