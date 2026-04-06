# Feature Research

**Domain:** Interactive design system showcase site + component library completion
**Milestone:** v1.4 Feature Complete
**Researched:** 2026-04-06
**Confidence:** HIGH (codebase audit + official shadcn/Radix docs + cross-system analysis)

---

## Context: What Already Exists

SignalframeUX v1.3 shipped:
- 45 SF components (5 layout primitives, 40 interactive/display)
- ComponentsExplorer: 6-category filterable grid with CSS-only thumbnail previews
- APIExplorer: sidebar nav + props tables + code block at `/reference`
- Registry: 49-item shadcn CLI registry with `meta.layer` / `meta.pattern` / `meta.heavy`
- Token system: spacing (9 stops), typography (5 semantic aliases), layout (5 tokens), color (core 5 + extended), animation (5 durations, 3 easings)

The v1.4 milestone adds: remaining shadcn components, token system finalization, and interactive component detail views (click to see props, variants, code).

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features a design system showcase site must have. Missing these = the site feels like a demo, not a reference.

| Feature | Why Expected | Complexity | Depends On |
|---------|--------------|------------|------------|
| Per-component detail view (props, variants, code) | Every design system site (shadcn, Radix, MUI) shows this — missing it signals incompleteness | MEDIUM | Existing APIExplorer infra, registry metadata |
| Copy-to-clipboard on code blocks | Standard since 2020; users expect it on every code snippet | LOW | SharedCodeBlock already has infra |
| Live/rendered component preview in detail view | Users need to see the component, not just read about it | MEDIUM | SF components already importable; need isolated render context |
| Props table per component | Table of name, type, default, description is the minimum API surface doc | MEDIUM | Prop definitions (partial in API_DOCS lib; need full coverage) |
| Variant grid showing all intent values | Show all CVA variants side by side (primary, secondary, ghost, destructive) | MEDIUM | CVA variants already defined; need rendering surface |
| Remaining shadcn/Radix components wrapped | SFDrawer, SFHoverCard, SFInputOTP fill the most visible gaps that force consumers to drop to raw shadcn | MEDIUM per component | shadcn CLI base components |
| Token system final audit and documentation | globals.css has most tokens; elevation tier, sidebar tokens need documentation gaps closed | LOW | globals.css mostly complete |
| Component search and URL addressability from detail view | User clicks a card, sees detail — needs back-navigation or direct-link URL | LOW | Next.js routing |
| Keyboard accessible detail panel | Tab into panel, Escape to close — WCAG AA required | LOW | Radix Collapsible or Dialog pattern |

### Differentiators (Competitive Advantage)

Features that distinguish this from a generic shadcn docs clone.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| SIGNAL layer integration visible in detail view | Show the animation token (`--duration-fast`, GSAP easing) used by each component alongside the props — no other design system exposes this | LOW | Metadata already in registry; display it |
| DU/TDR aesthetic applied to the detail view UI itself | The detail panel must feel like the system, not a generic white card — sharp edges, uppercase labels, `sf-display` typography, yellow accent on selected state | LOW | Style work only; no new architecture |
| FRAME/SIGNAL layer badge per component | `meta.layer` already in registry — surface it visually in detail view with a styled badge | LOW | Data already exists |
| Pattern taxonomy visible (A/B/C) | `meta.pattern` (35A, 2B, 12C) explains construction method — valuable for engineers adopting the system | LOW | Data already exists |
| CLI install snippet directly in detail view | `pnpm dlx shadcn@latest add sf-button` in the panel — makes adoption frictionless | LOW | Registry already works; add display UI |
| "Install via CLI" one-line copy | Surfacing the exact command removes the lookup step for new consumers | LOW | Deterministic from component name |
| Component composition callout | Show which SF components compose another (SFStepper uses SFProgress; SFNavigationMenu uses SFSheet on mobile) | MEDIUM | Requires authoring composition metadata |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Storybook integration | Industry standard; teams expect it | Introduces a separate build pipeline, MDX authoring burden, and a visual identity that fights the DU/TDR aesthetic. The existing APIExplorer + ComponentsExplorer covers 90% of Storybook's value for a single-system showcase | Extend the existing custom explorer with inline detail views |
| Interactive prop controls (knobs) | Real-time prop manipulation like Storybook Controls | High complexity for custom implementation; requires runtime prop-injection that interacts poorly with Server Components and GSAP animations | Show all variants statically in a variant grid — same information, zero prop-injection complexity |
| MDX/Markdown component pages | Full narrative prose per component | MDX adds a build-time dependency and content authoring surface requiring ongoing maintenance; the system is code-first | TypeScript `COMPONENT_DOCS` map (already exists as `API_DOCS` in lib/) — props, description, variants as data, not prose |
| Dark/light mode toggle per preview | See components in both themes | Adds UI complexity to the detail view; the aesthetic discipline depends on dark-primary | The theme toggle in the nav already handles this; document light mode as secondary |
| Figma embed per component | Link design specs to components | Figma files require auth; embeds break for external visitors; high maintenance cost as design evolves | Defer to cdOS milestone |
| Full-text search across props/docs | Search by prop name, type, description | Requires indexing runtime; adds bundle weight; 45 components doesn't warrant full-text search | Category filter + name search (already exist) are sufficient |
| Carousel component (SFCarousel) | Radix/shadcn has it | Swipe gesture handling conflicts with GSAP ticker ownership of animation frames; carousel aesthetic conflicts with DU/TDR industrial language | Not wrapping — explicitly excluded |
| Chart component (SFChart) | Useful for dashboards | recharts adds ~50KB gzipped; no current consumer identified; defer until cdOS dashboard needed | Registry entry only if deferred; no showcase rendering |
| ContextMenu (SFContextMenu) | Radix has it | Right-click interactions are inaccessible on touch devices; aesthetically misaligned with DU/TDR; explicitly excluded in v1.3 | None — intentional exclusion |
| Resizable panels (SFResizable) | Radix has it | No identified consumer use case; explicitly excluded in v1.3 | None — intentional exclusion |

---

## Feature Dependencies

```
Component Detail View
    └──requires──> ComponentEntry metadata (exists: index, name, category, version, meta.layer, meta.pattern)
    └──requires──> Props definition data (partial: API_DOCS covers ~10 components; need 35 more authored)
    └──requires──> Live SF component renders (exists: all SF components importable)
    └──requires──> Code snippets per component (partial: SharedCodeBlock exists; usage snippets need authoring)
    └──requires──> CLI command string (NEW: deterministic formula from component name + registry)

Variant Grid in Detail View
    └──requires──> CVA variant definitions (exists: all interactive SF components use CVA with `intent`)
    └──requires──> Rendered SF component instances (NEW: upgrade from CSS-only thumbnails to live SF renders in detail view)

Homepage Grid Cards Clickable
    └──requires──> Component detail view (above)
    └──requires──> component-grid.tsx updated to trigger same detail expansion

SFDrawer
    └──requires──> vaul package (verify: may already be transitively present via Sonner)
    └──requires──> SF wrapper following SCAFFOLDING.md 9-point checklist
    └──requires──> Registry entry + ComponentsExplorer entry (same-commit rule)
    └──requires──> meta.heavy: true (lazy load in SF wrapper)

SFHoverCard / SFInputOTP
    └──requires──> shadcn CLI base install
    └──requires──> SF wrapper + registry + explorer entry

Token System Finalization
    └──requires──> Audit globals.css against CLAUDE.md token spec (LOW: mostly complete)
    └──requires──> Elevation decision: explicitly exclude (recommended) or add shadow tokens
    └──requires──> SCAFFOLDING.md updated with sidebar/chart token documentation
```

### Dependency Notes

- **Detail view requires props data first:** `lib/api-docs.ts` has partial coverage (~10 components). Authoring the remaining 35 component prop definitions is the largest non-engineering effort in the milestone. The detail view infrastructure can be built while props data is authored in parallel.
- **Variant grid requires live renders, not CSS thumbnails:** The ComponentsExplorer uses CSS sketches for performance in the grid. The detail view is the live-render surface. These are intentionally separate surfaces — maintain the split.
- **CLI snippet format is deterministic:** `pnpm dlx shadcn@latest add sf-[component-name]` — no new data needed, just display UI.
- **Homepage grid reuse:** The detail view component should be authored once and consumed by both ComponentsExplorer (at `/components`) and component-grid.tsx (homepage). Avoid duplicating the panel implementation.

---

## MVP Definition

### Launch With (v1.4)

The minimum set that satisfies the PROJECT.md milestone goal.

- [ ] **Component detail view** — click a card in ComponentsExplorer, expand inline to see: (1) variant grid with all `intent` values rendered live, (2) props table with name/type/default/description, (3) copy-able usage snippet + CLI install command. Accessible: keyboard-navigable, Escape to close. FRAME/SIGNAL badge and pattern tier (A/B/C) visible.
- [ ] **Props data authored for all 45 existing components** — the detail view is meaningless without accurate props tables. This is authoring work, not engineering work, but it is the prerequisite for the feature having value.
- [ ] **Homepage grid cards clickable** — same detail expansion behavior as ComponentsExplorer. Required by PROJECT.md: "Homepage grid components clickable with same detail expansion."
- [ ] **SFDrawer** — Vaul-based, lazy-loaded, `meta.heavy: true`. Fills the bottom-sheet overlay gap that SFSheet (slide from right) doesn't cover. High value for mobile-first patterns.
- [ ] **Token system audit committed** — globals.css annotated, elevation absence explicitly documented, sidebar/chart color tokens noted in SCAFFOLDING.md.
- [ ] **v1.2/v1.3 tech debt closed** — MutationObserver disconnect on unmount, readSignalVars NaN guard, duplicate TOAST entry in ComponentsExplorer.

### Add After Validation (v1.4.x)

- [ ] **SFHoverCard** — Radix HoverCard, FRAME-only, small bundle cost. Add once detail view infrastructure is proven. Trigger: visual QA pass on detail view.
- [ ] **SFInputOTP** — Radix OTP input, relevant for cdOS auth flows. Trigger: cdOS milestone scoping starts.
- [ ] **Component composition callout in detail view** — low-hanging DX win. Add as a metadata field in COMPONENT_DOCS and render as a dependency list.
- [ ] **Token usage callout per component** — "This component uses: `--duration-fast`, `--ease-hover`." Medium authoring effort; defer until after props data is complete.

### Future Consideration (v2+)

- [ ] **SFSidebar** — shadcn Sidebar is a large composable system (Sidebar, SidebarProvider, SidebarInset, etc.). Relevant when cdOS dashboard is being built. Defer.
- [ ] **SFChart** — recharts dep (~50KB); defer until a dashboard block is needed for the showcase.
- [ ] **DataTable composite block** — SFTable + SFPagination + SFSelect + SFInput. High value for cdOS; significant API surface design required. Explicitly deferred from v1.3.
- [ ] **SFFileUpload** — no Radix base; requires custom implementation. cdOS use case only.
- [ ] **Registry namespace strategy** (`@signalframe/` vs unnamespaced) — relevant when cdOS becomes an active consumer.

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Component detail view (inline expand) | HIGH — core milestone goal | MEDIUM | P1 |
| Props data authoring (45 components) | HIGH — unlocks detail view value | MEDIUM (authoring, not engineering) | P1 |
| Homepage grid cards clickable | HIGH — PROJECT.md requirement | LOW (reuse detail view component) | P1 |
| SFDrawer (lazy, vaul) | HIGH — visible gap in component set | MEDIUM | P1 |
| Variant grid in detail view | HIGH — demonstrates component richness | MEDIUM | P1 |
| Copy-to-clipboard on code blocks | MEDIUM — expected UX | LOW | P1 |
| FRAME/SIGNAL badge + pattern tier in detail view | MEDIUM — differentiator, data exists | LOW | P1 |
| CLI install snippet in detail view | MEDIUM — adoption friction | LOW | P1 |
| Tech debt (v1.2/v1.3 non-blocking) | MEDIUM — accumulation risk | LOW | P2 |
| SFHoverCard | MEDIUM — fills gap | LOW | P2 |
| SFInputOTP | MEDIUM — cdOS auth use case | LOW | P2 |
| Token system audit + docs | MEDIUM — closes gaps | LOW | P2 |
| Component composition callout | MEDIUM — DX value | MEDIUM | P2 |
| SFSidebar | MEDIUM | HIGH | P3 |
| SFChart | LOW (no current consumer) | HIGH (recharts dep) | P3 |
| SFCarousel | LOW (aesthetic conflict) | MEDIUM | Excluded |
| SFResizable | LOW (no use case) | MEDIUM | Excluded |
| SFContextMenu | LOW (touch inaccessible, aesthetic conflict) | LOW | Excluded |

---

## Competitor Feature Analysis

| Feature | shadcn/ui docs | Radix UI docs | SignalframeUX v1.4 approach |
|---------|---------------|---------------|------------------------------|
| Component detail surface | Full page per component at `/docs/components/[name]` | Full page per primitive with anatomy, props, examples | Inline expand from grid card — no page navigation, preserves grid context |
| Live preview | Renders actual component with controls | Renders actual primitive in examples | Render actual SF component in variant grid within detail panel |
| Props table | Auto-generated from TypeScript, grouped by component part | Full ARIA attribute documentation | TypeScript `COMPONENT_DOCS` map, manually curated for SF-specific nuance |
| Copy code | Yes — single usage example | Yes — multiple examples per feature | Yes — usage snippet + CLI install command, both copyable |
| Variant display | Separate visual examples, not side-by-side | Single representative example | Side-by-side variant grid showing all `intent` values |
| Design identity | Generic clean white | Generic clean white | DU/TDR industrial: sharp, high-contrast, uppercase labels, yellow accent on selected state |
| SIGNAL/animation docs | Not applicable | Not applicable | First-class: animation tokens surfaced per component in detail view |
| Installation | `pnpm dlx shadcn@latest add [name]` | npm install per package | Same CLI pattern, displayed directly in the detail panel |
| Searchability | Full-text across all docs | Browser search only | Category filter + name search — sufficient for 45 components |

---

## Implementation Notes

### Detail View: Inline Expand vs Drawer vs Full Page

Three patterns exist in the ecosystem:

1. **Full page navigation** (shadcn/ui): each component at `/docs/components/button`. SEO-friendly; requires separate pages for each of 45 components.
2. **Side drawer** (Storybook): slides in from the right, obscures grid. Loses browsing context.
3. **Inline expand** (PROJECT.md goal): card expands in place. Grid context preserved.

**Recommendation: inline expand using GSAP FLIP.** The ComponentsExplorer already uses GSAP FLIP for filter animations. The same technique handles expand/collapse animations without layout shift. This is pattern-consistent with the existing system. Use `SFCollapsible` or a custom Radix-free expand for the panel itself — avoid SFDialog (wrong semantic) or SFSheet (wrong visual language for this use case).

**Detail view content: 3 tabs maximum.**
1. **VARIANTS** — rendered SF component in all `intent` and `size` values
2. **PROPS** — table: name / type / default / required / description
3. **CODE** — usage snippet + CLI install command, both with copy button

Three tabs is the industry norm (shadcn, MUI, Atlassian all use Preview / Props / Code). Four or more tabs fragment the information without adding clarity.

### Components to Wrap

**P1 — Wrap in v1.4:**
- `SFDrawer` — Vaul-based (verify if vaul already in package.json before adding). Lazy-loaded, `meta.heavy: true`. Bottom-sheet pattern for mobile-first overlays. SFSheet handles right-side slide; Drawer handles bottom-up.

**P2 — Wrap in v1.4.x:**
- `SFHoverCard` — Radix HoverCard, FRAME-only wrapper, minimal bundle cost
- `SFInputOTP` — Radix OTP input, cdOS auth flows, minimal bundle cost

**Explicitly excluded:**
- `SFCarousel` — animation frame conflict with GSAP; aesthetic conflict with DU/TDR
- `SFChart` — recharts ~50KB; no current consumer
- `SFResizable` — no use case identified
- `SFContextMenu` — inaccessible on touch; aesthetic misalignment
- `SFSidebar` — deferred to cdOS milestone (large composable system)

### What "Token Finalization" Means

The token system is largely complete. Specific gaps:
- **Elevation tier:** No `box-shadow` tokens exist. Decision: explicitly document the absence. "No elevation tokens — depth via spacing, contrast, and motion only" aligns with Enhanced Flat Design philosophy. Add as a comment to globals.css.
- **Sidebar color tokens:** `--color-sidebar-*` exist in globals.css but are not documented in SCAFFOLDING.md. Add them to the extended palette documentation.
- **Chart color tokens:** `--color-chart-1` through `--color-chart-5` exist in globals.css. If SFChart is deferred, add a comment noting these are reserved for future chart use.
- **No new tokens needed** — the CLAUDE.md rule "DO NOT expand the palette" remains the constraint.

---

## Sources

- [shadcn/ui component list](https://ui.shadcn.com/docs/components) — authoritative component inventory (HIGH confidence: verified via WebFetch)
- [shadcn/ui Drawer docs](https://ui.shadcn.com/docs/components/drawer) — Vaul-based Drawer API (HIGH confidence: verified via WebFetch)
- [shadcn/ui October 2025 changelog](https://ui.shadcn.com/docs/changelog/2025-10-new-components) — Spinner, Kbd, ButtonGroup, InputGroup, Field, Item, Empty added (MEDIUM confidence: search result)
- [Radix UI Primitives](https://www.radix-ui.com/primitives) — authoritative primitive list (HIGH confidence: verified via WebFetch)
- [Storybook docs](https://storybook.js.org/docs/writing-docs/doc-blocks) — documentation patterns reference (MEDIUM confidence)
- [shadcn/ui vs Storybook analysis](https://supernova.io/blog/top-storybook-documentation-examples-and-the-lessons-you-can-learn) — FT migration from Storybook to custom site (MEDIUM confidence: WebSearch)
- SignalframeUX codebase: `ANL-analyst-brief-v4.md`, `v1.3-REQUIREMENTS.md`, `components/sf/index.ts`, `components/blocks/components-explorer.tsx`, `lib/api-docs.ts` — (HIGH confidence: direct source)

---

*Feature research for: SignalframeUX v1.4 Feature Complete milestone*
*Researched: 2026-04-06*
