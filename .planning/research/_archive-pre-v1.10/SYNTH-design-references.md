# SYNTH: Design Reference Patterns
## SignalframeUX v1.0 "Craft & Feedback"
*Synthesis date: 2026-04-05 | Freshly scraped sources*

---

## 1. How Linear / Raycast / Resend / Vercel Achieve "Feels Good" DX

**Product UI as the pitch, without mediation.** Linear's hero shows real issue cards: `ENG-2703 · In Progress · High` with agent activity logs, PR diff views, and Slack→Linear creation timestamps. Resend's hero is an 18-line JS snippet with a live HTTP 200 response stream cycling through UUIDs in real time. Vercel shows an actual `git push` triggering global edge deployment. None of these use illustration — the raw interface is sufficient.

**Terse declarative headlines.** Linear: "The product development system for teams and agents." Resend: "Email for developers." Vercel: "Build and deploy on the AI Cloud." All are seven words or under. No adjectives that don't carry information. No emotional language.

**Specific metrics as social proof.** Vercel: "Runway build times went from 7m to 40s." "Leonardo AI saw a 95% reduction in page load times." "Zapier saw 24x faster builds." These are rendered as a marquee of logo + metric pairs — not testimonial quotes. The number is the proof.

**Numbered section chapters.** Linear structures the homepage as 1.0 Intake → 2.0 Plan → 3.0 Build → 4.0 Diffs → 5.0 Monitor. Each chapter has a sub-anchor link and a featured UI screenshot. This creates depth without hiding content — scrolling is discovery, not work.

**Changelog as active development proof.** Linear surfaces recent changelog on the homepage: "Web forms for Linear Asks — Apr 1, 2026," "Introducing Linear Agent — Mar 23, 2026," "UI refresh — Mar 11, 2026." This signals the product is alive, not a static asset.

**Testimonials named to role + company, no star ratings.** Linear: Gabriel Peal, OpenAI: "You just have to use it and you will see, you will just feel it." Resend quotes switching cost explicitly: "I've used Mailgun, Sendgrid, and Mandrill and they don't come close." No avatars without context. No generic praise.

---

## 2. How Portfolio Sites Present Design Engineering Craft

**Locomotive (locomotive.ca):** Hero is a word-by-word text build of "Digital-First Design Agency" — each word arrives sequentially, each state visible. The animation IS the identity claim, not an illustration of it. Work is listed as named cards split across title/image pairs: Theory Verse, Scout Motors, Populous. No hover descriptions — the project title carries all weight.

**Aristide Benoist (aristidebenoist.com):** The entire site is an index. 30 projects, each rendered as a numbered item (01–30) with individual characters decomposed as separate DOM elements alongside a data block: COMPLETED [date] / TYPE [category] / ROLE [function] / CLIENT [name]. The portfolio is structured like a relational database readout. At the foot: cumulative award counts (30 SOTD, 2 Independent of the Year, 27 Developer Award). Craft is quantified, not narrated.

**Semplice (semplice.com):** Leads with a positioning statement — "For the best of the best, and everyone who wants to be." Followed by named designer profiles: Ash Thorp (Illustrator, graphic designer & creative director), Elena Miska, Pawel Nolbert. The community is the product proof. No editor screenshots above fold.

**Arc (arc.net):** Uses press quote marquee as the primary secondary section — Bloomberg, Inverse, Fast Company, one deliberately absurd: "Arc is a great name." @youtuber. The irony is intentional. This registers as confident rather than promotional.

**Common craft signal:** High editorial restraint. Whitespace and type carry all structural work. Constraint is the statement. Motion is tightly scoped — one effect per section, not multiple simultaneous animations.

---

## 3. DU/TDR Aesthetic Principles Applicable to Web

**From actual scraped content:**

**DU Neubau R01–R10 (both blue and black editions):** The sleeve design is built around a single constraint: NB-Form™ typeface renders "Detroit Underground" by masking the street grid of Detroit, Michigan. The letterforms ARE the map data. Each release (R08–R10, the black edition) is differentiated only by its graphical pattern, visible through a dye-cut hole on the front cover revealing the record's circular label sticker. The full alphabet is documented on the rear — the typeface is both identity and documentation.

**Apply to FRAME+SIGNAL:** Type maps data the way NB-Form maps a city. FRAME is the grid (the Detroit street system — deterministic, legible). SIGNAL flows through it (the text "Detroit Underground" revealed by the mask — the content that gives it meaning). The die-cut is the aperture between layers: surface legibility and depth-level detail coexist without collision.

**DU detroitunderground.net:** The site header reads "DU-VHS · detund™ informatics." The label self-describes as informatics, not music. VHS is in the name. The UI has a toggle for "invert colors" (a literal lamp icon). The catalog uses release codes (DU-R01, etc.) not album names as primary navigation. Everything is tagged, versioned, systematic.

**TDR Wikipedia (confirmed from scrape):** TDR is described as "Maximum-minimalist, mixing images from Japanese anime and subvertised corporate logos with a postmodern tendency towards irony." Key slogans include "Work Buy Consume Die," "Robots Build Robots," "Customized Terror," "Made in the Designers Republic, North of Nowhere." Their work became "the visual language of ambient techno and Sheffield pop." Clients: Autechre, Aphex Twin, Warp Records, Rockstar (GTA packaging), Sony AIBO. Wipeout (PSX 1995): interface design, visuals, packaging.

**Apply to web:** TDR's irony is structural, not decorative. System warnings that are aesthetically serious. Slogans that read like status labels. Corporate visual grammar turned against itself. In SignalframeUX: label tokens as system output ("SIGNAL ACTIVE," "FRAME STABLE"), not marketing copy.

**Warp Records (warp.net):** The storefront grid shows each release as a card with a caret-down label structure: "Squarepusher↓ 'Kammerkonzert'." No genre tags, no bios, no explanatory copy. The format is: [ARTIST NAME]ˇ / [RELEASE TITLE]. Pure bibliographic minimalism. The music player at bottom shows: PMNO · ● · 0:00 · }zC · equalizer. Cryptic by design.

---

## 4. Above-the-Fold Observations

| Site | Hero Structure | Motion | Primary Signal |
|---|---|---|---|
| Linear | Issue card + agent log UI | Subtle fade-in | "The product development system…" |
| Resend | Dark bg + code snippet + HTTP stream | Live data scroll | "Email for developers" |
| Vercel | Headline + dual CTA + logo marquee | Marquee scroll | "Build and deploy on the AI Cloud" |
| Locomotive | Sequential word build animation | Word stagger | "Digital-First Design Agency" |
| Aristide Benoist | Numbered index, chars as DOM elements | Character stagger | No headline — index IS the hero |
| Semplice | Positioning statement + video CTA | Video autoplay | "For the best of the best…" |
| Arc | Headline + browser screenshot + press quotes | Static above fold | "Arc is the Chrome replacement I've been waiting for." |
| Warp Records | Release grid, no hero copy | None | Grid is the identity |

**Pattern:** Product sites lead with utility claim + product evidence. Portfolio/agency sites lead with identity claim + motion. Record label (Warp) uses pure catalog grid with no explanation. All suppress nav weight.

**For SignalframeUX hero:** One identity claim line (SIGNAL layer, e.g., "A design system for Culture Division"). FRAME layer animating beneath — grid, scanlines, or typographic specimen. Two CTAs max. System specimen or live component render as product proof.

---

## 5. Common Component Patterns Across SOTD-Quality Sites

**Logo/metric marquee:** Vercel uses logo + specific metric pairs (not just logos) in a horizontal scroll. "Runway [logo] build times went from 7m to 40s." The metric is the differentiator.

**Numbered section anchors:** Linear's 1.0–5.0 chapter structure with sub-anchors (1.1, 1.2…). Enables scan of page depth without sidebar nav. Works with a scroll progress indicator.

**Indexed project list:** Aristide Benoist's numbered full-catalog index (01–30) — each with atomic metadata (date, type, role, client). Higher information density than a grid of thumbnails.

**Live code block as product proof:** Resend's JS snippet with cycling HTTP 200 response UUIDs — not a screenshot, a live element. Monospace, line numbers, restrained background.

**Press quote marquee:** Arc uses publication + quote pairs in a horizontal marquee, including a self-aware absurdist entry. Signals confidence without looking promotional.

**Changelog as trust anchor:** Linear's homepage changelog (4 entries, dated) — proves active development. Equivalent to "last updated" but at system level.

**Sticky minimal nav:** Logo left, 3–5 text links, one CTA. Consistent across all sites. No mega-menus. Opacity or scale shift on scroll.

---

## 6. DU Visual System → FRAME+SIGNAL Translation

**NB-Form as the FRAME prototype:** The typeface reads "Detroit Underground" by masking the Detroit city grid. This is the exact FRAME+SIGNAL relationship: the grid (FRAME — structural, cartographic, systematic) has SIGNAL flowing through it (the readable text — the meaning that animates the structure). Neither layer works without the other.

**Die-cut as aperture:** Each DU sleeve has a hole through which the record's label sticker is visible. Surface carries graphic language; the aperture reveals the live record beneath. Apply: SignalframeUX surfaces (the FRAME — components, layout, tokens) have apertures (state indicators, data readouts, animation states) through which SIGNAL is visible — active data, current state, live system output.

**Black edition constraint:** R08–R10 use no chromatic color — only typography weight, geometric pattern, and cutout geometry for contrast. The constraint is the identity. Apply: SignalframeUX's monochromatic base (background/foreground/primary only) forces all hierarchy to emerge from structure, not color decoration.

**Systematic variation, not rebranding:** R08, R09, R10 are distinct via their graphical patterns — the system holds, the output changes. Apply: CVA variant system. The token grammar is locked; component states vary within it.

**"detund™ informatics":** DU self-describes as informatics. The label is a data system that happens to release music. Apply: Culture Division framing — SignalframeUX is a data system that happens to produce UI. Labels, codes, release numbers, version strings as ambient visual content.

**TDR slogans as system labels:** "Work Buy Consume Die" / "Robots Build Robots" / "Customized Terror." These are warning labels, status outputs, system messages — not brand copy. Apply: in-interface text that reads as system output: `SIGNAL STABLE`, `FRAME LOCKED`, `SESSION ACTIVE`, `v0.1.0 — Culture Division`.

---

*Evidence-based. No assumptions. Sources: firecrawl captures of 9 product/portfolio/agency sites + DU Neubau/Behance, DU detroitunderground.net, TDR Wikipedia, Warp Records warp.net.*
