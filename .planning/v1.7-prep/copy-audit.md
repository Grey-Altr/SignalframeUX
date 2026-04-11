# Copy Audit — SF//UX v1.7 Prep

Task 17 from the v1.7 dispatch. All user-facing strings audited against the [[culture-division-voice-guide]]: "Swiss precision meets DIY energy." "Work that has no wasted surface area." No superlatives, warm filler, vague claims, corporate speak.

---

## Hard Flags (Must Fix)

### 1. Component Count Inconsistency — 4 Different Numbers

| Count | Location | File:Line |
|-------|----------|-----------|
| **28** | Stats band, hero, homepage meta | `stats-band.tsx:2`, `hero.tsx:93`, `page.tsx:17` |
| **54** | Inventory meta, OG image, SYSTEM_STATS | `inventory/page.tsx:15`, `opengraph-image.tsx:70`, dynamic from registry |
| **340+** | Manifesto band, init page step 03 | `manifesto-band.tsx:65`, `init/page.tsx:63` |

This is the single most serious copy problem. Three contradicting counts on the same site. Reconcile to one accurate number (likely 54 from the live registry).

### 2. Version Inconsistency

| Version | Location | File:Line |
|---------|----------|-----------|
| `v1.5 -- REDESIGN` | OG image | `opengraph-image.tsx:64` |
| `SF//UX v2.0.0` | Hero component | `hero.tsx:121` |

Pick one. Update both to match current version.

### 3. OKLCH Scale Count — Off By One

| Count | Location | File:Line |
|-------|----------|-----------|
| `48 OKLCH SCALES` | Stats band | `stats-band.tsx:3` |
| `49 SCALES` | System page header | `system/page.tsx` (via token-tabs) |

### 4. "FRAMEWORK-AGNOSTIC" — False Claim

`init/page.tsx:109` — "SIGNALFRAMEUX(tm) IS FRAMEWORK-AGNOSTIC BUT OPTIMIZED FOR NEXT.JS + VERCEL."

The system requires React 19 as a peer dependency (per README and `package.json`). Not framework-agnostic. Replace with: `"SIGNALFRAMEUX(tm) IS BUILT FOR REACT + NEXT.JS + VERCEL."` or `"SIGNALFRAMEUX(tm) REQUIRES REACT 19. OPTIMIZED FOR NEXT.JS + VERCEL."`

### 5. "SHIP FASTER" — Vague Productivity Claim

`marquee-band.tsx:2` — `"SIGNAL//FRAME(tm) // DESIGN SYSTEM // BUILT FOR ENGINEERS // SHIP FASTER // ACCEPT THE INTERFACE //"`

"Ship faster" — faster than what? Generic SaaS/agency copy. Violates the voice guide's prohibition on vague claims. Replace with something specific or remove the segment.

Also in `sr-only` text at `marquee-band.tsx:11`.

### 6. "and growing" — Warm Filler (2 Instances)

| File:Line | String |
|-----------|--------|
| `hero.tsx:93` | `"28 SF COMPONENTS AND GROWING"` |
| `page.tsx:17` | `"...28 SF components and growing..."` |

Remove "and growing" — it's enthusiastic filler. State the count or omit.

---

## Borderline Flags (Consider Fixing)

### 7. "FULL PREDICTABILITY"

`dual-layer.tsx:18` — `"ZERO AMBIGUITY. FULL PREDICTABILITY."`

"Full" is an absolute. Consider: `"ZERO AMBIGUITY. PREDICTABLE."` or `"ZERO AMBIGUITY. DETERMINISTIC."`

### 8. "NEVER INTERFERES WITH READABILITY" (2 Instances)

| File:Line | String |
|-----------|--------|
| `dual-layer.tsx:44` | `"NEVER INTERFERES WITH READABILITY."` |
| `init/page.tsx:88` | `"THEY NEVER INTERFERE WITH THE FRAME LAYER'S READABILITY."` |

Provably false if a user sets `--signal-intensity: 1.0` with 12% grain. Consider: `"DESIGNED NOT TO INTERFERE WITH READABILITY."` or `"SIGNAL RESPECTS READABILITY."`

### 9. "Universal design system"

`footer.tsx:20` — React-only is not universal (no Vue, Svelte, etc.). Consider: `"Design system"` or `"Programmable design system"`.

### 10. "infinity / FRAME STATES"

`stats-band.tsx:5` — `"infinity" / "FRAME STATES"`. Unprovable superlative. The system has finite configurations. Consider a large specific number or a different stat entirely.

### 11. "a system you can feel."

`hero.tsx:88` — Subjective/emotional, lowercase (breaks all-caps register). Likely intentional as contrast moment. Flags under strict voice audit but may be a deliberate stylistic choice.

### 12. "API-first"

`manifesto-band.tsx:73` — Industry buzzword. Grounded in the system's actual architecture, but borderline.

### 13. Command Palette — Title Case vs ALL CAPS

`command-palette.tsx:88,103,117` — Group headings `"Navigation"`, `"External"`, `"Actions"` use title case while rest of system is ALL CAPS. Minor register inconsistency.

---

## Clean Sections (No Violations)

- **Thesis manifesto** (`thesis-manifesto.ts`) — all 6 statements are precise, earned, specific. Excellent copy.
- **Error/404 pages** — on-brand terminal aesthetic. `"SIGNAL NOT FOUND."` is particularly good.
- **Init page structure** — already diegetic (`[00//BOOT]`, `[01//INIT]`, `[OK] SYSTEM READY`). Strong.
- **Acquisition section** — terminal readout, no CTA energy. Clean.
- **Token explorer copy** (`token-tabs.tsx`) — elevation system, radius philosophy, breakpoint scale explanations are specific and opinionated. Clean.
- **README** — extremely precise. `"High-performance design system. Dual-layer SIGNAL/FRAME model. Zero border-radius. OKLCH color space. Enhanced flat design."` — every word earns its place.
- **All Storybook stories** — technical, terse. No violations.
- **Nav labels** — INVENTORY, API, SYSTEM, GET STARTED, GITHUB. Clean.
- **Footer links** — clean structure, no filler.

---

## Files to Edit

| File | Lines | Fix |
|------|-------|-----|
| `stats-band.tsx` | 2, 3, 5 | Reconcile component count (28→54?), OKLCH scale count (48→49?), replace infinity |
| `hero.tsx` | 88, 93, 121 | Remove "and growing", fix version, review "a system you can feel" |
| `page.tsx` | 17 | Remove "and growing", fix component count |
| `opengraph-image.tsx` | 64 | Fix stale version (v1.5) |
| `manifesto-band.tsx` | 65 | Fix component count (340+) |
| `marquee-band.tsx` | 2, 11 | Replace "SHIP FASTER" |
| `dual-layer.tsx` | 18, 44 | Soften absolutes ("FULL", "NEVER") |
| `init/page.tsx` | 63, 88, 109 | Fix count (340+), soften "NEVER", fix "FRAMEWORK-AGNOSTIC" |
| `footer.tsx` | 20 | Replace "Universal" |
| `command-palette.tsx` | 88, 103, 117 | Title case → ALL CAPS for consistency |
| `layout.tsx` | 48-49 | "combining clarity and generative depth" — minor vagueness |

---

## Note on Diegetic Copy Rewrite

The Tier 2 diegetic design push (from `wiki/analyses/sfux-aesthetic-upgrade-plan.md`) will rewrite most user-facing copy across `/reference`, `/inventory`, ACQUISITION, nav labels, section labels, and loading states. The flags above should be fixed **before** the diegetic rewrite so the rewrite starts from a clean baseline. The diegetic copy itself should be audited separately after Tier 2 implementation.
