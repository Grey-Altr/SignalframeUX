# Phase 28: Route Infrastructure - Context

**Gathered:** 2026-04-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Rename three routes (/components→/inventory, /tokens→/system, /start→/init), add 308 permanent redirects in next.config.ts, and update every internal reference across the codebase. No new UI, no new features — pure infrastructure.

</domain>

<decisions>
## Implementation Decisions

### Redirect Strategy
- 308 permanent redirects in `next.config.ts` `redirects()` async function
- All three renames handled in the same config block
- Wildcard redirect for `/components/:path*` → `/inventory/:path*` to catch any deep links

### Directory Rename Approach
- Create new `app/inventory/`, `app/system/`, `app/init/` directories
- Copy page content from old directories to new
- Verify new routes render correctly before deleting old directories
- Delete `app/components/`, `app/tokens/`, `app/start/` after verification

### Link Update Scope
- Grep all `.ts`, `.tsx` files for `/components`, `/tokens`, `/start` path references
- Known files requiring updates (from codebase scout):
  - `components/layout/nav.tsx` — nav links
  - `components/layout/footer.tsx` — footer links
  - `components/blocks/hero.tsx` — hero CTAs
  - `components/blocks/manifesto-band.tsx` — inline links
  - `components/layout/command-palette.tsx` — command palette routes
  - `lib/component-registry.ts` — registry path references
  - `app/sitemap.ts` — sitemap URLs
- After updates, `grep -r '"/components"' '"/tokens"' '"/start"'` must return zero results (excluding redirects config and test assertions about redirect behavior)

### Test Updates
- Update `tests/phase-25-detail-view.spec.ts` URLs from `/components` to `/inventory`
- Any other test files referencing old routes

### Claude's Discretion
- Exact ordering of file operations (create new → verify → delete old)
- Whether to batch all link updates in one commit or split by concern

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Route Configuration
- `next.config.ts` — Current config (bundle analyzer only, no existing redirects)
- `.planning/research/ARCHITECTURE.md` §Route Rename — Confirms `redirects()` pattern for Next.js 15.3

### Existing Route Files
- `app/components/page.tsx` — Current components page (rename to inventory)
- `app/tokens/page.tsx` — Current tokens page (rename to system)
- `app/start/page.tsx` — Current start page (rename to init)

### Internal Link Sources
- `components/layout/nav.tsx` — Primary navigation
- `components/layout/footer.tsx` — Footer links
- `components/layout/command-palette.tsx` — Command palette routes
- `app/sitemap.ts` — Sitemap generation

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `next.config.ts` already uses `withBundleAnalyzer` wrapper — redirects config integrates cleanly alongside it

### Established Patterns
- App Router file-based routing — rename = move directory
- All internal links use Next.js `<Link>` component with string hrefs

### Integration Points
- Nav component drives site-wide navigation — single source of truth for route links
- Sitemap.ts generates XML sitemap — must reflect new URLs
- Command palette likely has route-aware search/navigation
- Playwright tests hit routes directly — URLs must be updated

</code_context>

<specifics>
## Specific Ideas

No specific requirements — standard route rename with redirects. Research confirmed `next.config.ts` redirects (308 permanent) as the correct approach for Next.js 15.3.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 28-route-infrastructure*
*Context gathered: 2026-04-07*
