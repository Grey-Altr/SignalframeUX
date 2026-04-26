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

Status: **AWAITING USER SIGN-OFF**

The executor has:
1. Re-captured 20 v1.8-start baselines under post-Anton-swap state (pixel-diff
   20/20 GREEN against new baselines at AES-04 0.5% gate)
2. Confirmed slow-3G CLS=0 on all 3 test routes/viewports
3. Preserved forensic pre-swap originals at v1.8-pre-anton-swap/

**Next:** User reviews the pixel-diff outputs and confirms all diffs are
Anton-attributable. Resume signal: `cohort-accepted: [surface-id-1, ...]`

---

<!-- COHORT ACCEPTANCE TABLE APPENDED BELOW AFTER USER SIGN-OFF -->
