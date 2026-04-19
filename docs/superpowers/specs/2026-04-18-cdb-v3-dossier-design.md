# cdb-v3-dossier — Six-plate reference dossier for SignalframeUX

> Branch: `cdb-v3-dossier` (forked from `cdb-v2-broadcast`)
> Date: 2026-04-18
> Status: design approved, awaiting user review before implementation plan

## Goal

Turn SignalframeUX's six top-level routes into one cohesive site that directly quotes specific pieces from the cdB reference corpus — one reference pack per route — while composing a new document. Previous vault generations (V1–V5 on `cdb-v2-broadcast`, plus C1–C4 cdB brand work) borrowed pack grammar as atmosphere. This branch tightens the move: each route is a **faithful compositional recreation** of a specific reference pack, rendered in CSS/SVG/canvas (no reference image files ship).

Anti-goal: do not rehash V5's 7-movement single-page composition. Do not redesign the system (CLAUDE.md stabilization scope still holds). Do not add features.

### Known tradeoff: aesthetic plate replaces functional explorer

Three current routes carry working interactive tools that will be replaced by aesthetic plates on this branch:

- `/system` has `TokenTabs` + `TokenVizLoader` (token explorer) — replaced by Cyber2k HUD plate.
- `/inventory` has `ComponentsExplorer` with live previews, filtering, and syntax-highlighted code — replaced by Black Flag serialized sheet.
- `/reference` has `APIExplorer` — replaced by Brando Y2K mark grid.

This is intentional. The branch's thesis is a **pure aesthetic reset**, parallel to `main`. Interactive tools remain available on `main` and other branches. If a dossier plate needs to link back to the functional tool, it can do so (e.g. `/reference` can link `→ see /inventory for live component previews` even though `/inventory` on this branch is also a plate — the link is a signal that the functional version lives elsewhere in the codebase, not a broken promise).

## Scope

### In scope

- New branch `cdb-v3-dossier` off `cdb-v2-broadcast`.
- Full rewrite of six route `page.tsx` files: `/`, `/system`, `/reference`, `/inventory`, `/builds`, `/init`.
- Root `layout.tsx` updated with a new font slate (see §Typography) and a thin shared-chrome wrapper.
- Shared chrome: four-corner label strip + catalog nav.
- Per-route pack-quotation primitives, either by reusing `components/vault/*` and `components/cdb/*` where they fit, or by adding new primitives under `components/dossier/` (see §Shared primitives).
- `/builds/[slug]` sub-route: gets a lightweight, consistent treatment (not a full pack — inherits `/builds` Diagrams2 language).

### Out of scope

- Any change to `components/sf/*`, `components/blocks/*`, `components/animation/*`, `components/ui/*`, or `components/layout/*`. These were designed for the pre-reset system and are preserved for other branches.
- Restoring Nav / InstrumentHUD / ScaleCanvas / Lenis / SignalCanvas / PageAnimations. Layout stays gutted on this branch, per `cdb-v2-broadcast` intent.
- Touching any other route (`/init/sub-routes`, `/api/*`, etc.) beyond the six listed.
- Migrating the other branches to match.
- New GSAP effects. Motion must come from existing animation tokens and a small amount of per-route canvas/CSS work, no new timeline architectures.

## Architecture

### Three layers per page

```
┌──────────────────────────────────────────────┐
│  [SF//UX]                         GEO · DATE │  <-- shared chrome (corners)
│                                              │
│                                              │
│            PACK-SPECIFIC BODY                │  <-- per-route
│            (KLOROFORM / Cyber2k /            │
│             Brando / Black Flag /            │
│             Diagrams2 / Helghanese)          │
│                                              │
│                                              │
│  SF//KLO · SF//HUD · SF//MRK ·      URL      │  <-- shared chrome
│  SF//E00 · SF//DGM · SF//HLG                 │
└──────────────────────────────────────────────┘
```

- **Chrome layer (shared).** A `<DossierChrome>` component rendered inside `layout.tsx` (or as a wrapper on each page — see §Open question C1). Four corners:
  - **Top-left:** `SF//UX` wordmark + current-route catalog code (e.g. `SF//KLO-00`).
  - **Top-right:** Geo-coords (static: `SOC/IDN 37°46'N 122°25'W` or fictional — see §Q2) + ISO date.
  - **Bottom-left:** Catalog nav — all six route codes rendered inline, active entry lit in magenta, others in muted foreground. Clicking navigates.
  - **Bottom-right:** `signalframe.culturedivision.com` + version tag `v0.1 / CDB-V3`.
  - Chrome occupies fixed 24–32px insets. Does not scroll. Readable at all times.
- **Body layer (per-route).** Full-viewport pack composition. Described in §Per-route plates.
- **Background layer (shared contract).** Pure black `#000` by default. Exceptions per pack — e.g. `/reference` may use paper-cream substrate for Brando Y2K truth.

### Typography

Replace the current layout's font triplet (Bungee + Archivo Narrow + JetBrains Mono).

**Two globals, loaded in root `layout.tsx`:**

| Role | Font | Source |
|---|---|---|
| Utility sans (default UI) | **Space Grotesk** | `next/font/google` |
| Utility mono (labels, catalog codes, chrome) | **JetBrains Mono** | `next/font/google` (retained) |

**Six per-route display fonts, loaded only on their route via `next/font/google` inside the route `page.tsx`:**

| Route | Pack | Display font | Pairing |
|---|---|---|---|
| `/` | KLOROFORM pointcloud | **Syne** | Space Grotesk body |
| `/system` | Cyber2k HUD | **Chakra Petch** | JetBrains Mono chrome |
| `/reference` | Brando Corp 250 Y2K | **Archivo Black** (+ **Archivo** regular) | Space Grotesk body |
| `/inventory` | Black Flag E0000 | **Anton** | JetBrains Mono catalog labels |
| `/builds` | Diagrams2 schematic | **IBM Plex Mono** + **IBM Plex Sans Condensed** | Space Grotesk body |
| `/init` | Helghanese / NCL terminal | **Zen Dots** + **Share Tech Mono** | Share Tech Mono terminal body |

Each route loads its display font(s) as scoped CSS variables so they do not leak outside. Globals (`--font-space-grotesk`, `--font-jetbrains`) are available everywhere.

### Catalog nav

A single `<CatalogNav>` component rendered inside `<DossierChrome>`. Displays all six entries inline, always visible in bottom-left:

```
SF//KLO-00 · SF//HUD-00 · SF//MRK-00 · SF//E00-00 · SF//DGM-00 · SF//HLG-00
```

- Active entry: magenta foreground, underlined.
- Inactive entries: `oklch(0.55 0 0)` muted foreground.
- Hover (non-active): foreground lights white.
- Rendered in **JetBrains Mono** at 10–12px.
- Click navigates. Keyboard-accessible (tab order, `<Link>`).

## Shared primitives

New primitives live under `components/dossier/`:

- `dossier-chrome.tsx` — the four-corner wrapper. Takes `route` prop to highlight active catalog entry.
- `catalog-nav.tsx` — the six-entry nav strip.
- `corner-label.tsx` — generic corner label block used by chrome and also available to pages for internal corners.

Reused as-is (where they fit a pack):

- `components/vault/vault-pointcloud.tsx` → KLOROFORM use on `/` (verify it renders against bare layout — prior V5 commit notes it failed to paint on one page layout).
- `components/vault/vault-schematic.tsx` → Diagrams2 use on `/builds`.
- `components/vault/vault-flag.tsx` → Black Flag corrugated use on `/inventory`.
- `components/vault/vault-helghanese.tsx` → Helghanese use on `/init`.
- `components/vault/vault-data-field.tsx` → Secondary use on `/system` if fit.
- `components/vault/vault-trademark.tsx`, `vault-stamp.tsx` → Brando use on `/reference`.
- `components/cdb/cdb-corner-chrome.tsx` → reference for `dossier-chrome.tsx` implementation; may be adapted or replaced.

Net new primitives (if existing do not fit):

- `components/dossier/halftone-corrugated.tsx` — canvas/CSS moire wave for `/inventory` hero (only if `vault-flag.tsx` insufficient).
- `components/dossier/hud-octagon-frame.tsx` — Cyber2k octagon clip-path frame for `/system` (only if not present).
- `components/dossier/pointcloud-ring.tsx` — the canvas 2D particle primitive used by V5 (ParticleField) promoted to `/dossier/` if webgl `vault-pointcloud` still fails to paint.

## Per-route plates

### Plate 01 — `/` · KLOROFORM pointcloud

**Catalog code:** `SF//KLO-00`. **Display font:** Syne.

**Composition:**
- Full-bleed black field.
- Centered: a single large KLOROFORM-style morphology — the "dissolving ring" (V5 M1/M7 vocabulary), canvas 2D, slow rotation + breathing radius.
- Beneath: display-sized "SIGNALFRAME//UX" in Syne italic, sized to a clamp that fills ~60% of viewport width. Slightly condensed tracking.
- Three lines of body copy (Space Grotesk, 14px): one-sentence positioning, one-sentence scope, one-sentence invitation to the rest of the dossier.
- Below body copy: six small preview tiles, one per route — each tile renders a miniature silhouette of that route's plate (Cyber2k HUD octagon, E0000 halftone wave, Brando mark, Diagrams2 schematic fragment, Helghanese terminal line). Tiles are links.

**Reference source:** KLOROFORM Behance 2024–2025 pointcloud morphology sheets (cdB digest §2).

### Plate 02 — `/system` · Cyber2k HUD

**Catalog code:** `SF//HUD-00`. **Display font:** Chakra Petch.

**Composition:**
- Black field, dense HUD overlay composition.
- Centered reticle: octagon-clipped frame with corner ticks, bracket frames `[ … ]`, ruler scale top + bottom, waveform readout inside.
- Left column: token category legends rendered as HUD stat blocks (e.g. `COLOR · 49 SCALES`, `SPACING · 9 STOPS`, `MOTION · 12 EASES`).
- Right column: live-ish diagnostic readout — pulsing bars driven by `--duration-glacial`, cycling stat values (CSS custom-property interpolation, no JS required).
- Bottom centerline: magenta spike markers, Ikeda-scanline register.

**Reference source:** Cyber2k Massive Supply Co. HUD scaffolds (cdB digest §2). Direct quote of octagon-clip-path + corner ticks + bracket-frame pattern. No Three.js, no SignalMesh on this route (the SignalMesh relocation that was done to `/inventory` stays relocated but that route is now Black Flag — see §Out-of-scope note: SignalMesh is retired on this branch, since the layout no longer supports it).

### Plate 03 — `/reference` · Brando Corp 250 Y2K marks

**Catalog code:** `SF//MRK-00`. **Display font:** Archivo Black.

**Composition:**
- Substrate: paper-cream `oklch(0.92 0.01 85)` ground (one of few routes that breaks the black-field default — Brando truth is cream paper).
- Black ink only (plus one magenta accent on a single mark).
- Grid of 60 Y2K-style trademark marks rendered as SVG: hexagons, recycling wheels, star-asterisks, nested cubes, peace-variants. Each mark labeled below in mono: `SF//MRK-001` through `SF//MRK-060`.
- Top-left display: `API REFERENCE` in Archivo Black, tightly compressed stack.
- Right column: three sentences describing what the page is (SFUX API surface documentation). Copy, not nav — this is a reference plate, not a dashboard.
- Bottom: single lit magenta mark (`SF//MRK-042`) with a note: "the one you are meant to notice."

Content direction: the marks are decorative-generative, but the page is still functionally a pointer to API docs. A link at the bottom reads `→ see component inventory for props and live previews` and routes to `/inventory`.

**Reference source:** Brando Corp 250 Y2K trademark sheet + CyberForm 144 (cdB digest §2).

### Plate 04 — `/inventory` · Black Flag E0000 halftone

**Catalog code:** `SF//E00-00`. **Display font:** Anton.

**Composition:**
- Black field.
- Top half: a single full-bleed corrugated-halftone wave (Black Flag E0000 grammar), rendered either via `vault-flag.tsx` or a new canvas primitive. Monochrome white-on-black moire, slow undulation.
- Bottom half: serialized catalog grid. 54 entries — one per existing SF component in `COMPONENT_REGISTRY` (reuse this data source). Each entry shows:
  - Code `SF//E00-001` through `SF//E00-054`
  - Component name in Anton, extreme condensed
  - 1-line description in JetBrains Mono
  - Tiny monospace stat block (category, export path)
- No live previews, no highlighted code — this plate is a **sheet**, not an IDE. The "live" role is handled by the component's real route if/when it exists. Direction is poster-as-inventory.

**Reference source:** Black Flag E0000 pack (cdB digest §2). Retires the current `ComponentsExplorer` block on this branch.

### Plate 05 — `/builds` · Diagrams2 technical schematic

**Catalog code:** `SF//DGM-00`. **Display font:** IBM Plex Mono + IBM Plex Sans Condensed.

**Composition:**
- Paper substrate: warm off-white `oklch(0.9 0.02 70)` (Diagrams2 is red+white on paper, not black).
- Red-on-paper accent: `oklch(0.55 0.22 28)` for all technical ink.
- Top: title "SIGNALFRAME//UX · BUILD SCHEMATIC" in Plex Sans Condensed.
- Body: a single large technical schematic — the `/builds` data (6 concept builds from `BUILDS` data) composed as a circuit diagram. Each build = a labeled component (transformer, relay, cathode, plate), wired together in a legible topology. Labels use Plex Mono.
- Each build-component is clickable and links to `/builds/[slug]`.
- `/builds/[slug]` sub-route: same paper + red ink language, but renders one build's detail as a zoomed-in schematic fragment with prose below.

**Reference source:** Diagrams2 pack (cdB digest §2). Replaces the current `BuildSigilDiagram` + card-grid pattern with a single schematic document.

### Plate 06 — `/init` · Helghanese + NCL terminal

**Catalog code:** `SF//HLG-00`. **Display font:** Zen Dots display, Share Tech Mono body.

**Composition:**
- Black field.
- Full-viewport "terminal" metaphor: simulated CLI session.
- Top: `SF//UX INIT v0.1` in Zen Dots, lime-green `oklch(0.8 0.2 135)` accent (parallel-world: Killzone green replaces this branch's magenta on THIS plate only — a deliberate break from one-accent rule to signal "the parallel world").
- Body: a typed-out install sequence in Share Tech Mono — `$ npx signalframeux init`, followed by 8–12 simulated output lines. Cursor blinks at the end.
- Left margin: Helghanese-glyph column (from `vault-helghanese.tsx`) — the alphabet as chrome.
- Right margin: NCL-style condensed wordmark vertically mounted, "PARALLEL WORLDS" repeated three times.
- Bottom prose in Share Tech Mono: a 3-sentence description of how to install / how to adopt. Ends with the terminal session "ending" — cursor fades.

**Reference source:** Helghanese (Killzone fictional alphabet) + NCL Mecha Globewar + Wipeout TTF archive (cdB digest §2, "Parallel Worlds" register).

## Shared chrome details

- **Four-corner insets:** 24px mobile, 32px desktop. Fixed position, z-50, pointer-events only on interactive elements (catalog nav + URL).
- **Corner typography:** all corner labels in JetBrains Mono, `text-[10px]` mobile → `text-[11px]` desktop, uppercase, tracking `0.15em`.
- **Active catalog entry:** magenta (`oklch(0.65 0.3 350)`), underlined.
- **No hamburger, no menu trigger.** The catalog IS the nav. Six entries always visible.
- **Mobile:** catalog nav wraps to two lines (3 entries per line). Still visible.

## Accessibility

- All six routes keyboard-navigable via catalog nav.
- All pack-specific canvas/SVG elements get `role="img"` + descriptive `aria-label` (e.g. "KLOROFORM-style dissolving ring pointcloud").
- All text meets WCAG AA contrast: magenta on black is ~7:1, muted foreground on black is ~4.5:1.
- Respects `prefers-reduced-motion`: pointcloud rotation, HUD pulse, cursor blink all pause.

## Performance

- Per-route font loading: only 2 globals + 1 display font per page (except `/reference` which loads 2 Archivo weights and `/builds` which loads Plex Mono + Plex Sans Condensed = 2). Weight budget ~40KB WOFF2 per page.
- Canvas primitives use 2D canvas, not WebGL, where possible (per V5's finding that WebGL was failing to paint on certain page layouts).
- LCP target <1.0s, CLS = 0, page weight <200KB initial excluding fonts.

## Dependencies

- `next/font/google` (already in use) — no new deps.
- `@/components/vault/*` — already present.
- `@/lib/component-registry` — already present; used by `/inventory`.
- `@/app/builds/builds-data.ts` — already present; used by `/builds`.
- No new packages.

## Build sequence (high-level; writing-plans will expand)

1. **Branch + layout skeleton** — font slate swap, `<DossierChrome>` + `<CatalogNav>` scaffold, verify existing layout survives.
2. **Plate 01 `/`** — KLOROFORM. This is the most-visited route; ship first.
3. **Plate 02 `/system`** — Cyber2k. Most-new primitives (octagon-frame).
4. **Plate 04 `/inventory`** — Black Flag. Uses existing `COMPONENT_REGISTRY` data.
5. **Plate 05 `/builds`** — Diagrams2. Uses existing `BUILDS` data + `/builds/[slug]` sub-route.
6. **Plate 03 `/reference`** — Brando. Paper substrate break — do after black-field plates are stable.
7. **Plate 06 `/init`** — Helghanese. Last: it's the parallel-world plate and works best once the "primary" dossier language is set.

Each plate ships as its own commit. Commit prefixes per CLAUDE.md: `Feat: D1 dossier chrome + font slate`, `Feat: D2 /  KLOROFORM plate`, etc. ("D" for dossier, paralleling V/C branch naming). Per the project convention, commit before every change — each plate's scratch work also gets a checkpoint commit before substantive edits if the work spans multiple files.

## Open questions (flagged for user, not blocking)

- **C1** — Should `<DossierChrome>` live inside `layout.tsx` (automatic on every route) or be a wrapper each page opts into? Leaning toward `layout.tsx` for consistency; the only risk is `/reference` needing a paper substrate background, which can be handled via a `data-substrate="paper"` attribute on `<main>` that chrome reads.
- **C2** — Geo-coordinates in the chrome: real (Culture Division HQ location) or fictional (SOC/IDN 7°33'22"S style, matching the vault reference)? Leaning fictional to fit the parallel-worlds register.
- **C3** — Should `/init`'s lime-green accent ACTUALLY break the one-accent rule, or should it stay magenta like every other plate? Leaning break-it, because "parallel worlds" is the point of that plate. But this is the only place in the whole site that breaks the one-accent contract.

## Success criteria

- All six routes render distinct pack-quotation compositions, no layout overlap or ghost infrastructure from the pre-reset layout.
- Visiting any route, you can identify which reference pack it quotes within ~5 seconds if you know the corpus.
- Catalog nav works on every route, active state correct.
- Font slate loaded; no Bungee, no Archivo Narrow on any route.
- Lighthouse ≥ 95 all categories on at least two plates (target 100 eventually, but 95 is the ship bar for this branch).
- Zero WCAG AA contrast violations.
- CLAUDE.md quality bar maintained: zero border-radius, no decorative gradients, no fake depth, one accent per plate (one exception noted at C3).
