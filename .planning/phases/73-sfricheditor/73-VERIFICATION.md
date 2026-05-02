---
phase: 73-sfricheditor
verified: 2026-05-01T00:00:00Z
status: passed
score: 8/8 must-haves verified
truths_score: 8/8
artifacts_score: 8/8
key_links_score: 7/7
requirements_score: 8/8
re_verification: null
human_verification:
  - test: "Open /dev-playground/sf-rich-editor; verify ProseMirror content area uses Inter (no system serif), zero rounded corners on toolbar, list margins on blessed stops, theme toggle propagates --sfx-foreground inside .ProseMirror"
    expected: "Token cascade holds; no Tiptap default colors leak"
    why_human: "Visual perception of typography + spacing + theme parity inside contenteditable surface — pixel-diff brittle on text rendering across OS font stacks (documented in 73-VALIDATION.md Manual-Only Verifications)"
  - test: "Tab into editor → confirm Tab does not insert literal tab inside ProseMirror content (or document deviation); press Escape → focus visibly returns to first toolbar button"
    expected: "Escape focus-return is observable to keyboard users"
    why_human: "Focus-management is interaction-feel rather than predicate-checkable; Escape return is automated-tested via document.activeElement but visible focus-ring is not"
  - test: "Toolbar arrow-key roving — press ArrowRight repeatedly inside toolbar"
    expected: "DOM focus visibly travels along buttons (per WCAG APG Toolbar pattern)"
    why_human: "REVIEW WR-01 documented that focusedToolbarIndex state updates but DOM focus never explicitly moves; advisory only — does not block ship per REVIEW status"
---

# Phase 73: SFRichEditor Verification Report

**Phase Goal:** Deliver `SFRichEditor` as a Tiptap-based ProseMirror primitive that ships RE-01..06 (toolbar, link/code, controlled API, SSR/CSS isolation, P3 lazy, anti-feature documentation), satisfies DEP-02 (`_dep_re_01_decision` ratified with measured bundle evidence), and passes TST-03 (Playwright + axe-core same-phase). Bundle headroom (200 KB hard target) preserved; D-04 chunk-id lock and Pattern B barrel non-export upheld.

**Verified:** 2026-05-01
**Status:** passed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| #   | Truth                                                                                                       | Status      | Evidence                                                                                                                                |
| --- | ----------------------------------------------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | SFRichEditor renders a 13-button toolbar with literal aria-labels (RE-01 + RE-02)                            | VERIFIED    | sf-rich-editor.tsx contains `aria-label=` 13× + `role="toolbar"` + 13 expected labels referenced in acceptance spec loop assertion       |
| 2   | Controlled API (value/onChange/defaultValue) + readOnly conditional render works without infinite loop (RE-03) | VERIFIED    | `editor.getHTML() === value` loop guard count = 2 (effect + comment); `{!readOnly && (` conditional render count = 2; setEditable sync useEffect present |
| 3   | Three-layer SSR guard composition: ssr:false on lazy + immediatelyRender:false + injectCSS:false on useEditor (RE-04) | VERIFIED    | useEditor( count = 1, immediatelyRender:false count = 1, injectCSS:false count = 1 → strict parity; ssr:false count = 2 in lazy wrapper |
| 4   | `@layer signalframeux { .ProseMirror ... }` block in app/globals.css supersedes Tiptap's injectCSS default (RE-04) | VERIFIED    | Block at globals.css:1358–1397; 9 .ProseMirror selectors covering p / h1-h4 / ul/ol / li / blockquote; placed AFTER @layer utilities    |
| 5   | P3 lazy isolation — Tiptap absent from homepage First Load chunk; SFRichEditor and SFRichEditorLazy absent from sf/index.ts barrel (RE-05) | VERIFIED    | sf/index.ts grep "sf-rich-editor\|SFRichEditor" = 0; next.config.ts grep "@tiptap" = 0 (D-04 lock holds); next/dynamic({ssr:false}) in lazy wrapper |
| 6   | RE-06 anti-features documented in JSDoc with rationale and absent from implementation                        | VERIFIED    | "Anti-features NOT shipped" block present; level:[456] count = 0; BubbleMenu/FloatingMenu count = 0; FontFamily/TextStyle count = 0     |
| 7   | DEP-02 — _dep_re_01_decision 7-field block with measured bundle_evidence (DEP-02)                            | VERIFIED    | All 7 schema fields present at sf-rich-editor.tsx:27–73; "Measurement command: rm -rf .next/cache .next" literal + "ANALYZE=true pnpm build" + "PASS" all present |
| 8   | TST-03 — Playwright + axe-core specs ship same-phase, with vacuous-green guard (TST-03)                      | VERIFIED    | Both spec files exist; toBeVisible({timeout:10000}) on [contenteditable] guards every analyze(); 5 analyze() calls + 3 toHaveLength(0) violations assertions; 73-VALIDATION.md `nyquist_compliant: true` |

**Score:** 8 / 8 truths verified

---

### Required Artifacts

| Artifact                                                       | Expected                                                                                  | Status      | Details                                                                                                                  |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------ |
| `components/sf/sf-rich-editor.tsx`                             | 426 LOC; full impl + _dep_re_01_decision block; 13-button toolbar; SSR guards; RE-06 JSDoc | VERIFIED    | Exists at 426 LOC (≥ 280 plan minimum); `"use client"` line 1; `export function SFRichEditor` + `SFRichEditorProps` interface; all grep predicates pass |
| `components/sf/sf-rich-editor-lazy.tsx`                        | P3 lazy wrapper using next/dynamic({ssr:false}) + SFSkeleton                              | VERIFIED    | Exists at 45 LOC (≥ 30 plan minimum); ssr: false present in dynamic options; SFSkeleton imported from barrel; `export function SFRichEditorLazy` |
| `components/sf/index.ts`                                       | Pattern B contract — sf-rich-editor MUST be absent                                        | VERIFIED    | grep -c "sf-rich-editor\|SFRichEditor" = 0                                                                               |
| `next.config.ts`                                               | D-04 lock — @tiptap MUST NOT be in optimizePackageImports                                  | VERIFIED    | grep -c "@tiptap" = 0; 8-entry optimizePackageImports list unchanged from Phase 67 baseline                              |
| `app/globals.css`                                              | First @layer signalframeux block with ≥4 .ProseMirror element rules                       | VERIFIED    | Block at 1358–1397; 9 .ProseMirror selector rules (root + p + h1-h4 + ul/ol + li + blockquote); placed after @layer utilities; tokens use blessed stops |
| `app/dev-playground/sf-rich-editor/page.tsx`                   | Fixture mounts ≥4 testid sections; imports SFRichEditorLazy from direct path              | VERIFIED    | 4 fixture-* testids (uncontrolled-empty, controlled, readonly, default-value); `from "@/components/sf/sf-rich-editor-lazy"` direct path |
| `stories/sf-rich-editor.stories.tsx`                           | 4 story exports + chromatic.delay=500 (meta + per-story)                                  | VERIFIED    | 4 exports (Default, WithContent, ReadOnly, Controlled); delay:500 count = 5 (1 meta + 4 per-story belt-and-suspenders)   |
| `tests/v1.10-phase73-sf-rich-editor*.spec.ts`                  | Playwright + axe-core specs                                                                | VERIFIED    | Both files exist (177 + 173 LOC); 10 acceptance + 5 axe tests; vacuous-green guard mandatory before every analyze() call  |

---

### Key Link Verification

| From                                          | To                                            | Via                                                              | Status      | Details                                                                                                          |
| --------------------------------------------- | --------------------------------------------- | ---------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------- |
| sf-rich-editor.tsx                            | sf/index.ts                                   | ABSENCE — must NOT appear in barrel                              | VERIFIED    | grep returns 0                                                                                                   |
| sf-rich-editor.tsx                            | next.config.ts                                | ABSENCE — @tiptap must NOT appear in optimizePackageImports      | VERIFIED    | grep returns 0                                                                                                   |
| sf-rich-editor.tsx                            | sf-button.tsx (via barrel)                    | `import { SFButton } from "@/components/sf"`                     | VERIFIED    | line 79 import present; SFButton consumed for all 13 toolbar buttons with intent=ghost size=sm                  |
| sf-rich-editor-lazy.tsx                       | sf-rich-editor.tsx                            | next/dynamic import (NOT static)                                 | VERIFIED    | dynamic() wrapping import("@/components/sf/sf-rich-editor") with ssr:false; SFSkeleton loading                  |
| sf-rich-editor-lazy.tsx                       | sf/index.ts                                   | ABSENCE — SFRichEditorLazy must NOT appear in barrel             | VERIFIED    | grep returns 0                                                                                                   |
| app/dev-playground/sf-rich-editor/page.tsx    | sf-rich-editor-lazy.tsx                       | Direct import (not barrel)                                       | VERIFIED    | `from "@/components/sf/sf-rich-editor-lazy"` line 17                                                            |
| app/globals.css                               | sf-rich-editor.tsx                            | injectCSS:false pairing — @layer block IS the stylesheet         | VERIFIED    | injectCSS:false on useEditor + 9 .ProseMirror rules in @layer signalframeux; zero Tiptap CSS imports anywhere   |

**Score:** 7 / 7 key links verified

---

### Requirements Coverage

| Requirement | Source Plan | Description                                                                                                          | Status     | Evidence                                                                                                              |
| ----------- | ----------- | -------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------- |
| **RE-01**   | 73-02       | Core toolbar — bold/italic/underline/strike, H1-H3, lists, blockquote; data-active via SFButton; placeholder + char count | SATISFIED  | 13-button toolbar with role=toolbar + 13 aria-labels; data-active = isActive() \|\| undefined pattern; editor.getText().length char count with aria-live=polite; placeholder prop forwarded to ProseMirror data-placeholder attribute |
| **RE-02**   | 73-02       | Code block + inline code + link extension                                                                              | SATISFIED  | Inline code + Code block buttons in List+Block group; Link button with window.prompt URL collection; `@tiptap/extension-link@3.22.5` installed and Link.configure({openOnClick:false}) registered |
| **RE-03**   | 73-02       | Controlled (value+onChange) + uncontrolled (defaultValue) + readOnly + immediatelyRender:false                          | SATISFIED  | Loop guard `editor.getHTML() === value` + setContent(value, {emitUpdate:false}); readOnly via {!readOnly && (...} conditional render NOT display:none; setEditable sync useEffect; immediatelyRender:false on useEditor; Escape returns focus to first toolbar button |
| **RE-04**   | 73-01,02    | injectCSS:false + @layer signalframeux .ProseMirror rules; NO Tiptap CSS imports                                       | SATISFIED  | injectCSS:false on useEditor; @layer signalframeux block at globals.css:1358; 9 .ProseMirror element rules; grep "tiptap.*\.css\|prosemirror.*\.css" returns 0 actual imports (only one comment-string match in sf-rich-editor.tsx prose-doc) |
| **RE-05**   | 73-02       | P3 lazy via next/dynamic({ssr:false}); NOT in sf/index.ts barrel                                                       | SATISFIED  | sf-rich-editor-lazy.tsx ships with ssr:false; sf/index.ts grep = 0; bundle audit confirms @tiptap/* absent from homepage chunks (Plan 03 manifest probe + bundle-budget spec PASS at 187.7 KB) |
| **RE-06**   | 73-02       | Anti-features documented + absent: H4-H6, font picker, color picker, alignment, floating toolbar, collaborative         | SATISFIED  | "Anti-features NOT shipped" JSDoc block at lines 82–100 names all 6 with rationale; level:[456] = 0; BubbleMenu/FloatingMenu = 0; FontFamily/TextStyle = 0 |
| **DEP-02**  | 73-01       | _dep_re_01_decision 7-field ratification block with measured bundle_evidence                                            | SATISFIED  | All 7 schema fields populated at sf-rich-editor.tsx:27–73; version=3.22.5; "Measurement command: rm -rf .next/cache .next && ANALYZE=true pnpm build" literal; "PASS" literal for tiptap-absent check; review_gate clause for Tiptap v4 |
| **TST-03**  | 73-03       | Playwright + axe-core same-phase                                                                                        | SATISFIED  | Both specs ship in tests/v1.10-phase73-sf-rich-editor*.spec.ts; vacuous-green guard mandatory; covers toolbar role + 13 buttons + Bold reactivity + Link prompt + Escape focus-return + zero axe violations across 3 fixture states + region landmark; 73-VALIDATION.md `nyquist_compliant: true` |

**Score:** 8 / 8 requirements satisfied. **No ORPHANED requirements** — all Phase 73 IDs in REQUIREMENTS.md (lines 132–139) are claimed by Plans 01/02/03 declared `requirements:` frontmatter.

---

### Anti-Patterns Found

| File                              | Line     | Pattern                                                                              | Severity   | Impact                                                                                              |
| --------------------------------- | -------- | ------------------------------------------------------------------------------------ | ---------- | --------------------------------------------------------------------------------------------------- |
| sf-rich-editor.tsx                | 259      | `data-active={editor.isActive(label.toLowerCase()) \|\| isActive \|\| undefined}` (dead branch) | Info       | REVIEW IN-01 — `isActive` is already `editor.isActive(name)`; the chained fallback never adds value. No correctness defect; zero behavioral impact. Advisory in 73-REVIEW.md |
| sf-rich-editor-lazy.tsx           | 37       | `h-[200px]` arbitrary pixel value                                                      | Info       | REVIEW IN-03 — not on blessed-stops ladder. Skeleton placeholder height; no consumer impact. Advisory |
| dev-playground/sf-rich-editor/page.tsx | 50  | `max-h-[120px]` arbitrary pixel value                                                  | Info       | REVIEW IN-04 — fixture-only, not in shipped surface. Advisory                                       |
| stories/sf-rich-editor.stories.tsx | 24-69   | per-story chromatic.delay=500 duplicates meta-level inheritance verbatim 4× (verbose) | Info       | REVIEW IN-05 — intentional belt-and-suspenders per Plan 02 decision. Advisory only                  |
| sf-rich-editor.tsx                | (toolbar handler) | Roving tabIndex updates state but never moves DOM focus on ArrowLeft/ArrowRight | Warning    | REVIEW WR-01 — WCAG APG Toolbar pattern partially implemented; tabindex changes but focus-call missing. Documented in REVIEW; deferred for code-review-fix; flagged for human verification |
| sf-rich-editor.tsx                | (toolbar handler) | Home/End keys missing from toolbar keyboard model                                  | Warning    | REVIEW WR-02 — gap vs WCAG APG; deferred for code-review-fix                                          |
| sf-rich-editor.tsx                | 401–406  | Escape focus-return targets `[tabindex='0']`, brittle if user has arrow-navigated      | Warning    | REVIEW WR-03 — works for default-state user but not for arrow-navigated state. Deferred for code-review-fix |
| sf-rich-editor.tsx                | 78,143–144 | Redundant Link.configure() — StarterKit v3 already includes Link extension          | Warning    | REVIEW WR-04 — bundle waste; explicit @tiptap/extension-link top-level dep duplicative. Bundle audit still PASS (Tiptap stays in lazy chunk); deferred for code-review-fix |

**No blocker anti-patterns found.** All warnings are advisory and were captured in 73-REVIEW.md status `issues_found` (4 warnings + 5 info, 0 critical). Per known_context: not a phase-blocker; can be addressed via `/pde:code-review-fix` later.

---

### Re-Verification Metadata

This is the initial verification — no previous VERIFICATION.md exists in the phase directory. `re_verification: null` in frontmatter.

---

## Closeout Notes

**Verification trail evidence:**

- `components/sf/sf-rich-editor.tsx`: 426 LOC; SSR-guard parity (useEditor=1 / immediatelyRender:false=1 / injectCSS:false=1); shouldRerenderOnTransaction:true at line 141 (Plan 02 gap-closure commit `65a2002`); _dep_re_01_decision 7 fields populated at lines 27–73; controlled-loop guard `editor.getHTML() === value` count = 2; "Anti-features NOT shipped" JSDoc count = 1; level:[456] = 0; BubbleMenu/FloatingMenu = 0; FontFamily/TextStyle = 0; rounded-(sm|md|lg|xl|2xl|full) = 0; aria-label = 13 (matches 13-button toolbar contract).
- `components/sf/sf-rich-editor-lazy.tsx`: 45 LOC; ssr:false count = 2; SFSkeleton imported from barrel; export function SFRichEditorLazy.
- `components/sf/index.ts`: grep "sf-rich-editor\|SFRichEditor" = 0 (Pattern B preserved).
- `next.config.ts`: grep "@tiptap" = 0 (D-04 lock holds); 8-entry optimizePackageImports list unchanged from Phase 67 baseline.
- `app/globals.css`: @layer signalframeux block at 1358–1397; 9 .ProseMirror selectors; placed AFTER @layer utilities; before KEYFRAMES section. No Tiptap/ProseMirror CSS imports anywhere in app/components/lib (only one prose-comment match in sf-rich-editor.tsx).
- `package.json`: @tiptap/{react,pm,starter-kit,extension-link} all at 3.22.5 dependency declarations.
- `public/r/registry.json`: grep "sf-rich-editor" = 0 (registry-deferral invariant — Phase 76 REG-01 owns this).
- `public/r/sf-rich-editor.json`: ABSENT on disk (registry-deferral invariant).
- `app/dev-playground/sf-rich-editor/page.tsx`: 4 fixture-* testid sections; imports SFRichEditorLazy from direct path.
- `stories/sf-rich-editor.stories.tsx`: 4 story exports; delay:500 count = 5.
- `tests/v1.10-phase73-sf-rich-editor.spec.ts`: 177 LOC; 10 acceptance tests; vacuous-green guard in beforeEach.
- `tests/v1.10-phase73-sf-rich-editor-axe.spec.ts`: 173 LOC; 5 axe tests; toBeVisible() guard before every analyze(); 3 toHaveLength(0) violations assertions.
- `73-VALIDATION.md`: nyquist_compliant: true; status: closed; 18 per-task rows green; all 6 sign-off boxes checked; all 5 Wave 0 boxes checked.

**Bundle posture:** 187.7 KB / 200 KB homepage First Load JS (12.3 KB headroom UNCHANGED from Plan 02 baseline). Tiptap absent from homepage chunks per `73-02-SUMMARY.md` and `73-03-SUMMARY.md` `tiptap_in_homepage_chunks: PASS` metric.

**Test execution:** Per `known_context`, tests are local-only (Playwright `baseURL: http://localhost:3000` with conditional CI webServer). 73-VALIDATION.md `nyquist_compliant: true` and 73-03-SUMMARY.md PASS counts (10/10 acceptance + 5/5 axe + 1/1 bundle-budget) carry forward; verifier did not re-run the suite. No on-disk evidence contradicts these PASS counts.

**Locks held throughout phase:**

- Pattern B (barrel non-export): HOLD
- D-04 (chunk-id stability): HOLD
- Cluster-C (token-only colors): HOLD (active-state via `cn(isActive && "bg-foreground text-background")`; 0 hex; 0 magenta literals)
- RE-06 (anti-features absent): HOLD
- Registry-deferral (Phase 71 Pattern B precedent): HOLD
- Zero border-radius (CLAUDE.md): HOLD
- Blessed spacing stops: HOLD inside .ProseMirror block; advisory drift on 2 arbitrary-px values (h-[200px], max-h-[120px]) flagged in REVIEW IN-03/IN-04
- Plan 02 gap-closure (`shouldRerenderOnTransaction: true`): HOLD + regression-tested via Bold data-active acceptance test

---

_Verified: 2026-05-01_
_Verifier: Claude (gsd-verifier, Opus 4.7 1M context)_
