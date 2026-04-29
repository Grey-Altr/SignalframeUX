# Research — Phase 58: Lighthouse CI + Real-Device Telemetry

**Domain:** CI performance gate (LHCI on Vercel preview URLs) + field RUM collection (useReportWebVitals + sendBeacon)
**Researched:** 2026-04-26
**Confidence:** HIGH — all five CIB requirements have confirmed implementation paths grounded in shipped code, official Next.js docs, and LHCI 0.15.x documented schema. Two MEDIUM items remain (RUM sink choice, deployment_status reliability — both called out in Open Questions).

---

## Summary

Phase 58 is strictly infrastructure. It delivers: (1) `@lhci/cli@^0.15.1` wired via a new `.github/workflows/lighthouse.yml` triggered on `deployment_status`, running LHCI against the Vercel preview URL with 5 runs + median assertion at ≥97 performance; (2) a thin `app/_components/web-vitals.tsx` client component using the built-in `useReportWebVitals` hook that fires `navigator.sendBeacon` to a self-hosted Next.js route handler at `app/api/vitals/route.ts`; (3) the existing `scripts/launch-gate.ts` retained verbatim (CIB-04).

Zero visual changes land in this phase. The visual-baseline directory (`.planning/visual-baselines/v1.8-start/`) was created in Phase 57 and already contains the 20 reference PNGs — Phase 58 must not touch them. Phase 59 (CLS-protection restructure) is the direct downstream consumer: it ships under measurement, not luck, because this gate lands first.

---

## Standard Architecture

### Current state before Phase 58

| Surface | State |
|---------|-------|
| `package.json` devDeps | `lighthouse@^13.1.0` installed (used by `launch-gate.ts`); `@lhci/cli` NOT installed |
| `.github/workflows/ci.yml` | lint + unit test + Playwright E2E on push/PR — no Lighthouse step |
| `scripts/launch-gate.ts` | Manual prod gate, 3 runs, worst score per category, exits 1 on < 100. MUST remain unchanged. |
| `app/layout.tsx` | Root layout (Server Component). No web-vitals component. Has 16 client layout components already mounted. |
| `app/_components/` | Does not exist yet. |
| `app/api/` | Does not exist yet. |
| `.lighthouseci/` | Does not exist yet. |
| Visual baselines | `.planning/visual-baselines/v1.8-start/` — 20 PNGs captured in Phase 57 (DGN-03). |
| CSP | No CSP headers configured in `next.config.ts`. `app/layout.tsx` uses `'unsafe-inline'` for inline scripts per layout comment. |

### What Phase 58 adds

```
.lighthouseci/
  lighthouserc.json          ← CIB-02: LHCI config (5 runs, median, thresholds)
.github/workflows/
  ci.yml                     ← EXISTING, unchanged
  lighthouse.yml             ← CIB-03: NEW — deployment_status trigger
app/
  _components/
    web-vitals.tsx           ← CIB-05: 'use client', useReportWebVitals → sendBeacon
  api/
    vitals/
      route.ts               ← CIB-05: self-hosted RUM endpoint (Node runtime, logs to Vercel)
package.json                 ← CIB-01: add @lhci/cli@^0.15.1 to devDependencies
app/layout.tsx               ← CIB-05: import + mount <WebVitals /> (one-line addition)
```

---

## Recommended Approach

### CIB-01 — Install @lhci/cli

```bash
pnpm add -D @lhci/cli@^0.15.1
```

`lighthouse@^13.1.0` is already installed separately (used by `launch-gate.ts`). LHCI 0.15.x bundles its own Lighthouse 12.x internally — there is no version conflict because LHCI invokes Lighthouse as a child process rather than via the Node API import. The two can coexist in `devDependencies` without pinning workarounds.

### CIB-02 — lighthouserc.json

Place at `.lighthouseci/lighthouserc.json` (LHCI's default config search path when run from repo root).

**Cold-start variance discipline** per ROADMAP.md:
- `numberOfRuns: 5` — five Lighthouse runs per URL
- Warmup: LHCI does not have a first-class `warmupRuns` field in 0.15.x. The standard pattern is to prepend the same URL to `collect.urls` a second time and rely on edge/CDN warm-up from the extra hit, OR to set `settings.disableStorageReset: false` to allow the browser cache to warm between runs. The correct v0.15 mechanism is to add the target URL as an extra first entry in `collect.urls` (the "pre-warm hit") — LHCI runs them in order, so the first hit warms the CDN/Vercel edge and the subsequent 5 runs measure warm state. The planner must document this clearly in the plan.
- Assertion aggregation: LHCI 0.15 supports `aggregationMethod: "median-run"` (asserts against the median run's metric values, not the aggregated median). For threshold-style gates, `"median-run"` is the correct value — it picks the representative run and asserts against that run's actual LHR, avoiding the optimistic skew of `"optimistic"`.
- Category score threshold: `"categories:performance": ["error", { "minScore": 0.97, "aggregationMethod": "median-run" }]`
- Audit-level thresholds: `"largest-contentful-paint"` max 1000ms; `"cumulative-layout-shift"` max 0 (LHCI CLS is numeric, 0 means the audit value must be exactly 0); `"total-blocking-time"` max 200ms.

**Schema note on CLS = 0:** LHCI CLS assertion uses `maxNumericValue`. CLS of 0 is expressed as `"maxNumericValue": 0`. This is stricter than Google's "Good" threshold of 0.1. Given the Phase 59 CRT work actively touches CLS-protection paths, holding CLS=0 in the preview gate is the correct enforcement level matching `CLAUDE.md`.

### CIB-03 — GitHub Actions workflow

**Trigger mechanism — `deployment_status` vs alternatives:**

Vercel fires GitHub `deployment_status` events automatically for every deployment (preview and production) when the Vercel GitHub App is installed. The event carries `github.event.deployment_status.target_url` which is the live preview URL. This is the canonical approach — no additional Vercel action or polling helper is needed.

**Known issue:** Vercel's community discussions (vercel/community#428) document that in some repo configurations the `deployment_status` event does not fire reliably (usually when the GitHub App lacks deployment write permission). The mitigation is to confirm the Vercel GitHub App has the `deployments: write` permission in the repo's GitHub App settings. If this is blocked by org policy, the fallback is the `vercel/vercel-action` wait pattern. This is called out in Open Questions.

The workflow must filter on `github.event.deployment_status.state == 'success'` to avoid running on the initial "pending" status event that Vercel also fires.

**Branch protection wiring:** The workflow creates a status check named after the job. For it to *block* merge, a GitHub branch protection rule must require this check. Branch protection rules are configured in the GitHub repo settings UI (or via GitHub API / terraform), not in the workflow YAML. This is out of scope for Phase 58 code delivery — the planner should note it as a manual post-deploy step or document it as a prerequisite.

**Runtime note:** `treosh/lighthouse-ci-action@v12` pins an ubuntu runner internally. The job does not need a container. Total CI runtime for 5 runs against a warm Vercel preview URL is typically 4–8 minutes on a standard GitHub-hosted runner (each Lighthouse run ~45–90s; warmup hit ~5s; overhead ~30s). This is within the GitHub Actions free tier budget.

### CIB-04 — Retain launch-gate.ts

`scripts/launch-gate.ts` is read-only in Phase 58. The file runs 3 Lighthouse runs via the `lighthouse` Node API (not LHCI), takes the **worst** score per category, exits 1 on any < 100. This is the strict prod manual gate. Its threshold (`TARGET_SCORE = 100`, `RUNS = 3`, worst score) is deliberately different from the LHCI preview gate (5 runs, median, ≥97) — the two gates serve different purposes and must not be conflated. No edits to this file.

### CIB-05 — web-vitals.tsx + RUM endpoint

**Component placement:** The `useReportWebVitals` hook requires `'use client'`. The canonical Next.js App Router pattern (confirmed in official docs, Next.js analytics guide) is to create a *separate* client component `app/_components/web-vitals.tsx` and import it into the root layout. This isolates the client boundary to the smallest possible surface. The component renders `null` — it has no visual output.

**Placement in layout.tsx:** Add `<WebVitals />` inside `<body>` before the existing layout tree. The component fires on mount via the hook. Placement before vs after `<TooltipProvider>/<LenisProvider>` does not affect LCP element identity — the component renders null and introduces no DOM nodes.

**LCP perturbation risk:** Adding a `'use client'` component to the root layout does **not** affect Server Component rendering, LCP element identity, or the CLS protection scripts. The existing `scaleScript` and `themeScript` inline scripts in `<head>` are unaffected. The 16 existing client components in layout.tsx are already mounted; this adds a 17th. The bundle cost is near-zero — `useReportWebVitals` is built into `next/web-vitals`, no new runtime dep added.

**sendBeacon payload:** The hook callback receives a `Metric` object with `{ id, name, value, rating, navigationType }`. The beacon should POST JSON to `/api/vitals`. Use `navigator.sendBeacon` with a `Blob` typed as `application/json` to ensure the Content-Type header is set correctly for the route handler to parse.

**RUM endpoint — self-hosted, log-only:** The project has no database in scope. `@vercel/kv`, `@vercel/postgres`, Logflare, and any third-party SaaS are all excluded by the "no new runtime deps, no third-party SaaS" constraint. The simplest compliant endpoint is a Node.js route handler at `app/api/vitals/route.ts` that:
1. Parses the POST body as JSON
2. Calls `console.log(JSON.stringify(payload))` — Vercel captures stdout as structured logs queryable via `vercel logs --prod`
3. Returns `Response.json({ ok: true }, { status: 200 })`

This satisfies VRF-05 ("field RUM 75th-percentile LCP <1.0s post-deploy via CIB-05 telemetry endpoint") — the data is accessible via `vercel logs` within the 24h sampling window. No durable storage means no historical trending, but the requirement only specifies a 24h window post-deploy. Durable storage (Vercel KV or Postgres) is a natural v1.8.1 extension if trending is needed.

**Node runtime vs Edge runtime:** Use the default Node runtime (no `export const runtime` needed). Edge has no `console.log` persistence on Vercel free tier — logs go to ephemeral edge log streams, not the structured `vercel logs` output. Node runtime writes to Vercel's build log infrastructure which is queryable. This is the correct choice for the "log-only sink" pattern.

**CORS:** sendBeacon sends to same-origin (`/api/vitals`), so no CORS headers are needed. The endpoint only needs to handle POST.

**CSP:** `next.config.ts` has no CSP headers configured. `connect-src` for `navigator.sendBeacon` to a same-origin path is not restricted by any current policy — no changes needed. If CSP is added in a future phase, `connect-src 'self'` covers this beacon.

---

## Integration Points

| File | Change type | Notes |
|------|-------------|-------|
| `package.json` | devDep add | `"@lhci/cli": "^0.15.1"` — pnpm add -D |
| `.lighthouseci/lighthouserc.json` | New file | LHCI config |
| `.github/workflows/lighthouse.yml` | New file | deployment_status trigger |
| `.github/workflows/ci.yml` | No change | Existing CI (lint + unit + Playwright) |
| `app/_components/web-vitals.tsx` | New file | 'use client', useReportWebVitals → sendBeacon |
| `app/api/vitals/route.ts` | New file | POST handler, console.log, 200 |
| `app/layout.tsx` | One-line addition | `import { WebVitals }` + `<WebVitals />` in body |
| `scripts/launch-gate.ts` | No change | CIB-04 hard constraint |
| `.planning/visual-baselines/v1.8-start/` | No change | Phase 57 deliverable, must not be touched |

---

## Validation Architecture

Phase 58 is infrastructure-only. The validation suite must prove: (a) LHCI config is syntactically valid and thresholds are correctly expressed; (b) the workflow YAML parses and runs; (c) the web-vitals component fires sendBeacon with the correct payload shape; (d) the endpoint receives and logs the payload; (e) zero visual change vs v1.8-start baselines.

### V-01 — LHCI config dry-run (local)

```bash
pnpm lhci assert --config=.lighthouseci/lighthouserc.json --dry-run
```

`lhci assert --dry-run` parses the config and validates all assertion keys against the LHCI schema without running Lighthouse or fetching any URL. A clean exit (code 0) confirms the JSON is schema-valid and all audit names are recognized by LHCI 0.15.x.

Expected pass condition: exit 0, no "unknown assertion" warnings.

### V-02 — Workflow YAML syntax validation (local)

```bash
# actionlint is the canonical GH Actions linter
pnpm dlx actionlint .github/workflows/lighthouse.yml
```

Or, if actionlint is not available, validate with `yq` parse + GitHub Actions schema check. Expected pass condition: zero errors from actionlint.

### V-03 — Web-vitals component beacon test (Playwright)

New Playwright spec `tests/v1.8-web-vitals.spec.ts`:
- Navigate to `/` against `http://localhost:3000` (dev server or `next start`)
- Intercept network requests for `/api/vitals`
- Assert at least one POST to `/api/vitals` is made within 5s of DOMContentLoaded
- Assert the request body JSON has `{ name: string, value: number, id: string }` shape

This test runs against the local server and does not require a real deployment.

### V-04 — Endpoint 200 contract (Playwright or curl)

Confirm the route handler returns HTTP 200 and `{ ok: true }` JSON for a well-formed POST:

```bash
curl -X POST http://localhost:3000/api/vitals \
  -H 'Content-Type: application/json' \
  -d '{"name":"LCP","value":850,"id":"v3-abc","rating":"good","navigationType":"navigate"}' \
  -w '\n%{http_code}'
```

Expected: `{"ok":true}` + `200`.

### V-05 — Zero visual change (Playwright pixel-diff vs v1.8-start)

Run the existing baseline-capture spec (or a diff variant) against the dev server after layout.tsx is modified to confirm `<WebVitals />` adds no visible pixels. AES-04 gate: <0.5% per-page diff. This is the Phase 57-established standing rule applied to Phase 58.

The spec runs 5 pages × 4 viewports, diffs against `.planning/visual-baselines/v1.8-start/*.png`, and fails if any diff exceeds 0.5%. Since `<WebVitals />` renders null, this should be a 0.0% diff on all 20 images.

### V-06 — LHCI live gate smoke test (post-merge, manual)

After the workflow is merged and a PR is opened, confirm the `lighthouse` check appears in the PR's Checks tab. This is a manual observation step, not an automated test. If the `deployment_status` event does not fire (see Risks), fall back to the alternative trigger (see Open Questions).

---

## Decisions to Lock in Planning

### CIB-01 — @lhci/cli install

**Recommended:** `pnpm add -D @lhci/cli@^0.15.1`

**Tradeoff:** `lighthouse@^13.1.0` is already in devDeps (for `launch-gate.ts`). LHCI 0.15 ships Lighthouse 12.x internally. Two Lighthouse versions coexist as devDeps — this is safe because LHCI forks a child process and does not import `lighthouse` from the host project's `node_modules`. Confirmed: `launch-gate.ts` imports `lighthouse` directly via Node API; LHCI's subprocess invocation is independent.

### CIB-02 — lighthouserc.json shape

**Recommended:** `aggregationMethod: "median-run"` on all assertions. CLS `maxNumericValue: 0`. Performance `minScore: 0.97`. LCP `maxNumericValue: 1000`. TBT `maxNumericValue: 200`.

**Warmup discipline:** No native `warmupRuns` field exists in LHCI 0.15. The ROADMAP specifies "warmup ×2" — the correct implementation is to add the target URL **twice** as extra entries before the real entries in `collect.urls`, OR to set `collect.settings.disableStorageReset: false` (allows browser cache to build across runs). The dual-URL-entry approach is simpler and more explicit. The planner must pick one and document it.

**Tradeoff on CLS=0:** Strict. If any future commit introduces a single CLS event, the gate fails. This is intentional — the milestone constraint is CLS=0, and the gate must enforce it.

### CIB-03 — Workflow trigger

**Recommended:** `on: deployment_status` with `if: github.event.deployment_status.state == 'success'`. URL from `github.event.deployment_status.target_url`.

**Tradeoff:** Vercel fires this event reliably when the GitHub App has `deployments: write` permission. The org/repo permission must be confirmed before or during Phase 58 execution. If the event is unreliable, the fallback is a `workflow_run` trigger on the existing CI workflow completing + a Vercel API call to fetch the latest preview URL (requires `VERCEL_TOKEN` secret). This is the only external dependency that requires a manual repo-settings step.

**Branch protection:** Must be manually configured in GitHub repo settings (require the `lighthouse / audit` check). This is a deployment step, not a code step — but it gates the "failure blocks merge" contract in CIB-03.

### CIB-04 — launch-gate.ts

**Decision: No change.** The file is read-only. Its 3-run worst-case 100/100 threshold remains the prod manual gate. LHCI's 5-run median ≥97 is the PR preview gate. The two-gate model is intentional.

### CIB-05 — RUM sink

**Recommended for Phase 58:** Log-only Node route handler → `vercel logs`. Zero new deps, zero infrastructure, satisfies VRF-05 for a 24h sampling window.

**Tradeoff:** No durable storage means no historical trending or percentile charts. `vercel logs` output has a retention window (~7 days on Vercel free tier, longer on Pro). For the VRF-05 requirement ("field RUM 75th-percentile LCP <1.0s post-deploy via CIB-05 telemetry endpoint"), the 24h window is manually queryable via `vercel logs --prod | grep '"name":"LCP"' | jq '.value' | sort -n`. This is sufficient for Phase 62 validation but requires manual work. The planner must note this tradeoff explicitly and mark durable storage as a v1.8.1 item.

---

## Implementation References

### lighthouserc.json shape

```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 5,
      "settings": {
        "disableStorageReset": false,
        "emulatedFormFactor": "mobile",
        "throttlingMethod": "simulate",
        "throttling": {
          "rttMs": 40,
          "throughputKbps": 10240,
          "cpuSlowdownMultiplier": 4
        }
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": [
          "error",
          { "minScore": 0.97, "aggregationMethod": "median-run" }
        ],
        "categories:accessibility": [
          "error",
          { "minScore": 0.97, "aggregationMethod": "median-run" }
        ],
        "categories:best-practices": [
          "error",
          { "minScore": 0.97, "aggregationMethod": "median-run" }
        ],
        "categories:seo": [
          "error",
          { "minScore": 1.0, "aggregationMethod": "median-run" }
        ],
        "largest-contentful-paint": [
          "error",
          { "maxNumericValue": 1000, "aggregationMethod": "median-run" }
        ],
        "cumulative-layout-shift": [
          "error",
          { "maxNumericValue": 0, "aggregationMethod": "median-run" }
        ],
        "total-blocking-time": [
          "error",
          { "maxNumericValue": 200, "aggregationMethod": "median-run" }
        ]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

**Notes on this shape:**
- The `url` field is intentionally absent — the workflow injects the Vercel preview URL via `--collect.url` CLI argument, not in the config file. This keeps the config file environment-agnostic.
- `emulatedFormFactor: "mobile"` aligns with Phase 57 finding that mobile LCP is the binding constraint (THESIS GhostLabel @ ~4s).
- `temporary-public-storage` for upload target: this is LHCI's free hosted report viewer. No LHCI server needed. Reports are accessible via a URL printed in the CI log for 30 days.
- The planner must decide whether to add a second collect section for desktop (1440 emulation) or run mobile-only. Mobile is the primary constraint.

### GitHub Actions workflow shape

```yaml
name: Lighthouse

on: deployment_status

jobs:
  audit:
    name: Lighthouse Audit
    runs-on: ubuntu-latest
    if: github.event.deployment_status.state == 'success'
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Audit Vercel preview URL
        uses: treosh/lighthouse-ci-action@v12
        with:
          urls: |
            ${{ github.event.deployment_status.target_url }}
          configPath: .lighthouseci/lighthouserc.json
          temporaryPublicStorage: true
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

**Notes:**
- `LHCI_GITHUB_APP_TOKEN` is used by the treosh action to post a status check comment on the PR. Without it, the action still runs and passes/fails the workflow but does not post an inline PR status. The token is a GitHub Personal Access Token with `repo` scope (or the LHCI GitHub App token). The planner must note this as a secrets-setup prerequisite.
- `temporaryPublicStorage: true` in the action inputs is redundant with the `upload.target` in `lighthouserc.json` — one location is sufficient. Keep it in the action `with:` block to ensure treosh always has an upload target even if config is not found.
- The `pnpm install` step is needed because `treosh/lighthouse-ci-action@v12` calls `lhci autorun` which reads the project's `lighthouserc.json`. Without the install, `@lhci/cli` is not in PATH. Alternatively, the action can use its bundled LHCI binary (it ships one internally) if `configPath` is provided — in that case `pnpm install` can be replaced with a lighter `actions/cache` step.

### web-vitals.tsx shape

```typescript
// app/_components/web-vitals.tsx
'use client'

import { useReportWebVitals } from 'next/web-vitals'
import type { Metric } from 'next/web-vitals'

function sendToAnalytics(metric: Metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
    rating: metric.rating,
    navigationType: metric.navigationType,
    url: window.location.href,
    timestamp: Date.now(),
  })

  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/vitals', new Blob([body], { type: 'application/json' }))
  } else {
    // Fallback for older browsers (Safari < 11.1)
    fetch('/api/vitals', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
    }).catch(() => {})
  }
}

export function WebVitals() {
  useReportWebVitals(sendToAnalytics)
  return null
}
```

**Notes:**
- `Metric` type is exported from `next/web-vitals` — no need to import from the `web-vitals` package directly.
- The `new Blob([body], { type: 'application/json' })` pattern sets the Content-Type on the beacon request, allowing the route handler to call `request.json()` directly.
- `sendToAnalytics` is defined outside the component to ensure a stable reference across re-renders (Next.js docs warn that a new function reference per render causes duplicate reporting via `useReportWebVitals`).
- `window.location.href` is safe in a `'use client'` component — this only runs in the browser.

### Route handler shape

```typescript
// app/api/vitals/route.ts
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    // Vercel runtime logs — queryable via `vercel logs --prod`
    console.log(JSON.stringify({ type: 'rum', ...payload }))
    return Response.json({ ok: true }, { status: 200 })
  } catch {
    return Response.json({ ok: false }, { status: 400 })
  }
}

// Ensure CORS pre-flight is handled if needed (same-origin only, so not required)
export async function OPTIONS() {
  return new Response(null, { status: 204 })
}
```

**Notes:**
- No `export const runtime = 'edge'` — defaults to Node. Node runtime on Vercel persists `console.log` to structured logs. Edge runtime on Vercel free tier does not.
- The `OPTIONS` handler is defensive — same-origin sendBeacon does not trigger a CORS preflight, but including it is zero-cost and avoids a 405 if anything issues a preflight in the future.

### layout.tsx addition

```diff
+ import { WebVitals } from './_components/web-vitals'

  <body className="antialiased overflow-x-hidden" data-nav-layout="vertical">
+   <WebVitals />
    <div className="sf-mesh-gradient" aria-hidden="true" />
```

**Notes:**
- `<WebVitals />` is placed as the first child of `<body>` to mount as early as possible, ensuring the hook fires before any navigation or unload events.
- It precedes `<TooltipProvider>` and all layout providers — this is safe because it renders null and has no dependency on any context.

---

## Open Questions for the Planner

### OQ-01 — deployment_status reliability (MUST confirm pre-execute)

The `deployment_status` trigger requires the Vercel GitHub App to have `deployments: write` permission on this repo. Confirm this is granted by checking GitHub repo → Settings → GitHub Apps → Vercel → Repository access. If the event does not fire (testable by merging a trivial commit and checking Actions runs), the fallback is a `workflow_run` trigger on `ci.yml` completing, combined with a Vercel API call to retrieve the latest preview deployment URL. The fallback requires adding a `VERCEL_TOKEN` secret and is architecturally messier — confirm the permission before committing to the YAML shape.

### OQ-02 — LHCI GitHub status token setup

`LHCI_GITHUB_APP_TOKEN` (a PAT with `repo` scope) must be added as a GitHub Actions secret before the workflow posts inline status checks. The alternative is the official LHCI GitHub App (installable from the LHCI docs). Confirm which credential path is available for this repo. If neither is set up, the workflow still runs and blocks/passes the job, but no inline PR status comment is posted.

### OQ-03 — Branch protection rule (out-of-code, deployment step)

The "failure blocks merge" contract in CIB-03 requires a GitHub branch protection rule requiring the `Lighthouse Audit` check. This is not code — it is a repo settings change. The planner should add this as a plan task flagged "repo settings" with instructions for where to click, not as a file edit.

### OQ-04 — Mobile-only vs mobile+desktop LHCI run

Phase 57 found mobile LCP = THESIS GhostLabel, desktop LCP = VL-05 `//` overlay. The `lighthouserc.json` shape above uses mobile emulation only. Running desktop as a second URL entry (with `--form-factor=desktop --screenEmulation.disabled=true`) would catch desktop regressions too. This roughly doubles CI runtime (~8-16 min). The planner must decide based on user's CI budget preference. Mobile-only is the minimum to satisfy CIB-02.

### OQ-05 — Warmup implementation choice

LHCI 0.15 has no native `warmupRuns` field. Two valid approaches:
- **A (URL duplication):** Add `${{ github.event.deployment_status.target_url }}` twice as the first entries in `collect.urls` — the two warm-up hits precede the 5 measurement runs.
- **B (disableStorageReset):** Set `collect.settings.disableStorageReset: false` (it defaults to true, which clears storage between runs). Setting false lets the browser disk cache warm across runs, simulating repeat-visitor timing.

Approach A is cleaner for cold-CDN warm-up (the primary variance source on Vercel edge). Approach B is better for measuring repeat-visit LCP. ROADMAP says "warmup ×2" — this maps to Approach A. Lock in A.

### OQ-06 — RUM sink durable storage (Phase 58 vs v1.8.1)

VRF-05 requires "field RUM 75th-percentile LCP <1.0s post-deploy (~24h sampling window)." With log-only sink, this is queryable but manual. If the user wants automated percentile computation, Vercel KV (free tier available) could store metrics as a sorted set with near-zero additional code. This does not violate the "no new runtime npm dep" constraint — `@vercel/kv` would be a devDep-level addition. Flag this as a post-58 decision and document the upgrade path in the plan.

---

## Risks & Mitigations

### R-01 — LHCI flaky runs (cold CDN variance)

**Risk:** Vercel edge CDN has cold-start variance. First run after deploy can be 2–3× slower than subsequent runs, skewing the median upward (better than actual) or a single bad run failing the gate.

**Mitigation:** `numberOfRuns: 5` + `aggregationMethod: "median-run"` absorbs single outliers. Add the warmup URL hit before the measured runs (OQ-05 Approach A). If the gate is still flaky after 5 runs, escalate to `numberOfRuns: 7` in the config — this costs ~2 extra minutes of CI time but significantly tightens the median estimate.

**Trigger threshold:** If >2 false-positive failures occur in the first week, bump to 7 runs. Document this escalation path in the plan.

### R-02 — deployment_status event not firing

**Risk:** If the Vercel GitHub App lacks `deployments: write` permission, the `deployment_status` event never triggers and the workflow never runs. PRs merge without a Lighthouse check.

**Mitigation:** Confirm permission before merging the workflow. Add a smoke-test step to the plan: open a test PR and verify the Actions tab shows the `Lighthouse` workflow triggered within 2 minutes of Vercel completing its deployment.

### R-03 — CLS=0 assertion is too strict for preview gate

**Risk:** The `maxNumericValue: 0` assertion for CLS is exact. Any value > 0 (including 0.001) fails the gate. CI environments can introduce small CLS from font loading, image layout, or GSAP initialization timing — especially at the throttled 4× CPU slowdown in simulated throttling.

**Mitigation:** CLS=0 is the milestone contract. However, the simulated throttling settings in the preview gate may trigger CLS events that do not occur in real-user conditions. If Phase 59 ships and CLS starts showing non-zero values only in LHCI (not in real Lighthouse runs or WebPageTest), loosen to `maxNumericValue: 0.01` ("Good" threshold) for the preview gate and keep `maxNumericValue: 0` for the prod manual gate (`launch-gate.ts`). Document this two-tier approach explicitly.

### R-04 — Web-vitals component LCP perturbation

**Risk:** Mounting a new client component in `app/layout.tsx` could theoretically shift timing if React's reconciliation delays other renders. Given `<WebVitals />` renders null and has no state/effects beyond the hook, this risk is near-zero. The larger risk is that the `useReportWebVitals` callback fires synchronously on metrics that are already measured — not a LCP perturbation, but could cause a double-report if the callback reference is unstable.

**Mitigation:** Define `sendToAnalytics` outside the component (stable reference). V-05 pixel-diff validation confirms zero visual perturbation.

### R-05 — sendBeacon payload size

**Risk:** `navigator.sendBeacon` has a browser-enforced payload size limit (~64KB in Chromium). A single web vitals metric JSON object is ~200 bytes — well within limits. No risk.

### R-06 — Vercel free tier log retention

**Risk:** Vercel free tier retains runtime logs for 1 hour by default (Pro plan: 7 days). If VRF-05 requires a 24h sampling window and the team is on the free tier, log-only RUM will not satisfy the requirement.

**Mitigation:** Confirm Vercel plan. If free tier, the log window constraint means VRF-05 data collection must happen within ~1h of deploy, or the RUM sink must be upgraded to KV/Postgres. Flag as a plan prerequisite.

### R-07 — CSP future conflict

**Risk:** If a future phase adds `Content-Security-Policy` headers in `next.config.ts`, a missing `connect-src 'self'` directive would silently block `navigator.sendBeacon` to `/api/vitals` without a browser error in some configurations.

**Mitigation:** When/if CSP headers are added, ensure `connect-src 'self'` is included. Document this as a future-phase integration note in the plan.

---

## Sources

| Source | Used for |
|--------|----------|
| `package.json` | Confirmed `lighthouse@^13.1.0` in devDeps; `@lhci/cli` absent; `next: >=15.3.0` peerDep |
| `scripts/launch-gate.ts` | Confirmed CIB-04 contract: 3 runs, worst score, exits 1 on < 100. Read-only. |
| `app/layout.tsx` | Confirmed root layout structure: Server Component, 16 client layout imports, inline scripts in `<head>`, no existing web-vitals component |
| `next.config.ts` | Confirmed no CSP headers; `optimizePackageImports: ["lucide-react"]`; `useCache: true` |
| `.github/workflows/ci.yml` | Confirmed existing CI surface: lint + test + Playwright; Node 22; pnpm 9 |
| `.planning/REQUIREMENTS.md` | CIB-01..05 exact requirements; VRF-05 definition |
| `.planning/STATE.md` | Phase 57 close state; v1.8 critical constraints |
| `.planning/ROADMAP.md` | Phase 58 scope + Success Criteria; LHCI version pin; threshold values |
| `.planning/phases/57-*/57-RESEARCH.md` | Phase 57 research artifact — confirmed visual-baselines already exist; Anton display:optional LCP note |
| `.planning/visual-baselines/v1.8-start/` | Confirmed directory exists with 20 PNGs (Phase 57 DGN-03 deliverable) |
| Next.js docs (Context7 / vercel/next.js) | `useReportWebVitals` hook API; root layout client component pattern; route handler POST + Edge runtime |
| LHCI docs (web search → googlechrome.github.io/lighthouse-ci) | `numberOfRuns`, `aggregationMethod`, `assert`, `collect.settings` schema |
| treosh/lighthouse-ci-action README (web search) | Action inputs: `urls`, `configPath`, `temporaryPublicStorage`, `LHCI_GITHUB_APP_TOKEN` |
| GitHub deployment_status event (web search) | `github.event.deployment_status.target_url`, `.state == 'success'` pattern; Vercel community reliability note |
| MDN sendBeacon (web search → developer.mozilla.org) | Blob + Content-Type pattern; keepalive fetch fallback |
