---
phase: 73
slug: sfricheditor
status: closed
nyquist_compliant: true
wave_0_complete: true
created: 2026-05-01
closed: 2026-05-02
---

# Phase 73 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright + axe-core (E2E + a11y) · @next/bundle-analyzer (`ANALYZE=true pnpm build`) |
| **Config file** | `playwright.config.ts` · `next.config.ts` (ANALYZE env) |
| **Quick run command** | `pnpm exec playwright test tests/v1.10-phase73-sf-rich-editor*.spec.ts --reporter=line` |
| **Full suite command** | `pnpm exec playwright test tests/v1.10-phase73-sf-rich-editor*.spec.ts --project=chromium && rm -rf .next/cache .next && ANALYZE=true pnpm build && pnpm exec playwright test tests/v1.8-phase63-1-bundle-budget.spec.ts --project=chromium` |
| **Estimated runtime** | ~25s Playwright + axe (Tiptap mount adds ~5s vs Phase 72); ~140s incl. clean ANALYZE build |

---

## Sampling Rate

- **After every task commit:** Run `pnpm exec playwright test tests/v1.10-phase73-sf-rich-editor*.spec.ts --grep "{tag for that task}" --project=chromium`
- **After every plan wave:** Run `pnpm exec playwright test tests/v1.10-phase73-sf-rich-editor*.spec.ts --project=chromium`
- **Before `/pde:verify-work`:** Full suite green + bundle evidence captured (`@tiptap/*` and `prosemirror-*` MUST NOT appear in homepage `/` First Load chunk; SFRichEditor and SFRichEditorLazy MUST be absent from `components/sf/index.ts`)
- **Max feedback latency:** 30 seconds (per-task quick run)

---

## Per-Task Verification Map

> Per-task rows populated post-execution. Each row maps a single predicate cluster to a verifiable command and a measured outcome. Sources: `73-RESEARCH.md` Validation Architecture (lines 781–860).

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 73-01-01 | 01 | 1 | DEP-02 | tiptap-pre-decision | `_dep_re_01_decision` 7 fields committed before `pnpm add` | grep | `grep -c "decided:\|audit:\|dep_added:\|version:\|rationale:\|bundle_evidence:\|review_gate:" components/sf/sf-rich-editor.tsx` (= 7) | ✅ | ✅ green |
| 73-01-02 | 01 | 1 | DEP-02 | bundle-evidence-not-estimated | `bundle_evidence` contains "Measurement command" literal + numeric KB values + "PASS" | grep | `grep -q "Measurement command: rm -rf .next/cache .next" components/sf/sf-rich-editor.tsx` | ✅ | ✅ green |
| 73-01-03 | 01 | 1 | RE-04 | injectCSS-leak | `@layer signalframeux` block in globals.css contains ≥4 `.ProseMirror` rules | grep | `awk '/@layer signalframeux/,/^}/' app/globals.css \| grep -c "ProseMirror"` (≥ 4) | ✅ | ✅ green |
| 73-01-04 | 01 | 1 | RE-04 | tiptap-css-import | No Tiptap/ProseMirror CSS file imported anywhere | grep | `grep -r "tiptap.*\.css\|prosemirror.*\.css" app/ components/ lib/` (0 actual imports) | ✅ | ✅ green |
| 73-02-01 | 02 | 2 | RE-04 | ssr-crash | `immediatelyRender: false` on every `useEditor()` invocation | grep | `grep -c "immediatelyRender: false" components/sf/sf-rich-editor.tsx` (= 1, parity with `useEditor(`) | ✅ | ✅ green |
| 73-02-02 | 02 | 2 | RE-04 | injectCSS-leak | `injectCSS: false` on every `useEditor()` invocation | grep | `grep -c "injectCSS: false" components/sf/sf-rich-editor.tsx` (= 1) | ✅ | ✅ green |
| 73-02-03 | 02 | 2 | RE-03 | controlled-loop-bug | `editor.getHTML() === value` loop guard present in controlled-sync useEffect | grep | `grep -q "editor.getHTML() === value" components/sf/sf-rich-editor.tsx` | ✅ | ✅ green |
| 73-02-04 | 02 | 2 | RE-06 | anti-feature-undoc | `Anti-features NOT shipped` JSDoc block present | grep | `grep -q "Anti-features NOT shipped" components/sf/sf-rich-editor.tsx` | ✅ | ✅ green |
| 73-02-05 | 02 | 2 | RE-05 | tiptap-leak-via-barrel | SFRichEditor + SFRichEditorLazy absent from barrel | grep | `grep -c "sf-rich-editor\|SFRichEditor" components/sf/index.ts` (= 0) | ✅ | ✅ green |
| 73-02-06 | 02 | 2 | RE-05 | ssr-crash | `ssr: false` present in lazy wrapper | grep | `grep -c "ssr: false" components/sf/sf-rich-editor-lazy.tsx` (= 2) | ✅ | ✅ green |
| 73-02-07 | 02 | 2 | RE-01 | active-state-stale | `shouldRerenderOnTransaction: true` on `useEditor` (Tiptap v3 default flipped to false) — gap-closure at commit `65a2002` | grep | `grep -q "shouldRerenderOnTransaction: true" components/sf/sf-rich-editor.tsx` | ✅ | ✅ green |
| 73-03-01 | 03 | 3 | TST-03 | vacuous-green | `[contenteditable="true"]` toBeVisible BEFORE every `axe.analyze()` | playwright+axe | `pnpm exec playwright test tests/v1.10-phase73-sf-rich-editor-axe.spec.ts --project=chromium` (5/5 PASS) | ✅ | ✅ green |
| 73-03-02 | 03 | 3 | TST-03 | toolbar-a11y | Zero axe violations across 3 fixture states (empty / with-content / read-only) | playwright+axe | `pnpm exec playwright test tests/v1.10-phase73-sf-rich-editor-axe.spec.ts --project=chromium` | ✅ | ✅ green |
| 73-03-03 | 03 | 3 | RE-01 / RE-02 / RE-03 | toolbar + controlled-API + keyboard-nav | 10 acceptance assertions (data-active, controlled value/onChange, readOnly, defaultValue, Bold reactivity, Link prompt, Escape focus-return) | playwright | `pnpm exec playwright test tests/v1.10-phase73-sf-rich-editor.spec.ts --project=chromium` (10/10 PASS) | ✅ | ✅ green |
| 73-03-04 | 03 | 3 | RE-05 | tiptap-leak-via-barrel | `@tiptap/*` + `prosemirror-*` absent from homepage First Load chunk manifest | shell+node | `node -e "const m=JSON.parse(require('fs').readFileSync('.next/app-build-manifest.json','utf8')); const h=JSON.stringify(m.pages['/page']||[]); console.log(/tiptap|prosemirror|starter.kit/.test(h)?'FAIL':'PASS')"` | ✅ | ✅ green (PASS) |
| 73-03-05 | 03 | 3 | RE-05 | budget-exceeded | Homepage First Load JS ≤ 200 KB gzip (CLAUDE.md hard constraint, BND-06) | playwright | `pnpm exec playwright test tests/v1.8-phase63-1-bundle-budget.spec.ts --project=chromium` (PASS at 187.7 KB / 200 KB) | ✅ | ✅ green |
| 73-03-06 | 03 | 3 | RE-05 | registry-deferral | `public/r/sf-rich-editor.json` absent + `public/r/registry.json` `sf-rich-editor` count = 0 | shell | `grep -c "sf-rich-editor" public/r/registry.json` (= 0) AND `! test -f public/r/sf-rich-editor.json` | ✅ | ✅ green |
| 73-03-07 | 03 | 3 | RE-06 | anti-feature-leak | H4–H6 + BubbleMenu/FloatingMenu + FontFamily/TextStyle absent from impl | grep | `grep -c "level: [456]" components/sf/sf-rich-editor.tsx` (= 0); `grep -c "BubbleMenu\|FloatingMenu" ...` (= 0); `grep -c "FontFamily\|TextStyle" ...` (= 0) | ✅ | ✅ green |
| 73-03-08 | 03 | 3 | DEP-02 | optimizePackageImports-add | `@tiptap/*` absent from `next.config.ts` `optimizePackageImports` (D-04 chunk-id stability lock) | grep | `grep -c "@tiptap" next.config.ts` (= 0) | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `tests/v1.10-phase73-sf-rich-editor.spec.ts` — Playwright spec covering RE-01 (toolbar buttons + active-state), RE-02 (link/code), RE-03 (controlled API + readOnly + defaultValue), keyboard nav (Tab/Escape), `data-active` attribute assertions
- [x] `tests/v1.10-phase73-sf-rich-editor-axe.spec.ts` — axe-core spec covering toolbar role, button-name, region, color-contrast on contenteditable surface; vacuous-green guard asserting `[contenteditable="true"]` is visible before `analyze()`
- [x] `app/dev-playground/sf-rich-editor/page.tsx` — fixture page mounting ≥4 sections (uncontrolled default, controlled value+onChange, readOnly with rendered HTML, character-count display)
- [x] `_dep_re_01_decision` block authored in `components/sf/sf-rich-editor.tsx` BEFORE `pnpm add @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-link` runs — block contains 7 fields (`decided` / `audit` / `dep_added` / `version` / `rationale` / `bundle_evidence` / `review_gate`); bundle_evidence populated AFTER `ANALYZE=true pnpm build` produces measured KB output
- [x] No new framework installs — Playwright + axe-core already present (Phase 71/72 precedent)

*Wave-0 stubs landed within Plan 03 per Phase 71 precedent. TDD-light interpretation realized: impl in Plan 02, fixture + tests in Plan 03 — same-phase, same-cohort, ratifying the Phase 71 plan-set pattern.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| ProseMirror content area honors `--sfx-*` token stack — zero system-font leakage, zero rounded corners, blessed spacing inside lists/blockquotes | RE-04 (cross-cutting) | Visual perception of typography + spacing inside contenteditable surfaces; pixel-diff brittle on text rendering across OS font stacks | Open `/dev-playground/sf-rich-editor` → type one paragraph + one H1 + one bulleted list + one blockquote; confirm font-family matches body Inter, no Times/serif fallback; confirm zero border-radius; confirm list-item / blockquote margins land on blessed stops; toggle theme to confirm `--sfx-foreground` color updates inside `.ProseMirror` |
| FRAME/SIGNAL register: editor aesthetics align with DU/TDR — toolbar buttons share visual register with SFButton, active-state uses primary slot color (no hardcoded magenta), no decorative shadow | RE-01 / RE-04 (cross-cutting) | Aesthetic register is human-judged | Side-by-side compare toolbar with SFButton + SFInput on same playground page; confirm visual consistency with shipped v1.9 register; verify no `--sfx-magenta` literal in active-state styling (Cluster-C policy) |
| Tab key behavior inside contenteditable (focus-trap risk) | RE-03 / TST-03 | ProseMirror's Tab default differs from form-element Tab; focus-management is interaction-feel, not predicate-checkable | Open playground → Tab to editor → confirm Tab does not insert literal tab inside content (or document the deviation); Press Escape → focus returns to first toolbar button (MVP escape-hatch documented in JSDoc) |
| Light + dark mode parity for editor surface | RE-04 (cross-cutting) | Per-theme rendering on contenteditable surface best confirmed by eye | Toggle theme on `/dev-playground/sf-rich-editor`; confirm content area background, foreground text, list bullets, blockquote border, toolbar button surfaces all read correctly in both themes; no Tiptap default colors leak |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** auditor sign-off `nyquist_compliant: true` recorded post-execution 2026-05-02 — full Phase 73 test suite green (15/15 tests across 2 specs); bundle audit PASS (187.7 KB / 200 KB; Tiptap absent from homepage chunks); barrel non-export + D-04 lock + registry-deferral all hold.
