"use client";

/**
 * SFFileUpload dev playground — Plan 02 Playwright + axe + Storybook fixture.
 *
 * Sections (testid prefix `fixture-{section}`):
 *   1. fixture-uncontrolled-image     — uncontrolled, accept="image/*", maxSize 5 MB, multiple
 *   2. fixture-controlled-echo        — controlled files+onChange; pre element echoes JSON state
 *   3. fixture-multi-progress         — multi-file with progress slider (0..100); per-file SFProgress
 *   4. fixture-error-1kb              — maxSize=1024 bytes; any non-trivial file rejects
 *   5. fixture-disabled               — disabled={true} state
 *
 * Not in sitemap. Not linked from public nav.
 */

import { useState } from "react";
import { SFFileUpload, type SFFileEntry } from "@/components/sf";

export default function SFFileUploadPlaygroundPage() {
  const [controlledFiles, setControlledFiles] = useState<SFFileEntry[]>([]);
  const [multiFiles, setMultiFiles] = useState<SFFileEntry[]>([]);
  const [progressPct, setProgressPct] = useState(0);

  // Build the progress map keyed by file.name (FU-03 contract):
  const progressMap: Record<string, number> = Object.fromEntries(
    multiFiles.filter((e) => e.accepted).map((e) => [e.file.name, progressPct])
  );

  return (
    <main
      data-testid="sf-file-upload-playground"
      className="p-[var(--sfx-space-6)] space-y-[var(--sfx-space-12)] bg-background text-foreground"
    >
      <h1 className="font-mono uppercase tracking-wider text-2xl">
        SFFileUpload // Playground
      </h1>

      {/* Section 1: uncontrolled + accept image */}
      <section
        data-testid="fixture-uncontrolled-image"
        aria-label="Uncontrolled image-only file upload"
      >
        <h2 className="font-mono uppercase tracking-wider text-sm mb-[var(--sfx-space-3)]">
          {"// 01 // Uncontrolled // Image-only // 5 MB max"}
        </h2>
        <SFFileUpload
          accept="image/*"
          maxSize={5 * 1024 * 1024}
          multiple
        />
      </section>

      {/* Section 2: controlled with onChange echo */}
      <section
        data-testid="fixture-controlled-echo"
        aria-label="Controlled file upload with state echo"
      >
        <h2 className="font-mono uppercase tracking-wider text-sm mb-[var(--sfx-space-3)]">
          {"// 02 // Controlled // onChange echo"}
        </h2>
        <SFFileUpload
          files={controlledFiles}
          onChange={setControlledFiles}
          multiple
        />
        <pre
          data-testid="fixture-controlled-output"
          className="mt-[var(--sfx-space-3)] p-[var(--sfx-space-3)] border-2 border-foreground bg-muted font-mono text-xs whitespace-pre-wrap break-all"
        >
          {JSON.stringify(
            controlledFiles.map((e) => ({
              name: e.file.name,
              size: e.file.size,
              type: e.file.type,
              accepted: e.accepted,
              error: e.error,
            })),
            null,
            2
          )}
        </pre>
      </section>

      {/* Section 3: multi-file with progress slider */}
      <section
        data-testid="fixture-multi-progress"
        aria-label="Multi-file upload with simulated progress"
      >
        <h2 className="font-mono uppercase tracking-wider text-sm mb-[var(--sfx-space-3)]">
          {"// 03 // Multi // Progress slider"}
        </h2>
        <SFFileUpload
          files={multiFiles}
          onChange={setMultiFiles}
          multiple
          progress={progressMap}
        />
        <label className="block mt-[var(--sfx-space-3)] font-mono uppercase tracking-wider text-xs">
          Progress // {progressPct}%
          <input
            type="range"
            min={0}
            max={100}
            value={progressPct}
            onChange={(e) => setProgressPct(Number(e.target.value))}
            data-testid="fixture-progress-slider"
            aria-label="Simulated upload progress"
            className="block mt-[var(--sfx-space-2)] w-full"
          />
        </label>
      </section>

      {/* Section 4: error fixture maxSize=1KB */}
      <section
        data-testid="fixture-error-1kb"
        aria-label="File upload with 1 KB max size for error testing"
      >
        <h2 className="font-mono uppercase tracking-wider text-sm mb-[var(--sfx-space-3)]">
          {"// 04 // 1 KB max // Error state"}
        </h2>
        <SFFileUpload
          maxSize={1024}
          multiple
        />
      </section>

      {/* Section 5: disabled */}
      <section
        data-testid="fixture-disabled"
        aria-label="Disabled file upload"
      >
        <h2 className="font-mono uppercase tracking-wider text-sm mb-[var(--sfx-space-3)]">
          {"// 05 // Disabled"}
        </h2>
        <SFFileUpload disabled multiple />
      </section>
    </main>
  );
}
