---
phase: 62-real-device-verification-final-gate
plan: 01
status: deferred
deferred_to: v1.9
captured: 2026-04-27
requirements: [VRF-01, VRF-04]
---

# Plan 62-01 Summary — DEFERRED to v1.9

## Status

Plan 62-01 (real-device WPT 3-profile matrix + VRF-04 mid-milestone
checkpoint synthesis) is **deferred to v1.9** as a clean carve-out, not
attempted in this Phase 62 execution session.

## Reason

Plan 01 W0a STEP 1 is a hard checkpoint requiring `~/.wpt-api-key` (free
WPT Starter API key). The file is not present on disk; per the plan, this
is a BLOCKER that gates wave 0 entirely:

```
$ test -f ~/.wpt-api-key && echo present || echo missing
missing
```

The plan author marked Plan 62-01 `autonomous: false` precisely for this
case. v1.8 milestone close-out chose to defer rather than attempt
external resource provisioning (signup → key copy → save → chmod 600)
inside an automated verification pass.

## Implication

VRF-01 and VRF-04 (which depends on VRF-01 outputs) are both deferred.
The 62-FINAL-GATE.md §1 VRF Status Table records both as DEFERRED. The
synthetic gate (VRF-02) and motion contract (VRF-03) PASS at production-
confirmed level, so the milestone is not blocked on this front — the
real-device matrix would have been a high-confidence-but-not-blocking
addition given the prod numbers (LCP 657ms median, CLS 0.0042
deterministic).

## v1.9 Unblock Recipe

1. Sign up free WPT Starter at https://www.webpagetest.org/signup.
2. Copy API key from https://product.webpagetest.org/api.
3. Save to `~/.wpt-api-key`; `chmod 600 ~/.wpt-api-key`.
4. Confirm: `test -s ~/.wpt-api-key && stat -f '%A' ~/.wpt-api-key` returns `600`.
5. Re-run Plan 62-01 W0a → W1a/W1b/W1c (3 device profiles in parallel) →
   W2a (synthesis doc).
6. Verify: 3 device JSONs ≤50KB committed; each median first-view LCP
   <1000ms AND CLS ≤0.005; MID-MILESTONE-CHECKPOINT.md sign-off PASS.

## Artifacts Not Produced (Carry-over List)

- `.planning/perf-baselines/v1.8/vrf-01-locations-snapshot.json`
- `.planning/perf-baselines/v1.8/vrf-01-ios-iphone13.json`
- `.planning/perf-baselines/v1.8/vrf-01-android-a14.json`
- `.planning/perf-baselines/v1.8/vrf-01-android-midtier.json`
- `.planning/perf-baselines/v1.8/MID-MILESTONE-CHECKPOINT.md`
- `.planning/phases/62-real-device-verification-final-gate/62-MID-MILESTONE-CHECKPOINT.md`

## Cross-references

- 62-FINAL-GATE.md §4.b — explicit deferral with rationale
- MILESTONE-SUMMARY.md `## Decisions Carried Forward to v1.9` — first item
- 62-VERIFICATION.md — VRF-01 row marked `deferred`
