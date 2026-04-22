# SIGNALFRAMEUX — FULL COMPONENT INDEX

**Locked commit:** `b650bf5` (main)
**Live:** http://localhost:3200 (dev server running)
**GitHub base:** https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5

---

## 1 · Live routes (7)

| Route | Local URL | Title | Source |
|---|---|---|---|
| Homepage (6 blocks) | http://localhost:3200/ | `SIGNALFRAME//UX` | [app/page.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/app/page.tsx) |
| System / tokens | http://localhost:3200/system | `TOKEN/EXPLORER` | [app/system/page.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/app/system/page.tsx) |
| Inventory grid | http://localhost:3200/inventory | `INVE/NTORY` | [app/inventory/page.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/app/inventory/page.tsx) |
| API reference | http://localhost:3200/reference | `API/REFERENCE` | [app/reference/page.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/app/reference/page.tsx) |
| Install / onboarding | http://localhost:3200/init | `INITIA/LIZE` | [app/init/page.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/app/init/page.tsx) |
| Builds landing | http://localhost:3200/builds | *not audited* | [app/builds/page.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/app/builds/page.tsx) |
| Build detail | http://localhost:3200/builds/[slug] | *not audited* | [app/builds/[slug]/page.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/app/builds/%5Bslug%5D/page.tsx) |

---

## 2 · Homepage sections (6 coded blocks)

Scroll `/` top-to-bottom, or jump via hash:

| # | Section | Local URL | Source |
|---|---|---|---|
| 01 | ENTRY (hero) | http://localhost:3200/#entry | [entry-section.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/blocks/entry-section.tsx) |
| 02 | THESIS | http://localhost:3200/#thesis | [thesis-section.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/blocks/thesis-section.tsx) |
| 03 | PROOF | http://localhost:3200/#proof | [proof-section.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/blocks/proof-section.tsx) |
| 04 | INVENTORY (preview) | http://localhost:3200/#inventory | [inventory-section.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/blocks/inventory-section.tsx) |
| 05 | SIGNAL | http://localhost:3200/#signal | [signal-section.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/blocks/signal-section.tsx) |
| 06 | ACQUISITION | http://localhost:3200/#acquisition | [acquisition-section.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/blocks/acquisition-section.tsx) |

---

## 3 · Block-level components (page sections + widgets)

| Component | Role | Source |
|---|---|---|
| Hero (orphan) | Legacy two-panel hero — not used on / | [hero.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/blocks/hero.tsx) |
| APIExplorer | /reference content | [api-explorer.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/blocks/api-explorer.tsx) |
| CodeSection | code block wrapper | [code-section.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/blocks/code-section.tsx) |
| ComponentDetail | overlay — opens from /inventory row click | [component-detail.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/blocks/component-detail.tsx) |
| ComponentGrid | 12-item grid (homepage INVENTORY) | [component-grid.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/blocks/component-grid.tsx) |
| ComponentsExplorer | /inventory full grid | [components-explorer.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/blocks/components-explorer.tsx) |
| DualLayer | FRAME/SIGNAL layer demo | [dual-layer.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/blocks/dual-layer.tsx) |
| ManifestoBand | manifesto wide band | [manifesto-band.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/blocks/manifesto-band.tsx) |
| ManifestoStatement | single thesis statement | [manifesto-statement.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/blocks/manifesto-statement.tsx) |
| MarqueeBand | scrolling marquee | [marquee-band.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/blocks/marquee-band.tsx) |
| PreviewTabs | preview/code tabs | [preview-tabs.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/blocks/preview-tabs.tsx) |
| SharedCodeBlock | /init code block wrapper w/ `TERMINAL™` label | [shared-code-block.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/blocks/shared-code-block.tsx) |
| StatsBand | stats row | [stats-band.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/blocks/stats-band.tsx) |
| TokenTabs | /system 6-tab selector | [token-tabs.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/blocks/token-tabs.tsx) |
| AcquisitionCopyButton | CTA copy action | [acquisition-copy-button.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/blocks/acquisition-copy-button.tsx) |
| ColorSpecimen | /system color token | [color-specimen.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/blocks/token-specimens/color-specimen.tsx) |
| SpacingSpecimen | /system spacing token | [spacing-specimen.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/blocks/token-specimens/spacing-specimen.tsx) |
| TypeSpecimen | /system type token | [type-specimen.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/blocks/token-specimens/type-specimen.tsx) |
| MotionSpecimen | /system motion token | [motion-specimen.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/blocks/token-specimens/motion-specimen.tsx) |

---

## 4 · Layout / chrome (21)

| Component | Role | Source |
|---|---|---|
| Nav | **TRADEMARK** cube-tile nav (L-shape) | [nav.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/layout/nav.tsx) |
| NavOverlay | nav overlay menu | [nav-overlay.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/layout/nav-overlay.tsx) |
| NavRevealMount | nav entrance reveal | [nav-reveal-mount.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/layout/nav-reveal-mount.tsx) |
| InstrumentHUD | top-right telemetry readout | [instrument-hud.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/layout/instrument-hud.tsx) |
| LiveClock | HH:MM ticker | [live-clock.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/layout/live-clock.tsx) |
| Breadcrumb | `[SFUX] // [PAGE]` pattern | [breadcrumb.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/layout/breadcrumb.tsx) |
| LogoMark | `SF//UX` brand mark | [logo-mark.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/layout/logo-mark.tsx) |
| DarkModeToggle | theme toggle cube | [dark-mode-toggle.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/layout/dark-mode-toggle.tsx) |
| BorderlessToggle | borderless mode toggle | [borderless-toggle.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/layout/borderless-toggle.tsx) |
| BackToTop | `↑` scroll-to-top | [back-to-top.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/layout/back-to-top.tsx) |
| CopyButton | `[COPY]` affordance | [copy-button.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/layout/copy-button.tsx) |
| CommandPalette | ⌘K command palette | [command-palette.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/layout/command-palette.tsx) |
| Footer | page footer | [footer.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/layout/footer.tsx) |
| ScaleCanvas | aspect-lock wrapper (--sf-canvas-scale) | [scale-canvas.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/layout/scale-canvas.tsx) |
| LenisProvider | smooth scroll provider | [lenis-provider.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/layout/lenis-provider.tsx) |
| PageAnimations | GSAP page-level timeline scan | [page-animations.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/layout/page-animations.tsx) |
| GlobalEffects | cursor + overlay effects | [global-effects.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/layout/global-effects.tsx) |
| SignalCanvas | full-page signal canvas host | [signal-canvas-lazy.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/layout/signal-canvas-lazy.tsx) |
| SignalframeConfig | provider wrapper | [signalframe-config.tsx](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/layout/signalframe-config.tsx) |

---

## 5 · SF component library (53 surfaces, from barrel)

**How to view live:** navigate to `/inventory`, click any row → overlay opens with the component rendered + API. Or inspect specimen cards in the /inventory grid. Or read the API at `/reference`.

### Layout primitives (5)
- [SFContainer](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-container.tsx) · [SFSection](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-section.tsx) · [SFStack](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-stack.tsx) · [SFGrid](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-grid.tsx) · [SFText](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-text.tsx)

### Forms (11)
- [SFButton](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-button.tsx) · [SFInput](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-input.tsx) · [SFCheckbox](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-checkbox.tsx) · [SFRadioGroup](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-radio-group.tsx) · [SFSwitch](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-switch.tsx) · [SFSelect](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-select.tsx) · [SFTextarea](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-textarea.tsx) · [SFSlider](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-slider.tsx) · [SFToggle](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-toggle.tsx) · [SFInputGroup](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-input-group.tsx) · [SFInputOTP](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-input-otp.tsx)

### Overlays (5)
- [SFDialog](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-dialog.tsx) · [SFSheet](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-sheet.tsx) · [SFPopover](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-popover.tsx) · [SFDropdownMenu](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-dropdown-menu.tsx) · [SFHoverCard](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-hover-card.tsx)

### Feedback (7)
- [SFAlert](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-alert.tsx) · [SFAlertDialog](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-alert-dialog.tsx) · [SFProgress](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-progress.tsx) · [SFSkeleton](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-skeleton.tsx) · [SFEmptyState](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-empty-state.tsx) · [SFToast](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-toast.tsx) · [SFToaster](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-toast-lazy.tsx)

### Navigation (6)
- [SFTabs](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-tabs.tsx) · [SFBreadcrumb](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-breadcrumb.tsx) · [SFPagination](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-pagination.tsx) · [SFNavigationMenu](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-navigation-menu.tsx) · [SFAccordion](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-accordion.tsx) · [SFCollapsible](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-collapsible.tsx)

### Data display (7)
- [SFTable](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-table.tsx) · [SFCard](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-card.tsx) · [SFBadge](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-badge.tsx) · [SFAvatar](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-avatar.tsx) · [SFStatusDot](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-status-dot.tsx) · [SFTooltip](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-tooltip.tsx) · [SFScrollArea](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-scroll-area.tsx)

### Multi-step / selection (4)
- [SFStepper](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-stepper.tsx) · [SFToggleGroup](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-toggle-group.tsx) · [SFSeparator](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-separator.tsx) · [SFLabel](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-label.tsx)

### Symbol (1)
- [CDSymbol](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/cd-symbol.tsx) — divider/circuit-node glyph

### Command (non-barrel, 1)
- [SFCommand](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/sf/sf-command.tsx) — ⌘K palette primitives (lazy-imported)

### Effects (non-barrel, 1)
- [SFSignalComposer](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/sf-signal-composer.tsx) — three.js composer (lazy)

---

## 6 · Animation / signal primitives (44 — grouped by role)

### Signal-layer canvases (the TRADEMARK pixel-sort family)
- [GLSLHero](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/glsl-hero.tsx) / [lazy](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/glsl-hero-lazy.tsx) — FBM noise (hero)
- [GLSLSignal](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/glsl-signal.tsx) / [lazy](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/glsl-signal-lazy.tsx) — Ikeda data-field (SIGNAL section)
- [ProofShader](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/proof-shader.tsx) / [lazy](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/proof-shader-lazy.tsx) — lattice ↔ FBM (PROOF section)
- [PointcloudRing](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/dossier/pointcloud-ring.tsx) — ring pixel-sort canvas (ENTRY)
- [IrisCloud](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/dossier/iris-cloud.tsx) — iris pixel-sort canvas (ENTRY)
- [HeroMesh](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/hero-mesh.tsx) — legacy hero mesh
- [SignalMesh](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/signal-mesh.tsx) / [lazy](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/signal-mesh-lazy.tsx)

### Staging / reveal
- [PinnedSection](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/pinned-section.tsx) — used by THESIS
- [ScrollReveal](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/scroll-reveal.tsx)
- [SplitHeadline](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/split-headline.tsx)
- [ScrambleText](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/scramble-text.tsx)
- [CodeTypewriter](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/code-typewriter.tsx)
- [PageTransition](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/page-transition.tsx)
- [XrayReveal](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/xray-reveal.tsx)
- [HorizontalScroll](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/horizontal-scroll.tsx)

### Micro-interaction
- [Magnetic](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/magnetic.tsx)
- [HoverPreview](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/hover-preview.tsx)
- [BorderDraw](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/border-draw.tsx) — CTA button border animation
- [LogoDraw](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/logo-draw.tsx)
- [CanvasCursor](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/canvas-cursor.tsx)
- [ColorCycleFrame](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/color-cycle-frame.tsx) — hero wordmark cycle

### Overlays / atmosphere
- [DatamoshOverlay](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/datamosh-overlay.tsx) / [lazy](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/datamosh-overlay-lazy.tsx)
- [SignalOverlay](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/signal-overlay.tsx) / [lazy](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/signal-overlay-lazy.tsx)
- [VHSOverlay](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/vhs-overlay.tsx)
- [GhostLabel](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/ghost-label.tsx)
- [GlitchPass](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/glitch-pass.tsx)
- [BloomPass](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/bloom-pass.tsx)
- [DisplaceField](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/displace-field.tsx)
- [FeedbackField](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/feedback-field.tsx)

### Particle / field
- [ParticleField](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/particle-field.tsx) / [lazy](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/particle-field-lazy.tsx) / [HQ](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/particle-field-hq.tsx)
- [ComponentSkeleton](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/component-skeleton.tsx) — SkeletonGrid for PROOF
- [CircuitDivider](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/circuit-divider.tsx)
- [BuildSigilDiagram](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/build-sigil-diagram.tsx)

### Token viz / signal-motion
- [TokenViz](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/token-viz.tsx) / [loader](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/token-viz-loader.tsx)
- [SignalMotion](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/signal-motion.tsx)
- [AudioReactiveModulator](https://github.com/Grey-Altr/SignalframeUX/blob/b650bf5/components/animation/audio-reactive-modulator.tsx)

---

## 7 · How to use this index

1. **Global vision check** — open all 7 route URLs in tabs; scroll each top-to-bottom.
2. **Section-by-section check** — use the 6 homepage anchors (§2) to jump directly.
3. **Component-by-component check** — click any source link to read the implementation.
4. **Component-in-context check** — visit `/inventory`, click a row to open the overlay, or find its specimen in the grid.
5. **Trademark check** — T1 (pixel-sort) is visible everywhere signal fires; T2/T3 (glyph+cube) are visible in every nav cube; T4 (`//`) is visible in every label.

When you find something good/bad, tell me the route+section or component name and what you want changed. I'll redline LOCKDOWN.md accordingly.
