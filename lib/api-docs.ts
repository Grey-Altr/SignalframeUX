/**
 * API documentation data for all SignalframeUX components and utilities.
 * Each entry maps to a nav item in the API Explorer sidebar.
 *
 * AUTO-GENERATED — do not edit by hand.
 * Run: pnpm docs:generate
 * Source: scripts/generate-api-docs.ts
 * Generated: 2026-04-11T03:51:51.937Z
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
