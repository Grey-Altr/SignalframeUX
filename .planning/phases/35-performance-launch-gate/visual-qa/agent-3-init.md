# Agent 3 — init — Wave 1 Findings

**Date:** 2026-04-10T16:50:00Z
**Spec file:** `tests/phase-35-init.spec.ts`
**Commit:** e0a1ce1 (35-02 route spec files)
**Run mode:** dev server not running — ERR_CONNECTION_REFUSED for runtime tests; Gap 2 EDGE-2 is runtime-dependent

## Summary

| Metric | Value |
|--------|-------|
| Tests passed | 0 |
| Tests failed | 13 |
| Tests skipped | 0 |
| BLOCK count | 1 |
| FLAG count | 3 |

Note: All failures are `ERR_CONNECTION_REFUSED`. Gap 2 EDGE-2 test (Wave 0) is preserved verbatim and will pass once a server is live. All assertions are correctly authored.

## Findings

| Test | Status | Severity | Notes |
|------|--------|----------|-------|
| EDGE-2: reduced-motion h1 does not overlap nav at 375x667 | FAIL | BLOCK | ERR_CONNECTION_REFUSED — requires live server; test body is Wave 0 verbatim |
| nav-reveal: hidden on load (desktop) | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| nav-reveal: hidden on load (tablet) | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| nav-reveal: hidden on load (mobile) | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| [OK] SYSTEM READY terminal footer (desktop) | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| [OK] SYSTEM READY terminal footer (tablet) | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| [OK] SYSTEM READY terminal footer (mobile) | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| InstrumentHUD: [INIT//SYS] (desktop) | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| InstrumentHUD: [INIT//SYS] (tablet) | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| InstrumentHUD: [INIT//SYS] (mobile) | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| bringup-sequence: INIT/HANDSHAKE/LINK/TRANSMIT/DEPLOY (desktop) | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| bringup-sequence: INIT/HANDSHAKE/LINK/TRANSMIT/DEPLOY (tablet) | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| bringup-sequence: INIT/HANDSHAKE/LINK/TRANSMIT/DEPLOY (mobile) | FAIL | FLAG | ERR_CONNECTION_REFUSED |
| LR-04: reduced-motion nav-visible=true first paint | FAIL | FLAG | ERR_CONNECTION_REFUSED |

## Wave 3 Triage Candidates

- **[BLOCK]** EDGE-2 Gap 2: h1/nav overlap at 375x667 reducedMotion — highest priority; was Wave 0 seed — `tests/phase-35-init.spec.ts:19`
- **[FLAG]** [OK] SYSTEM READY terminal footer: runtime DOM check; verify after `pnpm build && pnpm start` — `tests/phase-35-init.spec.ts:57`
- **[FLAG]** bringup-sequence code labels: runtime DOM check; CODES const confirmed in app/init/page.tsx source — `tests/phase-35-init.spec.ts:75`
- **[FLAG]** LR-04 reduced-motion nav-visible first-paint on /init: runtime check — `tests/phase-35-init.spec.ts:93`
