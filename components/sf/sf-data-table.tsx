"use client";

/**
 * SFDataTable — FRAME layer headless data table (Pattern B, P3 lazy).
 *
 * IMPLEMENTATION SHIPS IN PLAN 02. This file currently hosts only the
 * _dep_dt_01_decision ratification block (DEP-01) per the v1.10
 * dep-decision-at-plan-time invariant.
 *
 * Pattern B contract (DO NOT VIOLATE):
 *   - NEVER export from components/sf/index.ts barrel
 *   - NEVER add @tanstack/react-table to next.config.ts optimizePackageImports (D-04 lock)
 *   - Consumers import via @/components/sf/sf-data-table-lazy (lands in Plan 03)
 *   - Direct import of this file is SUPPORTED but discouraged outside the lazy wrapper
 */

// ---------------------------------------------------------------------------
// _dep_dt_01_decision — runtime-dep ratification block (REQ-namespaced)
//
// Schema precedent: _wmk_01_decision at tests/v1.8-phase63-1-wordmark-hoist.spec.ts:1-37
//
// _dep_dt_01_decision:
//   decided: "2026-05-01"          # populated by Task 1 author
//   audit: "sf-data-table:runtime-dep"
//   dep_added:
//     - "@tanstack/react-table"
//   version: "<TBD — populated by Task 2 post-install>"
//   rationale: |
//     SFDataTable composes TanStack Table v8 headless logic (sort, filter,
//     pagination, row selection state machine; ~12 KB gzip; zero DOM) over
//     the existing SFTable family. v8 is the maintained-track de-facto React
//     headless-table standard; v9 is open RFC #5834, not yet released.
//     AG Grid (200+ KB) and react-table v7 (deprecated; React 18/19
//     concurrent-mode issues) rejected per .planning/research/STACK.md.
//
//     P3 lazy posture (next/dynamic ssr:false in sf-data-table-lazy.tsx,
//     NOT in sf/index.ts barrel, NOT in next.config.ts optimizePackageImports
//     — D-04 chunk-id stability lock holds) keeps homepage First Load JS
//     impact at 0 KB. Sort headers use <button type="button"> per WCAG 2.1.1;
//     axe-core enforces in Phase 71 Plan 03 TST-03.
//   bundle_evidence:
//     - "TBD — populated by Task 3 post-install via ANALYZE=true pnpm build"
//     - "Pre-add homepage First Load JS baseline: 187.6 KB gzip (Phase 67 close, MILESTONES.md)"
//   review_gate: |
//     Re-evaluate when @tanstack/react-table v9 reaches stable release
//     (currently RFC #5834, no release date). Re-pin and re-measure if
//     v9 changes API surface or bundle profile materially. Also fires
//     if BND-08 budget changes (currently 200 KB hard target) or if D-04
//     chunk-id stability lock is intentionally broken in a future BND phase.
//   scope: "@tanstack/react-table runtime dep — single P3 lazy chunk"
//   ratified_to_main_via: "Phase 71 (Plan 01 commit)"
// ---------------------------------------------------------------------------

// Implementation lands in Plan 02. This export prevents accidental
// barrel inclusion bugs (TypeScript will error if anyone tries to
// import { SFDataTable } before Plan 02 ships the real symbol).
export {};
