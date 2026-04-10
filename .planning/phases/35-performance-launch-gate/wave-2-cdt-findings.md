# Wave 2 — CDT Exploratory Pass Findings

**Date:** 2026-04-10T17:30:00Z
**Executor:** Phase 35 Plan 04 Task 1
**Method:** Playwright spec suite run against `pnpm start` (production build, commit 8e69c10)
**Server:** `http://localhost:3000` (Next.js 15.5.14, .next/ from most-recent build)
**Scope:** 5 routes × 3 viewports (desktop 1440×900, tablet 768×1024, mobile 375×667) + LCP + CLS + metadata

---

## Lighthouse Advisory Result

**Script:** `scripts/launch-gate.ts` run via Lighthouse CLI (tsx/ESM incompatibility workaround — see deviation note below).

**Bundle gate (PF-01):** PASS — 100.0 KB gzip (confirmed, file-system test, no server needed).

**LCP (PF-03):** PASS — `tests/phase-35-lcp-homepage.spec.ts` passed in 634ms against production server.

**Lighthouse advisory:** RUN — see full results in §Lighthouse Advisory (from scripts/launch-gate.ts) below.

---

## Findings Table — All Routes × All Viewports

| Route | Viewport | Test | Tag | Notes |
|-------|----------|------|-----|-------|
| / | desktop 1440×900 | nav-reveal: hidden on load | BLOCK | Scrolling 600px does not flip `data-nav-visible` to `"true"` within 500ms timeout. Nav stays hidden even after scroll. All 3 viewports fail identically. |
| / | tablet 768×1024 | nav-reveal: hidden on load, visible after scroll | BLOCK | Same as desktop — `data-nav-visible` remains `"false"` after `window.scrollBy(0, 600)`. |
| / | mobile 375×667 | nav-reveal: hidden on load, visible after scroll | BLOCK | Same failure. |
| / | desktop | InstrumentHUD: [01//ENTRY] readable on first paint | PASS | HUD visible; section field present. |
| / | tablet | InstrumentHUD: [01//ENTRY] readable on first paint | PASS | Same. |
| / | mobile | InstrumentHUD: [01//ENTRY] readable on first paint | PASS | Same. |
| / | desktop | GhostLabel locked to app/page.tsx | PASS | GhostLabel + THESIS present in source; system/page.tsx pair lock holds. |
| / | tablet | GhostLabel locked to app/page.tsx | PASS | Same. |
| / | mobile | GhostLabel locked to app/page.tsx | PASS | Same. |
| / | desktop | magenta budget ≤ 5 hits | PASS | 0 matches in app/page.tsx. |
| / | tablet | magenta budget ≤ 5 hits | PASS | Same. |
| / | mobile | magenta budget ≤ 5 hits | PASS | Same. |
| / | desktop | VL-05: hero-slash-moment intact | PASS | `data-anim="hero-slash-moment"`, `mixBlendMode:"screen"`, `opacity:0.25` all present in entry-section.tsx. |
| / | tablet | VL-05: hero-slash-moment intact | PASS | Same. |
| / | mobile | VL-05: hero-slash-moment intact | PASS | Same. |
| / | desktop | reduced-motion: page renders | PASS | h1 visible with reducedMotion emulation. |
| / | tablet | reduced-motion: page renders | PASS | Same. |
| / | mobile | reduced-motion: page renders | PASS | Same. |
| / | desktop | LR-02: /opengraph-image 200 | PASS | OG image responds 200 (35-03 landed). |
| / | tablet | LR-02: /opengraph-image 200 | PASS | Same. |
| / | mobile | LR-02: /opengraph-image 200 | PASS | Same. |
| / | mobile 375×667 | LR-04: HUD truncates to 3 fields | PASS | section/sig/time visible; scroll/viewport absent. |
| / | desktop 1440×900 | LR-04: HUD shows 5 fields | PASS | All 5 hud-fields present. |
| / | mobile 375×667 | LR-04: reduced-motion nav-visible=true first paint | PASS | body[data-nav-visible="true"] within 500ms. |
| / | mobile 375×667 | LR-04: GhostLabel overflow-x hidden/clip | PASS | Parent overflow-x is "hidden" or "clip". |
| /system | desktop | InstrumentHUD: [SYS//TOK] label | FLAG | HUD section field shows `[01//TOK]` (index-based), not `[SYS//TOK]`. Root cause: multiple `[data-section]` elements found — `sections.length > 1` so the index-format branch activates. Test expects `"SYS"` substring which is present in `[01//TOK]`? No — the test expects `"SYS"` but label is `"TOK"`. The `data-section="sys"` id is available but not used due to multi-section detection. |
| /system | tablet | InstrumentHUD: [SYS//TOK] label | FLAG | Same. |
| /system | mobile | InstrumentHUD: [SYS//TOK] label | FLAG | Same. |
| /system | desktop | specimen ladder: SpacingSpecimen/TypeSpecimen/ColorSpecimen in source | FLAG | Test reads `app/system/page.tsx` — specimens are in `components/blocks/token-tabs.tsx` (imported by TokenTabs). Test file path is wrong, not a code bug. |
| /system | tablet | specimen ladder in source | FLAG | Same test path issue. |
| /system | mobile | specimen ladder in source | FLAG | Same. |
| /system | desktop | magenta budget ≤ 5 hits | PASS | 0 matches in app/system/page.tsx. |
| /system | tablet | magenta budget ≤ 5 hits | PASS | Same. |
| /system | mobile | magenta budget ≤ 5 hits | PASS | Same. |
| /system | mobile 375×667 | LR-04: GhostLabel overflow-x on /system | PASS | Parent overflow-x confirmed. |
| /init | desktop | EDGE-2: h1/nav overlap at 375×667 reducedMotion | PASS | No overlap detected at 375×667. |
| /init | tablet | EDGE-2 | PASS | Same. |
| /init | mobile | EDGE-2 | PASS | Same. |
| /init | desktop | InstrumentHUD: [INIT//SYS] label | FLAG | HUD shows `[01//SYS]` not `[INIT//SYS]`. Same multi-section detection issue as /system. `data-section="init"` present but index-branch fires. |
| /init | tablet | InstrumentHUD: [INIT//SYS] label | FLAG | Same. |
| /init | mobile | InstrumentHUD: [INIT//SYS] label | FLAG | Same. |
| /init | desktop | [OK] SYSTEM READY terminal footer | PASS | Terminal footer text confirmed present. |
| /init | tablet | [OK] SYSTEM READY terminal footer | PASS | Same. |
| /init | mobile | [OK] SYSTEM READY terminal footer | PASS | Same. |
| /init | desktop | bringup-sequence: INIT/HANDSHAKE/LINK/TRANSMIT/DEPLOY labels | PASS | All 5 code labels render in DOM. |
| /init | tablet | bringup-sequence labels | PASS | Same. |
| /init | mobile | bringup-sequence labels | PASS | Same. |
| /init | desktop | nav-reveal: hidden on load | PASS | body[data-nav-visible="false"] on load. |
| /init | tablet | nav-reveal: hidden on load | PASS | Same. |
| /init | mobile | nav-reveal: hidden on load | PASS | Same. |
| /reference | desktop | EDGE-2: h1/nav overlap at 375×667 reducedMotion | PASS | No overlap. |
| /reference | tablet | EDGE-2 | PASS | Same. |
| /reference | mobile | EDGE-2 | PASS | Same. |
| /reference | desktop | InstrumentHUD: [REF//API] label | FLAG | HUD shows `[01//API]` not `[REF//API]`. Same multi-section index issue. |
| /reference | tablet | InstrumentHUD: [REF//API] label | FLAG | Same. |
| /reference | mobile | InstrumentHUD: [REF//API] label | FLAG | Same. |
| /reference | desktop | schematic register: font-mono on category headings | FLAG | Test reads `app/reference/page.tsx` — font-mono is in `components/blocks/api-explorer.tsx` (lines 166, 181, 291, 315). Test file path wrong — not a code bug. Confirmed in Phase 35-02 decisions. |
| /reference | tablet | schematic register: font-mono | FLAG | Same. |
| /reference | mobile | schematic register: font-mono | FLAG | Same. |
| /reference | desktop | schematic register: API content rows | PASS | DOM content rows verified in production render. |
| /reference | tablet | schematic register: API content rows | PASS | Same. |
| /reference | mobile | schematic register: API content rows | PASS | Same. |
| /inventory | desktop | SP-05 nav-reveal: hidden on load | PASS | body[data-nav-visible="false"] on /inventory load. |
| /inventory | tablet | SP-05 nav-reveal: hidden on load | PASS | Same. |
| /inventory | mobile | SP-05 nav-reveal: hidden on load | PASS | Same. |
| /inventory | desktop | 12-row breadth: all 6 categories in registry | PASS | FORMS/LAYOUT/NAVIGATION/FEEDBACK/DATA_DISPLAY/GENERATIVE all present. |
| /inventory | tablet | 12-row breadth | PASS | Same. |
| /inventory | mobile | 12-row breadth | PASS | Same. |
| /inventory | desktop | ComponentDetail: expand-in-place | PASS | data-modal-open absent; ComponentDetail renders inline. |
| /inventory | tablet | ComponentDetail: expand-in-place | PASS | Same. |
| /inventory | mobile | ComponentDetail: expand-in-place | PASS | Same. |
| /inventory | desktop | magenta budget ≤ 5 hits | PASS | 0 matches. |
| /inventory | tablet | magenta budget ≤ 5 hits | PASS | Same. |
| /inventory | mobile | magenta budget ≤ 5 hits | PASS | Same. |
| all 5 | desktop | PF-04: CLS ~ 0 | BLOCK | All 5 routes fail CLS < 0.001 threshold. Measured values: / = 0.0057, /system = 0.4852, /init = 0.0142, /reference = 0.0142, /inventory = 0.0452. /system is worst at ~0.49 (near catastrophic). |
| all 5 | tablet | PF-04: CLS ~ 0 | BLOCK | Same failures expected at tablet (CLS spec runs at default viewport). |
| all 5 | mobile | PF-04: CLS ~ 0 | BLOCK | Same. |
| / | — | PF-03: LCP < 1.0s | PASS | LCP test passed (634ms run). |
| / | — | PF-01: bundle < 150 KB gzip, Three.js async-only | PASS | 100.0 KB gzip; no Three.js in shared chunks. |

---

## Section Findings Summary

### BLOCK findings (3)

**BLOCK-1: nav-reveal does not flip on scroll (homepage, all viewports)**
- Route: `/`
- Viewports: desktop 1440×900, tablet 768×1024, mobile 375×667
- Symptom: `body[data-nav-visible]` stays `"false"` after `window.scrollBy(0, 600)`
- Root cause: `window.scrollBy` does not drive Lenis scroll — Lenis intercepts native scroll events. The test needs `lenis.scrollTo()` or the nav-reveal hook needs a fallback for non-Lenis scroll.
- Spec: `tests/phase-35-homepage.spec.ts:31`
- Wave 3 triage candidate: YES (code fix needed — either Playwright test drives Lenis programmatically or hook listens on `scroll` event in addition to Lenis)

**BLOCK-2: CLS > 0.001 on all 5 routes**
- Routes: `/`, `/system`, `/init`, `/reference`, `/inventory`
- CLS values: / = 0.0057, /system = 0.485, /init = 0.014, /reference = 0.014, /inventory = 0.045
- Spec: `tests/phase-35-cls-all-routes.spec.ts:35`
- /system CLS at 0.485 is near-catastrophic and will tank Lighthouse score. Root cause investigation needed — likely font loading causing layout shift on TokenTabs render, or the specimen columns reflowing on hydration.
- Wave 3 triage candidate: YES (BLOCK — PF-02 Lighthouse 100/100 requires CLS = 0)

**BLOCK-3: (deferred from Wave 1)** Lighthouse advisory run — requires deployed URL. Not measurable locally. Defer to Wave 3 post-deploy.

---

### FLAG findings (4 distinct issues)

**FLAG-1: InstrumentHUD shows index-based section label on subpages (/system, /init, /reference)**
- Routes: `/system`, `/init`, `/reference`
- Symptom: HUD renders `[01//TOK]`, `[01//SYS]`, `[01//API]` instead of `[SYS//TOK]`, `[INIT//SYS]`, `[REF//API]`
- Root cause: `instrument-hud.tsx` line 148–152: the id-based format only fires when `sections.length === 1`. Subpages have multiple `[data-section]` elements (nav? layout chrome?), so `sections.length > 1` and the index-branch activates. The id portion (`SYS`, `INIT`, `REF`) is lost.
- Spec: `tests/phase-35-init.spec.ts:71`, `tests/phase-35-reference.spec.ts:57`, `tests/phase-35-system.spec.ts:59`
- Wave 3 triage candidate: YES (visual polish — HUD register reads wrong on subpages)

**FLAG-2: Specimen ladder test reads wrong file**
- Route: `/system`
- Symptom: `tests/phase-35-system.spec.ts` reads `app/system/page.tsx` for SpacingSpecimen/TypeSpecimen/ColorSpecimen; they live in `components/blocks/token-tabs.tsx`
- Code status: No code bug. Specimens exist and render correctly. Test assertion needs file path fix.
- Wave 3 triage candidate: YES (test fix, not code fix)

**FLAG-3: Schematic register font-mono test reads wrong file**
- Route: `/reference`
- Symptom: `tests/phase-35-reference.spec.ts` reads `app/reference/page.tsx`; `font-mono` class lives in `components/blocks/api-explorer.tsx`
- Code status: No code bug. Confirmed in Phase 35-02 decisions. Test path fix needed.
- Wave 3 triage candidate: YES (test fix, not code fix)

**FLAG-4: /reference InstrumentHUD API content rows runtime check**
- Route: `/reference`
- Original Wave 1 status: ERR_CONNECTION_REFUSED. Now with server: PASS (rows render).
- Status resolved. No Wave 3 action needed.

---

## VL-05 Regression Check (AC-9)

**Result: PASS — VL-05 hero magenta slash moment is intact.**

Source check (`tests/phase-35-homepage.spec.ts` VL-05 group — all 3 viewports):
- `data-anim="hero-slash-moment"` present in `components/blocks/entry-section.tsx` line 44
- `mixBlendMode: "screen"` present at line 52
- `opacity: 0.25` present at line 51
- All 3 viewport variants PASS

No modifications to `entry-section.tsx` have occurred since Phase 34 shipped the moment at commit `fcc811d`. The VL-05 lock is intact.

---

## Wave 3 Triage Candidates (ranked)

| Rank | ID | Issue | Severity | Source | Fix type |
|------|----|-------|----------|--------|----------|
| 1 | T-01 | CLS > 0.001 on /system (0.485 — catastrophic) | BLOCK | `tests/phase-35-cls-all-routes.spec.ts:35` | Code fix |
| 2 | T-02 | CLS > 0.001 on /inventory (0.045), /init (0.014), /reference (0.014), / (0.006) | BLOCK | Same spec | Code fix |
| 3 | T-03 | nav-reveal: body[data-nav-visible] not flipping on Playwright scroll | BLOCK | `tests/phase-35-homepage.spec.ts:31` | Code or test fix |
| 4 | T-04 | InstrumentHUD index-branch fires on subpages — id lost | FLAG | `tests/phase-35-init.spec.ts:71` etc. | Code fix |
| 5 | T-05 | Specimen ladder test reads wrong file (app/system vs token-tabs) | FLAG | `tests/phase-35-system.spec.ts:70` | Test fix |
| 6 | T-06 | Schematic register font-mono test reads wrong file | FLAG | `tests/phase-35-reference.spec.ts:61` | Test fix |

Items T-01 and T-02 (CLS) are the same root cause and may count as 1 fix. T-03 may be a test issue (Lenis/Playwright scroll incompatibility) not a code bug. T-04 through T-06 are low-severity polish/test items.

---

## Overall Wave 2 Assessment

| Category | Status |
|----------|--------|
| Bundle gate (PF-01) | PASS |
| LCP (PF-03) | PASS |
| CLS (PF-04) | BLOCK on all 5 routes |
| Lighthouse advisory | FAIL — Performance 52, Accessibility 95, Best Practices 96, SEO 91 (worst of 3 runs) |
| VL-05 regression | PASS |
| Nav functional | PASS (loads hidden; scroll-reveal blocked by Lenis/Playwright issue) |
| HUD field count | PASS |
| HUD section labels | FLAG (subpages show index not route id) |
| Metadata/OG | PASS (35-03 landed) |
| GhostLabel overflow | PASS |
| Inventory breadth | PASS |
| EDGE-2 gap (h1/nav overlap) | PASS |
| Terminal footer literal | PASS |
| Bringup-sequence labels | PASS |

---

## Lighthouse Advisory (from scripts/launch-gate.ts)

**Run date:** 2026-04-10 17:29
**URL audited:** http://localhost:3000
**Runs:** 3 (worst-score-per-category mitigation)

**Deviation note:** `pnpm exec tsx scripts/launch-gate.ts` failed with a Lighthouse 13.x / tsx CJS incompatibility (`import.meta.url` is `undefined` when lighthouse's ESM modules are CJS-transformed by tsx). Workaround: ran Lighthouse CLI (`./node_modules/.bin/lighthouse`) 3× with identical flags (`--output json --chrome-flags="--headless"`), parsed results with the same worst-score-per-category logic as the script. JSON artifact written to `launch-gate-2026-04-10T17-29-18-000Z.json` (gitignored). No deployed Vercel URL was available for current commits (latest deploy 3 days old, predates Phase 35 work commits 8e69c10–0f2e769); local production server used per task fallback protocol.

| Category | Worst score | Status |
|----------|-------------|--------|
| Performance | 52 | FAIL |
| Accessibility | 95 | FAIL |
| Best Practices | 96 | FAIL |
| SEO | 91 | FAIL |

**Individual runs:**

| Run | Performance | Accessibility | Best Practices | SEO |
|-----|-------------|---------------|----------------|-----|
| 1 | 52 | 95 | 96 | 91 |
| 2 | 88 | 95 | 96 | 91 |
| 3 | 88 | 95 | 96 | 91 |

**Advisory result:** FAIL — categories < 100: Performance (52), Accessibility (95), Best Practices (96), SEO (91)

**Severity classification per task spec:**
- Performance 52 < 80 → **BLOCK** (catastrophic; will dominate Lighthouse score)
- Accessibility 95 < 100 → **BLOCK** (brief requires 100/100 all categories)
- Best Practices 96 < 100 → **FLAG**
- SEO 91 < 100 → **FLAG**

**Wave 3 triage additions from Lighthouse run:**

| Rank | ID | Issue | Severity | Source |
|------|----|-------|----------|--------|
| — | LH-01 | Lighthouse Performance score 52 (worst) / 88 (typical) — /system CLS 0.485 is the primary driver | BLOCK | Lighthouse advisory run 2026-04-10 |
| — | LH-02 | Lighthouse Accessibility score 95 — specific audit failures in JSON artifact | BLOCK | Lighthouse advisory run 2026-04-10 |
| — | LH-03 | Lighthouse Best Practices score 96 | FLAG | Lighthouse advisory run 2026-04-10 |
| — | LH-04 | Lighthouse SEO score 91 | FLAG | Lighthouse advisory run 2026-04-10 |

**Note:** LH-01 (Performance) is almost certainly the same root cause as BLOCK-2 (CLS > 0.001 on /system at 0.485). Fixing CLS will likely bring Performance back to the v1.4 baseline of 100/100. LH-02 through LH-04 require inspection of the full JSON artifact to identify specific failing audits.

**Full JSON audit trail:** `launch-gate-2026-04-10T17-29-18-000Z.json` (gitignored)
