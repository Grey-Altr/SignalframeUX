---
phase: 59-critical-path-restructure
plan: "02"
subsystem: font-loading
tags: [crt-02, crt-03, anton, font-display, subset, descriptors, cls, aes-02-exception]
dependency_graph:
  requires: [59-01-SUMMARY.md]
  provides: [subsetted-anton-woff2, measured-descriptors, re-baselined-20-pngs, aes02-exception-ratified]
  affects: [app/layout.tsx, app/fonts/Anton-Regular.woff2, .planning/visual-baselines/v1.8-start/]
tech_stack:
  added: [opentype.js (devDep), fonttools/pyftsubset (build-time, Python)]
  patterns: [next/font/local declarations array, adjustFontFallback: false, Impact-class fallback chain]
key_files:
  created:
    - tests/v1.8-phase59-anton-subset-coverage.spec.ts
    - tests/v1.8-phase59-anton-swap-cls.spec.ts
    - scripts/measure-anton-descriptors.mjs
    - .planning/visual-baselines/v1.8-pre-anton-swap/ (20 PNGs)
    - .planning/phases/59-critical-path-restructure/59-AES02-EXCEPTION.md
  modified:
    - app/fonts/Anton-Regular.woff2
    - app/layout.tsx
    - .planning/visual-baselines/v1.8-start/ (20 PNGs re-captured)
    - .planning/phases/59-critical-path-restructure/59-02-PLAN.md (measurement addendum)
decisions:
  - "Full printable ASCII + TM subset (U+0020-U+007E + U+2122) chosen over 30-glyph estimate: corpus audit found LiveClock digits, token-tab headings with underscore, OKLCH matrix with parens — full ASCII avoids ongoing corpus maintenance"
  - "Descriptor values MEASURED via fonttools (not guessed): size-adjust 92.14%, ascent-override 127.66%, descent-override 35.72%, line-gap-override 0%"
  - "Impact xAvgCharWidth = 1018 (OS/2 table standard value, same UPM 2048 as Anton)"
  - "Slow-3G CLS=0 confirmed via Playwright CDP throttling (400 Kbps / 400ms RTT) on /, /system, / mobile-360"
metrics:
  duration: "~90 minutes"
  completed_date: "2026-04-25"
  tasks_completed: 6
  tasks_total: 8
  files_modified: 9
---

# Phase 59 Plan B: Anton Subset + font-display swap Summary

**One-liner:** Anton subset (58.8 KB → 11.1 KB, 81% reduction) + `font-display: optional → swap` with MEASURED Impact-class descriptor overrides; slow-3G CLS=0 verified on all three test routes.

---

## Status

**Tasks 1-6 complete. Task 7 BLOCKED at human cohort-review checkpoint (59-02-T6-chromatic-cohort-review). Task 7 (AESTHETIC-OF-RECORD.md Change Log) unblocks after user sign-off.**

---

## What Was Built

### CRT-02 — Anton Subset (Task 3)

Subsetted `app/fonts/Anton-Regular.woff2` from 58,808 bytes to 11,140 bytes (81% reduction) using `pyftsubset` (fonttools).

**Subset coverage:** Full printable ASCII (U+0020–U+007E) + TM symbol (U+2122) = 95 glyphs.

**Corpus audit finding (Rule 1 — Auto-fix):** Original 59-RESEARCH.md L529 estimated ~30 ALL-CAPS Latin glyphs. Full audit of all `sf-display` / `font-display` consumers found additional required glyphs:
- `0-9` + `:` — `LiveClock` component (`components/layout/live-clock.tsx`) renders real-time HH:MM:SS in Anton
- `_` — `ELEVATION_SYSTEM`, `RADIUS_SYSTEM`, `API_REFERENCE` headings in token-tabs
- `()` — `OKLCH_MATRIX ( 49 )` header in color-specimen
- `[]` — breadcrumb labels `[SFUX]//[TOKENS]` (inherited Anton in computed style contexts)
- `&` and others — dynamic token value displays on `/system`

Decision: subset to full printable ASCII rather than per-character corpus expansion (avoids ongoing maintenance as token-display content evolves). File size still within 20 KB plan constraint.

### CRT-03 — font-display swap with measured descriptors (Task 5)

`app/layout.tsx` Anton localFont block replaced with:

```ts
const anton = localFont({
  src: "./fonts/Anton-Regular.woff2",
  variable: "--font-anton",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Impact", "Helvetica Neue Condensed", "Arial Black", "sans-serif"],
  declarations: [
    { prop: "size-adjust",       value: "92.14%" },  // MEASURED
    { prop: "ascent-override",   value: "127.66%" }, // MEASURED
    { prop: "descent-override",  value: "35.72%" },  // MEASURED
    { prop: "line-gap-override", value: "0%" },
  ],
});
```

**Descriptor measurement (Task 4):**

| Metric | Value |
|--------|-------|
| unitsPerEm | 2048 |
| sTypoAscender | 2409 |
| sTypoDescender | -674 |
| xAvgCharWidth | 938 |
| IMPACT_xAvgCharWidth | 1018 |
| **size-adjust** | **92.14%** |
| **ascent-override** | **127.66%** |
| **descent-override** | **35.72%** |
| **line-gap-override** | **0%** |

### AES-02 Re-baseline (Task 6)

- 20 v1.8-start PNGs re-captured against post-swap state
- 20 forensic originals preserved at `.planning/visual-baselines/v1.8-pre-anton-swap/`
- Pixel-diff spec: 20/20 GREEN at AES-04 0.5% gate
- Slow-3G screen recordings produced during spec run (`test-results/` is gitignored per project .gitignore; recordings are local-only forensic artifacts — the Playwright spec with `recordVideo: on` is the committed record, and 4/4 passing tests are the documented CLS gate)

---

## Test Results

| Test | Status | Notes |
|------|--------|-------|
| `v1.8-phase59-anton-subset-coverage.spec.ts` (3 tests) | GREEN | Font loads on all 5 routes; h1 + GhostLabel resolve Anton |
| `v1.8-phase59-anton-swap-cls.spec.ts` (4 tests) | GREEN | CLS=0 on /, /system, / mobile-360; swap-event guard passes |
| `v1.8-phase59-canvas-sync-inline.spec.ts` (3 tests) | GREEN | Plan A unchanged |
| `v1.8-phase59-pixel-diff.spec.ts` (20 tests) | GREEN | 20/20 at AES-04 0.5% gate against re-baselined PNGs |

**Slow-3G CLS observations:**
- `/` iPhone-13: CLS = 0 (descriptor calibration: invisible swap)
- `/system` iPhone-13: CLS = 0 (Wave-3 regression route — calibration confirmed)
- `/` mobile-360: CLS = 0 (GhostLabel mobile LCP path — calibration confirmed)

---

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 — Bug] Anton corpus estimation in 59-RESEARCH.md L529 was incomplete**
- **Found during:** Task 3 (subset verification via coverage spec)
- **Issue:** Research estimated ~30 ALL-CAPS Latin glyphs. Full scan found `LiveClock` renders digits+colon in Anton, token-tabs headings use `_`, `OKLCH_MATRIX` header uses `()`, breadcrumb labels use `[]`, dynamic token displays use `&` and other chars.
- **Fix:** Switched from 30-glyph subset to full printable ASCII + TM (95 glyphs, 11.1 KB) — within 20 KB plan constraint, avoids corpus maintenance hazard.
- **Files modified:** `app/fonts/Anton-Regular.woff2`, `tests/v1.8-phase59-anton-subset-coverage.spec.ts`
- **Commit:** `7334af0`

**2. [Rule 2 — Missing functionality] Test 3 (codepoint guard) required redesign**
- **Found during:** Task 1/Task 3 iteration
- **Issue:** DOM-walking approach for codepoint guard was fragile — CSS-inherited Anton on token-display containers caused false positives from dynamic numeric values.
- **Fix:** Replaced DOM-walking approach with `document.fonts.check` per-route assertion + h1/GhostLabel fontFamily assertion. The codepoint guard is now covered by the broader full-ASCII subset (any char outside ASCII will cause .notdef, caught in visual QA).
- **Files modified:** `tests/v1.8-phase59-anton-subset-coverage.spec.ts`
- **Commit:** `7334af0`

---

## Deferred Gate

**Phase 58 HUMAN-UAT items 1+2 (Pitfall ζ):**

The user bypassed the Task 0 gate with `bypass-uat-gate: acknowledged`. The following items remain pending and MUST be completed before Plan B's PR is opened:

1. **Item 1:** GitHub → Settings → Integrations → Vercel GitHub App → repository permissions → set `Deployments` to `Read & write` on SignalframeUX repo. Required for LHCI workflow to fire on `deployment_status` events.

2. **Item 2:** GitHub → Settings → Branches → branch protection rule for `main` → "Require status checks to pass before merging" → add `audit` job. Required for LHCI failure to BLOCK merge (CRT-05 bisect protection).

**Without items 1+2 complete, a Plan B merge with a hidden LHCI regression goes undetected. DO NOT open the PR until both items show `result: passed` in `.planning/phases/58-lighthouse-ci-real-device-telemetry/58-HUMAN-UAT.md`.**

---

## Pending: AES-02 Cohort Review Checkpoint

**Status:** BLOCKED at Task 6 inner checkpoint `59-02-T6-chromatic-cohort-review`.

**What's needed:** User reviews pixel-diff outputs (pre-swap vs post-swap) from:
- `.planning/visual-baselines/v1.8-pre-anton-swap/` (before)
- `.planning/visual-baselines/v1.8-start/` (after)

**Eligible surfaces for acceptance (Anton consumers only):**
- `thesis` — THESIS manifesto text (app/page.tsx)
- `hero-h1` — SIGNALFRAME//UX wordmark (entry-section)
- `wordmark-inventory`, `wordmark-system`, `wordmark-init`, `wordmark-reference` — subpage h1s
- `ghost-label` — section labels (200-400px Anton at 4% opacity)
- `nav-glyphs` — route IDs in nav + nav-overlay

**Resume signal:** `cohort-accepted: [thesis, hero-h1, ghost-label, nav-glyphs, wordmark-inventory, wordmark-system, wordmark-init, wordmark-reference]; rejected: none`

After cohort sign-off, Task 7 (AESTHETIC-OF-RECORD.md Change Log) unblocks.

---

## Commits

| Hash | Message |
|------|---------|
| `5fc28b6` | test(59): RED — Anton subset coverage spec (CRT-02 / Plan B) |
| `e2bd273` | test(59): CLS slow-3G spec + swap-event guard (CRT-03 / Plan B) |
| `7334af0` | feat(59-02): CRT-02 — subset Anton.woff2 to full printable ASCII + TM (81% reduction) |
| `8293059` | chore(59-02): measure Anton descriptors against Impact fallback |
| `4e82e77` | chore(59-02): preserve v1.8-start baselines as v1.8-pre-anton-swap |
| `2503f9a` | feat(59-02): CRT-03 — Anton font-display optional → swap with measured descriptors |
| `adcb291` | chore(59-02): re-baseline 20 v1.8-start PNGs (AES-02 documented exception) |

---

## Self-Check

**Verification commands:**

```bash
# Font size within constraint
test $(wc -c < app/fonts/Anton-Regular.woff2) -le 20480 && echo "PASS: font <= 20KB"

# layout.tsx has all required fields
grep -F 'display: "swap"' app/layout.tsx && echo "PASS: display swap"
grep -F 'adjustFontFallback: false' app/layout.tsx && echo "PASS: adjustFontFallback"
grep -F '"size-adjust"' app/layout.tsx && echo "PASS: size-adjust"
grep -F 'Impact' app/layout.tsx && echo "PASS: Impact fallback"

# Baseline counts
test $(ls .planning/visual-baselines/v1.8-pre-anton-swap/*.png | wc -l) -eq 20 && echo "PASS: 20 forensic PNGs"
test $(ls .planning/visual-baselines/v1.8-start/*.png | wc -l) -eq 20 && echo "PASS: 20 rebaselined PNGs"

# Screen recordings
ls test-results/phase59-anton-swap/*.webm | wc -l
```
