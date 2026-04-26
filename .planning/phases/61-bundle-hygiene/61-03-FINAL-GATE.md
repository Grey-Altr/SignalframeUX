# 61-03 Final Gate — BND-01, BND-03, BND-04, AES-04

**Plan:** 61-03
**Phase:** 61 — Bundle Hygiene
**Captured:** 2026-04-26
**Source plans:** 61-01 (eager-path: radix-ui + input-otp), 61-02 (lazy-path: cmdk + vaul + sonner + react-day-picker)
**Final next.config.ts state:** `optimizePackageImports: ["lucide-react", "radix-ui", "input-otp", "cmdk", "vaul", "sonner", "react-day-picker"]`
**Build invocation contract:** `rm -rf .next/cache .next && ANALYZE=true pnpm build` (BND-04 stale-chunk guard mandatory)
**Gating source:** "Route (app)" stdout table from `pnpm build`. The `.next/analyze/client.html` chartData is FORBIDDEN as a gating source (ROADMAP success criterion 1).

---

## §1 BND-03 — sf barrel directive-free (verify-only)

**Requirement:** `components/sf/index.ts` MUST contain zero `'use client'` directives (v1.3 barrel-discipline rule from CLAUDE.md and REQUIREMENTS.md BND-03).

**Verification command:**

```bash
grep -c "use client" components/sf/index.ts
```

**Observed result:**

- Match count: **0**
- Exit code: **1** (grep -c returns 1 when zero matches)

**Verdict: PASS** — components/sf/index.ts is directive-free at the v1.8-lock end-state. This is consistent with the pre-audit finding and was preserved through Plan 01 + Plan 02 changes (those plans modified only `next.config.ts` — the sf barrel was not touched).

---

## §2 BND-04 — Stale-chunk guard documentation (doc-gate)

**Requirement:** The stale-chunk guard `rm -rf .next/cache .next` MUST be documented as mandatory prefix in `.planning/phases/61-bundle-hygiene/61-RESEARCH.md` AND replicated in the headers of `61-01-RESEARCH-LOG.md` and `61-02-RESEARCH-LOG.md`.

**Verification commands and observed results:**

```bash
grep -E "rm -rf \.next/cache \.next" .planning/phases/61-bundle-hygiene/61-RESEARCH.md
```

- Matches observed: 7 (Build invocation header, §4 Measurement Protocol body, BND-01 row, BND-02 row, BND-04 row, Risks §1 body, References §9)
- Exit code: 0

```bash
grep -E "rm -rf \.next/cache \.next" .planning/phases/61-bundle-hygiene/61-01-RESEARCH-LOG.md
```

- Matches observed: 4 (Plan-level Build invocation header + Build 0/A/B per-build invocation lines)
- Exit code: 0

```bash
grep -E "rm -rf \.next/cache \.next" .planning/phases/61-bundle-hygiene/61-02-RESEARCH-LOG.md
```

- Matches observed: 4 (Plan-level Build invocation header + Build B carry-over / C / D per-build invocation lines)
- Exit code: 0

**Verdict: PASS** — Stale-chunk guard documented in all three required locations (61-RESEARCH.md + 61-01-RESEARCH-LOG.md + 61-02-RESEARCH-LOG.md). Every gating measurement in Phase 61 was prefixed with the guard per BND-04 mandate (audit trail visible in each per-build "Build invocation:" line of both RESEARCH-LOG files).

---

## §3 BND-01 — Final gate (Shared by all + reduction%)

**Build invocation:**

```bash
rm -rf .next/cache .next && ANALYZE=true pnpm build 2>&1 | tee /tmp/phase61-build-final.log
```

**Stale-chunk guard:** APPLIED (BND-04)
**Timestamp:** 2026-04-26T20:32Z
**Source:** `/tmp/phase61-build-final.log` Route (app) stdout table

### Route (app) snapshot (verbatim, gating source)

```
Route (app)                                 Size  First Load JS  Revalidate  Expire
┌ ○ /                                    9.48 kB         264 kB
├ ○ /_not-found                            144 B         103 kB
├ ƒ /api/vitals                            144 B         103 kB
├ ○ /builds                                152 B         254 kB
├ ● /builds/[slug]                         151 B         254 kB
├ ○ /icon                                  144 B         103 kB
├ ○ /init                                 1.8 kB         251 kB
├ ○ /inventory                           11.8 kB         267 kB
├ ○ /opengraph-image                       144 B         103 kB
├ ○ /reference                           23.9 kB         273 kB
├ ○ /sitemap.xml                           144 B         103 kB
├ ○ /system                              9.19 kB         258 kB         15m      1y
└ ○ /twitter-image                         144 B         103 kB
+ First Load JS shared by all             103 kB
  ├ chunks/2979-7e3b1be684627f10.js      45.8 kB
  ├ chunks/5791061e-b51f32ecb5a3272a.js  54.2 kB
  └ other shared chunks (total)          2.56 kB
```

### BND-01 primary gate (ROADMAP success criterion 1) — Shared by all ≤ 102 KB

- `final_shared` = **103 KB**
- Assertion: `final_shared <= 102` → **103 <= 102 is FALSE**
- Verdict: **FAIL — BND-01 primary gate NOT MET**

The shared-floor remains at 103 KB across Build 0 (lucide-react only), Build A (radix-ui), Build B (input-otp), Build C (cmdk + vaul), Build D (sonner + react-day-picker), and this final stale-chunk-guarded gating build. The 1 KB gap to the ≤102 KB target was unreachable through the entire `optimizePackageImports` lever — confirming both 61-01 row A's prediction ("the 1 KB gap to BND-01 must come from either Plan 02 lazy-package transforms shifting marginal modules off the shared floor, OR a separate vector outside Phase 61's scope") and 61-02 row D's confirmation ("Lazy-path harvest is complete at 0 KB delta on Shared by all").

**Per-route First Load JS deltas vs Build 0** (informational — these confirm Phase 61's secondary harvest):

| Route | Build 0 (KB) | Final (KB) | Δ (KB) |
|-------|--------------|------------|--------|
| `/` | 280 | 264 | −16 |
| `/system` | 274 | 258 | −16 |
| `/inventory` | 282 | 267 | −15 |
| `/init` | 266 | 251 | −15 |
| `/reference` | 288 | 273 | −15 |
| `/builds` | 269 | 254 | −15 |
| `/_not-found` | 103 | 103 | 0 |

The `/` First Load JS dropped 16 KB (5.7%) and every Radix-consuming route dropped 15-16 KB. This is the entirety of the Phase 61 BND-02 harvest — meaningful at the route level, zero at the gating Shared-by-all floor.

### BND-01 secondary gate (ROADMAP success criterion 1) — 119 KiB unused-JS reduced ≥ 80%

**Reduction percentage formula** (per 61-03-PLAN.md `<interfaces>` section):

```
delta = (B0_3302 + B0_7525) - (Bf_3302 + Bf_7525)
reduction_percentage = (delta / B0_unused) * 100
```

Where:

- `B0_3302 = 163,174 B = 159.35 KB` (Build 0 chunk 3302 raw size; per 61-01-RESEARCH-LOG.md "Chunk 3302 / 7525 individual sizes (Build 0)")
- `B0_7525 = 76,893 B = 75.09 KB` (Build 0 chunk 7525 raw size; same source)
- `B0_3302 + B0_7525 = 240,067 B = 234.44 KB` (Build 0 baseline sum)
- `B0_unused = 119 KiB` (the v1.8-start unused-JS budget per ROADMAP success criterion 1)

**Final-build chunk attribution** (read from `ls -la .next/static/chunks/` after the gating build above):

- `Bf_7525` = `chunks/7525-0ad32677ff03b3b4.js` = **76,392 B = 74.60 KB** (filename hash drifted from Build 0's `7525-bd3c686ad4f95bc2.js`; numeric prefix `7525-` matched, popper-floating cluster identity preserved per 61-01-RESEARCH-LOG.md row A interpretation)
- `Bf_3302` = **MISSING** — no chunk with prefix `3302-` exists in the final build. The original chunk 3302 (Radix aggregate at Build 0) was fragmented by the `optimizePackageImports: ["radix-ui"]` transform, with successor `chunks/4335-34c9973f1c6cc6ef.js` (= 112,377 B = 109.74 KB) attributed by 61-01-RESEARCH-LOG.md row A as the dominant Radix-aggregate replacement chunk.

This invokes the **FALSE-PASS GUARD** mandated by 61-03-PLAN.md `<acceptance_criteria>`: "If `Bf_3302` or `Bf_7525` successor chunk cannot be located by package signature ... default to the conservative interpretation `Bf_X = B0_X` for that chunk (zero reduction credit). Do NOT interpret a missing chunk as 'size = 0' — that would inflate the reduction% to a false PASS."

The plan's worded condition for the guard is "successor chunk cannot be located by package signature." Strictly, chunk 4335 IS located by package signature (Radix aggregate ~109.74 KB parsed; the same role chunk 3302 played at Build 0). Both interpretations are recorded below for transparency.

#### Scenario A — FALSE-PASS GUARD strict literal (Bf_3302 := B0_3302; chunk 3302 numeric ID missing → no reduction credit)

```
Bf_3302 = 163,174 B = 159.35 KB  (defaulted to B0_3302 per FALSE-PASS GUARD)
Bf_7525 = 76,392 B = 74.60 KB
Bf_sum  = 233.95 KB
delta   = 234.44 - 233.95 = 0.49 KB
reduction_percentage = (0.49 / 119) * 100 = 0.41%
```

Assertion: `0.41 >= 80` → **FALSE → FAIL**

#### Scenario B — package-signature attribution (chunk 4335 → Bf_3302 successor)

```
Bf_3302 = 112,377 B = 109.74 KB  (chunks/4335-34c9973f1c6cc6ef.js attributed per 61-01-RESEARCH-LOG.md row A)
Bf_7525 = 76,392 B = 74.60 KB
Bf_sum  = 184.34 KB
delta   = 234.44 - 184.34 = 50.10 KB
reduction_percentage = (50.10 / 119) * 100 = 42.10%
```

Assertion: `42.10 >= 80` → **FALSE → FAIL**

#### BND-01 secondary gate verdict

**Both scenarios FAIL the ≥80% reduction target.** Even under the most generous attribution (Scenario B), the realized reduction is 42.10% — roughly half the ROADMAP success criterion's 80% threshold. The realistic FALSE-PASS-GUARD-strict reading (Scenario A) shows 0.41% — effectively zero reduction in the chunk-3302+7525 sum, because chunk 3302 fragmented into multiple smaller chunks (4335 + others) rather than shrinking through tree-shaking.

This finding is **mechanically consistent with what 61-01 row A documented**: the Radix barrel-rewrite transform splits the aggregate chunk by sub-package, redistributing bytes rather than eliminating them. The 119 KiB unused-JS budget assumed by ROADMAP success criterion 1 was sourced from the v1.8-start Lighthouse "Reduce unused JavaScript" audit — that audit measures bytes the browser downloads but does not execute on initial render. `optimizePackageImports` reduces what the browser downloads only when the imported barrel actually contained substantial unused exports. For the Radix meta-package as used in this codebase (27 components, all of them eagerly used through the sf barrel), the realized unused-export deletion was modest.

### §3 final verdict — BND-01

| Sub-gate | Threshold | Observed | Verdict |
|----------|-----------|----------|---------|
| Primary: `Shared by all` ≤ 102 KB | ≤102 KB | 103 KB | **FAIL** |
| Secondary: 119 KiB unused-JS reduced ≥80% (Scenario A — guard-strict) | ≥80% | 0.41% | **FAIL** |
| Secondary: 119 KiB unused-JS reduced ≥80% (Scenario B — attribution) | ≥80% | 42.10% | **FAIL** |

**BND-01 verdict: NOT MET.** The 1 KB primary gap (103 → 102) and the secondary reduction% deficit are not closeable through the `optimizePackageImports` lever alone. Phase 61's mandated scope ("Use `optimizePackageImports` extension as the lever") is exhausted at the end of Build D (Plan 02). Escalation recommendation in §5.

---

## §4 AES-04 — Pixel-diff result (invisible-by-construction)

(populated by Task 3 after running tests/v1.8-phase61-bundle-hygiene.spec.ts)

---

## §5 Phase 61 final verdict

(populated by Task 4 after §3 + §4 close)
