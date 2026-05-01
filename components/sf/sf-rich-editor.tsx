"use client";

/**
 * SFRichEditor — FRAME layer ProseMirror rich text editor (Pattern B, P3 lazy).
 *
 * IMPLEMENTATION SHIPS IN PLAN 02. This file currently hosts only the
 * _dep_re_01_decision ratification block (DEP-02) per the v1.10
 * dep-decision-at-plan-time invariant.
 *
 * Pattern B contract (DO NOT VIOLATE):
 *   - NEVER export from components/sf/index.ts barrel
 *   - NEVER add @tiptap/* to next.config.ts optimizePackageImports (D-04 lock)
 *   - Consumers import via @/components/sf/sf-rich-editor-lazy (lands in Plan 02)
 *   - Direct import of this file is SUPPORTED but only behind next/dynamic ssr:false
 *
 * CSS isolation contract (DO NOT VIOLATE):
 *   - ALWAYS pass injectCSS: false on every useEditor() call in this file
 *   - ALWAYS pass immediatelyRender: false on every useEditor() call
 *   - The @layer signalframeux { .ProseMirror ... } block in app/globals.css
 *     IS the stylesheet replacement — DO NOT import any Tiptap/ProseMirror CSS file
 *
 * Character count: delivered via editor.getText().length (zero-dep) in Plan 02.
 * @tiptap/extension-character-count is NOT a dep — documented in _dep_re_01_decision.
 */

// ---------------------------------------------------------------------------
// _dep_re_01_decision — runtime-dep ratification block (DEP-02)
//
// Schema precedent: _dep_dt_01_decision at components/sf/sf-data-table.tsx
// (Phase 71 Plan 01 — field-for-field identical schema)
//
// _dep_re_01_decision:
//   decided: "2026-05-01"
//   audit: "sf-rich-editor:runtime-dep"
//   dep_added:
//     - "@tiptap/react"
//     - "@tiptap/pm"
//     - "@tiptap/starter-kit"
//     - "@tiptap/extension-link"
//   version: "3.22.5"
//   rationale: |
//     SFRichEditor wraps ProseMirror via Tiptap v3 (useEditor + EditorContent
//     + StarterKit extension model). No viable zero-dep substitute:
//     Quill auto-injects unlayered CSS (overrides @layer signalframeux tokens;
//     no injectCSS:false equivalent). Slate requires a full custom schema and
//     has no first-class toolbar model. Raw ProseMirror requires ~2000 LOC
//     plugin authorship for comparable feature surface.
//     @tiptap/pm replaces individual prosemirror-* packages in v3 (bundle
//     deduplication). @tiptap/extension-link is separate from StarterKit in v3
//     (verified post-install via pnpm list). Character count delivered via
//     editor.getText().length (zero-dep) — @tiptap/extension-character-count
//     NOT added. P3 lazy posture (next/dynamic ssr:false in
//     sf-rich-editor-lazy.tsx, NOT in sf/index.ts barrel, NOT in
//     next.config.ts optimizePackageImports — D-04 chunk-id stability lock
//     holds) keeps homepage First Load JS impact at 0 KB.
//     injectCSS:false + immediatelyRender:false are mandatory SSR/cascade guards
//     — documented in JSDoc and enforced by grep acceptance criteria in
//     73-01-PLAN.md and 73-02-PLAN.md.
//   bundle_evidence:
//     - "Homepage / First Load JS pre-add baseline: 187.6 KB gzip (Phase 72 close, MILESTONES.md)"
//     - "Homepage / First Load JS post-add (placeholder file, no impl): 187.6 KB gzip (12 chunks, measured by tests/v1.8-phase63-1-bundle-budget.spec.ts)"
//     - "Headroom remaining: 12.4 KB under 200 KB hard target — UNCHANGED from Phase 72 baseline"
//     - "Delta from placeholder file: 0 KB (export {} has no @tiptap import)"
//     - "Tiptap in homepage First Load chunk: PASS (manifest probe across .next/build-manifest.json + .next/app-build-manifest.json returned PASS for /tiptap|prosemirror|starter.kit/ regex; matching chunks: [])"
//     - "Tiptap lazy chunk: ABSENT from homepage manifest (real chunk lands Plan 02 behind next/dynamic ssr:false)"
//     - "Resolved version: @tiptap/react@3.22.5 (matches @tiptap/pm@3.22.5, @tiptap/starter-kit@3.22.5, @tiptap/extension-link@3.22.5 — verified via pnpm list --depth=0)"
//     - "Measurement command: rm -rf .next/cache .next && ANALYZE=true pnpm build"
//     - "Bundle budget spec: tests/v1.8-phase63-1-bundle-budget.spec.ts PASS (187.6 KB / 200 KB budget)"
//     - "Measurement date: 2026-05-01"
//   review_gate: |
//     Re-evaluate when Tiptap v4 reaches stable release. Re-pin and
//     re-measure if v4 changes API surface (useEditor options, extension
//     model) or bundle profile materially. Also fires if BND budget changes
//     (currently 200 KB hard target from CLAUDE.md) or if D-04 chunk-id
//     stability lock is intentionally broken in a future BND phase.
//   scope: "@tiptap/* runtime deps — single P3 lazy chunk (sf-rich-editor)"
//   ratified_to_main_via: "Phase 73 (Plan 01 commit)"
// ---------------------------------------------------------------------------

// Implementation lands in Plan 02. This export prevents accidental
// barrel inclusion bugs (TypeScript will error if anyone tries to
// import { SFRichEditor } before Plan 02 ships the real symbol).
export {};
