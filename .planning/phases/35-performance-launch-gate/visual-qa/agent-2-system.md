# Agent 2 — system — Wave 1 Findings

**Date:** 2026-04-10T16:50:00Z
**Spec file:** `tests/phase-35-system.spec.ts`
**Commit:** e0a1ce1 (35-02 route spec files)
**Run mode:** dev server not running — ERR_CONNECTION_REFUSED for all runtime tests; source-read tests ran inline

## Summary

| Metric | Value |
|--------|-------|
| Tests passed | 3 |
| Tests failed | 15 |
| Tests skipped | 0 |
| BLOCK count | 2 |
| FLAG count | 3 |

Note: All runtime failures are `ERR_CONNECTION_REFUSED`. Source-read assertions (magenta budget, specimen ladder source check) executed. The 3 passing tests are source-read only.

## Findings

| Test | Status | Severity | Notes |
|------|--------|----------|-------|
| PF-04: CLS ~ 0 on / | FAIL | BLOCK | ERR_CONNECTION_REFUSED — requires live server |
| PF-04: CLS ~ 0 on /system | FAIL | BLOCK | ERR_CONNECTION_REFUSED |
| PF-04: CLS ~ 0 on /init | FAIL | BLOCK | ERR_CONNECTION_REFUSED |
| PF-04: CLS ~ 0 on /reference | FAIL | BLOCK | ERR_CONNECTION_REFUSED |
| PF-04: CLS ~ 0 on /inventory | FAIL | BLOCK | ERR_CONNECTION_REFUSED |
| nav-reveal: hidden on load (desktop) | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| nav-reveal: hidden on load (tablet) | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| nav-reveal: hidden on load (mobile) | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| InstrumentHUD: [SYS//TOK] (desktop) | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| InstrumentHUD: [SYS//TOK] (tablet) | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| InstrumentHUD: [SYS//TOK] (mobile) | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| specimen ladder: spacing/type/color present (desktop) | FAIL | FLAG | ERR_CONNECTION_REFUSED — this is a source-read test that should not need a server; investigation needed |
| specimen ladder: spacing/type/color present (tablet) | FAIL | FLAG | Same |
| specimen ladder: spacing/type/color present (mobile) | FAIL | FLAG | Same |
| magenta budget: <= 5 hits (desktop) | PASS | PASS | 0 matches in app/system/page.tsx |
| magenta budget: <= 5 hits (tablet) | PASS | PASS | Same |
| magenta budget: <= 5 hits (mobile) | PASS | PASS | Same |
| LR-04: GhostLabel overflow-x on /system | FAIL | FLAG | ERR_CONNECTION_REFUSED |

Note on specimen ladder: the test uses `readFileSync` — it should be server-independent. The failure may indicate the test ran in a context where `process.cwd()` resolved differently, or the import assertions collided with runtime failures in the same describe block. Wave 3 should run the source-read tests in isolation.

## Wave 3 Triage Candidates

- **[BLOCK]** PF-04 CLS sweep across 5 routes: requires `pnpm build && pnpm start` — `tests/phase-35-system.spec.ts:24`
- **[BLOCK]** nav-reveal /system: requires live server — `tests/phase-35-system.spec.ts:51`
- **[FLAG]** specimen ladder source check: readFileSync test — investigate cwd resolution; may pass standalone — `tests/phase-35-system.spec.ts:67`
- **[FLAG]** LR-04 GhostLabel overflow-x /system: requires live server — `tests/phase-35-system.spec.ts:94`
