# Agent 1 — homepage — Wave 1 Findings

**Date:** 2026-04-10T16:50:00Z
**Spec file:** `tests/phase-35-homepage.spec.ts`
**Commit:** e0a1ce1 (35-02 route spec files)
**Run mode:** dev server not running — ERR_CONNECTION_REFUSED for all runtime tests; file-system tests ran inline

## Summary

| Metric | Value |
|--------|-------|
| Tests passed | 9 (source-read tests + PF-01 bundle gate) |
| Tests failed | 23 |
| Tests skipped | 0 |
| BLOCK count | 3 |
| FLAG count | 1 |

Note: All runtime failures are `ERR_CONNECTION_REFUSED` — no dev/prod server was running during this Wave 1 authoring run. Source-read assertions executed successfully without a server. LCP and CLS tests require `pnpm build && pnpm start` per brief §PF-03/PF-04. Runtime results are Wave 3 items pending a live server run.

## Findings

| Test | Status | Severity | Notes |
|------|--------|----------|-------|
| PF-01: shared JS < 150 KB gzip and Three.js async-only | PASS | PASS | bundle-gate.spec.ts; file-system test; .next/build-manifest.json present |
| PF-03: LCP < 1.0s on homepage | FAIL | BLOCK | ERR_CONNECTION_REFUSED — requires pnpm build && pnpm start; re-verify in Wave 3 |
| nav-reveal: hidden on load (desktop) | FAIL | BLOCK | ERR_CONNECTION_REFUSED — runtime test; requires live server |
| nav-reveal: hidden on load (tablet) | FAIL | BLOCK | ERR_CONNECTION_REFUSED — runtime test |
| nav-reveal: hidden on load (mobile) | FAIL | BLOCK | ERR_CONNECTION_REFUSED — runtime test |
| InstrumentHUD: [01//ENTRY] (desktop) | FAIL | FLAG | ERR_CONNECTION_REFUSED — runtime test |
| InstrumentHUD: [01//ENTRY] (tablet) | FAIL | FLAG | ERR_CONNECTION_REFUSED — runtime test |
| InstrumentHUD: [01//ENTRY] (mobile) | FAIL | FLAG | ERR_CONNECTION_REFUSED — runtime test |
| GhostLabel: locked to app/page.tsx (desktop) | PASS | PASS | Source read confirms GhostLabel in THESIS section; pair lock (homepage + /system) holds |
| GhostLabel: locked to app/page.tsx (tablet) | PASS | PASS | Same source check |
| GhostLabel: locked to app/page.tsx (mobile) | PASS | PASS | Same source check |
| magenta budget: <= 5 text-primary hits (desktop) | PASS | PASS | 0 matches in app/page.tsx |
| magenta budget: <= 5 text-primary hits (tablet) | PASS | PASS | Same |
| magenta budget: <= 5 text-primary hits (mobile) | PASS | PASS | Same |
| VL-05: hero-slash-moment intact (desktop) | PASS | PASS | data-anim, mixBlendMode:screen, opacity:0.25 all present; status-quo lock holds |
| VL-05: hero-slash-moment intact (tablet) | PASS | PASS | Same |
| VL-05: hero-slash-moment intact (mobile) | PASS | PASS | Same |
| reduced-motion: page renders (desktop) | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| reduced-motion: page renders (tablet) | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| reduced-motion: page renders (mobile) | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| LR-02: /opengraph-image responds 200 (desktop) | FAIL | FLAG | Expected RED — OG image ships in plan 35-03; not a regression |
| LR-02: /opengraph-image responds 200 (tablet) | FAIL | FLAG | Same |
| LR-02: /opengraph-image responds 200 (mobile) | FAIL | FLAG | Same |
| LR-04: HUD 3 fields at 375x667 | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| LR-04: HUD 5 fields at 1440x900 | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| LR-04: reduced-motion nav-visible=true first paint | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| LR-04: GhostLabel parent overflow-x | FAIL | FLAG | ERR_CONNECTION_REFUSED |

## Wave 3 Triage Candidates

- **[BLOCK]** PF-03 LCP < 1.0s on homepage: requires production server (`pnpm build && pnpm start`) — re-run in Wave 3 against deployed URL — `tests/phase-35-lcp-homepage.spec.ts:15`
- **[BLOCK]** nav-reveal initial state (all viewports): runtime check; requires live server — `tests/phase-35-homepage.spec.ts:26`
- **[BLOCK]** LR-04 HUD field truncation at mobile: runtime check; requires live server — `tests/phase-35-homepage.spec.ts:103`
- **[FLAG]** LR-02 /opengraph-image: intentionally RED until plan 35-03 ships OG image — `tests/phase-35-homepage.spec.ts:87`
