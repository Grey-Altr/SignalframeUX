---
status: issues_found
phase: 74-sffileupload
reviewer: gsd-code-reviewer
depth: standard
reviewed_at: 2026-05-02
files_reviewed: 9
findings:
  critical: 0
  warning: 2
  info: 4
  total: 6
---

# Phase 74: Code Review Report

**Reviewed:** 2026-05-02
**Depth:** standard
**Files Reviewed:** 9

## Summary

Phase 74 ships SFFileUpload as a clean Pattern C primitive: native HTML5 drag-drop + `<input type="file">` + `URL.createObjectURL`/`revokeObjectURL` paired in `useEffect` cleanup. Zero new runtime deps, zero HTTP, zero `FileReader`. Contract obligations all met.

Two warnings and four info-level issues found. No critical issues.

## Warnings

### WR-01: axe rule list contains unverified rule name `aria-progressbar-name`

**File:** `tests/v1.10-phase74-sf-file-upload-axe.spec.ts:38-50`

**Issue:** The spec replaces the plan's prose shorthand `progressbar` with `aria-progressbar-name`, claiming it's the canonical axe-core rule ID. axe-core 4.11.x does NOT register a rule named `aria-progressbar-name`. When axe sees an unknown rule ID in `withRules([...])`, it silently ignores it — making the rule call a no-op.

**Impact:** axe scans pass trivially for the progressbar accessible-name check because the targeted rule does not exist. SFProgress could silently regress on `aria-label` and the test would still pass.

**Fix:** Verify the rule registry, then either drop the rule from the explicit list (axe scans the full ruleset by default) or add a structural assertion as defense-in-depth:

```typescript
const progressbar = page.locator('[role="progressbar"]').first();
await expect(progressbar).toHaveAttribute("aria-label", /Upload progress for/);
await expect(progressbar).toHaveAttribute("aria-valuenow");
```

Cross-check: `node -e "const a=require('axe-core'); console.log(a.getRules().map(r=>r.ruleId).filter(id=>id.includes('progress')))"`.

### WR-02: Stale per-story chromatic.delay duplicates meta inheritance

**File:** `stories/sf-file-upload.stories.tsx:71-75`

**Issue:** A "belt-and-suspenders" comment in `Default` claims per-story `chromatic.delay: 200` is needed to prevent silent regression. But Chromatic merges per-story over meta-level params, so any future story that omits `chromatic.delay` inherits the meta's 200ms (line 31). The comment is dead documentation; the redundancy adds noise.

**Impact:** Code-quality only.

**Fix:** Remove `parameters.chromatic.delay = 200` from Default, MultiFile, WithProgress, ImagePreview, MimeReject, SizeReject, Disabled. Keep DragActive's 400ms override. Move rationale into meta block.

## Info

### IN-01: Circular barrel import for SFProgress inside the same barrel

**File:** `components/sf/sf-file-upload.tsx:82`

SFFileUpload imports `from "@/components/sf"` while being itself exported from the same barrel. Next.js 15.3 / Turbopack `optimizePackageImports` resolves this correctly at build time (per project_phase67_closed). No runtime issue. Lower priority — Phase 72 SFCombobox shipped with the same form.

**Fix:** Prefer direct path: `import { SFProgress } from "./sf-progress"`.

### IN-02: `progress` keying-collision caveat partially documented

**File:** `components/sf/sf-file-upload.tsx:339`

Progress is keyed by `file.name`; entry key includes `__size__lastModified`. Same-name file modified between drops shares progress value. JSDoc covers "different directories" but not the modified-file variant.

**Fix:** Optional JSDoc extension to mention the modified-file variant.

### IN-03: `validateMime` silently passes when `accept` parses to empty parts

**File:** `components/sf/sf-file-upload.tsx:108-120`

`accept=", "` produces `parts.length === 0` and short-circuits to `return true` — accepts ALL files. Threat model T-74-01 documents `accept` as UX hint, not validator, so not security-critical. Surprising silent-pass behavior.

**Fix:** Either fail-closed when `accept` parses empty, or document in JSDoc.

### IN-04: Single-file-mode silent file drop with no aria-live signal

**File:** `components/sf/sf-file-upload.tsx:194-213`

In `multiple={false}` mode, dropping 2+ files silently discards files 2..N (`slice(0, 1)`). aria-live announces `"1 file selected"` — screen reader users get no feedback that additional files were ignored.

**Fix:** Optional — surface truncation in announcement: `"1 file selected, N ignored (single-file mode)"`.

## Files reviewed

- components/sf/sf-file-upload.tsx
- components/sf/sf-progress.tsx
- components/sf/index.ts
- app/dev-playground/sf-file-upload/page.tsx
- tests/v1.10-phase74-sf-file-upload.spec.ts
- tests/v1.10-phase74-sf-file-upload-axe.spec.ts
- stories/sf-file-upload.stories.tsx
- public/r/sf-file-upload.json
- public/r/registry.json
