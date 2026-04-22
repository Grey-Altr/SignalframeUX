# SIGNALFRAMEUX LOCKDOWN

**Version:** v0.1 (post-audit redline — 2026-04-22)
**Sealed from:** `main` @ `a5db013` (post-audit; includes 6 shipped fixes — see AUDIT-VERDICTS.md)
**Audit inputs:** 19 rendered-state screenshots + one-by-one walk of INDEX.md (7 sections, ~140 components), runtime canvas/scene probes, aesthetic digest from `aesthetic-deep-dive`, user-spoken trademark declarations (2026-04-21)
**Status:** Lockdown audit complete. v0 drifts redlined below. Remaining v0.1 work is execution-queue items; no new spec changes.

> **Rule of the lockdown:** every rule below is extracted from shipped code (cited).
> Nothing is aspirational. Nothing is negotiable without a user DECIDE callback.
> Every future phase/component is tested against this doc. Violations = rejection or explicit trademark extension.

---

## 0 · POSITION

**P-01** — SignalframeUX is a **compiled position**, not a reference collection. cdB catalogues the peer vocabulary (Enero / Massive / NXCL / ZULA / vault exemplars); SF is what that position looks like executed as a live design system.
*Source: `.planning/aesthetic/signalframeux-digest.md` §Framing*

**P-02** — The aesthetic is carried by **four anchor mechanisms**. Strip any one and the register collapses:
1. `--sfx-*` token layer (`app/globals.css`)
2. Three WebGL shaders (`GLSLHero`, `GLSLSignal`, `ProofShader`)
3. HUD chrome stack (`InstrumentHUD`, `NavCube`, `ColorCycleFrame`, `LiveClock`)
4. Six coded blocks (`ENTRY → THESIS → PROOF → INVENTORY → SIGNAL → ACQUISITION`) — matches shipped render order in `app/page.tsx:32-103`

---

## 1 · TRADEMARK PRIMITIVES

User-declared trademarks (2026-04-21). These propagate system-wide; any new component is judged against them.

### T1 · PIXEL-SORT — the signal trademark
Canvas-based pixel-sort bloom/striation visible in `EntrySection` ring+iris and the VL-05 magenta slash. The signature signal-layer visual technique.

| # | Rule | Source |
|---|---|---|
| **T1-a** | Canvas-based (2D/WebGL), **no SVG** for signal effects | `components/dossier/pointcloud-ring.tsx`, `iris-cloud.tsx` |
| **T1-b** | **Workerized** (OffscreenCanvas); main thread never runs pixel-sort math | `pointcloud-ring-worker.ts`, `iris-cloud-worker.ts` |
| **T1-c** | Parametric API contract: `count, radius, trail, pixelSort, sortThreshold, groups` | `EntrySection` params |
| **T1-d** | Shared 128-wedge angular coordinate system → multi-surface coherence via `sf-hero-shared-groups` BroadcastChannel | `entry-section.tsx:42-66` |
| **T1-e** | Tint via `--primary` slot where applicable — theme-adaptive | `entry-section.tsx:132` |
| **T1-f** | In-place Uint32 row-sort; zero per-frame allocations | Phase-35 perf contract |

### T2 · GLYPH LANGUAGE — the mark trademark
Iconographic style of glyphs inside cube tiles. Shared grammar, extensible by following the grammar.

| # | Rule | Source |
|---|---|---|
| **T2-a** | SVG only, `viewBox="0 0 24 24"`, `fill="currentColor"` — theme-adaptive | `components/layout/nav.tsx:9-90` |
| **T2-b** | **Rectangles + simple paths only** — no curves, no strokes, no gradients, no filters | `nav.tsx` IconInventory/Api/System/Builds/Init/Github/CommandGrid |
| **T2-c** | Zero corner radius on every rect | Same |
| **T2-d** | Segmented structure with animation hooks: `g.sf-<name>-segment--N` / `g.sf-<name>-cell--N` | `nav.tsx:11-22` |
| **T2-e** | Reads legibly at 16px (`NAV_GLYPH_PX`), compact high-contrast geometry | `nav.tsx:97` |
| **T2-f** | Glyph inventory extends by following this grammar — no imported icon libraries | system-wide |

### T3 · CUBE-TILE BOX — the container trademark
Square, zero-radius, flat-fill tile — the base identity container.

| # | Rule | Source |
|---|---|---|
| **T3-a** | 32px unit square — `NAV_UNIT_PX` (promote to `--sfx-cube-unit`) | `nav.tsx:95` |
| **T3-b** | 16px glyph inside, centered — 50% interior — `NAV_GLYPH_PX` | `nav.tsx:97` |
| **T3-c** | 8px notch rhythm for spacing/gaps — `NAV_NOTCH_PX` (promote to `--sfx-cube-notch`) | `nav.tsx:96` |
| **T3-d** | Zero border-radius | system-wide |
| **T3-e** | Flat fill; zero shadow/gradient/glow | `nav.tsx:218-219` |
| **T3-f** | Active/hover: `ring-1 ring-black`. No scale, no elevation | `nav.tsx:218` |
| **T3-g** | Fill: **`oklch(0.91 0.18 var(--sfx-cube-hue, 98))`** — 2nd theme slot per user decision 2026-04-21. Brand has NO fixed hues | `globals.css:206` + pending execution |
| **T3-h** | Cubes preserve trademark across every cascade/scroll state — fill/glyph/size ratio invariant | `surface 2+3` |
| **T3-i** | Cascade is frame-layer rearrangement only — no per-cube transform (no scale/skew/rotate) | `nav-overlay` cascade logic |
| **T3-j** | Canonical idle nav geometry = L-shape (left rail + bottom row). Compressed fallback = bottom row only | `surface 1 vs 3` |
| **T3-k** | Adapts to section `bgShift`: light-fill on dark sections, dark-fill on white sections — glyph+box grammar stays | `surface 5, 9` |

### T4 · `//` SEPARATOR — the coded-naming trademark
The omnipresent punctuation glyph. Applied identically everywhere.

| # | Rule | Source |
|---|---|---|
| **T4-a** | `//` appears in: lockup (`SIGNALFRAME//UX`), mark (`SF//UX`), component codes (`SF//BTN-001`), section IDs (`[01//ENTRY]`), layer tags (`[//SIGNAL]`), stats (`KEY // VALUE`), footnotes (`// note`), breadcrumbs (`[SFUX] // [TOKENS]`) | all surfaces |
| **T4-b** | Standalone `//` renders in `text-primary` (signifier moment); inline `//` in mono text stays neutral | `entry-section.tsx:132` vs `reference/api-list` |
| **T4-c** | Never substitute for `/`, `\|`, `·`, or `—` as a separator. `//` is the system separator — every other use is wrong | system-wide |

---

## 2 · COLOR SYSTEM

### 2.1 · Slot-typed, two-hue adaptive model

SignalframeUX has **zero brand-fixed hues**. Every consumer-facing color is role-typed and theme-adaptive.

| Slot | Source token | Role | Theme input |
|---|---|---|---|
| `background` | `--background` | substrate | `--sfx-theme-hue` (near-neutral) |
| `foreground` | `--foreground` | primary text | `--sfx-theme-hue` (near-neutral) |
| `primary` | `--primary` ← `--sfx-primary` ← `--sfx-theme-hue` | brand signifier (the `//`, `feel`, focus, active) | `--sfx-theme-hue` (default 350 = magenta) |
| `secondary` | `--secondary` | quiet surface | `--sfx-theme-hue` |
| `accent` | `--accent` | quiet surface | `--sfx-theme-hue` |
| `--sfx-cube-hue` | *pending* | cube-tile trademark fill | default `98` (yellow) — user-swappable |

**Extended tier** (muted/card/popover) stays near-neutral. **Feedback tier** (success/warning/destructive) may carry chroma — see 2.3.

### 2.2 · Saturation asymmetry — R-40

ONE saturated BRAND signifier (`primary`). All other non-feedback slots stay near-neutral. Chromatic discipline = single signifier.
*Source: `app/globals.css:52, 139, 206` + user decision B 2026-04-21*

### 2.3 · Feedback tier exception — R-40-exception

Extended feedback slots — `success`, `warning`, `destructive` — may carry chroma for semantic legibility. Rule: **chroma < primary's chroma** (muted, not loud). Brand identity is preserved because primary remains the sole BRAND-loud color.
*Source: `/inventory` BADGE `NEW` green + user decision B 2026-04-21*

### 2.4 · OKLCH matrix

The color origin is a **49-step OKLCH matrix** (L × C × H axes). Categories: NEUTRAL (H:0), SIGNAL (H:350), FRAME (H:?), plus extended. Documented in `/system → OKLCH_MATRIX ( 49 )`. Adding a color = adding a matrix scale, not a new variable.

### 2.5 · Borderless-first — R-60

**Borderless is the canonical visual register.** Every component MUST render correctly with zero borders, zero Tailwind rings, and zero native outlines — the `data-borderless="true"` attribute is the default state of the system.

| # | Rule | Source |
|---|---|---|
| **R-60-a** | `<html data-borderless="true">` is the SSR default; bordered mode is strictly opt-in via localStorage (`sf-borderless=false`) | `app/layout.tsx:101` + `theme-provider.tsx:13` |
| **R-60-b** | The `BorderlessToggle` is a debug/editorial affordance, not a user-facing style preference. Default state = borderless | `components/layout/borderless-toggle.tsx` |
| **R-60-c** | Every new component is judged against its borderless-mode render first. If it depends on border/ring/outline to communicate structure, it violates the register and must redesign | system-wide |
| **R-60-d** | The global borderless rule (`[data-borderless="true"] *`) zeros `border-width`, `outline-width`, and all `--tw-ring-*` shadow vars. Components MUST NOT work around this by using inline borders, SVG strokes, or box-shadows as faux-borders | `app/globals.css` BORDERLESS MODE block |
| **R-60-e** | Structural separation in borderless mode comes from **spacing, contrast, and surface color** — `var(--color-muted)` backs ex-bordered surfaces. Never fake a border with a 1px box-shadow | `app/globals.css` |
| **R-60-f** | Trademarks T1/T2/T3/T4 (pixel-sort, glyph, cube, `//`) retain identity under the borderless rule — the cube tiles (T3) use `bg-[var(--sfx-cube-hue)]` flat fill, never a ring-as-outline | `nav.tsx` + R-60-d compliance |

**Why:** borders are the cheapest way to communicate structure and the most common way design systems drift into generic dark-mode aesthetic (rejected per `feedback_aesthetic_direction.md`). Forcing borderless-first compliance forces every component to earn its structural clarity through spacing, contrast, and the trademark primitives — not through lazy outlines.

---

## 3 · TYPOGRAPHY

### 3.1 · Four-voice system

| Voice | Font | Role |
|---|---|---|
| **Display** | Anton | page titles, hero wordmarks (`SIGNALFRAME//UX`, `INVE/NTORY`) |
| **Body** | Inter | manifesto, prose, h2-h3 |
| **Mono** | JetBrains Mono | chrome (telemetry, nav labels), code blocks, all system readouts |
| **Brand** | Electrolize | brand-specific lockups, special callouts |

**One more voice than the cdB three-voice norm** — counts as expressive headroom.
*Source: digest §2 + rendered state*

### 3.2 · Scale (minor third, base 13)

2xs=9 · xs=10 · sm=11 · base=13 · md=16 · lg=18 · xl=24 · 2xl=32 · 3xl=40+ · 4xl=80 (display). Ratio ~1.2.

### 3.3 · Display-lockup rules

- All-caps, tracking `0.02em`, leading `0.9`
- Viewport-bleed size via `clamp(min(vw,vh))`
- Wordmark body is `text-foreground` (dark↔light inverts cleanly)
- Two-line stack break is rhythm, not a limit: `INVE/NTORY`, `TOKEN/EXPLORER`, `INITIA/LIZE`
*Source: `entry-section.tsx:124-132`, `app/inventory/page.tsx`, `app/system/page.tsx`, `app/init/page.tsx`*

### 3.4 · UPPERCASE mono register
Extended prose in system copy uses **UPPERCASE mono + tight tracking** — gives it a "system-log" terminal feel.
*Source: `/init` install step body copy*

---

## 4 · SPACING + LAYOUT

### 4.1 · Blessed 9 stops
**4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96** pixels. Visualized as horizontal bars in `/system → TOKEN DIAGNOSTIC`. Any arbitrary value violates.

### 4.2 · Layout tokens
- `--max-w-content` · prose/readable width
- `--max-w-wide` · section width
- `--max-w-full` · full-bleed
- Standard gutters via CSS custom properties
- Breakpoints: Tailwind v4 defaults

### 4.3 · Zero border-radius, system-wide
`rounded-none` enforced explicitly where needed to resist inherited rounding.

---

## 5 · MOTION + ANIMATION

### 5.1 · Duration tokens
`--duration-instant` (34ms) → `--duration-glacial` (600ms)

### 5.2 · Easing tokens
`--ease-default`, `--ease-hover`, `--ease-spring`, `sf-snap` (thesis timeline)

### 5.3 · Signal-leads-frame staging
Signal layer arrives first; frame lands on top. E.g. on `/`:
- 0–2s: iris settles
- 0–7s: ring reveals band-by-band (worker-gated)
- t=7s: "everything else" constructs via `sf-hero-construct` / `sf-hero-deferred` classes
*Source: `entry-section.tsx:72`, `globals.css sf-hero-*`*

### 5.4 · Scroll-trigger types (the three modes)
| Mode | Use when | Example |
|---|---|---|
| `onEnter`/`onLeave` callbacks | modulating state on boundary crossing | `PROOF`, `SIGNAL` |
| `scrub` (no pin) | scroll-driven opacity/value only | VL-05 slash, hero GSAP |
| `pin + scrub` | manifesto-style staged content | `THESIS` (6-statement enter-hold-exit) |

### 5.5 · Reduced-motion fallbacks — MANDATORY
Every motion rule has a reduced-motion branch: early return from effect, stacked specimen, or CSS-only fallback. No animation may be REQUIRED to read content.

---

## 6 · SIGNAL LAYER — HIG

### 6.1 · Three-layer composition (R-13)
Every signal surface composes THREE concurrent layers:
- **A** shader/canvas generative
- **B** skeleton cross-fade (opacity driven by intensity)
- **C** frame-pole code/stats — always visible, never fades
Signal intensity modulates A + B; C never fades. "The frame holds, the signal moves" is structurally enforced.

### 6.2 · Intensity scope hierarchy (R-29)
- **Default**: `:root --sfx-signal-intensity`
- **Section-local override**: write to section element only (PROOF)
- **Global handoff**: root set on enter (SIGNAL → persists to ACQUISITION)
- CSS cascade arbitrates — no manual priority logic

### 6.3 · Input drivers (R-16)
Pointer (desktop), touch-drag (mobile), device-tilt γ ±60° (iOS) all drive the SAME `_targetIntensity` 0-1. No input is primary.

### 6.4 · rAF lerp discipline (R-17)
- `LERP_FACTOR=0.08`
- Opacity driven in same rAF tick, not via GSAP tween (pitfall 4 avoidance)
- Single rAF loop per surface

### 6.5 · Parametric parity
New signal surfaces MUST expose the T1-c parametric contract (`count, radius, trail, pixelSort, sortThreshold, groups`) or explain in a JSDoc comment why not.

### 6.6 · Section registration
Signal layer scope respects section boundaries. No signal effect bleeds past its section's `bgShift` context.

---

## 7 · FRAME CHROME — HIG

### 7.1 · Telemetry readout
Fixed top-right. 5 fields desktop / 3 fields mobile:
```
[NN//NAME]        (section / route ID, primary color, bracketed)
WIDTH×HEIGHT      (viewport dimensions)
SIG:0.0–1.0       (current signal intensity)
NN%               (scroll progress)
HH:MM             (clock)
```
Examples: `[01//ENTRY]`, `[SYS//TOK]`, `[REF//API]`, `[INIT//SYS]`, `[INV//INV]`.
*Source: `InstrumentHUD` + surface 1/3/4/5/8/9/10/11*

### 7.2 · Route ID grammar
Every route gets a bracketed coded ID following `[PFX//SUF]`:
- Homepage sections: `[01//ENTRY]` through `[06//ACQUISITION]`
- Routes: `[SYS//TOK]`, `[REF//API]`, `[INIT//SYS]`, `[INV//INV]`

### 7.3 · Breadcrumb grammar
`[SFUX] // [INVENTORY]` — bracketed nodes joined by `//`. Same separator trademark.

### 7.4 · Nav geometry (T3-j)
- Idle: L-shape (left rail + bottom row)
- Compressed: bottom row only
- Cascade transitions between states by frame rearrangement (T3-i)

### 7.5 · Mark grammar
`SF//UX` mark (bottom-left) constructed from same glyph grammar as cubes. The bracket-less short form is the brand lockup; bracketed form (`[SFUX]`) is the system-node-id form.

---

## 8 · CONTENT GRAMMAR

### 8.1 · Coded naming system (the DU/TDR trademark)
| Pattern | Example | Role |
|---|---|---|
| `SF//[CAT]-NNN` | `SF//BTN-001`, `SF//FRM-002` | Component IDs — 3-char category + 3-digit serial |
| `[NN//NAME]` | `[01//ENTRY]`, `[04//INVENTORY]` | Section IDs |
| `[PFX//SUF]` | `[SYS//TOK]`, `[REF//API]` | Route telemetry IDs |
| `[TAG]` | `[FRAME]`, `[//SIGNAL]`, `[COPY]`, `[STABLE]` | System elements — brackets denote "system node" |
| `KEY // VALUE` | `COMPONENTS // 36`, `BUNDLE // 100KB` | Stat readouts |
| `# SECTION` | `# NPM`, `# PNPM (RECOMMENDED)` | Code block section comments |
| `// note` | `// REQUIRES REACT 18+` | Footnotes / supplementary notes |

### 8.2 · Component category codes
BTN · CRD · INP · TGL · TBL · BDG · DLG · TAB · SLD · SEL · TIP · PRG · FRM · LAY · NAV · FBK · DAT · GEN. 3-char caps.

### 8.3 · Section header glyph prefix (R-35)
Every section header carries a glyph prefix in primary:
- `+ ACQUIRE` (plus = accumulate)
- `- INVENTORY` (dash = list)
- Glyph choice is semantic

### 8.4 · Trademark `™` affectation (R-59)
Brand + system labels carry `™`: `SIGNALFRAMEUX™`, `TERMINAL™`, `シグナルフレーム™`. TDR-lineage; not optional on named system elements.

### 8.5 · Package scope (R-58)
`@sfux/core`, `@sfux/components`, `@sfux/tokens`, `@sfux/signal` — layer separation at package level. Consumer can opt-in to signal layer; frame is always-on.

### 8.6 · Stability tag (R-51)
Every API entry carries `v1.6.0 [FRAME] STABLE` triad: semver · layer · stability (STABLE/BETA/ALPHA).

### 8.7 · Canonical stats (R-34)
Three stats always present as self-description:
`COMPONENTS // N` · `BUNDLE // NKB` · `LIGHTHOUSE // N`.

*Count reconciliation is an execution task — live code exports 53, hero claims 48, inventory shows 54, reference shows 158 surfaces, system shows 49-color matrix. See `digest §Form Vocabulary` for disambiguation.*

---

## 9 · INTERACTION — HIG

### 9.1 · Hover/active register
- Nav cubes: `ring-1 ring-black` (no scale, no elevation)
- Links: inherit color change only; underline reserved for in-prose links
- Buttons: `hero-cta-btn` has border-draw animation; no hover-scale, no shadow
- Active route: cube inverts (outline-only glyph on transparent bg)

### 9.2 · Scroll behavior
- Lenis smooth scroll enabled
- ScrollTrigger for all scroll-linked effects
- Section transitions driven by `bgShift` attribute + scroll position
- Pinned sections consume scroll range deliberately (THESIS = 200-300vh)

### 9.3 · Focus rings
WCAG AA minimum. Primary-colored focus rings; adapts with theme hue.

### 9.4 · Touch targets
Minimum 44×44px for tap targets. Cube tiles at 32px use surrounding 8px notch padding to satisfy.

### 9.5 · Reduced-motion (5.5 reprise)
Every motion surface must render meaningful content without animation. `prefers-reduced-motion: reduce` disables all non-essential animation.

### 9.6 · Theme-swap responsiveness
Changing `--sfx-theme-hue` or `--sfx-cube-hue` at runtime re-tints every slot-bound surface. No component may hardcode a hue.

---

## 10 · SIX CODED BLOCKS — homepage architecture

Fixed order, fixed semantics. Adding a block = user decision.

| # | Block | Role | Technique |
|---|---|---|---|
| 01 | **ENTRY** | hero — wordmark + signal layer first impression | GLSL noise + ring + iris + VL-05 magenta bloom |
| 02 | **THESIS** | 6-statement manifesto | PinnedSection scrub, enter-hold-exit 0.35/0.3/0.35 |
| 03 | **PROOF** | interactive SIGNAL/FRAME demo | 3-layer composition, pointer/tilt input |
| 04 | **INVENTORY** | 12-component catalog preview | Table: code · name · layer · tier · → |
| 05 | **SIGNAL** | Ikeda data-field atmospheric | GLSL scanlines + data columns + yellow spikes, 150vh sticky |
| 06 | **ACQUISITION** | CTA terminal panel | `npx signalframeux init` hero, stats, handoffs |

---

## 11 · ROUTES

| Route | Role | Title pattern |
|---|---|---|
| `/` | homepage (6 blocks) | `SIGNALFRAME//UX` |
| `/system` | live token diagnostic | `TOKEN/EXPLORER` |
| `/inventory` | full component catalog grid | `INVE/NTORY` |
| `/reference` | API reference (158 surfaces) | `API/REFERENCE` |
| `/init` | 5-step onboarding sequence | `INITIA/LIZE` |
| `/builds` | dossier landing (cdb-v3 branch active) — `BuildSigilDiagram` + `SFSignalComposer` post-processing | — |
| `/builds/[slug]` | per-build plate detail — `BuildSigilDiagram` + `SFSignalComposer` | — |

---

## 12 · DEFERRED CANDIDATES (from branch audit)

Seven DECIDE items from `cdb-v3-dossier`, to be revisited post-lockdown. Details in `.planning/lockdown-audit/B-cdb-v3-dossier.md`.

- **D-01** `HalftoneCorrugated` — 2nd signal primitive?
- **D-02** `HudOctagonFrame` — 2nd container shape?
- **D-03** `BuildSchematic` — 2nd glyph class (stroke-based)?
- **D-04** Geolocation readout — extend SF telemetry?
- **D-05** Paper substrates — 3rd+ bgShift variant?
- **D-06** `TerminalSession` — adopt for `/init`?
- **D-07** `Y2KMarkGrid` — expanded glyph library?

Branches B (cdb-v3-dossier), C (cdb-v2-broadcast = subset), D (aesthetic-deep-dive = subset) yielded zero PULLs by default — all 7 candidates diverge from locked trademarks.

---

## 13 · KNOWN ISSUES (do not block lockdown)

**Resolved during audit (this redline):**
- ~~THESIS visual bug~~ — **fixed** (`4866bdb`): portal PinnedSection out of ScaleCanvas transform. §2.2.
- ~~HUD section detector stale~~ — **fixed** (`35aa254`): IntersectionObserver recomputes all sections per tick. §2.3.
- ~~SignalCanvas render loop silently dead~~ — **fixed** (`35aa254`): switched from `gsap.ticker.add` to plain `rAF`. §2.3.
- ~~Borderless mode overriding inline swatch backgrounds~~ — **fixed** (`a5db013`). §3.16.
- ~~/builds route not visually audited~~ — partial audit complete: post-processing chain via `SFSignalComposer` verified; trademark 6.a-f coverage in AUDIT-VERDICTS.md §6.

**Open (carry to v0.2):**
- **Catalog count drift** — 36/48/53/54/158/49 vary across pages. Reconciliation is an execution item. (tracked in §14 #4)
- **Dev-only canvas double-mount** — React strict-mode double-mounts hero canvas; prod unaffected.
- **PROOF shader light-mode contrast tuning** (audit task #10) — shader is legible in dark mode; light-mode needs uniform re-tune. Not a blocker.
- **SIGNAL section 150vh parallax restoration** (audit task #11) — current implementation ships without the 150vh sticky band described in §10. Behavior difference captured in `.planning/codebase/HERO-ANIMATION.md`.
- **MotionSpecimen token data incomplete** (audit task #12) — CLAUDE.md mentions `--duration-instant` / `--duration-glacial` / `--ease-spring` tokens the /system specimen data array omits. Reconcile source-of-truth.
- **Nav reveal pipeline dormant** (audit task #13) — `NavRevealMount`, `useNavReveal`, `sf-nav-hidden` CSS, and `data-nav-reveal-trigger` attrs on 5 subpages survive, but Nav root no longer carries the initial-hidden class. Comment at `nav.tsx:614–616` misrepresents the live behavior. Either ship the reveal or strip the scaffolding.
- **LenisProvider keydown synthetic-event crash** (audit task #14) — handler calls `target.getAttribute('role')` without checking `target instanceof Element`. Not reachable via real input; synthetic dispatched events targeting Window throw. Add guard.
- **INDEX.md counter drift** (audit tasks #15, #16, #17):
  - BackToTop description confuses footer `▲` button with the floating `↑` (GlobalEffects.ScrollToTop). Two distinct components by design.
  - Section 5 header "53 surfaces, from barrel" should read "49 unique / 53 files (44 barrel + 9 non-barrel)"; SFCalendar/SFDrawer/SFMenubar missing from the listing.
  - Section 6 header "44 — grouped by role" doesn't match file-count (45) or slot-count (39).
- **Animation orphan ratio** (audit task #18) — 17 of 39 Section-6 slots (≈44%) have no live consumer. Policy per §3 keeps them as reference-template orphans. v0.2 decision: promote into live inventory demos or archive under `components/animation/_reference/`.
- **Inventory preview mock vs real-component mismatch** (audit task #19) — `PreviewCircuitDivider` and `PreviewScrambleText` in `components-explorer.tsx` render static HTML mocks while their registry entries ship `import …CircuitDivider/ScrambleText` code samples. Either wire real components into previews or remove registry entries.

---

## 14 · EXECUTION QUEUE (lockdown → code)

Items to apply in execute phase after user approves this doc:

1. Introduce `--sfx-cube-hue: 98` token; rewire `--sfx-yellow` to derive from it (T3-g).
2. Promote `NAV_UNIT_PX/NOTCH_PX/GLYPH_PX` constants to `--sfx-cube-unit/notch/glyph` tokens.
3. Audit `--sfx-yellow` consumers: identify cube-family (rewire) vs invariants (hoist out first).
4. Reconcile catalog counts (36 vs 48 vs 53 vs 54 vs 158 vs 49) — decide single-source vs disambiguated.
5. Revisit THESIS pin/scrub to resolve off-viewport position bug (execution task, not lockdown change).
6. Audit feedback-tier chroma (success/warning/destructive) to confirm chroma < primary (R-40 exception compliance).
7. Document two-hue model (`--sfx-theme-hue` + `--sfx-cube-hue`) in `SIGNALFRAMEUX_REFERENCE.md`.

---

*End of v0.1 redline.*
*Audit source: `.planning/lockdown-audit/AUDIT-VERDICTS.md` (2026-04-22 session 3).*
*v0.1 → v1 lock pending user sign-off on §13 open items + §14 execution queue.*
