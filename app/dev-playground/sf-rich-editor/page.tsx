"use client";

/**
 * SFRichEditor dev playground + Playwright/axe fixture.
 * Mounts 4 sections covering the full RE-03 controlled API surface.
 * Vacuous-green guard: axe tests assert [contenteditable="true"] is visible
 * before calling analyze() — this page ensures the editor IS mounted.
 *
 * Convention-only suppression via discovery-list omission: this route is NOT
 * added to app/sitemap.ts, NOT linked from production navigation, and the
 * directory name `dev-playground` is self-documenting as a fixture surface.
 *
 * Import: SFRichEditorLazy from direct path (never via barrel — Pattern B).
 */

import { useState } from "react";
import { SFRichEditorLazy } from "@/components/sf/sf-rich-editor-lazy";

const FIXTURE_INITIAL_HTML =
  "<p>Hello <strong>world</strong>. This is the <em>controlled</em> fixture.</p><h1>Heading 1</h1><ul><li>List item one</li><li>List item two</li></ul><blockquote>A blockquote paragraph.</blockquote>";

export default function SFRichEditorPlayground() {
  const [controlledValue, setControlledValue] = useState(FIXTURE_INITIAL_HTML);

  return (
    <main className="p-[var(--sfx-space-8)] max-w-[var(--max-w-content)] mx-auto space-y-[var(--sfx-space-8)]">
      <h1 className="font-mono uppercase tracking-wider text-sm text-muted-foreground">
        sf-rich-editor — dev playground
      </h1>

      {/* Section 1: Uncontrolled default (empty) — axe fixture: empty state */}
      <section data-testid="fixture-uncontrolled-empty">
        <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-[var(--sfx-space-2)]">
          Uncontrolled — empty
        </h2>
        <SFRichEditorLazy placeholder="Start typing..." />
      </section>

      {/* Section 2: Controlled with value + onChange — axe fixture: with-content state */}
      <section data-testid="fixture-controlled">
        <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-[var(--sfx-space-2)]">
          Controlled — value + onChange
        </h2>
        <SFRichEditorLazy
          value={controlledValue}
          onChange={setControlledValue}
        />
        <pre
          data-testid="fixture-controlled-output"
          className="mt-[var(--sfx-space-4)] p-[var(--sfx-space-4)] border border-foreground font-mono text-xs overflow-auto max-h-[120px] whitespace-pre-wrap"
        >
          {controlledValue}
        </pre>
      </section>

      {/* Section 3: Read-only — axe fixture: readOnly state */}
      <section data-testid="fixture-readonly">
        <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-[var(--sfx-space-2)]">
          Read-only
        </h2>
        <SFRichEditorLazy value={FIXTURE_INITIAL_HTML} readOnly />
      </section>

      {/* Section 4: defaultValue (uncontrolled with initial content) — character count fixture */}
      <section data-testid="fixture-default-value">
        <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-[var(--sfx-space-2)]">
          defaultValue — uncontrolled with initial content
        </h2>
        <SFRichEditorLazy
          defaultValue="<p>Initial content via defaultValue prop.</p>"
          placeholder="Will not show — defaultValue overrides"
        />
      </section>
    </main>
  );
}
