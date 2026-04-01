# VISUAL DNA EXTRACTION — DU × TDR for SignalframeUX

## Detroit Underground (detroitunderground.net)

### Layout
- **White background dominant** — NOT dark mode
- **Persistent header**: massive black custom letterforms "DU" + live clock counter (HH:MM:SS) in same massive type
- **4-column grid** on archive/listing pages — no gutters, images edge-to-edge
- **2-column asymmetric** on detail pages — hero artwork left (60%), black letterform section title right (40%)
- **Black horizontal rules** as section dividers — full bleed, heavy weight
- **Footer**: minimal, monospace, magenta link to detroitunderground.net

### Typography
- **Headlines**: Custom black geometric letterforms (Neubau Berlin collaboration) — ultra-bold, tightly tracked, sometimes overlapping/colliding
- **Body**: Monospace (Courier-like), all-caps, generous letter-spacing
- **Nav**: Monospace, all-caps, bullet-prefixed (•ARCHIVE •RELEASES •MODULAR)
- **Japanese katakana** mixed with Latin text in titles: デトロイト アンダーグラウンド
- **Size contrast**: Massive (200px+) headlines vs tiny (11-12px) body

### Color
- **Primary**: White (#FFFFFF) background
- **Secondary**: Black (#000000) — letterforms, rules, fills
- **Accent 1**: Magenta/Pink (#FF0090) — links, dates, hover states
- **Accent 2**: Green (#00FF00) — DU-VHS app screen, matrix-style
- **Photography**: Heavy use of glitch/VHS artifacts, cyan/magenta/purple tones in images
- **No gradients** on UI elements — flat, solid fills only

### Texture & Imagery
- Halftone/raster dot patterns on the DU logo circles
- VHS scan lines and glitch artifacts
- Circuit board / modular synth photography
- Record sleeve artwork — bold geometric, often black-on-white
- The DU logo itself: two overlapping circles with halftone fill

### Key UI Elements
- **DU-VHS badge**: Fixed position, bottom-right, black pill with white text + cassette icon
- **Search icon**: Small magnifying glass, fixed left edge
- **Invert colors toggle**: Lamp icon in header
- **No border-radius anywhere** — all 0px, sharp industrial edges
- **No cards, no shadows, no rounded corners**

---

## The Designers Republic (thedesignersrepublic.com)

### Layout
- **Yellow (#FFE500) banner/header** — saturated, fills entire viewport on homepage
- **Homepage = text-only navigation** — client names flow as inline paragraph text, no images
- **Project pages**: Yellow banner top, white content area below
- **Asymmetric image grid** on project pages — mixed column widths
- **"(X / Y) Learn more."** pagination pattern
- **No traditional nav menu** — the entire homepage IS the navigation

### Typography
- **Logotype**: "The Designers Republic™" in what appears to be a serif or display face (Circular Pro Bold per wiki)
- **Body text**: Large (40-60px), dark gray (#333) on yellow, feels like reading a manifesto
- **Accent text**: Magenta/Red (#E91E63) for emphasis words
- **™ superscript used extensively** — branding as design element
- **"Accept Us Into Your Life."** — tagline as design statement
- **Slogans embedded in design**: "Work Buy Consume Die", "Made in the Designers Republic"

### Color
- **Yellow (#FFE500)** — primary background, the TDR signature
- **Dark gray (#333333)** — body text
- **Magenta/Red (#E91E63)** — accent, links
- **White (#FFFFFF)** — content areas on project pages
- **Black (#000000)** — structural elements

### Style Principles
- **Maximum-minimalism** — dense information, minimal decoration
- **Subverted corporate branding** — ™ symbols, fake corporate speak, anti-establishment tone
- **Postmodern irony** — serious aesthetic applied to absurdist content
- **Wipeout UI aesthetic** — futuristic HUD elements, technical schematics
- **Flat color fills** — no gradients, no textures on structural elements

---

## SYNTHESIS FOR SIGNALFRAMEUX

### What to borrow from DU:
1. White-dominant background with black geometric elements
2. Massive custom letterforms for section headers
3. Monospace body text, all-caps nav
4. Japanese katakana mixed into titles: シグナルフレーム
5. 4-column edge-to-edge grid for component browsing
6. Black horizontal rules as section dividers
7. Magenta/pink accent color for interactive elements
8. Halftone textures on decorative elements
9. 0px border-radius everywhere
10. Circuit/modular imagery as metaphor for component system

### What to borrow from TDR:
1. Bold color block sections (adapt yellow → use as accent panels)
2. Text-as-navigation patterns (component names as dense flowing text)
3. ™ branding ("SIGNAL//FIELD™", "SignalframeUX™")
4. Dense information overlays — technical specs visible
5. Manifesto-style body text (large, declarative)
6. Anti-corporate tone in copy ("Accept the interface into your life")
7. "(X / Y)" pagination/counting pattern
8. Wipeout-style HUD elements for API reference UI
9. Subverted corporate slogans ("Build. Ship. Signal. Repeat.")

### Color Palette (merged)
```
--bg-primary: #FFFFFF        /* DU white */
--bg-secondary: #000000      /* DU black */
--bg-accent: #FFE500         /* TDR yellow — used sparingly for panels */
--text-primary: #000000      /* Black on white */
--text-secondary: #333333    /* Dark gray for body */
--text-mono: #888888          /* Monospace metadata */
--accent-magenta: #FF0090    /* DU pink — primary interactive */
--accent-green: #00FF00      /* DU matrix green — terminal/code */
--accent-red: #E91E63        /* TDR red — warnings/emphasis */
--surface-dark: #111111      /* Code blocks, terminal areas */
```

### Typography Stack
```
--font-display: 'DU-style' (will use system Impact/Anton/Oswald as stand-in for massive geometric)
--font-body: 'Courier New', 'SF Mono', monospace
--font-nav: uppercase monospace, letter-spacing: 0.15em
--font-katakana: inherit (rendered as unicode characters)
```

### Grid System
- Homepage: Asymmetric 2-column (60/40 or 70/30)
- Component library: 4-column edge-to-edge grid
- API reference: 3-panel (nav 20% | content 50% | preview 30%)
- Token explorer: Dense table layout with monospace values
- Getting started: Single column, manifesto-style
