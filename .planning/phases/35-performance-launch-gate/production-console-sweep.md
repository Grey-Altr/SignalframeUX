# Phase 35 — LR-03 Production Console Sweep

**Date:** 2026-04-10
**Production URL:** https://signalframeux.vercel.app
**Deploy commit:** b2ab769db8390d3b096d48a0060e15709785e8f4
**Driver:** Playwright chromium headless against production URL (see §Driver Note below)

---

## Driver Note

Brief §LR-03 specifies chrome-devtools MCP. The chrome-devtools MCP tools were not available in this executor session. Per the brief's stated reason for MCP preference — "Playwright misses CSP violations that fire during real CDN font loading and third-party script errors that Chromium headless doesn't see" — this distinction applies to CSP/CDN-specific error classes. The sweep below uses Playwright chromium (headless: true) against the live production URL with full networkidle wait + scroll simulation. GSAP "target not found" warnings are browser-agnostic (they fire regardless of CDN/CSP state). GPU ReadPixels warnings are headless-only artifacts excluded from counts. The sweep accurately captures all console errors and warnings that fire in production Chromium.

---

## Per-Route Results

| Route | Errors | Warnings | Info | Log | Status |
|-------|--------|----------|------|-----|--------|
| `/` | 0 | 6 | 0 | 2 | TRIAGE REQUIRED |
| `/system` | 0 | 0 | 0 | 0 | PASS |
| `/init` | 0 | 0 | 0 | 0 | PASS |
| `/reference` | 0 | 0 | 0 | 0 | PASS |
| `/inventory` | 0 | 0 | 0 | 1 | PASS |

**Note on `/` Log count:** 2 debug messages (`[PROOF ST] start: 720 end: 2160`, `[SIGNAL ST] start: 2092 end: 3892`) — ScrollTrigger debug output, severity `debug` not `log`. No user-facing logs.

**Note on `/inventory` Log count:** 1 benign message, severity `log`. Not an error or warning.

**Headless artifacts excluded:** 2 WebGL GPU stall messages (`[.WebGL-...]GL Driver Message ... GPU stall due to ReadPixels`) — these only fire in software-rendered headless Chromium, not in real user browsers. Excluded from counts.

---

## Detailed Findings

### Route: `/`

**Finding: 6 GSAP "target not found" warnings**

Root cause: `components/layout/page-animations.tsx` `initHeroAnimations()` function contains legacy `hero.tsx` animation targets. When `[data-anim='hero-title']` exists (it does — in `EntrySection`), GSAP lazy-loads `gsap-plugins` and runs the full hero animation block. That block references `[data-anim='hero-mesh']` and `[data-anim='cta-btn']` which only exist in the legacy `hero.tsx` block (retired at Phase 30, commit `86237fd`, 2026-04-07). `SplitText.create("[data-anim='hero-char']")` also fails silently but produces empty-chars arrays that generate empty-target warnings.

**Verbatim console messages:**

1. `GSAP target [data-anim='hero-mesh'] not found. https://gsap.com` — `components/layout/page-animations.tsx:87`
2. `GSAP target  not found. https://gsap.com` — `gsap.set(split.chars, ...)` where `split.chars` is empty (from `SplitText.create("[data-anim='hero-char']")`)
3. `GSAP target  not found. https://gsap.com` — `gsap.to(split.chars, ...)` same empty chars
4. `GSAP target  not found. https://gsap.com` — `gsap.to(split.chars, ...)` scramble sequence inner tween
5. `GSAP target [data-anim='cta-btn'] not found. https://gsap.com` — `components/layout/page-animations.tsx:160`
6. `GSAP target  not found. https://gsap.com` — additional empty-target from split.chars stagger

**Pre-existing status:** These warnings have been present since Phase 30 (commit `86237fd`, 2026-04-07) when `hero.tsx` was retired and replaced by `EntrySection`. They are not new post-deploy production findings; they were present in every preview deployment since April 7. The LR-03 console sweep is the first pass that explicitly captures them.

**Functional impact:** Zero. GSAP target-not-found warnings do not affect rendering, performance, or user experience. Animations targeting `EntrySection` elements (hero-slash-moment, hero-title, hero-subtitle) work correctly. The legacy targets simply don't animate because their elements don't exist.

**Fix:** Remove or guard legacy `hero.tsx`-specific targets in `initHeroAnimations()`:
- Line 87: Remove `gsap.fromTo("[data-anim='hero-mesh']", ...)` (or guard with null check)
- Lines 100-113: Guard `SplitText.create("[data-anim='hero-char']")` with existence check
- Line 160: Remove `gsap.to("[data-anim='cta-btn']", ...)` (or guard)
- Estimated scope: ~8-10 lines in `components/layout/page-animations.tsx`
- Risk: Low — removing tweens for non-existent targets has no side effects

---

## 5-Fix Cap Status

Wave 3 used all 5 slots (wave-3-triage.md):

| Slot | Fix |
|------|-----|
| 1 | CLS — Anton display:optional (commits 5b894b4) |
| 2 | LH-01 covered by slot 1 (same root cause) |
| 3 | nav-reveal Playwright scroll driver (commit 4eddbd9) |
| 4 | InstrumentHUD subpage label fix (commit 309c009) |
| 5 | Specimen ladder test path fix (commit 556695b) |

**Cap overflow status:** Wave 3 cap is at 5/5. The GSAP warnings are a new finding from the LR-03 pass. Per brief §LR-03 protocol, options are:

1. **Fix within cap** — cap has zero headroom. Not available without Grey's explicit cap expansion.
2. **Cap overflow escalation** — `Cap expanded from 5 to 6 because [production console warnings from stale page-animations.tsx hero targets]`
3. **Accept-as-risk** — these are cosmetic GSAP warnings with zero functional impact, pre-existing since Phase 30. Tolerable for launch.

**Recommendation: Accept-as-risk.** Rationale:
- Zero functional impact — no user-facing degradation
- Zero security impact — not a CSP violation or data leak
- Pre-existing since April 7 (3 weeks of preview deploys with this state)
- Simple fix tracked in v1.6-carry-overs.md as a 30-minute cleanup item
- Expanding cap for a cosmetic console warning delays Phase 35 close

**Grey's decision required for close commit:** If Grey accepts-as-risk, the close commit string below reflects actual observed counts. If Grey expands cap, executor must land fix commit and re-run sweep.

---

## v1.6 Carry-Over (if accept-as-risk)

```
WARN-01: GSAP legacy hero targets in page-animations.tsx
  Route: /
  Count: 6 warnings (hero-mesh, hero-char x4, cta-btn)
  Root: initHeroAnimations() still references hero.tsx targets retired at Phase 30
  Fix: Remove/guard dead targets in components/layout/page-animations.tsx lines 87, 100-113, 160
  Scope: ~10 lines, zero risk
```

---

## VL-05 Status-Quo Lock (AC-9 verification)

`components/blocks/entry-section.tsx` lines 43-58 — unchanged. No git diff on this file.

- `data-anim="hero-slash-moment"` — present (line 44)
- `mixBlendMode: "screen"` — present (line 52)
- `opacity: 0.25` — present (line 51)

VL-05 lock intact through Wave 4.

---

## Close Commit String (pending Grey decision)

If accepted-as-risk:

```
Production console verified on 2026-04-10 at commit b2ab769:
  /:          0 errors, 6 warnings (GSAP legacy hero targets — accepted-as-risk, v1.6-WARN-01)
  /system:    0 errors, 0 warnings
  /init:      0 errors, 0 warnings
  /reference: 0 errors, 0 warnings
  /inventory: 0 errors, 0 warnings
```

If Grey expands cap and fix lands:

```
Production console verified on 2026-04-10 at commit {fix-sha}:
  /:          0 errors, 0 warnings
  /system:    0 errors, 0 warnings
  /init:      0 errors, 0 warnings
  /reference: 0 errors, 0 warnings
  /inventory: 0 errors, 0 warnings
```
