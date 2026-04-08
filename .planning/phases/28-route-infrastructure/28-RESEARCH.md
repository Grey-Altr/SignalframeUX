# Phase 28: Route Infrastructure - Research

**Researched:** 2026-04-07
**Domain:** Next.js App Router route renaming, 308 redirects, internal link audit
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- 308 permanent redirects in `next.config.ts` `redirects()` async function
- All three renames handled in the same config block
- Wildcard redirect for `/components/:path*` → `/inventory/:path*` to catch deep links
- Create new directories → copy content → verify → delete old directories
- Grep all `.ts`, `.tsx` files for `/components`, `/tokens`, `/start` path references
- After updates, grep must return zero results (excluding redirects config and redirect-behavior test assertions)
- Update `tests/phase-25-detail-view.spec.ts` URLs from `/components` to `/inventory`

### Claude's Discretion
- Exact ordering of file operations (create new → verify → delete old)
- Whether to batch all link updates in one commit or split by concern

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| RA-01 | `/components` route renamed to `/inventory` with redirect from old path | 308 redirect in `redirects()` + wildcard; directory move pattern confirmed |
| RA-02 | `/tokens` route renamed to `/system` with redirect from old path | Same pattern as RA-01 |
| RA-03 | `/start` route renamed to `/init` with redirect from old path | Same pattern as RA-01 |
| RA-04 | All internal links, nav items, and footer links updated to new route names | Full file inventory below; 9 files confirmed requiring edits |
</phase_requirements>

---

## Summary

Phase 28 is a pure infrastructure rename with no UI changes. Three App Router routes get new names (`/inventory`, `/system`, `/init`), 308 permanent redirects preserve old URLs indefinitely, and every internal string reference pointing to the old paths gets updated.

The work splits cleanly into three concerns: (1) next.config.ts redirect block, (2) filesystem directory operations (create new → verify → delete old), and (3) internal link surgery across 9 confirmed files. The registry's `@/components/sf` references are a false positive — those point to the source component directory, not the route, and must not be changed. One exception: `lib/component-registry.ts` line 396 contains a hardcoded `/components` href inside a JSX code sample string — this is a user-visible example and should be updated to `/inventory`.

The phase has zero external dependencies, zero new packages, and no risk to Lighthouse scores. Verification is a grep-to-zero assertion plus a smoke test of all three new routes and all three redirect chains.

**Primary recommendation:** Write the `redirects()` block first, commit, then do all link surgery in a single subsequent commit — keeps the redirect infrastructure provably independent.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js App Router | 15.3 | File-based routing — rename = move directory | Project stack |
| next.config.ts `redirects()` | 15.3 | Server-side 308 permanent redirects | Official Next.js redirect mechanism |

### No New Packages
Zero new npm dependencies. This phase is config + filesystem + string replacement only.

---

## Architecture Patterns

### Next.js 308 Permanent Redirect Config

The `redirects()` async function in `next.config.ts` is the correct mechanism. 308 (not 301) preserves the HTTP method — correct for REST semantics and required by CONTEXT.md decision.

```typescript
// Source: Next.js 15.3 official docs — next.config.ts redirects()
const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/components",
        destination: "/inventory",
        permanent: true, // emits 308
      },
      {
        source: "/components/:path*",
        destination: "/inventory/:path*",
        permanent: true,
      },
      {
        source: "/tokens",
        destination: "/system",
        permanent: true,
      },
      {
        source: "/tokens/:path*",
        destination: "/system/:path*",
        permanent: true,
      },
      {
        source: "/start",
        destination: "/init",
        permanent: true,
      },
      {
        source: "/start/:path*",
        destination: "/init/:path*",
        permanent: true,
      },
    ];
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};
```

The existing `withBundleAnalyzer` wrapper integrates without change — `redirects()` is a property of the inner `nextConfig` object, not the wrapper.

### App Router Directory Rename Pattern

App Router routing is purely file-system driven. Rename = create new directory with the same `page.tsx` content, verify, delete old.

```
app/
├── components/page.tsx  →  app/inventory/page.tsx  (then delete components/)
├── tokens/page.tsx      →  app/system/page.tsx     (then delete tokens/)
└── start/page.tsx       →  app/init/page.tsx       (then delete start/)
```

**No layout.tsx files exist** in any of the three route directories — confirmed by `ls app/`. Only `page.tsx` needs to move in each case.

### Recommended Operation Order

1. Write `redirects()` block in `next.config.ts` — commit
2. Create `app/inventory/`, `app/system/`, `app/init/` with copied page content
3. Verify new routes render at dev server
4. Delete `app/components/`, `app/tokens/`, `app/start/`
5. Update all internal links in one pass — commit
6. Run grep-to-zero verification
7. Update test files — commit

---

## Complete File Inventory (RA-04)

All files confirmed to contain route string references that MUST be updated:

### Navigation / Layout (4 files)

| File | Old References | New References |
|------|---------------|----------------|
| `components/layout/nav.tsx` | `NAV_LINKS` array: `/components`, `/tokens`, `/start` | `/inventory`, `/system`, `/init` |
| `components/layout/footer.tsx` | Link hrefs: `/start`, `/components` (×2), `/tokens` | `/init`, `/inventory` (×2), `/system` |
| `components/layout/command-palette.tsx` | `NAV_ITEMS` array: `/components`, `/tokens`, `/start` | `/inventory`, `/system`, `/init` |
| `app/sitemap.ts` | URL strings: `/components`, `/tokens`, `/start` | `/inventory`, `/system`, `/init` |

Note: `components/layout/nav-overlay.tsx` receives `NAV_LINKS` as a prop from `nav.tsx` — no hardcoded routes, no changes needed there.

### Blocks (2 files)

| File | Old References | New References |
|------|---------------|----------------|
| `components/blocks/hero.tsx` | `href="/start"` (line 99) | `href="/init"` |
| `components/blocks/manifesto-band.tsx` | `href: "/start"` (×2), `href: "/components"`, `href: "/tokens"` | `/init` (×2), `/inventory`, `/system` |

### App Pages (1 file)

| File | Old References | New References |
|------|---------------|----------------|
| `app/start/page.tsx` | `href: "/components"`, `href: "/tokens"` in cards array + `href="/components"` inline Link (lines 136, 138, 366) | `/inventory`, `/system`, `/inventory` |

Note: This file will be deleted when the directory moves, but the content must be correct in the new `app/init/page.tsx`.

### Registry Code Sample (1 file — edge case)

| File | Old Reference | New Reference |
|------|--------------|----------------|
| `lib/component-registry.ts` | Line 396: `href="/components"` inside SFNavigationMenu JSX code sample string | `href="/inventory"` |

This is user-visible example code shown in the component detail panel. It should reflect the live route.

### Tests (1 file)

| File | Old References | New References |
|------|---------------|----------------|
| `tests/phase-25-detail-view.spec.ts` | `page.goto("/components")` (×4), comment text `/components` (×1) | `page.goto("/inventory")` (×4), comment text `/inventory` |

`tests/phase-27-integration-bugs.spec.ts` contains one reference (`@/components/animation/waveform`) — this is a component import path, not a route, and must NOT be changed.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Redirect logic | Middleware redirect handler | `next.config.ts` `redirects()` | Built-in, server-level, no runtime cost |
| Route existence check | Custom verification script | `curl` or browser + grep-to-zero | Simple, reliable, no tooling debt |

---

## Common Pitfalls

### Pitfall 1: Conflating `@/components/` with the `/components` route

**What goes wrong:** `lib/component-registry.ts` contains hundreds of `@/components/sf`, `@/components/animation` etc. strings. A naive find-replace on `/components` will corrupt all of them.

**Why it happens:** The source directory and the route share the same name.

**How to avoid:** Grep for the quoted route strings specifically: `"/components"`, `href="/components"`, `href: "/components"`. Never run a global replace on the bare string `/components`.

**Warning signs:** TypeScript errors after replace — `Cannot find module '@/inventory/sf'`.

### Pitfall 2: Forgetting the wildcard redirect

**What goes wrong:** `/components` redirects correctly but any bookmarked deep link like `/components/sf-button` returns 404.

**Why it happens:** A redirect without `:path*` only matches the exact path.

**How to avoid:** Always pair exact + wildcard redirects. Both are included in the config example above.

### Pitfall 3: Changing test import paths instead of route hrefs

**What goes wrong:** `phase-27-integration-bugs.spec.ts` line 78 contains `"@/components/animation/waveform"` — this is a component source path inside an assertion about what the detail panel displays. Changing it to `@/inventory/...` breaks the test.

**Why it happens:** The word "components" appears in both route and source contexts in test files.

**How to avoid:** Only change `page.goto()` URL arguments and route-shaped strings. Preserve import paths and source directory references verbatim.

### Pitfall 4: `app/start/page.tsx` has self-referential links

**What goes wrong:** `app/start/page.tsx` contains links to `/components` and `/tokens`. If the page content is copied to `app/init/page.tsx` before updating these hrefs, the new page ships with broken internal links.

**How to avoid:** Update the file content before or immediately after the directory move (before the old directory is deleted). Never copy stale content.

### Pitfall 5: Browser/CDN redirect cache for 308

**What goes wrong:** After testing locally, the dev browser caches the 308 and subsequent tests appear to work even if the redirect is later misconfigured.

**How to avoid:** Test redirect chains in a private/incognito window or with `curl -I` to inspect raw HTTP responses.

---

## Code Examples

### Verified: `next.config.ts` with redirects + bundle analyzer

```typescript
// next.config.ts — complete file after Phase 28
import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/components",       destination: "/inventory", permanent: true },
      { source: "/components/:path*", destination: "/inventory/:path*", permanent: true },
      { source: "/tokens",           destination: "/system",   permanent: true },
      { source: "/tokens/:path*",     destination: "/system/:path*",   permanent: true },
      { source: "/start",            destination: "/init",     permanent: true },
      { source: "/start/:path*",      destination: "/init/:path*",     permanent: true },
    ];
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default analyzer(nextConfig);
```

### Verified: Grep command for zero-result confirmation

```bash
# Must return zero results after all link updates
# Excludes redirects config itself and redirect-behavior assertions
grep -rn '"/components"\|"/tokens"\|"/start"' \
  --include="*.ts" --include="*.tsx" \
  . \
  | grep -v "next.config.ts" \
  | grep -v "redirects"
```

### Verified: `app/sitemap.ts` after rename

```typescript
import type { MetadataRoute } from "next";

const BASE = "https://signalframeux.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,                    lastModified: new Date(), priority: 1   },
    { url: `${BASE}/inventory`,     lastModified: new Date(), priority: 0.9 },
    { url: `${BASE}/reference`,     lastModified: new Date(), priority: 0.8 },
    { url: `${BASE}/system`,        lastModified: new Date(), priority: 0.8 },
    { url: `${BASE}/init`,          lastModified: new Date(), priority: 0.7 },
  ];
}
```

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright (detected: `tests/*.spec.ts`) |
| Config file | `playwright.config.ts` (project root) |
| Quick run command | `pnpm exec playwright test tests/phase-25-detail-view.spec.ts` |
| Full suite command | `pnpm exec playwright test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| RA-01 | `/components` redirects to `/inventory` with 308 | smoke | `curl -I http://localhost:3000/components` | ✅ manual curl |
| RA-01 | `/inventory` route renders correctly | smoke | `pnpm exec playwright test tests/phase-28-route-infra.spec.ts` | ❌ Wave 0 |
| RA-02 | `/tokens` redirects to `/system` with 308 | smoke | `curl -I http://localhost:3000/tokens` | ✅ manual curl |
| RA-02 | `/system` route renders correctly | smoke | `pnpm exec playwright test tests/phase-28-route-infra.spec.ts` | ❌ Wave 0 |
| RA-03 | `/start` redirects to `/init` with 308 | smoke | `curl -I http://localhost:3000/start` | ✅ manual curl |
| RA-03 | `/init` route renders correctly | smoke | `pnpm exec playwright test tests/phase-28-route-infra.spec.ts` | ❌ Wave 0 |
| RA-04 | Zero grep hits for old route strings | lint | `grep -rn '"/components"' '"/tokens"' '"/start"' --include="*.ts" --include="*.tsx" .` | ✅ inline |
| RA-04 | Phase 25 tests pass against `/inventory` | regression | `pnpm exec playwright test tests/phase-25-detail-view.spec.ts` | ✅ (needs URL update) |

### Sampling Rate
- **Per task commit:** Grep-to-zero check
- **Per wave merge:** `pnpm exec playwright test tests/phase-25-detail-view.spec.ts tests/phase-27-integration-bugs.spec.ts tests/phase-28-route-infra.spec.ts`
- **Phase gate:** All tests green + curl confirms 308 on all three old routes

### Wave 0 Gaps
- [ ] `tests/phase-28-route-infra.spec.ts` — covers RA-01, RA-02, RA-03 (new route renders + redirect smoke)

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `next.config.js` redirects array | `next.config.ts` typed `redirects()` async function | Next.js 9.5+ | Type safety, async support |
| 301 redirects (method-changing) | 308 permanent redirects (method-preserving) | Project decision | Correct REST semantics |

---

## Open Questions

None. The scope is fully defined, all affected files are confirmed, and the implementation pattern is verified against the existing `next.config.ts` structure.

---

## Sources

### Primary (HIGH confidence)
- Codebase inspection (direct file reads) — `next.config.ts`, `nav.tsx`, `footer.tsx`, `command-palette.tsx`, `sitemap.ts`, `hero.tsx`, `manifesto-band.tsx`, `app/start/page.tsx`, `lib/component-registry.ts`, `tests/phase-25-detail-view.spec.ts`, `tests/phase-27-integration-bugs.spec.ts`
- `28-CONTEXT.md` — locked decisions on redirect strategy and directory rename approach
- `REQUIREMENTS.md` — RA-01 through RA-04 definitions

### Secondary (MEDIUM confidence)
- Next.js App Router routing convention — file-based, rename = directory move — verified against existing codebase structure
- `next.config.ts` `redirects()` with `permanent: true` emitting 308 — consistent with CONTEXT.md canonical reference to ARCHITECTURE.md confirmation

---

## Metadata

**Confidence breakdown:**
- Redirect config syntax: HIGH — verified against existing `next.config.ts` structure and Next.js App Router convention
- File inventory: HIGH — all files read directly, grep confirmed
- False-positive identification (`@/components/` vs `/components` route): HIGH — grep patterns verified in-situ
- Pitfalls: HIGH — derived from direct code inspection, not speculation

**Research date:** 2026-04-07
**Valid until:** 2026-05-07 (stable domain — Next.js redirects API is unchanged across minor versions)
