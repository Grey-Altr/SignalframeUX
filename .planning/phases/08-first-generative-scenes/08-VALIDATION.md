---
phase: 8
slug: first-generative-scenes
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-05
---

# Phase 8 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — visual WebGL + Canvas 2D require manual browser verification |
| **Config file** | none |
| **Quick run command** | `pnpm build 2>&1 \| tail -5` |
| **Full suite command** | `pnpm build && pnpm start` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** `pnpm build` — confirms zero SSR errors
- **After every plan wave:** `pnpm build` + manual visual check in browser
- **Before `/pde:verify-work`:** Full build + Lighthouse + manual geometry/disposal checks
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 08-01-01 | 01 | 1 | SCN-01 | automated | `pnpm build 2>&1 \| tail -5` | ✅ via build | ⬜ pending |
| 08-01-02 | 01 | 1 | SCN-01 | manual | Scroll page, verify geometry changes | ❌ manual | ⬜ pending |
| 08-01-03 | 01 | 1 | SCN-01 | manual | Navigate away/back, check renderer.info.memory.geometries | ❌ manual | ⬜ pending |
| 08-02-01 | 02 | 2 | SCN-02 | automated | `pnpm build 2>&1 \| tail -5` | ✅ via build | ⬜ pending |
| 08-02-02 | 02 | 2 | SCN-02 | manual | Verify token values render correctly on /tokens | ❌ manual | ⬜ pending |
| 08-02-03 | 02 | 2 | SCN-02 | manual | Compare canvas OKLCH color to adjacent CSS element | ❌ manual | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure (Phase 6 SignalCanvas, color-resolve, useSignalScene) covers all framework needs.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| SignalMesh renders parametric geometry | SCN-01 | Visual WebGL rendering | Open homepage, verify icosahedron wireframe visible |
| Scroll changes geometry appearance | SCN-01 | Requires scroll interaction | Scroll page, verify displacement/rotation changes |
| Disposal on navigation | SCN-01 | Requires route navigation + devtools | Navigate away/back, check renderer.info.memory.geometries in console |
| Token visualization legibility | SCN-02 | Visual Canvas 2D rendering | Open /tokens, verify color swatches + spacing + typography render |
| OKLCH color match | SCN-02 | Visual color comparison | Compare canvas colors to adjacent CSS elements using same tokens |
| Live token update | SCN-02 | Requires theme toggle | Toggle dark/light mode, verify canvas re-renders with new values |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
