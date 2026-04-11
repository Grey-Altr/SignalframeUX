/**
 * API documentation data for all SignalframeUX components and utilities.
 * Each entry maps to a nav item in the API Explorer sidebar.
 *
 * AUTO-GENERATED — do not edit by hand.
 * Run: pnpm docs:generate
 * Source: scripts/generate-api-docs.ts
 * Generated: 2026-04-11T04:46:30.810Z
 */

export interface PropDef {
  name: string;
  type: string;
  default: string;
  desc: string;
  required?: boolean;
}

export interface UsageExample {
  label: string;
  code: string;
}

export interface PreviewHud {
  lines: string[];
  code: string;
}

export interface ComponentDoc {
  id: string;
  name: string;
  layer: "FRAME" | "SIGNAL" | "CORE" | "TOKEN" | "HOOK";
  version: string;
  status: "STABLE" | "BETA" | "EXPERIMENTAL";
  description: string;
  importPath: string;
  importName: string;
  props: PropDef[];
  usage: UsageExample[];
  a11y: string[];
  preview?: PreviewHud;
}

export const API_DOCS: Record<string, ComponentDoc> = {
  "SFContainer": {
    "id": "SFContainer",
    "name": "SFContainer",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "RESPONSIVE PAGE CONTAINER — FRAME LAYER LAYOUT PRIMITIVE. ENFORCES MAX-WIDTH TOKENS AND RESPONSIVE GUTTERS DEFINED IN GLOBALS.CSS. DEFAULT WIDTH IS \"WIDE\" FOR MOST PAGE SECTIONS. USE \"CONTENT\" FOR PROSE/READABLE TEXT COLUMNS.",
    "importPath": "signalframeux",
    "importName": "SFContainer",
    "props": [
      {
        "name": "width",
        "type": "any",
        "default": "",
        "desc": "Max-width variant. \"wide\" | \"content\" | \"full\""
      },
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Merged via cn() after variant classes"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFContainer width=\"content\">\n  <SFText variant=\"body\">Readable prose column</SFText>\n</SFContainer>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFSection": {
    "id": "SFSection",
    "name": "SFSection",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SEMANTIC PAGE SECTION — FRAME LAYER LAYOUT PRIMITIVE. RENDERS A `<SECTION>` WITH DATA-SECTION ALWAYS PRESENT. APPLIES SPACING VARIANT MAPPED TO BLESSED STOPS. SUPPORTS OPTIONAL DATA-SECTION-LABEL (CSS ::BEFORE CONTENT) AND DATA-BG-SHIFT (SCROLL-TRIGGERED BACKGROUND TOGGLE VIA GSAP).",
    "importPath": "signalframeux",
    "importName": "SFSection",
    "props": [
      {
        "name": "label",
        "type": "any",
        "default": "",
        "desc": "Optional label string applied as data-section-label"
      },
      {
        "name": "bgShift",
        "type": "any",
        "default": "",
        "desc": "Background shift value for GSAP scroll targeting. \"white\" or \"black\"."
      },
      {
        "name": "spacing",
        "type": "any",
        "default": "",
        "desc": "Vertical padding from blessed stops. \"8\" | \"12\" | \"16\" | \"24\""
      },
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Merged via cn() after spacing class"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFSection label=\"Work\" spacing=\"24\" bgShift=\"white\">\n  <SFContainer>Content here</SFContainer>\n</SFSection>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFStack": {
    "id": "SFStack",
    "name": "SFStack",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "VERTICAL RHYTHM CONTAINER — FRAME LAYER LAYOUT PRIMITIVE. FLEX CONTAINER WITH GAP VARIANTS MAPPED TO BLESSED SPACING STOPS. DEFAULTS TO VERTICAL COLUMN LAYOUT WITH STRETCH ALIGNMENT. USE DIRECTION=\"HORIZONTAL\" FOR INLINE/ROW ARRANGEMENTS.",
    "importPath": "signalframeux",
    "importName": "SFStack",
    "props": [
      {
        "name": "direction",
        "type": "any",
        "default": "",
        "desc": "Flex direction. \"vertical\" | \"horizontal\""
      },
      {
        "name": "gap",
        "type": "any",
        "default": "",
        "desc": "Gap between children, maps to blessed stops. \"1\" | \"2\" | \"3\" | \"4\" | \"6\" | \"8\" | \"12\" | \"16\" | \"24\""
      },
      {
        "name": "align",
        "type": "any",
        "default": "",
        "desc": "Flex alignment. \"start\" | \"center\" | \"end\" | \"stretch\""
      },
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Merged via cn() after variant classes"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFStack gap=\"8\" align=\"start\">\n  <SFText variant=\"heading-2\">Title</SFText>\n  <SFText variant=\"body\">Description</SFText>\n</SFStack>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFGrid": {
    "id": "SFGrid",
    "name": "SFGrid",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "RESPONSIVE COLUMN GRID — FRAME LAYER LAYOUT PRIMITIVE. CSS GRID CONTAINER WITH RESPONSIVE BREAKPOINT BEHAVIOR BUILT INTO THE COLS VARIANT. EACH VALUE ENCODES MOBILE-FIRST COLUMN PROGRESSION (E.G., COLS=\"3\" RENDERS 1 COL → 2 COL → 3 COL ACROSS BREAKPOINTS).",
    "importPath": "signalframeux",
    "importName": "SFGrid",
    "props": [
      {
        "name": "cols",
        "type": "any",
        "default": "",
        "desc": "Column count with built-in responsive scaling. \"1\" | \"2\" | \"3\" | \"4\" | \"auto\""
      },
      {
        "name": "gap",
        "type": "any",
        "default": "",
        "desc": "Grid gap from blessed stops. \"4\" | \"6\" | \"8\""
      },
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Merged via cn() after variant classes"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFGrid cols=\"3\" gap=\"6\">\n  <SFCard>Item 1</SFCard>\n  <SFCard>Item 2</SFCard>\n  <SFCard>Item 3</SFCard>\n</SFGrid>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFText": {
    "id": "SFText",
    "name": "SFText",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SEMANTIC TEXT PRIMITIVE — FRAME LAYER TYPOGRAPHY ENFORCER. MAPS SEMANTIC VARIANTS TO TYPOGRAPHY ALIAS CLASSES (TEXT-HEADING-1 ETC.) DEFINED IN GLOBALS.CSS. DEFAULTS TO THE APPROPRIATE HTML ELEMENT FOR EACH VARIANT (H1/H2/H3 FOR HEADINGS, P FOR BODY, SPAN FOR SMALL) BUT ACCEPTS `AS` FOR OVERRIDE. POLYMORPHIC — REF IS CAST TO REACT.REF<ANY> PER TYPESCRIPT FORWARDREF POLYMORPHIC LIMITATION.",
    "importPath": "signalframeux",
    "importName": "SFText",
    "props": [
      {
        "name": "variant",
        "type": "any",
        "default": "",
        "desc": "Semantic text style. \"heading-1\" | \"heading-2\" | \"heading-3\" | \"body\" | \"small\""
      },
      {
        "name": "as",
        "type": "any",
        "default": "",
        "desc": "Override rendered element tag. Defaults: h1/h2/h3/p/span per variant"
      },
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Merged via cn() after variant class"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFText variant=\"heading-1\">Signal Frame</SFText>\n<SFText variant=\"body\" as=\"span\">Inline body text</SFText>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFButton": {
    "id": "SFButton",
    "name": "SFButton",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "PRIMARY ACTION BUTTON — FRAME LAYER INTERACTIVE PRIMITIVE. ENFORCES SF BUTTON CONTRACT: FONT-MONO, UPPERCASE, 2PX BORDER, ASYMMETRIC HOVER TIMING (100MS IN / 400MS OUT), AND PRESS TRANSFORM VIA .SF-PRESSABLE. \"SIGNAL\" INTENT USES PRIMARY BORDER ACCENT — USE FOR BRAND-LEVEL CTAS ONLY.",
    "importPath": "signalframeux",
    "importName": "SFButton",
    "props": [
      {
        "name": "intent",
        "type": "any",
        "default": "",
        "desc": "Visual variant. \"primary\" | \"ghost\" | \"signal\""
      },
      {
        "name": "size",
        "type": "any",
        "default": "",
        "desc": "Height and padding scale. \"sm\" | \"md\" | \"lg\" | \"xl\""
      },
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Merged via cn() — appended, never replaces base classes"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFButton intent=\"primary\" size=\"md\">Launch</SFButton>\n<SFButton intent=\"ghost\" size=\"sm\" onClick={handleCancel}>Cancel</SFButton>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFCard": {
    "id": "SFCard",
    "name": "SFCard",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "CONTENT SURFACE CARD — FRAME LAYER CONTAINER PRIMITIVE. RENDERS A BORDERED CARD WITH 2PX FOREGROUND BORDER AND NO SHADOW (SF AESTHETIC CONTRACT: NO ELEVATION, ONLY EDGE DEFINITION). SUPPORTS OPTIONAL HOVER COLOR TRANSITION AND SIGNAL-LAYER BORDERDRAW ANIMATION.",
    "importPath": "signalframeux",
    "importName": "SFCard",
    "props": [
      {
        "name": "hoverable",
        "type": "any",
        "default": "",
        "desc": "Enables hover border color transition to primary"
      },
      {
        "name": "borderDraw",
        "type": "any",
        "default": "",
        "desc": "Replaces color hover with SIGNAL borderDraw animation (clockwise magenta stroke)"
      },
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Merged via cn() after base classes"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFCard hoverable>\n  <SFCardHeader><SFCardTitle>Project Alpha</SFCardTitle></SFCardHeader>\n  <SFCardContent>Description text</SFCardContent>\n</SFCard>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFCardHeader": {
    "id": "SFCardHeader",
    "name": "SFCardHeader",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFCARD — RENDERS THE CARD HEADER REGION WITH REDUCED BOTTOM PADDING.",
    "importPath": "signalframeux",
    "importName": "SFCardHeader",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFCardHeader><SFCardTitle>Project Alpha</SFCardTitle></SFCardHeader>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFCardTitle": {
    "id": "SFCardTitle",
    "name": "SFCardTitle",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFCARD — RENDERS THE CARD TITLE IN FONT-MONO UPPERCASE.",
    "importPath": "signalframeux",
    "importName": "SFCardTitle",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFCardTitle>Project Alpha</SFCardTitle>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFCardDescription": {
    "id": "SFCardDescription",
    "name": "SFCardDescription",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFCARD — RENDERS THE CARD DESCRIPTION IN MUTED FOREGROUND AT TEXT-XS.",
    "importPath": "signalframeux",
    "importName": "SFCardDescription",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFCardDescription>Updated 2 days ago</SFCardDescription>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFCardContent": {
    "id": "SFCardContent",
    "name": "SFCardContent",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFCARD — RENDERS THE MAIN CARD BODY CONTENT REGION WITH P-4 PADDING.",
    "importPath": "signalframeux",
    "importName": "SFCardContent",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFCardContent>Body text or nested components go here.</SFCardContent>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFCardFooter": {
    "id": "SFCardFooter",
    "name": "SFCardFooter",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFCARD — RENDERS THE CARD FOOTER REGION, FLUSH BOTTOM WITH NO TOP GAP.",
    "importPath": "signalframeux",
    "importName": "SFCardFooter",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFCardFooter><SFButton size=\"sm\">View Details</SFButton></SFCardFooter>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFInput": {
    "id": "SFInput",
    "name": "SFInput",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "TEXT INPUT FIELD — FRAME LAYER FORM PRIMITIVE. ENFORCES SF INPUT CONTRACT: FONT-MONO, UPPERCASE, 2PX FOREGROUND BORDER, SF-FOCUSABLE KEYBOARD INDICATOR, AND SF-BORDER-DRAW-FOCUS FOR SIGNAL-LAYER FOCUS ANIMATION. PLACEHOLDER INHERITS UPPERCASE AND TRACKING STYLES.",
    "importPath": "signalframeux",
    "importName": "SFInput",
    "props": [
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Merged via cn() after base classes"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFInput placeholder=\"Enter value\" />\n<SFInput type=\"email\" placeholder=\"you@studio.com\" />"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFBadge": {
    "id": "SFBadge",
    "name": "SFBadge",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "STATUS INDICATOR BADGE — FRAME LAYER LABEL PRIMITIVE. RENDERS A SMALL MONOSPACE UPPERCASE BADGE. ENFORCES 2PX BORDER, FONT-MONO, UPPERCASE, AND TRACKING-WIDER ACROSS ALL INTENTS. \"SIGNAL\" USES SF-YELLOW ACCENT — USE SPARINGLY.",
    "importPath": "signalframeux",
    "importName": "SFBadge",
    "props": [
      {
        "name": "intent",
        "type": "any",
        "default": "",
        "desc": "Visual variant. \"default\" | \"primary\" | \"outline\" | \"signal\""
      },
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Merged via cn() after variant classes"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFBadge intent=\"primary\">Active</SFBadge>\n<SFBadge intent=\"outline\">Draft</SFBadge>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFTabs": {
    "id": "SFTabs",
    "name": "SFTabs",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "TABBED INTERFACE — FRAME LAYER NAVIGATION PRIMITIVE. RADIX TABS ROOT WRAPPED WITH SF CONTRACT. COMPOSE WITH SFTABSLIST, SFTABSTRIGGER, AND SFTABSCONTENT FOR A FULL TAB INTERFACE. TRIGGERS USE UNDERLINE ACTIVE INDICATOR (BORDER-B-2) NOT BACKGROUND FILL, WITH MUTED → FOREGROUND COLOR TRANSITION ON HOVER.",
    "importPath": "signalframeux",
    "importName": "SFTabs",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFTabs defaultValue=\"overview\">\n  <SFTabsList>\n    <SFTabsTrigger value=\"overview\">Overview</SFTabsTrigger>\n    <SFTabsTrigger value=\"specs\">Specs</SFTabsTrigger>\n  </SFTabsList>\n  <SFTabsContent value=\"overview\">Content here</SFTabsContent>\n</SFTabs>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFTabsList": {
    "id": "SFTabsList",
    "name": "SFTabsList",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFTABS — TAB NAVIGATION BAR WITH 2PX BOTTOM BORDER AND NO PADDING.",
    "importPath": "signalframeux",
    "importName": "SFTabsList",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFTabsList><SFTabsTrigger value=\"a\">Tab A</SFTabsTrigger></SFTabsList>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFTabsTrigger": {
    "id": "SFTabsTrigger",
    "name": "SFTabsTrigger",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFTABS — TAB BUTTON WITH UNDERLINE ACTIVE INDICATOR AND MONO UPPERCASE TYPE.",
    "importPath": "signalframeux",
    "importName": "SFTabsTrigger",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFTabsTrigger value=\"overview\">Overview</SFTabsTrigger>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFTabsContent": {
    "id": "SFTabsContent",
    "name": "SFTabsContent",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFTABS — CONTENT PANEL SHOWN WHEN ITS MATCHING TAB TRIGGER IS ACTIVE.",
    "importPath": "signalframeux",
    "importName": "SFTabsContent",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFTabsContent value=\"overview\">Overview content here</SFTabsContent>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFSeparator": {
    "id": "SFSeparator",
    "name": "SFSeparator",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "VISUAL DIVIDER — FRAME LAYER STRUCTURAL PRIMITIVE. RADIX SEPARATOR WITH SF FOREGROUND COLOR AND THREE WEIGHT VARIANTS MAPPED TO BORDER TOKEN VALUES. SUPPORTS BOTH HORIZONTAL (DEFAULT) AND VERTICAL ORIENTATION.",
    "importPath": "signalframeux",
    "importName": "SFSeparator",
    "props": [
      {
        "name": "orientation",
        "type": "any",
        "default": "",
        "desc": "Layout direction. \"horizontal\" | \"vertical\""
      },
      {
        "name": "weight",
        "type": "any",
        "default": "",
        "desc": "Line thickness variant. \"thin\" | \"normal\" | \"heavy\""
      },
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Merged via cn() after weight/orientation classes"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFSeparator weight=\"normal\" />\n<SFSeparator orientation=\"vertical\" weight=\"thin\" className=\"h-6\" />"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFTable": {
    "id": "SFTable",
    "name": "SFTable",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "DATA TABLE — FRAME LAYER DATA PRIMITIVE. SEMANTICALLY CORRECT HTML TABLE WITH SF STYLING: FONT-MONO AT TEXT-XS AND 2PX FOREGROUND OUTER BORDER. COMPOSE WITH SFTABLEHEADER, SFTABLEBODY, SFTABLEROW, SFTABLEHEAD, AND SFTABLECELL FOR FULL TABLE STRUCTURE.",
    "importPath": "signalframeux",
    "importName": "SFTable",
    "props": [
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Merged via cn() after base classes"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFTable>\n  <SFTableHeader><SFTableRow><SFTableHead>Name</SFTableHead></SFTableRow></SFTableHeader>\n  <SFTableBody><SFTableRow><SFTableCell>Alice</SFTableCell></SFTableRow></SFTableBody>\n</SFTable>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFTableHeader": {
    "id": "SFTableHeader",
    "name": "SFTableHeader",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFTABLE — INVERTED HEADER ROW (FOREGROUND BACKGROUND, BACKGROUND TEXT).",
    "importPath": "signalframeux",
    "importName": "SFTableHeader",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFTableHeader><SFTableRow><SFTableHead>Name</SFTableHead></SFTableRow></SFTableHeader>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFTableHead": {
    "id": "SFTableHead",
    "name": "SFTableHead",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFTABLE — COLUMN HEADING CELL IN UPPERCASE TRACKING-WIDER AT TEXT-XS.",
    "importPath": "signalframeux",
    "importName": "SFTableHead",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFTableHead>Status</SFTableHead>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFTableBody": {
    "id": "SFTableBody",
    "name": "SFTableBody",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFTABLE — TABLE BODY CONTAINER WRAPPING ALL DATA ROWS.",
    "importPath": "signalframeux",
    "importName": "SFTableBody",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFTableBody><SFTableRow><SFTableCell>Data</SFTableCell></SFTableRow></SFTableBody>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFTableRow": {
    "id": "SFTableRow",
    "name": "SFTableRow",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFTABLE — TABLE ROW WITH MUTED BORDER AND SUBTLE HOVER BACKGROUND.",
    "importPath": "signalframeux",
    "importName": "SFTableRow",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFTableRow><SFTableCell>Alice</SFTableCell></SFTableRow>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFTableCell": {
    "id": "SFTableCell",
    "name": "SFTableCell",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFTABLE — DATA CELL WITH CONSISTENT PX-3 PY-2 PADDING.",
    "importPath": "signalframeux",
    "importName": "SFTableCell",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFTableCell>alice@example.com</SFTableCell>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFTooltip": {
    "id": "SFTooltip",
    "name": "SFTooltip",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "HOVER TOOLTIP — FRAME LAYER CONTEXTUAL PRIMITIVE. RADIX TOOLTIP ROOT WRAPPED WITH SF CONTRACT. COMPOSE WITH SFTOOLTIPTRIGGER AND SFTOOLTIPCONTENT FOR FULL TOOLTIP BEHAVIOR. CONTENT RENDERS INVERTED (FOREGROUND BG, BACKGROUND TEXT) IN FONT-MONO UPPERCASE WITH NO BORDER OR BORDER-RADIUS.",
    "importPath": "signalframeux",
    "importName": "SFTooltip",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFTooltip>\n  <SFTooltipTrigger asChild><SFButton size=\"sm\">?</SFButton></SFTooltipTrigger>\n  <SFTooltipContent>Keyboard shortcut: ⌘K</SFTooltipContent>\n</SFTooltip>"
      }
    ],
    "a11y": [
      "KEYBOARD ACCESSIBLE VIA FOCUS",
      "ARIA ROLE=TOOLTIP APPLIED BY RADIX"
    ]
  },
  "SFTooltipContent": {
    "id": "SFTooltipContent",
    "name": "SFTooltipContent",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFTOOLTIP — FLOATING LABEL IN INVERTED MONO UPPERCASE WITH NO BORDER OR RADIUS.",
    "importPath": "signalframeux",
    "importName": "SFTooltipContent",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFTooltipContent>Keyboard shortcut: ⌘K</SFTooltipContent>"
      }
    ],
    "a11y": [
      "KEYBOARD ACCESSIBLE VIA FOCUS",
      "ARIA ROLE=TOOLTIP APPLIED BY RADIX"
    ]
  },
  "SFTooltipTrigger": {
    "id": "SFTooltipTrigger",
    "name": "SFTooltipTrigger",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFTOOLTIP — TRIGGER ELEMENT THAT SHOWS THE TOOLTIP ON HOVER/FOCUS.",
    "importPath": "signalframeux",
    "importName": "SFTooltipTrigger",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFTooltipTrigger asChild><SFButton size=\"sm\">?</SFButton></SFTooltipTrigger>"
      }
    ],
    "a11y": [
      "KEYBOARD ACCESSIBLE VIA FOCUS",
      "ARIA ROLE=TOOLTIP APPLIED BY RADIX"
    ]
  },
  "SFDialog": {
    "id": "SFDialog",
    "name": "SFDialog",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "MODAL DIALOG — FRAME LAYER OVERLAY PRIMITIVE. RADIX DIALOG ROOT WRAPPED WITH SF CONTRACT. COMPOSE WITH SFDIALOGTRIGGER, SFDIALOGCONTENT, SFDIALOGHEADER, SFDIALOGTITLE, SFDIALOGDESCRIPTION, SFDIALOGFOOTER, AND SFDIALOGCLOSE. CONTENT APPLIES SHARP CORNERS, 2PX BORDER, NO SHADOW.",
    "importPath": "signalframeux",
    "importName": "SFDialog",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFDialog>\n  <SFDialogTrigger asChild><SFButton>Open</SFButton></SFDialogTrigger>\n  <SFDialogContent>\n    <SFDialogHeader><SFDialogTitle>Confirm</SFDialogTitle></SFDialogHeader>\n  </SFDialogContent>\n</SFDialog>"
      }
    ],
    "a11y": [
      "FOCUS TRAPPED WITHIN DIALOG WHEN OPEN",
      "ESC KEY CLOSES THE DIALOG",
      "ARIA ROLE=DIALOG APPLIED BY RADIX"
    ]
  },
  "SFDialogTrigger": {
    "id": "SFDialogTrigger",
    "name": "SFDialogTrigger",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFDIALOG — TRIGGER ELEMENT THAT OPENS THE DIALOG ON INTERACTION.",
    "importPath": "signalframeux",
    "importName": "SFDialogTrigger",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFDialogTrigger asChild><SFButton>Open</SFButton></SFDialogTrigger>"
      }
    ],
    "a11y": [
      "FOCUS TRAPPED WITHIN DIALOG WHEN OPEN",
      "ESC KEY CLOSES THE DIALOG",
      "ARIA ROLE=DIALOG APPLIED BY RADIX"
    ]
  },
  "SFDialogClose": {
    "id": "SFDialogClose",
    "name": "SFDialogClose",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFDIALOG — CLOSE BUTTON THAT DISMISSES THE DIALOG WHEN ACTIVATED.",
    "importPath": "signalframeux",
    "importName": "SFDialogClose",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFDialogClose asChild><SFButton intent=\"ghost\">Cancel</SFButton></SFDialogClose>"
      }
    ],
    "a11y": [
      "FOCUS TRAPPED WITHIN DIALOG WHEN OPEN",
      "ESC KEY CLOSES THE DIALOG",
      "ARIA ROLE=DIALOG APPLIED BY RADIX"
    ]
  },
  "SFDialogContent": {
    "id": "SFDialogContent",
    "name": "SFDialogContent",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFDIALOG — MODAL CONTENT PANEL WITH SHARP CORNERS, 2PX BORDER, AND NO SHADOW.",
    "importPath": "signalframeux",
    "importName": "SFDialogContent",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFDialogContent><SFDialogHeader><SFDialogTitle>Title</SFDialogTitle></SFDialogHeader></SFDialogContent>"
      }
    ],
    "a11y": [
      "FOCUS TRAPPED WITHIN DIALOG WHEN OPEN",
      "ESC KEY CLOSES THE DIALOG",
      "ARIA ROLE=DIALOG APPLIED BY RADIX"
    ]
  },
  "SFDialogHeader": {
    "id": "SFDialogHeader",
    "name": "SFDialogHeader",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFDIALOG — HEADER REGION WITH 2PX BOTTOM BORDER SEPARATING IT FROM CONTENT.",
    "importPath": "signalframeux",
    "importName": "SFDialogHeader",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFDialogHeader><SFDialogTitle>Confirm Action</SFDialogTitle></SFDialogHeader>"
      }
    ],
    "a11y": [
      "FOCUS TRAPPED WITHIN DIALOG WHEN OPEN",
      "ESC KEY CLOSES THE DIALOG",
      "ARIA ROLE=DIALOG APPLIED BY RADIX"
    ]
  },
  "SFDialogFooter": {
    "id": "SFDialogFooter",
    "name": "SFDialogFooter",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFDIALOG — FOOTER REGION WITH 2PX TOP BORDER AND MUTED BACKGROUND FOR ACTION BUTTONS.",
    "importPath": "signalframeux",
    "importName": "SFDialogFooter",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFDialogFooter><SFButton>Save</SFButton></SFDialogFooter>"
      }
    ],
    "a11y": [
      "FOCUS TRAPPED WITHIN DIALOG WHEN OPEN",
      "ESC KEY CLOSES THE DIALOG",
      "ARIA ROLE=DIALOG APPLIED BY RADIX"
    ]
  },
  "SFDialogTitle": {
    "id": "SFDialogTitle",
    "name": "SFDialogTitle",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFDIALOG — DIALOG TITLE IN FONT-MONO UPPERCASE WITH LETTER-SPACING.",
    "importPath": "signalframeux",
    "importName": "SFDialogTitle",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFDialogTitle>Confirm Deletion</SFDialogTitle>"
      }
    ],
    "a11y": [
      "FOCUS TRAPPED WITHIN DIALOG WHEN OPEN",
      "ESC KEY CLOSES THE DIALOG",
      "ARIA ROLE=DIALOG APPLIED BY RADIX"
    ]
  },
  "SFDialogDescription": {
    "id": "SFDialogDescription",
    "name": "SFDialogDescription",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFDIALOG — SUPPORTING DESCRIPTION TEXT IN MUTED FOREGROUND, UPPERCASE, XS SIZE.",
    "importPath": "signalframeux",
    "importName": "SFDialogDescription",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFDialogDescription>This action cannot be undone.</SFDialogDescription>"
      }
    ],
    "a11y": [
      "FOCUS TRAPPED WITHIN DIALOG WHEN OPEN",
      "ESC KEY CLOSES THE DIALOG",
      "ARIA ROLE=DIALOG APPLIED BY RADIX"
    ]
  },
  "SFSheet": {
    "id": "SFSheet",
    "name": "SFSheet",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SLIDE-OUT PANEL — FRAME LAYER OVERLAY PRIMITIVE. RADIX SHEET ROOT WRAPPED WITH SF CONTRACT. COMPOSE WITH SFSHEETTRIGGER, SFSHEETCONTENT, SFSHEETHEADER, SFSHEETTITLE, SFSHEETDESCRIPTION, SFSHEETFOOTER, AND SFSHEETCLOSE. CONTENT SLIDES IN FROM THE EDGE WITH SHARP CORNERS AND 2PX BORDER.",
    "importPath": "signalframeux",
    "importName": "SFSheet",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFSheet>\n  <SFSheetTrigger asChild><SFButton>Open Panel</SFButton></SFSheetTrigger>\n  <SFSheetContent side=\"right\">\n    <SFSheetHeader><SFSheetTitle>Settings</SFSheetTitle></SFSheetHeader>\n  </SFSheetContent>\n</SFSheet>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFSheetTrigger": {
    "id": "SFSheetTrigger",
    "name": "SFSheetTrigger",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFSHEET — TRIGGER ELEMENT THAT OPENS THE SLIDE-OUT PANEL ON INTERACTION.",
    "importPath": "signalframeux",
    "importName": "SFSheetTrigger",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFSheetTrigger asChild><SFButton>Open Panel</SFButton></SFSheetTrigger>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFSheetClose": {
    "id": "SFSheetClose",
    "name": "SFSheetClose",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFSHEET — CLOSE CONTROL THAT DISMISSES THE PANEL WHEN ACTIVATED.",
    "importPath": "signalframeux",
    "importName": "SFSheetClose",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFSheetClose asChild><SFButton intent=\"ghost\">Close</SFButton></SFSheetClose>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFSheetContent": {
    "id": "SFSheetContent",
    "name": "SFSheetContent",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFSHEET — SLIDE-OUT CONTENT PANEL WITH SHARP CORNERS, 2PX BORDER, AND NO SHADOW.",
    "importPath": "signalframeux",
    "importName": "SFSheetContent",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFSheetContent side=\"right\"><SFSheetHeader><SFSheetTitle>Settings</SFSheetTitle></SFSheetHeader></SFSheetContent>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFSheetHeader": {
    "id": "SFSheetHeader",
    "name": "SFSheetHeader",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFSHEET — HEADER REGION WITH 2PX BOTTOM BORDER SEPARATING IT FROM BODY CONTENT.",
    "importPath": "signalframeux",
    "importName": "SFSheetHeader",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFSheetHeader><SFSheetTitle>Settings</SFSheetTitle></SFSheetHeader>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFSheetFooter": {
    "id": "SFSheetFooter",
    "name": "SFSheetFooter",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFSHEET — FOOTER REGION WITH 2PX TOP BORDER AND MUTED BACKGROUND FOR ACTION BUTTONS.",
    "importPath": "signalframeux",
    "importName": "SFSheetFooter",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFSheetFooter><SFButton>Apply</SFButton></SFSheetFooter>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFSheetTitle": {
    "id": "SFSheetTitle",
    "name": "SFSheetTitle",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFSHEET — SHEET TITLE IN FONT-MONO UPPERCASE WITH LETTER-SPACING.",
    "importPath": "signalframeux",
    "importName": "SFSheetTitle",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFSheetTitle>Preferences</SFSheetTitle>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFSheetDescription": {
    "id": "SFSheetDescription",
    "name": "SFSheetDescription",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFSHEET — SUPPORTING DESCRIPTION TEXT IN MUTED FOREGROUND, UPPERCASE, XS SIZE.",
    "importPath": "signalframeux",
    "importName": "SFSheetDescription",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFSheetDescription>Adjust your display preferences.</SFSheetDescription>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFDropdownMenu": {
    "id": "SFDropdownMenu",
    "name": "SFDropdownMenu",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "CONTEXT MENU — FRAME LAYER DROPDOWN NAVIGATION PRIMITIVE. RADIX DROPDOWNMENU ROOT WRAPPED WITH SF CONTRACT. COMPOSE WITH SFDROPDOWNMENUTRIGGER, SFDROPDOWNMENUCONTENT, SFDROPDOWNMENUGROUP, SFDROPDOWNMENUITEM, SFDROPDOWNMENULABEL, SFDROPDOWNMENUSEPARATOR, AND SFDROPDOWNMENUSHORTCUT FOR FULL CONTEXT MENU BEHAVIOR.",
    "importPath": "signalframeux",
    "importName": "SFDropdownMenu",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFDropdownMenu>\n  <SFDropdownMenuTrigger asChild><SFButton>Options</SFButton></SFDropdownMenuTrigger>\n  <SFDropdownMenuContent>\n    <SFDropdownMenuItem>Edit</SFDropdownMenuItem>\n    <SFDropdownMenuSeparator />\n    <SFDropdownMenuItem>Delete</SFDropdownMenuItem>\n  </SFDropdownMenuContent>\n</SFDropdownMenu>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFDropdownMenuTrigger": {
    "id": "SFDropdownMenuTrigger",
    "name": "SFDropdownMenuTrigger",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFDROPDOWNMENU — TRIGGER ELEMENT THAT OPENS THE DROPDOWN ON CLICK.",
    "importPath": "signalframeux",
    "importName": "SFDropdownMenuTrigger",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFDropdownMenuTrigger asChild><SFButton>Options</SFButton></SFDropdownMenuTrigger>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFDropdownMenuContent": {
    "id": "SFDropdownMenuContent",
    "name": "SFDropdownMenuContent",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFDROPDOWNMENU — FLOATING CONTENT PANEL WITH SHARP CORNERS, 2PX BORDER, AND NO SHADOW.",
    "importPath": "signalframeux",
    "importName": "SFDropdownMenuContent",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFDropdownMenuContent><SFDropdownMenuItem>Edit</SFDropdownMenuItem></SFDropdownMenuContent>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFDropdownMenuGroup": {
    "id": "SFDropdownMenuGroup",
    "name": "SFDropdownMenuGroup",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFDROPDOWNMENU — GROUPS RELATED ITEMS WITH A MONO UPPERCASE LABEL HEADING.",
    "importPath": "signalframeux",
    "importName": "SFDropdownMenuGroup",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFDropdownMenuGroup><SFDropdownMenuLabel>File</SFDropdownMenuLabel><SFDropdownMenuItem>New</SFDropdownMenuItem></SFDropdownMenuGroup>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFDropdownMenuItem": {
    "id": "SFDropdownMenuItem",
    "name": "SFDropdownMenuItem",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFDROPDOWNMENU — SELECTABLE MENU ITEM; INVERTS COLORS ON FOCUS/HOVER.",
    "importPath": "signalframeux",
    "importName": "SFDropdownMenuItem",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFDropdownMenuItem onSelect={() => handleEdit()}>Edit</SFDropdownMenuItem>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFDropdownMenuLabel": {
    "id": "SFDropdownMenuLabel",
    "name": "SFDropdownMenuLabel",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFDROPDOWNMENU — NON-INTERACTIVE SECTION LABEL IN MUTED FOREGROUND AT XS SIZE.",
    "importPath": "signalframeux",
    "importName": "SFDropdownMenuLabel",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFDropdownMenuLabel>File Actions</SFDropdownMenuLabel>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFDropdownMenuSeparator": {
    "id": "SFDropdownMenuSeparator",
    "name": "SFDropdownMenuSeparator",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFDROPDOWNMENU — FULL-WIDTH FOREGROUND RULE SEPARATING MENU SECTIONS.",
    "importPath": "signalframeux",
    "importName": "SFDropdownMenuSeparator",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFDropdownMenuSeparator />"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFDropdownMenuShortcut": {
    "id": "SFDropdownMenuShortcut",
    "name": "SFDropdownMenuShortcut",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFDROPDOWNMENU — KEYBOARD SHORTCUT HINT IN MONO UPPERCASE, RIGHT-ALIGNED IN ITEM.",
    "importPath": "signalframeux",
    "importName": "SFDropdownMenuShortcut",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFDropdownMenuItem>Save<SFDropdownMenuShortcut>⌘S</SFDropdownMenuShortcut></SFDropdownMenuItem>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFToggle": {
    "id": "SFToggle",
    "name": "SFToggle",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "PRESSABLE TOGGLE BUTTON — FRAME LAYER INTERACTIVE PRIMITIVE. RADIX TOGGLE WITH SF STYLING: SHARP CORNERS, 2PX BORDER, SF-PRESSABLE PRESS TRANSFORM, AND INVERTED FILL ON ACTIVE STATE. USE FOR BINARY ON/OFF CONTROLS LIKE FILTER CHIPS OR VIEW MODE SWITCHES.",
    "importPath": "signalframeux",
    "importName": "SFToggle",
    "props": [
      {
        "name": "intent",
        "type": "any",
        "default": "",
        "desc": "Visual variant. \"default\" | \"primary\""
      },
      {
        "name": "size",
        "type": "any",
        "default": "",
        "desc": "Height and padding scale. \"sm\" | \"md\" | \"lg\""
      },
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Merged via cn() after variant classes"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFToggle intent=\"default\" size=\"md\">Grid</SFToggle>\n<SFToggle intent=\"primary\" pressed>Active</SFToggle>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFSlider": {
    "id": "SFSlider",
    "name": "SFSlider",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "RANGE INPUT SLIDER — FRAME LAYER FORM PRIMITIVE. RADIX SLIDER WITH SF STYLING: SQUARE TRACK (3PX HEIGHT), PRIMARY FILL FOR THE ACTIVE RANGE, AND A SQUARE THUMB WITH SF-FOCUSABLE INDICATOR AND 2PX FOREGROUND BORDER. INHERITS ALL RADIX SLIDERPROPS.",
    "importPath": "signalframeux",
    "importName": "SFSlider",
    "props": [
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Merged via cn() after base slot-targeting classes"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFSlider defaultValue={[50]} min={0} max={100} step={1} />\n<SFSlider defaultValue={[20, 80]} min={0} max={100} />"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFCommand": {
    "id": "SFCommand",
    "name": "SFCommand",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "COMMAND PALETTE — FRAME LAYER SEARCH/NAVIGATION PRIMITIVE. RADIX COMMAND WRAPPED WITH SF STYLING: SHARP CORNERS, 2PX FOREGROUND BORDER, DARK BACKGROUND. COMPOSE WITH SFCOMMANDINPUT, SFCOMMANDLIST, SFCOMMANDGROUP, AND SFCOMMANDITEM FOR FULL PALETTE FUNCTIONALITY.",
    "importPath": "signalframeux",
    "importName": "SFCommand",
    "props": [
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Merged via cn() after base classes"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFCommand>\n  <SFCommandInput placeholder=\"Search...\" />\n  <SFCommandList>\n    <SFCommandGroup heading=\"Actions\">\n      <SFCommandItem>Open file</SFCommandItem>\n    </SFCommandGroup>\n  </SFCommandList>\n</SFCommand>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFCommandDialog": {
    "id": "SFCommandDialog",
    "name": "SFCommandDialog",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFCOMMAND — MODAL DIALOG WRAPPER FOR COMMAND PALETTE OVERLAY USAGE.",
    "importPath": "signalframeux",
    "importName": "SFCommandDialog",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFCommandDialog open={open} onOpenChange={setOpen}><SFCommandInput placeholder=\"Search...\" /></SFCommandDialog>"
      }
    ],
    "a11y": [
      "FOCUS TRAPPED WITHIN DIALOG WHEN OPEN",
      "ESC KEY CLOSES THE DIALOG",
      "ARIA ROLE=DIALOG APPLIED BY RADIX"
    ]
  },
  "SFCommandInput": {
    "id": "SFCommandInput",
    "name": "SFCommandInput",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFCOMMAND — SEARCH INPUT RENDERED IN FONT-MONO UPPERCASE.",
    "importPath": "signalframeux",
    "importName": "SFCommandInput",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFCommandInput placeholder=\"Search commands...\" />"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFCommandList": {
    "id": "SFCommandList",
    "name": "SFCommandList",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFCOMMAND — SCROLLABLE RESULTS LIST CONTAINER IN FONT-MONO.",
    "importPath": "signalframeux",
    "importName": "SFCommandList",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFCommandList><SFCommandGroup heading=\"Actions\"><SFCommandItem>Open</SFCommandItem></SFCommandGroup></SFCommandList>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFCommandEmpty": {
    "id": "SFCommandEmpty",
    "name": "SFCommandEmpty",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFCOMMAND — EMPTY STATE MESSAGE SHOWN WHEN NO RESULTS MATCH THE QUERY.",
    "importPath": "signalframeux",
    "importName": "SFCommandEmpty",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFCommandEmpty>No results found.</SFCommandEmpty>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFCommandGroup": {
    "id": "SFCommandGroup",
    "name": "SFCommandGroup",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFCOMMAND — LABELED GROUP OF RELATED COMMAND ITEMS WITH MONO UPPERCASE HEADING.",
    "importPath": "signalframeux",
    "importName": "SFCommandGroup",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFCommandGroup heading=\"Navigation\"><SFCommandItem>Go to dashboard</SFCommandItem></SFCommandGroup>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFCommandItem": {
    "id": "SFCommandItem",
    "name": "SFCommandItem",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFCOMMAND — SELECTABLE COMMAND ITEM; HIGHLIGHTS WITH INVERTED COLORS ON SELECTION.",
    "importPath": "signalframeux",
    "importName": "SFCommandItem",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFCommandItem onSelect={() => router.push('/dashboard')}>Dashboard</SFCommandItem>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFCommandSeparator": {
    "id": "SFCommandSeparator",
    "name": "SFCommandSeparator",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFCOMMAND — FULL-WIDTH FOREGROUND-COLORED RULE DIVIDING COMMAND GROUPS.",
    "importPath": "signalframeux",
    "importName": "SFCommandSeparator",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFCommandSeparator />"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFCommandShortcut": {
    "id": "SFCommandShortcut",
    "name": "SFCommandShortcut",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFCOMMAND — KEYBOARD SHORTCUT LABEL RENDERED IN MONO UPPERCASE, RIGHT-ALIGNED.",
    "importPath": "signalframeux",
    "importName": "SFCommandShortcut",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFCommandItem>New File<SFCommandShortcut>⌘N</SFCommandShortcut></SFCommandItem>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFSkeleton": {
    "id": "SFSkeleton",
    "name": "SFSkeleton",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "LOADING PLACEHOLDER — FRAME LAYER STATE PRIMITIVE. RENDERS AN ACCESSIBLE SKELETON BLOCK WITH ARIA ROLE=\"STATUS\" AND A CUSTOM SF-SKELETON SHIMMER ANIMATION (NO ROUNDED CORNERS). USE TO REPRESENT CONTENT LOADING STATES IN PLACE OF ACTUAL CONTENT.",
    "importPath": "signalframeux",
    "importName": "SFSkeleton",
    "props": [
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Merged via cn() — set width/height to match target content shape"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFSkeleton className=\"h-4 w-48\" />\n<SFSkeleton className=\"h-32 w-full\" />"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFPopover": {
    "id": "SFPopover",
    "name": "SFPopover",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "FLOATING CONTENT PANEL — FRAME LAYER OVERLAY PRIMITIVE. RADIX POPOVER ROOT WRAPPED WITH SF CONTRACT. COMPOSE WITH SFPOPOVERTRIGGER, SFPOPOVERCONTENT, SFPOPOVERHEADER, SFPOPOVERTITLE, AND SFPOPOVERDESCRIPTION FOR FULL POPOVER STRUCTURE. CONTENT APPLIES SHARP CORNERS, 2PX BORDER, NO SHADOW.",
    "importPath": "signalframeux",
    "importName": "SFPopover",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFPopover>\n  <SFPopoverTrigger asChild><SFButton size=\"sm\">Info</SFButton></SFPopoverTrigger>\n  <SFPopoverContent>\n    <SFPopoverHeader><SFPopoverTitle>Details</SFPopoverTitle></SFPopoverHeader>\n  </SFPopoverContent>\n</SFPopover>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFPopoverTrigger": {
    "id": "SFPopoverTrigger",
    "name": "SFPopoverTrigger",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFPOPOVER — TRIGGER ELEMENT THAT OPENS THE FLOATING PANEL ON INTERACTION.",
    "importPath": "signalframeux",
    "importName": "SFPopoverTrigger",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFPopoverTrigger asChild><SFButton size=\"sm\">Info</SFButton></SFPopoverTrigger>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFPopoverContent": {
    "id": "SFPopoverContent",
    "name": "SFPopoverContent",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFPOPOVER — FLOATING CONTENT PANEL WITH SHARP CORNERS, 2PX BORDER, AND NO SHADOW.",
    "importPath": "signalframeux",
    "importName": "SFPopoverContent",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFPopoverContent><SFPopoverHeader><SFPopoverTitle>Details</SFPopoverTitle></SFPopoverHeader></SFPopoverContent>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFPopoverHeader": {
    "id": "SFPopoverHeader",
    "name": "SFPopoverHeader",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFPOPOVER — HEADER REGION WITH 2PX BOTTOM BORDER SEPARATING IT FROM CONTENT.",
    "importPath": "signalframeux",
    "importName": "SFPopoverHeader",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFPopoverHeader><SFPopoverTitle>Filter Options</SFPopoverTitle></SFPopoverHeader>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFPopoverTitle": {
    "id": "SFPopoverTitle",
    "name": "SFPopoverTitle",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFPOPOVER — TITLE RENDERED IN FONT-MONO UPPERCASE WITH LETTER-SPACING.",
    "importPath": "signalframeux",
    "importName": "SFPopoverTitle",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFPopoverTitle>Filter Options</SFPopoverTitle>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFPopoverDescription": {
    "id": "SFPopoverDescription",
    "name": "SFPopoverDescription",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFPOPOVER — SUPPORTING DESCRIPTION TEXT IN MUTED FOREGROUND AT TEXT-XS.",
    "importPath": "signalframeux",
    "importName": "SFPopoverDescription",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFPopoverDescription>Select a date range to filter results.</SFPopoverDescription>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFScrollArea": {
    "id": "SFScrollArea",
    "name": "SFScrollArea",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "CUSTOM SCROLL CONTAINER — FRAME LAYER OVERFLOW PRIMITIVE. RADIX SCROLLAREA WITH SF-STYLED THUMB: SHARP CORNERS AND FOREGROUND/30 COLOR REPLACING THE DEFAULT ROUNDED THUMB. USE WHEN CONTENT OVERFLOWS A CONSTRAINED HEIGHT AND NATIVE SCROLLBAR STYLING CONFLICTS WITH THE SF AESTHETIC.",
    "importPath": "signalframeux",
    "importName": "SFScrollArea",
    "props": [
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Merged via cn() after base classes"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFScrollArea className=\"h-64\">\n  <div className=\"p-4\">{longContent}</div>\n</SFScrollArea>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFScrollBar": {
    "id": "SFScrollBar",
    "name": "SFScrollBar",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFSCROLLAREA — SCROLLBAR TRACK WITH SHARP CORNERS, COMPOSABLE WITH SFSCROLLAREA.",
    "importPath": "signalframeux",
    "importName": "SFScrollBar",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFScrollArea className=\"h-64\"><SFScrollBar orientation=\"vertical\" />{content}</SFScrollArea>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFLabel": {
    "id": "SFLabel",
    "name": "SFLabel",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "FORM FIELD LABEL — FRAME LAYER TYPOGRAPHY PRIMITIVE. ASSOCIATES WITH AN INPUT VIA HTMLFOR. RENDERS IN FONT-MONO UPPERCASE WITH TRACKING-WIDER AND TEXT-XS — CONSISTENT WITH OTHER FORM CHROME ELEMENTS (SFINPUT, SFCHECKBOX).",
    "importPath": "signalframeux",
    "importName": "SFLabel",
    "props": [
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Merged via cn() after base classes"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFLabel htmlFor=\"project-name\">Project Name</SFLabel>\n<SFInput id=\"project-name\" placeholder=\"Untitled\" />"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFSelect": {
    "id": "SFSelect",
    "name": "SFSelect",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "DROPDOWN SELECT INPUT — FRAME LAYER FORM PRIMITIVE. RADIX SELECT ROOT WRAPPED WITH SF CONTRACT. COMPOSE WITH SFSELECTTRIGGER, SFSELECTCONTENT, SFSELECTITEM, SFSELECTVALUE, SFSELECTGROUP, AND SFSELECTLABEL FOR A COMPLETE SELECT CONTROL. TRIGGER ENFORCES FONT-MONO, UPPERCASE, SF-BORDER-DRAW-FOCUS.",
    "importPath": "signalframeux",
    "importName": "SFSelect",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFSelect>\n  <SFSelectTrigger><SFSelectValue placeholder=\"Choose...\" /></SFSelectTrigger>\n  <SFSelectContent>\n    <SFSelectItem value=\"a\">Option A</SFSelectItem>\n  </SFSelectContent>\n</SFSelect>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFSelectTrigger": {
    "id": "SFSelectTrigger",
    "name": "SFSelectTrigger",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFSELECT — TRIGGER BUTTON WITH SF-BORDER-DRAW-FOCUS, MONO UPPERCASE, AND NO RING.",
    "importPath": "signalframeux",
    "importName": "SFSelectTrigger",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFSelectTrigger><SFSelectValue placeholder=\"Choose...\" /></SFSelectTrigger>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFSelectContent": {
    "id": "SFSelectContent",
    "name": "SFSelectContent",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFSELECT — DROPDOWN PANEL WITH SHARP CORNERS, 2PX BORDER, AND NO SHADOW.",
    "importPath": "signalframeux",
    "importName": "SFSelectContent",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFSelectContent><SFSelectItem value=\"a\">Option A</SFSelectItem></SFSelectContent>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFSelectGroup": {
    "id": "SFSelectGroup",
    "name": "SFSelectGroup",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFSELECT — GROUPS RELATED SELECT ITEMS UNDER A COMMON LABEL.",
    "importPath": "signalframeux",
    "importName": "SFSelectGroup",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFSelectGroup><SFSelectLabel>Themes</SFSelectLabel><SFSelectItem value=\"dark\">Dark</SFSelectItem></SFSelectGroup>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFSelectItem": {
    "id": "SFSelectItem",
    "name": "SFSelectItem",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFSELECT — OPTION ITEM IN MONO UPPERCASE; INVERTS COLORS ON FOCUS.",
    "importPath": "signalframeux",
    "importName": "SFSelectItem",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFSelectItem value=\"dark\">Dark</SFSelectItem>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFSelectLabel": {
    "id": "SFSelectLabel",
    "name": "SFSelectLabel",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFSELECT — NON-INTERACTIVE GROUP LABEL IN MUTED MONO UPPERCASE AT 2XS SIZE.",
    "importPath": "signalframeux",
    "importName": "SFSelectLabel",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFSelectLabel>Color Themes</SFSelectLabel>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFSelectValue": {
    "id": "SFSelectValue",
    "name": "SFSelectValue",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFSELECT — RENDERS THE CURRENTLY SELECTED VALUE OR PLACEHOLDER INSIDE SFSELECTTRIGGER.",
    "importPath": "signalframeux",
    "importName": "SFSelectValue",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFSelectValue placeholder=\"Select theme...\" />"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFCheckbox": {
    "id": "SFCheckbox",
    "name": "SFCheckbox",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "TOGGLE CHECKBOX INPUT — FRAME LAYER FORM PRIMITIVE. RADIX CHECKBOX WRAPPED WITH SF STYLING: SHARP CORNERS (ROUNDED-NONE), 2PX FOREGROUND BORDER, PRIMARY FILL ON CHECKED STATE, AND SF-FOCUSABLE KEYBOARD INDICATOR. INHERITS ALL RADIX CHECKBOXPROPS.",
    "importPath": "signalframeux",
    "importName": "SFCheckbox",
    "props": [
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Merged via cn() after base classes"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFCheckbox id=\"terms\" />\n<SFLabel htmlFor=\"terms\">Accept terms</SFLabel>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFRadioGroup": {
    "id": "SFRadioGroup",
    "name": "SFRadioGroup",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "RADIO SELECTION GROUP — FRAME LAYER FORM PRIMITIVE. RADIX RADIOGROUP WRAPPED WITH SF GRID LAYOUT. USE WITH SFRADIOGROUPITEM AND SFLABEL FOR FULL ACCESSIBLE RADIO SETS. ITEMS RENDER WITH SHARP CORNERS, 2PX FOREGROUND BORDER, AND SF-FOCUSABLE KEYBOARD INDICATOR.",
    "importPath": "signalframeux",
    "importName": "SFRadioGroup",
    "props": [
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Merged via cn() after grid base class"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFRadioGroup defaultValue=\"option-a\">\n  <SFRadioGroupItem value=\"option-a\" id=\"opt-a\" />\n  <SFLabel htmlFor=\"opt-a\">Option A</SFLabel>\n</SFRadioGroup>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFRadioGroupItem": {
    "id": "SFRadioGroupItem",
    "name": "SFRadioGroupItem",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFRADIOGROUP — INDIVIDUAL RADIO BUTTON WITH SF SHARP CORNERS AND FOCUS INDICATOR.",
    "importPath": "signalframeux",
    "importName": "SFRadioGroupItem",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFRadioGroupItem value=\"option-a\" id=\"opt-a\" /><SFLabel htmlFor=\"opt-a\">Option A</SFLabel>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFSwitch": {
    "id": "SFSwitch",
    "name": "SFSwitch",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "TOGGLE SWITCH INPUT — FRAME LAYER FORM PRIMITIVE. RADIX SWITCH WITH SF STYLING: SHARP CORNERS (ROUNDED-NONE), 2PX FOREGROUND BORDER, PRIMARY FILL ON CHECKED STATE, TRANSPARENT WHEN UNCHECKED, AND SF-TOGGLE-SNAP SNAP ANIMATION ON THE THUMB. INHERITS ALL RADIX SWITCHPROPS.",
    "importPath": "signalframeux",
    "importName": "SFSwitch",
    "props": [
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Merged via cn() after base classes"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFSwitch id=\"notifications\" defaultChecked />\n<SFLabel htmlFor=\"notifications\">Enable notifications</SFLabel>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFTextarea": {
    "id": "SFTextarea",
    "name": "SFTextarea",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "MULTI-LINE TEXT INPUT — FRAME LAYER FORM PRIMITIVE. ENFORCES SF TEXTAREA CONTRACT: FONT-MONO, UPPERCASE, 2PX FOREGROUND BORDER, SF-BORDER-DRAW-FOCUS SIGNAL ANIMATION ON FOCUS, NO SHADOW, NO RING. PLACEHOLDER INHERITS UPPERCASE AND TRACKING STYLES.",
    "importPath": "signalframeux",
    "importName": "SFTextarea",
    "props": [
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Merged via cn() after base classes"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFTextarea placeholder=\"Enter notes...\" rows={4} />\n<SFTextarea placeholder=\"Description\" className=\"min-h-32\" />"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFAlert": {
    "id": "SFAlert",
    "name": "SFAlert",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "INLINE FEEDBACK BANNER — FRAME LAYER NOTIFICATION PRIMITIVE. FOUR INTENTS: INFO (PRIMARY), WARNING (ACCENT), DESTRUCTIVE, SUCCESS. USES CVA WITH `INTENT` AS THE VARIANT KEY. OVERRIDES BASE ALERT'S ROUNDED-LG WITH ROUNDED-NONE AND APPLIES 2PX BORDER WITH TOKEN-MAPPED BACKGROUND TINTS.",
    "importPath": "signalframeux",
    "importName": "SFAlert",
    "props": [
      {
        "name": "intent",
        "type": "any",
        "default": "",
        "desc": "Visual variant. \"info\" | \"warning\" | \"destructive\" | \"success\""
      },
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Merged via cn() after variant classes"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFAlert intent=\"warning\">\n  <SFAlertTitle>Caution</SFAlertTitle>\n  <SFAlertDescription>Check your input.</SFAlertDescription>\n</SFAlert>"
      }
    ],
    "a11y": [
      "FOCUS TRAPPED WITHIN DIALOG WHEN OPEN",
      "ESC KEY CLOSES THE DIALOG",
      "ARIA ROLE=DIALOG APPLIED BY RADIX"
    ]
  },
  "SFAlertTitle": {
    "id": "SFAlertTitle",
    "name": "SFAlertTitle",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFALERT — TITLE IN MONOSPACE UPPERCASE WITH WIDER TRACKING.",
    "importPath": "signalframeux",
    "importName": "SFAlertTitle",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFAlertTitle>Warning</SFAlertTitle>"
      }
    ],
    "a11y": [
      "FOCUS TRAPPED WITHIN DIALOG WHEN OPEN",
      "ESC KEY CLOSES THE DIALOG",
      "ARIA ROLE=DIALOG APPLIED BY RADIX"
    ]
  },
  "SFAlertDescription": {
    "id": "SFAlertDescription",
    "name": "SFAlertDescription",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFALERT — DESCRIPTION TEXT RENDERED BELOW THE ALERT TITLE.",
    "importPath": "signalframeux",
    "importName": "SFAlertDescription",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFAlertDescription>Your session will expire in 5 minutes.</SFAlertDescription>"
      }
    ],
    "a11y": [
      "FOCUS TRAPPED WITHIN DIALOG WHEN OPEN",
      "ESC KEY CLOSES THE DIALOG",
      "ARIA ROLE=DIALOG APPLIED BY RADIX"
    ]
  },
  "SFAlertDialog": {
    "id": "SFAlertDialog",
    "name": "SFAlertDialog",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "CONFIRMATION DIALOG -- FRAME LAYER DESTRUCTIVE ACTION GUARD. BLOCKS INTERACTION WITH FOCUS-TRAPPED OVERLAY. USE SFALERTDIALOGACTION LOADING PROP FOR ASYNC CONFIRM. RADIX ALERTDIALOG ROOT WRAPPED WITH SF CONTRACT. COMPOSE WITH SFALERTDIALOGTRIGGER, SFALERTDIALOGCONTENT, SFALERTDIALOGHEADER, SFALERTDIALOGTITLE, SFALERTDIALOGDESCRIPTION, SFALERTDIALOGFOOTER, SFALERTDIALOGACTION, AND SFALERTDIALOGCANCEL.",
    "importPath": "signalframeux",
    "importName": "SFAlertDialog",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFAlertDialog>\n  <SFAlertDialogTrigger asChild><SFButton>Delete</SFButton></SFAlertDialogTrigger>\n  <SFAlertDialogContent>\n    <SFAlertDialogHeader><SFAlertDialogTitle>Confirm</SFAlertDialogTitle></SFAlertDialogHeader>\n    <SFAlertDialogFooter>\n      <SFAlertDialogCancel>Cancel</SFAlertDialogCancel>\n      <SFAlertDialogAction loading={isDeleting}>Delete</SFAlertDialogAction>\n    </SFAlertDialogFooter>\n  </SFAlertDialogContent>\n</SFAlertDialog>"
      }
    ],
    "a11y": [
      "FOCUS TRAPPED WITHIN DIALOG WHEN OPEN",
      "ESC KEY CLOSES THE DIALOG",
      "ARIA ROLE=DIALOG APPLIED BY RADIX"
    ]
  },
  "SFAlertDialogTrigger": {
    "id": "SFAlertDialogTrigger",
    "name": "SFAlertDialogTrigger",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFALERTDIALOG -- TRIGGER ELEMENT THAT OPENS THE DIALOG ON INTERACTION.",
    "importPath": "signalframeux",
    "importName": "SFAlertDialogTrigger",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFAlertDialogTrigger asChild><SFButton>Delete</SFButton></SFAlertDialogTrigger>"
      }
    ],
    "a11y": [
      "FOCUS TRAPPED WITHIN DIALOG WHEN OPEN",
      "ESC KEY CLOSES THE DIALOG",
      "ARIA ROLE=DIALOG APPLIED BY RADIX"
    ]
  },
  "SFAlertDialogContent": {
    "id": "SFAlertDialogContent",
    "name": "SFAlertDialogContent",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFALERTDIALOG -- MODAL CONTENT PANEL WITH SHARP CORNERS, 2PX BORDER, AND NO SHADOW.",
    "importPath": "signalframeux",
    "importName": "SFAlertDialogContent",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFAlertDialogContent><SFAlertDialogHeader><SFAlertDialogTitle>Confirm</SFAlertDialogTitle></SFAlertDialogHeader></SFAlertDialogContent>"
      }
    ],
    "a11y": [
      "FOCUS TRAPPED WITHIN DIALOG WHEN OPEN",
      "ESC KEY CLOSES THE DIALOG",
      "ARIA ROLE=DIALOG APPLIED BY RADIX"
    ]
  },
  "SFAlertDialogHeader": {
    "id": "SFAlertDialogHeader",
    "name": "SFAlertDialogHeader",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFALERTDIALOG -- HEADER REGION CONTAINING TITLE AND DESCRIPTION.",
    "importPath": "signalframeux",
    "importName": "SFAlertDialogHeader",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFAlertDialogHeader><SFAlertDialogTitle>Are you sure?</SFAlertDialogTitle></SFAlertDialogHeader>"
      }
    ],
    "a11y": [
      "FOCUS TRAPPED WITHIN DIALOG WHEN OPEN",
      "ESC KEY CLOSES THE DIALOG",
      "ARIA ROLE=DIALOG APPLIED BY RADIX"
    ]
  },
  "SFAlertDialogFooter": {
    "id": "SFAlertDialogFooter",
    "name": "SFAlertDialogFooter",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFALERTDIALOG -- FOOTER REGION WITH SHARP CORNERS OVERRIDING BASE ROUNDED-B-XL.",
    "importPath": "signalframeux",
    "importName": "SFAlertDialogFooter",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFAlertDialogFooter><SFAlertDialogCancel>Cancel</SFAlertDialogCancel><SFAlertDialogAction>Confirm</SFAlertDialogAction></SFAlertDialogFooter>"
      }
    ],
    "a11y": [
      "FOCUS TRAPPED WITHIN DIALOG WHEN OPEN",
      "ESC KEY CLOSES THE DIALOG",
      "ARIA ROLE=DIALOG APPLIED BY RADIX"
    ]
  },
  "SFAlertDialogTitle": {
    "id": "SFAlertDialogTitle",
    "name": "SFAlertDialogTitle",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFALERTDIALOG -- TITLE IN MONOSPACE UPPERCASE WITH WIDER TRACKING.",
    "importPath": "signalframeux",
    "importName": "SFAlertDialogTitle",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFAlertDialogTitle>Delete Project?</SFAlertDialogTitle>"
      }
    ],
    "a11y": [
      "FOCUS TRAPPED WITHIN DIALOG WHEN OPEN",
      "ESC KEY CLOSES THE DIALOG",
      "ARIA ROLE=DIALOG APPLIED BY RADIX"
    ]
  },
  "SFAlertDialogDescription": {
    "id": "SFAlertDialogDescription",
    "name": "SFAlertDialogDescription",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFALERTDIALOG -- SUPPORTING DESCRIPTION TEXT BELOW THE TITLE.",
    "importPath": "signalframeux",
    "importName": "SFAlertDialogDescription",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFAlertDialogDescription>This action cannot be undone and will permanently delete all data.</SFAlertDialogDescription>"
      }
    ],
    "a11y": [
      "FOCUS TRAPPED WITHIN DIALOG WHEN OPEN",
      "ESC KEY CLOSES THE DIALOG",
      "ARIA ROLE=DIALOG APPLIED BY RADIX"
    ]
  },
  "SFAlertDialogAction": {
    "id": "SFAlertDialogAction",
    "name": "SFAlertDialogAction",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFALERTDIALOG -- CONFIRM ACTION BUTTON WITH OPTIONAL LOADING STATE.",
    "importPath": "signalframeux",
    "importName": "SFAlertDialogAction",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFAlertDialogAction loading={isDeleting} onClick={handleDelete}>Delete</SFAlertDialogAction>"
      }
    ],
    "a11y": [
      "FOCUS TRAPPED WITHIN DIALOG WHEN OPEN",
      "ESC KEY CLOSES THE DIALOG",
      "ARIA ROLE=DIALOG APPLIED BY RADIX"
    ]
  },
  "SFAlertDialogCancel": {
    "id": "SFAlertDialogCancel",
    "name": "SFAlertDialogCancel",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFALERTDIALOG -- CANCEL BUTTON WITH SHARP CORNERS THAT DISMISSES THE DIALOG.",
    "importPath": "signalframeux",
    "importName": "SFAlertDialogCancel",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFAlertDialogCancel>Cancel</SFAlertDialogCancel>"
      }
    ],
    "a11y": [
      "FOCUS TRAPPED WITHIN DIALOG WHEN OPEN",
      "ESC KEY CLOSES THE DIALOG",
      "ARIA ROLE=DIALOG APPLIED BY RADIX"
    ]
  },
  "SFCollapsible": {
    "id": "SFCollapsible",
    "name": "SFCollapsible",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "TOGGLEABLE CONTENT PANEL — FRAME LAYER DISCLOSURE PRIMITIVE. RADIX COLLAPSIBLE ROOT WRAPPED WITH SF CONTRACT. COMPOSE WITH SFCOLLAPSIBLETRIGGER (SUPPORTS ASCHILD) AND SFCOLLAPSIBLECONTENT.",
    "importPath": "signalframeux",
    "importName": "SFCollapsible",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFCollapsible>\n  <SFCollapsibleTrigger asChild><SFButton>Toggle</SFButton></SFCollapsibleTrigger>\n  <SFCollapsibleContent>Hidden content here</SFCollapsibleContent>\n</SFCollapsible>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFCollapsibleTrigger": {
    "id": "SFCollapsibleTrigger",
    "name": "SFCollapsibleTrigger",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFCOLLAPSIBLE — TRIGGER ELEMENT THAT TOGGLES CONTENT VISIBILITY.",
    "importPath": "signalframeux",
    "importName": "SFCollapsibleTrigger",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFCollapsibleTrigger asChild><SFButton>Toggle</SFButton></SFCollapsibleTrigger>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFCollapsibleContent": {
    "id": "SFCollapsibleContent",
    "name": "SFCollapsibleContent",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFCOLLAPSIBLE — COLLAPSIBLE CONTENT REGION THAT SHOWS/HIDES ON TRIGGER.",
    "importPath": "signalframeux",
    "importName": "SFCollapsibleContent",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFCollapsibleContent>Hidden content revealed on toggle</SFCollapsibleContent>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFAvatar": {
    "id": "SFAvatar",
    "name": "SFAvatar",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "USER IDENTITY AVATAR — FRAME LAYER IDENTITY PRIMITIVE. SQUARE CROP, RADIX FALLBACK CHAIN: IMAGE -> INITIALS -> ICON. ALL SUB-ELEMENTS ENFORCE ROUNDED-NONE TO OVERRIDE RADIX'S DEFAULT ROUNDED-FULL. WHEN SFAVATARFALLBACK HAS NO CHILDREN, A LUCIDE USER ICON RENDERS AT 60% CONTAINER SIZE.",
    "importPath": "signalframeux",
    "importName": "SFAvatar",
    "props": [
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Merged via cn() after rounded-none overrides"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFAvatar>\n  <SFAvatarImage src=\"/avatar.png\" alt=\"User\" />\n  <SFAvatarFallback>JD</SFAvatarFallback>\n</SFAvatar>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFAvatarImage": {
    "id": "SFAvatarImage",
    "name": "SFAvatarImage",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFAVATAR — IMAGE ELEMENT WITH SQUARE CROP AND ROUNDED-NONE OVERRIDE.",
    "importPath": "signalframeux",
    "importName": "SFAvatarImage",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFAvatarImage src=\"/avatars/user.png\" alt=\"Jane Doe\" />"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFAvatarFallback": {
    "id": "SFAvatarFallback",
    "name": "SFAvatarFallback",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFAVATAR — FALLBACK WITH INITIALS OR DEFAULT USER ICON WHEN IMAGE FAILS.",
    "importPath": "signalframeux",
    "importName": "SFAvatarFallback",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFAvatarFallback>JD</SFAvatarFallback>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFBreadcrumb": {
    "id": "SFBreadcrumb",
    "name": "SFBreadcrumb",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "NAVIGATION HIERARCHY BREADCRUMB — FRAME LAYER WAYFINDING PRIMITIVE. SERVER COMPONENT. WRAPS SHADCN BREADCRUMB WITH MONOSPACE TEXT AND `/` SEPARATOR INSTEAD OF CHEVRON ICON.",
    "importPath": "signalframeux",
    "importName": "SFBreadcrumb",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFBreadcrumb>\n  <SFBreadcrumbList>\n    <SFBreadcrumbItem><SFBreadcrumbLink href=\"/\">Home</SFBreadcrumbLink></SFBreadcrumbItem>\n    <SFBreadcrumbSeparator />\n    <SFBreadcrumbItem><SFBreadcrumbPage>Current</SFBreadcrumbPage></SFBreadcrumbItem>\n  </SFBreadcrumbList>\n</SFBreadcrumb>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFBreadcrumbList": {
    "id": "SFBreadcrumbList",
    "name": "SFBreadcrumbList",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFBREADCRUMB — ORDERED LIST CONTAINER WITH MONOSPACE FONT.",
    "importPath": "signalframeux",
    "importName": "SFBreadcrumbList",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFBreadcrumbList><SFBreadcrumbItem><SFBreadcrumbLink href=\"/\">Home</SFBreadcrumbLink></SFBreadcrumbItem></SFBreadcrumbList>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFBreadcrumbItem": {
    "id": "SFBreadcrumbItem",
    "name": "SFBreadcrumbItem",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFBREADCRUMB — INDIVIDUAL BREADCRUMB ITEM WRAPPER.",
    "importPath": "signalframeux",
    "importName": "SFBreadcrumbItem",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFBreadcrumbItem><SFBreadcrumbLink href=\"/docs\">Docs</SFBreadcrumbLink></SFBreadcrumbItem>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFBreadcrumbLink": {
    "id": "SFBreadcrumbLink",
    "name": "SFBreadcrumbLink",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFBREADCRUMB — NAVIGABLE BREADCRUMB LINK TO A PARENT PAGE.",
    "importPath": "signalframeux",
    "importName": "SFBreadcrumbLink",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFBreadcrumbLink href=\"/components\">Components</SFBreadcrumbLink>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFBreadcrumbPage": {
    "id": "SFBreadcrumbPage",
    "name": "SFBreadcrumbPage",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFBREADCRUMB — CURRENT PAGE INDICATOR (NON-INTERACTIVE, ARIA-CURRENT=\"PAGE\").",
    "importPath": "signalframeux",
    "importName": "SFBreadcrumbPage",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFBreadcrumbPage>Button</SFBreadcrumbPage>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFBreadcrumbSeparator": {
    "id": "SFBreadcrumbSeparator",
    "name": "SFBreadcrumbSeparator",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFBREADCRUMB — MONOSPACE `/` SEPARATOR BETWEEN BREADCRUMB ITEMS.",
    "importPath": "signalframeux",
    "importName": "SFBreadcrumbSeparator",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFBreadcrumbSeparator />"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFPagination": {
    "id": "SFPagination",
    "name": "SFPagination",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SFPAGINATION -- FRAME LAYER NUMBERED PAGE NAVIGATION. SERVER COMPONENT. WRAPS SHADCN PAGINATION WITH MONOSPACE TEXT, SHARP CORNERS, 2PX BORDERS, AND INVERTED ACTIVE STATE. NO ELLIPSIS EXPORT -- PAGINATION SHOULD SHOW EXPLICIT PAGE NUMBERS.",
    "importPath": "signalframeux",
    "importName": "SFPagination",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFPagination>\n  <SFPaginationContent>\n    <SFPaginationItem><SFPaginationPrevious href=\"/page/1\" /></SFPaginationItem>\n    <SFPaginationItem><SFPaginationLink href=\"/page/1\">1</SFPaginationLink></SFPaginationItem>\n    <SFPaginationItem><SFPaginationLink href=\"/page/2\" isActive>2</SFPaginationLink></SFPaginationItem>\n    <SFPaginationItem><SFPaginationLink href=\"/page/3\">3</SFPaginationLink></SFPaginationItem>\n    <SFPaginationItem><SFPaginationNext href=\"/page/3\" /></SFPaginationItem>\n  </SFPaginationContent>\n</SFPagination>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFPaginationContent": {
    "id": "SFPaginationContent",
    "name": "SFPaginationContent",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFPAGINATION — FLEX CONTAINER FOR PAGINATION ITEMS WITH GAP-0 EDGE-TO-EDGE LAYOUT.",
    "importPath": "signalframeux",
    "importName": "SFPaginationContent",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFPaginationContent><SFPaginationItem><SFPaginationLink href=\"/page/1\">1</SFPaginationLink></SFPaginationItem></SFPaginationContent>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFPaginationItem": {
    "id": "SFPaginationItem",
    "name": "SFPaginationItem",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFPAGINATION — WRAPPER FOR A SINGLE PAGINATION CONTROL (LINK, PREV, OR NEXT).",
    "importPath": "signalframeux",
    "importName": "SFPaginationItem",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFPaginationItem><SFPaginationLink href=\"/page/2\">2</SFPaginationLink></SFPaginationItem>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFPaginationLink": {
    "id": "SFPaginationLink",
    "name": "SFPaginationLink",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFPAGINATION — PAGE NUMBER LINK WITH INVERTED ACTIVE STATE AND 2PX BORDER.",
    "importPath": "signalframeux",
    "importName": "SFPaginationLink",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFPaginationLink href=\"/page/3\" isActive>3</SFPaginationLink>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFPaginationPrevious": {
    "id": "SFPaginationPrevious",
    "name": "SFPaginationPrevious",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFPAGINATION — PREVIOUS PAGE NAVIGATION CONTROL WITH 2PX BORDER AND MONO UPPERCASE.",
    "importPath": "signalframeux",
    "importName": "SFPaginationPrevious",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFPaginationPrevious href=\"/page/1\" />"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFPaginationNext": {
    "id": "SFPaginationNext",
    "name": "SFPaginationNext",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFPAGINATION — NEXT PAGE NAVIGATION CONTROL WITH 2PX BORDER AND MONO UPPERCASE.",
    "importPath": "signalframeux",
    "importName": "SFPaginationNext",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFPaginationNext href=\"/page/4\" />"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFNavigationMenu": {
    "id": "SFNavigationMenu",
    "name": "SFNavigationMenu",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SF-WRAPPED NAVIGATIONMENU ROOT WITH INDUSTRIAL STYLING — FRAME LAYER NAVIGATION PRIMITIVE.",
    "importPath": "signalframeux",
    "importName": "SFNavigationMenu",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFNavigationMenu><SFNavigationMenuList><SFNavigationMenuItem>Item</SFNavigationMenuItem></SFNavigationMenuList></SFNavigationMenu>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFNavigationMenuList": {
    "id": "SFNavigationMenuList",
    "name": "SFNavigationMenuList",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFNAVIGATIONMENU — LIST CONTAINER FOR NAVIGATION ITEMS.",
    "importPath": "signalframeux",
    "importName": "SFNavigationMenuList",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFNavigationMenuList><SFNavigationMenuItem>Home</SFNavigationMenuItem></SFNavigationMenuList>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFNavigationMenuItem": {
    "id": "SFNavigationMenuItem",
    "name": "SFNavigationMenuItem",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFNAVIGATIONMENU — INDIVIDUAL NAVIGATION ITEM WRAPPER.",
    "importPath": "signalframeux",
    "importName": "SFNavigationMenuItem",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFNavigationMenuItem><SFNavigationMenuLink href=\"/docs\">Docs</SFNavigationMenuLink></SFNavigationMenuItem>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFNavigationMenuTrigger": {
    "id": "SFNavigationMenuTrigger",
    "name": "SFNavigationMenuTrigger",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFNAVIGATIONMENU — TRIGGER BUTTON WITH CHEVRON, INDUSTRIAL STYLING.",
    "importPath": "signalframeux",
    "importName": "SFNavigationMenuTrigger",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFNavigationMenuTrigger>Products</SFNavigationMenuTrigger>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFNavigationMenuContent": {
    "id": "SFNavigationMenuContent",
    "name": "SFNavigationMenuContent",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFNAVIGATIONMENU — FLYOUT CONTENT PANEL WITH PRESERVED MOTION ANIMATIONS.",
    "importPath": "signalframeux",
    "importName": "SFNavigationMenuContent",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFNavigationMenuContent><SFNavigationMenuLink href=\"/docs/intro\">Intro</SFNavigationMenuLink></SFNavigationMenuContent>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFNavigationMenuLink": {
    "id": "SFNavigationMenuLink",
    "name": "SFNavigationMenuLink",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFNAVIGATIONMENU — NAVIGATION LINK WITH INVERTED HOVER STATE.",
    "importPath": "signalframeux",
    "importName": "SFNavigationMenuLink",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFNavigationMenuLink href=\"/reference\">Reference</SFNavigationMenuLink>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFNavigationMenuViewport": {
    "id": "SFNavigationMenuViewport",
    "name": "SFNavigationMenuViewport",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFNAVIGATIONMENU — VIEWPORT FLYOUT CONTAINER WITH 2PX INDUSTRIAL BORDER.",
    "importPath": "signalframeux",
    "importName": "SFNavigationMenuViewport",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFNavigationMenuViewport />"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFNavigationMenuMobile": {
    "id": "SFNavigationMenuMobile",
    "name": "SFNavigationMenuMobile",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "MOBILE NAVIGATION — SFSHEET SLIDE-OUT WITH HAMBURGER TRIGGER, VISIBLE ONLY BELOW MD BREAKPOINT.",
    "importPath": "signalframeux",
    "importName": "SFNavigationMenuMobile",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFNavigationMenuMobile title=\"MENU\"><a href=\"/docs\">Docs</a><a href=\"/api\">API</a></SFNavigationMenuMobile>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFToggleGroup": {
    "id": "SFToggleGroup",
    "name": "SFToggleGroup",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SFTOGGLEGROUP -- FRAME LAYER EXCLUSIVE/MULTI-SELECT TOGGLE GROUP. RADIX TOGGLEGROUP WITH SF STYLING: SHARP CORNERS, 2PX BORDER, EDGE-TO-EDGE LAYOUT (GAP-0), AND CVA `INTENT` PROP. USE FOR MUTUALLY EXCLUSIVE SELECTIONS (TYPE=\"SINGLE\") OR MULTI-SELECT FILTER BANKS (TYPE=\"MULTIPLE\").",
    "importPath": "signalframeux",
    "importName": "SFToggleGroup",
    "props": [
      {
        "name": "type",
        "type": "any",
        "default": "",
        "desc": "\"single\" for exclusive selection, \"multiple\" for multi-select"
      },
      {
        "name": "intent",
        "type": "any",
        "default": "",
        "desc": "Visual variant passed to all items. \"ghost\" | \"primary\""
      },
      {
        "name": "size",
        "type": "any",
        "default": "",
        "desc": "Height and padding scale. \"sm\" | \"md\" | \"lg\""
      },
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Merged via cn() after base classes"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFToggleGroup type=\"single\" intent=\"ghost\" defaultValue=\"grid\">\n  <SFToggleGroupItem value=\"grid\">Grid</SFToggleGroupItem>\n  <SFToggleGroupItem value=\"list\">List</SFToggleGroupItem>\n</SFToggleGroup>\n\n<SFToggleGroup type=\"multiple\" intent=\"primary\" size=\"sm\">\n  <SFToggleGroupItem value=\"a\">A</SFToggleGroupItem>\n  <SFToggleGroupItem value=\"b\">B</SFToggleGroupItem>\n  <SFToggleGroupItem value=\"c\">C</SFToggleGroupItem>\n</SFToggleGroup>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFToggleGroupItem": {
    "id": "SFToggleGroupItem",
    "name": "SFToggleGroupItem",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFTOGGLEGROUP — INDIVIDUAL TOGGLE BUTTON ITEM THAT INHERITS GROUP INTENT AND SIZE.",
    "importPath": "signalframeux",
    "importName": "SFToggleGroupItem",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFToggleGroupItem value=\"grid\">Grid</SFToggleGroupItem>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFInputGroup": {
    "id": "SFInputGroup",
    "name": "SFInputGroup",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "GROUPED INPUT WITH ADDONS — FRAME LAYER FORM PRIMITIVE. WRAPS ALL SUB-ELEMENTS WITH ZERO BORDER-RADIUS. OVERRIDES `UI/INPUT-GROUP.TSX`'S `ROUNDED-LG` ON THE ROOT AND CVA-GENERATED `ROUNDED-[CALC(VAR(--RADIUS)-5PX)]` / `ROUNDED-[CALC(VAR(--RADIUS)-3PX)]` ON ADDON AND BUTTON CHILDREN.",
    "importPath": "signalframeux",
    "importName": "SFInputGroup",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFInputGroup>\n  <SFInputGroupAddon align=\"inline-start\">\n    <SFInputGroupText>@</SFInputGroupText>\n  </SFInputGroupAddon>\n  <SFInputGroupInput placeholder=\"username\" />\n  <SFInputGroupAddon align=\"inline-end\">\n    <SFInputGroupButton>Send</SFInputGroupButton>\n  </SFInputGroupAddon>\n</SFInputGroup>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFInputGroupAddon": {
    "id": "SFInputGroupAddon",
    "name": "SFInputGroupAddon",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFINPUTGROUP — ADDON WRAPPER FOR INLINE OR BLOCK DECORATORS. ZERO BORDER-RADIUS ON KBD CHILDREN.",
    "importPath": "signalframeux",
    "importName": "SFInputGroupAddon",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFInputGroupAddon align=\"inline-start\"><SFInputGroupText>@</SFInputGroupText></SFInputGroupAddon>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFInputGroupButton": {
    "id": "SFInputGroupButton",
    "name": "SFInputGroupButton",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFINPUTGROUP — ACTION BUTTON INSIDE INPUT GROUP. OVERRIDES CVA'S CALC-BASED RADIUS WITH ROUNDED-NONE.",
    "importPath": "signalframeux",
    "importName": "SFInputGroupButton",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFInputGroupAddon align=\"inline-end\"><SFInputGroupButton>Send</SFInputGroupButton></SFInputGroupAddon>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFInputGroupText": {
    "id": "SFInputGroupText",
    "name": "SFInputGroupText",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFINPUTGROUP — NON-INTERACTIVE TEXT LABEL OR ICON INSIDE THE GROUP.",
    "importPath": "signalframeux",
    "importName": "SFInputGroupText",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFInputGroupText>@</SFInputGroupText>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFInputGroupInput": {
    "id": "SFInputGroupInput",
    "name": "SFInputGroupInput",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFINPUTGROUP — THE PRIMARY INPUT FIELD. BASE ALREADY APPLIES ROUNDED-NONE; PASSTHROUGH MAINTAINS THE CONTRACT.",
    "importPath": "signalframeux",
    "importName": "SFInputGroupInput",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFInputGroupInput placeholder=\"username\" />"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFInputGroupTextarea": {
    "id": "SFInputGroupTextarea",
    "name": "SFInputGroupTextarea",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFINPUTGROUP — MULTILINE TEXTAREA VARIANT. BASE ALREADY APPLIES ROUNDED-NONE; PASSTHROUGH MAINTAINS THE CONTRACT.",
    "importPath": "signalframeux",
    "importName": "SFInputGroupTextarea",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFInputGroupTextarea placeholder=\"Enter your message...\" rows={4} />"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFInputOTP": {
    "id": "SFInputOTP",
    "name": "SFInputOTP",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "ONE-TIME PASSWORD INPUT — FRAME LAYER FORM PRIMITIVE. INDIVIDUAL CHARACTER SLOTS FOR VERIFICATION CODES. KEYBOARD NAVIGABLE, SUPPORTS PASTE AND SMS AUTOFILL. ZERO BORDER-RADIUS ON ALL SLOTS.",
    "importPath": "signalframeux",
    "importName": "SFInputOTP",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFInputOTP maxLength={6}>\n  <SFInputOTPGroup>\n    <SFInputOTPSlot index={0} />\n    <SFInputOTPSlot index={1} />\n    <SFInputOTPSlot index={2} />\n  </SFInputOTPGroup>\n  <SFInputOTPSeparator />\n  <SFInputOTPGroup>\n    <SFInputOTPSlot index={3} />\n    <SFInputOTPSlot index={4} />\n    <SFInputOTPSlot index={5} />\n  </SFInputOTPGroup>\n</SFInputOTP>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFInputOTPGroup": {
    "id": "SFInputOTPGroup",
    "name": "SFInputOTPGroup",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFINPUTOTP — GROUPS SLOTS TOGETHER VISUALLY. ZERO BORDER-RADIUS ON GROUP CONTAINER.",
    "importPath": "signalframeux",
    "importName": "SFInputOTPGroup",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFInputOTPGroup><SFInputOTPSlot index={0} /><SFInputOTPSlot index={1} /></SFInputOTPGroup>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFInputOTPSlot": {
    "id": "SFInputOTPSlot",
    "name": "SFInputOTPSlot",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFINPUTOTP — INDIVIDUAL CHARACTER SLOT. ZERO RADIUS, 2PX FOREGROUND BORDER, RING ON ACTIVE STATE.",
    "importPath": "signalframeux",
    "importName": "SFInputOTPSlot",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFInputOTPSlot index={0} />"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFInputOTPSeparator": {
    "id": "SFInputOTPSeparator",
    "name": "SFInputOTPSeparator",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFINPUTOTP — VISUAL SEPARATOR BETWEEN SLOT GROUPS (RENDERS A DASH BY DEFAULT).",
    "importPath": "signalframeux",
    "importName": "SFInputOTPSeparator",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFInputOTPSeparator />"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFHoverCard": {
    "id": "SFHoverCard",
    "name": "SFHoverCard",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "HOVER/FOCUS PREVIEW PANEL — FRAME LAYER OVERLAY PRIMITIVE. RADIX HOVERCARD WRAPPED WITH SF CONTRACT. CONTENT APPLIES SHARP CORNERS, 2PX BORDER, NO SHADOW. KEYBOARD ACCESSIBLE VIA RADIX OPEN-ON-FOCUS.",
    "importPath": "signalframeux",
    "importName": "SFHoverCard",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFHoverCard>\n  <SFHoverCardTrigger asChild><SFButton>Preview</SFButton></SFHoverCardTrigger>\n  <SFHoverCardContent>Card details here</SFHoverCardContent>\n</SFHoverCard>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFHoverCardTrigger": {
    "id": "SFHoverCardTrigger",
    "name": "SFHoverCardTrigger",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFHOVERCARD — TRIGGER THAT OPENS ON HOVER OR KEYBOARD FOCUS.",
    "importPath": "signalframeux",
    "importName": "SFHoverCardTrigger",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFHoverCardTrigger asChild><SFButton>Preview</SFButton></SFHoverCardTrigger>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "SFHoverCardContent": {
    "id": "SFHoverCardContent",
    "name": "SFHoverCardContent",
    "layer": "FRAME",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFHOVERCARD — FLOATING CONTENT PANEL WITH SHARP CORNERS, 2PX BORDER, NO SHADOW.",
    "importPath": "signalframeux",
    "importName": "SFHoverCardContent",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFHoverCardContent><p className=\"text-xs font-mono\">Component details</p></SFHoverCardContent>"
      }
    ],
    "a11y": [
      "KEYBOARD NAVIGABLE",
      "ARIA ATTRIBUTES MANAGED BY RADIX UI"
    ]
  },
  "createSignalframeUX": {
    "id": "createSignalframeUX",
    "name": "createSignalframeUX",
    "layer": "CORE",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "FACTORY THAT CREATES A TYPED, SSR-SAFE SIGNALFRAMEPROVIDER + USESIGNALFRAME HOOK PAIR. NOTE: THE RETURNED USESIGNALFRAME IS IDENTICAL TO THE STANDALONE EXPORT — BOTH READ FROM THE SHARED SIGNALFRAMECONTEXT SINGLETON. MULTIPLE CREATESIGNALFRAMEUX() CALLS SHARE THE SAME CONTEXT. THE FACTORY RETURN IS FOR DESTRUCTURED CONVENIENCE ONLY.",
    "importPath": "signalframeux",
    "importName": "createSignalframeUX",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "// In app/layout.tsx (module scope — not inside the component):\nconst { SignalframeProvider } = createSignalframeUX({ defaultTheme: 'dark' });"
      }
    ],
    "a11y": [
      "NO DIRECT RENDERING — UTILITY FUNCTION"
    ]
  },
  "useSignalframe": {
    "id": "useSignalframe",
    "name": "useSignalframe",
    "layer": "HOOK",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "FACTORY THAT CREATES A TYPED, SSR-SAFE SIGNALFRAMEPROVIDER + USESIGNALFRAME HOOK PAIR. NOTE: THE RETURNED USESIGNALFRAME IS IDENTICAL TO THE STANDALONE EXPORT — BOTH READ FROM THE SHARED SIGNALFRAMECONTEXT SINGLETON. MULTIPLE CREATESIGNALFRAMEUX() CALLS SHARE THE SAME CONTEXT. THE FACTORY RETURN IS FOR DESTRUCTURED CONVENIENCE ONLY.",
    "importPath": "signalframeux",
    "importName": "useSignalframe",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "// In app/layout.tsx (module scope — not inside the component):\nconst { SignalframeProvider } = createSignalframeUX({ defaultTheme: 'dark' });"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION WHERE APPLICABLE"
    ]
  },
  "cn": {
    "id": "cn",
    "name": "cn",
    "layer": "CORE",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "CLASS NAME UTILITY — MERGES TAILWIND CLASSES WITH CLSX + TAILWIND-MERGE. RESOLVES CLASS CONFLICTS (E.G., P-4 VS P-2) SO THE LAST CLASS WINS.",
    "importPath": "signalframeux",
    "importName": "cn",
    "props": [
      {
        "name": "inputs",
        "type": "any",
        "default": "",
        "desc": "Any number of class values (strings, arrays, objects)"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "cn(\"flex items-center\", isActive && \"bg-foreground text-background\")\ncn(\"border-2 border-foreground\", className)"
      }
    ],
    "a11y": [
      "NO DIRECT RENDERING — UTILITY FUNCTION"
    ]
  },
  "toggleTheme": {
    "id": "toggleTheme",
    "name": "toggleTheme",
    "layer": "CORE",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SHARED THEME TOGGLE — USED BY DARKMODETOGGLE AND COMMANDPALETTE. HARD-CUT SWITCH (DU-STYLE) — INSTANT COLOR INVERSION, NO SMOOTH BLEND.",
    "importPath": "signalframeux",
    "importName": "toggleTheme",
    "props": [
      {
        "name": "currentDark",
        "type": "any",
        "default": "",
        "desc": "Whether dark mode is currently active"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "const [isDark, setIsDark] = useState(false);\n<button onClick={() => setIsDark(toggleTheme(isDark))}>Toggle theme</button>"
      }
    ],
    "a11y": [
      "NO DIRECT RENDERING — UTILITY FUNCTION"
    ]
  },
  "GRAIN_SVG": {
    "id": "GRAIN_SVG",
    "name": "GRAIN_SVG",
    "layer": "CORE",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SHARED GRAIN/NOISE SVG DATA URI — FRACTALNOISE AT 0.65 BASEFREQUENCY. APPLY AS A CSS BACKGROUND-IMAGE OVERLAY FOR THE SIGNAL GRAIN TEXTURE AESTHETIC.",
    "importPath": "signalframeux",
    "importName": "GRAIN_SVG",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<div style={{ backgroundImage: GRAIN_SVG, opacity: 0.08 }} aria-hidden=\"true\" />"
      }
    ],
    "a11y": [
      "NO DIRECT RENDERING — UTILITY FUNCTION"
    ]
  },
  "useScrambleText": {
    "id": "useScrambleText",
    "name": "useScrambleText",
    "layer": "HOOK",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SCRAMBLE TEXT ANIMATION HOOK — SIGNAL LAYER TEXT EFFECT USING SHARED RAF LOOP. DISPLAYS RANDOMIZED GLYPHS THAT PROGRESSIVELY RESOLVE TO THE TARGET STRING. RESPECTS PREFERS-REDUCED-MOTION AND SKIPS ANIMATION ON MOBILE (<768PX).",
    "importPath": "signalframeux",
    "importName": "useScrambleText",
    "props": [
      {
        "name": "target",
        "type": "any",
        "default": "",
        "desc": "The final string to reveal after scrambling"
      },
      {
        "name": "delay",
        "type": "any",
        "default": "",
        "desc": "Milliseconds to wait before starting the scramble animation"
      },
      {
        "name": "duration",
        "type": "any",
        "default": "",
        "desc": "Total duration of the scramble effect in milliseconds (default: 600)"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "function Hero() {\n  const text = useScrambleText(\"SIGNALFRAME\", 200, 800);\n  return <h1 className=\"font-mono\">{text}</h1>;\n}"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION WHERE APPLICABLE"
    ]
  },
  "useSessionState": {
    "id": "useSessionState",
    "name": "useSessionState",
    "layer": "HOOK",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SSR-SAFE SESSIONSTORAGE HOOK. MIRRORS THE `USESTATE` API. SSR CONTRACT: - SERVER RENDER: ALWAYS RETURNS `DEFAULTVALUE` (NO BROWSER APIS ACCESSED). - INITIAL CLIENT RENDER: ALSO RETURNS `DEFAULTVALUE` — MATCHES SERVER HTML, NO HYDRATION MISMATCH. - AFTER MOUNT: READS FROM SESSIONSTORAGE AND UPDATES STATE IF A STORED VALUE EXISTS. - ON STATE CHANGE: WRITES THE NEW VALUE TO SESSIONSTORAGE. - HARD RELOAD: SESSIONSTORAGE IS CLEARED BY THE BROWSER AUTOMATICALLY, SO `DEFAULTVALUE` IS USED AGAIN. SESSIONSTORAGE FAILURES (PRIVATE BROWSING, QUOTA EXCEEDED) ARE CAUGHT SILENTLY — STATE STILL UPDATES IN MEMORY SO THE UI REMAINS FUNCTIONAL.",
    "importPath": "signalframeux",
    "importName": "useSessionState",
    "props": [
      {
        "name": "key",
        "type": "any",
        "default": "",
        "desc": "sessionStorage key (use a constant from SESSION_KEYS)"
      },
      {
        "name": "defaultValue",
        "type": "any",
        "default": "",
        "desc": "Value used on server and on first client render"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "const [activeFilter, setActiveFilter] = useSessionState<Category>(\n  SESSION_KEYS.COMPONENTS_FILTER,\n  \"ALL\"\n);"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION WHERE APPLICABLE"
    ]
  },
  "SESSION_KEYS": {
    "id": "SESSION_KEYS",
    "name": "SESSION_KEYS",
    "layer": "CORE",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "NAMESPACED SESSIONSTORAGE KEYS FOR SIGNALFRAMEUX. CENTRALISED HERE TO PREVENT KEY COLLISIONS ACROSS THE CODEBASE. ALL KEYS USE THE `SFUX.` NAMESPACE PREFIX.",
    "importPath": "signalframeux",
    "importName": "SESSION_KEYS",
    "props": [],
    "usage": [
      {
        "label": "BASIC USAGE",
        "code": "import { SESSION_KEYS } from 'signalframeux'"
      }
    ],
    "a11y": [
      "NO DIRECT RENDERING — UTILITY FUNCTION"
    ]
  },
  "SFAccordion": {
    "id": "SFAccordion",
    "name": "SFAccordion",
    "layer": "SIGNAL",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SFACCORDION ROOT — SIGNAL LAYER ACCORDION WITH GSAP STAGGER ANIMATION ON EXPAND.",
    "importPath": "signalframeux/animation",
    "importName": "SFAccordion",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFAccordion type=\"single\" collapsible><SFAccordionItem value=\"item-1\"><SFAccordionTrigger>Section</SFAccordionTrigger><SFAccordionContent>Content</SFAccordionContent></SFAccordionItem></SFAccordion>"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE"
    ]
  },
  "SFAccordionItem": {
    "id": "SFAccordionItem",
    "name": "SFAccordionItem",
    "layer": "SIGNAL",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFACCORDION — INDIVIDUAL ACCORDION PANEL WITH BOTTOM BORDER SEPARATOR.",
    "importPath": "signalframeux/animation",
    "importName": "SFAccordionItem",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFAccordionItem value=\"item-1\"><SFAccordionTrigger>Section One</SFAccordionTrigger><SFAccordionContent>Body</SFAccordionContent></SFAccordionItem>"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE"
    ]
  },
  "SFAccordionTrigger": {
    "id": "SFAccordionTrigger",
    "name": "SFAccordionTrigger",
    "layer": "SIGNAL",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFACCORDION — TRIGGER BUTTON THAT EXPANDS/COLLAPSES THE ACCORDION ITEM.",
    "importPath": "signalframeux/animation",
    "importName": "SFAccordionTrigger",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFAccordionTrigger>Section One</SFAccordionTrigger>"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE"
    ]
  },
  "SFAccordionContent": {
    "id": "SFAccordionContent",
    "name": "SFAccordionContent",
    "layer": "SIGNAL",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFACCORDION — CONTENT REGION WITH GSAP STAGGER ANIMATION ON CHILD ELEMENTS.",
    "importPath": "signalframeux/animation",
    "importName": "SFAccordionContent",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFAccordionContent><p>First paragraph</p><p>Second paragraph</p></SFAccordionContent>"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE"
    ]
  },
  "SFProgress": {
    "id": "SFProgress",
    "name": "SFProgress",
    "layer": "SIGNAL",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SFPROGRESS -- SIGNAL LAYER PROGRESS BAR WITH GSAP FILL TWEEN. WRAPS RADIX PROGRESS DIRECTLY (NOT SHADCN BASE) TO GAIN REF ACCESS ON THE INDICATOR. GSAP IS THE SOLE ANIMATION DRIVER -- NO CSS TRANSITION-ALL. RESPECTS PREFERS-REDUCED-MOTION (INSTANT GSAP.SET).",
    "importPath": "signalframeux/animation",
    "importName": "SFProgress",
    "props": [
      {
        "name": "value",
        "type": "any",
        "default": "",
        "desc": "Progress percentage 0-100"
      },
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Additional classes on root"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFProgress value={60} />\n<SFProgress value={100} className=\"h-2\" />"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE"
    ]
  },
  "SFStatusDot": {
    "id": "SFStatusDot",
    "name": "SFStatusDot",
    "layer": "SIGNAL",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "PRESENCE INDICATOR -- FRAME LAYER STATUS PRIMITIVE. 8PX SQUARE, GSAP PULSE ON ACTIVE STATE. RESPECTS PREFERS-REDUCED-MOTION.",
    "importPath": "signalframeux/animation",
    "importName": "SFStatusDot",
    "props": [
      {
        "name": "status",
        "type": "any",
        "default": "",
        "desc": "Current state: \"active\" (pulsing green), \"idle\" (accent), \"offline\" (muted)"
      },
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Additional classes merged onto the dot element"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFStatusDot status=\"active\" />\n<SFStatusDot status=\"idle\" />\n<SFStatusDot status=\"offline\" />"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE"
    ]
  },
  "SFToaster": {
    "id": "SFToaster",
    "name": "SFToaster",
    "layer": "SIGNAL",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SFTOASTER — GLOBAL TOAST CONTAINER POSITIONED BOTTOM-LEFT AT Z-100. PLACE ONCE IN APP/LAYOUT.TSX AS A SIBLING TO {CHILDREN}. USES SONNER IN UNSTYLED MODE FOR FULL DU/TDR CONTROL. TOAST NOTIFICATIONS SLIDE IN FROM THE LEFT VIA GSAP, RESPECTING PREFERS-REDUCED-MOTION.",
    "importPath": "signalframeux/animation",
    "importName": "SFToaster",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "// In app/layout.tsx:\n<SFToaster />\n\n// Trigger from any client component:\nimport { sfToast } from \"@/components/sf\";\nsfToast.success(\"OPERATION COMPLETE\");"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE"
    ]
  },
  "sfToast": {
    "id": "sfToast",
    "name": "sfToast",
    "layer": "SIGNAL",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SFTOAST — IMPERATIVE TOAST API. TRIGGERS CUSTOM SONNER TOASTS RENDERED WITH SFTOASTCONTENT + GSAP SLIDE.",
    "importPath": "signalframeux/animation",
    "importName": "sfToast",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "sfToast.default(\"SYSTEM NOTICE\", { description: \"All systems nominal\" });\nsfToast.success(\"SAVED\");\nsfToast.error(\"CRITICAL FAILURE\");\nsfToast.warning(\"LOW SIGNAL\");\nsfToast.info(\"UPDATE AVAILABLE\");"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE"
    ]
  },
  "SFStepper": {
    "id": "SFStepper",
    "name": "SFStepper",
    "layer": "SIGNAL",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SFSTEPPER -- SIGNAL LAYER VERTICAL MULTI-STEP FLOW COMPONENT. RENDERS A VERTICAL SEQUENCE OF STEPS WITH SFPROGRESS CONNECTORS BETWEEN THEM. EACH STEP HAS A STATUS INDICATOR (SQUARE, NOT CIRCLE) AND OPTIONAL LABEL/DESCRIPTION. CONNECTORS USE ACTUAL SFPROGRESS INSTANCES FOR GSAP-DRIVEN FILL ANIMATION.",
    "importPath": "signalframeux/animation",
    "importName": "SFStepper",
    "props": [
      {
        "name": "activeStep",
        "type": "any",
        "default": "",
        "desc": "Zero-based index of the current active step"
      },
      {
        "name": "children",
        "type": "any",
        "default": "",
        "desc": "SFStep elements"
      },
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Additional classes on root container"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFStepper activeStep={1}>\n  <SFStep status=\"complete\" label=\"Account\" description=\"Create your account\" />\n  <SFStep status=\"active\" label=\"Profile\" description=\"Set up your profile\" />\n  <SFStep status=\"pending\" label=\"Review\" description=\"Review and submit\" />\n</SFStepper>\n\n<SFStepper activeStep={2}>\n  <SFStep status=\"complete\" label=\"Upload\" />\n  <SFStep status=\"error\" label=\"Validate\" description=\"3 errors found\" />\n  <SFStep status=\"pending\" label=\"Publish\" />\n</SFStepper>"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE"
    ]
  },
  "SFStep": {
    "id": "SFStep",
    "name": "SFStep",
    "layer": "SIGNAL",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFSTEPPER — INDIVIDUAL STEP WITH STATUS INDICATOR, LABEL, AND OPTIONAL DESCRIPTION.",
    "importPath": "signalframeux/animation",
    "importName": "SFStep",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFStep status=\"complete\" label=\"Account\" description=\"Create your account\" />"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE"
    ]
  },
  "SFEmptyState": {
    "id": "SFEmptyState",
    "name": "SFEmptyState",
    "layer": "SIGNAL",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "DESIGNED EMPTY STATE -- FRAME LAYER PLACEHOLDER WITH DU/TDR TENSION. BAYER DITHER BACKGROUND, MONOSPACE TEXT, OPTIONAL SCRAMBLETEXT SIGNAL TREATMENT.",
    "importPath": "signalframeux/animation",
    "importName": "SFEmptyState",
    "props": [
      {
        "name": "title",
        "type": "any",
        "default": "",
        "desc": "Primary message text displayed in monospace uppercase"
      },
      {
        "name": "scramble",
        "type": "any",
        "default": "",
        "desc": "When true, title renders inside ScrambleText for SIGNAL layer effect"
      },
      {
        "name": "action",
        "type": "any",
        "default": "",
        "desc": "Optional action slot (e.g., a button to retry or navigate)"
      },
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Additional classes merged onto the outer container"
      },
      {
        "name": "children",
        "type": "any",
        "default": "",
        "desc": "Optional description content rendered below the title"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFEmptyState title=\"NO DATA FOUND\" scramble>\n  <p>Try adjusting your filters.</p>\n</SFEmptyState>"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE"
    ]
  },
  "useNavReveal": {
    "id": "useNavReveal",
    "name": "useNavReveal",
    "layer": "HOOK",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "DRIVES NAV REVEAL VIA `DOCUMENT.BODY.DATASET.NAVVISIBLE`. CONTRACT (CONTEXT.MD SECTION VL -- NAV REVEAL PATTERN, LOCKED): - HOMEPAGE: PASS A REF TO THE ENTRY SECTION (`[DATA-ENTRY-SECTION]`). - SUBPAGES: PASS A REF TO THE PAGE <HEADER> ELEMENT (THE ONE WRAPPING THE H1). NAV APPEARS ONCE THE PAGE HEADER SCROLLS OUT OF VIEW. - `TRIGGERREF.CURRENT === NULL` IS A SAFETY FALLBACK ONLY (LOGS A DEV-MODE WARNING) -- SUBPAGES MUST PASS A REAL HEADER. DO NOT RELY ON THE NULL BRANCH. REDUCED MOTION: NAV VISIBLE IMMEDIATELY, NO SCROLLTRIGGER. THE NAV DOM ELEMENT MUST CARRY `SF-NAV-HIDDEN` AS ITS INITIAL CLASSNAME. THE CSS RULE IN APP/GLOBALS.CSS FLIPS VISIBILITY BASED ON `BODY[DATA-NAV-VISIBLE=\"TRUE\"]`.",
    "importPath": "signalframeux/animation",
    "importName": "useNavReveal",
    "props": [
      {
        "name": "triggerRef",
        "type": "any",
        "default": "",
        "desc": "Ref to the element whose scroll-out triggers nav reveal"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "const headerRef = useRef<HTMLElement>(null);\nuseNavReveal(headerRef);\nreturn <header ref={headerRef}><h1>Page Title</h1></header>;"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION WHERE APPLICABLE"
    ]
  },
  "registerSFEasings": {
    "id": "registerSFEasings",
    "name": "registerSFEasings",
    "layer": "SIGNAL",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SIGNALFRAMEUX CUSTOM GSAP EASINGS — SINGLE CANONICAL SOURCE. IMPORT FROM ANY GSAP-* ENTRY POINT THAT HAS CUSTOMEASE REGISTERED. REGISTERS `SF-SNAP` (STEPPED BOUNCE) AND `SF-PUNCH` (OVERSHOOT) EASINGS.",
    "importPath": "signalframeux/animation",
    "importName": "registerSFEasings",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "// Called automatically by gsap-plugins.ts, gsap-flip.ts, gsap-split.ts.\n// Manual use: import and call once at app init.\nregisterSFEasings();\ngsap.to(el, { x: 100, ease: \"sf-snap\", duration: 0.4 });"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE"
    ]
  },
  "initReducedMotion": {
    "id": "initReducedMotion",
    "name": "initReducedMotion",
    "layer": "SIGNAL",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "INITIALIZE REDUCED-MOTION HANDLING FOR GSAP. CALL ONCE FROM A CLIENT COMPONENT'S USEEFFECT — NOT AT MODULE SCOPE. RETURNS A CLEANUP FUNCTION THAT REMOVES THE MATCHMEDIA LISTENER.",
    "importPath": "signalframeux/animation",
    "importName": "initReducedMotion",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "useEffect(() => {\n  const cleanup = initReducedMotion();\n  return cleanup;\n}, []);"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE"
    ]
  },
  "SignalCanvas": {
    "id": "SignalCanvas",
    "name": "SignalCanvas",
    "layer": "SIGNAL",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "FULL-VIEWPORT WEBGL CANVAS SINGLETON — SIGNAL LAYER RENDERING SURFACE. MOUNTS A SINGLE SHARED THREE.JS WEBGLRENDERER CANVAS THAT ALL USESIGNALSCENE INSTANCES DRAW INTO. MUST BE MOUNTED ONCE AT APP ROOT (LAYOUT.TSX). LAZY-LOADED VIA SIGNAL-CANVAS-LAZY.TSX.",
    "importPath": "signalframeux/webgl",
    "importName": "SignalCanvas",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "// In app/layout.tsx:\nimport dynamic from 'next/dynamic';\nconst SignalCanvas = dynamic(() => import('signalframeux/webgl').then(m => ({ default: m.SignalCanvas })), { ssr: false });\n<SignalCanvas />"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE"
    ]
  },
  "useSignalScene": {
    "id": "useSignalScene",
    "name": "useSignalScene",
    "layer": "HOOK",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "REGISTER A THREE.JS SCENE WITH THE SIGNALCANVAS SINGLETON.",
    "importPath": "signalframeux/webgl",
    "importName": "useSignalScene",
    "props": [
      {
        "name": "elementRef",
        "type": "any",
        "default": "",
        "desc": "Ref to the DOM element that defines the scene's viewport rectangle"
      },
      {
        "name": "buildScene",
        "type": "any",
        "default": "",
        "desc": "Factory function called once on mount to create scene + camera"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "const containerRef = useRef<HTMLDivElement>(null);\nuseSignalScene(containerRef, () => ({\n  scene: new THREE.Scene(),\n  camera: new THREE.PerspectiveCamera(75, 1, 0.1, 100),\n}));\nreturn <div ref={containerRef} className=\"w-full h-64\" />;"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION WHERE APPLICABLE"
    ]
  },
  "resolveColorToken": {
    "id": "resolveColorToken",
    "name": "resolveColorToken",
    "layer": "SIGNAL",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "RESOLVE A CSS CUSTOM PROPERTY (OKLCH OR ANY FORMAT) TO SRGB VALUES. USES 1X1 CANVAS PROBE — ZERO BUNDLE COST, USES BROWSER'S OWN COLOR ENGINE.",
    "importPath": "signalframeux/webgl",
    "importName": "resolveColorToken",
    "props": [
      {
        "name": "cssVar",
        "type": "any",
        "default": "",
        "desc": "CSS custom property name including `--` prefix, e.g. `\"--color-primary\"`"
      },
      {
        "name": "options",
        "type": "any",
        "default": "",
        "desc": "Optional cache configuration. Omit to bypass cache (default)."
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "const { r, g, b } = resolveColorToken(\"--color-primary\");\nctx.fillStyle = `rgb(${r}, ${g}, ${b})`;"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE"
    ]
  }
};
