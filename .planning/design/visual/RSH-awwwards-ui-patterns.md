# RSH-awwwards-ui-patterns.md
## Awwwards & UI Pattern Research for SignalframeUX
**Date:** 2026-03-31
**Sources:** Awwwards SOTD/brutalist/animation/design-system collections, Codrops Creative Hub, Figma 2026 trends, Coalition Technologies 2026 analysis, Tubik 2026 UI trends, LambdaTest 2026 patterns, Linear/Resend/Raycast dev tool homepages
**Purpose:** Catalog award-winning UI patterns and map integration paths for SFUX's DU/TDR brutalist design language

---

## 1. Award-Winning UI Patterns Catalog

### 1.1 Scroll-Linked Text Reveal
- **Where seen:** Oaksun Studio (Awwwards element), Cluebinders (Awwwards element), multiple SOTD winners (The Lookback, OceanX 2025)
- **How it works:** Text opacity/position is tied to ScrollTrigger progress. Characters or words transition from transparent/offset to fully visible as the user scrolls. Typically uses GSAP SplitText to split into chars, then staggers their `y` and `opacity` based on scroll position.
- **SFUX integration:** Use on the homepage manifesto section. Anton display type at 96px+ reveals word-by-word as the viewport scrolls through the "What is SignalframeUX" statement. Pair with Electrolize body text that fades in after the headline completes.
- **Priority:** HIGH

### 1.2 Sticky Grid Scroll
- **Where seen:** Codrops (March 2026 tutorial by Theo Plawinski), Shopify Renaissance Edition (SOTM Feb 2026)
- **How it works:** A grid of items pins to the viewport while content scrolls through. Individual grid cells animate in sequence (scale, opacity, position) driven by scroll progress. Uses CSS `position: sticky` combined with GSAP ScrollTrigger scrubbing.
- **SFUX integration:** Components page showcase. Pin a 3x3 bento grid of component cards; as the user scrolls, each cell populates with a live component preview one by one, building the full grid composition.
- **Priority:** HIGH

### 1.3 Fluid X-Ray Reveal (Hover)
- **Where seen:** Codrops Creative Hub (March 2026), "Skeleton Fluid Reveal" demo
- **How it works:** Dual Three.js scenes layered on top of each other. Mouse position drives a fluid-dynamics shader that reveals the second scene beneath the first, creating an X-ray effect following cursor movement.
- **SFUX integration:** Simplified 2D version for the API reference page. Hovering over code blocks could reveal the underlying token values or annotated syntax through a CSS `clip-path` that follows the cursor, using magenta (#FF0090) as the reveal layer color.
- **Priority:** MEDIUM (WebGL version is heavy; CSS clip-path version is achievable)

### 1.4 ScrambleText Entry Animation
- **Where seen:** Multiple Awwwards SOTD winners (Darknode, Shift 5, AVA SRG), Linear homepage
- **How it works:** Text characters scramble through random glyphs before resolving to the final string. GSAP ScrambleTextPlugin handles the randomization with configurable character sets and reveal timing.
- **SFUX integration:** Already in SFUX mockups. Extend to all page headings on route entry. Use monospace chars (`01!<>-_\/[]{}`) for the scramble set to reinforce the industrial/terminal aesthetic. Scramble duration: 0.8s with 0.02s per character.
- **Priority:** HIGH (already partially implemented)

### 1.5 DrawSVG Logo Reveal
- **Where seen:** Corentin Bernadou Portfolio (SOTD Mar 25), Nicola Romei (SOTD Feb 8), portfolio sites using SVG stroke animation
- **How it works:** SVG paths animate their `stroke-dashoffset` from fully hidden to fully drawn, revealing the logo/icon stroke by stroke. GSAP DrawSVGPlugin automates the math.
- **SFUX integration:** Site loading state. The SFUX logo draws itself on initial page load, then fills with solid black. Transition from drawn outline to filled shape takes 1.2s. Also usable for section divider icons on scroll entry.
- **Priority:** HIGH (already have DrawSVG plugin)

### 1.6 Magnetic Cursor
- **Where seen:** Fluid Glass (SOTD Mar 30 by Exo Ape), Good Fella (SOTD Mar 18), Foudre Human Social Club (SOTD Mar 15), brutalist collection sites
- **How it works:** Interactive elements detect cursor proximity and "pull" toward the mouse within a defined radius (typically 50-100px). Uses pointer position to calculate offset and applies transform with spring easing. Often combined with a custom cursor dot/ring.
- **SFUX integration:** Apply to navigation items and CTA buttons only. When cursor enters a 60px proximity zone, the element translates toward the cursor with `ease: 'power2.out'`. Keep the displacement subtle (max 8px) to match the industrial precision of the DU aesthetic. Custom cursor: small magenta crosshair replacing default.
- **Priority:** MEDIUM

### 1.7 Parallax List Hover with Image Preview
- **Where seen:** Awwwards GSAP ScrollTrigger tutorial (YouTube, "Awwwards-Level List Reveal Animation"), Codrops "Grid Item Reveal Animation on Hover"
- **How it works:** A vertical list of text items. On hover, an image preview slides in from the side (or fades behind the text) with parallax offset. The image follows vertical cursor position within the list item bounds.
- **SFUX integration:** Use on a "Featured Components" or "Changelog" list. Hovering over list items reveals a preview screenshot of the component/feature. Image enters from right with `x: 20, opacity: 0` to `x: 0, opacity: 1`. Border: 1px solid #000, no radius.
- **Priority:** HIGH

### 1.8 Horizontal Scroll Section
- **Where seen:** Locomotive (Aupale Vodka SOTD Mar 17, Dulcedo SOTD Feb 24), Unseen Studio (SOTD Mar 24), multiple Awwwards scrolling collection winners
- **How it works:** A section that converts vertical scroll into horizontal translation. Container is `position: sticky` with `overflow: hidden`; inner content translates on x-axis mapped to scroll progress via ScrollTrigger.
- **SFUX integration:** Token showcase section. Horizontal scroll through color/typography/spacing token panels, each full-viewport width. Black divider lines between panels. Monospace labels pin to top of viewport during scroll.
- **Priority:** MEDIUM

### 1.9 Scroll-Driven Color/Background Transitions
- **Where seen:** "Color Change Scroll" in Awwwards brutalist collection, ON Energy (SOTD Mar 9), Springs (SOTD Mar 8)
- **How it works:** Background color transitions between sections as the user scrolls. Uses ScrollTrigger to interpolate between color values at section boundaries. Can be CSS `scroll-driven animations` (2026 native) or GSAP.
- **SFUX integration:** Homepage section transitions. White (#FFF) > Black (#000) > White (#FFF) > Magenta (#FF0090) as the user scrolls through hero > features > components > CTA sections. Sharp transitions (no gradual blend) to match the flat brutalist language.
- **Priority:** MEDIUM

### 1.10 Text Masking / Clipping
- **Where seen:** Awwwards brutalist collection ("Typography-Based Layout"), Codrops typography tag (101 posts), TDR-inspired sites
- **How it works:** Large display text uses `background-clip: text` or SVG `<clipPath>` to mask imagery, video, or animated patterns through letterforms. The text becomes a window into the content behind it.
- **SFUX integration:** Hero heading "SIGNALFRAME" on the homepage. Clip a subtle halftone dot pattern or circuit-board texture through the Anton letterforms. On scroll, the masked content shifts slightly (parallax offset) while the text stays fixed.
- **Priority:** HIGH

### 1.11 Code Block Live Animation
- **Where seen:** Resend homepage (live HTTP 200 responses flowing), Linear homepage (live code diffs with syntax highlighting)
- **How it works:** Code blocks are not static screenshots but animated sequences showing real output. Lines appear with typing animation, responses populate with staggered timing, syntax highlighting pulses on key tokens.
- **SFUX integration:** API reference page and Getting Started page. Show a code example that "types" itself, then a response block that populates below with staggered `opacity` and `y` animation per line. Use SFUX's inset-shadow code block styling with Electrolize monospace.
- **Priority:** HIGH

### 1.12 Bento Grid Dashboard Layout
- **Where seen:** Raycast homepage (feature grid), Linear homepage (product feature cards), multiple Awwwards SOTD winners, 2026 trend articles (Figma, Coalition Technologies)
- **How it works:** Asymmetric grid of varying-size cards, each containing a focused feature demo, screenshot, or interactive element. Cards use `grid-template-areas` for named placement. Often animated on scroll entry with staggered reveals.
- **SFUX integration:** Components overview page. 4-column bento grid with cards spanning 1x1, 2x1, and 2x2. Each card shows a live component preview (button, input, badge, etc.) with the component name in Electrolize uppercase and a magenta (#FF0090) number index. No border-radius, 1px black borders.
- **Priority:** HIGH

### 1.13 Command Palette / Search Pattern
- **Where seen:** Raycast (entire product concept), Linear (Cmd+K), Resend documentation
- **How it works:** `Cmd+K` opens a floating command palette with search input, filtered results, and keyboard navigation. Uses `<dialog>` or portal overlay with `backdrop-filter: blur()`. Results update on keystroke with debounced search.
- **SFUX integration:** Site-wide component/token search. `Cmd+K` opens a brutalist command palette: black background, white monospace text, magenta cursor/selection highlight, 0px border-radius, 1px white border. Search filters: Components, Tokens, Pages, API.
- **Priority:** MEDIUM

### 1.14 WebGPU Text Dissolution
- **Where seen:** Codrops (Jan 2026, "WebGPU Gommage Effect: Dissolving MSDF Text into Dust and Petals with Three.js & TSL")
- **How it works:** MSDF-rendered text dissolves into particle systems (dust, petals, fragments) using WebGPU compute shaders via Three.js TSL (Three Shader Language). Characters break apart along signed-distance-field edges.
- **SFUX integration:** Page transition effect. When navigating between routes, the current page heading dissolves into particles that scatter, then the new heading assembles from particles. Simplified version: CSS `mask-image` with animated gradient creating a dissolve wipe.
- **Priority:** LOW (WebGPU requires fallback; CSS version is more practical)

### 1.15 Atmospheric Depth Gallery
- **Where seen:** Codrops Creative Hub Featured Pick (March 2026, "Atmospheric Depth Gallery")
- **How it works:** Image gallery with depth-of-field simulation. Images at different z-depths blur and scale based on scroll position, creating a parallax depth effect without 3D rendering.
- **SFUX integration:** Could be adapted for a showcase/portfolio section showing SFUX in use. Multiple screenshots at different depths with the focused one sharp and others progressively blurred. Reinforces the industrial/technical precision theme.
- **Priority:** LOW

### 1.16 Scroll Progress Indicator
- **Where seen:** Multiple Awwwards SOTD winners, Resend documentation, common in dev tool sites
- **How it works:** A thin horizontal bar at the top of the viewport that fills based on scroll position. Some implementations use a vertical bar or dot indicator.
- **SFUX integration:** Thin 2px magenta (#FF0090) bar across the full viewport width, positioned fixed at the top. Driven by `scrollY / (documentHeight - viewportHeight)`. On the API/docs pages, pair with a section indicator showing the current heading in Electrolize monospace.
- **Priority:** MEDIUM

### 1.17 Staggered Card Entry Animation
- **Where seen:** Virtually every Awwwards SOTD winner in 2026, Shopify Renaissance Edition, Farm Minerals, Studio Dialect
- **How it works:** Cards or grid items animate into view with staggered timing on scroll entry. Each card enters from below (`y: 40`) with fade (`opacity: 0 > 1`), staggered by 0.08-0.12s per item. Uses ScrollTrigger `batch()` for performance.
- **SFUX integration:** All grid/card layouts across the site. ScrollTrigger batch with `stagger: 0.1`, `from: 'start'`, `y: 30`, `opacity: 0`. Add a subtle `scaleY: 0.98 > 1` for industrial precision feel.
- **Priority:** HIGH

### 1.18 Full-Screen Overlay Menu
- **Where seen:** Corentin Bernadou Portfolio (SOTD Mar 25), 1820 Productions (SOTD Feb 26), Foudre Human Social Club (SOTD Mar 15), Voku.Studio (SOTD Feb 21)
- **How it works:** Hamburger/trigger opens a full-viewport overlay that covers all content. Menu items are large-scale typography (60-120px), often with staggered entry animation. Background is solid color or blurred content. Cursor hover on items triggers image preview or color change.
- **SFUX integration:** Mobile and tablet navigation. Full-screen black overlay with white Anton type at 72px for nav items. Items enter staggered from bottom with ScrambleText. Active item highlighted in magenta. Close button: white "X" monospace character, top-right.
- **Priority:** HIGH

### 1.19 Marquee / Infinite Scroll Text Band
- **Where seen:** Awwwards brutalist collection ("GIF's and marquee animation"), Figma 2026 trends (marquee scrolling as preset), DU/TDR reference sites
- **How it works:** A horizontal band of repeating text scrolls infinitely using CSS `animation: marquee` or GSAP `x` tween with `repeat: -1`. Text is duplicated to create seamless loop. Speed varies (typically 30-60px/s).
- **SFUX integration:** Section divider between major homepage sections. Magenta (#FF0090) background band with white Electrolize uppercase text: "SIGNALFRAME // DESIGN SYSTEM // BUILT FOR ENGINEERS // SHIP FASTER //" repeating. Speed: 40px/s. Pauses on hover.
- **Priority:** HIGH

### 1.20 Variable Font Interpolation
- **Where seen:** Codrops typography tag, 2026 trend articles (kinetic typography), Lovable 2026 trends guide
- **How it works:** Variable font axes (`wght`, `wdth`, `ital`, custom axes) animate on scroll position or hover. Text weight morphs from Thin to Black as the user scrolls, or width stretches on hover.
- **SFUX integration:** Limited application since Electrolize and Anton are not variable fonts. Could implement with a secondary variable display font for the homepage hero only, or simulate weight transitions with `text-shadow` and opacity layering between two font weights.
- **Priority:** LOW (font limitation)

---

## 2. Interaction Patterns

### Cursor Effects
| Pattern | Source | Technical Approach | SFUX Fit |
|---------|--------|-------------------|----------|
| **Magnetic Cursor** | Exo Ape / Fluid Glass, Good Fella, multiple SOTDs | `mousemove` listener calculates distance to element center; applies `transform: translate()` with spring physics | HIGH — apply to nav items and CTAs only. Max displacement 8px. |
| **Custom Crosshair Cursor** | Brutalist collection, TDR aesthetic | CSS `cursor: none` + positioned `<div>` following pointer. Crosshair SVG or `+` character. | HIGH — magenta crosshair, 16x16px, replaces default on interactive elements. |
| **Cursor Trail / Ribbon** | Stuff by Kris Temmerman (SOTD Mar 20), creative portfolios | Canvas element tracks cursor positions in array; draws fading line/ribbon between points | LOW — too decorative for SFUX's industrial restraint. |
| **Cursor Scale on Hover** | Linear, Resend, nearly all modern dev tool sites | Custom cursor element scales up (`transform: scale(2)`) when hovering interactive elements | MEDIUM — scale from 16px to 24px on hover, blend mode `difference` for visibility on any background. |

### Hover States Beyond Color
| Pattern | Source | Implementation | SFUX Fit |
|---------|--------|---------------|----------|
| **Underline Draw** | Multiple SOTDs, Linear nav | CSS `background-size` transition from `0% 2px` to `100% 2px` at `background-position: bottom` | HIGH — magenta underline draws from left on nav hover. Duration 0.3s. |
| **Image Reveal on List Hover** | Codrops HoverGrid, Awwwards GSAP tutorial | Positioned image element follows cursor Y within list item; `opacity` and `x` transition on `mouseenter`/`mouseleave` | HIGH — changelog/component lists. Image has 1px black border, no radius. |
| **Clip-Path Wipe** | Awwwards brutalist elements, Codrops hover demos | `clip-path: inset()` transitions from `inset(0 100% 0 0)` to `inset(0)` on hover, revealing alternate content | MEDIUM — button hover reveals magenta fill via horizontal wipe. |
| **Text Weight Shift** | Codrops TextStylesHoverEffects demo | On hover, `font-weight` transitions (requires variable font) or swap between two overlaid text elements with different weights | LOW — SFUX fonts don't support variable weight. |
| **Border Animation** | Awwwards brutalist elements, multiple portfolios | Border segments animate in sequence using `clip-path` or multiple `background-image` gradients | HIGH — fits perfectly with 0px radius industrial boxes. Border draws clockwise in magenta on hover. |

### Scroll-Driven Animations
| Pattern | Source | Implementation | SFUX Fit |
|---------|--------|---------------|----------|
| **Scroll-Linked Text Opacity** | Oaksun Studio, Cluebinders, multiple SOTDs | GSAP ScrollTrigger with `scrub: true`, text characters animate `opacity` based on scroll % | HIGH — manifesto/about text reveals word by word. |
| **Section Pin + Horizontal Scroll** | Locomotive sites, Unseen Studio | `position: sticky` container, inner element `translateX` mapped to scroll | MEDIUM — token showcase, horizontal panel scroll. |
| **Parallax Depth Layers** | FC Porto Memorial, Explore Primland SOTDs | Multiple layers with different scroll speeds via `translateY` multiplied by depth factor | MEDIUM — subtle parallax on hero section background elements only. Keep displacement minimal (10-20px). |
| **Scroll-Triggered Counter** | ON Energy, D2C Life Science SOTDs, Linear metrics | Numbers count up from 0 to target value when section enters viewport. GSAP `to()` with `snap: 1` | HIGH — stats section showing component count, token count, bundle size. |
| **Scroll Snap Sections** | 2026 trends (Figma, Coalition) | CSS `scroll-snap-type: y mandatory` on container, `scroll-snap-align: start` on sections | MEDIUM — consider for homepage full-viewport sections. |

### Page Transitions
| Pattern | Source | Implementation | SFUX Fit |
|---------|--------|---------------|----------|
| **Wipe Transition** | Multiple Awwwards winners, creative agency sites | Full-viewport `<div>` slides in from edge, covers content, new page loads behind, div slides out | HIGH — black wipe from left to right (400ms), matches industrial aesthetic. |
| **ScrambleText Exit/Enter** | Already in SFUX mockups | Current heading scrambles out, new heading scrambles in on route change | HIGH — already partially implemented. |
| **Clip-Path Reveal** | Corentin Bernadou Portfolio, Design by Dylan | New page revealed through expanding `clip-path: circle()` or `inset()` from click origin | MEDIUM — circle reveal from clicked nav item position. |

### Loading/Skeleton States
| Pattern | Source | Implementation | SFUX Fit |
|---------|--------|---------------|----------|
| **Pulsing Skeleton Lines** | Linear, Resend, standard dev tool pattern | Placeholder rectangles with CSS `animation: pulse` gradient sweep | MEDIUM — use solid black rectangles with 50% opacity pulsing, not rounded skeleton shapes. |
| **DrawSVG Loader** | Portfolio sites, brand sites | SVG logo strokes animate during load, transitioning to filled state when content ready | HIGH — SFUX logo draws on initial load. |
| **Counter/Percentage Loader** | Creative agency sites, immersive experiences | Monospace number counts from 00 to 100 during asset preload | HIGH — fits terminal aesthetic. Electrolize monospace, magenta numerals. |

### Micro-Interactions on Form Elements
| Pattern | Source | Implementation | SFUX Fit |
|---------|--------|---------------|----------|
| **Input Border Draw** | 2026 CSS micro-animations (Medium article), modern form patterns | Border animates from center outward or draws around the input on focus | HIGH — magenta border draws clockwise on input focus. 0px radius. |
| **Label Float** | Standard pattern, enhanced in 2026 with spring physics | Label transitions from placeholder position to above-input position with spring easing on focus | MEDIUM — Electrolize label slides up with `ease: 'back.out(1.7)'`. |
| **Button Press Depth** | Resend, Linear, neumorphism trend (Figma 2026) | Button translates down 2px and adjusts shadow on `:active`, simulating physical press | HIGH — already using inset shadows. Button `translateY: 2px` + shadow collapse on press. |
| **Toggle Snap** | Raycast, Linear settings | Toggle switch snaps between states with overshoot spring animation | MEDIUM — sharp snap, no rounded track. Square toggle handle, magenta active state. |

---

## 3. Layout Patterns

### Grid Systems and Asymmetric Layouts
- **12-column with intentional breaks:** Most Awwwards SOTD winners use a base 12-column grid but deliberately break it for visual tension. SFUX should use a 12-column grid with components spanning unconventional column counts (5+7, 3+9, 8+4) rather than symmetric halves.
- **CSS Grid named areas:** Shopify Renaissance Edition and other SOTM winners use `grid-template-areas` for semantic layout naming. SFUX components page could use named areas: `"preview preview sidebar"` / `"code code sidebar"`.
- **Negative space as design element:** DU and TDR both use aggressive whitespace. SFUX should maintain minimum 64px section padding and 120px+ between major homepage sections.

### Full-Bleed Sections and Viewport Masking
- **Viewport-height pinned sections:** Homepage sections at `100vh` with `scroll-snap-align`. Each section is a complete visual composition. Seen in virtually every Awwwards winner.
- **Edge-to-edge image/color bands:** Black or magenta bands that break the content container and span full viewport width. DU uses this extensively with black horizontal rules.
- **Viewport masking with clip-path:** Content visible only within a shaped viewport mask (rectangle, polygon). As user scrolls, the mask shape transforms. Seen in creative portfolio SOTDs.

### Split-Screen Compositions
- **60/40 asymmetric split:** DU detail page pattern. Apply to SFUX documentation pages: code example left (60%), explanation right (40%). Black vertical divider, 1px solid.
- **Pinned sidebar + scrolling content:** Linear, Raycast documentation. Sidebar navigation pins while main content scrolls. SFUX docs should pin the component API sidebar.

### Sticky/Pinned Elements During Scroll
- **Sticky section headers:** As content scrolls, section headers pin to the top with a black background bar. Electrolize uppercase, small type. Seen in long-form Awwwards winners.
- **Sticky code panel:** On component detail pages, the live preview pins while the props table and usage docs scroll beside it.
- **Pinned progress indicator:** Vertical dot indicator on the side showing current section position. Magenta active dot, gray inactive dots.

### Bento Grids and Dashboard-Style Layouts
- **Asymmetric card grid:** Cards of varying heights and widths arranged in a dense grid. No uniform card height. Content dictates card size. Raycast feature section, Linear dashboard.
- **Nested grids:** A bento grid where individual cells contain their own sub-grids. SFUX token page could nest color swatches within a larger grid cell that also contains typography samples.
- **Interactive bento:** Cards that expand on click to reveal detail content, pushing adjacent cards. Uses GSAP `Flip` plugin for layout animation.

---

## 4. Typography Patterns

### Kinetic Typography
- **Character stagger reveal:** SplitText splits heading into characters, each enters from below with rotation and opacity stagger. Seen in virtually every Awwwards winner. SFUX implementation: 0.03s stagger, `y: 20`, `rotation: 3`, `opacity: 0` per character.
- **Scroll-driven text opacity:** Words in a paragraph fade from 30% to 100% opacity as the scroll position passes through them. Creates a "reading progress" effect. Ideal for SFUX manifesto section.
- **ScrambleText on entry:** Already in SFUX. Characters cycle through random monospace glyphs before resolving. Character set: `"01!<>-_\\/[]{}—=+*^?#"`.

### Mixed-Scale Type Compositions
- **Massive headline / tiny body:** DU pattern directly. 200px+ Anton headlines paired with 12-14px Electrolize body. The scale contrast IS the design. SFUX should exaggerate this further on the homepage.
- **Overlapping type layers:** Large ghost text (10% opacity, 300px+) behind smaller readable text. Creates depth without complexity. Use for section labels behind content.
- **Counter/index numerals:** Large magenta numerals (01, 02, 03) as section indices, positioned offset from the content grid. Seen in Awwwards portfolios and creative agency sites.

### Text Masking and Clipping
- **Image-through-text:** `background-clip: text` with a circuit-board or halftone texture as the background image, visible only through the letterforms. For the SFUX homepage hero "SIGNALFRAME" heading.
- **Video-through-text:** Same technique with a looping video (e.g., glitch/static pattern) as the text fill. Performance consideration: use `<canvas>` instead of `<video>` for better control.

### Type as Graphic Element
- **Rotated sidebar labels:** Vertical text along section edges, rotated 90 degrees. "SECTION: COMPONENTS" or "REF: API/V1" in Electrolize uppercase, small size. DU uses this pattern.
- **Oversized section markers:** Full-width background text that reads "TOKENS" or "API" at 400px+, 5% opacity, behind the actual section content. Structural, not decorative.

---

## 5. Visual Effects

### Grain/Noise Textures
- **CSS noise overlay:** `background-image` with a tiled 200x200px noise PNG at 3-5% opacity over section backgrounds. Already identified in SFUX graphic realism research. Apply to the yellow (#FFE500) accent bands to match TDR texture.
- **SVG filter grain:** `<feTurbulence type="fractalNoise" baseFrequency="0.65">` applied via CSS `filter: url(#grain)`. More performant than image-based noise, resolution-independent.
- **Animated grain:** The noise layer shifts position every 100ms (or continuously via `requestAnimationFrame`) creating a subtle film-grain flicker. Use sparingly — homepage hero section only.

### Gradient Meshes and Aurora Effects
- **Note for SFUX:** DU/TDR aesthetic is fundamentally FLAT. Gradient meshes and aurora effects conflict with the design language. Skip these entirely. If color transitions are needed, use hard-edge color blocks, not gradients.

### Glassmorphism
- **Note for SFUX:** Glass/blur effects are explicitly counter to the DU/TDR language. The command palette overlay is the ONE exception where `backdrop-filter: blur(8px)` could be justified (functional, not decorative). All other surfaces should be opaque, flat fills.

### SVG Filter Effects
- **Halftone dots:** SVG filter simulating DU's halftone circle pattern. Apply to the SFUX logo or as a hover effect on image thumbnails. `<feComponentTransfer>` with step function creates the dot pattern.
- **Glitch displacement:** `<feDisplacementMap>` with a noise texture creates horizontal scan-line glitch effects. Use on hover for image elements, with brief duration (0.2s) and automatic reset.
- **Inset/deboss:** SVG filter combining `<feGaussianBlur>`, `<feSpecularLighting>`, and `<feComposite>` to create an inset/embossed appearance on text or containers. Already in SFUX code block styling.

### WebGL/Canvas Overlays (Non-Decorative)
- **Scan-line overlay:** Canvas element rendering horizontal lines at 2px intervals with 5% opacity, simulating a CRT/monitor scan-line effect. Toggleable, not always-on. Reinforces the industrial/VHS aesthetic from DU.
- **Cursor-reactive dot grid:** Canvas grid of small dots that react to cursor proximity (scale up, change color to magenta). Functions as a background texture that responds to interaction. Seen in creative coding demos on Codrops.

### Dark/Light Mode Transitions
- **Hard cut, not fade:** SFUX should NOT use smooth color transitions for mode switching. Following the DU "invert colors toggle" pattern, mode switch should be instantaneous — a hard cut. CSS `transition: none` on the `:root` color custom properties during the switch, then re-enable transitions.
- **Maintained hierarchy:** In dark mode, the same visual hierarchy should apply: display type in white, body in light gray, accent stays magenta (#FF0090), structural elements stay high-contrast.

---

## 6. Navigation Patterns

### Full-Screen Overlay Menus
- **Black overlay with staggered type:** Most aligned with SFUX. Full-viewport black background, nav items in white Anton at 72px, staggered entry from bottom (0.08s per item, `y: 40`, `opacity: 0`). Current page indicated by magenta color. Close animation: items stagger out upward.
- **Content-aware overlay:** TDR homepage pattern — the navigation IS the content. On mobile, the full-screen menu could list all pages with brief descriptions in Electrolize, making the menu itself useful content.

### Sidebar Navigation with Active Indicators
- **Linear-style sidebar:** Fixed-position sidebar with section links. Active section highlighted with magenta left border (2px solid #FF0090) and bold weight. Smooth scroll to section on click. Visible on desktop documentation pages.
- **Position indicator dot:** Vertical column of dots on the right edge of viewport, each representing a section. Active dot is magenta, others are gray. Connected by a thin line. Updates on scroll.

### Breadcrumb and Pagination Innovations
- **Slash-separated breadcrumbs:** `SFUX / Components / Button / API` in Electrolize monospace, uppercase. Each segment is a link. Current segment in magenta. Mirrors terminal path conventions.
- **TDR "(X / Y)" pagination:** Page indicators styled as `(01 / 05)` in monospace. Arrow navigation with ScrambleText transition on page change.

### Command Palette / Search
- **Full-width search bar:** Instead of a small overlay, the search expands to full viewport width from the nav bar. Black background, white monospace input text, magenta cursor. Results appear below in a flat list with keyboard navigation (arrow keys + enter).
- **Filtered search with type indicators:** Results tagged with type badges: `[COMPONENT]`, `[TOKEN]`, `[PAGE]`, `[API]` in uppercase monospace. Badge background matches type (magenta for components, black for tokens, etc.).

### Tab and Filter Bar Interactions
- **Underline slide:** Active tab indicated by a magenta underline that slides horizontally between tabs using GSAP `x` and `width` animation. Underline is 2px solid, sharp endpoints (no rounded caps).
- **Filter toggle with ScrambleText:** When switching between filter states, the content heading scrambles to the new label. Content below cross-fades with a 0.2s transition.

---

## 7. Top 15 Patterns for SignalframeUX

Ranked by impact on the DU/TDR aesthetic and feasibility within the existing GSAP-powered stack.

### 1. ScrambleText Heading Transitions
- **Why it fits SFUX:** Directly channels the terminal/monospace voice of DU. Already partially implemented. The most recognizably "SignalframeUX" interaction.
- **Implementation:** GSAP ScrambleTextPlugin. Character set: `"01!<>-_\\/[]{}—=+*^?#"`. Duration: 0.8s. Trigger: page entry, scroll entry, route change.
- **Screens enhanced:** ALL pages (headings on route entry)
- **Effort:** S (plugin already loaded, extend to all headings)

### 2. Scroll-Linked Text Reveal (Manifesto)
- **Why it fits SFUX:** Creates a reading ritual that forces engagement with the brand message. DU's massive type demands attention; scroll-linking it adds ceremony.
- **Implementation:** GSAP SplitText + ScrollTrigger. Split into words, animate `opacity: 0.15 > 1` and `y: 5 > 0` scrubbed to scroll. `scrub: 0.5` for slight lag.
- **Screens enhanced:** Homepage (manifesto/about section)
- **Effort:** S

### 3. Bento Grid Component Showcase
- **Why it fits SFUX:** DU's 4-column no-gutter grid mapped to a modern component display. Industrial precision in layout, each cell a specimen.
- **Implementation:** CSS Grid with `grid-template-areas`. GSAP ScrollTrigger `batch()` for staggered entry. Cards: 1px solid black border, 0px radius, white background, Electrolize labels.
- **Screens enhanced:** Components page, Tokens page
- **Effort:** M

### 4. Marquee Text Divider Bands
- **Why it fits SFUX:** DU's black horizontal rules + TDR's manifesto slogans combined. Creates rhythm between sections. Industrial signage aesthetic.
- **Implementation:** CSS `animation: marquee` on duplicated text nodes inside `overflow: hidden` container. Magenta (#FF0090) background, white uppercase Electrolize text. Pause on hover via `animation-play-state: paused`.
- **Screens enhanced:** Homepage (between sections), Components page (between categories)
- **Effort:** S

### 5. DrawSVG Logo Loading State
- **Why it fits SFUX:** Transforms the loading moment into a brand experience. DU's technical-schematic aesthetic = strokes being "drawn" by a machine.
- **Implementation:** GSAP DrawSVGPlugin. SVG logo paths animate `stroke-dashoffset` from `100%` to `0%` over 1.2s, then fill animates `opacity: 0 > 1` over 0.3s. Background: white.
- **Screens enhanced:** Initial site load, route transitions
- **Effort:** S

### 6. Code Block Live Typing Animation
- **Why it fits SFUX:** A design system site MUST make code feel alive. Resend and Linear prove that animated code blocks are the new standard for dev tool marketing.
- **Implementation:** GSAP `stagger` timeline. Lines appear with `opacity: 0 > 1` and `y: 8 > 0`, staggered by 0.06s. Optional typing cursor (magenta `|` character) that advances. Inset shadow on code container.
- **Screens enhanced:** Getting Started page, API Reference page
- **Effort:** M

### 7. Full-Screen Overlay Navigation
- **Why it fits SFUX:** DU/TDR both use navigation-as-statement. Large type nav items on a full black overlay are both functional and a design gesture.
- **Implementation:** GSAP timeline. Overlay `clipPath: inset(0 0 100% 0)` > `inset(0)` over 0.4s. Nav items stagger in: SplitText chars, `y: 20`, `opacity: 0`, stagger 0.02s per char. Close reverses.
- **Screens enhanced:** All pages (mobile + optional desktop)
- **Effort:** M

### 8. Custom Magenta Crosshair Cursor
- **Why it fits SFUX:** Replaces the generic pointer with a precision instrument. DU's technical/schematic world demands a cursor that feels like a targeting reticle.
- **Implementation:** CSS `cursor: none` on `<body>`. Positioned `<div>` with crosshair SVG (magenta lines, 16x16px) following `mousemove` via `transform: translate()`. Use `requestAnimationFrame` for smooth tracking. Scale up to 24px on interactive element hover.
- **Screens enhanced:** ALL pages (desktop only)
- **Effort:** S

### 9. Magnetic Nav Items
- **Why it fits SFUX:** Adds tactile quality to navigation without compromising the flat industrial look. Elements feel mechanical — pulled by invisible forces.
- **Implementation:** `mousemove` listener on nav container. Calculate distance from cursor to each nav item center. If within 60px radius, apply `transform: translate(dx * 0.15, dy * 0.15)` with `ease: 'power2.out'`. Reset on `mouseleave`.
- **Screens enhanced:** Header navigation, footer links
- **Effort:** S

### 10. Staggered Grid Entry Animation
- **Why it fits SFUX:** Makes the grid feel assembled, piece by piece, like a circuit board being populated. Technical precision in timing.
- **Implementation:** GSAP ScrollTrigger `batch()`. Each grid item: `y: 30`, `opacity: 0`, `scaleY: 0.98` > `y: 0`, `opacity: 1`, `scaleY: 1`. Stagger: 0.08s. Duration: 0.5s. Ease: `'power2.out'`.
- **Screens enhanced:** Components page, Tokens page, any grid layout
- **Effort:** S

### 11. Text Masking with Halftone Texture
- **Why it fits SFUX:** Directly borrows DU's halftone dot pattern and applies it to typography. The hero heading becomes a DU artifact.
- **Implementation:** CSS `background-clip: text; -webkit-text-fill-color: transparent;` with a halftone dot SVG pattern as `background-image`. On scroll, `background-position` shifts slightly for parallax. Anton font at 120px+.
- **Screens enhanced:** Homepage hero heading
- **Effort:** S

### 12. Border Draw Hover Effect
- **Why it fits SFUX:** 0px border-radius boxes are SFUX's signature. Animating the border itself turns a constraint into a feature. Feels like a machine tracing the component boundary.
- **Implementation:** Four `<span>` elements positioned absolute on each edge of the button/card. On hover, each span scales from `scaleX(0)` / `scaleY(0)` to `scaleX(1)` / `scaleY(1)` in sequence (top > right > bottom > left), creating a clockwise border draw. Color: magenta (#FF0090). Duration: 0.4s total.
- **Screens enhanced:** Component cards, CTA buttons, interactive elements
- **Effort:** S

### 13. Scroll-Driven Background Color Shifts
- **Why it fits SFUX:** Creates distinct visual "zones" as the user scrolls through the site. Each section has its own atmosphere while maintaining the flat-color-block language.
- **Implementation:** GSAP ScrollTrigger on each section. `backgroundColor` animates between section colors. Transitions are SHARP (duration 0.1s, not gradual blend) to match the brutalist hard-edge aesthetic. Sequence: white > black > white > magenta.
- **Screens enhanced:** Homepage (section transitions)
- **Effort:** S

### 14. Command Palette (Cmd+K)
- **Why it fits SFUX:** Every serious dev tool has one. For SFUX it doubles as a design statement — a brutalist search interface that proves the design system works for complex UI.
- **Implementation:** React portal or `<dialog>`. Keyboard listener for `Cmd+K`. Black background, 1px white border, 0px radius. Electrolize monospace input, magenta cursor. Results filtered by type with uppercase monospace tags. Arrow key navigation with magenta highlight.
- **Screens enhanced:** All pages (global utility)
- **Effort:** M

### 15. Image Reveal on List Hover
- **Why it fits SFUX:** Transforms flat text lists into interactive galleries. When hovering component names in a changelog or index, seeing a preview screenshot elevates the experience from documentation to portfolio.
- **Implementation:** Positioned `<div>` with `overflow: hidden` containing the preview image. On `mouseenter`: `clipPath: inset(0 100% 0 0)` > `inset(0)` over 0.3s. Image position tracks cursor Y within the list item bounds. 1px solid black border on the image container.
- **Screens enhanced:** Changelog, component index lists
- **Effort:** M

---

## Summary Implementation Roadmap

### Phase 1 — Quick Wins (S effort, 1-2 days each)
1. ScrambleText on all headings
2. Scroll-linked text reveal (homepage manifesto)
3. Marquee text divider bands
4. DrawSVG logo loading
5. Custom magenta crosshair cursor
6. Magnetic nav items
7. Staggered grid entry animations
8. Text masking with halftone
9. Border draw hover effect
10. Scroll-driven background color shifts

### Phase 2 — Medium Builds (M effort, 2-4 days each)
11. Bento grid component showcase
12. Code block live typing
13. Full-screen overlay navigation
14. Command palette (Cmd+K)
15. Image reveal on list hover

### Phase 3 — Advanced Explorations (L effort, investigate feasibility)
- Horizontal scroll token showcase
- Fluid X-Ray reveal (CSS version)
- WebGPU text dissolution (CSS fallback)
- Atmospheric depth gallery
- Cursor-reactive dot grid background

---

## Patterns Deliberately Excluded

These patterns appeared frequently in the research but are excluded because they conflict with SFUX's DU/TDR design language:

| Pattern | Why Excluded |
|---------|-------------|
| Gradient meshes / aurora backgrounds | Violates flat-color-block principle |
| Glassmorphism / frosted glass | Violates opacity/transparency restraint |
| Rounded corners anywhere | 0px border-radius is non-negotiable |
| 3D model viewers / WebGL scenes | Too decorative; SFUX is 2D-dominant |
| Parallax with excessive depth | DU is flat; keep parallax to 10-20px max |
| Cursor trail / ribbon effects | Too whimsical for industrial aesthetic |
| Organic blob shapes | Conflicts with rectilinear geometry |
| Smooth gradient transitions between sections | Must be hard-edge color cuts |
| Neumorphism (soft shadows) | SFUX uses inset shadows only, not raised soft shadows |
| Variable font weight interpolation | Electrolize and Anton are not variable fonts |

---

## Source Index

| File | Type | Key Patterns Extracted |
|------|------|----------------------|
| `awwwards-brutalist.json` | Awwwards brutalist collection + search | Brutalist gallery, overlapping layouts, hover effects, typography patterns |
| `awwwards-animation.json` | Awwwards GSAP/animation/scroll collections | ScrollTrigger patterns, text reveal, scroll-linked animation, GSAP list reveal |
| `awwwards-designsys.json` | Awwwards design system elements | Component libraries, documentation patterns, UI kit structures |
| `ui-patterns-2026.json` | 2026 trend articles (Figma, Coalition, Tubik, LambdaTest, Lovable) | 13 Figma trends, kinetic typography, spatial UX, micro-animations, bento grids |
| `ui-trends-2026.json` | 2026 CSS/web trends (Medium, Elementor, Designmodo) | CSS scroll-driven animations, glassmorphism 2.0, archival index aesthetic |
| `codrops-patterns.json` | Codrops Creative Hub experiments | Fluid X-ray reveal, sticky grid scroll, hover grid, text styles, atmospheric depth gallery, WebGPU text dissolution |
| `awwwards-sotd-list.md` | Awwwards SOTD Jan-Mar 2026 | 60+ winning sites cataloged with studios and award types |
| `awwwards-brutalist-sites-article.md` | Brutalist websites article | Cursor interactions, overlay galleries, marquee animations, brutalist menus, scroll distortion |
| `linear.app.md` | Linear homepage | Product UI patterns, code diffs, dashboard layouts, changelog format |
| `resend.com.md` | Resend homepage | Code block animation, SDK showcase, real-time event feeds, testimonial carousel |
| `raycast.com.md` | Raycast homepage | Command palette UX, feature bento grid, extension showcase, productivity UI |
