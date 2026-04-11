# Analyst Brief v2

**Generated:** 2026-04-11
**Interview rounds:** 6
**Dimensions covered:** Integration Points, Error States, Edge Cases, Non-Functional Requirements, User Journeys, User Segments

---

## Preamble

This brief was produced through close reading of all seven v1.7 source documents (five v1.7-prep audit files, plus `asset-replication-report.md` and `cd-sfux-integration-plan.md` from the wiki), cross-referenced against the v1.7 milestone dispatch and the existing test suite (26 Playwright spec files). The v1.0 analyst brief (ANL-v1) covered the system at foundation stage. This brief is scoped exclusively to v1.7 risks: the token bridge, aesthetic effects at `--signal-intensity` boundaries, multi-effect stacking, copy audit test collision, the no-CI regression gap, CSS performance headroom, and Storybook story validity after aesthetic changes.

The audit files are thorough on what exists. The gaps are concentrated in four areas: (1) what the token bridge actually breaks on first import that the audit didn't model, (2) whether stacked effects at intensity 1.0 create a visual coherence problem that `prefers-reduced-motion` compliance alone cannot fix, (3) how Phase 1 copy fixes will break specific existing Playwright assertions silently if tests are not updated atomically with the code changes, and (4) what "manual quality gates" actually means across 13+ phases without a regression anchor.

---

## Round 1 — Integration Points: Token Bridge

**Dimension probed:** What does the CD site actually break on first import of `signalframeux/signalframeux.css`?

**Findings:**

The integration plan describes a ~30-line `cd-tokens.css` override loaded after the SF//UX base CSS. This is structurally sound, but the audit documents do not model what happens in the cascade before the override fires.

`signalframeux.css` sets `--color-primary` to magenta in `:root`. If any CD component renders during SSR before `cd-tokens.css` is parsed (e.g., in a streaming boundary), it will receive magenta as the primary color for that render frame. The override must be inlined or loaded with `blocking` semantics to prevent a flash of wrong color. The integration plan shows a simple import chain in `app/layout.tsx` — which is correct for static CSS, but Next.js App Router can stream RSC chunks before the layout's CSS fully resolves.

SF//UX's light mode token block (`--color-background: oklch(0.97 0 0)` in `:root`, dark overrides in `.dark`) is a second structural problem. CD is dark-only. The integration plan notes "no light mode block needed — CD is dark-only." But SF//UX's `:root` block is light mode. If CD's `<html>` does not have `class="dark"`, every SF//UX component will render in light mode (off-white backgrounds, dark text) until the dark class is applied. If CD's ThemeProvider or `<html>` class initialization is async, there is a flash window. The integration plan does not specify where or how CD enforces `class="dark"` unconditionally.

The token bridge overrides fonts globally (`--font-sans`, `--font-mono`). SF//UX loads Inter, JetBrains Mono, Anton, and Electrolize from Google Fonts and a local file in its `layout.tsx`. When CD imports the SF//UX CSS, the font-face declarations for these four fonts are not imported — only the CSS custom property references. If CD does not separately load Geist (which it already does) and the SF//UX components reference `--font-sans` before `cd-tokens.css` overrides it, the fallback chain `ui-sans-serif, system-ui, sans-serif` will fire briefly. This is a rendering-correctness concern, not a visual crash, but it is observable during hydration.

The component migration map lists `SFSheet` as the riskiest swap: "base-ui render props → Radix asChild. All Sheet consumers must update." This is the only breaking-API swap in Phase 1. The plan's acceptance criterion is "all 61 tests pass" — but CD's existing 61 tests were written against the base-ui Sheet API. They will not test the SFSheet behavior. Tests that previously covered Sheet open/close, focus trap, and mobile nav will pass structurally but may not cover the Radix-specific interaction differences (e.g., `onOpenChange` vs base-ui's `dismiss()` pattern).

---

## Round 2 — Edge Cases: `--signal-intensity` Boundaries

**Dimension probed:** What happens visually at intensity 0, 0.3, and 1.0? Are there conflicts between the SIGNAL layer state and the new aesthetic effects?

**Findings:**

The aesthetic-prototypes audit establishes that `--signal-intensity` is currently defaulted to 0.5 — not 0. The dispatch references "SIGNAL parameters start at 0.3" which the audit correctly identifies as a misunderstanding: the current default is already higher. This creates an unstated question: should the aesthetic push raise the default further (0.6–0.7), or lower it slightly (0.3) to preserve headroom for the escalation effects?

At intensity 0.0: The ProofShader is the most sensitive consumer. Its GLSL uses `smoothstep(0.3, 0.7, intensity)` to blend between geometric lattice and noise. At 0.0, it shows pure lattice. The SignalMesh displacement drops to zero — the wireframe icosahedron shows no breathing. The GLSLHero runs at minimum noise amplitude (`0.5 + 0*0.5 = 0.5` — actually still half-amplitude even at 0). VHSOverlay runs unconditionally (it reads intensity but the audit does not document whether its opacity layers scale with it). The VHS opacity variables (`--sf-vhs-crt-opacity: 0.2`, `--sf-vhs-noise-opacity: 0.015`) are hardcoded tokens, not expressions of `--signal-intensity`. This means VHS effects are active at full opacity even when intensity is 0 — which contradicts the stated system where intensity governs the entire aesthetic register.

At intensity 1.0 with all 8 new effects active simultaneously (grain at 0.12 + VHS at full + halftone + mesh gradient + particles + glitch + circuit + symbol system): The audit documents do not address visual coherence at full-stack intensity. Each effect is specified and benchmarked in isolation. But their combined visual output is not modeled. Specific collision risks:
- Grain (noise texture) composited with halftone (dot-grid texture) creates a moiré interference pattern that neither design intends. This is a visual artifact that will not be caught by per-effect Lighthouse testing.
- Mesh gradient (slow-moving organic color blobs) behind particle fields (dot clusters) creates depth ambiguity — both occupy the background layer with similar visual weight. Without a clear z-index and opacity hierarchy governing their combination, the result may read as mud rather than atmospheric depth.
- Glitch effects (horizontal displacement, color channel separation) combined with VHS aberration (existing chromatic aberration at viewport edges) produce double-aberration: the existing VHS aberration is still running, and the new glitch aberration layers on top. At intensity 1.0, this is likely to exceed the "engineered imperfection" register and enter "visually broken" territory.
- Circuit overlay (low-opacity SVG diagram tiles at 0.02–0.05) behind grain at 0.12 will be entirely occluded. The circuit texture becomes invisible. If this effect is wired to `--signal-intensity`, it is wasted at high intensity values.

The `--signal-intensity` architecture assumes effects scale proportionally with the single property. But different effects have different perceptual thresholds. Grain becomes noise above ~0.12. Chromatic aberration becomes unwearable above ~3px. Halftone transitions from "atmospheric texture" to "pattern foreground" around 30% coverage. A single linear intensity dial cannot govern all these effects coherently across their full range.

---

## Round 3 — Error States: 8 Effects Stacking

**Dimension probed:** What is the combined render cost of all effects active simultaneously, and what are the failure modes at intensity 1.0?

**Findings:**

The asset-replication report specifies per-effect benchmarks: grain < X ms paint, halftone < 2ms, glitch < 300ms. But it does not specify a combined budget. The existing Performance baseline is 78 (production). The milestone constraint is "must not regress further." But there is no stated combined-effect performance ceiling.

The 4 WebGL scenes already running (GLSLHero, GLSLSignal, ProofShader, SignalMesh) use a singleton `WebGLRenderer`. The new particle field effect (effect 5 in priority order) requires a WebGL canvas with 10,000+ point vertices. The infrastructure audit notes the singleton renderer architecture — but adding a new WebGL scene means either (a) adding another scene to the singleton (which increases GPU memory pressure per frame even with IntersectionObserver gating) or (b) creating a second WebGL context (which hits iOS Safari's context limit, documented as a known concern). The particle field's WebGL requirement conflicts with the "zero new npm runtime dependencies, CSS-first effects" constraint. Three.js is already a dependency, so using it is not "new," but the particle field's BufferGeometry implementation will add non-trivial GPU memory.

The idle escalation system (8s → 30s → 60s → 120s) interacts with all 8 new effects in an unspecified way. The current idle system writes CSS classes (`sf-idle-1` through `sf-idle-4`) and tweens `--sf-grain-opacity`. But if grain intensity is already governed by `--signal-intensity` at 1.0 (where grain is at 0.12), the idle Phase 2 escalation trying to tween `--sf-grain-opacity` to 0.08 would actually be reducing grain, not increasing it. The idle escalation assumes the resting grain state is 0.03. After the aesthetic push raises it to 0.08-0.12 as a baseline, the idle escalation phases 2-4 must be recalibrated or they produce the wrong direction of change.

`prefers-reduced-motion` coverage is excellent (11 CSS blocks, global kill-switch, per-component guards). But the 4-phase idle escalation's GSAP tweens (Phase 2 grain tween, Phase 4 VHS glitch timing) need explicit `prefers-reduced-motion` guards at the JavaScript level. The audit notes this requirement but it is not yet implemented — it is a design specification, not a shipped behavior.

---

## Round 4 — User Journeys: Copy Audit Test Collision

**Dimension probed:** Which specific Playwright test assertions will break when Phase 1 copy fixes are applied?

**Findings:**

Two confirmed test collisions identified from source reading:

**Collision 1 — OG image version string (`phase-35-metadata.spec.ts:35-36`)**
```
expect(src).toContain("v1.5");
expect(src).toContain("REDESIGN");
```
Copy audit Hard Flag 2 requires fixing `opengraph-image.tsx:64` from `v1.5 -- REDESIGN` to the current version. When this fix is applied, both assertions fail. The copy fix and test update must be applied atomically — but with no CI/CD, there is no enforcement mechanism. A developer who applies the copy fix and runs a subset of tests (e.g., only visual tests, not metadata tests) will have a green local run with a broken assertion sitting silently in `phase-35-metadata.spec.ts`.

**Collision 2 — Component count anti-regression (`phase-34-visual-language-subpage.spec.ts:225`)**
```
await expect(page.locator("text=340")).toHaveCount(0);
```
This test was written to assert that "340" does not appear in the UI (a previous regression where the 340+ claim appeared on the inventory page). Copy audit Hard Flag 1 reconciles all counts to 54 — which means removing the "340+" string from `manifesto-band.tsx:65` and `init/page.tsx:63`. After that fix, this assertion continues to pass (it's asserting absence), so there is no false failure. However, if any future copy adds "340" for any legitimate reason (e.g., a stat about interactions, or a token count), this assertion will confusingly fire. Its semantics should be updated from "count=0 for any text=340" to a narrower locator scoped to the manifesto or init page component count context.

**Potential collision 3 — OG image COMPONENTS stat (`phase-35-metadata.spec.ts:37`)**
```
expect(src).toContain("COMPONENTS:54");
```
This assertion passes before and after the copy audit (54 is the correct count). But if the copy audit Phase 1 changes the OG image template format while fixing the version string, this assertion may break incidentally. The OG image fix touches `opengraph-image.tsx:64` — the same file as the COMPONENTS stat. Scoped risk, not guaranteed collision, but warrants awareness.

**Systemic gap:** The copy audit documents file:line pairs for every fix, but there is no checklist that cross-references those file:line pairs against test assertions in the test suite. This cross-reference does not exist anywhere in the planning artifacts. For 13 phases of changes with no CI, the manual process for "run all tests after each phase" is the only gate — and "all tests" requires knowing which tests are affected by which changes.

---

## Round 5 — Non-Functional Requirements: Verification Without CI

**Dimension probed:** What does "verify nothing regressed" actually mean across 13+ phases with no CI/CD?

**Findings:**

The infrastructure-baseline audit rates "no CI/CD pipeline" as HIGH severity and explicitly recommends GitHub Actions. But the v1.7 milestone scope does not include standing up CI. The aesthetic push has 13+ phases and a stated acceptance criterion on each (Lighthouse not regressing, story count >= 40, bundle gate, a11y, reduced-motion coverage). All of these are currently verified by running Playwright specs locally.

The local verification process has three documented gaps:

**Gap 1: Test suite execution time vs. phase iteration rate.** The Storybook build test (`phase-40-03-storybook.spec.ts`) executes `pnpm build-storybook` synchronously — which takes minutes. The Lighthouse gate test (`phase-37-lighthouse-gate.spec.ts`) runs Lighthouse 3 times with a 5-minute timeout. For 13 phases of iteration, running the full test suite after each phase is impractical. In practice, developers run the tests that feel relevant. The aesthetic effects are most likely to regress a11y, Lighthouse Performance, and bundle size — but these are the slowest tests to run. The iteration loop will compress: developers will run fast tests (TypeScript, lint, unit) and defer the slow tests (Lighthouse, Storybook build, bundle) to the end of the phase, by which point multi-phase regressions may have compounded.

**Gap 2: No visual baseline.** The infrastructure audit recommends Chromatic for visual regression, but notes it is not installed. The aesthetic push will change the visual output of every page (grain, VHS enhancement, potentially new effects on all routes). Without a snapshot baseline taken before Phase 1, there is no way to diff whether a visual change in Phase 8 (halftone) was caused by the halftone implementation or by an unintentional interaction with Phase 5 (grain). The audit's "benchmark: Lighthouse performance score must not drop >2 points" per effect is measurable, but "visual output matches intent" is not measurable without baselines.

**Gap 3: Localhost vs. production divergence.** The infrastructure audit documents a 3-point Performance gap (81 localhost, 78 production) and a 4-point A11y gap (97 localhost, 100 production — possibly false positives). CSS-first effects will primarily show their performance impact in production (Vercel's compression, CDN caching, edge behavior). A grain overlay that costs 0 Lighthouse points locally could cost 2–3 points in production due to how Vercel handles SVG data URIs and `backdrop-filter`. There is no production performance gate in the test suite — only local Lighthouse via `launch-gate.ts`.

---

## Round 6 — Non-Functional Requirements: Performance Headroom and Storybook Validity

**Dimension probed:** (a) How much CSS-effect budget remains before the 78 Performance baseline degrades? (b) Do the 52 Storybook stories need updating after aesthetic changes?

**Findings on Performance:**

The "CSS-first effects" constraint is the right call for performance. CSS pseudo-elements (grain, scan lines, compression artifacts) have near-zero impact on Lighthouse Performance — they are compositor-thread operations that don't block main thread. `backdrop-filter` on the VHS overlay is the exception: it forces a compositing layer and can produce layout recalculation at paint time. The current VHS overlay uses `filter: blur(0.8px) brightness(1.08) contrast(1.04)` on the wrapper — which is already a compositing layer cost. Enhancements (chromatic aberration via additional gradient layers) will not significantly increase this.

The particle field (effect 5) is the risk. Its Three.js BufferGeometry at 10,000 particles requires a GPU render call every frame. The existing 4 WebGL scenes are gated by IntersectionObserver — they stop rendering when offscreen. If the particle field is used as a page-wide background effect (not a scrollable section), it renders every frame without gating. At 60fps on a base M1, this is fine. On a 2019 MacBook or integrated GPU Windows machine, this will produce frame drops that Lighthouse Performance may not catch (Lighthouse measures on a simulated Moto G4) but that users will see.

The halftone SVG filter technique (`feTurbulence` + `feComponentTransfer`) is CPU-composited in most browsers — it does not hardware accelerate. At 2ms paint time target per the report, this is within budget on modern hardware. On older hardware, it may produce visible paint jank during scroll.

**Findings on Storybook:**

The Storybook test (`phase-40-03-storybook.spec.ts`) validates: config files exist, SIGNALFRAME//UX branding in manager, build succeeds, story count >= 40. It does not validate that stories render correctly, that controls work, or that the visual output matches any baseline.

52 existing stories are for SF components (`SFButton`, `SFCard`, etc.). The aesthetic push adds 8 new effects as components (`GrainOverlay`, `VHSOverlay` enhanced, `HalftoneTexture`, `MeshGradient`, `ParticleField`, `GlitchTransition`, `CircuitOverlay`, `CDSymbol`). The asset-replication report specifies "add a Storybook story with controls" for each effect. This means 8 new story files — which is compatible with the >= 40 gate (which will be >= 60 after the additions). But the 52 existing stories import `globals.css` via `.storybook/preview.ts`. When grain opacity is raised from 0.03 to 0.12 globally, all 52 existing stories will render with noticeably more grain — changing their visual appearance without any of their story code changing. A developer reviewing stories during the tightening phase will see this change and may not know whether it is intentional. Without Chromatic baselines, there is no way to attribute the change to the grain token adjustment.

Additionally, the copy audit changes affect component stories: if `SFButton`'s stories render text like "SHIP FASTER" or reference the version number as a default arg, those stories will have stale content. The copy audit does not cross-reference Storybook stories against the strings being changed — it only cross-references page files. This is a coverage gap.

---

## Unstated Requirements

- [REQ] The `signalframeux.css` → `cd-tokens.css` import chain must be validated for SSR flash: specifically, whether any CD RSC renders before the override CSS resolves and receives magenta from the SF//UX `:root` block. Either inline critical overrides or document the acceptable flash window. — Why it matters: a magenta flash on CD's homepage during first load is a client-visible regression on the production front door.
- [REQ] CD must enforce `class="dark"` on `<html>` synchronously (blocking script or server-rendered attribute), not via a client-side ThemeProvider, before SF//UX components render. The current CD ThemeProvider behavior is undocumented relative to this requirement. — Why it matters: SF//UX's `:root` is light mode; without dark class, CD renders white.
- [REQ] A combined-effect visual coherence test must be specified at full intensity (grain 0.12 + VHS + halftone + at least one more effect simultaneously). This is not a Lighthouse test — it is a human visual review of the stacked output. — Why it matters: each effect is benchmarked in isolation; moiré between grain and halftone and double-aberration between VHS and glitch are not detectable by automated tests.
- [REQ] `--signal-intensity` must be audited to confirm it governs VHSOverlay opacity layers, not just the shader uniforms. Currently `--sf-vhs-crt-opacity` and `--sf-vhs-noise-opacity` are hardcoded tokens (not expressions of `--signal-intensity`). If the dial controls "the entire aesthetic register," VHS must scale with it. — Why it matters: intensity 0 should mean "near clean" but VHS scan lines at 0.2 opacity run regardless.
- [REQ] The idle escalation phase thresholds (8s, 30s, 60s, 120s) must be recalibrated against the new baseline grain opacity after the aesthetic push. The Phase 2 grain escalation (tween to 0.08) would be a reduction if baseline is set to 0.12. — Why it matters: the escalation system produces the wrong direction of change if baseline assumptions are stale.
- [REQ] Every copy audit change in Phase 1 must be accompanied by a test-file update in the same commit. A checklist mapping `file:line` copy changes to affected `tests/*.spec.ts` assertions must exist before Phase 1 execution begins. — Why it matters: `phase-35-metadata.spec.ts:35-36` will break silently with no CI to catch it.
- [REQ] The 8 new effect Storybook stories must be committed and passing the `>= 40 story files` gate before the aesthetic phase is marked complete — but the gate should be updated to `>= 52` (current count) to prevent story deletions from passing silently. — Why it matters: the story count gate is a floor, not a preservation check.
- [REQ] A pre-Phase-5 visual baseline capture must be taken (Chromatic or Playwright screenshots) before grain overlay is added, so that subsequent effect phases have a diff anchor. Without this, "visual regression" has no meaning in the manual gate process. — Why it matters: 13 phases of visual change with no baseline means "regression" is only detectable by memory, not by tooling.

---

## Assumption Risks

- [RISK] "CSS-first effects have near-zero performance impact" — True for compositor-thread effects (grain, scan lines). False for `backdrop-filter` extensions on VHS and potentially false for SVG `feTurbulence` halftone on CPU-composited paths. The 78 baseline leaves ~2-point headroom if the target is 76+ (no stated floor below 78). Three effects with non-trivial paint cost could consume this headroom. — Potential impact: Lighthouse Performance regression in production that was not caught in local testing.
- [RISK] "Playwright tests passing locally = quality gate passed" — With no CI, the manual gate process depends on a developer running all 26 spec files after each of 13 phases. In practice, developers run fast subsets. The slow gates (Lighthouse, Storybook build, bundle) will accumulate unrun phases. — Potential impact: multi-phase performance regressions discovered at Phase 13 that require unwinding multiple implementations.
- [RISK] "All 8 effects wire to `--signal-intensity` uniformly" — The existing VHS overlay's opacity layers do not scale with `--signal-intensity` (they are hardcoded tokens). New effects may be built to scale with it. This creates an inconsistency: turning intensity down suppresses new effects but not VHS. — Potential impact: intensity 0 is not the "clean" state the system implies; it is "no new effects, but VHS still running at 20% scan line opacity."
- [RISK] "The CD token bridge is invisible until components are swapped" — The integration plan acceptance criterion for Phase 0 is "existing 61 tests pass, no visual change." But this assumes no SSR flash, no ThemeProvider race, and no font-fallback window. If any of these produce a visible difference, Phase 0 acceptance fails for reasons unrelated to token correctness. — Potential impact: Phase 0 is blocked by SSR/hydration mechanics that were not in scope when the acceptance criterion was written.
- [RISK] "SFSheet's Radix asChild migration is testable by CD's existing 61 tests" — CD's tests were written against the base-ui Sheet API. Radix's behavioral differences (portal destination, focus trap algorithm, scroll lock behavior) may not be covered by existing assertions. Tests pass; behavior regresses. — Potential impact: mobile nav (Sheet-based) breaks in a way that 61 passing tests don't reveal.
- [RISK] "The 52 Storybook stories don't need updating after aesthetic changes" — When grain baseline is raised from 0.03 to 0.12, all 52 stories render with significantly more visible grain. Without a visual baseline, this reads as "no change" (all stories still compile and render). A developer using Storybook for component review during tightening will see the changed grain and may not know if it is intentional. — Potential impact: intended aesthetic changes are indistinguishable from unintended regressions in the manual review process.
- [RISK] "Per-effect Lighthouse benchmarks sum to an acceptable total" — Each effect targets < 2-point Lighthouse drop. If 5 of 8 effects each cost 1 point, cumulative cost is 5 points against a 78 baseline, yielding 73. The milestone constraint says "not regress further" but does not define "further" as an absolute floor. — Potential impact: cumulative drift is invisible in per-phase benchmarking.

---

## Edge Cases

- [EDGE] CD `<html>` without `class="dark"` before SF//UX CSS resolves — all SF//UX components render in light mode (white backgrounds, dark text) for the hydration window. Expected behavior recommendation: CD must server-render `class="dark"` on `<html>` unconditionally, verified by a test that checks the rendered HTML attribute before JavaScript executes.
- [EDGE] SF//UX `--signal-intensity` at 0.0 with VHS overlay active — scan lines run at 0.2 opacity while all other SIGNAL effects are suppressed. The "intensity 0 = clean state" assumption is violated. Expected recommendation: VHS opacity tokens should be CSS `calc()` expressions referencing `--signal-intensity`, not hardcoded values.
- [EDGE] Grain at 0.12 (`mix-blend-mode: multiply`) on a light mode section (bgShift scroll effect produces white sections on SF//UX showcase) — `multiply` blend mode on white produces no grain effect (white × grain = white). The grain is invisible on light sections. If the aesthetic push relies on grain as a unifying substrate texture, light mode sections will appear inconsistently "clean" at the same intensity setting. `overlay` blend mode works on both light and dark. Expected recommendation: audit grain blend mode against bgShift sections before setting 0.12 as baseline.
- [EDGE] Particle field (effect 5) active during `prefers-reduced-motion` — the Three.js animation loop must be fully stopped, not just slowed. A common implementation error is reducing particle speed to near-zero rather than stopping the rAF loop. The existing WebGL shader scenes have explicit reduced-motion guards; the particle field spec does not yet document its reduced-motion behavior. Expected recommendation: spec reduced-motion behavior (static particle positions, no animation loop) before implementation begins.
- [EDGE] Halftone `feTurbulence` SVG filter at low GPU capability (integrated graphics, older MacBook) — feTurbulence is CPU-composited in many browser implementations. At full-page coverage, this may produce visible scroll jank on hardware below the development machine's capability. The benchmark target (< 2ms paint time) should specify the minimum hardware target, not assume M1. Expected recommendation: test on a 2019 Intel MacBook Pro or equivalent before committing the halftone effect.
- [EDGE] Copy audit changes applied to `manifesto-band.tsx` and `init/page.tsx` — the Playwright test `phase-34-visual-language-subpage.spec.ts:225` asserts `text=340` has count 0. After removing "340+" from both files, this assertion continues to pass. But if any other future content contains "340" (a stat, a count, a year), this assertion will fire confusingly. Expected recommendation: tighten the locator to `page.locator("[data-section='manifesto'] >> text=340")` or equivalent scoped selector.
- [EDGE] Idle escalation Phase 4 (120s scan line displacement) triggering during the user's first meaningful interaction with the component explorer — if a user lands on `/inventory` and spends 2+ minutes browsing without mouse movement (reading, not clicking), Phase 4 effects will fire. These effects (VHS glitch-level intensity) are designed for extended idle, but "extended browsing without mouse movement" is not idle in the user-intent sense. Expected recommendation: reset idle timer on `mouseover` in addition to `mousemove` to prevent escalation during deliberate reading sessions.
- [EDGE] `signalframeux.css` imported in CD alongside Tailwind v4 — SF//UX uses Tailwind v4 `@theme` blocks. If CD also uses Tailwind v4 and processes `signalframeux.css` through PostCSS, the `@theme` tokens in SF//UX's CSS will be re-processed by CD's Tailwind instance, potentially producing duplicate or conflicting token registrations. The integration plan imports `signalframeux.css` from `dist/` (a pre-built file), not source — which avoids PostCSS reprocessing. This is correct, but must be explicitly enforced: CD must import from `signalframeux/signalframeux.css` (the dist artifact), never from source. Expected recommendation: document this constraint in CD's `app/layout.tsx` import comment.
- [EDGE] Storybook stories rendering effects components (`GrainOverlay`, `VHSOverlay`) in Storybook's canvas — Storybook's canvas uses a different viewport than the site. Fixed-position elements (`position: fixed; inset: 0`) used by VHSOverlay will render relative to the Storybook canvas, not the browser viewport. This means VHS scan lines will appear to clip at story canvas boundaries rather than covering the full screen. This is cosmetically misleading in Storybook — the story renders incorrectly relative to how the effect looks in production. Expected recommendation: effects stories should use a decorator that wraps the canvas in a fixed-height container with `position: relative; overflow: hidden` to demonstrate the effect within a bounded context.

---

## User Segment Analysis

- [USER] CD site visitors (first real consumers of SF//UX as platform) — These users have never interacted with SF//UX components. They will see Geist fonts, achromatic palette, no GSAP effects (CD Phase 3 is optional). Their experience of SF//UX is filtered entirely through the token bridge and CD's custom components. If the token bridge produces flash, they see it as a CD bug, not a SF//UX bug. CD as first consumer is also SF//UX's first reputational test as a platform layer.
- [USER] SF//UX showcase visitors during aesthetic push phases — These users visit between phases, when some effects are live and others are not yet implemented. A user visiting after Phase 5 (grain) but before Phase 6 (VHS enhancement) sees partial aesthetic intent. The site is a live product during its own upgrade. There is no staged rollout, no feature flags, no draft mode — changes go live on Vercel immediately. The milestone does not address whether partial aesthetic state is acceptable to show.
- [USER] Developer reviewing Storybook during tightening — This is likely the developer themselves, using Storybook as a component review tool during the tightening workstream. After grain baseline is raised, every story looks different. Without Chromatic, the developer must hold the mental model of "this change was intentional" across 52 stories and 8+ new ones over 13 phases. This is the audience most at risk from the no-visual-baseline gap.

---

## Priority Assessment

| Priority | Item | Rationale |
|----------|------|-----------|
| P0 | Validate CD ThemeProvider enforces `class="dark"` synchronously before any SF//UX components render | If this is not the case, Phase 0 token bridge acceptance criterion will fail visually and the integration is blocked before it begins. |
| P0 | Update `phase-35-metadata.spec.ts:35-36` atomically with the OG image copy fix | These two assertions (`v1.5` and `REDESIGN`) will break the moment `opengraph-image.tsx:64` is fixed. No CI means this failure is silent until someone runs the metadata spec explicitly. |
| P0 | Audit whether `--sf-vhs-crt-opacity` and `--sf-vhs-noise-opacity` scale with `--signal-intensity` | If VHS does not scale with intensity, the "single dial governs the entire aesthetic register" architecture is incomplete. This must be verified before building 8 new effects that assume the architecture is coherent. |
| P0 | Recalibrate idle escalation phase thresholds against the new grain baseline before implementation | Phase 2 idle escalation tweens grain to 0.08. If baseline is 0.12, the tween reduces grain instead of intensifying it. This is a behavioral inversion that produces the opposite of the intended effect. |
| P1 | Take a visual baseline (Playwright screenshots or Chromatic) before Phase 5 (grain overlay) | Without a pre-aesthetic baseline, "visual regression" is undetectable across 13 phases. Minimum viable: screenshot all 5 routes before any aesthetic change, store in `.planning/` or a separate branch. |
| P1 | Specify a combined-effect coherence review point between Phase 6 (VHS) and Phase 7 (halftone) | After grain + VHS are live, stack them intentionally and evaluate moiré risk before adding halftone. This review is not a Lighthouse test — it is a deliberate human visual QA pass at intensity 1.0. |
| P1 | Document CD sheet migration test coverage gap explicitly | Add a CD-specific test for Radix Sheet behavior (portal destination, focus trap, mobile nav open/close) before marking Phase 1 complete. CD's 61 existing tests do not cover Radix behavioral differences. |
| P1 | Confirm particle field reduced-motion behavior is specified before implementation | The spec says "prefers-reduced-motion must be respected" but does not define what "respected" means for a Three.js particle animation (stop loop vs slow to 0.01x vs static). Specify before building. |
| P2 | Audit grain blend mode against bgShift light-section backgrounds | `multiply` blend mode is invisible on white. If grain is a unifying substrate texture, it must work on both dark and light sections. Switch to `overlay` if bgShift sections are in scope for grain coverage. |
| P2 | Update Storybook story count gate from `>= 40` to `>= 52` | The current gate allows deletion of 12 existing stories without failing. After 8 new effect stories are added, the gate should be `>= 60` to prevent silent story loss. |
| P2 | Add `mouseover` to idle timer reset events | Users browsing `/inventory` deliberately for 2+ minutes without mouse movement trigger Phase 4 glitch effects. This is not the intended idle audience. |
| P2 | Document the CD `dist/` import constraint in `app/layout.tsx` | Importing SF//UX CSS from source (not dist) would reprocess `@theme` blocks through CD's Tailwind instance, producing token conflicts. A code comment prevents this mistake from future contributors. |
