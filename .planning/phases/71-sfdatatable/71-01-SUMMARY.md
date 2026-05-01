---
phase: 71-sfdatatable
plan: 01
subsystem: dep-decision-ratification
tags: [dep-01, sf-data-table, tanstack-react-table, _dep_dt_01_decision, runtime-dep, audit-trail, p3-lazy, pattern-b]
status: complete
completed: 2026-05-01
duration: ~3m
requirements: [DEP-01]
nyquist_compliant: true

dependency_graph:
  requires:
    - tests/v1.8-phase63-1-wordmark-hoist.spec.ts:1-37 (_wmk_01_decision schema precedent)
    - .planning/STATE.md "v1.10 Critical Constraints" (dep-decision-at-plan-time invariant)
    - .planning/phases/71-sfdatatable/71-RESEARCH.md (dep rationale; bundle measurement protocol)
  provides:
    - components/sf/sf-data-table.tsx (placeholder Pattern B file hosting _dep_dt_01_decision block)
    - @tanstack/react-table@8.21.3 dependency (Plan 02 impl + Plan 03 lazy wrapper consume)
    - measured bundle baseline (187.6 KB gzip / 12.4 KB headroom — anchors Plan 02/03 budget gates)
  affects:
    - package.json (dep added to dependencies)
    - pnpm-lock.yaml (resolved tree)
    - precedent for _dep_re_01_decision (Phase 73 Tiptap) and any future v1.10 runtime-dep ratifications

tech-stack:
  added:
    - "@tanstack/react-table@8.21.3 (runtime dep — DEP-01 ratified via _dep_dt_01_decision)"
  patterns:
    - "_dep_dt_01_decision — REQ-namespaced 7-field ratification block (extends _wmk_01_decision schema)"
    - "Dep-decision-at-plan-time — block authored BEFORE pnpm add; bundle_evidence back-filled post-install"
    - "Pattern B placeholder file — 'use client' + decision block + export {}; impl lands in next plan"

key-files:
  created:
    - components/sf/sf-data-table.tsx (64 lines — placeholder + _dep_dt_01_decision block)
  modified:
    - package.json (+1 line: @tanstack/react-table dep)
    - pnpm-lock.yaml (+22 lines: @tanstack/react-table + @tanstack/table-core resolved tree)

decisions:
  - "_dep_dt_01_decision schema borrows _wmk_01_decision 7-field shape verbatim, adapting field names: original_threshold→dep_added (array), new_threshold→version (semver), evidence→bundle_evidence (measured array). This makes the block grep-able with the same patterns used for _wmk_01_decision."
  - "Block authored as Task 1 commit BEFORE pnpm add (Task 2). Reviewers see ratification at plan-time, not retro-fitted. version + bundle_evidence are placeholder TBDs in Task 1, back-filled in Task 3 from MEASURED post-install build output (never estimated)."
  - "Placeholder file ships with 'use client' directive (Pattern B requirement) + export {} sentinel. Empty export prevents accidental barrel inclusion bugs (TypeScript errors if anyone tries import { SFDataTable } before Plan 02)."
  - "Bundle_evidence carries 8 measured entries from `rm -rf .next/cache .next && ANALYZE=true pnpm build` (BND-04 stale-chunk guard discipline). Homepage / First Load JS post-add = 187.6 KB gzip = pre-add baseline (placeholder file has no import; zero impact as expected)."
  - "Pre-install npm view check confirmed @tanstack/react-table@8.21.3 is the latest published version on the v8 track (review_gate trigger: v9 stable release; currently RFC #5834, no release date)."
  - "D-04 chunk-id stability lock holds: @tanstack/react-table NOT added to next.config.ts optimizePackageImports. Heavy dep lands in P3 lazy chunk via next/dynamic ssr:false (sf-data-table-lazy.tsx in Plan 03), not via optimizePackageImports — D-04 is the correct mechanism for runtime-dep weight management in v1.10."
  - "Pattern B contract holds: components/sf/sf-data-table.tsx NOT exported from components/sf/index.ts barrel. Phase 67 BND-05 unlock did not change Pattern B; new heavy components continue to ship via lazy wrappers, never through the barrel."

metrics:
  tasks_completed: 3
  files_created: 1
  files_modified: 2
  lines_added: 89  # 64 sf-data-table.tsx + 1 package.json + ~22 pnpm-lock.yaml + 2 net edits
  bundle_first_load_kb_pre: 187.6
  bundle_first_load_kb_post: 187.6
  bundle_headroom_kb: 12.4
  resolved_dep_version: "8.21.3"
  duration_minutes: 3
---

# Phase 71 Plan 01: SFDataTable Dep Ratification + Install Summary

Authored the `_dep_dt_01_decision` 7-field ratification block (REQ-namespaced
precedent extending `_wmk_01_decision`) BEFORE running `pnpm add`, then
installed `@tanstack/react-table@8.21.3`, then back-filled the
`bundle_evidence` field with 8 MEASURED entries from `rm -rf .next/cache .next
&& ANALYZE=true pnpm build`. Homepage `/` First Load JS unchanged at 187.6 KB
gzip (placeholder file has no import; 12.4 KB headroom under 200 KB hard
target preserved). D-04 chunk-id lock holds. Pattern B contract holds. Audit
trail for v1.10's first runtime-npm-dep introduction is complete and
committed BEFORE Plan 02 starts impl.

## Tasks Shipped

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Author `_dep_dt_01_decision` block (pre-install ratification) | `644293a` | components/sf/sf-data-table.tsx |
| 2 | `pnpm add @tanstack/react-table@^8.21.3` (DEP-01 install) | `423aa64` | package.json, pnpm-lock.yaml |
| 3 | Populate `_dep_dt_01_decision.bundle_evidence` with measured post-install values | `1251d2d` | components/sf/sf-data-table.tsx |

## `_dep_dt_01_decision` Block (Final State)

7 schema fields populated with non-estimated values:

```yaml
_dep_dt_01_decision:
  decided: "2026-05-01"
  audit: "sf-data-table:runtime-dep"
  dep_added:
    - "@tanstack/react-table"
  version: "8.21.3"
  rationale: |
    SFDataTable composes TanStack Table v8 headless logic (sort, filter,
    pagination, row selection state machine; ~12 KB gzip; zero DOM) over
    the existing SFTable family. v8 is the maintained-track de-facto React
    headless-table standard; v9 is open RFC #5834, not yet released.
    AG Grid (200+ KB) and react-table v7 (deprecated; React 18/19
    concurrent-mode issues) rejected per .planning/research/STACK.md.

    P3 lazy posture (next/dynamic ssr:false in sf-data-table-lazy.tsx,
    NOT in sf/index.ts barrel, NOT in next.config.ts optimizePackageImports
    — D-04 chunk-id stability lock holds) keeps homepage First Load JS
    impact at 0 KB. Sort headers use <button type="button"> per WCAG 2.1.1;
    axe-core enforces in Phase 71 Plan 03 TST-03.
  bundle_evidence:
    - "Homepage / First Load JS pre-add baseline: 187.6 KB gzip (Phase 67 close)"
    - "Homepage / First Load JS post-add (placeholder file, no impl): 187.6 KB gzip"
    - "Headroom remaining: 12.4 KB under 200 KB hard target"
    - "TanStack Table chunk: ABSENT from homepage manifest (placeholder file has no import — real chunk lands Plan 02)"
    - "Devtools subpath audit: zero references in .next/analyze/client.html (verified via grep)"
    - "Resolved version: 8.21.3"
    - "Measurement command: rm -rf .next/cache .next && ANALYZE=true pnpm build"
    - "Measurement date: 2026-05-01"
  review_gate: |
    Re-evaluate when @tanstack/react-table v9 reaches stable release
    (currently RFC #5834, no release date). Re-pin and re-measure if
    v9 changes API surface or bundle profile materially. Also fires
    if BND-08 budget changes (currently 200 KB hard target) or if D-04
    chunk-id stability lock is intentionally broken in a future BND phase.
  scope: "@tanstack/react-table runtime dep — single P3 lazy chunk"
  ratified_to_main_via: "Phase 71 (Plan 01 commit)"
```

## Bundle Measurement Trace

**Methodology:** identical to `tests/v1.8-phase63-1-bundle-budget.spec.ts` —
read each homepage chunk file from `.next/app-build-manifest.json`
`pages["/page"]`, gzip-compress in memory, sum bytes.

**Build invocation:**
```
rm -rf .next/cache .next
ANALYZE=true pnpm build
```

**Per-chunk gzip (12 chunks, sum = 187.6 KB):**

| Chunk | Gzip KB |
|-------|---------|
| webpack-aa6002c96a1b521d.js | 2.3 |
| 5791061e-b51f32ecb5a3272a.js (next/react-dom) | 53.1 |
| 2979-7e3b1be684627f10.js (next runtime) | 44.9 |
| main-app-908f2e99ae1cfc69.js | 0.2 |
| 584bde89-478e5bcc7be5ae42.js (gsap-entry) | 19.4 |
| 8964-02d5beb63a80f3f5.js (gsap-core) | 24.9 |
| 289-21d7e8dcd1977007.js (tailwind-merge+clsx) | 8.9 |
| 9067-c4993fc134c463a8.js (webpack runtime helpers) | 3.3 |
| 6309-ce962777f8910e27.js (lenis) | 5.2 |
| 3228-0c5979f2a433adaf.js (gsap-plugins) | 9.8 |
| 5837-a116bffc877132b7.js (component-registry) | 6.1 |
| page-c66fa4b380e4719b.js (homepage entry) | 9.5 |
| **Total** | **187.6** |

**Headroom:** 12.4 KB under 200 KB hard target (CLAUDE.md / BND-06 / Phase 67 baseline).

**TanStack absence audit:**
- `@tanstack/react-table` ABSENT from all 12 homepage chunk files (verified via direct content scan of every chunk in `app-build-manifest.json` `pages["/page"]`).
- Devtools strings (`TanStackTableDevtools`, `table-devtools`) ABSENT from `.next/analyze/client.html` (0 matches).
- Confirms placeholder `export {}` file generates zero bundle impact, as expected. Real bundle delta lands in Plan 02 + Plan 03 when the lazy wrapper imports the real symbol.

**Bundle budget spec result:** `tests/v1.8-phase63-1-bundle-budget.spec.ts` PASSED (187.6 KB / 200 KB).

## Locks Held

| Lock | Mechanism | Verification |
|------|-----------|--------------|
| D-04 chunk-id stability | `next.config.ts` `optimizePackageImports` unchanged (8 entries; `@tanstack/react-table` NOT added) | `grep -c "@tanstack/react-table" next.config.ts` → `0` |
| Pattern B contract | `components/sf/index.ts` unchanged; `sf-data-table` NOT in barrel | `grep -c "sf-data-table" components/sf/index.ts` → `0` |
| 200 KB hard target | Bundle budget spec green at 187.6 KB | `tests/v1.8-phase63-1-bundle-budget.spec.ts` PASS |
| Worktree-leakage guard | Each task commit modified ONLY its declared files | `git show --stat` per commit |

## Deviations from Plan

**None.** Plan executed exactly as written. The pre-install npm-view probe
returned `8.21.3` (no v9 surprise), which matched the planned `^8.21.3` pin.
The `pnpm add` produced one peer-dep warning for `@storybook/theming`
expecting Storybook `^8.x` but finding `10.3.5` — this is **pre-existing
project noise** (Storybook 10 was already installed before Plan 01) unrelated
to TanStack Table; not a deviation.

## Authentication Gates

None encountered.

## Worktree Hygiene

Each commit verified clean via `git show --stat HEAD`:

- Commit `644293a`: `components/sf/sf-data-table.tsx` only (1 file, +57 lines)
- Commit `423aa64`: `package.json` + `pnpm-lock.yaml` only (2 files, +23 lines)
- Commit `1251d2d`: `components/sf/sf-data-table.tsx` only (1 file, +9/-3 lines)

Pre-existing modifications to `.planning/STATE.md`, `.planning/config.json`,
and untracked `.lighthouseci/links.json` are baseline noise from before Plan
01 started; NOT touched by any Plan 01 commit.

## Forward Links

- **Plan 02 (DT-01..05 impl)** — consumes `@tanstack/react-table@8.21.3`; ships real `SFDataTable` symbol replacing the `export {}` sentinel; adds sort/filter/pagination/row-selection logic; introduces CVA `density` variant + `useDebouncedValue` hook + `<SFCheckbox data-[state=indeterminate]>` indeterminate visual.
- **Plan 03 (DT-06 lazy + TST-03)** — ships `components/sf/sf-data-table-lazy.tsx` via `next/dynamic({ ssr: false })` with `<SFSkeleton>` fallback; production-chunk audit confirms zero TanStack devtools strings; Playwright + axe-core spec covers controlled API + keyboard nav.
- **Phase 73 (SFRichEditor)** — `_dep_re_01_decision` block uses `_dep_dt_01_decision` as schema precedent (REQ-namespaced 7-field shape); same dep-decision-at-plan-time invariant + bundle_evidence-from-measurement discipline applies.

## Self-Check: PASSED

- [x] `components/sf/sf-data-table.tsx` exists at `/Users/greyaltaer/code/projects/SignalframeUX/components/sf/sf-data-table.tsx` (verified via Read tool)
- [x] Commit `644293a` exists in `git log`
- [x] Commit `423aa64` exists in `git log`
- [x] Commit `1251d2d` exists in `git log`
- [x] 7 unique schema field anchors present (`decided:`, `audit:`, `dep_added:`, `version: "`, `rationale: |`, `bundle_evidence:`, `review_gate: |`)
- [x] No `TBD` / `MEASURED>` / `RESOLVED_VERSION>` / `TODAY_ISO>` placeholders remaining
- [x] D-04 lock: `grep -c "@tanstack/react-table" next.config.ts` = `0`
- [x] Pattern B contract: `grep -c "sf-data-table" components/sf/index.ts` = `0`
- [x] Bundle budget spec PASSED at 187.6 KB / 200 KB
