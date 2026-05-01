---
phase: 73
slug: sfricheditor
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-01
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

> Per-task rows populated by planner (PLAN.md generation). Each task in 73-01-PLAN.md / 73-02-PLAN.md / 73-03-PLAN.md MUST have either an `<automated>` block or a Wave-0 dependency reference. Predicate sources are itemized in 73-RESEARCH.md → "Validation Architecture" section (lines 781–860): DEP-02 decision-block predicates, RE-04 CSS isolation predicates, RE-05 P3 lazy + barrel-non-export + bundle-leak predicates, RE-01/02 toolbar functionality predicates, RE-03 controlled-API predicates, RE-06 anti-feature predicates, TST-03 axe-core predicates, Storybook chromatic-delay predicate.

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 73-XX-XX | XX | X | RE-XX / DEP-02 / TST-03 | tiptap-leak-via-barrel; ssr-crash; injectCSS-leak; controlled-loop-bug | {populated by planner from RESEARCH.md predicates} | grep / playwright / axe / shell+node | {populated by planner} | ⬜ pending | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/v1.10-phase73-sf-rich-editor.spec.ts` — Playwright spec covering RE-01 (toolbar buttons + active-state), RE-02 (link/code), RE-03 (controlled API + readOnly + defaultValue), keyboard nav (Tab/Escape), `data-active` attribute assertions
- [ ] `tests/v1.10-phase73-sf-rich-editor-axe.spec.ts` — axe-core spec covering toolbar role, button-name, region, color-contrast on contenteditable surface; vacuous-green guard asserting `[contenteditable="true"]` is visible before `analyze()`
- [ ] `app/dev-playground/sf-rich-editor/page.tsx` — fixture page mounting ≥4 sections (uncontrolled default, controlled value+onChange, readOnly with rendered HTML, character-count display)
- [ ] `_dep_re_01_decision` block authored in `components/sf/sf-rich-editor.tsx` BEFORE `pnpm add @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-link` runs — block contains 7 fields (`decided` / `audit` / `dep_added` / `version` / `rationale` / `bundle_evidence` / `review_gate`); bundle_evidence populated AFTER `ANALYZE=true pnpm build` produces measured KB output
- [ ] No new framework installs — Playwright + axe-core already present (Phase 71/72 precedent)

*Wave-0 stubs land within the test plan (likely Plan 03 per Phase 71 precedent). The TDD-light interpretation: impl in Plan 02, fixture + tests in Plan 03 — same-phase, same-cohort, ratifying the Phase 71 plan-set pattern.*

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

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending (planner populates per-task rows; auditor flips `nyquist_compliant: true` post-execution)
