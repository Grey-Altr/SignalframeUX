# Phase 15: Documentation Cleanup - Research

**Researched:** 2026-04-06
**Domain:** Planning document hygiene — frontmatter, requirement checkboxes, API contracts
**Confidence:** HIGH

## Summary

Phase 15 is a pure documentation pass with four discrete targets, each fully inspected. No
code changes are needed — every fix is a file edit to a `.md`, `.tsx`, or `.ts` file.

The largest task is SUMMARY.md frontmatter normalization across 15 phase directories (25+
files). The `requirements_completed` field named in DOC-01 does not yet exist anywhere in the
codebase; current SUMMARYs use inconsistent alternatives (`requirements_closed`,
`provides: [...]`). Phase 15 must introduce the field consistently across all v1.2 plans and
backfill it where the requirement IDs are traceable in v1.0/v1.1 SUMMARYs.

The second largest task is the REQUIREMENTS.md stale-checkbox audit. The v1.0 and v1.1
archived requirement files both contain `- [ ]` entries for work shipped in later milestones.
The current v1.2 REQUIREMENTS.md is already accurate for all completed items except DOC-01
itself. SFSection JSDoc is already correct (fixed in Phase 10-01). The only code-adjacent
change is adding a `useSignalframe()` API contract section to `docs/SCAFFOLDING.md`.

**Primary recommendation:** Execute as two sequential plans — Plan 01 fixes REQUIREMENTS.md
checkboxes and SUMMARY.md frontmatter; Plan 02 adds the SCAFFOLDING.md API section.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
None — no decisions section in CONTEXT.md.

### Claude's Discretion
All implementation choices are at Claude's discretion — pure documentation phase.

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DOC-01 | All SUMMARY.md frontmatters include accurate `requirements_completed` fields; stale REQUIREMENTS.md checkboxes from v1.0/v1.1 corrected; SCAFFOLDING.md documents the `useSignalframe()` API contract; SFSection JSDoc reflects `bgShift: "white" | "black"` | Four concrete sub-targets identified, each with known files and exact edits |
</phase_requirements>

---

## Audit: Current State of Each DOC-01 Sub-Target

### Sub-target 1: SUMMARY.md `requirements_completed` Field

**Finding:** The `requirements_completed` field does not exist in any SUMMARY.md file today.
Current files use three inconsistent patterns:
- `dependency_graph: { provides: [STP-01] }` — v1.2 plan 14-01
- `requires/provides:` at top level — v1.2 plans 11-01, 12-01/02, 13-01
- `dependency-graph: { provides: [...] }` with descriptive strings not IDs — v1.0/v1.1 plans

**Target standard:** A top-level `requirements_completed:` field containing a list of
formal requirement IDs (e.g. `[FND-01, FND-02]`). This field must be present and accurate
on all SUMMARY.md files.

**Scope:**
All v1.2 SUMMARY.md files have traceable requirement IDs from the REQUIREMENTS.md
traceability table. v1.0 and v1.1 SUMMARY.md files provide descriptive strings in
`provides:` rather than formal IDs — these should be backfilled where an ID is traceable,
or annotated `requirements_completed: []` (no formal ID applies) otherwise.

**Complete file list and correct values:**

| File | Correct `requirements_completed` |
|------|----------------------------------|
| 10-01-SUMMARY.md | `[FND-01, FND-02]` |
| 10-02-SUMMARY.md | `[INT-01]` |
| 11-01-SUMMARY.md | `[DX-04]` |
| 12-01-SUMMARY.md | `[INT-04]` |
| 12-02-SUMMARY.md | `[INT-03]` |
| 13-01-SUMMARY.md | `[DX-05]` |
| 14-01-SUMMARY.md | `[STP-01]` |
| 01-01 through 01-03 | `[]` (no formal IDs — token/spacing work, no versioned IDs) |
| 02-01-SUMMARY.md | `[PRM-01, PRM-02, PRM-03]` (provides: [SFContainer, SFSection, SFStack]) |
| 02-02-SUMMARY.md | `[PRM-04, PRM-05, PRM-06]` (provides: [PRM-04, PRM-05, PRM-06] — already ID format) |
| 03- through 09- | Backfill from v1.0/v1.1 REQUIREMENTS.md traceability tables |

**Source of truth for v1.0 IDs:** `.planning/milestones/v1.0-REQUIREMENTS.md` traceability table.
**Source of truth for v1.1 IDs:** `.planning/milestones/v1.1-REQUIREMENTS.md` traceability table.

---

### Sub-target 2: REQUIREMENTS.md Stale Checkboxes

**Current v1.2 REQUIREMENTS.md (`.planning/REQUIREMENTS.md`):**
All v1.2 requirements except DOC-01 show `[x]`. DOC-01 shows `[ ]` — this is correct and
will be checked off as Phase 15 is the phase completing it. No stale entries here.

**v1.0 archive (`.planning/milestones/v1.0-REQUIREMENTS.md`) — stale `[ ]` entries:**

| Req ID | Current State | Correct State | Reason |
|--------|---------------|---------------|--------|
| SIG-06 | `- [ ]` | `- [x]` | Completed in v1.1 Phase 7 (07-01) |
| SIG-07 | `- [ ]` | `- [x]` | Completed in v1.1 Phase 7 (07-01) |
| SIG-08 | `- [ ]` | `- [x]` | Completed in v1.1 Phase 7 (07-02) |
| DX-04  | `- [ ]` | `- [x]` | Completed in v1.2 Phase 11 (11-01) |
| DX-05  | `- [ ]` | `- [x]` | Completed in v1.2 Phase 13 (13-01) |
| STP-01 | `- [ ]` | `- [x]` | Completed in v1.2 Phase 14 (14-01) |

Traceability table entries for these IDs say "Deferred" — these should be updated to "Complete"
with the phase that completed them noted.

**v1.1 archive (`.planning/milestones/v1.1-REQUIREMENTS.md`) — stale `[ ]` entries:**

| Req ID | Current State | Correct State | Reason |
|--------|---------------|---------------|--------|
| SCN-01 | `- [ ]` | `- [x]` | Completed in v1.1 Phase 8 (08-01) |
| SCN-02 | `- [ ]` | `- [x]` | Completed in v1.1 Phase 8 (08-02) |
| SCN-03 | `- [ ]` | `- [x]` | Completed in v1.1 Phase 9 (09-01/02) |
| SCN-04 | `- [ ]` | `- [x]` | Completed in v1.1 Phase 9 (09-01/02) |
| INT-01 | `- [ ]` | `- [x]` | Completed in v1.1 Phase 9 + v1.2 Phase 10 (10-02) |
| INT-02 | `- [ ]` | `- [x]` | Completed in v1.1 Phase 9 |
| INT-03 | `- [ ]` | `- [x]` | Completed in v1.2 Phase 12 (12-02) |
| INT-04 | `- [ ]` | `- [x]` | Completed in v1.2 Phase 12 (12-01) |

Traceability table entries all say "Pending" — these should be updated to "Complete" with
the completing phase/plan.

**Note on v1.1 archive integrity:** SCN-01 through INT-04 being "Pending" in a SHIPPED
milestone file is the root stale state. These were completed in Phases 8-9 (v1.1) and
Phases 10-12 (v1.2). The archive must reflect shipped state.

---

### Sub-target 3: SCAFFOLDING.md `useSignalframe()` API Contract

**Current state:** SCAFFOLDING.md (336 lines) contains no mention of `useSignalframe`,
`createSignalframeUX`, `SignalframeProvider`, or the config provider at all. The document
covers component scaffolding patterns only.

**What must be added:** A new section documenting the `useSignalframe()` API contract.
Source of truth is `lib/signalframe-provider.tsx` (140 lines, fully inspected).

**Exact API surface to document:**

```
createSignalframeUX(config?: SignalframeUXConfig) → { SignalframeProvider, useSignalframe }

SignalframeUXConfig {
  defaultTheme?:      'light' | 'dark' | 'system'   // Default: 'system'
  motionPreference?:  'full' | 'reduced' | 'system'  // Default: 'system'
}

useSignalframe() → UseSignalframeReturn {
  theme:    'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  motion:   SignalframeMotionController
}

SignalframeMotionController {
  pause:          () => void         // gsap.globalTimeline.pause()
  resume:         () => void         // no-op if prefersReduced is true
  prefersReduced: boolean
}
```

**Standalone export:** `useSignalframe` is also exported as a standalone named export from
`lib/signalframe-provider.tsx`. Both the factory-returned hook and the standalone export
are valid usage patterns and must be documented.

**SSR constraint to document:** `createSignalframeUX()` must be called from a `'use client'`
wrapper file, not from Server Component module scope. The `SignalframeProvider` is a Client
Component; `{children}` remain Server Components (hole-in-the-donut pattern).

**Placement:** New section at end of SCAFFOLDING.md, after Section 7 (Barrel Export). Title:
`## 8. Config Provider API`.

---

### Sub-target 4: SFSection JSDoc `bgShift` Type

**Current state:** Already correct. `components/sf/sf-section.tsx` line 6 reads
`bgShift?: "white" | "black"` and JSDoc at line 19 reads
`@param bgShift - Background shift value for GSAP scroll targeting. "white" or "black".`

**Action required:** None for the source file. The SUMMARY for Phase 10-01 already records
this fix. DOC-01 sub-criterion is satisfied by the existing code state — the planner should
verify-only this item, not schedule an edit.

---

## Architecture Patterns

### Documentation-Only Phase Pattern

This is a pure documentation pass. No patterns from the component or animation systems apply.

**Editing rules:**
- Edit YAML frontmatter with surgical precision — only add/correct the `requirements_completed`
  field, do not reformat or reorder existing frontmatter keys
- Edit `- [ ]` → `- [x]` in REQUIREMENTS archive files — do not alter surrounding text, labels,
  or traceability tables except to update "Deferred/Pending" → "Complete" with phase attribution
- Add SCAFFOLDING.md section at end of file — do not renumber or restructure existing sections
- Verify SFSection JSDoc before writing the completion summary — it is already correct

### YAML Frontmatter Field Position

The `requirements_completed` field should be added as a top-level key (not nested under
`dependency_graph`). Based on the one existing near-equivalent (`requirements_closed` in
14-01-SUMMARY.md), place it near the end of the frontmatter block, after `metrics`.

Standard form:
```yaml
requirements_completed: [REQ-ID-A, REQ-ID-B]
```

For plans that completed no formally-numbered requirement:
```yaml
requirements_completed: []
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead |
|---------|-------------|-------------|
| Bulk YAML edits | A script or automation | Direct Read + Edit per file — 25 files, each a targeted 1-line addition |
| Requirement ID lookup | Manual cross-reference each time | Use the traceability tables in this RESEARCH.md (pre-resolved above) |

---

## Common Pitfalls

### Pitfall 1: Conflating the Three REQUIREMENTS.md Files
**What goes wrong:** Editing the wrong file. There are three: v1.0 archive, v1.1 archive,
and the current v1.2 file.
**How to avoid:** Current v1.2 file is `.planning/REQUIREMENTS.md`. Archives are in
`.planning/milestones/`. Only the archives need checkbox fixes. Only the current file
needs the DOC-01 checkbox checked off.

### Pitfall 2: Overwriting Existing SUMMARY.md Content
**What goes wrong:** Writing the entire file when only one field needs adding.
**How to avoid:** Use Edit tool for targeted insertions, not Write tool for full overwrites.
Read each file first and add only the `requirements_completed:` key.

### Pitfall 3: v1.1 Phase 8/9 Traceability Gaps
**What goes wrong:** The v1.1 REQUIREMENTS.md traceability table says "Pending" for
SCN-01 through INT-04 — their completing phase/plan numbers are in the phase SUMMARY files
(08-01, 08-02, 09-01, 09-02) not in the archive. Checking them off without updating the
traceability table leaves partial stale state.
**How to avoid:** Update both the checkbox and the traceability table row for each item.

### Pitfall 4: Assuming SFSection JSDoc Needs Editing
**What goes wrong:** Scheduling an edit to sf-section.tsx that is already correct.
**How to avoid:** Confirm via Read before any write — line 6 already reads
`bgShift?: "white" | "black"`, line 19 already documents "white" or "black". No edit needed.

### Pitfall 5: Skipping the v1.2 DOC-01 Checkbox
**What goes wrong:** Fixing all stale checkboxes in archives but forgetting to check
`DOC-01` in the current `.planning/REQUIREMENTS.md` as Phase 15 completes.
**How to avoid:** The final task of Phase 15 must be checking off DOC-01 in
`.planning/REQUIREMENTS.md` and updating the traceability table row from "Pending" to "Complete".

---

## Code Examples

### Correct `requirements_completed` Frontmatter
```yaml
---
phase: 12-signal-wiring
plan: "01"
# ... existing fields ...
metrics:
  duration: "~12 minutes"
  completed: "2026-04-06T11:41:01Z"
  tasks_completed: 2
  tasks_total: 2
  files_modified: 2
requirements_completed: [INT-04]
---
```

### Corrected v1.0 Archive Checkbox
```markdown
- [x] **SIG-06**: Audio feedback palette — Web Audio API synthesized tones (gesture-gated, monophonic), mapped to interaction types (click confirm, toggle, error) *(Completed in v1.1 Phase 7)*
```

### SCAFFOLDING.md New Section (Section 8)
```markdown
## 8. Config Provider API

The `createSignalframeUX` factory provides SSR-safe theme and GSAP motion control
at app root. Source: `lib/signalframe-provider.tsx`.

### createSignalframeUX(config?)

```ts
import { createSignalframeUX } from '@/lib/signalframe-provider';

// Must be called from a 'use client' wrapper (not Server Component module scope)
const { SignalframeProvider, useSignalframe } = createSignalframeUX({
  defaultTheme: 'dark',      // 'light' | 'dark' | 'system' — default: 'system'
  motionPreference: 'system' // 'full' | 'reduced' | 'system' — default: 'system'
});
```

Returns `{ SignalframeProvider, useSignalframe }`:
- `SignalframeProvider` — Client Component. Wrap your app root. `{children}` remain Server
  Components (hole-in-the-donut pattern).
- `useSignalframe` — hook scoped to the returned provider instance.

### useSignalframe()

Available as both a factory-returned hook and a standalone named export:

```ts
import { useSignalframe } from '@/lib/signalframe-provider';
```

Returns `UseSignalframeReturn`:

| Property | Type | Description |
|----------|------|-------------|
| `theme` | `'light' \| 'dark'` | Current resolved theme. Reads from `document.classList`, not localStorage. |
| `setTheme` | `(theme: 'light' \| 'dark') => void` | Hard-cut DU-style theme toggle. Wraps `lib/theme toggleTheme`. |
| `motion` | `SignalframeMotionController` | Global GSAP motion controller with reduced-motion guard. |

### SignalframeMotionController

| Property | Type | Description |
|----------|------|-------------|
| `pause` | `() => void` | Pauses all GSAP animations (`gsap.globalTimeline.pause()`). |
| `resume` | `() => void` | Resumes GSAP animations. No-op when `prefersReduced` is true. |
| `prefersReduced` | `boolean` | True when OS `prefers-reduced-motion` is active or `motionPreference: 'reduced'`. |

### SSR Constraint

`createSignalframeUX()` must be called at module scope inside a `'use client'` file —
not from a Server Component. Pattern mirrors `SignalCanvasLazy`/`GlobalEffectsLazy`.

```tsx
// components/layout/signalframe-config.tsx
'use client';
import { createSignalframeUX } from '@/lib/signalframe-provider';
export const { SignalframeProvider, useSignalframe } = createSignalframeUX({ defaultTheme: 'dark' });
```
```

---

## Validation Architecture

Nyquist validation is not explicitly disabled in `.planning/config.json` (key absent, treat
as enabled).

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected — no pytest.ini, jest.config.*, or vitest.config.* in project |
| Config file | None — documentation-only phase |
| Quick run command | `pnpm tsc --noEmit` (type-check only, catches JSDoc/interface regressions) |
| Full suite command | `pnpm build` (full compile validates all touched files) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DOC-01 | SFSection bgShift type correct | compile | `pnpm tsc --noEmit` | ✅ (sf-section.tsx exists) |
| DOC-01 | Frontmatter fields present | manual | `grep -rn "requirements_completed" .planning/phases/` | ✅ (grep command) |
| DOC-01 | Stale checkboxes corrected | manual | `grep "\- \[ \]" .planning/milestones/` | ✅ (grep command) |
| DOC-01 | SCAFFOLDING.md section added | manual | `grep "useSignalframe" docs/SCAFFOLDING.md` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm tsc --noEmit`
- **Per wave merge:** `pnpm build`
- **Phase gate:** All grep checks pass + `pnpm build` green before `/pde:verify-work`

### Wave 0 Gaps
- None for test infrastructure — no test files needed for documentation phase
- Verification commands are grep-based and work against the filesystem immediately

---

## Open Questions

1. **v1.0/v1.1 SUMMARY.md backfill depth**
   - What we know: Most v1.0/v1.1 SUMMARY files use descriptive strings in `provides:`, not
     formal IDs. Some (02-02) already use formal IDs.
   - What's unclear: Whether DOC-01 strictly requires backfilling all 25+ older SUMMARYs or
     only the v1.2 ones (10–14).
   - Recommendation: Backfill all files where a formal ID is traceable from the milestone
     REQUIREMENTS.md traceability tables. Use `requirements_completed: []` for plans that
     predated formal ID tracking (Phases 1, 3 non-ID items).

2. **v1.1 REQUIREMENTS archive — INT-01 overlap**
   - What we know: INT-01 appears in both v1.1 REQUIREMENTS (as `- [ ]`) and v1.2
     REQUIREMENTS (as `- [x]`). It was partially addressed in Phase 9 (v1.1) and completed in
     Phase 10-02 (v1.2).
   - Recommendation: Mark INT-01 as `[x]` in v1.1 archive with note "(completed in v1.2 Phase 10)".

---

## Sources

### Primary (HIGH confidence)
- Direct inspection of `.planning/phases/*/SUMMARY.md` files — all frontmatter patterns read
- Direct inspection of `.planning/milestones/v1.0-REQUIREMENTS.md` — all stale `[ ]` identified
- Direct inspection of `.planning/milestones/v1.1-REQUIREMENTS.md` — all stale `[ ]` identified
- Direct inspection of `.planning/REQUIREMENTS.md` — current v1.2 state confirmed accurate
- Direct inspection of `lib/signalframe-provider.tsx` — full API surface read and transcribed
- Direct inspection of `docs/SCAFFOLDING.md` — confirmed no existing useSignalframe section
- Direct inspection of `components/sf/sf-section.tsx` — JSDoc confirmed already correct

### Secondary (MEDIUM confidence)
- `.planning/STATE.md` traceability table — cross-referenced against phase SUMMARY files for
  requirement ID to plan mapping

---

## Metadata

**Confidence breakdown:**
- Stale checkbox identification: HIGH — files directly read, each stale entry verified
- SUMMARY.md frontmatter field: HIGH — canonical form derived from existing `requirements_closed` + CONTEXT.md spec
- SCAFFOLDING.md API section: HIGH — source file fully inspected, all types and parameters confirmed
- SFSection JSDoc state: HIGH — source file directly read, already correct

**Research date:** 2026-04-06
**Valid until:** Stable — pure documentation phase, no library dependencies
