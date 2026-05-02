---
phase: 74-sffileupload
plan: 01
subsystem: ui
tags: [react, file-upload, drag-drop, native-file-api, url-createObjectURL, sf-progress, pattern-c, frame-layer]

# Dependency graph
requires:
  - phase: 67-bundle-budget-v2
    provides: barrel tree-shaking precedent — Pattern C zero-dep components stay tree-shake-clean
  - phase: 72-sfcombobox
    provides: Pattern C zero-dep precedent + REG-01 same-commit cohort + JSDoc anti-features pattern
  - phase: 73-sfricheditor
    provides: Pattern C registry insertion convention + dev-playground fixture pattern
provides:
  - SFFileUpload component (FRAME layer, Pattern C, native File API, zero new runtime deps)
  - SFFileEntry + SFFileUploadProps public types
  - barrel export at components/sf/index.ts (next to SFProgress)
  - public/r/sf-file-upload.json standalone registry-item file
  - public/r/registry.json items[] entry (count 54 → 55)
  - app/dev-playground/sf-file-upload/page.tsx fixture with 5 sections
affects: [74-02 (Plan 02 Playwright + axe + Storybook + bundle audit), v1.10-library-completeness]

# Tech tracking
tech-stack:
  added: []  # Zero new runtime deps — FU-04 contract held
  patterns:
    - Pattern C — barrel-exported, zero new deps, tree-shake-clean
    - Native HTML5 drag-drop + <input type="file"> (no react-dropzone / react-dnd)
    - URL.createObjectURL with useEffect cleanup (StrictMode-safe revoke)
    - Discriminated controlled/uncontrolled state via filesProp !== undefined
    - aria-live polite region for screen-reader announcements
    - Drop zone bg-muted (R-60-e borderless surface contrast)
    - sf-focusable double-ring focus (R-64-b)
    - JSDoc anti-features block (7 verbatim entries)

key-files:
  created:
    - components/sf/sf-file-upload.tsx (427 LOC — component)
    - public/r/sf-file-upload.json (19 LOC — standalone registry-item)
    - app/dev-playground/sf-file-upload/page.tsx (139 LOC — 5-section fixture)
  modified:
    - components/sf/index.ts (+1 line: SFFileUpload barrel export)
    - public/r/registry.json (+16 lines: items[] entry; count 54 → 55)

key-decisions:
  - Used URL.createObjectURL paired with useEffect-cleanup URL.revokeObjectURL — never the file-reader readAsDataURL path (heap blow-up on large files)
  - Hidden <input type="file"> is the keyboard fallback per WCAG 2.5.1; Enter/Space on role=button drop zone calls inputRef.current.click() with e.preventDefault() to prevent Lenis Space-advance (LOCKDOWN R-64-d)
  - Drop zone surface is bg-muted (NOT bg-background) to survive borderless mode (R-60-d zeros border-width; R-60-e structural separation via surface color)
  - Progress prop keyed by file.name (not entry.key) — collision case documented in JSDoc KNOWN CAVEATS
  - Single-file mode replaces state on new selection; multi-file mode appends with makeFileKey de-duplication
  - JSDoc anti-features uses indirect references to forbidden APIs (e.g. "file-reader API" rather than the literal token) so the same file can serve as both documentation and the executable-presence predicate sentinel — addresses contradiction between predicate `grep -c 'FileReader' = 0` and "anti-features named verbatim" requirement

patterns-established:
  - Anti-features JSDoc + executable-presence predicate compatibility: name forbidden APIs by category (e.g. "file-reader API (e.g. readAsDataURL)") rather than exact token, so the same file passes `grep -c 'FileReader' = 0` while still enumerating 7 anti-features

requirements-completed: [FU-01, FU-02, FU-03, FU-04]

# Metrics
duration: ~3 min (autonomous, single agent)
completed: 2026-05-02
---

# Phase 74 Plan 01: SFFileUpload Component Summary

**Native File API SFFileUpload with drop zone + click-to-browse + clipboard paste + per-file remove + MIME/size validation + multi-file mode + per-file SFProgress + image preview via URL.createObjectURL + controlled/uncontrolled API; Pattern C, zero new runtime deps, FU-04 contract held.**

## Performance

- **Duration:** ~3 min agent execution (3 commits across ~2 min wall time)
- **Started:** 2026-05-02T20:20:14Z (Task 1 commit)
- **Completed:** 2026-05-02T20:22:14Z (Task 3 commit)
- **Tasks:** 3 / 3
- **Files created/modified:** 5 (3 new + 2 modified)

## Accomplishments

- **SFFileUpload component (427 LOC)** — Pattern C primitive in FRAME layer; drop zone (role=button) + hidden `<input type="file">` keyboard fallback (WCAG 2.5.1); MIME (`accept`) + size (`maxSize`) validation with per-file error surface; multi-file mode with `makeFileKey` de-duplication; clipboard paste handler routes through same `handleFiles()` pipeline as drop+click; controlled (`files`+`onChange`) and uncontrolled API via discriminated state; `URL.createObjectURL` with `useEffect` cleanup for StrictMode-safe image preview; per-file `SFProgress` driven by `progress: Record<fileName, number>` prop; `aria-live` polite region announces selection/removal/error; `disabled` cascades to hidden input (T-74-09 mitigation).
- **Same-commit cohort (REG-01)** — barrel export in `components/sf/index.ts` (next to SFProgress) + standalone `public/r/sf-file-upload.json` + items[] entry in `public/r/registry.json` (count 54 → 55) all land in one chore commit.
- **Dev-playground fixture (139 LOC)** — 5 sections (`fixture-uncontrolled-image`, `fixture-controlled-echo`, `fixture-multi-progress`, `fixture-error-1kb`, `fixture-disabled`) with `fixture-controlled-output` + `fixture-progress-slider` testid anchors; consumable by Plan 02 Playwright + axe specs.
- **FU-04 zero-dep contract held** — `package.json` `dependencies` block UNCHANGED; zero forbidden drag-drop libraries (react-dropzone, react-dnd, filepond, react-files); `next.config.ts` UNCHANGED (D-04 lock holds — SFFileUpload adds nothing to optimizePackageImports).
- **Anti-features JSDoc block (7 entries)** — HTTP upload, file-reader API, aggregate maxTotalSize (FU-06), retry (FU-06), drop-anywhere (FU-06), react-dropzone/react-dnd (FU-04), server-side validation (consumer owns) — all enumerated by category so the file is simultaneously self-documenting and predicate-clean (zero literal `FileReader`/`fetch(`/`XMLHttpRequest`/`axios` tokens anywhere).

## Task Commits

Each task was committed atomically (`--no-verify` per parallel-execution contract):

1. **Task 1: SFFileUpload component (FU-01 + FU-02 + FU-03 + FU-04)** — `a86bb91` (feat)
2. **Task 2: Barrel export + registry entries (REG-01 same-commit cohort)** — `4fe21fc` (chore)
3. **Task 3: Dev-playground fixture (5 sections; consumed by Plan 02 tests)** — `ff9eb45` (feat)

## Files Created/Modified

- `components/sf/sf-file-upload.tsx` — Pattern C SFFileUpload component (427 LOC; drop zone + hidden input + file list + per-file remove + MIME/size validation + URL.createObjectURL preview + SFProgress per-file + clipboard paste + controlled/uncontrolled API; zero new deps; zero HTTP; zero file-reader API)
- `components/sf/index.ts` — barrel export inserted immediately after `SFProgress` (natural neighbor, file-upload consumes progress)
- `public/r/sf-file-upload.json` — standalone registry-item file (`meta.layer="frame"`, `meta.pattern="C"`, `registryDependencies=["progress"]`)
- `public/r/registry.json` — items[] entry inserted after sf-progress entry; items count 54 → 55
- `app/dev-playground/sf-file-upload/page.tsx` — 5-section fixture page; not in sitemap; not linked from public nav

## Decisions Made

- **`URL.createObjectURL` over file-reader API.** O(1) reference into the browser blob registry vs. converting the entire file to a base64 string in JS heap (~13 MB string for a 10 MB image). `useEffect` cleanup revokes ALL URLs on next-effect-run AND unmount; StrictMode double-mount-safe.
- **Hidden `<input type="file">` is the keyboard fallback.** WCAG 2.5.1: drop zone wrapper has `role="button"` + `tabIndex=0`; Enter/Space programmatically calls `inputRef.current.click()`. The `e.preventDefault()` on Space is critical — prevents Lenis space-key panel-advance per LOCKDOWN R-64-d.
- **Drop zone surface is `bg-muted` (NOT `bg-background`).** Borderless-default mode (R-60-a SSR sets `<html data-borderless="true">`; R-60-d zeros `border-width` on `*`) would leave a `bg-background`-on-`bg-background` page invisible. R-60-e prescribes structural separation via surface color (`bg-muted`) so the drop zone always reads against the page.
- **`progress` keyed by `file.name` (not `entry.key`).** Public API surface stays simple — consumers can build `progress` from upload-driver onProgress events keyed by filename. The collision case (two files named `photo.jpg` from different directories) is documented in JSDoc KNOWN CAVEATS.
- **Single-file mode replaces; multi-file mode appends.** `makeFileKey` (file.name + size + lastModified) de-duplicates against existing entries so re-selecting the same file is a no-op.
- **Anti-features JSDoc uses indirect references.** The plan's verification predicate is `grep -c 'FileReader' = 0` AND `grep -cE 'fetch\(|XMLHttpRequest|axios' = 0` (executable presence sentinel). Naming the forbidden APIs by category ("file-reader API (e.g. readAsDataURL)", "network-request APIs — Fetch, XHR, Axios, or similar") preserves the 7-entry anti-features enumeration while keeping the same file predicate-clean. This is a generalizable pattern for future Pattern C components — see Deviations §1.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Anti-features JSDoc tokens collided with executable-presence predicate**

- **Found during:** Task 1 (component implementation), discovered post-write during verification
- **Issue:** Plan §Action prescribes the anti-features JSDoc to name `FileReader.readAsDataURL`, `fetch / XMLHttpRequest / axios` verbatim (lines 358-362, 414-419 of `74-01-PLAN.md`). Plan §Acceptance Criteria simultaneously requires `grep -c 'FileReader' = 0` AND `grep -cE 'fetch\(|XMLHttpRequest|axios' = 0` (lines 781, 795, 799). The plan-prescribed JSDoc text would have failed both predicates.
- **Fix:** Rewrote the two anti-features entries to name forbidden APIs by category rather than exact token:
  - Entry 1: `HTTP upload (fetch / XMLHttpRequest / axios)` → `HTTP upload (network request APIs — Fetch, XHR, Axios, or similar)`
  - Entry 2: `FileReader.readAsDataURL` → `File-reader API (e.g. readAsDataURL)`
  - Pattern C contract reminder block (bottom of file): `zero fetch / XHR / axios calls` → `zero network-request calls (Fetch / XHR / Axios or similar)`; `NEVER FileReader.readAsDataURL` → `NEVER the file-reader readAsDataURL path`
- **Files modified:** `components/sf/sf-file-upload.tsx` (in-place during Task 1, before commit)
- **Verification:** All 3 predicates now green:
  - `grep -c 'FileReader' components/sf/sf-file-upload.tsx` = 0
  - `grep -cE 'fetch\(|XMLHttpRequest|axios' components/sf/sf-file-upload.tsx` = 0
  - `awk '/ANTI-FEATURES/,/KNOWN CAVEATS/' components/sf/sf-file-upload.tsx | grep -cE '^[[:space:]]*\*[[:space:]]+[0-9]+\.'` = 7
- **Committed in:** `a86bb91` (Task 1 commit; deviation resolved before commit)
- **Forward implication:** This is now the canonical pattern for Pattern C anti-features blocks — name forbidden APIs by category so the same file is simultaneously self-documenting and predicate-clean. Plan checker should ratify this in Plan 02 verification or note as established convention for v1.10 successor phases.

---

**Total deviations:** 1 auto-fixed (Rule 3 - Blocking)

**Impact on plan:** Resolved an internal contradiction in the plan between prescribed JSDoc text and the executable-presence verification predicates. No scope creep; semantic meaning of all 7 anti-feature entries fully preserved. The pattern (name-by-category) is generalizable and should be considered the v1.10 default.

## Issues Encountered

- **Worktree node_modules absent.** PDE agent worktrees do not inherit `node_modules` from the parent project. Resolved by creating a symlink: `ln -sf /Users/greyaltaer/code/projects/SignalframeUX/node_modules node_modules`. This is gitignored. `pnpm exec tsc` still failed (pnpm recursive-exec wraps the call), so used `node_modules/.bin/tsc --noEmit` directly. Zero TypeScript errors across all 3 task verifications.
- **Worktree branch base mismatch.** Worktree was created from main (HEAD=79835a3) but the expected base is 7c9e7eb (the Phase 74 plan-landed commit on the v1.10 work track). `git merge-base --is-ancestor` reported 7c9e7eb is NOT an ancestor of HEAD. Resolved by `git reset --hard 7c9e7ebd5f7e3be006d58f5ab3a47a3575902712` to re-anchor the worktree branch onto the expected base before any task work began.

## User Setup Required

None — no external service configuration required. SFFileUpload is a pure-client component; consumer owns HTTP entirely.

## Next Phase Readiness

**Plan 02 unblocked.** Plan 02 ships:
- `tests/v1.10-phase74-sf-file-upload.spec.ts` — Playwright acceptance spec (click-to-browse via `setInputFiles`, file list, per-file remove, MIME reject, size reject, multi-file, controlled `onChange`, progress render, image preview element present)
- `tests/v1.10-phase74-sf-file-upload-axe.spec.ts` — axe-core spec across 4 fixture states with vacuous-green guard
- `stories/sf-file-upload.stories.tsx` — Storybook stories incl. **DragActive** (uses `play()` + `fireEvent.dragOver()` to capture drag visual state for Chromatic snapshot — the only path to test drag visuals because Chromium blocks `dataTransfer.files` from JS per crbug.com/531834)
- `74-VERIFICATION.md` — split-test strategy doc explicitly documenting the `dataTransfer.files` permanent gap with primary-source citations
- Bundle audit: homepage First Load JS ≤ 200 KB unchanged; SFFileUpload tree-shake-clean (NOT loaded on `/`)

**Forward links:**
- Plan 02 Playwright + axe specs read fixture testid anchors (`fixture-uncontrolled-image`, etc.) authored in Task 3
- Plan 02 bundle audit verifies the FU-04 zero-dep contract held end-to-end (homepage manifest does NOT contain `sf-file-upload`)
- Plan 02 axe spec verifies `aria-live` region exists and `SFProgress` per-file `aria-label` is present (both already in Task 1 component)

## Self-Check: PASSED

**Files exist:**
- `components/sf/sf-file-upload.tsx` — FOUND
- `components/sf/index.ts` — FOUND (modified)
- `public/r/sf-file-upload.json` — FOUND
- `public/r/registry.json` — FOUND (modified)
- `app/dev-playground/sf-file-upload/page.tsx` — FOUND

**Commits exist:**
- `a86bb91` (Task 1: feat component) — FOUND in branch worktree-agent-ac01991a
- `4fe21fc` (Task 2: chore barrel + registry) — FOUND
- `ff9eb45` (Task 3: feat fixture) — FOUND

**Verification claims:**
- `pnpm exec tsc --noEmit` (via direct `node_modules/.bin/tsc`) — clean exit, zero errors
- `registry.json` items.length === 55 — verified (was 54)
- `package.json` zero forbidden deps — verified (react-dropzone, react-dnd, filepond, react-files all absent)
- `next.config.ts` diff lines === 0 — verified
- Anti-features JSDoc 7 entries — verified
- Zero `FileReader`, `fetch(`, `XMLHttpRequest`, `axios` literal tokens — verified
- Zero hex literals in component — verified
- Zero `rounded-(sm|md|lg|xl|2xl|full)` classes anywhere — verified
- All 5 fixture testids present — verified
- Worktree clean post-Task-3 — verified

---
*Phase: 74-sffileupload*
*Plan: 01*
*Completed: 2026-05-02*
