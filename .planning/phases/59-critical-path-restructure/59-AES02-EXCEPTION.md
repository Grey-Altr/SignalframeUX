# AES-02 Exception Audit Log — Phase 59 Plan B

**Exception:** Anton `font-display: optional → swap` migration with measured
descriptor overrides (size-adjust 92.14%, ascent-override 127.66%,
descent-override 35.72%, line-gap-override 0%) against `Impact, Helvetica
Neue Condensed, Arial Black, sans-serif` fallback chain.

**Authority:** AESTHETIC-OF-RECORD.md §2 AES-02 — the SINGLE allowed
Chromatic re-baseline event for v1.8.

**Eligible cohort surfaces (Anton consumers only):**

The following surfaces are eligible for pixel-diff acceptance under the
AES-02 exception. All are rendered via `var(--font-anton)` / `sf-display` /
`font-display` class. Diffs on surfaces NOT listed here are out-of-scope for
the AES-02 exception and indicate a non-Anton regression requiring
investigation.

| Surface ID | Component Path | Example Text |
|------------|---------------|--------------|
| `thesis` | `lib/thesis-manifesto.ts` + `app/page.tsx` | S1-S6 manifesto ALL-CAPS |
| `hero-h1` | `components/blocks/entry-section.tsx:122-133` | SIGNALFRAME//UX> |
| `wordmark-inventory` | `app/inventory/page.tsx` | INVE/NTORY |
| `wordmark-system` | `app/system/page.tsx` | TOKEN/EXPLORER |
| `wordmark-init` | `app/init/page.tsx` | INITIA/LIZE |
| `wordmark-reference` | `app/reference/page.tsx` | REFERENCE |
| `ghost-label` | `components/animation/ghost-label.tsx` | THESIS, MOTION, etc. |
| `nav-glyphs` | `components/layout/nav.tsx` + `nav-overlay.tsx` | ENTRY/MOTION/PROOF/… |

**Forensic artifacts:**
- Pre-swap baselines: `.planning/visual-baselines/v1.8-pre-anton-swap/` (20 PNGs)
- Post-swap baselines: `.planning/visual-baselines/v1.8-start/` (20 PNGs, re-captured)
- Slow-3G screen recordings: `test-results/phase59-anton-swap/*.webm` (3 files)

---

## PENDING COHORT REVIEW

Status: **CLOSED — ACCEPTED 2026-04-26** (see section below)

The executor had:
1. Re-captured 20 v1.8-start baselines under post-Anton-swap state (pixel-diff
   20/20 GREEN against new baselines at AES-04 0.5% gate)
2. Confirmed slow-3G CLS=0 on all 3 test routes/viewports
3. Preserved forensic pre-swap originals at v1.8-pre-anton-swap/

---

## Cohort Acceptance — 2026-04-26

**Status:** ACCEPTED by user.

**Accepted surfaces (verbatim from user response):**

| Surface ID | Accepted |
|------------|---------|
| `thesis` | yes |
| `hero-h1` | yes |
| `ghost-label` | yes |
| `nav-glyphs` | yes |
| `wordmark-inventory` | yes |
| `wordmark-system` | yes |
| `wordmark-init` | yes |
| `wordmark-reference` | yes |

**Rejected surfaces:** none

**User response (verbatim):**
`cohort-accepted: [thesis, hero-h1, ghost-label, nav-glyphs, wordmark-inventory, wordmark-system, wordmark-init, wordmark-reference]; rejected: none`

All 8 accepted surfaces are confirmed Anton consumers. No non-Anton regressions
detected. AES-02 documented exception ratification is complete.
