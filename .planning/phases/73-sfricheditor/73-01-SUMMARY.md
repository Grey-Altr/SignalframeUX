---
phase: 73-sfricheditor
plan: 01
subsystem: dep-ratification
tags: [DEP-02, RE-04, _dep_re_01_decision, tiptap, prosemirror, css-isolation, pattern-b, p3-lazy]
requirements:
  - DEP-02
  - RE-04
dependency_graph:
  requires:
    - "Phase 71 _dep_dt_01_decision schema precedent"
    - "Phase 67 BND-06 chunk-id stability lock (D-04) — held"
    - "@layer base + @layer utilities pre-existing in app/globals.css (Tailwind v4)"
  provides:
    - "Placeholder Pattern B file at components/sf/sf-rich-editor.tsx with 7-field _dep_re_01_decision audit-trail block"
    - "Tiptap v3.22.5 dep set installed (@tiptap/react, @tiptap/pm, @tiptap/starter-kit, @tiptap/extension-link)"
    - "First authored @layer signalframeux block in app/globals.css with 6 ProseMirror element rules (10 selectors)"
    - "Dep-decision-at-plan-time precedent ratified with measured (not estimated) bundle_evidence"
  affects:
    - "Plan 02 SFRichEditor implementation (consumes the placeholder file + @layer block)"
    - "Plan 03 P3 lazy wrapper + axe-core test suite"
    - "v1.10 bundle headroom (12.4 KB intact after Phase 73 Plan 01 — placeholder adds 0 KB)"
tech-stack:
  added:
    - "@tiptap/react@3.22.5 (runtime dep, lazy chunk only)"
    - "@tiptap/pm@3.22.5 (runtime dep, lazy chunk only)"
    - "@tiptap/starter-kit@3.22.5 (runtime dep, lazy chunk only)"
    - "@tiptap/extension-link@3.22.5 (runtime dep, lazy chunk only)"
  patterns:
    - "_dep_X_decision 7-field comment block authored BEFORE pnpm add (audit-trail pattern; mirrors Phase 71 _dep_dt_01_decision)"
    - "@layer signalframeux scoped CSS for third-party content area (replaces injectCSS:true Tiptap default)"
    - "Three-commit cohort: (1) decision authored, (2) pnpm add, (3) bundle_evidence + globals.css together"
key-files:
  created:
    - "components/sf/sf-rich-editor.tsx (placeholder hosting _dep_re_01_decision; 'use client'; export {}; NOT in barrel)"
  modified:
    - "package.json (4 @tiptap/* deps added)"
    - "pnpm-lock.yaml (resolved Tiptap v3.22.5 dependency tree)"
    - "app/globals.css (first @layer signalframeux block authored with 6 ProseMirror element rules)"
decisions:
  - "Tiptap v3.22.5 chosen as latest stable v3 (npm view confirmed 3.22.5 is current) — matches plan target exactly; v2 fallback not needed"
  - "@tiptap/extension-link confirmed separate from StarterKit in v3 (research uncertainty resolved post-pnpm list — must remain a top-level dep)"
  - "Character count via editor.getText().length (zero-dep) — @tiptap/extension-character-count NOT added (lands in Plan 02; documented in rationale)"
  - "Bundle measurement: Homepage First Load JS = 187.6 KB UNCHANGED from Phase 72 baseline; placeholder export {} contributes 0 KB; 12.4 KB headroom intact"
  - "@layer signalframeux insertion point: line 1348, between @layer utilities close (1347) and KEYFRAMES section start (1349) — preserves cascade ordering with detail-panel z-index overrides downstream"
  - "Spacing tokens used inside @layer signalframeux: --sfx-space-2 (8px), --sfx-space-3 (12px), --sfx-space-4 (16px), --sfx-space-6 (24px), --sfx-space-16 (64px) — all blessed stops"
  - "Zero border-radius inside .ProseMirror block (CLAUDE.md hard constraint honored)"
metrics:
  duration_seconds: 318
  tasks_completed: 3
  commits: 3
  files_created: 2  # sf-rich-editor.tsx + 73-01-SUMMARY.md
  files_modified: 3  # package.json, pnpm-lock.yaml, app/globals.css
  homepage_first_load_js_kb: 187.6
  homepage_budget_kb: 200
  homepage_headroom_kb: 12.4
  delta_from_placeholder_kb: 0
  bundle_budget_spec: PASS
  completed_date: "2026-05-01"
---

# Phase 73 Plan 01: SFRichEditor Dep Ratification + CSS Isolation Foundation Summary

Establishes the `_dep_re_01_decision` audit trail BEFORE any Tiptap implementation code; installs Tiptap v3.22.5 (@tiptap/react + @tiptap/pm + @tiptap/starter-kit + @tiptap/extension-link); authors the first `@layer signalframeux { .ProseMirror ... }` block in `app/globals.css` to replace Tiptap's `injectCSS:true` default with cascade-isolated SF-token-scoped rules.

## Resolved Tiptap Versions

All four packages resolved to **v3.22.5** (current latest v3):

| Package | Version |
|---------|---------|
| `@tiptap/react` | 3.22.5 |
| `@tiptap/pm` | 3.22.5 |
| `@tiptap/starter-kit` | 3.22.5 |
| `@tiptap/extension-link` | 3.22.5 |

Pre-install `npm view @tiptap/react version` returned `3.22.5` exactly — no v4 surprise, no fallback needed. `pnpm list --depth=0` post-install confirmed `@tiptap/extension-link` is a top-level dep (research prediction validated: still separate from StarterKit in v3).

## Bundle Measurement Results

Measured via clean-build protocol: `rm -rf .next/cache .next && ANALYZE=true pnpm build`.

| Metric | Pre-Add (Phase 72 close) | Post-Add (Plan 01) | Delta |
|--------|--------------------------|---------------------|-------|
| Homepage `/` First Load JS | 187.6 KB gzip | 187.6 KB gzip | **0 KB** |
| 200 KB budget headroom | 12.4 KB | 12.4 KB | **UNCHANGED** |
| `@tiptap/*` in homepage chunks | n/a | **PASS (absent)** | — |
| `tests/v1.8-phase63-1-bundle-budget.spec.ts` | PASS | **PASS** | — |

Manifest probe (`.next/build-manifest.json` + `.next/app-build-manifest.json`) returned `PASS` for `/tiptap|prosemirror|starter.kit/` regex — zero matching chunks for `/page`. The placeholder file's `export {}` literally adds zero modules to the homepage First Load chunk graph.

The Next.js build CLI's `192 kB` line for `/` includes per-route ephemeral overhead beyond the chunk-set total measured by the bundle-budget spec; the spec's 187.6 KB number is the gating measurement.

## Three-Commit Audit Trail

| Commit | Task | Files | Purpose |
|--------|------|-------|---------|
| `9afa1fe` | Task 1 | `components/sf/sf-rich-editor.tsx` (created) | Decision block authored pre-install with TBD placeholders |
| `b3be861` | Task 2 | `package.json`, `pnpm-lock.yaml` | `pnpm add @tiptap/*@3.22.5` install only — no other file changes |
| `b1ef026` | Task 3 | `components/sf/sf-rich-editor.tsx`, `app/globals.css` | Bundle_evidence back-fill (measured values) + first `@layer signalframeux` block |

The decision-before-install commit ordering is the critical audit-trail invariant: reviewers reading `git log` see the rationale ratified at plan-time, not retro-fitted after the fact.

## @layer signalframeux Block Verification

CSS layer structure confirmed valid:

- `@layer signalframeux` count in `app/globals.css`: **1** (this block is the first authored signalframeux layer in the file)
- `.ProseMirror` selector count in `app/globals.css`: **10** (across 6 element rules: `.ProseMirror` root + p + h1/h2/h3/h4 + ul/ol/li + blockquote)
- All selectors confined inside the `@layer signalframeux` block (verified via `awk '/@layer signalframeux/,/^}$/'`)
- `border-radius` inside `.ProseMirror` block: **0** (CLAUDE.md zero-rounded-corners rule honored)
- Tiptap/ProseMirror CSS imports anywhere in `app/`, `components/`, `lib/`: **0 matches** (CSS isolation contract holds)
- Spacing tokens used: `--sfx-space-2`, `--sfx-space-3`, `--sfx-space-4`, `--sfx-space-6`, `--sfx-space-16` — all blessed stops

Insertion point: line 1348, between the closing `}` of `@layer utilities` (line 1347) and the `KEYFRAMES` section header (line 1349). The block sits cleanly between Tailwind's utilities cascade and the unlayered detail-panel z-index overrides at the file tail. Tailwind v4 handles the named layer correctly per pre-existing `@layer base` and `@layer utilities` precedent.

## Pattern B + D-04 Lock Verification

| Invariant | Verification | Status |
|-----------|--------------|--------|
| `components/sf/index.ts` does NOT export `sf-rich-editor` | `grep -c "sf-rich-editor" components/sf/index.ts` = 0 | **HOLD** |
| `next.config.ts` `optimizePackageImports` does NOT contain `@tiptap` | `grep -c "@tiptap" next.config.ts` = 0 | **HOLD** |
| Placeholder `export {}` only — no real symbol exported | `tail -5 components/sf/sf-rich-editor.tsx` | **HOLD** |

D-04 chunk-id stability lock holds. Pattern B contract holds. The 8-entry `optimizePackageImports` list is unchanged from Phase 67 baseline.

## Deviations from Plan

None — plan executed exactly as written.

The `npm view @tiptap/react version` probe returned 3.22.5 (matches plan target), so neither the `@^3` fallback path nor the `@^2` legacy path was triggered. `@tiptap/extension-link` confirmed as separate top-level dep in v3, matching the research prediction. No worktree leakage. No build errors. No peer-dep ERRORS under React 19 (only the standard ignored-build-script warnings for esbuild/msw/sharp/unrs-resolver — pre-existing, unrelated).

The `+4.4 KB` figure that appeared in the Next.js CLI build output for `/` is route-level overhead (192 KB), not chunk-level First Load JS (187.6 KB). The bundle-budget spec measures the chunk-set total directly from `.next/static/chunks/`, which is the gating number. Documented in the bundle_evidence array as a clarification note.

## Forward Link to Plan 02

Plan 02 (SFRichEditor implementation, RE-01..RE-04 + RE-06) consumes:

1. **`components/sf/sf-rich-editor.tsx`** — replace `export {};` with the real `SFRichEditor` component. The `_dep_re_01_decision` block stays at top of file.
2. **`app/globals.css` `@layer signalframeux` block** — already in place; `injectCSS: false` on every `useEditor()` call in the implementation MUST pair with this block.
3. **Tiptap deps** — already installed; consume via `import { useEditor, EditorContent } from '@tiptap/react'`, `import StarterKit from '@tiptap/starter-kit'`, `import Link from '@tiptap/extension-link'`.

The SSR guard architecture (`immediatelyRender: false` on every `useEditor()`, `ssr: false` on the `next/dynamic` lazy wrapper, `injectCSS: false` paired with the @layer block) is fully scoped in 73-RESEARCH.md §SSR Guard Architecture and §ProseMirror CSS Isolation Architecture.

## Self-Check: PASSED

Verified post-creation:

- `components/sf/sf-rich-editor.tsx` — exists, 7 schema fields, no TBD/template placeholders, `version: "3.22.5"`, `Measurement command: rm -rf .next/cache .next` literal, `ANALYZE=true pnpm build` literal, `PASS` literal, 14 bundle_evidence array entries
- `app/globals.css` — `@layer signalframeux` count: 1, `.ProseMirror` selector count: 10, all selectors inside the signalframeux block, 0 `border-radius` inside `.ProseMirror`
- `components/sf/index.ts` — `sf-rich-editor` count: 0 (Pattern B holds)
- `next.config.ts` — `@tiptap` count: 0 (D-04 lock holds)
- `app/`, `components/`, `lib/` Tiptap CSS imports: 0 matches
- `tests/v1.8-phase63-1-bundle-budget.spec.ts`: PASS (187.6 KB / 200 KB)
- Three commits exist on git log: `9afa1fe`, `b3be861`, `b1ef026`
- `git status --porcelain`: clean
