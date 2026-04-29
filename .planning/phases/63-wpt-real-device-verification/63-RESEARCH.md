# Phase 63: WPT Real-Device Verification — Research

**Researched:** 2026-04-27
**Domain:** WebPageTest programmatic API + multi-device perf harvest + synthesis doc rendering
**Confidence:** HIGH — all mechanisms documented in Phase 62 artifacts; execution scripts shipped in
`scripts/`; the only external dependency is the WPT API key at `~/.wpt-api-key`.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| VRF-01 | WebPageTest free-tier JSON for ≥3 device profiles (iPhone 13/14 Safari, Galaxy A14 Chrome, mid-tier Android) committed to `.planning/perf-baselines/v1.8/`. Each report shows LCP <1.0s. | §1 WPT API surface + §2 Device profile matrix + §5 Existing scripts |
| VRF-04 | Mid-milestone real-vs-synthetic synthesis doc rendered (`.planning/perf-baselines/v1.8/MID-MILESTONE-CHECKPOINT.md`) with explicit Pitfall #10 escalation thresholds. | §3 Synthesis doc schema + §4 Divergence thresholds + §5 Existing artifacts as inputs |
</phase_requirements>

---

## Summary

Phase 63 is the carry-over of Phase 62 Plan 01, which was deferred solely because `~/.wpt-api-key`
was absent on disk. The plan is fully authored (`.planning/phases/62-real-device-verification-final-gate/62-01-PLAN.md`) and covers W0a through W2a in detail. Phase 63 re-runs that work unchanged, committing output to the same `.planning/perf-baselines/v1.8/` paths documented in the Phase 62 plan.

**Primary recommendation:** Phase 63 MUST reuse the Plan 62-01 task sequence verbatim (W0a key
preflight → W1a iPhone → W1b A14 → W1c mid-tier → W2a synthesis). No new scripting is needed. The
single plan for this phase is the re-execution of that deferred W0a–W2a chain, plus a SUMMARY, VERIFICATION, and VALIDATION artifact set.

**Gating external dependency:** `~/.wpt-api-key` must exist at chmod 600 and be non-empty before
any wave 1 work can start. The plan must hard-gate on this in wave 0 and surface a clean BLOCKER
message if absent.

---

## §1 WPT API Surface

**Source:** Phase 62-RESEARCH.md §§Architecture Patterns Pattern 1 (HIGH confidence — extracted from
verified WPT docs at research time) + 62-01-PLAN.md task W1a steps 2–4.

### Key endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `https://www.webpagetest.org/runtest.php` | POST (form-encoded) | Submit test; returns `{data: {testId, jsonUrl, userUrl}}` |
| `https://www.webpagetest.org/testStatus.php?test={id}&f=json` | GET | Poll; `statusCode: 200` = complete |
| `https://www.webpagetest.org/jsonResult.php?test={id}` | GET | Retrieve full results (multi-MB raw) |
| `https://www.webpagetest.org/getLocations.php?f=json` | GET | Enumerate real-device location slugs (no key required) |

### API key mechanics

- Free-tier "Starter" account: 300 monthly tests, throttled to 1 concurrent test per API key.
- Key passed as HTTP header: `-H "X-WPT-API-KEY: $(cat ~/.wpt-api-key)"` — never inline in shell
  strings to avoid log leakage.
- Key lives at `~/.wpt-api-key` (OUTSIDE the repo) with `chmod 600`. 
- Git leak check: `git ls-files | grep -iE 'wpt.*key|api.*key' | wc -l` MUST return `0`.
- Rate-limit strategy: batch-submit all 3 profiles in one sitting, capture all 3 test IDs, then
  poll-retrieve in sequence after queue clears (typically 5–15 min per profile on free tier).

### Run parameters (locked per D-04 from 62-CONTEXT.md)

```
runs=5          # 5-run median; variance-discipline floor
fvonly=0        # Capture both first-view AND repeat-view
f=json          # JSON response format
connectivity    # LTE / Verizon 4G or equivalent slug
```

### Submission curl shape

```bash
WPT_API_KEY=$(cat ~/.wpt-api-key)
curl -s -X POST "https://www.webpagetest.org/runtest.php" \
  -H "X-WPT-API-KEY: ${WPT_API_KEY}" \
  --data-urlencode "url=https://signalframeux.vercel.app/" \
  --data-urlencode "location=${SLUG}" \
  -d "runs=5" \
  -d "fvonly=0" \
  -d "f=json" \
  -d "label=v1.8-vrf-01-{profile}"
```

Returns `{ statusCode, statusText, data: { testId, ... } }`. Extract `data.testId`.

### Polling

```bash
while true; do
  STATUS=$(curl -s "https://www.webpagetest.org/testStatus.php?test=${TEST_ID}&f=json" \
    | jq -r '.statusCode')
  [ "$STATUS" = "200" ] && break
  echo "Status: $STATUS — waiting 30s"; sleep 30
done
```

### Retrieval + jq pruning to <50 KB per profile

```bash
curl -s "https://www.webpagetest.org/jsonResult.php?test=${TEST_ID}" | jq '{
  capturedAt: (now | todateiso8601),
  testId: .data.id,
  url: .data.url,
  location: .data.location,
  connectivity: .data.connectivity,
  device_profile: .data.location,
  runs: .data.testRuns,
  fvonly: .data.fvonly,
  successfulFVRuns: .data.successfulFVRuns,
  successfulRVRuns: .data.successfulRVRuns,
  median: {
    firstView: {
      LCP: .data.median.firstView.LargestContentfulPaint,
      CLS: .data.median.firstView["chromeUserTiming.CumulativeLayoutShift"],
      FCP: .data.median.firstView.firstContentfulPaint,
      TTI: .data.median.firstView.TimeToInteractive,
      TBT: .data.median.firstView.TotalBlockingTime,
      SpeedIndex: .data.median.firstView.SpeedIndex
    },
    repeatView: {
      LCP: .data.median.repeatView.LargestContentfulPaint,
      CLS: .data.median.repeatView["chromeUserTiming.CumulativeLayoutShift"],
      FCP: .data.median.repeatView.firstContentfulPaint
    }
  },
  per_run_lcp: [.data.runs[]?.firstView?.LargestContentfulPaint]
}' > .planning/perf-baselines/v1.8/vrf-01-{profile}.json
```

**Source file:** `.planning/phases/62-real-device-verification-final-gate/62-01-PLAN.md` lines
254–282 (W1a Step 4).

---

## §2 Device Profile Matrix

**Source:** 62-CONTEXT.md D-02 + 62-01-PLAN.md W1a/W1b/W1c slug discovery logic.

The exact free-tier slugs available on any given day are discovered via `getLocations.php` and
snapshotted to `vrf-01-locations-snapshot.json` (W0a). The target profile and its fallback:

| Profile | Target slug pattern | Fallback slug |
|---------|--------------------|-----------| 
| iPhone 13/14 Safari | `jq '.data | to_entries[] | select(.key | test("iPhone.*13|iPhone.*14"; "i")) | .key'` | `Dulles_iPhone:iPhone-13-Safari.4G` |
| Galaxy A14 Chrome | `jq '.data | to_entries[] | select(.key | test("Galaxy.*A14|GalaxyA14"; "i")) | .key'` | `Dulles_MotoG:Galaxy-A14-Chrome.4G` |
| Mid-tier Android (Moto G4) | `jq '.data | to_entries[] | select(.key | test("MotoG.*Power|Moto.*G4|MotoG4"; "i")) | .key'` | `Dulles_MotoG4:MotoG4-Chrome.4G` |

**Fallback note:** If Galaxy A14 is unavailable on WPT free tier on the measurement day, add a
`notes` field to `vrf-01-android-a14.json` documenting the substitution. This matches 62-01-PLAN.md
W1b action.

**Connectivity parameter:** Verizon LTE / 4G (LTE suffix in slug, or `connectivity=4G` param).
This matches the Phase 60 D-07 single-device methodology for direct comparison.

---

## §3 Synthesis Doc Schema (MID-MILESTONE-CHECKPOINT.md)

**Template source:** `.planning/perf-baselines/v1.8/phase-60-realdevice-checkpoint.md` (format
precedent — lines 1–64) + 62-RESEARCH.md §§Architecture Patterns Pattern 4 (W2a specification).

**Output paths (both required per D-12):**
- `.planning/perf-baselines/v1.8/MID-MILESTONE-CHECKPOINT.md`
- `.planning/phases/63-wpt-real-device-verification/63-MID-MILESTONE-CHECKPOINT.md` (phase-folder
  mirror — byte-identical)

**Required YAML frontmatter:**

```yaml
phase: 63-wpt-real-device-verification
plan: 01
gate: VRF-04 (Pitfall #10 anchor)
captured: <ISO-8601 date>
status: PASS|FAIL|HUMAN-NEEDED
```

**Required sections:**

```
## §1 Real-Device Median
  Table: 4 rows (3 device profiles + Phase 60 D-07 ref row)
  Columns: Profile | Slug | LCP ms | CLS | FCP ms | TTI ms | vs ROADMAP gate | Sign-off

## §2 Synthetic-vs-Real Divergence
  Table: rows for LCP / CLS / TTI
  Columns: Metric | Synthetic (phase-60-mobile-lhci.json) | Real median | Ratio | Pitfall #10 trigger? | Verdict
  Footer note (verbatim): "real ÷ synthetic > 1.3" + trigger conditions

## §3 Cross-Viewport LCP Element Identity
  Cites v1.8-lcp-diagnosis.md: mobile=GhostLabel, desktop=VL-05 //

## §4 Sign-off
  Checkbox **PASS** or **FAIL** + escalation block if FAIL
  "Signed-off-by:" line
```

**PASS gate acceptance:** `grep -E '\*\*PASS\*\*'` must match at least once.

---

## §4 Pitfall #10 Escalation Thresholds

**Source:** 62-01-PLAN.md lines 449–451 (W2a action) + 62-CONTEXT.md D-07.

These thresholds are BLOCKING gates — if any fires, Plan 02+ do NOT proceed; escalate as Phase 62.1
/ 60.1.

| Metric | Threshold | Action if triggered |
|--------|-----------|---------------------|
| LCP (real ÷ synthetic) | > 1.3 | TRIGGER — escalate, block downstream |
| CLS (real) | > 0.01 | TRIGGER — note: Path A floor is 0.005, but 0.01 is the escalation threshold |
| TTI (real ÷ synthetic) | > 1.5 | TRIGGER — escalate, block downstream |

These must be embedded verbatim in the §2 table footer of MID-MILESTONE-CHECKPOINT.md
(`grep -E 'real ÷ synthetic > 1\.3'` is a plan acceptance criterion).

**Per-profile BLOCKING gate** (fires immediately after each device JSON is retrieved):
- `LCP < 1000ms` AND `CLS <= 0.005` for that profile's `median.firstView`
- If either fails: commit failure note, escalate, stop — do not proceed to remaining profiles

---

## §5 Existing Codebase Patterns

### Scripts already shipped (do NOT rewrite)

| Script | What it does | Re-use pattern |
|--------|-------------|----------------|
| `scripts/launch-gate-vrf02.ts` | Phase 62 VRF-02 5-run median runner (tsx entry) | Not directly used in Phase 63, but `.mjs` runner pattern is the reference for any new script |
| `scripts/launch-gate-vrf02-runner.mjs` | ESM runner that bypasses tsx/lighthouse ESM interop | Pattern reference: use `.mjs` sibling if any new script touches lighthouse |
| `scripts/v1.8-rum-aggregate.ts` | Vercel logs RUM aggregator | Not in Phase 63 scope |
| `scripts/v1.8-rum-seed-runner.mjs` | RUM seeder | Not in Phase 63 scope |

Phase 63 has NO new scripts to write. All WPT operations are performed via `curl` + `jq` + `bash`
in the plan tasks (the same approach as 62-01-PLAN.md W1a–W1c).

### Perf-baselines artifacts that Phase 63 reads as inputs

| Path | Role |
|------|------|
| `.planning/perf-baselines/v1.8/phase-60-mobile-lhci.json` | Synthetic baseline for §2 divergence table (LCP=810ms localhost / CLS=0.002505) |
| `.planning/perf-baselines/v1.8/phase-60-realdevice-checkpoint.md` | Phase 60 D-07 single-device iPhone 13 mini-check; §1 D-07 reference row |
| `.planning/codebase/v1.8-lcp-diagnosis.md` | Cross-viewport LCP element identity for §3 |
| `.planning/codebase/v1.8-lcp-candidates.json` | LCP element confirmation (mobile=GhostLabel) |

### Perf-baselines artifacts that Phase 63 PRODUCES

These paths are the outputs locked in 62-01-PLAN.md `files_modified` frontmatter; Phase 63 adopts
them unchanged:

| Path | Content |
|------|---------|
| `.planning/perf-baselines/v1.8/vrf-01-locations-snapshot.json` | W0a — WPT location slug audit trail |
| `.planning/perf-baselines/v1.8/vrf-01-ios-iphone13.json` | W1a — iPhone 13/14 Safari 5-run median |
| `.planning/perf-baselines/v1.8/vrf-01-android-a14.json` | W1b — Galaxy A14 (or fallback) Chrome 5-run median |
| `.planning/perf-baselines/v1.8/vrf-01-android-midtier.json` | W1c — Mid-tier Android 5-run median |
| `.planning/perf-baselines/v1.8/MID-MILESTONE-CHECKPOINT.md` | W2a — VRF-04 synthesis doc |
| `.planning/phases/63-wpt-real-device-verification/63-MID-MILESTONE-CHECKPOINT.md` | W2a mirror (D-12) |

### Accepted JSON shape (per 62-01-PLAN.md `<interfaces>`)

```json
{
  "capturedAt": "ISO-8601",
  "testId": "WPT_TEST_ID",
  "url": "https://signalframeux.vercel.app/",
  "location": "WPT_LOCATION_SLUG",
  "connectivity": "4G",
  "device_profile": "WPT_LOCATION_SLUG",
  "runs": 5,
  "fvonly": 0,
  "successfulFVRuns": "INT",
  "successfulRVRuns": "INT",
  "median": {
    "firstView": { "LCP": "MS", "CLS": "FLOAT", "FCP": "MS", "TTI": "MS", "TBT": "MS", "SpeedIndex": "MS" },
    "repeatView": { "LCP": "MS", "CLS": "FLOAT", "FCP": "MS" }
  },
  "per_run_lcp": ["MS × 5"]
}
```

---

## §6 Recommended Implementation Approach

### Wave structure (1 plan, 3 waves — mirrors 62-01-PLAN.md exactly)

**Wave 0 — W0a: Preflight**
1. Hard-gate on `~/.wpt-api-key` existence and non-empty content; surface BLOCKER and exit 1 if missing.
2. `chmod 600 ~/.wpt-api-key` (idempotent).
3. Snapshot available locations: `curl -s "https://www.webpagetest.org/getLocations.php?f=json" | jq ...` → `vrf-01-locations-snapshot.json`.
4. Confirm prod URL is responding: `curl -sf -o /dev/null --max-time 15 "$PROD_URL"`.
5. Git leak check: `git ls-files | grep -iE 'wpt.*key|api.*key' | wc -l` MUST return `0`.
6. Commit: `chore(63): WPT location snapshot + key/url preflight (VRF-01 wave 0)`.

**Wave 1 — W1a + W1b + W1c: Device runs (sequential submissions; parallel retrieval after queue)**
1. Submit all 3 profiles back-to-back (capture all 3 test IDs before polling — avoids rate-limit
   idle time and minimizes total queue time).
2. Poll each until `statusCode: 200`.
3. Retrieve + prune each to <50 KB via jq recipe (§1 above).
4. Apply BLOCKING per-profile gate (LCP <1000ms AND CLS ≤0.005); exit 1 if either fails.
5. Commit one JSON per device or all three in a single commit cohort (Claude's Discretion per
   62-CONTEXT.md D-01).

**Wave 2 — W2a: Synthesis**
1. Read the three device JSONs + `phase-60-mobile-lhci.json` + `phase-60-realdevice-checkpoint.md`.
2. Compute: per-device LCP/CLS/TTI medians, average real LCP across 3 profiles, real÷synthetic
   divergence ratios, `max(real CLS)`.
3. Write `MID-MILESTONE-CHECKPOINT.md` using §3 schema (all 4 sections + frontmatter + Pitfall #10
   thresholds verbatim).
4. Copy byte-for-byte to phase-folder mirror.
5. Commit: `docs(63): MID-MILESTONE-CHECKPOINT.md synthesis (VRF-04)`.

### Prod URL

Use `https://signalframeux.vercel.app/`. The Phase 62 VRF-02 run confirmed this URL returns prod
(LCP 657ms, 100/100 from `vrf-02-launch-gate-runs.json`). W0a verifies the URL is still responding
before burning quota.

### Rate-limit strategy

WPT free Starter tier = 300 tests/month, 1 concurrent. This phase consumes 3 quota units (each
5-run submission counts as 1 unit, verified Phase 62 RESEARCH.md). Batch all 3 submissions
immediately after W0a completes, before polling. Do not submit one and wait — submit all three,
capture all three test IDs, then poll them in sequence.

---

## §7 Validation Architecture (Nyquist Dimension 8)

`nyquist_validation` is absent from `.planning/config.json` → treated as enabled.

This is a read-only measurement + doc-render phase. There are no automated test specs to write.
Validation is observability-based: each WPT retrieval result is verified deterministically via `jq`
assertions before any commit.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | `jq` assertions (shell) + `bash` exit codes — no test runner needed |
| Config file | none |
| Quick run command | `jq -e '.median.firstView.LCP < 1000 and .median.firstView.CLS <= 0.005 and (.per_run_lcp | length) == 5' .planning/perf-baselines/v1.8/vrf-01-{profile}.json` |
| Full suite command | `for p in ios-iphone13 android-a14 android-midtier; do jq -e '.median.firstView.LCP < 1000 and .median.firstView.CLS <= 0.005 and (.per_run_lcp | length) == 5' .planning/perf-baselines/v1.8/vrf-01-${p}.json || exit 1; done && grep -E '\*\*PASS\*\*' .planning/perf-baselines/v1.8/MID-MILESTONE-CHECKPOINT.md` |

### Phase Requirements → Validation Map

| Req ID | Behavior to verify | Validation command | When |
|--------|-------------------|--------------------|------|
| VRF-01 | Each device JSON exists, <50 KB, 5 runs captured | `jq -e '(.per_run_lcp | length) == 5 and .median.firstView.LCP < 1000 and .median.firstView.CLS <= 0.005' vrf-01-{profile}.json` | After each W1 commit |
| VRF-01 | testId is non-empty (real WPT run, not mock) | `jq -e '.testId | length > 0' vrf-01-{profile}.json` | After each W1 commit |
| VRF-01 | First-view AND repeat-view captured (fvonly=0) | `jq -e '.median.repeatView.LCP' vrf-01-{profile}.json` returns numeric | After each W1 commit |
| VRF-01 | Location slug recorded (audit trail) | `jq -e '.location | length > 0' vrf-01-{profile}.json` | After each W1 commit |
| VRF-01 | No API key committed to repo | `git ls-files | grep -iE 'wpt.*key|api.*key' | wc -l` returns `0` | After W0a commit |
| VRF-04 | MID-MILESTONE-CHECKPOINT.md exists at both paths | `test -f .../MID-MILESTONE-CHECKPOINT.md && test -f .../63-MID-MILESTONE-CHECKPOINT.md` | After W2a commit |
| VRF-04 | PASS sign-off present | `grep -E '\*\*PASS\*\*' .planning/perf-baselines/v1.8/MID-MILESTONE-CHECKPOINT.md` | After W2a commit |
| VRF-04 | Pitfall #10 thresholds verbatim in doc | `grep -E 'real ÷ synthetic > 1\.3' .planning/perf-baselines/v1.8/MID-MILESTONE-CHECKPOINT.md` | After W2a commit |
| VRF-04 | All 3 device JSON paths cited in synthesis | `grep -E 'vrf-01-ios-iphone13|vrf-01-android-a14|vrf-01-android-midtier' MID-MILESTONE-CHECKPOINT.md | wc -l` ≥3 | After W2a commit |
| VRF-04 | Phase 60 synthetic baseline cited | `grep -E 'phase-60-mobile-lhci\.json' MID-MILESTONE-CHECKPOINT.md` | After W2a commit |
| VRF-04 | Phase mirror byte-identical | `diff .../MID-MILESTONE-CHECKPOINT.md .../63-MID-MILESTONE-CHECKPOINT.md` empty | After W2a commit |

### Wave 0 Gaps

None — no test infrastructure needed. All validation is shell `jq` assertions run inline. The
existing Playwright suite and test specs are not involved in Phase 63.

---

## §8 Open Questions / Risks

### 1. WPT free-tier real-device availability

**What we know:** The Phase 62 RESEARCH (62-RESEARCH.md §Tertiary sources) flagged that iPhone 13
specifically may not be in the free-tier real-device list on all days — the Dulles_iPhone slug may
route to an emulated device. The Phase 62-01 plan handles this via slug discovery + fallback
(W1a Step 1 jq filter → fallback `Dulles_iPhone:iPhone-13-Safari.4G`).

**What's unclear:** Whether the fallback slug is still a real Safari device or a Chrome emulation
of Safari. If it's the latter, VRF-01's "iPhone 13/14 Safari" claim is technically inaccurate.

**Recommendation:** Document the actual slug used in the `device_profile` field of the JSON. If the
slug contains `Safari` in the name, accept it regardless of whether it is a hardware device. Note
any emulation discrepancy in the synthesis doc §1 Notes column.

### 2. WPT queue time variance

**What we know:** Phase 62 RESEARCH cited 5–15 min per profile on free tier. Three profiles = up to
45 min of queue/run time. This is expected — the plan must poll with `sleep 30` intervals and not
hard-time-out.

**Risk:** If the free-tier queue is under load (e.g., daytime US East), queue time could extend to
30+ min per profile. The plan task should use `sleep 60` as the polling interval to avoid HTTP
hammering.

**Recommendation:** Submit all 3 profiles before beginning any polling loop.

### 3. Prod URL stability

**What we know:** Phase 62 VRF-02 confirmed `https://signalframeux.vercel.app/` returns prod and
scores LCP 657ms (`vrf-02-launch-gate-runs.json::url`). The branch `chore/v1.7-ratification` is
not yet merged to main. The prod alias still points to the pre-v1.8 deploy (confirmed in
`vrf-05-rum-p75-lcp.json`: deployment predates CIB-05 `/api/vitals` route).

**Risk:** WPT tests against the current prod alias may not include all v1.8 optimizations (CRT-01
through CRT-04) if the branch has not been deployed. VRF-02 at 657ms suggests the deploy IS live,
but W0a should confirm with a curl health check.

**Recommendation:** W0a step 3 confirms the prod URL responds with HTTP 200. If the URL returns
non-200 or the LCP differs dramatically from 657ms (>1.3x = 855ms), surface a HUMAN-NEEDED
deviation in the plan and pause before burning WPT quota.

### 4. WPT free-tier quota burn

**What we know:** 300 tests/month on Starter. 3 submissions = 3 quota units (each 5-run test counts
as 1 unit per WPT docs). This is minimal. However, if W1 fails and must be re-run for a profile,
each retry costs 1 more quota unit.

**Recommendation:** Before submitting all 3, confirm quota headroom via the WPT API (if available)
or proceed with the understanding that up to 6 units might be consumed if one retry is needed.

### 5. Escalation path if any profile fails the LCP <1000ms gate

**What we know:** 62-01-PLAN.md W1a Step 5 specifies: "BLOCKER: Plan 02 and Plan 03 BLOCKED —
escalate as Phase 62.1 / 60.1 per Pitfall #10."

**In Phase 63 context:** Plan 02 and Plan 03 of Phase 62 already completed successfully (VRF-02
PASS, VRF-03 PASS per 62-02-SUMMARY.md). The only downstream work is Phase 64 (3-PR ship) and
Phase 65 (RUM). A real-device gate failure in Phase 63 does NOT block Phase 64 (CRT-05 is
independent) but DOES block declaring v1.8 fully closed.

**Recommendation:** If any profile exceeds LCP 1000ms, open a decimal phase (63.1) for diagnosis,
continue Phase 64 in parallel, and flag VRF-01/VRF-04 as FAIL in Phase 63 VERIFICATION.md.

---

## Sources

### Primary (HIGH confidence)

- `.planning/phases/62-real-device-verification-final-gate/62-01-PLAN.md` — complete W0a→W2a task
  sequence; all curl/jq recipes; JSON schema; acceptance criteria. This is the definitive plan
  source that Phase 63 re-executes.
- `.planning/phases/62-real-device-verification-final-gate/62-RESEARCH.md` — WPT API surface detail,
  Pattern 1 (submission/retrieval), Pattern 4 (synthesis doc schema), all code examples.
- `.planning/phases/62-real-device-verification-final-gate/62-CONTEXT.md` — D-01 through D-12
  locked decisions; Pitfall #10 escalation thresholds in D-07.
- `.planning/phases/62-real-device-verification-final-gate/62-01-SUMMARY.md` — deferred status +
  v1.9 unblock recipe; confirms Phase 63 is the direct continuation.
- `.planning/perf-baselines/v1.8/phase-60-realdevice-checkpoint.md` — synthesis doc format
  precedent (structure + frontmatter + §4 sign-off pattern).
- `.planning/perf-baselines/v1.8/vrf-02-launch-gate-runs.json` — prod URL confirmed (LCP 657ms,
  100/100), `url: "https://signalframeux.vercel.app/"`.

### Secondary (MEDIUM confidence)

- `.planning/v1.8-MILESTONE-AUDIT.md` §2 — VRF-01 and VRF-04 gap detail; activation map confirms
  Phase 63 is the correct phase (not 62 or 64).
- `.planning/REQUIREMENTS.md` §Verification lines 46–49 — exact VRF-01 and VRF-04 requirement text.

### Tertiary (LOW confidence — not needed, documented for completeness)

- Original 62-RESEARCH.md §Tertiary: "WebSearch only" findings about WPT free-tier iPhone 13 real-
  device availability uncertainty. Handled via slug-discovery fallback in the plan.

---

## Metadata

**Confidence breakdown:**

| Area | Level | Reason |
|------|-------|--------|
| WPT API (endpoints, params, key handling) | HIGH | Documented in 62-RESEARCH.md Pattern 1 + 62-01-PLAN.md W1a; verified against WPT docs at Phase 62 research time |
| Device profile slugs | MEDIUM | Slug discovery is runtime (getLocations.php); specific slugs may differ from fallbacks; fallback logic is HIGH confidence |
| Pitfall #10 thresholds | HIGH | Verbatim from 62-01-PLAN.md W2a lines 449–451; locked in D-07 |
| Synthesis doc schema | HIGH | 62-RESEARCH.md Pattern 4 + 62-01-PLAN.md W2a acceptance criteria are exhaustive |
| Rate limits + queue times | MEDIUM | Estimated from Phase 62 research; varies with WPT free-tier load |

**Research date:** 2026-04-27
**Valid until:** 2026-05-27 (WPT API surface is stable; slug availability varies day-to-day but
fallback logic handles it)
