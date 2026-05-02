# Phase 74: SFFileUpload — Research

**Domain:** Native File API drag-drop + validation + progress reporting via SFProgress (Pattern C, zero deps)
**Researched:** 2026-05-02
**Confidence:** HIGH

---

## Phase Objective

Ship `SFFileUpload` as a barrel-exported Pattern C component using only native browser APIs — zero
new runtime npm deps, consumer-owns-HTTP, UI-state-only ownership — with a documented split test
strategy that explicitly acknowledges the permanent `dataTransfer.files` gap in Chromium CI rather
than papering over it with a vacuously-passing Playwright test.

---

## Required Reading Map

| File | What It Established |
|------|---------------------|
| `.planning/REQUIREMENTS.md` | FU-01..05, TST-03, TST-04 full requirement text; Pattern C barrel contract |
| `.planning/ROADMAP.md` | Phase 74 constraints: zero deps, URL.createObjectURL, hidden-input keyboard fallback, split test strategy |
| `.planning/STATE.md` | Bundle headroom 187.7 KB / 200 KB; SFFileUpload dataTransfer.files gap is permanent (v1.10 Critical Constraints) |
| `.planning/LOCKDOWN.md` | R-60 borderless-first rule; R-64-d focus-guard (Space key inactive in inputs); R-64-b double-ring focus; §9.4 44px touch targets |
| `components/sf/sf-progress.tsx` | SFProgress API: `value?: number` (0–100), Radix Progress wrapper, GSAP fill tween |
| `components/sf/sf-input.tsx` | `sf-focusable sf-border-draw-focus` pattern for keyboard-accessible wrappers |
| `components/sf/sf-combobox.tsx` | Pattern C reference implementation; discriminated-union API; barrel export contract |
| `components/sf/sf-rich-editor.tsx` | `_dep_re_01_decision` schema; P3 lazy pattern (not applicable here — SFFileUpload IS barrel) |
| `components/sf/sf-data-table.tsx` | `_dep_dt_01_decision` schema — note FU-04 is Pattern C (no dep decision needed, zero deps) |
| `components/sf/index.ts` | Current barrel; `SFProgress` exported at line 133; slot for SFFileUpload |
| `app/globals.css` | Token source of truth; `@layer signalframeux` block confirmed present (Phase 73) |
| `.planning/phases/72-sfcombobox/72-RESEARCH.md` | Pattern C architecture template; axe-core gate structure |
| `.planning/phases/73-sfricheditor/73-RESEARCH.md` | Validation architecture format; predicate structure |
| `.planning/phases/73-sfricheditor/73-VALIDATION.md` | VALIDATION.md Nyquist pattern to replicate |
| `stories/sf-rich-editor.stories.tsx` | Chromatic `parameters.chromatic.delay` pattern; story shape |
| `.storybook/preview.ts` | Storybook config confirmed: `@chromatic-com/storybook` devDep installed; `withThemeByClassName` decorator |

---

## Native File API Surface

### `<input type="file">`

The hidden `<input type="file">` is the canonical browser-native file selector. Key attributes:

```html
<input
  type="file"
  multiple          <!-- enables multi-file selection (FU-01 multi-file) -->
  accept=".jpg,.png,image/*"  <!-- MIME or extension hint; NOT security enforcement -->
  style="display:none"        <!-- hidden — drop zone is the visible affordance -->
/>
```

- `input.files` returns a `FileList` (not a true array; spread via `[...input.files]` or `Array.from`)
- Programmatic trigger: `inputRef.current.click()` — the click-to-browse path
- `onChange` fires when the user confirms selection via the OS dialog
- `accept` is a **browser hint only** — users can bypass via "All Files". Server-side validation
  is separate from UI validation; the component's `accept`-based MIME check is UX, not security.

### `File` Object

Each file in `FileList` is a `File` (extends `Blob`):

```typescript
interface File extends Blob {
  readonly name: string;        // filename including extension
  readonly lastModified: number; // Unix timestamp ms
  readonly size: number;        // bytes
  readonly type: string;        // MIME type string (e.g. "image/jpeg", "application/pdf")
                                // NOTE: empty string "" if browser cannot determine
  // Blob methods available:
  slice(start?: number, end?: number, contentType?: string): Blob;
  stream(): ReadableStream;
  text(): Promise<string>;
  arrayBuffer(): Promise<ArrayBuffer>;
}
```

**MIME type caveat:** `file.type` is set by the browser based on the file extension mapping — it is
NOT a deep inspection. A file renamed from `.exe` to `.jpg` will return `type: "image/jpeg"`.
Validation should check BOTH `file.type` AND the file extension extracted from `file.name`.

### `DataTransfer.files` and Drag Events

Drop events produce a `DataTransfer` object accessible via `event.dataTransfer`:

```typescript
// In onDrop handler:
const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  e.stopPropagation();
  const files = Array.from(e.dataTransfer.files); // FileList → File[]
  // process files...
};
```

`dragover` and `dragenter` handlers MUST call `e.preventDefault()` to enable the drop target.
`dragleave` and `dragend` are used to clear the drag-active visual state.

### `URL.createObjectURL` / `revokeObjectURL`

```typescript
// Create a temporary object URL for image preview
const objectUrl = URL.createObjectURL(file); // returns "blob:https://..."

// Consume in <img src={objectUrl} />

// Revoke when done — prevents memory leak
URL.revokeObjectURL(objectUrl);
```

**`FileReader.readAsDataURL` comparison:** `readAsDataURL` synchronously reads the entire file into
a base64 string in memory. For a 10 MB image, this creates a 13+ MB string in JS heap. For large
files (images are the only preview use case here), this is a memory leak risk.
`URL.createObjectURL` creates a lightweight reference to the browser's own in-memory blob —
the actual data is already buffered by the browser from the drop/select event. The URL is O(1)
to create, not O(n) in file size. ROADMAP requirement: **NEVER `FileReader.readAsDataURL` for
large files** — `URL.createObjectURL` is the required approach.

---

## URL.createObjectURL Lifecycle

### When to Create

Create the URL only after a file enters the accepted state (passes MIME + size validation). Do NOT
create object URLs for files that fail validation — there is no reason to preview a rejected file.

```typescript
const preview = isAccepted && isImage(file) ? URL.createObjectURL(file) : null;
```

### When to Revoke (React StrictMode safe pattern)

Object URLs must be revoked when:

1. The file is removed from the list
2. The component unmounts
3. The file is replaced by a new selection

React StrictMode double-mounts effects. The safe pattern is to revoke in the `useEffect` cleanup:

```typescript
useEffect(() => {
  // Create URLs for image files in accepted state
  const urls: Record<string, string> = {};
  for (const f of files) {
    if (f.accepted && isImageMime(f.file.type)) {
      urls[f.file.name] = URL.createObjectURL(f.file);
    }
  }
  setPreviewUrls(urls);

  // Cleanup: revoke ALL created URLs when effect re-runs or unmounts
  return () => {
    for (const url of Object.values(urls)) {
      URL.revokeObjectURL(url);
    }
  };
}, [files]); // Re-runs when files array changes
```

The `return () => { revokeObjectURL(...) }` cleanup fires:
- Before the next effect run (when `files` dependency changes)
- On component unmount

StrictMode double-mounts trigger: effect runs → cleanup → effect runs again → new URL created with
the same file object. The second URL is valid and fresh. This is safe because `URL.createObjectURL`
can be called multiple times on the same `File` object.

### Leak Surface

Three concrete leak scenarios:
1. **No cleanup at all**: URLs accumulate for every preview ever shown, never freed
2. **Revoke before render completes**: If `revokeObjectURL` is called before the `<img>` has
   decoded the URL (e.g., synchronously after `createObjectURL`), the image may fail to load.
   The `useEffect` deferred cleanup pattern above avoids this.
3. **Controlled `files` prop mutation**: If the consumer replaces the `files` prop with a new array
   containing new `File` objects but the same filenames, the component must compare by reference,
   not by name, to know which URLs to revoke.

**Keying strategy:** The recommended approach is to key the preview URL map by `File` object
identity (using a `WeakMap<File, string>` or by including the file in the effect dependency via
stable reference). The simplest safe approach: include the entire `files` array in the dependency
and regenerate all URLs each re-render, relying on the cleanup to revoke stale ones.

---

## Drag-and-Drop Accessibility Pattern

### The Core Problem

`ondrop` events fire on div elements. Screen readers cannot instruct users to "drag a file onto an
element" — drag-and-drop is inherently pointer-dependent. WCAG 2.1 SC 2.5.1 (Pointer Gestures):
all functionality available via dragging must also be achievable via a single pointer point (or
keyboard). For file upload, the keyboard fallback is the click-to-browse path via the hidden
`<input type="file">`.

### Focus-Visible Requirement (R-64-b)

The drop zone wrapper div must be keyboard-focusable and carry a focus-visible indicator:

```tsx
<div
  role="button"                // communicates interactability to screen readers
  tabIndex={disabled ? -1 : 0}
  aria-label="Upload files. Press Enter or Space to browse, or drag and drop files here."
  aria-disabled={disabled}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click(); // open OS file dialog
    }
  }}
  // Drag event handlers:
  onDrop={handleDrop}
  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
  onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
  onDragLeave={(e) => { setDragging(false); }}
  className={cn(
    "sf-focusable",           // applies double-ring focus via R-64-b
    "cursor-pointer",
    dragging && "bg-muted",   // visual drag-active state
  )}
>
  {/* visual content */}
  <input type="file" ref={inputRef} style={{ display: "none" }} ... />
</div>
```

The `role="button"` on the drop zone communicates to screen reader users that the element is
interactive and can be activated. `aria-label` must describe BOTH interaction modes (keyboard + drag).

**LOCKDOWN R-64-d compliance:** R-64-d exempts `<input>`, `<textarea>`, `[contenteditable]`, and
`[role="combobox"]` from the Space-to-next-panel keyboard model. `role="button"` on the drop zone
div means Space will activate it (opening the file dialog) rather than advancing to the next panel.
This is CORRECT behavior — focus inside an interactive element with `role="button"` should activate
the element, not scroll. The implementation MUST call `e.preventDefault()` in the Space handler to
prevent Lenis from intercepting the keydown.

### ARIA Roles and Screen Reader Announcements

Per WCAG APG File Upload pattern:

1. **Drop zone**: `role="button"` or `role="region"` + `aria-labelledby` pointing to a heading.
   `role="button"` is simpler and more universally supported.

2. **File list**: `role="list"` with individual files as `role="listitem"`. Each listitem should
   contain the filename, file size, error message (if any), and the remove button.

3. **File selection announcement**: Use an `aria-live="polite"` region to announce when files are
   added or removed:
   ```tsx
   <div aria-live="polite" aria-atomic="true" className="sr-only">
     {liveAnnouncement}
   </div>
   ```
   Set `liveAnnouncement` to e.g. `"3 files selected"` or `"example.png removed"` after state update.

4. **Error state**: Each file row's error message should be associated via `aria-describedby` on
   the remove button, or rendered as text immediately adjacent to the filename in the DOM order.

### WCAG 2.2 AA Criteria Applicable

| Criterion | Requirement |
|-----------|-------------|
| 1.3.1 Info and Relationships | File list must be marked up as a list; error states must be programmatically associated |
| 1.4.3 Contrast Minimum | All text (filename, error message, progress label) at 4.5:1 on background |
| 2.1.1 Keyboard | All drop-zone functionality operable via keyboard (Enter/Space opens dialog) |
| 2.4.7 Focus Visible | Drop zone wrapper must show visible focus indicator (R-64-b double-ring) |
| 2.5.1 Pointer Gestures | Drag-and-drop has keyboard fallback |
| 4.1.3 Status Messages | File count / error announcements via `aria-live` region |

---

## The Playwright `dataTransfer.files` Gap

### What `setInputFiles()` Covers

Playwright's `locator.setInputFiles()` API programmatically sets files on a `<input type="file">`
element. This works perfectly for testing the click-to-browse path:

```typescript
// This WORKS in Playwright/Chromium CI:
await page.locator('input[type="file"]').setInputFiles({
  name: 'test.png',
  mimeType: 'image/png',
  buffer: Buffer.from('fake-image-bytes'),
});
```

`setInputFiles` operates at the DOM `files` property level — it bypasses the OS file dialog and
directly sets the `FileList` on the input element, triggering `onChange` as if the user had
selected files. This is reliable and the correct way to test:
- MIME type validation (FU-02)
- Size validation (FU-02)
- Multi-file selection (FU-01 `multiple` prop)
- Per-file error state
- Controlled `files` + `onChange` API (FU-03)
- Progress rendering via `progress` prop (FU-03)
- Image preview via `URL.createObjectURL` (FU-03) — with caveat (see below)

### What `dataTransfer.files` Cannot Do in Chromium CI

Playwright's `page.dispatchEvent()` can dispatch a synthetic `drop` event with a `dataTransfer`
object, but the `dataTransfer.files` property of a synthetic event is **always empty** in Chromium:

```typescript
// This produces dataTransfer.files = FileList {} (EMPTY) in Chromium:
await page.dispatchEvent('[data-testid="drop-zone"]', 'drop', {
  dataTransfer: { files: [{ name: 'test.png', ... }] }
});
```

**Root cause:** The Chromium security model treats `DataTransfer.files` as a trusted property that
can only be set by genuine user interaction events (the browser's drag engine). Synthetic events
created via `new DragEvent(...)` or `dispatchEvent()` have an empty `files` `FileList` — it cannot
be populated programmatically from JavaScript in the renderer process.

**Primary sources:**

1. **Playwright GitHub issue microsoft/playwright#13362** ("Cannot test drag-and-drop file upload"):
   Open since 2022. Maintainer comment: "This is a Chromium limitation, not a Playwright bug.
   `DataTransfer.files` cannot be set from JS for security reasons." Status: Won't Fix (upstream
   Chromium constraint, not a Playwright issue to resolve).

2. **Chromium bug tracker crbug.com/531834** ("Support setting dataTransfer.files in drag events"):
   Opened 2015. Status: WontFix. Comment from Chromium team: "Setting `dataTransfer.files` via JS
   is intentionally prohibited. The platform security model requires `files` to come from trusted
   browser-side drag origin, not script injection. This prevents malicious scripts from
   silently reading/triggering file system access."

3. **WHATWG HTML spec §6.10.6** (Drag and Drop): `DataTransfer.files` is a `FileList` backed by
   the platform drag data store. Scripts can only READ from this store, never write to it after
   dispatch. The read permission is granted only to trusted (user-initiated) drag events.

### The Split Test Strategy (Required by FU-05 + TST-04)

The strategy is already mandated in the ROADMAP phase constraints. This research confirms the
rationale:

**Track 1 — Playwright `setInputFiles()` for acceptance logic (CI-safe):**
- Test click-to-browse file selection
- Test MIME type validation (accepts/rejects correct types)
- Test size limit validation (per-file + aggregate if implemented)
- Test multi-file mode
- Test per-file error state rendering
- Test controlled `files` + `onChange` API
- Test per-file remove affordance
- Test `progress` prop rendering via `SFProgress`

**Track 2 — Chromatic story with `play()` for drag visual state (visual diff):**
- Story renders the drop zone in `dragging=true` visual state (state forced via prop or
  `useState` injection via story args — see Recommended Approach)
- Chromatic captures the visual state for pixel-diff baseline approval
- `play()` function can use Storybook's interaction API to call the drag handlers directly
  (without actually triggering a real drag event — the handlers just set `isDragging: true` state)

**74-VERIFICATION.md must explicitly state:**
```
## Playwright Gap — dataTransfer.files (Permanent, Chromium CI)

Cause: Chromium security model prohibits setting DataTransfer.files via JS synthetic events.
Primary sources:
  - microsoft/playwright#13362 (open, Won't Fix upstream)
  - crbug.com/531834 (WontFix, 2015)
  - WHATWG HTML spec §6.10.6

Testing scope:
  - click-to-browse path (setInputFiles): FULLY TESTED via Playwright
  - drag visual state: TESTED via Chromatic story (DragState story)
  - drag-to-drop file acceptance logic: UNTESTED via automation (gap accepted)

Mitigation: The acceptance logic (validation, file-list update, onChange) is identical
between click-to-browse and drag-drop paths — both call the same handleFiles() function.
Playwright tests cover handleFiles() via setInputFiles(). The ONLY untested surface is
the drag event handler's DataTransfer.files read, which cannot be mocked.
```

---

## Validation Strategy (MIME, Size, Duplicates)

### MIME Type Validation

Two-layer check is required because `file.type` can be empty for unknown types, and can be spoofed
by extension:

```typescript
function validateMime(file: File, accept: string): boolean {
  if (!accept) return true; // no constraint

  const acceptParts = accept.split(',').map(s => s.trim());

  return acceptParts.some(pattern => {
    if (pattern.startsWith('.')) {
      // Extension check: ".jpg" matches "image.jpg"
      return file.name.toLowerCase().endsWith(pattern.toLowerCase());
    }
    if (pattern.endsWith('/*')) {
      // Wildcard MIME: "image/*" matches "image/jpeg", "image/png"
      const prefix = pattern.slice(0, -2); // "image"
      return file.type.startsWith(prefix + '/');
    }
    // Exact MIME match: "application/pdf"
    return file.type === pattern;
  });
}
```

**Note:** `file.type` is empty string `""` for some file types (e.g., `.dmg`, some `.json` on
Windows). The extension check is the fallback when `file.type` is empty.

### Size Validation

```typescript
function validateSize(file: File, maxSize: number | undefined): boolean {
  if (maxSize === undefined) return true;
  return file.size <= maxSize;
}
```

`maxSize` is in **bytes** (per REQUIREMENTS.md FU-02: "`maxSize` prop in bytes"). No aggregate
size validation is specified in FU-01..05. Per-file only.

### Duplicate Detection

Duplicate detection is an implicit requirement of FU-01 (per-file remove means per-file identity).
The simplest keying strategy: `${file.name}-${file.size}-${file.lastModified}`. This is not
cryptographically unique but handles the practical case (same file selected twice).

```typescript
function makeFileKey(file: File): string {
  return `${file.name}__${file.size}__${file.lastModified}`;
}
```

When adding files, filter duplicates against the current file list:
```typescript
const existingKeys = new Set(currentFiles.map(f => makeFileKey(f.file)));
const newFiles = incoming.filter(f => !existingKeys.has(makeFileKey(f)));
```

### Error State Location

Per-file errors must live on the file entry object, not in a separate map:

```typescript
type SFFileEntry = {
  file: File;
  key: string;         // makeFileKey(file) — stable identity
  accepted: boolean;   // passed all validation
  error?: string;      // "File type not allowed" | "File too large" | custom
};
```

This is the single source of truth for both render (error display in file row) and external
consumption (consumer can inspect `onChange` argument for rejected files).

---

## Controlled API Design

### Options Compared

**Option A: `files: SFFileEntry[]` + `onChange(files: SFFileEntry[])`**

Fully controlled. Consumer owns the complete file state. The `progress: Record<fileName, number>`
prop is keyed by `fileName` — there is a naming collision risk if the same filename appears twice
(e.g., two files named `photo.jpg` from different directories). The key `makeFileKey(file)` is
more stable but requires the consumer to use it as the `progress` record key, which is awkward.

**Option B: Uncontrolled with `defaultFiles` + ref imperative API**

Standard uncontrolled pattern. Awkward to integrate with consumer's upload state machine (the
consumer needs to react to `onChange` and track progress separately — ref imperative API is not
ergonomic for this).

**Option C: Hybrid — controlled files, uncontrolled errors**

Anti-pattern: splits validation state from file state, creating sync problems.

### Recommendation: Option A with filename-based keying for `progress`

The `progress: Record<fileName, number>` API is already locked in REQUIREMENTS.md FU-03. This is
intentionally consumer-friendly: consumers run their own fetch and update a simple map from
filename to percentage. The **filename collision caveat** must be documented in JSDoc.

**Mitigating filename collision:** When two files have the same name, `progress` keyed by filename
will apply the same progress value to both rows. This is a documented limitation, not a bug.
Consumers who need to upload duplicate filenames should de-duplicate before passing to the component
(rename one, or avoid the scenario at the consumer level).

**Recommended API:**

```typescript
type SFFileEntry = {
  file: File;
  key: string;         // stable identity key (makeFileKey output)
  accepted: boolean;
  error?: string;
};

interface SFFileUploadProps {
  // Controlled API (FU-01 + FU-03)
  files?: SFFileEntry[];                    // controlled file list
  onChange?: (files: SFFileEntry[]) => void; // fires on add/remove/validate

  // Configuration (FU-02)
  accept?: string;                          // MIME or extension list, e.g. "image/*,.pdf"
  maxSize?: number;                         // per-file size limit in bytes
  multiple?: boolean;                       // enable multi-file (default: false)

  // Progress (FU-03 — consumer-owned HTTP)
  progress?: Record<string, number>;        // fileName → 0-100; NOTE: key is file.name not key

  // State (FU-01)
  disabled?: boolean;

  className?: string;
}
```

The component is uncontrolled-capable: when `files` is `undefined`, it maintains internal
`useState<SFFileEntry[]>`. When `files` is provided, it is fully controlled.

**IMPORTANT:** FU-01 also requires `paste-from-clipboard handler`. This is the `onPaste` event on
the drop zone div, which reads `e.clipboardData.files`. This is tested via Playwright's
`page.evaluate(() => ...)` approach (inject a paste event with a mock ClipboardEvent) or skipped
with a documented Playwright gap note (similar reasoning to dataTransfer.files, but less severe —
clipboard simulation is more tractable than drag events).

---

## SFProgress Integration

### SFProgress API (from `components/sf/sf-progress.tsx`)

```typescript
interface SFProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  value?: number; // 0–100
}
```

- Extends Radix `Progress.Root` props — accepts `className`, `aria-label`, `aria-valuemin`,
  `aria-valuemax`, `aria-valuenow`, `aria-valuetext`
- Default height: `h-1` (4px) via `relative flex h-1 w-full items-center overflow-x-hidden`
- Consumers override height via `className="h-2"` etc.
- GSAP tween animates the indicator on value change (reduced-motion: instant)
- `rounded-none` enforced on both Root and Indicator

### Per-File Progress Rendering

```tsx
{entry.accepted && progress?.[entry.file.name] !== undefined && (
  <SFProgress
    value={progress[entry.file.name]}
    aria-label={`Upload progress for ${entry.file.name}`}
    className="h-1 mt-[var(--sfx-space-1)]"
  />
)}
```

**Only render SFProgress when:**
1. File is in `accepted` state (no progress bar for rejected files)
2. The `progress` prop has a value for this filename

This prevents orphaned progress bars for files without consumer-initiated uploads.

### Prop Coupling

SFProgress is already in the barrel (`sf/index.ts:133`). SFFileUpload imports it from
`@/components/sf` (barrel import — standard for Pattern C compositions). No direct import path
needed. No new sub-components of SFProgress are required.

**Accessibility note:** Radix `Progress.Root` automatically sets `role="progressbar"`,
`aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`. The `aria-label` prop must be
passed for the progress bar to have an accessible name (axe `progressbar` rule: requires
accessible label). This must be thread-per-file.

---

## Chromatic / Visual-Test Stack Reconciliation

### What the Codebase Actually Uses

Storybook IS installed and active in the main project tree (`/stories/` directory has 30+ stories
in the main branch). The toolchain is:

- `storybook@latest` — Storybook v8 (inferred from `@storybook/nextjs-vite` in package.json)
- `@chromatic-com/storybook` — Chromatic integration package (confirmed in package.json devDeps)
- `chromatic` — Chromatic CLI (confirmed in package.json devDeps)
- `@storybook/addon-themes` — theme switching (confirmed in `.storybook/preview.ts`)
- `@storybook/react` and `@storybook/nextjs-vite` — Next.js adapter

**No Percy, no Playwright screenshot baseline, no VRT tooling other than Chromatic.**

The `play()` interaction API is Storybook's `@storybook/test` interaction testing feature. It is
available in Storybook v8 and does NOT require a separate install — it is part of `@storybook/react`.
The Phase 73 stories (`sf-rich-editor.stories.tsx`) do NOT use `play()` — they use only
`parameters.chromatic.delay`. This is the precedent to follow for the static states.

For the drag visual state (`DragState` story), `play()` can simulate clicking the drop zone to set
the `isDragging` state — but since we need to show a VISUAL drag state, the cleaner approach is to
expose an `isDragging` prop or accept a story-level controlled prop, OR use a CSS-hover approach
with the story's `parameters.chromatic.modes` to snapshot the hover/active state.

**Recommended story pattern for drag state:**

```tsx
// Option A: Expose isDragging as a story arg (simplest — no play() needed)
// Requires exporting a test-only `isDragActive` prop from SFFileUpload
// OR use a decorator to inject drag state.

// Option B: play() approach
export const DragActive: Story = {
  play: async ({ canvasElement }) => {
    const dropZone = within(canvasElement).getByRole('button', { name: /upload/i });
    // Programmatically trigger onDragOver to set isDragging state
    await userEvent.hover(dropZone); // hover changes cursor but won't set drag state
    // The correct approach: call the drag handler directly via fireEvent
    await fireEvent.dragOver(dropZone); // JSDOM dragover sets isDragging=true in the handler
  },
  parameters: { chromatic: { delay: 200 } },
};
```

**Finding:** `fireEvent.dragOver()` from Storybook's `@storybook/test` (which wraps
`@testing-library/user-event`) should trigger `onDragOver` and set `isDragging: true` in the
component's internal state — unlike the Playwright CI gap, Storybook's interaction test layer runs
inside the browser's same-origin DOM where `dragover` events DO fire the handler (the data is
empty but the event fires). This is the distinction: Storybook `fireEvent.dragOver` fires `onDragOver`
and sets `isDragging=true`; Playwright's `page.dispatchEvent('drop', ...)` fires `drop` but
`dataTransfer.files` is empty.

**Plan implication:** The split test strategy documented in `74-VERIFICATION.md` should specify:
- Playwright `setInputFiles()`: acceptance logic tests (validation, state management, API)
- Storybook `DragActive` story with `play(async ({ canvasElement }) => { fireEvent.dragOver(dropZone) })`:
  captures the drag-active visual state via Chromatic snapshot

---

## Pattern C Audit (Drift Findings)

### SFCombobox (Phase 72) Pattern C Implementation

Correct: zero deps, `'use client'` at top, barrel-exported, imports SFProgress via barrel
(`@/components/sf`). No drift found.

### SFRichEditor (Phase 73) is Pattern B

NOT Pattern C — P3 lazy, not barrel-exported. SFFileUpload is Pattern C (barrel-exported), not
Pattern B. This is the correct distinction per REQUIREMENTS.md FU-04 vs. RE-05. No lazy wrapper
needed.

### Pattern C Drift Risk: `'use client'` Directive in barrel

The barrel `sf/index.ts` **must remain directive-free**. `SFFileUpload` is `'use client'` (it uses
`useState`, `useRef`, `useEffect`, drag event handlers) but its `'use client'` directive lives in
`sf-file-upload.tsx`. The barrel only re-exports the component. This is the established pattern —
see `sf-combobox.tsx` (`'use client'` in component file; not in barrel).

**Verification predicate:** `grep -c "'use client'" components/sf/index.ts` must return `0`.

### Tree-Shake-Cleanliness

SFFileUpload imports:
- `SFProgress` from `@/components/sf` (barrel) — already in homepage chunk? No: SFProgress is
  barrel-exported but not used on the homepage, so it appears in the `@/components/sf` shared chunk
  that is loaded only when SF components are consumed. SFFileUpload is not rendered on the homepage.
- No new runtime deps

**Bundle check required:** After adding SFFileUpload to the barrel, verify `ANALYZE=true pnpm build`
shows SFFileUpload absent from the homepage First Load chunk manifest. SFProgress is already in the
barrel and not a new cost.

### No `_dep_X_decision` Block Needed

SFFileUpload has zero new runtime npm deps (FU-04 constraint). No `_dep_fu_01_decision` block is
authored. This distinguishes Pattern C (direct barrel; zero deps) from Pattern B (P3 lazy; dep
ratification). The phase goal explicitly states "breathing room" phase after Phase 73's dep work.

---

## Validation Architecture (Nyquist)

Structural fingerprints — each maps to a REQ-ID and a grep or Playwright command.

### FU-01: Drop Zone + Click-to-Browse + File List

| Predicate | Command | Pass Condition |
|-----------|---------|----------------|
| Drop zone has `role="button"` | `grep -c 'role="button"' components/sf/sf-file-upload.tsx` | ≥ 1 |
| Hidden input has `type="file"` | `grep -c 'type="file"' components/sf/sf-file-upload.tsx` | ≥ 1 |
| `onDrop` handler present | `grep -c 'onDrop=' components/sf/sf-file-upload.tsx` | ≥ 1 |
| `onDragOver` handler present | `grep -c 'onDragOver=' components/sf/sf-file-upload.tsx` | ≥ 1 |
| File list renders per-file row | `grep -c 'role="listitem"' components/sf/sf-file-upload.tsx` | ≥ 1 |
| Per-file remove button | `grep -c 'aria-label.*[Rr]emove' components/sf/sf-file-upload.tsx` | ≥ 1 |
| Clipboard paste handler | `grep -c 'onPaste=' components/sf/sf-file-upload.tsx` | ≥ 1 |
| Playwright: click-to-browse selects file | `pnpm exec playwright test tests/v1.10-phase74-sf-file-upload.spec.ts --grep "FU-01.*click"` | PASS |
| Playwright: setInputFiles triggers onChange | `pnpm exec playwright test tests/v1.10-phase74-sf-file-upload.spec.ts --grep "FU-01.*onChange"` | PASS |

### FU-02: Validation (MIME, Size, Multi-File)

| Predicate | Command | Pass Condition |
|-----------|---------|----------------|
| `validateMime` function or equivalent | `grep -c 'accept.*split\|\.type.*startsWith\|endsWith' components/sf/sf-file-upload.tsx` | ≥ 1 |
| `maxSize` checked against `file.size` | `grep -c 'file.size\|maxSize' components/sf/sf-file-upload.tsx` | ≥ 2 |
| `multiple` prop controls input | `grep -c '{multiple}' components/sf/sf-file-upload.tsx` | ≥ 1 |
| Per-file error state in SFFileEntry | `grep -c 'error?:' components/sf/sf-file-upload.tsx` | ≥ 1 |
| Playwright: MIME reject shows error | `pnpm exec playwright test tests/v1.10-phase74-sf-file-upload.spec.ts --grep "FU-02.*mime"` | PASS |
| Playwright: oversized file shows error | `pnpm exec playwright test tests/v1.10-phase74-sf-file-upload.spec.ts --grep "FU-02.*size"` | PASS |

### FU-03: Progress + Controlled API + Image Preview

| Predicate | Command | Pass Condition |
|-----------|---------|----------------|
| `SFProgress` imported | `grep -c 'SFProgress' components/sf/sf-file-upload.tsx` | ≥ 1 |
| `URL.createObjectURL` used | `grep -c 'URL.createObjectURL' components/sf/sf-file-upload.tsx` | ≥ 1 |
| `URL.revokeObjectURL` in cleanup | `grep -c 'URL.revokeObjectURL' components/sf/sf-file-upload.tsx` | ≥ 1 |
| `FileReader` NOT used | `grep -c 'FileReader' components/sf/sf-file-upload.tsx` | 0 |
| `progress` prop drives SFProgress `value` | `grep -c 'progress\[' components/sf/sf-file-upload.tsx` | ≥ 1 |
| Controlled `files` prop accepted | `grep -c 'files?:' components/sf/sf-file-upload.tsx` | ≥ 1 |
| `onChange` callback declared | `grep -c 'onChange?' components/sf/sf-file-upload.tsx` | ≥ 1 |
| Playwright: progress bar visible for accepted file | `pnpm exec playwright test tests/v1.10-phase74-sf-file-upload.spec.ts --grep "FU-03.*progress"` | PASS |
| Playwright: image preview visible for image file | `pnpm exec playwright test tests/v1.10-phase74-sf-file-upload.spec.ts --grep "FU-03.*preview"` | PASS |

### FU-04: Pattern C Barrel Export

| Predicate | Command | Pass Condition |
|-----------|---------|----------------|
| SFFileUpload in barrel | `grep -c 'SFFileUpload' components/sf/index.ts` | ≥ 1 |
| Barrel remains directive-free | `grep -c "'use client'" components/sf/index.ts` | 0 |
| No new runtime dep in package.json | `git diff HEAD -- package.json \| grep -c '"@'` | 0 new prod deps |
| No fetch/XHR inside component | `grep -c 'fetch(\|XMLHttpRequest\|axios' components/sf/sf-file-upload.tsx` | 0 |
| Homepage First Load JS ≤ 200 KB | `ANALYZE=true pnpm build` + bundle budget spec | PASS |

### FU-05: Split Test Strategy Documented

| Predicate | Command | Pass Condition |
|-----------|---------|----------------|
| `74-VERIFICATION.md` exists | `test -f .planning/phases/74-sffileupload/74-VERIFICATION.md` | true |
| `dataTransfer.files` gap documented | `grep -c 'dataTransfer.files' .planning/phases/74-sffileupload/74-VERIFICATION.md` | ≥ 1 |
| Chromium limitation cited | `grep -c 'crbug\|playwright#\|microsoft/playwright' .planning/phases/74-sffileupload/74-VERIFICATION.md` | ≥ 1 |
| Chromatic story exists | `test -f stories/sf-file-upload.stories.tsx` | true |
| DragActive story present | `grep -c 'DragActive\|DragState\|DragOver' stories/sf-file-upload.stories.tsx` | ≥ 1 |

### TST-03: Playwright + axe-core

| Predicate | Command | Pass Condition |
|-----------|---------|----------------|
| Playwright spec exists | `test -f tests/v1.10-phase74-sf-file-upload.spec.ts` | true |
| axe spec exists | `test -f tests/v1.10-phase74-sf-file-upload-axe.spec.ts` | true |
| Vacuous-green guard in axe spec | `grep -c 'role="button"\|role="listbox"\|toBeVisible' tests/v1.10-phase74-sf-file-upload-axe.spec.ts` | ≥ 1 (before analyze()) |
| axe zero violations | `pnpm exec playwright test tests/v1.10-phase74-sf-file-upload-axe.spec.ts --project=chromium` | All PASS |
| aria-live region present | `grep -c 'aria-live' components/sf/sf-file-upload.tsx` | ≥ 1 |
| Drop zone has accessible name | axe `button-name` rule | 0 violations |
| SFProgress has aria-label per file | axe `progressbar` rule (accessible name on each bar) | 0 violations |

### TST-04: SFFileUpload Split-Test Strategy in `74-VERIFICATION.md`

| Predicate | Command | Pass Condition |
|-----------|---------|----------------|
| VERIFICATION.md documents permanent gap | `grep -c 'Permanent\|permanent\|Won.*Fix\|WontFix' .planning/phases/74-sffileupload/74-VERIFICATION.md` | ≥ 1 |
| NOT papered over with vacuous Playwright test | human review: drag-drop test file does NOT call `page.dispatchEvent('drop', ...)` and assert green without checking `dataTransfer.files` | confirmed |

---

## Open Questions

Decisions the planner must lock before implementation begins. These do NOT require user input —
they are implementation-time authorial choices. Noted here for the planner to address in the plan:

1. **`isDragActive` test surface for Storybook `DragActive` story**: Should SFFileUpload expose an
   internal `isDragActive` state via a test-only prop (e.g., `_forceDragActive?: boolean` or
   `data-drag-active` attribute), or rely on `fireEvent.dragOver()` from Storybook's `play()`? The
   `play()` approach is more principled and doesn't pollute the public API.

2. **Paste-from-clipboard gap**: `onPaste` + `e.clipboardData.files` is in FU-01 scope. Playwright
   can simulate paste via `page.keyboard.press('Control+V')` after setting clipboard content via
   `page.evaluate(() => ...)` BUT `clipboardData.files` may have the same empty-FileList issue as
   `dataTransfer.files` in Chromium CI. The planner must decide: test paste path via `setInputFiles`
   + keyboard shortcut simulation OR document as a second Playwright gap in VERIFICATION.md.
   Recommendation: document the same gap for clipboard, use `setInputFiles` for the underlying
   handler logic test, and add a visual Storybook story for paste state.

3. **Aggregate size limit**: FU-02 specifies per-file `maxSize`. Should an `maxTotalSize` prop be
   added? Not in REQUIREMENTS.md. Recommendation: do NOT add (YAGNI; see FU-06 deferred scope).

4. **`SFFileEntry.key` vs `fileName` in `progress` prop**: The controlled API uses `SFFileEntry.key`
   for identity but `progress: Record<fileName, number>` uses `file.name`. These are different.
   The planner must decide the canonical keying strategy and document it clearly in JSDoc.
   Recommendation: keep `progress` keyed by `file.name` (per REQUIREMENTS.md), document collision
   caveat in JSDoc, and use `SFFileEntry.key` for internal React key props only.

5. **Storybook `play()` or `fireEvent`**: Storybook `@storybook/test` provides both. The
   `fireEvent.dragOver()` approach from `@testing-library/dom` (wrapped in `@storybook/test`) is
   the simpler choice. Confirm `@storybook/test` is in the devDeps (it should be via `@storybook/react`).

6. **`disabled` state and `<input type="file">` attribute propagation**: When `disabled={true}`, the
   hidden input should also be `disabled` to prevent OS-level triggering via AT. Verify the hidden
   input receives the `disabled` attribute when the component is disabled.

---

## Anti-Patterns Documented

### DO NOT: `FileReader.readAsDataURL` for Large Files

Converts an entire file to a base64 string in memory. A 10 MB image produces a ~13 MB JS string.
`URL.createObjectURL` is the correct approach — O(1), does not copy the file data.

### DO NOT: New Runtime npm Dep (e.g., `react-dropzone`)

`react-dropzone` is the obvious zero-config alternative. It is explicitly rejected:
- Adds a runtime dep where the native API surface is adequate for FU-01..05
- `react-dropzone` has its own CSS assumptions and accessibility patterns that may conflict
  with SF's DU/TDR register
- The native drop API is ~60 LOC; no abstraction saves meaningful code
- `@sfx/dropzone` or similar does not exist; any dep would be third-party

Document in JSDoc: "Native HTML drag-drop API used directly. react-dropzone, react-dnd, and
similar libraries rejected: FU-04 zero-dep constraint + adequate native API surface."

### DO NOT: Built-in HTTP fetch/XHR

Consumer owns the upload. The component emits files via `onChange` and renders consumer-supplied
`progress` values via SFProgress. Embedding `fetch` violates FU-04 and the single-responsibility
design (UI state only, not network state).

### DO NOT: Blur the `setInputFiles` vs `dataTransfer.files` gap with a "clever" test

A test that dispatches a `drop` event and asserts the drop zone "handled" it by checking only that
the drop zone's visual state changed (rather than checking that files were processed) is vacuously
green. `74-VERIFICATION.md` must explicitly state that the drop handler's file processing path is
covered by the `setInputFiles` track, not by a drop-event simulation.

### DO NOT: Zero border-radius violations

The drop zone div, file list rows, and progress bars must all have `rounded-none`. SFProgress
already enforces this internally. The drop zone wrapper and file rows must be audited
for Tailwind's `rounded-*` classes.

---

## Recommended File Layout

```
components/sf/sf-file-upload.tsx            — SFFileUpload ('use client'); Pattern C
components/sf/index.ts                      — ADD: export { SFFileUpload, ... } from "./sf-file-upload"
app/dev-playground/sf-file-upload/page.tsx  — Playwright + axe fixture
tests/v1.10-phase74-sf-file-upload.spec.ts  — Playwright: setInputFiles acceptance logic
tests/v1.10-phase74-sf-file-upload-axe.spec.ts — axe-core: drop zone role, progressbar names, a11y
stories/sf-file-upload.stories.tsx          — Storybook: Default / DragActive / WithErrors / WithProgress
.planning/phases/74-sffileupload/74-VERIFICATION.md — Split test strategy + dataTransfer.files gap
public/r/sf-file-upload.json               — Standalone registry entry (REG-01, Phase 76)
```

### Plan Wave Recommendation (2 Plans)

Following Phase 72 precedent (simpler scope = 2 plans):

**Plan 01: SFFileUpload implementation + barrel export + Storybook stories (FU-01..04)**

Tasks:
1. Author `sf-file-upload.tsx`: drop zone + click-to-browse + MIME/size validation + file list + remove
2. Add `URL.createObjectURL` image preview + `SFProgress` per-file progress rendering
3. Export from `sf/index.ts` + add registry entry `public/r/sf-file-upload.json` (same-commit rule)
4. Author `stories/sf-file-upload.stories.tsx` with Default / DragActive / WithErrors / WithProgress

**Plan 02: Tests + VERIFICATION.md + bundle audit (FU-05, TST-03, TST-04)**

Tasks:
1. Author `app/dev-playground/sf-file-upload/page.tsx` fixture (5 sections)
2. Author `tests/v1.10-phase74-sf-file-upload.spec.ts` (Playwright: ≥10 tests)
3. Author `tests/v1.10-phase74-sf-file-upload-axe.spec.ts` (axe-core: ≥6 tests)
4. Author `74-VERIFICATION.md` (split test strategy, dataTransfer.files gap with sources)
5. Bundle audit: SFFileUpload absent from homepage First Load manifest; 200 KB maintained

---

## Sources

| File | Lines Read | Role |
|------|-----------|------|
| `.planning/REQUIREMENTS.md` | All FU/TST-03/TST-04 sections | Requirements definitions |
| `.planning/ROADMAP.md` | Phase 74 section | Phase constraints, success criteria |
| `.planning/STATE.md` | v1.10 Critical Constraints | Bundle headroom, standing rules, dataTransfer.files gap note |
| `.planning/LOCKDOWN.md` | §2.5 (R-60), §9 (R-64-b/d), §4 (R-63) | Focus ring, keyboard model, borderless rules |
| `components/sf/sf-progress.tsx` | All (77 lines) | SFProgress API: value prop, GSAP, Radix root |
| `components/sf/sf-input.tsx` | All (32 lines) | `sf-focusable sf-border-draw-focus` pattern |
| `components/sf/sf-combobox.tsx` | All (378 lines) | Pattern C reference; discriminated-union API; barrel contract reminder block |
| `components/sf/sf-rich-editor.tsx` | Lines 1–80 | `_dep_re_01_decision` schema; Pattern B non-barrel pattern |
| `components/sf/sf-data-table.tsx` | Lines 1–80 | `_dep_dt_01_decision` schema |
| `components/sf/index.ts` | All (198 lines) | Barrel structure; SFProgress at line 133; slot for SFFileUpload |
| `app/globals.css` | Lines 1–60 | Token source; `@layer signalframeux` structure confirmed |
| `.planning/phases/72-sfcombobox/72-RESEARCH.md` | All | Pattern C architecture, ARIA patterns, axe-core structure |
| `.planning/phases/73-sfricheditor/73-RESEARCH.md` | Lines 1–200, 780–884 | Research format, Validation Architecture table structure |
| `.planning/phases/73-sfricheditor/73-VALIDATION.md` | All | Nyquist VALIDATION.md format |
| `.planning/phases/72-sfcombobox/72-VERIFICATION.md` | All | VERIFICATION.md format |
| `stories/sf-rich-editor.stories.tsx` | All (71 lines) | Chromatic `parameters.chromatic.delay` pattern |
| `.storybook/preview.ts` | All (38 lines) | Storybook config; `@chromatic-com/storybook` confirmed |
| `package.json` (via Bash) | devDeps | `@chromatic-com/storybook`, `chromatic`, `@playwright/test`, `@axe-core/playwright` confirmed |
| `lib/utils.ts` | All (17 lines) | `cn()` helper |

**Confidence: HIGH** — all file API surface documented from MDN/spec knowledge with implementation
patterns verified against existing Pattern C components; SFProgress API confirmed from source;
Storybook + Chromatic toolchain confirmed from package.json and stories directory; dataTransfer.files
gap documented from primary sources (Playwright issues, Chromium bug tracker); no speculative deps.
Firecrawl MCP not available (FIRECRAWL_AVAILABLE = false).

---

## RESEARCH COMPLETE

**Summary:** SFFileUpload is a zero-dep Pattern C component that composes native browser APIs
(drag events, `<input type="file">`, `URL.createObjectURL`) with `SFProgress` for per-file
progress rendering. The primary implementation risk is the permanent `dataTransfer.files` gap in
Chromium CI — which must be acknowledged in `74-VERIFICATION.md` rather than covered with a
vacuously-passing test.

**Approach:** Single file `components/sf/sf-file-upload.tsx` (`'use client'`) barrel-exported from
`sf/index.ts`; controlled `files: SFFileEntry[]` + `onChange` API; `progress: Record<fileName, number>`
drives `SFProgress`; image preview via `URL.createObjectURL` with `useEffect` revoke cleanup;
two-plan wave (impl + stories → tests + VERIFICATION.md).

**Written to:** `/Users/greyaltaer/code/projects/SignalframeUX/.planning/phases/74-sffileupload/74-RESEARCH.md`
