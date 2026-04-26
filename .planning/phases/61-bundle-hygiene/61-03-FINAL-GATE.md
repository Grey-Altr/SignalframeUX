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

(populated by Task 2 after final stale-chunk-guarded build)

---

## §4 AES-04 — Pixel-diff result (invisible-by-construction)

(populated by Task 3 after running tests/v1.8-phase61-bundle-hygiene.spec.ts)

---

## §5 Phase 61 final verdict

(populated by Task 4 after §3 + §4 close)
