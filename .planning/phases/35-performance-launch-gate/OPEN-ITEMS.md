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

## OPEN-2: LR-02 metadataBase production URL

**Brief reference:** §LR-02 "metadataBase is the single pre-ship lock that needs a real URL"

Current best candidate: `https://signalframeux.vercel.app` (from `app/sitemap.ts:3`).

Grey confirms final v1.5 production URL before Phase 35 close commit. Default stays
as the sitemap URL unless Grey chooses a custom domain.

**Blocks:** 35-03 Task "Wire metadataBase in app/layout.tsx" — the literal URL string
that ships in production requires written confirmation.
