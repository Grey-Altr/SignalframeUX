---
phase: 74
slug: sffileupload
status: passed
validated: 2026-05-02
---

# Phase 74 — Verification (Split Test Strategy + Permanent Gap Documentation)

> FU-05 + TST-04 first-class deliverable. The dataTransfer.files Chromium gap is
> acknowledged here as a permanent CI limitation, NOT papered over with a vacuously-
> passing Playwright drop test.

---

## Split Test Strategy (FU-05)

SFFileUpload's drag-drop file ingestion path cannot be E2E-tested in Chromium-based
Playwright CI. Test coverage is split across three tracks:

### Track 1 — Playwright `locator.setInputFiles()` (Acceptance Logic)

File: `tests/v1.10-phase74-sf-file-upload.spec.ts`

Coverage:

- FU-01 click-to-browse via `setInputFiles()` populates file list
- FU-01 per-file remove button + aria-live announcement
- FU-01 paste handler exists structural check (clipboardData.files has same Chromium gap)
- FU-01 Space-key on drop zone opens file dialog without advancing panel (LOCKDOWN R-64-d regression)
- FU-02 MIME validation — PDF in image-only fixture surfaces error chip
- FU-02 size validation — 2 KB file in 1 KB fixture surfaces error chip
- FU-02 multi-file mode appends multiple files to the list
- FU-02 mixed accept/reject in one selection surfaces both rows correctly
- FU-03 controlled `files`+`onChange` — selection updates JSON echo
- FU-03 `progress` prop drives SFProgress `aria-valuenow` + `aria-label`
- FU-03 image preview — accepted image renders `<img>` with `blob:` src
- FU-03 disabled fixture — drop zone tabindex=-1 + hidden input disabled

Result: **12/12** passing on chromium project at phase close (≥11 plan target met).

### Track 2 — Storybook `play()` + Chromatic (Drag Visual State)

File: `stories/sf-file-upload.stories.tsx`

Coverage:

- 8 stories: `Default`, `MultiFile`, `WithProgress`, `ImagePreview`, `MimeReject`, `SizeReject`, `Disabled`, `DragActive`
- `DragActive` uses `play({ canvasElement })` with `fireEvent.dragOver(within(canvasElement).getByRole("button"))`
  from `storybook/test`. Storybook's interaction layer runs inside the same-origin
  browser DOM where dragover events DO fire React handlers — `isDragging=true` state
  is set, drop zone visually shifts to `bg-foreground/10` drag-active variant, and
  Chromatic captures the pixel-diff baseline.
- Every story sets `parameters.chromatic.delay` (meta-level 200ms + per-story 200ms; `DragActive` 400ms for fireEvent settle).
- ZERO `_forceDragActive` references — Pattern C public API surface stays clean.

Note: Storybook v10 import path is `storybook/test` (not `@storybook/test` — the v8 namespace
was unified into the storybook root namespace in v10.x; project ships Storybook 10.3.5).

Result: **8/8** stories deployed; `DragActive` captures the visual drag-state.

### Track 3 — axe-core WCAG AA (TST-03)

File: `tests/v1.10-phase74-sf-file-upload-axe.spec.ts`

Coverage:

- 6 tests across 4 fixture states + structural aria-live presence
  - empty state (drop zone + hidden input)
  - with-files (multi-file fixture seeded, accepted state with image preview)
  - with-progress (slider at 50%, SFProgress visible per-file)
  - with-error (oversized file in 1 KB fixture, error chip surfaced)
  - disabled state (drop zone tabindex=-1, hidden input disabled)
  - aria-live region present in every fixture section (structural)
- Rule set: `button-name`, `aria-progressbar-name`, `aria-valid-attr-value`, `color-contrast`, `region`
- Vacuous-green guard asserts `[role="button"][aria-label]` visible BEFORE every `analyze()`
- All 4 broad scans use `.include('main[data-testid="sf-file-upload-playground"]')`
  to exclude the global SIGNAL `<canvas>` page chrome (decorative, role=img,
  outside any landmark — pre-existing system finding, out of Phase 74 scope)

Note: The plan-prescribed axe rule `progressbar` does not exist in axe-core 4.11.2's
rule registry; the canonical rule for progressbar accessible names is `aria-progressbar-name`.
Corrected at execute-time per `axe.getRules()` enumeration.

Result: **6/6** passing; zero violations across all 4 fixture states.

---

## Permanent Gap — `dataTransfer.files` (Chromium CI / Playwright)

**What cannot be tested via automation:** The drag→drop file ingestion path. Specifically:
the `onDrop` event handler reading `e.dataTransfer.files` to populate the file list when
a real user drags a file from Finder/Explorer onto the drop zone.

**Why it's permanent:** `DataTransfer.files` is a `FileList` backed by the platform drag
data store. The Chromium security model treats this property as readable only — scripts
cannot programmatically populate it via synthetic DragEvent / dispatchEvent. Playwright's
`page.dispatchEvent('drop', ...)` succeeds in firing the event but the `dataTransfer.files`
FileList is empty. This is a feature, not a bug: it prevents malicious scripts from
silently triggering file system access.

### Primary Sources

| # | Source | URL / Reference | Status |
|---|--------|-----------------|--------|
| 1 | Playwright maintainer issue | https://github.com/microsoft/playwright/issues/13362 | Open since 2022; Won't Fix (upstream Chromium constraint) |
| 2 | Chromium bug tracker | https://crbug.com/531834 | WontFix since 2015 ("Setting dataTransfer.files via JS is intentionally prohibited.") |
| 3 | WHATWG HTML spec §6.10.6 | https://html.spec.whatwg.org/multipage/dnd.html#the-datatransfer-interface | DataTransfer.files is platform-data-store-backed; scripts can only READ |

### What's Covered Anyway

The acceptance logic — validation, file-list update, controlled API, progress rendering,
image preview, error state — is identical between click-to-browse, drag-drop, and clipboard
paste paths. All three call the same `handleFiles(File[])` function in
`components/sf/sf-file-upload.tsx`. Track 1's `setInputFiles()` tests `handleFiles()`
end-to-end via the click-to-browse code path; the drag-drop and paste paths are reduced
to two-line handler bodies that delegate to `handleFiles()` after `e.preventDefault()`.
The ONLY untested surface is `e.dataTransfer.files` and `e.clipboardData.files` reads
themselves — and those reads are guarded by `e.preventDefault()` (test-coverable structurally
via grep predicates per 74-VALIDATION row 74-01-02).

### Same Gap, Same Severity — `clipboardData.files`

Note that `e.clipboardData.files` (the paste-from-clipboard handler) has the same
Chromium security restriction: synthetic ClipboardEvent dispatched via JS has empty
`files`. The paste handler in SFFileUpload is structurally tested (handler exists, drop
zone is focusable for paste targeting) but the actual file ingestion via paste is the
same untested surface. Track 1 covers `handleFiles()` via `setInputFiles()` for both.

### What is NOT acceptable (TST-04 contract)

A Playwright test that simulates a synthetic drop event via `page.dispatchEvent` with a
crafted `dataTransfer.files` payload and asserts the drop zone "handled" the event by
checking ONLY that the visual state changed (rather than that files were processed) is
vacuously green. This contract is verified by 74-VALIDATION row 74-02-08:
zero literal `dispatchEvent` paired with the drop event name in
`tests/v1.10-phase74-sf-file-upload.spec.ts`.

---

## Manual Verification (Real Chromium on DEV Hardware)

These are the human-only acceptance checks. Run before phase closeout sign-off:

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

### Clean ANALYZE Build

Command: `rm -rf .next/cache .next && ANALYZE=true pnpm build`

Result: build succeeded; homepage `/` First Load JS = **192 KB** (uncompressed route-table value)
/ **187.6 KB** gzipped (the `tests/v1.8-phase63-1-bundle-budget.spec.ts` measurement methodology).

Recorded measurement: **187.6 KB gzipped** (≤ 200 KB target; baseline 187.7 KB pre-Phase 74; Phase 74 net delta -0.1 KB — well within measurement noise; SFFileUpload barrel-export adds zero KB to the homepage chunk because tree-shaking strips it cleanly).

### Tree-Shake Audit

Command:

```bash
node -e "
const fs = require('fs');
const m = JSON.parse(fs.readFileSync('.next/app-build-manifest.json', 'utf8'));
const homeChunks = m.pages['/page'] || [];
const homeStr = JSON.stringify(homeChunks);
const leak = /sf-file-upload/.test(homeStr);
console.log('SFFileUpload in homepage First Load:', leak ? 'FAIL' : 'PASS');
process.exit(leak ? 1 : 0);
"
```

Result: **PASS** (exit 0). Homepage `/page` chunk list (12 files) does NOT contain `sf-file-upload` substring; SFFileUpload is correctly tree-shaken out despite being barrel-exported. The component appears only in the `/dev-playground/sf-file-upload/page` chunk list (9 files), as expected.

### Bundle Budget Spec

Command: `pnpm exec playwright test tests/v1.8-phase63-1-bundle-budget.spec.ts --project=chromium`

Result: **PASS** — 1/1 green, 187.6 KB ≤ 200 KB.

---

## Per-Requirement Closeout

| REQ-ID | Status | Evidence |
|--------|--------|----------|
| FU-01 | PASSED | `tests/v1.10-phase74-sf-file-upload.spec.ts` FU-01 describe (4 tests green: click-to-browse, per-file remove + aria-live, paste-handler-exists, R-64-d Space-key regression); component grep predicates 74-01-01..03 |
| FU-02 | PASSED | `tests/v1.10-phase74-sf-file-upload.spec.ts` FU-02 describe (4 tests green: MIME reject, size reject, multi-file append, mixed accept/reject); grep predicates 74-01-04..07 |
| FU-03 | PASSED | `tests/v1.10-phase74-sf-file-upload.spec.ts` FU-03 describe (4 tests green: controlled+onChange echo, progress aria-valuenow + aria-label, image preview blob: src, disabled tabindex=-1 + disabled hidden input); grep predicates 74-01-08..11 |
| FU-04 | PASSED | `components/sf/index.ts` barrel export; `package.json` zero new deps; grep predicates 74-01-12..14; bundle audit confirms tree-shake-clean (sf-file-upload absent from homepage `/page` manifest); 187.6 KB ≤ 200 KB |
| FU-05 | PASSED | This document; primary sources cited (Playwright issue, Chromium bug, WHATWG spec); split test strategy enumerated across 3 tracks; `stories/sf-file-upload.stories.tsx` `DragActive` story uses `play()` + `fireEvent.dragOver()` |
| TST-03 | PASSED | `tests/v1.10-phase74-sf-file-upload.spec.ts` (12 tests) + `tests/v1.10-phase74-sf-file-upload-axe.spec.ts` (6 tests) all green |
| TST-04 | PASSED | This document; permanent `dataTransfer.files` gap documented with 3 primary sources + same-class `clipboardData.files` gap noted; no vacuous Playwright drop test in spec |

---

## Sign-Off

Verified: 2026-05-02
Phase 74 status: passed (pending user sign-off on M-01..M-07 manual checks)
