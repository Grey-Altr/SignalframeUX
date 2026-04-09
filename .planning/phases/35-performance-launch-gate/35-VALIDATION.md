---
phase: 35
slug: performance-launch-gate
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-09
---

# Phase 35 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.x (Chromium project) |
| **Config file** | `playwright.config.ts` |
| **Quick run command** | `pnpm test -g "@phase35"` |
| **Full suite command** | `pnpm test` |
| **Estimated runtime** | ~25 seconds (full suite), ~5 seconds (tagged) |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test -g "@phase35"`
- **After every plan wave:** Run `pnpm test`
- **Before `/pde:verify-work`:** Full suite must be green + deploy + PSI audit
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

> Populated during planning. Each planner task with `<automated>` populates a row here.

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| *(planner fills)* | | | | | | | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/phase-35-performance.spec.ts` — stubs for PF-01, PF-02, PF-03
- [ ] `tests/phase-35-metadata.spec.ts` — stubs for LR-02 (OG tags, metadataBase, opengraph-image)
- [ ] `tests/phase-35-responsive.spec.ts` — stubs for LR-04 (375/768/1440 viewport regression)
- [ ] `scripts/audit-bundle.sh` or `ANALYZE=true pnpm build` output capture helper
- [ ] Vercel CLI upgrade: `pnpm add -g vercel@latest` (pre-req for Wave 3 prod deploy)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Lighthouse 100/100 on deployed URL | PF-02 | Must hit Vercel CDN, not headless localhost — CrUX field data surfaces rendering bottlenecks lab audits miss | Open https://pagespeed.web.dev/, enter deployed URL, run Mobile + Desktop, capture all 4 category scores |
| CrUX field data CLS = 0 | PF-03, PF-04 | Field data requires 28 days of real traffic — may not be available at verification time | Check PSI "Origin summary" panel; if NO_DATA, document as deferred post-launch check |
| Awwwards screenshot aesthetic QA | LR-01 | Subjective composition/framing judgment — 5+ shots at 1440x900 must read as cohesive portfolio | Render each via Playwright, review in Figma or local viewer, reject any with hydration FOUC or mid-animation frames |
| Awwwards submission copy register | LR-01 | Voice must match cdSB wiki (DU/TDR lineage), not generic portfolio prose | Copy passes the "Dischord/Wipeout/MIDI anchor" test from `wiki/analyses/culture-division-operating-principles.md` |
| Production console-error inspection | LR-03 | Requires opening DevTools on live deployed URL and exercising every subpage | chrome-devtools MCP `new_page` → `navigate_page` each route → `list_console_messages` → assert zero `error` level entries |
| OG image visual correctness | LR-02 | `opengraph-image.tsx` rendering via Satori can silently fail fonts/layout — must render once and visually verify | After deploy: curl the `/opengraph-image` endpoint, open the PNG, confirm Anton heading + magenta accent render correctly |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
