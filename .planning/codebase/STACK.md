# Technology Stack

**Analysis Date:** 2026-04-12

## Languages

**Primary:**
- TypeScript `5.8.3` (declared) / `5.9.3` (locked via transitive graph) - application, library, scripts, and tests in `package.json`, `tsconfig.json`, `pnpm-lock.yaml`.

**Secondary:**
- JavaScript (ESM/CJS config + runtime scripts) - config and tooling in `eslint.config.js`, `postcss.config.mjs`, `scripts/launch-gate-runner.mjs`.
- CSS (Tailwind v4 + design tokens) - global styling in `app/globals.css` referenced by `components.json` and `.storybook/preview.ts`.

## Runtime

**Environment:**
- Node.js runtime (version not pinned in repo; no `.nvmrc` or `engines` field detected).
- Browser runtime for Next.js App Router pages and Storybook stories in `app/` and `stories/`.

**Package Manager:**
- pnpm (lockfile format v9) inferred from `pnpm-lock.yaml` and scripts in `package.json`.
- Lockfile: present (`pnpm-lock.yaml`).

## Frameworks

**Core:**
- Next.js `^16.2.3` (declared) / `15.5.14` (resolved in lockfile) - application framework in `package.json`, `pnpm-lock.yaml`, `next.config.ts`.
- React `^19.1.0` (declared) / `19.2.4` (resolved) - UI runtime in `package.json`, `pnpm-lock.yaml`.
- Tailwind CSS `^4.2.2` - styling system in `package.json`, `postcss.config.mjs`.
- Radix UI aggregate package `^1.4.3` - primitive UI base consumed by SF wrappers in `components/ui/` and `components/sf/`.

**Testing:**
- Vitest `^4.1.4` - unit test runner in `package.json`, `vitest.config.ts`.
- Playwright `^1.59.1` - E2E testing in `package.json`, `playwright.config.ts`, `tests/`.
- axe-core/playwright `^4.11.1` - accessibility assertions in browser tests (`package.json`).

**Build/Dev:**
- Turbopack via `next dev --turbopack` - local app development (`package.json`).
- tsup `^8.5.1` - dual-format library builds in `tsup.config.ts`.
- Storybook `^10.3.5` with Next.js+Vite framework - component development in `.storybook/main.ts`.
- shadcn CLI `^4.1.2` - registry/component tooling in `package.json` and `registry.json`.

## Key Dependencies

**Critical:**
- `gsap` `^3.14.2` + `@gsap/react` `^2.1.2` - animation system used by SIGNAL components (`components/animation/`, `components/sf/sf-progress.tsx`).
- `three` `^0.183.2` - WebGL rendering for SIGNAL mesh/overlay features (`components/animation/signal-mesh.tsx`, `components/animation/datamosh-overlay.tsx`).
- `class-variance-authority` `^0.7.1` + `tailwind-merge` `^3.0.2` + `clsx` `^2.1.1` - component variant/class composition (`components/sf/*`, `lib/utils.ts`).

**Infrastructure:**
- `eslint` `^9.25.1` + `eslint-config-next` `^16.2.3` + `@typescript-eslint/*` `^8.58.1` - lint/type-aware static checks in `eslint.config.js`.
- `lighthouse` `^13.1.0` - performance gate auditing in `scripts/launch-gate.ts`.
- `husky` `^9.1.7` + `lint-staged` `^16.4.0` - pre-commit quality hooks in `package.json`.

## Configuration

**Environment:**
- Optional env toggles are used directly in code:
  - `ANALYZE` in `next.config.ts` for bundle analyzer.
  - `CI` in `playwright.config.ts` for `forbidOnly`.
  - `VERCEL_PREVIEW_URL` in `scripts/launch-gate.ts` and `scripts/launch-gate-runner.mjs`.
- No `.env*` files detected at repo root during scan.

**Build:**
- Next config: `next.config.ts`.
- TypeScript config: `tsconfig.json` and `tsconfig.build.json` (referenced by `tsup.config.ts`).
- PostCSS/Tailwind config: `postcss.config.mjs`.
- Library bundle config: `tsup.config.ts`.
- Storybook config: `.storybook/main.ts`, `.storybook/preview.ts`, `.storybook/manager.ts`.

## Platform Requirements

**Development:**
- Node.js + pnpm, with local dev entrypoints:
  - `pnpm dev` (Next.js + Turbopack),
  - `pnpm storybook`,
  - `pnpm test` / `pnpm test:coverage`.

**Production:**
- Vercel-oriented Next.js deployment (site metadata and deployment scripts point to Vercel/custom domain in `app/layout.tsx`, `app/sitemap.ts`, `scripts/launch-gate.ts`, `vercel-storybook.json`).

---

*Stack analysis: 2026-04-12*
