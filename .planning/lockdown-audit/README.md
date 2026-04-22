# LOCKDOWN AUDIT

**Goal:** distill a locked-in design system (`LOCKDOWN.md`) from the state of the site across all branches — not invent new rules.

**Inputs:**
- `main` (b650bf5) — north-star baseline; hero + navbar are **pre-locked** by user statement (2026-04-21)
- `cdb-v3-dossier` (5dc0ecc) — 6-plate dossier exploration; incorporation candidates
- `cdb-v2-broadcast` (8a14ca3) — vault primitives + V5 FIELD RECORDING
- `aesthetic-deep-dive` (4d23c03) — foundational cdB reset

**Skip list:**
- `feature/navbar-redesign` — superseded by main's cascade work
- `next-16-migration` — stale (04-10), mostly lockfile churn
- `cdb-v1` / `cdb-v2` — identical tips, covered by `cdb-v2-broadcast` audit

---

## Method

Per branch, per surface (route + scroll state):

| Field | What it holds |
|---|---|
| **Screenshot** | `lockdown-audit/<branch>/<route>-<state>.png` |
| **GitHub link** | `https://github.com/Grey-Altr/SignalframeUX/blob/<sha>/<path>` |
| **Local URL** | `http://localhost:3200<route>` (while dev is on that branch) |
| **Distinctive move** | one sentence |
| **Rule candidate** | one falsifiable rule this surface proves |
| **My read** | `keep` / `cut` / `your-eye-needed` |
| **User mark** | 👍 / 👎 / redirect (filled during review) |

## Output

- Per branch: `A-main.md`, `B-cdb-v3-dossier.md`, `C-cdb-v2-broadcast.md`, `D-aesthetic-deep-dive.md`
- Final distillation: `.planning/LOCKDOWN.md` — two sections (AESTHETICS, HIG), every rule cites the shipped file(s) it was extracted from

## Rules of the audit

1. **No inventions.** If a rule isn't proven by shipped pixels, it doesn't belong.
2. **Falsifiable only.** "Zero border-radius" ✓. "Minimal rounding" ✗.
3. **My reads are opinionated.** User redirects by marking 👎 or writing a note.
4. **Hero + navbar pre-locked.** Baseline grammar. No judgment needed; they ARE the spec.
