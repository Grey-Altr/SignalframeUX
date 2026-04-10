# Phase 35 — Open Items Requiring Grey's Decision

> Per the brief at `wiki/analyses/v1.5-phase35-brief.md` §Pre-Phase Checklist, two items are
> preserved as OPEN — the planner MUST NOT default-resolve these. They land in specific
> tasks (LR-01 credits = plan 35-04 Task X, LR-02 metadataBase = plan 35-03 Task X) that
> block on Grey's written decision before executing.

## OPEN-1: LR-01 Awwwards credits attribution

**Brief reference:** §LR-01 "Credits attribution — OPEN (Grey to decide)"

Choose ONE or BOTH:
- [ ] Culture Division (studio attribution only)
- [ ] Grey Altaer (personal attribution only)
- [ ] Both (Culture Division as studio, Grey Altaer as designer + developer)

**Brief default suggestion:** both. **Brief final word:** "this is a branding decision Grey owns outright."

**Blocks:** 35-04 Task "Author Awwwards description deck" — the credits line cannot be
written until Grey decides.

## OPEN-2: LR-02 metadataBase production URL — RESOLVED

**Brief reference:** §LR-02 "metadataBase is the single pre-ship lock that needs a real URL"

**RESOLVED 2026-04-10 — Grey's decision:** `https://signalframe.culturedivision.com` (subdomain under CD). SF//UX ships under the Culture Division domain.

Previous candidate `https://signalframeux.vercel.app` (from `app/sitemap.ts:3`) is superseded. `app/sitemap.ts` updated in the same commit as this resolution.

**Unblocks:** 35-03 Task 3 "Wire metadataBase in app/layout.tsx" — the literal URL string is now confirmed. 35-03 Task 4 (remaining metadata) also unblocked.
