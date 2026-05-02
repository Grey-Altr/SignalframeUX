// Phase 74 Plan 02 Task 3 — SFFileUpload Storybook stories (FU-05 visual / TST-04 visual).
//
// Eight stories cover the full surface: Default, MultiFile, WithProgress,
// ImagePreview, MimeReject, SizeReject, Disabled, DragActive.
//
// The DragActive story uses play() + fireEvent.dragOver() from storybook/test
// to capture the drag-active visual state for Chromatic snapshot. This is the
// Track 2 of the split test strategy documented in 74-VERIFICATION.md —
// Storybook's interaction layer runs inside the same-origin browser DOM where
// dragover events DO fire React handlers, setting isDragging=true. Unlike
// Playwright (where dataTransfer.files is empty per Chromium security model
// crbug.com/531834), Storybook's fireEvent.dragOver IS sufficient to set the
// isDragging state for a visual diff snapshot — it does NOT need to ingest
// real files; that path is covered by Playwright setInputFiles() (Track 1).
//
// Storybook v10 import path: `storybook/test` (NOT @storybook/test — the v8
// package was unified into the storybook root namespace in v10.x).

import type { Meta, StoryObj } from "@storybook/react";
import { fireEvent, within } from "storybook/test";
import { SFFileUpload, type SFFileEntry } from "@/components/sf";

const meta = {
  title: "SF / File Upload",
  component: SFFileUpload,
  parameters: {
    layout: "centered",
    // Meta-level chromatic.delay — inherited by all stories as a baseline.
    // 200ms gives URL.createObjectURL time to mint blob: URLs and SFProgress
    // its initial GSAP tween before the snapshot fires.
    chromatic: { delay: 200 },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SFFileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

// Synthetic preset SFFileEntry — used for non-controlled stories that need to
// render file rows without OS file dialog interaction. Note: this entry uses
// a fake File via new File([...]); URL.createObjectURL on a tiny File still
// produces a valid blob: URL — image preview will mount the <img> element
// (the actual image bytes may be invalid, but the contract under test is
// "preview element is rendered for accepted image entries").
function makePresetEntry(
  name: string,
  type: string,
  size: number,
  accepted: boolean,
  error?: string
): SFFileEntry {
  const file = new File(
    [new Blob(["x".repeat(Math.min(size, 1024))], { type })],
    name,
    { type }
  );
  // Spoof size for visual testing — actual file body is small, but display
  // uses entry.file.size for the formatBytes badge.
  Object.defineProperty(file, "size", { value: size });
  return {
    key: `${name}__${size}__0`,
    file,
    accepted,
    error,
  };
}

export const Default: Story = {
  args: { accept: "image/*", maxSize: 5 * 1024 * 1024 },
  parameters: {
    // Per-story chromatic.delay duplicates meta-level inheritance — kept
    // explicit so any future story addition can't silently regress to <200ms
    // (chromatic merges, doesn't replace). Belt-and-suspenders: both levels.
    chromatic: { delay: 200 },
  },
};

export const MultiFile: Story = {
  args: {
    accept: "image/*,.pdf",
    multiple: true,
    maxSize: 10 * 1024 * 1024,
  },
  parameters: {
    chromatic: { delay: 200 },
  },
};

export const WithProgress: Story = {
  render: (args) => {
    const files: SFFileEntry[] = [
      makePresetEntry("uploading.pdf", "application/pdf", 256_000, true),
      makePresetEntry("done.png", "image/png", 128_000, true),
    ];
    return (
      <SFFileUpload
        {...args}
        files={files}
        progress={{ "uploading.pdf": 47, "done.png": 100 }}
      />
    );
  },
  args: { multiple: true },
  parameters: {
    chromatic: { delay: 200 },
  },
};

export const ImagePreview: Story = {
  render: (args) => {
    const files: SFFileEntry[] = [
      makePresetEntry("hero.png", "image/png", 64_000, true),
    ];
    return <SFFileUpload {...args} files={files} />;
  },
  parameters: {
    chromatic: { delay: 200 },
  },
};

export const MimeReject: Story = {
  render: (args) => {
    // accepted: false short-circuits the preview path in the component:
    // previewUrl is only created when (f.accepted && isImageMime(f.file.type)).
    const files: SFFileEntry[] = [
      makePresetEntry(
        "doc.pdf",
        "application/pdf",
        100_000,
        false,
        "File type not allowed"
      ),
    ];
    return <SFFileUpload {...args} files={files} />;
  },
  args: { accept: "image/*" },
  parameters: {
    chromatic: { delay: 200 },
  },
};

export const SizeReject: Story = {
  render: (args) => {
    // accepted: false short-circuits the preview path in the component:
    // previewUrl is only created when (f.accepted && isImageMime(f.file.type)).
    // image/png MIME alone is NOT enough; the entry must also be accepted.
    const files: SFFileEntry[] = [
      makePresetEntry(
        "huge.png",
        "image/png",
        10_000_000,
        false,
        "File too large (10.0 MB > 1.0 MB)"
      ),
    ];
    return <SFFileUpload {...args} files={files} />;
  },
  args: { accept: "image/*", maxSize: 1024 * 1024 },
  parameters: {
    chromatic: { delay: 200 },
  },
};

export const Disabled: Story = {
  args: { disabled: true, multiple: true },
  parameters: {
    chromatic: { delay: 200 },
  },
};

export const DragActive: Story = {
  args: { multiple: true, accept: "image/*" },
  play: async ({ canvasElement }) => {
    // Storybook's interaction layer runs inside the same-origin browser DOM.
    // fireEvent.dragOver fires the React onDragOver handler, setting
    // isDragging=true. This is the visual-state capture path documented in
    // 74-VERIFICATION.md as Track 2 — Chromatic story for drag-active visual
    // diff. Note: this does NOT populate dataTransfer.files (Chromium
    // security model — see crbug.com/531834); the file ingestion path is
    // verified separately via Playwright setInputFiles().
    const dropZone = within(canvasElement).getByRole("button");
    await fireEvent.dragOver(dropZone);
  },
  parameters: {
    // Bumped to 400ms — fireEvent.dragOver dispatches asynchronously; the
    // React batch + isDragging state update + bg-foreground/10 paint cycle
    // need extra settle time before Chromatic snapshots.
    chromatic: { delay: 400 },
  },
};
