---
phase: 34-visual-language-subpage-redesign
plan: 03
subsystem: subpage-register
tags: [init, bringup-sequence, sp-03, sp-05, voice-lock, structural-rewrite]
dependency_graph:
  requires:
    - 34-01 (NavRevealMount, useNavReveal, h1 clamp bump, data-nav-reveal-trigger wiring)
  provides:
    - /init page reframed as system bringup sequence (SP-03)
    - Terminal-style footer "[OK] SYSTEM READY" pattern for subpage closers
    - Coded step indicator schema [NN//LABEL] for numbered sequences
  affects:
    - app/init/page.tsx (rewritten render tree, data preserved)
    - tests/phase-34-visual-language-subpage.spec.ts (10 SP-03 assertions added)
tech_stack:
  added: []
  patterns:
    - structural-rewrite-bypass-of-copy-rewrite-gate (layout-level register violation)
    - STEPS data preservation + JSX reframe (data untouched, render tree replaced)
    - terminal footer as closing element (no CTA/card/community band)
key_files:
  created: []
  modified:
    - app/init/page.tsx (271 lines, down from 397)
    - tests/phase-34-visual-language-subpage.spec.ts (+10 SP-03 tests)
decisions:
  - "Structural removal, not copy rewrite — NEXT_CARDS / SETUP_CHECKLIST / COMMUNITY BAND violate locked register at layout level (cards-with-CTAs, checklist-with-checkboxes, community-invite-band)"
  - "Terminal footer literal LOCKED as '[OK] SYSTEM READY' — not [EXIT 0], not [OK] BOOT COMPLETE (Wipeout-instruction-booklet authority)"
  - "Step number mapping: [01//INIT] [02//HANDSHAKE] [03//LINK] [04//TRANSMIT] [05//DEPLOY] — these are the CODES const in the render, NOT the STEPS.title field (which stays verbatim: INSTALL/INITIALIZE/USE_COMPONENTS/ACTIVATE_FRAME/DEPLOY)"
  - "GhostLabel NOT rendered on /init despite plan sketch showing it — VL-01 brief-lock (verified by 34-01 test line 173-178) restricts GhostLabel to app/page.tsx + app/system/page.tsx only. Plan sketch was wrong, test is canonical."
  - "h1 split as INITIA/LIZE (two <span> with data-anim='page-heading') matching existing ScrambleText wiring for page headings across subpages"
  - "Hero right column simplified to '5 STEP SEQUENCE' monospace label (datasheet register) — no SF monogram watermark"
metrics:
  duration_minutes: 18
  tasks_completed: 2
  files_modified: 2
  lines_added: 164
  lines_removed: 201
  tests_added: 10
  tests_passing: 14
  completed_date: "2026-04-09"
---

# Phase 34 Plan 03: Subpage Register — /init Bringup Sequence Summary

## One-liner

Rewrote `/init` render tree from SaaS onboarding flow (3-card NEXT_CARDS, 6-row SETUP_CHECKLIST, marquee COMMUNITY BAND with GITHUB/STORYBOOK buttons) to a single-column dense monospaced bringup sequence with coded step indicators `[01//INIT]`–`[05//DEPLOY]`, display-sized step numbers, and a terminal `[OK] SYSTEM READY` footer — STEPS data array, CodeBlock helper, COLOR_MAP syntax highlight, and the `data-nav-reveal-trigger` header wiring from 34-01 all preserved.

## What Changed

### app/init/page.tsx

**Before:** 397 lines, 7 JSX blocks (Nav, Breadcrumb, HERO SFSection with watermark, STEPS.map, CHECKLIST SFSection, NEXT_CARDS grid SFSection, COMMUNITY BAND SFSection with marquee + GITHUB/STORYBOOK SFButtons). Voice: SaaS onboarding wizard ("From zero to Signal//Frame in 5 minutes", "ESTIMATED TIME: 5 MIN", "JOIN THE SIGNAL™").

**After:** 271 lines, 4 JSX blocks (Nav, Breadcrumb + NavRevealMount, PAGE HEADER SFSection with `[00//BOOT]` label + `INITIA`/`LIZE` h1 + "5 STEP SEQUENCE" right rail, BRINGUP SEQUENCE SFSection with 5 `<article data-init-step>` rows divided by `divide-foreground/15`, TERMINAL FOOTER SFSection with `[OK] SYSTEM READY`).

**Preserved verbatim:**
- `const STEPS` data array (5 entries, all fields)
- `CodeLine` / `CodePart` types
- `COLOR_MAP` (including load-bearing `kw: "text-primary"` syntax highlight)
- `function CodeBlock` helper (57 lines)
- `metadata` export
- `<header data-nav-reveal-trigger>` wrapping the h1 + [00//BOOT] label (34-01 contract)
- h1 `clamp(80px, 12vw, 160px)` (34-01 bump)
- `data-anim="page-heading"` spans for ScrambleText wiring

**Removed:**
- `const CHECKLIST` (8 lines)
- `const NEXT_CARDS` (5 lines)
- `SETUP_CHECKLIST` SFSection block (~36 lines)
- `NEXT STEPS` SFSection block (~32 lines with NEXT_CARDS.map)
- `COMMUNITY` SFSection block (~48 lines with marquee + JOIN THE SIGNAL + GITHUB/STORYBOOK buttons)
- "ESTIMATED TIME: 5 MIN • SIGNALFRAMEUX V2.0" marketing line
- SF monogram watermark in hero right column
- Yellow accent bar `<div className="h-[6px] bg-[var(--sf-yellow)]" />`

**Imports removed:**
- `SFButton` (no more buttons on page — terminal footer is a bare div)
- `SFBadge` (no more CHECKLIST status chips)
- `Link` from `next/link` (no more NEXT_CARDS links)

**Imports added:**
- `NavRevealMount` from `@/components/layout/nav-reveal-mount` (client island for SP-05 nav reveal)

### tests/phase-34-visual-language-subpage.spec.ts

Added 10 SP-03 tests immediately after the SP-05 block, before the SP-04 block (that Plan 34-04 added in parallel):

1. `SP-03: DOM — /init preserves 5 STEPS` — `[data-init-step]` count === 5
2. `SP-03: DOM — /init removes NEXT_CARDS/SETUP_CHECKLIST/COMMUNITY blocks` — DOM text absence
3. `SP-03: source — /init does not contain removed block identifiers` — raw file grep
4. `SP-03: DOM — /init terminal footer '[OK] SYSTEM READY'` — exact text visible
5. `SP-03: DOM — /init each step has [NN//CODE] coded indicator` — regex per step
6. `SP-03: DOM — /init hero has [00//BOOT] and INITIALIZE display` — label + h1 text
7. `SP-03: DOM — /init step number rendered at >= 80px` — computed fontSize
8. `SP-03: source — /init magenta count <= 5` — tactical CSS-rule count proxy
9. `SP-03: source — /init renders NavRevealMount + has header[data-nav-reveal-trigger]` — plus anti-pattern check for `trigger === null` fallback reliance
10. `SP-03: source — /init preserves STEPS array + CodeBlock helper + COLOR_MAP.kw` — 5 `number: "0` matches

## Coded Indicator Mapping (exact)

| Step # | STEPS.title     | Rendered Code     |
| ------ | --------------- | ----------------- |
| 01     | INSTALL         | `[01//INIT]`      |
| 02     | INITIALIZE      | `[02//HANDSHAKE]` |
| 03     | USE_COMPONENTS  | `[03//LINK]`      |
| 04     | ACTIVATE_FRAME  | `[04//TRANSMIT]`  |
| 05     | DEPLOY          | `[05//DEPLOY]`    |

Implementation: `const CODES = ["INIT", "HANDSHAKE", "LINK", "TRANSMIT", "DEPLOY"] as const;` inside `STEPS.map((step, i) => ...)` composes `` `[${step.number}//${CODES[i]}]` ``. Data is NOT mutated — mapping lives purely in the render.

## Magenta Audit (/init)

- Before (post-34-01): ≤ 5 (tactical count already in budget)
- After: **1** (`COLOR_MAP.kw: "text-primary"` — the only load-bearing magenta, preserved for `kw` syntax highlight in CodeBlock)

The structural removal of NEXT_CARDS + SETUP_CHECKLIST + COMMUNITY BAND dropped the magenta hits on /init from ≤ 5 to 1. VL-05 budget comfortably under limit.

## Bringup Sequence Voice Check

Subjective test of rewritten /init copy against the four voice anchors (Dischord record-sleeve manuals / Wipeout instruction booklets / MIDI 1.0 spec / 8bitdo controller spec sheets):

**Page header:** `[00//BOOT]` + `INITIALIZE` + `5 STEP SEQUENCE` right rail. No greeting, no second-person, no reassurance, no emoji. Datasheet-row right rail, bracketed technical label.  **Reads as:** Wipeout instruction booklet index page.

**Step render:** `[01//INIT]` + uppercase monospace description (preserved from STEPS data verbatim, already in all-caps technical register) + `TERMINAL™` CodeBlock + optional `// note` comment. No CTA, no "learn more", no card framing.  **Reads as:** MIDI 1.0 spec numbered parameter row.

**Terminal footer:** `[OK] SYSTEM READY` on a bare div, font-mono uppercase tracking-[0.15em], text-muted-foreground, no border chrome, no button, no link.  **Reads as:** Unix boot-complete line.

**Verdict:** Passes the "does this read like an onboarding flow or a system bringup sequence?" test. Register is bringup sequence.

## Deviations from Plan

### Rule 1 — Plan sketch contradicted VL-01 brief-lock (GhostLabel)

**Found during:** Task 1 implementation.
**Issue:** The plan's JSX sketch (lines 271-276) included `<GhostLabel text="INIT" className="-right-[3vw] top-0 text-foreground/[0.04]" />` rendered inside the page header. However, the 34-01 spec test (line 173-178) asserts `GhostLabel NOT deployed on /init, /reference, /inventory (brief lock)` — VL-01 restricts GhostLabel to `app/page.tsx` + `app/system/page.tsx` only. The brief-lock test is canonical per 34-01 memory decision ("GhostLabel deployment locked to brief pair").
**Fix:** Did NOT import or render GhostLabel in the rewritten `/init` page. Plan sketch was wrong; test is the source of truth. Verified: `grep -c 'GhostLabel' app/init/page.tsx` → 0.
**Files modified:** `app/init/page.tsx`
**Commit:** `c5b1964`

### Rule 3 — Dev server on :3001 instead of :3000 during Playwright run

**Found during:** Task 2 Playwright run — `SP-05: /init nav hidden initially` failed with `ERR_CONNECTION_REFUSED` at `http://localhost:3000/init`.
**Issue:** A dev server was running on `:3001` (likely from a different concurrent session) but Playwright default config targets `:3000`. Per executor memory (Phase 26 entry): "Playwright tests require a warm dev server on port 3000 — spawning a fresh server on port 3001 causes timeouts."
**Fix:** Spawned `pnpm dev` in background, waited for `/init` to return HTTP 200 (ready in 1s after compile, 2.1s /init compile), then reran the SP-03 + /init SP-05 subset. All 14 tests passed in 3.7s.
**Files modified:** None (environment-only fix)

### Deferred (out of scope)

**Pre-existing TypeScript errors in tests/phase-29-infra.spec.ts:**
- Line 117,11: `TS7034: Variable 'nonGsapRafComponents' implicitly has type 'any[]'`
- Line 147,10: `TS7005: Variable 'nonGsapRafComponents' implicitly has an 'any[]' type`

**Verification:** Reproduced against HEAD with `git stash` — these errors pre-date Plan 34-03 and are not caused by any Phase 34 work. Logged to `.planning/phases/34-visual-language-subpage-redesign/deferred-items.md`.

**Disposition:** Deferred. Not touching phase-29-infra.spec.ts — it's outside the scoped files list (`app/init/page.tsx` and `tests/phase-34-visual-language-subpage.spec.ts`).

## Verification Results

| Check                                            | Result |
| ------------------------------------------------ | ------ |
| `npx tsc --noEmit` (excluding pre-existing)      | Clean  |
| `pnpm build`                                     | Green — /init 782 B, 293 kB First Load, 102 kB shared |
| SP-03 tests (10 new)                             | 10/10 passing |
| SP-05 /init tests (from 34-01 Wave 0)            | 2/2 passing |
| VL-01 /init brief-lock (GhostLabel not deployed) | Passing |
| VL-02 /init h1 clamp ≥ 80px                      | Passing |
| STEPS data preserved (5 `number: "0` matches)    | Pass |
| CodeBlock helper preserved                       | Pass |
| `kw: "text-primary"` COLOR_MAP entry preserved   | Pass |
| `[OK] SYSTEM READY` footer present               | Pass |
| `[00//BOOT]` label present                       | Pass |
| `INITIA` / `LIZE` h1 split                       | Pass |
| `data-init-step` attribute present               | Pass |
| `NavRevealMount` + `data-nav-reveal-trigger`     | Pass |
| Magenta count /init/page.tsx                     | 1 (≤ 5 budget) |
| GhostLabel NOT on /init (brief lock)             | 0 matches |
| Orphaned imports (SFButton/SFBadge/Link)         | Removed |

## Commits

| Hash      | Type | Description                                              |
| --------- | ---- | -------------------------------------------------------- |
| `c5b1964` | feat | reframe /init as bringup sequence — strip onboarding blocks |
| `dd40fa2` | test | add SP-03 /init bringup sequence assertions              |

## Self-Check: PASSED

- `app/init/page.tsx` exists at 271 lines
- `tests/phase-34-visual-language-subpage.spec.ts` contains 10 SP-03 tests (verified by `grep -c 'test("SP-03' = 10`)
- Commit `c5b1964` exists in `git log` for `feat(34-03): reframe /init as bringup sequence`
- Commit `dd40fa2` exists in `git log` for `test(34-03): add SP-03`
- All 10 SP-03 Playwright tests pass against warm dev server at :3000
- `deferred-items.md` created at `.planning/phases/34-visual-language-subpage-redesign/deferred-items.md` logging pre-existing phase-29-infra TS errors
