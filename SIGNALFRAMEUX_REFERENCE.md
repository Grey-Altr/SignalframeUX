# SIGNALFRAMEUX — REFERENCE COMPANION

> Complementary reference for CLAUDE.md. Contains expanded context, original design brief,
> merged concepts from PROMPT_FINAL.md, research references, and detailed specifications
> that don't need to load every session but inform stabilization work.

---

## Original Addendum (v0.1 Stabilization Brief)

### Role Definition (expanded)
You are a senior design systems architect, frontend systems engineer, interaction designer,
visual QA director, and product design engineer working on SignalframeUX for Culture Division.

### Core Principles
1. Enhance, don't replace
2. Stability over expansion
3. Usability over completeness
4. Consistency over novelty
5. System > components
6. Speed of implementation matters
7. Every change must reduce friction

### Visual Character (expanded)
- Sharp, controlled, structured
- Slightly tense — not relaxed or playful
- Sophisticated but not sterile
- No skeuomorphism, no fake depth, no excessive shadows, no decorative gradients
- Depth achieved through: spacing, hierarchy, layout, contrast, motion

### Success Criteria
SignalframeUX v0.1 is complete when it is fast and easy to build a real page without friction.
NOT when it is complete, expressive, or impressive.
If the system grows in complexity → you are doing it wrong.

---

## Merged from PROMPT_FINAL.md (archived concepts)

### API Architecture Vision (not yet implemented)
The system aspires to function as a programmable API:
- `@signalframeux/core` — initialization via `createSignalframeUX(config)`
- `useSignalframe()` hook returning: tokens, theme controller, motion controller, field controller
- Field API: setSeed, setDensity, enable/disable
- Motion API: enable/disable, setSpeed
- Theme API: set(theme), extend(theme)
- Headless mode: usable without UI components
- React layer: `@signalframeux/react` for components and hooks

### Design Token Categories (original spec)
**Signal Tokens:** typography, spacing, semantic colors, borders, radii
**Frame Tokens:** seed, density, motionSpeed, noise

### Component Signal/Frame Props (original spec)
Every component was designed to support:
- `signalProps` — deterministic interface configuration
- `fieldProps` — generative expression configuration

### Background System (original spec)
Types: StaticField, AnimatedField, InteractiveField
Rules: page + section usage, adaptive contrast

### Page Continuity (original spec)
- Persistent Field layer across navigation
- GSAP transitions between pages
- No abrupt visual resets

### Hero System (original spec)
- Hero.Container, Hero.Content, Hero.Field
- Full-bleed generative background
- GSAP reveal sequences
- Always readable content over generative layer

### Phased Execution Plan (original)
1. Tokens → 2. Primitives → 3. Components → 4. Motion → 5. Field → 6. Integration → 7. Apps → 8. Docs

---

## Tech Stack Detail (expanded from CLAUDE.md)

### Dependencies
- `next@15.3.0` (App Router, Turbopack)
- `react@19.1.0`, `react-dom@19.1.0`
- `typescript@5.8.3`
- `tailwindcss@4.1.4`, `@tailwindcss/postcss@4.1.4`
- `radix-ui@1.4.3` (Radix UI primitives)
- `shadcn@4.1.2` (CLI for installing components)
- `class-variance-authority@0.7.1` (CVA)
- `clsx@2.1.1`, `tailwind-merge@3.0.2`
- `gsap@3.12.7`, `@gsap/react@2.1.2`
- `lenis@1.1.20` (smooth scrolling)
- `lucide-react@0.488.0` (icons)
- `cmdk@1.1.1` (command palette)

### Scripts
- `dev` → `next dev --turbopack`
- `build` → `next build`
- `lint` → `next lint`

### Middleware
CSP with nonce injection per request. `script-src 'unsafe-eval'` required for GSAP plugins.
`style-src 'unsafe-inline'` required for Next.js font/CSS loading.

---

## File Organization (expanded)

```
app/
├── page.tsx              → / (homepage: hero, manifesto, dual-layer, stats, marquee, code, grid)
├── components/page.tsx   → /components (component library showcase)
├── tokens/page.tsx       → /tokens (design token explorer)
├── start/page.tsx        → /start (getting started guide)
├── reference/page.tsx    → /reference (API reference docs)
├── layout.tsx            → Root layout (fonts, providers, theme script)
├── globals.css           → Global styles + ALL token definitions
├── error.tsx             → Error boundary
├── global-error.tsx      → Global error handler
├── not-found.tsx         → 404 page
└── loading.tsx           → Loading fallback

components/
├── ui/                   → 26 base shadcn/Radix components
├── sf/                   → 25+ SF-wrapped components + index.ts barrel
├── blocks/               → Page sections (Hero, ManifestoBand, DualLayer, StatsBand, etc.)
├── animation/            → GSAP components (scroll-reveal, vhs-overlay, hero-mesh, etc.)
└── layout/               → Nav, footer, command-palette, dark-mode-toggle, etc.

lib/
├── utils.ts              → cn() utility
├── theme.ts              → Dark mode toggle (hard-cut, localStorage)
├── api-docs.ts           → Component documentation data (100+ components)
├── gsap-core.ts          → Core GSAP setup
├── gsap-plugins.ts       → Plugin registration (FLIP, ScrollTrigger)
├── gsap-split.ts         → Text splitting for animations
├── gsap-draw.ts          → SVG stroke animations
├── gsap-easings.ts       → Custom easing functions
├── gsap-flip.ts          → FLIP layout animations
├── color-stutter.ts      → Color cycle animations
└── grain.ts              → Grain texture overlay
```

---

## Token System Detail

### Color Tokens (full OKLCH values)
**Core:**
- Primary magenta: `oklch(0.65 0.3 350)` / fg: `oklch(0.985 0 0)`
- Secondary: `oklch(0.970 0.005 298)` (neutral-cool)
- Background/foreground: dark mode defaults

**Extended:**
- Success (SF green): `oklch(0.85 0.25 145)`
- Warning (SF yellow): `oklch(0.91 0.18 98)`
- Muted, card, popover, destructive: see globals.css

### Typography Scale (full)
Minor third ratio (1.2):
- `--text-2xs`: 9px
- `--text-xs`: 11px
- `--text-sm`: 13px
- `--text-base`: 16px
- `--text-lg`: 19px
- `--text-xl`: 23px
- `--text-2xl`: 28px
- `--text-3xl`: 33px
- `--text-4xl`: 80px (display)

### Semantic Typography Aliases (to be implemented)
| Alias | Maps to | Font | Weight |
|-------|---------|------|--------|
| `--text-heading-1` | `--text-3xl` | Anton | display |
| `--text-heading-2` | `--text-2xl` | Inter | bold |
| `--text-heading-3` | `--text-xl` | Inter | semibold |
| `--text-body` | `--text-base` | Inter | regular |
| `--text-small` | `--text-sm` | Inter | regular |

### VHS/Aesthetic Tokens
- `--vhs-crt-opacity`, `--vhs-noise-opacity` — CRT scanline effects
- `--sf-grain-opacity`, `--sf-inset-shadow`, `--sf-deboss-*` — Tactile feedback
- `--press-scale`, `--hover-y`, `--press-y` — Interaction feedback

### Z-Index Scale
`--z-skip` (900) → `--z-vhs` (99999)

### Border Widths
Element: 2px · Divider: 3px · Section: 4px

---

## Naming Conventions

**Components:** UI = lowercase kebab file names. SF = PascalCase with SF prefix. Blocks = PascalCase semantic.
**CSS classes:** `.sf-*` for SignalframeUX utilities. `.dark` for dark mode root.
**CSS custom properties:** `--color-*`, `--font-*`, `--text-*`, `--duration-*`, `--ease-*`, `--sf-*`, `--z-*`, `--border-*`
**Data attributes:** `data-section`, `data-section-label`, `data-bg-shift`, `data-anim`, `data-slot`, `data-variant`, `data-size`, `data-icon`

---

## Design Research References

### Detroit Underground (DU)
- https://detund.bandcamp.com/
- https://detroitunderground.net/
- https://neubauberlin.com/project/detroit-underground-records/
- https://www.behance.net/gallery/28934127/Detroit-Underground-Records-R08R10-(2008-10)

### The Designers Republic (TDR)
- https://en.wikipedia.org/wiki/The_Designers_Republic
- https://en.wikipedia.org/wiki/Ian_Anderson_(designer)
- https://warp.net/

### Supporting Context
- https://ra.co/ (Resident Advisor)
- International Typographic Style
- Japanese graphic design traditions

---

## Future Compatibility Notes

- **cdOS** — internal Culture Division tool (details TBD)
- **CD-Operator** — studio role within Culture Division (details TBD)
- System must remain extensible without breaking existing implementations

---

## CRT Critique History

Trajectory: v3 (66/100) → v8 (89/100) → v12 (93/100 A-)
24 findings resolved through v8. 11 additional resolved v11-v12.
Current baseline: 93/100. Target: >= 90/100 maintained.

---

## Git History Context

46 total commits. All to main branch. Prefixes: Feat: / Fix: / Chore:
Key milestones: Awwwards UI pattern implementation (12 components), CRT critique cycles, hero tuning, Lighthouse optimization.
