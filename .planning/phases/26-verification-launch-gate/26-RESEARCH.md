# Phase 26: Verification + Launch Gate — Research

**Researched:** 2026-04-07
**Domain:** Bundle analysis (Next.js @next/bundle-analyzer), Lighthouse audit (Vercel deployed URL), Playwright smoke test, performance verification
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| VF-01 | Shared JS bundle remains under 150 KB gate after all v1.4 additions — ComponentDetail lazy-load, P3 component lazy-load, and shiki server-only module all verified as non-contributors to initial bundle | Bundle already measured at 100 KB gzip (341 KB raw) from Phase 27 build; gate has 50 KB margin; ANALYZE=true pnpm build command confirmed in next.config.ts |
| VF-02 | Lighthouse audit against the deployed Vercel URL (not CLI headless) returns 100/100 on Performance, Accessibility, Best Practices, and SEO — LCP < 1.0s, CLS = 0, TTI < 1.5s | Lighthouse has never been run against a deployed URL — deferred since v1.3 audit; this phase closes that gap; no .vercel directory found (project not yet linked) |
</phase_requirements>

---

## Summary

Phase 26 is a verification gate, not implementation work. Two requirements must be satisfied: the shared JS bundle must be confirmed below 150 KB and the lazy-loading strategy must be verified working, then Lighthouse must return 100/100 against the live Vercel deployment on all four dimensions.

**Bundle state (current):** The last clean build from Phase 27 (commit 37fb914) measured the shared bundle at 102 KB gzip (confirmed independently: 100.0 KB gzip across the four rootMainFiles chunks). The gate is 150 KB. There is a 50 KB margin. Three critical non-contributors must be verified: ComponentDetail (next/dynamic ssr:false), P3 components (Calendar/Menubar, next/dynamic), and shiki/core (server-only RSC module). These are confirmed in code but must be mechanically verified via `ANALYZE=true pnpm build` — the analyzer produces browser-openable HTML reports identifying every chunk's contents.

**Lighthouse state (current):** Lighthouse has never been run against a deployed Vercel URL. It has been deferred since v1.3 (v1.3 audit tech debt: "Lighthouse 100/100 not yet confirmed against deployed URL"). VF-02 is the milestone close-out of this deferred gate. The site has not been deployed to Vercel in the current session — `.vercel/` directory does not exist, meaning `vercel link` must be run before any deployment.

**Primary recommendation:** Run `ANALYZE=true pnpm build` to confirm bundle gate. Link project to Vercel (`vercel link`), deploy with `vercel --prod`, then run Lighthouse against the production URL. Document findings. If any metric misses, diagnose and fix before declaring v1.4 complete.

---

## Standard Stack

### Core Verification Tools

| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| @next/bundle-analyzer | 16.2.2 (installed) | Treemap visualization of JS bundle by chunk/module | Already in devDependencies; activated via `ANALYZE=true` env var |
| Vercel CLI | latest | Deploy to production URL for authentic Lighthouse target | No headless limitation; real network; CDN edge; real CWV |
| Lighthouse (Chrome DevTools or PageSpeed Insights) | current | Performance + Accessibility + Best Practices + SEO audit | Must run against deployed URL, not localhost — requirement spec explicit |
| `pnpm build` | — | Produces `.next/` with bundle-analyzer report | Standard Next.js build gate |

### Supporting Tools

| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| Google PageSpeed Insights (web.dev/measure) | web | Remote Lighthouse runner against public URL | Primary for VF-02 — no Chrome instance needed, API-accessible, reproducible |
| Lighthouse CLI (`npx lighthouse`) | 12.x | Headless Lighthouse via Node | Supplementary only — NOT the gate (requirement says "deployed URL", not CLI headless) |
| `pnpm exec playwright test` | 1.59.1 | Full E2E suite smoke test before declaring gate passed | Run full suite to confirm Phase 27 fixes haven't broken Phase 25 tests |

### What Already Exists

- `@next/bundle-analyzer` is in `devDependencies` — no install needed
- `next.config.ts` already has `withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" })` wired
- `ANALYZE=true pnpm build` is the documented command from v1.3 research
- Playwright test suite has 2 spec files (10 + 8 tests) covering all prior phases

### No New Dependencies

Phase 26 requires zero new packages. All verification tools are either already installed or web-based.

---

## Architecture Patterns

### Pattern 1: Bundle Gate Verification via Analyzer

**What:** `ANALYZE=true pnpm build` triggers `@next/bundle-analyzer`, which opens two treemap HTML files (`client.html`, `server.html`) after build completes. The client treemap shows every module in every chunk with byte sizes (gzip by default).

**What to verify in the analyzer:**
1. `node_modules/shiki` must NOT appear in any initial chunk — it should be absent from client chunks entirely (server-only) or only in async/lazy chunks
2. `component-detail` must appear as a numbered async chunk (lazy-loaded via next/dynamic), NOT in `app/page.js` or `app/components/page.js`
3. `sf-calendar` and `sf-menubar` must appear in separate async chunks, NOT in the `shared` bundle chunks (353a808c or 594-60da1...)
4. The four `rootMainFiles` (webpack, 353a808c, 594-60da1, main-app) remain under 150 KB total gzip

**The four rootMainFiles (confirmed):**
```
webpack-b10c0e45427095cb.js   → 1.9 KB gzip
353a808c-14d8a45ebc7585c0.js  → 53.0 KB gzip
594-60da1ccd43ff91b1.js       → 44.9 KB gzip
main-app-76a6a6441f106c70.js  → 0.2 KB gzip
Total: 100.0 KB gzip (gate: 150 KB, margin: 50 KB)
```

**Important:** The `.next/` directory at time of research is from the Phase 27 build (Apr 6). Phase 26 must run a fresh `pnpm build` to confirm the gate against code in the current working tree. The reported 102 KB figure from STATE.md is consistent with the locally measured 100.0 KB (the 2 KB delta is likely from Next.js CLI reporting rounding).

### Pattern 2: Vercel Deployment for VF-02

**What:** VF-02 requires Lighthouse against a *deployed* Vercel URL. The reason: headless CLI Lighthouse misses CDN edge latency, real network conditions, HTTP/2 push, and Vercel's image optimization. The spec is explicit: "not CLI headless."

**Deployment sequence:**
```bash
# Step 1: Link project (one-time, creates .vercel/)
vercel link

# Step 2: Deploy to production
vercel --prod

# Step 3: Note the production URL (e.g. https://signalframeux.vercel.app or custom domain)
# Step 4: Run Lighthouse via PageSpeed Insights
# https://pagespeed.web.dev/ — paste URL, run audit
# OR via Chrome DevTools Lighthouse tab against the production URL
```

**Domain:** The planning docs reference `signalframeux.com` as the intended domain. The Vercel project may already exist (even without `.vercel/` locally) if the user previously deployed via the Vercel dashboard. `vercel link` will discover the existing project.

### Pattern 3: Lighthouse Targets

**Requirements from VF-02:**
- Performance: 100/100
- Accessibility: 100/100
- Best Practices: 100/100
- SEO: 100/100
- LCP < 1.0s
- CLS = 0
- TTI < 1.5s

**Known Lighthouse risks in this codebase:**
1. **WebGL canvas cursor** — custom cursor may cause pointer-events issues or accessibility violations. Must have `aria-hidden="true"` or be excluded from accessibility tree.
2. **GSAP animations** — layout shift during scroll animations can produce non-zero CLS. Must be `will-change: transform` (not layout-affecting properties).
3. **Three.js async chunk** — Three.js is in an async chunk (~363 KB raw, one of the largest chunks). If it's loading on the critical path for WebGL scenes visible above the fold, it may affect LCP.
4. **SignalOverlay** — Fixed-position overlay with high z-index; must not cause CLS.
5. **OKLCH colors** — no SEO impact but must have sufficient contrast for WCAG AA Accessibility score.
6. **Font loading** — Inter, JetBrains Mono, Electrolize, Anton. Font display strategy must prevent FOUT/CLS.
7. **Lenis scroll** — smooth scrolling library affects scroll event handling; may impact TTI if not deferred correctly.

### Pattern 4: Lighthouse Fix Taxonomy

If scores miss 100/100, the fixes fall into categories. Planner should structure tasks around fix categories:

| Score Miss | Typical Cause | Fix Pattern |
|------------|--------------|-------------|
| Performance < 100 | LCP (image/font/render blocking) | Add `priority` to LCP image, preload critical font |
| Performance < 100 | TTI (heavy JS on main thread) | Ensure GSAP/Three.js is deferred, not blocking |
| Accessibility < 100 | Missing alt text, ARIA, color contrast | Audit rendered DOM; add aria-label, fix contrast |
| Best Practices < 100 | Console errors, deprecated APIs, HTTPS issues | Fix console errors; ensure HTTPS on all assets |
| SEO < 100 | Missing meta description, robots.txt, viewport | Check `app/layout.tsx` metadata export |
| CLS > 0 | Image without dimensions, font swap, GSAP layout mutation | Fix image sizes; use `font-display: optional` or `swap` with height reservation |

### Anti-Patterns to Avoid

- **Running Lighthouse against localhost** — produces artificially different results (no CDN, no compression, localhost latency). VF-02 explicitly requires deployed URL.
- **Running Lighthouse once and accepting a flaky result** — Lighthouse scores can vary ±5 points on the same URL. Run 3 times, use median, or use PageSpeed Insights which runs multiple passes.
- **Running analyzer in dev mode** — `ANALYZE=true pnpm dev` does not produce the same output as `ANALYZE=true pnpm build`. Production build only.
- **Declaring gate passed based on old build data** — the `.next/` from Apr 6 Phase 27 must be refreshed with a new build before VF-01 is satisfied.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Bundle visualization | Custom Webpack stats parser | `@next/bundle-analyzer` (already installed) | Treemap UI with gzip/brotli toggle, drill-down to individual modules |
| Lighthouse scoring | Manual perf checklist | PageSpeed Insights or Chrome DevTools Lighthouse | 25+ audit categories, lab data consistent with real Lighthouse |
| Vercel deployment | Manual file upload | `vercel --prod` (Vercel CLI) | Handles build cache, edge config, environment variables, CDN routing |

---

## Common Pitfalls

### Pitfall 1: Shared Bundle Definition Mismatch

**What goes wrong:** "Shared bundle" is interpreted as ALL chunks downloaded on first page load, not just the `rootMainFiles`. The rootMainFiles (webpack + 353a808c + 594-60da1 + main-app) are the only chunks that must be under 150 KB — they load on every route. Page-specific chunks (app/page, app/components/page) are route-scoped and do not count against the shared gate.

**Why it happens:** The Next.js build output lists many chunks; it's easy to conflate route chunks with shared chunks.

**How to avoid:** Gate is measured only against `rootMainFiles` from `build-manifest.json`. Confirmed via: `cat .next/build-manifest.json | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['rootMainFiles'])"`.

**Warning signs:** Alarm if the measured total includes `app/page-*.js` (35 KB) or `app/components/page-*.js` (30 KB) — these are not part of the shared bundle gate.

### Pitfall 2: Lighthouse Penalizes Canvas/WebGL Accessibility

**What goes wrong:** The WebGL canvas elements (SignalCanvas, GLSLHero, TokenViz) do not have accessible names. Lighthouse Accessibility audit flags canvas elements without `aria-label` or `role` attributes. Each violation removes points.

**Why it happens:** Canvas elements are visual-only; developers don't think to add ARIA.

**How to avoid:** Verify each `<canvas>` has `aria-hidden="true"` OR `aria-label` + `role="img"`. Grep:
```bash
grep -r "<canvas" components/ app/ --include="*.tsx" -n
```

**Warning signs:** Accessibility score < 100 after first Lighthouse run.

### Pitfall 3: vercel link Discovers Wrong Team/Project

**What goes wrong:** `vercel link` prompts for team and project. If the user has multiple Vercel teams, it may link to the wrong one. The `.vercel/project.json` will then deploy to the wrong project.

**Why it happens:** No `.vercel/` directory exists locally. `vercel link` is interactive.

**How to avoid:** Check `vercel whoami` first. Confirm team. Run `vercel link` and verify the project name shown matches SignalframeUX.

### Pitfall 4: Stale Build Before Analyzer Run

**What goes wrong:** Running `ANALYZE=true pnpm build` but the build uses cached Next.js output. The analyzer reports match the cache, not the current code state.

**Why it happens:** Next.js caches aggressively in `.next/cache/`.

**How to avoid:** The cache invalidation is automatic when source files change. The Phase 27 commits changed `component-grid.tsx`, `page.tsx`, `signal-overlay.tsx`, `globals.css`, `component-registry.ts` — these will all trigger recompilation. No need to delete `.next/cache` manually unless the analyzer reports unexpected results.

### Pitfall 5: Lighthouse Runs Against Preview URL Instead of Production

**What goes wrong:** `vercel deploy` (without `--prod`) creates a preview URL with deployment protection enabled. Lighthouse cannot access it; returns a 401 or redirect error.

**Why it happens:** Vercel deployment protection is on by default for preview deployments.

**How to avoid:** Always use `vercel --prod` for the Lighthouse URL. Production deployments are public.

### Pitfall 6: CLS from GSAP Scroll Animations

**What goes wrong:** GSAP ScrollTrigger animations that animate `height`, `margin`, `padding`, or `top/left` properties (not `transform`) cause layout recalculation during scroll, contributing to CLS.

**Why it happens:** GSAP defaults to the most natural property; not all developers restrict to `transform` + `opacity`.

**How to avoid:** All GSAP animations in the codebase should use `transform: translateX/Y` and `opacity`. Any animation of layout properties (height, margin, top, left) will cause CLS. Check the ComponentDetail panel height animation specifically — it was implemented in Phase 25 as a GSAP height animation. Height animation is a CLS risk.

**Key file to verify:** `components/blocks/component-detail.tsx` — Phase 25 implemented GSAP height animation for panel open/close. If this animates `height` directly (not `max-height` or `transform: scaleY`), it will contribute CLS during scroll.

### Pitfall 7: Lighthouse Best Practices — Console Errors

**What goes wrong:** Any `console.error` or unhandled promise rejection in the browser console causes Best Practices to miss 100/100.

**Why it happens:** Developers add `console.error` for debugging and forget to remove them in production.

**How to avoid:** Open Chrome DevTools console on the deployed URL before running Lighthouse. Clear the console, load the page, scroll through all major sections. If any errors appear, fix before running Lighthouse.

---

## Code Examples

### VF-01: Run Bundle Analyzer

```bash
# Run from project root
ANALYZE=true pnpm build
# Opens two browser tabs: client.html + server.html treemaps
# Verify in client.html:
#   - 'shiki' appears only in server chunks (or is absent from client treemap)
#   - 'component-detail' appears in a numbered async chunk
#   - 'sf-calendar' and 'sf-menubar' appear in separate async chunks
```

### VF-01: Measure Shared Bundle Gzip Size Programmatically

```bash
# Get rootMainFiles from build manifest
python3 -c "
import json, gzip, os
with open('.next/build-manifest.json') as f:
    d = json.load(f)
total = 0
for path in d['rootMainFiles']:
    filepath = f'.next/{path}'
    with open(filepath, 'rb') as f:
        data = f.read()
    gz = gzip.compress(data, compresslevel=9)
    total += len(gz)
    print(f'{os.path.basename(path)}: {len(gz)/1024:.1f} KB gzip')
print(f'Total: {total/1024:.1f} KB (gate: 150 KB, margin: {150 - total/1024:.1f} KB)')
"
```

### VF-02: Vercel Deployment Sequence

```bash
# Verify Vercel account
vercel whoami

# Link project (one-time — creates .vercel/project.json)
vercel link

# Deploy to production
vercel --prod

# Note the production URL from CLI output (or vercel.com dashboard)
# Then run Lighthouse at: https://pagespeed.web.dev/
```

### VF-02: Check for Canvas ARIA Issues

```bash
# Find all canvas elements — each must have aria-hidden="true" or aria-label
grep -rn "<canvas" components/ app/ --include="*.tsx"
```

### VF-02: Check for console.error calls

```bash
# Find console.error in source (should be zero in production code paths)
grep -rn "console\.error\|console\.warn" components/ app/ lib/ hooks/ --include="*.tsx" --include="*.ts" | grep -v "// " | grep -v "node_modules"
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Lighthouse deferred ("CLI headless not representative") | Lighthouse against deployed URL (VF-02 mandate) | v1.4 Phase 26 | Authentic Core Web Vitals measurement |
| Bundle gate informal (200 KB soft limit) | Hard gate at 150 KB, measured from rootMainFiles | v1.3 | Enforced with ANALYZE=true tooling |
| No Vercel project linking documented | Must run `vercel link` before `vercel --prod` | Phase 26 | New step in workflow |
| Three.js in shared bundle (early v1.1) | Three.js in async chunk only | v1.2 | Shared bundle dropped to ~102 KB |

**Deprecated/outdated:**
- Running Lighthouse against `localhost:3000` — does not satisfy VF-02. Only deployed URL counts.
- Using `next analyze` CLI — does not exist; the correct command is `ANALYZE=true pnpm build`.

---

## Open Questions

1. **Deployed Vercel URL**
   - What we know: No `.vercel/` directory locally; planning docs reference `signalframeux.com` as intended domain; unclear if Vercel project exists in the dashboard
   - What's unclear: Whether the project is already linked on Vercel dashboard (deployed previously via CI or web UI)
   - Recommendation: Executor runs `vercel link` at plan start — if project exists it will connect, if not it creates one

2. **ComponentDetail height animation CLS risk**
   - What we know: Phase 25 implemented a GSAP height animation for panel open/close; height animations are a known CLS source
   - What's unclear: Whether the implementation uses `height` directly or `max-height`/`scaleY` transform; this was not audited during Phase 25
   - Recommendation: Executor audits `component-detail.tsx` GSAP animation properties before running Lighthouse; if `height` is directly animated, convert to `maxHeight` or `transform: scaleY`

3. **Lighthouse score for WebGL pages**
   - What we know: The homepage and tokens page run Three.js/WebGL scenes; these are in async chunks (not initial bundle); however WebGL warmup on first paint may delay TTI
   - What's unclear: Whether Three.js async load blocks TTI measurement or if Lighthouse scores it as deferred
   - Recommendation: Run Lighthouse on homepage first; if TTI > 1.5s, add `loading="lazy"` deferral or increase `webServer` readiness threshold

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright 1.59.1 |
| Config file | `playwright.config.ts` |
| Quick run command | `pnpm exec playwright test tests/phase-27-integration-bugs.spec.ts` |
| Full suite command | `pnpm exec playwright test` |

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| VF-01 | Shared bundle under 150 KB gate (rootMainFiles gzip total) | script | `python3 -c "<gzip measurement script>"` | ✅ (inline script) |
| VF-01 | ComponentDetail, Calendar, Menubar, shiki absent from shared bundle | manual/analyzer | `ANALYZE=true pnpm build` (visual inspection of treemap) | ✅ (ANALYZE flag wired) |
| VF-02 | Lighthouse 100/100 Performance + Accessibility + Best Practices + SEO | manual (external tool) | PageSpeed Insights against deployed URL | N/A — web tool |
| VF-02 | LCP < 1.0s, CLS = 0, TTI < 1.5s | manual (external tool) | PageSpeed Insights CWV section | N/A — web tool |
| Regression | All prior phase tests still pass | e2e | `pnpm exec playwright test` | ✅ both spec files exist |

### Sampling Rate

- **Per task commit:** `pnpm exec playwright test` (full suite — only 2 spec files, ~30s total)
- **Per wave merge:** `pnpm exec playwright test` + `ANALYZE=true pnpm build` for bundle check
- **Phase gate:** Lighthouse 100/100 documented + bundle gate confirmed before `/pde:verify-work`

Note: Dev server must be running on `localhost:3000` before Playwright tests. VF-02 Lighthouse must be run against deployed URL (Vercel production), not localhost.

### Wave 0 Gaps

None — existing test infrastructure covers all phase requirements. No new spec files needed.

The two VF requirements that are manual (Lighthouse, ANALYZE treemap inspection) are by nature of the tooling, not gaps in test coverage. These are documented as manual-only items in the verification plan.

---

## Sources

### Primary (HIGH confidence)

- Direct code audit: `/Users/greyaltaer/code/projects/SignalframeUX/next.config.ts` — ANALYZE=true bundle-analyzer setup confirmed
- Direct measurement: `.next/build-manifest.json` `rootMainFiles` → 4 chunks totaling 100.0 KB gzip (measured Apr 7)
- Direct code audit: `package.json` — `@next/bundle-analyzer@16.2.2` in devDependencies, no Vercel CLI in dependencies
- STATE.md: "shared bundle 102 kB" from Phase 27 build output (consistent with our 100.0 KB gzip measurement)
- REQUIREMENTS.md: VF-01 and VF-02 requirement specs verbatim
- Phase 27 SUMMARY.md: Bundle gate confirmed at 102 kB after IBF fixes
- v1.3 Milestone Audit: "Lighthouse 100/100 not yet confirmed against deployed URL" — tech debt confirmed

### Secondary (MEDIUM confidence)

- Playwright spec files (`tests/phase-25-detail-view.spec.ts`, `tests/phase-27-integration-bugs.spec.ts`) — existing test patterns for regression checks
- STATE.md Accumulated Context v1.3: "Bundle budget gate: Measured baseline 103KB shared; hard limit 200KB; gate at 150KB"

### Tertiary (LOW confidence)

- WebGL/GSAP CLS risk (Pitfall 6) — based on general Lighthouse behavior and GSAP animation property knowledge; not verified against deployed URL

---

## Metadata

**Confidence breakdown:**
- Bundle gate (VF-01): HIGH — rootMainFiles measured directly from local `.next/`, ANALYZE tooling confirmed in next.config.ts, 50 KB margin confirmed
- Vercel deployment: MEDIUM — no `.vercel/` directory, project linking unknown, domain status unknown; `vercel link` is the necessary first step
- Lighthouse score (VF-02): LOW-MEDIUM — never been run against deployed URL; known risk areas (WebGL canvas ARIA, CLS from height animation, console errors) are well-understood but unconfirmed until run
- Playwright regression: HIGH — both spec files exist, runner confirmed working from prior phases

**Research date:** 2026-04-07
**Valid until:** Bundle measurement is tied to current `.next/` build; re-run `pnpm build` before VF-01 measurement. Lighthouse findings are environment-dependent; valid at time of run only.
