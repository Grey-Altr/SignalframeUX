---
phase: 6
slug: generative-signal-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-05
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — build-time + manual browser verification |
| **Config file** | none — Wave 0 installs @next/bundle-analyzer |
| **Quick run command** | `npm run build 2>&1 | grep -E "(error|warning)"` |
| **Full suite command** | `ANALYZE=true npm run build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build 2>&1 | grep -E "(error|warning)"`
- **After every plan wave:** Run `ANALYZE=true npm run build`
- **Before `/pde:verify-work`:** Full suite must be green + manual WebGL context count
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | GEN-04 | automated | `npm run build 2>&1 \| grep "window is not defined"` must return 0 lines | ✅ via build | ⬜ pending |
| 06-01-02 | 01 | 1 | GEN-01 | manual | Open devtools GPU panel, navigate 3 routes, confirm 1 WebGL context | ❌ manual only | ⬜ pending |
| 06-02-01 | 02 | 1 | GEN-02 | manual | Render component, compare canvas sRGB to adjacent CSS OKLCH element | ❌ manual only | ⬜ pending |
| 06-03-01 | 03 | 1 | GEN-05 | manual | Enable OS reduced-motion, confirm no RAF in Performance tab | ❌ manual only | ⬜ pending |
| 06-04-01 | 04 | 2 | GEN-03 | manual | Navigate away from canvas page, check Memory panel for no growth | ❌ manual only | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `@next/bundle-analyzer` — install and configure in `next.config.ts`
- [ ] Verify `ANALYZE=true npm run build` produces bundle analysis output

*Existing infrastructure (GSAP ticker, dynamic imports, reduced-motion pattern) covers most phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Single WebGL context across routes | GEN-01 | Requires browser devtools GPU panel inspection | Navigate 3+ routes with canvas zones, confirm exactly 1 WebGL context in chrome://gpu |
| OKLCH→sRGB color match | GEN-02 | Visual comparison between canvas and CSS elements | Render side-by-side, use color picker to compare rendered sRGB values |
| Reduced-motion fallback | GEN-05 | Requires OS setting toggle + Performance tab | Enable prefers-reduced-motion in OS, confirm no RAF loop in devtools Performance |
| GPU resource disposal | GEN-03 | Requires Memory panel heap snapshots | Navigate to canvas page, take snapshot, navigate away, take snapshot, compare |
| Lighthouse 100/100 | GEN-05 | Requires Lighthouse audit in browser | Run Lighthouse on all pages post-implementation |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
