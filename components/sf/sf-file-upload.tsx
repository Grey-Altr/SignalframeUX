"use client";

/**
 * File upload composition — FRAME layer Pattern C primitive.
 *
 * Drop zone with role="button" + hidden <input type="file"> keyboard
 * fallback (WCAG 2.5.1) + file list with per-file remove + per-file
 * progress via SFProgress + image preview via URL.createObjectURL +
 * controlled/uncontrolled API. Zero new runtime deps. Consumer owns
 * the HTTP upload entirely — component owns UI state only.
 *
 * ============================================================
 * ANTI-FEATURES (NOT shipped — by design, not by oversight)
 * ============================================================
 *
 * 1. HTTP upload (network request APIs — Fetch, XHR, Axios, or
 *    similar) — Consumer owns the network call. Component emits
 *    files via onChange and renders consumer-supplied
 *    `progress: Record<fileName, number>` via SFProgress.
 *    Embedding network code violates FU-04 zero-dep +
 *    single-responsibility (UI state only, not network state).
 *
 * 2. File-reader API (e.g. readAsDataURL) — Converts entire file
 *    to a base64 string in JS heap (~13 MB string for a 10 MB
 *    image). Use URL.createObjectURL — O(1), references browser's
 *    in-memory blob without copying.
 *
 * 3. Aggregate maxTotalSize — FU-06 deferred. Consumer enforces
 *    at form level. Per-file `maxSize` only.
 *
 * 4. Retry on failure — FU-06 deferred. Consumer owns upload
 *    state machine including retry policy.
 *
 * 5. Drop-anywhere mode (window-level drop handler) — FU-06
 *    deferred. Drop is scoped to the drop zone wrapper only.
 *
 * 6. react-dropzone, react-dnd, or any third-party drag-drop
 *    library — FU-04 zero-dep contract. Native HTML5 drag-drop
 *    + <input type="file"> is ~60 LOC; no abstraction earns a
 *    new dependency.
 *
 * 7. Server-side file-type validation — `accept` and `File.type`
 *    are BROWSER HINTS for UX only. A renamed `evil.exe` →
 *    `evil.png` will pass MIME validation. Consumers MUST
 *    validate uploaded bytes server-side (magic-number sniffing,
 *    AV scan, content inspection).
 *
 * ============================================================
 * KNOWN CAVEATS
 * ============================================================
 *
 * - `progress` keying collision: two files named `photo.jpg`
 *   from different directories share a progress entry. The
 *   `progress` prop is keyed by `file.name` per FU-03 contract;
 *   consumers needing per-instance progress should de-duplicate
 *   filenames before passing files to the component.
 *
 * - `dataTransfer.files` cannot be set from JS in Chromium for
 *   security reasons (crbug.com/531834, microsoft/playwright#13362).
 *   This means automated tests cannot E2E-verify the drag→drop
 *   acceptance path — see 74-VERIFICATION.md split-test strategy.
 *   The visual drag-active state IS testable via Storybook play()
 *   + fireEvent.dragOver().
 *
 * @example  // uncontrolled
 * <SFFileUpload
 *   accept="image/*,.pdf"
 *   maxSize={5 * 1024 * 1024}
 *   multiple
 *   onChange={(files) => console.log(files)}
 * />
 *
 * @example  // controlled with progress
 * <SFFileUpload
 *   files={files}
 *   onChange={setFiles}
 *   progress={{ "photo.jpg": 47 }}
 * />
 */

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { SFProgress } from "@/components/sf";
import { cn } from "@/lib/utils";

export type SFFileEntry = {
  key: string;
  file: File;
  accepted: boolean;
  error?: string;
};

export interface SFFileUploadProps {
  files?: SFFileEntry[];
  onChange?: (files: SFFileEntry[]) => void;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  progress?: Record<string, number>;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

function makeFileKey(file: File): string {
  return `${file.name}__${file.size}__${file.lastModified}`;
}

function validateMime(file: File, accept?: string): boolean {
  if (!accept) return true;
  const parts = accept
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) return true;
  return parts.some((p) => {
    if (p.startsWith(".")) return file.name.toLowerCase().endsWith(p.toLowerCase());
    if (p.endsWith("/*")) return file.type.startsWith(p.slice(0, -1));
    return file.type === p;
  });
}

function validateSize(file: File, maxSize?: number): boolean {
  if (maxSize === undefined) return true;
  return file.size <= maxSize;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function isImageMime(type: string): boolean {
  return type.startsWith("image/");
}

export function SFFileUpload(props: SFFileUploadProps) {
  const {
    files: filesProp,
    onChange,
    accept,
    maxSize,
    multiple,
    progress,
    disabled,
    className,
    ariaLabel,
  } = props;

  const isControlled = filesProp !== undefined;
  const [internalFiles, setInternalFiles] = useState<SFFileEntry[]>([]);
  const files: SFFileEntry[] = isControlled ? (filesProp ?? []) : internalFiles;

  const [isDragging, setIsDragging] = useState(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState("");
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

  const hiddenInputRef = useRef<HTMLInputElement>(null);

  // Build/revoke preview URLs for accepted image files.
  // StrictMode-safe: cleanup runs on next-effect-run AND unmount.
  useEffect(() => {
    const urls: Record<string, string> = {};
    for (const f of files) {
      if (f.accepted && isImageMime(f.file.type)) {
        urls[f.key] = URL.createObjectURL(f.file);
      }
    }
    setPreviewUrls(urls);
    return () => {
      for (const url of Object.values(urls)) {
        URL.revokeObjectURL(url);
      }
    };
  }, [files]);

  const commitFiles = useCallback(
    (next: SFFileEntry[]) => {
      if (!isControlled) setInternalFiles(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  const handleFiles = useCallback(
    (incoming: File[]) => {
      if (incoming.length === 0) return;

      // De-duplicate against existing entries by makeFileKey.
      const existingKeys = new Set(files.map((f) => f.key));
      const fresh = incoming.filter((f) => !existingKeys.has(makeFileKey(f)));
      if (fresh.length === 0) return;

      // In single-file mode, take only the first incoming file and replace state.
      const slice = multiple ? fresh : fresh.slice(0, 1);

      const validated: SFFileEntry[] = slice.map((f) => {
        const okMime = validateMime(f, accept);
        const okSize = validateSize(f, maxSize);
        let error: string | undefined;
        if (!okMime) error = "File type not allowed";
        else if (!okSize)
          error = `File too large (${formatBytes(f.size)} > ${formatBytes(maxSize ?? 0)})`;
        return {
          key: makeFileKey(f),
          file: f,
          accepted: okMime && okSize,
          error,
        };
      });

      const next = multiple ? [...files, ...validated] : validated;
      commitFiles(next);

      const accepted = validated.filter((e) => e.accepted).length;
      const rejected = validated.length - accepted;
      setLiveAnnouncement(
        rejected > 0
          ? `${accepted} files added, ${rejected} rejected`
          : `${accepted} file${accepted === 1 ? "" : "s"} selected`
      );
    },
    [files, multiple, accept, maxSize, commitFiles]
  );

  const handleRemove = useCallback(
    (key: string) => {
      const target = files.find((f) => f.key === key);
      const next = files.filter((f) => f.key !== key);
      commitFiles(next);
      if (target) setLiveAnnouncement(`${target.file.name} removed`);
    },
    [files, commitFiles]
  );

  const dropZoneLabel = useMemo(
    () =>
      ariaLabel ??
      "Upload files. Press Enter or Space to browse, or drag and drop files here.",
    [ariaLabel]
  );

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Drop zone wrapper */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={dropZoneLabel}
        aria-disabled={disabled || undefined}
        data-drag-active={isDragging || undefined}
        data-disabled={disabled || undefined}
        onClick={() => {
          if (disabled) return;
          hiddenInputRef.current?.click();
        }}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            hiddenInputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (disabled) return;
          handleFiles(Array.from(e.dataTransfer.files));
        }}
        onPaste={(e) => {
          if (disabled) return;
          const pasted = Array.from(e.clipboardData.files);
          if (pasted.length > 0) handleFiles(pasted);
        }}
        className={cn(
          "sf-focusable",
          "border-2 border-foreground bg-muted",
          "p-[var(--sfx-space-6)] text-center",
          "cursor-pointer select-none",
          "font-mono uppercase tracking-wider text-xs text-foreground",
          isDragging && "bg-foreground/10",
          disabled && "opacity-50 pointer-events-none"
        )}
      >
        <span aria-hidden="true" className="block text-2xl mb-[var(--sfx-space-2)]">
          +
        </span>
        <span className="block">
          {isDragging ? "Drop // here" : "Drop files // or // click to browse"}
        </span>
        {accept && (
          <span className="block mt-[var(--sfx-space-2)] text-muted-foreground normal-case tracking-normal">
            Accept // {accept}
          </span>
        )}
        {maxSize !== undefined && (
          <span className="block mt-[var(--sfx-space-1)] text-muted-foreground normal-case tracking-normal">
            Max // {formatBytes(maxSize)}
          </span>
        )}
        <input
          ref={hiddenInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => {
            handleFiles(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
          style={{ display: "none" }}
          data-testid="sf-file-upload-input"
        />
      </div>

      {/* aria-live announcement region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveAnnouncement}
      </div>

      {/* File list */}
      {files.length > 0 && (
        <ul
          role="list"
          aria-label="Selected files"
          className="mt-[var(--sfx-space-3)] divide-y-2 divide-foreground border-2 border-foreground"
        >
          {files.map((entry) => {
            const previewUrl = previewUrls[entry.key];
            const fileProgress = progress?.[entry.file.name];
            return (
              <li
                key={entry.key}
                role="listitem"
                data-accepted={entry.accepted || undefined}
                data-rejected={!entry.accepted || undefined}
                className={cn(
                  "flex items-start gap-[var(--sfx-space-3)] p-[var(--sfx-space-3)]",
                  !entry.accepted && "bg-destructive/10"
                )}
              >
                {previewUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt=""
                    className="w-[48px] h-[48px] object-cover border-2 border-foreground"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-mono uppercase tracking-wider text-xs truncate text-foreground">
                    {entry.file.name}
                  </div>
                  <div className="font-mono text-xs text-muted-foreground normal-case tracking-normal mt-[var(--sfx-space-1)]">
                    {formatBytes(entry.file.size)}
                    {entry.file.type && (
                      <>
                        {" // "}
                        {entry.file.type}
                      </>
                    )}
                  </div>
                  {entry.error && (
                    <div
                      // text-foreground (not text-destructive) for WCAG AA
                      // contrast: text-destructive (#c53637 light-mode) on
                      // bg-destructive/10 (light pink) measures 3.76:1, fails
                      // 4.5:1. text-foreground inherits the high-contrast
                      // token (black on light, white on dark) → 4.5:1+ in
                      // both themes. Visual error indication preserved via
                      // bg-destructive/10 row tint + data-error attr +
                      // font-bold weight bump. Surfaced by Phase 74 axe
                      // color-contrast scan (Rule 1 auto-fix).
                      className="font-mono font-bold uppercase tracking-wider text-xs text-foreground mt-[var(--sfx-space-1)]"
                      data-error
                    >
                      {entry.error}
                    </div>
                  )}
                  {entry.accepted && fileProgress !== undefined && (
                    <SFProgress
                      value={fileProgress}
                      aria-label={`Upload progress for ${entry.file.name}`}
                      className="h-1 mt-[var(--sfx-space-2)]"
                    />
                  )}
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${entry.file.name}`}
                  onClick={() => handleRemove(entry.key)}
                  className={cn(
                    "sf-focusable",
                    "px-[var(--sfx-space-3)] py-[var(--sfx-space-2)]",
                    "border-l-2 border-foreground",
                    "font-mono uppercase tracking-wider text-xs",
                    "text-foreground hover:bg-foreground hover:text-background",
                    "cursor-pointer self-stretch"
                  )}
                >
                  ×
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------
// Pattern C contract reminder (FU-04):
//   - SFFileUpload IS exported from components/sf/index.ts barrel
//   - Zero new runtime npm deps — native HTML5 drag-drop + <input type="file">
//     + URL.createObjectURL only. NO react-dropzone / react-dnd / similar.
//   - Consumer owns HTTP — component contains zero network-request calls
//     (Fetch / XHR / Axios or similar). The `progress: Record<fileName,
//     number>` prop is the consumer's contract for surface-level progress
//     reporting via SFProgress.
//   - URL.createObjectURL paired with URL.revokeObjectURL in useEffect
//     cleanup is the ONLY image-preview path. NEVER the file-reader
//     readAsDataURL path (heap blow-up on large files).
//   - dataTransfer.files cannot be set from JS in Chromium (crbug.com/531834);
//     drag-drop file ingestion is NOT E2E-testable in CI Playwright. Split-
//     test strategy lives at .planning/phases/74-sffileupload/74-VERIFICATION.md.
// -----------------------------------------------------------------------
