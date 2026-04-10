# Phase 36: Housekeeping & Carry-Overs - Research

**Researched:** 2026-04-10
**Domain:** Code quality baseline — Lighthouse audits, ESLint flat config, TypeScript strict fixes, test path hygiene
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Run fresh Lighthouse against signalframeux.vercel.app as the first task using existing `launch-gate.ts` (3-run worst-score, JSON output)
- Parse failing audits from the JSON output to identify specific Best Practices and SEO failures; fix, deploy, re-run — iterate until both hit 100/100, no cycle cap
- Accessibility already at 100 (confirmed in launch-gate-2026-04-10T18-09-10-797Z.json) — LH-02 carry-over is resolved
- ESLint: full stack strictness — eslint-config-next + @typescript-eslint/recommended-type-checked + style rules (import ordering, consistent type imports)
- Error-level from day 1 — no warn-level gradual adoption
- Initial cleanup: run `eslint --fix` for mechanical auto-fixable issues, then manually fix remaining violations
- One atomic cleanup commit — clean git blame boundary
- Config format: eslint.config.js (flat config, ESLint 9.x style)
- TypeScript strict fixes: fix 2 implicit `any[]` errors in `tests/phase-29-infra.spec.ts` (lines 117, 147)
- REQUIREMENTS.md update: append v1.6 requirement IDs under a new `## v1.6 API-Ready` section
- Vercel CLI: already at 50.43.0 — no action needed
- ROADMAP stale entries: verify completeness only (Phase 31 checkbox, Phase 35 checkbox + plan count, v1.5 milestone checkbox already corrected)

### Claude's Discretion
- Specific ESLint rule selection within the strict + style framework (import ordering plugin choice, etc.)
- Order of Lighthouse fix tasks (BP first vs SEO first vs interleaved)
- Whether to split Lighthouse fixes and ESLint setup into separate plans or combine

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CO-01 | Lighthouse Best Practices = 100 and SEO = 100 on signalframeux.vercel.app (3-run worst score) | Lighthouse audit workflow; specific audit categories and their common failure modes documented below |
| CO-02 | T-06 font-mono test path fixed — reads `components/blocks/api-explorer.tsx` not `app/reference/page.tsx` | Exact file paths and line confirmed in `tests/phase-35-reference.spec.ts:65` |
| CO-03 | ESLint config wired with `eslint-config-next` preset, `pnpm lint` passes clean | ESLint flat config + FlatCompat wrapper pattern for legacy config documented below |
| CO-04 | Toolchain currency verified — Vercel CLI at 50.43.0+, ROADMAP.md stale entries corrected | Vercel CLI already at 50.43.0 (pre-resolved); ROADMAP Phase 36 entry present |
</phase_requirements>

---

## Summary

Phase 36 is a housekeeping phase with four discrete, independent work streams: Lighthouse score remediation (Best Practices 96→100, SEO 91→100), a single-line test path fix (T-06), ESLint flat config bootstrap, and minor documentation/toolchain verification. No new dependencies are needed.

The critical technical finding is that `eslint-config-next` 15.5.14 ships in **legacy `.eslintrc` format** — not ESLint 9 flat config. Consuming it inside `eslint.config.js` requires the `FlatCompat` adapter from `@eslint/eslintrc`, which is already transitively present. The `@typescript-eslint` plugin 8.58.0 exposes native flat config entries under `configs['flat/recommended-type-checked']`, so the TypeScript rules side is clean. The planner should treat `FlatCompat` as the mandatory bridge for `eslint-config-next`.

The two TypeScript errors in `tests/phase-29-infra.spec.ts` are both on the same `nonGsapRafComponents` variable — fix is to annotate the empty array as `never[]` or `string[]`, which satisfies strict mode without changing behavior.

**Primary recommendation:** Implement in two plans — Plan A: Lighthouse + T-06 fixes (diagnostic-first loop); Plan B: ESLint config + TS strict fixes + REQUIREMENTS.md append + ROADMAP verification (all mechanical, no deployment dependency).

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| eslint | 9.39.4 | Linting engine | Already installed |
| eslint-config-next | 15.5.14 | Next.js opinionated ruleset | Already installed; bundles react, react-hooks, jsx-a11y, import, @typescript-eslint/parser |
| @typescript-eslint/eslint-plugin | 8.58.0 | TypeScript-aware lint rules | Already installed transitively |
| @typescript-eslint/parser | 8.58.0 | TypeScript AST parser for ESLint | Already installed transitively |
| @eslint/eslintrc | 3.3.5 | FlatCompat adapter for legacy configs | Already installed transitively — **required** to use eslint-config-next in flat config |
| lighthouse | 13.1.0 | Lighthouse runner | Already installed; `scripts/launch-gate.ts` wraps it |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| eslint-plugin-import | 2.32.0 | Import order / no-unresolved rules | Already transitively installed; wire via FlatCompat or directly |
| eslint-import-resolver-typescript | 3.10.1 | Resolves TS path aliases for import plugin | Already transitively installed |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| FlatCompat wrapper for eslint-config-next | Native flat config built from scratch | eslint-config-next wraps @rushstack/eslint-patch for dep resolution; rebuilding from scratch duplicates that work and may drift from Next.js defaults |
| `never[]` annotation on empty array | `string[]` annotation | Both fix TS7034; `never[]` is more precise for a documented-empty array |

**Installation:** No new installs required. All packages are already present.

---

## Architecture Patterns

### Recommended eslint.config.js Structure

The only viable pattern for this codebase is FlatCompat wrapping eslint-config-next plus native `@typescript-eslint` flat config spreads:

```javascript
// Source: @eslint/eslintrc FlatCompat docs + @typescript-eslint/eslint-plugin dist/configs/flat/
import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

/** @type {import("eslint").Linter.Config[]} */
const config = [
  // eslint-config-next via compat adapter (legacy format → flat)
  ...compat.extends("next/core-web-vitals"),

  // TypeScript files: @typescript-eslint strict
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: { "@typescript-eslint": tsPlugin },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // recommended-type-checked rules (error level)
      ...tsPlugin.configs["flat/recommended-type-checked"].rules,
      // Style rules (Claude's discretion)
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "no-restricted-imports": "off",
    },
  },

  // Ignore patterns
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "public/**",
      ".planning/**",
    ],
  },
];

export default config;
```

**Key structural notes:**
- `FlatCompat` requires `baseDirectory` pointing to project root for plugin resolution
- `compat.extends("next/core-web-vitals")` is preferred over `"next"` — it adds CWV rules on top of base
- `project: true` in parserOptions tells `@typescript-eslint` to use the nearest `tsconfig.json`
- `tsconfig.json` excludes `.planning/` and `templates/` — those files won't be type-checked by ESLint either

### Pattern: package.json lint script

The existing `"lint": "next lint"` script uses Next.js's built-in lint runner which expects `.eslintrc` format by default. Replace with:

```json
"lint": "eslint ."
```

This calls ESLint 9 directly and picks up `eslint.config.js`.

**Note:** `next lint` in Next.js 15 detects `eslint.config.js` and delegates to ESLint 9 directly, so either form works. Using `eslint .` directly is cleaner and removes Next.js indirection.

### Pattern: TypeScript strict fix (lines 117 + 147)

```typescript
// Before (phase-29-infra.spec.ts:117)
const nonGsapRafComponents = [

// After — annotate the empty array
const nonGsapRafComponents: never[] = [
```

`never[]` is correct because the array is intentionally always empty (purely documentary). This satisfies both TS7034 (implicit any[] in certain locations) and TS7005 (implicit any[] type on use at line 147).

### Pattern: T-06 test path fix

```typescript
// Before (tests/phase-35-reference.spec.ts:65)
const src = readFileSync(join(process.cwd(), "app/reference/page.tsx"), "utf-8");

// After
const src = readFileSync(join(process.cwd(), "components/blocks/api-explorer.tsx"), "utf-8");
```

Single-line change. No other assertions in that test block need updating — the `expect(src).toMatch(/font-mono/)` assertion remains correct.

### Anti-Patterns to Avoid
- **Using `next lint` to run the flat config**: While it works in Next.js 15.5.x, using `eslint .` directly is more explicit and portable
- **Putting `project: true` in the global config spread**: Type-aware rules only work on `.ts`/`.tsx` files — applying to all files causes errors on `.js`/`.cjs` files
- **Using `recommended-type-checked` for test files**: Tests often contain intentional patterns that strict type-checking flags. Consider a separate, relaxed config spread for `tests/**/*.ts`
- **`@typescript-eslint/no-explicit-any` at error level**: `launch-gate.ts` already has `// eslint-disable-next-line @typescript-eslint/no-explicit-any` comments by design — keep those or add an ignore for `scripts/`

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Legacy config compatibility | Custom plugin re-export shim | `FlatCompat` from `@eslint/eslintrc` | FlatCompat handles @rushstack/eslint-patch resolution that eslint-config-next depends on |
| Lighthouse 3-run worst-score | New script | `scripts/launch-gate.ts` | Already implements the exact methodology; reuse directly |
| TypeScript parser config | Manual parser wiring | `@typescript-eslint/parser` flat config spread | Handles JSX, decorators, paths automatically |

---

## Common Pitfalls

### Pitfall 1: eslint-config-next is NOT a flat config
**What goes wrong:** Importing `eslint-config-next` directly in `eslint.config.js` via `import nextConfig from "eslint-config-next"` fails or produces malformed config — it exports a legacy `{ rules, parser, overrides }` object, not a flat config array.
**Why it happens:** `eslint-config-next` still uses `@rushstack/eslint-patch` for plugin resolution, which is a CommonJS require() monkey-patch incompatible with ESM flat config.
**How to avoid:** Always wrap via `compat.extends("next/core-web-vitals")` — FlatCompat handles the resolution correctly.
**Warning signs:** ESLint errors about `parser` being an unknown property, or `overrides` not being supported in flat config.

### Pitfall 2: Type-aware rules require tsconfig project reference
**What goes wrong:** `@typescript-eslint/recommended-type-checked` rules (e.g. `no-floating-promises`, `no-unsafe-assignment`) fail with "parserOptions.project must be set" error.
**Why it happens:** Type-aware rules require TypeScript's type information, which needs a tsconfig.
**How to avoid:** Set `parserOptions: { project: true, tsconfigRootDir: __dirname }` in the TypeScript files config spread.
**Warning signs:** ESLint error: "You have used a rule which requires type information, but don't have parserOptions set to generate type information for this rule."

### Pitfall 3: `.planning/` files cause TSConfig parse errors
**What goes wrong:** ESLint tries to lint `.planning/` markdown/JSON/YAML files and fails to parse them.
**Why it happens:** `tsconfig.json` excludes `.planning/` from TypeScript compilation, but ESLint's glob `**` sweeps it unless explicitly ignored.
**How to avoid:** Add `.planning/**` to the `ignores` array in `eslint.config.js`.
**Warning signs:** ESLint errors on `.md` files or YAML files in `.planning/`.

### Pitfall 4: Lighthouse Best Practices failures — common causes at 96
**What goes wrong:** Best Practices score is 96 (not 100).
**Why it happens at 96:** A 4-point deficit at the 96 level typically means 1 failing audit. Common culprits (as of lighthouse@13 scoring):
  - `no-unload-listeners`: `beforeunload` or `unload` event listeners (deprecated, causes BFCache prevention)
  - `uses-http2`: Resources served over HTTP/1.1 (unlikely on Vercel)
  - Deprecated JavaScript APIs in any loaded script
  - Third-party cookies (unlikely — no analytics configured)
**How to avoid:** Run `launch-gate.ts` and inspect the `fullLhr[0].audits` object in the JSON output for `best-practices` category entries with score < 1.
**Warning signs:** launch-gate JSON `worst.best-practices === 96` across all 3 runs.

### Pitfall 5: Lighthouse SEO failures — common causes at 91
**What goes wrong:** SEO score is 91 (not 100).
**Why it happens at 91:** A 9-point deficit can mean 1-2 failing audits. Common culprits:
  - Missing `canonical` link on subpages (`/init`, `/inventory`, `/reference`, `/system`)
  - `meta description` present on homepage but missing or too long on subpages
  - `hreflang` not set (low likelihood without i18n)
  - Crawlable links: `<a>` tags without href or with javascript: hrefs
  - `robots.txt` inaccessible or blocking crawl
**How to avoid:** Run `launch-gate.ts` and inspect `fullLhr[0].audits['seo']` category. Also check `document-title`, `meta-description`, `link-text`, `canonical` audit entries.
**Warning signs:** Phase 35-03 added `metadataBase` — verify canonical is being generated by Next.js metadata API for all 5 routes.

### Pitfall 6: `pnpm lint` runs `next lint` not `eslint .`
**What goes wrong:** `pnpm lint` runs the old `next lint` script which may not pick up `eslint.config.js` as expected, or may run a different ESLint instance.
**How to avoid:** Update `package.json` `scripts.lint` from `"next lint"` to `"eslint ."` after creating `eslint.config.js`.

---

## Code Examples

### FlatCompat instantiation (project-specific)
```javascript
// Source: @eslint/eslintrc 3.3.5 API
import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,           // required: plugin resolution root
  recommendedConfig: { rules: {} },   // optional: suppress "recommended config not found" warnings
});
```

### @typescript-eslint flat/recommended-type-checked reference
```javascript
// Source: @typescript-eslint/eslint-plugin 8.58.0 dist/configs/flat/
// Access pattern confirmed via node -e inspection
import tsPlugin from "@typescript-eslint/eslint-plugin";

// Available flat config keys (confirmed):
// flat/recommended, flat/recommended-type-checked, flat/strict, flat/strict-type-checked
// flat/stylistic, flat/stylistic-type-checked, flat/disable-type-checked

const typeCheckedRules = tsPlugin.configs["flat/recommended-type-checked"].rules;
```

### launch-gate.ts usage (existing script)
```bash
# Run against deployed URL (no server needed)
pnpm tsx scripts/launch-gate.ts --url https://signalframeux.vercel.app

# Parse full audit details from output JSON
# Output is written to .planning/phases/35-performance-launch-gate/launch-gate-<timestamp>.json
# Access: .fullLhr[0].audits (first run's full audit data)
# Key paths: .categories['best-practices'].auditRefs, .categories['seo'].auditRefs
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `.eslintrc.json` / `.eslintrc.js` (legacy format) | `eslint.config.js` (flat config) | ESLint 9.0 (2024) — flat config is now the only officially supported format | eslint-config-next 15.5.14 still ships legacy format; FlatCompat adapter required |
| `next lint` as the lint command | `eslint .` direct invocation | ESLint 9 + flat config era | `next lint` works but adds Next.js mediation layer |

**Deprecated/outdated:**
- `.eslintrc.*` files: ESLint 9 still supports them via compatibility layer but they are no longer the canonical format. Do not create new `.eslintrc` files.
- `@typescript-eslint/recommended-requiring-type-checking` config name: Renamed to `recommended-type-checked` in typescript-eslint v6+. The old name is still exported as an alias but `recommended-type-checked` (or `flat/recommended-type-checked`) is canonical.

---

## Open Questions

1. **Specific Lighthouse BP/SEO audit failures**
   - What we know: BP=96 (4pts), SEO=91 (9pts) as of last run. Phase 35-03 added metadataBase and OG image.
   - What's unclear: Whether Phase 35-03 already pushed SEO above 91 on the currently-deployed URL, and which specific audits are failing.
   - Recommendation: First task of Lighthouse plan is to run launch-gate.ts fresh and parse the fullLhr JSON. Do not attempt fixes without reading the actual audit failures.

2. **ESLint violations count after initial `--fix`**
   - What we know: TypeScript strict mode is enabled, 2 known TS errors in test files. ESLint config-next adds React/hooks/import/a11y rules.
   - What's unclear: How many non-auto-fixable violations exist across the ~50 source files. `launch-gate.ts` uses `// eslint-disable-next-line` already — those should survive.
   - Recommendation: Run `eslint . --fix` first, then `eslint .` to count remaining violations. Scope the manual fix commit accordingly.

3. **`next lint` vs `eslint .` in package.json**
   - What we know: Current `"lint": "next lint"` works. Next.js 15 detects flat config.
   - What's unclear: Whether `next lint` with flat config shows identical output to `eslint .` or adds Next.js-specific noise.
   - Recommendation: Switch to `"eslint ."` for clarity and portability. If CI uses `pnpm lint`, update scripts accordingly.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright 1.59.1 |
| Config file | `playwright.config.ts` (root) |
| Quick run command | `pnpm exec playwright test tests/phase-35-reference.spec.ts` |
| Full suite command | `pnpm exec playwright test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CO-01 | Lighthouse BP=100, SEO=100 (3-run worst) | manual/script | `pnpm tsx scripts/launch-gate.ts --url https://signalframeux.vercel.app` | ✅ `scripts/launch-gate.ts` |
| CO-02 | T-06: font-mono test reads correct file path | unit (source-read) | `pnpm exec playwright test tests/phase-35-reference.spec.ts -g "font-mono"` | ✅ `tests/phase-35-reference.spec.ts:62` |
| CO-03 | `pnpm lint` exits 0 (no violations) | toolchain | `pnpm lint` | ❌ Wave 0: `eslint.config.js` must be created |
| CO-04 | Vercel CLI at 50.42.0+, ROADMAP verified | manual verify | `vercel --version` | N/A — already satisfied |

### Sampling Rate
- **Per task commit:** `pnpm exec playwright test tests/phase-35-reference.spec.ts` (covers T-06 verification) + `pnpm lint` (after CO-03 config exists)
- **Per wave merge:** `pnpm exec playwright test` (full suite)
- **Phase gate:** Lighthouse 100/100 + full suite green before `/pde:verify-work`

### Wave 0 Gaps
- [ ] `eslint.config.js` — covers CO-03; must exist before `pnpm lint` can run

---

## Sources

### Primary (HIGH confidence)
- Local filesystem inspection — `eslint-config-next` 15.5.14 `index.js` read directly: exports legacy `.eslintrc` format (CommonJS object with `rules`, `parser`, `overrides`). Not flat config compatible without FlatCompat.
- Local filesystem inspection — `@typescript-eslint/eslint-plugin` 8.58.0: `configs['flat/recommended-type-checked']` confirmed available via `node -e` inspection.
- Local filesystem inspection — `@eslint/eslintrc` 3.3.5: `FlatCompat` confirmed exported and functional.
- `tsc --noEmit` output: exactly 2 errors at `tests/phase-29-infra.spec.ts` lines 117 and 147 (TS7034, TS7005).
- `.planning/phases/35-performance-launch-gate/launch-gate-2026-04-10T18-09-10-797Z.json`: worst scores confirmed as performance=78, accessibility=100, best-practices=96, seo=91.

### Secondary (MEDIUM confidence)
- Lighthouse 13 audit scoring: Best Practices 4-point deficit = 1 audit at standard weight. Common culprits sourced from Lighthouse changelog and audit descriptions embedded in LHR JSON structure.

### Tertiary (LOW confidence)
- SEO audit failure hypotheses (canonical, meta-description): Based on known Next.js metadata API behavior and typical SEO audit failures. Requires fresh run to confirm.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages inspected directly in node_modules, no guessing
- Architecture (ESLint flat config): HIGH — FlatCompat pattern confirmed against actual package contents
- Pitfalls: HIGH for ESLint (confirmed from package inspection); MEDIUM for Lighthouse failure causes (need fresh run to confirm specifics)
- TypeScript fixes: HIGH — `tsc --noEmit` confirms exact error locations

**Research date:** 2026-04-10
**Valid until:** 2026-05-10 (stable — `eslint-config-next` format changes are rare, tied to Next.js major versions)
