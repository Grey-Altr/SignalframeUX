# SignalframeUX implementation digest

> Parallel to `cdB-digest.md`. Same structure, turned inward.
> Source: `app/globals.css`, `components/sf/*`, `components/blocks/*`, `components/layout/*`, `components/animation/*`, plus 8 rendered-state screenshots.
> Captured: 2026-04-18, branch `aesthetic-deep-dive`. Build reference: v1.7 (post-Phase 34).

---

## Framing insights

- SignalframeUX is **not a reference collection, it is a compiled position.** The cdB vault catalogs peers; this system is what that position looks like executed as a working design system. Most of the cdB grammar is present — corner chrome, zero-radius, one-pop-color, serialized catalog codes — but expressed as live tokens, shaders, and React primitives rather than as still posters.
- The aesthetic is carried by **four anchor mechanisms**, not by component styling: (1) the `--sfx-*` token layer in `globals.css`, (2) three WebGL shaders (`GLSLHero`, `GLSLSignal`, `ProofShader`), (3) the HUD chrome stack (`InstrumentHUD`, `NavCube`, `ColorCycleFrame`, `LiveClock`), (4) the six coded blocks (`HERO → ENTRY → THESIS → PROOF → SIGNAL → ACQUISITION`). Strip any one and the SignalframeUX register collapses.
- The accent is **magenta**, not lime. This is the single largest deliberate divergence from the cdB peer group — where Enero/Massive/NXCL/ZULA converge on hi-viz green, SignalframeUX took `oklch(0.65 0.3 350)`. Yellow (`--sf-yellow`) is held as a secondary chrome signal (nav cubes, multilingual hero lines). This inverts the cdB accent hierarchy while staying inside the one-pop rule.

---

## 1 · Shared grammar (how SF encodes the cdB contract)

| Element | SF implementation |
|---|---|
| **Ground** | `--background: oklch(0.145 0 0)` (pure black) / `oklch(0.985 0 0)` (pure white). Hero is a **hard-cut 50/50 black/white split** — the one-field-one-accent rule broken open horizontally. Paper-grain is simulated by `--sfx-grain-opacity: 0.03` FBM + VHS overlay. |
| **Accent hierarchy** | Exactly one pop: `--sfx-primary = magenta`. Secondary chrome: `--sf-yellow` (nav-cube fill, JP/AR/CN hero lines). Tertiary: `--destructive` / `--success` / `--warning` only inside extended-tier components. No iridescent, no holographic. |
| **Chrome** | Fixed chrome stack: `InstrumentHUD` (top-right, 5 fields desktop / 3 mobile), `Nav` cube stack (bottom-left), `SF//UX` version tag (hero bottom-right), section labels as CSS `::before` on `[data-section-label]`. Multilingual strings (`シグナルフレーム™` / `سیگنال‌فریم™` / `信号框架™`) act as parallel-world anchors, replacing the vault's geo-coordinates. |
| **Label system** | Two parallel codes: bracketed **section identifiers** (`[01//HERO]`, `[03//PROOF]`) wired via `data-section-label`, and **catalog codes** (`SF//FRM-001`, `SF//GEN-001`) rendered inside the PROOF frame-pole column. The latter is conceptual-only — not yet surfaced as a browsable catalog page. |
| **Type pairing** | Four-voice system: `Anton` (display, heading-1) + `Inter` (body, heading-2/3) + `JetBrains Mono` (chrome, code) + `Electrolize` (brand/special). One more voice than the cdB three-voice norm — counts as either expressive headroom or type-bloat depending on application. |

## 2 · Form vocabulary, inventoried

**Shader output (SIGNAL-layer geometry):**
- `GLSLHero` — FBM noise field, opacity 0.45 in hero left panel.
- `GLSLSignal` — Ikeda data-field: scanlines, vertical data columns, yellow spike markers; 150vh sticky section, sets `--sfx-signal-intensity: 1.0` globally on enter.
- `ProofShader` — geometric lattice ↔ FBM noise, driven by `--sfx-signal-intensity`, modulated by pointer/gyro input (iOS gamma ±60°), rAF lerp factor 0.08.

No pointcloud morphologies yet. KLOROFORM's ring/torus/comet/event-horizon vocabulary is absent.

**HUD / chrome forms:**
- `InstrumentHUD` — complementary fixed overlay, rAF-driven scroll+SIG readouts via direct DOM refs (no React state thrash), IntersectionObserver fallback for section detection.
- `NavCubeLink` — 32px cube with `clip-path: polygon(...)` 8px top-right notch; hover rolls out to show scrambled `//LABEL`. `--sfx-yellow` fill + black text + black ring when active/pinned.
- `NavSignalGlyph` — interactive rolling bars, pinnable (warning color when pinned).
- `ColorCycleFrame` — wraps `SF//UX` badge + hero `SignalframeUX` per-character reveal.
- `CDSymbol` — circuit-node glyph used in ACQUISITION.

**Component primitives (the FRAME catalog):**
53 SF-wrapped components exported from `components/sf/index.ts` — layout (`SFContainer/Section/Stack/Grid/Text`), forms (`SFButton/Input/Checkbox/Radio/Switch/Select/Textarea/Slider/Toggle/InputGroup/InputOTP`), overlays (`SFDialog/Sheet/Popover/DropdownMenu/HoverCard/Command`), feedback (`SFAlert/AlertDialog/Toast/Progress/Skeleton`), navigation (`SFBreadcrumb/Pagination/NavigationMenu/Tabs`), data (`SFTable/Card/Badge/Avatar/StatusDot`), symbols (`CDSymbol`), effects (`SFSignalComposer`). The hero text claims "48 SF COMPONENTS" — **drift: actual export count is 53**. Catalog-count copy needs reconciliation.

**Block catalog (the page-scale forms):**
- `HERO` — split 50/50, SIGNAL//FRAME display `clamp(58px, 16.8vw, 437px)`, scale 1.176.
- `ENTRY` — GLSLHero WebGL bg, centered SIGNALFRAME//UX, magenta `//` slash scrubbed 0.18→1.0 opacity.
- `THESIS` — `PinnedSection` with 6 `ManifestoStatement` pillars; enter/hold/exit 0.35/0.3/0.35, bookend void 40vh, `ease: "sf-snap"`.
- `PROOF` — 3-layer (ProofShader + SkeletonGrid of 12 component silhouettes + 320px frame-pole column with `SYSTEM_STATS` + first 6 `SF//[CAT]-NNN` codes). No pin, no scrub per AC-10.
- `SIGNAL` — 150vh GLSLSignal sticky.
- `ACQUISITION` — terminal register, `npx signalframeux init` at text-3xl, "last thing a user sees — like a terminal session that ended, not an invitation."

## 3 · Typography — what SF does vs. the vault evidence

| Axis | Vault exemplar | SF implementation | Gap |
|---|---|---|---|
| **Extreme horizontal** | NCL Graxebeosa, DEN® | — | Not yet explored. Hero `SIGNAL//FRAME` is large but not horizontally compressed. |
| **Extreme vertical** | Segapunk | — | Not yet explored. |
| **Multilingual system** | Helghanese (fictional) + Wipeout TTFs | Real JP/AR/CN strings in `--sf-yellow` | SF is using **real** languages where the vault uses fictional alphabets. Parallel-worlds register is therefore milder in SF. |
| **Catalog-as-font** | 608–4864 glyph packs, debug bezier-point view | — | No commissioned SF display face. Using open-source Anton for display. |

The scale is clamp()-based with `--sf-vw`: `--text-2xs` (8–12px) → `--text-4xl` (48–120px), minor-third ratio 1.2. Semantic aliases (`text-heading-1/-2/-3 / text-body / text-small`) map into the scale.

**Verdict:** SF's typography is **disciplined and responsive** but not yet expressive at the cdB peer tier. A Rudnick-tier commissioned display face is the single biggest typographic gap.

## 4 · Texture — the allowed distortion vocabulary

SF implements the Cyber2k distress-filter register via CSS + shaders, not Photoshop actions:

- **VHS overlay** — scan lines + analog-grain, global canvas layer (`screenshot-vhs-softer.png` captures the current intensity).
- **FBM grain** — `--sfx-grain-opacity: 0.03`, universal static floor.
- **Shader noise** — FBM in `GLSLHero`, `ProofShader` crossfade.
- **Radius discipline** — `--sfx-radius: 0px`. Zero rounded corners across 53 components. Explicit refusal of bubble geometry.
- **Shadow discipline** — `globals.css` carries a policy comment: **no box-shadow elevation scale**. Depth comes from hierarchy/contrast/motion only, matching the DU/TDR deliberate-flatness thesis.
- **Canvas cursor** — canvas-layer cursor for hover states, replacing native pointer on interactive targets.

Missing from SF vs. the vault: **moire / halftone / corrugated-sheet** texture vocabulary (Black Flag E0000 pack grammar). Currently absent from any SF surface.

## 5 · Register map — which moodboard is already executed, which isn't

| Moodboard | Carried by | Status |
|---|---|---|
| **Dark Precision** | Hero LEFT panel, ProofShader, InstrumentHUD, all black pages | ✅ Canonical |
| **Generative Systems** | GLSLSignal + ProofShader (FBM + lattice) | ✅ Present |
| **Coded Systems** | `SF//FRM-NNN` / `SF//GEN-NNN` codes, `[XX//LABEL]` section attrs, NavCube links | ✅ Strong |
| **Static-as-Aesthetic** | VHS overlay, FBM grain, scan-line layer | ✅ Strong |
| **Subverted Corporate** | `ColorCycleFrame` `SF//UX` badge, `LiveClock` scramble, command-palette UI | △ Partial |
| **Post-Corporate Political** | — | ❌ **Missing**. No stamp vocabulary, no manifesto-propaganda register. THESIS is philosophical, not political. |
| **Parallel Worlds** | Multilingual hero (`シグナルフレーム™` / `سیگنال‌فریم™` / `信号框架™`) | △ Partial (real languages, not fictional) |
| **Hardish Cyberpunk** | GLSLHero field, ProofShader lattice | △ Partial (register milder than vault's Oshii/Blomkamp tier) |
| **Industrial Romanticism** | Hero halftone diamond, black/white hard-cut | △ Partial |
| **Liminal Nightclub** | SIGNAL section 150vh data field | △ Partial (needs extreme-condensed type to complete register) |
| **machElegy** | `SignalframeUX` per-char reveal, ColorCycleFrame, `feel` manifesto word (magenta blur-in) | ✅ Present |

**Coverage: 5 ✅ / 5 △ / 1 ❌ out of 11 registers.** Post-corporate-political is the single complete miss.

## 6 · Anti-references — what SF explicitly refuses

SF's refusals are written into `globals.css` and `CLAUDE.md`, not left implicit:

1. `--sfx-radius: 0px` on **every** token consumer → total refusal of rounded-corner bubble geometry.
2. Explicit `globals.css` policy comment: **no `box-shadow` elevation scale** → refusal of fake depth.
3. Explicit `globals.css` policy comment: **no new color tokens without review** → refusal of palette bloat.
4. `CLAUDE.md` hard constraint: **no skeuomorphism, no decorative gradients, no generic dark-mode aesthetic** → refusal of Liquid Glass / Apple chromatic register.
5. **One-pop enforcement** at the token layer: `--primary` / `--secondary` / `--accent` are a triad; extended-tier colors (`muted`, `card`, `destructive`, `success`, `warning`) are gated to component-specific use.

These refusals are **mechanical, not taste-based** — a contributor has to override a token comment or break a CVA recipe to violate them. The system enforces its own hard line.

## 7 · Gaps — what the cdB evidence proves SF still lacks

Reverse of the cdB "translation to SF" section: concrete deficits visible when the two digests are placed side by side.

1. **No commissioned display face.** Every peer studio ships one (DEN®, Graxebeosa, Segapunk, Helghanese, Wipeout TTFs). SF uses Anton (open-source). A Rudnick-tier commissioned SF face with alternate glyphs + bezier-debug preview would close the typographic gap in one move.
2. **No stamp primitive.** The green-pill stamp (`ORGULLECIDA` / `NEVER COME BACK` / `BERSERKER!` / `Nevermore`) is a recurring vault form and SF has no equivalent. A stampable coded-mark component would deepen the coded-systems layer and close part of the post-corporate-political gap.
3. **No pointcloud morphologies.** KLOROFORM's ring / torus / comet / event-horizon / tunnel-slice vocabulary is the vault's canonical SIGNAL-layer output. SF shaders are FBM + lattice only — a pointcloud-morphology shader pass would expand the generative register without breaking the frame contract.
4. **No moire / corrugated-sheet / halftone flag geometry.** Black Flag's E0000 pack (30 serialized banner forms) is absent from SF. Could surface as a background layer primitive or a coded-mark variant set.
5. **Catalog page missing.** `SF//FRM-NNN` and `SF//GEN-NNN` codes are minted but there is no browsable catalog surface where the codes map to their components/effects. The vault proves **the catalog IS the brand** — SF's catalog-code discipline is ahead of its catalog-rendering discipline.
6. **Post-corporate-political register unentered.** Metahaven lineage (manifesto-propaganda, CND flag, COUNTERPRODUCTIVE MMXXII) is the only fully-missing moodboard. Would need copy-register work, not just primitives.
7. **Count drift.** Hero reads "48 SF COMPONENTS"; `components/sf/index.ts` exports 53. The catalog chrome is lying to itself. Fix the copy or the barrel.
8. **Parallel-worlds register is too literal.** Using real JP/AR/CN renders the trilingual signature at tourist-brochure strength. The vault's Helghanese / Wipeout fictional alphabet register is stronger. Worth exploring a fictional-alphabet pass for at least one of the three lines.

---

*Companion: `cdB-digest.md` for the reference corpus these findings are measured against.*
