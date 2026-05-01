/**
 * Playground fixture — Phase 72 Playwright + axe-core tests target this URL.
 *
 * Path: /dev-playground/sf-combobox
 *
 * Convention-only suppression via discovery-list omission: this route is NOT
 * added to app/sitemap.ts, NOT linked from any production navigation, and the
 * directory name `dev-playground` is self-documenting as a fixture surface.
 * This is a TEST FIXTURE, not a public surface. Mirrors the Phase 71
 * /dev-playground/sf-data-table precedent.
 *
 * Six sections cover the full Phase 72 acceptance matrix:
 *   1. Uncontrolled single-select (5 flat options)            — CB-01 base
 *   2. Controlled single-select with groups (9 grouped opts)  — CB-01 + CB-02
 *   3. Multi-select (controlled, value: string[])             — CB-03
 *   4. Loading state (loading={true})                         — CB-01 loading
 *   5. Empty options (options=[])                             — CB-01 empty
 *   6. Grouped options (uncontrolled)                         — CB-02 grouping
 */

"use client";

import { useState } from "react";
import { SFCombobox, type SFComboboxOption } from "@/components/sf";

const flatOptions: SFComboboxOption[] = [
  { value: "alpha", label: "Alpha" },
  { value: "bravo", label: "Bravo" },
  { value: "charlie", label: "Charlie" },
  { value: "delta", label: "Delta" },
  { value: "echo", label: "Echo" },
];

const groupedOptions: SFComboboxOption[] = [
  { value: "north-1", label: "Atlas", group: "North" },
  { value: "north-2", label: "Boreal", group: "North" },
  { value: "north-3", label: "Cinder", group: "North" },
  { value: "south-1", label: "Dune", group: "South" },
  { value: "south-2", label: "Ember", group: "South" },
  { value: "south-3", label: "Foundry", group: "South" },
  { value: "east-1", label: "Granite", group: "East" },
  { value: "east-2", label: "Helix", group: "East" },
  { value: "east-3", label: "Ion", group: "East" },
];

export default function SFComboboxPlayground() {
  const [section2Value, setSection2Value] = useState<string | undefined>(
    "north-1"
  );
  const [section3Values, setSection3Values] = useState<string[]>([]);

  return (
    <main className="p-[var(--sfx-space-6)] min-h-screen bg-background text-foreground space-y-[var(--sfx-space-8)]">
      <h1 className="font-mono text-xs uppercase tracking-wider">
        Phase 72 — SFCombobox Playground
      </h1>

      {/* Section 1: Uncontrolled single-select, flat options */}
      <section
        data-testid="section-1"
        className="space-y-[var(--sfx-space-2)]"
      >
        <h2 className="font-mono text-xs uppercase tracking-wider">
          1. Uncontrolled single-select
        </h2>
        <div className="w-[280px]" data-testid="section-1-trigger-wrapper">
          <SFCombobox
            options={flatOptions}
            placeholder="Pick one"
            ariaLabel="Section 1 single-select"
          />
        </div>
      </section>

      {/* Section 2: Controlled single-select, grouped */}
      <section
        data-testid="section-2"
        className="space-y-[var(--sfx-space-2)]"
      >
        <h2 className="font-mono text-xs uppercase tracking-wider">
          2. Controlled single-select with groups
        </h2>
        <p data-testid="section-2-value" className="font-mono text-xs">
          Value: {section2Value ?? "(none)"}
        </p>
        <div className="w-[280px]">
          <SFCombobox
            options={groupedOptions}
            value={section2Value}
            onChange={setSection2Value}
            placeholder="Pick a region"
            ariaLabel="Section 2 grouped single-select"
          />
        </div>
      </section>

      {/* Section 3: Multi-select, controlled */}
      <section
        data-testid="section-3"
        className="space-y-[var(--sfx-space-2)]"
      >
        <h2 className="font-mono text-xs uppercase tracking-wider">
          3. Multi-select (controlled, value: string[])
        </h2>
        <p data-testid="section-3-count" className="font-mono text-xs">
          Selected: {section3Values.length} of {flatOptions.length}
        </p>
        <div className="w-[480px]">
          <SFCombobox
            multiple
            options={flatOptions}
            value={section3Values}
            onChange={setSection3Values}
            placeholder="Pick many"
            ariaLabel="Section 3 multi-select"
          />
        </div>
      </section>

      {/* Section 4: Loading state */}
      <section
        data-testid="section-4"
        className="space-y-[var(--sfx-space-2)]"
      >
        <h2 className="font-mono text-xs uppercase tracking-wider">
          4. Loading state
        </h2>
        <div className="w-[280px]">
          <SFCombobox
            options={[]}
            loading
            placeholder="Loading data..."
            ariaLabel="Section 4 loading"
          />
        </div>
      </section>

      {/* Section 5: Empty options array */}
      <section
        data-testid="section-5"
        className="space-y-[var(--sfx-space-2)]"
      >
        <h2 className="font-mono text-xs uppercase tracking-wider">
          5. Empty options
        </h2>
        <div className="w-[280px]">
          <SFCombobox
            options={[]}
            placeholder="No options to pick"
            emptyText="No items available."
            ariaLabel="Section 5 empty"
          />
        </div>
      </section>

      {/* Section 6: Grouped-only options for axe + grouping verification */}
      <section
        data-testid="section-6"
        className="space-y-[var(--sfx-space-2)]"
      >
        <h2 className="font-mono text-xs uppercase tracking-wider">
          6. Grouped options (uncontrolled)
        </h2>
        <div className="w-[280px]">
          <SFCombobox
            options={groupedOptions}
            placeholder="Pick from groups"
            ariaLabel="Section 6 grouped"
          />
        </div>
      </section>
    </main>
  );
}
