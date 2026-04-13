# External Integrations

**Analysis Date:** 2026-04-12

## APIs & External Services

**Hosting / Deployment:**
- Vercel - deployment target and preview/prod URL workflow.
  - SDK/Client: Vercel CLI workflow and Vercel project config (`vercel-storybook.json`, `scripts/launch-gate.ts`).
  - Auth: user/org auth handled by local Vercel CLI session (no app runtime token var in repo files).

**Component Distribution:**
- shadcn registry endpoint (`https://signalframeux.com/r/{name}.json`) - external registry feed for component installation.
  - SDK/Client: shadcn CLI (`package.json` script `registry:build`, `components.json`, `registry.json`).
  - Auth: none required in repository config.

**Design/Visual QA Service:**
- Chromatic - Storybook snapshot publishing/review integration.
  - SDK/Client: `@chromatic-com/storybook`, `chromatic` (`package.json`, `.storybook/main.ts`).
  - Auth: Chromatic project token expected via CLI environment when running `pnpm chromatic` (token var not committed).

**Performance Audit Tooling:**
- Lighthouse + chrome-launcher - external browser audit engine for launch gates.
  - SDK/Client: `lighthouse` and transitive `chrome-launcher` (`scripts/launch-gate.ts`, `scripts/launch-gate-runner.mjs`).
  - Auth: none.

## Data Storage

**Databases:**
- Not detected.
  - Connection: Not applicable.
  - Client: Not applicable.

**File Storage:**
- Local filesystem only (e.g., report output in `scripts/launch-gate.ts`, font assets under `app/fonts/` and `public/`).

**Caching:**
- Next.js runtime/cache features only (no external Redis/CDN cache client detected in source imports).

## Authentication & Identity

**Auth Provider:**
- Custom/not applicable for app runtime.
  - Implementation: No user auth provider SDK/imports detected in `app/`, `components/`, `lib/`, or `hooks/`.

## Monitoring & Observability

**Error Tracking:**
- Not detected (no Sentry/Datadog/New Relic client usage found in source).

**Logs:**
- Local console and generated JSON artifacts for audit scripts (`scripts/launch-gate.ts`, `scripts/launch-gate-runner.mjs`).

## CI/CD & Deployment

**Hosting:**
- Vercel-oriented deployment and canonical domain configuration in `app/layout.tsx`, `app/sitemap.ts`, and `vercel-storybook.json`.

**CI Pipeline:**
- Not detected as committed workflow files (no `.github/workflows/*` found during this tech scan).

## Environment Configuration

**Required env vars:**
- `ANALYZE` (optional feature toggle for bundle analyzer in `next.config.ts`).
- `CI` (Playwright behavior toggle in `playwright.config.ts`).
- `VERCEL_PREVIEW_URL` (launch-gate audit target fallback in `scripts/launch-gate.ts` and `scripts/launch-gate-runner.mjs`).

**Secrets location:**
- Not specified in committed files; expected from local shell/CI environment injection.

## Webhooks & Callbacks

**Incoming:**
- None detected.

**Outgoing:**
- None detected.

---

*Integration audit: 2026-04-12*
