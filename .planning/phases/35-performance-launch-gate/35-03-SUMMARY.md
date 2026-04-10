---
phase: 35-performance-launch-gate
plan: 03
subsystem: og-image-metadata-launch-gate
tags: [og-image, metadata, lighthouse, font-assets, geist-mono, option-a]
requires: [35-01]
provides: [og-image-route, twitter-image-route, launch-gate-script, metadata-spec-tests]
affects: [app/opengraph-image.tsx, app/twitter-image.tsx, app/layout.tsx, scripts/launch-gate.ts, public/fonts]
tech-stack:
  added: [lighthouse@13.1.0, geist@1.7.0]
  patterns: [next-og-imagereponse, flex-only-satori, fs-readfile-fonts, tdd-red-green, advisory-lighthouse-runner]
key-files:
  created:
    - app/opengraph-image.tsx
    - app/twitter-image.tsx
    - tests/phase-35-metadata.spec.ts
    - scripts/launch-gate.ts
    - public/fonts/Anton-Regular.ttf
    - public/fonts/GeistMono-Regular.ttf
    - .planning/phases/35-performance-launch-gate/.gitignore
  modified:
    - package.json
    - pnpm-lock.yaml
    - app/layout.tsx (PENDING — Task 4, blocked on OPEN-2)
key-decisions:
  - "Option A (Geist Mono) honored per Grey 2026-04-09 ~20:40 PDT decision — OG image mono register intentionally diverges from live site JetBrains Mono; see wiki/analyses/v1.5-lr02-font-strategy.md (commit 96a52f2)"
  - "geist@1.7.0 installed as devDep to source GeistMono-Regular.ttf for OG image fs.readFile — zero production bundle impact confirmed (102 KB shared, under 150 KB gate)"
  - "lighthouse@13.1.0 installed as devDep per brief §PF-02 — NOT wired into CI, advisory manual runner only"
  - "chrome-launcher typed via inline interface shim (not @types/chrome-launcher) — pnpm does not hoist transitive deps to root node_modules"
  - "OPEN-2 resolved: metadataBase URL is https://signalframe.culturedivision.com (Grey 2026-04-10, commit 715fcc6) — SF//UX ships under Culture Division domain, not Vercel subdomain"
requirements-completed: [LR-02, PF-02]
duration: ~35 min total (Tasks 1+2+5 in prior session; Tasks 3+4 completed 2026-04-10 continuation)
completed: 2026-04-10
---

# Phase 35 Plan 03: OG Image + Metadata + Launch Gate Summary

Dynamic OG image (Anton + GeistMono, "live system readout" composition), metadataBase wired to signalframe.culturedivision.com, twitter-image re-export, Playwright metadata spec, and advisory 3-run Lighthouse runner — all 5 tasks complete.

## Execution

- **Duration:** ~35 min total (Tasks 1+2+5 in prior session; Tasks 3+4 completed 2026-04-10 continuation)
- **Start:** 2026-04-10
- **Tasks complete:** 5/5
- **Files created:** 7
- **Files modified:** 3 (app/layout.tsx, package.json, pnpm-lock.yaml)
- **Commits:** 5 (including RED test commit)

## Task Results

| Task | Commit | Result |
|------|--------|--------|
| 1. Provision font assets + install lighthouse + geist devDeps | `7a5a30b` | `public/fonts/Anton-Regular.ttf` + `public/fonts/GeistMono-Regular.ttf` created. `lighthouse@13.1.0` + `geist@1.7.0` added as devDeps. Bundle gate still 102 KB. |
| 2. Author app/opengraph-image.tsx + app/twitter-image.tsx (TDD) | `2261ddb` (RED), `f49d4c6` (GREEN) | OG image: flex-only, fs.readFile, no edge runtime, 9 locked content fields, Anton + GeistMono fonts, magenta #e91e90 on SIG:0.7. twitter-image: 4-line re-export shim. |
| 3. OPEN-2 checkpoint (external) | `715fcc6` (xtop) | Grey confirmed `https://signalframe.culturedivision.com` — OPEN-ITEMS.md + app/sitemap.ts updated by xtop. |
| 4. Wire metadataBase + openGraph.url into app/layout.tsx | `06e73b6` | `metadataBase: new URL("https://signalframe.culturedivision.com")` + `openGraph.url: "/"` added. All existing fields preserved. Build passes at 102 KB. |
| 5. Author scripts/launch-gate.ts advisory Lighthouse runner | `62db80a` | 3-run worst-score script, 4 categories, --url CLI arg, JSON output to phase dir. NOT wired into CI. TypeScript clean. |

## Font Strategy: Option A Decision

**Grey's decision (2026-04-09 ~20:40 PDT):** literal brief honor — Option A (Geist Mono) over Option B (JetBrains Mono).

The LR-02 strategy brief at `wiki/analyses/v1.5-lr02-font-strategy.md` (commit `96a52f2`) analyzed four options and recommended **Option B** (JetBrains Mono — matches live site). Grey overrode that recommendation:

- Brief §LR-02 code sample explicitly names "GeistMono" and `public/fonts/GeistMono-Regular.ttf`
- Grey chose to honor the brief literally rather than correct the reference to match the live site
- The OG image's mono register **intentionally diverges** from the live site's JetBrains Mono
- Sourced from `geist@1.7.0` npm package (Vercel OFL 1.1) at `node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.ttf`

## OPEN-2: metadataBase URL — RESOLVED

Grey confirmed `https://signalframe.culturedivision.com` on 2026-04-10. SF//UX ships under the Culture Division domain. xtop updated OPEN-ITEMS.md + app/sitemap.ts at commit 715fcc6. Task 4 then wired this URL into `app/layout.tsx` at commit 06e73b6.

## Bundle Impact

- `lighthouse@13.1.0` — devDep only, zero production bundle impact (confirmed: shared JS 102 KB unchanged)
- `geist@1.7.0` — devDep only, TTF sourced at build/OG-render time via `fs.readFile`, zero client bundle impact
- `/opengraph-image` and `/twitter-image` routes registered (134 B each, server-rendered on demand)

## Deviations from Plan

**1. [Rule 1 - Bug] chrome-launcher TypeScript module resolution**

- **Found during:** Task 5
- **Issue:** `chrome-launcher` is a transitive dep of `lighthouse` — pnpm does not hoist it to root `node_modules/`, so TypeScript 5.8 cannot resolve `import { launch } from "chrome-launcher"`. The brief's locked shape uses this import.
- **Fix:** Replaced the ES import with a `require()` shim typed via an inline `ChromeLaunchOptions`/`LaunchedChrome` interface. Runtime behavior is identical (`tsx` resolves transitive deps correctly at execution time).
- **Files modified:** `scripts/launch-gate.ts`
- **Commit:** `62db80a`

## Self-Check

Files exist:
- `app/opengraph-image.tsx` — EXISTS
- `app/twitter-image.tsx` — EXISTS
- `tests/phase-35-metadata.spec.ts` — EXISTS
- `scripts/launch-gate.ts` — EXISTS
- `public/fonts/Anton-Regular.ttf` — EXISTS
- `public/fonts/GeistMono-Regular.ttf` — EXISTS
- `app/layout.tsx` (metadataBase + openGraph.url) — EXISTS

Commits exist: `7a5a30b`, `2261ddb`, `f49d4c6`, `62db80a`, `06e73b6` — all confirmed in git log.

## Self-Check: PASSED
