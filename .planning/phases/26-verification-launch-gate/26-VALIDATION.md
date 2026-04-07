---
phase: 26
slug: verification-launch-gate
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-07
---

# Phase 26 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.59.1 |
| **Config file** | `playwright.config.ts` |
| **Quick run command** | `pnpm exec playwright test` |
| **Full suite command** | `pnpm exec playwright test` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm exec playwright test`
- **After every plan wave:** Run `pnpm exec playwright test` + `ANALYZE=true pnpm build`
- **Before `/pde:verify-work`:** Full suite must be green + Lighthouse 100/100 documented + bundle gate confirmed
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 26-01-01 | 01 | 1 | VF-01 | script | `python3 -c "<gzip measurement>"` | N/A (inline) | pending |
| 26-01-02 | 01 | 1 | VF-01 | analyzer | `ANALYZE=true pnpm build` (visual treemap) | config wired | pending |
| 26-02-01 | 02 | 2 | VF-02 | manual | PageSpeed Insights against deployed URL | N/A (web tool) | pending |
| 26-02-02 | 02 | 2 | VF-02 | manual | Chrome DevTools CWV section | N/A (web tool) | pending |
| 26-02-03 | 02 | 2 | Regression | e2e | `pnpm exec playwright test` | both specs exist | pending |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No new spec files or framework installs needed.

- `@next/bundle-analyzer` already in devDependencies
- `ANALYZE=true` flag already wired in `next.config.ts`
- Playwright test suite has 2 spec files covering prior phases

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Lighthouse 100/100 all categories | VF-02 | Must run against deployed Vercel URL (not localhost) via PageSpeed Insights or Chrome DevTools | Deploy with `vercel --prod`, paste URL into pagespeed.web.dev, run audit |
| LCP < 1.0s, CLS = 0, TTI < 1.5s | VF-02 | Core Web Vitals measured by external tool against deployed URL | Check CWV section in PageSpeed Insights results |
| Bundle treemap visual inspection | VF-01 | `ANALYZE=true pnpm build` opens treemap HTML; verify shiki/ComponentDetail/Calendar/Menubar not in shared chunks | Open client.html treemap, search for module names |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
