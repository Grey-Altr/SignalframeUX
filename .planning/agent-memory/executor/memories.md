# executor Agent Memory

> Loaded at agent spawn. Append-only. Max 50 entries.
> Oldest entries archived automatically.

### 2026-04-06T02:14:00Z | Phase 01 | tags: globals.css, token-placement, tailwind-v4, spacing

In SignalframeUX, spacing and layout tokens go in `:root` (NOT `@theme`) to avoid Tailwind v4 generating unwanted utility classes from custom properties — this is critical since Tailwind v4 auto-generates utilities from `@theme` values. Only put tokens in `@theme` if you explicitly want Tailwind utility generation.

### 2026-04-06T02:14:00Z | Phase 01 | tags: globals.css, vhs-tokens, namespace, pre-existing-error

The `--vhs-crt-opacity` and `--vhs-noise-opacity` tokens only appear in `app/globals.css` (zero component references) — VHS class names like `.vhs-overlay`, `.vhs-crt`, `.vhs-noise` are safe to leave as-is when renaming custom properties. Also found a pre-existing TypeScript error in `components/animation/color-cycle-frame.tsx:79` (`useRef` missing argument) that blocks `npx next build` type check but not CSS compilation — this predates Plan 01-01.

### 2026-04-06T02:14:00Z | Phase 01 | tags: next-build, typescript, pre-existing-check

When the plan's done criteria includes `npx next build`, always verify the error is NOT pre-existing by running build against the original branch first (via `git stash`). The globals.css file is 1100+ lines; read it in 200-line chunks rather than all at once (10K token limit). The `@layer utilities` block runs from line 425 to 780, and `.sf-display` ends around line 460.

### 2026-04-05T00:00:00Z | Phase 01 | tags: spacing, grep-pattern, token-enforcement

The grep pattern `" (p|px|py|...)-(5|7|10)[^0-9]"` (with leading space) misses classes where the spacing utility appears at the start of a className string right after `"` — no leading space. Always follow up with a direct `grep -n "p-5"` search. In this project, token-tabs.tsx had 9 such instances missed by the pattern but caught by the direct search.

### 2026-04-05T00:00:00Z | Phase 01 | tags: linter, file-modification, edit-workflow

The project's formatter modifies files on save and causes "File has been modified since read" errors when edits are applied after a sequence of reads. Safe pattern: re-read the file immediately before each Edit call. The error is recoverable — re-read and re-apply the edit.

### 2026-04-05T00:00:00Z | Phase 01 | tags: gsd-tools, state-management, manual-update

The gsd-tools.cjs binary is not installed in this environment. STATE.md and ROADMAP.md must be updated manually. Key fields: Current Position Plan/Status/Last activity, Progress bar percentages, Decisions section, Session Continuity, Roadmap table status column and checkbox list.
