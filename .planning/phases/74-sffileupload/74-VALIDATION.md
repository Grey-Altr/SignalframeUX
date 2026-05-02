---
phase: 74
slug: sffileupload
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-02
---

# Phase 74 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Sourced from `74-RESEARCH.md` Validation Architecture (lines 687–769).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright + axe-core (E2E + a11y) · `@next/bundle-analyzer` (`ANALYZE=true pnpm build`) · Storybook + Chromatic (visual diff for drag-active state — Pattern C precedent: SFCombobox / SFRichEditor) |
| **Config file** | `playwright.config.ts` · `next.config.ts` (ANALYZE env) · `.storybook/main.ts` |
| **Quick run command** | `pnpm exec playwright test tests/v1.10-phase74-sf-file-upload*.spec.ts --reporter=line` |
| **Full suite command** | `pnpm exec playwright test tests/v1.10-phase74-sf-file-upload*.spec.ts --project=chromium && rm -rf .next/cache .next && ANALYZE=true pnpm build && pnpm exec playwright test tests/v1.8-phase63-1-bundle-budget.spec.ts --project=chromium` |
| **Estimated runtime** | ~20s Playwright + axe (no client framework mount overhead — pure native APIs); ~140s incl. clean ANALYZE build |

---

## Sampling Rate

- **After every task commit:** Run `pnpm exec playwright test tests/v1.10-phase74-sf-file-upload*.spec.ts --grep "{tag for that task}" --project=chromium`
- **After every plan wave:** Run `pnpm exec playwright test tests/v1.10-phase74-sf-file-upload*.spec.ts --project=chromium`
- **Before `/pde:verify-work`:** Full suite green + bundle evidence captured (zero new runtime dep added; SFFileUpload exported from `components/sf/index.ts`; homepage First Load JS ≤ 200 KB unchanged)
- **Max feedback latency:** 25 seconds (per-task quick run)

---

## Per-Task Verification Map

> Per-task rows populated post-execution. Each row maps a single predicate cluster to a verifiable command and a measured outcome. Sources: `74-RESEARCH.md` Validation Architecture (lines 687–769).

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 74-01-01 | 01 | 1 | FU-01 | drop-zone-keyboard-trap | Drop zone has `role="button"` + visible focus ring + hidden `<input type="file">` keyboard fallback | grep | `grep -c 'role="button"' components/sf/sf-file-upload.tsx` (≥ 1) AND `grep -c 'type="file"' components/sf/sf-file-upload.tsx` (≥ 1) | ⬜ W0 | ⬜ pending |
| 74-01-02 | 01 | 1 | FU-01 | drop-handler-bypass | `onDrop` + `onDragOver` + `e.preventDefault()` on dragover prevent browser default download behavior | grep | `grep -c 'onDrop=' components/sf/sf-file-upload.tsx` (≥ 1) AND `grep -c 'onDragOver=' components/sf/sf-file-upload.tsx` (≥ 1) AND `grep -c 'preventDefault' components/sf/sf-file-upload.tsx` (≥ 2) | ⬜ W0 | ⬜ pending |
| 74-01-03 | 01 | 1 | FU-01 | per-file-remove-missing | Each file row has `aria-label` containing "Remove" or "Delete" | grep | `grep -c 'aria-label.*[Rr]emove' components/sf/sf-file-upload.tsx` (≥ 1) | ⬜ W0 | ⬜ pending |
| 74-01-04 | 01 | 1 | FU-02 | mime-not-validated | MIME validation against `accept` prop runs on `File.type` and/or extension | grep | `grep -cE 'accept.*split\|\.type\.startsWith\|endsWith' components/sf/sf-file-upload.tsx` (≥ 1) | ⬜ W0 | ⬜ pending |
| 74-01-05 | 01 | 1 | FU-02 | size-not-validated | `maxSize` prop checked against `file.size` | grep | `grep -cE 'file\.size\|maxSize' components/sf/sf-file-upload.tsx` (≥ 2) | ⬜ W0 | ⬜ pending |
| 74-01-06 | 01 | 1 | FU-02 | error-not-surfaced | `SFFileEntry.error?: string` field present in type defs | grep | `grep -cE 'error\?:\s*string' components/sf/sf-file-upload.tsx` (≥ 1) | ⬜ W0 | ⬜ pending |
| 74-01-07 | 01 | 1 | FU-02 | multi-file-mode-broken | `multiple` prop forwarded to hidden input | grep | `grep -c 'multiple={multiple}\|multiple\b' components/sf/sf-file-upload.tsx` (≥ 1) | ⬜ W0 | ⬜ pending |
| 74-01-08 | 01 | 1 | FU-03 | filereader-leak | `FileReader.readAsDataURL` is FORBIDDEN (causes memory blow-up on large images) | grep | `grep -c 'FileReader' components/sf/sf-file-upload.tsx` (= 0) | ⬜ W0 | ⬜ pending |
| 74-01-09 | 01 | 1 | FU-03 | objecturl-leak | `URL.createObjectURL` paired with `URL.revokeObjectURL` in cleanup | grep | `grep -c 'URL\.createObjectURL' components/sf/sf-file-upload.tsx` (≥ 1) AND `grep -c 'URL\.revokeObjectURL' components/sf/sf-file-upload.tsx` (≥ 1) | ⬜ W0 | ⬜ pending |
| 74-01-10 | 01 | 1 | FU-03 | progress-not-rendered | `SFProgress` imported and consumed for per-file rendering driven by `progress` prop | grep | `grep -c 'SFProgress' components/sf/sf-file-upload.tsx` (≥ 1) AND `grep -c 'progress\[' components/sf/sf-file-upload.tsx` (≥ 1) | ⬜ W0 | ⬜ pending |
| 74-01-11 | 01 | 1 | FU-03 | controlled-api-broken | `files?: SFFileEntry[]` + `onChange?: (files: SFFileEntry[]) => void` declared | grep | `grep -cE 'files\?:' components/sf/sf-file-upload.tsx` (≥ 1) AND `grep -cE 'onChange\?:' components/sf/sf-file-upload.tsx` (≥ 1) | ⬜ W0 | ⬜ pending |
| 74-01-12 | 01 | 1 | FU-04 | http-leak-into-component | NO `fetch(`, `XMLHttpRequest`, or `axios` calls inside the component (consumer owns HTTP) | grep | `grep -cE 'fetch\(\|XMLHttpRequest\|axios' components/sf/sf-file-upload.tsx` (= 0) | ⬜ W0 | ⬜ pending |
| 74-01-13 | 01 | 1 | FU-04 | new-runtime-dep | Zero NEW runtime npm deps in `package.json` for this phase | shell | `git diff HEAD~1 -- package.json \| grep -cE '^\+\s*"(?!@types/)' package.json dependencies block` (= 0 — measured against pre-phase baseline) | ⬜ W0 | ⬜ pending |
| 74-01-14 | 01 | 1 | FU-04 | barrel-non-export | `SFFileUpload` exported from `components/sf/index.ts` | grep | `grep -cE 'SFFileUpload' components/sf/index.ts` (≥ 1) | ⬜ W0 | ⬜ pending |
| 74-02-01 | 02 | 2 | FU-05 | gap-papered-over | `74-VERIFICATION.md` exists and explicitly documents `dataTransfer.files` permanent gap | shell | `test -f .planning/phases/74-sffileupload/74-VERIFICATION.md && grep -c 'dataTransfer\.files' .planning/phases/74-sffileupload/74-VERIFICATION.md` (≥ 1) | ⬜ W0 | ⬜ pending |
| 74-02-02 | 02 | 2 | FU-05 | gap-undocumented-source | Primary source citation present (Chromium bug, microsoft/playwright issue, or both) | grep | `grep -cE 'crbug\|playwright#\|microsoft/playwright\|github\.com/microsoft/playwright' .planning/phases/74-sffileupload/74-VERIFICATION.md` (≥ 1) | ⬜ W0 | ⬜ pending |
| 74-02-03 | 02 | 2 | FU-05 | story-missing | Storybook story file exists at canonical path with DragActive (or named-equivalent) story | shell | `test -f stories/sf-file-upload.stories.tsx && grep -cE 'DragActive\|DragState\|DragOver' stories/sf-file-upload.stories.tsx` (≥ 1) | ⬜ W0 | ⬜ pending |
| 74-02-04 | 02 | 2 | TST-03 | vacuous-green | Drop zone `role="button"` `toBeVisible()` BEFORE `axe.analyze()` runs in axe spec | grep | `grep -cE 'role="button"\|toBeVisible' tests/v1.10-phase74-sf-file-upload-axe.spec.ts` (≥ 1) | ⬜ W0 | ⬜ pending |
| 74-02-05 | 02 | 2 | TST-03 | a11y-violation | axe spec runs with zero violations across (empty / with-files / with-progress / with-error) fixtures | playwright+axe | `pnpm exec playwright test tests/v1.10-phase74-sf-file-upload-axe.spec.ts --project=chromium` (all PASS) | ⬜ W0 | ⬜ pending |
| 74-02-06 | 02 | 2 | TST-03 | aria-live-missing | `aria-live` region announces selection / removal / error to screen readers | grep | `grep -c 'aria-live' components/sf/sf-file-upload.tsx` (≥ 1) | ⬜ W0 | ⬜ pending |
| 74-02-07 | 02 | 2 | FU-01 / FU-02 / FU-03 | acceptance-broken | E2E spec covers click-to-browse, multi-file, MIME reject, size reject, controlled `onChange`, progress render, image preview | playwright | `pnpm exec playwright test tests/v1.10-phase74-sf-file-upload.spec.ts --project=chromium` (all PASS) | ⬜ W0 | ⬜ pending |
| 74-02-08 | 02 | 2 | TST-04 | drag-test-vacuous | Drag-drop visual state verified via Storybook `play()` story; Playwright spec does NOT call `page.dispatchEvent('drop', ...)` and assert green without `dataTransfer.files` round-trip | human review | Manual review of `tests/v1.10-phase74-sf-file-upload.spec.ts` AND `stories/sf-file-upload.stories.tsx` | ⬜ W0 | ⬜ pending |
| 74-02-09 | 02 | 2 | FU-04 | bundle-regression | Homepage First Load JS ≤ 200 KB; SFFileUpload tree-shake-clean (NOT loaded on `/`) | playwright + bundle | `pnpm exec playwright test tests/v1.8-phase63-1-bundle-budget.spec.ts --project=chromium` (PASS) AND `node -e "const m=JSON.parse(require('fs').readFileSync('.next/app-build-manifest.json','utf8')); const h=JSON.stringify(m.pages['/page']\|\|[]); console.log(/sf-file-upload/.test(h)?'FAIL':'PASS')"` (PASS) | ⬜ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/v1.10-phase74-sf-file-upload.spec.ts` — Playwright spec covering FU-01 (click-to-browse via `setInputFiles`, file list, per-file remove, paste handler exists), FU-02 (MIME reject, size reject, multi-file mode, error state surfacing), FU-03 (controlled `files` + `onChange`, `progress` prop drives `SFProgress`, image preview via object URL — preview *element* present; pixel diff handled in Storybook)
- [ ] `tests/v1.10-phase74-sf-file-upload-axe.spec.ts` — axe-core spec across 4 fixture states (empty / with-files / with-progress / with-error), with `[role="button"][aria-label]` `toBeVisible()` vacuous-green guard before each `analyze()`; verifies `aria-live` region exists; verifies `SFProgress` `aria-label` per-file
- [ ] `app/dev-playground/sf-file-upload/page.tsx` — fixture page mounting ≥4 sections (uncontrolled default + accept image, controlled `files` + `onChange` echo, multi-file with simulated `progress` slider, error fixture with `maxSize=1KB`)
- [ ] `stories/sf-file-upload.stories.tsx` — Storybook stories: Default, MultiFile, WithProgress, ImagePreview, MimeReject, SizeReject, Disabled, **DragActive** (uses `play()` with `fireEvent.dragOver(canvas.getByRole('button'))` to capture drag visual state for Chromatic snapshot)
- [ ] No new framework installs — Playwright, axe-core, Storybook, Chromatic all confirmed present in `package.json` (Phase 71/72/73 precedent)

*Wave-0 stubs landed within Plan 02 (test wave) per Phase 73 precedent. TDD-light interpretation: impl in Plan 01, fixture + tests + stories + VERIFICATION.md in Plan 02 — same-phase, same-cohort.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Drop zone visual register matches DU/TDR aesthetic — sharp corners, blessed spacing inside file list, no decorative gradient on hover, focus-visible ring uses `--sfx-primary-on-dark` (Cluster-C policy) | FU-01 / FU-04 (cross-cutting) | Aesthetic register is human-judged | Open `/dev-playground/sf-file-upload`, Tab to drop zone, observe focus ring; toggle theme; confirm zero border-radius on drop zone, file rows, remove button; confirm spacing between file rows lands on a blessed stop (8 / 12 / 16 px) |
| Image preview rendering quality — `URL.createObjectURL` produces a clean preview; no flicker between selection and preview render; revocation on removal does not produce a broken-image flash | FU-03 | Visual perception of render timing + flicker | Drop a 5 MB image into multi-file mode → confirm preview appears within ~100 ms with no flicker; remove the file → confirm no broken-image flash before unmount; check DevTools Memory tab: blob URL is revoked on removal (no orphaned blob URLs in `URL` registry inspection) |
| Drag-and-drop visual state on real Chromium browser (DEV-mode hardware) — drag affordance, drop indicator, drop animation all read correctly | FU-01 / FU-05 / TST-04 | The whole point of this phase: `dataTransfer.files` is permanently broken in Chromium CI / Playwright; the *human* manual drag is the only end-to-end vehicle | Open `/dev-playground/sf-file-upload` in real Chromium → drag a real file from Finder/Explorer → confirm drop zone visually shifts to drag-active state on dragover → release → confirm file appears in list with correct accept/reject classification |
| Screen reader announcement of file selection / removal / error states | FU-02 / TST-03 (cross-cutting) | `aria-live` is a contract, but *what* it announces is human-judged for clarity | macOS VoiceOver (Cmd+F5): drop zone → click → select 2 files → confirm announcement of count + names; click remove on one → confirm "removed" announcement; drop oversized file → confirm error announcement is intelligible |
| Light + dark mode parity for drop zone, file list, and error state | FU-04 (cross-cutting) | Per-theme rendering best confirmed by eye | Toggle theme on `/dev-playground/sf-file-upload`; confirm drop zone background, foreground text, divider lines, error text color, progress bar fill all read correctly in both themes; no Radix or browser default colors leak |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 25s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
