---
status: FAIL
phase: 63-wpt-real-device-verification
source: [vrf-01-ios-iphone14pro.json, vrf-01-android-a14.json, vrf-01-android-midtier.json]
captured: 2026-04-28
verdict: pitfall_10_TRIGGERED
escalation: required
escalation_target: Phase 63.1 / 60.1 (perf optimization phase)
---

# v1.8 Mid-Milestone Real-vs-Synthetic Synthesis (VRF-04)

> Real-device WebPageTest measurements vs Phase 60 LHCI synthetic baseline.
> **Verdict: FAIL.** Pitfall #10 LCP + TTI thresholds TRIGGER on all 3 profiles.
> v1.8's "Speed of Light" claim of LCP <1.0s is **structurally false on real devices**.

## §1 Real-Device Median

3-run median per Catchpoint Starter cap (original plan: n=5; cap details in `_path_a_decision_runs` below). Tested 2026-04-28 against `signalframeux-q2kby92cc-grey-altrs-projects.vercel.app` (Vercel preview deploy of `chore/v1.7-ratification` HEAD `f3ddfcd`; main is 176 commits behind).

| Profile | Network | LCP | CLS | TBT | TTFB | FCP | SI | Page Weight | Notes |
|---------|---------|-----|-----|-----|------|-----|-----|-------------|-------|
| iPhone 14 Pro / Chrome v145 | 4G (9 Mbps, 170ms RTT) | **1711 ms** | 0.0066 | 317 ms | 725 ms | 1711 ms | 3299 ms | 793 KB | Canonical iOS run |
| Motorola G Power / Chrome v145 (Galaxy A14 substitute) | **3G Fast (1.6 Mbps, 150ms RTT)** | **3618 ms** | 0.0002 | **3760 ms** | 734 ms | 2083 ms | 9631 ms | 732 KB | Catchpoint defaulted to 3G — represents budget Android on congested cellular |
| Moto G Stylus / Chrome v145 (mid-tier substitute) | 4G (9 Mbps, 170ms RTT) | **1851 ms** | 0.0002 | 356 ms | 747 ms | 1618 ms | 3412 ms | 794 KB | Mid-tier Android on fast cellular |

**Repeat-view LCP** (cached resources): iPhone 1239 ms · G Power 3199 ms · G Stylus 1345 ms. Even with cache populated, LCP exceeds 1000 ms on all profiles.

**Bypass-overhead control:** `vrf-01-ios-iphone14pro-with-bypass.json` measured against the bypass URL: LCP 1734 ms, TTFB 917 ms. Delta vs canonical: +23 ms LCP / +192 ms TTFB. Auth overhead is negligible for LCP attribution; the failure is real-app, not auth-flow.

### `_path_a_decision_devices`

```yaml
decided: 2026-04-28
audit: VRF-01 originally specified "Galaxy A14 Chrome" + "mid-tier Android"
original: Galaxy A14 (Samsung mid-low) + Pixel 6a / mid-tier Android
new: Motorola G Power (Galaxy A14 substitute) + Moto G Stylus (mid-tier substitute)
rationale: |
  Catchpoint Starter tier device list does not include any Samsung A-series. Available
  Android: Moto G Power (budget), Moto G Stylus (mid), Pixel 9 Pro (flagship), Galaxy
  S22/S24/S25 Ultra (flagship). Tier-equivalence (Snapdragon 6-series, 4-6GB RAM,
  sub-$200 retail) preserved for synthetic-vs-real comparison.
evidence: vrf-01-android-a14.json (Motorola G Power), vrf-01-android-midtier.json (Moto G Stylus)
review_gate: Phase 63.1 / 60.1 may re-measure on Galaxy A14 if Catchpoint Pro tier acquired
```

### `_path_a_decision_network`

```yaml
decided: 2026-04-28
audit: Phase 63 plan implicitly assumed all 3 profiles measured on 4G
original: 3 profiles on 4G (9 Mbps, 170ms RTT)
new: 2 profiles on 4G (iPhone, G Stylus) + 1 profile on 3G Fast (G Power, 1.6 Mbps)
rationale: |
  Catchpoint Starter applies device-specific network defaults; G Power defaults to 3G Fast,
  G Stylus to 4G. Per-test network override is paywalled behind Pro tier.
evidence: connectivity field per run JSON
impact: |
  G Power result conflates device tier with network tier — cannot attribute its LCP failure
  to device alone. Moto G Stylus on 4G (LCP 1851ms) demonstrates network is the dominant
  axis: same device tier as G Power, but on faster network, LCP halves.
review_gate: Phase 63.1 should re-measure G Power on 4G if Pro acquired, to isolate device contribution
```

### `_path_a_decision_runs`

```yaml
decided: 2026-04-28
audit: Plan 63-01 specified n=5 per profile (legacy WPT default)
original: 5 runs per profile, median computed across 5
new: 3 runs per profile, median computed across 3
rationale: Catchpoint Starter caps Number of Runs at 3 per Instant Test submission.
impact: |
  Confidence interval ~30-50ms wider than n=5 plan. For Phase 63's success criterion
  (LCP <1000ms vs measured 1711-3618ms), n=3 retains ample power to confirm FAIL.
evidence: num_runs field per run JSON = 3
review_gate: Phase 63.1 may re-measure at n=5 if Catchpoint Pro acquired
```

## §2 Synthetic-vs-Real Divergence (Pitfall #10)

Phase 60 LHCI synthetic baselines from `phase-60-mobile-lhci.json` (`.median.lcp_ms` 810; `.median.cls` 0.002505; `.median.tbt_ms` 100). Phase 62 synthetic TTI baseline from `vrf-02-launch-gate-runs.json` (`.median.tti_ms` 907).

| Metric | Synthetic | Real (3-profile avg) | Ratio | Threshold | Verdict |
|--------|-----------|----------------------|-------|-----------|---------|
| **LCP** | 810 ms | 2393 ms | **2.95×** | real ÷ synthetic > 1.3 → TRIGGER | 🔴 **TRIGGER** |
| **CLS** | 0.002505 | 0.0066 (max) | — | real CLS > 0.01 → TRIGGER | 🟢 clean |
| **TBT** | 100 ms | 1478 ms | **14.78×** | (informational) | 🔴 catastrophic |
| **TTI** (SI proxy) | 907 ms | 5447 ms | **6.0×** | real ÷ synthetic > 1.5 → TRIGGER | 🔴 **TRIGGER** |

**Pitfall #10 escalation thresholds (verbatim from Plan 62-01 D-07):**
- LCP: real ÷ synthetic > 1.3 → TRIGGER (actual 2.95 → fired)
- CLS: real CLS > 0.01 → TRIGGER (actual 0.0066 → did not fire)
- TTI: real ÷ synthetic > 1.5 → TRIGGER (actual 6.0 → fired)

### Where the divergence lives

1. **Bundle size** (730–795 KB; CLAUDE.md target <200 KB): network-bound on 3G Fast — ~700ms transfer at 1.6 Mbps theoretical, 1500ms+ in practice with TCP slow start. 4× over the project's own stated target.
2. **JS execution time** (TBT 317ms iPhone → 3760ms G Power): main thread blocked while parsing/executing the JS payload. CPU-bound; cache-resistant; the dominant cost on slow Android hardware.
3. **First-paint blocker**: LCP candidate is the SVG `<text>` wordmark. SVG text rendering depends on JetBrains Mono availability + parser readiness. ~700ms of JS execution delays parser readiness, gating the wordmark paint.

## §3 Cross-Viewport LCP Element Identity

| Profile | LCP Type | Element | Source |
|---------|----------|---------|--------|
| iPhone 14 Pro | text | SVG `<text>` "CULTURE DIVISION..." | JetBrains Mono, font-weight 700 |
| Motorola G Power | text | SVG `<text>` (same) | JetBrains Mono, font-weight 700 |
| Moto G Stylus | text | SVG `<text>` (same) | JetBrains Mono, font-weight 700 |

LCP element identity is **stable across all 3 profiles**. The optimization target is unambiguous: the masthead wordmark SVG `<text>` element rendering "CULTURE DIVISION" in JetBrains Mono. Phase 63.1's fix work has a single LCP candidate to optimize, not a viewport-dependent set.

## §4 Sign-off

### Verdict: **FAIL**

- All 3 profiles exceed the LCP <1000ms success criterion: 1.71× over (iPhone), 3.62× over (G Power on 3G), 1.85× over (G Stylus on 4G).
- Pitfall #10 LCP threshold (real ÷ synthetic > 1.3) triggered with margin (actual 2.95).
- Pitfall #10 TTI threshold (real ÷ synthetic > 1.5) triggered with margin (actual 6.0).
- CLS remains clean across all profiles (max 0.0066 < 0.01 threshold).

### Escalation required

v1.8 cannot ship with a verified "LCP <1.0s" claim. Phase 63.1 (or 60.1 if scoped tighter to LCP-element work) needed before milestone close, scoped to:

1. **Bundle reduction** — page weight 730–795 KB → target <200 KB per CLAUDE.md
2. **JS deferral / code-splitting** — TBT 317–3760ms → target <300ms even on slow CPU. Network-bound on 3G; CPU-bound on slow Android even on 4G.
3. **LCP fast-path** — the wordmark `<text>` element should not block on the full JS payload. Options: inline-critical-CSS-first; SVG-as-static-asset preloaded; `font-display: optional` for JetBrains Mono with system-font fallback for the wordmark specifically.

### Phase 63 deliverable status

| Deliverable | Status |
|-------------|--------|
| 3-profile WPT JSON committed | ✅ vrf-01-ios-iphone14pro.json, vrf-01-android-a14.json, vrf-01-android-midtier.json |
| Each report shows LCP <1.0s | ❌ all 3 fail (1711, 3618, 1851 ms) |
| Plan 62-01 W0a→W2a re-run end-to-end | ✅ executed via Catchpoint GUI (Path B; key API not provisioned on Starter) |
| Outputs reconcile with Phase 62 synthetic numbers within Pitfall #10 thresholds | ❌ TRIGGER fired on LCP + TTI |
| Synthesis doc rendered with explicit thresholds for divergence | ✅ this document |

**v1.8 milestone status (post-Phase-63):** previously "feature-complete-with-deferrals" → now **"feature-complete-with-real-device-perf-FAIL"**. Phase 63.1 must close before milestone-close.

**Sources:**
- `.planning/perf-baselines/v1.8/vrf-01-ios-iphone14pro.json` — iPhone 14 Pro / 4G canonical (LCP 1711 ms)
- `.planning/perf-baselines/v1.8/vrf-01-ios-iphone14pro-with-bypass.json` — bypass-overhead control (LCP 1734 ms; +23ms delta)
- `.planning/perf-baselines/v1.8/vrf-01-android-a14.json` — Motorola G Power / 3G Fast, Galaxy A14 substitute (LCP 3618 ms)
- `.planning/perf-baselines/v1.8/vrf-01-android-midtier.json` — Moto G Stylus / 4G, mid-tier substitute (LCP 1851 ms)
- `.planning/perf-baselines/v1.8/phase-60-mobile-lhci.json` — synthetic LHCI baseline (LCP 810 ms; CLS 0.002505; TBT 100 ms)
- `.planning/perf-baselines/v1.8/vrf-02-launch-gate-runs.json` — Phase 62 synthetic TTI (907 ms)

**Signed-off-by:** Phase 63 orchestrator (PDE)
**Date:** 2026-04-28
