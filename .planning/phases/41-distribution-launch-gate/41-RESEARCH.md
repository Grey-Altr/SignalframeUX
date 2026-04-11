# Phase 41: Distribution & Launch Gate - Research

**Researched:** 2026-04-10
**Domain:** npm package publishing, consumer integration testing, semver/changelog, Lighthouse gate
**Confidence:** HIGH

## Summary

Phase 41 is pure verification and distribution packaging — no new components, no build pipeline changes. The library build is already complete: `dist/` exists with ESM+CJS+declarations for all three entry points. The existing `prepublishOnly` chain (`pnpm build:lib && verify-tree-shake.ts`) is the correct hook point for new bundle-size and source-map verification steps.

Four concrete artifacts are needed: (1) source map exclusion from the published tarball via `.npmignore`, (2) `package.json` `"files"` field expanded to include `README.md`, `LICENSE`, `CHANGELOG.md`, `MIGRATION.md`, (3) two new scripts — `scripts/consumer-test.ts` (Next.js 16 integration test) and `scripts/verify-bundle-size.ts` (gzip gate), and (4) `LICENSE` and `CHANGELOG.md` created from scratch.

The current gzip footprint is already 28.3 KB total across all entry points + CSS, well under the 50 KB gate. The current `npm pack --dry-run` includes source maps (714 KB of the 1.22 MB unpacked), which violates D-02 and must be fixed before publish.

**Primary recommendation:** Use `.npmignore` with a `dist/*.map` glob to exclude source maps from the tarball. This is simpler and more reliable than trying to filter inside `tsup.config.ts` (which would break local dev DX per D-02).

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Publish Packaging**
- D-01: Package name remains `signalframeux` (unscoped) — already in package.json, simpler imports
- D-02: Source maps excluded from npm tarball — smaller package, no internal code exposure. Source maps remain in `dist/` for local dev but are filtered from the published package
- D-03: Published tarball includes: `dist/`, `README.md`, `LICENSE`, `CHANGELOG.md`, `MIGRATION.md`
- D-04: License is MIT
- D-05: `"files"` field in package.json updated to include the four extra files alongside `dist/`

**Consumer Integration Test**
- D-06: Automated script (`scripts/consumer-test.ts` or similar) — creates a temp Next.js 16 app, installs the local SFUX tarball via `npm pack`, renders components, runs `next build`, asserts exit 0
- D-07: Broader surface test covering all three entry points: layout primitives (SFSection, SFGrid), interactive components (SFAccordion, SFToast), core (SFButton, SFCard), a hook (useSignalframe), and token CSS import — 6-8 components total
- D-08: Test validates: imports resolve, TypeScript compiles, `next build` succeeds, token CSS custom properties are present

**Versioning & Changelog**
- D-09: First publish version is `0.1.0` (pre-release) — signals usable but API may change. Graduate to 1.0.0 after real consumer feedback
- D-10: CHANGELOG format follows Keep a Changelog (keepachangelog.com) — sections: Added, Changed, Deprecated, Removed, Fixed, Security
- D-11: Single semver version for the whole package. CHANGELOG notes which entry point(s) are affected by breaking changes

**Final Quality Gate**
- D-12: Distributed package bundle size verified by automated script — gzip each `dist/` entry point, sum sizes, assert < 50KB total (excluding peer deps). Runs as part of prepublishOnly or standalone
- D-13: Lighthouse 100/100 verification reuses existing `scripts/launch-gate.ts` from Phase 35 — same script, fresh run against deployed site after all v1.6 changes
- D-14: All E2E tests (18+ Playwright) + Vitest unit tests + axe-core must pass before publish gate clears

### Claude's Discretion

- Consumer test script implementation details (temp directory management, cleanup, component selection within the 6-8 range)
- CHANGELOG content for 0.1.0 (summarize v1.0-v1.6 work or just document the initial public release)
- Bundle size script implementation (inline in prepublishOnly vs standalone script)
- Whether to add a `publish` npm script or rely on manual `npm publish`

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DIST-01 | `npm publish --dry-run` succeeds with correct package contents (no source maps, no test files) | `.npmignore` pattern for `dist/*.map`, `"files"` field expansion, verified with `npm pack --dry-run --json` |
| DIST-02 | Fresh Next.js 16 app installs SFUX, renders 3+ SF components with token CSS — builds without errors | `consumer-test.ts` script: `npm pack` → temp dir → Next.js 16 app → `next build` → assert exit 0 |
| DIST-03 | CHANGELOG.md and semver version strategy documented | Keep a Changelog format, `0.1.0` initial entry, MIT LICENSE file |
| DIST-04 | Lighthouse 100/100 all categories on deployed site (post all v1.6 changes) | Reuse `scripts/launch-gate.ts` — already built and working |
</phase_requirements>

---

## Standard Stack

### Core
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| npm pack | npm 10.8.2 (Node 20 LTS) | Creates tarball for dry-run and consumer test | Native npm feature, no extra deps |
| .npmignore | — | Exclude source maps from published tarball | Standard npm pattern; overrides `files` field for negation |
| `node:zlib` createGzip | built-in | Gzip measurement in verify-bundle-size.ts | Zero new deps; already used in Node ecosystem |
| tsx | already in devDeps (via tsup chain) | Run TypeScript scripts | Already in use for all other scripts |

### Supporting
| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| execSync / execFileSync | node built-in | Run `npm pack`, `next build` in consumer test | Use `execFileSync` per project security conventions (STATE.md Phase 40 note) |
| Keep a Changelog format | keepachangelog.com | CHANGELOG.md structure | D-10 locked decision |
| `scripts/launch-gate.ts` | existing | Lighthouse 3-run worst-score gate | Reuse as-is for DIST-04 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `.npmignore` glob `dist/*.map` | `tsup` `sourcemap: false` | tsup false breaks local dev DX (D-02 explicitly retains maps locally) |
| `.npmignore` | `files` field exclusion | `files` field is an allowlist — you cannot negate inside it. `.npmignore` can deny what `files` would include |

**Installation:** No new dependencies required for this phase.

---

## Architecture Patterns

### DIST-01: Source Map Exclusion Pattern

**What:** npm publishes what's in `"files"` UNLESS `.npmignore` further restricts it. `.npmignore` patterns are applied *after* `"files"` allowlist — they can exclude files that `"files"` would include.

**Mechanism:** Add `.npmignore` at project root with `dist/*.map`. This removes all `.cjs.map` and `.mjs.map` files from the tarball while keeping the `dist/` folder otherwise intact.

```
# .npmignore
dist/*.map
```

**Verify:** `npm pack --dry-run --json | python3 -c "import json,sys; d=json.load(sys.stdin)[0]; maps=[f for f in d['files'] if f['path'].endswith('.map')]; print('Maps in tarball:', len(maps))"` — should print 0.

**Current state (PROBLEM):** `npm pack --dry-run` currently includes 6 source map files totaling 714 KB of the 1.22 MB unpacked size. This violates D-02 and must be fixed.

### DIST-01: `"files"` Field Expansion

Current `package.json` `"files"` field only includes `"dist"`. Must add:
```json
"files": [
  "dist",
  "README.md",
  "LICENSE",
  "CHANGELOG.md",
  "MIGRATION.md"
]
```

Note: `package.json` itself is always included by npm regardless of `"files"` — no need to list it.

### DIST-02: Consumer Test Script Pattern

**Structure:**
```
scripts/consumer-test.ts
  1. Build tarball: execFileSync('npm', ['pack', '--pack-destination', tmpDir])
  2. Create temp Next.js 16 app in a system temp directory (os.tmpdir())
  3. Write package.json + next.config.ts + pages using all 3 entry points
  4. npm install tarball + next@16
  5. execFileSync('npm', ['run', 'build'])
  6. Assert exit code 0
  7. Parse .next/build-manifest.json (or check for no error output)
  8. Cleanup temp dir in finally block
```

**Component coverage for D-07 (6-8 components across all 3 entry points):**
- Core: `SFButton`, `SFCard`, `SFSection`, `SFGrid`, `useSignalframe`
- Animation: `SFAccordion`, `SFToaster` (covers `sfToast`)
- WebGL: `SignalCanvas` (or type-only import if WebGL context unavailable in CI)
- CSS: `import 'signalframeux/signalframeux.css'`

**D-08 validations:**
- TypeScript compiles — `next build` runs `tsc` as part of Next.js build
- Imports resolve — if any import fails, `next build` exits non-zero
- Token CSS present — read the built CSS or verify `.css` import doesn't throw

**Temp directory pattern:**
```typescript
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const tmp = mkdtempSync(join(tmpdir(), 'sfux-consumer-'));
try {
  // ... test logic
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
```

### DIST-02: Consumer App Structure (minimal Next.js 16)

The consumer app written into the temp dir needs:
```
consumer-app/
  package.json        # next@^16, react@^19, react-dom@^19, signalframeux@file:../tarball.tgz
  next.config.ts      # minimal — no special config needed
  tsconfig.json       # extends: next/tsconfig (or minimal paths config)
  app/
    layout.tsx        # root layout, import signalframeux/signalframeux.css
    page.tsx          # renders 6-8 components from all 3 entry points
```

**Key pitfall for Next.js 16 + RSC:** Components from `signalframeux` animation entry use `'use client'` directives — the consumer test must wrap them in client boundary or import them in a `'use client'` file. The test app's `page.tsx` should be a Client Component (`'use client'`) to avoid RSC prop-serialization issues.

### DIST-03: CHANGELOG.md Format

Per Keep a Changelog (keepachangelog.com) and D-10:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-04-10

### Added
- Initial public release of SignalframeUX design system
- Core entry point (`signalframeux`): 49 SF components, layout primitives, hooks, utilities
- Animation entry point (`signalframeux/animation`): GSAP-dependent components (SFAccordion, SFProgress, SFStepper, SFEmptyState, SFToaster)
- WebGL entry point (`signalframeux/webgl`): Three.js-dependent modules (SignalCanvas, useSignalScene, resolveColorToken)
- Token CSS (`signalframeux/signalframeux.css`): OKLCH design token stylesheet
- FRAME/SIGNAL dual-layer architecture with full TypeScript declarations

[0.1.0]: https://github.com/[org]/signalframeux/releases/tag/v0.1.0
```

### DIST-04: Lighthouse Gate Pattern (already built)

`scripts/launch-gate.ts` runs Lighthouse 3 times, takes worst score per category, exits non-zero if any < 100. Reuse exactly. The script accepts `--url` or `VERCEL_PREVIEW_URL` env var.

The Phase 36 fix (removed `headers()` from `layout.tsx`, fixed CSP nonce issue) should maintain 100/100. Verify against the production URL: `https://signalframe.culturedivision.com` (STATE.md confirms this is the production domain).

### DIST-12: Bundle Size Script Pattern

```typescript
// scripts/verify-bundle-size.ts
import { createReadStream } from 'fs';
import { createGzip } from 'zlib';
import { resolve } from 'path';

const BUDGET_BYTES = 50 * 1024; // 50 KB gzip
const ENTRY_POINTS = [
  'dist/index.mjs',
  'dist/animation.mjs',
  'dist/webgl.mjs',
  'dist/signalframeux.css',
];

async function gzipSize(filepath: string): Promise<number> { ... }

const total = await Promise.all(ENTRY_POINTS.map(gzipSize)).then(sizes => sizes.reduce((a, b) => a + b, 0));
if (total > BUDGET_BYTES) { process.exit(1); }
```

**Current baseline:** 28.3 KB gzip total (19.1 KB index.mjs + 4.5 KB animation.mjs + 2.2 KB webgl.mjs + 3.1 KB CSS). 21.7 KB headroom to budget.

### Anti-Patterns to Avoid

- **Don't add `sourcemap: false` to tsup.config.ts** — this breaks local dev DX. D-02 explicitly says maps stay in `dist/` locally; only filter for publish.
- **Don't use `npm publish` in consumer test** — use `npm pack` to create tarball, install tarball via `file:` reference. This tests exact publish artifact without actually publishing.
- **Don't use `execSync` for external commands in scripts** — use `execFileSync` per STATE.md Phase 40 security convention.
- **Don't skip `--dry-run` verification** — `npm pack --dry-run --json` is the ground truth for what consumers get.
- **Don't install Next.js 16 in consumer test as a devDep** — the test creates an isolated temp app; its own `package.json` lists `next@^16` as a dependency.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Source map exclusion | Custom tsup post-processing | `.npmignore` glob | Standard npm mechanism, one line |
| Gzip measurement | External gzip binary | `node:zlib` createGzip pipe | Built-in, no new deps, works in any environment |
| Temp dir creation | Custom temp path generator | `os.tmpdir()` + `fs.mkdtempSync` | Race-condition-safe by spec |
| Tarball installation in consumer test | Publishing to local npm registry (Verdaccio) | `npm install file:../sfux-0.1.0.tgz` | Verdaccio is massive overhead; `file:` tarball install is identical to what consumers get from registry |

---

## Common Pitfalls

### Pitfall 1: `"files"` field cannot negate
**What goes wrong:** Trying to add `"!dist/*.map"` inside the `"files"` array — npm ignores negation patterns inside `"files"`.
**Why it happens:** `"files"` is a pure allowlist; negation is not supported.
**How to avoid:** Use `.npmignore` for exclusions within an included directory. `.npmignore` takes precedence over `"files"` for files within matched paths.
**Warning signs:** `npm pack --dry-run` still shows `.map` files despite adding negation to `"files"`.

### Pitfall 2: Consumer test `next build` requires `next` in consumer app's own `package.json`
**What goes wrong:** Consumer script installs tarball but forgets to add `next@^16` to the temp app's `package.json`, causing `next build` command to fail with "next: command not found".
**Why it happens:** The script creates a fresh npm project; nothing inherits from the workspace.
**How to avoid:** Explicitly write `next`, `react`, `react-dom`, and the SFUX tarball into the temp app's `package.json` before running `npm install`.

### Pitfall 3: RSC incompatibility in consumer test page
**What goes wrong:** Consumer test page imports animation entry components (SFAccordion, SFToaster) in a Server Component — Next.js throws about non-serializable props or missing `'use client'` boundary.
**Why it happens:** Animation entry components use GSAP hooks that require client context.
**How to avoid:** Make the consumer test's `page.tsx` a Client Component (`'use client'` directive at top), or put animation imports in a separate client island.

### Pitfall 4: Source maps still present after `.npmignore` due to tarball caching
**What goes wrong:** Running `npm pack --dry-run` after adding `.npmignore` still shows map files because of npm cache.
**Why it happens:** npm can cache pack operations.
**How to avoid:** Always verify with `npm pack --dry-run --json` and check the `files` array programmatically. If in doubt, delete `node_modules/.cache/`.

### Pitfall 5: `launch-gate.ts` writes audit to Phase 35 directory
**What goes wrong:** The existing `launch-gate.ts` hardcodes the output path to `.planning/phases/35-performance-launch-gate/`. This directory exists, but the Phase 41 run should ideally write to Phase 41's directory.
**Why it happens:** Path is hardcoded on line 95 of `scripts/launch-gate.ts`.
**How to avoid:** Either pass a `--out-dir` arg or accept the existing behavior (Phase 35 dir still exists, audit is still written). D-13 says "same script" — no code change required. The audit file location is cosmetic.

### Pitfall 6: `tsx` vs native ESM for scripts
**What goes wrong:** `scripts/launch-gate-runner.mjs` exists because `tsx` CJS/ESM interop breaks `lighthouse@13` (STATE.md Phase 36 note: `fileURLToPath(import.meta.url)` inside lighthouse fails under tsx transform).
**Why it happens:** lighthouse@13 is ESM; tsx uses CJS transform by default.
**How to avoid:** New scripts (`consumer-test.ts`, `verify-bundle-size.ts`) should use `tsx` directly (they don't import lighthouse). Only the launch-gate runner needs the `.mjs` workaround — and it already exists.

---

## Code Examples

### Source Map Exclusion (.npmignore)
```
# .npmignore — exclude source maps from published tarball
# Source maps remain in dist/ for local development (D-02)
dist/*.map
```

### Bundle Size Gate (scripts/verify-bundle-size.ts)
```typescript
// Source: Node.js built-in zlib, project pattern from verify-tree-shake.ts
import { createReadStream } from "fs";
import { createGzip } from "zlib";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BUDGET_KB = 50;
const BUDGET_BYTES = BUDGET_KB * 1024;

const ENTRY_POINTS = [
  "dist/index.mjs",
  "dist/animation.mjs",
  "dist/webgl.mjs",
  "dist/signalframeux.css",
];

function gzipSize(filepath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    let size = 0;
    createReadStream(filepath)
      .pipe(createGzip())
      .on("data", (chunk: Buffer) => { size += chunk.length; })
      .on("end", () => resolve(size))
      .on("error", reject);
  });
}

const sizes = await Promise.all(ENTRY_POINTS.map(f => gzipSize(resolve(ROOT, f))));
const total = sizes.reduce((a, b) => a + b, 0);
const totalKB = (total / 1024).toFixed(1);

console.log("=== SignalframeUX Bundle Size Gate ===\n");
ENTRY_POINTS.forEach((f, i) => {
  const kb = (sizes[i] / 1024).toFixed(1);
  console.log(`  ${f.padEnd(30)} ${kb.padStart(6)} KB gzip`);
});
console.log(`\n  TOTAL: ${totalKB} KB gzip (budget: ${BUDGET_KB} KB)`);

if (total > BUDGET_BYTES) {
  console.error(`FAIL: ${totalKB} KB exceeds ${BUDGET_KB} KB budget`);
  process.exit(1);
}
console.log(`PASS: within budget (${(BUDGET_KB - total / 1024).toFixed(1)} KB headroom)`);
```

### Consumer Test — Temp App package.json Template
```json
{
  "name": "sfux-consumer-test",
  "version": "1.0.0",
  "private": true,
  "scripts": { "build": "next build" },
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "signalframeux": "file:../signalframeux-0.1.0.tgz",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.0.2",
    "lucide-react": "^0.488.0",
    "gsap": "^3.12.0",
    "@gsap/react": "^2.0.0",
    "three": "^0.183.0"
  }
}
```

### Consumer Test — page.tsx Template (Client Component for RSC safety)
```tsx
'use client';
// Covers D-07: all 3 entry points + token CSS + hook
import 'signalframeux/signalframeux.css';
import { SFButton, SFCard, SFSection, SFGrid, useSignalframe, createSignalframeUX } from 'signalframeux';
import { SFAccordion, SFAccordionItem, SFAccordionTrigger, SFAccordionContent, SFToaster } from 'signalframeux/animation';
// WebGL: import type only to avoid Three.js context in build environment
import type { SignalCanvas } from 'signalframeux/webgl';

export default function TestPage() {
  const config = createSignalframeUX({ signalIntensity: 0.5 });
  return (
    <SFSection>
      <SFGrid cols={2}>
        <SFCard>
          <SFButton>Test Button</SFButton>
        </SFCard>
        <SFAccordion type="single">
          <SFAccordionItem value="a">
            <SFAccordionTrigger>Trigger</SFAccordionTrigger>
            <SFAccordionContent>Content</SFAccordionContent>
          </SFAccordionItem>
        </SFAccordion>
      </SFGrid>
      <SFToaster />
    </SFSection>
  );
}
```

### prepublishOnly Chain (updated)
```json
"prepublishOnly": "pnpm build:lib && npx tsx scripts/verify-tree-shake.ts && npx tsx scripts/verify-bundle-size.ts"
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `sourcemap: false` in bundler config | `.npmignore dist/*.map` | npm 3+ | Keeps maps for local dev, strips from publish |
| Verdaccio local registry for consumer tests | `npm pack` + `file:` tarball install | npm 5+ | Zero infrastructure needed |
| `execSync` for shell commands | `execFileSync` | Node.js security best practice | Avoids shell injection, per project convention |

---

## Open Questions

1. **WebGL import in consumer test — runtime vs type-only**
   - What we know: `SignalCanvas` requires a browser WebGL context; `next build` only does static analysis + SSR simulation; Three.js is an external peer dep
   - What's unclear: Whether `import { SignalCanvas } from 'signalframeux/webgl'` causes build failure if `three` peer is installed but no WebGL context is available
   - Recommendation: Import `SignalCanvas` normally (not type-only) but don't render it — just reference it in JSX without mounting. The peer dep is in the consumer app's package.json so the import resolves. D-07 says "validates: imports resolve, TypeScript compiles" — rendering is not required for the WebGL entry.

2. **Radix UI peer deps in consumer test**
   - What we know: `tsup.config.ts` externalizes all `@radix-ui/*` packages; the core entry point has no bundled Radix code
   - What's unclear: Whether consumers must explicitly install Radix primitives or whether they're transitively available via `radix-ui` umbrella package
   - Recommendation: Add `"radix-ui": "^1.4.3"` to the consumer test's package.json alongside other deps. This matches what the SFUX package.json lists under `dependencies`.

3. **CHANGELOG summary depth for 0.1.0**
   - What we know: D-09 says first publish is 0.1.0 pre-release; D-10 says Keep a Changelog format
   - What's unclear: Should the 0.1.0 entry document v1.0 through v1.6 internal milestones or just document the initial public release surfaces (3 entry points + token CSS)
   - Recommendation: Document only the public API surface (what consumers can import). Internal v1.0-v1.6 milestones are project history, not changelog entries. The audience is external consumers.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.4 + Playwright 1.59.1 |
| Config file | `vitest.config.ts` / `playwright.config.ts` |
| Quick run command | `pnpm test` (Vitest unit tests) |
| Full suite command | `pnpm test && pnpm exec playwright test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DIST-01 | `npm pack --dry-run` contains no `.map` files, contains LICENSE/CHANGELOG/MIGRATION | unit/script | `npx tsx scripts/verify-bundle-size.ts` + manual `npm pack --dry-run --json` check | ❌ Wave 0 — `scripts/verify-bundle-size.ts` |
| DIST-02 | Fresh Next.js 16 app installs SFUX, `next build` exits 0 | integration | `npx tsx scripts/consumer-test.ts` | ❌ Wave 0 — `scripts/consumer-test.ts` |
| DIST-03 | CHANGELOG.md exists in Keep a Changelog format, LICENSE exists (MIT) | manual | `ls CHANGELOG.md LICENSE` | ❌ Wave 0 — both files |
| DIST-04 | Lighthouse 100/100 all categories on deployed site | advisory/manual | `npx tsx scripts/launch-gate.ts --url https://signalframe.culturedivision.com` | ✅ `scripts/launch-gate.ts` exists |

### Sampling Rate
- **Per task commit:** `pnpm test` (Vitest unit tests — fast, < 30s)
- **Per wave merge:** `pnpm test && npx tsx scripts/verify-tree-shake.ts && npx tsx scripts/verify-bundle-size.ts`
- **Phase gate:** `npm pack --dry-run` shows correct contents + consumer test passes + Lighthouse 100/100 + all 18+ E2E pass

### Wave 0 Gaps
- [ ] `scripts/consumer-test.ts` — covers DIST-02
- [ ] `scripts/verify-bundle-size.ts` — covers DIST-01 (size gate component)
- [ ] `LICENSE` — covers DIST-01 (tarball contents) + DIST-03
- [ ] `CHANGELOG.md` — covers DIST-03
- [ ] `.npmignore` — covers DIST-01 (source map exclusion)

---

## Sources

### Primary (HIGH confidence)
- Direct inspection of `package.json`, `tsup.config.ts`, `scripts/verify-tree-shake.ts`, `scripts/launch-gate.ts` — authoritative project source
- `npm pack --dry-run --json` output — ground truth on current tarball contents (run live: 1.22 MB unpacked, 714 KB source maps, 6 map files)
- `gzip` measurement of `dist/*.mjs` + CSS — ground truth: 28.3 KB total gzip
- `dist/` directory listing — confirms all 3 entry points built: index, animation, webgl (ESM+CJS+declarations)
- STATE.md — Phase 40 decision: use `execFileSync` not `execSync`
- STATE.md — Phase 36 decision: `launch-gate.ts` must use `.mjs` runner for lighthouse@13 ESM compat
- CONTEXT.md — all locked decisions (D-01 through D-14)

### Secondary (MEDIUM confidence)
- npm documentation on `.npmignore` vs `files` field behavior — standard npm behavior confirmed via direct testing (`npm pack --dry-run` live verification)
- Keep a Changelog format (keepachangelog.com) — D-10 references this directly

### Tertiary (LOW confidence)
- Next.js 16 consumer app RSC compatibility with `'use client'` directive pattern — based on existing Phase 37 patterns in codebase; not verified against fresh Next.js 16 install in isolation

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all tools already in project, verified with live commands
- Architecture: HIGH — patterns derived from existing scripts and direct measurement
- Pitfalls: HIGH — most identified from STATE.md accumulated decisions + live `npm pack` output
- Consumer test RSC pattern: MEDIUM — Next.js RSC behavior with external packages verified conceptually but not tested in isolation

**Research date:** 2026-04-10
**Valid until:** 2026-05-10 (stable domain — npm publish mechanics don't change frequently)
