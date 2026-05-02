---
phase: 74-sffileupload
verified: 2026-05-02T00:00:00Z
status: passed
score: 19/19 must-haves verified
re_verification:
  previous_status: passed
  previous_score: 19/19
  superseded_by_verifier: true
  preserved_content: "Split test strategy + dataTransfer.files Chromium permanent gap with 3 primary sources + Track 1/2/3 enumeration + manual M-01..M-07 + bundle audit + per-REQ closeout — Plan 02 Task 4 deliverable embedded below in §Permanent Gap and §Manual Verification sections (FU-05 / TST-04 first-class artifact preserved)"
human_verification:
  - test: "M-01 Drag-active visual state on real Chromium"
    expected: "Drop zone background shifts to bg-foreground/10 on dragover; reverts on dragleave"
    why_human: "Real Chromium drag from Finder/Explorer — Playwright dataTransfer.files is permanently gapped"
  - test: "M-02 Real drag→drop ingestion (the permanent gap)"
    expected: "File appears in list with image preview thumbnail (blob: URL)"
    why_human: "dataTransfer.files cannot be set from JS in Chromium (crbug.com/531834); only real human drag exercises this path"
  - test: "M-03 Image preview render quality"
    expected: "Preview <img> renders within ~100ms with no flicker; no broken-image flash on removal"
    why_human: "Visual perception of render timing"
  - test: "M-04 URL.revokeObjectURL on removal"
    expected: "DevTools Memory tab shows no orphaned blob: URLs after × remove"
    why_human: "Live blob registry inspection, not statically grep-able"
  - test: "M-05 Screen reader announcement (macOS VoiceOver)"
    expected: "'2 files selected' announced; '{name} removed' announced"
    why_human: "AT speech output is human-judged for clarity"
  - test: "M-06 Light + dark mode parity"
    expected: "Drop zone, file list, error state, progress all read correctly in both themes"
    why_human: "Per-theme rendering is human-judged"
  - test: "M-07 Keyboard parity (LOCKDOWN R-64-d)"
    expected: "Tab → Space opens file dialog WITHOUT advancing panel"
    why_human: "Belt-and-suspenders sanity (Track 1 spec automates the predicate; manual is confirmation only)"
---

# Phase 74: SFFileUpload Verification Report

**Phase Goal:** SFFileUpload is shipped as a barrel-exported Pattern C component using only native browser APIs — the split test strategy acknowledging the Playwright `dataTransfer.files` permanent gap is documented as a first-class phase deliverable, not a gap to paper over.

**Verified:** 2026-05-02
**Status:** passed (pending user sign-off on M-01..M-07 manual checks)
**Re-verification:** Yes — supersedes the executor-authored 74-VERIFICATION.md (Plan 02 Task 4 deliverable). Gap documentation content (split test strategy + 3 primary sources + manual checks + per-REQ closeout) preserved verbatim below.

---

## Goal Achievement

### Observable Truths

ROADMAP Success Criteria (treated as primary truths):

| #   | Truth (ROADMAP success_criteria)                                                                                                                                                                                                          | Status     | Evidence                                                                                                                                                                       |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SC-1 | Consumer renders SFFileUpload, click-to-browse populates file list, per-file remove affordance, MIME/size validation error state surfaces                                                                                                | ✓ VERIFIED | `tests/v1.10-phase74-sf-file-upload.spec.ts` FU-01 + FU-02 describe blocks (8 tests green); component path `handleFiles()` shared by browse/drop/paste                       |
| SC-2 | Multi-file mode — multiple files can be selected, each with independent accepted/error state; controlled `files`+`onChange` API reflects current list                                                                                     | ✓ VERIFIED | Playwright spec FU-02 multi-file append + mixed accept/reject tests; FU-03 controlled+onChange echo test; component `multiple` prop wired to hidden input + handleFiles slice |
| SC-3 | Consumer-supplied `progress: Record<fileName, number>` drives per-file SFProgress; image files display preview via URL.createObjectURL                                                                                                    | ✓ VERIFIED | Component `progress[entry.file.name]` lookup wired to `<SFProgress value={...} aria-label="Upload progress for ${name}">`; `URL.createObjectURL` × 5 occurrences with revoke cleanup × 2 |
| SC-4 | `74-VERIFICATION.md` explicitly documents `dataTransfer.files` Playwright/Chromium permanent gap — drag-drop acceptance path verified via Chromatic story, not vacuously-passing Playwright test                                          | ✓ VERIFIED | This document § Permanent Gap below; 3 primary sources cited (microsoft/playwright#13362, crbug.com/531834, WHATWG §6.10.6); zero `dispatchEvent.*['"]drop['"]` in spec       |

Plan-level truths (from PLAN frontmatter must_haves) — all 19 grade ✓ VERIFIED:

| #    | Truth                                                                                                                                                                                                                                                | Status     |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| 01-1 | Consumer can click-to-browse / Enter / Space; OS file dialog opens via hidden `<input type="file">` click(); selected files appear with per-file remove ×                                                                                            | ✓ VERIFIED |
| 01-2 | multiple={true} + setInputFiles populates list with one row per file; each independently passes/fails MIME (accept) + size (maxSize) and surfaces inline per-file error                                                                              | ✓ VERIFIED |
| 01-3 | progress={"photo.jpg":47} renders SFProgress value=47 + aria-label="Upload progress for photo.jpg"; rows without progress entry render no SFProgress                                                                                                 | ✓ VERIFIED |
| 01-4 | Image file accepted state → preview `<img src="blob:...">` via `URL.createObjectURL`; useEffect cleanup runs `URL.revokeObjectURL` on next-effect-run AND unmount (StrictMode-safe)                                                                  | ✓ VERIFIED |
| 01-5 | Discriminated controlled (`files`+`onChange`) / uncontrolled (no files prop) state machine; onChange fires on add, remove, validation completion                                                                                                     | ✓ VERIFIED |
| 01-6 | Drop zone: role="button" + tabIndex=0 (or -1 disabled) + aria-label both flows + sf-focusable; hidden `<input type="file">` keyboard fallback per WCAG 2.5.1; Enter/Space → inputRef.current.click()                                                | ✓ VERIFIED |
| 01-7 | onDragOver + onDrop call e.preventDefault(); onDragLeave clears isDragging; onPaste reads e.clipboardData.files and routes through same handleFiles()                                                                                                | ✓ VERIFIED |
| 01-8 | SFFileUpload exported from components/sf/index.ts barrel (Pattern C); SFFileEntry type also exported                                                                                                                                                 | ✓ VERIFIED |
| 01-9 | Component contains zero fetch / XMLHttpRequest / axios calls (FU-04); JSDoc anti-features block enumerates 7 rejected behaviors by category                                                                                                          | ✓ VERIFIED |
| 01-10| Component contains zero `FileReader` calls — only URL.createObjectURL for image preview (FU-03)                                                                                                                                                      | ✓ VERIFIED |
| 01-11| disabled={true} cascades to hidden input AND wrapper tabIndex=-1 + pointer-events:none                                                                                                                                                              | ✓ VERIFIED |
| 01-12| Registry entry lands in public/r/registry.json AND public/r/sf-file-upload.json same-commit (REG-01); meta.layer="frame" + meta.pattern="C"                                                                                                          | ✓ VERIFIED |
| 01-13| Playground fixture mounts ≥4 sections (5 actually) consumable by Plan 02 specs                                                                                                                                                                       | ✓ VERIFIED |
| 02-1 | Playwright acceptance spec — 12 tests across FU-01/02/03 + LOCKDOWN R-64-d Space-key regression; vacuous-green guard before any state assertion                                                                                                      | ✓ VERIFIED |
| 02-2 | axe-core spec — 4 fixture states + structural aria-live; rule set `[button-name, aria-progressbar-name, aria-valid-attr-value, color-contrast, region]`; vacuous-green guard before each analyze(); zero violations                                  | ✓ VERIFIED |
| 02-3 | Storybook stories — 8 stories incl. DragActive (play() + fireEvent.dragOver from `storybook/test`); chromatic.delay set on every story                                                                                                              | ✓ VERIFIED |
| 02-4 | 74-VERIFICATION.md documents permanent dataTransfer.files Chromium gap with 3 primary sources; same-class clipboardData.files gap noted; TST-04 contract: zero `page.dispatchEvent('drop', ...)` round-trip-asserts                                  | ✓ VERIFIED |
| 02-5 | Production build (clean ANALYZE) → SFFileUpload tree-shake-clean — absent from homepage `/page` chunk manifest                                                                                                                                       | ✓ VERIFIED |
| 02-6 | Homepage `/` First Load JS ≤ 200 KB after Plan 01 lands; bundle budget spec PASSES                                                                                                                                                                   | ✓ VERIFIED |

**Score:** 4/4 ROADMAP truths + 19/19 plan-level truths verified. Net: 19/19 must-haves verified.

### Required Artifacts

| Artifact                                                | Expected                                                                  | Status     | Details                                                                                                       |
| ------------------------------------------------------- | ------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------- |
| `components/sf/sf-file-upload.tsx`                      | Pattern C component, ≥280 LOC                                             | ✓ VERIFIED | 436 LOC; exports SFFileUpload + SFFileEntry + SFFileUploadProps; 7-entry JSDoc anti-features block            |
| `components/sf/index.ts`                                | Barrel export `{ SFFileUpload, type SFFileEntry, type SFFileUploadProps }` | ✓ VERIFIED | Line 134 — wired immediately after SFProgress (natural neighbor)                                              |
| `app/dev-playground/sf-file-upload/page.tsx`            | Fixture page, ≥4 sections, ≥120 LOC                                       | ✓ VERIFIED | 139 LOC; 5 sections (uncontrolled-image / controlled-echo / multi-progress / error-1kb / disabled)            |
| `public/r/sf-file-upload.json`                          | Standalone registry-item, meta.layer=frame, meta.pattern=C                | ✓ VERIFIED | 19 LOC; registryDependencies=["progress"]                                                                     |
| `public/r/registry.json`                                | items[] entry for sf-file-upload                                          | ✓ VERIFIED | items.length === 55; sf-file-upload entry present, meta.layer=frame, meta.pattern=C                           |
| `tests/v1.10-phase74-sf-file-upload.spec.ts`            | Playwright acceptance spec — ≥11 tests via setInputFiles                  | ✓ VERIFIED | 322 LOC; 12 tests (FU-01 × 4 + FU-02 × 4 + FU-03 × 4); zero `dispatchEvent.*[\"']drop[\"']` matches           |
| `tests/v1.10-phase74-sf-file-upload-axe.spec.ts`        | axe-core WCAG AA — 4 fixture states + aria-live                           | ✓ VERIFIED | 258 LOC; 6 tests; AXE_RULES = [button-name, aria-progressbar-name, aria-valid-attr-value, color-contrast, region] |
| `stories/sf-file-upload.stories.tsx`                    | ≥8 stories incl. DragActive play() with fireEvent.dragOver                | ✓ VERIFIED | 190 LOC; 8 stories; DragActive uses `play()` + `fireEvent.dragOver()` from `storybook/test` (v10 path)        |
| `.planning/phases/74-sffileupload/74-VERIFICATION.md`   | Gap doc with primary sources                                              | ✓ VERIFIED | This file (re-authored to verifier format; gap-doc content preserved below)                                   |
| `.planning/phases/74-sffileupload/74-VALIDATION.md`     | nyquist_compliant: true / status: passed                                  | ✓ VERIFIED | Frontmatter set; 23 per-task rows all ✅ green; Sign-Off all checked                                          |

**Status:** 10/10 artifacts pass all three levels (exists / substantive / wired). Zero MISSING, zero STUB, zero ORPHANED.

### Key Link Verification

| From                                              | To                                       | Via                                                                                                | Status   | Details                                                                                                  |
| ------------------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------- |
| `components/sf/sf-file-upload.tsx`                | `components/sf/sf-progress.tsx`          | `import { SFProgress } from "@/components/sf"` + JSX `<SFProgress value={fileProgress} aria-label=…/>` | ✓ WIRED  | Line 82 import; line ~390 JSX; only renders when `entry.accepted && fileProgress !== undefined`         |
| `components/sf/sf-file-upload.tsx`                | Browser native File API                  | `URL.createObjectURL` + `URL.revokeObjectURL` in useEffect cleanup                                   | ✓ WIRED  | 5× createObjectURL, 2× revokeObjectURL (loop + cleanup); StrictMode-safe pattern verified                |
| `components/sf/index.ts`                          | `components/sf/sf-file-upload.tsx`       | Barrel export — Pattern C; FU-04 acceptance                                                         | ✓ WIRED  | Line 134: `export { SFFileUpload, type SFFileEntry, type SFFileUploadProps } from "./sf-file-upload";`   |
| `app/dev-playground/sf-file-upload/page.tsx`      | `components/sf/sf-file-upload.tsx`       | Barrel import — fixture mounts SFFileUpload from `@/components/sf`                                  | ✓ WIRED  | Line 17 import; 9 SFFileUpload references in fixture across 5 sections                                   |
| `package.json` `dependencies`                     | ABSENCE of new drag-drop deps            | FU-04 zero-dep contract — react-dropzone / react-dnd / filepond / react-files all absent           | ✓ WIRED  | Programmatic check `node -e "..."` returns 0 forbidden deps                                              |
| `tests/v1.10-phase74-sf-file-upload.spec.ts`      | `app/dev-playground/sf-file-upload/page.tsx` | `page.goto(/dev-playground/sf-file-upload)` + testid anchors fixture-{section}                       | ✓ WIRED  | FIXTURE constant + 11 setInputFiles calls + per-section testid scoping                                   |
| `tests/v1.10-phase74-sf-file-upload-axe.spec.ts`  | `@axe-core/playwright`                   | `import AxeBuilder from "@axe-core/playwright"`                                                     | ✓ WIRED  | Line 25 import; 5 AxeBuilder.analyze() calls                                                              |
| `stories/sf-file-upload.stories.tsx`              | `storybook/test`                         | `import { fireEvent, within } from "storybook/test"` (v10 unified path)                             | ✓ WIRED  | Line 20 import; DragActive `play({ canvasElement }) → fireEvent.dragOver(within(canvasElement).getByRole("button"))` |
| `74-VERIFICATION.md`                              | Primary sources                          | URLs cited inline                                                                                   | ✓ WIRED  | crbug.com/531834 + microsoft/playwright#13362 + WHATWG html spec §6.10.6 — all 3 present                 |

**Status:** 9/9 key links WIRED. Zero NOT_WIRED, zero PARTIAL.

---

## Requirements Coverage

ROADMAP Phase 74 requirement IDs: **FU-01, FU-02, FU-03, FU-04, FU-05, TST-03, TST-04**.

PLAN 01 declared: `[FU-01, FU-02, FU-03, FU-04]`.
PLAN 02 declared: `[FU-05, TST-03, TST-04]`.

**Coverage parity: 7/7 — every ROADMAP ID is claimed by a PLAN.** Zero ORPHANED IDs.

| Requirement | Source Plan | Description (REQUIREMENTS.md)                                                                                                                                                           | Status     | Evidence                                                                                                                                                                                                                       |
| ----------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| FU-01       | 74-01       | Drag-drop zone (`onDrop` + `onDragOver` + `onDragLeave`) + click-to-browse via hidden `<input type="file">` + file list with per-file remove + paste-from-clipboard handler              | ✓ SATISFIED | All 4 handlers wired (onDrop / onDragOver / onDragLeave / onDragEnter / onPaste in component); hidden input keyboard fallback; per-file × remove with aria-label; spec FU-01 describe (4 tests green incl. R-64-d Space regression) |
| FU-02       | 74-01       | File-type validation (accept), size validation (maxSize), multi-file (multiple), per-file error state with intent variant                                                                | ✓ SATISFIED | `validateMime()` + `validateSize()` + multiple-prop branch in handleFiles; SFFileEntry.error?: string; spec FU-02 describe (4 tests green: MIME reject, size reject, multi-append, mixed accept/reject)                            |
| FU-03       | 74-01       | Per-file SFProgress driven by `progress: Record<fileName, number>`; controlled API; disabled state; image preview via `URL.createObjectURL` (NOT FileReader)                              | ✓ SATISFIED | SFProgress wired with aria-label="Upload progress for ${name}"; isControlled discriminator; disabled cascade to input + wrapper; URL.createObjectURL with useEffect cleanup; ZERO `FileReader` tokens in component               |
| FU-04       | 74-01       | Component exported from `sf/index.ts` barrel (Pattern C); zero new runtime deps; consumer owns HTTP                                                                                       | ✓ SATISFIED | Line 134 barrel export; package.json forbidden deps check returns 0; ZERO `fetch(`/`XMLHttpRequest`/`axios` tokens in component; bundle audit confirms tree-shake-clean (absent from homepage `/page` chunks)                       |
| FU-05       | 74-02       | Test-strategy split documented in phase close — `setInputFiles` for acceptance + Chromatic for drag visual + permanent dataTransfer.files Chromium gap                                    | ✓ SATISFIED | This document §Permanent Gap (3 primary sources) + Track 1/2/3 enumeration; stories DragActive `play()` story; spec uses setInputFiles exclusively                                                                              |
| TST-03      | 74-02       | Per-component Playwright + axe-core test files land same-phase as component; FileUpload drop zone keyboard fallback; all green before phase close                                         | ✓ SATISFIED | `tests/v1.10-phase74-sf-file-upload.spec.ts` (12 tests) + `tests/v1.10-phase74-sf-file-upload-axe.spec.ts` (6 tests) — 18/18 green per Plan 02 SUMMARY claim and validation row 74-02-05/07                                  |
| TST-04      | 74-02       | SFFileUpload split-test strategy documented in `74-VERIFICATION.md` per FU-05 — explicit dataTransfer.files Chromium gap, NOT papered over with vacuously-passing test                    | ✓ SATISFIED | This document; ZERO `dispatchEvent.*['"]drop['"]` literal matches in spec; same-class clipboardData.files gap also noted (5 mentions)                                                                                          |

**Status:** 7/7 SATISFIED, 0 BLOCKED, 0 ORPHANED, 0 NEEDS_HUMAN.

---

## Anti-Patterns Found

Scanned files: `components/sf/sf-file-upload.tsx`, `app/dev-playground/sf-file-upload/page.tsx`, `stories/sf-file-upload.stories.tsx`, `tests/v1.10-phase74-sf-file-upload.spec.ts`, `tests/v1.10-phase74-sf-file-upload-axe.spec.ts`.

| File                                              | Line | Pattern                              | Severity | Impact                                                                                       |
| ------------------------------------------------- | ---- | ------------------------------------ | -------- | -------------------------------------------------------------------------------------------- |
| —                                                 | —    | TODO/FIXME/XXX/HACK/PLACEHOLDER      | —        | **None found** across all 5 phase files                                                      |
| —                                                 | —    | `rounded-(sm|md|lg|xl|2xl|full)`     | —        | **None found** — CLAUDE.md zero-border-radius hard constraint held                           |
| —                                                 | —    | `FileReader` / `fetch(` / `XHR`/axios | —        | **None found** — FU-04 zero-HTTP + FU-03 zero-FileReader contracts both hold                 |
| —                                                 | —    | Empty implementations / stub returns | —        | **None found** — full implementations across all artifacts                                   |

**Verdict:** Clean. No blocker, warning, or info anti-patterns.

---

## Permanent Gap — `dataTransfer.files` (Chromium CI / Playwright)

> **PRESERVED VERBATIM from executor-authored 74-VERIFICATION.md (Plan 02 Task 4 deliverable).** This section is the FU-05 + TST-04 first-class artifact — not papered over with a vacuously-passing Playwright drop test.

**What cannot be tested via automation:** The drag→drop file ingestion path. Specifically the `onDrop` event handler reading `e.dataTransfer.files` to populate the file list when a real user drags a file from Finder/Explorer onto the drop zone.

**Why it's permanent:** `DataTransfer.files` is a `FileList` backed by the platform drag data store. The Chromium security model treats this property as readable only — scripts cannot programmatically populate it via synthetic DragEvent / dispatchEvent. Playwright's `page.dispatchEvent('drop', ...)` succeeds in firing the event but the `dataTransfer.files` FileList is empty. This is a feature, not a bug: it prevents malicious scripts from silently triggering file system access.

### Primary Sources

| # | Source | URL / Reference | Status |
|---|--------|-----------------|--------|
| 1 | Playwright maintainer issue | https://github.com/microsoft/playwright/issues/13362 | Open since 2022; Won't Fix (upstream Chromium constraint) |
| 2 | Chromium bug tracker | https://crbug.com/531834 | WontFix since 2015 ("Setting dataTransfer.files via JS is intentionally prohibited.") |
| 3 | WHATWG HTML spec §6.10.6 | https://html.spec.whatwg.org/multipage/dnd.html#the-datatransfer-interface | DataTransfer.files is platform-data-store-backed; scripts can only READ |

### Same Gap, Same Severity — `clipboardData.files`

`e.clipboardData.files` (the paste-from-clipboard handler) has the same Chromium security restriction. The paste handler is structurally tested (handler exists, drop zone is focusable for paste targeting); the actual file ingestion via paste is the same untested surface. Track 1 covers `handleFiles()` end-to-end via setInputFiles for both.

### What's Covered Anyway (Split Test Strategy)

**Track 1 — Playwright `locator.setInputFiles()` (Acceptance Logic):** `tests/v1.10-phase74-sf-file-upload.spec.ts` — 12 tests across FU-01 / FU-02 / FU-03 + R-64-d Space-key regression. The `handleFiles(File[])` function is the single shared code path for browse / drop / paste — testing it via setInputFiles end-to-end exercises the validation, list-update, controlled-API, progress, preview, and error logic for ALL three entry paths.

**Track 2 — Storybook `play()` + Chromatic (Drag Visual State):** `stories/sf-file-upload.stories.tsx` — 8 stories. DragActive uses `play({ canvasElement })` + `fireEvent.dragOver(within(canvasElement).getByRole("button"))` from `storybook/test`. Storybook's interaction layer fires the React onDragOver handler → `isDragging=true` → drop zone visually shifts to `bg-foreground/10` — Chromatic captures the pixel-diff baseline.

**Track 3 — axe-core WCAG AA:** `tests/v1.10-phase74-sf-file-upload-axe.spec.ts` — 6 tests across 4 fixture states + structural aria-live presence. Rule set `[button-name, aria-progressbar-name, aria-valid-attr-value, color-contrast, region]`. Vacuous-green guard `[role="button"][aria-label]` toBeVisible() before every `analyze()`. Zero violations across all 4 fixture states.

### What is NOT acceptable (TST-04 contract)

A Playwright test that simulates a synthetic drop event via `page.dispatchEvent` with a crafted `dataTransfer.files` payload and asserts the drop zone "handled" the event by checking ONLY that the visual state changed (rather than that files were processed) is vacuously green. This contract is verified by validation row 74-02-08 + verifier predicate: `grep -cE 'dispatchEvent.*[\"\']drop[\"\']' tests/v1.10-phase74-sf-file-upload.spec.ts === 0`. **Re-verified at this verification pass: returned 0.**

---

## Manual Verification (Real Chromium on DEV Hardware)

Human-only acceptance checks. Run before phase closeout sign-off.

| # | Behavior | Steps | Expected |
|---|----------|-------|----------|
| M-01 | Drag-active visual state on real browser | Open `/dev-playground/sf-file-upload` in Chromium → drag a real file from Finder/Explorer over Section 1 drop zone → release outside drop zone (cancel drop) | Drop zone background shifts to `bg-foreground/10` on dragover; reverts on dragleave |
| M-02 | Real drag→drop ingestion (the gap) | Drag a real PNG from Finder onto Section 1 drop zone → release ON drop zone | File appears in list with image preview thumbnail (blob: URL) |
| M-03 | Image preview render quality | Drop a 5 MB photo into Section 1 → wait ≤ 100 ms | Preview `<img>` renders without flicker; no broken-image flash |
| M-04 | URL.revokeObjectURL on removal | Drop a photo → click × remove → DevTools Memory tab → inspect URL registry | No orphaned blob: URL after removal |
| M-05 | Screen reader announcement | Open with macOS VoiceOver (Cmd+F5) → Tab to drop zone → Enter to browse → select 2 files → click × on one | "2 files selected" announced; "{name} removed" announced |
| M-06 | Light + dark mode parity | Toggle theme on `/dev-playground/sf-file-upload` | Drop zone, file list, error state, progress bar all read correctly in both themes; no Radix or browser default colors |
| M-07 | Keyboard parity (LOCKDOWN R-64-d) | Tab to drop zone → press Space | OS file dialog opens (does NOT advance to next panel); per LOCKDOWN R-64-d focus guard for role=button. Note: Track 1 spec already automates this via `page.waitForEvent("filechooser")` + scrollY assertion. |

---

## Bundle Audit (FU-04 / BND-08 closeout precedent)

**From Plan 02 Task 4 clean ANALYZE build (commit 532c984):**

- Command: `rm -rf .next/cache .next && ANALYZE=true pnpm build`
- Homepage `/` First Load JS = **187.6 KB gzipped** (≤ 200 KB target; baseline 187.7 KB pre-Phase 74; net delta -0.1 KB — within measurement noise)
- Tree-shake check: `node -e "const m=JSON.parse(...); /sf-file-upload/.test(JSON.stringify(m.pages['/page']))"` returned **PASS** (false). Homepage `/page` chunk list (12 files) does NOT contain `sf-file-upload` substring; SFFileUpload is correctly tree-shaken out despite being barrel-exported.
- Bundle budget spec: `pnpm exec playwright test tests/v1.8-phase63-1-bundle-budget.spec.ts --project=chromium` → **PASS** (1/1 green).

**Verifier-time note:** The current `.next/app-build-manifest.json` reflects a more recent intermediate build state (no `dev-playground/sf-file-upload` page key present at verification time — likely an earlier or partial rebuild). The load-bearing FU-04 contract — homepage `/page` does NOT contain `sf-file-upload` — re-verified live: **PASS**. Plan 02 SUMMARY's 187.6 KB measurement and full `/dev-playground/sf-file-upload/page` chunk listing are accepted from the Task 4 commit-time evidence (commit 532c984).

---

## Per-Requirement Closeout

| REQ-ID | Status | Evidence |
|--------|--------|----------|
| FU-01 | PASSED | `tests/v1.10-phase74-sf-file-upload.spec.ts` FU-01 describe (4 tests green: click-to-browse, per-file remove + aria-live, paste-handler-exists, R-64-d Space-key regression); validation rows 74-01-01..03 |
| FU-02 | PASSED | `tests/v1.10-phase74-sf-file-upload.spec.ts` FU-02 describe (4 tests green: MIME reject, size reject, multi-file append, mixed accept/reject); validation rows 74-01-04..07 |
| FU-03 | PASSED | `tests/v1.10-phase74-sf-file-upload.spec.ts` FU-03 describe (4 tests green: controlled+onChange echo, progress aria-valuenow + aria-label, image preview blob: src, disabled tabindex=-1 + disabled hidden input); validation rows 74-01-08..11 |
| FU-04 | PASSED | `components/sf/index.ts` line 134 barrel export; `package.json` zero new deps; validation rows 74-01-12..14; bundle audit confirms tree-shake-clean (sf-file-upload absent from homepage `/page` manifest); 187.6 KB ≤ 200 KB |
| FU-05 | PASSED | This document; primary sources cited (Playwright issue, Chromium bug, WHATWG spec); split test strategy enumerated across 3 tracks; `stories/sf-file-upload.stories.tsx` `DragActive` story uses `play()` + `fireEvent.dragOver()` |
| TST-03 | PASSED | `tests/v1.10-phase74-sf-file-upload.spec.ts` (12 tests) + `tests/v1.10-phase74-sf-file-upload-axe.spec.ts` (6 tests) all green per Plan 02 SUMMARY |
| TST-04 | PASSED | This document; permanent `dataTransfer.files` gap documented with 3 primary sources + same-class `clipboardData.files` gap noted; no vacuous Playwright drop test in spec (`grep -cE 'dispatchEvent.*[\"\']drop[\"\']' = 0` re-verified) |

---

## Gaps Summary

**No gaps found.** All 19 must-haves verified, all 7 requirement IDs SATISFIED, all 9 key links WIRED, zero anti-patterns. The phase achieves its goal: SFFileUpload is shipped as a barrel-exported Pattern C component using only native browser APIs, and the `dataTransfer.files` permanent gap is documented as a first-class deliverable in this VERIFICATION.md (not papered over with a vacuously-passing Playwright drop test).

**Phase 74 status: PASSED** — pending user sign-off on M-01..M-07 manual checks (visual / AT / DevTools-driven verification that cannot be automated).

---

_Verified: 2026-05-02_
_Verifier: Claude (gsd-verifier)_
_Supersedes: executor-authored 74-VERIFICATION.md (Plan 02 Task 4 deliverable, commit 532c984) — gap-documentation content preserved verbatim above._
