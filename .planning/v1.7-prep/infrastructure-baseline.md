# Infrastructure Baseline — SF//UX v1.7 Prep

Tasks 14-16 from the v1.7 dispatch. Lighthouse, bundle size, visual regression.

---

## Task 14: Lighthouse Re-Baseline

### Current Scores

**Most recent run** (Phase 35, `launch-gate-2026-04-10`):

| Category | Localhost (3 runs, worst) | Production (signalframeux.vercel.app) |
|----------|--------------------------|---------------------------------------|
| Performance | 81 | 78 |
| Accessibility | 97 | 100 |
| Best Practices | 100 | 96 |
| SEO | 100 | 91 |

Historical: Phase 26 (v1.4) achieved 100/100 on A11y/BP/SEO, Performance was 80 mobile / 94 desktop.

### Lighthouse Infrastructure

**No Lighthouse CI config.** No `lighthouserc.js` or `.lighthouserc.json`.

**Custom advisory runner:** `scripts/launch-gate.ts` (110 lines) — runs Lighthouse 3 times via `chrome-launcher`, takes worst score per category, exits non-zero if any < 100. **Not wired into CI** — runs locally only.

**Playwright test:** `tests/phase-37-lighthouse-gate.spec.ts` — shells out to `scripts/launch-gate-runner.mjs` (ESM variant). Requires production server on `localhost:3000`. 5-minute timeout.

### Performance Gap Analysis

**Root cause: WebGL + GSAP overhead.** The Performance score (78-81) is the only category below 100.

WebGL architecture:
- Singleton `WebGLRenderer` in `lib/signal-canvas.tsx` (270 lines)
- `antialias: false`, pixelRatio capped at `Math.min(devicePixelRatio, 2)`
- GSAP ticker drives rendering (not Three.js `requestAnimationFrame`)
- IntersectionObserver gates visibility — offscreen scenes skip render
- 4 shader scenes: GLSLHero (FBM noise), GLSLSignal (Ikeda data field), ProofShader (lattice/noise blend), SignalMesh (wireframe icosahedron)
- All lazy-loaded via `next/dynamic({ ssr: false })`

### Font Loading

`layout.tsx:15-43`:
- **Electrolize** — Google Font, `display: "swap"`, var `--font-electrolize`
- **JetBrains Mono** — Google Font, `display: "swap"`, var `--font-jetbrains`
- **Inter** — Google Font, `display: "swap"`, var `--font-inter`
- **Anton** — local font from `app/fonts/Anton-Regular.woff2` (57 KB), `display: "optional"`, var `--font-anton`

Anton was switched from `swap` to `optional` as a CLS fix — `swap` caused 0.485 CLS on `/system` due to clamp heading shifts.

### Assets

Minimal. No images, videos, or 3D models in `public/`. Site is entirely code-generated (WebGL shaders, CSS, SVG). Only assets: `grain.svg`, `robots.txt`, registry JSON files, font files for OG image generation.

`next/image` used in only 2 files (`icon.tsx`, `opengraph-image.tsx`) for metadata generation, not page content.

### Next.js Performance Config

`next.config.ts`:
- `experimental.optimizePackageImports: ["lucide-react"]`
- `experimental.useCache: true`
- `@next/bundle-analyzer` integrated via `ANALYZE=true`
- Dev uses `--turbopack`
- No `images` config, no custom compression

### Performance Monitoring

**None in production.** No web-vitals library, no CrUX, no Sentry performance, no Datadog. Only lab measurements:
- `PerformanceObserver` in Playwright tests for LCP (`phase-35-lcp-homepage.spec.ts`) and CLS (`phase-35-cls-all-routes.spec.ts`)
- ESLint `core-web-vitals` rules (linting only, not runtime)

### v1.7 Constraints

The aesthetic push (Tier 1-3) adds visual effects. Performance budget:
- **A11y: 100** — non-negotiable. Currently 97-100.
- **Best Practices: 100** — currently 96-100.
- **SEO: 100** — currently 91-100 (production lower than local).
- **Performance: 78 baseline** — WebGL cost accepted. Aesthetic effects must not regress further.

### Recommendations

1. **Gap between localhost (81) and production (78) Performance** — investigate Vercel-specific overhead (compression, edge caching, CDN latency)
2. **A11y gap (97 localhost vs 100 production)** — investigate localhost-specific false positives
3. **SEO gap (100 localhost vs 91 production)** — investigate missing meta tags or robot directives in production
4. **Add web-vitals runtime reporting** — `next/web-vitals` or manual `PerformanceObserver` for CWV tracking in production
5. **All new aesthetic effects must be CSS-first** — no additional WebGL scenes for substrate/scan line effects

---

## Task 15: Bundle Size Audit

### Library Build Config (`tsup.config.ts`)

| Setting | Value |
|---------|-------|
| Entry points | `index` (core), `animation` (GSAP), `webgl` (Three.js) |
| Format | ESM (`.mjs`) + CJS (`.cjs`) |
| DTS | Enabled |
| Treeshake | `true` |
| Splitting | `false` |
| Sourcemaps | Enabled |
| JSX | Automatic runtime |

### npm Package Entry Points (`package.json:8-40`)

| Export | ESM | CJS |
|--------|-----|-----|
| `"."` (core) | `dist/index.mjs` | `dist/index.cjs` |
| `"./animation"` | `dist/animation.mjs` | `dist/animation.cjs` |
| `"./webgl"` | `dist/webgl.mjs` | `dist/webgl.cjs` |
| `"./signalframeux.css"` | `dist/signalframeux.css` | — |

`sideEffects: ["./dist/signalframeux.css"]` — correctly marks CSS as the only side-effect.

### Actual Bundle Sizes (Raw)

| File | Size |
|------|------|
| `dist/index.mjs` | 116 KB |
| `dist/index.cjs` | 125 KB |
| `dist/animation.mjs` | 18 KB |
| `dist/animation.cjs` | 20 KB |
| `dist/webgl.mjs` | 6 KB |
| `dist/webgl.cjs` | 7 KB |
| `dist/signalframeux.css` | 10 KB |
| **Total ESM** | **~150 KB raw** |

**Budget:** 50 KB gzip total across ESM entries + CSS (per `scripts/verify-bundle-size.ts:8`).

### Externals — Everything External

`tsup.config.ts:20-68` externalizes: React, react-dom, Next.js, GSAP, @gsap/react, Three.js, all Radix UI, cva, clsx, tailwind-merge, cmdk, sonner, vaul, lucide-react, input-otp, Lenis, date-fns, react-day-picker, server-only.

Distributed bundle contains only SF//UX's own component code.

### Dependencies

**Runtime (`dependencies`):** class-variance-authority, clsx, cmdk, date-fns, input-otp, lenis, lucide-react, next, radix-ui (19 packages), react, react-dom, server-only, shiki, sonner, tailwind-merge, tw-animate-css, vaul

**Peer (optional):** `gsap >=3.12.0`, `three >=0.183.0`, `tailwindcss >=4.0.0`

### Tree-Shaking Verification

- Verification script: `scripts/verify-tree-shake.ts` — confirms `dist/index.mjs` does NOT import `gsap` or `three`
- Bundle size gate: `scripts/verify-bundle-size.ts` — 50 KB gzip budget
- Both run during `prepublishOnly`: `pnpm build:lib && npx tsx scripts/verify-tree-shake.ts && npx tsx scripts/verify-bundle-size.ts`

### Barrel Files

| File | Type | Risk |
|------|------|------|
| `components/sf/index.ts` (187 lines) | Full barrel — ALL SF components | **Low** — only used by doc site, not consumer entry points. Mixes GSAP-dependent and GSAP-free but doesn't affect npm consumers. |
| `lib/entry-core.ts` (212 lines) | Named exports only, no `export *` | Clean. Excludes GSAP/Three.js with inline comments. |
| `lib/entry-animation.ts` (30 lines) | 5x `export * from` for GSAP utilities | **Low risk** — could pull unused GSAP utilities for consumers, but all are externalized. |
| `lib/entry-webgl.ts` (7 lines) | 3 named exports | Clean. |

### Code Splitting

19 files use `next/dynamic` or `React.lazy`:
- 6 WebGL lazy wrappers (all `ssr: false`)
- 3 SF component lazy wrappers (calendar, drawer, menubar)
- `global-effects-lazy.tsx`, `token-viz-loader.tsx`
- Various block components

### Bundle Analysis Tools

- `@next/bundle-analyzer` — activated via `ANALYZE=true pnpm build`
- Custom gzip budget gate (50 KB)
- Playwright test: shared JS chunks < 150 KB gzip, Three.js absent from sync bundle
- **Measured shared chunks: 100 KB gzip** (Phase 35)
- No `webpack-bundle-analyzer` or `source-map-explorer`

### v1.7 Budget Ceilings

| Metric | Current | Ceiling |
|--------|---------|---------|
| Library ESM total (gzip) | Under 50 KB | **50 KB** (existing gate) |
| App shared chunks (gzip) | 100 KB | **150 KB** (existing gate) |
| Three.js in sync bundle | Absent | **Absent** (existing gate) |

Aesthetic effects (grain, scan lines, glitch) are CSS-only — zero impact on library bundle. New idle escalation JS would land in `global-effects.tsx` which is in the app bundle, not the library bundle.

---

## Task 16: Storybook Visual Regression

### Current Storybook Setup

- **Framework:** `@storybook/nextjs-vite` (10.3.5)
- **Addons:** `essentials`, `themes`
- **Stories:** 52 total (40 root + 12 flagship)
- **Theme:** Custom SIGNALFRAME//UX dark theme (magenta accent, Inter/JetBrains Mono)
- **Deployment:** Vercel via `vercel-storybook.json` (static output to `storybook-static/`)
- **Build test:** `phase-40-03-storybook.spec.ts` — validates config, branding, build success, story count >= 40

### Visual Regression Testing — None

| Tool | Status |
|------|--------|
| Chromatic | Not installed |
| Percy | Not installed |
| Playwright screenshot baselines | Not used |
| `toMatchSnapshot` visual comparisons | Not used |
| CI/CD pipeline | **Does not exist** — no `.github/workflows/` |

### Options Evaluation

| Tool | Approach | Cost | Integration Effort |
|------|----------|------|-------------------|
| **Chromatic** | SaaS, Storybook-native. Uploads stories, generates snapshots, diffs against baselines. PR-based review. | Free tier: 5000 snapshots/month. Pro: $149/mo. | **Low** — `npx chromatic --project-token=xxx`. No config changes to Storybook. Needs GitHub Actions for automation. |
| **Percy** | SaaS, framework-agnostic. CLI uploads snapshots, diffs in Percy dashboard. | Free tier: 5000 snapshots/month. Team: $399/mo. | **Medium** — needs `@percy/storybook` addon + CLI setup. |
| **Playwright screenshots** | Built-in `toHaveScreenshot()`. Local baselines committed to repo. | Free. | **Medium** — need new test file, baseline management, platform-specific screenshot differences (macOS vs CI Linux). |
| **Storybook Test** | Built-in interaction + visual testing via Storybook 8+. | Free. | **Medium** — needs `@storybook/test` addon + test runner setup. |

### Recommendation

**Chromatic** is the lowest-friction option for SF//UX:
1. Already using Storybook 10 with `nextjs-vite` — native integration
2. 52 stories × ~3 viewports = ~156 snapshots per run — well within free tier
3. No CI/CD exists yet — Chromatic can be run manually via `npx chromatic` during development and later automated with GitHub Actions
4. The aesthetic push (v1.7) will change component appearance across the board — visual diffing is essential for validating intentional vs accidental changes

### CI/CD Gap

**No `.github/` directory exists.** All testing is local/manual:
- Lighthouse gate, bundle gate, CLS/LCP, Storybook build, a11y — all Playwright specs run locally
- No automated deployment gates
- No PR checks

This is a broader infrastructure gap. v1.7 should consider at minimum:
1. GitHub Actions workflow for `pnpm lint && pnpm tsc && pnpm test`
2. Chromatic for visual regression on PR
3. Lighthouse CI for performance regression on PR

---

## Combined Risk Summary

| Severity | Finding |
|----------|---------|
| **High** | No CI/CD pipeline — all quality gates are manual |
| **High** | No visual regression testing — aesthetic push will change many surfaces |
| **Medium** | Performance gap: 78-81 (WebGL cost). Aesthetic effects must not regress. |
| **Medium** | No runtime performance monitoring in production |
| **Medium** | Localhost vs production score divergence (A11y, SEO, BP) |
| **Low** | Barrel file `components/sf/index.ts` mixes GSAP-dependent and GSAP-free (doc site only) |
| **Low** | `entry-animation.ts` uses `export *` for GSAP utilities |
