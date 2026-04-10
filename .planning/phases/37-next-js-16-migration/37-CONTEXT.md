# Phase 37: Next.js 16 Migration - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Upgrade SignalframeUX from Next.js 15.5.14 to Next.js 16.x with zero regressions across performance (Lighthouse 100/100), tests (18 Playwright E2E), TypeScript compilation, and bundle size (<150KB first-load JS gzip). Includes middleware→proxy rename, dependency updates, and minimal cache component adoption.

</domain>

<decisions>
## Implementation Decisions

### Migration Sequencing
- Bump Tailwind CSS to latest patch FIRST (isolate Unicode bug risk), verify build passes, THEN upgrade Next.js
- Use feature branch for the migration — only merge to main when all gates pass
- Run official codemod (`npx @next/codemod@latest upgrade`) first, then manually verify and fix anything it misses
- Bundle `eslint-config-next` version bump with the Next.js upgrade (keep versions matched)

### Middleware → Proxy
- Rename `middleware.ts` → `proxy.ts`, export `proxy` instead of `middleware`
- Keep current CSP policy as-is (static CSP with `unsafe-inline`, validated at Lighthouse 100/100 in Phase 36)
- Research and explore new proxy.ts capabilities (Fluid Compute, full Node.js runtime) — adopt anything useful for a design system site, but no new features that warrant their own phase

### Node.js Version
- Stay on Node 20.20.0 — minimizes migration variables, supported until April 2026
- Do not upgrade Node alongside Next.js 16; defer Node upgrade to a separate effort if needed

### Cache Components
- Minimal `'use cache'` adoption as proof-of-concept, not full conversion
- Target: `/system` (tokens) page specimen renderers — heavy compute for color/spacing/type specimens
- All other routes remain fully static (no dynamic rendering needed)

### Claude's Discretion
- Exact Tailwind CSS target version (latest patch that fixes Unicode bug)
- Whether to adopt `vercel.ts` config format or keep `next.config.ts`
- Specific proxy.ts capabilities to adopt (if any prove useful after research)
- `'use cache'` granularity on the /system page (page-level vs component-level)
- Codemod scope — which transformations to accept vs manually adjust

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Migration Source
- `.planning/phases/37-next-js-16-migration/37-RESEARCH.md` — Breaking changes inventory, risk assessment, dependency compatibility matrix

### Current Configuration
- `middleware.ts` — Current CSP header injection (33 lines) — rename target
- `next.config.ts` — Redirects, bundle analyzer wrapper — check for breaking config changes
- `package.json` — Current dependency versions (next ^15.3.0, tailwindcss ^4.1.4, eslint-config-next ^15.3.0)
- `tsconfig.json` — TypeScript configuration baseline

### Prior Phase Decisions
- `.planning/phases/36-housekeeping-carry-overs/36-CONTEXT.md` — Phase 36 ESLint wiring, CSP nonce removal rationale

### Project Rules
- `CLAUDE.md` — System rules, token system, quality bar, hard constraints

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `middleware.ts` — Clean 33-line CSP injector, mechanical rename to proxy.ts
- `next.config.ts` — Minimal config (redirects + bundle analyzer), low migration surface
- `eslint.config.mjs` — Already wired in Phase 36 with `eslint-config-next`
- `@next/bundle-analyzer@^16.2.2` — Already on v16 (no version bump needed)

### Established Patterns
- All routes are static (no `headers()`/`cookies()` calls — removed in Phase 36)
- No dynamic routes (no `[slug]` segments, no `generateStaticParams`)
- No `unstable_cache` or `revalidate` usage anywhere
- Turbopack used in dev mode (`next dev --turbopack`)
- `pnpm lint` calls `eslint .` directly (not `next lint` — already compatible)

### Integration Points
- 18 Playwright E2E tests — must all pass on Next 16
- Vercel deployment — verify project settings don't pin old Node version
- `pnpm build` → `.next/` output — bundle size gate reads `.next/build-manifest.json`
- `scripts/launch-gate.ts` — Lighthouse runner, must still work on Next 16

</code_context>

<specifics>
## Specific Ideas

- The Tailwind v4 Unicode bug (4.0.7–4.1.18 under Turbopack prod builds) was explicitly called out in research as highest risk — sequencing Tailwind upgrade first directly addresses this
- Branch-based rollback chosen over git-revert — aligns with the idea that a framework migration is a discrete deliverable that should be validated holistically before landing on main
- `/system` page chosen for cache component PoC because specimen renderers (color, spacing, type, motion) are the heaviest pure-render components in the project

</specifics>

<deferred>
## Deferred Ideas

- Node.js 22/24 upgrade — separate effort, not bundled with Next.js 16
- Full `'use cache'` adoption across all routes — defer until dynamic data needs arise (Phase 39-40 API routes)
- CSP policy tightening (removing `unsafe-eval`, stricter `connect-src`) — separate security hardening effort
- `vercel.ts` config migration — evaluate after Next.js 16 is stable

</deferred>

---

*Phase: 37-next-js-16-migration*
*Context gathered: 2026-04-10*
