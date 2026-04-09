---
phase: 34-visual-language-subpage-redesign
plan: 01
subsystem: visual-language
tags: [visual-language, instrument-hud, nav-reveal, ghost-label, magenta-audit, breadcrumb]
requires:
  - GhostLabel component (Phase 31)
  - PinnedSection primitive (Phase 29)
  - IntersectionObserver section-tracking logic (Phase 30 SectionIndicator)
provides:
  - components/layout/instrument-hud.tsx (InstrumentHUD)
  - hooks/use-nav-reveal.ts (useNavReveal)
  - components/layout/nav-reveal-mount.tsx (NavRevealMount)
  - data-ghost-label test selector on GhostLabel
  - data-nav-reveal-trigger subpage header contract
  - body[data-nav-visible] CSS-driven nav visibility
affects:
  - app/layout.tsx (mounts <InstrumentHUD /> site-wide)
  - app/page.tsx (drops SectionIndicator, adds GhostLabel + NavRevealMount)
  - app/system/page.tsx (h1 bump, GhostLabel, header trigger)
  - app/init/page.tsx (h1 bump, header trigger)
  - app/reference/page.tsx (NEW header + NavRevealMount wiring)
  - app/inventory/page.tsx (copy fix COMPONENTS -> INVENTORY, stat 340 -> 54)
  - components/layout/nav.tsx (removes inline ScrollTrigger)
  - components/layout/breadcrumb.tsx (monospaced coded register)
  - app/globals.css (body[data-nav-visible] CSS rule)
tech-stack:
  added: []
  patterns:
    - DOM refs + rAF direct writes for per-frame HUD fields (no setState in loop)
    - Body dataset attribute + CSS for nav visibility (decoupled from Nav component)
    - Per-page client island for nav-reveal trigger (NavRevealMount)
key-files:
  created:
    - components/layout/instrument-hud.tsx
    - hooks/use-nav-reveal.ts
    - components/layout/nav-reveal-mount.tsx
    - tests/phase-34-visual-language-subpage.spec.ts
  deleted:
    - components/layout/section-indicator.tsx
  modified:
    - app/layout.tsx
    - app/page.tsx
    - app/system/page.tsx
    - app/init/page.tsx
    - app/reference/page.tsx
    - app/inventory/page.tsx
    - app/globals.css
    - components/layout/nav.tsx
    - components/layout/breadcrumb.tsx
    - components/animation/ghost-label.tsx
    - components/blocks/token-tabs.tsx
    - components/blocks/api-explorer.tsx
    - components/blocks/code-section.tsx
    - components/blocks/components-explorer.tsx
decisions:
  - InstrumentHUD is a singleton mounted in app/layout.tsx (no props, hardcoded
    [data-section] selector) so every route renders it automatically without
    touching page files.
  - Per-frame fields use DOM refs + rAF direct writes; useState only for
    non-frame fields (sections, mobile, reduced motion, viewport, time).
  - Nav reveal was extracted out of nav.tsx entirely; Nav no longer calls the
    hook. Per-page NavRevealMount islands own the hook call so each route
    resolves its own trigger element.
  - GhostLabel deployment locked to brief pair (homepage THESIS + /system hero);
    five-location deployment from iteration 1 dropped as wallpaper.
  - Breadcrumb auto-prepends [SFUX] root so every consumer renders a consistent
    coded format [SFUX]//[TOKENS], [SFUX]//[INVENTORY], etc. without page edits.
metrics:
  duration: "14m"
  completed: 2026-04-09
  tasks_completed: 7
  tasks_total: 7
  commits: 7
  files_created: 4
  files_deleted: 1
  files_modified: 14
---

# Phase 34 Plan 01: Visual Language + Subpage Redesign Summary

Phase 34-01 retired the dot-rail SectionIndicator, shipped a Wipeout-cockpit
InstrumentHUD site-wide, extracted a shared useNavReveal hook driven by body
data attribute, deployed GhostLabel to the brief-locked pair, bumped subpage
h1s to 120px+, trimmed magenta across five heavy files, fixed /inventory copy
(COMPONENTS -> INVENTORY, 340 -> 54), and style-audited the Breadcrumb to the
HUD/ACQUISITION monospace register.

## Output

- **InstrumentHUD:** single-file, singleton-mounted instrument readout. Five
  fields desktop (section / scroll / sig / viewport / time), three on mobile.
  Non-interactive. No chrome. Fixed top-right with 24px padding. Per-frame
  fields driven by DOM refs + rAF, not React state.
- **useNavReveal hook + NavRevealMount island:** single-arg hook that flips
  `body.dataset.navVisible`. Nav.tsx no longer calls it; per-page islands do.
  globals.css has a new `body[data-nav-visible="true"] .sf-nav-hidden` rule.
- **GhostLabel deployment:** THESIS backdrop on homepage + SYSTEM ghost on
  /system hero (two instances total).
- **Display type:** `/system`, `/init`, `/reference`, `/inventory` h1s all use
  `clamp(80px, 12vw, 160px)`. `/reference` has a new header above APIExplorer.
- **Magenta audit:** five target files trimmed to <= 5 occurrences each.
- **Inventory copy fix:** metadata, breadcrumb, SFSection label, h1 spans, aria
  label, and stat callout all updated to INVENTORY / 54.
- **Breadcrumb restyle:** monospaced, bracketed coded format, auto-prepended
  SFUX root, no chevrons, no magenta, aria-current on last segment.

## Tasks Executed

| # | Task                                                                 | Commit   |
| - | -------------------------------------------------------------------- | -------- |
| 0 | Playwright spec tests/phase-34-visual-language-subpage.spec.ts (RED) | f3d66b1  |
| 1 | data-ghost-label attribute on GhostLabel                             | d68d7dd  |
| 2 | Retire SectionIndicator + ship InstrumentHUD + layout.tsx mount      | b756eda  |
| 3 | useNavReveal hook + NavRevealMount + globals.css rule + nav.tsx drop | 81dcf95  |
| 4 | GhostLabel deployment + h1 bumps + inventory copy + NavRevealMount   | 2778337  |
| 5 | Magenta trim (5 target files)                                        | f5cebfc  |
| 6 | checkpoint:human-verify                                              | auto-approved |
| 7 | Breadcrumb monospaced coded register                                 | d682cd3  |

## Sanctioned Magenta Moments (Task 5)

Per-file rule count is a tactical proxy. Canonical per-page visual moment audit
deferred to Phase 34 umbrella verification. Sanctioned (<= 5 each):

### components/blocks/token-tabs.tsx (3)
1. Line 248 — SHOW ALL toggle button accent (show-all expand affordance)
2. Line 359 — SHOW ALL SCALES tail button (same affordance, second tab)
3. Line 581 — `0px` spacing emphasis (the canonical zero-radius callout)

### components/blocks/api-explorer.tsx (5)
1. Line 167 — `import` keyword in DataDrivenDoc first code sample (syntax highlight)
2. Line 169 — `from` keyword in the same sample (syntax highlight)
3. Line 476 — REFERENCE hero h1 accent span
4. Line 530 — active sidebar nav item `text-primary` (core navigation affordance)
5. Line 557 — scroll progress bar `var(--color-primary)` style background

### components/blocks/code-section.tsx (3)
1. Line 28 — `ANNOTATION_ACCENT` const `"var(--color-primary)"` (3 annotation anchors reference it)
2. Line 26 — comment string mentioning `var(--color-primary)` (documentation, not a rendered style)
3. Line 84 — CodeTypewriter cursorColor `"var(--color-primary)"`

### components/blocks/components-explorer.tsx (2)
1. Line 441 — BADGE preview color data `"var(--color-primary)"` (one component preview)
2. Line 526 — FilterIndicator sliding `bg-primary` bar (active filter affordance)

### app/init/page.tsx (3)
1. Line 148 — `COLOR_MAP.kw: "text-primary"` (syntax highlight keyword, load-bearing)
2. Line 216 — hero "ESTIMATED TIME" tagline accent
3. Line 265 — step note `border-l-[3px] border-primary` (callout affordance)

## Collateral Aesthetic Changes (documented for Phase 34 umbrella audit)

- api-explorer preview theme `FRAME` background changed from `var(--color-primary)` to `var(--color-foreground)`.
- api-explorer right aside class `text-primary-foreground` → `text-background`.
- components-explorer variantStyles dropped all `hover:text-primary` / `hover:bg-primary` accents → `foreground` equivalents.
- init NEXT_CARDS decorative corner-border animation lines + arrow card color → foreground.
- init checklist done state `bg-primary border-primary text-primary-foreground` → `bg-foreground border-foreground text-background`.
- inventory stat callout `text-primary` → `text-foreground` (per plan Part E).
- init GET/STARTED second h1 span dropped `text-primary` accent (inline with h1 bump).

## GhostLabel Placement Manifest

| File                 | Location                 | Classname offset                                        |
| -------------------- | ------------------------ | ------------------------------------------------------- |
| app/page.tsx         | THESIS SFSection wrapper | `-left-[3vw] top-1/2 -translate-y-1/2 text-foreground/[0.04]` |
| app/system/page.tsx  | TOKENS hero wrapper      | `-left-[2vw] top-1/2 -translate-y-1/2 text-foreground/[0.04]` |

Both parents have `relative overflow-hidden` to satisfy Pitfall 3 (CLS guard on 375px viewport).

## NavRevealMount Wiring Manifest

| File                  | Target selector                 | Trigger element                |
| --------------------- | ------------------------------- | ------------------------------ |
| app/page.tsx          | `[data-entry-section]`          | EntrySection root              |
| app/reference/page.tsx| `[data-nav-reveal-trigger]`     | New page header                |
| app/system/page.tsx   | (wiring deferred to 34-02)      | header data-nav-reveal-trigger |
| app/init/page.tsx     | (wiring deferred to 34-03)      | header data-nav-reveal-trigger |
| app/inventory/page.tsx| (no mount required)             | header data-nav-reveal-trigger |

## Breadcrumb Restyle Verdict

**Chosen format direction:** `[SFUX]//[SEGMENT]//[SUBSEGMENT]` (bracketed HUD-adjacent, `//` separator matches `[NN//LABEL]` HUD format).

## Deviations from Plan

### Rule 3 — Blocking fix: init hero closing tag

- **Found during:** Task 4 (/init h1 bump)
- **Issue:** Promoting the hero wrapper div to `<header data-nav-reveal-trigger>` left a dangling `</div>` on the closing side.
- **Fix:** Changed the closing `</div>` at line 219 to `</header>` in the same task.
- **Files modified:** app/init/page.tsx
- **Commit:** 2778337

### Rule 3 — Blocking fix: api-explorer sf-code-keyword substitution

- **Found during:** Task 5 (magenta trim)
- **Issue:** Changing `<span className="text-primary">import</span>` to `text-[var(--sf-code-keyword)]` required verifying the token exists (it does — defined in globals.css).
- **Fix:** Switched duplicate import/from syntax highlights on second code sample + Button preview code preview to `text-[var(--sf-code-keyword)]`.
- **Commit:** f5cebfc

### Out-of-scope items logged (not fixed, per SCOPE BOUNDARY)

- `tests/phase-29-infra.spec.ts:117,147` — pre-existing implicit `any[]` TS7034/TS7005 warnings on `nonGsapRafComponents`. Unrelated to Phase 34-01 changes.

## Authentication Gates

None. Plan executed without any credential or human-action gates.

## Production Build

`npm run build` succeeds across all 9 routes. Shared JS bundle unchanged at
102 kB (well under the 150 kB gate). Route sizes:

| Route       | Page JS | First Load |
| ----------- | ------- | ---------- |
| /           | 6.26 kB | 327 kB     |
| /init       |  417  B | 293 kB     |
| /inventory  | 6.72 kB | 328 kB     |
| /reference  | 7.12 kB | 323 kB     |
| /system     | 7.28 kB | 300 kB     |

## Known Follow-ups for Downstream Plans

- **34-02 (Tokens subpage redesign):** consume the `<header data-nav-reveal-trigger>`
  on `/system` by mounting `<NavRevealMount targetSelector="[data-nav-reveal-trigger]" />`.
  TokenTabs magenta trim gate already met (3 <= 5).
- **34-03 (Init subpage redesign):** consume the `/init` header trigger the same way.
  init page magenta gate already met (3 <= 5). Hero copy still says GET/STARTED —
  34-03 reframes the text.
- **34-04 (API reference subpage redesign):** reference header already ships the
  trigger + NavRevealMount. APIExplorer magenta gate already met (5 <= 5).
- **VL-04 canonical per-page moment audit** deferred to Phase 34 umbrella verification.
- **VL-04 negative-space screenshot grid** deferred to Phase 34 umbrella verification.

## Self-Check: PASSED

- [x] tests/phase-34-visual-language-subpage.spec.ts exists (43 tests, RED → green path cleared)
- [x] components/layout/instrument-hud.tsx exists with 5 data-hud-field spans + rAF
- [x] components/layout/section-indicator.tsx DELETED
- [x] app/layout.tsx mounts `<InstrumentHUD />`
- [x] app/page.tsx no SectionIndicator reference + GhostLabel + NavRevealMount
- [x] hooks/use-nav-reveal.ts exports single-arg useNavReveal
- [x] components/layout/nav-reveal-mount.tsx exports NavRevealMount
- [x] components/layout/nav.tsx has no ScrollTrigger.create or useNavReveal call
- [x] app/globals.css has body[data-nav-visible="true"] .sf-nav-hidden rule
- [x] components/animation/ghost-label.tsx renders `data-ghost-label="true"`
- [x] 4 subpages have clamp(80px, 12vw, 160px) h1
- [x] /inventory copy: INVE/NTORY + 54 + text-foreground stat
- [x] 5 magenta target files all <= 5
- [x] components/layout/breadcrumb.tsx monospaced, bracketed, no chevrons, aria-current
- [x] npx tsc --noEmit clean (excluding pre-existing phase-29-infra warnings)
- [x] npm run build succeeds (9 routes, 102 kB shared bundle)
- [x] All 7 task commits exist in git log
